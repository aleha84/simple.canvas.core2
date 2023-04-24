// TODO: 
// + add layers
// + create multiple (or one ? )  radial gradients
// + create multiple layers of snowfall
// + add transparent zones to car 
// + add sparcles
// + add particles to the ground and car
// + add frontal snowfall in lights of stop signals?

class WinterForestRoad2Scene extends Scene {
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
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'winterForestRoad2',
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
        const model = WinterForestRoad2Scene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        const colorRgbPrefix = 'rgba(255,0,0,'

        const commonSetter = (dot, aValue) => {
            let mul = 1;

            aValue*=mul;
            if(!dot.values){
                dot.values = [];
                dot.maxValue = aValue;
            }

            if(aValue > dot.maxValue)
                dot.maxValue = aValue;

            dot.values.push(aValue);
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        // this.forest = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.img = PP.createImage(model, { renderOnly: ['forest', 'blue_trees'] })
        //     }
        // }), 5)

        let createSnowFallFrames = function({framesCount, itemsCount, gradientData, xClamps, yClamps, aClapms, colorPrefix,
            angleClamps, distanceClamps, itemFrameslengthClamps, aMul = 1, size, mask}) {
            let frames = [];
            
            let itemsData = []//new Array(itemsCount).fill().map((el, i) => {
            for(let i = 0; i < itemsCount; i++) {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let angle = getRandom(angleClamps[0], angleClamps[1])

                let addShine = getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(5,15);
                    shineMul = getRandomInt(2,3);
                }

                let direction = V2.down.rotate(angle);
                let distance = getRandomInt(distanceClamps);

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2);
                let maxA = aClapms[1];

                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                }
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    let p = points[pointIndexValues[f]]
                    let a = aValues[f] || 0;

