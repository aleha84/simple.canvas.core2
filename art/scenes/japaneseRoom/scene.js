//TODO нарисовать: 
// Котелок и лампу +
// Дизеринг переходов +
// костёр +
// человек +
//TODO анимировать:
// анимированный двуслойный шум перлина наложить на лучи + 
// анимация дыма + 
// анимация огня +
// анимация человека +
// точечная анимация +

class JapaneseRoomScene extends Scene {
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
                size: new V2(200,125).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'japaneseRoom',
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
        const model = JapaneseRoomScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(255,255,255,'
        let lightColorPrefix = 'rgba(213,227,240';

        let createFogFrames = function({totalFrames, size, maskImgArray, topLeft, noiseImgSize, aMul = 1,seed, paramsDivider = 30, timeClamp = 1, cutoffValue = 10,
            noiseMultiplier = 4
        }) {
            let frames = [];

            let pn = new mathUtils.Perlin('random seed ' + (seed ? seed : getRandom(0,1000)));

            frames = [];

            let aValues = easing.fast({from: 0, to: 1, steps: 100 - cutoffValue, type: 'linear', round: 2})
            let timeValues = easing.fast({ from: 0, to: timeClamp, steps: totalFrames, type: 'linear', round: 3 })
            let globalAlpha = [
                ...easing.fast({from: 0, to: 0.5, steps: totalFrames/2, type: 'sin', method: 'inOut', round: 2}),
                ...easing.fast({from: 0.5, to: 0, steps: totalFrames/2, type: 'sin', method: 'inOut', round: 2})
            ]

            let maskImgToggle = maskImgArray ? [
                ...easing.fast({from: 0, to: maskImgArray.length-1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({from: maskImgArray.length-1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
            ] : [];
            

            //let paramsDivider = 30;
            let timeDivider = 1;

            for(let f = 0; f < totalFrames; f++){
                let time = timeValues[f]/timeDivider;

                let frame = createCanvas(size, (ctx, size, hlp) => {
                    ctx.globalAlpha = globalAlpha[f];
                    for(let y = topLeft.y; y < noiseImgSize.y+topLeft.y; y++){
                        for(let x = topLeft.x; x < noiseImgSize.x+topLeft.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);
                            if(noise < cutoffValue) {
                                continue; 
                            }

                            noise = fast.r(noise/noiseMultiplier)*noiseMultiplier

                            let a = aValues[noise-cutoffValue]*aMul;

                            hlp.setFillColor(colorPrefix + a).dot(x,y);
                        }
                    }

                    if(maskImgArray) {
                        ctx.globalAlpha = 1;
                        
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(maskImgArray[maskImgToggle[f]], 0, 0)
                        ctx.globalCompositeOperation = 'source-in'
                    }
                })

                frames[f] = frame;
            }

            return frames;
        }

        let totalFrames = 300;
        let sceneSize = this.viewport.clone();
        let raysAlphaValues = 0.5
        
        let sizeDivider = 4
        let fogSize =sceneSize.divide(sizeDivider);
        let paramsDivider = 8;
        let fogFrames1 = createFogFrames({ totalFrames, size: fogSize, topLeft: new V2(0,0), noiseImgSize: new V2(this.viewport.x, 110).divide(sizeDivider), 
            aMul: 1, paramsDivider: paramsDivider, cutoffValue: 30, timeClamp: 1 });
        let fogFrames2 = createFogFrames({ totalFrames, size: fogSize, topLeft: new V2(0,0), noiseImgSize: new V2(this.viewport.x, 110).divide(sizeDivider), 
            aMul: 1, paramsDivider: paramsDivider, cutoffValue: 30, timeClamp: 1 });
        let fogFrames3 = createFogFrames({ totalFrames, size: fogSize, topLeft: new V2(0,0), noiseImgSize: new V2(this.viewport.x, 110).divide(sizeDivider), 
            aMul: 1, paramsDivider: paramsDivider, cutoffValue: 30, timeClamp: 1 });

        let showFrames = false;

        let compositeOperation = 'source-in'

        let resultFogFrames = new Array(totalFrames).fill().map((el,f) => createCanvas(sceneSize, (ctx, size, hlp) => {
            ctx.drawImage(fogFrames1[f], 0, 0, sceneSize.x, sceneSize.y);
            
            let f2 = f+totalFrames/3;
            if(f2 > (totalFrames-1)) {
                f2-=totalFrames;
            }
            ctx.drawImage(fogFrames2[f2], 0, 0, sceneSize.x, sceneSize.y);

            let f3 = f+totalFrames*2/3;
            if(f3 > (totalFrames-1)) {
                f3-=totalFrames;
            }
            ctx.drawImage(fogFrames3[f3], 0, 0, sceneSize.x, sceneSize.y);
        }))

        let createFramesWithMask = (mask) => resultFogFrames.map(frame => createCanvas(sceneSize, (ctx, size, hlp) => {
            ctx.drawImage(mask, 0, 0)
            ctx.globalCompositeOperation = compositeOperation//'source-in'//source-atop
            ctx.drawImage(frame, 0, 0)

            // ctx.globalCompositeOperation = 'lighter'
            // ctx.globalAlpha = 0.25
            // ctx.drawImage(mask, 0, 0)
        }))

        let createRayFrames = function({framesCount, itemFrameslength, data, size, raysMask}) {
            let frames = [];
            
            
            let itemsData = []
            
            data.forEach(dataItem => {
                let {p0_original, angleOriginal, angleDeviationClamp, length_original_clamps, x_shiftClamps, y_shiftClamps, alphaValue, angleSpreadClamps, 
                    raysXShiftClamps, itemsCount,
                    aChangePredicate,
                } = dataItem;

                if(!aChangePredicate) {
                    aChangePredicate = () => false
                }

                

                itemsData.push(...new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;

                    let l = getRandomInt(length_original_clamps);
                    let angleDeviation = getRandom(angleDeviationClamp[0], angleDeviationClamp[1]);

                    let d = [V2.down.rotate(angleOriginal+angleSpreadClamps[0]+angleDeviation), V2.down.rotate(angleOriginal+angleSpreadClamps[1]+angleDeviation)]

                    let p0 = p0_original.add(new V2(getRandomInt(x_shiftClamps), getRandomInt(y_shiftClamps)));

                    // if(i == 0) {
                    //     p0_original.add(new V2(x_shiftClamps[0], getRandomInt(y_shiftClamps[1])));
                    // }

                    // if(i == 1) {
                    //     p0_original.add(new V2(x_shiftClamps[1], getRandomInt(y_shiftClamps[0])));
                    // }

                    // if(i > 1 && i < 4) {
                    //     p0_original.add(new V2(getRandomInt(-2,2), getRandomInt(-2,2)));
                    // }

                    let p1 = p0.add(V2.right.rotate(-45 + getRandomInt(-10,10)).mul(getRandomInt(1,1)));
                    let p2 = p1.add(d[1].mul(l))
                    let p3 = p1.add(d[0].mul(l))

                    
                    let xShift = getRandomInt(raysXShiftClamps) //getRandomInt(0,2) == 0 ? 

                    // if(i == 0) {
                    //     xShift = raysXShiftClamps[0]
                    // }

                    // if(i == 1) {
                    //     xShift = raysXShiftClamps[1]
                    // }

                    let xShiftValues = xShift == 0 ? new Array(totalFrames).fill(0) : easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'quad', method: 'inOut', round: 0})
                    let aValues = (
                        aChangePredicate() ? //xShift != 0 ? 
                        [
                        ...easing.fast({ from: 0, to: alphaValue, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 3}),
                        ...easing.fast({ from: alphaValue, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 3})
                    ] : new Array(totalFrames).fill(alphaValue));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            corners: [p0, p1, p2, p3].map(p => p.add(new V2(xShiftValues[f], 0))),
                            a: aValues[f]
                        };
                    }
                
                    return {
                        frames
                    }
                }))
            });
            
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                        //rgba(239,195,129,

                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            pp.setFillStyle(colorPrefix + itemData.frames[f].a); 

                            pp.fillByCornerPoints(itemData.frames[f].corners, { fixOpacity: true })
                        }
                        
                    }

                    if(raysMask) {
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(raysMask, 0, 0)
                    }
                });
            }
            
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createParticlesFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let availablePoints = appSharedPP.fillByCornerPoints([
new V2(13, 92),
new V2(56, 21),
new V2(143, 20),
new V2(182, 92),
                        ])

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let p = availablePoints[getRandomInt(0, availablePoints.length-1)];
                            let xShift = getRandomInt(-5,5);
                            let maxAValue = getRandom(0.05,0.15);

                            let aValues = [
                                ...easing.fast({from: 0, to: maxAValue, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}), 
                                ...easing.fast({from: maxAValue, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                            ] 

                            let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    a: aValues[f] != undefined ? aValues[f] : 0
                                };
                            }
                        
                            return {
                                p,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')').dot(itemData.p.x + itemData.frames[f].xShift, itemData.p.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: [60, 120], size: this.size });
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                
            }
        }), 1)

        this.floor = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['floor', 'shirma'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [60,120], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p')),
                            smooth: { aClamps: [0,1], easingType: 'quad', easingMethod: 'inOut', easingRound: 1 }
                         });

                         this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.balcons = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['right_b', 'left_b'] }),
            init() {
                //
            }
        }), 5)

        this.upper_bars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['upper_bars'] }),
            init() {
                //
            }
        }), 7)

        let xClamps = [70,136];
        let angleClamps = [30,-30];
        let angleChangeToX = easing.fast({from: angleClamps[0], to: angleClamps[1], steps: xClamps[1]-xClamps[0], type: 'linear', round: 2}); 

        let linesCount = 110;
        let lineCount2 = 40;
        let raysMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let aValues = easing.fast({from: 1, to: 0, steps: linesCount, type: 'linear', method: 'base', round: 2} );
            for(let y = 0; y < linesCount; y++) {
                hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y,size.x,1)
            }

            // aValues = easing.fast({from: 1, to: 0, steps: lineCount2, type: 'linear', method: 'base', round: 2} );
            // for(let y = 0; y < lineCount2; y++) {
            //     hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y,size.x,1)
            // }
        })

        let raysMask_1 = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let aValues = easing.fast({from: 1, to: 0, steps: lineCount2, type: 'linear', method: 'base', round: 2} );
            for(let y = 0; y < lineCount2; y++) {
                hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y,size.x,1)
            }
        })

        let raysMask2 = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let aValues = easing.fast({from: 1, to: 0, steps: linesCount, type: 'linear', method: 'base', round: 2} );
            for(let y = 9; y < linesCount; y++) {
                hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y,size.x,1)
            }

            // aValues = easing.fast({from: 1, to: 0, steps: lineCount2, type: 'linear', method: 'base', round: 2} );
            // for(let y = 0; y < lineCount2; y++) {
            //     hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y,size.x,1)
            // }
        })

        let raysMask2_1 = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            let aValues = easing.fast({from: 1, to: 0, steps: lineCount2-4, type: 'quad', method: 'out', round: 2} );
            for(let y = 0; y < lineCount2-4; y++) {
                hlp.setFillColor(colorPrefix + aValues[y]).rect(0,y+9,size.x,1)
            }
        })

        

        this.left_rays = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let startPoint = new V2(70,0)
                let alphaValue = raysAlphaValues
                let itemsCount = 5

                let raysCount = 7;
                let xStep = 2;

                let aChangePredicate = () => false//getRandomInt(0,2) == 0

                if(!showFrames) {
                    let data = new Array(raysCount).fill().map((el, i) => ({
                        p0_original: startPoint.add(new V2(xStep*i,0)), angleOriginal: angleChangeToX[fast.r(startPoint.x+xStep*i)-xClamps[0]], angleDeviationClamp: [-0.3, 0.3],
                        length_original_clamps: [100, 130], x_shiftClamps: [-1, 0], y_shiftClamps: [-1,1], 
                        alphaValue, angleSpreadClamps: [-0.75,0.75], raysXShiftClamps:[0,0], itemsCount, aChangePredicate}))
    
                    let raysImg = createRayFrames({
                        framesCount: 1, itemFrameslength: 1, size: this.size,
                        data: data,
                        raysMask
                    })[0]
    
                    this.frames = createFramesWithMask(raysImg)
    
                    this.registerFramesDefaultTimer({});

                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            data.forEach(d => d.alphaValue = 0.5)

                            this.img =  
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(raysMask_1, 0, 0)
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.drawImage(createRayFrames({
                                    framesCount: 1, itemFrameslength: 1, size: this.size,
                                    data: data,
                                    raysMask_1
                                })[0], 0, 0)
                            })

                            //this.img = raysMask_1;
                        }
                    }))
                }
                
            }
        }), 6)

        this.central_rays1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let startPoint = new V2(87,0)
                let alphaValue = raysAlphaValues
                let itemsCount = 5

                let raysCount = 7;
                let xStep = 2;

                let aChangePredicate = () => false//getRandomInt(0,2) == 0

                if(!showFrames) {
                    let data = new Array(raysCount).fill().map((el, i) => ({
                        p0_original: startPoint.add(new V2(xStep*i,0)), angleOriginal: angleChangeToX[fast.r(startPoint.x+xStep*i)-xClamps[0]], angleDeviationClamp: [-0.3, 0.3],
                        length_original_clamps: [100, 130], x_shiftClamps: [-1, 0], y_shiftClamps: [-1,1], 
                        alphaValue, angleSpreadClamps: [-0.75,0.75], raysXShiftClamps:[0,0], itemsCount, aChangePredicate}))

                    let raysImg = createRayFrames({
                        framesCount: 1, itemFrameslength: 1, size: this.size,
                        data: data,
                        raysMask: raysMask2
                    })[0]

                    this.frames = createFramesWithMask(raysImg)

                    this.registerFramesDefaultTimer({});

                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            data.forEach(d => d.alphaValue = 0.5)
                            
                            this.img =  
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(raysMask2_1, 0, 0)
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.drawImage(createRayFrames({
                                    framesCount: 1, itemFrameslength: 1, size: this.size,
                                    data: data,
                                    raysMask2_1
                                })[0], 0, 0)
                            })

                            //this.img = raysMask_1;
                        }
                    }))
                }
            }
        }), 8)

        this.central_rays2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let startPoint = new V2(104,0)
                let alphaValue = raysAlphaValues
                let itemsCount = 5

                let raysCount = 7;
                let xStep = 2;

                let aChangePredicate = () => false//getRandomInt(0,2) == 0

                if(!showFrames) {
                    let data = new Array(raysCount).fill().map((el, i) => ({
                        p0_original: startPoint.add(new V2(xStep*i,0)), angleOriginal: angleChangeToX[fast.r(startPoint.x+xStep*i)-xClamps[0]], angleDeviationClamp: [-0.3, 0.3],
                        length_original_clamps: [100, 130], x_shiftClamps: [-1, 0], y_shiftClamps: [-1,1], 
                        alphaValue, angleSpreadClamps: [-0.75,0.75], raysXShiftClamps:[0,0], itemsCount, aChangePredicate}))

                    let raysImg = createRayFrames({
                        framesCount: 1, itemFrameslength: 1, size: this.size,
                        data: data,
                        raysMask: raysMask2
                    })[0]

                    this.frames = createFramesWithMask(raysImg)

                    this.registerFramesDefaultTimer({});

                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            data.forEach(d => d.alphaValue = 0.5)
                            
                            this.img =  
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(raysMask2_1, 0, 0)
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.drawImage(createRayFrames({
                                    framesCount: 1, itemFrameslength: 1, size: this.size,
                                    data: data,
                                    raysMask2_1
                                })[0], 0, 0)
                            })

                            //this.img = raysMask_1;
                        }
                    }))
                }
                else {
                    this.frames = resultFogFrames;
                    this.registerFramesDefaultTimer({});
                }
            }
        }), 8)

        this.right_rays = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let startPoint = new V2(120,0)
                let alphaValue = raysAlphaValues
                let itemsCount = 5

                let raysCount = 7;
                let xStep = 2;

                let aChangePredicate = () => false//getRandomInt(0,2) == 0

                if(!showFrames) {
                    let data = new Array(raysCount).fill().map((el, i) => ({
                        p0_original: startPoint.add(new V2(xStep*i,0)), angleOriginal: angleChangeToX[fast.r(startPoint.x+xStep*i)-xClamps[0]], angleDeviationClamp: [-0.3, 0.3],
                        length_original_clamps: [100, 130], x_shiftClamps: [-1, 0], y_shiftClamps: [-1,1], 
                        alphaValue, angleSpreadClamps: [-0.75,0.75], raysXShiftClamps:[0,0], itemsCount, aChangePredicate}))

                    let raysImg = createRayFrames({
                        framesCount: 1, itemFrameslength: 1, size: this.size,
                        data: data,
                        raysMask
                    })[0]


                    this.frames = createFramesWithMask(raysImg)

                    this.registerFramesDefaultTimer({});

                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            data.forEach(d => d.alphaValue = 0.5)
                            
                            this.img =  
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(raysMask_1, 0, 0)
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.drawImage(createRayFrames({
                                    framesCount: 1, itemFrameslength: 1, size: this.size,
                                    data: data,
                                    raysMask_1
                                })[0], 0, 0)
                            })

                            //this.img = raysMask_1;
                        }
                    }))
                }
            }
        }), 6)

        let circleImages = {};
        let cColors = [ '#FFFFFF' ]
        let maxSize = 6;
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < maxSize; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        this.bonfire = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let excludeImage = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(colorPrefix + 1 + ')')
                    .rect(75,106,50,20)
                    .rect(91,105,4,1)

                    let linesCount = 20;
                    let startY = 100
                    let aValues = easing.fast({from: 0, to: 1, steps: linesCount, type: 'linear', method: 'base', round: 2} );
                    for(let y = 0; y <linesCount; y++) {
                        hlp.setFillColor(colorPrefix + aValues[y] + ')').rect(0,startY-y,size.x,1)
                    }

                    hlp.setFillColor(colorPrefix + 1 + ')').rect(55,startY-linesCount+1,70,-50)
                })

                let createSmokeFrames = function({startPosition, xShiftCLamps, opacityClamps, angleClamps, speedClamps, sizeClamps,
                    framesCount, itemsCount, itemFrameslengthClamps, size, particles}) {
                    let frames = [];
                    
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let deviation = new V2(getRandom(-0.02, 0.02), getRandom(-0.1,0))
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = getRandomInt(itemFrameslengthClamps);
                    
                        let p0 = new V2(startPosition.x + getRandomInt(xShiftCLamps), startPosition.y)
                        let direction = V2.up.rotate(getRandom(angleClamps[0], angleClamps[1]))
                        let alphaValue = fast.r(getRandom(opacityClamps[0], opacityClamps[1]), 2);
                        let speed = getRandom(speedClamps[0], speedClamps[1])
                        let size = getRandomInt(sizeClamps);

                        let current_p = p0.clone();

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            current_p = current_p.add(direction.mul(speed)).add(deviation)
                    
                            frames[frameIndex] = {
                                p: current_p.clone(),
                            };
                        }
                    
                        return {
                            size,
                            alphaValue,
                            frames
                        }
                    })

                    let particlesData = particles == undefined ? [] : new Array(particles.itemsCount).fill().map((el, i) => {
                        let deviation = new V2(getRandom(-0.05, 0.05), getRandom(-0.1,0))
                        let startFrameIndex = getRandomInt(particles.startFrameIndexClamps);
                        let totalFrames = getRandomInt(particles.itemFrameslengthClamps);

                        let p0 = new V2(startPosition.x + getRandomInt(xShiftCLamps), startPosition.y)
                        let direction = V2.up.rotate(getRandom(angleClamps[0], angleClamps[1]))
                        let alphaValue = fast.r(getRandom(particles.opacityClamps[0], particles.opacityClamps[1]), 2);
                        let speed = getRandom(particles.speedClamps[0], particles.speedClamps[1])

                        let current_p = p0.clone();
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            current_p = current_p.add(direction.mul(speed)).add(deviation)
                    
                            frames[frameIndex] = {
                                p: current_p.clone(),
                            };
                        }

                        return {
                            alphaValue,
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {

                            for(let p = 0; p < particlesData.length; p++){
                                let itemData = particlesData[p];
                                
                                ctx.globalAlpha = 1;

                                if(itemData.frames[f]){
                                    let alpha = itemData.alphaValue;
                                    let p = itemData.frames[f].p;

                                    ctx.globalAlpha = alpha;
                                    hlp.setFillColor(particles.color).dot(p.toInt())
                                }
                                
                            }

                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                ctx.globalAlpha = 1;

                                if(itemData.frames[f]){
                                    let size = itemData.size;
                                    let alpha = itemData.alphaValue;
                                    let p = itemData.frames[f].p;

                                    ctx.globalAlpha = alpha;
                                    if(size == 0 ) {
                                        hlp.setFillColor('#FFF').dot(p)
                                    }
                                    else {
                                        ctx.drawImage(circleImages[cColors[0]][size], p.x, p.y);
                                    }
                                }
                                
                            }

                            ctx.globalAlpha = 1;
                            ctx.globalCompositeOperation = 'destination-out'
                            ctx.drawImage(excludeImage, 0, 0)
                        });
                    }
                    
                    return frames;
                }

                this.smoke_b = this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        

                        this.frames = createSmokeFrames({ 
                            startPosition: new V2(91,106),xShiftCLamps: [-5,3], opacityClamps: [0.05, 0.15], angleClamps: [-35,-25], speedClamps: [0.125, 0.25],
                            sizeClamps: [0, maxSize-3], framesCount: 300, itemsCount: 200, itemFrameslengthClamps: [100, 150] , size: this.size, 
                            particles: {
                                itemsCount: 5, startFrameIndexClamps: [220,250], itemFrameslengthClamps: [50,100], opacityClamps: [0.7,1], speedClamps: [0.2, 0.35],
                                color: '#8f3d24'
                            }
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bonfire'] })
                }))

                this.flameAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(JapaneseRoomScene.models.flameAnimation)
                    .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        ctx.drawImage(f, 0,0)
                    }))
                    ,
                    init() {
                        let totalFrames = 150;
                        let framesChangeValues = easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', round: 0})

                        this.currentFrame = 0;
                        this.img = this.frames[framesChangeValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = this.frames[framesChangeValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                this.smoke_f = this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        

                        this.frames = createSmokeFrames({ 
                            startPosition: new V2(91,106),xShiftCLamps: [-1,5], opacityClamps: [0.1, 0.3], angleClamps: [-35,-25], speedClamps: [0.125, 0.25],
                            sizeClamps: [0, maxSize-3], framesCount: 300, itemsCount: 100, itemFrameslengthClamps: [100, 150] , size: this.size,
                            particles: {
                                itemsCount: 10, startFrameIndexClamps: [60,80], itemFrameslengthClamps: [50,100], opacityClamps: [0.7,1], speedClamps: [0.2, 0.35],
                                color: '#8f3d24'
                            }
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [60,120], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bonfire_p')),
                            smooth: { aClamps: [0,1], easingType: 'quad', easingMethod: 'inOut', easingRound: 1 }
                         });

                         this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.hangingItems = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.lamp = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.img = PP.createImage(model, { renderOnly: ['lamp'] })
                        }
                    }) 
                )

                this.pot = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let potImg = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['pot'] }), 0, 0);
                            hlp.clear(92, 0, 3, 72)
                        })

                        let totalFrames = 300;
                        let xShiftValues = [
                            ...easing.fast({from: -1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: 0, to: -1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.frames = new Array(totalFrames).fill().map((_,i) => {
                            let xShift = xShiftValues[i];

                            return createCanvas(this.size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});

                                pp.lineV2(new V2(93,-50), new V2(93+xShift,72))

                                ctx.drawImage(potImg, xShift, 0);
                            })
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }) 
            )
            }
        }), 12)

        this.manAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let originalFrames = PP.createImage(JapaneseRoomScene.models.manAnimation)
                let framesIndicies = [
                    ...new Array(35).fill(0),
                    ...new Array(5).fill(1),
                    ...new Array(50).fill(2),
                    ...new Array(10).fill(1),
                    ...new Array(100).fill(0),
                    ...new Array(10).fill(3),
                    ...new Array(20).fill(4),
                    ...new Array(20).fill(3),
                    ...new Array(50).fill(0),
                ]

                this.currentFrame = 0;
                this.img = originalFrames[framesIndicies[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = originalFrames[framesIndicies[this.currentFrame]];
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 13)
    }
}