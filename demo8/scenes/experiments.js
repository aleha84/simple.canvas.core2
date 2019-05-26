class ExperimentsScene extends Scene {
    //78D5E1
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                additional: []
            },
            sourceWidth: 3000,
            targetAddition: 200
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getSourceX(targetX) {
        return targetX*this.sourceWidth/this.viewport.x - (this.sourceWidth - this.viewport.x)/2;
    }

    preMainWork() {
        this.debug.additional[0] = 0;
        this.debug.additional[1] = 0;
    }

    start() {
        
        this.addGo(new GO({
            size: new V2(this.viewport.x, this.viewport.y/2),
            position: new V2(this.viewport.x/2, this.viewport.y/4),
            img: createCanvas(new V2(this.viewport.x, this.viewport.y/2), (ctx, size) => {
                let hsv = colors.toHsv({initialValue: '#5DA5AD', asInt: true})
                this.sChange = { time: 0, duration: size.y, change: -hsv.s, type: 'quad', method: 'out', startValue: hsv.s }
                for(let i = 0; i < size.y; i++){
                    this.sChange.time = i;
                    hsv.s = easing.process(this.sChange);
                    ctx.fillStyle = hsvToHex({hsv, hsvAsObject: true });
                    ctx.fillRect(0, i, size.x, 1);
                }
            })
        }), 1)

        this.addGo(new GO({
            size: new V2(this.viewport.x, this.viewport.y/2),
            position: new V2(this.viewport.x/2, this.viewport.y*3/4),
            img: createCanvas(new V2(this.viewport.x, this.viewport.y/2), (ctx, size) => {
                let hsv = colors.toHsv({initialValue: '#6EAA46', asInt: true})
                this.sChange = { time: 0, duration: size.y, change: hsv.s, type: 'quad', method: 'out', startValue: 0 }
                for(let i = size.y; i >= 0; i--){
                    this.sChange.time = i;
                    hsv.s = easing.process(this.sChange);
                    ctx.fillStyle = hsvToHex({hsv, hsvAsObject: true });
                    ctx.fillRect(0, i, size.x, 1);
                }
            })
        }), 1)

        this.centralPartSize = new V2(this.viewport.x, 50);
        this.addGo(new GO({
            position: this.sceneCenter.clone(),//.add(new V2(0, this.centralPartSize.y/2)),
            size: this.centralPartSize,
            renderValuesRound: true,
            init() {
                this.pulsation = { time: 0, duration: 10, change:  getRandom(0.5, 1) - 1, type: 'quad', method: 'in', startValue: 1 }

                this.images = {};
                this.currentMax = 0.75;

                this.opacityChangeIn = { time: 0, duration: this.size.y/2 - 1, change: this.currentMax, type: 'cubic', method: 'in', startValue: 0 }
                this.opacityChangeOut = { time: 0, duration: this.size.y/2 - 1, change: -this.currentMax, type: 'cubic', method: 'out', startValue: this.currentMax }

                this.img = createCanvas(this.size, (ctx, size) => {
                    for(let i = 0; i <= this.opacityChangeIn.duration; i++){
                        this.opacityChangeIn.time = i;
                        ctx.fillStyle = 'rgba(255,255,255, ' + easing.process(this.opacityChangeIn) + ')';
                        ctx.fillRect(0,i,size.x, 1);
                    }

                    for(let i = 0; i <= this.opacityChangeOut.duration; i++){
                        this.opacityChangeOut.time = i;
                        ctx.fillStyle = 'rgba(255,255,255, ' + easing.process(this.opacityChangeOut) + ')';
                        ctx.fillRect(0,i + this.opacityChangeIn.duration + 1,size.x, 1);
                    }

                })

                // this.registerTimer(createTimer(30, () => {
                //     this.currentMax = fastRoundWithPrecision(easing.process(this.pulsation),3);

                //     if(!this.images[this.currentMax]){
                        
                //         this.opacityChangeIn = { time: 0, duration: this.size.y/2 - 1, change: this.currentMax, type: 'cubic', method: 'in', startValue: 0 }
                //         this.opacityChangeOut = { time: 0, duration: this.size.y/2 - 1, change: -this.currentMax, type: 'cubic', method: 'out', startValue: this.currentMax }
                //         this.images[this.currentMax] = createCanvas(this.size, (ctx, size) => {
                //             for(let i = 0; i <= this.opacityChangeIn.duration; i++){
                //                 this.opacityChangeIn.time = i;
                //                 ctx.fillStyle = 'rgba(255,255,255, ' + easing.process(this.opacityChangeIn) + ')';
                //                 ctx.fillRect(0,i,size.x, 1);
                //             }
    
                //             for(let i = 0; i <= this.opacityChangeOut.duration; i++){
                //                 this.opacityChangeOut.time = i;
                //                 ctx.fillStyle = 'rgba(255,255,255, ' + easing.process(this.opacityChangeOut) + ')';
                //                 ctx.fillRect(0,i + this.opacityChangeIn.duration + 1,size.x, 1);
                //             }
    
                //         })
                //     }

                //     this.img = this.images[this.currentMax];

                //     this.pulsation.time++;
                //     if(this.pulsation.time > this.pulsation.duration){
                //         this.pulsation.time = 0;
                //         this.pulsation.duration = getRandomInt(5, 15);
                //         this.pulsation.startValue = this.currentMax;
                //         this.pulsation.change = getRandom(0.25, 1) - this.pulsation.startValue;
                //     }
                    
                // }, this, true))
            }
        }),2)

        let colorBlue = colors.toHsv({initialValue: '#78D5E1', asInt: true});
        this.registerTimer(createTimer(75, () => {
            
            for(let i = 0; i < 3; i++){
                let targetX = fastRoundWithPrecision(getRandomGaussian(0 - this.targetAddition, this.viewport.x + this.targetAddition));
                let startX = this.getSourceX(targetX); 


                this.addGo(new ExperimentsParticle({
                    position: new V2(startX, 0),
                    duration: 200 + 100*i ,//+ getRandomInt(-25, 25),
                    target: new V2(targetX, this.sceneCenter.y-1*(i+1)),
                    baseColorHSV: {...colorBlue, v: colorBlue.v-(i*5)}
                }), 100 - i)
            }
            
        }))
        
        let colorGreen = colors.toHsv({initialValue: '#85D155', asInt: true});
        this.registerTimer(createTimer(75, () => {
            for(let i = 0; i < 3; i++){
                let targetX = fastRoundWithPrecision(getRandomGaussian(0 - this.targetAddition, this.viewport.x + this.targetAddition));
                let startX = this.getSourceX(targetX); //targetX*3 - this.viewport.x;
                this.addGo(new ExperimentsParticle({
                    position: new V2(startX, this.viewport.y),
                    duration: 200 + 100*i,//+ getRandomInt(-25, 25),
                    target: new V2(targetX, this.sceneCenter.y+1*(i+1)),
                    baseColorHSV: {...colorGreen, v: colorBlue.v-(i*5)}
                }), 100)
            }
            
        }))
    }
}

