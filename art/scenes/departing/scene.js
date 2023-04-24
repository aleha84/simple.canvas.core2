class DepartingScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            scrollOptions: {
                enabled: true,
                zoomEnabled: true,
                restrictBySpace: false,
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(158,200).mul(4),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'departing',
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
        let originalSize = new V2(160,200);
        let model = DepartingScene.models.main;
        let appSharedPP = PP.createNonDrawingInstance();
        let rgbColorPart = 'rgba(255,255,255,';

        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                let xClamps = [-1,1]
                SCG.viewport.camera.updatePosition(new V2(xClamps[0],0));

                let totalFrames = 150;
                let xValues = [
                    ...easing.fast({from: xClamps[0], to: xClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: xClamps[1], to: xClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                let xFrontalValues = [
                    ...easing.fast({from: xClamps[0]/4, to: xClamps[1]/4, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: xClamps[1]/4, to: xClamps[0]/4, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    SCG.viewport.camera.updatePosition(new V2(xValues[this.currentFrame],0));
                    this.parentScene.reflections.position.x = this.parentScene.sceneCenter.x + xFrontalValues[this.currentFrame];
                    this.parentScene.reflections.needRecalcRenderProperties = true;

                    this.parentScene.fg.position.x = this.parentScene.sceneCenter.x - xValues[this.currentFrame]/2;
                    this.parentScene.fg.needRecalcRenderProperties = true;
                })
            }
        }), 0)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })

                // this.l0 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size, 
                //     init() {
                //         let img = PP.createImage(model, { renderOnly: ['bgDetails_l1'] })

                //         let totalFrames = 450;
                //         //39 - 99
                //         let xChange = easing.fast({from: 0, to: 60, steps: totalFrames, type: 'linear', round: 0 });

                //         this.frames = [];
                //         for(let f = 0; f < totalFrames;f++) {
                //             this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 ctx.drawImage(img, -xChange[f], 0)
                //                 ctx.drawImage(img, -xChange[f] + 60, 0)
                //             })
                //         }

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                this.l1 = this.addChild(new GO({
                    position: new V2(0,-1),
                    size: this.size, 
                    init() {
                        let img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['bgDetaild_l2'] }),0 ,0)
                        })
                    

                        let totalFrames = 300;
                        //39 - 99
                        let xChange = easing.fast({from: 0, to: 60, steps: totalFrames, type: 'linear', round: 0 });

                        this.frames = [];
                        for(let f = 0; f < totalFrames;f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(img, -xChange[f], 0)
                                ctx.drawImage(img, -xChange[f] + 60, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['bgDetaild_l3'] }),0 ,0)
                        })
                    

                        let totalFrames = 150;
                        //39 - 99
                        let xChange = easing.fast({from: 0, to: 60, steps: totalFrames, type: 'linear', round: 0 });

                        this.frames = [];
                        for(let f = 0; f < totalFrames;f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(img, -xChange[f], 0)
                                ctx.drawImage(img, -xChange[f] + 60, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.l3_2 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size, 
                //     init() {
                //         let width = 80;
                //         let img = createCanvas(this.size, (ctx, size, hlp) => {
                //             //
                //             hlp.setFillColor('#102333')
                //             for(let x = 39; x < 39+width; x++) {
                //                 let height = getRandomInt(1, 4);
                //                 hlp.rect(x, 91+height, 1, 3)
                //             }
                //         })
                    

                //         let totalFrames = 100;
                //         //39 - 99
                //         let xChange = easing.fast({from: 0, to: width, steps: totalFrames, type: 'linear', round: 0 });

                //         this.frames = [];
                //         for(let f = 0; f < totalFrames;f++) {
                //             this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //                 ctx.drawImage(img, -xChange[f], 0)
                //                 ctx.drawImage(img, -xChange[f]+width, 0)
                //             })
                //         }

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

                this.l4 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {

                        let img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['bgDetaild_l4'] }),0 ,0)
                        })
                    

                        let totalFrames = 100;
                        //39 - 99
                        let xChange = easing.fast({from: 0, to: this.size.x, steps: totalFrames, type: 'linear', round: 0 });

                        this.frames = [];
                        for(let f = 0; f < totalFrames;f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(img, -xChange[f], 0)
                                ctx.drawImage(img, -xChange[f] + this.size.x, 0)
                            })
                        }

                        // this.frames = [
                        //     ...this.frames
                        // ]

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.reflections = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(-0.25,0)),
            size: originalSize.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(PP.createImage(model, { renderOnly: ['reflections'] }),0,0);
                }) 
            }
        }), 5)

        this.wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['wall'] })
            }
        }), 9)

        this.shtorki = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['shtorki_left', 'shtorki_right'] })
            }
        }), 10)

        this.details = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['details', 'details_d'] })

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        
                        let pointsData = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p'))
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData, itemFrameslength: 60, size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.dust = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDustFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        
                        let center = [new V2(113,119), new V2(30,130)];

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);
                        
                            let p = new V2(center[i%2==0 ? 0 : 1].x + getRandomInt(-20, 20), center[i%2==0 ? 0 : 1].y + getRandomInt(-25,25));
                            let xShift = getRandomInt(-5,5);
                            let yShift = getRandomInt(0,3);
                            let maxA = getRandom(0.05, 0.12);

                            let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                            let yShiftValues = easing.fast({from: 0, to: yShift, steps: totalFrames, type: 'linear', round: 0})
                            let aValues = [
                                ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                                ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                            ]

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    xShift: xShiftValues[f],
                                    yShift: yShiftValues[f],
                                    a: aValues[f]
                                };
                            }
                        
                            return {
                                p,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        if(itemData.frames[f].a) {
                                            hlp.setFillColor(rgbColorPart + itemData.frames[f].a + ')').dot(itemData.p.x + itemData.frames[f].xShift, itemData.p.y+ itemData.frames[f].yShift)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createDustFrames({ framesCount: 300, itemsCount: 150, itemFrameslength: [60,90], size: this.size});
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 15)

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0.5,0)),
            size: originalSize.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['fg'] })
            }
        }), 20)
    }
}