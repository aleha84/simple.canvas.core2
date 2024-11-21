class Shelter2Scene extends Scene {
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
                size: new V2(200,200).mul(3),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'shelter2',
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
        +1. Дождь у фонаря. 
        +2. Дождь вокруг будки
        +3. Капли на асфальте
        +4. Анимация листьев (сдвиг вниз)
        +5. Анимация листьев на стене слева
        +6. Точечная анимация зелени, стены
        +7. Следы капель на будке
        +8. Анимация кота
        +9. Анимация потока стекающей воды в канавке
        10. Капли с верхних листьев
    */

    start() {
        let model = Shelter2Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let blackColorPrefix = 'rgba(0,0,0,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createRainFrames = function ({
            angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
            framesCount, itemsCount, size, useACurve = false, }) {
            let frames = [];

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount - 1);
                let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);

                let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                let p0 = V2.random(xClamps, upperYClamps);
                let angle = getRandom(angleClamps[0], angleClamps[1])
                let direction = V2.down.rotate(angle);
                let len = getRandomInt(lengthClamps);

                let lineAValues = undefined;
                if (useACurve) {
                    lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
                }

                let frames = [];
                let current = p0;
                let ly = isArray(lowerY) ? getRandomInt(lowerY) : lowerY;

                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }

                    let p0 = current.clone();
                    let p1 = current.add(direction.mul(len)).toInt();

                    frames[frameIndex] = {
                        p0,
                        p1
                    };

                    current = p0.add(direction.mul(speed)).toInt()
                    if (current.y > ly)
                        break;
                }

                return {
                    frames,
                    lowerY: ly,
                    lineAValues
                }
            })

            for (let f = 0; f < framesCount; f++) {
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ ctx });
                    pp.setFillColor(whiteColorPrefix + aValue + ')')
                    for (let p = 0; p < itemsData.length; p++) {
                        let itemData = itemsData[p];

                        if (itemData.frames[f]) {

                            let { p0, p1 } = itemData.frames[f];
                            if (p0.y > itemData.lowerY)
                                continue;

                            if (!useACurve)
                                pp.lineV2(p0, p1);
                            else {
                                let points = appSharedPP.lineV2(p0, p1)
                                for (let i = 0; i < points.length; i++) {
                                    let a = itemData.lineAValues[i];
                                    if (a == undefined)
                                        a = 0;

                                    let p = points[i];
                                    if (p.y > itemData.lowerY)
                                        continue;

                                    hlp.setFillColor(whiteColorPrefix + a + ')').dot(points[i])
                                }
                            }
                        }

                    }

                    if (mask) {
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
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['wall', 'wall_d', 'sign'] }),
            init() {
                this.leftLeafsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let animation = {
                            type: 0,
                            shiftDirection: V2.right
                        };

                        let triggerData = [
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(22, 27), new V2(33, -10)],
                                p0: new V2(22, 27), p1: new V2(39, 29),
                                triggerMovementStartIndex: 10, triggerMovementFramesCount: 300,
                                itemFramesCount: [60, 90],
                                startFrameIndex: [0, 200],
                                animation: animation,
                            },
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(-10, 30), new V2(14, 28), new V2(28, 22)],
                                p0: new V2(14, 28), p1: new V2(21, 38),
                                triggerMovementStartIndex: 40, triggerMovementFramesCount: 300,
                                itemFramesCount: [60, 90],
                                startFrameIndex: [0, 200],
                                animation: animation,
                            },
                            {
                                easingType: 'quad', easingMethod: 'out',
                                cornerPoints: [new V2(0, 59), new V2(16, 48), new V2(29, 33)],
                                p0: new V2(0, 59), p1: new V2(20, 59),
                                triggerMovementStartIndex: 80, triggerMovementFramesCount: 300,
                                itemFramesCount: [60, 90],
                                startFrameIndex: [0, 200],
                                animation: animation,
                            }
                        ]

                        this.frames = animationHelpers.createDynamicMovementFrames({
                            framesCount: 300,
                            triggerData: triggerData,
                            img: this.parent.img,
                            size: this.size
                        });

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.wallAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     hlp.setFillColor('#FF0000').rect(50,50,50,50)
                        // })
                        let pixels = getPixels(this.parent.img, this.size);
                        let leafsCList = ['#6c6940', '#535335', '#393e2a', '#20281f', '#1c221d'] //, 
                        let randomSpread = [-1, 1]

                        let pd = [];
                        for (let i = 0; i < pixels.length; i++) {
                            let pixelData = pixels[i];
                            let pColorHex = colors.rgbToHex(pixelData.color);
                            if (leafsCList.indexOf(pColorHex) != -1) {
                                pd.push({
                                    color: pColorHex,
                                    point: pixelData.position.add(V2.random(randomSpread, randomSpread))
                                })
                            }
                        }

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 300, itemFrameslength: [40, 60], size: this.size,
                            pointsData: [
                                ...pd,
                                ...animationHelpers.extractPointData(PP.getLayerByName(model, 'wall_p'))
                            ], pdPredicate: () => getRandomInt(0, 1) == 0
                        }); //

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createDropsFrames({
                            framesCount: 300, itemFrameslength1Clamps: [10, 20], itemFrameslength2Clamps: [20, 20], size: this.size, opacityClamps: [0.1, 0.15],
                            startPositions: [
                                {
                                    data: [new V2(60,29), new V2(63,39), new V2(60,37), new V2(63,18), new V2(38,57), new V2(48,44), new V2(36,71), new V2(67, 29), new V2(73, 46), new V2(56, 40), new V2(58, 32), new V2(49, 30)],
                                    height: 50, tail: 1, useAll: true, colorPrefix: whiteColorPrefix, tail: 3
                                }
                            ], reduceOpacityOnFall: true, type: 'quad', method: 'in'
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 3)

        this.ground = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['ground', 'ground_d'] }),
            init() {
                this.groundSplashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let data = PP.getLayerByName(model, 'road_splash_zone').groups
                            .reduce((a, c) => {
                                let color = c.strokeColor;
                                a = [
                                    ...a,
                                    ...appSharedPP.fillByCornerPoints(c.points.map(gp => V2.objToV2(gp.point))).map(p => {
                                        return {
                                            color: color,
                                            point: p
                                        }
                                    })
                                ]

                                return a;
                            }, [])

                        //console.log(data)

                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 300, itemFrameslength: [10, 20], size: this.size,
                            pointsData: data,
                            pdPredicate: () => getRandomInt(0, 3) == 0
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.flow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createFlowFrames({framesCount, data, itemsCount, aClamps, len, itemFrameslengthClamps, size}) {
                        let frames = [];

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startIndex = getRandomInt(0, data.length-(len+1));
                            
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let p0 = data[startIndex];
                            let p1 = data[startIndex+len];

                            let points = appSharedPP.lineV2(p0, p1);
                            let pointIdexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});

                            let maxA = getRandom(aClamps[0], aClamps[1])
                            let aValues = [
                                ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    a: aValues[f] || 0,
                                    p: points[pointIdexValues[f]]
                                };
                            }
                        
                            return {
                                xShift: getRandomInt(-1,1),
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(whiteColorPrefix + itemData.frames[f].a + ')').dot(itemData.frames[f].p.x, itemData.frames[f].p.y) //+ itemData.xShift
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let flowPoints = appSharedPP.lineByCornerPoints(PP.getLayerByName(model,'flow_path').groups[0].points.map(p => V2.objToV2(p.point)));

                        this.frames = this.createFlowFrames({ framesCount: 300, data: flowPoints, itemsCount: 200, aClamps: [0.05, 0.1], len: 5, itemFrameslengthClamps: [30,40], size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.lamp_post = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(model, { renderOnly: ['g_left'] })

                this.rainLayerBehind = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ angleClamps: [0, 0], lengthClamps: [20, 25], xClamps: [-5, 50], upperYClamps: [-100, -30], lowerY: 150, aValue: 0.3, speedClapms: [6, 7], mask: mask, framesCount: 100, itemsCount: 300, size: this.size, useACurve: true })

                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['lamp_post'] }),
                }))
            }
        }), 7)

        // this.bush_left = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(model, { renderOnly: ['bush_left'] }),
        //     init() {
        //         //
        //     }
        // }), 9)

        this.telephone = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.leftBush = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bush_left'] }),
                    init() {
                        this.bushAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {

                                let pixels = getPixels(this.parent.img, this.size);
                                let leafsCList = ['#212e3b', '#1b262e', '#151d20', '#303626', '#1c221d', '#181c1a', '#20281f', '#3f442d'] //, 
                                let randomSpread = [-1, 1]

                                let pd = [];
                                for (let i = 0; i < pixels.length; i++) {
                                    let pixelData = pixels[i];
                                    let pColorHex = colors.rgbToHex(pixelData.color);
                                    if (leafsCList.indexOf(pColorHex) != -1) {
                                        pd.push({
                                            color: pColorHex,
                                            point: pixelData.position.add(V2.random(randomSpread, randomSpread))
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
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['telephone'] }),
                    init() {
                        this.cat = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            img: PP.createImage(model, { renderOnly: ['cat'] }),
                            init() {
                                this.animation = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size,
                                    init() {
                                        this.frames = PP.createImage(Shelter2Scene.models.catAnimation1);
                                        let frameIndexValues = [
                                            ...easing.fast({from: 0, to: this.frames.length-1, steps: 50, type: 'quad', method: 'inOut', round: 0}),
                                            //...new Array(10).fill(this.frames.length-1),
                                            ...easing.fast({from: this.frames.length-1, to: 0, steps: 50, type: 'quad', method: 'inOut', round: 0}),
                                            ...new Array(50).fill(0),
                                        ]

                                        this.currentFrame = 0;
                                        this.img = this.frames[frameIndexValues[this.currentFrame]];
                                        
                                        this.timer = this.regTimerDefault(10, () => {
                                        
                                            this.img = this.img = this.frames[frameIndexValues[this.currentFrame]];
                                            this.currentFrame++;
                                            if(this.currentFrame == frameIndexValues.length){
                                                this.currentFrame = 0;
                                            }
                                        })
                                    }
                                }))

                                this.animation2 = this.addChild(new GO({
                                    position: new V2(),
                                    size: this.size,
                                    init() {
                                        this.frames = PP.createImage(Shelter2Scene.models.catAnimation2);
                                        let frameIndexValues = [
                                            ...new Array(140).fill(0),
                                            ...easing.fast({from: 0, to: this.frames.length-1, steps: 30, type: 'quad', method: 'inOut', round: 0}),
                                            ...new Array(100).fill(this.frames.length-1),
                                            ...easing.fast({from: this.frames.length-1, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0}),
                                        ]

                                        this.currentFrame = 0;
                                        this.img = this.frames[frameIndexValues[this.currentFrame]];
                                        
                                        this.timer = this.regTimerDefault(10, () => {
                                        
                                            this.img = this.img = this.frames[frameIndexValues[this.currentFrame]];
                                            this.currentFrame++;
                                            if(this.currentFrame == frameIndexValues.length){
                                                this.currentFrame = 0;
                                            }
                                        })
                                    }
                                }))
                            }
                        }))

                        this.raindropsAnimations = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            createWindowFrames({framesCount, itemsCount, cornersData, itemFrameslengthClamps, size}) {
                                let frames = [];
                                
                                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                    let startFrameIndex = getRandomInt(0, framesCount-1);
                                    let totalFrames = getRandomInt(itemFrameslengthClamps);

                                    let {availableDots, lowerYPoints, aClamps, lenClamps} = cornersData[getRandomInt(0, cornersData.length-1)]
                                    let upperDot = availableDots[getRandomInt(0,availableDots.length-1)];
                                    let lowerY = lowerYPoints.find(p => p.x == upperDot.x).y;
                                    let len = getRandomInt(lenClamps);
                                    let a = getRandom(aClamps[0], aClamps[1])
                                    let aValues = easing.fast({from: a, to: 0, steps: totalFrames, type: 'quad', method: 'out', round: 2})

                                    let isMoving = false// getRandomInt(0,5) == 0;
                                    if(isMoving){
                                        len = 1;
                                    }

                                    let frames = [];
                                    for(let f = 0; f < totalFrames; f++){
                                        let frameIndex = f + startFrameIndex;
                                        if(frameIndex > (framesCount-1)){
                                            frameIndex-=framesCount;
                                        }
                                
                                        frames[frameIndex] = {
                                            a: aValues[f]
                                        };

                                        if(isMoving) {
                                            frames[frameIndex].pY = upperDot.y + 0.25*f;
                                        }
                                    }
                                
                                    return {
                                        p0: upperDot,
                                        len,
                                        lowerY,
                                        frames
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            if(itemData.frames[f]){
                                                let len = itemData.len;
                                                if(itemData.p0.y + itemData.len > itemData.lowerY){
                                                    len = itemData.lowerY - itemData.p0.y + 1;
                                                }

                                                let pY = itemData.p0.y;
                                                if(itemData.frames[f].pY != undefined){
                                                    pY = fast.r(itemData.frames[f].pY)
                                                }

                                                if(pY > itemData.lowerY)
                                                    continue;
                                                    
                                                hlp.setFillColor(whiteColorPrefix + itemData.frames[f].a +')').rect(itemData.p0.x, pY, 1, len)
                                            }
                                            
                                        }
                                    });
                                }
                                
                                return frames;
                            },
                            init() {

                                this.frames = this.createWindowFrames({
                                    framesCount: 300, itemsCount: 300, cornersData: [
                                        {
                                            availableDots: appSharedPP.fillByCornerPoints([new V2(81,99), new V2(81,61), new V2(108,58), new V2(108,99)]), 
                                            lowerYPoints: appSharedPP.lineV2(new V2(81,99), new V2(108,99)), 
                                            aClamps: [0.1, 0.3], 
                                            lenClamps: [1,3]
                                        },
                                        {
                                            availableDots: appSharedPP.fillByCornerPoints([new V2(118,58), new V2(128,62), new V2(128,98), new V2(118,99)]), 
                                            lowerYPoints: appSharedPP.lineV2(new V2(118,99), new V2(128,99)),  
                                            aClamps: [0.1, 0.3], 
                                            lenClamps: [1,3]
                                        },
                                        {
                                            availableDots: appSharedPP.fillByCornerPoints([new V2(81,107), new V2(108,108), new V2(108,151), new V2(81,147)]), 
                                            lowerYPoints: appSharedPP.lineV2(new V2(81,148), new V2(108,152)), 
                                            aClamps: [0.05, 0.1], 
                                            lenClamps: [1,3]
                                        },
                                        {
                                            availableDots: appSharedPP.fillByCornerPoints([new V2(118,108), new V2(128,108), new V2(128,144), new V2(118,150)]), 
                                            lowerYPoints: appSharedPP.lineV2(new V2(128,144), new V2(118,150)), 
                                            aClamps: [0.05, 0.1], 
                                            lenClamps: [1,3]
                                        }
                                    ],
                                    itemFrameslengthClamps: [40,80], size: this.size
                                 })

                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {

                                    }
                                });
                            }
                        }))
                        
                    }
                }))

                this.bushRight = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['bush_right'] }),
                    init() {
                        this.bushAnimation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {

                                let pixels = getPixels(this.parent.img, this.size);
                                let leafsCList = ['#212e3b', '#1b262e', '#151d20', '#303626', '#1c221d', '#181c1a', '#20281f', '#3f442d'] //, 
                                let randomSpread = [-1, 1]

                                let pd = [];
                                for (let i = 0; i < pixels.length; i++) {
                                    let pixelData = pixels[i];
                                    let pColorHex = colors.rgbToHex(pixelData.color);
                                    if (leafsCList.indexOf(pColorHex) != -1) {
                                        pd.push({
                                            color: pColorHex,
                                            point: pixelData.position.add(V2.random(randomSpread, randomSpread))
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
                }))

                this.leafs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let lNames = model.main.layers.filter(l => l.name.indexOf('leaf') != -1).map(l => l.name);
                        this.img = PP.createImage(model, { renderOnly: lNames })
                    }
                }))


                this.leafsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createLeafsFrames({ framesCount, data, itemFrameslengthClamps, size }) {
                        let frames = [];

                        let itemsData = data.map((d, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount - 1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);

                            let frames = [];
                            for (let f = 0; f < totalFrames; f++) {
                                let frameIndex = f + startFrameIndex;
                                if (frameIndex > (framesCount - 1)) {
                                    frameIndex -= framesCount;
                                }

                                frames[frameIndex] = true;
                            }

                            return {
                                img: d,
                                frames
                            }
                        })

                        for (let f = 0; f < framesCount; f++) {
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for (let p = 0; p < itemsData.length; p++) {
                                    let itemData = itemsData[p];

                                    //let y = 0;

                                    if (itemData.frames[f]) {
                                        ctx.drawImage(itemData.img, 0, 0)
                                    }

                                    //ctx.drawImage(itemData.img, 0, y)

                                }
                            });
                        }

                        return frames;
                    },
                    init() {
                        let data = Shelter2Scene.models.leafsAnimation.main.layers.sort((a, b) => a.order - b.order)
                            .map(l => PP.createImage(Shelter2Scene.models.leafsAnimation, { renderOnly: [l.name] }));

                        //this.img = data[0];
                        this.frames = this.createLeafsFrames({ framesCount: 300, data, itemFrameslengthClamps: [10, 15], size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                let rainMask = PP.createImage(model, { renderOnly: ['central_g'], forceVisibility: { "central_g": { visible: true } } })
                this.rain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createRainFrames({ angleClamps: [0, 0], lengthClamps: [25, 30], xClamps: [40, 180], upperYClamps: [-100, -30], lowerY: [170, 180], aValue: 0.2, speedClapms: [8, 9], mask: rainMask, framesCount: 100, itemsCount: 800, size: this.size, useACurve: true })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 11)

        // this.bush_right = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(model, { renderOnly: ['bush_right'] }),
        //     init() {
        //         //
        //     }
        // }), 13)
    }
}