class Demo10IntouristScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'intourist'
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
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10IntouristScene.models.main, { exclude: ['d1', 'd2', 'd3', 'yaht', 'yaht_2'] }),
                }))

                this.movement = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createMovementFrames({framesCount, itemFrameslength, pointsData, size}) {
                        let frames = [];
                        
                        let itemsData = pointsData.map((pd, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                frames,
                                pd
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    extractPointData(layer) {
                        let data = [];
                        layer.groups.forEach(group => {
                            let color = group.strokeColor;
                            group.points.forEach(point => {
                                data.push({
                                    color, 
                                    point: point.point
                                });
                            })
                        })

                        return data;
                    },
                    init() {
                        let layers = [
                            this.createMovementFrames({framesCount: 200, itemFrameslength: 60, size: this.size, 
                                pointsData: this.extractPointData(Demo10IntouristScene.models.main.main.layers.find(layer => layer.name == 'd1'))}),
                            this.createMovementFrames({framesCount: 200, itemFrameslength: 120, size: this.size, 
                                pointsData: this.extractPointData(Demo10IntouristScene.models.main.main.layers.find(layer => layer.name == 'd2'))}),
                            this.createMovementFrames({framesCount: 200, itemFrameslength: 100, size: this.size, 
                                pointsData: this.extractPointData(Demo10IntouristScene.models.main.main.layers.find(layer => layer.name == 'd3'))})
                        ]

                        this.layers = layers.map(frames => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames, 
                            init() {
                                this.currentFrame = 0;
                                this.img = this.frames[this.currentFrame];
                                
                                this.timer = this.regTimerDefault(10, () => {
                                
                                    this.currentFrame++;
                                    if(this.currentFrame == this.frames.length){
                                        this.currentFrame = 0;
                                    }
        
                                    this.img = this.frames[this.currentFrame];
                                })
                            }
                        })))
                    }
                }))
            }
        }), 1)


        this.waves = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWavesFrames({framesCount, itemsCount, itemFrameslength, itemWidthClamps, itemWidthClamps2,size ,primaryColor, secondaryColor, xClamps}) {
                let frames = [];
                let yDelta = size.y - 97;
                let widthFromY = easing.fast({from: itemWidthClamps[0], to: itemWidthClamps[1], steps: yDelta, type: 'quad', method: 'in'}).map(v => fast.r(v));

                let secondaryWidthValues = [
                    ...easing.fast({from: itemWidthClamps2[0], to: itemWidthClamps2[1], steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v)),
                        ...easing.fast({from: itemWidthClamps2[1], to: itemWidthClamps2[0], steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v))
                ]

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let x = getRandomInt(0, size.x);
                    if(xClamps){
                        x = getRandomInt(xClamps[0], xClamps[1])
                    }
                    let yShift = getRandomInt(0, yDelta)
                    let y = 97 + yShift;
                    let width = widthFromY[yShift];//getRandomInt(itemWidthClamps[0], itemWidthClamps[1]);
                    let widthValues = [
                        ...easing.fast({from: 0, to: width, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v)),
                        ...easing.fast({from: width, to: 0, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut'}).map(v => fast.r(v))
                    ]

                    

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            width: widthValues[f],
                            width2: secondaryWidthValues[f]
                        };
                    }
                
                    return {
                        x,y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let width = itemData.frames[f].width;
                                if(width > 0){
                                    let xShift = fast.r(width/2);
                                    hlp.setFillColor(primaryColor).rect(itemData.x-xShift, itemData.y, width, 1)

                                    if(secondaryColor){
                                        let width2 = itemData.frames[f].width2
                                        hlp.setFillColor(secondaryColor)
                                        //hlp.setFillColor('red');
                                        hlp.rect(itemData.x-xShift, itemData.y, width2, 1)
                                        hlp.rect(itemData.x-xShift + width - width2, itemData.y, width2, 1)
                                    }
                                }
                                    //hlp.setFillColor('red').rect(50,50, 20,20);
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let layers = [
                    this.createWavesFrames(
                        {framesCount: 200, itemsCount: 400, itemFrameslength: 150, size: this.size, itemWidthClamps: [5,15], itemWidthClamps2: [1,2], 
                            primaryColor: '#46706f', secondaryColor: undefined}),
                    this.createWavesFrames(
                        {framesCount: 200, itemsCount: 200, itemFrameslength: 150, size: this.size, itemWidthClamps: [5,15], itemWidthClamps2: [0,1], 
                            primaryColor: '#83a0a9', secondaryColor: '#65888c'}),
                    this.createWavesFrames(
                        {framesCount: 200, itemsCount: 200, itemFrameslength: 150, size: this.size, itemWidthClamps: [5,15], itemWidthClamps2: [0,1], 
                            primaryColor: '#284f42', secondaryColor: '#376059'}),
                    this.createWavesFrames(
                        {framesCount: 200, itemsCount: 50, itemFrameslength: 150, size: this.size, itemWidthClamps: [5,10], itemWidthClamps2: [0,1], 
                            primaryColor: '#a2ada3', secondaryColor: '#748f89', xClamps: [20, 80]})
                ]


                this.layers = layers.map(frames => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames, 
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.frames[this.currentFrame];
                        })
                    }
                })))
            }
        }), 2)


        this.sparkles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSparklesFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(97, size.y);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        x,y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('#e4f2fb').dot(itemData.x,itemData.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createSparklesFrames({framesCount: 200, itemsCount: 200, itemFrameslength: 10, size: this.size})

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[this.currentFrame];
                })
            }
        }),3)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createYahtFrames({framesCount, size}) {
                let frames = [];
                let yahtImage1 = PP.createImage(Demo10IntouristScene.models.main, { renderOnly: ['yaht'] })
                let yahtImage2 = PP.createImage(Demo10IntouristScene.models.main, { renderOnly: ['yaht_2'] })
                let fl = fast.r(framesCount*2/3);
                let xValues = [
                    ...easing.fast({from: size.x, to: 0, steps: fl, type: 'quad', method: 'out'}).map(v => fast.r(v)),
                    ...easing.fast({from: 0, to: -size.x, steps: framesCount - fl, type: 'quad', method: 'in'}).map(v => fast.r(v))
                ]

                let tailLengthValues = [
                    ...easing.fast({from: 6, to: 0, steps: fl, type: 'quad', method: 'out'}).map(v => fast.r(v)),
                    ...easing.fast({from: 0, to: 15, steps: framesCount - fl, type: 'quad', method: 'in'}).map(v => fast.r(v))
                ]

                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let x = xValues[f];

                        let img = yahtImage1;
                        if(f > fl)
                            img = yahtImage2;

                        ctx.drawImage(img, x, 0);

                        hlp.setFillColor('#d8dacf').rect(50 + x, 99, tailLengthValues[f], 1);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createYahtFrames({framesCount: 600, size: this.size})

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 4)
    }
}