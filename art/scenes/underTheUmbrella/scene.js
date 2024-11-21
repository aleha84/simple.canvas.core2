class UnderTheUmbrellaScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(130,200).mul(5),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'underTheUmbrella',
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
        let model = UnderTheUmbrellaScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let blackColorPrefix = 'rgba(0,0,0,';
        let whiteColorPrefix2 = 'rgba(228,213,194,';
        let appSharedPP = PP.createNonDrawingInstance();

        let createGradient = ({hlp, aValueMul, center, radius, gradientOrigin, size, colorPrefix, easingType = 'quad', easingMethod = 'out', angle = 0}) => {
            let gradientDots = colors.createRadialGradient({ size: size.clone(), 
                center, radius, gradientOrigin, angle, easingType, easingMethod,
                setter: (dot, aValue) => {
                    aValue*=aValueMul;

                    if(!dot.values){
                        dot.values = [];
                        dot.maxValue = aValue;
                    }
    
                    if(aValue > dot.maxValue)
                        dot.maxValue = aValue;
    
                    dot.values.push(aValue);
                } 
            })

            for(let y = 0; y < gradientDots.length; y++) {
                if(gradientDots[y]) {
                    for(let x = 0; x < gradientDots[y].length; x++) {
                        if(gradientDots[y][x]) {
                            hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue/1,5)})`).dot(x,y) 
                        }
                    }
                }
            }
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, {renderOnly: ['bg']}),
            init() {
                //
            }
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground'] }),
            init() {
                this.grass_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: [50, 60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'grass_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.road_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: [10, 40], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.left_part = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['left_part'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'left_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.right_part = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['right_part'] }),
            init() {
                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSmallSplashFrames({framesCount, itemsCount, xClamps, yClamps, aValues = { yClamps, valuesClamps }, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
                        let mask = PP.createImage(model, { renderOnly: ['road_splash_zone'], forceVisibility: { road_splash_zone: { visible: true } } })

                        let aValuesToHeight = easing.fast({from: aValues.valuesClamps[0], to: aValues.valuesClamps[1], steps: aValues.yClamps[1] - aValues.yClamps[0], type: 'linear', round: 2});

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let p = new V2(getRandomInt(xClamps), getRandomInt((yClamps)));

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                frames,
                                p,
                                a: aValuesToHeight[p.y - aValues.yClamps[0]]
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(whiteColorPrefix2 + itemData.a +')').rect(itemData.p.x, itemData.p.y, 1, 1)
                                    }
                                }

                                if(mask) {
                                    ctx.globalCompositeOperation = 'destination-in'
                                    ctx.drawImage(mask, 0, 0)
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSmallSplashFrames({ framesCount: 120, itemsCount: 2000, xClamps: [0, this.size.x], yClamps: [110, this.size.y],
                        aValues: { yClamps: [123, this.size.y], valuesClamps: [0.05, 0.25] }, itemFrameslengthClamps: [5,15], size: this.size  })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)

        this.lamps = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['lamps'] }),
            init() {
                this.right_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'right_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: [20,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 9)

        let darkColorPrefix = 'rgba(57,54,49,'
        let midColorPrefix = 'rgba(138,132,106,'
        let brightColorPrefix = 'rgba(231,223,205,'
        let closeLampsMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let easingType = 'expo'
            let easingMethod = 'out'
            let rMul = 2
            //createGradient({hlp, aValueMul: 1, center: new V2(58,18), radius: new V2(60,70), gradientOrigin: new V2(58,8), angle: 20, size: size, colorPrefix: darkColorPrefix});
            createGradient({hlp,easingType, easingMethod, aValueMul: 1, center: new V2(58,18), radius: new V2(40,50).mul(rMul), gradientOrigin: new V2(58,8), angle: 20, size: size, colorPrefix: midColorPrefix});
            createGradient({hlp,easingType, easingMethod, aValueMul: 1, center: new V2(58,18), radius: new V2(15,25).mul(rMul), gradientOrigin: new V2(58,8), angle: 20, size: size, colorPrefix: brightColorPrefix});

            //createGradient({hlp,easingType, easingMethod, aValueMul: 1, center: new V2(119,18), radius: new V2(60,70).mul(rMul), gradientOrigin: new V2(119,8), angle: -20, size: size, colorPrefix: darkColorPrefix});
            createGradient({hlp,easingType, easingMethod, aValueMul: 1, center: new V2(119,18), radius: new V2(40,50).mul(rMul), gradientOrigin: new V2(119,8), angle: -20, size: size, colorPrefix: midColorPrefix});
            createGradient({hlp,easingType, easingMethod, aValueMul: 1, center: new V2(119,18), radius: new V2(15,25).mul(rMul), gradientOrigin: new V2(119,8), angle: -20, size: size, colorPrefix: brightColorPrefix});
        })
        
        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let createRainFrames = function({
                    angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
                    framesCount, itemsCount, itemFrameslengthClamps, size}) {
                    let frames = [];
                    
                    //let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}
                    speedClapms = speedClapms.map(v => fast.r(v*0.5))

                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);
                    
                        //let aValue = fast.r(getRandom(aClamps[0], aClamps[1]), 3);
                        let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                        let p0 = new V2(getRandomInt(xClamps),getRandomInt(upperYClamps));
                        let angle = getRandom(angleClamps[0], angleClamps[1])
                        //let p1 = raySegmentIntersectionVector2(p0, V2.down.rotate(angle), bottomLine).toInt();
                        let len = getRandomInt(lengthClamps);

                        let frames = [];
                        let current = p0;

                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            let p0 = current.clone();
                            let p1 = current.add(V2.down.rotate(angle).mul(len)).toInt();
                    
                            frames[frameIndex] = {
                                p0,
                                p1
                            };

                            current = p0.add(V2.down.rotate(angle).mul(speed)).toInt()
                            if(current.y > lowerY)
                                break;
                        }
                    
                        return {
                            frames,
                            
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            pp.setFillColor(whiteColorPrefix + aValue + ')')
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    //pp.setFillColor(whiteColorPrefix + itemData.aValue + ')')
                                    let {p0, p1} = itemData.frames[f];
                                    if(p0.y > lowerY)
                                        continue;
                                    
                                    pp.lineV2(p0,p1);
                                    // let points = appSharedPP.lineV2(p0, p1);

                                    // for(let i = 0; i < points.length; i++) {

                                    // }
                                }
                                
                            }

                            if(mask) {
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.drawImage(mask, 0, 0)
                            }
                        });
                    }
                    
                    return frames;
                }

                

                //this.img = mask;

                // this.lightBg = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.img = mask;
                //     }
                // }))

                this.rain0 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        this.rain_bg = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.globalAlpha = 0.5
                                    ctx.drawImage(closeLampsMask, 0,0);
                                })
                            }
                        }))

                        this.frames = createRainFrames({
                            angleClamps: [-10,-10], lengthClamps: [10,12], xClamps: [-30, this.size.x-10], upperYClamps: [-200,-100], lowerY: 150, 
                            speedClapms: [15,20], framesCount: 120, itemsCount: 3000, size: this.size, mask:closeLampsMask, aValue: 0.25
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            angleClamps: [-10,-10], lengthClamps: [15,20], xClamps: [-30, this.size.x-10], upperYClamps: [-200,-100], lowerY: 150, 
                            speedClapms: [20,40], framesCount: 120, itemsCount: 3000, size: this.size, mask:closeLampsMask, aValue: 0.5
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            angleClamps: [-10,-10], lengthClamps: [15,20], xClamps: [-30, this.size.x-10], upperYClamps: [-200,-100], lowerY: 150, 
                            speedClapms: [30,50], framesCount: 120, itemsCount: 3000, size: this.size, mask:closeLampsMask,  aValue: 0.75
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                
            }
        }), 10)

        this.umbrella_back = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['umbrella_back'] })
            }
        }), 11)

        this.umbrella_mid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.parentScene.umbrella_back.img, 0,0);
                    ctx.globalCompositeOperation = 'source-in'
                    ctx.drawImage(closeLampsMask, 0,0);
                })

                this.raindrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createRaindropsFrames({framesCount, xClamps, yClamps, itemsCount, aClamps, lowerY, maxLength, itemFrameslengthClapms, size}) {
                        let frames = [];
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClapms);
                        
                            let p = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                            let aValue = getRandom(aClamps[0], aClamps[1]);
                            let aValues = easing.fast({from: aValue, to: 0, steps: totalFrames, type: 'linear', round: 2});
                            let size = new V2(getRandomInt(1,2), getRandomInt(1,2));

                            let lengthValues = easing.fast({from: 4, to: maxLength, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                            let yValues = easing.fast({from: p.y, to: lowerY, steps: totalFrames, type: 'quad', method: 'in', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    len: lengthValues[f],
                                    y: yValues[f],
                                    a: aValues[f]
                                };
                            }
                        
                            return {
                                p,
                                aValue,
                                size,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(whiteColorPrefix2 + itemData.frames[f].a + ')').rect(itemData.p.x, itemData.frames[f].y, 1, itemData.frames[f].len)
                                    }
                                }

                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createRaindropsFrames({ framesCount: 120, xClamps: [106, 107], yClamps: [23, 25], itemsCount: 2, 
                        aClamps: [0.6, 0.8], itemFrameslengthClapms: [25,30], size: this.size, lowerY: this.size.y + 20, maxLength: 10 })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSplashesFrames({framesCount, xClamps, yClamps, itemsCount, aClamps, itemFrameslengthClapms, size, mask}) {
                        let frames = [];
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClapms);
                        
                            let p = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                            let colorPrefix = getRandomBool() ? whiteColorPrefix : blackColorPrefix;
                            let aValue = getRandom(aClamps[0], aClamps[1]);
                            let size = new V2(getRandomInt(1,2), getRandomInt(1,2));

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                p,
                                colorPrefix,
                                aValue,
                                size,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.colorPrefix + itemData.aValue + ')').rect(itemData.p.x, itemData.p.y, 1, 1)
                                    }
                                }

                                if(mask) {
                                    ctx.globalCompositeOperation = 'destination-in'
                                    ctx.drawImage(mask, 0,0);
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSplashesFrames({ framesCount: 120, xClamps: [0, this.size.x], yClamps: [0, 25], itemsCount: 7000, 
                        aClamps: [0.05, 0.1], itemFrameslengthClapms: [10,30], size: this.size, mask: this.parent.parentScene.umbrella_back.img })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 12)

        this.umbrella_main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['umbrella'] })

                let yValues = [
                    ...easing.fast({from: 0, to: -0.5, steps: 60, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: -0.5, to: 0, steps: 60, type: 'quad', method: 'inOut', round: 1})
                ]

                this.currentFrame = 0;
                let totalFrames = 120
                
                let originY = this.position.y;

                this.parentScene.umbrella_main.position.y = originY + yValues[0];
                this.parentScene.umbrella_back.position.y = originY + yValues[0];
                this.parentScene.umbrella_mid.position.y = originY + yValues[0];
                
                this.parentScene.umbrella_main.needRecalcRenderProperties = true;
                this.parentScene.umbrella_back.needRecalcRenderProperties = true;
                this.parentScene.umbrella_mid.needRecalcRenderProperties = true;

                this.timer = this.regTimerDefault(10, () => {
                    this.parentScene.umbrella_main.position.y = originY + yValues[this.currentFrame];
                    this.parentScene.umbrella_back.position.y = originY + yValues[this.currentFrame];
                    this.parentScene.umbrella_mid.position.y = originY + yValues[this.currentFrame];

                    this.parentScene.umbrella_main.needRecalcRenderProperties = true;
                    this.parentScene.umbrella_back.needRecalcRenderProperties = true;
                    this.parentScene.umbrella_mid.needRecalcRenderProperties = true;
                    
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 13)
    }
}
