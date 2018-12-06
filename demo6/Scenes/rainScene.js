class RainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);

        this.debugging = {
            enabled: true,
            font: (25*SCG.viewport.scale) + 'px Arial',
            textAlign: 'center',
            fillStyle: 'red',
            position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale)
        }

        this.performance = 3;
        this.rainDropCache = [];
        this.streamItemsCache = [];

        //layers
        this.skyLayer = 0;
        this.backBuildingsLayer = 1;
        this.backStreamLayer = 1
        this.midBuildingsLayer = 4;
        this.midStreamLayer = 4;
        this.frontBuildingsLayer = 7;
        this.frontStreamLayer = 7;
        this.buildingsLayers = [this.backBuildingsLayer, this.midBuildingsLayer, this.frontBuildingsLayer];
        this.backgroundRainLayer = 10;
        this.roadSideLayer = 11;
        this.roadLayer = 12;
        this.floorLayer =13;
        this.middleRainLayer = 20;
        this.frontalRainLayer = 30;

        //sizes
        this.floorSize = new V2(this.viewport.x, 60);
        this.roadSize = new V2(this.viewport.x, 35);
        this.fenceColumnSize = new V2(10, 15);
        this.roadSideSize = new V2(this.viewport.x, 10);
        this.backStreamSize = new V2(0.75,0.75);
        this.fronStreamItemSize = new V2(2,2)

        //positions
        this.backStreamHeight = 78;
        this.midStreamHeight = 80;
        this.frontStreamHeight = 130;

        // counters
        this.fenceColumnsCount = 8;
        this.backBuildingsCount = 16;
        this.minBuildingsCount = 12;
        this.frontBuildingsCount = 10;
        this.buildingsCount = [this.backBuildingsCount, this.minBuildingsCount, this.frontBuildingsCount];

        this.neonColors = [[133,207,116],[222,133,87],[250,235,114],[101,172,219],[152,59,102],[102,170,95],[223,176,92],[76,129,170]]
    
        this.prepareSplashCaches(true);
        this.prepareSplashCaches(false);
        //backBuildings
        let widthStep = 20;
        let heightFromTo = [3/5, 7/8];
        for(let li = 0; li < this.buildingsCount.length; li++){
            for(let i = 0; i < this.buildingsCount[li]; i++){
                let position;

                if(li == 2){
                    let w = this.viewport.x/this.buildingsCount[li];
                    position = new V2(getRandom(w*i, w*i+w), this.viewport.y/2+this.viewport.y*1/6*li+getRandom(0, this.viewport.y*1/6));
                }
                else {
                    position = new V2(getRandom(0, this.viewport.x), this.viewport.y/2+this.viewport.y*1/6*li+getRandom(0, this.viewport.y*1/4));
                }

                let points = [];
                let building = new GO({
                    position: position,
                    size: new V2(
                        getRandom(widthStep+(widthStep*li/2),widthStep*2+widthStep*li), 
                        this.viewport.y
                    ),
                    img: this.buildingGenerator(li, points)
                });

                if(true){//li ==2 || getRandomInt(1,2) == 2){
                    let count = li == 0 ? getRandom(3,8) : getRandomInt(1,3);
                    
                    let upper = Math.min.apply(null, points.map((p) => p.y));
                    let positions = [];
                    for(let i = 0; i< count;i++){
                        let size = (li == 0 
                            ? new V2(building.size.x*0.2, building.size.x*getRandom(0.3, 0.6)) 
                            : new V2(building.size.x*(getRandom(0.3, 0.5)-0.1*li), building.size.x*(getRandom(0.5,0.75)-0.1*li)));
                        let top = -building.size.y/2+upper+size.y;

                        let pCounter = 5;
                        let position;
                        while(pCounter != 0){
                            position = new V2(
                                getRandom(-(building.size.x/2)*0.8, (building.size.x/2)*0.8), 
                                getRandom(top,li == 0 ? 0: -building.size.y/4));
                            
                            if(positions.some((p) => p.distance(position) < 15))
                                pCounter--;
                            else 
                                break;
                        }

                        positions.push(position);

                        building.addChild(new AdvertisementScreen({
                            position: position,
                            size: size,
                            color: this.neonColors[getRandomInt(0,this.neonColors.length-1)],
                            blinking: {
                                enabled: li == 2,
                                fast: li ==2
                            }
                        }));
                    }
                    
                }

                this.addGo(building, this.buildingsLayers[li]);
            }
        }

        // this.addGo(new AdvertisementScreen({
        //     position: new V2(this.viewport.x/2, this.viewport.y/2),
        //     size: new V2(40, 80),
        //     color: this.neonColors[getRandomInt(0,this.neonColors.length-1)],
        //     screenType: 2,
        //     contentType: 0,
        //     blinking: {
        //         enabled: false
        //     }
        // }), 50)

        // this.addGo(new Robot({
        //     special: true,
        //     size: new V2(160,80),
        //     position: new V2(this.viewport.x/2, this.viewport.y-60),
        //     //position: new V2(0, this.viewport.y-80),
        //     //destination: new V2(this.viewport.x, this.viewport.y-60),
        //     setDestinationOnInit: true,
        //     flip: true,
        //     robotType: 0,
        //     //speed: 0.5,
        //     layer: this.frontalRainLayer,
        // }), this.frontalRainLayer)

        this.deliveryDronsTimerMethod(this.viewport.x/2)
        
        //roadside
        let roadSide = new GO({
            size: this.roadSideSize, 
            position: new V2(this.viewport.x/2, this.viewport.y-this.floorSize.y-this.roadSize.y -this.roadSideSize.y/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#2C3138';
                ctx.fillRect(0,0,size.x, size.y)
            })
        });
        let segmentWidth = this.roadSideSize.x/this.fenceColumnsCount;
        let fenceColumnLedImg = createCanvas(new V2(50,50), function(ctx, size){
            let grd = ctx.createRadialGradient(size.x/2, size.y, size.x/8, size.x/2, size.y, size.x);
            grd.addColorStop(0, 'yellow');
            grd.addColorStop(0.25, 'red');
            grd.addColorStop(1, 'rgba(255,0,0,0)');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0, size.x, size.y);
        })
        for(let ci = 0; ci < this.fenceColumnsCount; ci++){
            let fenceColumn = new GO({
                size: this.fenceColumnSize, 
                position: new V2(-this.roadSideSize.x/2 + segmentWidth*ci+segmentWidth/2, -this.fenceColumnSize.y/2),
                img: createCanvas(new V2(50,50), this.fenceGenerator)
            });

            
            fenceColumn.addChild(new Led({
                position: new V2(0, -fenceColumn.size.y/2),
                size: new V2(5,5),
                autoStartFadeOut: 250*ci,
                blinking: {
                    step: 0.15
                },
                fadeInPause: 1000,
                fadeOutPause: 250,
                img: fenceColumnLedImg
            }));

            roadSide.addChild(fenceColumn)
        }
        this.addGo(roadSide, this.roadSideLayer);

        //road
        let road = new GO({
            size: this.roadSize,
            position: new V2(this.viewport.x/2, this.viewport.y-this.floorSize.y-this.roadSize.y/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#2C3746';
                ctx.fillRect(0,0,size.x, size.y)
            })
        });

        //border
        road.addChild(new GO({
            size: new V2(this.roadSize.x, this.roadSize.y*0.1),
            position: new V2(0, -this.roadSize.y/2+(this.roadSize.y*0.1)/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#1B2232';
                ctx.fillRect(0,0,size.x, size.y)
            })
        }));
        this.addGo(road, this.roadLayer);

        // floor
        let floor = new GO({
            size: this.floorSize,
            position: new V2(this.viewport.x/2, this.viewport.y - this.floorSize.y/2),
            img: createCanvas(new V2(50, 50), function(ctx, size){
                ctx.fillStyle = '#162A44';
                ctx.fillRect(0,0,size.x,size.y);
                let grd = ctx.createLinearGradient(size.x/2, size.y, size.x/2, 0);
                grd.addColorStop(0, 'rgba(255,255,255, 0)');
                grd.addColorStop(0.2, 'rgba(255,255,255, 0.1)');
                grd.addColorStop(0.55, 'rgba(255,255,255, 0.5)');
                grd.addColorStop(0.85, 'rgba(255,255,255, 0.1)');
                grd.addColorStop(1, 'rgba(255,255,255, 0)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0,size.x, size.y)
            })
        });

        //lamps
        this.lampSize = new V2(100, 150);
        this.lampsCount =4 ;
        for(let i = 0; i < this.lampsCount+1; i++){
            this.addGo(new GO({
                position: new V2(i*this.viewport.x/this.lampsCount,this.viewport.y-this.floorSize.y/2 - this.lampSize.y/2),
                size: this.lampSize,
                img: createCanvas(this.lampSize, function(ctx, size){
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    let lightColor = '255,255,255';
                    let grd = ctx.createRadialGradient(27,20,10, 18,57,15);
                    grd.addColorStop(0, 'rgba('+lightColor+', 0)');
                    grd.addColorStop(0.2, 'rgba('+lightColor+', 0)');
                    grd.addColorStop(0.2, 'rgba('+lightColor+', 1)');
                    grd.addColorStop(0.3, 'rgba('+lightColor+', 0.75)');
                    grd.addColorStop(1, 'rgba('+lightColor+', 0)');
    
                    ctx.fillStyle = grd;
                    ctx.fillRect(0,0,size.x/2, size.y);

                    /// shadow start
                    ctx.translate(size.x/2, 154)
                    ctx.scale(1, 0.1)
                    ctx.translate(-size.x/2, -154)
                    grd = ctx.createRadialGradient(size.x/2, size.y/2, 0, size.x/2, size.y/2, 40);
                    grd.addColorStop(0, 'rgba(0,0,0,1)');
                    grd.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(10,35,80, 80);
                    ctx.translate(size.x/2, 154)
                    ctx.scale(1, 10)
                    ctx.translate(-size.x/2, -154)
                    /// shadow end
    
                    grd = ctx.createRadialGradient(73,20,10, 82,57,15);
                    grd.addColorStop(0, 'rgba('+lightColor+', 0)');
                    grd.addColorStop(0.2, 'rgba('+lightColor+', 0)');
                    grd.addColorStop(0.2, 'rgba('+lightColor+', 1)');
                    grd.addColorStop(0.3, 'rgba('+lightColor+', 0.75)');
                    grd.addColorStop(1, 'rgba('+lightColor+', 0)');
                    ctx.fillStyle = grd;
                    ctx.fillRect(size.x/2,0,size.x/2, size.y);
    
                    grd = ctx.createLinearGradient(45,75, 55,75);
                    grd.addColorStop(0, '#272727');
                    grd.addColorStop(1, '#585D63');
                    ctx.fillStyle = grd;
                    ctx.beginPath();
                    ctx.moveTo(47.5, 20);
                    ctx.lineTo(45,60);ctx.lineTo(45, 145);
                    ctx.bezierCurveTo(46.5,149,53.5,148,55, 145);
                    ctx.lineTo(55,60);ctx.lineTo(52.5,20);
                    ctx.closePath();
                    ctx.fill();
    
                    ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.moveTo(45,78)
                    ctx.bezierCurveTo(46,79,48,81, 50, 80);
                    ctx.lineTo(50, 100);
                    ctx.bezierCurveTo(48,100, 46,99, 45, 98);
                    ctx.stroke();
    
                    grd = ctx.createLinearGradient(50, 0, 50,40);
                    grd.addColorStop(0, '#272727');
                    grd.addColorStop(1, '#585D63');
                    draw(ctx, {fillStyle: grd, closePath: true, points: [new V2(47.5, 20), new V2(20, 10), new V2(15,20), new V2(36,27), new V2(39,20), new V2(50, 24)]})
                    draw(ctx, {fillStyle: grd, closePath: true, points: [new V2(52.5, 20), new V2(80, 10), new V2(85,20), new V2(64,27), new V2(61,20), new V2(50, 24)]})
    
                    draw(ctx, {strokeStyle: 'black', lineWidth:1, closePath: false, points: [new V2(15,20),new V2(36,27), new V2(39,20)]})
                    draw(ctx, {strokeStyle: 'black', lineWidth:1, closePath: false, points: [new V2(85,20), new V2(64,27),new V2(61,20)]})
                })
            }), this.frontalRainLayer-2);
        }

        this.addGo(floor, this.floorLayer);

        // images
        this.rainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = '#4C96C4';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.midRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = '#3D7AA0';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.backRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = '#386F91';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.recreatedRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'green';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.splashImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = '#4C96C4';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.backSplashImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = '#3D7AA0';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.streamItemRedImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(190, 0, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemBlueImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(0, 0, 255)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemBrightRedImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemYelloImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(200, 200, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemBrightYelloImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'yellow';
            ctx.fillRect(0,0, size.x, size.y);
        })

        //streams
        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.midStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,2);
            this.addGo(new StreamItem({
                img: this.streamItemRedImg,
                brightImg: this.streamItemBrightRedImg,
                position: new V2(i, h),
                destination: new V2(this.viewport.x+1, h),
                layer: this.midStreamLayer
            }), this.midStreamLayer);
        }

        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.backStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,1.5);
            this.addGo(new StreamItem({
                img: this.streamItemYelloImg,
                brightImg: this.streamItemBrightYelloImg,
                position: new V2(i, h),
                destination: new V2(-1, h),
                size: this.backStreamSize,
                layer: this.backStreamLayer
            }), this.backStreamLayer);
        }

        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.frontStreamHeight+ getRandom(-5,5);
            this.addGo(new StreamItem({
                img: this.streamItemRedImg,
                brightImg: this.streamItemBrightRedImg,
                position: new V2(i, h),
                destination: new V2(this.viewport.x+1, h),
                size: this.fronStreamItemSize,
                speed: 0.3 + getRandom(-0.02, 0.02),
                layer: this.frontStreamLayer
            }), this.frontStreamLayer);
        }

        //spotlights
        let spotlightSectionsCount = 3;
        for(let j = 0; j < spotlightSectionsCount; j++)
        for(let i = 0; i < getRandomInt(1,5); i++){
            let initialAngle = getRandom(-5, 5);
            let enabled = getRandomBool();
            let layer = getRandomInt(0,2);
            let rotation = {
                enabled: enabled,
                angle: initialAngle,
                min: enabled ? initialAngle - getRandomInt(1,5): initialAngle,
                max: enabled ? initialAngle + getRandomInt(1,5): initialAngle,
                direction: 1,
                step: 0.05
            };

            if(enabled){
                rotation.step = (rotation.max - rotation.min)/getRandomInt(300, 600);
            }

            this.addGo(new GO({
                rotation: rotation,
                position: new V2(getRandom(j*this.viewport.x/spotlightSectionsCount, j*this.viewport.x/spotlightSectionsCount + this.viewport.x/spotlightSectionsCount), this.viewport.y),
                size: new V2(5 + layer*5, this.viewport.y*2.2),
                img: createCanvas(new V2(50,10), function(ctx, size){
                    let grd = ctx.createLinearGradient(0,0,size.x, 0);
                    grd.addColorStop(0, 'rgba(255,255,255, 0)')
                    grd.addColorStop(0.5, 'rgba(255,255,255, 0.5)')
                    grd.addColorStop(1, 'rgba(255,255,255, 0)');
    
                    ctx.fillStyle = grd;
                    ctx.fillRect(0,0, size.x, size.y);
                }), 
                internalUpdate() {
                    
                    let r = this.rotation;
                    if(!r.enabled)
                        return;

                    r.angle+=r.direction*r.step;
    
                    if(r.angle > r.max){
                        r.angle = r.max;
                        r.direction = -1;
                    }
    
                    if(r.angle < r.min){
                        r.angle = r.min;
                        r.direction = 1;
                    }
                },
                internalPreRender() {
                    this.context.translate(this.renderPosition.x, this.renderPosition.y);
                    this.context.rotate(degreeToRadians(this.rotation.angle));
                    this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
                },
                internalRender() {
                    this.context.translate(this.renderPosition.x, this.renderPosition.y);
                    this.context.rotate(degreeToRadians(-this.rotation.angle));
                    this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
                }
            }), layer == 2 ? this.midBuildingsLayer + 1: (layer == 1 ? this.midBuildingsLayer - 1 : this.backBuildingsLayer - 1));
        }

        let taxiSize=this.viewport.division(4);
        this.taxi = new GO({
            position: new V2(this.viewport.x/8, this.viewport.y-this.floorSize.y-this.roadSize.y/2-taxiSize.y/4),
            size: taxiSize,//new V2(125, 75),
            layer: this.middleRainLayer,
            collisionDetection: {
                enabled: true,
                circuit: [new V2(-50,-12),new V2(10,-15), new V2(45,10)]
            },
            // internalRender() {
            //     let scale = SCG.viewport.scale;
            //     let cdBoxTLRender = this.collisionDetection.box.topLeft.mul(scale);
            //     this.context.strokeStyle = '#00BFFF';
            //     this.context.strokeRect(cdBoxTLRender.x, cdBoxTLRender.y, this.collisionDetection.box.width*scale, this.collisionDetection.box.height*scale);
            //     let position = this.position;
            //     draw(
            //         this.context, 
            //         {
            //             lineWidth: 2,
            //             strokeStyle: 'red',
            //             closePath: true,
            //             points: this.collisionDetection.circuit.map((item) => item.add(position).mul(scale))
            //         }
            //     )
            // },
            
            init() {
                this.body = new GO({
                    position: new V2(),
                    size: taxiSize, 
                    img: createCanvas(this.parentScene.viewport, function(ctx, size){
                        ctx.beginPath();
                        ctx.moveTo(427, 207);
                        ctx.bezierCurveTo(426,237,377,246, 337,247);ctx.lineTo(208,237);
                        ctx.bezierCurveTo(183,228,129,180,44,163);
                        ctx.bezierCurveTo(34,159,31,146,31,139);
                        ctx.bezierCurveTo(64,162,166,188,370,230);
                        ctx.bezierCurveTo(393,232,414,217,429,199);
                        ctx.closePath();
        
                        let grd = ctx.createLinearGradient(212,199,204,237);
                        grd.addColorStop(0, '#4C4944');
                        grd.addColorStop(0.6, '#241F23');
                        ctx.fillStyle = grd;
                        ctx.fill();
        
                        ctx.beginPath();
                        ctx.moveTo(31, 139);
                        ctx.bezierCurveTo(64,162,166,188,370,230);
                        ctx.bezierCurveTo(393,232,414,217,429,199);ctx.lineTo(429,188);ctx.lineTo(422,180);
                        ctx.bezierCurveTo(402,148,367,113,317,91);
                        ctx.bezierCurveTo(260,82,146,83,50,95);
                        ctx.bezierCurveTo(31,104,30,127, 31, 139);
                        ctx.closePath();
                        
                        grd = ctx.createLinearGradient(175,78,175,250);
                        grd.addColorStop(0, '#FFB744');
                        grd.addColorStop(0.2, '#FA9A2C');
                        grd.addColorStop(1, '#BD7119');
                        ctx.fillStyle = grd;
                        ctx.fill();
          
        
                        ctx.beginPath();
                        ctx.moveTo(317,91);
                        ctx.bezierCurveTo(295,96,237,96,179, 106);
                        ctx.bezierCurveTo(156,117,156,133,176,144);
                        ctx.bezierCurveTo(262,165,336,187,368,197);
                        ctx.bezierCurveTo(389,201,409,190,422,179);
                        ctx.bezierCurveTo(395,138,358,108,317,91);
                        ctx.closePath();
        
                        grd = ctx.createLinearGradient(300,200,385,100);
                        grd.addColorStop(0, '#463931');
                        grd.addColorStop(0.45, '#463931');
                        grd.addColorStop(1, '#696970');
                        ctx.fillStyle = grd;
                        ctx.fill();
        
                        ctx.beginPath();
                        ctx.moveTo(173,206);
                        ctx.bezierCurveTo(170,173,173,136,179,106);
                        ctx.bezierCurveTo(204,102,237,98,265,96);
                        ctx.bezierCurveTo(258,140,255,191,259,228);
                        ctx.bezierCurveTo(229,222,201,216,173,206);
        
                        ctx.closePath();
                        ctx.strokeStyle = '#7A4911'
                        ctx.stroke();
                        ctx.fillStyle = 'rgba(0,0,0, 0.05)'
                        ctx.fill();
        
                        grd = ctx.createRadialGradient(115,160,0,115,190, 70);
                        grd.addColorStop(0, 'rgba(0,0,0,1)')
                        grd.addColorStop(1, 'rgba(0,0,0,0)');
                        ctx.fillStyle = grd;
                        ctx.fillRect(0,0, size.x/2, size.y);
                    }),
                })
                this.thruster = new GO({
                    position: new V2(-75, 5).division(2),
                    size: new V2(63,84).division(2),
                    img: createCanvas(new V2(84,112), function(ctx, size){
                        ctx.beginPath();
                        ctx.moveTo(77,99);
                        ctx.bezierCurveTo(59,106,24,105,9,98);
                        ctx.bezierCurveTo(12,54,26,15,43,20);
                        ctx.bezierCurveTo(60,17,74,59,77,99);
                        ctx.closePath();

                        let grd = ctx.createRadialGradient(65,20, 5, 30, 55, 100)
                        grd.addColorStop(0, '#FFB744')
                        grd.addColorStop(0.5, '#BD7119')
                        ctx.fillStyle = grd;
                        ctx.fill();

                        grd = ctx.createLinearGradient(0, size.y/2, size.x, size.y/2);
                        grd.addColorStop(0, 'rgba(0,0,0,0.3)')
                        grd.addColorStop(0.5, 'rgba(0,0,0,0)');

                        ctx.fillStyle = grd;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.moveTo(77,99);
                        ctx.bezierCurveTo(59,106,24,105,9,98);
                        ctx.bezierCurveTo(10,74,15,54,17,51);
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    })
                });

                this.body.addChild(this.thruster);

                this.clearWindow = new GO({
                    position: new V2(52, -4).division(2),
                    size: new V2(71,55).division(2),
                    img: createCanvas(new V2(143,110), function(ctx, size){
                        ctx.beginPath();
                        ctx.moveTo(137,91);ctx.lineTo(101,109);
                        ctx.bezierCurveTo(75,59,42,37,5,15);
                        ctx.bezierCurveTo(19,14,29,11,35,5);
                        ctx.bezierCurveTo(79,25,112,54,137,91);
                        ctx.closePath();

                        ctx.fillStyle = 'rgba(255,255,255, 0.3)';
                        ctx.fill();
                    }),
                    alpha: {
                        current: 1,
                        direction: 1,
                        step: 0.1
                    },
                    startFadeIn() {
                        this.alpha.direction = 1;
                        this.alpha.speed = 0.25;
                        this.alphaChangeTimer = createTimer(50, this.alphaChangeTimerMethod, this, true);
                    },
                    alphaChangeTimerMethod() {
                        this.alpha.current+=this.alpha.direction*this.alpha.speed;
                        if(this.alpha.current > 1){
                            this.alpha.current = 1;
                            this.alpha.direction = -1;
                            this.alpha.speed = 0.05;
                            this.alphaChangeTimer = undefined;
                            this.alpha.shouldStartFadeOut = true;
                        }
                        else if(this.alpha.current < 0){
                            this.alpha.current = 0;
                            this.alphaChangeTimer = undefined;
                        }
                    },
                    internalUpdate(now){
                        if(this.alphaChangeTimer){
                            doWorkByTimer(this.alphaChangeTimer, now)
                        }

                        if(this.alpha.shouldStartFadeOut){
                            this.alpha.shouldStartFadeOut = false;
                            this.alphaChangeTimer = createTimer(50, this.alphaChangeTimerMethod, this, true);
                        }
                    },
                    internalPreRender() {
                        this.alpha.originContextGlobalAlpha = this.context.globalAlpha;
                        this.context.globalAlpha = this.alpha.current;
                    },
                    internalRender(){
                        this.context.globalAlpha = this.alpha.originContextGlobalAlpha;
                    }
                });

                this.windowCleaner = new MovingGO({
                    size: new V2(71,55).division(2).mul(0.9),
                    position: new V2(-1,1),
                    speed: 2.5,
                    isVisible: false,
                    side: 1,
                    img: createCanvas(new V2(143,110), function(ctx, size){
                        ctx.beginPath();
                        ctx.moveTo(107,103)
                        ctx.bezierCurveTo(84,59,52,37,22,15)
                        ctx.strokeStyle = 'rgba(255,0,0,0.25)';
                        ctx.lineWidth = 3;
                        ctx.stroke();
                    }),
                    init() {
                        this.clearingTimer = createTimer(6000, this.clearingTimerMethod, this, true);
                    },
                    clearingTimerMethod() {
                        this.isVisible = true;
                        this.setDestination(this.side > 0 ? new V2(6,-1): new V2(-1,1))
                    },
                    destinationCompleteCallBack() {
                        //console.log('destinationCompleteCallBack. this.side ' + this.side);
                        this.isVisible = false;
                        this.side *=-1;
                        this.parent.startFadeIn();
                    },
                    internalUpdate(now) {
                        doWorkByTimer(this.clearingTimer, now);
                    },
                    internalPreRender() {
                        this.originContextGlobalAlpha = this.context.globalAlpha;
                        this.context.globalAlpha = 1;
                    },
                    internalRender(){
                        this.context.globalAlpha = this.originContextGlobalAlpha;
                    }
                });

                this.clearWindow.addChild(this.windowCleaner);

                this.shadow = new GO({
                    position: new V2(0, this.size.y/4),
                    size: new V2(this.size.x, this.size.y/4),
                    img: createCanvas(new V2(100, 100), function(ctx, size){
                        let grd = ctx.createRadialGradient(size.x/2, size.y/2, 1, size.x/2, size.y/2, size.x/2);
                        grd.addColorStop(0, 'rgba(0,0,0,1)')
                        grd.addColorStop(0.8, 'rgba(0,0,0,0)')

                        ctx.fillStyle = grd;
                        ctx.fillRect(0,0, size.x, size.y);
                    })
                })

                this.addChild(this.shadow);
                this.body.addChild(this.clearWindow);
                

                this.addChild(this.body);
            }
        });
        
        this.addGo(this.taxi, this.middleRainLayer);

        // this.addGo(new Robot({
        //     size: new V2(40,20),
        //     position: new V2(this.viewport.x/2, this.viewport.y-60),
        //     setDestinationOnInit: true,
        //     speed: 0,
        //     flip: false,
        //     robotType: 1,
        //     layer: this.frontalRainLayer,
        // }), this.frontalRainLayer)

        // timers
        this.rainDropTimer = createTimer(50, this.rainDropTimerMethod, this, true);
        this.midRainDropTimer = createTimer(50, this.midRainDropTimerMethod, this, true);
        // this.backRainDropTimer = createTimer(50, this.backRainDropTimerMethod, this, true);

        this.customStreamTimer = createTimer(3000, this.customStreamTimerMethod, this, true);

        this.deliveryDronsTimer = createTimer(12000, this.deliveryDronsTimerMethod, this, true);
    }

    start(sceneProperties) {
        let that = this;
        let viewport = this.viewport.clone();
        let totalSheets = 6;
        let multiplier = 3;
        let destination = new V2(this.viewport.x/2, this.viewport.y*3/2);
        for(let layerIndex = 2; layerIndex >= 0; layerIndex--){
            let speed;
            let rdSize;
            let layer;
            switch(layerIndex){
                case 2:
                    speed = 3.5;
                    rdSize = new V2(0.25,4);
                    layer = this.frontBuildingsLayer-1;
                    break;
                case 1:
                    speed = 2;
                    rdSize = new V2(0.15,2);
                    layer = this.midBuildingsLayer-1;
                    break;
                case 0:
                    speed = 1.5;
                    rdSize = new V2(0.1,1);
                    layer = this.backBuildingsLayer-1;
                    break;
            }

            rdSize.mul(multiplier, true);

            for(let j = 0; j < totalSheets; j++){
            
                this.addGo(new MovingGO({
                    position: new V2(this.viewport.x/2, (this.viewport.y/2) - this.viewport.y*j),
                    size: viewport,
                    speed: speed,
                    setDestinationOnInit: true,
                    destination: destination,
                    destinationCompleteCheck: function(){
                        return this.position.y >= destination.y;
                    },
                    destinationCompleteCallBack: function(){
                        this.position = new V2(viewport.x/2, viewport.y/2 - viewport.y*(totalSheets-1));
                        this.setDestination(destination);
                    },
                    img: createCanvas(viewport.mul(multiplier), function(ctx, size){
                        ctx.fillStyle = '#386F91';
                        for(let i = 0; i < 1000 + 2000*(2 - layerIndex); i++){
                            let position =new V2(getRandom(1, size.x-1), getRandom(1,size.y-1)); 
    
                            ctx.fillRect(position.x,position.y, rdSize.x, rdSize.y);
                        }
                    })
                }), layer);
            }
        }
        
    }

    deliveryDronsTimerMethod(positionX){
        let isLeft = getRandomBool();
        let hShift = getRandom(30, 70);
        let position = new V2(positionX || (isLeft ? -100 : this.viewport.x + 100), this.viewport.y-hShift);
        let relativeHShift = parseInt((hShift - 30)/8);

        this.addGo(new Robot({
            size: new V2(40,20),
            position: position,
            destination: new V2(isLeft ? this.viewport.x+100 : -100, position.y),
            setDestinationOnInit: true,
            speed: getRandom(0.1,1),
            //thrusterAngle: 45,
            robotType: getRandomInt(0,1),
            flip: !isLeft,
            layer: this.frontalRainLayer,
        }), this.frontalRainLayer-relativeHShift)
    }

    prepareSplashCaches(isBack = false){
        let cache;
        if(isBack){
            Splash.yAxisCacheBack = [];
            cache = Splash.yAxisCacheBack;
        }
        else {
            Splash.yAxisCacheFront = [];
            cache = Splash.yAxisCacheFront;
        }

        for(let i = 0; i < 1000; i++){
            let props = {
                speed: isBack ? getRandom(0.1, 0.13):getRandom(0.09, 0.11),
                coefficients: {
                    a: isBack ? getRandom(1,3) : getRandom(2,4),
                    b: isBack ? getRandom(3,9) : getRandom(5,12)
                },
                xAxis: {
                    direction: getRandomBool() ? 1: -1
                },
                points: []
            }

            if(props.xAxis.direction > 0){
                props.coefficients.b*=-1;
            }

            let yAxisCurrent = 0;
            let xAxisCurrent = 0;
            while(yAxisCurrent <= 0){
                yAxisCurrent = (props.coefficients.a*xAxisCurrent*xAxisCurrent)+props.coefficients.b*xAxisCurrent;
                props.points.push({x: xAxisCurrent, y: yAxisCurrent});

                xAxisCurrent = fastRoundWithPrecision(xAxisCurrent + props.xAxis.direction*props.speed,1);
            }

            cache[i] = props;
        }
    }

    fenceGenerator(ctx, size) {
        ctx.fillStyle = '#919191';
        ctx.beginPath();
        ctx.moveTo(0,6);
        ctx.bezierCurveTo(11,3, 39,3, 49,6);
        ctx.bezierCurveTo(42,11, 9,11, 0,6);
        ctx.closePath();
        ctx.fill();

        let grd = ctx.createLinearGradient(0, size.y/2, size.x, size.y/2);
        grd.addColorStop(0, '#211F1F');
        grd.addColorStop(0.5, '#3F3C3A');
        grd.addColorStop(1, '#898986');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.moveTo(49,6);
        ctx.bezierCurveTo(42,11, 9,11, 0,6);
        ctx.lineTo(0,44)
        ctx.bezierCurveTo(12,48, 39,48, 49,44);
        ctx.closePath();
        ctx.fill();

    }

    buildingGenerator(howFar, points){
        return createCanvas(new V2(100, 500), function(ctx, size){
            let darkWindows = [[32,64, 74], [53,100,136]]
            let brightWindows = [[93, 158,209], [176,208,223]];
            let windowColors = ['#2D5B80', '#92BDC7', '#2E5061', '#2A4A5D', '#69888A', '#1B363F', '#213D54', '#43799D', '#4D8FBA', '#36687E', '#395059', '#5C95AB'];
            let windowSize = new V2(5,2);
            
            switch(howFar){
                case 0:
                    windowSize = new V2(5,1.5);
                    break;
                case 1: 
                    windowSize = new V2(4, 2);
                    break;
                case 2:
                    windowSize = new V2(3,2.5);
                    break;
            }

            let leftWallStraight = getRandomBool();
            let roofStraight = getRandomBool();
            let rightWallStraight = true;//getRandomBool();

            if(!leftWallStraight){
                let defCount = getRandomInt(1, (6 - howFar));
                let segHeight = size.y/2/defCount;
                let prev = undefined;
                for(let i = 0; i < defCount; i++){
                    let p = new V2( 
                        (prev == undefined ?  0 : prev.x)+getRandom(2, size.x/6)  //getRandom(2, size.x/4)
                        ,(prev == undefined ? size.y/2 - segHeight : prev.y-segHeight)+2);
                    if(i > 0 && getRandomBool()){//i%2 != 0 ){//&& getRandomBool()){
                        p.x = prev.x;
                    }
                    prev = p;
                    points.push(p);
                }
            }
            else {
                points.push(new V2(2, size.y/2));
                points.push(new V2(2, 2));
            }

            let roofDots = [];
            roofDots.push(points[points.length-1]);
            
            if(!roofStraight){
                let defCount = 1;//getRandomInt(1, (1 + howFar));
                let segWidth = size.x/defCount;
                let prev = points[points.length-1];
                
                prev.y = getRandom(2, size.y/10);
                for(let i = 0; i < defCount; i++){
                    let p = new V2(size.x-getRandom(size.x/6, size.x/4), getRandom(2, size.y/10));
                    
                    prev = p;
                    points.push(p);
                    roofDots.push(p);
                }
            }
            else {
                let p = new V2(size.x-2, 2);
                points.push(p);
                roofDots.push(p);
            }

            if(!rightWallStraight){
                let defCount = getRandomInt(1, (6 - howFar));
                let segHeight = (size.y/2 - points[points.length-1].y)/defCount;
                let prev = undefined;

                for(let i = 0; i < defCount; i++){
                    let p = new V2( getRandom(size.x*3/4, size.x-2), (prev == undefined ? points[points.length-1].y + segHeight : prev.y+segHeight));
                    if(i > 0 && getRandomBool()){// && i%2 != 0 ){//&& getRandomBool()){
                        p.x = prev.x;
                    }

                    prev = p;
                    points.push(p);
                }
            }

            points.push(new V2(size.x-2, size.y-2));

            points.push(new V2(2, size.y-2));

            draw(ctx, {
                points: points,//[new V2(0, size.y/2), new V2(size.x/2, 0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)],
                closePath: true,
                strokeStyle: '#1C5561',
                lineWidth: 3
            });
            ctx.save();
            ctx.clip();
            ctx.clearRect(0, 0, size.x, size.y);
            ctx.fillRect(0,0, size.x, size.y);
            //ctx.strokeRect(0,0, size.x, size.y);

            if(true){//if(howFar == 0){
                let rCount = parseInt(size.y/windowSize.y);
                let cCount = parseInt(size.x/windowSize.x);
                for(let ri = 0; ri < rCount; ri++){
                    if(ri%2 == 0)
                        continue;

                    // if(getRandomInt(0,20) === 20)
                    //     continue;

                    for(let ci = 0; ci < cCount; ci++){
                        if(getRandomInt(0,4) === 4)
                            continue;

                        ctx.fillStyle = windowColors[getRandomInt(0, windowColors.length-1)];
                        ctx.fillRect(windowSize.x*ci, windowSize.y*ri, windowSize.x, windowSize.y);
                    }
                }

                let alpha = 0.9 - howFar*0.3;
                if(alpha < 0) alpha = 0;
                ctx.fillStyle = `rgba(26,49,58,${alpha})`
                ctx.fillRect(0,0, size.x, size.y);

                ctx.restore();
                if(howFar < 2){
                    for(let p of roofDots){
                        ctx.fillStyle = 'rgb(250,0,0)';
                        ctx.fillRect(p.x,p.y-1, 3, 2);
                    }
                }
            }
        });
    }

    getRaindropCacheItem(layer, position, destination){
        let cache = this.rainDropCache;
        if(!cache[layer]){
            cache[layer] = [];
        }

        if(cache[layer].length){
            let rd = cache[layer].pop();
            rd.position = position;
            rd.setDestination(destination);
            rd.isVisible = true;
            return true;
        }
        return false;
    }

    midRainDropTimerMethod(){
        for(let i = 0; i < 4; i++){
            let position =new V2(getRandomInt(1, this.viewport.x-1), -10); 
            let destination = new V2(position.x, getRandomInt(this.viewport.y-this.floorSize.y - this.roadSize.y*2/3, this.viewport.y-this.floorSize.y));
            if(!this.getRaindropCacheItem(this.middleRainLayer, position, destination)) 
                this.addGo(new RainDrop({
                    position: position,
                    destination: destination,
                    img: this.midRainDropImg,
                    isBack: true,
                    speed: 10,
                    size: new V2(0.5,8),
                    layer: this.middleRainLayer,
                }), this.middleRainLayer);
        }
    }

    rainDropTimerMethod(){
        for(let i = 0; i < 3; i++){
            let position =new V2(getRandomInt(1, this.viewport.x-1), -10); 
            let destination = new V2(position.x, getRandomInt(this.viewport.y-this.floorSize.y*2/3, this.viewport.y));
            if(!this.getRaindropCacheItem(this.frontalRainLayer, position, destination)) 
                this.addGo(new RainDrop({
                    position: position,
                    destination:destination,
                    img: this.rainDropImg,
                    layer: this.frontalRainLayer,
                }), this.frontalRainLayer);
        }   
    }

    customStreamTimerMethod(){
        let howFar = getRandomInt(0,2);
        let h;
        let size;
        let position;
        let destination;
        let layer;
        let speed;
        //console.log(howFar);
        switch(howFar){
            case 0:
                h = this.backStreamHeight;
                size = this.backStreamSize;
                position = new V2(this.viewport.x, h)
                destination =  new V2(-1, h),
                layer = this.backStreamLayer;
                speed = 0.6;
                break;
            case 1:
                h = this.midStreamHeight;
                size = this.backStreamSize;
                position = new V2(0, h);
                destination =  new V2(this.viewport.x+1, h);
                layer = this.midStreamLayer;
                speed = 0.6;
                break;
            case 2: 
                h = this.frontStreamHeight;
                size = this.fronStreamItemSize;
                position = new V2(0, h);
                destination =  new V2(this.viewport.x+1, h);
                layer = this.frontStreamLayer;
                speed = 1.5;
                break;
        }

        if(getRandomBool()){
            h = getRandom(20, this.viewport.y*1/3);
            position.y = h;
            destination.y = h;
        }

        this.addGo(new StreamItem({
                position: position,
                itemType: 'police',
                img: this.streamItemBrightRedImg,
                brightImg: this.streamItemBlueImg,
                destination: destination,
                size: size,
                speed: speed,
                setDeadOnDestinationComplete: true,
            }), layer);
    }

    backgroundRender(){
        let grd = SCG.contexts.background.createLinearGradient(SCG.viewport.real.width/2, SCG.viewport.real.height, SCG.viewport.real.width/2, 0);
        //grd.addColorStop(0, '#4184AD');
        grd.addColorStop(0, '#316282');
        grd.addColorStop(0.95, '#1A313A');
        grd.addColorStop(1, '#031921');
        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);

        SCG.contexts.background.fillStyle = 'rgb(26,49,58)';
        SCG.contexts.background.fillRect(0,SCG.viewport.real.width/3,SCG.viewport.real.width,SCG.viewport.real.height/3);
    }

    preMainWork(now) {
        if(this.rainDropTimer) {
            doWorkByTimer(this.rainDropTimer, now);
        }

        if(this.midRainDropTimer) {
            doWorkByTimer(this.midRainDropTimer, now);
        }

        if(this.backRainDropTimer) {
            doWorkByTimer(this.backRainDropTimer, now);
        }

        if(this.backStraemTimer) {
            doWorkByTimer(this.backStraemTimer, now);
        }

        if(this.midStraemTimer) {
            doWorkByTimer(this.midStraemTimer, now);
        }

        if(this.frontStreamTimer) {
            doWorkByTimer(this.frontStreamTimer, now);
        }

        if(this.customStreamTimer) {
            doWorkByTimer(this.customStreamTimer, now);
        }

        if(this.deliveryDronsTimer){
            doWorkByTimer(this.deliveryDronsTimer, now);
        }

        if(this.preformanceOptimizationTImer){
            doWorkByTimer(this.preformanceOptimizationTImer, now);
        }
    }

    afterMainWork(){
        if(this.debugging.enabled){
            let ctx = SCG.contexts.main;

            ctx.font = this.debugging.font;
            ctx.textAlign = this.debugging.textAlign;
            ctx.fillStyle = this.debugging.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debugging.position.x, this.debugging.position.y);
        }
        
    }
}

