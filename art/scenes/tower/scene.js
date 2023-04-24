class TowerScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'tower',
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
        let model = TowerScene.models.main;
        let layersData = {};
        let exclude = [
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
                    if(layerName == 'tower') {
                        this.windows = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createWindowsFrames({framesCount, itemFrameslength, size}) {
                                let frames = [];
                                
                                let layersFrames = {}
                                let models = TowerScene.models.towerFrames
                                for(let i = 0; i < models.main[0].layers.length; i++) {
                                    let layerName = models.main[0].layers[i].name;
                                    layersFrames[layerName] = PP.createImage(models, { renderOnly: [layerName] })
                                }
        
                                let framesChange = [
                                    ...easing.fast({from: 0, to: models.main.length-1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0}),
                                    ...easing.fast({from: models.main.length-1, to: 0, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0})
                                ]
        
                                let itemsData = new Array(models.main[0].layers.length).fill().map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount);
                                    let totalFrames = itemFrameslength;
                                
                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                            fi: framesChange[f]
                                        };
                                    }
                                
                                    return {
                                        layerName: models.main[0].layers[i].name,
                                        frames
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            if(itemData.frames[f]){
                                                ctx.drawImage(layersFrames[itemData.layerName][itemData.frames[f].fi], 0, 0)
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                this.frames = this.createWindowsFrames({ framesCount: 400, itemFrameslength: 80, size: this.size})
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))
                    }
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        let totalFrames = 400;
        let circleImages = {};
        let cColors = [ '#937855', '#715f46', '#4f4737', '#2d2e28'].reverse();
        //let cColors = [ '#937855', '#7c684b', '#665741', '#4f4737'].reverse();

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

        this.manAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.sword = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(TowerScene.models.swordFrames);

                        let framesIndices = [
                            ...new Array(50).fill(),
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: 25, type: 'linear', round: 0}),
                            ...new Array(50).fill(this.frames.length-1),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: 25, type: 'linear', round: 0}),
                            ...new Array(50).fill(),
                        ]

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndices[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == framesIndices.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.frames[framesIndices[this.currentFrame]];
                        })
                    }
                }))

                this.waving = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createWavingFrames({framesCount, size}) {
                        let frames = [];
                        
                        let layersFrames = {}
                        let models = TowerScene.models.manFrames;

                        for(let i = 0; i < models.main[0].layers.length; i++) {
                            let layerName = models.main[0].layers[i].name;
                            layersFrames[layerName] = PP.createImage(models, { renderOnly: [layerName] })
                        }

                        let framesChange = [
                            ...easing.fast({from: 0, to: models.main.length-1, steps: fast.r(framesCount/2), type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: models.main.length-1, to: 0, steps: fast.r(framesCount/2), type: 'quad', method: 'inOut', round: 0})
                        ]

                        let itemsData = new Array(models.main[0].layers.length).fill().map((el, i) => {
                            let startFrameIndex = i*10;
                            let totalFrames = framesCount;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    fi: framesChange[f]
                                };
                            }
                        
                            return {
                                layerName: models.main[0].layers[i].name,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(layersFrames[itemData.layerName][itemData.frames[f].fi], 0, 0)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createWavingFrames({ framesCount: 50, size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.guy.renderIndex+1)

        // this.lightnings = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {

        //         let startPoints = []

        //         createCanvas(V2.one, (ctx, size, hlp) => {
        //             let pp = new PP({ctx});

        //             startPoints = pp.fillByCornerPoints([new V2(72,77), new V2(74,110), new V2(77,74)]);
        //         })

        //         let pairs = [
        //             {
        //                 start: new V2(83,5), target: new V2(93, 67)
        //             },
        //             {
        //                 start: new V2(123,5), target: new V2(111, 61)
        //             },
        //             {
        //                 start: new V2(79,5), target: new V2(91,75)
        //             },
        //             {
        //                 start: new V2(130,5), target: new V2(113,65)
        //             },
        //             {
        //                 start: new V2(100,-25), target: new V2(104,24)
        //             }
        //         ]

        //         let animationColors = {
        //             main: '#8BE4EC',
        //             darker: '#8BE4EC',
        //             brighter: '#F0FAFC'
        //         }
                  
        //         this.frames = animationHelpers.createLightningFrames({ 
        //             framesCount: 200, itemsCount: 5, 
        //             size: this.size,
        //             colors: animationColors,
        //             stepFramesLength: 2,
        //             noDots: true,
        //             highlightParams: {
        //                 showTarget: false,
        //                 showStart: false,
        //             },
        //             pathParams: {
        //                 mainMidPointShiftClamps: [3,6],
        //                 resultMidPointXShiftClamps: [-6,6],
        //                 resultMidPointYShiftClamps: [-5, 5],
        //                 innerDotsCountClamp: [5,8],
        //                 startProvider: (params) => { 
        //                     return pairs[params.index].start;
        //                 },
        //                 targetProvider: (start, params) => { 
        //                     return pairs[params.index].target;
        //                 }
        //             }
        //         }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
        //             ctx.globalAlpha = 0.7;
        //             ctx.drawImage(f, 0, 0);
        //         }));

        //         this.registerFramesDefaultTimer({
        //             framesEndCallback: () => {
        //                 //this.parentScene.capturing.stop = true;
        //             }
        //         });
        //     }
        // }), layersData.tower.renderIndex+1)

        if(true) {
            this.upperClouds = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let cloudsParams = [
    
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 300, itemFrameslength: totalFrames, color: '#4f4737', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [4,7], sizeClamps: [5,6], 
                                // createPoligon: {cornerPoints: [
                                //     new V2(135,0),new V2(162,26),new V2(199,20),new V2(199,0),
                                // ]}, 
                                initialProps: {
                                    line: true, p1: new V2(-20, 15), p2: new V2(90, 38)
                                }, yShiftClamps: [-1,-2],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 300, itemFrameslength: totalFrames, color: '#4f4737', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [4,7], sizeClamps: [5,6], 
                                // createPoligon: {cornerPoints: [
                                //     new V2(135,0),new V2(162,26),new V2(199,20),new V2(199,0),
                                // ]}, 
                                initialProps: {
                                    line: true, p1: new V2(100, 38), p2: new V2(220, 22)
                                }, yShiftClamps: [-1,-2],
                        },
    
                        //задняя часть 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#715f46', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(40, 15), p2: new V2(70, 25)
                                }, yShiftClamps: [-2,-4],
                        },  
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#715f46', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(120, 25), p2: new V2(140, 15)
                                }, yShiftClamps: [-2,-4],
                        }, 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#715f46', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#2d2e28', sDecrClamps: [0, 1], yShiftClamps: [1,4], xShiftClamps: [0,0]},
                                initialProps: {
                                    line: true, p1: new V2(70, 28), p2: new V2(130, 28)
                                }, yShiftClamps: [-2,-4],
                        },
    
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#4f4737', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(40, 20), p2: new V2(70, 30)
                                }, yShiftClamps: [-2,-4],
                        },  
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#4f4737', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(120, 30), p2: new V2(140, 20)
                                }, yShiftClamps: [-2,-4],
                        }, 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#4f4737', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#2d2e28', sDecrClamps: [0, 1], yShiftClamps: [1,4], xShiftClamps: [0,0]},
                                initialProps: {
                                    line: true, p1: new V2(70, 32), p2: new V2(130, 32)
                                }, yShiftClamps: [-2,-4],
                        },
    
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(70, 35), p2: new V2(130, 35)
                                }, yShiftClamps: [-2,-4],
                        },  
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(130, 35), p2: new V2(160, 25)
                                }, yShiftClamps: [-2,-4],
                        },
                        
                        
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                createPoligon: {cornerPoints: [
                                    new V2(135,0),new V2(162,26),new V2(199,20),new V2(199,0),
                                ]}, 
                                initialProps: {
                                    line: true, p1: new V2(160, 25), p2: new V2(220, 10)
                                }, yShiftClamps: [-2,-4],
                        }, 
    
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(40, 25), p2: new V2(70, 35)
                                }, yShiftClamps: [-2,-4],
                        },
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [-80, -90], distanceClamps: [5,8], sizeClamps: [3,6], 
                                createPoligon: {cornerPoints: [
                                    new V2(0,  0),new V2(0,  18),new V2(34,  23),new V2(68,  0),
                                ]}, 
                                initialProps: {
                                    line: true, p1: new V2(-10, 7), p2: new V2(40, 25)
                                }, yShiftClamps: [-2,-4],
                        }, 
    
                    ]
    
                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })
    
                    this.frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }
                        })
                    }
    
                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.tower.renderIndex-3)

            this.frontalClouds = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let cloudsParams = [
    
                        //передняя часть 
    
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [6,10], sizeClamps: [4,7], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(50, 0), p2: new V2(130, 0)
                                }, yShiftClamps: [-2,-4],
                        }, 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [6,10], sizeClamps: [4,7], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(130, 5), p2: new V2(150, 15)
                                }, yShiftClamps: [-2,-4],
                        }, 
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#2d2e28', size: this.size,
                                directionAngleClamps: [80, 90], distanceClamps: [6,10], sizeClamps: [4,7], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(30, 15), p2: new V2(50, 5)
                                }, yShiftClamps: [-2,-4],
                        }, 
                    ]
    
                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })
    
                    this.frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }
                        })
                    }
    
                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.tower.renderIndex+2)

            this.backLowerClouds = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let lCount = 4;
                    let itemsCountChange = easing.fast({from: 400, to: 150, steps: lCount, type: 'linear', round: 0})
                    let distanceClamps0Change = easing.fast({from: 4, to: 9, steps: lCount, type: 'linear', round: 0})
                    let distanceClamps1Change = easing.fast({from: 8, to: 13, steps: lCount, type: 'linear', round: 0})
                    let sizeClamps0Change = easing.fast({from: 2, to: 6, steps: lCount, type: 'linear', round: 0})
                    let sizeClamps1Change = easing.fast({from: 5, to: 9, steps: lCount, type: 'linear', round: 0})
                    let p0xChange = easing.fast({from: 200, to: 170, steps: lCount, type: 'linear', round: 0})
                    let p1xChange = easing.fast({from: -20, to: 35, steps: lCount, type: 'linear', round: 0})
                    let yChange = easing.fast({from: 130, to: 150, steps: lCount, type: 'linear', round: 0})
                    let yShift0Change = easing.fast({from: -1, to: -5, steps: lCount, type: 'linear', round: 0})
                    let yShift1Change = easing.fast({from: -3, to: -7, steps: lCount, type: 'linear', round: 0})
    
                    // let cloudsParams = [
                    //     {
                    //         opacity: 1,
                    //         framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#937855', size: this.size,
                    //             directionAngleClamps: [-80, -90], distanceClamps: [10,14], sizeClamps: [6,10], 
                    //             //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                    //             initialProps: {
                    //                 line: true, p1: new V2(170, 160), p2: new V2(60, 160)
                    //             }, yShiftClamps: [-6,-10],
                    //     },  
                    // ]
    
                    let cColorsReversed = cColors.slice().reverse();
                    console.log(cColorsReversed)
    
                    let cloudsParams = new Array(lCount).fill().map((el, i) => (
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: itemsCountChange[i], itemFrameslength: totalFrames, color: cColorsReversed[i], size: this.size,
                                directionAngleClamps: [80, 90], 
                                distanceClamps: [distanceClamps0Change[i],distanceClamps1Change[i]], 
                                sizeClamps: [sizeClamps0Change[i],sizeClamps1Change[i]], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(p0xChange[i], yChange[i]), p2: new V2(p1xChange[i], yChange[i])
                                }, yShiftClamps: [yShift0Change[i],yShift1Change[i]],
                        }
                    ))
    
    
                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })
    
                    this.frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }
                        })
                    }
    
                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.tower.renderIndex-3)
    
            this.frontalLowerClouds = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let lCount = 4;
                    let itemsCountChange = easing.fast({from: 150, to: 100, steps: lCount, type: 'linear', round: 0})
                    let distanceClamps0Change = easing.fast({from: 10, to: 30, steps: lCount, type: 'linear', round: 0})
                    let distanceClamps1Change = easing.fast({from: 15, to: 45, steps: lCount, type: 'linear', round: 0})
                    let sizeClamps0Change = easing.fast({from: 6, to: 15, steps: lCount, type: 'linear', round: 0})
                    let sizeClamps1Change = easing.fast({from: 10, to: 20, steps: lCount, type: 'linear', round: 0})
                    let p0xChange = easing.fast({from: 170, to: 220, steps: lCount, type: 'linear', round: 0})
                    let p1xChange = easing.fast({from: 60, to: -20, steps: lCount, type: 'linear', round: 0})
                    let yChange = easing.fast({from: 160, to: 185, steps: lCount, type: 'linear', round: 0})
                    let yShift0Change = easing.fast({from: -5, to: -8, steps: lCount, type: 'linear', round: 0})
                    let yShift1Change = easing.fast({from: -7, to: -12, steps: lCount, type: 'linear', round: 0})
    
                    // let cloudsParams = [
                    //     {
                    //         opacity: 1,
                    //         framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#937855', size: this.size,
                    //             directionAngleClamps: [-80, -90], distanceClamps: [10,14], sizeClamps: [6,10], 
                    //             //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                    //             initialProps: {
                    //                 line: true, p1: new V2(170, 160), p2: new V2(60, 160)
                    //             }, yShiftClamps: [-6,-10],
                    //     },  
                    // ]
    
                    let cloudsParams = new Array(lCount).fill().map((el, i) => (
                        {
                            opacity: 1,
                            framesCount: totalFrames, itemsCount: itemsCountChange[i], itemFrameslength: totalFrames, color: cColors[i], size: this.size,
                                directionAngleClamps: [-80, -90], 
                                distanceClamps: [distanceClamps0Change[i],distanceClamps1Change[i]], 
                                sizeClamps: [sizeClamps0Change[i],sizeClamps1Change[i]], 
                                //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                initialProps: {
                                    line: true, p1: new V2(p0xChange[i], yChange[i]), p2: new V2(p1xChange[i], yChange[i])
                                }, yShiftClamps: [yShift0Change[i],yShift1Change[i]],
                        }
                    ))
    
                    //скосы
                    cloudsParams.splice(1, 0, {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: cColors[1], size: this.size,
                        directionAngleClamps: [-80, -90], distanceClamps: [13,20], sizeClamps: [8,14], 
                        //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                        initialProps: {
                            line: true, p1: new V2(210, 150), p2: new V2(160, 170)
                        }, yShiftClamps: [-6,-12],
                    })
    
                    cloudsParams.splice(2, 0, {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: cColors[1], size: this.size,
                        directionAngleClamps: [-80, -90], distanceClamps: [13,20], sizeClamps: [8,14], 
                        //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                        initialProps: {
                            line: true, p1: new V2(65, 170), p2: new V2(25, 155)
                        }, yShiftClamps: [-7,-13],
                    })
    
                    cloudsParams.splice(4, 0, {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 40, itemFrameslength: totalFrames, color: cColors[2], size: this.size,
                        directionAngleClamps: [-80, -90], distanceClamps: [14,25], sizeClamps: [8,16], 
                        //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                        initialProps: {
                            line: true, p1: new V2(220, 155), p2: new V2(170, 180)
                        }, yShiftClamps: [-8,-15],
                    })
    
                    cloudsParams.splice(5, 0, {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 60, itemFrameslength: totalFrames, color: cColors[2], size: this.size,
                        directionAngleClamps: [-80, -90], distanceClamps: [14,25], sizeClamps: [8,16], 
                        //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                        initialProps: {
                            line: true, p1: new V2(50, 175), p2: new V2(-10, 150)
                        }, yShiftClamps: [-8,-15],
                    })
    
                    cloudsParams.splice(7, 0, {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 60, itemFrameslength: totalFrames, color: cColors[3], size: this.size,
                        directionAngleClamps: [-80, -90], distanceClamps: [20,40], sizeClamps: [12,18], 
                        //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                        initialProps: {
                            line: true, p1: new V2(60, 190), p2: new V2(-10, 170)
                        }, yShiftClamps: [-10,-14],
                    })
    
                    let itemsFrames = cloudsParams.map(p => {
                        return {
                            frames: animationHelpers.createCloudsFrames({...p, circleImages})
                        }
                    })
    
                    this.frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < itemsFrames.length; i++){
                                ctx.drawImage(itemsFrames[i].frames[f],0,0);
                            }
                        })
                    }
    
                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            //this.parentScene.capturing.stop = true;
                        }
                    });
                }
            }), layersData.tower_overlay.renderIndex+3)
        }
        
    }
}