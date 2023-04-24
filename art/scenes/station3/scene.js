class Station3Scene extends Scene {
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
                fileNamePrefix: 'station3',
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
        const model = Station3Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(255,255,255,';

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                
            }
        }), 1)

        let createParticlesFrames = function({framesCount, itemFrameslength, permanentPredicate = () => false, pointsData, size}) {
            let frames = [];
            
            let itemsData = pointsData.map((pd, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength);
            
                if(permanentPredicate()) {
                    totalFrames = framesCount;
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = true;
                }
            
                return {
                    pd,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                        }
                    }
                });
            }
            
            return frames;
        }

        this.far = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['far'] }),
            init() {
                this.d = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createParticlesFrames({ framesCount: 100, itemFrameslength: [30,60], 
                            permanentPredicate: () => getRandomInt(0,1) == 0, size: this.size,
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far_d'))
                        })
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 4)

        this.mid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['mid'] }),
            init() {
                this.d = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createParticlesFrames({ framesCount: 100, itemFrameslength: [30,60], 
                            permanentPredicate: () => getRandomInt(0,1) == 0, size: this.size,
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'mid_d'))
                        })
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'mid_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.rain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createRainFrames({framesCount, itemsCount, angleClamps, maxA, lowerYClamps,xClamps, lengthClamps, itemFrameslength, size}) {
                        let frames = [];
                        
                        //let angleValues = easing.fast({from: angleClamps[0], to: angleClamps[1], steps: size.x, type: 'linear', round: 1});
                        
            
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let lowerY = getRandomInt(lowerYClamps);
                            let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}
                            let x = getRandomInt(xClamps);
                            let y = getRandomInt(-lengthClamps[1] -10, -lengthClamps[1])
                            let p0 = new V2(x,y);
                            let angle = getRandom(angleClamps[0], angleClamps[1])//angleValues[x];
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
                                                hlp.setFillColor('rgba(255,255,255,' + maxA + ')').dot(lp);
                                            }
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    }, 
                    init() {
                        this.l2 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = this.parent.createRainFrames({
                                    framesCount: 200, itemsCount: 2, angleClamps: [-5,-10], maxA: 0.05, lowerYClamps: [110,125],xClamps: [0,60], 
                                    lengthClamps: [8,10], itemFrameslength: 25, size: this.size})
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.l2 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = this.parent.createRainFrames({
                                    framesCount: 200, itemsCount: 2, angleClamps: [-9,-12], maxA: 0.05, lowerYClamps: [120,140],xClamps: [50,150], 
                                    lengthClamps: [8,10], itemFrameslength: 25, size: this.size})
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.l1 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = this.parent.createRainFrames({
                                    framesCount: 200, itemsCount: 2, angleClamps: [-10,-15], maxA: 0.075, lowerYClamps: [140,190],xClamps: [70,170], 
                                    lengthClamps: [8,10], itemFrameslength: 25, size: this.size})
        
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                        
                    }
                }))
            }
        }), 7)

        this.close = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['close'] }),
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
    
                                hlp.setFillColor(colorPrefix + itemData.frames[f].alpha + ')').dot(p);
    
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
                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createDropsFrames({
                            itemsCount: 7, framesCount: 200, itemFrameslength1Clamps: [50,70], itemFrameslength2Clamps: [30,40], 
                            size: this.size, opacityClamps: [0.2,0.3], 
                            startPositions: [
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(142,0), new V2(108,16)),//...appSharedPP.lineV2(new V2(129,6), new V2(108,16)),
                                ], height: 100, tail: 3 },
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(91,24), new V2(70,33)),
                                ], height: 70, tail: 3 },
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(62,37), new V2(33,50)),
                                ], height: 50, tail: 2 },
                                // { type: 'points', points: [
                                //     ...appSharedPP.lineV2(new V2(17,57), new V2(0,65)),
                                // ], height: 30, tail: 2 }
                            ], reduceOpacityOnFall: true,
                            type: 'quad', method: 'in'
                        })
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
                this.d = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createParticlesFrames({ framesCount: 200, itemFrameslength: [30,60], 
                            permanentPredicate: () => getRandomInt(0,1) == 0, size: this.size,
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_d'))
                        })
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 10)
    }
}