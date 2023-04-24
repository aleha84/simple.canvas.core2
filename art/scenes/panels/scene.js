class PanelsScene extends Scene {
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
                size: new V2(150,150).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'panels',
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

        let circleImages = {};

        let cColors = [
            '#313E6A',
            '#243161',
            '#1e2b5d'
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(PanelsScene.models.main, { renderOnly: ['bg'] })
            }
        }), 1)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarsFrames({framesCount, itemsCount, yClamps, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let maxAValues = easing.fast({from: 0.3, to: 0.05, steps: yClamps[1] - yClamps[0], type: 'linear', round: 2})

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);

                    let blink = getRandomBool();

                    let totalFrames = blink ? getRandomInt(itemFrameslengthClamps) : framesCount;
                    let p = new V2(getRandomInt(0, size.x), getRandomInt(yClamps));
                    let maxA = maxAValues[p.y] + getRandom(0, maxAValues[p.y]*2);  //fast.r(getRandom(0.1, 0.5), 2);
                    if(!maxA) {
                        maxA = 0;
                    }

                    let frames = [];

                    if(blink) {
                        let aValues =  [
                            ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                            ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                        ]

                        let stepsValues = [];
                        if(getRandomInt(0, 4) == 0) {
                            stepsValues = [
                                ...easing.fast({from: 0, to: 1, steps: fast.r(totalFrames/2), type: 'linear', round: 0 }),
                                ...easing.fast({from: 1, to: 0, steps: fast.r(totalFrames/2), type: 'linear', round: 0 })
                            ]
                        }

                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }

                            let a = aValues[f];
                            if(a == undefined) {
                                a = 0;
                            }

                            let step = stepsValues[f];
                            if(step == undefined) {
                                step = 0;
                            }

                            frames[frameIndex] = {
                                a,
                                step
                            };
                        }
                    }

                    return {
                        p,
                        blink,
                        maxA,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(!itemData.blink) {
                                hlp.setFillColor('rgba(255,255,255,' + itemData.maxA + ')').dot(itemData.p)
                            }
                            else {
                                if(itemData.frames[f]){
                                    hlp.setFillColor('rgba(255,255,255,' + itemData.frames[f].a + ')').dot(itemData.p)
                                    // if(itemData.frames[f].step == 0) {
                                        
                                    // }
                                    //if(itemData.frames[f].step) {
                                        if(itemData.frames[f].step == 1) {
                                            hlp.dot(itemData.p).dot(itemData.p.x -1,itemData.p.y).dot(itemData.p.x + 1, itemData.p.y)
                                                .dot(itemData.p.x, itemData.p.y+1).dot(itemData.p.x, itemData.p.y-1)
                                        }
                                        if(itemData.frames[f].step == 2) {
                                            hlp.rect(itemData.p.x -2,itemData.p.y, 2, 1).rect(itemData.p.x + 1, itemData.p.y, 2, 1)
                                                .rect(itemData.p.x, itemData.p.y+1, 1, 2).rect(itemData.p.x, itemData.p.y-2, 1, 2)
                                        }
                                    //}
                                }
                            }
                            
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({ framesCount: 180, itemsCount: 200, yClamps: [0, 80], itemFrameslengthClamps: [80, 160], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), 2)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(PanelsScene.models.main, { renderOnly: ['body', 'windows', 'words', 'antennas', 'band_name'] })

                this.antennasAnimations = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createAntennasFrames({framesCount, itemFrameslength, size}) {
                        let frames = [];
                        
                        let points = [new V2(38,59), new V2(64,62), new V2(102,62), new V2(119,59)]
                        let itemsCount = points.length;

                        let stepsValues = [
                            ...easing.fast({from: 0, to: 3, steps: itemFrameslength/2, type: 'linear', round: 0 }),
                            ...easing.fast({from: 3, to: 0, steps: itemFrameslength/2, type: 'linear', round: 0 })
                        ]

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1); //fast.r(framesCount/itemsCount * i)
                            let totalFrames = itemFrameslength;

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    step: stepsValues[f]
                                };
                            }
                        
                            return {
                                p: points[i],
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        switch(itemData.frames[f].step) {
                                            case 1: {
                                                hlp.setFillColor('#622a48').dot(itemData.p);
                                                break;
                                            }
                                            case 2: {
                                                hlp.setFillColor('#C44565').dot(itemData.p);
                                                break;
                                            }
                                            case 3: {
                                                hlp.setFillColor('#622a48').rect(itemData.p.x-1, itemData.p.y, 3, 1).rect(itemData.p.x, itemData.p.y-1, 1, 3);
                                                hlp.setFillColor('#C44565').dot(itemData.p);
                                                break;
                                            }
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createAntennasFrames({framesCount: 180, itemFrameslength: 40, size: this.size});
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.w_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 360, itemFrameslength: 90, size: this.size, 
                            pointsData: animationHelpers.extractPointData(PanelsScene.models.main.main.layers.find(l => l.name == 'w_p')),
                            pdPredicate: () => getRandomBool()
                        });


                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.windows = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createWindowsFrames({framesCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
                        let windows = PanelsScene.models.main.main.layers.filter(l => l.name.startsWith('w_')).map(l => PP.createImage(PanelsScene.models.main, { renderOnly: [ l.name ] }));

                        let itemsData = windows.map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
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
                                img: el,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f] && itemData.frames[f].visible){
                                        ctx.drawImage(itemData.img, 0, 0);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createWindowsFrames({ framesCount: 360, itemFrameslengthClamps: [80, 120], size: this.size })
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.shadow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 0.35;
                        ctx.drawImage(PP.createImage(PanelsScene.models.main, { renderOnly: [ 'shadow' ]}), 0, 0)
                    })
                }))
            }
        }), 10)

        this.frontalClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createCloudsFrames({
                    framesCount: 180, itemsCount: 100, itemFrameslength: 180, color: '#313E6A', size: this.size,
                                directionAngleClamps: [-90, -120], distanceClamps: [-6,-10], sizeClamps: [12,16], 
                                
                                initialProps: {
                                    line: true, p1: new V2(170, 145), p2: new V2(-20, 145)
                                }, yShiftClamps: [0,2]
                    , circleImages})

                this.registerFramesDefaultTimer({});
            }
        }), 15)

        this.backClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createCloudsFrames({
                            framesCount: 180, itemsCount: 100, itemFrameslength: 180, color: '#1e2b5d', size: this.size,
                                        directionAngleClamps: [-90, -120], distanceClamps: [-2,-4], sizeClamps: [10,13], 
                                        
                                        initialProps: {
                                            line: true, p1: new V2(170, 130), p2: new V2(-20, 130)
                                        }, yShiftClamps: [0,2]
                            , circleImages})
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createCloudsFrames({
                            framesCount: 180, itemsCount: 100, itemFrameslength: 180, color: '#243161', size: this.size,
                                        directionAngleClamps: [-90, -120], distanceClamps: [-4,-6], sizeClamps: [12,16], 
                                        
                                        initialProps: {
                                            line: true, p1: new V2(170, 137), p2: new V2(-20, 137)
                                        }, yShiftClamps: [0,2]
                            , circleImages})
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)
    }
}