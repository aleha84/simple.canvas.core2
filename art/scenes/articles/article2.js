class Article2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(5),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'article2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderAddGo({color: 'black'})
    }

    start(){
            this.main = this.addGo(new GO({
            
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createMainFrames({framesCount, itemsCount, xClamps, yClamps, itemSize, itemFrameslength, size}) {
                let frames = [];

                let width = xClamps[1] - xClamps[0]
                let wPerItem = fast.r(width/itemsCount);

                if(wPerItem < itemSize.x) {
                    throw 'Too narrow!'
                }

                let hValues = [
                    ...easing.fast({from: 0, to: 360, steps: fast.r(itemFrameslength/2), type: 'linear', method: 'base', round: 0}),
                    ...easing.fast({from: 360, to: 0, steps: fast.r(itemFrameslength/2), type: 'linear', method: 'base', round: 0})
                ]

                //let hValues = easing.fast({from: 0, to: 360, steps: itemFrameslength, type: 'linear', method: 'base', round: 0})

                let yValues = [
                    ...easing.fast({from: yClamps[0], to: yClamps[1], steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: yClamps[1], to: yClamps[0], steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0})
                ]

                let sizeYValues = [
                    ...easing.fast({from: itemSize.y, to: itemSize.y*2, steps: fast.r(itemFrameslength/4), type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: itemSize.y*2, to: itemSize.y, steps: fast.r(itemFrameslength/4), type: 'quad', method: 'inOut', round: 0})
                ]

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = i*fast.r(framesCount/2/itemsCount) //getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = xClamps[0] + wPerItem*i;

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let sizeYFrame = f > (itemFrameslength/2 - 1) ? f -itemFrameslength/2 : f;
                
                        if(!sizeYValues[sizeYFrame])
                            debugger;

                        frames[frameIndex] = {
                            h: hValues[f],
                            y: yValues[f],
                            sizeY: sizeYValues[sizeYFrame]
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
                                let c = colors.colorTypeConverter({ value: {h: itemData.frames[f].h, s: 100, v: 100}, toType: 'hex', fromType: 'hsv' });
                                hlp.setFillColor(c).rect(itemData.x, itemData.frames[f].y, itemSize.x, itemData.frames[f].sizeY)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let totalFrames = 120;
                this.frames = this.createMainFrames({ framesCount: totalFrames, itemsCount: 20, xClamps: [40, this.size.x-40], yClamps: [this.size.y/2 - 20, this.size.y/2 + 20],
                    itemSize: new V2(2,2), itemFrameslength: totalFrames, size: this.size 
                });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 1)
    }
}