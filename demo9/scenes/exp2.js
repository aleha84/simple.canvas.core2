class Demo9Exp2Scene extends Scene {
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
        this.face = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.faceSize = new V2(41,48)
                this.upperHairSize = new V2(74,42)
                //this.createImage();
                this.hair1CurrentFrame = 0;
                this.hair2CurrentFrame = 0;
                this.hair3CurrentFrame = 0;
                this.timer = this.regTimerDefault(75, () => {
                    this.createImage();
                    this.hair1CurrentFrame++;
                    if(this.hair1CurrentFrame == demo9Exp2Models.hair1.length){
                        this.hair1CurrentFrame = 0;
                    }

                    this.hair2CurrentFrame++;
                    if(this.hair2CurrentFrame == demo9Exp2Models.hair2.length){
                        this.hair2CurrentFrame = 0;
                    }

                    this.hair3CurrentFrame++;
                    if(this.hair3CurrentFrame == demo9Exp2Models.hair3.length){
                        this.hair3CurrentFrame = 0;
                    }

                    //this.currentFrame = 0;
                })
            },
            createImage() {
                this.img = createCanvas(this.size.mul(0.25), (ctx, size, hlp) => {
                    let center = size.mul(0.25).toInt();
                    ctx.drawImage(PP.createImage(demo9Exp2Models.faceModel), center.x, center.y)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair3[this.hair3CurrentFrame]), center.x-30, center.y-10)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair2[this.hair2CurrentFrame]), center.x-30, center.y-10)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair1[this.hair1CurrentFrame]), center.x-30, center.y-10)

                })
            } 
        }))
    }
}