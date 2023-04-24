class Departure5Scene extends Scene {
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
                size: new V2(2000,2000).divide(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'departure5',
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
        let model = Departure5Scene.models.main;
        let layersData = {};
        let exclude = [
            'trees_p', 'lamps_p', 'rails_p', 'title_visible_zone1', 'title2'
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

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let treeAnimation = Departure5Scene.models.treeAnimation;

                let totalFrames = 150;
                let framesFromTo = [0, 2]
                let totalAnimationFrames = 50;
                let animationStartFrameClamps = [0, totalFrames]

                treeAnimation.main[0].layers.map(l => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(treeAnimation, { renderOnly: [l.name] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)
                        let animationStartFrame = getRandomInt(animationStartFrameClamps) // p.animationStartFrame + aniStart;

                        let from = framesFromTo[0];
                        let to = framesFromTo[1];

                        // if(p.framesFromTo) {
                        //     from = p.framesFromTo[0];
                        //     to = p.framesFromTo[1];
                        // }

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: from, to: to, steps: totalAnimationFrames/2, type: 'linear', method: 'base', round: 0}), 
                                ...easing.fast({ from: to, to: from, steps: totalAnimationFrames/2, type: 'linear', method: 'base', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
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
        }), layersData.trees.renderIndex+1)

        this.lamps_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamps_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.lamps.renderIndex+1)

        this.trees_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'trees_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.trees.renderIndex+1)

        this.rails_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'rails_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.rails_d.renderIndex+1)

        this.title = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let titleImg = PP.createImage(model, { renderOnly: ['title2'] })
                let titleZone = PP.createImage(model, { renderOnly: ['title_visible_zone1'], forceVisibility: { title_visible_zone1: { visible: true } } });

                let totalFrames = 300;
                let fadeInFramesCount = totalFrames/3;
                let pauseFramesCount = totalFrames/3;
                let fadeOutFramesCount = totalFrames/3;

                let xValues = [
                    ...easing.fast({from: 27, to: 0, steps: fadeInFramesCount, type: 'linear', round: 0}),
                    ...new Array(pauseFramesCount).fill(0),
                    ...easing.fast({from: 0, to: -27, steps: fadeOutFramesCount, type: 'linear', round: 0}),
                ]

                this.frames = xValues.map(x => createCanvas(this.size, (ctx, _size, hlp) => {
                    ctx.drawImage(titleImg, x, 0);
                    ctx.globalCompositeOperation = 'destination-in';
                    ctx.drawImage(titleZone, 0, 0);
                }))

                this.registerFramesDefaultTimer({});
            }
        }), layersData.title2.renderIndex+1)
    }
}