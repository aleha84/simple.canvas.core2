class Demo10MetroScene extends Scene {
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

        // this.street = this.addGo(new GO({position: new V2(), size: new V2(1,1)}));

        // this.timer = this.regTimerDefault(5000, () => {
        //     if(this.street){
        //         this.removeGo(this.street);
        //         this.street = undefined;
        //     }
        //     else {
        //         this.street = this.addGo(new GO({
        //             position: this.sceneCenter,
        //             size: this.viewport,
        //             init() {
        //                 this.changeStateTime = 1000;
        //                 this.wChangeShow = easing.createProps(this.changeStateTime, 0, fast.r(this.size.x/2), 'quad', 'in');


        //             }
        //         }));
        //     }
        // })


        this.tonnel = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let scene = this.parentScene;
                this.frames = [];
                this.pCenter = new V2(106,70)

                this.framesCount = 30;
                this.itemsCount = 6;

                this.items = [];
                let totalIndexCount = this.framesCount*this.itemsCount;
                this.rChange = easing.createProps(totalIndexCount-1, 10, this.size.x, 'cubic', 'in');
                this.rValues = [];
                for(let f = 0; f < totalIndexCount;f++){
                    this.rChange.time = f;
                    this.rValues[f] = fast.r(easing.process(this.rChange))
                }

                for(let f = 0; f < this.framesCount;f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {

                        for(let i = 0; i < this.itemsCount; i++){
                            let startIndex = this.framesCount*i;
                            let index = startIndex+f;

                            hlp.setFillColor('#222222');
                            hlp.strokeEllipsis(0,360, 0.1, this.pCenter, this.rValues[index], this.rValues[index]*2);
                        }

                        
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 1)



        this.cabin = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200,200),
            //isVisible: false,
            init() {
                this.img = PP.createImage(Demo10MetroScene.models.main);
                this.xOriginal = this.position.x;

                this.xChange = easing.createProps(20, 0,1,'quad', 'in');
                this.xChangeBack = easing.createProps(20, 1,0,'quad', 'in');
                this.direction = 1;

                this.delayCounter = 20;

                this.shakeTimer = this.regTimerDefault(15, () => {
                    if(this.delayCounter > 0){
                        this.delayCounter--;
                        return;
                    }
                        

                    let xChange = this.xChange;
                    if(this.direction<0){
                        xChange = this.xChangeBack;
                    }

                    
                    let x = fast.r(easing.process(xChange));
                    this.position.x = this.xOriginal+ x;
                    this.needRecalcRenderProperties = true;

                    xChange.time++;
                    if(xChange.time > xChange.duration){
                        xChange.time = 0;
                        this.direction*=-1;

                        if(this.direction > 0){
                            this.delayCounter = 50;
                        }
                    }
                })
            }
        }), 2)
    }
}