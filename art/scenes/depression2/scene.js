class Depression2Scene extends Scene {
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
                fileNamePrefix: 'depression2',
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
    1. + Аварийка
    2. + Задний дворник
    3. + Анимация тумана
    4. + Слабый дождь - переделать
    5. + Моргающий фонарь?
    6. +-Анмация дерева?
    7. + Раскачивание провода
    8. - Пролетающие листья
    */

    start(){
        let model = Depression2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let createAnimations = function({
            animationModel, data, framesCount, size
        }) {
            let frames = [];

            let itemsData = data.map((dataItem, i) => { 
                let startFrameIndex = dataItem.startFrameIndex != undefined ? dataItem.startFrameIndex : getRandomInt(0, framesCount - 1);
                let totalFrames = dataItem.framesCount != undefined ? dataItem.framesCount : framesCount;
                let imgs = PP.createImage(animationModel, { renderOnly: [dataItem.name] })
                let imgIndicesData = easing.fast({from: 0, to: imgs.length-1, steps: totalFrames, type: dataItem.eType || 'linear', method: dataItem.eMethod || 'base', round: 0})

                let frames = [];

                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }
    
                    frames[frameIndex] = {
                        img: imgs[imgIndicesData[f]]
                    };
                }
    
                return {
                    frames
                }
            })

            for (let f = 0; f < framesCount; f++) {
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for (let p = 0; p < itemsData.length; p++) {
                        let itemData = itemsData[p];
    
                        if (itemData.frames[f]) {
                            ctx.drawImage(itemData.frames[f].img, 0, 0)
                        }
                    }
                });
            }
    
            return frames;
        }

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
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['trees', 'trees_d'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 180, itemFrameslength: [40,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'tree_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground', 'ground_d', 'ground_d2'] }), //, 'wires'
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 360, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'ground_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.lampAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255, 0.4)').rect(93,67,3,1)
                        })

                        let img2 = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255, 0.3)').rect(93,67,3,1)
                        })

                        let img3 = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255, 0.25)').rect(93,67,3,1)
                        })

                        let totalFrames = 360
                        let framesInfo = new Array(totalFrames).fill(img);

                        let mergeData = [
                            ...new Array(10).fill(img3),
                            ...new Array(5).fill(img),
                            ...new Array(15).fill(img2),
                            ...new Array(25).fill(img),
                            ...new Array(5).fill(img2),
                            ...new Array(20).fill(img),
                            ...new Array(5).fill(img2),
                        ]

                        framesInfo.splice(getRandomInt(totalFrames/2,totalFrames*3/4), mergeData.length, ...mergeData);

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

                this.animations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                       
                        let itemFramesCount = 180
                        let wiresData = [
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(82,91)] }, 
                                    { dots: [new V2(90,87)] }, 
                                    { dots: [new V2(96,79)] }, 
                                    { dots: [new V2(100,71)] }, 
                                ],xClamps: [82,101], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.025)', usePP: true
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(110,71)] }, 
                                    { dots: [new V2(131,68), new V2(132,68)] }, 
                                    { dots: [new V2(159,50), new V2(159.5,50)] }, 
                                ],xClamps: [110,160], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.15)', usePP: false
                            },
                            { 
                                framesCount: itemFramesCount, 
                                dotsData: [
                                    { dots: [new V2(113,70)] }, 
                                    { dots: [new V2(132,65), new V2(133,65)] }, 
                                    { dots: [new V2(159,43), new V2(159.5,43)] }, 
                                ],xClamps: [110,160], yClamps:[], size: this.size, invert: false, c1: 'rgba(0,0,0,0.15)', usePP: false
                            },
                        ]
        
                        this.wires = wiresData.map((d, i) => 
                            this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let frms = animationHelpers.createWiresFrames(d);

                                this.frames = frms;
                                this.registerFramesDefaultTimer({ startFrameIndex: i*20 });
                                // this.frames = new Array(180).fill(frms[0]);
                                // this.frames.splice(i*15, itemFramesCount, ...frms)
                                //this.registerFramesDefaultTimer({ });
                            }
                        })))
                    }
                }))
            }
        }), 5)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car', ] }),
            init() {
                this.turnSignalsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['turn_signals'], forceVisibility: { turn_signals: { visible: true }} })
                        let defaultToggleCounter = 30
                        let currentToggleCounter = defaultToggleCounter;
                        
                        this.img = undefined;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            
                            currentToggleCounter--;
                            if(currentToggleCounter == 0){
                                currentToggleCounter = defaultToggleCounter;
                                this.img = this.img ? undefined : img;
                            }
                        })
                    }
                }))

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners1 = [new V2(79, 108), new V2(98, 108), new V2(100, 110), new V2(79, 110)];
                                
                        let maxA = 0.075;
                        let minA = 0.025;

                        let availableDots = [
                            ...appSharedPP.fillByCornerPoints(corners1).map(p => ({ point: p, color: whiteColorPrefix + fast.r(getRandom(minA, maxA), 3) + ')' })),
                        ];

                        let predicate = () => getRandomInt(0, 3) == 0;

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 180, itemFrameslength: [10, 20], pointsData: availableDots, size: this.size,
                            pdPredicate: predicate,
                        });

                        this.registerFramesDefaultTimer({ });
                    }
                }))

                this.backCleanerAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 80;
                        let delayFrames = 100;
                        this.frames = [];

                        let t = 'quad'//'sin'
                        let m = 'inOut'//'out'
                        let data = [
                            {
                                p0: new V2(90, 110),
                                lenValues: [
                                    ...easing.fast({from: 5, to: 2, steps: totalFrames/4, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 2, to: 5, steps: totalFrames/4, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 5, to: 2, steps: totalFrames/4, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 2, to: 5, steps: totalFrames/4, type: t, method: m, round: 2})
                                ],
                                angleValues: [
                                    ...easing.fast({from: 180, to: 0, steps: totalFrames/2, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 0, to: 180, steps: totalFrames/2, type: t, method: m, round: 2})
                                ]
                            }
                        ]

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                

                                data.forEach(d => {
                                    hlp.setFillColor('#292e2f').rect(d.p0.x, d.p0.y, 6, 1)
                                    pp.setFillColor('#1c2121')
                                    let direction = V2.left.rotate(d.angleValues[f]);
                                    pp.lineV2(d.p0, d.p0.add(direction.mul(d.lenValues[f])))

                                    pp.setFillColor('#191c1c')
                                    let p1 = d.p0.add(direction.mul(fast.r(d.lenValues[f]/2)));
                                    pp.lineV2(d.p0, p1)
                                })
                            })
                        }

                        this.frames = [
                            ...new Array(delayFrames).fill(undefined),
                            ...this.frames
                        ]

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#6b7872').rect(0,0,size.x,size.y);
                    ctx.drawImage(PP.createImage(model, { renderOnly: ['rain_dark_mask'], forceVisibility: { rain_dark_mask: { visible: true } } }),0,0)
                })

                this.layers = [

                    {
                        angleClamps: [-13,-17], lengthClamps: [12,20], xClamps: [-50, this.size.x], upperYClamps: [-30,-40], lowerY: [this.size.y-20, this.size.y], 
                        aValue: 0.15, speedClapms: [12,17], mask,
                        framesCount: 180, itemsCount: 5, size: this.size, useACurve: false, excludeMask: undefined 
                    },
                    {
                        angleClamps: [-15,-20], lengthClamps: [15,25], xClamps: [-50, this.size.x], upperYClamps: [-30,-40], lowerY: [this.size.y-20, this.size.y], 
                        aValue: 0.20, speedClapms: [15,20], mask,
                        framesCount: 180, itemsCount: 5, size: this.size, useACurve: false, excludeMask: undefined 
                    }

                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames(p);

                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 9)
    }
}