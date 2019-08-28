class OceanScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: [],
            },
            imgCache: {}
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        this.wavesCount = 26;
        
        this.sizeYClamp = [5,40];
        this.hClamp = [255, 125];
        this.sClamp = [25, 60];
        this.vClamp = [20, 50];
        this.xmClamp = [10, 2];
        
        this.sizeYDelta = this.sizeYClamp[1] - this.sizeYClamp[0];
        this.hDelta = this.hClamp[1] - this.hClamp[0];
        this.sDelta = this.sClamp[1] - this.sClamp[0];
        this.vDelta = this.vClamp[1] - this.vClamp[0];
        this.xmDelta = this.xmClamp[1] - this.xmClamp[0];

        this.currentY = this.sceneCenter.y;

        for(let y = 0; y < this.wavesCount; y++){
            let sizeY = fastRoundWithPrecision( this.sizeYClamp[0] + this.sizeYDelta*y/(this.wavesCount-1) );
            let colorHSV = [ 
                fastRoundWithPrecision(this.hClamp[0] + this.hDelta*y/(this.wavesCount-1)),
                fastRoundWithPrecision(this.sClamp[0] + this.sDelta*y/(this.wavesCount-1)),
                fastRoundWithPrecision(this.vClamp[0] + this.vDelta*y/(this.wavesCount-1))
            ]

            let xMultiplier = this.xmClamp[0] + this.xmDelta*y/(this.wavesCount-1)

            this.addGo(new OceanWave({
                position: new V2(this.sceneCenter.x, this.currentY),
                size: new V2(this.viewport.x*1.1, sizeY),
                imgCache: this.imgCache,
                levitationDelay: y*4,
                colorHSV,
                xMultiplier,
                layer: y
            }), 100 + y);

            this.currentY= fastRoundWithPrecision(this.currentY + sizeY/4);

        }

        this.sky = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 75),
            size: new V2(this.viewport.x, 150),
            baseColorHSV: [40,15,45],
            vDelta: -30,
            init() {
                this.img = createCanvas(this.size, (ctx, size) => {
                    for(let y = 0; y < size.y; y++){

                        let v = this.baseColorHSV[2] + this.vDelta*y/(size.y-1);

                        v = fastFloorWithPrecision(v)//Math.floor(v/4)*4;

                        ctx.fillStyle = hsvToHex({hsv: [ this.baseColorHSV[0], this.baseColorHSV[1], v ]});
                        ctx.fillRect(0, y, size.x, 1);
                    }
                });

                let yDelta = this.size.y - 20;//this.size.y/4 + this.size.y/2;
                for(let i = 0; i < 100; i++){
                    
                    let y = getRandomInt(-this.size.y/2, this.size.y/2 - 20);

                    this.addChild(new GO({
                        renderValuesRound: true,
                        position: new V2(getRandomInt(-this.size.x/2, 80 + this.size.x/2), y),
                        size: new V2(getRandomInt(40 - 35*y/yDelta, 80 - 70*y/yDelta), y > 0 ? 1 : 2),
                        //colorHSV: [41,8, 20 + 30*y/yDelta],
                        img: createCanvas(new V2(1,1), (ctx, size) => {
                            ctx.fillStyle = hsvToHex({hsv: [40,15, 35 - 30*y/yDelta]});//'#78756E';
                            ctx.fillRect(0,0,1,1);
                        }), 
                        xShift: 1 - 0.75*y/yDelta,
                        init() {
                            this.registerTimer(createTimer(30, () => {
                                this.position.x-=this.xShift;
                                
                                if(this.position.x < -this.parent.size.x/2 - this.size.x){
                                    this.position.x = this.parent.size.x/2 + this.size.x
                                }

                                this.needRecalcRenderProperties = true;
                            }, this, true))
                        }
                    }))
                }
                
            }
        }));


        this.ship = this.addGo(new GO({
            position: new V2(250, 168),
            size: new V2(100,40).mul(2.2),
            renderValuesRound: true,
            img: PP.createImage(oceanImages.ship),
            angleClamp: [-1, 1],
            angle: 0,
            init() {
                this.levitationY = { time: 0, duration: 20, change: fastRoundWithPrecision(this.size.y/4), type: 'quad', method: 'inOut', startValue: this.position.y}
                this.levitationX = { time: 0, duration: 70, change: fastRoundWithPrecision(this.size.x/15), type: 'quad', method: 'inOut', startValue: this.position.x}

                this.angleChange = { time: 0, duration: 70, change: this.angleClamp[1] - this.angleClamp[0], type: 'quad', method: 'inOut', startValue: this.angleClamp[0]}

                this.timer = this.registerTimer(createTimer(30, () => {
                    let lx = this.levitationX;
                    let ly = this.levitationY;
                    //this.position.y = fastRoundWithPrecision(easing.process(ly));
                    this.position.x = fastRoundWithPrecision(easing.process(lx));
                    this.needRecalcRenderProperties = true;

                    this.angle = (easing.process(this.angleChange));
    
                    lx.time++;
                    ly.time++;
                    this.angleChange.time++;
                    if(lx.time > lx.duration){
                        lx.time = 0;
                        lx.change*=-1;
                        lx.startValue = this.position.x;
    
                        ly.time = 0;
                        ly.change*=-1;
                        ly.startValue = this.position.y;

                        this.angleChange.time = 0;
                        this.angleChange.change*=-1;
                        this.angleChange.startValue = this.angle;
                        //if(l.method == 'out') l.method = 'in'; else l.method = 'out';
                    }
                }));

                // this.splashGenerator = this.registerTimer(createTimer(500, () => {
                //     this.addChild(new GO({
                //         position: new V2(),
                //         size: new V2(2,2),
                //         img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'white'; ctx.fillRect(0,0,1,1) }),
                //         init() {

                //         }
                //     }))
                // }));

                this.light1 = this.addChild(new GO({
                    position: new V2(-43,-7.5),
                    size: new V2(3,3),
                    img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#F00E00'; ctx.fillRect(0,0,1,1) })
                }));

                this.light1.addEffect(new FadeInOutEffect({effectTime:500, loop: true, min: 0.25}))

                this.light2 = this.addChild(new GO({
                    position: new V2(56,-10),
                    size: new V2(3,3),
                    img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#F00E00'; ctx.fillRect(0,0,1,1) })
                }));

                this.light2.addEffect(new FadeInOutEffect({effectTime:500, loop: true, min: 0.25}))
            },
            internalPreRender() {
                if(this.angle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.angle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.angle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            }
        }), 115);
        
    }
}

