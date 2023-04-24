class NeonEveningScene extends Scene {
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
                size: new V2(113,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 30,
                fileNamePrefix: 'neonevening',
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
        let model = NeonEveningScene.models.main;
        let layersData = {};
        let exclude = [
            'trees_l1_p', 'trees_l1_p2'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let yClamps = [0,30];

                let pointsData = new Array(50).fill().map(el => {
                    return {
                        point: {
                            x: getRandomInt(0, this.size.x),
                            y: getRandomInt(yClamps)
                        },
                        color: `rgba(255,255,255, ${fast.r(getRandom(0.05,0.1),2)})`
                    }
                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    pointsData.forEach(pd => {
                        hlp.setFillColor(pd.color).dot(pd.point);
                    })
                })


                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 200, size: this.size, 
                            pointsData: pointsData.map(pd => {
                                return {
                                    point: pd.point,
                                    color: (getRandomBool() ? 'rgba(0,0,0,' : 'rgba(255,255,255,') + fast.r(getRandom(0.05, 0.1), 2)
                                }
                            })});
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), layersData.bg.renderIndex+1)

        let createTreesMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size}) {
            let frames = [];
            let images = [];

            let itemsCount = animationsModel.main[0].layers.length;

            let framesIndiciesChange = [
                ...easing.fast({ from: 0, to: 3, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 }),
                ...easing.fast({ from: 3, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 })
            ]

            for(let i = 0; i < itemsCount; i++) {
                images[i] = PP.createImage(animationsModel, { renderOnly: [animationsModel.main[0].layers[i].name] }) //'l' + (i+1)
            }
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = startFramesSequence ? 
                startFramesSequence[i]
                : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                
                let totalFrames = itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: framesIndiciesChange[f]
                    };
                }

                if(additional) {
                    let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
                    for(let f = 0; f < additional.frameslength; f++){
                        let frameIndex = f + startFrameIndex1;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            index: additional.framesIndiciesChange[f]
                        };
                    }
                }
                
            
                return {
                    img: images[i],
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            ctx.drawImage(itemData.img[index], 0, 0);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.treeL1Movement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.l1_1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: 300, startFramesClamps: [50, 100], itemFrameslength: 100, 
                            additional: {
                                framesShift: 30,
                                frameslength: 60,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 1, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                                    ...easing.fast({from: 1, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0 })
                                ]
                            },
                            animationsModel: NeonEveningScene.models.trees_l1_animations,
                            size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l1_1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: 300, startFramesClamps: [0, 50], itemFrameslength: 100, 
                            additional: {
                                framesShift: 30,
                                frameslength: 60,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 1, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                                    ...easing.fast({from: 1, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0 })
                                ]
                            },
                            animationsModel: NeonEveningScene.models.trees_l1_animations2,
                            size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.trees_l1_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'trees_l1_p')) });


                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.trees_l1_p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'trees_l1_p2')) });


                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), layersData.trees_l1.renderIndex+1);

        this.treeL2Movement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: 150, startFramesSequence: [80, 70, 50, 30, 10], startFramesClamps: [40, 80], itemFrameslength: 120, 
                            // additional: {
                            //     framesShift: 10,
                            //     frameslength: 30,
                            //     framesIndiciesChange: [
                            //         ...easing.fast({from: 0, to: 1, steps: 15, type: 'quad', method: 'inOut', round: 0 }),
                            //         ...easing.fast({from: 1, to: 0, steps: 15, type: 'quad', method: 'inOut', round: 0 })
                            //     ]
                            // },
                            animationsModel: NeonEveningScene.models.trees_l2_animations,
                            size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.trees_l2.renderIndex+1);

        this.wAni1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let w1points = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'w_1'));
                let frames = [
                    createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                        let c = 'rgba(255,255,255,0.05)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                        let c = 'rgba(0,0,0,0.1)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    undefined
                ]

                let frameChangeDelay = getRandomInt(5,15) ;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = getRandomInt(5,15);
                
                    this.img = frames[getRandomInt(0, frames.length-1)]
                    this.currentFrame++;
                    if(this.currentFrame == frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), layersData.w_1.renderIndex+1)
    }
}