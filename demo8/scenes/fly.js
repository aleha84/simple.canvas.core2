class FlyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: [],
            },
            baseHColors: [10, 60, 180]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.bgImg, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }

    prepareFlyLine(l) {
        let baseColorHSV = [180,10, 100];
        let d = getRandomInt(0,3);
        let length = this.viewport.x;
        let position = new V2();
        let duration = 50*(1 + 1.25*l);
        let vChange = -65;
        let layer = 10 - l;
        let lCoef = this.layersCount == 1? 1 : 1-(0.95*l/(this.layersCount-1));
        let count  = 1 + l*2;

        if(this.layersCount > 1)
            baseColorHSV[2]*=(1-(0.2*l)/(this.layersCount-1))

        baseColorHSV[1] = 20*l/(this.layersCount-1);

        //baseColorHSV[0] = this.baseHColors[getRandomInt(0,this.baseHColors.length-1)];

        if(l == 0 && getRandomBool()) return;
            

        if(l > 0)
            vChange = -30 - 35*l/(this.layersCount-1);
        else {
            vChange = -10;
        }

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
            return new FlyLine({
                endPoint: this.endPoint,
                position,
                baseColorHSV,
                length,
                duration,
                vChange,
                layer
            });
        }
    }

    createBgImg(vDelta){
        return createCanvas(this.viewport, (ctx, size) => {
            let hsv = [180,60,20];
            let maxDistance = this.viewport.x - this.endPoint.x;
            let step = 5;
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
                   let vOrig = v;
                   v = Math.floor(v/step)*step;
                    //v = fastFloorWithPrecision(v);
                    
                    if(vOrig <= v+(0.25*step)){
                        if(getRandomInt(0,3) == 0){
                            v-=step;
                        }
                    }
                    else if(vOrig > v+(0.25*step) && vOrig <= v+(0.5*step)){
                        if(getRandomInt(0,6) == 0){
                            v+=step*(getRandomBool() ? -1 : 1);
                        }
                    }
                    else if(vOrig > v+(0.5*step) && vOrig <= v+(0.75*step)){
                        if(getRandomInt(0,3) == 0){
                            v+=step;
                        }
                    }
                    else if(vOrig > v+(0.75*step)){
                        if(getRandomBool()){
                            v+=step;
                        }
                    }
                    

                    let rgb = hsvToRgb(hsv[0], hsv[1], hsv[2]+v, false, true);
                    ctx.fillStyle =  `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)` //hsvToHex({hsv: [hsv[0], hsv[1], hsv[2]+v]});
                    ctx.fillRect(c,r,1,1);
                }
            }  
        })
    }

    start() {
        this.cache = {};
        this.endPoint = new V2(100, 150);
        
        
        
        
        this.layersCount = 7;
        this.count = 0;

        this.bgFrames = [];
        for(let i = 0; i < 4; i++){
            this.bgFrames[i] = this.createBgImg(50);
        }
        
        this.currentBgFrame = 0;
        this.bgImg = this.createBgImg(50);
        this.bgGenTimer = this.registerTimer(createTimer(200, () => {
            this.bgImg = this.bgFrames[this.currentBgFrame++];
            if(this.currentBgFrame == this.bgFrames.length){
                this.currentBgFrame = 0;
            }

            this.backgroundRender();
        }, this, true));

        this.generator = this.registerTimer(createTimer(150, () => {
            if(this.count >= 600)
                {
                    this.unregTimer(this.generator);
                    return;
                }

            for(let l = 0; l < this.layersCount; l++){
                let go = this.prepareFlyLine(l);
                if(!go)
                    continue;
                this.addGo(go, go.layer);
            }
        }, this, true))
        

        this.pixelImages = [
            ,
            createCanvas(new V2(1,1), (ctx) => {ctx.fillStyle = '#c0c0c0'; ctx.fillRect(0,0,1,1)}),
            PP.createImage({"general":{"originalSize":{"x":2,"y":2},"size":{"x":2,"y":2},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":0,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":1,"y":1}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#c0c0c0","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":1}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":0}}]},{"order":2,"type":"dots","strokeColor":"#808080","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":0,"y":1}}]}]}}),
            PP.createImage({"general":{"originalSize":{"x":3,"y":3},"size":{"x":3,"y":3},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":2}},{"point":{"x":2,"y":1}},{"point":{"x":1,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#c0c0c0","fillColor":"#c0c0c0","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":1}},{"point":{"x":1,"y":2}},{"point":{"x":1,"y":1}},{"point":{"x":0,"y":1}}]},{"order":2,"type":"dots","strokeColor":"#808080","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":2}},{"point":{"x":0,"y":1}}]}]}}),
            PP.createImage({"general":{"originalSize":{"x":4,"y":4},"size":{"x":4,"y":4},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":2}},{"point":{"x":3,"y":1}}]},{"order":1,"type":"lines","strokeColor":"#c0c0c0","fillColor":"#c0c0c0","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":2}},{"point":{"x":2,"y":2}},{"point":{"x":2,"y":1}}]},{"order":2,"type":"dots","strokeColor":"#808080","fillColor":"#808080","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":3}},{"point":{"x":1,"y":3}},{"point":{"x":1,"y":2}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":2}}]},{"order":3,"type":"dots","strokeColor":"#2e2e2e","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":3}},{"point":{"x":0,"y":2}}]}]}}),
            PP.createImage({"general":{"originalSize":{"x":5,"y":5},"size":{"x":5,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":0,"y":2}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":2,"y":0}},{"point":{"x":3,"y":0}},{"point":{"x":4,"y":1}},{"point":{"x":4,"y":2}},{"point":{"x":4,"y":3}},{"point":{"x":3,"y":4}},{"point":{"x":2,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}}]},{"order":1,"type":"lines","strokeColor":"#c0c0c0","fillColor":"#c0c0c0","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":3}},{"point":{"x":1,"y":4}},{"point":{"x":3,"y":4}},{"point":{"x":4,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":2,"y":2}},{"point":{"x":2,"y":1}}]},{"order":2,"type":"lines","strokeColor":"#808080","fillColor":"#808080","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":3,"y":3}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}},{"point":{"x":2,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":1,"y":2}},{"point":{"x":2,"y":3}}]},{"order":3,"type":"lines","strokeColor":"#2e2e2e","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":0,"y":1}},{"point":{"x":0,"y":3}},{"point":{"x":1,"y":4}},{"point":{"x":3,"y":4}}]},{"order":4,"type":"dots","strokeColor":"#2e2e2e","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":1,"y":3}},{"point":{"x":1,"y":0}}]},{"order":5,"type":"dots","strokeColor":"#c0c0c0","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":3,"y":2}},{"point":{"x":2,"y":0}}]},{"order":6,"type":"dots","strokeColor":"#808080","fillColor":"#808080","closePath":false,"fill":false,"visible":true,"points":[]}]}})]
        
        this.distantStarImg = createCanvas(new V2(1,1), (ctx) => {
            ctx.fillStyle = 'rgba(255,255,255, 0.5)'; ctx.fillRect(0,0,1,1);
        })
        
        this.distantStarCount = 0;

        this.distantStarGenerator = this.registerTimer(createTimer(500, () => {
            // if(this.distantStarCount >= 50){
            //     this.unregTimer(this.distantStarGenerator);
            //     return;
            // }

            this.addGo(new GO({
                renderValuesRound: true,
                position: new V2(this.viewport.x, 0),
                size: new V2(1,1),
                img: this.distantStarImg,
                endPoint: this.endPoint,
                duration: 800,
                reset() {
                    let d = getRandomInt(0,3);
                    let position = new V2();
                    switch(d) {
                        case 0:
                            position.x = -5;
                            position.y = getRandomInt(-5, this.parentScene.viewport.y+5);
                            break;
                        case 1:
                            position.x = getRandomInt(-5, this.parentScene.viewport.x+5);
                            position.y = -5;
                            break;
                        case 2:
                            position.x = this.parentScene.viewport.x + 5;
                            position.y = getRandomInt(-5, this.parentScene.viewport.y+5);
                            break;
                        case 3:
                            position.x = getRandomInt(-5, this.parentScene.viewport.x+5);
                            position.y = this.parentScene.viewport.y+5;
                            break;
                    }

                    this.position = position;
                    this.xChange = { time: 0, duration: this.duration, change: this.endPoint.x - this.position.x , type: 'cubic', method: 'out', startValue: this.position.x, useCache: false }
                    this.yChange = { time: 0, duration: this.duration, change: this.endPoint.y - this.position.y , type: 'cubic', method: 'out', startValue: this.position.y, useCache: false }
                },
                init() {
                    this.initialPosition = this.position.clone();
                    this.reset();
    
                    this.flyTimer = this.registerTimer(createTimer(30, () => {
                        this.position.x = easing.process(this.xChange);
                        this.position.y = easing.process(this.yChange);
    
                        this.xChange.time++;
                        this.yChange.time++;
    
                        this.needRecalcRenderProperties = true;
    
                        if(this.xChange.time > this.xChange.duration){
                            this.reset();
                            if(this.parentScene.distantStarGenerator){
                                this.parentScene.unregTimer(this.parentScene.distantStarGenerator);
                            }
                        }
                    }));
                }
            }), 0);
        }));

        this.planetCount = 0;
        this.planetGenerator = this.registerTimer(createTimer(3000, () => {
            if(this.planetCount >= 10){
                this.unregTimer(this.planetGenerator);
                return;
            }

            this.planetCount++;
            this.addGo(new GO({
                renderValuesRound: true,
                position: new V2(this.viewport.x, 0),
                size: new V2(5,5),
                pixelImages: this.pixelImages,
                endPoint: this.endPoint,
                duration: 400,
                reset() {
                    let d = getRandomInt(0,3);
                    let position = new V2();
                    switch(d) {
                        case 0:
                            position.x = -5;
                            position.y = getRandomInt(-5, this.parentScene.viewport.y+5);
                            break;
                        case 1:
                            position.x = getRandomInt(-5, this.parentScene.viewport.x+5);
                            position.y = -5;
                            break;
                        case 2:
                            position.x = this.parentScene.viewport.x + 5;
                            position.y = getRandomInt(-5, this.parentScene.viewport.y+5);
                            break;
                        case 3:
                            position.x = getRandomInt(-5, this.parentScene.viewport.x+5);
                            position.y = this.parentScene.viewport.y+5;
                            break;
                    }

                    this.position = position;//new V2(this.parentScene.viewport.x + 5, getRandomInt(0, this.parentScene.viewport.y));
                    this.size = new V2(this.initialSize, this.initialSize);
                    this.xChange = { time: 0, duration: this.duration, change: this.endPoint.x - this.position.x , type: 'cubic', method: 'out', startValue: this.position.x, useCache: false }
                    this.yChange = { time: 0, duration: this.duration, change: this.endPoint.y - this.position.y , type: 'cubic', method: 'out', startValue: this.position.y, useCache: false }
                    this.sizeChange = { time: 0, duration: this.duration, change: 1 - this.size.x , type: 'cubic', method: 'out', startValue: this.size.x, useCache: false }
                },
                init() {
                    this.initialPosition = this.position.clone();
                    this.initialSize = this.size.x;
                    this.reset();
    
                    this.flyTimer = this.registerTimer(createTimer(30, () => {
                        this.position.x = easing.process(this.xChange);
                        this.position.y = easing.process(this.yChange);
                        this.size.x = fastRoundWithPrecision(easing.process(this.sizeChange));
                        this.size.y = this.size.x;
    
                        this.img = this.pixelImages[this.size.x];
    
                        this.xChange.time++;
                        this.yChange.time++;
                        this.sizeChange.time++;
    
                        this.needRecalcRenderProperties = true;
    
                        if(this.xChange.time > this.xChange.duration){
                            this.reset();
                        }
                    }));
                }
            }), 20)

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