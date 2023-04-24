class Station2Scene extends Scene {
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
                fileNamePrefix: 'station2',
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
        let model = Station2Scene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'car_lights_zone', 'station_p', 'station_left_p', 'bg_p', 'ground_p'
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

        let createSnowframesFrames2 = function({framesCount, itemsCount, gradientDots, yClamps, xClamps, lengthClamps, angleClamps, itemFrameslengthClamps, 
            size, maxA, minA = 0, aMul = 1, createAValues = false, excludeImg, colorPrefix = 'rgba(180,227,233,' }) {
            let frames = [];
            //let colorPrefix = 'rgba(180,227,233,';

            let sharedPP = PP.createNonDrawingInstance();

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));

                let _maxA = isArray(maxA) ? fast.r(getRandom(maxA[0], maxA[1]),2) : maxA
                // if(getRandomInt(0, 10) == 0) {
                //     x = getRandomInt(122,127);
                //     startY = getRandomInt(60,61)
                // }

                let length = getRandomInt(lengthClamps);
                let angle = fast.r(getRandom(angleClamps[0], angleClamps[1]))
                let direction = V2.down.rotate(angle);
                let linePoints = sharedPP.lineV2(p0, p0.add(direction.mul(length)).toInt());

                let linePointsIndicesValues = easing.fast({ from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0})

                let aValues = undefined;
                if(createAValues) {
                    aValues = [
                        ...easing.fast({from: 0, to: _maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({from: _maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                    ]
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndicesValues[f]]
                    let a = createAValues ? aValues[f]: _maxA;
                    if(a == undefined)
                        a = 0

                    if(gradientDots) {
                        if(gradientDots[p.y] && gradientDots[p.y][p.x]) 
                            a *= fast.r(gradientDots[p.y][p.x].maxValue, 2);
                        else {
                            a = 0;
                        }
                    }

                    a*=aMul;

                    if(a < minA) {
                        a = 0;
                    }
            
                    frames[frameIndex] = {
                        p,
                        a
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
                            hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')').dot(itemData.frames[f].p)
                        }
                        
                    }

                    if(excludeImg) {
                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.drawImage(excludeImg, 0,0);
                    }
                });
            }
            
            return frames;
        }

        let createSnowframesFrames = function({framesCount, itemsCount, gradientDots, yClamps, xClamps, heightClamps, itemFrameslengthClamps, size, maxA, createAValues = false}) {
            let frames = [];
            let colorPrefix = 'rgba(168,222,243,';

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let x = getRandomInt(xClamps);
                let startY = getRandomInt(yClamps);

                // if(getRandomInt(0, 10) == 0) {
                //     x = getRandomInt(122,127);
                //     startY = getRandomInt(60,61)
                // }

                let height = getRandomInt(heightClamps);
                let yValues = easing.fast({from: startY, to: startY + height, steps: totalFrames, type: 'linear', round: 0})
                let aValues = undefined;
                if(createAValues) {
                    aValues = [
                        ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                    ]
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let y = yValues[f];
                    let a = createAValues ? aValues[f]: maxA;
                    if(a == undefined)
                        a = 0

                    if(gradientDots[y] && gradientDots[y][x]) 
                        a *= fast.r(gradientDots[y][x].maxValue, 2);
                    else {
                        a = 0;
                    }
            
                    frames[frameIndex] = {
                        y,
                        a
                    };
                }
            
                return {
                    x,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')').dot(itemData.x, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.sfFar4 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(1, 92), radius: new V2(8,14), gradientOrigin: new V2(1, 90), 
                    angle: -10, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 100, yClamps: [80,85], xClamps: [-5,5], lengthClamps: [30, 40], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: [0.5,0.7], minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-10, 10], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                //   this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                //                     hlp.setFillColor(`rgba(255,0,0,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y) 
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), layersData.station_left.renderIndex+5)

        this.sfFar3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(9, 100), radius: new V2(8,12), gradientOrigin: new V2(9, 96), 
                    angle: -10, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 60, yClamps: [85,90], xClamps: [4,13], lengthClamps: [20, 30], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: [0.5,0.7], minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-10, 10], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.station_left.renderIndex+3)

        let farMaxA_1 = [0.3, 0.5];
        this.sfFar1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(49, 104), radius: new V2(8,15), gradientOrigin: new V2(50, 96), 
                    angle: 10, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 100, yClamps: [85,90], xClamps: [45,55], lengthClamps: [20, 30], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: farMaxA_1, minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-10, 10], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.station_right.renderIndex+3)

        
        this.sfFar2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(53, 100), radius: new V2(8,15), gradientOrigin: new V2(54, 94), 
                    angle: 10, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 100, yClamps: [85,90], xClamps: [50,60], lengthClamps: [20, 30], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: farMaxA_1, minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-10, 10], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.station_right.renderIndex+3)

        /// close /////
        //return;
        this.sfClose2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(85, 89), radius: new V2(20,30), gradientOrigin: new V2(91, 75), 
                    angle: 20, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 300, yClamps: [65,70], xClamps: [60,100], lengthClamps: [50, 70], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: [0.5,0.8], minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-15, 15], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                //   this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                //                     hlp.setFillColor(`rgba(255,0,0,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y) 
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), layersData.station_right.renderIndex+4)


        this.sfClose1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(109, 96), radius: new V2(30,50), gradientOrigin: new V2(121, 64), 
                    angle: 30, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })


                this.behind = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 200, yClamps: [50,55], xClamps: [100,150], lengthClamps: [50, 70], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: [0.7,1], minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-20, 20], gradientDots,
                            excludeImg: createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('red').rect(114,80, 137-114, 89-80)
                            })
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.notification = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let ousImg = PP.createImage(Station2Scene.models.notification);
                        let ousSize = Station2Scene.models.notification.general.originalSize;
                        this.frames = [];
                        let ousCropSize = new V2(19,3);

                        let totalFrames = 600;

                        let xShift = easing.fast({from: 0, to: ousSize.x, steps: totalFrames, type: 'linear', round: 0})

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('#181b24').rect(116,85, ousCropSize.x, ousCropSize.y);
            
                                ctx.drawImage(createCanvas(ousCropSize, (ctx, size, hlp) => {
                                    ctx.drawImage(ousImg, -xShift[f], 0)
                                    ctx.drawImage(ousImg, ousSize.x-xShift[f], 0)
                                }), 116,85)

                                //ctx.globalAlpha = 0.5
                                //hlp.setFillColor('#181b24').rect(116,85, ousCropSize.x, ousCropSize.y);
                            })
                        }

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.inFrontOf = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 200, yClamps: [50,55], xClamps: [100,150], lengthClamps: [50, 70], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: [0.7,1], minA: 0.025, aMul: 2, createAValues: false, angleClamps: [-20, 20], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.station_right.renderIndex+5)

        this.sfClose3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(193, 63), radius: new V2(30,50), gradientOrigin: new V2(204, 45), 
                    angle: 23, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 300, yClamps: [35,40], xClamps: [180,210], lengthClamps: [50, 70], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: 1, minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-25, 25], gradientDots,
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                //   this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                //                     hlp.setFillColor(`rgba(255,0,0,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y) 
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), layersData.station_right.renderIndex+6)

        this.sfBridge = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(116, 1), radius: new V2(40,50), gradientOrigin: new V2(116, -20), 
                    angle: 0, easingType: 'expo',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 300, yClamps: [-30,-25], xClamps: [90,140], lengthClamps: [40, 50], itemFrameslengthClamps: [170, 200],
                            size: this.size, maxA: 1, minA: 0.025,aMul: 2, createAValues: false, angleClamps: [-15, 15], gradientDots, colorPrefix: 'rgba(226,152,133,'
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                //   this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                //                     hlp.setFillColor(`rgba(255,0,0,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y) 
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), layersData.bridge.renderIndex-1)

        this.carLights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(model, { renderOnly: ['car_lights_zone'], forceVisibility: { car_lights_zone: { visible: true } } })

                let lightsImg = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(255,255,255, 0.05').rect(50,50,50,100)
                    hlp.setFillColor('rgba(255,255,255, 0.05').rect(60,50,50,100)
                    hlp.setFillColor('rgba(255,255,255, 0.05').rect(70,50,50,100)

                    // let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    //     center: new V2(100,100), radius: new V2(70,20), gradientOrigin: new V2(50, 100), 
                    //     angle: 3, easingType: 'cubic',
                    //     setter: (dot, aValue) => {
                    //         if(!dot.values){
                    //             dot.values = [];
                    //             dot.maxValue = aValue;
                    //         }
            
                    //         if(aValue > dot.maxValue)
                    //             dot.maxValue = aValue;
            
                    //         dot.values.push(aValue);
                    //     } 
                    // })

                    //     for(let y = 0; y < gradientDots.length; y++) {
                    //     if(gradientDots[y]) {
                    //         for(let x = 0; x < gradientDots[y].length; x++) {
                    //             if(gradientDots[y][x]) {
                    //                 hlp.setFillColor(`rgba(255,255,255,${fast.r(gradientDots[y][x].maxValue,1)})`).dot(x,y) 
                    //                 }
                    //             }
                    //         }
                    //     }
                })

                this.img = lightsImg;
                
                let totalFrames = 600;
                this.frames = new Array(totalFrames).fill(undefined);
                let visibleFrames = 60;
                let visibleStartFrames = 100;

                let animationLine = PP.createNonDrawingInstance().lineV2(new V2(300,49),new V2(-100, 40));
                let indicesValues = easing.fast({from: 0, to: animationLine.length-1, steps: visibleFrames, type: 'linear', round: 0});


                for(let f = 0; f < visibleFrames; f++) {
                    let p = animationLine[indicesValues[f]];
                    let frame = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 0.5
                        
                        ctx.drawImage(lightsImg, -100 + p.x, -95 + p.y)

                        ctx.globalAlpha = 1;
                        ctx.globalCompositeOperation = 'destination-in';

                        ctx.drawImage(mask, 0, 0)
                    })
                    this.frames[visibleStartFrames + f] = frame
                }

                // for(let f = 0; f < visibleFrames; f++) {
                //     let p = animationLine[indicesValues[visibleFrames-f-1]];
                //     this.frames[300 + f] = createCanvas(this.size, (ctx, size, hlp) => {
                //         ctx.globalAlpha = 0.5
                        
                //         ctx.drawImage(lightsRedImg, -100 + p.x, -95 + p.y)

                //         ctx.globalAlpha = 1;
                //         ctx.globalCompositeOperation = 'destination-in';

                //         ctx.drawImage(mask, 0, 0)
                //     })
                // }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bridge.renderIndex+1)

        this.common = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowframesFrames2({
                            framesCount: 300, itemsCount: 50, yClamps: [-20,this.size.y-10], xClamps: [-10,210], lengthClamps: [30, 60], itemFrameslengthClamps: [50, 80],
                            size: this.size, maxA: [0.25,0.5], minA: 0.025, aMul: 1, createAValues: true, angleClamps: [-30, 30],
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                
            }
        }), layersData.station_right.renderIndex+10)

        this.station_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [40,60], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'station_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station_right.renderIndex+1)

        this.station_left_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [60,80], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'station_left_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station_left.renderIndex+1)

        this.bg_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [60,90], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bg_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station_left.renderIndex+1)

        this.ground_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [60,90], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.ground.renderIndex+1)
    }
}