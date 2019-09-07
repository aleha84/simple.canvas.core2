class Demo9Exp2Scene extends Scene {
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
        this.face = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.faceSize = new V2(41,48)
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let center = size.mul(0.5).toInt();
                })
            } 
        }))
    }
}