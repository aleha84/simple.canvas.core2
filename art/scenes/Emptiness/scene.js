class EmptinessScene extends Scene {
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
                fileNamePrefix: 'emptiness',
                utilitiesPathPrefix: '../../..',
                workersCount: 8,
                //dither: Recorder.gif.ditherTypes.FloydSteinbergSerpentine
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = EmptinessScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = undefined, lowerLinePoints = []
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed && isFunction(changeXSpeed)) {
                xSpeedValues = changeXSpeed(size)
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
    
                                        // if(prev && prev.y != tp.y) {
                                        //     hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        // }
    
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

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['road_bg', 'road_d', 'bg_d'] }),
            init() {

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 180, itemFrameslength: [40,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bg_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone')).map(pd => new V2(pd.point));
                        let yClamps = [150,200]
                        let aClamps = easing.fast({from: 0.1, to: 0.1, steps: yClamps[1] - yClamps[0], type: 'linear', round: 2 })

                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + aClamps[p.y-yClamps[0]] + ')' //fast.r(getRandom(0.2,0.4),2) + ')'
                            //aClamps: [0, aToy[p.y-146] || 0]
                        }));

                        this.frames = animationHelpers.createMovementFrames({framesCount: 180, itemFrameslength: [10,15], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,30) == 0, 
                            // smooth: {
                            //     aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            // }
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });

                    }
                }))
            }
        }), 3)

        this.far_snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    scenesHelper.createGradient({hlp, aValueMul: 0.5, center: new V2(87,124), radius: new V2(20, 20), gradientOrigin: new V2(87,124), size, 
                        colorPrefix: whiteColorPrefix,  })

                    // scenesHelper.createGradient({hlp, aValueMul: 1.5, center: new V2(122, 63), radius: new V2(30, 30), gradientOrigin: new V2(122, 63), size, 
                    //     colorPrefix: whiteColorPrefix,  })
                })



                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     ctx.globalAlpha = 0.05;
                //     ctx.drawImage(mask, 0, 0);
                // })

                let countMul = 2;
                let framesCount = 180;
                let itemFrameslengthClapms = [20,30]

                let colorPrefix = colors.getColorPrefix('#f1f2f3', 'hex')

                this.layers = [
                    {
                        framesCount, itemsCount: fast.r(4000*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.6], mask, angleClamps: [234, 235], distanceCLamps: [15,20], xClamps: [40, 150], yClamps: [70,160], size: this.size, aMul: 1
                    },
                    {
                        framesCount, itemsCount: fast.r(1000*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.9], mask, angleClamps: [234, 235], distanceCLamps: [20,25], xClamps: [40, 150], yClamps: [70,160], size: this.size, aMul: 1
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            
                        });
                    }
                })))
            }
        }), 4)

        this.close_lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['close_lamp'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 180, itemFrameslength: [40,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        this.close_snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    scenesHelper.createGradient({hlp, aValueMul: 0.5, center: new V2(122, 63), radius: new V2(80, 80), gradientOrigin: new V2(122, 63), size, 
                        colorPrefix: whiteColorPrefix,  })

                    scenesHelper.createGradient({hlp, aValueMul: 1.5, center: new V2(122, 63), radius: new V2(30, 30), gradientOrigin: new V2(122, 63), size, 
                        colorPrefix: whiteColorPrefix,  })
                })

                // let mask2 = createCanvas(this.size, (ctx, size, hlp) => {
                //     scenesHelper.createGradient({hlp, aValueMul: 1, center: new V2(122, 63), radius: new V2(80, 80), gradientOrigin: new V2(122, 63), size, 
                //         colorPrefix: whiteColorPrefix,  })
                // })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.05;
                    ctx.drawImage(mask, 0, 0);
                })

                let countMul = 2;
                let framesCount = 180;
                let itemFrameslengthClapms = [20,30]

                let colorPrefix = colors.getColorPrefix('#f1f2f3', 'hex')

                this.layers = [
                    {
                        framesCount, itemsCount: fast.r(10000*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.1], mask:mask, angleClamps: [234, 236], distanceCLamps: [20,22], xClamps: [60, 200], yClamps: [0,110], size: this.size, aMul: 1
                    },
                    {
                        framesCount, itemsCount: fast.r(5000*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.2], mask: mask, angleClamps: [234, 236], distanceCLamps: [25,30], xClamps: [80, 200], yClamps: [0,110], size: this.size, aMul: 1
                    },
                    {
                        framesCount, itemsCount: fast.r(1500*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.35], mask, angleClamps: [233, 238], distanceCLamps: [35,40], xClamps: [80, 200], yClamps: [0,110], size: this.size, aMul: 1
                    },
                    {
                        framesCount, itemsCount: fast.r(700*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.5], mask, angleClamps: [230, 240], distanceCLamps: [40,45], xClamps: [80, 200], yClamps: [0,110], size: this.size, aMul: 1
                    },
                    {
                        framesCount, itemsCount: fast.r(500*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.65], mask, angleClamps: [225, 245], distanceCLamps: [50,55], xClamps: [80, 200], yClamps: [0,110], size: this.size, aMul: 1,snowflakeLengthClamps: [1,1]
                    },
                    {
                        framesCount, itemsCount: fast.r(200*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.8], mask, angleClamps: [225, 245], distanceCLamps: [60,65], xClamps: [80, 200], yClamps: [0,110], size: this.size, aMul: 1, snowflakeLengthClamps: [1,2]
                    },
                    {
                        framesCount, itemsCount: fast.r(100*countMul, 0), itemFrameslengthClapms, colorPrefix, aClapms: [0, 1], mask, angleClamps: [220, 250], distanceCLamps: [70,75], xClamps: [180, 220], yClamps: [0,110], size: this.size, aMul: 1, snowflakeLengthClamps: [2,3]
                    }


                    ,
                    {
                        framesCount, itemsCount: fast.r(400*countMul, 0), itemFrameslengthClapms, colorPrefix, 
                        aClapms: [0, 0.15], mask: undefined, angleClamps: [220, 240], distanceCLamps: [80,85], xClamps: [10, 200], yClamps: [-20,140], size: this.size, aMul: 1, snowflakeLengthClamps: [2,3]
                    },
                    {
                        framesCount, itemsCount: fast.r(200*countMul, 0), itemFrameslengthClapms, colorPrefix, 
                        aClapms: [0, 0.2], mask: undefined, angleClamps: [220, 240], distanceCLamps: [90,95], xClamps: [10, 200], yClamps: [-20,140], size: this.size, aMul: 1, snowflakeLengthClamps: [4,5], alphaUseEasing: true
                    },
                    {
                        framesCount, itemsCount: fast.r(50*countMul, 0), itemFrameslengthClapms, colorPrefix, 
                        aClapms: [0, 0.3], mask: undefined, angleClamps: [220, 240], distanceCLamps: [100,105], xClamps: [10, 200], yClamps: [-20,140], size: this.size, aMul: 1, snowflakeLengthClamps: [5,6], alphaUseEasing: true, doubleHeight: true
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            
                        });
                    }
                })))
            }
        }), 6)
    }
}