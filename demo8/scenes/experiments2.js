class Experiments2Scene extends Scene {
    //78D5E1
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                additional: []
            },
            rows: 10,
            columns: 10,
            angle: 30,
            sHeight: 8,
            baseColorHSV: [202,14,71]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    start() {
        this.sWidth = this.sHeight;
        this.shift = fastRoundWithPrecision(this.sHeight*Math.tan(degreeToRadians(this.angle)));
        this.sSize = new V2(this.sWidth+ 2*this.shift, this.sHeight);
        this.topImg = createCanvas(this.sSize, (ctx, size) => {

            ctx.fillStyle = hsvToHex({hsv: this.baseColorHSV});
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.shift; i < size.x;i++){
                pp.lineV2(new V2(i, 0), new V2(i - this.shift, size.y-1));
            }
        })

        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.columns; c++){
                this.addGo(new ProjectedCube({
                    position: this.sceneCenter.add(
                        new V2(
                            -this.sSize.x *this.columns/2 + (this.sSize.x - this.shift)*c +  (this.rows - r - 1)*this.sHeight*Math.tan(degreeToRadians(this.angle)), 
                            -this.rows*this.sHeight/2 + this.sHeight*r)),
                    size: this.sSize,
                    topImg: this.topImg, 
                  }), 100 + r)
            }
            
        }
    }
}

class ProjectedCube extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            
        }, options)

        super(options);
    }

    init() {
        this.top = this.addChild(new GO({
            position: new V2(),
            size: this.size,
            img: this.topImg,
            renderValuesRound: false
        }))
    }
}