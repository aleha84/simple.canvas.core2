class RavenScene extends Scene {
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
                size: new V2(150,150).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'raven',
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
            img: PP.createImage(RavenScene.models.main, { renderOnly: ['bg'] }),
            // img: createCanvas(V2.one, (ctx, size, hlp) => {
            //     hlp.setFillColor('black').dot(0,0);
            // })
            init() {
                this.effects = this.addChild(new GO({
                    position: new V2(-10, 0),
                    size: this.size,
                    createEffectsFrames({framesCount, size}) {
                        let frames = [];
                        let sharedPP = PP.createNonDrawingInstance();
                        
                        let points = animationHelpers.extractPointData(RavenScene.models.main.main.layers.find(l => l.name == 'bg_curve'));
                        let curvePoints = distinct(mathUtils.getCurvePointsMain({ points: points.map(p => p.point) }).map(p => new V2(p).toInt()), p => p.x + '_' + p.y);

                        let linePoints = [];
                        for(let i = 0; i < curvePoints.length-1; i++) {
                            linePoints = [...linePoints, ...sharedPP.lineV2(curvePoints[i], curvePoints[i+1])];
                        }

                        linePoints = distinct(linePoints, p => p.x + '_' + p.y);

                        let itemsData = linePoints.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = framesCount;
                        
                            let currentW = el.x + getRandomInt(-10, 0);
                            let maxW = currentW + getRandomInt(5, 15);

                            let wValues =//easing.fast({from: currentW, to: maxW, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                            [
                                ...easing.fast({from: maxW, to: currentW, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                                ...easing.fast({from: currentW, to: maxW, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                            ]

                            let dotXValues = undefined;
                            if(getRandomInt(0, 3) == 0) {
                                let to =  size.x;//getRandomInt(4, 8);
                                // if(getRandomBool()) {
                                //     to = size.x;
                                // }
                                dotXValues = easing.fast({from: maxW + to + 50, to: maxW, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                            }

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    w: wValues[f],
                                    dotX: dotXValues ? dotXValues[f] : undefined
                                };
                            }
                        
                            return {
                                p: el,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor('black').rect(0, itemData.p.y, itemData.frames[f].w, 1)
                                        
                                        hlp.setFillColor('rgba(0,0,0,0.25)').rect(itemData.frames[f].w, itemData.p.y , fast.r(itemData.frames[f].w/2), 1)
                                        hlp.setFillColor('rgba(0,0,0,0.25)').rect(itemData.frames[f].w, itemData.p.y , itemData.frames[f].w, 1)
                                        
                                        hlp.setFillColor('black')

                                        // if(itemData.frames[f].dotX) {
                                        //     hlp.dot(itemData.frames[f].dotX, itemData.p.y)
                                        // }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createEffectsFrames({ framesCount: 120, size: this.size})
                        // .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.translate(0, size.y);
                        //     ctx.scale(1, -1);
                        //     ctx.drawImage(f, 0, 0);
                        // }));
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        let colorsCache = {}

        this.raven = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrontalFrames({framesCount, data, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                let sharedPP = PP.createNonDrawingInstance();

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);;
                
                    let gItem = data[getRandomInt(0, data.length-1)]
                    let curvePoints = distinct(mathUtils.getCurvePointsMain({ points: gItem.points.map(p => p.point) }), p => p.x + '_' + p.y).map(p => new V2(p))

                    let pointColor = undefined;
                    if(!colorsCache[gItem.strokeColor]) {
                        colorsCache[gItem.strokeColor] = colors.colorTypeConverter({ value: gItem.strokeColor, fromType: 'hex', toType: 'rgb' });
                    }

                    pointColor = colorsCache[gItem.strokeColor];

                    let linePoints = [];
                    for(let i = 0; i < curvePoints.length-1; i++) {
                        linePoints = [...linePoints, ...sharedPP.lineV2(curvePoints[i], curvePoints[i+1])];
                    }

                    linePoints = distinct(linePoints, p => p.x + '_' + p.y);
                    let visiblePointsLength = fast.r(linePoints.length/2);

                    let maxA = fast.r(getRandom(0.25, 0.5),2)
                    let visiblePointsAValues = [
                        ...easing.fast({from: 0, to: maxA, steps: fast.r(visiblePointsLength/2), type: 'quad', method: 'inOut', round: 1}),
                        ...easing.fast({from: maxA, to: 0, steps: fast.r(visiblePointsLength/2), type: 'quad', method: 'inOut', round: 1})
                    ]

                    let visiblePointsIndexValues = easing.fast({from: 0, to: linePoints.length + visiblePointsLength, steps: totalFrames, type: 'linear', round: 0});

                    let frames = [];
                    let vpi = getRandomInt(0, linePoints.length-1)
                    let shift = new V2(
                        getRandomInt(-1,1),
                        getRandomInt(-1,1)
                    )

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            visiblePointStartIndex: vpi//visiblePointsIndexValues[f]
                        };
                    }
                
                    return {
                        linePoints,
                        visiblePointsLength,
                        visiblePointsAValues,
                        pointColor,
                        shift,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let visiblePointStartIndex = itemData.frames[f].visiblePointStartIndex;
                                for(let i = 0; i < itemData.visiblePointsLength; i++) {
                                    let vIndex = visiblePointStartIndex - i;
                                    if(vIndex < 0 || vIndex > (itemData.linePoints.length-1)){
                                        continue;
                                    }

                                    let p = itemData.linePoints[vIndex];
                                    let a = itemData.visiblePointsAValues[i];
                                    if(a == undefined) a = 0;

                                    hlp.setFillColor(colors.rgbToString({ value: itemData.pointColor, isObject: true, opacity: a }))
                                    .dot(p.x + itemData.shift.x, p.y+ itemData.shift.y);
                                }
                                //hlp.setFillColor(colors.rgbToString({ value: itemData.pointColor, isObject: true, opacity: 1 }))
                                // for(let i = 0; i < itemData.linePoints.length; i++) {
                                //     hlp.dot(itemData.linePoints[i])
                                // }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createParticlesFrames({framesCount, data, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                let sharedPP = PP.createNonDrawingInstance();

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                    
                    let gItem = data[getRandomInt(0, data.length-1)]

                    let pointColor = undefined;
                    if(!colorsCache[gItem.strokeColor]) {
                        colorsCache[gItem.strokeColor] = colors.colorTypeConverter({ value: gItem.strokeColor, fromType: 'hex', toType: 'rgb' });
                    }

                    pointColor = colorsCache[gItem.strokeColor];

                    let linePoints = sharedPP.lineV2(new V2(gItem.points[0].point), new V2(gItem.points[1].point));
                    let linepointsIndices = easing.fast({from: 0, to: linePoints.length-1,steps: totalFrames, type: 'quad', method: 'inOut', round: 0 });
                    let aValues = easing.fast({from: 1, to: 0,steps: totalFrames, type: 'quad', method: 'inOut', round: 1 });

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: new V2(linePoints[linepointsIndices[f]]),
                            a: aValues[f]
                        };
                    }
                
                    return {
                        p0: new V2(gItem.points[0].point),
                        c: pointColor,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx})
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(colors.rgbToString({ value: itemData.c, isObject: true, opacity: itemData.frames[f].a }))//.dot(itemData.frames[f].p)
                                pp.lineV2(itemData.p0, itemData.frames[f].p)
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.mainBody = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    img: PP.createImage(RavenScene.models.main, { renderOnly: ['body'] })
                }))

                this.head = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.currentFrame = 0;
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == 100){
                                //this.currentFrame = 0;
                                this.normal.isVisible = false;
                                this.rotated.isVisible = true;
                                this.rotated2.isVisible = false;
                            }

                            if(this.currentFrame == 150){
                                //this.currentFrame = 0;
                                this.normal.isVisible = false;
                                this.rotated.isVisible = false;
                                this.rotated2.isVisible = true;
                            }

                            if(this.currentFrame == 240){
                                this.parent.parentScene.capturing.stop = true;
                                this.currentFrame = 0;
                                this.normal.isVisible = true;
                                this.rotated.isVisible = false;
                                this.rotated2.isVisible = false;
                            }
                        })


                        this.normal = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.img = PP.createImage(RavenScene.models.main, { renderOnly: ['head'] })

                                this.backParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bp_head').groups;
                
                                        this.frames = this.parent.parent.parent.createParticlesFrames({
                                            framesCount: 120, itemsCount: 1500, data, itemFrameslengthClamps: [30, 60], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                    }
                                }))

                                this.frontParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bf_head').groups
                                        this.frames = this.parent.parent.parent.createFrontalFrames({
                                            framesCount: 120, data, itemsCount: 250, itemFrameslengthClamps: [40, 50], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                        
                                    }
                                }))
                            }
                        }))

                        this.rotated2 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            isVisible: false,
                            init() {
                                let points = animationHelpers.extractPointData(RavenScene.models.main.main.layers.find(l => l.name =='head')).map(p => new V2(p.point));

                                let center = new V2(120, 85)//new V2((xClamps[1] + xClamps[0])/2, (yClamps[1] + yClamps[0])/2).toInt();
                                
                                let angle = -3
                                let rotated = points.map(p => p.substract(center).rotate(angle).add(center).toInt());

                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    let pp = new PP({ctx});
                                    pp.fillByCornerPoints(rotated)
                                })

                                this.backParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bp_head').groups;
                
                                        let dataRotated = data.map(g => ({
                                            strokeColor: g.strokeColor,
                                            points: g.points.map(p => ({
                                                point: new V2(p.point).substract(center).rotate(angle).add(center).toInt()
                                            }))
                                        }))


                                        this.frames = this.parent.parent.parent.createParticlesFrames({
                                            framesCount: 120, itemsCount: 1500, data: dataRotated, itemFrameslengthClamps: [30, 60], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                    }
                                }))

                                this.frontParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bf_head').groups

                                        let dataRotated = data.map(g => ({
                                            strokeColor: g.strokeColor,
                                            points: g.points.map(p => ({
                                                point: new V2(p.point).substract(center).rotate(angle).add(center).toInt()
                                            }))
                                        }))

                                        this.frames = this.parent.parent.parent.createFrontalFrames({
                                            framesCount: 120, data:dataRotated, itemsCount: 250, itemFrameslengthClamps: [40, 50], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                        
                                    }
                                }))
                            }
                        }))

                        this.rotated = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            isVisible: false,
                            init() {
                                let points = animationHelpers.extractPointData(RavenScene.models.main.main.layers.find(l => l.name =='head')).map(p => new V2(p.point));

                                let center = new V2(120, 85)//new V2((xClamps[1] + xClamps[0])/2, (yClamps[1] + yClamps[0])/2).toInt();
                                
                                let angle = 5
                                let rotated = points.map(p => p.substract(center).rotate(angle).add(center).toInt());

                                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                    let pp = new PP({ctx});
                                    pp.fillByCornerPoints(rotated)
                                })

                                this.backParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bp_head').groups;
                
                                        let dataRotated = data.map(g => ({
                                            strokeColor: g.strokeColor,
                                            points: g.points.map(p => ({
                                                point: new V2(p.point).substract(center).rotate(angle).add(center).toInt()
                                            }))
                                        }))


                                        this.frames = this.parent.parent.parent.createParticlesFrames({
                                            framesCount: 120, itemsCount: 1500, data: dataRotated, itemFrameslengthClamps: [30, 60], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                    }
                                }))

                                this.frontParticles = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size, 
                                    init() {
                                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bf_head').groups

                                        let dataRotated = data.map(g => ({
                                            strokeColor: g.strokeColor,
                                            points: g.points.map(p => ({
                                                point: new V2(p.point).substract(center).rotate(angle).add(center).toInt()
                                            }))
                                        }))

                                        this.frames = this.parent.parent.parent.createFrontalFrames({
                                            framesCount: 120, data:dataRotated, itemsCount: 250, itemFrameslengthClamps: [40, 50], size: this.size
                                        })
                
                                        this.registerFramesDefaultTimer({});
                                        
                                    }
                                }))
                            }
                        }))

                        
                    }
                    //img: PP.createImage(RavenScene.models.main, { renderOnly: ['head'] })
                }))

                this.backParticles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bp').groups;

                        this.frames = this.parent.createParticlesFrames({
                            framesCount: 120, itemsCount: 500, data, itemFrameslengthClamps: [30, 60], size: this.size
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                

                this.frontParticles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let data = RavenScene.models.main.main.layers.find(l => l.name == 'bf').groups
                        this.frames = this.parent.createFrontalFrames({
                            framesCount: 120, data, itemsCount: 200, itemFrameslengthClamps: [40, 50], size: this.size
                        })

                        this.registerFramesDefaultTimer({});
                        // this.img = this.parent.createSpline({ points: [

                        // ], numOfSegments: 20, size: this.size })
                    }
                }))
            }
        }), 10)
    }
}