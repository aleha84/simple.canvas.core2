class Demo10FriendScene extends Scene {
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
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'friend'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    createCloudsFrames({framesCount, itemsCount, points, itemFrameslength, size, yShiftClamps, xShiftClamps, rClamps = [4,8], colors,
        getXChangeValues, getYChangeValues
    }) {
        //let colors = ['#fafbfb'];
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
        let startPoints = [];

        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            let pp = new PP({ctx});
            for(let i = 0; i < points.length-1; i++){
                startPoints = [...startPoints, ...pp.lineV2(points[i], points[i+1])]
            }
        })

        let frames = [];
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let startPoint = startPoints[getRandomInt(0, startPoints.length-1)];
            let img = circles[getRandomInt(rClamps[0],rClamps[1])][getRandomInt(0, colors.length-1)];
            //let xShiftMax = getRandomInt(xShiftClamps[0],xShiftClamps[1])
            let xChangeValues = getXChangeValues(totalFrames, xShiftClamps)
            // [
            //     ...easing.fast({ from: 0, to: xShiftMax, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
            //     ...easing.fast({ from: xShiftMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
            // ]
            //let yShiftMax = getRandomInt(yShiftClamps[0],yShiftClamps[1]);
            let yChangeValues = getYChangeValues(totalFrames, yShiftClamps)
            // [
            //     ...easing.fast({ from: 0, to: yShiftMax, steps: totalFrames, type: 'linear', method: 'base', round: 0})
            //     //...easing.fast({ from: yShiftMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'in', round: 0})
            // ]
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
        let model = Demo10FriendScene.models.main;

        for(let i = 0; i < model.main.layers.length; i++){
            let layerIndex = (i)*10;
            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    //
                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }


        // createCanvas(new V2(1,1), (ctx, size, hlp) => {
        //     let pp = new PP({ctx});
        //     let points = [new V2(11,66),new V2(1,66),new V2(13,61),new V2(12,56),new V2(20,49),new V2(53,50),new V2(62,38),new V2(68,33),new V2(73,29),new V2(73,25),new V2(80,20),new V2(84,12),new V2(99,10),new V2(105,5)]

        //         for(let i = 0; i < points.length-1; i++){
        //             cloudsStartPoints = [...cloudsStartPoints, ...pp.lineV2(points[i], points[i+1])]
        //         }

        //     let points1 = [new V2(68,41),new V2(75,37),new V2(91,37),new V2(98,32)]
        //     for(let i = 0; i < points1.length-1; i++){
        //         cloudsStartPoints1 = [...cloudsStartPoints1, ...pp.lineV2(points1[i], points1[i+1])]
        //     }

        //     let points2 = [new V2(0,80),new V2(20, 74)]
        //     for(let i = 0; i < points2.length-1; i++){
        //         cloudsStartPoints2 = [...cloudsStartPoints2, ...pp.lineV2(points2[i], points2[i+1])]
        //     }

        // })

        let fx1 = (totalFrames, xShiftClamps) => {
            let xShiftMax = getRandomInt(xShiftClamps[0], xShiftClamps[1])  //getRandomInt(-10, -15)
            return [
                ...easing.fast({ from: 0, to: xShiftMax, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({ from: xShiftMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
            ]
        }

        let fy1 = (totalFrames, yShiftClamps) => {
            let yShiftMax = getRandomInt(yShiftClamps[0], yShiftClamps[1])  //getRandomInt(5,10)
            return [
                ...easing.fast({ from: 0, to: yShiftMax, steps: totalFrames, type: 'linear', method: 'base', round: 0})
            ]
        }

        let fx2 = (totalFrames, xShiftClamps) => {
            let xShiftMax = getRandomInt(xShiftClamps[0], xShiftClamps[1])  //getRandomInt(-5,-10)
            return [
                ...easing.fast({ from: 0, to: xShiftMax, steps: totalFrames, type: 'linear', method: 'base', round: 0})
            ]
        }

        let fy2 = (totalFrames, yShiftClamps) => {
            let yShiftMax = getRandomInt(yShiftClamps[0], yShiftClamps[1]) // getRandomInt(-5, -10)
            return [
                ...easing.fast({ from: 0, to: yShiftMax, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({ from: yShiftMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
            ]
        }

        let framesCount = 400
        let layers = [
            { 
                framesCount: framesCount, itemsCount: 500, size: this.viewport, itemFrameslength: framesCount, //startPoints: cloudsStartPoints, 
                yShiftClamps: [5,10], xShiftClamps: [-10,-15], rClamps: [4,8], colors: ['#fafbfb'], layer: 5,
                points: [new V2(11,66),new V2(1,66),new V2(13,61),new V2(12,56),new V2(20,49),new V2(53,50),new V2(62,38),new V2(68,33),new V2(73,29),new V2(73,25),new V2(80,20),new V2(84,12),new V2(99,10),new V2(105,5)],
                getXChangeValues: fx1, getYChangeValues: fy1
              },
              { 
                framesCount: framesCount, itemsCount: 100, size: this.viewport, itemFrameslength: framesCount, //startPoints: cloudsStartPoints1, 
                yShiftClamps: [-5,-10], xShiftClamps: [-5,-10], rClamps: [3,6], colors: ['#b3c2db'], layer: 11,
                points: [new V2(68,41),new V2(75,37),new V2(91,37),new V2(98,32)],
                getXChangeValues: fx2, getYChangeValues: fy2
              },
              { 
                framesCount: framesCount, itemsCount: 100, size: this.viewport, itemFrameslength: framesCount, //startPoints: cloudsStartPoints2, 
                yShiftClamps: [-5,-10], xShiftClamps: [-5,-10], rClamps: [2,4], colors: ['#b3c2db'], layer: 11,
                points: [new V2(-10,85),new V2(20, 74)],
                getXChangeValues: fx2, getYChangeValues: fy2
              },
              { 
                framesCount: framesCount, itemsCount: 100, size: this.viewport, itemFrameslength: framesCount, //startPoints: cloudsStartPoints2, 
                yShiftClamps: [-3,-7], xShiftClamps: [-5,-10], rClamps: [3,6], colors: ['#fafbfb'], layer: 12,
                points: [new V2(0,85),new V2(24, 82)],
                getXChangeValues: fx2, getYChangeValues: fy2
              },
              { 
                framesCount: framesCount, itemsCount: 100, size: this.viewport, itemFrameslength: framesCount, //startPoints: cloudsStartPoints2, 
                yShiftClamps: [-3,-7], xShiftClamps: [-5,-10], rClamps: [4,8], colors: ['#b3c2db'], layer: 13,
                points: [new V2(83,83),new V2(105, 73)],
                getXChangeValues: fx2, getYChangeValues: fy2
              }
        ]

        this.clouds = layers.map(layer => this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createCloudsFrames(layer), 
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let repeat = 3;
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
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;

                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), layer.layer))

        this.grass = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(Demo10FriendScene.models.grassFrames),
            init() {

                this.frames = [...this.frames, 
                    this.frames[this.frames.length-1],
                    this.frames[this.frames.length-1],
                    this.frames[this.frames.length-2], 
                    this.frames[this.frames.length-3],
                    this.frames[this.frames.length-2],
                    //this.frames[this.frames.length-1],
                    this.frames[this.frames.length-1],
                    ...this.frames.reverse()];

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 131;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                let counter = 0;
                this.timer = this.regTimerDefault(10, () => {
                    counter++;
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
                        console.log('grass counter: ' + counter);
                        counter = 0;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 40)

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
                this.frames = this.createMovementFrames({framesCount: 200, itemFrameslength: 30, size: this.size, 
                    pointsData: this.extractPointData(Demo10FriendScene.models.main.main.layers.find(layer => layer.name == 'paricles'))});

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
        }), 35)
    }
}