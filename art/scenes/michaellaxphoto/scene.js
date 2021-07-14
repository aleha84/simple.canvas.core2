class DetroitHandScene extends Scene {
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
                //viewportSizeMultiplier: 7,
                size: new V2(2000,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'detroit'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let noRain = false;

        let model = DetroitHandScene.models.main;
        let layersData = {};
        let exclude = [
            'splashes_zone', 'fr_drops', 'back_drops', 'train','train_white', 'backlight_red', 'backlight_yellow', 'backlight_green', 'b1_p', 'b2_p', 'b3_p', 'monument_fr_p', 'monument_p'
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

        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size, opacity,
            maxAngle, tailLengthClamps
        }) {
            let frames = [];
            let xCenter = fast.r(size.x/2);
            let angleValues = easing.fast({from: 0, to: maxAngle, steps: xCenter, type: 'linear', round: 2})
            let bottomLine = createLine(new V2(-size.x*2, size.y + tailLengthClamps[1]), new V2(size.x*3, size.y+tailLengthClamps[1]));
            let sharedPP = undefined;




            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let x = getRandomInt(0, size.x);
                let y = getRandomInt(-30, 0);
                
                let tailLength = getRandomInt(tailLengthClamps);

                let tailHalf = fast.r(tailLength/2);

                let alphaValues = [
                    ...easing.fast({ from: 0, to: opacity, steps: tailHalf, type: 'quad', method: 'in', round: 3 })
                ];

                let a2Len = fast.r(tailLength*0.15);
                if(a2Len < 1)
                    a2Len = 2;

                let alphaValues2 = easing.fast({ from: opacity, to: 0, steps: a2Len, type: 'linear', round: 3 })

                let isLeft = x <= xCenter;
                let angle = angleValues[(!isLeft ?
                    x - xCenter : xCenter- x
                    )];

                if(isNaN(angle))
                    return { frames: [] }
                
                if(!isLeft)
                    angle = -angle;

                let direction = V2.down.rotate(angle);
                let point1 = new V2(x,y);
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));
                let linePoints = sharedPP.lineV2(point1, point2);
                let linePointsIndices = easing.fast({ from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    frames[frameIndex] = {
                        f
                    };
                }
            
                return {
                    isLeft,
                    alphaValues,
                    alphaValues2,
                    linePointsIndices,
                    linePoints,
                    tailLength,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        
                        if(itemData.frames[f]){
                            let index = itemData.linePointsIndices[itemData.frames[f].f];
                            let prev;
                            for(let i = 0; i < itemData.tailLength + itemData.alphaValues2.length; i++){
                                let _i = index + i;
                                if(_i >= itemData.linePoints.length)
                                    break;

                                let _alpha = itemData.alphaValues[i];

                                if(i >= itemData.tailLength) {
                                    _alpha = itemData.alphaValues2[i-itemData.tailLength]
                                }

                                if(_alpha == undefined){
                                    _alpha = opacity
                                }

                                hlp.setFillColor(`rgba(255,255,255, ${_alpha})`).dot(itemData.linePoints[_i])

                                if(prev){
                                    if(prev.x != itemData.linePoints[_i].x) {
                                        hlp.setFillColor(`rgba(255,255,255, ${_alpha/2})`)
                                        hlp.dot(prev.x, prev.y+1);
                                        if(itemData.isLeft){
                                            hlp.dot(prev.x-1, prev.y);
                                        }
                                        else {
                                            hlp.dot(prev.x+1, prev.y);
                                        }
                                    }
                                }

                                prev = itemData.linePoints[_i];
                            }


                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let size = this.viewport.clone();
        let rainLayers = [
            {
                params: { framesCount: 300, itemsCount: 100, itemFrameslength: 10, size, 
                    opacity: 0.25, maxAngle: 25, tailLengthClamps: [ 30, 50]  },
                lIndex: layersData['monument_fr'].renderIndex + 5
            },
            {
                params: { framesCount: 300, itemsCount: 400, itemFrameslength: 20, size, 
                    opacity: 0.2, maxAngle: 23, tailLengthClamps: [ 20, 40]  },
                lIndex: layersData['bg_b3'].renderIndex + 5
            },
            
        ]

        if(!noRain) {
            rainLayers.push({
                params: { framesCount: 300, itemsCount: 800, itemFrameslength: 40, size, 
                    opacity: 0.07, maxAngle: 21, tailLengthClamps: [ 15, 30]  },
                lIndex: layersData['bg_b2'].renderIndex + 5
            },
            {
                params: { framesCount: 300, itemsCount: 1500, itemFrameslength: 50, size, 
                    opacity: 0.03, maxAngle: 19, tailLengthClamps: [ 10, 20]  },
                lIndex: layersData['bg_b1'].renderIndex + 5
            },
            {
                params: { framesCount: 300, itemsCount: 2000, itemFrameslength: 70, size, 
                    opacity: 0.01, maxAngle: 17, tailLengthClamps: [ 5, 10]  },
                lIndex: layersData['sky'].renderIndex + 5
            })
        }

        rainLayers.map(l => this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: createRainFrames(l.params),
            init() {
                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        //let a = 10;
                    }
                });
            }
        }), l.lIndex))

        let createDropsFrames = function({framesCount, itemsCount, itemFrameslength, size, opacity, points}) {
            let frames = [];
            

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p = points[getRandomInt(0, points.length-1)].point;
                let part1Length = fast.r(itemFrameslength/2);
                let part2Length = itemFrameslength - part1Length;

                let part1Alpha = easing.fast({from: 0, to: opacity, steps: part1Length, type: 'linear', round: 3})
                let part2YChange = easing.fast({from: p.y, to: size.y, steps: part2Length, type: 'expo', method: 'in', round: 0})

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let y = p.y;
                    let alpha = 0;
                    if(f <= part1Length) {
                        alpha = part1Alpha[f];
                    }
                    else {
                        y = part2YChange[f-part1Length];
                        alpha = opacity
                    }
            
                    frames[frameIndex] = {
                        y,
                        alpha
                    };
                }
            
                return {
                    p,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].alpha})`).dot(itemData.p.x, itemData.frames[f].y)
                        }   
                    }
                });
            }
            
            return frames;
        }

        this.fr_drops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createDropsFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: 100, size: this.size, opacity: 0.3,
                points: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'fr_drops')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument_fr'].renderIndex+1)

        this.back_drops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createDropsFrames({ framesCount: 300, itemsCount: 40, itemFrameslength: 150, size: this.size, opacity: 0.2,
                    points: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'back_drops')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument'].renderIndex+1)

        let createSplashesFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, groups, opacityClamps}) {
            let frames = [];
            
            let points = [];

            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            groups.forEach(g => {
                points.push(...sharedPP.fillByCornerPoints(g.points.map(p => p.point)))
            });

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let p = points[getRandomInt(0, points.length)];
                let alpha = fast.r(getRandom(opacityClamps[0], opacityClamps[1]),3)

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = true;
                }
            
                return {
                    p,
                    alpha,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(`rgba(255,255,255, ${itemData.alpha})`).dot(itemData.p)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.splashes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: createSplashesFrames({ framesCount: 300, itemsCount: 200, itemFrameslengthClamps: [5,10], size: this.viewport, 
            groups: model.main.layers.find(l => l.name == 'splashes_zone').groups, opacityClamps: [0.3, 0.5]
         }),
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument_fr'].renderIndex+1)

        this.splashes2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: createSplashesFrames({ framesCount: 300, itemsCount: 200, itemFrameslengthClamps: [5,10], size: this.viewport, 
            groups: model.main.layers.find(l => l.name == 'splashes_zone2').groups, opacityClamps: [0.05, 0.1]
         }),
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument'].renderIndex+2)

        this.train = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createTrainFrames({framesCount, size}) {
                let frames = [];
                
                let img = PP.createImage(model, {renderOnly: 'train_white'})

                let trainImg = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(img, 0, 0)

                    hlp.setFillColor('rgba(0,0,0,0.7)').rect(112,186,1,4)

                    ctx.drawImage(img, 30, 0)
                })

                let darkAlphaChange = easing.fast({from: 0, to: 0.75, steps: 300, type: 'linear', round: 2});
                let xChange = easing.fast({ from: -150, to: 150, steps: framesCount, type: 'linear', round: 0});
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let x = xChange[f];
                        let a = darkAlphaChange[x + 150];

                        if(a == undefined) {
                            a = 0;
                        }
                         

                        ctx.drawImage(trainImg, x, 0);

                        ctx.globalCompositeOperation = 'source-atop';


                        ctx.drawImage(createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            hlp.setFillColor(`rgba(0,0,0, ${a})`).dot(0,0);
                        }), 0, 0, size.x, size.y);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createTrainFrames({ framesCount: 300, size: this.size })
                this.registerFramesDefaultTimer({initialAnimationDelay: 300, animationRepeatDelayOrigin: 600});
            }
        }),layersData['road'].renderIndex+1)


        this.backlight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // let redImg = PP.createImage(model, {
                //     renderOnly: ['backlight']
                    
                // })
                // let yellowImg = PP.createImage(model, {renderOnly: ['backlight'],
                //     colorsSubstitutions: {
                //         "#EB0A23": { color: '#01D2A8',changeFillColor: true, keepStrokeColor: false }
                //     }
                // })
                // let greenImg = PP.createImage(model, {renderOnly: ['backlight'],
                //     colorsSubstitutions: {
                //         "#EB0A23": { color: '#CB9825',changeFillColor: true, keepStrokeColor: false }
                //     }
                // })

                let images = [
                    PP.createImage(model, { renderOnly: ['backlight_green'], forceVisivility: { 'backlight_green': { visible: true } }  }),
                    PP.createImage(model, { renderOnly: ['backlight_yellow'], forceVisivility: { 'backlight_yellow': { visible: true } }  }),
                    PP.createImage(model, { renderOnly: ['backlight_red'], forceVisivility: { 'backlight_red': { visible: true } }  })
                ];

                this.currentFrame = 0;
                this.img = images[this.currentFrame];
                
                let originFrameChangeDelay = 300;
                let frameChangeDelay = originFrameChangeDelay;
                console.log('tl. ' + this.currentFrame)
                
                this.timer = this.regTimerDefault(10, () => {
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.currentFrame++;
                    if(this.currentFrame == images.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true; 
                    }

                    this.img = images[this.currentFrame];
                    //console.log('tl. ' + this.currentFrame)
                })
            }
        }), layersData['monument_fr'].renderIndex+1)

        this.windows1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let model = DetroitHandScene.models.windows1;

                for(let i = 0; i < model.main.layers.length; i++) {
                    let layer = model.main.layers[i];
                    let layerName = layer.name || layer.id;

                    this[layerName] = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        img: PP.createImage(model, { renderOnly: [layerName], forceVisivility: { [layerName]: { visible: true } } }),
                        isVisible: false,
                        init() {
                            this.currentFrame = 0;
                            let totalFrames = 900;
                            let visibleFrom = getRandomInt(0, 900);
                            let originalVisibleLength = getRandomInt(50,300);
                            let visibleLength = originalVisibleLength;
                            

                            this.timer = this.regTimerDefault(10, () => {
                                if(this.isVisible){
                                    visibleLength--;

                                    if(visibleLength == 0){
                                        this.isVisible = false;
                                        visibleLength = originalVisibleLength;
                                    }
                                }

                                if(this.currentFrame == visibleFrom){
                                    this.isVisible = true;
                                }

                                
                                this.currentFrame++;
                                if(this.currentFrame == totalFrames){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    }))
                }
            }
        }), layersData['bg_b2'].renderIndex+2)

        this.windows2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let model = DetroitHandScene.models.windows2;

                for(let i = 0; i < model.main.layers.length; i++) {
                    let layer = model.main.layers[i];
                    let layerName = layer.name || layer.id;

                    this[layerName] = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        img: PP.createImage(model, { renderOnly: [layerName], forceVisivility: { [layerName]: { visible: true } } }),
                        isVisible: false,
                        init() {
                            this.currentFrame = 0;
                            let totalFrames = 900;
                            let visibleFrom = getRandomInt(0, 900);
                            let originalVisibleLength = getRandomInt(50,300);
                            let visibleLength = originalVisibleLength;
                            

                            this.timer = this.regTimerDefault(10, () => {
                                if(this.isVisible){
                                    visibleLength--;

                                    if(visibleLength == 0){
                                        this.isVisible = false;
                                        visibleLength = originalVisibleLength;
                                    }
                                }

                                if(this.currentFrame == visibleFrom){
                                    this.isVisible = true;
                                }

                                
                                this.currentFrame++;
                                if(this.currentFrame == totalFrames){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    }))
                }
            }
        }), layersData['bg_b1'].renderIndex+1)

        this.b1_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'b1_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData['bg_b1'].renderIndex+2)

        this.b2_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'b2_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData['bg_b2'].renderIndex+1)

        this.b3_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'b3_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData['bg_b3'].renderIndex+1)

        this.monument_fr_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'monument_fr_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument_fr'].renderIndex+1)

        this.monument_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'monument_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData['monument'].renderIndex+1)
    }
}