class GirlWithARifleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
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
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main),
            init() {
                this.clotherAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(GirlWithARifleScene.models.clothersFrames, { renderOnly: ['ani'] }),
                    init() {
                        let originFramesCount = this.frames.length;

                        this.frames = [
                        ...this.frames, ...this.frames.reverse()];

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 10;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 10;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;

                            if(this.currentFrame < originFramesCount)
                                frameChangeDelay = fast.r(originFrameChangeDelay/2);
                        
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
        }), 1)
    }
}