class CarSnowScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 7,
                size: new V2(1200,1200),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'carSnow'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = CarSnowScene.models.main;
        let layersData = {};
        let exclude = [
            'car_side_mask', 'frontal_p', 'back_p', 'car_p', 'snow_p', 'w_1', 'tree_p', 'house_p'
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

        this.createSnowFrames = function({framesCount, itemsCount, itemFrameslength, size, xClamps, yClamps, color, angleClamps, center, radius, lowerYClamp, mirrorData}) {
            let frames = [];
            let sharedPP = undefined;
            let bottomLine = createLine(new V2(-size.x, size.y), new V2(size.x*2, size.y));
            let rgb = colors.colorTypeConverter({value: color, toType:'rgb'})

            if(mirrorData) {
                mirrorData.rgb = colors.colorTypeConverter({value: mirrorData.color, toType:'rgb'})
            }

            if(!lowerYClamp)
                lowerYClamp = [size.y, size.y];

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength/2, itemFrameslength);
            
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                let linePoints = sharedPP.lineV2(point1, point2);
                let linePointsIndices = easing.fast({ from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});

                let aValues = easing.fast({from: 1, to: 0, steps: radius, type: 'quad', method: 'in', round: 2});
                let lowerY = getRandomInt(lowerYClamp[0], lowerYClamp[1]);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndices[f]];
                    let dist = fast.r(new V2(p).distance(center));
                    let a = dist >= radius ? 0 : aValues[dist]
            
                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    mirrored: getRandomBool(),
                    lowerY,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                let mirrorHlp;
                if(mirrorData) {
                    mirrorData.frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        mirrorHlp = hlp;
                    });
                }

                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];

                        if(itemData.frames[f]){
                            let {p, a} = itemData.frames[f];

                            if(p.y > itemData.lowerY)
                                continue;

                            rgb.a = a;
                            hlp.setFillColor(colors.rgbToString({value: rgb, isObject: true})).dot(p);

                            if(mirrorHlp && itemData.mirrored){
                                if(p.x > mirrorData.xBoundary){
                                    let flipped = flipX(p, mirrorData.xBoundary);

                                    let d = flipped.x - mirrorData.xBoundary;
                                    let dnew = fast.r(d*0.5);
                                    flipped.x = mirrorData.xBoundary+dnew;

                                    mirrorData.rgb.a = a/2;
                                    mirrorHlp.setFillColor(colors.rgbToString({value: mirrorData.rgb, isObject: true})).dot(flipped);
                                } 
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }
        let mirrorFrames = [];
        let mirrorMask = PP.createImage(model, { renderOnly: ['car_side_mask'] });

        this.backSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 200, itemFrameslength: 250, size: this.size, 
                    xClamps: [130, 175], yClamps: [110, 130], angleClamps: [-20,20], color: '#b5d0c3',
                    center: new V2(150,133), radius: 25, lowerYClamp: [143,148],
                    mirrorData: {
                        frames: mirrorFrames,
                        xBoundary: 140,
                        color: '#3f7e71',
                    }
                    });

                this.addChild(new GO({
                    position: new V2(0, 3),//new V2(40,10),
                    size: this.size,
                    frames: frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.car.renderIndex-1)

        // this.backSnow2 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {

        //         let frames = this.parentScene.createSnowFrames({
        //             framesCount: 300, itemsCount: 50, itemFrameslength: 300, size: this.size, 
        //             xClamps: [120, 210], yClamps: [90, 100], angleClamps: [-20,20], color: '#42828c',
        //             center: new V2(170,130), radius: 35, lowerYClamp: [135,140]
        //             });

        //         this.addChild(new GO({
        //             position: new V2(0, 3),//new V2(40,10),
        //             size: this.size,
        //             frames: frames,
        //             init() {
        //                 this.registerFramesDefaultTimer({});
        //             }
        //         }))
        //     }
        // }), layersData.car.renderIndex-2)

        this.frontalSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 200, itemFrameslength: 250, size: this.size, 
                    xClamps: [80, 130], yClamps: [90, 110], angleClamps: [-20,20], color: '#f4160e',
                    center: new V2(105,125), radius: 20
                    });

                this.addChild(new GO({
                    position: new V2(-5, 5),
                    size: this.size,
                    frames: frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(-50, 5),
                    size: this.size,
                    frames: frames,
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(0),
                    size: this.size,
                    frames: this.parentScene.createSnowFrames({
                        framesCount: 300, itemsCount: 100, itemFrameslength: 250, size: this.size, 
                        xClamps: [70, 100], yClamps: [105, 110], angleClamps: [-20,20], color: '#f4160e',
                        center: new V2(84,116), radius: 8, lowerYClamp: [117,119]
                        }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: mirrorFrames,
                    init() {
                        this.frames = this.frames.map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(mirrorMask, 0,0);

                            ctx.globalCompositeOperation = 'source-in';

                            ctx.drawImage(frame, 0,0);
                        }))
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.car.renderIndex+5)

        this.frontal_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'frontal_p')) });
    
                let repeat = 4;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });
            }
        }), layersData.trees_d2.renderIndex+1)

        this.back_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'back_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.snow.renderIndex+1)

        this.car_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'car_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex+1)

        this.snow_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'snow_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.snow_d.renderIndex+1)

        this.house_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'house_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.house.renderIndex+1)

        this.wAni1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let w1points = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'w_1'));
                let frames = [
                    createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                        let c = 'rgba(255,255,255,0.05)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                        let c = 'rgba(0,0,0,0.1)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    undefined
                ]

                let frameChangeDelay = getRandomInt(5,10) ;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = getRandomInt(5,10);
                
                    this.img = frames[getRandomInt(0, frames.length-1)]
                    this.currentFrame++;
                    if(this.currentFrame == frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), layersData.house.renderIndex+1)
    }
}