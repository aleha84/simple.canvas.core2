class DepressionScene extends Scene {
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
                fileNamePrefix: 'depression',
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
        let createRainFrames = function({framesCount, itemsCount, itemFrameslengthClamps, tailLengthClamps, xClamps, yClamps, lowerYClamps, aClamps, size}) {
            let frames = [];

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

                            let c = colorPrefix;
                            let changeColorFromY = xToy[x];

                            // if(changeColorFromY == undefined) {
                            //     break;

                            // }

                            let lastI = 0;
                            for(let i = 0; i < tailLength; i++) {
                                lastI = i;
                                if(itemData.frames[f].y+lastI > lowerY)
                                    break;

                                let y = itemData.frames[f].y+lastI;
                                if(y > changeColorFromY) {
                                    c = colorPrefix2;
                                }

                                hlp.setFillColor(`${c}${aValues[i]}` ).dot(x, itemData.frames[f].y+lastI)
                            }

                            if(itemData.frames[f].y+lastI <= lowerY)
                                hlp.setFillColor(`${c}${maxA/2}` ).dot(x, itemData.frames[f].y+(lastI+1))
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        const model = DepressionScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        // const colorPrefix = 'rgba(255,255,255,';
        const colorPrefix = 'rgba(20,24,30,';//'rgba(10,12,15,';
        const colorPrefix2 = 'rgba(173,201,255,';

        const lineCorners = [new V2(0,94),new V2(31,94),new V2(31,81),new V2(65,63),new V2(89,63),new V2(90,64),new V2(127,64),
            new V2(128,65),new V2(134,65),new V2(136,62),new V2(143,63),new V2(143,65),new V2(154,65),new V2(155,64),
            new V2(155,63),new V2(164,63),new V2(164,65),new V2(174,65),new V2(175,64),new V2(175,63),new V2(182,63),
            new V2(182,65),new V2(189,65),new V2(189,96),new V2(199,96),
        ]

        const linePoints = appSharedPP.lineByCornerPoints(lineCorners);
        const xToy = [];
        for(let i = 0; i < linePoints.length; i++) {
            let {x, y} = linePoints[i];
            xToy[x] = y;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })

                this.sky = this.addChild(new GO({
                    position: new V2(0, -5),
                    size: this.size,
                    init() {
                        let cc = ['#54627D', '#586680', '#5B6983', '#5F6C85', '#626F88' ]
                        let steps = 4;
                        //let aValues = easing.fast({from: 0.025, to: 0.10, steps: steps+1, type: 'linear', method: 'base', round: 3});
                        let stepWidth = 60;
                        let startX = 50

                        let basePoints = [
                            new V2(0, 0), new V2(stepWidth, 0), new V2(180 + stepWidth, 60), new V2(180, 60)
                        ] 

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});

                            let data = [];

                            for(let i = 0; i < steps; i++) {
                                pp.setFillColor(cc[i+1]);
                                pp.fillByCornerPoints(basePoints.map(p => p.add(new V2(startX + stepWidth*i, 0))), { fixOpacity: true })

                                data.push({
                                    c2: cc[i+1],
                                    c1: cc[i],
                                    dividerPoints: appSharedPP.lineV2(new V2(startX + stepWidth*i - 1 , 0), new V2(startX + 180 + stepWidth*i -1, 60)),
                                    rv: [10,6,2,2]
                                })
                            }

                            colorsHelpers.createDithering({ data, hlp, xClamps: [0,size.x], rValues: [4,2,0,0].map(x => x*1), sharedPP: appSharedPP , 
                                preventDuplicates: true, debug: false })
                        })
                    }
                }))
            }
        }), 1)

        this.farRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //return;
                // let layersCount = 2;
                let framesCount = 120
                let xClamps = [0, 200]
                let yClamps = [-40,-20]
                let lowerYClamps = [200, 220]

                this.frames = createRainFrames({
                    framesCount, 
                    itemsCount: 10000, 
                    itemFrameslengthClamps: [80,120], 
                    tailLengthClamps: [3,4], 
                    aClamps: [0.01, 0.02],
                    xClamps, yClamps, 
                    lowerYClamps, size: this.size
                });

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });   

               
            }
        }), 3)

        this.building = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['wires', 'building'] });

                this.window_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 120, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(DepressionScene.models.main.main.layers.find(l => l.name == 'window_p'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.tv = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let w1points = [
                            ...appSharedPP.fillByCornerPoints([new V2(127,184), new V2(131,184), new V2(131,195), new V2(127, 195)]),
                            ...appSharedPP.fillByCornerPoints([new V2(124,184), new V2(125,184), new V2(125,195), new V2(124,195)])
                        ]
                        let cprefix = 'rgba(54,104,160'
                        let frames = [
                            createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                                let c = cprefix + ',0.2)';
                                hlp.setFillColor(c);
                                w1points.forEach(wp => {
                                    hlp.dot(wp);
                                })
                            }),
                            createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                                let c = cprefix + ',0.15)';
                                hlp.setFillColor(c);
                                w1points.forEach(wp => {
                                    hlp.dot(wp);
                                })
                            }),
                            createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                                let c = cprefix + ',0.1)';
                                hlp.setFillColor(c);
                                w1points.forEach(wp => {
                                    hlp.dot(wp);
                                })
                            }),
                            createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                                let c = cprefix + ',0.05)';
                                hlp.setFillColor(c);
                                w1points.forEach(wp => {
                                    hlp.dot(wp);
                                })
                            }),
                            //undefined
                            // createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                            //     let c = 'rgba(255,255,255,0.05)';
                            //     hlp.setFillColor(c);
                            //     w1points.forEach(wp => {
                            //         hlp.dot(wp.point);
                            //     })
                            // }),
                        ]

                        let frameChangeDelay = getRandomInt(5,10) ;
                        this.img = frames[getRandomInt(0, frames.length-1)]
                    
                        //this.img = frames[0];
                        this.timer = this.regTimerDefault(10, () => {                     
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = getRandomInt(5,10);
                        
                            this.img = frames[getRandomInt(0, frames.length-1)]
                        })
                    }
                }))
            }
        }), 5)

        this.closeRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //return;

                let layersCount = 8;
                let framesCount = 120
                let xClamps = [0, 200]
                let yClamps = [-40,-20]
                let lowerYClamps = [200, 220]
                let itemsCountValues = easing.fast({from: 50, to: 400, steps: layersCount, type: 'sin', method: 'in', round: 0})
                let itemFrameslengthValues = easing.fast({from: 15, to: 65, steps: layersCount, type: 'sin', method: 'in', round: 0})
                let tailLengthValues = easing.fast({from: 20, to: 5, steps: layersCount, type: 'sin', method: 'in', round: 0})
                let aValues = easing.fast({from: 0.1, to: 0.02, steps: layersCount, type: 'sin', method: 'in', round: 3})

                let data = new Array(layersCount).fill().map((_, i) => ({
                    framesCount, 
                    itemsCount: itemsCountValues[i], 
                    itemFrameslengthClamps: [itemFrameslengthValues[i],fast.r(itemFrameslengthValues[i]*1.25)], 
                    tailLengthClamps: [tailLengthValues[i],fast.r(tailLengthValues[i]*1.2)], 
                    aClamps: [aValues[i], aValues[i]*1.25],
                    xClamps, yClamps, 
                    lowerYClamps, size: this.size
                }));

                this.layers = data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createRainFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });        
                    }
                })))
            }
        }), 8)

        this.balkon = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSplashFrames({framesCount, splashesCount, startPoints, itemFrameslengthClamps, maxA, size, gravityClamps, particlesCountClamps = [3,5],
                noColorChange,
                fallItem = {
                    height, framesLength, tailLength
                }
            }) {
                let frames = [];
                //let gravity = 0.02;
                
                if(!gravityClamps) {
                    gravityClamps = [0.035,0.06]
                }

                let fallItemInitData = [];

                let itemsData = startPoints.map((startPoint, i) => {
                    //let startPoint = startPoints[getRandomInt(0, startPoints.length-1)]
                    let startFrameIndex = fast.r((i/startPoints.length)*framesCount)+ getRandomInt(0, 25) //getRandomInt(0, framesCount-1);

                    fallItemInitData.push({
                        startFrameIndex: startFrameIndex - fallItem.framesLength,
                        x: startPoint.x,
                        y: startPoint.y - fallItem.height,
                        targetY: startPoint.y
                    })

                    let totalFrames = framesCount;
                    let itemsCount = getRandomInt(particlesCountClamps);

                    let frames = [];

                    let particlesData = new Array(itemsCount).fill().map((_, ii) => ({
                        ttl: getRandomInt(itemFrameslengthClamps),
                        speedV: V2.up.rotate(getRandomInt(0, 30)*(ii%2==0 ? -1 : 1)).mul(getRandom(0.25,0.75)),  //new V2(getRandom(0,0.2)*(ii%2==0 ? -1 : 1), getRandom(-0.4, -0.8)),
                        currentP: startPoint.add(new V2(getRandomInt(-2,2),0)),
                        gravity: getRandom(gravityClamps[0],gravityClamps[1])
                    }))

                    
                    
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let framesData = [];

                        for(let pd = 0; pd < particlesData.length; pd++) {
                            let currentPd = particlesData[pd];
                            if(!currentPd.aValues) {
                                currentPd.aValues = easing.fast({from: maxA, to: 0, steps: currentPd.ttl, type: 'linear', round: 2 })
                            }

                            if(currentPd.ttl < 0)
                                continue; 

                            framesData[framesData.length] = {
                                p: currentPd.currentP.clone(),
                                a: currentPd.aValues[f]
                            }

                            currentPd.currentP = currentPd.currentP.add(currentPd.speedV);
                            currentPd.speedV.y+=currentPd.gravity;
                            currentPd.ttl--;
                        }
                
                        frames[frameIndex] = framesData;
                    }
                
                    return {
                        frames
                    }
                })

                let fallItemData = fallItemInitData.map((fi, i) => {
                    let startPoint = new V2(fi.x, fi.y)
                    let startFrameIndex = fi.startFrameIndex;

                    if(startFrameIndex < 0) {
                        startFrameIndex = framesCount + startFrameIndex;
                    }

                    let totalFrames = fallItem.framesLength;
                    
                    let yValues =  easing.fast({from: startPoint.y, to: fi.targetY-fallItem.tailLength, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                    let tailLengthValues = easing.fast({from: 1, to: fallItem.tailLength, steps: totalFrames, type: 'quad', method: 'in', round: 0})
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yValues[f],
                            tailLength: tailLengthValues[f],
                        };
                    }
                
                    return {
                        startPoint,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];

                            if(itemData.frames[f]){
                                for(let i = 0 ; i < itemData.frames[f].length; i++) {
                                    let pd = itemData.frames[f][i];

                                    let p = pd.p.toInt();
                                    let c = colorPrefix;
                                    let changeColorFromY = xToy[p.x];

                                    if(p.y > changeColorFromY) {
                                        c = colorPrefix2;
                                    }

                                    if(noColorChange) {
                                        c = noColorChange;
                                    }

                                    if(pd.a != undefined)
                                        hlp.setFillColor(c + pd.a + ')').dot(p)
                                }
                            }
                            
                        }

                        for(let p = 0; p < fallItemData.length; p++){
                            let itemData = fallItemData[p];

                            if(itemData.frames[f]){

                                let c = colorPrefix;
                                let changeColorFromY = xToy[itemData.startPoint.x];

                                if(itemData.frames[f].y > changeColorFromY) {
                                    c = colorPrefix2;
                                }

                                if(noColorChange) {
                                    c = noColorChange;
                                }

                                hlp.setFillColor(c + maxA + ')').rect(itemData.startPoint.x, itemData.frames[f].y, 1,  itemData.frames[f].tailLength)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.img = PP.createImage(model, { renderOnly: ['balkon'] })

                this.splash = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetPoints = [
                            new V2(83,170),
                            new V2(112, 196),
                            new V2(99, 184),
                            new V2(94, 181),
                            new V2(71, 159),
                            // {p: new V2(7, 165)},
                            // {p: new V2(9, 166)},
                            // new V2(55, 144),
                        ]

                        this.frames = this.parent.createSplashFrames({ framesCount: 120, maxA: 0.2,itemFrameslengthClamps: [10,30], 
                            startPoints: targetPoints, 
                            fallItem: {
                                height: 200, framesLength: 50, tailLength: 5,
                            },
                            gravityClamps: [0.035,0.045], size: this.size });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.splash2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let targetPoints = [
                            new V2(7, 165),
                            // new V2(12, 166),
                        ]

                        this.frames = this.parent.createSplashFrames({ framesCount: 120, maxA: 0.2,itemFrameslengthClamps: [10,30], 
                            startPoints: targetPoints, noColorChange: colorPrefix2,
                            fallItem: {
                                height: 200, framesLength: 50, tailLength: 5,
                            },
                            gravityClamps: [0.025,0.045], size: this.size });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)
    }
}