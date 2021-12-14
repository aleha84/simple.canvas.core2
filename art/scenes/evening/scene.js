class EveningScene extends Scene {
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
                size: new V2(200,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'FrostyEvening',
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
        let model = EveningScene.models.main;

        let layersData = {};
        let exclude = [
            'bus', 'bus_cloned'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        this.car = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pOriginal = new V2(148.5, 172)
                let sharedPP = PP.createInstance(V2.one, { modifyContext: false })

                let points = [new V2(-60, 145), new V2(220, 179)]

                // let busImg = PP.createImage(model, { renderOnly: ['bus'], forceVisibility: {bus: { visible: true }} })
                // let busImg2 = PP.createImage(model, { renderOnly: ['bus_cloned'], forceVisibility: {bus_cloned: { visible: true }} })
                let imgs = PP.createImage(EveningScene.models.car) //[busImg, busImg2]
                
                let path1 = {
                    framesCount: 500,
                    pathPoints: sharedPP.lineV2(points[0], points[1]).map(p => new V2(p).substract(pOriginal))
                };

                path1.indexValues = easing.fast({ from: 0, to: path1.pathPoints.length-1, steps: path1.framesCount, type: 'linear', round: 0 })

                
                let stop2 = {
                    framesCount: 400, 
                    point: points[1].substract(pOriginal)
                };

                this.frames = [];

                let frameIndex = 0;
                let switchImgIndex = 0;
                let switchCount = 10; 

                let nextYChangeFrameIndex = undefined;
                let nextYChangeLength = undefined;
                let imgToFramesValues = undefined;

                let getImgReset = () => {
                    nextYChangeFrameIndex = undefined;
                    nextYChangeLength = undefined;
                    imgToFramesValues = undefined;
                }
                let getImgIndex = (currentF, totalFrames, path) => {
                    if(nextYChangeFrameIndex == undefined || currentF == nextYChangeFrameIndex) {
                        // nextYChangeFrameIndex = undefined;
                        // imgToFramesValues = undefined;
                        // nextYChangeLength = undefined;

                        let p = path.pathPoints[path.indexValues[currentF]]
                        let cf = currentF;
                        while(cf < totalFrames) {
                            cf++;
                            let index = path.indexValues[cf];
                            if(index == undefined) {
                                return 0
                            }

                            let pNext = path.pathPoints[index];
                            if(pNext == undefined)
                                return 0;

                            if(p.y != pNext.y) {
                                let d = cf - currentF;
                                imgToFramesValues = easing.fast({from: 0, to: imgs.length-1, steps: d, type: 'linear', round: 0});
                                nextYChangeLength = d;
                                nextYChangeFrameIndex = cf;
                                break;
                            }   
                            
                            if(cf == totalFrames-1) {
                                let d = cf - currentF;
                                nextYChangeLength = d;
                                nextYChangeFrameIndex = totalFrames;
                                imgToFramesValues = new Array(d).fill(0);
                            }
                        }
                    }

                    if(imgToFramesValues == undefined)
                        return 0;

                    let x = currentF - (nextYChangeFrameIndex - nextYChangeLength);
                    return imgToFramesValues[x];
                }

                for(let f = 0; f < stop2.framesCount;f++) {
                    frameIndex = f;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = stop2.point
                        ctx.drawImage(imgs[0], p.x, p.y)
                    })
                }

                let framesShift =  stop2.framesCount;

                for(let f = 0; f < path1.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path1.pathPoints[path1.indexValues[f]];
                        
                        switchImgIndex = getImgIndex(f, path1.framesCount, path1);

                        ctx.drawImage(imgs[switchImgIndex], p.x, p.y)
                    })
                }


                console.log('car frames count:' + this.frames.length);

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }), layersData.house_d.renderIndex+1)

        this.bus = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let pOriginal = new V2(121.5, 167)
                let sharedPP = PP.createInstance(V2.one, { modifyContext: false })

                let points = [new V2(-60, 145), new V2(32, 155), new V2(63,158), new V2(121, 165), new V2(220, 179)]

                // let busImg = PP.createImage(model, { renderOnly: ['bus'], forceVisibility: {bus: { visible: true }} })
                // let busImg2 = PP.createImage(model, { renderOnly: ['bus_cloned'], forceVisibility: {bus_cloned: { visible: true }} })
                let imgs = PP.createImage(EveningScene.models.busFrames2) //[busImg, busImg2]
                
                let path1 = {
                    framesCount: 180,
                    pathPoints: sharedPP.lineV2(points[0], points[1]).map(p => new V2(p).substract(pOriginal))
                };

                path1.indexValues = easing.fast({ from: 0, to: path1.pathPoints.length-1, steps: path1.framesCount, type: 'linear', round: 0 })

                let path2Stopping = {
                    framesCount: 120,
                    pathPoints: sharedPP.lineV2(points[1], points[2]).map(p => new V2(p).substract(pOriginal))
                };

                path2Stopping.indexValues = easing.fast({ from: 0, to: path2Stopping.pathPoints.length-1, steps: path2Stopping.framesCount, type: 'sin', method: 'out', round: 0 })

                let stop = {
                    framesCount: 120, 
                    point: points[2].substract(pOriginal)
                };

                let path3Starting = {
                    framesCount: 180,
                    pathPoints: sharedPP.lineV2(points[2], points[3]).map(p => new V2(p).substract(pOriginal))
                };

                path3Starting.indexValues = easing.fast({ from: 0, to: path3Starting.pathPoints.length-1, steps: path3Starting.framesCount, type: 'sin', method: 'in', round: 0 })

                let path4 = {
                    framesCount: 180,
                    pathPoints: sharedPP.lineV2(points[3], points[4]).map(p => new V2(p).substract(pOriginal))
                };

                path4.indexValues = easing.fast({ from: 0, to: path4.pathPoints.length-1, steps: path4.framesCount, type: 'linear', round: 0 })

                let stop2 = {
                    framesCount: 120, 
                    point: points[4].substract(pOriginal)
                };

                this.frames = [];

                let frameIndex = 0;
                let switchImgIndex = 0;
                let switchCount = 10; 

                let nextYChangeFrameIndex = undefined;
                let nextYChangeLength = undefined;
                let imgToFramesValues = undefined;

                let getImgReset = () => {
                    nextYChangeFrameIndex = undefined;
                    nextYChangeLength = undefined;
                    imgToFramesValues = undefined;
                }
                let getImgIndex = (currentF, totalFrames, path) => {
                    if(nextYChangeFrameIndex == undefined || currentF == nextYChangeFrameIndex) {
                        // nextYChangeFrameIndex = undefined;
                        // imgToFramesValues = undefined;
                        // nextYChangeLength = undefined;

                        let p = path.pathPoints[path.indexValues[currentF]]
                        let cf = currentF;
                        while(cf < totalFrames) {
                            cf++;
                            let index = path.indexValues[cf];
                            if(index == undefined) {
                                return 0
                            }

                            let pNext = path.pathPoints[index];
                            if(pNext == undefined)
                                return 0;

                            if(p.y != pNext.y) {
                                let d = cf - currentF;
                                imgToFramesValues = easing.fast({from: 0, to: imgs.length-1, steps: d, type: 'linear', round: 0});
                                nextYChangeLength = d;
                                nextYChangeFrameIndex = cf;
                                break;
                            }   
                            
                            if(cf == totalFrames-1) {
                                let d = cf - currentF;
                                nextYChangeLength = d;
                                nextYChangeFrameIndex = totalFrames;
                                imgToFramesValues = new Array(d).fill(0);
                            }
                        }
                    }

                    if(imgToFramesValues == undefined)
                        return 0;

                    let x = currentF - (nextYChangeFrameIndex - nextYChangeLength);
                    return imgToFramesValues[x];
                }

                for(let f = 0; f < path1.framesCount;f++) {
                    frameIndex = f;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path1.pathPoints[path1.indexValues[f]];
                        
                        switchImgIndex = getImgIndex(f, path1.framesCount, path1);

                        ctx.drawImage(imgs[switchImgIndex], p.x, p.y)
                    })
                }

                getImgReset();

                let framesShift = path1.framesCount;
                for(let f = 0; f < path2Stopping.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path2Stopping.pathPoints[path2Stopping.indexValues[f]];
                        
                        switchImgIndex = getImgIndex(f, path2Stopping.framesCount, path2Stopping);

                        ctx.drawImage(imgs[switchImgIndex], p.x, p.y)
                    })
                }

                framesShift = path1.framesCount + path2Stopping.framesCount;
                for(let f = 0; f < stop.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = stop.point
                        ctx.drawImage(imgs[0], p.x, p.y)
                    })
                }

                getImgReset()

                framesShift = path1.framesCount+ path2Stopping.framesCount+stop.framesCount;
                for(let f = 0; f < path3Starting.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path3Starting.pathPoints[path3Starting.indexValues[f]];
                        
                        switchImgIndex = getImgIndex(f, path3Starting.framesCount, path3Starting);

                        ctx.drawImage(imgs[switchImgIndex], p.x, p.y)
                    })
                }

                getImgReset()

                framesShift = path1.framesCount+ path2Stopping.framesCount+stop.framesCount+path3Starting.framesCount;
                for(let f = 0; f < path4.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path4.pathPoints[path4.indexValues[f]];
                        
                        switchImgIndex = getImgIndex(f, path4.framesCount, path4);

                        ctx.drawImage(imgs[switchImgIndex], p.x, p.y)
                    })
                }

                framesShift =  path1.framesCount+ path2Stopping.framesCount+stop.framesCount+path3Starting.framesCount +path4.framesCount;
                for(let f = 0; f < stop2.framesCount;f++) {
                    frameIndex = f + framesShift;
                    this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = stop2.point
                        ctx.drawImage(imgs[0], p.x, p.y)
                    })
                }

                console.log('bus frames count:' + this.frames.length);

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }), layersData.house_d.renderIndex+2)

        this.snowflakes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createPFrames({framesCount, itemsCount, visibleFramesClamps, itemFramesLength, size, upperYShiftClamps, angleClamps, color, xClamp}) {
                let frames = [];
                let _colors = ['#898989', '#A5A5A5', '#CCCCCC']
                let leftLine = createLine(new V2(-size.x/2, -size.y*2), new V2(-size.x/2, size.y*2));
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
    
                    let initialPoint = new V2(getRandomInt(xClamp[0], xClamp[1]), getRandomInt(upperYShiftClamps[0], upperYShiftClamps[1]));
                    let direction = V2.left.rotate(getRandomInt(angleClamps[0], angleClamps[1]));

                    let visibleSteps = getRandomInt(visibleFramesClamps);
                    let vTof = easing.fast({ from: 0, to: visibleSteps, steps: itemFramesLength, type: 'linear', round: 0 });
                  
                    let frames = [];
                    for(let f = 0; f < itemFramesLength; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let x = vTof[f];
                        frames[frameIndex] = {
                            point: initialPoint.add(direction.mul(x)).toInt()
                        };
                    }
    
                
                
                    return {
                        color: _colors[getRandomInt(0, _colors.length-1)],
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                // let oValue = itemData.frames[f].oValue;
                                // if(oValue == undefined)
                                //     oValue = 0;
        
                                // if(oValue == 1){
                                    
                                // }
                                hlp.setFillColor(itemData.color).dot(itemData.frames[f].point)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createPFrames({ framesCount: 300, itemsCount: 30, visibleFramesClamps: [300,400], itemFramesLength: 250, size: this.size, 
                    upperYShiftClamps: [-100, this.size.y], angleClamps: [-10,-35], xClamp: [ this.size.x + 20, this.size.x + 60 ]  })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.close.renderIndex+10)

        this.windows = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let model = EveningScene.models.windows;
                let totalFrames = 900;
                let visibilityClamps = [150,300];
                let imgsData = [];
                model.main.layers.forEach(l => {
                    if(l.name[0] == 'w') {
                        let d = {
                            img: PP.createImage(model, { renderOnly: [l.name], forceVisibility: { [l.name]: { visible: true } } }),
                            frames: []
                        };

                        let startFrameIndex = getRandomInt(0, totalFrames-1);
                        let itemFramesLength = getRandomInt(visibilityClamps);
                        for(let f = 0; f < itemFramesLength; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (totalFrames-1)){
                                frameIndex-=totalFrames;
                            }
                    
                            d.frames[frameIndex] = true
                        }

                        imgsData.push(d);
                    }
                    else if(l.name[0] == 't') {
                        let changeCount = getRandomInt(5,10);
                        let overlay = getRandomInt(0,4)/10;

                        let d = {
                            useFramesImg: true,
                            frames: []
                        }

                        let img = PP.createImage(model, { renderOnly: [l.name] })

                        for(let f = 0; f < totalFrames; f++) {
                            changeCount--;
                            
                            d.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(img, 0 ,0);
                                ctx.globalCompositeOperation = 'source-atop';
                                hlp.setFillColor('rgba(0,0,0,' + overlay + ')').rect(0,0,size.x, size.y);
                            });

                            if(changeCount == 0) {
                                changeCount = getRandomInt(10,20);
                                overlay = getRandomInt(0,4)/10;
                            }
                        }

                        imgsData.push(d);
                    }
                    else if(l.name[0] == 'p') {
                        imgsData.push({
                            useFramesImg: true,
                            frames: animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: 100, size: this.size, 
                                pointsData: animationHelpers.extractPointData(l) })
                        });
                    }

                });

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let p = 0; p < imgsData.length; p++){
                            let itemData = imgsData[p];
                            if(itemData.useFramesImg) {
                                ctx.drawImage(itemData.frames[f], 0, 0)
                            }
                            else {
                                if(itemData.frames[f]){
                                    ctx.drawImage(itemData.img, 0, 0)
                                }
                            }
                        }
                    });
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                    
                });
            }
        }), layersData.house_d.renderIndex+1)

        this.walk = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let walkFrames = PP.createImage(EveningScene.models.walk)

                let p1 = new V2(-1, 155);
                let p2 = new V2(43,158);
                let sPP = PP.createInstance(V2.one, { modifyContext: false })
                let path = sPP.lineV2(p1, p2);
                let totalFrames = 300;
                let pathIndexToFrames = easing.fast({from: 0, to: path.length-1, steps: totalFrames, type: 'linear', round: 0});
                let frameChangeValue = 8;
                let currentFrameChange = frameChangeValue;
                let currentWalkFrameIndex = 0;
                let _frames = [];

                for(let f = 0; f < totalFrames; f++) {
                    _frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path[pathIndexToFrames[f]];
                        ctx.drawImage(walkFrames[currentWalkFrameIndex], p.x, p.y);

                        currentFrameChange--;

                        if(currentFrameChange == 0) {
                            currentFrameChange = frameChangeValue;
                            currentWalkFrameIndex++;
                            if(currentWalkFrameIndex == walkFrames.length) {
                                currentWalkFrameIndex = 0;
                            }
                        }
                    })
                }

                this.frames = [
                    ...new Array(900 - totalFrames).fill(),
                    ..._frames
                ]

                this.registerFramesDefaultTimer({});

            }
        }), layersData.close.renderIndex-1)

        this.farCar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let origin = new V2(56,136);
                let carImg = PP.createImage(EveningScene.models.farCar)
                let totalFrames = 300;
                let path = PP.createInstance(V2.one, { modifyContext: false }).lineV2(new V2( 89,136), new V2(-10, 138)).map(p => new V2(p).substract(origin));
                let pathIndexToFrames = easing.fast({from: 0, to: path.length-1, steps: totalFrames, type: 'linear', round: 0});

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p = path[pathIndexToFrames[f]];
                        ctx.drawImage(carImg, p.x, p.y);
                    })
                }

                this.frames = [
                    ...this.frames,
                    ...new Array(900 - totalFrames).fill()
                ]

                this.registerFramesDefaultTimer({});
            }
        }), layersData.far.renderIndex+1)
    }

}