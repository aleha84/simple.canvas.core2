class Tu2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'tu2'
            },
            debug: {
                enabled: true,
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
        let model = Tu2Scene.models.main;
        // for(let i = 0; i < model.main.layers.length; i++){
        //     let layerName = model.main.layers[i].name;

        //     this.addGo(new GO({
        //         position: this.sceneCenter,
        //         size: this.viewport,
        //         init() {
        //             this.img = PP.createImage(model, { renderOnly: [layerName] })
        //         }
        //     }), i*10)
        // }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 0)

        this.second_plane = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['second_plane'] })

                let totalFrames = 300;
                let origignalX = this.position.x;

                let _xValues = easing.fast({ from: 0, to: 4, steps: totalFrames/2, type: 'quad', method: 'inOut'}).map(v => fast.r(v));
                let xValues = [..._xValues, ..._xValues.reverse()];
                //let delay = 0;
                this.currentFrame = 0;
                this.timer = this.regTimerDefault(10, () => {
                    // delay--;
                    // if(delay > 0)
                    //     return;

                    //delay = 10;
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }
                    this.position.x = origignalX+xValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            }
        }), 10)

        this.main_plane = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['main_plane'] });

                let totalFrames = 300;
                let origignalY = this.position.y;

                let _yValues = easing.fast({ from: 0, to: 5, steps: totalFrames/2, type: 'quad', method: 'inOut'}).map(v => fast.r(v));
                let yValues = [..._yValues, ..._yValues.reverse()];
                //let delay = 0;
                this.currentFrame = 0;
                this.timer = this.regTimerDefault(10, () => {
                    // delay--;
                    // if(delay > 0)
                    //     return;

                    //delay = 10;
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }
                    this.position.y = origignalY+yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            }
        }), 20)

        this.createParticlesFrames = function({framesCount, itemsCount, itemFrameslength, size, tailLength, color, opacity, yClamps}) {
            let frames = [];
            let oValues = easing.fast({from: 0, to: opacity, steps: tailLength, type: 'quad', method: 'out'} ).map(v => fast.r(v,2));
            let xValues = easing.fast({from: -tailLength, to: size.x, steps: itemFrameslength, type: 'linear', method: 'base'} ).map(v => fast.r(v));

            let particleImage = createCanvas(new V2(tailLength,1), (ctx, size, hlp) => {
                for(let x = 0; x < size.x; x++){
                    hlp.setFillColor(`rgba(255,255,255, ${oValues[x]})`).dot(x, 0);
                }
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        x: xValues[f],
                    };
                }
            
                return {
                    y: getRandomInt(yClamps[0], yClamps[1]),
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(particleImage, itemData.frames[f].x, itemData.y);
                        }
                    }
                });
            }
            
            return frames;
        }

        this.frontalParticles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createParticlesFrames({ framesCount: 300, itemsCount: 25, itemFrameslength: 18, size: this.size, 
                    tailLength: 30, color: undefined, opacity: 0.5, yClamps: [0, this.size.y-25] });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 25)

        this.farParticles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createParticlesFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: 50, size: this.size, 
                    tailLength: 10, color: undefined, opacity: 0.1, yClamps: [0, this.size.y-25] });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 5)

        this.midParticles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createParticlesFrames({ framesCount: 300, itemsCount: 40, itemFrameslength: 35, size: this.size, 
                    tailLength: 20, color: undefined, opacity: 0.25, yClamps: [0, this.size.y-50] });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 15)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createCloudFrames({framesCount, layersData, cloudImage, size, br}) {
                let frames = [];
                 
                let doubleImage = createCanvas(new V2(size.x*2, size.y), (ctx, size, hlp) => {
                    ctx.filter = `brightness(${br || 100}%)`;
                    ctx.drawImage(cloudImage, 0, 0);
                    ctx.drawImage(cloudImage, size.x/2, 0);
                })

                let xValues = easing.fast({ from: -size.x, to: 0, steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(doubleImage, xValues[f], 0)
                    });
                }
                
                return frames;
            },
            init() {
                let cloudImage = PP.createImage(model, { renderOnly: ['clouds'] })

                let size = this.size;

                let layersData = [
                    { framesCount: 600, size, cloudImage, yShift: -5, br: 70,},
                    { framesCount: 300, size, cloudImage, yShift: 0, br: 85,},
                    { framesCount: 150, size, cloudImage, yShift: 10}
                ];
                this.layers = layersData.map(layer => {
                    this.addChild(new GO({
                        position: new V2(0, layer.yShift),
                        size,
                        frames: this.createCloudFrames(layer),
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            
                            this.timer = this.regTimerDefault(10, () => {
                            
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                    if(this.frames.length == 600 ){
                                        this.parent.parentScene.capturing.stop = true;
                                    }
                                }
            
                                this.img = this.frames[this.currentFrame];
                            })
                        }
                    }))
                })


                // this.frames = this.createCloudFrames({ framesCount: 600, 
                //     // layersData: [
                //     // { framesCount: 600, }
                //     // { framesCount: 300, }
                //     // { framesCount: 150, }
                // ], cloudImage, size: this.size });

                
            }
        }), 30)
    }
}