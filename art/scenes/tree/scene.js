class TreeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: false,
                additional: ['WIP - work in progress'],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(2000,1130),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'tree'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){

        let renderClouds = true;

        let cloudsOverlay = createCanvas(this.viewport, (ctx, size, hlp) => {
            let aDarkChange = easing.fast({from: 0.2, to: 0, steps: size.x/2, type: 'linear', round: 2})
            let aBrightChange = easing.fast({from: 0, to: 0.5, steps: size.x/2, type: 'linear', round: 2})

            for(let x = 0; x < size.x; x++){
                if(x < size.x/2){
                    hlp.setFillColor(`rgba(0,0,0,${aDarkChange[x]})`).rect(x, 0, 1, size.y)
                }
                else {
                    hlp.setFillColor(`rgba(255,255,255,${aBrightChange[x-size.x/2]})`).rect(x, 0, 1, size.y)
                }
            }
        })

        let model = TreeScene.models.main;
        let layersData = {};
        let exclude = [
            'tree_p','lake_borders', "clouds_ref_p", 'g_p', 'fore_1', 'grass', 'fore_p', 'bg_p'
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
                    if(layerName == "fore_1") {
                        let totalFrames = 600;
                        this.currentFrame = 0;
                        let xChange = easing.fast({from: this.size.x, to: -2*this.size.x, steps: totalFrames, type: 'linear', round: 0});
                        let xOrigial = this.position.x;
                        
                        this.position.x = xOrigial + xChange[this.currentFrame]

                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }

                            this.position.x = xOrigial + xChange[this.currentFrame];
                            this.needRecalcRenderProperties = true;
                        })
                    }

                    // if(layerName == "fore") {
                    //     let totalFrames = 600;
                    //     this.currentFrame = 0;
                    //     let xChange = easing.fast({from: this.size.x, to: -2*this.size.x, steps: totalFrames, type: 'linear', round: 0});
                    //     let xOrigial = this.position.x;

                    //     this.position.x = xOrigial + xChange[this.currentFrame]

                    //     let delay = 199;
                    //     this.timer = this.regTimerDefault(10, () => {
                    //         if(delay > 0) {
                    //             delay--;
                    //             return;
                    //         }

                    //         this.currentFrame++;
                    //         if(this.currentFrame == totalFrames){
                    //             this.currentFrame = 0;
                    //         }

                    //         this.position.x = xOrigial + xChange[this.currentFrame];
                    //         this.needRecalcRenderProperties = true;
                    //     })
                    // }
                    
                }
            }), renderIndex)

            console.log(`${layerName} - ${renderIndex}`)
        }

        let circleImages = {};
        let cColors = ['#FF0000', '#64A4C6', '#DEF0FF']
        
            for(let c = 0; c < cColors.length; c++){
                circleImages[cColors[c]] = []
                for(let s = 3; s < 15; s++){
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                }
            }
        
        
        let createCloudsFrames = function({framesCount, itemsCount, itemFrameslength, color, sec, size,
            directionAngleClamps, distanceClamps, sizeClamps, initialProps, yShiftClamps, invertMovement = false
        }) {
            let frames = [];
            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx})
            })

            let initialDots = [];
            if(initialProps.line) {
                initialDots = sharedPP.lineV2(initialProps.p1, initialProps.p2).map(p => new V2(p))
            }
            else {
                throw 'Unknown initial props type';
            }

            let halfFrames = fast.r(framesCount/2)

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let s = getRandomInt(sizeClamps[0], sizeClamps[1]);
                let dist = getRandomInt(distanceClamps[0], distanceClamps[1]);
                let dir = V2.up.rotate(getRandomInt(directionAngleClamps[0], directionAngleClamps[1]));
                let p1 = initialDots[getRandomInt(0, initialDots.length-1)];
                let p2 = p1.add(dir.mul(dist));
                let points = !invertMovement 
                    ? sharedPP.lineV2(p1, p2).map(p => new V2(p))
                    : sharedPP.lineV2(p2, p1).map(p => new V2(p));
                
                let pointsIndexChange = [
                    ...easing.fast({from: 0, to: points.length-1, steps: halfFrames, type: 'linear', round: 0}),
                    ...easing.fast({from: points.length-1, to: 0, steps: halfFrames, type: 'linear', round: 0})
                ];
                let yShift = getRandomInt(yShiftClamps[0], yShiftClamps[1]);
                let yShiftValues = [
                    ...easing.fast({from: 0, to: yShift, steps: fast.r(halfFrames/2), type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: yShift, to: 0, steps: fast.r(halfFrames/2), type: 'quad', method: 'in', round: 0})
                ]

                yShiftValues = [...yShiftValues, ...yShiftValues.map(x => -x)];

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        y: yShiftValues[f],
                        p: points[pointsIndexChange[f]]
                    };
                }
            
                return {
                    s,
                    sec: sec? {s: s-getRandomInt(sec.sDecrClamps[0],sec.sDecrClamps[1]), yShift: getRandomInt(sec.yShiftClamps), xShift: getRandomInt(sec.xShiftClamps)} : undefined,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let secData = [];
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let _p = itemData.frames[f].p;
                            let yShift = itemData.frames[f].y;
                            ctx.drawImage(circleImages[color][itemData.s], _p.x, _p.y + yShift)

                            if(itemData.sec) {
                                secData[secData.length] = {
                                    s: itemData.sec.s,
                                    x: _p.x + itemData.sec.xShift,
                                    y: _p.y + yShift + itemData.sec.yShift
                                }
                                //ctx.drawImage(circleImages[secColor][itemData.sec.s], _p.x, _p.y + yShift + itemData.sec.yShift)
                            }
                        }
                        
                    }

                    for(let i = 0; i < secData.length; i++){
                        ctx.drawImage(circleImages[sec.color][secData[i].s],secData[i].x, secData[i].y)
                    }
                });
            }
            
            return frames;
        }

        this.cloudsBack = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(!renderClouds)
                    return;

                let tf = 600

                let params = [
                    {
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(172,76), p2: new V2(135,59)
                            }, yShiftClamps: [-3,-5], sec: {color: '#64A4C6', sDecrClamps: [0,2], yShiftClamps: [-1,5], xShiftClamps: [-2,0]}
                    },
                    {
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(172,76), p2: new V2(135,59+3)
                            }, yShiftClamps: [-3,-5]
                    },

                    {
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(147,69+3), p2: new V2(129,63+3)
                            }, yShiftClamps: [-2,-3]
                    },
                    {
                        framesCount: tf, itemsCount: 50, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(150,70+6), p2: new V2(127,63+6)
                            }, yShiftClamps: [-2,-3]
                    },

                    {
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-90, -70], distanceClamps: [15,25], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(130,62), p2: new V2(92, 57)
                            }, yShiftClamps: [-5,-8]
                    },
                    
                    {
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-80, -90], distanceClamps: [15,20], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(139,76), p2: new V2(109,73)
                            }, yShiftClamps: [-2,-3]
                    },

                    {
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,30], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(126,74), p2: new V2(75,56)
                            }, yShiftClamps: [-3,-5]
                    },
                    {
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,30], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(126,74+4), p2: new V2(67,49)
                            }, yShiftClamps: [-3,-5]
                    },

                    {
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(62,44), p2: new V2(0,12)
                            }, yShiftClamps: [-4,-6], sec: {color: '#64A4C6', sDecrClamps: [0,2], yShiftClamps: [-1,5], xShiftClamps: [-2,0]}
                    },
                    {
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(62,44+3), p2: new V2(0,12)
                            }, yShiftClamps: [-3,-5]
                    },
                ]

                let itemsFrames = params.map(p => createCloudsFrames(p))

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.drawImage(itemsFrames[i][f],0,0);
                        }

                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(cloudsOverlay,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});

                // this.addChild(new GO({
                //             position: new V2(),
                //             size: this.size,
                //             img: cloudsOverlay,
                //         }))

                // params.map(p => {
                //     this.addChild(new GO({
                //         position: new V2(),
                //         size: this.size,
                //         frames: createCloudsFrames(
                //             p
                //         ),
                //         init() {
                //             this.registerFramesDefaultTimer({});
                //         }
                //     }))
                // })

                // 
            }
        }), layersData.clouds_bg.renderIndex+1)

        this.cloudsFront = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(!renderClouds)
                    return;

                let tf = 600

                let params = [
                    {
                        framesCount: tf, itemsCount: 60, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,30], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(106,76), p2: new V2(53,61)
                            }, yShiftClamps: [-3,-5], sec: {color: '#64A4C6', sDecrClamps: [0,2], yShiftClamps: [-1,5], xShiftClamps: [-2,0]}
                    },
                    {
                        framesCount: tf, itemsCount: 70, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,30], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(106,76+4), p2: new V2(44,53+2)
                            }, yShiftClamps: [-3,-5]
                    },


                    {
                        framesCount: tf, itemsCount: 30, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,25], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(32,43), p2: new V2(0,26)
                            }, yShiftClamps: [-2,-3]
                    },
                    {
                        framesCount: tf, itemsCount: 50, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10,20], sizeClamps: [5,8], 
                            initialProps: {
                                line: true, p1: new V2(32+5,43+6), p2: new V2(0,26+3)
                            }, yShiftClamps: [-2,-3]
                    },


                    {
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: '#64A4C6', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [15,30], sizeClamps: [7,10], 
                            initialProps: {
                                line: true, p1: new V2(48+15, 68), p2: new V2(0+5,40)
                            }, yShiftClamps: [-1,-3], invertMovement: true
                    },

                    

                ]

                let itemsFrames = params.map(p => createCloudsFrames(p))

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.drawImage(itemsFrames[i][f],0,0);
                        }

                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(cloudsOverlay,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});

                // params.map(p => {
                //     this.addChild(new GO({
                //         position: new V2(),
                //         size: this.size,
                //         frames: createCloudsFrames(
                //             p
                //         ),
                //         init() {
                //             this.registerFramesDefaultTimer({});
                //         }
                //     }))
                // })

                // 
            }
        }), layersData.tree.renderIndex+1)

        this.cloudsFront1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(!renderClouds)
                    return;

                let tf = 600

                let params = [
                    {
                        framesCount: tf, itemsCount: 200, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-100, -90], distanceClamps: [20,40], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(190,79), p2: new V2(155,79)
                            }, yShiftClamps: [-4,-6]
                    },

                    {
                        framesCount: tf, itemsCount: 200, itemFrameslength: tf, color: '#DEF0FF', size: this.size,
                            directionAngleClamps: [-100, -90], distanceClamps: [20,40], sizeClamps: [3,5], 
                            initialProps: {
                                line: true, p1: new V2(125,79), p2: new V2(80,79)
                            }, yShiftClamps: [-4,-6]
                    },
                ]

                let itemsFrames = params.map(p => createCloudsFrames(p))
                let lowerClampImg = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').rect(0,0, size.x, 78);
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.drawImage(itemsFrames[i][f],0,0);
                        }

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(lowerClampImg,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});

                // params.map(p => {
                //     this.addChild(new GO({
                //         position: new V2(),
                //         size: this.size,
                //         frames: createCloudsFrames(
                //             p
                //         ),
                //         init() {
                //             this.registerFramesDefaultTimer({});
                //         }
                //     }))
                // })

                
            }
        }), layersData.mid.renderIndex+1)

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex+2)


        this.leafs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLeafsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let corners = [new V2(78,51), new V2(104,21), new V2(117,21),new V2(93,55)];
                let _sharedPP = undefined;
                let _colors = ['#ed8778','#d57770','#bc6767','#875d6f']
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx});
                })

                let startPoints = _sharedPP.fillByCornerPoints(corners).map(p => new V2(p))

                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p1 = startPoints[getRandomInt(0, startPoints.length-1)];
                    let direction = V2.up.rotate(getRandomInt(-70, -85));
                    let speed = getRandom(0.3,0.75);
                    let ci = getRandomInt(0, _colors.length-1);
                    let cChangeTimeoutOrigin = getRandomInt(15, 30);
                    let cChangeTimeout = cChangeTimeoutOrigin;

                    let tail = undefined;

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        cChangeTimeout--;
                        if(cChangeTimeout <= 0){
                            cChangeTimeout = cChangeTimeoutOrigin;
                            ci++;
                            if(ci == _colors.length) ci = 0;
                        }

                        if(!tail){
                            if(getRandomInt(0,9) == 0) {
                                tail = {
                                    timeOut: getRandomInt(20,40),
                                    p: new V2(getRandomInt(-1,1), getRandomInt(1,1))
                                }
                            }
                        }
                        else {
                            tail.timeOut--;
                            if(tail.timeOut <= 0)
                                tail = undefined;
                        }

                
                        frames[frameIndex] = {
                            ci,
                            p: p1.add(direction.mul(speed*f)).toInt(),
                            tail: {...tail}
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
                                hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.frames[f].p)

                                // if(itemData.frames[f].tail) {
                                //     ctx.globalAlpha = 0.5;
                                //     hlp.dot(itemData.frames[f].p.add(itemData.frames[f].tail.p))
                                //     ctx.globalAlpha = 1;
                                // }
                            }                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createLeafsFrames({framesCount: 300, itemsCount: 100, itemFrameslength: 150, size: this.size});
                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex-1)

        this.shine = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createShineFrames({framesCount, itemFrameslengthClamp, size}) {
                let frames = [];
                let cornerPoints = animationHelpers.extractPointData(TreeScene.models.main.main.layers.find(l => l.name == 'lake_borders'));
                let innerDots = [];
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    innerDots = pp.fillByCornerPoints(cornerPoints.map(p => new V2(p.point)));
                })

                let itemsData = new Array(fast.r(innerDots.length*2/2)).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                
                    let aMax = fast.r(getRandom(0.25,0.35),2)
                    if(getRandomInt(0,4) == 0){
                        aMax = fast.r(getRandom(0.6,0.8),2)
                    }

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
                this.frames = this.createShineFrames({ framesCount: 300, itemFrameslengthClamp: [50, 70], size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.clouds_ref.renderIndex +2)


        this.clouds_ref_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRefFrames({framesCount, itemFrameslength, size}) {
                let frames = [];
                let pointsData = animationHelpers.extractPointData(TreeScene.models.main.main.layers.find(l => l.name == 'clouds_ref_p'));

                let itemsData = new Array(pointsData.length).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    let p = pointsData[i];

                    let maxWidth = getRandomInt(3,6);
                    let wChange = [
                        ...easing.fast({from: 0, to: maxWidth, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: maxWidth, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0})
                    ];
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            w: wChange[f]
                        };
                    }
                
                    return {
                        p: p.point,
                        color: p.color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let width = itemData.frames[f].w
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
                this.frames = this.createRefFrames({ framesCount: 150, itemFrameslength: 100, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.clouds_ref.renderIndex +1)

        this.g_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(TreeScene.models.main.main.layers.find(l => l.name == 'g_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.clouds_ref.renderIndex +3)

        this.grass = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, {renderOnly: ['grass']}),
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 100;
                        let startFramesChange = easing.fast({ from: 0, to: totalFrames, steps: 125-70, type: 'linear', round: 0 });
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'grass')),
                            pdPredicate: () => getRandomInt(0,2) != 0,
                            startFrameIndexPredicate: (p) => {
                                //70 -> 125
                                if(getRandomBool()){
                                    let r = startFramesChange[125-p.x] + getRandomInt(-10,10);
                                    if(r < 0) r = 0;
                                    if(r > 300-1) r = 300-1;

                                    return r;
                                }
                                    
                                return getRandomInt(0, 300-1)
                            }
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                            pointsData: animationHelpers.extractPointData(TreeScene.models.main.main.layers.find(l => l.name == 'fore_p')) });
            
                        let repeat = 2;
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                repeat--;
                                if(repeat == 0)
                                    this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), layersData.grass.renderIndex)

        this.bg_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let data = [];

                let pp = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    pp = new PP({ctx});
                })

                // data.push(...pp.fillByCornerPoints([new V2(199,30), new V2(140,61), new V2(155,69), new V2(199,48)]).map(p => ({color: '#43a2bc', point: p})))
                // data.push(...pp.fillByCornerPoints([new V2(199,22), new V2(133,59), new V2(143,64), new V2(199,34)]).map(p => ({color: '#3990b5', point: p})))
                // data.push(...pp.fillByCornerPoints([new V2(199,45), new V2(153,68), new V2(162,72), new V2(199,46)]).map(p => ({color: '#3990b5', point: p})))
                // data.push(...pp.fillByCornerPoints([new V2(199,17), new V2(121,61), new V2(129,60), new V2(199,24)]).map(p => ({color: '#2f7dad', point: p})))
                // data.push(...pp.fillByCornerPoints([new V2(199,54), new V2(162,73), new V2(166,75), new V2(199,59)]).map(p => ({color: '#2f7dad', point: p})))
                data = animationHelpers.extractPointData(TreeScene.models.main.main.layers.find(l => l.name == 'bg_p'));

                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 25, size: this.size, 
                    pdPredicate: () => getRandomInt(0,3) == 0,
                    pointsData: data });
    
                this.registerFramesDefaultTimer({
                    
                });
            }
        }), layersData.bg.renderIndex+1)
    }
}