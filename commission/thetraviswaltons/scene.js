class DrunkDetectiveScene extends Scene {
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
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'detective'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -0.5)),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(DrunkDetectiveScene.models.bg)
            }
        }), 1)

        this.guy = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 113),
            frames: PP.createImage(DrunkDetectiveScene.models.guy), 
            init() {
                let loopFramesIndex = 41
                this.frames = [
                    //...new Array(5).fill(this.frames[1]),
                    ...this.frames.filter((_, i) => i <= loopFramesIndex),
                    ...this.frames,
                ]

                let repeat = 2;
                this.registerFramesDefaultTimer({originFrameChangeDelay: 8, 
                    framesChangeCallback: () => {
                        let a = 10;
                    },
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }});
                // this.img = PP.createImage(DrunkDetectiveScene.models.guy)[0]
            }
        }), 10)
    }
}