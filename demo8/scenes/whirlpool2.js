class Whirlpool2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: {},
            baseColorHSV: [0,0,100]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getImg([h,s,v]){
        let key = `${h}_${s}_${v}`;
        if(!this.imgCache[key]){
            this.imgCache[key] = createCanvas(new V2(1,1), (_, __, hlp) => {
                hlp.setFillColor(hsvToHex({hsv: [h, s ,v]})).dot(0,0);
            })
        }

        return this.imgCache[key];
    }

    start() {
        this.generatorTimer = this.registerTimer(createTimer(100, () => {
            this.addGo(new Whirlpool2Particle({
                origin: new V2(this.sceneCenter.x, 150),
                originYTarget: 400,
                width: 120,
                img: this.getImg([18, 96,100]),
                angle: getRandomInt(0,360),
                size: new V2(1,1),
                generalDuration: 400,
            }))
        }, this, true))

        // this.addGo(new Whirlpool2Particle({
        //             origin: new V2(this.sceneCenter.x, 150),
        //             originYTarget: 400,
        //             width: 120,
        //             img: this.getImg([18, 96,100]),
        //             angle: getRandomInt(0,360),
        //             size: new V2(1,1),
        //             generalDuration: 400,
        //         }))

        
        // for(let i = 150; i < 400; i+=20){
        //     this.addGo(new Whirlpool2Particle({
        //         origin: new V2(this.sceneCenter.x, i),
        //         width: 120,
        //         img: this.getImg(100),
        //         angle: getRandomInt(0,360),
        //         size: new V2(1,1),
        //         generalDuration: 100,
        //     }))
        // }
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
            //height: 1,
            angle: 0,
            angleStep: 2,
            v: {
                min: 50, max: 100
            },
            initialHSV: [18, 96,100],
            targetHSV: [197, 98, 100] 
        }, options)

        super(options);
    }

    init() {
        this.v.delta = this.v.max - this.v.min;
        

        this.originYChange = easing.createProps(this.generalDuration, this.origin.y, this.originYTarget, 'quad', 'inOut');
        this.wChange = easing.createProps(fast.r(this.generalDuration/2), this.width, 1, 'sin', 'out');
        this.sChange = easing.createProps(fast.r(this.generalDuration/2), this.initialHSV[1], 0, 'cubic', 'in');
        let h = this.initialHSV[0];

        this.timer = this.registerTimer(createTimer(30, () => {
            this.origin.y =  fast.r(easing.process(this.originYChange));
            this.width = easing.process(this.wChange);
            let s = fast.r(easing.process(this.sChange));

            this.originYChange.time++;
            this.wChange.time++;
            this.sChange.time++;

            this.calc();
            
            this.angle+=this.angleStep;
            if(this.angle > 360){
                this.angle-=360;
            }

            let v = this.v.max;
            if(this.angle >= 45 && this.angle < 225){
                v = this.v.max - this.v.delta*(-45 + this.angle)/180
            }
            else if(this.angle >= 225 || this.angle < 45){
                let a = this.angle;
                if(a < 45){
                    a+=360;
                }
                v = this.v.min + this.v.delta*(-225+a)/180;
            }

            s = fast.f(s/10)*10
            v = fast.f(v/10)*10

            //console.log(this.angle,v, this.position, this.origin, { width: this.width, height: this.height });

            this.img = this.parentScene.getImg([h, s, v]);

            this.needRecalcRenderProperties = true;
            
            // this.parentScene.addGo(new GO({
            //     position: this.position.clone(),
            //     size: new V2(1,1),
            //     img: this.img
            // }));


            if(this.originYChange.time > this.originYChange.duration){
               this.unregTimer(this.timer);
               //this.setDead(); 
            }

            if(this.wChange.time > this.wChange.duration){
                this.wChange.time = 0;
                this.wChange.change*=-1;
                this.wChange.startValue = this.width;
                this.wChange.method = 'in';

                this.sChange = easing.createProps(fast.r(this.generalDuration/2), 0, this.targetHSV[1], 'cubic', 'out');
                h = this.targetHSV[0];
            }

        }, this, true));
    }

    calc() {
        this.height = this.width/2;
        let r = degreeToRadians(this.angle);
        this.position.x = this.origin.x + fast.r(this.width * fast.r(Math.cos(r),5));
        this.position.y = this.origin.y + fast.r(this.height * fast.r(Math.sin(r),5));
    }
}