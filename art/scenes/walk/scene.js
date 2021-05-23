class WalkScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
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

            init() {
                this.img = PP.createImage(WalkScene.models.main, { renderOnly: ['bg'] });

                this.clouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 300;
                        this.frames = [];

                        let img = PP.createImage(WalkScene.models.main, { renderOnly: ['clouds'] });
                        let xChange = easing.fast({ from: 0, to: 20, steps: totalFrames, type: 'linear', round: 0})
                        let aValues = [
                            ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'sin', method: 'out', round: 1}),
                            ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'sin', method: 'in', round: 1})
                        ]
                        this.mainFr = [];
                        for(let f = 0; f < totalFrames; f++){
                            this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[f];
                                ctx.drawImage(img, xChange[f], 0);
                            })
                        }

                        let startFrameIndex = totalFrames/2;
                        for(let f = 0; f < totalFrames; f++){

                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (totalFrames-1)){
                                frameIndex-=totalFrames;
                            }

                            this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.mainFr[frameIndex], 0, 0);
                                ctx.drawImage(this.mainFr[f], 0, 0);
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.clouds2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 300;
                        this.frames = [];

                        let img = PP.createImage(WalkScene.models.main, { renderOnly: ['clouds2'] });
                        let xChange = easing.fast({ from: 0, to: 10, steps: totalFrames, type: 'linear', round: 0})
                        let aValues = [
                            ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'sin', method: 'out', round: 1}),
                            ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'sin', method: 'in', round: 1})
                        ]

                        this.mainFr = [];
                        for(let f = 0; f < totalFrames; f++){
                            this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = aValues[f];
                                ctx.drawImage(img, xChange[f], 0);
                            })
                        }


                        let startFrameIndex = totalFrames/2;
                        for(let f = 0; f < totalFrames; f++){

                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (totalFrames-1)){
                                frameIndex-=totalFrames;
                            }

                            this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.mainFr[frameIndex], 0, 0);
                                ctx.drawImage(this.mainFr[f], 0, 0);
                            })
                        }

                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))

                // this.p = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let targetColors = ['#84BDF5', '#61b1f2', '#9eccfa', ]
                //         let t = this.parent.img;
                //         let pixelsData = getPixels(t, this.size);

                //         let pData = [];
                //         pixelsData.forEach(pd => {
                //             if(getRandomInt(0, 1) == 0) {
                //                 let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                //                 if(targetColors.indexOf(color) != -1){
                //                     pData[pData.length] = { point: pd.position.clone(), color } 
                //                 }
                //             }
                            
                //         });

                //         this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, pointsData: pData, itemFrameslength: 150, size: this.size })

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 1)

        this.bushes = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -10)),
            size: this.viewport.clone(),

            init() {
                this.img1 = PP.createImage(WalkScene.models.main, { renderOnly: ['bushes', 'bushes_up'] });
                
                let totalFrames = 320;
                this.frames = [];

                let xChange = easing.fast({from: 0, to: -this.size.x, steps: totalFrames, type: 'linear', round: 0});

                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img1, xChange[i] - this.size.x/2, 0)
                        ctx.drawImage(this.img1, xChange[i] + this.size.x/2, 0)
                        ctx.drawImage(this.img1, xChange[i] + fast.r(this.size.x*3/2), 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 3)

        this.street = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),

            init() {



                this.img1 = PP.createImage(WalkScene.models.main, { renderOnly: ['bushes', 'street', 'lamp'] });
                //this.img2 = PP.createImage(WalkScene.models.main, { renderOnly: ['bushes', 'street', 'lamp'] });
                let totalFrames = 226;
                this.frames = [];

                let xChange = easing.fast({from: 0, to: -this.size.x, steps: totalFrames, type: 'linear', round: 0});

                let targetColors = ['#9ac83e', '#71ac38', '#42821c', '#32611d', '#223f1e', '#07140b']
                let t = PP.createImage(WalkScene.models.main, { renderOnly: ['bushes'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(pd.position.y < 132){
                        if(getRandomInt(0, 5) == 0) {
                            let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });
    
                            if(targetColors.indexOf(color) != -1){
                                pData[pData.length] = { point: pd.position.clone(), color } 
                            }
                        }
                    }
                    
                });

                this.pRotFrames = animationHelpers.createMovementRotFrames({ framesCount: totalFrames, pointsData: pData, itemFrameslength: 50, size: this.size })


                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img1, xChange[i], 0)
                        ctx.drawImage(this.pRotFrames[i], xChange[i], 0)
                        ctx.drawImage(this.img1, xChange[i] + this.size.x, 0)
                        ctx.drawImage(this.pRotFrames[i], xChange[i] + this.size.x, 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 6)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),

            init() {
                this.img1 = PP.createImage(WalkScene.models.main, { renderOnly: ['road'] });
                let totalFrames = 226;
                this.frames = [];

                let xChange = easing.fast({from: 0, to: -this.size.x, steps: totalFrames, type: 'linear', round: 0});

                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img1, xChange[i], 0)
                        ctx.drawImage(this.img1, xChange[i] + this.size.x, 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 7)

        this.road2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),

            init() {
                this.img1 = PP.createImage(WalkScene.models.main, { renderOnly: ['road2'] });
                let totalFrames = 200;
                this.frames = [];

                let xChange = easing.fast({from: 0, to: -this.size.x, steps: totalFrames, type: 'linear', round: 0});

                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img1, xChange[i], 0)
                        ctx.drawImage(this.img1, xChange[i] + this.size.x, 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 9)

        this.road3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),

            init() {
                this.img1 = PP.createImage(WalkScene.models.main, { renderOnly: ['road3'] });
                let totalFrames = 150;
                this.frames = [];

                let xChange = easing.fast({from: 0, to: -this.size.x, steps: totalFrames, type: 'linear', round: 0});

                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.img1, xChange[i], 0)
                        ctx.drawImage(this.img1, xChange[i] + this.size.x, 0)
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 9)

        this.walk = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -1)),
            size: new V2(200, 112),
            init() {
                this.frames = PP.createImage(WalkScene.models.walk);
                let totalFrames = 90;

                let framesIndexValues = easing.fast({ from: 0, to: this.frames.length-1, steps: totalFrames, type: 'linear', round: 0})

                this.currentFrame = 0;
                this.img = this.frames[framesIndexValues[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[framesIndexValues[this.currentFrame]];
                })
            }
        }), 10)

        // this.car = this.addGo(new GO({
        //     position: new V2(1000, this.sceneCenter.y+ 30),
        //     size: new V2(237,90),
        //     img: PP.createImage(WalkScene.models.car),
        //     init() {
        //         this.position.x = this.parentScene.viewport.x + this.size.x/2;

        //         let totalFrames = 20
        //         let xChange = easing.fast({ from: this.position.x, to: -this.size.x/2, steps: totalFrames, type: 'linear', round: 0 });

        //         this.currentFrame = 0;
        //         let delay = 300;
                
        //         this.timer = this.regTimerDefault(10, () => {
        //             if(delay > 0){
        //                 delay--;
        //                 return;
        //             }

        //             this.currentFrame++;
        //             if(this.currentFrame == totalFrames){
        //                 this.currentFrame = 0;
        //                 delay = 300;
        //             }

        //             this.position.x = xChange[this.currentFrame];
        //             this.needRecalcRenderProperties = true;
        //         })
        //     }
        // }), 20)
    }
}