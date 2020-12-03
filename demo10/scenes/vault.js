class Demo10VaultScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'vault'
            },
            // events: {
            //     up: (event) => {
            //         let position = event.state.logicalPosition.toInt();
            //         this.main.addPoint(position);
            //     }
            // }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){

        // this.main = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     addPoint(point) {
        //         if(!this.points) {
        //             this.points = [];
        //         }

        //         if(this.points.length == 3)
        //             this.points = [];

        //         this.points.push(point);
        //         this.createImage();
        //     },
        //     getPoints(p1, p2, type, method) {//xtype, xmethod, ytype, ymethod) {
        //         let deltaX = Math.abs(p1.x - p2.x);
        //         let deltaY = Math.abs(p1.y - p2.y);

        //         // let type = 'quad';
        //         // let method = 'in';
        //         let steps = Math.max(deltaX, deltaY);
        //         let xValues = [];
        //         let yValues = []
        //         if(deltaY > deltaX){
        //             xValues = easing.fast({from: p1.x, to: p2.x, steps, type: 'linear', method: 'base'}).map(v => fast.r(v));
        //             yValues = easing.fast({from: p1.y, to: p2.y, steps, type, method}).map(v => fast.r(v));
        //         }
        //         else {
        //             xValues = easing.fast({from: p1.x, to: p2.x, steps, type, method }).map(v => fast.r(v));
        //             yValues = easing.fast({from: p1.y, to: p2.y, steps, type: 'linear', method: 'base'}).map(v => fast.r(v));
        //         }
                

        //         let points = [];

        //         for(let i = 0; i < steps; i++){
        //             let nextPoint = new V2(xValues[i], yValues[i]);
        //             if(points.filter(p => p.equal(nextPoint)).length == 0){
        //                 points.push(nextPoint);
        //             }
        //         }

        //         return points;
        //     },
        //     createImage() {
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             hlp.setFillColor('white');
        //             if(this.points.length < 2){
        //                 hlp.dot(this.points[0])
        //                 return;
        //             }
                    
        //             let points = [];
        //             let type = 'quad';
        //             let method = 'in';
        //             for(let i = 0; i < this.points.length-1; i++){
        //                 // if(i == 0)
        //                 //     method = 'in'
        //                 // else if(i == 1)
        //                 //     method = 'out';

        //                 points = [...points, ...this.getPoints(this.points[i], this.points[i+1], type, method)]
        //             }
                    
        //             points.forEach(p => hlp.dot(p.x, p.y))
        //         })
        //     }
        // }), 1)

        let model = Demo10VaultScene.models.main;

        
        for(let i = 0; i < model.main.layers.length; i++){
            let layer = model.main.layers[i];

            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layer.name] })
            }), i*10)
        }

        this.logo = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10VaultScene.models.logoFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 5;
                console.log('logo frames: ' + this.frames.length*delay);
                this.timer = this.regTimerDefault(10, () => {
                    delay--;
                    if(delay > 0)
                        return;

                    delay = 5;

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 100)

        this.antenna = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10VaultScene.models.antennaFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 5;
                console.log('antenna frames: ' + this.frames.length*delay);
                this.timer = this.regTimerDefault(10, () => {
                    delay--;
                    if(delay > 0)
                        return;

                    delay = 5;

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 100)

        this.soldier1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10VaultScene.models.soldier1),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let frameDelay = 20;
                let animationStartDelay = 0;

                console.log('soldier1 frames: ' + (this.frames.length*frameDelay + 100));
                this.timer = this.regTimerDefault(10, () => {
                    if(animationStartDelay > 0){
                        animationStartDelay--;
                        return;
                    }

                    frameDelay--;
                    if(frameDelay > 0)
                        return;

                    frameDelay = 20;
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationStartDelay = 100;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 100)

        this.soldier2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10VaultScene.models.soldier2),
            init() {
                this.fall1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    frames: PP.createImage(Demo10VaultScene.models.fall1),
                    startAnimation() {
                        this.stop = false;
                    },
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        let frameDelay = 0;
                        this.stop = true;
                        this.timer = this.regTimerDefault(10, () => {
                            if(this.stop)
                                return;
                            frameDelay--;
                            if(frameDelay > 0)
                                return;

                            frameDelay =  5;
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                this.stop = true;
                            }
                            this.img = this.frames[this.currentFrame];
                        })
                    }
                }))

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let frameDelay = 20;
                let animationStartDelay = 50;

                console.log('soldier2 frames: ' + (this.frames.length*frameDelay + 100));

                this.timer = this.regTimerDefault(10, () => {
                    if(animationStartDelay > 0){
                        animationStartDelay--;
                        return;
                    }

                    frameDelay--;
                    if(frameDelay > 0)
                        return;

                    frameDelay = 20;
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationStartDelay = 100;
                        this.fall1.startAnimation();
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 100)

        this.drone2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10VaultScene.models.drone2),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let frameDelay = 10;

                console.log('drone2 frames: ' + this.frames.length*10);
                this.timer = this.regTimerDefault(10, () => {
                    frameDelay--;
                    if(frameDelay > 0)
                        return;

                    frameDelay = 10;
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 120)

        this.createSnowFrames = function({framesCount, itemsCount, itemFrameslength, size, color, yClamps, arg1, arg2}) {
            let frames = [];
            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })


            let itemsData = new Array(itemsCount).fill().map((el, i) => {

                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let y1 = getRandomInt(yClamps[0], yClamps[1]);
                let y2 = y1 + getRandomInt(5,20);
                let linePoints = sharedPP.lineV2(new V2(0, y1), new V2(size.x, y2));
                let indexValues = easing.fast({ from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                
                //let arg1 = 0.15//getRandom(0.05, 0.1);
                let fShift = getRandomInt(-50,50);
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        p: linePoints[indexValues[f]],
                        yShift: fast.r(Math.sin((f+fShift)*arg1)*arg2)
                    };
                }
            
                return {
                    indexValues,
                    linePoints,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(color).rect(itemData.frames[f].p.x, itemData.frames[f].p.y + itemData.frames[f].yShift, 1, 1)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.scull = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.currentFrame = 0;
                let total = 300;
                let repeats = 5;
                let img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#717079').dot(9,131);
                })

                this.timer = this.regTimerDefault(15, () => {
                    this.img = undefined;

                    if(this.currentFrame > 100 && this.currentFrame < 120){
                        this.img = img;
                    }
                    
                    this.currentFrame++;
                    if(this.currentFrame == total){
                        this.currentFrame = 0;
                        repeats--;
                        if(repeats == 0)
                            this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 130)

        // this.frontalSnow = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     frames: this.createSnowFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: 70, size: this.viewport, color: 'white', yClamps: [0, this.viewport.y*2/3], arg1: 0.15, arg2: 5 }),
        //     init() {
        //         this.currentFrame = 0;
        //         this.img = this.frames[this.currentFrame];
                
        //         this.timer = this.regTimerDefault(10, () => {
                
        //             this.currentFrame++;
        //             if(this.currentFrame == this.frames.length){
        //                 this.currentFrame = 0;
        //             }
        //             this.img = this.frames[this.currentFrame];
        //         })
        //     }
        // }), 130)

        // this.backnow = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     frames: this.createSnowFrames({ framesCount: 300, itemsCount: 100, itemFrameslength: 100, size: this.viewport, color: '#dadbe9', yClamps: [-50, this.viewport.y/2],arg1: 0.1, arg2: 2 }),
        //     init() {
        //         this.currentFrame = 0;
        //         this.img = this.frames[this.currentFrame];
                
        //         this.timer = this.regTimerDefault(10, () => {
                
        //             this.currentFrame++;
        //             if(this.currentFrame == this.frames.length){
        //                 this.currentFrame = 0;
        //             }
        //             this.img = this.frames[this.currentFrame];
        //         })
        //     }
        // }), 25)
    }
}