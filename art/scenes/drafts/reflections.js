class ReflectionsScene extends Scene {
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
                size: new V2(108,192).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'reflections',
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
        const appSharedPP = PP.createNonDrawingInstance();

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#0D4255').rect(0,0,size.x, size.y)
                })
            }
        }), 1)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,0)),
            size: this.viewport.clone(),
            init() {
                let createCloudsFrames = function({framesCount, itemsCount, itemFrameslength, size}) {
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
                }

                let totalFrames = 300;

                let circleImages = {};
                let cColors = [ '#0D141A', '#F58958', '#7A5658', '#0D4255' ]

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

                this.l2 = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(110,73), new V2(-10,40)]

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#7A5658', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [4,10], sizeClamps: [4,8],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-4,-8], 
                            //createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData);
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l3_tr = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(110,85), new V2(-10,45)]

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#0D4255', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [4,10], sizeClamps: [4,8],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-4,-8], 
                            //createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(f,0,0)
                        }));
                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.l3 = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(110,90), new V2(-10,50)]

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#0D4255', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [4,10], sizeClamps: [4,8],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-4,-8], 
                            //createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData);
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l1 = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(110,145), new V2(54,82), new V2(-10,90)]

                        // let originalY = this.position.y;
                        // let yValues = [
                        //     ...easing.fast({from: originalY, to: originalY+20, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                        //     ...easing.fast({from: originalY+20, to: originalY, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        // ]

                        // let cf = 0
                        // this.position.y = yValues[cf]
                        
                        // this.timer2 = this.regTimerDefault(10, () => {
                        
                        //     this.position.y = yValues[cf]
                        //     this.needRecalcRenderProperties = true;
                        //     cf++;
                        //     if(cf == totalFrames){
                        //         cf = 0;
                        //     }
                        // })

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 300, itemFrameslength: totalFrames, color: '#F58958', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [8,15], sizeClamps: [4,12],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-15,-20], 
                            createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData);
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l4_t = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(50,115), new V2(30,95)]

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#7A5658', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [4,10], sizeClamps: [8,12],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-15,-20], 
                            //createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(f,0,0)
                        }));
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l4 = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let upperPoints = [new V2(40,110), new V2(-10,75)]

                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#7A5658', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [4,10], sizeClamps: [8,12],
                            initialProps: {
                                line: true, points: upperPoints,
                            }, yShiftClamps: [-15,-20], 
                            //createPoligon: { cornerPoints: [...upperPoints, new V2(0, this.size.y), new V2(this.size.x, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData);
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l0_t = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 500, itemFrameslength: totalFrames, color: '#0D141A', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,20], sizeClamps: [5,12],
                            initialProps: {
                                line: true, p1: new V2(110,150), p2: new V2(-10,100),
                            }, yShiftClamps: [-20,-30], 
                            //createPoligon: { cornerPoints: [new V2(0,105), new V2(this.size.x,156), new V2(this.size.x, this.size.y), new V2(0, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(f,0,0)
                        }));
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l0 = this.addChild(new GO({
                    position: new V2(0, 10),
                    size: this.size, 
                    init() {
                        let cloudData = {
                            framesCount: totalFrames, itemsCount: 500, itemFrameslength: totalFrames, color: '#0D141A', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,20], sizeClamps: [5,12],
                            initialProps: {
                                line: true, p1: new V2(110,156), p2: new V2(-10,105),
                            }, yShiftClamps: [-20,-30], 
                            createPoligon: { cornerPoints: [new V2(0,105), new V2(this.size.x,156), new V2(this.size.x, this.size.y), new V2(0, this.size.y)] },
                            circleImages
                        };

                        this.frames = animationHelpers.createCloudsFrames(cloudData);
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 3)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let blackColor = '#0D141A';
                let centerX = fast.r(this.size.x/2);
                    
                let wallMainColor = '#635C49';
                let wallDarkColor = '#2A322D'
                let wallDarkColor2 =  'rgba(0,0,0,0.15)' //'#57523F';
                let darkEffectsColor = 'rgba(0,0,0,0.05)';
                let windowFrameColor = '#BBAB9C';
                let centralVLineSeparatorColor = '#95795C'
                let vLinesColor = '#857B64';

                let windowFrameTopShift = 28;

                let hLineHeight = 16;
                let hLineTopShift = 8;
                let hLineGapHeight = 16;

                let vLinesWidth = 2;
                let vLinesGapWidth = 11;

                let separatorVLineWidth = 6

                

                let l0Img = createCanvas(this.size, (ctx, size, hlp) => {
                    

                    for(let i = 0; i <4; i++) {
                        hlp.setFillColor(windowFrameColor)
                            .rect(centerX-separatorVLineWidth/2 - 1 - (vLinesGapWidth+vLinesWidth)*i, 0, 1, size.y)
                            .rect(centerX-separatorVLineWidth/2 - vLinesGapWidth - (vLinesGapWidth+vLinesWidth)*i, 0, 1, size.y)
                            .rect(centerX+separatorVLineWidth/2 + (vLinesGapWidth+vLinesWidth)*i, 0,1, size.y)
                            .rect(centerX+separatorVLineWidth/2 + vLinesGapWidth -1 + (vLinesGapWidth+vLinesWidth)*i, 0,1, size.y)
                    }

                   
                })

                let restrictedZones = [];
                
                let l1Img = createCanvas(this.size, (ctx, size, hlp) => {
                    

                    for(let i = 0; i <4; i++) {
                        hlp.setFillColor(windowFrameColor)
                            .rect(centerX-separatorVLineWidth/2 - 1 - (vLinesGapWidth+vLinesWidth)*i, 0, 1, size.y)
                            .rect(centerX-separatorVLineWidth/2 - vLinesGapWidth - (vLinesGapWidth+vLinesWidth)*i, 0, 1, size.y)
                            .rect(centerX+separatorVLineWidth/2 + (vLinesGapWidth+vLinesWidth)*i, 0,1, size.y)
                            .rect(centerX+separatorVLineWidth/2 + vLinesGapWidth -1 + (vLinesGapWidth+vLinesWidth)*i, 0,1, size.y)

                        for(let j = 0; j < 50; j++) {
                            let h = getRandomInt(1,3);
                            hlp.setFillColor(darkEffectsColor)
                                .rect(centerX-separatorVLineWidth/2 - 1 - (vLinesGapWidth+vLinesWidth)*i, getRandomInt(0,size.y), 1, h)
                                .rect(centerX-separatorVLineWidth/2 - vLinesGapWidth - (vLinesGapWidth+vLinesWidth)*i, getRandomInt(0,size.y), 1, h)
                                .rect(centerX+separatorVLineWidth/2 + (vLinesGapWidth+vLinesWidth)*i, getRandomInt(0,size.y), 1, h)
                                .rect(centerX+separatorVLineWidth/2 + vLinesGapWidth -1 + (vLinesGapWidth+vLinesWidth)*i, getRandomInt(0,size.y), 1, h)
                        }
                    }

                    // let pp1 = new PP({ctx});
                    for(let i = 0; i < 6; i++) {
                        let curY = hLineTopShift + i*(hLineHeight+hLineGapHeight);
                        hlp.setFillColor(wallMainColor).rect(0, curY, size.x, hLineHeight)

                        // pp1.setFillColor('red');
                        restrictedZones = [...restrictedZones ,...appSharedPP.fillByCornerPoints([new V2(0, curY+hLineHeight), new V2(size.x, curY+hLineHeight)
                            , new V2(size.x, curY+hLineHeight+hLineGapHeight), new V2(0, curY+hLineHeight+hLineGapHeight)])]
                        
                        for(let j = 0; j < 500; j++) {
                            let x = getRandomInt(0, size.x);
                            let y = getRandomInt(curY, curY+hLineHeight);
                            let w = getRandomInt(1,3);

                            hlp.setFillColor(darkEffectsColor).rect(x,y,w,1 )
                        }

                        for(let j = 0; j <4; j++) {
                            hlp.setFillColor(wallDarkColor2)
                                .rect(
                                    centerX - separatorVLineWidth/2 - vLinesGapWidth - vLinesWidth + 2 - (vLinesGapWidth + vLinesWidth)*j, 
                                    hLineTopShift + i*(hLineHeight+hLineGapHeight), 
                                    1, hLineHeight)
                                .rect(
                                    centerX + separatorVLineWidth/2 + (vLinesGapWidth + vLinesWidth)*j, 
                                    hLineTopShift + i*(hLineHeight+hLineGapHeight), 
                                    1, hLineHeight)

                        }

                        hlp.clear(0, hLineTopShift + hLineHeight + i*(hLineHeight+hLineGapHeight), size.x, 4)

                        hlp.setFillColor(windowFrameColor)
                            .rect(0, (hLineTopShift) + i*(hLineHeight+hLineGapHeight), size.x, 1)
                            .rect(0, (windowFrameTopShift) + i*(hLineHeight+hLineGapHeight), size.x, 1)

                        for(let j = 0; j < 50; j++) {
                            let w = getRandomInt(1,3);
                            hlp.setFillColor(darkEffectsColor)
                                .rect(getRandomInt(0,size.x), (hLineTopShift) + i*(hLineHeight+hLineGapHeight), w, 1)
                                .rect(getRandomInt(0,size.x), (windowFrameTopShift) + i*(hLineHeight+hLineGapHeight), w, 1)
                        }

                        hlp.setFillColor(wallDarkColor)
                            .rect(0, (hLineTopShift+1) + i*(hLineHeight+hLineGapHeight), size.x, 1)
                            .rect(0, (hLineTopShift+hLineHeight-1) + i*(hLineHeight+hLineGapHeight), size.x, 1)
                        hlp.setFillColor('rgba(0,0,0,0.15)')
                            //.rect(0, (hLineTopShift+1) + i*(hLineHeight+hLineGapHeight), size.x, 1)
                            .rect(0, (hLineTopShift+hLineHeight-1) + 1 + i*(hLineHeight+hLineGapHeight), size.x, 1)

                    }

                    hlp.setFillColor(centralVLineSeparatorColor).rect(centerX-3, 0, separatorVLineWidth, size.y)
                    hlp.setFillColor(blackColor).rect(centerX-1, 0, 2, size.y)

                    for(let i = 0; i < 300; i++) {
                        let x = getRandomInt(centerX-3, centerX - 3 + separatorVLineWidth - 1);
                        let y = getRandomInt(0, size.y);
                        let h = getRandomInt(1,6);

                        hlp.setFillColor(darkEffectsColor).rect(x,y,1,h);
                    }

                    for(let i = 0; i <4; i++) {
                        hlp.setFillColor(vLinesColor)
                            .rect(centerX - separatorVLineWidth/2 - vLinesGapWidth - vLinesWidth - (vLinesGapWidth + vLinesWidth)*i, 0, vLinesWidth, size.y)
                            .rect(centerX + separatorVLineWidth/2 + vLinesGapWidth + (vLinesGapWidth + vLinesWidth)*i, 0, vLinesWidth, size.y)
                    }
                })

                let aValues = easing.fast({from: 0, to: 1, steps: 100, type: 'linear', round: 2})
                let paramsDivider = 10;
                
                let pn = new mathUtils.Perlin('random seed ' + (getRandom(0,1000)));
                let colorRgbPrefix = 'rgba(0,0,0,';
                let time = getRandom(0,5);

                let l2Img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < size.y; y++){
                        for(let x = 0; x < size.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);

                            noise = fast.r(noise/10)*10

                            let a = aValues[noise];

                            hlp.setFillColor(colorRgbPrefix + a).dot(x,y);
                        }
                    }
                })

                pn = new mathUtils.Perlin('random seed ' + (getRandom(0,1000)));
                time = getRandom(0,5);
                colorRgbPrefix = 'rgba(120,98,74,';
                let l3Img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < size.y; y++){
                        for(let x = 0; x < size.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);

                            noise = fast.r(noise/10)*10

                            let a = aValues[noise];

                            hlp.setFillColor(colorRgbPrefix + a).dot(x,y);
                        }
                    }
                })

                let l4Img = createCanvas(this.size, (ctx, size, hlp) => {
                    let steps = 6;
                    let aValues = easing.fast({from: 0, to: 0.5, steps: steps+1, type: 'quad', method: 'in', round: 2});
                    let stepHeight = fast.r(size.y/steps);

                    let pp = new PP({ctx});

                    let data = [];

                    for(let i = 0; i < steps+1; i++) {
                        pp.setFillColor('rgba(0,0,0,' + aValues[i]);
                        pp.fillByCornerPoints([
                            new V2(0, stepHeight*(i-1)), 
                            new V2(size.x, stepHeight*i), 
                            new V2(size.x, stepHeight*(i+1) - 1), 
                            new V2(0, stepHeight*i - 1)])

                        if(i < steps) {
                            data.push({
                                c2: 'rgba(0,0,0,' + aValues[i],
                                c1: 'rgba(0,0,0,' + aValues[i+1],
                                dividerPoints: appSharedPP.lineV2(new V2(0, stepHeight*i - 1), new V2(size.x, stepHeight*(i+1) - 1)),
                                rv: [8,6,3,2]
                            })
                        }
                    }

                    let affectedDots = [];
                    colorsHelpers.createDithering({ data, hlp, xClamps: [0,size.x], rValues: [4,2,0,0].map(x => x*1), sharedPP: appSharedPP , 
                        affectedDots, doNotPutDots: true, preventDuplicates: true, restrictedZones })
                    let excludeImg = createCanvas(this.size, (ctx, _size, hlp) => {
                        hlp.setFillColor('red')
                        affectedDots.forEach(d => {
                            hlp.dot(d.p)
                        })
                    });
                    ctx.globalCompositeOperation = 'destination-out'
                    ctx.drawImage(excludeImg,0,0);
                    
                    ctx.globalCompositeOperation = 'source-over'
                    colorsHelpers.createDithering({ data, hlp, xClamps: [0,size.x], rValues: [4,2,0,0].map(x => x*1), sharedPP: appSharedPP, 
                        preventDuplicates: true, restrictedZones })

                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.75
                    ctx.drawImage(l0Img, 0, 0)

                    ctx.globalAlpha = 1
                    ctx.drawImage(l1Img, 0, 0)

                    
                    ctx.globalCompositeOperation = 'source-atop'
                    ctx.globalAlpha = 0.3
                    ctx.drawImage(l3Img, 0, 0)

                    ctx.globalAlpha = 0.3
                    ctx.drawImage(l2Img, 0, 0)

                    ctx.globalAlpha = 0.75
                    ctx.drawImage(l4Img, 0, 0)
                })
            }
        }), 5)

        this.zanaveska = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0,-63)),
            size: this.viewport.clone(),
            init() {
                return; 
                // this.windowBlink = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let totalFrames = 10

                        

                        

                //         let excludeMask = createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('red').rect(85,92, 8, 11)
                //         })

                //         //let xValues = easing.fast({from: 0, to: 15, steps: totalFrames, type: 'linear', round: 0});

                //         let aValues = [
                //             ...easing.fast({from: 0, to: 0.5, steps: totalFrames/2, type: 'linear', round: 2}),
                //             ...easing.fast({from: 0.5, to: 0, steps: totalFrames/2, type: 'linear', round: 2})
                //         ]

                //         // let blinkImages = aValues.map(a => createCanvas(this.size, (ctx, size, hlp) => {
                //         //     hlp.setFillColor('rgba(255,255,255,'+ a).rect(85,92, 8, 11)
                //         // }))
                        

                //         let mainFrames = aValues.map((a, i) => createCanvas(this.size, (ctx, size, hlp) => {

                //             hlp.setFillColor('rgba(255,255,255,'+ a).rect(84,92, 9, 11)
                //             //ctx.drawImage(blinkImages[i], x, 0)

                //             // ctx.globalCompositeOperation = 'destination-in'
                //             // ctx.drawImage(excludeMask, 0, 0)
                //         }))

                //         this.frames = [
                //             ...mainFrames,
                //             //...new Array(80).fill(openedWindowImages[totalFrames-1]),
                //             //...mainFrames.reverse(),    
                //             ...new Array(290).fill(undefined),
                //         ]

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                let verticalPointsCount = 15;
                let angle = [50, 70];
                let verticalLength = [35,40];

                let vPointYShift = verticalLength.map((vl, i) => easing.fast({from: 0, to: verticalLength[i], steps: verticalPointsCount, type: 'linear', round: 0}))
                //easing.fast({from: 0, to: verticalLength, steps: verticalPointsCount, type: 'linear', round: 0});
                let angleToVerticalLength = easing.fast({from: 0, to: 270, steps: verticalPointsCount, type: 'linear'}).map(a => degreeToRadians(a));
                let mulToVerticalLength = easing.fast({from: 0, to: 5, steps: verticalPointsCount, type: 'quad', method: 'in', round: 2});

                let totalFrames = 100;
                let angleToFramesCount = [
                    ...easing.fast({from: 0, to: 180, steps: totalFrames/2, type: 'linear', method: 'base'}).map(a => degreeToRadians(a)),
                    ...easing.fast({from: 181, to: 360, steps: totalFrames/2, type: 'linear', method: 'base'}).map(a => degreeToRadians(a))
                ]
                //easing.fast({from: 0, to: 360, steps: totalFrames, type: 'linear'}).map(a => degreeToRadians(a));
                
                let topLeft = [new V2(88,88), new V2(88+15, 95)];

                let excludeMask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').rect(83,88, 40, 16)
                    //.rect(topLeft[0].x, topLeft[0].y, topLeft[1].x-topLeft[0].x + 1, 17)
                })

                let fun = (x,mul, t) => fast.r(Math.sin(x - t)*mul);

                let createLinePoints = (topLeft, vPointYShift, angle, t) => {
                    let points = []
                    for(let i = 0; i < verticalPointsCount; i++) {
                        let yShift = vPointYShift[i];
                        let funAngleValue = angleToVerticalLength[i];
                        let mul = mulToVerticalLength[i];

                        let p = new V2(fun(funAngleValue, mul, t), yShift).rotate(angle).add(topLeft)
                        points.push(p);
                    }

                    return points;
                }

                this.frames = []
                for(let f = 0; f < totalFrames; f++) {
                    let t = angleToFramesCount[f];

                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        let points = [
                            ...createLinePoints(topLeft[0], vPointYShift[0], angle[0], t),
                            // new V2(
                            //     fun(
                            //         angleToVerticalLength[verticalPointsCount-1], 
                            //         mulToVerticalLength[verticalPointsCount-1], 
                            //         t+0.2
                            //     ), vPointYShift[0][verticalPointsCount-1]*1.2).rotate(65).add(new V2(88+5,92)),
                            // new V2(
                            //     fun(
                            //         angleToVerticalLength[verticalPointsCount-1], 
                            //         mulToVerticalLength[verticalPointsCount-1], 
                            //         t-0.2
                            //     ), vPointYShift[1][verticalPointsCount-1]).rotate(48).add(new V2(53,88)),
                            ...createLinePoints(topLeft[1], vPointYShift[1], angle[1], t+0.3).reverse()
                        ];

                        
                        ctx.globalAlpha = 0.35

                        ctx.drawImage(createCanvas(this.size, (ctx, _size, hlp) => {
                            let pp = new PP({ctx});
                            pp.setFillStyle('rgba(255,255,255,1')
                            pp.fillByCornerPoints(points);

                            // hlp.setFillColor('red');
                            // points.forEach(p => hlp.dot(p.toInt()))
                        }), 0, 0)

                        //console.log(points);
                        ctx.globalAlpha = 1
                        
                        ctx.globalCompositeOperation = 'destination-out'
                        ctx.drawImage(excludeMask, 0, 0)
                    })
                }

                // this.frames = [
                // ]

                // let fValues = easing.fast({from: 0, to: totalFrames/4, steps: 25, type: 'linear', method: 'base', round: 0});
                // for(let f = 0; f < 25;f++) {
                //     this.frames.push(this.frames1[fValues[f]]);
                // }

                // for(let f = 0; f < 25;f++) {
                //     this.frames.push(this.frames1[fValues[25-f]]);
                // }

                // this.frames = [
                //     ...this.frames,
                //     ...this.frames1
                // ]

                this.registerFramesDefaultTimer({});
            }
        }), 6)
        
    }
}