class BaechInterviewScene extends Scene {
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
        let model = BaechInterviewScene.models.main;
        let layersData = {};
        let exclude = [
            'beach_people'
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

        this.palm2 = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(90,0)),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    // ctx.translate(size.x, 0);
                    // ctx.scale(-1,1);

                    ctx.drawImage(PP.createImage(model, { renderOnly: ['palm1'] }), 0,0)
                })
            }
        }), layersData.palm1.renderIndex)

        this.seaP = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let aToy = easing.fast({from: 0.1, to: 0.3, steps: 3, type: 'linear', round: 1})

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(0, size.x)
                    let y = getRandomInt(84,86);
                    let a = aToy[(y-84)];

                    let aValues = [
                        ...easing.fast({ from: 0, to: a, steps: totalFrames/2, type: 'quad', method: 'inOut' }),
                        ...easing.fast({ from: a, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut' })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f]
                        };
                    }
                
                    return {
                        x,y,a,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.x, itemData.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 300, itemFrameslength: 90, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.beach.renderIndex+1)

        this.beach_people = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBeachPeopleFrames({framesCount, itemFrameslength, size}) {
                let frames = [];
                
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'beach_people'));

                let itemsData = pd.map((data) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslength);
                
                    let rgb = colors.colorTypeConverter({ value: data.color, fromType: 'hex', toType: 'rgb' });

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            rgba: colors.rgbToString({ value: rgb, isObject: true, opacity: 0.5 }),
                            changeOpacity: true
                        };
                    }
                
                    return {
                        data,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.frames[f].rgba).dot(itemData.data.point)
                            }
                            else {
                                hlp.setFillColor(itemData.data.color).dot(itemData.data.point)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createBeachPeopleFrames({ framesCount: 300, itemFrameslength: [50, 80], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.beach_people.renderIndex);

        this.palmsAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let palmAnimationModel = BaechInterviewScene.models.palmAnimations;

                let aniParams = [
                    { layerName: 'l1' },
                    { layerName: 'l2' },
                    { layerName: 'l3' },
                    { layerName: 'l4' },
                    { layerName: 'l5' },
                    { layerName: 'l6' },
                    { layerName: 'l7' },
                    { layerName: 'l8' },
                    { layerName: 'l9' }
                ]

                let totalFrames = 150;
                let framesFromTo = [0, 3]
                let totalAnimationFrames = 140;
                let animationStartFrameClamps = [0, 100]

                for(let i = 0; i < 2; i++)
                aniParams.map(p => this.addChild(new GO({
                    position: new V2(i == 1 ? 90 : 0, 0),
                    size: this.size,
                    frames: PP.createImage(palmAnimationModel, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)
                        let animationStartFrame = getRandomInt(animationStartFrameClamps) // p.animationStartFrame + aniStart;

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: framesFromTo[0], to: framesFromTo[1], steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0}), 
                                ...easing.fast({ from: framesFromTo[1], to: framesFromTo[0], steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }               

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));

            }
        }), layersData.palm1.renderIndex+1)
    }
}