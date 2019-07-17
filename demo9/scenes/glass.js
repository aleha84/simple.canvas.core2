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
        this.backgroundRenderDefault('#7F7F7F');
    }

    start(){
        this.backGroundColor = '#D4D6D5';
        this.wavesColorMain = '#86BC26';
        this.wavesColorSecondary = '#CAD83D';

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init(){
                let scene = this.parentScene;
                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, 
                        setter: (value) => {

                            scene.glass.position.y = fast.r(scene.glass.originY + value);
                            scene.glassForeground.position.y = fast.r(scene.glassForeground.originY +value);
                            scene.glass.needRecalcRenderProperties = true;
                            scene.glassForeground.needRecalcRenderProperties = true;
                        }, 
                        propsName:'positionYChange', round: true});

                    if(this.secondWave){
                        easing.commonProcess({context: this, 
                            setter: (value) => {
                                scene.lemon.position.y = fast.r(scene.lemon.originY + value);
                                scene.lemon.needRecalcRenderProperties = true;
                            }, 
                            propsName:'secondWavePositionYChange', round: true});
                    }
                });

                this.initDelay = this.registerTimer(createTimer(2000, () => {
                    this.unregTimer(this.initDelay);
                    this.initDelay = undefined;
                    this.startSequence();
                }, this, false));
            },
            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    function() {
                        this.positionYChange = easing.createProps(25, 0, scene.viewport.y, 'cubic', 'in');
                        scene.glass.originY = scene.glass.position.y;
                        scene.glassForeground.originY = scene.glassForeground.position.y;
                        this.positionYChange.onComplete = () => this.processScript()
                    },
                    this.addProcessScriptDelay(250),
                    function() {
                        scene.flow.startFlow(() => this.processScript());
                    },
                    function() {
                        scene.flow.moveFlow();
                        scene.glass.startFilling(
                            (props) => {
                                if(props.time == (scene.glass.fillingDuration - scene.flow.startFlowDuration*3)){
                                    this.processScript();
                                }
                            }
                        );
                    },
                    function() {
                        scene.flow.stopFlow(() => this.processScript());
                    },
                    function() {
                        scene.flow.flowEnabled = false;
                        scene.lemon.fall(() => this.processScript());
                    },
                    this.addProcessScriptDelay(500),
                    function() {
                        this.positionYChange = easing.createProps(20, 0, 400, 'cubic', 'in');
                        this.positionYChange.onChange = (props) => {
                            if(props.time == 10){
                                this.secondWave = true;
                                scene.lemon.originY = scene.lemon.position.y;
                                this.secondWavePositionYChange =  easing.createProps(20, 0, 400, 'cubic', 'in');
                            }
                            
                        }
                        scene.glass.originY = scene.glass.position.y;
                        scene.glassForeground.originY = scene.glassForeground.position.y;
                        this.processScript()
                    }
                ]
                this.processScript();
            }
        }))

        this.glass = this.addGo(new GlassSceneItemGO({
            position: new V2(this.sceneCenter.x, -this.sceneCenter.y),
        }), 1)

        this.lemon = this.addGo(new GO({
            targetPosition: new V2(85, 140),
            position: new V2(85, -140),
            size: new V2(115, 90),
            img: createCanvas(new V2(45,35), (ctx, size) => {
                let originalImage = PP.createImage({"general":{"originalSize":{"x":45,"y":35},"size":{"x":45,"y":35},"zoom":6,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FFF363","fillColor":"#FFF363","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":10}},{"point":{"x":3,"y":6}},{"point":{"x":10,"y":2}},{"point":{"x":14,"y":1}},{"point":{"x":21,"y":0}},{"point":{"x":27,"y":1}},{"point":{"x":31,"y":3}},{"point":{"x":36,"y":5}},{"point":{"x":39,"y":9}},{"point":{"x":41,"y":13}},{"point":{"x":42,"y":19}},{"point":{"x":43,"y":24}},{"point":{"x":42,"y":29}},{"point":{"x":40,"y":34}}]},{"order":1,"type":"lines","strokeColor":"#FFCD00","fillColor":"#FFCD00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":11}},{"point":{"x":38,"y":33}},{"point":{"x":40,"y":29}},{"point":{"x":41,"y":23}},{"point":{"x":40,"y":19}},{"point":{"x":39,"y":15}},{"point":{"x":38,"y":12}},{"point":{"x":36,"y":9}},{"point":{"x":31,"y":5}},{"point":{"x":26,"y":3}},{"point":{"x":23,"y":2}},{"point":{"x":15,"y":3}},{"point":{"x":9,"y":5}},{"point":{"x":4,"y":8}}]},{"order":2,"type":"lines","strokeColor":"#EFC636","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":38,"y":33}},{"point":{"x":40,"y":29}},{"point":{"x":41,"y":25}},{"point":{"x":41,"y":21}},{"point":{"x":39,"y":14}},{"point":{"x":37,"y":10}},{"point":{"x":34,"y":7}},{"point":{"x":29,"y":4}},{"point":{"x":24,"y":2}},{"point":{"x":14,"y":3}}]},{"order":3,"type":"lines","strokeColor":"#FFF363","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":5}},{"point":{"x":18,"y":21}}]},{"order":4,"type":"lines","strokeColor":"#FFF363","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":27,"y":3}},{"point":{"x":20,"y":22}}]},{"order":5,"type":"lines","strokeColor":"#FFF363","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":38,"y":12}},{"point":{"x":22,"y":23}}]},{"order":6,"type":"lines","strokeColor":"#FFF363","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":41,"y":26}},{"point":{"x":23,"y":24}}]}]}});
                ctx.translate(size.x, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(originalImage, 0, 0);
            }),
            
            fall(callback) {
                this.positionYChange = easing.createProps(10, this.position.y, this.targetPosition.y, 'cubic', 'in');
                this.positionYChange.onComplete = callback;
            },
            init() {
                this.timer = this.regTimerDefault(30, () => {
                    easing.commonProcess({context: this, setter: (value) => {this.position.y = value; this.needRecalcRenderProperties = true;}, propsName:'positionYChange', round: true});
                })
            }
        }),19)

        this.glassForeground = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, -this.sceneCenter.y),
            size: new V2(150, 250),
            scale: 2,
            init() {
                this.imgSize = this.size.divide(this.scale).toInt(),
                this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
                    //hlp.setFillColor('red').strokeRect(0,0, size.x, size.y);

                    let midY = fast.r(size.y/2 + 30);
                    hlp.setFillColor('#FFFFFF')
                    hlp.strokeEllipsis(0,180, 1, new V2(size.x/2, 4), size.x/2, 4);
                    hlp.strokeEllipsis(0,180, 1, new V2(size.x/2, 4), size.x/2, 5);
                    let pp = new PerfectPixel({context: ctx});
                    pp.line(0,6,3,midY)
                    pp.line(1,6,4,midY)
                    pp.line(size.x-1,6,size.x - 1- 3,midY)
                    pp.line(size.x- 1- 1,6,size.x - 1- 4,midY)
                    for(let x = 3; x < 6;x++){
                        let bottomY = size.y-5;
                        if(x == 3)
                            bottomY -=2;
                        
                        pp.line(x,midY,x,bottomY)    
                        pp.line(size.x - 1 - x,midY,size.x - 1 - x,bottomY)    
                    }

                    hlp.setFillColor('rgba(255,255,255,0.7');
                    pp.line(9, 8, 9, 10)
                    pp.line(10, 8, 10, 30)
                    pp.line(11, 9, 11, 70)
                    pp.line(12, 9, 12, 90)

                    hlp.setFillColor('rgba(255,255,255,0.25');
                    for(let x = 0; x < 10; x++){
                        pp.line(x+55+3, 8, x+55, 105)
                    }
                    
                    let dots = []
                    hlp.setFillColor('#FFFFFF')
                    hlp.strokeEllipsis(0,180, 1, new V2(size.x/2 , size.y-25), size.x*0.9/2 - 1, 5, dots);
                    hlp.strokeEllipsis(0,180, 1, new V2(size.x/2 , size.y-26), size.x*0.9/2 - 1, 5);
                    let bottomImg = createCanvas(new V2(1,19), (ctx, size, hlp) => {
                        let vChange = easing.createProps(19, 95, 83, 'quad', 'out');
                        for(let y =0; y < 20;y++){
                            vChange.time = y;
                            let color = colors.hsvToHex([0,0,fast.r(easing.process(vChange))]);
                            hlp.setFillColor(color).dot(0,y);;
                        }
                    })

                    dots.forEach(dot => {
                        if(dot.x > 5 && dot.x < size.x-6)
                            ctx.drawImage(bottomImg, dot.x, dot.y+1)
                    })

                    hlp.setFillColor('rgba(0,0,0,0.05)').elipsis(new V2(size.x/2 , size.y-5), new V2(size.x*0.9/2 - 3, 4))

                    hlp.setFillColor('#FFFFFF')
                    //hlp.strokeEllipsis(0,180, 1, new V2(size.x/2 - 1, size.y-5), size.x*0.9/2, 5);
                    hlp.strokeEllipsis(0,180, 1, new V2(size.x/2 , size.y-6), size.x*0.9/2 - 1, 5);
                })
            }
        }), 20)

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
                this.stopFlowDuration = 20;
                this.moveTo = 170
                this.timer = this.regTimerDefault(30, () => {
                    
                    
                    easing.commonProcess({context: this, targetpropertyName: 'flowFromX', propsName:'flowFromXChange', round: true});
                    easing.commonProcess({context: this, targetpropertyName: 'flowToX', propsName:'flowToXChange', round: true});
                    easing.commonProcess({context: this, setter: (value) => this.flowWidthMultiplierFromTo[1] = value, propsName:'flowWidthMultiplierToChange'});
                    easing.commonProcess({context: this, setter: (value) => this.flowWidthMultiplierFromTo[0] = value, propsName:'flowWidthMultiplierFromChange'});
                    
                    if(this.flowEnabled){
                        this.flowTime+=this.flowTimeDelta;
                        if(this.flowTime > 360){
                            this.flowTime-=360;
                        }
                        else if(this.flowTime < -360){
                            this.flowTime+=360;
                        }

                        this.createImg();
                    }
                    else {
                        this.img = undefined;
                    }
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

                        hlp.setFillColor(this.parentScene.wavesColorMain).rect(fast.r(x+xShift), y, fast.r(flowWidth), 1)
                    }
                })
            },
            moveFlow(){
                this.flowFromXChange = easing.createProps(200, 142, this.moveTo, 'quad', 'in');
            },
            startFlow(callback) {
                this.flowFromXChange = easing.createProps(this.startFlowDuration, 210, 142, 'quad', 'in');
                this.flowFromXChange.onComplete = callback
                
                this.flowWidthMultiplierToChange = easing.createProps(this.startFlowDuration, 0.25, 1, 'quad', 'in');
                this.flowWidthMultiplierToChange.onComplete = () => {
                    this.flowWidthMultiplierFromChange = easing.createProps(this.startFlowDuration, 0.25, 1, 'quad', 'in');
                }
                
                this.flowEnabled = true;
                //this.startFlowCompleteCallback = callback;
            },
            stopFlow(callback) {
                this.flowWidthMultiplierToChange = easing.createProps(this.stopFlowDuration, 1, 0.1, 'quad', 'out');
                this.flowWidthMultiplierToChange.onComplete = () => {
                    this.flowToXChange = easing.createProps(this.stopFlowDuration, 210, this.moveTo, 'quad', 'out');
                    this.flowToXChange.onComplete = callback;
                }
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
        this.stopFillingTime = 300;
        this.wavesAmplitudeModifier = 1;
        this.yShiftModifier = 2;
        this.waves = false;


        this.y1Shift = easing.createProps(this.body.imgSize.x, -10,10, 'linear', 'base');
        this.y2Shift = easing.createProps(this.body.imgSize.x, -10,10, 'linear', 'base');

        this.yShiftChange = easing.createProps(100, 0,20, 'quad', 'inOut');

        this.timer = this.regTimerDefault(15, () => {
            if(this.wavesHeightChange){
                this.wavesHeight = fast.r(easing.process(this.wavesHeightChange));
                this.wavesHeightChange.time++;

                if(this.wavesHeight > 20  && this.wavesHeight < 90 && getRandomBool()){
                    let y = -this.size.y/2 + this.wavesHeight*this.scale + getRandomInt(20,50);
                    if(y > this.size.y/2){
                        y = this.size.y/2 - 10;
                    }
                    this.addChild(new GO({
                        renderValuesRound: true,
                        position: new V2(getRandomInt(-30,-5), y),
                        size: new V2(12,12),
                        img: createCanvas(new V2(24,24), (ctx, size, hlp) => {
                            hlp.setFillColor('#CEE89D').сircle(new V2(size.x/2,size.y/2), getRandomInt(6,12))
                        }),
                        init() {
                            this.deltaY = getRandom(2,4);
                            this.timer = this.regTimerDefault(30, () => {
                                this.position.y += this.deltaY;
                                if(this.position.y > this.parent.size.y/2 - 20){
                                    this.position.y = this.parent.size.y/2 - 20;
                                }
                                this.position.x-=0.75;
                                this.needRecalcRenderProperties = true;
                                this.deltaY-=0.25;
                            })

                            this.addEffect(new FadeOutEffect({ effectTime: getRandomInt(750, 1250), updateDelay: 30, setParentDeadOnComplete: true }))
                        }
                    }))
                }

                this.fillingChangeCallback(this.wavesHeightChange)

                if(this.wavesHeightChange.time > this.wavesHeightChange.duration){
                    this.wavesHeightChange = undefined;
                    //this.fillingCompleteCallback();
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
            this.y1Shift = easing.createProps(this.body.imgSize.x, -10+yShiftCurrent,10-yShiftCurrent, 'linear', 'base');
            this.y2Shift = easing.createProps(this.body.imgSize.x, -10+yShiftCurrent,10-yShiftCurrent, 'linear', 'base');

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

    startFilling(changeCallback){
        this.wavesHeightChange = easing.createProps(this.fillingDuration, 115, 15, 'sin', 'out')
        this.splashYDividerChange = easing.createProps(this.fillingDuration, 10, 100, 'quad', 'out')
        this.wavesAmplitudeModifierChange = easing.createProps(this.fillingDuration, 1, 0.5, 'quad', 'out')
        this.wavesTimeDeltaChnage = easing.createProps(this.fillingDuration, 1, 0.25, 'quad', 'out')
        this.yShiftModifierChange = easing.createProps(this.fillingDuration, 4, 0.5, 'quad', 'out')
        this.waves = true;
        this.fillingChangeCallback = changeCallback;
    }

    createBodyImage(){
        if(!this.bodyBackgroundImg){
            this.bodyBackgroundImg = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
                let origin = new V2(size.x/2, 4), width = size.x/2, height = 4;
                for(let angle = 180;angle < 360;angle++){
                    let r = degreeToRadians(angle);
                    let x = fast.r(origin.x + width * Math.cos(r));
                    let y = fast.r(origin.y + height * Math.sin(r));

                    hlp.setFillColor('white').dot(x,y).setFillColor(this.parentScene.backGroundColor).rect(x,y+1, 1, 4);
                }

                hlp.setFillColor(this.parentScene.backGroundColor);
                let points = [new V2(0,4), new V2(size.x-1, 4), new V2(fast.r(size.x*0.9-1), size.y-5), new V2(fast.r(size.x*0.1-1), size.y-5)];
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

                hlp.setFillColor('rgba(0,0,0,0.05)').elipsis(new V2(size.x/2 , size.y-25), new V2(size.x*0.9/2 - 2, 4))
            });
        }

        // if(!this.bodyForeroundImg){
        //     this.bodyForeroundImg = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
        //         hlp.setFillColor('#FFFFFF');

        //     })
        // }
        

        this.body.img = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
            //hlp.setFillColor('red').strokeRect(0,0, size.x, size.y);
            ctx.drawImage(this.bodyBackgroundImg, 0,0)
            ctx.globalCompositeOperation = 'source-atop';
            

            // if(this.initialFillingY == undefined){
            //     this.initialFillingY = 1;
            // }

            if(this.waves){
                hlp.setFillColor(this.parentScene.wavesColorMain).elipsis(new V2(size.x/2 , size.y-25), new V2(size.x*0.9/2 - 2, 4))
                for(let x = 0; x < size.x; x++){

                    //let splashY = fast.r( -Math.pow(x - size.x/2, 2)/this.splashYDivider + this.wavesHeight+20 );
                    let splashY = undefined;
    
                    this.y1Shift.time = x;
                    this.y2Shift.time = x;
    
                    let yShift = easing.process(this.y1Shift)*this.yShiftModifier;
                    let y1 = fast.r(Math.sin(degreeToRadians(x+this.wavesTime)*13)*3*this.wavesAmplitudeModifier + this.wavesHeight - yShift)//  - easing.process(this.y1Shift)*this.yShiftModifier);
                    let y2 = fast.r(Math.cos(degreeToRadians(x+this.wavesTime)*7)*4*this.wavesAmplitudeModifier + 4+ this.wavesHeight + yShift)//+ easing.process(this.y2Shift)*this.yShiftModifier);
    
                    

                    if(splashY){
                        y1 = fast.r((y1+splashY)/2);
                        y2 = fast.r((y2+splashY)/2);
                    }
    
                    if(y2 > y1){
                        hlp.setFillColor(this.parentScene.wavesColorSecondary).rect(x,y1, 1, y2-y1)
                        // ctx.fillStyle = c1;
                        // ctx.fillRect(x, y, 1, y1-y)
                    }
    
                    hlp.setFillColor(this.parentScene.wavesColorMain).rect(x,y2,1,size.y);
    
                    // hlp.setFillColor('green').dot(x, y1-easing.process(this.y1Shift)*this.yShiftModifier)
                    // hlp.setFillColor('blue').dot(x, y2+ easing.process(this.y1Shift)*this.yShiftModifier)

                    //hlp.setFillColor('green').dot(x, splashY)
                }


                hlp.setFillColor('rgba(255,255,255,0.1)').elipsis(new V2(size.x/2 , size.y-25), new V2(size.x*0.9/2 - 2, 4))
                

                // hlp.setFillColor(this.parentScene.wavesColorMain).rect(0,size.y-fast.r(this.initialFillingY), size.x,fast.r(this.initialFillingY))
                
                // if(this.initialFillingY < 2){
                //     this.initialFillingY+=0.25;
                // }
            }

            // ctx.globalCompositeOperation = 'source-over';
            // ctx.drawImage(this.bodyForeroundImg, 0,0)

        })
    }
}