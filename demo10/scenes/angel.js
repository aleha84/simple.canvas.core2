class Demo10AngelScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
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
            })
        }), 0)

        let levitationFramesCount = 200;
        let yChangeValues = [
            ...easing.fast({from: this.sceneCenter.y, to: this.sceneCenter.y-2, steps: levitationFramesCount/2, type: 'quad', method: 'inOut', round: 0}),
            ...easing.fast({from: this.sceneCenter.y-2, to: this.sceneCenter.y, steps: levitationFramesCount/2, type: 'quad', method: 'inOut', round: 0})
        ]

        this.streams = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStreamFrames({framesCount, dotsData, size, xClamps, addX = 0, addY = 0}) {
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

                
                for(let f = 0; f < framesCount; f++){
                    let dots = dotsData.map(dd => dd.dots[f]);
                    let formula = mathUtils.getCubicSplineFormula(dots);
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            hlp.setFillColor('#cfccce').rect(x, y, 1 + addX, 1 + addY);
                        }
                    });
                }
                
                return frames;
            },
            init() {

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
                     ], size: this.size, xClamps: [-20, 67], addY: 2 })
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
        }), 5)

        this.angel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(150,150),
            init() {
                this.img = PP.createImage(Demo10AngelScene.models.main, { exclude: ['bg'] })

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
        }), 10)
    }
}