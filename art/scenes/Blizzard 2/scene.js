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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'blizzard2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    //todo: 
    // +1. Основной фонарь снегопад несколько слоёв
    // +2. Фронтальный снегопад под другим углом, крупные снежинки
    // +3. Дальний фонарь, снегопад
    // +4. Провода, раскачивание
    // +5. Блеск отдельных снежинок
    // +6. Больше домов?
    // +7. Дальние фонари?
    // +8. Переливы цветов

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Silence4Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = false,
            changeXSpeed = false,
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
            init() {
                this.img = PP.createImage(model, {renderOnly: ['bg', 'bg_d']})
            }
        }), 1)

        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, {renderOnly: ['far_city', 'city']})
            }
        }), 2)

        this.farLamps2 = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0, 5)),
            size: this.viewport.clone(),
            init() {
                let xPos = [25, 95, 155]

                let far2mask = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let i = 0; i < xPos.length; i++) {
                        scenesHelper.createGradient({
                            hlp, aValueMul: 1.5, center: new V2(xPos[i]-4,size.y-7), radius: new V2(15,15), gradientOrigin: new V2(xPos[i]-2,size.y-16), size, colorPrefix: 'rgba(141,174,188,', easingType: 'quad', easingMethod: 'out', angle: 8, verticalCut: undefined
                        })
                    }
                });

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.3;
                    ctx.drawImage(far2mask, 0,0);
                });

                let mainAngle = 190
                this.layers = [
                    {
                        framesCount: 300, itemsCount: 6000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: far2mask, 
                        angleClamps: [mainAngle,mainAngle+10], distanceCLamps: [15,17].map(p => p+0), xClamps: [-10, this.size.x], yClamps: [this.size.y-30, this.size.y], size: this.size, aMul: 1
                    },
                    
                ].map((d) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames(d);
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                })))

                this.lamps = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < xPos.length; i++) {
                            hlp.setFillColor('rgba(0,0,0,0.2)').rect(xPos[i], size.y-16, 1, 20).dot(xPos[i]-1, size.y-17)
                            hlp.setFillColor('#AECFD8').rect(xPos[i]-3, size.y-18,2,1)
                        }
                    })
                }))
            }
        }), 3)

        this.farWires = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport.clone(),
            init() {

                let wiresData = [
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(-1,155), new V2(-3,155.5)] }, 
                            { dots: [new V2(34,161), new V2(34.5,161)] }, 
                            { dots: [new V2(79-15,163)] }, 
                        ],xClamps: [0,165], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.075)', usePP: false
                    },
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(79-15,163)] }, 
                            { dots: [new V2(128,177), new V2(128.5,177)] }, 
                            { dots: [new V2(160,181), new V2(161,181)] }, 
                        ],xClamps: [45,160], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.075)', usePP: false
                    },
                ]

                this.wires = wiresData.map((d, i) => 
                    this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: animationHelpers.createWiresFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({ startFrameIndex: i*75 });
                    }
                })))
            }
        }), 5)

        this.far_lamp = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-15,0)),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, {renderOnly: ['far_lamp']})

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.2;
                            ctx.drawImage(farMask, 0,0);
                            
                        })
                    }
                }))
            }
        }), 6)

        let dis_close_snow = false;

        let farMask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(91,170), radius: new V2(20,35), gradientOrigin: new V2(88,148), size, colorPrefix: 'rgba(195,224,220,', easingType: 'quad', easingMethod: 'out', angle: -12, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(70,175), radius: new V2(20,25), gradientOrigin: new V2(72,153), size, colorPrefix: 'rgba(195,224,220,', easingType: 'quad', easingMethod: 'out', angle: 20, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1.5, center: new V2(91,149), radius: new V2(10,12), gradientOrigin: new V2(89,153), size, colorPrefix: 'rgba(218,237,234,', easingType: 'quad', easingMethod: 'out', angle: -12, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1.5, center: new V2(71,156), radius: new V2(10,12), gradientOrigin: new V2(70,156), size, colorPrefix: 'rgba(218,237,234,', easingType: 'quad', easingMethod: 'out', angle: 20, verticalCut: undefined
            })
        })

        this.farSnowFall = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-15,0)),
            size: this.viewport.clone(),
            init() {
                // this.img = farMask;
                // return;
                let mainAngle = 140
                this.layers = [
                    {
                        framesCount: 300, itemsCount: 6000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.1], mask: farMask, 
                        angleClamps: [mainAngle,mainAngle+10], distanceCLamps: [15,20].map(p => p+5), xClamps: [45, 110], yClamps: [135, this.size.y], size: this.size, aMul: 1
                    },
                    {
                        framesCount: 300, itemsCount: 3000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: farMask, 
                        angleClamps: [mainAngle,mainAngle-10], distanceCLamps: [25,30].map(p => p+5), xClamps: [45, 110], yClamps: [135, this.size.y], size: this.size, aMul: 1
                    },
                    {
                        framesCount: 300, itemsCount: 1000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.6], mask: farMask, 
                        angleClamps: [mainAngle,mainAngle], distanceCLamps: [30,35].map(p => p+5), xClamps: [45, 110], yClamps: [135, this.size.y], size: this.size, aMul: 1
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
        }), 7)

        this.closeWires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let wiresData = [
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(-1,81), new V2(-3,80)] }, 
                            { dots: [new V2(45,83)] }, 
                        ],xClamps: [0,45], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.125)', usePP: false
                    },
                    { 
                        framesCount: 150, 
                        dotsData: [
                            { dots: [new V2(45,83)] }, 
                            { dots: [new V2(100, 118), new V2(101.5,118)] }, 
                            { dots: [new V2(160,143), new V2(163,143.5)] }, 
                        ],xClamps: [45,160], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.125)', usePP: false
                    },
                ]

                this.wires = wiresData.map((d, i) => 
                    this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: animationHelpers.createWiresFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({ startFrameIndex: i*75 });
                    }
                })))
            }
        }), 7)

        this.close_lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, {renderOnly: ['close_lamp']})

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_lamp_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.2;
                            ctx.drawImage(mask, 0,0);
                            ctx.globalAlpha = 0.1;
                            ctx.drawImage(mask1_1, 0,0);
                            
                        })
                    }
                }))
            }
        }), 8)

        let mask = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(66,48), radius: new V2(120,120), gradientOrigin: new V2(66,48), size, colorPrefix: 'rgba(204,164,136,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(66,48), radius: new V2(35,35), gradientOrigin: new V2(66,48), size, colorPrefix: 'rgba(253,228,153,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })//224,177,112
            //
        })

        let mask1_1 = createCanvas(this.viewport, (ctx, size, hlp) => {
            scenesHelper.createGradient({
                hlp, aValueMul: 1, center: new V2(66,48), radius: new V2(35,35), gradientOrigin: new V2(66,48), size, colorPrefix: 'rgba(253,228,153,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })//224,177,112
            //
        })

        let mask2 = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('rgba(204,164,136,0.5').rect(0,0,size.x, size.y);
            scenesHelper.createGradient({
                hlp, aValueMul: 1.5, center: new V2(66,48), radius: new V2(120,120), gradientOrigin: new V2(66,48), size, colorPrefix: 'rgba(204,164,136,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })

            scenesHelper.createGradient({
                hlp, aValueMul: 1.5, center: new V2(66,48), radius: new V2(35,35), gradientOrigin: new V2(66,48), size, colorPrefix: 'rgba(253,228,153,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined
            })//224,177,112
            //
        })

        let mask2_1 = createCanvas(this.viewport, (ctx, size, hlp) => {
            ctx.drawImage(mask2, 0, 0);
            hlp.setFillColor('rgba(255,255,255,0.05)').rect(0,0,size.x, size.y);
        })
        
        this.closeSnowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // this.img = mask2;
                // return;

                if(dis_close_snow)
                    return;

                let mainAngle = 110
                let mainAngle2 = 250
                this.layers = [
                    {
                        framesCount: 300, itemsCount: 10000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask, 
                        angleClamps: [mainAngle,mainAngle+10], distanceCLamps: [55,60].map(p => p-20), xClamps: [-30, this.size.x], yClamps: [-10, this.size.y], size: this.size, aMul: 1, addParticlesShine: true, changeXSpeed: true
                    },
                    {
                        framesCount: 300, itemsCount: 10000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.25], mask, 
                        angleClamps: [mainAngle+10,mainAngle+20], distanceCLamps: [60,65].map(p => p-20), xClamps: [-30, this.size.x], yClamps: [-10, this.size.y], size: this.size, aMul: 1, addParticlesShine: true, changeXSpeed: true
                    }
                    ,
                    {
                        framesCount: 300, itemsCount: 10000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask, 
                        angleClamps: [mainAngle-10,mainAngle], distanceCLamps: [65,70].map(p => p-20), xClamps: [-30, this.size.x], yClamps: [-10, this.size.y], size: this.size, aMul: 1, addParticlesShine: true, changeXSpeed: true
                    },
                    {
                        framesCount: 300, itemsCount: 8000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.4], mask, 
                        angleClamps: [mainAngle+20,mainAngle], distanceCLamps: [70,75].map(p => p-20), xClamps: [-40, this.size.x], yClamps: [-20, this.size.y], size: this.size, aMul: 1, addParticlesShine: false, changeXSpeed: true
                    },
                    {
                        framesCount: 300, itemsCount: 2000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask, 
                        angleClamps: [mainAngle,mainAngle+10], distanceCLamps: [75,80].map(p => p-20), xClamps: [30, 90], yClamps: [ 20, 70], size: this.size, aMul: 1, addParticlesShine: false, changeXSpeed: true
                    },
                    {
                        framesCount: 300, itemsCount: 6000, itemFrameslengthClapms: [60,70], colorPrefix: whiteColorPrefix, aClapms: [0.05, 0.15], mask: mask2, 
                        angleClamps: [mainAngle+10,mainAngle+15], distanceCLamps: [80,85].map(p => p-20), xClamps: [-40, this.size.x], yClamps: [-20, this.size.y], size: this.size, aMul: 1, addParticlesShine: false, changeXSpeed: true
                    }
                    /////
                    ,{
                        framesCount: 300, itemsCount: 1000, itemFrameslengthClapms: [50,60], colorPrefix: whiteColorPrefix, aClapms: [0.2, 0.4], mask: mask2, 
                        angleClamps: [mainAngle2+10,mainAngle2], distanceCLamps: [130,160].map(p => p-20), xClamps: [0, this.size.x+50], yClamps: [-40, this.size.y], size: this.size, aMul: 1, addParticlesShine: true,
                        angleYChange: [0, -10]
                    }
                    ,{
                        framesCount: 300, itemsCount: 3000, itemFrameslengthClapms: [50,60], colorPrefix: whiteColorPrefix, aClapms: [0.2, 0.6].map(p => p+0), mask: mask2, 
                        angleClamps: [mainAngle2+0,mainAngle2], distanceCLamps: [140,180].map(p => p-20), xClamps: [0, this.size.x+50], yClamps: [-40, this.size.y], size: this.size, aMul: 1, addParticlesShine: true,
                        angleYChange: [0, -10], snowflakeLengthClamps: [1,1]
                    },
                    {
                        framesCount: 300, itemsCount: 2000, itemFrameslengthClapms: [40,50], colorPrefix: whiteColorPrefix, aClapms: [0.25, 0.7].map(p => p+0), mask: mask2, 
                        angleClamps: [mainAngle2+0,mainAngle2], distanceCLamps: [140,180].map(p => p-20), xClamps: [0, this.size.x+50], yClamps: [-40, this.size.y], size: this.size, aMul: 1, addParticlesShine: true,
                        angleYChange: [0, -10], snowflakeLengthClamps: [2,2]
                    },
                    {
                        framesCount: 300, itemsCount: 2000, itemFrameslengthClapms: [40,50], colorPrefix: whiteColorPrefix, aClapms: [0.3, 0.8].map(p => p+0.2), mask: mask2_1, 
                        angleClamps: [mainAngle2+0,mainAngle2], distanceCLamps: [160,200].map(p => p-20), xClamps: [0, this.size.x+50], yClamps: [-40, this.size.y], size: this.size, aMul: 1, addParticlesShine: true,
                        angleYChange: [0, -10], snowflakeLengthClamps: [2,2], alphaUseEasing: false
                    },
                    {
                        framesCount: 300, itemsCount: 250, itemFrameslengthClapms: [30,40], colorPrefix: whiteColorPrefix, aClapms: [0.4, 0.9].map(p => p+0.2), mask: mask2_1, 
                        angleClamps: [mainAngle2+0,mainAngle2], distanceCLamps: [170,220].map(p => p-20), xClamps: [0, this.size.x+50], yClamps: [-40, this.size.y], size: this.size, aMul: 1, addParticlesShine: true,
                        angleYChange: [0, -10], snowflakeLengthClamps: [4,4], alphaUseEasing: true, doubleHeight: true,
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
        }), 10)

        this.lampHead = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, {renderOnly: ['lamp_head']}),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_head_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 11)
    }
}