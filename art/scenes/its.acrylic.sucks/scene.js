class ItsAcrylicSucksKingsScene extends Scene {
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
                size: new V2(1500,2680),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'kings',
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
            img: PP.createImage(ItsAcrylicSucksKingsScene.models.floor)
            
        }), 1)

        this.animation = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -67)),
            size: new V2(150,134),
            frames: PP.createImage(ItsAcrylicSucksKingsScene.models.main),
            init() {
                this.registerFramesDefaultTimer({ originFrameChangeDelay: 8,
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    } 
                });
            }
        }), 10)
    }
}