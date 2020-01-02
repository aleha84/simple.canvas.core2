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

        // this.grass = this.addGo(new GO({
        //     position: this.sceneCenter.add(new V2(20,20)),
        //     size: new V2(20,20),
        //     init() {
        //         this.img = PP.createImage(Demo9MidFightScene.models.grass)
        //     }
        // }), 2)

        // this.grass2Img = PP.createImage(Demo9MidFightScene.models.grass2);
        // this.addGo(new GO({
        //     position: new V2(100, 180),
        //     size: new V2(30,20),
        //     init() {
        //         this.img = this.parentScene.grass2Img;
        //     }
        // }), 2)

        // this.addGo(new GO({
        //     position: new V2(80, 190),
        //     size: new V2(30,20),
        //     init() {
        //         this.img = PP.createImage(Demo9MidFightScene.models.grass3);
        //     }
        // }), 2)

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
        //     position: new V2(100,250),
        //     size: new V2(200,100),
        //     init() {
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             let h = 16;
        //             let cy = 0;
        //             let xShift = false;
        //             for(let y = 0; y < size.y; y+=3){
        //                 for(let x = 0; x < fast.r(size.x/this.parentScene.grassItemSize.x); x++){
        //                     ctx.drawImage(this.parentScene.grassItemsImg[getRandomInt(0, this.parentScene.grassItemsImg.length-1)],
        //                      this.parentScene.grassItemSize.x*x + (xShift ? 2 : 0), y) //(xShift ? fast.r(-this.parentScene.grassItemSize.x/2) : 0)
        //                 }

        //                 xShift=!xShift;
        //             }
        //         })
        //     }
        // }), 3)

        let xShift = false;
        for(let y = 220; y < this.viewport.y; y+=3){
            for(let x = 0; x < fast.r(this.viewport.x/this.grassItemSize.x); x++){

                this.addGo(new GO({
                    position: new V2(this.grassItemSize.x*x + (xShift ? 2 : 0),y),
                    size: this.grassItemSize,
                    imgFrames: this.grassItemsImg[getRandomInt(0, this.grassItemsImg.length-1)],
                    xShift,
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
    }
}