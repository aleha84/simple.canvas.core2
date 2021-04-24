class CatScene extends Scene {
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
                size: new V2(1280, 1500),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'cat'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = CatScene.models.main;
        let layersData = {};
        let exclude = [
            'cat_p', 'cat_p1'
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

        this.tail = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                this.frames = PP.createImage(CatScene.models.tailAnimation);

                let frameIndexValues = [
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 })
                ]

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == frameIndexValues.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[frameIndexValues[this.currentFrame]];
                })
            }
        }), layersData.cat.renderIndex+1)

        this.breath = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 100;
                this.frames = PP.createImage(CatScene.models.breathAnimation);

                let frameIndexValues = [
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 })
                ]

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == frameIndexValues.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[frameIndexValues[this.currentFrame]];
                })
            }
        }), layersData.cat.renderIndex+5)

        this.eyesAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CatScene.models.eyesAnimation, { renderOnly: [ 'eyes' ]})

                let totalFrames = 300;
                let animationLength = 60;
                let frameIndexValues = [
                    ...new Array((totalFrames-animationLength)/2).fill(0),
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: animationLength/2, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: animationLength/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array((totalFrames-animationLength)/2).fill(0)
                ];

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == frameIndexValues.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[frameIndexValues[this.currentFrame]];
                })
            }
        }), layersData.cat.renderIndex+5)

        this.earAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CatScene.models.eyesAnimation, { renderOnly: [ 'ear' ]})

                let totalFrames = 600;
                let animationLength = 100;
                let frameIndexValues = [
                    ...new Array(200).fill(0),
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: animationLength/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array(200).fill(this.frames.length-1),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: animationLength/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array(100).fill(0),
                ];

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == frameIndexValues.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }

                    this.img = this.frames[frameIndexValues[this.currentFrame]];
                })
            }
        }), layersData.cat.renderIndex+4)

        this.cat_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'cat_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.cat.renderIndex+1)
    }
}