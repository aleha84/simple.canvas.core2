class Crosswalk2Scene extends Scene {
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
                fileNamePrefix: 'crosswalk2',
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
        let model = Crosswalk2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        let globaFramesCount = 300;
        //

        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = false,
        }) {
            let frames = [];

            /*   */
            framesCount/=2;
            itemsCount = fast.r(itemsCount/2);
            /*   */
            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed) {
                xSpeedValues = [
                    //...new Array(fast.r(size.x/2)).fill(1),
                    ...easing.fast({from: 1, to: 0.75, steps: fast.r(size.x/1), type: 'linear', round: 2})
                ]
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
    
                                        if(prev && prev.y != tp.y) {
                                            hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        }
    
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg', 'bg_tree01', 'bg_tree02', 'bg_tree03'] })
            }
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground', 'ground_d1', 'ground_d2_v1'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globaFramesCount/2, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.rightLamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['right_lamp'] })

                let itemFrameslengthClapms = [80,100];
                let angleClamps = [175,185];
                let normalDistance = [22,28];

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#FFFFFF').rect(0,0,size.x,size.y)
                })

                this.snowfallLayers = [
                    {
                        framesCount: globaFramesCount, itemsCount: 30000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.01], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v-18), xClamps: [0, this.size.x], yClamps: [-15, 160], size: this.size, 
                        addParticlesShine: { upperChance: 50, framesLengthClamps: [5,15], aMulClamps: [4,7] }
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 20000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.025], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v-10), xClamps: [0, this.size.x], yClamps: [-15, 165], size: this.size, 
                        addParticlesShine: { upperChance: 50, framesLengthClamps: [5,15], aMulClamps: [4,7] }
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(p),
                    init(){
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 5)

        this.leftItems = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['left_items'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globaFramesCount, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'left_items_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 6)

        let mask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let gData = PP.getLayerByName(model, 'mask').groups[0];
            scenesHelper.createGradient({
                hlp,
                ...gData,
                size,
                colorPrefix: whiteColorPrefix,
                verticalCut: {
                    points: appSharedPP.lineByCornerPoints([new V2(20,85), new V2(98,13), new V2(108,13), new V2(170, 65)].map(p => new V2(p.x, p.y+1))),
                    aValuesMul: easing.fast({from: 1, to: 0, steps: 10, type: 'linear', round: 2})
                } 
            });
        })

        this.mainLamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['main_lamp'] })

                // this.snowfallLight = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     img: mask
                // }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: globaFramesCount/2, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'main_lamp_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                let itemFrameslengthClapms = [80,100];
                let angleClamps = [170,190];
                let normalDistance = [22,28];

                this.snowfallLayers = [
                    {
                        framesCount: globaFramesCount, itemsCount: 10000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.3], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v-5), xClamps: [0, this.size.x], yClamps: [0, 160], size: this.size
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 6000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.45], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v-2), xClamps: [0, this.size.x], yClamps: [0, 160], size: this.size
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 4000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.6], mask: mask, angleClamps, distanceCLamps: normalDistance, xClamps: [0, this.size.x], yClamps: [0, 160], size: this.size
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 2000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.85], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v+3), xClamps: [0, this.size.x], yClamps: [0, 160], size: this.size
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 1000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v+6), xClamps: [0, this.size.x], yClamps: [0, 160], size: this.size
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(p),
                    init(){
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 7)

        this.sign = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['sign'] })
            }
        }), 9)

        this.frontalSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let itemFrameslengthClapms = [80,100];
                let angleClamps = [170,190];
                let normalDistance = [22,28];

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#FFFFFF').rect(0,0,size.x,size.y)
                })

                this.snowfallLayers = [
                    {
                        framesCount: globaFramesCount, itemsCount: 2000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.075], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v+20), xClamps: [0, this.size.x], yClamps: [-20, 175], size: this.size, 
                        addParticlesShine: { upperChance: 20, framesLengthClamps: [5,10], aMulClamps: [2,4] }
                    },
                    {
                        framesCount: globaFramesCount, itemsCount: 1000, itemFrameslengthClapms, colorPrefix: whiteColorPrefix, aClapms: [0, 0.1], mask: mask, angleClamps, distanceCLamps: normalDistance.map(v => v+30), xClamps: [0, this.size.x], yClamps: [-20, this.size.y], size: this.size, snowflakeLengthClamps: [0,1]
                        //addParticlesShine: { upperChance: 50, framesLengthClamps: [10,20], aMulClamps: [4,7] }
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(p),
                    init(){
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 10)
    }
}