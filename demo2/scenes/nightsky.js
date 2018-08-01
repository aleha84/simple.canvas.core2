class NightSkyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options);

        super(options);

        this.meteorRainQueue = [];

        new StarsLayer({starsConfigs: {
            count: 500,
            opacity: 0.2,
            speed: 0.01
        }, level: 0, scene: this, addShiningStars: true});

        new StarsLayer({starsConfigs: {
            count: 300,
            opacity: 0.3,
            speed: 0.03
        }, level: 1, scene: this, addShiningStars: true});

        new StarsLayer({starsConfigs: {
            count: 100,
            opacity: 0.5,
            speed: 0.06
        }, level: 3, scene: this, addShiningStars: true});

        this.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 1500,
            originDelay: 1500,
            doWorkInternal : this.objectsGenerator,
            context: this
        }

        this.meteorRainTimer = createTimer(50, 
        () => {
            if(!this.meteorRainQueue.length)
                return;

            this.addGo(this.meteorRainQueue.shift(), 2);
            
        }, this);
    }

    objectsGenerator(){
        if(!getRandomBool())
            return;

        let position = new V2();
        let destination = new V2();

        switch(getRandomInt(0,3))
        {
            case 0:
                position = new V2(getRandom(1, SCG.viewport.logical.width - 1), -100);
                destination = new V2(getRandom(1, SCG.viewport.logical.width - 1), SCG.viewport.logical.height + 100);
                break;
            case 1:
                position = new V2(SCG.viewport.logical.width+100, getRandom(1, SCG.viewport.logical.height -1));
                destination = new V2(-100, getRandom(1, SCG.viewport.logical.height -1));
                break;
            case 2:
                position = new V2(getRandom(1, SCG.viewport.logical.width - 1), SCG.viewport.logical.height + 100);
                destination = new V2(getRandom(1, SCG.viewport.logical.width - 1), -100);
                break;
            case 3:
                position = new V2(-100, getRandom(1, SCG.viewport.logical.height -1));
                destination = new V2(SCG.viewport.logical.width+100, getRandom(1, SCG.viewport.logical.height -1));
                break;
        }

        switch(getRandomInt(0,2)){
            case 0:
                let size = getRandom(0.5, 1.5);
                this.addGo(new MovingStar({
                    speed: getRandom(0.75, 2),
                    size: new V2(size, size),
                    position: position,
                    destination: destination,
                    colorSwitching: getRandomBool()
                }), 2);
                break;
            case 1:
                this.addGo(new Meteor({
                    start: position,
                    end: destination,
                    path: [destination],
                    speed: getRandom(10,20),
                    length: getRandomInt(50,200),
                    width: getRandom(0.5,1)
                }), 2);
                break;
            case 2: 
                let rainCount = getRandomInt(5,10);
                for(let i = 0;i < rainCount;i++){
                    let rDest = destination.add(new V2(getRandomInt(-100, 100),getRandomInt(-100, 100)));
                    this.meteorRainQueue.push(new Meteor({
                        start: position.add(new V2(getRandomInt(-30, 30),getRandomInt(-30, 30))),
                        end: rDest,
                        path: [rDest],
                        speed: getRandom(18,22),
                        length: getRandomInt(100,200),
                        width: getRandom(0.3,0.6)
                    }));
                }
                break;
        }
        
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        doWorkByTimer(this.timer ,now);
        doWorkByTimer(this.meteorRainTimer ,now);
    }
}

class Meteor extends MovingGO {
    constructor (options = {}) {
        options = assignDeep({}, {
            speed: 1,
            width: 0.5,
            length: 100,
            colors: ['rgba(175, 206, 255, 1)', 'rgba(255, 209, 238, 0.5)', 'rgba(255, 255, 255, 0)'],
            position: new V2(),
            size: new V2(10, 10),
            start: new V2,
            end: new V2(100,100),
            isCustomRender: true,
            setDeadOnDestinationComplete: true
        }, options);

        super(options);

        this.direction = this.start.direction(this.end);
        let dirWithLength = this.direction.mul(this.length);
        this.points = [this.start.clone(), this.start.add(dirWithLength)];
        this.size = new V2(Math.abs(this.points[0].x - this.points[1].x), Math.abs(this.points[0].y - this.points[1].y));
        
        let topLeft = new V2(Math.min(this.points[0].x,this.points[1].x), Math.min(this.points[0].y,this.points[1].y));
        this.position = topLeft.add(this.size.division(2));
        this.grad = undefined;
        this.renderPoints = [new V2(), new V2()];
    }

