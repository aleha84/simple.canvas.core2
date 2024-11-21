class Departing2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            scrollOptions: {
                enabled: true,
                zoomEnabled: true,
                restrictBySpace: false,
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,198).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'departing2',
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
        let originalSize = new V2(200,200);
        const model = Departing2Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(202,230,249,';
        let pCenter = new V2(39,123)

        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                //return;
                let xClamps = [0,0]
                let yClamps = [-0.5,0.5]
                SCG.viewport.camera.updatePosition(new V2(xClamps[0],yClamps[0]));

                let totalFrames = 250;
                let xValues = [
                    ...easing.fast({from: xClamps[0], to: xClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: xClamps[1], to: xClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                let yValues = [
                    ...easing.fast({from: yClamps[0], to: yClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: yClamps[1], to: yClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                let xFrontalValues = [
                    ...easing.fast({from: xClamps[0]/6, to: xClamps[1]/6, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: xClamps[1]/6, to: xClamps[0]/6, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    SCG.viewport.camera.updatePosition(new V2(xValues[this.currentFrame],yValues[this.currentFrame]));
                    // this.parentScene.far_door.position.x = this.parentScene.sceneCenter.x + xFrontalValues[this.currentFrame];
                    // this.parentScene.far_door.needRecalcRenderProperties = true;

                    // this.parentScene.fg.position.x = this.parentScene.sceneCenter.x - xValues[this.currentFrame]/2;
                    // this.parentScene.fg.needRecalcRenderProperties = true;
                })
            }
        }), 0)

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            createTreesFrames({
                framesCount, framesPerModel, modelsData, size, targetPoint, startSize = 1, sizeMultiplier = 1, eType = 'expo', eMethod = 'in', 
                modelCenter = new V2(0,0), startFrom = 0, pCenter = undefined}) {

                let frames = new Array(framesCount);
                if(!pCenter) {
                    pCenter = new V2(size.x/2, size.y/2).toInt();
                }
        
                let sharedPP = PP.createNonDrawingInstance();
        
                let framesData = [];
        
                for(let i = 0; i < modelsData.length; i++){
                    let model = modelsData[i].model;
                    let modelSize = new V2(model.general.size);
        
                    model.sizeXValue = easing.fast({from: startSize, to: modelSize.x*sizeMultiplier, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
                    model.sizeYValue = easing.fast({from: startSize, to: modelSize.y*sizeMultiplier, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
        
                    if(!model.frames){
                        model.frames = [];
                    }

                     let movingLinePoints = sharedPP.lineV2(pCenter, targetPoint);
                     let movingLineIndexValues = easing.fast({from: 0, to: movingLinePoints.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
        
                    var yShifValues = easing.fast({from: 0, to: (modelsData[i].yShift || 0), steps: framesPerModel, type: eType, method: eMethod, round: 0});

                    for(let f = 0; f < framesPerModel; f++){
                        let frameIndex = f + modelsData[i].initialFrame;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
        
                        if(!model.frames[f]){
                            
                            //console.log('Created frame: ' + f + "for model index: " + i)
                            let frameModel  = {
                                general: model.general,
                                main: {
                                    layers: [

                                    ]
                                }
                            }
            
                            frameModel.general.size = new V2(model.sizeXValue[f], model.sizeYValue[f])
            
                            for(let l = 0; l < model.main.layers.length;l++) {
                                frameModel.main.layers[l] = {
                                    id: model.main.layers[l].id,
                                    visible: model.main.layers[l].visible,
                                    order: model.main.layers[l].order,
                                    groups: []
                                }

                                frameModel.main.layers[l].groups = model.main.layers[l].groups.map(originalGroup => {
                                    let group = assignDeep({}, originalGroup, {points: [] } );
            
                                    group.points = originalGroup.points.map(originalPoint => {
                                        if(!originalPoint.lineDots){
                                            originalPoint.lineDots = sharedPP.lineV2(modelCenter, new V2(originalPoint.point).mul(sizeMultiplier));
                                            originalPoint.lineDotsIndexValues = easing.fast({from: 0, to: originalPoint.lineDots.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v))
                                        }
                    
                                        let dot = originalPoint.lineDots[originalPoint.lineDotsIndexValues[f]];
                                        let point = assignDeep({}, originalPoint, { point: dot, lineDots: undefined, lineDotsIndexValues: undefined })
                    
                                        return point;
                                    })
                                    
                                    return group;
                                })
                            }
                            
        
                            model.frames[f] = {
                                img:  createCanvas(frameModel.general.size, (ctx, size, hlp) => {
                                    frameModel.main.layers.forEach(l => ctx.drawImage(PP.createImage(frameModel, { renderOnly: [l.id] }), 0,0))                                   
                                }) ,
                                size: frameModel.general.size
                            }
                        }
                        
                        
            
                        let buildingFrame = model.frames[f].img;
                        let bPosition = new V2(movingLinePoints[movingLineIndexValues[f]]);
        
                        if(!framesData[frameIndex]){
                            framesData[frameIndex] = [];
                        }
        
                        let order = f;
                        framesData[frameIndex][order] = {
                            modelSize: model.frames[f].size,
                            img: buildingFrame,
                            position: bPosition,
                            yShift: yShifValues[f]
                        }
                    }
                }
                
                /*
                frameData = [
                    0: [
                        { 
                            img,
                            modelFrameIndex
                        }
                    ],
                    1: []
                ]
                */
        
                //let imagesOutside;
        
                for(let f = 0; f < framesCount; f++){
                    let frameData = framesData[f];
                    if(frameData && frameData.length){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let i = 0; i < frameData.length; i++){
                                if(frameData[i]){
                                    let { img, position, modelSize, yShift } = frameData[i]
                                    //let bPosition = new V2(movingLinePoints[movingLineIndexValues[frameData[i].modelFrameIndex]]).substract(modelCenter).toInt();
                                    ctx.drawImage(img, position.x, position.y + (yShift || 0));  
                                    //hlp.setFillColor('red').dot(position.x, position.y)
                                }
                            }
                        })
                    }
                }
        
        
                return frames;
            },
            init() {
                //let initialFramesValues = easing.fast()
                
                //return;

                let pLine = appSharedPP.lineV2(pCenter, new V2(210,-80));
                let shiftedPCenter = pLine[fast.r(pLine.length*1/3)]

                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalTrees = 80;
                        let totalframesCount = 500;
                        let prevIndex = -1;
                        let modelsData = new Array(totalTrees).fill().map((el, i) => {
                            let index = getRandomInt(0, Departing2Scene.models.trees.length-1);
                            if(prevIndex == index) {
                                index -=1;
                                if(index < 0)
                                    index = Departing2Scene.models.trees.length-1;
                            }
        
                            prevIndex = index;
        
                            return {
                                model: Departing2Scene.models.trees[index],
                                initialFrame: fast.r(i*(totalframesCount/totalTrees)),
                                yShift: getRandomInt(-4, 4)
                            }
                        });

                        let overlay = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5
                            hlp.setFillColor('#a2d8fe').rect(0,0,size.x, size.y) //#
                        })

                        this.frames = this.parent.createTreesFrames({framesCount: totalframesCount, framesPerModel: totalframesCount, modelsData, size: this.size, 
                            pCenter: pCenter.add(new V2(35,-25)), targetPoint: new V2(210,-60), sizeMultiplier: 2
                        }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(f, 0,0);
                            ctx.globalCompositeOperation = 'source-atop'
                            ctx.drawImage(overlay, 0,0);
                        }));
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }

                        });
                    }
                }))
                 

                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalTrees = 60;
                        let totalframesCount = 500;
                        let prevIndex = -1;
                        let modelsData = new Array(totalTrees).fill().map((el, i) => {
                            let index = getRandomInt(0, Departing2Scene.models.trees.length-1);
                            //console.log('model index: ' + index);
                            if(prevIndex == index) {
                                index -=1;
                                if(index < 0)
                                    index = Departing2Scene.models.trees.length-1;
                            }
        
                            prevIndex = index;
        
                            return {
                                model: Departing2Scene.models.trees[index],
                                initialFrame: fast.r(i*(totalframesCount/totalTrees)),
                                yShift: getRandomInt(-4, 4)
                            }
                        });

                        this.frames = this.parent.createTreesFrames({framesCount: totalframesCount, framesPerModel: totalframesCount, modelsData, size: this.size, 
                            pCenter, targetPoint: new V2(210,-75), sizeMultiplier: 2
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.snowdrift = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            createSnowdriftFrames({framesCount, itemsCount, itemFrameslength, itemYClamps, targetPoint, size}) {
                let frames = [];
                
                let movingLinePoints = appSharedPP.lineV2(pCenter, targetPoint, {toV2: true}); //, 
                let movingLineIndexValues = easing.fast({from: 0, to: movingLinePoints.length-1, steps: framesCount, type: 'expo', method: 'in', round: 0});

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = fast.r(i*(framesCount/itemsCount))
                    let totalFrames = itemFrameslength;
                    
                    let maxY = getRandomInt(itemYClamps);
                    let yValues = easing.fast({from: 0, to: maxY, steps: totalFrames, type: 'expo', method: 'in', round: 0})

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: movingLinePoints[movingLineIndexValues[f]],
                            yShift: yValues[f],
                            index: f
                        };
                    }
                
                    return {
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        let curvePoints = [];
                        
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                curvePoints[curvePoints.length] = itemData.frames[f];
                            }
                        }

                        curvePoints.sort((a,b) => a.index - b.index);

                        //pp.setFillColor('red');
                        let upperPointsPart = appSharedPP.curveByCornerPoints(curvePoints.map(c => c.p.add(new V2(0, c.yShift))), 3);
                        pp.setFillColor('#95CDF3');
                        pp.fillByCornerPoints([
                            ...upperPointsPart.filter(p => p.x > 90),
                            new V2(size.x, size.y),
                            new V2(100, size.y)
                        ])

                        pp.setFillColor('rgba(0,0,0,0.1)')
                        upperPointsPart.forEach(p => hlp.dot(p))

                        pp.setFillColor('rgba(0,0,0,0.05)')
                        upperPointsPart.forEach(p => hlp.dot(p.x, p.y+1))
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createSnowdriftFrames({ framesCount: 250, itemsCount: 30, itemFrameslength: 250, itemYClamps: [-4,4], 
                    targetPoint: new V2(250,152),  size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), 4)

        this.bg  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            createSnowFallFrames({framesCount, itemsCount, xClamps, yClamps, angleClamps, itemFrameslengthClamps, aClamps, size, tailLength}) {
                let frames = [];
                
                let height = yClamps[1] - yClamps[0] + 1;
                let angles = easing.fast({ from: angleClamps[0], to: angleClamps[1], steps: height, type: 'linear', round: 0 });
                let rightLine = createLine(new V2(size.x, -size.y), new V2(size.x, size.y*2));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let p1 = new V2(getRandomInt(xClamps), getRandomInt(yClamps))
                    let angle = 90 + angles[p1.y - yClamps[0]];

                    let direction = V2.up.rotate(angle);
                    let p2 = raySegmentIntersectionVector2(p1, direction, rightLine);

                    let linePoints = appSharedPP.lineV2(p1, p2, { toV2: true });
                    let lineIdicesValues = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0 })

                    let aValue = fast.r(getRandom(aClamps[0], aClamps[1]),3);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let _p = linePoints[lineIdicesValues[f]];
                
                        frames[frameIndex] = {
                            //p: linePoints[lineIdicesValues[f]],
                            points: tailLength == 1 ? 
                                [_p] : 
                                appSharedPP.lineV2(_p, _p.add(direction.mul(tailLength)))
                        };
                    }
                
                    return {
                        frames,
                        direction,
                        aValue
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(colorPrefix + itemData.aValue + ')')//.dot(itemData.frames[f].p)
                                itemData.frames[f].points.forEach(p => hlp.dot(p))
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.l0 =this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFallFrames({ framesCount: 250, itemsCount: 5000, xClamps: [80,100], yClamps: [40,160], angleClamps: [-35,10],
                            itemFrameslengthClamps: [40,55], aClamps: [0.2,0.4], tailLength: 1,  size: this.size });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l1 =this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFallFrames({ framesCount: 250, itemsCount: 2000, xClamps: [80,100], yClamps: [40,160], angleClamps: [-40,15],
                            itemFrameslengthClamps: [25,35], aClamps: [0.4,0.5], tailLength: 2, size: this.size });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.stolb = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 125;
                        let maxWidth = 20;
                        let wValues = easing.fast({from: 0, to: maxWidth, steps: totalFrames, type: 'expo', method: 'in', round: 0});
                        let xValues = easing.fast({from: pCenter.x, to: this.size.x+1, steps: totalFrames, type: 'expo', method: 'in', round: 0})

                        this.frames = [];

                        for(let f= 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let w0 = wValues[f];
                                hlp.setFillColor('#71A1C4').rect(xValues[f], 0, w0, size.y)
                                let w1 = fast.r(wValues[f]*0.3);
                                hlp.setFillColor('rgba(0,0,0,0.05)').rect(xValues[f]+w0-w1, 0, w1, size.y)

                                let w2 = fast.r(wValues[f]*0.1);
                                hlp.setFillColor('rgba(0,0,0,0.05)').rect(xValues[f]+w0-w2, 0, w2, size.y)

                                // let w3 = fast.r(wValues[f]*0.2);
                                // hlp.setFillColor('rgba(255,255,255,0.1)').rect(xValues[f], 0, w3, size.y)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l2 =this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFallFrames({ framesCount: 250, itemsCount: 1000, xClamps: [80,100], yClamps: [40,160], angleClamps: [-45,20],
                            itemFrameslengthClamps: [15,20], aClamps: [0.6,0.7], tailLength: 2, size: this.size });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), 5)

        this.window  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['window'] }),
            init() {
                //
            }
        }), 6)

        this.far_door  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['far_door'] }),
            init() {
                //
            }
        }), 6)

        this.inside  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['inside', 'inside_d'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 250, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'inside_p')),
                         });

                         this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        this.perila  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            img: PP.createImage(model, { renderOnly: ['perila'] }),
            init() {
                
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 250, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'perila_p')),
                         });

                         this.registerFramesDefaultTimer({});
                    }
                }))

                this.stolb_shadow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 125;
                        let maxWidth = 20;
                        let wValues = easing.fast({from: 0, to: maxWidth, steps: totalFrames, type: 'expo', method: 'in', round: 0});
                        let xValues = easing.fast({from: pCenter.x, to: this.size.x+1, steps: totalFrames, type: 'expo', method: 'in', round: 0})

                        let shadow_zone = PP.createImage(model, { renderOnly: ['stolb_shadow_zone'], forceVicibility: {stolb_shadow_zone: {visible: true}}  })

                        this.frames = [];

                        for(let f= 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let w0 = wValues[f];

                                ctx.globalAlpha = 0.3

                                hlp.setFillColor('#71A1C4').rect(xValues[f], 0, w0, size.y)
                                let w1 = fast.r(wValues[f]*0.3);
                                hlp.setFillColor('rgba(0,0,0,0.05)').rect(xValues[f]+w0-w1, 0, w1, size.y)

                                let w2 = fast.r(wValues[f]*0.1);
                                hlp.setFillColor('rgba(0,0,0,0.05)').rect(xValues[f]+w0-w2, 0, w2, size.y)

                                // let w3 = fast.r(wValues[f]*0.2);
                                // hlp.setFillColor('rgba(255,255,255,0.1)').rect(xValues[f], 0, w3, size.y)
                                ctx.globalAlpha = 1
                                ctx.globalCompositeOperation = 'destination-in';
                                ctx.drawImage(shadow_zone, 0,0);
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), 8)
    }
}