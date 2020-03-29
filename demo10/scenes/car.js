class Demo10CarScene extends Scene {
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

    framesGenerator({direction, framesCount, repeatCount, pointsCount, size, color}) {
        let frames = [];
                // let direction = V2.down.rotate(-45, false);
                // let framesCount = 75;
                // let repeatCount = 5;
                // let pointsCount = 50;

                let to = raySegmentIntersectionVector2(new V2(), direction, {begin: new V2(-1000, size.y), end: new V2(1000, size.y)})
                let points = [];
                createCanvas(new V2(), (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    points = pp.lineV2(new V2(), to);
                })

                let linePointsCountPerRepeat = fast.f(points.length/repeatCount);
                let indexChange = easing.createProps(framesCount-1, 0, linePointsCountPerRepeat, 'linear', 'base');
                let indexChanges = new Array(framesCount).fill().map((_, i) => {
                    indexChange.time = i;
                    return fast.r(easing.process(indexChange))
                })

                let pointsData = new Array(pointsCount).fill().map(p => {
                    let xDelta = getRandomInt(-size.x, size.x*2);

                    return {
                        xDelta,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < pointsCount; p++){
                            let pointData = pointsData[p];

                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }

                            let lineIndexPerRepeat = indexChanges[currentIndex];

                            for(let repeat = 0; repeat < repeatCount; repeat++){
                                let index = linePointsCountPerRepeat*repeat + lineIndexPerRepeat;
                                let linePoint = points[index];
                                if(linePoint == undefined)
                                    debugger;

                                hlp.setFillColor(color).dot(pointData.xDelta + linePoint.x, linePoint.y)
                                // if(index > 0){
                                //     linePoint = points[index-1];
                                //     hlp.setFillColor('rgba(255,255,255, 0.25)').dot(pointData.xDelta + linePoint.x, linePoint.y)
                                // }
                            }
                        }
                    })
                }

                return frames;
    }

    start(){
        var model = Demo10CarScene.models.model;
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;

            this.addGo(new GO({
                position: this.sceneCenter,
                size: this.viewport,
                img: PP.createImage(model, {renderOnly: name}) 
            }), l)
        }

        this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-50)),
            size: this.viewport,
            init() {
                let framesCount = 100

                this.frames2 = this.parentScene.framesGenerator({direction:V2.down.rotate(-15, false), framesCount: framesCount, repeatCount: 10, pointsCount: 100, size: this.size, 
                    color: 'rgba(255,255,255,0.15)'});
                this.frames3 = this.parentScene.framesGenerator({direction:V2.down.rotate(15, false), framesCount: framesCount, repeatCount: 10, pointsCount: 100, size: this.size, 
                    color: 'rgba(255,255,255,0.15)'});
                this.frames1 = this.parentScene.framesGenerator({direction:V2.down.rotate(10, false), framesCount: framesCount, repeatCount: 10, pointsCount: 100, size: this.size, 
                    color: 'rgba(255,255,255,0.15)'});
                this.frames = [];
                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.frames1[f], 0,0)
                        ctx.drawImage(this.frames2[f], 0,0)
                        ctx.drawImage(this.frames3[f], 0,0)
                    })
                }

                this.currentFrame = 0;
                //this.redFrameCounter = 5;
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

        this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-50)),
            size: this.viewport,
            init() {
                let framesCount = 100

                this.frames2 = this.parentScene.framesGenerator({direction:V2.down.rotate(-15, false), framesCount: framesCount, repeatCount: 7, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255,0.3)'});
                this.frames3 = this.parentScene.framesGenerator({direction:V2.down.rotate(15, false), framesCount: framesCount, repeatCount: 7, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255,0.3)'});
                this.frames1 = this.parentScene.framesGenerator({direction:V2.down.rotate(10, false), framesCount: framesCount, repeatCount: 7, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255,0.3)'});
                this.frames = [];
                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.frames1[f], 0,0)
                        ctx.drawImage(this.frames2[f], 0,0)
                        ctx.drawImage(this.frames3[f], 0,0)
                    })
                }

                this.currentFrame = 0;
                //this.redFrameCounter = 5;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                            
                    }
                })
            }
        }), 4)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                

                this.frames1 = this.parentScene.framesGenerator({direction:V2.down.rotate(-20, false), framesCount: 100, repeatCount: 5, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255, 0.6)'});
                this.frames2 = this.parentScene.framesGenerator({direction:V2.down.rotate(-30, false), framesCount: 100, repeatCount: 5, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255, 0.6)'});
                this.frames3 = this.parentScene.framesGenerator({direction:V2.down.rotate(-10, false), framesCount: 100, repeatCount: 5, pointsCount: 50, size: this.size, 
                    color: 'rgba(255,255,255, 0.6)'});
                this.frames = [];
                for(let f = 0; f < 100; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.frames1[f], 0,0)
                        ctx.drawImage(this.frames2[f], 0,0)
                        ctx.drawImage(this.frames3[f], 0,0)
                    })
                }

                this.currentFrame = 0;
                this.redFrameCounter = 5;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        this.redFrameCounter--;

                        // if(this.redFrameCounter == 0){
                        //     this.redFrameCounter= 5;
                        //     if(!this.redFrame){
                        //         //alert('1')
                        //         this.redFrame = this.addChild(new GO({
                        //             position: new V2(),
                        //             size: this.size,
                        //             img: createCanvas(this.size, (ctx, size, hlp) => {
                        //                 hlp.setFillColor('red').rect(0,0, 50,50)
                        //             })
                        //         }));
                        //     }
                        //     else {
                        //         this.removeChild(this.redFrame);
                        //         this.redFrame = undefined;
                        //     }
                        // }
                            
                    }
                })
            }
        }), 10)

    }
}