class PeopleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true, 
            }
        }, options)

        super(options);
    }

    start() {
        this.yClamps = [-20, 20];

        this.roadSize = new V2(this.viewport.x, this.viewport.y);
        //

        this.sideWalkSize = new V2(this.viewport.x, this.yClamps[1] - this.yClamps[0] + 10);
        this.sideWalk = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.sideWalkSize,
            
            img: createCanvas(this.sideWalkSize, (ctx, size) => {
                ctx.fillStyle = '#BEBEBC';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.fillStyle = '#999999';
                ctx.fillRect(0, size.y- 1, size.x, 1);

                // ctx.fillStyle = '#A5A5A5';
                // ctx.fillRect(0, size.y- 3, size.x, 1);

                // ctx.fillStyle = '#7F7F7F';
                // for(let i = 0; i < 20; i++){
                //     // ctx.fillRect(i*size.x/20, size.y-2, 1,2);
                //     // ctx.fillRect(i*size.x/20 + 1, size.y-3, 1,1);
                //     ctx.fillRect(i*size.x/20, size.y-1, 1,1);
                // }

                ctx.fillStyle = '#BEBEBC';

                let alternateColors = [
                ];

                for(let i = -10; i < 5; i++){
                    if(i == 0)
                        continue;

                    alternateColors[alternateColors.length] = colors.changeHSV({initialValue: ctx.fillStyle, parameter: 'v', amount: i, isRgb: false});
                }

                for(let i = 0; i < 500; i++){
                    ctx.fillStyle = alternateColors[getRandomInt(0, alternateColors.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y-4), getRandomInt(1,3), 1);
                }

                let pp = new PerfectPixel({ context: ctx });
                ctx.fillStyle = '#757577';
                for(let i = 0; i < 80; i++){
                    pp.lineV2(new V2(170+ i, 0), new V2(140 + i, size.y))
                }

                ctx.fillStyle = '#DBDBDB';

                let counterMax = 4;
                let counter = counterMax;
                let drawZebra = true;
                for(let i = 0; i < 60; i++){
                    if(drawZebra)
                        pp.lineV2(new V2(174+ i, 10), new V2(156 + i, size.y-10));

                    counter--;
                    if(counter == 0){
                        counter = counterMax;
                        drawZebra = !drawZebra;
                    }
                }

                ctx.fillStyle = '#A5A5A4';
                pp.lineV2(new V2(169, 0), new V2(139, size.y))
                pp.lineV2(new V2(169, 1), new V2(140, size.y-1))
            })
        }), 1);

        this.topLeftBuildingSize = new V2(250, 130);
        this.topLeftBuilding = this.addGo(new GO({
            position: new V2(122, 160),
            size: this.topLeftBuildingSize,
            renderValuesRound: true,
            init() {
                this.base = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    renderValuesRound: true,
                    img: createCanvas(this.size, (ctx, size) => {
                        ctx.fillStyle = 'red';
                        let shift = 77;
                        let pp = new PerfectPixel({ context: ctx });
                        for(let i = shift; i < size.x; i++){
                            if(i % 10== 0)
                                ctx.fillStyle = 'green';
                            else 
                                ctx.fillStyle = 'red';
                            pp.lineV2(new V2(i, 0), new V2(i-shift, size.y));
                        }
        
                        let hLinesCount = 20;
                        ctx.fillStyle = 'green';
                        let startXEquation = (y) => ( ((130-y)*77)/130 );
                        let endXEquation = (y) => ( (((32500/77)-y)*77)/130 );
        
                        for(let i = 0; i < hLinesCount; i ++){
                            let y = i*size.y/hLinesCount;
                            pp.lineV2(new V2(startXEquation(y), y), new V2(endXEquation(y), y));
                        }
                    })
                }));

                this.buildingSize = new V2(192,250);
                this.building = this.addChild(new GO({
                    position: new V2(2,-72),
                    size: this.buildingSize,
                    renderValuesRound: true,
                    img: createCanvas(this.buildingSize, (ctx, size) => {
                        let frontWidth = 130;
                        
                        ctx.fillStyle = 'blue';
                        ctx.fillRect(0,0, frontWidth, size.y);

                        let pp = new PerfectPixel({ context: ctx });
                        ctx.fillStyle = 'lightblue';
                        let shift = 105;
                        for(let i = - shift; i < size.y - shift ; i++){
                            pp.lineV2(new V2(frontWidth , i + shift), new V2(size.x, i));
                        }
                        //ctx.fillRect(frontWidth,0, size.x - frontWidth, size.y);
                    }),
                    init() {
                        this.entranceSize = new V2(20, 20);
                        this.entrance = this.addChild(new GO({
                            position: new V2(-31,115),
                            size: this.entranceSize,
                            renderValuesRound: true,
                            img: createCanvas(this.entranceSize, (ctx, size) => {
                                ctx.fillStyle = 'green';
                                ctx.fillRect(0,0, size.x, size.y)
                            })
                        }));

                        this.frontalLargeWindowSize = new V2(50, 15);
                        this.frontalSmallWindowSize = new V2(10, 10);
                        this.frontalLargeWindows = [new V2(-71, 113), new V2(9, 113)].forEach(p => (this.addChild(new Go({
                            position: p,
                            size: this.frontalLargeWindowSize,
                            img: createCanvas(this.frontalLargeWindowSize, (ctx, size) => {
                                ctx.fillStyle = 'green';
                                ctx.fillRect(0,0, size.x, size.y)
                            })
                        }))))

                        let startX = -80;
                        let xCount = 6;
                        let yCount = 10;
                        let xStep = 20;
                        let yStep = 20;
                        let currentY = 90;
                        let currentX = startX;
                        this.frontalSmallWindows = [];

                        for(let y = 0; y < yCount; y++){
                            currentX = startX;
                            for(let x = 0; x < xCount; x++){
                                this.frontalSmallWindows.push(this.addChild(new Go({
                                    position: new V2(currentX, currentY),
                                    size: this.frontalSmallWindowSize,
                                    img: createCanvas(this.frontalSmallWindowSize, (ctx, size) => {
                                        ctx.fillStyle = 'green';
                                        ctx.fillRect(0,0, size.x, size.y)
                                    })
                                })))

                                currentX+=xStep;
                            }

                            currentY-=yStep;
                        }

                        this.sideLargeWindowSize = new V2(62, 115);
                        let sideLargeWindow = this.addChild(new GO({
                            position: new V2(65, 63),
                            size: this.sideLargeWindowSize,
                            img: createCanvas(this.sideLargeWindowSize, (ctx, size) => {
                                ctx.fillStyle = 'green';
                                let h = 15;
                                let hChange = {
                                    time: 0, duration: size.x,startValue: h, change: -5, type: 'linear', method: 'base', 
                                }

                                let xEquation = (x) => (-50/31)*x+100;
                                let pp = new PerfectPixel({ context: ctx });
                                for(let i = 0; i < size.x; i++){
                                    hChange.time = i;
                                    let _h = fastRoundWithPrecision(easing.process(hChange));
                                    ctx.fillRect(i, xEquation(i), 1, _h);
                                }
                            })
                        }))

                    }
                }));
            }
        }),1)

        this.registerTimer(createTimer(250, () => {
            this.peopleGenerator();
        }, this, true))
    }

    peopleGenerator() {
        
        let yShift = getRandomInt(this.yClamps[0], this.yClamps[1]);
        let isLeft = getRandomBool();
        this.addGo(new PixelMan({
            position: new V2(isLeft ? -10 : this.viewport.x + 10, yShift + this.sceneCenter.y),
            xDestination:  isLeft ? this.viewport.x + 10 : -10,
            moveMaxMultiplier: getRandom(1,5),
            bounceMaxDivider: getRandom(4,10),
            moveDirection: isLeft ? 1: -1,
        }), yShift - this.yClamps[0] + 10);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#757577');
    }
}

