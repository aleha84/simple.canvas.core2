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
                this.endsCache = [];
                this.direction = new V2(-0.8,0.5);
                this.width = fast.r(this.size.x*0.7);
                this.ls = new Array(this.width).fill(350);
                this.startFrom = new V2(this.size.x-1, fast.r(this.size.y/4))
                this.starts = new Array(this.width).fill().map((_,i) => {
                    return this.startFrom.add(new V2(i, 0));
                })

                this.laser = {
                    from: new V2(this.size.x/3, 0).toInt(),
                    color: '#FF5842',
                    to: {
                        vx: 150,
                        length: 300
                    }
                }

                this.createImage();
            },
            getEnd(length) {
                if(!this.endsCache[length]){
                    this.endsCache[length] = this.direction.mul(length);
                }

                return this.endsCache[length];
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor('#F1F1F1');

                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.starts[i], this.starts[i].add(this.getEnd(this.ls[i])));
                    }

                    hlp.setFillColor(this.laser.color);
                    let laserTo = this.starts[this.laser.to.vx].add(this.getEnd(this.laser.to.length));
                    pp.lineV2(this.laser.from, laserTo)
                    pp.lineV2(this.laser.from.add(new V2(-1,0)), laserTo.add(new V2(-1,0)));
                })
            }
        }))
    }
}