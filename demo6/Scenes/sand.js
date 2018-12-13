class SandScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);


        this.sandImg = function(color = 'white') {
            if(!this.sandImgs){
                this.sandImgs = {};
            }

            if(this.sandImgs[color]){
                return this.sandImgs[color];
            }

            let img = createCanvas(new V2(10, 10), function(ctx, size) {
                ctx.fillStyle = color;
                ctx.fillRect(0,0, size.x, size.y);
            });

            this.sandImgs[color] = img;

            return img;
        } 

        this.sandGenerationTimer = createTimer(230, this.sandGenerationMethod, this, true);

        //obstackle
        this.addGo(new GO({
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            size: new V2(300, 30),
            collisionDetection: {
                enabled: true
            },
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(0,0, size.x, size.y);
            })
        }), 0)

        // this.addGo(new Sand({
        //     img: this.sandImg('yellow'),
        //     sandType: 'yellow',
        //     position: new V2(250, 134)
        // }));

        // this.addGo(new Sand({
        //     img: this.sandImg('green'),
        //     sandType: 'green',
        //     position: new V2(250, 133)
        // }));

        // this.addGo(new Sand({
        //     img: this.sandImg('blue'),
        //     sandType: 'blue',
        //     position: new V2(this.viewport.x/2, 1)
        // }), 1);
    }

    sandGenerationMethod(){
        this.addGo(new Sand({
            img: this.sandImg('white'),
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
            next: {

            },
            defaultYAcceleration: new V2(0, 10/120),
            defaultXDelta: 1/100,
            size: new V2(1,1),
            speedV2: new V2(0, 0),
            speed: 1,
            positionChangeProcesser: function() { return this.positionChangeProcesserInternal() },
            collisionDetection: {
                enabled: true,
                render: true,
                // preCheck: function(go) {
                //     return this.type !== go.type;
                // },
                onCollision: function(collidedWith, collisionPoints) { this.onCollisionInternal(collidedWith, collisionPoints); }
            }
        }, options);

        super(options);

        this.collisionDetection.circuit = [this.defaultYAcceleration.clone(), //new V2(0, 0),
            new V2(0, this.size.y/2), new V2(-this.size.x/2, this.size.y/2),new V2(-this.size.x/2, -this.size.y/2), new V2(this.size.x/2, -this.size.y/2), new V2(this.size.x/2, this.size.y/2), new V2(0, this.size.y/2)];
    }

    init() {
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y));
    }

    onCollisionInternal(collidedWith, collisionPoints) {
        let nextPosition; 
        if(isArray(collidedWith)){
            let closest = collidedWith[0];
            let closestAvg = closest.collisionPoints ? V2.average(closest.collisionPoints): closest.collidedWith.position;
            let distance = this.position.distance(closestAvg);
            for(let i = 1; i < collidedWith.length; i++){
                let c = collidedWith[i];
                let avg = c.collisionPoints ? V2.average(c.collisionPoints): c.collidedWith.position;
                let d = this.position.distance(avg);

                if(d < distance){
                    closest = c;
                    closestAvg = avg;
                    distance = d;
                }
            }

            collidedWith = closest.collidedWith;
            collisionPoints = closest.collisionPoints;
            nextPosition = closestAvg;
        }
        else {
            nextPosition = (collisionPoints ? V2.average(collisionPoints): this.position);//.substract(this.speedV2);
        }

        let cv = this.curvedMovement;
        // if collidedWith - stopped
        // if collidedWith - moving

        if(collidedWith.type == 'Sand'){
            if(this.speedV2.module() < 0.5){
                if(collidedWith.speedV2.module() < 0.5){
                    this.next.speed =new V2(); 

                    //this.speedV2 = new V2();
                    //this.collisionDetection.circuit[0]= this.speedV2.clone();
                    cv.enabled = false;
                    cv.direction = undefined;
                    return;
                }
                else {
                    this.next.speed = collidedWith.speedV2.divide(2);
                    //this.speedV2 = collidedWith.speedV2.divide(2);
                    //this.collisionDetection.circuit[0]= this.speedV2.clone();
                    this.skipPositionUpdate = true;
                    return;
                }
            }
            else {
                if(collidedWith.speedV2.module() < 0.5){
                    //this.position.substract(this.speedV2, true);
                    this.next.position = nextPosition.substract(this.speedV2);
                    this.position = this.next.position.clone();
                }
                else {
                    this.next.speed = collidedWith.speedV2.divide(2);
                    // this.speedV2 = collidedWith.speedV2.divide(2);
                    // this.collisionDetection.circuit[0]= this.speedV2.clone();
                    return;
                }
            }
            
        }
        else {
            if(this.speedV2.module() < 0.5){

                this.position.substract(this.defaultYAcceleration, true);
                this.next.speed = new V2(); 
                //this.speedV2 = new V2();
                cv.enabled = false;
                cv.direction = undefined;
                return;
            }
            else {
                //this.position.substract(this.speedV2, true);
                this.next.position = nextPosition;
                this.position = this.next.position.clone();
            }    
        }
        
        cv.enabled = true;

        
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
        this.collisionDetection.circuit[0]= this.speedV2.clone();
        cv.time++;
    }

    positionChangeProcesserInternal(){
        if(this.next.position){
            this.position = this.next.position;
            this.next.position = undefined;
            //return;
        }

        if(this.next.speed){
            this.speedV2 = this.next.speed;
            this.collisionDetection.circuit[0]= this.speedV2.clone();
            this.next.speed = undefined;
        }

        if(this.skipPositionUpdate){
            this.skipPositionUpdate = false;
            return;
        }

        let cv = this.curvedMovement;
        this.position.add(this.speedV2, true);

        if(cv.enabled){
            
            
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

        this.collisionDetection.circuit[0] = this.speedV2.clone();
    }

    destinationCompleteCheck(){
        if(this.position.y > this.parentScene.viewport.y) {
            this.setDead();
        }
    }
}