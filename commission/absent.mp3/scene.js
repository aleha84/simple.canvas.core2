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

    createRainFrames({framesCount, itemsCount, xClamps, yClamps, lowerYDelta, itemFrameslength, length, color, size}) {
        let frames = [];
        
        if(typeof(color) == 'string')
            color = colors.rgbStringToObject({value: color, asObject: true});

        let opacityValues = easing.fast({from: color.opacity, to: 0.01, steps: length, type: 'quad', method: 'in'})

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;

            let x = getRandomInt(xClamps[0], xClamps[1]);
            //let y = getRandomInt(yClamps[0], yClamps[1]);
            let yValues = easing.fast({from: yClamps[0], to: yClamps[1] + getRandomInt(-lowerYDelta, lowerYDelta), steps: totalFrames, type: 'linear', method: 'base'})

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
                yValues,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let y = itemData.frames[f].y;
                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false})).dot(itemData.x, y-2)
                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, fast.r(color.opacity/2,3)], isObject: false})).dot(itemData.x, y-1)
                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, fast.r(color.opacity/4,3)], isObject: false})).dot(itemData.x, y)
                        
                        for(let i =0; i < length; i++){
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacityValues[i]], isObject: false})).dot(itemData.x, y-2-1-i);
                        }
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        this.main = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(AbsentMp3Scene.models.main)
        }), 1)

        //80, 140
        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 100, xClamps: [0, 80], yClamps: [0, 130], 
                lowerYDelta: 20, itemFrameslength: 15, length: 12, color: 'rgba(255,255,255, 0.1)', size: this.viewport}),
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
        }), 20)

        this.midRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 300, xClamps: [0, 80], yClamps: [0, 100], 
                lowerYDelta: 20, itemFrameslength: 20, length: 6, color: 'rgba(255,255,255, 0.07)', size: this.viewport}),
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
        }), 15)

        this.farRain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: this.createRainFrames({ framesCount: 500, itemsCount: 600, xClamps: [30, 85], yClamps: [0, 80], 
                lowerYDelta: 20, itemFrameslength: 25, length: 4, color: 'rgba(255,255,255, 0.05)', size: this.viewport}),
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
        }), 10)
    }
}