    internalUpdate(now) {
        if(this.renderPosition === undefined)
            return;

        if(this.direction.x > 0){
            if(this.direction.y > 0){
                this.grad= this.context.createLinearGradient(this.renderBox.topLeft.x, this.renderBox.topLeft.y, this.renderBox.bottomRight.x, this.renderBox.bottomRight.y);
                this.renderPoints[0] = this.renderBox.topLeft;
                this.renderPoints[1] = this.renderBox.bottomRight;
            }
            else {
                this.grad= this.context.createLinearGradient(this.renderBox.bottomLeft.x, this.renderBox.bottomLeft.y, this.renderBox.topRight.x, this.renderBox.topRight.y);
                this.renderPoints[0] = this.renderBox.bottomLeft;
                this.renderPoints[1] = this.renderBox.topRight;
            }
        }
        else {
            if(this.direction.y > 0){
                this.grad = this.context.createLinearGradient(this.renderBox.topRight.x, this.renderBox.topRight.y, this.renderBox.bottomLeft.x, this.renderBox.bottomLeft.y);
                this.renderPoints[0] = this.renderBox.topRight;
                this.renderPoints[1] = this.renderBox.bottomLeft;
            }
            else {
                this.grad = this.context.createLinearGradient(this.renderBox.bottomRight.x, this.renderBox.bottomRight.y, this.renderBox.topLeft.x, this.renderBox.topLeft.y);
                this.renderPoints[0] = this.renderBox.bottomRight;
                this.renderPoints[1] = this.renderBox.topLeft;
            }
        }
    }

    customRender(){
        let prevLineWidth = this.context.lineWidth;
        this.context.lineWidth = this.width*SCG.viewport.scale;
        let prevStrokeStyle = this.context.strokeStyle;

        this.grad.addColorStop(0, this.colors[2]);
        this.grad.addColorStop(0.5, this.colors[1]);
        this.grad.addColorStop(1,  this.colors[0]);

        this.context.strokeStyle = this.grad;

        this.context.beginPath();
        this.context.moveTo(this.renderPoints[0].x,this.renderPoints[0].y);
        this.context.lineTo(this.renderPoints[1].x,this.renderPoints[1].y);
        
        this.context.stroke();

        this.context.lineWidth = prevLineWidth;
        this.context.strokeStyle = prevStrokeStyle;
    }

}

class MovingStar extends MovingGO {
    constructor (options = {}) {
        options = assignDeep({}, {
            speed: 1,
            color: [255,255,255],
            size: new V2(0.5,0.5),
            position: new V2(),
            setDeadOnDestinationComplete: true,
            isCustomRender: true,
            colorSwitching: false
        }, options);

        super(options);

        if(this.destination)
            this.setDestination(this.destination);

        this.fillStyle = `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;

        let colorSwitchingTimerDelay = getRandomInt(1000,3000);
        if(this.colorSwitching){
            this.colorSwitchingProcesser();
            this.colorSwitchingTimer = createTimer(colorSwitchingTimerDelay, this.colorSwitchingProcesser, this);
        }
    }

    colorSwitchingProcesser(){
        this.colorSwitchingDelta = [getRandom(0.1, 2)*(getRandomBool() ? 1 : -1), getRandom(0.1, 2)*(getRandomBool() ? 1 : -1), getRandom(0.1, 2)*(getRandomBool() ? 1 : -1)]
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let rp = this.renderPosition;
        let rsx = this.renderSize.x;
        let rsy = this.renderSize.y;
        this.context.fillRect(rp.x - rsx/2, rp.y - rsy/2, rsx,rsy);
    }

    beforePositionChange(now){
        if(this.colorSwitching){
            for(let i = 0; i< 3; i++){
                this.color[i]+=this.colorSwitchingDelta[i];
                if(this.color[i] < 0){
                    this.color[i] = 0;
                    this.colorSwitchingDelta[i]*=-1;
                }
                    
                if(this.color[i] > 255)
                {
                    this.color[i] = 255;
                    this.colorSwitchingDelta[i]*=-1;
                }
            }

            this.fillStyle = `rgb(${parseInt(this.color[0])}, ${parseInt(this.color[1])}, ${parseInt(this.color[2])})`;
            
            doWorkByTimer(this.colorSwitchingTimer, now);
        }
            
    }
}