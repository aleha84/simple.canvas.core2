class Demo9DancingAnimationScene extends Scene {
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
        //this.backgroundRenderDefault();
        this.backgroundRenderImage(this.bgImg);
    }

    start(){
        this.bgImg = PP.createImage(Demo9DancingAnimationScene.model.bg);

        this.dancer = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames:PP.createImage(Demo9DancingAnimationScene.model.main),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(85, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 1)
    }
}