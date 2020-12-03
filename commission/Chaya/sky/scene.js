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
                fileNamePrefix: 'chaya_stars_sky'
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


        this.nebullas2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let size = this.size;
                let visibilityEllipsis = [
                    {position: new V2(5, 0), size: new V2(60,120)},
                    {position: new V2(size.x, 80), size: new V2(40,100)}
                ]

                let mask = createCanvas(size, (ctx, size, hlp) => {
                    // hlp.setFillColor('white').rect(0,0,size.x, size.y);
                    // return;

                    let pp = new PerfectPixel({ctx});
                    let maskMaxOpacity = 0.2;
                    let aChange = easing.createProps(100, maskMaxOpacity, 0, 'quad', 'out');

                    visibilityEllipsis.forEach(lightEllipsis => {
                        lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                        lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;

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
                    })

                })

                let hsv = [230, 67, 61];
                let targetH = 310;
                let hDelta = targetH - hsv[0];

                this.frames = [];
                let maxT = 4;

                let totalFrames = 400;

                let timeValues = [
                    ...easing.fast({ from: 0, to: maxT, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut' }),
                    ...easing.fast({ from: maxT, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut' })
                ]

                //let p_seed = getRandom(0,1000);
                let p_seed = 301.30004624501237
                //let v_p_seed = getRandom(0,1000);
                let v_p_seed = 663.4611093428615
                var pn = new mathUtils.Perlin('random seed ' + p_seed);
                var v_pn = new mathUtils.Perlin('random seed ' + v_p_seed);

                for(let f = 0; f < totalFrames; f++){
                    let noiseImg = createCanvas(size, (ctx, size, hlp) => {
                        let paramsDivider = 20;
                        let paramsMultiplier = 2;
                        let time = timeValues[f];

                        let v_paramsDivider = 50;
                        let v_paramsMultiplier = 5;
                        let v_time = 0;


                        for(let y = 0; y < size.y; y++){
                            //matrix[y] = [];
                            for(let x = 0; x < size.x; x++){
                                //matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                //let noise = pn.noise(x/paramsDivider, y/paramsDivider, time/10);

                                let noiseX = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                let noiseY = pn.noise((x-100)/paramsDivider, (y+200)/paramsDivider, time/10);
                                let noise = pn.noise(noiseX*paramsMultiplier, noiseY*paramsMultiplier, time/10);

                                noise = noise*hDelta;
                                noise = fast.r(noise/5)*5;

                                let v_noiseX = v_pn.noise(x/v_paramsDivider, y/v_paramsDivider, time/10);
                                let v_noiseY = v_pn.noise((x-100)/v_paramsDivider, (y+200)/v_paramsDivider, time/10);
                                let v_noise = v_pn.noise(v_noiseX*v_paramsMultiplier, v_noiseY*v_paramsMultiplier, time/10);

                                v_noise = fast.r(v_noise*100);
                                let s = 100-v_noise;


                                hlp.setFillColor(colors.hsvToHex([hsv[0] + fast.r(noise),s,v_noise])).dot(x,y)
                            }
                        }
                    })

                    this.frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(mask, 0,0);

                        ctx.globalCompositeOperation = 'source-in';

                        ctx.drawImage(noiseImg, 0,0);
                    })   
                }

                this.registerFramesDefaultTimer({});

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
    
                            let _p = new V2(x,y).substract(center).rotate(20).add(center).toInt();
    
                            if(getRandomInt(0,2) == 0){
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
                                //framesCount*(shineData.p.y/size.y) + getRandomInt(0,20);

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
                        this.frames = this.createShineFrames({framesCount: 400, shineItems, itemFrameslength: 50, size: this.size  })

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


       

        this.shootingStars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible :true,
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
                
                    let points = sharedPP.lineV2(new V2(0, getRandomInt(0,50)), new V2(size.x+tailLength, size.y/2 + getRandomInt(0, 50)));
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
                                        hlp.setFillColor(`rgba(190,239,164, ${yOValues[i]})`).dot(point.x, point.y);
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
                this.frames = this.createShootingStarsFrames({framesCount: 400, itemsCount: 6, itemFrameslength: 15, size: this.size, tailLength: 70});
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let repeat = 1;


                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeat--;
                        if(repeat == 0){
                            this.parentScene.capturing.stop = true;
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
                let oValues = easing.fast({ from: 0, to: 0.7, steps: size.y/2, type: 'quad', method: 'in' }).map(v => fast.r(v,2));
                hlp.setFillColor('#0D2F24');

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
            position: this.sceneCenter.add(new V2(0, 29.5)),
            size: new V2(100,109),
            init() {

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 25, size: this.size, 
                            pointsData: animationHelpers.extractPointData(StarsSkyScene.models.guyStatic.main.layers.find(l => l.name == 'p')) })
                        .map(frames => {
                            return createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.filter = `brightness(75%)`;
                                ctx.drawImage(frames, 0,0);
                            })
                        });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))


                this.frames = PP.createImage(StarsSkyScene.models.guy).map(frames => {
                    return createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.filter = `brightness(75%)`;
                        ctx.drawImage(frames, 0,0);
                    })
                });

                let totalFrames = 100;
                let delay = 30;
                let frameIndexValues = [
                    ...easing.fast({ from: 0, to: this.frames.length-1, steps: fast.r((totalFrames-delay)/2), type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: this.frames.length-1, to: 0, steps: fast.r((totalFrames-delay)/2), type: 'quad', method: 'in', round: 0 }),
                    ...new Array(delay).fill(0)
                ]

                this.frames = frameIndexValues.map(fi => this.frames[fi]);

                this.registerFramesDefaultTimer({});
            }
        }), 15)

        // this.addGo(new GO({
        //     position: new V2(22,5),
        //     size: new V2(33,5),
        //     img: PP.createImage(StarsSkyScene.models.sign, { colorsSubstitutions: { '#FF0000': 
        //         {color: colors.colorTypeConverter({ value: {h:230,s:58,v:45}, toType: 'hex' })} } })
        // }), 20)
    }
}