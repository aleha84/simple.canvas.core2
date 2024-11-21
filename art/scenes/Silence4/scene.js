class Silence4Scene extends Scene {
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
                size: new V2(160,200).mul(12),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'silence4',
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
    +1. Фронтальный снегопад
    +2. Средний снегопад
    +3. Дальний снегопад
    +4. Анимация дома
    +5. Анимация деревьев и дороги
    -5. Кот ?
    -6. Провода
    -7. Фронтальный снег
    */

    start(){
        let model = Silence4Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();

        let globalTotalFrames = 300;
        //
        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = false,
            changeXSpeed = false,
        }) {
            let frames = [];

            /*   */
            framesCount/=2;
            itemsCount = fast.r(itemsCount/2);
            /*   */
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

                let addShine = addParticlesShine && getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(10,30);
                    shineMul = getRandomInt(4,7);
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
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.building = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['building', 'building_details', 'building_details_2'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globalTotalFrames/2, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'building_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.tv = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let imgs = [];
                        for(let i = 0; i < 5; i++) {
                            imgs[i+1] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = i*0.02
                                hlp.setFillColor('#7eaab4').rect(102,43,3,4);
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
            }
        }), 3)

        let farLightColorPrefix = 'rgba(208,209,210,'//'rgba(241,196,88,' //'rgba(222,243,237,'
        let farMask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(78,125), radius: new V2(12,30), gradientOrigin: new V2(74,106), size, colorPrefix: farLightColorPrefix, easingType: 'quad', easingMethod: 'out', angle: -15, 
            })

        })

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground'] }),
            init() {
                this.snowfall1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let framesCount = globalTotalFrames;
                        let angleClamps = [175,185];
                        let itemFrameslengthClapms = [80,100];
                        let distanceCLamps = [25,30]

                        //this.img = farMask;
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.1
                            ctx.drawImage(farMask, 0, 0)
                            ctx.globalAlpha = 1

                        })

                        this.layers = [
                            {
                                framesCount, itemsCount: 500, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: farMask, angleClamps, distanceCLamps: [6,7], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 300, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: farMask, angleClamps, distanceCLamps: [7,8], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 150, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: farMask, angleClamps, distanceCLamps: [8,9], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                           
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.snowfall2 = this.addChild(new GO({
                    position: new V2(-40,0),
                    size: this.size,
                    init() {
                        let framesCount = globalTotalFrames;
                        let angleClamps = [175,185];
                        let itemFrameslengthClapms = [80,100];
                        let distanceCLamps = [25,30]

                        //this.img = farMask;
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.1
                            ctx.drawImage(farMask, 0, 0)
                            ctx.globalAlpha = 1

                        })

                        this.layers = [
                            {
                                framesCount, itemsCount: 500, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: farMask, angleClamps, distanceCLamps: [6,7], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 300, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: farMask, angleClamps, distanceCLamps: [7,8], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 150, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: farMask, angleClamps, distanceCLamps: [8,9], xClamps: [65,100], yClamps: [98,130], size: this.size, 
                            },
                           
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))
            }
        }), 5)
