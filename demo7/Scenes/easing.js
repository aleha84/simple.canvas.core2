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
            destination: this.sceneCenter.add(new V2(this.viewport.x/4, 0)),
            setDestinationOnInit: true,
            size: new V2(20, 20),
            debug: true,
            img: createCanvas(new V2(1,1), (ctx, size) => {
                ctx.fillStyle = 'white';
                ctx.fillRect(0,0, size.x, size.y);
            }),
            
        }));
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }
}

class DemoSpaceShip extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            acceleration: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0, 
                type: 'quad',
                method: 'in'
            },
            breaking: {
                enabled: false,
                time: 0, 
                duration: 120, 
                startValue: 0, 
                change: 0,
                type: 'quad',
                method: 'out',
            },
            idle: undefined,
            speedState: 'idle',
            speed: 0,
            maxSpeed: 2,
            debug: false
        }, options);
            
        super(options);
    }

    init() {
        this.accelerate();
        if(this.debug){
            this.addChild(new GO({
                position: new V2(0, -20),
                size: new V2(10, 10),
                text: {...GO.getTextPropertyDefaults('0'), color: 'white', size: 10},
                internalUpdate() {
                    this.text.value = this.parent.speed.toFixed(2);
                }
            }))
        }
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

    destinationCompleteCheck(){
        if(this.speedState == 'breaking' && this.speed < 0.001)
            return true;

        if(this.position.distance(this.destination) <= this.breakingDistance && this.speedState != 'breaking')
            this.break();

        return false;
    }

    speedChangeProcesser() {
        if(!this.acceleration.enabled && !this.breaking.enabled)
            return;

        let props = this[this.speedState];
        if(props === undefined)
            return;

        if(props.time > props.duration){
            props.time = 0;
            props.enabled = false;
            this.speedState = 'idle';
            return;
        }

        this.speed = easing.process(props);
        props.time++;
    }

    internalUpdate(now){
        this.speedChangeProcesser();
    }

    internalRender(){

    }
}

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