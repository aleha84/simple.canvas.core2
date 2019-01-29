class EasingScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options);
        
        super(options);
    }

    start(props) {
         this.unit = this.addGo(new DemoSpaceShip({
            position: this.sceneCenter.add(new V2(-this.viewport.x/4, 0)),
            // destination: this.sceneCenter.add(new V2(this.viewport.x/4, 0)),
            // setDestinationOnInit: true,
            size: new V2(30, 25),
            debug: true,
            // img: createCanvas(new V2(1,1), (ctx, size) => {
            //     ctx.fillStyle = 'white';
            //     ctx.fillRect(0,0, size.x, size.y);
            // }),
            
        }));

        // this.unit1 = this.addGo(new DemoSpaceShip({
        //     position: this.sceneCenter.add(new V2(-this.viewport.x/4, 40)),
        //     destination: this.sceneCenter.add(new V2(this.viewport.x/4, 0)),
        //     setDestinationOnInit: true,
        //     size: new V2(30, 25),
        //     debug: true,
        //     imgPropertyName: 'ssDemo'
        // }));
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }
}

class DemoSpaceShip extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            rotationStart: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0, 
                type: 'quad',
                method: 'in',
                engines: {
                    '1': ['frontRightManeurThruster', 'rearLeftManeurThruster'],
                    '-1': ['frontLeftManeurThruster', 'rearRightManeurThruster']
                },
            },
            rotationEnd: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0, 
                type: 'quad',
                method: 'out',
                engines: {
                    '-1': ['frontRightManeurThruster', 'rearLeftManeurThruster'],
                    '1': ['frontLeftManeurThruster', 'rearRightManeurThruster']
                },
            },
            acceleration: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0, 
                type: 'quad',
                method: 'in',
                engines: ['mainThruster']
                
            },
            breaking: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0,
                type: 'quad',
                method: 'out',
                engines: ['frontLeftManeurThruster', 'frontRightManeurThruster']
            },
            renderValuesRound: false,
            idle: undefined,
            speedState: 'idle',
            rotationState: 'idle',
            speed: 0,
            maxSpeed: 1,//0.005,
            rotationSpeed: 0,
            rotationMaxSpeed: 0.5,
            rotationDirection: 1,
            angle: 0,
            debug: false,
            currentDirection: V2.right,
            dumb: true
        }, options);
            
        super(options);

        // if(this.imgPropertyName)
        //     return; 

        this.originSize = new V2(30, 25);

        this.componentsSizes = {
            engine: new V2(this.originSize.x/3, this.originSize.y),
            body: new V2(this.originSize.x*2/3, this.originSize.y*3/5),
        }

        this.componentsPositions = {
            engine: new V2(new V2(-this.originSize.x/2 + this.componentsSizes.engine.x/2, 0)),
            body: new V2(new V2(this.originSize.x/2 - this.componentsSizes.body.x/2, 0))
        }

        this.navigationTimer = createTimer(250, this.navigationProcesser, this, true);
    }

    init() {
        this.moveTo(this.parentScene.sceneCenter.add(new V2(this.parentScene.viewport.x/4, 0)));
        //this.accelerate();
        //this.rotate(-180);

        // if(this.imgPropertyName)
        //     return; 

        // if(this.debug){
        //     this.addChild(new GO({
        //         position: new V2(0, -20),
        //         size: new V2(10, 10),
        //         text: {...GO.getTextPropertyDefaults('0'), color: 'white', size: 10},
        //         internalUpdate() {
        //             this.text.value = this.parent.speed.toFixed(2);
        //         }
        //     }))
        // }

        this.engine = this.addChild(new GO({
            position: this.componentsPositions.engine,
            size: this.componentsSizes.engine,
            img: createCanvas(this.componentsSizes.engine.mul(2), (ctx, size) => {
                let xStep = size.x/2;
                let yStep = size.y/5;
                draw(ctx, {fillStyle: '#F1EAE0', strokeStyle: '#33383C', closePath: true, isDeltas: true, points: [
                    new V2(0,2*yStep),new V2(xStep, -yStep), new V2(xStep, -yStep), new V2(0, yStep*5), new V2(-xStep, -yStep), new V2(-xStep, -yStep)
                ]})

                draw(ctx, {fillStyle: '#33383C', strokeStyle: '#33383C', closePath: true, isDeltas: true, points: [
                    new V2(xStep, 2*yStep), new V2(xStep, 0), new V2(0,yStep), new V2(-xStep, 0)
                ]})

                draw(ctx, {strokeStyle: '#33383C', closePath: false, isDeltas: true, points: [
                    new V2(0, 2*yStep-0.5), new V2(xStep-0.5, 0), new V2(0, -yStep)// , new V2(xStep, 0)
                ]})

                draw(ctx, {strokeStyle: '#33383C', closePath: false, isDeltas: true, points: [
                    new V2(0, yStep*3+0.5), new V2(xStep-0.5, 0), new V2(0, yStep)// , new V2(xStep, 0)
                ]})
            })
        }));

        this.engine.mainThruster = this.engine.addChild(new Thruster({
            position: new V2(-this.componentsSizes.engine.x/2 - 1, 0),
            size: this.componentsSizes.engine.divide(3),
            exshaustDirection: V2.left,
            visualLength: this.componentsSizes.engine.y/5,
            exshaustLength: this.componentsSizes.engine.x
        }))

        this.engine.rearLeftManeurThruster = this.engine.addChild(new Thruster({
            position: new V2(-this.componentsSizes.engine.x/4 - 1, -this.componentsSizes.engine.y/5),
            size: this.componentsSizes.engine.divide(3),
            exshaustDirection: V2.upLeft,
            visualLength: this.componentsSizes.engine.y/10,
            exshaustLength: this.componentsSizes.engine.x/2
        }));

        this.engine.rearRightManeurThruster = this.engine.addChild(new Thruster({
            position: new V2(-this.componentsSizes.engine.x/4 - 1, this.componentsSizes.engine.y/5),
            size: this.componentsSizes.engine.divide(3),
            exshaustDirection: V2.downLeft,
            visualLength: this.componentsSizes.engine.y/10,
            exshaustLength: this.componentsSizes.engine.x/2
        }));

        this.engine.frontLeftManeurThruster = this.engine.addChild(new Thruster({
            position: new V2(this.componentsSizes.engine.x/2, -this.componentsSizes.engine.y*2/5),
            size: this.componentsSizes.engine.divide(3),
            exshaustDirection: V2.right,
            visualLength: this.componentsSizes.engine.y/10,
            exshaustLength: this.componentsSizes.engine.x/2
        }));

        this.engine.frontRightManeurThruster = this.engine.addChild(new Thruster({
            position: new V2(this.componentsSizes.engine.x/2, this.componentsSizes.engine.y*2/5),
            size: this.componentsSizes.engine.divide(3),
            exshaustDirection: V2.right,
            visualLength: this.componentsSizes.engine.y/10,
            exshaustLength: this.componentsSizes.engine.x/2
        }));

        this.body = this.addChild(new GO({
            position: this.componentsPositions.body,
            size: this.componentsSizes.body,
            img: createCanvas(this.componentsSizes.body, (ctx, size) => {
                let xStep = size.x/3;
                let yStep = size.y/3;
                draw(ctx, {fillStyle: '#F1EAE0', strokeStyle: '#33383C', closePath: true, isDeltas: true, points: [
                    new V2(0,0),new V2(2*xStep, 0), new V2(xStep, yStep), new V2(0, yStep), new V2(-xStep, yStep), new V2(-2*xStep, 0)
                ]});

                draw(ctx, {fillStyle: '#33383C', strokeStyle: '#33383C', closePath: true, isDeltas: true, points: [
                    new V2(0,yStep),new V2(xStep, 0), new V2(0, yStep), new V2(-xStep, 0)
                ]});

                draw(ctx, {fillStyle: '#9BCAE4', strokeStyle: '#84A0B6', closePath: true, isDeltas: true, points: [
                    new V2(xStep,yStep),new V2(xStep, 0), new V2(0, yStep), new V2(-xStep, 0)
                ]});
            })
        }));

        let rlSize = new V2(this.componentsSizes.body.x*2/3, this.componentsSizes.body.y/3 - 1);
        this.rocketLauncherImg = createCanvas(rlSize.mul(2), (ctx, size) =>{
            ctx.fillStyle = '#C1BCB4';
            ctx.fillRect(0,0, size.x, size.y);//ctx.strokeRect(0,0, size.x, size.y);
            //ctx.strokeRect(size.x/2,0, size.x/2,size.y);
            ctx.strokeStyle = '#8E8B86';
            ctx.moveTo(size.x/2, 0);ctx.lineTo(size.x/2, size.y);ctx.stroke();
            ctx.moveTo(size.x, 0);ctx.lineTo(size.x, size.y);ctx.stroke();
            ctx.fillStyle = 'red';
            ctx.fillRect(size.x*5/8, size.y/8,2,2);
            ctx.fillRect(size.x*5/8, size.y*5/8,2,2);
            ctx.fillRect(size.x*6/8, size.y/8,2,2);
            ctx.fillRect(size.x*6/8, size.y*5/8,2,2);
        });

        this.smallAutoCanonImg = createCanvas(new V2(1,2), (ctx, size) => {
            ctx.fillStyle = '#FFBE28';
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillStyle = '#DBA023';
            ctx.fillRect(0,1, size.x, 1);
        })

        let acSize = new V2(this.componentsSizes.body.x/3, this.componentsSizes.body.y/8);
        this.weapons = [
            this.body.addChild(new GO({
                position: this.componentsSizes.body.divide(-2).add(rlSize.divide(2)),
                size: rlSize,
                img: this.rocketLauncherImg
            })),
            this.body.addChild(new GO({
                position: new V2().add(new V2(-this.componentsSizes.body.x/2, this.componentsSizes.body.y/4-1)).add(rlSize.divide(2)),
                size: rlSize,
                img: this.rocketLauncherImg
            })),
            this.body.addChild(new GO({
                position: new V2().add(new V2(this.componentsSizes.body.x*3/4, this.componentsSizes.body.y/2-1)).add(acSize.divide(-1)),
                size: acSize,
                img: this.smallAutoCanonImg
            })),
            
        ]
    }

    moveTo(destination) {   
        this.destination = destination;
    }

    rotate(angle) {
        this.destinationAngle = angle;
        if(this.destinationAngle < this.angle){
            this.rotationDirection = -1;
        }

        this.startRotation();
    }

    startRotation() {
        this.rotationStart.enabled = true;
        this.rotationEnd.enabled = false;
        this.rotationStart.time = 0;
        this.rotationStart.startValue = this.rotationSpeed;
        this.rotationStart.change = this.rotationMaxSpeed;
        this.rotationState = 'rotationStart';

        this.rotationStartAmount = 0;
        this.rotationEndAmount = 0;

        for(let i = 0; i < this.rotationStart.duration;i++){
            this.rotationStartAmount += easing.process({...this.rotationStart, time: i});
        }

        for(let i = 0; i < this.rotationEnd.duration;i++){
            this.rotationEndAmount += easing.process({...this.rotationEnd, startValue: this.rotationMaxSpeed, change: -this.rotationMaxSpeed, time: i});
        }
    }

    stopRotation(){
        this.rotationEnd.enabled = true;
        this.rotationStart.enabled = false;
        this.rotationEnd.time = 0;
        this.rotationEnd.startValue = this.rotationSpeed;
        this.rotationEnd.change = -this.rotationSpeed;
        this.rotationState = 'rotationEnd';
    }

    accelerate() {
        this.breaking.enabled = false;
        this.acceleration.enabled = true;
        this.acceleration.time = 0;
        this.acceleration.startValue = this.speed;
        this.acceleration.change = this.maxSpeed;
        this.speedState = 'acceleration';

        this.accelerationDistance = 0;
        this.breakingDistance = 0;
        for(let i = 0; i < this.acceleration.duration;i++){
                this.accelerationDistance += easing.process({...this.acceleration, time: i});
        }
        for(let i = 0; i < this.breaking.duration;i++){
            this.breakingDistance += easing.process({...this.breaking, startValue: this.maxSpeed, change: -this.maxSpeed, time: i});
        }
    }

    break() {
        this.acceleration.enabled = false;
        this.breaking.enabled = true;
        this.breaking.time = 0;
        this.breaking.startValue = this.speed;
        this.breaking.change = -this.speed;
        this.speedState = 'breaking';
    }

    rotationSpeedChangeProcesser() {
        if(!this.rotationStart.enabled && !this.rotationEnd.enabled)
            return;

        let props = this[this.rotationState];
        if(props === undefined)
            return;

        if(this.engine) {
            if(props.engines){
                for(let e of props.engines[this.rotationDirection.toString()]){
                    this.engine[e].toggleIgnition(true);
                }
            }
        }

        if(props.time > props.duration){
            props.time = 0;
            props.enabled = false;
            this.rotationState = 'idle';
            if(this.engine) {
                for(let e of props.engines[this.rotationDirection.toString()]){
                    this.engine[e].toggleIgnition(false);
                }
            }
            
            return;
        }

        this.rotationSpeed = easing.process(props);
        props.time++;
    }

    speedChangeProcesser() {
        if(!this.acceleration.enabled && !this.breaking.enabled)
            return;

        let props = this[this.speedState];
        if(props === undefined)
            return;

        if(this.engine) {
            if(props.engines){
                for(let e of props.engines){
                    this.engine[e].toggleIgnition(true);
                }
            }
        }

        if(props.time > props.duration){
            props.time = 0;
            props.enabled = false;
            this.speedState = 'idle';
            if(this.engine) {
                for(let e of props.engines){
                    this.engine[e].toggleIgnition(false);
                }
            }
            
            return;
        }

        this.speed = easing.process(props);
        props.time++;
    }


    // navigationProcesser() {
    //     if(this.destination == undefined)
    //         return;

    //     if(this.dumb){
    //         if(this.rotationSpeed == 0){
    //             let destDirection = this.position.direction(this.destination);
    //             let angleToDestination = V2.right.angleTo(destDirection)
    
    //             if(Math.abs(angleToDestination > 0.1)){
    //                 if(angleToDestination > 180){
    //                     angleToDestination = angleToDestination - 360;
    //                 }

    //                 this.rotate(angleToDestination);
    //                 return;
    //             }
    //         }
    //         if(this.speed == 0){
    //             let distance = this.position.distance(this.destination);
    //             if(distance > 0.5){
    //                 this.setDestination(this.destination);
    //                 this.accelerate();
    //                 return;
    //             }
    //         }
    //     }
        
    // }

    // destinationCompleteCheck(){
    //     if(this.speedState == 'breaking' && this.speed < 0.001)
    //         return true;

    //     if(this.position.distance(this.destination) <= this.breakingDistance && this.speedState != 'breaking')
    //         this.break();

    //     return false;
    // }

    // destinationCompleteCallBack() {
    //     console.log('destinationCompleteCallBack');
    //     if(this.dumb){
    //         this.moveTo(new V2(this.position.x > this.parentScene.sceneCenter.x ? this.parentScene.viewport.x*1/4 : this.parentScene.viewport.x*3/4 , this.position.y))
    //     }
    // }

    
    // internalUpdate(now){
    //     this.speedChangeProcesser();
    //     this.rotationSpeedChangeProcesser();
    //     if(this.rotationSpeed != 0){
    //         this.angle+= this.rotationDirection * this.rotationSpeed;

    //         this.currentDirection = V2.right.rotate(this.angle);

    //         let angleDistance = Math.abs(this.destinationAngle-this.angle);
    //         if(this.rotationState == 'rotationEnd' &&  angleDistance<0.1){
    //             if(this.engine) {
    //                 for(let e of this[this.rotationState].engines[this.rotationDirection.toString()]){
    //                     this.engine[e].toggleIgnition(false);
    //                 }
    //             }
    //             this.angle = this.destinationAngle;
    //             this.rotationEnd.enabled = false;
    //             this.rotationState = 'idle';
    //             this.rotationSpeed = 0;
    //         }
    //         else if(angleDistance <= this.rotationEndAmount && this.rotationState != 'rotationEnd'){
    //             this.stopRotation();
    //         }
    //     }

    //     if(this.navigationTimer)
    //         doWorkByTimer(this.navigationTimer, now);
    // }

    internalPreRender() {
        if(this.angle != 0){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(this.angle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }
    }

    internalRender(){
        if(this.angle != 0){
            this.context.translate(this.renderPosition.x, this.renderPosition.y);
            this.context.rotate(degreeToRadians(-this.angle));
            this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
        }

        if(this.debug){
            this.context.font = '20px Arial';
            this.context.fillStyle = 'white';
            this.context.textAlign = 'center';
            this.context.fillText(`s: ${this.speed.toFixed(2)}, a: ${this.angle.toFixed(2)}, rs: ${this.rotationSpeed.toFixed(2)}`, this.renderPosition.x, this.renderPosition.y - this.renderSize.y*1.1);
            this.context.fillText(`cd: ${this.currentDirection.x.toFixed(2)},${this.currentDirection.y.toFixed(2)}`, this.renderPosition.x, this.renderPosition.y - this.renderSize.y*0.9);
        }
        
    }
}

