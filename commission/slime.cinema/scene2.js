class SlimeCinemaLevarBurtonScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 8,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'levar'
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

        this.outside = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRainFrames({framesCount, layers, size, xClamps, color}) {
                let frames = [];
                let sharedPP = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })
                let hsv = colors.hexToHsv(color);

                let extraVSize = 100;
                

                let layersData = layers.map(layer => {
                    let layerColor = hsvToHex({ hsv: [ hsv.h, hsv.s, hsv.v + (layer.vShift/100) ], hsvAsObject: false, hsvAsInt: false });
                    let extraV = easing.fast({from: layer.vShift*2, to: -layer.vShift, steps: extraVSize, type: 'quad', method: 'out'})
                    return new Array(layer.itemsCount).fill().map((el, i) => {
                        
                        let x = getRandomInt(xClamps[0], xClamps[1]*2);
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = layer.itemFrameslength;
                        let yValues = easing.fast({from: getRandomInt(-20, 0), to: size.x + getRandomInt(0,20), steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v))
                    
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
                            extraV,
                            //color: layerColor,
                            vShift: layer.vShift,
                            tailLength: layer.tailLength,
                            frames
                        }
                    })
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor(color).rect(0,0, xClamps[1], size.y);

                        for(let l = 0; l < layersData.length; l++){
                            let layerData = layersData[l];  
                            for(let p = 0; p < layerData.length; p++){
                                let itemData = layerData[p];
                                
                                if(itemData.frames[f]){
                                    let v = hsv.v + itemData.vShift;
                                    let y = itemData.frames[f].y;
                                    if(y >=0 && y < extraVSize){
                                        v += itemData.extraV[y];
                                    }
                                    hlp.setFillColor(hsvToHex({ hsv: [ hsv.h, hsv.s, hsv.v + (v/100) ], hsvAsObject: false, hsvAsInt: false }))
                                    .rect(itemData.x, itemData.frames[f].y - itemData.tailLength, 1, itemData.tailLength);
                                }
                                
                            }
                        }
                        
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createRainFrames({ 
                    framesCount: 300, 
                    layers: [
                        {itemsCount: 800, itemFrameslength: 40, vShift: 1, tailLength: 8, angle: 5},
                        {itemsCount: 400, itemFrameslength: 25, vShift: 2.5, tailLength: 10, angle: 7},
                        {itemsCount: 50, itemFrameslength: 18, vShift: 3.5, tailLength: 20, angle: 9},
                        {itemsCount: 10, itemFrameslength: 10, vShift: 5, tailLength: 30, angle: 13}
                    ],  
                    size: this.size, xClamps: [0,25], color: '#10100e' 
                });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let repeat = 5;
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                    }

                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 1)

        this.artist = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(SlimeCinemaLevarBurtonScene.models.artistFramesframe)

                let timings = {
                    getDelay: function(index) {
                        return this.items.filter(item => item.indexClamps.indexOf(index) != -1)[0].delay
                    },
                    items: [
                    {
                        indexClamps: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
                        delay: 7
                    },
                    {
                        indexClamps: [22,23],
                        delay: 44
                    }, 
                    {
                        indexClamps: [24,0],
                        delay: 8
                    }, 
                    {
                        indexClamps: [1],
                        delay: 56
                    },
                ]}

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = timings.getDelay(this.currentFrame);
                let totalFramesCount = 0;
                this.timer = this.regTimerDefault(10, () => {
                    delay--;
                    //totalFramesCount++;

                    if(delay > 0){
                        return;
                    }
                    
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        //console.log('total frames: ' + totalFramesCount);
                    }

                    delay = timings.getDelay(this.currentFrame);
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 5)
    }
}