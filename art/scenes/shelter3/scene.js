class Shelter3Scene extends Scene {
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
                //dither: Recorder.gif.ditherTypes.FloydSteinberg,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(160,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'shelter3',
                utilitiesPathPrefix: '../../..',
                workersCount: 8,
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Shelter3Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        /*
        +1. Основной дождь
        +2. Капли с верхнего края
        +3. Анимация окон в здании
        +4. телевизор в одном из окон
        +5. Лёгкое мерцание фар
        +6. маленькие брызги на дороге
         7. Капли с перил
         8. Движение кустов
        */

        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, excludeMask }) {
            let frames = [];
    
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);
    
                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);
    
                let lineAValues = undefined;
                if (useACurve) {
                    let lavType = typeof useACurve;
                    if(lavType == 'boolean')
                        lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
                    else if(lavType == 'object'){
                        lineAValues = easing.fast({ from: lineAValues.aValue[0], to: lineAValues.aValue[1], steps: lineAValues.len, type: lineAValues.type, method: lineAValues.method, round: lineAValues.round || 2 })
                    }
                    else if(lavType == 'function'){
                        lineAValues = useACurve({len, aValue})
                    }
                    else 
                        throw new Error('Not supported type of "useACurve": ' + lavType)
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

                    if(excludeMask) {
                        ctx.globalCompositeOperation = 'destination-out'
                        ctx.drawImage(excludeMask, 0, 0)
                    }
                });
            }
    
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg', 'house', 'house_d'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [15, 25], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'house_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.tv=  this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let bImg = PP.createImage(model, { renderOnly: ['tv'] })
                        let imgs = [];
                        for(let i = 0; i < 3; i++) {
                            imgs[i+1] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.2 + i*0.2
                                ctx.drawImage(bImg, 0, 0)
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
        }), 1)

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['trees', 'ground'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [20, 30], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'tree_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 120, itemFrameslength1Clamps: [30, 40], itemFrameslength2Clamps: [8, 10], size: this.size, opacityClamps: [0.1, 0.1],
                            startPositions: [
                                {
                                    data: [new V2(20, 129), new V2(21, 129), new V2(28, 129), new V2(12, 129)],
                                    height: 13, tail: 0, useAll: true, itemsCount: 10, colorPrefix: colors.getColorPrefix('#D7E0E2', 'hex'),
                                    opacityClamps: [0.1, 0.1], sequential: true
                                }
                            ], reduceOpacityOnFall: false, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.splashes01 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone_01')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0.1, 0.2), 3) + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [5, 15], pointsData: availableDots, size: this.size,
                            pdPredicate: () => true//getRandomInt(0, 1) == 0,
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.splashes02 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone_02')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0.1, 0.2), 3) + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [5, 15], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0, 1) == 0,
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {

                            }
                        });
                    }
                }))
            }
        }), 3)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let framesCount = 120;
                let xClamps = [-50,110] // r: [0,180]
                let angleClamps = [-10,-10]

                let gShift = new V2(0,-5);

                let mask =
                createCanvas(this.size, (ctx, size, hlp) => {
                    let gData = PP.getLayerByName(model, 'light_g').groups[0];
                    //console.log(gData);
                    scenesHelper.createGradient({
                        hlp,
                        ...gData,
                        center: new V2(gData.center).add(gShift),
                        origin: new V2(gData.origin).add(gShift),
                        radius: new V2(160,160),
                        size,
                        colorPrefix: whiteColorPrefix,
                    });
                })
                //PP.createImage(model, { renderOnly: ['light_g'], forceVisibility: { ligth_g: { visible: true } } })
                
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.1;
                    ctx.drawImage(mask, 0, 0);
                })

                let aMul = 0.7;
                let lMul = 1
                let sMul = 1;
                //this.img = mask;

                this.layers = [
                    // {
                    //     angleClamps, lengthClamps: [5,6].map(l => fast.r(l*lMul, 0)), xClamps, upperYClamps: [-30, 0], lowerY: 150, aValue: fast.r(aMul*0.05, 2), speedClapms: [3,3], mask: undefined, framesCount, itemsCount: 3000, size: this.size, useACurve: false, excludeMask: undefined
                    // },
                    {
                        angleClamps, lengthClamps: [10,11].map(l => fast.r(l*lMul, 0)), xClamps, upperYClamps: [-30, 0], lowerY: 150, aValue: fast.r(aMul*0.15, 2), speedClapms: [5,5].map(l => fast.r(l*sMul, 0)), mask, framesCount, itemsCount: 2600, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps, lengthClamps: [12,14].map(l => fast.r(l*lMul, 0)), xClamps, upperYClamps: [-30, 0], lowerY: 151, aValue: fast.r(aMul*0.3, 2), speedClapms: [6,7].map(l => fast.r(l*sMul, 0)), mask, framesCount, itemsCount: 1200, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps, lengthClamps: [16,18].map(l => fast.r(l*lMul, 0)), xClamps, upperYClamps: [-30, 0], lowerY: 152, aValue: fast.r(aMul*0.45, 2), speedClapms: [8,9].map(l => fast.r(l*sMul, 0)), mask, framesCount, itemsCount: 500, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    {
                        angleClamps, lengthClamps: [20,22].map(l => fast.r(l*lMul, 0)), xClamps, upperYClamps: [-30, 0], lowerY: 153, aValue: fast.r(aMul*0.6, 2), speedClapms: [10,11].map(l => fast.r(l*sMul, 0)), mask, framesCount, itemsCount: 200, size: this.size, useACurve: false, excludeMask: undefined
                    },
                    // {
                    //     angleClamps, lengthClamps: [20,22].map(l => fast.r(l*lMul, 0)), xClamps:[0,30], upperYClamps: [-30, 0], lowerY: 153, aValue: fast.r(aMul*0.8, 2), speedClapms: [10,11].map(l => fast.r(l*sMul, 0)), mask, framesCount, itemsCount: 30, size: this.size, useACurve: false, excludeMask: undefined
                    // },
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 4)

        this.walls = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['walls_b', 'walls'] })

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 120, itemFrameslength1Clamps: [30, 40], itemFrameslength2Clamps: [30, 30], size: this.size, opacityClamps: [0.1, 0.1],
                            startPositions: [
                                {
                                    data: appSharedPP.lineV2(new V2(70,32), new V2(101, 35)),
                                    height: 120, tail: 2, useAll: false, itemsCount: 10, colorPrefix: colors.getColorPrefix('#D7E0E2', 'hex'),
                                    opacityClamps: [0.3, 0.3], sequential: true
                                }
                            ], reduceOpacityOnFall: false, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['car', 'cat'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 120, itemFrameslength: [35, 40], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'car_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.dark_overlay = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let bImg1 = PP.createImage(model, { renderOnly: ['bl_overlay'], forceVisibility: { bl_overlay: { visible: true } }  })
                        let bImg2 = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5
                            ctx.drawImage(bImg1, 0,0)
                        })

                        let totalFrames = 120
                        let framesInfo = new Array(totalFrames).fill(undefined);

                        let mergeData = [
                            ...new Array(5).fill(bImg2),
                            ...new Array(10).fill(undefined),
                            ...new Array(10).fill(bImg1),
                            ...new Array(5).fill(bImg2),
                        ]

                        framesInfo.splice(getRandomInt(totalFrames/2,totalFrames*3/4), mergeData.length, ...mergeData);

                        let mergeData2 = [
                            ...new Array(5).fill(bImg2),
                            ...new Array(30).fill(undefined),
                            ...new Array(10).fill(bImg2)
                        ]

                        framesInfo.splice(getRandomInt(0,totalFrames/2), mergeData2.length, ...mergeData2);

                        framesInfo.splice(totalFrames);

                        this.currentFrame = 0;
                        this.img = framesInfo[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = framesInfo[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == framesInfo.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))
            }
        }), 7)
    }
}