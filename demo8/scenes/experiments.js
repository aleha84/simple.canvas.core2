class ExperimentsScene extends Scene {
    //78D5E1
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
            },
        }, options)

        super(options);
    }

    backgroundRender(){
        this.backgroundRenderDefault();
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
        }))

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
        }))

        this.registerTimer(createTimer(10, () => {
            let targetX = getRandomInt(0, this.viewport.x);
            let startX = targetX*3 - this.viewport.x;
            this.addGo(new ExperimentsParticle({
                position: new V2(startX, 0),
                target: new V2(targetX, this.sceneCenter.y-2),
                baseColorHSV: colors.toHsv({initialValue: '#78D5E1', asInt: true})
            }), 10)
        }))
        
        this.registerTimer(createTimer(10, () => {
            let targetX = getRandomInt(0, this.viewport.x);
            let startX = targetX*3 - this.viewport.x;
            this.addGo(new ExperimentsParticle({
                position: new V2(startX, this.viewport.y),
                target: new V2(targetX, this.sceneCenter.y+2),
                baseColorHSV: colors.toHsv({initialValue: '#85D155', asInt: true})
            }), 10)
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

    init(){
        //this.baseColorHSV = colors.toHsv({initialValue: this.baseColor, asInt: true});
        this.sChange = { time: 0, duration: this.duration, change: -this.baseColorHSV.s, type: 'quad', method: 'out', startValue: this.baseColorHSV.s }
        this.vChange = { time: 0, duration: this.duration, change: 100-this.baseColorHSV.v, type: 'quad', method: 'out', startValue: this.baseColorHSV.v }
        this.xChange = { time: 0, duration: this.duration, change: this.target.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x }
        this.yChange = { time: 0, duration: this.duration, change: this.target.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y }
        this.xSizeChange = { time: 0, duration: this.duration, change: this.targetSize.x - this.size.x , type: 'quad', method: 'out', startValue: this.size.x }
        this.ySizeChange = { time: 0, duration: this.duration, change: this.targetSize.y - this.size.y , type: 'quad', method: 'out', startValue: this.size.y }

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