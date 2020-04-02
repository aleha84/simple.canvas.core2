// todo: 
// splashes
// far lights ?
// road shados from drops ?

class Demo10BridgeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                itemsCountMultiplier: 0.25,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#172C28');
    }

    start(){
        var model = Demo10BridgeScene.models.main;
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;

            this.addGo(new GO({
                position: this.sceneCenter,
                size: this.viewport,
                img: PP.createImage(model, {renderOnly: name}) 
            }), l)
        }

        this.roadFlow = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let rightClampCornerPoints = [new V2(76,122), new V2(149,149) ]
                let leftClampCornerPoints = [new V2(72,122), new V2(117,149) ]

                let leftClampPoints = [];
                let rightClampPoints = [];

                createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('red');

                    rightClampPoints = pp.lineV2(rightClampCornerPoints[0], rightClampCornerPoints[1])
                    leftClampPoints = pp.lineV2(leftClampCornerPoints[0], leftClampCornerPoints[1])

                    //hlp.setFillColor('green').dot(66,118);
                })

                let itemsCount = 250;
                let framesCount = 40;
                let maxFlowDistance = 15;
                let maxFlowAlpha = 0.2;
                let pCenter = new V2(65,118);
                let maxDistance = new V2(149,149).distance(pCenter);
                let maxWidth = 3;
                
                let items = new Array(itemsCount).fill().map((el, i) => {
                    let y = getRandomInt(rightClampCornerPoints[0].y, rightClampCornerPoints[1].y)
                    let xClamps = [leftClampPoints.filter(p => p.y == y)[0].x,  rightClampPoints.filter(p => p.y == y)[0].x]
                    let x = getRandomInt(xClamps[0], xClamps[1])
                    let point = new V2(x,y);
                    let direction = point.direction(pCenter);
                    let distance = point.distance(pCenter);
                    let koef = distance/maxDistance;
                    let flowDistance = fast.c(maxFlowDistance*koef);
                    let pointsToPcenter = [];
                    let color = colors.rgbStringToObject({value: (getRandomBool() ? 'rgba(255,255,255,1)': 'rgba(0,0,0,1)'), asObject: true});
                    let maxAlpha = maxFlowAlpha//fast.c(maxFlowAlpha*koef,2)
                    let width = fast.c(maxWidth*koef)

                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        pointsToPcenter = new PerfectPixel({ctx}).lineV2(point, point.add(direction.mul(flowDistance)));
                    })

                    let indexChangeValue = easing.fast({from: 0, to: pointsToPcenter.length-1, steps: framesCount, type: 'quad', method: 'inOut'  }).map(value => fast.r(value));
                    let aChangeValue = [...easing.fast({from: 0, to: maxAlpha, steps: framesCount/2, type: 'quad', method: 'inOut'  }).map(value => fast.r(value,3)),
                                        ...easing.fast({from: maxAlpha, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut'  }).map(value => fast.r(value,3))]

                    return {
                        point,
                        direction,
                        pointsToPcenter,
                        indexChangeValue,
                        aChangeValue,
                        color,
                        width,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                let frames = new Array(framesCount).fill().map((el, f) => {
                    //let currentIndex = f;
                    return createCanvas(this.size, (ctx, size, hlp) => {
                        //hlp.setFillColor('blue');
                        for(let i = 0; i < items.length; i++){
                            let item = items[i];

                            let currentIndex = item.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }


                            let index = item.indexChangeValue[currentIndex];
                            let point = item.pointsToPcenter[index];
                            let a = item.aChangeValue[currentIndex];

                            hlp.setFillColor(colors.rgbToString({value: [item.color.red, item.color.green, item.color.blue, a], isObject: false}))
                            hlp.rect(point.x, point.y, item.width, 1)//.dot(point.x+1, point.y);
                        }
                    })
                });


                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
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
                }))
            }
        }), 3)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let itemsCountMultiplier = 1;
                if(this.parentScene.debug.enabled){
                    itemsCountMultiplier = this.parentScene.debug.itemsCountMultiplier
                }
                
                let frmesSet = [
                    {shift: new V2(0,-10), frames: this.rainGenerator2({framesCount: 70, itemsCount: fast.r(700*itemsCountMultiplier), direction: [3,5], 
                        size: this.size, colorHex: '#191919', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.04)'}), trailLenght: 2})},
                    {shift: new V2(0,-10), frames: this.rainGenerator2({framesCount: 60, itemsCount: fast.r(450*itemsCountMultiplier), direction: [3,6], 
                        size: this.size, colorHex: '#191919', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.06)'}), trailLenght: 3})},
                    {shift: new V2(0,-15),frames: this.rainGenerator2({framesCount: 50, itemsCount: fast.r(250*itemsCountMultiplier), direction: [3,7], 
                        size: this.size, colorHex: '#212121', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.08)'}), trailLenght: 4})},
                    {shift: new V2(0,-5),frames: this.rainGenerator2({framesCount: 40, itemsCount: fast.r(100*itemsCountMultiplier), direction: [3,8], 
                        size: this.size,colorHex: '#282828', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.10)'}), trailLenght: 5})},
                    {shift: new V2(0,-20),frames: this.rainGenerator2({framesCount: 30, itemsCount: fast.r(25*itemsCountMultiplier), direction: [3,9], 
                        size: this.size, colorHex: '#333333',color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.15)'}), trailLenght: 6})},
                    
                    
                ]

                frmesSet.map(framesData => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: framesData.frames,
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

            },
            rainGenerator2({framesCount, itemsCount, direction, colorHex, color,size, trailLenght}){
                
                let trailAChange = easing.createProps(trailLenght-1, color.opacity, 0, 'quad', 'out')
                let trailAValues = new Array(trailLenght).fill().map((el, i) => {
                    trailAChange.time = i;
                    return fast.r(easing.process(trailAChange),4)
                })
                
                let pointsData = new Array(itemsCount).fill().map(p => {
                    let yShift = getRandomInt(-40, 0)
                    let bottomLine = {begin: new V2(-1000, size.y+yShift), end: new V2(1000, size.y+yShift)}
                    let from = new V2(getRandomInt(0, size.x), yShift);
                    let points = [];
                    let to = raySegmentIntersectionVector2(from, V2.down.rotate(getRandom(direction[0], direction[1])), bottomLine)
                    createCanvas(new V2(), (ctx, size, hlp) => {
                        let pp = new PerfectPixel({ctx});
                        points = pp.lineV2(from, to);
                    })

                    let indexChange = easing.createProps(framesCount-1, 0, points.length-1, 'linear', 'base');
                    let indexChangeValues = new Array(framesCount).fill().map((_, i) => {
                        indexChange.time = i;
                        return fast.r(easing.process(indexChange))
                    });
                    return {
                        points,
                        indexChangeValues,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                let frames = [];
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let pointData = pointsData[p];

                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }

                            let lineIndex = pointData.indexChangeValues[currentIndex];
                            let linePoint = pointData.points[lineIndex];

                            //hlp.setFillColor(colorHex)
                            hlp.setFillColor(colors.rgbToString({value: color, isObject: true}))
                            .dot(linePoint.x, linePoint.y);
                            let prev = {x: linePoint.x, y: linePoint.y};

                            for(let tl = 1; tl <= trailLenght; tl++){
                                let _li = lineIndex-tl;
                                if(_li < 0)
                                    break;

                                let _lp = pointData.points[_li];
                                let a = trailAValues[tl-1];

                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a]}))
                                //hlp.setFillColor(colorHex)
                                .dot(_lp.x, _lp.y);

                                if(_lp.x != prev.x){
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a*(2/3)]})).dot(prev.x, prev.y-1).dot(_lp.x, _lp.y+1);
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a/3]})).dot(prev.x, prev.y-2).dot(_lp.x, _lp.y+2);
                                }

                                prev = {x:_lp.x, y: _lp.y};
                            }

                            prev = {x: linePoint.x, y: linePoint.y};
                            for(let tl = 1; tl <= trailLenght; tl++){
                                let _li = lineIndex+tl;
                                if(_li >= pointData.points.length)
                                    break;

                                let _lp = pointData.points[_li];
                                let a = trailAValues[tl-1];

                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a]}))
                                //hlp.setFillColor(colorHex)
                                .dot(_lp.x, _lp.y);

                                if(_lp.x != prev.x){
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a*(2/3)]}))
                                    .dot(prev.x, prev.y+1).dot(_lp.x, _lp.y-1);
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a/3]}))
                                    .dot(prev.x, prev.y+2).dot(_lp.x, _lp.y-2);
                                }

                                prev = {x:  _lp.x, y: _lp.y};
                            }
                        }
                    })
                }

                return frames;
            },
            rainGenerator({framesCount, itemsCount, direction, colorHex, color,size, trailLenght}) {
                let frames = [];

                let trailAChange = easing.createProps(trailLenght-1, color.opacity, 0, 'quad', 'out')
                let trailAValues = new Array(trailLenght).fill().map((el, i) => {
                    trailAChange.time = i;
                    return fast.r(easing.process(trailAChange),2)
                })

                let to = raySegmentIntersectionVector2(new V2(), direction, {begin: new V2(-1000, size.y), end: new V2(1000, size.y)})
                let points = [];
                createCanvas(new V2(), (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    points = pp.lineV2(new V2(), to);
                })

                let indexChange = easing.createProps(framesCount-1, 0, points.length-1, 'linear', 'base');
                let indexChanges = new Array(framesCount).fill().map((_, i) => {
                    indexChange.time = i;
                    return fast.r(easing.process(indexChange))
                })

                let pointsData = new Array(itemsCount).fill().map(p => {
                    let xDelta = getRandomInt(0, size.x);

                    return {
                        xDelta,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let pointData = pointsData[p];

                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }

                            let lineIndex = indexChanges[currentIndex];
                            let linePoint = points[lineIndex];

                            //hlp.setFillColor(colors.rgbToString({value: color, isObject: true}))
                            hlp.setFillColor(colorHex)
                            .dot(pointData.xDelta + linePoint.x, linePoint.y);
                            let prev = {x: pointData.xDelta + linePoint.x, y: linePoint.y};

                            for(let tl = 1; tl <= trailLenght; tl++){
                                let _li = lineIndex-tl;
                                if(_li < 0)
                                    break;

                                let _lp = points[_li];
                                let a = trailAValues[tl-1];

                                //hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a]}))
                                hlp.setFillColor(colorHex)
                                .dot(pointData.xDelta + _lp.x, _lp.y);

                                // if(pointData.xDelta + _lp.x != prev.x){
                                //     hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a*(2/3)]})).dot(prev.x, prev.y-1).dot(pointData.xDelta + _lp.x, _lp.y+1);
                                //     hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a/3]})).dot(prev.x, prev.y-2).dot(pointData.xDelta + _lp.x, _lp.y+2);
                                // }

                                prev = {x: pointData.xDelta + _lp.x, y: _lp.y};
                            }

                            prev = {x: pointData.xDelta + linePoint.x, y: linePoint.y};
                            for(let tl = 1; tl <= trailLenght; tl++){
                                let _li = lineIndex+tl;
                                if(_li >= points.length)
                                    break;

                                let _lp = points[_li];
                                let a = trailAValues[tl-1];

                                //hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a]}))
                                hlp.setFillColor(colorHex)
                                .dot(pointData.xDelta + _lp.x, _lp.y);

                                // if(pointData.xDelta + _lp.x != prev.x){
                                //     hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a*(2/3)]}))
                                //     .dot(prev.x, prev.y+1).dot(pointData.xDelta + _lp.x, _lp.y-1);
                                //     hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a/3]}))
                                //     .dot(prev.x, prev.y+2).dot(pointData.xDelta + _lp.x, _lp.y-2);
                                // }

                                prev = {x: pointData.xDelta + _lp.x, y: _lp.y};
                            }
                        }
                    })
                }

                return frames;
            }
        }), 0)


        this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let color = colors.rgbStringToObject({value: 'rgba(255,255,255, 0.15)', asObject: true});


                let lightEllipsis = {
                    position: new V2(this.size.x, 0),
                    size: new V2(150, 100),
                }
                lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
                let dropsAChange = easing.createProps(100, 1, 0, 'quad', 'out')

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').strokeEllipsis(0,360, 1, lightEllipsis.position, lightEllipsis.size.x, lightEllipsis.size.y )
                })

                let frames = [];
                let framesCount = 50;
                let itemsCount = 300;

                let heightClamp = [10,15];
                

                let aChanges = [];
                for(let i = 2; i <= heightClamp[1]; i++){
                    aChanges[i] = easing.fast({from: 0, to: color.opacity, steps: i, type: 'quad', method: 'inOut'}).map(value => fast.r(value, 3));
                }


                let bottomDots = [];
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    bottomDots = [...pp.lineV2(new V2(0, 121), new V2(74, 121)), ...pp.lineV2(new V2(75, 120), new V2(134, 116))]
                }) 

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let x = getRandomInt(0, 134)
                    let maxY = bottomDots.filter(d => d.x == x)[0].y;
                    let yShift = 121-maxY;
                    let yChangeValues = easing.fast({from: yShift, to: maxY + getRandomInt(-3,0), steps: framesCount, type:'quad', method: 'in'}).map(value => fast.r(value));
                    let heightChangeValues = easing.fast({from: 1, to: getRandomInt(heightClamp[0],heightClamp[1]), steps: framesCount, type:'quad', method: 'in'}).map(value => fast.r(value));
                
                    return {
                        x,
                        yChangeValues,
                        heightChangeValues,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                let getDropA = (x, y) => {
                    let dx = fast.r(
                        (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                        + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);

                    
                    if(dx > 100){
                        dx = 100;
                    }

                    dropsAChange.time = dx;
                    return fast.r(easing.process(dropsAChange), 3);
                }

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        if(this.parentScene.debug.enabled){
                            ctx.drawImage(mask, 0,0);
                        }
                        
                        for(let p = 0; p < itemsCount; p++){
                            let pointData = itemsData[p];

                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }

                            let y = pointData.yChangeValues[currentIndex];
                            let height = pointData.heightChangeValues[currentIndex];
                            // hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false}))
                            // .rect(pointData.x,y, 1, pointData.heightChangeValues[currentIndex])
                            if(height == 1){
                                let additionalA = getDropA(pointData.x,y);
                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity + additionalA], isObject: false}))
                                    .dot(pointData.x,y)
                            }
                            else {
                                let aValues = aChanges[height];
                                for(let i = 0; i < height; i++){
                                    let a = aValues[i];

                                    let additionalA1 = getDropA(pointData.x,y+i);
                                    let additionalA2 = getDropA(pointData.x,y+height*2 - i - 1);
                                    

                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA1], isObject: false}))
                                    .dot(pointData.x,y+i);

                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA2], isObject: false}))
                                    .dot(pointData.x,y+height*2 - i - 1)
                                }
                            }
                            
                            
                        }
                    })
                }

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
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
                }))

                color = colors.rgbStringToObject({value: 'rgba(255,255,255, 0.5)', asObject: true});
                framesCount = 30;
                let aChangeValues = easing.fast({from:color.opacity, to: 0, steps: framesCount, type: 'quad', method: 'in'}).map(value => fast.r(value, 3))
                let splashData = new Array(300).fill().map((el, i) => {
                    let currentDot = new V2(bottomDots[getRandomInt(0, bottomDots.length-1)]).add(new V2(0, getRandomInt(-3, 0)));
                    let direction = V2.up.rotate(getRandomInt(-20, 20));
                    let speed = getRandom(0.25,0.75);
                    let yDelta = getRandom(0.025,0.05);
                    let ds = direction.mul(speed);
                    let points = [];
                    for(let f = 0; f < framesCount; f++){
                        points[f] = currentDot.toInt();
                        currentDot = currentDot.add(ds);
                        ds.y+=yDelta;
                    }

                    return {
                        points, 
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })

                let splashFrames = []
                for(let f = 0; f < framesCount; f++){
                    splashFrames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        // if(this.parentScene.debug.enabled){
                        //     ctx.drawImage(mask, 0,0);
                        // }
                        
                        for(let p = 0; p < splashData.length; p++){
                            let pointData = splashData[p];

                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }

                            let point = pointData.points[currentIndex];
                            let a = aChangeValues[currentIndex];
                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a]})).dot(point.x, point.y)
                        }
                    })
                }

                this.splashes = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: splashFrames,
                    init() {
                        let fCounter = 420;
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];

                        this.timer = this.regTimerDefault(15, () => {
                            fCounter--;
                            // if(fCounter == 0)
                            //     {
                            //         fCounter = 420;
                            //         if(!this.redFrame){
                            //             this.redFrame = this.addChild(new GO({
                            //                 position: new V2(),
                            //                 size: this.size,
                            //                 img: createCanvas(this.size, (ctx, size, hlp) => {
                            //                     hlp.setFillColor('red').rect(0,0, 50,50)
                            //                 })
                            //             }));
                            //         }
                            //         else {
                            //             this.removeChild(this.redFrame);
                            //             this.redFrame = undefined;
                            //         }
                            //     }
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