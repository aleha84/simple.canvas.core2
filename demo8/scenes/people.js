class PeopleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true, 
            }
        }, options)

        super(options);
    }

    start() {
        this.yClamps = [-20, 20];

        this.registerTimer(createTimer(250, () => {
            this.peopleGenerator();
        }, this, true))
    }

    peopleGenerator() {
        
        let yShift = getRandomInt(this.yClamps[0], this.yClamps[1]);
        this.addGo(new PixelMan({
            position: new V2(-10, yShift + this.sceneCenter.y),
            xDestination: this.viewport.x + 10,
            moveMaxMultiplier: getRandom(1,5),
            bounceMaxDivider: getRandom(4,10)

        }), yShift - this.yClamps[0]);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#27C5DD');
    }
}

class PixelMan extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(2,6),
            renderValuesRound: true,
            xDestination: 300,
            bounceMaxDivider: 4,
            moveMaxMultiplier: 1,
            value: 1
        }, options)

        super(options);
    }

    // destinationCompleteCheck(){
    //     return Math.abs(this.position.x-this.originX) > 50
    // }

    // destinationCompleteCallBack() {
    //     this.originX = this.position.x;
    //     this.mDirection*=-1;
    //     this.setDestination(new V2((this.mDirection > 0 ? 1:-1)*50 ,0), true);
    // }

    init() {
        this.bounceStepDuration = 10;
        this.bounceMax = this.size.y/this.bounceMaxDivider;
        this.moveMax = this.size.x*this.moveMaxMultiplier;

        this.bounce = { 
            time: 0, duration: this.bounceStepDuration,startValue: this.position.y, change: -this.bounceMax, max: this.bounceMax, direction: -1, 
            type: 'sin', method: 'out', 
        };

        this.move = {
            time: 0, duration: this.bounceStepDuration*2,startValue: this.position.x, change: this.moveMax, max: this.moveMax, direction: 1, 
            type: 'linear', method: 'base', 
        }

        this.originX = this.position.x;

        this.topColor = hsvToHex({hsv:[getRandomInt(0,360), 77,77]})//'#C6752F';
        this.skinColor = '#ED9B79';
        this.lowerColor = hsvToHex({hsv:[getRandomInt(0,360), 56,56]})//'#7E9641';

        this.imgLeft = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        this.imgRight = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        
        this.choseImg();
        //this.setDestination(new V2(50, 0), true);

        this.startBounce();
    }

    choseImg() {
        this.img = this.move.direction > 0 ? this.imgRight : this.imgLeft;
    }

    startBounce() {
        this.bounceTimer = this.registerTimer(createTimer(20, () => {
            let b = this.bounce;
            let m = this.move;
            let y = easing.process(b);
            
            this.position.y = y;
            this.position.x = easing.process(m);

            this.needRecalcRenderProperties = true;

            b.time++;
            m.time++;
            if(b.time > b.duration){
                b.direction*=-1;

                b.time = 0;
                b.startValue = this.position.y;
                b.change = (b.direction > 0 ? 1 : -1) * b.max;
                b.method =this.direction > 0 ? 'in' : 'out'

                if(b.direction < 0){
                    m.time = 0;
                    m.startValue = this.position.x;

                    // if(Math.abs(this.position.x-this.originX) > 50){
                    //     this.originX = this.position.x;
                    //     //this.mDirection*=-1;
                    //     m.direction*=-1;
                    //     m.change = m.direction*m.max;
                    //     this.choseImg();
                    // }

                    if(this.position.x > this.xDestination){
                        this.setDead();
                    }
                }
            }
            // else {
            //     this.position.x += this.speed*this.mDirection;
            // }

        }, this, true));
    }

    stopBounce() {
        this.unregTimer(this.bounceTimer);
    }
}