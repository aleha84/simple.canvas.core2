class CreditsScene extends Scene {
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
                size: new V2(150,150).mul(12),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'credits',
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
        let model = CreditsScene.models.main;
        let layersData = {};
        let exclude = [
            'g_light1', 'g_light2'
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

        this.gLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.currentFrame = 0;
                let counter = 120;
                let current = 0;
                let images = [
                    PP.createImage(model, { renderOnly: ['g_light1'], forceVisibility: { g_light1: { visible: true } } } ),
                    PP.createImage(model, { renderOnly: ['g_light2'], forceVisibility: { g_light2: { visible: true } } } )
                ]

                this.img = images[current%images.length];

                this.timer = this.regTimerDefault(10, () => {
                
                    if(this.currentFrame == counter){
                        this.currentFrame = 0;
                        current++;
                        this.img = images[current%images.length];
                    }

                    this.currentFrame++;
                })
            }
        }), layersData.garlands.renderIndex+1)

        this.eLights = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLightsFrames({framesCount, itemsCount, itemFrameslength, xClamps, yClamps, maxACLamps, size}) {
                let frames = [];
                let _colors = ['#BF6263', '#C6B8B1', '#496189', '#5B7765', '#C381A6']
                _colors = _colors.map(c => colors.colorTypeConverter({ value: c, toType: 'rgb', fromType: 'hex' }))

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                    let c = _colors[getRandomInt(0, _colors.length-1)];
                    let maxA = fast.r(getRandom(maxACLamps[0], maxACLamps[1]), 2)
                    if(getRandomInt(0,9) == 0) {
                        maxA = fast.r(getRandomInt(0.7, 0.9),2);
                    }

                    let aValues = [
                        ...easing.fast({from: 0, to: maxA, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({from: maxA, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 2})
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
                        p,
                        c,
                        showLeafs: maxA > 0.5,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(colors.rgbToString({ value: itemData.c, isObject: true, opacity: itemData.frames[f].a })).dot(itemData.p)
                                if(itemData.showLeafs) {
                                    hlp.setFillColor(colors.rgbToString({ value: itemData.c, isObject: true, opacity: itemData.frames[f].a/3 }))
                                        .dot(itemData.p.x-1, itemData.p.y)
                                        .dot(itemData.p.x+1, itemData.p.y)
                                        .dot(itemData.p.x, itemData.p.y-1)
                                        .dot(itemData.p.x, itemData.p.y+1)
                                }
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = 
                    this.createLightsFrames({ framesCount: 240, itemsCount: 100, itemFrameslength: 200, xClamps: [3,48], yClamps: [10, 88], maxACLamps: [0.2, 0.6], size: this.size })
                    .map(f => createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(f, 0, 0);
                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(this.parentScene.yolka.img, 0,0);
                    }));

                this.registerFramesDefaultTimer({});
            }
        }), layersData.yolka_toys.renderIndex+1)

        this.credits = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(5, -40)),
            size: new V2(40, 60),
            init() {

                let screenZone = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').rect(0,2,size.x, 38)
                })

                let img = createCanvas(this.size, (ctx, size, hlp) => {
                    //ctx.drawImage(screenZone, 0, 0)
                    let mid = fast.r(size.x/2);
                    for(let y = 0; y < size.y; y++) {
                        if(y%2==0) {
                            let width = getRandomInt(5,10);
                            let xShift = 0//getRandomInt(2,4);
                            hlp.setFillColor('rgba(255,255,255, 0.5)').rect(xShift + mid-width,y,width*2, 1)
                            let darkParts = getRandomInt(4,10);
                            hlp.setFillColor('#08030a').dot(mid+getRandomInt(-4,4), y) //.dot(mid, y)
                            for(let i = 0; i < darkParts; i++) {
                                hlp.setFillColor('rgba(0,0,0,' + getRandomInt(1,2)/10 +')').dot( getRandomInt(mid-width, mid-width + width*2) , y)
                            }
                        }
                    }
                })

                let totalFrames = 240*3;
                let yValues = easing.fast({from: 0, to: -this.size.y, steps: totalFrames, type: 'linear', round: 0});
                this.frames = [];

                for(let f = 0; f < totalFrames; f++) {
                    let yShift = yValues[f];
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(img, 0, yShift)
                        ctx.drawImage(img, 0, size.y + yShift)

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(screenZone, 0,0)
                    })
                }

                //this.img = img;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.tv.renderIndex+1)

        this.leftLegsAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CreditsScene.models.legsAnimations2, { renderOnly: ['left'] })
                let totalAnimationFrames = 60;
                let totalFrames = 240;
                let frameIndexValues = [
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'linear', round: 0}),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'linear', round: 0})
                ]

                let frameIndices = [
                    ...new Array(totalFrames-totalAnimationFrames).fill(0),
                    ...frameIndexValues
                ];

                for(let i = 0; i < 30; i++) {
                    frameIndices[90 + i] = 1;
                }

                this.currentFrame = 0;
                this.img = this.frames[frameIndices[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.img = this.frames[frameIndices[this.currentFrame]];
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.currentFrame++;
                })

            }
        }), layersData.left_legs.renderIndex+1)

        this.rightLegsAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CreditsScene.models.legsAnimations2, { renderOnly: ['right'] })
                let totalAnimationFrames = 60;
                let totalFrames = 240;
                let frameIndexValues = [
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'linear', round: 0}),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'linear', round: 0})
                ]

                let frameIndices = [
                    ...new Array(30).fill(0),
                    ...frameIndexValues,
                    ...new Array(totalFrames-totalAnimationFrames-30).fill(0)
                ];

                for(let i = 0; i < 20; i++) {
                    frameIndices[160 + i] = 1;
                }

                this.currentFrame = 0;
                this.img = this.frames[frameIndices[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.img = this.frames[frameIndices[this.currentFrame]];
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.currentFrame++;
                })

            }
        }), layersData.right_legs.renderIndex+1)

        this.candles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //
                let totalFrames = 240;
                this.frames = [];

                let aClamps = [0.2, 0.5]
                let counter = getRandomInt(10,10);
                let darkAlpha1 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                let darkAlpha2 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                let darkAlpha3 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                let d1 = new V2(116,46);
                let d2 = new V2(120,48);
                let d3 = new V2(44,43);
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#f2dcb1').dot(d1).dot(d2).dot(d3);//
                        hlp.setFillColor('rgba(0,0,0,' + darkAlpha1 + ')').dot(d1);
                        hlp.setFillColor('rgba(0,0,0,' + darkAlpha2 + ')').dot(d2);
                        hlp.setFillColor('rgba(0,0,0,' + darkAlpha3 + ')').dot(d3);
                        
                        hlp.setFillColor('rgba(255,255,255,' + darkAlpha1/4 + ')').rect(d1.x-2, d1.y+1, 5, 1)
                        hlp.setFillColor('rgba(255,255,255,' + darkAlpha2/4 + ')').rect(d2.x-1, d2.y+1, 3, 1)
                        hlp.setFillColor('rgba(255,255,255,' + darkAlpha3/4 + ')').rect(d3.x-2, d3.y+1, 5, 1)

                        hlp.setFillColor('rgba(255,255,255,' + 0.05 + ')').rect(70, 52, 20, 1)
                        hlp.setFillColor('rgba(255,255,255,' + 0.05 + ')').rect(75, 52, 10, 1)
                        hlp.setFillColor('rgba(0,0,0,' + darkAlpha2/2 + ')').rect(70, 52, 20, 1)

                        counter--;

                        if(counter == 0) {
                            counter = getRandomInt(10,10);
                            darkAlpha1 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                            darkAlpha2 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                            darkAlpha3 =fast.r(getRandom(aClamps[0], aClamps[1]), 2);
                        }
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.candles.renderIndex+1)

        this.catAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = PP.createImage(CreditsScene.models.catAnimation)
                let totalAnimationFrames = 120;
                let totalFrames = 240;
                let frameIndexValues = [
                    ...easing.fast({from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0})
                ]

                let frameIndices = [
                    ...new Array(totalFrames-totalAnimationFrames).fill(0),
                    ...frameIndexValues
                ];

                // for(let i = 0; i < 30; i++) {
                //     frameIndices[90 + i] = 1;
                // }

                this.currentFrame = 0;
                this.img = this.frames[frameIndices[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.img = this.frames[frameIndices[this.currentFrame]];
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.currentFrame++;
                })
            }
        }), layersData.cat.renderIndex+1)
    }
}