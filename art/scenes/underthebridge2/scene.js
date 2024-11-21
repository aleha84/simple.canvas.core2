class UnderTheBridge2Scene extends Scene {
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
                fileNamePrefix: 'underthebridge2',
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
    1. Фон
    2. Мост
    3. Земля
    4. ближний план
    5. Фонарь
    6. Машина
    -------------------
    +1. Дождь вокруг главного фонаря
    +2. Капли на машине, стеклоочистители
    +3. Анимация частиц на всём fg
    +4. Проезжающая по мосту машина
    +5. Капли капают с края моста
    +6. Струя воды льётся с края моста в лужу
    +7. Трафик в дали, с моргающим светофором
    +8. Моргание окон в доме
    +9. Сместить тень под машиной
    -10. Второе авто на мосту?
    */

    start(){
        let model = UnderTheBridge2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let disableRain = false;
        
        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, brighterZone }) {
            let frames = [];

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);

                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);

                let maxA = aValue;
                if(brighterZone && isBetween(p0.x, brighterZone.xClamps) && brighterZone.canUse()) {
                    maxA*=fast.r(getRandom(brighterZone.aMulClamps[0], brighterZone.aMulClamps[1]),2);
                }

                let lineAValues = undefined;
                if (useACurve) {
                    lineAValues = easing.fast({ from: 0, to: maxA, steps: len-1, type: 'linear', round: 2 })
                    lineAValues.push(maxA/2)
                }

                let frames = [];
                let current = p0;
                let ly = isArray(lowerY) ? getRandomInt(lowerY) : lowerY;

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
                    lowerY: ly,
                    lineAValues
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

                            if (!useACurve)
                                pp.lineV2(p0, p1);
                            else {
                                let points = appSharedPP.lineV2(p0, p1)
                                for (let i = 0; i < points.length; i++) {
                                    let a = itemData.lineAValues[i];
                                    if (a == undefined)
                                        a = 0;

                                    let p = points[i];
                                    if (p.y > itemData.lowerY)
                                        continue;

                                    hlp.setFillColor(whiteColorPrefix + a + ')').dot(points[i])
                                }
                            }
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
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bg'] }),
                    init() {
                        this.windowsAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let hexColors = ['#2f3e49', '#3f545f', '#618487', '#81b1b1']
                                let hColors = hexColors.map(hex => colors.colorTypeConverter({ value: hex, fromType: 'hex', toType: 'rgb' })).map(rgb => rgb.r*1000000+rgb.g*1000+rgb.b);
        
                                let hPixels = getPixels(this.parent.img, this.size);
                                let excludeX = [27,32];
        
                                let pointsData = [];
                                for(let i = 0; i < hPixels.length; i++) {
                                    let curPixel = hPixels[i];
        
                                    if(isBetween(curPixel.position.x, excludeX))
                                        continue;   

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
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        this.parent.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))

                        this.farTraffic = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createTrafficFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                                let frames = [];
                                let xClamps = [106, 118];
                                let yValues = [116,117]
                                let redColorPrefix = 'rgba(204,46,49,'
                                let blackColorPrefix = 'rgba(0,0,0,'
                                let yellowColorPrefix = 'rgba(246,211,0,'
                                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount-1);
                                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                                    
                                    let maxAValue = fast.r(getRandom(0.025, 0.075),3)
                                    let isRed = false//getRandomBool();
                                    let isStatic = false//getRandomInt(0, 4) == 0
                                    
                                    let xValues = [];
                                    let aValues = []
                                    // if(i == 0) {
                                    //     totalFrames = framesCount
                                    //     xValues = new Array(totalFrames).fill(109)
                                    //     isRed = true;
                                    //     aValues = [
                                    //         ...easing.fast({from: 0, to: 0.2, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                    //         ...easing.fast({from: 0.2, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                                    //     ]
                                    // }
                                    // else {
                                        let x0 = xClamps[0];
                                        let x1 = xClamps[1];
                                        if(getRandomBool()){
                                            x0 = xClamps[1];
                                            x1 = xClamps[0];
                                            //isRed = true;
                                        }
                                        xValues = easing.fast({from: x0, to: x1, steps: totalFrames, type: 'linear', round: 0})
                                        aValues = new Array(totalFrames).fill(maxAValue)
                                    //}

                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                            a: aValues[f],
                                            x: xValues[f]
                                        };
                                    }
                                
                                    return {
                                        y: yValues[getRandomInt(0, yValues.length-1)],
                                        isRed, 
                                        frames
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            if(itemData.frames[f]){
                                                hlp.setFillColor((itemData.isRed ? yellowColorPrefix : whiteColorPrefix) + itemData.frames[f].a + ')').rect(itemData.frames[f].x, itemData.isRed ? 115: 116, 1,1)
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                this.frames = this.createTrafficFrames({ framesCount: 300, itemsCount: 20, itemFrameslengthClamps: [100,150], size: this.size });
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))
            }
        }), 1)

        this.cars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let lightMask = createCanvas(this.size, (ctx, size, hlp) => {
                    let y = 60 //84
                    scenesHelper.createGradient({ hlp, aValueMul: 1, center: new V2(137, y), radius: new V2(50, 50), gradientOrigin: new V2(137, y), size: this.size, colorPrefix: whiteColorPrefix })

                    scenesHelper.createGradient({ hlp, aValueMul: 1, center: new V2(40, y), radius: new V2(50, 50), gradientOrigin: new V2(40, y), size: this.size, colorPrefix: whiteColorPrefix })
                })



                this.debug = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.drawImage(lightMask,0,0)
                            
                        // })
                    }
                }))

                this.car1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 100;
                        let delayFrames = 200;
                        let initialShift = 80;
                        this.frames = [];

                        let carDark = PP.createImage(model, { renderOnly: ['bridge_car_1'] })
                        let carLight = PP.createImage(model, { renderOnly: ['bridge_car_1_lm'] })
                        
                        let xValues = easing.fast({from: initialShift, to: -150, steps: totalFrames, type: 'linear', round: 0})

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(carDark, xValues[f], 0)

                                ctx.drawImage(createCanvas(this.size, (ctx1, size1, hlp1) => {
                                    ctx1.globalAlpha = 1
                                    ctx1.drawImage(lightMask, 0, 0)
                                    ctx1.globalCompositeOperation = 'source-in'
                                    ctx1.drawImage(carLight, xValues[f], 0)
                                }), 0, 0)
                            })
                        }

                        this.frames.push(...new Array(delayFrames).fill(undefined))

                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.car2 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let initDelay = 90
                //         let totalFrames = 150;
                //         let delayFrames = 60;
                //         let initialShift = 40;
                //         this.frames = new Array(initDelay).fill(undefined)

                //         let carDark = PP.createImage(model, { renderOnly: ['bridge_car_2'] })
                //         let carLight = PP.createImage(model, { renderOnly: ['bridge_car_2_lm'] })
                        
                //         let xValues = easing.fast({from: initialShift, to: -190, steps: totalFrames, type: 'linear', round: 0})

                //         for(let f = 0; f < totalFrames; f++) {
                //             this.frames[initDelay+f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 ctx.drawImage(carDark, xValues[f], 0)

                //                 ctx.drawImage(createCanvas(this.size, (ctx1, size1, hlp1) => {
                //                     ctx1.globalAlpha = 1
                //                     ctx1.drawImage(lightMask, 0, 0)
                //                     ctx1.globalCompositeOperation = 'source-in'
                //                     ctx1.drawImage(carLight, xValues[f], 0)
                //                 }), 0, 0)
                //             })
                //         }

                //         this.frames.push(...new Array(delayFrames).fill(undefined))

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                let mask = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                    let gData = PP.getLayerByName(model, 'bridge_rain_g').groups[0];
                    let verticalCutPoints = appSharedPP.curveByCornerPoints(PP.getLayerByName(model, 'bridge_rain_g_upper_curve').groups[0].points.map(p => new V2(p.point)),10)

                    let rgb = colors.colorTypeConverter({ value: gData.color, fromType: 'hex', toType: 'rgb' });
                    let colorPrefix = `rgba(${rgb.r},${rgb.g}, ${rgb.b},`

                    scenesHelper.createGradient({
                        hlp,
                        ...gData,
                        size,
                        colorPrefix: colorPrefix,
                        verticalCut: {
                            points: appSharedPP.lineByCornerPoints(verticalCutPoints.map(p => new V2(p.x, p.y+0))),
                            aValuesMul: easing.fast({from: 1, to: 0, steps: 4, type: 'linear', round: 2})
                        } 
                    });
                })

                this.rainFrames = createRainFrames({ angleClamps: [0, 0], lengthClamps: [4, 5], xClamps: [10, 70], upperYClamps: [0, 30], lowerY: 95, aValue: 0.15, speedClapms: [1, 1.5], mask: mask, framesCount: 300, itemsCount: 1000, size: this.size, useACurve: true,
                    brighterZone: { xClamps: [34,39], canUse: () => getRandomInt(0,1) == 0, aMulClamps: [1.2, 1.7] }
                })

                this.leftLampRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.rainFrames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rightLampRain = this.addChild(new GO({
                    position: new V2(103,0),
                    size: this.size,
                    frames: this.rainFrames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), 2)

        this.bridge = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bridge'] }),
                    init() {

                    }
                }))
            }
        }), 3)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                    let gData = PP.getLayerByName(model, 'rain_g').groups[0];

                    let rgb = colors.colorTypeConverter({ value: gData.color, fromType: 'hex', toType: 'rgb' });
                    let colorPrefix = `rgba(${rgb.r},${rgb.g}, ${rgb.b},`

                    scenesHelper.createGradient({
                        hlp,
                        ...gData,
                        size,
                        colorPrefix: colorPrefix,
                        verticalCut: {
                            points: appSharedPP.lineByCornerPoints([new V2(58,52+3), new V2(106,37+3), new V2(113,37+3), new V2(163,52+3)].map(p => new V2(p.x, p.y+2))),
                            aValuesMul: easing.fast({from: 1, to: 0, steps: 8, type: 'linear', round: 2})
                        } 
                    });
                })

                let mask2 = createCanvas(this.size.clone(), (ctx, size, hlp) => {
                    let gData = PP.getLayerByName(model, 'rain_g').groups[0];

                    let rgb = colors.colorTypeConverter({ value: gData.color, fromType: 'hex', toType: 'rgb' });
                    let colorPrefix = `rgba(${rgb.r},${rgb.g}, ${rgb.b},`

                    scenesHelper.createGradient({
                        hlp,
                        ...gData,
                        size,
                        colorPrefix: colorPrefix,
                        verticalCut: {
                            points: appSharedPP.lineByCornerPoints([new V2(58,52+10+2), new V2(106,37+2+2), new V2(113,37+2+2), new V2(163,52+10+2)].map(p => new V2(p.x, p.y+2))),
                            aValuesMul: easing.fast({from: 1, to: 0, steps: 8, type: 'linear', round: 2})
                        } 
                    });
                })
                
                //PP.createImage(model, { renderOnly: ['rain_g'] })

                this.rainB = this.addChild(new GO({
                    position: new V2(0, 0),
                    size: this.size,
                    init() {
                        if(disableRain)
                            return

                        this.frames = createRainFrames({ angleClamps: [0, 0], lengthClamps: [10, 15], xClamps: [50, 160], upperYClamps: [-20, 20], lowerY: 140, aValue: 0.10, speedClapms: [3, 3], mask: mask, framesCount: 300, itemsCount: 2000, size: this.size, useACurve: true })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['lamp'] }),
                    init() {
                        
                    }
                }))

                this.rainF = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        if(disableRain)
                            return

                        this.frames = createRainFrames({ angleClamps: [0, 0], lengthClamps: [10, 12], xClamps: [50, 160], upperYClamps: [-20, 20], lowerY: 140, aValue: 0.2, speedClapms: [4, 4], mask: mask2, framesCount: 300, itemsCount: 2000, size: this.size, useACurve: true,
                            brighterZone: { xClamps: [105,114], canUse: () => getRandomInt(0,1) == 0, aMulClamps: [1.5, 2] }
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.light = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     img: createCanvas(this.size, (ctx, size, hlp) => {
                //         ctx.globalAlpha = 0.05;
                //         ctx.drawImage(mask2, 0, 0)
                //     })
                // }))
            }
        }), 5)

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['fg'] }),
                    init() {
                        //
                    }
                }))

                this.cat = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['cat'] }),
                    init() {
                        //
                    }
                }))

                this.p1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'fg_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 40, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'fg_p_2')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let startPositions = appSharedPP.lineV2(new V2(30, 39), new V2(199, 23))
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 300, itemFrameslength1Clamps: [10, 20], itemFrameslength2Clamps: [20, 20], size: this.size, opacityClamps: [0.1, 0.15],
                            startPositions: [
                                {
                                    data: startPositions,
                                    height: 50, useAll: true, colorPrefix: whiteColorPrefix, tail: 3
                                }
                            ], reduceOpacityOnFall: true, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.faterFall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createWaterFallFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        let p0 = new V2(45, 38)
                        let lowerY = 163;

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let x = p0.x;

                            let aValue = fast.r(getRandom(0.01, 0.05),2);
                            let len = getRandomInt(2,4);
                            let yValues = easing.fast({from: p0.y, to: lowerY, steps: totalFrames, type: 'sin', method: 'in', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    y: yValues[f]
                                };
                            }
                        
                            return {
                                x,
                                aValue, len,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(whiteColorPrefix + itemData.aValue + ')').rect(itemData.x, itemData.frames[f].y, 1, itemData.len)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createWaterFallFrames({ framesCount: 300, itemsCount: 500, itemFrameslengthClamps: [35,40], size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSplashFrames({framesCount, splashesCount, splashesStartPoints, itemFrameslengthClamps, maxA, size, gravityClamps = [0.035,0.06], particlesCountClamps = [3,5], noColorChange, startFrameIndicesRandomization = false, splashAMul = 1, rainColorPrefix
                    }) {
                        let frames = [];
                        //let gravity = 0.02;
                        
                        // if(!gravityClamps) {
                        //     gravityClamps = [0.035,0.06]
                        // }
    
        
                        let itemsData = new Array(splashesCount).fill(undefined).map((_, i) => {
                            //let startPoint = splashesStartPoints[getRandomInt(0, splashesStartPoints.length-1)]
                            let startFrameIndex = startFrameIndicesRandomization
                                ? getRandomInt(0, framesCount-1)
                                :fast.r((i/splashesStartPoints.length)*framesCount)+ getRandomInt(0, 25) //getRandomInt(0, framesCount-1);
    
                            let startPoint = splashesStartPoints[getRandomInt(0, splashesStartPoints.length-1)]
                            let totalFrames = framesCount;
                            let itemsCount = getRandomInt(particlesCountClamps);
        
                            let frames = [];
        
                            let particlesData = new Array(itemsCount).fill().map((_, ii) => ({
                                ttl: getRandomInt(itemFrameslengthClamps),
                                speedV: V2.up.rotate(getRandomInt(0, 30)*(ii%2==0 ? -1 : 1)).mul(getRandom(0.25,0.75)),  //new V2(getRandom(0,0.2)*(ii%2==0 ? -1 : 1), getRandom(-0.4, -0.8)),
                                currentP: startPoint.add(new V2(getRandomInt(-2,2),0)),
                                gravity: getRandom(gravityClamps[0],gravityClamps[1])
                            }))
        
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
        
                                let framesData = [];
        
                                for(let pd = 0; pd < particlesData.length; pd++) {
                                    let currentPd = particlesData[pd];
                                    if(!currentPd.aValues) {
                                        currentPd.aValues = easing.fast({from: maxA, to: 0, steps: currentPd.ttl, type: 'linear', round: 2 })
                                    }
        
                                    if(currentPd.ttl < 0)
                                        continue; 
        
                                    framesData[framesData.length] = {
                                        p: currentPd.currentP.clone(),
                                        a: currentPd.aValues[f]*splashAMul
                                    }
        
                                    currentPd.currentP = currentPd.currentP.add(currentPd.speedV);
                                    currentPd.speedV.y+=currentPd.gravity;
                                    currentPd.ttl--;
                                }
                        
                                frames[frameIndex] = framesData;
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
                                        for(let i = 0 ; i < itemData.frames[f].length; i++) {
                                            let pd = itemData.frames[f][i];
        
                                            let p = pd.p.toInt();
                                            let c = rainColorPrefix;
        
                                            if(pd.a != undefined)
                                                hlp.setFillColor(c + pd.a + ')').dot(p)
                                        }
                                    }
                                    
                                }
    
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSplashFrames({ framesCount: 100, splashesCount: 20, splashesStartPoints: [new V2(45, 166), new V2(44,166), new V2(46,166), new V2(45, 167)], itemFrameslengthClamps: [10,20], maxA: 0.2, size: this.size, particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['car'] }),
                    init() {
                        //
                    }
                }))

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.layers = new Array(1).fill(undefined).map((_,i) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let corners1 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone_' + (i))).map(pd => new V2(pd.point));
                                
                                let maxA = 0.3;
                                let minA = 0.1;

                                let availableDots = [
                                    ...appSharedPP.fillByCornerPoints(corners1).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(minA, maxA), 2) + ')' })),
                                ];

                                let predicate = () => getRandomInt(0, 3) == 0;
        
                                this.frames = animationHelpers.createMovementFrames({
                                    framesCount: 300, itemFrameslength: [10, 20], pointsData: availableDots, size: this.size,
                                    pdPredicate: predicate,
                                });
        
                                this.registerFramesDefaultTimer({ });
                    }})));
                        
                    }
                }))

                this.cleaners = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 100;
                        let delayFrames = 50;
                        this.frames = [];

                        let t = 'sin'
                        let m = 'out'
                        let data = [
                            {
                                p0: new V2(103, 148),
                                lenValues: [
                                    ...easing.fast({from: 9, to: 5, steps: totalFrames/2, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 5, to: 9, steps: totalFrames/2, type: t, method: m, round: 2})
                                ],
                                angleValues: [
                                    ...easing.fast({from: 0, to: 80, steps: totalFrames/2, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 80, to: 0, steps: totalFrames/2, type: t, method: m, round: 2})
                                ]
                            },
                            {
                                p0: new V2(109, 147),
                                lenValues: [
                                    ...easing.fast({from: 7, to: 5, steps: totalFrames/2, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 5, to: 7, steps: totalFrames/2, type: t, method: m, round: 2})
                                ],
                                angleValues: [
                                    ...easing.fast({from: 0, to: 65, steps: totalFrames/2, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 65, to: 0, steps: totalFrames/2, type: t, method: m, round: 2})
                                ]
                            }
                        ]

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                

                                data.forEach(d => {
                                    pp.setFillColor('rgba(0,0,0,0.2)')
                                    let direction = V2.left.rotate(d.angleValues[f]);
                                    pp.lineV2(d.p0, d.p0.add(direction.mul(d.lenValues[f]+1)))

                                    pp.setFillColor('rgba(0,0,0,0.3)')
                                    let p1 = d.p0.add(direction.mul(fast.r(d.lenValues[f]/2)));
                                    pp.lineV2(p1, d.p0.add(direction.mul(d.lenValues[f]+1)))
                                })
                            })
                        }

                        this.frames.push(...new Array(delayFrames).fill(undefined))

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'car_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 9)
    }
}