class GraveyardMorningScene extends Scene {
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
                size: new V2(800, 600),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'graveyard',
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
        let model = GraveyardMorningScene.models.main;
        let layersData = {};
        let exclude = [
            'back_trees_p'
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

        let circleImages = {};
        let cColors = ['#FFFFFF']
        
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

        let createCloudsFrames = function({framesCount, itemsCount, size}) {
            let frames = [];
            let xClamps = [0, size.x/2];
            let yClamps = [92, 109];
            let fn_a = 3;
            let fn_b = 1;
            let alpha = 0.2

            let angleValues = easing.fast({from: 0, to: 360, steps: xClamps[1] - xClamps[0], type: 'linear', round: 0}).map(a => degreeToRadians(a));
            
            let mainImg = createCanvas(size, (ctx, _size, hlp) => {
                let fx = x => fast.r(Math.sin(x*fn_b)*fn_a);
                for(let x = xClamps[0]; x < xClamps[1]; x++) {
                    let y0 = yClamps[0] + fx(angleValues[x]);
                    hlp.setFillColor(cColors[0]).rect(x, y0, 1, yClamps[1] -y0)
                }

                //hlp.rect(xClamps[0] + 20, yClamps[1], 30, 1)

                let xStep = (xClamps[1] - xClamps[0])/itemsCount;
                for(let i = 0; i < itemsCount; i++) {
                    let x = fast.r(xStep*i);

                    if(x > xClamps[1]-10 || x < 10)
                        continue;

                    let y0 = yClamps[0] + fx(angleValues[x]);

                    x+=getRandomInt(-5,5);
                    y0+=getRandomInt(-5,3);

                    let r = getRandomInt(5,8);
                    let r_2 = fast.r(r/2);
                    ctx.drawImage(circleImages[cColors[0]][r], x-r_2,y0-r_2);
                }


                hlp.clear(xClamps[0], yClamps[1]-6, xClamps[1] - xClamps[0], 20);
                hlp.setFillColor('rgba(255,255,255,0.7)').rect(xClamps[0], yClamps[1]-6, xClamps[1] - xClamps[0], 3)
                hlp.setFillColor('rgba(255,255,255,0.4)').rect(xClamps[0], yClamps[1]-3, xClamps[1] - xClamps[0], 3)
                //hlp.setFillColor('rgba(255,255,255,0.4)').rect(xClamps[0]+ 20, yClamps[1], 40, 1)
                hlp.clear(xClamps[0] + 20, yClamps[1]-6, 40, 1).setFillColor(cColors[0]).rect(xClamps[0] + 20, yClamps[1]-6, 40, 1);

                
            })

            let xShiftValues = easing.fast({ from: 0, to: xClamps[1], steps: framesCount, type: 'linear', round: 0 } )
            for(let f = 0; f < framesCount; f++) {
                let xShift = xShiftValues[f];

                frames[f] = createCanvas(size, (ctx, _size, hlp) => {
                    ctx.globalAlpha = alpha;

                    ctx.drawImage(createCanvas(_size, (ctx, __size, hlp) => {
                        ctx.drawImage(mainImg, -xShift, 0);
                        ctx.drawImage(mainImg, -xShift + xClamps[1], 0);
                        ctx.drawImage(mainImg, -xShift + xClamps[1]*2, 0);
                    }), 0,0);
                })
            }
            
            return frames;
        }

        this.frontalFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createCloudsFrames({ framesCount: 600, itemsCount: 70, size: this.size });

                //this.img = this.frames[0]
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }

                });
            }
        }), layersData.graves_frontal.renderIndex-1)//

        this.farFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFogFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let xClamps = [0, size.x/5];
                let yClamps = [80, 86];
                let fn_a = 1;
                let fn_b = 1;
                let alpha = 0.2

                let angleValues = easing.fast({from: 0, to: 360, steps: xClamps[1] - xClamps[0], type: 'linear', round: 0}).map(a => degreeToRadians(a));
            
                let mainImg = createCanvas(size, (ctx, _size, hlp) => {
                    let fx = x => fast.r(Math.sin(x*fn_b)*fn_a);
                    for(let x = xClamps[0]; x < xClamps[1]; x++) {
                        let y0 = yClamps[0] + fx(angleValues[x]);
                        hlp.setFillColor(cColors[0]).rect(x, y0, 1, yClamps[1] -y0)
                    }

                    //hlp.rect(xClamps[0] + 20, yClamps[1], 30, 1)

                    let xStep = (xClamps[1] - xClamps[0])/itemsCount;
                    for(let i = 0; i < itemsCount; i++) {
                        let x = fast.r(xStep*i);

                        if(x > xClamps[1]-5 || x < 5)
                            continue;

                        let y0 = yClamps[0] + fx(angleValues[x]);

                        x+=getRandomInt(-1,1);
                        y0+=getRandomInt(-1,1);

                        let r = getRandomInt(2,4);
                        let r_2 = fast.r(r/2);
                        ctx.drawImage(circleImages[cColors[0]][r], x-r_2,y0-r_2);
                    }

                    hlp.clear(xClamps[0], yClamps[1], xClamps[1] - xClamps[0], 20);

                    hlp.setFillColor('rgba(255,255,255,0.7)').rect(xClamps[0], yClamps[1], xClamps[1] - xClamps[0], 1)
                    hlp.setFillColor('rgba(255,255,255,0.4)').rect(xClamps[0], yClamps[1]+1, xClamps[1] - xClamps[0], 1)
                })

                let xShiftValues = easing.fast({ from: 0, to: xClamps[1], steps: framesCount, type: 'linear', round: 0 } )
                for(let f = 0; f < framesCount; f++) {
                    let xShift = xShiftValues[f];

                    frames[f] = createCanvas(size, (ctx, _size, hlp) => {
                        ctx.globalAlpha = alpha;

                        ctx.drawImage(createCanvas(_size, (ctx, __size, hlp) => {
                            ctx.drawImage(mainImg, -xShift, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1], 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*2, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*3, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*4, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*5, 0);
                        }), 0,0);
                    })
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFogFrames({ framesCount: 600, itemsCount: 30, size: this.size });

                //this.img = this.frames[0]
                this.registerFramesDefaultTimer({});
            }
        }), layersData.graves_far.renderIndex+1)//

        this.midFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFogFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let xClamps = [0, size.x/4];
                let yClamps = [84, 99];
                let fn_a = 2;
                let fn_b = 1;
                let alpha = 0.2

                let angleValues = easing.fast({from: 0, to: 360, steps: xClamps[1] - xClamps[0], type: 'linear', round: 0}).map(a => degreeToRadians(a));
            
                let mainImg = createCanvas(size, (ctx, _size, hlp) => {
                    let fx = x => fast.r(Math.sin(x*fn_b)*fn_a);
                    for(let x = xClamps[0]; x < xClamps[1]; x++) {
                        let y0 = yClamps[0] + fx(angleValues[x]);
                        hlp.setFillColor(cColors[0]).rect(x, y0, 1, yClamps[1] -y0)
                    }

                    //hlp.rect(xClamps[0] + 20, yClamps[1], 30, 1)

                    let xStep = (xClamps[1] - xClamps[0])/itemsCount;
                    for(let i = 0; i < itemsCount; i++) {
                        let x = fast.r(xStep*i);

                        if(x > xClamps[1]-5 || x < 5)
                            continue;

                        let y0 = yClamps[0] + fx(angleValues[x]);

                        x+=getRandomInt(-1,1);
                        y0+=getRandomInt(-1,1);

                        let r = getRandomInt(4,6);
                        let r_2 = fast.r(r/2);
                        ctx.drawImage(circleImages[cColors[0]][r], x-r_2,y0-r_2);
                    }

                    hlp.clear(xClamps[0], yClamps[1]-1, xClamps[1] - xClamps[0], 20);

                    hlp.setFillColor('rgba(255,255,255,0.7)').rect(xClamps[0], yClamps[1]-1, xClamps[1] - xClamps[0], 2)
                    hlp.setFillColor('rgba(255,255,255,0.4)').rect(xClamps[0], yClamps[1]+1, xClamps[1] - xClamps[0], 2)
                })

                let xShiftValues = easing.fast({ from: 0, to: xClamps[1], steps: framesCount, type: 'linear', round: 0 } )
                for(let f = 0; f < framesCount; f++) {
                    let xShift = xShiftValues[f];

                    frames[f] = createCanvas(size, (ctx, _size, hlp) => {
                        ctx.globalAlpha = alpha;

                        ctx.drawImage(createCanvas(_size, (ctx, __size, hlp) => {
                            ctx.drawImage(mainImg, -xShift, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1], 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*2, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*3, 0);
                            ctx.drawImage(mainImg, -xShift + xClamps[1]*4, 0);
                        }), 0,0);
                    })
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFogFrames({ framesCount: 600, itemsCount: 40, size: this.size });

                //this.img = this.frames[0]
                this.registerFramesDefaultTimer({});
            }
        }), layersData.graves.renderIndex+1)//

        this.back_trees_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'back_trees_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.back_trees_p.renderIndex+1)

        this.treeAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 600;
                let aniStart = 200;
                let totalAnimationFrames = 60;
                let oneFrameDelay = 20;
                let oneFrame = 30;

                let aniParams = [
                    { layerName: 'l3', animationStartFrame: 15},
                    { layerName: 'l2', animationStartFrame: 30},
                    { layerName: 'l1', animationStartFrame: 45},
                    { layerName: 'l4', animationStartFrame: 60},
                    { layerName: 'l5', animationStartFrame: 30},
                    { layerName: 'l6', animationStartFrame: 40},
                    { layerName: 'l7', animationStartFrame: 55, noOneFrame: true},
                    { layerName: 'l8', animationStartFrame: 70, noOneFrame: true},
                    { layerName: 'l9', animationStartFrame: 85, noOneFrame: true},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(GraveyardMorningScene.models.treeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)

                        let animationStartFrame = p.animationStartFrame + aniStart;

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        if(!p.noOneFrame) {
                            for(let i = 0; i < oneFrame; i++){
                                let index = animationStartFrame + totalAnimationFrames + oneFrameDelay + i;
    
                                if(index > (totalFrames-1)){
                                    index-=totalFrames;
                                }
    
                                framesIndexValues[index] = 1;
                            }
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
        }), layersData.tree.renderIndex + 1)
    }
}