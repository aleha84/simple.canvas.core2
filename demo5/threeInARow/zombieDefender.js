class ZombieDefender extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.addChild(new Zombie({
            position: new V2(0, -100)
        }));

        this.shotCanvas = this.createShot();

        for(let i = 0; i < 5; i++){
            let position = new V2(-50/2 + i*10, this.size.y/2)
            this.addChild(new Soldier({
                position: position,
                field: this,
                shotImg: this.shotCanvas
            }));
        }
        
    }

    createShot() {
        let canvas = document.createElement('canvas');
        canvas.width = 10;
        canvas.height = 50;
        let context = canvas.getContext('2d');
        let gradient = context.createLinearGradient(5,0,5,50);
        gradient.addColorStop(0, 'yellow');
        gradient.addColorStop(1, 'red');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 10, 50);

        return canvas;
    }
}

class Zombie extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            imgPropertyName: 'zombies',
            destSourceSize: new V2(32,32),
            size: new V2(16,16),
            frames: [new V2(0,0), new V2(64,0)],
            currentFrame: 0,
            // isAnimated: true,
            // animation: {
            //     totalFrameCount: 3,
            //     framesInRow: 12,
            //     framesRowsCount: 1,
            //     frameChangeDelay: 300,
            //     destinationFrameSize: new V2(32,32),
            //     sourceFrameSize: new V2(32,32),
            //     loop: true,
            //     startFrame: 1,
            //     endFrame: 3
            // }
        }, options);

        super(options);
        this.frameSwitch();
        this.frameSwitchTimer = createTimer(300, this.frameSwitch, this, true);
    }

    frameSwitch(){
        if(this.currentFrame+1 >= this.frames.length) {
            this.currentFrame = 0;
        }
        else {
            this.currentFrame++;
        }

        this.destSourcePosition = this.frames[this.currentFrame];
    }

    beforePositionChange(now){
        doWorkByTimer(this.frameSwitchTimer, now);
    }
}

class Shot extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(1,5),
            speed: 3,
            setDeadOnDestinationComplete: true
        }, options);

        if(options.target === undefined)
            throw 'Shot target undefined!';

        super(options);

        this.setDestination(this.target);
        this.angle = V2.up.angleTo(this.target.substract(this.position));
    }

    internalPreRender() {
        this.context.save();
        
        this.context.translate(this.renderPosition.x, this.renderPosition.y);
        this.context.rotate(degreeToRadians(this.angle));
        this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
    }

    internalRender() {
        this.context.restore();
    }
}

class Soldier extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            imgPropertyName: 'soldier_back',
            destSourceSize: new V2(54,81),
            size: new V2(10,15),
            speed: 0.5,
            isAnimated: true,
            animation: {
                totalFrameCount: 6,
                framesInRow: 7,
                framesRowsCount: 1,
                frameChangeDelay: 100,
                destinationFrameSize: new V2(10,15),
                sourceFrameSize: new V2(54,81),
                loop: true,
                startFrame: 1,
                endFrame: 6
            }
        }, options);

        super(options);

        this.setDestination(new V2(this.position.x, 0));
        this.decisionTimer = createTimer(500, this.makeDecision, this, true);
    }

    makeDecision(){
        this.fire(new V2(this.position.x-40, this.position.y-100))
    }

    fire(targetPosition){
        this.field.addChild(new Shot({
            position: this.position.clone(),
            target: targetPosition.clone(),
            img: this.shotImg
        }))
    }

    beforePositionChange(now){
        doWorkByTimer(this.decisionTimer, now);
    }

    destinationCompleteCallBack(){
        this.isAnimated = false;
        this.destSourcePosition = new V2(324,0);
    }
}