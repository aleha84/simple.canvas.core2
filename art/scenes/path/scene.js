class PathScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            scrollOptions: {
                enabled: false,
                zoomEnabled: true,
                restrictBySpace: false,
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(160,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'dark_path',
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

    /* todo
+1. Добавить дизеринг на тропинку
+2. Снегопад многослойный
+3. на заднем фоне увести в тёмный цвет задний фон вверх
+4. Дым из трубы

2-ая сцена. 
5. Тёмный слой с небольшим освещением посередине вокруг дома
6. Свет в окнах и фонарь (фонари) + Мерцание 
7. Сильная пурга  

    */

    start(){
        let originalSize = new V2(160,200);
        let model = PathScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();

        let dark = true
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

        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                let xClamps = [-0.5,0.5]
                SCG.viewport.camera.updatePosition(new V2(xClamps[0],0));

                let totalFrames = 120;
                let xValues = [
                    ...easing.fast({from: xClamps[0], to: xClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: xClamps[1], to: xClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                // let xFrontalValues = [
                //     ...easing.fast({from: xClamps[0]/4, to: xClamps[1]/4, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                //     ...easing.fast({from: xClamps[1]/4, to: xClamps[0]/4, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                // ]

                this.currentFrame = 0;
                
                // this.timer = this.regTimerDefault(10, () => {

                //     this.currentFrame++;
                //     if(this.currentFrame == totalFrames){
                //         this.currentFrame = 0;
                //     }

                //     SCG.viewport.camera.updatePosition(new V2(0, xValues[this.currentFrame]));
                //     // this.parentScene.reflections.position.x = this.parentScene.sceneCenter.x + xFrontalValues[this.currentFrame];
                //     // this.parentScene.reflections.needRecalcRenderProperties = true;

                //     // this.parentScene.fg.position.x = this.parentScene.sceneCenter.x - xValues[this.currentFrame]/2;
                //     // this.parentScene.fg.needRecalcRenderProperties = true;
                // })
            }
        }), 0)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                this.sky = this.addChild(new GO({
                    position: new V2(0,0),
                    size: this.size,
                    init() {
                        let cc = ['#4a748c', '#466E84', '#446A7F']//['#4a748c', '#477087', '#446C82' ]
                        let steps = 3;
                        //let aValues = easing.fast({from: 0.025, to: 0.10, steps: steps+1, type: 'linear', method: 'base', round: 3});
                        let stepHeight = 40;
                        let startY = 70

                        let basePoints = [
                            new V2(0, startY), new V2(this.size.x, startY), new V2(this.size.x, startY + stepHeight), new V2(0, startY + stepHeight)
                        ] 

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});

                            let data = [];

                            for(let i = 0; i < steps; i++) {
                                pp.setFillColor(cc[i+1]);
                                pp.fillByCornerPoints(basePoints.map(p => p.add(new V2(0, -stepHeight*(i+1)))), { fixOpacity: true })

                                data.push({
                                    c2: cc[i+1],
                                    c1: cc[i],
                                    dividerPoints: appSharedPP.lineV2(new V2(0 , startY-stepHeight*i), new V2(this.size.x, startY-stepHeight*i)),
                                    rv: [10,6,2,2]
                                })
                            }

                            colorsHelpers.createDithering({ data, hlp, xClamps: [0,size.x], rValues: [4,2,0,0].map(x => x*1), sharedPP: appSharedPP , 
                                preventDuplicates: true, debug: false })
                        })
                    }
                }))
            }
        }), 1)

        this.far_forest = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['far_forest'] }),
            init() {
                //
            }
        }), 3)

        this.hill = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['hill', 'hill_d', 'hill_d2'] }),
            init() {
                if(!dark) {
                    this.shine = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone')).map(pd => new V2(pd.point));
                            
                            let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                                point: p,
                                color: whiteColorPrefix + fast.r(getRandom(0.2,0.4),2) + ')'
                                //aClamps: [0, aToy[p.y-146] || 0]
                            }));
    
                            this.frames = animationHelpers.createMovementFrames({framesCount: 240, itemFrameslength: [10,20], pointsData: availableDots, size: this.size,
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
                
            }
        }), 5)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['house'] }),
            init() {

                if(!dark) {
                    let gDebug = false;
                    let shift = new V2(0,5);
                    let smokeAvalue = 0.015
                    let itemsCount = 50
                    let yShiftBase = -0.045
                    this.smoke = this.addChild(new GO({
                        position: shift.clone(),
                        size: this.size,
                        init() {
                            let xShift = 0;
                            let yShift = yShiftBase//-0.1;
                            let framesLength = 240 
    
                            let srtartPositions = appSharedPP.lineV2(new V2(86, 66), new V2(86, 30), { toV2: true})
                            srtartPositions.push(new V2(86, 66))
                            srtartPositions.push(new V2(87, 66))
                            srtartPositions.push(new V2(88, 66))
    
                            let deviationCLamps = (value, deviation) => {
                                return [value-deviation, value+deviation]
                            }
    
                            this.frames = animationHelpers.createSmokeFrames({
                                debug: gDebug ? true: false,
                                framesCount: framesLength, itemsCount: itemsCount,
                                startPositions: srtartPositions,//[new V2(86, 66),new V2(87, 66),new V2(88, 66), new V2(83,57),new V2(82, 58),new V2(74, 45), new V2(75, 45) ],
                                aClamps: [smokeAvalue, smokeAvalue], itemFrameslength: [framesLength, framesLength], velocityClamps: {
                                    xClamps: deviationCLamps(xShift, 0.01)
                                    , yClamps: deviationCLamps(yShift, 0.03)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFFFFF', appSharedPP
                            })
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
                    this.smoke2 = this.addChild(new GO({
                        position: shift.clone(),
                        size: this.size,
                        init() {
                            let xShift = 0;
                            let yShift = yShiftBase//-0.1;
                            let framesLength = 240 
    
                            let srtartPositions = appSharedPP.lineV2(new V2(86, 60), new V2(82, 35), { toV2: true})
    
                            let deviationCLamps = (value, deviation) => {
                                return [value-deviation, value+deviation]
                            }
    
                            this.frames = animationHelpers.createSmokeFrames({
                                debug: gDebug ? 'blue': false,
                                framesCount: framesLength, itemsCount: itemsCount,
                                startPositions: srtartPositions,//[new V2(86, 66),new V2(87, 66),new V2(88, 66), new V2(83,57),new V2(82, 58),new V2(74, 45), new V2(75, 45) ],
                                aClamps: [smokeAvalue, smokeAvalue], itemFrameslength: [framesLength, framesLength], velocityClamps: {
                                    xClamps: deviationCLamps(xShift, 0.01)
                                    , yClamps: deviationCLamps(yShift, 0.03)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFFFFF', appSharedPP
                            })
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
    
                    this.smoke3 = this.addChild(new GO({
                        position: shift.clone(),
                        size: this.size,
                        init() {
                            let xShift = 0;
                            let yShift = yShiftBase//-0.1;
                            let framesLength = 240 
    
                            let srtartPositions = appSharedPP.lineV2(new V2(86, 55), new V2(90, 35), { toV2: true})
    
                            let deviationCLamps = (value, deviation) => {
                                return [value-deviation, value+deviation]
                            }
    
                            this.frames = animationHelpers.createSmokeFrames({
                                debug: gDebug ? 'green': false,
                                framesCount: framesLength, itemsCount: itemsCount,
                                startPositions: srtartPositions,//[new V2(86, 66),new V2(87, 66),new V2(88, 66), new V2(83,57),new V2(82, 58),new V2(74, 45), new V2(75, 45) ],
                                aClamps: [smokeAvalue, smokeAvalue], itemFrameslength: [framesLength, framesLength], velocityClamps: {
                                    xClamps: deviationCLamps(xShift, 0.01)
                                    , yClamps: deviationCLamps(yShift, 0.03)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFFFFF', appSharedPP
                            })
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
                }
                else {
                    let gDebug = false;
                    let shift = new V2(0,5);
                    let smokeAvalue = 0.02
                    let itemsCount = 70
                    let yShiftBase = -0.025
                    this.smoke = this.addChild(new GO({
                        position: shift.clone(),
                        size: this.size,
                        init() {
                            let xShift = -0.2;
                            let yShift = yShiftBase//-0.1;
                            let framesLength = 120 
                            let srtartPositions = [];
                            // let srtartPositions = appSharedPP.lineV2(new V2(86, 66), new V2(86, 30), { toV2: true})
                            srtartPositions.push(new V2(86, 60))
                            srtartPositions.push(new V2(87, 60))
                            srtartPositions.push(new V2(88, 60))
    
                            let deviationCLamps = (value, deviation) => {
                                return [value-deviation, value+deviation]
                            }
    
                            this.frames = animationHelpers.createSmokeFrames({
                                debug: gDebug ? true: false,
                                framesCount: framesLength, itemsCount: itemsCount,
                                startPositions: srtartPositions,//[new V2(86, 66),new V2(87, 66),new V2(88, 66), new V2(83,57),new V2(82, 58),new V2(74, 45), new V2(75, 45) ],
                                aClamps: [smokeAvalue, smokeAvalue], itemFrameslength: [framesLength, framesLength], velocityClamps: {
                                    xClamps: deviationCLamps(xShift, 0.02)
                                    , yClamps: deviationCLamps(yShift, 0.02)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFFFFF', appSharedPP
                            })
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
                }
                
            }
        }), 7)

        if(dark){
            this.darkLayers = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: originalSize.clone(),
                init() {
                    this.img = PP.createImage(model, { renderOnly: ['light', 'dark_overlay', 'light_2'] })

                    this.p = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: [20,40], size: this.size, 
                                pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'd_p')) });

                            this.registerFramesDefaultTimer({
                                framesEndCallback: () => {
                                    this.parent.parentScene.capturing.stop = true;
                                }
                            });
                        }
                    }))
                    // this.animation = this.addChild(new GO({
                    //     position: new V2(),
                    //     size: this.size,
                    //     init() {
                    //         let img = PP.createImage(model, { renderOnly: ['l_01'] })
                    //         // let totalFrames = 120
                    //         // let framesInfo = new Array(totalFrames).fill(undefined);

                    //         // let mergeData = [
                    //         //     ...new Array(10).fill(img),
                    //         //     ...new Array(5).fill(undefined),
                    //         //     ...new Array(15).fill(img),
                    //         // ]

                    //         //framesInfo.splice(60, mergeData.length, ...mergeData);

                    //         //framesInfo.splice(totalFrames);

                    //         this.currentFrame = 0;
                    //         //this.img = framesInfo[this.currentFrame];
                            
                    //         this.timer = this.regTimerDefault(10, () => {
                            
                    //             //this.img = framesInfo[this.currentFrame];
                    //             this.currentFrame++;
                    //             if(this.currentFrame == 30){
                    //                 this.currentFrame = 0;
                    //                 this.img = this.img ? undefined : img;
                    //             }
                    //         })
                    //     }
                    // }))
                    //
                }
            }), 8)
        }
        

        this.snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                let framesCount = 120;
                let itemFrameslengthClapms = [80,90]
                let cPrefix = 'rgba(230,230,230,'
                let dAlphaAdd = 0.0;
                let countMultiplier = 1.6
                this.layers = (dark ? [
                    {
                        framesCount, itemsCount: fast.r(10000*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.05].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [260,260], distanceCLamps: [100,130], xClamps: [0, this.size.x+300], yClamps: [-20, this.size.y-40], size: this.size, aMul: 1, angleYChange: [0,0],
                        snowflakeLengthClamps: [0,0], 
                    },
                    {
                        framesCount, itemsCount: fast.r(4000*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.175].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [255,260], distanceCLamps: [140,160], xClamps: [0, this.size.x+300], yClamps: [-20, this.size.y-30], size: this.size, aMul: 1, angleYChange: [0,0],
                        snowflakeLengthClamps: [0,1], 
                    },
                    {
                        framesCount, itemsCount: fast.r(2000*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.25].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [250,260], distanceCLamps: [220,240], xClamps: [0, this.size.x+300], yClamps: [-20, this.size.y-20], size: this.size, aMul: 1, angleYChange: [0,0],
                        snowflakeLengthClamps: [1,1], 
                    },
                    {
                        framesCount, itemsCount: fast.r(800*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.45].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [245,260], distanceCLamps: [280,310], xClamps: [0, this.size.x+300], yClamps: [-20, this.size.y-10], size: this.size, aMul: 1, angleYChange: [0,0],
                        snowflakeLengthClamps: [1,2], 
                    },
                    {
                        framesCount, itemsCount: fast.r(300*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.6].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [240,260], distanceCLamps: [350,400], xClamps: [0, this.size.x+300], yClamps: [-20, this.size.y], size: this.size, aMul: 1, angleYChange: [0,0], snowflakeLengthClamps: [2,3], 
                    },
                    {
                        framesCount, itemsCount: fast.r(70*countMultiplier), itemFrameslengthClapms, colorPrefix: cPrefix, aClapms: [0,0.75].map(a => a+dAlphaAdd), mask: undefined, angleClamps: [250,260], distanceCLamps: [480,520], xClamps: [0, this.size.x+500], yClamps: [-150, this.size.y], size: this.size, aMul: 1, angleYChange: [0,0], snowflakeLengthClamps: [3,4], doubleHeight: true
                    }
                    
                ] : [
                    {framesCount, itemsCount: 10000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0,0.05], mask: undefined, angleClamps: [178,182], distanceCLamps: [10,15], xClamps: [-10, this.size.x], yClamps: [-20, this.size.y-50], size: this.size, aMul: 1, angleYChange: [0,0]
                    },
                    {framesCount, itemsCount: 5000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0,0.1], mask: undefined, angleClamps: [176,184], distanceCLamps: [15,25], xClamps: [-10, this.size.x], yClamps: [-20, this.size.y-30], size: this.size, aMul: 1, angleYChange: [0,0]
                    },
                    {framesCount, itemsCount: 2000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0,0.2], mask: undefined, angleClamps: [174,186], distanceCLamps: [25,35], xClamps: [-10, this.size.x], yClamps: [-20, this.size.y-20], size: this.size, aMul: 1, angleYChange: [0,0]
                    },
                    {framesCount, itemsCount: 800, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0,0.3], mask: undefined, angleClamps: [172,188], distanceCLamps: [35,45], xClamps: [-10, this.size.x], yClamps: [-20, this.size.y-10], size: this.size, aMul: 1, angleYChange: [0,0],
                    },
                    {framesCount, itemsCount: 200, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0,0.4], mask: undefined, angleClamps: [170,190], distanceCLamps: [40,50], xClamps: [-10, this.size.x], yClamps: [-20, this.size.y], size: this.size, aMul: 1, angleYChange: [0,0],
                        
                    }
                ]).map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 9)

        this.do2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                // this.gr = createCanvas(this.size, (ctx, size, hlp) => {
                //     scenesHelper.createGradient({
                //         hlp, aValueMul: 1, center: new V2(96,88), radius: 100, gradientOrigin: new V2(96,88), origin, size, 
                //         colorPrefix: whiteColorPrefix, easingType: 'quad', easingMethod: 'out', angle: 0
                //     })
                // })
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    scenesHelper.createGradient({
                        hlp, aValueMul: 1.5, center: new V2(96,88), radius: new V2(140,140), gradientOrigin: new V2(96,88), origin, size, 
                        colorPrefix: whiteColorPrefix, easingType: 'quad', easingMethod: 'out', angle: 0
                    })
                    
                    ctx.globalCompositeOperation = 'source-out'
                    
                    hlp.setFillColor('rgba(0,0,0,0.85)').rect(0,0,size.x, size.y)
                    
                })
            }
        }), 10)
    }
}