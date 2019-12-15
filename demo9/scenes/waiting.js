class Demo9WaitingScene extends Scene {
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
        this.backgroundRenderDefault('#030712');
    }

    start(){
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.main)
            }
        }), 1)

        this.sign = this.addGo(new GO({
            position: new V2(37, 231),
            size: new V2(75,130),
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.sign)
            }
        }), 2)
    }
}