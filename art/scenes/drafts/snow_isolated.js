class SnowIsolatedScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'zip',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(128,72).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'snofall_isolated',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let colorPrefix = 'rgba(255,255,255,';
        const appSharedPP = PP.createNonDrawingInstance();

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSnowFrames({framesCount, itemsCount, itemFrameslengthClamps, angleClamps, aClamps, speedClamps, xClamps, yClamps, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);

                    let direction = V2.up.rotate(getRandom(angleClamps[0], angleClamps[1]));
                    let speed = getRandom(speedClamps[0], speedClamps[1]);

                    let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                    let p1 = p0.add(direction.mul(speed*totalFrames)).toInt();

                    let points = appSharedPP.lineV2(p0, p1);
                    let indicesValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0 })

                    let aValues = [
                        ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        //let p = p0.add(direction.mul(speed*f)).toInt();
                        let p = points[indicesValues[f]];
                        
                        // let distanceToLightCenter = fast.r(p.distance(lightCenter));
                        let aMul = 1
                        // if(distanceToLightCenter) {
                        //     if(distanceToLightCenter < radius) {
                        //         aMul = aMulValues[distanceToLightCenter];
                        //     }
                        // }
                        // else {
                        //     aMul = 1;
                        // }

                        let a = aValues[f] != undefined ? aValues[f]*aMul : aClamps[0];

                        if(a < aClamps[0])
                            a = aClamps[0];
                
                        frames[frameIndex] = {
                            p,a
                        };
                    }
                
                    return {
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let {p,a} = itemData.frames[f];

                                hlp.setFillColor(colorPrefix + a + ')').dot(p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                // this.img = createCanvas(V2.one, (ctx, size, hlp) => {
                //     hlp.setFillColor('#00FF00').dot(0,0);
                // })

                let itemFrameslengthClamps = [40, 80]

                let data = [
                    { 
                        framesCount: 120, itemsCount: 4000, itemFrameslengthClamps, angleClamps: [190, 195], speedClamps: [0.2, 0.25], 
                        xClamps: [0, this.size.x+20], yClamps: [-20, this.size.y], aClamps: [0, 0.1], size: this.size
                    },
                    { 
                        framesCount: 120, itemsCount: 2000, itemFrameslengthClamps, angleClamps: [190, 200], speedClamps: [0.4, 0.45], 
                        xClamps: [0, this.size.x+20], yClamps: [-20, this.size.y], aClamps: [0, 0.3], size: this.size
                    },
                    { 
                        framesCount: 120, itemsCount: 1000, itemFrameslengthClamps, angleClamps: [190, 210], speedClamps: [0.5, 0.55], 
                        xClamps: [0, this.size.x+20], yClamps: [-20, this.size.y], aClamps: [0, 0.6], size: this.size
                    },
                    { 
                        framesCount: 120, itemsCount: 200, itemFrameslengthClamps, angleClamps: [190, 220], speedClamps: [0.6, 0.65], 
                        xClamps: [0, this.size.x+20], yClamps: [-20, this.size.y], aClamps: [0, 1], size: this.size
                    },
                ]

                this.layers = data.map(l => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createSnowFrames(l)
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                })))
                
            }
        }), 1)
    }
}