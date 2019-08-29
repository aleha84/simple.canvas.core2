class CarCommissionScene extends Scene {
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
        // bg
        // road
        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //
                
                this.asp = {
                    color: '#171259',
                    from: new V2(this.size.x, this.size.y*3/4).toInt(),
                    to: new V2(0, this.size.y/2).toInt(),
                }

                this.upperLine = {
                    color: '#5B2669',
                    height: 5,
                    paddingTop: 5
                }

                this.asp.direction =  this.asp.from.direction(this.asp.to)

                this.img = this.createImage();
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(this.asp.color);
                    let dots = pp.lineV2(this.asp.from, this.asp.to);
                    for(let d = 0; d < dots.length; d++){
                        hlp.rect(dots[d].x, dots[d].y, 1, size.y)
                    }

                    hlp.setFillColor(this.upperLine.color);
                    for(let i = 0; i< this.upperLine.height;i++){
                        pp.lineV2(this.asp.from.add(new V2(0, this.upperLine.paddingTop + i)), this.asp.to.add(new V2(0, this.upperLine.paddingTop + i)))
                    }
                })
            }
        }))
        //car
    }
}