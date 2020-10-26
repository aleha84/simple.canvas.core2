class GirlWithARifleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'girl_with_the_rifle'
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
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['bg'] }),
        }), 0)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(184,200),
            baseImg: PP.createImage(GirlWithARifleScene.models.clouds, { renderOnly: ['m_0'] }),
            createCloudsFrames({framesCount, size}) {
                let frames = [];
                let particleframes = animationHelpers.createMovementFrames({ framesCount, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(GirlWithARifleScene.models.clouds.main.layers.find(l => l.name == 'p')) });

                let direction = -1
                let xValues = easing.fast({from: 0, to: -size.x, steps: framesCount, type: 'linear', round: 0});
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let x = xValues[f];
                        ctx.drawImage(this.baseImg, x, 0);
                        ctx.drawImage(particleframes[f], x, 0);
                        ctx.drawImage(this.baseImg, direction > 0 ? x-size.x: size.x+x, 0)
                        ctx.drawImage(particleframes[f], direction > 0 ? x-size.x: size.x+x, 0)

                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createCloudsFrames({ framesCount: 600, size: this.size })
                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });

                // this.particlesEffect = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                //             pointsData: animationHelpers.extractPointData(GirlWithARifleScene.models.clouds.main.layers.find(l => l.name == 'p')) });

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 10)

        this.grass = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['grass'] }),
            init() {
                this.particlesEffect = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(GirlWithARifleScene.models.main.main.layers.find(l => l.name == 'grass_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 20)

        this.rifle = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['rifle'] }),
            init() {
            }
        }), 30)

        this.grassAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.grassFrames),
            init() {
                //this.frames = [...this.frames, ...this.frames.reverse()]
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1],this.frames[2], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 10;

                let framesCut = this.frames.filter((f,i) => i < (this.frames.length-1));
                this.framesLong = [
                    ...framesCut, ...framesCut.reverse()
                ];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 8;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 31)

        this.hand = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['hand'] }),
        }), 40)

        // this.girl = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['girl', 'girl_d1'] }),
        // }), 50)

        this.belt = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['belt'] }),
        }), 60)


        this.clotherAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['girl', 'girl_d1', 'ani'] }),
            init() {
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 50)

        this.clotherAnimation2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['ani2'] }),
            init() {
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = 7;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 51)

        this.clotherAnimation3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['ani3'] }),
            init() {
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = 2;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 61)

        // this.main = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(GirlWithARifleScene.models.main),
        //     init() {
                
        //     }
        // }), 1)
    }
}