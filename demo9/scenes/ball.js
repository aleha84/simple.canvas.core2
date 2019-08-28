class BallScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    getPixels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;
            let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] 

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        return pixels;
    }

    start(){
        this.maxY = 400;

        this.delayTimer = this.registerTimer(createTimer(2000, () => {
            this.unregTimer(this.delayTimer);
            this.delayTimer = undefined;
            
            this.ball = this.addGo(new BallGO({
                position: new V2(this.sceneCenter.x, -100),
                size: new V2(160, 160),
                scale: 4,
                maxY: this.maxY,
                // imgSize: new V2(80,80),
                // elipsisRadius: new V2(20,20)
            }),10)
    

        }, this, false));

        
        this.lightPart = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.maxY + 62),
            size: new V2(10, 2),
            isVisible: false,
            maxSizeX: 125,
            updateSizeX(sizeX) {
                this.parts[0].size.x = sizeX;
                this.parts[0].needRecalcRenderProperties = true;
                this.parts[1].size.x = fast.r(sizeX*0.8);
                this.parts[1].needRecalcRenderProperties = true;
                this.parts[2].size.x = fast.r(sizeX*0.65);
                this.parts[2].needRecalcRenderProperties = true;
            },
            init(){
                this.parts = [
                    this.addChild(new GO({
                        position: new V2(0,0),
                        size: new V2(1,2),
                        img: createCanvas(new V2(11, 1), (ctx,size, hlp) => {
                            hlp
                                .setFillColor('#333333').rect(0,0,size.x, 1)
                                .setFillColor('#636363').rect(3,0,size.x-6, 1)
                                .setFillColor('#828282').rect(5,0,size.x-10, 1)
            
                        })
                    })),
                    this.addChild(new GO({
                        position: new V2(0,2),
                        size: new V2(1,2),
                        img: createCanvas(new V2(11, 1), (ctx,size, hlp) => {
                            hlp
                                .setFillColor('#333333').rect(0,0,size.x, 1)
                                .setFillColor('#636363').rect(3,0,size.x-6, 1)
            
                        })
                    })),
                    this.addChild(new GO({
                        position: new V2(0,4),
                        size: new V2(1,2),
                        img: createCanvas(new V2(11, 1), (ctx,size, hlp) => {
                            hlp
                                .setFillColor('#333333').rect(0,0,size.x, 1)
            
                        })
                    }))
                ];

                this.updateSizeX(10);
            }
        }),1)
    }
}

class BallGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            imgCache: [],
            maxY: 400,
            minY: 100
        }, options)

        super(options);
    }

    init() {
        this.midY = this.minY + (this.maxY - this.minY)/2;
        this.bounceCounter = 0;
        this.bounceCounterMax = 5;
        if(this.scale){
            this.imgSize = this.size.divide(this.scale).toInt();
            this.elipsisRadius = this.imgSize.divide(4).toInt();
        }
        else {
            this.scale = this.size.x / this.imgSize.x;
            this.elipsisRadius = this.elipsisRadius || new V2(this.imgSize.x/2, this.imgSize.y/2);
        }
        
        this.elipsisRadiusOrigin = this.elipsisRadius.clone();
        this.elipsisCenter = new V2(this.imgSize.x/2, this.imgSize.y/2);

        this.body = this.addChild(new GO({
            position: new V2(),
            size: this.size,
        }));

        this.createImg();
        this.toPixels();

        this.timer = this.regTimerDefault(15, () => {
            if(this.pixelsMove != undefined){
                if(this.pixelsMove > 0){
                    this.pixels.forEach(p => {
                        if(!p.alive)
                            return;
    
                        p.position.add(p.speed, true);
                        if(p.targetY){
                            if(p.position.y > p.targetY){
                                p.position.y = p.targetY;
                                p.bounceCount--;
                                if(p.bounceCount != 0){
                                    p.speed.y*=-1;
                                    p.speed.y/=4;
                                }
                                else {
                                    p.speed = new V2();
                                    p.addEffect(new FadeOutEffect({ effectTime: getRandomInt(250,500), updateDelay: 30, initOnAdd: true, setParentDeadOnComplete: true, completeCallback: () => {
                                        this.pixelsMove--;
                                    } }));
                                }
                                
                            }
                        }
                        p.speed.y+=p.speedYChange;
                        p.needRecalcRenderProperties = true;
                    })
                }
                else {
                    this.pixelsMove = undefined;
                    console.log('Pixels over');
                }
            }
            


            if(this.rxChange){
                this.elipsisRadius.x = fast.r(easing.process(this.rxChange));
                this.rxChange.time++;
                if(this.rxChange.time > this.rxChange.duration){
                    this.rxChange = undefined;
                }
            }

            if(this.ryChange){
                this.elipsisRadius.y = fast.r(easing.process(this.ryChange));
                this.ryChange.time++;
                if(this.ryChange.time > this.ryChange.duration){
                    let onComplete = this.ryChange.onComplete;
                    this.ryChange = undefined;
                    if(onComplete){
                        onComplete();
                    }
                }
            }

            if(this.yChange){
                this.position.y = easing.process(this.yChange);
                this.needRecalcRenderProperties = true;
                this.yChange.time++;

                let onChange = this.yChange.onChange;
                if(onChange){
                    onChange();
                }
                if(this.yChange.time > this.yChange.duration){   
                    let onComplete = this.yChange.onComplete;
                    this.yChange = undefined;
                    if(onComplete){
                        onComplete();
                    }            
                }
            }

            if(this.body)
                this.createImg();
        });

        this.startSequence();
    }

    startSequence() {
        this.script.items = [
            function() {
                this.yChange = easing.createProps(20, this.position.y, this.maxY, 'quad', 'in');
                this.yChange.onChange = () => {
                    if(this.position.y > this.parentScene.viewport.y/2){
                        let lp = this.parentScene.lightPart;
                        lp.isVisible = true;
                        lp.updateSizeX( lp.maxSizeX*((this.position.y-250)/ (this.maxY-this.parentScene.viewport.y/2)));
                        //lp.needRecalcRenderProperties = true;

                    }
                    // if(this.yChange.time == 20){
                    //     //this.processScript()
                    // }
                };
                this.yChange.onComplete = () => this.processScript()
            },
            function() {
                this.yChange = easing.createProps(5, this.position.y, this.position.y + 40, 'quad', 'out');
                // this.yChange.onChange = () => {

                // }
                this.ryChange = easing.createProps(5, this.elipsisRadius.y, fast.r(this.elipsisRadius.y/3), 'quad', 'in');
                this.ryChange.onComplete = () => this.processScript()
                this.rxChange = easing.createProps(5, this.elipsisRadius.x, fast.r(this.elipsisRadius.x*1.5), 'quad', 'in');
            },
            //this.addProcessScriptDelay(100),
            function() {
                this.ryChange = easing.createProps(5, this.elipsisRadius.y, this.elipsisRadiusOrigin.y, 'quad', 'out');
                this.rxChange = easing.createProps(5, this.elipsisRadius.x, this.elipsisRadiusOrigin.x, 'quad', 'out');
                this.yChange = easing.createProps(20, this.position.y, fast.r(this.minY + (this.midY - this.minY)*this.bounceCounter/this.bounceCounterMax), 'quad', 'out');
                if(this.bounceCounter == this.bounceCounterMax){
                    this.yChange.onChange = () => {
                        let lp = this.parentScene.lightPart;
                        if(this.position.y < this.parentScene.viewport.y/2){
                            
                            lp.isVisible = false;
                        }
                        else {
                            lp.updateSizeX(lp.maxSizeX*((this.position.y-250)/ (this.maxY-this.parentScene.viewport.y/2)));
                            //lp.needRecalcRenderProperties = true;
                        }

                        if(this.yChange.time == 5){
                            //this.processScript()
                            this.removeChild(this.body);
                        this.body = undefined;
                        
                            this.fallPixels();
                        }
                    };
                    this.yChange.onComplete = () => {
                        this.parentScene.lightPart.isVisible = false;
                        let targetY = this.maxY - this.position.y + this.size.y/3;
                        this.pixels.forEach(pixel => {
                            pixel.targetY = targetY;
                        })
                        //this.fallPixels();
                        // this.removeChild(this.body);
                        // this.body = undefined;
                        //this.fallPixels();
                        //this.processScript()
                    }
                }
                else {
                    this.yChange.onChange = () => {
                        let lp = this.parentScene.lightPart;
                        if(this.position.y < this.parentScene.viewport.y/2){
                            
                            lp.isVisible = false;
                        }
                        else {
                            lp.updateSizeX(lp.maxSizeX*((this.position.y-250)/ (this.maxY-this.parentScene.viewport.y/2)));
                            //lp.needRecalcRenderProperties = true;
                        }
                    }
                    this.yChange.onComplete = () => {
                        this.bounceCounter++;
                        this.startSequence();
                    }
                }
            },
            // function() {
            //     this.toPixels();
            //     this.processScript();
            // }
            // function() {
            //     this.startSequence();
            // },
            
        ];

        this.processScript();
    }

    toPixels() {
        let topLeft = new V2(-this.size.x/2, -this.size.y/2);
        let pixels = this.parentScene.getPixels(this.body.img, this.imgSize).map(p => {
            return {
                size: new V2(1,1).mul(this.scale),
                position: topLeft.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                color: p.color
            }
        });

        // this.removeChild(this.body);
        // this.body = undefined;

        this.pixels = [];

        pixels.forEach(pixel => {
            let pgo =  this.addChild(new GO({
                //renderValuesRound: true,
                isVisible: false,
                position: pixel.position,
                size: pixel.size,
                img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor(colors.rgbToString({value: pixel.color})).dot(0,0);
                })
            }))

            // pgo.addEffect(new FadeOutEffect({ effectTime: getRandomInt(500,1000), updateDelay: 30, initOnAdd: true, setParentDeadOnComplete: true, completeCallback: () => {
            //     this.pixelsMove--;
            //     //console.log('Pixels left: ' + this.pixelsMove);
            // } }));
            // pgo.speed = new V2((pgo.position.x/getRandom(50,100)), getRandom(-3,-2))
            // pgo.speedYChange = 0.1;

            this.pixels[this.pixels.length] = pgo;
        });

        //this.pixelsMove = this.pixels.length;
    }

    fallPixels() {
        this.pixelsMove = this.pixels.length;
        
        this.pixels.forEach(pixel => {
            pixel.isVisible = true;
            if(getRandomInt(0,5) != 0) {
                pixel.addEffect(new FadeOutEffect({ effectTime: getRandomInt(250,1000), updateDelay: 30, initOnAdd: true, setParentDeadOnComplete: true, completeCallback: () => {
                    this.pixelsMove--;
                    //console.log('Pixels left: ' + this.pixelsMove);
                } }));
            }
            else {
                pixel.targetY = 200;
                pixel.bounceCount = 3;
            }

            pixel.speed = new V2((pixel.position.x/getRandom(40,100)), getRandom(-5,-4))
            pixel.speedYChange = getRandom(0.1,0.2);
            
            pixel.position.add(pixel.speed, true);
            
        })
    }

    createImg(){
        let key = this.elipsisRadius.x*1000 + this.elipsisRadius.y;
        if(!this.imgCache[key]){
            this.imgCache[key] = createCanvas(this.imgSize, (ctx, size, hlp) => {
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                //hlp.setFillColor('#F2F2F2').elipsis(this.elipsisCenter, this.elipsisRadius);
                hlp.setFillColor('#D8D8D8').elipsis(this.elipsisCenter, this.elipsisRadius);
                //hlp.setFillColor('#E2E2E2').elipsis(this.elipsisCenter.add(this.elipsisRadius.mul(-0.15).toInt()), this.elipsisRadius.mul(0.85).toInt());
                // hlp.setFillColor('#EAEAEA').elipsis(this.elipsisCenter.add(this.elipsisRadius.mul(-0.25).toInt()), this.elipsisRadius.mul(0.65).toInt());
                // hlp.setFillColor('#F2F2F2').elipsis(this.elipsisCenter.add(this.elipsisRadius.mul(-0.4).toInt()), this.elipsisRadius.mul(0.4).toInt());
                hlp.setFillColor('#F2F2F2').elipsis(this.elipsisCenter.add(this.elipsisRadius.mul(-0.475).toInt()), this.elipsisRadius.mul(0.2).toInt());
                hlp.setFillColor('#ADADAD').strokeEllipsis(0, 100, 1, this.elipsisCenter, this.elipsisRadius.x-2, this.elipsisRadius.y-2);
                //hlp.setFillColor('#F2F2F2').strokeEllipsis(-45, 130, 1, this.elipsisCenter, this.elipsisRadius.x-1, this.elipsisRadius.y-1);
            })
        }

        this.body.img = this.imgCache[key];
    }
}