class Demo10TrainScene extends Scene {
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

    createRadialGradient({ size, center, radius, gradientOrigin, angle, setter }) {
        if(!size){
            size = this.viewport.clone();
        }

        angle = degreeToRadians(angle);

        if(!setter){
            throw 'Dot value setter is not provided';
        }

        let setDot = (x,y, setter) => {
            let row = dots[y];
            if(!row){
                dots[y] = [];
                row = dots[y];
            }

            if(!row[x]){
                row[x] = {};
            }

            setter(row[x]);
        }

        let isInEllipsis = (x,y) => {
            let _x = x-center.x;
            let _y = y-center.y;

            return Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq <= 1
        }

        let dots = [];
        let rxSq = radius.x*radius.x;
        let rySq = radius.y*radius.y;
        let maxSize = radius.x > radius.y ? new V2(radius.x, radius.x) : new V2(radius.y, radius.y);
        let _cos = Math.cos(angle);
        let _sin = Math.sin(angle);
        let ellipsisBox = new Box(center.substract(maxSize).toInt().add(new V2(-1,-1)), maxSize.mul(2).add(new V2(3,3)));

        if(!isInEllipsis(gradientOrigin.x, gradientOrigin.y))
            throw 'Gradient origin is not inside elipsis';

        let pp = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            pp = new PP({ctx});
        })

        for(let y = center.y-maxSize.y-1;y < center.y+maxSize.y+1;y++){
            dots[y] = [];
            for(let x = center.x-maxSize.x-1;x < center.x+maxSize.x+1;x++){
                if(!isInEllipsis(x,y)){
                    continue;
                }

                let currentDot = new V2(x,y);

                if(currentDot.equal(gradientOrigin)){
                    setDot(x,y, (dot) => setter(dot, 1))
                    continue;
                }

                let currentDirection = gradientOrigin.direction(currentDot);
                let point2 = rayBoxIntersection(currentDot, currentDirection, ellipsisBox);
                if(!point2 || point2.length == 0)
                    throw 'No box intersection found!';

                point2 = point2[0];
                let linePoints = pp.lineV2(gradientOrigin, point2);

                let stopIndex = 0;
                for(let i = 0; i < linePoints.length;i++){
                    let linePoint = linePoints[i];
                    let _x = linePoint.x-center.x;
                    let _y = linePoint.y-center.y;
                    stopIndex = i; // индекс первого элемента за границей эллипса
                    if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1)
                        break;

                }

                let aValues = easing.fast({from: 1, to: 0, steps: stopIndex, type:'quad', method:'out'});
                for(let i = 0; i < stopIndex;i++){
                    let linePoint = linePoints[i];

                    setDot(linePoint.x, linePoint.y, (dot) => { setter(dot, aValues[i]) } )
                }
            }
        }

        return dots;
    }

    start(){
        this.main = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(Demo10TrainScene.models.main),
            init() {
                //
            }
        }), 1)

        this.test2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createParticlesFrames({framesCount, itemsCount, size, itemFramesLengthClamps, angleClamps, color, length = 1, masks, lowerY, yClamps, xClamps, cubic = false}) {
                let leftX = 0;
                let rightX = size.x;
                if(xClamps){
                    leftX = xClamps[0];
                    rightX = xClamps[1];
                }

                let leftLine = createLine(new V2(leftX, -size.y), new V2(leftX, 4*size.y))
                let frames = [];
                
                let pp = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    pp = new PP({ctx})
                })

                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});

                if(masks){
                    if(!Array.isArray(masks)){
                        masks = [masks];
                    }

                    masks.forEach(mask => {
                        mask.color = colors.rgbStringToObject({value: mask.color, asObject: true})
                        mask.colorsChange = {
                            red: easing.fast({from: color.red, to: mask.color.red, steps: 101, type: 'linear', method: 'base' }).map(v => fast.r(v)),
                            green: easing.fast({from: color.green, to: mask.color.green, steps: 101, type: 'linear', method: 'base' }).map(v => fast.r(v)),
                            blue: easing.fast({from: color.blue, to: mask.color.blue, steps: 101, type: 'linear', method: 'base' }).map(v => fast.r(v)),
                            opacity: easing.fast({from: color.opacity, to: mask.color.opacity, steps: 101, type: 'linear', method: 'base' }).map(v => fast.r(v, 2)),
                        }
                    })

                    
                }

                // 
                // let aValues = easing.fast({from: itemColor.opacity, to: 0, steps: length, type: 'quad', method: 'out'}).map(v => fast.r(v,2))

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFramesLengthClamps[0], itemFramesLengthClamps[1]);
                    let itemColor = assignDeep({}, color);
                    let startY = getRandomInt(-size.y/2 - 10,size.y);
                    if(yClamps){
                        startY = getRandomInt(yClamps[0], yClamps[1])
                    }
                    let point1 = new V2(getRandomInt(rightX,rightX+20), startY)
                    let direction = V2.left.rotate(getRandomInt(-angleClamps[0], -angleClamps[1]));
                    let point2 = raySegmentIntersectionVector2(point1, direction, leftLine);
                    if(!point2)
                        throw 'Failed to find left line intersection';

                    let lineDots = pp.lineV2(point1, point2);
                    if(cubic){
                        var fx = mathUtils.getCubicSplineFormula([point2, new V2(point2.x + (point1.x - point2.x)/2, point1.y + fast.r((point2.y-point1.y)*cubic) ), point1]);
                        lineDots = [];
                        for(let x = point2.x; x <= point1.x; x++){
                            lineDots.push({x, y: fast.r(fx(x))});
                        }

                        lineDots = [...lineDots.reverse()];
                    }
                    let indexValues = easing.fast({from: 0, to: lineDots.length-1, steps: totalFrames, type: 'linear', method: 'base' }).map(v => fast.r(v));
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
        
                        let index = indexValues[f];
                        //let point = lineDots[index];

                        let points = [];
                        
                        for(let i = 0; i < length; i++){
                            let _index = index-i;
                            if(_index >= 0){
                                let point = lineDots[_index];
                                let opacity = itemColor.opacity;
                                let color = itemColor;

                                if(masks){
                                    masks.forEach(mask => {
                                        let row = mask.dots[point.y];
                                        if(row){
                                            let dotValue =  mask.dots[point.y][point.x];
                                            if(dotValue){
                                                let values = dotValue.values;
                                                if(!dotValue.average){
                                                    dotValue.average = 0;
                                                    for(let i = 0; i < values.length;i++){
                                                        dotValue.average+=values[i];
                                                    }
    
                                                    dotValue.average/=values.length;
    
                                                    dotValue.average100 = fast.r(dotValue.average*100)
                                                }
    
                                                color = {
                                                    red: mask.colorsChange.red[dotValue.average100],
                                                    green: mask.colorsChange.green[dotValue.average100],
                                                    blue: mask.colorsChange.blue[dotValue.average100]
                                                }
    
                                                opacity = mask.colorsChange.opacity[dotValue.average100];
                                            }
                                        }
                                    })
                                    
                                }

                                if(opacity > 1)
                                    opacity = 1;

                                if(length > 4){
                                    if(i == 0 || i == length-1)
                                        opacity/=4;
                                    if(i == 1 || i== length-2)
                                        opacity/=2;
                                }
                                else {
                                    if(i == 0 || i == length-1)
                                        opacity/=2;
                                }

                                // if(Number.isNaN(opacity)){
                                //     debugger;
                                // }

                                points.push({ 
                                    color: colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false}),
                                    value: point
                                });
                            }
                            
                        }

                        frames[frameIndex] = {
                            //color: colors.rgbToString({value: [itemColor.red, itemColor.green, itemColor.blue, itemColor.opacity], isObject: false}),
                            points
                        };
                    }

                    return {
                        frames,
                        lowerY: lowerY ? getRandomInt(lowerY-5, lowerY+5) : undefined
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            if(itemData.frames[f]){
                                let frameValues = itemData.frames[f];
                                for(let i = 0; i < frameValues.points.length; i++){
                                    let point = frameValues.points[i];
                                    if(itemData.lowerY &&  point.value.y > itemData.lowerY){
                                        continue;
                                    }

                                    hlp.setFillColor(point.color).dot(point.value.x, point.value.y)
                                }
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let renderFrontal = true;
                let renderBeforeTrainPartivle = true;
                let renderBeforeTrainPartivle2 = true;
                let renderBeforeTrainPartivle3 = true;
                let remderBeforeTrainSecondary1 = true;
                let remderBeforeTrainSecondary2 = true;

                let noParticles = false;

                if(noParticles){
                     renderFrontal = false;
                    renderBeforeTrainPartivle = false;
                    renderBeforeTrainPartivle2 = false;
                }

                let setter = (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                    }

                    dot.values.push(aValue);
                }

                let setterMul = (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                    }

                    
                    let val = aValue*1.5;
                    if(val > 1)
                        val = 1;

                    // console.log(val);
                    dot.values.push(val);
                }

                // var fx = mathUtils.getCubicSplineFormula([new V2(0, 100), new V2(this.size.x/2, fast.r(100*5/12)), new V2(this.size.x, 0)]);
                // let _dots = [];
                // for(let x = 0; x < this.size.x; x++){
                //     _dots.push(new V2(x, fast.r(fx(x))))
                // }

                // this.addChild(new GO({
                //     position:new V2(),
                //     size: this.size,
                //     init() {
                //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //             hlp.setFillColor('red');
                //             _dots.forEach(d => hlp.dot(d.x, d.y));
                //         })
                //     }
                // }))

                let mainLabpDots = this.parentScene.createRadialGradient({size: this.size, center: new V2(-10,20), radius: new V2(100,40), 
                            gradientOrigin: new V2(68,61), angle: 25, setter});

                let secondaryLampDots1 = this.parentScene.createRadialGradient({size: this.size, center: new V2(43,95), radius: new V2(25,15), 
                    gradientOrigin: new V2(53,95), angle: -5, setter: setterMul});

                let secondaryLampDots2 = this.parentScene.createRadialGradient({size: this.size, center: new V2(78,95), radius: new V2(15,15), 
                    gradientOrigin: new V2(84,95), angle: -5, setter: setterMul});

                // this.debugEllipsis = this.addChild(new GO({
                //     position:new V2(),
                //     size: this.size,
                //     init() {
                //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < secondaryLampDots2.length; y++){
                //         if(!secondaryLampDots2[y])
                //             continue;
                        
                //         for(let x = 0; x < secondaryLampDots2[y].length; x++){
                //             if(!secondaryLampDots2[y][x])
                //                 continue;

                //             let values = secondaryLampDots2[y][x].values;
                //             let value = 0;
                //             for(let i = 0; i < values.length;i++){
                //                 value+=values[i];
                //             }
    
                //             value/=values.length;
    
                //             hlp.setFillColor(`rgba(234,220,140, ${value})`).dot(x, y);//fast.r(value,2)/2
                //         }
                //     }
                // })
                //     }
                // }))

                // let particlesFrames = [
                //     // this.createParticlesFrames({framesCount:100, itemsCount: 1500, size: this.size, itemFramesLengthClamps: [70,70], 
                //     //     angleClamps: [26,30], color: 'rgba(60,60,60,0.60)', length: 4, mask: { dots, color: 'rgba(234,220,140)' }}),
                //     // this.createParticlesFrames({framesCount:100, itemsCount: 1000, size: this.size, itemFramesLengthClamps: [60,60], 
                //     //     angleClamps: [23,30], color: 'rgba(75,75,75,0.75)', length: 5, mask: { dots, color: 'rgba(234,220,140)' }}),
                //     this.createParticlesFrames({framesCount:100, itemsCount: 1000, size: this.size, itemFramesLengthClamps: [50,50], 
                //         angleClamps: [20,30], color: 'rgba(90,90,90,0.9)', length: 6 }),
                // ]
                if(renderBeforeTrainPartivle){
                    this.BeforeTrainParticles = this.addChild(new GO({
                        position: new V2(0,0),
                        size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:400, itemsCount: 2000, size: this.size, itemFramesLengthClamps: [140,160], 
                            angleClamps: [20,25], color: 'rgba(75,75,75,0.5)', length: 4, lowerY: this.size.y-10, //cubic: 7/12,
                            masks: [{ dots: mainLabpDots, color: 'rgba(234,220,140,1)' },{ dots: secondaryLampDots1, color: 'rgba(234,220,140,1)' },{ dots: secondaryLampDots2, color: 'rgba(234,220,140,1)' }] }),
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

                if(renderBeforeTrainPartivle3){
                    this.BeforeTrainParticles3 = this.addChild(new GO({
                        position: new V2(0,0),
                        size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:200, itemsCount: 500, size: this.size, itemFramesLengthClamps: [75,75], 
                            angleClamps: [23,27], color: 'rgba(75,75,75,0)', length: 2, yClamps: [0, 85],  xClamps: [40, 75],
                            masks: { dots: mainLabpDots, color: 'rgba(234,220,140,1)' } }),
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

                if(remderBeforeTrainSecondary1){
                    //, 
                    this.BeforeTrainParticles3 = this.addChild(new GO({
                        position: new V2(0,0),size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:200, itemsCount: 250, size: this.size, itemFramesLengthClamps: [60,60], 
                            angleClamps: [23,27], color: 'rgba(75,75,75,0)', length: 2, yClamps: [75, 105],  xClamps: [30, 60],
                            masks: [{ dots: secondaryLampDots1, color: 'rgba(234,220,140,1)' }] }),
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

                    this.BeforeTrainParticles3 = this.addChild(new GO({
                        position: new V2(0,0),size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:200, itemsCount: 250, size: this.size, itemFramesLengthClamps: [60,60], 
                            angleClamps: [23,27], color: 'rgba(75,75,75,0)', length: 2, yClamps: [75, 105],  xClamps: [70, 100],
                            masks: [{ dots: secondaryLampDots2, color: 'rgba(234,220,140,1)' }] }),
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

                if(renderBeforeTrainPartivle2){
                    this.BeforeTrainParticles2 = this.addChild(new GO({
                        position: new V2(0,0),
                        size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:200, itemsCount: 1000, size: this.size, itemFramesLengthClamps: [100,100], 
                            angleClamps: [23,27], color: 'rgba(75,75,75,0)', length: 4, lowerY: this.size.y-10, xClamps: [0, 85],
                            masks: [{ dots: mainLabpDots, color: 'rgba(234,220,140,1)' }]}),
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


                if(renderFrontal)
                {
                    this.frontalpraticles = this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:100, itemsCount: 500, size: this.size, itemFramesLengthClamps: [75,75], 
                            angleClamps: [21,28], color: 'rgba(85,85,85,0.85)', length: 6, cubic: 2/3 }),
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

                    this.frontalpraticles = this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames:  this.createParticlesFrames({framesCount:100, itemsCount: 500, size: this.size, itemFramesLengthClamps: [50,50], 
                            angleClamps: [20,30], color: 'rgba(90,90,90,1)', length: 6, cubic: 2/3 }),
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

                

                
                // let dots = this.parentScene.createRadialGradient({size: this.size, center: new V2(100,100), radius: new V2(30,15), gradientOrigin: new V2(100,100), angle: 45, setter});

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < dots.length; y++){
                //         if(!dots[y])
                //             continue;
                        
                //         for(let x = 0; x < dots[y].length; x++){
                //             if(!dots[y][x])
                //                 continue;

                //             let values = dots[y][x].values;
                //             let value = 0;
                //             for(let i = 0; i < values.length;i++){
                //                 value+=values[i];
                //             }
    
                //             value/=values.length;
    
                //             hlp.setFillColor(`rgba(255,255,255, ${fast.r(value,2)})`).dot(x, y);
                //         }
                //     }
                // })
            }
        }), 10)
    }
}