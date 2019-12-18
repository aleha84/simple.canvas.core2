class Demo9WaitingScene extends Scene {
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
        if(this.bgImg)
            this.backgroundRenderImage(this.bgImg);
        else 
            this.backgroundRenderDefault('#030712');
    }

    start(){

        this.bgImg = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('#030712');
            hlp.rect(0,0,size.x, size.y);

            let dHeight = 50;
            let dChange = easing.createProps(dHeight, 1, 0, 'quad', 'out');
            for(let i = 0; i <= dHeight; i++){
                dChange.time = i;
                let a = fast.r(easing.process(dChange),1);
                hlp.setFillColor(`rgba(0,0,0, ${a})`).rect(0,i,size.x, 1);
            }

            dChange = easing.createProps(dHeight, 0, 0.2, 'quad', 'in');
            for(let i = 0; i <= dHeight; i++){
                dChange.time = i;
                let a = fast.r(easing.process(dChange),2);
                hlp.setFillColor(`rgba(21,49,127, ${a})`).rect(0,i+75,size.x, 1);
            }

        })

        //this.backgroundRender();

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

        this.car = this.addGo(new GO({
            position: new V2(-27,264),
            size: new V2(200,200),
            init() {
                this.carShadow = this.addChild(new GO({
                    position: new V2(45,21),//new V2(30,18),
                    size: new V2(100,25),
                    img: PP.createImage(Demo9WaitingScene.models.car1Shadow)
                }))
                this.car = this.addChild(new GO({
                    position: new V2(),
                    size: new V2(50,25),
                    img: PP.createImage(Demo9WaitingScene.models.car1)
                }))

                //this.img = PP.createImage(Demo9WaitingScene.models.car1)
                this.initialPosition = this.position.clone();
                this.originalSize = this.car.size.clone();
                this.originalShadowSize = this.carShadow.size.clone();
                //this.direction = this.position.direction(new V2(200, 275))
                this.positionPoints = [];
                this.shadowPositionPoints = [];
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});

                    this.positionPoints = pp.lineV2(this.position, new V2(290, 270));
                    this.shadowPositionPoints = pp.lineV2(new V2(30,16), new V2(50, 21.5));
                })
                
                //this.speed = 1;

                this.time = 20;
                this.positionIndexChange = easing.createProps(this.time, 0, this.positionPoints.length, 'linear', 'base')
                this.shadowPositionIndexChange = easing.createProps(this.time, 0, this.shadowPositionPoints.length, 'linear', 'base')
                this.sizeYMul = easing.createProps(this.time, 1, 1.7, 'linear', 'base')
                this.sizeXMul = easing.createProps(this.time, 1, 2.25, 'linear', 'base')
                this.currentTime = 0;
                this.delayCounter = 0;

                this.timer = this.regTimerDefault(30, () => {
                    if(this.delayCounter-- > 0)
                        return;

                    this.isVisible = true;
                    // this.position.add(this.direction.mul(this.speed), true)
                    
                    // if(this.position.x > this.parentScene.viewport.x + this.size.x/2){
                    //     this.position = this.initialPosition.clone();
                    // }
                    this.positionIndexChange.time = this.currentTime;
                    this.shadowPositionIndexChange.time = this.currentTime;
                    this.sizeYMul.time = this.currentTime;
                    this.sizeXMul.time = this.currentTime;

                    let pIndex = fast.r(easing.process(this.positionIndexChange))
                    let spIndex = fast.r(easing.process(this.shadowPositionIndexChange))
                    this.position = new V2(this.positionPoints[pIndex]);
                    this.carShadow.position = new V2(this.shadowPositionPoints[spIndex]);
                    let sizeXMul = easing.process(this.sizeXMul);
                    let sizeYMul = easing.process(this.sizeYMul);
                    this.car.size = new V2(this.originalSize.x*sizeXMul, this.originalSize.y*sizeYMul).toInt()
                    this.carShadow.size = new V2(this.originalShadowSize.x*sizeXMul, this.originalShadowSize.y*sizeYMul).toInt()

                    this.currentTime++;
                    //this.currentTime = 3
                    //this.currentTime = this.time*1/3;
                    //this.currentTime = this.time*2/3;
                    //this.currentTime = this.time/2;

                    if(this.currentTime > this.time){
                        this.currentTime = 0;
                        this.delayCounter = getRandomInt(100,200);
                        //this.isVisible = false;
                        this.position = this.initialPosition.clone();
                        this.car.size = this.originalSize.clone();
                        this.carShadow.size = this.originalShadowSize.clone();
                        this.positionIndexChange = easing.createProps(this.time, 0, this.positionPoints.length, 'linear', 'base')
                        this.shadowPositionIndexChange = easing.createProps(this.time, 0, this.shadowPositionPoints.length, 'linear', 'base')
                        this.sizeYMul = easing.createProps(this.time, 1, 1.7, 'linear', 'base')
                        this.sizeXMul = easing.createProps(this.time, 1, 2.25, 'linear', 'base')
                    }

                    this.needRecalcRenderProperties = true;


                })
            }
        }), 4)

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