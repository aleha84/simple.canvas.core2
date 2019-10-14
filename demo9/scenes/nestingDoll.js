class Demo9NestingDollScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
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
        this.doll = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(67,123),
            init() {
                this.face = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.img = PP.createImage(nestingDollImages.face)
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

                        this.currentFrame = 0;
                        this.timer = this.regTimerDefault(150, () => {
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
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

                        this.currentFrame = 0;
                        this.timer = this.regTimerDefault(150, () => {
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))
            }
        }))
    }
}