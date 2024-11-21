class SeasideRoad2Scene extends Scene {
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
                fileNamePrefix: 'seasideroad2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    /*
    1. Анимация дерева
        +1.1 Ветер общий раскачивающий листву порывами
        +1.2 Общее шелестение листьев
    2. Анимация кустов
        +2.1 Ветер общий порывами
        +2.2 Общее шелестение кустов
    3. Анимация моря. 
        +3.1 Волны, полосы темной\светлой прозрачности двигающиеся плавно в правый нижний угол
        +3.2 Блёстки воды
        3.3. Слабая анимация дальних деревьев
    +4. Анимация тени    
    +5. Анимация колыхания проводов на столбе
    6. Кот? 
    7. Пролетающая птица, длинная версия?
    */

    start(){
        let model = SeasideRoad2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let blackColorPrefix = 'rgba(0,0,0,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg', 'bg_d'] }),
            init() {
                //
            }
        }), 1)

        this.sea = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['sea'] }),
            init() {
                this.seaL = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createnSeaLFrames({framesCount, data, itemFrameslength, size}) {
                        let frames = [];
                        
                        let aValues = easing.fast({from: 1, to: 0, steps: itemFrameslength, type: 'linear', method: 'base', round: 2})

                        let itemsData = data.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let xShiftValues = easing.fast({from: 0, to: el.xShift, steps: itemFrameslength, type: 'linear', method: 'base', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    a: aValues[f]
                                };
                            }
                        
                            return {
                                cPoints: el.cPoints,
                                c: el.color,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx})
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    ctx.globalAlpha = 1;

                                    if(itemData.frames[f]){
                                        ctx.globalAlpha = itemData.frames[f].a
                                        pp.setFillColor(itemData.c)
                                        pp.lineByCornerPoints(itemData.cPoints.map(p => new V2(p.x + itemData.frames[f].xShift, p.y)))
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let data = PP.getLayerByName(model, 'sea_l').groups.map(g => ({
                            cPoints:g.points.map(p => V2.objToV2(p.point)),
                            color: g.strokeColor,
                            xShift: 6,
                        }));
                        

                        this.frames = this.createnSeaLFrames({
                            framesCount: 150, data,
                            itemFrameslength: 150,
                            size: this.size,
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
                this.animation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSeaFrames({framesCount, yClamps, aClamps, xShiftClamps, itemsCount, availableDots, itemFrameslength, size}) {
                        let frames = [];
                        
                        let height = yClamps[1] - yClamps[0];
                        let aValuesByY = easing.fast({ from: aClamps[0], to: aClamps[1], steps: height, type: 'linear', round: 2});
                        let xShiftValuesByY = easing.fast({ from: xShiftClamps[0], to: xShiftClamps[1], steps: height, type: 'quad', method: 'in'})
        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let isDark = false;//getRandomBool();
                            let p0 = availableDots[getRandomInt(0, availableDots.length-1)];
                            
                            let maxA = aValuesByY[p0.y - yClamps[0]]
                            let xShift = xShiftValuesByY[p0.y - yClamps[0]];
                            
                            // if(isDark) {
                            //     maxA/=4;
                            // }

                            if(!isDark && getRandomInt(0,10) == 0) {
                                maxA*=2;
                                totalFrames = fast.r(totalFrames/2,0);
                            }

                            let aValues = [
                                ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]
                            let xShiftValues = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 1 });

                            
        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    a: aValues[f],
                                };
                            }
                        
                            return {
                                p0, 
                                isDark,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let c = (itemData.isDark ? blackColorPrefix : whiteColorPrefix) + itemData.frames[f].a + ')'
                                        hlp.setFillColor(c).dot(itemData.p0.x + itemData.frames[f].xShift, itemData.p0.y)

                                        // let c1 = (itemData.isDark ? blackColorPrefix : whiteColorPrefix) + fast.r(itemData.frames[f].a/2,2) + ')'
                                        // hlp.setFillColor(c1)
                                        //     .dot(itemData.p0.x + itemData.frames[f].xShift-1, itemData.p0.y)
                                        //     //.dot(itemData.p0.x + itemData.frames[f].xShift+1, itemData.p0.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },        
                    init() {
                        this.frames = this.createSeaFrames({ framesCount: 300, yClamps: [93,127], aClamps: [0.1, 0.4], xShiftClamps: [0,6], itemsCount: 1500, itemFrameslength: 100, size: this.size,
                            availableDots: appSharedPP.fillByCornerPoints(animationHelpers.extractPointData(PP.getLayerByName(model, 'sea_animation_zone')).map(pd => new V2(pd.point)))
                        });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [20,40], size: this.size, 
                            pointsData: animationHelpers.extractPointData( PP.getLayerByName(model, 'sea_p'))});

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['road'] }),
            init() {
                this.dynamicAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let animation = {
                            type: 0,
                            shiftDirection: V2.left
                        };

                        let animation2 = {
                            type: 0,
                            shiftDirection: V2.right
                        };

                        let triggerData = [
                            {
                                easingType: 'linear', easingMethod: 'base',
                                cornerPoints: [new V2(220,140), new V2(220,200)],
                                p0: new V2(220,200), p1: new V2(-10, 200),
                                triggerMovementStartIndex: 0, 
                                triggerMovementFramesCount: 150,
                                itemFramesCount: [30, 90],
                                startFrameIndex: [0, 80],
                                animation: animation,
                            },
                            {
                                easingType: 'linear', easingMethod: 'base',
                                cornerPoints: [new V2(220,140), new V2(220,200)],
                                p0: new V2(220,200), p1: new V2(-10, 200),
                                triggerMovementStartIndex: 80, 
                                triggerMovementFramesCount: 150,
                                itemFramesCount: [30, 90],
                                startFrameIndex: [0, 80],
                                animation: animation2,
                            }
                        ]

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: 150,
                            triggerData: triggerData,
                            img: this.parent.img,
                            size: this.size,
                            excludeColors: ['#1b2429', '#1f2b31', '#233238', '#2f4b4f', '#2b4347', '#273a40']
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                 this.basicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let targetColors = ['#d6c0ab', '#bba392', '#a1867a', '#866961', '#655753', '#444446','#4f3a36']
                                let pixelsData = getPixels(this.parent.img, this.size);
                                let pData = [];
                                let pDataRot = [];
                                let clamps = [-1,1]
                                let yClamps = [0,0]
                
                                pixelsData.forEach(pd => {

                                    if(getRandomInt(0,2) == 0) {
                                        let color =  colors.rgbToHex(pd.color)
                                        
                                        if(targetColors.indexOf(color) != -1){
                                            pData[pData.length] = { point: pd.position.add(V2.random(clamps, yClamps)), color } 
                                        }
                                    }
                                });
                                

                                this.frames = animationHelpers.createMovementFrames({ framesCount: 100, pointsData: pData, itemFrameslength: [30,60], size: this.size })
                                this.registerFramesDefaultTimer({});
                            }
                        }))
            }
        }), 5)

        this.pole = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['pole'] }),
            init() {
                let wiresData = [
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(154, 9)] }, 
                            { dots: [new V2(180,14), new V2(180.5,14)] }, 
                            { dots: [new V2(210,16), new V2(211,16)] }, 
                        ],xClamps: [154,200], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.3)', usePP: false
                    },
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(152, 11)] }, 
                            { dots: [new V2(177, 20), new V2(177.5,20)] }, 
                            { dots: [new V2(210,25), new V2(211,25)] }, 
                        ],xClamps: [152,200], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.3)', usePP: false
                    },
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(77,21), new V2(78,21)] }, 
                            { dots: [new V2(117,19), new V2(116.5,19)] }, 
                            { dots: [new V2(146, 13)] }, 
                        ],xClamps: [104,146], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.3)', usePP: false
                    },
                ]

                this.wires = wiresData.map((d, i) => 
                    this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: animationHelpers.createWiresFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({ startFrameIndex: i*15 });
                    }
                })))

                this.cutWire = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = [];

                        let totalFrames = 150;
                        let cPointsCount = 4
                        let cPointsData = new Array(cPointsCount).fill().map((_,i) => new V2(142, 14 + i*20))//[new V2(142,14), new V2(142,44), new V2(142,64), new V2(142,64)];
                        let xValues = new Array(cPointsCount).fill().map((_,i) => [
                            ...easing.fast({from: cPointsData[i].x -0.9*i, to: cPointsData[i].x+(i > 0 ? 0.9*i-1 : 0), steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: cPointsData[i].x+(i > 0 ? 0.9*i-1 : 0), to: cPointsData[i].x-0.9*i, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ])

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                pp.setFillColor('#8A9A9A')
                                let corners = cPointsData.map((p, i) => new V2(xValues[i][f], p.y))
                                pp.lineByCornerPoints(corners)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.tree = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.leftPart = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['tree_left'] }),
                    init() {
                        this.dynamicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let animation = {
                                    type: 0,
                                    shiftDirection: V2.left
                                };
        
                                let triggerData = [
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(30,81), new V2(30,53), new V2(19, 29)],
                                        p0: new V2(30,81), p1: new V2(-10,80),
                                        triggerMovementStartIndex: 30, 
                                        triggerMovementFramesCount: 30,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 100],
                                        animation: animation,
                                    },
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(30,81), new V2(30,53), new V2(19, 29)],
                                        p0: new V2(30,81), p1: new V2(-10,80),
                                        triggerMovementStartIndex: 30, 
                                        triggerMovementFramesCount: 240,
                                        itemFramesCount: [20, 60],
                                        startFrameIndex: [0, 240],
                                        animation: animation,
                                    }
                                ]
        
                                this.frames = animationHelpers.createDynamicMovementFrames({
                                    framesCount: 300,
                                    triggerData: triggerData,
                                    img: this.parent.img,
                                    size: this.size
                                });
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        // this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

                       
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['tree', 'tree_sky_border'] }),
                    init() {
                        this.dynamicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let animation = {
                                    type: 0,
                                    shiftDirection: V2.left
                                };

                                let animation2 = {
                                    type: 0,
                                    shiftDirection: V2.right
                                };
        
                                let triggerData = [
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(82,86), new V2(131, 0)],
                                        p0: new V2(82,86), p1: new V2(45,78),
                                        triggerMovementStartIndex: 10, 
                                        triggerMovementFramesCount: 30,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 100],
                                        animation: animation,
                                    },
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(82,86), new V2(131, 0)],
                                        p0: new V2(82,86), p1: new V2(36,67),
                                        triggerMovementStartIndex: 60, 
                                        triggerMovementFramesCount: 240,
                                        itemFramesCount: [20, 60],
                                        startFrameIndex: [0, 240],
                                        animation: animation,
                                    }
                                ]
        
                                this.frames = animationHelpers.createDynamicMovementFrames({
                                    framesCount: 300,
                                    triggerData: triggerData,
                                    img: this.parent.img,
                                    size: this.size
                                });
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        // this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

                        //  this.basicAnimation = this.addChild(new GO({
                        //     position: new V2(),
                        //     size: this.size,
                        //     init() {
                        //         let targetColors = ['#151a1d', '#1b2123', '#202729', '#2b3435', '#3a4542', '#5e6a66', '#818e89', '#a4b2ac', '']
                        //         let pixelsData = getPixels(this.parent.img, this.size);
                        //         let pData = [];
                        //         let pDataRot = [];
                        //         let clamps = [-1,0]
                
                        //         pixelsData.forEach(pd => {

                        //             if(getRandomInt(0,2) == 0) {
                        //                 let color =  colors.rgbToHex(pd.color)
                                        
                        //                 if(targetColors.indexOf(color) != -1){
                        //                     pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                        //                 }
                        //             }
                        //         });
                                

                        //         this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData: pData, itemFrameslength: [30,60], size: this.size })
                        //         this.registerFramesDefaultTimer({});
                        //     }
                        // }))
                    }
                }))
            }
        }), 9)

        this.bushes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#151a1d', '#1b2123','#202729', '#2b3435', '#393d3c', '#434845', '#4d534d', '#575e56', '#656e67', '#737e78', '#818e89', '#8f9f9a', '#9cafac']
                this.central = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    //img: PP.createImage(model, { renderOnly: ['bushes_с'] }),
                    init() {
                        let baseImg = PP.createImage(model, { renderOnly: ['bushes_с'] });

                        this.dynamicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let animation = {
                                    type: 0,
                                    shiftDirection: V2.left
                                };
        
                                let triggerData = [
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(147,134), new V2(145,108)],
                                        p0: new V2(147,134), p1: new V2(123,137),
                                        triggerMovementStartIndex: 10, 
                                        triggerMovementFramesCount: 30,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 90],
                                        animation: animation,
                                    },

                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(120,97), new V2(121,133)],
                                        p0: new V2(121,133), p1: new V2(76,130),
                                        triggerMovementStartIndex: 60, 
                                        triggerMovementFramesCount: 40,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 90],
                                        animation: animation,
                                    },

                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(78,97), new V2(77,132)],
                                        p0: new V2(77,132), p1: new V2(29,134),
                                        triggerMovementStartIndex: 110, 
                                        triggerMovementFramesCount: 40,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 90],
                                        animation: animation,
                                    },
                                    // {
                                    //     easingType: 'quad', easingMethod: 'out',
                                    //     cornerPoints: [new V2(148,141), new V2(146,95)],
                                    //     p0: new V2(148,141), p1: new V2(35,130),
                                    //     triggerMovementStartIndex: 60, 
                                    //     triggerMovementFramesCount: 260,
                                    //     itemFramesCount: [20, 60],
                                    //     startFrameIndex: [0, 260],
                                    //     animation: animation,
                                    // }
                                ]
        
                                this.frames = animationHelpers.createDynamicMovementFrames({
                                    framesCount: 150,
                                    triggerData: triggerData,
                                    img: baseImg,
                                    size: this.size
                                });
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        // this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

                        this.basicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                
                                let pixelsData = getPixels(baseImg, this.size);
                                let pData = [];
                                let pDataRot = [];
                                let clamps = [-1,1]
                
                                pixelsData.forEach(pd => {

                                    if(getRandomBool()) {
                                        let color =  colors.rgbToHex(pd.color)

                                        if(targetColors.indexOf(color) != -1){
                                            pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                        }
                                    }
                                });
                                

                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData: pData, itemFrameslength: [20,30], size: this.size })
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.right = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bushes_r'] }),
                    init() {
                        this.dynamicAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let animation = {
                                    type: 0,
                                    shiftDirection: V2.left
                                };
        
                                let triggerData = [
                                    {
                                        easingType: 'quad', easingMethod: 'out',
                                        cornerPoints: [new V2(220,35), new V2(220,134)],
                                        p0: new V2(220,134), p1: new V2(156, 130),
                                        triggerMovementStartIndex: 0, 
                                        triggerMovementFramesCount: 20,
                                        itemFramesCount: [30, 90],
                                        startFrameIndex: [0, 100],
                                        animation: animation,
                                    }
                                ]
        
                                this.frames = animationHelpers.createDynamicMovementFrames({
                                    framesCount: 150,
                                    triggerData: triggerData,
                                    img: this.parent.img,
                                    size: this.size
                                });
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        // this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

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

                                        if(targetColors.indexOf(color) != -1){
                                            pData[pData.length] = { point: pd.position.add(V2.random(clamps, clamps)), color } 
                                        }
                                    }
                                });
                                

                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData: pData, itemFrameslength: [20,30], size: this.size })
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.right_2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bushes_r2'] }),
                    init() {
                        //
                    }
                }))
            }
        }), 7)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [20,40], size: this.size, 
                            pointsData: animationHelpers.extractPointData( PP.getLayerByName(model, 'car_p'))});

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 13)
    }
}