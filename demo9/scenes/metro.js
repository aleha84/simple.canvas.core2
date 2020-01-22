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
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let p0 = new V2(29,199);
                    let dir0 = p0.direction(new V2(60,138))
                    let p1 = new V2(130, 0); //raySegmentIntersectionVector2(p0, dir0, {begin: new V2(0,0), end: new V2(size.x*2, 0)});
                    //console.log(p1.toInt())

                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('red');
                    //pp.lineV2(p0, p1);

                    let p0_1 = new V2(199,162);
                    let dir0_1 = p0_1.direction(new V2(159,142))
                    let p1_1 = new V2(-125, 0);//raySegmentIntersectionVector2(p0_1, dir0_1, {begin: new V2(-size.x*10,0), end: new V2(size.x, 0)});
                    //console.log(p1_1.toInt())
                    //pp.lineV2(p0_1, p1_1);

                    let pCenter = new V2(78,102);
                    // segmentsIntersectionVector2_1_noV2(
                    //     {begin: p0, end: p1},
                    //     {begin: p0_1, end: p1_1},
                    // )

                    // console.log(pCenter.toInt());
                    // hlp.setFillStyle('green');
                    // hlp.dot(pCenter.toInt())

                    pp.lineV2(p0, pCenter);
                    pp.lineV2(p0_1, pCenter);


                    //
                    let refCircleCenter = new V2(33, 150);
                    let refCircleRadius = 128
                    hlp.setFillStyle('green');

                    hlp.strokeEllipsis(0,360, 0.1, refCircleCenter, refCircleRadius, refCircleRadius);

                    hlp.setFillStyle('blue').dot(0,27).dot(158,121)

                    let circleCenterDirection = pCenter.direction(refCircleCenter);

                    let cTarget = new V2(-14,200); //raySegmentIntersectionVector2(pCenter, pCenter.direction(refCircleCenter), {begin: new V2(-size.x,size.y), end: new V2(size.x, size.y)}).toInt();
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
                })
            }
        }))
    }
}