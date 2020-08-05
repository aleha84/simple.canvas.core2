class CodeCatScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 3,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'code_cat'
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

    start(){
        this.code = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(SCG.images.code, -150, 0);
                });
            }
        }), 1)

        this.cat = this.addGo(new GO({
            position: new V2(380-150,345),
            size: new V2(30,55).mul(3).toInt(),
            init() {

                let frames = PP.createImage(CodeCatScene.models.cat);

                this.frames = [...frames, ...frames.reverse().filter((el, i) => i > 0 && i < (frames.length-1))];
                console.log('cat frames: ' + this.frames.length);
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let counter = 0;
                let delay = 15
                this.timer = this.regTimerDefault(10, () => {
                    counter++;
                    delay--;
                    if(delay > 0)
                        return;
                    
                    delay = 15;
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        //console.log('cat frames total count: ' + counter);
                        counter = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 2)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(175, 0)),
            size: new V2(100,200).mul(3),
            createRainFrames({framesCount, layers, size}) {
                let frames = [];
                
                let layersData = layers.map(layer => {
                    
                    let oValues = easing.fast({ from: layer.opacity, to: 0, steps: layer.length, type: 'quad', method: 'out'}).map(v => fast.r(v,2));
                    let itemsData = new Array(layer.itemsCount).fill().map((el, i) => {
                        let xShift = layer.yShift //getRandomInt(-layer.yShift, layer.yShift);
                        
                        let startFrameIndex = getRandomInt(0, framesCount-1) ;
                        let totalFrames = layer.itemFrameslength + getRandomInt(-layer.itemFrameslength/10,layer.itemFrameslength/10);
                    
                        let x = getRandomInt(0, size.x) + (layer.xShift || 0);
                        let y = getRandomInt(-50, -layer.length);
                        let yValues = easing.fast({from: y, to: size.y + layer.length, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));
                        let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));
                        
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                y: yValues[f],
                                xShift: xShiftValues[f]
                            };
                        }
                    
                        return {
                            x,
                            frames
                        }
                    })

                    return {
                        length: layer.length,
                        color: layer.color,
                        opacity: layer.opacity,
                        oValues,
                        itemsData
                    };
                });
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let l = 0; l < layersData.length; l++){
                            let itemsData = layersData[l].itemsData;

                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    let x = itemData.x + itemData.frames[f].xShift;
                                    for(let i = 0; i < layersData[l].length; i++){
                                        hlp.setFillColor(`rgba(255,255,255, ${layersData[l].oValues[i]})`).dot(x, itemData.frames[f].y-i)
                                    }

                                    hlp.setFillColor(`rgba(255,255,255, ${layersData[l].opacity/2})`).dot(x, itemData.frames[f].y+1)
                                    hlp.setFillColor(`rgba(255,255,255, ${layersData[l].opacity/4})`).dot(x, itemData.frames[f].y+2)

                                    //hlp.setFillColor(layersData[l].color).rect(itemData.x, itemData.frames[f].y, 1, layersData[l].length);
                                }
                                
                            }
                        }

                        
                    });
                }
                
                return frames;
            },
            init() {
                let mul = 1.5;
                this.frames = this.createRainFrames({ framesCount: 200, layers: [ 
                    { itemsCount: fast.r(mul*500), itemFrameslength: 45, length: 8, opacity: 0.05,xShift: 0,  yShift: 5  },
                    { itemsCount: fast.r(mul*100), itemFrameslength: 35, length: 15, opacity: 0.3, xShift: 10, yShift: 5  },
                    { itemsCount: fast.r(mul*50), itemFrameslength: 25, length: 25, opacity: 0.5,  xShift: 20,  yShift: 0  },
                    { itemsCount: fast.r(mul*10), itemFrameslength: 18, length: 40, opacity: 0.7, xShift: 30, yShift: 0 }
                ], size: new V2(100,200) })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 3)

        this.fallingDrop = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(30, 48)),
            size: new V2(10,200).mul(3),
            createDropFrames({framesCount, itemsCount, itemFrameslength, size, length}) {
                let frames = [];
                
                let yValues = easing.fast({from: 0, to: size.y, steps: itemFrameslength, type: 'cubic', method: 'in'}).map(v => fast.r(v));
                let lengthValues = easing.fast({from: 1, to: length, steps: itemFrameslength, type: 'cubic', method: 'in'}).map(v => fast.r(v));

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
                            index: f
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
                                let opacity = 0.5;
                                let len = lengthValues[itemData.frames[f].index];
                                let oValues = len > 1 ? 
                                easing.fast({from: 0, to: opacity, steps: len, type: 'quad', method: 'in'}).map(v => fast.r(v,2))
                                :[opacity]
                                for(let i = 0; i < len; i++){
                                    hlp.setFillColor(`rgba(255,255,255, ${oValues[i]})`).dot(itemData.x, yValues[itemData.frames[f].index] + i);
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createDropFrames({ framesCount: 200, itemsCount: 5, itemFrameslength: 60,length:15, size: new V2(10,200)});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let repeats = 3;
                this.timer = this.regTimerDefault(10, () => {
                    
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeats--;
                        if(repeats == 0)
                            this.parentScene.capturing.stop = true;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 4)
    }
}