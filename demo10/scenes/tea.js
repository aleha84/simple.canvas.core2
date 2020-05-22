class Demo10TeaScene extends Scene {
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
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10TeaScene.models.main)
        }), 1)

        this.spoon = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10TeaScene.models.spoonFrames),
            init() {
                this.redFramesCounter = 6;
                this.frames = [
                    this.frames[0],
                    ...this.frames,
                    this.frames[this.frames.length-1],
                    ...this.frames.reverse()
                ]

                console.log(this.frames.length);
                this.currentFrame = 0;
                this.framesDelayDefault = 10;
                this.frameChangeDelay = this.framesDelayDefault;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                    if(this.frameChangeDelay == 0){
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;

                            this.redFramesCounter--;

                            if(this.redFramesCounter == 0){
                                this.redFramesCounter = 6;
                                if(!this.redFrame){
                                                this.redFrame = this.addChild(new GO({
                                                    position: new V2(),
                                                    size: this.size,
                                                    img: createCanvas(this.size, (ctx, size, hlp) => {
                                                        hlp.setFillColor('red').rect(0,0, 50,50)
                                                    })
                                                }));
                                            }
                                            else {
                                                this.removeChild(this.redFrame);
                                                this.redFrame = undefined;
                                            }
                            }
                        }
                        this.frameChangeDelay = this.framesDelayDefault;
                    }
                    
                    this.frameChangeDelay--;
                })
            }
        }), 2)

        this.spoon = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10TeaScene.models.steamFrames),
            init() {
                console.log(this.frames.length);

                this.currentFrame = 0;
                this.framesDelayDefault = 10;
                this.frameChangeDelay = this.framesDelayDefault;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                    if(this.frameChangeDelay == 0){
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                        }
                        this.frameChangeDelay = this.framesDelayDefault;
                    }
                    
                    this.frameChangeDelay--;
                })
            }
        }), 3)
    }
}