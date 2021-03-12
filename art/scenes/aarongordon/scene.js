class AarongordonScene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(1200,1200),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'omelette'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let sceneTimerDelay = 10;

        let model = AarongordonScene.models.main;
        let layersData = {};
        let exclude = [            
        ];

        let modelInitialLayerIndex = 20;
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['main'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p')) });

                        this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay,
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            },
                        });
                    }
                }));

                let totalFrames = 150;
                let totalAnimationFrames = 150;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'l1',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'l2',
                        animationStartFrame: 10,
                    },
                    {
                        layerName: 'l3',
                        animationStartFrame: 70,
                    },
                    {
                        layerName: 'l4',
                        animationStartFrame: 50,
                    },
                    {
                        layerName: 'l5',
                        animationStartFrame: 90,
                    }
                    
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(AarongordonScene.models.animation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        let oneFrameShift = oneFrame + getRandomInt(0,5);

                        let v = 0;
                        for(let i = 0; i < totalFrames; i++){
                            // if(i%oneFrameShift == 0){
                            //     v = v==0? 1: 0;
                            // }

                            let index = p.animationStartFrame+i;
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = v;
                        }

                        let animationStartFrame = p.animationStartFrame;

                        let animationFramesIndexValues = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                        ]


                        for(let i = 0; i < animationFramesIndexValues.length; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(sceneTimerDelay, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));
            }
        }), 20)

        this.pFlowBack = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBackFlowFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let pData = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p_flow_back'));

                let speedDeviationClamps = [5,10];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p = pData[getRandomInt(0, pData.length-1)];
                    let xValuesChange = easing.fast({
                        from: 0, to: 100 + getRandomInt(speedDeviationClamps[0], speedDeviationClamps[1]), steps: itemFrameslength, type: 'quad', method: 'in', round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            xChange: xValuesChange[f]
                        };
                    }
                
                    return {
                        p,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.p.color).dot(itemData.p.point.x + itemData.frames[f].xChange, itemData.p.point.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createBackFlowFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, itemsCount: 200 });
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 21)

        // this.bottom_p = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     createParticlesFrames({framesCount, itemsCount, itemFrameslength, size}) {
        //         let frames = [];
        //         let initY = 125;
        //         let xClamps = [30,130];

        //         let itemsData = new Array(itemsCount).fill().map((el, i) => {
        //             let startFrameIndex = getRandomInt(0, framesCount-1);
        //             let totalFrames = itemFrameslength;
                
        //             let x = getRandomInt(xClamps[0], xClamps[1]);
        //             let y = initY + getRandomInt(-5,5);
        //             let yChangeValues = easing.fast({from: 0, to: getRandomInt(20,50), steps: itemFrameslength, type: 'quad', method: 'in', round: 0});
        //             let xChangeValues= easing.fast({from: 0, to: getRandomInt(20,50), steps: itemFrameslength, type: 'linear', method: 'base', round: 0});

        //             let frames = [];
        //             for(let f = 0; f < totalFrames; f++){
        //                 let frameIndex = f + startFrameIndex;
        //                 if(frameIndex > (framesCount-1)){
        //                     frameIndex-=framesCount;
        //                 }
                
        //                 frames[frameIndex] = {
        //                     xChange: xChangeValues[f],
        //                     yChange: yChangeValues[f]
        //                 };
        //             }
                
        //             return {
        //                 x,y,
        //                 frames
        //             }
        //         })
                
        //         for(let f = 0; f < framesCount; f++){
        //             frames[f] = createCanvas(size, (ctx, size, hlp) => {
        //                 hlp.setFillColor('#45443e')
        //                 for(let p = 0; p < itemsData.length; p++){
        //                     let itemData = itemsData[p];
                            
        //                     if(itemData.frames[f]){
        //                         hlp.dot(itemData.x + itemData.frames[f].xChange, itemData.y + itemData.frames[f].yChange)
        //                     }
                            
        //                 }
        //             });
        //         }
                
        //         return frames;
        //     },
        //     init() {
        //         this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 200, itemFrameslength: 150, size: this.size });
        //         this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
        //     }
        // }), 19)

        // for(let i = 0; i < model.main.layers.length; i++) {
        //     let layer = model.main.layers[i];
        //     let layerName = layer.name || layer.id;
        //     let renderIndex = modelInitialLayerIndex + i*10;

        //     layersData[layerName] = {
        //         renderIndex
        //     }

        //     if(exclude.indexOf(layerName) != -1){
        //         console.log(`${layerName} - skipped`)
        //         continue;
        //     }

        //     this[layerName] = this.addGo(new GO({
        //         position: this.sceneCenter.clone(),
        //         size: this.viewport.clone(),
        //         img: PP.createImage(model, { renderOnly: [layerName] }),
        //         init() {
                    
        //         }
        //     }), renderIndex)

        //     console.log(`${layerName} - ${renderIndex}`)
        // }

        this.createParticlesFlowFrames = function({xSpeed, framesCount, itemsCount, itemFrameslength, size, color, secColor, yClamps, xClamps, maxSize = 2, sizeChangeFunction,
            useGaussianY = false}) {
            let frames = [];
            
            let xValuesChange = easing.fast({from: 0, to: xSpeed, steps: itemFrameslength, type: 'linear', round: 0});
            let sizeValueChange = [
                ...easing.fast({from: 0, to: maxSize, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({from: maxSize, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0})
            ]

            if(!sizeChangeFunction) {
                sizeChangeFunction = () => true;
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let x = getRandomInt(xClamps[0], xClamps[1]);
                let y = getRandomInt(yClamps[0], yClamps[1]);
                if(useGaussianY){
                    y = fast.r(getRandomGaussian(yClamps[0], yClamps[1]))
                }

                let changingSize = sizeChangeFunction();

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        xChange: xValuesChange[f],
                        size: changingSize ? sizeValueChange[f] : 0
                    };
                }
            
                return {
                    x,y,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(color);
                            let x = itemData.x + itemData.frames[f].xChange;
                            let y = itemData.y;
                            let size = itemData.frames[f].size;
                            if(size == 0){
                                hlp.dot(x, y);
                            }
                            else if(size == 1){
                                hlp.dot(x-1, y).dot(x+1, y).dot(x,y-1).dot(x, y+1)
                            }
                            else if(size == 2){
                                hlp.dot(x,y).dot(x-1, y).dot(x+1, y).dot(x,y-1).dot(x, y+1);
                                hlp.setFillColor(secColor).dot(x,y);
                            }
                            else if(size == 3){
                                hlp.rect(x-1,y-1, 3,3);
                                
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }
        this.flow3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createParticlesFlowFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: 100, 
                size: this.viewport, color: '#7d7c78', secColor: '#ededed', yClamps: [-50, this.viewport.y+10], xClamps: [-10, this.viewport.x+10],
                xSpeed: 60, useGaussianY: true
            }),
            init() {
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 15)

        this.flow2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createParticlesFlowFrames({ framesCount: 300, itemsCount: 150, itemFrameslength: 150, 
                size: this.viewport, color: '#544829', secColor: '#544829', yClamps: [-5, this.viewport.y+5], xClamps: [-10, this.viewport.x+10],
                xSpeed: 40, maxSize: 2, 
                sizeChangeFunction: () => getRandomInt(0,3) == 0
            }),
            init() {
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 12)


        this.flow1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createParticlesFlowFrames({ framesCount: 300, itemsCount: 300, itemFrameslength: 150, 
                size: this.viewport, color: '#232510', secColor: '#232510', yClamps: [-5, this.viewport.y+5], xClamps: [-10, this.viewport.x+10],
                xSpeed: 20, maxSize: 1, 
                sizeChangeFunction: () => false
            }),
            init() {
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 10)

        let fastFlyingLinesFrames = function({framesCount, itemsCount, itemFrameslength, width, height, size, color}) {
            let frames = [];
            
            let xChange = easing.fast({from: -width, to: size.x, steps: itemFrameslength+1, type: 'linear', round: 0});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let y = getRandomInt(0, size.y);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        f
                    };
                }
            
                return {
                    y,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    hlp.setFillColor(color);
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.rect(xChange[itemData.frames[f].f], itemData.y, width, height)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.fastClose = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: fastFlyingLinesFrames({ framesCount: 300, itemsCount: 5, itemFrameslength: 10, width: 25, height: 1, color: '#ecac08', size: this.viewport }),
            init() {
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 30)

        this.fastFar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: fastFlyingLinesFrames({ framesCount: 300, itemsCount: 15, itemFrameslength: 25, width: 15, height: 1, color: '#7d6403', size: this.viewport }),
            init() {
                this.registerFramesDefaultTimer({timerDelay:sceneTimerDelay});
            }
        }), 11)
    }
}