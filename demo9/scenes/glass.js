class GlassScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init(){

            },
            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    function() {
                        scene.flow.startFlow(() => this.processScript());
                    },
                    function() {
                        scene.glass.startFilling(() => this.processScript());
                    }
                ]
                this.processScript();
            }
        }))

        this.glass = this.addGo(new GlassSceneItemGO({
            position: this.sceneCenter.clone(),
        }))

        this.flow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.flowWidth = 20
                this.flowWidthMultiplierFromTo = [0.1,0.3];
                this.flowTime = 0;
                this.flowTimeDelta = 10;
                this.flowEnabled = false;
                this.flowFromX = 210;
                this.flowToX = 210;
                this.startFlowDuration = 40;
                this.timer = this.regTimerDefault(30, () => {
                    if(this.flowEnabled){
                        this.flowTime+=this.flowTimeDelta;
                        if(this.flowTime > 360){
                            this.flowTime-=360;
                        }
                        else if(this.flowTime < -360){
                            this.flowTime+=360;
                        }
                    }
                    
                    if(this.flowFromXChange){
                        this.flowFromX = fast.r(easing.process(this.flowFromXChange));
                        this.flowFromXChange.time++;
                        if(this.flowFromXChange.time>this.flowFromXChange.duration){
                            this.flowFromXChange = undefined;
                            this.startFlowCompleteCallback();
                        }
                    }

                    if(this.flowWidthMultiplierToChange){
                        this.flowWidthMultiplierFromTo[1] = easing.process(this.flowWidthMultiplierToChange);
                        this.flowWidthMultiplierToChange.time++;
                        if(this.flowWidthMultiplierToChange.time>this.flowWidthMultiplierToChange.duration){
                            this.flowWidthMultiplierToChange = undefined;
                            this.flowWidthMultiplierFromChange = easing.createProps(this.startFlowDuration, 0.25, 1, 'quad', 'in');
                        }
                    }

                    if(this.flowWidthMultiplierFromChange){
                        this.flowWidthMultiplierFromTo[0] = easing.process(this.flowWidthMultiplierFromChange);
                        this.flowWidthMultiplierFromChange.time++;
                        if(this.flowWidthMultiplierFromChange.time>this.flowWidthMultiplierFromChange.duration){
                            this.flowWidthMultiplierFromChange = undefined;
                            
                        }
                    }
                    

                    this.createImg();
                })
            },
            createImg(){
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let flowWidthMultiplierChange = undefined;
                    let flowXLength = this.flowToX - this.flowFromX;
                    if(flowXLength > 0){
                        flowWidthMultiplierChange = easing.createProps(flowXLength, this.flowWidthMultiplierFromTo[0], this.flowWidthMultiplierFromTo[1], 'linear', 'base');
                    }
                    for(let x = this.flowFromX; x < this.flowToX; x+=0.1){
                        let flowWidth = this.flowWidth;
                        

                        let y = fast.r(Math.pow((x-size.x+35), 2)/40 -50);
                        
                        let xShift = Math.sin(degreeToRadians((y-this.flowTime)*3))*5;
                        let xShift2 = Math.sin(degreeToRadians((y-this.flowTime)*2))*6;
                        flowWidth = flowWidth - xShift +xShift2;

                        if(flowWidthMultiplierChange){
                            flowWidthMultiplierChange.time = x-this.flowFromX;
                            let flowWidthMultiplier = easing.process(flowWidthMultiplierChange);
                            flowWidth*=flowWidthMultiplier;
                        }

                        hlp.setFillColor('#EEEEEE').rect(fast.r(x+xShift), y, fast.r(flowWidth), 1)
                    }
                })
            },
            startFlow(callback) {
                this.flowFromXChange = easing.createProps(this.startFlowDuration, 210, 137, 'quad', 'in');
                this.flowWidthMultiplierToChange = easing.createProps(this.startFlowDuration, 0.25, 1, 'quad', 'in');
                this.flowEnabled = true;
                this.startFlowCompleteCallback = callback;
            }
        }), 10)
    }
}

class GlassSceneItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(150, 250),
            scale: 2,
        }, options)

        super(options);
    }

    init() {
        this.bodySize = 
        this.body = this.addChild(new GO({
            size: this.size,
            imgSize: this.size.divide(this.scale).toInt(),
            position: new V2(),
        }));

        this.createBodyImage();

        //this.splash1Change = easing.createProps(15, 60, 30, 'linear', 'base');
        this.splash1XTo = 60;
        this.wavesTime = 0;
        this.wavesHeight = 10//110;
        this.wavesTimeDelta = 0.5;
        this.splashYDivider = 10;
        this.fillingDuration = 500;
        this.wavesAmplitudeModifier = 1;
        this.yShiftModifier = 2;
        this.waves = false;

        this.y1Shift = easing.createProps(this.size.x, 0,10, 'linear', 'base');
        this.y2Shift = easing.createProps(this.size.x, -10,0, 'linear', 'base');

        this.yShiftChange = easing.createProps(100, 0,10, 'quad', 'inOut');

        this.timer = this.regTimerDefault(15, () => {
            if(this.wavesHeightChange){
                this.wavesHeight = fast.r(easing.process(this.wavesHeightChange));
                this.wavesHeightChange.time++;

                if(this.wavesHeightChange.time > this.wavesHeightChange.duration){
                    this.wavesHeightChange = undefined;
                    this.fillingCompleteCallback();
                }
            }

            if(this.splashYDividerChange){
                this.splashYDivider = fast.r(easing.process(this.splashYDividerChange));
                this.splashYDividerChange.time++;

                if(this.splashYDividerChange.time > this.splashYDividerChange.duration){
                    this.splashYDividerChange = undefined;
                }
            }

            if(this.wavesAmplitudeModifierChange){
                this.wavesAmplitudeModifier = easing.process(this.wavesAmplitudeModifierChange);
                this.wavesAmplitudeModifierChange.time++;

                if(this.wavesAmplitudeModifierChange.time > this.wavesAmplitudeModifierChange.duration){
                    this.wavesAmplitudeModifierChange = undefined;
                }
            }

            if(this.wavesTimeDeltaChnage){
                this.wavesTimeDelta = easing.process(this.wavesTimeDeltaChnage);
                this.wavesTimeDeltaChnage.time++;

                if(this.wavesTimeDeltaChnage.time > this.wavesTimeDeltaChnage.duration){
                    this.wavesTimeDeltaChnage = undefined;
                }
            }

            if(this.yShiftModifierChange){
                this.yShiftModifier = easing.process(this.yShiftModifierChange);
                this.yShiftModifierChange.time++;

                if(this.yShiftModifierChange.time > this.yShiftModifierChange.duration){
                    this.yShiftModifierChange = undefined;
                }
            }

            let yShiftCurrent = fast.r(easing.process(this.yShiftChange));
            this.y1Shift = easing.createProps(this.size.x, 0+yShiftCurrent,10-yShiftCurrent, 'linear', 'base');
            this.y2Shift = easing.createProps(this.size.x, -10+yShiftCurrent,0-yShiftCurrent, 'linear', 'base');

            this.yShiftChange.time++;
            if(this.yShiftChange.time > this.yShiftChange.duration){
                this.yShiftChange.change*=-1;
                this.yShiftChange.time = 0;
                this.yShiftChange.startValue = yShiftCurrent;
            }

            this.wavesTime+=this.wavesTimeDelta;
            if(this.wavesTime > 360){
                this.wavesTime-=360;
            }
            else if(this.wavesTime < -360){
                this.wavesTime+=360;
            }
            
            this.createBodyImage();
        })
    }

    startFilling(callback){
        this.wavesHeightChange = easing.createProps(this.fillingDuration, 130, 15, 'quad', 'out')
        this.splashYDividerChange = easing.createProps(this.fillingDuration, 10, 100, 'quad', 'out')
        this.wavesAmplitudeModifierChange = easing.createProps(this.fillingDuration, 1, 0.5, 'quad', 'out')
        this.wavesTimeDeltaChnage = easing.createProps(this.fillingDuration, 1, 0.25, 'quad', 'out')
        this.yShiftModifierChange = easing.createProps(this.fillingDuration, 2, 1, 'quad', 'out')
        this.waves = true;
        this.fillingCompleteCallback = callback;
    }

    createBodyImage(){
        if(!this.bodyBackgroundImg){
            this.bodyBackgroundImg = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
                hlp.setFillColor('#5D9EA6');
                let points = [new V2(0,0), new V2(size.x-1, 0), new V2(fast.r(size.x*0.8-1), size.y-1), new V2(fast.r(size.x*0.2-1), size.y-1)];
                let pp = new PerfectPixel({context: ctx});
                let filledPixels = [];

                for(let i = 0; i < points.length;i++){
                    let p = points;
                    if(i < p.length-1)
                        filledPixels= [...filledPixels, ...pp.lineV2(p[i], p[i+1])];
                    else {
                        filledPixels = [...filledPixels, ...pp.lineV2(p[i], p[0])];
                        let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);
                        pp.fill(uniquePoints, p)  
                    }    
                }
            });
        }
        

        this.body.img = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
            ctx.drawImage(this.bodyBackgroundImg, 0,0)
            ctx.globalCompositeOperation = 'source-atop';
            hlp.setFillColor('red').strokeRect(0,0, size.x, size.y);

            if(this.waves){
                for(let x = 0; x < size.x; x++){

                    //let splashY = fast.r( -Math.pow(x - size.x/2, 2)/this.splashYDivider + this.wavesHeight+20 );
                    let splashY = undefined;
    
                    this.y1Shift.time = x;
                    this.y2Shift.time = x;
    
    
                    let y1 = fast.r(Math.sin(degreeToRadians(x+this.wavesTime)*7)*3*this.wavesAmplitudeModifier + this.wavesHeight)//  - easing.process(this.y1Shift)*this.yShiftModifier);
                    let y2 = fast.r(Math.cos(degreeToRadians(x+this.wavesTime)*7)*4*this.wavesAmplitudeModifier + 4+ this.wavesHeight)//+ easing.process(this.y2Shift)*this.yShiftModifier);
    
                    if(splashY){
                        y1 = fast.r((y1+splashY)/2);
                        y2 = fast.r((y2+splashY)/2);
                    }
    
                    if(y2 > y1){
                        hlp.setFillColor('#CCCCCC').rect(x,y1, 1, y2-y1)
                        // ctx.fillStyle = c1;
                        // ctx.fillRect(x, y, 1, y1-y)
                    }
    
                    hlp.setFillColor('#EEEEEE').rect(x,y2,1,size.y);
    
                    //hlp.setFillColor('green').dot(x, splashY)
                }
            }
        

        })
    }
}