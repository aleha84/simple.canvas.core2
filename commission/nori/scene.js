class NoriBotwScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
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
        let model = NoriBotwScene.models.main;
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model),
            init() {
                //
            }
        }), 1)


        this.flowersAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 200;
                let totalAnimationFrames = 80;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'a1',
                        animationStartFrame: 0,
                    },
                    {
                        layerName: 'a4',
                        animationStartFrame: 5,
                    },
                    {
                        layerName: 'a3',
                        animationStartFrame: 10,
                    },
                    {
                        layerName: 'a2',
                        animationStartFrame: 15,
                    },
                    {
                        layerName: 'a5',
                        animationStartFrame: 20,
                    },
                    
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(NoriBotwScene.models.grassAni1, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        let oneFrameShift = oneFrame + getRandomInt(0,5);

                        let v = 0;
                        for(let i = 0; i < totalFrames; i++){
                            if(i%oneFrameShift == 0){
                                v = v==0? 1: 0;
                            }

                            let index = p.animationStartFrame+i;
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = v;
                        }

                        let animationStartFrame = p.animationStartFrame;

                        let animationFramesIndexValues = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                        ]


                        for(let i = 0; i < animationFramesIndexValues.length; i++){
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
        }), 20)
    }
}