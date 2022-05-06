class AridScene extends Scene {
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
                fileNamePrefix: 'aridPlaceTemple',
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
        this.blackBg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.setFillColor('#ffecd6').dot(0,0);
                })
        }), 1)

        let circleImages = {};
        let cColors = [ '#ffb873' ]

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

        let totalFrames = 180;

        this.sandClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let cloudsParams = [
                        
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: '#ffb873', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [5,10], sizeClamps: [10,13], 
                            //sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(60,87), p2: new V2(100, 70)
                            }, yShiftClamps: [-3,-6],
                    },   
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: '#ffb873', size: this.size,
                            directionAngleClamps: [40, 70], distanceClamps: [8,15], sizeClamps: [14,18], 
                            //sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(95,70), p2: new V2(130, 30)
                            }, yShiftClamps: [-3,-6],
                    }, 
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 50, itemFrameslength: totalFrames, color: '#ffb873', size: this.size,
                            directionAngleClamps: [-40, -70], distanceClamps: [8,15], sizeClamps: [10,14], 
                            //sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(40,100), p2: new V2(-10, 65)
                            }, yShiftClamps: [-3,-6],
                    },                 
                ]

                let itemsFrames = cloudsParams.map(p => {
                    return {
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f = 0; f < totalFrames; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 3)


        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(AridScene.models.main, { renderOnly: ['bg'] })
        }), 5)

        this.statue = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(AridScene.models.main, { renderOnly: ['statue'] })
        }), 10)

        this.sandFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSandFallFrames({framesCount, p0, p0xShiftClamps, fallLengthClamps, ttlClamps, itemsCount,speedYChangeClamps, speedXChangeClamps, itemFrameslength, size}) {
                let frames = [];

                // let p0 = new V2(82, 50);
                // let fallLengthClamps = [40, 50];
                // let ttlClamps = [70, 100];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    //let totalFrames = itemFrameslength;
                
                    let ttl = getRandomInt(ttlClamps);
                    let fallLength = getRandomInt(fallLengthClamps);
                    let currentP = p0.clone();

                    if(p0xShiftClamps) {
                        currentP.x+=getRandomInt(p0xShiftClamps)//getRandomInt(-1,1)
                    }
                    
                    let speed = new V2(0,getRandom(0, 0))
                    let speedYChange = getRandom(speedYChangeClamps[0], speedYChangeClamps[1]) //getRandom(0.01, 0.035)/2
                    let speedXChange = getRandom(speedXChangeClamps[0], speedXChangeClamps[1])//getRandom(0.02, 0.04)

                    let frames = [];
                    for(let f = 0; f < ttl; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: currentP.clone()
                        };

                        currentP = currentP.add(speed);
                        speed.y += speedYChange;

                        if(f > fallLength) {
                            speed.x += speedXChange;    
                        }
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
                                let c = '#ffb873'
                                if(itemData.frames[f].p.y > 77) {
                                    c = '#cb765c'
                                }
                                hlp.setFillColor(c).dot(itemData.frames[f].p.toInt())
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let data = [{ framesCount: totalFrames, itemsCount: 40, 
                    p0: new V2(82, 50), p0xShiftClamps: [-1, 1], fallLengthClamps: [40, 50], ttlClamps: [70, 100],
                    speedYChangeClamps: [0.01/2, 0.035/2], speedXChangeClamps: [0.02, 0.04],
                    size: this.size },
                    // { framesCount: totalFrames, itemsCount: 20, 
                    //     p0: new V2(25, 83), p0xShiftClamps: [0, 1], fallLengthClamps: [60, 70], ttlClamps: [80, 90],
                    //     speedYChangeClamps: [0.01/3, 0.035/3], speedXChangeClamps: [0, 0],
                    //     size: this.size },
                    // { framesCount: totalFrames, itemsCount: 10, 
                    //     p0: new V2(82, 87), p0xShiftClamps: [0, 1], fallLengthClamps: [40, 50], ttlClamps: [80, 90],
                    //     speedYChangeClamps: [0.01/3, 0.035/3], speedXChangeClamps: [0, 0],
                    //     size: this.size }
                ]

                this.falls = data.map(d => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createSandFallFrames(d),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))

                //this.frames = this.createSandFallFrames()
//                this.registerFramesDefaultTimer({});
            }
        }), 12)

        this.p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(AridScene.models.main.main.layers.find(l => l.name == 'p'))
                this.frames = animationHelpers.createMovementFrames({
                    framesCount: totalFrames, itemFrameslength: [80,100], pointsData: pd, size: this.size 
                });

                this.registerFramesDefaultTimer({});
            }
        }), 14)

        this.snowflakes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createPFrames({framesCount, itemsCount, visibleFramesClamps, itemFramesLength, size, upperYShiftClamps, angleClamps, color, xClamp}) {
                let frames = [];
                let _colors = ['#ffb873','#cb765c']
                let leftLine = createLine(new V2(-size.x/2, -size.y*2), new V2(-size.x/2, size.y*2));
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
    
                    let initialPoint = new V2(getRandomInt(xClamp[0], xClamp[1]), getRandomInt(upperYShiftClamps[0], upperYShiftClamps[1]));
                    let direction = V2.up.rotate(getRandomInt(angleClamps[0], angleClamps[1]));

                    let visibleSteps = getRandomInt(visibleFramesClamps);
                    let vTof = easing.fast({ from: 0, to: visibleSteps, steps: itemFramesLength, type: 'linear', round: 0 });
                  
                    let frames = [];
                    for(let f = 0; f < itemFramesLength; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let x = vTof[f];
                        frames[frameIndex] = {
                            point: initialPoint.add(direction.mul(x)).toInt()
                        };
                    }
    
                
                
                    return {
                        color: _colors[getRandomInt(0, _colors.length-1)],
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                // let oValue = itemData.frames[f].oValue;
                                // if(oValue == undefined)
                                //     oValue = 0;
        
                                // if(oValue == 1){
                                    
                                // }
                                hlp.setFillColor(itemData.color).dot(itemData.frames[f].point)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createPFrames({ framesCount: totalFrames, itemsCount: 20, visibleFramesClamps: [150,180], itemFramesLength: 40, size: this.size, 
                    upperYShiftClamps: [-100, this.size.y], angleClamps: [90,120], xClamp: [ -10, 0 ]  })

                this.registerFramesDefaultTimer({});
            }
        }), 16)
    }
}