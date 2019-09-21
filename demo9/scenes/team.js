class Demo9TeamScene extends Scene {
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
        this.backgroundRenderImage(this.bgImage);
    }

    start(){
        this.bgImage = createCanvas(this.viewport, (ctx, size, hlp) => {
            let floorHeight = 34;
            hlp
                .setFillColor('#969785').rect(0, size.y-floorHeight, size.x, floorHeight)
                .setFillColor('#474E55').rect(0,0,size.x, size.y-floorHeight)
        })

        this.hostPostion = new V2(121, 87);

        this.addGo(new GO({ //body
            position: this.hostPostion,
            size: new V2(52,70),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('white').rect(0,0,size.x, size.y)
                    ctx.drawImage(PP.createImage(teamImages.hostBody),0,0)
                })
            }
        }), 10)

        this.addGo(new GO({ //hands
            position: this.hostPostion,
            size: new V2(52,70),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('white').rect(0,0,size.x, size.y)
                    ctx.drawImage(PP.createImage(teamImages.hostHands),0,0)
                })
            }
        }), 21)

        this.addGo(new GO({
            position: new V2(108, 135),
            size: new V2(this.viewport.x*0.7, 60).toInt(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let topColor = '#905F43';
                    let frontColor = '#623B28';
                    let sideColor = '#251715'
                    let pp = new PerfectPixel({context: ctx});

                    let shift = 20;
                    let tableTopHeight = 20;

                    hlp.setFillColor(topColor);
                    
                    for(let i = 0; i < shift; i++){
                        pp.line(i,tableTopHeight, i+shift, 0);
                    }

                    hlp.rect(shift, 0, size.x - shift*2, tableTopHeight+1);

                    let dots = [];
                    for(let i = 0; i < shift; i++){
                        dots = pp.line(size.x-shift*2 + i,tableTopHeight,size.x-shift*2+ i+shift, 0);
                    }

                    hlp.setFillColor(sideColor)
                    for(let i = 0; i < dots.length; i++){
                        hlp.rect(dots[i].x, dots[i].y+1, 1, size.y-tableTopHeight)
                    }

                    hlp.setFillColor(frontColor).rect(0,tableTopHeight+1, size.x-shift , size.y-tableTopHeight)

                    pp.clear = true;
                    for(let i = 0; i < fast.r(tableTopHeight/2);i++){
                        //pp.line(0, i, size.x-shift - 30 - (i < 5 ? i : 5+Math.pow(i-4,2)), i)
                        pp.line(0, i, size.x-shift - 30 - i, i)
                    }
                    

                })
            }
        }), 20)

        //table items
        this.addGo(new GO({
            position: new V2(165,105),
            size: new V2(30,25),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(PP.createImage(teamImages.laptop),0,0)
                })

                //this.size = this.size.mul(1.5).toInt()
            }
        }), 30)
    }
}