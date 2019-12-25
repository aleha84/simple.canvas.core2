class Demo9PursuitScene extends Scene {
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

//behind steps
hlp.setFillColor('#FEFEFE').rect(tl.x, tl.y, dSize.x, dSize.y-10);
hlp.setFillColor('#E9E9E9').rect(0,85,size.x, 2).rect(0,121,size.x, 2);
hlp.setFillColor('#F2F2F2').rect(212, tl.y, 45, 100).rect(tl.x,tl.y,30,40)
hlp.setFillColor('#E1E1E1').rect(tl.x+54,0,1,50).rect(tl.x, tl.y+10, 55, 25);
hlp.setFillColor('#979797').rect(tl.x, tl.y+11,54,1)


let vChange = easing.createProps(43, 85, 94, 'quad', 'in');
pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(y-28);
                pp.setFillStyle(colors.hsvToHex([0,0,easing.process(vChange)]));
            }
pp.fillByCornerPoints([new V2(188,29), new V2(208,28), new V2(210,71), new V2(187,71)])
pp.fillStyleProvider = undefined;
hlp.setFillColor('#B2B2B2');
pp.lineV2(new V2(208,28), new V2(210,71))
hlp.setFillColor('#878787').rect(187,71,24,1)



hlp.setFillColor('#707070').rect(209,101,1,42).rect(208,101,3,1).setFillColor('#B5B5B5').rect(210, 120, 1,20).setFillColor('#D3D3D3').rect(211, 130, 1, 10)



//steps
            let stepTl = new V2(212,134)
            let stepColor = '#AFAFAF';
            let stepColor2 = '#D7D7D7'
            let stepHeight = 8;
            let stepHeight2 = 3;
            let stepWidth = 45;
            let stepHeight2Change = easing.createProps(8, 2, 0, 'quad', 'out');

            for(let i = 0; i < 9; i++){
                stepHeight2Change.time = i;
                stepHeight2 = fast.r(easing.process(stepHeight2Change));
                let w = fast.r(stepWidth)
                hlp.setFillColor(stepColor).rect(stepTl.x, stepTl.y, w , stepHeight);
                hlp.setFillColor(stepColor2).rect(stepTl.x, stepTl.y-stepHeight2,w , stepHeight2);
                hlp.setFillColor('#828282').rect(stepTl.x, stepTl.y, w , 1)

                hlp.setFillColor('rgba(0,0,0,0.05)').rect(stepTl.x, stepTl.y+stepHeight-1, w, 1).rect(stepTl.x+w-1, stepTl.y, 1, stepHeight-1)
                stepTl.y-=(stepHeight+stepHeight2);
                stepWidth-=1;
            }

            let v = 100;
            let y1 = 149;
            for(let i =0; i < 6; i++){
                hlp.setFillColor(colors.hsvToHex([0,0,v-=2])).rect(180,y1--,100, 1)
            }

            hlp.setFillColor('rgba(0,0,0,0.1)');
            //pp.fillByCornerPoints([new V2(209,154), new V2(209,148), new V2(206,151)])
            pp.lineV2(new V2(209,143), new V2(209,148))
            pp.lineV2(new V2(208,146), new V2(208,150))

        hlp.setFillColor('#575757');
pp.line(211,100,213,38)
hlp.setFillColor('#B6B6B6');
pp.line(212,100,214,38)

            vChange = easing.createProps(tl.x, 5, 90, 'expo', 'in');
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

//левый бортик
             vChange = easing.createProps(tl.x, 0, 50, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([tl.add(new V2(0, dSize.y)), leftPoints[4], leftPoints[4].add(new V2(-15, 0)), tl.add(new V2(0, dSize.y-5))])

             vChange = easing.createProps(tl.x, 0, 25, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                pp.setFillStyle(colors.hsvToHex([0,0,easing.process(vChange)]));
            }

            pp.lineV2(leftPoints[4].add(new V2(-15, 0)), tl.add(new V2(0, dSize.y-5)))

//door
             vChange = easing.createProps(tl.x, 0, 30, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([new V2(156,10), new V2(156, 178), new V2(131,199), new V2(122,199), new V2(122,0), new V2(145,0)])
             hlp.setFillColor('#000').rect(120, 0, 2, size.y)

             vChange = easing.createProps(tl.x, 0, 20, 'expo', 'in');
             pp.fillStyleProvider = (x, y) => {
                vChange.time = fast.r(x);
                let v = easing.process(vChange);
                pp.setFillStyle(colors.hsvToHex([0,0,v]));
            }
             pp.fillByCornerPoints([new V2(126,0), new V2(135,0), new V2(153,13), new V2(153,169), new V2(126,187)])
             hlp.setFillColor('#000').rect(153, 13, 1, 156)

             pp.fillStyleProvider = undefined;
             pp.lineV2(new V2(135,0),new V2(153,13))
             pp.line(153,169,126,187)

hlp.setFillColor('rgba(0,0,0,0.2)');

let  points = [[164,25,6],[173,71,3],[101,47,14],[168,80, 15], [166,115, 10], [181,95, 23], [110, 75,5], [77,10,30], [57,87,28], [24,40, 50], [177,20, 3], [185,29,4], [263,54,11], [277,29,23], [272,70, 14], [288,117, 35],
[262,127,4], [271,147,9], [280,108, 9]]
points.forEach(p => hlp.rect(p[0], p[1], 1, p[2]))

hlp.setFillColor('rgba(0,0,0,0.1)');
points = [[189,7,15], [227,10, 10], [238,20, 5], [218,23, 4]]
points.forEach(p => hlp.rect(p[0], p[1], p[2], 1))
             

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
            position: this.perspectiveCenter.add(new V2(0,100)),
            size: new V2(100,100),//.mul(0.8),
            init() {
                this.img = PP.createImage(shootModels.criminalShadow)
            }
        }), 3)

        this.criminal = this.addGo(new GO({
            position: this.perspectiveCenter.add(new V2(0,5)),
            size: new V2(50,120),//.mul(0.8),
            init() {
                this.img = PP.createImage(shootModels.criminal)
            }
        }), 3)
    }
}