class RainDrop extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                preCheck: function(go) {
                    return this.type !== go.type && this.layer == go.layer;
                },
                onCollision: function(collidedWith, intersection){
                    if(intersection && intersection.length){
                        this.splashPoint = V2.average(intersection);
                    }

                    this.setDestination();
                    //this.setDead();
                }
            },
            speed: 12,
            size: new V2(0.5,10),
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: false,
            splash: true
        }, options);

        super(options);
    }

    // beforeDead(){
    //     this.createSplash();
    // }

    createSplash() {
        let count = this.isBack ? getRandomInt(1,2): getRandomInt(1,3);
        for(let i = 0;i < count; i++)
        {
            this.parentScene.addGo(new Splash({
                isBack: this.isBack,
                cacheKey: getRandomInt(0,999),
                position: this.splashPoint ? this.splashPoint.clone() : this.position.clone(),
                img: this.isBack ? this.parentScene.backSplashImg : this.parentScene.splashImg,
                speed: this.isBack ? getRandom(0.1, 0.13):getRandom(0.09, 0.11),
                coefficients: {
                    a: this.isBack ? getRandom(1,3) : getRandom(2,4),
                    b: this.isBack ? getRandom(3,9) : getRandom(5,12)
                },
                xAxis: {
                    direction: getRandomBool() ? 1: -1
                }
            }), this.layer+1);
        }

        this.splashPoint = undefined;
    }
    destinationCompleteCallBack(){
        let cache = this.parentScene.rainDropCache;
        if(!cache[this.layer]){
            cache[this.layer] = [];
        }

        cache[this.layer].push(this);

        this.isVisible = false;
        if(!this.splash)
            return;

        this.createSplash();
    }
}

