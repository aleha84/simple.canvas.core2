class Lamp3Scene extends Scene {
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
                size: new V2(150,150),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lamp3',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => { hlp.setFillColor('black').dot(0,0) })
        }), 1)

        let gradientOrigin = new V2(75,48);
        let gradientDots = colors.createRadialGradient({ size: this.viewport.clone(), center: new V2(75,75), radius: new V2(90,70), gradientOrigin, angle: 0,
            setter: (dot, aValue) => {
                if(!dot.values){
                    dot.values = [];
                    dot.maxValue = aValue;
                }

                if(aValue > dot.maxValue)
                    dot.maxValue = aValue;

                dot.values.push(aValue);
            } })

        let framesCount = 300;
        let xChangeClamps = [0,0];
        let xValuesChange = [
            ...easing.fast({from: xChangeClamps[0], to: xChangeClamps[1], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0}),
            ...easing.fast({from: xChangeClamps[1], to: xChangeClamps[0], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0})
        ]

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(DraftsScene.models.lamp3, {exclude: ['bg']}),

            init() {
                this.img = PP.createImage(DraftsScene.models.lamp3, {exclude: ['bg', 'p', 'p2']});

                this.p0 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: framesCount, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(DraftsScene.models.lamp3.main.layers.find(l => l.name == 'p2')) });


                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.p1 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     createPFrames({framesCount, data, itemFrameslength, size}) {
                //         let frames = [];
                        
                //         let minX = data.reduce((prev,curr) => prev.point.x < curr.point.x ? prev : curr).point.x
                //         let maxX = data.reduce((prev,curr) => prev.point.x > curr.point.x ? prev : curr).point.x

                //         let deltaX = maxX - minX;
                //         let xChange = easing.fast({ from: 0, to: framesCount, steps: deltaX, type: 'linear', round: 0 })

                //         let itemsData = data.map((el, i) => {
                //             let startFrameIndex = xChange[el.point.x - minX] + getRandomInt(0, 30);
                //             let totalFrames = itemFrameslength;
                        
                //             let frames = [];
                //             for(let f = 0; f < totalFrames; f++){
                //                 let frameIndex = f + startFrameIndex;
                //                 if(frameIndex > (framesCount-1)){
                //                     frameIndex-=framesCount;
                //                 }
                        
                //                 frames[frameIndex] = true
                //             }
                        
                //             return {
                //                 pd: el,
                //                 frames
                //             }
                //         })
                        
                //         for(let f = 0; f < framesCount; f++){
                //             frames[f] = createCanvas(size, (ctx, size, hlp) => {
                //                 for(let p = 0; p < itemsData.length; p++){
                //                     let itemData = itemsData[p];
                                    
                //                     if(itemData.frames[f]){
                //                         hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                //                     }
                                    
                //                 }
                //             });
                //         }
                        
                //         return frames;
                //     },
                //     init() {
                //         // this.frames = animationHelpers.createMovementFrames({ framesCount: framesCount, itemFrameslength: 40, size: this.size, 
                //         //     pointsData: animationHelpers.extractPointData(DraftsScene.models.lamp3.main.layers.find(l => l.name == 'p')) });

                //         this.frames = this.createPFrames({ framesCount: 150, data : animationHelpers.extractPointData(DraftsScene.models.lamp3.main.layers.find(l => l.name == 'p')), 
                //         itemFrameslength: 30, size: this.size})

                //         // this.frames = [
                //         //     ...frames,
                //         //     ...frames.reverse()
                //         // ]

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

            }
        }), 10)

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size,
            angleClamps, xClamps, yClamps, lowerYClamps, color,pointsLengthClamps, maxA = 1, fadeInOut = true}) {
            let frames = [];
            let sharedPP = PP.createInstance();
            sharedPP.modifyContext = false;
            let bottomLine = createLine(new V2(-size.x, size.y+ pointsLengthClamps[1]), new V2(size.x*2, size.y+pointsLengthClamps[1]));
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(yClamps[0], yClamps[1]));
            
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));
            
                let linePoints = sharedPP.lineV2(point1, point2);
                let pointsLength = getRandomInt(pointsLengthClamps);
                let lowerY = getRandomInt(lowerYClamps);

                let startPoint = getRandomInt(0, linePoints.length - pointsLengthClamps[1])
                let to = startPoint+pointsLength;
                if(to > linePoints.length-1) {
                    to = linePoints.length-1;
                }

                let linePointsIndices = easing.fast({ from: startPoint, to: to, steps: totalFrames, type: 'linear', round: 0});
                let aValues = fadeInOut ? [
                    ...easing.fast({from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                    ...easing.fast({from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                ] : new Array(totalFrames).fill().map(() => 1);

                

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    let p = linePoints[linePointsIndices[f]];
            
                    frames[frameIndex] = {
                        p,
                        a: aValues[f] != undefined ? aValues[f] : 0
                    };
                }
            
                return {
                    lowerY,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { p, a } = itemData.frames[f];

                            if(p.y > itemData.lowerY)
                                continue;

                            let xShift = xValuesChange[f];

                            let _a = 0;
                            if(gradientDots[p.y] && gradientDots[p.y][p.x - xShift]){
                                _a = gradientDots[p.y][p.x - xShift].maxValue*maxA*a;
                            }

                            if(_a > 1){
                                _a = 1;
                            }
                            // let a = 0.1;
                            // let distance = fast.r(lCenter.distance(new V2(p)));
                            // if(distance < radius) {
                            //     a = opacityDistanceValues[distance];
                            // }

                            // ctx.globalAlpha = a;

                            hlp.setFillColor('rgba(234,189,118,'+ _a + ')').dot(p);

                            // ctx.globalAlpha = 1;
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let angleshift = 0;

        this.snow3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFrames({  framesCount, itemsCount: 5000, itemFrameslengthClamps: [120,150], size: this.size,
                    angleClamps: [-10,10].map(a => a+angleshift), xClamps: [0, this.size.x,], yClamps: [-30, -10], lowerYClamps: this.size.y,
                    pointsLengthClamps: [20, 30], maxA: 0.2})

                this.registerFramesDefaultTimer({});
            }
        }), 3)


        this.snow2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFrames({  framesCount, itemsCount: 1000, itemFrameslengthClamps: [90,130], size: this.size,
                    angleClamps: [-15,15].map(a => a+angleshift), xClamps: [0, this.size.x,], yClamps: [-30, -10], lowerYClamps: this.size.y,
                    pointsLengthClamps: [30, 40], maxA: 0.4})

                this.registerFramesDefaultTimer({});
            }
        }), 4)

        this.snow1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFrames({  framesCount, itemsCount: 300, itemFrameslengthClamps: [70,100], size: this.size,
                    angleClamps: [-15,15].map(a => a+angleshift), xClamps: [0, this.size.x,], yClamps: [-30, -10], lowerYClamps: this.size.y,
                    pointsLengthClamps: [30, 40], maxA: 0.75})

                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.snow0 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createSnowFrames({  framesCount, itemsCount: 100, itemFrameslengthClamps: [50,80], size: this.size,
                    angleClamps: [-15,15].map(a => a+angleshift), xClamps: [0, this.size.x,], yClamps: [-30, -10], lowerYClamps: this.size.y,
                    pointsLengthClamps: [40, 60], maxA: 1})

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        this.parentScene.capturing.stop = true; 
                    }
                });
            }
        }), 6)

        // this.snow0 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.frames = createSnowFrames({  framesCount, itemsCount: 20, itemFrameslengthClamps: [50,80], size: this.size,
        //             angleClamps: [-15,15].map(a => a+angleshift), xClamps: [50, this.size.x-50,], yClamps: [-30, -10], lowerYClamps: this.size.y,
        //             pointsLengthClamps: [30, 30], maxA: 2, fadeInOut: false})

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 11)
    }
}