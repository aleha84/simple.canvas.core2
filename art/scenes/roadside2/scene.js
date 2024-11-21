class Roadside2Scene extends Scene {
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
                fileNamePrefix: 'roadside2',
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
    1.+ Затенить стёкла
    2.+ Снег в передних фарах 
    3.+ Снег в задних фарах
    4.- Звёзды?
    5.+ Анимация мерцания окон в доме
    6.+ Анимация человека
    7.+ Красные лампочки на крыше дома
    8. +Движение точек на земле
    9. +Кусты
    */

    start(){
        let model = Roadside2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = false, lowerLinePoints = []
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed) {
                xSpeedValues = [
                    //...new Array(fast.r(size.x/2)).fill(1),
                    ...easing.fast({from: 1, to: 0.75, steps: fast.r(size.x/1), type: 'linear', round: 2})
                ]
            }

            let angleToYChangeValues = easing.fast({from: angleYChange[0], to: angleYChange[1], steps: size.y, type: 'linear', method: 'base', round: 2});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClapms);
                //totalFrames = framesCount;
                let p = V2.random(xClamps, yClamps);
                let sLen = getRandomInt(snowflakeLengthClamps);
                let angle = getRandomInt(angleClamps);

                let angleChange = angleToYChangeValues[p.y];
                if(angleChange == undefined) 
                {
                    if(p.y < 0)
                        angleChange = angleYChange[0];
                    else if(p.y >= size.y)
                        angleChange = angleYChange[1]
                    else 
                        angleChange = 0;
                }
                angle+=angleChange;
            
                let direction = V2.up.rotate(angle);
                let distance = getRandomInt(distanceCLamps) * (xSpeedValues[p.x] || 1);

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2, { toV2: true });

                let maxA = aClapms[1];
                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                let addShine = addParticlesShine && getRandomInt(0,addParticlesShine.upperChance) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(addParticlesShine.framesLengthClamps);
                    shineMul = getRandomInt(addParticlesShine.aMulClamps);
                }

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                    // aValues = aValues.map(a => a*shineMul);
                }

                let linePoints = [];
                let lineAValues = [];
                if(sLen > 0) {
                    linePoints = appSharedPP.lineV2(new V2(), new V2().add(direction.mul(sLen)).toInt());
                    lineAValues = alphaUseEasing ? [
                        ...easing.fast({ from: 0, to: maxA, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: maxA, to: 0, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 })
                    ] : new Array(linePoints.length).fill(maxA);
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = points[pointIndexValues[f]]
                    let a = aValues[f] || 0;
            
                    if(lowerLinePoints[p.x] && p.y > lowerLinePoints[p.x])
                        continue;

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames,
                    linePoints,
                    lineAValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { linePoints, lineAValues, } = itemData
                            let {p, a} = itemData.frames[f];

                            let repeats = 1;
                            if(doubleHeight)
                                repeats = 2;

                            for(let yShift = 0; yShift < repeats; yShift++) {
                                if(linePoints.length > 0) {
                                    let prev = undefined;
                                    for(let i = 0; i < linePoints.length; i++) {
                                        let lp = linePoints[i];
        
                                        let tp = p.add(lp);
                                        let currentA = a*(lineAValues[i] || 0); 
                                        hlp.setFillColor(colorPrefix + currentA).dot(tp.x, tp.y+yShift)
    
                                        if(prev && prev.y != tp.y) {
                                            hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        }
    
                                        prev = tp;
                                    }
                                }
                                else {
                                    hlp.setFillColor(colorPrefix + a + ')').dot(p.x, p.y + yShift)
                                }
                            }
                        }
                        
                    }

                    if(mask) {
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
            img: PP.createImage(model, { renderOnly: ['bg', 'bg_d2'] }),
            init() {
                // let aToY = easing.fast({from: 0.3, to: 0.05, steps: 30, type: 'linear', round: 2})
                // let data = new Array(100).fill().map(_ => {
                //     let p = V2.random([0, this.size.x], [0, 29])
                //     let a = fast.r(getRandom(0.025, aToY[p.y]),3);

                //     return {
                //         color: 'rgba(255,255,255,' + a + ')',
                //         point: p
                //     }
                // });

                // this.starsStatic = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     img: createCanvas(this.size, (ctx, size, hlp) => {
                //         let staticData = data.slice(0, fast.r(data.length/2))
                //         for(let i = 0; i < staticData.length; i++) {
                //             hlp.setFillColor(staticData[i].color).dot(staticData[i].point)
                //         }
                //     })
                // }))

                // this.stars = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let size = this.size
                //         this.frames = animationHelpers.createMovementFrames({
                //             framesCount: 300, itemFrameslength: [80,120], size: this.size,
                //             pointsData: data.slice(fast.r(data.length/2)),
                //             smooth: {
                //                 aClamps: [0,1],easingType:'quad', easingMethod: 'inOut', easingRound: 2
                //             }
                //         });

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 1)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg', 'bg_d2'] }),
            init() {
                //
            }
        }), 1)

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['houses'] }),
            init() {
                this.windowsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let hexColors = ['#3c4c55', '#4c5c64', '#6b7c81', '#8b9c9f']
                        let hColors = hexColors.map(hex => colors.colorTypeConverter({ value: hex, fromType: 'hex', toType: 'rgb' })).map(rgb => rgb.r*1000000+rgb.g*1000+rgb.b);

                        let hPixels = getPixels(this.parent.img, this.size);

                        let pointsData = [];
                        for(let i = 0; i < hPixels.length; i++) {
                            let curPixel = hPixels[i];

                            let index = hColors.indexOf(curPixel.color[0]*1000000+curPixel.color[1]*1000+curPixel.color[2]);
                            
                            if(index > 0){
                                pointsData.push({
                                    color: hexColors[index-1],
                                    point: curPixel.position
                                })
                            }
                        }

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 300, itemFrameslength: [20,60], pointsData, size: this.size,
                            pdPredicate: () => getRandomInt(0,2) == 0
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.mid_ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['mid_ground'] }),
            init() {
                this.frontalSnowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let mask = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#ffffff').rect(0,0,size.x,size.y)
                        })


                        this.layers = [
                            // {
                            //     framesCount: 300, itemsCount:  50, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [25, 27], xClamps: [25, 35], yClamps: [145, 150], size: this.size, aMul: 1, lowerLinePoints
                            // },


                            {
                                framesCount: 300, itemsCount: 2000, itemFrameslengthClapms: [100, 120], colorPrefix: whiteColorPrefix, aClapms: [0, 0.05], mask: mask, angleClamps: [170, 190], distanceCLamps: [20, 22], xClamps: [-10, this.size.x], yClamps: [-10, this.size.y], size: this.size, aMul: 1, 
                            },
                            
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))
            }
        }), 5)

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['trees'] }),
            init() {
                //
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
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 40, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let frontalMask = PP.createImage(model, { renderOnly: ['frontal_g'], forceVicivility: { frontal_g: { visible: true } } })

                this.frontalSnowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let lowerLinePoints = appSharedPP
                            .lineByCornerPoints([new V2(0,178),new V2(27,178),new V2(43,174),new V2(64,174),new V2(78,172),new V2(99,170)])
                            .reduce((a,c) => { a[c.x] = c.y; return a; }, []);

                        this.layers = [
                            {
                                framesCount: 300, itemsCount: 3000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [15, 17], xClamps: [-10, 100], yClamps: [120, 170], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount: 300, itemsCount: 1500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [18, 21], xClamps: [-10, 100], yClamps: [120, 170], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [22, 25], xClamps: [-10, 100], yClamps: [120, 170], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount: 300, itemsCount: 100, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [26, 29], xClamps: [-10, 100], yClamps: [120, 170], size: this.size, aMul: 1, lowerLinePoints
                            }
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['car'] })
                }))

                this.backSnowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let backMask = PP.createImage(model, { renderOnly: ['back_g'], forceVicivility: { frontal_g: { visible: true } } })

                        let lowerLinePoints = appSharedPP
                            .lineByCornerPoints([new V2(0,178),new V2(27,178),new V2(43,174),new V2(64,174),new V2(78,172),new V2(99,170)])
                            .reduce((a,c) => { a[c.x] = c.y; return a; }, []);

                        this.layers = [
                            // {
                            //     framesCount: 300, itemsCount:  50, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [25, 27], xClamps: [25, 35], yClamps: [145, 150], size: this.size, aMul: 1, lowerLinePoints
                            // },


                            {
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: backMask, angleClamps: [170, 190], distanceCLamps: [18, 21], xClamps: [155, 210], yClamps: [130, 170], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount: 300, itemsCount: 200, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: backMask, angleClamps: [170, 190], distanceCLamps: [25, 27], xClamps: [155, 210], yClamps: [130, 170], size: this.size, aMul: 1, lowerLinePoints
                            },
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))
            }
        }), 9)

        this.man = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['man'] }),
            init() {
                this.animationn = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mul = 1.35
                        this.frames = PP.createImage(Roadside2Scene.models.manFrames)
                        let frameIndices = [
                            

                            // ...easing.fast({from: 0, to: 2, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                            // ...easing.fast({from: 1, to: 0, steps: 15, type: 'quad', method: 'inOut', round: 0 }),
                            // ...new Array(10).fill(0),
                            // ...easing.fast({from: 0, to: 9, steps: 40, type: 'linear', method: 'base', round: 0 }),
                            // ...new Array(30).fill(9),
                            // ...easing.fast({from: 9, to: 0, steps: 30, type: 'linear', method: 'base', round: 0 }),
                            // ...new Array(30).fill(0),
                            // ...easing.fast({from: 12, to: 15, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                            // ...new Array(15).fill(15),
                            // ...easing.fast({from: 15, to: 12, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                            // ...new Array(20).fill(0),
                            
                            // ...easing.fast({from: 17, to: 20, steps: 10, type: 'linear', method: 'base', round: 0 }),
                            // ...new Array(30).fill(20),
                            // ...easing.fast({from: 20, to: 17, steps: 10, type: 'linear', method: 'base', round: 0 }),
                            // ...new Array(150).fill(0),

                            ...easing.fast({from: 0, to: 2, steps: fast.r(30*mul), type: 'quad', method: 'inOut', round: 0 }),
                            ...easing.fast({from: 1, to: 0, steps: fast.r(15*mul), type: 'quad', method: 'inOut', round: 0 }),
                            ...new Array(fast.r(10*mul)).fill(0),
                            ...easing.fast({from: 0, to: 9, steps: fast.r(40*mul), type: 'linear', method: 'base', round: 0 }),
                            ...new Array(fast.r(30*mul)).fill(9),
                            ...easing.fast({from: 9, to: 0, steps: fast.r(30*mul), type: 'linear', method: 'base', round: 0 }),
                            ...new Array(fast.r(30*mul)).fill(0),
                            ...easing.fast({from: 12, to: 15, steps: fast.r(30*mul), type: 'quad', method: 'inOut', round: 0 }),
                            ...new Array(fast.r((fast.r(15*mul)))).fill(15),
                            ...easing.fast({from: 15, to: 12, steps: fast.r(30*mul), type: 'quad', method: 'inOut', round: 0 }),
                            ...new Array(fast.r(20*mul)).fill(0),
                            
                            ...easing.fast({from: 17, to: 20, steps: fast.r(10*mul), type: 'linear', method: 'base', round: 0 }),
                            ...new Array(fast.r(30*mul)).fill(20),
                            ...easing.fast({from: 20, to: 17, steps: fast.r(10*mul), type: 'linear', method: 'base', round: 0 }),
                            ...new Array(150).fill(0),
                        ]

                        console.log(frameIndices.length)

                        this.currentFrame = 0;
                        this.img = this.frames[frameIndices[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = this.frames[frameIndices[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == frameIndices.length){
                                this.currentFrame = 0;
                                this.parent.parentScene.capturing.stop = true;
                            }
                        })
                    }
                }))

                this.frontalSnowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let mask = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#ffffff').rect(0,0,size.x,size.y)
                        })

                        this.layers = [
                            // {
                            //     framesCount: 300, itemsCount:  50, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask: frontalMask, angleClamps: [170, 190], distanceCLamps: [25, 27], xClamps: [25, 35], yClamps: [145, 150], size: this.size, aMul: 1, lowerLinePoints
                            // },


                            {
                                framesCount: 300, itemsCount: 100, itemFrameslengthClapms: [100, 120], colorPrefix: whiteColorPrefix, aClapms: [0, 0.1], mask: mask, angleClamps: [170, 190], distanceCLamps: [40, 45], xClamps: [-10, this.size.x], yClamps: [-10, this.size.y], size: this.size, aMul: 1, 
                            },
                            
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                let counter = 0;
                                this.registerFramesDefaultTimer({
                                    // framesEndCallback: () => {
                                    //     counter++;
                                    //     if(counter == 2)
                                    //         this.parent.parent.parentScene.capturing.stop = true;
                                    // }
                                });
                            }
                        })));
                    }
                }))
            }
        }), 11)
    }
}