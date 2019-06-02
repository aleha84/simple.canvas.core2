class FlyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: []
            },
        }, options)

        super(options);
    }

    backgroundRender(){
        //this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }

    start() {

        // this.stars = this.addGo(new Stars({
        //     size: this.viewport.clone(),
        //     position: this.sceneCenter.clone()
        // }), 0)

        


        this.cache = {};
        this.endPoint = new V2(100, 150);
        
        this.bgImg = createCanvas(this.viewport, (ctx, size) => {
            let hsv = [180,60,20];
            let vDelta = 20;
            let maxDistance = this.viewport.x - this.endPoint.x;
            for(let r = 0; r < size.y;r++){
                for(let c = 0; c < size.x; c++){
                    let p = new V2(c,r);
                    let distance = this.endPoint.distance(p);
                    let v = vDelta;
                    if(distance > maxDistance){
                        v = vDelta;
                    }
                    else {
                        v = vDelta*distance/maxDistance;
                    }

                   // v = Math.ceil(v/5)*5;
                   v = fastRoundWithPrecision(v);

                    ctx.fillStyle = hsvToHex({hsv: [hsv[0], hsv[1], hsv[2]+v]});
                    ctx.fillRect(c,r,1,1);
                }
            }  
        })
        
        this.layersCount = 1;
        this.count = 0;
        this.generator = this.registerTimer(createTimer(100, () => {
            if(this.count == 100)
                {
                    this.unregTimer(this.generator);
                    return;
                }

            for(let l = 0; l < this.layersCount; l++){
                let baseColorHSV = [180,20, 100];
                let d = getRandomInt(0,3);
                let length = this.viewport.x;
                let position = new V2();
                let duration = 100*(1 + 1.5*l);
                let vChange = -75;
                let layer = 10 - l;
                let lCoef = this.layersCount == 1? 1 : 1-(0.5*l/(this.layersCount-1));
                let count  = 1 + l;

                if(this.layersCount > 1)
                    baseColorHSV[2]*=(1-0.5*l/(this.layersCount-1))
                
                for(let i = 0; i < count;i++){
                    switch(d) {
                        case 0:
                            position.x = -this.viewport.x;
                            position.y = getRandomInt(-this.viewport.y, this.viewport.y*2);
                            length = this.viewport.x;
                            break;
                        case 1:
                            position.x = getRandomInt(-this.viewport.x, this.viewport.x*2);
                            position.y = -this.viewport.y;
                            length = this.viewport.y;
                            break;
                        case 2:
                            position.x = this.viewport.x*2;
                            position.y = getRandomInt(-this.viewport.y, this.viewport.y*2);
                            length = this.viewport.x;
                            break;
                        case 3:
                            position.x = getRandomInt(-this.viewport.x, this.viewport.x*2);
                            position.y = this.viewport.y*2;
                            length = this.viewport.y;
                            break;
                    }
    
                    length*=lCoef;
        
                    this.count++;
                    this.addGo(new FlyLine({
                        endPoint: this.endPoint,
                        position,
                        baseColorHSV,
                        length,
                        duration,
                        vChange,
                        layer
                    }),layer)
                }
                
            }

            
        }, this, true))
        
    }
}

