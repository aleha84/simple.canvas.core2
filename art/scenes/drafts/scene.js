class DraftsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(900,900),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'sword',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)

        this.sword = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -10)),
            size: new V2(50,100),
            //img: PP.createImage(DraftsScene.models.sword, { render }),
            init() {

                let mainImg = PP.createImage(DraftsScene.models.sword, { renderOnly: ['main'] })
                let frameImg = PP.createImage(DraftsScene.models.sword, { renderOnly: ['frame'] })
                let totalFrames = 120;

                let alphaValue = [
                    ...easing.fast({from: 0.5, to: 0.2, steps: totalFrames/4, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: 0.2, to: 0.5, steps: totalFrames/4, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: 0.5, to: 0.2, steps: totalFrames/4, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: 0.2, to: 0.5, steps: totalFrames/4, type: 'quad', method: 'inOut', round: 1})
                ]

                let totalYFrames = 60;
                let maxY = 60;
                let currentYFrame = 0;
                let yValues = easing.fast({from: 0, to: maxY, steps: totalYFrames, type: 'quad', method: 'in', round: 0 });

                let itemsData = new Array(40).fill().map(el => {
                    let startFrameIndex = getRandomInt(0, totalFrames-1);
                    let x = getRandomBool() ? 24 : 25;
                    let frames = [];
                    for(let f = 0; f < totalYFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (totalFrames-1)){
                            frameIndex-=totalFrames;
                        }
                
                        frames[frameIndex] = {
                            p: new V2(x, 35 + yValues[f])
                        };
                    }

                    return {
                        frames
                    }
                })

                let frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {


                        ctx.drawImage(mainImg, 0, 0);

                        // hlp.setFillColor('#cbe8f0').rect(24,35, 1, yValues[currentYFrame])
                        // hlp.setFillColor('#cbe8f0').rect(25,36, 1, yValues[currentYFrame])

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let p = itemData.frames[f].p;
                                hlp.setFillColor('#cbe8f0').dot(p)
                            }
                            
                        }

                        currentYFrame++;
                        if(currentYFrame == totalYFrames) {
                            currentYFrame = 0;
                        }

                        ctx.globalAlpha = alphaValue[f];
                        ctx.drawImage(frameImg, 0, 0);
                    })
                }

                this.currentFrame = 0;
                let yChangeValues = [
                    ...easing.fast({from: 0, to: -5, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: -5, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                ]
                
                this.img = frames[this.currentFrame];

                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.img = frames[this.currentFrame];
                    let yChange = yChangeValues[this.currentFrame];
                    this.position.y = this.parentScene.sceneCenter.y - 10 + yChange;
                    this.needRecalcRenderProperties = true;
                })
            }
        }), 10)

        this.lightnings = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let startPoints = []

                createCanvas(V2.one, (ctx, size, hlp) => {
                    let pp = new PP({ctx});

                    startPoints = pp.fillByCornerPoints([new V2(72,77), new V2(74,110), new V2(77,74)]);
                })

                let pairs = {};

                let animationColors = {
                    main: '#8BE4EC',
                    darker: '#8BE4EC',
                    brighter: '#F0FAFC'
                }
                  
                this.frames = animationHelpers.createLightningFrames({ 
                    framesCount: 240, itemsCount: 10, 
                    size: this.size,
                    colors: animationColors,
                    stepFramesLength: 2,
                    highlightParams: {
                        showTarget: false,
                        showStart: false,
                    },
                    pathParams: {
                        mainMidPointShiftClamps: [3,6],
                        resultMidPointXShiftClamps: [-3,3],
                        resultMidPointYShiftClamps: [-3, 3],
                        innerDotsCountClamp: [3,5],
                        startProvider: () => { 
                            let start = startPoints[getRandomInt(0, startPoints.length-1)];
                            return new V2(start);
                            //return new V2(80,65) 
                        },
                        targetProvider: (start) => { 
                              let target = new V2(getRandomInt(20, 130) , 150)

                              return new V2(target);
                            // return new V2(109,71) 
                        }
                    }
                });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 11)

        let circleImages = {};
        let cColors = ['#1E3952', '#171F31', '#7091A3', '#486C89']
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 30; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        this.backClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createCloudsFrames({
                    framesCount: 120, itemsCount: 60, itemFrameslength: 120, color: '#7091A3', size: this.size,
                    directionAngleClamps: [60, 90], distanceClamps: [6,10], sizeClamps: [10,20], 
                    initialProps: {
                        line: true, p1: new V2(-20, 90), p2: new V2(140, 120)
                    }, yShiftClamps: [-1,-6], circleImages
                });

                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.backClouds2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createCloudsFrames({
                    framesCount: 120, itemsCount: 60, itemFrameslength: 120, color: '#486C89', size: this.size,
                    directionAngleClamps: [60, 90], distanceClamps: [6,10], sizeClamps: [10,20], 
                    initialProps: {
                        line: true, p1: new V2(-20, 110), p2: new V2(140, 150)
                    }, yShiftClamps: [-1,-6], circleImages
                });

                this.registerFramesDefaultTimer({});
            }
        }), 6)


        this.frontalClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createCloudsFrames({
                    framesCount: 120, itemsCount: 60, itemFrameslength: 120, color: '#1E3952', size: this.size,
                    directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [10,20], 
                    initialProps: {
                        line: true, p1: new V2(160, 105), p2: new V2(-10, 145)
                    }, yShiftClamps: [-1,-6], circleImages
                });

                this.registerFramesDefaultTimer({});
            }
        }), 20)

        this.frontalClouds2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createCloudsFrames({
                    framesCount: 120, itemsCount: 60, itemFrameslength: 120, color: '#171F31', size: this.size,
                    directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [10,20], 
                    initialProps: {
                        line: true, p1: new V2(160, 120), p2: new V2(30, 160)
                    }, yShiftClamps: [-1,-6], circleImages
                });

                this.registerFramesDefaultTimer({});
            }
        }), 25)
    }
}