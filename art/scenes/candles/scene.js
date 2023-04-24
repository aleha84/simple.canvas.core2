class CandlesScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1500,1130),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'candle2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.candle = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CandlesScene.models.candle2);
                this.registerFramesDefaultTimer({ 
                    originFrameChangeDelay: 6,
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                 });
            }
        }), 1)
    }
}