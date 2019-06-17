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
                            hlp.setFillColor('gray').rect(0,0, size.x, size.y)
                            .setFillColor('#B2B2B2').rect(2,2, size.x-4, size.y-2)
                            .setFillColor('gray').dot(2,2).dot(size.x-3,2)
                            .clear(0,0).clear(size.x-1,0);
                        })
                    }
                }));

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    lineWidth: this.lineWidth,
                    init() {
                        this.back = this.addChild(new GO({
                            position: new V2(),
                            size: this.size.mul(0.9).toInt(),
                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('#F2F2F2').rect(0,0,size.x, size.y)
                                .setFillColor('rgba(0,0,0,0.1')
                                
                                .rect(0, this.lineWidth+ size.y*0.2, size.x , 3)
                                .rect(0, this.lineWidth+ size.y*0.45, size.x , 3)
                                .rect(0, this.lineWidth+ size.y*0.7, size.x , 3)
                            }) 
                        }));
                        this.content = this.addChild(new GO({
                            position: new V2(0,-1.5),
                            size: this.size.mul(0.95).toInt(), 
                            imgCache: [],
                            lineWidth: this.lineWidth,
                            imgYShift: 0.08,
                            baseColorHSV: [51,80,90],
                            amplitudeModifier: 0.5,
                            yShiftModifier: 0.5,
                            fillAnimationDuration: 250,//500,
                            timeDelta: 2,
                            stopAnimation: false,
                            init() {
                                this.reset();
                                this.time = 0;
                                //this.timeDelta = 2;
                                
                                this.timeDeltaChange = easing.createProps(300, 1,-1, 'quad', 'inOut');
                                this.y1Shift = easing.createProps(this.size.x, 0,10, 'linear', 'base');
                                this.y2Shift = easing.createProps(this.size.x, -10,0, 'linear', 'base');

                                this.yShiftChange = easing.createProps(100, 0,10, 'quad', 'inOut');

                                this.sChange = easing.createProps(this.size.y, this.baseColorHSV[1],this.baseColorHSV[1]-20, 'quad', 'out');

                                this.timer = this.registerTimer(createTimer(30, () => {

                                    if(this.fillChanges){
                                        this.fillChanges.forEach(c => {
                                            c.setter(easing.process(c.prop));
                                            c.prop.time++;
                                        })

                                        if(this.fillChanges[0].prop.time > this.fillChanges[0].prop.duration){
                                            this.fillChanges = undefined;
                                            this.stopAnimation = true;
                                        }
                                    }

                                    // this.timeDelta = easing.process(this.timeDeltaChange);
                                    // this.timeDeltaChange.time++;
                                    // if(this.timeDeltaChange.time > this.timeDeltaChange.duration){
                                    //     this.timeDeltaChange.time = 0;
                                    //     this.timeDeltaChange.change*=-1;
                                    //     this.timeDeltaChange.startValue = this.timeDelta;
                                    // }


                                    if(!this.stopAnimation){
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
                                    }

                                    

                                }, this, true));

                                this.createImage();
                                this.fill();

                            },
                            reset(){
                                this.baseColorHSV[0] = 0;
                                this.imgYShift = 0.9;
                                this.timeDelta = 2;
                                this.amplitudeModifier = 1;
                                this.yShiftModifier = 1;
                                this.stopAnimation = false;
                            },
                            fill() {
                                this.fillChanges = [
                                    {setter: (value) => { this.imgYShift = value; },  prop: easing.createProps(this.fillAnimationDuration, this.imgYShift, 0, 'quad', 'out')},
                                    {setter: (value) => { this.baseColorHSV[0] = value; }, prop: easing.createProps(this.fillAnimationDuration, this.baseColorHSV[0],80, 'quad', 'out')},
                                    {setter: (value) => { this.timeDelta = value; }, prop: easing.createProps(this.fillAnimationDuration, this.timeDelta, 0.5, 'quad', 'out')},
                                    {setter: (value) => { this.amplitudeModifier = value; }, prop: easing.createProps(this.fillAnimationDuration, this.amplitudeModifier, 0.25, 'quad', 'out')},
                                    {setter: (value) => { this.yShiftModifier = value; }, prop: easing.createProps(this.fillAnimationDuration, this.yShiftModifier, 0.25, 'quad', 'out')},
                                ];
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
                                        let y = fast.r(Math.sin(degreeToRadians((x+this.time))*7)* this.lineWidth*this.amplitudeModifier*0.5 + size.y*this.imgYShift - easing.process(this.y1Shift)*this.yShiftModifier);
                                        let y1 =  fast.r(Math.cos(degreeToRadians((x-this.time))*7)* this.lineWidth*this.amplitudeModifier*0.7 + size.y*this.imgYShift + 4 + easing.process(this.y2Shift)*this.yShiftModifier);

                                        //ctx.fillRect(x, y, 1, size.y);

                                        if(y1 > y){
                                            ctx.fillStyle = c1;
                                            ctx.fillRect(x, y, 1, y1-y)
                                        }

                                        // ctx.fillStyle = c2;
                                        // ctx.fillRect(x, y1, 1, size.y);

                                        for(let i = 0; i < size.y; i++){
                                            this.sChange.time = i;
                                            let s = fast.r(easing.process(this.sChange));
                                            s = fast.f(s/6)*6;
                                            ctx.fillStyle = hsvToHex({hsv: [ this.baseColorHSV[0], s ,this.baseColorHSV[2] ]});
                                            
                                            // if(y1+i < this.lineWidth*2 + size.y*this.imgYShift){
                                            //     ctx.fillStyle = c2;
                                            // }
                                            // else {
                                            //     //this.sChange.time = y1+i - (this.lineWidth*2 + size.y*this.imgYShift)//i;
                                            //     this.sChange.time = i;
                                            //     let s = fast.r(easing.process(this.sChange));
                                            //     //s = fast.f(s/10)*10;

                                            //     ctx.fillStyle = hsvToHex({hsv: [ this.baseColorHSV[0], s ,this.baseColorHSV[2] ]})  //c2;
                                            // }
                                            
                                            ctx.fillRect(x, y1+i, 1, 1);
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
                                let lHalf = fast.r(this.lineWidth/2);
                                let l3_4 = fast.r(this.lineWidth*3/5);
                                hlp.setFillColor('#E5E5E5')
                                    .strokeRect(0,0,size.x, size.y,this.lineWidth)
                                    //.dot(this.lineWidth,this.lineWidth)
                                .setFillColor('#B2B2B2').strokeRect(0,0,size.x, size.y,l3_4)
                                .dot(l3_4,l3_4).dot(size.x-l3_4-1,l3_4)
                                .dot(l3_4,size.y-l3_4-1).dot(size.x-l3_4-1,size.y-l3_4-1)

                                .clear(0,0).clear(0,1).clear(1,0)
                                .clear(size.x-1,0).clear(size.x-1,1).clear(size.x-2,0)
                                .clear(0,size.y-1).clear(0,size.y-2).clear(1,size.y-1)
                                .clear(size.x-1,size.y-1).clear(size.x-1,size.y-2).clear(size.x-2,size.y-1)
                                
                                .setFillColor('rgba(255,255,255,0.4')
                                .rect(this.lineWidth*1, this.lineWidth*1, this.lineWidth*1.5, size.y - this.lineWidth*2)
                                .dot(this.lineWidth*2.5,this.lineWidth).dot(this.lineWidth*2.5+1,this.lineWidth).dot(this.lineWidth*2.5,this.lineWidth+1)
                                .dot(this.lineWidth*2.5,size.y-this.lineWidth-1).dot(this.lineWidth*2.5,size.y-this.lineWidth-2).dot(this.lineWidth*2.5+1,size.y-this.lineWidth-1)

                                // .rect(this.lineWidth, this.lineWidth+ size.y*0.2, size.x - this.lineWidth*2, 3)
                                // .rect(this.lineWidth, this.lineWidth+ size.y*0.45, size.x - this.lineWidth*2, 3)
                                // .rect(this.lineWidth, this.lineWidth+ size.y*0.7, size.x - this.lineWidth*2, 3)

                                .setFillColor('rgba(0,0,0,0.1')
                                .rect(size.x - this.lineWidth*2.5, this.lineWidth*1, this.lineWidth*1.5, size.y - this.lineWidth*2)
                                .dot(size.x - this.lineWidth*2.5 - 2,this.lineWidth).dot(size.x -this.lineWidth*2.5 - 1,this.lineWidth).dot(size.x - this.lineWidth*2.5 - 1,this.lineWidth+1)
                                .dot(size.x - this.lineWidth*2.5 -2,size.y-this.lineWidth-1).dot(size.x - this.lineWidth*2.5 - 1,size.y-this.lineWidth-2).dot(size.x - this.lineWidth*2.5-1,size.y-this.lineWidth-1)
                            })
                        }));
                    }
                }));
            }
        }))
    }
}