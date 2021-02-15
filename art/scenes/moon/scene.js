class MoonScene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(1200,1200),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'moon'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.switch = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible: false,
            createSwitchFrames({closeOpenFramesLength, pauseLength, size}) {
                let frames = [];
                
                let widthChangeValues = [
                    ...easing.fast({ from: 1, to: size.x/2, steps: closeOpenFramesLength, type: 'quad', method: 'out', round: 0}),
                    ...new Array(pauseLength).fill(size.x/2),
                    ...easing.fast({ from: size.x/2, to: 1, steps: closeOpenFramesLength, type: 'quad', method: 'in', round: 0}),
                ]

                let totalFrames = closeOpenFramesLength*2 + pauseLength;
                for(let f = 0; f < totalFrames; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let w = widthChangeValues[f];

                        hlp.setFillColor('black')
                        .rect(0,0,w, size.y)
                        .rect(size.x-w,0, w, size.y)
                    });
                }
                
                return frames;
            },
            startAnimation(startFrom) {
                this.isVisible = true;
                this.registerFramesDefaultTimer({
                    startFrameIndex: startFrom || 0,
                    framesChangeCallback: () => {
                        if(this.shouldStopRecording && this.currentFrame == 25) {
                            this.parentScene.capturing.stop = true;
                        }
                    },
                    framesEndCallback: () => {
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        this.isVisible = false; 
                    }
                });
            },
            init() {
                this.frames = this.createSwitchFrames({ closeOpenFramesLength: 20, pauseLength: 10, size: this.size });
                this.startAnimation(25);
            }
        }), 10)

        //far view

        this.far = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(MoonScene.models.main),
            startAnimation() {
                this.isVisible = true;

                this.registerFramesDefaultTimer({ 
                    originFrameChangeDelay: 10,
                    framesChangeCallback: () => {
                        if(this.currentFrame == this.frames.length-2) {
                            this.parentScene.switch.startAnimation();
                        }
                    },
                    framesEndCallback: () => {
                        this.unregTimer(this.timer);
                        this.timer = undefined;

                        this.isVisible = false;

                        this.parentScene.close.startAnimation();
                    }
                });
            },
            init() {
                this.startAnimation();
                //this.parentScene.switch.startAnimation(25);
            }
        }))

        // zoom in

        //close view

        // zoom out

        this.close = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;

                this.plane.startAnimation();
                this.trail1.startAnimation();
                this.trail2.startAnimation();
            },
            init() {
                let model = MoonScene.models.close;

                this.moon = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    img: PP.createImage(model, {renderOnly: ['bg', 'moon', 'moon_d', 'moon_d1']}),
                    init() {
                        this.p = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 75, size: this.size, 
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'moon_p')) });
        
                                this.registerFramesDefaultTimer({});
                            }
                        })) 
                    }
                }))

                let createTrailFrames = function({framesCount, itemsCount, itemFrameslength, size, p1, p2}) {
                    let frames = [];
                    
                    let startFrame = 130;

                    let targetLinePoints = [];
                    createCanvas(new V2(1,1), (ctx, _size, hlp) => {
                        targetLinePoints = new PP({ctx}).lineV2(new V2(0, 90), new V2(size.x, 86)).map(p => new V2(p))
                    })

                    let pointStartFrameValues = easing.fast({ from: startFrame, to: framesCount, steps: targetLinePoints.length, type: 'linear', round: 0});

                    let itemsData = [];

                    for(let i = 0; i < targetLinePoints.length-1; i++){
                        let pOriginal = targetLinePoints[i];
                        let pointStartFrameOriginal = pointStartFrameValues[i]-30;

                        for(let ic = 0; ic < 20; ic++){
                            let pointStartFrame = pointStartFrameOriginal + ic*10 + getRandomInt(-3,3);

                            let p = pOriginal.add(new V2(getRandomInt(-1,1), getRandomInt(-2,0)))
                            let o = fast.r(getRandom(0.05, 0.1),2)
                            let d = V2.down.rotate(getRandomInt(90,80));
                            let ds = getRandom(0.05, 0.1);
                            let ss = getRandom(0.005, 0.01);
                            itemsData.push({
                                p, 
                                o,
                                ss,
                                d, ds,
                                s: 1,
                                pointStartFrame
                            })
                        }

                        
                    }

                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {

                            // let pp = new PP({ctx});

                            // pp.setFillStyle('red')
                            // pp.lineV2(new V2(0, 90), new V2(size.x, 86));

                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(f > itemData.pointStartFrame){

                                    itemData.p = itemData.p.add(itemData.d.mul(itemData.ds));
                                    itemData.s = itemData.s + itemData.ss;
                                    hlp.setFillColor(`rgba(0,0,0,${itemData.o})`).rect(fast.r(itemData.p.x), fast.r(itemData.p.y), fast.r(itemData.s), fast.r(itemData.s))
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                }

                let trailFrames = createTrailFrames({ framesCount: 300, itemsCount: 10, itemFrameslength: 10, size: this.size })

                this.trail1 = this.addChild(new GO({ 
                    position: new V2(0, 0),
                    size: this.size,
                    startAnimation() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.unregTimer(this.timer);
                                this.timer = undefined;
                            }
                        });
                    },
                    init() {
                        this.frames = trailFrames;
                    }
                }))

                this.trail2 = this.addChild(new GO({ 
                    position: new V2(-20, -5),
                    size: this.size,
                    startAnimation() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.unregTimer(this.timer);
                                this.timer = undefined;
                            }
                        });
                    },
                    init() {
                        this.frames = trailFrames;
                    }
                }))

                this.plane = this.addChild(new Go({
                    position: new V2(),
                    size: this.size, 
                    img: PP.createImage(model, {renderOnly: ['plane']}),
                    startAnimation() {
                        this.currentFrame = 0;
                        this.position = this.lineDots[this.dotsIndexValues[this.currentFrame]];
                        this.needRecalcRenderProperties = true;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;

                            if(this.currentFrame == 280) {
                                this.parent.parentScene.switch.startAnimation();
                                this.parent.parentScene.switch.shouldStopRecording = true;
                            }

                            if(this.currentFrame == this.totalFrames){
                                this.currentFrame = 0;

                                this.unregTimer(this.timer);
                                this.timer = undefined;

                                this.parent.isVisible = false;
                                this.parent.parentScene.far.startAnimation();
                            }

                            this.position = this.lineDots[this.dotsIndexValues[this.currentFrame]];
                            //this.position = new V2(75,0);
                            this.needRecalcRenderProperties = true;
                        })
                    },
                    init() {
                        let from = new V2(-this.size.x, 0);
                        let to = new V2(this.size.x, -2);
                        this.lineDots = [];
                        createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            this.lineDots = new PP({ctx}).lineV2(from, to).map(d => new V2(d));
                        })

                        this.totalFrames = 300;
                        this.dotsIndexValues = easing.fast({from: 0, to: this.lineDots.length-1, steps: this.totalFrames, type: 'linear', round: 0});
                        //this.startAnimation();
                    },

                }))
                //
            }
        }), 1)
    }
}