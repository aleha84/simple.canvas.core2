class PalmsMountainsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(150,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'palms',
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
        let model = PalmsMountainsScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'clouds'
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

        let createTreesMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size, 
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
                    let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
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
        }

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let cloudsImg = PP.createImage(model, {renderOnly: ['clouds']  } )
                let totalFrames = 500;

                let xValues = easing.fast({ 
                    from: 0, 
                    to: fast.f(this.size.x/4), 
                    //to: 0,
                    steps: totalFrames, 
                    type: 'linear', 
                    round: 0 })

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let li = 0; li < 5; li++) {
                            ctx.drawImage(cloudsImg, fast.f(li*this.size.x/4) - xValues[f], 0)
                        }
                        
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.clouds.renderIndex)

        this.palmsAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let data = [
                    {model: PalmsMountainsScene.models.palm1Frames },
                    {model: PalmsMountainsScene.models.palm2Frames },
                    {model: PalmsMountainsScene.models.palm3Frames }
                ]


                this.palms = data.map((d,i) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = createTreesMovementFrames({
                            framesCount: 250, startFramesClamps: [0, 90], itemFrameslength: 100, type: 'linear', method: 'base',
                            animationsModel: d.model,
                            size: this.size,
                            additional: {
                                framesShift: 30,
                                frameslength: 100,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 1, steps: 50, type: 'linear', round: 0 }),
                                    ...easing.fast({from: 1, to: 0, steps: 50, type: 'linear', round: 0 })
                                ]
                            },
                        })

                        this.registerFramesDefaultTimer({
                            startFrameIndex: i*60
                        });
                    }
                }))) 
            }
        }), layersData.palm_03.renderIndex+1)

        this.bushesAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = [ '#510c47', '#550d3f', '#200d26'] //'#59125a',
                let pixelsData = getPixels(PP.createImage(model, { renderOnly: ['bushes'] }), this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 1) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.add(new V2(getRandomInt(-1,1),getRandomInt(-1,1))), color } 
                        }
                    }
                });

                this.frames = animationHelpers.createMovementFrames({ framesCount: 250, pointsData: pData, itemFrameslength: 30, size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bushes.renderIndex+1)
    }
}