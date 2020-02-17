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
        let scene = this;
        let layersCount = 10;
        

        let layers = [];

        let size = this.viewport.clone();
        let xChangeTimeOrigin = 50;
        let framesPerLayer = xChangeTimeOrigin*2;

        if(false){

            let dotsPerLayerClamps = [300, 100];
        let xChangeClamps = [1, 5];
        
        

        let dotsPerLayerChange = easing.createProps(layersCount-1, dotsPerLayerClamps[0], dotsPerLayerClamps[1], 'quad', 'in');
        let xChange = easing.createProps(layersCount-1, xChangeClamps[0], xChangeClamps[1], 'quad', 'in');
        let cChange = colors.createEasingChange({ hsv: { from: { h: 49, s: 90, v: 10 }, to: {h: 49, s: 40, v:100} }, type: 'quad', method: 'in', time: layersCount-1 });
        

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
                    }
                }), l);
            }
        }
        

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mainHsv = [200, 0, 100];
                let rotationOriginShift =new V2(-50, 50);
                let framesCount = framesPerLayer*5//*5;//80;
                let halfSize = new V2(this.size.x/2, this.size.y/2)

                let repeats = 4;//fast.r(360/(framesCount*rotationSpeed))
                let aChangePerRepeat = 90;
                let rotationSpeed = aChangePerRepeat/framesCount;///0.05;

                let dotsCount = 500;
                let dots = new Array(dotsCount).fill(undefined).map((_, i) => ({
                    p: new V2(getRandomInt( this.size.x/2, this.size.x+100), getRandomInt(-100, this.size.y/2)),
                    //hsv: [mainHsv[0], mainHsv[1], getRandomInt(10, 40)],
                    color: hsvToHex({hsv: [mainHsv[0], mainHsv[1], getRandomInt(10, 40)], hsvAsObject: false, hsvAsInt: true})
                }))

                this.frames = [];

                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        // let hsv = [...mainHsv];
                        // hsv[2] = getRandomInt(10, 90);

                        //hlp.setFillColor(hsvToHex({hsv: hsv, hsvAsObject: false, hsvAsInt: true}));
                        //hlp.setFillColor('white');

                        for(let r = 0; r < repeats; r++){
                            for(let i = 0; i < dots.length; i++){
                                let dot = dots[i];
                                //hlp.setFillColor(hsvToHex({hsv: dot.hsv, hsvAsObject: false, hsvAsInt: true}));
                                hlp.setFillColor(dot.color);
                                let originalPosition = dot.p;

                                let repeated = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*f, false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt()

                                hlp.dot(repeated.x, repeated.y);
                            }
                        }
                        
                    })
                }

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
        }), 0)

        


        this.layered = [];
        let layeredDataModel = Demo10Exp1Scene.models.layered();
        layeredDataModel.main.layers.forEach(l => l.visible = true);

        for(let l = 2; l<10; l++){
            this.layered[l] = this.addGo(new GO({
                position: this.sceneCenter,
                size,
                //isVisible: false,
                img: PP.createImage(layeredDataModel, {renderOnly: ['l'+l]})
                
            }), l)
        }

    }
}