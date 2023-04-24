class TrunderstormScene extends Scene {
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
                fileNamePrefix: 'thunderstorm',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
        //this.backgroundRenderAddGo({color: 'black'})
    }

    start(){
        const model = TrunderstormScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();

        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let managementData = {
                    bg: new Array(totalFrames).fill(0),
                    housesAndTrees: new Array(totalFrames).fill(0),
                    lampLights: new Array(totalFrames).fill(0),
                    setData(name, from, count, value) {
                        for(let i = from; i < from + count; i++) {
                            this[name][i] = value;
                        }
                    }
                }

                // managementData.setData('housesAndTrees', 78, 2, 1)
                // managementData.setData('housesAndTrees', 82, 2, 3)
                managementData.setData('housesAndTrees', 104, 2, 2)
                managementData.setData('housesAndTrees', 106, 2, 1)
                managementData.setData('housesAndTrees', 110, 4, 1)
                

                managementData.setData('bg', 108, 2, 3)
                managementData.setData('bg', 110, 2, 2)
                managementData.setData('bg', 112, 2, 1)


                managementData.setData('bg', 150, 2, 2)
                managementData.setData('bg', 152, 2, 3)
                managementData.setData('bg', 154, 2, 4)
                managementData.setData('bg', 156, 2, 1)
                managementData.setData('bg', 160, 2, 2)

                managementData.setData('housesAndTrees', 145, 3, 1)

                managementData.setData('housesAndTrees', 150, 2, 2)
                managementData.setData('housesAndTrees', 152, 2, 3)
                managementData.setData('housesAndTrees', 154, 2, 4)
                managementData.setData('housesAndTrees', 156, 2, 1)
                managementData.setData('housesAndTrees', 160, 4, 2)
                managementData.setData('housesAndTrees', 165, 2, 1)


                managementData.setData('bg', 220, 3, 4)
                managementData.setData('bg', 226, 2, 1)
                managementData.setData('bg', 228, 2, 3)
                managementData.setData('bg', 230, 2, 1)
                managementData.setData('bg', 235, 2, 1)

                managementData.setData('bg', 265, 2, 1)
                managementData.setData('bg', 267, 2, 2)


                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    if(managementData.bg[this.currentFrame] != undefined){
                        this.parentScene.bg.setImage(managementData.bg[this.currentFrame])
                    }

                    if(managementData.housesAndTrees[this.currentFrame] != undefined){
                        this.parentScene.housesAndTrees.setImage(managementData.housesAndTrees[this.currentFrame])
                    }

                    if(managementData.lampLights[this.currentFrame] != undefined){
                        this.parentScene.lampLights.setImage(managementData.lampLights[this.currentFrame])
                    }

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.parentScene.capturing.stop = true;
                        this.currentFrame = 0;
                    }
                })
            }
        }), 0)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let createDropsFrames = function({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions, reduceOpacityOnFall = false, type = 'quad', method = 'in', rgbColorPart}) {
                    let frames = [];
    
                    let itemsData = startPositions.points.map((p, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
        
                        //let startPosition = startPositions[getRandomInt(0, startPositions.length-1)];
                        // let p = el; 
                        // if(startPosition.type == 'points') {
                        //     p = startPosition.points[getRandomInt(0, startPosition.points.length-1)]
                        // }
                        // else {
                        //     p = new V2(getRandomInt(startPosition.xClamps), startPosition.y);
                        // }
                        let height = startPositions.height;
                        let maxTailLength = startPositions.tail || 0;
        
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
                }

                let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size,
                    xClamps, upperYClamps, angleClamps, lowerYClamps, lengthClamps, maxA, lightData, colorPrefix}) {
                    let frames = [];
                    
                    let bottomLine = {begin: new V2(-1000, lowerYClamps), end: new V2(1000, lowerYClamps)}

                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
                    
                        let p0 = new V2(getRandomInt(xClamps),getRandomInt(upperYClamps));
                        //let lowerY = getRandomInt(lowerYClamps);
                        let angle = getRandom(angleClamps[0], angleClamps[1])
                        let p1 = raySegmentIntersectionVector2(p0, V2.down.rotate(angle), bottomLine).toInt();
                        let len = getRandomInt(lengthClamps);

                        let points = appSharedPP.lineV2(p0, p1); 
                        let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
                        

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
                                        //rgbColorPart = ld.rgbColorPart;
                                        if(a > 1) 
                                            a = 1;
                                           
                                        aValue= a*maxA;
                                    }
                                }
                            })
                        }
                        
                        if(aValue > 0) {
                            hlp.setFillColor(colorPrefix + aValue + ')').dot(p.x,p.y)
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

                let restrictionLineDots = appSharedPP.lineByCornerPoints([new V2(30,120), new V2(110,78), new V2(115,78), new V2(151,117)]);
                let restrictionLookUp = [];
                let fadeoutStrength = 6;
                let restrictionFadeOutAValues = easing.fast({from: 1, to: 0, steps: fadeoutStrength, type: 'quad', method: 'in', round: 2});

                let lightData = colors.createRadialGradient({ size: this.size, center: new V2(100,100), radius: new V2(50,60), 
                    gradientOrigin: new V2(113,82), angle: 15,
                    setter: (dot, aValue) => {
                        let mul = 1;

                        let lookupValue = restrictionLookUp[dot.p.x];

                        if(lookupValue === undefined) {
                            let rld = restrictionLineDots.filter(d => d.x == dot.p.x);
                            if(rld.length == 0){
                                lookupValue = false;
                            }
                            else {
                                lookupValue = rld.reduce((prev,curr) => { return prev.y < curr.y ? prev : curr });
                            }

                            restrictionLookUp[dot.p.x] = lookupValue;
                        }

                        if(lookupValue === false){
                            mul = 0;
                        }
                        else {
                            if(dot.p.y < lookupValue.y) {
                                let dist = lookupValue.y - dot.p.y;
                                mul = restrictionFadeOutAValues[dist];
                                if(mul == undefined) {
                                    mul = 0;
                                }
                            }
                        }

                        aValue*=mul;
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
                                    hlp.setFillColor(`rgba(105,177,179,${gradientDots[y][x].maxValue/3})`).dot(x,y)
                                }
                            }
                        }
                    }

                    // restrictionLineDots.forEach(p => hlp.setFillColor('red').dot(p))
                })

                
                this.img = maskImg;
                this.backRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 100, itemsCount: 1000, itemFrameslength: [40, 45], size: this.size,
                            xClamps: [60,190], upperYClamps: [45,65], angleClamps: [30,35], lowerYClamps: 200, lengthClamps: [4,5], maxA: 0.2, 
                            colorPrefix: 'rgba(117,145,152,', lightData: [{gradientDots: lightData}] })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['lamp'] })
                    }
                }))

                this.frontalRain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 100, itemsCount: 1000, itemFrameslength: [15, 20], size: this.size,
                            xClamps: [60,190], upperYClamps: [45,65], angleClamps: [35,35], lowerYClamps: 200, lengthClamps: [4,5], maxA: 0.6, 
                            colorPrefix: 'rgba(117,145,152,', lightData: [{gradientDots: lightData}] })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.frontalRain2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 100, itemsCount: 300, itemFrameslength: [15, 20], size: this.size,
                            xClamps: [60,190], upperYClamps: [45,65], angleClamps: [40,45], lowerYClamps: 200, lengthClamps: [4,6], maxA: 1, 
                            colorPrefix: 'rgba(169,195,203,', lightData: [{gradientDots: lightData}] })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.frontalRain3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 100, itemsCount: 10, itemFrameslength: [15, 20], size: this.size,
                            xClamps: [60,190], upperYClamps: [45,65], angleClamps: [40,50], lowerYClamps: 200, lengthClamps: [5,6], maxA: 3, 
                            colorPrefix: 'rgba(169,195,203,', lightData: [{gradientDots: lightData}] })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wires_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p1_v2'))
                        this.frames = animationHelpers.createMovementFrames({
                            pdPredicate: () => getRandomBool(),
                            framesCount: 100, itemFrameslength: [40,50], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p2'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [25,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'fallingDrops')).map(p => p.point)
                        this.frames = createDropsFrames({ itemsCount: 100, framesCount: 300, itemFrameslength1Clamps: [1,1], itemFrameslength2Clamps: [8, 12], size: this.
                            size, opacityClamps: [0.4, 0.5], reduceOpacityOnFall: true, rgbColorPart: 'rgba(169,195,203,',
                            startPositions: {
                                points: pd, tail: 0, height: 25
                            }
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        let shadesCount = 5;
        let shadesAValues = easing.fast({from: 1, to: 0, steps: shadesCount, type: 'linear', round: 2 });
        let blackImg = PP.createImage(model, { renderOnly: ['bg_black'] });

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let originalImg = PP.createImage(model, { renderOnly: ['bg'] });
                this.images = new Array(shadesCount).fill().map((el, i) => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(originalImg, 0, 0);
                    ctx.globalAlpha = shadesAValues[i];
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(blackImg, 0, 0) 
                }))

                this.setImage(0);
            },
            setImage(index) {
                this.img = this.images[index]
            }
        }), 1)

        this.housesAndTrees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let originalImg = PP.createImage(model, { renderOnly: ['houses', 'house2', 'tree', 'tree_2', ] });
                this.images = new Array(shadesCount).fill().map((el, i) => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(originalImg, 0, 0);
                    ctx.globalAlpha = shadesAValues[i];
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(blackImg, 0, 0) 
                }))

                this.setImage(0);
            },
            setImage(index) {
                this.img = this.images[index]
            }
        }), 5)

        this.lampLights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let originalImg = PP.createImage(model, { renderOnly: ['lamp_light'] });
                this.images = new Array(shadesCount).fill().map((el, i) => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(originalImg, 0, 0);
                    ctx.globalAlpha = shadesAValues[i];
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(blackImg, 0, 0) 
                }))

                this.setImage(0);
            },
            setImage(index) {
                this.img = this.images[index]
            }
        }), 15)
    }
}