class Demo10PDailyScene extends Scene {
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y)
                })
            }
        }), 1)

        let framesPack = [
            PP.createImage(Demo10Flames.flameFrames), 
            PP.createImage(Demo10Flames.flameFrames2),
            PP.createImage(Demo10Flames.flameFrames3),
            PP.createImage(Demo10Flames.flameFrames4)
        ]
        //let frames = PP.createImage(Demo10Flames.flameFrames);
        let yStep = fast.r(this.viewport.y/framesPack.length);
        let yShift = fast.r(yStep/2);
        let framesDelay = 25;

        framesPack.forEach((frames, i) => {
            this.addGo(new GO({
                frames,
                position: new V2(50, yShift+(yStep*i)),
                size: new V2(20,20),
                //img,
                init() {
                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
                    this.redFrameCounter = 5;
    
                    this.timer = this.regTimerDefault(framesDelay, () => {
        
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
    
                            // this.redFrameCounter--;
    
                            // if(this.redFrameCounter == 0){
                            //     this.redFrameCounter= 5;
                            //     if(!this.redFrame){
                            //         this.redFrame = this.addChild(new GO({
                            //             position: new V2(),
                            //             size: this.size,
                            //             img: createCanvas(this.size, (ctx, size, hlp) => {
                            //                 hlp.setFillColor('red').strokeRect(-5,-5, size.x, size.x)
                            //             })
                            //         }));
                            //     }
                            //     else {
                            //         this.removeChild(this.redFrame);
                            //         this.redFrame = undefined;
                            //     }
                            // } 
                        }
                    })
                }
            }),2)
    
            this.addGo(new GO({
                frames,
                position: new V2(120, yShift+(yStep*i)),
                size: new V2(50,50),
                //img,
                init() {
                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
    
                    this.timer = this.regTimerDefault(framesDelay, () => {
        
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                        }
                    })
                }
            }),2)
        });

        
    }
}