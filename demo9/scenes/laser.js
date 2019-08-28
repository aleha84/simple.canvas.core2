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
                //this.sparks.color = colors.palettes.fleja.colors[13];
                this.lowerLine = { begin: new V2(-this.size.x, this.size.y), end: new V2(this.size.x*2, this.size.y) }
                this.endsCache = [];
                this.direction = new V2(-0.8,0.4);
                this.width = fast.r(this.size.x*0.7);
                this.laserLengthClamps = [160,210];

                this.ls = new Array(this.width).fill(220);
                this.startFrom = new V2(fast.r(this.size.x*2/3), fast.r(this.size.y/3))
                this.starts = new Array(this.width).fill().map((_,i) => {
                    return this.startFrom.add(new V2(i, 0));
                })

                this.planeHeight = 5;

                this.cutTypes = ['line', 'sin', 'elka', 'curves']
                this.cuts = [];
                this.cutsAd = [];

                this.laser = {
                    enabled: false,
                    from: new V2(this.size.x/3, this.size.y/5).toInt(),
                    color: colors.palettes.fleja.colors[11],
                    secondColor: colors.palettes.fleja.colors[12],
                    angle: 17.56,
                    to: {
                        vx: -10,
                        length: 180
                    }
                }

                this.createPlaneImg = true;
                this.sparks = [];
                
                this.defaultPlaneImgSize = new V2(this.size.x*1.5, this.size.y).toInt();
                this.defaultPlaneImg = createCanvas(this.defaultPlaneImgSize, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[2]);
                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.starts[i], this.starts[i].add(this.getEnd(this.ls[i])));
                    }

                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    let last = this.starts.length-1;
                    for(let i = 1; i < this.planeHeight+1; i++){
                        pp.lineV2(this.starts[last].add(new V2(0,i)), this.starts[last].add(this.getEnd(this.ls[last])).add(new V2(0,i)));
                    }

                    pp.lineV2(this.starts[0], this.starts[0].add(this.getEnd(this.ls[0])));
                    //hlp.rect(this.starts[0].x, this.starts[0].y, this.width-1, 1)

                    let firstPoint = this.starts[0].add(this.getEnd(this.ls[0]));

                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(firstPoint.x, firstPoint.y+1, this.width-1, this.planeHeight)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(firstPoint.x, firstPoint.y+1, this.width-1, 1).rect(firstPoint.x, firstPoint.y+1, 1, this.planeHeight)

                    //hlp.setFillColor(colors.palettes.fleja.colors[1]);
                    //pp.lineV2(this.starts[last].add(new V2(0,this.planeHeight)), this.starts[last].add(this.getEnd(this.ls[last])).add(new V2(0,this.planeHeight)))
                });

                this.lineImg = createCanvas(new V2(this.size.x*2, 60), (ctx, size, hlp) => {
                    let height = 40;
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[23]).rect(0,height,size.x, 2);
                    hlp.setFillColor(colors.palettes.fleja.colors[21]).rect(0,height+2,size.x, 1);
                    hlp.setFillColor(colors.palettes.fleja.colors[22]).rect(0,0,size.x, height);
                    let gap = 20;
                    let lowerPoint = raySegmentIntersectionVector2(new V2(0,0), this.direction, {begin: new V2(-100,height), end: new V2(100, height)});
                    let count = fast.r(size.x/gap);
                    hlp.setFillColor(colors.palettes.fleja.colors[20])
                    for(let i = 0;i<count;i++){
                        let s = new V2(0,0).add(new V2(i*gap, 0));
                        pp.lineV2(s, lowerPoint.add(new V2(i*gap, 0)));
                        hlp.clear(s.x, s.y);
                    }
                });

                this.emitterModel = () => ({"general":{"originalSize":{"x":30,"y":30},"size":{"x":30,"y":30},"zoom":9,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#b6cbcf","fillColor":"#b6cbcf","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":7}},{"point":{"x":9,"y":22}},{"point":{"x":20,"y":22}},{"point":{"x":20,"y":7}}]},{"order":1,"type":"lines","strokeColor":"#68717a","fillColor":"#68717a","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":9}},{"point":{"x":18,"y":9}}]},{"order":2,"type":"lines","strokeColor":"#90a1a8","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":20,"y":22}},{"point":{"x":20,"y":7}},{"point":{"x":9,"y":7}},{"point":{"x":9,"y":22}}]},{"order":3,"type":"dots","strokeColor":"#51c43f","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":14}},{"point":{"x":11,"y":16}},{"point":{"x":11,"y":18}}]},{"order":4,"type":"lines","strokeColor":"#68717a","fillColor":"#68717a","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":11}},{"point":{"x":18,"y":11}}]},{"order":5,"type":"lines","strokeColor":"#68717a","fillColor":"#68717a","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":13}},{"point":{"x":18,"y":13}}]},{"order":6,"type":"lines","strokeColor":"#68717a","fillColor":"#68717a","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":15}},{"point":{"x":18,"y":15}}]},{"order":7,"type":"lines","strokeColor":"#417291","fillColor":"#417291","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":23}},{"point":{"x":13,"y":25}},{"point":{"x":16,"y":25}},{"point":{"x":16,"y":23}}]},{"order":8,"type":"lines","strokeColor":"#264f6e","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":23}},{"point":{"x":16,"y":23}}]}]}});

                this.currentPlaneX = 0//-this.size.x;
                this.planeImg = this.defaultPlaneImg;
                this.cuttedEdgePositionX = 0;
                this.currentLineX = 0;

                this.createImage();
                this.moveIn();
            },
            moveIn() {
                this.currentPlaneX = -this.size.x;
                this.planeImg = this.defaultPlaneImg;

                this.planeXChange = easing.createProps(50, -this.size.x*1.5, 0, 'quad', 'out');
                this.planeXChange.onComplete = () => {
                    this.unregTimer(this.planeMoveInTimer);
                    this.planeMoveInTimer = undefined;
                    this.laserStart();
                }

                this.planeXChange.onChange = () => {
                    this.createImage();
                }

                this.planeMoveInTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, propsName: 'planeXChange', round: true, removePropsOnComplete: true, targetpropertyName: 'currentPlaneX'})
                })
            },
            moveOut() {
                this.planeXChange = easing.createProps(50, 0, this.size.x,'quad', 'in');
                this.planeXChange.onComplete = () => {
                    this.unregTimer(this.planeMoveOutTimer);
                    this.planeMoveOutTimer = undefined;
                }

                this.planeXChange.onChange = () => {
                    this.createImage();
                }

                this.planeMoveOutTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, propsName: 'planeXChange', round: true, removePropsOnComplete: true, targetpropertyName: 'currentPlaneX'})
                })
            },
            laserStart() {
                let vxClamps = [0, this.width];
                let currentVx = vxClamps[0];
                this.laser.enabled = true;
                
                let cutType = this.cutTypes[getRandomInt(0,this.cutTypes.length-1)];
                let lengthCalc = undefined;
                switch(cutType){
                    case 'line': {  
                        let from = getRandomInt(this.laserLengthClamps[0], this.laserLengthClamps[1]);
                        let to = getRandomInt(this.laserLengthClamps[0], this.laserLengthClamps[1]);
                        let lChange = getRandomBool() 
                        ? easing.createProps(vxClamps[1], from, to, 'linear', 'base') 
                        : easing.createProps(vxClamps[1], from, to, 'quad', ['in', 'out', 'inOut'][getRandomInt(0,2)]);
                        lengthCalc = (x) => {
                            lChange.time = x;
                            return fast.r(easing.process(lChange))
                        }
                        break;
                    }
                    case 'sin': {
                        let lShift = getRandomInt(this.laserLengthClamps[0], (this.laserLengthClamps[1]+this.laserLengthClamps[0])/2);
                        let amp = getRandomInt(5,12);
                        let mul = getRandomInt(2,10);
                        let method = getRandomBool() ? 'sin': 'cos';

                        lengthCalc = (x) => {
                            return fast.r(Math[method](degreeToRadians(x*mul))*amp + lShift)
                        }
                        break;
                    }
                    case 'elka': {
                        let count = getRandomInt(2,10);
                        let segWidth = fast.r(vxClamps[1]/(count));
                        let lens = new Array(count).fill().map((_, i) => {
                            return {
                                from: i == 0? 0 : i*segWidth,
                                to: i == count-1 ? vxClamps[1]: (i+1)*segWidth,
                                length: getRandomInt(this.laserLengthClamps[0], this.laserLengthClamps[1])
                            }
                        })

                        for(let i = 0; i < count; i++){
                            lens[i].change = easing.createProps(segWidth, 
                                i == 0 ? getRandomInt(this.laserLengthClamps[0], this.laserLengthClamps[1]) : lens[i-1].length,
                                i == count-1 ? getRandomInt(this.laserLengthClamps[0], this.laserLengthClamps[1]) : lens[i].length,
                                'linear', 'base');
                        }

                        lengthCalc = (x) => {
                            try {
                                let currentLen = lens.filter(l => x >= l.from && x <= l.to)[0];
                                if(currentLen == undefined){
                                    return lens[lens.length-1].length;
                                }
                                currentLen.change.time=(x-currentLen.from);
                                let result = fast.r(easing.process(currentLen.change));
                                if(result > this.laserLengthClamps[1]){
                                    result = this.laserLengthClamps[1];
                                }
                                return result;
                            }catch{
                                console.log(x);
                                throw x;
                            }
                            
                        }

                        break;
                    }
                    case 'curves': {
                        let count = getRandomInt(3,6);
                        let mid = fast.r((this.laserLengthClamps[1]+this.laserLengthClamps[0])/2);
                        let start = new V2(0, mid);
                        let end = new V2(vxClamps[1], mid);
                        let midPoints = [];
                        for(let i = 0; i < count; i++){
                            midPoints[i] = {
                                distance: (i+1)/(count+1),
                                yChange: getRandomInt(0, mid - this.laserLengthClamps[0])*(getRandomBool() ? -1 : 1)
                            }
                        }

                        let dots = mathUtils.getCurvePoints({start, end, midPoints});
                        lengthCalc = (x) => {
                            let result = dots.filter(d => d.x == x);
                            if(result.length)
                                return result[0].y;
                            else dots[dots.length-1].y;
                        }

                        break;
                    }
                }

                this.laserTimer = this.regTimerDefault(15, () => {
                    this.laser.to.vx = currentVx++;
                    this.laser.to.length = lengthCalc(this.laser.to.vx);
                    if(currentVx>vxClamps[1]){
                        //currentVx = vxClamps[0];
                        this.laser.enabled = false;
                    }

                    for(let i = 0; i < this.sparks.length;i++){
                        let spark = this.sparks[i];
                        spark.position.add(spark.speed, true);
                        spark.speed.y+=0.1;

                        if(spark.speed.y > 0)
                            spark.alive = false;
                    }

                    this.sparks = this.sparks.filter(s => s.alive);
                    if(!this.laser.enabled && !this.sparks.length){
                        this.unregTimer(this.laserTimer);
                        this.laserTimer = undefined;
                        //console.log('laser timer disabled')

                        this.laserGoBack();
                        this.cut();
                    }

                    this.createImage();
                })
            },
            laserGoBack() {
                this.laserAngleChange = easing.createProps(30, this.laser.angle, 17.56, 'quad', 'inOut');
                this.laserAngleChange.onComplete = () => {
                    this.unregTimer(this.laserGoBackTimer);
                    this.laserGoBackTimer = undefined;
                }

                this.laserGoBackTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, round: false, removePropsOnComplete: true, propsName: 'laserAngleChange',
                    setter: (value) => {
                        this.laser.angle = value;
                    }})
                })
            },
            cut() {
                this.planeImg = createCanvas(this.defaultPlaneImgSize, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    
                    for(let i = 0; i< this.starts.length;i++){
                        hlp.setFillColor(colors.palettes.fleja.colors[2]);
                        pp.lineV2(this.starts[i], this.cuts[i].position);
                        hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(this.cuts[i].position.x, this.cuts[i].position.y, 1, this.planeHeight)
                         hlp.setFillColor(colors.palettes.fleja.colors[12]).rect(this.cuts[i].position.x, this.cuts[i].position.y+2, 1, 3)
                     hlp.setFillColor(colors.palettes.fleja.colors[11]).rect(this.cuts[i].position.x, this.cuts[i].position.y+4, 1, 1)
                    }

                    for(let i = 0; i< this.cutsAd.length;i++){
                        hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(this.cutsAd[i].position.x, this.cutsAd[i].position.y, 1, this.planeHeight)
                        hlp.setFillColor(colors.palettes.fleja.colors[12]).rect(this.cutsAd[i].position.x, this.cutsAd[i].position.y+2, 1, 3)
                     hlp.setFillColor(colors.palettes.fleja.colors[11]).rect(this.cutsAd[i].position.x, this.cutsAd[i].position.y+4, 1, 1)
                    }

                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    let last = this.starts.length-1;
                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    for(let i = 0; i < this.planeHeight; i++){
                        
                        pp.lineV2(this.starts[last].add(new V2(0,i)), this.cuts[last].position.add(new V2(0,i).substract(this.direction)));
                        
                    }

                    pp.lineV2(this.starts[0], this.cuts[0].position);

                    // let firstPoint = this.cuts[0].position;

                    
                    //  hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(firstPoint.x, firstPoint.y+1, this.width-1, this.planeHeight)

                    //  hlp.setFillColor(colors.palettes.fleja.colors[12]).rect(firstPoint.x, firstPoint.y+this.planeHeight-2, this.width-1, 3)
                    //  hlp.setFillColor(colors.palettes.fleja.colors[11]).rect(firstPoint.x, firstPoint.y+this.planeHeight, this.width-1, 1)
                });

                this.cuttedEdgePositionY = 0;
                this.cuttedEdgePositionX = 0;
                this.cuttedEdgeImg = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[2]);
                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.cuts[i].position.add(this.direction.mul(1)), this.starts[i].add(this.getEnd(this.ls[i])));
                    }

                    // hlp.setFillColor(colors.palettes.fleja.colors[13])
                    //     .rect(this.cuts[0].position.x, this.cuts[0].position.y, this.width, 1)

                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    let last = this.starts.length-1;
                    for(let i = 1; i < this.planeHeight+1; i++){
                        pp.lineV2(this.cuts[last].position.add(new V2(0,i)), this.starts[last].add(this.getEnd(this.ls[last])).add(new V2(0,i)));
                    }

                    pp.lineV2(this.cuts[0].position.add(this.direction.mul(1)), this.starts[0].add(this.getEnd(this.ls[0])));
                    let firstPoint = this.starts[0].add(this.getEnd(this.ls[0]));
                    
                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(firstPoint.x, firstPoint.y+1, this.width-1, this.planeHeight)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(firstPoint.x, firstPoint.y+1, this.width-1, 1).rect(firstPoint.x, firstPoint.y+1, 1, this.planeHeight)

                    
                        //.rect(this.cuts[last].position.x, this.cuts[last].position.y, 1, this.planeHeight)
                });

                this.cuts = [];
                this.cutsAd = [];
                this.createImage();
                this.cutEdgeFall();
            },
            cutEdgeFall() {
                this.cuttedEdgePositionYChange = easing.createProps(15, 0, 50, 'quad', 'in');
                this.cuttedEdgePositionYChange.onComplete = () => {
                    this.unregTimer(this.cuttedEdgeMoveInTimer);
                    this.cuttedEdgeMoveInTimer = undefined;
                    //this.laserStart();
                    this.cutRemove();
                    this.moveOut();
                }

                this.cuttedEdgePositionYChange.onChange = () => {
                    this.createImage();
                }

                this.cuttedEdgeMoveInTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, propsName: 'cuttedEdgePositionYChange', round: true, removePropsOnComplete: true, targetpropertyName: 'cuttedEdgePositionY'})
                })
            },
            cutRemove() {
                this.currentLineX = 0;
                let speedX = -2;
                let stopLine = false;
                this.lineMoveTimer = this.regTimerDefault(15, () => {
                    this.currentLineX+=speedX;
                    this.cuttedEdgePositionX+=speedX;
                    if(this.currentLineX == -20){
                        this.currentLineX = 0;
                        if(stopLine){
                            this.unregTimer(this.lineMoveTimer);
                            this.lineMoveTimer = undefined;
                            this.moveIn();
                            return;
                        }
                    }

                    if(this.cuttedEdgePositionX<= -this.size.x){
                        stopLine = true;
                    }

                    this.createImage();
                })
            },
            getEnd(length) {
                if(!this.endsCache[length]){
                    this.endsCache[length] = this.direction.mul(length);
                }

                return this.endsCache[length];
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(colors.palettes.fleja.colors[0]).rect(0,0,size.x, size.y)

                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0,fast.r(size.y/2-50), size.x, 14)
                    hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0,fast.r(size.y/2-53), size.x, 3)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(0,fast.r(size.y/2-36), size.x, 1);

                    hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(20, fast.r(size.y/2-40), 20, 6).dot(40, fast.r(size.y/2-35))
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(20, fast.r(size.y/2-40), 20, 1)
                    hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(40, fast.r(size.y/2-40), 1, 6);

                    hlp.setFillColor(colors.palettes.fleja.colors[20]).rect(0, fast.r(size.y*2/3)-20, size.x, fast.r(size.y/3)+40)
                    .setFillColor(colors.palettes.fleja.colors[23]).rect(0, fast.r(size.y*10.6/20), size.x, 80)
                    .setFillColor(colors.palettes.fleja.colors[26]).rect(0, fast.r(size.y*10.6/20)+80, size.x, 1)
                    .setFillColor(colors.palettes.fleja.colors[21]).rect(0, fast.r(size.y*10.6/20), size.x, 1);

                    for(let i = 0; i < 10; i++){
                        hlp.setFillColor(colors.palettes.fleja.colors[21]).dot(i*30, fast.r(size.y*10.6/20)+75).dot(i*30, fast.r(size.y*10.6/20)+4);
                    }

                    ctx.drawImage(this.lineImg, this.currentLineX,fast.r(size.y*11.25/20))

                    let pp = new PerfectPixel({context: ctx});
                                        
                    ctx.drawImage(this.planeImg, this.currentPlaneX,0,this.defaultPlaneImgSize.x, this.defaultPlaneImgSize.y);

                                     
                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0,fast.r(size.y/2-70), size.x, 14)
                    hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0,fast.r(size.y/2-73), size.x, 3)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(0,fast.r(size.y/2-56), size.x, 1);

                    

                    for(let i = 0; i < this.cuts.length; i++){
                        let cut = this.cuts[i];
                        hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(cut.position.x, cut.position.y,1,1);
                    }

                    for(let i = 0; i < this.cutsAd.length; i++){
                        let cut = this.cutsAd[i];
                        hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(cut.position.x, cut.position.y,1,1);
                    }

                    hlp.setFillColor(colors.palettes.fleja.colors[27]).rect(this.laser.from.x - 5, 0, 10, this.laser.from.y)
                    hlp.setFillColor(colors.palettes.fleja.colors[28]).rect(this.laser.from.x + 5, 0, 1, this.laser.from.y)
                    hlp.setFillColor(colors.palettes.fleja.colors[29]).rect(this.laser.from.x, 0, 1, this.laser.from.y)
                    hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(this.laser.from.x - 15, this.laser.from.y-15, 30, 30)
                    hlp.setFillColor(colors.palettes.fleja.colors[9]).rect(this.laser.from.x +15, this.laser.from.y-15, 1, 30)
                    .rect(this.laser.from.x -10, this.laser.from.y-15, 1, 10).rect(this.laser.from.x -10, this.laser.from.y-5, 10, 1)
                    .rect(this.laser.from.x +10, this.laser.from.y-15, 1, 20).rect(this.laser.from.x , this.laser.from.y+5, 11, 1)
                    hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(this.laser.from.x -15, this.laser.from.y+14, 30, 1)

                    if(this.laser.enabled && this.laser.to.vx >= 0 && this.laser.to.vx < this.width ){ // если лазер по линиям идет
                        hlp.setFillColor(this.laser.color);
                        let laserTo = this.starts[this.laser.to.vx].add(this.getEnd(this.laser.to.length));

                        let lDirection = this.laser.from.direction(laserTo);
                        this.laser.angle = V2.down.angleTo(lDirection);

                        this.cuts[this.laser.to.vx] = { position: laserTo.toInt(), length: this.laser.to.length }
                        if(this.laser.to.vx > 0){
                            let delta = this.cuts[this.laser.to.vx].position.x-this.cuts[this.laser.to.vx-1].position.x;
                            if(delta > 1){
                                for(let i = 0; i < delta;i++){
                                    this.cutsAd.push({ position: this.cuts[this.laser.to.vx-1].position.add(new V2(i+1, 0)) })
                                }
                            }
                        }

                        pp.lineV2(this.laser.from, laserTo)
                        hlp.setFillColor(this.laser.secondColor);
                        pp.lineV2(this.laser.from.add(new V2(-1,0)), laserTo.add(new V2(-1,0)));

                        this.sparks.push({
                            position: laserTo.add(new V2(-2,-1)), 
                            size: new V2(2,2), 
                            color: colors.palettes.fleja.colors[getRandomInt(11,15)],
                            speed: new V2(getRandom(-2,-0.5), getRandom(-3,-1)),
                            alive: true
                        })
                    }

                    let laserEmitterModel = this.emitterModel();                    
                    laserEmitterModel.main.layers.forEach(l => {
                        l.points.forEach(p => {
                            let v2 = new V2(p.point);
                            v2.substract(new V2(15,15), true).rotate(this.laser.angle, false, true).add(new V2(15,15), true).toInt(true);
                            p.point.x = v2.x;
                            p.point.y = v2.y;
                        })
                    })

                    ctx.drawImage(PP.createImage(laserEmitterModel), this.laser.from.x-15, this.laser.from.y-15);

                    for(let i = 0; i < this.sparks.length;i++){
                        let spark = this.sparks[i];
                        hlp.setFillColor(spark.color).rect(fast.r(spark.position.x), fast.r(spark.position.y), spark.size.x, spark.size.y);
                    }

                    if(this.cuttedEdgeImg){
                        ctx.drawImage(this.cuttedEdgeImg, this.cuttedEdgePositionX,this.cuttedEdgePositionY,this.size.x, this.size.y);
                    }
                    
                })
            }
        }))
    }
}