class JustreeScreamScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,   
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'scream'
            },
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

    createRain3Frames({framesCount, itemsCount, itemFrameslength, dropLength, xShift, size, color}) {
        let frames = [];
        let sharedPP;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx});
        })

        let rgb = colors.colorTypeConverter({value: color, toType: 'rgb', fromType: 'hex'})
        
        let middle = size.x/2;
        //let oValues = easing.fast({from: 1, to: 0, steps: dropLength, type: 'quad', method: 'out', round: 2});
        let oFirstPart = fast.r(dropLength/5);
        let oValues = [
            ...easing.fast({from: 0, to: 1, steps: oFirstPart, type: 'quad', method: 'out', round: 2}),
            ...easing.fast({from: 1, to: 0, steps: dropLength-oFirstPart, type: 'quad', method: 'out', round: 2})
        ]
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let x = getRandomInt(0, size.x);
            let startY = getRandomInt(-2*dropLength, -dropLength);
            let deltaFromMiddle = fast.r(Math.abs(x-middle));
            //let xShift = deltaFromMiddle/deltaDivider;
            //let target = new V2( x > middle ? x + xShift : x - xShift , size.y);
            let target = new V2(x+xShift, size.y);
            let points = sharedPP.lineV2(new V2(x, startY), target);
            let pointIndexes = easing.fast({from: 0, to: points.length-1, steps: itemFrameslength, type: 'linear', method: 'base', round: 0});

            //let yValues = easing.fast({from: startY, to: size.y+dropLength, steps: itemFrameslength, type: 'linear', method: 'base', round: 0});

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    //y: yValues[f]
                    pointIndex: pointIndexes[f]
                };
            }
        
            return {
                points, 
                pointIndexes,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let {points, 
                            pointIndexes,
                            frames} = itemData;

                        //hlp.setFillColor(color);

                            let prevPoint = undefined;
                        for(let i =0; i < dropLength; i++){

                            let index = frames[f].pointIndex - i;
                            if(index < 0)
                                break;

                            let point = points[index];
                            hlp.setFillColor(`rgba(${rgb.r},${rgb.g}, ${rgb.b}, ${oValues[i]})`).dot(point.x, point.y);

                            if(prevPoint && prevPoint.x != point.x){
                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g}, ${rgb.b}, ${oValues[i]/2})`)
                                    .dot(point.x-1, point.y).dot(point.x, point.y+1);
                            }

                            prevPoint = point;
                        }
                        //hlp.setFillColor(color).rect(itemData.x, itemData.frames[f].y, 1, dropLength)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    createRain2Frames({framesCount, itemsCount, itemFrameslength, dropLength, size, color}) {
        let frames = [];
        

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let x = getRandomInt(0, size.x);
            let startY = getRandomInt(-2*dropLength, -dropLength);

            let yValues = easing.fast({from: startY, to: size.y+dropLength, steps: itemFrameslength, type: 'linear', method: 'base', round: 0});

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    y: yValues[f]
                };
            }
        
            return {
                x,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(color).rect(itemData.x, itemData.frames[f].y, 1, dropLength)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    createRainFrames({framesCount, itemsCount, itemFrameslength, size, color}) {
        let frames = [];
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let x = getRandomInt(0, size.x);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    visible: true
                };
            }
        
            return {
                x,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(color).rect(itemData.x, 0, 1, size.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
            })
        }), 0)

        this.lighting = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(125,125),
            frames: PP.createImage(JustreeScreamScene.model.lightnigFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 2;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 100;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 1)

        this.scream = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0, 12)),
            size: new V2(100,100),
            frames: PP.createImage(JustreeScreamScene.model.mainFrames),
            init() {
                

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let repeats = 5;

                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        repeats--;
                        if(repeats == 0)
                            this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 30)

        this.bricks = this.addGo(new GO({
            position: new V2(62.5, 95),
            size: new V2(125,70),
            img: PP.createImage(JustreeScreamScene.model.bricks),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.filter = `brightness(30%)`;
                    ctx.drawImage(this.img, 0,0);
                })   
            }
        }), 25)

        let backLayersCount = 6;
        let itemsCounts = easing.fast({ from: 300, to: 50, steps: backLayersCount, type: 'quad', method: 'in', round: 0});
        let itemFrameslengths = easing.fast({ from: 50, to: 25, steps: backLayersCount, type: 'quad', method: 'in', round: 0});
        let dropLengths = easing.fast({ from: 10, to: 40, steps: backLayersCount, type: 'quad', method: 'in', round: 0});
        let vValues = easing.fast({ from: 10, to: 50, steps: backLayersCount, type: 'quad', method: 'in', round: 0});
        //let deltaDividers = easing.fast({ from: 2, to: 1, steps: backLayersCount, type: 'quad', method: 'in', round: 0});
        let xShifts = easing.fast({ from: -5, to: -20, steps: backLayersCount, type: 'linear', method: 'base', round: 0});
        let layers = new Array(backLayersCount).fill().map((el,i) => ({
            framesCount: 100, 
            itemsCount: itemsCounts[i], 
            itemFrameslength: itemFrameslengths[i], 
            dropLength: dropLengths[i], 
            size: this.viewport, 
            color: colors.colorTypeConverter({value: {h:0,s:96,v: vValues[i]}, toType: 'hex', fromType: 'hsv'}),
            //deltaDivider: deltaDividers[i],
            xShift: xShifts[i],
            layer: i+2
        }))

        // layers.push({ framesCount: 100, itemsCount: 30, itemFrameslength: 20, size: this.viewport, dropLength: 50, 
        //     color: colors.colorTypeConverter({value: {h:0,s:96,v: 55}, toType: 'hex', fromType: 'hsv'}), xShift: -22, layer: 29  })
        layers.push({ framesCount: 100, itemsCount: 50, itemFrameslength: 15, size: this.viewport, dropLength: 60, 
            color: colors.colorTypeConverter({value: {h:0,s:96,v: 60}, toType: 'hex', fromType: 'hsv'}), xShift: -25, layer: 31  })

        this.rain = layers
            // [{ framesCount: 100, itemsCount: 50, itemFrameslength: 12, size: this.viewport, color: '#110003', layer: 2  },
            // { framesCount: 100, itemsCount: 30, itemFrameslength: 10, size: this.viewport, color: '#3a0002', layer: 3  },
            // { framesCount: 100, itemsCount: 20, itemFrameslength: 8, size: this.viewport, color: '#630001', layer: 5  },
            
            // { framesCount: 100, itemsCount: 15, itemFrameslength: 6, size: this.viewport, color: '#8A0505', layer: 10  },
            // { framesCount: 100, itemsCount: 10, itemFrameslength: 4, size: this.viewport, color: '#BF0202', layer: 21  },
            // { framesCount: 100, itemsCount: 10, itemFrameslength: 3, size: this.viewport, color: '#BF0202', layer: 31  }]
            .map(layer => this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                frames: this.createRain3Frames(layer), 
                init() {
                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
                    
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
                    
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                            animationRepeatDelay = animationRepeatDelayOrigin;
                        }
                    })
                }
            }), layer.layer))

    }
}