class BottlesScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {}, options);

        super(options);

        this.bgImg = textureGenerator.textureGenerator({
            size: this.viewport,
            backgroundColor: '#BACEE9',
            surfaces: [
                textureGenerator.getSurfaceProperties({
                    colors: ['#034B7B', '#E9F4FA'], opacity: [0.75],  type: 'line', line: { length: [2,8], directionAngle: 90, angleSpread: 0 }, density: 0.0005
                }),
            ]
        });

        this.lineStop = false;
    }

    backgroundRender(){
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height);
        //this.backgroundRenderDefault();
    }

    start() {
        this.bottleOriginalSize = new V2(10, 28);
        this.bottleImg = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#1E5F4C';
            ctx.fillRect(3,3,4,25);
            ctx.fillRect(2,10,6,18);
            ctx.fillRect(1,11,8,17);
            ctx.fillRect(0,13,10,14);
            ctx.fillStyle = '#1C5948';
            ctx.fillRect(2,2,6,1);
        });

        this.bottleContentImg = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#363140';
            ctx.fillRect(2,13,7,13);
        });

        this.streamImg = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#363140';
            ctx.fillRect(4,2,2,24);
        });

        this.backImgRight = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(3,3,1,9);ctx.fillRect(2,11,2,1);ctx.fillRect(2,11,1,2);ctx.fillRect(1,13,2,1);ctx.fillRect(1,13,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(8,19,1,8);
        });

        this.backImgCenter = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(1,19,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(8,19,1,8);
        });

        this.backImgLeft = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = '#114A48';
            ctx.fillRect(3,3,4,1); ctx.fillRect(6,3,1,9);ctx.fillRect(6,11,2,1);ctx.fillRect(7,11,1,2);ctx.fillRect(7,13,2,1);ctx.fillRect(8,13,1,14);ctx.fillRect(1,26,8,1);ctx.fillRect(1,19,1,8);
        });

        this.reflectionImgRight = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(6,2,1,1);ctx.fillRect(6,5,1,5);ctx.fillRect(6,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(7,12,1,14);
        });

        this.reflectionImgCenter = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(5,2,1,1);ctx.fillRect(5,5,1,5);ctx.fillRect(5,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(5,12,1,14);
        });

        this.reflectionImgLeft = createCanvas(this.bottleOriginalSize, (ctx, size) => {
            ctx.fillStyle = 'rgba(95,146,91,0.5)';
            ctx.fillRect(4,2,1,1);ctx.fillRect(4,5,1,5);ctx.fillRect(4,11,1,1);
            ctx.fillStyle = 'rgba(108,177,103,0.5)';ctx.fillRect(3,12,1,14);
        });

        this.roundItemFramesCount = 24;
        this.roundItemSize =new V2(20, 20).mul(2); 
        this.roundItemImg = createCanvas(new V2(this.roundItemSize.x*this.roundItemFramesCount, this.roundItemSize.y), (ctx, size) => {
            let angleStep = 360 / this.roundItemFramesCount;
            let point = new V2(0, 0 - this.roundItemSize.y*3/10);
            let initAngles = [0, 90, 180, 270];
            for(let i = 0; i < this.roundItemFramesCount; i++){
                let centerX = this.roundItemSize.x*i + this.roundItemSize.x/2;
                ctx.fillStyle = '#014D87';ctx.strokeStyle = '#001132';
                ctx.beginPath();ctx.arc(centerX, size.y/2, this.roundItemSize.x/2.1 , 0, Math.PI*2, false);
                ctx.fill();ctx.lineWidth = 2; ctx.stroke();
                ctx.fillStyle = '#001132';
                ctx.beginPath();ctx.arc(centerX, size.y/2, this.roundItemSize.x/5, 0, Math.PI*2, false);
                ctx.fill();
                ctx.strokeStyle = '#B8CDEC';
                ctx.beginPath();ctx.arc(centerX, size.y/2, size.y/3, degreeToRadians(i*angleStep),  degreeToRadians(i*angleStep+angleStep));ctx.stroke();
                ctx.beginPath();ctx.arc(centerX, size.y/2, size.y/3, degreeToRadians(i*angleStep + 180),  degreeToRadians(i*angleStep+angleStep + 180));ctx.stroke();
            }
        })

        // for(let i = 0; i < this.viewport.x/this.bottleOriginalSize.x; i++){
        //     let bottle = this.createBottle(this.bottleOriginalSize.x*1.1*i);
        //     bottle.nextCreated = i != 0;
        // }

        this.createBottle(-this.bottleOriginalSize.x/0.95);
        
        let that = this;
        var points = [];
        for(let i = 0; i < 6; i++){
         points.push(new V2(this.viewport.x*i/5, this.viewport.y/2));
        }

        points.forEach(p => 
            {
                let lineSize = new V2(this.viewport.x/5, 5);
                let obj = this.addGo(new GO({
                    position: p,
                    size: new V2(lineSize.x, 20)
                }));

                obj.addChild(new GO({
                    position: new V2(0,-3),
                    size: new V2(obj.size.x, 6),
                    img: createCanvas(new V2(1,3), (ctx, size) => {
                        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,1,1);
                        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0,1,1,1);
                        ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,2,1,1);
                    })
                }))

                obj.addChild(new GO({
                    position: new V2(),//p,
                    size: new V2(20, 20),
                    img: this.roundItemImg,
                    isAnimated: true,
                    animation: {
                        totalFrameCount: this.roundItemFramesCount,
                        framesInRow: this.roundItemFramesCount,
                        framesRowsCount: 1,
                        frameChangeDelay: 100,
                        destinationFrameSize:new V2(20, 20),
                        sourceFrameSize: this.roundItemSize,
                        loop: true
                    },
                    internalUpdate(now){
                        this.animation.paused = this.parent.parentScene.lineStop;
                        
                    }
                }));

                obj.addChild(new GO({
                    size: lineSize,
                    position: new V2(0, -that.roundItemSize.y/5),
                    img: createCanvas(lineSize, (ctx, size) => {
                        ctx.fillStyle = '#4085C8'; ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = '#4B9DEA'; ctx.fillRect(0,0, size.x, 1);
                        ctx.fillStyle = '#356FA5';
                        ctx.fillRect(0,0,1, size.y);

                        ctx.fillStyle = '#001845';
                        ctx.fillRect(size.x/2, size.y/2, 1,1);
                        ctx.fillStyle = '#9FBFE6';
                        ctx.fillRect(size.x/2 - 1, size.y/2, 1,1);
                    })
                }))
            });

        this.distanceBetweenLamps = this.viewport.x/3;
        this.lampsPosX = [0, this.viewport.x/3, this.viewport.x*2/3, this.viewport.x];

        // this.bottlesGeneratorTimer = createTimer(725, ()=> {
        //     if(this.lineStop)
        //         return;

        //     this.createBottle(-this.bottleOriginalSize.x/0.95, this.viewport.y/2-this.bottleOriginalSize.y*6/7)
        // }, this, true);

        //this.lineStopTimer = createTimer(2000, () => this.lineStop = !this.lineStop, this, false);

        this.pourer = this.addGo(new GO({
            position: new V2(100.5, this.viewport.y/4 - 6),
            size: new V2(30, 90),
            fillBottle() {
                this.container.decrease();
                this.createBubbles();
            },
            stopBubble() {
                this.bubblesTimer = undefined;
            },
            createBubbles(){
                this.bubblesTimer = createTimer(75, () => {                    
                    let x = getRandom(-3,3);
                    this.addChild(new MovingGO({
                        position: new V2(x, 12),
                        size: new V2(1,1),
                        img: createCanvas(new V2(1,1), (ctx, size) => {
                            ctx.fillStyle = '#786F8E'; ctx.fillRect(0,0, size.x, size.y);
                        }),
                        speed: getRandom(0.25, 0.45),
                        destination: new V2(x, -10),
                        setDestinationOnInit: true,
                        setDeadOnDestinationComplete: true,
                        destinationCompleteCheck() {
                            if(this.position.y < -this.parent.size.y/2)
                                return true;

                            //return false;
                            let cont = this.parent.container;
                            return this.position.y < cont.position.y - cont.size.y/2;
                        }
                    }));
                })
            },
            internalUpdate(now){
                if(this.bubblesTimer)
                    doWorkByTimer(this.bubblesTimer, now);
            }
        }));

        this.pourer.addChild(new GO({ // body
            position: new V2(),
            size: this.pourer.size,
            img: createCanvas(new V2(10, 30), (ctx,size) => {
                ctx.fillStyle = '#3570A8';ctx.fillRect(0,0, 1, 19);
                ctx.fillStyle = '#4CA0EF'; ctx.fillRect(1,0, 8, 19);
                ctx.fillStyle = '#4796E0';ctx.fillRect(9,0, 1, 19);ctx.fillRect(8,0, 2, 1);
                
                ctx.fillStyle = '#4085C8'; ctx.fillRect(2,0, 6,1);
                ctx.fillStyle = '#3570A8';ctx.fillRect(0,19, 2, 3);ctx.fillRect(0,0, 2, 1);
                ctx.fillStyle = '#4085C8';ctx.fillRect(2,19, 6, 3);ctx.fillRect(4,22, 2, 5);
                ctx.fillStyle = '#4796E0';ctx.fillRect(8,19, 2, 3);
                ctx.fillStyle = '#3570A8';ctx.fillRect(3,22, 1, 6);ctx.fillRect(3,27, 2, 1);ctx.fillRect(4,28, 1, 2);
                ctx.fillStyle = '#4796E0';ctx.fillRect(6,22, 1, 6);ctx.fillRect(5,27, 2, 1);ctx.fillRect(5,28, 1, 2);
            })
        }))

        this.pourer.container = this.pourer.addChild(new GO({
            changeTime: 1500,
            position: new V2(0, -15),
            size: new V2(24,54),
            img: createCanvas(new V2(1,1), (ctx,size) => {
                ctx.fillStyle = '#363140'; ctx.fillRect(0,0,size.x, size.y);
            }),
            init() {
                this.fullSize = this.size.clone();
                this.fullPosition = this.position.clone();
                this.changeSizeDelta = this.fullSize.y/10;
                this.changePositionDelta = this.changeSizeDelta/2;
            },
            decrease() {
                if(this.parent.indicators.state.needRefill)
                    return;

                if(this.size.y <= this.changeSizeDelta)
                    return;

                if(this.size.y <= this.fullSize.y/2){
                    this.parent.indicators.toggleNeedRefill(true);
                    this.increase();
                    return;
                }

                this.parent.indicators.togglefillBottle(true);
                this.smoothChangeProps = {
                    currentSize: this.size.y,
                    currentPosition: this.position.y,
                    targetSize: this.size.y-this.changeSizeDelta,
                    targetPosition: this.position.y+this.changePositionDelta,
                    stepSize: this.changeSizeDelta/(this.changeTime/50),
                    stepPosition: this.changePositionDelta/(this.changeTime/50),
                    sizeDirection: -1,
                    positionDirection: 1
                }
                this.smoothChangeTimer = createTimer(50, this.smoothChange, this, true);
            },
            increase() {
                this.smoothChangeProps = {
                    currentSize: this.size.y,
                    currentPosition: this.position.y,
                    targetSize: this.fullSize.y,
                    targetPosition: this.fullPosition.y,
                    stepSize: (this.fullSize.y - this.size.y)/(this.changeTime/50),
                    stepPosition: ((this.fullSize.y - this.size.y)/2)/(this.changeTime/50),
                    sizeDirection: 1,
                    positionDirection: -1
                }
                this.smoothChangeTimer = createTimer(50, this.smoothChange, this, true);
                this.parent.communications.toggleShaking(true);
            },

            smoothChange() {
                let p = this.smoothChangeProps;
                this.size.y+=p.sizeDirection*p.stepSize;
                this.position.y+=p.positionDirection*p.stepPosition;
                if((p.sizeDirection == -1 && this.size.y <= p.targetSize) || (p.sizeDirection == 1 && this.size.y >= p.targetSize)){
                    this.size.y = p.targetSize;
                    this.position.y = p.targetPosition;
                    this.smoothChangeTimer = undefined;

                    if(p.sizeDirection == -1){
                        this.parent.indicators.togglefillBottle(false);
                        this.parent.stopBubble();
                    }

                    if(p.sizeDirection == 1){
                        this.parent.stopBubble();
                        this.parent.indicators.toggleNeedRefill(false);
                        this.parent.communications.toggleShaking(false);
                    }
                }

                this.parent.needRecalcRenderProperties = true;
            },

            internalUpdate(now){
                if(this.timer)
                    doWorkByTimer(this.timer, now);

                if(this.smoothChangeTimer)
                    doWorkByTimer(this.smoothChangeTimer, now)
            }
        }));

        //reflections
        this.pourer.addChild(new GO({
            position: new V2(),
            size: this.pourer.size,
            img: createCanvas(new V2(10, 30), (ctx, size)=> {
                ctx.fillStyle = 'rgba(71,150,224,0.75)';ctx.fillRect(8,0,0.25,19);
                ctx.fillStyle = 'rgba(53,112,168,0.75)';ctx.fillRect(1,0,0.25,19);
            })
        }));

        //shadows
        this.pourer.addChild(new GO({
            position: new V2(0,1.5),
            size: new V2(this.pourer.size.x, this.pourer.size.y+3),//this.pourer.size,
            img: createCanvas(new V2(this.pourer.size.x, this.pourer.size.y+3), (ctx, size)=> {
                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,66,9,2);ctx.fillRect(9,66,12,1);ctx.fillRect(21,66,9,2);
                ctx.fillRect(9,84,3,1);ctx.fillRect(12,90,6,1);ctx.fillRect(18,84,3,1);
                ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0,68,9,2);ctx.fillRect(9,67,12,1);ctx.fillRect(21,68,9,2);
                ctx.fillRect(9,85,3,1);ctx.fillRect(12,91,6,1);ctx.fillRect(18,85,3,1);
                ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,70,9,2);ctx.fillRect(9,68,12,1);ctx.fillRect(21,70,9,2);
                ctx.fillRect(9,86,3,1);ctx.fillRect(12,92,6,1);ctx.fillRect(18,86,3,1);
            })
        }));

        this.pourer.indicators = this.pourer.addChild(new GO({
            position: new V2(5, 17),
            size: new V2(9,3),
            state: {
                power: true,
                fillingBottle: false,
                needRefill: false
            },
            togglefillBottle(enable) {
                this.state.fillingBottle = enable;
                this.fillingBottle.img = enable ? this.workImg : this.idleImg;
            },
            togglePower() {
                this.state.power = !this.state.power;
                this.power.img = this.state.power ? this.okImg : this.idleImg;
            },
            toggleNeedRefill(enable) {
                this.state.needRefill = enable;
                this.needRefill.img = enable ? this.warnImg : this.idleImg;
            },
            init() {
                this.ledWidth = this.size.x/3;
                this.idleImg = createCanvas(new V2(1,2), (ctx, size) => {
                    ctx.fillStyle = '#D3D3D3';ctx.fillRect(0,0, size.x, size.y);
                    ctx.fillStyle = '#A5A5A5';ctx.fillRect(0,1, size.x, 1);
                })
                this.okImg = createCanvas(new V2(1,2), (ctx, size) => {
                    ctx.fillStyle = '#43CC53';ctx.fillRect(0,0, size.x, size.y);
                    ctx.fillStyle = '#35A342';ctx.fillRect(0,1, size.x, 1);
                })
                this.workImg= createCanvas(new V2(1,2), (ctx, size) => {
                    ctx.fillStyle = '#5763CC';ctx.fillRect(0,0, size.x, size.y);
                    ctx.fillStyle = '#3544CC';ctx.fillRect(0,1, size.x, 1);
                });
                this.warnImg= createCanvas(new V2(1,2), (ctx, size) => {
                    ctx.fillStyle = '#E02B28';ctx.fillRect(0,0, size.x, size.y);
                    ctx.fillStyle = '#B52320';ctx.fillRect(0,1, size.x, 1);
                });
                
                this.power = this.addChild(new GO({
                    size: new V2(this.ledWidth, this.size.y),
                    position: new V2(-this.size.x/2 + this.ledWidth/2, 0),
                    img: this.okImg
                }));
                this.fillingBottle = this.addChild(new GO({
                 size: new V2(this.ledWidth, this.size.y),
                     position: new V2(-this.size.x/2 + this.ledWidth, 0),
                     img: this.idleImg
                 }));
                 this.needRefill = this.addChild(new GO({
                     size: new V2(this.ledWidth, this.size.y),
                     position: new V2(-this.size.x/2 + this.ledWidth*3/2, 0),
                     img: this.idleImg
                 }));

                 this.togglePowerLedTimer = createTimer(500, this.togglePower, this, true);
            },
            internalUpdate(now){
                if(this.togglePowerLedTimer)
                    doWorkByTimer(this.togglePowerLedTimer, now);
            }
         }));

         this.pourer.communications = this.pourer.addChild(new GO({
            shaking: false,
            position: new V2(this.pourer.size.x/2 + 15, -25),
            size: new V2(30, this.pourer.size.y+10),
            img: createCanvas(new V2(30, this.pourer.size.y+10), (ctx, size) => { 
                ctx.fillStyle = '#4085C8';
                ctx.fillRect(5,0,5, 88);ctx.fillRect(0,88,10, 5);
                ctx.fillStyle = '#4796E0';
                ctx.fillRect(8,0,1, 91);ctx.fillRect(0,89,6, 1);
                ctx.fillStyle = '#3570A8';
                ctx.fillRect(6,0,1, 90);ctx.fillRect(0,91,8, 1);
                ctx.clearRect(9,92, 1,1)

                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,93,9, 1);
                ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0,94,9,1);
                ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,95,9,2);

                ctx.fillStyle = '#4085C8';
                ctx.fillRect(0,87,3, 7);
                ctx.fillStyle = '#4796E0';
                ctx.fillRect(0,88,3, 1);
                ctx.fillStyle = '#3570A8';
                ctx.fillRect(0,92,3, 1);
             }),
             toggleShaking(enabled) {
                this.shaking = enabled;
                if(!this.shaking){
                    this.size.x = this.originSize.x;
                    this.size.y = this.originSize.y;
                    this.needRecalcRenderProperties = true;
                    this.shakingTimer = undefined;
                }
                else {
                    this.shakingTimer = createTimer(50, () => { 
                        if(getRandomBool()){
                           this.size.x = this.originSize.x + 0.5;
                           this.size.y = this.originSize.y + 0.5;
                        }
                        else {
                           this.size.x = this.originSize.x;
                           this.size.y = this.originSize.y;
                        }
   
                        this.needRecalcRenderProperties = true;
                     }, this, true);
                }
             },
             init() {
                 this.originSize = this.size.clone();
             },
             internalUpdate(now){
                 if(this.shaking && this.shakingTimer)
                    doWorkByTimer(this.shakingTimer, now);
             }
         }));
    }

    // bottle creation method //////////////////////////////////////////////////////
    createBottle(posX) {
        let posY = this.viewport.y/2-this.bottleOriginalSize.y*6/7;
        return this.addGo(new Bottle({
            position: new V2(posX, posY),
            size: this.bottleOriginalSize,//.mul(5),
            bottleImg: this.bottleImg,
            reflectionImages: {
                left: this.reflectionImgLeft,
                center: this.reflectionImgCenter,
                right: this.reflectionImgRight
            },
            backImages: { 
                left: this.backImgLeft,
                center: this.backImgCenter,
                right: this.backImgRight
            },
            bottleContentImg: this.bottleContentImg,
            streamImg: this.streamImg,
            setDestinationOnInit: true,
            destination: new V2(this.viewport.x+ 100,posY)
        }),2);
    }

    afterMainWork(now){
        if(this.bottlesGeneratorTimer){
            doWorkByTimer(this.bottlesGeneratorTimer, now);
        }

        if(this.lineStopTimer)
            doWorkByTimer(this.lineStopTimer, now);

        if(this.lineStartTimer)
            doWorkByTimer(this.lineStartTimer, now);
    }
}

