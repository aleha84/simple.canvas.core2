class SpaceshipScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false.,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'spaceshipSketch'
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
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#AB8245').rect(0,0,size.x, size.y);
                })

                this.runningItems = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    createItemsFrames({framesCount, itemsCount, images, itemFrameslength, size}) {
                        let frames = [];
                        let yValues = easing.fast({ from: getRandomInt(-100,-200), to: size.y, steps: itemFrameslength, type: 'linear', round: 0 });
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                            let image = images[getRandomInt(0, images.length-1)];
                            let x = getRandomInt(0, size.x);

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    y: yValues[f]
                                };
                            }
                        
                            return {
                                x,
                                image,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.image, itemData.x, itemData.frames[f].y);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        let images = [
                            ...SpaceshipScene.models.items.map(el => PP.createImage(el)),
                            ...SpaceshipScene.models.items.map(el => PP.createImage(el, { colorsSubstitutions: { '#B59A59': { color: '#9D5834', changeFillColor: true } } }))
                        ]

                        this.frames = this.createItemsFrames({ framesCount: 100, itemsCount: 100, images, itemFrameslength: 20, size: this.size });
                        let repeat = 2;
                        this.registerFramesDefaultTimer({framesEndCallback: () => { 
                            repeat--;
                            if(repeat == 0)
                                this.parent.parentScene.capturing.stop = true; 
                            } });
                    }
                }))
            }
        }), 1)

        this.ship = this.addGo(new GO({
            position: new V2(75,150),
            size: new V2(36,60),
            init() {
                this.img = PP.createImage(SpaceshipScene.models.ship)

                let yValues = 
                [
                    ...easing.fast({from: 150, to: 140, steps: 100, type: 'quad', method: 'in', round: 0}),
                    ...easing.fast({from: 140, to: 160, steps: 50, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: 160, to: 150, steps: 50, type: 'quad', method: 'out', round: 0})
                ];

                let xValues = 
                [
                    ...easing.fast({from: 75, to: 125, steps: 100, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: 125, to: 75, steps: 100, type: 'sin', method: 'out', round: 0})
                ]
                
                let index = 0;
                
                this.timer = this.regTimerDefault(10, () => {
                
                    let x = xValues[index];
                    let y = yValues[index];
                    this.position.x = x;
                    this.position.y = y;
                    this.needRecalcRenderProperties = true;
                    
                    index++;
                    if(index == xValues.length){
                        index = 0;
                    }
                })


                this.exhaust = this.addChild(new GO({
                    position: new V2(0, 102),
                    size: new V2(36, 200),
                    createExhaustFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let color1 = '#619956';
                        let color2= '#B3BFAA'


                        let lengthValues = [
                            ...easing.fast({ from: 3, to: 5, steps: 5, type: 'linear', round: 0}),
                            ...easing.fast({ from: 5, to: 3, steps: 15, type: 'quad', method: 'out', round: 0})
                        ]

                        let lengthValues2 = [
                            ...easing.fast({ from: 6, to: 10, steps: 5, type: 'linear', round: 0}),
                            ...easing.fast({ from: 10, to: 6, steps: 15, type: 'quad', method: 'out', round: 0})
                        ]
                        

                        let lengthValues3 = [
                            ...easing.fast({ from: 1, to: 4, steps: 5, type: 'linear', round: 0}),
                            ...easing.fast({ from: 4, to: 1, steps: 15, type: 'quad', method: 'out', round: 0})
                        ]


                        let startPoints = [new V2(5, 0), new V2(27, 0)];

                        let central = new V2(17,7);

                        let centralSidePoints = [new V2(13,5), new V2(19,5)];

                        let centralLengthValues = [
                            ...easing.fast({ from: 10, to: 20, steps: 5, type: 'linear', round: 0}),
                            ...easing.fast({ from: 20, to: 10, steps: 15, type: 'quad', method: 'out', round: 0})
                        ]

                        let centralLengthValues2 = [
                            ...easing.fast({ from: 5, to: 10, steps: 5, type: 'linear', round: 0}),
                            ...easing.fast({ from: 10, to: 5, steps: 15, type: 'quad', method: 'out', round: 0})
                        ]

                        
                        for(let f = 0; f < lengthValues.length; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {

                                hlp.setFillColor(color1).rect(central.x,central.y,2,size.y)

                                startPoints.forEach((sp, i) => {
                                    hlp.setFillColor(color1).rect(sp.x, sp.y, 4, lengthValues[f])
                                })


                                startPoints.forEach((sp, i) => {
                                    hlp.setFillColor(color1).rect(sp.x+1, sp.y, 2, lengthValues2[f])
                                    hlp.dot(sp.x+(i ==0? 2 : 1), sp.y+lengthValues2[f])

                                    let p = centralSidePoints[i];
                                    hlp.rect(p.x+1, p.y, 2, lengthValues2[f])
                                    hlp.dot(p.x+(i ==0? 2 : 1), p.y+lengthValues2[f])
                                })

                                startPoints.forEach((sp, i) => {
                                    hlp.setFillColor(color2).rect(sp.x+1, sp.y, 2, lengthValues3[f])
                                    let p = centralSidePoints[i];
                                    hlp.rect(p.x+1, p.y, 2, lengthValues3[f])

                                })

                                hlp.setFillColor(color1).rect(central.x-1, central.y, 4, centralLengthValues[f])
                                hlp.setFillColor(color2).rect(central.x, central.y, 2, centralLengthValues2[f])

                                
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createExhaustFrames({size: this.size});
                        this.registerFramesDefaultTimer({});

                    }
                }))

                this.particle = this.addChild(new GO({
                    position: new V2(0, 102),
                    size: new V2(36, 200),
                    createParticlesFrames({framesCount, itemsCount, itemFrameslength, size, yClamps}) {
                        let color1 = '#B3BFAA';
                        let frames = [];
                        let startPoints = [new V2(5, 0), new V2(27, 0), new V2(17, 7)];

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;

                            let pi = getRandomInt(0, startPoints.length-1);
                            let startPoint = startPoints[pi];
                            let toY = getRandomInt(yClamps[0], yClamps[1]);

                            let yValues = easing.fast({ from: startPoint.y, to: toY, steps: totalFrames, type: 'quad', method: 'in', round: 0 })
                            let x = startPoint.x + getRandomInt(0,3);
                            if(pi == 2)
                                x = startPoint.x + getRandomInt(-3,3);

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    y: yValues[f]
                                };
                            }
                        
                            return {
                                x,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                hlp.setFillColor(color1);
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.dot(itemData.x, itemData.frames[f].y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createParticlesFrames({ framesCount: 100, itemsCount: 100, itemFrameslength: 50,  yClamps: [20, 70], size: this.size});
                        this.registerFramesDefaultTimer({});

                    }
                }))

                
            }
        }), 10)


        this.enemyShot = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let index = 0;
                let total = 200;
                
                let data = [];
                data[50] = { x: 50, y: this.size.y, framesCount: 10 }
                data[55] = { x: 60, y: this.size.y, framesCount: 10 }
                data[150] = { x: 150, y: this.size.y, framesCount: 10 }
                data[153] = { x: 140, y: this.size.y, framesCount: 10 }
                data[90] = { x: 125, y: 140-110, explosion: true, framesCount: 5 }

                this.timer = this.regTimerDefault(10, () => {
                
                    if(data[index]){
                        this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            dataX: data[index].x,
                            dataY: data[index].y,
                            dataFramesCount: data[index].framesCount,
                            explosion: data[index].explosion,
                            createShotFrames({framesCount, x, length, targetY, size}) {
                                let frames = [];
                                
                                let yValues = easing.fast({ from: 0, to: targetY, steps: framesCount, type: 'linear', round: 0 });
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        hlp.setFillColor('#FFC45C').rect(x, yValues[f], 1, length);
                                    });
                                }
                                
                                return frames;
                            },
                            init() {
                                this.frames = this.createShotFrames({  framesCount: this.dataFramesCount, x: this.dataX, length: 100, targetY: this.dataY, size: this.size})
                                this.registerFramesDefaultTimer({ framesEndCallback: () => { 
                                    
                                    if(this.explosion){
                                        this.parent.parentScene.addGo(new GO({
                                            position: new V2(this.dataX, this.dataY+90),
                                            size: this.parent.parentScene.viewport.clone(),
                                            init() {
                                                
                                                // let startVectors = [
                                                //     V2.up,
                                                //     V2.upLeft,
                                                //     V2.upRight,
                                                //     V2.left,
                                                //     V2.right,
                                                //     V2.down,
                                                //     V2.downLeft,
                                                //     V2.downRight
                                                // ]
                                
                                                this.frames = [];
                                                let color1= "#FEE7BB";
                                                let totalFrames = 10;
                                                let targetCircleRadius = 8;
                                                let initialPoint = this.size.divide(2).toInt();
                                                let targetPoint = initialPoint.clone();//initialPoint.add(new V2(0, -30))
                                                let c2TargetShift = V2.down.rotate(getRandomInt(-45,45)).mul(targetCircleRadius*2).toInt();
                                
                                                let circle1 = PP.createImage(PP.circles.filled[targetCircleRadius], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } });
                                                let circle2 = PP.createImage(PP.circles.filled[targetCircleRadius], { colorsSubstitutions: { "#FF0000": { color: "#FD9D84", changeFillColor: true } } });
                                                let circle3 = PP.createImage(PP.circles.filled[targetCircleRadius]);
                                
                                                let c3StartFrame = totalFrames/2;
                                                let c3FramesLength = totalFrames - c3StartFrame;
                                
                                                let movementPoints = []
                                                let c2ShiftMovementPoints = []
                                                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                                                    let pp = new PP({ctx});
                                                    movementPoints = pp.lineV2(initialPoint, targetPoint).map(p => new V2(p));
                                                    c2ShiftMovementPoints = pp.lineV2(c2TargetShift, new V2()).map(p => new V2(p));
                                                })
                                
                                                let movementPointsIndexChange = easing.fast({ from: 0, to: movementPoints.length-1, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 });
                                                let c2ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: totalFrames, type: 'quad', method: 'out', round: 0 });
                                                let c3ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: c3FramesLength, type: 'sin', method: 'in', round: 0 });
                                
                                
                                                let rValues = easing.fast({ from: 2, to: targetCircleRadius, steps: 10, type: 'quad', method: 'out', round: 0})
                                                for(let f = 0; f < 10;f++){
                                                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                                        let r= rValues[f];
                                                        ctx.drawImage(PP.createImage(PP.circles.filled[r], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } }),
                                                            initialPoint.x-r, initialPoint.y-r)
                                                    })   
                                                }
                                
                                                for(let f = 0; f < totalFrames;f++){
                                                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                                        let c1p = movementPoints[movementPointsIndexChange[f]]
                                                        ctx.drawImage(circle1, c1p.x-targetCircleRadius, c1p.y-targetCircleRadius)
                                
                                                        let shiftToCenter = new V2(targetCircleRadius,targetCircleRadius);
                                                        let circle2Point = c1p.add(c2ShiftMovementPoints[c2ShiftMovementPointsIndexChange[f]]).substract(shiftToCenter).toInt();
                                                        
                                                        
                                                        ctx.globalCompositeOperation = 'source-atop';
                                                        ctx.drawImage(circle2, circle2Point.x, circle2Point.y);
                                                        
                                                        if(f > c3StartFrame){
                                                            ctx.globalCompositeOperation = 'destination-out';
                                                            let circle3Point = c1p.add(c2ShiftMovementPoints[c3ShiftMovementPointsIndexChange[f-c3StartFrame]]).substract(shiftToCenter).toInt();
                                                            ctx.drawImage(circle3, circle3Point.x, circle3Point.y);
                                                        }
                                                        
                                                    })
                                                }
                                
                                                this.registerFramesDefaultTimer(
                                                    { framesEndCallback: () => { 
                                                        this.setDead() 
                                                    }
                                                });
                                            }
                                        }),40)
                                    }

                                    this.setDead() 
                                } });
                            }
                            //
                        }))
                    }

                    index++;
                    if(index == total){
                        index = 0;
                    }
                })
            }
        }),30);

        
    }
}