class BaechInterviewScene extends Scene {
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
                size: new V2(1920, 1080),//new V2(2000, 1330),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'beach_man_woman',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = BaechInterviewScene.models.main;
        let layersData = {};
        let exclude = [
            'beach_people'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        this.palm2 = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(90,0)),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    // ctx.translate(size.x, 0);
                    // ctx.scale(-1,1);

                    ctx.drawImage(PP.createImage(model, { renderOnly: ['palm1'] }), 0,0)
                })
            }
        }), layersData.palm1.renderIndex)

        this.seaP = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let aToy = easing.fast({from: 0.1, to: 0.3, steps: 3, type: 'linear', round: 1})

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(0, size.x)
                    let y = getRandomInt(84,86);
                    let a = aToy[(y-84)];

                    let aValues = [
                        ...easing.fast({ from: 0, to: a, steps: totalFrames/2, type: 'quad', method: 'inOut' }),
                        ...easing.fast({ from: a, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut' })
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f]
                        };
                    }
                
                    return {
                        x,y,a,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`).dot(itemData.x, itemData.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 300, itemFrameslength: 90, size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.beach.renderIndex+1)

        this.beach_people = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBeachPeopleFrames({framesCount, itemFrameslength, size}) {
                let frames = [];
                
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'beach_people'));

                let itemsData = pd.map((data) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslength);
                
                    let rgb = colors.colorTypeConverter({ value: data.color, fromType: 'hex', toType: 'rgb' });

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            rgba: colors.rgbToString({ value: rgb, isObject: true, opacity: 0.5 }),
                            changeOpacity: true
                        };
                    }
                
                    return {
                        data,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.frames[f].rgba).dot(itemData.data.point)
                            }
                            else {
                                hlp.setFillColor(itemData.data.color).dot(itemData.data.point)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createBeachPeopleFrames({ framesCount: 300, itemFrameslength: [50, 80], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.beach_people.renderIndex);

        this.palmsAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let palmAnimationModel = BaechInterviewScene.models.palmAnimations;

                let aniParams = [
                    { layerName: 'l1' },
                    { layerName: 'l2' },
                    { layerName: 'l3' },
                    { layerName: 'l4' },
                    { layerName: 'l5' },
                    { layerName: 'l6' },
                    { layerName: 'l7' },
                    { layerName: 'l8' },
                    { layerName: 'l9' }
                ]

                let totalFrames = 150;
                let framesFromTo = [0, 3]
                let totalAnimationFrames = 140;
                let animationStartFrameClamps = [0, 100]

                for(let i = 0; i < 2; i++)
                aniParams.map(p => this.addChild(new GO({
                    position: new V2(i == 1 ? 90 : 0, 0),
                    size: this.size,
                    frames: PP.createImage(palmAnimationModel, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)
                        let animationStartFrame = getRandomInt(animationStartFrameClamps) // p.animationStartFrame + aniStart;

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: framesFromTo[0], to: framesFromTo[1], steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0}), 
                                ...easing.fast({ from: framesFromTo[1], to: framesFromTo[0], steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }               

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));

            }
        }), layersData.palm1.renderIndex+1)

        let personsShift = new V2(-10,0)
        this.man = this.addGo(new GO({
            position: this.sceneCenter.add(personsShift),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(BaechInterviewScene.models.secondScene.man, { exclude: ['hands2', 'p'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(BaechInterviewScene.models.secondScene.man.main.layers.find(l => l.name == 'p')) });
        
                        this.registerFramesDefaultTimer({});
                    }
                }), false, false)

                this.man_animation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = PP.createImage(BaechInterviewScene.models.secondScene.man_animation)
                        let totalFrames = 150;
                        let framesIndexValues = [
                            ...easing.fast({from: 0, to: this.frames.length-1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: this.frames.length-1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                        })
                    }
                }))

                this.hands = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    isVisible: true,
                    init() {
                        this.currentFrame = 0;
                        this.img = PP.createImage(BaechInterviewScene.models.secondScene.man, { renderOnly: ['hands2'] })
                        let totalFrames = 300;

                        this.timer = this.regTimerDefault(10, () => {
                            if(this.currentFrame == 100) {
                                this.isVisible = true;
                            } 

                            if(this.currentFrame == 150) {
                                this.isVisible = false;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))
            }
        }), layersData.lamp.renderIndex+10)

        
        this.woman = this.addGo(new GO({
            position: this.sceneCenter.add(personsShift),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(BaechInterviewScene.models.secondScene.woman, { exclude: ['p'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(BaechInterviewScene.models.secondScene.woman.main.layers.find(l => l.name == 'p')) });
        
                        this.registerFramesDefaultTimer({});
                    }
                }), false, false)

                this.speakingAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(BaechInterviewScene.models.secondScene.woman_faceAnimation),
                    init() {

                        this.currentFrame = 0;
                        let framesLength = getRandomInt(5,10);
                        this.img = this.frames[0];
                        let lastTimeOpen = 0;
                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;
                            if(this.currentFrame == framesLength){
                                this.currentFrame = 0;
                                let framesIndex = getRandomInt(0, this.frames.length-1);

                                lastTimeOpen++;

                                if(framesIndex == 3) {
                                    lastTimeOpen = 0;
                                }
                                else {
                                   if(lastTimeOpen == 5){
                                    lastTimeOpen = 0;
                                    framesIndex =3;
                                   } 
                                }

                                this.img = this.frames[framesIndex];
                                framesLength = getRandomInt(5,10);
                                if(framesIndex == 2) {
                                    framesLength = getRandomInt(4,6);
                                }
                            }

                            // this.img = this.frames[framesIndicies[this.currentFrame]];
                        })
                    }
                }), false, false)
            }
        }), layersData.lamp.renderIndex+10)

        /*
        this.guy = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-30.5, 10)),
            size: new V2(67,100),
            //img: PP.createImage(BaechInterviewScene.models.guy), 
            init() {
                let model = BaechInterviewScene.models.guy;
                let layersData = {};
                let exclude = [
                    'p'
                ];
                
                for(let i = 0; i < model.main.layers.length; i++) {
                    let layer = model.main.layers[i];
                    let layerName = layer.name || layer.id;
                    let renderIndex = i*10;
                
                    layersData[layerName] = {
                        renderIndex
                    }
                    
                    if(exclude.indexOf(layerName) != -1){
                        console.log(`${layerName} - skipped`)
                        continue;
                    }
                    
                    this[layerName] = this.addChild(new GO({
                        position: new V2(),
                        size: this.size.clone(),
                        img: PP.createImage(model, { renderOnly: [layerName] }),
                        init() {
                            if(layerName == 'hands' || layerName == 'camera') {
                                let totalFrames = 300
                                this.currentFrame = 0;
                                
                                
                                this.timer = this.regTimerDefault(15, () => {
                                    if(this.currentFrame == 100) {
                                        this.position.x = -1
                                        this.needRecalcRenderProperties = true
                                    }
                                    else if(this.currentFrame == 200) {
                                        this.position.x = 0
                                        this.needRecalcRenderProperties = true
                                    }
                                    this.currentFrame++;
                                    if(this.currentFrame == totalFrames){
                                        this.currentFrame = 0;
                                    }
                                })
                            }
                    
                        }
                    }))
                    
                    console.log(`${layerName} - ${renderIndex}`)
                }
                
                this.speakingAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(BaechInterviewScene.models.guySpeakingAnimation),
                    init() {
                        let params = [
                            { length: 20, type: 1 },
                            { length: 30, type: 2 },
                            { length: 30, pause: true},
                            { length: 30, type: 2 },
                            { length: 20, type: 1 },
                            { length: 60, pause: true},
                            { length: 30, type: 2 },
                            { length: 20, type: 1 },
                            { length: 20, type: 2 },
                            { length: 40, pause: true},
                        ]

                        // let sp1Length = 20;
                        // let sp1LengthFramesIndicies = [
                        //     ...easing.fast({ from: 0, to: 2, steps: sp1Length/2, type: 'linear', round: 0 }),
                        //     ...easing.fast({ from: 2, to: 1, steps: sp1Length/2, type: 'linear', round: 0 })
                        // ]

                        let framesIndicies = [];

                        for(let i = 0; i < params.length; i++) {
                            let p = params[i];

                            let from = 0;
                            let to = 0;

                            if(p.type == 1) {
                                to = 1
                            }

                            if(p.type == 2) {
                                to = 2
                            }

                            let _framesIndicies = [
                                ...easing.fast({ from, to, steps: p.length/2, type: 'linear', round: 0 }),
                                ...easing.fast({ from, to, steps: p.length/2, type: 'linear', round: 0 })
                            ]

                            for(let f = 0; f < p.length; f++) {
                                framesIndicies[framesIndicies.length] = _framesIndicies[f]
                            }
                        }

                        console.log(framesIndicies.length)

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndicies[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;
                            if(this.currentFrame == framesIndicies.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.frames[framesIndicies[this.currentFrame]];
                        })
                    }
                }), false, false)

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p')) });
        
                        this.registerFramesDefaultTimer({});
                    }
                }), false, false)
            }
        }), layersData.lamp.renderIndex+10)
        */
    }
}