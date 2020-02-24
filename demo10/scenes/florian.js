class Demo10FlorianScene extends Scene {
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
        this.backgroundRenderDefault('#819188');
    }

    start(){
        this.flower = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.flower)
            }
        }), 1)

        this.ice = this.addGo(new GO({
            position: new V2(50,150),
            size: new V2(10,40),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.ice)
            }
        }), 1)
    }
}