class Splash extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            destination: new V2(-100,-100),
            speed:0.05,
            size: new V2(1,1),
            coefficients: {
                a: 3,
                b: 10
            },
            xAxis: {
                current: 0,
                speed: 0.001,
                direction: -1
            },
            yAxis: {
                current: 0,
            },
            positionChangeProcesser: function(){
                let oldPosition = this.position.clone();

                if(this.currentPointIndex >= this.cachedPoints.points.length){
                    this.setDead();
                    return;
                }

                let p = this.cachedPoints.points[this.currentPointIndex];
                this.yAxis.current = p.y;
                this.xAxis.current = p.x;

                this.position = this.initialPosition.add(new V2(this.xAxis.current, this.yAxis.current));

                this.currentPointIndex++;

                return this.position.substract(oldPosition); 
            }
        }, options);

        options.coefficients.a = fastRoundWithPrecision(options.coefficients.a,1);
        options.coefficients.b = fastRoundWithPrecision(options.coefficients.b,1);
        options.speed = fastRoundWithPrecision(options.speed, 1);

        options.xAxis.speed = options.speed;
        if(options.xAxis.direction > 0){
            options.coefficients.b*=-1;
        }

        super(options);

        this.initialPosition = this.position.clone();
        this.cachedPoints = this.isBack ? Splash.yAxisCacheBack[this.cacheKey] : Splash.yAxisCacheFront[this.cacheKey];
        this.currentPointIndex = 0;
    }
}

