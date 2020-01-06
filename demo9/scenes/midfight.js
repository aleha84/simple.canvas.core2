class Demo9MidFightScene extends Scene {
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
        //this.backgroundRenderDefault('#B78C0B');
        this.backgroundRenderImage(this.bgImg);
    }
    startSubScene3() {
        this.grass.forEach(g => g.isVisible = true);
    }
    start(){

        this.bgImg = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('#B78C0B').rect(0,0,size.x, size.y);
            hlp.setFillColor('#AD850C')
            for(let i = 0; i < 100; i++){
                hlp.rect(getRandomInt(0,size.x), getRandomInt(0,size.y), getRandomInt(5,20), 1)
            }
        })

        this.knightSize = new V2(50,30);

        this.knight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.knightSize,
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.knightIdle)
            }
        }), 1)


        this.addGo(new GO({
            position: new V2(40, 80),
            size: new V2(25,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.rock1);
            }
        }), 2)

        this.addGo(new GO({
            position: new V2(150, 120),
            size: new V2(25,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.rock2);
            }
        }), 2)

        this.addGo(new GO({
            position: new V2(50, 170),
            size: new V2(25,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.rock2);
            }
        }), 2)

        this.addGo(new GO({
            position: new V2(170, 240),
            size: new V2(25,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.rock1);
            }
        }), 240)
        
        // this.addGo(new GO({
        //     position: new V2(110, 210),
        //     size: new V2(30,20),
        //     init() {
        //         this.img = PP.createImage(Demo9MidFightScene.models.grass4);
        //     }
        // }), 2)

        this.grassItemsImg = Demo9MidFightScene.models.grassItems.map(model => PP.createImage(model));
        this.grassItemSize = new V2(19,15)

     

        // this.addGo(new GO({
        //     position: new V2(100,20),
        //     size: new V2(200,60),
        //     init() {
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             let h = 16;
        //             let cy = 0;
        //             let xShift = false;
        //             for(let y = 0; y < size.y; y+=3){
        //                 for(let x = 0; x < fast.r(size.x/this.parentScene.grassItemSize.x); x++){
        //                     let c = this.parentScene.grassItemsImg[getRandomInt(0, this.parentScene.grassItemsImg.length-1)];
        //                         if(isArray(c)) {
        //                             c = c[0];
        //                         }

        //                     ctx.drawImage(c,
        //                      this.parentScene.grassItemSize.x*x + (xShift ? 2 : 0), y) //(xShift ? fast.r(-this.parentScene.grassItemSize.x/2) : 0)
        //                 }

        //                 xShift=!xShift;
        //             }
        //         })
        //     }
        // }), 3)

        let xShift = false;
        this.grass = [];
        for(let y = 220; y < this.viewport.y; y+=3){
            for(let x = 0; x < fast.r(this.viewport.x/this.grassItemSize.x); x++){

                this.grass[this.grass.length] = this.addGo(new GO({
                    position: new V2(this.grassItemSize.x*x + (xShift ? 2 : 0),y),
                    size: this.grassItemSize,
                    imgFrames: this.grassItemsImg[getRandomInt(0, this.grassItemsImg.length-1)],
                    xShift,
                    //isVisible: false,
                    isVisible: true,
                    init() {
                        this.currentFrame = 0;
                        this.img = isArray(this.imgFrames) ? this.imgFrames[this.currentFrame] : this.imgFrames

                        if(isArray(this.imgFrames))
                            this.shake();
                    },
                    shake() {
                        this.timer = this.regTimerDefault(200, () => {
                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                        
                    }
                }), y)

                // ctx.drawImage(this.grassItemsImg[getRandomInt(0, this.grassItemsImg.length-1)],
                //     this.grassItemSize.x*x + (xShift ? 2 : 0), y) 
            }

            xShift=!xShift;
        }

        for(let y = 0; y < 30; y+=3){
            for(let x = 0; x < fast.r(this.viewport.x/this.grassItemSize.x); x++){

                this.grass[this.grass.length] = this.addGo(new GO({
                    position: new V2(this.grassItemSize.x*x + (xShift ? 2 : 0),y),
                    size: this.grassItemSize,
                    imgFrames: this.grassItemsImg[getRandomInt(0, this.grassItemsImg.length-1)],
                    xShift,
                    //isVisible: false,
                    isVisible: true,
                    init() {
                        this.currentFrame = 0;
                        this.img = isArray(this.imgFrames) ? this.imgFrames[this.currentFrame] : this.imgFrames

                        if(isArray(this.imgFrames))
                            this.shake();
                    },
                    shake() {
                        this.timer = this.regTimerDefault(200, () => {
                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                        
                    }
                }), y)

                // ctx.drawImage(this.grassItemsImg[getRandomInt(0, this.grassItemsImg.length-1)],
                //     this.grassItemSize.x*x + (xShift ? 2 : 0), y) 
            }

            xShift=!xShift;
        }

        this.enemyImg = PP.createImage(Demo9MidFightScene.models.enemyIdle)
        this.enemy1 = this.addGo(new GO({
            position: new V2(40, 270),
            size: new V2(50,30),
            img: this.enemyImg
            // init() {
            //     //
            // }
        }), 270)

        this.enemy2 = this.addGo(new GO({
            position: new V2(90, 245),
            size: new V2(50,30),
            img: this.enemyImg
            // init() {
            //     //
            // }
        }), 245)

        this.enemy3 = this.addGo(new GO({
            position: new V2(130, 255),
            size: new V2(50,30),
            img: this.enemyImg
            // init() {
            //     //
            // }
        }), 255)

        this.enemy4 = this.addGo(new GO({
            position: new V2(165, 265),
            size: new V2(50,30),
            img: this.enemyImg
            // init() {
            //     //
            // }
        }), 265)

        return;
        this.subScene1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            isVisible: false,
            images: {
                bg: PP.createImage(Demo9MidFightScene.models.swordBg),
                sword: PP.createImage(Demo9MidFightScene.models.swordModel),
                dropFrames: PP.createImage(Demo9MidFightScene.models.swordBloodDropAnimation)
            },
            init() {
                this.originalSizes = new V2(300, 300);

                this.currentX = 100;
                this.swCurrentX = 100;
                this.xChange = easing.createProps(100, 100, 0, 'quad', 'inOut', function() { 
                    this.unregTimer(this.timer); console.log('timer removed');
                    
                    this.addChild(new GO({
                        position: new V2(-12,140),
                        size: new V2(15,20),
                        frames: this.images.dropFrames,
                        init() {
                            this.currentFrame = 0;
                            this.delayCounter = 0;
                            this.removeCounter = 3;
                            this.dropTimer = this.regTimerDefault(50, () => {
                                if(this.delayCounter > 0){
                                    this.delayCounter--;
                                    return;
                                }

                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.removeCounter--;
                                    if(this.removeCounter > 0){
                                        this.currentFrame = 0;
                                        this.delayCounter = 20;
                                    }
                                    else {
                                        this.parent.parentScene.startSubScene3();
                                        this.parent.setDead();
                                    }
                                }
    
                                this.img = this.frames[this.currentFrame];
                            })
                        }
                    }))
                    
                })
                this.swXChange = easing.createProps(100, 100, -50, 'quad', 'inOut', )
                this.createImage();
                
            },
            startDelay() {
                this.isVisible = true;
                this.delayTimer = this.registerTimer(createTimer(400, () => {
                    this.unregTimer(this.delayTimer);
                    this.delayTimer = undefined;
                    this.startAnimation();
                }, this, false));
            },
            startAnimation() {
                this.timer = this.regTimerDefault(30, () => {
                    easing.commonProcess({context: this, targetpropertyName: 'currentX', propsName: 'xChange', round: false, callbacksUseContext: true });
                    easing.commonProcess({context: this, targetpropertyName: 'swCurrentX', propsName: 'swXChange', round: false });
                    this.createImage();
                })
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.images.bg,this.currentX/2, 0,size.x, size.y, 0,0,size.x, size.y)
                    
                    ctx.drawImage(this.images.sword,this.swCurrentX, 0,size.x, size.y, 0,0,size.x, size.y)
                })
            }
        }), 500)

            this.subScene2 = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport,
                images: {
                    bg: createCanvas(this.viewport, (ctx, size, hlp) => {
                        hlp.setFillColor('#f6f1de').rect(0,0,size.x, size.y)
                        hlp.setFillColor('#FFF9EA').rect(0,0, size.x, 30).rect(0,31,size.x, 1).rect(0,33,size.x, 1).rect(0,36,size.x, 1);
                        // for(let i = 31; i<48;i+=2)
                        //     hlp.rect(0,i, size.x, 1)
                        hlp.setFillColor('#eae9d5').rect(0,100, size.x, 200)
                        hlp.setFillColor('#f6f1de').rect(0,101,size.x, 1).rect(0,103,size.x, 1).rect(0,106,size.x, 1)
                        // for(let i = 100; i<115;i+=2)
                        //     hlp.rect(0,i, size.x, 1)

                        hlp.setFillColor('#D6D5C5').rect(0, 160, size.x, 100) // #
                        hlp.setFillColor('#eae9d5').rect(0, 161, size.x, 1).rect(0, 163, size.x, 1).rect(0, 165, size.x, 1)

                        hlp.setFillColor('#8c753f').rect(0,175, size.x, 200)
                        for(let x = 0; x < size.x; x++){
                            hlp.rect(x, 175-getRandomInt(0,2), 1, 2);
                        }

                        hlp.setFillColor('#a88d4a').rect(0,185, size.x, 200)
                        for(let x = 0; x < size.x; x++){
                            hlp.rect(x, 185-getRandomInt(0,4), 1, 4);
                        }

                        hlp.setFillColor('#ddba60').rect(0,200, size.x, 100)
                        for(let x = 0; x < size.x; x++){
                            hlp.rect(x, 200-getRandomInt(0,6), 1, 6);
                        }

                        hlp.setFillColor('#dcad33').rect(0,220, size.x, 100)
                        for(let x = 0; x < size.x; x++){
                            hlp.rect(x, 220-getRandomInt(0,8), 1, 8);
                        }
                    }),
                    helmet: PP.createImage(Demo9MidFightScene.models.helmModel)
                },
                init() {
                    //[[-10, 0], [0,-8], [-8,0], [0,-6], [-6, 0], [0, -4], [-4, 0]]
                    this.currentY = 0;
                    let count = 4;
                    let yClampChange = easing.createProps(count, -6, -2, 'quad', 'inOut');
                    this.yClamps = []
                    for(let i = 0; i <=count; i++){
                        
                        yClampChange.time = i;
                        let y = fast.r(easing.process(yClampChange));
                        this.yClamps.push([0, y])
                        this.yClamps.push([y,0])
                    }

                    // this.addChild(new GO({
                    //     position: new V2(-66,-21),
                    //     size: new V2(6,2),
                    //     img1: createCanvas(new V2(6,2), (ctx, size, hlp) => {
                    //         hlp.setFillColor('rgba(255,255,255,0.3)').dot(0,1).dot(1,1).dot(2,1).dot(2,0).dot(5,0);
                    //         hlp.setFillColor('rgba(255,255,255,0.65)').dot(3,0).dot(4,0);
                    //     }),
                    //     img2: createCanvas(new V2(6,2), (ctx, size, hlp) => {
                    //         hlp.setFillColor('rgba(255,255,255,0.3)').dot(0,0).dot(1,0).dot(2,0).dot(5,0);
                    //         hlp.setFillColor('rgba(255,255,255,0.65)').dot(3,0).dot(4,0);
                    //     }),
                    //     init() {
                    //         this.toggle = false;
                    //         this.originalPosition = this.position.clone();
                    //         this.img = this.img1;
                    //         this.timer = this.regTimerDefault(150, () => {
                    //             this.toggle = !this.toggle;
                    //             // this.position.y = this.originalPosition.y+(this.toggle ? 1 : 0);

                    //             // this.needRecalcRenderProperties = true;
                    //             this.img = this.toggle ? this.img2 : this.img1;
                    //         })
                    //     }
                    // }))

                    this.timer = this.regTimerDefault(50, () => {
                        easing.commonProcess({context: this, targetpropertyName: 'currentY', propsName: 'yChange', round: false, callbacksUseContext: true, removePropsOnComplete: true });
                        if(this.yChange == undefined){
                            if(this.yClamps.length){
                                let yClamp = this.yClamps.shift();
                                console.log(yClamp);
                                this.yChange = easing.createProps(15, yClamp[0],yClamp[1], 'quad', 'inOut')
                            }
                            else {
                                this.unregTimer(this.timer);
                                this.parentScene.subScene1.startDelay();
                                this.setDead();
                            }
                            
                        }
                        this.createImage();
                    })
                   
                   this.createImage();
                },
                createImage() {
                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.images.bg,0,this.currentY)
                        
                        ctx.drawImage(this.images.helmet,0,0)
                    })
                }
            }), 500)
    }
}