class AccidentScene extends Scene {
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
                size: new V2(916, 516),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'temple',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = AccidentScene.models.main;
        let layersData = {};
        let exclude = [
            'signal_lights'
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

        let createSnowfallFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size,
            angleClamps, xClamps, yClamps, pointsLengthClamps, lowerYClamps, color,
            big
        }) {
            let frames = [];
            let sharedPP = undefined;
            let bottomLine = createLine(new V2(-size.x, size.y+ pointsLengthClamps[1]), new V2(size.x*2, size.y+pointsLengthClamps[1]));
            
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));
            
                let linePoints = sharedPP.lineV2(point1, point2);
                let pointsLength = getRandomInt(pointsLengthClamps);
                let lowerY = getRandomInt(lowerYClamps);

                let to = pointsLength;
                if(to > linePoints.length-1) {
                    to = linePoints.length-1;
                }

                let linePointsIndices = easing.fast({ from: 0, to: to, steps: totalFrames, type: 'linear', round: 0});

                let frames = [];
                let extra = undefined;
                if(big) {
                    extra = [ ]
                    if(getRandomInt(0,3) == 0) {
                        extra = [
                            new V2(0, getRandomBool() ? -1: 1),
                            //new V2(getRandomBool() ? -1: 1, 0)
                        ];
                    }
                }
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndices[f]];
            
                    frames[frameIndex] = {
                        p
                    };
                }
            
                return {
                    lowerY,
                    extra,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { p } = itemData.frames[f];

                            if(p.y > itemData.lowerY)
                                continue;

                            hlp.setFillColor(color).dot(p);
                            if(big) {
                                itemData.extra.forEach(extra => {
                                    hlp.dot(p.x + extra.x, p.y + extra.y)
                                })
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.bgSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 2000, itemFrameslengthClamps: [130, 160],  size: this.size,
                    angleClamps: [-10,10], xClamps: [-20, this.size.x+20], yClamps: [-20, 60], 
                    pointsLengthClamps: [5, 10], lowerYClamps: [65, 65], color: '#f0ebf2' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+1)

        this.roadSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [130, 160],  size: this.size,
                    angleClamps: [-20,20], xClamps: [-20, this.size.x+20], yClamps: [-20, 90], 
                    pointsLengthClamps: [15, 20], lowerYClamps: [75, 90], color: '#eae5eb' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.road_d4.renderIndex+1)
    
        this.beyondCarSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [150, 170],  size: this.size,
                    angleClamps: [-25,25], xClamps: [-20, this.size.x+20], yClamps: [-20, this.size.y+20], 
                    pointsLengthClamps: [25, 30], lowerYClamps: [this.size.y, this.size.y], color: '#f6f1f8' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex-1)

        this.frontalSnow1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [100, 120],  size: this.size,
                    angleClamps: [-25,25], xClamps: [-20, this.size.x+20], yClamps: [-20, this.size.y+20], 
                    pointsLengthClamps: [30, 40], lowerYClamps: [this.size.y, this.size.y], color: '#f6f1f8' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex+1)

        this.frontalSnow2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 500, itemFrameslengthClamps: [100, 120],  size: this.size,
                    angleClamps: [-25,25], xClamps: [-20, this.size.x+20], yClamps: [-20, this.size.y+20], 
                    pointsLengthClamps: [30, 40], lowerYClamps: [this.size.y, this.size.y], color: '#eae5eb' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex+1)

        this.frontalSnowBig = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowfallFrames({ framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [70, 90],  size: this.size,
                    angleClamps: [-20,20], xClamps: [-20, this.size.x+20], yClamps: [-20, this.size.y+20], big: true,
                    pointsLengthClamps: [50, 80], lowerYClamps: [this.size.y, this.size.y], color: '#f6f1f8' })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex+2)


        this.man = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(60.5, 0)),
            size: new V2(80,45),
            init() {
                this.frames = PP.createImage(AccidentScene.models.man).map(frame => 
                    createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.translate(size.x, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(frame, 0,0)
                    })
                ) 

                let totalFrames = 300;
                let framesIndexes = [
                    ...new Array(150).fill(0),
                    ...easing.fast({ from: 0, to: this.frames.length-1, steps: 50, type: 'linear', method: 'base', round: 0}),
                    ...new Array(70).fill(this.frames.length-1),
                    ...easing.fast({ from: this.frames.length-1, to: 0, steps: 30, type: 'quad', method: 'in', round: 0}),
                ]

                this.currentFrame = 0;
                this.img = this.frames[framesIndexes[this.currentFrame]];
                
                let delay = 300;
                let originDelay = 300;

                this.timer = this.regTimerDefault(10, () => {
                    delay--;

                    if(delay > 0)
                        return;

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        delay = originDelay;
                    }

                    this.img = this.frames[framesIndexes[this.currentFrame]];;
                })
            }
        }), layersData.car.renderIndex-1)

        this.signal_lights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.lightsImg = PP.createImage(model, { renderOnly: ['signal_lights'] });

                this.currentFrame = 0;
                let totalFrames = 30;
                let state = false;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        state = !state;
                        
                        this.img = state ? this.lightsImg : undefined;
                    }
                })
            }
        }), layersData.car.renderIndex+1)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBuildingsFrames({framesCount, framesPerModel, modelsData, model, size, targetPoint, makeDarkerBy, sizeMultiplier}) {
                let eType = 'expo';
                let eMethod = 'in';
                let frames = new Array(framesCount);
                let pCenter = new V2(75,53);
        
                let sharedPP = undefined;
                let alphaMaskValues = easing.fast({from: 1, to: 0, steps: fast.r(framesPerModel*4/5), type: 'quad', method: eMethod}).map(v => fast.r(v, 2));
                
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});  
                })
        
                let framesData = [];
        
                for(let i = 0; i < modelsData.length; i++){
                    //let movingLinePoints = [];
                    let model = modelsData[i].model;
                    let modelSize = new V2(model.general.size);
        
                    model.sizeXValue = easing.fast({from: 1, to: modelSize.x*sizeMultiplier, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
                    model.sizeYValue = easing.fast({from: 1, to: modelSize.y*sizeMultiplier, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
        
                    let modelCenter = new V2(0,0);//= modelSize.divide(2).toInt();
                    if(!model.frames){
                        model.frames = [];
                    }
                    // let p2 = raySegmentIntersectionVector2(pCenter.add(modelCenter), direction, createLine(new V2(0, 0), new V2(0, size.y))).toInt().substract(modelSize);
        
                     let movingLinePoints = sharedPP.lineV2(pCenter, targetPoint);
                     let movingLineIndexValues = easing.fast({from: 0, to: movingLinePoints.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
        
                    for(let f = 0; f < framesPerModel; f++){
                        //let buildingFrame = undefined;
                        let frameIndex = f + modelsData[i].initialFrame;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
        
                        if(!model.frames[f]){
                            
            
                            let frameModel  = {
                                general: model.general,
                                main: {
                                    layers: [
                                        {
                                            visible: true,
                                            order: 0,
                                            groups: []
                                        },
                                        {
                                            visible: true,
                                            order: 1,
                                            groups: []
                                        }
                                    ]
                                }
                            }
            
                            frameModel.general.size = new V2(model.sizeXValue[f], model.sizeYValue[f])
            
                            for(let l = 0; l < frameModel.main.layers.length;l++) {
                                frameModel.main.layers[l].groups = model.main.layers[l].groups.map(originalGroup => {
                                    frameModel.main.layers[l].id = model.main.layers[l].id
                                    let group = assignDeep({}, originalGroup, {points: [] } );
                                    
                                    // let hsv = colors.hexToHsv(group.strokeColor);
                                    // hsv.v /= makeDarkerBy;
            
                                    // group.strokeColor = hsvToHex({hsv, hsvAsObject: true, hsvAsInt: false});
                                    // group.fillColor = group.strokeColor;
            
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
                                    ctx.drawImage(PP.createImage(frameModel, { renderOnly: ['m_1'] }), 0,0);
                                    ctx.drawImage(PP.createImage(frameModel, { renderOnly: ['m_0'] }), 0,0);
                                    ctx.globalCompositeOperation = 'source-atop';
                                    let a = alphaMaskValues[f];
                                    if(a == undefined)
                                        a = 0;
                                    hlp.setFillColor(`rgba(195,190,196,${a})`).rect(0,0,size.x, size.y);
                                }) ,
                                size: frameModel.general.size
                            }
                        }
                        
                        
            
                        let buildingFrame = model.frames[f].img;//PP.createImage(frameModel);
                        let bPosition = new V2(movingLinePoints[movingLineIndexValues[f]]);//.substract(modelCenter).toInt();
        
                        if(!framesData[frameIndex]){
                            framesData[frameIndex] = [];
                        }
        
                        let order = f;
                        framesData[frameIndex][order] = {
                            modelSize: model.frames[f].size,//frameModel.general.size,
                            img: buildingFrame,
                            position: bPosition
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
        
                let imagesOutside;
        
                for(let f = 0; f < framesCount; f++){
                    let frameData = framesData[f];
                    if(frameData && frameData.length){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let i = 0; i < frameData.length; i++){
                                if(frameData[i]){
                                    let { img, position, modelSize } = frameData[i]
                                    //let bPosition = new V2(movingLinePoints[movingLineIndexValues[frameData[i].modelFrameIndex]]).substract(modelCenter).toInt();
                                    ctx.drawImage(img, position.x, position.y);  
                                    //hlp.setFillColor('red').dot(position.x, position.y)
                                }
                            }
                        })
                    }
                }
        
        
                return frames;
            },
            init() {
                this.frames = this.createBuildingsFrames({framesCount: 300, framesPerModel: 300, modelsData: [
                    {
                        model: AccidentScene.models.car,
                        initialFrame: 0,
                    }], size: this.size, targetPoint: new V2(240,53),
                    sizeMultiplier: 2
                });

                this.registerFramesDefaultTimer({initialAnimationDelay: 300, animationRepeatDelayOrigin: 300});

                //this.img = this.frames[this.frames.length-1]
            }
        }), layersData.road_d4.renderIndex+1)

        this.road_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#d1cbd1', '#ded8de', '#aca6aa', '#948e8f']
                let t = PP.createImage(model, { renderOnly: ['road', 'road_d1', 'road_d2', 'road_d3', 'road_d4'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(pd.position.x < 70 && getRandomInt(0, 5) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.clone(), color } 
                        }
                    }
                    
                });

                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, pointsData: pData, itemFrameslength: 100, size: this.size })

                let repeat = 2;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.road_d4.renderIndex+1)
    }
}