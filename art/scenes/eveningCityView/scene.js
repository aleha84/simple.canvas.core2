class EveningCityViewScene extends Scene {
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
                fileNamePrefix: 'eveningCityView',
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
        const model = EveningCityViewScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        const whiteColorPrefix = 'rgba(255,255,255,'
        const redColorPrefix = 'rgba(234,11,6,'
        const brightColorPrefix = 'rgba(241,185,135,'

        let createGradient = ({hlp, aValueMul, center, radius, gradientOrigin, size, colorPrefix, easingType = 'quad', easingMethod = 'out', angle = 0}) => {
            let gradientDots = colors.createRadialGradient({ size: size.clone(), 
                center, radius, gradientOrigin, angle, easingType, easingMethod,
                setter: (dot, aValue) => {
                    aValue*=aValueMul;

                    if(!dot.values){
                        dot.values = [];
                        dot.maxValue = aValue;
                    }
    
                    if(aValue > dot.maxValue)
                        dot.maxValue = aValue;
    
                    dot.values.push(aValue);
                } 
            })

            for(let y = 0; y < gradientDots.length; y++) {
                if(gradientDots[y]) {
                    for(let x = 0; x < gradientDots[y].length; x++) {
                        if(gradientDots[y][x]) {
                            hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue/1,2)})`).dot(x,y) 
                        }
                    }
                }
            }
        }

        let mainFrontalMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {

            let aValueMul = 1;
            createGradient({hlp, aValueMul, center: new V2(152,131), radius: new V2(14,8), gradientOrigin: new V2(147,131), size, colorPrefix: redColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(129,144), radius: new V2(30,30), gradientOrigin: new V2(129,144), size, colorPrefix: redColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(136,142), radius: new V2(15,15), gradientOrigin: new V2(136,142), size, colorPrefix: brightColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(162,138), radius: new V2(12,12), gradientOrigin: new V2(161,138), size, colorPrefix: brightColorPrefix});  
        })

        let backFrontalMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {

            let aValueMul = 1;
            createGradient({hlp, aValueMul, center: new V2(44,131), radius: new V2(30,25), gradientOrigin: new V2(49,131), size, colorPrefix: brightColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(73,128), radius: new V2(30,25), gradientOrigin: new V2(73,128), size, colorPrefix: brightColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(46,130), radius: new V2(10,10), gradientOrigin: new V2(46,130), size, colorPrefix: redColorPrefix});
            createGradient({hlp, aValueMul, center: new V2(165,138), radius: new V2(30,30), gradientOrigin: new V2(160,138), size, colorPrefix: redColorPrefix});
            // createGradient({hlp, aValueMul, center: new V2(136,142), radius: new V2(15,15), gradientOrigin: new V2(136,142), size, colorPrefix: brightColorPrefix});
            // createGradient({hlp, aValueMul, center: new V2(161,138), radius: new V2(12,12), gradientOrigin: new V2(161,138), size, colorPrefix: brightColorPrefix});  
        })

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, addShining,
            aClamps,xClamps, yClamps, angleClamps, speedClamps, speedMul= 1, aMul =1, cPrefix, mask,
        }) {
            let frames = [];
            //speedMul = 0.75
            //let speedChangeValues = [];

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let speed = getRandom(speedClamps[0]*speedMul, speedClamps[1]*speedMul);

                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let addShine = addShining && p0.y > 60 && getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(25,45);
                    shineMul = getRandomInt(2,3);

                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                }
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = p0.add(direction.mul(speed*f)).toInt();
                    let a = aValues[f] != undefined ? aValues[f]*aMul : aClamps[0];

                    if(a < aClamps[0])
                        a = aClamps[0];
            
                    frames[frameIndex] = {
                        p,a
                    };
                }
            
                return {
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let {p,a} = itemData.frames[f];

                            hlp.setFillColor(cPrefix + a + ')').dot(p)
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
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['city'] })

                this.city_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [100,150], size: this.size, 
                            //smooth: { aClamps: [0, 0.5], easingType: 'quad', easingMethod: 'inOut', easingRound: 2 },
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'city_p'))
                            .map(p => ({
                                ...p,
                                color: 'rgba(' + (getRandomBool() ? '255,255,255,': '255,255,255,' ) + fast.r(getRandom(0.025, 0.025), 3) + ')'
                            })) 
                        }).map(f => createCanvas(
                                this.size, (ctx, size, hlp) => {
                                    //ctx.globalAlpha = 0.35;
                                    ctx.drawImage(f, 0,0);
                                }
                            ));

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.powerLines = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['pl2', 'pl1'] })

                this.lights = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let aValues = [
                            ...easing.fast({from: 0, to: 1, steps: 150, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: 1, to: 0, steps: 150, type: 'quad', method: 'inOut', round: 2})
                        ]

                        let originalImage = PP.createImage(model, { renderOnly: ['pl_lights_1'] })

                        this.frames = [];
                        for(let f = 0; f < 300; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[f];
                                ctx.drawImage(originalImage, 0, 0);
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.lights = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let aValues = [
                            ...easing.fast({from: 1, to: 0, steps: 150, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: 0, to: 1, steps: 150, type: 'quad', method: 'inOut', round: 2})
                        ]

                        let originalImage = PP.createImage(model, { renderOnly: ['pl_lights_2'] })

                        this.frames = [];
                        for(let f = 0; f < 300; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[f];
                                ctx.drawImage(originalImage, 0, 0);
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground'] })

                this.ground_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_shine_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#FFFFFF'
                        }));

                        let frames1 = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [60,100], pointsData: availableDots, size: this.size,
                        pdPredicate: () => getRandomInt(0,50) == 0, smooth: {
                            aClamps: [0,0.05], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                        }});

                        // let frames2 = animationHelpers.createMovementFrames({framesCount: 200, itemFrameslength: [30,60], pointsData: availableDots, size: this.size,
                        //     pdPredicate: () => getRandomInt(0,70) == 0, smooth: {
                        //         aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                        //     }});

                        this.frames = frames1.map((_,f) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames1[f], 0, 0);
                        //    ctx.drawImage(frames2[f], 0, 0);
                        }))

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 7)

        let snowSpeedClamps = [0.3,0.35]
        let snowItemFrameslengthClamps = [50,60];
        let snowAngleClamps = [-5,5];

        this.backSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = backFrontalMask
                this.left = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({
                            framesCount: 150, itemsCount: 600, itemFrameslengthClamps: snowItemFrameslengthClamps, size: this.size, addShining: false, aClamps: [0, 0.75], 
                            xClamps: [0,100], yClamps: [100, 150], angleClamps: snowAngleClamps, speedClamps: snowSpeedClamps, speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask: backFrontalMask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.right = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames({
                            framesCount: 150, itemsCount: 400, itemFrameslengthClamps: snowItemFrameslengthClamps, size: this.size, addShining: false, aClamps: [0, 1], 
                            xClamps: [140,190], yClamps: [100, 170], angleClamps: snowAngleClamps, speedClamps: snowSpeedClamps, speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask: backFrontalMask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 8)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['car'] })
            }
        }), 9)

        this.frontalSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.img = mainFrontalMask
                this.frames = createSnowFrames({
                    framesCount: 150, itemsCount: 400, itemFrameslengthClamps: snowItemFrameslengthClamps, size: this.size, addShining: false, aClamps: [0, 1], 
                    xClamps: [100,190], yClamps: [110, 170], angleClamps: snowAngleClamps, speedClamps: snowSpeedClamps, speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask: mainFrontalMask
                })

                this.registerFramesDefaultTimer({});
            }
        }), 10)

        this.close_bush = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['close_bush'] })
            }
        }), 11)
    }}