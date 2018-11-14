class CyberslavScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            snowflakes: [],
            wind: {
                enabled: false,
                originalPower: 2,
                direction: 1
            }
        }, options);

        super(options);

        let sfSize = new V2(2,2);
        let count = 100;
        let speed = 0.5;
        let koef = 1;
        for(let li = 10; li > 5; li--){
            let snowflakeImg = createCanvas(new V2(20, 20), function(innerCtx, size){
                innerCtx.fillStyle=`rgba(255,255,255,${li/10})`;
                innerCtx.fillRect(0,0,size.x,size.y);
            });

            let snowflakeGoldImg = createCanvas(new V2(20, 20), function(innerCtx, size){
                innerCtx.fillStyle=`rgba(237,202,76,${li/10})`;
                innerCtx.fillRect(0,0,size.x,size.y);
            });

            for(let i = 0; i < count; i++){
                var sf = new Snowflake({
                    koef: koef,
                    speed: speed,
                    position: new V2(getRandomInt(-2*this.viewport.x,this.viewport.x), getRandomInt(0,this.viewport.y)),
                    img: snowflakeImg,
                    imgOriginal: snowflakeImg,
                    imgGold: snowflakeGoldImg,
                    isGold: false,
                    size: sfSize.clone(),
                    wind: {
                        power: this.wind.originalPower
                    }
                });
                
                this.snowflakes.push(sf);
                this.addGo(sf,li);
            }

            sfSize.mul(0.9, true);
            count*=2;
            koef*=0.8;
        }
        
        let characterSize = new V2(210,300);
        this.character = new Character({
            size:characterSize,
            position: new V2(this.viewport.x-characterSize.x/2, this.viewport.y-characterSize.y/3)
        });
        this.addGo(this.character, 10);

        let titleSize = new V2(256,120);
        this.title = new Title({
            size:titleSize,
            position: new V2(this.viewport.x/2-titleSize.x/3, this.viewport.y/2)
        });
        this.addGo(this.title, 7);

        this.windTimer = createTimer(3000, this.toggleWind, this, false);
    }

    toggleWind(){
        this.wind.enabled = !this.wind.enabled;

        for(let sf of this.snowflakes){
            sf.toggleWind();
        }
    }

    preMainWork(now){
        doWorkByTimer(this.windTimer, now);
    }

    backgroundRender(){
        SCG.contexts.background.drawImage(SCG.images.c_background,0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class Snowflake extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            speed:0.5,
            destination: new V2(-100,-100),
            wind: {
                enabled: false,
                power: 1
            },
            xAxis: {
                shift: 0,
                current: 0,
                originalShiftChangeDelta: 0.25,
                shiftChangeDelta: 0.25
            },
            yAxis: {
                shift: 0,
                current: 0,
                speed: 0.5
            },
            positionChangeProcesser: function(){
                let oldPosition = this.position.clone();
                if(!this.wind.enabled){
                    this.xAxis.current = Math.sin(this.yAxis.current/6/this.koef)*10*this.koef
                
                    this.position = new V2(this.xAxis.current+this.xAxis.shift, this.yAxis.current+this.yAxis.shift);
                    this.yAxis.current+=this.yAxis.speed;
                    this.xAxis.shift+=this.xAxis.shiftChangeDelta*this.koef;
                }
                else {
                    this.position.add(new V2(this.xAxis.shiftChangeDelta*this.koef, this.yAxis.speed), true);
                }

                if(this.position.y > this.parentScene.viewport.y+this.size.y
                    || this.position.x > this.parentScene.viewport.x*1.25){

                    this.position = new V2(getRandomInt(-2*this.parentScene.viewport.x,this.parentScene.viewport.x), 0);
                    this.xAxis.shift = this.position.x;

                    this.yAxis.current = 0;
                    this.yAxis.shift = 0;
                    this.isGold = false;
                    this.img = this.imgOriginal;
                }

                return this.position.substract(oldPosition);
            }
        }, options);

        options.speed*=options.koef;
        options.xAxis.shift = options.position.x;
        options.yAxis.current = options.position.y;
        options.yAxis.speed = options.speed;

        super(options);
    }

    toggleWind() {
        if(this.wind.enabled){
            this.toggleWindTimer = createTimer(getRandomInt(0, 500), this.toggleWindInternal, this, true);
        }
        else {
            this.toggleWindInternal();
        }
        
    }

    toggleWindInternal(){
        this.toggleWindTimer = undefined;
        this.wind.enabled = !this.wind.enabled;

        this.xAxis.shiftChangeDelta = this.wind.enabled ? this.wind.power : this.xAxis.originalShiftChangeDelta;

        if(!this.wind.enabled){
            this.xAxis.shift = this.position.x;
            this.xAxis.current = 0;
            this.yAxis.shift = this.position.y;
            this.yAxis.current = 0;
        }
    }

    internalUpdate(now){
        if(this.toggleWindTimer){
            doWorkByTimer(this.toggleWindTimer, now);
        }

        if(!this.isGold){
            if(!this.parentScene.title.box)
                return;

            if(this.parentScene.title.box.isPointInside(this.position)){
                this.isGold = true;
                this.img = this.imgGold;
            }
        }
    }
}

class Character extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            imgPropertyName: 'character',
            size: new V2(69,102)
        }, options);

        super(options);
    }
}

class Title extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            imgPropertyName: 'c_title',
            size: new V2(512,240)
        }, options);

        super(options);

        this.shineImg = createCanvas(this.size.clone(), function(innerCtx, size){
            var grd = innerCtx.createRadialGradient(size.x/2, size.y/2, 0, size.x/2, size.y/2, size.y/2);
            grd.addColorStop(0, 'rgba(255,168,39,0.5)');
            grd.addColorStop(0.5, 'rgba(237,202,76,0.25)');
            grd.addColorStop(1, 'rgba(255,255,255,0)');
            innerCtx.translate(-size.x/2,0);
            innerCtx.scale(2,1);
            
            innerCtx.fillStyle = grd;
            innerCtx.fillRect(0,0,size.x,size.y);
        });

        this.shineGo = new GO({
            position: new V2(),
            size: this.size.clone(),
            //img: this.shineImg
        });

        this.addChild(new GO({
            position: new V2(),
            size: this.size.clone(),
            img: this.shineImg
        }));
        this.addChild(this.shineGo);
        
    }
}