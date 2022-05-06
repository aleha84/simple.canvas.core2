class FlyScene extends Scene {
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
                size: new V2(166,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'fly',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(FlyScene.models.main, { renderOnly: ['bg', 'bg_d2', 'moon'], forceVisibility: { bg_d2: { visible: true } } })
            }
        }), 1)

        this.wing = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(FlyScene.models.main, { renderOnly: ['wing'], forceVisibility: { wing: { visible: true } } })
            }
        }), 10)

        this.illuminator = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(FlyScene.models.main, { renderOnly: ['illuminator'], forceVisibility: { illuminator: { visible: true } } })
            }
        }), 15)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames() {
                let totalFrames = 540;

                let clouds_l3_p_frames = animationHelpers.createMovementFrames({
                    framesCount: totalFrames, itemFrameslength: [50,100], 
                    pointsData: animationHelpers.extractPointData(FlyScene.models.main.main.layers.find(l => l.name == 'clouds_l3_p')), 
                    size: this.size 
                })

                let clouds_l2_p_frames = animationHelpers.createMovementFrames({
                    framesCount: totalFrames, itemFrameslength: [50,100], 
                    pointsData: animationHelpers.extractPointData(FlyScene.models.main.main.layers.find(l => l.name == 'clouds_l2_p')), 
                    size: this.size 
                })

                let layersCount = 4;
                let lImgs = new Array(layersCount).fill().map((el, i) => PP.createImage(FlyScene.models.main, { renderOnly: ['clouds_l' + i], forceVisibility: {['clouds_l' + i]: {visible: true}} }))
                let repeats = new Array(layersCount).fill().map((el, i) => Math.pow(2, layersCount - (i+1)))
                let xValues = new Array(layersCount).fill().map((el, i) => 
                    easing.fast({ 
                        from: 0, 
                        to: fast.f(this.size.x/repeats[i]), 
                        //to: 0,
                        steps: totalFrames, 
                        type: 'linear', 
                        round: 0 })
                )

                let frames = [];

                for(let f = 0; f < totalFrames; f++) {
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let l=0;l<layersCount;l++) {
                            for(let li = 0; li < repeats[l]+1; li++) {
                                ctx.drawImage(lImgs[l], -fast.f(li*this.size.x/repeats[l]) + xValues[l][f], 0)

                                if(l == 3) {
                                    ctx.drawImage(clouds_l3_p_frames[f], -fast.f(li*this.size.x/repeats[l]) + xValues[l][f], 0)
                                }

                                if(l == 2) {
                                    ctx.drawImage(clouds_l2_p_frames[f], -fast.f(li*this.size.x/repeats[l]) + xValues[l][f], 0)
                                }
                            }
                        }

           
                    })
                }

                return frames;
            },
            init() {
                this.frames = this.createFrames();
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 5)
    }
}