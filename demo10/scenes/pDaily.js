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

        //let frames = PP.createImage(pDailyModels.robothand);
        let img = PP.createImage(pDailyModels.bandana);

        this.small = this.addGo(new GO({
            frames,
            position: new V2(50, 100),
            size: new V2(50,50),
            img,
            init() {
                // this.currentFrame = 0;
                // this.img = this.frames[this.currentFrame];
                // this.redFrameCounter = 5;

                // this.timer = this.regTimerDefault(50, () => {
    
                //     this.img = this.frames[this.currentFrame];
                //     this.currentFrame++;
                //     if(this.currentFrame == this.frames.length){
                //         this.currentFrame = 0;

                //         this.redFrameCounter--;

                //         if(this.redFrameCounter == 0){
                //             this.redFrameCounter= 5;
                //             if(!this.redFrame){
                //                 this.redFrame = this.addChild(new GO({
                //                     position: new V2(),
                //                     size: this.size,
                //                     img: createCanvas(this.size, (ctx, size, hlp) => {
                //                         hlp.setFillColor('red').strokeRect(-5,-5, size.x, size.x)
                //                     })
                //                 }));
                //             }
                //             else {
                //                 this.removeChild(this.redFrame);
                //                 this.redFrame = undefined;
                //             }
                //         } 
                //     }
                // })
            }
        }),2)

        this.big = this.addGo(new GO({
            frames,
            position: new V2(120, 100),
            size: new V2(120,120),
            img,
            init() {
                // this.currentFrame = 0;
                // this.img = this.frames[this.currentFrame];

                // this.timer = this.regTimerDefault(50, () => {
    
                //     this.img = this.frames[this.currentFrame];
                //     this.currentFrame++;
                //     if(this.currentFrame == this.frames.length){
                //         this.currentFrame = 0;
                //     }
                // })
            }
        }),2)
    }
}