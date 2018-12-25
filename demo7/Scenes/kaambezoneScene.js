class KaambezoneScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options)

        super(options);

        this.snowflakesCache = [];
        this.snowflakeSize = new V2(2,2);
        this.windDirection = new V2(0,1).rotate(0);
        

        this.snowflakeGenerationTimer = createTimer(100, this.snowflakeGenerationTimerMethod, this, true);
    }

    snowflakeGenerationTimerMethod(){
        if(this.snowflakesCache.length){
            let sf = this.snowflakesCache.pop();
            sf.disabled = false;
        }
        else {
            let position = new V2(getRandom(-this.viewport.x*0.9, this.viewport.x*0.9),-1);
            this.addGo(new Snowflake({
                img: this.snowflakeImgGenerator(1),
                position: position,
                destination: position.add(this.windDirection.mul(this.viewport.y*2)), //new V2(this.viewport.x, this.viewport.y),
                size: this.snowflakeSize.clone(),
                speed: 0.5
            }))
        }
    }

    snowflakeImgGenerator(opacity) {
        return createCanvas(new V2(20, 20), function(innerCtx, size){
            innerCtx.fillStyle=`rgba(255,255,255,${opacity})`;
            drawFigures(innerCtx, [[new V2(0,5), new V2(5,0), new V2(15,0), new V2(20,5), new V2(20,15), new V2(15,20), new V2(5,20), new V2(0,15), new V2(0,5)]])
            innerCtx.fill();
        });
    }

    preMainWork(now){
        if(this.snowflakeGenerationTimer)
            doWorkByTimer(this.snowflakeGenerationTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class Snowflake extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 1,
            positionChangeProcesser: function() { return this.positionChangeProcesserInternal() },
        }, options)

        super(options);

        this.initialPosition = this.position.clone();
        this.initialDestination = this.destination.clone();
    }

    init(){
        this.setDestination(this.destination);
        this.speedV2 = this.direction.mul(this.speed);
    }

    positionChangeProcesserInternal(){
        this.position.add(this.speedV2, true);
        this.position.x += Math.sin(this.position.y/20)*0.5;
    }

    destinationCompleteCheck(){
        return this.position.x > this.parentScene.viewport.x || this.position.y > this.parentScene.viewport.y;
    }

    destinationCompleteCallBack(){
        this.position = this.initialPosition.clone();
        this.destination = this.initialDestination.clone();
        this.setDestination(this.destination);
        this.disabled = true;

        this.parentScene.snowflakesCache.push(this);
    }
}