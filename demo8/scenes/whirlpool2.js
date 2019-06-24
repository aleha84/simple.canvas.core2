class Whirlpool2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: false,
                additional: [],
            },
            imgCache: [],
            baseColorHSV: [0,0,100]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getImg([h,s,v]){
        //let key = `${h}_${s}_${v}`;
        let key = h*1000000 + s*1000 + v;
        let value = this.imgCache[key];
        if(value == undefined){
            value = createCanvas(new V2(1,1), (_, __, hlp) => {
                hlp.setFillColor(hsvToHex({hsv: [h, s ,v]})).dot(0,0);
            });

            this.imgCache[key] = value;
        }

        return value;
    }

    stopGenerator() {
        if(this.generatorTimer){
            this.unregTimer(this.generatorTimer);
            this.generatorTimer = undefined;
        }
    }

    start() {
        this.delayTimer = this.registerTimer(createTimer(2000, () => {
            this.unregTimer(this.delayTimer);
            this.generatorTimer = this.registerTimer(createTimer(40, () => {
                for(let i = 0; i < 3;i++){
                    let sw = getRandomInt(1,3);
                    let angle = getRandomInt(0,360);
                    let currentLayer = angle > 180 ? 5 : 10
        
                    this.addGo(new Whirlpool2Particle({
                        origin: new V2(this.sceneCenter.x, 150),
                        originYTarget: 400,
                        width: 120,
                        img: this.getImg([18, 96,100]),
                        angle: angle,
                        size: new V2(sw,sw),
                        generalDuration: 200,
                        currentLayer
                    }), currentLayer)
                }
                
            }, this, true))
        }, this, false));

        
    }
}

