class DedMorozScene extends Scene {
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
                size: new V2(138,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'ded_moroz',
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
        let model = DedMorozScene.models.main;
        let layersData = {};
        let exclude = [
            'main_p', 'tree_p', 'train', 'train_2', 'text1', 'text2', 'bag_zone'
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

        let createSnowflakesFrames = function({framesCount, itemsCount, visibleFramesClamps, itemFramesLength, size, upperYShiftClamps, angleClamps, color, xClamp}) {
            let frames = [];
            let _colors = ['#E1F5F7', '#FFFFFF', '#d0deee'] //, '#A5A5A5', '#CCCCCC'
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
                            hlp.setFillColor(itemData.color).dot(itemData.frames[f].point)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.snowflakesFrontal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createSnowflakesFrames({ framesCount: 300, itemsCount: 100, visibleFramesClamps: [300,400], itemFramesLength: 150, size: this.size, 
                    upperYShiftClamps: [-100, this.size.y], angleClamps: [-10,-35], xClamp: [ this.size.x + 20, this.size.x + 60 ]  })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.staff.renderIndex+1)

        this.snowflakesBack = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createSnowflakesFrames({ framesCount: 300, itemsCount: 100, visibleFramesClamps: [300,400], itemFramesLength: 150, size: this.size, 
                    upperYShiftClamps: [-100, this.size.y], angleClamps: [-10,-35], xClamp: [ this.size.x + 20, this.size.x + 60 ]  })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.main.renderIndex-1)

        this.dm_animations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let createMovementFrames = function({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size}) {
                    let frames = [];
                    let images = [];
        
                    let itemsCount = animationsModel.main[0].layers.length;
        
                    let framesIndiciesChange = [
                        ...easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength/2, type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: animationsModel.main.length-1, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'in', round: 0 })
                    ]
        
                    for(let i = 0; i < itemsCount; i++) {
                        images[i] = PP.createImage(animationsModel, { renderOnly: [animationsModel.main[0].layers[i].name] }) //'l' + (i+1)
                    }
                    
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = startFramesSequence ? 
                        startFramesSequence[i]
                        : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
                        
                        let totalFrames = itemFrameslength;
                    
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                index: framesIndiciesChange[f]
                            };
                        }
        
                        if(additional) {
                            let startFrameIndex1 = startFrameIndex + totalFrames + additional.framesShift;
                            for(let f = 0; f < additional.frameslength; f++){
                                let frameIndex = f + startFrameIndex1;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
        
                                frames[frameIndex] = {
                                    index: additional.framesIndiciesChange[f]
                                };
                            }
                        }
                        
                    
                        return {
                            img: images[i],
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    let index = itemData.frames[f].index;
                                    ctx.drawImage(itemData.img[index], 0, 0);
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                }

                this.frames = createMovementFrames({ framesCount: 100, startFramesClamps: [30, 80], itemFrameslength: 60, 
                    additional: {
                        framesShift: 10,
                        frameslength: 30,
                        framesIndiciesChange: [
                            ...easing.fast({from: 0, to: 1, steps: 15, type: 'quad', method: 'inOut', round: 0 }),
                            ...easing.fast({from: 1, to: 0, steps: 15, type: 'quad', method: 'inOut', round: 0 })
                        ]
                    },
                    animationsModel: DedMorozScene.models.dm_animations,
                    size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.fake_beard_3.renderIndex+1)

        this.main_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'main_p')) })

                    this.registerFramesDefaultTimer({});
            }
        }), layersData.main_d.renderIndex+1)

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) })

                    this.registerFramesDefaultTimer({});
            }
        }), layersData.tree_04.renderIndex+1)

        this.train = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let trainImg = PP.createImage(model, { renderOnly: ['train_2'] });

                let xValues = easing.fast({ from: -130, to: 130, steps: 300, type: 'linear', round: 0 });

                this.frames = new Array(300).fill(undefined);

                for(let f = 0; f < 300; f++) {
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(trainImg, xValues[f], 0);
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.train.renderIndex)

        this.text = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let text1Img = PP.createImage(model, { renderOnly: ['text1'] })
                let text2Img = PP.createImage(model, { renderOnly: ['text2'] })

                let yClamps = [7,16]

                let t1Pixels = getPixelsAsMatrix(text1Img, this.size);
                let t2Pixels = getPixelsAsMatrix(text2Img, this.size);

                let createGlitch = (pixels) => createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < pixels.length; y++) {
                        if( pixels[y] == undefined)
                            continue;

                        let isLeft = getRandomBool();
                        let xShift = getRandomInt(2,20)*(isLeft ? -1 : 1)

                        for(let x = 0; x < pixels[y].length; x++) {
                            if(pixels[y][x] == undefined)
                                continue;

                            hlp.setFillColor(`rgba(${pixels[y][x][0]}, ${pixels[y][x][1]}, ${pixels[y][x][2]})`).dot(x + xShift, y);
                        }
                    }
                })

                let f1 = createGlitch(t1Pixels)
                let f2 = createGlitch(t1Pixels)
                let f3 = createGlitch(t2Pixels)
                let f4 = createGlitch(t2Pixels)

                this.frames = [
                    ...new Array(130).fill(text1Img),
                    ...new Array(5).fill(f1),
                    ...new Array(5).fill(f2),
                    ...new Array(5).fill(f3),
                    ...new Array(5).fill(f4),
                    ...new Array(130).fill(text2Img),
                    ...new Array(5).fill(f3),
                    ...new Array(5).fill(f4),
                    ...new Array(5).fill(f1),
                    ...new Array(5).fill(f2),
                ]

                this.registerFramesDefaultTimer({});
            }
        }), layersData.text1.renderIndex)

        this.bagShine = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createShineFrames({framesCount, itemsCount, itemFramesLength, size}) {
                let frames = [];
                
                let points = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'bag_zone'));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFramesLength);
                
                    let p = points[getRandomInt(0, points.length)];

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            visible: true
                        };
                    }
                
                    return {
                        p,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('#CAF280').dot(itemData.p.point)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createShineFrames({ framesCount: 300, itemsCount: 100, itemFramesLength: [10, 20], size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.main_d.renderIndex+1)
    }
}