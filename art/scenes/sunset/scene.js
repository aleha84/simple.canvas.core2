class SunsetScene extends Scene {
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
                size: new V2(200,150).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'sunset',
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
        let model = SunsetScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg', 'bg_d'] })
            }
        }), 1)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['house'] })

                
                let wCounter = 0;
                this.windows = SunsetScene.models.windows.main.layers.map(l => 
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {

                            if(l.name.startsWith('l')) {
                                this.frames = this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: [30,50], size: this.size, 
                                    pointsData: animationHelpers.extractPointData(l)
                                });

                                this.registerFramesDefaultTimer({});
                            }
                            else if(l.name.startsWith('w')) {
                                this.img = PP.createImage(SunsetScene.models.windows, { renderOnly: [l.name] });
                                
                                wCounter++;
                                let wIndex = wCounter;
                                let fShift = getRandomInt(-50,50);
                                this.isVisible = false;

                                this.currentFrame = 0;
                        
                                this.timer = this.regTimerDefault(10, () => {

                                    this.isVisible = (this.currentFrame > wIndex*150 && this.currentFrame < (wIndex*150+300-fShift))

                                    this.currentFrame++;
                                    if(this.currentFrame == 800){
                                        this.currentFrame = 0;
                                        this.parent.parentScene.capturing.stop = true;
                                    }
                                })
                            }
                        }
                    }
                )))
                 
            }
        }), 20)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames({ totalFrames, layerName, xShift, delta = new V2() }) {
                let frames = [];
                let img = PP.createImage(model, { renderOnly: [layerName] });
                let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                let t_3 = fast.r(totalFrames/3);
                // let aValues = [
                //     ...easing.fast({ from: 0, to: 1, steps: totalFrames/4, type: 'linear', method: 'base', round: 1}),
                //     ...new Array(totalFrames/2).fill(1),
                //     ...easing.fast({ from: 1, to: 0, steps: totalFrames/4, type: 'sin', method: 'in', round: 1}),
                // ]
                let aValues = [
                    ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'out', round: 2}),
                    ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'in', round: 2})
                ]

                this.mainFr = [];
                for(let f = 0; f < totalFrames; f++){
                    this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = aValues[f];
                        ctx.drawImage(img, xChange[f], 0);
                    })
                }

                let startFrameIndex = totalFrames/4;
                let startFrameIndex2 = totalFrames*2/4;
                let startFrameIndex3 = totalFrames*3/4;
                for(let f = 0; f < totalFrames; f++){

                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (totalFrames-1)){
                        frameIndex-=totalFrames;
                    }

                    let frameIndex2 = f + startFrameIndex2;
                    if(frameIndex2 > (totalFrames-1)){
                        frameIndex2-=totalFrames;
                    }

                    let frameIndex3 = f + startFrameIndex3;
                    if(frameIndex3 > (totalFrames-1)){
                        frameIndex3-=totalFrames;
                    }

                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mainFr[f], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex2], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[frameIndex3], delta.x, delta.y);
                    })
                }

                return frames;
            },
            init() {
                let totalFrames = 400
                var lData = [
                    {
                        layerName: 'clouds_01',
                        totalFrames,
                        xShift: -10,
                        startFrameIndex: 0
                    },
                    {
                        layerName: 'clouds_05',
                        totalFrames,
                        xShift: -10,
                        startFrameIndex: 100,
                        delta: new V2(8,0)
                    },
                    {
                        layerName: 'clouds_02',
                        totalFrames,
                        xShift: -10,
                        startFrameIndex: 200,
                        delta: new V2(8,0)
                    },
                    {
                        layerName: 'clouds_03',
                        totalFrames,
                        xShift: -8,
                        startFrameIndex: 300,
                        delta: new V2(11,0)
                    },
                    {
                        layerName: 'clouds_04',
                        totalFrames,
                        xShift: -8,
                        startFrameIndex: 0
                    },
                    {
                        layerName: 'clouds_06',
                        totalFrames,
                        xShift: -8,
                        startFrameIndex: 150,
                        delta: new V2(8,0)
                    },
                    {
                        layerName: 'clouds_07',
                        totalFrames,
                        xShift: -8,
                        startFrameIndex: 200
                    },
                    {
                        layerName: 'clouds_08',
                        totalFrames,
                        xShift: -8,
                        startFrameIndex: 50,
                        delta: new V2(8,0)
                        
                    },
                    {
                        layerName: 'clouds_09',
                        totalFrames,
                        xShift: -10,
                        startFrameIndex: 200
                    },
                    {
                        layerName: 'clouds_10',
                        totalFrames,
                        xShift: -10,
                        startFrameIndex: 100
                    },
                ]

                lData.map(ld => this.addChild(new GO({
                    position: new V2().add(ld.translate ? ld.translate : new V2()),
                    size: this.size,
                    frames: this.createFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            // framesEndCallback: () => {
                            //     if(ld.startFrameIndex == 0) {
                            //         this.parent.parentScene.capturing.stop = true;
                            //     }
                                
                            // }
                        });
                    }
                })))
            }
        }), 10) 

        this.birds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBirdsFrames: ({ totalFrames = 400, y= 83, size }) => {
                //let totalFrames = 400;
                let xValues = easing.fast({from: 0, to: size.x + 10, steps: totalFrames, type: 'linear', round: 0})
                //let y = 83; 

                let _c = 'rgba(80,38,50,';

                let frames = [];

                let bData = [ 
                    {
                        shift: new V2(), a: [0.5, 0.4, 0.2, 0.3]
                    },
                    // {
                    //     shift: new V2(-5, 1), a: [0.4, 0.3, 0.1, 0.2]
                    // }
                ]

                let yShiftFun = (x, a = 5, b =1) => Math.sin(x/a)*b;

                for(let f = 0; f < totalFrames; f++) {
                    let x = xValues[f];

                    frames[f] = createCanvas(size, (ctx, size, hlp) => {

                        bData.forEach(bd => {
                            let yShift2 =  fast.r(yShiftFun(f, 20));
                            let mainY = y+yShift2+bd.shift.y;
                            hlp.setFillColor( _c + `${bd.a[0]})`).dot(x+bd.shift.x,mainY);
    
                            let yShift =  fast.r(yShiftFun(f,10));
    
                            //hlp.setFillColor( _c + `${bd.a[1]})`).dot(x+1+bd.shift.x,mainY);
                            hlp.setFillColor( _c + `${bd.a[2]})`).dot(x-1+bd.shift.x,mainY);
    
                            if(yShift < 0)
                                yShift = 0;
    
                            hlp.setFillColor( _c + `${bd.a[3]})`).dot(x+bd.shift.x,mainY+yShift);
                        })

                        
                    })
                }

                return frames;
            },
            init() {
                this.b1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = [
                            ...new Array(200).fill(),
                            ...this.parent.createBirdsFrames({ totalFrames: 400, size: this.size }),
                            ...new Array(200).fill(),
                        ]
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.b2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = [
                            ...new Array(50).fill(),
                            ...this.parent.createBirdsFrames({ totalFrames: 300, size: this.size, y: 86 }),
                            ...new Array(450).fill(),
                        ]
                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), 15)
    }
}