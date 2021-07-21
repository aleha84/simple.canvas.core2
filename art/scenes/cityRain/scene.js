class CityRainScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1080,1920).divide(2),//new V2(1080,1920),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'city_rain',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = CityRainScene.models.main;
        let layersData = {};
        let exclude = [
            'city_lights', 'cloud1', 'cloud2','cloud3', 'cloud4'
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

        this.cityLightsRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFallingFrames({framesCount, itemFrameslength, size, fallHeight, maxTailLenght}) {
                let frames = [];
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'city_lights'));
                
                let yChange = easing.fast({from: 0, to: fallHeight, steps: itemFrameslength, type: 'cubic', method: 'in', round: 0})
                let tailLengthChange = easing.fast({from: 1, to: maxTailLenght, steps: itemFrameslength, type: 'expo', method: 'in', round: 0})
                let widthChange = easing.fast({from: 1, to: 6, steps: 20, type: 'quad', method: 'out', round: 0})

                let splashData = [];

                let itemsData = pd.map((data) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let rgb = colors.colorTypeConverter({ value: data.color, fromType: 'hex', toType: 'rgb' });

                    let frames = [];
                    if(getRandomBool()) {

                        let targetY = 180 + getRandomInt(-2,2);

                        for(let f = 0; f < totalFrames; f++){
                            let y = yChange[f]
                            let py = data.point.y + y;
                            
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                            
                            if(py >= targetY) {
                                splashData.push({ x: data.point.x, y: targetY, startFrameIndex: frameIndex })
                                break;
                            }

                            frames[frameIndex] = {
                                color: data.color,
                                tailLength: tailLengthChange[f],
                                y
                            };
                        }
                    }
                    
                
                    return {
                        data,
                        frames
                    }
                })

                splashData = splashData.map((data) => {
                    let startFrameIndex = data.startFrameIndex;
                    let totalFrames = 10;
                    let frames = [];

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let width = widthChange[f];

                        frames[frameIndex] = {
                            width
                        };
                    }

                    return {
                        data,
                        frames
                    }
                });
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let x = itemData.data.point.x;

                                hlp.setFillColor(itemData.frames[f].color)
                                .rect(
                                    x, 
                                    itemData.data.point.y + itemData.frames[f].y, 1, 
                                    itemData.frames[f].tailLength)
                            }
                            else {
                                hlp.setFillColor(itemData.data.color).dot(itemData.data.point)
                            }
                            
                        }

                        for(let p = 0; p < splashData.length; p++){
                            let itemData = splashData[p];
                            
                            if(itemData.frames[f]){
                                let x = fast.r(itemData.data.x - itemData.frames[f].width/2);
                                let width = itemData.frames[f].width;

                                hlp.setFillColor('#1a2133').rect(x, itemData.data.y, width, 1)
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFallingFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, fallHeight: 120, maxTailLenght: 2, });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.city_lights.renderIndex+1)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames({ totalFrames, layerName, xShift }) {
                let frames = [];
                let img = PP.createImage(model, { renderOnly: [layerName] });
                let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                let aValues = [
                    ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'sin', method: 'out', round: 1}),
                    ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'sin', method: 'in', round: 1})
                ]

                this.mainFr = [];
                for(let f = 0; f < totalFrames; f++){
                    this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = aValues[f];
                        ctx.drawImage(img, xChange[f], 0);
                    })
                }

                let startFrameIndex = totalFrames/2;
                for(let f = 0; f < totalFrames; f++){

                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (totalFrames-1)){
                        frameIndex-=totalFrames;
                    }

                    frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mainFr[frameIndex], 0, 0);
                        ctx.drawImage(this.mainFr[f], 0, 0);
                    })
                }

                return frames;
            },
            init() {
                var lData = [{
                    layerName: 'cloud1',
                    totalFrames: 300,
                    xShift: -5,
                    startFrameIndex: 0
                },{
                    layerName: 'cloud2',
                    totalFrames: 300,
                    xShift: -5,
                    startFrameIndex: 100
                },{
                    layerName: 'cloud3',
                    totalFrames: 300,
                    xShift: -5,
                    startFrameIndex: 200
                },{
                    layerName: 'cloud4',
                    totalFrames: 300,
                    xShift: -5,
                    startFrameIndex: 50
                }]

                lData.map(ld => this.addChild(new GO({
                    position: new V2().add(ld.translate ? ld.translate : new V2()),
                    size: this.size,
                    frames: this.createFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            framesEndCallback: () => {
                                if(ld.startFrameIndex == 0) {
                                    // this.parent.parentScene.capturing.stop = true;
                                }
                                
                            }
                        });
                    }
                })))
            }
        }), layersData.cloud1.renderIndex)  

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarsFrames({framesCount, itemsCount, itemFrameslength, size, yClamps}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(yClamps);
                    let maxA = fast.r(getRandom(0.1,0.4),2);

                    let aValues = [
                        ...easing.fast({ from: 0, to: maxA, steps: totalFrames/2, type: 'quad', method: 'inOut'}),
                        ...easing.fast({ from: maxA, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut'})
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f]
                        };
                    }
                
                    return {
                        x,y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.x, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let shape = PP.createImage(model, { renderOnly: ['main_shape'] });
                this.frames = this.createStarsFrames({ framesCount: 300, itemsCount: 100, itemFrameslength: 250, size: this.size, yClamps: [0, 50] }).map(frame => 
                    createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(frame, 0,0)
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(shape, 0,0)
                    }))
                this.registerFramesDefaultTimer({});
            }
        }), layersData.main_shape.renderIndex+1)
    }
}