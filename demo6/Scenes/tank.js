class TankScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
            
        }, options);

        super(options);

        this.movementSpeed = 0.5;

        this.trailImg = createCanvas(new V2(3,1), function(ctx, size){
            ctx.fillStyle = 'white';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.tankSize = new V2(50, 30);
        this.trailSize = new V2(2, this.tankSize.y/4);
        this.tankPosition = new V2(this.viewport.x/3, this.viewport.y/2);
        this.tank = new Tank({
            position: this.tankPosition,
            size: this.tankSize,
            bodyImg: createCanvas(this.tankSize, function(ctx, size) {
                ctx.fillStyle = 'red';
                ctx.fillRect(0,0, size.x, size.y);
            }),
            towerImg: createCanvas(this.tankSize, function(ctx, size) {
                ctx.fillStyle = 'green';
                ctx.fillRect(size.x/4,size.y/4, size.x/4, size.y/2);
            }),
            
        });

        this.addGo(this.tank, 10);

        this.trailTimer = createTimer(200, this.trailTimerMethod, this, false);
    }

    trailTimerMethod(){
        this.addGo(new Trail({
            position: new V2(this.tankPosition.x - this.tankSize.x/2, this.tankPosition.y-this.tankSize.y/2+this.trailSize.y/2),
            size: this.trailSize,
            speed: this.movementSpeed,
            img: this.trailImg
        }), 9);

        this.addGo(new Trail({
            position: new V2(this.tankPosition.x - this.tankSize.x/2, this.tankPosition.y+this.tankSize.y/2-this.trailSize.y/2),
            size: this.trailSize,
            speed: this.movementSpeed,
            img: this.trailImg
        }), 9);
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now){
        if(this.trailTimer)
            doWorkByTimer(this.trailTimer, now);
    }
}

class Tank extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(50, 30),
            
        }, options);

        super(options);

        this.addChild(new GO({
            size: this.size.clone(),
            position: new V2(),
            img: this.bodyImg
        }));

        this.addChild(new GO({
            size: this.size.clone(),
            position: new V2(),
            img: this.towerImg
        }));
    }
}

class Trail extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            speed: 1,
            setDeadOnDestinationComplete: true,
            destinationCompleteCheck: function(){
                return this.position.x < -1;
            }
        }, options);
        super(options);

        this.setDestination(new V2(-1, this.position.y));
    }
}