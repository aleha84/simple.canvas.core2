class EngineTuningT1Scene extends Scene {
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
        this.addGo(new GO({
            position: SCG.viewport.logical.size.divide(2).toInt(),
            size: new V2(20,20),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').rect(0,0,size.x, size.y);
                })
            }
        }), 1)
    }
}