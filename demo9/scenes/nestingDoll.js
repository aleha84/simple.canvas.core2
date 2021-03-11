class Demo9NestingDollScene extends Scene {
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
                viewportSizeMultiplier: 5,
                size: new V2(2000,2000),
                //totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'nesting_doll'
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
                    hlp.setFillColor('black').rect(0,0,size.x, size.y)
                })
            }
        }), 0)

        this.doll = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(67,123),
            init() {
                this.face = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        //this.img = PP.createImage(nestingDollImages.face)
                        this.frames = PP.createImage(nestingDollImages.face_frames)
                        console.log(this.frames.length)

                        this.registerFramesDefaultTimer({initialAnimationDelay: 120, animationRepeatDelayOrigin: 120, originFrameChangeDelay: 8, debug: true,
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }});
                        // this.calmDownCounter = 10;
                        // this.currentFrame = 0;
                        // this.img = this.frames[this.currentFrame];
                        // this.timer = this.regTimerDefault(150, () => {
                        //     this.img = this.frames[this.currentFrame];
                        //     this.currentFrame++;
                        //         if(this.currentFrame == this.frames.length){
                        //             this.parent.parentScene.capturing.stop = true;
                        //             this.currentFrame = 0;
                        //             this.calmDownCounter = 10;
                        //         }
                        //     // if(this.calmDownCounter == 0){
                        //     //     this.currentFrame++;
                        //     //     if(this.currentFrame == this.frames.length){
                        //     //         this.currentFrame = 0;
                        //     //         this.calmDownCounter = 10;
                        //     //     }
                        //     // }
                        //     // else {
                        //     //     this.calmDownCounter--;
                        //     // }
                            
                        // })
                    }
                }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.img = PP.createImage(nestingDollImages.body)
                    }
                }))

                this.bodyDetails = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.frames = PP.createImage(nestingDollImages.body_details_frames)
                        this.registerFramesDefaultTimer({originFrameChangeDelay: 10, debug: true});
                         console.log(this.frames.length)
                        // this.currentFrame = 0;
                        // this.img = this.frames[this.currentFrame];
                        // this.timer = this.regTimerDefault(150, () => {
                        //     this.img = this.frames[this.currentFrame];
                        //     this.currentFrame++;
                        //     if(this.currentFrame == this.frames.length){
                        //         this.currentFrame = 0;
                        //     }
                        // })
                    }
                }))

                this.upperPart = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.img = PP.createImage(nestingDollImages.upper_part)
                    }
                }))

                this.upperDetails = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.frames = PP.createImage(nestingDollImages.upper_details_frames)
                        this.registerFramesDefaultTimer({originFrameChangeDelay: 12, debug: true});
                         console.log(this.frames.length)
                        // this.currentFrame = 0;
                        // this.img = this.frames[this.currentFrame];
                        // this.timer = this.regTimerDefault(150, () => {
                        //     this.img = this.frames[this.currentFrame];
                        //     this.currentFrame++;
                        //     if(this.currentFrame == this.frames.length){
                        //         this.currentFrame = 0;
                        //     }
                        // })
                    }
                }))
            }
        }), 1)
    }
}