class ShigureUIScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(144,256).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'ShigureUI',
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
        let model = ShigureUIScene.models.model;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => { hlp.setFillColor('#00ff04').dot(0,0) })
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let skip = 5;
                this.frames = PP.createImage(model, { renderOnly: ['m_1'] }).slice(skip);
                let repeats = ShigureUIScene.models.repeats.slice(skip);

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let currentRepeats = repeats[this.currentFrame];
                
                this.timer = this.regTimerDefault(20, () => {
                    if(currentRepeats > 0){
                        currentRepeats--;
                        return;
                    }

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                    
                    this.img = this.frames[this.currentFrame];
                    currentRepeats = repeats[this.currentFrame];
                })
            }
        }), 2)
    }
}