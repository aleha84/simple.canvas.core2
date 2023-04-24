class NightStairs2Scene extends Scene {
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
                fileNamePrefix: 'nightstairs2',
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
        const model = NightStairs2Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(209,208,204,';

        let createFogFrames = function({totalFrames, size, topLeft, aClamps, noiseImgSize, aMul = 1,seed, paramsDivider = 30, timeClamp = 1, cutoffValue = 10,
            noiseMultiplier = 4
        }) {
            let frames = [];

            let pn = new mathUtils.Perlin('random seed ' + (seed ? seed : getRandom(0,1000)));

            frames = [];

            let aValues = easing.fast({from: 0, to: 1, steps: 100 - cutoffValue, type: 'linear', round: 3})
            let timeValues = easing.fast({ from: 0, to: timeClamp, steps: totalFrames, type: 'linear', round: 3 })
            let globalAlpha = [
                ...easing.fast({from: aClamps[0], to: aClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                ...easing.fast({from: aClamps[1], to: aClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
            ]
            
            //let paramsDivider = 30;
            let timeDivider = 1;

            for(let f = 0; f < totalFrames; f++){
                let time = timeValues[f]/timeDivider;

                let frame = createCanvas(size, (ctx, size, hlp) => {
                    ctx.globalAlpha = globalAlpha[f];
                    for(let y = topLeft.y; y < noiseImgSize.y+topLeft.y; y++){
                        for(let x = topLeft.x; x < noiseImgSize.x+topLeft.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);
                            if(noise < cutoffValue) {
                                continue; 
                            }

                            noise = fast.r(noise/noiseMultiplier)*noiseMultiplier

                            let a = aValues[noise-cutoffValue]*aMul;

                            hlp.setFillColor(colorPrefix + a + ')').dot(x,y);
                        }
                    }
                })

                frames[f] = frame;
            }

            return frames;
        }

        let createSnowfallFrames = function({
            aClamps, xClamps, yClamps, lightCenter, radiusClamps, angleClamps, speedClamps, 
            framesCount, itemsCount, itemFrameslengthClamps, size, _colorPrefix, mask, addShining = true, 
        }) {
            let frames = [];

            let speedMul = 0.85
            let radiusMul = 1.5

            let cPrefix = _colorPrefix;
            if(!cPrefix) 
                cPrefix = colorPrefix;

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let radius, aMulValues;

                if(radiusClamps) {
                    radius = getRandomInt(radiusClamps[0]*radiusMul, radiusClamps[1]*radiusMul);
                    aMulValues = easing.fast({from: 1, to: 0, steps: radius, type: 'linear', method: 'base', round: 3 })
                }

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let direction = V2.up.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let speed = getRandom(speedClamps[0]*speedMul, speedClamps[1]*speedMul);

                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let addShine = addShining && getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(5,15);
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
                    let distanceToLightCenter = fast.r(p.distance(lightCenter));
                    let aMul = aClamps[0];
                    if(distanceToLightCenter) {
                        if(distanceToLightCenter < radius) {
                            aMul = aMulValues[distanceToLightCenter];
                        }
                    }
                    else {
                        aMul = 1;
                    }

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
                        ctx.globalCompositeOperation = 'destination-in'
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
                

                this.bgSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 200;
                        let sizeDivider = 4;
                        let paramsDivider = 18;
                        let forSize = this.size.divide(sizeDivider)
                        let frames1 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                            aMul: 1, paramsDivider, cutoffValue: 10, timeClamp: 1 })
                        let frames2 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                            aMul: 1, paramsDivider, cutoffValue: 10, timeClamp: 1 })
                        let frames3 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                            aMul: 1, paramsDivider, cutoffValue: 10, timeClamp: 1 })
        
                        let resultFogFrames = new Array(totalFrames).fill().map((el,f) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames1[f], 0, 0, size.x, size.y);
                            
                            let f2 = f+fast.r(totalFrames/3);
                            if(f2 > (totalFrames-1)) {
                                f2-=totalFrames;
                            }
                            ctx.drawImage(frames2[f2], 0, 0, size.x, size.y);
                
                            let f3 = f+fast.r(totalFrames*2/3);
                            if(f3 > (totalFrames-1)) {
                                f3-=totalFrames;
                            }
                            ctx.drawImage(frames3[f3], 0, 0, size.x, size.y);
                        }))


                        let params = [
                            {
                                aClamps: [0,0.075], xClamps: [-10,210], yClamps: [-10,135], angleClamps: [170, 220], 
                                speedClamps: [0.175, 0.215], framesCount: totalFrames, itemsCount: 5000, itemFrameslengthClamps: [80,100], size: this.size
                            }
                        ]

                        this.layers = params.map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowfallFrames(p).map((f, i) => createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.drawImage(resultFogFrames[i], 0, 0)
                                    ctx.globalCompositeOperation = 'source-in'
                                    ctx.drawImage(f, 0, 0)
                                }));
        
                                this.registerFramesDefaultTimer({
                                    framesChangeCallback: () => {
                                        let foo = true;
                                    }
                                });
                            }
                        })))
                    }
                }));

                this.leftSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let lightCenter = new V2(55,69)
                        let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                            center: lightCenter, radius: new V2(40,40), gradientOrigin: lightCenter, 
                            angle: 0, easingType: 'cubic', easingMethod: 'out',
                            setter: (dot, aValue) => {
                                if(!dot.values){
                                    dot.values = [];
                                    dot.maxValue = aValue;
                                }
                
                                if(aValue > dot.maxValue)
                                    dot.maxValue = aValue;
                
                                dot.values.push(aValue);
                            } 
                        })
        
                        let cPrefix = 'rgba(186,195,172,'
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let y = 0; y < gradientDots.length; y++) {
                                if(gradientDots[y]) {
                                    for(let x = 0; x < gradientDots[y].length; x++) {
                                        if(gradientDots[y][x]) {
                                            //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                            hlp.setFillColor(`${cPrefix}${fast.r(gradientDots[y][x].maxValue/1,2)})`).dot(x,y) 
                                        }
                                    }
                                }
                            }

                        })



                        let params = [
                            {
                                aClamps: [0,0.1], xClamps: [-10,100], yClamps: [5,120], lightCenter, radiusClamps: [40,70], angleClamps: [160, 220], 
                                speedClamps: [0.2, 0.245], framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.2], xClamps: [-10,100], yClamps: [5,120], lightCenter, radiusClamps: [30,40], angleClamps: [160, 230], 
                                speedClamps: [0.3, 0.345], framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.35], xClamps: [-10,100], yClamps: [5,120], lightCenter, radiusClamps: [25,35], angleClamps: [150, 240], 
                                speedClamps: [0.35, 0.4], framesCount: 100, itemsCount: 500, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.5], xClamps: [-10,100], yClamps: [5,120], lightCenter, radiusClamps: [20,30], angleClamps: [150, 240], 
                                speedClamps: [0.35, 0.45], framesCount: 100, itemsCount: 300, itemFrameslengthClamps: [80,100], size: this.size, addShining: false
                            },
                            {
                                aClamps: [0,0.7], xClamps: [-10,100], yClamps: [5,120], lightCenter, radiusClamps: [15,20], angleClamps: [140, 240], 
                                speedClamps: [0.4, 0.5], framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [80,100], size: this.size, addShining: false
                            },
                        ]


                        this.layers = params.map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowfallFrames(p)
        
                                this.registerFramesDefaultTimer({
                                    framesChangeCallback: () => {
                                        let foo = true;
                                    }
                                });
                            }
                        })))
                    }
                }))

                this.rightSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let lightCenter = new V2(177,60)
                        let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                            center: lightCenter, radius: new V2(40,40), gradientOrigin: lightCenter, 
                            angle: 0, easingType: 'cubic', easingMethod: 'out',
                            setter: (dot, aValue) => {
                                if(!dot.values){
                                    dot.values = [];
                                    dot.maxValue = aValue;
                                }
                
                                if(aValue > dot.maxValue)
                                    dot.maxValue = aValue;
                
                                dot.values.push(aValue);
                            } 
                        })
        
                        let cPrefix = 'rgba(186,195,172,'
                        
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let y = 0; y < gradientDots.length; y++) {
                                if(gradientDots[y]) {
                                    for(let x = 0; x < gradientDots[y].length; x++) {
                                        if(gradientDots[y][x]) {
                                            //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                            hlp.setFillColor(`${cPrefix}${fast.r(gradientDots[y][x].maxValue/1.5,2)})`).dot(x,y) 
                                        }
                                    }
                                }
                            }
                        })



                        let params = [
                            {
                                aClamps: [0,0.1], xClamps: [100,200], yClamps: [5,120], lightCenter, radiusClamps: [40,70], angleClamps: [160, 220], 
                                speedClamps: [0.2, 0.245], framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.2], xClamps: [100,200], yClamps: [5,120], lightCenter, radiusClamps: [30,40], angleClamps: [160, 230], 
                                speedClamps: [0.3, 0.345], framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.35], xClamps: [100,200], yClamps: [5,120], lightCenter, radiusClamps: [25,35], angleClamps: [150, 240], 
                                speedClamps: [0.35, 0.4], framesCount: 100, itemsCount: 500, itemFrameslengthClamps: [80,100], size: this.size
                            },
                            {
                                aClamps: [0,0.5], xClamps: [100,200], yClamps: [5,120], lightCenter, radiusClamps: [20,30], angleClamps: [150, 240], 
                                speedClamps: [0.35, 0.45], framesCount: 100, itemsCount: 300, itemFrameslengthClamps: [80,100], size: this.size, addShining: false
                            },
                            {
                                aClamps: [0,0.7], xClamps: [100,200], yClamps: [5,120], lightCenter, radiusClamps: [15,20], angleClamps: [140, 240], 
                                speedClamps: [0.4, 0.5], framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [80,100], size: this.size, addShining: false
                            },
                        ]


                        this.layers = params.map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowfallFrames(p)
        
                                this.registerFramesDefaultTimer({
                                    framesChangeCallback: () => {
                                        let foo = true;
                                    }
                                });
                            }
                        })))
                    }
                }))
            }
        }), 1)

        this.left_wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['left_wall', 'left_wall_d'] })
            }
        }), 3)

        this.right_wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['right_wall'] })
            }
        }), 5)

        this.stairs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['stairs', 'perilo_left', 'perilo_right'] })

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#FFFFFF'
                        }));

                        let frames1 = animationHelpers.createMovementFrames({framesCount: 200, itemFrameslength: [30,40], pointsData: availableDots, size: this.size,
                        pdPredicate: () => getRandomInt(0,50) == 0, smooth: {
                            aClamps: [0,0.1], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                        }});

                        let frames2 = animationHelpers.createMovementFrames({framesCount: 200, itemFrameslength: [30,60], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,70) == 0, smooth: {
                                aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }});

                        this.frames = frames1.map((_,f) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames1[f], 0, 0);
                            ctx.drawImage(frames2[f], 0, 0);
                        }))

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.bgSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let params = [
                            {
                                aClamps: [0,0.15], xClamps: [-10,140], yClamps: [-10,100], angleClamps: [170, 220], 
                                speedClamps: [0.45, 0.55], framesCount: 200, itemsCount: 100, itemFrameslengthClamps: [80,100], size: this.size
                            }
                        ]

                        this.layers = params.map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = createSnowfallFrames(p)
        
                                this.registerFramesDefaultTimer({
                                    framesChangeCallback: () => {
                                        let foo = true;
                                    }
                                });
                            }
                        })))
                    }
                }));
            }
        }), 7)

        this.roof = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['roof'] })
            }
        }), 9)
    }
}