class IslandScene extends Scene {
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
                size: new V2(2000, 1890),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'island'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = IslandScene.models.main;
        let layersData = {};
        let exclude = [
            'water_zone', 'tree_p', 'water_p'
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

        let waterMask = PP.createImage(model, { renderOnly: ['water_zone'], forceVisivility: { water_zone: { visible: true } } })
        
        this.waterAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWaterFrames({framesCount, itemsCount, itemFrameslengthClamps,xShiftClamps, maxAClamps, size}) {
                let frames = [];
                
                

                //let xShiftClamps = 5;
                

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames =  getRandomInt(itemFrameslengthClamps) //itemFrameslength;
                
                    let xShift = getRandomInt(xShiftClamps);
                    let xShiftValues = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0 });
                    let maxA = fast.r(getRandom(maxAClamps[0], maxAClamps[1]),2);
                    
                    if(getRandomInt(0,2) == 0)
                        maxA*=getRandomInt(2,4);
                    
                    if(maxA > 1)
                        maxA = 1;

                    let aValues = [
                        ...easing.fast({ from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2 })
                    ]


                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(0, size.y);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let a = aValues[f];
                        if(a == undefined)
                            a = 0;


                        frames[frameIndex] = {
                            xShift: xShiftValues[f],
                            a,
                        };
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].a})`)
                                    .dot(itemData.x - itemData.frames[f].xShift , itemData.y)
                            }
                            
                        }

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(waterMask,0,0);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createWaterFrames({
                    framesCount: 300, itemsCount: 1000, itemFrameslengthClamps: [50, 70], size: this.size,
                    xShiftClamps: [3,5],
                    maxAClamps: [0.1, 0.3]
                })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.island.renderIndex+1)

        this.fish = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 150).mul(1),
            init() {
                let pathPoints = [];
                createCanvas(new V2(1,1), (ctx, _size, hlp) => {
                    pathPoints = new PP({ctx}).lineV2(new V2(25, -this.size.y/2), new V2(125,189+this.size.y/2)).map(p => new V2(p))
                })

                let movementTotalFrames = 300;
                let totalAnimationFrames = 100;
                let delayOrigin = 150;
                let delay = 0;

                this.frames = PP.createImage(IslandScene.models.fishAnimation, { colorsSubstitutions: { "#FF0000": { color: '#335962', changeFillColor: true } } });
                let pathPointsIndexChange = easing.fast({from: 0, to: pathPoints.length-1, steps: movementTotalFrames, type: 'linear', round: 0});
                let frameIndexChange = easing.fast({from: 0, to: this.frames.length-1, steps: totalAnimationFrames, type: 'linear', round: 0});

                this.currentMovementFrame = 0;
                this.currentAnimationFrame = 0;
                this.img = this.frames[frameIndexChange[this.currentAnimationFrame]];
                this.position = pathPoints[pathPointsIndexChange[this.currentMovementFrame]]
                
                this.timer = this.regTimerDefault(10, () => {
                
                    if(delay > 0){
                        delay--;
                        return;
                    }


                    this.currentMovementFrame++;
                    if(this.currentMovementFrame == movementTotalFrames){
                        this.currentMovementFrame = 0;

                        delay = delayOrigin;
                    }

                    this.currentAnimationFrame++;
                    if(this.currentAnimationFrame == totalAnimationFrames){
                        this.currentAnimationFrame = 0;
                    }

                    this.img = this.frames[frameIndexChange[this.currentAnimationFrame]];
                    this.position = pathPoints[pathPointsIndexChange[this.currentMovementFrame]]
                    this.needRecalcRenderProperties = true;
                })
            }
        }), layersData.island.renderIndex-1)

        this.teeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 150;
                let totalAnimationFrames = 130;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'l1', animationStartFrame: 0,
                    },
                    {
                        layerName: 'l2', animationStartFrame: 10,
                    },
                    {
                        layerName: 'l3', animationStartFrame: 15,
                    },
                    {
                        layerName: 'l4', animationStartFrame: 20,
                    },
                    {
                        layerName: 'l5', animationStartFrame: 30,
                    },
                ]

                //aniParams.map(p => this.addChild(new GO({
                this.animations = IslandScene.models.treeAnimation.main[0].layers.map(l => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(IslandScene.models.treeAnimation, { renderOnly: [l.name] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        //let oneFrameShift = oneFrame + getRandomInt(0,5);

                        // let v = 0;
                        // for(let i = 0; i < totalFrames; i++){
                        //     // if(i%oneFrameShift == 0){
                        //     //     v = v==0? 1: 0;
                        //     // }

                        //     let index = p.animationStartFrame+i;
                        //     if(index > (totalFrames-1)){
                        //         index-=totalFrames;
                        //     }

                        //     framesIndexValues[index] = v;
                        // }

                        //let animationStartFrame = p.animationStartFrame;

                        let animationStartFrame = getRandomInt(0, totalFrames-1);

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));
            }
        }), layersData.tree.renderIndex+1)

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex+2)

        this.water_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'water_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.island.renderIndex+1)

        this.leafs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLeafsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let corners = [new V2(71, 68), new V2(77,74), new V2(124,73)];
                let _sharedPP = undefined;
                //'#c8542a','#aa381c',
                let _colors = ['#c8542a','#aa381c','#952f18','#7f2613','#6a1b0f', '#55100b'] //
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx});
                })

                let startPoints = _sharedPP.fillByCornerPoints(corners).map(p => new V2(p))

                let frames = [];
                
                let itemsData2 = [];
                let idXshiftSpeed = -0.15;

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p1 = startPoints[getRandomInt(0, startPoints.length-1)];
                    let direction = V2.up.rotate(getRandomInt(-130, -160));
                    let speed = getRandom(0.4,0.5)/2;
                    let ci = getRandomInt(0, _colors.length-1);
                    let cChangeTimeoutOrigin = getRandomInt(15, 30);
                    let cChangeTimeout = cChangeTimeoutOrigin;

                    let tail = undefined;

                    let frames = [];

                    let a = getRandomInt(1,2);
                    let b = getRandom(0.01,0.075);
                    let Fx = (x) => Math.sin(x*b)*a

                    let lastP = undefined;
                    let lastFrameIndex = undefined;
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        lastFrameIndex = frameIndex;

                        cChangeTimeout--;
                        if(cChangeTimeout <= 0){
                            cChangeTimeout = cChangeTimeoutOrigin;
                            ci++;
                            if(ci == _colors.length) ci = 0;
                        }

                        if(!tail){
                            if(getRandomInt(0,9) == 0) {
                                tail = {
                                    timeOut: getRandomInt(20,40),
                                    p: new V2(getRandomInt(-1,1), getRandomInt(1,1))
                                }
                            }
                        }
                        else {
                            tail.timeOut--;
                            if(tail.timeOut <= 0)
                                tail = undefined;
                        }

                        lastP = p1.add(direction.mul(speed*f)).add(new V2(0, Fx(frameIndex))).toInt()
                        frames[frameIndex] = {
                            ci,
                            p: lastP.clone(),
                            tail: {...tail}
                        };
                    }

                    let id2 = {
                        frames: []
                    };

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + lastFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        id2.frames[frameIndex] = {
                            ci,
                            p: lastP.add(new V2(idXshiftSpeed*f, 0)).toInt()
                        }
                    }

                    itemsData2[itemsData2.length] = id2;
                
                    return {
                        onWater: true,
                        frames
                    }
                })

                // itemsData = [
                //     ...itemsData,
                //     ...itemsData2
                // ]
                
                let flyLeafsFrames = [];
                let onWaterLeafsFrames = [];

                for(let f = 0; f < framesCount; f++){
                    flyLeafsFrames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.frames[f].p)
                            }                            
                        }

                        // ctx.globalCompositeOperation = 'destination-in';
                        // ctx.drawImage(waterMask,0,0);
                    });
                }

                for(let f = 0; f < framesCount; f++){
                    onWaterLeafsFrames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData2.length; p++){
                            let itemData = itemsData2[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.frames[f].p)
                            }                            
                        }

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(waterMask,0,0);
                    });
                }

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(onWaterLeafsFrames[f],0,0);
                        ctx.drawImage(flyLeafsFrames[f],0,0);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createLeafsFrames({framesCount: 300, itemsCount: 10, itemFrameslength: 300, size: this.size});
                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.tree.renderIndex-1)
    }
}