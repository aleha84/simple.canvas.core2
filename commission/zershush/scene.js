class ZershushCabinScene extends Scene {
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
        let model = ZershushCabinScene.models.main;
        let layersData = {};
        let exclude = ['fireplace_light'];

        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;

            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }

            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
                    //
                }
            }), renderIndex)

            layersData[layerName] = {
                renderIndex
            }

            console.log(`${layerName} - ${renderIndex}`)
        }

        this.fireplaceLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLightFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let baseImages = [];
                let model = ZershushCabinScene.models.fireplace_light;
                for(let i = 0; i < model.main.layers.length; i++){
                    let layer = model.main.layers[i];
                    layer.visible = true;
                    let layerName = layer.name || layer.id;
                    baseImages[baseImages.length] = PP.createImage(model, { renderOnly: [layerName] });
                }

                let frames = [];
                let framesData = [];

                for(let i = 0; i < itemsCount; i++){
                    let startFrameIndex = getRandomInt(
                        framesCount*(i/itemsCount), 
                        (i == itemsCount-1 ? framesCount-1 : framesCount*(i+1)/itemsCount));

                    // let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                    //let img = baseImages[getRandomInt(0, baseImages.length-1)];

                    let maxIndex = getRandomInt(1,baseImages.length-1)
                    let fiValues = [
                        ...easing.fast({from: 0, to: maxIndex, steps: totalFrames, type: 'linear', round: 0 }),
                        ...easing.fast({from: maxIndex, to: 0, steps: totalFrames, type: 'linear', round: 0 })
                    ]

                    for(let f = 0; f < totalFrames*2; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        framesData[frameIndex] = baseImages[fiValues[f]]//img;
                    }
                }

                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let img = baseImages[0];
                        
                        if(framesData[f]){
                            img = framesData[f];
                            ctx.drawImage(img, 0,0);
                        }
                        
                    });
                }
                
                return frames;
            },
            init() {

                this.frames = this.createLightFrames({ framesCount: 200, itemsCount: 10, itemFrameslengthClamps: [7, 10], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.fireplace.renderIndex+1)

        this.fireplace = this.addGo(new GO({
            position: new V2(154, 82),
            size: new V2(60,32),
            init() {
                this.frames = PP.createImage(ZershushCabinScene.models.fire)

                this.registerFramesDefaultTimer({originFrameChangeDelay:4});
            }
        }), layersData.fireplace.renderIndex+2)

        this.curtains = this.addGo(new GO({
            position: new V2(58.5,72),
            size: new V2(145,70),
            init() {
                this.frames = PP.createImage(ZershushCabinScene.models.curtains).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.5
                    ctx.drawImage(frame, 0 ,0)
                }))

                this.registerFramesDefaultTimer({originFrameChangeDelay:8});
            }
        }), layersData.ceiling_d.renderIndex + 1)
    }
}