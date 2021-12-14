class CityViewScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'CityView',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = CityViewScene.models.main;
        let layersData = {};
        let exclude = [
            'clouds1', 'clouds2', 'city_p'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        let totalFrames = 300;

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.clouds1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['clouds1'] } );
                        this.frames = [];
                        let xChange = easing.fast({from: 0, to: 40, steps: totalFrames*2, type: 'linear', round: 0})

                        for(let f = 0; f < totalFrames*2; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let xShift = xChange[f];
                                ctx.drawImage(img, -xShift, 0)
                                ctx.drawImage(img, -xShift + size.x, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.clouds2 = this.addChild(new GO({
                    position: new V2(0,-20),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['clouds2'] } );
                        this.frames = [];
                        let xChange = easing.fast({from: 0, to: 100, steps: totalFrames*2, type: 'linear', round: 0})

                        for(let f = 0; f < totalFrames*2; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let xShift = xChange[f];
                                ctx.drawImage(img, -xShift, 0)
                                ctx.drawImage(img, -xShift + size.x, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.sky.renderIndex+1)

        this.curtains = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-40,-10)),
            size: new V2(300,300),
            init() {
                this.frames = PP.createImage(CityViewScene.models.curtainsFrames)
                //.filter((el, i) => i > 5 && i < 15)
                .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.2
                    ctx.translate(size.x, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(f, 0, 0);
                }))

                let framesIndicies = easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', round: 0})

                this.currentFrame = 0;
                this.img = this.frames[framesIndicies[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == framesIndicies.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[framesIndicies[this.currentFrame]];
                })
            }
        }), layersData.window.renderIndex+1)

        let createRainFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, lengthClamps, angleClamps, xCLamps, upperYClamps, lowerY, color}) {
            let frames = [];
            let sharedPP = PP.createNonDrawingInstance();
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let p1 = new V2(
                    getRandomInt(xCLamps),
                    getRandomInt(upperYClamps)
                )

                let bottomLine = createLine(new V2(-size.x*3, lowerY), new V2(size.x*4, lowerY));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let p2 = raySegmentIntersectionVector2(p1, direction, bottomLine);

                let linePoints = sharedPP.lineV2(p1, p2);
                let lineIndexChange = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});
                let len = getRandomInt(lengthClamps);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: lineIndexChange[f],
                    };
                }
            
                return {
                    len,
                    linePoints,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            for(let i = 0; i < itemData.len; i++) {
                                let _index = index - i;
                                if(_index < 0)
                                    break;

                                let p = itemData.linePoints[_index];
                                hlp.setFillColor(color).dot(p);
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createRainFrames({ framesCount: totalFrames, itemsCount: 30, itemFrameslengthClamps: [10, 15], size: this.size,
                    lengthClamps: [30,55], angleClamps: [10,15], xCLamps: [0, this.size.x+50], upperYClamps: [-30, -5], lowerY: this.size.y+10,
                    color: `#4c72a0`
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.window.renderIndex-2)

        this.rainDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDropsFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let _colors = ['#5e8ab8',' #3f638f', '#31547d', '#21395a']
                let sharedPP = PP.createNonDrawingInstance();

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);

                    let p = new V2(getRandomBool() ? getRandomInt(0, 59) : getRandomInt(149, 199), getRandomInt(0, size.y));
                    let c = _colors[getRandomInt(0, _colors.length-1)]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            visible: true
                        };
                    }

                    let res = {
                        p, c,
                        frames
                    };

                    if(getRandomInt(0,3) == 0) {
                        let direction = V2.down.rotate(getRandom(10,15));
                        let p2 = p.add(direction.mul(getRandomInt(2,3)));
                        let linePoints = sharedPP.lineV2(p, p2);
                        res.linePoints = linePoints;
                    }
                   

                    return res
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){

                                if(itemData.linePoints) {
                                    itemData.linePoints.forEach(p => {
                                        if(p.x < 59 || p.x > 149)
                                            hlp.setFillColor(itemData.c).dot(p);
                                    });
                                }
                                else {
                                    hlp.setFillColor(itemData.c).dot(itemData.p);
                                }

                                // hlp.setFillColor('').rect(itemData.p.x, itemData.p.y, 2,2);
                                // hlp.setFillColor().rect(itemData.p.x, itemData.p.y, 2,1);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createDropsFrames({ framesCount: totalFrames, itemsCount: 200, itemFrameslengthClamps: [80, 120], size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.window.renderIndex-1)
        
        this.city_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames*2, itemFrameslength: [160, 220], size: this.size,
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'city_p'))
                     })

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.close.renderIndex+1)
    }
}