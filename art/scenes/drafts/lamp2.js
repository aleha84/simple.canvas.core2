class Lamp2Scene extends Scene {
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
                size: new V2(1500,1500),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lamp2',
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
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            }),
            init() {
                // this.shine = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let frames = [];
                //         for(let f = 0; f < 4; f++) {
                //             let gradientDots = colors.createRadialGradient({ size: new V2(80,80), center: new V2(75,48), radius: new V2(15+f,15+f), gradientOrigin: new V2(75,48),
                //                 angle: 0 })
        
                //                 frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 for(let y = 0; y < gradientDots.length; y++){
                //                     let row = gradientDots[y];
                //                     if(!row)
                //                         continue;
                    
                //                     for(let x = 0; x < row.length; x++){
                //                         if(!row[x])
                //                             continue;
                    
                //                         if(row[x].length == 0)
                //                             continue;
                    
                //                         let a =  row[x].values.reduce((a,b) => a+b,0)/row[x].values.length  //Math.max(...row[x].values);
                    
                //                         if(a < 0)
                //                             a  = 0;

                //                         a = fast.r(a, 1);
                //                         if(row[x].maxValue == undefined)
                //                             row[x].maxValue = a;
                                        
                //                         hlp.setFillColor(`rgba(198,118,30,${a})`).dot(new V2(x, y))
                //                     }
                //                 }
                //             })
                //         }
                        
                //         let frameChangeClamps = [6,7]
                //         let frameChangeDelay = getRandomInt(frameChangeClamps) ;
                
                //         let animationRepeatDelayOrigin = 0;
                //         let animationRepeatDelay = animationRepeatDelayOrigin;
                //         this.img = frames[getRandomInt(0, frames.length-1)]
                        
                //         this.timer = this.regTimerDefault(10, () => {
                //             animationRepeatDelay--;
                //             if(animationRepeatDelay > 0)
                //                 return;
                        
                //             frameChangeDelay--;
                //             if(frameChangeDelay > 0)
                //                 return;
                        
                //             frameChangeDelay = getRandomInt(frameChangeClamps);
                        
                //             this.img = frames[getRandomInt(0, frames.length-1)]
                //             this.currentFrame++;
                //             if(this.currentFrame == frames.length){
                //                 this.currentFrame = 0;
                //                 animationRepeatDelay = animationRepeatDelayOrigin;
                //             }
                //         })

                //         let totalFrames = 150
                //         let xShiftValues = [
                //             ...easing.fast({from: -1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                //             ...easing.fast({from: 0, to: -1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                //         ]

                //         this.currentFrame1 = 0;
                //         this.position.x = xShiftValues[this.currentFrame1]

                //         this.timer2 = this.regTimerDefault(10, () => {
                //             this.currentFrame1++;
                //             if(this.currentFrame1 == totalFrames){
                //                 this.currentFrame1 = 0;
                //             }

                //             this.position.x = xShiftValues[this.currentFrame1];
                //             this.needRecalcRenderProperties = true;
                //         })
                //         //console.log(gradientData);
                //     }
                // }))
            }
        }), 1)

        let gradientOrigin = new V2(75,48);
        let gradientDots = colors.createRadialGradient({ size: this.viewport.clone(), center: new V2(75,68), radius: new V2(90,70), gradientOrigin, angle: 0,
            setter: (dot, aValue) => {
                if(!dot.values){
                    dot.values = [];
                    dot.maxValue = aValue;
                }

                if(aValue > dot.maxValue)
                    dot.maxValue = aValue;

                dot.values.push(aValue);
            } })


        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size, rgb, angleClamps, tails, maxA, xCLamps}) {
            let frames = [];
            maxA+=0.1
            let sharedPP = PP.createInstance();

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = fast.r(getRandomInt(itemFrameslength)*1.25);
            
                if(!xCLamps)
                    xCLamps = [-size.x/2, size.x*1.5];

                let p1 = new V2(
                    getRandomInt(xCLamps),
                    getRandomInt(-size.y/2, -size.y/4)
                )

                let bottomLine = createLine(new V2(-size.x*3, size.y), new V2(size.y*4, size.y));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let p2 = raySegmentIntersectionVector2(p1, direction, bottomLine);

                let linePoints = sharedPP.lineV2(p1, p2);

                let lineIndexChange = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});
                let backTailLength = getRandomInt(tails.back);
                let frontTailLength = getRandomInt(tails.front);
                let backTailAValues = easing.fast({from: 1, to: 0, steps: backTailLength, type: 'quad', method: 'out', round: 2 });
                let frontTailAValues = easing.fast({from: 1, to: 0, steps: backTailLength, type: 'quad', method: 'out', round: 2 });

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: lineIndexChange[f],
                    };
                }
            
                return {
                    linePoints,
                    backTailLength,
                    frontTailLength,
                    backTailAValues,
                    frontTailAValues,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            
                            let index = itemData.frames[f].index;

                            let prev = undefined;
                            for(let i = 0; i < itemData.backTailLength; i++) {

                                let _index = index - i;
                                if(_index < 0)
                                    break;

                                let p = itemData.linePoints[_index];

                                let a = 0;
                                if(gradientDots[p.y] && gradientDots[p.y][p.x]){
                                    a = gradientDots[p.y][p.x].maxValue*maxA;
                                }

                                a*= itemData.backTailAValues[i];

                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a,3)})`).dot(p);

                                if(prev && prev.x != p.x) {
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(prev.x, p.y);
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(p.x, prev.y);
                                }

                                prev = p;
                            }
                            
                            prev = undefined;
                            for(let i = 1; i < itemData.frontTailLength; i++) {

                                let _index = index + i;
                                if(_index == itemData.linePoints.length)
                                    break;

                                let p = itemData.linePoints[_index];

                                let a = 0;

                                if(p == undefined)
                                    debugger;

                                if(gradientDots[p.y] && gradientDots[p.y][p.x]){
                                    a = gradientDots[p.y][p.x].maxValue*maxA;
                                }

                                a*= itemData.frontTailAValues[i];

                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a,3)})`).dot(p);

                                if(prev && prev.x != p.x) {
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(prev.x, p.y);
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(p.x, prev.y);
                                }

                                prev = p;
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(DraftsScene.models.lamp2, {renderOnly: ['lamp']}),
            createDropsFrames({framesCount, itemsCount, itemFrameslengthPart1, itemFrameslengthPart2, size, maxA}) {
                let frames = [];
                
                let dropsStartPositions = [new V2(75,56), new V2(74, 56),  new V2(76,56), new V2(78,55), new V2(72,55)];
                let startFrameIndicies = [20, 50, 100, 130, 70];
                let part1Length = itemFrameslengthPart1;
                let part2Length = itemFrameslengthPart2;
                //let totalFrames = itemFrameslengthPart1 + itemFrameslengthPart2

                let part1Alpha = easing.fast({from: 0, to: maxA, steps: part1Length, type: 'linear', round: 3})
                let part2YChange = easing.fast({from: 56, to: size.y, steps: part2Length, type: 'expo', method: 'in', round: 0})

                let itemsData = dropsStartPositions.map((el, i) => {
                    let startFrameIndex = startFrameIndicies[i];
                    //let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < part1Length; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: el,
                            a: part1Alpha[f]
                        };
                    }

                    for(let f = 0; f < part2Length; f++){
                        let frameIndex = f + startFrameIndex + part1Length;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: new V2(el.x, part2YChange[f]),
                            a: maxA
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
                                let {a, p} = itemData.frames[f];
                                
                                let _a = 0;
                                if(gradientDots[p.y] && gradientDots[p.y][p.x]){
                                    _a = gradientDots[p.y][p.x].maxValue*maxA;
                                }

                                a*= _a;

                                hlp.setFillColor(`rgba(234,189,118,${fast.r(a,3)})`).dot(p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let sharedPP = PP.createInstance();

                let totalFrames = 150
                let xShiftValues = [
                    ...easing.fast({from: -1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                    ...easing.fast({from: 0, to: -1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                ]

                this.frames = [];
                let baseImg = PP.createImage(DraftsScene.models.lamp2, {renderOnly: ['lamp']});
                let dropFrames = this.createDropsFrames({ framesCount: totalFrames, itemFrameslengthPart1: 50, itemFrameslengthPart2: 50, size: this.size, maxA: 0.8 })

                let splashesBackFrames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: 30, pointsData:
                    sharedPP.fillByCornerPoints(
                        animationHelpers.extractPointData(DraftsScene.models.lamp2.main.layers.find(l => l.name == 'splashes_area')).map(p => new V2(p.point))
                    )
                    .map(p => ({ 
                        point: new V2(p), 
                        color: 'rgba(246,236,202,' + fast.r(getRandom(0.05, 0.2), 2) + ')'
                     })),
                     size: this.size, pdPredicate: () => getRandomInt(0,1) == 0});

                    let splashesFrontFrames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: 30, pointsData:
                    sharedPP.fillByCornerPoints(
                        animationHelpers.extractPointData(DraftsScene.models.lamp2.main.layers.find(l => l.name == 'splashes_area')).map(p => new V2(p.point))
                    )
                    .map(p => ({ 
                        point: new V2(p), 
                        color: 'rgba(246,236,202,' + fast.r(getRandom(0.3, 0.5), 2) + ')'
                        })),
                        size: this.size, pdPredicate: () => getRandomInt(0,4) == 0});


                // let lData = [{ name: 'l1', totalFrames: 140, startFrameIndex: 50 },
                // { name: 'l2', totalFrames: 130, startFrameIndex: 100 },
                // { name: 'l3', totalFrames: 150, startFrameIndex: 10 },
                // { name: 'l4', totalFrames: 130, startFrameIndex: 70 }]
                // let lFrames = lData.map(ld => {
                //     let l1 = animationHelpers.extractPointData(DraftsScene.models.lamp2.main.layers.find(l => l.name == ld.name)).map(p => new V2(p.point));
                //     let l1TotalFrames = ld.totalFrames;
                //     let l1IndexChange = easing.fast({from: 0, to: l1.length, steps: l1TotalFrames, type: 'linear', round: 0});
                //     let l1Frames = [];
                //     for(let f = 0; f < l1TotalFrames; f++) {

                //         let frameIndex = f + ld.startFrameIndex;
                //         if(frameIndex > (totalFrames-1)){
                //             frameIndex-=totalFrames;
                //         }

                //         l1Frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('rgba(238,205,137,0.5)').dot(l1[l1IndexChange[f]])
                //         })
                //     }

                //     return l1Frames;
                // })



                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(baseImg, 0, 0);
                        ctx.drawImage(dropFrames[f], 0, 0);
                        ctx.drawImage(splashesBackFrames[f], 0, 0);
                        //ctx.drawImage(splashesFrontFrames[f], 0, 0);

                        // for(let l = 0; l< lFrames.length; l++) {
                        //     if(lFrames[l][f]) {
                        //         ctx.drawImage(lFrames[l][f], 0, 0);
                        //     }
                        // }
                        
                    })
                }

                //this.registerFramesDefaultTimer({});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                this.position.x = this.parentScene.sceneCenter.x + xShiftValues[this.currentFrame]

                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.position.x = this.parentScene.sceneCenter.x + xShiftValues[this.currentFrame];
                    this.img = this.frames[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })

            }
        }), 10)

        this.backRain0 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 1000, itemFrameslength: [22,33], size: this.size, 
                    rgb: { r: 224, g: 174, b: 71 }, angleClamps: [13,-13], tails: { back: [12,16], front: [3, 5] }, maxA: 0.15 })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }

                });
            }
        }), 3)

        this.backRain1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 700, itemFrameslength: [20,30], size: this.size, 
                    rgb: { r: 224, g: 174, b: 71 }, angleClamps: [15,-15], tails: { back: [15,20], front: [4, 6] }, maxA: 0.2 })

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }

                });
            }
        }), 4)

        this.backRain2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 400, itemFrameslength: [17,26], size: this.size, 
                    rgb: { r: 224, g: 174, b: 71 }, angleClamps: [15,-15], tails: { back: [18,23], front: [5, 7] }, maxA: 0.25  })

                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.backRain3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 300, itemFrameslength: [15,24], size: this.size, 
                    rgb: { r: 224, g: 174, b: 71 }, angleClamps: [15,-15], tails: { back: [18,24], front: [6, 9] }, maxA: 0.35  })

                this.registerFramesDefaultTimer({});
            }
        }), 6)

        this.backRain4 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 300, itemsCount: 200, itemFrameslength: [13,22], size: this.size, 
                    rgb: { r: 224, g: 174, b: 71 }, angleClamps: [15,-15], tails: { back: [20,25], front: [6, 9] }, maxA: 0.45  })

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        this.parentScene.capturing.stop = true; 
                    }
                });
            }
        }), 7)

    }
}