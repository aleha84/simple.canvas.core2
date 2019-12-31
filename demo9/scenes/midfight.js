class Demo9MidFightScene extends Scene {
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
        this.backgroundRenderDefault('#C6980B');
    }

    start(){
        this.knightSize = new V2(40,25);

        this.knight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.knightSize,
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.knightIdle)
            }
        }), 1)

        this.grass = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(20,20)),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.grass)
            }
        }), 2)

        this.grass2 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-20,20)),
            size: new V2(20,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.grass2)
            }
        }), 2)
    }
}