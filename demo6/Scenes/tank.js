class TankScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
            
        }, options);

        super(options);

        let that = this;
        this.movementSpeed = 0.5;

        this.trailImg = createCanvas(new V2(3,1), function(ctx, size){
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.fillRect(0,0, size.x*1/3, size.y);
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(size.x*1/3,0, size.x*1/3, size.y);
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(size.x*2/3,0, size.x*1/3, size.y);
        });

        this.smokeCloudImg = createCanvas(new V2(10, 10), function(ctx, size) {
            ctx.beginPath();
            ctx.arc(size.x/2, size.y/2, size.x/2, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'black';
            ctx.fill();
        });

        this.tankConturStrokeColor = '#2C3D07';
        this.tankSize = new V2(50, 30);
        this.trailSize = new V2(2, this.tankSize.y/4);
        this.tankPosition = new V2(this.viewport.x/3, this.viewport.y/2);
        this.tank = new Tank({
            position: this.tankPosition,
            size: this.tankSize,
            bodyImg: createCanvas(this.tankSize, function(ctx, size) {
                ctx.fillStyle = '#5F8710';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.fillStyle = '#51720D';
                ctx.fillRect(0, 0, size.x, size.y*1/4);
                ctx.fillRect(0, size.y*3/4, size.x, size.y*1/4);
                ctx.strokeStyle = that.tankConturStrokeColor;
                ctx.strokeRect(0, 0, size.x, size.y*1/4);
                ctx.strokeRect(0, size.y*3/4, size.x, size.y*1/4);
            }),
            towerImg: createCanvas(this.tankSize, function(ctx, size) {
                // ctx.fillStyle = 'red';
                // ctx.fillRect(size.x/4,size.y/4, size.x/4, size.y/2);

                draw(ctx, { fillStyle:  '#5F8710', strokeStyle: that.tankConturStrokeColor, 
                    points: [ new V2(0, size.y*1/4), new V2(size.x*3/5, 0), new V2(size.x, size.y*1/5), 
                        new V2(size.x, size.y*4/5), new V2(size.x*3/5, size.y), new V2(0, size.y*3/4) ]})

                let upperYDelta = size.y*0.15;
                draw(ctx, { fillStyle:  '#51720D', strokeStyle: that.tankConturStrokeColor, 
                    points: [ new V2(0, size.y*1/4+upperYDelta), new V2(size.x*3/5, 0+upperYDelta), new V2(size.x, size.y*1/5+upperYDelta), 
                        new V2(size.x, size.y*4/5-upperYDelta), new V2(size.x*3/5, size.y-upperYDelta), new V2(0, size.y*3/4-upperYDelta) ]});

                draw(ctx, {strokeStyle: ctx.strokeStyle = that.tankConturStrokeColor, closePath: false, points: [new V2(size.x*3/5, 0), new V2(size.x*3/5, 0+upperYDelta)]})
                draw(ctx, {strokeStyle: ctx.strokeStyle = that.tankConturStrokeColor, closePath: false, points: [new V2(size.x*3/5, size.y), new V2(size.x*3/5, size.y-upperYDelta)]})
            }),
            
        });

        this.addGo(this.tank, 10);

        // this.addGo(new Crater({
        //     img: this.cratersGenerator(new V2(50, 50)),
        //     size: new V2(30,30),
        //     position: new V2(this.viewport.x/2, this.viewport.y/3),
        //     speed: this.movementSpeed
        // }),9)

        this.trailTimer = createTimer(200, this.trailTimerMethod, this, false);
        this.craterGenerationTimer = createTimer(1000, this.craterGenerationTimerMethod, this, true);
        this.lanskapeGeneratorTimer = createTimer(2000, this.lanscapeGeneratorTimerMethod, this, true);
        
    }

    lanscapeGeneratorTimerMethod(){
        let landSkapeColors = [{fillStyle: '#A37746', strokeStyle: '#825C39'}, {fillStyle: '#DBA94A', strokeStyle: '#AD853A'}, {fillStyle: '#E3C891', strokeStyle: '#AD986E'},
                                {fillStyle: '#ACBA39', strokeStyle: '#848E2C'}, {fillStyle: '#EFF583', strokeStyle: '#C2C66B'}
                                , {fillStyle: '#839009', strokeStyle: '#5B6306'}, {fillStyle: '#235420', strokeStyle: '#153313'}];

        let size = new V2(getRandom(200,500), getRandom(200, 500));
        let position = new V2(this.viewport.x + size.x, getRandom(0, this.viewport.y));

        this.addGo(new MovingGO({
            img: createCanvas(new V2(200, 200), function(ctx, size){
                let colors = landSkapeColors[getRandomInt(0, landSkapeColors.length-1)];
                draw(ctx, { fillStyle: colors.fillStyle, strokeStyle: colors.strokeStyle, 
                    points: [ new V2(getRandom(0, size.x/3), getRandom(0, size.y/3)), new V2(getRandom(size.x*2/3, size.x), getRandom(0, size.y/3)),
                              new V2(getRandom(size.x*2/3, size.x), getRandom(size.y*2/3, size.y)), new V2(getRandom(0, size.x/3), getRandom(size.y*2/3, size.y))] });
            }),
            position: position,
            size: size,
            speed: this.movementSpeed,
            setDeadOnDestinationComplete: true,
            setDestinationOnInit: true,
            destinationCompleteCheck: function(){
                return this.position.x < -1 - this.size.x;
            },
            destination: new V2(-1 - size.x, position.y)
        }),7)
    }

    craterGenerationTimerMethod(){
        let size = getRandom(10, 30);
        let upper = getRandomBool();
        let posY = getRandom(-this.viewport.y/6, this.viewport.y/6) + this.viewport.y * (upper ? 1 : 5)/6;
        this.addGo(new Crater({
            img: this.cratersGenerator(new V2(50, 50)),
            size: new V2(size,size),
            position: new V2(this.viewport.x + 40,  posY),
            speed: this.movementSpeed,
            smokeGeneration: {
                enabled: getRandomBool()
            }
        }),9)
    }

    trailTimerMethod(){
        this.addGo(new Trail({
            position: new V2(this.tankPosition.x - this.tankSize.x/2, this.tankPosition.y-this.tankSize.y/2+this.trailSize.y/2),
            size: this.trailSize,
            speed: this.movementSpeed,
            img: this.trailImg
        }), 9);

        this.addGo(new Trail({
            position: new V2(this.tankPosition.x - this.tankSize.x/2, this.tankPosition.y+this.tankSize.y/2-this.trailSize.y/2),
            size: this.trailSize,
            speed: this.movementSpeed,
            img: this.trailImg
        }), 9);
    }

    cratersGenerator(craterSize){
        return createCanvas(craterSize, function(ctx, size){
            let up = V2.up;

            let degreeStep = getRandomInt(15,25);
            let currentAngleDegree = 0;
            let maxR = size.x/2;
            let midR = maxR*0.75;
            let darknessMin = 0.1;
            let darknesMax = 0.5;
            let isInnerDark = true;
            let currentDarkness = darknessMin;
            let darknessChangeDirection = 1;
            let lightnessChangeDirection = 1;
            let darknessStep =(darknesMax - darknessMin)/ (360/4/degreeStep);
            let lighnessMin = 0.1;
            let lighnessMax = 0.5;
            let currentlighness = lighnessMin;
            let lighnessStep =(lighnessMax - lighnessMin)/ (360/4/degreeStep);

            let innerCraterPoints = [];
            let outerCraterPoints = [];

            let center = new V2(size.x/2, size.y/2);

            while(currentAngleDegree < 359){
                let p = [];
                let pOuter = [];
                p.push(center.clone());
                
                let inner2 = innerCraterPoints.length == 0 
                    ? up.rotate(currentAngleDegree, false).mul(midR+getRandom(-size.x/20, size.x/20)).add(center) 
                    : innerCraterPoints[innerCraterPoints.length-1].points[2];
                p.push(inner2);
                pOuter.push(inner2);
                pOuter.push(outerCraterPoints.length == 0 
                    ? up.rotate(currentAngleDegree, false).mul(maxR+getRandom(-size.x/20, size.x/20)).add(center)
                    : outerCraterPoints[outerCraterPoints.length-1].points[2]);
                currentAngleDegree+=degreeStep;
                pOuter.push(up.rotate(currentAngleDegree, false).mul(maxR+getRandom(-size.x/20, size.x/20)).add(center));
                let inner3 = up.rotate(currentAngleDegree, false).mul(midR+getRandom(-size.x/20, size.x/20)).add(center);
                p.push(inner3);
                pOuter.push(inner3);

                let innerColor;
                let outerColor;

                if(isInnerDark){
                    innerColor = 'rgba(0,0,0, '+ currentDarkness +')'
                    outerColor = 'rgba(255,255,255, '+ currentDarkness*0.5 +')'
                    currentDarkness+= darknessChangeDirection * darknessStep;
                    if(currentDarkness >= darknesMax){
                        darknessChangeDirection = -1;
                    }
                    else if(currentDarkness <= darknessMin){
                        isInnerDark = false;
                    }
                }
                else {
                    innerColor = 'rgba(255,255,255, '+ currentlighness*0.5 +')';
                    outerColor = 'rgba(0,0,0, '+ currentlighness +')'

                    currentlighness+= lightnessChangeDirection * lighnessStep;
                    if(currentlighness >= lighnessMax){
                        lightnessChangeDirection = -1;
                    }
                    else if(currentlighness <= lighnessMin){
                        isInnerDark = true;
                    }
                }

                innerCraterPoints.push({points:p, color: innerColor});
                outerCraterPoints.push({points:pOuter, color: outerColor});
            }

            innerCraterPoints[innerCraterPoints.length-1].points[2] = innerCraterPoints[0].points[1];
            outerCraterPoints[outerCraterPoints.length-1].points[2] = outerCraterPoints[0].points[1];
            outerCraterPoints[outerCraterPoints.length-1].points[3] = outerCraterPoints[0].points[0];

            for(let inner of innerCraterPoints){
                draw(ctx, {strokeStyle: ['#814f3e', inner.color], fillStyle: ['#814f3e',inner.color], points: inner.points, closePath: true});
            }

            for(let outer of outerCraterPoints){
                draw(ctx, {strokeStyle: ['#814f3e',outer.color], fillStyle: ['#814f3e',outer.color], points: outer.points, closePath: true});
            }
        });
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = '#814f3e';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        if(this.trailTimer)
            doWorkByTimer(this.trailTimer, now);

        if(this.craterGenerationTimer)
            doWorkByTimer(this.craterGenerationTimer, now);

        if(this.lanskapeGeneratorTimer)
            doWorkByTimer(this.lanskapeGeneratorTimer, now);
    }
}