class StreamItem extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(1,1),
            speed: 0.1,
            setDeadOnDestinationComplete: false,
            setDestinationOnInit: true,
            itemType: 'simple'
        }, options);

        super(options);

        this.originImage = this.img;
        if(this.itemType == 'police'){
            this.setDeadOnDestinationComplete = true;
            this.imgSwitchTimer = createTimer(250, this.imgSwitchTimerMethod, this, true);
        }
        else {
            this.brightTimer = createTimer(getRandomInt(250, 750), this.brightTimerMethod, this, true);
        }
    }

    destinationCompleteCallBack() {
        if(this.setDeadOnDestinationComplete){
            this.setDead();
            return;
        }

        if(this.position.x <= 0){
            this.position.x = this.parentScene.viewport.x+1;
            this.setDestination(new V2(-1, this.position.y));
        }
        else if(this.position.x > this.parentScene.viewport.x){
            this.position.x = -1;
            this.setDestination(new V2(this.parentScene.viewport.x+1, this.position.y));
        }
    }

    imgSwitchTimerMethod(){
        this.bright = !this.bright;
        this.img = this.bright ? this.brightImg : this.originImage;
    }

    brightTimerMethod(){
        if(this.bright)
            return;

        if(getRandomInt(0,50) > 45){
            this.bright = true;
            this.img = this.brightImg;

            this.brightOffTimer = createTimer(getRandomInt(500, 1500), this.brightOffTimerMethod, this, false);
        }
    }

    brightOffTimerMethod(){
        this.brightOffTimer = undefined;
        this.bright = false;
        this.img = this.originImage;
    }

    internalUpdate(now){
        if(this.brightTimer){
            doWorkByTimer(this.brightTimer, now);
        }

        if(this.brightOffTimer){
            doWorkByTimer(this.brightOffTimer, now);
        }

        if(this.imgSwitchTimer){
            doWorkByTimer(this.imgSwitchTimer, now);
        }
    }
}

