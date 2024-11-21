class SkydiversScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(128,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'skydivers',
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
        const model = SkydiversScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['sky', 'mount'] }),
            init() {
                //
            }
        }), 1)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['clouds'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [100,150], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'clouds_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 2)

        this.close_clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(model, { renderOnly: ['close_clouds1', 'close_clouds2'] }),
            init() {
                let totalFrames = 300
                var lData = [
                    {
                        easingType: 'linear',
                        easingMethods: ['base', 'base'],
                        layerImg: PP.createImage(model, {renderOnly: ['close_clouds1']}),
                        totalFrames,
                        xShift: -5,
                        size: this.size,
                        startFrameIndex: 0
                    },
                    {
                        easingType: 'linear',
                        easingMethods: ['base', 'base'],
                        layerImg: PP.createImage(model, {renderOnly: ['close_clouds2']}),
                        totalFrames,
                        xShift: -5,
                        size: this.size,
                        startFrameIndex:  50,
                        delta: new V2(3,0)
                    },
                    // {
                    //     easingType: 'linear',
                    //     easingMethods: ['base', 'base'],
                    //     // easingType: 'quad',
                    //     // easingMethods: ['inOut', 'inOut'],
                    //     layerImg: PP.createImage(model, {renderOnly: ['test']}),
                    //     totalFrames,
                    //     xShift: -5,
                    //     size: this.size,
                    //     startFrameIndex:  50
                    // }
                ]

                lData.map(ld => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: animationHelpers.createShiftFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            // framesEndCallback: () => {
                            //     if(ld.startFrameIndex == 0) {
                            //         this.parent.parentScene.capturing.stop = true;
                            //     } 
                            // }
                        });
                    }
                })))
            }
        }), 3)

        this.persons = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, itemFrameslengthClamps, opacity, tailLength, size}) {
                let frames = [];
                
                let c = 'rgba(255,255,255,' + opacity + ')' 
    
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let x = getRandomInt(0, size.x);
                    let yValues = easing.fast({from: size.y + tailLength, to: 0, steps: totalFrames, type: 'linear', round: 0})
    
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yValues[f]
                        };
                    }
                
                    return {
                        x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(c).rect(itemData.x, itemData.frames[f].y-tailLength, 1, tailLength)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createAnimationFrames({framesCount, itemFrameslength = undefined, model, xClamps = [0,0], yClamps = [0,0], size, }) {
                let frames = [];
                
                if(itemFrameslength == undefined)
                    itemFrameslength = framesCount

                let framesIndexValues = [
                    ...easing.fast({from: 0, to: model.main.length-1, steps: fast.r(itemFrameslength/2), type: 'linear', round: 0}),
                    ...easing.fast({from: model.main.length-1, to: 0, steps: fast.r(itemFrameslength/2), type: 'linear', round: 0})
                ]

                let lentaFramesIndexValues = [
                    ...easing.fast({from: 0, to: model.main.length-1, steps: 10, type: 'linear', round: 0}),
                    ...easing.fast({from: model.main.length-1, to: 0, steps: 10, type: 'linear', round: 0})
                ]

                let xValues = [
                    ...easing.fast({from: xClamps[0], to: xClamps[1], steps: fast.r(itemFrameslength/2), type: 'linear', round: 0}),
                    ...easing.fast({from: xClamps[1], to: xClamps[0], steps: fast.r(itemFrameslength/2), type: 'linear', round: 0})
                ]

                let yValues = [
                    ...easing.fast({from: yClamps[0], to: yClamps[1], steps: fast.r(itemFrameslength/2), type: 'linear', round: 0}),
                    ...easing.fast({from: yClamps[1], to: yClamps[0], steps: fast.r(itemFrameslength/2), type: 'linear', round: 0})
                ]

                let itemsData = new Array(model.main[0].layers.length-1).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let fi = framesIndexValues[f];
                        if((i+1) == model.main[0].layers.length-1) {
                            fi = lentaFramesIndexValues[f%20]
                        }

                        frames[frameIndex] = {
                            frameIndex: fi,
                        };
                    }
                
                    return {
                        layerIndex: i+1,
                        frames
                    }
                })

                let mainLayer = model.main[0].layers.find(l => l.name == 'main');

                let cm = {
                    general: {
                        ...model.general,
                        animated: false,
                    },
                    main: {
                        layers: []
                    }
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        cm.main.layers = [mainLayer];
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                cm.main.layers.push(model.main[itemData.frames[f].frameIndex].layers[itemData.layerIndex]); 
                            }
                            
                        }

                        ctx.drawImage(PP.createImage(cm), xValues[f], yValues[f]);
                    });
                }
                
                return frames;
            },
            init() {

                this.farParticles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createParticlesFrames({ framesCount: 100, itemsCount: 20, itemFrameslengthClamps: [10,20], 
                            opacity: 0.1, tailLength: 20, size: this.size});
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createAnimationFrames({ framesCount: 100, model: SkydiversScene.models.p1, size: this.size, xClamps: [0,0], yClamps: [-2,2] });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createAnimationFrames({ framesCount: 100, model: SkydiversScene.models.p2, size: this.size, xClamps: [-1,1], yClamps: [0,0] });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createAnimationFrames({ framesCount: 100, model: SkydiversScene.models.p3, size: this.size, xClamps: [0,0], yClamps: [1,-1] });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p4 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createAnimationFrames({ framesCount: 100, model: SkydiversScene.models.p4, size: this.size, xClamps: [0,-1], yClamps: [0,0] });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.closeParticles = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.frames = this.parent.createParticlesFrames({ framesCount: 100, itemsCount: 10, itemFrameslengthClamps: [5,10], 
                //             opacity: 0.3, tailLength: 30, size: this.size});
                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 4)
    }
}