class CarSnowScene extends Scene {
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
        let model = CarSnowScene.models.main;
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

        this.createSnowFrames = function({framesCount, itemsCount, itemFrameslength, size, xClamps, yClamps, color, angleClamps, center, radius}) {
            let frames = [];
            let sharedPP = undefined;
            let bottomLine = createLine(new V2(-size.x, size.y), new V2(size.x*2, size.y));
            let rgb = colors.colorTypeConverter({value: color, toType:'rgb'})

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                let linePoints = sharedPP.lineV2(point1, point2);
                let linePointsIndices = easing.fast({ from: 0, to: linePoints.length, steps: itemFrameslength, type: 'linear', round: 0});

                let aValues = easing.fast({from: 1, to: 0, steps: radius, type: 'quad', method: 'in', round: 2});

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndices[f]];
                    let dist = fast.r(new V2(p).distance(center));
                    let a = dist >= radius ? 0 : aValues[dist]
            
                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            rgb.a = itemData.frames[f].a;
                            hlp.setFillColor(colors.rgbToString({value: rgb, isObject: true})).dot(itemData.frames[f].p);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.frontalSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 200, itemFrameslength: 150, size: this.size, 
                    xClamps: [80, 130], yClamps: [90, 110], angleClamps: [15,20], color: '#f4160e',
                    center: new V2(105,125), radius: 25
                    });

                this.addChild(new GO({
                    position: new V2(-5, 10),
                    size: this.size,
                    frames: frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(-55, 10),
                    size: this.size,
                    frames: frames,
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))
            }
        }), layersData.car.renderIndex+1)
    }
}