class Demo10AnfisaScene extends Scene {
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
                fileNamePrefix: 'anfisa'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#a7b9cd').rect(0,0, size.x, size.y);
                })

                this.stars = this.addChild(new GO( {
                    position: new V2(),
                    size: this.size,
                    createStarsFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let starFrames = PP.createImage(Demo10AnfisaScene.models.starFrames);
                        //starFrames = [...starFrames, ...starFrames.reverse()];

                        let frames = [];
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {

                            let framesLength = getRandomInt(5, starFrames.length-1);
                            let x = getRandomInt(0, size.x);
                            let y = getRandomInt(0, size.y);
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                        
                            let framesIndexes = [
                                ...easing.fast({ from: 0, to: framesLength, steps: totalFrames, type: 'linear', round: 0 }), 
                                ...easing.fast({ from: framesLength, to: 0, steps: totalFrames, type: 'linear', round: 0 })
                            ]

                            let yShiftValues = easing.fast({ from: 0, to: -getRandomInt(10,20), steps: totalFrames*2, type: 'linear', round: 0 })

                            let frames = [];
                            for(let f = 0; f < totalFrames*2; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    index: framesIndexes[f],
                                    yShift: yShiftValues[f]
                                };
                            }
                        
                            return {
                                x, y,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(starFrames[itemData.frames[f].index], itemData.x, itemData.y+itemData.frames[f].yShift);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createStarsFrames({ framesCount: 200, itemsCount: 150, size: this.size,  itemFrameslengthClamps: [20, 40] });
                        let repeat = 5;
                        this.registerFramesDefaultTimer({ 
                            framesEndCallback: () => {
                                repeat--;
                                if(repeat == 0)
                                    this.parent.parentScene.capturing.stop = true;
                            }
                            
                         });
                    }
                }))
            }
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10AnfisaScene.models.main, { exclude: ['bg'] })
                this.animation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(Demo10AnfisaScene.models.mainFrames, { exclude: ['bg'] });
                        let framesCountPart_1 = 20;
                        let framesCountPart_2 = 50;
                        let framesIndicies= [
                            ...easing.fast({ from: 0, to: 2, steps: framesCountPart_1, type: 'quad', method: 'out', round: 0}),
                            ...easing.fast({ from: 2, to: 0, steps: framesCountPart_2, type: 'quad', method: 'in', round: 0}),
                        ]

                        this.currentFrameIndex = 0;
                        this.img = this.frames[framesIndicies[this.currentFrameIndex]];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 30;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[framesIndicies[this.currentFrameIndex]];
                            this.currentFrameIndex++;
                            if(this.currentFrameIndex == framesIndicies.length){
                                this.currentFrameIndex = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }
                }))
            }
        }), 5)

        this.particlesEffects = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10AnfisaScene.models.main.main.layers.find(l => l.name == 'shine_p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                let eyesPoints = animationHelpers.extractPointData(Demo10AnfisaScene.models.main.main.layers.find(l => l.name == 'eyes_p'));
                eyesPoints = [...eyesPoints, ...eyesPoints];
                this.eyes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 20, size: this.size, 
                            pointsData: eyesPoints});
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.hairs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10AnfisaScene.models.main.main.layers.find(l => l.name == 'hair_p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.face = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 100, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10AnfisaScene.models.main.main.layers.find(l => l.name == 'face_p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)
    }
}