class GraveyardEveningScene extends Scene {
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
                size: new V2(1000, 750),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'graveyard_evening',
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
        let model = GraveyardEveningScene.models.main;
        let layersData = {};
        let exclude = [
            'cloud1', 'cloud2', 'cloud3', 'cloud4', 'tree_p', 'back_trees_p', 'ground_p'
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

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames({ totalFrames, layerName, xShift }) {
                let frames = [];
                let img = PP.createImage(model, { renderOnly: [layerName] });
                let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                let aValues = [
                    ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'sin', method: 'out', round: 1}),
                    ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'sin', method: 'in', round: 1})
                ]

                this.mainFr = [];
                for(let f = 0; f < totalFrames; f++){
                    this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = aValues[f];
                        ctx.drawImage(img, xChange[f], 0);
                    })
                }

                let startFrameIndex = totalFrames/2;
                for(let f = 0; f < totalFrames; f++){

                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (totalFrames-1)){
                        frameIndex-=totalFrames;
                    }

                    frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mainFr[frameIndex], 0, 0);
                        ctx.drawImage(this.mainFr[f], 0, 0);
                    })
                }

                return frames;
            },
            init() {
                var lData = [{
                    layerName: 'cloud1',
                    totalFrames: 600,
                    xShift: -10,
                    startFrameIndex: 0
                },{
                    layerName: 'cloud2',
                    totalFrames: 600,
                    xShift: -10,
                    startFrameIndex: 200
                },{
                    layerName: 'cloud4',
                    totalFrames: 600,
                    xShift: -10,
                    startFrameIndex: 300,
                    translate: new V2(3, 0)
                },{
                    layerName: 'cloud3',
                    totalFrames: 600,
                    xShift: -6,
                    startFrameIndex: 400,
                    translate: new V2(15, 0)
                }]

                lData.map(ld => this.addChild(new GO({
                    position: new V2().add(ld.translate ? ld.translate : new V2()),
                    size: this.size,
                    frames: this.createFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            framesEndCallback: () => {
                                if(ld.startFrameIndex == 0) {
                                    this.parent.parentScene.capturing.stop = true;
                                }
                                
                            }
                        });
                    }
                })))
            }
        }), layersData.cloud1.renderIndex)   

        this.bird = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.birdFrames = PP.createImage(GraveyardEveningScene.models.birdFrames);
                let totalFlyFrames = 100;
                let birdFrameChangeDelayOrigin = 5;
                let birdFrameChangeDelay = birdFrameChangeDelayOrigin;
                let birdPath = [];

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    birdPath = new PP({ctx}).lineV2(new V2(-10, 70), new V2(210, 80))
                })

                let frameIndexValues = easing.fast({from: 0, to: birdPath.length-1, steps: totalFlyFrames, type: 'linear', round: 0});
                this.frames = [];
                let currentBirdFrameIndex = 0;
                for(let f = 0; f < totalFlyFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = birdPath[frameIndexValues[f]];

                        ctx.drawImage(this.birdFrames[currentBirdFrameIndex], p.x, p.y);
                        
                        birdFrameChangeDelay--;
                        if(birdFrameChangeDelay == 0) {
                            birdFrameChangeDelay = birdFrameChangeDelayOrigin;
                            currentBirdFrameIndex++;
                            if(currentBirdFrameIndex == this.birdFrames.length) {
                                currentBirdFrameIndex = 0;
                            }
                        }

                    })
                }
                
                this.registerFramesDefaultTimer({
                    initialAnimationDelay: 200, 
                    animationRepeatDelayOrigin: 300
                });

            }
        }), layersData.tree.renderIndex+2)

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex+1)

        this.back_trees_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'back_trees_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.back_trees.renderIndex+1)

        this.ground_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.ground_2.renderIndex+1)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GraveyardEveningScene.models.catFrames),
            init() {
                this.frames = [
                    ...this.frames,
                    this.frames[this.frames.length-2],
                    this.frames[this.frames.length-1],
                    this.frames[this.frames.length-2],
                    this.frames[this.frames.length-1],
                    // this.frames[this.frames.length-2],
                    // this.frames[this.frames.length-1],
                    ...this.frames.reverse()
                ]

                this.registerFramesDefaultTimer({originFrameChangeDelay: 10, 
                    initialAnimationDelay: 300, 
                    animationRepeatDelayOrigin: 600
                    });
            }
        }), layersData.graves_frontal.renderIndex+1)
    }
}