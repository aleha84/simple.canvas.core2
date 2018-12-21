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
                ctx.fillStyle = 'red';
                ctx.fillRect(size.x/4,size.y/4, size.x/4, size.y/2);
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
                draw(ctx, {fillStyle: inner.color, points: inner.points, closePath: true});
            }

            for(let outer of outerCraterPoints){
                draw(ctx, {fillStyle: outer.color, points: outer.points, closePath: true});
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
    }
}

class Tank extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(50, 30),
            
        }, options);

        super(options);

        this.body = new GO({
            size: this.size.clone(),
            position: new V2(),
            img: this.bodyImg
        });

        this.addChild(this.body);

        this.tower = new GO({
            size: this.size.clone(),
            position: new V2(),
            img: this.towerImg
        });

        this.addChild(this.tower);

        this.rearBevel = new GO({
            size: new V2(this.size.x/8, this.size.y),
            position: new V2(-this.size.x*7/16),
            img: createCanvas(new V2(this.size.x/8,this.size.y), function(ctx, size){
                ctx.fillStyle = '#425B0B';
                ctx.fillRect(0,0, size.x, size.y);
            })
        })

        this.addChild(this.rearBevel);
    }

    internalRender() {
        draw(this.context, { strokeStyle: 'white', points: [this.renderBox.topLeft, this.renderBox.topRight, this.renderBox.bottomRight, this.renderBox.bottomLeft] });
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

