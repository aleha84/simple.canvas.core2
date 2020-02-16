class Demo10Exp1Scene extends Scene {
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
        let layersCount = 10;
        let dotsPerLayerClamps = [300, 100];
        let xChangeClamps = [1, 5];
        let xChangeTimeOrigin = 50;
        let framesPerLayer = xChangeTimeOrigin*2;

        let dotsPerLayerChange = easing.createProps(layersCount-1, dotsPerLayerClamps[0], dotsPerLayerClamps[1], 'quad', 'in');
        let xChange = easing.createProps(layersCount-1, xChangeClamps[0], xChangeClamps[1], 'quad', 'in');
        let cChange = colors.createEasingChange({ hsv: { from: { h: 49, s: 90, v: 10 }, to: {h: 49, s: 40, v:100} }, type: 'quad', method: 'in', time: layersCount-1 });
        

        let layers = [];

        let size = this.viewport.clone();

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
                }
            }), l);
        }


        this.layered = [];
        let layeredDataModel = Demo10Exp1Scene.models.layered();
        layeredDataModel.main.layers.forEach(l => l.visible = true);

        for(let l = 2; l<10; l++){
            this.layered[l] = this.addGo(new GO({
                position: this.sceneCenter,
                size,
                img: PP.createImage(layeredDataModel, {renderOnly: ['l'+l]})
                
            }), l)
        }

    }
}