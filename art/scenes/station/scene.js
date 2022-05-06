class StationScene extends Scene {
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
                fileNamePrefix: 'station',
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
        let enbaleRain = true;
        let enbaleFarRain = true;

        let model = StationScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'drops_z0', 'drops_z1', 'drops_z2', 'station_close_p', 'fg_p'
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

        console.log(layersData)

        let fgLightSource = {
            center: new V2(-5,-5),
            radius: 100,
        }

        let createTreesMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size, 
            type = 'quad', method = 'inOut',
            oneWayOnly =false}) {
            let frames = [];
            let images = [];

            let itemsCount = animationsModel.main[0].layers.length;

            let framesIndiciesChange = oneWayOnly ? 
            easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength, type: 'quad', method: 'inOut', round: 0 })
            : [
                ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type, method, round: 0 }),
                ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type, method, round: 0 })
            ]

            for(let i = 0; i < itemsCount; i++) {
                let name = animationsModel.main[0].layers[i].name;
                if(!name) {
                    name = animationsModel.main[0].layers[i].id
                } 

                images[i] = PP.createImage(animationsModel, { renderOnly: [name] }) //'l' + (i+1)
            }
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = startFramesSequence ? 
                startFramesSequence[i]
                : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                
                let totalFrames = itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: framesIndiciesChange[f]
                    };
                }

                if(additional) {
                    let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
                    for(let f = 0; f < additional.frameslength; f++){
                        let frameIndex = f + startFrameIndex1;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            index: additional.framesIndiciesChange[f]
                        };
                    }
                }
                
            
                return {
                    img: images[i],
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            ctx.drawImage(itemData.img[index], 0, 0);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let createDropsFrames = function({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, color, lightParams, startPositions,
            type, method}) {
                let frames = [];
                
                // let lCenter = lightParams.center //new V2(66,21);
                // let radius = lightParams.radius //40;
                // let opacityDistanceValues = easing.fast({from: lightParams.from, to: lightParams.to, steps: radius, type: 'linear', round: 2 });

                //let startPositions = 

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                //let totalFrames = itemFrameslength;

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
                        alpha = opacity
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

                            //let a = lightParams.to;
                            let p = new V2(itemData.x, itemData.frames[f].y);
                            //let distance = fast.r(lCenter.distance(p));
                            // if(distance < radius) {
                            //     a = opacityDistanceValues[distance];
                            // }

                            //ctx.globalAlpha = a*itemData.frames[f].alpha;

                            hlp.setFillColor('rgba(255,255,255,' + itemData.frames[f].alpha + ')').dot(p);

                            if(itemData.frames[f].tail > 0) {
                                for(let i = 0; i < itemData.frames[f].tail; i++) {
                                    hlp.dot(p.add(new V2(0, i+1)));
                                }
                            }

                            //ctx.globalAlpha = 1;
                            //hlp.setFillColor(`rgba(154,160,165, ${itemData.frames[f].alpha})`).dot(itemData.p.x, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let createRainFrames = function({framesCount, itemsCount, lowerYClamps, direction, maxA, minA = 0, trailLenght, itemFrameslength, size, lightData, xClamps, renderOnlyLightData = false}) {
            let frames = [];
            
            let trailAValues = [
                ...easing.fast({from: maxA, to: minA, steps: trailLenght, type: 'quad', method: 'out', round: 3 }).slice(1).reverse(),
                maxA,
                ...easing.fast({from: maxA, to: minA, steps: trailLenght, type: 'quad', method: 'out', round: 3 }).slice(1)
            ]
            
            let sharedPP = PP.createNonDrawingInstance();

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength; //getRandomInt(itemFrameslengthClamps);
                let yShift = getRandomInt(0, 40)
                let bottomLine = {begin: new V2(-1000, size.y+yShift), end: new V2(1000, size.y+yShift)}
                let lowerY = getRandomInt(lowerYClamps);

                if(!xClamps) {
                    xClamps = [0, size.x+30]
                }

                let from = new V2(getRandomInt(xClamps), -yShift);
                let to = raySegmentIntersectionVector2(from, V2.down.rotate(getRandom(direction[0], direction[1])), bottomLine);
                let points = sharedPP.lineV2(from, to); 
                let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: f,
                    };
                }
            
                return {
                    lowerY,
                    points,
                    pointsIndexValues,
                    frames
                }
            })

            let putLightAValue = undefined;

            if(lightData) {
                putLightAValue = (hlp, p, aMul) => {
                    let maxA = 0;
                    let rgbColorPart = '';
                    lightData.forEach(ld => {
                        if(ld.gradientDots[p.y]) {
                            if(ld.gradientDots[p.y][p.x]) {
                                let a = ld.gradientDots[p.y][p.x].maxValue*ld.aMultiplier*aMul;
                                rgbColorPart = ld.rgbColorPart;
                                if(a > 1) 
                                    a = 1;
                                   
                                if(maxA < a) {
                                    maxA = a;
                                }
                            }
                        }
                    })
                    
                    if(maxA > 0) {
                        hlp.setFillColor(rgbColorPart + maxA + ')').dot(p.x,p.y)
                    }
                }
            }
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let pointIndex = itemData.pointsIndexValues[itemData.frames[f].index];

                            let prev = undefined;
                            for(let i = 0; i < trailAValues.length; i++) {
                                let pi = pointIndex + i;
                                if(pi < itemData.points.length && itemData.points[pi].y < itemData.lowerY) {
                                    let lp = itemData.points[pi]
                                    if(!renderOnlyLightData) {
                                        hlp.setFillColor('rgba(255,255,255,' + trailAValues[i] + ')').dot(lp)
                                        if(prev && lp.x != prev.x) {
                                            hlp.setFillColor('rgba(255,255,255,' + trailAValues[i]/2 + ')')
                                                .dot(lp.x+1, lp.y).dot(lp.x, lp.y-1)
                                        }
                                    }
                                    

                                    if(putLightAValue) {
                                        putLightAValue(hlp, lp, trailAValues[i])
                                        if(prev && lp.x != prev.x) {
                                            putLightAValue(hlp, {x: lp.x+1, y: lp.y }, trailAValues[i]/2)
                                            putLightAValue(hlp, {x: lp.x, y: lp.y-1}, trailAValues[i]/2)
                                        }
                                        
                                        // 
                                    }

                                    prev = {x: lp.x, y: lp.y};
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

        if(enbaleFarRain) {
            this.stationRain = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let stationGradientDots0 = colors.createRadialGradient({ size: this.size, center: new V2(95, 122), radius: new V2(17,25), 
                        gradientOrigin: new V2(103, 103), angle: 30,
                        setter: (dot, aValue) => {
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })
    
                    let stationGradientDots1 = colors.createRadialGradient({ size: this.size, center: new V2(110, 120), radius: new V2(20,30), 
                        gradientOrigin: new V2(118, 95), angle: 20,
                        setter: (dot, aValue) => {
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })
    
                    let stationGradientDots2 = colors.createRadialGradient({ size: this.size, center: new V2(135, 118), radius: new V2(20,35), 
                        gradientOrigin: new V2(144, 89), angle: 25,
                        setter: (dot, aValue) => {
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })
    
                    let stationGradientDots3 = colors.createRadialGradient({ size: this.size, center: new V2(170, 95), radius: new V2(25,40), 
                        gradientOrigin: new V2(181, 65), angle: 25,
                        setter: (dot, aValue) => {
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })
    
                        let lightData =  [
                            { gradientDots: stationGradientDots0, aMultiplier: 1.25, rgbColorPart: 'rgba(252,219,135,' },
                            { gradientDots: stationGradientDots1, aMultiplier: 1.7, rgbColorPart: 'rgba(252,219,135,' },
                            { gradientDots: stationGradientDots2, aMultiplier: 2, rgbColorPart: 'rgba(244,196,162,' },
                            { gradientDots: stationGradientDots3, aMultiplier: 2.15, rgbColorPart: 'rgba(244,196,162,' }
                        ]
    
                        this.light = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    lightData.forEach(ld => {
                                        let gradientDots = ld.gradientDots;    
                                        for(let y = 0; y < gradientDots.length; y++) {
                                            if(gradientDots[y]) {
                                                for(let x = 0; x < gradientDots[y].length; x++) {
                                                    if(gradientDots[y][x]) {
                                                        hlp.setFillColor(`${ld.rgbColorPart}${fast.r(gradientDots[y][x].maxValue/6,3)})`).dot(x,y)
                                                    }
                                                }
                                            }
                                        }
                                    })
                                    
                                })
                            }
                        }))
                        // let gradientDots = stationGradientDots3;    
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     for(let y = 0; y < gradientDots.length; y++) {
                        //         if(gradientDots[y]) {
                        //             for(let x = 0; x < gradientDots[y].length; x++) {
                        //                 if(gradientDots[y][x]) {
                        //                     hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue})`).dot(x,y)
                        //                 }
                        //             }
                        //         }
                        //     }
                        // })
    
                        this.frames = createRainFrames({
                            framesCount: 100, itemsCount: 500, lowerYClamps: [140, 150], direction: [3, 6], maxA: 0.55, minA: 0.4, trailLenght: 3, 
                            xClamps: [70, 210], itemFrameslength: 100, size: this.size, renderOnlyLightData: true,
                            lightData
                        });
        
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });
                }
            }), layersData.station.renderIndex+1)

        }

        if(enbaleRain) {
            this.bgRain = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let framesData = [
                        {
                            framesCount: 100, itemsCount: 1200, lowerYClamps: [165, 175], direction: [3, 4], maxA: 0.05, minA: 0.015, trailLenght: 3, itemFrameslength: 80, size: this.size
                        },
                        {
                            framesCount: 100, itemsCount: 800, lowerYClamps: [165, 175], direction: [3, 5], maxA: 0.075, minA: 0.035, trailLenght: 4, itemFrameslength: 70, size: this.size
                        }
                    ]
    
                    this.rainLayers = framesData.map(fd => this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: createRainFrames(fd),
                        init() {
                            this.registerFramesDefaultTimer({});
                        }
                    })))
                }
            }), layersData.bg.renderIndex+2)
    
            this.fg1Rain = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let framesData = [
                        {
                            framesCount: 100, itemsCount: 700, lowerYClamps: [170, 180], direction: [3, 6], maxA: 0.125, trailLenght: 5, itemFrameslength: 60, size: this.size
                        },
                        {
                            framesCount: 100, itemsCount: 600, lowerYClamps: [180, 195], direction: [3, 8], maxA: 0.15, trailLenght: 6, itemFrameslength: 50, size: this.size
                        }
                    ]
    
                    this.rainLayers = framesData.map(fd => this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: createRainFrames(fd),
                        init() {
                            this.registerFramesDefaultTimer({});
                        }
                    })))
                }
            }), layersData.stolb1.renderIndex-2)
    
    
            let frontalGradientDots = colors.createRadialGradient({ size: this.viewport.clone(), center: new V2(-5, -5), radius: new V2(140,100), gradientOrigin: new V2(-5, -5), angle: 0,
                setter: (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                        dot.maxValue = aValue;
                    }
    
                    if(aValue > dot.maxValue)
                        dot.maxValue = aValue;
    
                    dot.values.push(aValue);
                } })
    
            this.fg2Rain = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    this.frames = createRainFrames({
                        framesCount: 100, itemsCount: 200, lowerYClamps: [190, 210], direction: [4, 10], maxA: 1, minA: 0.5, renderOnlyLightData: true, trailLenght: 5, 
                        xClamps: [0, 150], itemFrameslength: 40, size: this.size,
                        lightData: [{ gradientDots: frontalGradientDots, aMultiplier: 2, rgbColorPart: 'rgba(244,196,162,' }]
                    });
    
                    this.registerFramesDefaultTimer({
                        framesChangeCallback: () => {
                            let foo = true;
                        }
                    });
                }
            }),  layersData.stolb1.renderIndex-1)
        }

        

        this.fg3Rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({
                    framesCount: 100, itemsCount: 50, lowerYClamps: [220, 240], direction: [4, 10], maxA: 0.3, trailLenght: 15, 
                    itemFrameslength: 30, size: this.size, xClamps: [50, 220]
                    //lightData: [{ gradientDots: frontalGradientDots, aMultiplier: 1.5, rgbColorPart: 'rgba(244,196,162,' }]
                });

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }),  layersData.fg.renderIndex+2)

        this.fg4Rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({
                    framesCount: 100, itemsCount: 30, lowerYClamps: [220, 240], direction: [4, 10], maxA: 0.45, trailLenght: 15, 
                    itemFrameslength: 25, size: this.size, xClamps: [50, 220]
                    //lightData: [{ gradientDots: frontalGradientDots, aMultiplier: 1.5, rgbColorPart: 'rgba(244,196,162,' }]
                });

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }),  layersData.fg.renderIndex+2)

        this.frontalDrops2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.stolbDrops = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createDropsFrames({ itemsCount: 7, framesCount: 100, itemFrameslength1Clamps: [30,40], itemFrameslength2Clamps: [30, 50], size: this.size,
                            opacityClamps: [0.2, 0.4], type: 'quad', method: 'in',
                            startPositions: [
                                { type: 'points', points: PP.createNonDrawingInstance().lineV2(new V2(9,58), new V2(13, 54)), height: 100, tail: 2 }
                            ] })
            
                            this.registerFramesDefaultTimer({});
                    }
                }))

                
            }
        }), layersData.stolb1.renderIndex+1)

        this.frontalDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.fenceDrops = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createDropsFrames({ itemsCount: 20, framesCount: 100, itemFrameslength1Clamps: [30,40], itemFrameslength2Clamps: [30, 50], size: this.size,
                            opacityClamps: [0.3, 0.5], type: 'quad', method: 'in',
                            startPositions: [
                                { xClamps: [0, 4], y: 103, tail: 2, height: 100  },
                                { xClamps: [11, 17], y: 103, tail: 2, height: 100 },
                                { xClamps: [18, 24], y: 103, tail: 2, height: 100 },
                                { xClamps: [31, 37], y: 103, tail: 2, height: 100 },
                            ] })
            
                            this.registerFramesDefaultTimer({});
                    }
                }))

                this.benchDrops = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createDropsFrames({ itemsCount: 15, framesCount: 100, itemFrameslength1Clamps: [30,40], itemFrameslength2Clamps: [20, 30], size: this.size,
                            opacityClamps: [0.4, 0.6], type: 'quad', method: 'in',
                            startPositions: [
                                { type: 'points', points: PP.createNonDrawingInstance().lineV2(new V2(78,197), new V2(105, 192)), height: 100 }
                            ] })
            
                            this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.fg.renderIndex+1)

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
                                        hlp.setFillColor('rgba(255,255,255,' + pd.a + ')').dot(pd.p.toInt())
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.fenceSplashes = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.5, splashesCount: 8,itemFrameslengthClamps: [10,20], 
                            startPoints: PP.createNonDrawingInstance().lineV2(new V2(1,95), new V2(36, 95)).map(p => new V2(p)), 
                            gravityClamps: [0.035,0.065], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.benchSplashes2 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.5, splashesCount: 6,itemFrameslengthClamps: [10,20], 
                            startPoints: PP.createNonDrawingInstance().lineV2(new V2(37,142), new V2(43,142)).map(p => new V2(p)), 
                            gravityClamps: [0.04,0.07], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.benchSplashes = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.7, splashesCount: 23,itemFrameslengthClamps: [10,20], 
                            startPoints: PP.createNonDrawingInstance().fillByCornerPoints(
                                [new V2(60,178), new V2(68,176), new V2(103,186), new V2(74,191), new V2(66,187)]).map(p => new V2(p)), 
                                //[new V2(62,182), new V2(88, 183),new V2(101,186), new V2(74, 191)]).map(p => new V2(p)), 
                                gravityClamps: [0.04,0.07], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.stationSplashes = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.6, splashesCount: 30,itemFrameslengthClamps: [10,20], 
                            startPoints: PP.createNonDrawingInstance().fillByCornerPoints(
                                [new V2(109,199), new V2(112,191),new V2(109,186), new V2(160, 181), new V2(189,199), new V2(199,199)]).map(p => new V2(p)), 
                                gravityClamps: [0.05,0.09], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.stationSplashes1 = this.addChild(new GO({ 
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.frames = this.parent.createSplashFrames({ framesCount: 100, maxA: 0.45, splashesCount: 15,itemFrameslengthClamps: [10,15], 
                //             startPoints: PP.createNonDrawingInstance().fillByCornerPoints(
                //                 [new V2(110, 186), new V2(75,175), new V2(126,173), new V2(175,184)]).map(p => new V2(p)), 
                //                 gravityClamps: [0.06,0.1], particlesCountClamps: [2,3], size: this.size })
                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), layersData.fg.renderIndex+1)

        this.farTreeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createTreesMovementFrames({ framesCount: 100, startFramesClamps: [0, 90], itemFrameslength: 100, type: 'linear', method: 'base',
                    // additional: {
                    //     framesShift: 10,
                    //     frameslength: 70,
                    //     framesIndiciesChange: [
                    //         ...easing.fast({from: 0, to: 2, steps: 35, type: 'linear', round: 0 }),
                    //         ...easing.fast({from: 2, to: 0, steps: 35, type: 'linear', round: 0 })
                    //     ]
                    // },
                    animationsModel: StationScene.models.farTreeFrames,
                size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+1)

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // this.frames = createTreesMovementFrames({ framesCount: 100, startFramesClamps: [0, 45], itemFrameslength: 60, //type: 'linear', method: 'base',
                //     additional: {
                //         framesShift: 5,
                //         frameslength: 30,
                //         framesIndiciesChange: [
                //             ...easing.fast({from: 0, to: 1, steps: 15, type: 'linear', round: 0 }),
                //             ...easing.fast({from: 1, to: 0, steps: 15, type: 'linear', round: 0 })
                //         ]
                //     },
                //     animationsModel: StationScene.models.treesFrames,
                // size: this.size })
                this.frames = createTreesMovementFrames({ framesCount: 100, startFramesClamps: [0, 80], itemFrameslength: 100, type: 'linear', method: 'base',
                    animationsModel: StationScene.models.treesFrames,
                size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station.renderIndex+1)

        let createSmallDropsFrames = function({framesCount, itemsCount, itemFrameslengthClamps, aClamps, availablePoints, size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)
                let p = availablePoints[getRandomInt(0, availablePoints.length-1)]

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
                            hlp.setFillColor('rgba(255,255,255,' + itemData.a + ')').dot(itemData.p)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.smallDrops0 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSmallDropsFrames({ framesCount: 100, itemsCount: 300, itemFrameslengthClamps: [5,10], aClamps: [0.2, 0.5],
                availablePoints: PP.createNonDrawingInstance().fillByCornerPoints(
                    StationScene.models.main.main.layers.find(l => l.name == 'drops_z0').groups[0].points.map(p => new V2(p.point))
                ), size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station_close.renderIndex+1)

        this.smallDrops1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSmallDropsFrames({ framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [5,10], aClamps: [0.4, 0.7],
                availablePoints: PP.createNonDrawingInstance().fillByCornerPoints(
                    StationScene.models.main.main.layers.find(l => l.name == 'drops_z0').groups[1].points.map(p => new V2(p.point))
                ), size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station.renderIndex+1)

        this.smallDrops2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSmallDropsFrames({ framesCount: 100, itemsCount: 40, itemFrameslengthClamps: [5,10], aClamps: [0.2, 0.4],
                availablePoints: PP.createNonDrawingInstance().fillByCornerPoints(
                    StationScene.models.main.main.layers.find(l => l.name == 'drops_z0').groups[2].points.map(p => new V2(p.point))
                ), size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station.renderIndex+1)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWiresFrames({framesCount, dotsData,xClamps, yClamps, size, invert = false, c1, c2, usePP}) {
                let frames = [];

                let halfFramesCount = fast.r(framesCount/2);

                dotsData.forEach(dotData => {
                    if(dotData.dots.length == 1){
                        dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
                    }
                    else {
                        let distance = dotData.dots[0].distance(dotData.dots[1]);
                        let direction = dotData.dots[0].direction(dotData.dots[1]);
                        let dValues = [
                            ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                            ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                        ]

                        dotData.dots = new Array(framesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));
                    }
                });

                let framesData = [];
                 for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => {
                        if(invert) {
                            return {x: dd.dots[f].y, y: dd.dots[f].x}
                        }

                        return dd.dots[f]
                    });


                    let formula = mathUtils.getCubicSplineFormula(dots);
                    
                    if(invert) {
                        for(let _y = yClamps[0]; _y < yClamps[1]; _y++){
                            let _x=  fast.r(formula(_y));
                            framesData[f].dots.push({x:_x,y:_y});
                        }
                    }
                    else {
                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            framesData[f].dots.push({x,y});
                        }
                    }
                    
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let prev = undefined;
                        let pp = usePP ? new PP({ctx}) : undefined;

                        for(let i = 0; i < framesData[f].dots.length; i++){
                            let color1 = undefined;
                            if(isFunction(c1)) {
                                color1 = c1(framesData[f].dots[i].x, framesData[f].dots[i].y)
                            }
                            else {
                                color1 = c1;
                            }

                            hlp.setFillColor(color1)

                            if(usePP) {
                                if(prev) {
                                    pp.lineV2(prev, framesData[f].dots[i])
                                }
                            }
                            else {
                                hlp.dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                                if(c2 && prev != undefined && prev.y != framesData[f].dots[i].y) {
                                    hlp.setFillColor(c2)
                                        .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                        //.dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
                                        .dot(prev.x+1, prev.y)
                                }
                            }

                            

                            prev = framesData[f].dots[i];
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let colorsSet = [
                    '#3a1f0d',
                    //'#513010',
                    '#593813', 
                    '#674012',
                    '#785019',
                    '#97681f',
                    '#a67422',
                    //'#b58025',
                    //'#d9ae56'
                ]

                this.wire1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        //let xClamps = [0, 160] //35
                    //'#3a1f0d'
                    

                        let zones = [{
                            x: 70,
                            width: 15,
                        },
                        {
                            x: 103,
                            width: 25,
                        },
                        {
                            x: 150,
                            width: 30,
                        }]

                        zones.forEach(z => {
                            z.cIndexValues = easing.fast({from: 0, to: colorsSet.length-1, steps: z.width, type: 'linear', round: 0 }).reverse()
                        })

                        let colorPicker = (x,y) => {
                            let result = colorsSet[0];
                            zones.forEach(z => {
                                let delta = Math.abs(x - z.x);
                                if(delta < z.width) {
                                    if(result < colorsSet[z.cIndexValues[delta]]) {
                                        result = colorsSet[z.cIndexValues[delta]];
                                    }
                                }
                            })

                            return result;
                        }

                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(41, 83)] }, 
                                { dots: [new V2(108, 57), new V2(108.25, 57.5)] }, 
                                { dots: [new V2(199,9), new V2(200, 9.25)] }, 
                            ],
                            xClamps:  [41, 200], yClamps: [], size: this.size, invert: false,
                            c1:  colorPicker

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let zones = [{
                            x: 180,
                            width: 30,
                        },
                        {
                            x: 145,
                            width: 20,
                        },{
                            x: 145,
                            width: 20,
                        }]

                        zones.forEach(z => {
                            z.cIndexValues = easing.fast({from: 0, to: colorsSet.length-1, steps: z.width, type: 'linear', round: 0 }).reverse()
                        })

                        let colorPicker = (x,y) => {
                            let result = colorsSet[0];
                            zones.forEach(z => {
                                let delta = Math.abs(x - z.x);
                                if(delta < z.width) {
                                    if(result < colorsSet[z.cIndexValues[delta]]) {
                                        result = colorsSet[z.cIndexValues[delta]];
                                    }
                                    
                                    //return;
                                }
                            })

                            return result;
                        }

                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(109, 82)] }, 
                                { dots: [new V2(155, 69), new V2(155.25, 69.25)] }, 
                                { dots: [new V2(199,53), new V2(199.25, 53.25)] }, 
                            ],
                            xClamps:  [109, 200], yClamps: [], size: this.size, invert: false,
                            c1:  colorPicker

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({
                            startFrameIndex: 50,
                        });
                    }

                    
                }))

                this.wire2_1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(32, 102), new V2(32.5, 102)] }, 
                                { dots: [new V2(66,95), new V2(66.25, 95.25)] }, 
                                { dots: [new V2(109, 82)] }, 
                            ],
                            xClamps:  [32, 110], yClamps: [], size: this.size, invert: false,
                            c1:  '#3a1f0d'

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({});
                    }

                    
                }))

                this.wire1_2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(0, 95), new V2(0, 95.5)] }, 
                                { dots: [new V2(22,92), new V2(22.25, 92.25)] }, 
                                { dots: [new V2(41, 83)] }, 
                            ],
                            xClamps:  [0, 97], yClamps: [], size: this.size, invert: false,
                            c1:  '#3a1f0d'

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({});
                    }

                    
                }))

                this.wire3_1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(43,29)] }, 
                                { dots: [new V2(59, 32), new V2(59.25, 32.2)] }, 
                                { dots: [new V2(160,0), new V2(160.5, 0)] }, 
                            ],
                            xClamps:  [0, 160], yClamps: [], size: this.size, invert: false,
                            c1:  '#3a1f0d'

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({});
                    }

                    
                }))

                this.wire3_2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createWiresFrames({ framesCount:100, 
                            dotsData: [
                                { dots: [new V2(0, 93), new V2(0, 93.5)] }, 
                                { dots: [new V2(21, 74), new V2(21.25, 74.25)] }, 
                                { dots: [new V2(43,28)] }, 
                            ],
                            xClamps:  [0, 43], yClamps: [], size: this.size, invert: false, usePP: true,
                            c1:  '#3a1f0d'

                        }) //, c2: 'rgba(0,0,0,0.25)'

                        this.registerFramesDefaultTimer({});
                    }

                    
                }))

                
            }
        }), layersData.station.renderIndex+1 )

        this.station_close_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 20, size: this.size, 
                    pointsData: animationHelpers.extractPointData(StationScene.models.main.main.layers.find(l => l.name == 'station_close_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.station_close.renderIndex+1)

        this.fg_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 20, size: this.size, 
                    pointsData: animationHelpers.extractPointData(StationScene.models.main.main.layers.find(l => l.name == 'fg_p'))
                 });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.fg.renderIndex+1)
    }
}