class RyanBusScene extends Scene {
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
        this.backgroundRenderDefault('#3E3F43');
    }

    start(){
        this.mountains = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(RyanBusScene.models.mountains)
        }), 1)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(RyanBusScene.models.road)
        }), 3)

        this.bus = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(RyanBusScene.models.bus)
        }), 6)

        this.foreGround = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.maskPointsProps1 = {
                    vFrom: 45,
                    vTo: 100,
                    aFrom: 0.25,
                    aTo: 1
                }

                this.maskPointsProps2 = {
                    vFrom: 15,
                    vTo: 100,
                    aFrom: 0.05,
                    aTo: 0.5
                }

                this.maskPoints1 = [];
                this.maskPoints2 = [];
                let maskCorners = RyanBusScene.models.getLightMask().main.layers[0].groups[0].points.map(p => new V2(p.point));
                let lightEmitters = RyanBusScene.models.getLightMask().main.layers[0].groups[1].points.map(p => new V2(p.point));
                let maskLinePoints = [];

                let leMaxDistance = fast.r(lightEmitters.reduce((acc, cur, index) => {   
                    let distanceToOtherEmitters = lightEmitters.filter(le => le != cur).map(le => le.distance(cur));
                    let max = Math.max.apply(null, distanceToOtherEmitters)
                    
                    if(max > acc) return max;
                    return acc;
                    }, 0));

                let lines = [];
                for(let i = 0; i < maskCorners.length;i++){
                    if(i < maskCorners.length-1)
                        lines.push({begin: maskCorners[i], end: maskCorners[i+1]})
                    else 
                        lines.push({begin: maskCorners[i], end: maskCorners[0]})
                }

                let m2FillStyleProvider = (x,y) => {
                    let a = maskProcesser(x,y, 'expo', 1, 0);
                    a = fast.r((fast.r((a*100)/5)*5)/100,2)
                    return `rgba(225,246,253,${a})`;
                }

                let m1FillStyleProvider = (x,y) => {
                    return `rgba(225,246,253,${maskProcesser(x,y, 'sin', 1, 0)})`;
                }

                let maskProcesser = (x,y, type = 'quad', aFrom = 1, aTo = 0) => {
                    let p = new V2(x,y);
                    
                    // debugger;
                    // p = new V2(133,25);

                    if(lightEmitters.filter(l => l.equal(p)).length)
                        return 1;
                     
                    if(maskLinePoints.filter(l => l.equal(p)).length)
                        return 0;
                        
                    let totalA = 0;

                    lightEmitters.forEach(le => {
                        let distanceLe = le.distance(p)
                        let closestLe = le;

                        let directionLe = closestLe.direction(p);
                        let segmentIntersection = undefined;
                        let distanceToSegment = undefined;
                        for(let i = 0; i < lines.length; i++){
                            let _segmentIntersection = raySegmentIntersectionVector2(p, directionLe, lines[i])
                            if(_segmentIntersection != undefined){
                                let d = _segmentIntersection.distance(closestLe);
                                if(segmentIntersection == undefined){
                                    segmentIntersection = _segmentIntersection;
                                    distanceToSegment = d;
                                }
                                else {
                                    if(d < distanceToSegment){
                                        distanceToSegment = d;
                                        segmentIntersection = _segmentIntersection;
                                    }
                                }
                            }
                                //break;
                        }



                        if(segmentIntersection == undefined)
                            return 0;
                            //return 'rgba(255,0,0,0.25)'; 

                        distanceLe = fast.r(distanceLe);
                        let distanceLEtoLP = fast.r(segmentIntersection.distance(closestLe));
                        let aChange = easing.createProps(distanceLEtoLP, aFrom, aTo, type, 'out');
                        aChange.time = distanceLe > distanceLEtoLP ? distanceLEtoLP : distanceLe;
                        let a = easing.process(aChange);

                        totalA+=a;
                    })

                    return totalA;
                }

                this.mask = createCanvas(this.size, (ctx, size, hlp) => {

                    let pp = new PerfectPixel({ctx});

                    //  pp.setFillStyle('rgba(255,0,0,0.25)');
                    //  pp.fillByCornerPoints(maskCorners)
                    
                    pp.fillStyleProvider = m1FillStyleProvider;

                    pp.fillByCornerPoints(maskCorners)
                })

                this.mask2 = createCanvas(this.size, (ctx, size, hlp) => {

                    let pp = new PerfectPixel({ctx});

                    pp.setFillStyle('rgba(0,0,0,0)');
                    for(let i = 0; i < lines.length; i++){
                        maskLinePoints.push(...pp.lineL(lines[i]));
                    }

                    maskLinePoints = distinct(maskLinePoints, (p) => p.x+'_'+p.y).map(p => new V2(p));
                    
                    pp.fillStyleProvider = m2FillStyleProvider;

                    pp.fillByCornerPoints(maskCorners)
                })

                let changes1 = {
                    vChange: easing.createProps(100,this.maskPointsProps1.vFrom,this.maskPointsProps1.vTo, 'linear', 'base'),
                    aChange: easing.createProps(100,this.maskPointsProps1.aFrom,this.maskPointsProps1.aTo, 'linear', 'base')
                }

                let changes2 = {
                    vChange: easing.createProps(100,this.maskPointsProps2.vFrom,this.maskPointsProps2.vTo, 'linear', 'base'),
                    aChange: easing.createProps(100,this.maskPointsProps2.aFrom,this.maskPointsProps2.aTo, 'linear', 'base')
                }

                
                for(let y = 0; y < this.size.y; y++){
                    this.maskPoints1[y] = new Array(this.size.x).fill(0);
                    this.maskPoints2[y] = new Array(this.size.x).fill(0);
                    for(let x = 0; x < this.size.x; x++){
                        if(pointInsidePoligon({x,y}, maskCorners)){
                            let aValue = maskProcesser(x,y);
                            changes1.vChange.time = fast.r(aValue*100);
                            changes1.aChange.time = fast.r(aValue*100);

                            changes2.vChange.time = fast.r(aValue*100);
                            changes2.aChange.time = fast.r(aValue*100);
                            //hlp.setFillStyle(`rgba(255,255,255,${maskProcesser(x,y)})`).dot(x,y);
                        }
                        else {
                            changes1.aChange.time = 0;
                            changes1.vChange.time = 0;

                            changes2.aChange.time = 0;
                            changes2.vChange.time = 0;
                        }

                        let a1 = fast.r(easing.process(changes1.aChange),2);
                        let rgb1 = hsvToRgb(197,2,fast.r(easing.process(changes1.vChange)), false, true);
                        this.maskPoints1[y][x] = `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${a1})` 

                        let a2 = fast.r(easing.process(changes2.aChange),2);
                        let rgb2 = hsvToRgb(197,2,fast.r(easing.process(changes2.vChange)), false, true);
                        this.maskPoints2[y][x] = `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, ${a2})` 
                    }
                }


                this.frames = [
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 100,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 50, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 200,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 300, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 200,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 300, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 200,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 300, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    // this.createFrames({ framesCount: 200,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 300, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    // this.createFrames({ framesCount: 200,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 300, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints1 }),
                    this.createFrames({ framesCount: 300,  direction: V2.down.rotate(getRandomInt(25,45)), dotsCount: 1000, xClamps: [0, this.size.x*2], maskPoints: this.maskPoints2 }),
                ]

                // for(let i = 0; i < 5; i++){
                //     let rotate = getRandomInt(25,45);
                //     let xClamps = [-this.size.x, this.size.x];
                //     if(rotate > 0){
                //         xClamps = [0, this.size.x*2];
                //     }


                //     this.frames[this.frames.length] = this.createFrames({ framesCount: 100*getRandomInt(1,5), 
                //         direction: V2.down.rotate(rotate), dotsCount: 500, xClamps: xClamps })
                // }

                this.snowflakesLayers = this.frames.map(f => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames: f,
                        init() {
                            // this.shouldRed = this.frames.length == 750;
                            // this.shouldRedFireCounter = 2;
                            this.currentFrame = 0;
                            this.timer = this.regTimerDefault(15, () => {
                                

                                this.img = this.frames[this.currentFrame++];
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                    // if(this.shouldRed){
                                    //     this.shouldRedFireCounter--
                                    //     if(this.shouldRedFireCounter == 0){
                                    //         this.addChild(new GO({
                                    //             position: new V2(),
                                    //             size: this.size,
                                    //             img: createCanvas(this.size, (ctx, size, hlp) => {
                                    //                 hlp.setFillStyle('red').strokeRect(0,0,size.x, size.y);
                                    //             })
                                    //         }))
                                    //     }
                                    // }
                                }
                            })
                        }
                    }))
                )


                this.img = this.mask2;
            },
            createFrames({framesCount, direction, dotsCount, xClamps, maskPoints}) {
                let dots = new Array(dotsCount).fill().map(() => new V2(getRandomInt(xClamps[0], xClamps[1]), 0));
                let etalonDestination = raySegmentIntersectionVector2(
                    new V2(), direction, {begin: new V2(-2*this.size.x, this.size.y), end: new V2(3*this.size.x, this.size.y)});
                let distance = new V2().distance(etalonDestination);
                let distancePerFrame = distance/framesCount;
                let deltaPerFrameV2 = etalonDestination.divide(framesCount);

                //let speedMul = (this.size.y/direction.y)/framesCount;
                let dotsPositions = [];

                for(let dotIndex = 0; dotIndex < dots.length; dotIndex++){
                    let dot = dots[dotIndex];
                    dotsPositions[dotIndex] = {
                        initial: dot.clone(),
                        frames: []
                    };
                    let dp = dotsPositions[dotIndex];
                    for(let frame = 0; frame < framesCount; frame++){
                        dp.frames[frame] = dot.add(deltaPerFrameV2.mul(frame))//dot.add(direction.mul(distancePerFrame*frame));
                    }
                }
                
                let dotsCurrentFrames = new Array(dotsCount).fill().map(() => getRandomInt(0, framesCount-1));
                let frames = [];
                for(let frame = 0; frame < framesCount; frame++){
                    frames[frame] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let dotIndex = 0; dotIndex < dots.length; dotIndex++){
                            
                            let dotCurrentFramePosition = dotsPositions[dotIndex].frames[dotsCurrentFrames[dotIndex]];
                            
                            let x = fast.r(dotCurrentFramePosition.x);
                            let y = fast.r(dotCurrentFramePosition.y);
                            let row = maskPoints[y];
                            let value = 0;
                            if(row != undefined)
                                value = row[x]
                            let color = value;
                            hlp.setFillStyle(color).dot(x, y);

                            dotsCurrentFrames[dotIndex]++;
                            if(dotsCurrentFrames[dotIndex] == framesCount){
                                dotsCurrentFrames[dotIndex] = 0;
                            }
                        }
                    })
                }

                return frames;
            },
        }), 9)
    }
}