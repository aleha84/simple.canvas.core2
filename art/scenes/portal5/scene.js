class Portal5Scene extends Scene {
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
                fileNamePrefix: 'portal5',
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
        let model = Portal5Scene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'portal_ring', 'letters_bg', 'stairs_p', 'ring_p',
            'rock1','rock2','rock3','rock4',
            'rock5','rock6','rock7','rock8','rock9'
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

        let createLetterAnimations = function({framesCount, letterAnimations, levitationYmax, bgLayerName, itemFrameslengthClamps, size}) {
            let frames = [];
            let models = letterAnimations;
            
            let randomFramesCount = framesCount; 

            function shuffle(array) {
                let currentIndex = array.length,  randomIndex;
              
                // While there remain elements to shuffle...
                while (currentIndex != 0) {
              
                  // Pick a remaining element...
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex--;
              
                  // And swap it with the current element.
                  [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
              
                return array;
              }

              //let positions = shuffle(shuffle(new Array(count).fill().map((el, i) => i)));

            let levitationYValues = [
                ...easing.fast({from: 0, to: levitationYmax, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({from: levitationYmax, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
            ]
            //let randomFramesLength = getRandomInt(itemFrameslengthClamps);
            
            let bgImg = PP.createImage(model, {renderOnly: [bgLayerName]})

            let letterFrames = {}
            let randomItemsData = undefined;
            if(models) {
                let count = models.main[0].layers.length;

                for(let i = 0; i < models.main[0].layers.length; i++) {
                    let layerName = models.main[0].layers[i].name;
                    letterFrames[layerName] = PP.createImage(models, { renderOnly: [layerName] })
                }
                
                // models.main.layers.map(l => ({
                //     PP.createCanvas(models, { renderOnly: [l.name] })
                // }))
    
                randomItemsData = new Array(count).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, randomFramesCount-1);
                    //fast.r((framesCount/count)*positions[i]) + getRandomInt(0, 15)
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let framesChangeForRandom = [
                        ...easing.fast({from: 0, to: models.main.length-1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: models.main.length-1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                    ]
    
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            fi: framesChangeForRandom[f]
                        };
                    }
                
                    return {
                        layerName: models.main[0].layers[i].name,
                        frames
                    }
                })
            }
            
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, _size, hlp) => {
                    let levatationY = levitationYValues[f];
                    ctx.drawImage(bgImg, 0,levatationY);

                    if(models) {
                        ctx.drawImage(createCanvas(_size, (ctx, __size, hlp) => {
                            for(let p = 0; p < randomItemsData.length; p++){
                                let itemData = randomItemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(letterFrames[itemData.layerName][itemData.frames[f].fi], 0, 0)
                                }
                                
                            }
    
                            ctx.globalCompositeOperation = 'source-atop';
    
                            hlp.setFillColor('rgba(255,255,255, 0.20)').rect(0,0,__size.x, __size.y)
                        }), 0,levatationY);
                    }
                });
            }
            
            return frames;
        }

        for(let i = 1; i < 10; i++) {
            let rockName = 'rock' + i
            this[rockName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                rockName,
                index: i,
                init() {
                    console.log(this.rockName)
                    this.frames = createLetterAnimations({ 
                        framesCount: 100, letterAnimations: Portal5Scene.models[this.rockName + 'LetterAnimations'],
                        levitationYmax: i < 5 ? -3 : -2, bgLayerName: this.rockName, itemFrameslengthClamps: [50, 80], size: this.size
                    })

                    let startFrameIndex = fast.r((99/10)*(i-1)) + getRandomInt(15, 50);
                    if(startFrameIndex > 99) {
                        startFrameIndex-=99;
                    }

                    this.registerFramesDefaultTimer({
                        startFrameIndex//: getRandomInt(0, 99)
                    });
                }
            }), layersData.rock1.renderIndex+1)
        }

        this.ring = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLettersFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                let models = Portal5Scene.models.letterAnimations;
                let count = models.main[0].layers.length;
                let randomFramesCount = framesCount; 

                let ring_pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'ring_p'))
                let ring_pFrames = animationHelpers.createMovementFrames({
                    framesCount: framesCount, itemFrameslength: [60,90], pointsData: ring_pd, size: this.size 
                });

                let levitationYValues = [
                    ...easing.fast({from: 0, to: 3, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: 3, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
                ]
                //let randomFramesLength = getRandomInt(itemFrameslengthClamps);
                
                let ringBg = PP.createImage(model, {renderOnly: ['portal_ring', 'letters_bg']})

                let letterFrames = {}
                for(let i = 0; i < models.main[0].layers.length; i++) {
                    let layerName = models.main[0].layers[i].name;
                    letterFrames[layerName] = PP.createImage(models, { renderOnly: [layerName] })
                }
                
                // models.main.layers.map(l => ({
                //     PP.createCanvas(models, { renderOnly: [l.name] })
                // }))

                let randomItemsData = new Array(count).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, randomFramesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let framesChangeForRandom = [
                        ...easing.fast({from: 0, to: models.main.length-1, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: models.main.length-1, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            fi: framesChangeForRandom[f]
                        };
                    }
                
                    return {
                        layerName: models.main[0].layers[i].name,
                        frames
                    }
                })

                let allLength = 50;

                let framesChangeForClockWise = [
                    ...easing.fast({from: 0, to: models.main.length-1, steps: allLength/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: models.main.length-1, to: 0, steps: allLength/2, type: 'quad', method: 'inOut', round: 0})
                ]

                let allItemsData = new Array(count).fill().map((el, i) => {
                    let startFrameIndex = 75//getRandomInt(0, randomFramesCount-1 - randomFramesLength);
                    let totalFrames = allLength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            fi: framesChangeForClockWise[f]
                        };

                    }
                
                    return {
                        layerName: models.main[0].layers[i].name,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, _size, hlp) => {
                        let levatationY = levitationYValues[f];
                        ctx.drawImage(ringBg, 0,levatationY);
                        ctx.drawImage(ring_pFrames[f], 0, levatationY)

                        ctx.drawImage(createCanvas(_size, (ctx, __size, hlp) => {
                            for(let p = 0; p < randomItemsData.length; p++){
                                let itemData = randomItemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(letterFrames[itemData.layerName][itemData.frames[f].fi], 0, 0)
                                }
                                
                            }
    
                            for(let p = 0; p < allItemsData.length; p++){
                                let itemData = allItemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(letterFrames[itemData.layerName][itemData.frames[f].fi], 0, 0)
                                }
                                
                            }

                            ctx.globalCompositeOperation = 'source-atop';

                            hlp.setFillColor('rgba(255,255,255, 0.20)').rect(0,0,__size.x, __size.y)
                        }), 0,levatationY);
                        
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createLettersFrames({framesCount: 200, itemFrameslengthClamps: [30, 60], size: this.size});
                this.registerFramesDefaultTimer({});
            }
        }), layersData.portal_ring.renderIndex+1)


        let totalFrames = 400;
        let circleImages = {};
        let cColors = [ '#685f52', '#9e967c', '#dbc594', '#fcf6dc', '#b4966c' ]

        this.backClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let cloudsParams = [
                     
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#fcf6dc', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [15,25], sizeClamps: [18,26], 
                            //sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                            initialProps: {
                                line: true, p1: new V2(120, 100), p2: new V2(220, 50)
                            }, yShiftClamps: [-10,-20],
                    },  

                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 500, itemFrameslength: totalFrames, color: '#fcf6dc', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [15,25], sizeClamps: [18,26], 
                            sec: {color: '#9e967c', sDecrClamps: [1,3], yShiftClamps: [1,4], xShiftClamps: [0,3]},
                            initialProps: {
                                line: true, p1: new V2(-30, 145), p2: new V2(215, 90)
                            }, yShiftClamps: [-10,-20],
                    },  

                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#dbc594', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [20,30], sizeClamps: [18,26], 
                            sec: {color: '#9e967c', sDecrClamps: [2,5], yShiftClamps: [2,4], xShiftClamps: [0,3]},
                            initialProps: {
                                line: true, p1: new V2(110, 100), p2: new V2(215, 85)
                            }, yShiftClamps: [-8,-15],
                    }, 

                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#dbc594', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [20,30], sizeClamps: [18,26], 
                            sec: {color: '#9e967c', sDecrClamps: [2,5], yShiftClamps: [2,6], xShiftClamps: [0,4]},
                            initialProps: {
                                line: true, p1: new V2(60, 130), p2: new V2(215, 100)
                            }, yShiftClamps: [-8,-15],
                    }, 
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 100, itemFrameslength: totalFrames, color: '#dbc594', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [20,30], sizeClamps: [18,26], 
                            sec: {color: '#9e967c', sDecrClamps: [2,5], yShiftClamps: [2,6], xShiftClamps: [0,4]},
                            initialProps: {
                                line: true, p1: new V2(-30, 150), p2: new V2(90, 140)
                            }, yShiftClamps: [-8,-15],
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
                        // ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            // ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        // ctx.globalAlpha = 1;

                        // ctx.globalCompositeOperation = 'source-atop';
                        // ctx.drawImage(darkOverlay, 0,0);
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.portal_ring.renderIndex-5)

        
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


        this.frontalClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let cloudsParams = [
                        
                    {
                        opacity: 1,
                        framesCount: totalFrames, itemsCount: 200, itemFrameslength: totalFrames, color: '#685f52', size: this.size,
                            directionAngleClamps: [60, 90], distanceClamps: [20,30], sizeClamps: [18,26], 
                            //sec: {color: midCloudsColors.c2_dark, sDecrClamps: [1,1], yShiftClamps: [0,1], xShiftClamps: [-1,0]},
                            initialProps: {
                                line: true, p1: new V2(60, 170), p2: new V2(207, 112)
                            }, yShiftClamps: [-10,-20],
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
                        // ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            // ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        // ctx.globalAlpha = 1;

                        // ctx.globalCompositeOperation = 'source-atop';
                        // ctx.drawImage(darkOverlay, 0,0);
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        //this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.portal_ring.renderIndex+5)

        this.stairs_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'stairs_p'))
                this.frames = animationHelpers.createMovementFrames({
                    framesCount: 200, itemFrameslength: [30,60], pointsData: pd, size: this.size 
                });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.stairs_p.renderIndex+1)
    }
}