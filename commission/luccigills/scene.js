class LuccigillsDesertScene extends Scene {
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

        this.smoke2 = this.addGo(new GO({
            size: new V2(20, 60),
            position: new V2(125, 77),
            frames: PP.createImage(LuccigillsDesertScene.models.smoke3),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.frameChangeDelay = 10;
                this.timer = this.regTimerDefault(15, () => {
                    0
                    this.img = this.frames[this.currentFrame];
                    
                    this.frameChangeDelay--;

                    if(this.frameChangeDelay == 0){
                        this.currentFrame++;
                        this.frameChangeDelay= 10;
                    }

                    
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        
                    }
                })
            },
            
        }), 19);

        this.landscape = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(LuccigillsDesertScene.models.main)
                }))

                let model = LuccigillsDesertScene.models.glow;

                this.glow1 = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    frames: this.createGlowFrames({ framesCount: 100, layer: model.main.layers[0], size: this.size, mClamps:[0,1.5] }),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];

                        this.timer = this.regTimerDefault(15, () => {

                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                if(!this.redFrame){
                                        this.redFrame = this.addChild(new GO({
                                            position: new V2(),
                                            size: this.size,
                                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                                hlp.setFillColor('red').rect(0,0, 50,50)
                                            })
                                        }));
                                    }
                                    else {
                                        this.removeChild(this.redFrame);
                                        this.redFrame = undefined;
                                    }
                            }
                        })
                    },
                    
                }));

                // this.glow2 = this.addChild(new GO({
                //     size: this.size,
                //     position: new V2(),
                //     frames: this.createGlowFrames({ framesCount: 100, layer: model.main.layers[1], size: this.size, mClamps:[0,1.25] }),
                //     init() {
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];

                //         this.timer = this.regTimerDefault(15, () => {

                //             this.img = this.frames[this.currentFrame];
                //             this.currentFrame++;
                //             if(this.currentFrame == this.frames.length){
                //                 this.currentFrame = 0;
                //             }
                //         })
                //     },
                    
                // }));

                this.planet = this.addChild(new GO({
                    size: new V2(45,19),
                    position: new V2(-40,-40),
                    img: PP.createImage(LuccigillsDesertScene.models.planet)
                }));

                

                this.createShootingStarFrames = ({size, framesCount, aMax}) => {
                    let yValues = easing.fast({from: size.y-1, to: 0, steps: size.x, type: 'quad', method: 'out'});
                    let dotsRaw = yValues.map((y, x) => new V2(x,y));
                    let dots = [];
                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        let pp = new PerfectPixel({ctx});
                        for(let i = 1; i < dotsRaw.length; i++){
                            dots.push(...pp.lineV2(dotsRaw[i-1], dotsRaw[i]));
                        }
                    })

                    dots = distinct(dots, d => d.x+ '_' + d.y);

                    // this.img = createCanvas(size, (ctx, size, hlp) => {
                    //     hlp.setFillColor('white')//.strokeRect(0,0,size.x, size.y)
                    //     dots.forEach(d => hlp.dot(d.x,d.y))
                    // })

                    //let framesCount = 50;
                    let frames = [];
                       
                    let indexValues = easing.fast({from: dots.length-1 - 50, to: 0, steps: framesCount, type: 'quad', method: 'out'})
                                        .map(index => fast.r(index));

                    let aValues = [
                        ...easing.fast({from: 0, to: 0.5, steps: aMax, type: 'quad', method: 'out'}),
                        ...easing.fast({from: 0.5, to: 0, steps: framesCount-aMax, type: 'quad', method: 'in'})
                    ]
                    
                    // let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    //     return {
                    //         // other values
                    //         //initialIndex: getRandomInt(0, framesCount-1)
                    //     }
                    // })
                    let color = "#FFEFA4";

                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            let index = indexValues[f];
                            let point = dots[index];
                            let opacity = aValues[f];
                            
                            hlp.setFillColor(`rgba(${hexToRgb(color)},${opacity})`).dot(point.x, point.y);
                            
                            let _aValues = easing.fast({from: opacity, to: opacity/2, steps: index >dots.length/2 ? ((dots.length-1) - index): index, type: 'quad', method: 'in' });
                            for(let i = 1 ; i < index; i++){
                                let nextIndex = index+i;
                                
                                if(nextIndex < dots.length){
                                    let _opacity = _aValues[i];
                                    if(_opacity == undefined)
                                        _opacity = opacity;

                                    let nextPoint = dots[nextIndex];
                                    hlp.setFillColor(`rgba(${hexToRgb(color)},${opacity})`).dot(nextPoint.x, nextPoint.y);
                                }
                                else {
                                    break;
                                }
                            }
                        });
                    }

                    return frames;
                }

                let shootingStarFramesCount = 30
                this.shootingStar = this.addChild(new GO({
                    size: new V2(90,80),
                    position: new V2(20,-36),
                    init() {
                        this.frames = this.parent.createShootingStarFrames({framesCount:shootingStarFramesCount, size: this.size, aMax: 10});
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        this.delayCounter = 0;
                        this.timer = this.regTimerDefault(15, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                this.img = undefined;
                                return;
                            }
                            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                this.delayCounter = 170;
                            }
                        })
                    }
                }));

                this.shootingStar2 = this.addChild(new GO({
                    size: new V2(110,60),
                    position: new V2(40,-26),
                    init() {
                        this.frames = this.parent.createShootingStarFrames({framesCount:shootingStarFramesCount, size: this.size, aMax: 10});
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        this.delayCounter = 100;
                        this.timer = this.regTimerDefault(15, () => {
                            if(this.delayCounter > 0){
                                this.delayCounter--;
                                this.img = undefined;
                                return;
                            }
                            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                this.delayCounter = 170;
                            }
                        })
                    }
                }));


                // this.smoke2 = this.addChild(new GO({
                //     size: new V2(20, 60),
                //     position: new V2(48, 1),
                //     frames: PP.createImage(LuccigillsDesertScene.models.smoke3),
                //     init() {
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];

                //         this.frameChangeDelay = 10;
                //         this.timer = this.regTimerDefault(15, () => {
                //             0
                //             this.img = this.frames[this.currentFrame];
                            
                //             this.frameChangeDelay--;

                //             if(this.frameChangeDelay == 0){
                //                 this.currentFrame++;
                //                 this.frameChangeDelay= 10;
                //             }

                            
                //             if(this.currentFrame == this.frames.length){
                //                 this.currentFrame = 0;
                                
                //             }
                //         })
                //     },
                    
                // }));

                // this.smoke = this.addChild(new GO({
                //     size: new V2(15, 30),
                //     position: new V2(45, 25),
                //     frames: PP.createImage(LuccigillsDesertScene.models.smoke),
                //     init() {
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];

                //         this.timer = this.regTimerDefault(100, () => {

                //             this.img = this.frames[this.currentFrame];
                //             this.currentFrame++;
                //             if(this.currentFrame == this.frames.length){
                //                 this.currentFrame = 0;
                //             }
                //         })
                //     },
                    
                // }));
            },
            getColor(hex, opacity){
                if(!this.colorsCache){
                    this.colorsCache = {};
                }

                let key = hex+ '_' + opacity;

                if(this.colorsCache[key] == undefined){
                    this.colorsCache[key] = `rgba(${hexToRgb(hex)},${opacity})`;
                }

                return this.colorsCache[key];
            },
            createGlowFrames({framesCount, layer, size, mClamps}) {
                let frames = [];

                let pointsData = [];
                layer.groups.forEach(group => {
                    let opacity = group.strokeColorOpacity;
                    pointsData.push(...group.points.map(p => ({
                        o: opacity,
                        color: group.strokeColor,
                        point: p.point
                    })));
                })
                
                let opacityMultiplier = easing.fast({from: mClamps[0], to: mClamps[1], steps: framesCount, type: 'quad', method: 'inOut'});

                let frames1 = []
                for(let f = 0; f < framesCount; f++){
                    let multiply = opacityMultiplier[f];

                    frames1[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < pointsData.length; p++){
                            let pointData = pointsData[p];
                            let opacity = fast.r(pointData.o*multiply, 4);
                            let color = this.getColor(pointData.color, opacity);
                            hlp.setFillColor(color).dot(pointData.point.x, pointData.point.y);
                        }
                    });
                }

                frames.push(...frames1, ...frames1.reverse() );
                
                return frames;
            }
        }), 20)

        let layersCount = 10;
        let layers = [];

        let size = this.viewport.clone();
        let xChangeTimeOrigin = 50;
        let framesPerLayer = xChangeTimeOrigin*2;

        let dotsPerLayerClamps = [100, 25];
        let xChangeClamps = [1, 5];
        
        let dotsPerLayerChange = easing.createProps(layersCount-1, dotsPerLayerClamps[0], dotsPerLayerClamps[1], 'quad', 'in');
        let xChange = easing.createProps(layersCount-1, xChangeClamps[0], xChangeClamps[1], 'quad', 'in');
        let cChange = colors.createEasingChange({ hsv: { from: { h: 214, s: 16, v: 10 }, to: {h: 214, s: 16, v:80} }, type: 'quad', method: 'in', time: layersCount-1 });
        

            for(let i = 0; i < layersCount; i++){

                let frames = []
                let img = undefined;
    
                dotsPerLayerChange.time = i;
                xChange.time = i;
                let dotsPerLayer = fast.r(easing.process(dotsPerLayerChange));
                let maxXChange = fast.r(easing.process(xChange))
                cChange.processer(i)
                let color = cChange.getCurrent('hsv');
    
                let layerDots = [];
                for(let di = 0; di < dotsPerLayer; di++){
                    layerDots[di] = {
                        p: new V2(getRandomInt(0, size.x,), getRandomInt(0, size.y)),
                        initialFrame: getRandomInt(0, framesPerLayer-1)
                    }
                }
    
                let xChangePerFrameOrigin = [];
                let xChangeValueChange = easing.createProps(xChangeTimeOrigin-1, 0, maxXChange, 'quad', 'inOut');
                for(let f = 0; f < xChangeTimeOrigin; f++){
                    xChangeValueChange.time = f;
                    xChangePerFrameOrigin[f] = fast.r(easing.process(xChangeValueChange));
                }
    
                let xChangePerFrame = [...xChangePerFrameOrigin, ...xChangePerFrameOrigin.reverse()];
    
                if(maxXChange > 0){
                    for(let f = 0; f < framesPerLayer; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            hlp.setFillColor(color);
                            for(let di = 0; di < layerDots.length; di++){
                                let dot = layerDots[di];
                                let currentXChangeIndex = dot.initialFrame + f;
                                if(currentXChangeIndex > (framesPerLayer-1)){
                                    currentXChangeIndex-=framesPerLayer;
                                }
        
                                let xChange = xChangePerFrame[currentXChangeIndex];
                                hlp.dot(dot.p.x, dot.p.y+xChange);
                            }
                        })
                        
                    }
                }
                else {
                    img = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor(color);
                        for(let di = 0; di < layerDots.length; di++){
                            let dot = layerDots[di];
                            hlp.dot(dot.p.x, dot.p.y);
                        }
                    })
                }
    
                layers[i] = {
                    layerDots,
                    img,
                    frames,
                };
    
                this.layersGo = [];
                //console.log({i, dotsPerLayer, maxXChange, framesLen: frames.length})
            }

            for(let l = 0; l < layers.length; l++){
                
                this.layersGo[l] = this.addGo(new GO({
                    ...layers[l],
                    position: this.sceneCenter.clone(),
                    size,
                    //isVisible: false,
                    init() {
                        if(this.frames.length){
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
                    },
                    
                }), l);
            }
    }
}