class FoggyBridgeScene extends Scene {
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
                fileNamePrefix: 'foggy_bridge',
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
        let model = FoggyBridgeScene.models.main;
        let layersData = {};
        let exclude = [
            'bg_d', 'car2_yellow', 'mid_p'
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

        this.mid_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'mid_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        //this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.car2.renderIndex+2)

        this.car1 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-68,0)),
            size: new V2(380,200),
            init() {
                // let frames = PP.createImage(FoggyBridgeScene.models.car1Frames)
                // this.img = frames[frames.length-1]
                let fadeOutFramesCount = 8;
                let aChange = easing.fast({ from: 1, to: 0.5, steps: fadeOutFramesCount, fadeOutFramesCount, type: 'linear', round: 2})
                let frames = PP.createImage(FoggyBridgeScene.models.car1Frames);

                let part1 = frames.slice(0, frames.length-5);
                let part2 = frames.slice(frames.length-5);
                let part2Doubled = [];
                for(let i = 0; i < part2.length; i++) {
                    part2Doubled.push(part2[i])
                    part2Doubled.push(part2[i])
                }

                frames = 
                [
                    ...part1,
                    ...part2Doubled
                ];

                frames = frames.map((f, i, fr) => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 1;
                    if(i > fr.length-fadeOutFramesCount) {
                        ctx.globalAlpha = aChange[i - (fr.length-fadeOutFramesCount)];
                    }

                    //console.log(`frameIndex: ${i} from ${fr.length} alpha set to: ${ctx.globalAlpha}`)

                    ctx.drawImage(f, 0,0);
                }))

                let totalAnimationFrames = 250;
                let totalFrames = 600;
                let startFrame = 100;
                let framesChangeIndicies = easing.fast({ from: 0, to: frames.length-1, steps: totalAnimationFrames, type: 'linear', round: 0});

                this.currentFrame = 0;
                //this.img = frames[framesChangeIndicies[this.currentFrame]];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    if(this.currentFrame > startFrame && this.currentFrame <= startFrame + totalAnimationFrames ){
                        this.img = frames[framesChangeIndicies[this.currentFrame-startFrame]];
                    }
                    else {
                        this.img = undefined
                    }

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }
                })

            }
        }), layersData.car2.renderIndex+3)

        this.signal_lights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.lightsImg = PP.createImage(model, { renderOnly: ['car2_yellow'] });

                this.currentFrame = 0;
                let totalFrames = 30;
                let state = false;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        state = !state;
                        
                        this.img = state ? this.lightsImg : undefined;
                    }
                })
            }
        }), layersData.car2.renderIndex+1)
    }
}