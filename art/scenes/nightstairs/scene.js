class NightStairsScene extends Scene {
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
                fileNamePrefix: 'nightStairs',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0)
            })
        }), 1)

        let availableColors = [
            '#fafafa',
            '#dbdbdb',
            '#bcbcbc',
            '#7d7d7d',
            '#5e5e5e',
            '#3f3f3f',
            '#303030',
            '#202020',
            '#101010',
            '#000000'
        ]

        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size, gradientDots, xClamps, yClamps, lengthClamps, colorsIndexClamps, getColorShiftMax}) {
            let frames = [];
            
            //let colorsIndexClamps = [2, 9]
            // let colorToRadiusValues = easing.fast({
            //     from: 0, to: availableColors.length-1, steps: radiusClamps[1] - radiusClamps[0], type: 'linear', round: 0
            // })

            let getDotColor = (x,y) => {
                if(gradientDots[y] && gradientDots[y][x]) {
                    let coef = fast.r(gradientDots[y][x].maxValue*10)/10;
                    let ci = colorsIndexClamps[1] - fast.r((colorsIndexClamps[1] - colorsIndexClamps[0])*coef)

                    return availableColors[ci];
                }
                else {
                    return undefined;
                }
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let x = getRandomInt(xClamps);
                let y = yClamps[0] - lengthClamps[1] + getRandomInt(0, 10);
                let len = getRandomInt(lengthClamps);

                let getColorShift = new V2(getRandomInt(-getColorShiftMax,getColorShiftMax), getRandomInt(-getColorShiftMax,getColorShiftMax))

                let yValues = easing.fast({from: y, to: yClamps[1], steps: totalFrames, type: 'linear', round: 0})

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
                    x, len,
                    getColorShift,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            //let c = getDotColor(itemData.x, itemData.frames[f].y + 0);
                            for(let l = 0; l < itemData.len; l++) {
                                let c = getDotColor(itemData.x + itemData.getColorShift.x, itemData.frames[f].y + itemData.getColorShift.y + l);  
                                if(c != undefined) {
                                    hlp.setFillColor(c).dot(itemData.x, itemData.frames[f].y + l)
                                }
                                    
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(NightStairsScene.models.main, { renderOnly: ['main'] });

                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFrames({framesCount, itemsCount, itemFrameslengthClamps, size, zoneCorners, pixelDataMatrix}) {
                        let frames = [];
                        
                        let sharedPP = PP.createNonDrawingInstance();
                        let availablePoints = sharedPP.fillByCornerPoints(zoneCorners.map(p => new V2(p.point)));

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let p = availablePoints[getRandomInt(0, availablePoints.length-1)];
                            let pixelDataColor = undefined;
                            if(pixelDataMatrix[p.y] && pixelDataMatrix[p.y][p.x]) {
                                //let rgb = colors.rgbToString({value: pixelDataMatrix[p.y][p.x], isObject: false}).toLowerCase();
                                let hex = colors.colorTypeConverter({ value: pixelDataMatrix[p.y][p.x], fromType: 'rgb', toType: 'hex' })
                                let index = availableColors.indexOf(hex);
                                if(index != -1 && index != 0) {
                                    let newIndex = index - getRandomInt(1, 2);
                                    if(newIndex < 0) {
                                        newIndex = 0;
                                    }
                                    pixelDataColor = availableColors[newIndex];
                                }
                            }

                            let frames = [];
                            if(pixelDataColor) {
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        isVisible: true
                                    };
                                }
                            }
                            
                            return {
                                p,
                                pixelDataColor,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.pixelDataColor).dot(itemData.p)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let mainImagePixels = getPixelsAsMatrix(this.parent.img, this.size);
                        this.z0 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 5000, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z0')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }));

                        this.z1 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 500, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z1')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.z2 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 200, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z2')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.z3 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 300, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z3')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.z4 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z4')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.z5 = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: this.createDropsFrames({framesCount: 100, itemsCount: 200, itemFrameslengthClamps: [5, 15], size: this.size, 
                                zoneCorners: animationHelpers.extractPointData(NightStairsScene.models.main.main.layers.find(l => l.name == 'drops_z5')), 
                                pixelDataMatrix: mainImagePixels}),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.drop = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFrames({framesCount, data, itemFrameslength, size}) {
                        let frames = [];
                        let colorIndexValues = easing.fast({from: 0, to: availableColors.length-1, steps: itemFrameslength, type: 'expo', method: 'in', round: 0})
                        
                        let itemsData = data.map((el, i) => {
                            let startFrameIndex = el.startFrameIndex;
                            let totalFrames = itemFrameslength;
                        
                            let yValues = easing.fast({from: el.p.y, to: el.p.y + 40, steps: itemFrameslength, type: 'expo', method: 'in', round: 0})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    y: yValues[f],
                                    ci: colorIndexValues[f]
                                };
                            }
                        
                            return {
                                x: el.p.x,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(availableColors[itemData.frames[f].ci]).dot(itemData.x, itemData.frames[f].y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = [];

                        let startPoints = [{
                            p: new V2(91,50), startFrameIndex: 0
                        },
                        {
                            p: new V2(92,50), startFrameIndex: 70
                        }]

                        this.frames = this.createDropsFrames({framesCount: 100, data: startPoints, itemFrameslength: 50, size: this.size})
                        this.registerFramesDefaultTimer({});

                        
                    }
                }))

                // this.dark = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     isVisible: false,
                //     init() {
                //         this.img = PP.createImage(NightStairsScene.models.main, { renderOnly: ['dark_overlay'] });

                //         let visibleLength = 20;
                //         this.currentFrame = 0;
                //         let currentVisibleCounter = 0;
                //         this.timer = this.regTimerDefault(10, () => {
                //             if(this.isVisible && currentVisibleCounter > 0) {
                //                 currentVisibleCounter--;
                //                 if(currentVisibleCounter == 0) {
                //                     this.isVisible = false
                //                 }
                //             }
                //             else {
                //                 if(getRandomInt(0, 30) == 0) {
                //                     this.isVisible = true;
                //                     currentVisibleCounter = getRandomInt(5, 10)
                //                 }
                //             }
                //             this.currentFrame++;
                //             // if(this.currentFrame == 80) {
                //             //     this.isVisible = true;
                //             // }

                //             if(this.currentFrame == 200){
                //                 this.currentFrame = 0;
                //                 this.parent.parentScene.capturing.stop = true;
                //                 //this.isVisible = false;
                //             }
                //         })
                //     }
                // }))
            }
        }), 10)

        let setter = (dot, aValue) => {
            if(!dot.values){
                dot.values = [];
                dot.maxValue = aValue;
            }

            if(aValue > dot.maxValue)
                dot.maxValue = aValue;

            dot.values.push(aValue);
        };

        this.rain1 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(2,8)),
            size: this.viewport.clone(),
            init() {
                let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(95,65), radius: new V2(18,30), gradientOrigin: new V2(95,42), angle: 0,
                    setter : setter, easingType: 'quad', easingMethod: 'out'} )

                this.frames = createRainFrames({ framesCount: 100, itemsCount: 150, itemFrameslength: 25, size: this.size, 
                    gradientDots, xClamps: [77,112], yClamps: [21,93], lengthClamps: [10, 13], colorsIndexClamps: [2, 9], getColorShiftMax: 5 })

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue})`).dot(x,y)
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), 9)

        this.rain2 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,0)),
            size: this.viewport.clone(),
            init() {
                let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(124,80), radius: new V2(12,25), gradientOrigin: new V2(125,69), angle: 0,
                    setter : setter, easingType: 'quad', easingMethod: 'out'} )

                this.frames = createRainFrames({ framesCount: 100, itemsCount: 100, itemFrameslength: 20, size: this.size, 
                    gradientDots, xClamps: [112,133], yClamps: [55,95], lengthClamps: [9, 11], colorsIndexClamps: [5, 9], getColorShiftMax: 5 })

                this.registerFramesDefaultTimer({});
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue})`).dot(x,y)
                //                 }
                //             }
                //         }
                //     }
                // })
            }
        }), 7)
    }
}