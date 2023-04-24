class SilenceScene extends Scene {
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
                size: new V2(113,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'silence',
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
        const model = SilenceScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        this.buildings = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['houses', 'house_d'] })
            }
        }), 5)

        this.house_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [30,50], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'house_p'))
                 });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });

                // this.tv = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let p0 = new V2(78,117);
                //         let img = createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('rgba(255,255,255,0.75)').dot(p0)
                //             hlp.setFillColor('rgba(255,255,255,0.5)').dot(p0.x-1, p0.y).dot(p0.x, p0.y-1)
                //             hlp.setFillColor('rgba(255,255,255,0.35)').dot(p0.x-1, p0.y-1).dot(p0.x-1, p0.y+1)
                //         });

                //         let a = [0.75, 0.5, 0.25, 0.15]

                //         let images = a.map((_a) => createCanvas(this.size, (ctx, size, hlp) => {
                //             ctx.globalAlpha = _a;
                //             ctx.drawImage(img, 0, 0)
                //         }))

                //         let counterClamps = [20,40]
                //         this.currentFrame = 0;
                //         let counter = getRandomInt(counterClamps)
                //         this.img = images[getRandomInt(0, images.length-1)];
                        
                //         this.timer = this.regTimerDefault(10, () => {
                //             this.currentFrame++;
                //             if(this.currentFrame == counter){
                //                 this.currentFrame = 0;
                //                 counter = getRandomInt(counterClamps)
                //                 this.img = images[getRandomInt(0, images.length-1)];
                //             }
                //         })
                //     }
                // }))
            }
        }), 6)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['lamp'] })

            }
        }), 10)

        this.lamp_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [60,90], size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_p'))
                 });

                this.registerFramesDefaultTimer({});
            }
        }), 11)

        let createSnowfallFrames2 = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, gradientData, angleClamps, 
            distanceCLamps, xCLamps, yClapms, size, aMul = 1, addAngleShift = false, large = false,}) {
            let frames = [];
            
            let angleShift = easing.fast({from: 0, to: 15, steps: size.y, type: 'quad', method: 'in', round: 2})
            let dMulToY = easing.fast({from: 1, to: 1.5, steps: size.y, type: 'quad', method: 'in', round: 2 });
            let aMulToY =  easing.fast({from: 1, to: 1.35, steps: size.y, type: 'quad', method: 'in', round: 2 });

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClapms);
            
                let p = new V2(getRandomInt(xCLamps), getRandomInt(yClapms));
                let angle = getRandomInt(angleClamps);
                
                if(addAngleShift) {
                    let shift = angleShift[p.y];
                    if(shift == undefined)
                        shift = 0;

                    angle+=shift;
                }

                let addShine = getRandomInt(0,50) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(5,15);
                    shineMul = getRandomInt(4,7);
                }

                let direction = V2.up.rotate(angle);
                let distance = getRandomInt(distanceCLamps);

                if(addAngleShift) {
                    let mul = dMulToY[p.y];
                    if(mul == undefined)
                        mul = 1;

                    distance*=mul;
                }

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2);

                let maxA = aClapms[1];
                if(addAngleShift) {
                    let mul = aMulToY[p.y];
                    if(mul == undefined)
                        mul = 1;
                    
                    maxA*=mul
                }

                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                    // aValues = aValues.map(a => a*shineMul);
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
            
                return {
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let {p, a} = itemData.frames[f];

                            hlp.setFillColor(colorPrefix + a + ')').dot(p)
                            if(large) {
                                hlp.setFillColor(colorPrefix + a/2 + ')')
                                    .dot(p.x+1, p.y)
                                    .dot(p.x-1, p.y)
                                    .dot(p.x, p.y+1)
                                    .dot(p.x, p.y-1)
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }


        this.snowfall_back = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let framesCount = 150
                let divider = 3;
                let vMul = 0.8;

                let colorPrefix = 'rgba(255,255,255,';
                let blackColorPrefix = 'rgba(0,0,0,';

                let data = [
                    {
                        framesCount, itemsCount: 5000, itemFrameslengthClapms: [100,125], colorPrefix, aClapms: [0, 0.075].map(v=> v/divider), 
                        gradientData: undefined, angleClamps: [250, 255], distanceCLamps: [15,20].map(v=> fast.r(v*vMul)), xCLamps: [0, this.size.x+30], yClapms: [-20, this.size.y], size: this.size,
                        addAngleShift: true
                    },
                    {
                        framesCount, itemsCount: 4500, itemFrameslengthClapms: [100,125], colorPrefix, aClapms: [0, 0.125].map(v=> v/divider), 
                        gradientData: undefined, angleClamps: [248, 257], distanceCLamps: [25,30].map(v=> fast.r(v*vMul)), xCLamps: [0, this.size.x+30], yClapms: [-20, this.size.y], size: this.size,
                        addAngleShift: true
                    },
                    {
                        framesCount, itemsCount: 4000, itemFrameslengthClapms: [100,125], colorPrefix, aClapms: [0, 0.15].map(v=> v/divider), 
                        gradientData: undefined, angleClamps: [245, 260], distanceCLamps: [35,40].map(v=> fast.r(v*vMul)), xCLamps: [0, this.size.x+30], yClapms: [-20, this.size.y], size: this.size,
                        addAngleShift: true
                    },
                    {
                        framesCount, itemsCount: 3500, itemFrameslengthClapms: [100,125], colorPrefix, aClapms: [0, 0.175].map(v=> v/divider), 
                        gradientData: undefined, angleClamps: [243, 262], distanceCLamps: [45,50].map(v=> fast.r(v*vMul)), xCLamps: [0, this.size.x+30], yClapms: [-20, this.size.y], size: this.size,
                        addAngleShift: true
                    },
                    {
                        framesCount, itemsCount: 3000, itemFrameslengthClapms: [100,125], colorPrefix, aClapms: [0, 0.2].map(v=> v/divider), 
                        gradientData: undefined, angleClamps: [240, 264], distanceCLamps: [55,60].map(v=> fast.r(v*vMul)), xCLamps: [0, this.size.x+30], yClapms: [-20, this.size.y], size: this.size,
                        addAngleShift: true
                    }
                    
                    
                ]

                let whiteOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                    let h = fast.r(size.y/2)
                    let change = easing.fast({from: 0, to: 0.1, steps: h, type: 'linear', round: 3});

                    for(let y = 0; y < h; y++) {
                        let a = change[y];//
                        hlp.setFillColor((a < 0 ? blackColorPrefix : colorPrefix) + Math.abs(a) + ')').rect(0,y+ fast.r(size.y*3/4) ,size.x, 1);
                    }
                })

                //this.img = whiteOverlay;

                this.layers = data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames2(d) 
                        this.registerFramesDefaultTimer({});
                    }
                })))
   
            }
        }), 8)

        this.snowfall_front = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let framesCount = 150
                let colorPrefixWhite = 'rgba(255,255,255,'
                let colorPrefix = 'rgba(255,228,185,'
                let colorPrefix2 = 'rgba(255,236,214,'
                let colorPrefix_large = 'rgba(174,132,107,'

                let gradientOrigin = new V2(58, 71)

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(75, 120), radius: new V2(60,80), gradientOrigin, 
                    angle: -15, easingType: 'quad',
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

                let gradientDots2 = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(75, 110), radius: new V2(70,90), gradientOrigin, 
                    angle: -15, easingType: 'expo',
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

                let gradientDots_large = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(70, 120), radius: new V2(80,120), gradientOrigin, 
                    angle: -15, easingType: 'quad',
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
                    for(let y = 0; y < gradientDots2.length; y++) {
                        if(gradientDots2[y]) {
                            for(let x = 0; x < gradientDots2[y].length; x++) {
                                if(gradientDots2[y][x]) {
                                    //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                    hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots2[y][x].maxValue/1,2)})`).dot(x,y) 
                                }
                            }
                        }
                    }
                })

                let data = [
                 
                    
                    {
                        framesCount, itemsCount: 500, itemFrameslengthClapms: [100,125], colorPrefix: colorPrefix2, aClapms: [0, 1], 
                        gradientData: gradientDots2, angleClamps: [230, 270], distanceCLamps: [60,70], xCLamps: [70, this.size.x-20], yClapms: [30, this.size.y-80], 
                        size: this.size, aMul: 3
                    },

                    {
                        framesCount, itemsCount: 1000, itemFrameslengthClapms: [100,125], colorPrefix: colorPrefix, aClapms: [0, 0.8], 
                        gradientData: gradientDots, angleClamps: [230, 270], distanceCLamps: [80,90], xCLamps: [40, this.size.x], yClapms: [20, this.size.y-40], 
                        size: this.size, aMul: 1
                    },
                    // {
                    //     framesCount, itemsCount: 2000, itemFrameslengthClapms: [100,125], colorPrefix: colorPrefix_large, aClapms: [0, 0.6], 
                    //     gradientData: gradientDots_large, angleClamps: [225, 277], distanceCLamps: [100,110], xCLamps: [20, this.size.x+20], yClapms: [0, this.size.y-20], 
                    //     size: this.size, aMul: 2
                    // },
                    // {
                    //     framesCount, itemsCount: 20, itemFrameslengthClapms: [80,100], colorPrefix: colorPrefixWhite, aClapms: [0, 0.4], 
                    //     gradientData: undefined, angleClamps: [250, 260], distanceCLamps: [200,300], xCLamps: [this.size.x, this.size.x+80], yClapms: [-10, this.size.y-20], 
                    //     size: this.size, aMul: 1, large: true,
                    // },
                ]

                this.layers = data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames2(d) 
                        this.registerFramesDefaultTimer({});
                    }
                })))
   
            }
        }), 12)
    }
}