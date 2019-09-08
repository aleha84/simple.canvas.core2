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
        this.backgroundRenderDefault('#F0F0F0');
    }

    start(){
        this.face = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.eyeBallY = 21;
                this.eyeBallYDirection = 1;
                this.eyeBallChangeCount = 10;
                this.faceSize = new V2(41,48)
                this.upperHairSize = new V2(74,42)
                //this.createImage();
                this.hair1CurrentFrame = 0;
                this.hair2CurrentFrame = 0;
                this.hair3CurrentFrame = 0;
                this.lowerHair1CurrentFrame = 0;
                this.lowerHair2CurrentFrame = 0;

                this.frames = [];
                for(let i = 0; i < demo9Exp2Models.hair1.length; i++){
                    this.frames.push(this.createImage())

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

                    this.lowerHair1CurrentFrame++;
                    if(this.lowerHair1CurrentFrame == demo9Exp2Models.lowerHair1.length){
                        this.lowerHair1CurrentFrame = 0;
                    }

                    this.lowerHair2CurrentFrame++;
                    if(this.lowerHair2CurrentFrame == demo9Exp2Models.lowerHair2.length){
                        this.lowerHair2CurrentFrame = 0;
                    }
                }

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(75, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    //this.createImage();
                    
                    // if(this.eyeBallChangeCount-- == 0){
                    //     this.eyeBallChangeCount = 10;

                    //     demo9Exp2Models.faceModel.main.layers[24].points.forEach(p => {
                    //         p.point.x+=this.eyeBallYDirection;
                    //     })

                    //     this.eyeBallYDirection*=-1;
                    // }
                    

                    //this.currentFrame = 0;
                })
            },
            createImage() {
                return createCanvas(this.size.mul(0.25), (ctx, size, hlp) => {
                    let center = size.mul(0.25).toInt();
                    ctx.drawImage(PP.createImage(demo9Exp2Models.neckModel), center.x-11, center.y+35)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.lowerHair1[this.lowerHair1CurrentFrame]), center.x-20, center.y+18)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.lowerHair2[this.lowerHair2CurrentFrame]), center.x+10, center.y+18)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.faceModel), center.x, center.y)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair3[this.hair3CurrentFrame]), center.x-30, center.y-10)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.earsModel), center.x-30, center.y-10)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair2[this.hair2CurrentFrame]), center.x-30, center.y-10)
                    ctx.drawImage(PP.createImage(demo9Exp2Models.hair1[this.hair1CurrentFrame]), center.x-30, center.y-10)

                })
            } 
        }))
    }
}