//norm 'rgba(226,162,77,'
//good 'rgba(244,199,93,'
        let midLightColorPrefix = 'rgba(244,165,19,'//'rgba(241,196,88,' //'rgba(222,243,237,'
        let midMask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(5,135), radius: new V2(18,28), gradientOrigin: new V2(17,118), size, colorPrefix: midLightColorPrefix, easingType: 'cubic', easingMethod: 'out', angle: 30, 
            })

        })

        let midBackLightColorPrefix = 'rgba(244,165,19,'//'rgba(241,196,88,' //'rgba(222,243,237,'
        let midBackMask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(52,128), radius: new V2(18,28), gradientOrigin: new V2(44,118), size, colorPrefix: midBackLightColorPrefix, easingType: 'cubic', easingMethod: 'out', angle: -30, verticalCut: {
                    points: appSharedPP.lineByCornerPoints([new V2(35,122), new V2(42,114), new V2(60,114)]),
                    aValuesMul: easing.fast({from: 0.75, to: 0.1, steps: 3, type: 'linear', round: 2}) 
                }
            })

        })

        this.midGround = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.midBackSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let framesCount = globalTotalFrames;
                        let angleClamps = [172,188];
                        let itemFrameslengthClapms = [80,100];
                        let distanceCLamps = [25,30]

                        //this.img = midBackMask;
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.1
                            ctx.drawImage(midBackMask, 0, 0)
                            ctx.globalAlpha = 1

                        })

                        this.layers = [
                            {
                                framesCount, itemsCount: 1000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask: midBackMask, angleClamps, distanceCLamps: [9,12], xClamps: [35, 70], yClamps: [110, 150], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 600, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.4], mask: midBackMask, angleClamps, distanceCLamps: [10,13], xClamps: [35, 70], yClamps: [110, 150], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 300, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.6], mask: midBackMask, angleClamps, distanceCLamps: [12,14], xClamps: [35, 70], yClamps: [110, 150], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 150, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.8], mask: midBackMask, angleClamps, distanceCLamps: [13,16], xClamps: [35, 70], yClamps: [110, 150], size: this.size, 
                            },
                           {
                                framesCount, itemsCount: 100, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: midBackMask, angleClamps, distanceCLamps: [15,18], xClamps: [35, 70], yClamps: [110, 150], size: this.size, 
                            }
                           
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['midGround'] })
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globalTotalFrames/2, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'midGround_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rightLamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let maskColorPrefix = 'rgba(251,200,17,'//'rgba(241,196,88,' //'rgba(222,243,237,'
                        let mask = createCanvas(this.size, (ctx, size, hlp) => {
                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(116,159), radius: new V2(15,15), gradientOrigin: new V2(116,159), size, colorPrefix: maskColorPrefix, easingType: 'cubic', easingMethod: 'out', angle: 0, 
                            })

                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(116,159), radius: new V2(5,5), gradientOrigin: new V2(116,159), size, colorPrefix: whiteColorPrefix, easingType: 'cubic', easingMethod: 'out', angle: 0, 
                            })

                        })

                        //this.img = mask

                        let framesCount = globalTotalFrames;
                        let angleClamps = [172,188];
                        let itemFrameslengthClapms = [80,100];
                        
                        this.layers = [
                            {
                                framesCount, itemsCount: 500, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: mask, angleClamps, distanceCLamps: [12,13], xClamps: [105, 125], yClamps: [145, 175], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 250, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: mask, angleClamps, distanceCLamps: [14,15], xClamps: [105, 125], yClamps: [145, 175], size: this.size, 
                            }
                           
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.midSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let framesCount = globalTotalFrames;
                        let angleClamps = [172,188];
                        let itemFrameslengthClapms = [80,100];
                        let distanceCLamps = [25,30]

                        //this.img = midMask;
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.2
                            ctx.drawImage(midMask, 0, 0)
                            ctx.globalAlpha = 1

                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(17,118), radius: new V2(8,8), gradientOrigin: new V2(17,118), size, colorPrefix: midLightColorPrefix, easingType: 'cubic', easingMethod: 'out', angle: 0, aValueMul: 1
                            })

                        })

                        this.layers = [
                            {
                                framesCount, itemsCount: 1000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask: midMask, angleClamps, distanceCLamps: [9,12], xClamps: [-10, 30], yClamps: [100, 160], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 600, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.4], mask: midMask, angleClamps, distanceCLamps: [10,13], xClamps: [-10, 30], yClamps: [100, 160], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 300, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.6], mask: midMask, angleClamps, distanceCLamps: [12,14], xClamps: [-10, 30], yClamps: [100, 160], size: this.size, 
                            },
                            {
                                framesCount, itemsCount: 150, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.8], mask: midMask, angleClamps, distanceCLamps: [13,16], xClamps: [-10, 30], yClamps: [100, 160], size: this.size, 
                            },
                           {
                                framesCount, itemsCount: 100, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: midMask, angleClamps, distanceCLamps: [15,18], xClamps: [-10, 30], yClamps: [100, 160], size: this.size, 
                            }
                           
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))
            }
        }), 7)

        this.frontalGround = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['frontalGround'] }),
            init() {

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globalTotalFrames/2, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'frontalGround_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // this.frames = animationHelpers.createMovementFrames({ framesCount: globalTotalFrames, itemFrameslength: 20, size: this.size, 
                        //     pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'frontalGround_p')) });

                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'frontalGround_shine_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#fff', //whiteColorPrefix + 0.2 + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({framesCount: globalTotalFrames/2, itemFrameslength: [40,50], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,100) == 0, 
                            smooth: {
                                aClamps: [0,0.15], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });

                    }
                }))


                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(frontalLightColorPrefix + '1)').rect(0,0,size.x, size.y)
                })
                
                let framesCount = globalTotalFrames;
                let angleClamps = [170,190];
                let itemFrameslengthClapms = [80,100];

                this.layers = [
                    {
                        framesCount, itemsCount: 10000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.025], mask: mask, angleClamps, distanceCLamps: [16,18], xClamps: [-10, this.size.x], yClamps: [-10, 130], size: this.size, addParticlesShine: true
                    },
                    
                ].map((d) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames(d);
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 9)

        let frontalLightColorPrefix = 'rgba(196,229,222,' //'rgba(222,243,237,'
        let frontalMask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(50,45), radius: new V2(45,60), gradientOrigin: new V2(42,19), size, colorPrefix: frontalLightColorPrefix, easingType: 'quad', easingMethod: 'out', angle: -20, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(42,19), radius: new V2(20,20), gradientOrigin: new V2(42,19), size, colorPrefix: whiteColorPrefix, easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })
        })

        let frontalMask2 = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(50,50), radius: new V2(65,90), gradientOrigin: new V2(42,19), size, colorPrefix: frontalLightColorPrefix, easingType: 'quad', easingMethod: 'out', angle: -20, verticalCut: undefined
            })
        })


        this.frontalLamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['frontalLamp'] }),
            init() {
                this.frontalSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.p = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 50, itemFrameslength: 10, size: this.size, 
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'frontalLamp_p')) });
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        let framesCount = globalTotalFrames;
                        let angleClamps = [170,190];
                        let itemFrameslengthClapms = [80,100];
                        let distanceCLamps = [25,30]

                        let imgs = [] 
                        for(let i = 0; i < 3; i++) {
                            imgs[i] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.2
                                ctx.drawImage(frontalMask, 0, 0)
                                ctx.globalAlpha = 1-(i*0.05)
    
                                scenesHelper.createGradient({
                                    hlp, aValueMul: 1, center: new V2(42,19), radius: new V2(14,14), gradientOrigin: new V2(42,19), size, colorPrefix: 'rgba(177,210,197,', easingType: 'quad', easingMethod: 'out', angle: 0, aValueMul: 2
                                })
    
                                scenesHelper.createGradient({
                                    hlp, aValueMul: 1, center: new V2(42,19), radius: new V2(6,6), gradientOrigin: new V2(42,19), size, colorPrefix: whiteColorPrefix, easingType: 'quad', easingMethod: 'out', angle: 0, aValueMul: 2
                                })
                            })
                        }

                        let delay = getRandomInt(20,30);
                        this.img = imgs[getRandomInt(0,imgs.length-1)];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            if(delay>0) {
                                delay--;
                                return;
                            }

                            this.img = imgs[getRandomInt(0,imgs.length-1)];
                            delay = getRandomInt(10,20);
                        })

                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.globalAlpha = 0.2
                        //     ctx.drawImage(frontalMask, 0, 0)
                        //     ctx.globalAlpha = 1

                        //     scenesHelper.createGradient({
                        //         hlp, aValueMul: 1, center: new V2(42,19), radius: new V2(14,14), gradientOrigin: new V2(42,19), size, colorPrefix: 'rgba(177,210,197,', easingType: 'quad', easingMethod: 'out', angle: 0, aValueMul: 2
                        //     })

                        //     scenesHelper.createGradient({
                        //         hlp, aValueMul: 1, center: new V2(42,19), radius: new V2(6,6), gradientOrigin: new V2(42,19), size, colorPrefix: whiteColorPrefix, easingType: 'quad', easingMethod: 'out', angle: 0, aValueMul: 2
                        //     })
                        // })

                        this.layers = [
                            {
                                framesCount, itemsCount: 10000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.15], mask: frontalMask2, angleClamps, distanceCLamps: [17,22], xClamps: [-10, 120], yClamps: [-10, 120], size: this.size, addParticlesShine: true
                            },
                            {
                                framesCount, itemsCount: 6000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: frontalMask2, angleClamps, distanceCLamps: [20,25], xClamps: [-10, 120], yClamps: [-10, 120], size: this.size, addParticlesShine: true
                            },
                            ///
                            {
                                framesCount, itemsCount: 4000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: frontalMask, angleClamps, distanceCLamps: [22,28], xClamps: [-10, 100], yClamps: [-10, 100], size: this.size, addParticlesShine: true
                            },
                            {
                                framesCount, itemsCount: 1500, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.7], mask: frontalMask, angleClamps, distanceCLamps: [25,30], xClamps: [-10, 100], yClamps: [-10, 100], size: this.size, addParticlesShine: true
                            },
                            {
                                framesCount, itemsCount: 800, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.85], mask: frontalMask, angleClamps, distanceCLamps: [28,32], xClamps: [-10, 100], yClamps: [-10, 100], size: this.size, addParticlesShine: true
                            },
                            {
                                framesCount, itemsCount: 300, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: frontalMask, angleClamps, distanceCLamps: [30,35], xClamps: [-10, 100], yClamps: [-10, 100], size: this.size, addParticlesShine: true
                            }
                        ].map((d) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d);
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))
            }
        }), 11)

        
    }
}