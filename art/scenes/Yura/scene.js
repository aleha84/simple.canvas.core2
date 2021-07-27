class YuraScene extends Scene {
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
                size: new V2(1330,2000).divide(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'yura',
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
        let model = YuraScene.models.main;
        let layersData = {};
        let exclude = [
            'rocket_1', 'statue_p'
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

        this.statue_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'statue_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.statue.renderIndex+1)

        let circleImages = {};
        let cColors = ['#010101', '#4d1107', '#98200C', '#b55032', '#F9985A', '#e9b782']
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 30; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        this.rocket = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFlyFrames({framesCount, startFrame = 0, flyFrames, itemFrameslength, size, xClamps, yClamps}) {
                let frames = new Array(framesCount);
                let rocketImg = PP.createImage(model, {renderOnly: ['rocket_1']});
                let flameFrames = PP.createImage(YuraScene.models.flameAnimation);
                let yValues = easing.fast({ from: yClamps[0], to: yClamps[1], steps: flyFrames, type: 'linear', method: 'base', round: 0});

                let itemsData = [];

                let flameFrameChange = 60;
                let flameFrameIndicies = [
                    ...easing.fast({from: 1, to: flameFrames.length-1, steps: flameFrameChange/2, type: 'linear', round: 0}),
                    ...easing.fast({from: flameFrames.length-1, to: 1, steps: flameFrameChange/2, type: 'linear', round: 0})
                ]
                let yShift = 148;

                for(let i = 0; i < flyFrames; i++) {
                    let x = getRandomInt(xClamps);
                    let y = yShift + yValues[i];
                    let frameLength = getRandomInt(5, 20);
                    let frames = [];
                    for(let f = 0; f < frameLength; f++){
                        let frameIndex = f;
                        
                        frames[i + frameIndex] = true;
                    }
                    itemsData[itemsData.length] = {
                        x, y, 
                        frames
                    }
                }
                
                let flameFrameIndex = 45

                for(let f = 0; f < flyFrames; f++){
                    frames[f + startFrame] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('#d88f6c').dot(itemData.x, itemData.y)
                            }
                        }

                        ctx.drawImage(rocketImg, 0, yValues[f])

                        
                        ctx.drawImage(flameFrames[flameFrameIndicies[flameFrameIndex]], 0, yValues[f])

                        flameFrameIndex++;
                        if(flameFrameIndex == flameFrameChange) {
                            flameFrameIndex = 0;
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFlyFrames({ framesCount: 600, startFrame: 120, flyFrames: 180, itemFrameslength: 10, size: this.size, xClamps: [103, 105], yClamps: [50, -200] })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+3)

        this.clouds1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let tf = 600;
                let params = [
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#b55032', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [3,7], sizeClamps: [10,16], 
                            initialProps: {
                                line: true, p1: new V2(140, 145), p2: new V2(42, 163)
                            }, yShiftClamps: [-1,-3],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#b55032', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [3,7], sizeClamps: [10,16], 
                            initialProps: {
                                line: true, p1: new V2(71, 162), p2: new V2(-10, 138)
                            }, yShiftClamps: [-1,-3],
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+2)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let tf = 600;
                let params = [
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#F9985A', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [4,7], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(60, -15), p2: new V2(-10, 5)
                            }, yShiftClamps: [-1,-2],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#e9b782', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [4,7], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(140, -20), p2: new V2(45, -15)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#e9b782', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [4,7], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(45, -15), p2: new V2(-10, -5)
                            }, yShiftClamps: [-1,-4],
                    },


                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#e9b782', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [3,5], sizeClamps: [10,14], 
                    //         initialProps: {
                    //             line: true, p1: new V2(102, 147), p2: new V2(-10, 125)
                    //         }, yShiftClamps: [-1,-2],
                    // },
                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#F9985A', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [3,5], sizeClamps: [12,16], 
                    //         initialProps: {
                    //             line: true, p1: new V2(140, 130), p2: new V2(60, 150)
                    //         }, yShiftClamps: [-1,-2],
                    // },
                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#F9985A', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [3,5], sizeClamps: [12,16], 
                    //         initialProps: {
                    //             line: true, p1: new V2(85, 155), p2: new V2(-10, 135)
                    //         }, yShiftClamps: [-1,-2],
                    // },

                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#b55032', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [3,7], sizeClamps: [10,16], 
                    //         initialProps: {
                    //             line: true, p1: new V2(140, 145), p2: new V2(42, 163)
                    //         }, yShiftClamps: [-1,-3],
                    // },
                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#b55032', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [3,7], sizeClamps: [10,16], 
                    //         initialProps: {
                    //             line: true, p1: new V2(71, 162), p2: new V2(-10, 138)
                    //         }, yShiftClamps: [-1,-3],
                    // },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: '#98200C', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [4,8], sizeClamps: [8,14], 
                            initialProps: {
                                line: true, p1: new V2(133, 160), p2: new V2(47, 170)
                            }, yShiftClamps: [-1,-4],
                            createPoligon:{
                                cornerPoints: [
                                   new V2({x: 132, y: 166}),
 new V2({x: 49, y: 178}),
 new V2({x: 51, y: 198}),
 new V2({x: 132, y: 198})
                                ]
                            }
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#98200C', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [4,8], sizeClamps: [8,14], 
                            initialProps: {
                                line: true, p1: new V2(44, 171), p2: new V2(-10, 148)
                            }, yShiftClamps: [-1,-4],
                            createPoligon:{
                                cornerPoints: [
    new V2({x: 42.708333333333336, y: 175.625}).toInt(),
    new V2({x: 0.4166666666666667, y: 167.70833333333334}).toInt(),
    new V2({x: 0.4166666666666667, y: 198.75}).toInt(),
    new V2({x: 40.208333333333336, y: 198.75}).toInt(),
                                ]
                            }
                    },

                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(110, 186), p2: new V2(72, 191)
                            }, yShiftClamps: [-1,-4],
                    },

                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 20, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(31, 180), p2: new V2(14, 176)
                            }, yShiftClamps: [-1,-4],
                    },

                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#4d1107', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [5,9], sizeClamps: [7,12], 
                            initialProps: {
                                line: true, p1: new V2(140, 144), p2: new V2(90, 205)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#4d1107', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [5,9], sizeClamps: [7,12], 
                            initialProps: {
                                line: true, p1: new V2(106, 199), p2: new V2(48, 185)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#4d1107', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [5,9], sizeClamps: [7,12], 
                            initialProps: {
                                line: true, p1: new V2(30, 200), p2: new V2(-20, 150)
                            }, yShiftClamps: [-1,-4],
                    },
                    // {
                    //     opacity: 1,
                    //     framesCount: tf, itemsCount: 20, itemFrameslength: tf, color: '#4d1107', size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [5,9], sizeClamps: [7,12], 
                    //         initialProps: {
                    //             line: true, p1: new V2(-15, 130), p2: new V2(-15, 100)
                    //         }, yShiftClamps: [-1,-4],
                    // },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(132, 177), p2: new V2(111, 199)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(76, 202), p2: new V2(44, 193)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(44, 193), p2: new V2(-10, 205)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#010101', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(15, 200), p2: new V2(-10, 170)
                            }, yShiftClamps: [-1,-4],
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        //this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+4)
    }
}