////////////////////////////////////////////////// bottle class //////////////////////////////////////////
class Bottle extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            speed: 0.25,//0.255,
            nextCreated: false,
            lineStopped: false,
        }, options);

        super(options);

        this.body = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.bottleImg,
            renderValuesRound: true
        }));

        this.back = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.backImages.right,
            renderValuesRound: true
        }));

        this.contentStream = this.addChild(new GO({
            position: new V2(0,0),
            size: this.size.clone(),
            img: this.streamImg,
            isVisible: false
        }))
        
        this.container = this.addChild(new GO({
            smoothChangeProps: {
                currentSize: this.size.y,
                currentPosition: this.position.y,
                targetSize: this.size.y,
                targetPosition: 0,
                stepSize: (this.size.y)/(1500/50),
                stepPosition: ((12))/(1500/50),
                sizeDirection: 1,
                positionDirection: -1
            },
            position: new V2(0,11.5),
            size: new V2(this.size.x, 1),
            img: this.bottleContentImg,
            renderValuesRound: true,
            isVisible: false,
            smoothChange() {
                let p = this.smoothChangeProps;
                this.size.y+=p.sizeDirection*p.stepSize;
                this.position.y+=p.positionDirection*p.stepPosition;
                
                this.createBubbles()

                if((p.sizeDirection == -1 && this.size.y <= p.targetSize) || (p.sizeDirection == 1 && this.size.y >= p.targetSize)){
                    this.size.y = p.targetSize;
                    this.position.y = p.targetPosition;
                    this.smoothChangeTimer = undefined;
                    this.renderValuesRound = true;
                    this.parent.contentStream.isVisible = false;

                    this.bubbleGeneratorTimer = createTimer(1000, () => this.createBubbles(true), this, false);
                }

                this.parent.needRecalcRenderProperties = true;
            },
            createBubbles(single) {
                if(single){
                    let x = getRandomInt(-3,3);
                    this.addChild(new MovingGO({
                        position: new V2(x, 12),
                        size: new V2(1,1),
                        img: createCanvas(new V2(1,1), (ctx, size) => {
                            ctx.fillStyle = '#786F8E'; ctx.fillRect(0,0, size.x, size.y);
                        }),
                        setDeadOnDestinationComplete: true,
                        setDestinationOnInit: true,
                        destination: new V2(x, 0),
                        speed: 0.1
                    }));
                }
                else 
                    this.parent.addChild(new GO({
                        position: new V2(getRandom(-1,1), this.position.y),
                        size: new V2(1,1),
                        img: createCanvas(new V2(1,1), (ctx, size) => {
                            ctx.fillStyle = '#786F8E'; ctx.fillRect(0,0, size.x, size.y);
                        }),
                        init(){
                            this.addEffect(new FadeOutEffect({effectTime: 1000, updateDelay: 50,setParentDeadOnComplete: true,initOnAdd:true}))
                        },
                    }));
            },
            internalUpdate(now){
                if(this.smoothChangeTimer)
                    doWorkByTimer(this.smoothChangeTimer, now)

                if(this.bubbleGeneratorTimer)
                    doWorkByTimer(this.bubbleGeneratorTimer, now);
            },
            fill() {
                this.isVisible = true;
                this.parent.contentStream.isVisible = true;
                this.renderValuesRound = false;
                this.smoothChangeTimer = createTimer(50, this.smoothChange, this, true);
            }
        }));

        this.reflection = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.reflectionImages.right,
            renderValuesRound: true
        }));

        this.originY = this.position.y;
    }

    destinationCompleteCheck() {
        if(!this.nextCreated && this.position.x >= this.size.x*2){
            this.parentScene.createBottle(-this.parentScene.bottleOriginalSize.x/0.95);
            this.nextCreated = true;
        }

        if(!this.lineStopped && this.position.x >= 100){
            this.parentScene.lineStop = true;
            this.parentScene.lineStartTimer = createTimer(2000, function(){ this.lineStop = false; }, this.parentScene, false)
            this.lineStopped = true;

            this.fillDelayTimer = createTimer(200, () => {
                this.parentScene.pourer.fillBottle();
                this.container.fill();
                this.fillDelayTimer = undefined;
            }, this, false)
            
        }

        if(this.parentScene.lineStop){
            this.position.add(this.direction.mul(-this.speed), true)
        }

        if(this.position.x - this.size.x/2 > this.parentScene.viewport.x){
            this.setDead();
        }
    }

    internalUpdate(now){
        if(this.fillDelayTimer)
            doWorkByTimer(this.fillDelayTimer, now);
    }
}
