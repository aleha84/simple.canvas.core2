class DrunkDetectiveScene extends Scene {
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
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'detective'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, -0.5)),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(DrunkDetectiveScene.models.bg, { exclude: ['l1'] })

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 196, itemFrameslength: 100, size: this.size, 
                            pointsData: animationHelpers.extractPointData(DrunkDetectiveScene.models.bg.main.layers.find(l => l.name == 'p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let signPoints = animationHelpers.extractPointData(DrunkDetectiveScene.models.bg.main.layers.find(l => l.name == 'l1'))

                        let frames = [];
                          
                        let totalFrames1 = 50;
                        let yChange1 = easing.fast({ from: -5, to: 0, type: 'quad', method: 'out', steps: totalFrames1, round: 0 })
                        let yChange2 = easing.fast({ from: 0, to: 5, type: 'quad', method: 'in', steps: totalFrames1, round: 0 })
                        let itemsData = signPoints.map((el, i) => {
                            let startFrameIndex = getRandomInt(20, 40);
                            let totalFrames = totalFrames1;

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                // if(frameIndex > (framesCount-1)){
                                //     frameIndex-=framesCount;
                                // }
                        
                                frames[frameIndex] = {
                                    yShift: yChange1[f]
                                };
                            }

                            for(let f = 0; f < totalFrames1; f++){
                                let _f = f + startFrameIndex + totalFrames1;
                                frames[_f] = {
                                    yShift: 0
                                };
                            }

                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex+totalFrames1*2;
                                // if(frameIndex > (framesCount-1)){
                                //     frameIndex-=framesCount;
                                // }
                        
                                frames[frameIndex] = {
                                    yShift: yChange2[f]
                                };
                            }

                            for(let f = startFrameIndex+totalFrames1*3; f < 196; f++){
                                frames[f] = undefined
                            }
                        
                            return {
                                point: el.point,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < 196; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor('#4f060c');
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.dot(itemData.point.x, itemData.point.y + itemData.frames[f].yShift)
                                    }
                                    
                                }
                            });
                        }

                        this.frames = frames;

                        this.registerFramesDefaultTimer({});

                        // let yToPoints = [];
                        // signPoints.forEach(p => {
                        //     if(!yToPoints[p.point.y]){
                        //         yToPoints[p.point.y] = [];
                        //     }

                        //     yToPoints[p.point.y].push(p.point);
                        // })
                    }
                }))
            }
        }), 1)

        this.guy = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 113),
            frames: PP.createImage(DrunkDetectiveScene.models.guy), 
            init() {
                let loopFramesIndex = 41
                this.frames = [
                    //...new Array(5).fill(this.frames[1]),
                    ...this.frames.filter((_, i) => i <= loopFramesIndex),
                    ...this.frames,
                ]

                let repeat = 3;
                this.registerFramesDefaultTimer({debug: true, originFrameChangeDelay: 8, 
                    framesChangeCallback: () => {
                        let a = 10;
                    },
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }});
                // this.img = PP.createImage(DrunkDetectiveScene.models.guy)[0]
            }
        }), 10)
    }
}