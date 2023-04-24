class Effects2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(150,150),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
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
            img: createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0, size.x, size.y);

                hlp.setFillColor('rgba(255,255,255,0.05').rect(0, )
            })
        }), 1)


        function createParticlesFrames({framesCount, itemsCount, yClamps, itemFrameslengthClamps, size, particlesLengthClamps, alphaClamps, shine}) {
            let frames = [];
        
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let itemFrameslength = getRandomInt(itemFrameslengthClamps)
                
            
                let particlesLength = getRandomInt(particlesLengthClamps)
                

                let y = fast.r(getRandomGaussian(yClamps[0], yClamps[1]));
                let x = getRandomInt(-particlesLength, size.x + particlesLength);
                let maxA = getRandom(alphaClamps[0], alphaClamps[1]);

                let totalFrames = itemFrameslength;

                let xChangeValues = easing.fast({from: 0, to: -particlesLength, steps: itemFrameslength, type: 'linear', method: 'base', round: 0})
                let aValuesChange = [
                    ...easing.fast({from: 0, to: maxA, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2}),
                    ...easing.fast({from: maxA, to: 0, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2})
                ]

                // if(shine && getRandomInt(0, 10) == 0) {
                //     //aValuesChange[fast.r(itemFrameslength/2)] = maxA* shine.aMul
                // }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
        
                    frames[frameIndex] = {
                        xChange: xChangeValues[f],
                        a: aValuesChange[f]
                    };
                }
            
                return {
                    x, y,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let a = itemData.frames[f].a;
                            if(a == undefined)
                                a = 0;

                            hlp.setFillColor('rgba(255,255,255,' + a + ')').dot(itemData.x + itemData.frames[f].xChange, itemData.y)
                            hlp.setFillColor('rgba(255,255,255,' + a/2 + ')')
                                //.dot(itemData.x + itemData.frames[f].xChange - 1, itemData.y)
                                //.dot(itemData.x + itemData.frames[f].xChange + 1, itemData.y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let data = [
                    { framesCount: 300, itemsCount: 4000, itemFrameslengthClamps: [120, 150], size: this.size, 
                            particlesLengthClamps: [4,6], alphaClamps: [0.02, 0.08], yClamps: [this.size.y/5, this.size.y*4/5 ], shine: { aMul: 10 } },

                    { framesCount: 300, itemsCount: 2000, itemFrameslengthClamps: [60, 90], size: this.size, 
                        particlesLengthClamps: [8,10], alphaClamps: [0.1, 0.2], yClamps: [0, this.size.y] },

                    { framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [30, 50], size: this.size, 
                        particlesLengthClamps: [12,15], alphaClamps: [0.25, 0.37], yClamps: [-this.size.y/2, this.size.y*1.5] },

                    { framesCount: 300, itemsCount: 500, itemFrameslengthClamps: [30, 60], size: this.size, 
                        particlesLengthClamps: [20,30], alphaClamps: [0.4, 0.55], yClamps: [-this.size.y, this.size.y*2] },

                ]

                this.parallaxLayers = data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createParticlesFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                })))


                // this.frames = createParticlesFrames()

                // this.registerFramesDefaultTimer({});
            }
        }), 10)
    }
}