class Turbo2Scene extends Scene {
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

        let model = Turbo2Scene.models.main;
        let layersData = {};
        let exclude = [
            
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

        //sky

        //ocean

        //island

        //tree
        this.teeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let totalAnimationFrames = 250;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'l1', animationStartFrame: 0,
                    },
                    {
                        layerName: 'l2', animationStartFrame: 10,
                    },
                    {
                        layerName: 'l3', animationStartFrame: 15,
                    },
                    {
                        layerName: 'l4', animationStartFrame: 20,
                    },
                    {
                        layerName: 'l5', animationStartFrame: 30,
                    },
                    {
                        layerName: 'l6', animationStartFrame: 35,
                    },
                    {
                        layerName: 'l7', animationStartFrame: 40,
                    },
                    {
                        layerName: 'l8', animationStartFrame: 40,
                    },
                    { layerName: 'l9', animationStartFrame: 45 },
                    { layerName: 'l10', animationStartFrame: 50 },
                    { layerName: 'l11', animationStartFrame: 60 },
                    { layerName: 'l12', animationStartFrame: 65 },
                    { layerName: 'l13', animationStartFrame: 20 },
                    { layerName: 'l14', animationStartFrame: 30 },
                    { layerName: 'l15', animationStartFrame: 35 },
                    { layerName: 'l16', animationStartFrame: 40},
                    { layerName: 'l17', animationStartFrame: 55},
                    { layerName: 'l18', animationStartFrame: 65},
                    { layerName: 'l19', animationStartFrame: 60},
                    { layerName: 'l20', animationStartFrame: 55},
                    { layerName: 'l21', animationStartFrame: 40},
                    { layerName: 'l22', animationStartFrame: 35},
                    { layerName: 'l23', animationStartFrame: 25},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Turbo2Scene.models.treeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        //let oneFrameShift = oneFrame + getRandomInt(0,5);

                        // let v = 0;
                        // for(let i = 0; i < totalFrames; i++){
                        //     // if(i%oneFrameShift == 0){
                        //     //     v = v==0? 1: 0;
                        //     // }

                        //     let index = p.animationStartFrame+i;
                        //     if(index > (totalFrames-1)){
                        //         index-=totalFrames;
                        //     }

                        //     framesIndexValues[index] = v;
                        // }

                        let animationStartFrame = p.animationStartFrame;

                        //animationStartFrame = getRandomInt(0, totalFrames-1);

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
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
        }), layersData.tree.renderIndex+1)

        //bushes

        //stolbs

        //road

        //car
    }
}