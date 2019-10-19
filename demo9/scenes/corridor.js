class Demo9CorridorScene extends Scene {
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
        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,200),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#181D23').rect(0,0,size.x, size.y)
                    
                })
            }
        }), 1)

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
        }), 2)

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

                        currentX+=15;
                    }

                    hlp.setFillColor('#546E7F').rect(0,0,size.x, 1)
                    .setFillColor('#253645').rect(0,1,size.x,1)
                    .setFillColor('#17212E').rect(0,2,size.x, 1)
                    
                })
            }
        }), 3)

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
                    //let p1 = new V2(this.size.x/2, 0);
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
                        this.raindropsTrails.push({
                            alive: true,
                            position: item.p2.clone(),
                            width: 1,
                            a: 0.1,
                            //maxWidth: 14,
                            wChange: easing.createProps(20, 1, getRandomInt(10,20),'quad', 'out', function() { this.alive = false }),
                            aChange: easing.createProps(20, 0.1, 0,'quad', 'out')
                        })
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
        }), 4)

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
                })            
            }
        }), 10)
    }
}