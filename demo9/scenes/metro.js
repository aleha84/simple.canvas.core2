class Demo9Metro2Scene extends Scene {
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
        this.girl = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo9Metro2Scene.models.person)
                }));
            }
        }), 5)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let bl = new V2(0, this.size.y)
                let br = new V2(this.size.x, this.size.y)
                let pCenter = new V2(78,102);
                let leftLine = {begin: new V2(0,0), end: bl};
                let rightLine = {begin: new V2(this.size.x,0), end: br};
                let topLine = {begin: new V2(0,0), end: new V2(this.size.x, 0)};
                let bottomLine = {begin: new V2(0,this.size.y), end: new V2(this.size.x, 0)};
                
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillStyle('#533B1B').rect(0,0,size.x, size.y);
                    let pp = new PerfectPixel({ctx});
/*

                    let p0 = new V2(29,199);
                    let dir0 = p0.direction(new V2(60,138))
                    let p1 = new V2(130, 0); //raySegmentIntersectionVector2(p0, dir0, {begin: new V2(0,0), end: new V2(size.x*2, 0)});
                    //console.log(p1.toInt())

                    
                    pp.setFillStyle('red');
                    //pp.lineV2(p0, p1);

                    let p0_1 = new V2(199,162);
                    let dir0_1 = p0_1.direction(new V2(159,142))
                    let p1_1 = new V2(-125, 0);//raySegmentIntersectionVector2(p0_1, dir0_1, {begin: new V2(-size.x*10,0), end: new V2(size.x, 0)});
                    //console.log(p1_1.toInt())
                    //pp.lineV2(p0_1, p1_1);

                    
                    // segmentsIntersectionVector2_1_noV2(
                    //     {begin: p0, end: p1},
                    //     {begin: p0_1, end: p1_1},
                    // )

                    // console.log(pCenter.toInt());
                    // hlp.setFillStyle('green');
                    // hlp.dot(pCenter.toInt())

                    pp.lineV2(p0, pCenter);
                    pp.lineV2(p0_1, pCenter);

*/
                    

                    let refCircleCenter = new V2(31, 108);
                    
                    let steps = 5;
                    let circleRadiusChange = easing.createProps(steps, 0, fast.r(size.divide(2).distance(new V2(size.x, 0))), 'quad', 'in');
                    let cOriginYShiftChange = easing.createProps(steps, 0, 20, 'quad', 'in');
                    let cOriginXShiftChange = easing.createProps(steps, 0, -40, 'quad', 'in');
                    hlp.setFillStyle('#3A2916')
                    for(let i =1; i <= steps; i++){
                        circleRadiusChange.time = i;
                        cOriginYShiftChange.time = i;
                        cOriginXShiftChange.time = i;
                        let r = fast.r(easing.process(circleRadiusChange));
                        let yShift = fast.r(easing.process(cOriginYShiftChange));
                        let xShift = fast.r(easing.process(cOriginXShiftChange));
                        let cOrigin = new V2(pCenter.x + xShift, pCenter.y + yShift)
                        hlp.strokeEllipsis(0,360, 0.1, cOrigin, r, r);
                    }

                    //hlp.setFillColor('#382A1A').rect(0, pCenter.y, size.x, size.y);
                    
                    pp.setFillStyle('#1E0E05');
                    pp.fillByCornerPoints([new V2(199,129), pCenter, new V2(199,146)])

                    pp.setFillStyle('#382A1A');
                    pp.fillByCornerPoints([new V2(66,199), pCenter, new V2(165,199)])

                    pp.setFillStyle('#592913');
                    pp.fillByCornerPoints([new V2(0,108), pCenter, new V2(0,122)])
                    
                    pp.setFillStyle('#382416');
                    pp.fillByCornerPoints([new V2(0,119), pCenter, new V2(0,147)])

                    pp.setFillStyle('#592913');
                    pp.fillByCornerPoints([new V2(0,141), pCenter, new V2(41,199), bl])

                    pp.setFillStyle('#382416');
                    pp.fillByCornerPoints([new V2(42,199), pCenter, new V2(70,199)])

                    pp.setFillStyle('#382416');
                    pp.fillByCornerPoints([new V2(199,163), pCenter, new V2(154,199), br])

                    pp.setFillStyle('#592913');
                    pp.fillByCornerPoints([new V2(199, 139), pCenter, new V2(199,162)])

                    pp.setFillStyle('#382814');
                    pp.fillByCornerPoints([new V2(28, 199), pCenter, new V2(42,199)])

                    pp.setFillStyle('#1D1509');
                    pp.fillByCornerPoints([new V2(8, 199), pCenter, new V2(33,199)])

                    pp.setFillStyle('#090603');
                    pp.fillByCornerPoints([new V2(28, 199), pCenter, new V2(33,199)])

                    pp.setFillStyle('#1D1509');
                    pp.fillByCornerPoints([new V2(0, 135), pCenter, new V2(0,144)])

                    pp.setFillStyle('#090603');
                    pp.fillByCornerPoints([new V2(0, 140), pCenter, new V2(0,144)])

                    //hlp.setFillStyle('blue').dot(0,27).dot(104,61).dot(refCircleCenter.x, refCircleCenter.y)
                    //
                    /*
                    
                    hlp.setFillStyle('green');
                    let refCircleRadius = 87
                    hlp.strokeEllipsis(0,360, 0.1, refCircleCenter, refCircleRadius, refCircleRadius);

                     

                    let circleCenterDirection = pCenter.direction(refCircleCenter);

                    let cTarget = new V2(0,112);
                    //raySegmentIntersectionVector2(pCenter, pCenter.direction(refCircleCenter), leftLine).toInt();
                    let distanceToRefCircleCenter = fast.r(pCenter.distance(refCircleCenter));
                    let distanceToCircleTarget = fast.r(pCenter.distance(cTarget));

                    let circleRadiusChange = easing.createProps(distanceToRefCircleCenter, 0, refCircleRadius, 'quad', 'in');
                    let circleDistanceChange = easing.createProps(10, 0, distanceToCircleTarget, 'quad', 'in');

                    hlp.setFillStyle('yellow');
                    for(let i = 1; i <= 10; i++){
                        circleDistanceChange.time = i;
                        let distanceFromPCenter = fast.r(easing.process(circleDistanceChange));
                        circleRadiusChange.time = distanceFromPCenter;
                        let radius = fast.r(easing.process(circleRadiusChange));

                        hlp.strokeEllipsis(0,360, 0.1, pCenter.add(circleCenterDirection.mul(distanceFromPCenter)).toInt(), radius, radius);
                    }

                    console.log(cTarget);
                    */


                })
            }
        }))
    }
}