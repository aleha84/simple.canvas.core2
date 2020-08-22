class StarsSkyScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'stars_sky'
            },
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

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
                // let cValue = colors.createColorChange('#000000', '#0D1024', 'hex', size.y/2, 'quad', 'in');//'#383A4C'
                // for(let y = size.y/2; y < size.y; y++){
                //     let index = y-(size.y/2);
                //     index = fast.r(index/4)*4;
                //     hlp.setFillColor(cValue[index]).rect(0, y, size.x, 1)
                // }

                //hlp.setFillColor('red').rect(0,10, size.x, 10)
            })
        }), 1)

        this.nebullas = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let nParams = [
                        {
                            hsv: [230,58,45],
                            sizeClamps: [30,60],
                            maskCirclesCount: 5,
                            maskPositions: [new V2(77,12),new V2(32,35),new V2(12,75),new V2(4,100),new V2(86,51)],
                            time: 0,
                            paramsDivider: 20,
                            noiseMultiplier: 0.7
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [30,60],
                            maskCirclesCount: 5,
                            maskPositions: [new V2(0, 7),new V2(54, 20),new V2(88, 52),new V2(97, 89)
                            ],
                            time: 0,
                            paramsDivider: 20,
                            noiseMultiplier: 0.75
                        },
                        {
                            hsv: [230,58,45],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(70,30),new V2(84,76),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(10,100),new V2(25,18),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [280,52,35],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(80,55),new V2(12,76),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [10,15],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(23, 18),new V2(68, 33),new V2(83, 83),
                            ],
                            time: 0,
                            paramsDivider: 8,
                            positionOnlyInside: true,
                            maskMaxOpacity: 0.2
                        },
                        {
                            hsv: [280,52,35],
                            sizeClamps: [5,10],
                            //maskCirclesCount: 1,
                            maskPositions: [
                                new V2(15,80), new V2(60,27)
                            ],
                            time: 0,
                            paramsDivider: 10,
                            positionOnlyInside: true,
                            maskMaxOpacity: 0.2
                        }
                    ]

                    nParams.forEach(params => {
                        let {hsv, sizeClamps, maskCirclesCount, maskPositions, time, paramsDivider, positionOnlyInside, maskMaxOpacity, noiseMultiplier} = params;

                        if(maskMaxOpacity == undefined)
                            maskMaxOpacity = 0.15

                        var pn = new mathUtils.Perlin('random seed ' + getRandom(0,1000));
                        // let paramsDivider = 10;
                        // let time = 0
                        // let sizeClamps = [20,40];
                        // let maskCirclesCount = 5;

                        let mask = createCanvas(size, (ctx, size, hlp) => {
                            //let sizeClamps = [size.x/10,size.x/4];
                            let count = maskPositions.length;
                            // if(maskCirclesCount != undefined)
                            //     count = maskCirclesCount;

                            for(let i =0; i <  count; i++){
                                let position = maskPositions[i];
                                // let position = new V2(getRandomInt(-sizeClamps[1]/2,size.x), getRandomInt(-sizeClamps[1]/2, size.y*2/3));
                                // if(positionOnlyInside){
                                //     position = new V2(getRandomInt(sizeClamps[1], size.x-sizeClamps[1]), getRandomInt(sizeClamps[1], size.y-sizeClamps[1]));
                                // }

                                let lightEllipsis = {
                                    position,
                                    size: new V2(getRandomInt(sizeClamps[0], sizeClamps[1]), getRandomInt(sizeClamps[0], sizeClamps[1]))
                                }
                    
                                lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                                lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
                                let pp = new PerfectPixel({ctx});
                                let aChange = easing.createProps(100, maskMaxOpacity, 0, 'quad', 'out');
                                pp.fillStyleProvider = (x,y) => {
                
                                    let dx = fast.r(
                                        (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                                        + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);
                
                                    if(dx > 100){
                                        dx = 100;
                                    }
                
                                    aChange.time = dx;
                
                                    return `rgba(255,255,255,${fast.r(easing.process(aChange),2)})`;
                                }
                                pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)]);
                            }
                        })

                        //let matrix = [];
                        let noiseImg = createCanvas(size, (ctx, size, hlp) => {
                            for(let y = 0; y < size.y; y++){
                                //matrix[y] = [];
                                for(let x = 0; x < size.x; x++){
                                    //matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                    let noise = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                    noise = noise*100;
                                    noise = fast.r(noise/5)*5;
                                    //noise/=2;
                                    if(noiseMultiplier != undefined){
                                        noise*=noiseMultiplier;
                                    }
                                    hlp.setFillColor(colors.hsvToHex([hsv[0],hsv[1],fast.r(noise)])).dot(x,y)
                                }
                            }
                        })


                        params.img = createCanvas(size, (ctx, size, hlp) => {
                            ctx.drawImage(mask, 0,0);

                            ctx.globalCompositeOperation = 'source-in';

                            ctx.drawImage(noiseImg, 0,0);
                        })
                    })

                    nParams.forEach(params => {
                        ctx.drawImage(params.img, 0,0);
                    });
                })
            }
        }), 5)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                let shineItems = [];
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    pp.setFillStyle('rgba(0,0,0,0)')
                    let linePoints = pp.lineV2(new V2(size.x/2, -20), new V2(size.x/2,size.y+20));

                    let layers = [
                        {
                            count: 1000,
                            opacity: 0.025,
                            xClamps: [-2*size.x, 2*size.x]
                        },
                        {
                            count: 250,
                            opacity: 0.1,
                            xClamps: [-size.x, size.x]
                        },
                        {
                            count: 50,
                            opacity: 0.15,
                            xClamps: [-size.x, size.x*2]
                        },
                        {
                            count: 100,
                            opacity: 0.25,
                            xClamps: [-size.x/2, size.x/2]
                        },
                        {
                            count: 25,
                            opacity: 0.5,
                            xClamps: [-size.x/4, size.x/4]
                        }
                    ]

                    let center = size.divide(2);

                    layers.forEach(layer => {
                        
                        for(let i = 0; i < layer.count; i++) {
                            let o = layer.opacity//oValues[getRandomInt(0, oValues.length)];
                            let p = linePoints[getRandomInt(0, linePoints.length-1)];
                            let y = p.y;
                            let x = p.x + getRandomGaussian(layer.xClamps[0], layer.xClamps[1]);
    
                            let _p = new V2(x,y).substract(center).rotate(-20).add(center).toInt();
    
                            if(getRandomInt(0,3) == 0){
                                let hasLeafs = 0;
                                if(getRandomInt(0,2) == 0){
                                    hasLeafs = getRandomInt(1,3);
                                }
                                shineItems.push({
                                    p: _p,
                                    o,
                                    hasLeafs
                                });
                            }
    
                            hlp.setFillColor(`rgba(255,255,255, ${o})`)//.dot(getRandomInt(0, size.x), getRandomInt(0, size.y));
                            .dot(_p.x, _p.y)
                        }
                    })

                    //let count = 250;
                    //let oValues = easing.fast({from: 0.05, to: 0.1, steps: 5, type: 'linear', method: 'base'}).map(v => fast.r(v,2));

                    
                })

                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createShineFrames({framesCount, shineItems, itemFrameslength, size}) {
                        let frames = [];
                        
                        let itemsData = shineItems.map((shineData, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength + getRandomInt(0, itemFrameslength/2);
                            if(totalFrames%2!=0)
                                totalFrames++;
                        
                            let maxo = shineData.o*3;
                            if(maxo > 1)
                                maxo = 1;
                            let oValues = [
                                ...easing.fast({ from: 0, to: maxo, steps: fast.r(totalFrames/2), type: 'quad', method: 'out' }).map(v => fast.r(v,2)),
                                ...easing.fast({ from: maxo, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'in' }).map(v => fast.r(v,2))
                            ]
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    o: oValues[f]
                                };
                            }
                        
                            return {
                                p:shineData.p,
                                hasLeafs: shineData.hasLeafs,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o})`).dot(itemData.p.x, itemData.p.y)

                                        if(itemData.hasLeafs){
                                            hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o/4})`)
                                                .dot(itemData.p.x-1, itemData.p.y)
                                                .dot(itemData.p.x+1, itemData.p.y)
                                                .dot(itemData.p.x, itemData.p.y-1)
                                                .dot(itemData.p.x, itemData.p.y+1)
                                            
                                            if(itemData.hasLeafs > 1){
                                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o/12})`)
                                                    .dot(itemData.p.x-1, itemData.p.y-1)
                                                    .dot(itemData.p.x+1, itemData.p.y+1)
                                                    .dot(itemData.p.x+1, itemData.p.y-1)
                                                    .dot(itemData.p.x-1, itemData.p.y+1)


                                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o/8})`)
                                                .dot(itemData.p.x-2, itemData.p.y)
                                                .dot(itemData.p.x+2, itemData.p.y)
                                                .dot(itemData.p.x, itemData.p.y-2)
                                                .dot(itemData.p.x, itemData.p.y+2)
                                            }

                                            if(itemData.hasLeafs > 2){
                                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].o/12})`)
                                                    .dot(itemData.p.x-3, itemData.p.y)
                                                    .dot(itemData.p.x+3, itemData.p.y)
                                                    .dot(itemData.p.x, itemData.p.y-3)
                                                    .dot(itemData.p.x, itemData.p.y+3)
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createShineFrames({framesCount: 200, shineItems, itemFrameslength: 50, size: this.size  })

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }

                            this.img = this.frames[this.currentFrame];
                        })
                    }
                }))
            }
        }), 6)


        this.comet = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createCometFrames({framesCount,additionalFramesCount, size}) {
                let frames = [];
                let cometImg = PP.createImage(StarsSkyScene.models.comet2);
                let cometSize = new V2(50,50);
                let linePoints = [];
                let p1 = new V2(size.x, -cometSize.y);
                let p2 = new V2(-cometSize.x, size.x-cometSize.y + 52);
                let sharedPP;
                createCanvas(new V2(1,1), (ctx, _size, hlp) => {
                    sharedPP = new PP({ctx});
                    linePoints = sharedPP.lineV2(p1, p2);
                })

                let dir = p2.direction(p1);
                let particles = [];
                
                let linePointIndexValues = easing.fast({from: 0, to: linePoints.length-1,steps: framesCount, type: 'linear', round: 0});
                let particlesColorRgb = colors.colorTypeConverter({ value: '#FFC1E5', toType: 'rgb' });

                for(let f = 0; f < framesCount+additionalFramesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let p;
                        if(f < framesCount){
                            p = linePoints[linePointIndexValues[f]];
                            //ctx.drawImage(cometImg, p.x, p.y);
                        }
                        
                        // let pp = new PP({ctx});
                        // pp.setFillStyle('red');
                        // pp.lineV2(p1.add(new V2(0, cometSize.y-3)), p2.add(new V2(0, cometSize.y-3)));

                        particles = particles.filter(p => p.alive);

                        //process
                        for(let i = 0; i < particles.length; i++){
                            let particle = particles[i];
                            if(particle.currentTtlIndex >= particle.ttl){
                                particle.alive =false;
                                continue;
                            }

                            let oValue = particle.oValues[particle.currentTtlIndex];
                            let point = new V2(particle.linePoints[particle.linePointsIndexValues[particle.currentTtlIndex]])//.add(dir.mul(particle.currentTtlIndex)).toInt();
                            if(particle.special){
                                point = point.add(dir.mul(particle.currentTtlIndex)).toInt();
                            }

                            hlp.setFillColor(`rgba(${particlesColorRgb.r}, ${particlesColorRgb.g}, ${particlesColorRgb.b}, ${oValue})`).dot(point.x, point.y);

                            particle.currentTtlIndex++;
                        }

                        //add new 
                        if(p){
                            let count = getRandomInt(2,5);
                            for(let i = 0; i < count; i++){
                                let ttl = getRandomInt(additionalFramesCount/2,additionalFramesCount);
                                let angle = getRandomInt(-65,65);
                                let distance = getRandomInt(5,15);
                                let special = false;
                                if(getRandomInt(0,10) == 0){
                                    angle = getRandomInt(90, 90)*(getRandomBool() ? 1 : -1);
                                    distance = getRandomInt(30,60);
                                    special = true;
                                }

                                let direction = dir.rotate(angle);
                                let from = new V2(p).add(new V2(2, cometSize.y-5)).add(direction.mul(getRandomInt(1,2)));
                                let target = from.add(direction.mul(distance));
                                let linePoints = sharedPP.lineV2(from, target);
                                let linePointsIndexValues = easing.fast({from: 0, to: linePoints.length-1,steps: ttl, type: 'linear', method: 'base', round: 0});
                                //let linePointsIndexValues = easing.fast({from: 0, to: linePoints.length-1,steps: ttl, type: 'quad', method: 'out', round: 0});
                                particles[particles.length] = {
                                    alive: true,
                                    ttl,
                                    currentTtlIndex: 0,
                                    oValues: easing.fast({from: 0.5, to: 0, steps: ttl, type: 'quad', method: 'out', round: 2}),
                                    linePoints,
                                    linePointsIndexValues,
                                    special
                                }
                            }

                            ctx.drawImage(cometImg, p.x, p.y);
                        }
                        
                    });
                }
                
                return frames;
            },
            init() {
                // this.img = PP.createImage(StarsSkyScene.models.comet);

                this.frames = this.createCometFrames({framesCount: 50,additionalFramesCount:50, size: this.size});

                let counter = 0;
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 400;
                let animationRepeatDelay = animationRepeatDelayOrigin;

                let repeat = 2;
                
                this.timer = this.regTimerDefault(10, () => {
                    counter++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay >= 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        console.log('Comet frames:' + counter);
                        counter = 0;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 7)

        this.shootingStars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createShootingStarsFrames({framesCount, itemsCount, itemFrameslength, size, tailLength}) {
                let frames = [];
                
                let sharedPP;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                let yoValuesCount = fast.r(tailLength/4)
                let oValues = easing.fast({from: 0.75, to: 0, steps: tailLength, type: 'quad', method: 'out'}).map(v => fast.r(v,2));
                let yOValues = easing.fast({from: 0.5, to: 0, steps: yoValuesCount, type: 'quad', method: 'out'}).map(v => fast.r(v,2));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let points = sharedPP.lineV2(new V2(size.x, getRandomInt(0,10)), new V2(-tailLength, size.y/2 + getRandomInt(0, 20)));
                    let indexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            index: f
                        };
                    }
                
                    return {
                        points,
                        indexValues,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let index = itemData.indexValues[itemData.frames[f].index];
                                //let point = itemData.points[index];

                                for(let i = 0; i < tailLength; i++){
                                    let _index = index-i;
                                    if(_index < 0)
                                        break;

                                    let point = itemData.points[_index];

                                    hlp.setFillColor(`rgba(255,255,255, ${oValues[i]})`).dot(point.x, point.y);
                                    if(i < 15){
                                        hlp.setFillColor(`rgba(255,255,255, ${oValues[i]/5})`).dot(point.x, point.y+1).dot(point.x, point.y-1);
                                    }

                                    if(i < yoValuesCount){
                                        hlp.setFillColor(`rgba(255,239,164, ${yOValues[i]})`).dot(point.x, point.y);
                                    }
                                }

                                for(let i = 0; i < 4; i++){
                                    let _index = index+i;
                                    if(_index >= itemData.points.length)
                                        break;
                                    
                                    let point = itemData.points[_index];

                                    hlp.setFillColor(`rgba(255,255,255, ${1/(i+2)})`).dot(point.x, point.y);
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createShootingStarsFrames({framesCount: 200, itemsCount: 2, itemFrameslength: 15, size: this.size, tailLength: 70});
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let repeat = 5;


                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeat--;
                        if(repeat == 0){
                            //this.parentScene.capturing.stop = true;
                        }
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 8)

        this.hLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                let oValues = easing.fast({ from: 0, to: 1, steps: size.y/2, type: 'quad', method: 'in' }).map(v => fast.r(v,2));
                hlp.setFillColor('#0D1024');

                for(let y = size.y/2; y < size.y; y++){
                    let index = y-(size.y/2);
                    index = fast.r(index/4)*4;
                    ctx.globalAlpha = oValues[index];
                    hlp.rect(0, y, size.x, 1)
                }
                // let cValue = colors.createColorChange('#000000', '#0D1024', 'hex', size.y/2, 'quad', 'in');//'#383A4C'
                // for(let y = size.y/2; y < size.y; y++){
                //     let index = y-(size.y/2);
                //     index = fast.r(index/4)*4;
                //     hlp.setFillColor(cValue[index]).rect(0, y, size.x, 1)
                // }

                //hlp.setFillColor('red').rect(0,10, size.x, 10)
            })
        }), 7)


        this.guy = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 45)),
            size: new V2(100,100),
            init() {
                this.frames = PP.createImage(StarsSkyScene.models.guy).map(frames => {
                    return createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.filter = `brightness(75%)`;
                        ctx.drawImage(frames, 0,0);
                    })
                })

                this.frames = [
                    // this.frames[0], this.frames[1], this.frames[0],
                    // this.frames[0], this.frames[1], this.frames[0],
                ...this.frames, ...this.frames.reverse()];

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     let img = PP.createImage(StarsSkyScene.models.guy);
                //     ctx.filter = `brightness(50%)`;
                //     ctx.drawImage(img, 0,0);
                // })
                let totalFrames = 0;

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 10;
                let frameChangeDelay = originFrameChangeDelay; 

                let animationRepeatDelayOrigin = 26;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let iteration = 0;

                this.timer = this.regTimerDefault(10, () => {
                    totalFrames++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;

                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;

                    frameChangeDelay = originFrameChangeDelay;
                    // if(this.currentFrame < 3+3)
                    //     frameChangeDelay = originFrameChangeDelay*2;
                    // else if(this.currentFrame >= 3+3 && this.currentFrame < 7+3)
                    //     frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    // else 
                    //     frameChangeDelay = originFrameChangeDelay;

                    if(this.currentFrame < this.frames.length/2)
                        frameChangeDelay = fast.r(originFrameChangeDelay/2);
                    

                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        console.log('guy frames:' + totalFrames);
                        totalFrames = 0;
                        iteration++;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), 15)

        this.addGo(new GO({
            position: new V2(22,5),
            size: new V2(33,5),
            img: PP.createImage(StarsSkyScene.models.sign, { colorsSubstitutions: { '#FF0000': 
                {color: colors.colorTypeConverter({ value: {h:230,s:58,v:45}, toType: 'hex' })} } })
        }), 20)
    }
}