class AdvertisementScreen extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            color: [255,0,0],
            blinking: {
                enabled: getRandomBool(),
                alpha: 1,
                direction: -1,
                step: getRandom(0.01,0.05),
                border: getRandom(0.1,0.6),
            },
            screenType: getRandomInt(0,2),
            contentType: getRandomInt(0,2),
            shaking: {
                enabled: false
            }
        }, options);

        if(options.blinking.enabled && options.blinking.fast){
            options.blinking.step = getRandom(0.1, 0.4);
        }

        if(options.screenType == 1){
            let w = options.size.x;
            options.size.x = options.size.y;
            options.size.y = w;
        } 
        else if(options.screenType == 2){
            let max = Math.min(options.size.x, options.size.y);
            options.size.x = max;
            options.size.y = max;

            if(options.contentType == 1) {
                options.contentType = 0;
            }
        }

        //options.contentType = getRandomInt(0,1);
        options.img = createCanvas(options.size.mul(3), function(ctx, size){
            if(options.screenType == 0 || options.screenType == 1){
                let t = options.screenType;
                let wh = t == 0 ? size.x*1/4 : size.y*1/4;

                let grd = ctx.createLinearGradient(0, size.y/2, wh, size.y/2); //left
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,wh,wh, size.y-2*wh);
                else 
                    ctx.fillRect(0,wh, wh, size.y*1/2);
    
                grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, wh); //top
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t == 0)
                    ctx.fillRect(wh,0,size.x*1/2, wh);
                else 
                    ctx.fillRect(wh,0,size.x-2*wh, wh);

                if(t==0) //right
                    grd = ctx.createLinearGradient(size.x*3/4, size.y/2, size.x, size.y/2);
                else 
                    grd = ctx.createLinearGradient(size.x-wh, size.y/2, size.x, size.y/2);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t== 0)
                    ctx.fillRect(size.x*3/4,wh,wh, size.y-2*wh);
                else 
                    ctx.fillRect(size.x-wh,wh,wh, size.y*1/2);

                grd = ctx.createLinearGradient(size.x/2, size.y-wh, size.x/2, size.y);//bottom
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t == 0)
                    ctx.fillRect(wh,size.y-wh,size.x*1/2, wh);
                else 
                    ctx.fillRect(wh,size.y*3/4,size.x-2*wh, wh);
    
                grd = ctx.createLinearGradient(0, 0, wh, wh);//topleft
                grd.addColorStop(0.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,0,wh, wh);
                else 
                    ctx.fillRect(0,0,wh, wh);
    
                if(t==0)//topright
                    grd = ctx.createLinearGradient(size.x*3/4, wh, size.x, 0);
                else 
                    grd = ctx.createLinearGradient(size.x-wh, wh, size.x, 0);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t== 0)
                    ctx.fillRect(size.x*3/4,0,wh, wh);
                else
                    ctx.fillRect(size.x-wh,0,wh, wh);
    
                if(t==0) //bottomright
                    grd = ctx.createLinearGradient(size.x*3/4, size.y-wh, size.x, size.y);
                else
                    grd = ctx.createLinearGradient(size.x-wh, size.y-wh, size.x, size.y);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(size.x*3/4,size.y-wh,wh, wh);
                else 
                    ctx.fillRect(size.x-wh,size.y*3/4,wh, wh);
    
                grd = ctx.createLinearGradient(wh, size.y-wh, 0, size.y);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,size.y-wh,wh, wh);
                else
                    ctx.fillRect(0,size.y*3/4,wh, wh);

                let h = size.y/2/6;
                
                if(options.contentType == 0){
                    
                }
                else if(options.contentType == 1) {
                    let from = wh+size.x*1/16;
                    let to = size.x-wh-size.x*1/16;
                    for(let i = 0;i<6;i++){
                        for(let j = from; j < to;j++){
                            if(getRandomBool())
                                ctx.fillRect(j, size.y*1/4+i*h,1, h*2/3);
                        }
                    }
                }
            }
            else if(options.screenType == 2){
                let grd = ctx.createRadialGradient(size.x/2, size.y/2, size.x/4, size.x/2, size.y/2, size.x/2);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                if(options.size.x < 10){
                    grd.addColorStop(0.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`)
                }
                else {
                    grd.addColorStop(0.45, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                    grd.addColorStop(0.5, `rgba(255,255,255, 1)`);
                    grd.addColorStop(0.55, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                }
                
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);

                ctx.fillStyle = grd;
                ctx.fillRect(0,0,size.x, size.y);
                // ctx.strokeStyle = 'yellow';
                // ctx.strokeRect(0,0,size.x, size.y);
            }
            //TODO: other shapes
            
            
            
        })

        super(options);

        if(this.contentType == 0){
            let size;
            let t = this.screenType;
            let wh = t == 0 ? this.size.x*1/4 : this.size.y*1/4;
            if(t==0){
                size = new V2(this.size.x*1/4, this.size.y*2/6)
            }
            else if(t == 2){
                size = new V2(this.size.x*1/2, this.size.y*1/2);
            }
            else {
                size = new V2(this.size.x-4*wh, this.size.y*2/6)
            }

            this.content = new GO({
                position: new V2(0,0),
                size: size,
                img: createCanvas(t == 2 ? new V2(50,50) : new V2(10,10), function(ctx, size){
                    ctx.fillStyle = `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`;

                    if(t == 2){
                        ctx.beginPath();
                        ctx.arc(size.x/2, size.x/2, size.x/2, 0, 2*Math.PI, false);
                        ctx.fill();
                    }
                    else {
                        ctx.fillRect(0,0,size.x, size.y);
                    }
                    
                })
            });

            this.addChild(this.content);

            if(true){
                this.contentAnimationTimer = createTimer(50, this.contentAnimationMethod, this, true);
                this.contentAnimation = {
                    maxX: size.x,
                    maxY: size.y,
                    minX: size.x/8,
                    minY: size.y/8,
                    speedX: (size.x- size.x/8)/10,
                    speedY: (size.y- size.y/8)/10,
                    directionX: -1,
                    directionY: 0
                }
            }
        }
        else if(this.contentType == 2){
            this.content = new GO({
                position: new V2(0,0),
                size: this.screenType == 0 ? new V2(this.size.x/2,this.size.x/2) : new V2(this.size.x/2,this.size.y/2),
            });

            let letters = ['1','2','3','4','5','A','B','C','D','E','Э','Я','Ю','Ъ','Ф','!','?','$','@','#','人','九','个','万','ﻞ','ﺲ','ﻦ','ﻚ'];
            let that = this;
            this.content.images = letters.map((letter) => 
                createCanvas(new V2(40,40), function(ctx, size){
                    ctx.font = '25px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`;
                    ctx.fillText(letter+ (that.screenType==1? letters[getRandomInt(0, letters.length-1)]:''), size.x/2, size.y*3/4);
                }));

            this.content.img = this.content.images[getRandomInt(0,this.content.images.length-1)];
            this.addChild(this.content);
            this.contentLetterChangeTimer = createTimer(getRandomInt(50,250), this.contentLetterChangeMethod, this, true);
        }

        if(this.blinking.enabled){
            this.blinkingTimer = createTimer(getRandomInt(50,150), this.blinkingTimerMethod, this, true);
        }
    }

    contentLetterChangeMethod() {
        this.content.img = this.content.images[getRandomInt(0,this.content.images.length-1)];
    }

    contentAnimationMethod(){
        let ca = this.contentAnimation;
        this.content.size.x+=ca.directionX*ca.speedX;
        this.content.size.y+=ca.directionY*ca.speedY;

        if(this.content.size.x < ca.minX){
            this.content.size.x = ca.minX;
            ca.directionX=1;
        }

        if(this.content.size.x > ca.maxX){
            this.content.size.x = ca.maxX;
            ca.directionX = 0;
            ca.directionY = -1;
        }

        if(this.content.size.y < ca.minY){
            this.content.size.y = ca.minY;
            ca.directionY = 1;
        }

        if(this.content.size.y > ca.maxY){
            this.content.size.y = ca.maxY;
            ca.directionY = 0;
            ca.directionX = -1;
        }

        this.needRecalcRenderProperties = true;
    }

    blinkingTimerMethod(){
        let b = this.blinking;
        b.alpha+=b.direction*b.step;

        if(b.alpha > 1){
            b.alpha = 1;
            b.direction*=-1;
        }

        if(b.alpha < b.border){
            b.alpha = b.border;
            b.direction*=-1;
        }
    }

    internalUpdate(now){
        if(this.blinking.enabled){
            doWorkByTimer(this.blinkingTimer, now);
        }

        if(this.contentAnimationTimer){
            doWorkByTimer(this.contentAnimationTimer, now);
        }

        if(this.contentLetterChangeTimer){
            doWorkByTimer(this.contentLetterChangeTimer, now);
        }
    }

    internalPreRender() {
        this.context.save();
        this.context.globalAlpha = this.blinking.alpha;
    }

    internalRender(){
        this.context.restore();
    }
}

