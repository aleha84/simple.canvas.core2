class FogScene extends Scene {
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
                size: new V2(800, 1000),//new V2(1600, 2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'fog',
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
        let model = FogScene.models.main;
        let layersData = {};
        let exclude = [
            'bg_d', 'ground_d', 'ground_p', 'man', 'light', 'light_d', 'light_p'
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

        this.bg_d = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 600, itemFrameslength: 550, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bg_d')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+1)

        this.ground_d = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 280, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_d')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.ground.renderIndex+1)

        this.ground_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.ground.renderIndex+2)

        this.treeAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let totalAnimationFrames = 50;
                let oneFrameDelay = 100;
                let oneFrame = 30;

                let aniParams = [
                    { layerName: 'l1', animationStartFrame: 10},
                    { layerName: 'l2', animationStartFrame: 20},
                    { layerName: 'l3', animationStartFrame: 30},
                    { layerName: 'l4', animationStartFrame: 70},
                    { layerName: 'l5', animationStartFrame: 50},
                    { layerName: 'l6', animationStartFrame: 50},
                    { layerName: 'l7', animationStartFrame: 40},
                    { layerName: 'l8', animationStartFrame: 55},

                    { layerName: 'l9', animationStartFrame: 50},
                    { layerName: 'l10', animationStartFrame: 70},
                    //{ layerName: 'l11', animationStartFrame: 90},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(FogScene.models.treeAnimations, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)

                        let animationStartFrame = p.animationStartFrame;


                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        for(let i = 0; i < oneFrame; i++){
                            let index = animationStartFrame + totalAnimationFrames + oneFrameDelay + i;

                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = 1;
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));
            }
        }), layersData.right_bush.renderIndex + 1)

        this.man = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(FogScene.models.manFrames, { renderOnly: ['man'] });
                //this.frames_p = PP.createImage(FogScene.models.manFrames, { renderOnly: ['man_p'] });

                this.img = this.frames[this.frames.length-1]

                let totalFrames = 600;
                let ani1TriggerFrame = 200;
                let ani2TriggerFrame = 500;
                let aniLength = 20;
                
                let ani1FramesIndicies = easing.fast({ from: this.frames.length-1, to: 0, steps: aniLength, type: 'quad', method: 'out', round: 0})
                let ani2FramesIndicies = easing.fast({ from: 0, to: this.frames.length-1, steps: aniLength, type: 'linear', method: 'base', round: 0})
                
                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    isVisible: false,
                    img: PP.createImage(model, { renderOnly: ['light'] }),
                    init() {
                        this.light_d = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 250, size: this.size, 
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'light_d')) });
                
                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        this.light_p = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'light_p')) });
                
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.last_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(FogScene.models.manFrames.main[FogScene.models.manFrames.main.length-1].layers.find(l => l.name == 'man_p')) });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.first_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    isVisible: false,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(FogScene.models.manFrames.main[0].layers.find(l => l.name == 'man_p')) });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                let frameIndex = 0;
                
                let isAni1 = false;
                let isAni2 = false;
                this.timer = this.regTimerDefault(10, () => {
                
                    if(frameIndex == ani1TriggerFrame) {
                        isAni1 = true;
                        this.last_p.isVisible = false;
                    }

                    if(frameIndex == ani2TriggerFrame) {
                        isAni2 = true;
                        this.first_p.isVisible = false;
                        this.light.isVisible = false;
                    }
                    
                    if(isAni1) {
                        this.img = this.frames[ani1FramesIndicies[frameIndex-ani1TriggerFrame]]
                    }

                    if(isAni2) {
                        this.img = this.frames[ani2FramesIndicies[frameIndex-ani2TriggerFrame]]
                    }


                    frameIndex++;
                    if(frameIndex == totalFrames){
                        frameIndex = 0;
                    }

                    if(isAni1 && frameIndex == ani1TriggerFrame+aniLength) {
                        isAni1 = false;
                        this.first_p.isVisible = true;
                        this.light.isVisible = true;
                    }

                    if(isAni2 && frameIndex == ani2TriggerFrame+aniLength) {
                        isAni2 = false;
                        this.last_p.isVisible = true;
                    }
                    
                })
            }
        }), layersData.man.renderIndex+1)
    }
}