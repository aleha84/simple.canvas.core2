class Demo10RecordingScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
            },
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

    createDropsFrames({framesCount, itemsCount, itemFrameslength, size, length, opacity}) {
        let frames = [];
        let yValues = easing.fast({from: 0, to: size.y, steps: itemFrameslength, type: 'linear', method: 'base'}).map(v => fast.r(v));
        let opacityValues = easing.fast({from: opacity, to: 0.1, steps: length, type: 'quad', method: 'out'});
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
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
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(colors.rgbToString({value: [255, 255, 255, opacity], isObject: false})).dot(itemData.x, itemData.frames[f].y)
                        for(let i = 0; i < length; i++){
                            hlp.setFillColor(colors.rgbToString({value: [255, 255, 255, opacityValues[i]], isObject: false})).dot(itemData.x, itemData.frames[f].y - i - 1);
                        }
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y);
                })
            }
        }), 1)

        let dropsLayers = [
            this.createDropsFrames({framesCount: 300, itemsCount: 500, itemFrameslength: 150, size: this.viewport, length: 3, opacity: 0.1}),
            this.createDropsFrames({framesCount: 200, itemsCount: 250, itemFrameslength: 100, size: this.viewport, length: 6, opacity: 0.25}),
            this.createDropsFrames({framesCount: 100, itemsCount: 100, itemFrameslength: 50, size: this.viewport, length: 9, opacity: 0.5})
        ]

        this.drops = dropsLayers.map((frames, i) => this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames,
            init() {
                console.log(this.frames.length)
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                if(this.frames.length == 300){
                    this.counter = 2;           
                }

                this.timer = this.regTimerDefault(10, () => {
                    //console.log(`${this.currentFrame} from ${this.frames.length} shown`)
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        if(this.frames.length == 300){
                            this.counter--;

                            if(this.counter == 0){
                                this.parentScene.capturing.stop = true;
                            }
                        }
                        this.currentFrame = 0;
                    }
                })
            }
        }), (i+1)*10));

    }
}