class BatteryScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(60, 100),
            init() {

                this.lineWidth = fast.r(this.size.x/10);
                
                this.cap = this.addChild(new GO({
                    position: new V2(0, -fast.r(this.size.y/2 + this.lineWidth/2) ),
                    size: new V2(fast.r(this.size.x/3), this.lineWidth), 
                    init(){
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('gray').rect(0,0, size.x, size.y);
                        })
                    }
                }));

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    lineWidth: this.lineWidth,
                    init() {
                        this.content = this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            imgCache: [],
                            lineWidth: this.lineWidth,
                            imgYShift: 0.25,
                            baseColorHSV: [51,94,100],
                            init() {
                                this.time = 0;
                                this.timeDelta = 2;
                                
                                this.timeDeltaChange = easing.createProps(300, 1,-1, 'quad', 'inOut');
                                this.y1Shift = easing.createProps(this.size.x, 0,10, 'linear', 'base');
                                this.y2Shift = easing.createProps(this.size.x, -10,0, 'linear', 'base');

                                this.yShiftChange = easing.createProps(100, 0,10, 'quad', 'inOut');

                                this.sChange = easing.createProps(this.size.y, 94,50, 'quad', 'in');

                                this.timer = this.registerTimer(createTimer(30, () => {
                                    // this.timeDelta = easing.process(this.timeDeltaChange);
                                    // this.timeDeltaChange.time++;
                                    // if(this.timeDeltaChange.time > this.timeDeltaChange.duration){
                                    //     this.timeDeltaChange.time = 0;
                                    //     this.timeDeltaChange.change*=-1;
                                    //     this.timeDeltaChange.startValue = this.timeDelta;
                                    // }
                                    let yShiftCurrent = fast.r(easing.process(this.yShiftChange));
                                    this.y1Shift = easing.createProps(this.size.x, 0+yShiftCurrent,10-yShiftCurrent, 'linear', 'base');
                                    this.y2Shift = easing.createProps(this.size.x, -10+yShiftCurrent,0-yShiftCurrent, 'linear', 'base');

                                    this.yShiftChange.time++;
                                    if(this.yShiftChange.time > this.yShiftChange.duration){
                                        this.yShiftChange.change*=-1;
                                        this.yShiftChange.time = 0;
                                        this.yShiftChange.startValue = yShiftCurrent;
                                    }

                                    this.time+=this.timeDelta;
                                    if(this.time > 360){
                                        this.time-=360;
                                    }
                                    else if(this.time < -360){
                                        this.time+=360;
                                    }
                                

                                    this.createImage();

                                }, this, true));

                                this.createImage();

                            },
                            createImage(){
                                this.img = createCanvas(this.size, (ctx, size) => {
                                    //ctx.fillStyle = 'rgba(255,0,0,0.2)';
                                    let c1 = hsvToHex({hsv: [this.baseColorHSV[0], this.baseColorHSV[1], this.baseColorHSV[2]-30]})//'#DB7D52';
                                    let c2 = hsvToHex({hsv: [this.baseColorHSV[0], this.baseColorHSV[1], this.baseColorHSV[2]]}) //'#FFD100'; 

                                    //ctx.fillRect(0,size.y*this.imgYShift,size.x, size.y);
                                    for(let x = 0; x < size.x; x++){

                                        this.y1Shift.time = x;
                                        this.y2Shift.time = x;
                                        let y = fast.r(Math.sin(degreeToRadians((x+this.time))*7)* this.lineWidth*0.5 + size.y*this.imgYShift - easing.process(this.y1Shift));
                                        let y1 =  fast.r(Math.cos(degreeToRadians((x-this.time))*7)* this.lineWidth*0.7 + size.y*this.imgYShift + 4 + easing.process(this.y2Shift));

                                        //ctx.fillRect(x, y, 1, size.y);
                                        if(y1< y){
                                            ctx.fillStyle = c2;
                                            ctx.fillRect(x, y1, 1, size.y);
                                        }
                                        else {
                                            ctx.fillStyle = c1;
                                            ctx.fillRect(x, y, 1, y1-y)
                                            ctx.fillStyle = c2;
                                            ctx.fillRect(x, y1, 1, size.y);

                                            // for(let i = 0; i < size.y; i++){
                                            //     this.sChange.time = i;
                                            //     ctx.fillStyle = hsvToHex({hsv: [ this.baseColorHSV[0], fast.r(easing.process(this.sChange)) ,this.baseColorHSV[2] ]})  //c2;
                                            //     ctx.fillRect(x, y1+i, 1, 1);
                                            // }
                                        }
                                    }
                                })
                            }
                        }));

                        this.container = this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            lineWidth: this.lineWidth,
                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('white')
                                    .strokeRect(0,0,size.x, size.y,this.lineWidth)
                            })
                        }));
                    }
                }));
            }
        }))
    }
}