class CandleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'candle'
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
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y)
                })
            }
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-13, -10)),
            size: new V2(100, 60),
            init() {
                this.frames = PP.createImage(CandleScene.models.main, { colorsSubstitutions: {
                    '#00fd00': { color: '#FFFDFF', changeFillColor: true }
                } })

                let originFrameChangeDelay = 7
                let repeat = 3;
                this.registerFramesDefaultTimer({originFrameChangeDelay, framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }});

                let candleTotalFrames = this.frames.length*originFrameChangeDelay;
                console.log('candle frames: ' + candleTotalFrames);

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: candleTotalFrames, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(CandleScene.models.main.main[0].layers.find(l => l.name == 'p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)        
    }
}