class EpskaVerse1Part2Scene extends Scene {
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
        this.eyes = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 51),
            size: new V2(300, 103),
            init() {
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('red').rect(0,0,size.x, size.y)
                // })
                this.base = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.eyesClose)
                }))
            }
        }))

        this.frames = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('cornflowerblue').strokeRect(0,0,size.x, size.y,4)
                    .rect(0,size.y/2, size.x, 4)
                })
            }
        }), 2)
    }
}