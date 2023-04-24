class CitySnowfallScene extends Scene {
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
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'citysnowfall',
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
        let model = CitySnowfallScene.models.main;
        let layersData = {};
        let exclude = [
            'palette'
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

        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClamps, xClamps, yClamps, color, pointsLengthClamps, angleClamps, 
            size, mask, maxA = 0.5, notRestrict = false, yValueCalculator
        }) {

            let flShift = 0;

            let frames = [];
            let sharedPP = PP.createNonDrawingInstance();
            
            let bottomLine = createLine(new V2(-size.x, yClamps[1]), new V2(size.x*2, yClamps[1]));
            let rgb = colors.colorTypeConverter({value: color, toType:'rgb'})

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps.map(x => x+ flShift));

                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let y = undefined;
                if(yValueCalculator) {
                    y = yValueCalculator();
                }
                else {
                    y = getRandomInt(yClamps[0], yClamps[1]-1);
                }

                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), y);
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                let linePoints = sharedPP.lineV2(point1, point2);
                let linePointsLength = getRandomInt(pointsLengthClamps);
                let linePointsIndices = easing.fast({ from: 0, to: linePointsLength, steps: totalFrames, type: 'linear', round: 0});
            
                let linePointsAValues = [
                    ... easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1}),
                    ... easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1}),
                ]

                let frames = [];

                let vector = new V2();
                // if(linePointsLength > 49) {
                //     vector = new V2(0,getRandom(0,0.2))
                // }

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let index = linePointsIndices[f];
                    let p = linePoints[index];
                    let a = linePointsAValues[f]
            
                    if(isNaN(a) || a == undefined) {
                        a = 0;
                    }

                    frames[frameIndex] = {
                        p, a,
                        v: vector.mul(f).toInt()
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
                            let {p, a, v} = itemData.frames[f];

                            
                                if(p && (notRestrict || isBetween(p.x, xClamps))) {
                                    hlp.setFillColor(colors.rgbToString({value: rgb, isObject: true, opacity: a})).dot(p.x + v.x, p.y + v.y);
                                }
                            
                        }
                        
                    }

                    if(mask) {
                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(mask, 0, 0)
                    }
                });
            }
            
            return frames;
        }

        this.bg1Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFallFrames({
                    framesCount: 300, itemsCount: 4000, itemFrameslengthClamps: [120,150], xClamps: [70, 125], yClamps: [-10, 140], color: '#c2caab', 
                    pointsLengthClamps: [3,6], angleClamps: [-30, 30], size: this.size, maxA: 0.5
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.far_b0.renderIndex-1)

        this.bg2Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFallFrames({
                    framesCount: 300, itemsCount: 800, itemFrameslengthClamps: [110,130], xClamps: [87, 107], yClamps: [80, 137], color: '#edf0dd', 
                    pointsLengthClamps: [5,8], angleClamps: [-30, 30], size: this.size, maxA: 0.3,
                    mask: PP.createImage(model, { renderOnly: ['far_b0'] })
                })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.far_b0.renderIndex+1)

        let createyValueCalculator = function(middle, delta) {
            return () => {
                let y = fast.r(getRandomGaussian(middle-delta, middle+delta))
                if(y > middle) {
                    y = middle - (y-middle);
                }

                return y;
            }
        }

        this.bg3Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(model, { renderOnly: ['far_b1'] });

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [110,130], xClamps: [80, 107], yClamps: [112, 183], color: '#c2caab', 
                            pointsLengthClamps: [6,10], angleClamps: [-30, 30], size: this.size, maxA: 0.3,
                            mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        // let middle = 183;
                        // let yClamps = [middle-100, middle+100];
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [110,130], xClamps: [80, 107], yClamps: [112, 183], color: '#c2caab', 
                            pointsLengthClamps: [6,10], angleClamps: [-30, 30], size: this.size, maxA: 0.4,
                            mask, yValueCalculator: createyValueCalculator(183, 100)
                            // () => {
                            //     let y = fast.r(getRandomGaussian(yClamps[0], yClamps[1]))
                            //     if(y > middle) {
                            //         y = middle - (y-middle);
                            //     }

                            //     return y;
                            // }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.far_b1.renderIndex+1)

        this.mid1Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // this.frames = createSnowFallFrames({
                //     framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [35, 50], xClamps: [74, 122], yClamps: [-10, 182], color: '#5d6e4d', 
                //     pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size
                // })

                // this.registerFramesDefaultTimer({});
                let mask = PP.createImage(model, { renderOnly: ['far_b2'] })

                let itemFrameslengthClamps = [100,120]

                ////////////////// left ////////////////
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 400, itemFrameslengthClamps, xClamps: [74,81], yClamps: [59, 185], color: '#96a478', 
                            pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size,
                            mask: mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 200, itemFrameslengthClamps, xClamps: [74,81], yClamps: [59, 185], color: '#96a478', 
                            pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size, maxA: 0.3,
                            mask: mask, yValueCalculator: createyValueCalculator(184, 150)
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                /////////////

                /////////////// right ////////////////////
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [102,122], yClamps: [40, 185], color: '#96a478', 
                            pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size,
                            mask: mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps, xClamps: [102,122], yClamps: [40, 185], color: '#96a478', 
                            pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size, maxA: 0.3,
                            mask: mask, yValueCalculator: createyValueCalculator(184, 150)
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                ///////////////  ////////////////////

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps: itemFrameslengthClamps, xClamps: [80,107], yClamps: [80, 185], color: '#71815a', 
                            pointsLengthClamps: [8,12], angleClamps: [-35, 35], size: this.size, maxA: 0.4,
                            mask: PP.createImage(model, { renderOnly: ['far_b0', 'far_b1'] })
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.far_b2.renderIndex+1)

        let right_b_mask = PP.createImage(model, { renderOnly: ['right_b'] });
        let left_b_mask = PP.createImage(model, { renderOnly: ['left_b'] });

        this.mid2Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let itemFrameslengthClamps = [90,110]

                ////////////////// right //////////////////
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [122,141], yClamps: [-10, 186], color: '#485b3f', 
                            pointsLengthClamps: [10,15], angleClamps: [-40, 40], size: this.size,
                            mask: right_b_mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps, xClamps: [122,141], yClamps: [-10, 186], color: '#485b3f', 
                            pointsLengthClamps: [10,15], angleClamps: [-40, 40], size: this.size,
                            mask: right_b_mask, yValueCalculator: createyValueCalculator(184, 200)
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                //////////////////////////////

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [65,75], yClamps: [-10, 186], color: '#485b3f', 
                            pointsLengthClamps: [10,15], angleClamps: [-40, 40], size: this.size,
                            mask: left_b_mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                })) 

                ////////////// center ////////////
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [75, 121], yClamps: [-10, 185], color: '#485b3f', 
                            pointsLengthClamps: [10,15], angleClamps: [-40, 40], size: this.size, maxA: 0.3
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                })) 

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps, xClamps: [75, 121], yClamps: [-10, 185], color: '#485b3f', 
                            pointsLengthClamps: [10,15], angleClamps: [-40, 40], size: this.size, maxA: 0.3,
                            yValueCalculator: createyValueCalculator(188, 100)
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                })) 

                /////////////////////////
            }
        }), layersData.right_b.renderIndex+1)

        this.mid3Snowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                let itemFrameslengthClamps = [80,100]
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 2000, itemFrameslengthClamps, xClamps: [142,201], yClamps: [-10, 188], color: '#1f3423', 
                            pointsLengthClamps: [14,22], angleClamps: [-45, 45], size: this.size, maxA: 0.5
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 2000, itemFrameslengthClamps, xClamps: [15,60], yClamps: [-10, 188], color: '#1f3423', 
                            pointsLengthClamps: [14,22], angleClamps: [-45, 45], size: this.size, maxA: 0.5, notRestrict: true
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                /////////////////// center //////////////////
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps, xClamps: [75,126], yClamps: [-10, 188], color: '#1f3423', 
                            pointsLengthClamps: [14,22], angleClamps: [-45, 45], size: this.size, maxA: 0.4, notRestrict: true
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 200, itemFrameslengthClamps, xClamps: [75,126], yClamps: [-10, 192], color: '#1f3423', 
                            pointsLengthClamps: [14,22], angleClamps: [-45, 45], size: this.size, maxA: 0.4, notRestrict: true,
                            yValueCalculator: createyValueCalculator(190, 100)
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                ////////////////////////////////
                
            }
        }), layersData.cars_far.renderIndex+1)

        this.frontalSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                

                let itemFrameslengthClamps = [50, 70]

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [137,201], yClamps: [-1, 200], color: '#1f3423', 
                            pointsLengthClamps: [18,26], angleClamps: [-45, 45], size: this.size, maxA: 1,
                            mask: right_b_mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 1000, itemFrameslengthClamps, xClamps: [-1,70], yClamps: [-1, 200], color: '#1f3423', 
                            pointsLengthClamps: [18,26], angleClamps: [-45, 45], size: this.size, maxA: 1,
                            mask: left_b_mask
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 100, itemFrameslengthClamps: [100, 120], xClamps: [-1,201], yClamps: [-1, 200], color: '#485b3f', 
                            pointsLengthClamps: [50,70], angleClamps: [-45, 45], size: this.size, maxA: 1,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                let mask1 = PP.createImage(model, { renderOnly: ['road', 'cars_far', 'cars_close'] })
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps: [80,100], xClamps: [-1,201], yClamps: [175, 200], color: '#71815a',//'#96a478' 
                            pointsLengthClamps: [14,22], angleClamps: [-45, 45], size: this.size, maxA: 0.5,
                            mask: mask1
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        
                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 500, itemFrameslengthClamps, xClamps: [-1,201], yClamps: [175, 200], color: '#71815a',//'#96a478' 
                            pointsLengthClamps: [18,26], angleClamps: [-45, 45], size: this.size, maxA: 1,
                            mask: mask1
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.cars_close.renderIndex+1)

        this.carsFlow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createMovmentFrames({framesCount, itemsCount, itemFrameslengthClamp, size}) {
                let frames = [];
                
                let xClamps = [78, 105];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamp);
                
                    let frames = [];
                    let fromLeft = getRandomBool();
                    let xValues = easing.fast({from: fromLeft ? xClamps[0] : xClamps[1], to: fromLeft ? xClamps[1]: xClamps[0], steps: totalFrames, type: 'linear', round: 0});
                    let height = 3
                    let width = getRandomInt(4,5);
                    
                    if(i%2==0) {
                        width = 3;
                        height = 2;
                    }
                    // else {
                    //     width = getRandomInt(4,5);
                    //     height = 3;
                    // }
                    // if(width == 3) {
                    //     height = 2
                    // }

                    let c = '#849369'//(getRandomBool() ? '#71815a' : '#849369')

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            x: xValues[f]
                        };
                    }
                
                    return {
                        width,height,
                        c,
                        fromLeft,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            let {width,height, fromLeft, c} = itemData;

                            if(itemData.frames[f]){
                                hlp.setFillColor(c).rect(itemData.frames[f].x, 184 - height, width-1, height)
                                if(fromLeft) {
                                    hlp.rect(itemData.frames[f].x, 184 - (height-1), width, height-1)
                                }
                                else {
                                    hlp.rect(itemData.frames[f].x-1, 184 - (height-1), width, height-1)
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                
                this.frames = this.createMovmentFrames({ framesCount: 300, itemsCount: 5, itemFrameslengthClamp: [150, 220], size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.far_b2.renderIndex-1)

        /*
        this.t = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let yClamps = [0, 200];
                    let middle = yClamps[0] + (yClamps[1]-yClamps[0])/2;
                    hlp.setFillColor('red')
                    for(let i = 0;i<500;i++) {
                        let x = getRandomInt(50,100);
                        let y = fast.r(getRandomGaussian(0, 200))
                        if(y > middle) {
                            y = middle - (y-middle);
                        }


                        hlp.dot(x,y);
                    }
                })
            }
        }), layersData.cars_close.renderIndex+10)
        */
    }
}