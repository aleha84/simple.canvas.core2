class Portal8Scene extends Scene {
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
                size: new V2(160,200).mul(5),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'portal8',
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
    
    +1. ОСновной дождь у портала
    +2. Дождь слева у фонаря
    +3. Дождь справа у фонаря
    +4. Капли на стеклах машин
    -5. Стекающие капли по стёклам
    +6. Телевизор в окне
    +7. Анимация окон домов
    +8. Анимация на земле с эффектом дождя
    +9. Анимация портала

    */

    start(){
        let model = Portal8Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();

        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size }) {
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

        let lhGradient = PP.createImage(model, { renderOnly: ['lh_gradient'] })
        let rhGradient = PP.createImage(model, { renderOnly: ['rh_gradient'] })
        let mainGradient = PP.createImage(model, { renderOnly: ['gradient'] })
        let mainGradient2 = PP.createImage(model, { renderOnly: ['gradient2'] })

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['houses'] }),
            init() {
                this.tv = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let tvImg = PP.createImage(model, {renderOnly: ['tv']})
                        let imgs = [];
                        for(let i = 2; i < 5; i++) {
                            imgs[imgs.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = i*0.2
                                ctx.drawImage(tvImg, 0,0)
                            })
                        }

                        let delay = getRandomInt(5,10);
                        let current = getRandomInt(0,imgs.length-1);
                        this.img = imgs[current];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            if(delay>0) {
                                delay--;
                                return;
                            }

                            let next = getRandomInt(0,imgs.length-1);
                            if(next == current){
                                next = getRandomInt(0,imgs.length-1);
                            }

                            current = next;

                            this.img = imgs[current];
                            delay = getRandomInt(5,10);
                        })
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [40, 50], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'houses_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        

        this.portal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.gradient = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 0.75
                        ctx.drawImage(mainGradient, 0,0);
                        ctx.drawImage(lhGradient, 0,0);
                        ctx.drawImage(rhGradient, 0,0);

                        scenesHelper.createGradient({
                            hlp, aValueMul: 2, center: new V2(73,142), radius: new V2(15, 30), gradientOrigin: new V2(73,156), size: this.size, 
                            colorPrefix: whiteColorPrefix
                        })
                    })
                }))

                this.backRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let div = 2
                        let aMul = 0.75
                        this.layers = [
                            {
                                angleClamps: [0, 0], lengthClamps: [2, 2], xClamps: [40, this.size.x-40], upperYClamps: [-30, -10], lowerY: 160,
                                speedClapms: [1.5, 1.75], framesCount: 120, itemsCount: 2000/div, size: this.size, mask: mainGradient2, aValue: 0.05
                            },
                            {
                                angleClamps: [0, 0], lengthClamps: [2, 2], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 160,
                                speedClapms: [1.5, 1.75], framesCount: 120, itemsCount: 4000/div, size: this.size, mask: mainGradient, aValue: 0.05*aMul
                            },
                            {
                                angleClamps: [0, 0], lengthClamps: [2, 3], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 160,
                                speedClapms: [1.75, 2], framesCount: 120, itemsCount: 3000/div, size: this.size, mask: mainGradient, aValue: 0.1*aMul
                            },
                            {
                                angleClamps: [0, 0], lengthClamps: [3, 3], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 160,
                                speedClapms: [2, 2.25], framesCount: 120, itemsCount: 2000/div, size: this.size, mask: mainGradient, aValue: 0.15*aMul
                            },
        
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
                    img: PP.createImage(model, { renderOnly: ['portal'] }),
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: 60, size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'portal_p')),
                            smooth: {
                                aClamps: [0,1],
                                easingType:'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });

                        this.registerFramesDefaultTimer({
                            
                        });
                    }
                }))

                this.frontalRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.layers = [
                            {
                                angleClamps: [0, 0], lengthClamps: [2, 3], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 160,
                                speedClapms: [2.5, 3], framesCount: 120, itemsCount: 1000, size: this.size, mask: mainGradient, aValue: 0.05
                            },
                            {
                                angleClamps: [0, 0], lengthClamps: [1, 2], xClamps: [0, 40], upperYClamps: [80, 100], lowerY: 170,
                                speedClapms: [1.5, 2], framesCount: 120, itemsCount: 300, size: this.size, mask: lhGradient, aValue: 0.15
                            },
                            {
                                angleClamps: [0, 0], lengthClamps: [1, 2], xClamps: [130, this.size.x], upperYClamps: [80,100], lowerY: 170,
                                speedClapms: [1.5, 2], framesCount: 120, itemsCount: 300, size: this.size, mask: rhGradient, aValue: 0.15
                            },
        
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
        }), 5)

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
                            framesCount: 120, itemFrameslength: [20, 30], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'ground_p'))
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))


                this.smallSplashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners1 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone1')).map(pd => new V2(pd.point));
                        let corners2 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone2')).map(pd => new V2(pd.point));
                        let corners3 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone3')).map(pd => new V2(pd.point));
                        let availableDots = [
                            ...appSharedPP.fillByCornerPoints(corners1).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(0.05, 0.2), 2) + ')' })),
                            ...appSharedPP.fillByCornerPoints(corners2).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(0.05, 0.15), 2) + ')' })),
                            ...appSharedPP.fillByCornerPoints(corners3).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(0.1, 0.2), 2) + ')' })),
                        ];

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [5, 10], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0, 2) == 0,
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {

                            }
                        });
                    }
                }))



                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(255,255,255,0.1)').rect(0,0,size.x, size.y)
                    ctx.drawImage(mainGradient, 0 ,0)
                    ctx.drawImage(lhGradient, 0 ,0)
                    ctx.drawImage(rhGradient, 0 ,0)
                })
                this.rainLayers = [
                    {
                        angleClamps: [0, 0], lengthClamps: [4, 5], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 180,
                        speedClapms: [4, 6], framesCount: 120, itemsCount: 1000, size: this.size, mask: mask, aValue: 0.1
                    },
                    {
                        angleClamps: [0, 0], lengthClamps: [5, 5], xClamps: [0, this.size.x], upperYClamps: [-30, -10], lowerY: 200,
                        speedClapms: [5, 7], framesCount: 120, itemsCount: 500, size: this.size, mask: mask, aValue: 0.2
                    },


                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames(d);

                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 7)
    }
}