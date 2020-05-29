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

    createBuildingsFrames({framesCount, model,modelSize, size, targetPoint}) {
        let eType = 'sin';
        let eMethod = 'in';
        let frames = [];
        let modelCenter = modelSize.divide(2).toInt();

        let sharedPP = undefined;
        let movingLinePoints = [];
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx});
            movingLinePoints = sharedPP.lineV2(this.pCenter, targetPoint);
        })

        let movingLineIndexValues = easing.fast({from: 0, to: movingLinePoints.length-1, steps: framesCount, type: eType, method: eMethod}).map(v => fast.r(v));

        let modelValues = [];
        
        for(let f = 0; f < framesCount; f++){
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

            frameModel.main.layers[0].groups = model.main.layers[0].groups.map(originalGroup => {
                let group = assignDeep({}, originalGroup, {points: [] } );

                group.points = originalGroup.points.map(originalPoint => {
                    if(!originalPoint.lineDots){
                        originalPoint.lineDots = sharedPP.lineV2(modelCenter, new V2(originalPoint.point));
                        originalPoint.lineDotsIndexValues = easing.fast({from: 0, to: originalPoint.lineDots.length-1, steps: framesCount, type: eType, method: eMethod}).map(v => fast.r(v))
                    }

                    let dot = originalPoint.lineDots[originalPoint.lineDotsIndexValues[f]];
                    let point = assignDeep({}, originalPoint, { point: dot, lineDots: undefined, lineDotsIndexValues: undefined })

                    return point;
                })
                
                return group;
            })

            let buildingFrame = PP.createImage(frameModel);
            let bPosition = new V2(movingLinePoints[movingLineIndexValues[f]]).substract(modelCenter).toInt();

            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                ctx.drawImage(buildingFrame, bPosition.x, bPosition.y);
            })
        }
        
        return frames;
    }

    start(){
        this.pCenter = new V2(132, 62);

        var model = Demo10DriveScene.models.main;
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
        }),1)

        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 200, model: Demo10DriveScene.models.buildings.b1, modelSize: new V2(Demo10DriveScene.models.buildings.b1.general.size), size: this.size, targetPoint: new V2(-50, this.parentScene.pCenter.y-20) })

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
        }), 5)
    }
}