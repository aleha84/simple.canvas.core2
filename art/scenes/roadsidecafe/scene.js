class RoadsideCafeScene extends Scene {
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
                size: new V2(200,113).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'roadsidecafe',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    /*
        +1. Анимация облаков - 3 слоя
        +2. Слабый дождь
        +3. Переливы цветов на дороге, создать эффект мокрой поверхности
        +3.1 Багущий по обочине поток?
        +4. Трава на переднем плане + анимация
        +5. Мерцание боковой лампочки на кафе
        6. 24h OPEN - моргающая надпись
        +7. Мерцание огней в дальнем городе
        +8. Капли с крыши кафе
    
      */
    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        let model = RoadsideCafeScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        const createRainFrames = function({framesCount, itemsCount, itemFrameslength, size,
            aValue, trailLenght, xClamps, angleClamps, targetZonePoints, targetPoints
        }) {
            let frames = [];
            let trailAValues = [
                ...new Array(trailLenght).fill(aValue)
                // ...easing.fast({from: aClamps[1], to: aClamps[0], steps: trailLenght[1], type: 'quad', method: 'out', round: 3 }).slice(1).reverse(),
                // aClamps[1],
                // ...easing.fast({from: aClamps[1], to: aClamps[0], steps: trailLenght[0], type: 'quad', method: 'out', round: 3 }).slice(1)
            ]

            let upperLine = {begin: new V2(-1000, 0), end: new V2(1000, 0)}

            let itemsData = targetPoints.map((tp, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
                let yShift = getRandomInt(0, 40);

                let to = tp;//targetZonePoints[getRandomInt(0, targetZonePoints.length-1)];
                let from = raySegmentIntersectionVector2(to, V2.down.rotate(getRandom(angleClamps[0], angleClamps[1])-180), upperLine);
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
                                if(pi < itemData.points.length) {
                                    let lp = itemData.points[pi]

                                    hlp.setFillColor(whiteColorPrefix + trailAValues[i] + ')').dot(lp)
                                    // if(prev && lp.x != prev.x) {
                                    //     hlp.setFillColor(whiteColorPrefix + trailAValues[i]/2 + ')')
                                    //         .dot(lp.x+1, lp.y).dot(lp.x, lp.y-1)
                                    // }

                                    prev = {x: lp.x, y: lp.y};
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        
                    }

                    // ctx.globalCompositeOperation = 'source-atop';
                    // ctx.drawImage(sky_dark_overlay, 0, 0);
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
                                //easingMethods: ['base', 'base'],
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds1'] }),
                                totalFrames,
                                xShift: -6,
                                size: this.size,
                                startFrameIndex: 75
                            },
                            {
                                easingType: 'sin',
                                //easingMethods: ['base', 'base'],
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds2'] }),
                                totalFrames,
                                xShift: -4,
                                size: this.size,
                                startFrameIndex: 150
                            },
                            {
                                easingType: 'sin',
                                //easingMethods: ['base', 'base'],
                                layerImg: PP.createImage(customModel, { renderOnly: ['clouds3'] }),
                                totalFrames,
                                xShift: -2,
                                size: this.size,
                                startFrameIndex: 0
                            }
                        ]

                        lData.map(ld => this.addChild(new GO({
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
            }
        }), 1)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['mountains', 'city', 'ground'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [90,120], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'city_p')),
                            smooth: {
                                aClamps: [0, 1],
                                easingType: 'quad', 
                                easingMethod: 'inOut',
                                easingRound: 2
                            }
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['road', 'post'] })

                this.roadWaterFlow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createFlowFrames({framesCount, itemsCount, itemFrameslength, path, itemFlowDistanceClamps, maxA, size}) {
                        let frames = [];

                        let aMulValues = easing.fast({from: 3, to: 1, steps: path.length, type: 'linear', round: 2});
                        let distMulValues = easing.fast({from: 2, to: 1, steps: path.length, type: 'linear', round: 2});

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let startPointIndex = getRandomInt(0, path.length-2);

                            if(startPointIndex!=0 && getRandomInt(0,10) == 0 ) {
                                startPointIndex = 0;
                            }

                            let aMul = aMulValues[startPointIndex];
                            let distMul = distMulValues[startPointIndex];
                            let startPoint = path[startPointIndex];
                            let nextPoint = path[startPointIndex+1];
                            let direction = startPoint.direction(nextPoint);
                            let distance = startPoint.distance(nextPoint);
    
                            let p0 = startPoint.add(direction.mul(getRandom(0, distance))).toInt().add(V2.random([0,1], [0,0]));
                            let p1 = p0.add(direction.mul(getRandom(itemFlowDistanceClamps[0]*distMul, itemFlowDistanceClamps[1]*distMul))).toInt();
    
                            let points = appSharedPP.lineV2(p0, p1);
                            let pointIndices = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                            let aValues = [
                                ...easing.fast({from: 0, to: maxA*aMul, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA*aMul, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    p: points[pointIndices[f]],
                                    a: aValues[f]
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
                                        hlp.setFillColor(whiteColorPrefix + itemData.frames[f].a + ')').rect(itemData.frames[f].p.x, itemData.frames[f].p.y, 2,1)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createFlowFrames({ framesCount: 300, itemsCount: 2000, itemFrameslength: 40, maxA: 0.05, size: this.size,
                            itemFlowDistanceClamps:[1,3],
                        path: PP.getLayerByName(model, 'flow_path').groups[0].points.map(p => new V2(p.point)) })

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.road_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let pixels = getPixelsAsMatrix(PP.createImage(model, { renderOnly: ['road'] }), this.size)

                        /*
color: "#5e708a"
opacity: 1
point: {x: 17, y: 79}*/ 

                        let pd = [];
                        for(let y = 0; y < this.size.y; y++) {
                            if(!pixels[y])
                                continue;

                            for(let x = 0; x < this.size.x; x++) {
                                let p = pixels[y][x];
                                if(!p)
                                    continue;

                                let neighbour = pixels[y][x+1];
                                if(!neighbour)
                                    continue;

                                if( getRandomInt(0,3) == 0 && (p[0] != neighbour[0] || p[1] != neighbour[1] || p[2] != neighbour[2])) {
                                    pd.push({
                                        color: `rgba(${neighbour[0]}, ${neighbour[1]}, ${neighbour[2]}, 1)`,
                                        opacity: 1,
                                        point: {x, y}
                                    })
                                }
                            }
                        }

                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [15,20], size: this.size, 
                            pointsData: pd//animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p')) 
                        });

                        this.registerFramesDefaultTimer({});

                    }
                }))

                this.trucks = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['second_truck', 'first_truck'] })
                }))
            }
        }), 5)

        this.cafe = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
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
                this.img = PP.createImage(model, { renderOnly: ['cafe', 'cafe_interior', 'title2'] })

                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createDropsFrames({
                            itemsCount: 3, framesCount: 300, itemFrameslength1Clamps: [5,10], itemFrameslength2Clamps: [15,20], 
                            size: this.size, opacityClamps: [0.3,0.4], 
                            startPositions: [
                                { type: 'points', points: [
                                    ...appSharedPP.lineV2(new V2(104,57), new V2(110,57)),
                                ], height: 25, tail: 1 },
                                // { type: 'points', points: [
                                //     ...appSharedPP.lineV2(new V2(137,55), new V2(174,54)),
                                // ], height: 30, tail: 2 },
                                // { type: 'points', points: [
                                //     ...appSharedPP.lineV2(new V2(95,137), new V2(103,137)),
                                // ], height: 70, tail: 4 },
                            ], reduceOpacityOnFall: true,
                            type: 'quad', method: 'in'
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 300, itemsCount: 5, itemFrameslength: 10, size: this.size, aValue: 0.125, trailLenght: 8, angleClamps: [-18,-20], 
                        //targetZonePoints: appSharedPP.fillByCornerPoints([new V2(12,73), new V2(175,97), new V2(175,111), new V2(76,108), new V2(3,80)]) 
                        targetPoints: [new V2(27,80), new V2(80,87), new V2(69,97)]
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.rain2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ framesCount: 300, itemsCount: 5, itemFrameslength: 10, size: this.size, aValue: 0.15, trailLenght: 10, angleClamps: [-20,-20], 
                        //targetZonePoints: appSharedPP.fillByCornerPoints([new V2(12,73), new V2(175,97), new V2(175,111), new V2(76,108), new V2(3,80)]) 
                        targetPoints: [new V2(110,96), new V2(157,97), new V2(210, 107), new V2(167,120)]
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.blinkingLamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let overlay = PP.createImage(model, { renderOnly: ['side_lamp_overlay'] });
                        let oValues = [1, 0.75, 0.5, 0.25, 0];
                        let oObj = {};
                        oValues.forEach(o => {
                            oObj[o] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = o;
                                ctx.drawImage(overlay, 0, 0);
                            })
                        })

                        var oData = new Array(300).fill(0);
                        oData.fill(0.25, 20,30)
                        oData.fill(0.5, 24,26)

                        oData.fill(0.25, 50, 80)

                        oData.fill(0.75, 100,105)
                        oData.fill(0.5, 105,108)
                        oData.fill(0.25, 108,110)

                        oData.fill(0.5, 180, 200)
                        oData.fill(0, 190, 195)
                        oData.fill(0.25, 200, 205)

                        this.currentFrame = 0;
                        this.img = oObj[oData[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = oObj[oData[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == oData.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))
            }
        }), 7)

        this.foreground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['foreground'] })

                this.grass = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let animation = {
                            type: 0,
                            shiftDirection: V2.right
                        };

                        let triggerData = [
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(-1,85), new V2(-1,111)], 
                                p0: new V2(-1,85), p1: new V2(90,82),
                                triggerMovementStartIndex: 10, triggerMovementFramesCount: 60, 
                                itemFramesCount: [40, 60],
                                startFrameIndex: [0, 80],
                                animation: animation
                            },
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(90,85), new V2(90,111)], 
                                p0: new V2(90,85), p1: new V2(0,82),
                                triggerMovementStartIndex: 110, triggerMovementFramesCount: 30, 
                                itemFramesCount: [80, 90],
                                startFrameIndex: [0, 30],
                                animation: animation
                            },
                        ];

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: 300,
                            triggerData: triggerData,
                            img: PP.createImage(model, { renderOnly: ['fg_grass'] }),
                            size: this.size
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 9)
    }
}