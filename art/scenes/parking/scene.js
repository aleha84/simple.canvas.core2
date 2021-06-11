class ParkingScene extends Scene {
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
                size: new V2(1600, 1064),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'parking',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = ParkingScene.models.main;
        let layersData = {};
        let exclude = [
            
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

        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size, tailLengthClamps, opacity,
            xClamps, speedClamps,
            angleClamps, upperYClamps, lowerYClamps, _p1}) {
            let frames = [];
            
            let _color = [131,136,140];
            // if(_p1) {
            //     _color = [255,0,0];
            // }
            let bottomLine = createLine(new V2(-size.x, size.y), new V2(size.x*2, size.y));

            // createCanvas(new V2(1,1), (ctx, size, hlp) => {
            //     sharedPP = new PP({ctx});
            // })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                //let totalFrames = itemFrameslength;
            
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let p1 = new V2(getRandomInt(xClamps), getRandomInt(upperYClamps));
                if(_p1){
                    p1 = _p1;
                }
                let pRes = p1.clone();
                let targetY = getRandomInt(lowerYClamps);
                let frames = [];
                let speed = getRandom(speedClamps[0], speedClamps[1]);
                let tailLength = getRandomInt(tailLengthClamps);
                let f = 0;
                let opacityValues = [
                    ...easing.fast({from: 0, to: opacity, steps: tailLength, type: 'quad', method: 'out', round: 2})
                ]
                while(pRes.y < targetY) {
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    pRes = p1.add(direction.mul(speed*f));
                    frames[frameIndex] = {
                        p: pRes
                    };

                    f++;

                    if(f >= framesCount) {
                        throw 'Frames length exceeded'
                    }
                }
                
                if(_p1) {
                    let splashStartPoint = raySegmentIntersectionVector2(p1, direction, 
                        createLine(new V2(0, lowerYClamps[0]), new V2(size.x, lowerYClamps[0]))).toInt();
                        let splashLength = 30;
                    let wValues = easing.fast({from: 1, to: 6, steps: splashLength, type: 'quad', method: 'out', round: 0})
                    let aValues = easing.fast({from: 0.5, to: 0, steps: splashLength, type: 'quad', method: 'out', round: 1})
                    for(let i = 0; i < splashLength; i++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            splash: {
                                splashStartPoint,
                                w: wValues[i],
                                a: aValues[i]
                            }
                        };
                        
                        f++;
                    }
                }
                // for(let f = 0; f < totalFrames; f++){
                //     let frameIndex = f + startFrameIndex;
                //     if(frameIndex > (framesCount-1)){
                //         frameIndex-=framesCount;
                //     }
            
                //     frames[frameIndex] = {
            
                //     };
                // }
            
                return {
                    p1,
                    opacityValues,
                    direction,
                    tailLength,
                    targetY,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    //pp.setFillStyle(color);
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            

                            if(itemData.frames[f].splash) {
                                let s = itemData.frames[f].splash;

                                let c = `rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${s.a})`
                                let w = s.w;
                                hlp.setFillColor(c).rect(fast.r(s.splashStartPoint.x - w/2), s.splashStartPoint.y, w, 1)
                            }
                            else {
                                pp.positionModifier = (x,y) =>  { return y > itemData.targetY ?  undefined : {x,y} }
                                pp.fillStyleProvider = (x, y) => {
                                    let distance = fast.r(itemData.frames[f].p.distance(new V2(x,y)));
                                    let o = itemData.opacityValues[distance];
                                    if(o == undefined)
                                        o = 0;
                                    return `rgba(${_color[0]}, ${_color[1]}, ${_color[2]}, ${o})`
                                }
                                pp.lineV2(itemData.frames[f].p, itemData.frames[f].p.add(itemData.direction.mul(itemData.tailLength)))
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.rainFrontal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 5, size: this.size, 
                    tailLengthClamps: [20, 25], color: 'rgba(154,160,165, 0.5)', xClamps: [0, this.size.x*1.5], speedClamps: [12,14],
                    angleClamps: [12,16], upperYClamps: [-20, 0], lowerYClamps: [this.size.y-10, this.size.y+10],
                    opacity:  0.5,
                })

                this.registerFramesDefaultTimer({});
                //

                //#9CA3A8
            }
        }), layersData.car.renderIndex+1)

        this.rainFrontal2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 5, size: this.size, 
                    tailLengthClamps: [15, 18], color: 'rgba(154,160,165, 0.3)', xClamps: [0, this.size.x*1.5], speedClamps: [10,12],
                    angleClamps: [13,16], upperYClamps: [-20, 0], lowerYClamps: [this.size.y-30, this.size.y-10],
                    opacity: 0.4
                })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let a = true
                    }

                });
                //

                //#9CA3A8
            }
        }), layersData.car.renderIndex-1)

        this.rainOneDrop = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 1, size: this.size, 
                    tailLengthClamps: [15, 15], color: 'rgba(255,0,0, 0.3)', xClamps: [0, this.size.x*1.5], speedClamps: [11,11],
                    angleClamps: [15,15], upperYClamps: [-20, 0], lowerYClamps: [119,119],
                    opacity: 0.4, _p1: new V2(188, 0)  })

                this.registerFramesDefaultTimer({

                });
            }
        }), layersData.car.renderIndex+1)

        this.rainOneDrop = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 1, size: this.size, 
                    tailLengthClamps: [15, 15], color: 'rgba(255,0,0, 0.3)', xClamps: [0, this.size.x*1.5], speedClamps: [11,11],
                    angleClamps: [15,15], upperYClamps: [-20, 0], lowerYClamps: [118,118],
                    opacity: 0.4, _p1: new V2(200, 0)  })

                this.registerFramesDefaultTimer({

                });
            }
        }), layersData.car.renderIndex+1)

        this.rainMid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 5, size: this.size, 
                    tailLengthClamps: [13, 18], xClamps: [0, this.size.x*1.5], speedClamps: [10,12],
                    angleClamps: [12,14], upperYClamps: [-20, 0], lowerYClamps: [100, 115],
                    opacity: 0.3
                })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let a = true
                    }

                });
                //

                //#9CA3A8
            }
        }), layersData.lep.renderIndex+1)


        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWiresFrames({framesCount, dotsData,xClamps, yClamps, size, invert = false, c1, c2}) {
                let frames = [];
                let xClamp = [0, 174] //35
                let _sharedPP;

                let halfFramesCount = fast.r(framesCount/2);
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                })

                dotsData.forEach(dotData => {
                    if(dotData.dots.length == 1){
                        dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
                    }
                    else {
                        let distance = dotData.dots[0].distance(dotData.dots[1]);
                        let direction = dotData.dots[0].direction(dotData.dots[1]);
                        let dValues = [
                            ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                            ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                        ]

                        dotData.dots = new Array(framesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));
                    }
                });

                let framesData = [];
                 for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => {
                        if(invert) {
                            return {x: dd.dots[f].y, y: dd.dots[f].x}
                        }

                        return dd.dots[f]
                    });


                    let formula = mathUtils.getCubicSplineFormula(dots);
                    
                    if(invert) {
                        for(let _y = yClamps[0]; _y < yClamps[1]; _y++){
                            let _x=  fast.r(formula(_y));
                            framesData[f].dots.push({x:_x,y:_y});
                        }
                    }
                    else {
                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            framesData[f].dots.push({x,y});
                        }
                    }
                    
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let prev = undefined;
                        for(let i = 0; i < framesData[f].dots.length; i++){
                            hlp.setFillColor(c1).dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                            if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                                hlp.setFillColor(c2)
                                    .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                    //.dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
                                    .dot(prev.x+1, prev.y)
                            }

                            prev = framesData[f].dots[i];
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.wire1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [0, 160] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 31), new V2(0, 31.25)] }, 
                                { dots: [new V2(80, 38), new V2(80, 38.25)] }, 
                                { dots: [new V2(157, 38)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: '#a3aab0', c2: '#a9b1b7' })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [0, 173] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 55), new V2(0, 55.25)] }, 
                                { dots: [new V2(85, 57), new V2(85, 57.25)] }, 
                                { dots: [new V2(152, 53)] },
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: '#a3aab0', c2: '#a9b1b7' })

                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))

                

                
            }
        }), layersData.lep.renderIndex+1 )

        this.wiresBehindLep = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWiresFrames({framesCount, dotsData,xClamps, yClamps, size, invert = false, c1, c2, noSecondary = false}) {
                let frames = [];
                let xClamp = [0, 174] //35
                let _sharedPP;

                let halfFramesCount = fast.r(framesCount/2);
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                })

                dotsData.forEach(dotData => {
                    if(dotData.dots.length == 1){
                        dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
                    }
                    else {
                        let distance = dotData.dots[0].distance(dotData.dots[1]);
                        let direction = dotData.dots[0].direction(dotData.dots[1]);
                        let dValues = [
                            ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                            ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                        ]

                        dotData.dots = new Array(framesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));
                    }
                });

                let framesData = [];
                 for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => {
                        if(invert) {
                            return {x: dd.dots[f].y, y: dd.dots[f].x}
                        }

                        return dd.dots[f]
                    });


                    let formula = mathUtils.getCubicSplineFormula(dots);
                    
                    if(invert) {
                        for(let _y = yClamps[0]; _y < yClamps[1]; _y++){
                            let _x=  fast.r(formula(_y));
                            framesData[f].dots.push({x:_x,y:_y});
                        }
                    }
                    else {
                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            framesData[f].dots.push({x,y});
                        }
                    }
                    
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let prev = undefined;
                        for(let i = 0; i < framesData[f].dots.length; i++){
                            hlp.setFillColor(c1).dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                            if(!noSecondary) {
                                if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                                    hlp.setFillColor(c2)
                                        .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                        //.dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
                                        .dot(prev.x+1, prev.y)
                                }
                            }
                            

                            prev = framesData[f].dots[i];
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.wire1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [158, 200] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(158, 38)] }, 
                                { dots: [new V2(180,45), new V2(180, 45.25)] }, 
                                { dots: [new V2(199,50), new V2(199, 50.25)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: '#a3aab0', c2: '#a9b1b7', noSecondary: true })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [152, 200] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(152, 53)] }, 
                                { dots: [new V2(178,60), new V2(178, 60.25)] }, 
                                { dots: [new V2(199,63), new V2(199, 63.25)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: '#a3aab0', c2: '#a9b1b7', noSecondary: true })

                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))

            }
        }), layersData.lep.renderIndex-1 )

        this.ground_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#8c7a6c', '#7e6d61', '#6f6056', '#61534b', '#5c6554', '#525b4a']
                let t = PP.createImage(model, { renderOnly: ['g_l3'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 10) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.clone(), color } 
                        }
                    }
                    
                });

                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, pointsData: pData, itemFrameslength: 100, size: this.size })

                let repeat = 2;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                        // repeat--;
                        // if(repeat == 0)
                        //     this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.g_l3.renderIndex+1)


        this.rainDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let createDropsFrames = function({framesCount, itemFrameslength1, itemFrameslength2, size, opacity, points}) {
                    let frames = [];
                    
        
                    let itemsData = points.map((pData, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        
                        //let p = points[getRandomInt(0, points.length-1)].point;
                        let part1Length = itemFrameslength1//fast.r(itemFrameslength/2);
                        let part2Length = pData.itemFrameslength2 ||  itemFrameslength2//itemFrameslength - part1Length;
                        
                        let totalFrames = part1Length + part2Length//itemFrameslength;
                        let part1Alpha = easing.fast({from: 0, to: opacity, steps: part1Length, type: 'linear', round: 3})
                        let part2YChange = easing.fast({from: pData.start.y, to: pData.target.y, steps: part2Length, type: 'expo', method: 'in', round: 0})
        
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
        
                            let y = pData.start.y;
                            let alpha = 0;
                            if(f < part1Length) {
                                alpha = part1Alpha[f];
                            }
                            else {
                                y = part2YChange[f-part1Length];
                                alpha = opacity
                            }
                    
                            frames[frameIndex] = {
                                y,
                                alpha
                            };
                        }
                    
                        return {
                            p: pData.start,
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    hlp.setFillColor(`rgba(154,160,165, ${itemData.frames[f].alpha})`).dot(itemData.p.x, itemData.frames[f].y)
                                }   
                            }
                        });
                    }
                    
                    return frames;
                }

                this.frames = createDropsFrames({ framesCount: 300, itemFrameslength1: 20, itemFrameslength2: 30, size: this.size, opacity: 0.15, points: [
                    { start: new V2(25,121), target: new V2(25,124) },
                    { start: new V2(24,119), target: new V2(24,123) },
                    { start: new V2(43,123), target: new V2(43,127) },
                    { start: new V2(49,124), target: new V2(49,126) },
                    { start: new V2(58,118), target: new V2(58,125), itemFrameslength2: 40 },
                    { start: new V2(60,123), target: new V2(58,124), itemFrameslength2: 10, },
                    { start: new V2(69,122), target: new V2(69,123), itemFrameslength2: 10 },
                    { start: new V2(34,121), target: new V2(34,125) },
                    { start: new V2(77,121), target: new V2(77,122), itemFrameslength2: 10 },
                    { start: new V2(84,119), target: new V2(84,121), itemFrameslength2: 30 },
                    { start: new V2(86,117), target: new V2(86,121), itemFrameslength2: 30 },
                    { start: new V2(83,110), target: new V2(86,122), itemFrameslength2: 50 },
                    { start: new V2(94,117), target: new V2(94,120), itemFrameslength2: 30 },
                    { start: new V2(95,114), target: new V2(95,120), itemFrameslength2: 40 },
                ]  })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.car.renderIndex+1)
    }
}