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

                    hlp.setFillColor('#162945').rect(0,size.y-80, size.x, 80)
                    hlp.setFillColor('#1D3559').rect(0,size.y-30, size.x, 30)
                    hlp.setFillColor('#203B64').rect(0,size.y-15, size.x, 15)
                    hlp.setFillColor('#23416E').rect(0,size.y-5,size.x, 5);

                    
                })
                //#00003C
                //#E79D56
            }
        }), 1)

        this.road = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,this.viewport.y - (this.roadHeight/2)),
            size: new V2(this.viewport.x,this.roadHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('gray').rect(0,0,size.x, size.y);
                    hlp.setFillColor('#090909');
                    let pp = new PerfectPixel({ctx});
                    pp.lineV2(new V2(this.size.x/2 + 5, 0), new V2(this.size.x, 8)).forEach(p => {
                        hlp.rect(p.x, 0, 1, p.y)
                    })

                    pp.lineV2(new V2(this.size.x/2 - 5, 0), new V2(0, 8)).forEach(p => {
                        hlp.rect(p.x, 0, 1, p.y)
                    })

                })
            }
        }), 1)

        this.rightFence = this.addGo(new GO({
            position: new V2(this.viewport.x*3/4,this.viewport.y - this.roadHeight - 10),
            size: new V2(this.viewport.x/2,20),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#0E171E')
                    let pp = new PerfectPixel({ctx});
                    let points = pp.lineV2(new V2(0,size.y), new V2(size.x, 0));
                    for(let i = 0; i < points.length; i++){
                        hlp.rect(points[i].x, points[i].y, 1, size.y)
                    }
                })
            }
        }), 30)

        this.perspectiveRightSize = new V2(this.viewport.x/2, this.viewport.y-this.roadHeight).toInt();
        this.perspectiveRight = this.addGo(new Demo9PerspectiveGO({
            size: this.perspectiveRightSize,
            position: new V2(this.viewport.x - this.perspectiveRightSize.x/2, this.perspectiveRightSize.y/2).toInt(),
            easingType: 'expo',
            method: 'in',
            time: 80,
            perspectiveCenter: new V2(0, this.perspectiveRightSize.y),
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
                    defaultColor: '#001F3A',
                    p1,
                    p2,
                    p3,
                    p4, 
                    visible: true,
                    colorToTime: [
                        { before: this.time/2, color: '#0E2538'},
                        { before: this.time*3/4, color: '#082135'}
                    ]
                })

                item.parts.push({
                    type: 'rect',
                    tl: p2,
                    size: new V2(getRandomInt(200,300),item.size.y-p2.y),
                    defaultColor: '#00182E',
                    visible: true,
                    colorToTime: [
                        { before: this.time/2, color: '#0B1D2D'},
                        { before: this.time*3/4, color: '#061A2B'}
                    ]
                })

                item.parts.push({
                    type: 'stroke',
                    p1,
                    p2: p3,
                    color: '#002747',
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
                        color: '#00182E',
                        visible: false,
                        visibleFrom: this.time*3/4
                    };

                    let hPart = {
                        type: 'stroke',
                        subType: 'rect',
                        p1: rightPoint.add(new V2(leftShift+rightShift, 0)),
                        p2: rightPoint.add(new V2(200, 0)),
                        color: '#001F3A',
                        visible: false,
                        visibleFrom: this.time*3/4
                    }

                    if(i %2 != 0){
                        part.visible = true;
                        part.visibleFrom = undefined;

                        hPart.visible = true;
                        hPart.visibleFrom = undefined;
                    }

                    item.parts.push(part);
                    item.parts.push(hPart);

                    
    
                    // if(!_p1 || _p1.isNaN()
                    // || !_p2 || _p2.isNaN() 
                    // || !_p3 || _p3.isNaN()
                    // || !_p4 || _p4.isNaN()){
                    //     debugger;
                    //     throw 'Side points is incorrect'
                    // }


                    // item.parts.push({
                    //     type: 'side',
                    //     color: '#9C7842',
                    //     p1:_p1,
                    //     p2:_p2,
                    //     p3:_p3,
                    //     p4:_p4, 
                    //     visible: true,
                    // })
                }

                return item;
            }
        }), 20)

    }
}

class Demo9PerspectiveGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options)

        super(options);
    }

    init() {
        this.items = []

        this.regTimerDefault(30, () => {
            for(let i = 0; i < this.items.length;i++){
                this.processItem(this.items[i]);
            }

            this.items = this.items.filter(item => item.alive);

            this.createImage();
        })

        this.regTimerDefault(200, () => {
            this.items.unshift(this.createItem());
        })
    }

    createItem() {
        let item = this.itemGenerator();

        item.xChange = easing.createProps(this.time, this.perspectiveCenter.x, item.tl.x, this.easingType, this.method, () => {
            item.alive = false;
        });

        item.yChange = easing.createProps(this.time, this.perspectiveCenter.y, item.tl.y, this.easingType, this.method);

        for(let i = 0; i < item.parts.length; i++){
            let part = item.parts[i];
            if(part.type == 'rect'){
                part.sizeXChange = easing.createProps(this.time, 0, part.size.x, this.easingType, this.method);
                part.sizeYChange = easing.createProps(this.time, 0, part.size.y, this.easingType, this.method);
            }
            if(part.type == 'ppPerspective'){
                part.lengthChange = easing.createProps(this.time, 0, part.length, this.easingType, this.method);
            }

            if(part.type == 'side'){
                part.p1XChange = easing.createProps(this.time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(this.time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(this.time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(this.time, 0, part.p2.y, this.easingType, this.method);
                part.p3XChange = easing.createProps(this.time, 0, part.p3.x, this.easingType, this.method);
                part.p3YChange = easing.createProps(this.time, 0, part.p3.y, this.easingType, this.method);
                part.p4XChange = easing.createProps(this.time, 0, part.p4.x, this.easingType, this.method);
                part.p4YChange = easing.createProps(this.time, 0, part.p4.y, this.easingType, this.method);
            }

            if(part.type == 'stroke'){
                part.p1XChange = easing.createProps(this.time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(this.time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(this.time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(this.time, 0, part.p2.y, this.easingType, this.method);
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
            if(part.type == 'rect'){
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
        }
    }
    createImage() {
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            //hlp.setFillColor('grey').strokeRect(0,0,size.x, size.y);

            let pp = new PerfectPixel({context: ctx})

            for(let i = 0; i < this.items.length;i++){
                let item = this.items[i];

                let tl = item.tl;

                for(let j = 0; j < item.parts.length; j++){
                    let part = item.parts[j];

                    if(!part.visible)
                        continue;

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
                            if(height == 0)
                                height = 1;

                            hlp.rect(_tl.x, _tl.y, width, height)
                        }
                        else 
                            pp.lineV2(tl.add(part.p1), tl.add(part.p2))
                    }
                }

            }
        })
    }
}