class NoriBotwScene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(1600,896),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'nori_botw'
            }
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
            img: PP.createImage(model, { exclude: ['grass_p', 'tree_p', 'ruins_p'] }),
            init() {
                //
            }
        }), 1)

        this.fog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(NoriBotwScene.models.fogAnimation),
            init() {
                let totalFrames = 100;

                let framesIndexValues = easing.fast({ from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', method: 'base', round: 0})

                this.currentFrame = 0;
                this.img = this.frames[fast.f(this.currentFrame/10)] //this.frames[framesIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[fast.f(this.currentFrame/10)] //this.frames[framesIndexValues[this.currentFrame]];
                })
            }
        }), 5)

        this.p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.grass_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'grass_p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.ruins_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 120, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ruins_p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.grassAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 200;
                let totalAnimationFrames = 80;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'a1',
                        animationStartFrame: 10,
                    },
                    {
                        layerName: 'a2',
                        animationStartFrame: 15,
                    },
                    {
                        layerName: 'a3',
                        animationStartFrame: 20,
                    },
                    {
                        layerName: 'a4',
                        animationStartFrame: 25,
                    },
                    {
                        layerName: 'a5',
                        animationStartFrame: 30,
                    },
                    {
                        layerName: 'a6',
                        animationStartFrame: 35,
                    },
                    {
                        layerName: 'a7',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'b1',
                        animationStartFrame: 20,
                    },
                    {
                        layerName: 'b2',
                        animationStartFrame: 25,
                    },
                    {
                        layerName: 'b3',
                        animationStartFrame: 30,
                    },
                    {
                        layerName: 'b4',
                        animationStartFrame: 35,
                    },
                    {
                        layerName: 'b5',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'b6',
                        animationStartFrame: 45,
                    },
                    {
                        layerName: 'b7',
                        animationStartFrame: 50,
                    },
                    {
                        layerName: 'b8',
                        animationStartFrame: 55,
                    },
                    {
                        layerName: 'b9',
                        animationStartFrame: 60,
                    },
                    {
                        layerName: 'b10',
                        animationStartFrame: 65,
                    }
                    
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(NoriBotwScene.models.grassAni2Alter, { renderOnly: [p.layerName] }),
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
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'linear', method: 'base', round: 0})
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
        }), 15)

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
                    {
                        layerName: 'a6',
                        animationStartFrame: 25,
                    },
                    {
                        layerName: 'a7',
                        animationStartFrame: 30,
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
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'linear', method: 'base', round: 0})
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

        this.treeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.tree_p = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    createTreeFrames({framesCount, pointsData, itemFrameslength, size}) {
                        let frames = [];
                        let pos = [new V2(-1, 0), new V2(-1, -1,), new V2(0, -1), new V2(0,0)]
                        let pChange = easing.fast({ from: 0, to: pos.length-1, steps: itemFrameslength, type: 'linear', round: 0 });
                        
                        let itemsData = pointsData.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let _p = getRandomInt(0, pos.length-1);

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                let pIndex = _p + pChange[f];
                                if(pIndex > (pos.length-1))
                                    pIndex-= pos.length;

                                frames[frameIndex] = {
                                    pIndex,
                                };
                            }
                        
                            return {
                                pd: el,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let pc = pos[itemData.frames[f].pIndex];
                                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x + pc.x, itemData.pd.point.y + pc.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createTreeFrames({ framesCount: 200, itemFrameslength: 80, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) });
            
                        let repeat = 2;
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => { 
                                repeat--;
                                if(repeat == 0)
                                    this.parent.parentScene.capturing.stop = true; 
                                }
                        });
                    }
                 }))

                let totalFrames = 400;
                let totalAnimationFrames = 120;
                let oneFrame = 100;

                let aniParams = [
                    {
                        layerName: 'tr1',
                        animationStartFrame: 10,
                    },
                    {
                        layerName: 'tr2',
                        animationStartFrame: 15,
                    },
                    {
                        layerName: 'tr3',
                        animationStartFrame: 35,
                    },
                    {
                        layerName: 'tr4',
                        animationStartFrame: 40,
                    },
                    {
                        layerName: 'tr5',
                        animationStartFrame: 45,
                    }
                    
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(NoriBotwScene.models.grassAni2Alter, { renderOnly: [p.layerName] }),
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
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'linear', method: 'base', round: 0})
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
        }), 25)

        this.girlAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.blink = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    isVisible: false,
                    img: PP.createImage(NoriBotwScene.models.blink),
                    init() {
                        let blinkFramesLengthOrigin = 10;
                        let totalFrames = 200;
                        let blinkAt = 150;
                        let blinkFramesLength = blinkFramesLengthOrigin;

                        this.currentFrame = 0;
                        
                        this.timer = this.regTimerDefault(15, () => {
                            if(this.isVisible) {
                                blinkFramesLength--;

                                if(blinkFramesLength <= 0)
                                    this.isVisible = false;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }

                            if(this.currentFrame == blinkAt) {
                                this.isVisible = true;
                                blinkFramesLength = blinkFramesLengthOrigin;
                            }
                        })
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    //frames: PP.createImage(NoriBotwScene.models.hairs),
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(NoriBotwScene.models.girl_p.main.layers[0]) });
            
                        this.registerFramesDefaultTimer({});
                        // let totalFrames = 100;

                        // let framesIndexValues = easing.fast({ from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', method: 'base', round: 0})

                        // this.currentFrame = 0;
                        // this.img = this.frames[fast.f(this.currentFrame/this.frames.length)] //this.frames[framesIndexValues[this.currentFrame]];
                        
                        // this.timer = this.regTimerDefault(10, () => {
                            
                        //     this.currentFrame++;
                        //     if(this.currentFrame == totalFrames){
                        //         this.currentFrame = 0;
                        //     }

                        //     this.img = this.frames[fast.f(this.currentFrame/this.frames.length)] //this.frames[framesIndexValues[this.currentFrame]];
                        // })
                    }
                }))
            }
        }), 30)
    }
}