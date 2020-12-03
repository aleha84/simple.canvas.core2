class FireballScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'fireball'
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
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(FireballScene.models.main),
            init() {
                this.currentFrame = 0;
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.filter = "brightness(125%)";
                    ctx.drawImage( this.frames[this.currentFrame],0,0);
                })
                //this.img = this.frames[this.currentFrame]
                let delay = 0;
                let repeats = 10
                this.timer = this.regTimerDefault(10, () => {
                    if(delay-- > 0)
                        return;

                    delay = 5;

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeats--;
                        if(repeats == 0)
                            this.parentScene.capturing.stop = true;
                    }

                    //this.img = this.frames[this.currentFrame]
                    this.img = this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.filter = "brightness(125%)";
                        ctx.drawImage( this.frames[this.currentFrame],0,0);
                    })
                    // console.log('frames switch to: ' + this.currentFrame)
                    
                })
            }
        }), 1)
    }
}