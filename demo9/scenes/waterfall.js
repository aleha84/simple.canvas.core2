class Waterfall2Scene extends Scene {
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
        this.backgroundRenderDefault('#71B23C');
    }

    start() {
        this.topVegColor = '#71A649';

        this.addGo(new GO({
            vegColor: this.topVegColor,
            position: new V2(370, 90),
            size: new V2(300, 150),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor).rect(0,0,size.x, size.y)
                })

                let props =  [
                    {p: new V2(-130, -70), radius: 20},
                    {p: new V2(-145, -45), radius: 20},
                    {p: new V2(-145, 15), radius: 50},
                    {p: new V2(-210, 30), radius: 30},
                    {p: new V2(0, -50), radius: 30},
                    {p: new V2(40, -60), radius: 40},
                    {p: new V2(90, -70), radius: 50}
               ]
                    props.forEach(prop => {
                        this.addChild(new GO({
                            position: prop.p,
                            size: new V2(1,1),
                            radius: prop.radius,
                            vegColor: this.vegColor,
                            init()  {
                                this.size = new V2(this.radius*2, this.radius*2)
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor(this.vegColor).circle(new V2(this.radius, this.radius), this.radius)
                                });
                            }
                            }));
                    })
            }
        }), 3)

        this.addGo(new Waterfall2Layer({
            position: new V2(300, 62.5),
            size: new V2(60, 97),
            tlCircleRadius: 15,
            pikeChangeDelay: [4,8],
            pikeUpperY: [14,15],
            pikeLowerY: [15, 17],
            pikeRandomHeight: 3,
            pikeRadius: [4,6],
            shadowHeight: 20,
            cloudSizes: [3,10],
            cloudStartYShift: 5,
            cloudLoopCount: 3,
            waterColor: '#B1E2E2',
            fallColor: '#E0EFE6',
            
        }), 4)

        this.addGo(new GO({
            position: new V2(340, 62.5),
            size: new V2(50, 97),
            vegColor: this.topVegColor,
            tlCircleRadius: 15,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                        .rect(this.tlCircleRadius, 1, size.x, size.y)
                        .rect(1, this.tlCircleRadius, size.x, size.y);
                })
            }
            
        }), 5)

        this.upperVegColor = '#599649';
        this.addGo(new GO({
            vegColor: this.upperVegColor,
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+20),
            size: new V2(this.viewport.x, 120),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor).rect(0,0,size.x, size.y)
                        
                })

                let props =  [{p: new V2(-100, -50), radius: 35}, 
                    {p: new V2(-190, -40), radius: 70},
                {p: new V2(-120, -80), radius: 20},
                {p: new V2(-180, -100), radius: 30},
                {p: new V2(-215, -105), radius: 15},
                {p: new V2(-250, -90), radius: 30},
                {p: new V2(130, -60), radius: 30},
                {p: new V2(180, -70), radius: 50},
                {p: new V2(250, -70), radius: 50}]
                    props.forEach(prop => {
                        this.addChild(new GO({
                            position: prop.p,
                            size: new V2(1,1),
                            radius: prop.radius,
                            vegColor: this.vegColor,
                            init()  {
                                this.size = new V2(this.radius*2, this.radius*2)
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor(this.vegColor).circle(new V2(this.radius, this.radius), this.radius)
                                });
                            }
                            }));
                    })
            }
        }), 10)

        this.upperLayerTlCircleRadius = 15;
        this.upperPositionY = 132.5
        this.upperHeight = 47
        this.addGo(new Waterfall2Layer({
            position: new V2(250, this.upperPositionY),
            size: new V2(110, this.upperHeight),
            tlCircleRadius: this.upperLayerTlCircleRadius,
            pikeChangeDelay: [4,8],
            pikeUpperY: [14,15],
            pikeLowerY: [15, 17],
            pikeRandomHeight: 3,
            pikeRadius: [4,6],
            shadowHeight: 15,
            cloudSizes: [3,10],
            cloudStartYShift: 5,
            cloudLoopCount: 3,
            waterColor: '#7CCEB8',
            fallColor: '#B6DBC6',
            
        }), 11)

        this.addGo(new GO({
            position: new V2(320, this.upperPositionY),
            size: new V2(50, this.upperHeight),
            vegColor: this.upperVegColor,
            tlCircleRadius: this.upperLayerTlCircleRadius,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                        .rect(this.tlCircleRadius, 1, size.x, size.y)
                        .rect(1, this.tlCircleRadius, size.x, size.y);
                })
            }
            
        }), 12)


        this.lowerLayerHeight = 90;
        this.lowerLayerPositionY = 200;
        this.lowerLayerTlCircleRadius = 12;
        this.vegColor = '#357249';
        this.bottomVegColor = '#1C5C49'

        this.addGo(new GO({
            position: new V2(125, this.lowerLayerPositionY + 1),
            size: new V2(100, this.lowerLayerHeight),
            vegColor: this.vegColor,
            //tlCircleRadius: this.lowerLayerTlCircleRadius,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .rect(0,0,size.x, size.y)
                })

                let props =  [{p: new V2(5, -this.size.y/2 + 5), radius: 20}, 
                {p: new V2(-this.size.x/4, -this.size.y/2), radius: 30},
                {p: new V2(-this.size.x/2 - 20, -20), radius: 40},
                {p: new V2(-this.size.x/2 - 30, this.size.y/2), radius: 45},
                {p: new V2(-this.size.x*1.25, this.size.y/2-5), radius: 30},
                {p: new V2(250, -40), radius: 30},{p: new V2(330, -50), radius: 60}]
                props.forEach(prop => {
                        this.addChild(new GO({
                            position: prop.p,
                            size: new V2(1,1),
                            radius: prop.radius,
                            vegColor: this.vegColor,
                            init()  {
                              this.size = new V2(this.radius*2, this.radius*2)
                              this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                  hlp.setFillColor(this.vegColor).circle(new V2(this.radius, this.radius), this.radius)
                              });
                            }
                          }));
                    })

                
            }
            
        }), 19)

        this.addGo(new Waterfall2Layer({
            position: new V2(225, this.lowerLayerPositionY),
            size: new V2(150, this.lowerLayerHeight),
            tlCircleRadius: this.lowerLayerTlCircleRadius,
            pikeChangeDelay: [4,8],
            //showCloudsCountInDebug: true
        }), 20)

        this.addGo(new GO({
            position: new V2(425, this.lowerLayerPositionY),
            size: new V2(300, this.lowerLayerHeight),
            vegColor: this.vegColor,
            tlCircleRadius: this.lowerLayerTlCircleRadius,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                        .rect(this.tlCircleRadius, 1, size.x, size.y)
                        .rect(1, this.tlCircleRadius, size.x, size.y);
                })
            }
            
        }), 21)

        this.bottomLayerHeight = 40;
        this.bottomLayerPositionY = this.lowerLayerPositionY + this.lowerLayerHeight/2 + this.bottomLayerHeight/2;

        this.addGo(new GO({
            vegColor: this.bottomVegColor,
            position: new V2(this.sceneCenter.x, this.bottomLayerPositionY),
            size: new V2(this.viewport.x, this.bottomLayerHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor).rect(0,0,size.x, size.y)
                        
                })

                let props =  [{p: new V2(100, -15), radius: 30}, 
                    {p: new V2(170, -35), radius: 60},
                    {p: new V2(230, -15), radius: 100},
                    {p: new V2(230, -100), radius: 40},
                    {p: new V2(270, -140), radius: 60}, ]
                    props.forEach(prop => {
                        this.addChild(new GO({
                            position: prop.p,
                            size: new V2(1,1),
                            radius: prop.radius,
                            vegColor: this.vegColor,
                            init()  {
                                this.size = new V2(this.radius*2, this.radius*2)
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor(this.vegColor).circle(new V2(this.radius, this.radius), this.radius)
                                });
                            }
                            }));
                    })
            }
        }), 30)

        this.bottomLayerTlCircleRadius = 11;
        this.addGo(new Waterfall2Layer({
            position: new V2(120, this.bottomLayerPositionY-0.5),
            size: new V2(50, this.bottomLayerHeight+1),
            tlCircleRadius: this.bottomLayerTlCircleRadius,
            pikeChangeDelay: [4,8],
            pikeUpperY: [14,15],
            pikeLowerY: [12, 12],
            pikeRandomHeight: 3,
            pikeRadius: [8,10],
            shadowHeight: 15,
            cloudSizes: [3,10],
            cloudStartYShift: 5,
            cloudLoopCount: 3,
            waterColor: '#3BAB80',
            fallColor: '#CBE3D7',
            
        }), 31)

        this.addGo(new GO({
            position: new V2(165, this.bottomLayerPositionY-1),
            size: new V2(60, this.bottomLayerHeight),
            vegColor: this.bottomVegColor,
            tlCircleRadius: this.bottomLayerTlCircleRadius,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                        .rect(this.tlCircleRadius, 1, size.x, size.y)
                        .rect(1, this.tlCircleRadius, size.x, size.y);
                })
            }
            
        }), 32)

        this.addGo(new Waterfall2Layer({
            position: new V2(210, this.bottomLayerPositionY-0.5),
            size: new V2(90, this.bottomLayerHeight+1),
            tlCircleRadius: this.bottomLayerTlCircleRadius,
            pikeChangeDelay: [4,8],
            pikeUpperY: [14,15],
            pikeLowerY: [14, 16],
            pikeRandomHeight: 3,
            pikeRadius: [5,7],
            shadowHeight: 15,
            cloudSizes: [3,10],
            cloudStartYShift: 5,
            cloudLoopCount: 3,
            waterColor: '#3BAB80',
            fallColor: '#CBE3D7',
            
        }), 33)

        this.addGo(new GO({
            position: new V2(275, this.bottomLayerPositionY-1),
            size: new V2(60, this.bottomLayerHeight),
            vegColor: this.bottomVegColor,
            tlCircleRadius: this.bottomLayerTlCircleRadius,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor)
                        .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                        .rect(this.tlCircleRadius, 1, size.x, size.y)
                        .rect(1, this.tlCircleRadius, size.x, size.y);
                })
            }
            
        }), 34)


        this.addGo(new GO({
            vegColor: '#33715D',
            position: new V2(this.sceneCenter.x, this.bottomLayerPositionY+ this.bottomLayerHeight/2 + 7),
            size: new V2(this.viewport.x, 16),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor).rect(0,0,size.x, size.y)  
                })

                this.lineImg = createCanvas(new V2(1,1), (ctx, size, hlp) => { hlp.setFillColor('#94D3BD').dot(0,0) });
                this.lines1 = [];
                for(let i = 0; i < 15; i++){
                    let x = -45 + getRandomInt(-10, 10);
                    this.lines1[this.lines1.length] = 
                        this.addChild(new GO({
                            originX: x,
                            position: new V2(x, -7 + i),
                            size: new V2(90 + getRandomInt(-20, 20), 1),
                            img: this.lineImg,
                            change: easing.createProps(10, x, x+ getRandomInt(-5,5), 'quad', 'inOut')
                        }))
                }

                this.lines2 = [];
                for(let i = 0; i < 15; i++){
                    let x = -140 + getRandomInt(-10, 10);
                    this.lines2[this.lines2.length] = 
                        this.addChild(new GO({
                            originX: x,
                            position: new V2(x, -7 + i),
                            size: new V2(45 + getRandomInt(-10, 10), 1),
                            img: this.lineImg,
                            change: easing.createProps(getRandomInt(8,15), x, x+ getRandomInt(-5,5), 'quad', 'inOut')
                        }))
                }
                
                this.counter = 5;
                this.currentIndex = 0;
                this.timer = this.regTimerDefault(30, () => {
                    [...this.lines1, ...this.lines2].forEach(l => {
                        l.position.x = easing.process(l.change);
                        l.needRecalcRenderProperties = true;
                        l.change.time++;
                        if(l.change.time > l.change.duration){
                            l.change.startValue = l.position.x;
                            l.change.change*=-1;
                            l.change.time = 0;
                        }
                    })

                   
                })
            }
        }), 40)

        this.addGo(new GO({
            vegColor: '#0D3F3E',
            position: new V2(425, 275),
            size: new V2(150,50),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.vegColor).rect(0,0,size.x, size.y)  
                });

                let props =  [{p: new V2(-110, 30), radius: 30}, {p: new V2(-60, 15), radius: 50},
                    {p: new V2(-25, -15), radius: 20}, {p: new V2(15, -30), radius: 30}, {p: new V2(65, -50), radius: 60}]
                    props.forEach(prop => {
                        this.addChild(new GO({
                            position: prop.p,
                            size: new V2(1,1),
                            radius: prop.radius,
                            vegColor: this.vegColor,
                            init()  {
                                this.size = new V2(this.radius*2, this.radius*2)
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor(this.vegColor).circle(new V2(this.radius, this.radius), this.radius)
                                });
                            }
                            }));
                    })
            }
        }), 50)

        this.addGo(new GO({
            position: new V2(470, this.sceneCenter.y),
            size: new V2(50, this.viewport.y),
            img: createCanvas(new V2(50, this.viewport.y), (ctx, size, hlp) => {
                hlp.setFillColor('#1C5558').rect(0,0,10, size.y).rect(40,0,10, size.y)
            })
        }), 28)

        this.addGo(new GO({
            position: new V2(450, this.sceneCenter.y),
            size: new V2(50, this.viewport.y),
            img: createCanvas(new V2(50, this.viewport.y), (ctx, size, hlp) => {
                hlp.setFillColor('#518A61').rect(0,0,5, size.y).rect(40,0,5, size.y)
            })
        }), 18)

        this.addGo(new GO({
            position: new V2(120, this.sceneCenter.y),
            size: new V2(8, this.viewport.y),
            img: createCanvas(new V2(10, this.viewport.y), (ctx, size, hlp) => {
                hlp.setFillColor('#518A61').rect(0,0,10, size.y)
            })
        }), 18)

        this.addGo(new GO({
            position: new V2(145, this.sceneCenter.y),
            size: new V2(20, this.viewport.y),
            img: createCanvas(new V2(20, this.viewport.y), (ctx, size, hlp) => {
                hlp.setFillColor('#5DA251').rect(0,0,5, size.y).rect(15,0,5,size.y)
            })
        }), 8)
    }
}

