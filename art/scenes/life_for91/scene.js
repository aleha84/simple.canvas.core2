class CatScene extends Scene {
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
        let model = CatScene.models.main;
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
        }), layersData.cat.renderIndex+2)
    }
}