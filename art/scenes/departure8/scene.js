class Departure8Scene extends Scene {
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
                fileNamePrefix: 'departure8',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    //TODO
    // +Повернуть человека, оживить
    // +Добавить кота
    // +Добавить подпись
    // +Добавить тёмные линии на крыше и подкрасить передний столю
    // +Добавить искрящийся снег
    // +Немного оживить светофор
    // +оживить комнату

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Departure8Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let skyMask = createCanvas(this.viewport.clone(), (ctx, size, hlp) => {
            hlp.setFillColor('rgba(162,195,216,1)').rect(0,0,size.x, size.y)
            //ctx.drawImage(PP.createImage(model, { renderOnly: ['skyMask'] }),0,0)
        })

        let createSnowFrames = function({framesCount, itemsCount, itemFrameslengthClamps, size, skyMask, excludeMask,
            speedMul= 1, aMul =1, aClamps,xClamps, yClamps, speedClamps, fx, cPrefix, lowerYClamps, addRightFlow = false, addSpeedModifier = false, snowFlakeSize =1,
        }) {

            aMul = 0.75

            let frames = [];
            let speedModifierClamps = [0.7,1]
            let speedModifierValues = easing.fast({from: speedModifierClamps[0], to: speedModifierClamps[1], steps: 100, type: 'linear', round: 2});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClamps);

                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let aParam = getRandomBool() ? 1 : -1
            
                if(addSpeedModifier) {
                    speedMul = 1;
                    if(p0.y < 0) {
                        speedMul = speedModifierClamps[0]
                    }
                    else if(p0.y > 100){
                        speedMul = speedModifierClamps[1]
                    }
                    else {
                        speedMul = speedModifierValues[p0.y];
                    }
    
                    if(speedMul == undefined){
                        speedMul = 1;
                    }
                }

                let sfSize = 1;
                let sfPosition = 0;

                if(snowFlakeSize > 1 && getRandomInt(0,15) == 0) {
                    sfSize = getRandomInt(1,snowFlakeSize)
                    if(sfSize > 1) {
                        sfPosition = getRandomInt(0, 3);
                    }
                }
                
                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let lowerY = getRandomInt(lowerYClamps);

                let speed = getRandom(speedClamps[0], speedClamps[1])*speedMul;

                let y = -getRandomInt(0,10)*speed;
                let frames = [];

                let rightFlow = false;
                if(addRightFlow){
                    rightFlow = getRandomInt(0,50) == 0;
                    if(rightFlow) {
                        p0.x = xClamps[1];
                    }
                }

                let xShift = 0;

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let a = aValues[f] != undefined ? aValues[f]*aMul : aClamps[0];

                    if(a < aClamps[0])
                        a = aClamps[0];
        
                    if(rightFlow) {
                        xShift+=speed/4;
                    }

                    frames[frameIndex] = {
                        a,
                        shift: new V2(fx(y, aParam) + xShift, y)
                    }
                    
                    y+=speed;
                }
            
                return {
                    p0,
                    lowerY,
                    sfSize,
                    sfPosition,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let p = itemData.p0.add(itemData.frames[f].shift).toInt();
                            if(p.y < itemData.lowerY)  {
                                hlp.setFillColor(cPrefix + itemData.frames[f].a + ')').dot(p)

                                if(itemData.sfSize > 1) {
                                    hlp.setFillColor(cPrefix + itemData.frames[f].a/2 + ')')
                                    for(let j = 1; j < itemData.sfSize; j++) {
                                        let sfPosition = itemData.sfPosition + (j-1);
                                        if(sfPosition > 3) 
                                            sfPosition = 0;

                                        switch(sfPosition) {
                                            case 0: hlp.dot(p.x+1, p.y); break;
                                            case 1: hlp.dot(p.x, p.y+1); break;
                                            case 2: hlp.dot(p.x-1, p.y); break;
                                            case 3: hlp.dot(p.x, p.y-1); break;
                                            default: break;
                                        }

                                        
                                    }
                                }
                            }
                        }
                        
                    }

                    if(skyMask) {
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(skyMask, 0, 0)
                    }

                    if(excludeMask) {
                        ctx.globalCompositeOperation = 'destination-out'
                        ctx.drawImage(excludeMask, 0, 0)
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
        }), 1)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['ground'] })
            }
        }), 3)

        this.bridge = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bridge'] })
            }
        }), 5)

        this.train = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['train', 'train_d', 'train_d2'] })
            }
        }), 7)

        this.traffic_lights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['traffic_lights'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'traffic_lights_p')) });

                            this.registerFramesDefaultTimer({});
                    }
                }))


                this.snowfallLayers = [
                    {
                        framesCount: 300, itemsCount: 15000, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, 
                        excludeMask: PP.createImage(model, { renderOnly: ['excludeMask2'], forceVisibility: { excludeMask2: {visible: true} } }),
                        aClamps: [0,0.15], xClamps: [0, 150], yClamps: [-20, 140], speedClamps: [0.05, 0.1], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [135,145],
                        fx: (y, aParam) => aParam*Math.sin(y*0.5)*0.5
                    }
                ].map((p) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames(p)

                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 9)

        this.station = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['station', 'station_d', 'station_d2', 'pillars'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 25, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'room_p')) });

                            this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'shine_zone')).map(pd => new V2(pd.point));
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + fast.r(getRandom(0.05,0.2),2) + ')'
                        }));

                        let frames1 = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [10,20], pointsData: availableDots, size: this.size,
                        pdPredicate: () => getRandomInt(0,10) == 0, 
                            // smooth: {
                            //     aClamps: [0,0.15], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            // }
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

                this.person = this.addChild(new GO({
                    position: new V2(74,0),
                    size: this.size,
                    init() {
                        this.img = 
                        createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.translate(size.x, 0);
                            ctx.scale(-1, 1);
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['person'] }), 0,0)
                        })

                        this.animation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let s = this.size;
                                this.frames = [
                                    ...new Array(220).fill(undefined), 
                                    ...animationHelpers.createMovementFrames({ framesCount: 80, itemFrameslength: 50, size: this.size, 
                                        startFrameIndexPredicate: (pd, i) => {
                                            return getRandomInt(0, 19)
                                        },
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'person_p')) 
                                })
                                    .map(f => createCanvas(s, (ctx, size, hlp) => {
                                        ctx.translate(size.x, 0);
                                        ctx.scale(-1, 1);
                                        ctx.drawImage(f, 0,0)
                                    }))
                                ];

                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }))

                this.cat = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['cat'] })
                        this.animation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = [
                                    undefined,
                                    PP.createImage(model, { renderOnly: ['cat_f1'] }),
                                    PP.createImage(model, { renderOnly: ['cat_f2'] }),
                                    PP.createImage(model, { renderOnly: ['cat_f2'] }),
                                    PP.createImage(model, { renderOnly: ['cat_f1'] }),
                                    
                                ]

                                let framesIndexValues = 
                                [
                                    ...easing.fast({from: 0, to: this.frames.length-1, steps: 50, type: 'quad', method: 'inOut', round: 0}),
                                    ...new Array(100).fill(undefined)
                                ]

                                this.currentFrame = 0;
                                this.img = this.frames[framesIndexValues[this.currentFrame]];
                                
                                this.timer = this.regTimerDefault(10, () => {
                                    this.img = this.frames[framesIndexValues[this.currentFrame]];
                                    this.currentFrame++;
                                    if(this.currentFrame == framesIndexValues.length){
                                        this.currentFrame = 0;
                                    }
                                })
                            }
                        }))
                    }
                }))

                let excludeMask1 = PP.createImage(model, { renderOnly: ['excludeMask1'], forceVisibility: { excludeMask1: {visible: true} } });

                this.snowfallLayers = [
                    {
                        framesCount: 300, itemsCount: 7000, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, excludeMask: excludeMask1,
                        aClamps: [0,0.25], xClamps: [-10, 145], yClamps: [-20, this.size.y-50], speedClamps: [0.15, 0.2], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [145,150],
                        fx: (y, aParam) => aParam*Math.sin(y*0.35)*0.6
                    },
                    {
                        framesCount: 300, itemsCount: 4000, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, excludeMask: excludeMask1,
                        aClamps: [0,0.3], xClamps: [-10, 128], yClamps: [-20, this.size.y-50], speedClamps: [0.2, 0.25], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [150,175],
                        fx: (y, aParam) => aParam*Math.sin(y*0.3)*0.7
                    },
                    {
                        framesCount: 300, itemsCount: 2000, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, excludeMask: excludeMask1,
                        aClamps: [0,0.4], xClamps: [-10, 125], yClamps: [-20, this.size.y-30], speedClamps: [0.3, 0.35], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [170,190], addRightFlow: true,addSpeedModifier: true,
                        fx: (y) => -Math.sin(y*0.25)*0.9
                    },
                    {
                        framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, excludeMask: excludeMask1,
                        aClamps: [0,0.6], xClamps: [-10, 120], yClamps: [-20, 170], speedClamps: [0.4, 0.45], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [this.size.y, this.size.y], addRightFlow: true, addSpeedModifier: true, snowFlakeSize: 2,
                        fx: (y) => -Math.sin(y*0.2)
                    },
                    {
                        framesCount: 300, itemsCount: 300, itemFrameslengthClamps: [100,120], size: this.size, skyMask: skyMask, excludeMask: excludeMask1,
                        aClamps: [0,0.8], xClamps: [-10, 115], yClamps: [-20, 180], speedClamps: [0.5, 0.6], cPrefix: whiteColorPrefix, 
                        lowerYClamps: [this.size.y, this.size.y], addSpeedModifier: true, snowFlakeSize: 3,
                        fx: (y) => -Math.sin(y*0.1)
                    }
                ].map((p) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowFrames(p)

                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 11)

        
    }
}