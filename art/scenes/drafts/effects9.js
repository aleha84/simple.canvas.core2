class Effects9Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            events: {
                up: (upObj) => {
                    this.addItem({
                        position: upObj.state.logicalPosition
                    })
                }
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    addItem({
        position
    }) {
        
        this.addGo(new GO({
            position: position.clone(),
            size: new V2(30, 30),
            frames: this.effectsFrames[getRandomInt(0, this.effectsFrames.length-1)],
            // debug: true,
            // logInDebug: true,
            init() {
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.setDead();
                    }
                });
            }
        }), 1)
        
    }

    items = [];

    createFrames1() {
        let framesLength = 60;
        let spriteSize = new V2(30, 30);
        let center = spriteSize.divide(2);
        let maxDistance = spriteSize.x - center.x - 1;
        let minDistance = 2;
        let data = new Array(50).fill().map(i => {
            let direction = V2.up.rotate(getRandomInt(0, 359));
            let points = this.appSharedPP.lineV2(center,center.add(direction.mul(getRandomInt(minDistance, maxDistance))));
            let pointIndicesValues = easing.fast({ from: 0, to: points.length-1, steps: framesLength, type: 'quad', method: 'out', round: 0 });

            let aValues = easing.fast({from: 1, to: 0, steps: framesLength, type: 'quad', method: 'out', round: 2})

            let frames = [];

            for(let f = 0; f < framesLength; f++) {
                frames.push({
                    p: points[pointIndicesValues[f]],
                    a: aValues[f]
                })
            }

            return {
                frames
            };
        }) 

        let frames = []

        for(let f = 0; f < framesLength; f++) {
            frames.push(createCanvas(spriteSize, (ctx, size, hlp) => {
                // hlp.setFillColor('red')
                // .rect(0,0,size.x, 1)
                // .rect(size.x-1, 0, 1, size.y)
                // .rect(0,size.y-1, size.x, 1)
                // .rect(0,0,1, size.y)
                
                for(let i = 0; i < data.length; i++) {
                    hlp.setFillColor(this.whiteColorPrefix + data[i].frames[f].a + ')').dot(data[i].frames[f].p)
                }
            }))
        }

        return frames;
    }

    start(){
        //let model = Effects9Scene.models.main;
        this.whiteColorPrefix = 'rgba(255,255,255,';
        this.appSharedPP = PP.createNonDrawingInstance();
        //

        this.effectsFrames = [];

        for(let i = 0; i < 10; i++) {
            this.effectsFrames.push(this.createFrames1());
        }

    }
}