class Tank extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(50, 30),
            towerRotation: 0
        }, options);

        super(options);
    }

    init() {
        let that = this;
        this.body = new GO({
            size: this.size.clone(),
            position: new V2(),
            img: this.bodyImg
        });

        this.body.size.x*= 0.8

        this.addChild(this.body);

        this.tower = new GO({
            size: new V2(this.size.x/2, this.size.y*3/4),
            position: new V2(),
            img: this.towerImg,
            rotation: {
                angle: this.towerRotation
            },
            // internalRender() {
            //     draw(this.context, { strokeStyle: 'white', points: [this.renderBox.topLeft, this.renderBox.topRight, this.renderBox.bottomRight, this.renderBox.bottomLeft] });
            // }
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
        });

        this.rearTowerBevelSize = new V2(this.tower.size.x/8, this.tower.size.y);
        this.rearTowerBevel = new GO({
            size: this.rearTowerBevelSize.clone(),
            position: new V2(-this.tower.size.x*7/16, 0),
            img: createCanvas(new V2(this.tower.size.x/8,this.tower.size.y), function(ctx, size){
                draw(ctx, {fillStyle: '#425B0B', strokeStyle: that.parentScene.tankConturStrokeColor, points: [new V2(0, size.y*1/4), new V2(size.x, size.y*1/4 + size.y*0.15), new V2(size.x, size.y*3/4 - size.y*0.15), new V2(0, size.y*3/4)] })
            })
        })

        this.tower.addChild(this.rearTowerBevel);

        this.frontTowerBevelSize = new V2(this.tower.size.x/4, this.tower.size.y);
        this.frontTowerBevel = new GO({
            size: this.frontTowerBevelSize.clone(),
            position: new V2(this.tower.size.x*6/16, 0),
            img: createCanvas(new V2(this.tower.size.x/8,this.tower.size.y), function(ctx, size){
                draw(ctx, {fillStyle: '#669111', strokeStyle: that.parentScene.tankConturStrokeColor, 
                points: [new V2(0, size.y*1/7 + size.y*0.15), new V2(size.x, size.y*1/6), new V2(size.x, size.y*5/6), new V2(0, size.y*6/7 - size.y*0.15)] })
            })
        })

        this.tower.addChild(this.frontTowerBevel);

        this.addChild(this.tower);

        this.rearBevelSize = new V2(this.size.x/8, this.size.y);
        this.rearBevel = new GO({
            size: this.rearBevelSize.clone(),
            position: new V2(-this.size.x*7/16, 0),
            img: createCanvas(new V2(this.size.x/8,this.size.y), function(ctx, size){
                ctx.fillStyle = '#425B0B';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.strokeStyle = that.parentScene.tankConturStrokeColor;
                ctx.strokeRect(0, 0, size.x, size.y*1/4);
                ctx.strokeRect(0, size.y*3/4, size.x, size.y*1/4);
            })
        })

        this.addChild(this.rearBevel);

        this.frontBevelSize = new V2(this.size.x/8, this.size.y);
        this.frontBevel = new GO({
            size: this.frontBevelSize.clone(),
            position: new V2(this.size.x*7/16),
            img: createCanvas(new V2(this.size.x/8,this.size.y), function(ctx, size){
                ctx.fillStyle = '#669111';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.strokeStyle = that.parentScene.tankConturStrokeColor;
                ctx.strokeRect(0, 0, size.x, size.y*1/4);
                ctx.strokeRect(0, size.y*3/4, size.x, size.y*1/4);
            })
        })

        this.addChild(this.frontBevel);
        
        this.tiltTimer = createTimer(100, this.tiltTimerMethod, this, true);
        this.tilt = {
            current: 0,
            direction: 1,
            step: 0.05,
            max: 0.1,
            min: -0.1
        }

        this.tiltState = 0;
        this.tiltDirection = 1;
    }

    tiltTimerMethod() {
        let t = this.tilt;
        this.tiltByValue(t.current);

        t.current+=t.direction*t.step;

        if(t.current >= t.max){
            t.current = t.max;
            t.direction = -1;
        }

        if(t.current <= t.min){
            t.current = t.min;
            t.direction = 1;
        }
      

        this.needRecalcRenderProperties = true;
    }

    internalRender() {
        //draw(this.context, { strokeStyle: 'white', points: [this.renderBox.topLeft, this.renderBox.topRight, this.renderBox.bottomRight, this.renderBox.bottomLeft] });
    }

    tiltByValue(current) {
        this.frontBevel.size.x  = this.frontBevelSize.x*(1 - current);
        this.rearBevel.size.x  = this.rearBevelSize.x*(1 + current);

        // this.frontTowerBevel.size.x = this.frontTowerBevelSize.x*(1 - current);
        // this.rearTowerBevel.size.x  = this.rearTowerBevelSize.x*(1 + current);
    }

    // tiltDown() {
    //     this.frontBevel.size.x  = this.frontBevelSize.x*0.75;
    //     this.rearBevel.size.x  = this.rearBevelSize.x*1.25;
    // }

    // tiltUp() {
    //     this.frontBevel.size.x  = this.frontBevelSize.x*1.25;
    //     this.rearBevel.size.x  = this.rearBevelSize.x*0.75;

    // }

    // resetTilt() {
    //     this.frontBevel.size.x  = this.frontBevelSize.x;
    //     this.rearBevel.size.x  = this.rearBevelSize.x;
    // }

    internalUpdate(now){
        if(this.tiltTimer){
            doWorkByTimer(this.tiltTimer, now);
        }
    }
}

