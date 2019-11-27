class Demo9DreamsScene extends Scene {
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
        this.table = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(200,120),
            init() {
                this.img = PP.createImage(Demo9DreamsScene.boredModels.table);
                this.position = new V2(this.parentScene.sceneCenter.x, this.parentScene.viewport.y - this.size.y/2).toInt()
            }
        }), 1)


        this.man = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(200,120),
            init() {
                this.img = PP.createImage(Demo9DreamsScene.boredModels.man);
                this.position = new V2(this.parentScene.sceneCenter.x, this.parentScene.viewport.y - this.size.y/2).toInt()
            }
        }), 10)
    }
}