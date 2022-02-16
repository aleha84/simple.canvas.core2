class LastTreeScene extends Scene {
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
                fileNamePrefix: 'lastTree',
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
        let model = LastTreeScene.models.main;
        let layersData = {};
        let exclude = [
            'farCloudsOverlay', 'sea_p', 'tree_p', 'far_clouds1', 'far_clouds2', 'far_clouds3', 'far_clouds_p'
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
            
            console.log(`${layerName} - renderIndex`)
        }

        let totalFrames = 300

        let circleImages = {};

        let farCloudsColors = {
            c1: '#865B5D',
            c2_bright: '#DFA282',
            с3_dark: '#514257'
        }

        let frontalCloudsColors = {
            c1: '#585769'
        }

        let midCloudsColors = {
            c1_bright: '#D39C85',
            c2_dark: '#837071',
            c3_dark: '#63505F'
        }

        let cColors = [
            farCloudsColors.c1, farCloudsColors.c2_bright, 
            farCloudsColors.с3_dark, frontalCloudsColors.c1, 
            midCloudsColors.c1_bright, midCloudsColors.c2_dark, midCloudsColors.c3_dark]
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 20; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        let renderRules = {
            far: true,
            frontal: true,
            mid: true,
            ripples: true
        }

        if(renderRules.far) {
            this.farClouds1 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let farCloudsOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        pp.fillByCornerPoints([new V2(140,164), new V2(166,163), new V2(166,180), new V2(140, 180)])
                    })

                    let farCloudsParams = [
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 30, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-90, -120], distanceClamps: [-3,-7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(150, 149), p2: new V2(135, 144)
                                }, yShiftClamps: [1,3],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 30, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-10, 10], distanceClamps: [3,7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(151, 163), p2: new V2(149, 150)
                                }, xShiftClamps: [1,3],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 30, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-90, -120], distanceClamps: [-3,-7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(140, 147), p2: new V2(130, 145)
                                }, yShiftClamps: [1,3],
                        },
                    ]

                    let itemsFrames = farCloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(farCloudsOverlay,0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.back_rock.renderIndex-1)

            this.farClouds2 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let farCloudsOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        pp.fillByCornerPoints([new V2(130,170), new V2(146,165), new V2(146,175), new V2(130, 175)])
                    })

                    let darkOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let xClamps = [121, 77];
                        let steps = xClamps[0] - xClamps[1];
                        let aValues = easing.fast({from: 0, to: 0.9, steps, type: 'linear', round: 2})
                        for(let x = 0; x < steps; x++) {
                            hlp.setFillColor('rgba(91,61,79,' + aValues[x] + ')').rect(xClamps[0]-x, 0, 1, size.y);
                        }
                    })

                    let farCloudsParams = [
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 70, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-90, -60], distanceClamps: [-3,-7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(122, 142), p2: new V2(85, 125)
                                }, yShiftClamps: [2,4],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 70, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-90, -60], distanceClamps: [-3,-7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(122, 142), p2: new V2(80, 131)
                                }, yShiftClamps: [2,4],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 30, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-90, -60], distanceClamps: [-3,-7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(135, 153), p2: new V2(122, 142)
                                }, yShiftClamps: [1,3],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 30, itemFrameslength: totalFrames, color: farCloudsColors.c2_bright, size: this.size,
                                directionAngleClamps: [-10, 10], distanceClamps: [3,7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.c1, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(135, 167), p2: new V2(135, 153)
                                }, xShiftClamps: [1,3],
                        },
                        
                    ]

                    let itemsFrames = farCloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'source-atop';
                            ctx.drawImage(darkOverlay, 0,0);

                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(farCloudsOverlay,0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.back_rock.renderIndex+1)

            this.farClouds3 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let farCloudsOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        pp.fillByCornerPoints([new V2(108,172), new V2(124,171), new V2(124,178), new V2(108, 178)])
                    })

                    let farCloudsParams = [

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: farCloudsColors.c1, size: this.size,
                                directionAngleClamps: [-10, 10], distanceClamps: [3,7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.с3_dark, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(116, 170), p2: new V2(112, 159)
                                }, xShiftClamps: [1,3],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: farCloudsColors.c1, size: this.size,
                                directionAngleClamps: [-10, 10], distanceClamps: [3,7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.с3_dark, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(110, 170), p2: new V2(104, 159)
                                }, xShiftClamps: [1,3],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: farCloudsColors.c1, size: this.size,
                                directionAngleClamps: [-90, -60], distanceClamps: [4,7], sizeClamps: [2,4], 
                                sec: {color: farCloudsColors.с3_dark, sDecrClamps: [0,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(103, 155), p2: new V2(85, 155)
                                }, yShiftClamps: [-1,-3],
                        },
                        
                    ]

                    let itemsFrames = farCloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(farCloudsOverlay,0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.back_rock2.renderIndex+1)
        }

        if(renderRules.frontal) {
            this.frontalClouds1 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let cloudsParams = [
                        
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: frontalCloudsColors.c1, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [3,5], 
                                initialProps: {
                                    line: true, p1: new V2(26, 197), p2: new V2(-10, 188)
                                }, yShiftClamps: [-2,-4],
                        },
                        
                    ]

                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
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
            }), layersData.frontal_rock3.renderIndex-1)

            this.frontalClouds2 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let cloudsExcludeOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        pp.fillByCornerPoints([new V2(20,180), new V2(36,177), new V2(43,177), new V2(52,180), new V2(60,180), new V2(75,181), new V2(75,200), new V2(20,200)])
                    })

                    let brightOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let xClamps = [27, 64];
                        let steps = xClamps[1] - xClamps[0];
                        let aValues = easing.fast({from: 0, to: 0.9, steps, type: 'linear', round: 2})
                        for(let x = 0; x < steps; x++) {
                            hlp.setFillColor('rgba(236,73,56,' + aValues[x] + ')').rect(xClamps[0]+x, 0, 1, size.y);
                        }
                    })

                    let darkOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let xClamps = [0, 20];
                        let steps = xClamps[1] - xClamps[0];
                        let aValues = easing.fast({from: 0.7, to: 0, steps, type: 'linear', round: 2})
                        for(let x = 0; x < steps; x++) {
                            hlp.setFillColor('rgba(31,30,52,' + aValues[x] + ')').rect(xClamps[0]+x, 0, 1, size.y);
                        }
                    })


                    let cloudsParams = [
                        
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: frontalCloudsColors.c1, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [3,5], 
                                initialProps: {
                                    line: true, p1: new V2(55, 178), p2: new V2(-10, 168)
                                }, yShiftClamps: [-2,-4],
                        },
                        
                    ]

                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'source-atop';
                            ctx.drawImage(brightOverlay, 0,0);
                            ctx.drawImage(darkOverlay, 0,0);

                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(cloudsExcludeOverlay,0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.frontal_rock.renderIndex+1)
        }

        if(renderRules.mid) {
            this.midClouds1 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let darkOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let xClamps = [0, 30];
                        let steps = xClamps[1] - xClamps[0];
                        let aValues = easing.fast({from: 0.7, to: 0, steps, type: 'linear', round: 2})
                        for(let x = 0; x < steps; x++) {
                            hlp.setFillColor('rgba(19,19,38,' + aValues[x] + ')').rect(xClamps[0]+x, 0, 1, size.y);
                        }
                    })

                    let cloudsParams = [
                        
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 70, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [4,6], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(29, 147), p2: new V2(-10, 136)
                                }, yShiftClamps: [-2,-4],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 70, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(54, 165), p2: new V2(27, 142)
                                }, yShiftClamps: [-2,-4],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(70, 170), p2: new V2(54, 165)
                                }, yShiftClamps: [-2,-4],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-10, 10], distanceClamps: [-5,-10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(70, 190), p2: new V2(70, 170)
                                }, xShiftClamps: [-2,-4],
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-60, -90], distanceClamps: [5,10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(100, 210), p2: new V2(70, 190)
                                }, yShiftClamps: [-2,-4],
                        },
                        
                    ]

                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'source-atop';
                            ctx.drawImage(darkOverlay, 0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.mid_roсk.renderIndex+1)

            this.midClouds1 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {

                    let brightOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                        let xClamps = [44,85];
                        let steps = xClamps[1] - xClamps[0];
                        let aValues = easing.fast({from: 0.7, to: 0, steps, type: 'linear', round: 2})
                        for(let x = 0; x < steps; x++) {
                            hlp.setFillColor('rgba(236,73,56,' + aValues[x] + ')').rect(xClamps[0]+x, 0, 1, size.y);
                        }
                    })

                    let cloudsParams = [
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 80, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-40, -10], distanceClamps: [-5,-10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(90, 159), p2: new V2(68, 130)
                                }, xShiftClamps: [-2,-4],
                                
                        }, 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 60, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-40, -20], distanceClamps: [-5,-10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(117, 174), p2: new V2(100, 159)
                                }, xShiftClamps: [-2,-4],
                        },  
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 60, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-20, -10], distanceClamps: [-5,-10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(126, 199), p2: new V2(123, 174)
                                }, xShiftClamps: [-2,-4],
                                createPoligon: {
                                    cornerPoints :[new V2({x: 77, y: 145}),new V2({x: 91, y: 164}),new V2({x: 120, y: 176}),
                                    new V2({x: 132, y: 199}),new V2({x: 37, y: 199}),new V2({x: 41, y: 135}),
                                    ],
                                    position: 'after',
                                    color: midCloudsColors.c2_dark
                                }
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 80, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                            directionAngleClamps: [-90, -60], distanceClamps: [5,10], sizeClamps: [3,5], 
                            sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(104, 180), p2: new V2(82, 164)
                            }, yShiftClamps: [-2,-4],
                            createPoligon: {
                                cornerPoints: [new V2({x: 79, y: 160}),new V2({x: 60, y: 161}),new V2({x: 77, y: 193}),new V2({x: 118, y: 192}),new V2({x: 107, y: 181}),
                                ],
                                color: midCloudsColors.c2_dark,
                                position: 'after'
                            }
                                
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 80, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                                directionAngleClamps: [-90, -60], distanceClamps: [5,10], sizeClamps: [3,5], 
                                sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                                initialProps: {
                                    line: true, p1: new V2(122, 210), p2: new V2(100, 186)
                                }, yShiftClamps: [-2,-4],
                                createPoligon: {
                                    cornerPoints: [new V2({x: 98, y: 184}),new V2({x: 66, y: 183}),new V2({x: 66, y: 198}),new V2({x: 107, y: 198}),
                                    ],
                                    color: midCloudsColors.c2_dark,
                                    position: 'after'
                                }
                                
                        },

                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: midCloudsColors.c1_bright, size: this.size,
                            directionAngleClamps: [-90, -60], distanceClamps: [5,10], sizeClamps: [3,5], 
                            sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,0], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(30, 100), p2: new V2(-10, 82)
                            }, yShiftClamps: [-2,-4],
                                
                        },
                    ]

                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            opacity: p.opacity,
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })

                    this.frames = [];
                    for(let f =0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 1;
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.globalAlpha = itemsFrames[i].opacity;
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }

                            ctx.globalAlpha = 1;

                            ctx.globalCompositeOperation = 'source-atop';
                            ctx.drawImage(brightOverlay, 0,0);
                        })
                    }

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.mid_roсk.renderIndex-1)

            
        }

        if(renderRules.ripples) {
            this.ripples = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                createRippleFrames({framesCount, itemsCount, itemFrameslengthClamps, size, pointsData}) {
                    let frames = [];
                    
                    let upperY = 157;
                    let lowerY = size.y;
                    
                    let height = lowerY-upperY;

                    let pixels = getPixelsAsMatrix(this.parentScene.sea.img, this.size);

                    let minWidthToYValues = easing.fast({ from: 1, to: 4, steps: height, type: 'linear', round: 0});
                    let maxWidthToYValues = easing.fast({ from: 2, to: 7, steps: height, type: 'linear', round: 0});
                    let inittialXShiftValues = easing.fast({ from: 1, to: 4, steps: height, type: 'linear', round: 0});
                    let xChangeToYValues = easing.fast({ from: 2, to: 6, steps: height, type: 'linear', round: 0});

                    let itemsData = [];

                    let createItemData = function(x,y, current) {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = getRandomInt(itemFrameslengthClamps);

                        let type = getRandomInt(0,3);
                        let relativeHeight = y-upperY;

                        let fromWidth = undefined;
                        let targetWidth = undefined;
                        let widthValues = undefined;

                        if(type == 0 || type == 2) {
                            fromWidth = 0;
                            targetWidth = getRandomInt(minWidthToYValues[relativeHeight], maxWidthToYValues[relativeHeight]);
                        }

                        if(type == 1 || type == 3) {
                            fromWidth = getRandomInt(minWidthToYValues[relativeHeight], maxWidthToYValues[relativeHeight]);
                            targetWidth = 0;
                        }

                        let xChangeValues = undefined;

                        if(type == 2 || type == 3) {
                            let targetXChange = xChangeToYValues[relativeHeight]*(getRandomBool() ? 1 : -1);
                            xChangeValues = easing.fast({from: 0, to: targetXChange, steps: totalFrames, type: 'linear'})
                        }

                        let inittialXShift = getRandomInt(-inittialXShiftValues[relativeHeight], inittialXShiftValues[relativeHeight]);

                        widthValues = easing.fast({from: fromWidth, to: targetWidth, steps: totalFrames, type: 'quad', method: 'inOut'})

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                width: widthValues[f],
                                xChange: xChangeValues ? xChangeValues[f] : 0,
                            };
                        }

                        return {
                            color: `rgba(${current[0]}, ${current[1]},${current[2]},1)`,
                            p: {x: x + inittialXShift, y},
                            frames
                        };
                    }


                    // let prev = undefined;
                    // for(let y = 0; y < pixels.length; y++) {
                    //     if(y < upperY) 
                    //         continue; 

                    //     prev = undefined;
                    //     for(let x = 0; x < pixels[y].length; x++) {
                    //         let current = pixels[y][x];

                    //         if(current == undefined)
                    //             continue;

                    //         if(prev == undefined && current != undefined) {
                    //             prev = current;
                    //             continue;
                    //         }

                    //         if(current[0] != prev[0] && current[1] != prev[1] && current[2] != prev[2]) {

                    //             // if(getRandomInt(0, 2) < 1)
                    //             //     continue;

                    //             itemsData.push(createItemData(x,y,current));
                    //         }
                    //     }
                    // }

                    // for(let i = 0; i < 20; i++) {
                    //     itemsData.push(createItemData(59 + getRandomInt(-4,4),141 + getRandomInt(-1,1),[71, 90, 124]));
                    // }

                    // for(let i = 0; i < 5; i++) {
                    //     itemsData.push(createItemData(60 + getRandomInt(-5,5),146 + getRandomInt(0,1),[89, 103, 126]));
                    // }

                    let hexRgbMap = {};

                    pointsData.forEach(pd => {

                        let rgb = hexRgbMap[pd.color];
                        if(!rgb) {
                            let rgbObj = colors.colorTypeConverter({ value: pd.color, fromType: 'hex', toType: 'rgb' });
                            rgb = [rgbObj.r, rgbObj.g, rgbObj.b];
                            hexRgbMap[pd.color] = rgb
                        }

                        itemsData.push(createItemData(pd.point.x, pd.point.y, rgb));
                    });
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    let width = itemData.frames[f].width;
                                    if(width > 0){
                                        let xShift = fast.r(itemData.frames[f].xChange + width/2);
                                        let x = fast.r(itemData.p.x-xShift)
                                        hlp.setFillColor(itemData.color).rect(x, itemData.p.y, width, 1)
                                    }
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                },
                init() {
                    
                    this.frames = this.createRippleFrames({ framesCount: totalFrames, itemFrameslengthClamps: [80,120], size: this.size, 
                        pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'sea_p')) });
                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parent.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.sea.renderIndex+1)
        }
        let createLava2Frames = function({framesCount, itemsCount, startPoints, yShift, itemFrameslengthClamps, size, colorsValues, brightColor, brightColorXCheck}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let maxLen = getRandomInt(10,20);
                let p = startPoints[getRandomInt(0, startPoints.length-1)];
                let yShiftValues = easing.fast({from: 0, to: yShift, steps: totalFrames, type: 'expo', method: 'in', round: 0});
                let lenValues = easing.fast({from: 0, to: maxLen, steps: totalFrames, type: 'quad', method: 'in', round: 0});

                let color = colorsValues[getRandomInt(0, colorsValues.length-1)]

                
                if(brightColorXCheck.indexOf(p.x) != -1 && getRandomBool() ) 
                    color = brightColor;

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        len: lenValues[f],
                        yShift: yShiftValues[f]
                    };
                }
            
                return {
                    p,
                    color,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(itemData.color).rect(itemData.p.x, itemData.p.y + itemData.frames[f].yShift, 1, itemData.frames[f].len);
                        }
                        
                    }
                });
            }
            
            return frames;
        }
        
        let createLavaFrames = function({framesCount, params, itemFrameslengthClamps, size}) {
            let frames = [];
            
            let itemsData = params.map((p, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let heightValues = [
                    ...easing.fast({from: 1, to: p.maxHeight, steps: fast.r(totalFrames/2), type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: p.maxHeight, to: 1, steps: fast.r(totalFrames/2), type: 'linear', method: 'base', round: 0})
                ]

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        h: heightValues[f] != undefined ? heightValues[f] : 1
                    };
                }
            
                return {
                    p: p.point,
                    c: p.color,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(itemData.c).rect(itemData.p.x, itemData.p.y, 1, itemData.frames[f].h);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.midLavaAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createLavaFrames({ framesCount: 100, params: [
                    {
                        point: new V2(73,165),
                        color: '#9d3839',
                        maxHeight: 10
                    },
                    {
                        point: new V2(73,154),
                        color: '#ec4938',
                        maxHeight: 5
                    },
                    {
                        point: new V2(74,149),
                        color: '#9d3839',
                        maxHeight: 6
                    },
                    {
                        point: new V2(70,169),
                        color: '#ec4938',
                        maxHeight: 6
                    },
                    {
                        point: new V2(71,163),
                        color: '#9d3839',
                        maxHeight: 5
                    },
                    {
                        point: new V2(71,152),
                        color: '#ec4938',
                        maxHeight: 5
                    },
                    {
                        point: new V2(57,145),
                        color: '#9d3839',
                        maxHeight: 8
                    },
                    {
                        point: new V2(60,149),
                        color: '#9d3839',
                        maxHeight: 3
                    },

                    
                ], itemFrameslengthClamps: [40,60], size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.c2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createLava2Frames({ framesCount: 150, itemsCount: 30, 
                            startPoints: [new V2({x: 58, y: 142}),new V2({x: 59, y: 141}),new V2({x: 60, y: 140}),new V2({x: 69, y: 145}),
                                new V2({x: 70, y: 144}),new V2({x: 71, y: 145}),new V2({x: 73, y: 145}),new V2({x: 74, y: 144}),
                        ], 
                            yShift: 30, itemFrameslengthClamps: [90,130], size: this.size, colorsValues: ['#ec4938', '#9d3839', '#802e2f'], 
                            brightColor: '#FC5F3C',brightColorXCheck: [59,70] })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.mid_roсk.renderIndex+1)

        this.frontLavaAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createLavaFrames({ framesCount: 100, params: [
                    
                    {
                        point: new V2(38,187),
                        color: '#763039',
                        maxHeight: 6
                    },
                    {
                        point: new V2(41,187),
                        color: '#763039',
                        maxHeight: 8
                    },
                    {
                        point: new V2(41,183),
                        color: '#9d3839',
                        maxHeight: 3
                    },
                    {
                        point: new V2(47,187),
                        color: '#763039',
                        maxHeight: 6
                    },
                    {
                        point: new V2(36,181),
                        color: '#763039',
                        maxHeight: 3
                    },
                    {
                        point: new V2(44,182),
                        color: '#9d3839',
                        maxHeight: 3
                    }
                    
                
                    
                    
                ], itemFrameslengthClamps: [40,60], size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.c2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createLava2Frames({ framesCount: 150, itemsCount: 40, 
                            startPoints: [ new V2(37,180),new V2(42,179), new V2(44,182), new V2(45,180), new V2(46,181),new V2(54,184),new V2(55,184),new V2(56,182),new V2(57,183),
                                new V2(63,180),new V2(64,181),
                        ], 
                            yShift: 30, itemFrameslengthClamps: [90,130], size: this.size, colorsValues: ['#ec4938', '#9d3839', '#763039'], 
                            brightColor: '#FC5F3C',brightColorXCheck: [42,45,46,55,56,64]  })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.frontal_rock.renderIndex+1)

        this.farLavaAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createLavaFrames({ framesCount: 100, params: [
                    
                    {
                        point: new V2(132,164),
                        color: '#773941',
                        maxHeight: 5
                    },
                    {
                        point: new V2(130,168),
                        color: '#893e43',
                        maxHeight: 4
                    },
                    {
                        point: new V2(131,166),
                        color: '#ad4746',
                        maxHeight: 4
                    },
                    {
                        point: new V2(146,162),
                        color: '#773941',
                        maxHeight: 4
                    },
                    {
                        point: new V2(150,158),
                        color: '#773941',
                        maxHeight: 6
                    },
                    {
                        point: new V2(125,167),
                        color: '#773941',
                        maxHeight: 6
                    },
                    
                ], itemFrameslengthClamps: [40,60], size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.c2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let mask = createCanvas(this.size, (ctx, size, hlp) => {
                            new PP({ctx}).fillByCornerPoints([new V2({x: 121, y: 171}),new V2({x: 137, y: 167}),new V2({x: 151, y: 162}),new V2({x: 152, y: 147}),new V2({x: 125, y: 144}),new V2({x: 110, y: 145}),
                            ])
                        })

                        this.frames = createLava2Frames({ framesCount: 300, itemsCount: 20, 
                            startPoints: [ new V2(125,158), new V2(131,152),new V2(146,157),new V2(149,156)
                        ], 
                            yShift: 30, itemFrameslengthClamps: [200,240], size: this.size, colorsValues: ['#ad4746', '#893e43', '#773941'], 
                            brightColor: '#FC5F3C',brightColorXCheck: []  }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(f, 0, 0);

                                ctx.globalCompositeOperation = 'destination-in'
                                ctx.drawImage(mask, 0,0);
                            }))
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.frontal_rock.renderIndex+1)

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.leafs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let createTreesMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size}) {
                            let frames = [];
                            let images = [];
                
                            let itemsCount = animationsModel.main[0].layers.length;
                
                            let framesIndiciesChange = [
                                ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 }),
                                ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 })
                            ]
                
                            for(let i = 0; i < itemsCount; i++) {
                                images[i] = PP.createImage(animationsModel, { renderOnly: [animationsModel.main[0].layers[i].name] }) //'l' + (i+1)
                            }
                            
                            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                let startFrameIndex = startFramesSequence ? 
                                startFramesSequence[i]
                                : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                                
                                let totalFrames = itemFrameslength;
                            
                                let frames = [];
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        index: framesIndiciesChange[f]
                                    };
                                }
                
                                if(additional) {
                                    let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
                                    for(let f = 0; f < additional.frameslength; f++){
                                        let frameIndex = f + startFrameIndex1;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                
                                        frames[frameIndex] = {
                                            index: additional.framesIndiciesChange[f]
                                        };
                                    }
                                }
                                
                            
                                return {
                                    img: images[i],
                                    frames
                                }
                            })
                            
                            for(let f = 0; f < framesCount; f++){
                                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                    for(let p = 0; p < itemsData.length; p++){
                                        let itemData = itemsData[p];
                                        
                                        if(itemData.frames[f]){
                                            let index = itemData.frames[f].index;
                                            ctx.drawImage(itemData.img[index], 0, 0);
                                        }
                                        
                                    }
                                });
                            }
                            
                            return frames;
                        }

                        this.frames = createTreesMovementFrames({ framesCount: 150, startFramesClamps: [30, 80], itemFrameslength: 60, 
                            additional: {
                                framesShift: 30,
                                frameslength: 30,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 2, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                                    ...easing.fast({from: 2, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0 })
                                ]
                            },
                            animationsModel: LastTreeScene.models.treeAnimation,
                            size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.tree_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let pointsData = [
                            ...
                        ]
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 150, itemFrameslength: 80, size: this.size, 
                            pointsData, });


                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.tree.renderIndex+1)

        let createLeafsFrames = function({framesCount, itemsCount, itemFrameslength, size, corners, angleClamps, _colors}) {
            let _sharedPP = undefined;
            //let _colors = 
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                _sharedPP = new PP({ctx});
            })

            let startPoints = _sharedPP.fillByCornerPoints(corners).map(p => new V2(p))

            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p1 = startPoints[getRandomInt(0, startPoints.length-1)];
                let direction = V2.up.rotate(getRandomInt(angleClamps));
                let speed = getRandom(0.2,0.5);
                let ci = getRandomInt(0, _colors.length-1);
                let cChangeTimeoutOrigin = getRandomInt(15, 30);
                let cChangeTimeout = cChangeTimeoutOrigin;

                let tail = undefined;

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    cChangeTimeout--;
                    if(cChangeTimeout <= 0){
                        cChangeTimeout = cChangeTimeoutOrigin;
                        ci++;
                        if(ci == _colors.length) ci = 0;
                    }

                    if(!tail){
                        if(getRandomInt(0,9) == 0) {
                            tail = {
                                timeOut: getRandomInt(20,40),
                                p: new V2(getRandomInt(-1,1), getRandomInt(1,1))
                            }
                        }
                    }
                    else {
                        tail.timeOut--;
                        if(tail.timeOut <= 0)
                            tail = undefined;
                    }

            
                    frames[frameIndex] = {
                        ci,
                        p: p1.add(direction.mul(speed*f)).add(new V2(0,0.05*f)).toInt(),
                        tail: {...tail}
                    };
                }
            
                return {
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.frames[f].p)

                            // if(itemData.frames[f].tail) {
                            //     ctx.globalAlpha = 0.5;
                            //     hlp.dot(itemData.frames[f].p.add(itemData.frames[f].tail.p))
                            //     ctx.globalAlpha = 1;
                            // }
                        }                            
                    }
                });
            }
            
            return frames;
        }

        this.leafs1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createLeafsFrames({framesCount: 300, itemsCount: 10, itemFrameslength: 200, size: this.size, 
                corners: [new V2(89, 91), new V2(68,76), new V2(79,57), new V2(108,43), new V2(90,72)],
                angleClamps: [-100, -130],
                _colors: ['#7f4454','#d17075','#e1918d','#9f545f']
            });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex+1)

        this.leafs1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createLeafsFrames({framesCount: 300, itemsCount: 10, itemFrameslength: 200, size: this.size,
                    corners: [new V2(115,88), new V2(140,82), new V2(155,87), new V2(135,95)],
                    angleClamps: [-100, -120],
                    _colors: ['#f0b1a5', '#e1918d', '#d17075']
                });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.mid_roсk.renderIndex-1)

        
    this.clouds = this.addGo(new GO({
        position: this.sceneCenter.clone(),
        size: this.viewport.clone(),
        createFrames({ totalFrames, layerName, xShift, delta = new V2() }) {
            let frames = [];
            let img = PP.createImage(model, { renderOnly: [layerName] });
            let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
            let aValues = [
                ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'out', round: 2}),
                ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'in', round: 2})
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
                    ctx.drawImage(this.mainFr[frameIndex], delta.x, delta.y);
                    ctx.drawImage(this.mainFr[f], delta.x, delta.y);
                })
            }

            return frames;
        },
        init() {
            let totalFrames = 300
            var lData = [{
                layerName: 'far_clouds1',
                totalFrames,
                xShift: -4,
                startFrameIndex: 0
            },{
                layerName: 'far_clouds2',
                totalFrames,
                xShift: -3,
                startFrameIndex: 100
            },{
                layerName: 'far_clouds3',
                totalFrames,
                xShift: -4,
                startFrameIndex: 200,
                delta: new V2(8,3)
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

            this.far_clouds_p = this.addChild(new GO({
                position: new V2(),
                size: this.size,
                init() {
                    this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 50, size: this.size, 
                        pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far_clouds_p')) });


                    this.registerFramesDefaultTimer({});
                }
            }))
        }
    }), layersData.far_clouds.renderIndex+1)
    }
    
}