class Demo9BikeScene extends Scene {
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
        this.roadHeight = this.viewport.y*0.2;

        this.sky = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,(this.viewport.y - this.roadHeight)/2 ),
            size: new V2(this.viewport.x,this.viewport.y - this.roadHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#111F35').rect(0,0,size.x, size.y);

                    hlp.setFillColor('#162945').rect(0,size.y-33, size.x, 2)
                    .rect(0,size.y-36, size.x, 1)
                    .rect(0,size.y-39, size.x, 1)
                    .rect(0,size.y-30, size.x, 30)

                    hlp.setFillColor('#1D3559').rect(0,size.y-15, size.x, 15)
                    .rect(0,size.y-17, size.x, 1)
                    //.rect(size.x/2 - 20, size.y - 19, 40, 1)
                    hlp.setFillColor('#203B64').rect(0,size.y-8, size.x, 8)
                    .rect(0,size.y-10, size.x, 1)
                    //.rect(size.x/3,size.y-12, size.x/3, 1)
                    hlp.setFillColor('#23416E')
                    .rect(0,size.y-2,size.x, 2)
                    .rect(size.x/4,size.y-4,size.x/2, 1);  
                    
                    hlp.setFillColor('#0E1B2D').rect(0,0,size.x, 80).rect(0,83,size.x, 2).rect(0,87,size.x, 1).rect(0,90,size.x, 1)
                    hlp.setFillColor('#0B1523').rect(0,0,size.x, 30).rect(0,33, size.x, 3).rect(0,38, size.x, 2).rect(0,42, size.x, 1)
                })
                //#00003C
                //#E79D56
            }
        }), 1)

        // this.bike = this.addGo(new GO({
        //     position: new V2(70,135),
        //     size: new V2(100,100),
        //     init() {
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
        //         })
        //     }
        // }), 30)

        this.road = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,this.viewport.y - (this.roadHeight/2)),
            size: new V2(this.viewport.x,this.roadHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#2F3A3F').rect(0,0,size.x, size.y);
                    hlp.setFillColor('#283135')//.rect(0,0,size.x, 1)
                    .rect(0,0,size.x/2 - 10, 1).rect(size.x - size.x/2 + 10,0,size.x/2 - 10, 1)
                    .rect(0,1,size.x/4, 1).rect(0,2,size.x/8, 1)
                    .rect(size.x-size.x/4,1,size.x/4, 1).rect(size.x-size.x/8,2,size.x/8, 1)
                    // .rect(size.x/2-100,0,200, size.y-38)
                    // .rect(size.x/2-80,0,160, size.y-37)
                    // .rect(size.x/2-60,size.y-36,120, 1)
                    //hlp.setFillColor('#1F2528').rect(size.x/2-80,0,160, size.y-39)
                    //.rect(size.x/2-50,0,100, size.y-38)
                    //hlp.setFillColor('#171C1E').rect(size.x/2-5,0,10, size.y-39)
                    // hlp.setFillColor('#485359').rect(size.x/2 - 40,0,80, size.y-39);
                    // hlp.setFillColor('#2F3A3F').rect(size.x/2 - 20,0,40, size.y-39)
                    /*
                    hlp.setFillColor('#576166').rect(0,0,size.x, size.y);
                    // hlp.setFillColor('#899299').rect(0,0,size.x, size.y);
                    // hlp.setFillColor('#7E868C').rect(0,0,size.x, size.y-5);
                    // hlp.setFillColor('#676E72').rect(0,0,size.x, size.y-20);
                    // hlp.setFillColor('#576166').rect(0,0,size.x, size.y-28);
                     hlp.setFillColor('#485359').rect(0,0,size.x, size.y-33);
                    hlp.setFillColor('#2F3A3F').rect(0,0,size.x, size.y-38);
                    */
                    hlp.setFillColor('#090909');
                    let pp = new PerfectPixel({ctx});
                    //2D2D2D
                    // pp.lineV2(new V2(this.size.x/2 + 5, 0), new V2(this.size.x, 8)).forEach(p => {
                    //     hlp.rect(p.x, 0, 1, p.y)
                    // })

                    // pp.lineV2(new V2(this.size.x/2 - 5, 0), new V2(0, 8)).forEach(p => {
                    //     hlp.rect(p.x, 0, 1, p.y)
                    // })

                })

                this.addChild(new GO({
                    size: this.size, 
                    position: new V2(),
                    easingType: 'expo',
                    method: 'in',
                    time: 20,
                    init() {
                        this.dividers = [];
                        this.vLines = [];
                        this.dividersCalmdown = 0;
                        this.perspectiveCenter = new V2(this.size.x/2, 0).toInt()
                        this.dividerTargetPosition = new V2(this.size.x/2 - 50, this.size.y).toInt();
                        this.dividerDirection = this.perspectiveCenter.direction(this.dividerTargetPosition);

                        this.dp1 = this.dividerTargetPosition.clone();
                        this.dp2 = this.dividerTargetPosition.add(this.dividerDirection.mul(45)).toInt();
                        this.dp3 = this.dividerTargetPosition.add(new V2(20, 0));
                        this.dp3PerspectiveDirection = this.perspectiveCenter.direction(this.dp3);
                        let dp2BasedLine = { begin: this.dp2, end: this.dp2.add(new V2(this.size.x)) }
                        this.dp4 = raySegmentIntersectionVector2(this.dp3, this.dp3PerspectiveDirection, dp2BasedLine).toInt();

                        this.timer = this.regTimerDefault(30, () => {
                            if(this.dividersCalmdown-- == 0){
                                this.dividersCalmdown = 7;
                                let d = {
                                    alive: true,
                                    position: new V2(),
                                    // width: 20,
                                    // length: 45,
                                    p1: new V2(), p2: new V2(), p3: new V2(), p4: new V2(),
                                    color: '#DDD',
                                    hsv: [0,0,100],
                                    vClamps: [45,80]
                                };

                                d.p1xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp1.x, this.easingType, this.method, () => { d.alive = false; })
                                d.p1yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp1.y, this.easingType, this.method)
                                d.p2xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp2.x, this.easingType, this.method)
                                d.p2yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp2.y, this.easingType, this.method)
                                d.p3xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp3.x, this.easingType, this.method)
                                d.p3yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp3.y, this.easingType, this.method)
                                d.p4xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp4.x, this.easingType, this.method)
                                d.p4yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp4.y, this.easingType, this.method)

                                d.vChange = easing.createProps(this.time, d.vClamps[0], d.vClamps[1], this.easingType, this.method)

                                this.dividers.push(d)
                            }

                            for(let i = 0; i < 2; i++)
                            {let vLine = {
                                alive: true,
                                p1: new V2(),p2: new V2(),
                                //hsv: [348,39,26],
                                hsv: [0,0,50],
                                //sClamps: [0,39],
                                vClamps: [20,5],
                                color:undefined,
                            }

                            let time = this.time;
                            let p1 = new V2(getRandomInt(-this.size.x/2, this.size.x*1.5), this.size.y);
                            let p2 = p1.add(this.perspectiveCenter.direction(p1).mul(getRandomInt(10,40))).toInt();
                            time = fast.r(time + 40*(Math.abs(p1.x-this.perspectiveCenter.x)/this.size.x));
                            vLine.p1xChange = easing.createProps(time, this.perspectiveCenter.x, p1.x, this.easingType, this.method, () => { vLine.alive = false; })
                            vLine.p1yChange = easing.createProps(time, this.perspectiveCenter.y, p1.y, this.easingType, this.method)
                            vLine.p2xChange = easing.createProps(time, this.perspectiveCenter.x, p2.x, this.easingType, this.method)
                            vLine.p2yChange = easing.createProps(time, this.perspectiveCenter.y, p2.y, this.easingType, this.method)
                            //vLine.sChange = easing.createProps(time, vLine.sClamps[0], vLine.sClamps[1], this.easingType, this.method)
                            vLine.vChange = easing.createProps(time, vLine.vClamps[0], vLine.vClamps[1], this.easingType, this.method)

                            this.vLines.push(vLine);}

                            for(let i = 0; i < this.dividers.length; i++){
                                let d = this.dividers[i];
                                easing.commonProcess({context: d, propsName: 'p1xChange', round: true, setter: (v) => d.p1.x = v})
                                easing.commonProcess({context: d, propsName: 'p1yChange', round: true, setter: (v) => d.p1.y = v})
                                easing.commonProcess({context: d, propsName: 'p2xChange', round: true, setter: (v) => d.p2.x = v})
                                easing.commonProcess({context: d, propsName: 'p2yChange', round: true, setter: (v) => d.p2.y = v})
                                easing.commonProcess({context: d, propsName: 'p3xChange', round: true, setter: (v) => d.p3.x = v})
                                easing.commonProcess({context: d, propsName: 'p3yChange', round: true, setter: (v) => d.p3.y = v})
                                easing.commonProcess({context: d, propsName: 'p4xChange', round: true, setter: (v) => d.p4.x = v})
                                easing.commonProcess({context: d, propsName: 'p4yChange', round: true, setter: (v) => d.p4.y = v})

                                easing.commonProcess({context: d, propsName: 'vChange', round: true, setter: (v) => {
                                    v = fast.f(v/2)*2;
                                    d.color = colors.hsvToHex([d.hsv[0],d.hsv[1], v])
                                }})
                            }

                            for(let i = 0; i < this.vLines.length; i++){
                                let v = this.vLines[i];
                                easing.commonProcess({context: v, propsName: 'p1xChange', round: true, setter: (value) => v.p1.x = value})
                                easing.commonProcess({context: v, propsName: 'p1yChange', round: true, setter: (value) => v.p1.y = value})
                                easing.commonProcess({context: v, propsName: 'p2xChange', round: true, setter: (value) => v.p2.x = value})
                                easing.commonProcess({context: v, propsName: 'p2yChange', round: true, setter: (value) => v.p2.y = value})

                                easing.commonProcess({context: v, propsName: 'vChange', round: true, setter: (s) => {
                                    s = fast.f(s/2)*2;
                                    //v.color = colors.hsvToHex([v.hsv[0], s, v.hsv[2]])
                                    v.color = colors.hsvToHex([v.hsv[0], v.hsv[1], s])
                                }})

                                    v.visible = v.p1xChange? v.p1xChange.time > v.p1xChange.duration*2/3: true;
                                    
                            }

                            this.dividers = this.dividers.filter(d => d.alive);
                            this.vLines = this.vLines.filter(d => d.alive);

                            this.createImage();        
                        })
                    },
                    createImage() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PerfectPixel({ctx})

                            for(let i = 0; i < this.vLines.length; i++){
                                let v = this.vLines[i];
                                if(!v.visible) continue;

                                hlp.setFillColor(v.color);
                                pp.lineV2(v.p1, v.p2)
                            }

                            for(let i = 0; i < this.dividers.length; i++){
                                let d = this.dividers[i];
                                hlp.setFillColor(d.color);
                                let leftPoints = pp.lineV2(d.p1, d.p2)
                                let rightPoints = pp.lineV2(d.p3, d.p4)

                                let linesByY = [];
                                for(let i = 0; i < Math.max(leftPoints.length, rightPoints.length); i++){
                                    if(leftPoints[i]){
                                        if(!linesByY[leftPoints[i].y]){
                                            linesByY[leftPoints[i].y] = { from: leftPoints[i].x };
                                        }
                                        else {
                                            linesByY[leftPoints[i].y].from = leftPoints[i].x;
                                        }

                                        if(linesByY[leftPoints[i].y].from && linesByY[leftPoints[i].y].to && !linesByY[leftPoints[i].y].drawn){
                                            linesByY[leftPoints[i].y].drawn = true;
                                            hlp.rect(linesByY[leftPoints[i].y].from, leftPoints[i].y, linesByY[leftPoints[i].y].to - linesByY[leftPoints[i].y].from, 1);
                                        }
                                    }
                                    if(rightPoints[i]){
                                        if(!linesByY[rightPoints[i].y]){
                                            linesByY[rightPoints[i].y] = { to: rightPoints[i].x };
                                        }
                                        else {
                                            linesByY[rightPoints[i].y].to = rightPoints[i].x;
                                        }

                                        if(linesByY[rightPoints[i].y].from && linesByY[rightPoints[i].y].to && !linesByY[rightPoints[i].y].drawn){
                                            linesByY[rightPoints[i].y].drawn = true;
                                            hlp.rect(linesByY[rightPoints[i].y].from, rightPoints[i].y, linesByY[rightPoints[i].y].to - linesByY[rightPoints[i].y].from, 1);
                                        }
                                    }
                                }
                                // pp.lineV2(d.position, d.position.add(this.dividerDirection.mul(d.length)).toInt()).forEach(p => {
                                //     hlp.rect(p.x, p.y, d.width, 1);
                                // })
                            }
                        })
                        
                    }
                }))
            }
        }), 1)

        this.perspectiveRightSize = new V2(this.viewport.x/2, this.viewport.y-this.roadHeight).toInt();

        this.perspectiveLeft = this.addGo(new Demo9PerspectiveGO({
            size: this.perspectiveRightSize,
            position: new V2(this.viewport.x/2 - this.perspectiveRightSize.x/2, this.perspectiveRightSize.y/2).toInt(),
            easingType: 'expo',
            method: 'in',
            time: 80,
            frontalTime: 70,
            perspectiveCenter: new V2(this.perspectiveRightSize.x, this.perspectiveRightSize.y),
            staticContent: {
                img: createCanvas(new V2(this.viewport.x/2,20), (ctx, size, hlp) => {
                    hlp.setFillColor('#0E171E')
                    let pp = new PerfectPixel({ctx});
                    let points = pp.lineV2(new V2(0, 0), new V2(size.x,size.y));
                    let sChange = easing.createProps(size.x, 70, 0, 'sin', 'out');
                    let vChange = easing.createProps(size.x, 15, 0, 'sin', 'out');
                    let hsv = [206,50,15];
                    for(let i = 0; i < points.length; i++){
                        sChange.time = points[i].x;
                        hlp.setFillColor(colors.hsvToHex(
                            [hsv[0], 
                            fast.r(easing.process(sChange)/10)*10, 
                            hsv[2]])
                        ).rect(points[i].x, points[i].y, 1, size.y)
                    }
                }),
                position: new V2(0,this.perspectiveRightSize.y-20)
            },
            frontalItemGenerator() {
                let tl = new V2(0, 0);

                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let p1 = new V2(0,this.size.y-20 + 1)
                let fencePart = {
                    type: 'stroke',
                    subType: 'rect',
                    p1: p1,
                    p2: new V2(1, this.size.y),
                    forceWidth: true,
                    color: '#0A1219',
                    visible: false,
                    visibleFrom: this.frontalTime/10
                }

                // let upperFencePart = {
                //     type: 'stroke',
                //     p1: p1.add(new V2(5,-10)),
                //     p2: p1.clone(),
                //     forceWidth: true,
                //     color: '#0A1219',
                //     visible: false,
                //     visibleFrom: this.frontalTime/10
                // }

                item.parts.push(fencePart);
                //item.parts.push(upperFencePart);

                return item;
            },
            itemGenerator() {
                let tl = new V2(-150, 0);
                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };
                
                let p1Y = getRandomInt(-200,100);
                let rWidth = getRandomInt(50, 100);

                let rect = {
                    type: 'rect',
                    tl: new V2(-100,p1Y),
                    size: new V2(rWidth+100,item.size.y + Math.abs(p1Y)),
                    hsv: [208,100,18],
                    sClamps: [80,100],
                    vClamps: [13,19],
                    visible: true,
                }
                

                let length = getRandomInt(30, 90);
                
                let p1 = new V2(rWidth, p1Y);
                let p1perspectiveDirection = tl.add(p1).direction(this.perspectiveCenter);
                let p2 = p1.add(p1perspectiveDirection.mul(length));
                let p3 = new V2(p1.x, item.size.y)
                let p4 = new V2(p2.x, item.size.y)
                let side = {
                    type: 'side',
                    hsv: [207,100,22],
                    sClamps: [80,100],
                    vClamps: [17,23],
                    p1: p1.clone(),
                    p2: p2.clone(),
                    p3: p3.clone(),
                    p4: p4.clone(), 
                    visible: false,
                    visibleFrom: this.time*1/3,
                    update() {
                        side.p1.x = rect.tl.x+rect.size.x-1;
                        side.p3.x = side.p1.x;
                    }
                }
                item.parts.push(side)
                item.parts.push(rect)
                item.parts.push({
                    type: 'stroke',
                    p1: p2,
                    p2: p4,
                    hsv: [207,100,27],
                    sClamps: [80,100],
                    vClamps: [22,28],
                    visible: false,
                    visibleFrom: this.time/2
                })

                let sideLinesHeight = 5;
                let upperShift = 15;
                let linesGap = 10;
                let leftShift = 5;
                let rightShift = 7;
                let count = fast.r((item.size.y-p1.y-upperShift)/(sideLinesHeight+linesGap));
                let halfCount = fast.r(count/2)
                let currentY = p1.y+upperShift;
                let vLine = {begin: p2.add(new V2(-rightShift, -200)), end: p4.add(new V2(-rightShift, 200))};
                for(let i = 0; i < count;i++){
                    let leftPoint = new V2(p1.x+leftShift, currentY);
                    let leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter);

                    let _p1 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));

                    let rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    let distance = leftPoint.distance(rightPoint);

                    let _p2 = leftPoint.add(leftPointPerspectiveDirection.mul((distance)));
                    currentY+=sideLinesHeight;

                    // leftPoint = new V2(p1.x+leftShift, currentY);
                    // leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);
                    // let _p3 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));
                    // rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    // distance = leftPoint.distance(rightPoint);

                    // let _p4 = leftPoint.add(leftPointPerspectiveDirection.mul(distance));

                    currentY+=linesGap;
                    let part = {
                        type: 'stroke',
                        p1: _p1,
                        p2: _p2,
                        //color: '#00182E',
                        hsv: [208,100,18],
                        sClamps: [80,100],
                        vClamps: [13,19],
                        visible: false,
                        visibleFrom: this.time*3/4
                    };

                    
                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(leftPointPerspectiveDirection.mul(getRandomInt(0,distance)));
                        let wp2 = wp1.add(leftPointPerspectiveDirection.mul(2));
                        let window = {
                            type: 'side',
                            p1: wp1.add(new V2(0,1)),
                            p2: wp2.add(new V2(0,1)),
                            p3: wp1.add(new V2(0,10)),
                            p4: wp2.add(new V2(0,10)), 
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }
                    

                    let hPart = {
                        type: 'stroke',
                        subType: 'rect',
                        p1: leftPoint.add(new V2(-rect.size.x, 0)),
                        p2: leftPoint.add(new V2(-2*rightShift - leftShift, 0)),
                        //color: 'red',
                        hsv: [207,100,22],
                        sClamps: [80,100],
                        vClamps: [17,23],
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*3/4
                    }

                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(new V2(-2*rightShift - leftShift, 0)).add(new V2(-getRandomInt(15, 60), 1))
                        let wp2 = wp1.add(new V2(10,10))
                        let window = {
                            type: 'stroke',
                            subType: 'rect',
                            p1: wp1,
                            p2: wp2,
                            forceHeight: true,
                            forceWidth: true,
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }

                    if(i %3 == 0){
                        part.visible = true;
                        part.visibleFrom = undefined;

                        hPart.visible = true;
                        hPart.visibleFrom = undefined;
                    }

                    item.parts.push(part);
                    item.parts.push(hPart);

                    item.parts.push({
                        type: 'stroke',
                        subType: 'rect',
                        p1: p1.clone(),
                        p2: p1.add(new V2(1,1)),
                        //color: 'red',
                        hsv: [358,100,76],
                        sClamps: [40,100],
                        vClamps: [40,100],
                        forceWidth: true,
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*2.5/4
                    })
                }

                return item;
            }
        }), 20)

        this.perspectiveRight = this.addGo(new Demo9PerspectiveGO({
            size: this.perspectiveRightSize,
            position: new V2(this.viewport.x - this.perspectiveRightSize.x/2, this.perspectiveRightSize.y/2).toInt(),
            easingType: 'expo',
            method: 'in',
            time: 80,
            frontalTime: 70,
            perspectiveCenter: new V2(0, this.perspectiveRightSize.y),
            staticContent: {
                img: createCanvas(new V2(this.viewport.x/2,20), (ctx, size, hlp) => {
                    hlp.setFillColor('#0E171E')
                    let pp = new PerfectPixel({ctx});
                    let points = pp.lineV2(new V2(0,size.y), new V2(size.x, 0));
                    let sChange = easing.createProps(size.x, 0, 70, 'sin', 'out');
                    let hsv = [206,50,15];
                    for(let i = 0; i < points.length; i++){
                        sChange.time = points[i].x;
                        let s = easing.process(sChange);
                        s = fast.c(s/10)*10;
                        hlp.setFillColor(colors.hsvToHex([hsv[0], s, hsv[2]])).rect(points[i].x, points[i].y, 1, size.y)
                    }
                }),
                position: new V2(0,this.perspectiveRightSize.y-20)
            },
            frontalItemGenerator() {
                let tl = new V2(this.size.x, 0);

                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let fencePart = {
                    type: 'stroke',
                    subType: 'rect',
                    p1: new V2(0,this.size.y-20 + 1),
                    p2: new V2(1, this.size.y),
                    forceWidth: true,
                    color: '#0A1219',
                    visible: false,
                    visibleFrom: this.frontalTime/10
                }

                item.parts.push(fencePart);

                return item;
            },
            itemGenerator() {
                let tl = new V2(this.size.x, 0);
                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let p1Y = getRandomInt(0,100);
                let length = getRandomInt(30, 90);
                
                let p1 = new V2(getRandomInt(0,50), p1Y);
                let p1perspectiveDirection = tl.add(p1).direction(this.perspectiveCenter);
                
                let p2 = p1.add(p1perspectiveDirection.mul(-length));
                let p3 = new V2(p1.x, item.size.y)
                let p4 = new V2(p2.x, item.size.y)
                item.parts.push({
                    type: 'side',
                    //defaultColor: '#001F3A',
                    p1,
                    p2,
                    p3,
                    p4, 
                    visible: true,
                    hsv: [207,100,22],
                    sClamps: [80,100],
                    vClamps: [17,23],
                })

                item.parts.push({
                    type: 'rect',
                    tl: p2,
                    size: new V2(getRandomInt(200,300),item.size.y-p2.y),
                    //defaultColor: '#00182E',
                    visible: true,
                    hsv: [208,100,18],
                    sClamps: [80,100],
                    vClamps: [13,19],
                })


                item.parts.push({
                    type: 'stroke',
                    p1,
                    p2: p3,
                    //color: '#002747',
                    hsv: [207,100,27],
                    sClamps: [80,100],
                    vClamps: [22,28],
                    visible: false,
                    visibleFrom: this.time/2
                })

                let sideLinesHeight = 5;
                let upperShift = 5;
                let linesGap = 10;
                let leftShift = 5;
                let rightShift = 7;
                let count = fast.r((item.size.y-p1.y-upperShift)/(sideLinesHeight+linesGap));
                let halfCount = fast.r(count/2)
                let currentY = p1.y+upperShift;
                let vLine = {begin: p2.add(new V2(-rightShift, 0)), end: p4.add(new V2(-rightShift, 200))};
                for(let i = 0; i < count;i++){
                    let leftPoint = new V2(p1.x+leftShift, currentY);
                    let leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);

                    let _p1 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));

                    let rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    let distance = leftPoint.distance(rightPoint);

                    let _p2 = leftPoint.add(leftPointPerspectiveDirection.mul((distance)));
                    currentY+=sideLinesHeight;

                    // leftPoint = new V2(p1.x+leftShift, currentY);
                    // leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);
                    // let _p3 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));
                    // rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    // distance = leftPoint.distance(rightPoint);

                    // let _p4 = leftPoint.add(leftPointPerspectiveDirection.mul(distance));

                    currentY+=linesGap;
                    let part = {
                        type: 'stroke',
                        p1: _p1,
                        p2: _p2,
                        //color: '#00182E',
                        hsv: [208,100,18],
                        sClamps: [80,100],
                        vClamps: [13,19],
                        visible: false,
                        visibleFrom: this.time*3/4
                    };

                    
                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(leftPointPerspectiveDirection.mul(getRandomInt(0,distance)));
                        let wp2 = wp1.add(leftPointPerspectiveDirection.mul(2));
                        let window = {
                            type: 'side',
                            p1: wp1.add(new V2(0,1)),
                            p2: wp2.add(new V2(0,1)),
                            p3: wp1.add(new V2(0,10)),
                            p4: wp2.add(new V2(0,10)), 
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }
                    

                    let hPart = {
                        type: 'stroke',
                        subType: 'rect',
                        p1: rightPoint.add(new V2(leftShift+rightShift, 0)),
                        p2: rightPoint.add(new V2(200, 0)),
                        //color: '#001F3A',
                        hsv: [207,100,22],
                        sClamps: [80,100],
                        vClamps: [17,23],
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*3/4
                    }

                    if(getRandomInt(0,5) == 0){
                        let wp1 = rightPoint.add(new V2(getRandomInt(15, 60), 1))
                        let wp2 = wp1.add(new V2(10,10))
                        let window = {
                            type: 'stroke',
                            subType: 'rect',
                            p1: wp1,
                            p2: wp2,
                            forceHeight: true,
                            forceWidth: true,
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }

                    if(i %2 != 0){
                        part.visible = true;
                        part.visibleFrom = undefined;

                        hPart.visible = true;
                        hPart.visibleFrom = undefined;
                    }

                    item.parts.push(part);
                    item.parts.push(hPart);

                    item.parts.push({
                        type: 'stroke',
                        subType: 'rect',
                        p1: p1.clone(),
                        p2: p1.add(new V2(1,1)),
                        //color: 'red',
                        hsv: [358,100,76],
                        sClamps: [40,100],
                        vClamps: [40,100],
                        forceWidth: true,
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*2.5/4
                    })
                }

                return item;
            }
        }), 20)

    }
}