class Waterfall2Layer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            tlCircleRadius: 12,
            cloudSizes: [3, 15],
            cloudStartYShift: 0,
            cloudLoopCount: 5,
            waterColor: '#79CBB2',
            fallColor: '#CBE3D7'
        }, options)

        super(options);
    }

    init() {
        let pikeHeight = this.pikeHeight || 30;
        this.pikes = this.addChild(new WaterfallPikes({
            size: new V2(this.size.x, pikeHeight),
            position: new V2(0, -this.size.y/2 + pikeHeight/2),
            pikeChangeDelay: this.pikeChangeDelay || [4,8],
            tlCircleRadius: this.tlCircleRadius,
            pikeUpperY: this.pikeUpperY || [13,15],
            pikeLowerY: this.pikeLowerY || [18, 20],
            pikeRandomHeight: this.pikeRandomHeight || 3,
            pikeRadius: this.pikeRadius || [4,7],
            waterColor: this.waterColor,
            fallColor: this.fallColor
        }));

        let fallHeight = this.size.y - pikeHeight;
        this.fall = this.addChild(new GO({
            size: new V2(this.size.x-1, fallHeight),
            position: new V2(0.5, this.pikes.position.y + pikeHeight/2 + fallHeight/2),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor(this.fallColor).dot(0,0);
            })
        }))

        let shadowHeight = this.shadowHeight || 30;
        this.shadow = this.addChild(new GO({
            position: new V2(0.5, this.size.y/2 - shadowHeight/2),
            size: new V2(this.size.x-1, shadowHeight),
            img: createCanvas(new V2(1,shadowHeight), (ctx, size, hlp) => {
                let opacityChange = easing.createProps(size.y, 0, 0.2, 'quad', 'out');
                for(let y = 0; y < size.y; y++){
                    opacityChange.time = y;
                    let opacity = easing.process(opacityChange);
                    opacity = (fast.c((opacity*100)/3)*3)/100
                    hlp.setFillColor(`rgba(0,0,0,${opacity})`).dot(0, y);
                }
            })
        }));

        
        this.cloudsImgCache = [];
        for(let i = 3; i < 15; i++){
            let size = new V2(i*2, i*2)
            let img = createCanvas(size, (ctx, size, hlp) => {
                hlp.setFillColor(this.fallColor).circle(new V2(i, i), i)
            })

            this.cloudsImgCache[i] = img;
        }
        this.timer = this.regTimerDefault(50, () => {
            if(this.showCloudsCountInDebug) {
                this.parentScene.debug.additional[3] = this.childrenGO.length;
            }

            for(let i = 0; i < this.cloudLoopCount; i++){
                let radius = getRandomInt(this.cloudSizes[0], this.cloudSizes[1])
                this.addChild(new Waterfall2Clouds({
                    position: new V2( -this.size.x/2 +  getRandomInt(5, this.size.x), this.size.y/2 + getRandomInt(-shadowHeight/4, shadowHeight/4) + this.cloudStartYShift),
                    radius: radius,
                    size: new V2(radius*2, radius*2),
                    speed: new V2(getRandom(-2, -0.5), getRandomInt(-2,-1)),
                    img: this.cloudsImgCache[radius],
                    setDeadPositionY: this.size.y*2/3
                }))
            }
        })
    }
}

