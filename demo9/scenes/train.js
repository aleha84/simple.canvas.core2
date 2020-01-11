class Demo9TrainScene extends Scene {
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
        this.backgroundRenderDefault('#362013');
    }

    start(){
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

                    pp.setFillStyle('#2b150d');
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

                        this.mask = createCanvas(this.size, (ctx, size, hlp) => {
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

                            let pp = new PerfectPixel({ctx});

                            //  pp.setFillStyle('rgba(255,0,0,0.25)');
                            //  pp.fillByCornerPoints(maskCorners)
                            
                            pp.fillStyleProvider = (x,y) => {
                                let p = new V2(x,y);
                                
                                // debugger;
                                // p = new V2(133,25);

                                if(lightEmitters.filter(l => l.equal(p)).length)
                                    return `rgba(255,255,255,1)`;

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
                                    return 'rgba(0,0,0,0)';
                                    //return 'rgba(255,0,0,0.25)'; 

                                distanceLe = fast.r(distanceLe);
                                let distanceLEtoLP = fast.r(segmentIntersection.distance(closestLe));
                                let aChange = easing.createProps(distanceLEtoLP, 1, 0.1, 'quad', 'out');
                                aChange.time = distanceLe > distanceLEtoLP ? distanceLEtoLP : distanceLe;
                                let a = easing.process(aChange);


                                return `rgba(255,255,255,${a})`;
                            }

                            pp.fillByCornerPoints(maskCorners)
                        })

                        //this.img = this.mask;
                        //this.createImage();
                        this.speedClamps =   [0.25,0.75]
                        this.dots = [];
                        this.dotsCount = 1000;
                        for(let i = 0; i < this.dotsCount; i++){
                            let pointX = getRandomInt(0,this.size.x)
                            let pointY = getRandomInt(0,this.size.y)
            
                            //this.dots.push(new V2(pointX, pointY))
                            this.dots.push(this.pointGenerator(true));
                        }
                        this.timer = this.regTimerDefault(15, () => {
                            this.createImage();
                        })
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
                    createImage() {
                        let snowImg = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('#BCCCCE');
                            hlp.setFillColor('#f6fbfd')
                            for(let i = 0; i < this.dots.length; i++){
                                let dot = this.dots[i];
                                hlp.dot(fast.r(dot.position.x), fast.r(dot.position.y));

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
                                //this.dots.push(new V2(getRandomInt(0,size.x), 0))
                                this.dots.push(this.pointGenerator());
                            }
                        })

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(this.mask, 0,0);
                            ctx.globalCompositeOperation = 'source-in';
                            ctx.drawImage(snowImg, 0,0);
                        })
                    }
                }));
            }
        }), 10)

        console.log(this.foreground)
    }
}