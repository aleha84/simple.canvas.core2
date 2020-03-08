class Demo10DumplingScene extends Scene {
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
        this.backgroundRenderDefault('#FEB81A');
    }

    start(){

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-5)),
            size: this.viewport,
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('#FEB81A').rect(0,0, size.x, size.y);
            }),
        }), 0) 

        this.mainItem = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-5)),
            size: this.viewport,
            init() {
                this.img = PP.createImage(pDailyModels.dumpling.main);

                this.itemsPosition = [ { p: new V2(-14,-10)}, { p: new V2(14,-10)}, { p: new V2(0,2)},];

                this.items = this.itemsPosition.map(item => this.addChild(new GO({
                    position: item.p,
                    size: new V2(30,30),
                    img: PP.createImage(pDailyModels.dumpling.item)
                })))

                this.frontal = this.itemsPosition.map(item => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(pDailyModels.dumpling.frontal)
                })))
            }
        }), 1)
    }
}