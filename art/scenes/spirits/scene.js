class SpiritsScene extends Scene {
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
                size: new V2(200,134).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'spirits',
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
        let model = SpiritsScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })

                this.pManual = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'bg_p'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.darkOverlay1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(1,42,122,0.2)').dot(0,0)
                })
            }
        }), 4)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['house'] })

                this.pAuto = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let c = ['#5f6c5d', '#505f51', '#405144', '#38433b', '#2f3531']
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                            pdPredicate: () => getRandomBool(),
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'house')).filter(p => c.indexOf(p.color) != -1).map(pd => ({
                                color: pd.color, point: new V2(pd.point.x + getRandomInt(-1, 1), pd.point.y + getRandomInt(-1, 1))
                            }))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.pManual = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'house_p'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.house_trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['house_trees'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                            pdPredicate: () => getRandomInt(0,2) == 0,
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'house_trees'))//.filter(p => p.color == '#16171e')
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.darkOverlay2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(1,42,122,0.2)').dot(0,0)
                })
            }
        }), 4)

        this.house_right = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['house_right'] })
            }
        }), 15)

        this.house_trees_2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = PP.createImage(model, { renderOnly: ['house_trees_2'] })

                
                let eMethods = ['in', 'out', 'inOut'];
                let shiftDirections = [new V2(1,0),  new V2(0, 1), new V2(0,-1)] //new V2(-1, 0),

                let triggerData = [];
                let framesCount = 300;
                let tCount = 5;
                for(let i = 0; i < tCount; i++) {
                    let cp0 = new V2(getRandomInt(143, 152), getRandomInt(-8,3));
                    let cp1 = cp0.add(new V2(getRandomInt(-5,5), getRandomInt(25,30)))

                    let easingType = 'quad';
                    let method = eMethods[getRandomInt(0, eMethods.length-1)]
                    triggerData.push({
                        easingType: easingType, easingMethod: method,
                        cornerPoints: [cp0, cp1], 
                        p0: cp0, p1: cp0.add(V2.right.rotate(getRandomInt(-10,20)).mul(getRandomInt(40, 65))),
                        triggerMovementStartIndex: i*framesCount/tCount + getRandomInt(0, 15), triggerMovementFramesCount: getRandomInt(90,150), //getRandomInt(0, 250)
                        itemFramesCount: [getRandomInt(40,50), getRandomInt(80, 100)],
                        startFrameIndex: [0, 40], //debugColor: '#FF0000',
                        animation: {
                            type: 0,
                            shiftDirection: i%2 == 0 ? V2.right : shiftDirections[getRandomInt(0, shiftDirections.length-1)]
                        }
                    })
                }
                // let tCount = 10;
                // for(let i = 0; i < tCount; i++) {
                //     let cp0 = new V2(getRandomInt(143, 152), getRandomInt(-8,3));
                //     let cp1 = cp0.add(new V2(getRandomInt(-5,5), getRandomInt(10,30)))

                //     let easingType = 'quad';
                //     let method = eMethods[getRandomInt(0, eMethods.length-1)]
                //     triggerData.push({
                //         easingType: easingType, easingMethod: method,
                //         cornerPoints: [cp0, cp1], 
                //         p0: cp0, p1: cp0.add(V2.right.rotate(getRandomInt(-10,20)).mul(getRandomInt(20, 60))),
                //         triggerMovementStartIndex: i*framesCount/tCount + getRandomInt(0, 15), triggerMovementFramesCount: getRandomInt(90,150), //getRandomInt(0, 250)
                //         itemFramesCount: [getRandomInt(20,40), getRandomInt(50, 80)],
                //         startFrameIndex: [0, 40],
                //         animation: {
                //             type: 0,
                //             shiftDirection: shiftDirections[getRandomInt(0, shiftDirections.length-1)]
                //         }
                //     })
                // }

                for(let i = 0; i < 4; i++) {
                    let cp0 = new V2(getRandomInt(150, 160), getRandomInt(30,35));
                    let cp1 = cp0.add(new V2(getRandomInt(-5,5), getRandomInt(10,30)))

                    let easingType = 'quad';
                    let method = eMethods[getRandomInt(0, eMethods.length-1)]
                    triggerData.push({
                        easingType: easingType, easingMethod: method,
                        cornerPoints: [cp0, cp1], 
                        p0: cp0, p1: cp0.add(V2.right.rotate(getRandomInt(-10,10)).mul(getRandomInt(30, 60))),
                        triggerMovementStartIndex: i*framesCount/4 + getRandomInt(0, 15), triggerMovementFramesCount: getRandomInt(60,90), //getRandomInt(0, 250)
                        itemFramesCount: [getRandomInt(20,40), getRandomInt(50, 80)],
                        startFrameIndex: [0, 20],
                        animation: {
                            type: 0,
                            shiftDirection: shiftDirections[getRandomInt(0, shiftDirections.length-1)]
                        }
                    })
                }

                triggerData.push({
                    easingType: 'quad', easingMethod: 'inOut',
                    cornerPoints: [new V2(187, 30), new V2(199,27)], 
                    p0: new V2(187, 30), p1: new V2(187, 0),
                    triggerMovementStartIndex: 20, triggerMovementFramesCount: 40, //getRandomInt(0, 250)
                    itemFramesCount: [30, 70],
                    startFrameIndex: [0, 10],
                    animation: {
                        type: 0,
                        shiftDirection: V2.up
                    }
                })

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(183, 63), new V2(174,86)], 
                    p0: new V2(183, 63), p1: new V2(220, 64),
                    triggerMovementStartIndex: 100, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                    itemFramesCount: [50, 90],
                    startFrameIndex: [0, 50],
                    animation: {
                        type: 0,
                        shiftDirection: V2.right
                    }
                })

                this.frames = createMovementFrames({
                    framesCount: framesCount,
                    triggerData: triggerData,
                    img: PP.createImage(model, { renderOnly: ['house_trees_2'] }),
                    size: this.size
                })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }), 20)

        this.road_bridge = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['road_bridge'] })
            }
        }), 25)

        this.close_tree_01 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = PP.createImage(model, { renderOnly: ['close_tree_01'] })

                let triggerData = [];
                let framesCount = 300;
                let animation = {
                    type: 0,
                    shiftDirection: V2.right
                };

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(89,74), new V2(73,94)], 
                    p0: new V2(89,74), p1: new V2(113,78),
                    triggerMovementStartIndex: 20, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                    itemFramesCount: [50, 90],
                    startFrameIndex: [0, 50],
                    animation
                })

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(74, 95), new V2(76,113)], 
                    p0: new V2(74, 95), p1: new V2(97,96),
                    triggerMovementStartIndex: 60, triggerMovementFramesCount: 80, //getRandomInt(0, 250)
                    itemFramesCount: [40, 80],
                    startFrameIndex: [0, 50],
                    animation
                })

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(113,80), new V2(126,93)], 
                    p0: new V2(113,80), p1: new V2(100,93),
                    triggerMovementStartIndex: 100, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                    itemFramesCount: [40, 80],
                    startFrameIndex: [0, 50],
                    animation: {
                        type: 0,
                        shiftDirection: V2.right
                    }
                })

                


                this.frames = createMovementFrames({
                    framesCount: framesCount,
                    triggerData: triggerData,
                    img: PP.createImage(model, { renderOnly: ['close_tree_01'] }),
                    size: this.size
                })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });

                this.pAuto = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                            pdPredicate: () => getRandomInt(0,3) == 0,
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'close_tree_01'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 27)

        this.close_tree_02 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = PP.createImage(model, { renderOnly: ['close_tree_02'] })

                let triggerData = [];
                let framesCount = 300;
                let animation = {
                    type: 0,
                    shiftDirection: V2.right
                };

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(114,97), new V2(102,106)], 
                    p0: new V2(114,97), p1: new V2(130,104),
                    triggerMovementStartIndex: 60, triggerMovementFramesCount: 80, //getRandomInt(0, 250)
                    itemFramesCount: [50, 90],
                    startFrameIndex: [0, 50],
                    animation
                })

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(134,102), new V2(147,110)], 
                    p0: new V2(134,102), p1: new V2(124,114),
                    triggerMovementStartIndex: 120, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                    itemFramesCount: [50, 90],
                    startFrameIndex: [0, 50],
                    animation
                })

                triggerData.push({
                    easingType: 'quad', easingMethod: 'out',
                    cornerPoints: [new V2(156,109), new V2(144,119)], 
                    p0: new V2(156,109), p1: new V2(168,117),
                    triggerMovementStartIndex: 160, triggerMovementFramesCount: 100, //getRandomInt(0, 250)
                    itemFramesCount: [50, 90],
                    startFrameIndex: [0, 50],
                    animation
                })


                this.frames = createMovementFrames({
                    framesCount: framesCount,
                    triggerData: triggerData,
                    img: PP.createImage(model, { renderOnly: ['close_tree_02'] }),
                    size: this.size
                })

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });

                this.pAuto = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: [50,100], size: this.size, 
                            pdPredicate: () => getRandomInt(0,3) == 0,
                            pointsData: 
                            animationHelpers.extractPointData(SpiritsScene.models.main.main.layers.find(l => l.name == 'close_tree_02'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 28)

        this.road_close = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['road_close'] })
            }
        }), 30)

        this.darkOverlay3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(1,42,122,0.2)').dot(0,0)
                })
            }
        }), 34)

        this.closest_house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['closest_house'] })

                this.lightFlickering = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let imgs = [
                            PP.createImage(model, { renderOnly: ['closest_house_f0'], forceVisibility: { closest_house_f0: { visible: true} } }),
                            PP.createImage(model, { renderOnly: ['closest_house_f1'], forceVisibility: { closest_house_f1: { visible: true} } }),
                            PP.createImage(model, { renderOnly: ['closest_house_f2'], forceVisibility: { closest_house_f2: { visible: true} } }),
                            PP.createImage(model, { renderOnly: ['closest_house_f4'], forceVisibility: { closest_house_f4: { visible: true} } }),
                            undefined,
                        ]

                        this.currentFrame = 0;
                        let totalFrames = getRandomInt(5,10);
                        this.img = imgs[getRandomInt(0, imgs.length-1)];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            //this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                                totalFrames = getRandomInt(5,10);
                                this.img = imgs[getRandomInt(0, imgs.length-1)];
                            }
                        })
                    }
                }))

                // this.vampire = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size.mul(2),
                //     init() {
                //         console.log(this.size)
                //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //             //ctx.scale(0.5, 0.5)
                //             ctx.drawImage(SCG.images.vampire, 100, 100, 60, 60);
                //         });
                //     }
                // }))
                
            }
        }), 35)

        let colorsCache = {};

        let rgbToHex = (rgb) => {
            let key = rgb[0]*1000000 + rgb[1]*1000 + rgb[2];
            if(!colorsCache[key]) {
                colorsCache[key] = colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' })
            }

            return colorsCache[key];
        }


        let createMovementFrames = function({framesCount, 
            triggerData = [
                { 
                    easingType, easingMethod, cornerPoints, p0, p1, triggerMovementFramesCount, triggerMovementStartIndex,
                    itemFramesCount, startFrameIndex, debugColor,
                    animation: {}
                }
            ], 
            img, itemFrameslength, size}) {
            let frames = [];
            
            let sharedPP = PP.createNonDrawingInstance();
            let modifiersItemsData = [];
            let modifiersItemsDataFastAccess = [];

            let createModifiersContainer = (p) => {
                if(modifiersItemsData[p.y] == undefined) {
                    modifiersItemsData[p.y] = [];
                }

                if(modifiersItemsData[p.y][p.x] == undefined) {
                    modifiersItemsData[p.y][p.x] = {
                        frames: [],
                        p: p
                    };

                    modifiersItemsDataFastAccess.push(modifiersItemsData[p.y][p.x]);
                }
            }

            let originPixelsMatrix = getPixelsAsMatrix(img, size);

            for(let tdIndex = 0; tdIndex < triggerData.length; tdIndex++) {
                let td = triggerData[tdIndex];

                let triggerLinePoints = sharedPP.lineByCornerPoints(td.cornerPoints).map(p => new V2(p));
                let triggerMovementPoints = sharedPP.lineV2(td.p0, td.p1).map(p => new V2(p));
                let triggerMovementPointsIndices = easing.fast({
                    from: 0, to: triggerMovementPoints.length-1, steps: td.triggerMovementFramesCount, 
                    type: td.easingType, method: td.easingMethod, round: 0 })

                let triggeredOriginPoints = [];

                for(let f = 0; f < td.triggerMovementFramesCount; f++) {
                    let triggerLineShift = triggerMovementPoints[triggerMovementPointsIndices[f]].substract(td.p0);

                    let currentTriggerLinePoints = triggerLinePoints.map(tlp => tlp.add(triggerLineShift));

                    currentTriggerLinePoints.forEach(triggerPoint => {
                        if(triggeredOriginPoints[triggerPoint.y] && triggeredOriginPoints[triggerPoint.y][triggerPoint.x]) {
                            return; //уже активировано
                        }

                        if(!originPixelsMatrix[triggerPoint.y] || !originPixelsMatrix[triggerPoint.y][triggerPoint.x]) {
                            return; // в матрице пусто
                        }

                        // формируем контейнер для записи при её отсутствии в коллекции модификаторов по x,y
                        createModifiersContainer(triggerPoint);

                        // для текущего триггера, отмечаем, что данный пиксель уже подвергя модификации - активируем
                        if(triggeredOriginPoints[triggerPoint.y] == undefined) {
                            triggeredOriginPoints[triggerPoint.y] = [];
                        }

                        if(triggeredOriginPoints[triggerPoint.y][triggerPoint.x] == undefined) {
                            triggeredOriginPoints[triggerPoint.y][triggerPoint.x] = {
                                triggered: true
                            };
                        }

                        let startFrameIndex = f + td.triggerMovementStartIndex + (isArray(td.startFrameIndex) ? getRandomInt(td.startFrameIndex) : td.startFrameIndex);
                        let totalFrames = isArray(td.itemFramesCount) ? getRandomInt(td.itemFramesCount) : td.itemFramesCount;
                        
                        let currentAnimationValues = {}
                        if(td.animation && td.animation.type == 0) {
                            let animationStep = fast.r(totalFrames/4);
                            currentAnimationValues.animationStep = animationStep;
                            currentAnimationValues.steps = [
                                { values: easing.fast({from: 0, to: 1, steps: animationStep, type: 'quad', method: 'inOut', round: 0}) },
                                { values: easing.fast({from: 1, to: 0, steps: animationStep, type: 'quad', method: 'inOut', round: 0}) },
                                { values: easing.fast({from: 0, to: 1, steps: animationStep, type: 'quad', method: 'inOut', round: 0}) },
                                { values: easing.fast({from: 1, to: 0, steps: animationStep, type: 'quad', method: 'inOut', round: 0}) }
                            ]

                            currentAnimationValues.color = rgbToHex(originPixelsMatrix[triggerPoint.y][triggerPoint.x]);
                            
                            let neighborPixel = triggerPoint.add(td.animation.shiftDirection);
                            let oppositePixel = triggerPoint.add(td.animation.shiftDirection.mul(-1));
                            
                            let oppositePixelColor = undefined
                            if(originPixelsMatrix[oppositePixel.y] && originPixelsMatrix[oppositePixel.y][oppositePixel.x]) {
                                oppositePixelColor = rgbToHex(originPixelsMatrix[oppositePixel.y][oppositePixel.x]);
                            }

                            currentAnimationValues.oppositePixelColor = oppositePixelColor;

                            createModifiersContainer(neighborPixel);
                            currentAnimationValues.neighborPixel = neighborPixel;
                        }

                        for(let _f = 0; _f < totalFrames; _f++){
                            let frameIndex = _f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            // в конкретной точке модификатора для конкретного фрейма создаем коллекцию модификаций, если таковой нету
                            if(modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex] == undefined) {
                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex] = [];
                            }

                            if(td.debugColor) {
                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                    type: 1,
                                    color: td.debugColor
                                });
                            }
                            else if(td.animation) {
                                if(td.animation.type == 0) {
                                    let np = currentAnimationValues.neighborPixel;
                                    let currentAnimationStep = fast.f(_f/currentAnimationValues.animationStep);
                                    if(modifiersItemsData[np.y][np.x].frames[frameIndex] == undefined) {
                                        modifiersItemsData[np.y][np.x].frames[frameIndex] = [];
                                    }
                                    switch(currentAnimationStep) {
                                        case 0: 
                                            if(currentAnimationValues.steps[currentAnimationStep].values[_f%currentAnimationValues.animationStep] == 1) {
                                                modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                    type: 1,
                                                    color: currentAnimationValues.color
                                                });
                                            }
                                            break;
                                        case 1: 
                                            modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                type: 1,
                                                color: currentAnimationValues.color
                                            });
                                            if(currentAnimationValues.steps[currentAnimationStep].values[_f%currentAnimationValues.animationStep] == 0) {
                                                
                                                if(currentAnimationValues.oppositePixelColor) {
                                                    modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                        type: 1,
                                                        color: currentAnimationValues.oppositePixelColor
                                                    });
                                                }
                                                else {
                                                    modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                        type: 0
                                                    });
                                                }
                                                
                                            }
                                            break;
                                        case 2: 
                                            modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                type: 1,
                                                color: currentAnimationValues.color
                                            });
                                            if(currentAnimationValues.steps[currentAnimationStep].values[_f%currentAnimationValues.animationStep] == 0) {
                                                if(currentAnimationValues.oppositePixelColor) {
                                                    modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                        type: 1,
                                                        color: currentAnimationValues.oppositePixelColor
                                                    })
                                                }
                                                else {
                                                    modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                        type: 0
                                                    })
                                                }
                                                
                                            }
                                            break;
                                        case 3: 
                                            if(currentAnimationValues.steps[currentAnimationStep].values[_f%currentAnimationValues.animationStep] == 1) {
                                                modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                    type: 1,
                                                    color: currentAnimationValues.color
                                                });
                                            }
                                            break;
                                    }
                                }
                            }
                            
                        }
                        
                    })
                }
            }

            // let itemsData = new Array(itemsCount).fill().map((el, i) => {
            //     let startFrameIndex = getRandomInt(0, framesCount-1);
            //     let totalFrames = itemFrameslength;
            
            //     let frames = [];
            //     for(let f = 0; f < totalFrames; f++){
            //         let frameIndex = f + startFrameIndex;
            //         if(frameIndex > (framesCount-1)){
            //             frameIndex-=framesCount;
            //         }
            
            //         frames[frameIndex] = {
            
            //         };
            //     }
            
            //     return {
            //         frames
            //     }
            // })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    ctx.drawImage(img, 0,0);

                    for(let mIndex = 0; mIndex < modifiersItemsDataFastAccess.length; mIndex++ ) {
                        let mData = modifiersItemsDataFastAccess[mIndex];

                        if(mData.frames[f]) {
                            let isClear = false;
                            let fillColor = undefined;

                            for(let mi = 0; mi < mData.frames[f].length; mi++) {
                                let mValue = mData.frames[f][mi];

                                if(mValue.type == 0) { // clear
                                    if(fillColor) {
                                        continue;
                                    }

                                    isClear = true;
                                }
                                else if(mValue.type == 1) { // add
                                    isClear = false;
                                    fillColor = mValue.color
                                }
                            }

                            if(fillColor) {
                                hlp.setFillColor(fillColor).dot(mData.p);
                            }
                            else if(isClear) {
                                hlp.clear(mData.p.x, mData.p.y)
                            }
                        }
                    }

                });
            }
            
            return frames;
        }
    }
}