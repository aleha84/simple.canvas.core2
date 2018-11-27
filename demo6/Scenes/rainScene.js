class RainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);

        // floor
        this.addGo(new GO({
            size: new V2(this.viewport.x, 30),
            position: new V2(this.viewport.x/2, this.viewport.y-15),
            img: createCanvas(new V2(50, 50), function(ctx, size){
                ctx.fillStyle = 'lightgray';
                ctx.fillRect(0,0,size.x, size.y)
            })
        }), 1);

        this.rainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'blue';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.splashImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.rainDropTimer = createTimer(50, this.rainDropTimerMethod, this, true);
        // this.addGo(new Splash({
        //     position: new V2(this.viewport.x/2, this.viewport.y/2),
        //     img: this.splashImg
        // }));
    }

    rainDropTimerMethod(){
        
        for(let i = 0; i < 3; i++){
            let position =new V2(getRandomInt(1, this.viewport.x-1), -10); 
            this.addGo(new RainDrop({
                position: position,
                destination:new V2(position.x, this.viewport.y-15),
                img: this.rainDropImg
            }), 3);
        }
        
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'gray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now) {
        if(this.rainDropTimer) {
            doWorkByTimer(this.rainDropTimer, now);
        }
    }
}

class RainDrop extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true
            },
            speed: 12,
            size: new V2(0.5,10),
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: true
        }, options);

        super(options);
    }

    beforeDead(){
        this.parentScene.addGo(new Splash({
            position: this.position.clone(),
            img: this.parentScene.splashImg
        }), 2);
    }
}

class Splash extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            destination: new V2(-100,-100),
            speed:0.05,
            size: new V2(1,1),
            coefficients: {
                a: 3,
                b: 10
            },
            xAxis: {
                current: 0,
                speed: 0.001,
                direction: -1
            },
            yAxis: {
                current: 0,
            },
            positionChangeProcesser: function(){
                let oldPosition = this.position.clone();
                this.yAxis.current = (this.coefficients.a*this.xAxis.current*this.xAxis.current)+this.coefficients.b*this.xAxis.current;

                if(this.yAxis.current > 0){
                    this.setDead();
                    return;
                }

                this.position = this.initialPosition.add(new V2(this.xAxis.current, this.yAxis.current));
                this.xAxis.current+=this.xAxis.direction*this.xAxis.speed;

                return this.position.substract(oldPosition); 
            }
        }, options);

        options.xAxis.speed = options.speed;

        super(options);

        this.initialPosition = this.position.clone();
    }
}