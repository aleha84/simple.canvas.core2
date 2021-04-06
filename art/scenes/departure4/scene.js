class Departure4Scene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(2000,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'departure4'
            }
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
            'stolb_p', 'train_p', 'bg_p', 'snow_p'
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

                windowsUpperLineDots = _sharedPP.lineV2(new V2(size.x, 98), new V2(133, 98))
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
                let windowBlackOverlayValues = easing.fast({ from: 0.7, to: 0.99, steps: itemFrameslength, type, method, round: 2 });
                let widthValues = easing.fast({ from: 4, to: 1, steps: itemFrameslength, type, method, round: 0 });
                
                let currentStartFrameIndex = 0

                let framesShift = 400;
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = framesShift + currentStartFrameIndex;
                    //console.log(i + '; startFrameIndex: ' + startFrameIndex);
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

                    if(i == (itemsCount-1)){
                        totalFrames*=3;
                    }

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
                            leftAlpha: fast.r(getRandom(0,0.25),2)
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
                                        .rect(windowUpperPoint.x, windowUpperPoint.y+itemData.frames[f].windowHeight, 1 ,2)
                                        
                                    // if(!itemData.isLast) {
                                    //     hlp.setFillColor(`rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},${itemData.frames[f].leftAlpha})`)
                                    //         .rect(windowUpperPoint.x-1, windowUpperPoint.y, 1, itemData.frames[f].windowHeight);
                                    // }

                                    //hlp.setFillColor(`rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},0.3)`)

                                    // hlp.setFillColor(`rgba(${colorRgba.r},${colorRgba.g},${colorRgba.b},0.25)`)
                                    //     .dot(windowUpperPoint.x, windowUpperPoint.y-2)
                                    //     .dot(windowUpperPoint.x, windowUpperPoint.y+itemData.frames[f].windowHeight+1);
                                    
                                    hlp.setFillColor(`rgba(${darkOverlayRgb.r},${darkOverlayRgb.g},${darkOverlayRgb.b},${itemData.frames[f].windowBlackOverlay})`)
                                    .rect(windowUpperPoint.x, windowUpperPoint.y-2, 1, itemData.frames[f].windowHeight+4)  
                                    
                                    if(windowUpperPoint.x == 160) {
                                        hlp.setFillColor(color).rect(windowUpperPoint.x-1, windowUpperPoint.y, 1, itemData.frames[f].windowHeight);

                                        hlp.setFillColor(`rgba(${darkOverlayRgb.r},${darkOverlayRgb.g},${darkOverlayRgb.b},${itemData.frames[f].windowBlackOverlay})`)
                                    .rect(windowUpperPoint.x-1, windowUpperPoint.y-2, 1, itemData.frames[f].windowHeight+4) 
                                    }

                                    if(itemData.isLast){
                                        hlp.setFillColor(redLightColor)
                                        .dot(windowUpperPoint.x+1, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y+itemData.frames[f].windowHeight)
                                        .dot(windowUpperPoint.x+itemData.frames[f].windowHeight, windowUpperPoint.y)

                                        hlp.setFillColor(`rgba(${darkOverlayRgb.r},${darkOverlayRgb.g},${darkOverlayRgb.b},${itemData.frames[f].windowBlackOverlay*0.85})`)
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
                this.frames = this.createTrainFrames({ framesCount: 600, itemsCount: 90, itemFrameslength: 40, itemDelay: 1, size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
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
                    let y = fast.r(getRandomGaussian(-size.y*0.8, size.y*0.8));

                    if(y < 0)
                        y*=-1;

                    // if(starsData.filter(sd => Math.abs(x - sd.x) == 1 || Math.abs(y - sd.y) == 1).length > 0) {
                    //     maxa/=2;
                    // }
                        //return { frames: [] }

                    starsData[starsData.length] = {x, y};

                    let frames = [];

                    let aValues = [];
                    if(getRandomBool()){//if(getRandomInt(0,2) == 0){
                        maxa = maxa*getRandomInt(2,5);
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

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let totalAnimationFrames = 300;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'l1',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'l2',
                        animationStartFrame: 120,
                    },
                    {
                        layerName: 'l3',
                        animationStartFrame: 70,
                    },
                    {
                        layerName: 'l4',
                        animationStartFrame: 10,
                    },
                    {
                        layerName: 'l5',
                        animationStartFrame: 90,
                    },
                    {
                        layerName: 'l6',
                        animationStartFrame: 150,
                    },
                    {
                        layerName: 'l7',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'l8',
                        animationStartFrame: 100,
                    },
                    {
                        layerName: 'l9',
                        animationStartFrame: 200,
                    }
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Departure4Scene.models.forestFrames, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        let oneFrameShift = oneFrame + getRandomInt(0,5);

                        let v = 0;
                        for(let i = 0; i < totalFrames; i++){
                            // if(i%oneFrameShift == 0){
                            //     v = v==0? 1: 0;
                            // }

                            let index = p.animationStartFrame+i;
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = v;
                        }

                        let animationStartFrame = p.animationStartFrame;

                        let animationFramesIndexValues = 
                            easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames, type: 'linear', method: 'base', round: 0})


                        for(let i = 0; i < animationFramesIndexValues.length; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));
            }
        }), layersData.forest.renderIndex+1)

        this.stolb_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'stolb_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.stolb.renderIndex+1)

        this.train_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 40, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'train_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.train.renderIndex+1)

        this.bg_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bg_p')),
                    pdPredicate: () => getRandomBool()
                });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+2)

        this.snow_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 40, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'snow_p')),
                    pdPredicate: () => getRandomInt(0,2) == 0
                });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.platfotm_d1.renderIndex+2)
    }
}