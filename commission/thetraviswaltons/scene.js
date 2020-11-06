class DrunkDetectiveScene extends Scene {
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
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
                this.registerFramesDefaultTimer({originFrameChangeDelay: 10});
                // this.img = PP.createImage(DrunkDetectiveScene.models.guy)[0]
            }
        }), 10)
    }
}