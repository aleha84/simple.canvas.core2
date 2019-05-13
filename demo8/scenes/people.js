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
        this.addGo(new PixelMan({
            position: this.sceneCenter.clone()
        }))
    }

    backgroundRender() {
        this.backgroundRenderDefault('#27C5DD');
    }
}

class PixelMan extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(2,6),
            renderValuesRound: true,
            speed: 0.3,
            mDirection: 1
        }, options)

        super(options);
    }

    destinationCompleteCheck(){
        return Math.abs(this.position.x-this.originX) > 50
    }

    destinationCompleteCallBack() {
        this.originX = this.position.x;
        this.mDirection*=-1;
        this.setDestination(new V2((this.mDirection > 0 ? 1:-1)*50 ,0), true);
    }

    init() {
        this.bounce = { time: 0, duration: 6,startValue: this.position.y, change: -this.size.y/2, max: this.size.y/2, direction: -1, type: 'cubic', method: 'out' };
        this.originX = this.position.x;

        this.img = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0,0, size.x, size.y)
        })

        this.setDestination(new V2(50, 0), true);

        this.startBounce();
    }

    startBounce() {
        this.bounceTimer = this.registerTimer(createTimer(20, () => {
            let b = this.bounce;
            let y = easing.process(b);
            this.position.y = y;
            this.needRecalcRenderProperties = true;

            b.time++;
            if(b.time > b.duration){
                b.direction*=-1;

                b.time = 0;
                b.startValue = this.position.y;
                b.change = (b.direction > 0 ? 1 : -1) * b.max;
                b.method =this.direction > 0 ? 'in' : 'out'
            }

        }, this, true));
    }

    stopBounce() {
        this.unregTimer(this.bounceTimer);
    }
}