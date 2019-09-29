class Demo9BMove2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
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

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(150, 150),
            init() {
                this.step0 = {
                    height: 20,
                    initialWidth: 20,
                    currentWidth: 20,
                    targetWidth: this.size.x/2 + 1,
                    time: 20,
                }

                this.step1 = {
                    currentHeight: 20,
                    initialHeight: 20,
                    //targetHeight: 50,
                    targetHeights: [100,80],
                    //time: 20,
                    times: [20, 10]
                }

                this.step2 = {
                    height: this.step1.targetHeights[this.step1.targetHeights.length-1],//this.step1.targetHeight,
                    initialY: 0,
                    currentY: 0,
                    targetY: this.size.y-this.step1.targetHeights[this.step1.targetHeights.length-1],
                    time: 20,
                }

                this.step3 = {
                    initialHeight: this.step2.height,
                    currentHeight: this.step2.height,
                    targetHeights: [5,20],
                    times: [15, 10]
                }

                this.step4 = {
                    height: this.step3.targetHeights[this.step3.targetHeights.length-1],
                    initialWidth: fast.r(this.size.x/2 + 1),
                    currentWidth: fast.r(this.size.x/2 + 1),
                    targetWidths: [5,20],
                    times: [20,10],
                }

                this.step5 = {
                    width: this.step4.targetWidths[this.step4.targetWidths.length-1],
                    initialHeight: this.step4.height,
                    targetHeight: 40,
                    initialY: this.size.y-this.step4.height,
                    currentY: this.size.y-this.step4.height,
                    targetY: 0,
                    time: 20,
                }

                this.step6 = {
                    width: this.step5.width,
                    initialHeight: this.step5.targetHeight,
                    currentHeight: this.step5.targetHeight,
                    targetHeights: [5,20],
                    times: [15, 10]
                }

                //this.currentStep = 0

                this.timer = this.regTimerDefault(15, () => {
                    if(this.currentStep == 0){
                        easing.commonProcess({ context: this.step0, targetpropertyName: 'currentWidth', propsName: 'widthChange', round: false, removePropsOnComplete: true })
                    }
                    
                    if(this.currentStep == 1){
                        if(!this.step1.heightChange){
                            this.step1.heightChange = this.step1.heightChanges.shift();
                        }

                        easing.commonProcess({ context: this.step1, targetpropertyName: 'currentHeight', propsName: 'heightChange', round: false, removePropsOnComplete: true })
                    }

                    if(this.currentStep == 2){
                        easing.commonProcess({ context: this.step2, targetpropertyName: 'currentY', propsName: 'yChange', round: false, removePropsOnComplete: true })
                    }

                    if(this.currentStep == 3){
                        if(!this.step3.heightChange){
                            this.step3.heightChange = this.step3.heightChanges.shift();
                        }

                        easing.commonProcess({ context: this.step3, targetpropertyName: 'currentHeight', propsName: 'heightChange', round: false, removePropsOnComplete: true })
                    }

                    if(this.currentStep == 4){
                        if(!this.step4.widthChange){
                            this.step4.widthChange = this.step4.widthChanges.shift();
                        }

                        easing.commonProcess({ context: this.step4, targetpropertyName: 'currentWidth', propsName: 'widthChange', round: false, removePropsOnComplete: true })
                    }

                    if(this.currentStep == 5){
                        easing.commonProcess({ context: this.step5, targetpropertyName: 'currentY', propsName: 'yChange', round: false, removePropsOnComplete: true })
                        easing.commonProcess({ context: this.step5, targetpropertyName: 'currentHeight', propsName: 'heightChange', round: false, removePropsOnComplete: true })
                    }

                    if(this.currentStep == 6){
                        if(!this.step6.heightChange){
                            this.step6.heightChange = this.step6.heightChanges.shift();
                        }

                        easing.commonProcess({ context: this.step6, targetpropertyName: 'currentHeight', propsName: 'heightChange', round: false, removePropsOnComplete: true })
                    }

                    this.createImage();
                })

                this.startSequence();
            },
            runStep0(callback) {
                this.currentStep = 0;
                let s = this.step0;
                s.widthChange = easing.createProps(s.time, s.initialWidth, s.targetWidth, 'quad', 'in', callback);
            },
            runStep1(callback) {
                this.currentStep = 1;
                let s = this.step1;
                //s.heightChange = easing.createProps(s.time, s.initialHeight, s.targetHeight, 'quad', 'in', callback);
                s.heightChanges = [
                    easing.createProps(s.times[0], s.initialHeight, s.targetHeights[0], 'quad', 'out'),
                    easing.createProps(s.times[1], s.targetHeights[0], s.targetHeights[1], 'quad', 'in', callback)];
            },
            runStep2(callback) {
                this.currentStep = 2;
                let s = this.step2;
                s.yChange = easing.createProps(s.time, s.initialY, s.targetY, 'quad', 'in', callback);
            },
            runStep3(callback) {
                this.currentStep = 3;
                let s = this.step3;
                s.heightChanges = [
                    easing.createProps(s.times[0], s.initialHeight, s.targetHeights[0], 'quad', 'out'),
                    easing.createProps(s.times[1], s.targetHeights[0], s.targetHeights[1], 'quad', 'in', callback)];
            },
            runStep4(callback) {
                this.currentStep = 4;
                let s = this.step4;
                s.widthChanges = [
                    easing.createProps(s.times[0], s.initialWidth, s.targetWidths[0], 'quad', 'out'),
                    easing.createProps(s.times[1], s.targetWidths[0], s.targetWidths[1], 'quad', 'in', callback)];
            },
            runStep5(callback) {
                this.currentStep = 5;
                let s = this.step5;
                s.heightChange = easing.createProps(s.time, s.initialHeight, s.targetHeight, 'quad', 'in', callback);
                s.yChange = easing.createProps(s.time, s.initialY, s.targetY, 'quad', 'in');
            },
            runStep6(callback) {
                this.currentStep = 6;
                let s = this.step6;
                s.heightChanges = [
                    easing.createProps(s.times[0], s.initialHeight, s.targetHeights[0], 'quad', 'out'),
                    easing.createProps(s.times[1], s.targetHeights[0], s.targetHeights[1], 'quad', 'in', callback)];
            },

            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('#CCC').strokeRect(0,0,size.x, size.y);

                    hlp.setFillColor('white');

                    if(this.currentStep == 0){
                        hlp.rect(0,0,this.step0.currentWidth, this.step0.height);
                        hlp.rect(size.x - this.step0.currentWidth,0,this.step0.currentWidth, this.step0.height);
                    }

                    if(this.currentStep == 1){
                        hlp.rect(0,0,size.x, this.step1.currentHeight);
                    }

                    if(this.currentStep == 2){
                        hlp.rect(0,this.step2.currentY,size.x, this.step2.height);
                    }

                    if(this.currentStep == 3){
                        hlp.rect(0,size.y-this.step3.currentHeight,size.x, this.step3.currentHeight);
                    }

                    if(this.currentStep == 4){
                        hlp.rect(0,size.y-this.step4.height,this.step4.currentWidth, this.step4.height);
                        hlp.rect(size.x - this.step4.currentWidth,size.y-this.step4.height,this.step4.currentWidth, this.step4.height);
                    }

                    if(this.currentStep == 5){
                        // hlp.rect(0,size.y-this.step4.height,this.step4.currentWidth, this.step4.height);
                        // hlp.rect(size.x - this.step4.currentWidth,size.y-this.step4.height,this.step4.currentWidth, this.step4.height);
                        hlp.rect(0,this.step5.currentY,this.step5.width, this.step5.currentHeight);
                        hlp.rect(size.x - this.step5.width,this.step5.currentY,this.step5.width, this.step5.currentHeight);
                    }

                    if(this.currentStep == 6){
                        hlp.rect(0,0,this.step6.width, this.step6.currentHeight);
                        hlp.rect(size.x - this.step6.width,0,this.step6.width, this.step6.currentHeight);
                    }
                })
            },

            startSequence() {
                //let scene = this.parentScene;
                this.script.items = [
                    function(){
                        this.runStep0(() => this.processScript());
                    },
                    this.addProcessScriptDelay(200),
                    function(){
                        this.runStep1(() => this.processScript());
                    },
                    this.addProcessScriptDelay(100),
                    function(){
                        this.runStep2(() => this.processScript());
                    },
                    function(){
                        this.runStep3(() => this.processScript());
                    },
                    this.addProcessScriptDelay(150),
                    function(){
                        this.runStep4(() => this.processScript());
                    },
                    this.addProcessScriptDelay(50),
                    function(){
                        this.runStep5(() => this.processScript());
                    },
                    function(){
                        this.runStep6(() => this.processScript());
                    },
                    this.addProcessScriptDelay(250),
                    function(){
                        this.startSequence();
                    }
                ]

                this.processScript();
            }
        }), 1)


        // this.smokeLayer = this.addGo(new SmokeSceneLayerGO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone()
        // }))
    }
}

