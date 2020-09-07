class JustreeScreamScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,   
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'scream'
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
            })
        }), 1)

        this.scream = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,100),
            frames: PP.createImage(JustreeScreamScene.model.mainFrames),
            init() {
                // let mask = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('white').rect(0,0,size.x, size.y/2);

                //     let widthValues = easing.fast({from: size.x/2, to: 0, steps: size.y/2, type: 'cubic', method: 'in', round: 0 });
                //     for(let i = 0; i < size.y/2;i++){
                //         let width = widthValues[i];
                //         hlp.setFillColor('white').rect((size.x/2) - width, i + size.y/2, width*2, 1);

                //         let opacityCount = fast.r(((size.x/2)-width)/2);
                //         let oValues = easing.fast({ from: 1, to: 0, steps: opacityCount,type: 'quad', method: 'in', round: 2 });
                //         for(let j = 0; j < opacityCount; j++){
                //             hlp.setFillColor(`rgba(255,255,255,${oValues[j]})`)
                //                 .dot((size.x/2) - width - j, i + size.y/2)
                //                 .dot((size.x/2) + width + j, i + size.y/2)
                //         }
                //     }
                // })

                // this.frames = this.frames.map(frame => {
                //     return createCanvas(this.size, (ctx, size, hlp) => {
                //         ctx.drawImage(frame, 0, 0);
                //         ctx.drawImage(mask, 0, 0);
                //     })
                // })

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 5;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 20)
    }
}