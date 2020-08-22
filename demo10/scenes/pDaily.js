class Demo10PDailyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'pigeon'
            },
            debug: {
                enabled: false,
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
        let model = pDailyModels.pigeon;
        let originSize = new V2(50, 67)
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
            })
        }), 0)
        
        this.small = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -40)),
            size: originSize,
            init() {
                this.frames = PP.createImage(model);

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let repeats = 10;

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

                        repeats--;
                        if(repeats == 0)
                            this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 1)

        this.big = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: originSize.mul(2),
            init() {
                this.frames = PP.createImage(model);

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
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
        }), 1)
    }
}