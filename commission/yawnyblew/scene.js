class YawnyblewWindowScene extends Scene {
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
        this.window = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(150,150),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#999').rect(0,0, size.x, size.y);
                })

                this.rain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    rainFramesGenerator({framesCount, itemsCount, color, size, heightClamp, yShiftClamps, yClamps = []}) {
                        let frames = [];
                        if(typeof(color) == 'string')
                            color = colors.rgbStringToObject({value: color, asObject: true});
                
                        let aChanges = [];
                        for(let i = heightClamp[0]; i <= heightClamp[1]; i++){
                            aChanges[i] = easing.fast({from: 0, to: color.opacity, steps: i, type: 'quad', method: 'inOut'}).map(value => fast.r(value, 3));
                        }
                
                
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let x = getRandomInt(0, size.x)
                        
                            return {
                                x,
                                height: getRandomInt(heightClamp[0], heightClamp[1]),
                                yChangeValues: easing.fast({
                                    from: yClamps[0] + getRandomInt(yShiftClamps[0], yShiftClamps[1]), 
                                    to: yClamps[1]+getRandomInt(yShiftClamps[0], yShiftClamps[1]), 
                                    steps: framesCount, type:'linear', method: 'base'})
                                        .map(value => fast.r(value)),
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
                                            .dot(pointData.x,y)
                                    }
                                    else {
                                        let aValues = aChanges[height];
                                        for(let i = 0; i < height; i++){
                                            let a = aValues[i];
                
                                            let additionalA1 = 0;
                                            let additionalA2 = 0;
                                            
                
                                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA1], isObject: false}))
                                            .dot(pointData.x,y+i);
                
                                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA2], isObject: false}))
                                            .dot(pointData.x,y +height*2 - i - 1)
                                        }
                                    }
                                }
                            })
                        }
                
                        return frames;
                    },
                    init() {
                        let rainLayers = [
                           {framesCount: 100, itemsCount: 400, color: 'rgba(76,76,76,0.25)', heightClamp: [2,3], yShiftClamps: [-25,25], yClamps: [-this.size.y, this.size.y*2]},
                           {framesCount: 80, itemsCount: 200, color: 'rgba(102,102,102,0.5)', heightClamp: [3,5], yShiftClamps: [-35,35], yClamps: [-this.size.y, this.size.y*2]},
                           {framesCount: 50, itemsCount: 100, color: 'rgba(153,153,153,0.5)', heightClamp: [5,8], yShiftClamps: [-45,45], yClamps: [-this.size.y, this.size.y*2]},
                           {framesCount: 25, itemsCount: 50, color: 'rgba(178,178,178,0.5)', heightClamp: [10,15], yShiftClamps: [-60,60], yClamps: [-this.size.y, this.size.y*2]},
                       ]

                       rainLayers.map(layer => this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: this.rainFramesGenerator({
                            framesCount: layer.framesCount, itemsCount: layer.itemsCount, color: layer.color,
                            heightClamp: layer.heightClamp, yShiftClamps: layer.yShiftClamps, yClamps: layer.yClamps, size: this.size
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
                       })));                        
                    }
                }))


                this.rainDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    getColor(position, coloredEllipsises) {
                        let {x, y} = position;

                        let inside = coloredEllipsises.map((el) => {
                            return {
                                el,
                                inside: fast.r(
                                (((x-el.position.x)*(x-el.position.x)/el.rxSq) 
                                + ((y-el.position.y)*(y-el.position.y)/el.rySq))*100) <= 100 };
                        }).filter(el => el.inside);

                        if(inside.length == 0)
                            return undefined;

                        if(inside.length == 1)
                            return inside[0].el.color;

                        if(inside.length > 1){
                            return inside[getRandomInt(0, inside.length-1)].el.color;
                        }
                    },
                    createRainDropsFrames({framesCount, itemsCount, size, movingCase, coloredEllipsises = []}) {
                        let defaultOpacity = 0.5;
                        let frames = [];

                        coloredEllipsises.forEach(el => {
                            el.rxSq = el.size.x*el.size.x;
                            el.rySq = el.size.y*el.size.y;
                        });

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let color = (getRandomBool() ? getRandomInt(2,6) : getRandomInt(20,24))*10;
                            
                            color = colors.rgbStringToObject({value: `rgba(${color}, ${color}, ${color},1)`, asObject: true})

                            let start = new V2(getRandomInt(0, size.x), getRandomInt(0, size.y));
                            let pointsToBottom = new Array(2).fill(start);
                            let xShift = 0;
                            let currentXShiftsValues = new Array(framesCount).fill(xShift)
                            //let colors = new Array(framesCount).fill(color);
                            let moving = movingCase()
                            if(moving) {
                                let freeze = getRandomInt(20,40);
                                pointsToBottom = new Array(freeze).fill(start);
                                createCanvas(new V2(1,1), (ctx, _size, hlp) => {
                                    pointsToBottom.push(...new PerfectPixel({ctx}).lineV2(start, start.add(new V2(0, getRandomInt(size.y, 1.5*size.y)))).map(p => new V2(p)))
                                }) 

                                currentXShiftsValues = new Array(framesCount).fill(xShift).map((el, i) => {
                                    if(i > freeze+5){
                                        if(getRandomInt(0,6) == 0){
                                            xShift+=getRandom(-0.5,0.5);
                                        }
                                    }
                                    
    
                                    return xShift;
                                })

                                
                            }
                            else {
                                let isInsideColoredEl = this.getColor(start, coloredEllipsises);
                                if(isInsideColoredEl && getRandomInt(0,4) != 0){
                                    //colors = new Array(framesCount).fill(isInsideColoredEl)
                                    color = isInsideColoredEl;
                                }
                            }

                            let indexChangeValues = easing.fast({from: 0, to: pointsToBottom.length-1, steps: framesCount, type: 'linear', method: 'base'}).map(value => fast.r(value))


                            return {
                                // other values
                                indexChangeValues,
                                pointsToBottom,
                                color,
                                moving,
                                startShift: getRandomInt(0, framesCount-1),
                                currentXShiftsValues
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                // coloredEllipsises.forEach(el => {
                                //     hlp.setFillColor(colors.rgbToString({value: [el.color.red, el.color.green, el.color.blue, el.color.opacity], isObject: false})).elipsis(el.position, el.size)
                                // });


                                for(let p = 0; p < itemsCount; p++){
                                    let pointData = itemsData[p];
                                    
                                    let currentIndex = pointData.startShift + f;
                                    if(currentIndex > (framesCount-1)){
                                        currentIndex-=framesCount;
                                    }
                                    
                                    let pointToBottomIndex = pointData.indexChangeValues[currentIndex];
                                    let currentXShift = pointData.currentXShiftsValues[currentIndex];
                                    let pointToBottom = pointData.pointsToBottom[pointToBottomIndex].add(new V2(currentXShift)).toInt();

                                    // if(getRandomInt(0,4) == 0){
                                    //     pointData.currentXShift+=getRandom(-1,1);
                                    // }

                                    let fillColor = pointData.color;

                                    if(pointData.moving){
                                        let isInsideColoredEl = this.getColor(pointToBottom, coloredEllipsises);
                                        if(isInsideColoredEl){
                                            fillColor = isInsideColoredEl
                                        }
                                    }

                                    

                                    hlp.setFillColor(colors.rgbToString({value: [fillColor.red, fillColor.green, fillColor.blue, defaultOpacity], isObject: false}))
                                        .rect(pointToBottom.x, pointToBottom.y, 2,2)

                                    hlp.setFillColor('rgba(0,0,0,0.4)').rect(pointToBottom.x, pointToBottom.y+1,2,1)
                                    hlp.setFillColor('rgba(255,255,255,0.25)').rect(pointToBottom.x, pointToBottom.y,1,1)
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createRainDropsFrames({framesCount: 400, itemsCount: 400, size: this.size, movingCase: () => { return getRandomInt(0,2) == 0 },
                        coloredEllipsises: [
                            {
                                position: new V2(140, 20).toInt(),
                                size: new V2(30, 60),
                                color: colors.rgbStringToObject({value: 'rgba(255,0,0,0.25)', asObject: true})
                            },
                            {
                                position: new V2(30, 100).toInt(),
                                size: new V2(60, 20),
                                color: colors.rgbStringToObject({value: 'rgba(100,100,0,0.25)', asObject: true})
                            },
                            {
                                position: new V2(60, 120).toInt(),
                                size: new V2(30, 30),
                                color: colors.rgbStringToObject({value: 'rgba(0,100,100,0.25)', asObject: true})
                            }
                        ]
                    });

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
                }))
            }
        }), 1)
    }
}