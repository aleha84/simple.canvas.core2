class CityRunScene extends Scene {
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
                size: new V2(200,112).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'cityRun',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -20)),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(CityRunScene.models.cityLayers, { renderOnly: ['bg'] })
            }
        }), 1)

        this.cityView = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -20)),
            size: this.viewport.clone(),
            createWaterFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                let pointsData = animationHelpers.extractPointData(CityRunScene.models.cityLayers.main.layers.find(l => l.name == 'water_p'))
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                    let pd = pointsData[getRandomInt(0, pointsData.length-1)]
                
                    let targetWidth = getRandomInt(3,6);
                    let widthValues = [
                        ...easing.fast({from: 0, to: targetWidth, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({from: targetWidth, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            w: widthValues[f]
                        };
                    }
                
                    return {
                        pd,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let width = itemData.frames[f].w;
                                if(width > 0){
                                    let xShift = fast.r(width/2);
                                    let x = fast.r(itemData.pd.point.x-xShift)
                                    hlp.setFillColor(itemData.pd.color).rect(x, itemData.pd.point.y, width, 1)
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let totalFrames = 600;
                let layersCount = 3;

                let waterFrames = this.createWaterFrames({ framesCount: totalFrames, itemsCount: 3000, itemFrameslengthClamps: [100,150], size: this.size })

                let l2_p_frames = animationHelpers.createMovementFrames({
                    framesCount: totalFrames, itemFrameslength: [50,100], 
                    pointsData: animationHelpers.extractPointData(CityRunScene.models.cityLayers.main.layers.find(l => l.name == 'city_p')), 
                    size: this.size 
                })

                let lImgs = new Array(layersCount).fill().map((el, i) => PP.createImage(CityRunScene.models.cityLayers, { renderOnly: ['l' + i], forceVisibility: {['l' + i]: {visible: true}} }))
                let repeats = new Array(layersCount).fill().map((el, i) => Math.pow(2, layersCount - (i+1)))
                let xValues = new Array(layersCount).fill().map((el, i) => 
                    easing.fast({ 
                        from: 0, 
                        to: fast.f(this.size.x/repeats[i]), 
                        //to: 0,
                        steps: totalFrames, 
                        type: 'linear', 
                        round: 0 })
                )

                this.frames = [];

                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let l=0;l<layersCount;l++) {
                            for(let li = -1; li < repeats[l]; li++) {
                                ctx.drawImage(lImgs[l], -fast.f(li*this.size.x/repeats[l]) - xValues[l][f], 0)

                                if(l == 2) {
                                    ctx.drawImage(waterFrames[f], -fast.f(li*this.size.x/repeats[l]) - xValues[l][f], 0)
                                    ctx.drawImage(l2_p_frames[f], -fast.f(li*this.size.x/repeats[l]) - xValues[l][f], 0)
                                }
                            }
                        }
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 5)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 10)),
            size: this.viewport.clone(),
            init() {
                let roadImg = PP.createImage(CityRunScene.models.road, { exclude: ['bg'] })
                let totalFrames = 300;
                let xValues = easing.fast({from: 0, to: 200, steps: totalFrames, type: 'linear', round: 0});

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(roadImg, -xValues[f], 0)
                        ctx.drawImage(roadImg, -xValues[f] + size.x, 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 9)

        this.runningMan = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(20, 14)),
            size: new V2(152,80),
            init() {
                //this.frames = PP.createImage(CityRunScene.models.man, { exclude: ['bg'] })
                let totalFrames = 100;

                this.frames = [];

                // let frames_withoutShoes = PP.createImage(CityRunScene.models.man, { exclude: ['bg', 'shoes'] })
                // let shoes = PP.createImage(CityRunScene.models.man, { renderOnly: ['shoes'] })

                let shoesColorsSets = [
                    {c1: '#161714', c2: '#1C9AC9', c1_dark: '#10110f', c2_dark: '#157397'},
                    // {c1: '#D2CCC6', c2: '#64AC06', c1_dark: '#9d9994', c2_dark: '#4b8104'},
                    // {c1: '#1C58A9', c2: '#C34E20', c1_dark: '#15427f', c2_dark: '#923a18'},
                    // {c1: '#D5D0CD', c2: '#00009E', c1_dark: '#a09c9a', c2_dark: '#000076'},
                    // {c1: '#C34E20', c2: '#64AC06', c1_dark: '#923a18', c2_dark: '#4b8104'},
                    // {c1: '#1C9AC9', c2: '#EBA020', c1_dark: '#157397', c2_dark: '#b07818'},
                ]

                let framesSet = [];

                for(let i = 0; i < shoesColorsSets.length; i++) {
                    let {c1, c2, c1_dark, c2_dark} = shoesColorsSets[i];

                    CityRunScene.models.man.main.forEach(f => {
                        let shoesLayer = f.layers.find(l => l.name == 'shoes');
                        shoesLayer.groups[3].strokeColor = c1;
                        shoesLayer.groups[3].fillColor = c1;
                        shoesLayer.groups[2].strokeColor = c2;
                        shoesLayer.groups[2].fillColor = c2;
                        shoesLayer.groups[4].strokeColor = c1_dark;
                        shoesLayer.groups[4].fillColor = c1_dark;
                        shoesLayer.groups[5].strokeColor = c2_dark;
                        shoesLayer.groups[5].fillColor = c2_dark;
                    })

                    framesSet[i] = PP.createImage(CityRunScene.models.man, { exclude: ['bg'] })
                }

                let framesSetIndex = 0;
                this.frames = framesSet[framesSetIndex];
                let frameIndexValues = easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', round: 0});

                this.currentFrame = 0;
                this.img = this.frames[frameIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;

                        framesSetIndex++;
                        if(framesSetIndex == framesSet.length) {
                            framesSetIndex = 0;
                        }

                        this.frames = framesSet[framesSetIndex];
                    }

                    this.img = this.frames[frameIndexValues[this.currentFrame]];
                })
            }
        }), 10)
    }
}