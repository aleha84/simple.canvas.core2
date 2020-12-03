class Demo10PortalScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'portal'
            },
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#12171f').rect(0,0,size.x, size.y);
                })
            }
        }), 0)


        let model = Demo10PortalScene.models.main;

        this.createFogMovementFrames = function({framesCount, size, direction, img}) {
            let frames = [];
            
            let xValues = easing.fast({ from: 0, to: size.x*direction, steps: framesCount, type: 'linear', round: 0});
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let x = xValues[f];
                    ctx.drawImage(img, x, 0);
                    ctx.drawImage(img, direction > 0 ? x-size.x: size.x+x, 0)
                });
            }
            
            return frames;
        }

        this.createFogMovement2Frames = function({startPoints, framesCount, itemsCount, itemFrameslength, size, lowerY, color, yShiftClamps}) {
            let frames = [];
            let circleImages = [
                //PP.createImage(Demo10PortalScene.models.circles[4], { colorsSubstitutions: { '#FF0000': { color, changeFillColor: true } } }),
                PP.createImage(Demo10PortalScene.models.circles[6], { colorsSubstitutions: { '#FF0000': { color, changeFillColor: true } } })
            ]

            let circleImages2 = [
                PP.createImage(Demo10PortalScene.models.circles[4], { colorsSubstitutions: { '#FF0000': { color: '#989E56', changeFillColor: true } } }),
                //PP.createImage(Demo10PortalScene.models.circles[6], { colorsSubstitutions: { '#FF0000': { color, changeFillColor: true } } })
            ]

            
            
            let commonImg = createCanvas(size, (ctx, size, hlp) => {
                hlp.setFillColor(color);

                startPoints.forEach(sp => {
                    hlp.rect(sp.x, sp.y, 1, lowerY - sp.y)    
                });
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let img = circleImages[getRandomInt(0, circleImages.length-1)];
                let startPoint = startPoints[getRandomInt(0, startPoints.length-1)].add(new V2(0, getRandomInt(-2,10)));
                let xValues = easing.fast({from: startPoint.x, to: startPoint.x-(getRandomInt(10,20)),steps: totalFrames, type: 'linear', method: 'base', round: 0})
                let maxYShift = getRandomInt(yShiftClamps[0], yShiftClamps[1])//-getRandomInt(5,10);
                let yValues = [
                    ...easing.fast({from: startPoint.y, to: startPoint.y+maxYShift,steps: totalFrames/2, type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: startPoint.y+maxYShift, to: startPoint.y+10,steps: totalFrames/2, type: 'quad', method: 'in', round: 0})
                ]

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        x: xValues[f],
                        y: yValues[f]
                    };
                }
            
                return {
                    img,
                    frames
                }
            })

            let items2Data = new Array(itemsCount*2).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let img = circleImages2[getRandomInt(0, circleImages2.length-1)];
                let startPoint = startPoints[getRandomInt(0, startPoints.length-1)].add(new V2(0, getRandomInt(3,10)));
                let xValues = easing.fast({from: startPoint.x, to: startPoint.x-(getRandomInt(10,20)),steps: totalFrames, type: 'linear', method: 'base', round: 0})
                let maxYShift = getRandomInt(yShiftClamps[0], yShiftClamps[1])//-getRandomInt(5,10);
                let yValues = [
                    ...easing.fast({from: startPoint.y, to: startPoint.y+maxYShift,steps: totalFrames/2, type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: startPoint.y+maxYShift, to: startPoint.y,steps: totalFrames/2, type: 'quad', method: 'in', round: 0})
                ]

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        x: xValues[f],
                        y: yValues[f]
                    };
                }
            
                return {
                    img,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    ctx.drawImage(commonImg, 0,0);
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(itemData.img, itemData.frames[f].x, itemData.frames[f].y)
                        }
                        
                    }

                    for(let p = 0; p < items2Data.length; p++){
                        let itemData = items2Data[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(itemData.img, itemData.frames[f].x, itemData.frames[f].y)
                        }
                        
                    }

                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(itemData.img, itemData.frames[f].x+5, itemData.frames[f].y+10)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let parsIndex = undefined;
        let poralIndex = undefined;
        for(let i = 0; i < model.main.layers.length; i++){
            let layerIndex = (i+1)*10;

            if(model.main.layers[i].name == 'poral'){
                poralIndex = layerIndex;
            }

            if(model.main.layers[i].name == 'pars'){
                parsIndex = layerIndex;
            }

            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    if(model.main.layers[i].name == 'poral_door'){
                        let paramsDivider = 30;
                        let paramsMultiplier = 2;
                        let time = 0;
                        let noiseMultiplier = undefined;
                        let hsv = [182,10,50];
                        let seed = getRandom(0,1000); //651.9748729038326
                        console.log('seed:' + seed )
                        var pn = new mathUtils.Perlin('random seed ' + seed);
                        let offset = 10;

                        let vIndex = [70, 80, 90, 100];
                        let vIndexChange = easing.fast({ from: 0, to: vIndex.length-1, steps: 100, type: 'linear', round: 0});

                        this.frames = [];
                        let totalFrames = 100;
                        let timeClamp = 2;
                        let timeValues = [
                            ...easing.fast({ from: 0, to: timeClamp, steps: totalFrames/2, type: 'quad', method: 'inOut' }),
                            ...easing.fast({ from: timeClamp, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut' })
                        ]

                        for(let f = 0; f < totalFrames; f++){
                            time = timeValues[f];
                            this.noise = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let y = 0; y < size.y; y++){
                                    //matrix[y] = [];
                                    for(let x = 0; x < size.x; x++){
                                        //matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                        let noiseX = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                        let noiseY = pn.noise((x-100)/paramsDivider, (y+200)/paramsDivider, time/10);
                                         let noise = pn.noise(noiseX*paramsMultiplier, noiseY*paramsMultiplier, time/10);
    
                                        //let noise = pn.noise(x/paramsDivider,y/paramsDivider, time/10);
                                        noise = noise*100;
                                        noise = vIndex[vIndexChange[fast.r(noise)]];
                                        //noise = fast.r(noise/5)*5;
                                        //noise/=2;
    
                                        // if(noise > 50)
                                        //     noise = 75;
                                        // else 
                                        //     noise = 25;
    
                                        if(noiseMultiplier != undefined){
                                            noise*=noiseMultiplier;
                                        }
                                        hlp.setFillColor(colors.hsvToHex([hsv[0],hsv[1],fast.r(noise)])).dot(x,y)
                                    }
                                }
                            })
                            
    
                            this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(this.noise, 0,0);
                            })
                        }

                        this.registerFramesDefaultTimer({ });
                        
                    }

                    if(model.main.layers[i].name == 'back_fog'){
                        let repeat = 2;
                        this.frames = this.parentScene.createFogMovementFrames({framesCount: 600, size: this.size, direction: 1, img: this.img});
                        this.registerFramesDefaultTimer({ framesEndCallback: () => { 
                            repeat--;
                            if(repeat == 0)
                                this.parentScene.capturing.stop = true; 
                            } 
                        });
                    }

                    if(model.main.layers[i].name == 'back_fog2'){
                        this.frames = this.parentScene.createFogMovementFrames({framesCount: 400, size: this.size, direction: 1, img: this.img});
                        this.registerFramesDefaultTimer({ });
                    }

                    if(model.main.layers[i].name == 'fore_fog'){
                        let startPoints = [];
                        let yValues = [
                            ...easing.fast({from: 115, to: 135,steps: this.size.x/2, type: 'quad', method: 'out', round: 0}),
                            ...easing.fast({from: 135, to: 115,steps: this.size.x/2, type: 'quad', method: 'in', round: 0}),
                        ]

                        for(let x = 0; x < this.size.x; x++){
                            startPoints.push(new V2(x, yValues[x]));
                        }

                        this.frames = this.parentScene.createFogMovement2Frames({ framesCount: 400, size: this.size, itemsCount: 0, startPoints, lowerY: 145, color: '#b0b865',
                        itemsCount: 200, itemFrameslength: 200, yShiftClamps: [-5,-2]
                    })
                        // this.frames = this.parentScene.createFogMovementFrames({framesCount: 400, size: this.size, direction: -1, img: this.img});
                         this.registerFramesDefaultTimer({ });
                        
                    }

                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }

        // this.portal = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.img = PP.createImage(Demo10PortalScene.models.main)
        //     }
        // }), 10)

        this.createWindFrames = function({framesCount, itemsCount, itemFrameslength, size, sprites, xClamps= [1,-2], yClamps= [0,1], yShiftClamps = [-20, -10]}) {
            let frames = [];
            let timing1 = itemFrameslength/2//fast.r(itemFrameslength/4);
            let timing2 = itemFrameslength/2//fast.r(itemFrameslength*3/4);
            let eType = 'linear';
            let eMethod1 = 'base';
            let eMethod2 = 'base';
            let xValues = easing.fast({from: -20, to: size.x,steps: itemsCount, type: 'linear', round: 0});
            let moveStartFrameValues = easing.fast({from: framesCount-1, to: 0,steps: itemsCount, type: 'linear', round: 0});
            let xChangeValues = [
                ...easing.fast({from: xClamps[0], to: xClamps[1],steps: timing1, type: eType, method: eMethod1, round: 0}),
                ...easing.fast({from: xClamps[1], to: xClamps[0],steps: timing2, type: eType, method: eMethod2, round: 0}),
            ]

            let yChangeValues = [
                ...easing.fast({from: yClamps[0], to: yClamps[1],steps: timing1, type: eType, method: eMethod1, round: 0}),
                ...easing.fast({from: yClamps[1], to: yClamps[0],steps: timing2, type: eType, method: eMethod2, round: 0}),
            ]

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = moveStartFrameValues[i]
                let totalFrames = itemFrameslength;
                let initialX = xValues[i];
                let xShift = getRandomInt(-10, 10);
                let yShift = getRandomInt(yShiftClamps[0], yShiftClamps[1]);
                let initialY = size.y + yShift;
                let sImg = sprites[getRandomInt(0, sprites.length-1)];

                let frames = new Array(framesCount).fill().map(el => ({ x: initialX + xShift }));
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        x: initialX + xShift + xChangeValues[f],
                        y: initialY + yChangeValues[f]
                    };
                }
            
                return {
                    sImg,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(itemData.sImg, itemData.frames[f].x, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.grassFar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let grassSprites = [
                    PP.createImage(Demo10PortalScene.models.grassT2_1),
                    PP.createImage(Demo10PortalScene.models.grassT2_2),
                    PP.createImage(Demo10PortalScene.models.grassT2_3)
                ] 

                this.frames = this.parentScene.createWindFrames({ framesCount: 200, itemsCount: 100, itemFrameslength: 200, size: this.size, 
                sprites: grassSprites, xClamps: [0, -1], yShiftClamps: [-25, -20] });

                this.registerFramesDefaultTimer({ });
            }
        }), parsIndex-5)

        this.grassMid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let grassSprites = [
                    PP.createImage(Demo10PortalScene.models.grassT3_1),
                    PP.createImage(Demo10PortalScene.models.grassT3_2),
                ] 

                this.frames = this.parentScene.createWindFrames({ framesCount: 200, itemsCount: 80, itemFrameslength: 200, size: this.size, 
                sprites: grassSprites, xClamps: [0, -2], yShiftClamps: [-22, -15] });

                this.registerFramesDefaultTimer({ });
            }
        }), parsIndex-3)

        this.grassClose = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let grassSprites = [
                    PP.createImage(Demo10PortalScene.models.grass1),
                    PP.createImage(Demo10PortalScene.models.grass2),
                    PP.createImage(Demo10PortalScene.models.grass3)
                ] 

                this.frames = this.parentScene.createWindFrames({ framesCount: 200, itemsCount: 75, itemFrameslength: 200, size: this.size, 
                sprites: grassSprites, xClamps: [0, -2] });

                this.registerFramesDefaultTimer({ });
            }
        }), parsIndex+5)

        this.lightning = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo10PortalScene.models.lightning1),
                    init() {
                        //this.frames = this.frames = [...this.frames, new Array()]
                        console.log('l1.frames: ' + this.frames.length);
                        this.registerFramesDefaultTimer({ initialAnimationDelay: 20, animationRepeatDelayOrigin: 158, originFrameChangeDelay: 3, debug: false });
                    }
                }))

                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo10PortalScene.models.lightning2),
                    init() {
                        console.log('l2.frames: ' + this.frames.length)
                        this.registerFramesDefaultTimer({ initialAnimationDelay: 50, animationRepeatDelayOrigin: 158, originFrameChangeDelay: 3, debug: false });
                    }
                }))

                this.l3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Demo10PortalScene.models.lightning3),
                    init() {
                        console.log('l3.frames: ' + this.frames.length)
                        this.registerFramesDefaultTimer({ initialAnimationDelay: 80, animationRepeatDelayOrigin: 155, originFrameChangeDelay: 3, debug: false });
                    }
                }))

                // this.l4 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     frames: PP.createImage(Demo10PortalScene.models.lightning4),
                //     init() {
                //         this.registerFramesDefaultTimer({ initialAnimationDelay: 100, animationRepeatDelayOrigin: 50, originFrameChangeDelay: 2 });
                //     }
                // }))
            }
        }), poralIndex+5)

        // this.po = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         let paramsDivider = 50;
        //         let paramsMultiplier = 2;
        //         let time = 0;
        //         let noiseMultiplier = undefined;
        //         let hsv = [0,0,50];
        //         var pn = new mathUtils.Perlin('random seed ' + getRandom(0,1000));
        //         let offset = 10;
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             for(let y = 0; y < size.y; y++){
        //                 //matrix[y] = [];
        //                 for(let x = 0; x < size.x; x++){
        //                     //matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
        //                     let noiseX = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
        //                     let noiseY = pn.noise((x-100)/paramsDivider, (y+200)/paramsDivider, time/10);
        //                     let noise = pn.noise(noiseX*paramsMultiplier, noiseY*paramsMultiplier, time/10);
        //                     noise = noise*100;
        //                     noise = fast.r(noise/5)*5;
        //                     //noise/=2;

        //                     // if(noise > 50)
        //                     //     noise = 75;
        //                     // else 
        //                     //     noise = 25;

        //                     if(noiseMultiplier != undefined){
        //                         noise*=noiseMultiplier;
        //                     }
        //                     hlp.setFillColor(colors.hsvToHex([hsv[0],hsv[1],fast.r(noise)])).dot(x,y)
        //                 }
        //             }
        //         })
        //     }
        // }), 0)
    }
}