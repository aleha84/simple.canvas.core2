class EveningCatScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(150,200).mul(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'eveningCat',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let appSharedPP = PP.createNonDrawingInstance();
        let rgbColorPart = 'rgba(255,255,255,';

        let model = EveningCatScene.models.main;
        let layersData = {};
        let exclude = [
            'stairs_splashes_zone', 'cat_p'
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

        this.curtains = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLayersMovementFrames({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size, 
                type = 'quad', method = 'inOut',
                oneWayOnly =false}) {
                let frames = [];
                let images = [];
    
                let itemsCount = animationsModel.main[0].layers.length;
    
                let framesIndiciesChange = oneWayOnly ? 
                easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength, type: 'quad', method: 'inOut', round: 0 })
                : [
                    ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type, method, round: 0 }),
                    ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type, method, round: 0 })
                ]
    
                for(let i = 0; i < itemsCount; i++) {
                    let name = animationsModel.main[0].layers[i].name;
                    if(!name) {
                        name = animationsModel.main[0].layers[i].id
                    } 
    
                    images[i] = PP.createImage(animationsModel, { renderOnly: [name] }) //'l' + (i+1)
                }
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = startFramesSequence ? 
                    startFramesSequence[i]
                    : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                    
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            index: framesIndiciesChange[f]
                        };
                    }
    
                    if(additional) {
                        let startFrameIndex1 = startFrameIndex + totalFrames 
                        + (isArray(additional.framesShift) ? getRandomInt(additional.framesShift) : additional.framesShift);
                        for(let f = 0; f < additional.frameslength; f++){
                            let frameIndex = f + startFrameIndex1;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
    
                            frames[frameIndex] = {
                                index: additional.framesIndiciesChange[f]
                            };
                        }
                    }
                    
                
                    return {
                        img: images[i],
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let index = itemData.frames[f].index;
                                ctx.drawImage(itemData.img[index], 0, 0);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let model = EveningCatScene.models.curtains;
                //let additionalFramesLength = 60;

                // this.frames = this.createLayersMovementFrames({
                //     framesCount: 200, itemFrameslength: 80,  startFramesSequence: easing.fast({
                //         from: 0, to: 40, steps: EveningCatScene.models.curtains.main[0].layers.length, type: 'linear', round: 0
                //     }), 
                //     additional: {
                //         framesShift: [0,10],
                //         frameslength: additionalFramesLength,
                //         framesIndiciesChange: [
                //             ...easing.fast({ from: 0, to: 2, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 }),
                //             ...easing.fast({ from: 2, to: 0, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 })
                //         ]
                //     }, animationsModel: model, size: this.size
                // })

                let additionalFramesLength = 60;
                this.frames = this.createLayersMovementFrames({
                    framesCount: 150, itemFrameslength: 90,  
                    startFramesClamps: [30, 90],
                    animationsModel: model, size: this.size,
                    additional: {
                        framesShift: [0,10],
                        frameslength: additionalFramesLength,
                        framesIndiciesChange: [
                            ...easing.fast({ from: 0, to: 2, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 }),
                            ...easing.fast({ from: 2, to: 0, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 })
                        ]
                    }, animationsModel: model, size: this.size
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.window2.renderIndex+1)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 600;
                let catFrames = PP.createImage(EveningCatScene.models.cat)

                // let framesIndices = [
                //     ...new Array(100).fill(0),
                //     // ...easing.fast({from: 0, to: catFrames.length-1, steps: 8, type: 'linear', round: 0}),
                //     ...new Array(5).fill(3),
                //     ...new Array(100).fill(catFrames.length-1),
                //     ...easing.fast({from: catFrames.length-1, to: 0, steps: 70, type: 'quad', method: 'out', round: 0}),
                //     ...new Array(50).fill(0),
                //     ...easing.fast({from: 0, to: 2, steps: 30, type: 'linear', round: 0}),
                //     ...new Array(50).fill(2),
                //     ...easing.fast({from: 2, to: 0, steps: 50, type: 'linear', round: 0}),
                // ];

                let framesIndices = [
                    ...new Array(100).fill(0),
                    // ...easing.fast({from: 0, to: catFrames.length-1, steps: 8, type: 'linear', round: 0}),
                    ...new Array(5).fill(3),
                    ...new Array(100).fill(catFrames.length-1),
                    ...easing.fast({from: catFrames.length-1, to: 3, steps: 30, type: 'quad', method: 'out', round: 0}),
                    ...new Array(50).fill(3),
                    ...easing.fast({from: 3, to: 0, steps: 30, type: 'linear', round: 0}),
                    ...new Array(50).fill(0),
                    ...easing.fast({from: 0, to: 2, steps: 20, type: 'linear', round: 0}),
                    ...new Array(45).fill(2),
                    ...easing.fast({from: 2, to: 0, steps: 20, type: 'linear', round: 0}),
                ];

                console.log('cat framesIndices: ' + framesIndices.length)

                this.currentFrame = 0;
                this.img = catFrames[framesIndices[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = catFrames[framesIndices[this.currentFrame]];
                    this.currentFrame++;
                    if(this.currentFrame == framesIndices.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), layersData.window2.renderIndex+2)

        this.cat_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'cat_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 150, itemFrameslength: [30,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
            }
        }), layersData.window2.renderIndex+3)

        let createRainFrames = function({framesCount, itemsCount, itemFrameslength,lengthClamps, angleClamps, maxA, minA = 0, lightData,size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p0 = new V2(getRandomInt(-10, size.x+10),getRandomInt(-30,-10));
                let lowerY = getRandomInt(size.y, size.y+20);
                let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}

                let angle = getRandom(angleClamps[0], angleClamps[1])
                let p1 = raySegmentIntersectionVector2(p0, V2.down.rotate(angle), bottomLine).toInt();

                let points = appSharedPP.lineV2(p0, p1); 
                let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
                let len = getRandomInt(lengthClamps);

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
                    pointsIndexValues,
                    points,
                    frames,
                    len
                }
            })

            let putLightAValue = (hlp, p) => {
                let aValue = minA;
                let _rgbColorPart = rgbColorPart;

                if(!lightData)
                    aValue = maxA
                else {
                    lightData.forEach(ld => {
                        if(ld.gradientDots[p.y]) {
                            if(ld.gradientDots[p.y][p.x]) {
                                let a = ld.gradientDots[p.y][p.x].maxValue//*ld.aMultiplier*aMul;
                                _rgbColorPart = ld.rgbColorPart;
                                if(a > 1) 
                                    a = 1;
                                   
                                aValue = a*maxA;

                                if(aValue < minA) {
                                    aValue = minA;
                                }
                            }
                        }
                    })
                }
                
                if(aValue > 0) {
                    hlp.setFillColor(_rgbColorPart + aValue + ')').dot(p.x,p.y)
                }
            }
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let pointIndex = itemData.pointsIndexValues[itemData.frames[f].index];

                            for(let i = 0; i < itemData.len; i++) {
                                let pi = pointIndex + i;
                                if(pi < itemData.points.length){
                                    let lp = itemData.points[pi];
                                    //hlp.setFillColor(rgbColorPart + maxA + ')').dot(lp.x,lp.y)
                                    putLightAValue(hlp, lp)
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let lightData = colors.createRadialGradient({ size: this.viewport.clone(), center: new V2(-10,120), radius: new V2(150,150), 
            gradientOrigin: new V2(-40,120), angle: 0,
            setter: (dot, aValue) => {
                aValue*=1;
                if(!dot.values){
                    dot.values = [];
                    dot.maxValue = aValue;
                }

                if(aValue > dot.maxValue)
                    dot.maxValue = aValue;

                dot.values.push(aValue);
            } })

        lightData = [
            {
                gradientDots: lightData,
                rgbColorPart: rgbColorPart
            }
        ]

        this.rain1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //let gradientDots = lightData;    
        // let maskImg = createCanvas(this.size, (ctx, size, hlp) => {
        //     for(let y = 0; y < gradientDots.length; y++) {
        //         if(gradientDots[y]) {
        //             for(let x = 0; x < gradientDots[y].length; x++) {
        //                 if(gradientDots[y][x]) {
        //                     hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue})`).dot(x,y)
        //                 }
        //             }
        //         }
        //     }
        // })
        //         this.img = maskImg
                

                this.frames = createRainFrames({
                    framesCount: 150, itemsCount: 100, itemFrameslength: 15, lengthClamps: [10,15].map(l => fast.r(l*1)), angleClamps: [0,5], maxA: 0.15, size: this.size,
                    lightData
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.stairs.renderIndex-1)

        this.rain2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({
                    framesCount: 150, itemsCount: 100, itemFrameslength: 20, lengthClamps: [10,15].map(l => fast.r(l*1)), angleClamps: [5,10], maxA: 0.25, minA: 0.035, size: this.size,
                    lightData
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.stairs.renderIndex+1)

        this.stairsSplashes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSmallDropsFrames({framesCount, itemsCount, itemFrameslengthClamps, aClamps, availablePoints, size}) {
                let frames = [];
            
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)
                    let p = availablePoints[getRandomInt(0, availablePoints.length-1)]

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
                        p, a,
                        frames
                    }
                })
            
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(rgbColorPart + itemData.a + ')').dot(itemData.p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createSmallDropsFrames({ framesCount: 150, itemsCount: 100, itemFrameslengthClamps: [5,10], aClamps: [0.05, 0.1],
                    availablePoints: appSharedPP.fillByCornerPoints(model.main.layers.find(l => l.name == 'stairs_splashes_zone').groups[0].points.map(p => new V2(p.point))),
                size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.stairs.renderIndex+1)

        this.fallingDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDropsFrames({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions, reduceOpacityOnFall = false,
                type, method}) {
                    let frames = [];
  
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
    
                    let startPosition = startPositions[getRandomInt(0, startPositions.length-1)];
                    let p = undefined; 
                    if(startPosition.type == 'points') {
                        p = startPosition.points[getRandomInt(0, startPosition.points.length-1)]
                    }
                    else {
                        p = new V2(getRandomInt(startPosition.xClamps), startPosition.y);
                    }
                    let height = startPosition.height;
                    let maxTailLength = startPosition.tail || 0;
    
                    let part1Length = getRandomInt(itemFrameslength1Clamps);
                    let part2Length = getRandomInt(itemFrameslength2Clamps)
    
                    let totalFrames = part1Length + part2Length
                    let opacity = fast.r(getRandom(opacityClamps[0], opacityClamps[1]),2);
                    let part1Alpha = easing.fast({from: 0, to: opacity, steps: part1Length, type: 'linear', round: 2})
                    let part2Alpha = undefined;
                    if(reduceOpacityOnFall) {
                        part2Alpha = easing.fast({from: opacity, to: 0, steps: part2Length, type: 'linear', round: 2})
                    }

                    let part2YChange = easing.fast({from: p.y, to: p.y + height, steps: part2Length, type, method, round: 0})
                    let tailChangeValues = undefined;
                    if(maxTailLength > 0) {
                        tailChangeValues = easing.fast({from: 0, to: maxTailLength, steps: part2Length, type: 'expo', method: 'in', round: 0})
                    }
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
    
                        let y = p.y;
                        let alpha = 0;
                        if(f < part1Length) {
                            alpha = part1Alpha[f];
                        }
                        else {
                            y = part2YChange[f-part1Length];
                            alpha = part2Alpha ? part2Alpha[f-part1Length] : opacity
                        }
                
                        let tail = 0;
                        if(tailChangeValues) {
                            tail = tailChangeValues[f-part1Length];
                        }
    
                        frames[frameIndex] = {
                            y,
                            tail,
                            alpha
                        };
                    }
                
                    return {
                        x: p.x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
    
                                let p = new V2(itemData.x, itemData.frames[f].y);
    
                                hlp.setFillColor(rgbColorPart + itemData.frames[f].alpha + ')').dot(p);
    
                                if(itemData.frames[f].tail > 0) {
                                    for(let i = 0; i < itemData.frames[f].tail; i++) {
                                        hlp.dot(p.add(new V2(0, i+1)));
                                    }
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createDropsFrames({ itemsCount: 3, framesCount: 450, itemFrameslength1Clamps: [40,80], itemFrameslength2Clamps: [30, 40], 
                    reduceOpacityOnFall: true, size: this.size,
                    opacityClamps: [0.1, 0.2], type: 'quad', method: 'in',
                    startPositions: [
                        { type: 'points', points: [
                            ...appSharedPP.lineV2(new V2(20,133), new V2(28,134)),
                        ], height: 80, tail: 1 }
                    ] })
    
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.window1.renderIndex+1)
    }
}