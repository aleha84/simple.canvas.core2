class GirlWithARifleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'girl_with_the_rifle'
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
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['bg'] }),
        }), 0)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(184,200),
            baseImg: PP.createImage(GirlWithARifleScene.models.clouds, { renderOnly: ['m_0'] }),
            createCloudsFrames({framesCount, size}) {
                let frames = [];
                let particleframes = animationHelpers.createMovementFrames({ framesCount, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(GirlWithARifleScene.models.clouds.main.layers.find(l => l.name == 'p')) });

                let direction = -1
                let xValues = easing.fast({from: 0, to: -size.x, steps: framesCount, type: 'linear', round: 0});
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let x = xValues[f];
                        ctx.drawImage(this.baseImg, x, 0);
                        ctx.drawImage(particleframes[f], x, 0);
                        ctx.drawImage(this.baseImg, direction > 0 ? x-size.x: size.x+x, 0)
                        ctx.drawImage(particleframes[f], direction > 0 ? x-size.x: size.x+x, 0)

                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createCloudsFrames({ framesCount: 600, size: this.size })
                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });

                this.flyingLeafs = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createLeafsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let sharedPP;
                        createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            sharedPP = new PP({ctx});
                        })

                        let images = 
                        GirlWithARifleScene.models.leafs.main.layers.map(layer => {
                            layer.visible = true;

                            return PP.createImage(GirlWithARifleScene.models.leafs, {
                                renderOnly: [layer.id],
                                colorsSubstitutions: {
                                    "#FF0000": { color: '#b7bb9e', changeFillColor: true }
                                }
                            })
                        });

                        //#7B9477
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength[0], itemFrameslength[1]);
                            let image = images[getRandomInt(0, images.length-1)];

                            let p1 = new V2(size.x+5, getRandomInt(size.y*1/3, size.y*3/3)).toInt();
                            let points = sharedPP.lineV2(p1, new V2(-5, p1.y-getRandomInt(10, size.y/4)));
                            let indexValues = easing.fast({ from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0 })

                            let a = getRandomInt(30,50);
                            let b = getRandomInt(10,20);
                            let c = getRandomInt(0,20);

                            let yShiftFun = (x) => Math.sin((x-c)/a)*b;

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                let p = points[indexValues[f]];

                                frames[frameIndex] = {
                                    yShift: yShiftFun(p.x),
                                    p
                                };
                            }
                        
                            return {
                                image,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        //hlp.setFillColor('#7B9477').rect(itemData.frames[f].p.x, itemData.frames[f].p.y, 2,2)
                                        ctx.drawImage(itemData.image, itemData.frames[f].p.x, itemData.frames[f].p.y + itemData.frames[f].yShift);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createLeafsFrames({ framesCount: 200, itemsCount: 15, itemFrameslength: [50, 70], size: this.size   })
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), 10)

        this.grass = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['grass'] }),
            init() {
                this.particlesEffect = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 100, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(GirlWithARifleScene.models.main.main.layers.find(l => l.name == 'grass_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 20)

        this.rifle = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.handRifleAnimation, { renderOnly: ['rifle'] }),
            init() {
            }
        }), 32)

        this.grassAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //frames: PP.createImage(GirlWithARifleScene.models.grassFrames),
            init() {
                let childData = [
                    { layers: ['m_0','m_1','m_2','m_3','m_4','m_5','m_6'], initAnimationRepeatDelay: 10 },
                    { layers: ['m_10'], initAnimationRepeatDelay: 5 },
                    { layers: ['m_7','m_8','m_9'], initAnimationRepeatDelay: 0 }
                ]

                this.grassAnimationItems = childData.map(cd => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(GirlWithARifleScene.models.grassFrames, {renderOnly: cd.layers}),
                    init() {
                        let framesCount = 0;

                        let originFramesCount = this.frames.length;
                        let isShort = false;
        
                        this.framesShort = [
                            this.frames[0], this.frames[1],this.frames[2], this.frames[1], this.frames[0]
                        ];
                        let originFrameShortChangeDelay = 10;
        
                        let framesCut = this.frames.filter((f,i) => i < (this.frames.length-1));
                        this.framesLong = [
                            ...framesCut, ...framesCut.reverse()
                        ];
        
                        this.frames = this.framesLong;
        
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        let originFrameChangeDelay = 8;
                        let frameChangeDelay = originFrameChangeDelay;
                        
                        let animationRepeatDelayOrigin = 0;//10;
                        let animationRepeatDelay = cd.initAnimationRepeatDelay//animationRepeatDelayOrigin;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            framesCount++;
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            if(isShort){
                                frameChangeDelay = originFrameShortChangeDelay;
                            }
                            else {
                                frameChangeDelay = originFrameChangeDelay;
                            }
        
                            if(!isShort){
                                if(this.currentFrame < originFramesCount)
                                    frameChangeDelay = fast.r(originFrameChangeDelay/2);
                            }
                            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                //console.log('grassAnimationItems' + framesCount)
                                framesCount = 0
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
        
                                isShort = !isShort;
        
                                if(isShort){
                                    this.frames = this.framesShort; 
                                }
                                else {
                                    this.frames = this.framesLong;
                                }
                            }
                        })
                    }
                })))


                //this.frames = [...this.frames, ...this.frames.reverse()]
                
            }
        }), 31)

        this.hand = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.handRifleAnimation, { renderOnly: ['hand'] }),
        }), 40)

        // this.girl = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(GirlWithARifleScene.models.main, { renderOnly: ['girl', 'girl_d1'] }),
        // }), 50)

        this.belt = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.handRifleAnimation, { renderOnly: ['belt'] }),
        }), 60)

        this.handRifleManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            setImages() {
                this.parentScene.belt.img = this.parentScene.belt.frames[this.currentFrame]
                this.parentScene.hand.img = this.parentScene.hand.frames[this.currentFrame]
                this.parentScene.rifle.img = this.parentScene.rifle.frames[this.currentFrame]
            },
            init() {
                let framesCount = 0;

                let totalFrames = this.parentScene.belt.frames.length;
                this.currentFrame = 0;
                this.setImages();
                
                let originFrameChangeDelay = 15;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 150;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    framesCount++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        //console.log('handRifleManager' + framesCount)
                        framesCount = 0;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }

                    this.setImages();
                })
            }
        }), 1)

        this.hairs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.hairsFrames),
            init() {
                let fc = 0;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 8;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                frameChangeDelay = originFrameChangeDelay-1;
                this.timer = this.regTimerDefault(10, () => {
                    fc++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                    if(this.currentFrame < 5){
                        frameChangeDelay = originFrameChangeDelay-1;
                    }
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        console.log('hairs frames: ' + fc);
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 75)


        this.clotherAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['girl', 'girl_d1', 'ani'] }),
            init() {
                let framesCount = 0;
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    framesCount++;

                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        //console.log('clotherAnimation' + framesCount)
                        framesCount = 0
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 50)

        this.clotherAnimation2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['ani2'] }),
            init() {
                let framesCount = 0;
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = 7;
                
                this.timer = this.regTimerDefault(10, () => {
                    framesCount++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        //console.log('clotherAnimation2' + framesCount)
                        framesCount = 0
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 51)

        this.clotherAnimation3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(GirlWithARifleScene.models.clothersFrames2, { renderOnly: ['ani3'] }),
            init() {
                let framesCount = 0;
                let originFramesCount = this.frames.length;
                let isShort = false;

                this.framesShort = [
                    this.frames[0], this.frames[1], this.frames[0]
                ];
                let originFrameShortChangeDelay = 20;

                this.framesLong = [
                ...this.frames, ...this.frames.reverse()];

                this.frames = this.framesLong;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;//10;
                let animationRepeatDelay = 2;
                
                this.timer = this.regTimerDefault(10, () => {
                    framesCount++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    //frameChangeDelay = originFrameChangeDelay;
                    if(isShort){
                        frameChangeDelay = originFrameShortChangeDelay;
                    }
                    else {
                        frameChangeDelay = originFrameChangeDelay;
                    }

                    if(!isShort){
                        if(this.currentFrame < originFramesCount)
                            frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    }
                    
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        //console.log('clotherAnimation3' + framesCount)
                        framesCount = 0
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;

                        isShort = !isShort;

                        if(isShort){
                            this.frames = this.framesShort; 
                        }
                        else {
                            this.frames = this.framesLong;
                        }
                    }
                })
            }
        }), 61)

        this.sign = this.addGo(new GO({
            position: new V2(this.viewport.x - 28.5, 6),
            size: new V2(55,12),
            createShowHideFrames({appearframesCount=70, delayFramesCount =100, hideFramesCount=30, size}) {
                let frames = [];
                
                let points = animationHelpers.extractPointData(GirlWithARifleScene.models.sign.main.layers.find(l => l.id == 'm_0'));
                let xValues = easing.fast({ from: 55, to: 0, steps: appearframesCount, type: 'linear', round: 0 });

                let itemsData = points.map(p => {
                    let frames = [];
                    let point = new V2(p.point);
                    let visibleFrom = -1;
                    for(let f = 0; f < appearframesCount; f++){
                        let frameIndex = f;
                        if(frameIndex > (appearframesCount-1)){
                            frameIndex-=appearframesCount;
                        }
                
                        if(point.x > xValues[f] && visibleFrom == -1){
                            visibleFrom = f;
                        }

                        frames[frameIndex] = {
                            visible: point.x > xValues[f], 
                            p: point
                        };
                    }

                    for(let f = appearframesCount; f < visibleFrom+delayFramesCount;f++){
                        frames[f] = {
                            visible: true, 
                            p: point
                        };
                    }

                    let xChange = easing.fast({from: point.x, to: size.x, steps: hideFramesCount, type: 'linear', round: 0 });
                    for(let f = 0; f < hideFramesCount; f++){
                        frames[visibleFrom+delayFramesCount+f] = {
                            visible: true, 
                            p: new V2(xChange[f], point.y)
                        };
                    }
                
                    return {
                        frames
                    }
                })

                for(let f = 0; f < appearframesCount+delayFramesCount+hideFramesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('#F8DBB3');
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                if(itemData.frames[f].visible){
                                    hlp.dot(itemData.frames[f].p.x, itemData.frames[f].p.y)
                                }
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createShowHideFrames({framesCount: 100, size: this.size})
                this.registerFramesDefaultTimer({});
                
                // this.img = PP.createImage(GirlWithARifleScene.models.sign, { colorsSubstitutions: { 
                //     '#FF0000': { color: '#F8DBB3' }
                //  } })
            }
        }), 1)

        // this.main = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: PP.createImage(GirlWithARifleScene.models.main),
        //     init() {
                
        //     }
        // }), 1)
    }
}