                    if(gradientData) {
                        if(gradientData[p.y] && gradientData[p.y][p.x])  {
                            a = fast.r(a*gradientData[p.y][p.x].maxValue*aMul, 2);
                            if(a < aClapms[0]){
                                a = aClapms[0];    
                            }
                        } 
                        else {
                            a = aClapms[0];
                        }
                    }

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                itemsData[i] = {
                    frames
                }
                // return {
                //     frames
                // }
            }
                
            //})
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let {p, a} = itemData.frames[f];

                            hlp.setFillColor(colorPrefix + a + ')').dot(p)
                        }
                        
                    }

                    if(mask) {
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(mask, 0, 0);
                    }
                });
            }
            
            return frames;
        }

        let gradientOrigin = new V2(100,170);

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['forest', 'blue_trees', 'road'] })

                
                let center = new V2(100,70);
                let height = 110;
                // let easingType = 'quad';
                // let easingMethod = 'in';
                let easingType = 'linear';
                let easingMethod = 'base';

                let gradientDots = colors.createRadialGradient({ size: this.size, center, radius: new V2(150,height), 
                    gradientOrigin, angle: 0, easingType, easingMethod,
                    setter: commonSetter })

                let gradientDots2 = colors.createRadialGradient({ size: this.size, center, radius: new V2(90,height), 
                    gradientOrigin, angle: 0, easingType, easingMethod,
                    setter: commonSetter })

                let gradientDots3 = colors.createRadialGradient({ size: this.size, center: center.add(new V2(0,5)), radius: new V2(50,height), 
                    gradientOrigin, angle: 0, easingType:'linear', easingMethod: 'base',
                    setter: commonSetter })

                let gradientDots5 = colors.createRadialGradient({ size: this.size, center: new V2(100,125), radius: new V2(50,60), 
                    gradientOrigin, angle: 0, easingType:'linear', easingMethod: 'base',
                    setter: commonSetter })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 180, itemFrameslength: [60,90], size: this.size, 
                            pdPredicate: () => getRandomInt(0,3) == 0,
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p'))
                            });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
                

                this.snowFall1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     for(let y = 0; y < gradientDots5.length; y++) {
                        //         if(gradientDots5[y]) {
                        //             for(let x = 0; x < gradientDots5[y].length; x++) {
                        //                 if(gradientDots5[y][x]) {
                        //                     //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                        //                     hlp.setFillColor(`${colorRgbPrefix}${fast.r(gradientDots5[y][x].maxValue/1,2)})`).dot(x,y) 
                        //                 }
                        //             }
                        //         }
                        //     }
                        // })

                        let forest_road_mask =  this.parent.img; //PP.createImage(model, { renderOnly: ['forest', 'blue_trees', 'road'] })

                        let totalFrames = 180;
                        let itemFrameslengthClamps = [90,140];//[100,150];
                        let aMul = 1.5
                        let data = [
                            {
                                framesCount: totalFrames, itemsCount: 8000, gradientData: gradientDots, xClamps: [-10, this.size.x+10], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(14,30,48,', angleClamps: [-5,5], distanceClamps: [8,12], itemFrameslengthClamps, aMul: aMul, size: this.size,
                                mask: forest_road_mask
                            },
                            {
                                framesCount: totalFrames, itemsCount: 6000, gradientData: gradientDots, xClamps: [-10, this.size.x+10], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(6,63,111,', angleClamps: [-7,7], distanceClamps: [10,14], itemFrameslengthClamps, aMul: aMul, size: this.size,
                                mask: forest_road_mask
                            },
                            {
                                framesCount: totalFrames, itemsCount: 4000, gradientData: gradientDots2, xClamps: [0, this.size.x], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(48,99,165,', angleClamps: [-10,10], distanceClamps: [14,18], itemFrameslengthClamps, aMul: aMul, size: this.size
                            },
                            {
                                framesCount: totalFrames, itemsCount: 3000, gradientData: gradientDots2, xClamps: [0, this.size.x], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(89,135,219,', angleClamps: [-10,10], distanceClamps: [16,20], itemFrameslengthClamps, aMul: aMul, size: this.size
                            },
                            {//rgba(170,194,236,
                                framesCount: totalFrames, itemsCount: 2000, gradientData: gradientDots3, xClamps: [20, this.size.x-20], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(130,165,228,', angleClamps: [-12,12], distanceClamps: [19,24], itemFrameslengthClamps, aMul: aMul, size: this.size
                            },
                            {
                                framesCount: totalFrames, itemsCount: 1000, gradientData: gradientDots5, xClamps: [40, this.size.x-40], yClamps: [-10, 180], aClapms: [0, 1], 
                                colorPrefix: 'rgba(170,194,237,', angleClamps: [-14,14], distanceClamps: [25,30], itemFrameslengthClamps: [80,120], aMul: aMul, size: this.size
                            }
                        ]

                        this.layers = data.map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            init() {
                                this.frames = createSnowFallFrames(d)
        
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }))

                this.blueLight = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                    let gradientDots4 = colors.createRadialGradient({ size: this.size, center: new V2(100,155), radius: new V2(35,25), 
                        gradientOrigin, angle: 0, easingType:'quad', easingMethod: 'out',
                        setter: commonSetter })

                        let colorPrefix = 'rgba(0,66,144,'
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let y = 0; y < gradientDots4.length; y++) {
                                if(gradientDots4[y]) {
                                    for(let x = 0; x < gradientDots4[y].length; x++) {
                                        if(gradientDots4[y][x]) {
                                            //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                            hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots4[y][x].maxValue/1,2)})`).dot(x,y) 
                                        }
                                    }
                                }
                            }
                        })
                    }
                }))
            }
        }), 7)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['car'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 180, itemFrameslength: [30,60], size: this.size, 
                            // pdPredicate: () => getRandomInt(0,3) == 0,
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'car_p'))
                            });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 9)

        this.backLights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 180;
                let itemFrameslengthClamps = [90,140]
                let colorPrefix = 'rgba(198,40,45,';

                let gradientDotsLeft = colors.createRadialGradient({ size: this.size, center: new V2(85,167), radius: new V2(12,12), 
                    gradientOrigin: new V2(85,167), angle: 0, easingType: 'quad', easingMethod: 'out',
                    setter: commonSetter })

                    let gradientDotsRight = colors.createRadialGradient({ size: this.size, center: new V2(116,167), radius: new V2(12,12), 
                        gradientOrigin: new V2(116,167), angle: 0, easingType: 'quad', easingMethod: 'out',
                        setter: commonSetter })

                    this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < gradientDotsLeft.length; y++) {
                            if(gradientDotsLeft[y]) {
                                for(let x = 0; x < gradientDotsLeft[y].length; x++) {
                                    if(gradientDotsLeft[y][x]) {
                                        //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                        hlp.setFillColor(`${colorPrefix}${fast.r(gradientDotsLeft[y][x].maxValue/3,2)})`).dot(x,y) 
                                    }
                                }
                            }
                        }

                        for(let y = 0; y < gradientDotsRight.length; y++) {
                            if(gradientDotsRight[y]) {
                                for(let x = 0; x < gradientDotsRight[y].length; x++) {
                                    if(gradientDotsRight[y][x]) {
                                        //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                        hlp.setFillColor(`${colorPrefix}${fast.r(gradientDotsRight[y][x].maxValue/3,2)})`).dot(x,y) 
                                    }
                                }
                            }
                        }
                    })

                    let data = [
                        {
                            framesCount: totalFrames, itemsCount: 50, gradientData: gradientDotsLeft, xClamps: [70, 100], yClamps: [150, 170], aClapms: [0, 1], 
                            colorPrefix: colorPrefix, angleClamps: [-10,10], distanceClamps: [25,30], itemFrameslengthClamps, aMul: 1, size: this.size
                        },
                        {
                            framesCount: totalFrames, itemsCount: 50, gradientData: gradientDotsRight, xClamps: [100, 130], yClamps: [150, 170], aClapms: [0, 1], 
                            colorPrefix: colorPrefix, angleClamps: [-10,10], distanceClamps: [25,30], itemFrameslengthClamps, aMul: 1, size: this.size
                        }
                    ]

                    this.layers = data.map(d => this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        init() {
                            this.frames = createSnowFallFrames(d)
    
                            this.registerFramesDefaultTimer({});
                        }
                    })))
            }
        }), 11)
    }
}