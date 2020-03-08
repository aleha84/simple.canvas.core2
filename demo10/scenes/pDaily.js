class Demo10PDailyScene extends Scene {
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
        this.backgroundRenderDefault('#E7E5E8');
    }

    start(){
        let frames = PP.createImage(pDailyModels.robothand);

        this.small = this.addGo(new GO({
            frames,
            position: new V2(50, 100),
            size: new V2(25,25),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                this.redFrameCounter = 5;

                this.timer = this.regTimerDefault(50, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        this.redFrameCounter--;

                        if(this.redFrameCounter == 0){
                            this.redFrameCounter= 5;
                            if(!this.redFrame){
                                this.redFrame = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size,
                                    img: createCanvas(this.size, (ctx, size, hlp) => {
                                        hlp.setFillColor('red').strokeRect(-5,-5, size.x, size.x)
                                    })
                                }));
                            }
                            else {
                                this.removeChild(this.redFrame);
                                this.redFrame = undefined;
                            }
                        } 
                    }
                })
            }
        }))

        this.big = this.addGo(new GO({
            frames,
            position: new V2(110, 100),
            size: new V2(75,75),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(50, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }))
    }
}