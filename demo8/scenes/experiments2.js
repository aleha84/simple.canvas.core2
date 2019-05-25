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
            rHeight: 30,
            baseColorHSV: [202,14,76]
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
        this.rSize = new V2(this.shift, this.rHeight)
        this.topImg = createCanvas(this.sSize, (ctx, size) => {

            ctx.fillStyle = hsvToHex({hsv: this.baseColorHSV});
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.shift; i < size.x;i++){
                pp.lineV2(new V2(i, 0), new V2(i - this.shift, size.y-1));
            }
        });

        this.topImgElevated = createCanvas(this.sSize, (ctx, size) => {
            let _hsv = [...this.baseColorHSV];
            _hsv[2]+=4;

            ctx.fillStyle = hsvToHex({hsv: _hsv});
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.shift; i < size.x;i++){
                pp.lineV2(new V2(i, 0), new V2(i - this.shift, size.y-1));
            }

            // let _hsv = [...this.baseColorHSV];
            // _hsv[2]+=4;

            // ctx.fillStyle = hsvToHex({hsv: _hsv});

            // pp.lineV2(new V2(this.shift, 0), new V2(0, size.y-1));
            // pp.lineV2(new V2(this.shift, 0), new V2(size.x, 0));
        });

        this.rightImg = createCanvas(this.rSize, (ctx, size) => {
            ctx.fillStyle = '#CDDBF6'; 
            //ctx.fillRect(0,0,1,1);
            let pp = new PerfectPixel({context: ctx});
            for(let i = this.sSize.y; i < size.y; i++){
                pp.lineV2(new V2(0, i), new V2(size.x-1, i - this.sSize.y));
            }
        });

        this.frontImg = createCanvas(new V2(1,1), ctx => {
            ctx.fillStyle = '#8A98A0'; ctx.fillRect(0,0,1,1);
        })

        this.segments = [];

        for(let r = 0; r < this.rows; r++){ //
            this.segments[r] = [];
            for(let c = this.columns-1; c >=0 ; c--){ //
                this.segments[r][c] = this.addGo(new ProjectedCube({
                    position: this.sceneCenter.add(
                        new V2(
                            -this.sSize.x *this.columns/2 + (this.sSize.x - this.shift)*c +  (this.rows - r - 1)*this.sHeight*Math.tan(degreeToRadians(this.angle)), 
                            -this.rows*this.sHeight/2 + this.sHeight*r)),
                    size: this.sSize,
                    topImg: this.topImg, 
                    rightImg: this.rightImg,
                    frontImg: this.frontImg,
                    topImgElevated: this.topImgElevated,
                    sWidth: this.sWidth,
                    rSize: new V2(this.shift, this.rHeight)
                    // shift: this.shift,
                    // tHeight: this.tHeight
                  }), 100 + r)
            }
        }

        this.segments[5][5].initCompleted = function() {
            // this.position.y-= 10;
            // this.top.img = this.topImgElevated;

            this.elevation = { time: 0, duration: 30, change: -10, type: 'quad', method: 'out', startValue: this.position.y }
            this.elevateTimer = this.registerTimer(createTimer(30, function(){
                this.position.y = easing.process(this.elevation);
                this.needRecalcRenderProperties = true;

                this.elevation.time++
                if(this.elevation.time == 1){
                    this.top.img = this.topImgElevated;
                }

                if(this.elevation.time > this.elevation.duration){
                    this.unregTimer(this.elevateTimer );
                }
            }, this, true))
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
        this.right = this.addChild(new GO({
            position: new V2(this.sWidth/2 + this.rSize.x/2, -this.size.y/2 + this.rSize.y/2),
            size: this.rSize,//new V2(this.shift, this.tHeight + this.size.y),
            img: this.rightImg,
            renderValuesRound: false
        }))
        this.top = this.addChild(new GO({
            position: new V2(),
            size: this.size,
            img: this.topImg,
            renderValuesRound: false
        }))

        let fSize = new V2(this.size.x - this.rSize.x, this.rSize.y - this.size.y);
        this.front = this.addChild(new GO({
            position: new V2(-this.rSize.x/2, this.size.y/2 + fSize.y/2),
            size: fSize,
            img: this.frontImg,
            renderValuesRound: false
        }))
    }
}