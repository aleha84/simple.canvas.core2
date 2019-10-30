class EpskaVerse1Part2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.globalYShift = 25;
        this.eyes = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 52+this.globalYShift),
            size: new V2(300, 103),
            init() {
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('red').rect(0,0,size.x, size.y)
                // })
                this.base = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.eyesCloseWithoutBlink)
                }))

                this.blink = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    //img: PP.createImage(SCG.epskaImageModels.verse1.eyesCloseWithoutBlink)
                    init() {
                        this.currentFrame = 0;
                        this.frames = PP.createImage(SCG.epskaImageModels.verse1.blinkFrames);
                        this.img = this.frames[0];
                    },
                    startAnimation() {
                        this.timer = this.regTimerDefault(200, () => {
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    },
                    stopAnimation() {
                        //this.img = this.frames[this.currentFrame];
                        this.unregTimer(this.timer);
                    }
                }))

                this.tears = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    //img: PP.createImage(SCG.epskaImageModels.verse1.eyesCloseWithoutBlink)
                    init() {
                        this.currentFrame = 0;
                        this.frames = PP.createImage(SCG.epskaImageModels.verse1.tearFrames);
                        this.img = this.frames[0];
                        
                    },
                    // stopAnimation() {
                    //     this.unregOnComplete = true;
                    //     //this.unregTimer(this.timer)
                    // }
                    startAnimation(callback) {
                        this.currentFrame = 0;
                        this.timer = this.regTimerDefault(100, () => {
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.unregTimer(this.timer);
                                callback();
                            }
                        })
                    }
                }))
            },
            startAnimation() {
                this.blink.startAnimation();
                this.tears.startAnimation(() => this.blink.stopAnimation());
            }
        }))

        this.text = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 20 + this.globalYShift),
            size: new V2(300, 50),
            // getPixels(img, size) {
            //     let ctx = img.getContext("2d");
            //     let  pixels = [];

            //     let imageData = ctx.getImageData(0,0,size.x, size.y).data;

            //     for(let i = 0; i < imageData.length;i+=4){
            //         if(imageData[i+3] == 0)            
            //             continue;

            //         let y = fastFloorWithPrecision((i/4)/size.x);
            //         let x = (i/4)%size.x;
            //         let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] 

            //         pixels[pixels.length] = { position: new V2(x,y), color };
            //     }
            //     return pixels;
            // },
            // toPixels(letters) {
            //     this.scale = 1;
            //     let topLeft = new V2(-this.size.x/2 + 30,-20);//new V2(-this.size.x/2, -this.size.y/2);
            //     let pixels = [];
            //     letters.forEach((l,i) => {
            //         pixels = [...pixels, 
            //             ...this.getPixels(l.img, l.size).map(p => {
            //             return {
            //                 size: new V2(1,1).mul(this.scale),
            //                 position: topLeft.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)).add(new V2(7*i, 0)),
            //                 color: p.color
            //             }
            //         })
            //         ]
            //     })

            //     this.pixels = [];

            //     pixels.forEach(pixel => {
            //         let pgo =  this.addChild(new GO({
            //             isVisible: false,
            //             position: pixel.position,
            //             size: pixel.size,
            //             img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
            //                 hlp.setFillColor(colors.rgbToString({value: pixel.color})).dot(0,0);
            //             })
            //         }))
            //         this.pixels[this.pixels.length] = pgo;
            //     });

            // },
            // startFadeOut() {
            //     let allx = this.pixels.map(p => p.position.x);
            //     let xChange = easing.createProps(50, Math.min.apply(null, allx), Math.max.apply(null, allx), 'linear', 'base');
            //     this.timer = this.regTimerDefault(30, () => {
            //         let currentX = easing.process(xChange);

            //         this.pixels.filter(p => !p.triggered && p.position.x <= currentX).forEach(p => {
            //             p.triggered = true;
            //             //p.renderValuesRound = true;
            //             //p.xChange = getRandomInt(1,3);
            //             p.regTimerDefault(15, function() {
            //                 //this.position.x+=this.xChange;
            //                 this.position.x+=0.1
            //                 this.needRecalcRenderProperties = true;
            //             })
            //             p.addEffect(new FadeOutEffect({effectTime: 200, updateDelay: 15, setParentDeadOnComplete: true, initOnAdd: true}))
            //         })

            //         xChange.time++;
            //         if(xChange.time > xChange.duration){
            //             this.unregTimer(this.timer);
            //         }
            //     })
            // },
            init() {
                this.bg = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#EAF5F8').rect(0,0,size.x, size.y)
                    })
                }))

                this.letters = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.textStart = new V2(60,26)
                        this.particlesEnabled = true;
                        this.rgb = {r: 5, g: 13, b: 14};
                        this.letterAppearCounter = 10;
                        this.letterAppear = 50;
                        this.currentText = 'She is gone with a black wind';
                        this.textLines = ['She is gone with a black wind', 'She would not come back' ];
                        this.currentLineIndex = 0;
                        this.lettersLines = this.textLines.map(line => (
                            Array.prototype.map.call(line, (l) => ({
                                a: 0,
                                xShift: -10,
                                text: l,
                                limg: PP.createText({text: l, color: `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},${1})`, size: 5})
                            }))
                        ));

                        this.currentLetters = this.lettersLines[this.currentLineIndex];
                        // = Array.prototype.map.call(this.currentText, (l) => ({
                        //     a: 0,
                        //     xShift: -10,
                        //     text: l,
                        //     limg: PP.createText({text: l, color: `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},${1})`, size: 5})
                        // }));

                        //this.parent.toPixels(this.currentLetters.map(l => l.limg));

                        this.windParticles = [];
                        this.windParticlesProps = {
                            time: 95,
                            xClamps: [this.textStart.x-40, this.textStart.x+220]
                        }

                        let wpProps = this.windParticlesProps;
                        this.timer = this.regTimerDefault(15, () => {
                            if(this.delay )
                                return;
                            
                            if(this.particlesEnabled){
                                let yStart = this.textStart.y+2+ getRandomInt(-10,10)
                                let yTarget = this.textStart.y+2+ getRandomInt(-10,10);
                                this.windParticles.push({
                                a: 0,
                                x: 30, y: yStart,
                                yShift: 0,
                                yDelta: 0,
                                yChange: easing.createProps(wpProps.time, yStart, yTarget, 'quad', 'inOut'),
                                xChange: easing.createProps(wpProps.time, wpProps.xClamps[0], wpProps.xClamps[1], 'linear', 'base', function() { this.alive = false }),
                                aChange: easing.createProps(wpProps.time/2, 0, 1, 'quad', 'in', function() { this.aChange = easing.createProps(wpProps.time/2, 1, 0, 'quad', 'out') }),

                                yShiftChange: {a: getRandom(0.1, 0.25), b:getRandom(1,1.5), fun: function(time) { return Math.sin(time*this.a)*this.b}},
                                alive: true,
                            })
                            }
                            

                            if(this.letterAppearCounter != undefined && this.letterAppearCounter-- == 0){
                                this.letterAppearCounter = 2;
                                let nextToAppear = this.currentLetters.filter(cl => !cl.aChange);
                                if(nextToAppear.length > 0){
                                    nextToAppear[0].aChange = easing.createProps(this.letterAppear, 0, 1, 'quad', 'in');
                                    nextToAppear[0].xShiftChange = easing.createProps(this.letterAppear/2, -10, 0, 'quad', 'out');

                                    if(nextToAppear.length == 1){
                                        nextToAppear[0].aChange.onComplete = () => { 
                                            console.log('fade in done');
                                            this.letterAppearCounter = undefined;
                                            this.letterDisappearCounter = 2;

                                            this.currentLetters.forEach(cl => {
                                                cl.aChange = undefined;  
                                                cl.xShiftChange = undefined;
                                            })
                                            // this.currentLetters = [];
                                            // this.parent.pixels.forEach(p => p.isVisible = true);
                                            // this.parent.startFadeOut();
                                        }
                                    }
                                }
                            }

                            if(this.letterDisappearCounter != undefined && this.letterDisappearCounter-- == 0){
                                this.letterDisappearCounter = 3;
                                let nextToDisappear = this.currentLetters.filter(cl => !cl.aChange);
                                if(nextToDisappear.length > 0){
                                    nextToDisappear[0].aChange = easing.createProps(this.letterAppear, 1, 0, 'quad', 'in');
                                    nextToDisappear[0].xShiftChange = easing.createProps(this.letterAppear, 0, 10, 'quad', 'in');
                                    this.particlesEnabled = nextToDisappear.length > this.currentLetters.length/2;

                                    if(nextToDisappear.length == 1){
                                        nextToDisappear[0].aChange.onComplete = () => { 
                                            console.log('fade out done');
                                            this.startLettersAppearance();
                                        }
                                    }
                                }
                            }

                            for(let i = 0; i < this.currentLetters.length; i++){
                                let cl = this.currentLetters[i];

                                if(cl.aChange){
                                    if(cl.aChange.time <= cl.aChange.duration){
                                        cl.a = easing.process(cl.aChange);
                                        cl.aChange.time++;
                                    }
                                    else {
                                        if(cl.aChange.onComplete){
                                            cl.aChange.onComplete();
                                            if(cl.aChange)
                                                cl.aChange.onComplete = undefined;
                                        }
                                    }

                                    if(cl.xShiftChange)
                                        if(cl.xShiftChange.time < cl.xShiftChange.duration){
                                            cl.xShift = easing.process(cl.xShiftChange);
                                            cl.xShiftChange.time++;
                                        }
                                }
                            }

                            for(let i = 0; i < this.windParticles.length; i++){
                                let wp = this.windParticles[i];

                                easing.commonProcess({context: wp, targetpropertyName: 'x', propsName: 'xChange', round: true, callbacksUseContext: true})
                                easing.commonProcess({context: wp, targetpropertyName: 'y', propsName: 'yChange', round: true, callbacksUseContext: true})
                                easing.commonProcess({context: wp, targetpropertyName: 'a', propsName: 'aChange', callbacksUseContext: true})
                                easing.commonProcess({context: wp, targetpropertyName: 'yDelta', propsName: 'yDeltaChange', round: true, callbacksUseContext: true})

                                if(wp.xChange)
                                    wp.yShift = fast.r(wp.yShiftChange.fun(wp.xChange.time));
                            }

                            this.windParticles = this.windParticles.filter(wp => wp.alive);

                            this.createImage();
                        })
                    },
                    startLettersAppearance() {

                        this.particlesEnabled = true;
                        this.letterAppearCounter = 2;
                        this.letterDisappearCounter = undefined;
                        this.currentLineIndex++;
                        if(this.currentLineIndex == this.lettersLines.length){
                            this.currentLineIndex = 0;
                            this.parent.parentScene.eyes.startAnimation();
                            this.delay = true;
                            this.delayTimer =this.registerTimer(createTimer(2000, () => {
                                this.unregTimer(this.delayTimer);
                                this.delay = false;
                                this.delayTimer = undefined;
                            }, this, false));
                        }

                        this.currentLetters = this.lettersLines[this.currentLineIndex];

                        this.currentLetters.forEach(cl => {
                            cl.aChange = undefined;  
                            cl.xShiftChange = undefined;
                        })

                    },
                    createImage() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            this.currentLetters.forEach((cl,i) => {
                                ctx.globalAlpha = cl.a;
                                ctx.drawImage(cl.limg.img, this.textStart.x + 7*i + cl.xShift, this.textStart.y)
                                ctx.globalAlpha = 1;
                            });

                            for(let i = 0; i < this.windParticles.length; i++){
                                let wp = this.windParticles[i];
                                ctx.globalAlpha = wp.a;
                                hlp.setFillColor('black').dot(wp.x, wp.y + wp.yShift + wp.yDelta);
                                ctx.globalAlpha = 1;
                            }
                        })
                    }
                }))
            }
        }))

        this.frames = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0, this.globalYShift)),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('white').strokeRect(0,0,size.x, size.y-55,4)
                    .rect(0,size.y/2, size.x, 4)
//#C1C9CC
                    hlp.setFillColor('rgba(0,0,0,0.1)').rect(4,size.y/2+4, size.x-8, 3 ).rect(4,size.y/2+4, size.x-8,1).rect(4,size.y/2+7,1,34 ).rect(size.x-5,size.y/2+7,1,34 ).rect(5,size.y/2+40,size.x-10,1 )
                })
            }
        }), 2)
    }
}