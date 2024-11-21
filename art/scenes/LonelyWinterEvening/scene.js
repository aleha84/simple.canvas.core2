class LonelyWinterEveningScene extends Scene {
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
                size: new V2(133,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lonelyWinterEvening',
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
        let model = LonelyWinterEveningScene.models.main;
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

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground', 'far_lamp'] }),
            init() {
                this.snowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let mask = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                            let gData = PP.getLayerByName(model, 'far_lamp_g').groups[0];
                            scenesHelper.createGradient({
                                hlp,
                                ...gData,
                                size,
                                colorPrefix: whiteColorPrefix,
                                verticalCut: {
                                    points: appSharedPP.lineByCornerPoints([new V2(62,119), new V2(98,101), new V2(103,101), new V2(132,115)].map(p => new V2(p.x, p.y+2))),
                                    aValuesMul: easing.fast({from: 1, to: 0, steps: 5, type: 'linear', round: 2})
                                } 
                            });
                        })

                        let lowerLinePoints = appSharedPP.lineV2(new V2(50, 133), new V2(250, 133)).reduce((a,c) => { a[c.x] = c.y; return a; }, []);

                        let framesCount = 300;
                        let mainAngleClamps = [175,180]
                        let itemFrameslengthClapms = [60,70]
                        let itemsCountMul = 1;
                        let angleClampsModF = (modifier) => [mainAngleClamps[0]-modifier, mainAngleClamps[1] + modifier]

                        let mainDistanceCLamps = [15,18]

                        this.layers = [
                            {
                                framesCount, itemsCount: fast.r(2000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.35], mask: mask, angleClamps: angleClampsModF(0), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*0.4)), xClamps: [50, this.size.x+20], yClamps:[90, 130], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount, itemsCount: fast.r(1000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: mask, angleClamps: angleClampsModF(0), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*0.5)), xClamps: [50, this.size.x+20], yClamps:[90, 130], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount, itemsCount: fast.r(500*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.65], mask: mask, angleClamps: angleClampsModF(1), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*0.6)), xClamps: [50, this.size.x+20], yClamps:[90, 130], size: this.size, aMul: 1, lowerLinePoints
                            },
                            {
                                framesCount, itemsCount: fast.r(100*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.85], mask: mask, angleClamps: angleClampsModF(1), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*0.7)), xClamps: [50, this.size.x+20], yClamps:[90, 130], size: this.size, aMul: 1, lowerLinePoints
                            }
                            
                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d)
                                this.registerFramesDefaultTimer({});
                            }
                        })))

                        
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'snow_shine_zone')).map(pd => new V2(pd.point));
                        
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#ffffff'
                        }));

                        this.frames = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [30,50], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,25) == 0, 
                            smooth: {
                                aClamps: [0,0.3], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });

                    }
                }))
            }
        }), 3)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['lamp', 'man', 'man_1'] }),
            init() {
                this.phoneAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img1 = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#bebec6').dot(94,136).dot(95,136)
                        })

                        let img2 = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#bebec6').dot(93,137).dot(94,137)
                        })

                        let img3 = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#93939a').dot(94,137)
                            
                        })

                        let totalFrames = 150;
                        let img1Data = new Array(totalFrames).fill(false);
                        img1Data.splice(25,20, ...new Array(20).fill(true))

                        let img2Data = new Array(totalFrames).fill(false);
                        img2Data.splice(40,20, ...new Array(20).fill(true))

                        let img3Data = new Array(totalFrames).fill(false);
                        img3Data.splice(70,30, ...new Array(30).fill(true))

                        this.frames = [];
                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                if(img1Data[f])
                                    ctx.drawImage(img1, 0,0)

                                if(img2Data[f])  
                                    ctx.drawImage(img2, 0,0)

                                // if(img3Data[f])  
                                //     ctx.drawImage(img3, 0,0)
                            })
                        }
                        
                        this.registerFramesDefaultTimer({});

                    }
                }))

                this.snowFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // return;
                        let mask = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                            let gData = PP.getLayerByName(model, 'main_lamp_g').groups[0];
                            scenesHelper.createGradient({
                                hlp,
                                ...gData,
                                size,
                                colorPrefix: whiteColorPrefix,
                                verticalCut: {
                                    points: appSharedPP.lineByCornerPoints([new V2(0, 70), new V2(48, 28), new V2(54, 25), new V2(61, 26), new V2(132, 47)].map(p => new V2(p.x, p.y+5))),
                                    aValuesMul: easing.fast({from: 1, to: 0, steps: 10, type: 'linear', round: 2})
                                } 
                            });
                        })


                        let framesCount = 300;
                        let mainAngleClamps = [170,175]
                        let itemFrameslengthClapms = [60,70]
                        let itemsCountMul = 1.5;
                        let angleClampsModF = (modifier) => [mainAngleClamps[0]-modifier, mainAngleClamps[1] + modifier]

                        let mainDistanceCLamps = [15,18]

                        this.layers = [
                            {
                                framesCount, itemsCount: fast.r(10000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.025], mask: undefined, angleClamps: mainAngleClamps, distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*0.8)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(20000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.05], mask, angleClamps: mainAngleClamps, distanceCLamps: mainDistanceCLamps, xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(10000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.1], mask, angleClamps: mainAngleClamps, distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.1)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(5000*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.2], mask, angleClamps: angleClampsModF(2), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.2)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(2500*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.35], mask, angleClamps: angleClampsModF(4), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.3)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(1250*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask, angleClamps: angleClampsModF(6), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.4)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(625*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.65], mask, angleClamps: angleClampsModF(8), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.5)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(300*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.8], mask, angleClamps: angleClampsModF(10), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.6)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            },
                            {
                                framesCount, itemsCount: fast.r(150*itemsCountMul), itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask, angleClamps: angleClampsModF(12), distanceCLamps: mainDistanceCLamps.map(x => fast.r(x*1.7)), xClamps: [-20, this.size.x+20], yClamps:[-20, 150], size: this.size, aMul: 1
                            }
                            
                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowFallFrames(d)
                                this.registerFramesDefaultTimer({});
                            }
                        })))

                        
                    }
                }))
            }
        }), 5)

        // this.man = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(model, { renderOnly: ['man'] }),
        //     init() {
        //         //
        //     }
        // }), 7)
    }
}