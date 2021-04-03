class Departure4Scene extends Scene {
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
        let model = Departure4Scene.models.main;
        let layersData = {};
        let exclude = [
            
        ];

        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;

            layersData[layerName] = {
                renderIndex
            }

            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }

            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
                }
            }), renderIndex)

            console.log(`${layerName} - ${renderIndex}`)
        }

        this.secondTrain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createTrainFrames({framesCount, itemsCount, itemFrameslength, itemDelay, size}) {
                // todo: width, color changes
                
                let frames = [];

                let _sharedPP = undefined;
                let windowsUpperLineDots = [];
                let vagonsUpperLineDots = [];
                createCanvas(V2.one, (ctx, _size, hlp) => {
                    _sharedPP = new PP({ctx})
                })

                windowsUpperLineDots = _sharedPP.lineV2(new V2(size.x, 98), new V2(138, 98))
                vagonsUpperLineDots = _sharedPP.lineV2(new V2(size.x, 74), new V2(138, 96))

                let type = 'quad';
                let method = 'out';

                let color = '#bf8057';
                let redLightColor = '#FE001D'
                let colorRgba = colors.colorTypeConverter({value: color, toType: 'rgb'});
                let darkOverlayRgb = colors.colorTypeConverter({value: '#091d17', toType: 'rgb'});
                let windowHeightValues = easing.fast({ from: 5, to: 1, steps: itemFrameslength, type, method, round: 0 });
                let windowsUpperLineDotsIndexValues = easing.fast({ from: 0, to: windowsUpperLineDots.length-1, steps: itemFrameslength, type, method, round: 0 });
                let vagonsUpperLineDotsIndexValues = easing.fast({ from: 0, to: vagonsUpperLineDots.length-1, steps: itemFrameslength, type, method, round: 0 });
                let windowBlackOverlayValues = easing.fast({ from: 0.7, to: 0.95, steps: itemFrameslength, type, method, round: 2 });
                let widthValues = easing.fast({ from: 4, to: 1, steps: itemFrameslength, type, method, round: 0 });
                
                let currentStartFrameIndex = 0
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = currentStartFrameIndex;
                    if(i!= 0 && i%10 == 0){
                        currentStartFrameIndex+=itemDelay*3;
                    }
                    else {
                        currentStartFrameIndex+=itemDelay;
                    }
                    
                    let totalFrames = itemFrameslength;

                    if(startFrameIndex + totalFrames >= framesCount)
                        throw "Item frames are out of the total frames count"; 
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        //let windowUpperPoint = windowsUpperLineDots[windowsUpperLineDotsIndexValues[f]]
                        frames[frameIndex] = {
                            windowsUpperLineDotsIndex: windowsUpperLineDotsIndexValues[f],
                            vagonsUpperLineDotsIndex: vagonsUpperLineDotsIndexValues[f],
                            //windowUpperPoint,
                            windowHeight: windowHeightValues[f],
                            windowBlackOverlay: windowBlackOverlayValues[f],
                            width: widthValues[f],
                            lightAlpha: fast.r(getRandom(0,0.25),2),
                            
                        };
                    }
                
                    return {
                        isLast: i == (itemsCount-1),
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let w = itemData.frames[f].width;
                                for(let i = 0; i < w; i++){
                                    let index = itemData.frames[f].windowsUpperLineDotsIndex + i;
                                    if(index >= windowsUpperLineDots.length)
                                        break;

                                    let windowUpperPoint = windowsUpperLineDots[index]
                                    let vagonsUpperPoint = vagonsUpperLineDots[itemData.frames[f].vagonsUpperLineDotsIndex];
                                    // hlp.setFillColor('rgba(0,0,0,0.25)').rect(vagonsUpperPoint.x, vagonsUpperPoint.y, 20, 100);

                                    hlp.setFillColor(color).rect(windowUpperPoint.x, windowUpperPoint.y, 1, itemData.frames[f].windowHeight);
                                    hlp.setFillColor(`rgba(255,255,255,${itemData.frames[f].lightAlpha})`)
                                        .rect(windowUpperPoint.x, windowUpperPoint.y, 1, itemData.frames[f].windowHeight);

                                    hlp.setFillColor(`rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},0.2)`)
                                        .rect(windowUpperPoint.x, windowUpperPoint.y-2, 1, 2)
                                        .rect(windowUpperPoint.x, windowUpperPoint.y+itemData.frames[f].windowHeight, 1 ,2);

                                    // hlp.setFillColor(`rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},0.25)`)
                                    //     .dot(windowUpperPoint.x, windowUpperPoint.y-2)
                                    //     .dot(windowUpperPoint.x, windowUpperPoint.y+itemData.frames[f].windowHeight+1);
                                    
                                    hlp.setFillColor(`rgba(${darkOverlayRgb.r},${darkOverlayRgb.g},${darkOverlayRgb.b},${itemData.frames[f].windowBlackOverlay})`).rect(windowUpperPoint.x, windowUpperPoint.y-2, 1, itemData.frames[f].windowHeight+4)    

                                    if(itemData.isLast){
                                        hlp.setFillColor(redLightColor)
                                        .dot(windowUpperPoint.x+1, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y)

                                        hlp.setFillColor(`rgba(${darkOverlayRgb.r},${darkOverlayRgb.g},${darkOverlayRgb.b},${itemData.frames[f].windowBlackOverlay})`)
                                        .dot(windowUpperPoint.x+1, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y)
                                    }
                                }

                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createTrainFrames({ framesCount: 600, itemsCount: 80, itemFrameslength: 40, itemDelay: 2, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.forest.renderIndex+1)

        this.sky = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarsFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let starsData = [];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let maxa = fast.r(getRandom(0.05, 0.15),2);
                    
                    let x = getRandomInt(0, size.x);
                    let y = fast.r(getRandomGaussian(-size.y, size.y));

                    if(y < 0)
                        y*=-1;

                    // if(starsData.filter(sd => Math.abs(x - sd.x) == 1 || Math.abs(y - sd.y) == 1).length > 0) {
                    //     maxa/=2;
                    // }
                        //return { frames: [] }

                    starsData[starsData.length] = {x, y};

                    let frames = [];

                    let aValues = [];
                    if(getRandomInt(0,2) == 0){
                        maxa = maxa*getRandomInt(2,4);
                        aValues = [
                            ...easing.fast({from: 0, to: maxa, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                            ...easing.fast({from: maxa, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                        ]
                    }
                    else {
                        totalFrames = framesCount;
                        aValues = new Array(totalFrames).fill(maxa);
                    }
                    
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f]
                        }
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.x, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({ framesCount: 300, itemsCount: 500, itemFrameslengthClamps: [50, 300], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+1)
    }
}