class Demo10GoodScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'good'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['bg'] })
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['house', 'h_d_1', 'fronal_h', 'fr_h2', 'letters', 'w_p'] })
        }), 10)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            // createStarFrames({framesCount, itemsCount, itemFrameslength, size}) {
            //     let frames = [];
            //     let hsv = colors.colorTypeConverter({value: '#1f3651', toType: 'hsv', fromType: 'hex'});

            //     let linePoints = [];
            //     createCanvas(new V2(1,1), (ctx, s, hlp) => {
            //         let pp = new PP({ctx});
            //         linePoints = pp.lineV2(new V2(size.x/2, -50), new V2(size.x/2,size.y + 50));
            //     })

            //     let staticImg = createCanvas(size, (ctx, _size, hlp) => {
            //         for(let i = 0; i < 100; i++){
            //             let v = hsv.v + getRandomInt(1, 4)*10;
            //             hlp.setFillColor(colors.colorTypeConverter({value: { h: hsv.h, s: hsv.s, v: v }, toType: 'hex', fromType: 'hsv'}))
            //             .dot(getRandomInt(0, _size.x), getRandomInt(0, _size.y))
            //         }
            //     })

            //     let itemsData = new Array(itemsCount).fill().map((el, i) => {
            //         let startFrameIndex = getRandomInt(0, framesCount-1);
            //         let totalFrames = getRandomInt(10, 20);

            //         // let x = getRandomInt(0, size.x)
            //         // let y = getRandomInt(0, size.y)
            //         let p = linePoints[getRandomInt(0, linePoints.length-1)];
            //         let y = p.y;
            //         let x = p.x + getRandomGaussian(-size.x, size.x);
            //         let _p = new V2(x,y).substract(p).rotate(20).add(p).toInt();

            //         let v = hsv.v + getRandomInt(1, 4)*10;
                
            //         let frames = new Array(framesCount).fill().map(() =>  ({}));
            //         if(getRandomInt(0, 3) == 0){
            //             for(let f = 0; f < totalFrames; f++){
            //                 let frameIndex = f + startFrameIndex;
            //                 if(frameIndex > (framesCount-1)){
            //                     frameIndex-=framesCount;
            //                 }
                    
            //                 frames[frameIndex] = {
            //                     highlight: true
            //                 };
            //             }
            //         }
                    
                
            //         return {
            //             x: _p.x, 
            //             y: _p.y,
            //             v,
            //             frames
            //         }
            //     })
                
            //     for(let f = 0; f < framesCount; f++){
            //         frames[f] = createCanvas(size, (ctx, size, hlp) => {
            //             ctx.drawImage(staticImg, 0,0);
            //             for(let p = 0; p < itemsData.length; p++){
            //                 let itemData = itemsData[p];
                            
            //                 if(itemData.frames[f]){
            //                     let v = itemData.v;
            //                     if(itemData.frames[f].highlight){
            //                         v*=2;
            //                         if(v > 100)
            //                             v = 100;
            //                     }
            //                     hlp.setFillColor(colors.colorTypeConverter({value: { h: hsv.h, s: hsv.s, v: v }, toType: 'hex', fromType: 'hsv'}))
            //                     .dot(itemData.x, itemData.y)
            //                 }
                            
            //             }
            //         });
            //     }
                
            //     return frames;
            // },
            createStarFrames({framesCount, itemsCount, itemFrameslength, size}) {
                
                let frames = [];
                let hsv = colors.colorTypeConverter({value: '#1f3651', toType: 'hsv', fromType: 'hex'});

                let center = new V2(0, size.y*5);
                let maxAngle = 10//radiansToDegree(Math.atan(size.x / center.y));

                let aChange = easing.fast({ from: 0, to: maxAngle, steps: framesCount, type: 'linear' });
                let r = center.y;

                let itemsData = new Array(itemsCount).fill().map((el, i) => {

                    let v = hsv.v + getRandomInt(1, 4)*10;
                    //let r =  getRandomInt(center.x - size.x, center.x); //(center.x - size.x) + 50 //
                    let yShift = getRandomInt(-50, size.y);
                    let startAngle = 270 + getRandom(0, maxAngle);

                    let startFrameIndex = 0//getRandomInt(0, framesCount-1);
                    let totalFrames = framesCount;//itemFrameslength;
                
                    let frames = [];

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let a1 = degreeToRadians((startAngle - aChange[f]));
                        let a2 = degreeToRadians(((startAngle+maxAngle) - aChange[f]));
                        let a3 = degreeToRadians(((startAngle+maxAngle*2) - aChange[f]));
                        let a4 = degreeToRadians(((startAngle+maxAngle*3) - aChange[f]));

                        frames[frameIndex] = {
                            p1: new V2(center.x + r*Math.cos(a1), center.y + r*Math.sin(a1)+ yShift).toInt(),
                            p2: new V2(center.x + r*Math.cos(a2), center.y + r*Math.sin(a2)+ yShift).toInt(),
                            p3: new V2(center.x + r*Math.cos(a3), center.y + r*Math.sin(a3)+ yShift).toInt(),
                            p4: new V2(center.x + r*Math.cos(a4), center.y + r*Math.sin(a4)+ yShift).toInt()
                        };
                    }

                    if(getRandomInt(0, 3) == 0){
                        let tf = getRandomInt(20,40);
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let maxV = fast.r(v*1.5);
                        if(maxV > 100){
                            maxV = 100;
                        }

                        let vValues = [
                            ...easing.fast({ from: v, to: maxV, steps: fast.r(tf/2), type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({ from: maxV, to: v, steps: fast.r(tf/2), type: 'quad', method: 'inOut', round: 0})
                        ]
                        for(let f = 0; f < tf; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex].highlight = true
                            frames[frameIndex].v = vValues[f];
                        }
                    }
                
                    return {
                        v,
                        startAngle,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let v = itemData.v;

                                if(itemData.frames[f].highlight){
                                    v = itemData.frames[f].v;
                                    if(v > 100)
                                        v = 100;

                                    hlp.setFillColor(colors.colorTypeConverter({value: { h: hsv.h, s: hsv.s, v: fast.r((v + hsv.v)/2) }, toType: 'hex', fromType: 'hsv'}))
                                        .rect(itemData.frames[f].p1.x-1, itemData.frames[f].p1.y, 3, 1).rect(itemData.frames[f].p1.x, itemData.frames[f].p1.y-1, 1, 3)
                                        .rect(itemData.frames[f].p2.x-1, itemData.frames[f].p2.y, 3, 1).rect(itemData.frames[f].p2.x, itemData.frames[f].p2.y-1, 1, 3)
                                        .rect(itemData.frames[f].p3.x-1, itemData.frames[f].p3.y, 3, 1).rect(itemData.frames[f].p3.x, itemData.frames[f].p3.y-1, 1, 3)
                                        .rect(itemData.frames[f].p4.x-1, itemData.frames[f].p4.y, 3, 1).rect(itemData.frames[f].p4.x, itemData.frames[f].p4.y-1, 1, 3)
                                }

                                hlp.setFillColor(colors.colorTypeConverter({value: { h: hsv.h, s: hsv.s, v: v }, toType: 'hex', fromType: 'hsv'}))
                                .dot(itemData.frames[f].p1)
                                .dot(itemData.frames[f].p2)
                                .dot(itemData.frames[f].p3)
                                .dot(itemData.frames[f].p4);

                                if(itemData.frames[f].highlight){
                                    
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarFrames({ framesCount: 600, itemsCount: 300, size: this.size })

                let repeat = 3;
                this.registerFramesDefaultTimer({framesEndCallback: () => { 
                    repeat--;
                    if(repeat == 0)
                        this.parentScene.capturing.stop = true; 
                    } });
            }
        }), 5)

        this.blink = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.h1 = this.addChild(new GO({
                    isVisible: false, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['l_h1'] })
                }))
                this.h2 = this.addChild(new GO({
                    isVisible: false, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['l_h2'] })
                }))
                this.h3 = this.addChild(new GO({
                    isVisible: false, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['l_h3'] })
                }))

                let showTimings = 
                {50: ['h1'], 51: ['h1'], 54: ['h1'], 113: ['h1'],115: ['h1'], 125: ['h3'], 127:['h3'], 130: ['h3'], 150: ['h2'], 152: ['h2'], 153: ['h2'], 155: ['h2']}

                new Array(20).fill().forEach((_,i) => {
                    showTimings[80 +i] = ['h1'];
                })
                // new Array(10).fill().forEach((_,i) => {
                //     let index = 120+i;
                //     if(showTimings[index]) {
                //         showTimings[index].push('h3')
                //     }
                //     else {
                //         showTimings[index] = ['h3'];
                //     }
                // })

                let totalFrames = 200;
                this.currentFrame = 0;
                //this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.childrenGO.forEach(c => c.isVisible = false)

                    let t = showTimings[this.currentFrame];
                    if(t) {
                        t.forEach(chName => {
                            this[chName].isVisible = true;
                        });
                    }
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 15)

        this.blink = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.w_1 = this.addChild(new GO({
                    isVisible: false, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['w_1'] })
                }))
                this.w_2 = this.addChild(new GO({
                    isVisible: true, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['w_2'] })
                }))
                this.w_3 = this.addChild(new GO({
                    isVisible: false, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['w_3'] })
                }))
                this.w_4 = this.addChild(new GO({
                    isVisible: true, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['w_4'] })
                }))
                this.w_5 = this.addChild(new GO({
                    isVisible: true, position: new V2(), size: this.size, img: PP.createImage(Demo10GoodScene.models.main, { renderOnly: ['w_5'] })
                }))

                let totalFrames = 600;
                let showTimings = new Array(totalFrames).fill().map(() => ([]));

                new Array(400).fill().forEach((_,i) => {
                    showTimings[80 +i].push('w_1')
                })

                new Array(500).fill().forEach((_,i) => {
                    let index = 300 +i;
                    if( index > (totalFrames-1)){
                        index-=totalFrames;
                    }
                    showTimings[index].push('w_2')
                })
                new Array(300).fill().forEach((_,i) => {
                    let index = 200 +i;
                    if( index > (totalFrames-1)){
                        index-=totalFrames;
                    }
                    showTimings[index].push('w_3')
                })
                new Array(450).fill().forEach((_,i) => {
                    let index = 280 +i;
                    if( index > (totalFrames-1)){
                        index-=totalFrames;
                    }
                    showTimings[index].push('w_4')
                })
                new Array(350).fill().forEach((_,i) => {
                    let index = 400 +i;
                    if( index > (totalFrames-1)){
                        index-=totalFrames;
                    }
                    showTimings[index].push('w_5')
                })
                
                this.currentFrame = 0;
                //this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.childrenGO.forEach(c => c.isVisible = false)

                    let t = showTimings[this.currentFrame];
                    if(t) {
                        t.forEach(chName => {
                            this[chName].isVisible = true;
                        });
                    }
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 15)

        this.tv1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10GoodScene.models.tvFrames1),
            init() {

                    this.currentFrame = 0;
                    this.img = this.frames[getRandomInt(0, this.frames.length-1)]//this.frames[this.currentFrame].f;
                    
                    let originFrameChangeDelay = getRandomInt(5,10) //this.frames[this.currentFrame].d;
                    let frameChangeDelay = originFrameChangeDelay;
                    
                    let animationRepeatDelayOrigin = 0;
                    let animationRepeatDelay = animationRepeatDelayOrigin;
                    
                    this.timer = this.regTimerDefault(10, () => {
                        animationRepeatDelay--;
                        if(animationRepeatDelay > 0)
                            return;
                    
                        frameChangeDelay--;
                        if(frameChangeDelay > 0)
                            return;
                    
                        frameChangeDelay = getRandomInt(5,10)//this.frames[this.currentFrame].d;;
                    
                        this.img = this.frames[getRandomInt(0, this.frames.length-1)]//this.frames[this.currentFrame].f;
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                            animationRepeatDelay = animationRepeatDelayOrigin;
                        }
                    })
            }
        }), 16)
        this.tv1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10GoodScene.models.tvFrames2),
            init() {

                    this.currentFrame = 0;
                    this.img = this.frames[getRandomInt(0, this.frames.length-1)]//this.frames[this.currentFrame].f;
                    
                    let originFrameChangeDelay = getRandomInt(10,20) //this.frames[this.currentFrame].d;
                    let frameChangeDelay = originFrameChangeDelay;
                    
                    let animationRepeatDelayOrigin = 0;
                    let animationRepeatDelay = animationRepeatDelayOrigin;
                    
                    this.timer = this.regTimerDefault(10, () => {
                        animationRepeatDelay--;
                        if(animationRepeatDelay > 0)
                            return;
                    
                        frameChangeDelay--;
                        if(frameChangeDelay > 0)
                            return;
                    
                        frameChangeDelay = getRandomInt(5,10)//this.frames[this.currentFrame].d;;
                    
                        this.img = this.frames[getRandomInt(0, this.frames.length-1)]//this.frames[this.currentFrame].f;
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                            animationRepeatDelay = animationRepeatDelayOrigin;
                        }
                    })
            }
        }), 16)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10GoodScene.models.catFrames),
            init() {
                this.frames = [
                    ...this.frames,
                    this.frames[this.frames.length-2],
                    this.frames[this.frames.length-1],
                    this.frames[this.frames.length-2],
                    this.frames[this.frames.length-1],
                    // this.frames[this.frames.length-2],
                    // this.frames[this.frames.length-1],
                    ...this.frames.reverse()
                ]

                this.registerFramesDefaultTimer({originFrameChangeDelay: 10, animationRepeatDelayOrigin: 180});
            }
        }), 16)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10GoodScene.models.smoker),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 10, animationRepeatDelayOrigin: 200});
            }
        }), 17)
    }
}