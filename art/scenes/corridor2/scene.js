class Corridor2Scene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'corridor2',
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
        let model = Corridor2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, excludeMask }) {
            let frames = [];
    
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);
    
                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);
    
                let lineAValues = undefined;
                if (useACurve) {
                    lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
                }
    
                let frames = [];
                let current = p0;
                let ly = isArray(lowerY) ? getRandomInt(lowerY) : lowerY;
    
                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }
    
                    let p0 = current.clone();
                    let p1 = current.add(direction.mul(len)).toInt();
    
                    frames[frameIndex] = {
                        p0,
                        p1
                    };
    
                    current = p0.add(direction.mul(speed)).toInt()
                    if (current.y > ly)
                        break;
                }
    
                return {
                    frames,
                    lowerY: ly,
                    lineAValues
                }
            })
    
            for (let f = 0; f < framesCount; f++) {
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ ctx });
                    pp.setFillColor(whiteColorPrefix + aValue + ')')
                    for (let p = 0; p < itemsData.length; p++) {
                        let itemData = itemsData[p];
    
                        if (itemData.frames[f]) {
    
                            let { p0, p1 } = itemData.frames[f];
                            if (p0.y > itemData.lowerY)
                                continue;
    
                            if (!useACurve)
                                pp.lineV2(p0, p1);
                            else {
                                let points = appSharedPP.lineV2(p0, p1)
                                for (let i = 0; i < points.length; i++) {
                                    let a = itemData.lineAValues[i];
                                    if (a == undefined)
                                        a = 0;
    
                                    let p = points[i];
                                    if (p.y > itemData.lowerY)
                                        continue;
    
                                    hlp.setFillColor(whiteColorPrefix + a + ')').dot(points[i])
                                }
                            }
                        }
    
                    }
    
                    if (mask) {
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(mask, 0, 0)
                    }

                    if(excludeMask) {
                        ctx.globalCompositeOperation = 'destination-out'
                        ctx.drawImage(excludeMask, 0, 0)
                    }
                });
            }
    
            return frames;
        }

        let createSplashFrames = function({framesCount, splashesCount, splashesStartPoints, itemFrameslengthClamps, maxA, size, gravityClamps = [0.035,0.06], speedClapms = [0.25,0.75], angleClamps = [0,30], particlesCountClamps = [3,5], noColorChange, startFrameIndicesRandomization = false, splashAMul = 1, rainColorPrefix
        }) {
            let frames = [];
            //let gravity = 0.02;
            
            // if(!gravityClamps) {
            //     gravityClamps = [0.035,0.06]
            // }


            let itemsData = new Array(splashesCount).fill(undefined).map((_, i) => {
                //let startPoint = splashesStartPoints[getRandomInt(0, splashesStartPoints.length-1)]
                let startFrameIndex = startFrameIndicesRandomization
                    ? getRandomInt(0, framesCount-1)
                    :fast.r((i/splashesStartPoints.length)*framesCount)+ getRandomInt(0, 25) //getRandomInt(0, framesCount-1);

                let startPoint = splashesStartPoints[getRandomInt(0, splashesStartPoints.length-1)]
                let totalFrames = framesCount;
                let itemsCount = getRandomInt(particlesCountClamps);

                let frames = [];

                let particlesData = new Array(itemsCount).fill().map((_, ii) => ({
                    ttl: getRandomInt(itemFrameslengthClamps),
                    speedV: V2.up.rotate(getRandomInt(angleClamps)*(ii%2==0 ? -1 : 1)).mul(getRandom(speedClapms[0],speedClapms[1])),  //new V2(getRandom(0,0.2)*(ii%2==0 ? -1 : 1), getRandom(-0.4, -0.8)),
                    currentP: startPoint.add(new V2(getRandomInt(-2,2),0)),
                    gravity: getRandom(gravityClamps[0],gravityClamps[1])
                }))

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let framesData = [];

                    for(let pd = 0; pd < particlesData.length; pd++) {
                        let currentPd = particlesData[pd];
                        if(!currentPd.aValues) {
                            currentPd.aValues = easing.fast({from: maxA, to: 0, steps: currentPd.ttl, type: 'linear', round: 2 })
                        }

                        if(currentPd.ttl < 0)
                            continue; 

                        //console.log('a: ' + currentPd.aValues[f]*splashAMul);
                        framesData[framesData.length] = {
                            p: currentPd.currentP.clone(),
                            a: currentPd.aValues[f] != undefined ? (currentPd.aValues[f]*splashAMul): 0
                        }

                        currentPd.currentP = currentPd.currentP.add(currentPd.speedV);
                        currentPd.speedV.y+=currentPd.gravity;
                        currentPd.ttl--;
                    }
            
                    frames[frameIndex] = framesData;
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
                            for(let i = 0 ; i < itemData.frames[f].length; i++) {
                                let pd = itemData.frames[f][i];

                                let p = pd.p.toInt();
                                let c = rainColorPrefix;

                                if(pd.a != undefined)
                                    hlp.setFillColor(c + pd.a + ')').dot(p)
                            }
                        }
                        
                    }

                });
            }
            
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground', 'bg', 'bg_d'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 50, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData( PP.getLayerByName(model, 'ground_p') ) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let aMod = 0.00
                let totalFrames = 150;
                this.rainLayers = [
                    {
                        angleClamps: [0,0], lengthClamps: [10,11], xClamps: [50,110], upperYClamps: [0, 40], lowerY: [142,146], aValue: 0.05-aMod, speedClapms: [4,4], mask: undefined, framesCount: totalFrames, itemsCount: 1500, size: this.size, useACurve: false,
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [12,14], xClamps: [50,110], upperYClamps: [0, 40], lowerY: [147,150], aValue: 0.075-aMod, speedClapms: [5,6], mask: undefined, framesCount: totalFrames, itemsCount: 700, size: this.size, useACurve: false,
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [14,17], xClamps: [50,110], upperYClamps: [0, 40], lowerY: [151,154], aValue: 0.1-aMod, speedClapms: [6,7], mask: undefined, framesCount: totalFrames, itemsCount: 400, size: this.size, useACurve: true,
                    },
                    {
                        angleClamps: [0,0], lengthClamps: [17,20], xClamps: [50,110], upperYClamps: [0, 40], lowerY: [155,157], aValue: 0.125-aMod, speedClapms: [8,9], mask: undefined, framesCount: totalFrames, itemsCount: 200, size: this.size, useACurve: true,
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({
                            
                        });
                    }
                })))

                let itemFrameslengthClamps = [8,15] 
                let mul = 1
                this.splashesLayers = [
                    {
                        framesCount: totalFrames, splashesCount: 1500*mul, 
                        splashesStartPoints: appSharedPP.fillByCornerPoints([new V2(59,143), new V2(102,143), new V2(102,141), new V2(59,141),], { toV2: true }), 
                        itemFrameslengthClamps, maxA: 0.05, size: this.size, gravityClamps: [0.035,0.06], speedClapms: [0.35,0.7], angleClamps: [0,20], particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix
                    },
                    {
                        framesCount: totalFrames, splashesCount: 800*mul, 
                        splashesStartPoints: appSharedPP.fillByCornerPoints([new V2(59,148), new V2(102,148), new V2(102,144), new V2(59,144),], { toV2: true }), 
                        itemFrameslengthClamps, maxA: 0.1, size: this.size, gravityClamps: [0.035,0.06], speedClapms: [0.35,0.8], angleClamps: [0,20], particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix
                    },
                    {
                        framesCount: totalFrames, splashesCount: 400*mul, 
                        splashesStartPoints: appSharedPP.fillByCornerPoints([new V2(59,154), new V2(102,154), new V2(102,149), new V2(59,149),], { toV2: true }), 
                        itemFrameslengthClamps, maxA: 0.2, size: this.size, gravityClamps: [0.035,0.06], speedClapms: [0.45,1.0], angleClamps: [0,20], particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix
                    },
                    {
                        framesCount: totalFrames, splashesCount: 200*mul, 
                        splashesStartPoints: appSharedPP.fillByCornerPoints([new V2(59,158), new V2(102,158), new V2(102,155), new V2(59,155),], { toV2: true }), 
                        itemFrameslengthClamps, maxA: 0.5, size: this.size, gravityClamps: [0.035,0.06], speedClapms: [0.65,1.2], angleClamps: [0,20], particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSplashFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 2)

        this.mg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['mg_main', 'mg', 'upper_w_d'] }),
            init() {
                this.doors = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['doors'] }),
                    init() {
                        //
                    }
                }))

                this.label = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['label'] }),
                    init() {
                        this.blinkAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let darkOverlay = PP.createImage(model, { renderOnly: ['dark_overlay'] })
                                let darkOverlay05 = createCanvas(this.size, (ctx, size, hlp) => { ctx.globalAlpha = 0.5; ctx.drawImage(darkOverlay, 0, 0); })
                                let fData = [undefined, darkOverlay05, ]; //darkOverlay

                                let framesData = new Array(300).fill(undefined)
                                for(let i = 0; i < 3; i++) {
                                    let fi = getRandomInt(0,145);
                                    for(let f = fi; f < fi+5;f++) {
                                        framesData[f] = darkOverlay05;
                                    }
                                }

                                //let framesData = [];
                                // for(let i = 0; i < 150; i+=5){
                                //     framesData.push(...new Array(5).fill(fData[getRandomInt(0, fData.length-1)]))
                                // }
                                // let framesData = [
                                //     ...new Array(125).fill(undefined),
                                //     ...new Array(5).fill(darkOverlay05),
                                //     ...new Array(5).fill(undefined),
                                //     ...new Array(5).fill(darkOverlay),
                                //     ...new Array(5).fill(undefined),
                                //     ...new Array(5).fill(darkOverlay05),
                                // ]

                                this.currentFrame = 0;
                                this.img = framesData[this.currentFrame];
                                
                                this.timer = this.regTimerDefault(10, () => {
                                
                                    this.img = framesData[this.currentFrame];
                                    this.currentFrame++;
                                    if(this.currentFrame == framesData.length){
                                        this.currentFrame = 0;

                                        this.parent.parent.parentScene.capturing.stop = true;
                                    }
                                })
                            }
                        }))
                    }
                }))

                this.upperWindowAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.p = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 20, size: this.size, 
                                    pointsData: animationHelpers.extractPointData( PP.getLayerByName(model, 'upper_w_p') ) });
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.dropsFlow = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createDropsFlowFrames({framesCount, data, opacityClamps, itemFrameslength, lowerY, size}) {
                                let frames = [];
                                
                                let itemsData = data.map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount-1);
                                    let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
        
                                    let points = appSharedPP.lineByCornerPoints(el.corners);
                                    let indexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
                                    let opacity = getRandom(opacityClamps[0], opacityClamps[1])
        
                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                            p: points[indexValues[f]]
                                        };
                                    }
                                
                                    return {
                                        frames,
                                        opacity,
                                        colorPrefix: el.colorPrefix
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            if(itemData.frames[f]){
                                                if(itemData.frames[f].p.y < lowerY)
                                                    hlp.setFillColor(itemData.colorPrefix + itemData.opacity + ')').dot(itemData.frames[f].p)
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                let h = 30;
                                // let data = new Array(20).fill().map(_ => {
                                //     let p0 = V2.random([50,110], [26,40]);
                                //     let p1 = p0.add(new V2(0, h));
                                //     return {
                                //         corners: [p0, p1],colorPrefix: whiteColorPrefix
                                //     }
                                // });

                                this.frames = this.createDropsFlowFrames({framesCount: 150, data:
                                    [
                                    { corners: [new V2(65,30), new V2(66,35), new V2(64,55), new V2(65,30+h)], colorPrefix: whiteColorPrefix },
                                    // { corners: [new V2(73,34),new V2(73,34+h)], colorPrefix: whiteColorPrefix },
                                    { corners: [new V2(78,29), new V2(77,40), new V2(78,29+h)], colorPrefix: whiteColorPrefix },
                                    // { corners: [new V2(82,31),new V2(82,31+h)], colorPrefix: whiteColorPrefix },
                                    // { corners: [new V2(92,30),new V2(92,30+h)], colorPrefix: whiteColorPrefix },
                                    { corners: [new V2(99,33), new V2(100,49), new V2(99,33+h)], colorPrefix: whiteColorPrefix }
                                ]
                                , opacityClamps: [0.2,0.3], itemFrameslength: [100,120], lowerY: 51, size: this.size});
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.smallSplashes = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let corners = animationHelpers.extractPointData(PP.getLayerByName(model, 'window_splash_zone')).map(pd => new V2(pd.point));
                                let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                                    point: p,
                                    color: whiteColorPrefix + fast.r(getRandom(0, 0.3), 2) + ')'
                                }));
        
                                this.frames = animationHelpers.createMovementFrames({
                                    framesCount: 150, itemFrameslength: [5, 15], pointsData: availableDots, size: this.size,
                                    pdPredicate: () => getRandomInt(0, 2) == 0,
                                });
        
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
        
                                    }
                                });
                            }
                        }))
                    }
                }))

                this.upper_w_frame = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['upper_w_frame'] }),
                    init() {
                        //
                    }
                }))

                // let aMod = 0.00
                // let totalFrames = 150;
                // this.rainLayers = [
                //     {
                //         angleClamps: [0,0], lengthClamps: [17,20], xClamps: [56,106], upperYClamps: [0, 40], lowerY: [158,160], aValue: 0.2, speedClapms: [8,9], mask: undefined, framesCount: totalFrames, itemsCount: 100, size: this.size, useACurve: true, 
                //         excludeMask: createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('red').rect(50, 0, 60, 70)
                //         }) 
                //     }
                // ].map(p => this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     frames: createRainFrames(p),
                //     init() {
                //         this.registerFramesDefaultTimer({});
                //     }
                // })))

                let itemFrameslengthClamps = [8,20] 
                this.splashesLayers = [
                    {
                        framesCount: 150, splashesCount: 30, 
                        splashesStartPoints: appSharedPP.fillByCornerPoints([new V2(55, 159), new V2(104, 159), new V2(110,162), new V2(110,164), new V2(49,164), new V2(51,162), ], { toV2: true }), 
                        itemFrameslengthClamps, maxA: 0.7, size: this.size, gravityClamps: [0.035,0.06], speedClapms: [0.35,0.7], angleClamps: [0,30], particlesCountClamps: [3,5], startFrameIndicesRandomization: true, splashAMul: 1, rainColorPrefix: whiteColorPrefix
                    }
                ].map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSplashFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 150, itemFrameslength1Clamps: [0, 5], itemFrameslength2Clamps: [25, 30], size: this.size, opacityClamps: [0.8, 0.9],
                            startPositions: [
                                {
                                    data: appSharedPP.lineV2(new V2(49, 71), new V2(111,71)),
                                    height: 90, useAll: false, itemsCount: 20, colorPrefix: whiteColorPrefix, tail: 4
                                }
                            ], reduceOpacityOnFall: true, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rainReflections = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let rainFrames = this.parent.parentScene.rain.rainLayers[1].frames;
                        let yClamps = [161, 200]
                        let oMask = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('black').rect(58,171,44,28)
                            let aToy = easing.fast({ from: 0, to: 0.6, steps: yClamps[1]-yClamps[0], type: 'linear', round: 2 });
                            for(let y = yClamps[0]; y < yClamps[1]; y++) {
                                hlp.setFillColor('rgba(0,0,0,' + aToy[y-yClamps[0]] + ')').rect(58, y, 44, 1)
                            }
                        })
                        this.frames = rainFrames.toReversed().map(f => {
                            return createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(f, 0, 50);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(oMask, 0, 0);
                            })
                        });
                        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData( PP.getLayerByName(model, 'floor_p') ) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)
    }
}