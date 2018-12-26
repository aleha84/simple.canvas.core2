class KaambezoneScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options)

        super(options);

        this.snowflakes = [];
        this.snowFlakesLayers = [
            {
                layer: 10,
                count: 1,
                size: new V2(2,2),
                speedKoef: 1,
                img: this.snowflakeImgGenerator(1)
            },
            {
                layer: 8,
                count: 3,
                size: new V2(1.5,1.5),
                speedKoef: 0.75,
                img: this.snowflakeImgGenerator(0.75)
            },
            {
                layer: 7,
                count: 6,
                size: new V2(1,1),
                speedKoef: 0.5,
                img: this.snowflakeImgGenerator(0.5)
            }
        ]
        this.snowflakesCache = [];
        this.snowflakeSize = new V2(2,2);
        
        this.windDirectionAngle = {
            current: 0,
            max: 0,
            min: -45,
            step: 0.5,
            direction: -1
        }

        this.snowFlakesSpeed = {
            current: 0.25,
            step: 0.25,
            min: 0.25,
            max: 5,
            direction: 1
        }

        this.windPower = {
            current: 0,
            step: 0.01,
            min: 0,
            max: 5,
            direction: 1
        }

        this.windDirection = new V2(0,1).rotate(0);

        this.snowflakeGenerationTimer = createTimer(50, this.snowflakeGenerationTimerMethod, this, true);
        //this.snowflakesSpeedIncreaseTimer = createTimer(1000, this.snowflakesSpeedIncreaseTimerMethod, this, false);
        this.windIncreaseTimer = createTimer(100, this.windIncreaseTimerMethod, this, false);
    }

    windIncreaseTimerMethod(){
        for(let i =0;i < this.snowflakes.length;i++){
            this.snowflakes[i].windPower = this.windPower.current;
        }

        let wv = this.windPower;

        wv.current += wv.direction*wv.step;
        if(wv.current < wv.min){
            wv.current = wv.min;
            wv.direction = 1;
        }

        if(wv.current > wv.max){
            wv.current = wv.max;
            wv.direction = -1;
        }
    }

    snowflakesSpeedIncreaseTimerMethod(){
        let wd = this.windDirectionAngle;
        let ss = this.snowFlakesSpeed;

        let currentWindDirection = new V2(0,1).rotate(wd.current);

        for(let i =0;i < this.snowflakes.length;i++){
            let sf = this.snowflakes[i];
            sf.destination = sf.initialPosition.add(currentWindDirection.mul(this.viewport.y*2))
        }

        
        wd.current += wd.direction*wd.step;
        if(wd.current < wd.min){
            wd.current = wd.min;
            wd.direction = 1;
        }

        if(wd.current > wd.max){
            wd.current = wd.max;
            wd.direction = -1;
        }

        ss.current+=ss.direction*ss.step;
        if(ss.current < ss.min){
            ss.current = ss.min;
            ss.direction = 1;
        }

        if(ss.current > ss.max){
            ss.current = ss.max;
            ss.direction = -1;
        }
    }

    snowflakeGenerationTimerMethod(){
        for(let i = 0; i < this.snowFlakesLayers.length; i++){
            let layerInfo = this.snowFlakesLayers[i];

            for(let j = 0; j < layerInfo.count; j++){
                if(this.snowflakesCache[layerInfo.layer] == undefined){
                    this.snowflakesCache[layerInfo.layer] = [];
                }

                if(this.snowflakesCache[layerInfo.layer].length){
                    let sf = this.snowflakesCache[layerInfo.layer].pop();
                    sf.disabled = false;
                }
                else {
                    let position;
                    let isUp =  getRandomInt(0,3) == 3;
        
                    if(!isUp){
                        position = new V2(getRandom(-this.viewport.x, -1), getRandom(-this.viewport.y*0.9, this.viewport.y*0.7))
                    }
                    else 
                        position = new V2(getRandom(0, this.viewport.x*0.9),-1);
        
                    this.snowflakes.push(
                        this.addGo(new Snowflake({
                            layer: layerInfo.layer,
                            img: layerInfo.img,//this.snowflakeImgGenerator(1),
                            position: position,
                            destination: position.add(this.windDirection.mul(this.viewport.y*2)), //new V2(this.viewport.x, this.viewport.y),
                            size: layerInfo.size,//this.snowflakeSize.clone(),
                            speed: 0.25,
                            speedKoef: layerInfo.speedKoef,
                            koefficients: {
                                k1: getRandom(0.9, 1.1),
                                k2: getRandom(0.9, 1.1),
                                sin: getRandomBool()
                            }
                    }), layerInfo.layer))
                }
            }
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

        if(this.windIncreaseTimer)
            doWorkByTimer(this.windIncreaseTimer, now);
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
            koefficients: {
                k1: 1,
                k2: 1
            },
            windPower: 0,
            layer: 0,
        }, options)

        super(options);

        this.initialPosition = this.position.clone();
        this.initialDestination = this.destination.clone();
    }

    init(){
        this.setDirectionVector();
    }

    positionChangeProcesserInternal(){
        this.position.add(this.speedV2.mul(this.speedKoef), true);
        this.position.x += (((this.koefficients.sin ? Math.sin : Math.cos).call(null, this.position.y/(20*this.koefficients.k1)) *0.5*this.koefficients.k2) + this.windPower)*this.speedKoef;
    }

    destinationCompleteCheck(){
        return this.position.x > this.parentScene.viewport.x || this.position.y > this.parentScene.viewport.y;
    }

    setDirectionVector(){
        this.setDestination(this.destination);
        this.speedV2 = this.direction.mul(this.speed);
    }

    destinationCompleteCallBack(){
        this.position = this.initialPosition.clone();
        this.destination = this.initialDestination.clone();
        
        this.setDirectionVector();

        this.disabled = true;

        this.parentScene.snowflakesCache[this.layer].push(this);
    }

    internalRender(){
        // SCG.contexts.background.fillStyle = 'blue';
        // SCG.contexts.background.fillRect(this.renderPosition.x - this.renderSize.x/2, this.renderPosition.y - this.renderSize.y/2, this.renderSize.x, this.renderSize.y);

        // SCG.contexts.background.fillStyle = 'black';
    }
}