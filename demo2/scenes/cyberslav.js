class CyberslavScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            snowflakes: [],
            wind: {
                enabled: false,
                originalPower: 2.5,
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
                //innerCtx.fillRect(0,0,size.x,size.y);
                drawFigures(innerCtx, [[new V2(0,5), new V2(5,0), new V2(15,0), new V2(20,5), new V2(20,15), new V2(15,20), new V2(5,20), new V2(0,15), new V2(0,5)]])
                innerCtx.fill();
            });

            let snowFlakeFireImages = [
            ];

            for(let i = 0; i<25; i++){
                snowFlakeFireImages.push(createCanvas(new V2(20, 20), function(innerCtx, size){
                        innerCtx.fillStyle=`rgba(${getRandomInt(220, 255)},${getRandomInt(125,180)},${getRandomInt(10, 80)},${li/10})`;
                        //innerCtx.fillRect(0,0,size.x,size.y);
                        drawFigures(innerCtx, [[new V2(0,5), new V2(5,0), new V2(15,0), new V2(20,5), new V2(20,15), new V2(15,20), new V2(5,20), new V2(0,15), new V2(0,5)]])
                        innerCtx.fill();
                    }));
            }

            for(let i = 0; i<10; i++){
                snowFlakeFireImages.push(createCanvas(new V2(20, 20), function(innerCtx, size){
                        innerCtx.fillStyle=`rgba(${getRandomInt(245, 255)},${getRandomInt(0,50)},${getRandomInt(0, 50)},${li/10})`;
                        //innerCtx.fillRect(0,0,size.x,size.y);
                        drawFigures(innerCtx, [[new V2(0,5), new V2(5,0), new V2(15,0), new V2(20,5), new V2(20,15), new V2(15,20), new V2(5,20), new V2(0,15), new V2(0,5)]])
                        innerCtx.fill();
                    }));
            }

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
                    imagesGold: snowFlakeFireImages,
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
            size:titleSize.mul(0.6).clone(),
            originSize: titleSize.clone(),
            position: new V2(this.viewport.x/2-titleSize.x/3, this.viewport.y/2)
        });
        this.addGo(this.title, 7);

        let bottomShineSize = new V2(this.viewport.x, this.viewport.y/4);
        this.addGo(new GO({
            size: bottomShineSize.clone(),
            position: new V2(this.viewport.x/2, this.viewport.y - bottomShineSize.y/2),
            img: createCanvas(bottomShineSize, function(ctx, size){
                let grd = ctx.createLinearGradient(size.x/2, size.y, size.x/2, 0);
                grd.addColorStop(0, 'rgba(255,255,255,0.2)');
                grd.addColorStop(1, 'rgba(255,255,255,0)');      
                ctx.fillStyle=grd;
                ctx.fillRect(0,0,size.x, size.y);
            })
        }),11)

        this.windTimer = createTimer(3000, this.toggleWind, this, false);
    }

    toggleWind(){
        this.wind.enabled = !this.wind.enabled;

        for(let sf of this.snowflakes){
            sf.toggleWind();
        }

        this.character.toggleEyes();
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
        options.yAxis.originSpeed = options.yAxis.speed;

        super(options);

        this.originalSize = this.size.clone();
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
            this.size = this.originalSize.clone();
        }
        else {
            this.size = new V2(this.originalSize.x*2, this.originalSize.y/1.5);
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
                this.img = this.imagesGold[getRandomInt(0, this.imagesGold.length-1)]// this.imgGold;
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

        this.leftEye = new Eye({
            img: createCanvas(new V2(20,20), function(ctx, size){
                ctx.fillStyle = '#FEF05F';
                ctx.lineJoin = 'round';
                drawFigures(ctx, [[new V2(5,5),new V2(20,3), new V2(20,13), new V2(6,17), new V2(5,5)]])
                ctx.fill();
            }), 
            size: new V2(3,3),
            position: new V2(-4,-125.5),
        });

        this.addChild(this.leftEye);

        this.rightEye = new Eye({
            img: createCanvas(new V2(40,20), function(ctx, size){
                ctx.fillStyle = '#FEF05F';
                ctx.lineJoin = 'round';
                drawFigures(ctx, [[new V2(0,15), new V2(7,8), new V2(25,5),new V2(40,5),new V2(30,15), new V2(25,15), new V2(15,16.5), new V2(0,17.5), new V2(0, 15)]])
                ctx.fill();
            }), 
            size: new V2(8,4),
            position: new V2(10,-128),
        });

        this.addChild(this.leftEye);
        this.addChild(this.rightEye);
    }

    toggleEyes(){
        this.leftEye.createFadeInOutTimer();
        this.rightEye.createFadeInOutTimer();
    }
}

class Eye extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            fadeInOut: {
                current: 0,
                direction: 1,
                delta: 0.075
            }
        }, options);

        super(options);

        
    }

    createFadeInOutTimer(){
        this.fadeInOutTimer = createTimer(40, this.fadeInOutMethod, this, true);
    }

    fadeInOutMethod(){
        this.fadeInOut.current+=this.fadeInOut.delta*this.fadeInOut.direction;

        if(this.fadeInOut.current > 1)
            this.fadeInOut.current = 1;

        if(this.fadeInOut.current < 0)
            this.fadeInOut.current = 0;

        if(this.fadeInOut.current >= 1 || this.fadeInOut.current <= 0){
            this.fadeInOut.direction*=-1;
            this.fadeInOutTimer = undefined;
        }
    }

    internalUpdate(now){
        if(this.fadeInOutTimer){
            doWorkByTimer(this.fadeInOutTimer, now);
        }
    }

    internalPreRender() {
        this.context.save();
        this.context.globalAlpha = this.fadeInOut.current;
    }

    internalRender() {
        this.context.restore();
    }
}


class Title extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(512,240)
        }, options);

        super(options);

        this.shineImg = createCanvas(this.originSize.clone(), function(innerCtx, size){
            var grd = innerCtx.createRadialGradient(size.x/2, size.y/2, 0, size.x/2, size.y/2, size.y/2);
            grd.addColorStop(0, 'rgba(255,168,39,0.5)');
            grd.addColorStop(0.5, 'rgba(237,202,76,0.25)');
            grd.addColorStop(1, 'rgba(255,255,255,0)');
            innerCtx.translate(-size.x/2,0);
            innerCtx.scale(2,1);
            
            innerCtx.fillStyle = grd;
            innerCtx.fillRect(0,0,size.x,size.y);
        });

        this.addChild(new GO({
            position: new V2(),
            size: this.originSize.clone(),
            img: this.shineImg
        }));
        this.addChild(new GO({
            position: new V2(),
            size: this.originSize.clone(),
            imgPropertyName: 'c_title'
        }));

        
        
    }
}