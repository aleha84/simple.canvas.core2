class Demo10TieScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'tie'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    createStarsFrames({framesCount, itemsCount, size, color}) {
        let frames = [];
        let pCenter = new V2(size.x*2, -30).toInt();
        let _sharedPP = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            _sharedPP = new PP({ctx});
        })

        // let color = colors.rgbStringToObject({value: 'rgba(78,105,100,1)', asObject: true});
        // color.opacity = opacity;

        // color = colors.rgbToString({value: color, isObject: true});

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = framesCount;
        
            let p1 = undefined;
            if(getRandomBool()) {
                p1 = new V2(0, getRandomInt(0, size.y))
            }
            else {
                p1 = new V2(getRandomInt(0, size.x), size.y);
            }
            
            let points = _sharedPP.lineV2(p1, pCenter);
            let indexValues = easing.fast({from: 0, to: points.length-1, steps: framesCount, type: 'quad', method: 'out'}).map(v => fast.r(v));

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    p: points[indexValues[f]]
                };
            }
        
            return {
                frames,
                indexValues,
                points
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(color).dot(itemData.frames[f].p.x, itemData.frames[f].p.y)
                    }
                    
                }
            });
        }
        
        console.log(`stars frames created. ${frames.length}`)

        return frames;
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.bg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.parentScene.viewport, (ctx, size, hlp) => {
                        hlp.setFillColor('black').rect(0,0,size.x, size.y);
                    })
                }));

                this.stars1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.parentScene.createStarsFrames({ framesCount: 200, itemsCount: 300, size: this.size, color: 'rgba(78,105,100,1)' }),
                    init() {
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
                }));

            }
        }), 1)

        this.small = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let small = PP.createImage(Demo10TieScene.models.small);
                let smallSize = new V2(20,21);
                let startFrame = 100;
                let totalFramesCount = 200;
                let framesCount = 50;
                let start = new V2(100, -20)
                let target = new V2(-50, 50);
                let linePoints = []
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    linePoints = new PP({ctx}).lineV2(start, target);
                });

                let indexValues = easing.fast({from: 0, to: linePoints.length-1, steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));

                let frames = [];
                for(let i = 0; i < totalFramesCount; i++){
                    frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        if(i >= startFrame && i < startFrame + framesCount){
                            let p = linePoints[indexValues[i-startFrame]];
                            
                            ctx.drawImage(small, p.x-25, p.y-15);
                            ctx.drawImage(small, p.x, p.y);
                        }
                        
                    })
                }

                this.frames = frames;

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
        }), 2)

        this.tiny = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let small = PP.createImage(Demo10TieScene.models.tiny);
                let smallSize = new V2(20,21);
                let startFrame = 50;
                let totalFramesCount = 200;
                let framesCount = 50;
                let start = new V2(160, 90)
                let target = new V2(10, 170);
                let linePoints = []
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    linePoints = new PP({ctx}).lineV2(start, target);
                });

                let indexValues = easing.fast({from: 0, to: linePoints.length-1, steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));

                let frames = [];
                for(let i = 0; i < totalFramesCount; i++){
                    frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        if(i >= startFrame && i < startFrame + framesCount){
                            let p = linePoints[indexValues[i-startFrame]];
                            
                             ctx.drawImage(small, p.x-5, p.y-15);
                             ctx.drawImage(small, p.x-15, p.y-5);
                            ctx.drawImage(small, p.x, p.y);
                        }
                        
                    })
                }

                this.frames = frames;

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
        }), 2)

        this.fighter = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createTieFrames({size}) {
                let frames = [];
                let fighterImg = PP.createImage(Demo10TieScene.models.main, { exclude: ['green_shade', 'red_shade'] });
                let fighterGoLeftImg = PP.createImage(Demo10TieScene.models.goLeft, { exclude: ['green_shade', 'red_shade'] });
                let fighterGoRightImg = PP.createImage(Demo10TieScene.models.goRight, { exclude: ['green_shade', 'red_shade'] });
                let greenShadeImg = PP.createImage(Demo10TieScene.models.main, { renderOnly: ['green_shade'] });
                let redShadeImg = PP.createImage(Demo10TieScene.models.main, { renderOnly: ['red_shade'] });
                let fighterSize = new V2(50,53);
                let fighterSizeHalf = fighterSize.divide(2).toInt();
                let center = size.divide(2).toInt();
                let pCenter = new V2(size.x*2, -60).toInt();

                let shotLeftStart = new V2(0,80);
                let shotLeftDirection = shotLeftStart.direction(pCenter);

                let shotRightStart = new V2(40,size.y);
                let shotRightDirection = shotRightStart.direction(pCenter);

                let shotCenterStart = new V2(0,size.y);
                let shotCenterDirection = shotCenterStart.direction(pCenter);

                let shotBackStart = new V2(70,85);
                let shotBackDirection = shotBackStart.direction(pCenter).mul(-1);

                let yShiftClamps = [-2,2];

                let line = createLine(new V2(28,71), new V2(119, 87));
                let lineDots = [];

                let leftShotPoints = [];
                let rightShotPoints = [];
                let centerShotPoints = [];
                let backShotPoints = [];

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    lineDots = pp.lineL(line).map(p => new V2(p));
                    leftShotPoints = pp.lineV2(shotLeftStart, pCenter);
                    rightShotPoints = pp.lineV2(shotRightStart, pCenter);
                    centerShotPoints = pp.lineV2(shotCenterStart, pCenter);
                    backShotPoints = pp.lineV2(shotBackStart, new V2(0, 130));
                })

                

                let framesPerMovement = 25;
                let yShiftFramesCount = 50;

                let goLeftIndexValues = easing.fast({from: fast.r(lineDots.length/2), to: 0, steps: framesPerMovement, type: 'quad', method: 'inOut' }).map(v => fast.r(v))
                let goRightIndexValues = easing.fast({from: 0, to: lineDots.length-1, steps: framesPerMovement, type: 'quad', method: 'inOut' }).map(v => fast.r(v));
                let goCenterIndexValues = easing.fast({from: lineDots.length-1, to: fast.r(lineDots.length/2), steps: framesPerMovement, type: 'quad', method: 'inOut' }).map(v => fast.r(v));

                let framesData = [];
                
                let yChange = [
                    ...easing.fast({from: yShiftClamps[0], to: yShiftClamps[1], steps: yShiftFramesCount/2, type: 'quad', method: 'inOut'}).map(v => fast.r(v)),
                    ...easing.fast({from: yShiftClamps[1], to: yShiftClamps[0], steps: yShiftFramesCount/2, type: 'quad', method: 'inOut'}).map(v => fast.r(v))
                ]


                let shotFramesCount = 10;
                let leftShotIndexValues = easing.fast({from: 0, to: leftShotPoints.length-1, steps: shotFramesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));
                let rightShotIndexValues = easing.fast({from: 0, to: rightShotPoints.length-1, steps: shotFramesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));
                let centerShotIndexValues = easing.fast({from: 0, to: centerShotPoints.length-1, steps: shotFramesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));
                let backShotIndexValues = easing.fast({from: 0, to: backShotPoints.length-1, steps: shotFramesCount/2, type: 'linear', method: 'base'}).map(v => fast.r(v));

                let shotsData = [];
                let shotsOverData = [];

                //back shots
                for(let i = 0; i < 2; i++){
                    let frames = [];
                    let yShift = -i*2;
                    for(let f = 0; f < shotFramesCount/2; f++){
                        let frameIndex = f + 25 + i*10;
                        // if(frameIndex > (framesCount-1)){
                        //     frameIndex-=framesCount;
                        // }

                        frames[frameIndex] = {
                            index: f,
                            p: new V2(backShotPoints[backShotIndexValues[f]])
                        };
                        
                    }

                    shotsOverData.push({
                        
                        direction: shotBackDirection,
                        yShift,
                        points: backShotPoints,
                        indexValues: backShotIndexValues,
                        frames,
                        color: '#89B955'
                    });
                }

                //left shots
                for(let i = 0; i < 2; i++){
                    let frames = [];
                    let yShift = getRandomInt(-5,5);
                    for(let f = 0; f < shotFramesCount; f++){
                        let frameIndex = f + 110 + i*10;
                        // if(frameIndex > (framesCount-1)){
                        //     frameIndex-=framesCount;
                        // }

                        frames[frameIndex] = {
                            index: f,
                            p: new V2(leftShotPoints[leftShotIndexValues[f]])
                        };
                        
                    }

                    shotsData.push({
                        
                        direction: shotLeftDirection,
                        yShift,
                        points: leftShotPoints,
                        indexValues: leftShotIndexValues,
                        frames
                    });
                }

                //right shots
                for(let i = 0; i < 3; i++){
                    let frames = [];
                    let yShift = getRandomInt(-5,5);
                    for(let f = 0; f < shotFramesCount; f++){
                        let frameIndex = f + 155 + i*10;
                        // if(frameIndex > (framesCount-1)){
                        //     frameIndex-=framesCount;
                        // }

                        frames[frameIndex] = {
                            index: f,
                            p: new V2(rightShotPoints[rightShotIndexValues[f]])
                        };
                        
                    }

                    shotsOverData.push({
                        direction: shotRightDirection,
                        yShift,
                        points: rightShotPoints,
                        indexValues: rightShotIndexValues,
                        frames
                    });
                }

                //center shots
                for(let i = 0; i < 1; i++){
                    let frames = [];
                    let yShift = 0//getRandomInt(-5,5);
                    for(let f = 0; f < shotFramesCount; f++){
                        let frameIndex = f + 55 + i*10;
                        // if(frameIndex > (framesCount-1)){
                        //     frameIndex-=framesCount;
                        // }

                        frames[frameIndex] = {
                            index: f,
                            p: new V2(centerShotPoints[centerShotIndexValues[f]])
                        };
                        
                    }

                    shotsOverData.push({
                        direction: shotRightDirection,
                        yShift,
                        points: centerShotPoints,
                        indexValues: centerShotIndexValues,
                        frames
                    });
                }
                
                

                //idle - 0
                let lineMiddle= lineDots[fast.r(lineDots.length/2)].substract(fighterSizeHalf);
                for(let frameIndex = 0; frameIndex < yShiftFramesCount; frameIndex++){
                    
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineMiddle
                    });
                }

                //go left - 50
                for(let frameIndex = 0; frameIndex < framesPerMovement; frameIndex++){
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineDots[goLeftIndexValues[frameIndex]].substract(fighterSizeHalf),
                        img: 'goLeft',
                    });
                }

                // half idle - 75
                let lineStart = lineDots[0].substract(fighterSizeHalf);
                for(let frameIndex = yShiftFramesCount/2; frameIndex < yShiftFramesCount; frameIndex++){
                    
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineStart
                    });
                }

                // go right - 100
                for(let frameIndex = 0; frameIndex < framesPerMovement; frameIndex++){
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineDots[goRightIndexValues[frameIndex]].substract(fighterSizeHalf),
                        img: 'goRight',
                    });
                }

                // half idle - 125
                let lineEnd = lineDots[lineDots.length-1].substract(fighterSizeHalf);
                for(let frameIndex = yShiftFramesCount/2; frameIndex < yShiftFramesCount; frameIndex++){
                    
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineEnd
                    });
                }

                // go center - 150
                for(let frameIndex = 0; frameIndex < framesPerMovement; frameIndex++){
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineDots[goCenterIndexValues[frameIndex]].substract(fighterSizeHalf),
                        img: 'goLeft',
                    });
                }

                // half idle - 175
                for(let frameIndex = yShiftFramesCount/2; frameIndex < yShiftFramesCount; frameIndex++){
                    framesData.push({
                        yShift: yChange[frameIndex%yShiftFramesCount],
                        p: lineMiddle
                    });
                }
                
                for(let f = 0; f < framesData.length; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        for(let p = 0; p < shotsData.length; p++){
                            let shotData = shotsData[p];
                            
                            if(shotData.frames[f]){
                                //hlp.setFillColor(color).dot(itemData.frames[f].p.x, itemData.frames[f].p.y)
                                pp.setFillStyle('#CC2822');

                                if(shotData.color){
                                    pp.setFillStyle(shotData.color);
                                }

                                let index = shotData.indexValues[shotData.frames[f].index];
                                let p1 = new V2(shotData.points[index])
                                let p2 = new V2(shotData.points[index > 50 ? index-50: 0])

                                pp.lineV2(p1.add(new V2(0, shotData.yShift)), p2.add(new V2(0, shotData.yShift)))
                                ctx.globalAlpha = 0.25;
                                pp.lineV2(p1.add(new V2(0, shotData.yShift-1)), p2.add(new V2(0, shotData.yShift-1)))
                                pp.lineV2(p1.add(new V2(0, shotData.yShift+1)), p2.add(new V2(0, shotData.yShift+1)))
                                ctx.globalAlpha = 1;

                            }
                            
                        }


                        let data = framesData[f];

                        if(data.img == 'goLeft'){
                            ctx.drawImage(fighterGoLeftImg, data.p.x, data.p.y + data.yShift);
                        }
                        else if(data.img == 'goRight'){
                            ctx.drawImage(fighterGoRightImg, data.p.x, data.p.y + data.yShift);
                        }
                        else {
                            ctx.drawImage(fighterImg, data.p.x, data.p.y + data.yShift);
                        }

                        if(f > 25 && f < 30 || f > 35 && f < 40) {
                            ctx.drawImage(greenShadeImg, data.p.x, data.p.y + data.yShift);
                        }

                        if( f > 56 && f < 61|| f > 156 && f < 161|| f > 166 && f < 171 || f > 176 && f < 181) {
                            ctx.drawImage(redShadeImg, data.p.x, data.p.y + data.yShift);
                        }

                        for(let p = 0; p < shotsOverData.length; p++){
                            let shotData = shotsOverData[p];
                            
                            if(shotData.frames[f]){
                                //hlp.setFillColor(color).dot(itemData.frames[f].p.x, itemData.frames[f].p.y)
                                pp.setFillStyle('#CC2822');

                                if(shotData.color){
                                    pp.setFillStyle(shotData.color);
                                }

                                let index = shotData.indexValues[shotData.frames[f].index];
                                let p1 = new V2(shotData.points[index])
                                let p2 = new V2(shotData.points[index > 50 ? index-50: 0])

                                pp.lineV2(p1.add(new V2(0, shotData.yShift)), p2.add(new V2(0, shotData.yShift)))
                                ctx.globalAlpha = 0.25;
                                pp.lineV2(p1.add(new V2(0, shotData.yShift-1)), p2.add(new V2(0, shotData.yShift-1)))
                                pp.lineV2(p1.add(new V2(0, shotData.yShift+1)), p2.add(new V2(0, shotData.yShift+1)))
                                ctx.globalAlpha = 1;
                            }
                            
                        }
                    });
                }

                console.log(`firgter frames created. ${frames.length}`)
                
                return frames;
            },
            init() {
                this.frames = this.createTieFrames({size: this.size})

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let repeat = 5;

                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        if(--repeat == 0){
                            this.parentScene.capturing.stop = true;
                        }
                        
                    }
                })
            }
        }), 5)

        this.addGo(new GO({
            position: new V2(132,5),
            size: new V2(30,10),
            img: PP.createImage(Demo10TieScene.models.sign)
        }), 10)

        // this.stars2 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     frames: this.createStarsFrames({ framesCount: 200, itemsCount: 100, size: this.viewport, color: 'rgba(222,229,228,1)' }),
        //     init() {
        //         this.currentFrame = 0;
        //         this.img = this.frames[this.currentFrame];
                
        //         this.timer = this.regTimerDefault(10, () => {
                
        //             this.img = this.frames[this.currentFrame];
        //             this.currentFrame++;
        //             if(this.currentFrame == this.frames.length){
        //                 this.currentFrame = 0;
        //             }
        //         })
        //     }
        // }), 10);
    }
}