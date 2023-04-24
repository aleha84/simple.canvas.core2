class Demo9TrainScene extends Scene {
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
        this.backgroundRenderDefault('#362013');
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('#362013').dot(0,0)
            })
        }), 0)

        this.background = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    img: PP.createImage(Demo9TrainScene.models.background)
                }))
            }
        }), 1)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('#1F0A07');
                    let lines = [{from: {x: 51, y: 0},to: {x: 199,y: 12} }, {from: {x: 0, y: 66},to: {x: 199,y: 78} }]
                    lines.forEach(l => {
                        pp.lineL(l)
                    })

                    lines = [{from: {x: 0, y: 35},to: {x: 199,y: 46} }, {from: {x: 0, y: 37},to: {x: 199,y: 54} },
                        {from: {x: 0, y: 53},to: {x: 199,y: 60} },  {from: {x: 0, y: 77},to: {x: 199,y: 81} }, {from: {x: 0, y: 84},to: {x: 199,y: 94} }]

                    pp.setFillStyle('#200B03');
                    lines.forEach(l => {
                        pp.lineL(l)
                    })
                })
            }
        }), 4)

        this.train = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    img: PP.createImage(Demo9TrainScene.models.train)
                }))
            }
        }), 5)

        this.foreground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    img: PP.createImage(Demo9TrainScene.models.foreground)
                }))

                this.snowflakes = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    init() {
                        //this.totalFramesCount = 100;

                        this.maskPointsProps = {
                            vFrom: 25,
                            vTo: 100,
                            aFrom: 0.25,
                            aTo: 1
                        }
                        this.maskPoints = [];

                        let maskCorners = [new V2(45,35), new V2(78,18), new V2(94,10), new V2(100,8), new V2(107,7), new V2(118,10), new V2(124,14), new V2(131,22), new V2(136,31)
                            , new V2(139,39), new V2(148,41), new V2(157,35), new V2(165,29), new V2(172,26), new V2(181,26), new V2(191,31), new V2(199,38), 
                            new V2(250,100), new V2(250,199), new V2(0,199), new V2(0,59)];

                        let lightEmitters = [new V2(104,19),new V2(105,19),new V2(106,19),new V2(107,20),new V2(108,20),new V2(109,21),new V2(110,21),new V2(111,21)
                            ,new V2(112,22),new V2(113,22),new V2(114,23),new V2(115,23),new V2(116,23),new V2(117,24),
                            new V2(169,30),new V2(170,30),new V2(171,29),new V2(172,29),new V2(173,29),new V2(174,29),new V2(175,29),new V2(176,28),new V2(177,28),new V2(178,28),new V2(179,28),new V2(180,28),new V2(181,28),new V2(182,28),
                        ]

                        let lines = [];
                            for(let i = 0; i < maskCorners.length;i++){
                                if(i < maskCorners.length-1)
                                    lines.push({begin: maskCorners[i], end: maskCorners[i+1]})
                                else 
                                    lines.push({begin: maskCorners[i], end: maskCorners[0]})
                            }

                        let fillStyleProvider = (x,y) => {
                            return `rgba(255,255,255,${maskProcesser(x,y)})`;
                        }

                        let m2FillStyleProvider = (x,y) => {
                            return `rgba(255,255,255,${maskProcesser(x,y, 'expo', 0.2, 0)})`;
                        }

                        let maskProcesser = (x,y, type = 'quad', aFrom = 1, aTo = 0) => {
                            let p = new V2(x,y);
                            
                            // debugger;
                            // p = new V2(133,25);

                            if(lightEmitters.filter(l => l.equal(p)).length)
                                return 1;

                            let distanceLe = lightEmitters[0].distance(p)
                            let closestLe = lightEmitters[0];
                            for(let i = 1; i < lightEmitters.length; i++){
                                let d = lightEmitters[i].distance(p);
                                if(d < distanceLe){
                                    distanceLe = d;
                                    closestLe = lightEmitters[i]
                                }
                            }

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


                            return a;//`rgba(255,255,255,${a})`;
                        }

                        this.mask = createCanvas(this.size, (ctx, size, hlp) => {

                            let pp = new PerfectPixel({ctx});

                            //  pp.setFillStyle('rgba(255,0,0,0.25)');
                            //  pp.fillByCornerPoints(maskCorners)
                            
                            pp.fillStyleProvider = fillStyleProvider;

                            pp.fillByCornerPoints(maskCorners)
                        })

                        this.mask2 = createCanvas(this.size, (ctx, size, hlp) => {

                            let pp = new PerfectPixel({ctx});
                            
                            pp.fillStyleProvider = m2FillStyleProvider;

                            pp.fillByCornerPoints(maskCorners)
                        })

                        let vChange = easing.createProps(100,this.maskPointsProps.vFrom,this.maskPointsProps.vTo, 'linear', 'base');
                        let aChange2 = easing.createProps(100,this.maskPointsProps.aFrom,this.maskPointsProps.aTo, 'linear', 'base');

                        for(let y = 0; y < this.size.y; y++){
                            this.maskPoints[y] = new Array(this.size.x).fill(0);
                            for(let x = 0; x < this.size.x; x++){
                                if(pointInsidePoligon({x,y}, maskCorners)){
                                    let aValue = maskProcesser(x,y);
                                    vChange.time = fast.r(aValue*100);
                                    aChange2.time = fast.r(aValue*100);
                                    //hlp.setFillStyle(`rgba(255,255,255,${maskProcesser(x,y)})`).dot(x,y);
                                }
                                else {
                                    aChange2.time = 0;
                                    vChange.time = 0;
                                }

                                let a2 = fast.r(easing.process(aChange2),2);
                                let rgb = hsvToRgb(197,2,fast.r(easing.process(vChange)), false, true);
                                this.maskPoints[y][x] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a2})` //hsvToHex({hsv: [197,2,fast.r(easing.process(vChange))]})
                            }
                        }

                        
                        this.speedClamps =   [0.25,0.75]
                        this.dots = [];
                        this.dotsCount = 1000;
                        /*
                        for(let i = 0; i < this.dotsCount; i++){
                            let pointX = getRandomInt(0,this.size.x)
                            let pointY = getRandomInt(0,this.size.y)
            
                            //this.dots.push(new V2(pointX, pointY))
                            this.dots.push(this.pointGenerator(true));
                        }
                        // this.timer = this.regTimerDefault(15, () => {
                        //     this.createImage();
                        // })
                        */

                        this.img = this.mask2;

                        this.frames = [
                        ]

                        for(let i = 0; i < 10; i++){
                            let rotate = getRandomInt(-45,45);
                            let xClamps = [-this.size.x, this.size.x];
                            if(rotate > 0){
                                xClamps = [0, this.size.x*2];
                            }

                            this.frames[this.frames.length] = this.createFrames({ framesCount: 250*getRandomInt(1,3), 
                                direction: V2.down.rotate(rotate), dotsCount: 300, xClamps: xClamps })
                        }

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
                        

                    },
                    pointGenerator(init = false) {
                        let point = {
                            position: new V2(init ? getRandomInt(0, this.size.x) : getRandomInt(-this.size.x, this.size.x*2), init? getRandomInt(0, this.size.y) : -1),
                            speed:  V2.right.rotate(getRandomInt(45,135)).mul(getRandom(this.speedClamps[0],this.speedClamps[1])),
                            alive: true,
                        };

                        point.originSpeed = point.speed.clone();
                        point.speedXChangeDirection = 1;
                        //point.speedXChange = easing.createProps(getRandomInt(50,150), point.speed.x, point.speedXChangeDirection*point.originSpeed.x, 'quad', 'inOut')

                        return point;
                    },
                    createFrames({framesCount, direction, dotsCount, xClamps}) {
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
                                    let row = this.maskPoints[y];
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
                    createImage() {

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {

                            for(let i = 0; i < this.dots.length; i++){
                                let dot = this.dots[i];
                                let x = fast.r(dot.position.x);
                                let y = fast.r(dot.position.y);
                                let row = this.maskPoints[y];
                                let value = 0;
                                if(row != undefined)
                                    value = row[x]
                                
                                let color = value;//`rgba(255,255,255, ${value})`;
                                hlp.setFillStyle(color).dot(x, y);

                                dot.position.add(dot.speed, true)//y+=0.5

                                if(!dot.speedXChange){
                                    dot.speedXChangeDirection*=-1;
                                    dot.speedXChange = easing.createProps(getRandomInt(50,150), dot.speed.x, dot.speedXChangeDirection*dot.originSpeed.x, 'quad', 'inOut')
                                }
                                else {
                                    easing.commonProcess({
                                        context: dot, propsName: 'speedXChange', removePropsOnComplete: true, setter: (value) => {dot.speed.x = value;}
                                    })

                                    //dot.speed.x = easing.process(dot.speedXChange);
                                }
                            }

                            this.dots = this.dots.filter(d => d.position.y < size.y && d.position.x >= 0 && d.position.x < size.x);

                            while(this.dots.length < this.dotsCount){
                                this.dots.push(this.pointGenerator());
                            }


                            //ctx.drawImage(this.mask2, 0,0);
                            //ctx.drawImage(this.mask, 0,0);
                            // ctx.globalCompositeOperation = 'source-in';
                            // ctx.drawImage(snowImg, 0,0);

                            // ctx.globalCompositeOperation = 'source-over';
                            // ctx.drawImage(this.mask, 0,0);
                        })
                    }
                }));
            }
        }), 10)

        console.log(this.foreground)
    }
}