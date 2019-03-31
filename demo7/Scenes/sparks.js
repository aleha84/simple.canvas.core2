class SparksScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {

        }, options);

        super(options);
    }

    start(){
        this.addGo(new SparksGeneratorObject({
            position: this.sceneCenter
        }))
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}

class SparksGeneratorObject extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(10, 10),
            greenClamps: [40, 236],
            red: 240,
            blue: 27 
        }, options);

        super(options);
    }

    init() {
        this.from = { time: 0, duration: getRandomInt(3,15), change: this.greenClamps[1] - this.greenClamps[0], type: 'quad', method: 'inOut', startValue: this.greenClamps[0] };
        this.to = { time: 0, duration: getRandomInt(3,15), change: -1 *(this.greenClamps[1] - this.greenClamps[0]), type: 'quad', method: 'inOut', startValue: this.greenClamps[1] };
        this.direction = 1;

        this.glowEffectTimer = createTimer(30, () => {
            let props = this.direction > 0 ? this.from : this.to;
            let green = fastRoundWithPrecision(easing.process(props));
            let that = this;
            this.img= createCanvas(this.size, (ctx, size) => {
                ctx.fillStyle = '#' + rgbToHex(that.red, green, that.blue);
                ctx.fillRect(0,0, size.x, size.y);
            })

            props.time++;
            if(props.time > props.duration){
                this.direction*=-1;
                props.time = 0;
                props.duration = getRandomInt(3,15);
            }
        }, this, true);

        this.registerTimer(this.glowEffectTimer);
    }
}