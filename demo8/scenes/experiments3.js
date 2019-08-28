class Experiments3Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: [],
            },
            hClamp: [180,240],
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        for(let y = 0;y <= this.viewport.y;y++){

            let xShift = fastRoundWithPrecision(20* Math.sin(degreeToRadians(y*2))) + y*3;
            if(xShift > 360)
                xShift-=360;

            this.addGo(new GO({
                position: new V2(this.sceneCenter.x, y),
                size: new V2(this.viewport.x, 1),
                baseColorsHSV: [240,100,100],
                hClamp: this.hClamp,
                imgCache: this.imgCache,
                xShift,
                renderValuesRound: true,
                levitationDelay: y,
                init() {
                    this.levitation = { time: 0, duration: 20, change: 10, type: 'quad', method: 'out', startValue: this.position.x}
                    this.flooringStep = 5;
                    this.hStep = fastRoundWithPrecision((this.hClamp[1] - this.hClamp[0])/2);
                    this.hInitial = this.hClamp[0] + this.hStep;
                    
                    this.createImg();
    
                    this.timer = this.registerTimer(createTimer(30, () => {
                        this.xShift+=5;
                        if(this.xShift > 360)
                            this.xShift -= 360;
    
                        this.createImg();

                        
                        
                        if(this.levitationDelay == 0){
                            let l = this.levitation;
                            this.position.x = fastRoundWithPrecision(easing.process(l));
                            this.needRecalcRenderProperties = true;

                            l.time++;
                            if(l.time > l.duration){
                                l.time = 0;
                                l.change*=-1;
                                l.startValue = this.position.x;
                                if(l.method == 'out') l.method = 'in'; else l.method = 'out';
                            }
                        }
                        else {
                            this.levitationDelay--;
                        }

                    }, this, true));

                },
    
                createImg() {
                    if(!this.imgCache[this.xShift]){
                        this.imgCache[this.xShift] = createCanvas(new V2(this.size.x, 1), (ctx, size) => {
                            for(let x = 0; x < size.x; x++){
                                let h = fastRoundWithPrecision(this.hInitial + this.hStep * Math.sin(degreeToRadians(this.xShift + x*2)));

                                let hOrig = h;
                                h = Math.floor(h/this.flooringStep)*this.flooringStep;

                                ctx.fillStyle = hsvToHex({hsv: [h, this.baseColorsHSV[1], this.baseColorsHSV[2]]});
                                ctx.fillRect(x,0,1,1);
                            }
                        })
                    }
    
                    this.img = this.imgCache[this.xShift]
                }
    
            }));
        }
        
    }
}