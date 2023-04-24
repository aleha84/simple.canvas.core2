class Silence3Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(127,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'silence3',
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
        const model = Silence3Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(219,176,83,';//'rgba(218,190,104,';//'rgba(223,204,172,';

        let createSnowfallFrames = function({
            aClamps, xClamps, yClamps, lightCenter, radiusClamps, angleClamps, speedClamps, 
            framesCount, itemsCount, itemFrameslengthClamps, size, _colorPrefix, mask,
            upperBorder
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
            
                    let red = false;
                    if(a> 0 && upperBorder) {
                        let upperBorder_p = upperBorder.points.find(_p => _p.x == p.x)
                        if(upperBorder_p && p.y < upperBorder_p.y) {
                            let d = upperBorder_p.y-p.y;
                            if(d < upperBorder.aValues.length) {
                                a*=upperBorder.aValues[d]
                                red = true;
                            }
                            else {
                                a = 0;
                            }
                        }
                    }

                    frames[frameIndex] = {
                        p,a, red
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
                            // if(itemData.frames[f].red) {
                            //     hlp.setFillColor('red').dot(p)
                            // }
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

        this.trees = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['trees'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [50,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'trees_p')),
                            pdPredicate: () => true//getRandomBool()
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 3)

        // this.stolb_2 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.img = PP.createImage(model, { renderOnly: ['stolb_2'] })
        //     }
        // }), 4)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['road'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: [30,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p')),
                            pdPredicate: () => true//getRandomBool()
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['houses'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: [20,40], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'house_p')),
                            pdPredicate: () => getRandomBool()
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 8)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['lamp'] })

                 

                let upperBorder = {
                    points: appSharedPP.lineByCornerPoints([new V2(0,50), new V2(58,44), new V2(102,64)]), 
                    aValues: easing.fast({from: 1, to: 0, steps: 5, type: 'linear', round: 2}) 
                }

                let data = [
                    // {
                    //     aClamps: [0,0.05], xClamps: [0,130], yClamps: [-10,160], lightCenter: new V2(58,45), radiusClamps: [100,100], angleClamps: [160, 165], 
                    //     speedClamps: [0.075, 0.1], 
                    //     framesCount: 100, itemsCount: 3000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: colorPrefix,
                    //     //upperBorder
                    // },
                    {
                        aClamps: [0,0.2], xClamps: [0,130], yClamps: [30,120], lightCenter: new V2(58,45), radiusClamps: [40,60], angleClamps: [160, 165], 
                        speedClamps: [0.15, 0.2], 
                        framesCount: 100, itemsCount: 2000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: colorPrefix,
                        upperBorder
                    },
                    {
                        aClamps: [0,0.5], xClamps: [0,120], yClamps: [30,120], lightCenter: new V2(58,45), radiusClamps: [30,45], angleClamps: [160, 165], 
                        speedClamps: [0.25, 0.3], 
                        framesCount: 100, itemsCount: 1000, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: colorPrefix,
                        upperBorder
                    },
                    {
                        aClamps: [0,1], xClamps: [20,90], yClamps: [30,70], lightCenter: new V2(58,45), radiusClamps: [15,25], angleClamps: [160, 165], 
                        speedClamps: [0.3, 0.4], 
                        framesCount: 100, itemsCount: 400, itemFrameslengthClamps: [80,100], size: this.size, _colorPrefix: colorPrefix,//'rgba(255,0,0,',
                        upperBorder
                    },
                ]

                this.snofallLayers = data.map(p => this.addChild(new GO({
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

        this.stolb2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['stolb2'] })

                this.lampsLight = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                            center: new V2(58,45), radius: new V2(20,20), gradientOrigin:new V2(58,45), 
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
                    }
                }))
            }
        }), 13)

        
    }
}