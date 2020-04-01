class Demo10BridgeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                itemsCountMultiplier: 0.25,
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
                        size: this.size, colorHex: '#191919', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.02)'}), trailLenght: 2})},
                    {shift: new V2(0,-10), frames: this.rainGenerator2({framesCount: 60, itemsCount: fast.r(450*itemsCountMultiplier), direction: [3,6], 
                        size: this.size, colorHex: '#191919', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.04)'}), trailLenght: 3})},
                    {shift: new V2(0,-15),frames: this.rainGenerator2({framesCount: 50, itemsCount: fast.r(250*itemsCountMultiplier), direction: [3,7], 
                        size: this.size, colorHex: '#212121', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.06)'}), trailLenght: 4})},
                    {shift: new V2(0,-5),frames: this.rainGenerator2({framesCount: 40, itemsCount: fast.r(100*itemsCountMultiplier), direction: [3,8], 
                        size: this.size,colorHex: '#282828', color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.08)'}), trailLenght: 5})},
                    {shift: new V2(0,-20),frames: this.rainGenerator2({framesCount: 30, itemsCount: fast.r(25*itemsCountMultiplier), direction: [3,9], 
                        size: this.size, colorHex: '#333333',color: colors.rgbStringToObject({value: 'rgba(255,255,255,0.1)'}), trailLenght: 6})},
                    
                    
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
        }), 1)
    }
}