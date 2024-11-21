class BusStopScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'busstop',
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
    +1. Дождь перед фарами
    +2. Бегущая строка - Out of service
    +2.1 Дождь на фоне бегущей строки
    3.? Моргающий номер автобуса
    4. Капли капают с края сотановки
    5. Слабое движение  точек на мокром асфальте
    +6.? Кот
    */

    start(){
        let model = BusStopScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, }) {
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
                    lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
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
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground', 'bg_d'] }),
            init() {
                this.upperDetails = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['upper_details'] }),
                    init() {

                    }
                }))

                this.groundAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let pixels = getPixels(this.parent.img, this.size);
                        let cList = ['#100f0f', '#1a1411', '#241913', '#2e1d15', '#3c2118', '#4a251a', '#613824', '#774b2e', '#a37042', '#b18659', '#e3d9bd', 
                        '#201f1e', '#151c21', '#1a252b', '#242e37', '#32393e'] //, 
                        let randomSpread = [-1, 1]

                        let pd = [];
                        for (let i = 0; i < pixels.length; i++) {
                            let pixelData = pixels[i];
                            let pColorHex = colors.rgbToHex(pixelData.color);
                            if (cList.indexOf(pColorHex) != -1 && pixelData.position.y > 140) {
                                pd.push({
                                    color: pColorHex,
                                    point: pixelData.position.add(V2.random(randomSpread, [0,0]))
                                })
                            }
                        }

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 240, itemFrameslength: [20, 30], size: this.size,
                            pointsData: pd, pdPredicate: () => getRandomInt(0, 2) == 0
                        }); //

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.backSmallSplashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0, 0.1), 2) + ')'
                        }));

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 240, itemFrameslength: [10, 20], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0, 15) == 0,
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

        this.bus = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bus', 'bus_d'] }),
            init() {
                this.ousSign = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 240;

                        let ousImg = PP.createImage(BusStopScene.models.outOfService);
                        let ousSize = new V2(51,7)
                        this.frames = [];
                        let ousCropSize = new V2(28,7);

                        let xShift = easing.fast({from: 0, to: ousSize.x, steps: totalFrames, type: 'linear', round: 0})

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                //hlp.setFillColor('#0c0502').rect(116,137, 13, 3);
            
                                ctx.drawImage(createCanvas(ousCropSize, (ctx, size, hlp) => {
                                    ctx.drawImage(ousImg, -xShift[f], 0)
                                    ctx.drawImage(ousImg, ousSize.x-xShift[f], 0)
                                }), 126,70)
                            })
                        }
        
                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.frontalRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, { renderOnly: ['f_lights_g_right', 'f_lights_g_left'] })

                        this.layers = [
                            { angleClamps: [0,0], lengthClamps: [5,7], xClamps: [110,200], upperYClamps: [90, 110], lowerY: 155, aValue: 0.05, speedClapms: [3,4], mask, framesCount: 120, itemsCount: 750, size: this.size, useACurve: false },
                            { angleClamps: [0,0], lengthClamps: [6,8], xClamps: [110,200], upperYClamps: [90, 110], lowerY: 155, aValue: 0.1, speedClapms: [4,5], mask, framesCount: 120, itemsCount: 500, size: this.size, useACurve: false },
                            { angleClamps: [0,0], lengthClamps: [7,9], xClamps: [110,200], upperYClamps: [90, 110], lowerY: 155, aValue: 0.15, speedClapms: [5,6], mask, framesCount: 120, itemsCount: 250, size: this.size, useACurve: false }
                        ].map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createRainFrames(p),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.leftRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, { renderOnly: ['l_door_g'] })

                        this.layers = [
                            { angleClamps: [0,0], lengthClamps: [6,8], xClamps: [90,117], upperYClamps: [40, 60], lowerY: 150, aValue: 0.1, speedClapms: [4,5], mask, framesCount: 120, itemsCount: 100, size: this.size, useACurve: false },
                            { angleClamps: [0,0], lengthClamps: [7,9], xClamps: [90,117], upperYClamps: [40, 60], lowerY: 150, aValue: 0.125, speedClapms: [5,6], mask, framesCount: 120, itemsCount: 50, size: this.size, useACurve: false }
                        ].map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createRainFrames(p),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.upperRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, { renderOnly: ['f_lights_g_upper'] })

                        this.layers = [
                            { angleClamps: [0,0], lengthClamps: [6,8], xClamps: [120,175], upperYClamps: [30, 50], lowerY: 100, aValue: 0.1, speedClapms: [4,5], mask, framesCount: 120, itemsCount: 300, size: this.size, useACurve: false },
                            // { angleClamps: [0,0], lengthClamps: [7,9], xClamps: [120,175], upperYClamps: [30, 50], lowerY: 100, aValue: 0.15, speedClapms: [5,6], mask, framesCount: 120, itemsCount: 150, size: this.size, useACurve: false },
                        ].map(p => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createRainFrames(p),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))
            }
        }), 5)

        this.station = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['station', 'cat'] }),
            init() {
                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 240, itemFrameslength1Clamps: [10, 20], itemFrameslength2Clamps: [20, 20], size: this.size, opacityClamps: [0.3, 0.45],
                            startPositions: [
                                {
                                    data: appSharedPP.lineV2(new V2(133, 29), new V2(82,76)),
                                    height: 50, useAll: true, colorPrefix: whiteColorPrefix, tail: 3
                                },
                                {
                                    data: appSharedPP.lineV2(new V2(16, 56), new V2(26,75)),
                                    height: 30, useAll: true, colorPrefix: whiteColorPrefix, tail: 3, opacityClamps: [0.1, 0.15]
                                }
                            ], reduceOpacityOnFall: true, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)
    }
}