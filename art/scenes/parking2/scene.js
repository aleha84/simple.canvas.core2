class Parking2Scene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'parking2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8,
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Parking2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        /*
        TODO:
        +1. дождь под фонарём
        +2. раскачивание веток левого дерева
        +3. раскачивание веток правого дерева
        +4. провода - слабое покачивание
        +5. рябь на луже
        +6. общая анимация от капель на асфальте и на столбе
        +7. капли на лобовом стекле автомобиля
        +8. Дождь в лучах ламп автомобиля
        -9. Мерцание ламп автомобиля
        +10. Капли с фонаря
        +11. Капли с деревьев
        ?12. Точечная анимация от капель на деревьях
        +13. Точечная анимация на капоте автомобиля
        +14. Капающие капли с автомоблия
        -15. splash_zone на асфальте?
        */

        let createRippleFrames = function ({
            framesCount, itemFrameslengthClamps,
            widthClamps, data,
            size
        }) {
            let frames = [];

            let itemsData = data.map((p, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let maxWidth = getRandomInt(widthClamps);
                let widthValues = [
                    ...easing.fast({ from: 0, to: maxWidth, steps: fast.r(totalFrames / 2), type: 'quad', method: 'inOut', round: 0 }),
                    ...easing.fast({ from: maxWidth, to: 0, steps: fast.r(totalFrames / 2), type: 'quad', method: 'inOut', round: 0 })
                ]

                let frames = [];
                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }

                    frames[frameIndex] = {
                        width: widthValues[f]
                    };
                }

                return {
                    frames,
                    p: p.point,
                    color: p.color
                }
            })

            for (let f = 0; f < framesCount; f++) {
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for (let p = 0; p < itemsData.length; p++) {
                        let itemData = itemsData[p];

                        if (itemData.frames[f]) {
                            let width = itemData.frames[f].width;

                            if (width) {
                                let xShift = fast.r(width / 2);
                                let x = fast.r(itemData.p.x - xShift)
                                hlp.setFillColor(itemData.color).rect(x, itemData.p.y, width, 1)
                            }
                        }

                    }
                });
            }

            return frames;
        }

        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, excludeMask }) {
            let frames = [];
    
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);
    
                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);
    
                let lineAValues = undefined;
                if (useACurve) {
                    let lavType = typeof useACurve;
                    if(lavType == 'boolean')
                        lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
                    else if(lavType == 'object'){
                        lineAValues = easing.fast({ from: lineAValues.aValue[0], to: lineAValues.aValue[1], steps: lineAValues.len, type: lineAValues.type, method: lineAValues.method, round: lineAValues.round || 2 })
                    }
                    else if(lavType == 'function'){
                        lineAValues = useACurve({len, aValue})
                    }
                    else 
                        throw new Error('Not supported type of "useACurve": ' + lavType)
                }
    
                let frames = [];
                let current = p0;
                let ly = isArray(lowerY) ? getRandomInt(lowerY) : lowerY;
    
                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }
    
                    let p0 = current.clone();
                    let p1 = current.add(direction.mul(len)).toInt();
    
                    frames[frameIndex] = {
                        p0,
                        p1
                    };
    
                    current = p0.add(direction.mul(speed)).toInt()
                    if (current.y > ly)
                        break;
                }
    
                return {
                    frames,
                    lowerY: ly,
                    lineAValues
                }
            })
    
            for (let f = 0; f < framesCount; f++) {
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ ctx });
                    pp.setFillColor(whiteColorPrefix + aValue + ')')
                    for (let p = 0; p < itemsData.length; p++) {
                        let itemData = itemsData[p];
    
                        if (itemData.frames[f]) {
    
                            let { p0, p1 } = itemData.frames[f];
                            if (p0.y > itemData.lowerY)
                                continue;
    
                            if (!useACurve)
                                pp.lineV2(p0, p1);
                            else {
                                let points = appSharedPP.lineV2(p0, p1)
                                for (let i = 0; i < points.length; i++) {
                                    let a = itemData.lineAValues[i];
                                    if (a == undefined)
                                        a = 0;
    
                                    let p = points[i];
                                    if (p.y > itemData.lowerY)
                                        continue;
    
                                    hlp.setFillColor(whiteColorPrefix + a + ')').dot(points[i])
                                }
                            }
                        }
    
                    }
    
                    if (mask) {
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(mask, 0, 0)
                    }

                    if(excludeMask) {
                        ctx.globalCompositeOperation = 'destination-out'
                        ctx.drawImage(excludeMask, 0, 0)
                    }
                });
            }
    
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg', 'bg_d'] }),
            init() {
                //
            }
        }), 1)

        this.forest = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['forest'] }),
            init() {
                //
            }
        }), 3)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['lamp'] }),
            init() {

                this.wires = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let itemFramesCount = 120
                        let wiresData = [
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(81,32)] }, 
                                    { dots: [new V2(117,30), new V2(117.24,30)] }, 
                                    { dots: [new V2(165,19), new V2(165.5,19)] },
                                ],xClamps: [81,160], yClamps:[], size: this.size, invert: false, c1: '#1d1d29', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(71,27)] }, 
                                    { dots: [new V2(112,25), new V2(112.24,25)] }, 
                                    { dots: [new V2(165,11), new V2(165.5,11)] },
                                ],xClamps: [71,160], yClamps:[], size: this.size, invert: false, c1: '#1d1d29', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(80,42)] }, 
                                    { dots: [new V2(114,50), new V2(114.25,50)] }, 
                                    { dots: [new V2(159,56), new V2(159.5,56)] },
                                ],xClamps: [80,160], yClamps:[], size: this.size, invert: false, c1: '#1f2732', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(38,33)] }, 
                                    { dots: [new V2(70,27)] },
                                ],xClamps: [38,70], yClamps:[], size: this.size, invert: false, c1: '#1f2732', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(38,40)] }, 
                                    { dots: [new V2(79,32)] },
                                ],xClamps: [38,75], yClamps:[], size: this.size, invert: false, c1: '#1f2732', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(38,50)] }, 
                                    { dots: [new V2(79,42)] },
                                ],xClamps: [38,75], yClamps:[], size: this.size, invert: false, c1: '#252e3b', usePP: true
                            }
                            
                        ]
        
                        this.wires = wiresData.map((d, i) => 
                            this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let frms = animationHelpers.createWiresFrames(d);

                                this.frames = frms;
                                this.registerFramesDefaultTimer({ startFrameIndex: i*10 });
                                // this.frames = new Array(180).fill(frms[0]);
                                // this.frames.splice(i*15, itemFramesCount, ...frms)
                                //this.registerFramesDefaultTimer({ });
                            }
                        })))
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [15, 25], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'lamp_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        let mainMask = PP.createImage(model, { renderOnly: ['ligth_g', 'light_g2'], forceVisibility: { ligth_g: { visible: true }, light_g2: { visible: true } } })
        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                 //
                let mask2 = createCanvas(this.size, (ctx, size, hlp) => {
                    
                    scenesHelper.createGradient({
                        hlp,
                        aValueMul: 1, center: new V2(90, 70), radius: new V2(20, 20), gradientOrigin: new V2(90, 64),
                        size,
                        colorPrefix: whiteColorPrefix,
                        // verticalCut: {
                        //     points: appSharedPP.lineByCornerPoints([new V2(20,85), new V2(98,13), new V2(108,13), new V2(170, 65)].map(p => new V2(p.x, p.y+1))),
                        //     aValuesMul: easing.fast({from: 1, to: 0, steps: 10, type: 'linear', round: 2})
                        // } 
                    });
                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.15;
                    ctx.drawImage(mainMask, 0, 0);
                })

                let aMul = 0.5;
                let framesCount = 120
                let xClamps = [10,150]

                this.layers = [
                    {
                        angleClamps: [0,0], lengthClamps: [6,8], xClamps, upperYClamps: [-30, 30], lowerY: 140, aValue: fast.r(aMul*0.3, 2), speedClapms: [3,3], mask: mainMask, framesCount, itemsCount: 4000, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [8,10], xClamps, upperYClamps: [-30, 30], lowerY: 140, aValue: fast.r(aMul*0.45, 2), speedClapms: [4,5], mask: mainMask, framesCount, itemsCount: 1000, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [10,12], xClamps, upperYClamps: [-30, 30], lowerY: 140, aValue: fast.r(aMul*0.6, 2), speedClapms: [6,7], mask: mainMask, framesCount, itemsCount: 300, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [16,18], xClamps, upperYClamps: [-30, 30], lowerY: 140, aValue: fast.r(aMul*0.8, 2), speedClapms: [8,9], mask: mainMask, framesCount, itemsCount: 100, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [16,18], xClamps: [68,110], upperYClamps: [-30, 30], lowerY: 140, aValue: aMul*1, speedClapms: [8,9], mask: mainMask, framesCount, itemsCount: 30, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    // {
                    //     angleClamps: [0,0], lengthClamps: [10,12], xClamps: [80,100], upperYClamps: [30, 40], lowerY: 140, aValue: 0.8, speedClapms: [6,7], mask: mask2, framesCount, itemsCount: 80, size: this.size, useACurve: false, excludeMask: undefined
                    // }

                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 6)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 240, itemFrameslength: [10, 15], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'ground_p'))
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.puddleRipples = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRippleFrames({
                            framesCount: 240, itemFrameslengthClamps: [15, 20],
                            widthClamps: [2, 2], size: this.size,
                            data: animationHelpers.extractPointData(PP.getLayerByName(model, 'puddle_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        this.left_tree = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['left_tree'] }),
            init() {
                this.basicAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let pixelsData = getPixels(this.parent.img, this.size);
                        let pData = [];
                        let pDataRot = [];
                        let clamps = [-1,1]
        
                        pixelsData.forEach(pd => {

                            if(getRandomBool()) {
                                let color =  colors.rgbToHex(pd.color)

                                pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                // if(targetColors.indexOf(color) != -1){
                                //     pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                // }
                            }
                        });
                        

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 240, pointsData: pData, itemFrameslength: [20,30], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 9)

        this.right_tree = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['right_tree'] }),
            init() {
                this.basicAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let pixelsData = getPixels(this.parent.img, this.size);
                        let pData = [];
                        let pDataRot = [];
                        let clamps = [-1,1]
        
                        pixelsData.forEach(pd => {

                            if(getRandomBool()) {
                                let color =  colors.rgbToHex(pd.color)

                                pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                // if(targetColors.indexOf(color) != -1){
                                //     pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                // }
                            }
                        });
                        

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 240, pointsData: pData, itemFrameslength: [20,30], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.treesAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createLayersAnimationFrames({
                            framesCount: 240, itemFrameslength: 100, startFramesClamps: [0, 120], startFramesSequence: undefined, additional: undefined, animationsModel: Parking2Scene.models.treesAnimation, size: this.size, maxFrameIndex: 2, 
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.treeDropsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 240, itemFrameslength1Clamps: [20,30], itemFrameslength2Clamps: [25,30], size: this.size, opacityClamps: [0.2, 0.3], 
                            startPositions: [
                                {
                                    useAll: true,
                                    height: 40,
                                    tail: 3,
                                    data: [
new V2(9,107), new V2(14,105), new V2(29,111), new V2(35,115), new V2(38,95), new V2(41,99), new V2(47,94), new V2(140,112), new V2(142,112), new V2(131,99), new V2(133,99), new V2(125,89), new V2(128,97), new V2(129,97), new V2(135,96),                                    ]
                                },
                                {
                                    opacityClamps: [0.5, 0.6],
                                    itemFrameslength1Clamps: [1,3],
                                    itemFrameslength2Clamps: [30,35],
                                    useAll: true,
                                    height: 60,
                                    tail: 3,
                                    data: [
                                        new V2(93, 60),new V2(91, 61),new V2(92, 61),    
                                    ]                            
                                }
                            ], reduceOpacityOnFall: true, type: 'quad', method: 'in', colorPrefix: colors.getColorPrefix('#e6f8eb', 'hex')
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 11)


        this.rain2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // return;
                let mask = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                    let gData = PP.getLayerByName(model, 'ligth_g').groups[0];
                    scenesHelper.createGradient({
                        hlp,
                        ...gData,
                        radius: new V2(110, 60),
                        aValueMul: 0.5,
                        size,
                        colorPrefix: whiteColorPrefix,
                        // verticalCut: {
                        //     points: appSharedPP.lineByCornerPoints([new V2(20,85), new V2(98,13), new V2(108,13), new V2(170, 65)].map(p => new V2(p.x, p.y+1))),
                        //     aValuesMul: easing.fast({from: 1, to: 0, steps: 10, type: 'linear', round: 2})
                        // } 
                    });
                })

                let aMul = 0.5;
                let framesCount = 120
                let xClamps = [0,160]

                this.layers = [
                    {
                        angleClamps: [0,0], lengthClamps: [6,8], xClamps, upperYClamps: [-30, 30], lowerY: 150, aValue: fast.r(aMul*0.3, 2), speedClapms: [3,3], mask: mask, framesCount, itemsCount: 4000, size: this.size, useACurve: false, excludeMask: undefined
                    },

                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 13)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 240, itemFrameslength: [15, 25], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'car_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        //let mask = PP.createImage(model, { renderOnly: ['car_light_g1'], forceVisibility: { ligth_g: { visible: true }, light_g2: { visible: true } } })

                        let mask_f = (p0, p1_y) =>  createCanvas(this.size, (ctx, size, hlp) => {
                            //let p0 = new V2(0, 140)
                            let w = 37;
                            let h = 10;
                            let p1 = new V2(p0.x+w, 137 );

                            let img1 = createCanvas(size, (ctx, size1, hlp) => {
                                let a = [
                                    // ... easing.fast({from: 0, to: 1, steps: h/2, type: 'sin', method: 'inOut', round: 2}),
                                    // ... easing.fast({from: 1, to: 0, steps: h/2, type: 'sin', method: 'inOut', round: 2})
                                    0.3, 0.7,1,1, 0.8, 0.7, 0.6, 0.4, 0.3, 0.1,
                                ]

                                let cPrefix = colors.getColorPrefix('#e6f8eb', 'hex');
                                let pp1 = new PP({ctx});

                                for(let i = 0; i < h; i++) {
                                    pp1.setFillColor(cPrefix + a[i] + ')')
                                    pp1.lineV2(p0.add(new V2(0, i)), p1.add(new V2(0, i)))
                                }
                                
                            })

                            let img2 = createCanvas(size, (ctx, size1, hlp) => {
                                let shift = 5;
                                let w1 = w-shift;
                                let a = easing.fast({from: 0, to: 1, steps: w, type: 'quad', method: 'in', round: 2});

                                for(let i = 0; i < w1; i++) {
                                    hlp.setFillColor(whiteColorPrefix + a[i] + ')').rect(shift + i, 0, 1, size.y);
                                }
                            })

                            ctx.drawImage(img1, 0,0)
                            ctx.globalCompositeOperation = 'destination-in'
                            ctx.drawImage(img2, 0,0)
                        })

                        let mask = mask_f(new V2(0, 140), 137)
                        let mask2 = mask_f(new V2(0, 145), 137)
                        

                        //this.img = mask;

                        let aMul = 1;
                        let framesCount = 120
                        let xClamps = [0,50]

                        let frames = createRainFrames({
                            angleClamps: [0,0], lengthClamps: [4,6], xClamps, upperYClamps: [90, 110], lowerY: 170, aValue: fast.r(aMul*0.1, 2), 
                            speedClapms: [2,3], mask, framesCount, itemsCount: 2000, size: this.size, useACurve: false, excludeMask: undefined
                        })

                        let frames2 = createRainFrames({
                            angleClamps: [0,0], lengthClamps: [4,6], xClamps, upperYClamps: [90, 110], lowerY: 170, aValue: fast.r(aMul*0.1, 2), 
                            speedClapms: [2,3], mask: mask2, framesCount, itemsCount: 2000, size: this.size, useACurve: false, excludeMask: undefined
                        })

                        this.left = this.addChild(new GO({
                            position: new V2(0, 2),
                            size: this.size,
                            init() {
                                

                                this.frames = frames;
                                this.registerFramesDefaultTimer({});
                                
                            }
                        }))

                        this.right = this.addChild(new GO({
                            position: new V2(22,2),
                            size: this.size,
                            init() {
                                

                                this.frames = frames2;
                                this.registerFramesDefaultTimer({});
                               
                            }
                        }))
                    }
                }))

                this.windowsDropsStatic = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'windshield_splash_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners);

                        let corners2 = animationHelpers.extractPointData(PP.getLayerByName(model, 'windshield_splash_zone_2')).map(pd => new V2(pd.point));
                        let availableDots2 = appSharedPP.fillByCornerPoints(corners2);

                        let corners3 = animationHelpers.extractPointData(PP.getLayerByName(model, 'windshield_splash_zone_3')).map(pd => new V2(pd.point));
                        let availableDots3 = appSharedPP.fillByCornerPoints(corners3);

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {

                            for (let i = 0; i < 150; i++) {
                                let p = availableDots[getRandomInt(0, availableDots.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.025), 2) + ')').dot(p)
                            }

                            for (let i = 0; i < 50; i++) {
                                let p = availableDots2[getRandomInt(0, availableDots2.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.025), 2) + ')').dot(p)
                            }

                            for (let i = 0; i < 50; i++) {
                                let p = availableDots3[getRandomInt(0, availableDots3.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.025), 2) + ')').dot(p)
                            }
                        })

                    }
                }))

                this.dropsFlow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFlowFrames({framesCount, data, opacityClamps, itemFrameslength, size}) {
                        let frames = [];
                        
                        let itemsData = data.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;

                            let points = appSharedPP.lineByCornerPoints(el.corners);
                            let indexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
                            let opacity = el.opacityClamps ? getRandom(el.opacityClamps[0], el.opacityClamps[1]) : getRandom(opacityClamps[0], opacityClamps[1])

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    p: points[indexValues[f]]
                                };
                            }
                        
                            return {
                                frames,
                                opacity,
                                colorPrefix: el.colorPrefix
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.colorPrefix + itemData.opacity + ')').dot(itemData.frames[f].p)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createDropsFlowFrames({framesCount: 240, data:[
                            { corners: [new V2(69,124),new V2(64,131)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(71,123),new V2(67,131)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(74,125),new V2(72,131)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(78,123),new V2(74,132)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(85,126),new V2(84,132)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(89,124),new V2(87,132)], colorPrefix: whiteColorPrefix },

                            { corners: [new V2(98,124),new V2(98,131)], colorPrefix: whiteColorPrefix, }, //opacityClamps: [0.025,0.05] },
                            { corners: [new V2(95,126),new V2(95,132)], colorPrefix: whiteColorPrefix, }, //opacityClamps: [0.025,0.05] },

                            { corners: [new V2(108,123),new V2(111,131)], colorPrefix: whiteColorPrefix, }, //opacityClamps: [0.025,0.05] },
                            { corners: [new V2(105,126),new V2(106,131)], colorPrefix: whiteColorPrefix, }, //opacityClamps: [0.025,0.05] },

                        ], opacityClamps: [0.05,0.075], itemFrameslength: [50,60], size: this.size});

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.windshieldSmallSplashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'windshield_splash_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0.075, 0.15), 3) + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 240, itemFrameslength: [5, 15], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0, 1) == 0,
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {

                            }
                        });
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 120, itemFrameslength1Clamps: [60, 75], itemFrameslength2Clamps: [10, 10], size: this.size, opacityClamps: [0.1, 0.1],
                            startPositions: [
                                {
                                    data: [new V2(37,149)],
                                    height: 9, tail: 1, useAll: true, colorPrefix: colors.getColorPrefix('#e6f8eb', 'hex'),
                                    opacityClamps: [0.3, 0.3]
                                },
                                {
                                    data: [new V2(128,146), new V2(129,146)],
                                    height: 6, tail: 1, useAll: true, colorPrefix: colors.getColorPrefix('#e6f8eb', 'hex'), 
                                }
                            ], reduceOpacityOnFall: false, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 14)
    }
}