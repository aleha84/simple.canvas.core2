class Tu2Scene extends Scene {
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
        let model = Tu2Scene.models.main;
        // for(let i = 0; i < model.main.layers.length; i++){
        //     let layerName = model.main.layers[i].name;

        //     this.addGo(new GO({
        //         position: this.sceneCenter,
        //         size: this.viewport,
        //         init() {
        //             this.img = PP.createImage(model, { renderOnly: [layerName] })
        //         }
        //     }), i*10)
        // }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 0)

        this.second_plane = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = PP.createImage(model, { renderOnly: ['second_plane'] })
            }
        }), 10)

        this.main_plane = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = PP.createImage(model, { renderOnly: ['main_plane'] })
            }
        }), 20)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createCloudFrames({framesCount, layersData, cloudImage, size}) {
                let frames = [];
                 
                let doubleImage = createCanvas(new V2(size.x*2, size.y), (ctx, size, hlp) => {
                    ctx.drawImage(cloudImage, 0, 0);
                    ctx.drawImage(cloudImage, size.x/2, 0);
                })

                let xValues = easing.fast({ from: -size.x, to: 0, steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(doubleImage, xValues[f], 0)
                    });
                }
                
                return frames;
            },
            init() {
                let cloudImage = PP.createImage(model, { renderOnly: ['clouds'] })

                let size = this.size;

                let layersData = [
                    { framesCount: 600, size, cloudImage, yShift: 0},
                    { framesCount: 300, size, cloudImage, yShift: 10},
                    { framesCount: 150, size, cloudImage, yShift: 20}
                ];
                this.layers = layersData.map(layer => {
                    this.addChild(new GO({
                        position: new V2(0, layer.yShift),
                        size,
                        frames: this.createCloudFrames(layer),
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            
                            this.timer = this.regTimerDefault(10, () => {
                            
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                }
            
                                this.img = this.frames[this.currentFrame];
                            })
                        }
                    }))
                })


                // this.frames = this.createCloudFrames({ framesCount: 600, 
                //     // layersData: [
                //     // { framesCount: 600, }
                //     // { framesCount: 300, }
                //     // { framesCount: 150, }
                // ], cloudImage, size: this.size });

                
            }
        }), 30)
    }
}