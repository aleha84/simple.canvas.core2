class CityView2Scene extends Scene {
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
                fileNamePrefix: 'cityView2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    /*
    
   + 1. Снегопад перед фонарем
   + 2. Снегопад перед фарами
   + 3. Анимация дальнего города
   + 4. Блёстки в небе и на снегу
   + 5. Анимация стеклоочистителей
   + 6. Анимация сломанной лампы слева (вкл\выкл)
    
    */

    start(){
        let model = CityView2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //

        let createSnowFallFrames = function({framesCount, itemsCount, itemFrameslengthClapms, colorPrefix, aClapms, mask, angleClamps, 
            distanceCLamps, xClamps, yClamps, size, aMul = 1, angleYChange = [0,0], snowflakeLengthClamps = [0,0], alphaUseEasing = false, doubleHeight =false, addParticlesShine = undefined, changeXSpeed = undefined, lowerLinePoints = []
        }) {
            let frames = [];

            let v2Zero = V2.zero;

            let xSpeedValues = new Array(size.x).fill(1);
            if(changeXSpeed && isFunction(changeXSpeed)) {
                xSpeedValues = changeXSpeed(size)
            }

            let angleToYChangeValues = easing.fast({from: angleYChange[0], to: angleYChange[1], steps: size.y, type: 'linear', method: 'base', round: 2});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslengthClapms);
                //totalFrames = framesCount;
                let p = V2.random(xClamps, yClamps);
                let sLen = getRandomInt(snowflakeLengthClamps);
                let angle = getRandomInt(angleClamps);

                let angleChange = angleToYChangeValues[p.y];
                if(angleChange == undefined) 
                {
                    if(p.y < 0)
                        angleChange = angleYChange[0];
                    else if(p.y >= size.y)
                        angleChange = angleYChange[1]
                    else 
                        angleChange = 0;
                }
                angle+=angleChange;
            
                let direction = V2.up.rotate(angle);
                let distance = getRandomInt(distanceCLamps) * (xSpeedValues[p.x] || 1);

                let p2 = p.add(direction.mul(distance)).toInt();
                let points = appSharedPP.lineV2(p, p2, { toV2: true });

                let maxA = aClapms[1];
                let pointIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});
                let aValues = [
                    ...easing.fast({from: aClapms[0], to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: maxA, to: aClapms[0], steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 3})
                ]

                let addShine = addParticlesShine && getRandomInt(0,addParticlesShine.upperChance) == 0;
                let shineLength = 0;
                let shineMul = 1;
                if(addShine) {
                    shineLength = getRandomInt(addParticlesShine.framesLengthClamps);
                    shineMul = getRandomInt(addParticlesShine.aMulClamps);
                }

                if(addShine) {
                    for(let i = 0; i < shineLength; i++) {
                        aValues[fast.r(totalFrames/2)+i]*=shineMul;
                    }
                    // aValues = aValues.map(a => a*shineMul);
                }

                let linePoints = [];
                let lineAValues = [];
                if(sLen > 0) {
                    linePoints = appSharedPP.lineV2(new V2(), new V2().add(direction.mul(sLen)).toInt());
                    lineAValues = alphaUseEasing ? [
                        ...easing.fast({ from: 0, to: maxA, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: maxA, to: 0, steps: fast.r(linePoints.length/2), type: 'quad', method: 'inOut', round: 2 })
                    ] : new Array(linePoints.length).fill(maxA);
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = points[pointIndexValues[f]]
                    let a = aValues[f] || 0;
            
                    if(lowerLinePoints[p.x] && p.y > lowerLinePoints[p.x])
                        continue;

                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames,
                    linePoints,
                    lineAValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let { linePoints, lineAValues, } = itemData
                            let {p, a} = itemData.frames[f];

                            let repeats = 1;
                            if(doubleHeight)
                                repeats = 2;

                            for(let yShift = 0; yShift < repeats; yShift++) {
                                if(linePoints.length > 0) {
                                    let prev = undefined;
                                    for(let i = 0; i < linePoints.length; i++) {
                                        let lp = linePoints[i];
        
                                        let tp = p.add(lp);
                                        let currentA = a*(lineAValues[i] || 0); 
                                        hlp.setFillColor(colorPrefix + currentA).dot(tp.x, tp.y+yShift)
    
                                        // if(prev && prev.y != tp.y) {
                                        //     hlp.setFillColor(colorPrefix + currentA/2).dot(tp.x+1, tp.y+yShift)
                                        // }
    
                                        prev = tp;
                                    }
                                }
                                else {
                                    hlp.setFillColor(colorPrefix + a + ')').dot(p.x, p.y + yShift)
                                }
                            }
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg', 'bg_d2', 'bg_d3'] }),
            init() {
                this.animation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pixels = getPixels(this.parent.img, this.size);

                        let randomSpread = [-3, 3]

                        let pd = [];
                        for (let i = 0; i < pixels.length; i++) {
                            let pixelData = pixels[i];
                            let pColorHex = colors.rgbToHex(pixelData.color);
                            if (true) {
                                pd.push({
                                    color: pColorHex,
                                    point: pixelData.position.add(V2.random([0,0], randomSpread))
                                })
                            }
                        }

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 300, itemFrameslength: [20, 30], size: this.size,
                            pointsData: pd, pdPredicate: () => getRandomInt(0, 1) == 0
                        }); //

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.far_city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['far_city'] }),
            init() {
                //
            }
        }), 3)

        this.mid_city = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['mid_city'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'city_p')) });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        let full_mask = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('#47667a').rect(0,0,size.x,size.y)
        })

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['road'] }),
            init() {
                this.brokenLamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let img = PP.createImage(model, { renderOnly: ['lamp_2_light'] });
                        let totalFrames = 300
                        let framesInfo = new Array(totalFrames).fill(undefined);

                        let mergeData = [
                            ...new Array(10).fill(img),
                            ...new Array(5).fill(undefined),
                            ...new Array(15).fill(img),
                            ...new Array(25).fill(undefined),
                            ...new Array(5).fill(img),
                        ]

                        framesInfo.splice(getRandomInt(totalFrames/2,totalFrames*3/4), mergeData.length, ...mergeData);

                        // for(let i=0; i < 5; i++) {
                        //     let amount = getRandomInt(5,15);

                        //     framesInfo.splice(getRandomInt(0,totalFrames-1), amount, ...new Array(amount).fill(img));
                        // }

                        framesInfo.splice(totalFrames);

                        this.currentFrame = 0;
                        this.img = framesInfo[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = framesInfo[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == framesInfo.length){
                                this.currentFrame = 0;
                            }
                        })

                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 30, size: this.size, 
                            pointsData: animationHelpers.extractPointData(PP.getLayerByName(model, 'road_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let corners = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_snow_shine_zone')).map(pd => new V2(pd.point));
                        let aToy = easing.fast({from: 0.05, to: 0.2, steps: 53, type: 'linear', round: 2});
                        
                        let availableDots = appSharedPP.fillByCornerPoints(corners).map(p => ({
                            point: p,
                            color: whiteColorPrefix + aToy[p.y-146] + ')'
                            //aClamps: [0, aToy[p.y-146] || 0]
                        }));

                        this.frames = animationHelpers.createMovementFrames({framesCount: 300, itemFrameslength: [10,20], pointsData: availableDots, size: this.size,
                            pdPredicate: () => getRandomInt(0,30) == 0, 
                            // smooth: {
                            //     aClamps: [0,0.2], easingType: 'quad', easingMethod: 'inOut', easingRound: 2
                            // }
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parent.parentScene.capturing.stop = true;
                            }
                        });

                    }
                }))


                this.snowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, {renderOnly: ['lamp_g'], forceVisivility: { lamp_g: { visible: true } }})
                        let mask2 = PP.createImage(model, {renderOnly: ['lamp_g2'], forceVisivility: { lamp_g2: { visible: true } }})

                        this.lampLight = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.15;
                                ctx.drawImage(mask, 0, 0)
                            })
                        }))

                        let dModifier = 0.9;

                        this.layers = [
                            // {
                            //     framesCount: 300, itemsCount: 6000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.15], mask: full_mask, angleClamps: [190, 200], distanceCLamps: [55, 60].map(x => fast.r(x*dModifier)), xClamps: [0,220], yClamps: [-20,140], size: this.size, aMul: 1, lowerLinePoints: [],
                            //     //snowflakeLengthClamps: [1,1]
                            // },
                            {
                                framesCount: 300, itemsCount: 2000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.25], mask: mask, angleClamps: [190, 200], distanceCLamps: [50, 55].map(x => fast.r(x*dModifier)), xClamps: [90, 180], yClamps: [-10, 60], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },
                            {
                                framesCount: 300, itemsCount: 1000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.5], mask: mask, angleClamps: [190, 200], distanceCLamps: [60, 65].map(x => fast.r(x*dModifier)), xClamps: [90, 180], yClamps: [-10, 60], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },{
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: mask, angleClamps: [190, 200], distanceCLamps: [70, 75].map(x => fast.r(x*dModifier)), xClamps: [90, 180], yClamps: [-10, 60], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },
                            {
                                framesCount: 300, itemsCount: 200, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask, angleClamps: [190, 200], distanceCLamps: [75, 80].map(x => fast.r(x*dModifier)), xClamps: [90, 180], yClamps: [-10, 60], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },
                            {
                                framesCount: 300, itemsCount: 300, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask2, angleClamps: [190, 200], distanceCLamps: [95, 100], xClamps: [90, 180], yClamps: [-10, 60], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            }
                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))
            }
        }), 7)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car', 'car_d'] }),
            init() {
                let windshield_snow_zone_dots = appSharedPP.fillByCornerPoints(animationHelpers.extractPointData(PP.getLayerByName(model, 'windshield_snow_zone')).map(pd => new V2(pd.point)))
                let cleaners_snow_zone_dots = appSharedPP.fillByCornerPoints(animationHelpers.extractPointData(PP.getLayerByName(model, 'cleaners_snow_zone')).map(pd => new V2(pd.point)));

                this.windshieldSnow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let availableDots = windshield_snow_zone_dots

                        let aClamps = [0.025, 0.075]

                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#c58b75');

                            ctx.globalAlpha = fast.r(getRandom(aClamps[0], aClamps[1]),3);
                            for(let i = 0; i < 1000;i++) {
                                hlp.dot(availableDots[getRandomInt(0, availableDots.length-1)])
                            }
                        })
                    }
                }))

                this.cleaners = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createCleanersFrames({framesCount, cleanersFramesCount, availableDots, snowFlakesItemsCount, snowFlakesColor, aClamps, size}) {
                        let frames = [];
                        let cleanersStartFrame = framesCount - cleanersFramesCount;
                        
                        let itemsData = new Array(snowFlakesItemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = framesCount-startFrameIndex;
                            let p = availableDots[getRandomInt(0, availableDots.length-1)]
                            let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    visible: true
                                };
                            }
                        
                            return {
                                p,a,
                                frames
                            }
                        })

                        let t = 'linear'//sin'
                        let m = 'base'//'out'
                        let steps1 = fast.r(cleanersFramesCount*1/2)
                        let steps2 = cleanersFramesCount-steps1;
                        let data = [
                            {
                                p0: new V2(129, 147),
                                lenValues: [
                                    ...easing.fast({from: 14, to: 7, steps: steps1, type: 'quad', method: 'out', round: 2}),
                                    ...easing.fast({from: 7, to: 14, steps: steps2, type: 'quad', method: 'in', round: 2})
                                ],
                                angleValues: [
                                    ...easing.fast({from: 0, to: 125, steps: steps1, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 125, to: 0, steps: steps2, type: t, method: m, round: 2})
                                ]
                            },
                            {
                                p0: new V2(144, 148),
                                lenValues: [
                                    ...easing.fast({from: 13, to: 8, steps: steps1, type: 'quad', method: 'out', round: 2}),
                                    ...easing.fast({from: 8, to: 13, steps: steps2, type: 'quad', method: 'in', round: 2})
                                ],
                                angleValues: [
                                    ...easing.fast({from: 6, to: 95, steps: steps1, type: t, method: m, round: 2}),
                                    ...easing.fast({from: 95, to: 6, steps: steps2, type: t, method: m, round: 2})
                                ]
                            }
                        ]

                        let cleanersItemsData = new Array(framesCount - cleanersFramesCount).fill([
                            {
                                p0: data[0].p0,
                                direction: V2.left.rotate(data[0].angleValues[0]),
                                len: data[0].lenValues[0]
                            },
                            {
                                p0: data[1].p0,
                                direction: V2.left.rotate(data[1].angleValues[0]),
                                len: data[1].lenValues[0]
                            }
                        ]);
                        
                        cleanersItemsData.push(...new Array(cleanersFramesCount).fill().map((_,i) => {

                            return data.map(d => ({
                                p0: d.p0,
                                direction: V2.left.rotate(d.angleValues[i]),
                                len: d.lenValues[i] 
                            }))
                        }))
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                hlp.setFillColor(snowFlakesColor);

                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f] && itemData.frames[f].visible){
                                        ctx.globalAlpha = itemData.a;
                                        hlp.dot(itemData.p)
                                    }
                                    
                                }

                                ctx.globalAlpha = 1;
                                let pp = new PP({ctx});

                                
                                ctx.globalCompositeOperation = 'destination-out'
                                //console.log('!')
                                ctx.drawImage(createCanvas(this.size, (ctx, size, hlp) => {
                                    let pp1 = new PP({ctx});
                                    pp1.setFillColor('red');
                                    cleanersItemsData[f].forEach((d,i) => {
                                        let p1 = d.p0.add(d.direction.mul(d.len+1))

                                        if(!data[i].prevP1) {
                                            data[i].prevP1 = [p1]
                                        }
                                        else {
                                            if(data[i].prevP1.filter(p => p.equal(p1)).length == 0){
                                                data[i].prevP1.push(p1);
                                            }
                                        }


                                        d.p1 = p1;

                                        let cp = [d.p0];
                                        
                                        data[i].prevP1.forEach(p => {
                                            cp.push(p);
                                        })

                                        if(cp.length >= 3)
                                            pp1.fillByCornerPoints(cp);
                                        
                                    })

                                }), 0, 0)

                                ctx.globalCompositeOperation = 'source-over'

                                cleanersItemsData[f].forEach(d => {

                                    pp.setFillColor('#150417')
                                    pp.lineV2(d.p0, d.p1)

                                    pp.setFillColor('#412b2f')
                                    pp.lineV2(d.p0.add(d.direction.mul(2)), d.p0.add(d.direction.mul(d.len-1)))

                                })
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createCleanersFrames({framesCount: 300, cleanersFramesCount: 40, 
                            snowFlakesItemsCount:160, snowFlakesColor: '#c58b75', aClamps:[0.1,0.3], size: this.size,
                            availableDots: cleaners_snow_zone_dots
                        }) 

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.windShield_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pointsData = [
                            ...cleaners_snow_zone_dots.map(p => ({
                                point: p, 
                                color: whiteColorPrefix + fast.r(getRandom(0, 0.1), 2) + ')'
                            })),
                            ...windshield_snow_zone_dots.map(p => ({
                                point: p, 
                                color: whiteColorPrefix + fast.r(getRandom(0, 0.1), 2) + ')'
                            }))
                        ]

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [15,30], size: this.size, 
                            pointsData, pdPredicate: () => getRandomInt(0, 3) == 0,})

                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.snowfall = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, {renderOnly: ['car_g'], forceVisivility: { car_g: { visible: true } }})
                        

                        this.lampLight = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            img: createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.15;
                                ctx.drawImage(mask, 0, 0)
                            })
                        }))

                        let dModifier = 1.1;

                        this.layers = [
                           {
                                framesCount: 300, itemsCount: 500, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.75], mask: mask, angleClamps: [190, 200], distanceCLamps: [70, 75].map(x => fast.r(x*dModifier)), xClamps: [80,150], yClamps: [130,150], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },
                            {
                                framesCount: 300, itemsCount: 200, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 1], mask: mask, angleClamps: [190, 200], distanceCLamps: [75, 80].map(x => fast.r(x*dModifier)), xClamps: [80,150], yClamps: [130,150], size: this.size, aMul: 1, lowerLinePoints: [],
                                //snowflakeLengthClamps: [1,1]
                            },
                            ,
                            {
                                framesCount: 300, itemsCount: 5000, itemFrameslengthClapms: [70, 80], colorPrefix: whiteColorPrefix, aClapms: [0, 0.25], mask: full_mask, angleClamps: [190, 200], distanceCLamps: [75, 80].map(x => fast.r(x*dModifier)), xClamps: [0,220], yClamps: [-20,150], size: this.size, aMul: 1, lowerLinePoints: [], 
                                //addParticlesShine: { upperChance:20, framesLengthClamps: [5,5], aMulClamps: [5,10]  }
                                //snowflakeLengthClamps: [1,1]
                            }
                        ].map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createSnowFallFrames(d),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })));
                    }
                }))
            }
        }), 9)
    }
}