class FlyLine extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            endPoint: new V2(100, 200),
            direction: new V2(1,0),
            length: 20,
            baseColorHSV: [180,20, 100],
            size: new V2(1,1),
            duration: 50,
            vChange: -50,
            useCache: false
        }, options)

        super(options);
    }

    reset() {
        this.position = this.initialPosition.clone();
        this.length = this.initialLength;
        this.baseColorHSV[2] = this.initialV;

        this.xChange = { time: 0, duration: this.duration, change: this.endPoint.x - this.position.x , type: 'cubic', method: 'out', startValue: this.position.x, useCache: false }
        this.yChange = { time: 0, duration: this.duration, change: this.endPoint.y - this.position.y , type: 'cubic', method: 'out', startValue: this.position.y, useCache: false }
        this.lengthChange = { time: 0, duration: this.duration, change: 1 - this.length , type: 'cubic', method: 'out', startValue: this.length, useCache: false }

        this.startVChange= false;
        this.vChangeEasing = undefined;
        //this.vChange = { time: 0, duration: this.duration, change: this.vChange, type: 'cubic', method: 'out', startValue: this.baseColorHSV[2], useCache: false }
    }

    init() {
        this.initialPosition = this.position.clone();
        this.initialLength = this.length;
        this.initialV = this.baseColorHSV[2];

        this.xChange = { time: 0, duration: this.duration, change: this.endPoint.x - this.position.x , type: 'cubic', method: 'out', startValue: this.position.x, useCache: false }
        this.yChange = { time: 0, duration: this.duration, change: this.endPoint.y - this.position.y , type: 'cubic', method: 'out', startValue: this.position.y, useCache: false }
        this.lengthChange = { time: 0, duration: this.duration, change: 1 - this.length , type: 'cubic', method: 'out', startValue: this.length, useCache: false }

        //this.vChange = { time: 0, duration: this.duration, change: this.vChange, type: 'cubic', method: 'out', startValue: this.baseColorHSV[2], useCache: false }

        this.direction = this.endPoint.direction(this.position);
        this.angle = Math.abs(this.direction.angleTo(V2.right, true));
        this.sinAngle = Math.sin(this.angle);
        this.cosAngle = Math.cos(this.angle);

        this.lineDirection = 'lbrt';

        if(this.position.x > this.endPoint.x) {
            if(this.position.y > this.endPoint.y){
                this.lineDirection = 'ltrb';
            }
        }
        else {
            this.angle = Math.abs(this.direction.angleTo(V2.left, true));
            this.sinAngle = Math.sin(this.angle);
            this.cosAngle = Math.cos(this.angle);
            if(this.position.y > this.endPoint.y){
                this.lineDirection = 'lbrt';
            }
            else {
                this.lineDirection = 'ltrb';
            }
        }

        //this.createImg();
        this.shouldCreateImage = false;
        this.currentFrame = 0;
        this.frames = [];
        this.flyTimer = this.registerTimer(createTimer(30, () => {
            this.shouldCreateImage = false;
            this.position.x = easing.process(this.xChange);
            this.position.y = easing.process(this.yChange);
            if(this.vChangeEasing){
                this.baseColorHSV[2] = easing.process(this.vChangeEasing);
                this.vChangeEasing.time++;
            }
            
            let nextLength = fastRoundWithPrecision(easing.process(this.lengthChange));

            if(nextLength != this.length){
                this.length = nextLength;
                this.shouldCreateImage = true;
                this.currentFrame = this.xChange.time;

                this.createImg();
                // if(this.renderPosition)
                //     this.createImg();
            }

            this.xChange.time++;
            this.yChange.time++;
            this.lengthChange.time++;
            //this.vChange.time++;

            this.needRecalcRenderProperties = true;

            if(this.xChange.time > this.xChange.duration){
                this.reset();
                //this.unregTimer(this.flyTimer);
                //this.setDead();
            }
        }))
        
    }

    internalPreRender(){
        if(!this.startVChange){
            //this.createImg();
            this.startVChange = true;
            this.vChangeEasing = { time: 0, duration: this.xChange.duration - this.xChange.time, change: this.vChange, type: 'cubic', method: 'out', startValue: this.baseColorHSV[2], useCache: false }
        }
    }

    createImg() {
        this.size = new V2(fastRoundWithPrecision(this.cosAngle*this.length), fastRoundWithPrecision(this.sinAngle*this.length));
        if(this.size.x < 1) this.size.x = 1;
        if(this.size.y < 1) this.size.y = 1;
        let that =this;

        if(!this.frames[this.currentFrame]){
            this.frames[this.currentFrame] = this.img = createCanvas(this.size, (ctx, size) => {
                let pp = new PerfectPixel({context: ctx});
                ctx.fillStyle =  hsvToHex({hsv: this.baseColorHSV}) //'white';
                switch(that.lineDirection){
                    case 'lbrt':
                        pp.line(0, size.y-1, size.x-1, 0);
                        break;
                    case 'ltrb':
                        pp.line(0, 0, size.x-1, size.y-1);
                        break;
                }
            });
        }

        this.img = this.frames[this.currentFrame];

        // if(this.useCache){
        //     let key = this.size.x + '_' + this.size.y + '_' + this.lineDirection + '_' + this.layer;
        //     if(!this.parentScene.cache[key]){
        //         this.parentScene.cache[key] = createCanvas(this.size, (ctx, size) => {
        //             let pp = new PerfectPixel({context: ctx});
        //             ctx.fillStyle =  hsvToHex({hsv: this.baseColorHSV}) //'white';
        //             switch(that.lineDirection){
        //                 case 'lbrt':
        //                     pp.line(0, size.y-1, size.x-1, 0);
        //                     break;
        //                 case 'ltrb':
        //                     pp.line(0, 0, size.x-1, size.y-1);
        //                     break;
        //             }
        //         });
        //     }
    
        //     this.img = this.parentScene.cache[key]
        // }
        // else {
        //     this.img = createCanvas(this.size, (ctx, size) => {
        //         let pp = new PerfectPixel({context: ctx});
        //         ctx.fillStyle =  hsvToHex({hsv: this.baseColorHSV}) //'white';
        //         switch(that.lineDirection){
        //             case 'lbrt':
        //                 pp.line(0, size.y-1, size.x-1, 0);
        //                 break;
        //             case 'ltrb':
        //                 pp.line(0, 0, size.x-1, size.y-1);
        //                 break;
        //         }
        //     });
        // }
        

    }
}