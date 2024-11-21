class RoadsideScene extends Scene {
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
                fileNamePrefix: 'roadside',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    /* TODO 

    +1. Дождь перед фонарём
    +2. Добдь у задних фар
    +3. Дождь возле передних фар
    +4. Капли на заднем стекле, некоторые из них стекают?
    +4.1 Капли капают с зеркальца
    +4.2 Капли на боковых стёклах
    +4.3 Капли стекают по стеклу
    +5. рябь на луже, 
    +6. Эффекты на поврехности
    +7. Эффекты на фонарях
    -7.1 Движение участков градиента ?
    +8. Анимация на окнах ?
    -9. Подсветка номера моргает ?
    +10. Фронтальный дождь, 1 слой

    */

    start() {
        let model = RoadsideScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

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
            framesCount, itemsCount, itemFrameslengthClamps, size }) {
            let frames = [];

            //let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}
            //speedClapms = speedClapms.map(v => fast.r(v*0.5))

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);

                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);
                
                let frames = [];
                let current = p0;
                let ly =  isArray(lowerY) ? getRandomInt(lowerY) : lowerY;
                
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
                    lowerY: ly
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

                            pp.lineV2(p0, p1);
                        }

                    }

                    if (mask) {
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(mask, 0, 0)
                    }
                });
            }

            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg', 'lamps_d1'] })
            }
        }), 1)

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['houses', 'houses_d'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [20, 30], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'houses_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [50, 60], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'houses_p2'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [15, 20], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'ground_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.puddleRipples = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRippleFrames({
                            framesCount: 120, itemFrameslengthClamps: [20, 25],
                            widthClamps: [2, 3], size: this.size,
                            data: animationHelpers.extractPointData(PP.getLayerByName(model, 'puddle_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        let mainRainColor = 'rgba(240,254,251,'
        let mainRainMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(140, 90), radius: new V2(40, 50).mul(0.8).toInt(), gradientOrigin: new V2(140, 52), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
            })
        })

        let mainRainMask2 = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(140, 90), radius: new V2(38, 42).mul(1.3).toInt(), gradientOrigin: new V2(140, 52), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
            })
        })

        let mainRainMask3 = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(140, 90), radius: new V2(38, 42).mul(3).toInt(), gradientOrigin: new V2(140, 52), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
            })
        })

        this.mainRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = mainRainMask;
                this.layers = [
                    {
                        angleClamps: [0, 0], lengthClamps: [2, 2], xClamps: [0, 200], upperYClamps: [-10, 30], lowerY: 140,
                        speedClapms: [1.5, 2], framesCount: 120, itemsCount: 2000, size: this.size, mask: mainRainMask3, aValue: 0.05
                    },
                    {
                        angleClamps: [0, 0], lengthClamps: [2, 3], xClamps: [90, 180], upperYClamps: [-10, 30], lowerY: 140,
                        speedClapms: [1.5, 2], framesCount: 120, itemsCount: 1500, size: this.size, mask: mainRainMask2, aValue: 0.1
                    },
                    {
                        angleClamps: [0, 0], lengthClamps: [3, 4], xClamps: [90, 180], upperYClamps: [0, 30], lowerY: 140,
                        speedClapms: [2.5, 3], framesCount: 120, itemsCount: 1000, size: this.size, mask: mainRainMask, aValue: 0.25
                    }

                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames(d);

                        this.registerFramesDefaultTimer({});
                    }
                })))

            }
        }), 6)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.frontRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mainRainColor = 'rgba(240,254,251,'
                        let mainRainMask = createCanvas(this.size, (ctx, size, hlp) => {
                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(115, 137), radius: new V2(15, 20), gradientOrigin: new V2(105, 127), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: -60,
                            })
                        })

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.25;
                            ctx.drawImage(mainRainMask, 0, 0);
                        })

                        this.layers = [
                            {
                                angleClamps: [0, 0], lengthClamps: [12, 14], xClamps: [100, 130], upperYClamps: [90, 120], lowerY: 155,
                                speedClapms: [9, 11], framesCount: 120, itemsCount: 400, size: this.size, mask: mainRainMask, aValue: 0.4
                            }

                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createRainFrames(d);

                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['car'] })
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [30, 40], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'car_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.blinking = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let img = PP.createImage(model, { renderOnly: ['dark_overlay'], forceVisibility: { dark_overlay: {visible: true} } })
                //         let framesInfo = [
                //             ...new Array(30).fill(false),
                //             ...new Array(15).fill(true),
                //             ...new Array(10).fill(false),
                //             ...new Array(5).fill(true),
                            
                //             ...new Array(60).fill(false),
                //         ]

                //         this.currentFrame = 0;
                //         this.img = framesInfo[this.currentFrame] ? img : undefined;
                        
                //         this.timer = this.regTimerDefault(10, () => {
                //             this.img = framesInfo[this.currentFrame] ? img : undefined
                //             this.currentFrame++;
                //             if(this.currentFrame == framesInfo.length){
                //                 this.currentFrame = 0;
                //             }
                //         })
                //     }
                // }))

                this.windowDropsStatic = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners);

                        let corners2 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone_2')).map(pd => new V2(pd.point));
                        let availableDots2 = appSharedPP.fillByCornerPoints(corners2);

                        let corners3 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone_3')).map(pd => new V2(pd.point));
                        let availableDots3 = appSharedPP.fillByCornerPoints(corners3);

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {

                            for (let i = 0; i < 700; i++) {
                                let p = availableDots[getRandomInt(0, availableDots.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.05), 2) + ')').dot(p)
                            }

                            for (let i = 0; i < 300; i++) {
                                let p = availableDots2[getRandomInt(0, availableDots2.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.075), 2) + ')').dot(p)
                            }

                            for (let i = 0; i < 200; i++) {
                                let p = availableDots3[getRandomInt(0, availableDots3.length - 1)]
                                hlp.setFillColor(whiteColorPrefix + fast.r(getRandom(0, 0.05), 2) + ')').dot(p)
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
                            let opacity = getRandom(opacityClamps[0], opacityClamps[1])

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
                        this.frames = this.createDropsFlowFrames({framesCount: 120, data:[
                            { corners: [new V2(39,106),new V2(33,115)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(47,101),new V2(41,114)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(59,106),new V2(57,114)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(74,103),new V2(73,113)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(76,104),new V2(75,113)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(79,108),new V2(80,112)], colorPrefix: whiteColorPrefix },

                            { corners: [new V2(91,105),new V2(93,116)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(95,108),new V2(96,117)], colorPrefix: whiteColorPrefix },
                            { corners: [new V2(100,108),new V2(101,117)], colorPrefix: whiteColorPrefix },
                        ], opacityClamps: [0.1,0.15], itemFrameslength: [60,70], size: this.size});

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.backSmallSplashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0, 0.2), 2) + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [5, 15], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0, 2) == 0,
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
                            framesCount: 120, itemFrameslength1Clamps: [60, 75], itemFrameslength2Clamps: [15, 15], size: this.size, opacityClamps: [0.2, 0.2],
                            startPositions: [
                                {
                                    data: [new V2(112, 119)],
                                    height: 30, tail: 1, useAll: true, colorPrefix: whiteColorPrefix
                                },
                                {
                                    data: [new V2(16, 139)],
                                    height: 20, tail: 1, useAll: true, colorPrefix: mainRainColor, opacityClamps: [0.3, 0.3]
                                }
                            ], reduceOpacityOnFall: false, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                let mainRainColor = 'rgba(158,61,52,'
                this.backRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let secondaryRainColor = 'rgba(246,245,248,'
                        let mainRainMask = createCanvas(this.size, (ctx, size, hlp) => {
                            //left
                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(25, 128), radius: new V2(30, 30), gradientOrigin: new V2(25, 128), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
                            })

                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(25, 128), radius: new V2(30, 30).mul(0.5), gradientOrigin: new V2(25, 128), size, colorPrefix: secondaryRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
                            })
                            //right
                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(67, 128), radius: new V2(30, 30), gradientOrigin: new V2(67, 128), size, colorPrefix: mainRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
                            })

                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(67, 128), radius: new V2(30, 30).mul(0.5), gradientOrigin: new V2(67, 128), size, colorPrefix: secondaryRainColor, easingType: 'quad', easingMethod: 'out', angle: 0,
                            })
                        })

                        this.layers = [
                            {
                                angleClamps: [0, 0], lengthClamps: [12, 14], xClamps: [0, 100], upperYClamps: [70, 100], lowerY: 170,
                                speedClapms: [10, 12], framesCount: 120, itemsCount: 500, size: this.size, mask: mainRainMask, aValue: 0.4
                            }

                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createRainFrames(d);

                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))
            }
        }), 7)

        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({
                    angleClamps: [0, 0], lengthClamps: [12, 14], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: [150,200],
                    speedClapms: [10, 12], framesCount: 120, itemsCount: 2000, size: this.size, mask: undefined, aValue: 0.015
                });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 9)
    }
}