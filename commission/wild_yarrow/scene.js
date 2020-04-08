class WildYarrowForestScene extends Scene {
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

    rainFramesGenerator({framesCount, itemsCount, color, size, heightClamp, yShiftClamps}) {
        let frames = [];
        if(typeof(color) == 'string')
            color = colors.rgbStringToObject({value: color, asObject: true});

        let aChanges = [];
        for(let i = heightClamp[0]; i <= heightClamp[1]; i++){
            aChanges[i] = easing.fast({from: 0, to: color.opacity, steps: i, type: 'quad', method: 'inOut'}).map(value => fast.r(value, 3));
        }

        let yChangeValues = easing.fast({from: -4*size.y, to: size.y, steps: framesCount, type:'linear', method: 'base'}).map(value => fast.r(value));
        //let heightChangeValues = easing.fast({from: heightClamp[0], to: heightClamp[1], steps: framesCount, type:'quad', method: 'in'}).map(value => fast.r(value));

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let x = getRandomInt(0, size.x)
        
            return {
                x,
                height: getRandomInt(heightClamp[0], heightClamp[1]),
                yShift: getRandomInt(yShiftClamps[0], yShiftClamps[1]),
                yChangeValues: easing.fast({from: -4*size.y + getRandomInt(-50, 50), to: size.y, steps: framesCount, type:'linear', method: 'base'}).map(value => fast.r(value)),
                initialIndex: getRandomInt(0, framesCount-1)
            }
        })

        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsCount; p++){
                    let pointData = itemsData[p];

                    let currentIndex = pointData.initialIndex + f;
                    if(currentIndex > (framesCount-1)){
                        currentIndex-=framesCount;
                    }

                    let y = pointData.yChangeValues[currentIndex];
                    let height = pointData.height;//heightChangeValues[currentIndex];

                    if(height == 1){
                        let additionalA = 0;
                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity + additionalA], isObject: false}))
                            .dot(pointData.x,y + pointData.yShift)
                    }
                    else {
                        let aValues = aChanges[height];
                        for(let i = 0; i < height; i++){
                            let a = aValues[i];

                            let additionalA1 = 0;
                            let additionalA2 = 0;
                            

                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA1], isObject: false}))
                            .dot(pointData.x,y+i+ pointData.yShift);

                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA2], isObject: false}))
                            .dot(pointData.x,y + pointData.yShift +height*2 - i - 1)
                        }
                    }
                }
            })
        }

        return frames;
    }

    start(){
        var model = WildYarrowForestScene.models.second;

        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;

            this.addGo(new GO({
                position: this.sceneCenter,
                size: this.viewport,
                img: PP.createImage(model, {renderOnly: name}) 
            }), l)
        }

        let rainLayers = [
             //{layer: 2, framesCount: 400, itemsCount: 160, color: 'rgba(255,255,255,0.1)', heightClamp: [2,3], yShiftClamps: [-40,-35]},
            {layer: 3, framesCount: 180, itemsCount: 100, color: 'rgba(255,255,255,0.05)', heightClamp: [1,3], yShiftClamps: [-35,-30]},
            {layer: 4, framesCount: 120, itemsCount: 20, color: 'rgba(255,255,255,0.15)', heightClamp: [3,6], yShiftClamps: [-25,-15]},
            {layer: 5, framesCount: 60, itemsCount: 10, color: 'rgba(255,255,255,0.2)', heightClamp: [6,10], yShiftClamps: [-10,0]}
        ]

        this.rainItems = rainLayers.map(prop => {
            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                frames: this.rainFramesGenerator({framesCount: prop.framesCount, itemsCount: prop.itemsCount, size: this.viewport.clone(), color: prop.color, 
                heightClamp: prop.heightClamp, yShiftClamps: prop.yShiftClamps}),
                init() {
                    //this.shouldCreateRedFrame = this.frames.length == 180;

                    this.redFrameCounter = 5;
                    this.currentFrame = 0;
                    this.img = this.frames[this.currentFrame];
    
                    this.timer = this.regTimerDefault(15, () => {
        
                        this.img = this.frames[this.currentFrame];
                        this.currentFrame++;
                        if(this.currentFrame == this.frames.length){
                            this.currentFrame = 0;
                                
                            if(this.shouldCreateRedFrame){
                                this.redFrameCounter--;
                                if(this.redFrameCounter == 0){
                                    this.redFrameCounter = 3;
                                    if(!this.redFrame){
                                        //alert('1')
                                            this.redFrame = this.addChild(new GO({
                                                position: new V2(),
                                                size: this.size,
                                                img: createCanvas(this.size, (ctx, size, hlp) => {
                                                    hlp.setFillColor('red').rect(0,0, 50,50)
                                                })
                                            }));
                                        }
                                        else {
                                            this.removeChild(this.redFrame);
                                            this.redFrame = undefined;
                                        }
                                }
                                
                            }
                        }
                    })
                }
            }), prop.layer)
        })
        // this.rain4 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     frames: this.rainFramesGenerator({framesCount: 30, itemsCount: 20, size: this.viewport.clone(), color: 'rgba(255,255,255,0.15)', 
        //     heightClamp: [3,6], yShiftClamps: [-25,-15]}),
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
        // }), 4)
    }
    
}