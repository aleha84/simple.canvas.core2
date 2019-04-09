class BottlesScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options);

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

        this.corkImg = PP.createImage({
            "general": {
                "originalSize": {
                    "x": 4,
                    "y": 2
                },
                "size": {
                    "x": 4,
                    "y": 2
                },
                "zoom": 10,
                "showGrid": false
            },
            "main": {
                "layers": [
                    {
                        "order": 0,
                        "selected": false,
                        "type": "lines",
                        "strokeColor": "#DB965D",
                        "fillColor": "#DB965D",
                        "closePath": false,
                        "fill": false,
                        "points": [
                            {
                                "point": {
                                    "x": 0,
                                    "y": 0
                                }
                            },
                            {
                                "point": {
                                    "x": 2,
                                    "y": 0
                                }
                            },
                            {
                                "point": {
                                    "x": 2,
                                    "y": 1
                                }
                            },
                            {
                                "point": {
                                    "x": 0,
                                    "y": 1
                                }
                            }
                        ]
                    },
                    {
                        "order": 1,
                        "selected": false,
                        "type": "dots",
                        "strokeColor": "#E09E67",
                        "fillColor": "#E09E67",
                        "closePath": false,
                        "fill": false,
                        "points": [
                            {
                                "point": {
                                    "x": 3,
                                    "y": 0
                                }
                            },
                            {
                                "point": {
                                    "x": 3,
                                    "y": 1
                                }
                            }
                        ]
                    }
                ]
            }
        })

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

        this.corker = this.addGo(new GO({
            position: new V2(181.5, this.viewport.y/4 ),
            size: new V2(60, 90),
            plugCork(bottle) {
                if(this.isPlugging)
                    return;

                this.indicators.togglePlugging(true);
                this.isPlugging = true;
                this.bottle = bottle;
                this.outputLine.takeOutCork();
            },
            init() {
                let bodyModel = {
                    "general": {
                        "originalSize": {
                            "x": 10,
                            "y": 30
                        },
                        "size": {
                            "x": 10,
                            "y": 30
                        },
                        "zoom": 8,
                        "showGrid": true
                    },
                    "main": {
                        "layers": [
                            {
                                "order": 0,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4085C8",
                                "fillColor": "#4085C8",
                                "closePath": true,
                                "fill": true,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 4
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 4
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 1,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4B9DEA",
                                "fillColor": "#4085C8",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 4
                                        },
                                        "selected": true
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 8,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 8,
                                            "y": 4
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 2,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 4
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 23
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 4
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 3,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4085C8",
                                "fillColor": "#4085C8",
                                "closePath": true,
                                "fill": true,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 18
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 18
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 20
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 20
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 4,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#234e78",
                                "fillColor": "#234e78",
                                "closePath": true,
                                "fill": true,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 15
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 15
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 17
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 17
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 5,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 5
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 6,
                                            "y": 5
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 6,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 7
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 6,
                                            "y": 7
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 7,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 9
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 6,
                                            "y": 9
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
                 
                this.body = this.addChild(new GO({
                    position: new V2(15,5),
                    size: new V2(30, 90),
                    img: PP.createImage(bodyModel)
                }))
                  
                let vRodModel = {
                    "general": {
                        "originalSize": {
                            "x": 1,
                            "y": 20
                        },
                        "size": {
                            "x": 1,
                            "y": 20
                        },
                        "zoom": 10,
                        "showGrid": true
                    },
                    "main": {
                        "layers": [
                            {
                                "order": 0,
                                "selected": false,
                                "type": "dots",
                                "strokeColor": "#234e78",
                                "fillColor": "#234e78",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 0
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 4
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 6
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 8
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 10
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 12
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 14
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 16
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 18
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 1,
                                "selected": false,
                                "type": "dots",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 1
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 5
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 7
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 9
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 11
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 13
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 15
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 17
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 19
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }
                let gRodModel = {
                    "general": {
                        "originalSize": {
                            "x": 10,
                            "y": 6
                        },
                        "size": {
                            "x": 10,
                            "y": 6
                        },
                        "zoom": 10,
                        "showGrid": true
                    },
                    "main": {
                        "layers": [
                            {
                                "order": 0,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": true,
                                "fill": true,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 0
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 0
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 5
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 5
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 1,
                                "selected": false,
                                "type": "dots",
                                "strokeColor": "#234e78",
                                "fillColor": "#234e78",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 5,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 5,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 7,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 7,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 9,
                                            "y": 3
                                        }
                                    }
                                ]
                            },
                            {
                                "order": 2,
                                "selected": false,
                                "type": "dots",
                                "strokeColor": "#4085C8",
                                "fillColor": "#4085C8",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 2,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 2,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 6,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 6,
                                            "y": 3
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 8,
                                            "y": 2
                                        }
                                    },
                                    {
                                        "point": {
                                            "x": 8,
                                            "y": 3
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                }

                this.rod = this.addChild(new GO({
                    position: new V2(-10,18.5),
                    size: new V2(10, 6),
                    img: PP.createImage(gRodModel),
                    init() {
                        this.addChild(new GO({
                            position: new V2(-2,-13),
                            size: new V2(3, 20),
                            img: PP.createImage(vRodModel),
                        }))
                    },
                    movement: {
                        left: {
                                dimension: 'x',
                                time: 0, 
                                duration: 10, 
                                startValue: -10, 
                                change: -8, 
                                type: 'quad',
                                method: 'out',
                            },
                        right: {
                            dimension: 'x',
                            time: 0, 
                            duration: 10, 
                            startValue: -18, 
                            change: 8, 
                            type: 'quad',
                            method: 'out',
                        }
                    },
                    move(isLeft) {
                        this.movementTimer = createTimer(25, () => {
                            let m = isLeft ? this.movement.left: this.movement.right;
                            let next = easing.process(m);

                            let delta = next - this.position[m.dimension];
                            this.parent.plugger.position[m.dimension]+=delta;
                            this.parent.plugger.needRecalcRenderProperties = true;

                            this.position[m.dimension] = next;
                            this.needRecalcRenderProperties = true;
                            m.time++;
                            if(m.time >= m.duration){
                                m.time = 0;
                                this.movementTimer = undefined; 
                                if(isLeft){
                                    this.parent.plugger.plug();
                                }
                                else{
                                    this.parent.isPlugging = false;
                                    this.parent.indicators.togglePlugging(false);
                                }
                            }

                        }, this, true);
                    },
                    internalUpdate(now){
                        if(this.movementTimer)
                            doWorkByTimer(this.movementTimer, now);
                    }
                }))

                this.outputLine = this.addChild(new GO({
                    position: new V2(0,18.5),
                    size: new V2(30, 9),
                    img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#4085C8'; ctx.fillRect(0,0,1,1) }),
                    takeOutCork(){
                        this.addChild(new GO({
                            position: new V2(5, -this.size.y/2 - 1.75),
                            size: new V2(4,3.75),
                            renderValuesRound: true,
                            slideLeft: {
                                time: 0, 
                                duration: 10, 
                                startValue: 5, 
                                change: -17, 
                                type: 'quad',
                                method: 'out',
                            },
                            img: this.parent.parentScene.corkImg,//createCanvas(new V2(1,1), (ctx) =>{ ctx.fillStyle = 'green'; ctx.fillRect(0,0,1,1) }),
                            init() {
                                this.setDeadTimer = createTimer(1000, () => {
                                    this.setDead();
                                }, this, false);

                                this.slideTimer = createTimer(25, () => {
                                    this.position.x = easing.process(this.slideLeft);
                                    this.slideLeft.time++;
                                    this.needRecalcRenderProperties = true;
                                    if(this.slideLeft.time > this.slideLeft.duration){
                                        this.slideTimer = undefined;
                                        this.parent.parent.plugger.take(this);
                                    }
                                }, this, true);
                            },
                            internalUpdate(now) {
                                if(this.slideTimer) 
                                    doWorkByTimer(this.slideTimer, now)
                            }
                        }))
                    },
                    init() {
                    },
                    internalUpdate(now) {
                        if(this.outputCorkGenerator) 
                            doWorkByTimer(this.outputCorkGenerator, now)
                    }
                }))

                this.bodyTopCover = this.addChild(new GO({
                    position: new V2(11,12),
                    size: new V2(10, 9),
                    img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#4085C8'; ctx.fillRect(0,0,1,1) }),
                }));

                let pluggerModel = {
                    "general": {
                        "originalSize": {
                            "x": 5,
                            "y": 7
                        },
                        "size": {
                            "x": 5,
                            "y": 7
                        },
                        "zoom": 10,
                        "showGrid": true
                    },
                    "main": {
                        "layers": [
                            {
                                "order": 0,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4085C8",
                                "fillColor": "#4085C8",
                                "closePath": true,
                                "fill": true,
                                "points": [
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 5
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 6
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 6
                                        },
                                        "selected": true
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 5
                                        },
                                        "selected": false
                                    }
                                ]
                            },
                            {
                                "order": 1,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4085C8",
                                "fillColor": "#4085C8",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 2,
                                            "y": 0
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 2,
                                            "y": 4
                                        },
                                        "selected": true
                                    }
                                ]
                            },
                            {
                                "order": 2,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#356FA5",
                                "fillColor": "#356FA5",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 1,
                                            "y": 4
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 5
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 0,
                                            "y": 6
                                        },
                                        "selected": true
                                    }
                                ]
                            },
                            {
                                "order": 3,
                                "selected": false,
                                "type": "lines",
                                "strokeColor": "#4B9DEA",
                                "fillColor": "#4B9DEA",
                                "closePath": false,
                                "fill": false,
                                "points": [
                                    {
                                        "point": {
                                            "x": 3,
                                            "y": 4
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 5
                                        },
                                        "selected": false
                                    },
                                    {
                                        "point": {
                                            "x": 4,
                                            "y": 6
                                        },
                                        "selected": true
                                    }
                                ]
                            }
                        ]
                    }
                }

                this.plugger = this.addChild(new GO({
                    initialPosition: new V2(),
                    position: new V2(-12, -2),
                    size: new V2(9,21),
                    takeMovement: [
                        {
                            dimension: 'y',
                            time: 0, 
                            duration: 10, 
                            startValue: -2, 
                            change: 6, 
                            type: 'quad',
                            method: 'out',
                        },
                        {
                            dimension: 'y',
                            time: 0, 
                            duration: 10, 
                            startValue: 4, 
                            change: -6, 
                            type: 'quad',
                            method: 'out',
                        }
                    ],
                    plugMovement: [
                        {
                            dimension: 'y',
                            time: 0, 
                            duration: 10, 
                            startValue: -2, 
                            change: 32, 
                            type: 'quad',
                            method: 'out',
                        },
                        {
                            dimension: 'y',
                            time: 0, 
                            duration: 10, 
                            startValue: 30, 
                            change: -32, 
                            type: 'quad',
                            method: 'out',
                        }
                    ],
                    currentTakeMovement: 0,
                    currentPlugMovement: 0,
                    img: PP.createImage(pluggerModel),
                    init(){
                        this.addChild(new GO({
                            position: new V2(0,-10),
                            size: new V2(4,3),
                            img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#4085C8'; ctx.fillRect(0,0,1,1) })
                        }))
                    },
                    take(cork) {
                        this.movementTimer = createTimer(25, () => {
                            let m = this.takeMovement[this.currentTakeMovement];
                            this.position[m.dimension] = easing.process(m);
                            this.needRecalcRenderProperties = true;
                            m.time++;
                            if(m.time >= m.duration){
                                m.time = 0;
                                if(this.currentTakeMovement == 0){
                                    cork.setDead();
                                }
                                else if(this.currentTakeMovement == 1){
                                    this.parent.rod.move(true);
                                }

                                this.currentTakeMovement++;
                                if(this.currentTakeMovement >= this.takeMovement.length){
                                    this.movementTimer = undefined;
                                    this.currentTakeMovement = 0;
                                }                                    
                            }

                        }, this, true);
                    },
                    plug(){
                        this.movementTimer = createTimer(25, () => {
                            let m = this.plugMovement[this.currentPlugMovement];
                            this.position[m.dimension] = easing.process(m);
                            this.needRecalcRenderProperties = true;
                            m.time++;
                            if(m.time >= m.duration){
                                m.time = 0;
                                if(this.currentPlugMovement == 0){
                                    this.parent.bottle.cork.isVisible = true;
                                    this.parent.bottle = undefined;
                                }
                                else if(this.currentPlugMovement == 1){
                                    this.parent.rod.move(false);
                                }

                                this.currentPlugMovement++;
                                if(this.currentPlugMovement >= this.plugMovement.length){
                                    this.movementTimer = undefined;
                                    this.currentPlugMovement = 0;
                                }                                    
                            }

                        }, this, true);
                    },
                    internalUpdate(now){
                        if(this.movementTimer)
                            doWorkByTimer(this.movementTimer, now);
                    }

                }));

                this.shadows = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size) => {
                        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(30,77,30,2);ctx.fillRect(15,68,21,2);ctx.fillRect(39,20,12,1);
                        ctx.fillRect(39,26,12,1);ctx.fillRect(39,32,12,1); ctx.fillRect(35,50,1,9);
                        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(30,79,30,2);ctx.fillRect(15,70,21,2);ctx.fillRect(39,21,12,1);
                        ctx.fillRect(39,27,12,1);ctx.fillRect(39,33,12,1);ctx.fillRect(34,50,1,9);
                        ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(30,81,30,2);ctx.fillRect(15,72,21,2);ctx.fillRect(39,22,12,1);
                        ctx.fillRect(39,28,12,1);ctx.fillRect(39,34,12,1);ctx.fillRect(33,50,1,9);
                    })
                }));

                this.communications = this.addChild(new GO({
                    position: new V2(15, -this.size.y/2-8),
                    size: new V2(8, 50),
                    img: createCanvas(new V2(8, 30), (ctx, size) => { 
                        ctx.fillStyle = '#4085C8';
                        ctx.fillRect(1,0,size.x-2, size.y);
                        
                        ctx.fillStyle = '#4796E0';
                        ctx.fillRect(size.x-3,0,1, size.y);
                         ctx.fillStyle = '#3570A8';
                        ctx.fillRect(2,0,1, size.y);
                        
                        ctx.fillStyle = '#4085C8';
                        ctx.fillRect(0,size.y-3,size.x, 3);
                        ctx.fillStyle = '#4796E0';
                        ctx.fillRect(size.x-2,size.y-3,1, 3);
                        ctx.fillStyle = '#3570A8';
                        ctx.fillRect(1,size.y-3,1, 3);

                        ctx.fillStyle = 'rgba(0,0,0,0.1)'
                        ctx.fillRect(0,size.y-3,size.x, 3);
                     })
                 }));

                 this.indicators = this.addChild(new GO({
                    position: new V2(16,28),
                    size: new V2(4,3),
                    state: {
                        power: true,
                        pluggingCork: false,
                    },
                    togglePlugging(enable) {
                        this.state.pluggingCork = enable;
                        this.pluggingCork.img = enable ? this.workImg : this.idleImg;
                    },
                    togglePower() {
                        this.state.power = !this.state.power;
                        this.power.img = this.state.power ? this.okImg : this.idleImg;
                    },
                    init() {
                        this.ledWidth = this.size.x/2;
                        this.idleImg = createCanvas(new V2(1,2), (ctx, size) => {
                            ctx.fillStyle = '#D3D3D3';ctx.fillRect(0,0, size.x, size.y);
                            ctx.fillStyle = '#A5A5A5';ctx.fillRect(0,1, size.x, 1);
                        })
                        this.okImg = createCanvas(new V2(1,2), (ctx, size) => {
                            ctx.fillStyle = '#43CC53';ctx.fillRect(0,0, size.x, size.y);
                            ctx.fillStyle = '#35A342';ctx.fillRect(0,1, size.x, 1);
                        })
                        this.workImg= createCanvas(new V2(1,2), (ctx, size) => {
                            ctx.fillStyle = '#DB965D';ctx.fillRect(0,0, size.x, size.y);
                            ctx.fillStyle = '#A57147';ctx.fillRect(0,1, size.x, 1);
                        });
                        
                        this.power = this.addChild(new GO({
                            size: new V2(this.ledWidth, this.size.y),
                            position: new V2(-this.size.x/2 , 0),
                            img: this.okImg
                        }));
                        this.pluggingCork = this.addChild(new GO({
                            size: new V2(this.ledWidth, this.size.y),
                            position: new V2(this.size.x/2 - this.ledWidth, 0),
                            img: this.idleImg
                         }));
        
                         this.togglePowerLedTimer = createTimer(500, this.togglePower, this, true);
                    },
                    internalUpdate(now){
                        if(this.togglePowerLedTimer)
                            doWorkByTimer(this.togglePowerLedTimer, now);
                    }
                 }));
            }

        }), 5);

        this.labellerBase = this.addGo(new GO({
            position: new V2(280, this.viewport.y/4),
            size: new V2(60, 90),
            init() {
                this.railsSize = new V2(15, 60);
                this.rails = this.addChild(new GO({
                    size: this.railsSize,
                    position: new V2(-10, 30),
                    img: createCanvas(this.railsSize, (ctx, size) => {
                        ctx.fillStyle = '#4592D1';ctx.fillRect(0,0, size.x, size.y);
                        ctx.fillStyle = '#3570A8';ctx.fillRect(4,2, size.x-8, size.y-4);
                        ctx.fillStyle = '#2C5E8C';
                        for(let i =2; i< size.y-2;i++){
                            if(i%4== 0)
                                ctx.fillRect(5,i, size.x-10, 2);
                        }

                        ctx.fillStyle = '#3570A8';
                        ctx.fillRect(1,1,1,1);ctx.fillRect(size.x-2,1,1,1);
                        ctx.fillRect(1,size.y-2,1,1);ctx.fillRect(size.x-2,size.y-2,1,1);
                    }),
                    init(){
                        this.shadowsH = this.addChild(new GO({
                            position: new V2(0, this.size.y/2 + 1),
                            size: new V2(this.size.x,2),
                            //renderValuesRound: true,
                            img: createCanvas(new V2(this.size.x, 2), (ctx, size) => {
                                //ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,size.x,2);
                                ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0,0,size.x,2);
                                //ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,4,30,2);
                            })
                        }));
                    }
                }));

                this.labelsDelivererSize = new V2(20, 140);
                this.labelsDeliverer = this.addChild(new GO({
                    size: this.labelsDelivererSize,
                    position: new V2(7.5, -45),
                    renderValuesRound: true,
                    img: createCanvas(this.labelsDelivererSize, (ctx, size) => {
                        ctx.fillStyle = '#4085C8'; ctx.fillRect(0,124, size.x-3, 16); ctx.fillRect(9,0, 8, size.y);
                        ctx.fillStyle = '#4B9DEA'; ctx.fillRect(15,0,2, size.y);

                        ctx.fillStyle = '#356FA5';
                        for(let j = 0;j<3;j++){
                            for(let i = 0;i<10;i++){
                                let shift = 0;
                                if(j%2 == 0) shift = 1;
                                if(i%2 == 0) ctx.fillRect(shift + 1 + i, size.y-4 + j, 1, 1);
                            }
                        }

                        ctx.fillStyle = '#3570A8';
                        ctx.fillRect(6, 119, 3,1);
                        ctx.fillRect(7, 120, 2,1);
                        ctx.fillRect(8, 121, 1,1);
                    }) ,
                    init(){
                        this.labelsPackSize = new V2(5, 10);
                        this.labelsPack = this.addChild(new GO({
                            position: new V2(-3.5,45),
                            amount: 5,
                            size: this.labelsPackSize,
                            renderValuesRound: true,
                            init() {
                                this.changeAmount(5);
                            },
                            changeAmount(amount) {
                                this.amount = amount;

                                this.img = createCanvas(this.size, (ctx, size) => { 
                                    let baseColor = '#E5BC8D';
                                    let alterColor = colors.changeHSV({initialValue: baseColor, parameter: 'v', amount: 4})
                                    for(let i = size.x-amount; i < size.x; i++){
                                        ctx.fillStyle = i%2==0 ? baseColor : alterColor;
                                        ctx.fillRect(i,0,1,size.y);     
                                    }
                                    
                                    ctx.fillStyle = '#3570A8';
                                    ctx.fillRect(0,0,size.x, 1);ctx.fillRect(0,size.y-1,size.x, 1);
                                })
                            }
                        }));

                        this.shadowsH = this.addChild(new GO({
                            position: new V2(-1.5, this.size.y/2 + 6.1),
                            size: new V2(this.size.x-3,12),
                            //renderValuesRound: true,
                            img: createCanvas(new V2(this.size.x, 12), (ctx, size) => {
                                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,size.x,2);
                                ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0,2,size.x,2);
                                ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,4,30,2);
                            })
                        }));

                        this.shadowsV = this.addChild(new GO({
                            position: new V2(-this.size.x/2 - 1, 62),
                            size: new V2(2, 16),
                            //renderValuesRound: true,
                            img: createCanvas(new V2(this.size.x, 12), (ctx, size) => {
                                ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0,0,size.x,size.y);
                            })
                        }));
                    },
                    refillLabelsPack() {
                        this.script.items = [
                            function(){
                                this.scriptTimer = this.createScriptTimer(
                                    function() { },
                                function() { return true }, false, 250);
                            },
                            function(){
                                let up = { time: 0, duration: 15, change: -100, type: 'cubic', method: 'in', startValue: this.labelsPack.position.y }
                                this.scriptTimer = this.createScriptTimer(
                                    function() { 
                                        this.labelsPack.position.y = easing.process(up); 
                                        up.time++;
                                    },
                                    function() { return up.time > up.duration; }, true, 25);
                            },
                            function(){
                                this.scriptTimer = this.createScriptTimer(
                                    function() { 
                                        this.labelsPack.changeAmount(5);
                                    },
                                function() { return true }, false, 500);
                            },
                            function(){
                                let up = { time: 0, duration: 15, change: 100, type: 'cubic', method: 'out', startValue: this.labelsPack.position.y }
                                this.scriptTimer = this.createScriptTimer(
                                    function() { 
                                        this.labelsPack.position.y = easing.process(up); 
                                        up.time++;
                                    },
                                function() { return up.time > up.duration; }, true, 25);
                            },
                            function(){
                                this.scriptTimer = this.createScriptTimer(
                                    function() { 
                                        this.labelsPack.position.y = 45;
                                        this.labelsPack.needRecalcRenderProperties = true;
                                    },
                                function() { return true }, false, 25);
                            }
                        ]

                        this.processScript();
                    }
                }))
            }
        }), 1)

        this.labellerHead = this.addGo(new GO({
            position: new V2(270, this.viewport.y/4),
            size: new V2(10, 20),
            renderValuesRound: false,
            angle: 0,
            scriptCustomDelay: 25,
            init(){
                this.scriptTemplates = [
                    function(){
                        let rRight = { time: 0, duration: 5, change: -90, type: 'quad', method: 'out', startValue: this.angle }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.angle = easing.process(rRight); 
                                rRight.time++;
                            },
                            function() { return rRight.time > rRight.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let lp = this.parentScene.labellerBase.labelsDeliverer.labelsPack
                        let panel = { time: 0, duration: 5, change: 2 + 5 - lp.amount - 1, type: 'quad', method: 'out', startValue: this.panel.position.y }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.panel.position.y = easing.process(panel); 
                                panel.time++;
                            },
                            function() { return panel.time > panel.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let lp = this.parentScene.labellerBase.labelsDeliverer.labelsPack
                        let panel = { time: 0, duration: 5, change: -2 - (5 - lp.amount - 1), type: 'quad', method: 'out', startValue: this.panel.position.y }
                        this.panel.label.isVisible = true;
                        
                        lp.changeAmount(lp.amount-1);

                        if(lp.amount == 0){
                            this.parentScene.labellerBase.labelsDeliverer.refillLabelsPack()
                        }

                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.panel.position.y = easing.process(panel); 
                                panel.time++;
                            },
                            function() { return panel.time > panel.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let rRight = { time: 0, duration: 5, change: 90, type: 'quad', method: 'out', startValue: this.angle }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.angle = easing.process(rRight); 
                                rRight.time++;
                            },
                            function() { return rRight.time > rRight.duration; }, true, this.scriptCustomDelay);
                    },
                    function() {
                        let goDown = { time: 0, duration: 10, change: 57, type: 'quad', method: 'out', startValue: this.position.y};
                        this.angle = 0;
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.position.y =  easing.process(goDown)
                                goDown.time++;
                            },
                            function() { return goDown.time > goDown.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let rLeft = { time: 0, duration: 5, change: 90, type: 'quad', method: 'out', startValue: this.angle }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.angle = easing.process(rLeft); 
                                rLeft.time++;
                                // if(rLeft.time >= rLeft.duration/2 ){
                                //     this.body.img = this.body.imgInverted;
                                // }
                            },
                            function() { return rLeft.time > rLeft.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let panel = { time: 0, duration: 5, change: 5, type: 'quad', method: 'out', startValue: this.panel.position.y }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.panel.position.y = easing.process(panel); 
                                panel.time++;
                            },
                            function() { return panel.time > panel.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        this.panel.label.isVisible = false;
                        this.bottle.label.isVisible = true;
                        let panel = { time: 0, duration: 5, change: -5, type: 'quad', method: 'out', startValue: this.panel.position.y }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.panel.position.y = easing.process(panel); 
                                panel.time++;
                            },
                            function() { return panel.time > panel.duration; }, true, this.scriptCustomDelay);
                    },
                    function(){
                        let rLeft = { time: 0, duration: 5, change: -90, type: 'quad', method: 'out', startValue: this.angle }
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.angle = easing.process(rLeft); 
                                rLeft.time++;
                                // if(rLeft.time >= rLeft.duration/2 ){
                                //     this.body.img = this.body.imgDefault;
                                // }
                            },
                            function() { return rLeft.time > rLeft.duration; }, true, this.scriptCustomDelay);
                    },
                    function() {
                        let goUp = { time: 0, duration: 10, change: -57, type: 'quad', method: 'out', startValue: this.position.y};
                        this.angle = 0;
                        this.scriptTimer = this.createScriptTimer(
                            function() { 
                                this.position.y =  easing.process(goUp)
                                goUp.time++;
                            },
                            function() { 
                                return goUp.time > goUp.duration; 
                            }, true, this.scriptCustomDelay);
                    },
                ]

                this.panelSize = new V2(8, 10);
                this.panel = this.addChild(new GO({
                    position: new V2(0, 5),
                    size: this.panelSize,
                    img: PP.createImage({"general":{"originalSize":{"x":8,"y":10},"size":{"x":8,"y":10},"zoom":10,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#356FA5","fillColor":"#356FA5","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":0}},{"point":{"x":2,"y":9}},{"point":{"x":5,"y":9}},{"point":{"x":5,"y":0}}]},{"order":1,"type":"lines","strokeColor":"#4085C8","fillColor":"#4085C8","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":0,"y":7}},{"point":{"x":7,"y":7}},{"point":{"x":7,"y":9}},{"point":{"x":0,"y":9}}]},{"order":2,"type":"lines","strokeColor":"#3979B5","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":0,"y":6}},{"point":{"x":7,"y":6}}]}]}})
                }))

                this.panel.label = this.panel.addChild(new GO({
                    position: new V2(0, fastRoundWithPrecision(this.panelSize.y/2) + 0.5),
                    size: new V2(this.panelSize.x, 1),
                    img: createCanvas(new V2(this.panelSize.x, 1), (ctx, size) => {
                        ctx.fillStyle = '#E5BC8D'; ctx.fillRect(0,0, size.x, size.y)
                    }),
                    isVisible: false
                }))

                this.bodySize = new V2(10,10);
                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.bodySize,
                    imgDefault: PP.createImage({"general":{"originalSize":{"x":10,"y":10},"size":{"x":10,"y":10},"zoom":10,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#4085C8","fillColor":"#4085C8","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":9}},{"point":{"x":2,"y":0}},{"point":{"x":7,"y":0}},{"point":{"x":7,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#4B9DEA","fillColor":"#4B9DEA","closePath":true,"fill":false,"visible":true,"points":[{"point":{"x":8,"y":9}},{"point":{"x":9,"y":9}},{"point":{"x":9,"y":0}},{"point":{"x":8,"y":0}}]},{"order":2,"type":"lines","strokeColor":"#356FA5","fillColor":"#356FA5","closePath":true,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":9}},{"point":{"x":0,"y":9}},{"point":{"x":0,"y":0}},{"point":{"x":1,"y":0}}]},{"order":3,"type":"dots","strokeColor":"#356FA5","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":3,"y":1}},{"point":{"x":4,"y":2}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":3,"y":5}},{"point":{"x":5,"y":5}}]}]}}),
                    imgInverted: PP.createImage({"general":{"originalSize":{"x":10,"y":15},"size":{"x":10,"y":15},"zoom":10,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#4085C8","fillColor":"#4085C8","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":14}},{"point":{"x":2,"y":0}},{"point":{"x":7,"y":0}},{"point":{"x":7,"y":14}}]},{"order":1,"type":"lines","strokeColor":"#356FA5","fillColor":"#356FA5","closePath":true,"fill":false,"visible":true,"points":[{"point":{"x":8,"y":14}},{"point":{"x":9,"y":14}},{"point":{"x":9,"y":0}},{"point":{"x":8,"y":0}}]},{"order":2,"type":"lines","strokeColor":"#4B9DEA","fillColor":"#4B9DEA","closePath":true,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":14}},{"point":{"x":0,"y":14}},{"point":{"x":0,"y":0}},{"point":{"x":1,"y":0}}]},{"order":3,"type":"dots","strokeColor":"#356FA5","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":3,"y":1}},{"point":{"x":4,"y":2}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":3,"y":5}},{"point":{"x":5,"y":5}}]}]}}),
                    // img: createCanvas(this.bodySize, (ctx, size) => {
                    //     ctx.fillStyle = colors.changeHSV({ initialValue: '#4085C8', parameter: 'v', amount: -5 });ctx.fillRect(0,0, size.x, size.y);
                    //     ctx.fillStyle = '#4085C8';ctx.fillRect(
                    //         2, fastRoundWithPrecision(size.y/3), size.x-4, fastRoundWithPrecision(size.y*2/3)
                    //     );

                    //     ctx.fillStyle = colors.changeHSV({ initialValue: '#4085C8', parameter: 'v', amount: -20 });
                    //     for(let j = 0; j < 3; j++){
                    //         for(let i = 0; i < 4; i++){
                    //             ctx.fillRect(i*2 + (j%2==0?1:2), j+1, 1, 1);
                    //         }
                    //     }
                    // })
                }));

                this.body.img = this.body.imgDefault;
                this.script.callbacks.completed = this.scriptCompleted;
                //this.startScript();
            },
            scriptCompleted() {
                //console.log('scriptCompleted');
                this.scriptStarted = false;
            },
            startScript(bottle){
                if(this.scriptStarted)
                    return;
                
                this.scriptStarted = true;
                this.script.items = [...this.scriptTemplates];
                this.bottle = bottle;
                this.processScript();
            },
            internalPreRender() {
                if(this.angle == 0)
                    return;
        
                this.context.save();
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.angle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);

                this.context.restore();
            }
        }),5)

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
            corkImg: this.corkImg,
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
            renderValuesRound: true,
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

        this.label = this.addChild(new GO({
            isVisible: false,
            size: new V2(5,8),
            position: new V2(2.5,6),
            renderValuesRound: true,
            img: createCanvas(new V2(4,8), (ctx, size) => {
                ctx.fillStyle = '#E5BC8D'; ctx.fillRect(0,0, size.x, size.y)
            })
            
        }));

        this.reflection = this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.reflectionImages.right,
            renderValuesRound: true
        }));

        this.cork = this.addChild(new GO({
            isVisible: false,
            renderValuesRound: true,
            position: new V2(0,-this.size.y/2 + 1),
            size: new V2(4,2),
            img: this.corkImg
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
            this.position.add(this.direction.mul(-this.speed), true);
            if(!this.cork.isVisible  && this.position.x > 150){
                this.parentScene.corker.plugCork(this);
            }

            if(!this.label.isVisible && this.position.x > 250){
                this.parentScene.labellerHead.startScript(this);
            }
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
