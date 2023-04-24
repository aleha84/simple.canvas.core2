class WindowViewScene extends Scene {
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
                size: new V2(150,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'windowView',
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
        let model = WindowViewScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'w1', 'w2', 'close_p', 'far_p'
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

        let createSnowfallFrames = function({framesCount, itemsCount, maxA, xClamps, yClamps,lengthClamps,angleClamps, itemFrameslength, addSquare, size, 
            colorPrefix = 'rgba(255,255,255,'}) {
            let frames = [];
            let sharedPP = PP.createNonDrawingInstance();
            //let colorPrefix = 'rgba(255,255,255,'; 

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength): itemFrameslength;
            
                let p0 = new V2(getRandomInt(xClamps), getRandomInt(yClamps));
                let _maxA = isArray(maxA) ? fast.r(getRandom(maxA[0], maxA[1]),2) : maxA
                let length = getRandomInt(lengthClamps);
                let angle = fast.r(getRandom(angleClamps[0], angleClamps[1]))

                let direction = V2.down.rotate(angle);
                let linePoints = sharedPP.lineV2(p0, p0.add(direction.mul(length)).toInt());

                let linePointsIndicesValues = easing.fast({ from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0})

                let aValues = [
                    ...easing.fast({from: 0, to: _maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: _maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                ]

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = linePoints[linePointsIndicesValues[f]]
                    let a = aValues[f];
                    if(a == undefined)
                        a = 0
            
                    frames[frameIndex] = {
                        p,
                        a
                    };
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
                            hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')').dot(itemData.frames[f].p)
                            if(addSquare) {
                                let {x, y} = itemData.frames[f].p
                                //hlp.setFillColor(colorPrefix + itemData.frames[f].a/4 + ')').rect(itemData.frames[f].p.x-1, itemData.frames[f].p.y-1, 3, 3)
                                hlp.setFillColor(colorPrefix + itemData.frames[f].a/5 + ')')
                                    .dot(x-1, y).dot(x+1, y).dot(x, y-1).dot(x, y+1)
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.snowFallClose = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let layersCount = 8;
                let itemsCountValues = easing.fast({from: 400, to: 100, steps: layersCount, type: 'quad', method: 'out', round: 0})
                let maxAValues = easing.fast({from: 0.2, to: 0.5, steps: layersCount, type: 'linear', round: 2})
                let lengthClampsValues = easing.fast({from: 30, to: 80, steps: layersCount, type: 'linear', round: 0})
                let angleClampsValues = easing.fast({from: 10, to: 20, steps: layersCount, type: 'linear', round: 0})

                let layersData = new Array(layersCount).fill().map((_, i) => ({
                    addSquare: i == (layersCount-1),
                    framesCount: 300,
                    itemsCount: itemsCountValues[i],
                    maxA: maxAValues[i],
                    xClamps: [5, 130], 
                    yClamps: [0, 140],
                    lengthClamps: [lengthClampsValues[i], lengthClampsValues[i] + fast.r(lengthClampsValues[i]*0.2)],
                    angleClamps: [-angleClampsValues[i], angleClampsValues[i]],
                    itemFrameslength: [200, 240],
                    size: this.size
                }))

                layersData.map(ld => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: createSnowfallFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), layersData.window.renderIndex-2)

        this.shadowsOnTheBed = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.left = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames({
                            framesCount: 100, itemsCount: 15, maxA: 0.3, xClamps: [-10, 60], yClamps: [170, 175],lengthClamps: [10, 20],
                            angleClamps: [195, 205], itemFrameslength: 100, addSquare: false, size: this.size, 
                    colorPrefix: 'rgba(0,0,0,'
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.center = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames({
                            framesCount: 300, itemsCount: 30, maxA: 0.2, xClamps: [60, 125], yClamps: [190, 195],lengthClamps: [25, 30],
                            angleClamps: [170, 190], itemFrameslength: 150, addSquare: false, size: this.size, 
                    colorPrefix: 'rgba(0,0,0,'
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.right = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSnowfallFrames({
                            framesCount: 300, itemsCount: 20, maxA: 0.2, xClamps: [115, 160], yClamps: [188, 193],lengthClamps: [25, 30],
                            angleClamps: [130, 170], itemFrameslength: 150, addSquare: false, size: this.size, 
                    colorPrefix: 'rgba(0,0,0,'
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.bed.renderIndex+1)

        this.clockAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.currentFrame = 0;
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#11170e').rect(31,148,1,3)
                    // hlp.setFillColor('#263121').rect(28,159,3, 1)
                    // hlp.setFillColor('#2a3524').rect(32,159,4,1)
                    // hlp.setFillColor('#272a1f').rect(26,159,2,1)
                })
                
                let counter = 0;
                let limit = 30;

                this.timer = this.regTimerDefault(10, () => {
                    if(counter++ == limit)
                    {
                        this.isVisible = !this.isVisible;
                        counter = 0;
                    }
                })
            }
        }), layersData.clock_cloned.renderIndex+1)

        this.close_houses_animation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.w1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.isVisible = false;
                        this.img = PP.createImage(model, { renderOnly: ['w1'], forceVisibility: { w1: { visible: true }} })

                        this.currentFrame = 0;
                        
                        this.timer = this.regTimerDefault(10, () => {

                            this.isVisible = (this.currentFrame > 150 && this.currentFrame < 250)

                            this.currentFrame++;
                            if(this.currentFrame == 600){
                                this.currentFrame = 0;
                                this.parent.parentScene.capturing.stop = true;
                            }
                        })
                    }
                }))

                this.w2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let w2BaseImg = PP.createImage(model, { renderOnly: ['w2'], forceVisibility: { w2: { visible: true }} });
                        let images = [
                            w2BaseImg,
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.25
                                ctx.drawImage(w2BaseImg, 0, 0);
                            }),
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.globalAlpha = 0.5
                                ctx.drawImage(w2BaseImg, 0, 0);
                            }),
                            // createCanvas(this.size, (ctx, size, hlp) => {
                            //     ctx.globalAlpha = 0.75
                            //     ctx.drawImage(w2BaseImg, 0, 0);
                            // }),
                            undefined
                        ]

                        this.currentFrame = 0;
                        let clamps = [5, 15]
                        let len = getRandomInt(clamps)

                        this.img = images[getRandomInt(0, images.length-1)]

                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;
                            if(this.currentFrame == len){
                                this.currentFrame = 0;
                                len = getRandomInt(clamps)
                                this.img = images[getRandomInt(0, images.length-1)]
                            }
                        })
                    }
                }))

                this.close_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'close_p'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.close_houses.renderIndex+1)

        this.far_houses_animation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.far_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,50], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far_p'))
                         });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.far_house.renderIndex+1)
    }
}