class LaserScene extends Scene {
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
        this.go = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.vector = new V2(-0.5,1);
                this.width = fast.r(this.size.x*0.8);
                this.xStart = (this.size.x - this.width)/2;
                this.fromY = fast.r(this.size.y/4);
                this.shift = new V2(300, 200);

                this.createImage();
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor('white');

                    for(let x = this.xStart; x<this.width; x++ ){
                        pp.line(x, this.fromY+this.shift.y, x+this.shift.x, this.fromY);
                    }
                })
            }
        }))
    }
}