class Thruster extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            color: '#6A7565',
            exshaustDirection: new V2(),
            exshaustLength: 0,
            visualLength: 0,
            width: 2,
            angle: 0,
        }, options);
        
        super(options);

        let exshaustSize = undefined;
        let exshaustImage = undefined;
        let exshaustPosition = undefined;

        this.size = new V2(this.width, this.visualLength);
        this.img = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.color;ctx.fillRect(0, 0, size.x, size.y);
        });

        exshaustSize = new V2(this.exshaustLength, this.size.y);
        exshaustPosition = new V2(-this.size.x/2 -exshaustSize.x/2, 0)
        exshaustImage = createCanvas(exshaustSize, (ctx, size) => {
            ctx.drawImage(Thruster.eshaustOriginImg, 0,0,size.x, size.y);
        });

        if(this.exshaustDirection.equal(V2.left)){
            this.angle = 0;
        }
        else if(this.exshaustDirection.equal(V2.right)){
            this.angle = 180;
        }
        else if(this.exshaustDirection.equal(V2.up)){
            this.angle = 90;
        }
        else if(this.exshaustDirection.equal(V2.down)){
            this.angle = -90;
        }
        else if(this.exshaustDirection.equal(V2.upLeft)){
            this.angle = 45;

        }
        else if(this.exshaustDirection.equal(V2.downRight)){
            this.angle = 225;
        }
        else if(this.exshaustDirection.equal(V2.upRight)){
            this.angle = 135;
        }
        else if(this.exshaustDirection.equal(V2.downLeft)){
            this.angle = -45;
        }

        this.exhaust = this.addChild(new GO({
            position: exshaustPosition,
            size: exshaustSize,
            img: exshaustImage,
            isVisible: false
        }))
        
    }

    toggleIgnition(visible) {
        this.exhaust.isVisible = visible;
    }

    internalPreRender() {
        if(this.angle == 0)
            return;

        this.context.translate(this.renderPosition.x, this.renderPosition.y);
        this.context.rotate(degreeToRadians(this.angle));
        this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
    }
    internalRender() {
        if(this.angle == 0)
            return;

        this.context.translate(this.renderPosition.x, this.renderPosition.y);
        this.context.rotate(degreeToRadians(-this.angle));
        this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
    }
}

Thruster.eshaustOriginImg = createCanvas(new V2(6,1), function(ctx, size){
    let grd = ctx.createLinearGradient(0,0, size.x, 0);
    grd.addColorStop(0, '#E30D0B');grd.addColorStop(0.25, '#FC8436');grd.addColorStop(0.5, '#F4E904');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0, size.x, size.y);
});


var easing = {
    process(props){
        let group = this[props.type];
        if(!group) {
            console.trace();
            throw 'wrong easing type: ' + props.type;
        }

        let action = group[props.method];

        if(!action){
            console.trace();
            throw `wrong easing "${props.type}" method: ${props.method}`;
        }

        return action(props.time, props.startValue, props.change, props.duration);
    },
    quad: {
        out(time, startValue, change, duration) {
            time /= duration;
            return -change * time*(time-2) + startValue;
        },
        in(time, startValue, change, duration) {
            time /= duration;
            return change*time*time + startValue;
        },
        inOut(time, startValue, change, duration) {
            time /= duration/2;
            if (time < 1) return change/2*time*time + startValue;
            time--;
            return -change/2 * (time*(time-2) - 1) + startValue;
        }
    }
}