class LuccigillsDesertScene extends Scene {
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
                            }
                        })
                    },
                    
                }));


                this.smoke = this.addChild(new GO({
                    size: new V2(15, 30),
                    position: new V2(45, 25),
                    frames: PP.createImage(LuccigillsDesertScene.models.smoke),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];

                        this.timer = this.regTimerDefault(100, () => {

                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    },
                    
                }));
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

                frames.push(...(new Array(2).fill(frames1[0])),...frames1,...(new Array(2).fill(frames1[frames1.length-1])), ...frames1.reverse() );
                
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
                    for(let f = 0; f < framesPerLayer-1; f++){
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