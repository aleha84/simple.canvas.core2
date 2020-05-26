class Demo10SailorsScene extends Scene {
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
        var model = Demo10SailorsScene.models.main;
        let excludes = ['bg_overlay'];
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(excludes.indexOf(name) == -1)
                this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}),
                    init() {
                        if(name == 'ship' || name == 'sailors'){
                            let yClamps = [this.position.y, this.position.y+2];
                            let framesCount = 100;
                            let yValues1 = easing.fast({from: yClamps[0], to: yClamps[1], steps: framesCount, type:'sin', method: 'inOut'}).map(v => fast.r(v))
                            let yValues2 = easing.fast({from: yClamps[1], to: yClamps[0], steps: framesCount, type:'sin', method: 'inOut'}).map(v => fast.r(v))
                            let yValues = [...yValues1, ...yValues2];
                            let currentIndex = 0;
                            this.timer = this.regTimerDefault(15, () => {
                                this.position.y = yValues[currentIndex++];
                                if(currentIndex >= yValues.length){
                                    currentIndex = 0;
                                }
                                
                                this.needRecalcRenderProperties = true;
                            })
                        }

                        if(name == 'earth'){
                            let frames = [];
                            let color = 'rgba(0,0,0,0.1)';
                            let framesCount = 100, itemsCount = 500;
                            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                let dot = new V2(getRandomInt(125,149), getRandomInt(0,60));
                                let startFrameIndex = getRandomInt(0, framesCount-1);
                                let totalFrames = getRandomInt(20,40);
                                let frames = [];
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
            
                                    frames[frameIndex] = true;
                                }

                                return {
                                    dot,
                                    frames
                                }
                            })

                            let earth = PP.createImage(model, {renderOnly: ['earth']})
                            for(let f = 0; f < framesCount; f++){
                                frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.drawImage(earth, 0,0);
                                    ctx.globalCompositeOperation = 'source-atop';
                                    for(let p = 0; p < itemsData.length; p++){
                                        let itemData = itemsData[p];
                                        
                                        if(!itemData.frames[f]){
                                            let dot = itemData.dot;
                                            hlp.setFillColor(color).dot(dot.x, dot.y)
                                        }
                                        
                                    }
                                });
                            }

                            this.frames = frames;
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            
                            this.timer = this.regTimerDefault(15, () => {
                            
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    
                    }
                }), l*10)
        }

        this.starsBg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createStarsFrames({framesCount, itemsCount, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let y = fast.r(getRandomGaussian(0, size.y*3, 4));//
                    if(getRandomInt(0,5) == 0){
                        y = fast.r(getRandomGaussian(0, (size.y/2) - 10));
                    }
                    let x = getRandomInt(0, size.x);
                    let opacity = fast.r(getRandom(0, 0.1),3);

                    let frames = [];
                    
                    if(getRandomInt(0,10) == 0){
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = getRandomInt(5,10);
                        
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
    
                            frames[frameIndex] = true;
                        }
                    }
                    


                    return {
                        p: new V2(x,y),
                        color: `rgba(240,255,255, ${opacity})`,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(!itemData.frames[f]){
                                let dot = itemData.p;
                                hlp.setFillColor(itemData.color).dot(dot.x, dot.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({framesCount:100, itemsCount: 3000, size: this.size});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 1)

        this.particlesFar = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createParticlesFrames({framesCount, itemsCount, size, direction, totalFrames, color, tail}) {
                let frames = [];
                let vLine = createLine(new V2(size.x, -size.y), new V2(size.x, size.y*2));

                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});

                let pp = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    pp = new PerfectPixel({ctx});
                })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let p1 = new V2(0, getRandomInt(-size.y/2, size.y));
                    let p2 = raySegmentIntersectionVector2(p1, direction, vLine).toInt();
                    let dots = pp.lineV2(p1, p2);

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    //let totalFrames = getRandomInt(5,10);
                    
                    let indexValues = easing.fast({from: 0, to: dots.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            index: indexValues[f]
                        };
                    }

                    return {
                        dots,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let dot = itemData.dots[itemData.frames[f].index];
                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false})).dot(dot.x, dot.y)

                                let opacityValues = easing.fast({from:color.opacity, to: 0.05, steps: tail, type: 'quad', method: 'out' })
                                for(let t = 1; t <= tail; t++){
                                    let _index = itemData.frames[f].index - t;
                                    if(_index < 0)
                                        continue;

                                    let _dot = itemData.dots[_index];
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacityValues[t-1]], isObject: false})).dot(_dot.x, _dot.y)
                                }
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let layers = [
                    this.createParticlesFrames({ framesCount: 200, itemsCount: 200, size: this.size, direction: V2.right.rotate(5), totalFrames: 75, tail:5, color: 'rgba(255,255,255,0.1)'  }),
                    this.createParticlesFrames({ framesCount: 200, itemsCount: 100, size: this.size, direction: V2.right.rotate(5), totalFrames: 50, tail:10, color: 'rgba(255,255,255,0.25)'  }),
                    this.createParticlesFrames({ framesCount: 200, itemsCount: 50, size: this.size, direction: V2.right.rotate(5), totalFrames: 25, tail:20, color: 'rgba(255,255,255,0.5)'  }),
                ]

                this.particles = layers.map(layer => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: layer,
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
                            
                            this.timer = this.regTimerDefault(15, () => {
                            
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    }))
                    );
                
            }
        }), 11)

        this.frontalParticles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.particlesFar.createParticlesFrames({ framesCount: 200, itemsCount: 25, size: this.viewport, direction: V2.right.rotate(5), totalFrames: 15, tail:40, color: 'rgba(255,255,255,0.75)'  }),
            init() {
                let rfc = 3;
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        // rfc--;

                        //         if(rfc == 0){
                        //             rfc = 4;

                        //             if(!this.redFrame){
                        //                 this.redFrame = this.addChild(new GO({
                        //                     position: new V2(),
                        //                     size: this.size,
                        //                     img: createCanvas(this.size, (ctx, size, hlp) => {
                        //                         hlp.setFillColor('red').rect(0,0, 50,50)
                        //                     })
                        //                 }));
                        //             }
                        //             else {
                        //                 this.removeChild(this.redFrame);
                        //                 this.redFrame = undefined;
                        //             }
                        //         }
                    }
                })
            }
        }), 31)
    }
}