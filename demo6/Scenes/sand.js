class SandScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);

        this.sandImg = createCanvas(new V2(10, 10), function(ctx, size) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.sandGenerationTimer = createTimer(100, this.sandGenerationMethod, this, true);

        //obstackle
        this.addGo(new GO({
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            size: new V2(300, 30),
            collisionDetection: {
                enabled: true
            },
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = 'red';
                ctx.fillRect(0,0, size.x, size.y);
            })
        }))

        this.addGo(new Sand({
            img: this.sandImg,
            position: new V2(250, 138)
        }));

        this.addGo(new Sand({
            img: this.sandImg,
            position: new V2(this.viewport.x/2, 1)
        }));
    }

    sandGenerationMethod(){
        this.addGo(new Sand({
            img: this.sandImg,
            position: new V2(this.viewport.x/2, 1)
        }));
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        if(this.sandGenerationTimer)
            doWorkByTimer(this.sandGenerationTimer, now);
    }
}

class Sand extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            curvedMovement: {
                angleInRads: 0,
                direction: undefined,
                speed: 0,
                enabled: false,
                time: 0,
                timeMultiplier: 1/60,
                startPoint: undefined,
            },
            defaultYAcceleration: new V2(0, 10/120),
            defaultXDelta: 1/100,
            size: new V2(1,1),
            speedV2: new V2(0, 0),
            speed: 1,
            positionChangeProcesser: function() { return this.positionChangeProcesserInternal() },
            collisionDetection: {
                enabled: true,
                // preCheck: function(go) {
                //     return this.type !== go.type;
                // },
                onCollision: function(collidedWith, collisionPoints) { this.onCollisionInternal(collidedWith, collisionPoints); }
            }
        }, options);

        super(options);
    }

    init() {
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y));
    }

    onCollisionInternal(collidedWith, collisionPoints) {
        
        let cv = this.curvedMovement;

        // if collidedWith - stopped
        // if collidedWith - moving

        if(collidedWith.type == 'Sand'){
            if(collidedWith.speedV2.module() < 0.3){
                this.position.substract(this.speedV2, true);
            }
            else {
                this.speedV2 = collidedWith.speedV2.divide(2);
                return;
            }
        }
        else {
            if(this.speedV2.module() < 0.3){

                this.position.substract(this.defaultYAcceleration, true);
                this.speedV2 = new V2();
                cv.enabled = false;
                return;
            }
            else {
                this.position.substract(this.speedV2, true);
            }    
        }
        
        cv.enabled = true;

        cv.startPoint = (collisionPoints ? V2.average(collisionPoints): this.position).substract(this.speedV2);
        if(cv.direction == undefined){
            cv.direction =  getRandomBool() ? -1 : 1;
            cv.angleInRads = degreeToRadians(getRandom(30, 60));
        }
        else {
            let mirroredSpeedV2 = new V2(this.speedV2.x, -this.speedV2.y);
            cv.angleInRads = Math.acos(mirroredSpeedV2.normalize().dot(V2.up));
        }
            

        
        cv.time = 0;

        cv.speed = this.speedV2.y/2;

        this.speedV2.x = cv.direction*cv.speed*Math.cos(cv.angleInRads);
        this.speedV2.y = -1*(cv.speed*Math.sin(cv.angleInRads)-this.defaultYAcceleration.y*cv.time);
        cv.time++;
    }

    positionChangeProcesserInternal(){
        this.position.add(this.speedV2, true);

        if(this.curvedMovement.enabled){
            let cv = this.curvedMovement;
            
        if(this.speedV2.x != 0){
            let lesserZero = this.speedV2.x < 0;

            this.speedV2.x += (lesserZero ? 1 : -1)* this.defaultXDelta;
            if((lesserZero && this.speedV2.x > 0) || (!lesserZero && this.speedV2.x < 0)){
                this.speedV2.x = 0;
            }
        }

            this.speedV2.y = -1*(cv.speed*Math.sin(cv.angleInRads)-this.defaultYAcceleration.y*cv.time);
            cv.time++;
        }
        else {
            this.speedV2.add(this.defaultYAcceleration, true);
        }
    }

    destinationCompleteCheck(){
        if(this.position.y > this.parentScene.viewport.y) {
            this.setDead();
        }
    }
}