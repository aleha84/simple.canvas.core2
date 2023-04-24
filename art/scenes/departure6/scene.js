class Departure6Scene extends Scene {
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
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'departure6',
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
        let model = Departure6Scene.models.main;
        let layersData = {};
        let exclude = [
            'bg_p', 'smoker_p', 'trains_p'
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

        this.bg_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bg_p'))
                this.frames = animationHelpers.createMovementFrames({
                    framesCount: 300, itemFrameslength: [20,50], pointsData: pd, size: this.size 
                });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg_d.renderIndex+1)


        this.smoker_animation = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 0)),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 600;
                this.frames = PP.createImage(Departure6Scene.models.smokerAnimation2);

                let stopFrame = 48;
                let framesIndexValues = [
                    ...new Array(150).fill(0),
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: 300, type: 'linear', round: 0}),
                    ...new Array(150).fill(0)
                ];

                let index = 0;
                this.img = this.frames[stopFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    let fi = stopFrame + framesIndexValues[index];
                    if(fi >= this.frames.length) {
                        fi -= this.frames.length;
                    }

                    //console.log('fi: ' + fi)
                    this.img = this.frames[fi];
                    index++;
                    if(index == totalFrames){
                        index = 0;
                        this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), layersData.smoker.renderIndex+2)

        this.smoker_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'smoker_p'))
                this.frames = animationHelpers.createMovementFrames({
                    framesCount: 200, itemFrameslength: [30,60], pointsData: pd, size: this.size 
                });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.smoker.renderIndex+1)

        this.trains_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'trains_p'))
                this.frames = animationHelpers.createMovementFrames({
                    framesCount: 300, itemFrameslength: [50,80], pointsData: pd, size: this.size 
                });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.train_l_d.renderIndex+2)


        this.passengers_animation = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 0)),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 600;
                this.frames = PP.createImage(Departure6Scene.models.passengersAnimations);

                let framesIndexValues = [
                    ...new Array(300).fill(0),
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: 300, type: 'linear', round: 0}),
                    //...new Array(50).fill(0)
                ];

                let index = 0;
                this.img = this.frames[0];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    let fi = framesIndexValues[index];

                    //console.log('fi: ' + fi)
                    this.img = this.frames[fi];
                    index++;
                    if(index == totalFrames){
                        index = 0;
                    }
                })
            }
        }), layersData.passengers.renderIndex+1)
    }
}