class Trail extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 1,
            setDeadOnDestinationComplete: true,
            destinationCompleteCheck: function(){
                return this.position.x < -1;
            }
        }, options);
        super(options);

        this.setDestination(new V2(-1, this.position.y));
    }
}

class Crater extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            smokeGeneration: {
                enabled: true,
                maxLayer: 50,
                minLayer: 40,
                currentLayer: 50,
                generationSpeed: 500,
                cloudSpeed: 0.1
            },
            setDeadOnDestinationComplete: true,
            destinationCompleteCheck: function(){
                return this.position.x < -1 - this.size.x;
            }
        }, options);

        super(options);

        this.setDestination(new V2(-1, this.position.y));
        if(this.smokeGeneration.enabled)
            this.smokeGenerationTimer = createTimer(this.smokeGeneration.generationSpeed, this.smokeGenerationTimerMethod, this, true);
    }

    smokeGenerationTimerMethod() {
        this.addChild(new SmokeCloud(
            {
                position: new V2().add(new V2(getRandom(-1,1), getRandom(-1,1))), 
                size: this.size.divide(4),
                destination: new V2(this.position.x + getRandom(-50,50), this.parentScene.viewport.y + 50),
                speed: this.smokeGeneration.cloudSpeed
            }));
        this.smokeGeneration.currentLayer--;

        if(this.smokeGeneration.currentLayer < this.smokeGeneration.minLayer){
            this.smokeGeneration.currentLayer = this.smokeGeneration.maxLayer;
        }
    }

    internalUpdate(now){
        if(this.smokeGenerationTimer)
            doWorkByTimer(this.smokeGenerationTimer, now);
    }

    internalRender() {
        //draw(this.context, { strokeStyle: 'white', points: [this.renderBox.topLeft, this.renderBox.topRight, this.renderBox.bottomRight, this.renderBox.bottomLeft] });
    }
}

class SmokeCloud extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
             fadeOut: {
                 opacityStep: 0.025,
                 currentOpacity: 1, 
                 sizeStep: 0.35,
             },
             speed: 0.5,
             setDestinationOnInit: true,
        }, options);

        super(options);

        this.fadeOutTimer = createTimer(100, this.fadeOutTimerMethod, this, true);
    }

    init() {
        this.img = this.parent.parentScene.smokeCloudImg;
    }

    fadeOutTimerMethod(){
        this.fadeOut.currentOpacity-=this.fadeOut.opacityStep;

        if(this.fadeOut.currentOpacity <= 0){
            this.setDead();
            return;
        }

        this.size.x += this.fadeOut.sizeStep;
        this.size.y += this.fadeOut.sizeStep;
    }

    internalUpdate(now){
        if(this.fadeOutTimer)
            doWorkByTimer(this.fadeOutTimer, now);
    }

    internalPreRender() {
        this.originalGlobalAlpha = this.context.globalAlpha;
        this.context.globalAlpha = this.fadeOut.currentOpacity;
    }

    internalRender() {
        this.context.globalAlpha = this.originalGlobalAlpha;
    }
}

