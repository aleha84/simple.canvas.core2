class ShrineScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'shrine'
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

    createCloudsFrames({framesCount, itemsCount, startPoints, itemFrameslength, size, yShiftClamps, rClamps = [4,8], colors}) {
        //let colors = ['#1F4D5C']//['#174148','#1F4D5C', '#235361'];
        let circles = [];
        for(let r = rClamps[0]; r <= rClamps[1]; r++){
            circles[r] = [];
            for(let c = 0; c < colors.length; c++){
                circles[r].push(
                createCanvas(new V2(r*2,r*2), (ctx, size, hlp) => {
                    hlp.setFillColor(colors[c]).circle(new V2(r,r), r)
                }))
            }
        }
        
        let frames = [];
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let startPoint = startPoints[getRandomInt(0, startPoints.length-1)];
            let img = circles[getRandomInt(rClamps[0],rClamps[1])][getRandomInt(0, colors.length-1)];
            let xChangeValues = easing.fast({ from: 0, to: getRandomInt(-3,-6), steps: totalFrames, type: 'linear', method: 'base', round: 0});
            let yShiftMax = getRandomInt(yShiftClamps[0],yShiftClamps[1]);
            let yChangeValues = [
                ...easing.fast({ from: 0, to: yShiftMax, steps: totalFrames/2, type: 'quad', method: 'out', round: 0}),
                ...easing.fast({ from: yShiftMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'in', round: 0})
            ]
            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    p: new V2(startPoint).add(new V2(xChangeValues[f], yChangeValues[f]))
                };
            }
        
            return {
                img,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        ctx.drawImage(itemData.img, itemData.frames[f].p.x, itemData.frames[f].p.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        let model = ShrineScene.models.main;

        for(let i = 0; i < model.main.layers.length; i++){
            let layerIndex = (i)*10;
            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    if(model.main.layers[i].name == 'shine'){
                        let totalFrames = 100;
                        let oValues = [
                            ...easing.fast({from: 1, to: 0.25, steps: totalFrames/2, type: 'quad', method: 'in', round: 1}),
                            ...easing.fast({from: 0.25, to: 1, steps: totalFrames/2, type: 'quad', method: 'out', round: 1})
                        ]

                        this.frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let opacity = oValues[f];
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = opacity;
                                ctx.drawImage(this.img, 0, 0);
                            })
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 0;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = originFrameChangeDelay;
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                    }

                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }

        let cloudsStartPoints = [];
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            let pp = new PP({ctx});
            cloudsStartPoints = [
                ...pp.lineV2(new V2(119,34+3), new V2(80,41+3)),
                ...pp.lineV2(new V2(39,46), new V2(27,43)),
                ...pp.lineV2(new V2(27,43), new V2(0,56))
            ]
        })

        this.stars = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createStarsFrames({framesCount, itemsCount, itemFrameslength, size, lowerY}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslength, itemFrameslength*2);
                    let totalFramesHalf = fast.r(totalFrames/2)
                    
                    let p = new V2(getRandomInt(0, size.x),getRandomInt(0, lowerY));
                    if(getRandomInt(0,5) == 0){
                        let initO = fast.r(getRandom(0.3,0.6),2);
                        let oValues = [
                            ...easing.fast({ from: 0, to: initO, steps: totalFramesHalf,  type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({ from: initO, to: 0, steps: totalFramesHalf, type: 'quad', method: 'inOut', round: 2})
                        ]
                        
    
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                o: oValues[f]
                            };
                        }
                    
                        return {
                            p,
                            frames
                        }
                    }

                    return {
                        p,
                        frames: new Array(framesCount).fill().map((el) => ({ o: 0.05 }))
                    }
                    
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o})`).dot(itemData.p.x, itemData.p.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({ framesCount: 200, itemsCount: 250, itemFrameslength: 50, size: this.size, lowerY: this.size.y/2 })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 2)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                let layers = [
                    this.parentScene.createCloudsFrames({ framesCount: 400, itemsCount: 200, itemFrameslength:400, size: this.size, 
                        startPoints: cloudsStartPoints, yShiftClamps: [-5,-15], colors: ['#22525F'], rClamps: [6,10]  }),
                    this.parentScene.createCloudsFrames({ framesCount: 400, itemsCount: 200, itemFrameslength:400, size: this.size, 
                        startPoints: cloudsStartPoints, yShiftClamps: [-5,-13], colors: ['#1F4D5C'], rClamps: [4,8]  }),
                    this.parentScene.createCloudsFrames({ framesCount: 400, itemsCount: 200, itemFrameslength:400, size: this.size, 
                        startPoints: cloudsStartPoints, yShiftClamps: [-5,-8], colors: ['#22525F'], rClamps: [6,10]  }),
                    // this.parentScene.createCloudsFrames({ framesCount: 200, itemsCount: 200, itemFrameslength:200, size: this.size, 
                    //     startPoints: cloudsStartPoints.map(p => new V2(p).add(new V2(0,8))), yShiftClamps: [-5,-15], colors: ['#1A4250'], rClamps: [4,8]  }),                          
                ]

                this.layeredClouds = layers.map(frames => {
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            
                            let originFrameChangeDelay = 0;
                            let frameChangeDelay = originFrameChangeDelay;
                            
                            let animationRepeatDelayOrigin = 0;
                            let animationRepeatDelay = animationRepeatDelayOrigin;
                            let repeats = 4;
                            this.timer = this.regTimerDefault(10, () => {
                                animationRepeatDelay--;
                                if(animationRepeatDelay > 0)
                                    return;
                            
                                frameChangeDelay--;
                                if(frameChangeDelay > 0)
                                    return;
                            
                                frameChangeDelay = originFrameChangeDelay;
                            
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    repeats--;
                                    if(repeats == 0){
                                        this.parent.parentScene.capturing.stop = true;
                                    }
                                    
                                    this.currentFrame = 0;
                                    animationRepeatDelay = animationRepeatDelayOrigin;
                                }
                            })
                        }
                    }))
                });

                // 


                
            }
        }), 3)

        this.particles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createParticlesFrames({framesCount, itemsCount, startPoints, itemFrameslength, size}) {
                let frames = [];
                let color =  colors.colorTypeConverter({value: '#e2850d', fromType: 'hex', toType: 'rgb' });
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    let startPoint = startPoints[getRandomInt(0, startPoints.length-1)].clone();
                    //startPoint.x += getRandomInt(-5, 0);
                    //let xChangeValues = easing.fast({ from: 0, to: getRandomInt(-10,-5), steps: totalFrames, type: 'quad', method: 'in', round: 0});
                    let yChangeValues = easing.fast({ from: 0, to: getRandomInt(-10,-5), steps: totalFrames, type: 'quad', method: 'in', round: 0});
                    let oValues = easing.fast({ from: 0.5, to: 0, steps: totalFrames, type: 'quad', method: 'in', round: 1});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            //x: xChangeValues[f],
                            y: yChangeValues[f],
                            o: oValues[f],
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
                                hlp.setFillColor(`rgba(${color.r}, ${color.g}, ${color.b}, ${itemData.frames[f].o})`)
                                //.dot(itemData.startPoint.x+itemData.frames[f].x, itemData.startPoint.y)
                                .dot(itemData.startPoint.x, itemData.startPoint.y+itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 100, itemsCount: 50, itemFrameslength: 100, size: this.size, 
                    //startPoints: [new V2(56,60),new V2(55,59),new V2(55,58),new V2(54,57),new V2(53,56), new V2(56,75), new V2(56,74), new V2(56,73), ...new Array(12).fill().map((el, i) => new V2(57, 72-i))] 
                    startPoints: [...new Array(18).fill().map((el, i) => new V2(39+i, 76))]
                });

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 31)

        this.treesMovement = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            extractPointData(layer) {
                let data = [];
                layer.groups.forEach(group => {
                    let color = group.strokeColor;
                    group.points.forEach(point => {
                        data.push({
                            color, 
                            point: point.point
                        });
                    })
                })

                return data;
            },
            createMovementFrames({framesCount, itemFrameslength, pointsData, size}) {
                let frames = [];
                
                let itemsData = pointsData.map((pd, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        frames,
                        pd
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createMovementFrames({framesCount: 200, itemFrameslength: 10, size: this.size, 
                    pointsData: this.extractPointData(ShrineScene.models.main.main.layers.find(layer => layer.name == 'trees_movemen'))});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 21)
    }
}