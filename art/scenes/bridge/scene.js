class BridgeScene extends Scene {
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
                size: new V2(1600,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'bridge'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let renderClouds = true;
        let model = BridgeScene.models.main;
        let layersData = {};
        let exclude = [
            'backCloudsOverlay', 'city_p'
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

        let circleImages = {};
        let cColors = ['#FF0000', '#B9AFC6', '#6676A7', '#5B6CA0', '#9EAECE', '#5476a3']
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 15; s++){
                if(s > 3)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        let createCloudsFrames = function({framesCount, itemsCount, itemFrameslength, color, sec, size,
            directionAngleClamps, distanceClamps, sizeClamps, initialProps, yShiftClamps, invertMovement = false, addSingles =false
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
                let single = false;
                if(addSingles){
                    single = true;
                }

                if(single){
                    dir = dir.rotate(-90)
                    let distMul = -0.5;
                    if(addSingles.distMul) {
                        distMul = addSingles.distMul
                    }
                    dist*=distMul;
                }

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

                let sValues = undefined;
                if(single) {
                    pointsIndexChange = easing.fast({from: 0, to: points.length-1, steps: framesCount, type: 'linear', round: 0})
                    yShiftValues = [
                        ...easing.fast({from: 0, to: yShift, steps: framesCount, type: 'quad', method: 'out', round: 0}),  
                    ]

                    sValues = easing.fast({from: s, to: 1, steps: framesCount, type: 'linear', round: 0})
                }

                yShiftValues = [...yShiftValues, ...yShiftValues.map(x => -x)];

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        y: yShiftValues[f],
                        p: points[pointsIndexChange[f]],
                        s: sValues ? sValues[f] : undefined
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

                            let s = itemData.s;
                            if(itemData.frames[f].s) {
                                s = itemData.frames[f].s
                            }

                            // if(s> 2)
                            //     ctx.drawImage(circleImages[color][s], _p.x, _p.y + yShift)
                            // else if(s == 2){
                            //     hlp.setFillColor(color).rect(_p.x, _p.y + yShift, 4, 4)
                            // }
                            // else if(s == 1){
                            //     hlp.setFillColor(color).rect(_p.x, _p.y + yShift, 2, 2)
                            // }

                            ctx.drawImage(circleImages[color][s], _p.x, _p.y + yShift)

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

        this.backClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let tf = 600
                let c1 = '#9EAECE'
                let c2 = '#5476a3'

                let overlay = PP.createImage(model, { renderOnly: ['backCloudsOverlay'], forceVisivility: { 'backCloudsOverlay': { visible: true } }  })

                let params = [
                    {
                        ga: 0.5,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,100), p2: new V2(72,103)
                            }, yShiftClamps: [-5,-7], addSingles: { distMul: -0.25}
                    },
                    {
                        ga: 0.5,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(72,103), p2: new V2(-20, 90)
                            }, yShiftClamps: [-5,-7], addSingles: { distMul: -0.25}
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,110), p2: new V2(72,105)
                            }, yShiftClamps: [-5,-7]
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(72,105), p2: new V2(-20, 100)
                            }, yShiftClamps: [-5,-7]
                    },
                    {
                        ga: 0.25,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,115), p2: new V2(-20, 105)
                            }, yShiftClamps: [-5,-7], addSingles: true
                    },
                    {
                        ga: 0.5,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,118), p2: new V2(-20, 107)
                            }, yShiftClamps: [-5,-7]
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [7,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,120), p2: new V2(-20, 110)
                            }, yShiftClamps: [-2,-4]
                    },
                    {
                        ga: 0.25,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,135), p2: new V2(100,145)
                            }, yShiftClamps: [-3,-5], addSingles: { distMul: -0.5}
                    },
                    {
                        ga: 0.5,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,15], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(170,135), p2: new V2(100,145)
                            }, yShiftClamps: [-3,-5], 
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        ga: p.ga,
                        frames: createCloudsFrames(p)
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].ga;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(overlay,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.city.renderIndex+1)


        this.frontalClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(!renderClouds)
                    return;

                let tf = 600
                let c1 = '#B9AFC6'
                let c2 = '#6676A7'
                let c3 = '#5B6CA0'
                let dClampsMul = 1.5;
                let params = [
                    {
                        ga: 0.25,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10*dClampsMul,20*dClampsMul], sizeClamps: [10,13], 
                            initialProps: {
                                line: true, p1: new V2(170,180), p2: new V2(-20,122)
                            }, yShiftClamps: [-5,-7], addSingles: true
                    },
                    {
                        ga: 0.50,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10*dClampsMul,20*dClampsMul], sizeClamps: [10,13], 
                            initialProps: {
                                line: true, p1: new V2(170,185), p2: new V2(-20,127)
                            }, yShiftClamps: [-5,-7], addSingles: true
                    },
                    
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10*dClampsMul,20*dClampsMul], sizeClamps: [10,13], 
                            initialProps: {
                                line: true, p1: new V2(170,177), p2: new V2(100,170)
                            }, yShiftClamps: [-5,-7], addSingles: true
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10*dClampsMul,20*dClampsMul], sizeClamps: [10,13], 
                            initialProps: {
                                line: true, p1: new V2(170,189), p2: new V2(-20,131)
                            }, yShiftClamps: [-5,-7], addSingles: true
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 80, itemFrameslength: tf, color: c1, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [10*dClampsMul,20*dClampsMul], sizeClamps: [10,13], 
                            initialProps: {
                                line: true, p1: new V2(170,189), p2: new V2(-20,131)
                            }, yShiftClamps: [-5,-7]
                    },
                    {
                        ga: 0.25,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                            initialProps: {
                                line: true, p1: new V2(140,195), p2: new V2(-20,140)
                            }, yShiftClamps: [-2,-4], addSingles: true
                    },
                    {
                        ga: 0.5,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                            initialProps: {
                                line: true, p1: new V2(130,199), p2: new V2(-20,149)
                            }, yShiftClamps: [-2,-4], addSingles: true
                    },
                    // {
                    //     ga: 1,
                    //     framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c2, size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                    //         initialProps: {
                    //             line: true, p1: new V2(123-5,199), p2: new V2(56,185+5)
                    //         }, yShiftClamps: [-2,-4], addSingles: true
                    // },
                    // {
                    //     ga: 1,
                    //     framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c2, size: this.size,
                    //         directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                    //         initialProps: {
                    //             line: true, p1: new V2(56,185+5), p2: new V2(-20,151+5)
                    //         }, yShiftClamps: [-2,-4], addSingles: true
                    // },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                            initialProps: {
                                line: true, p1: new V2(123,199), p2: new V2(56,185)
                            }, yShiftClamps: [-2,-4]
                    },
                    {
                        ga: 1,
                        framesCount: tf, itemsCount: 40, itemFrameslength: tf, color: c2, size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [12*dClampsMul,22*dClampsMul], sizeClamps: [12,14], 
                            initialProps: {
                                line: true, p1: new V2(56,185), p2: new V2(-20,151)
                            }, yShiftClamps: [-2,-4]
                    }
                ]

                let itemsFrames = params.map(p => {
                    return {
                        ga: p.ga,
                        frames: createCloudsFrames(p)
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        // ctx.globalAlpha = 0.5
                        // ctx.drawImage(itemsFrames[0][f],0,0);

                        // ctx.globalAlpha = 0.5
                        // ctx.drawImage(itemsFrames[0][f],0,0);


                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].ga;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        // ctx.globalCompositeOperation = 'source-atop';
                        // ctx.drawImage(cloudsOverlay,0,0);
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.frontalClouds.renderIndex+1)
        

        this.city_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'city_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.city.renderIndex+1)

        this.waterAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWaterFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                let xClamps = [97, 159]
                let yClamps = [141, 177]
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                    let isWhite = getRandomInt(0,4) > 1;
                    let x = getRandomInt(xClamps)
                    let y = getRandomInt(yClamps);
                    let maxOpacity = fast.r(getRandom(0.05, 0.1),2)

                    if(isWhite && getRandomInt(0,5) == 0){
                        maxOpacity*= getRandomInt(3,5)
                    }

                    let xShiftValues = easing.fast({from: 0, to: 0, steps: totalFrames, type: 'linear', round: 0})
                    let oValues = [
                        ...easing.fast({from: 0, to: maxOpacity, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({from: maxOpacity, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            o: oValues[f],
                            xShift: xShiftValues[f]
                        };
                    }
                
                    return {
                        isWhite,
                        x,y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let o = itemData.frames[f].o;
                                if(o == undefined)
                                    o = 0
                                hlp.setFillColor(itemData.isWhite ? `rgba(255,255,255, ${o})` : `rgba(0,0,0, ${o})`)
                                .dot(itemData.x + itemData.frames[f].xShift, itemData.y)

                                // hlp.setFillColor(itemData.isWhite ? `rgba(255,255,255, ${o/2})` : `rgba(0,0,0, ${o/2})`)
                                // .dot(itemData.x + itemData.frames[f].xShift - 1, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createWaterFrames({framesCount: 200, itemsCount: 1500, itemFrameslengthClamps: [50, 100], size: this.size})
                this.registerFramesDefaultTimer({});
            }
        }), layersData.city.renderIndex+2)
    }
}