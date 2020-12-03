class Demo10FaceScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7.5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'face'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10FaceScene.models.main)
            }
        }), 1)

        this.p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                    pointsData: animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'p1')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.lake = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.vawes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createWavesFrames({framesCount, itemFrameslengthClamp, size}) {
                        let frames = [];
                        
                        let wavesPoints = animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'waves'));

                        let itemsData = wavesPoints.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                        
                            let p = el.point;
                            let color = el.color;
                            let width = getRandomInt(3,6);
                            let widthValues = [
                                ...easing.fast({from: 0, to: width, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v)),
                                ...easing.fast({from: width, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v))
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    width: widthValues[f],
                                };
                            }
                        
                            return {
                                p,
                                color,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let width = itemData.frames[f].width;
                                        if(width > 0){
                                            let xShift = fast.r(width/2);
                                            hlp.setFillColor(itemData.color).rect(itemData.p.x-xShift, itemData.p.y, width, 1)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createWavesFrames({ framesCount: 200, itemFrameslengthClamp: [70, 100], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createShineFrames({framesCount, itemFrameslengthClamp, size}) {
                        let frames = [];
                        let cornerPoints = animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'lake_borders'));
                        let innerDots = [];
                        createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            innerDots = pp.fillByCornerPoints(cornerPoints.map(p => new V2(p.point)));
                        })

                        let itemsData = new Array(innerDots.length).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                        
                            let aMax = fast.r(getRandom(0.25,0.75),2)
                            let aValues = [
                                ...easing.fast({ from: 0, to: aMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({ from: aMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]

                            let p = innerDots[getRandomInt(0, innerDots.length-1)];

                            let frames = [];
                            if(getRandomInt(0,3) == 3){
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        a: aValues[f] == undefined ? 0 : aValues[f]
                                    };
                                }
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
                                        hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.p)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createShineFrames({ framesCount: 200, itemFrameslengthClamp: [50, 70], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.flow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFlowFrames({framesCount, flowData, size}) {
                let frames = [];
                let itemsData = [];

                flowData.forEach(fd => {
                    for(let i = 0; i < fd.itemsCount; i++){
                        let startPointIndex = getRandomInt(0, fd.points.length-1 - fd.deltaClamp[1]);
                        let indexDelta = getRandomInt(fd.deltaClamp[0], fd.deltaClamp[1]);
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = getRandomInt(fd.itemFrameslengthClamp[0], fd.itemFrameslengthClamp[1]);

                        let indexValues = easing.fast({ from: startPointIndex, to: startPointIndex + indexDelta, steps: totalFrames, type: 'linear', round: 0 });
                        let aMax = fast.r(getRandom(0.2, 0.5),2);
                        if(getRandomInt(0,5) == 0)
                            aMax = fast.r(getRandom(0.5, 0.7),2);

                        let aValues = [
                            ...easing.fast({ from: 0, to: aMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({ from: aMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                        ]

                        let xShift = getRandomInt(-1,1);
                        let yShift = getRandomInt(-1,1);
                        if(fd.noShift){
                            xShift = 0
                            yShift = 0
                        }
                        let xShiftValues = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear' })
                        let yShiftValues = easing.fast({ from: 0, to: yShift, steps: totalFrames, type: 'linear' })

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                a: aValues[f] != undefined ? aValues[f] : 0,
                                p: fd.points[indexValues[f]].add(new V2(xShiftValues[f], yShiftValues[f])).toInt()
                            };
                        }

                        itemsData.push({
                            //a:,
                            // xShift,
                            // yShift,
                            frames
                        })
                    }
                });
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.frames[f].p.x, itemData.frames[f].p.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                
                let sharedPP = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                let flowData = [{
                    itemsCount: 50,
                    deltaClamp: [6,10],
                    itemFrameslengthClamp: [100,120],
                    layerName: 'flow_data1'
                },
                {
                    itemsCount: 20,
                    deltaClamp: [5,8],
                    itemFrameslengthClamp: [60,80],
                    layerName: 'flow_data2'
                },
                {
                    itemsCount: 20,
                    deltaClamp: [6,10],
                    itemFrameslengthClamp: [70,90],
                    layerName: 'flow_data3',
                    noShift: true,
                },
                {
                    itemsCount: 40,
                    deltaClamp: [4,7],
                    itemFrameslengthClamp: [85,110],
                    layerName: 'flow_data4'
                },
                {
                    itemsCount: 50,
                    deltaClamp: [5,8],
                    itemFrameslengthClamp: [80,100],
                    layerName: 'flow_data5'
                }]
                
                flowData.forEach(fd => {
                    let pointsCorners = animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == fd.layerName))
                                        .map(pd => new V2(pd.point));
                    let points = [];
                    for(let i = 0; i < pointsCorners.length-1; i++){
                        points.push(...sharedPP.lineV2(pointsCorners[i], pointsCorners[i+1]).map(p => new V2(p)))
                    }

                    points = distinct(points, p => p.x + '_' + p.y);

                    fd.points = points;
                });
        
                

                this.frames = this.createFlowFrames({ framesCount: 200, flowData, size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), 15)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.snow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    createSnowCloudsFrames({framesCount, itemsCount, itemFrameslengthClamp, size}) {
                        let frames = [];
                        let yAddValues = easing.fast({from: 6, to: 0, steps: 60, type: 'linear', round: 0});
//E5D5C6
                        let whiteCircleSizes = [
                            PP.createImage(PP.circles.filled[3],{ colorsSubstitutions: { "#FF0000": { color: '#E5D5C6', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[4],{ colorsSubstitutions: { "#FF0000": { color: '#E5D5C6', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[5],{ colorsSubstitutions: { "#FF0000": { color: '#E5D5C6', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[6],{ colorsSubstitutions: { "#FF0000": { color: '#E5D5C6', changeFillColor: true } } })
                        ];

                        let brightCircleSizes = [
                            PP.createImage(PP.circles.filled[1],{ colorsSubstitutions: { "#FF0000": { color: '#AA9992', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[2],{ colorsSubstitutions: { "#FF0000": { color: '#AA9992', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[3],{ colorsSubstitutions: { "#FF0000": { color: '#AA9992', changeFillColor: true } } })
                        ];

                        let circleSizes = [
                            PP.createImage(PP.circles.filled[1],{ colorsSubstitutions: { "#FF0000": { color: '#7B737E', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[2],{ colorsSubstitutions: { "#FF0000": { color: '#7B737E', changeFillColor: true } } }),
                            PP.createImage(PP.circles.filled[3],{ colorsSubstitutions: { "#FF0000": { color: '#7B737E', changeFillColor: true } } })
                        ];

                        let whiteItemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = framesCount//getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                        
                            let x = getRandomInt(-7, 65);
                            let y = getRandomInt(-6,-3);

                            if(x < 60){
                                y += yAddValues[x];
                            }

                            let cImg = whiteCircleSizes[getRandomInt(0, whiteCircleSizes.length-1)];
                            let yShiftMax = getRandomInt(1,3);
                            let yShiftValues = [
                                ...easing.fast({ from: 0, to: yShiftMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                                ...easing.fast({ from: yShiftMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    yShift: yShiftValues[f] != undefined ? yShiftValues[f] : 0,
                                };
                            }
                        
                            return {
                                x, y,
                                cImg,
                                frames
                            }
                        })

                        let brightItemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                        
                            let x = getRandomInt(-5, 60);
                            let y = 3;

                            if(x < 60){
                                y += yAddValues[x];
                            }

                            let cImg = brightCircleSizes[getRandomInt(0, brightCircleSizes.length-1)];
                            let yShiftMax = getRandomInt(1,2);
                            let yShiftValues = [
                                ...easing.fast({ from: 0, to: yShiftMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                                ...easing.fast({ from: yShiftMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    yShift: yShiftValues[f] != undefined ? yShiftValues[f] : 0,
                                };
                            }
                        
                            return {
                                x, y,
                                cImg,
                                frames
                            }
                        })

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                        
                            let x = getRandomInt(-2, 60);
                            let y = 6;

                            if(x < 60){
                                y += yAddValues[x];
                            }

                            let cImg = circleSizes[getRandomInt(0, circleSizes.length-1)];
                            let yShiftMax = getRandomInt(1,2);
                            let yShiftValues = [
                                ...easing.fast({ from: 0, to: yShiftMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                                ...easing.fast({ from: yShiftMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    yShift: yShiftValues[f] != undefined ? yShiftValues[f] : 0,
                                };
                            }
                        
                            return {
                                x, y,
                                cImg,
                                frames
                            }
                        })

                        
                        let snowItemsData = new Array(200).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(90, 150);
                        
                            let x = getRandomInt(0, 50);
                            let y = getRandomInt(0, 15);

                            if(x < 60){
                                y += yAddValues[x]*2;
                            }

                            let initP = new V2(x, y);

                            let direction = V2.down.rotate(getRandomInt(30, 50));
                            let speed = getRandom(0.025, 0.075);

                            let aMax = fast.r(getRandom(0.4, 0.6),2);

                            let aValues = [
                                ...easing.fast({ from: 0, to: aMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({ from: aMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    a: aValues[f] != undefined ? aValues[f] : 0,
                                    p: initP.add(direction.mul(f*speed)).toInt()
                                };
                            }
                        
                            return {
                                frames
                            }
                        })
                        
                        let gXShift = -10;
                        let gYShift = -5;

                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {


                                

                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.cImg, itemData.x+gXShift, itemData.y+itemData.frames[f].yShift+gYShift)
                                    }
                                    
                                }

                                for(let p = 0; p < snowItemsData.length; p++){
                                    let itemData = snowItemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.frames[f].p)
                                    }
                                    
                                }

                                for(let p = 0; p < brightItemsData.length; p++){
                                    let itemData = brightItemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.cImg, itemData.x+gXShift, itemData.y+itemData.frames[f].yShift+gYShift)
                                    }
                                    
                                }

                                for(let p = 0; p < whiteItemsData.length; p++){
                                    let itemData = whiteItemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.cImg, itemData.x+gXShift, itemData.y+itemData.frames[f].yShift+gYShift)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSnowCloudsFrames({ framesCount: 200, itemsCount: 100, itemFrameslengthClamp: [150,200], size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 16)

        this.gems = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createGemsFrames({framesCount, itemsCount, itemFrameslengthClamp, size}) {
                let frames = [];
                
                let innerDots = [];
                let _colors = [
                    colors.colorTypeConverter({ value: '#D53E3E', toType: 'rgb', fromType: 'hex'}), 
                    colors.colorTypeConverter({ value: '#3773C5', toType: 'rgb', fromType: 'hex'}), 
                    colors.colorTypeConverter({ value: '#3DCD6E', toType: 'rgb', fromType: 'hex'}), 
                    colors.colorTypeConverter({ value: '#FFE170', toType: 'rgb', fromType: 'hex'}), 
                    colors.colorTypeConverter({ value: '#C569C5', toType: 'rgb', fromType: 'hex'})
                ];

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    innerDots = [
                        ...pp.fillByCornerPoints(animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'gems_borders1')).map(p => new V2(p.point))),
                        ...pp.fillByCornerPoints(animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'gems_borders2')).map(p => new V2(p.point))),
                        ...pp.fillByCornerPoints(animationHelpers.extractPointData(Demo10FaceScene.models.main.main.layers.find(l => l.name == 'gems_borders3')).map(p => new V2(p.point)))
                    ];
                })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                
                    let p = innerDots[getRandomInt(0, innerDots.length-1)]
                    let color = _colors[getRandomInt(0, _colors.length-1)];

                    let aMax = fast.r(getRandom(0.1, 0.2),2);
                    let aValues = [
                        ...easing.fast({ from: 0, to: aMax, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({ from: aMax, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
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
                        color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(${itemData.color.r}, ${itemData.color.g}, ${itemData.color.b}, ${itemData.frames[f].a})`).dot(itemData.p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createGemsFrames({ framesCount: 200, itemsCount: 50, itemFrameslengthClamp: [30,60], size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), 17)

        this.birds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBirdsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let y = 16;
                let x = 70;

                let xValues1 = easing.fast({from: x, to: size.x, steps: itemFrameslength, type: 'linear', round: 0});
                let yValues1 = easing.fast({from: y, to: y+20, steps: itemFrameslength, type: 'quad', method: 'out', round: 0});

                let itemFrameslength2 = fast.r(itemFrameslength*2/4);
                let xValues2 = easing.fast({from: size.x, to: 136, steps: itemFrameslength2, type: 'linear', round: 0});
                let yValues2 = easing.fast({from: 45, to: 37, steps: itemFrameslength2, type: 'quad', method: 'in', round: 0});

                let itemsData = new Array(2).fill().map((el, i) => {
                    
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    if(i == 1) {
                        totalFrames = itemFrameslength2;
                    }
                
                    let frames = [];

                    let yShiftFun = (x) => Math.sin(x/5);

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let yShift =  fast.r(yShiftFun(f));
                        let x = 0;
                        let y = 0;

                        if(i == 0) {
                            x = xValues1[f]
                            y = yValues1[f]
                        }

                        if(i == 1) {
                            x = xValues2[f]
                            y = yValues2[f]
                        }

                        if(yShift < 0)
                            yShift = 0;

                        frames[frameIndex] = {
                            x,
                            y,
                            yShift
                        };
                    }
                
                    return {
                        y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('rgba(0,0,0,0.1)').dot(itemData.frames[f].x, itemData.frames[f].y)
                                hlp.setFillColor('rgba(0,0,0,0.1)').rect(itemData.frames[f].x-1, itemData.frames[f].y, 2, 1)
                                hlp.setFillColor('rgba(0,0,0,0.1)').dot(itemData.frames[f].x, itemData.frames[f].yShift + itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createBirdsFrames({ framesCount: 400, itemFrameslength: 300, size: this.size })
                let repeat = 3;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });
            }
        }), 19)

        this.ship = this.addGo(new GO({
            position: new V2(68,135.5),
            size: new V2(16,15),
            init() {
                this.frames = PP.createImage(Demo10FaceScene.models.ship);
                let totalFrames = 200;
                let framesIndexValues = easing.fast({ from: 0, to: this.frames.length-1, steps: totalFrames, type: 'sin', method:'inOut', round: 0});
                this.frames = new Array(totalFrames).fill().map((el,i) => this.frames[framesIndexValues[i]])

                this.registerFramesDefaultTimer({});
            }
        }), 20)

        this.windmill = this.addGo(new GO({
            position: new V2(146,130),
            size: new V2(10,10),
            init() {
                //this.img = PP.createImage(Demo10FaceScene.models.windmill);
                this.frames = PP.createImage(Demo10FaceScene.models.windmill);
                let totalFrames = 50;
                let framesIndexValues = easing.fast({ from: 0, to: this.frames.length, steps: totalFrames, type: 'linear'}).map(v => fast.f(v, 0));
                framesIndexValues[framesIndexValues.length-1] = this.frames.length-1
                this.frames = new Array(totalFrames).fill().map((el,i) => this.frames[framesIndexValues[i]])

                this.registerFramesDefaultTimer({});
            }
        }), 21)

        this.fog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFogFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let foglayer = Demo10FaceScene.models.main.main.layers.find(l => l.name == 'fog_borders');
                foglayer.visible = true;
                let mask = PP.createImage(Demo10FaceScene.models.main, { renderOnly: ['fog_borders'] });
                let overlay = createCanvas(size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(165,165,165, 0.3)').rect(0,0,size.x, size.y);
                })

                let brightCircleSizes = [
                    PP.createImage(PP.circles.filled[1]),
                    PP.createImage(PP.circles.filled[2]),
                    PP.createImage(PP.circles.filled[3]),
                    PP.createImage(PP.circles.filled[4]),
                    PP.createImage(PP.circles.filled[5])
                ];

                let sizeValues = easing.fast({from: brightCircleSizes.length-1, to: 0, steps: itemFrameslength, type: 'linear', round: 0});

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let y = getRandomInt(115, 122);
                    let x = getRandomInt(136,175);
                    if(getRandomBool()) {
                        y= getRandomInt(110, 115);
                        x = getRandomInt(170,190);
                    }

                    let xShiftValues = easing.fast({from: 0, to: -getRandomInt(5, 10), steps: itemFrameslength, type: 'linear', round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            size: sizeValues[f],
                            xShift: xShiftValues[f]
                        };
                    }
                
                    return {
                        y,x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {

                        ctx.drawImage(mask, 0,0);
                        ctx.globalCompositeOperation = 'source-in';

                        let _midImg = createCanvas(size, (ctx, _size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(brightCircleSizes[itemData.frames[f].size], itemData.frames[f].xShift + itemData.x, itemData.y)
                                }
                                
                            }
                        })

                        ctx.drawImage(_midImg,0,0);
                        ctx.globalCompositeOperation = 'source-in';
                        ctx.drawImage(overlay,0,0);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFogFrames({framesCount:200, itemsCount: 100, itemFrameslength: 200, size: this.size})
                this.registerFramesDefaultTimer({});
            }
        }), 22)
    }
}