class JustreeScreamScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,   
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'scream'
            },
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

    createRain2Frames({framesCount, itemsCount, itemFrameslength, size, color}) {
        let frames = [];
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let x = getRandomInt(0, size.x);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    visible: true
                };
            }
        
            return {
                x,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(color).rect(itemData.x, 0, 1, size.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    createRainFrames({framesCount, itemsCount, itemFrameslength, size, color}) {
        let frames = [];
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let x = getRandomInt(0, size.x);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    visible: true
                };
            }
        
            return {
                x,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(color).rect(itemData.x, 0, 1, size.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
            })
        }), 1)

        this.scream = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,100),
            frames: PP.createImage(JustreeScreamScene.model.mainFrames),
            init() {
                // let mask = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('white').rect(0,0,size.x, size.y/2);

                //     let widthValues = easing.fast({from: size.x/2, to: 0, steps: size.y/2, type: 'cubic', method: 'in', round: 0 });
                //     for(let i = 0; i < size.y/2;i++){
                //         let width = widthValues[i];
                //         hlp.setFillColor('white').rect((size.x/2) - width, i + size.y/2, width*2, 1);

                //         let opacityCount = fast.r(((size.x/2)-width)/2);
                //         let oValues = easing.fast({ from: 1, to: 0, steps: opacityCount,type: 'quad', method: 'in', round: 2 });
                //         for(let j = 0; j < opacityCount; j++){
                //             hlp.setFillColor(`rgba(255,255,255,${oValues[j]})`)
                //                 .dot((size.x/2) - width - j, i + size.y/2)
                //                 .dot((size.x/2) + width + j, i + size.y/2)
                //         }
                //     }
                // })

                // this.frames = this.frames.map(frame => {
                //     return createCanvas(this.size, (ctx, size, hlp) => {
                //         ctx.drawImage(frame, 0, 0);
                //         ctx.drawImage(mask, 0, 0);
                //     })
                // })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 20)

        this.bricks = this.addGo(new GO({
            position: new V2(62.5, 95),
            size: new V2(125,70),
            img: PP.createImage(JustreeScreamScene.model.bricks),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.filter = `brightness(30%)`;
                    ctx.drawImage(this.img, 0,0);
                })   
            }
        }), 25)

        this.rain = 
            [{ framesCount: 100, itemsCount: 50, itemFrameslength: 12, size: this.viewport, color: '#110003', layer: 2  },
            { framesCount: 100, itemsCount: 30, itemFrameslength: 10, size: this.viewport, color: '#3a0002', layer: 3  },
            { framesCount: 100, itemsCount: 20, itemFrameslength: 8, size: this.viewport, color: '#630001', layer: 5  },
            
            { framesCount: 100, itemsCount: 15, itemFrameslength: 6, size: this.viewport, color: '#8A0505', layer: 10  },
            { framesCount: 100, itemsCount: 10, itemFrameslength: 4, size: this.viewport, color: '#BF0202', layer: 21  },
            { framesCount: 100, itemsCount: 10, itemFrameslength: 3, size: this.viewport, color: '#BF0202', layer: 31  }]
            .map(layer => this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                frames: this.createRainFrames(layer), 
                init() {
                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
                    
                    let originFrameChangeDelay = 0;
                    let frameChangeDelay = originFrameChangeDelay;
                    
                    let animationRepeatDelayOrigin = 0;
                    let animationRepeatDelay = animationRepeatDelayOrigin;
                    
                    this.timer = this.regTimerDefault(10, () => {
                        animationRepeatDelay--;
                        if(animationRepeatDelay > 0)
                            return;
                    
                        frameChangeDelay--;
                        if(frameChangeDelay > 0)
                            return;
                    
                        frameChangeDelay = originFrameChangeDelay;
                    
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                            animationRepeatDelay = animationRepeatDelayOrigin;
                        }
                    })
                }
            }), layer.layer))

    }
}