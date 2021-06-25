class InterfaceScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1000, 665),//new V2(2000, 1330),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'interface',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = InterfaceScene.models.main;
        let layersData = {};
        let exclude = [
            'man', 'device5_contentZone', 'device5_content', 'device2_contentZone',
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

        this.man = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                console.log('man init')
                this.frames = PP.createImage(InterfaceScene.models.manFrames)
                let totalFrames = 300;
                let animationLenght = 30;

                let framesIndies = [
                    // ...new Array( (totalFrames - animationLenght*2)/2 ).fill(0),
                    // ...easing.fast({ from: 0, to: this.frames.length-1, steps: animationLenght, type: 'quad', method: 'inOut', round: 0 }),
                    // ...new Array( (totalFrames - animationLenght*2)/2 ).fill(this.frames.length-1),
                    // ...easing.fast({ from: this.frames.length-1, to: 0, steps: animationLenght, type: 'quad', method: 'inOut', round: 0 }),

                    ...new Array( 60 ).fill(0),
                    ...easing.fast({ from: 0, to: 2, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array( 30 ).fill(2),
                    ...easing.fast({ from: 2, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array( 60 ).fill(0),
                    ...easing.fast({ from: 0, to: this.frames.length-1, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                    ...new Array( 30 ).fill(this.frames.length-1),
                    ...easing.fast({ from: this.frames.length-1, to: 0, steps: 30, type: 'quad', method: 'inOut', round: 0 }),
                ]

                this.currentFrame = 0;
                this.img = this.frames[framesIndies[this.currentFrame]];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == framesIndies.length){
                        this.currentFrame = 0;
                    }

                    this.img = this.frames[framesIndies[this.currentFrame]];
                })
            }
        }), layersData.man.renderIndex)

        this.controllerActivity = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createActivityFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let points = [new V2(70, 116), new V2(71,116), new V2(107,85), new V2(57,84), new V2(11,92), new V2(87,101)]

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    
                    let p = points[getRandomInt(0, points.length-1)]//new V2(getRandomInt(70,71),116)

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        p,
                        color: getRandomBool() ? '#a0e3e9' : '#7BF6F1',
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.color).dot(itemData.p) //'#c4cfe0'
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createActivityFrames({framesCount: 100, itemsCount: 50, itemFrameslength: 10, size: this.size})
                this.registerFramesDefaultTimer({});
            }
        }), layersData.controller.renderIndex+1)

        this.device3Activity = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let p1 = new V2(73,78);
                let p2 = new V2(84,73);
                let p3 = new V2(86,98);

                let vLine = []
                let hLine = [];

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    hLine = pp.lineV2(p1, p2).map(p => new V2(p))
                    vLine = pp.lineV2(p1, p3).map(p => new V2(p))
                })

                let totalFrames = 300;
                let framesPerLine = fast.r(totalFrames/(vLine.length-1))
                let currentLineFramesCount = 0;
                let lineIndex = 0;

                let hLineIndexChange = easing.fast({from: 0, to: framesPerLine, steps:  hLine.length-1, type: 'linear', round: 0})
                let placed = [];
                this.frames = []

                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        
                        placed.forEach(p => {
                            hlp.setFillColor('#adb2b7').dot(p)
                        })

                        let index = hLineIndexChange.indexOf(currentLineFramesCount);
                        if(index!=-1) {
                            if(getRandomInt(0,4) != 0) {
                                placed.push(hLine[index].add(new V2(vLine[lineIndex].x - p1.x, vLine[lineIndex].y-p1.y)))
                            }
                        }

                        currentLineFramesCount++;

                        if(currentLineFramesCount == framesPerLine) {
                            currentLineFramesCount = 0;
                            lineIndex++;
                        }
                    });
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.devices3.renderIndex+1)

        this.device2Activity = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createActivityFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let contentZone = PP.createImage(model, { renderOnly: ['device2_contentZone'] })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let p = new V2(
                        getRandomInt(0,16),
                        getRandomInt(60,80)
                    )

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        p,
                        frames
                    }
                })
                
                let linePoints = undefined;
                let linePointsIndexValues = undefined;

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        if(!linePoints) {
                            let pp = new PP({ctx});
                            pp.setFillStyle('rgba(0,0,0,0)')
                            linePoints = pp.lineV2(new V2(5,79), new V2(15,74))
                            linePointsIndexValues = easing.fast({ from: 0, to: linePoints.length-1, steps: framesCount, type: 'linear', round: 0 })
                        }

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('rgba(255,255,255,0.05)').dot(itemData.p);
                            }
                        }

                        ctx.globalCompositeOperation  = 'destination-in';
                        ctx.drawImage(contentZone, 0, 0)

                        ctx.globalCompositeOperation  = 'source-over';

                        ctx.globalAlpha = 0.5
                        for(let i = 0; i < linePointsIndexValues[f]; i++) {
                            hlp.setFillColor('#FF0000').dot(linePoints[i])
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createActivityFrames({ framesCount: 300, itemsCount: 200, itemFrameslength: 10, size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.device2_content.renderIndex+1)

        this.device5Activity = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createActivityFrames({framesCount,  size}) {
                let frames = [];
                
                let contentZone = PP.createImage(model, { renderOnly: ['device5_contentZone'] })
                let contentImg = PP.createImage(model, { renderOnly: ['device5_content'] })

                let actionFrames = [0, 250];
                let moveInFrames = [250, 300];

                let moveInYValues = easing.fast({from: 0, to: 17, steps: moveInFrames[1] - moveInFrames[0], type: 'quad', method: 'inOut', round: 0});
                let contentImgModified = createCanvas(size, (ctx, _size, hlp) => {
                    ctx.drawImage(contentImg, 0,0);
                });


                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        if(f >= actionFrames[0] && f < actionFrames[1]) {

                            if(f == 60) {
                                contentImgModified = createCanvas(size, (ctx, _size, _hlp) => {
                                    ctx.drawImage(contentImgModified, 0,0);
                                    _hlp.setFillColor('#e26870').dot(121,75)
                                });
                            }

                            if(f == 90) {
                                contentImgModified = createCanvas(size, (ctx, _size, _hlp) => {
                                    ctx.drawImage(contentImgModified, 0,0);
                                    _hlp.setFillColor('#667d77').dot(123,75)
                                });
                            }

                            if(f == 120 ) {
                                contentImgModified = createCanvas(size, (ctx, _size, _hlp) => {
                                    ctx.drawImage(contentImgModified, 0,0);
                                    _hlp.setFillColor('#8a8a92').rect(122,78, 2,1)
                                });
                            }

                            if(f == 130 ) {
                                contentImgModified = createCanvas(size, (ctx, _size, _hlp) => {
                                    ctx.drawImage(contentImgModified, 0,0);
                                    _hlp.setFillColor('#8a8a92').rect(125,78, 1,1)
                                });
                            }

                            if(f == 140 ) {
                                contentImgModified = createCanvas(size, (ctx, _size, _hlp) => {
                                    ctx.drawImage(contentImgModified, 0,0);
                                    _hlp.setFillColor('#8a8a92').rect(127,78, 4,1)
                                });
                            }

                            ctx.drawImage(contentImg, 0, -17)
                            ctx.drawImage(contentImgModified, 0, 0)
                            ctx.drawImage(contentImg, 0, 17)
                            ctx.drawImage(contentImg, 0, 17 + 14)
                        }
                        else {
                            let i = f - moveInFrames[0];
                            let yShift = moveInYValues[i];
                            ctx.drawImage(contentImg, 0, -17 - yShift)
                            ctx.drawImage(contentImgModified, 0, 0 - yShift)
                            ctx.drawImage(contentImg, 0, 17 - yShift)
                            ctx.drawImage(contentImg, 0, 17 + 14 + 3 - yShift)
                        }

                        ctx.globalCompositeOperation  = 'destination-in';
                        ctx.drawImage(contentZone, 0, 0)
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createActivityFrames({framesCount: 300, size: this.size})
                this.registerFramesDefaultTimer({});
            }
        }),layersData.devices5.renderIndex+1)


        this.deviceActivity1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createActivityFrames({bottomLeft, framesCount, itemsCount, itemFrameslength, size, shiftData, heightClamps}) {
                
                let frames = [];
                itemFrameslength = framesCount/itemsCount;
                
                let eTypes = ['linear', 'sin', 'quad', 'cubic', 'expo'];
                let eMethods = ['in', 'out', 'inOut'];

                let data = new Array(itemsCount).fill().map((el, i) => {
                    let type = eTypes[getRandomInt(0, eTypes.length-1)]
                    let method = type != 'linear' 
                        ? eMethods[getRandomInt(0, eMethods.length-1)]
                        : 'base'
                    return {
                        //height: getRandomInt(3, 10),
                        color: getRandomBool() ? '#9FD1E4' : '#ECB5C2',
                        heightValuesChange: easing.fast({ from: 0, to: getRandomInt(heightClamps), steps: itemFrameslength, type, method, round: 0 })
                    }
                })

                let currentItem = 0;
                let currentItemFrames = 0;

                let shiftDots = undefined
                let shiftLineP1 = shiftData.p1 //new V2(37,88);
                let shiftLineP2 = shiftData.p2 // new V2(90, 76)

                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        if(!shiftDots) {
                            let pp = new PP({ctx})
                            pp.setFillStyle('rgba(0,0,0,0)');

                            shiftDots = pp.lineV2(shiftLineP1, shiftLineP2).map(p => new V2(p).substract(shiftLineP1));
                        }
                        for(let i = 1; i < itemsCount; i++) {
                            let ci = currentItem + i;
                            if(ci > (itemsCount - 1))
                                ci-=itemsCount;
    
                            let di = data[ci]
    
                            hlp.setFillColor(di.color);
                            let h = di.heightValuesChange[di.heightValuesChange.length-1]

                            let x = bottomLeft.x + i;
                            let shiftY = shiftDots.find(p => p.x == x-shiftLineP1.x).y;

                            hlp.rect(x, bottomLeft.y - h + shiftY, 1, h)
                        }
    
                        let dataItem = data[currentItem];
                        hlp.setFillColor(dataItem.color);
                        let h = dataItem.heightValuesChange[currentItemFrames];

                        let x = bottomLeft.x + itemsCount;
                        let shiftY = shiftDots.find(p => p.x == x-shiftLineP1.x).y;

                        hlp.rect(bottomLeft.x + itemsCount, bottomLeft.y - h + shiftY, 1, h)
    
                        currentItemFrames++;
                        if(currentItemFrames == itemFrameslength) {
                            currentItem++;
                            currentItemFrames = 0;
                           
                        }
                    });
                    
                }
                
                return frames;
            },
            init() {
                this.activity1 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    frames: this.createActivityFrames({ heightClamps: [3,10], bottomLeft: new V2(38,86), framesCount: 300, itemsCount: 50, size: this.size, shiftData: { p1: new V2(37,88), p2: new V2(90, 76) } }),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.activity2 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    frames: this.createActivityFrames({ heightClamps: [1,8], bottomLeft: new V2(40,52), framesCount: 300, itemsCount: 10, size: this.size, 
                        shiftData: { p1: new V2(37,53), p2: new V2(90, 48) } }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.activity2_1 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    frames: this.createActivityFrames({ heightClamps: [1,8], bottomLeft: new V2(55,52), framesCount: 300, itemsCount: 10, size: this.size, 
                        shiftData: { p1: new V2(37,53), p2: new V2(90, 48) } }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.activity3 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    frames: this.createActivityFrames({ heightClamps: [1,15], bottomLeft: new V2(41,70), framesCount:300, itemsCount: 20, size: this.size, 
                        shiftData: { p1: new V2(37,72), p2: new V2(90, 62) } }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.activity5 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    createActivityFrames({topLeft,framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);
                        
                            let yShift = getRandomInt(0, 17)

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                color: getRandomBool() ? '#9FD1E4' : '#ECB5C2',
                                yShift,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.color).rect(topLeft.x, topLeft.y + itemData.yShift, 3, 1)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createActivityFrames({ topLeft: new V2(72,44), framesCount: 300, itemsCount: 50, itemFrameslengthClamps: [10,30], size: this.size })

                        this.registerFramesDefaultTimer({});
                        //17
                        //new V2(72,44)
                    }
                }))

                this.activity4 = this.addChild(new GO({ 
                    position: new V2(),
                    size: this.size,
                    createActivityFrames({framesCount, itemsCount, topRight, size}) {
                        let frames = [];
                        let itemFrameslength = framesCount/itemsCount;
                        
//'#9FD1E4' : '#ECB5C2'

                        let itemsData = 
                        [
                            ...new Array(itemsCount).fill().map((el, i) => {
                                //let isUp = i <= itemsCount;
                                
                                let startFrameIndex = i*itemFrameslength
    
                                let eTypes = ['linear', 'sin', 'quad', 'cubic', 'expo'];
                                let eMethods = ['in', 'out', 'inOut'];
    
                                let type = eTypes[getRandomInt(0, eTypes.length-1)]
                                let method = type != 'linear' 
                                    ? eMethods[getRandomInt(0, eMethods.length-1)]
                                    : 'base'
    
                                let totalFrames = framesCount;
                                let widthValues = easing.fast({ from: 5, to: 1, steps: framesCount, type, method, round: 0 })
                                let yShiftValues = easing.fast({ from: 0, to: itemsCount, steps: framesCount, type: 'linear', round: 0 })

                                let frames = [];
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        width: widthValues[f],
                                        yShift: yShiftValues[f]
                                    };
                                }
                            
                                return {
                                    frames,
                                    color: '#ECB5C2'//isUp == 0 ? '#9FD1E4' : '#ECB5C2'
                                }
                            }),
                            ...new Array(itemsCount).fill().map((el, i) => {
                                //let isUp = i <= itemsCount;
                                
                                let startFrameIndex = i*itemFrameslength
    
                                let eTypes = ['linear', 'sin', 'quad', 'cubic', 'expo'];
                                let eMethods = ['in', 'out', 'inOut'];
    
                                let type = eTypes[getRandomInt(0, eTypes.length-1)]
                                let method = type != 'linear' 
                                    ? eMethods[getRandomInt(0, eMethods.length-1)]
                                    : 'base'
    
                                let totalFrames = framesCount;
                                let widthValues = easing.fast({ from: 5, to: 1, steps: framesCount, type, method, round: 0 })
                                let yShiftValues = easing.fast({ from: itemsCount*2, to: itemsCount+1, steps: framesCount, type: 'linear', round: 0 })
                                //isUp 
                                    // ? easing.fast({ from: 0, to: itemsCount, steps: framesCount, type: 'linear', round: 0 })
                                    // : easing.fast({ from: (itemsCount*2), to: itemsCount, steps: framesCount, type: 'linear', round: 0 })
                            
                                let frames = [];
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        width: widthValues[f],
                                        yShift: yShiftValues[f]
                                    };
                                }
                            
                                return {
                                    frames,
                                    color: '#9FD1E4'//isUp == 0 ? '#9FD1E4' : 
                                }
                            })
                        ]
                        
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                hlp.setFillColor('#ECB5C2').rect(topRight.x-5, topRight.y, 5, 1)
                                hlp.setFillColor('#9FD1E4').rect(topRight.x-5, topRight.y + itemsCount*2, 5, 1)
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(itemData.color).rect(topRight.x - itemData.frames[f].width, topRight.y + itemData.frames[f].yShift, itemData.frames[f].width, 1)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {

                        this.frames = this.createActivityFrames({ framesCount: 300, itemsCount: 10, topRight: new V2(88,41), size: this.size } )
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.devices1.renderIndex+1)

        this.man_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'man_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.man.renderIndex+2)
    }
}