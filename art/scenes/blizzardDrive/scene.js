class BlizzardDriveScene extends Scene {
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
                size: new V2(150,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'blizzardDrive',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
            scrollOptions: {
                enabled: true,
                zoomEnabled: true,
                restrictBySpace: false,
            }
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
            img: createCanvas(V2.one, (ctx, size, hlp) => { hlp.setFillColor('black').dot(0,0); })
        }), 1)

        let mainRoadImg = PP.createImage(BlizzardDriveScene.models.main, { renderOnly: ['road'] });
        let mainRoadPixels = getPixelsAsMatrix(mainRoadImg, this.viewport);

        let getPixel = (p) => {
            if(!mainRoadPixels[p.y])
                return undefined;

            return mainRoadPixels[p.y][p.x]
        }

        let createMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size}) {
            let frames = [];
            let images = [];

            let itemsCount = animationsModel.main[0].layers.length;

            let framesIndiciesChange = [
                ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 }),
                ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 })
            ]

            for(let i = 0; i < itemsCount; i++) {
                images[i] = PP.createImage(animationsModel, { renderOnly: [animationsModel.main[0].layers[i].name || animationsModel.main[0].layers[i].id] }) //'l' + (i+1)
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

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRoadFrames({framesCount, size}) {
                let frames = [];
                let sharedpp = PP.createNonDrawingInstance();
                

                let itemsCount = 10;
                let itemFrameslength = 50;

                let leftLinePoints = BlizzardDriveScene.models.main.main.layers.find(l => l.name == 'road_left_border').groups[0].points.map(p => new V2(p.point));
                let rightLinePoints = BlizzardDriveScene.models.main.main.layers.find(l => l.name == 'road_right_border').groups[0].points.map(p => new V2(p.point));
                let leftWidthValues = easing.fast({from: 1, to: 3, steps: leftLinePoints.length,  type: 'linear', round: 0})
                let leftLinePointsIndices = easing.fast({ from: 0, to: leftLinePoints.length-1, steps: itemFrameslength, type: 'linear', method: 'base', round: 0 })
                let rightLinePointsIndices = easing.fast({ from: 0, to: rightLinePoints.length-1, steps: itemFrameslength, type: 'linear', method: 'base', round: 0 })
                let rightWidthValues = easing.fast({from: 1, to: 3, steps: rightLinePoints.length,  type: 'linear', round: 0})

                let itemsData = [
                    ...new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = i*framesCount/itemsCount //getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let isErase = getRandomBool();

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            let pIndex = leftLinePointsIndices[f];

                            frames[frameIndex] = {
                                w: leftWidthValues[pIndex],
                                p: leftLinePoints[pIndex]
                            };
                        }
                    
                        return {
                            isLeft: true,
                            isErase,
                            frames
                        }
                    }),
                    ...new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = i*framesCount/itemsCount //getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let isErase = getRandomBool();

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            let pIndex = rightLinePointsIndices[f];

                            frames[frameIndex] = {
                                w: rightWidthValues[pIndex],
                                p: rightLinePoints[pIndex]
                            };
                        }
                    
                        return {
                            isLeft: false,
                            isErase,
                            frames
                        }
                    })
                ]

                // let shadowsImg = createCanvas(size, (ctx, size, hlp) => {
                //     hlp.setFillColor('rgba(255,0,0,0.75)').rect(0,0,size.x,size.y);
                //     ctx.globalCompositeOperation = 'destination-in';
                //     ctx.drawImage(mainRoadImg, 0, 0)
                // })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        //ctx.drawImage(shadowsImg, -20, 0);
                        ctx.drawImage(mainRoadImg, 0, 0)

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let {p, w} = itemData.frames[f]
                                if(itemData.isErase) {
                                    if(itemData.isLeft)
                                        hlp.clear(p.x, p.y, w, 1)
                                    else 
                                        hlp.clear(p.x-w + 1, p.y, w, 1)
                                }
                                else {
                                    hlp.setFillColor(colors.rgbToString({value: getPixel(p), isObject: false, opacity: 1}));
                                    //hlp.setFillColor('red')
                                    if(itemData.isLeft)
                                        hlp.rect(p.x - w, p.y, w, 1)
                                    else {
                                        hlp.rect(p.x+1, p.y, w, 1)
                                    }
                                }
                            }
                            
                        }
                    });
                }
                return frames;
            },
            init() {
                this.frames = this.createRoadFrames({ framesCount: 150, size: this.size})
                this.registerFramesDefaultTimer({});
                
                this.road_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(BlizzardDriveScene.models.main.main.layers.find(l => l.name == 'road_p')) })
        
                            this.registerFramesDefaultTimer({});
                    }
                }))

                this.roadItems = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createRoadItemsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        
                        let center = new V2(74,70);

                        let availableColors = ['#d1d4cf', '#edefeb']
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let angle = fast.r(getRandom(-60, 60),2);
                            let direction = V2.down.rotate(angle);
                            let distanceValues = easing.fast({from: 0, to: 100, steps: itemFrameslength, type: 'quad', method: 'in', round: 3});
                            let centerXDelta = 0//getRandomInt(-1,1)
                            let maxA = getRandom(0.01, 0.3);
                            let aValues = easing.fast({from: 0, to: maxA, steps: itemFrameslength, type: 'linear', round: 2})
                            let maxWidth = getRandomInt(1,6);
                            let widthValues = easing.fast({from: 1, to: maxWidth, steps: itemFrameslength, type: 'quad', method: 'in', round: 0});
                            let c = availableColors[getRandomInt(0, availableColors.length-1)];

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    a: aValues[f],
                                    p: center.add(new V2(centerXDelta, 0)).add(direction.mul(distanceValues[f])).toInt(),
                                    w: widthValues[f],
                                };
                            }
                        
                            return {
                                c,
                                direction,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx})
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){

                                        let pxl = getPixel(itemData.frames[f].p);
                                        if(pxl) {
                                            if(pxl[0] == 226 && pxl[1] == 229 && pxl[2] == 224) {
                                                // hlp.setFillColor(itemData.c).rect(
                                                //     fast.r(itemData.frames[f].p.x - itemData.frames[f].w/2), itemData.frames[f].p.y,
                                                //     itemData.frames[f].w, 1
                                                // )

                                                hlp.setFillColor(itemData.c);
                                                pp.lineV2(itemData.frames[f].p, itemData.frames[f].p.add(itemData.direction.mul(itemData.frames[f].w)).toInt()  )
                                            } 
                                           
                                        }

                                        // hlp.setFillColor('rgba(0,0,0,' + itemData.frames[f].a + ')').rect(
                                        //     fast.r(itemData.frames[f].p.x - itemData.frames[f].w/2), itemData.frames[f].p.y,
                                        //     itemData.frames[f].w, 1
                                        // )
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createRoadItemsFrames({framesCount: 150, itemsCount: 150, itemFrameslength: 40, size: this.size});
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.roadLightAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createMovementFrames({ framesCount: 150, startFramesClamps: [10, 120], itemFrameslength: 150, 
                            // additional: {
                            //     framesShift: 30,
                            //     frameslength: 30,
                            //     framesIndiciesChange: [
                            //         ...easing.fast({from: 0, to: 2, steps: 15, type: 'quad', method: 'inOut', round: 0 }),
                            //         ...easing.fast({from: 2, to: 0, steps: 15, type: 'quad', method: 'inOut', round: 0 })
                            //     ]
                            // },
                            animationsModel: BlizzardDriveScene.models.roadAnimations,
                            size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))


            }
        }), 10)

        this.snow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSnowFrames({framesCount, itemsCount, itemFrameslength, lengthClamps, color, maxA, size, eType = 'quad', eMethod = 'in', spread = 60}) {
                let frames = [];
                
                let center = new V2(74,62);
                let spreadRadius = spread;
                let aValues = easing.fast({from: 0, to: maxA, steps: itemFrameslength, type: 'linear', method: 'base', round: 2})

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let angle = fast.r(getRandom(0, 360),2);
                    let direction = V2.up.rotate(angle);
                    let maxLength = getRandomInt(lengthClamps);
                    let startD = getRandom(0, spreadRadius);
                    let distanceValues = easing.fast({from: startD, to: 100 + startD, steps: itemFrameslength, type: eType, method: eMethod, round: 3});
                    let lengthValues = easing.fast({from: 0, to: maxLength, steps: itemFrameslength, type: eType, method: eMethod, round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f],
                            p: center.add(direction.mul(distanceValues[f])),
                            l: lengthValues[f]
                        };
                    }
                
                    return {
                        direction,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('rgba(255,255,255,' + itemData.frames[f].a + ')')

                                pp.lineV2(itemData.frames[f].p, itemData.frames[f].p.add(itemData.direction.mul(itemData.frames[f].l)))
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFrames({ framesCount: 150, itemsCount: 2000, itemFrameslength: 60, lengthClamps: [10,20], maxA: 0.1, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFrames({ framesCount: 150, itemsCount: 2000, itemFrameslength: 40, lengthClamps: [15,30], maxA: 0.25, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFrames({ framesCount: 150, itemsCount: 600, itemFrameslength: 30, lengthClamps: [10,30], maxA: 0.4, 
                            eType: 'expo', eMethod: 'in', size: this.size, spread: 30, })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 17)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(BlizzardDriveScene.models.main, { renderOnly: ['cabin', 'panel'] })

                this.panelAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createMovementFrames({ framesCount: 100, startFramesSequence: [0, 50], itemFrameslength: 100, 
        
                            animationsModel: BlizzardDriveScene.models.panelAnimations,
                            size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.panel_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength:40, size: this.size, 
                            pointsData: animationHelpers.extractPointData(BlizzardDriveScene.models.main.main.layers.find(l => l.name == 'panel_p')) })
        
                            this.registerFramesDefaultTimer({});
                    }
                }))

                this.check_lamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(BlizzardDriveScene.models.main, { renderOnly: ['gas_lamp'] })

                        this.currentFrame = 0;
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == 60){
                                this.currentFrame = 0;
                                this.isVisible = !this.isVisible;
                            }
                        })
                    }
                }))

                let positionOriginal = this.position.clone();
                let shakeCurrentFrame = 0;
                let totalFrames = getRandomInt(5,10);
                
                this.timerShake = this.regTimerDefault(10, () => {
            
                    shakeCurrentFrame++;
                    if(shakeCurrentFrame == totalFrames){
                        //SCG.viewport.camera.updatePosition(new V2(fast.r(getRandom(-0.5,0.5),1), fast.r(getRandom(-0.5,0.5),1)))
                        this.position.y = positionOriginal.y + fast.r(getRandom(-0.5,0.5),1);
                        //this.position.x = positionOriginal.x + fast.r(getRandom(-0.5,0.5),1);
                        this.needRecalcRenderProperties = true;
                        shakeCurrentFrame = 0;
                        totalFrames = getRandomInt(5,10);
                    }
                })
            }
        }), 20)

        

        let colorsCache = []

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createTreesFrames({framesCount, itemsCount, itemFrameslength, size, p1, p2, angleClamps, heightFromTo, maxWidthClamps, color, isRight}) {
                let frames = [];

                let sharedpp = PP.createNonDrawingInstance();

                // let p1 = new V2(70,72);
                // let p2 = new V2(-10,87);

                let linePoints = sharedpp.lineV2(p1, p2).map(p => new V2(p));
                let linePointsIndices = easing.fast({ from: 0, to: linePoints.length-1, steps: itemFrameslength, type: 'quad', method: 'in', round: 0 })


                // let angleClamps = [-10,10];
                // let heightFromTo = [20,90];

                let heightValues = easing.fast({ from: heightFromTo[0], to: heightFromTo[1], steps: linePoints.length, type: 'linear', round: 0 });
                //let maxWidthClamps = [3,5];
                let widthValues = [];
                for(let i = maxWidthClamps[0]; i <= maxWidthClamps[1]; i++) {
                    widthValues[i] = easing.fast({ from: 0, to: i, steps: linePoints.length, type: 'linear', round: 0 });
                }

                let hsv = colors.colorTypeConverter({value: color, fromType: 'hex', toType: 'hsv'});
                let color_h_keyPart = hsv.h*1000000;
                let color_s_keyPart = hsv.s*1000;
                let vValues = easing.fast({from: 0, to: hsv.v, steps: linePoints.length, type: 'linear', round: 0 })

                
                vValues.forEach(v => {
                    let key = color_h_keyPart + color_s_keyPart + v;
                    if(!colorsCache[key])
                        colorsCache[key] = colors.colorTypeConverter({ value: [hsv.h, hsv.s, v], fromType: 'hsv', toType: 'hex' })
                })
                

                //color: 393738
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = i*framesCount/itemsCount //getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let direction = V2.up.rotate(getRandomInt(angleClamps));
                    let maxWidth = getRandomInt(maxWidthClamps);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let pIndex = linePointsIndices[f];
                        let p = linePoints[pIndex];
                        let height = heightValues[pIndex];
                        let width = widthValues[maxWidth][pIndex];
                        let v = vValues[pIndex];
                
                        frames[frameIndex] = {
                            lowerRight: p,
                            height, width,
                            v
                        };
                    }
                
                    return {
                        direction,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        //pp.setFillStyle('#393738')

                        let layers = [];

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){

                                let {lowerRight, height, width, v} = itemData.frames[f];
                                let topRight = lowerRight.add(itemData.direction.mul(height));

                                //let c = colorsCache[color_h_keyPart + color_s_keyPart + v];

                                layers[layers.length] = {
                                    v,
                                    lowerRight,
                                    height,
                                    width,
                                    corners: [
                                        lowerRight,
                                        lowerRight.add(new V2(-width, 0)),
                                        topRight.add(new V2(-width, 0)),
                                        topRight
                                    ]
                                }

                            }
                            
                        }

                        //от дальнего к ближнему
                        layers.sort((a,b) => b.lowerRight.x - a.lowerRight.x).forEach(l => {

                            let _vValues = easing.fast({from: l.v, to: 0, steps: l.height, type: 'linear', round: 0});

                            let c = colorsCache[color_h_keyPart + color_s_keyPart + l.v];
                            pp.setFillStyle(c);
                            pp.fillStyleProvider = (x,y) => {
                                let distance = fast.r(l.lowerRight.distance(new V2(x, y)));
                                let v = 0;
                                if(distance < l.height) {
                                    v = _vValues[distance];
                                }

                                if(v == undefined) 
                                    debugger;

                                return colorsCache[color_h_keyPart + color_s_keyPart + v];
                            }
                            pp.fillByCornerPoints(l.corners);

                            if(l.width >= 3) {
                                pp.fillStyleProvider = undefined;
                                pp.setFillStyle('rgba(0,0,0, 0.25)');
                                if(!isRight)
                                    pp.lineV2(l.corners[1], l.corners[2])
                                else 
                                    pp.lineV2(l.corners[0], l.corners[3])

                                pp.setFillStyle('rgba(0,0,0, 0.1)');
                                if(!isRight)
                                    pp.lineV2(l.corners[1].add(new V2(1,0)), l.corners[2].add(new V2(1,0)))
                                else 
                                    pp.lineV2(l.corners[0].add(new V2(-1,0)), l.corners[3].add(new V2(-1,0)))
                            }
                        })

                    });
                }
                
                return frames;
            },
            init() {
                let framesCount = 100;

                this.left_b = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createTreesFrames({ framesCount, itemsCount: 10, itemFrameslength: framesCount, size: this.size,
                            p1: new V2(70,72), p2: new V2(-10,87), angleClamps: [-6,6], heightFromTo: [20,90], maxWidthClamps: [3,4], color: '#262525'
                         })
                        this.registerFramesDefaultTimer({
                            startFrameIndex: 10
                        });
                    }
                }))

                this.left_f = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createTreesFrames({ framesCount, itemsCount: 10, itemFrameslength: framesCount, size: this.size,
                            p1: new V2(70,72), p2: new V2(-10,87), angleClamps: [-10,10], heightFromTo: [20,90], maxWidthClamps: [3,5], color: '#393738'
                         })
                         let counter = 3;
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let f = true;
                            },
                            framesEndCallback: () => {
                                counter--;
                                if(counter == 0)
                                    this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.right_b = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createTreesFrames({ framesCount, itemsCount: 10, itemFrameslength: framesCount, size: this.size,
                            p1: new V2(80,72), p2: new V2(160,87), angleClamps: [-6,6], heightFromTo: [20,90], maxWidthClamps: [3,4], color: '#262525', isRight: true,
                         })
                        this.registerFramesDefaultTimer({
                            startFrameIndex: 22
                        });
                    }
                }))

                this.right_f = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createTreesFrames({ framesCount, itemsCount: 10, itemFrameslength: framesCount, size: this.size,
                            p1: new V2(80,72), p2: new V2(160,87), angleClamps: [-10,10], heightFromTo: [20,90], maxWidthClamps: [3,5], color: '#393738', isRight: true,
                         })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                
            }
        }), 5)
    }
}