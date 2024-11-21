class Portal7Scene extends Scene {
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
                fileNamePrefix: 'portal7',
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
        let model = Portal7Scene.models.main;
        let cat_tail_animation_model = Portal7Scene.models.cat_tail_animation;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let snowFlakesColorPrefix = 'rgba(200,200,200,';
        let appSharedPP = PP.createNonDrawingInstance();
        
        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, maskApplyTipe = 'source-in', angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = false,
            changeXSpeed = false, changeBrightnessMask
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            if(mask != undefined && (maskApplyTipe == undefined || maskApplyTipe == ''))
                throw 'Mask params are empty - maskApplyTipe'

            // if(changeBrightness && mask) {
            //     pixelsMatrix = getPixelsAsMatrix(mask, size);
            // }

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed) {
                xSpeedValues = [
                    //...new Array(fast.r(size.x/2)).fill(1),
                    ...easing.fast({from: 1, to: 0.75, steps: fast.r(size.x/1), type: 'linear', round: 2})
                ]
            }

            let currentColorHsv = undefined;
            let getColorPrefix = (p) => {
                if(!changeBrightnessMask)
                    return colorPrefix

                let pData = changeBrightnessMask[p.y] != undefined ? changeBrightnessMask[p.y][p.x] : undefined;
                if(pData == undefined)
                    return colorPrefix;

                if(!currentColorHsv) {
                    currentColorHsv = colors.colorTypeConverter({ value: colorPrefix.replace('rgba(','').split(',').slice(0,3).map(x => parseInt(x)), fromType: 'rgb', toType: 'hsv' })
                }

                let currentHsv = colors.colorTypeConverter({ value: pData, fromType: 'rgb', toType: 'hsv' });
                let modifiedV = 100 - currentHsv.v;
                let resultRgb = colors.colorTypeConverter({ value: {h: currentColorHsv.h, s: currentColorHsv.s, v: modifiedV}, fromType: 'hsv', toType: 'rgb' })

                return `rgba(${resultRgb.r},${resultRgb.g},${resultRgb.b},`;
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

                let addShine = addParticlesShine && getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(10,30);
                    shineMul = getRandomInt(4,7);
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
                                        hlp.setFillColor(getColorPrefix({x: tp.x, y: tp.y+yShift}) + currentA).dot(tp.x, tp.y+yShift)
    
                                        if(prev && prev.y != tp.y) {
                                            hlp.setFillColor(getColorPrefix({ x: tp.x+1, y: tp.y+yShift}) + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        }
    
                                        prev = tp;
                                    }
                                }
                                else {
                                    hlp.setFillColor(getColorPrefix({x: p.x, y: p.y + yShift}) + a + ')').dot(p.x, p.y + yShift)
                                }
                            }
                        }
                        
                    }

                    // if(mask) {
                    //     ctx.globalCompositeOperation = maskApplyTipe
                    //     ctx.drawImage(mask, 0, 0)
                    // }
                });
            }
            
            return frames;
        }

        this.sky = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['sky'] })

                this.clouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let customModel = {
                            ...model,
                            general: {
                                ...model.general,
                                size: this.size.add(new V2(10,0))
                            }
                        }
                        let totalFrames = 300
                        var lData = [
                            {
                                easingType: 'sin',
                                delta: new V2(8,0),
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds1'] }),
                                totalFrames,
                                xShift: -8,
                                size: this.size,
                                startFrameIndex: 0
                            },
                            {
                                easingType: 'sin',
                                delta: new V2(10,0),
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds4'] }),
                                totalFrames,
                                xShift: -10,
                                size: this.size,
                                startFrameIndex: 150
                            },
                            {
                                easingType: 'sin',
                                delta: new V2(0,0),
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds2'] }),
                                totalFrames,
                                xShift: -8,
                                size: this.size,
                                startFrameIndex: 75
                            },
                            {
                                easingType: 'sin',
                                delta: new V2(0,0),
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds3'] }),
                                totalFrames,
                                xShift: -6,
                                size: this.size,
                                startFrameIndex: 75
                            }
                        ]

                        this.clouds = lData.map(ld => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: animationHelpers.createShiftFrames(ld),
                            init() {
                                this.registerFramesDefaultTimer({
                                    startFrameIndex: ld.startFrameIndex,
                                    // framesEndCallback: () => {
                                    //     if(ld.startFrameIndex == 0) {
                                    //         this.parent.parentScene.capturing.stop = true;
                                    //     } 
                                    // }
                                });
                            }
                        })))
                    }
                }))

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            scenesHelper.createGradient({
                                hlp, aValueMul: 1, center: new V2(34,36), radius: new V2(100,100), gradientOrigin: new V2(34,36), size, colorPrefix: 'rgba(253,254,247,', easingType: 'quad', easingMethod: 'out', angle: 0, verticalCut: undefined //
                            })
                        })
                    }
                }))
            }
        }), 1)

        this.city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['city'] })
            }
        }), 3)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground', 'ground_d'] })

                this.cat = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['cat'] })
                        this.cat_tail = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let originalFrames = PP.createImage(cat_tail_animation_model);
                                let fromTo = [2, originalFrames.length-1]
                                let framesChangeIndexValues = [
                                    ...easing.fast({ from: fromTo[0], to: fromTo[1], steps: 50, type: 'quad', method: 'inOut', round: 0}),
                                    ...easing.fast({ from: fromTo[1], to: fromTo[0], steps: 50, type: 'linear', method: 'base', round: 0})
                                ] 

                                this.currentFrame = 0;
                                this.img = originalFrames[framesChangeIndexValues[this.currentFrame]];
                                
                                this.timer = this.regTimerDefault(10, () => {
                                
                                    this.img = originalFrames[framesChangeIndexValues[this.currentFrame]];
                                    this.currentFrame++;
                                    if(this.currentFrame == framesChangeIndexValues.length){
                                        this.currentFrame = 0;
                                    }
                                })
                            }
                            
                        }))
                    }
                }))
            }
        }), 5)

        this.portal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBlinkFrames({color, position, blinkFramesCount, size}) {
                let frames = [];
                let rgb = colors.colorTypeConverter({value: color, fromType: 'hex', toType: 'rgb'});
                let rgbPrefix = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b},`;
                let aValues = [
                    ...easing.fast({from: 0, to: 1, steps: fast.r(blinkFramesCount/2), type: 'quad', method: 'in', round: 2}),
                    ...easing.fast({from: 1, to: 0, steps: fast.r(blinkFramesCount/2), type: 'quad', method: 'inOut', round: 2})
                ]

                for(let f = 0; f < blinkFramesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor(rgbPrefix + aValues[f] + ')').dot(position)
                    });
                }
                
                return frames;
            },
            init() {

                let ledsData = [
                    { color: '#1a8694', position: new V2(59,109), blinkFramesCount: 100, size: this.size },
                    { color: '#1a8694', position: new V2(60,111), blinkFramesCount: 100, size: this.size, startFrameIndex: 25 },
                    { color: '#1a8694', position: new V2(59,90), blinkFramesCount: 150, size: this.size, startFrameIndex: 0 },
                    { color: '#696355', position: new V2(147,48), blinkFramesCount: 30, size: this.size, startFrameIndex: 0 },//692941
                    { color: '#696355', position: new V2(146,47), blinkFramesCount: 30, size: this.size, startFrameIndex: 15 },
                    { color: '#31694c', position: new V2(158,99), blinkFramesCount: 50, size: this.size},
                    { color: '#31694c', position: new V2(158,103), blinkFramesCount: 50, size: this.size, startFrameIndex: 10},
                    // { color: '#31694c', position: new V2(156,107), blinkFramesCount: 50, size: this.size, startFrameIndex: 20},
                    // { color: '#31694c', position: new V2(154,110), blinkFramesCount: 50, size: this.size, startFrameIndex: 30},
                    // { color: '#31694c', position: new V2(153,113), blinkFramesCount: 50, size: this.size, startFrameIndex: 40},
                    
                ]

                this.leds = ledsData.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createBlinkFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({
                            startFrameIndex: p.startFrameIndex || 0,
                        });
                    }
                })))

                this.portalLine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['portal_line'] });

                        let totalFrames = 300;
                        let maxA = 0.6
                        let minA = 0.1
                        this.frames = [];
                        let aValues = [
                            ...easing.fast({from: minA, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: maxA, to: minA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                        ]

                        for(let f = 0; f < totalFrames; f++){
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[f];
                                ctx.drawImage(img,0,0);
                            });
                        }

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.img = PP.createImage(model, { renderOnly: ['portal'] })

                let totalFrames = 300;

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.parentScene.sky.img, 0, 0)
                    ctx.drawImage(PP.createImage(model, { renderOnly: ['clouds1', 'clouds2', 'clouds3', 'clouds4'] }), 0, 0)
                    ctx.drawImage(this.parentScene.city.img, 0, 0)
                    ctx.drawImage(this.parentScene.ground.img, 0, 0)
                    ctx.drawImage(this.img, 0, 0)

                    //hlp.setFillColor('red').rect(0,0,size.x, size.y)
                })

                let snowColorPrefix = 'rgba(236,225,233';
                let changeBrightnessMask = getPixelsAsMatrix(mask, this.size);

                this.snowfallLayers = [
                    {
                        framesCount: totalFrames, itemsCount: 300, itemFrameslengthClapms: [150,160], colorPrefix: snowColorPrefix, aClapms: [0, 0.25], mask: mask, changeBrightnessMask,  angleClamps: [240, 260], distanceCLamps: [60,70], xClamps: [0, this.size.x + 80], yClamps: [-20, 130], size: this.size, aMul: 1, 
                    },
                    {
                        framesCount: totalFrames, itemsCount: 200, itemFrameslengthClapms: [150,160], colorPrefix: snowColorPrefix, aClapms: [0, 0.5], mask: mask, changeBrightnessMask,  angleClamps: [235, 260], distanceCLamps: [100,110], xClamps: [0, this.size.x + 80], yClamps: [-10, 160], size: this.size, aMul: 1, 
                    },
                    {
                        framesCount: totalFrames, itemsCount: 100, itemFrameslengthClapms: [150,160], colorPrefix: snowColorPrefix, aClapms: [0, 0.75], mask: mask, changeBrightnessMask,  angleClamps: [220, 270], distanceCLamps: [150,170], xClamps: [0, this.size.x + 80], yClamps: [-10, 180], size: this.size, aMul: 1, 
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowFallFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 7)
    }
}