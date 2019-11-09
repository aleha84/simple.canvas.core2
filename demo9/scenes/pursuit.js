class Demo9PursuitScene extends Scene {
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
        this.perspectiveCenter = new V2(230,100)
        this.pistolSize = new V2(200, 200)
        this.pistol = this.addGo(new GO({
            position: new V2().add(this.pistolSize.divide(2)),
            size: this.pistolSize,
            init() {
                this.img = PP.createImage(shootModels.handWithPistol)
            }
        }), 10)

        this.bgImage = createCanvas(this.viewport, (ctx, size, hlp) => {
            let tl = new V2(190, 30)
            let dSize = new V2(65,120)
            
            let topLine = {begin: new V2(0,0), end: new V2(size.x, 0)};
            let bottomLine = {begin: new V2(0,size.y), end: new V2(size.x, size.y)};
            let rightLine = {begin: new V2(size.x,0), end: new V2(size.x, size.y)};

            hlp.setFillColor('#08090E').rect(0,0,size.x, size.y);
            hlp.setFillColor('#DDDDDD').rect(tl.x, tl.y, dSize.x, dSize.y)
            //hlp.setFillColor('#F4F4F4').rect(190, 30, 80,140)

            let pp = new PerfectPixel({ctx});
            let vChange = easing.createProps(tl.x, 0, 90, 'expo', 'in');
            pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }

            let leftPoints = [new V2(0,0), raySegmentIntersectionVector2(this.perspectiveCenter.add(new V2(20,0)), this.perspectiveCenter.add(new V2(20,0)).direction(tl), topLine), tl, tl.add(new V2(0, dSize.y)),
                raySegmentIntersectionVector2(this.perspectiveCenter.add(new V2(20,0)), this.perspectiveCenter.add(new V2(20,0)).direction(tl.add(new V2(0, dSize.y))), bottomLine), new V2(0, size.y)
            ]

             pp.fillByCornerPoints(leftPoints)


             vChange = easing.createProps(this.viewport.x - (tl.x+dSize.x), 0, 90, 'quad', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(this.viewport.x - x);
                let v = easing.process(vChange);
                //v = fast.r(v/1)*1;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             let rightPoints = [tl.add(new V2(dSize.x, 0)), raySegmentIntersectionVector2(this.perspectiveCenter.add(new V2(-20,0)), this.perspectiveCenter.add(new V2(-20,0)).direction(tl.add(new V2(dSize.x, 0))), topLine), 
                new V2(size.x, 0), this.viewport, raySegmentIntersectionVector2(this.perspectiveCenter.add(new V2(-20,0)), this.perspectiveCenter.add(new V2(-20,0)).direction(tl.add(dSize)), bottomLine),
                tl.add(dSize)
            ]

             pp.fillByCornerPoints(rightPoints)

             vChange = easing.createProps(tl.y, 30, 90, 'quad', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(y);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             let topPoints = [leftPoints[1], rightPoints[1], tl.add(new V2(dSize.x, 0)), tl]

             pp.fillByCornerPoints(topPoints)

             vChange = easing.createProps(this.viewport.y - (tl.y+dSize.y), 0, 100, 'quad', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(this.viewport.y - y);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             let bottomPoints = [tl.add(new V2(0, dSize.y)), tl.add(dSize), rightPoints[3], leftPoints[4]]

             pp.fillByCornerPoints(bottomPoints)

             vChange = easing.createProps(tl.x, 0, 50, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([tl.add(new V2(0, dSize.y)), leftPoints[4], leftPoints[4].add(new V2(-15, 0)), tl.add(new V2(0, dSize.y-5))])

             vChange = easing.createProps(tl.x, 0, 30, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([new V2(156,10), new V2(156, 178), new V2(131,199), new V2(122,199), new V2(122,0), new V2(145,0)])
             hlp.setFillColor('#000').rect(121, 0, 1, size.y)

             vChange = easing.createProps(tl.x, 0, 20, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                //v = fast.r(v/2)*2;
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([new V2(126,0), new V2(135,0), new V2(153,13), new V2(153,172), new V2(126,191)])
             hlp.setFillColor('#000').rect(153, 13, 1, 159)

             pp.fillStyleProvider = undefined;
             pp.lineV2(new V2(135,0),new V2(153,13))
             pp.line(153,172,126,191)



        })

        // this.doorWay = this.addGo(new GO({
        //     position: new V2(230,80),
        //     size: new V2(60,140),
        //     init() {
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             hlp.setFillColor('#F4F4F4').rect(0,0,size.x, size.y)
        //         })
        //     }
        // }), 1)

        this.criminal = this.addGo(new GO({
            position: this.perspectiveCenter.add(new V2(0,5)),
            size: new V2(50,120),//.mul(0.8),
            init() {
                this.img = PP.createImage(shootModels.criminal)
            }
        }), 2)
    }
}