class Portal4Scene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(2000,1330),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'portal4'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Portal4Scene.models.main;
        let layersData = {};
        let exclude = [
            'lightning_zine_right', 'lightning_zine_left'
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

        this.cloudsBg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let circleImages = {};
                let cColors = ['#307785', '#C0CAD3', '#dfe4e8', '#FDFDFD']
                
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

                this.upperColor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#E6F2EA').rect(0, 0, size.x, 20)
                    })
                }))

                this.lowerColor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#2C5058').rect(0, 80, size.x, 20)
                    })
                }))

                let createCloudsFrames = function({framesCount, itemsCount, radiusClamps, color, startY, yShiftClamps, itemFrameslength, size, yChangeMax, fall}) {
                    let frames = [];
                    
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let x = getRandomInt(-20, size.x+20);
                        let y = startY + getRandomInt(yShiftClamps);
                        let r = getRandomInt(radiusClamps);

                        //let yChangeMax = fast.r(getRandomInt(yShiftClamps)/3);
                        let yChangeValues = [
                            ...easing.fast({from: 0, to: yChangeMax, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: yChangeMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        let rChangeValues = undefined;
                        if(fall){
                            yChangeValues = easing.fast({from: 0, to: yChangeMax*6, steps: totalFrames, type: 'linear', method: 'base', round: 0});
                            rChangeValues = easing.fast({from: r, to: 1, steps: totalFrames, type: 'linear', method: 'base', round: 0});
                        }

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                r: rChangeValues ? rChangeValues[f]: r,
                                y: yChangeValues[f]
                            };
                        }
                    
                        return {
                            x, y, 
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(circleImages[color][itemData.frames[f].r], itemData.x - itemData.frames[f].r, itemData.y + itemData.frames[f].y - itemData.frames[f].r)    
                                }
                            }
                        });
                    }
                    
                    return frames;
                }

                let framesCount = 300;

                let framesData = [
                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [8,10], color: cColors[0], startY: 70, 
                    yShiftClamps: [3,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 1 }),
                        alpha: 1
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [6,10], color: cColors[1], startY: 65, 
                    yShiftClamps: [3,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 0.5        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [6,10], color: cColors[1], startY: 55, 
                    yShiftClamps: [4,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 1 }),
                        alpha: 1        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 150, radiusClamps: [10,14], color: cColors[2], startY: 35, 
                    yShiftClamps: [5,8], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 1        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [8,12], color: cColors[3], startY: 5, 
                    yShiftClamps: [5,10], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 0.5        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 70, radiusClamps: [14,18], color: cColors[3], startY: 20, 
                    yShiftClamps: [5,8], itemFrameslength: framesCount, size: this.size, yChangeMax: 3 }),
                        alpha: 1        
                    },

                ]

                let frames = [];
                for(let f = 0; f < framesCount; f++) {
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let fd = 0; fd < framesData.length; fd++) {
                            ctx.globalAlpha = framesData[fd].alpha;
                            ctx.drawImage(framesData[fd].frames[f], 0,0)
                            ctx.globalAlpha = 1;
                        }
                    })
                    
                }

                this.clouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.bg.renderIndex+1)

        this.rTeeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 100;
                let totalAnimationFrames = 90;
                let oneFrame = 50;

                let aniParams = [
                    { layerName: 'l0', animationStartFrame: 0},
                    { layerName: 'l1', animationStartFrame: 10},
                    { layerName: 'l2', animationStartFrame: 0},
                    { layerName: 'l3', animationStartFrame: 30},
                    { layerName: 'l4', animationStartFrame: 40},
                    { layerName: 'l5', animationStartFrame: 50},
                    { layerName: 'l6', animationStartFrame: 40},
                    { layerName: 'l7', animationStartFrame: 70},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Portal4Scene.models.rTreeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)

                        let animationStartFrame = p.animationStartFrame;


                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetColors = ['#815c27', '#5b451d', '#41311c', '#34271b', '#261c1a', '#918c8b']
                        let t = PP.createImage(model, { renderOnly: ['right_tree'] });
                        let pixelsData = getPixels(t, this.size);

                        let pData = [];
                        pixelsData.forEach(pd => {
                            if(getRandomInt(0, 5) == 0) {
                                let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                                if(targetColors.indexOf(color) != -1){
                                    pData[pData.length] = { point: pd.position.clone(), color } 
                                }
                            }
                        });

                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 100, pointsData: pData, itemFrameslength: 50, size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.right_tree.renderIndex+1)

        this.lTeeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 100;
                let totalAnimationFrames = 90;
                let oneFrame = 50;

                let aniParams = [
                    { layerName: 'l0', animationStartFrame: 0},
                    { layerName: 'l1', animationStartFrame: 20},
                    { layerName: 'l2', animationStartFrame: 40},
                    { layerName: 'l4', animationStartFrame: 60},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Portal4Scene.models.lTreeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)

                        let animationStartFrame = p.animationStartFrame;


                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetColors = ['#5b451d', '#483e27', '#34271b', '#343631', '#2d2926', '#261c1a']
                        let t = PP.createImage(model, { renderOnly: ['left_tree'] });
                        let pixelsData = getPixels(t, this.size);

                        let pData = [];
                        pixelsData.forEach(pd => {
                            if(getRandomInt(0, 5) == 0) {
                                let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                                if(targetColors.indexOf(color) != -1){
                                    pData[pData.length] = { point: pd.position.clone(), color } 
                                }
                            }
                        });

                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 100, pointsData: pData, itemFrameslength: 50, size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.left_tree.renderIndex+1)

        this.portalMovement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#563a24', '#433024', '#39261e']
                let t = PP.createImage(model, { renderOnly: ['portal'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 7) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.clone(), color } 
                        }
                    }
                });

                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, pointsData: pData, itemFrameslength: 100, size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.portal.renderIndex+1)

        this.groundMovement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#895808', '#a0660c', '#ad7224', '#b97e3b']
                let t = PP.createImage(model, { renderOnly: ['ground'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 6) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.clone(), color } 
                        }
                    }
                });

                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 150, pointsData: pData, itemFrameslength: 70, size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.ground.renderIndex+1)

        this.backTreeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#815c27', '#69522e', '#504835', '#3b3228', '#312721', '#261c1a']
                let t = PP.createImage(model, { renderOnly: ['back_tree_c', 'back_tree_l', 'back_tree_r'] });
                let pixelsData = getPixels(t, this.size);
                let pData = [];
                let pDataRot = [];

                pixelsData.forEach(pd => {
                    if(pd.position.y == 98)
                        return;

                    if(getRandomInt(0, 10) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pDataRot[pData.length] = { point: pd.position.clone(), color } 
                        }
                    }

                    if(getRandomInt(0, 5) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.add(new V2(0, -1)), color } 
                        }
                    }
                });
                
                this.pRot = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 100, pointsData: pDataRot, itemFrameslength: 80, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, pointsData: pData, itemFrameslength: 80, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.back_tree_r.renderIndex+1)


        let animationColors = {
            main: '#8BE4EC',
            darker: '#6dafbf',
            brighter: '#F0FAFC'
        }

        // let animationColors = {
        //     main: '#7FEAFE',
        //     darker: 'rgba(127,234,254,0.6)',
        //     brighter: '#FBFFFF'
        // }
        //

        this.lightnings = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let leftPoints = [];
                let rightPoints = [];

                createCanvas(V2.one, (ctx, size, hlp) => {
                    let pp = new PP({ctx});

                    leftPoints = pp.fillByCornerPoints(animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lightning_zine_left')).map(p => new V2(p.point)));
                    rightPoints = pp.fillByCornerPoints(animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lightning_zine_right')).map(p => new V2(p.point)))
                })

                let pairs = {};

                  
                this.frames = animationHelpers.createLightningFrames({ 
                    framesCount: 300, itemsCount: 10, 
                    size: this.size,
                    colors: animationColors,
                    highlightParams: {
                        showTarget: true,
                        showStart: true,
                        color:  colors.rgbToString({ value: colors.colorTypeConverter({ value: animationColors.main, toType: 'rgb' }), isObject: true, opacity: 0.25 }),
                        startPointsProvider: (start) => {
                            let pair = pairs[`${start.x}_${start.y}`];
                            let startHolder = pair.isLeft ? leftPoints : rightPoints;
                            
                            return startHolder.filter(p => Math.abs(pair.start.y - p.y) < 6 && Math.abs(pair.start.x - p.x) < 1 );

                        },
                        targetPointsProvider: (target) => {
                            let points = [];
                            Object.values(pairs).forEach(p => {
                                if(p.target.x == target.x && p.target.y == target.y) {
                                    let targetHolder = p.isLeft ? rightPoints : leftPoints;

                                    points = targetHolder.filter(p => Math.abs(target.y - p.y) < 6 && Math.abs(target.x - p.x) < 1 );
                                }
                            })

                            return points;
                        }
                    },
                    pathParams: {
                        mainMidPointShiftClamps: [3,6],
                        resultMidPointXShiftClamps: [-3,3],
                        resultMidPointYShiftClamps: [-3, 3],
                        innerDotsCountClamp: [3,5],
                        startProvider: () => { 
                            
                            let isLeft = getRandomBool();
                            let holder = isLeft ? leftPoints : rightPoints;

                            let start = holder[getRandomInt(0, holder.length-1)];
                            
                            pairs[`${start.x}_${start.y}`] = {
                                start, 
                                isLeft
                            };

                            return new V2(start);
                            //return new V2(80,65) 
                        },
                        targetProvider: (start) => { 
                              let pair = pairs[`${start.x}_${start.y}`];
                              let targetHolder = pair.isLeft ? rightPoints : leftPoints;
                            
                              let awailablePoints = targetHolder.filter(p => Math.abs(pair.start.y - p.y) < 3 );
                              let target = awailablePoints[getRandomInt(0, awailablePoints.length-1)];

                              pair.target = target;

                              return new V2(target);
                            // return new V2(109,71) 
                        }
                    }
                });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.portal.renderIndex+2)

        this.portalEntrance = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticelsFrames({framesCount, itemsCount, itemFrameslength, size, xClamp, startYClamps}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(xClamp);
                    let y = getRandomInt(startYClamps);

                    let targetY = y - getRandomInt(10, 20);
                    let yValuesChanges = easing.fast({from: y, to: targetY, steps: totalFrames, type: 'quad', method: 'in', round: 0});

                    let color = animationColors.main;
                    switch(getRandomInt(0,2)) {
                        case 1: 
                            color = animationColors.darker;
                            break;
                        case 2: 
                            color = animationColors.darker;
                            break;
                        default:
                            break;
                    }


                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yValuesChanges[f]
                        };
                    }
                
                    return {
                        x,
                        color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.color).dot(itemData.x, itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {

                this.bg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createBgFrames({framesCount, size}) {
                        let frames = [];
                        let hClamps = [5, 10]
                        let rgb = colors.colorTypeConverter({ value: animationColors.main, toType: 'rgb' });

                        let heightValues = [
                            ...easing.fast({ from: hClamps[0], to: hClamps[1], steps: framesCount/2, type: 'quad', method: 'in', round: 0 }),
                            ...easing.fast({ from: hClamps[1], to: hClamps[0], steps: framesCount/2, type: 'quad', method: 'out', round: 0 }),
                        ]
                        
                        for(let f = 0; f < framesCount; f++){
                            let height = heightValues[f];

                            let aValues = easing.fast({from: 0.5, to: 0, steps: height, type: 'quad', method: 'out', round: 2 });

                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let h = 0; h < height; h++){
                                    hlp.setFillColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b},` + aValues[h] + ')').rect(78, 102 -h, 36, 1)
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createBgFrames({ framesCount: 100, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.particles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createParticelsFrames({ framesCount: 100, itemsCount: 50, itemFrameslength: 70, size: this.size, xClamp: [79,111], startYClamps: [101,102] }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.portal.renderIndex+3)


        let createLeafsFrames = function({framesCount, itemsCount, itemFrameslength, colors, startX, yClamps, size}) {
            let frames = [];
            let _colors = ['#261c1a', '#815c27', '#34271b', '#2d2926', '#343631']
            let sharedPP = undefined;
            createCanvas(V2.one, (ctx, size, hlp) => {
                sharedPP = new PP({ctx})
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let p1 = new V2(startX, getRandomInt(yClamps));
                let p2 = new V2(getRandomInt(85,105), getRandomInt(85,95))

                let points = sharedPP.lineV2(p1, p2);
                let indexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'cubic', method: 'out', round: 0});

                let a = getRandom(0.05, 0.2);
                let b = getRandom(2,3);
                let fx = (x) => Math.sin(x*a)*b

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        len: f > totalFrames/4 ? 1 : 2,
                        index: indexValues[f]
                    };
                }
            
                return {
                    fx,
                    color: _colors[getRandomInt(0, _colors.length-1)],
                    points,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let p = new V2(itemData.points[itemData.frames[f].index]);

                            let yDelta = itemData.fx(p.x);
                            hlp.setFillColor(itemData.color).dot(p.add(new V2(0, yDelta)).toInt())
                            if(itemData.frames[f].len == 2){
                                hlp.dot(p.add(new V2(1, yDelta)).toInt())
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.leafs_left = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createLeafsFrames({ framesCount: 300, itemsCount: 25, itemFrameslength: 150, colors: '#483e27', startX: 0, yClamps: [-20, 100], size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }

                });
            }
        }), layersData.left_tree.renderIndex);

        this.leafs_right = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createLeafsFrames({ framesCount: 300, itemsCount: 25, itemFrameslength: 150, colors: '#483e27', startX: this.size.x, yClamps: [-100, 100], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.right_tree.renderIndex);
    }
}