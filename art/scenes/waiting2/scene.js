class Waiting2Scene extends Scene {
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
                size: new V2(160,284).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'waiting2',
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
    +1. Анимация девушки 
    +2. Анимация лампочки
    -3. Пылинки в свете лампочки
    +4. Свет проезжающей машины
    +5. Мерцание телевизора в окне
    +6. Синхронизировать кадры
    +7. точечная анимация на машине и девушке 
    */

    start(){
        let model = Waiting2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let brightDelay = 250-60
        let brightTotalFrames = 300
        let afterBrightDelay = 150

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                this.bright = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = brightTotalFrames;
                        let img = PP.createImage(model, { renderOnly: ['bg_bright_layer'] } )
                        let aValues = [
                            ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                        ]
                        this.frames = new Array(brightDelay).fill(undefined);

                        let yValuesShift = easing.fast({from: 0, to: 25+40, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                        let yValuesShift2 = easing.fast({from: 0, to: 30+40, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                        let yValuesShift3 = easing.fast({from: 0, to: 10+40, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                        let yValuesShift4 = easing.fast({from: 0, to: 20+40, steps: totalFrames, type: 'quad', method: 'in', round: 0})

                        //let lineAValues1 = 


                        for(let i = 0; i < totalFrames; i++) {
                            this.frames.push(createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[i];
                                ctx.drawImage(img, 0,0);

                                let pp = new PP({ctx});

                                pp.setFillColor('rgba(0,0,0,0.1');
                                pp.fillByCornerPoints([new V2(159,180 + fast.r(yValuesShift[i]/2)), new V2(120, 184 + yValuesShift[i]), new V2(120,188 + yValuesShift[i]), new V2(160, 184+fast.r(yValuesShift[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.075');
                                pp.fillByCornerPoints([new V2(159,188+fast.r(yValuesShift[i]/2)), new V2(120, 192 + yValuesShift2[i]), new V2(120,197 + yValuesShift2[i]), new V2(160, 193+fast.r(yValuesShift[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.1');
                                pp.fillByCornerPoints([new V2(159,162+fast.r(yValuesShift[i]/2)), new V2(120, 165 + yValuesShift3[i]), new V2(120,169 + yValuesShift3[i]), new V2(160, 166+fast.r(yValuesShift[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.05');
                                pp.fillByCornerPoints([new V2(159,196 + fast.r(yValuesShift4[i]/2)), new V2(120, 211 + yValuesShift4[i]), new V2(120,217 + yValuesShift4[i]), new V2(160, 200+fast.r(yValuesShift4[i]/2) )])

                                pp.fillByCornerPoints([new V2(159,172 + fast.r(yValuesShift[i]/2)), new V2(120, 176 + yValuesShift[i]), new V2(120,179 + yValuesShift[i]), new V2(160, 174+fast.r(yValuesShift[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.1');
                                pp.fillByCornerPoints([new V2(159,225+fast.r(yValuesShift2[i]/2)), new V2(80+ yValuesShift2[i], 284 ), new V2(105+ yValuesShift2[i],284 ), new V2(160, 238+fast.r(yValuesShift2[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.07');
                                pp.fillByCornerPoints([new V2(159,155+fast.r(yValuesShift3[i]/2)), new V2(120, 153+ yValuesShift3[i] ), new V2(120,154 + yValuesShift3[i]), new V2(159, 155+fast.r(yValuesShift3[i]/2) )])

                                pp.setFillColor('rgba(0,0,0,0.07');
                                pp.fillByCornerPoints([new V2(159,150+fast.r(yValuesShift3[i]/2)), new V2(120, 145+ yValuesShift3[i] ), new V2(120,145 + yValuesShift3[i]), new V2(159, 151+fast.r(yValuesShift3[i]/2) )])
                            }))
                        }

                        this.frames.push(...new Array(afterBrightDelay).fill(undefined))

                        console.log('car bright frames: ' + this.frames.length)

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.tv = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let tvImg = PP.createImage(model, {renderOnly: ['tv']})
                        let imgs = [];
                        for(let i = 2; i < 5; i++) {
                            imgs[imgs.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = (i*0.2)/2.5
                                ctx.drawImage(tvImg, 0,0)
                            })
                        }

                        let delay = getRandomInt(10,15);
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

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 175, itemFrameslength: [20, 40], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'bg_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), 1)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car', 'car_d'] }),
            init() {
                this.lampAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // this.frames = [
                        //     PP.createImage(model, { renderOnly: ['lamp_l2_2'], forceVisibility:  { lamp_l2_2: { visible: true } } }),
                        //     // PP.createImage(model, { renderOnly: ['lamp_l2'], forceVisibility:  { lamp_l2: { visible: true } } }),
                        //     // PP.createImage(model, { renderOnly: ['lamp_l2_2'], forceVisibility:  { lamp_l2_2: { visible: true } } }),
                        //     undefined, 
                        //     PP.createImage(model, { renderOnly: ['lamp_l1_2'], forceVisibility:  { lamp_l1_2: { visible: true } } }),
                        //     // PP.createImage(model, { renderOnly: ['lamp_l1'], forceVisibility:  { lamp_l1: { visible: true } } }),
                        //     // PP.createImage(model, { renderOnly: ['lamp_l1_2'], forceVisibility:  { lamp_l1_2: { visible: true } } }),
                        //     // ,
                        //     // PP.createImage(model, { renderOnly: ['lamp_l2'], forceVisibility:  { lamp_l2: { visible: true } } })
                        // ]
                        this.frames = [
                            PP.createImage(model, { renderOnly: ['lamp_l2_2'], forceVisibility:  { lamp_l2_2: { visible: true } } }),
                            undefined, 
                            PP.createImage(model, { renderOnly: ['lamp_l1_2'], forceVisibility:  { lamp_l1_2: { visible: true } } }),
                            // PP.createImage(model, { renderOnly: ['lamp_l1'], forceVisibility:  { lamp_l1: { visible: true } } }),
                            // PP.createImage(model, { renderOnly: ['lamp_l2'], forceVisibility:  { lamp_l2: { visible: true } } })
                        ]
        
                        let fi = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: 10, type: 'linear', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: 10, type: 'linear', round: 0}),
                            ...new Array(10).fill(undefined)
                        ]
        
                        let frameIndexValues = fi;
                        // // let frameIndexValues = [
                        // //     ...new Array(60).fill(1),
                        // //     ...fi,
                        // //     ...fi,
                        // //     ...fi,
                        // //     ...new Array(30).fill(1),
                        // //     ...fi,
                        // //     ...new Array(120).fill(1),
                        // // ]
        

                        // this.currentFrame = 0;
                        // this.img = this.frames[frameIndexValues[this.currentFrame]];
                        
                        // this.timer = this.regTimerDefault(10, () => {
                        
                        //     this.img = this.img = this.frames[frameIndexValues[this.currentFrame]];
                        //     this.currentFrame++;
                        //     if(this.currentFrame == frameIndexValues.length){
                        //         this.currentFrame = 0;
                        //     }
                        // })

                        this.currentFrame = 0;
                        this.img = this.frames[getRandomInt(0, this.frames.length-1)];

                        let delayClamps = [3,7];
                        let delay = getRandomInt(delayClamps);
                        
                        this.timer = this.regTimerDefault(10, () => {
                            if(delay > 0)
                            {
                                delay--;
                                return;
                            }

                            this.img = this.frames[getRandomInt(0, this.frames.length-1)];
                            delay = getRandomInt(delayClamps);

                        })
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 150, itemFrameslength: [20, 30], size: this.size,
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'car_p'))
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.bright = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = brightTotalFrames;
                        let img = PP.createImage(model, { renderOnly: ['car_bright_layer'] } )
                        let aValues = [
                            ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                        ]
                        this.frames = new Array(brightDelay).fill(undefined);

                        for(let i = 0; i < totalFrames; i++) {
                            this.frames.push(createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[i];
                                ctx.drawImage(img, 0,0);
                            }))
                        }

                        this.frames.push(...new Array(afterBrightDelay).fill(undefined))

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.layers = new Array(3).fill(undefined).map((_,i) => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let corners1 = animationHelpers.extractPointData(PP.getLayerByName(model, 'splash_zone' + (i+1))).map(pd => new V2(pd.point));
                                
                                let maxA = 0.2;
                                let minA = 0.05;

                                if(i == 1){
                                    maxA = 0.5;
                                    minA = 0.2
                                }

                                let availableDots = [
                                    ...appSharedPP.fillByCornerPoints(corners1).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(minA, maxA), 2) + ')' })),
                                ];

                                let predicate = () => getRandomInt(0, 25) == 0;

                                if(i == 2)
                                    predicate = () => getRandomInt(0, 2) == 0;
        
                                this.frames = animationHelpers.createMovementFrames({
                                    framesCount: 350, itemFrameslength: [10, 20], pointsData: availableDots, size: this.size,
                                    pdPredicate: predicate,
                                });
        
                                this.registerFramesDefaultTimer({ });
                    }})));
                        
                    }
                }))
            }
        }), 3)

        this.girl = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(Waiting2Scene.models.girlFrames);
                let frameIndexValues = [
                    //...new Array(60).fill(0),
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: 70, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: this.frames.length-1, to: this.frames.length-3, steps: 40, type: 'linear', method: 'base', round: 0}),
                    ...new Array(20).fill(this.frames.length-3),
                    // ...new Array(20).fill(this.frames.length-2),
                    // ...new Array(10).fill(this.frames.length-1),
                    ...easing.fast({from: this.frames.length-3, to: 0, steps: 90, type: 'quad', method: 'inOut', round: 0}),
                    ...new Array(180+240).fill(0),
                ]

                console.log('girl frameIndexValues: ' + frameIndexValues.length)

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.img = this.frames[frameIndexValues[this.currentFrame]];
                    this.currentFrame++;
                    if(this.currentFrame == frameIndexValues.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 5)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRainFrames: function ({
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
            },
            init() {
                let rainMask = createCanvas(this.size, (ctx, size, hlp) => {
                    scenesHelper.createGradient({hlp, aValueMul:1, center: new V2(87,221), radius: new V2(40,40), gradientOrigin: new V2(87,221), size: this.size, 
                        colorPrefix: whiteColorPrefix, })
                })

                //this.img = rainMask;
                this.rainLamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createRainFrames({ angleClamps: [0, 0], lengthClamps: [30, 35], xClamps: [60, 125], upperYClamps: [50, 70], lowerY: [260, 270], aValue: 0.2, speedClapms: [10, 13], mask: rainMask, framesCount: 350, itemsCount: 70, size: this.size, useACurve: false })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createRainFrames({ angleClamps: [0, 0], lengthClamps: [30, 35], xClamps: [0, this.size.x], upperYClamps: [-40, 0], lowerY: [this.size.y, this.size.y+10], aValue: 0.065, speedClapms: [20, 25], framesCount: 350, itemsCount: 20, size: this.size, useACurve: true })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)
    }
}