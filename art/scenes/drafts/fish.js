class FishScene extends Scene {
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
                size: new V2(100,100),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'fish',
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
        this.fish = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                // this.frames = [];
                // for(let f = 0; f < FishScene.models.main.main.length; f++) {
                //     this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //         let 
                //     })
                // }

                this.frames = PP.createImage(FishScene.models.main, { layerSeparateCanvas: true });
                this.registerFramesDefaultTimer({ originFrameChangeDelay: 5,
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    } });
            }
        }), 1)
        
    }
}