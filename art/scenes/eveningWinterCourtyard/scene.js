class EveningWinterCourtyardScene extends Scene {
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
                fileNamePrefix: 'eveningWinterCourtyard',
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
        const model = EveningWinterCourtyardScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        let colorPrefix = 'rgba(255,255,255,'//'rgba(255,202,153,';
        let blueColorPrefix = 'rgba(186,224,255,'//'rgba(204,243,255,'//'rgba(176,235,252,'

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, addShining,
            aClamps,xClamps, yClamps, angleClamps, speedClamps, speedMul= 1, aMul =1, cPrefix, mask, detailing = false,
        }) {
            let frames = [];
            speedMul = 0.75
            let speedChangeValues = [];
            if(detailing) {
                speedChangeValues = [
                    ...easing.fast({from: 0.75, to: 1, steps: size.y/2, type: 'quad', method: 'inOut'}),
                    ...easing.fast({from: 1, to: 0.75, steps: size.y/2, type: 'quad', method: 'inOut'})
                ]
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let speed = getRandom(speedClamps[0]*speedMul, speedClamps[1]*speedMul);

                if(detailing) {
                    let speedMul = speedChangeValues[p0.y];
                    if(speedMul == undefined)
                        speedMul = 1;

                    speed*=speedMul;     
                }

                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let addShine = addShining && p0.y > 60 && getRandomInt(0,50) == 0;
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

        let mainMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            hlp.setFillColor('#FFCA99').rect(0,0,size.x, size.y);

            ctx.drawImage(PP.createImage(model, { renderOnly: ['sky_zone'] }),0,0)
            
            let gradientDots = colors.createRadialGradient({ size: size.clone(), 
                center: new V2(15,185), radius: new V2(150,70), gradientOrigin: new V2(95,155), 
                angle: 0, easingType: 'quad', easingMethod: 'out',
                setter: (dot, aValue) => {
                    aValue*=2;

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
                            //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                            hlp.setFillColor(`${blueColorPrefix}${fast.r(gradientDots[y][x].maxValue/1,2)})`).dot(x,y) 
                        }
                    }
                }
            }
        })

        

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })

                
            }
        }), 1)

        this.bg_snowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                //this.img = mask;

                


                let data = [
                    {
                        framesCount: 150, itemsCount: 1000, itemFrameslengthClamps: [60,80], size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.05], xClamps: [-5, this.size.x+5], yClamps: [-5, 55], angleClamps: [-4,4], speedClamps: [0.025,0.04],
    
                    },
                    {
                        framesCount: 150, itemsCount: 400, itemFrameslengthClamps: [60,80], size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.1], xClamps: [-5, this.size.x+5], yClamps: [-5, 55], angleClamps: [-6,6], speedClamps: [0.05,0.1],
    
                    },
                    {
                        framesCount: 150, itemsCount: 400, itemFrameslengthClamps: [60,80], size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.2], xClamps: [-5, this.size.x+5], yClamps: [-5, 55], angleClamps: [-8,8], speedClamps: [0.1,0.2],
    
                    }
                ]
                
                this.layers = data.map(d => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: createSnowFrames(d),
                        init() {
                            this.registerFramesDefaultTimer({});
                        }
                    })))
                
            }
        }), 2)

        this.houses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['houses', 'house_d', 'house_d2', 'cat', 'ground'] })

                this.tv = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // let tvZone = PP.createImage(model, { renderOnly: ['tv_zone'], forceVisivility: { tv_zone: { visible: true } } })
                        // let preRenders = [0, 0.05, 0.1].map(a => createCanvas(this.size, (ctx, size, hlp) => { //0.02, 0.03, 0.04
                        //     ctx.globalAlpha= a;
                        //     ctx.drawImage(tvZone, 0, 0);
                        // }))

                        let al = 0.3
                        let preRenders = new Array(4).fill().map((el, i) => 
                            i == 0 ? undefined :
                            createCanvas(this.size, (ctx, size, hlp) => { 
                                    let lName = 'tv_zone_' + i;
                                    ctx.globalAlpha= al; 
                                    ctx.drawImage(PP.createImage(model, { renderOnly: [lName], forceVisivility: { [lName]: { visible: true } } }), 0, 0) 
                                }
                            )
                        )

                        let frameChangeDelay = getRandomInt(5,10) ;
                        this.img = preRenders[getRandomInt(0, frames.length-1)]
                    
                        //this.img = frames[0];
                        this.timer = this.regTimerDefault(10, () => {                     
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = getRandomInt(5,10);
                        
                            this.img = preRenders[getRandomInt(0, preRenders.length-1)]
                        })
                    }
                }))

                this.p1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [60,70], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p_1')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [20,30], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p_2')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.p3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: [5,10], size: this.size, 
                            pdPredicate: () => getRandomInt(0,1) == 0,
                            pointsData: 
                            animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p_3'))//.map(p => ({...p, color: 'rgba(255,255,255,0.4)'})) 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.condi = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['condi_alter'], forceVisivility: { condi_alter: { visible: true } } })

                        let frameChangeDelay = 25;
                        this.img = undefined;
                    
                        //this.img = frames[0];
                        this.timer = this.regTimerDefault(10, () => {                     
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = 25;
                        
                            this.img = this.img ? undefined : img;
                        })
                    }
                }))

                // this.garlands = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let img1 = PP.createImage(model, { renderOnly: ['girl_1'], forceVisivility: { girl_1: { visible: true } } })
                //         let img2 = PP.createImage(model, { renderOnly: ['girl_2'], forceVisivility: { girl_2: { visible: true } } })

                //         let totalFrames = 75;
                //         let maxA = 0.35
                //         let minA = 0;
                //         let aValues1 = [
                //             ...easing.fast({from: minA, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                //             ...easing.fast({from: maxA, to: minA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                //         ]

                //         let aValues2 = [
                //             ...easing.fast({from: maxA, to: minA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                //             ...easing.fast({from: minA, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                //         ]

                //         this.frames = [];


                //         for(let f = 0; f < totalFrames; f++) {
                //             this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 ctx.globalAlpha = aValues1[f];
                //                 ctx.drawImage(img1, 0, 0)

                //                 ctx.globalAlpha = aValues2[f];
                //                 ctx.drawImage(img2, 0, 0)
                //                 //76 > 75 ? 76-75 : 75-0
                //             })
                //         }

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 5)

        this.snowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                //this.img = mainMask;
                let mask2 = createCanvas(this.size, (ctx, size, hlp) => {
                    let gradientDots = colors.createRadialGradient({ size: size.clone(), 
                        center: new V2(110,140), radius: new V2(50,50), gradientOrigin: new V2(97,153), 
                        angle: 0, easingType: 'quad', easingMethod: 'out',
                        setter: (dot, aValue) => {
                            aValue*=3;
        
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
                                    //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                    hlp.setFillColor(`${blueColorPrefix}${fast.r(gradientDots[y][x].maxValue/1,2)})`).dot(x,y) 
                                }
                            }
                        }
                    }
                })
                
                let itemFrameslengthClamps = [60,80]


                let data = [
                    {
                        framesCount: 150, itemsCount: 100, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mask2,
                        aClamps: [0, 1], xClamps: [75, 98], yClamps: [154, 180], angleClamps: [-6,6], speedClamps: [0.05,0.1],
    
                    },
                    {
                        framesCount: 150, itemsCount: 3300, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.1], xClamps: [20, this.size.x-20], yClamps: [-5, this.size.y-10], angleClamps: [-6,6], speedClamps: [0.1,0.15], addShining: true,
                        detailing: true
    
                    },
                    {
                        framesCount: 150, itemsCount: 1600, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.2], xClamps: [10, this.size.x-10], yClamps: [-5, this.size.y], angleClamps: [-8,8], speedClamps: [0.15,0.2], addShining: true,
                        detailing: true
    
                    },
                    ,
                    {
                        framesCount: 150, itemsCount: 850, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.3], xClamps: [5, this.size.x-5], yClamps: [-5, this.size.y], angleClamps: [-10,10], speedClamps: [0.2,0.25], addShining: true,
                        detailing: true
    
                    },
                    {
                        framesCount: 150, itemsCount: 550, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.4], xClamps: [-5, this.size.x], yClamps: [-5, this.size.y], angleClamps: [-10,10], speedClamps: [0.25,0.3], addShining: true,
                        detailing: true
    
                    },
                    {
                        framesCount: 150, itemsCount: 250, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.55], xClamps: [-5, this.size.x], yClamps: [-5, this.size.y], angleClamps: [-11,11], speedClamps: [0.4,0.45], addShining: true,
                        detailing: true
    
                    },
                    {
                        framesCount: 150, itemsCount: 150, itemFrameslengthClamps, size: this.size, cPrefix: colorPrefix, mask: mainMask,
                        aClamps: [0, 0.7], xClamps: [-5, this.size.x], yClamps: [-5, this.size.y], angleClamps: [-13,13], speedClamps: [0.5,0.6], addShining: true,
                        detailing: true
    
                    }
                ]
                
                this.layers = data.map(d => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: createSnowFrames(d),
                        init() {
                            this.registerFramesDefaultTimer({});
                        }
                    })))
                
            }
        }), 7)
    }
}