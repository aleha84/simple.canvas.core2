class LighthouseScene extends Scene {
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
        let model = LighthouseScene.models.main;
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
        
        // this.bgOverlay = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
        //         hlp.setFillColor('rgba(0,0,0,0.5').dot(0,0)
        //     })
            
        // }), layersData.sky.renderIndex+1)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];

                let center = new V2(107,-25);
                let repeats = 8;
                let anglePerRepat = 360/repeats;
                let angleShiftChange = easing.fast({from: 0, to: anglePerRepat, steps: itemFrameslength, type: 'linear' });

                let radiusClamps = [5, 200];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let a = fast.r(getRandom(0.05, 0.4),2)
                    let r = getRandomGaussian(radiusClamps[0], radiusClamps[1]*2, 2.2);
                    let initialAngle = getRandomInt(0, 359);

                    let aValues = undefined;
                    let aStartFrame = undefined;
                    if(getRandomInt(0,1) == 0){

                        let len = getRandomInt(2,6)*10;
                        aStartFrame = getRandomInt(0, itemFrameslength - len);

                        let mul = getRandom(2,3);
                        let maxA = a*mul;
                        if(maxA > 1)
                            maxA = 1;

                        aValues = [
                            ...easing.fast({from: a, to: maxA, steps: len/2, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: maxA, to: a, steps: len/2, type: 'quad', method: 'inOut', round: 2})
                        ]
                    }

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let aValue = undefined;
                        if(aValues) {
                            if(f >= aStartFrame && f < aStartFrame + aValues.length){
                                aValue = aValues[f-aStartFrame]
                            }
                        }
                
                        frames[frameIndex] = {
                            aValue: aValue,
                            angleShift: angleShiftChange[f]
                        };
                    }
                
                    return {
                        r,
                        a,
                        initialAngle,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                for(let i = 0; i < repeats; i++){
                                    let p = center.add(V2.up.rotate(anglePerRepat*i + itemData.frames[f].angleShift).mul(itemData.r)).toInt()

                                    let a = itemData.a;
                                    if(itemData.frames[f].aValue){
                                        a = itemData.frames[f].aValue;
                                    }

                                    hlp.setFillColor(`rgba(255,255,255, ${a})`).dot(p)
                                }
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({ framesCount: 600, itemsCount: 200, itemFrameslength: 600, size: this.size});
                this.registerFramesDefaultTimer({});
            }
        }), layersData.sky.renderIndex+2)
    }
}