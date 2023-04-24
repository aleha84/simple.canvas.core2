class Portal6Scene extends Scene {
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
                fileNamePrefix: 'portal6',
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
        let model = Portal6Scene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        let circleImages = {};
        let cColors = [ '#95d3ed', '#35abdd', '#267fb3' ]

        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 30; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        this.portal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let portalRing_pointsData = model.main.layers.find(l => l.name == 'portal_ring').groups[0].points.map(p => new V2(p.point));

                this.clouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 300;
                        let cloudsParams = [
                            {
                                opacity: 0.5,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#95d3ed', size: this.size,
                                    directionAngleClamps: [60, 90], distanceClamps: [10,15], sizeClamps: [5,10], 
                                    //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                    initialProps: {
                                        line: true, p1: new V2(105, 152), p2: new V2(151, 135)
                                    }, yShiftClamps: [-1, -2],
                            }, 
                            {
                                opacity: 0.5,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#95d3ed', size: this.size,
                                    directionAngleClamps: [30, 0], distanceClamps: [10,15], sizeClamps: [4,6], 
                                    //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                    initialProps: {
                                        line: true, p1: new V2(138, 150), p2: new V2(159, 115)
                                    }, xShiftClamps: [-3,-6]
                            },
                            {
                                opacity: 0.5,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#95d3ed', size: this.size,
                                    directionAngleClamps: [60, 90], distanceClamps: [10,15], sizeClamps: [5,10], 
                                    //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                    initialProps: {
                                        line: true, p1: new V2(105, 157), p2: new V2(151, 140)
                                    }, yShiftClamps: [-4,-7],
                            }, 
                            {
                                opacity: 0.5,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#95d3ed', size: this.size,
                                    directionAngleClamps: [30, 0], distanceClamps: [10,15], sizeClamps: [4,8], 
                                    //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                    initialProps: {
                                        line: true, p1: new V2(144, 150), p2: new V2(165, 121)
                                    }, xShiftClamps: [-3,-6]
                            },
                            {
                                opacity: 0.5,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#95d3ed', size: this.size,
                                    directionAngleClamps: [60, 90], distanceClamps: [10,15], sizeClamps: [4,8], 
                                    //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                                    initialProps: {
                                        line: true, p1: new V2(110, 160), p2: new V2(151, 148)
                                    }, yShiftClamps: [-4,-8],
                            },  
                        ];

                        let itemsFrames = cloudsParams.map(p => {
                            return {
                                opacity: p.opacity,
                                frames: animationHelpers.createCloudsFrames({...p, circleImages})
                            }
                        })

                        this.frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 1;
                                for(let i = 0; i < itemsFrames.length; i++){
                                    ctx.globalAlpha = itemsFrames[i].opacity;
                                    ctx.drawImage(itemsFrames[i].frames[f],0,0);
                                }

                                ctx.globalAlpha = 1;

                                // ctx.globalCompositeOperation = 'source-atop';
                                // ctx.drawImage(darkOverlay, 0,0);
                            })
                        }

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.particles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createPortalParticlesFrames({framesCount, itemsCount, itemFrameslength, size, r1Clamps, angleClamps, r0}) {
                        let frames = [];
                        let sharedPP = PP.createNonDrawingInstance();
                        let colorRgb = colors.colorTypeConverter({ value: '#f5fafc', fromType: 'hex', toType: 'rgb' })

                        let center = new V2(130, 133);
                        //let r0 = 25;
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let r1 = getRandomInt(r1Clamps);
                            let angle = getRandomInt(angleClamps);
                            let direction = V2.up.rotate(angle);

                            let r0Delta = 0;
                            if(angle > 40){
                                r0Delta=2;
                            }

                            let p0 = center.add(direction.mul(r0-r0Delta)).toInt()
                            let p1 = center.add(direction.mul(r1-r0Delta)).toInt()

                            let linePoints = sharedPP.lineV2(p0, p1);
                            let aValues = easing.fast({from: 1, to: 0, steps: totalFrames, type: 'quad', method: 'out', round: 1});
                            let linePointIndicesValues = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    a: aValues[f],
                                    pIndex: linePointIndicesValues[f]
                                };
                            }
                        
                            return {
                                linePoints,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp
                                            .setFillColor(colors.rgbToString({ value: colorRgb, isObject: true, opacity: itemData.frames[f].a }))
                                            .dot(itemData.linePoints[itemData.frames[f].pIndex])
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createPortalParticlesFrames({ framesCount: 100, itemsCount: 200, itemFrameslength: [60,90], size: this.size, 
                            r0: 25, r1Clamps: [18, 23], angleClamps: [-150,150] })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.ring = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createPortalRingFrames({framesCount, pointsData, itemFrameslength, size}) {
                        let frames = [];
                        let center = new V2(131, 133);
                        let sharedPP = PP.createNonDrawingInstance();

                        itemFrameslength = framesCount;

                        let itemsData = pointsData.map((el, i) => {
                            let startFrameIndex = i*15; //getRandomInt(0, framesCount-1);
                            while(startFrameIndex > framesCount) {
                                startFrameIndex-=framesCount;
                            }
                            let totalFrames = itemFrameslength;
                        
                            let frames = [];
                            if(i > 6) {

                                let direction = el.direction(center);
                                let directionLine = sharedPP.lineV2(el.add( direction.mul(getRandomInt(-2,-3)) ), center);

                                let p0Index = 0;
                                let p1Index = getRandomInt(1, 3);

                                let pIndexValues = [
                                    ...easing.fast({from: p0Index, to: p1Index, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0}),
                                    ...easing.fast({from: p1Index, to: p0Index, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0}),
                                ]

                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        p: directionLine[pIndexValues[f]]
                                    };
                                }
                            }
                            else {
                                frames = new Array(itemFrameslength).fill({p: el});
                            }
                        
                            return {
                                frames
                            }
                        })

                        //console.log(itemsData);
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                pp.setFillColor('#f5fafc');

                                let curveCornerPoints = []

                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        curveCornerPoints.push(itemData.frames[f].p);
                                    }
                                }

                                let curveLinePoints = mathUtils.getCurvePointsMain({points: curveCornerPoints, isClosed: true, numOfSegments: 5 });
                                pp.fillByCornerPoints(curveLinePoints);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        

                        this.frames = this.createPortalRingFrames({
                            framesCount: 50,
                            pointsData: portalRing_pointsData,
                            size: this.size
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.tunnel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['tunnel', 'tunnel_d', 'tunnel_d1'] })

                this.tunnel_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tunnel_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [20,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.blinkingDots = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createBlinkFrames({framesCount, linePointsData, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let _c = 'rgba(53,171,221,';

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let p = 
                                i <  linePointsData.length ? 
                                linePointsData[i] :
                                linePointsData[getRandomInt(0, linePointsData.length-1)];

                            let maxA = fast.r(getRandom(0.3, 0.7) ,2)

                            let aValues = [
                                ...easing.fast({ from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                                ...easing.fast({ from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
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
                                        hlp.setFillColor(_c + itemData.frames[f].a + ')').dot(itemData.p);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let linePointsData = model.main.layers.find(l => l.name == 'blinking_dots').groups[0].points.map(p => p.point);

                        this.frames = this.createBlinkFrames({
                            framesCount: 100, linePointsData,
                            itemsCount: 60, itemFrameslength: [30, 80], size: this.size
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.pWlows = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createFlowFrames({framesCount, itemsCount, linePointsData, itemFrameslength, size}) {

                        let excludeZone = PP.createImage(model, { renderOnly: ['effects_lines_exclude'], forceVisibility: { effects_lines_exclude: { visible: true } } })

                        let frames = [];
                        let _c = 'rgba(255,255,255,';
                        let tailAValues = easing.fast({from: 0.5, to: 0.1, steps: 5, type: 'linear', round: 2});
                        let sharedPP = PP.createNonDrawingInstance();

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let gIndex = getRandomInt(0, linePointsData.groups.length-1);
                            let group = linePointsData.groups[gIndex];

                            let linePoints = group.linePoints;

                            if(!linePoints) {
                                group.linePoints = sharedPP.lineByCornerPoints(group.points.map(p => p.point));
                                linePoints = group.linePoints;
                            }

                            let pIndexValues = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'quad', method: 'out', round: 0})

                            let show = true;
                            if(gIndex == 2) {

                            }

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    pIndex: pIndexValues[f]
                                };
                            }
                        
                            return {
                                linePoints,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        for(let i = 0; i < 5; i++) {
                                            let index = itemData.frames[f].pIndex - i;
                                            if(index < 0)
                                                continue;

                                            let p = itemData.linePoints[index]
                                            hlp.setFillColor(_c + tailAValues[i] + ')').dot(p)
                                        }
                                    }
                                    
                                }

                                ctx.globalCompositeOperation = 'destination-out'
                                ctx.drawImage(excludeZone, 0, 0)
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let linePointsData = model.main.layers.find(l => l.name == 'effects_lines');
                        this.frames = this.createFlowFrames({
                            framesCount: 300, itemsCount: 50, linePointsData, itemFrameslength: [20, 40], size: this.size
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)
    }
}