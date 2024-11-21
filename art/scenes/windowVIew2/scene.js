class WindowView2Scene extends Scene {
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
                size: new V2(160,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'windowView2',
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
        let model = WindowView2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let rainColorPrefix = 'rgba(173,201,255,' //80,100,100,';

        let appSharedPP = PP.createNonDrawingInstance();
        
        const createRainFrames = function({framesCount, itemsCount, itemFrameslength, size,
            aClamps, trailLenght, lowerYClamps, xClamps, angleClamps
        }) {
            let frames = [];
            let sky_dark_overlay = PP.createImage(model, { renderOnly: ['sky_dark_overlay'] });

            let trailAValues = [
                ...easing.fast({from: aClamps[1], to: aClamps[0], steps: trailLenght[1], type: 'quad', method: 'out', round: 3 }).slice(1).reverse(),
                aClamps[1],
                ...easing.fast({from: aClamps[1], to: aClamps[0], steps: trailLenght[0], type: 'quad', method: 'out', round: 3 }).slice(1)
            ]

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
                let yShift = getRandomInt(0, 40);
                let bottomLine = {begin: new V2(-1000, size.y+yShift), end: new V2(1000, size.y+yShift)}
                let lowerY = getRandomInt(lowerYClamps);

                let from = new V2(getRandomInt(xClamps), -yShift);
                let to = raySegmentIntersectionVector2(from, V2.down.rotate(getRandom(angleClamps[0], angleClamps[1])), bottomLine);
                let points = appSharedPP.lineV2(from, to); 
                let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})

                if(!xClamps) {
                    xClamps = [0, size.x+30]
                }
            
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

                                    hlp.setFillColor(rainColorPrefix + trailAValues[i] + ')').dot(lp)
                                    if(prev && lp.x != prev.x) {
                                        hlp.setFillColor(rainColorPrefix + trailAValues[i]/2 + ')')
                                            .dot(lp.x+1, lp.y).dot(lp.x, lp.y-1)
                                    }

                                    prev = {x: lp.x, y: lp.y};
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        
                    }

                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(sky_dark_overlay, 0, 0);
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

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far_house', 'houses'] })

                // this.rain0 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.frames = createRainFrames({
                //             framesCount: 100, itemsCount: 5000,  itemFrameslength: 60, size: this.size, aClamps: [0, 0.10], 
                //             trailLenght: [2,15], lowerYClamps: [150, 200], xClamps: [-20, this.size.x+20], angleClamps: [10,10]
                //         })

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                this.rain1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 100, itemsCount: 3000,  itemFrameslength: 45, size: this.size, aClamps: [0, 0.05], 
                            trailLenght: [2,15], lowerYClamps: [150, 200], xClamps: [-20, this.size.x+20], angleClamps: [13,13]
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 100, itemsCount: 2000,  itemFrameslength: 35, size: this.size, aClamps: [0, 0.08], 
                            trailLenght: [3,25], lowerYClamps: [150, 200], xClamps: [-20, this.size.x+20], angleClamps: [14,14]
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({
                            framesCount: 100, itemsCount: 100,  itemFrameslength: 20, size: this.size, aClamps: [0, 0.20], 
                            trailLenght: [6,30], lowerYClamps: [150, 200], xClamps: [-20, this.size.x+20], angleClamps: [15,15]
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.balkon = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSplashFrames({framesCount, splashesCount, splashesStartPoints, itemFrameslengthClamps, maxA, size, gravityClamps = [0.035,0.06], particlesCountClamps = [3,5],
                noColorChange, startFrameIndicesRandomization = false, createSplashes = true, splashAMul = 1,
                fallItem = {
                    height, framesLength, tailLength
                }
            }) {
                let frames = [];
                //let gravity = 0.02;
                
                // if(!gravityClamps) {
                //     gravityClamps = [0.035,0.06]
                // }

                let fallItemInitData = [];

                let itemsData = splashesStartPoints.map((startPoint, i) => {
                    //let startPoint = splashesStartPoints[getRandomInt(0, splashesStartPoints.length-1)]
                    let startFrameIndex = startFrameIndicesRandomization
                        ? getRandomInt(0, framesCount-1)
                        :fast.r((i/splashesStartPoints.length)*framesCount)+ getRandomInt(0, 25) //getRandomInt(0, framesCount-1);

                    fallItemInitData.push({
                        startFrameIndex: startFrameIndex - fallItem.framesLength,
                        x: startPoint.x,
                        y: startPoint.y - fallItem.height,
                        targetY: startPoint.y
                    })

                    let totalFrames = framesCount;
                    let itemsCount = getRandomInt(particlesCountClamps);

                    let frames = [];

                    let particlesData = new Array(itemsCount).fill().map((_, ii) => ({
                        ttl: getRandomInt(itemFrameslengthClamps),
                        speedV: V2.up.rotate(getRandomInt(0, 30)*(ii%2==0 ? -1 : 1)).mul(getRandom(0.25,0.75)),  //new V2(getRandom(0,0.2)*(ii%2==0 ? -1 : 1), getRandom(-0.4, -0.8)),
                        currentP: startPoint.add(new V2(getRandomInt(-2,2),0)),
                        gravity: getRandom(gravityClamps[0],gravityClamps[1])
                    }))

                    if(createSplashes) {
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
                                    a: currentPd.aValues[f]*splashAMul
                                }
    
                                currentPd.currentP = currentPd.currentP.add(currentPd.speedV);
                                currentPd.speedV.y+=currentPd.gravity;
                                currentPd.ttl--;
                            }
                    
                            frames[frameIndex] = framesData;
                        }
                    }
                
                    return {
                        frames
                    }
                })

                let fallItemData = fallItemInitData.map((fi, i) => {
                    let startPoint = new V2(fi.x, fi.y)
                    let startFrameIndex = fi.startFrameIndex;

                    if(startFrameIndex < 0) {
                        startFrameIndex = framesCount + startFrameIndex;
                    }

                    let totalFrames = fallItem.framesLength;
                    
                    let yValues =  easing.fast({from: startPoint.y, to: fi.targetY-fallItem.tailLength, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                    let tailLengthValues = easing.fast({from: 1, to: fallItem.tailLength, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yValues[f],
                            tailLength: tailLengthValues[f],
                        };
                    }
                
                    return {
                        startPoint,
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

                        for(let p = 0; p < fallItemData.length; p++){
                            let itemData = fallItemData[p];

                            if(itemData.frames[f]){

                                let c = rainColorPrefix;

                                hlp.setFillColor(c + maxA + ')').rect(itemData.startPoint.x, itemData.frames[f].y, 1,  itemData.frames[f].tailLength)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.img = PP.createImage(model, { renderOnly: ['balkon'] })

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetPoints = [
                            ...appSharedPP.lineV2(new V2(29,135), new V2(137,135), { toV2: true }).reduce((acc, el) => {
                            if(getRandomInt(0,3) == 0){
                                acc.push(el);
                            }

                            return acc;
                        }, []),
                        new V2(115,135),
                        new V2(116,135), new V2(99,135),new V2(86,135)
                    ]

                        this.frames = this.parent.createSplashFrames({ framesCount: 300, maxA: 0.25,itemFrameslengthClamps: [10,20], 
                            splashesStartPoints: targetPoints, startFrameIndicesRandomization: true, splashAMul: 1.5,
                            fallItem: {
                                height: 200, framesLength: 40, tailLength: 12,
                            },
                            gravityClamps: [0.035,0.045], size: this.size });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
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
            
                                        hlp.setFillColor(whiteColorPrefix + itemData.frames[f].alpha + ')').dot(p);
            
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
                        let targetPoints = [
                        new V2(115,this.size.y),
                        new V2(116,this.size.y), new V2(99,this.size.y),new V2(86,this.size.y)
                    ]


                        this.frames = this.createDropsFrames({
                            itemsCount: 10, framesCount: 300, itemFrameslength1Clamps: [50,70], itemFrameslength2Clamps: [25,35], 
                            size: this.size, opacityClamps: [0.075,0.15], 
                            startPositions: [
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(110,137), new V2(120,137)),
                                ], height: 70, tail: 4 },
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(85,137), new V2(90,137)),
                                ], height: 70, tail: 4 },
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(95,137), new V2(103,137)),
                                ], height: 70, tail: 4 },
                            ], reduceOpacityOnFall: false,
                            type: 'quad', method: 'in'
                        })

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                // this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                

                this.small_splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSmallSplashFrames({framesCount, itemsCount, xClamps, yClamps, aValuesClamps, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
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
                                a: fast.r(getRandom(aValuesClamps[0], aValuesClamps[1]), 3)
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(whiteColorPrefix + itemData.a +')').rect(itemData.p.x, itemData.p.y, 1, 1)
                                    }
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSmallSplashFrames({ framesCount: 100, itemsCount: 100, xClamps: [28, 138], yClamps: [135, 135],
                        aValuesClamps: [0.05, 0.15], itemFrameslengthClamps: [5,10], size: this.size  })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.window = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['window', 'window_d'] })

                this.lightAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let baseFrames = PP.createImage(WindowView2Scene.models.windowLightFrames)
                        let totalFrames = 75;

                        let framesIndexValues = [ //let blink_framesIndexValues = [
                            ...easing.fast({from: 0, to: baseFrames.length-1, steps: fast.r(totalFrames*1/2), type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: baseFrames.length-1, to: 0, steps: fast.r(totalFrames*1/2), type: 'quad', method: 'inOut', round: 0}),
                        ]

                        // let framesIndexValues = [
                        //     ...new Array(50).fill(0),
                        //     ...blink_framesIndexValues,
                        //     ...new Array(50).fill(0),
                        //     ...blink_framesIndexValues,
                        // ]
        
                        this.currentFrame = 0;
                        this.img = baseFrames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = baseFrames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesIndexValues.length){
                                this.currentFrame = 0;
                            }
                        })

                        // let clamps = [5,10];

                        // this.currentFrame = 0;
                        // this.delay = getRandomInt(clamps);
                        // this.img = baseFrames[getRandomInt(0, baseFrames.length-1)];
                        
                        // this.timer = this.regTimerDefault(10, () => {
                        //     this.currentFrame++;
                        //     if(this.currentFrame < this.delay) {
                        //         return;
                        //     }
                        
                        //     this.delay = getRandomInt(clamps);
                        //     this.img = baseFrames[getRandomInt(0, baseFrames.length-1)]
                        //     this.currentFrame = 0;
                        // })
                    }
                }))
            }
        }), 7)

        this.fortochka = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let baseFrames = PP.createImage(WindowView2Scene.models.fortochkaFrames).reverse();
                let totalFrames = 300;
                let animationTotalFrames = 70;
                let framesIndexValues = [
                    ...easing.fast({from: 0, to: baseFrames.length-1, steps: 30, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: baseFrames.length-1, to: 0, steps: 40, type: 'quad', method: 'inOut', round: 0}),
                    //...new Array(totalFrames-animationTotalFrames).fill(0)
                    ...new Array(100).fill(0),
                    ...new Array(50).fill(1),
                    ...new Array(100).fill(0),
                ]

                this.currentFrame = 0;
                this.img = baseFrames[framesIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = baseFrames[framesIndexValues[this.currentFrame]];
                    this.currentFrame++;
                    if(this.currentFrame == framesIndexValues.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 9)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['cat'] })

                this.tailAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let baseFrames = PP.createImage(WindowView2Scene.models.catTailFrames)
                        let totalFrames = 150;

                        let framesIndexValues = [
                            ...easing.fast({from: 0, to: baseFrames.length-1, steps: fast.r(totalFrames*3/5), type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: baseFrames.length-1, to: 0, steps: fast.r(totalFrames*2/5), type: 'quad', method: 'inOut', round: 0}),
                        ]
        
                        this.currentFrame = 0;
                        this.img = baseFrames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = baseFrames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == framesIndexValues.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'cat_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 11)
    }
}