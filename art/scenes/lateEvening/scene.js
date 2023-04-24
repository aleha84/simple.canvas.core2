class LateEveningScene extends Scene {
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
                size: new V2(133,200).mul(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lateEvening',
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
        let model = LateEveningScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'bg_light', 'splashes_zone', 'floor_p','floor_p1','close_lamps_p', 'mid_lamps_p'
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

        let appSharedPP = PP.createNonDrawingInstance();
        let rgbColorPart = 'rgba(255,255,255,';

        this.splashes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSplashFrames({framesCount, splashesCount, startPoints, itemFrameslengthClamps, maxA, size, gravityClamps, particlesCountClamps = [3,5]}) {
                let frames = [];
                //let gravity = 0.02;
                
                if(!gravityClamps) {
                    gravityClamps = [0.035,0.06]
                }

                let itemsData = new Array(splashesCount).fill().map((startPointIndex, i) => {
                    let startPoint = startPoints[getRandomInt(0, startPoints.length-1)]
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = framesCount;
                    let itemsCount = getRandomInt(particlesCountClamps);

                    let frames = [];

                    let particlesData = new Array(itemsCount).fill().map((_, ii) => ({
                        ttl: getRandomInt(itemFrameslengthClamps),
                        speedV: V2.up.rotate(getRandomInt(0, 20)*(ii%2==0 ? -1 : 1)).mul(getRandom(0.25,0.75)),  //new V2(getRandom(0,0.2)*(ii%2==0 ? -1 : 1), getRandom(-0.4, -0.8)),
                        currentP: startPoint.add(new V2(getRandomInt(-1,1),0)),
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

                            framesData[framesData.length] = {
                                p: currentPd.currentP.clone(),
                                a: currentPd.aValues[f]
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
                                    if(pd.a != undefined)
                                        hlp.setFillColor(rgbColorPart + pd.a + ')').dot(pd.p.toInt())
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createSmallDropsFrames({framesCount, itemsCount, itemFrameslengthClamps, aClamps, availablePoints, size}) {
                let frames = [];
            
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)
                    let p = availablePoints[getRandomInt(0, availablePoints.length-1)]

                    if(p.y < 145) {
                        a*=0.6
                    }
                    else if(p.y < 155) {
                        a*=0.75
                    }
                    else if(p.y < 170) {
                        a*=0.85
                    }

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            visible: true
                        };
                    }
                
                    return {
                        p, a,
                        frames
                    }
                })
            
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(rgbColorPart + itemData.a + ')').dot(itemData.p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createDropsFrames({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions, reduceOpacityOnFall = false,
                type, method}) {
                    let frames = [];
  
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
    
                    let startPosition = startPositions[getRandomInt(0, startPositions.length-1)];
                    let p = undefined; 
                    if(startPosition.type == 'points') {
                        p = startPosition.points[getRandomInt(0, startPosition.points.length-1)]
                    }
                    else {
                        p = new V2(getRandomInt(startPosition.xClamps), startPosition.y);
                    }
                    let height = startPosition.height;
                    let maxTailLength = startPosition.tail || 0;
    
                    let part1Length = getRandomInt(itemFrameslength1Clamps);
                    let part2Length = getRandomInt(itemFrameslength2Clamps)
    
                    let totalFrames = part1Length + part2Length
                    let opacity = fast.r(getRandom(opacityClamps[0], opacityClamps[1]),2);
                    let part1Alpha = easing.fast({from: 0, to: opacity, steps: part1Length, type: 'linear', round: 2})
                    let part2Alpha = undefined;
                    if(reduceOpacityOnFall) {
                        part2Alpha = easing.fast({from: opacity, to: 0, steps: part2Length, type: 'linear', round: 2})
                    }

                    let part2YChange = easing.fast({from: p.y, to: p.y + height, steps: part2Length, type, method, round: 0})
                    let tailChangeValues = undefined;
                    if(maxTailLength > 0) {
                        tailChangeValues = easing.fast({from: 0, to: maxTailLength, steps: part2Length, type: 'expo', method: 'in', round: 0})
                    }
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
    
                        let y = p.y;
                        let alpha = 0;
                        if(f < part1Length) {
                            alpha = part1Alpha[f];
                        }
                        else {
                            y = part2YChange[f-part1Length];
                            alpha = part2Alpha ? part2Alpha[f-part1Length] : opacity
                        }
                
                        let tail = 0;
                        if(tailChangeValues) {
                            tail = tailChangeValues[f-part1Length];
                        }
    
                        frames[frameIndex] = {
                            y,
                            tail,
                            alpha
                        };
                    }
                
                    return {
                        x: p.x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
    
                                let p = new V2(itemData.x, itemData.frames[f].y);
    
                                hlp.setFillColor(rgbColorPart + itemData.frames[f].alpha + ')').dot(p);
    
                                if(itemData.frames[f].tail > 0) {
                                    for(let i = 0; i < itemData.frames[f].tail; i++) {
                                        hlp.dot(p.add(new V2(0, i+1)));
                                    }
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {

                //let zone1 = PP.createImage(model, { renderOnly: ['splashes_zone'], forceVisibility: { splashes_zone: { visible: true } } });
                let sz = model.main.layers.find(l => l.name == 'splashes_zone');

                new Array(3).fill().map((el,i) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let ic = 400;
                        if(i > 0) {
                            ic = 100;
                        }

                        this.frames = this.parent.createSmallDropsFrames({ framesCount: 200, itemsCount: ic, itemFrameslengthClamps: [5,10], aClamps: [0.3, 0.7],
                            availablePoints: appSharedPP.fillByCornerPoints(sz.groups[i].points.map(p => new V2(p.point))),
                        size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                })))
                
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [15,30], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p1'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 200, itemFrameslength: [30,50], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.bigSplashesFloor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.5, splashesCount: 20, itemFrameslengthClamps: [10,15], 
                            startPoints: [
                                ...appSharedPP.fillByCornerPoints([new V2(34,189), new V2(43,175), new V2(48,167), new V2(57,166), new V2(54,170), new V2(58,177), new V2(57,199), new V2(35,199) ]),
                                ...appSharedPP.fillByCornerPoints([new V2(86,199),new V2(90,190),new V2(89,183),new V2(79,177),new V2(82,165),new V2(93,164),new V2(107,199) ])
                            ].map(p => new V2(p)), 
                            gravityClamps: [0.06,0.11], particlesCountClamps: [2,3], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.bigSplashesPerila = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.35, splashesCount: 20, itemFrameslengthClamps: [10,13], 
                            startPoints: [
                                ...appSharedPP.fillByCornerPoints([new V2(0,158), new V2(31,147), new V2(0,161)]),
                                ...appSharedPP.fillByCornerPoints([new V2(132,154), new V2(101,144), new V2(132,157)]),
                            ].map(p => new V2(p)), 
                            gravityClamps: [0.045,0.09], particlesCountClamps: [2,3], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.bigSplashes2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.35, splashesCount: 30, itemFrameslengthClamps: [8,12], 
                            startPoints: [
                                ...appSharedPP.fillByCornerPoints([new V2(36,145), new V2(48,139), new V2(36,146)]),
                                ...appSharedPP.fillByCornerPoints([new V2(96,141), new V2(87,138), new V2(95,141)])
                            ].map(p => new V2(p)), 
                            gravityClamps: [0.075,0.15], particlesCountClamps: [2,2], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.perilaDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createDropsFrames({ itemsCount: 50, framesCount: 200, itemFrameslength1Clamps: [1,1], itemFrameslength2Clamps: [25, 30], 
                            reduceOpacityOnFall: true, size: this.size,
                            opacityClamps: [0.2, 0.3], type: 'quad', method: 'in',
                            startPositions: [
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(0,172), new V2(25,158)),
                                    ...appSharedPP.lineV2(new V2(132,167), new V2(110,154)),
                                    ...appSharedPP.lineV2(new V2(5,181), new V2(21,169)),
                                    ...appSharedPP.lineV2(new V2(130,176), new V2(113,163)),
                                    ...appSharedPP.lineV2(new V2(132,188), new V2(110,167)),
                                    ...appSharedPP.lineV2(new V2(0,197), new V2(27,173))
                                ], height: 5, tail: 0 }
                            ] })
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.floor.renderIndex+1)

        this.lampDropsAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDropsFallFrames({framesCount, initialPoints, p0xShiftClamps, fallLengthClamps, ttlClamps, itemsCount,speedYChangeClamps, speedXChangeClamps, size}) {
                let frames = [];

                // let p0 = new V2(82, 50);
                // let fallLengthClamps = [40, 50];
                // let ttlClamps = [70, 100];

                let itemsData = new Array(initialPoints.length).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    //let totalFrames = itemFrameslength;
                
                    let ttl = getRandomInt(ttlClamps);
                    let aValues = easing.fast({from: 1, to: 0, steps: ttl, type: 'quad', method: 'out', round: 2})
                    let fallLength = getRandomInt(fallLengthClamps);
                    let currentP = new V2(initialPoints[i])     //new V2(initialPoints[getRandomInt(0, initialPoints.length-1)])

                    if(p0xShiftClamps) {
                        currentP.x+=getRandomInt(p0xShiftClamps)//getRandomInt(-1,1)
                    }
                    
                    let speed = new V2(0,getRandom(0, 0))
                    let speedYChange = getRandom(speedYChangeClamps[0], speedYChangeClamps[1]) //getRandom(0.01, 0.035)/2
                    let speedXChange = getRandom(speedXChangeClamps[0], speedXChangeClamps[1])//getRandom(0.02, 0.04)

                    let frames = [];
                    for(let f = 0; f < ttl; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: currentP.clone(),
                            a: aValues[f]
                        };

                        currentP = currentP.add(speed);
                        speed.y += speedYChange;

                        if(f > fallLength) {
                            speed.x += speedXChange;    
                        }
                    }
                
                    return {
                        frames
                    }
                })
                
                //let rgbColorPart = 'rgba(255,255,255,'
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(rgbColorPart + itemData.frames[f].a + ')').dot(itemData.frames[f].p.toInt())
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createDropsFallFrames({framesCount: 200, initialPoints: [
                    ...appSharedPP.lineV2(new V2(77,33), new V2(80,33)),
                    ...appSharedPP.lineV2(new V2(59,54), new V2(62,56)),
                    ...appSharedPP.lineV2(new V2(63,-1), new V2(65,-1)),
                    new V2(96,31), new V2(74,71)
                ], fallLengthClamps: [5, 10], ttlClamps: [60, 80], 
                    itemsCount: 15,speedYChangeClamps: [0.06, 0.09], speedXChangeClamps: [-0.02/1.5, -0.04/1.5], size: this.size});
                this.registerFramesDefaultTimer({});
            }
        }), layersData.close_lamp1.renderIndex-1)

        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size,
            xClamps, upperYClamps, angleClamps, lowerYClamps, lengthClamps, maxA, lightData
        }) {
            let frames = [];
            
            
            itemFrameslength = fast.r(itemFrameslength*1.5)
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p0 = new V2(getRandomInt(xClamps),getRandomInt(upperYClamps))

                let lowerY = getRandomInt(lowerYClamps);
                let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}

                let angle = getRandom(angleClamps[0], angleClamps[1])
                let p1 = raySegmentIntersectionVector2(p0, V2.down.rotate(angle), bottomLine).toInt();

                let points = appSharedPP.lineV2(p0, p1); 
                let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})

                let len = getRandomInt(lengthClamps);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: f
                    };
                }
            
                return {
                    pointsIndexValues,
                    points,
                    frames,
                    len
                }
            })

            let putLightAValue = (hlp, p) => {
                let aValue = 0;
                
                if(!lightData)
                    aValue = maxA
                else {
                    lightData.forEach(ld => {
                        if(ld.gradientDots[p.y]) {
                            if(ld.gradientDots[p.y][p.x]) {
                                let a = ld.gradientDots[p.y][p.x].maxValue//*ld.aMultiplier*aMul;
                                rgbColorPart = ld.rgbColorPart;
                                if(a > 1) 
                                    aValue = 1;
                                   
                                aValue*=maxA;
                            }
                        }
                    })
                }
                
                if(aValue > 0) {
                    hlp.setFillColor(rgbColorPart + aValue + ')').dot(p.x,p.y)
                }
            }
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let pointIndex = itemData.pointsIndexValues[itemData.frames[f].index];

                            for(let i = 0; i < itemData.len; i++) {
                                let pi = pointIndex + i;
                                if(pi < itemData.points.length){
                                    let lp = itemData.points[pi];
                                    putLightAValue(hlp, lp)
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let rainData = [
            {
                gradientData: { center: new V2(68, 114), radius: new V2(25,40), gradientOrigin: new V2(68, 104), aValueMul: 3 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 1000, itemFrameslength: 45, 
                    xClamps: [45,100], upperYClamps: [70,80], angleClamps: [15,20], lowerYClamps: [130,140], lengthClamps: [3,4], maxA: 0.02,
                },                 
                layerIndex: layersData.far_lamps.renderIndex-1
            },
            {
                gradientData: { center: new V2(66, 95), radius: new V2(10,6), gradientOrigin: new V2(66, 93), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 500, itemFrameslength: 45, 
                    xClamps: [45,100], upperYClamps: [70,80], angleClamps: [15,20], lowerYClamps: [130,140], lengthClamps: [3,4], maxA: 0.8,
                },                 
                layerIndex: layersData.far_lamps.renderIndex+1
            },
            {
                gradientData: { center: new V2(72, 100), radius: new V2(8,8), gradientOrigin: new V2(72, 97), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 500, itemFrameslength: 45, 
                    xClamps: [45,100], upperYClamps: [70,80], angleClamps: [15,20], lowerYClamps: [130,140], lengthClamps: [3,4], maxA: 0.8,
                },                 
                layerIndex: layersData.far_lamps.renderIndex+1
            },
            {
                gradientData: { center: new V2(73, 90), radius: new V2(8,8), gradientOrigin: new V2(73, 87), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 500, itemFrameslength: 45, 
                    xClamps: [45,100], upperYClamps: [70,80], angleClamps: [15,20], lowerYClamps: [130,140], lengthClamps: [3,4], maxA: 0.8,
                },                 
                layerIndex: layersData.far_lamps.renderIndex+1
            },

            {
                gradientData: { center: new V2(64, 105), radius: new V2(25,45), gradientOrigin: new V2(64, 100), aValueMul: 4 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 600, itemFrameslength: 36, 
                    xClamps: [45,100], upperYClamps: [60,70], angleClamps: [20,25], lowerYClamps: [130,145], lengthClamps: [3,5], maxA: 0.035,
                },                 
                layerIndex: layersData.mid_lamp_3.renderIndex-1
            },
            {
                gradientData: { center: new V2(64, 85), radius: new V2(18,10), gradientOrigin: new V2(64, 80), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 600, itemFrameslength: 36, 
                    xClamps: [45,100], upperYClamps: [60,70], angleClamps: [20,25], lowerYClamps: [130,145], lengthClamps: [3,5], maxA: 0.8,
                },                 
                layerIndex: layersData.mid_lamp_3.renderIndex+1
            },

            {
                gradientData: { center: new V2(77, 105), radius: new V2(35,60), gradientOrigin: new V2(77, 94), aValueMul: 4 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 500, itemFrameslength: 33, 
                    xClamps: [45,125], upperYClamps: [50,60], angleClamps: [20,30], lowerYClamps: [135,150], lengthClamps: [3,6], maxA: 0.055,
                },                 
                layerIndex: layersData.mid_lamp_2.renderIndex-1
            },
            {
                gradientData: { center: new V2(76, 77), radius: new V2(24,12), gradientOrigin: new V2(76, 71), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 600, itemFrameslength: 33, 
                    xClamps: [45,125], upperYClamps: [50,60], angleClamps: [20,30], lowerYClamps: [135,150], lengthClamps: [3,6], maxA: 0.8,
                },                 
                layerIndex: layersData.mid_lamp_2.renderIndex+1
            },

            {
                gradientData: { center: new V2(64, 100), radius: new V2(40,75), gradientOrigin: new V2(64, 85), aValueMul: 4 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 500, itemFrameslength: 30,
                    xClamps: [40,120], upperYClamps: [35,45], angleClamps: [20,30], lowerYClamps: [140,150], lengthClamps: [4,6], maxA: 0.08
                },                 
                layerIndex: layersData.mid_lamp_1.renderIndex-1
            },
            {
                gradientData: { center: new V2(63, 62), radius: new V2(24,16), gradientOrigin: new V2(63, 56), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 600, itemFrameslength: 30,
                    xClamps: [40,120], upperYClamps: [35,45], angleClamps: [20,30], lowerYClamps: [140,150], lengthClamps: [4,6], maxA: 0.7
                },                 
                layerIndex: layersData.mid_lamp_1.renderIndex+1
            },
            {
                gradientData: { center: new V2(79, 95), radius: new V2(65,105), gradientOrigin: new V2(79, 70), aValueMul: 4 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 400, itemFrameslength: 25, 
                    xClamps: [30,140], upperYClamps: [10,20], angleClamps: [15,30], lowerYClamps: [150,165], lengthClamps: [5,8], maxA: 0.1,
                },                 
                layerIndex: layersData.close_lamp2.renderIndex-1
            },
            {
                gradientData: { center: new V2(81, 52), radius: new V2(30,25), gradientOrigin: new V2(81, 33), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 400, itemFrameslength: 25, 
                    xClamps: [60,110], upperYClamps: [10,20], angleClamps: [15,30], lowerYClamps: [150,165], lengthClamps: [5,8], maxA: 0.8,
                },                 
                layerIndex: layersData.close_lamp2.renderIndex+1
            },

            {
                gradientData: { center: new V2(65, 85), radius: new V2(80,135), gradientOrigin: new V2(65, 70), aValueMul: 4 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 400, itemFrameslength: 22, 
                    xClamps: [0,160], upperYClamps: [-20,-10], angleClamps: [15,30], lowerYClamps: [160,170], lengthClamps: [8,9], maxA: 0.15,
                },                 
                layerIndex: layersData.close_lamp1.renderIndex-1
            },
            {
                gradientData: { center: new V2(61, -5), radius: new V2(50,40), gradientOrigin: new V2(61, 10), aValueMul: 1 },
                rainFramesData: {
                    framesCount: 200, itemsCount: 300, itemFrameslength: 22, 
                    xClamps: [20,90], upperYClamps: [-20,-10], angleClamps: [15,30], lowerYClamps: [160,170], lengthClamps: [8,9], maxA: 0.9,
                },                 
                layerIndex: layersData.close_lamp1.renderIndex+1
            }
        ]

        this.rainLayers = rainData.map(rd => this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let lightData = colors.createRadialGradient({ size: this.size, center: rd.gradientData.center, radius: rd.gradientData.radius, 
                    gradientOrigin: rd.gradientData.gradientOrigin, angle: 0,
                    setter: (dot, aValue) => {
                        aValue*=rd.gradientData.aValueMul;
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } })

                let gradientDots = lightData;    
                let maskImg = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue})`).dot(x,y)
                                }
                            }
                        }
                    }
                })

                //this.img = maskImg

                this.frames = createRainFrames({...rd.rainFramesData, size: this.size}).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(f, 0, 0)
                    ctx.globalCompositeOperation = 'destination-in'
                    ctx.drawImage(maskImg, 0, 0)
                 }))

                 this.registerFramesDefaultTimer({});
            }
            }), rd.layerIndex)
        )

        this.close_lamp_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_lamps_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [15,30], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
            }
        }), layersData.close_lamp1.renderIndex+1)

        this.mid_lamps_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'mid_lamps_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 200, itemFrameslength: [40,70], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parentScene.capturing.stop = true;
                            }
                        });
            }
        }), layersData.mid_lamp_1.renderIndex+1)
    }
}