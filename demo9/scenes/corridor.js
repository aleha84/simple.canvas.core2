class Demo9CorridorScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,200),
            init() {
                this.city = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#181D23').rect(0,0,size.x, size.y) 
                        //212-31-13

                        //backc_b - 212-21-20 
                        // delta: s - 10, v - 7
                        // -- 212 - 24 - 18
                        // -- 212 - 27 - 16
                        // -- 212 - 30 - 14
                        ctx.drawImage(PP.createImage(corridorImageModels.cityWithoutLights), 15 ,68)
                        //ctx.drawImage(PP.createImage(corridorImageModels.cityLights), 15 ,68)
                    })
                }));

                this.lights = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.cityLightsImg = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(corridorImageModels.cityLights), 15 ,68)
                        })

                        this.framesSets = corridorImageModels.cityLightsFramesSets.map(frameSet => {
                             return PP.createImage(frameSet).map(rawFrame => {
                                return createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.drawImage(rawFrame, 15 ,68)
                                })
                             })

                        }) 
                        this.currentFrame = 0;
                        this.currentFramesSet = 0;
                        this.pauseCounter = 2;
                        this.timer = this.regTimerDefault(100, () => {
                            if(this.pauseCounter > 0){
                                this.pauseCounter--;
                            }
                            else {
                                let frames = this.framesSets[this.currentFramesSet];
                                
                                
                                if(this.currentFrame == frames.length){
                                    this.img = this.cityLightsImg;
                                    this.currentFramesSet++;// = getRandomInt(0, this.framesSets.length-1)
                                    if(this.currentFramesSet == this.framesSets.length){
                                        this.currentFramesSet = 0;
                                    }

                                    this.currentFrame = 0;
                                    this.pauseCounter = 0//getRandomInt(1,4);
                                }
                                else {
                                    this.img = frames[this.currentFrame];
                                    this.currentFrame++;
                                }
                            }
                            
                        })
                    }
                }))
            }
        }), 1)

        this.farRain = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-20)),
            size: new V2(100,150),
            init() {
                this.items = [];
                this.lightEllipsis = {
                    position: new V2(this.size.x-20, 20),
                    size: new V2(40, 80),
                }

                let bgDirection = V2.down.rotate(15);
                this.bgSpeed = bgDirection.mul(3);
                this.bgRainImage = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    hlp.setFillColor('rgba(255,255,255,0.05)')
                    for(let i = 0; i < 200; i++){
                        let p1 = new V2(getRandomInt(0, size.x), getRandomInt(0, size.y))
                        let p2 = p1.add(bgDirection.mul(getRandomInt(1, 4)));
                        pp.lineV2(p1, p2);
                    }
                })
                this.bgImageResetPosition = raySegmentIntersectionVector2(new V2(0,0), bgDirection.mul(-1), { begin: new V2(0,-this.size.y), end: new V2(this.size.x, -this.size.y) })
                this.bgPositions = [new V2(0,0), this.bgImageResetPosition.clone()]

                this.lightEllipsis.rxSq = this.lightEllipsis.size.x*this.lightEllipsis.size.x;
                this.lightEllipsis.rySq = this.lightEllipsis.size.y*this.lightEllipsis.size.y;
                this.aChange = easing.createProps(100, 0.7, 0.1, 'quad', 'out')
                this.timer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < 3; i++){
                        let p1 = new V2(getRandomInt(0,this.size.x*2), 0);
                        //let p1 = new V2(this.size.x/2, 0);
                        let direction = V2.down.rotate(getRandomInt(15,20));
                        let length = getRandomInt(5, 12);
                        let p2 = p1.add(direction.mul(length));
                        let targetY = this.size.y
    
                        let item = {
                            alpha: 0.7,
                            color: 'rgba(255,255,255,0.5)',
                            p1,
                            p2,
                            alive: true,
                            targetY,
                            direction,
                            speedV2: direction.mul(getRandomInt(4,5))
                        };

                        this.items.push(item);
                    }
                    

                    
                    this.createImage();  
                    this.processDrops();
                    
                    this.items = this.items.filter(item => item.alive);
                          
                })
                
            },
            processDrops() {
                this.bgPositions.forEach(p => {
                    p.add(this.bgSpeed, true);

                    if(p.y > this.size.y){
                        p.x = this.bgImageResetPosition.x;
                        p.y = this.bgImageResetPosition.y;
                    }
                })
                for(let i = 0; i < this.items.length; i++){
                    let item = this.items[i];
                    item.p1.add(item.speedV2, true);
                    item.p2.add(item.speedV2, true);
                    let x = item.p1.x;
                    let y = item.p1.y;
                    let dx = fast.r(
                        (((x-this.lightEllipsis.position.x)*(x-this.lightEllipsis.position.x)/this.lightEllipsis.rxSq) 
                        + ((y-this.lightEllipsis.position.y)*(y-this.lightEllipsis.position.y)/this.lightEllipsis.rySq))*100);

                    
                    if(dx > 100){
                        dx = 100;
                    }

                    this.aChange.time = dx;
                    item.alpha = fast.r(easing.process(this.aChange), 2);
                    
                    if(item.p1.y > item.targetY){
                        item.alive = false;
                    }
                }
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    this.bgPositions.forEach(p => {
                        ctx.drawImage(this.bgRainImage, p.x,p.y)
                    })
                    
                    let pp = new PerfectPixel({ctx});

                    for(let i = 0; i < this.items.length; i++){
                        let item = this.items[i];
                        hlp.setFillColor(`rgba(255,255,255, ${item.alpha})`);
                        pp.lineV2(item.p1, item.p2);
                    }

                    hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                })
            }
        }), 4)

        this.floor = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 198),
            size: new V2(this.viewport.x,15),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#7491B3').rect(0,0, size.x, size.y)
                    .setFillColor('#6F89A5').rect(0,0,size.x, 5)
                    .setFillColor('#667E99').rect(0,0,size.x, 2)
                    // .setFillColor('#6F89A8').rect(0,0, size.x, 1)
                    // .setFillColor('#6A84A3').rect(0,0, size.x, 4)
                })
            }
        }), 5)

        this.fence = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 176),
            size: new V2(this.viewport.x,30),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#344052').rect(0,size.y-2, size.x, 2);

                    let currentX = 5; 
                    while(currentX < size.x){
                        hlp.setFillColor('#1A232B').rect(currentX++,0,1,size.y-1);
                        hlp.setFillColor('#121820').rect(currentX-1,0,1,5);

                        hlp.setFillColor('#0B121A').rect(currentX++,0,1,size.y-1)
                        hlp.setFillColor('#2B3642').rect(currentX,0,1,size.y-1)
                        hlp.setFillColor('#1C2931').rect(currentX,0,1,5)

                        hlp.setFillColor('rgba(255,255,255,0.05)').rect(currentX+3, size.y-2, 10,2).rect(currentX+5, size.y-2, 5,2)

                        currentX+=15;
                    }

                    hlp.setFillColor('#546E7F').rect(0,0,size.x, 1)
                    .setFillColor('#253645').rect(0,1,size.x,1)
                    .setFillColor('#17212E').rect(0,2,size.x, 1)
                    
                    hlp.setFillColor('rgba(0,0,0,0.1)').rect(size.x/2,1,size.x/2,2).rect(size.x/2 + 20,1,size.x/2,2).rect(0,0,70, 1).rect(80,0,10, 1)
                })
            }
        }), 6)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-20)),
            size: new V2(100,150),
            init() {
                this.items = [];
                this.raindropsTrails = [];
                this.lightEllipsis = {
                    position: new V2(this.size.x-20, 20),
                    size: new V2(50, 100),
                }

                this.lightEllipsis.rxSq = this.lightEllipsis.size.x*this.lightEllipsis.size.x;
                this.lightEllipsis.rySq = this.lightEllipsis.size.y*this.lightEllipsis.size.y;
                this.aChange = easing.createProps(100, 0.9, 0.3, 'quad', 'out')
                this.timer = this.regTimerDefault(15, () => {
                    let p1 = new V2(getRandomInt(0,this.size.x*2), 0);
                    let direction = V2.down.rotate(getRandomInt(15,30));
                    let length = getRandomInt(10, 15);
                    let p2 = p1.add(direction.mul(length));
                    let targetY = this.size.y - getRandomInt(2,15)

                    let item = {
                        alpha: 0.9,
                        color: 'rgba(255,255,255,0.5)',
                        p1,
                        p2,
                        alive: true,
                        targetY,
                        direction,
                        speedV2: direction.mul(7)
                    };

                    this.items.push(item);

                    if(getRandomInt(0,8) == 0){
                        let p1 = new V2(getRandomGaussian(0,this.size.x), 0);
                        let direction = V2.down.clone();
                        let length = getRandomInt(1, 3);
                        let p2 = p1.add(direction.mul(length));
                        let targetY = this.size.y-1

                        let item = {
                            alpha: 0.9,color: 'rgba(255,255,255,0.5)',
                            p1, p2,
                            alive: true,
                            targetY, direction,
                            speedV2: direction.mul(4)
                        };

                        this.items.push(item);
                    }

                    this.createImage();  
                    this.processDrops();
                    
                    this.items = this.items.filter(item => item.alive);
                    this.raindropsTrails = this.raindropsTrails.filter(item => item.alive);
                          
                })
                
            },
            processDrops() {
                for(let i = 0; i < this.raindropsTrails.length; i++){
                    let item = this.raindropsTrails[i];
                    easing.commonProcess({context: item, targetpropertyName: 'width', propsName: 'wChange', round: true, callbacksUseContext: true})
                    easing.commonProcess({context: item, targetpropertyName: 'a', propsName: 'aChange' })
                }
                for(let i = 0; i < this.items.length; i++){
                    let item = this.items[i];
                    item.p1.add(item.speedV2, true);
                    if(!item.p2Frozen){
                        item.p2.add(item.speedV2, true);

                        if(item.p2.y > item.targetY){
                            //item.p2 = item.targetY;
                            let _p2 = raySegmentIntersectionVector2(item.p1, item.direction, { begin: new V2(0, item.targetY), end: new V2(this.size.x, item.targetY) })
                            if(_p2){
                                item.p2 = _p2
                                item.p2Frozen = true;
                                this.raindropsTrails.push({
                                    alive: true,
                                    position: item.p2.clone(),
                                    width: 1,
                                    a: 0.1,
                                    //maxWidth: 14,
                                    wChange: easing.createProps(20, 1, getRandomInt(4,6),'quad', 'out', function() { this.alive = false }),
                                    aChange: easing.createProps(20, 0.1, 0,'quad', 'out')
                                })
                            }
                        }
                        else {
                            let x = item.p1.x;
                            let y = item.p1.y;
                            let dx = fast.r(
                                (((x-this.lightEllipsis.position.x)*(x-this.lightEllipsis.position.x)/this.lightEllipsis.rxSq) 
                                + ((y-this.lightEllipsis.position.y)*(y-this.lightEllipsis.position.y)/this.lightEllipsis.rySq))*100);

                            
                            if(dx > 100){
                                dx = 100;
                            }

                            this.aChange.time = dx;
                            item.alpha = fast.r(easing.process(this.aChange), 2);
                        }
                    }
                    
                    if(item.p1.y > item.targetY){
                        item.alive = false;
                    }
                }
            },
            createImage() {
                if(!this.lightEllipsisImg){
                    this.lightEllipsisImg = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(255,255,255,0.03)').elipsis(this.lightEllipsis.position.add(new V2(5,0)), this.lightEllipsis.size.mul(0.5))
                        .elipsis(this.lightEllipsis.position.add(new V2(5,0)), this.lightEllipsis.size.mul(0.35))
                        .elipsis(this.lightEllipsis.position.add(new V2(5,0)), this.lightEllipsis.size.mul(0.15))
                    })
                }
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //ctx.drawImage(this.lightEllipsisImg, 0, 0)
                    let pp = new PerfectPixel({ctx});

                    for(let i = 0; i < this.raindropsTrails.length; i++){
                        let item = this.raindropsTrails[i];
                        let p = item.position.toInt();
                        hlp.setFillColor(`rgba(0,0,0,${item.a})`).rect(p.x - item.width, p.y, item.width*2, 1)
                        // if(item.width > 2){
                        //     hlp.rect(p.x - item.width+2, p.y+1, (item.width-2)*2, 1)
                            
                        // }

                        if(item.width > 8){
                            hlp.rect(p.x - item.width+8, p.y+1, (item.width-8)*2, 1)
                        }
                    }

                    for(let i = 0; i < this.items.length; i++){
                        let item = this.items[i];
                        hlp.setFillColor(`rgba(255,255,255, ${item.alpha})`);
                        pp.lineV2(item.p1, item.p2);
                    }
                    
                    //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)

                    //hlp.setFillColor('rgba(255,0,0,0.2)').elipsis(this.ellipsis.position, this.ellipsis.size)
                })
            }
        }), 7)

        this.corridor = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            drawTrapecia({pp, hlp, tl, tr, bl, br, ifToUndefined = (p) => {}, doNotDrawLines = false,}){
                let drawedX = []; 
                let color = hlp.getFillColor();
                if(doNotDrawLines){
                    hlp.setFillColor('rgba(0,0,0,0)');
                }
                let topLinePoints = pp.line(tl.x,tl.y, tr.x,tr.y);
                let bottomLinePoints = pp.line(bl.x,bl.y, br.x,br.y);
                if(doNotDrawLines){
                    hlp.setFillColor(color);
                }
                topLinePoints.forEach(p => {
                    if(drawedX.indexOf(p.x) == -1){
                        let to = bottomLinePoints.find(bp => bp.x == p.x);
                        hlp.rect(p.x, p.y, 1, !to ? ifToUndefined(p): (to.y - p.y))
                        drawedX[drawedX.length] = p.x;
                    }
                    
                })

                return {topLinePoints, bottomLinePoints }
            },
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let holeSize = new V2(70,130);
                    let hole_tl = new V2(65,75);
                    let hole_tr = hole_tl.add(new V2(holeSize.x, 0));
                    let hole_bl = hole_tl.add(new V2(0, holeSize.y));
                    let hole_br = hole_tr.add(new V2(0, holeSize.y));
                    let center = this.position.clone();

                    hlp.setFillColor('#4D637B').rect(0,0,size.x, size.y)
                    hlp.clear(hole_tl.x,hole_tl.y, holeSize.x, holeSize.y)

                    let pp = new PerfectPixel({ctx});
                    //  художественная часть
                    hlp.setFillColor('#3C4C63').rect(69,74,6,1).rect(64,87,1,7).rect(53,94,1,10).rect(54,99,1,10)
                    .rect(59,135,1,6).rect(46,165,1,5).rect(46,54,1,4).rect(46,69,1,4)
                    .rect(59,63,1,15).rect(57,59,1,13).rect(58, 62,1,4).rect(60, 65,1,5)
                    .rect(32,116,1,3).rect(31,117,1,2).rect(16,109,1,3).rect(15,110,1,2)
                    .rect(156,213,1,7).rect(170,119,1,10).rect(158,168,1,15).rect(159,166,1,7).rect(181,241,1,35).rect(182,243,1,36)
                    .rect(54,122,1,3).rect(55,124,1,4).rect(56,125,1,6)

                    pp.line(37,16,57,59)

                    hlp.setFillColor('#5E829C').rect(58,123,1,10).rect(57,123,1,8).rect(56,122,1,7).rect(55,121,1,5).rect(54,120,1,2)
                    .rect(58,146,1,4).rect(57,147,1,4).rect(56,149,1,2).dot(55,150)

                    hlp.setFillColor('#5E8098').rect(139,130,1,6).rect(140,129,1,3).rect(139,142, 1,5).rect(140,142, 1,4).rect(139,152, 1,3).rect(140,153, 1,3)
                    hlp.setFillColor('#6C95AB').rect(144,127,1,3).rect(145,126,1,4).rect(146,126,1,3)
                    hlp.setFillColor('#5D7F98').rect(151,132,1,4).rect(152,131,1,6)
                    .dot(150,145).rect(151,144,1,4).rect(152,143,1,6)
                    .dot(149,157).rect(150,156,1,2).rect(151,156,1,2).rect(152,155,1,3)
                    //hlp.setFillColor('#283444')
                    //  
                    
                    for(let i = 0; i < 9; i++){
                        if(i == 0){
                            hlp.setFillColor('#1D212D');
                        }
                        else {
                            hlp.setFillColor('#30374C')    
                        }
                        
                        pp.line(156+i,0,127+i,74)    
                    }

                    for(let i = 0; i < 5; i++){
                        pp.line(168-i,0,135-i,74)           
                    }

                    hlp.setFillColor('#768FA9').rect(128,75, 7,1)
                    pp.line(128,74, 130,69)    

                    hlp.setFillColor('rgba(0,0,0,0)')
                    let upperBorderLine = {begin: new V2(0, 0), end: new V2(this.size.x, 0)};
                    let bottomBorderLine = {begin: new V2(0, this.size.y), end: new V2(this.size.x, this.size.y)}

                    let hole_tl_directionToCenterInverted = hole_tl.direction(center).mul(-1);
                    let hole_tlToUpperBorder = raySegmentIntersectionVector2(hole_tl, hole_tl_directionToCenterInverted, upperBorderLine)
                    let tlPoints = pp.lineV2(hole_tl, hole_tlToUpperBorder)

                    let hole_tr_directionToCenterInverted = hole_tr.direction(center).mul(-1);
                    let hole_trToUpperBorder = raySegmentIntersectionVector2(hole_tr, hole_tr_directionToCenterInverted, upperBorderLine)
                    let trPoints = pp.lineV2(hole_tr, hole_trToUpperBorder)

                    let hole_bl_directionToCenterInverted = hole_bl.direction(center).mul(-1);
                    let hole_blToBottomBorder = raySegmentIntersectionVector2(hole_bl, hole_bl_directionToCenterInverted, bottomBorderLine)
                    let blPoints = pp.lineV2(hole_bl, hole_blToBottomBorder)

                    
                    let hole_br_directionToCenterInverted = hole_br.direction(center).mul(-1);
                    let hole_brToBottomBorder = raySegmentIntersectionVector2(hole_br, hole_br_directionToCenterInverted, bottomBorderLine)
                    let brPoints = pp.lineV2(hole_br, hole_brToBottomBorder)

                    let topLines = [];
                    tlPoints.forEach(p => {
                        if(!topLines[p.y]){
                            topLines[p.y] = {from: p.x};
                        }
                        else if(topLines[p.y].from > p.x){
                            topLines[p.y].from = p.x;
                        }
                    })

                    trPoints.forEach(p => {
                        if(!topLines[p.y]){
                            return;
                        }
                        
                        if(!topLines[p.y].to){
                            topLines[p.y].to = p.x;
                        }
                        else if(topLines[p.y].to < p.x){
                            topLines[p.y].to = p.x;
                        }
                    })

                    let aChange = easing.createProps(topLines.length-1, 0.7, 0, 'quad', 'in')
                    topLines.forEach((l,i) => {
                        aChange.time = i;
                        let a = easing.process(aChange);
                        a = fast.r((fast.r(a, 2)*100)/5)*5/100;

                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(l.from, i, l.to-l.from, 1)
                    })

                    let bottomLines = [];
                    blPoints.forEach(p => {
                        if(!bottomLines[p.y]){
                            bottomLines[p.y] = {from: p.x};
                        }
                        else if(bottomLines[p.y].from > p.x){
                            bottomLines[p.y].from = p.x;
                        }
                    })

                    brPoints.forEach(p => {
                        if(!bottomLines[p.y]){
                            return;
                        }
                        
                        if(!bottomLines[p.y].to){
                            bottomLines[p.y].to = p.x;
                        }
                        else if(bottomLines[p.y].to < p.x){
                            bottomLines[p.y].to = p.x;
                        }
                    })

                    

                    aChange = easing.createProps(bottomLines.filter(el => el).length-1, 0, 0.75, 'quad', 'out')
                    let vChangeLength = 30;
                    let vChange = easing.createProps(vChangeLength, 65, 48, 'quad', 'out');
                    let firstNotEmptyIndex = bottomLines.indexOf(bottomLines.filter(el => el)[0]);
                    let currentA = undefined;
                    let currentAYClamps = []
                    let plitkaShift = false;
                    let currentXStep = 5;
                    let plitkaBordersAlphaChange = easing.createProps(bottomLines.filter(el => el).length-1, 0.01, 0.1, 'quad', 'out')
                    let plitkaDrawer = (l, i) => {
                        plitkaBordersAlphaChange.time = i;
                        let a = easing.process(plitkaBordersAlphaChange);
                        plitkaShift = !plitkaShift;
                            currentXStep++;
                            let bottomLine = {begin: new V2(0, currentAYClamps[1]-1), end: new V2(size.x, currentAYClamps[1]-1)}
                            let currentX = l.from - plitkaShift ? fast.r(currentXStep/2) : 0;
                            
                            while(currentX < l.to-2){
                                if(currentX > l.from && currentX < l.to){
                                    var randPoint = new V2(currentX, currentAYClamps[0])//new V2(fast.r(size.x/2 + getRandomInt(-10,10)), currentAYClamps[0]);
                                    var randPointToBottomLine = raySegmentIntersectionVector2(randPoint, randPoint.direction(center).mul(-1), bottomLine);
                                    if(randPointToBottomLine){
                                        hlp.setFillColor(`rgba(0,0,0,${a})`);
                                        pp.lineV2(randPoint, randPointToBottomLine)
                                    }

                                    // let isBlack = getRandomBool();
                                    // let _a = getRandom(0.01, 0.1);
                                    
                                    // for(let i = 1; i < currentXStep;i++){
                                    //     if(currentX+i < l.to-5){
                                    //         let _p = new V2(currentX+i, currentAYClamps[0])
                                    //         var _pToBottomLine = raySegmentIntersectionVector2(_p, _p.direction(center).mul(-1), bottomLine);
                                    //         if(_pToBottomLine){
                                    //             hlp.setFillColor(`rgba(${isBlack ? '0,0,0' : '255,255,255'},${_a})`);
                                    //             pp.lineV2(_p, _pToBottomLine)
                                    //             //pp.lineV2(_p.add(new V2(1,0)).toInt(), _pToBottomLine.add(new V2(1,0)).toInt())
                                    //         }
                                        
                                    //     }
                                        
                                    // }
                                    //pp.fillStyleProvider = undefined;
                                }

                                currentX+=currentXStep;
                            }
                    }
                    bottomLines.forEach((l,i) => {
                        aChange.time = i-firstNotEmptyIndex;
                        let a = easing.process(aChange);
                        a = fast.r((fast.r(a, 2)*100)/5)*5/100;

                        if(i-firstNotEmptyIndex <= vChangeLength){
                            vChange.time = i-firstNotEmptyIndex;
                            let v = easing.process(vChange);
                            v = fast.r(v);
                            hlp.setFillColor(colors.hsvToHex([211,37,v])).rect(l.from, i, l.to-l.from, 1)
                        }
                        //hlp.setFillColor('#A0C0E7').rect(l.from, i, l.to-l.from, 1)
                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(l.from, i, l.to-l.from, 1)

                        currentAYClamps[1] = i;

                        if(currentA == undefined){
                            currentA = a;
                            currentAYClamps = [i]    
                        }
                        else if(currentA != a){
                            plitkaDrawer(l, i-firstNotEmptyIndex);
                            currentAYClamps = [i, undefined];
                            currentA = a;
                        }
                    })
                    plitkaDrawer(bottomLines[bottomLines.length-1], bottomLines.length-1-firstNotEmptyIndex);

                    let leftLines = [];
                    for(let x = 0; x < hole_tl.x; x++){
                        let line = {};
                        let tlLinePoint = tlPoints.filter(p => p.x == x);
                        if(!tlLinePoint.length){
                            line.from = new V2(x, -1);
                        }
                        else {
                            line.from = tlLinePoint[0];
                        }

                        let blLinePoint = blPoints.filter(p => p.x == x);

                        if(!blLinePoint.length){
                            line.to = new V2(x, size.y);
                        }
                        else {
                            line.to = blLinePoint[0];
                        }

                        leftLines[x] = line; 

                    }

                    aChange = easing.createProps(leftLines.length-1, 0.70, 0, 'expo', 'in')
                    leftLines.forEach((l,i) => {
                        aChange.time = l.from.x;
                        let a = easing.process(aChange);
                        a = fast.r((fast.r(a, 2)*100)/5)*5/100;
                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(l.from.x, l.from.y+1, 1, l.to.y-l.from.y - 1)
                    })

                    let rightLines = [];
                    for(let x = hole_tr.x; x < size.x; x++){
                        let line = {};
                        let trLinePoint = trPoints.filter(p => p.x == x);
                        if(!trLinePoint.length){
                            line.from = new V2(x, 0);
                        }
                        else {
                            if(trLinePoint.length > 1){
                                line.from = new V2(x, Math.min.apply(null, trLinePoint.map(p => p.y)))
                            }
                            else 
                                line.from = trLinePoint[0];

                        }

                        let brLinePoint = brPoints.filter(p => p.x == x);

                        if(!brLinePoint.length){
                            line.to = new V2(x, size.y);
                        }
                        else {
                            if(brLinePoint.length > 1){
                                line.to = new V2(x, Math.max.apply(null, brLinePoint.map(p => p.y)))
                            }
                            else {
                                line.to = brLinePoint[0];    
                            }
                            
                        }

                        rightLines[rightLines.length] = line; 

                    }

                    aChange = easing.createProps(rightLines.length-1, 0, 0.7, 'expo', 'out')
                    rightLines.forEach((l,i) => {
                        aChange.time = l.from.x - hole_tr.x;
                        let a = easing.process(aChange);
                        a = fast.r((fast.r(a, 2)*100)/5)*5/100;
                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(l.from.x, l.from.y, 1, l.to.y-l.from.y+1)
                    })

                    //161B27
                    let vLineLeft = tlPoints.find(p => p.x == 47);
                    hlp.setFillColor('#161B27').rect(vLineLeft.x,vLineLeft.y+1, 1, 190);
                    let vLineRight = trPoints.find(p => p.x == 155);
                    hlp.setFillColor('#161B27').rect(vLineRight.x,vLineRight.y+1, 1, 203);

                    //door
                    hlp.setFillColor('rgba(0,0,0,0.25)')
                    this.drawTrapecia({pp, hlp, tl: new V2(0,106), tr: new V2(32,119), bl: new V2(4,299), br: new V2(32,256), ifToUndefined: (p )=> (size.y - p.y) })

                    hlp.setFillColor('#161922');
                    for(let i = -1; i < 4; i++){
                        pp.line(4-i,299, 32-i,256);
                    }

                    hlp.setFillColor('#19191C')

                    let doorLines = this.drawTrapecia({pp, hlp, tl: new V2(0,107), tr: new V2(29, 119), bl: new V2(0,298), br: new V2(29,256), ifToUndefined: (p )=> (size.y - p.y) })

                    hlp.setFillColor('rgba(0,0,0,0.25)')
                    pp.line(0,298, 29,256);
                    pp.line(8, doorLines.topLinePoints.find(p => p.x == 8).y, 8, doorLines.bottomLinePoints.find(p => p.x == 8).y-2)

                    hlp.setFillColor('rgba(0,0,0,0.1)')
                    this.drawTrapecia({doNotDrawLines: true, pp, hlp, tl: new V2(0,6), tr: new V2(29, 48), bl: new V2(0,73), br: new V2(29,94), ifToUndefined: (p )=> (size.y - p.y) })
                    let upperWindow = this.drawTrapecia({doNotDrawLines: true,pp, hlp, tl: new V2(0,12), tr: new V2(27, 48), bl: new V2(0,73), br: new V2(27,93), ifToUndefined: (p )=> (size.y - p.y) })
                    hlp.setFillColor('rgba(255,255,255,0.025)');
                    hlp.rectFromTo(new V2(7, upperWindow.topLinePoints.find(p => p.x == 7).y), new V2(8, upperWindow.bottomLinePoints.find(p => p.x == 7).y))
                    hlp.rectFromTo(new V2(8, upperWindow.topLinePoints.find(p => p.x == 8).y-1), new V2(9, upperWindow.bottomLinePoints.find(p => p.x == 9).y-1))
                    hlp.rectFromTo(new V2(20, upperWindow.topLinePoints.find(p => p.x == 20).y-1), new V2(21, upperWindow.bottomLinePoints.find(p => p.x == 21).y-2))
                    hlp.rectFromTo(new V2(21, upperWindow.topLinePoints.find(p => p.x == 21).y-1), new V2(22, upperWindow.bottomLinePoints.find(p => p.x == 22).y-1))

                    hlp.setFillColor('#32404C');
                    this.drawTrapecia({doNotDrawLines: true, pp, hlp, tl: new V2(37,104), tr: new V2(50, 113), bl: new V2(37,165), br: new V2(50,162), ifToUndefined: (p )=> (size.y - p.y) })
                    hlp.setFillColor('rgba(0,0,0,0.2)').rect(36,105, 1, 59)

                    ctx.drawImage(PP.createImage(corridorImageModels.upperLamp), 54,12)
                    ctx.drawImage(PP.createImage(corridorImageModels.upperLamp2), 65,45)
                    
                    
                    let ciAChange = easing.createProps(22, 0.5, 0, 'linear', 'base');
                    let ciWChange = easing.createProps(22, 29, 20, 'linear', 'base');
                    let yStart = 235
                    for(let y = yStart; y <= 256; y++){
                        ciAChange.time = y-yStart;
                        ciWChange.time = y-yStart;
                        let p = blPoints.find(p => p.y == y);
                        hlp.setFillColor(`rgba(0,0,0,${fast.r(easing.process(ciAChange),2)})`).rect(p.x, p.y, fast.r(easing.process(ciWChange)), 1)
                    }
                    
                    
                    yStart = 228
                    let yEnd = 250
                    ciAChange = easing.createProps(yEnd-yStart, 0.35, 0, 'linear', 'base');
                    let ciHChange = easing.createProps(yEnd-yStart, 50, 1, 'linear', 'base');
                    let xPassed = [];
                    for(let y = yStart; y <= yEnd; y++){
                        ciAChange.time = y-yStart;
                        ciHChange.time = y-yStart;
                        let p = blPoints.find(p => p.y == y);
                        if(xPassed.indexOf(p.x) != -1)
                            continue;
                        
                        xPassed.push(p.x);
                        let h = easing.process(ciHChange)
                        hlp.setFillColor(`rgba(0,0,0,${fast.r(easing.process(ciAChange),2)})`).rect(p.x, p.y-h, 1, h)
                    }
                    
                    hlp.setFillColor('rgba(0,0,0,0.3)').rect(70,224,8, 2).rect(70,226,7, 1)
                    ctx.drawImage(PP.createImage(corridorImageModels.corridorItem1), 46,178)

                    yStart = 216
                    yEnd = 235;
                    ciAChange = easing.createProps(yEnd-yStart, 0.75, 0, 'linear', 'base');
                    ciWChange = easing.createProps(yEnd-yStart, 18, 14, 'linear', 'base');
                    ciHChange = easing.createProps(yEnd-yStart, 45, 25, 'linear', 'base');
                    xPassed = [];
                    for(let y = yStart; y <= yEnd; y++){
                        ciAChange.time = y-yStart;
                        ciWChange.time = y-yStart;
                        ciHChange.time = y-yStart;
                        let p = brPoints.find(p => p.y == y);
                        let w = fast.r(easing.process(ciWChange));
                        hlp.setFillColor(`rgba(0,0,0,${fast.r(easing.process(ciAChange),2)})`).rect(p.x-w, p.y, w, 1)
                        if(xPassed.indexOf(p.x) != -1)
                            continue;
                        
                        xPassed.push(p.x);
                        let h = easing.process(ciHChange);
                        hlp.setFillColor(`rgba(0,0,0,${fast.r(easing.process(ciAChange),2)})`).rect(p.x-1, p.y-h, 1, h)
                    }

                    ctx.drawImage(PP.createImage(corridorImageModels.corridorItem2), 119,166)

                    hlp.setFillColor('#262D33').rect(45,113,1,2).rect(46,114,1,5).rect(47,115,1,6);

                    hlp.setFillColor('rgba(0,0,0,0.1)').rect(152,78,1,22)
                    hlp.setFillColor('rgba(0,0,0,0.2)').rect(150,103,1,22).rect(151,104,1,22).rect(152,105,1,23)
                    hlp.setFillColor('rgba(0,0,0,0.15)').rect(153,106,1,27).rect(154,107, 1, 30)
                    hlp.setFillColor('rgba(0,0,0,0.1)').rect(155,107, 1, 35)
                    ctx.drawImage(PP.createImage(corridorImageModels.corridorItem3), 133,78)

                    // hlp.setFillColor('#12161D').rect(180,97,20,10)
                    // hlp.setFillColor('#272B37');
                    // let boxUpperLinePoints = pp.line(180,25,199,-4)
                    // let boxBottomLinePoints = pp.line(180,106,199,97)
                    // boxUpperLinePoints.forEach(p => {
                    //     let to = boxBottomLinePoints.find(_p => _p.x == p.x);
                    //     hlp.rect(p.x, p.y, 1, to.y - p.y);
                    // })

                    // hlp.setFillColor('#657590').rect(180,50, 1,25)

                    ctx.drawImage(PP.createImage(corridorImageModels.corridorItem4), 181,0)
                })            
            }
        }), 10)
    }
}