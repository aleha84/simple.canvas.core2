class Demo10AngelScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'angel'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
            }),
            init() {
                

                this.fallingStars = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createFallingFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let pp;
                        let tailLength = 60;
                        createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            pp = new PP({ctx});
                        })
                        let oValues = easing.fast({from: 1, to: 0, steps: tailLength, type: 'quad', method: 'out', round: 1});
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let from = new V2(getRandomInt(-size.x, size.x), 0);
                            let to = new V2(from.x + getRandomInt(50, 100), size.y + 50);
                            let points = pp.lineV2(from, to);
                            let indexValues = easing.fast({from: 0, to: points.length-1, steps: itemFrameslength, type: 'linear', round: 0});
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    index: indexValues[f]
                                };
                            }
                        
                            return {
                                points, 
                                indexValues,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let startIndex = itemData.frames[f].index;
                                        for(let i = 0; i < tailLength; i++){
                                            let index = startIndex-i;
                                            if(index < 0)
                                                continue;

                                            let p = itemData.points[index];
                                            hlp.setFillColor(`rgba(255,255,255,${oValues[i]})`).dot(p.x, p.y);
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createFallingFrames({ framesCount: 200, itemsCount: 10, itemFrameslength: 30, size: this.size });

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))
            }
        }), 0)



        let levitationFramesCount = 200;
        let yChangeValues = [
            ...easing.fast({from: this.sceneCenter.y, to: this.sceneCenter.y-2, steps: levitationFramesCount/2, type: 'quad', method: 'inOut', round: 0}),
            ...easing.fast({from: this.sceneCenter.y-2, to: this.sceneCenter.y, steps: levitationFramesCount/2, type: 'quad', method: 'inOut', round: 0})
        ]
        let levitationEnabled = true;

        this.streams = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStreamFrames({framesCount, dotsData, size, xClamps, addX = 0, addY = 0, particleReverse= false, particles = {}, color = '#cfccce'}) {
                let frames = [];
                let _sharedPP;
                let halfFramesCount = fast.r(framesCount/2);
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                })
                dotsData.forEach(dotData => {
                    if(dotData.dots.length == 1){
                        dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
                    }
                    else {
                        let midDots = _sharedPP.lineV2(dotData.dots[0], dotData.dots[1]);
                        let indexValues = [
                            ...easing.fast({from: 0, to: midDots.length-1, steps: halfFramesCount, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: midDots.length-1, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut', round: 0})
                        ];

                        dotData.dots = new Array(framesCount).fill().map((el, i) => midDots[indexValues[i]])
                    }
                });

                let framesData = [];
                let particleData = [];
                let particlesTotalFrames = 60;
                let oValues = easing.fast({ from: 1, to: 0, steps: particlesTotalFrames, type: 'quad', method: 'in', round: 2});
                
                for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => dd.dots[f]);
                    let formula = mathUtils.getCubicSplineFormula(dots);
                    for(let x = xClamps[0]; x < xClamps[1]; x++){
                        let y=  fast.r(formula(x));
                        framesData[f].dots.push({x,y});
                    }

                    let particlesCount = getRandomInt(0,2);
                    if(particles.countFun){
                        particlesCount = particles.countFun();
                    }
                    let startFrameIndex = f;
                    let totalFrames = particlesTotalFrames;
                    for(let i = 0; i < particlesCount; i++){
                        let yShiftChange = new Array(particlesTotalFrames).fill(getRandomInt(0,2));
                        if(getRandomInt(0,3) == 0 || particles.allUp)
                            yShiftChange = easing.fast({ from: 0, to: -getRandomInt(5,15), steps: particlesTotalFrames, type: 'quad', method: 'in', round: 0});
                        let data = { frames: []};
                        let startDotIndex = getRandomInt(0, framesData[f].dots.length-1);
                        let indexShift = -15;
                        if(particleReverse){
                            indexShift = 15;
                        }
                        let indexValues = easing.fast({from: startDotIndex, to: startDotIndex+indexShift, steps: totalFrames, type: 'quad', method: 'inOut', round: 0});
                        for(let _f = 0; _f < totalFrames; _f++){
                            let frameIndex = _f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            let p = framesData[f].dots[indexValues[_f]];
                            p = new V2(p);
                            p.y += yShiftChange[_f];
                            data.frames[frameIndex] = {p, o: oValues[_f]};
                        }

                        particleData.push(data);
                    }
                }

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let i = 0; i < framesData[f].dots.length; i++){
                            hlp.setFillColor(color).rect(framesData[f].dots[i].x, framesData[f].dots[i].y, 1 + addX, 1 + addY);
                        }

                        for(let p = 0; p < particleData.length; p++){
                            let itemData = particleData[p];
                            
                            if(itemData.frames[f]){
                                if(itemData.frames[f].p)
                                    hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o})`).dot(itemData.frames[f].p.x, itemData.frames[f].p.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.wings = this.addChild(new GO({
                    position: new V2(),
                    size: new V2(150,150),
                    frames: PP.createImage(Demo10AngelScene.models.wings),
                    init() {
                        let framesCount = 200;
                        let framesChange = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        this.img = this.frames[framesChange[this.currentFrame]];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[framesChange[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesCount){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))
                let countFun = () => { 
                    if(getRandomInt(0,4) == 0)
                       return 1;
                   return 0;
                  }

                let framesData = [
                    // this.createStreamFrames({ framesCount: 200, 
                    //     dotsData: [ 
                    //         { dots: [new V2(26,-20), new V2(20,-20)] }, 
                    //         { dots: [new V2(62, 24), new V2(58, 27)] }, 
                    //         { dots: [new V2(88, 35)] }
                    //  ], size: this.size, xClamps: [26, 88], addY: 1 }),
                    this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,35), new V2(-20,40)] }, 
                            { dots: [new V2(10, 50), new V2(10, 52)] }, 
                            { dots: [new V2(33, 52)] }
                     ], size: this.size, xClamps: [-20, 33], addY: 1 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,12), new V2(-20,18)] }, 
                            { dots: [new V2(34, 33), new V2(32, 35)] }, 
                            { dots: [new V2(78, 34)] }
                     ], size: this.size, xClamps: [-20, 78], addY: 1 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,62), new V2(-20,70)] }, 
                            { dots: [new V2(14, 59), new V2(13, 61)] }, 
                            { dots: [new V2(32, 57)] }
                     ], size: this.size, xClamps: [-20, 57], addY: 1 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,90), new V2(-20,95)] }, 
                            { dots: [new V2(16, 69), new V2(16, 71)] }, 
                            { dots: [new V2(41, 59)] }
                     ], size: this.size, xClamps: [-20, 59], addY: 2 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,109), new V2(-20,115)] }, 
                            { dots: [new V2(17, 75), new V2(16, 77)] }, 
                            { dots: [new V2(44, 62)] }
                     ], size: this.size, xClamps: [-20, 62], addY: 2 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,134), new V2(-20,140)] }, 
                            { dots: [new V2(25, 79), new V2(24, 81)] }, 
                            { dots: [new V2(48, 64)] }
                     ], size: this.size, xClamps: [-20, 62], addY: 2 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,149), new V2(-20,150)] }, 
                            { dots: [new V2(31, 83), new V2(30, 87)] }, 
                            { dots: [new V2(52, 66)] }
                     ], size: this.size, xClamps: [-20, 66], addY: 2 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(-20,181), new V2(-20,195)] }, 
                            { dots: [new V2(42, 81), new V2(42, 84)] }, 
                            { dots: [new V2(57, 67)] }
                     ], size: this.size, xClamps: [-20, 67], addY: 2 }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(143,21), new V2(146,24)] }, 
                            { dots: [new V2(150, 7), new V2(152, 10)] }, 
                            { dots: [new V2(172, -20), new V2(174,-25)] }
                     ], size: this.size, xClamps: [143, 174], addY: 2, particles: { allUp: true, countFun } }),
                       this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(59, -20), new V2(59,-25)] },
                            { dots: [new V2(82,4), new V2(83,6)] }, 
                            { dots: [new V2(90, 16), new V2(92, 21)] }, 
                     ], size: this.size, xClamps: [59, 92], addY: 1, particleReverse: true, particles: { allUp: true, countFun } }),
                     ////////////////////////////
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(128, 43)] },
                            { dots: [new V2(163, 58), new V2(164,60)] }, 
                            { dots: [new V2(220, 38), new V2(220, 43)] }
                     ], size: this.size, xClamps: [128, 220], addY: 1, particleReverse: true }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(149, 69)] },
                            { dots: [new V2(180, 74), new V2(180,77)] }, 
                            { dots: [new V2(220, 72), new V2(220, 77)] }
                     ], size: this.size, xClamps: [149, 220], addY: 1, particleReverse: true }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(149, 74)] },
                            { dots: [new V2(178, 86), new V2(177,88)] }, 
                            { dots: [new V2(220, 89), new V2(220, 95)] }
                     ], size: this.size, xClamps: [128, 220], addY: 1, particleReverse: true }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(146, 75)] },
                            { dots: [new V2(176, 93), new V2(177,95)] }, 
                            { dots: [new V2(220, 120), new V2(220, 126)] }
                     ], size: this.size, xClamps: [146, 220], addY: 1, particleReverse: true }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(142, 76)] },
                            { dots: [new V2(172, 102), new V2(172,105)] }, 
                            { dots: [new V2(220, 156), new V2(220, 163)] }
                     ], size: this.size, xClamps: [142, 220], addY: 1, particleReverse: true }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(20, 220), new V2(26, 220)] },
                            { dots: [new V2(50, 180), new V2(55,182)] }, 
                            { dots: [new V2(60, 160), new V2(64, 163)] },
                     ], size: this.size, xClamps: [20, 60], addY: 1, particleReverse: true, particles: { allUp: true, countFun } }),
                     this.createStreamFrames({ framesCount: 200, 
                        dotsData: [ 
                            { dots: [new V2(135, 170), new V2(137, 174)] },
                            { dots: [new V2(165, 190), new V2(168,193)] }, 
                            { dots: [new V2(220, 210), new V2(225, 215)] },
                     ], size: this.size, xClamps: [135, 225], addY: 1, particleReverse: false, particles: { allUp: true, countFun } }),

                     ///

                     

                ]

                this.streamItems = framesData.map(frames => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames, 
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                })))

                if(levitationEnabled){
                    let frameIndex = 0;
                    let totalFrames = levitationFramesCount;
                    this.timer = this.regTimerDefault(10, () => {
                        let y = yChangeValues[frameIndex];
                        this.position.y = y;
                        this.needRecalcRenderProperties = true;
                        frameIndex++;
                        if(frameIndex == totalFrames){
                            frameIndex = 0;
                        }
                    })
                }
                
            }
        }), 5)

        this.angel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(150,150),
            init() {
                //this.img = 

                this.legs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo10AngelScene.models.legs),
                    init() {
                        let framesCount = 200;
                        let framesChange = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        this.img = this.frames[framesChange[this.currentFrame]];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[framesChange[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesCount){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10AngelScene.models.main, { exclude: ['bg', 'wings'] })
                }))

                this.bodyFrames = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo10AngelScene.models.mainFrames, { exclude: ['bg', 'body', 'hands', 'head','p1','wings'] }),
                    init() {
                        let framesCount = 200;
                        let framesChange = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        this.img = this.frames[framesChange[this.currentFrame]];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[framesChange[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesCount){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))

                this.spear = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10AngelScene.models.spear)
                }))

                this.p1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    extractPointData(layer) {
                        let data = [];
                        layer.groups.forEach(group => {
                            let color = group.strokeColor;
                            group.points.forEach(point => {
                                data.push({
                                    color, 
                                    point: point.point
                                });
                            })
                        })
        
                        return data;
                    },
                    createMovementFrames({framesCount, itemFrameslength, pointsData, size}) {
                        let frames = [];
                        
                        let itemsData = pointsData.map((pd, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                frames,
                                pd
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createMovementFrames({framesCount: 200, itemFrameslength: 100, size: this.size, 
                            pointsData: this.extractPointData(Demo10AngelScene.models.main.main.layers.find(layer => layer.name == 'p1'))});
        
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))

                if(levitationEnabled){
                    let frameIndex = 0;
                    let totalFrames = levitationFramesCount;
                    this.timer = this.regTimerDefault(10, () => {
                        let y = yChangeValues[frameIndex];
                        this.position.y = y;
                        this.needRecalcRenderProperties = true;
                        frameIndex++;
                        if(frameIndex == totalFrames){
                            frameIndex = 0;
                        }
                    })
                }
                
            }
        }), 10)

        this.fire = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createExplFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let radius = fast.r(size.x/2);
                let img = createCanvas(this.size, (ctx, size, hlp) => {
                    let center = size.divide(2).toInt();
                    
                    let oValues = easing.fast({from: 1, to: 0, steps: radius-1, type: 'quad', method: 'out', round: 2 }) ;
                    for(let y = center.y-radius-1;y < center.y+radius+1;y++){
                        for(let x = center.x-radius-1;x < center.x+radius+1;x++){
              
                            let _p = new V2(x,y);
                            let distance = fast.r(center.distance(_p));
              
                            if(distance < radius){
                                let o = oValues[distance];
                                if(o == undefined || o > 1)
                                    o = 0;

                                hlp.setFillColor(`rgba(128,17,0,${o})`).dot(x,y)
                            }
                        }
                    }
                })

                let frames = [];
    
                let particles = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(40, 80);
                    let oValues = [
                        ...easing.fast({from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1 }),
                        ...easing.fast({from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1 })
                    ];

                    let originalX = getRandomInt(0, size.x);
                    let originalY =  size.y + getRandomInt(0, 20);

                    let frames = [];
                    let a = getRandomInt(8, 12);
                    let b = getRandomInt(4,7);
                    
                    let formula = (x) => Math.sin(x/a)*b;

                    let yChange = easing.fast({from: originalY, to: originalY - getRandomInt(20, 40), steps: totalFrames, type: 'linear', method: 'base', round: 0 })

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let y = yChange[f];
                        let x = fast.r(formula(y)) + originalX;

                        frames[frameIndex] = {
                          o: oValues[f] != undefined ? oValues[f] : 0,
                            y, x
                        };
                    }
                
                    return {
                        frames
                    }
                })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                
                    let oValues = [
                        ...easing.fast({from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'expo', method: 'out', round: 1 }),
                        ...easing.fast({from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'expo', method: 'in', round: 1 })
                    ];

                    let x = getRandomInt(0, size.x);
                    let y =  getRandomInt(size.y*1.2, size.y*1.5);
                    

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                          o: oValues[f] != undefined ? oValues[f] : 0  
                        };
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                ctx.globalAlpha = itemData.frames[f].o;
                                ctx.drawImage(img, itemData.x-radius, itemData.y-radius);
                            }
                            
                        }

                        for(let p = 0; p < particles.length; p++){
                            let itemData = particles[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,117,0,${itemData.frames[f].o})`).dot(itemData.frames[f].x, itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createExplFrames({ framesCount: 200, itemsCount: 100, itemFrameslengthClamps: [30, 60], size: this.size });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let repeat = 5;
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 20)

    }
}