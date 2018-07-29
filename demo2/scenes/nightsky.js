class NightSkyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
        }, options);

        super(options);

        new StarsLayer({starsConfigs: {
            count: 500,
            opacity: 0.1,
            speed: 0.01
        }, level: 0, scene: this})

        new StarsLayer({starsConfigs: {
            count: 300,
            opacity: 0.3,
            speed: 0.01
        }, level: 1, scene: this})

        // this.addGo(new MovingStar({
        //     path: [new V2(50,50), new V2(150,50), new V2(150,150), new V2(50,150),]
        // }), 2);

        this.timer = {
            lastTimeWork: new Date,
            delta : 0,
            currentDelay: 2000,
            originDelay: 2000,
            doWorkInternal : this.objectsGenerator,
            context: this
        }
    }

    objectsGenerator(){
        if(!getRandomBool())
            return;

        let position = new V2();
        let destination = new V2();

        switch(getRandomInt(0,3))
        {
            case 0:
                position = new V2(getRandom(1, SCG.viewport.logical.width - 1), -1);
                destination = new V2(getRandom(1, SCG.viewport.logical.width - 1), SCG.viewport.logical.height + 1);
                break;
            case 1:
                position = new V2(SCG.viewport.logical.width+1, getRandom(1, SCG.viewport.logical.height -1));
                destination = new V2(-1, getRandom(1, SCG.viewport.logical.height -1));
                break;
            case 2:
                position = new V2(getRandom(1, SCG.viewport.logical.width - 1), SCG.viewport.logical.height + 1);
                destination = new V2(getRandom(1, SCG.viewport.logical.width - 1), -1);
                break;
            case 3:
                position = new V2(-1, getRandom(1, SCG.viewport.logical.height -1));
                destination = new V2(SCG.viewport.logical.width+1, getRandom(1, SCG.viewport.logical.height -1));
                break;
        }

        let size = getRandom(0.5, 1.5);
        this.addGo(new MovingStar({
            speed: getRandom(0.75, 2),
            size: new V2(size, size),
            position: position,
            destination: destination,
            colorSwitching: getRandomBool()
        }), 2);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        doWorkByTimer(this.timer ,now);
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
            this.colorSwitchingTimer = {
                lastTimeWork: new Date,
                delta : 0,
                currentDelay: colorSwitchingTimerDelay,
                originDelay: colorSwitchingTimerDelay,
                doWorkInternal : this.colorSwitchingProcesser,
                context: this
            }
        }
    }
    
    beforePositionChange() {
        let foo = 'bar';
    }

    colorSwitchingProcesser(){
        this.fillStyle = `rgb(${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${getRandomInt(0,255)})`;
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let rp = this.renderPosition;
        let rsx = this.renderSize.x;
        let rsy = this.renderSize.y;
        this.context.fillRect(rp.x - rsx/2, rp.y - rsy/2, rsx,rsy);
    }

    beforePositionChange(now){
        if(this.colorSwitching)
            doWorkByTimer(this.colorSwitchingTimer, now);
    }
}