class Demo9PerspectiveGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            itemsGenTime: 200,
            frontalItemsGenTime: 200
        }, options)

        super(options);
    }

    init() {
        this.items = []
        this.frontalItems = [];

        this.regTimerDefault(30, () => {
            for(let i = 0; i < this.items.length;i++){
                this.processItem(this.items[i]);
            }

            this.items = this.items.filter(item => item.alive);

            for(let i = 0; i < this.frontalItems.length;i++){
                this.processItem(this.frontalItems[i]);
            }

            this.frontalItems = this.frontalItems.filter(item => item.alive);

            this.createImage();
        })

        this.regTimerDefault(this.itemsGenTime, () => {
            this.items.unshift(this.createItem());
        })

        this.regTimerDefault(this.frontalItemsGenTime, () => {
            let item = this.createFrontalItem();
            if(item)
                this.frontalItems.unshift(item);
        })
    }
    createFrontalItem() {
        if(!this.frontalItemGenerator)
            return undefined;

        let item = this.frontalItemGenerator();

        return this.addChanges(item, this.frontalTime);
    }
    createItem() {
        let item = this.itemGenerator();

        return this.addChanges(item, this.time)
    }
    addChanges(item, time) {
        item.xChange = easing.createProps(time, this.perspectiveCenter.x, item.tl.x, this.easingType, this.method, () => {
            item.alive = false;
        });

        item.yChange = easing.createProps(time, this.perspectiveCenter.y, item.tl.y, this.easingType, this.method);

        for(let i = 0; i < item.parts.length; i++){
            let part = item.parts[i];
            if(part.type == 'rect'){
                part.tlXChange = easing.createProps(time, 0, part.tl.x, this.easingType, this.method);
                part.tlYChange = easing.createProps(time, 0, part.tl.y, this.easingType, this.method);
                part.sizeXChange = easing.createProps(time, 0, part.size.x, this.easingType, this.method);
                part.sizeYChange = easing.createProps(time, 0, part.size.y, this.easingType, this.method);
            }
            if(part.type == 'ppPerspective'){
                part.lengthChange = easing.createProps(time, 0, part.length, this.easingType, this.method);
            }

            if(part.type == 'side'){
                part.p1XChange = easing.createProps(time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(time, 0, part.p2.y, this.easingType, this.method);
                part.p3XChange = easing.createProps(time, 0, part.p3.x, this.easingType, this.method);
                part.p3YChange = easing.createProps(time, 0, part.p3.y, this.easingType, this.method);
                part.p4XChange = easing.createProps(time, 0, part.p4.x, this.easingType, this.method);
                part.p4YChange = easing.createProps(time, 0, part.p4.y, this.easingType, this.method);
            }

            if(part.type == 'stroke'){
                part.p1XChange = easing.createProps(time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(time, 0, part.p2.y, this.easingType, this.method);
            }

            if(part.sClamps){
                part.sChange = easing.createProps(time, part.sClamps[0], part.sClamps[1], this.easingType, this.method);
            }

            if(part.vClamps){
                part.vChange = easing.createProps(time, part.vClamps[0], part.vClamps[1], this.easingType, this.method);
            }
        }

        return item;
    }
    processItem(item) {
        easing.commonProcess({ context: item, setter: (value) => { item.tl.x = value }, propsName: 'xChange', round: false })
        easing.commonProcess({ context: item, setter: (value) => { item.tl.y = value }, propsName: 'yChange', round: false })

        //item.tl.x = fast.r(fast.f(item.tl.x/0.5)*0.5)

        for(let i = 0; i < item.parts.length; i++){
            let part = item.parts[i];

            easing.commonProcess({ context: part, targetpropertyName: 's', propsName: 'sChange', round: true })
            easing.commonProcess({ context: part, targetpropertyName: 'v', propsName: 'vChange', round: true })

            if(part.type == 'rect'){
                easing.commonProcess({ context: part, setter: (value) => { part.tl.x = value }, propsName: 'tlXChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.tl.y = value }, propsName: 'tlYChange', round: false })

                easing.commonProcess({ context: part, setter: (value) => { part.size.x = value }, propsName: 'sizeXChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.size.y = value }, propsName: 'sizeYChange', round: false })

                // part.size.x = fast.r(part.size.x/2)*2
                // part.size.y = fast.r(part.size.y/2)*2
            }
            if(part.type == 'ppPerspective'){
                easing.commonProcess({ context: part, targetpropertyName: 'length', propsName: 'lengthChange', round: false })
            }

            if(part.type == 'side'){
                easing.commonProcess({ context: part, setter: (value) => { part.p1.x = value }, propsName: 'p1XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p1.y = value }, propsName: 'p1YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.x = value }, propsName: 'p2XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.y = value }, propsName: 'p2YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p3.x = value }, propsName: 'p3XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p3.y = value }, propsName: 'p3YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p4.x = value }, propsName: 'p4XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p4.y = value }, propsName: 'p4YChange', round: false })
            }

            if(part.type == 'stroke'){
                easing.commonProcess({ context: part, setter: (value) => { part.p1.x = value }, propsName: 'p1XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p1.y = value }, propsName: 'p1YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.x = value }, propsName: 'p2XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.y = value }, propsName: 'p2YChange', round: false })
            }

            //part.visible = true;
            if(part.visibleFrom && item.xChange){
                part.visible = item.xChange.time >= part.visibleFrom;
            }

            if(part.colorToTime){
                let color = undefined;
                if(item.xChange){
                    for(let j = 0;j< part.colorToTime.length;j++){
                        if(item.xChange.time < part.colorToTime[j].before){
                            color = part.colorToTime[j].color;
                            break;
                        }
                    }
                }
                
                if(color == undefined){
                    color = part.defaultColor;
                }

                part.color = color;
            }

            if(part.update){
                part.update();
            }
        }
    }
    renderItem(hlp, pp, item){
        let tl = item.tl;

        for(let j = 0; j < item.parts.length; j++){
            let part = item.parts[j];

            if(!part.visible)
                continue;

            if(part.hsv){
                let hsv = [...part.hsv];
                if(part.s){
                    hsv[1] = part.s
                };

                if(part.v){
                    hsv[2] = part.v
                };
                part.color = colors.hsvToHex(hsv);
            }

            hlp.setFillColor(part.color)
            if(part.type == 'rect'){
                if(part.size.x >= 1 && part.size.y >=1){
                    let partTl = tl.add(part.tl).toInt();

                    hlp.rect(partTl.x, partTl.y, fast.f(part.size.x), fast.f(part.size.y));
                    //hlp.setFillColor(part.color).rect(partTl.x, partTl.y, (part.size.x), (part.size.y));
                }
            }

            if(part.type == 'ppPerspective' && part.length > 1){
                let lineFrom = tl.add(part.startP).toInt();
                let direction = lineFrom.direction(this.perspectiveCenter);
                let lineTo = lineFrom.add(direction.mul(part.length));
                let points = pp.lineV2(lineFrom, lineTo);
                for(let i = 0; i < points.length; i++){
                    hlp.rect(points[i].x, points[i].y, 1, part.height)
                }
            }

            if(part.type == 'side'){
                let pointsUpper = pp.lineV2(tl.add(part.p1), tl.add(part.p2));
                let pointsLower = pp.lineV2(tl.add(part.p3), tl.add(part.p4));

                let pointsYMap = [];
                for(let x = 0; x < pointsUpper.length; x++){
                    pointsYMap.push({ x: pointsUpper[x].x,  from: pointsUpper[x].y})
                }

                let pointsLowerYMap = [];
                for(let x = 0; x < pointsLower.length; x++){
                    pointsLowerYMap[pointsLower[x].x] = pointsLower[x].y
                }

                for(let x = 0; x < pointsYMap.length; x++){
                    if(pointsLowerYMap[pointsYMap[x].x] == undefined)
                        continue;

                    pointsYMap[x].to = pointsLowerYMap[pointsYMap[x].x];
                }

                for(let pi = 0; pi < pointsYMap.length; pi++){
                    let py = pointsYMap[pi];
                    hlp.rect(py.x, py.from, 1, py.to - py.from);
                }
            }

            if(part.type == 'stroke'){
                if(part.subType == 'rect'){
                    let width = fast.r(part.p2.x - part.p1.x);
                    let height = fast.r(part.p2.y - part.p1.y);
                    let _tl = tl.add(part.p1).toInt();
                    if(height == 0 && part.forceHeight)
                        height = 1;

                    if(width == 0 && part.forceWidth){
                        width = 1;
                    }

                    hlp.rect(_tl.x, _tl.y, width, height)
                }
                else 
                    pp.lineV2(tl.add(part.p1), tl.add(part.p2))
            }
        }
    }
    createImage() {
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            //hlp.setFillColor('grey').strokeRect(0,0,size.x, size.y);

            let pp = new PerfectPixel({context: ctx})

            for(let i = 0; i < this.items.length;i++){
                let item = this.items[i];

                this.renderItem(hlp, pp, item);
            }

            if(this.staticContent){
                ctx.drawImage(this.staticContent.img, this.staticContent.position.x, this.staticContent.position.y)
            }

            for(let i = 0; i < this.frontalItems.length;i++){
                let item = this.frontalItems[i];

                this.renderItem(hlp, pp, item);
            }

        })
    }
}