class PixelMan extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(2,6),
            renderValuesRound: true,
            xDestination: 300,
            bounceMaxDivider: 4,
            moveMaxMultiplier: 1,
            value: 1,
            moveDirection: 1,
        }, options)

        super(options);
    }

    // destinationCompleteCheck(){
    //     return Math.abs(this.position.x-this.originX) > 50
    // }

    // destinationCompleteCallBack() {
    //     this.originX = this.position.x;
    //     this.mDirection*=-1;
    //     this.setDestination(new V2((this.mDirection > 0 ? 1:-1)*50 ,0), true);
    // }

    init() {
        this.bounceStepDuration = 10;
        this.bounceMax = this.size.y/this.bounceMaxDivider;
        this.moveMax = this.size.x*this.moveMaxMultiplier;

        this.shadowSize = new V2(3,1);

        this.shadow = this.addChild(new GO({
            renderValuesRound: true,
            size: this.shadowSize,
            position: new V2(-1.5, this.size.y/2 -0.5),
            img: createCanvas(new V2(1,1), (ctx, size) => {
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(0,0,size.x, size.y);
            })
        }));

        this.man = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(0,0),
            size: this.size
        }));

        this.bounce = { 
            time: 0, duration: this.bounceStepDuration,startValue: this.man.position.y, change: -this.bounceMax, max: this.bounceMax, direction: -1, 
            type: 'sin', method: 'out', 
        };

        this.move = {
            time: 0, duration: this.bounceStepDuration*2,startValue: this.position.x, change: this.moveMax*this.moveDirection, max: this.moveMax, direction: this.moveDirection, 
            type: 'linear', method: 'base', 
        }

        this.shadow.originX = this.shadow.position.x;

        

        this.topColor = hsvToHex({hsv:[getRandomInt(0,360), 77,77]})//'#C6752F';
        this.skinColor = '#ED9B79';
        this.lowerColor = hsvToHex({hsv:[getRandomInt(0,360), 56,56]})//'#7E9641';

        this.imgLeft = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        this.imgRight = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        
        this.choseImg();
        //this.setDestination(new V2(50, 0), true);

        this.startBounce();
    }

    choseImg() {
        this.man.img = this.move.direction > 0 ? this.imgRight : this.imgLeft;
    }

    startBounce() {
        this.bounceTimer = this.registerTimer(createTimer(20, () => {
            let b = this.bounce;
            let m = this.move;
            let y = easing.process(b);
            
            this.man.position.y = y;
            this.shadow.position.x = this.shadow.originX + y*1;
            this.position.x = easing.process(m);

            this.needRecalcRenderProperties = true;

            b.time++;
            m.time++;
            if(b.time > b.duration){
                b.direction*=-1;

                b.time = 0;
                b.startValue = this.man.position.y;
                b.change = (b.direction > 0 ? 1 : -1) * b.max;
                b.method =this.direction > 0 ? 'in' : 'out'

                if(b.direction < 0){
                    m.time = 0;
                    m.startValue = this.position.x;

                    // if(Math.abs(this.position.x-this.originX) > 50){
                    //     this.originX = this.position.x;
                    //     //this.mDirection*=-1;
                    //     m.direction*=-1;
                    //     m.change = m.direction*m.max;
                    //     this.choseImg();
                    // }

                    if((m.direction > 0 && this.position.x > this.xDestination) || (m.direction < 0 && this.position.x < this.xDestination)){
                        this.setDead();
                    }
                }
            }
            // else {
            //     this.position.x += this.speed*this.mDirection;
            // }

        }, this, true));
    }

    stopBounce() {
        this.unregTimer(this.bounceTimer);
    }
}