class MoonViewScene extends Scene {
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
                fileNamePrefix: 'moonView',
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
        let model = MoonViewScene.models.main;
        let appSharedPP = PP.createNonDrawingInstance();
        let rgbColorPart = 'rgba(255,255,255,';
        let RainStartFrameIndexClamps = [300,610]

        let createEffectsFrames = function({framesCount, size,
            snowData = {
                itemsCount, itemFrameslengthClamps, xClamps, startFrameIndexClamps, yClamps, pointsLengthClamps, angleClamps, maxA
            },
            rainData = {
                itemsCount, yClamps, direction, maxA, trailLenght, itemFrameslengthClamps, xClamps, startFrameIndexClamps
            }
        }) {
            let frames = [];

            let bottomLine = createLine(new V2(-size.x,size.y), new V2(size.x*2,size.y));

            let trailAValues = [
                ...easing.fast({from: rainData.maxA, to: 0, steps: rainData.trailLenght, type: 'quad', method: 'out', round: 3 }).slice(1).reverse(),
                rainData.maxA,
                ...easing.fast({from: rainData.maxA, to: 0, steps: rainData.trailLenght, type: 'quad', method: 'out', round: 3 }).slice(1)
            ]

            let itemsData = [
                ...new Array(snowData.itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(snowData.startFrameIndexClamps);
                    let totalFrames = getRandomInt(snowData.itemFrameslengthClamps);
                
                    let direction = V2.down.rotate(getRandomInt(snowData.angleClamps));

                    let point1 = new V2(getRandomInt(snowData.xClamps), getRandomInt(snowData.yClamps));
                    let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                    let linePoints = appSharedPP.lineV2(point1, point2);
                    let linePointsLength = getRandomInt(snowData.pointsLengthClamps);
                    let linePointsIndices = easing.fast({ from: 0, to: linePointsLength, steps: totalFrames, type: 'linear', round: 0});
                
                    let linePointsAValues = [
                        ... easing.fast({from: 0, to: snowData.maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                        ... easing.fast({from: snowData.maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let index = linePointsIndices[f];
                        let p = linePoints[index];
                        let a = linePointsAValues[f]
                
                        if(isNaN(a) || a == undefined) {
                            a = 0;
                        }
                
                        frames[frameIndex] = {
                            p, a
                        };
                    }
                
                    return {
                        snow: true,
                        frames
                    }
                }),
                ...new Array(rainData.itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(rainData.startFrameIndexClamps);
                    let totalFrames = getRandomInt(rainData.itemFrameslengthClamps);
                
                    let yShift = getRandomInt(0, 40)
                    let lowerY = rainData.yClamps[1];
                    let from = new V2(getRandomInt(rainData.xClamps), rainData.yClamps[0]-yShift);
                    let to = raySegmentIntersectionVector2(from, V2.down.rotate(getRandom(rainData.direction[0], rainData.direction[1])), bottomLine);
                    let points = appSharedPP.lineV2(from, to); 
                    let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            index: f,
                        };
                    }
                
                    return {
                        snow: false,
                        lowerY,
                        points,
                        pointsIndexValues,
                        frames
                    }
                })
            ]
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            if(itemData.snow) {
                                let {p, a} = itemData.frames[f];

                                hlp.setFillColor(rgbColorPart + a + ')').dot(p);
                            }
                            else {
                                let pointIndex = itemData.pointsIndexValues[itemData.frames[f].index];
                                for(let i = 0; i < trailAValues.length; i++) {
                                    let pi = pointIndex + i;
                                    if(pi < itemData.points.length && itemData.points[pi].y < itemData.lowerY) {
                                        let lp = itemData.points[pi]
                                        hlp.setFillColor(rgbColorPart + trailAValues[i] + ')').dot(lp)
                                    }
                                }
                            }
                        }
                        
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

                this.effectsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createEffectsFrames({
                            framesCount: 600, size: this.size,
                            snowData: {
                                itemsCount:2500, itemFrameslengthClamps: [60, 90], xClamps: [-10, this.size.x], startFrameIndexClamps: [0, 300], yClamps: [-10, 135], 
                                pointsLengthClamps: [5,10], angleClamps: [10,15], maxA: 0.2
                            },
                            rainData: {
                                itemsCount: 2500, yClamps: [-10, 135], direction:[5,10], maxA: 0.1, trailLenght: 4, itemFrameslengthClamps: [60,70], 
                                xClamps: [-10, this.size.x+30], startFrameIndexClamps: RainStartFrameIndexClamps
                            }
                        })
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 1)

        this.castleLeft = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['castle_left', 'castle_left_d'] })

                this.effectsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createEffectsFrames({
                            framesCount: 600, size: this.size,
                            snowData: {
                                itemsCount:1400, itemFrameslengthClamps: [60, 90], xClamps: [-10, this.size.x], startFrameIndexClamps: [0, 300], yClamps: [-10, 175], 
                                pointsLengthClamps: [10,18], angleClamps: [10,18], maxA: 0.3
                            },
                            rainData: {
                                itemsCount: 1600, yClamps: [-10, 175], direction:[9,13], maxA: 0.2, trailLenght: 6, itemFrameslengthClamps: [50,60], 
                                xClamps: [-10, this.size.x+30], startFrameIndexClamps: RainStartFrameIndexClamps
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.castleRight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['castle_right'] })

                this.effectsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createEffectsFrames({
                            framesCount: 600, size: this.size,
                            snowData: {
                                itemsCount:1000, itemFrameslengthClamps: [60, 90], xClamps: [-10, this.size.x], startFrameIndexClamps: [0, 300], yClamps: [-10, 175], 
                                pointsLengthClamps: [15,25], angleClamps: [8,18], maxA: 0.35
                            },
                            rainData: {
                                itemsCount: 800, yClamps: [-10, 175], direction:[6,12], maxA: 0.3, trailLenght: 8, itemFrameslengthClamps: [40,50], 
                                xClamps: [-10, this.size.x+30], startFrameIndexClamps: RainStartFrameIndexClamps
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['fg'] })
                
                let colorsCache = {};

                let rgbToHex = (rgb) => {
                    let key = rgb[0]*1000000 + rgb[1]*1000 + rgb[2];
                    if(!colorsCache[key]) {
                        colorsCache[key] = colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' })
                    }

                    return colorsCache[key];
                }

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pixels = getPixels(this.parent.img, this.size);
                        let pointsData = pixels.filter((el, i) => getRandomInt(0,2) == 0).map(el => ({
                            color: rgbToHex(el.color),
                            point: el.position.add(new V2(getRandomInt(-1,1), getRandomInt(-1,1)))
                        }))

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData, itemFrameslength: [30,60], size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.effectsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createEffectsFrames({
                            framesCount: 600, size: this.size,
                            snowData: {
                                itemsCount:500, itemFrameslengthClamps: [60, 90], xClamps: [-10, this.size.x], startFrameIndexClamps: [0, 300], yClamps: [-10, 200], 
                                pointsLengthClamps: [25,35], angleClamps: [5,20], maxA: 0.5
                            },
                            rainData: {
                                itemsCount: 300, yClamps: [-10, 200], direction:[7,15], maxA: 0.4, trailLenght: 10, itemFrameslengthClamps: [30,40], 
                                xClamps: [-10, this.size.x+30], startFrameIndexClamps: RainStartFrameIndexClamps
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 15)
    }
}