class ExperimentsParticle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            baseColor: '#78D5E1',
            duration: 200,
            target: new V2(),
            size: new V2(2,2),
            targetSize: new V2(1,1),
            renderValuesRound: true
        }, options)

        super(options);
    }
    
    // internalPreRender(){
    //     this.parentScene.debug.additional[1]++;
    // }

    // internalPreUpdate() {
    //     this.parentScene.debug.additional[0]++;
    // }

    init(){
        //this.baseColorHSV = colors.toHsv({initialValue: this.baseColor, asInt: true});
        this.sChange = { time: 0, duration: this.duration, change: -this.baseColorHSV.s, type: 'quad', method: 'out', startValue: this.baseColorHSV.s, useCache: false }
        this.vChange = { time: 0, duration: this.duration, change: 100-this.baseColorHSV.v, type: 'quad', method: 'out', startValue: this.baseColorHSV.v, useCache: false }
        this.xChange = { time: 0, duration: this.duration, change: this.target.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x, useCache: false }
        this.yChange = { time: 0, duration: this.duration, change: this.target.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y, useCache: false }
        this.xSizeChange = { time: 0, duration: this.duration, change: this.targetSize.x - this.size.x , type: 'quad', method: 'out', startValue: this.size.x, useCache: false }
        this.ySizeChange = { time: 0, duration: this.duration, change: this.targetSize.y - this.size.y , type: 'quad', method: 'out', startValue: this.size.y, useCache: false }

        this.effectTimer = this.registerTimer(createTimer(30, () => {
            this.baseColorHSV.s = easing.process(this.sChange);
            this.baseColorHSV.v = easing.process(this.vChange);
            this.position.y = easing.process(this.yChange);
            this.position.x = easing.process(this.xChange);
            this.size.y = easing.process(this.ySizeChange);
            this.size.x = easing.process(this.xSizeChange);

            this.sChange.time++;
            this.vChange.time++;
            this.yChange.time++;
            this.xChange.time++;
            this.xSizeChange.time++;
            this.ySizeChange.time++;

            this.needRecalcRenderProperties = true;
            
            this.img = ExperimentsParticle.images.get(this.baseColorHSV);

            if(this.sChange.time > this.sChange.duration){
                this.unregTimer(this.effectTimer);
                this.setDead();
            }
        }, this, true));
    }
}

ExperimentsParticle.images = {
    store: [],
    get: function({ h = 0, s =0, v =0 }) {
        if(!this.store[h]){
            this.store[h] = [];
        }

        if(!this.store[h][s]){
            this.store[h][s] = [];
        }

        if(!this.store[h][s][v]){
            this.store[h][s][v] = createCanvas(new V2(1,1), (ctx) => {
                ctx.fillStyle = hsvToHex({hsv: [h,s,v], hsvAsObject: false });
                ctx.fillRect(0,0,1,1);
            })
        }

        return this.store[h][s][v];
    }
}