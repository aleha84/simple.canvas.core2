class Demo9WaitingScene extends Scene {
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
        this.backgroundRenderDefault('#030712');
    }

    start(){
        this.train = this.addGo(new GO({
            position: new V2(100,88),
            size: new V2(260,80),
            init() {
                // this.vagonImg = createCanvas(this.size, (ctx, size, hlp) => {
                //  ctx.drawImage(PP.createImage(Demo9WaitingScene.models.trainVagon),0,0)   ;
                //  hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
                // })
                this.vagonImg = PP.createImage(Demo9WaitingScene.models.trainVagon);
                this.firstVagonImg = PP.createImage(Demo9WaitingScene.models.firstTrainVagon);
                 
                this.direction = new V2(0,35).direction(new V2(259, 55));
                this.movementDirection = this.direction.mul(-1);
                //new V2(-1,0);
                this.speed = 15;

                let that = this;

                // this.reflection = this.addChild(new GO({
                //     position: new V2(10, -14),
                //     size: new V2(100, 30),
                //     init() {
                //         this.initialDots = [];
                //         this.topLeft = this.getAbsolutePosition().add(this.size.divide(2))

                //         createCanvas(this.size, (ctx, size, hlp) => {
                //             let pp = new PerfectPixel({ctx});
                //             this.initialDots = pp.lineV2(new V2(0,0), new V2(0,0).add(that.direction.mul(size.x)))
                //         })    
                //     },
                //     createImage(fromX, toX) {
                //         this.img =  createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('#424743');
                //             for(let i = 0; i < this.initialDots.length; i++){
                //                 let id = this.initialDots[i];
                //                 if(this.topLeft.x + id.x >= fromX && this.topLeft.x + id.x <= toX)
                //                     hlp.dot(id.x, id.y);
                //             }
                //         })    
                //     }
                // }))

                this.vagons = [];
                this.genTrain();

                this.delayCounter = 0;
                this.timer = this.regTimerDefault(15, () => {
                    if(this.delayCounter-- > 0)
                        return;

                    let left = undefined;
                    let right = undefined;

                    for(let i = 0; i < this.vagons.length; i++){
                        let vagon = this.vagons[i];
                        if(!vagon.alive)
                            continue;

                        if(vagon.position.x < -vagon.size.x){
                            vagon.setDead();
                        }

                        vagon.position.add(this.movementDirection.mul(this.speed), true);
                        vagon.needRecalcRenderProperties = true;
                    }

                    if(this.vagons.filter(v => v.alive).length == 0){
                        this.vagons = [];
                        this.genTrain();
                        this.delayCounter = getRandomInt(100,200);
                    }
                        
                    // if(this.vagons.length > 0){
                    //     this.reflection.createImage(this.vagons[0].absolutePosition.x, this.vagons[this.vagons.length-1].absolutePosition.x + this.size.x/2)
                    // }
                })
            },
            genTrain() {
                let vagonsCount = getRandomInt(10,15);
                for(let i = 0; i < vagonsCount;i++){
                    this.vagons[this.vagons.length] = this.addChild(new GO({
                        position: new V2().add(this.direction.mul(this.size.x*(i+1))),  //new V2(this.size.x*i, 0),
                        size: this.size.clone(),
                        renderValuesRound: true,
                        img: this.vagonImg// i == 0 ? this.firstVagonImg : this.vagonImg
                    }), false, true);
                }
            }
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.main)
            }
        }), 1)

        this.sign = this.addGo(new GO({
            position: new V2(37.5, 231),
            size: new V2(75,130),
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.sign)
            }
        }), 5)

        this.man = this.addGo(new GO({
            position: new V2(75,111),
            size: new V2(16,30),
            init() {
                this.idleFrames = PP.createImage(Demo9WaitingScene.models.manIdleFrames);
                this.drinkingFrames1 = PP.createImage(Demo9WaitingScene.models.manDrinkingFrames1);
                this.img = PP.createImage(Demo9WaitingScene.models.man);

                this.currentFrame = 0;
                this.img = this.idleFrames[this.currentFrame];

                this.idleRepeat = 3;
                this.startIdleTimer();
            },
            startIdleTimer() {
                this.currentFrame = 0;
                this.idleTimer = this.regTimerDefault(250, () => {
                    this.img = this.idleFrames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.idleFrames.length){
                        this.currentFrame = 0;
                        this.idleRepeat--;
                        if(this.idleRepeat == 0){
                            this.unregTimer(this.idleTimer);
                            this.startDrinkingTimer();
                        }
                    }
                })
            },
            startDrinkingTimer() {
                this.currentFrame = 0;
                this.drinkingTimer = this.regTimerDefault(100, () => {
                    this.img = this.drinkingFrames1[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.drinkingFrames1.length){
                        //this.currentFrame = 0;
                        this.unregTimer(this.drinkingTimer);
                        this.idleRepeat = 3;
                        this.startIdleTimer();
                    }
                })
            }
        }), 4)
    }
}