class Demo10GodScene extends Scene {
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
        this.god = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(50, 0)),
            size: new V2(150,150),
            model: Demo10GodScene.models.god(),
            init() {
                this.shouldAddRedFrames = true;
                console.log(this.model);
                //this.img = PP.createImage(this.model);

                this.framesCount = 200;
                this.yClamps = [-1, 0];
                this.aClamps = [1, 0.5];
                this.yValues = [];
                this.aValues = [];

                let yChange1 = easing.createProps((this.framesCount/2)-1, this.yClamps[0], this.yClamps[1], 'quad', 'inOut');
                let yChange2 = easing.createProps((this.framesCount/2)-1, this.yClamps[1], this.yClamps[0], 'quad', 'inOut');

                let aChange1 = easing.createProps((this.framesCount/2)-1, this.aClamps[0], this.aClamps[1], 'quad', 'inOut');
                let aChange2 = easing.createProps((this.framesCount/2)-1, this.aClamps[1], this.aClamps[0], 'quad', 'inOut');

                for(let i = 0; i < this.framesCount/2; i++){
                    yChange1.time = i;
                    aChange1.time = i;
                    let y = fast.r(easing.process(yChange1));
                    this.yValues[i] = y;
                    this.aValues[i] = fast.r(easing.process(aChange1),2);
                }

                for(let i = 0; i < this.framesCount/2; i++){
                    yChange2.time = i;
                    aChange2.time = i;
                    let y = fast.r(easing.process(yChange2));
                    this.yValues[i+(this.framesCount/2)] = y;
                    this.aValues[i+(this.framesCount/2)] = fast.r(easing.process(aChange2),2);
                }

                this.points = [];
                for(let l = 0; l < this.model.main.layers.length; l++){
                    let group = this.model.main.layers[l].groups[0];
                    
                    // this.points[l] = {
                    //     color: group.strokeColor,
                        
                    // };



                    let frames = [];
                    if(this.model.main.layers[l].name.indexOf('fadeout')!=-1){
                        
                        let particlesCount = 100;
                        let yMax = -15;
                        let yMin = -5;

                        if(this.model.main.layers[l].name.indexOf(':')!=-1){
                            let [name, paramsRaw] = this.model.main.layers[l].name.split(':');
                            let params = paramsRaw.split(';');
                            particlesCount = params[0];
                            yMax = parseInt(params[1]);
                            yMin = parseInt(params[2]);
                        }

                        let particles = [];

                        let aChange = easing.createProps(this.framesCount-1, 1, 0, 'quad', 'out');
                        let aValues = new Array(this.framesCount).fill().map((el, i) => {
                            aChange.time = i;
                            return fast.r(easing.process(aChange),2)
                        });

                        for(let i = 0; i < particlesCount; i++){
                            let yChange = easing.createProps(this.framesCount-1, 0, getRandomInt(yMax, yMin), 'quad', 'in');

                            particles[i] = {
                                startPoint: group.points[getRandomInt(0, group.points.length-1)].point,
                                yChangeValues: new Array(this.framesCount).fill().map((el, i) => {
                                    yChange.time = i;
                                    return fast.r(easing.process(yChange));
                                }),
                                initialIndex: getRandomInt(0, (this.framesCount-1))
                            }
                        }

                        for(let f = 0; f < this.framesCount; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor(group.strokeColor); 
                                for(let p = 0; p < particles.length; p++){
                                    let particleData = particles[p];
                                    let currentIndex = particleData.initialIndex + f;
                                    if(currentIndex > (this.framesCount-1)){
                                        currentIndex-=this.framesCount;
                                    }

                                    ctx.globalAlpha = aValues[currentIndex];

                                    let x = particleData.startPoint.x;
                                    let y = particleData.startPoint.y + particleData.yChangeValues[currentIndex]
                                    
                                    hlp.dot(x,y);

                                    ctx.globalAlpha = 1;
                                }
                            })
                        }

                    }
                    else if(this.model.main.layers[l].name.indexOf('ignore')!=-1){
                        for(let f = 0; f < this.framesCount; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor(group.strokeColor);
    
                                for(let p = 0; p < group.points.length; p++){
                                    let pointData = group.points[p];
                                    
                                    let x = pointData.point.x;
                                    let y = pointData.point.y 
                                    
                                    hlp.dot(x,y);
                                }
                            })
                        }
                    }
                    else {

                        let points = group.points.map(p => ({
                            point: p.point,
                            initialIndex: getRandomInt(0, (this.framesCount-1))
                        }))

                        for(let f = 0; f < this.framesCount; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor(group.strokeColor);
    
                                for(let p = 0; p < points.length; p++){
                                    let pointData = points[p];
                                    let currentIndex = pointData.initialIndex + f;
                                        if(currentIndex > (this.framesCount-1)){
                                            currentIndex-=this.framesCount;
                                        }
                                    
                                    let x = pointData.point.x;
                                    let y = pointData.point.y + this.yValues[currentIndex]
                                    
                                    ctx.globalAlpha = this.aValues[currentIndex];

                                    hlp.dot(x,y);
                                    
                                    ctx.globalAlpha = 1;
                                }
                            })
                        }
                    }
                    


                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        shouldAddRedFrames: this.shouldAddRedFrames,
                        init() {
                            this.currentFrame = 0;
                            this.redFrameCounter = 5;
                            this.img = this.frames[this.currentFrame];

                            this.timer = this.regTimerDefault(15, () => {
                
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;

                                    // if(this.shouldAddRedFrames){
                                    //     this.redFrameCounter--;
    
                                    //     if(this.redFrameCounter == 0){
                                    //         this.redFrameCounter= 5;
                                    //         if(!this.redFrame){
                                    //             this.redFrame = this.addChild(new GO({
                                    //                 position: new V2(),
                                    //                 size: this.size,
                                    //                 img: createCanvas(this.size, (ctx, size, hlp) => {
                                    //                     hlp.setFillColor('red').rect(0,0, 50,50)
                                    //                 })
                                    //             }));
                                    //         }
                                    //         else {
                                    //             this.removeChild(this.redFrame);
                                    //             this.redFrame = undefined;
                                    //         }
                                    //     }
                                    // }
                                     
                                }
                            })
                        }
                    }))

                    this.shouldAddRedFrames = false;
                }
            }
        }), 3);

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10GodScene.models.fg)
                }))

                let candleFrames = PP.createImage(Demo10GodScene.models.candle);

                let candlePositions = [new V2(-85, -9), new V2(-53, 10), new V2(-27, 22), ]
                this.candles = candlePositions.map(p => this.addChild(new GO({
                    position: p,
                    size:  new V2(20,30),
                    frames: candleFrames,
                    init() {
                        console.log(this.frames.length)
                        this.frameRepeaterOrigin = 5;
                        this.frameRepeater = this.frameRepeaterOrigin;
                        this.currentFrame = getRandomInt(0, this.frames.length-1);
                            this.img = this.frames[this.currentFrame];

                            this.timer = this.regTimerDefault(15, () => {
                
                                this.img = this.frames[this.currentFrame];
                                this.frameRepeater--;
                                if(this.frameRepeater == 0){
                                    this.currentFrame++;
                                    this.frameRepeater = this.frameRepeaterOrigin;
                                }
                                
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                }
                            })
                    }
                })))
            }
        }), 5)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10GodScene.models.bg)
                }))

                this.overlay = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(0,0,0,0.6)').rect(0,0,size.x,size.y)
                    })
                }))
            }
        }), 1)
    }
}