class NightStairs3Scene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'nightstairs3',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    //todo
    // passing by train

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = NightStairs3Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let brightColorPrefix = 'rgba(220,172,131,'; //'rgba(239,196,160,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                
            }
        }), 1)

        let createSnofallFrames = function({framesCount, itemsCount, 
            itemFrameslengthClamps, addShining, aClamps,xClamps, yClamps, angleClamps, speedClamps, speedMul= 1, aMul =1, cPrefix, mask,
            size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let speed = getRandom(speedClamps[0]*speedMul, speedClamps[1]*speedMul);
            
                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let addShine = addShining && getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(25,45);
                    shineMul = getRandomInt(2,3);

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
            
                    let p = p0.add(direction.mul(speed*f)).toInt();
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
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(mask, 0, 0)
                    }
                });
            }
            
            return frames;
        }

        let createGradient = ({hlp, aValueMul, center, radius, gradientOrigin, size, colorPrefix, easingType = 'quad', easingMethod = 'out', angle = 0, verticalCut}) => {
            let gradientDots = colors.createRadialGradient({ size: size.clone(), 
                center, radius, gradientOrigin, angle, easingType, easingMethod,
                setter: (dot, aValue) => {
                    aValue*=aValueMul;

                    if(!dot.values){
                        dot.values = [];
                        dot.maxValue = aValue;
                    }
    
                    if(aValue > dot.maxValue)
                        dot.maxValue = aValue;
    
                    dot.values.push(aValue);
                } 
            })

            for(let y = 0; y < gradientDots.length; y++) {
                if(gradientDots[y]) {
                    for(let x = 0; x < gradientDots[y].length; x++) {
                        if(gradientDots[y][x]) {

                            let a = fast.r(gradientDots[y][x].maxValue/1,2)

                            if(verticalCut) {
                                let vCutPoint = verticalCut.points.filter(p => p.x == x);
                                if(vCutPoint.length > 0){
                                    if(y <= vCutPoint[0].y) {
                                        let yDelta = vCutPoint[0].y - y;
                                        if(yDelta >= verticalCut.aValuesMul.length){
                                            a  = 0;
                                        }
                                        else {
                                            a*=verticalCut.aValuesMul[yDelta];
                                        }
                                    }
                                }
                            }
                            
                            hlp.setFillColor(`${colorPrefix}${a})`).dot(x,y) 
                        }
                    }
                }
            }
        }

        let mask = createCanvas(this.viewport, (ctx, size, hlp) => {
            createGradient({
                hlp, aValueMul: 1,  gradientOrigin: new V2(90,24), size, colorPrefix: brightColorPrefix, angle: 5,
                // center: new V2(88,60),
                // radius: new V2(35,55)
                center: new V2(88,35), 
                radius: new V2(40,90),
                verticalCut: { 
                    points: appSharedPP.lineByCornerPoints([new V2(53,23), new V2(87, 19), new V2(96, 19), new V2(130, 23)]),
                    aValuesMul: easing.fast({from: 0.75, to: 0.1, steps: 4, type: 'linear', round: 2}) 
                 }
            })

            createGradient({
                hlp, aValueMul: 1,  gradientOrigin: new V2(90,24), size, colorPrefix: whiteColorPrefix, angle: 5,
                // center: new V2(88,60),
                // radius: new V2(35,55)
                center: new V2(88,35), 
                radius: new V2(20,40),
                verticalCut: { 
                    points: appSharedPP.lineByCornerPoints([new V2(53,23), new V2(87, 19), new V2(96, 19), new V2(130, 23)]),
                    aValuesMul: easing.fast({from: 0.75, to: 0.1, steps: 4, type: 'linear', round: 2}) 
                 }
            })
        }) 

        let maskRender = createCanvas(this.viewport, (ctx, size, hlp) => {
            createGradient({
                hlp, aValueMul: 1,  gradientOrigin: new V2(90,24), size, colorPrefix: brightColorPrefix, angle: 5,
                // center: new V2(88,60),
                // radius: new V2(35,55)
                center: new V2(88,35), 
                radius: new V2(40,90).divide(2).toInt(),
                verticalCut: { 
                    points: appSharedPP.lineByCornerPoints([new V2(53,23), new V2(87, 19), new V2(96, 19), new V2(130, 23)]),
                    aValuesMul: easing.fast({from: 0.75, to: 0.1, steps: 4, type: 'linear', round: 2}) 
                 }
            })

            createGradient({
                hlp, aValueMul: 1,  gradientOrigin: new V2(90,24), size, colorPrefix: whiteColorPrefix, angle: 5,
                // center: new V2(88,60),
                // radius: new V2(35,55)
                center: new V2(88,35), 
                radius: new V2(20,40).divide(2).toInt(),
                verticalCut: { 
                    points: appSharedPP.lineByCornerPoints([new V2(53,23), new V2(87, 19), new V2(96, 19), new V2(130, 23)]),
                    aValuesMul: easing.fast({from: 0.75, to: 0.1, steps: 4, type: 'linear', round: 2}) 
                 }
            })
        }) 

        let showSnofall = true;

        this.stairs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['stairs', 'stairs_d'] }),
            init() {
                if(!showSnofall) {
                    this.mask = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        img: mask
                    }))
                }
                else {
                    // this.mask = this.addChild(new GO({
                    //     position: new V2(),
                    //     size: this.size,
                    //     init() {
                    //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //             ctx.globalAlpha = 0.05;
                    //             ctx.drawImage(maskRender, 0, 0)
                    //         })
                    //     }
                    // }))
                }
                    
                this.shine1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#fff', //whiteColorPrefix + 0.2 + ')'
                        }));

                        let frames1 = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [30,40], pointsData: availableDots, size: this.size,
                        pdPredicate: () => getRandomInt(0,70) == 0, 
                            smooth: {
                                aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });


                        this.frames = frames1.map((_,f) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames1[f], 0, 0);
                        //    ctx.drawImage(frames2[f], 0, 0);
                        }))

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.shine2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone_2')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: '#fff', //whiteColorPrefix + 0.2 + ')'
                        }));

                        let frames1 = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [30,40], pointsData: availableDots, size: this.size,
                        pdPredicate: () => getRandomInt(0,20) == 0, 
                            smooth: {
                                aClamps: [0,0.3], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            }
                        });


                        this.frames = frames1.map((_,f) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(frames1[f], 0, 0);
                        //    ctx.drawImage(frames2[f], 0, 0);
                        }))

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 3)

        this.backlSnowfall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(showSnofall) {
                    this.snowfall1 = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.frames = createSnofallFrames({framesCount: 300, itemsCount: 1000, 
                                itemFrameslengthClamps: [90, 120], addShining: true, aClamps: [0,0.2],xClamps: [50,125], yClamps:[0,70], 
                                angleClamps: [-5,5], speedClamps: [0.1,0.125], speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask,
                                size: this.size});
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
    
                    this.snowfall2 = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.frames = createSnofallFrames({framesCount: 300, itemsCount: 1000, 
                                itemFrameslengthClamps: [90, 120], addShining: true, aClamps: [0,0.4],xClamps: [50,125], yClamps:[0,70], 
                                angleClamps: [-5,5], speedClamps: [0.15,0.2], speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask,
                                size: this.size});
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
                }
                
            }
        }), 4)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['lamp'] }),
            init() {
                if(showSnofall) {
                    this.snowfall1 = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.frames = createSnofallFrames({framesCount: 300, itemsCount: 500, 
                                itemFrameslengthClamps: [90, 120], addShining: true, aClamps: [0,0.75],xClamps: [50,125], yClamps:[0,70], 
                                angleClamps: [-5,5], speedClamps: [0.25,0.3], speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask,
                                size: this.size});
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
    
                    this.snowfall1 = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            this.frames = createSnofallFrames({framesCount: 300, itemsCount: 200, 
                                itemFrameslengthClamps: [90, 120], addShining: true, aClamps: [0,1],xClamps: [50,125], yClamps:[0,70], 
                                angleClamps: [-5,5], speedClamps: [0.35,0.4], speedMul: 1, aMul: 1, cPrefix: whiteColorPrefix, mask,
                                size: this.size});
    
                            this.registerFramesDefaultTimer({});
                        }
                    }))
                }
            }
        }), 5)
    }
}