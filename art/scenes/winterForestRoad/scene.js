class WinterForestRoadScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'winterForestRoad',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('#0d0d15').dot(0,0)
            })
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(WinterForestRoadScene.models.main, { exclude: ['car', 'trees_p', 'road_p', 'car_p'] })

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

                this.darkP = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementRotFrames({ framesCount: 200, itemFrameslength: 100, size: this.size, 
                            pdPredicate: () => getRandomBool(),
                            pointsData: 
                            animationHelpers.extractPointData(WinterForestRoadScene.models.main.main.layers.find(l => l.name == 'trees_d3')).filter(p => p.color == '#16171e')
                         });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.trees_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementRotFrames({ framesCount: 200, itemFrameslength: 100, size: this.size, 
                            pdPredicate: () => getRandomBool(),
                            pointsData: animationHelpers.extractPointData(WinterForestRoadScene.models.main.main.layers.find(l => l.name == 'trees_p'))
                         });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.road_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(WinterForestRoadScene.models.main.main.layers.find(l => l.name == 'road_p'))
                         });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.treeAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: 200, startFramesClamps: [10, 80], itemFrameslength: 120, 
                            additional: {
                                framesShift: 10,
                                frameslength: 70,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 2, steps: 35, type: 'linear', round: 0 }),
                                    ...easing.fast({from: 2, to: 0, steps: 35, type: 'linear', round: 0 })
                                ]
                            },
                            animationsModel: WinterForestRoadScene.models.treesAnimations,
                        size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslength, size, xClamps, yClamps, color, angleClamps, center, radius, lowerYClamp, mirrorData}) {
            let frames = [];
            let sharedPP = undefined;
            let bottomLine = createLine(new V2(-size.x, size.y), new V2(size.x*2, size.y));
            let rgb = colors.colorTypeConverter({value: color, toType:'rgb'})

            let pointsLength = 40;

            if(mirrorData) {
                mirrorData.rgb = colors.colorTypeConverter({value: mirrorData.color, toType:'rgb'})
            }

            if(!lowerYClamp)
                lowerYClamp = [size.y, size.y];

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength/2, itemFrameslength);
            
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                let linePoints = sharedPP.lineV2(point1, point2);
                let startIndex = getRandomInt(0, linePoints.length-1-pointsLength);

                let linePointsIndices = easing.fast({ from: startIndex, to: startIndex + pointsLength, steps: totalFrames, type: 'linear', round: 0});
                let linePointsAValues = [
                    ... easing.fast({from: 0, to: 1, steps: pointsLength/2, type: 'quad', method: 'inOut', round: 2}),
                    ... easing.fast({from: 1, to: 0, steps: pointsLength/2, type: 'quad', method: 'inOut', round: 2}),
                ]

                let aValues = easing.fast({from: 1, to: 0, steps: radius, type: 'quad', method: 'in', round: 2});
                let lowerY = getRandomInt(lowerYClamp[0], lowerYClamp[1]);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let index = linePointsIndices[f];
                    let p = linePoints[index];
                    let dist = fast.r(new V2(p).distance(center));
                    let a = dist >= radius ? 0 : aValues[dist];
                    a = a*linePointsAValues[index-startIndex]; 
            
                    if(isNaN(a)) {
                        a = 0;
                    }

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    mirrored: getRandomBool(),
                    lowerY,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                let mirrorHlp;
                if(mirrorData) {
                    mirrorData.frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        mirrorHlp = hlp;
                    });
                }

                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];

                        if(itemData.frames[f]){
                            let {p, a} = itemData.frames[f];

                            if(p.y > itemData.lowerY)
                                continue;

                            rgb.a = a;
                            hlp.setFillColor(colors.rgbToString({value: rgb, isObject: true})).dot(p);

                            if(mirrorHlp && itemData.mirrored){
                                if(p.x > mirrorData.xBoundary){
                                    let flipped = flipX(p, mirrorData.xBoundary);

                                    let d = flipped.x - mirrorData.xBoundary;
                                    let dnew = fast.r(d*0.5);
                                    flipped.x = mirrorData.xBoundary+dnew;

                                    mirrorData.rgb.a = a/2;
                                    mirrorHlp.setFillColor(colors.rgbToString({value: mirrorData.rgb, isObject: true})).dot(flipped);
                                } 
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.frontalSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let darkZone = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(0,0,0,0.3)').rect(38,131, 30, 15)
                })
                this.frames = createSnowFrames({
                    framesCount: 200, itemsCount: 50, itemFrameslength: 150, size: this.size, 
                    xClamps: [30, 110], yClamps: [60, 110], angleClamps: [-20,20], color: '#bdd1d1',
                    center: new V2(75,130), radius: 40,
                    lowerYClamp: [150,150]
                    }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(f, 0,0)
                        ctx.globalCompositeOperation = 'source-atop'
                        ctx.drawImage(darkZone, 0,0)
                    }));

                this.registerFramesDefaultTimer({});
                
            }
        }), 15)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(WinterForestRoadScene.models.main, { renderOnly: ['car'] })

                this.car_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(WinterForestRoadScene.models.main.main.layers.find(l => l.name == 'car_p'))
                         });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 20)

        this.backSnow1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.frames = createSnowFrames({
                    framesCount: 200, itemsCount: 50, itemFrameslength: 150, size: this.size, 
                    xClamps: [-20, 60], yClamps: [80, 110], angleClamps: [-20,20], color: '#99313e',
                    center: new V2(22,150), radius: 20,
                    lowerYClamp: [200,200]
                    });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
                
            }
        }), 25)

        this.backSnow2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.frames = createSnowFrames({
                    framesCount: 200, itemsCount: 50, itemFrameslength: 150, size: this.size, 
                    xClamps: [40, 120], yClamps: [80, 110], angleClamps: [-20,20], color: '#BE504E',
                    center: new V2(70,150), radius: 20,
                    lowerYClamp: [200,200]
                    });

                this.registerFramesDefaultTimer({});
                
            }
        }), 25)

        this.exshaust = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let circleImages = {};
                let cColors = ['#99313e']

                for(let c = 0; c < cColors.length; c++){
                    circleImages[cColors[c]] = []
                    for(let s = 1; s < 6; s++){
                        if(s > 8)
                            circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                                hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                            })
                        else {
                            circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                        }
                    }
                }

                let p1 = new V2(30, 169);
                let createCloudsFrames = function({framesCount, itemsCount, itemFrameslength, size}) {
                    let frames = [];
                    
                    let aValues = [
                        ...easing.fast({from: 0, to: 0.1, steps: itemFrameslength, type: 'linear', round: 2 }),
                        ...easing.fast({from: 0.1, to: 0, steps: itemFrameslength, type: 'linear', round: 2 })
                    ]
                    let sizeValues = [
                        ...easing.fast({from: 1, to: 2, steps: itemFrameslength/4, type: 'linear', round: 0 }),
                        ...easing.fast({from: 2, to: 1, steps: itemFrameslength*3/4, type: 'linear', round: 0 })
                    ]

                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let frames = [];
                        let currentP = p1.clone();
                        let direction = new V2(-getRandom(0.05, 0.1), -getRandom(0.025, 0.1))
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            currentP = currentP.add(direction);
                    
                            frames[frameIndex] = {
                                a: aValues[f],
                                size: sizeValues[f],
                                p: currentP.clone().toInt()
                            };
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
                                    ctx.globalAlpha = itemData.frames[f].a;

                                    ctx.drawImage(circleImages['#99313e'][itemData.frames[f].size], itemData.frames[f].p.x, itemData.frames[f].p.y)

                                    ctx.globalAlpha = 1;
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                }

                this.frames = createCloudsFrames({ framesCount: 200, itemsCount: 40, itemFrameslength: 100, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), 21)
    }
}