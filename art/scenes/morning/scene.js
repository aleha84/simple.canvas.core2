class MorningScene extends Scene {
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
                size: new V2(150,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'morning',
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
        const model = MorningScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(255,255,255,';

        this.sky = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['sky'] }),
            init() {


                let totalFrames = 300
                var lData = [
                    {
                        easingType: 'sin',
                        layerImg: PP.createImage(model, {renderOnly: ['clouds_l1']}),
                        totalFrames,
                        xShift: -1,
                        size: this.size,
                        startFrameIndex: 75
                    },
                    {
                        easingType: 'sin',
                        layerImg: PP.createImage(model, {renderOnly: ['clouds_l2']}),
                        totalFrames,
                        xShift: -3,
                        size: this.size,
                        startFrameIndex:  150
                    },
                    {
                        easingType: 'sin',
                        layerImg: PP.createImage(model, {renderOnly: ['clouds_l3']}),
                        totalFrames,
                        xShift: -5,
                        size: this.size,
                        startFrameIndex:  0
                    }
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
        }), 1)

        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['city'] }),
            init() {
                this.far_trees = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far_trees_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.close_trees = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let framesCount = 300;
                        let animation = {
                            type: 0,
                            shiftDirection: V2.left
                        };

                        let triggerData = [
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(128,97), new V2(128,118)], 
                                p0: new V2(128,97), p1: new V2(30,97),
                                triggerMovementStartIndex: 10, triggerMovementFramesCount: 60, 
                                itemFramesCount: [60, 90],
                                startFrameIndex: [0, 50],
                                animation: animation
                            },
                            // {
                            //     easingType: 'quad', easingMethod: 'out',
                            //     cornerPoints: [new V2(128,97), new V2(128,118)], 
                            //     p0: new V2(128,97), p1: new V2(30,97),
                            //     triggerMovementStartIndex: 200, triggerMovementFramesCount: 60, 
                            //     itemFramesCount: [30, 60],
                            //     startFrameIndex: [0, 50],
                            //     animation: animation
                            // }
                        ];

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: framesCount,
                            triggerData: triggerData,
                            img: PP.createImage(model, { renderOnly: ['close_trees'] }),
                            size: this.size
                        });

                        this.registerFramesDefaultTimer({});

                        this.pAuto = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_trees'));
                                pd.forEach(pdi => {
                                    pdi.point.x-=1;
                                })
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                                    pdPredicate: () => getRandomInt(0,1) == 0,
                                    pointsData: pd
                                 });
                
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.birds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createBirdsFrames: ({ totalFrames = 300, y = 40, size }) => {
                        //let totalFrames = 400;
                        let xValues = easing.fast({from: 0, to: size.x + 20, steps: totalFrames, type: 'linear', round: 0})
                        //let y = 83; 
        
                        let _c = 'rgba(80,38,50,';
        
                        let frames = [];
        
                        let bData = [ 
                            {
                                shift: new V2(), a: [0.5, 0.4, 0.2, 0.3]
                            },
                            // {
                            //     shift: new V2(-5, 1), a: [0.4, 0.3, 0.1, 0.2]
                            // }
                        ]
        
                        let yShiftFun = (x, a = 5, b =1) => Math.sin(x/a)*b;
        
                        for(let f = 0; f < totalFrames; f++) {
                            let x = xValues[f];
        
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
        
                                bData.forEach(bd => {
                                    let yShift2 =  fast.r(yShiftFun(f, 20));
                                    let mainY = y+yShift2+bd.shift.y;
                                    hlp.setFillColor( _c + `${bd.a[0]})`).dot(x+bd.shift.x,mainY);
            
                                    let yShift =  fast.r(yShiftFun(f,10));
            
                                    //hlp.setFillColor( _c + `${bd.a[1]})`).dot(x+1+bd.shift.x,mainY);
                                    hlp.setFillColor( _c + `${bd.a[2]})`).dot(x-1+bd.shift.x,mainY);
            
                                    if(yShift < 0)
                                        yShift = 0;
            
                                    hlp.setFillColor( _c + `${bd.a[3]})`).dot(x+bd.shift.x,mainY+yShift);
                                })
        
                                
                            })
                        }
        
                        return frames;
                    },
                    init() {
                        this.b1 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = [
                                    ...new Array(300).fill(),
                                    ...this.parent.createBirdsFrames({ totalFrames: 250, size: this.size }),
                                    ...new Array(50).fill(),
                                ]
                                this.registerFramesDefaultTimer({});
                            }
                        }))
        
                        this.b2 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = [
                                    ...new Array(320).fill(),
                                    ...this.parent.createBirdsFrames({ totalFrames: 250, size: this.size, y: 44 }),
                                    ...new Array(30).fill(),
                                ]
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        this.parent.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

                        this.b3 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = [
                                    ...new Array(310).fill(),
                                    ...this.parent.createBirdsFrames({ totalFrames: 250, size: this.size, y: 37 }),
                                    ...new Array(40).fill(),
                                ]
                                this.registerFramesDefaultTimer({});
                            }
                        }))
        
                    }
                }), 15)
            }
        }), 3)

        this.wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['wall', 'wall_d', 'radiator'] }),
            init() {

                this.dust = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDustParticlesFrames({framesCount, itemsCount, itemFrameslength, size, maxAClamps}) {
                        let frames = [];
                        let dustLayer = PP.getLayerByName(model, 'dust_zone');

                        let availablePoints = [
                            ...appSharedPP.fillByCornerPoints(dustLayer.groups[0].points.map(p => new V2(p.point))),
                            ...appSharedPP.fillByCornerPoints(dustLayer.groups[1].points.map(p => new V2(p.point)))
                        ]

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let p = availablePoints[getRandomInt(0, availablePoints.length-1)];
                            let xShift = getRandomInt(-2,2);
                            let maxAValue = getRandom(maxAClamps[0],maxAClamps[1]);

                            let aValues = [
                                ...easing.fast({from: 0, to: maxAValue, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}), 
                                ...easing.fast({from: maxAValue, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                            ] 

                            let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    a: aValues[f] != undefined ? aValues[f] : 0
                                };
                            }
                        
                            return {
                                p,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')').dot(itemData.p.x + itemData.frames[f].xShift, itemData.p.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createDustParticlesFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: [100, 200], maxAClamps: [0.1, 0.4],size: this.size });
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['fg'] })
        }), 7)
    }
}