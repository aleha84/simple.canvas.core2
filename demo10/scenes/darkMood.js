class Demo10DarkMood extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'darkMoodForest'
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
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#000').rect(0,0, size.x, size.y);
                })

                this.stars = this.addChild(new GO( {
                    position: new V2(),
                    size: this.size,
                    createStarsFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        let linePoints = [];
                        let center = size.divide(2);
                        createCanvas(new V2(1,1), (ctx, s, hlp) => {
                            let pp = new PP({ctx});
                            linePoints = pp.lineV2(new V2(size.x/2+10, 0), new V2(size.x/2 -10,size.y));
                        })
                        
                        let rData = new Array(fast.r(itemsCount/2)).fill().map((el, i) => {
                            return new V2(
                                getRandomInt(0,size.x),
                                getRandomInt(0,size.y),
                            )
                        })

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                        
                            let p = linePoints[getRandomInt(0, linePoints.length-1)];
                            let y = p.y;
                            let x = p.x + getRandomGaussian(-size.x*0.5, size.x*0.5);
                            let _p = new V2(x,y).substract(p).rotate(-20).add(p).toInt();

                            let frames = [];
                            let hasLeafs = false;
                            let leafsChange = undefined;
                            if(getRandomInt(0,3) == 0){
                                if(getRandomInt(0,3) == 0){
                                    hasLeafs = true;
                                    totalFrames = fast.r(totalFrames/3);
                                    leafsChange = [
                                        ... easing.fast({ from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 }),
                                        ... easing.fast({ from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 })
                                    ]
                                }

                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        leafLen: leafsChange ? leafsChange[f]: undefined,
                                        visible: true
                                    };
                                }    
                            }
                            else {
                                frames = new Array(framesCount).fill().map(el => ({ visible: true  }));
                            }

                            
                            
                            return {
                                p: _p,
                                hasLeafs,
                                //leafsChange,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                hlp.setFillColor('#FFF')
                                rData.forEach(p => {
                                    hlp.dot(p.x, p.y)
                                });


                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f] && itemData.frames[f].visible){
                                        hlp.dot(itemData.p.x, itemData.p.y)

                                        if(itemData.hasLeafs) {
                                            let leafLen = itemData.frames[f].leafLen;
                                            if(leafLen == 1){
                                                hlp.rect(itemData.p.x-1, itemData.p.y, 3, 1).rect(itemData.p.x, itemData.p.y-1, 1, 3)
                                            }
                                            if(leafLen == 2){
                                                hlp.rect(itemData.p.x-2, itemData.p.y, 5, 1).rect(itemData.p.x, itemData.p.y-2, 1, 5)
                                            }
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createStarsFrames({ framesCount: 200, itemsCount: 300, size: this.size,  itemFrameslengthClamps: [100, 150] });
                        let repeat = 5;
                        this.registerFramesDefaultTimer({ 
                            framesEndCallback: () => {
                                // repeat--;
                                // if(repeat == 0)
                                //     this.parent.parentScene.capturing.stop = true;
                            }
                            
                         });
                    }
                }))
            }
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10DarkMood.models.forest, { exclude: ['bg'] })
                
            }
        }), 5)

        this.water = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWaterFrames({framesCount, itemsCount, itemFrameslengthClapms, size, yClamps, widthClamps, xWidthClamps}) {
                let frames = [];
                let totalHeight = 50;
                let widthValues = easing.fast({ from: widthClamps[0], to: widthClamps[1], steps: totalHeight, type: 'quad', method: 'out', round: 0});
                let xWidthValues = easing.fast({ from: xWidthClamps[0], to: xWidthClamps[1], steps: totalHeight, type: 'linear', round: 0});
                let framesLengthValues = easing.fast({ from: itemFrameslengthClapms[0], to: itemFrameslengthClapms[1], steps: totalHeight, type: 'linear', round: 0});
                let startY = 119;

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    
                    let _y = fast.r(Math.abs(getRandomGaussian(-totalHeight, totalHeight))) //getRandomInt(0, totalHeight);

                    let width = widthValues[_y];
                    let totalFrames = framesLengthValues[_y];
                    let y = startY + _y;
                    let x = size.x/2 + fast.r(getRandomGaussian(-width*2, width*2));
                    let xWidth = getRandomInt(fast.r(xWidthValues[_y]/2), xWidthValues[_y])//getRandomInt(fast.r(width/10), fast.r(width/5));
                    let widthChangeValues = [
                        ...easing.fast({ from: 0, to: xWidth, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: xWidth, to: 0, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames*2; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            w: widthChangeValues[f]
                        };
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('#FFF');
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.rect(itemData.x-itemData.frames[f].w, itemData.y, itemData.frames[f].w*2, 1)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createWaterFrames({ framesCount: 200, itemsCount: 150, itemFrameslengthClapms: [50,100], size: this.size, 
                    widthClamps: [25, 2], xWidthClamps: [3, 2]})
                
                this.registerFramesDefaultTimer({});
            }
        }), 10)

        this.face = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 40, size: this.size, 
                    pointsData: animationHelpers.extractPointData(Demo10DarkMood.models.forest.main.layers.find(l => l.name == 'p')) });
    
                let repeat = 5;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 15)
    }
}