class OceanWave extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            colorHSV: [210, 100, 100],
            xMultiplier: 2,
            xShift: 0,
            xShiftStep: 4,
            renderValuesRound: true,
            levitationDelay: 0
        }, options)

        super(options);
    }

    init() {
        
        this.yMiddle = fastRoundWithPrecision(this.size.y/4);
        this.yStep = this.yMiddle-1;
        
        this.levitationY = { time: 0, duration: 20, change: fastRoundWithPrecision(this.yStep/2.5), type: 'quad', method: 'inOut', startValue: this.position.y}
        this.levitationX = { time: 0, duration: 20, change: fastRoundWithPrecision(this.yStep*2), type: 'quad', method: 'inOut', startValue: this.position.x}

        this.colorHex = hsvToHex({hsv: this.colorHSV});
        // if(this.layer == 8){
        //     this.colorHex = '#FF0000';
        // }
        this.createImg();

        this.timer = this.registerTimer(createTimer(30, () => {
            this.xShift+=this.xShiftStep;
            if(this.xShift > 360)
                this.xShift -= 360;

            this.createImg();

            if(this.levitationDelay == 0){
                let lx = this.levitationX;
                let ly = this.levitationY;
                this.position.y = fastRoundWithPrecision(easing.process(ly));
                this.position.x = fastRoundWithPrecision(easing.process(lx));
                this.needRecalcRenderProperties = true;

                lx.time++;
                ly.time++;
                if(lx.time > lx.duration){
                    lx.time = 0;
                    lx.change*=-1;
                    lx.startValue = this.position.x;

                    ly.time = 0;
                    ly.change*=-1;
                    ly.startValue = this.position.y;
                    //if(l.method == 'out') l.method = 'in'; else l.method = 'out';
                }
            }
            else {
                this.levitationDelay--;
            }
        }));
    }

    createImg() {
        let key = this.xMultiplier + '_' + this.colorHex;
        if(!this.imgCache[key]){
            this.imgCache[key] = [];
        }

        let c = this.imgCache[key];
        if(!c[this.xShift]){
            c[this.xShift] =createCanvas(this.size, (ctx, size) => {
                ctx.fillStyle = this.colorHex;
                for(let x = 0; x < size.x; x++){
                    let y = fastRoundWithPrecision(this.yMiddle + this.yStep*Math.sin(degreeToRadians(this.xShift + x*this.xMultiplier)));
                    ctx.fillRect(
                        x, 
                        y, 
                        1, size.y);
                    //console.log(x,y);
                }
            });
        }

        this.img = c[this.xShift];
    }
}