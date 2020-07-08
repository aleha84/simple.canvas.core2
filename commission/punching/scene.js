class PunchingScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'punching'
            },
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('white').dot(0,0);
            })
        }), 1)

        this.star = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarFrames({framesCount, itemFrameslength, size}) {
                let frames = [];
                
                let cornerEdges = [
                    new V2(6,74), new V2(34,56), new V2(23,51), new V2(39,47), new V2(29,25), new V2(45,39), new V2(45,22), new V2(59,34),
                     new V2(79,14), new V2(83, 36), new V2(92,23), new V2(92,38), new V2(118, 33), new V2(109,46), new V2(144, 51), new V2(121,61), new V2(134,70),
                    new V2(75,85)
                ];

                let center = size.divide(2).toInt();
                let sharedPP = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                let animationStart = 52;
                //let animationClamps = [animationStart, animationStart+itemFrameslength];
                // if(animationClamps[1] > (framesCount-1)){
                //     animationClamps[1]-=framesCount;
                // }

                let itemsData = new Array(cornerEdges.length).fill().map((el, i) => {
                    //let startFrameIndex = 0;//48;
                    let startFrameIndex = 52;
                    
                    let totalFrames = framesCount;
                
                    let target = cornerEdges[i];
                    let direction = center.direction(target);
                    let distance = center.distance(target);

                    let start = center.add(direction.mul(distance/2)).toInt();
                    let linePoints = sharedPP.lineV2(start, target);
                    let indexValues = [
                        ...easing.fast({from: 0, to: linePoints.length-1, steps: fast.r(framesCount*1/4), type: 'expo', method: 'out'}).map(v => fast.r(v)),
                        ...easing.fast({from: linePoints.length-2, to: 0, steps: framesCount-fast.r(framesCount*1/4), type: 'sin', method: 'inOut'}).map(v => fast.r(v))]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        // let p = linePoints[0];
                        // if(frameIndex > animationClamps[0] && frameIndex < animationClamps[1]){
                        //     p = linePoints[indexValues[f-animationClamps[0]]]
                        // }

                        // frames[frameIndex] = {
                        //     p
                        // };

                        frames[frameIndex] = {
                            p: linePoints[indexValues[f]]
                        };
                    }
                
                    return {
                        frames,
                        linePoints,
                        indexValues
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx})
                        let corners = [];
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                corners.push(itemData.frames[f].p)
                            }
                            
                        }

                        pp.setFillStyle('#FFCD34');
                        pp.fillByCornerPoints(corners);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarFrames({framesCount: 124, itemFrameslength: 50, size: this.size})

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 3)

        this.boxer = this.addGo(new GO({
            position: new V2(this.viewport.x/2, 42),
            size: new V2(150,60),
            frames: PP.createImage(PunchingScene.models.boxerFrames),
            init() {
                //124 in total
                //let framesCounter = 0;
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 4;
                this.timer = this.regTimerDefault(10, () => {
                
                    //framesCounter++;
                    if(--delay > 0){
                        return;
                    }

                    delay = 4;

                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        //.log('boxer total timer fires: ' + framesCounter)
                    }
                })
            }
        }), 5)

        this.letters = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(PunchingScene.models.letters),
            init() {
              this.main = this.addChild(new GO({
                  position: new V2(),
                  size: this.size,
                  img: PP.createImage(PunchingScene.models.letters, { renderOnly: ['bg', 'bbb'] })
              }))  

              this.lettersAnimated = this.addChild(new GO({
                position: new V2(),
                size: this.size,
                createLettersFrames({framesCount, itemFrameslength, size}) {
                    let lettersImages = [
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['P'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['U'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['N'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['C'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['H'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['I'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['N2'] }),
                        PP.createImage(PunchingScene.models.letters, { renderOnly: ['G'] }),
                    ]

                    let yChangeValues = [
                        ...easing.fast({from: 0, to: 4, steps: itemFrameslength/2, type: 'quad', method: 'out'}).map(v => fast.r(v)),
                        ...easing.fast({from: 4, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'in'}).map(v => fast.r(v))
                    ]

                    let frames = [];
                    
                    let itemsData = new Array(8).fill().map((el, i) => {
                        let startFrameIndex = fast.r((framesCount*0.8)*i/8)//getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                index: f
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
                                
                                let yValue = 0;
                                if(itemData.frames[f]){
                                    yValue = yChangeValues[itemData.frames[f].index]
                                }

                                ctx.drawImage(lettersImages[p], 0,-yValue)
                                
                            }
                        });
                    }
                    
                    return frames;
                },
                init() {
                    let repeat = 0;
                    this.frames = this.createLettersFrames({ framesCount: 124, itemFrameslength: 30, size: this.size})

                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
                    
                    this.timer = this.regTimerDefault(10, () => {
                    
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                            repeat++;
                            if(repeat == 8){
                                this.parent.parentScene.capturing.stop = true;
                            }
                        }
                    })
                }
            }))  
            }
        }), 10)

        this.press = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(PunchingScene.models.letters, { renderOnly: 'press' }),
            init() {
                let delay = 30;
                
                this.timer = this.regTimerDefault(10, () => {
                    if(--delay > 0)
                        return;

                    delay = 30;
                    this.isVisible = !this.isVisible
                    
                })
            }
        }), 11)
    }
}