class Departure7Scene extends Scene {
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
                fileNamePrefix: 'departing7',
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
        let model = Departure7Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        
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

        let createSnowfallFrames = function({framesCount, itemsCount, xClamps, yClamps, aMax, alphaUseEasing, angleClamps, snowflakeLengthClamps, lowerYClamps, itemFrameslengthClamps, speedClamps, size, mask, angleChange}) {
            let frames = [];
            
            let angleChangeToY = undefined;
            if(angleChange) {
                angleChangeToY = easing.fast({from: 0, to: angleChange, steps: size.y, type: 'linear', method: 'base', round: 2});
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let p = V2.random(xClamps, yClamps);
                let sLen = getRandomInt(snowflakeLengthClamps);
                let lowerY = getRandomInt(lowerYClamps);
                let angle = fast.r(getRandom(angleClamps[0], angleClamps[1]))

                if(angleChangeToY) {
                    angle+=(angleChangeToY[p.y]||0);
                }

                let direction = V2.up.rotate(angle)
                let speed = getRandom(speedClamps[0], speedClamps[1]);

                let linePoints = appSharedPP.lineV2(new V2(), new V2().add(direction.mul(sLen)).toInt());
                let lineAValues = alphaUseEasing ? [
                    ...easing.fast({ from: 0, to: aMax, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({ from: aMax, to: 0, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 })
                ] : new Array(linePoints.length).fill(aMax);

                let mainAValues = [
                    ...easing.fast({ from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({ from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let pShiftPerFrame = direction.mul(speed)

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    p = p.add(pShiftPerFrame)
                    
                    frames[frameIndex] = {
                        p: p.toInt(),
                        a: mainAValues[f]
                    };
                }
            
                return {
                    frames,
                    lowerY,
                    linePoints,
                    lineAValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { lowerY, linePoints, lineAValues, } = itemData
                            let { p, a } = itemData.frames[f]

                            for(let i = 0; i < linePoints.length; i++) {
                                let lp = linePoints[i];

                                let tp = p.add(lp);
                                if(tp.y > lowerY)
                                    break;

                                hlp.setFillColor(whiteColorPrefix + a*(lineAValues[i] || 0)).dot(tp)
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
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg', 'bg_d']})
            }
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground', 'ground_d']})

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 2)

        this.snowFallFar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    createGradient({hlp, aValueMul: 1, center: new V2(140, 37), radius: new V2(10,30), gradientOrigin: new V2(124, 27), size, colorPrefix: 'rgba(251,251,247,', angle: -60});

                    createGradient({hlp, aValueMul: 1, center: new V2(150, 22), radius: new V2(10,30), gradientOrigin: new V2(135, 12), size, colorPrefix: 'rgba(251,251,247,', angle: -60});
                })

                 this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.3
                    ctx.drawImage(mask, 0, 0)
                 });

                this.layers = [
                    
                    {
                        framesCount: 300, itemsCount: 2000, xClamps: [110, 165], yClamps: [7, 47], aMax: 1, alphaUseEasing: false, angleClamps: [115, 120], snowflakeLengthClamps: [0,0],  lowerYClamps: [100, 125], itemFrameslengthClamps: [40,60], speedClamps: [0.25,0.5], size: this.size, mask
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = createSnowfallFrames(d);
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    } 
                })))
            }
        }), 3)

        this.constructions = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['constructions_far', 'constructions']})
            }
        }), 4)

        this.snowFallMid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    createGradient({hlp, aValueMul: 1, center: new V2(95,52), radius: new V2(15,25), gradientOrigin: new V2(102, 46), size, colorPrefix: 'rgba(251,251,247,', angle: 35});
                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.15
                    ctx.drawImage(mask, 0, 0)
                 });

                this.layers = [
                    {
                        framesCount: 300, itemsCount: 40000, xClamps: [-10, this.size.x], yClamps: [-10, this.size.y], aMax: 0.05, alphaUseEasing: false, angleClamps: [115, 120], snowflakeLengthClamps: [0,0],  lowerYClamps: [100, 125], itemFrameslengthClamps: [40,60], speedClamps: [0.25,0.5], size: this.size
                    },
                    {
                        framesCount: 300, itemsCount: 1000, xClamps: [79, 110], yClamps: [31, 63], aMax: 0.75, alphaUseEasing: false, angleClamps: [115, 120], snowflakeLengthClamps: [0,0],  lowerYClamps: [100, 125], itemFrameslengthClamps: [40,60], speedClamps: [0.25,0.5], size: this.size, mask
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = createSnowfallFrames(d);
        
                        this.registerFramesDefaultTimer({});
                    } 
                })))
            }
        }), 5)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['wires']})
            }
        }), 6)

        this.train = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['train', 'train_d']})
            }
        }), 7)

        this.snowFallFrontal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.layers = [
                    {
                        framesCount: 300, itemsCount: 12000, xClamps: [-50, this.size.x], yClamps: [-50, this.size.y], aMax: 0.15, alphaUseEasing: false, angleClamps: [120, 125], snowflakeLengthClamps: [0,1],  lowerYClamps: [150, this.size.y], itemFrameslengthClamps: [40,60], speedClamps: [0.5,2], size: this.size
                    },
                    
                    {
                        framesCount: 300, itemsCount: 4000, xClamps: [-50, this.size.x], yClamps: [-50, this.size.y], aMax: 0.2, alphaUseEasing: true, angleClamps: [125, 130], snowflakeLengthClamps: [1,2],  lowerYClamps: [155, this.size.y], itemFrameslengthClamps: [40,60], speedClamps: [1,3], size: this.size
                    },
                    {
                        framesCount: 300, itemsCount: 2000, xClamps: [-50, this.size.x], yClamps: [-50, this.size.y], aMax: 0.35, alphaUseEasing: true, angleClamps: [125, 135], snowflakeLengthClamps: [2,3],  lowerYClamps: [165, this.size.y+10], itemFrameslengthClamps: [40,60], speedClamps: [1,4], size: this.size, 
                        angleChange: -10
                    },
                    {
                        framesCount: 300, itemsCount: 800, xClamps: [-50, this.size.x], yClamps: [-50, this.size.y], aMax: 0.3, alphaUseEasing: true, angleClamps: [130, 135], snowflakeLengthClamps: [6,10],  lowerYClamps: [this.size.y, this.size.y+20], itemFrameslengthClamps: [40,60], speedClamps: [2,4], size: this.size, angleChange: -15
                    },
                    {
                        framesCount: 300, itemsCount: 300, xClamps: [-50, this.size.x], yClamps: [-50, this.size.y], aMax: 0.5, alphaUseEasing: true, angleClamps: [135, 140], snowflakeLengthClamps: [8,10],  lowerYClamps: [this.size.y, this.size.y+20], itemFrameslengthClamps: [40,60], speedClamps: [3,5], size: this.size, angleChange: -20
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = createSnowfallFrames(d);
        
                        this.registerFramesDefaultTimer({});
                    } 
                })))
            }
        }), 8)
    }
}