class Whirlpool2Particle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            generalDuration: 100,
            renderValuesRound: false,
            size: new V2(3,3),
            position: new V2(),
            origin: new V2(),
            width: 1,
            angle: 0,
            angleStep: 2,
            v1: {
                min: 40, max: 100
            },
            v2: {
                min: 40, max: 100
            },
            initialHSV: [18, 96,100],
            targetHSV: [197, 98, 100],
            goDownCounter: 3 
        }, options)

        super(options);
    }

    init() {
        this.v1.delta = this.v1.max - this.v1.min;
        this.v2.delta = this.v2.max - this.v2.min;
        this.initialOriginY = this.origin.y;
        this.initialWidth = this.width;
        this.mathCache = {
            sin: new Array(360).fill().map((_, a) => {  fast.r(Math.sin(degreeToRadians(this.angle)), 5) }),
            cos: new Array(360).fill().map((_, a) => {  fast.r(Math.cos(degreeToRadians(this.angle)), 5) })
        }

        this.goDown();   
    }

    goUp() {
        this.originYChange = easing.createProps(this.generalDuration, this.origin.y, this.initialOriginY, 'quad', 'inOut');
        this.sChange = easing.createProps(fast.r(this.generalDuration/2), this.targetHSV[1], 0, 'cubic', 'out');
        let h = this.targetHSV[0];
        this.vProps = this.v2;
        this.timer = this.registerTimer(createTimer(30, () => {
            this.origin.y =  fast.r(easing.process(this.originYChange));
             let s = fast.r(easing.process(this.sChange));

            this.originYChange.time++;
             this.sChange.time++;

            if(this.sChange.time > this.sChange.duration){
                this.sChange = easing.createProps(fast.r(this.generalDuration/2), 0, this.initialHSV[1], 'cubic', 'in');
                h = this.initialHSV[0];
            }

            this.calc();

            let {v} = this.doAngleWork();
            
            s = fast.f(s/10)*10
            v = fast.f(v/10)*10

            this.img = this.parentScene.getImg([h, s, v]);
            this.needRecalcRenderProperties = true;

            if(this.originYChange.time > this.originYChange.duration){
                this.unregTimer(this.timer);
                //this.goUp();
                //this.setDead(); 
                this.parentScene.stopGenerator();
                this.goDown();
             }

        }, this, true));
    }

    goDown() {
        this.goDownCounter--;
        this.originYChange = easing.createProps(this.generalDuration, this.origin.y, this.originYTarget, 'quad', 'inOut');
        this.wChange = easing.createProps(fast.r(this.generalDuration/2), this.width, 1, 'sin', 'out');
        this.sChange = easing.createProps(fast.r(this.generalDuration/2), this.initialHSV[1], 0, 'cubic', 'in');
        let h = this.initialHSV[0];
        this.vProps = this.v1;
        this.timer = this.registerTimer(createTimer(30, () => {
            this.origin.y =  fast.r(easing.process(this.originYChange));
            
            let s = fast.r(easing.process(this.sChange));

            this.originYChange.time++;
            
            this.sChange.time++;

            if(this.wChange){
                this.width = easing.process(this.wChange);
                this.wChange.time++;
    
                if(this.wChange.time > this.wChange.duration){
                    if(this.goDownCounter == 0){
                        this.addEffect(new FadeOutEffect({ effectTime: 300, updateDelay: 30, initOnAdd: true, setParentDeadOnComplete: true }))   
                    }
                    // this.wChange.time = 0;
                    // this.wChange.change*=-1;
                    // this.wChange.startValue = this.width;
                    // this.wChange.method = 'in';
                    this.wChange = easing.createProps(fast.r(this.generalDuration/2), this.width, this.initialWidth, 'sin', 'in');
    
                    this.sChange = easing.createProps(fast.r(this.generalDuration/2), 0, this.targetHSV[1], 'cubic', 'out');
                    h = this.targetHSV[0];
                    this.vProps = this.v2;
                }
            }
            

            this.calc();
            
            let {v} = this.doAngleWork();

            s = fast.f(s/10)*10
            v = fast.f(v/10)*10

            //console.log(this.angle,v, this.position, this.origin, { width: this.width, height: this.height });

            this.img = this.parentScene.getImg([h, s, v]);

            this.needRecalcRenderProperties = true;
            
            // this.parentScene.addGo(new GO({
            //     position: this.position.clone(),
            //     size: this.size,
            //     img: this.img,
            //     init() {
            //         this.addEffect(new FadeOutEffect({effectTime: 100, updateDelay: 30, setParentDeadOnComplete: true, initOnAdd: true }))
            //     }
            // }));


            if(this.originYChange.time > this.originYChange.duration){
                this.width = this.initialWidth
               this.unregTimer(this.timer);
               this.goUp();
               //this.setDead(); 
            }
        }, this, true));
    }

    doAngleWork() {
        this.angle+=this.angleStep;
        if(this.angle > 360){
            this.angle-=360;
            this.changeLayerIndex = 10;
        }

        if(this.angle > 180 && this.currentLayer == 10){
            this.changeLayerIndex = 5;
        }

        let v = this.vProps.max;
        if(this.angle >= 45 && this.angle < 225){
            v = this.vProps.max - this.vProps.delta*(-45 + this.angle)/180
        }
        else if(this.angle >= 225 || this.angle < 45){
            let a = this.angle;
            if(a < 45){
                a+=360;
            }
            v = this.vProps.min + this.vProps.delta*(-225+a)/180;
        }

        return {v};
    }

    calc() {
        this.height = this.width/2;
        let r = degreeToRadians(this.angle);
        this.position.x = this.origin.x + fast.r(this.width * this.getMathCache('cos', this.angle));
        this.position.y = this.origin.y + fast.r(this.height * this.getMathCache('sin', this.angle));

    }

    getMathCache(type, angle){
        if(this.mathCache[type][angle] == undefined){
            this.mathCache[type][angle] = fast.r(Math[type](degreeToRadians(angle)), 5);
        }

        return this.mathCache[type][angle];
    }
}