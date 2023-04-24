class DuckScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'duck',
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
        let model = DuckScene.models.main;
        let duckImg = PP.createImage(model, { renderOnly: [ 'duck' ] })
        let globalDelayValue = 70;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg' ] })

                this.duck1Ani = this.addChild(new GO({
                    position: new V2(8,102),
                    size: this.size,
                    img: duckImg,
                    init() {
                        let yClamps = [0, -22];

                        let originalY = this.position.y;
                        let inOutLength = 30;
                        let delayLength = 30;
                        let totalFrames = inOutLength*2 + delayLength;

                        let globalDelay = globalDelayValue+globalDelayValue+globalDelayValue;

                        let yValues = [
                            ...easing.fast({from: yClamps[0], to: yClamps[1], steps: inOutLength, type: 'quad', method: 'inOut', round: 0}),
                            ...new Array(delayLength).fill(yClamps[1]),
                            ...easing.fast({from: yClamps[1], to: yClamps[0], steps: inOutLength, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        this.position.y = originalY + yValues[this.currentFrame0];
                        this.needRecalcRenderProperties = true;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            if(this.currentFrame < totalFrames) {
                                this.position.y = originalY + yValues[this.currentFrame];
                                this.needRecalcRenderProperties = true;
                            }

                            this.currentFrame++;
                            if(this.currentFrame == totalFrames+globalDelay){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                this.duck2Ani = this.addChild(new GO({
                    position: new V2(6,78),
                    size: this.size,
                    originalImgFlipped: createCanvas(this.size, (ctx, size, hlp) => {
                        //ctx.translate(size.x/2, 0);
                         ctx.scale(-1, 1);
                        ctx.translate(-size.x, 0);

                        ctx.drawImage(duckImg, 0, 0)
                    }),
                    init() {
                        let aClamps = [0, 1];
                        let xClamps = [10, 0];

                        let originalY = this.position.y;
                        let inOutLength = 30;
                        let delayLength = 30;
                        let totalFrames = inOutLength*2 + delayLength;

                        let aValues = [
                            ...new Array(globalDelayValue).fill(aClamps[0]),
                            ...easing.fast({from: aClamps[0], to: aClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                            //...new Array(delayLength).fill(aClamps[1]),
                            ...easing.fast({from: aClamps[1], to: aClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(globalDelayValue+globalDelayValue).fill(aClamps[0]),
                        ]

                        let xValues = [
                            ...new Array(globalDelayValue).fill(xClamps[1]),
                            ...easing.fast({from: xClamps[0], to: xClamps[1], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(delayLength).fill(xClamps[1]),
                            ...easing.fast({from: xClamps[1], to: xClamps[0], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(globalDelayValue+globalDelayValue).fill(xClamps[1]),
                        ]

                        this.frames = aValues.map((a, i) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = a;
                            ctx.drawImage(this.originalImgFlipped, xValues[i], 0)
                        }));


                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 1)

        this.room = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['room', 'room_d' ] })

                
            }
        }), 4)

        this.tv = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['tv' ] })
                this.lightZoneAni = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let mask = PP.createImage(model, { renderOnly: ['tv_light_zone' ] });
                        let imgs = easing.fast({from: 0.1, to: 0.4, steps: 6, type: 'linear', round: 2}).map(a => 
                            createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(createCanvas(V2.one, (ctx, size, hlp) => {
                                    hlp.setFillColor('rgba(255,255,255,' + a).dot(0,0);
                                }), 0, 0, size.x, size.y)

                                ctx.globalCompositeOperation = 'destination-in'

                                ctx.drawImage(mask, 0, 0)
                            })
                        )
                        
                        this.img = imgs[getRandomInt(0, imgs.length-1)];
                        let delay = getRandomInt(5,10);
                        this.currentFrame = 0;
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.currentFrame++;

                            if(this.currentFrame == delay){
                                this.currentFrame = 0;
                                this.img = imgs[getRandomInt(0, imgs.length-1)];
                                delay = getRandomInt(5,15);
                            }
                        })
                    }
                }))

                this.duck4Ani = this.addChild(new GO({
                    position: new V2(-80,78),
                    size: this.size,
                    originalImgFlipped: createCanvas(this.size, (ctx, size, hlp) => {
                        //ctx.translate(size.x/2, 0);
                         ctx.scale(-1, 1);
                        ctx.translate(-size.x, 0);

                        ctx.drawImage(duckImg, 0, 0)
                    }),
                    init() {
                        this.img = this.originalImgFlipped;
                        let mask = 
                        createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(model, { renderOnly: ['tv_screen_zone' ] }), 80, -78);
                        })
                        
                        let aClamps = [0, 1];
                        let xClamps = [20, 0, -20];

                        // let originalY = this.position.y;
                        let inOutLength = 30;
                        let delayLength = 30;
                        let totalFrames = inOutLength*2 + delayLength;

                        let aValues = [
                            ...new Array(globalDelayValue+globalDelayValue+globalDelayValue).fill(aClamps[0]),
                            ...easing.fast({from: aClamps[0], to: aClamps[1], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(delayLength).fill(aClamps[1]),
                            ...easing.fast({from: aClamps[1], to: aClamps[0], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                        ]

                        let xValues = [
                            ...new Array(globalDelayValue+globalDelayValue+globalDelayValue).fill(xClamps[1]),
                            ...easing.fast({from: xClamps[0], to: xClamps[1], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(delayLength).fill(xClamps[1]),
                            ...easing.fast({from: xClamps[1], to: xClamps[2], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                        ]

                        this.frames = aValues.map((a, i) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = a;
                            ctx.drawImage(this.originalImgFlipped, xValues[i], 0)

                            ctx.globalCompositeOperation = 'destination-in'
                            ctx.globalAlpha = 1;
                            ctx.drawImage(mask, 0, 0)
                        }));


                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 8)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['lamp' ] })
            }
        }), 8)

        this.furniture2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['furniture2' ] })

                this.duck3Ani = this.addChild(new GO({
                    position: new V2(75,75),
                    size: this.size,
                    originalImgDoubleSize: createCanvas(this.size, (ctx, size, hlp) => {
                         ctx.scale(2, 2);

                        ctx.drawImage(duckImg, 0, 0)
                    }),
                    init() {
                        
                        let ylamps = [52, 0];

                        let originalY = this.position.y;
                        let inOutLength = 30;
                        let delayLength = 30;
                        let totalFrames = inOutLength*2 + delayLength;

                    
                        let yValues = [
                            ...new Array(globalDelayValue+globalDelayValue).fill(ylamps[0]),
                            ...easing.fast({from: ylamps[0], to: ylamps[1], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(delayLength).fill(ylamps[1]),
                            ...easing.fast({from: ylamps[1], to: ylamps[0], steps: inOutLength, type: 'quad', method: 'inOut', round: 2}),
                            ...new Array(globalDelayValue).fill(ylamps[0]),
                        ]

                        this.frames = yValues.map((a, i) => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(this.originalImgDoubleSize, 0, yValues[i])
                        }));

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 9)

        this.chair = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['chair', 'chair_d' ] })
            }
        }), 12)
    }
}