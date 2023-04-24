class Silence2Scene extends Scene {
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
                size: new V2(133,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'silence2',
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
        const model = Silence2Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(223,119,53,';//'rgba(253,182,111,';

        let createSnowfallFrames = function({
            aClamps, xClamps, yClamps, lightCenter, radiusClamps, angleClamps, speedClamps, 
            framesCount, itemsCount, itemFrameslengthClamps, size, _colorPrefix, mask
        }) {
            let frames = [];

            let cPrefix = _colorPrefix;
            if(!cPrefix) 
                cPrefix = colorPrefix;

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);
            
                let radius, aMulValues;

                if(radiusClamps) {
                    radius = getRandomInt(radiusClamps);
                    aMulValues = easing.fast({from: 1, to: 0, steps: radius, type: 'linear', method: 'base', round: 3 })
                }

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let direction = V2.up.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let speed = getRandom(speedClamps[0], speedClamps[1]);

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

                    let p = p0.add(direction.mul(speed*f)).toInt();
                    let distanceToLightCenter = fast.r(p.distance(lightCenter));
                    let aMul = aClamps[0];
                    if(distanceToLightCenter) {
                        if(distanceToLightCenter < radius) {
                            aMul = aMulValues[distanceToLightCenter];
                        }
                    }
                    else {
                        aMul = 1;
                    }

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

                            hlp.setFillColor(cPrefix + a + ')').dot(p)
                        }
                        
                    }

                    if(mask) {
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(mask, 0, 0)
                    }
                });
            }
            
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 0)

        this.far_house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far_house'] })
            }
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground'] })

                this.pD = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [80,170], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_d'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ground_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 2)

        this.snowFallFar1  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(70,108), radius: new V2(15,15), gradientOrigin: new V2(70,108), 
                    angle: 0, easingType: 'cubic', 
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                    hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue/1.5,2)})`).dot(x,y) 
                                }
                            }
                        }
                    }
                })


                let params = [
                    {
                        aClamps: [0,0.1], xClamps: [45,90], yClamps: [100,145], angleClamps: [230, 240], speedClamps: [0.175, 0.2], 
                        framesCount: 100, itemsCount: 400, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: 'rgba(253,183,114,',
                        mask: PP.createImage(model, { renderOnly: ['far_house_leght_mask'], forceVisivility: { far_house_leght_mask: { visible: true }} })
                    },
                    {
                        aClamps: [0,1], xClamps: [20,90], yClamps: [80,140], lightCenter: new V2(58,120), radiusClamps: [5,10], angleClamps: [230, 240], speedClamps: [0.2, 0.225], 
                        framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: 'rgba(253,183,114,'
                    },
                    {
                        aClamps: [0,1], xClamps: [30,100], yClamps: [80,140], lightCenter: new V2(66,114), radiusClamps: [5,10], angleClamps: [230, 240], speedClamps: [0.225, 0.25], 
                        framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: 'rgba(253,183,114,'
                    },
                    {
                        aClamps: [0,0.8], xClamps: [40,110], yClamps: [70,130], lightCenter: new V2(70,108), radiusClamps: [10,15], angleClamps: [230, 240], speedClamps: [0.25, 0.3], 
                        framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size, //_colorPrefix: 'rgba(253,183,114,'
                    },
                ]

                //this.frames = createSnowfallFrames()

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames(p)

                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });
                    }
                })))

            }
        }), 4)

        this.far_lamps = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far_lamps'] })
            }
        }), 5)

        this.left_house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['left_house', 'left_house_roof_alter'] })
            }
        }), 7)

        this.right_house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['right_house'] })
            }
        }), 8)

        this.snowFallClose1  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                // let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                //     center: new V2(66,53), radius: new V2(25,25), gradientOrigin: new V2(66,53), 
                //     angle: 0, easingType: 'cubic', 
                //     setter: (dot, aValue) => {
                //         if(!dot.values){
                //             dot.values = [];
                //             dot.maxValue = aValue;
                //         }
        
                //         if(aValue > dot.maxValue)
                //             dot.maxValue = aValue;
        
                //         dot.values.push(aValue);
                //     } 
                // })

                let radiuses = [20,21,22,23,24,25]

                let gdImgs = radiuses.map(r => colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(66,53), radius: new V2(r,r), gradientOrigin: new V2(66,53), 
                    angle: 0, easingType: 'cubic', 
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })).map(gradientDots => createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                    hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue/1.5,2)})`).dot(x,y) 
                                }
                            }
                        }
                    }
                }))

                this.currentFrame = 0;
                this.img = gdImgs[getRandomInt(0, gdImgs.length-1)];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == 10){
                        this.currentFrame = 0;
                        this.img = gdImgs[getRandomInt(0, gdImgs.length-1)];
                    }
                })

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                //                     hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue/1.5,2)})`).dot(x,y) 
                //                 }
                //             }
                //         }
                //     }
                // })


                let params = [
                    {
                        aClamps: [0,0.2], xClamps: [20,120], yClamps: [0,120], lightCenter: new V2(66,53), radiusClamps: [15,45], angleClamps: [220, 240], speedClamps: [0.4, 0.45], 
                        framesCount: 100, itemsCount: 5000, itemFrameslengthClamps: [80,100], size: this.size
                    },
                    {
                        aClamps: [0,0.5], xClamps: [30,100], yClamps: [20,100], lightCenter: new V2(66,53), radiusClamps: [20,35], angleClamps: [220, 240], speedClamps: [0.45, 0.5], 
                        framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: 'rgba(238,151,84,'
                    },
                    {
                        aClamps: [0,1], xClamps: [50,90], yClamps: [20,70], lightCenter: new V2(66,53), radiusClamps: [10,20], angleClamps: [220, 240], speedClamps: [0.5, 0.55], 
                        framesCount: 100, itemsCount: 500, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: 'rgba(253,183,114,'
                    }
                ]

                //this.frames = createSnowfallFrames()

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames(p)

                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });
                    }
                })))

            }
        }), 9)

        this.close_lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['close_lamp'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'foreground_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 10)

        this.snowFallClose2  = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let params = [
                    
                ]

                //this.frames = createSnowfallFrames()

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames(p)

                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });
                    }
                })))

                


            }
        }), 11)

        this.snowFallClose3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let params = [
                    {
                        aClamps: [0.05,0.3], xClamps: [0,150], yClamps: [-30,200], lightCenter: new V2(66,53), radiusClamps: [50,60], angleClamps: [200, 250], speedClamps: [0.8, 1], 
                        framesCount: 100, itemsCount: 300, itemFrameslengthClamps: [80,100], size: this.size
                    },
                    {
                        aClamps: [0.1,1], xClamps: [0,150], yClamps: [-20,200], lightCenter: new V2(66,53), radiusClamps: [50,60], angleClamps: [200, 250], speedClamps: [1, 2], 
                        framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [80,100], size: this.size
                    },
                ]

                //this.frames = createSnowfallFrames()

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames(p)

                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                let foo = true;
                            }
                        });
                    }
                })))

                


            }
        }), 11)
    }
}