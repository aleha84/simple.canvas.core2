class AbsentMp3Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
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
    createRainFrames({framesCount, itemsCount, xClamps, yClamps, lowerYDelta, itemFrameslength, length, color, size, after}) {
        let frames = [];
        
        if(typeof(color) == 'string')
            color = colors.rgbStringToObject({value: color, asObject: true});

        let opacityValues = easing.fast({from: color.opacity, to: 0.01, steps: length, type: 'quad', method: 'in'});

        if(after) {
            after.color =  colors.rgbStringToObject({value: after.color, asObject: true});
            after.opacityValues = easing.fast({from: after.color.opacity, to: 0, steps: after.framesLength, type: 'quad', method: 'out'}).map(v => fast.r(v, 2))

            if(after.poligon){
                after.availableDots = [];
            
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    after.availableDots = pp.fillByCornerPoints(after.poligon);
                })
            }
            
        }

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;

            let x = getRandomInt(xClamps[0], xClamps[1]);
            let y = yClamps[1] + getRandomInt(-lowerYDelta, lowerYDelta);
            let yValues = easing.fast({from: yClamps[0], to: y, steps: totalFrames, type: 'linear', method: 'base'})

            let frames = [];

            let lastFrameIndex = 0;
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                lastFrameIndex = frameIndex;

                frames[frameIndex] = {
                    y: yValues[f]
                };
            }

            if(after){
                let availableDot = new V2(x, y+1);
                let addingAfterFrames = true;
                if(after.availableDots){
                    addingAfterFrames = after.availableDots.filter(ad => ad.x == availableDot.x && ad.y == availableDot.y).length != 0
                }

                if(addingAfterFrames) {
                    for(let f = 0; f < after.framesLength; f++){
                        let frameIndex = f + lastFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
    
                        frames[frameIndex] ={
                            x,
                            y: y+1,
                            after: {
                                opacity: after.opacityValues[f]
                            }
                        }
                    }
                }
            }

            return {
                x,
                yValues,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        if(itemData.frames[f].after){

                            hlp.setFillColor(colors.rgbToString({
                                value: [after.color.red, after.color.green, after.color.blue, itemData.frames[f].after.opacity], isObject: false}))
                                if(after.width > 1){
                                    hlp.rect(itemData.frames[f].x-fast.r(after.width/2), itemData.frames[f].y, after.width, 1)
                                }
                                else if(after.width == 1){
                                    hlp.dot(itemData.frames[f].x, itemData.frames[f].y)
                                }
                                
                        }
                        else {
                            let y = itemData.frames[f].y;
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false})).dot(itemData.x, y-2)
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, fast.r(color.opacity/2,3)], isObject: false})).dot(itemData.x, y-1)
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, fast.r(color.opacity/4,3)], isObject: false})).dot(itemData.x, y)
                            
                            for(let i =0; i < length; i++){
                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacityValues[i]], isObject: false})).dot(itemData.x, y-2-1-i);
                            }
                        }
                        
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        let model = AbsentMp3Scene.models.main;
        var exludes = ['win_1']
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(exludes.indexOf(name) == -1){
                this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}) 
                }), l*10)
            }
        }

        this.win1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(model, {renderOnly: ['win_1']}),
            isVisible: false,
            init() {
                this.currentFrame = 0;
                let visibleClamps = [50,100];

                this.timer = this.regTimerDefault(15, () => {
                    this.isVisible = isBetween(this.currentFrame, visibleClamps[0], visibleClamps[1])

                    this.currentFrame++;
                    if(this.currentFrame == 500){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 1)
        // this.main = this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: this.viewport,
        //     img: PP.createImage(AbsentMp3Scene.models.main)
        // }), 1)

        //80, 140
        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 100, xClamps: [0, 80], yClamps: [0, 130], 
                lowerYDelta: 20, itemFrameslength: 15, length: 12, color: 'rgba(255,255,255, 0.1)', size: this.viewport,
                after: { color: 'rgba(0,0,0,0.2)', framesLength: 40, width: 4 }
            }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        //         if(!this.redFrame){
                        //     this.redFrame = this.addChild(new GO({
                        //         position: new V2(),
                        //         size: this.size,
                        //         img: createCanvas(this.size, (ctx, size, hlp) => {
                        //             hlp.setFillColor('red').rect(0,0, 50, 50)
                        //         })
                        //     }));
                        // }
                        // else {
                        //     this.removeChild(this.redFrame);
                        //     this.redFrame = undefined;
                        // }
                    }
                })
            }
        }), 120)

        let poligonPoints = [
            new V2(0,114),
            new V2(47,85),
            new V2(74,69),
            new V2(86,70),
            new V2(101,102)
        ]

        this.midRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 300, xClamps: [0, 80], yClamps: [0, 100], 
                lowerYDelta: 20, itemFrameslength: 17, length: 6, color: 'rgba(255,255,255, 0.07)', size: this.viewport,
                after: { color: 'rgba(0,0,0,0.15)', framesLength: 30, width: 2, poligon: poligonPoints }}),
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
        }), 115)

        this.farRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 600, xClamps: [30, 85], yClamps: [0, 80], 
                lowerYDelta: 20, itemFrameslength: 22, length: 4, color: 'rgba(255,255,255, 0.05)', size: this.viewport,
                after: { color: 'rgba(0,0,0,0.15)', framesLength: 25, width: 1, poligon: poligonPoints }}),
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
        }), 110)

        this.bgRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 1000, xClamps: [55, 88], yClamps: [0, 66], 
                lowerYDelta: 1, itemFrameslength: 50, length: 2, color: 'rgba(255,255,255, 0.015)', size: this.viewport,
                }),
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
        }), 5)

        let splashesPoligon = [
            new V2(0, 80),
            new V2(20, 76),
            new V2(37, 73),
            new V2(52, 71),
            new V2(64, 69),
            new V2(69, 68),
            new V2(76, 67),
            new V2(66, 72),
            new V2(51, 81),
            new V2(29, 95),
            new V2(0, 113)
        ]

        this.splashes = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createSplashFrames({ framesCount: 500, itemsCount: 200, color: 'rgba(255,255,255,0.05)', poligon: splashesPoligon, size: this.viewport}),
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
        }), 11)

        this.smoke = this.addGo(new GO({
            position: new V2(87,81),
            size: new V2(20, 20),
            createSmokeFrames({framesCount, itemsCount, size, color}) {
                let frames = [];
                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});

                //let height = size.y;
                //
                
                let angleValues = easing.fast({from: 0, to: 359, steps: framesCount, type: 'linear', method: 'base'});

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let height = fast.r(size.y/3)//getRandomInt(size.y/3, size.y);
                    let aValues = easing.fast({from: color.opacity, to: 0, steps: height, type: 'quad', method: 'in'}).map(v => fast.r(v, 1))
                    let mul = easing.fast({from: 0, to: 2, steps: height, type:'linear', method: 'base'})
                    return {
                        height,
                        aValues,
                        mul,
                        xShift: 0,//getRandomInt(-2,2),
                        initialAngle: getRandomInt(0,359)//getRandomInt(0, framesCount-1)
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            let initialAngle = itemData.initialAngle + angleValues[f];
                            if(initialAngle > 360)
                                initialAngle-=360;
                            
                            for(let y = 0; y < itemData.height; y++){
                                let opacity = itemData.aValues[y];
                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false}));
                                let x = Math.cos(degreeToRadians(  (initialAngle + y*10)*3  )  )*itemData.mul[y];
                                x= fast.r( x + size.x/2) + itemData.xShift;

                                hlp.dot(x, size.y-y)
                            }
                        }
                    });
                }

                return frames.reverse();
            },
            init() {
                this.frames = this.createSmokeFrames({ framesCount: 250, itemsCount: 1, size: this.size, color: 'rgba(151,164,173,0.35)' })

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
        }), 100)
    }
}