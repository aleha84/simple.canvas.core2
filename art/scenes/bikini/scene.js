class BikiniScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,133).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'bikini',
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
        let model = BikiniScene.models.main;
        let totalFrames = 300;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                //
            }
        }), 1)

        this.far = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['far2'] }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let _colors = ['#8dab30', '#b1c92e', '#698c31', '#466433', '#2c3b23'];

                        this.frames = animationHelpers.createMovementRotFrames({ framesCount: totalFrames, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far2'))
                            , itemFrameslength: 120, size: this.size,
                            pdPredicate: function(el, index) {
                                // console.log(arguments)
                                if(_colors.indexOf(el.color) == -1)
                                    return false;

                                return getRandomInt(0,2) == 0}
                         })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.seaAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSeaFrames({framesCount, itemsCount, itemFrameslength, size, xClamps, yClamps, aClapms, xShiftClamps}) {
                        let frames = [];
                        let height = yClamps[1] - yClamps[0];

                        let aValuesByY = easing.fast({ from: aClapms[0], to: aClapms[1], steps: height, type: 'linear', round: 2});
                        let xShiftValuesByY = easing.fast({ from: xShiftClamps[0], to: xShiftClamps[1], steps: height, type: 'quad', method: 'in'})
                        let isDarkAngleByY = easing.fast({ from: 90, to: 80, steps: height, type: 'linear', round: 0});

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let x = getRandomInt(xClamps);
                            let y = getRandomInt(yClamps);
        
                            let maxA = aValuesByY[y - yClamps[0]]
                            let xShift = xShiftValuesByY[y - yClamps[0]];
                            let isDark = getRandomInt(0,5) == 0;
                            if(isDark) {
                                isDark = {
                                    len: fast.r(xShift*2),
                                    angle: isDarkAngleByY[y - yClamps[0]]
                                }
                                totalFrames*=2;
                                maxA*=0.5;
                            }
        
                            if(getRandomInt(0,9) == 0) {
                                maxA*= getRandomInt(2,3);
                                isDark = false;
                                totalFrames = getRandomInt(20, 40);
                                xShift = 0;
                            }
        
                            let aValues = [
                                ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]
        
                            let xShiftValues = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear' });
        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    a: aValues[f],
                                };
                            }
                        
                            return {
                                x,y,
                                isDark,
                                frames
                            }
                        })

                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
        
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
        
                                        if(itemData.isDark) {
                                            pp.setFillStyle(`rgba(0,0,0, ${itemData.frames[f].a})`)
                                            let p1 = new V2(itemData.x + itemData.frames[f].xShift, itemData.y);
                                            if(!p1.x)
                                                continue;
        
                                            let p2 = p1.add(V2.up.rotate(itemData.isDark.angle).mul(itemData.isDark.len)).toInt()
                                            pp.lineV2(p1,p2)
                                        }
                                        else {
                                            hlp.setFillColor(
                                                itemData.isDark 
                                                    ? `rgba(0,0,0, ${itemData.frames[f].a})`
                                                    : `rgba(255,255,255, ${itemData.frames[f].a})`
                                            ).dot(itemData.x + itemData.frames[f].xShift, itemData.y)
                                        }
        
                                        
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let seaZone = PP.createImage(model, { renderOnly: ['sea_zone'], forceVisibility: { sea_zone: {visible: true} } })
                        this.frames = this.createSeaFrames({ framesCount: totalFrames, itemsCount: 2000, itemFrameslength: 100, size: this.size,
                        yClamps: [86, 104], aClapms: [0.05, 0.2], xShiftClamps: [2,5], xClamps: [135,200] })
                        .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(f, 0, 0);
                            ctx.globalCompositeOperation = 'destination-in';
                            ctx.drawImage(seaZone, 0, 0);
                        }))

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => { 
                                this.parent.parentScene.capturing.stop = true; 
                            }
                        });
                    }
                }))
            }
        }), 10)

        let createTreesMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size, 
            type = 'quad', method = 'inOut',
            oneWayOnly =false}) {
            let frames = [];
            let images = [];

            let itemsCount = animationsModel.main[0].layers.length;

            let framesIndiciesChange = oneWayOnly ? 
            easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength, type: 'quad', method: 'inOut', round: 0 })
            : [
                ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type, method, round: 0 }),
                ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type, method, round: 0 })
            ]

            for(let i = 0; i < itemsCount; i++) {
                let name = animationsModel.main[0].layers[i].name;
                if(!name) {
                    name = animationsModel.main[0].layers[i].id
                } 

                images[i] = PP.createImage(animationsModel, { renderOnly: [name] }) //'l' + (i+1)
            }
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = startFramesSequence ? 
                startFramesSequence[i]
                : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                
                let totalFrames = itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: framesIndiciesChange[f]
                    };
                }

                if(additional) {
                    let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
                    for(let f = 0; f < additional.frameslength; f++){
                        let frameIndex = f + startFrameIndex1;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            index: additional.framesIndiciesChange[f]
                        };
                    }
                }
                
            
                return {
                    img: images[i],
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            ctx.drawImage(itemData.img[index], 0, 0);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.palms = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['palms'] }),
            createPalmsFrames({framesCount, data, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let xToFrameValues = easing.fast({from: 0, to: framesCount, steps: size.x, type: 'linear', round: 0});
                let _colors = ['#a19ca3', '#7e7a7f'];

                let itemsData = data.map((el, i) => {
                    let startFrameIndex = xToFrameValues[el.point.x] + getRandomInt(-5,5);  //getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                

                    let frames = [];
                    if(getRandomInt(0,3) == 0 && _colors.indexOf(el.color.toLowerCase()) == -1) {
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                xShift: 1
                            };
                        }
                    }
                    
                    return {
                        data: el,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.data.color).dot(itemData.data.point.x + itemData.frames[f].xShift, itemData.data.point.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.leafs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: totalFrames/2, startFramesClamps: [30, 80], itemFrameslength: 80, 
                            additional: {
                                framesShift: 30,
                                frameslength: 30,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 1, steps: 30, type: 'linear', round: 0 }),
                                    ...easing.fast({from: 1, to: 0, steps: 30, type: 'linear', round: 0 })
                                ]
                            },
                            animationsModel: BikiniScene.models.palmsFrames,
                            size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 20)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['road'] }),
            init() {
                // this.passingShadow =this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let _p1 = new V2(166,132);
                //         let _p2 = new V2(199,125);
                //         let dir = _p1.direction(_p2);

                //         let p1 = _p1.add(dir.mul(-250)).toInt();
                //         let p2 = _p1.add(dir.mul(250)).toInt();

                //         let path = PP.createNonDrawingInstance().lineV2(p1, p2).map(p => new V2(p));

                //         let pathIndexChange = easing.fast({ from: 0, to: path.length-1, steps: totalFrames, type: 'linear', round: 0 });
                //         this.frames = [];

                //         for(let f = 0; f < totalFrames; f++) {
                //             this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 let pp = new PP({ctx});
                //                 pp.setFillStyle('#a59d90');

                //                 let p0 = path[pathIndexChange[f]];
                //                 let i1 = pathIndexChange[f] - 50;
                //                 if(i1 < 0) i1 = 0;
                //                 let p1 = path[i1];
                //                 let p2 = p1.add(V2.right.rotate(10).mul(40)).toInt()
                //                 let p3 = p0.add(V2.right.rotate(10).mul(40)).toInt()

                //                 pp.fillByCornerPoints([p0, p1, p2, p3]);
                //             })
                //         }

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 30)

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['car'] }),
            init() {

                this.signal_lights = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.lightsImg = PP.createImage(model, { renderOnly: ['car_signal_light'] });
        
                        this.currentFrame = 0;
                        let totalFrames = 50;
                        let state = false;
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                                state = !state;
                                
                                this.img = state ? this.lightsImg : undefined;
                            }
                        })
                    }
                }))

                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDropsFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
                        let targetY = 126

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let x = getRandomInt(40, 65);
                            let y = 111;

                            let yValues = easing.fast({from: y, to: targetY + getRandomInt(-1,1), steps: totalFrames, type: 'linear', round: 0});

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    y: yValues[f]
                                };
                            }
                        
                            return {
                                x,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor('#363536').rect(itemData.x, itemData.frames[f].y, 1, 2)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createDropsFrames({ framesCount: 100, itemsCount: 10, itemFrameslengthClamps: [5,8], size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.сlouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
    
                        let exludeZone = PP.createImage(model, { renderOnly: ['car_clouds_exclude'], forceVisibility: { car_clouds_exclude: { visible: true } } })

                        let circleImages = {};
                        let cColors = [
                            '#989da6','#fbfbf9','#67696e'
                            ]
                        
                        for(let c = 0; c < cColors.length; c++){
                            circleImages[cColors[c]] = []
                            for(let s = 1; s < 20; s++){
                                if(s > 8)
                                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                                    })
                                else {
                                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                                }
                            }
                        }

                        let cloudsParams = [
                           
                            {
                                opacity: 1,
                                framesCount: totalFrames, itemsCount: 150, itemFrameslength: totalFrames, color: '#67696e', size: this.size,
                                    directionAngleClamps: [40, 20], distanceClamps: [5,10], sizeClamps: [5,8], 
                                    sec: {color: '#989da6', sDecrClamps: [1,2], yShiftClamps: [0,1], xShiftClamps: [-3,-1]},
                                    initialProps: {
                                        line: true, p1: new V2(45,80), p2: new V2(85, -20)
                                    }, xShiftClamps: [2,4],
                            },

                            {
                                opacity: 1,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#989da6', size: this.size,
                                    directionAngleClamps: [40, 20], distanceClamps: [5,10], sizeClamps: [5,8], 
                                    //sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                                    initialProps: {
                                        line: true, p1: new V2(35,80), p2: new V2(80, -20)
                                    }, xShiftClamps: [2,4],
                            },

                            {
                                opacity: 1,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#fbfbf9', size: this.size,
                                    directionAngleClamps: [-40, -20], distanceClamps: [5,10], sizeClamps: [5,8], 
                                    sec: {color: '#989da6', sDecrClamps: [0,-1], yShiftClamps: [0,1], xShiftClamps: [0,2]},
                                    initialProps: {
                                        line: true, p1: new V2(40,80), p2: new V2(60, -20)
                                    }, xShiftClamps: [-2,-4],
                            },  

                            {
                                opacity: 1,
                                framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#fbfbf9', size: this.size,
                                    directionAngleClamps: [-40, -20], distanceClamps: [5,10], sizeClamps: [3,5], 
                                    sec: {color: '#989da6', sDecrClamps: [0,-1], yShiftClamps: [0,1], xShiftClamps: [0,2]},
                                    initialProps: {
                                        line: true, p1: new V2(60,40), p2: new V2(80, -20)
                                    }, xShiftClamps: [-2,-4],
                            },  

                            // {
                            //     opacity: 1,
                            //     framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: '#67696e', size: this.size,
                            //         directionAngleClamps: [-40, -20], distanceClamps: [5,10], sizeClamps: [3,5], 
                            //         sec: {color: '#989da6', sDecrClamps: [0,-1], yShiftClamps: [0,1], xShiftClamps: [0,-2]},
                            //         initialProps: {
                            //             line: true, p1: new V2(65,40), p2: new V2(85, -20)
                            //         }, xShiftClamps: [-2,-4],
                            // },  

                              
                        ]
    
                        let itemsFrames = cloudsParams.map(p => {
                            return {
                                opacity: p.opacity,
                                frames: animationHelpers.createCloudsFrames({...p, circleImages})
                            }
                        })
    
                        this.frames = [];
                        for(let f =0; f < totalFrames; f++){
                            this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 1;
                                for(let i = 0; i < itemsFrames.length; i++){
                                    ctx.globalAlpha = itemsFrames[i].opacity;
                                    ctx.drawImage(itemsFrames[i].frames[f],0,0);
                                }
    
                                // ctx.globalAlpha = 1;
    
                                ctx.globalCompositeOperation = 'destination-out';
                                ctx.drawImage(exludeZone, 0,0);
                            })
                        }
    
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 40)

        this.girl = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['girl'] }),
            init() {

                this.leg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let legFrames = PP.createImage(BikiniScene.models.legFrames)
                        
                        this.frames = [
                            ...new Array(100).fill(0),
                            ...easing.fast({from: 0, to: legFrames.length-1, steps: 25, type: 'linear', round: 0 }),
                            ...new Array(150).fill(legFrames.length-1),
                            ...easing.fast({from: legFrames.length-1, to: 0, steps: 25, type: 'linear', round: 0 }),
                        ].map(fi => legFrames[fi])

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.hand = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(BikiniScene.models.handFrames)

                        let framesIndicesValues = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: 25, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: 25, type: 'quad', method: 'inOut', round: 0})
                        ]

                        let repeatCount = 4;
                        let delayCount = 2;
                        let isDelay = false;

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndicesValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == framesIndicesValues.length){
                                this.currentFrame = 0;
                                if(isDelay) {
                                    console.log('delayCount: ' + delayCount);
                                    delayCount--;
                                    if(delayCount == 0) {
                                        isDelay = false;
                                        delayCount = 2;
                                    }
                                }
                                else {
                                    console.log('repeatCount: ' + repeatCount);
                                    repeatCount--;
                                    if(repeatCount == 0) {
                                        repeatCount = 4;
                                        isDelay = true;
                                    }
                                }
                            }

                            if(!isDelay)
                            this.img = this.frames[framesIndicesValues[this.currentFrame]];
                        })
                    }
                }))

                this.hairs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createTreesMovementFrames({ framesCount: 300, startFramesClamps: [30, 80], itemFrameslength: 180, oneWayOnly: true,
                            type: 'linear', method: 'base',
                            additional: {
                                framesShift: 20,
                                frameslength: 60,
                                framesIndiciesChange: [
                                    ...easing.fast({from: 0, to: 3, steps: 30, type: 'linear', round: 0 }),
                                    ...easing.fast({from: 3, to: 0, steps: 30, type: 'linear', round: 0 })
                                ]
                            },
                            animationsModel: BikiniScene.models.hairsFrames,
                            size: this.size })

                        this.registerFramesDefaultTimer({});

                        // this.frames = PP.createImage(BikiniScene.models.hairsFrames)
                        // this.registerFramesDefaultTimer({});
                    }
                }))

                // this.blink = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let blinkImg = PP.createImage(model, { renderOnly: ['blink'] })

                //         this.frames = [
                //             ...new Array(100).fill(undefined),
                //             ...new Array(10).fill(blinkImg),
                //             ...new Array(10).fill(blinkImg),
                //             ...new Array(180).fill(undefined),
                //         ]

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
            }
        }), 50)
    }
}