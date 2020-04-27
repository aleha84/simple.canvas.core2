class BlastingCompanyNostalgiaScene extends Scene {
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

    start(){
        this.leafs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            proportions(prop1, prop2, value){
                let koef = (prop1[1]-prop1[0])/(value-prop1[0]);
                return prop2[0] + (prop2[1]-prop2[0])/koef;
            },
            createRainFrames3({framesCount, itemsCount, size, color, framesPerDropClamps, lengthClamps}) {
                let frames = [];

                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    
                    let x = getRandomInt(10, 140);
                    //let start = new V2(, -lengthClamps[0]);
                    let startY = getRandomInt(-lengthClamps[0]*2, -lengthClamps[0]);

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(framesPerDropClamps[0], framesPerDropClamps[1]);
                    let yValues = easing.fast({from: startY, to: size.y, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

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

                    return {
                        x,
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
                                .rect(itemData.x, y, 1, itemData.length)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createRainFrames2({framesCount, itemsCount, size, color, angleClamps, framesPerDropClamps, lengthClamps}) {
                let frames = [];

                //let framesPerDropClamps = [10,20];
                //let angleClamps = [5, 10];
                //let lengthClamps = [20, 10];
                
                // let yClamps = [-8*size.y, size.y];
                // let heightClamps = [25,30];
                // let color = '#9aa3a8';

                let bottomLine = createLine(new V2(-2*size.x, size.y), new V2(2*size.x, size.y));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    
                    let start = new V2(getRandomInt(30, 170), -30);
                    let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                    let end = raySegmentIntersectionVector2(start, direction, bottomLine);
                    let points = [];
                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        points = new PerfectPixel({ctx}).lineV2(start, end);
                    })

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(framesPerDropClamps[0], framesPerDropClamps[1]);
                    let indexValues = easing.fast({from: 0, to: points.length, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                    let length = this.proportions(framesPerDropClamps, lengthClamps, totalFrames);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let index = indexValues[f]//points[indexValues[f]];
                        frames[frameIndex] = {
                            index
                        };
                    }

                    return {
                        length,
                        points,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let startIndex = itemData.frames[f].index;
                                
                                for(let i = 0; i < itemData.length; i++){
                                    let index = startIndex + i;
                                    let point = itemData.points[index];
                                    if(point){
                                        hlp.setFillColor(color).dot(point.x, point.y);
                                    }
                                }

                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createRainFrames({framesCount, itemsCount, size, color, heightClamps, yClamps, opacity}) {
                let frames = [];
                
                // let yClamps = [-8*size.y, size.y];
                // let heightClamps = [25,30];
                // let color = '#9aa3a8';

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startY = getRandomInt(yClamps[0]-(size.y/2), yClamps[0]+(size.y/2));
                    return {
                        x: getRandomInt(0, size.x),
                        height: getRandomInt(heightClamps[0], heightClamps[1]),
                        yValues: easing.fast({from: startY, to: yClamps[1], steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v)),
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.globalAlpha = opacity;
                        for(let p = 0; p < itemsCount; p++){
                            let pointData = itemsData[p];
                            
                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }
                            
                            let y = pointData.yValues[currentIndex];
                            hlp.setFillColor(color).rect(pointData.x, y, 1, pointData.height)
                        }
                    });
                }
                
                return frames;
            },
            init() {

                let size = this.size;

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size,
                    img: PP.createImage(BlastingCompanyNostalgiaScene.models.main2, { renderOnly: ['leafs_cloned', 'leafs', 'leafs_d']})
                }))

                let rainLayers = [
                    { framesCount: 1000, itemsCount: 25, size, color: 'rgba(154,163,168, 0.75)', lengthClamps: [25,30],framesPerDropClamps: [15,18] },
                    { framesCount: 1000, itemsCount: 50, size, color: 'rgba(154,163,168, 0.75)', lengthClamps: [20,25],framesPerDropClamps: [19,23]  },
                    // { framesCount: 1000, itemsCount: 75, size, color: 'rgba(154,163,168, 0.75)', lengthClamps: [10,15],framesPerDropClamps: [24,30] },
                ]


                this.rain = rainLayers.map(layer => this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: this.createRainFrames3(layer),
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
                })))

                // let rainLayers = [
                //     { framesCount: 100, itemsCount: 25, size, color: '#9aa3a8', heightClamps: [25,30], yClamps: [-8*size.y, size.y], opacity: 0.75 },
                //     { framesCount: 100, itemsCount: 50, size, color: '#9aa3a8', heightClamps: [20,25], yClamps: [-4*size.y, size.y], opacity: 0.5 },
                //     { framesCount: 100, itemsCount: 75, size, color: '#9aa3a8', heightClamps: [5,10], yClamps: [-2*size.y, size.y], opacity: 0.25 },
                // ]


                // this.rain = rainLayers.map(layer => this.addChild(new GO({
                //     position: new V2(),
                //     size,
                //     frames: this.createRainFrames(layer),
                //     init() {
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];
                        
                //         this.timer = this.regTimerDefault(15, () => {
                        
                //             this.img = this.frames[this.currentFrame];
                //             this.currentFrame++;
                //             if(this.currentFrame == this.frames.length){
                //                 this.currentFrame = 0;
                //             }
                //         })
                //     }
                // })))

                // let rainLayers = [
                //     {framesCount: 1000, itemsCount: 25, size, color: '#afb9bf', angleClamps: [20, 30], framesPerDropClamps: [15,18], lengthClamps:[30, 25] },
                //     {framesCount: 1000, itemsCount: 50, size, color: '#9aa3a8', angleClamps: [20, 22], framesPerDropClamps: [25,30], lengthClamps:[20, 10] }
                // ]

                // this.rain = rainLayers.map(layer => this.addChild(new GO({
                //     position: new V2(),
                //     size,
                //     frames: this.createRainFrames2(layer),
                //     init() {
                //         this.currentFrame = 0;
                //         this.img = this.frames[this.currentFrame];
                        
                //         this.timer = this.regTimerDefault(15, () => {
                        
                //             this.img = this.frames[this.currentFrame];
                //             this.currentFrame++;
                //             if(this.currentFrame == this.frames.length){
                //                 this.currentFrame = 0;
                //             }
                //         })
                //     }
                // })))
            }
        }), 1)

        this.girl = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(BlastingCompanyNostalgiaScene.models.main2, { exclude: ['leafs_cloned', 'leafs', 'leafs_d']})
                }))
            }
        }), 5)
    }
}