class Robot extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            robotType: 0,
            thrusterAngle: 0,
            maxSpeed: 1,
            maxAngle: 45,
            setDeadOnDestinationComplete: true,
            cargoType: getRandomInt(0, Robot.cargoTypesBarcodeImages.length-1), 
            flip: false,
            collisionDetection: {
                enabled: true,
            },
            swinging: {
                currentXdegree: 0, 
                currentY: 0,
                degreeStep: 5,
            },
            thrusterPowerPropulsion: {
                originalSize: undefined,
                originalPosition: undefined,
                current: 100, 
                max: 100,
                min: 50, 
                step: 4,
                direction: -1
            }
        }, options);

        super(options);

        this.collisionDetection.circuit = [
            new V2(-this.size.x/2+this.size.x/14, -this.size.y/2-this.size.y/10), new V2(this.size.x/14, -this.size.y/2-this.size.y/10), 
            new V2(this.size.x/14, -this.size.y/4), new V2(this.size.x/3, -this.size.y/4), new V2(this.size.x/2, 0)];

        if(this.flip) {
            this.collisionDetection.circuit = this.collisionDetection.circuit.map(point => {
                point.x = -point.x;
                return point;
            })
        }

        let that = this;

        this.cargo = new GO({
            position: new V2(-this.size.x/4+this.size.x/16, -this.size.y/4),
            size: new V2(this.size.x/2, this.size.y*3/4),
            img: Robot.cargoTypesBarcodeImages[this.cargoType]//Robot.cragoTypesImages[this.cargoType]
        });

        this.addChild(this.cargo);

        this.body = new GO({
            position: new V2(-this.size.x/4+this.size.x/16, -this.size.y/4+this.size.y/8),
            size: new V2(this.size.x/2, this.size.y/2),
            img: createCanvas(new V2(100, 100), function(ctx, size){
                if(that.robotType == 0){
                    ctx.fillStyle = '#395463';
                    ctx.fillRect(0,0, 10, size.y);
                    ctx.fillStyle = '#24363F';
                    ctx.fillRect(0,size.y-20, size.x, 20);
                }
                else if(that.robotType == 1){
                    draw(ctx, {
                        closePath: true,
                        fillStyle: '#316839',
                        points: [new V2(0, 100), new V2(0, 25), new V2(100, 80), new V2(100, 100)]
                    });

                    ctx.fillStyle = '#1A381E';
                    ctx.fillRect(0,size.y-20, size.x, 20);
                }
            })
        });

        //rear leds
        if(!Robot.rearLedImg){
            Robot.rearLedImg = createCanvas(new V2(100, 100), function(ctx, size){
                let grd = ctx.createRadialGradient(size.x*3/4, size.y/2, 5, size.x*1/3, size.y/2, 50);
                grd.addColorStop(0, 'rgba(209,137,51, 1)');
                grd.addColorStop(0.1, 'rgba(190,50,25, 1)');
                grd.addColorStop(0.5, 'rgba(190,50,25, 0.2)');
                grd.addColorStop(0.8, 'rgba(190,50,25, 0)');
                // ctx.scale(1,0.5);
                // ctx.translate(0,size.y/2);
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            });
        }
        

        this.rearLeds = [
            new Led({
                position: new V2(-this.body.size.x/2-this.body.size.x/12, this.size.y/6),
                size: new V2(5,10),
                img: Robot.rearLedImg,
                blinking: {
                    enabled: false
                }
            }),
            new Led({
                position: new V2(-this.body.size.x/2-this.body.size.x/12, -this.size.y/6),
                size: new V2(5,10),
                img: Robot.rearLedImg,
                blinking: {
                    enabled: false
                }
            })
        ]

        this.body.addChild(this.rearLeds[0])
        this.body.addChild(this.rearLeds[1])

        this.addChild(this.body);

        this.head = new GO({
            position: new V2(this.size.x*3/4-this.size.x/2, 0),
            size: new V2(this.size.x/2, this.size.y),
            img: createCanvas(new V2(100, 100), function(ctx, size){
                if(that.robotType == 0){
                    let grd = ctx.createLinearGradient(size.x/2, size.y/2-size.y/8, size.x*3/4, 0);
                    grd.addColorStop(0, '#395463')
                    grd.addColorStop(1, '#8CCEF5')
                    ctx.fillStyle = grd;//'green';
                    ctx.beginPath();
                    ctx.moveTo(0, size.y/2);
                    ctx.bezierCurveTo(30, 10, 70, 10, size.x, size.y/2);
                    ctx.closePath();
                    ctx.fill();
    
                    //grd = ctx.createLinearGradient(size.x/2, size.y*1/3, size.x*1/4, size.y);
                    grd = ctx.createLinearGradient(size.x/2, size.y/2-size.y/8, size.x*1/3, size.y*3/4);
                    grd.addColorStop(0, '#24363F')
                    grd.addColorStop(1, '#395463')
                    ctx.fillStyle = grd;//'darkgreen';
                    ctx.beginPath();
                    ctx.moveTo(10, size.y/2);
                    ctx.bezierCurveTo(35, 80, 65, 80, 90, size.y/2);
                    ctx.closePath();
                    ctx.fill();
                }
                else if(that.robotType == 1){
                    let grd = ctx.createLinearGradient(size.x*2/3, size.y/2-size.y/8, size.x*7/8, 0);
                    grd.addColorStop(0, '#316839')
                    grd.addColorStop(1, '#5FCC70')
                    draw(ctx, {
                        closePath: true,
                        fillStyle: grd,
                        points: [new V2(0,30),new V2(10,20), new V2(75,20), new V2(100, 35), new V2(100, 50), new V2(0, 50)]
                    })

                    grd = ctx.createLinearGradient(size.x/2, size.y/2-size.y/8, size.x*1/3, size.y*3/4);
                    grd.addColorStop(0, '#1A381E')
                    grd.addColorStop(1, '#316839')
                    draw(ctx, {
                        closePath: true,
                        fillStyle: grd,
                        points: [new V2(20,50), new V2(80,50), new V2(80, 65), new V2(50, 75), new V2(20, 75)]
                    })
                }
                
                //ctx.fillRect(0,0, size.x, size.y);
            })
        });

        //frontal leds
        if(!Robot.frontalLedImg){
            Robot.frontalLedImg = createCanvas(new V2(100, 100), function(ctx, size){
                let grd = ctx.createRadialGradient(size.x/4, size.y/2, 5, size.x/2, size.y*2/3, 50);
                grd.addColorStop(0, 'rgba(160,255,255, 1)');
                grd.addColorStop(0.01, 'rgba(255,255,255, 1)');
                grd.addColorStop(0.5, 'rgba(0,0,255, 0.2)');
                grd.addColorStop(0.8, 'rgba(0,0,255, 0)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            });
        }
        
        
        this.frontalLeds = [
            new Led({
                position: this.robotType == 0 ? new V2(this.head.size.x*1/3, this.head.size.y/12)
                          : (this.robotType == 1 ? new V2(this.head.size.x*1/2, -this.head.size.y/16) 
                          : undefined),
                size: new V2(5,5),
                img: Robot.frontalLedImg,
                blinking: {
                    step: 0.1
                },
                fadeInPause: 500,
                fadeOutPause: 5000,
                autoStartFadeOut: 5000
            }),
            new Led({
                position: this.robotType == 0 ? new V2(this.head.size.x*1/6, this.head.size.y/7)
                        : (this.robotType == 1 ? new V2(this.head.size.x*1/3, -this.head.size.y/16) 
                          : undefined),
                size: new V2(5,5),
                img: Robot.frontalLedImg,
                blinking: {
                    step: 0.1
                },
                fadeInPause: 500,
                fadeOutPause: 5000,
                autoStartFadeOut: 5500
            }),
            new Led({
                position: this.robotType == 0 ? new V2(this.head.size.x*0, this.head.size.y/6)
                        : (this.robotType == 1 ? new V2(this.head.size.x*1/6, -this.head.size.y/16) 
                          : undefined),
                size: new V2(5,5),
                img: Robot.frontalLedImg,
                blinking: {
                    step: 0.1
                },
                fadeInPause: 500,
                fadeOutPause: 5000,
                autoStartFadeOut: 6000
            })
        ];

        this.head.addChild(this.frontalLeds[0]);
        this.head.addChild(this.frontalLeds[1]);
        this.head.addChild(this.frontalLeds[2]);

        this.addChild(this.head);


        this.thrusterAngle = (this.maxAngle/this.maxSpeed)*this.speed;

        this.thruster = new GO({
            angle: this.thrusterAngle,
            position: new V2(0, 0),
            size: new V2(this.size.x/3, this.size.y/4),
            img: createCanvas(new V2(100, 100), function(ctx, size){
                if(that.robotType == 0){
                    let grd = ctx.createLinearGradient(size.x/2, -size.y*2/4, size.x/2, size.y);
                    grd.addColorStop(0, '#8CCEF5')
                    grd.addColorStop(1, '#24363F')
                    ctx.fillStyle = grd;//'red';
                    
                    ctx.beginPath();
                    ctx.moveTo(10,100);
                    ctx.bezierCurveTo(0, 70, 0, 30, 10, 0);
                    ctx.lineTo(90, 0);
                    ctx.bezierCurveTo(100, 30, 100, 70, 90, 100);
                    ctx.closePath();
                    ctx.fill();
                }
                else if(that.robotType == 1){
                    let grd = ctx.createLinearGradient(size.x/2, -size.y*2/4, size.x/2, size.y);
                    grd.addColorStop(0, '#316839')
                    grd.addColorStop(1, '#1A381E')
                    draw(ctx,{
                        closePath: true,
                        fillStyle: grd,
                        points: [new V2(0, 0), new V2(50, 0), new V2(100, 50), new V2(100, 100), new V2(0, 100)]
                    });
                }
                
            }),
            internalPreRender() {
                //this.context.save();
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
                //this.context.restore();
            }
        });

        this.thrusterPowerColor = this.robotType == 0 ? '122,187,249' : 
                                  (this.robotType == 1 ? '255, 128, 0' : undefined);
        this.thrusterPower = new GO({
            position: new V2(0,this.thruster.size.y+this.thruster.size.y*1/2),
            size: new V2(this.thruster.size.x*0.8, this.thruster.size.y*2),
            img: createCanvas(new V2(100, 100), function(ctx, size){
                let grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, size.y);
                grd.addColorStop(0, 'rgba('+that.thrusterPowerColor+', 1)');
                grd.addColorStop(0.3, 'rgba('+that.thrusterPowerColor+', 0.4)');
                grd.addColorStop(1, 'rgba('+that.thrusterPowerColor+', 0)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            })
        });

        this.thruster.addChild(this.thrusterPower);

        //shadow
        let shadowPosition = new V2(0, this.size.x/4);
        this.shadow = new GO({
            position: shadowPosition,
            originalPosition: shadowPosition.clone(),
            size: new V2(this.size.x*0.7, this.size.y*0.15),
            img: createCanvas(new V2(50,50), function(ctx, size){
                let grd = ctx.createRadialGradient(size.x/2, size.y/2, size.x/6, size.x/2, size.y/2, size.x/2);
                grd.addColorStop(0, 'black'),
                grd.addColorStop(0.5, 'rgba(0,0,0, 0.5)'),
                grd.addColorStop(1, 'rgba(0,0,0, 0)')

                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);
            })
        });

        this.addChild(this.shadow);

        if(!Robot.sideLedImg){
            Robot.sideLedImg = createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#88F854';
                ctx.fillRect(0,0, size.x, size.y);
            });
        }
        this.sideLeds = [
            new Led({
                position: new V2(-this.size.x/10,0),
                size: new V2(1,1),
                img: Robot.sideLedImg,
                blinking: {
                    step: 0.2
                },
                autoStartFadeOut: 100,
                fadeInPause: 50,
                fadeOutPause: 50
            })
        ];
        
        this.thruster.addChild(this.sideLeds[0]);
        this.addChild(this.thruster);

        this.originalPosition = this.position.clone();
        this.thrusterPowerPropulsion.originalSize = this.thrusterPower.size.clone();
        this.thrusterPowerPropulsion.originalPosition = this.thrusterPower.position.clone();
        this.swingingTimer = createTimer(100, this.swingingTimerMethod, this, true);
        this.thrusterPowerPropulsionTimer = createTimer(50, this.thrusterPowerPropulsionTimerMethod, this, true);

        //this.startSpeedChange(0.1);
    }

    startSpeedChange(newSpeed) {
        this.speedChange = {
            max: newSpeed,
            current: this.speed,
            step: (newSpeed - this.speed)/30,
            angleStep: (this.maxAngle - this.thruster.angle)/30
        }

        this.speedChangeTimer = createTimer(30, this.speedChangeTimerMethod, this, true);
    }

    speedChangeTimerMethod(){
        this.speed+=this.speedChange.step;
        this.thruster.angle+=this.speedChange.angleStep;

        if(this.speed > this.speedChange.max){
            this.speed = this.speedChange.max;
            this.speedChangeTimer = undefined;
        }

        if(this.angle > this.maxAngle){
            this.angle = this.maxAngle;
        }

        this.needRecalcRenderProperties = true;
    }

    thrusterPowerPropulsionTimerMethod(){
        let tpp = this.thrusterPowerPropulsion;

        let tppCur = tpp.current/100;
        this.thrusterPower.size.y = this.thrusterPowerPropulsion.originalSize.y*tppCur;
        this.thrusterPower.position.y = this.thruster.size.y/2+this.thrusterPower.size.y/2;

        tpp.current+=tpp.direction*tpp.step;
        if(tpp.current < tpp.min){
            tpp.current = tpp.min;
            tpp.direction = 1;
        }
        else if(tpp.current > tpp.max){
            tpp.current = tpp.max;
            tpp.direction = -1;
        }

        this.needRecalcRenderProperties = true;
    }

    swingingTimerMethod() {
        let shift = fastRoundWithPrecision(Math.sin(degreeToRadians(this.swinging.currentXdegree))*2, 5);
        this.position.y = this.originalPosition.y +  shift;
        this.shadow.position.y = this.shadow.originalPosition.y - shift;
        this.swinging.currentXdegree+=this.swinging.degreeStep;
        if(this.swinging.currentXdegree > 360){
            this.swinging.currentXdegree = 0;
        }

        this.needRecalcRenderProperties = true;
    }

    internalUpdate(now){
        if(this.swingingTimer){
            doWorkByTimer(this.swingingTimer, now);
        }

        if(this.thrusterPowerPropulsionTimer){
            doWorkByTimer(this.thrusterPowerPropulsionTimer, now);
        }

        if(this.speedChangeTimer){
            doWorkByTimer(this.speedChangeTimer, now);
        }

        if((this.flip && this.position.x < this.destination.x) || (!this.flip && this.position.x > this.destination.x)){
            this.setDead();
        }
        

        // if(this.special){
        //     console.log(this.cargo.renderSize);
        // }
    }

    internalPreRender() {
        this.originImageSmoothingEnabled = this.context.imageSmoothingEnabled;
        this.originImageSmoothingQuality = this.context.imageSmoothingQuality;

        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';

        if(this.flip){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.scale(-1, 1);        
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }

    internalRender(){
        this.context.imageSmoothingEnabled = this.originImageSmoothingEnabled;
        this.context.imageSmoothingQuality = this.originImageSmoothingQuality;

        if(this.flip){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.scale(-1, 1);
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }

        // let scale = SCG.viewport.scale;
        // let cdBoxTLRender = this.collisionDetection.box.topLeft.mul(scale);
        // this.context.strokeStyle = '#00BFFF';
        // this.context.strokeRect(cdBoxTLRender.x, cdBoxTLRender.y, this.collisionDetection.box.width*scale, this.collisionDetection.box.height*scale);
        // let position = this.position;
        // draw(
        //     this.context, 
        //     {
        //         lineWidth: 2,
        //         strokeStyle: 'red',
        //         closePath: true,
        //         points: this.collisionDetection.circuit.map((item) => item.add(position).mul(scale))
        //     }
        // )
        
    }
}

class Led extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            blinking: {
                enabled: true,
                alpha: 1,
                direction: -1,
                step: 0.01,
                border: 0,
            },
            autoStartFadeOut: -1,
            fadeInPause: 500,
            fadeOutPause: 500
        }, options);

        super(options);

        if(this.blinking.enabled && this.autoStartFadeOut != -1){
            this.startFadeOut(this.autoStartFadeOut);
        }
    }

    startFadeOut(delay){
        if(!this.blinking.enabled)
            return; 

        let that = this;
        this.startFadeOutTimer = createTimer(delay || this.fadeOutPause, function() {
            this.startFadeOutTimer  = undefined;
            this.fadeOutTimer = createTimer(50, this.fadeInOutMethod, that, true);
        }, this, false);
    }

    startFadeIn(){
        if(!this.blinking.enabled)
            return; 

        let that = this;
        this.startFadeInTimer = createTimer(this.fadeInPause, function() {
            this.startFadeInTimer  = undefined;
            this.fadeOutTimer = createTimer(50, this.fadeInOutMethod, that, true);
        }, this, false);
    }

    fadeInOutMethod(){
        if(!this.blinking.enabled)
            return; 

        let b = this.blinking;
        
        b.alpha+=b.direction*b.step;

        if(b.alpha < b.border){
            b.alpha = b.border;
            b.direction = 1;
            this.fadeOutTimer = undefined;
            this.fadeInTimer = undefined;
            this.startFadeIn();
        }

        if(b.alpha > 1){
            b.alpha = 1;
            b.direction = -1;
            this.fadeOutTimer = undefined;
            this.fadeInTimer = undefined;
            this.startFadeOut();
        }
    }

    internalUpdate(now){
        if(this.blinking.enabled)
        {
            if(this.startFadeInTimer){
                doWorkByTimer(this.startFadeInTimer, now);
            }
    
            if(this.startFadeOutTimer){
                doWorkByTimer(this.startFadeOutTimer, now);
            }
    
            if(this.fadeInTimer){
                doWorkByTimer(this.fadeInTimer, now);
            }
    
            if(this.fadeOutTimer){
                doWorkByTimer(this.fadeOutTimer, now);
            }    
        } 
    }

    internalPreRender() {
        this.originContextGlobalAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.blinking.alpha;
    }

    internalRender(){
        this.context.globalAlpha = this.originContextGlobalAlpha;
    }
}

