class Demo10WindowScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.portal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createPortalFrames({framesCount, itemsCount, itemFrameslengthClamp, size}) {
                let frames = [];
                
                let portalSize = new V2(30,85);
                let origin = new V2(30, 55);

                let tl = origin.substract(portalSize);

                let sharedHlp = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedHlp = hlp;
                })

                let initInnerPoints = [];
                sharedHlp.elipsis(origin, portalSize.mul(0.2).toInt(), initInnerPoints);

                let innerItemsData = new Array(100).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(100, 150);
                    let initPoint = initInnerPoints[getRandomInt(0, initInnerPoints.length-1)];
                    let xChange = easing.fast({ from: initPoint.x, to: getRandomInt(-2,0), steps: totalFrames, type: 'quad', method: 'in', round: 0 })
                    let yChange = easing.fast({ from: initPoint.y, to: origin.y + getRandomInt(-3,3), steps: totalFrames, type: 'quad', method: 'in', round: 0 })
                    let oValues = easing.fast({ from: 0, to: 0.25, steps: totalFrames, type: 'quad', method: 'in', round: 1 })
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let x = xChange[f]
                        let y = yChange[f]
                        
                        frames[frameIndex] = {
                            o: oValues[f],
                            x,y
                        };
                    }
                
                    return {
                        frames
                    }
                });

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamp[0], itemFrameslengthClamp[1]);
                
                    let radius = getRandom(0.05,1.25);//getRandom(0.25,1);
                    let elSize = portalSize.mul(radius);

                    let startAngle = getRandomInt(0, 359);
                    let angleDelta = getRandomInt(45,90);

                    let angleValues = easing.fast({from: startAngle, to: startAngle + angleDelta, steps: totalFrames, type: 'linear'});
                    let aValues = [
                        ...easing.fast({ from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1 }),
                        ...easing.fast({ from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 1 })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let r = degreeToRadians(angleValues[f]);
                        let x = fast.r(origin.x + elSize.x * Math.cos(r));
                        let y = fast.r(origin.y + elSize.y * Math.sin(r));
                
                        let opacity = aValues[f];
                        if(opacity == undefined){
                            opacity = 0;
                        }

                        frames[frameIndex] = {
                            opacity,
                            x,y
                        };
                    }
                
                    return {
                        frames
                    }
                })

                
                
                let bg = createCanvas(this.size, (ctx, size, hlp) => {
                    let elSize = portalSize.mul(0.25).toInt();
                    let gr = createCanvas(size, (ctx, size, hlp) => {
                        let hsv = colors.colorTypeConverter({ value: '#798B9D', toType: 'hsv', fromType: 'hex'});

                        let grLenght = 30;
                        let vValues = easing.fast({ from: hsv.v, to: hsv.v-30, steps: grLenght, type: 'linear', round: 0 });
                        let originDots = []
                        hlp.setFillColor('rgba(0,0,0,0)').strokeEllipsis(-90, 90, 1, origin, elSize.x, elSize.y, originDots, true);

                        for(let x = 0; x < grLenght; x++){
                            hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: vValues[x] }, fromType: 'hsv', toType: 'hex'}));
                            originDots.forEach(od => {
                                hlp.dot(od.x -x, od.y);
                            })
                        }
                    })


                    hlp.setFillColor('red').elipsis(origin, elSize);
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.drawImage(gr, 0,0);

                })

                let bg1 = createCanvas(this.size, (ctx, size, hlp) => {

                })

                let rChange = easing.fast({ from: 0.025, to: 1.5, steps: framesCount/2, type: 'sin', method: 'in' });
                let hsv = colors.colorTypeConverter({ value: '#798B9D', toType: 'hsv', fromType: 'hex'}); 
                let wavesVValuesLight = easing.fast({ from: hsv.v+20, to: hsv.v, steps: framesCount/2, type: 'sin', method: 'in', round: 0 });
                let wavesVValuesDark = easing.fast({ from: hsv.v-20, to: hsv.v, steps: framesCount/2, type: 'sin', method: 'in', round: 0 });

                let wavesMainData = [];
                
                for(let f = 0; f < framesCount/2; f++){
                    let elSize = portalSize.mul(rChange[f]).toInt();
                    let dots = [];
                    let dotsDark = [];
                    let dots1 = [];
                    let dots1Dark = [];
                    sharedHlp.strokeEllipsis(-20, 130, 0.5, origin, elSize.x-1, elSize.y-1, dotsDark, true);
                    sharedHlp.strokeEllipsis(-20, 130, 0.5, origin, elSize.x, elSize.y, dots, true);
                    sharedHlp.strokeEllipsis(180, 300, 0.5, origin, elSize.x, elSize.y, dots1, true);
                    sharedHlp.strokeEllipsis(180, 300, 0.5, origin, elSize.x+1, elSize.y+1, dots1Dark, true);
                    let maxV = wavesVValuesLight[f];
                    let maxVDark = wavesVValuesDark[f];
                    let vChange = [
                        ...easing.fast({ from: hsv.v, to: maxV, steps: fast.r(dots.length/2), type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: maxV, to: hsv.v, steps: fast.r(dots.length/2), type: 'quad', method: 'inOut', round: 0 })
                    ]

                    let vChangeDark = [
                        ...easing.fast({ from: hsv.v, to: maxVDark, steps: fast.r(dotsDark.length/2), type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: maxVDark, to: hsv.v, steps: fast.r(dotsDark.length/2), type: 'quad', method: 'inOut', round: 0 })
                    ]

                    let vChange1 = [
                        ...easing.fast({ from: hsv.v, to: maxV, steps: fast.r(dots1.length/2), type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: maxV, to: hsv.v, steps: fast.r(dots1.length/2), type: 'quad', method: 'inOut', round: 0 })
                    ]

                    let vChange1Dark = [
                        ...easing.fast({ from: hsv.v, to: maxVDark, steps: fast.r(dots1Dark.length/2), type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: maxVDark, to: hsv.v, steps: fast.r(dots1Dark.length/2), type: 'quad', method: 'inOut', round: 0 })
                    ]
                    wavesMainData[f] = {
                        dots, 
                        dots1,
                        dotsDark,
                        dots1Dark,
                        vChange,
                        vChange1,
                        vChangeDark,
                        vChange1Dark
                    }
                }

                let wavesCount = 4;
                let wavesData = new Array(wavesCount).fill().map((el, i) => {
                    let startFrameIndex = i*fast.r(framesCount/wavesCount);
                    let frames = [];

                    for(let f = 0; f < framesCount/2; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = wavesMainData[f];
                    }

                    return {
                        frames
                    }
                })

                let noiseImages = [];
                let time = 0;
                let timeClamp = 10;
                let timeValues = [
                    ...easing.fast({ from: 0, to: timeClamp, steps: framesCount/2, type: 'sin', method: 'inOut' }),
                    ...easing.fast({ from: timeClamp, to: 0, steps: framesCount/2, type: 'sin', method: 'inOut' })
                ]
                let paramsDivider = 30;
                let paramsMultiplier = 2;
                let seed = getRandom(0,1000); 
                console.log('seed:' + seed )
                //102.49392170660276
                var pn = new mathUtils.Perlin('random seed ' + seed);
                for(let f = 0; f < framesCount;f++){
                    time = timeValues[f];
                    noiseImages[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < size.y; y++){
                            for(let x = 0; x < 60; x++){
                                // let noise = pn.noise(x/paramsDivider, y/paramsDivider, time/10);

                                let noiseX = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                let noiseY = pn.noise((x-100)/paramsDivider, (y+200)/paramsDivider, time/10);
                                let noise = pn.noise(noiseX*paramsMultiplier, noiseY*paramsMultiplier, time/10);

                                //noise = noise*100;
                                let v =hsv.v + fast.r(-10 + noise*40)
                                
    
                                hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: v }, fromType: 'hsv', toType: 'hex'}))
                                .dot(x,y)
                            }
                        }
                    })
                }
                

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('#798B9D').rect(tl.x, tl.y, portalSize.x*2 + 1, portalSize.y*2 + 1);
                        ctx.drawImage(noiseImages[f], 0,0)

                        for(let p = 0; p < innerItemsData.length; p++){
                            let itemData = innerItemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o})`).dot(itemData.frames[f].x, itemData.frames[f].y)
                            }
                            
                        }


                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].opacity})`).dot(itemData.frames[f].x, itemData.frames[f].y)
                            }
                            
                        }

                        // for(let p = 0; p < wavesData.length; p++){
                        //     let itemData = wavesData[p];

                        //     if(itemData.frames[f]){
                        //         itemData.frames[f].dotsDark.forEach((d,i) => {
                        //             hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: itemData.frames[f].vChangeDark[i] || hsv.v }, fromType: 'hsv', toType: 'hex'}))
                        //             .dot(d.x, d.y);
                        //         })

                        //         itemData.frames[f].dots.forEach((d,i) => {
                        //             hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: itemData.frames[f].vChange[i] || hsv.v }, fromType: 'hsv', toType: 'hex'}))
                        //             .dot(d.x, d.y);
                        //         })

                        //         itemData.frames[f].dots1.forEach((d,i) => {
                        //             hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: itemData.frames[f].vChange1[i] || hsv.v }, fromType: 'hsv', toType: 'hex'}))
                        //             .dot(d.x, d.y);
                        //         })

                        //         itemData.frames[f].dots1Dark.forEach((d,i) => {
                        //             hlp.setFillColor(colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: itemData.frames[f].vChange1Dark[i] || hsv.v }, fromType: 'hsv', toType: 'hex'}))
                        //             .dot(d.x, d.y);
                        //         })
                        //     }
                            
                        // }

                        
                    });
                }
                
                return frames;
            },
            init() {

                this.bg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#798B9D').rect(0,0,size.x, size.y);
                    })
                }))

                this.whirl = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createPortalFrames({ framesCount: 200, itemsCount: 800, itemFrameslengthClamp: [50, 100], size: this.size }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }));
            }
        }), 0)

        // this.bg = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(Demo10WindowScene.models.main, { renderOnly: ['bg'] }),
        // }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10WindowScene.models.main, { exclude: ['p','hand'] }),
            init() {
                let size = this.size;

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10WindowScene.models.main.main.layers.find(l => l.name == 'p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.animation1 = this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: PP.createImage(Demo10WindowScene.models.girlFrames, {renderOnly: ['ani1']}),
                    init() {
                        let totalFrames = 50;
                        let frameIndexChange = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: 20, type: 'quad', method: 'out', round: 0 }),
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalFrames-20, type: 'linear', method: 'base', round: 0 })
                        ];

                        this.frames = [
                            ...new Array(totalFrames).fill().map((el,i) => this.frames[frameIndexChange[i]]),
                            ...new Array(100-totalFrames).fill(undefined)
                        ]

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.animation2 = this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: PP.createImage(Demo10WindowScene.models.girlFrames, {renderOnly: ['ani2']}),
                    init() {
                        let totalFrames = 50;
                        let delay = 5;
                        let frameIndexChange = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: 20, type: 'quad', method: 'out', round: 0 }),
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalFrames-20, type: 'linear', method: 'base', round: 0 })
                        ];

                        this.frames = [
                            ...new Array(delay).fill(undefined),
                            ...new Array(totalFrames).fill().map((el,i) => this.frames[frameIndexChange[i]]),
                            ...new Array(100-totalFrames-delay).fill(undefined)
                        ]
                        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.animation3 = this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: PP.createImage(Demo10WindowScene.models.girlFrames, {renderOnly: ['ani3']}),
                    init() {
                        let totalFrames = 50;
                        let delay = 10;
                        let frameIndexChange = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: 20, type: 'quad', method: 'out', round: 0 }),
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalFrames-20, type: 'linear', method: 'base', round: 0 })
                        ];

                        this.frames = [
                            ...new Array(delay).fill(undefined),
                            ...new Array(totalFrames).fill().map((el,i) => this.frames[frameIndexChange[i]]),
                            ...new Array(100-totalFrames-delay).fill(undefined)
                        ]
                        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.animation4 = this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: PP.createImage(Demo10WindowScene.models.girlFrames, {renderOnly: ['ani4']}),
                    init() {
                        let totalFrames = 50;
                        let delay = 15;
                        let frameIndexChange = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: 20, type: 'quad', method: 'out', round: 0 }),
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalFrames-20, type: 'linear', method: 'base', round: 0 })
                        ];

                        this.frames = [
                            ...new Array(delay).fill(undefined),
                            ...new Array(totalFrames).fill().map((el,i) => this.frames[frameIndexChange[i]]),
                            ...new Array(100-totalFrames-delay).fill(undefined)
                        ]
                        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.hand = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-1)),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(Demo10WindowScene.models.bookFrames);

                let totalFrames = 100;

                let yValues = [
                    ...easing.fast({ from: -1, to: 0, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 }),
                    ...easing.fast({ from: 0, to: -1, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 })
                ]

                let frameIndexChange = [
                    ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', method: 'base', round: 0 })
                ];
                this.frames = [
                    ...new Array(totalFrames).fill().map((el,i) => this.frames[frameIndexChange[i]]),
                ]

                this.registerFramesDefaultTimer({});

                let currentYShiftFrame = 0;
                this.regDefaultTimer(10, () => {
                    let yShift = yValues[currentYShiftFrame];
                    this.position.y = this.parentScene.sceneCenter.y + yShift;
                    this.needRecalcRenderProperties = true;

                    currentYShiftFrame++;
                    if(currentYShiftFrame == 200){
                        currentYShiftFrame = 0;
                    }
                })
            }
        }), 15)
    }
}