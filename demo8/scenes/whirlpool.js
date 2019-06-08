class WhirlpoolScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: []
            },
            imgCache: [],
            baseColorHSV: [0,0,100]
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getImg(v){
        if(!this.imgCache[v]){
            this.imgCache[v] = createCanvas(new V2(1,1), (_, __, hlp) => {
                hlp.setFillColor(hsvToHex({hsv: [this.baseColorHSV[0], this.baseColorHSV[1] ,v]})).dot(0,0);
            })
        }

        return this.imgCache[v];
    }

    createParticle() {
        let w = getRandomInt(10, this.viewport.x/3);
        let sw = getRandomInt(1,3);
        let v = getRandomInt(75,100);
        
        return new WhirlpoolParticle({
            origin: this.sceneCenter.clone(),
            width: w,
            height: w/2,
            img: this.getImg(v),//this.particleImg,
            angle: getRandomInt(0,360),
            size: new V2(sw,sw),
            v
            //angleStep: 4 - sw
        });
    };

    start() {
        this.particleImg = createCanvas(new V2(1,1), (_, __, hlp) => {
            hlp.setFillColor('white').dot(0,0);
        })

        for(let i = 0; i < 200; i++){
            this.addGo(this.createParticle(), 10)
        }

        this.pGenerator = this.registerTimer(createTimer(25, () => {
            let go = this.createParticle();

            go.fall = true;
            go.calc();
            go.targetY = go.position.y;
            go.position.y = -100;

            this.addGo(go, 10)
        }, this, true));
        
    }
}

class WhirlpoolParticle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: false,
            size: new V2(3,3),
            position: new V2(),
            origin: new V2(),
            width: 1,
            height: 1,
            angle: 0,
            angleStep: 2
        }, options)

        super(options);
    }

    createWChange() {
        this.wChange = easing.createProps(800, this.width, 1, 'quad', 'in');
    }
    init() {
        
        if(this.fall){
            this.fallChange = easing.createProps(30, this.position.y, this.targetY, 'quad', 'in');
        }
        else {
            this.calc();
            this.createWChange();
        }
        

        this.timer = this.registerTimer(createTimer(30, () => {
            if(this.fallChange){
                this.position.y = easing.process(this.fallChange);

                this.fallChange.time++;
                if(this.fallChange.time > this.fallChange.duration){
                    this.createWChange();
                    this.fallChange = undefined;
                }
            }

            if(this.wChange){
                this.width = easing.process(this.wChange);
                this.height = this.width/2;
                this.calc();
                this.wChange.time++;

                if(this.wChange.time > this.wChange.duration){
                    this.wChange = undefined;
                }

                this.angle+=this.angleStep;
                if(this.angle > 360){
                    this.angle-=360;
                }

                if(this.width < 30 && this.yChange == undefined) {
                    this.changeLayerIndex = 1;
                    this.yChange = easing.createProps(200, this.position.y, this.parentScene.viewport.y, 'quad', 'in');
                    this.vChange = easing.createProps(200, this.v, this.v-40, 'quad', 'in');
                }
            }

            if(this.yChange){
                this.position.y = easing.process(this.yChange);
                this.v = fastRoundWithPrecision(easing.process(this.vChange));

                this.img = this.parentScene.getImg(this.v);

                this.yChange.time++;
                this.vChange.time++;
                if(this.yChange.time > this.yChange.duration){
                    this.setDead();
                }
            }
            
            this.needRecalcRenderProperties = true;
        }, this, true));
    }

    calc() {
        let r = degreeToRadians(this.angle);
        this.position.x = this.origin.x + fastRoundWithPrecision(this.width * fastRoundWithPrecision(Math.cos(r),5));
        this.position.y = this.origin.y + fastRoundWithPrecision(this.height * fastRoundWithPrecision(Math.sin(r),5));
    }
}