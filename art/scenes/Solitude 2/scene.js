class Solitude2Scene extends Scene {
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
                size: new V2(160,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'solitude2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    /**
     * +1. Снегопад
     * +2. Слабое Раскачивание деревьев
     * +3. Рябь на озере
     * +4. Мерцание света в лесу
     * +5. Точечная анимация на доме
     * +6. Дым из трубы
    */

    start(){
        let model = Solitude2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = undefined, lowerLinePoints = []
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed && isFunction(changeXSpeed)) {
                xSpeedValues = changeXSpeed(size)
            }

            let angleToYChangeValues = easing.fast({from: angleYChange[0], to: angleYChange[1], steps: size.y, type: 'linear', method: 'base', round: 2});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClapms);
                //totalFrames = framesCount;
                let p = V2.random(xClamps, yClamps);
                let sLen = getRandomInt(snowflakeLengthClamps);
                let angle = getRandomInt(angleClamps);

                let angleChange = angleToYChangeValues[p.y];
                if(angleChange == undefined) 
                {
                    if(p.y < 0)
                        angleChange = angleYChange[0];
                    else if(p.y >= size.y)
                        angleChange = angleYChange[1]
                    else 
                        angleChange = 0;
                }
                angle+=angleChange;
            
                let direction = V2.up.rotate(angle);
                let distance = getRandomInt(distanceCLamps) * (xSpeedValues[p.x] || 1);

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2, { toV2: true });

                let maxA = aClapms[1];
                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                let addShine = addParticlesShine && getRandomInt(0,addParticlesShine.upperChance) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(addParticlesShine.framesLengthClamps);
                    shineMul = getRandomInt(addParticlesShine.aMulClamps);
                }

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                    // aValues = aValues.map(a => a*shineMul);
                }

                let linePoints = [];
                let lineAValues = [];
                if(sLen > 0) {
                    linePoints = appSharedPP.lineV2(new V2(), new V2().add(direction.mul(sLen)).toInt());
                    lineAValues = alphaUseEasing ? [
                        ...easing.fast({ from: 0, to: maxA, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: maxA, to: 0, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 })
                    ] : new Array(linePoints.length).fill(maxA);
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = points[pointIndexValues[f]]
                    let a = aValues[f] || 0;
            
                    if(lowerLinePoints[p.x] && p.y > lowerLinePoints[p.x])
                        continue;

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames,
                    linePoints,
                    lineAValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { linePoints, lineAValues, } = itemData
                            let {p, a} = itemData.frames[f];

                            let repeats = 1;
                            if(doubleHeight)
                                repeats = 2;

                            for(let yShift = 0; yShift < repeats; yShift++) {
                                if(linePoints.length > 0) {
                                    let prev = undefined;
                                    for(let i = 0; i < linePoints.length; i++) {
                                        let lp = linePoints[i];
        
                                        let tp = p.add(lp);
                                        let currentA = a*(lineAValues[i] || 0); 
                                        hlp.setFillColor(colorPrefix + currentA).dot(tp.x, tp.y+yShift)
    
                                        // if(prev && prev.y != tp.y) {
                                        //     hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        // }
    
                                        prev = tp;
                                    }
                                }
                                else {
                                    hlp.setFillColor(colorPrefix + a + ')').dot(p.x, p.y + yShift)
                                }
                            }
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        let mainImage = PP.createImage(model, { renderOnly: ['mountains', 'island', 'island_d', 'birches', 'house'] });

        this.lake = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.translate(0, size.y + 75);
                    ctx.scale(1, -1);
                    ctx.drawImage(mainImage, 0, 0);

                    hlp.setFillColor('rgba(0,0,0,0.25').rect(0,0,size.x, size.y)
                })

                this.animations =this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createReflectionFrames({framesCount, itemsCount, itemFrameslengthClamps, data, additionalData, yShiftClamps, maxWidth, yClamps, size}) {
                        let frames = [];
                        
                        let widthToYValues = easing.fast({from: 0, to: maxWidth, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })
                        let yShiftToValues = easing.fast({from: 0, to: 3, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })
                        let startFrameIndexToYValues = easing.fast({from: 0, to: framesCount-1, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })



                        let itemsData = new Array(itemsCount).fill().concat(additionalData).map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let y = getRandomInt(yClamps);
                            let x = getRandomInt(0, size.x);
                            let targetY = y + getRandomInt(yShiftClamps)
                            let addHighlight = getRandomInt(0,20) == 0;
                            //let startFrameIndex = startFrameIndexToYValues[y-yClamps[0]] + getRandomInt(0, 30);

                            // if(getRandomInt(0,20) == 0){
                            //     y = getRandomInt(159,164);
                            //     x = getRandomInt(58,62)
                            //     targetY = y + getRandomInt(-10,10)
                            // }

                            if(targetY == y)
                                targetY = y+1;

                            let w = widthToYValues[y-yClamps[0]];

                            if(el) {
                                y = el.y;
                                x = el.x
                                targetY = y;
                                w = el.w
                            }

                            let widthValues = [
                                ...easing.fast({from: 0, to: w, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 }),
                                ...easing.fast({from: w, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 })
                            ]

                            let yShiftValues = easing.fast({ from: 0, to: yShiftToValues[y-yClamps[0]], steps: totalFrames, type: 'linear', round: 0 })

                            let pixels = new Array(1+ w*2);
                            let fromX = x - w;

                            if(el) 
                            {
                                pixels = el.pixels
                            }
                            else {
                                for(let i = 0; i < pixels.length; i++) {
                                    let row = data[y];
                                    if(!row)
                                        break;
    
                                    let c = row[fromX + i];
                                    if(c)
                                        pixels[i] = colors.rgbToHex(c);
                                }
                            }

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    addHighlight: false,//addHighlight, //&& (w - widthValues[f]) <= 2, //&& widthValues[f] == w
                                    w: widthValues[f],
                                    yShift: yShiftValues[f]
                                };
                            }
                        
                            return {
                                y: targetY, x,
                                pixels,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let {y,x,pixels} = itemData;
                                        let {w, yShift, addHighlight} = itemData.frames[f];
                                        let pixelIndex = fast.r(pixels.length/2) - w - 1; 
                                        let fromX = x - w;

                                        let totalWidth = 1 + w*2

                                        for(let i = 0;i < totalWidth; i++) {
                                            if(pixels[pixelIndex+i])
                                                hlp
                                                    .setFillColor(pixels[pixelIndex+i]) //('red')//
                                                    .dot(fromX+i, y);

                                            if(addHighlight)
                                                hlp.setFillColor(whiteColorPrefix + '0.05)').dot(fromX+i, y)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let additionalData = [];

                        let c = 'rgba(158,117,81,0.6)';
                        for(let i = 0; i < 3; i++) {
                            additionalData.push({
                                x: 106, y: 176+i,
                                w: getRandomInt(2,3),
                                pixels: new Array(9).fill(c)
                            })
                        }

                        c = 'rgba(158,117,81,0.35)';
                        for(let i = 0; i < 3; i++) {
                            additionalData.push({
                                x: 106+getRandomInt(-1,1), y: 178+i,
                                w: getRandomInt(2,2),
                                pixels: new Array(9).fill(c)
                            })
                        }

                        c = 'rgba(27,30,33,1)';
                        for(let i = 0; i < 4; i++) {
                            additionalData.push({
                                x: 112, y: 188,
                                w: getRandomInt(4,5),
                                pixels: new Array(12).fill(c)
                            })
                        }
                        
                        c = 'rgba(36,45,50,0.6)';
                        for(let i = 0; i < 10; i++) {
                            additionalData.push({
                                x: 22, y: 189+i,
                                w: getRandomInt(2,4),
                                pixels: new Array(12).fill(c)
                            })
                        }

                        let cc = ['rgba(0,0,0,0.1)', 'rgba(255,255,255,0.025'];
                        for(let i = 0; i < 500; i++) {
                            let c =  cc[getRandomInt(0,1)]
                            additionalData.push({
                                x: getRandomInt(0, this.size.x), y: getRandomInt(158,199),
                                w: getRandomInt(1,4),
                                pixels: new Array(12).fill(c)
                            })
                        }

                        let imgData = getPixelsAsMatrix(this.parent.img, this.size);
                        this.frames = this.createReflectionFrames({ framesCount: 240, itemsCount: 5000, itemFrameslengthClamps: [100,100], data: imgData, yShiftClamps: [-2,2], maxWidth: 10, yClamps: [150, 199], size: this.size, additionalData })

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 2)

        this.mainImage = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = mainImage

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'island_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.lightBlinkAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let imgs = [];
                        let originalOverlay = PP.createImage(model, { renderOnly: ['dark_overlay'], forceVisibility: { dark_overlay: {visible: true} } })
                        for(let i = 0; i< 3; i++) {
                            imgs[i] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.1 + i*0.2;
                                ctx.drawImage(originalOverlay, 0,0);
                            })
                        }

                        let delayClamps = [7,15];
                        let delay = getRandomInt(delayClamps);
                        let currentFrame = 0;
                        this.img = imgs[getRandomInt(0, imgs.length-1)];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            currentFrame++;
                            if(currentFrame == delay){
                                delay = getRandomInt(delayClamps);
                                this.img = imgs[getRandomInt(0, imgs.length-1)];
                                currentFrame = 0;
                            }
                        })
                    }
                }))

                this.treeAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let additionalFramesLength = 60;
                        this.frames = animationHelpers.createLayersAnimationFrames({
                            framesCount: 240, itemFrameslength: 120,  
                            startFramesClamps: [0, 180],
                            animationsModel: model, size: this.size,
                            //maxFrameIndex: 1,
                            additional: {
                                framesShift: [30,60],
                                frameslength: additionalFramesLength,
                                framesIndiciesChange: [
                                    ...easing.fast({ from: 0, to: 2, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 }),
                                    ...easing.fast({ from: 2, to: 0, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 })
                                ]
                            }, 
                            animationsModel: Solitude2Scene.models.treesAnimation, size: this.size
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                let gDebug = false;
                    let shift = new V2(0,5);
                    let smokeAvalue = 0.015
                    let itemsCount = 70
                    let yShiftBase = -0.08
                    this.smoke = this.addChild(new GO({
                        position: shift.clone(),
                        size: this.size,
                        init() {
                            let xShift = 0.025;
                            let yShift = yShiftBase//-0.1;
                            let framesLength = 240 
    
                            let srtartPositions = appSharedPP.lineV2(new V2(104,75), new V2(106, 75), { toV2: true})
                            srtartPositions.push(new V2(112, 65))
                            // srtartPositions.push(new V2(87, 66))
                            // srtartPositions.push(new V2(88, 66))
    
                            let deviationCLamps = (value, deviation) => {
                                return [value-deviation, value+deviation]
                            }
    
                            this.frames = animationHelpers.createSmokeFrames({
                                debug: gDebug ? true: false,
                                framesCount: framesLength, itemsCount: itemsCount,
                                startPositions: srtartPositions,//[new V2(86, 66),new V2(87, 66),new V2(88, 66), new V2(83,57),new V2(82, 58),new V2(74, 45), new V2(75, 45) ],
                                aClamps: [smokeAvalue, smokeAvalue], itemFrameslength: [framesLength, framesLength], velocityClamps: {
                                    xClamps: deviationCLamps(xShift, 0.01)
                                    , yClamps: deviationCLamps(yShift, 0.03)
                                }, accelerationClamps: {
                                    xClamps: [0, 0.00025]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFFFFF', appSharedPP
                            })
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
            }
        }), 3)

        this.lakeDetails = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['lake_d'] })
            }
        }), 4)

        this.snowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let framesCount = 120;
                let itemFrameslengthClapms = [60,80]
                let colorPrefix = whiteColorPrefix
                let angleClamps = [140, 170]

                this.layers = [
                    {
                        framesCount, itemsCount: 1000, itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.1], mask: undefined, angleClamps,//angleClamps: [150,170], 
            distanceCLamps: [30,50], xClamps: [-20, this.size.x], yClamps: [-30, this.size.y], size: this.size
                    },
                    {
                        framesCount, itemsCount: 500, itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.3], mask: undefined, angleClamps,//angleClamps: [150,170], 
            distanceCLamps: [40,60], xClamps: [-20, this.size.x], yClamps: [-30, this.size.y], size: this.size
                    },
                    {
                        framesCount, itemsCount: 200, itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.5], mask: undefined, angleClamps,//angleClamps: [145,175], 
            distanceCLamps: [50,70], xClamps: [-20, this.size.x], yClamps: [-30, this.size.y], size: this.size
                    },
                    {
                        framesCount, itemsCount: 100, itemFrameslengthClapms, colorPrefix, aClapms: [0, 0.75], mask: undefined, angleClamps,//angleClamps: [140,180], 
            distanceCLamps: [70,80], xClamps: [-40, this.size.x], yClamps: [-40, this.size.y], size: this.size
                    }
                ].map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 5)
        
    }
}