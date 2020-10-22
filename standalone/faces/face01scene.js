class Face01Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'face01'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.face = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(50,50),
            init() {
                this.img = PP.createImage(Face01Scene.models.main, { renderOnly: ['m_0', 'm_1'] });

                this.mount = this.addChild(new GO({
                    position: new V2(), 
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(Face01Scene.models.mouthFrames, {renderOnly: ['ani']});
                        this.frames = [...this.frames, ...this.frames.reverse().filter((el, i) => i > 0)]


                        this.registerFramesDefaultTimer({originFrameChangeDelay: 5, initialAnimationDelay: 150, animationRepeatDelayOrigin: 150});
                    }
                }))

                this.breath = this.addChild(new GO({
                    position: new V2(), 
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(Face01Scene.models.breathFrames, {renderOnly: ['ani']});
                        this.frames = [...this.frames, ...this.frames.reverse()]


                        this.registerFramesDefaultTimer({originFrameChangeDelay: 7});
                    }
                }))

                this.blink = this.addChild(new GO({
                    position: new V2(), 
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(Face01Scene.models.blinkFrames, {renderOnly: ['ani']});
                        this.frames = [...this.frames, ...this.frames.reverse()]

                        let repeat = 3;
                        this.registerFramesDefaultTimer({originFrameChangeDelay: 2, initialAnimationDelay: 140, animationRepeatDelayOrigin: 140,
                            framesEndCallback: () => { 
                                repeat--;
                                if(repeat == 0)
                                    this.parent.parentScene.capturing.stop = true; 
                                }});
                    }
                }))

                this.particle = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Face01Scene.models.main.main.layers.find(l => l.name == 'particles')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), 1)
    }
}