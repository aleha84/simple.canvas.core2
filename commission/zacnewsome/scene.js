class ZacnewsomeNeonScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
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
    createFallDropsFrames({framesCount, itemsCount, size, line, dots, maxY, fallFramesLength, maxLength, color}) {
        let frames = [];
        
        if(line){
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                let pp = new PP({ctx});
                if(line){
                    dots = pp.lineL(line);
                }
            })
        }

        if(!color)
            color = `rgba(255,255,255,${(getRandomInt(10, 25)/100)})`

        

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let dotIndex = getRandomInt(0, dots.length-1);
            let x = dots[dotIndex].x;
            let startY = dots[dotIndex].y;
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = fallFramesLength;
            let lengthValues = easing.fast({from: 1, to: maxLength, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v))
            let yValues = easing.fast({from: startY, to: maxY, steps: totalFrames, type: 'quad', method: 'in'}).map(v => fast.r(v))

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                frames[frameIndex] = {
                    y: yValues[f],
                    length: lengthValues[f]
                };
            }

            return {
                x,
                frames,
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsCount; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let frameValues=  itemData.frames[f];
                        hlp.setFillColor(color).rect(itemData.x,frameValues.y, 1, frameValues.length)
                    }
                    
                }
            });
        }
        
        return frames;
    }
    createSplashFrames({framesCount, itemsCount, size, line, poligon, color}) {
        let frames = [];

        let dots = [];

        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            let pp = new PP({ctx});
            if(line){
            dots = pp.lineL(line);
            }
            else if(poligon) {
                dots = pp.fillByCornerPoints(poligon);
            }
        })
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = getRandomInt(5,10);
            if(!color)
                color = `rgba(255,255,255,${(getRandomInt(10, 25)/100)})`
            let dotIndex = getRandomInt(0, dots.length-1)

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
                dotIndex,
                color,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsCount; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let dot = dots[itemData.dotIndex]
                        hlp.setFillColor(itemData.color).dot(dot.x,dot.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }
    createnameRainFrames({framesCount, itemsCount, size,color, xClamps = [], lengthClamps = [], framesPerDropClamps = [], bottomYClamp = []}) {
        let frames = [];
        
        if(typeof(color) == 'string')
            color = colors.rgbStringToObject({value: color, asObject: true});
    
        let yTo = size.y;
        if(bottomYClamp.length){
            yTo = getRandomInt(bottomYClamp[0], bottomYClamp[1]); 
        }

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let x = getRandomInt(xClamps[0], xClamps[1]);
            let startY = getRandomInt(-lengthClamps[0]*2, -lengthClamps[0]);
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = getRandomInt(framesPerDropClamps[0], framesPerDropClamps[1]);
            let yValues = easing.fast({from: startY, to: yTo, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));
            let length = getRandomInt(lengthClamps[0], lengthClamps[1]);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                let y = yValues[f]
                frames[frameIndex] = {
                    y
                };
            }

            let upperOpacityValues = easing.fast({from: color.opacity, to: color.opacity/3, steps: fast.r(length*3/4), type: 'quad', method: 'in' }).map(v => fast.r(v,2))
            let bottomOpacityValues = easing.fast({from: color.opacity, to: color.opacity/3, steps: fast.r(length*1/4), type: 'quad', method: 'out' }).map(v => fast.r(v,2))

            return {
                x,
                upperOpacityValues,
                bottomOpacityValues,
                length,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsCount; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let y = itemData.frames[f].y
                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false}))
                        .dot(itemData.x, y)
                        //.rect(itemData.x, y, 1, itemData.length)
                        

                        let l = fast.r(itemData.length*3/4);
                        for(let i = 0 ; i < l; i++){
                            let opacity = itemData.upperOpacityValues[i];
                            let _y = y-i-1
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false})).dot(itemData.x, _y)
                        }

                        l = fast.r(itemData.length*1/4);
                        for(let i = 0 ; i < l; i++){
                            let opacity = itemData.bottomOpacityValues[i];
                            let _y = y+i+1;
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false})).dot(itemData.x, _y)
                        }
                    }
                    
                }
            });
        }
        
        return frames;
    }
    start(){
        var model = ZacnewsomeNeonScene.models.main;
        var exludes = ['f_1', 'f_2', 'l_d_1', 'l_d_2']
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(exludes.indexOf(name) == -1){
                this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}) 
                }), l*10)
            }
            else {
                model.main.layers[l].visible = true;
            }
            
            

            console.log(l + ' - ' + name)
        }

        this.f1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(model, {renderOnly: ['f_1']}) ,
            isVisible: false,
            init() {

                this.counter = 50;
                this.timer = this.regTimerDefault(15, () => {
                    this.counter--;

                    if(this.counter == 0){
                        this.isVisible = !this.isVisible;
                        this.counter = 100;
                    }
                    
                })
            }
        }), 200)

        this.f2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(model, {renderOnly: ['f_2']}) ,
            isVisible: false,
            init() {

                this.counter = 25;
                this.timer = this.regTimerDefault(15, () => {
                    this.counter--;

                    if(this.counter == 0){
                        this.isVisible = !this.isVisible;
                        this.counter = 100;
                    }
                    
                })
            }
        }), 200)

        this.l_d_2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(model, {renderOnly: ['l_d_2']}) ,
            isVisible: false,
            init() {

                this.counter = 100;
                this.timer = this.regTimerDefault(15, () => {
                    this.counter--;

                    if(this.counter == 0){
                        this.isVisible = !this.isVisible;
                        this.counter = 100;
                    }
                    
                })
            }
        }), 100)

        this.l_d_1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(model, {renderOnly: ['l_d_1']}) ,
            isVisible: false,
            init() {
                this.sequence = [];
                this.counter = 100;
                this.timer = this.regTimerDefault(15, () => {
                    if(this.sequence.length){
                        this.isVisible = this.sequence.shift();
                    }


                    this.counter--;

                    if(this.counter == 0){
                        this.sequence = [true,true, false,false, true,true, false, false];
                        this.counter = 100;
                    }
                    
                })
            }
        }), 200)

        this.flow = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createFlowFrames({framesCount, itemsCount, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = 40;
                    let direction = getRandomBool();
                    let xValues = (direction 
                        ? easing.fast({from: 108, to: 110, steps: totalFrames, type: 'linear', method: 'base'}) 
                        : easing.fast({from: 110, to: 108, steps: totalFrames, type: 'linear', method: 'base'})).map(v => fast.r(v)) ;
                    let y = getRandomInt(136,139);
                    let frames = [];
                    let color = direction ? `rgba(251,3,59,${getRandomInt(2,4)/10})` : `rgba(246,234,196,${getRandomInt(1,3)/10})`

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
        
                        frames[frameIndex] = {
                            x: xValues[f]
                        };
                    }

                    return {
                        y,
                        color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.color).dot(itemData.frames[f].x, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createFlowFrames({framesCount: 200, itemsCount: 10, size: this.size})
              this.currentFrame = 0;
              this.img = this.frames[this.currentFrame];
              
              this.timer = this.regTimerDefault(15, () => {
              
                  this.img = this.frames[this.currentFrame];
                  this.currentFrame++;
                  if(this.currentFrame == this.frames.length){
                      this.currentFrame = 0;
                  }
              })  
            }
        }), 201)

        let size = this.viewport.clone();
        let frMul = 1;
        let rainLayers = [
            { l: 51, framesCount: 1000, itemsCount: 1000, size, color: 'rgba(255,255,255,0.05)', lengthClamps: [2,3], xClamps: [90,135], bottomYClamp: [85,90], framesPerDropClamps: [40,45].map(v => fast.r(v*frMul)) },
            { l: 61, framesCount: 1000, itemsCount: 200, size, color: 'rgba(255,255,255,0.05)', lengthClamps: [5,10], xClamps: [62,80], bottomYClamp: [70,75], framesPerDropClamps: [20,25].map(v => fast.r(v*frMul)) },
            { l: 61, framesCount: 1000, itemsCount: 1000, size, color: 'rgba(255,255,255,0.1)', lengthClamps: [5,10], xClamps: [81, 140], bottomYClamp: [140,145], framesPerDropClamps: [40,45].map(v => fast.r(v*frMul)) },
            { createRedFrame: true, l: 170, framesCount: 1000, itemsCount: 1000, size, color: 'rgba(255,255,255,0.2)', lengthClamps: [10,15], xClamps: [0, size.x], framesPerDropClamps: [20,25].map(v => fast.r(v*frMul)) }
        ]

        this.rain = rainLayers.map(layer => this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size,
            frames: this.createnameRainFrames(layer),
            createRedFrame: layer.createRedFrame,
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
// if(this.createRedFrame){
//     if(!this.redFrame){
//         this.redFrame = this.addChild(new GO({
//             position: new V2(),
//             size: this.size,
//             img: createCanvas(this.size, (ctx, size, hlp) => {
//                 hlp.setFillColor('red').rect(0,0, 50, 50)
//             })
//         }));
//     }
//     else {
//         this.removeChild(this.redFrame);
//         this.redFrame = undefined;
//     }
// }
                       
                    }
                })
            }
        }), layer.l))

        this.smallSplashes = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size,
            createnameSplashFrames({framesCount, itemsCount, size, yClamps}) {
                let frames = [];
                
                // let aChange = easing.createProps({})
                // let aValues = [];

                

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(5,10);
                    let color = `rgba(255,255,255,${(getRandomInt(10, 25)/100)})`
                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(yClamps[0], yClamps[1]);

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
                        x,
                        y,
                        color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.color).dot(itemData.x,itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.mask = PP.createImage(ZacnewsomeNeonScene.models.main, {renderOnly: ['road_1']}) 
                this.frames = this.createnameSplashFrames({framesCount: 100, itemsCount: 1000, size: this.size, yClamps: [141,149]}).map(frame => 
                    createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mask, 0,0);
                        ctx.globalCompositeOperation  = 'source-in';
                        ctx.drawImage(frame, 0,0);
                    }))
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 62)

        let splashesLayers = [
            {l: 171, framesCount: 100, itemsCount: 20, color: 'rgba(255,255,255,0.2)', size, poligon: [new V2(123,131), new V2(122,129), new V2(123,127), new V2(124,123), new V2(129,123) ]},
            {l: 171, framesCount: 100, itemsCount: 20, color: 'rgba(255,255,255,0.1)', size, poligon: [new V2(137,120), new V2(139,114), new V2(149, 114), new V2(149,120) ]},
            {l: 171, framesCount: 100, itemsCount: 40, color: 'rgba(255,255,255,0.2)', size, poligon: [new V2(138,121), new V2(149,121), new V2(149, 125), new V2(140,123) ]},
            {l: 171, framesCount: 100, itemsCount: 20, color: 'rgba(255,255,255,0.15)', size, line: createLine(new V2(139, 110), new V2(149,110))},
            {l: 81, framesCount: 100, itemsCount: 70, color: 'rgba(255,255,255,0.15)', size, line: createLine(new V2(57, 63), new V2(114,61))},
            {l: 81, framesCount: 100, itemsCount: 70, color: 'rgba(255,255,255,0.05)', size, line: createLine(new V2(72,24), new V2(133,20))},
            {l: 101, framesCount: 100, itemsCount: 50, color: 'rgba(255,255,255,0.25)', size, line: createLine(new V2(50,43), new V2(114,40))},
            {l: 171, framesCount: 100, itemsCount: 30, color: 'rgba(255,255,255,0.3)', size, line: createLine(new V2(55,92), new V2(67,103))},
            {l: 171, framesCount: 100, itemsCount: 30, color: 'rgba(255,255,255,0.3)', size, line: createLine(new V2(43,54), new V2(28,48))},
            {l: 171, framesCount: 100, itemsCount: 50, color: 'rgba(255,255,255,0.3)', size, line: createLine(new V2(43,54), new V2(59,73))},
            {l: 171, framesCount: 100, itemsCount: 30, color: 'rgba(255,255,255,0.15)', size, line: createLine(new V2(80,109), new V2(84,113))},
            {l: 81, framesCount: 100, itemsCount: 30, color: 'rgba(255,255,255,0.10)', size, line: createLine(new V2(115,81), new V2(140,80))},
        ]

        this.splashes = splashesLayers.map(layer => this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size,
            frames: this.createSplashFrames(layer),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), layer.l))


        let fallDropsLayers = [
            {l: 170, framesCount:200, itemsCount: 15, size, line: createLine(new V2(71, 96), new V2(114,93)), maxY:146, fallFramesLength: 40, maxLength: 3, color: 'rgba(255,255,255,0.15)'},
            {l: 170, framesCount:200, itemsCount: 30, size, line: createLine(new V2(61, 59), new V2(114,57)), maxY:148, fallFramesLength: 40, maxLength: 5, color: 'rgba(255,255,255,0.2)'},
            {l: 170, framesCount:200, itemsCount: 15, size, line: createLine(new V2(51, 115), new V2(70,125)), maxY:148, fallFramesLength: 30, maxLength: 2, color: 'rgba(255,255,255,0.1)'},
            {l: 170, framesCount:200, itemsCount: 3, size, line: createLine(new V2(126, 123), new V2(129,123)), maxY:155, fallFramesLength: 20, maxLength: 2, color: 'rgba(255,255,255,0.3)'},
            {l: 170, framesCount:200, itemsCount: 5, size, line: createLine(new V2(4, 42), new V2(20,43)), maxY:155, fallFramesLength: 40, maxLength: 4, color: 'rgba(255,255,255,0.3)'},
            {l: 170, framesCount:200, itemsCount: 20, size, line: createLine(new V2(43, 59), new V2(59,77)), maxY:155, fallFramesLength: 40, maxLength: 4, color: 'rgba(255,255,255,0.2)'},
            {l: 170, framesCount:200, itemsCount: 10, size, line: createLine(new V2(57,87), new V2(117,85)), maxY:147, fallFramesLength: 35, maxLength: 4, color: 'rgba(255,255,255,0.3)'},
            {l: 80, framesCount:200, itemsCount: 10, size, line: createLine(new V2(115,97), new V2(141,96)), maxY:155, fallFramesLength: 30, maxLength: 4, color: 'rgba(255,255,255,0.3)'}
        ]

        this.fallDrops = fallDropsLayers.map(layer => this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size,
            frames: this.createFallDropsFrames(layer),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), layer.l))

    }
}