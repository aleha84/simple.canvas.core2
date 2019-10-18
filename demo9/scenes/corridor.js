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

        this.corridor = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
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

                    let aChange = easing.createProps(topLines.length-1, 0.75, 0, 'quad', 'in')
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
                    })

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

                    aChange = easing.createProps(leftLines.length-1, 0.75, 0, 'quad', 'in')
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

                    aChange = easing.createProps(rightLines.length-1, 0, 0.75, 'quad', 'out')
                    rightLines.forEach((l,i) => {
                        aChange.time = l.from.x - hole_tr.x;
                        let a = easing.process(aChange);
                        a = fast.r((fast.r(a, 2)*100)/5)*5/100;
                        hlp.setFillColor(`rgba(0,0,0,${a})`).rect(l.from.x, l.from.y, 1, l.to.y-l.from.y+1)
                    })
                })            
            }
        }), 10)
    }
}