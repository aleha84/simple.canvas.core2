class Demo9MidFightScene extends Scene {
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
        //this.backgroundRenderDefault('#B78C0B');
        this.backgroundRenderImage(this.bgImg);
    }
    startSubScene3() {
        this.grass.forEach(g => g.isVisible = true);

        this.delayTimer = this.registerTimer(createTimer(8000, () => {
            this.unregTimer(this.delayTimer);
            this.delayTimer = undefined;
            this.fadeOuter.fadeIn(() => {});
        }, this, false));
    }
    start(){

        this.bgImg = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('#B78C0B').rect(0,0,size.x, size.y);
            hlp.setFillColor('#AD850C')
            for(let i = 0; i < 100; i++){
                hlp.rect(getRandomInt(0,size.x), getRandomInt(0,size.y), getRandomInt(5,20), 1)
            }

            let drops = [[80,140],[75,155], [76,150],[75,153],[76,156],[74,157],[75,158],[77,145], [78,143], 
            [100.3125, 131.25],[102.5, 131.5625],[107.5, 133.125],[110.9375, 134.375],[115.9375, 135.625],
            [120.3125, 135.9375],[91.25, 109.375],[90.625, 109.6875],[85.625, 112.5],[78.125, 116.25],[70.625, 118.75],[64.6875, 118.4375],
            [78.75, 116.25],[90.3125, 118.4375],[98.4375, 119.375],[103.75, 120.625],[110.625, 122.5],[118.4375, 124.0625],
            [86.5625,102.1875],[89.375,102.1875],[92.1875,103.125],[94.0625,105],[86.25,119.375],[82.8125,120.625],[79.375,122.8125],
            [75.9375,125.9375],[142.5,126.875],[139.375,126.5625],[136.5625,125.3125],[127.8125,122.8125],[125, 21.875],
        [76.5625,148.4375],[76.5625,146.875],[81.875,138.125],[83.4375,135.625],[84.6875,134.375],[85.625,131.5625],[85.3125,129.0625],
        [85.9375,124.375],[87.5,122.1875],[88.125,120.3125],[89.6875,116.25],[90.3125,114.0625],[90.9375,112.8125],[93.75,108.125],
    [109.6875, 110.625],[111.25, 110.3125],[112.8125, 110.3125],[115.625, 111.25],[118.4375, 112.5],[120.625, 114.0625],[121.875, 115.625],[122.8125, 117.8125],[123.75, 120],
        ]
            hlp.setFillColor('rgba(216,26,45, 0.75)')//.dot(80,140).dot(75,155).dot(76,150)
            drops.forEach(d => hlp.dot(fast.r(d[0]), fast.r(d[1])))

            hlp.rect(90, 130, 5, 1).rect(95, 131, 3,1)
        })

        this.knightSize = new V2(50,30);

        this.knight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.knightSize,
            init() {
                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {

                        this.imgFrames = PP.createImage(Demo9MidFightScene.models.knightIdleFrames)
                        this.currentFrame = 0;

                        this.timer = this.regTimerDefault(1000, () => {
                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                    }
                }))

                this.head = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {

                        this.imgFrames = PP.createImage(Demo9MidFightScene.models.headRotationFrames)
                        this.currentFrame = 0;
                        this.delayCounter = 0;
                        this.timer = this.regTimerDefault(150, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                return;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.delayCounter = getRandomInt(5,10);
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                    }
                }))

                this.sword = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {

                        this.imgFrames = PP.createImage(Demo9MidFightScene.models.swordAnimationFrames)
                        this.currentFrame = 0;
                        this.delayCounter = 0;
                        this.timer = this.regTimerDefault(150, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                return;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.delayCounter = getRandomInt(20,30);
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                    }
                }))

                this.shield = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {

                        this.imgFrames = PP.createImage(Demo9MidFightScene.models.shieldAnimationFrames)
                        this.currentFrame = 0;
                        this.delayCounter = 0;
                        this.timer = this.regTimerDefault(150, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                return;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.delayCounter = getRandomInt(20,30);
                                this.currentFrame = 0;
                            }

                            this.img = this.imgFrames[this.currentFrame];
                        }) 
                    }
                }))
                //this.img = PP.createImage(Demo9MidFightScene.models.knightIdle)
                
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
            position: new V2(100, 100),
            size: new V2(50,30),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.enemyDead);
            }
        }), 3)

        this.addGo(new GO({
            position: new V2(150, 140),
            size: new V2(55,33),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.enemyDead2);
            }
        }), 3)

        this.addGo(new GO({
            position: new V2(50, 130),
            size: new V2(50,30),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.enemyDead);
            }
        }), 3)

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
                    isVisible: false,
                    //isVisible: true,
                    init() {
                        this.currentFrame = 0;
                        this.img = isArray(this.imgFrames) ? this.imgFrames[this.currentFrame] : this.imgFrames

                        if(isArray(this.imgFrames))
                            this.shake();
                    },
                    shake() {
                        this.delayCounter = getRandomInt(5,10);
                        this.timer = this.regTimerDefault(200, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                return;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.currentFrame = 0;
                                if(getRandomBool()){
                                    this.delayCounter = getRandomInt(5,10);
                                }
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
                    isVisible: false,
                    //isVisible: true,
                    init() {
                        this.currentFrame = 0;
                        this.img = isArray(this.imgFrames) ? this.imgFrames[this.currentFrame] : this.imgFrames

                        if(isArray(this.imgFrames))
                            this.shake();
                    },
                    shake() {
                        this.delayCounter = getRandomInt(5,10);
                        this.timer = this.regTimerDefault(200, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                return;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == this.imgFrames.length){
                                this.currentFrame = 0;
                                if(getRandomBool()){
                                    this.delayCounter = getRandomInt(5,10);
                                }
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
        this.enemyFrames = PP.createImage(Demo9MidFightScene.models.enemyIdleFrames)
        this.enemyP = [new V2(40, 270), new V2(90, 245), new V2(130, 255), new V2(165, 265)]
        this.enemies = this.enemyP.map(p => this.addGo(new GO({
            position: p,
            size: new V2(50,30),
            img: this.enemyImg,
            imgFrames:this.enemyFrames,
            init() {
                this.currentFrame= 0;
                this.timer = this.regTimerDefault(1000, () => {

                    this.currentFrame++;
                    if(this.currentFrame == this.imgFrames.length){
                        this.currentFrame = 0;
                    
                    }

                    this.img = this.imgFrames[this.currentFrame];
                }) 
            }
        }), p.y))


        this.fadeOuter = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible: true,
            init() {
                this.frames = [];
                this.count = 10;
                this.aChange = easing.createProps(this.count, 1, 0, 'quad', 'inOut');
                for(let i = 0; i <= this.count; i++){
                    this.aChange.time = i;
                    let a = fast.r(easing.process(this.aChange),2);

                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(0,0,size.x, size.y);
                    });
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
            },
            fadeIn(callback) {
                this.isVisible=  true
                this.currentFrame = 10;
                this.fadeInTimer = this.regTimerDefault(30, () => {
                    this.currentFrame--;
                    if(this.currentFrame <= 0){
                        this.currentFrame = 0;
                        this.unregTimer(this.fadeInTimer);
                        callback();
                        //this.isVisible = false;
                    }

                    this.img = this.frames[this.currentFrame];
                })
            },
            fadeOut(callback) {
                this.isVisible=  true
                this.currentFrame = 0;
                this.fadeOutTimer = this.regTimerDefault(30, () => {
                    this.currentFrame++;
                    if(this.currentFrame >= this.frames.length){
                        this.currentFrame = this.frames.length;
                        this.unregTimer(this.fadeOutTimer);
                        callback();
                        this.isVisible = false;
                    }

                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 501)

        this.delayTimer = this.registerTimer(createTimer(2000, () => {
            this.unregTimer(this.delayTimer);
            this.delayTimer = undefined;
            this.fadeOuter.fadeOut(() => {
                this.subScene2.startAnimation();
            })
        }, this, false));

        
        //return;
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
                                        this.parent.parentScene.fadeOuter.fadeIn(() => {
                                            this.parent.parentScene.startSubScene3();
                                            this.parent.parentScene.fadeOuter.fadeOut(() => {})
                                            this.parent.setDead();

                                            
                                        })
                                        
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
                    helmet: PP.createImage(Demo9MidFightScene.models.helmModel, {exclude: ['body']}),
                    body: PP.createImage(Demo9MidFightScene.models.helmModel, {renderOnly: ['body']})
                },
                init() {
                    //[[-10, 0], [0,-8], [-8,0], [0,-6], [-6, 0], [0, -4], [-4, 0]]
                    this.currentY = 0;
                    //let count = 4;
                    let count = 3;
                    let yClampChange = easing.createProps(count, -6, -4, 'quad', 'inOut');
                    this.yClamps = []
                    for(let i = 0; i <=count; i++){
                        
                        yClampChange.time = i;
                        let y = fast.r(easing.process(yClampChange));
                        this.yClamps.push([0, y])
                        this.yClamps.push([y,0])
                    }


                    
                   
                   this.createImage();
                },
                startAnimation() {
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
                                this.parentScene.fadeOuter.fadeIn(() => {
                                    this.setDead();
                                    this.parentScene.subScene1.startDelay();
                                    this.parentScene.fadeOuter.fadeOut(() => {
                                        
                                    })
                                })
                                
                                
                                
                            }
                            
                        }
                        this.createImage();
                    })
                },
                createImage() {
                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.images.bg,0,this.currentY)
                        ctx.drawImage(this.images.body,0,-this.currentY/2)
                        ctx.drawImage(this.images.helmet,0,0)
                    })
                }
            }), 500)
    }
}