class Waterfall2Clouds extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            radius: 15,
            color: '#CBE3D7',
            size: new V2(1,1),
            renderValuesRound: true,
            yDelta: 0.25,
        }, options)

        super(options);
    }

    init() {

        this.timer = this.regTimerDefault(30, () => {
            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
            this.speed.y += this.yDelta;
            this.needRecalcRenderProperties = true;

            if( this.position.y > this.setDeadPositionY){
                //console.log('cloud dead')
                this.setDead();
            }
        })
    }
}

class WaterfallPikes extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            xScale: 1,
            pikeChangeDelay: [5,10],
            pikeRandomHeight: 7,
            pikeRadius: [5,10],
            pikeUpperY: [30, 40],
            pikeLowerY: [45,55],
            tlCircleRadius: 30,
            waterColor: '#79CBB2',
            fallColor: '#CBE3D7'
        }, options)

        super(options);
    }

    init() {
        this.frames  =[];
        this.imgSize = new V2(this.size.x, this.size.y);
       
        this.originalShift = [];
        this.itemsWidths = [];
        let currentX = 0;
        let isUp = true;
        while (currentX < this.imgSize.x) {
            let radius = getRandomInt(this.pikeRadius[0], this.pikeRadius[1]);
            currentX = fast.r(currentX + radius)
            let y = isUp ? getRandomInt(this.pikeUpperY[0], this.pikeUpperY[1]) : getRandomInt(this.pikeLowerY[0], this.pikeLowerY[1]);
            let p = new V2(currentX, y);
            this.itemsWidths.push({
                radius,
                originPosition: p,
                position: p.clone(),
                isUp,
                change: easing.createProps(getRandomInt(this.pikeChangeDelay[0], this.pikeChangeDelay[1]), p.y, p.y + getRandomInt(-this.pikeRandomHeight, this.pikeRandomHeight), 'sin', 'inOut')
            });

            currentX = fast.r(currentX + radius -1);
            isUp = !isUp;
        }

        this.createImage();

        this.creatingFrames = true;
        this.counter = 100;
        this.timer = this.regTimerDefault(30, () => {
            if(this.counter-- > 0){
                this.itemsWidths.forEach((item) => {
                
                    item.position.y = fast.r(easing.process(item.change));
                    item.change.time++;
    
                    if (item.change.time > item.change.duration) {
                        if(!this.creatingFrames) {
                            if(!this.framesTimer){
                                console.log(`${this.id}: frames completed`)
                                this.unregTimer(this.timer);
                                this.currentFrame = 0;
                                this.framesTimer = this.regTimerDefault(30, () => {
                                    this.img = this.frames[this.currentFrame];
                                    this.currentFrame++
                                    if(this.currentFrame == this.frames.length){
                                        this.currentFrame = 0;
                                    }
                                })
                            }
                            
                            return;
                        }

                        let nextY = item.originPosition.y + getRandomInt(-this.pikeRandomHeight, this.pikeRandomHeight);
                        if(nextY > this.size.y){
                            nextY = this.size.y
                        }
    
                        item.change = easing.createProps(getRandomInt(this.pikeChangeDelay[0], this.pikeChangeDelay[1]), item.position.y, item.originPosition.y + getRandomInt(-this.pikeRandomHeight, this.pikeRandomHeight), 'sin', 'inOut');
                    }
                })

                this.createImage();
            }
            else {
                console.log(`${this.id}: counter is 0`)
                this.itemsWidths.forEach((item) => {
                    item.change = easing.createProps(this.pikeChangeDelay[0], item.position.y, item.originPosition.y , 'sin', 'inOut');
                    this.counter = 50;
                    this.creatingFrames = false;
                });
            }
            

            
        })
    }

    createImage() {

        if (!this.bg) {
            this.bg = createCanvas(this.imgSize, (ctx, size, hlp) => {

                hlp.setFillColor(this.waterColor)
                    .circle(new V2(this.tlCircleRadius, this.tlCircleRadius), this.tlCircleRadius)
                    .rect(this.tlCircleRadius, 1, size.x, size.y)
                    .rect(1, this.tlCircleRadius, size.x, size.y);
            });
        }

        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            ctx.drawImage(this.bg, 0, 0);
            ctx.globalCompositeOperation = 'source-atop';

            for (let i = 0; i < this.itemsWidths.length; i++) {
                let item = this.itemsWidths[i];

                hlp.setFillColor(this.fallColor)
                    .rect(item.position.x - item.radius+1, item.position.y, item.radius * 2 -1, size.y)
                    .setFillColor(item.isUp ? this.fallColor : this.waterColor)//
                    .circle(item.position, item.radius)
            }
            
            // ctx.fillStyle = 'black';
            // ctx.fillText(this.counter, size.x/2, size.y/2);
        });

        this.frames[this.frames.length] = this.img;
    }
}