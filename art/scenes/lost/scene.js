class LostScene extends Scene {
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
                size: new V2(160,200).mul(20),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lost',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    /*
    +1. Свет от телефона
    +2. Анимация персонажа.
    +3. Мерцание телевизора
    +4. Мерцание теней
    +5. Рассада ?
    +6. Сделать курьера "шире"
    +7. Дополнительная анимация курьера
    */

    backgroundRender() {
        this.backgroundRenderDefault();
    }
    
    start(){
        let model = LostScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
    
        let createSnowFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, addShining,
            aClamps,xClamps, yClamps, angleClamps, speedClamps, speedMul= 1, aMul =1, cPrefix, mask, detailing = false,
        }) {
            let frames = [];
            //speedMul = 0.75
            let speedChangeValues = [];
            // if(detailing) {
            //     speedChangeValues = [
            //         ...easing.fast({from: 0.75, to: 1, steps: size.y/2, type: 'quad', method: 'inOut'}),
            //         ...easing.fast({from: 1, to: 0.75, steps: size.y/2, type: 'quad', method: 'inOut'})
            //     ]
            // }

            let angleDeviationValues = []
            let aValuesChange = [];
            if(detailing) {
                // angleDeviationValues = [
                //     ...easing.fast({from: -8, to: 0, steps: size.x/2, type: 'quad', method: 'out'}),
                //     ...easing.fast({from: 0, to: 8, steps: size.x/2, type: 'quad', method: 'out'}),
                // ]
                aValuesChange = [
                    // ...new Array(size.y/2).fill(1),
                    // ...easing.fast({from: 1, to: 0.5, steps: size.y/2, type: 'linear', round: 2})
                    ...easing.fast({from: 1.25, to: 0.7, steps: size.y, type: 'linear', round: 2})
                ]
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let angle = getRandom(angleClamps[0], angleClamps[1])

                let direction = V2.down.rotate(angle);
                let speed = getRandom(speedClamps[0]*speedMul, speedClamps[1]*speedMul);

                
                

                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                if(detailing) {
                    // let speedMul = speedChangeValues[p0.y];
                    // if(speedMul == undefined)
                    //     speedMul = 1;

                    // speed*=speedMul;     

                    // angle += angleDeviationValues[p0.x]
                    aValues = aValues.map(a => a*(aValuesChange[p0.y] || 1 ));
                }

                let addShine = addShining && getRandomInt(0,2) == 0;
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

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.far_zone = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far_zone'] })
            }
        }), 3)

        this.farSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    scenesHelper.createGradient({
                        hlp, aValueMul: 1, center: new V2(65,35), radius: new V2(35,30), gradientOrigin: new V2(63,11), size, colorPrefix: 'rgba(255,249,178,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined //
                    })
                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.15
                    ctx.drawImage(mask, 0, 0)
                })

                let framesCount = 300;
                let itemFrameslengthClamps = [80,100]
                let xClamps = [40,100]
                let yClamps = [0, 55]
                this.snowLayers = 
                [
                    {
                        framesCount, itemsCount: 3000, itemFrameslengthClamps, size: this.size, addShining: false,
                        aClamps: [0, 0.5],xClamps, yClamps, angleClamps: [-1,1], 
                        speedClamps: [0.05,0.075], cPrefix: whiteColorPrefix, mask, speedMul: 0.85
                    },
                    {
                        framesCount, itemsCount: 1000, itemFrameslengthClamps, size: this.size, addShining: false,
                        aClamps: [0, 0.8],xClamps, yClamps, angleClamps: [-3,3], 
                        speedClamps: [0.1,0.125], cPrefix: whiteColorPrefix, mask, speedMul: 0.85
                    },
                    {
                        framesCount, itemsCount: 500, itemFrameslengthClamps, size: this.size, addShining: false,
                        aClamps: [0, 1],xClamps, yClamps, angleClamps: [-5,5], 
                        speedClamps: [0.15,0.1175], cPrefix: whiteColorPrefix, mask, speedMul: 0.85
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 4)

        this.far_tree = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far_tree'] })
            }
        }), 5)

        this.person = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['person'] })

                this.animation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let frames = PP.createImage(LostScene.models.personAnimation);

                        let framesIndicesValues = [
                            ...new Array(100).fill(0),
                            ...easing.fast({from: 0, to: frames.length-1, steps: 30, type: 'linear', round: 0}),
                            ...new Array(40).fill(frames.length-1),
                            ...easing.fast({from: frames.length-1, to: 0, steps: 90, type: 'linear', round: 0}),
                            ...new Array(340).fill(0),
                        ]

                        console.log(framesIndicesValues);

                        this.currentFrame = 0;
                        this.img = frames[framesIndicesValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = frames[framesIndicesValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesIndicesValues.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                this.animation2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let frames = PP.createImage(LostScene.models.personAnimation2);

                        let framesIndicesValues = [
                            ...new Array(300).fill(0),
                            ...easing.fast({from: 0, to: frames.length-1, steps: 20, type: 'linear', round: 0}),
                            ...easing.fast({from: frames.length-1, to: 0, steps: 20, type: 'linear', round: 0}),
                            ...easing.fast({from: 0, to: frames.length-1, steps: 20, type: 'linear', round: 0}),
                            ...easing.fast({from: frames.length-1, to: 0, steps: 20, type: 'linear', round: 0}),
                            ...new Array(220).fill(0),
                        ]

                        console.log(framesIndicesValues);

                        this.currentFrame = 0;
                        this.img = frames[framesIndicesValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = frames[framesIndicesValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesIndicesValues.length){
                                this.currentFrame = 0;

                                this.parent.parentScene.capturing.stop = true;
                            }
                        })
                    }
                }))
            }
        }), 7)

        this.buildings = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['left_building', 'right_building'] })

                this.tvAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let tvImg = PP.createImage(model, {renderOnly: ['tv']});
                        let imgs = [
                            // tvImg,
                            // createCanvas(this.size, (ctx, size, hlp) => { ctx.globalAlpha = 0.75; ctx.drawImage(tvImg, 0, 0) }),
                            createCanvas(this.size, (ctx, size, hlp) => { ctx.globalAlpha = 0.5; ctx.drawImage(tvImg, 0, 0) }),
                            createCanvas(this.size, (ctx, size, hlp) => { ctx.globalAlpha = 0.25; ctx.drawImage(tvImg, 0, 0) }),
                            undefined
                        ]

                        let delayClamps = [5,15];

                        this.currentFrame = getRandomInt(delayClamps);
                        let prevIndex = getRandomInt(0, imgs.length-1);
                        this.img = imgs[prevIndex];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            //this.img = this.frames[this.currentFrame];
                            // this.currentFrame++;
                            if((this.currentFrame--) == 0){
                                this.currentFrame = getRandomInt(delayClamps);

                                let currIndex = getRandomInt(0, imgs.length-1);
                                if(prevIndex == currIndex) {
                                    currIndex = getRandomInt(0, imgs.length-1)
                                }
                                prevIndex = currIndex;

                                this.img = imgs[currIndex];
                            }
                        })
                    }
                }))
            }
        }), 9)

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['trees', 'cat'] })
            }
        }), 10)

        this.mainSnowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                //return;
                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#9CACD3').rect(0,0,size.x, size.y);
                    ctx.drawImage(PP.createImage(model, {renderOnly: ['snowfall_mask']}), 0, 0)
                })

                //this.img = mask;
                let framesCount = 300
                let itemFrameslengthClamps = [80,100]
                let layersCount = 8;
                let itemsCountValues = easing.fast({from: 6000, to: 200, steps: layersCount, type: 'quad', method: 'out', round: 0})
                let aClampsMax = easing.fast({from: 0.3, to: 0.7, steps: layersCount, type: 'quad', method: 'out', round: 2})
                let angleClampsValues = [
                    easing.fast({from: -5, to: -15, steps: layersCount, type: 'quad', method: 'out', round: 2}),
                    easing.fast({from: 5, to: 15, steps: layersCount, type: 'quad', method: 'out', round: 2})
                ]

                let speedClampsValues = [
                    easing.fast({from: 0.1, to: 0.6, steps: layersCount, type: 'linear', method: 'base', round: 2}),
                    easing.fast({from: 0.15, to: 0.65, steps: layersCount, type: 'linear', method: 'base', round: 2})
                ]

                let data = new Array(layersCount).fill().map((el, i) => ({
                    framesCount, 
                    itemsCount: itemsCountValues[i], 
                    itemFrameslengthClamps, size: this.size, addShining: false, detailing: true,
                    speedMul: 0.7,
                    aClamps: [0, aClampsMax[i]],
                    xClamps: [-10, this.size.x+10], yClamps: [-20, this.size.y-10], 
                    angleClamps: [
                        angleClampsValues[0][i],
                        angleClampsValues[1][i]
                    ], 
                    speedClamps: [
                        speedClampsValues[0][i],
                        speedClampsValues[1][i]
                    ], 
                    cPrefix: whiteColorPrefix, mask
                }));

                data.push({
                    framesCount, itemsCount: 50, itemFrameslengthClamps,size: this.size, addShining: true, detailing: false, aClamps: [0, 0.8],
                    speedMul: 0.7,
                    xClamps: [-10, this.size.x+10], yClamps: [-20, this.size.y-10], angleClamps: [-17, 17],speedClamps: [0.6, 0.65], cPrefix: whiteColorPrefix, mask
                })

                // console.log(data);
                this.snowLayers = 
                // [
                //     {
                //         framesCount, itemsCount: 1500, itemFrameslengthClamps, size: this.size, addShining: false,
                //         aClamps: [0, 0.4],xClamps: [-5, this.size.x+5], yClamps: [-5, this.size.y-5], angleClamps: [-10,10], 
                //         speedClamps: [0.20,0.225], cPrefix: whiteColorPrefix, mask
                //     },
                //     {
                //         framesCount, itemsCount: 500, itemFrameslengthClamps, size: this.size, addShining: false,
                //         aClamps: [0, 0.6],xClamps: [-5, this.size.x+5], yClamps: [-5, this.size.y-5], angleClamps: [-10,10], 
                //         speedClamps: [0.25,0.3], cPrefix: whiteColorPrefix, mask
                //     },
                //     {
                //         framesCount, itemsCount: 200, itemFrameslengthClamps, size: this.size, addShining: false,
                //         aClamps: [0, 0.8],xClamps: [-5, this.size.x+5], yClamps: [-5, this.size.y-5], angleClamps: [-15,15], 
                //         speedClamps: [0.4,0.45], cPrefix: whiteColorPrefix, mask
                //     }
                // ]
                data.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 11)
    }
}