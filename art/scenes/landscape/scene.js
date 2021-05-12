class LandscapeScene extends Scene {
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
        let model = LandscapeScene.models.main;
        let that = this;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                
            }
        }), 0)

        let globalYShift = 3;

        this.green = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 125)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['green', 'green_d'] }),
            startAnimation() {
                let totalFrames = 40;
                let outFramesCount = 35;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y-globalYShift, steps: outFramesCount, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.targetPosition.y-globalYShift, to: this.targetPosition.y, steps: inFramesCount, type: 'quad', method: 'in', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;

                        that.right_mountain.startAnimation();
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 20)

        this.right_mountain = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(110, 2*globalYShift)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['right_mountain'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 60;
                let outFramesCount = 50;
                let inFramesCount = totalFrames-outFramesCount;
                let xValues = [
                    ...easing.fast({ from: this.position.x, to: this.targetPosition.x, steps: outFramesCount, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.targetPosition.x, to: this.targetPosition.x+globalYShift, steps: inFramesCount, type: 'quad', method: 'in', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;

                    if(this.currentFrame == 10) {
                        that.left_mountain.startAnimation();
                    }

                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        that.road.startAnimation();
                        return;
                    }

                    this.position.x = xValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 10)

        this.left_mountain = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-110, 2*globalYShift)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['left_mountain'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 60;
                let outFramesCount = 50;
                let inFramesCount = totalFrames-outFramesCount;
                let xValues = [
                    ...easing.fast({ from: this.position.x, to: this.targetPosition.x, steps: outFramesCount, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.targetPosition.x, to: this.targetPosition.x-globalYShift, steps: inFramesCount, type: 'quad', method: 'in', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;

                    if(this.currentFrame == 40) {
                        that.far_mountains.startAnimation();
                    }

                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        return;
                    }

                    this.position.x = xValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 10)

        this.far_mountains = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 125)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, 3*globalYShift)),
            img: PP.createImage(model, { renderOnly: ['far_mountains'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 50;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y-globalYShift, steps: outFramesCount, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.targetPosition.y-globalYShift, to: this.targetPosition.y, steps: inFramesCount, type: 'quad', method: 'in', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;

                    if(this.currentFrame == 40){
                        that.sky.startAnimation();
                    }

                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 8)

        this.sky = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 125)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, 3*globalYShift)),
            img: PP.createImage(model, { renderOnly: ['sky'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 50;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y-globalYShift, steps: outFramesCount, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.targetPosition.y-globalYShift, to: this.targetPosition.y, steps: inFramesCount, type: 'quad', method: 'in', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 5)


        this.road = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, globalYShift)),
            size: this.viewport.clone(),
            originalImage: PP.createImage(model, { renderOnly: ['road'] }),
            startAnimation() {
                let yFrom = 199;
                let yTo = 95;

                let totalFrames = 120;


                //131
                let yValues = [
                    ...easing.fast({ from: yFrom, to: 131, steps: 60, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: 131, to: yTo, steps: 60, type: 'quad', method: 'inOut', round: 0 })
                ];

                this.frames = [];

                for(let i = 0; i < totalFrames; i++){
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        let y = yValues[i];

                        hlp.setFillColor('red').rectFromTo({x: 0, y}, { x: size.x, y: yFrom });
                        ctx.globalCompositeOperation = 'source-in';
                        ctx.drawImage(this.originalImage, 0,0);
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame]

                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;

                        that.house1.startAnimation();
                        that.grassAnimation.startAnimation();

                        return;
                    }

                   this.img = this.frames[this.currentFrame]
                })
            },
            init() {
                //this.startAnimation();


            }
        }), 21)

        this.house1 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['house1'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;

                    if(this.currentFrame == 10){
                        that.house2.startAnimation();
                    }
                    if(this.currentFrame == 15){
                        that.house3.startAnimation();
                    }
                    if(this.currentFrame == 20){
                        that.house4.startAnimation();
                    }

                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 19)

        this.house2 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['house2'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 18)

        this.house3 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['house3'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 17)

        this.house4 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['house4'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;

                    if(this.currentFrame == 10){
                        that.house5.startAnimation();
                    }
                    if(this.currentFrame == 15){
                        that.house6.startAnimation();
                    }

                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 16)

        this.house5 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['house5'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 15)

        this.house6 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 30)),
            size: this.viewport.clone(),
            targetPosition: this.sceneCenter.add(new V2(0, globalYShift)),
            img: PP.createImage(model, { renderOnly: ['hause6'] }),
            isVisible: false,
            startAnimation() {
                this.isVisible = true;
                let totalFrames = 30;
                let outFramesCount = 45;
                let inFramesCount = totalFrames-outFramesCount;
                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.targetPosition.y, steps: totalFrames, type: 'quad', method: 'out', round: 0 })
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        
                        return;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            },
            init() {
                
            }
        }), 14)

        this.grassAnimation = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, globalYShift)),
            size: this.viewport.clone(),
            startAnimation() {
                let targetColors = ['#9f890f', '#7c850d', '#686f0d', '#1d350e', '#27450c', '#446b0a', '#58810a']
                let t = PP.createImage(model, { renderOnly: ['green', 'green_p', 'road'] });
                let pixelsData = getPixels(t, this.size);

                let yClamps = [120, 199];
                let randValues = easing.fast({ from: 15, to: 3, steps: yClamps[1] - yClamps[0], type: 'quad', method: 'out', round: 0 })

                let pData = [];
                pixelsData.forEach(pd => {
                    if(pd.position.y < yClamps[0])
                        return;

                    let randMaxValue = randValues[pd.position.y-yClamps[0]];
                    if(getRandomInt(0, randMaxValue) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.add(new V2(0, -1)), color } 
                        }
                    }
                });


                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, pointsData: pData, itemFrameslength: 50, size: this.size })

                this.registerFramesDefaultTimer({});
            },
            init() {
             //getPixels   
            }
        }), 22)

        this.green.startAnimation();

        
    }
}