class PagodaScene extends Scene {
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
                size: new V2(160,100).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'pagoda_morning',
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
        let model = PagodaScene.models.main;
        let type = 'sunrise'

        let data = {
            'sunrise': {
                color: '#8E8EBA',//'#bbc4c9',
                model: PagodaScene.models.main_sunrise,
                animations: {
                    left_tree_02: {
                        framesCount: 300,
                        itemFramesCount: [70, 120]
                    },
                    left_tree_01: {
                        framesCount: 300,
                        itemFramesCount: [70, 120]
                    },
                    clouds: {
                        xShiftMultiplier: 0.5
                    }
                },
                opacity: {
                    far_main: 0,
                    far_tree_01: 0.5,
                    far_tree_02: 0.5,
                    far_tree_03: 0.5,
                    left_b_back: 0.4,
                    left_tree_02: 0.2,
                    left_tree_01: 0.15,
                    left_b: 0.15,
                    right_b: 0.25
                }
            }
        }

        if(type) {
            model = data[type].model;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames({ totalFrames, layerName, xShift, delta = new V2() }) {
                let frames = [];
                let img = PP.createImage(model, { renderOnly: [layerName] });
                let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                let t_3 = fast.r(totalFrames/3);
                // let aValues = [
                //     ...easing.fast({ from: 0, to: 1, steps: totalFrames/4, type: 'linear', method: 'base', round: 1}),
                //     ...new Array(totalFrames/2).fill(1),
                //     ...easing.fast({ from: 1, to: 0, steps: totalFrames/4, type: 'sin', method: 'in', round: 1}),
                // ]
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

                let startFrameIndex = totalFrames/4;
                let startFrameIndex2 = totalFrames*2/4;
                let startFrameIndex3 = totalFrames*3/4;
                for(let f = 0; f < totalFrames; f++){

                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (totalFrames-1)){
                        frameIndex-=totalFrames;
                    }

                    let frameIndex2 = f + startFrameIndex2;
                    if(frameIndex2 > (totalFrames-1)){
                        frameIndex2-=totalFrames;
                    }

                    let frameIndex3 = f + startFrameIndex3;
                    if(frameIndex3 > (totalFrames-1)){
                        frameIndex3-=totalFrames;
                    }

                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mainFr[f], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex2], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex3], delta.x, delta.y);
                    })
                }

                return frames;
            },
            init() {
                
                let xShiftMultiplier = 1;

                if(type) {
                    xShiftMultiplier = data[type].animations.clouds.xShiftMultiplier;
                }

                let totalFrames = 600
                var lData = [
                    {
                        layerName: 'cloud_01',
                        totalFrames,
                        xShift: -10*xShiftMultiplier,
                        startFrameIndex: 0
                    },
                    {
                        layerName: 'cloud_02',
                        totalFrames,
                        xShift: -10*xShiftMultiplier,
                        startFrameIndex: 50
                    },
                    {
                        layerName: 'cloud_03',
                        totalFrames,
                        xShift: -10*xShiftMultiplier,
                        startFrameIndex: 100
                    },
                    {
                        layerName: 'cloud_04',
                        totalFrames,
                        xShift: -15*xShiftMultiplier,
                        startFrameIndex: 10
                    },
                    {
                        layerName: 'cloud_05',
                        totalFrames,
                        xShift: -7*xShiftMultiplier,
                        startFrameIndex: 60
                    },
                    {
                        layerName: 'cloud_06',
                        totalFrames,
                        xShift: -15*xShiftMultiplier,
                        startFrameIndex: 100,
                        delta: new V2(15,0)
                    },
                ]

                lData.map(ld => this.addChild(new GO({
                    position: new V2().add(ld.translate ? ld.translate : new V2()),
                    size: this.size,
                    frames: this.createFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            framesEndCallback: () => {
                                if(ld.startFrameIndex == 0) {
                                    this.parent.parentScene.capturing.stop = true;
                                } 
                            }
                        });
                    }
                })))

            }
        }), 3)

        this.far_main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['far_main'] }),
            init() {
                let farTreesLayersNames = [
                    'far_tree_01',
                    'far_tree_02',
                    'far_tree_03'
                ]

                if(type) {
                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img, 0, 0);
                        ctx.globalCompositeOperation = 'source-atop'
                        ctx.globalAlpha = data[type].opacity.far_main;
                        hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                    })
                }

                this.far_tree_01 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_tree_01'] })

                        if(type) {
                            this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.far_tree_01;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            })
                        }
                    }
                }))

                this.far_tree_02 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_tree_02'] })

                        if(type) {
                            this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.far_tree_02;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            })
                        }
                    }
                }))

                this.far_tree_03 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_tree_03'] })

                        if(type) {
                            this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.far_tree_03;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            })
                        }
                    }
                }))

                this.pAuto = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                            pdPredicate: (pd) => {
                                if(getRandomInt(0,2) == 0){
                                    let {x,y} = pd.point;

                                    if(isBetween(x, 73,79) && isBetween(y, 53,56))
                                        return false;

                                    return true;
                                }
                                    
                                return false;
                            },
                            pointsData: [
                                ...animationHelpers.extractPointData(model.main.layers.find(l => l.name == farTreesLayersNames[0])),
                                ...animationHelpers.extractPointData(model.main.layers.find(l => l.name == farTreesLayersNames[1])),
                                ...animationHelpers.extractPointData(model.main.layers.find(l => l.name == farTreesLayersNames[2]))
                            ]
                            
                         });

                         if(type) {
                            this.frames = this.frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(f, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.far_tree_03;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            }))
                        }
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.left_b = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['left_b_back'] }),
            init() {

                if(type) {
                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img, 0, 0);
                        ctx.globalCompositeOperation = 'source-atop'
                        ctx.globalAlpha = data[type].opacity.left_b_back;
                        hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                    })
                }

                this.left_tree_02 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        //this.img = PP.createImage(model, { renderOnly: ['left_tree_02'] })

                        let triggerData = [];
                        let framesCount = 150;
                        let itemFramesCount = [50, 90]

                        if(type) {
                            framesCount = data[type].animations.left_tree_02.framesCount
                            itemFramesCount = data[type].animations.left_tree_02.itemFramesCount
                        }

                        let animation = {
                            type: 0,
                            shiftDirection: V2.left
                        };

                        let animation2 = {
                            type: 0,
                            shiftDirection: V2.right
                        };

                        let ani1Data = [
                            { p: [new V2(58,9), new V2(71,22), new V2(44,10)], tmsi: 20,   },
                            { p: [new V2(66,24), new V2(59,32), new V2(51,23)], tmsi: 80,  },
                            { p: [new V2(65,32), new V2(65,51), new V2(51,31)], tmsi: 0,  },
                            { p: [new V2(55,44), new V2(59,57), new V2(44,44)], tmsi: 120,  },
                            { p: [new V2(48,53), new V2(45,61), new V2(40,42)], tmsi: 60,  },
                            { p: [new V2(19,39), new V2(20,52), new V2(12,37)], tmsi: 20,  },
                            { p: [new V2(14,34), new V2(19,41), new V2(4,37)], tmsi: 100,  },
                            { p: [new V2(0,31), new V2(6,37), new V2(0,43)], tmsi: 60,  }
                        ]

                        let ani2Data = [
                            { p: [new V2(22,10), new V2(13,21), new V2(38,15)], tmsi: 40,   },
                            { p: [new V2(18,22), new V2(17,33), new V2(40,25)], tmsi: 80,  },
                            { p: [new V2(18,33), new V2(21,46), new V2(33,34)], tmsi: 20,  }
                        ]

                        triggerData = [
                            ...ani1Data.map(el => ({
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [el.p[0], el.p[1]], 
                                p0: el.p[0], p1: el.p[2],
                                triggerMovementStartIndex: el.tmsi, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                                itemFramesCount,
                                startFrameIndex: [0, 50],
                                animation: animation
                            })),
                            ...ani2Data.map(el => ({
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [el.p[0], el.p[1]], 
                                p0: el.p[0], p1: el.p[2],
                                triggerMovementStartIndex: el.tmsi, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                                itemFramesCount,
                                startFrameIndex: [0, 50],
                                animation: animation2
                            }))
                        ]

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: framesCount,
                            triggerData: triggerData,
                            img: PP.createImage(model, { renderOnly: ['left_tree_02'] }),
                            size: this.size,
                            excludeColors: ['#6f5152']
                        })

                        if(type) {
                            this.frames = this.frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(f, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.left_tree_02;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            }))
                        }

                        this.registerFramesDefaultTimer({});

                        this.pAuto = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                                    pdPredicate: () => getRandomInt(0,4) == 0,
                                    pointsData: 
                                    animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'left_tree_02'))
                                 });

                                 if(type) {
                                    this.frames = this.frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                        ctx.drawImage(f, 0, 0);
                                        ctx.globalCompositeOperation = 'source-atop'
                                        ctx.globalAlpha = data[type].opacity.left_tree_02;
                                        hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                                    }))
                                }
                
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.left_tree_01 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // this.img = PP.createImage(model, { renderOnly: ['left_tree_01'] })

                        let triggerData = [];
                        let framesCount = 150;
                        let itemFramesCount = [50, 90]

                        if(type) {
                            framesCount = data[type].animations.left_tree_02.framesCount
                            itemFramesCount = data[type].animations.left_tree_02.itemFramesCount
                        }

                        let animation = {
                            type: 0,
                            shiftDirection: V2.left
                        };

                        let ani1Data = [
                        ]

                        for(let i = 0; i < 6; i++) {
                            let p0 = new V2(getRandomInt(42,48), getRandomInt(48,66));
                            let p1 = new V2(p0.x + getRandomInt(-3,3), p0.y + getRandomInt(5,10))
                            let p2 = new V2(p0.x + getRandomInt(-10,-20), p0.y + getRandomInt(-5,5))

                            ani1Data.push({
                                p: [
                                    p0, p1, p2
                                ],
                                tmsi: i*20
                            })
                        }

                        triggerData = [
                            ...ani1Data.map(el => ({
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [el.p[0], el.p[1]], 
                                p0: el.p[0], p1: el.p[2],
                                triggerMovementStartIndex: el.tmsi, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                                itemFramesCount,
                                startFrameIndex: [0, 50],
                                animation: animation
                            }))
                        ]

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: framesCount,
                            triggerData: triggerData,
                            img: PP.createImage(model, { renderOnly: ['left_tree_01'] }),
                            size: this.size
                        });

                        if(type) {
                            this.frames = this.frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(f, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.left_tree_01;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            }))
                        }

                        this.registerFramesDefaultTimer({});

                        this.pAuto = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                                    pdPredicate: () => getRandomInt(0,4) == 0,
                                    pointsData: 
                                    animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'left_tree_01'))
                                 });

                                 if(type) {
                                    this.frames = this.frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                        ctx.drawImage(f, 0, 0);
                                        ctx.globalCompositeOperation = 'source-atop'
                                        ctx.globalAlpha = data[type].opacity.left_tree_01;
                                        hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                                    }))
                                }
                
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.left_b = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['left_b'] })

                        if(type) {
                            this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0, 0);
                                ctx.globalCompositeOperation = 'source-atop'
                                ctx.globalAlpha = data[type].opacity.left_b;
                                hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                            })
                        }
                    }
                }))
            }
        }), 10)

        this.right_b = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['right_b'] }),
            init() {
                if(type) {
                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img, 0, 0);
                        ctx.globalCompositeOperation = 'source-atop'
                        ctx.globalAlpha = data[type].opacity.right_b;
                        hlp.setFillColor(data[type].color).rect(0,0,size.x,size.y)
                    })
                }
            }
        }), 15)
    }
}