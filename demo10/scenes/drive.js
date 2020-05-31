class Demo10DriveScene extends Scene {
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

    createBuildingsFrames({framesCount, framesPerModel, modelsData, model, size, targetPoint}) {
        let eType = 'expo';
        let eMethod = 'in';
        let frames = new Array(framesCount);
        let direction = this.pCenter.direction(new V2(0,82));

        let sharedPP = undefined;
        let alphaMaskValues = easing.fast({from: 0.95, to: 0, steps: fast.r(framesPerModel*4/5), type: 'quad', method: eMethod}).map(v => fast.r(v, 2));
        
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx});

            
            
        })

        let framesData = [];

        for(let i = 0; i < modelsData.length; i++){
            //let movingLinePoints = [];
            let model = modelsData[i].model;
            let modelSize = new V2(model.general.size);

            model.sizeXValue = easing.fast({from: 1, to: modelSize.x, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
            model.sizeYValue = easing.fast({from: 1, to: modelSize.y, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));

            let modelCenter = new V2(0,0);//= modelSize.divide(2).toInt();
            if(!model.frames){
                model.frames = [];
            }
            // let p2 = raySegmentIntersectionVector2(this.pCenter.add(modelCenter), direction, createLine(new V2(0, 0), new V2(0, size.y))).toInt().substract(modelSize);

             let movingLinePoints = sharedPP.lineV2(this.pCenter, targetPoint);
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
                                }
                            ]
                        }
                    }
    
                    frameModel.general.size = new V2(model.sizeXValue[f], model.sizeYValue[f])
    
                    frameModel.main.layers[0].groups = model.main.layers[0].groups.map(originalGroup => {
                        let group = assignDeep({}, originalGroup, {points: [] } );
        
                        group.points = originalGroup.points.map(originalPoint => {
                            if(!originalPoint.lineDots){
                                originalPoint.lineDots = sharedPP.lineV2(modelCenter, new V2(originalPoint.point));
                                originalPoint.lineDotsIndexValues = easing.fast({from: 0, to: originalPoint.lineDots.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v))
                            }
        
                            let dot = originalPoint.lineDots[originalPoint.lineDotsIndexValues[f]];
                            let point = assignDeep({}, originalPoint, { point: dot, lineDots: undefined, lineDotsIndexValues: undefined })
        
                            return point;
                        })
                        
                        return group;
                    })

                    model.frames[f] = {
                        img:  createCanvas(frameModel.general.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(frameModel), 0,0);
                            ctx.globalCompositeOperation = 'source-atop';
                            let a = alphaMaskValues[f];
                            if(a == undefined)
                                a = 0;
                            hlp.setFillColor(`rgba(0,0,0,${a})`).rect(0,0,size.x, size.y);
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

        for(let f = 0; f < framesCount; f++){
            let frameData = framesData[f];
            if(frameData && frameData.length){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let i = 0; i < frameData.length; i++){
                        if(frameData[i]){
                            let { img, position, modelSize } = frameData[i]
                            //let bPosition = new V2(movingLinePoints[movingLineIndexValues[frameData[i].modelFrameIndex]]).substract(modelCenter).toInt();
                            ctx.drawImage(img, position.x - modelSize.x, position.y);  
                            //hlp.setFillColor('red').dot(position.x, position.y)
                        }
                    }
                })
            }
        }


        return frames;
    }

    start(){
        this.pCenter = new V2(149, 62);

        var model = Demo10DriveScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(Demo10DriveScene.models.bg)
        }), 0)

        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;

            this.addGo(new GO({
                position: this.sceneCenter,
                size: this.viewport,
                img: PP.createImage(model, {renderOnly: [name]}),
                init() {
                }
            }), (l+1)*10);
        }

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10DriveScene.models.road)
        }),5)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 400, framesPerModel: 400, 
                        modelsData: [
                            {
                                model: Demo10DriveScene.models.buildings.b4,
                                initialFrame: 100,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b4,
                                initialFrame: 300,
                            }
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-50) })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 3)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 300, framesPerModel: 300, 
                        modelsData: [
                            {
                                model: Demo10DriveScene.models.buildings.b3,
                                initialFrame: 100,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b3,
                                initialFrame: 200,
                            }
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-160) })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 4)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 200, framesPerModel: 200, 
                        modelsData: [
                            ...new Array(40).fill().map((_,i) => ({
                                model: Demo10DriveScene.models.buildings.vLine,
                                initialFrame: i*5,
                            }))
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-25) })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 6)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 200, framesPerModel: 200, 
                        modelsData: [
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 0,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 25,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 50,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 75,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 100,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 125,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 150,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 175,
                            },
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-160) })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 6)
    }
}