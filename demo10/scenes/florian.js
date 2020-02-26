class Demo10FlorianScene extends Scene {
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
        this.backgroundRenderDefault('#819188');
        //this.backgroundRenderImage(this.bgImg);
    }

    start(){

        //this.bgImg = PP.createImage(Demo10FlorianScene.models.bg);

        this.flower = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-10, 0)),
            size: this.viewport.clone(),
            init() {

                this.particles = this.addChild(new GO({
                    position: new V2(-60, -3),
                    size: new V2(60, 25),
                    init() {
                        this.frames = [];
                        let framesCount = 50;
                        let itemsCount = 25;

                        let particles = [];
                        let xChange = easing.createProps(framesCount-1, this.size.x, 0, 'quad', 'in');
                        let aChange = easing.createProps(framesCount-1, 1, 0, 'quad', 'in');
                        let xChanges = [];
                        let aChanges = [];
                        for(let f = 0; f < framesCount; f++){
                            xChange.time = f;
                            aChange.time = f;
                            xChanges[f] = fast.r(easing.process(xChange))
                            aChanges[f] = fast.r(easing.process(aChange),1)
                        }

                        for(let i = 0; i < itemsCount; i++){
                            let y = fast.r(getRandomGaussian(0, this.size.y));

                            particles[i] = {
                                y,
                                initialX: getRandomInt(0,10),
                                inititialIndex: getRandomInt(0, xChanges.length-1)
                            }
                        }

                        for(let f = 0; f < framesCount; f++){
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let i = 0; i < itemsCount; i++){
                                    let particle = particles[i];
    
                                    let currentIndex = particle.inititialIndex + f;
                                    if(currentIndex > (xChanges.length-1)){
                                        currentIndex-=xChanges.length;
                                    }
    
                                    let x = particle.initialX + xChanges[currentIndex];
                                    hlp.setFillColor(`rgba(255,255,0, ${aChanges[currentIndex]})`).dot(x, particle.y);
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
                }))

                this.particles2 = this.addChild(new GO({
                    position: new V2(-50, -3),
                    size: new V2(30, 50),
                    init() {
                        this.frames = [];
                        let framesCount = 50;
                        let itemsCount = 30;

                        let particles = [];
                        let xChange = easing.createProps(framesCount-1, this.size.x, 0, 'quad', 'in');
                        let aChange = easing.createProps(framesCount-1, 1, 0, 'quad', 'in');
                        let xChanges = [];
                        let aChanges = [];
                        for(let f = 0; f < framesCount; f++){
                            xChange.time = f;
                            aChange.time = f;
                            xChanges[f] = fast.r(easing.process(xChange))
                            aChanges[f] = fast.r(easing.process(aChange),1)
                        }

                        for(let i = 0; i < itemsCount; i++){
                            let y = fast.r(getRandomGaussian(0, this.size.y));

                            particles[i] = {
                                y,
                                initialX: getRandomInt(0,10),
                                inititialIndex: getRandomInt(0, xChanges.length-1)
                            }
                        }

                        for(let f = 0; f < framesCount; f++){
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let i = 0; i < itemsCount; i++){
                                    let particle = particles[i];
    
                                    let currentIndex = particle.inititialIndex + f;
                                    if(currentIndex > (xChanges.length-1)){
                                        currentIndex-=xChanges.length;
                                    }
    
                                    let x = particle.initialX + xChanges[currentIndex];
                                    hlp.setFillColor(`rgba(0,255,255, ${aChanges[currentIndex]})`).dot(x, particle.y);
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
                }))

                this.base = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        //this.img = PP.createImage(Demo10FlorianScene.models.flower)
                        this.tail = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            img: PP.createImage(Demo10FlorianScene.models.flower, { exclude: ['frontal', 'l4', 'l3', 'l2', 'l1'] })
                        }))

                        this.leafs = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: PP.createImage(Demo10FlorianScene.models.leafsFrames),
                            init() {
                                this.currentFrame = 0;
                                this.img = this.frames[this.currentFrame];

                                this.timer = this.regTimerDefault(152, () => {
                    
                                    this.img = this.frames[this.currentFrame];
                                    this.currentFrame++;
                                    if(this.currentFrame == this.frames.length){
                                        this.currentFrame = 0;

                                        // if(!this.redFrame){
                                        //     this.redFrame = this.addChild(new GO({
                                        //         position: new V2(),
                                        //         size: this.size,
                                        //         img: createCanvas(this.size, (ctx, size, hlp) => {
                                        //             hlp.setFillColor('red').strokeRect(0,0, size.x, size.x)
                                        //         })
                                        //     }));
                                        // }
                                        // else {
                                        //     this.removeChild(this.redFrame);
                                        //     this.redFrame = undefined;
                                        // }
                                    }
                                })
                            }
                        }))

                        this.frontal = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            img: PP.createImage(Demo10FlorianScene.models.flower, { renderOnly: ['frontal'] })
                        }))
                    }
                }))
                
                this.yChangeDirection = 1;
                this.yChangeMax = 4;
                this.yClamps = [this.position.y,this.position.y+this.yChangeMax];

                this.timer = this.regTimerDefault(100, () => {
                    if(!this.yChange){
                        this.yChangeDirection*=-1;

                        this.yChange = easing.createProps(20, this.yClamps[this.yChangeDirection > 0 ? 0 : 1], this.yClamps[this.yChangeDirection > 0 ? 1 : 0], 'quad', 'inOut');
                    }

                    
                    let y = fast.r(easing.process(this.yChange));
                    this.yChange.time++;
                    if(this.yChange.time > this.yChange.duration)
                        this.yChange = undefined;

                    this.position.y = y;
                    this.needRecalcRenderProperties = true;

                })
            }
        }), 5)

        let iceModel = Demo10FlorianScene.models.ice();
        iceModel.main.layers.forEach(l => {l.visible = true});

        this.frontalCloud = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 20)),
            size: this.viewport.clone(),
            init() {
                this.framesCount = 100;
                this.frames = [];
                let fcImg = PP.createImage(Demo10FlorianScene.models.frontalCloud)
                this.xChange = easing.createProps(this.framesCount-1, 0, -(this.size.x-1), 'linear', 'base');

                for(let f = 0; f < this.framesCount; f++){
                    this.xChange.time = f;
                    let xShift = fast.r(easing.process(this.xChange))
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(fcImg, xShift, 0);
                        ctx.drawImage(fcImg, xShift+size.x, 0)
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
        }), 10)

        this.farCloud = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -50)),
            size: this.viewport.clone(),
            init() {
                this.framesCount = 200;
                this.frames = [];
                let fcImg = PP.createImage(Demo10FlorianScene.models.farCloud)
                let imgSize = new V2(100,100)
                this.xChange = easing.createProps(this.framesCount-1, 0, -(imgSize.x-1), 'linear', 'base');

                for(let f = 0; f < this.framesCount; f++){
                    this.xChange.time = f;
                    let xShift = fast.r(easing.process(this.xChange))
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(fcImg, xShift, 0);
                        ctx.drawImage(fcImg, xShift+imgSize.x, 0)
                        ctx.drawImage(fcImg, xShift+imgSize.x*2, 0)
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
        }), 3)

        // this.iceFrontal = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.sceneCenter.clone(),
        //     init() {
        //         this.frames = [];

        //         this.framesCount = 400;
        //         this.iceImages = [
        //             PP.createImage(iceModel, { renderOnly: 'ice1' }),
        //             PP.createImage(iceModel, { renderOnly: 'ice2' }),
        //             PP.createImage(iceModel, { renderOnly: 'ice3' })
        //         ]

        //         this.itemSize = new V2(40,40)
        //         this.xChange = easing.createProps(this.framesCount-1, -this.itemSize.x/2, this.size.x+this.itemSize.x/2, 'linear', 'base');
        //         this.itemsHeight = 150;
                
        //         this.items = [
        //             { p: new V2(50, this.itemsHeight), img: this.iceImages[0] },
        //             { p: new V2(100, this.itemsHeight), img: this.iceImages[1] },
        //             { p: new V2(150, this.itemsHeight), img: this.iceImages[2] }
        //         ]

        //         for(let f = 0; f < this.framesCount; f++){
        //             this.xChange.time = f;
        //             let xShift = fast.r(easing.process(this.xChange))
                    
        //             this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
        //                 for(let i = 0; i < this.items.length; i++){
        //                     let item = this.items[i];
    
        //                     let p = item.p.add(this.itemSize.divide(2)).toInt();
        //                     p.x-=xShift;
        //                     if(p.x < -this.itemSize.x/2){
        //                         p.x += this.size.x+this.itemSize.x/2;
        //                     }
    
        //                     ctx.drawImage(item.img, p.x, p.y);
        //                 }
        //             })
                    
        //         }

        //         this.currentFrame = 0;
        //         this.img = this.frames[this.currentFrame];

        //         this.timer = this.regTimerDefault(15, () => {
    
        //             this.img = this.frames[this.currentFrame];
        //             this.currentFrame++;
        //             if(this.currentFrame == this.frames.length){
        //                 this.currentFrame = 0;
        //             }
        //         })
        //     }
        // }), 10)

        // this.ice = this.addGo(new GO({
        //     position: new V2(50,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice1' })
        //     }
        // }), 1)

        // this.ice2 = this.addGo(new GO({
        //     position: new V2(90,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice2' })
        //     }
        // }), 1)

        // this.ice3 = this.addGo(new GO({
        //     position: new V2(130,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice3' })
        //     }
        // }), 1)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                //this.img = PP.createImage(Demo10FlorianScene.models.bg)
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let i = 0; i < 500; i++){
                        hlp.setFillColor('rgba(0,0,0,0.025)').rect(getRandomInt(-10, size.x-10), fast.r(getRandomGaussian(0, size.y)), getRandomInt(1,10), 1)
                    }
                })

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let framesCount = 100;
                        let itemsCount = 500;
                        let items = [];
                        for(let i = 0;i< itemsCount; i++){
                            let inititalFrame = getRandomInt(0, framesCount-1);
                            let mainFrames = [];
                            // let secondaryFrames = [];
                            // let secondaryFrames = [];
                            for(let j = 0; j < 20; j++){
                                let mf = inititalFrame+j;
                                if(mf >= framesCount){
                                    mf-=framesCount;
                                }

                                mainFrames[j] = mf;
                                // if(j <5)
                                //     mainFrames[j] = mf;
                                // else 
                                //     secondaryFrames[j-5] = mf;

                            }


                            items[i] = {
                                p: new V2(getRandomInt(0, this.size.x), fast.r(getRandomGaussian(50, this.size.y-50))+20),
                                inititalFrame: getRandomInt(0, framesCount-1),
                                mainFrames,
                                //secondaryFrames
                            }
                        }

                        this.frames = [];
                        for(let f = 0; f < framesCount; f++){
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let i = 0;i< itemsCount; i++){
                                    let item = items[i];
                                
                                    let index = item.mainFrames.indexOf(f)
                                    if(index != -1){
                                        let d = fast.f(index/10);

                                        hlp.setFillColor(`rgba(255,255,255, ${fast.r(1/(d+1),1)})`).dot(item.p.x-d, item.p.y);
                                    }
                                    
                                    // if(item.secondaryFrames.indexOf(f) != -1){
                                    //     hlp.setFillColor('rgba(255,255,255, 0.6)').dot(item.p.x+1, item.p.y);
                                    // }
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
                }))

            }
        }), 0)

        this.iceTower1 = this.addGo(new GO({
            position: new V2(160,130),
            size: new V2(30,50),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower1)
            }
        }), 1)

        this.iceTower2 = this.addGo(new GO({
            position: new V2(180,135),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower2)
            }
        }), 1)

        this.iceTower3 = this.addGo(new GO({
            position: new V2(175,145),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower2)
            }
        }), 1)

        this.iceTower4 = this.addGo(new GO({
            position: new V2(155,145),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower2)
            }
        }), 1)

        this.iceTower5 = this.addGo(new GO({
            position: new V2(135,135),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower3)
            }
        }), 1)

        this.iceTower6 = this.addGo(new GO({
            position: new V2(150,130),
            size: new V2(10,20),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.iceTower4)
            }
        }), 1)
    }
}