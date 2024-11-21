class SolitudeScene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'solitude',
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
        let model = SolitudeScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.farForest = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['far_forest'] }),
            init() {
                //
            }
        }), 3)

        this.lake = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mainImg = PP.createImage(model, { renderOnly: ['ground', 'close_forest', 'close_forest_d','house' ] })
                this.reflection = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.translate(0, size.y + 75);
                            ctx.scale(1, -1);
                            ctx.drawImage(mainImg, 0, 0);
        
                            hlp.setFillColor('rgba(0,0,0,0.5').rect(0,0,size.x, size.y)
                        })

                        this.animations =this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createReflectionFrames({framesCount, itemsCount, itemFrameslengthClamps, data, additionalData, yShiftClamps, maxWidth, yClamps, size}) {
                                let frames = [];
                                
                                let widthToYValues = easing.fast({from: 0, to: maxWidth, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })
                                let yShiftToValues = easing.fast({from: 0, to: 3, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })
                                let startFrameIndexToYValues = easing.fast({from: 0, to: framesCount-1, steps: (yClamps[1]-yClamps[0])+1, type: 'linear', round: 0 })



                                let itemsData = new Array(itemsCount).fill().concat(additionalData).map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount-1);
                                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                                
                                    let y = getRandomInt(yClamps);
                                    let x = getRandomInt(0, size.x);
                                    let targetY = y + getRandomInt(yShiftClamps)
                                    let addHighlight = getRandomInt(0,20) == 0;
                                    //let startFrameIndex = startFrameIndexToYValues[y-yClamps[0]] + getRandomInt(0, 30);

                                    // if(getRandomInt(0,20) == 0){
                                    //     y = getRandomInt(159,164);
                                    //     x = getRandomInt(58,62)
                                    //     targetY = y + getRandomInt(-10,10)
                                    // }

                                    if(targetY == y)
                                        targetY = y+1;

                                    let w = widthToYValues[y-yClamps[0]];

                                    if(el) {
                                        y = el.y;
                                        x = el.x
                                        targetY = y;
                                        w = el.w
                                    }

                                    let widthValues = [
                                        ...easing.fast({from: 0, to: w, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 }),
                                        ...easing.fast({from: w, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0 })
                                    ]

                                    let yShiftValues = easing.fast({ from: 0, to: yShiftToValues[y-yClamps[0]], steps: totalFrames, type: 'linear', round: 0 })

                                    let pixels = new Array(1+ w*2);
                                    let fromX = x - w;

                                    for(let i = 0; i < pixels.length; i++) {
                                        let row = data[y];
                                        if(!row)
                                            break;

                                        let c = row[fromX + i];
                                        if(c)
                                            pixels[i] = colors.rgbToHex(c);
                                    }

                                    if(el) 
                                    {
                                        pixels = el.pixels
                                    }

                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                            addHighlight: false,//addHighlight, //&& (w - widthValues[f]) <= 2, //&& widthValues[f] == w
                                            w: widthValues[f],
                                            yShift: yShiftValues[f]
                                        };
                                    }
                                
                                    return {
                                        y: targetY, x,
                                        pixels,
                                        frames
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            if(itemData.frames[f]){
                                                let {y,x,pixels} = itemData;
                                                let {w, yShift, addHighlight} = itemData.frames[f];
                                                let pixelIndex = fast.r(pixels.length/2) - w - 1; 
                                                let fromX = x - w;

                                                let totalWidth = 1 + w*2

                                                for(let i = 0;i < totalWidth; i++) {
                                                    if(pixels[pixelIndex+i])
                                                        hlp
                                                            .setFillColor(pixels[pixelIndex+i]) //('red')//
                                                            .dot(fromX+i, y);

                                                    if(addHighlight)
                                                        hlp.setFillColor(whiteColorPrefix + '0.05)').dot(fromX+i, y)
                                                }
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                let additionalData = [];

                                let x = 72
                                let clamps = [[166,170], [152,155]]
                                let pixelColors = ['rgba(106,62,34,0.5)', 'rgba(122,112,81,0.5)']

                                for(let i = 0; i < 10; i++) {

                                    let c = clamps[getRandomInt(0, clamps.length-1)];
                                    let y = getRandomInt(c);

                                    let w = getRandomInt(1,3);
                                    let pixelColor = pixelColors[getRandomInt(0, pixelColors.length-1)]
                                    additionalData.push({
                                        x, y,
                                        w: w,
                                        pixels: new Array(1 + w*2).fill(pixelColor)
                                    })
                                }


                                let imgData = getPixelsAsMatrix(this.parent.img, this.size);
                                this.frames = this.createReflectionFrames({ framesCount: 300, itemsCount: 5000, itemFrameslengthClamps: [100,100], data: imgData, yShiftClamps: [-2,2], maxWidth: 10, yClamps: [142, 199], size: this.size, additionalData })

                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.lightGlow = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createGlowFrames({framesCount, itemsCount, data, itemFrameslength, size}) {
                                let frames = [];
                                
                                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount-1);
                                    let totalFrames = itemFrameslength;
                                


                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                
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
                                
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                //
                            }
                        }))
                    }
                }))

                this.lakeDetails = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['lake'] })
                }))
            }
        }), 5)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground'] }),
            init() {
                //
            }
        }), 7)

        this.closeForest = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['close_forest', 'close_forest_d'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let shiftClamps = [-1, 1]
                        let pointsData = getPixels(this.parent.img, this.size).map(pd => {
                            return {
                                color: colors.rgbToHex(pd.color),
                                point: pd.position.add(V2.random(shiftClamps, shiftClamps))
                            }
                        });

                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [20,40], size: this.size, 
                            pointsData,
                            pdPredicate: () => getRandomInt(0,5) == 0
                         });

                         this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                         });
                    }
                }))

                this.treeAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let additionalFramesLength = 40;
                        this.frames = animationHelpers.createLayersAnimationFrames({
                            framesCount: 300, itemFrameslength: 90,  
                            startFramesClamps: [30, 120],
                            animationsModel: model, size: this.size,
                            //maxFrameIndex: 1,
                            // additional: {
                            //     framesShift: [30,60],
                            //     frameslength: additionalFramesLength,
                            //     framesIndiciesChange: [
                            //         ...easing.fast({ from: 0, to: 1, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 }),
                            //         ...easing.fast({ from: 1, to: 0, steps: additionalFramesLength/2, type: 'quad', method: 'inOut', round: 0 })
                            //     ]
                            // }, 
                            animationsModel: SolitudeScene.models.treeAnimations, size: this.size
                        })
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.overlay = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['forest_stability']})
                }))
            }
        }), 9)

        let circleImages = {};
        let cColors = [ '#3c3a40', '#2F2E33', '#232326' ]

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

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['house'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'house_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.smoke = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSmokeFrames({framesCount, itemsCount, color, shift, itemFrameslength, size}) {
                        let frames = [];
                        ///let colors = ['#3c3a40', '#2F2E33'];
                        let startPoint = new V2(82,83);
                        //let shift = [-4,4]

                        let originalPath = [new V2(82,83), new V2(84,73), new V2(88,62)]       //, new V2(90,53)
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                            let color = colors[0]//colors[getRandomInt(0, colors.length-1)]

                            // if(getRandomInt(0,5) == 0)
                            //     color = colors[1]

                            let path = originalPath.map((p, i) => (i > 0 && i < (originalPath.length-1)) ? p.add(new V2(getRandomInt(shift), getRandomInt(shift))) : p.clone() );

                            let sizeValues = [
                                ...easing.fast({from: 1, to: 3, steps: fast.r(totalFrames*2/4), type: 'quad', method: 'inOut', round: 0 }),
                                ...easing.fast({from: 3, to: 1, steps: fast.r(totalFrames*2/4), type: 'quad', method: 'inOut', round: 0 })
                            ]

                            let pathPoints = appSharedPP.curveByCornerPoints(path, 3);

                            let indices = easing.fast({from: 0, to: pathPoints.length-1, steps: totalFrames, type: 'linear', round: 0})

                            let frames = [];
                            let current = startPoint.clone();
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }

                                frames[frameIndex] = {
                                    s: sizeValues[f],
                                    p: pathPoints[indices[f]]
                                };
                            }
                        
                            return {
                                frames
                            }
                        })
                        
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {

                                //hlp.setFillColor(color).rect(startPoint.x-1, startPoint.y+1, 2,1);

                                let pData = [];
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];

                                    if(itemData.frames[f]){
                                        let img = circleImages[color][itemData.frames[f].s];
                                        let xShift = new V2();
                                        let s = itemData.frames[f].s;
                                        if(s > 0) {
                                            if(s > 1) {
                                                xShift = new V2(-s/2, -s/2).toInt();
                                            }

                                            if(img)
                                                ctx.drawImage(circleImages[color][s], itemData.frames[f].p.x + xShift.x, itemData.frames[f].p.y + xShift.y)
                                        }

                                        pData.push(itemData.frames[f].p)
                                        
                                    }
                                    
                                }

                                //new PP({ctx}).fillByCornerPoints(pData);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.smokeLayers = [
                            // {
                            //     framesCount: 300, itemsCount: 20, color: '#2F2E33', shift: [-2,5], itemFrameslength: [300,300], size: this.size
                            // },
                            // {
                            //     framesCount: 300, itemsCount: 20, color: '#232326', shift: [-5,2], itemFrameslength: [300,300], size: this.size
                            // },
                            
                            {
                                framesCount: 300, itemsCount: 60, color: '#3c3a40', shift: [-3,3], itemFrameslength: [300,300], size: this.size
                            }
                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createSmokeFrames(d).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.5;
                                ctx.drawImage(f, 0, 0)
                            })),
                            init() {
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        //this.parent.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        })))

                        // this.frames = this.createSmokeFrames({ framesCount: 300, itemsCount: 100, color: '#2F2E33',itemFrameslength: [300,300], size: this.size })
                        // .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.globalAlpha = 0.5;
                        //     ctx.drawImage(f, 0, 0)
                        // }));
                        // this.registerFramesDefaultTimer({
                        //     framesEndCallback: () => {
                        //         //this.parent.parentScene.capturing.stop = true;
                        //     }
                        // });
                    }
                }))
            }
        }), 11)
    }
}