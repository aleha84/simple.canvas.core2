class StaresScene extends Scene {
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
                size: new V2(1330,2000).divide(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'stairs_snow',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    setRain() {
        console.log('start rain')
        this.rain.isVisible = true
        this.floor_p2.isVisible = true
        this.snow.isVisible = false
        this.dust.isVisible = false
    }

    setSnow() {
        console.log('start snow')
        this.rain.isVisible = false
        this.floor_p2.isVisible = false
        this.snow.isVisible = true
        this.dust.isVisible = false
    }

    setDust() {
        console.log('start dust')
        this.rain.isVisible = false
        this.floor_p2.isVisible = false
        this.snow.isVisible = false
    }

    start(){
        let model = StaresScene.models.main;
        let layersData = {};
        let exclude = [
            'mask1', 'stairs_p', 'floor_p', 'floor_p2'
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

        let createRainFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size,
            angleClamps, xClamps, yClamps, lowerYValues, color,tailLengthClamps, lightParams, splashParams, splashOnly = false}) {
            let frames = [];
            // let sharedPP;

            // createCanvas(new V2(1,1), (ctx, size, hlp) => {
            //     sharedPP = new PP({ctx});
            // })
        
            let mask = PP.createImage(model, { renderOnly: ['mask1'] } )

            let lCenter = lightParams.center //new V2(66,21);
            let radius = lightParams.radius //40;
            let opacityDistanceValues = easing.fast({from: lightParams.from, to: lightParams.to, steps: radius, type: 'linear', round: 2 });
            
            let splashData = [];

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                if(splashOnly) {
                    return { frames: [] }
                }

                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let p1 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));

                let awailableY = lowerYValues.filter(param => p1.x >= param.xClamps[0] && p1.x <= param.xClamps[1]).map(param => param.y);
                if(awailableY.length == 0)
                    return { frames: [] }

                let p2 = new V2(p1.x, awailableY[getRandomInt(0, awailableY.length-1)]);
                let tailLength = getRandomInt(tailLengthClamps);

                let tailOpacityValues = [
                    ...easing.fast({ from: 0, to: 1, steps: tailLength-1, type: 'quad', method: 'in', round: 2 }),
                    0.5
                ]

                let yChangeValues = easing.fast({from: p1.y, to: p2.y, steps: totalFrames, type: 'linear', round: 0});
                
                let frames = [];
                let lastFrameIndex = 0;
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        y: yChangeValues[f]
                    };

                    lastFrameIndex = frameIndex;
                }

                splashData.push({ startFrameIndex: lastFrameIndex, p1: p2.clone() })
            
                return {
                    x: p1.x,
                    lowerY: p2.y,
                    tailLength,
                    tailOpacityValues,
                    frames
                }
            })

            if(splashOnly) {
                splashData = new Array(itemsCount).fill().map((el, i) => ({
                    startFrameIndex: getRandomInt(0, framesCount-1),
                    p1: new V2(getRandomInt(xClamps), getRandomInt(yClamps))
                }))
            }

            splashData = splashData.map((el, i) => {
                let startFrameIndex = el.startFrameIndex + splashParams.framesShift;
                let totalFrames = getRandomInt(splashParams.itemFrameslengthClamps);

                let direction = V2.up.rotate(getRandomInt(splashParams.angleClapms)); //-20, 20
                let speed = getRandom(splashParams.speedClamps[0], splashParams.speedClamps[1]); //0.25,0.75
                let yDelta = getRandom(splashParams.yDeltaClamps[0], splashParams.yDeltaClamps[1]); //0.025,0.05
                let ds = direction.mul(speed);
                let currentDot = el.p1.clone();
                let frames = [];

                let alphaValues = easing.fast({ from: 1, to: 0, steps: totalFrames, type: 'linear', round: 2})

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    if(frameIndex < 0) {
                        frameIndex = framesCount+frameIndex;
                    }
            
                    frames[frameIndex] = {
                        p: currentDot.toInt(),
                        a: alphaValues[f]
                    };

                    currentDot = currentDot.add(ds);
                    ds.y+=yDelta;
                }

                return {
                    frames
                }
            });
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            for(let i = 0; i < itemData.tailLength; i++) {
                                let p = { x: itemData.x, y: itemData.frames[f].y+i };

                                if(p.y > itemData.lowerY)
                                    continue;

                                let a = lightParams.to;
                                let distance = fast.r(lCenter.distance(new V2(p)));
                                if(distance < radius) {
                                    a = opacityDistanceValues[distance];
                                }

                                let tailOpacity = itemData.tailOpacityValues[i];

                                ctx.globalAlpha = a*tailOpacity;

                                hlp.setFillColor(color).dot(p);

                                ctx.globalAlpha = 1;
                            }
                        }
                        
                    }

                    let opacityMul = splashParams.opacityMul || 1;
                    for(let p = 0; p < splashData.length; p++){
                        let itemData = splashData[p];
                        if(itemData.frames[f]){
                            let a = lightParams.to;
                            let p = itemData.frames[f].p;
                            let distance = fast.r(lCenter.distance(new V2(p)));
                            if(distance < radius) {
                                a = opacityDistanceValues[distance];
                            }

                            ctx.globalAlpha = a*itemData.frames[f].a*opacityMul;
                            hlp.setFillColor(color).dot(p);
                            ctx.globalAlpha = 1;
                        }
                    }
                });
            }
            
            return frames.map(f => createCanvas(size, (ctx, _size, hlp) => {
                ctx.drawImage(mask, 0, 0);
                ctx.globalCompositeOperation  = 'source-out'
                ctx.drawImage(f, 0, 0);
            }));;
        }

        this.dust = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDustFrames({framesCount, itemsCount, itemFrameslength, size, xClamps, yClamps, aClamps, lengthClamps}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p1 = new V2(getRandomInt(xClamps), getRandomInt(yClamps))
                    let xValues = easing.fast({ from: p1.x, to: p1.x + getRandomInt(lengthClamps), steps: totalFrames, type: 'linear', round: 0 });
                    let yValues = easing.fast({ from: p1.y, to: p1.y + getRandomInt(lengthClamps), steps: totalFrames, type: 'linear', round: 0 });
                    let maxA = getRandom(aClamps[0], aClamps[1]);
                    let aValus = [
                        ...easing.fast({ from: 0, to: maxA, steps: totalFrames/2,  type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({ from: maxA, to: 0, steps: totalFrames/2,  type: 'quad', method: 'inOut', round: 2})
                    ]

                    let frames = [];
                    let counter = 10;
                    let divide = false;

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        counter--;
                        if(counter == 0) {
                            counter = 10;
                            divide = !divide;
                        }
                
                        frames[frameIndex] = {
                            x: xValues[f],
                            y: yValues[f],
                            a: aValus[f]/ (divide ? 2 : 1)
                        };
                    }
                
                    return {
                        y: p1.y,
                        x: p1.x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let a = itemData.frames[f].a;

                                hlp.setFillColor(`rgba(255,255,255,${a})`)//.dot(itemData.frames[f].x, itemData.y);
                                    .dot(itemData.x, itemData.frames[f].y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.ray =  this.addChild((new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = [];

                        let framesCount = 300;
                        let startFrom = 100;
                        
                        let p1 = new V2(50,23);
                        let p2 = new V2(25,100);
                        // let upperWidth = 2;
                        // let bottomWidth = 8;
                        let pCenter = new V2(66,21);

                        // let data = [
                        //     {maxDistance: 70, mainA: 0.5, startFrom: 100},
                        //     {maxDistance: 50, mainA: 0.5, startFrom: 120, bottomWidth: 6}
                        // ]

                        let data = new Array(30).fill().map((el, i) => ({
                            maxDistance: getRandomInt(30, 80),
                            mainA: fast.r(getRandom(0.4,0,6),1),
                            startFrom: getRandomInt(0, framesCount-1),
                            animationFrames: getRandomInt(100, 200),
                            upperWidth: getRandomInt(1,4),
                            bottomWidth: getRandomInt(7,10)
                        }))

                        let mask = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            pp.setFillStyle = 'red';
                            pp.fillByCornerPoints([
                                new V2(0,91),new V2(44,89),new V2(46,66),new V2(53,44),new V2(56,22),new V2(57,21),
                                new V2(77,20),new V2(79,40),new V2(80,43),new V2(81,44),new V2(87,82),new V2(88,88),new V2(131,89),new V2(132,0),new V2(0,0),
                            ]);
                        })

                        let createShadow = function ({maxDistance, mainA, startFrom, size, upperWidth = 2, bottomWidth = 8, animationFrames = 100 }) {
                            //let animationFrames = 100;
                            let frames = []
                            //let maxDistance = 70
                            //let mainA = 0.5;
                            let aValues = easing.fast({ from: mainA, to: 0, steps: maxDistance, type: 'linear', round: 2});
    
                            let upperXShiftValues = easing.fast({from: 0, to: 30, steps: animationFrames, type: 'linear', round: 0})
                            let bottomXShiftValues = easing.fast({from: 0, to: 70, steps: animationFrames, type: 'linear', round: 0})
    
                            let maxDistanceChangeFormula = (f) => fast.r(Math.sin(f/10)*10);
    
                            for(let f = 0; f < animationFrames; f++) {
                                let frameIndex = f + startFrom;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }

                                // let currentMaxDistance = maxDistance + maxDistanceChangeFormula(f);
                                // console.log(currentMaxDistance);
                                //let aValues = easing.fast({ from: mainA, to: 0, steps: currentMaxDistance, type: 'linear', round: 2})
                                frames[frameIndex] = createCanvas(size, (ctx, size, hlp) => {
                                    let pp = new PP({ctx});
                                    pp.setFillStyle('rgba(0,0,0,0.5)');
                                    pp.fillStyleProvider = (x, y) => {
                                        let distance = fast.r(pCenter.distance(new V2(x,y)));
                                        // if(distance > maxDistance) {
                                        //     distance = maxDistance;
                                        // }
        
                                        let a = aValues[distance];
                                        if(a == undefined) {
                                            a = 0
                                        }

                                        //console.log(`x:${x}, y: ${y}, a: ${a}`)
    
                                        return `rgba(0,0,0,${a})`;
                                    }
    
                                    let _p1 = p1.add(new V2(upperXShiftValues[f], 0))
                                    let _p2 = p2.add(new V2(bottomXShiftValues[f], 0))
                                    let _p3 = _p2.add(new V2(bottomWidth, 0))
                                    let _p4 = _p1.add(new V2(upperWidth, 0));
        
                                    pp.fillByCornerPoints([_p1, _p2, _p3, _p4])
    
                                    ctx.globalCompositeOperation  = 'destination-out'
                                    ctx.drawImage(mask, 0, 0);
                                })
                            }

                            return frames;
                        }

                        let frameData = data.map(d => createShadow({ maxDistance: d.maxDistance, mainA: d.mainA, startFrom: d.startFrom, size: this.size }));

                        for(let f = 0;f < framesCount; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let fd = 0; fd < frameData.length; fd++) {
                                    if(frameData[fd][f]) {
                                        ctx.drawImage(frameData[fd][f], 0, 0)
                                    }
                                }
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                })))

                this.particles = this.addChild((new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createDustFrames({ framesCount: 300, itemsCount:30, itemFrameslength: 50, size: this.size, 
                            xClamps: [34,99], yClamps: [30, 90], aClamps: [0.1,0.3],lengthClamps: [1,2] }) //[54,79]
                        this.registerFramesDefaultTimer({});
                    }
                })))

                this.particles = this.addChild((new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createDustFrames({ framesCount: 300, itemsCount:20, itemFrameslength: 40, size: this.size, 
                            xClamps: [54,79], yClamps: [30, 90], aClamps: [0.3,0.5],lengthClamps: [1,2] }) //[54,79]
                        this.registerFramesDefaultTimer({});
                    }
                })))

                this.particles1 = this.addChild((new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createDustFrames({ framesCount: 300, itemsCount:5, itemFrameslength: 60, size: this.size, 
                            xClamps: [54,79], yClamps: [30, 80], aClamps: [0.6,1], lengthClamps: [3,4]  })
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), layersData.stairs_d.renderIndex+2)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFrames({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, color, lightParams, startPositions,
                    type, method}) {
                        let frames = [];
                        
                        let lCenter = lightParams.center //new V2(66,21);
                        let radius = lightParams.radius //40;
                        let opacityDistanceValues = easing.fast({from: lightParams.from, to: lightParams.to, steps: radius, type: 'linear', round: 2 });

                        //let startPositions = 

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            //let totalFrames = itemFrameslength;

                            let startPosition = startPositions[getRandomInt(0, startPositions.length-1)];
                            let p = new V2(getRandomInt(startPosition.xClamps), startPosition.y);
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

                                        let a = lightParams.to;
                                        let p = new V2(itemData.x, itemData.frames[f].y);
                                        let distance = fast.r(lCenter.distance(p));
                                        if(distance < radius) {
                                            a = opacityDistanceValues[distance];
                                        }

                                        ctx.globalAlpha = a*itemData.frames[f].alpha;

                                        hlp.setFillColor(color).dot(p);

                                        if(itemData.frames[f].tail > 0) {
                                            for(let i = 0; i < itemData.frames[f].tail; i++) {
                                                hlp.setFillColor(color).dot(p.add(new V2(0, i+1)));
                                            }
                                        }

                                        ctx.globalAlpha = 1;
                                        //hlp.setFillColor(`rgba(154,160,165, ${itemData.frames[f].alpha})`).dot(itemData.p.x, itemData.frames[f].y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.l0 = this.addChild(new GO( {
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = this.parent.createDropsFrames({itemsCount: 250,framesCount: 300, itemFrameslength1Clamps: [3,7], itemFrameslength2Clamps: [5,10], 
                                    size: this.size, opacityClamps: [0.5, 0.9], color: '#FFFFFF', 
                                    startPositions: [
                                        // {y: 44, xClamps: [54,80], height: 1}, {y: 46, xClamps: [53,80], height: 1}, 
                                        {y: 48, xClamps: [53,81], height: 2}, {y: 51, xClamps: [51,82], height: 2}, {y: 54, xClamps: [50,82], height: 2}, {y: 57, xClamps: [50,82], height: 2}, 
                                        {y: 60, xClamps: [49,83], height: 2}, {y: 63, xClamps: [49, 83], height: 2}, {y: 66, xClamps: [48,83], height: 2}, {y: 69, xClamps: [48,84], height: 2},
                                        {y: 72, xClamps: [47,84], height: 2}, {y: 75, xClamps: [47,85], height: 2},{y: 78, xClamps: [47,85], height: 3},{y: 82, xClamps: [46,86], height: 3},
                                        {y: 86, xClamps: [48,86], height: 2} 
                                    ],
                                    type: 'sin', method: 'in',
                                    lightParams: {
                                        center: new V2(66,21),
                                        radius: 40, 
                                        from: 1, 
                                        to: 0.2
                                    }});
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.l1 = this.addChild(new GO( {
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = this.parent.createDropsFrames({itemsCount: 20,framesCount: 300, itemFrameslength1Clamps: [10,20], itemFrameslength2Clamps: [70,80], 
                                    size: this.size, opacityClamps: [1, 1.5], color: '#FFFFFF', 
                                    startPositions: [
                                        {y: 24, xClamps: [46,50], height: 50, tail: 1},  {y: 24, xClamps: [83,87], height: 50, tail: 1}
                                    ],
                                    type: 'expo', method: 'in',
                                    lightParams: {
                                        center: new V2(66,21),
                                        radius: 40, 
                                        from: 1, 
                                        to: 0.1
                                    }});
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                    }
                }))

                this.l0 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 300, itemsCount: 400, itemFrameslengthClamps: [10,15], size: this.size, xClamps: [54,79], 
                            yClamps: [0,10], lowerYValues: [
                                {y: 28, xClamps: [57,76]},{y: 30, xClamps: [57,77]}, {y: 32, xClamps: [57,77]},{y: 34, xClamps: [56,77]},
                                {y: 36, xClamps: [56,77]},{y: 39, xClamps: [56,77]},{y: 41, xClamps: [55,78]}, {y: 43, xClamps: [54,79]}], 
                                color: '#e2ecf1', tailLengthClamps: [15, 17],
                            lightParams: {
                                center: new V2(66,21),
                                radius: 20, 
                                from: 0.6, 
                                to: 0.2
                            },
                            splashParams: {
                                itemFrameslengthClamps: [8, 12],
                                angleClapms: [-0, 0],
                                speedClamps: [0,0],
                                yDeltaClamps: [0,0],
                                framesShift: 0
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 150, itemsCount: 50, itemFrameslengthClamps: [10,15], size: this.size, xClamps: [55,78], 
                            yClamps: [43,44], lowerYValues: [
                                ], 
                                color: '#e2ecf1', tailLengthClamps: [15, 17],
                            lightParams: {
                                center: new V2(66,21),
                                radius: 40, 
                                from: 0.9, 
                                to: 0.2
                            },
                            splashOnly: true,
                            splashParams: {
                                itemFrameslengthClamps: [8, 12],
                                angleClapms: [-30, 30],
                                speedClamps: [0.3,0.6],
                                yDeltaClamps: [0.05,0.09],
                                framesShift: 0
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 300, itemsCount: 200, itemFrameslengthClamps: [10,14], size: this.size, xClamps: [44,88], 
                            yClamps: [0,10], lowerYValues: [
                                {y: 48, xClamps: [53,81]}, {y: 51, xClamps: [51,82]}, {y: 54, xClamps: [50,82]}, {y: 57, xClamps: [50,82]}, 
                                {y: 60, xClamps: [49,83]}, {y: 63, xClamps: [49, 83]}, {y: 66, xClamps: [48,83]}, {y: 69, xClamps: [49,83]},
                                {y: 72, xClamps: [51,81]}, {y: 75, xClamps: [54,80]} 
                            ], color: '#FFFFFF', tailLengthClamps: [17, 20],//[17, 20],
                            lightParams: {
                                center: new V2(66,21),
                                radius: 40, 
                                from: 0.8, 
                                to: 0.2
                            },
                            splashParams: {
                                itemFrameslengthClamps: [10, 15],
                                angleClapms: [-30, 30],
                                speedClamps: [0.25,0.4],
                                yDeltaClamps: [0.05,0.07],
                                framesShift: 0,
                                opacityMul: 2,
                                // angleClapms: [-20, 20],
                                // speedClamps: [-0.05,-0.1],
                                // yDeltaClamps: [0,0]
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                
            }
        }), layersData.stairs_d.renderIndex+2)

        let createSnowfallFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size,
            angleClamps, xClamps, yClamps, lowerYClamps, color,pointsLengthClamps, lightParams
        })
         {
            let frames = [];
            let sharedPP = undefined;
            let bottomLine = createLine(new V2(-size.x, size.y+ pointsLengthClamps[1]), new V2(size.x*2, size.y+pointsLengthClamps[1]));

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })
        
            let mask = PP.createImage(model, { renderOnly: ['mask1'] } )

            let lCenter = lightParams.center //new V2(66,21);
            let radius = lightParams.radius //40;
            let opacityDistanceValues = easing.fast({from: lightParams.from, to: lightParams.to, steps: radius, type: 'linear', round: 2 });

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));

                if(point1.x >= xClamps[1] - 4) {
                    direction = V2.down.rotate(getRandomInt(0, angleClamps[1]));
                }

                if(point1.x <= xClamps[0] + 4) {
                    direction = V2.down.rotate(getRandomInt(angleClamps[0], 0));
                }

                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));
            
                let linePoints = sharedPP.lineV2(point1, point2);
                let pointsLength = getRandomInt(pointsLengthClamps);
                let lowerY = getRandomInt(lowerYClamps);

                let to = pointsLength;
                if(to > linePoints.length-1) {
                    to = linePoints.length-1;
                }

                let linePointsIndices = easing.fast({ from: 0, to: to, steps: totalFrames, type: 'linear', round: 0});

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndices[f]];
            
                    frames[frameIndex] = {
                        p
                    };
                }
            
                return {
                    lowerY,
                    frames
                }
            })

            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { p } = itemData.frames[f];

                            if(p.y > itemData.lowerY)
                                continue;

                            let a = 0.1;
                            let distance = fast.r(lCenter.distance(new V2(p)));
                            if(distance < radius) {
                                a = opacityDistanceValues[distance];
                            }

                            ctx.globalAlpha = a;

                            hlp.setFillColor(color).dot(p);

                            ctx.globalAlpha = 1;
                        }
                        
                    }
                });
            }
            
            return frames.map(f => createCanvas(size, (ctx, _size, hlp) => {
                ctx.drawImage(mask, 0, 0);
                ctx.globalCompositeOperation  = 'source-out'
                ctx.drawImage(f, 0, 0);
            }));
         }

         this.stairs_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'stairs_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        //this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.stairs_d.renderIndex+1)

        this.snow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.l0 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames({
                            framesCount: 300, itemsCount: 120, itemFrameslengthClamps: [100,120], size: this.size, angleClamps: [-5,5], xClamps: [54,79], 
                            yClamps: [0,20], lowerYClamps: [43,44], color: '#e2ecf1', pointsLengthClamps: [30, 40],
                            lightParams: {
                                center: new V2(66,21),
                                radius: 20, 
                                from: 1, 
                                to: 0.2
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames({
                            framesCount: 300, itemsCount: 70, itemFrameslengthClamps: [150,170], size: this.size, angleClamps: [-10,10], xClamps: [44,88], 
                            yClamps: [0,20], lowerYClamps: [66,70], color: '#FFFFFF', pointsLengthClamps: [50, 70],
                            lightParams: {
                                center: new V2(66,21),
                                radius: 40, 
                                from: 1, 
                                to: 0.1
                            }
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.stairs_d.renderIndex+2)

        this.floor_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        //this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.floor_d.renderIndex+1)

        this.floor_p2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p2')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.floor_d.renderIndex+1)

        // this.snowShadows = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     createShadowFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
        //         let frames = [];
        //         let center = new V2(66,71)
        //         let initRadius = [20,70];
        //         let angleClamps = [-45,45];

        //         let sharedPP;
        //         createCanvas(new V2(1,1), (ctx, size, hlp) => {
        //             sharedPP = new PP({ctx});
        //         })

        //         let itemsData = new Array(itemsCount).fill().map((el, i) => {
        //             let startFrameIndex = getRandomInt(0, framesCount-1);
        //             let totalFrames = getRandomInt(itemFrameslengthClamps);
                
        //             let pointsLength = getRandomInt(20, 30);

        //             let angle = getRandomInt(angleClamps);

        //             let point1 = center.add(V2.down.rotate(angle).mul(getRandomInt(initRadius))).toInt();
        //             let lineToCenterPoints = sharedPP.lineV2(point1, center);

        //             let to = pointsLength;
        //             if(to > lineToCenterPoints.length-1) {
        //                 to = lineToCenterPoints.length-1;
        //             }

        //             let linePointsIndices = easing.fast({ from: 0, to: to, steps: totalFrames, type: 'linear', round: 0});

        //             let frames = [];
        //             for(let f = 0; f < totalFrames; f++){
        //                 let frameIndex = f + startFrameIndex;
        //                 if(frameIndex > (framesCount-1)){
        //                     frameIndex-=framesCount;
        //                 }
                
        //                 frames[frameIndex] = {
        //                     p: lineToCenterPoints[linePointsIndices[f]]
        //                 };
        //             }
                
        //             return {
        //                 frames
        //             }
        //         })
                
        //         for(let f = 0; f < framesCount; f++){
        //             frames[f] = createCanvas(size, (ctx, size, hlp) => {
        //                 hlp.setFillColor('rgba(0,0,0,0.2')
        //                 for(let p = 0; p < itemsData.length; p++){
        //                     let itemData = itemsData[p];
                            
        //                     if(itemData.frames[f]){
        //                         hlp.dot(itemData.frames[f].p)
        //                     }
                            
        //                 }
        //             });
        //         }
                
        //         return frames;
        //     },
        //     init() {
        //         this.frames = this.createShadowFrames({ framesCount: 300, itemsCount: 50, itemFrameslengthClamps: [200,220], size: this.size });
        //         this.registerFramesDefaultTimer({});
        //     }
        // }), layersData.floor_d.renderIndex+2)





        this.setDust();
    }
}