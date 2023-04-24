class ShelterScene extends Scene {
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
                fileNamePrefix: 'shelter',
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
        let model = ShelterScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'puddles_mask', 'road_p', 'far_p', 'close_p'
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

        let createRainFrames = function({framesCount, itemsCount, itemFrameslengthClamps, tailLengthClamps, xClamps, yClamps, lowerYClamps, aClamps, size}) {
            let frames = [];
            let colorRgb = colors.colorTypeConverter({value: '#b1b5be', toType: 'rgb', fromType: 'hex'})//#b1b5be
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames =  getRandomInt(itemFrameslengthClamps) //itemFrameslength;
            
                let x = getRandomInt(xClamps);
                let y = getRandomInt(yClamps);
                let lowerY = getRandomInt(lowerYClamps);
                let maxA = fast.r(getRandom(aClamps[0], aClamps[1]),2);
                let tailLength = getRandomInt(tailLengthClamps)

                let yValues = easing.fast({from: y, to: lowerY, steps: totalFrames, type: 'linear', round: 0})
                let aValues = easing.fast({from: 0, to: maxA, steps: tailLength, type: 'quad', method: 'out', round: 2})

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        y: yValues[f]
                    };
                }
            
                return {
                    x, maxA,
                    tailLength,
                    aValues,
                    lowerY,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let {x, aValues, maxA, tailLength, lowerY} = itemData;

                            let lastI = 0;
                            for(let i = 0; i < tailLength; i++) {
                                lastI = i;
                                if(itemData.frames[f].y+lastI > lowerY)
                                    break;

                                hlp.setFillColor(`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${aValues[i]}` ).dot(x, itemData.frames[f].y+lastI)
                            }

                            if(itemData.frames[f].y+lastI <= lowerY)
                                hlp.setFillColor(`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${maxA/2}` ).dot(x, itemData.frames[f].y+(lastI+1))
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.rainFrontal1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let data = [
                    {
                        framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [17,22], tailLengthClamps: [15,20], xClamps: [0, 199], yClamps: [-40,-20], 
                        lowerYClamps: [170, 177], aClamps: [0.15, 0.25], size: this.size
                    },
                ]

                data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let a = true
                            }
                        });        
                    }
                })))
            }
        }), layersData.stolb1.renderIndex+1)

        this.rainFrontal2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let data = [
                    {
                        framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [15,20], tailLengthClamps: [18,25], xClamps: [0, 200], yClamps: [-40,-20], 
                        lowerYClamps: [179, 200], aClamps: [0.2, 0.3], size: this.size
                    },
                    {
                        framesCount: 300, itemsCount: 30, itemFrameslengthClamps: [10,15], tailLengthClamps: [25,35], xClamps: [0, 200], yClamps: [-40,-20], 
                        lowerYClamps: [200, 210], aClamps: [0.4, 0.5], size: this.size
                    }
                ]

                data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});        
                    }
                })))
            }
        }), layersData.stolb2.renderIndex+5)

        this.rainMid1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let data = [
                    {
                        framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [20,25], tailLengthClamps: [12,17], xClamps: [27, 105], yClamps: [-40,-20], 
                        lowerYClamps: [160, 165], aClamps: [0.1, 0.2].map(v => v*1.5), size: this.size
                    },
                ]

                data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let a = true
                            }
                        });        
                    }
                })))
            }
        }), layersData.tram.renderIndex+1)

        this.rainMid2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let data = [
                    {
                        framesCount: 300, itemsCount: 400, itemFrameslengthClamps: [25,30], tailLengthClamps: [10,15], xClamps: [40, 175], yClamps: [-40,-20], 
                        lowerYClamps: [158, 160], aClamps: [0.075, 0.1].map(v => v*1.5), size: this.size
                    },
                    {
                        framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [20,25], tailLengthClamps: [12,17], xClamps: [109, 200], yClamps: [-40,-20], 
                        lowerYClamps: [160, 165], aClamps: [0.1, 0.2].map(v => v*1.5), size: this.size
                    },
                ]

                data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let a = true
                            }
                        });        
                    }
                })))
            }
        }), layersData.tram.renderIndex-1)

        this.rainFar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let data = [
                    {
                        framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [40,60], tailLengthClamps: [5,10], xClamps: [63, 137], yClamps: [-40,-20], 
                        lowerYClamps: [156, 157], aClamps: [0.025, 0.075].map(v => v*2), size: this.size
                    },
                ]

                data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let a = true
                            }
                        });        
                    }
                })))
            }
        }), layersData.mid_houses.renderIndex-1)

        this.road_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [10,20], size: this.size, 
                    pointsData: animationHelpers.extractPointData(ShelterScene.models.main.main.layers.find(l => l.name == 'road_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.road.renderIndex+1)

        this.close_houses_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [20,30], size: this.size, 
                    pointsData: animationHelpers.extractPointData(ShelterScene.models.main.main.layers.find(l => l.name == 'close_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.close_houses.renderIndex+1)

        this.far_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,40], size: this.size, 
                    pointsData: animationHelpers.extractPointData(ShelterScene.models.main.main.layers.find(l => l.name == 'far_p'))
                 });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.far_houses.renderIndex+1)

        this.tram_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [20,30], size: this.size, 
                    pointsData: animationHelpers.extractPointData(ShelterScene.models.main.main.layers.find(l => l.name == 'tram_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.tram.renderIndex+1)

        this.road_splashes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.s1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createS1Frames({framesCount, itemsCount, itemFrameslengthClamps, aClamps, size}) {
                        let frames = [];
                        let puddles_mask = PP.createImage(model, { renderOnly: ['puddles_mask'], forceVisivility: { puddles_mask: { visible: true } } })
                        
                        let yClamps = [170,199];
                        let widthToHeightValues = easing.fast({from: 2, to: 4, steps: yClamps[1] - yClamps[0], type: 'linear', round: 0})

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let x = getRandomInt(0,199);
                            let y = getRandomInt(yClamps);
                            let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)

                            let width = widthToHeightValues[y - yClamps[0]];
                            let widthValues = easing.fast({from: 1, to: width, steps: totalFrames, type: 'quad', method: 'out', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    width: widthValues[f]
                                };
                            }
                        
                            return {
                                x,y,a,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){

                                        let x = fast.r(itemData.x - itemData.frames[f].width/2);
                                        let width = itemData.frames[f].width;
        
                                        hlp.setFillColor('rgba(255,255,255,' + itemData.a + ')').rect(x, itemData.y, width, 1)
                                    }
                                    
                                }

                                ctx.globalCompositeOperation = 'destination-in'
                                ctx.drawImage(puddles_mask, 0, 0)
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createS1Frames({ framesCount: 300, itemsCount: 2000, itemFrameslengthClamps: [15,20], aClamps: [0.05, 0.15], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.s2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createS1Frames({framesCount, itemsCount, itemFrameslengthClamps, aClamps, size}) {
                        let frames = [];
                        let puddles_mask = PP.createImage(model, { renderOnly: ['puddles_mask'], forceVisivility: { puddles_mask: { visible: true } }  })
                        
                        let yClamps = [160,199];
                        let aToHeightValues = easing.fast({from: aClamps[0], to: aClamps[1], steps: yClamps[1] - yClamps[0], type: 'linear', round: 2})

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let x = getRandomInt(0,199);
                            let y = getRandomInt(yClamps);
                            let a = aToHeightValues[y - yClamps[0]];

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    visible: true
                                };
                            }
                        
                            return {
                                x,y,a,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor('rgba(255,255,255,' + itemData.a + ')').dot(itemData.x, itemData.y)
                                    }
                                    
                                }

                                ctx.globalCompositeOperation = 'destination-out'
                                ctx.drawImage(puddles_mask, 0, 0)
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createS1Frames({ framesCount: 300, itemsCount: 2000, itemFrameslengthClamps: [5,10], aClamps: [0.1, 0.3], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.road.renderIndex+2)

        let createDropsFrames = function({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions,
            type, method}) {
                let frames = [];
                
                // let lCenter = lightParams.center //new V2(66,21);
                // let radius = lightParams.radius //40;
                // let opacityDistanceValues = easing.fast({from: lightParams.from, to: lightParams.to, steps: radius, type: 'linear', round: 2 });

                //let startPositions = 

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                //let totalFrames = itemFrameslength;

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

                            //let a = lightParams.to;
                            let p = new V2(itemData.x, itemData.frames[f].y);
                            //let distance = fast.r(lCenter.distance(p));
                            // if(distance < radius) {
                            //     a = opacityDistanceValues[distance];
                            // }

                            //ctx.globalAlpha = a*itemData.frames[f].alpha;

                            hlp.setFillColor('rgba(255,255,255,' + itemData.frames[f].alpha + ')').dot(p);

                            if(itemData.frames[f].tail > 0) {
                                for(let i = 0; i < itemData.frames[f].tail; i++) {
                                    hlp.dot(p.add(new V2(0, i+1)));
                                }
                            }

                            //ctx.globalAlpha = 1;
                            //hlp.setFillColor(`rgba(154,160,165, ${itemData.frames[f].alpha})`).dot(itemData.p.x, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.close_building_drops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createDropsFrames({
                            itemsCount: 200, framesCount: 300, itemFrameslength1Clamps: [15,30], itemFrameslength2Clamps: [30, 50],size: this.size,
                            opacityClamps: [0.1, 0.2], type: 'quad', method: 'in',
                            startPositions: [
                                { type: 'points', points: PP.createNonDrawingInstance().lineV2(new V2(0, 90), new V2(199, 91)), height: 70, tail: 2 }
                            ]
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.upperDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(5,10);
                        
                            let a = fast.r(getRandom(0.1, 0.2),2);
                            let x = getRandomInt(0,199)
                            let y = getRandomInt(41,46)

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    visible: true
                                };
                            }
                        
                            return {
                                x,y,a,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor('rgba(255,255,255,' + itemData.a + ')').dot(itemData.x, itemData.y);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createDropsFrames({ framesCount: 100, itemsCount: 200, itemFrameslength: 10, size: this.size })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.close_houses.renderIndex+1)

        this.tram_sign = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let ousImg = PP.createImage(ShelterScene.models.outOfService);
                let ousSize = new V2(54,3)
                this.frames = [];
                let ousCropSize = new V2(13,3);

                let xShift = easing.fast({from: 0, to: ousSize.x, steps: 300, type: 'linear', round: 0})

                for(let f = 0; f < 300; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#0c0502').rect(116,137, 13, 3);
    
                        ctx.drawImage(createCanvas(ousCropSize, (ctx, size, hlp) => {
                            ctx.drawImage(ousImg, -xShift[f], 0)
                            ctx.drawImage(ousImg, ousSize.x-xShift[f], 0)
                        }), 116,137)
                    })
                }

                this.registerFramesDefaultTimer({});

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('#0c0502').rect(116,137, 13, 3);

                //     ctx.drawImage(ousImg, 116,137)
                // })

                
            }
        }), layersData.tram.renderIndex+1)
    }
}