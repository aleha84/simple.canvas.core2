class Demo10MetroScene extends Scene {
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

        // 

        this.timer = this.regTimerDefault(10000, () => {
            if(this.tonnel){
                // this.removeGo(this.tonnel);
                // this.tonnel = undefined;
            }
            else {
                this.tonnel = this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    frames: this.tonnelFrames,
                    init() {
                        this.changeStateFrames = 100;

                        this.wChangeShow = easing.createProps(this.changeStateFrames-1, 0, fast.r(this.size.x/2), 'quad', 'in');
                        this.changeStateValues = [];
                        this.changeStateMaskFrames = [];

                        this.pCenter = new V2(106,70)
                        for(let f = 0; f < this.changeStateFrames; f++){
                            this.wChangeShow.time = f;
                            let w = fast.r(easing.process(this.wChangeShow));
                            this.changeStateValues[f] = w;

                            this.changeStateMaskFrames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('white').rect(this.pCenter.x - w, 0, w*2, size.y);
                            })
                        }

                        //console.log(this.changeStateValues);

                        // this.composition = 'destination-in';
                        // this.changeStateMaskFramesIndex = 0;
                        
                        this.startTonnelFrames();

                        // this.delayTimer = this.registerTimer(createTimer(5000, () => {
                        //     this.unregTimer(this.delayTimer);
                        //     this.delayTimer = undefined;
                        //     this.composition = 'destination-out';
                        //     this.changeStateMaskFramesIndex = 0;
                        // }, this, false));
                    },
                    startTonnelFrames() {
                        this.redFrameCounter = 10;
                        this.currentFrame = 0;
                        //this.img = this.frames[this.currentFrame];

                        this.timer = this.regTimerDefault(15, () => {
            
                            this.tonnelFrame = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;

                                this.redFrameCounter--;

                                if(this.redFrameCounter == 0){
                                    this.redFrameCounter= 10;
                                    if(!this.redFrame){
                                        this.redFrame = this.addChild(new GO({
                                            position: new V2(),
                                            size: this.size,
                                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                                hlp.setFillColor('red').strokeRect(45,0, size.x, size.x)
                                            })
                                        }));
                                    }
                                    else {
                                        this.removeChild(this.redFrame);
                                        this.redFrame = undefined;
                                    }
                                } 
                            }

                            if(this.composition){
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.drawImage(this.tonnelFrame,0,0);
    
                                    ctx.globalCompositeOperation  = this.composition;
                                    ctx.drawImage(this.changeStateMaskFrames[this.changeStateMaskFramesIndex],0,0);

                                    this.changeStateMaskFramesIndex++;
                                    if(this.changeStateMaskFramesIndex >= this.changeStateMaskFrames.length){
                                        if(this.composition == 'destination-out'){
                                            this.setDead();
                                            this.parentScene.tonnel = undefined;
                                        }
                                        else {
                                            this.composition = undefined;
                                        }
                                    }
                                })
                            }
                            else {
                                this.img = this.tonnelFrame;
                            }
                            
                        })
                    }
                }), 2);
            }
        })

        this.tonnelFrames = [];

        this.pCenter = new V2(106,70)

        this.tonnelFramesCount = 30;
        this.tonnelItemsCount = 6;

        this.items = [];
        let totalIndexCount = this.tonnelFramesCount*this.tonnelItemsCount;
        this.rChange = easing.createProps(totalIndexCount-1, 10, this.viewport.x, 'cubic', 'in');
        this.rValues = [];
        for(let f = 0; f < totalIndexCount;f++){
            this.rChange.time = f;
            this.rValues[f] = fast.r(easing.process(this.rChange))
        }

        for(let f = 0; f < this.tonnelFramesCount;f++){
            this.tonnelFrames[f] = createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);

                for(let i = 0; i < this.tonnelItemsCount; i++){
                    let startIndex = this.tonnelFramesCount*i;
                    let index = startIndex+f;
                    hlp.setFillColor('#222222');
                    //hlp.strokeEllipsis(0,360, 0.1, this.pCenter, this.rValues[index], this.rValues[index]*2);
                    hlp.rect(this.pCenter.x+this.rValues[index], 0, 1, size.y)
                    hlp.rect(this.pCenter.x-this.rValues[index], 0, 1, size.y)

                    hlp.setFillColor('#111111')
                    hlp.rect(this.pCenter.x+this.rValues[index]+1, 0, 1, size.y)
                    hlp.rect(this.pCenter.x-this.rValues[index]-1, 0, 1, size.y)

                    hlp.setFillColor('#090909')
                    hlp.rect(this.pCenter.x+this.rValues[index]+2, 0, 1, size.y)
                    hlp.rect(this.pCenter.x-this.rValues[index]-2, 0, 1, size.y)
                }

                
            })
        }

        this.street = this.addGo(new GO({
            position: this.sceneCenter.clone(), 
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#333').rect(0,0,size.x, size.y)
                })
            }
        }, 1));



        this.cabin = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200,200),
            //isVisible: false,
            init() {
                this.img = PP.createImage(Demo10MetroScene.models.main);
                this.xOriginal = this.position.x;
                this.yOriginal = this.position.y;

                this.xChange = easing.createProps(20, 0,1,'quad', 'in');
                this.xChangeBack = easing.createProps(20, 1,0,'quad', 'in');
                this.direction = 1;

                this.delayCounter = 29;

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
                    this.position.y = this.yOriginal+ (x/3);
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
        }), 4)
    }
}