// Robot.cargoTypes = ['Food', 'Guns', 'Meds', 'Еда', 'Пухи', 'Мёд', '食物', '武器', '药', 'الطعام', 'سلاح', 'دواء' ]
// Robot.cragoTypesImages = Robot.cargoTypes.map((type) => createCanvas(new V2(100, 100), function(ctx, size){
//     let grd = ctx.createLinearGradient(size.x, 0, 0, size.y);
//     grd.addColorStop(0, '#CFA26A')
//     grd.addColorStop(1, '#705638')
//     ctx.fillStyle = grd;
//     ctx.fillRect(0,0, size.x, size.y);
//     ctx.fillStyle = '#F3E2C9';
//     ctx.fillRect(0,0, size.x, 2);
//     ctx.fillRect(size.x-2,0, size.x, size.y);

//     ctx.translate(size.x/2, size.y/2);
//     ctx.rotate(degreeToRadians(-35));
//     ctx.translate(-size.x/2, -size.y/2);
//     ctx.font = '25px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillStyle = `#443527`;
//     ctx.fillText(type, size.x/2, size.y/2);

// }));

Robot.cargoTypesBarcodeImages = [...Array(20).keys()].map((item) => 
    createCanvas(new V2(100, 100), function(ctx, size){
        let grd = ctx.createLinearGradient(size.x, 0, 0, size.y);
        grd.addColorStop(0, '#CFA26A')
        grd.addColorStop(1, '#705638')
        ctx.fillStyle = grd;
        ctx.fillRect(0,0, size.x, size.y);
        ctx.fillStyle = '#F3E2C9';
        ctx.fillRect(0,0, size.x, 2);
        ctx.fillRect(size.x-2,0, size.x, size.y);

        let barsCount = 20;
        let itemWidth = (size.x*3/4)/barsCount;
        ctx.fillStyle = 'black';
        for(let i = 0; i < barsCount; i++){
            ctx.fillRect(10 + itemWidth*i, 10, getRandomBool() ? itemWidth*3/4 : itemWidth*1/4, 30);
        }
    })
)