// class SmokeSceneLayerGO extends GO {
//     constructor(options = {}) {
//         options = assignDeep({}, {
//             hClamps: [10, 30],
//             wClamps: [40, 50],
//             fromY: 250, 
//             toY: 200
//         }, options)

//         super(options);
//     }

//     init() {
        
//         this.direction = new V2(0, this.fromY).direction(new V2(this.size.x, this.toY));

//         this.items = [];
//         let currentWidth = getRandomInt(this.wClamps[0], this.wClamps[1]);
//         let currentX = -currentWidth;
        
//         this.startX = currentX;
//         this.yChange = easing.createProps(this.size.x+currentWidth, this.fromY, this.toY, 'linear', 'base');
//         while(currentX < this.size.x){
//             let end = this.direction.mul(currentWidth);

//             this.items.push({
//                 dots: mathUtils.getCurvePoints({start: new V2(0,0), end: end, midPoints: [ {distance: getRandom(10,15)/20, yChange: -getRandomInt(this.hClamps[0], this.hClamps[1])} ]}),
//                 startX: currentX
//             })

//             currentX+=end.x;
//             currentWidth = getRandomInt(this.wClamps[0], this.wClamps[1]);
//         }

//         // this.timer = this.regTimerDefault(15, () => {
//         //     this.createImage();
//         // })

//         this.createImage();
//     }

//     createImage() {
//         this.img = createCanvas(this.size, (ctx, size, hlp) => {
//             for(let i = 0; i < this.items.length;i++){
//                 let item = this.items[i];
    
//                 this.yChange.time = item.startX-this.startX;
//                 let currentY = fast.r(easing.process(this.yChange));
    
//                 hlp.setFillColor('white');
//                 for(let d = 0;d< item.dots.length;d++){
//                     let dot = item.dots[d].toInt();
//                     hlp.rect(fast.r(dot.x+item.startX), fast.r(dot.y+currentY), 1, size.y)
//                 }
//             }
//         })
        
//     }
// }