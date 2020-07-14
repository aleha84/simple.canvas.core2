class SlimeCinemaBobRossScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 20,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'bob_ross'
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
            frames: PP.createImage(SlimeCinemaBobRossScene.models.artistFrames),
            init() {
                this.currentFrame = 0;
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.filter = "brightness(150%)";
                    ctx.drawImage( this.frames[this.currentFrame],0,0);
                })
                
                let delay = 8;

                this.timer = this.regTimerDefault(10, () => {
                    if(delay-- > 0)
                        return;

                    delay = 8;

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                    this.img = this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.filter = "brightness(150%)";
                        ctx.drawImage( this.frames[this.currentFrame],0,0);
                    })
                    console.log('frames switch to: ' + this.currentFrame)
                    
                })
            }
        }), 1)
    }
}