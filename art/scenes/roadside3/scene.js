class Roadside3Scene extends Scene {
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
                fileNamePrefix: 'roadside3',
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
        let model = Roadside3Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = undefined, lowerLinePoints = []
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed && isFunction(changeXSpeed)) {
                xSpeedValues = changeXSpeed(size)
            }

            let angleToYChangeValues = easing.fast({from: angleYChange[0], to: angleYChange[1], steps: size.y, type: 'linear', method: 'base', round: 2});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClapms);
                //totalFrames = framesCount;
                let p = V2.random(xClamps, yClamps);
                let sLen = getRandomInt(snowflakeLengthClamps);
                let angle = getRandomInt(angleClamps);

                let angleChange = angleToYChangeValues[p.y];
                if(angleChange == undefined) 
                {
                    if(p.y < 0)
                        angleChange = angleYChange[0];
                    else if(p.y >= size.y)
                        angleChange = angleYChange[1]
                    else 
                        angleChange = 0;
                }
                angle+=angleChange;
            
                let direction = V2.up.rotate(angle);
                let distance = getRandomInt(distanceCLamps) * (xSpeedValues[p.x] || 1);

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2, { toV2: true });

                let maxA = aClapms[1];
                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                let addShine = addParticlesShine && getRandomInt(0,addParticlesShine.upperChance) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(addParticlesShine.framesLengthClamps);
                    shineMul = getRandomInt(addParticlesShine.aMulClamps);
                }

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                    // aValues = aValues.map(a => a*shineMul);
                }

                let linePoints = [];
                let lineAValues = [];
                if(sLen > 0) {
                    linePoints = appSharedPP.lineV2(new V2(), new V2().add(direction.mul(sLen)).toInt());
                    lineAValues = alphaUseEasing ? [
                        ...easing.fast({ from: 0, to: maxA, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: maxA, to: 0, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 })
                    ] : new Array(linePoints.length).fill(maxA);
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = points[pointIndexValues[f]]
                    let a = aValues[f] || 0;
            
                    if(lowerLinePoints[p.x] && p.y > lowerLinePoints[p.x])
                        continue;

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames,
                    linePoints,
                    lineAValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { linePoints, lineAValues, } = itemData
                            let {p, a} = itemData.frames[f];

                            let repeats = 1;
                            if(doubleHeight)
                                repeats = 2;

                            for(let yShift = 0; yShift < repeats; yShift++) {
                                if(linePoints.length > 0) {
                                    let prev = undefined;
                                    for(let i = 0; i < linePoints.length; i++) {
                                        let lp = linePoints[i];
        
                                        let tp = p.add(lp);
                                        let currentA = a*(lineAValues[i] || 0); 
                                        hlp.setFillColor(colorPrefix + currentA).dot(tp.x, tp.y+yShift)
    
                                        if(prev && prev.y != tp.y) {
                                            hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        }
    
                                        prev = tp;
                                    }
                                }
                                else {
                                    hlp.setFillColor(colorPrefix + a + ')').dot(p.x, p.y + yShift)
                                }
                            }
                        }
                        
                    }

                    if(mask) {
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(mask, 0, 0)
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
                //
            }
        }), 1)

        this.forest = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['forest', 'forest_d', 'forest_d2'] }),
            init() {
                this.basicAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetColors = ['#2d3f60', '#1e2a44', ] //'#162036', '#0e1527','#0a0d1a'
                        let pixelsData = getPixels(this.parent.img, this.size);
                        let pData = [];
                        let pDataRot = [];
                        let clamps = [-1,1]
        
                        let shifts = [V2.left, V2.down]

                        pixelsData.forEach(pd => {

                            if(getRandomInt(0, 10) == 0) {
                                let color =  colors.rgbToHex(pd.color)

                                if(targetColors.indexOf(color) != -1){
                                    pData[pData.length] = { point: pd.position.add(shifts[getRandomInt(0, shifts.length-1)]), color }  //V2.random(clamps, clamps)
                                }
                            }
                        });
                        

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData: pData, itemFrameslength: [20,30], size: this.size })
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 3)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['road'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,40], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_shine_zone')).map(pd => new V2(pd.point));
                        let aToy = easing.fast({from: 0.1, to: 0.4, steps: 131, type: 'linear', round: 2});
                        
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#fff',//whiteColorPrefix + aToy[p.y-131] + ')'
                            aClamps: [0, aToy[p.y-131]]
                        }));

                        this.frames = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [40,50], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,50) == 0, 
                            smooth: {
                                aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });

                    }
                }))
            }
        }), 5)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frontalSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, {renderOnly: ['frontal_g'], forceVisivility: { frontal_g: { visible: true } }})

                        this.layers = [
                            {
                                framesCount: 300, itemsCount: 1000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: mask, angleClamps: [170, 190], distanceCLamps: [18, 21], xClamps: [130, 210], yClamps: [110, 140], size: this.size, aMul: 1, lowerLinePoints: []
                            },
                            {
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask, angleClamps: [170, 190], distanceCLamps: [26, 29], xClamps: [130, 210], yClamps: [110, 140], size: this.size, aMul: 1, lowerLinePoints: []
                            }
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['car'] }),
                    init() {
                        
                    }
                }))

                this.reflections = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let zone = createCanvas(this.size, (ctx, size, hlp) => {
                            let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'car_reflection_zone')).map(pd => new V2(pd.point));
                            let pp = new PP({ctx});
                            pp.setFillColor(whiteColorPrefix + '0.2)');
                            pp.fillByCornerPoints(corners)
                        })

                        this.frames = createSnowFallFrames({
                            framesCount: 300, itemsCount: 100, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.35], mask: zone, angleClamps: [180, 185], distanceCLamps: [10, 15], xClamps: [115, 140], yClamps: [125, 135], size: this.size, aMul: 1, lowerLinePoints: []
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.backSnowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, {renderOnly: ['back_g'], forceVisivility: { back_g: { visible: true } }})

                        this.layers = [
                            {
                                framesCount: 300, itemsCount: 1000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: mask, angleClamps: [170, 190], distanceCLamps: [18, 21], xClamps: [30, 120], yClamps: [100, 130], size: this.size, aMul: 1, lowerLinePoints: []
                            },
                            {
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask, angleClamps: [170, 190], distanceCLamps: [26, 29], xClamps: [30, 120], yClamps: [100, 130], size: this.size, aMul: 1, lowerLinePoints: []
                            }
                    ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))

                this.smoke = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSmokeFrames({framesCount, itemsCount, itemFrameslength, mask, size}) {
                        let frames = [];
                        
                        let startPositions = [{p: new V2(95, 147), maxA: 0.025}, {p:new V2(62, 146), maxA: 0.025}]

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let sp = startPositions[getRandomInt(0, startPositions.length-1)];
                            let maxA = 0.02//fast.r(getRandom(0.02, 0.03),3); //sp.maxA//
                            let aValues = [
                                ...easing.fast({from: 0, to: maxA, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                            ]

                            let cornerPoints = [
                                sp.p,
                                sp.p,
                                sp.p,
                                sp.p
                            ]

                            let directions = [
                                new V2(-1,0).rotate(getRandomInt(-45,45)),
                                new V2(0,-1).rotate(getRandomInt(-45,45)),
                                new V2(1,0).rotate(getRandomInt(-45,45)),
                                new V2(0,1).rotate(getRandomInt(-45,45))
                            ]

                            let distanceValues = new Array(cornerPoints.length).fill().map(_ => {
                                let maxD = getRandomInt(4, 8);
                                
                                return [
                                    ...easing.fast({from: 0, to: maxD, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                                    ...easing.fast({from: maxD, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                                ]
                            });

                            let cornerPointsShifts = directions.map((direction, i)=> distanceValues[i].map(distance => direction.mul(distance)));

                            let velocity = new V2(
                                fast.r(getRandom(-0.025, -0.1), 2),
                                0
                            )

                            let yAcceleration = getRandom(-0.0005,-0.001);
                            let mainShift = V2.zero;

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                velocity.y+=yAcceleration;
                                mainShift.add(velocity, true);

                                frames[frameIndex] = {
                                    cornerPointsShifts: new Array(cornerPoints.length).fill().map((el, i) => cornerPointsShifts[i][f]),
                                    mainShift: mainShift.clone(),
                                    a: aValues[f]
                                };
                            }
                        
                            return {
                                cornerPoints,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let curveCornerPoints = itemData.cornerPoints.map((p, i) => p.add(itemData.frames[f].mainShift).add(itemData.frames[f].cornerPointsShifts[i]))
                                        let cornerPoints = appSharedPP.curveByCornerPoints([...curveCornerPoints], 5, true)

                                        if(cornerPoints.length > 3){
                                            pp.setFillStyle(whiteColorPrefix + fast.r(itemData.frames[f].a,3) +')')
                                            pp.fillByCornerPoints(cornerPoints, { fixOpacity: true })
                                        }
                                    }
                                    
                                }

                                if(mask) {
                                    ctx.globalCompositeOperation = 'source-atop'
                                    ctx.drawImage(mask, 0, 0)
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSmokeFrames({framesCount: 300, itemsCount: 120, itemFrameslength: 300,
                            mask: PP.createImage(model, {renderOnly: ['back_g2'], forceVisivility: { back_g2: { visible: true } }}),
                            size: this.size});
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 7)
    }
}