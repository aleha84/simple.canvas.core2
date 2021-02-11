class BigmoodbernUmbrellaScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(896,1600),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'BigmoodbernUmbrella'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = BigmoodbernUmbrellaScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: 'bg' })
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: 'm_0' }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 50, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRainFrames({framesCount, itemsCount, itemFallFrameslength, itemSplashFramesLength, size}) {

                if(itemFallFrameslength + itemSplashFramesLength > framesCount)
                    throw `${itemFallFrameslength + itemSplashFramesLength}(itemFallFrameslength + itemSplashFramesLength) > ${framesCount}(framesCount)`;

                let frames = [];
                
                let impactAreaCornerDots = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'impact_area'));
                let impactAreaDotsByX = [];
                let sharedPP = undefined
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});

                    let impactAreaDots = sharedPP.fillByCornerPoints(impactAreaCornerDots.map(p => new V2(p.point)));
                    impactAreaDots.forEach(d => {
                        if(!impactAreaDotsByX[d.x]){
                            impactAreaDotsByX[d.x] = [];
                        }

                        impactAreaDotsByX[d.x].push(d.y);
                    });

                })
                let colorHex = '#009AFB'
                let darker = '#0074bd'
                let brighter = '#40b4fc'
                let colorsRGB = [
                    colors.colorTypeConverter({value: colorHex, toType:'rgb'}),
                    colors.colorTypeConverter({value: darker, toType:'rgb'}),
                    colors.colorTypeConverter({value: brighter, toType:'rgb'})
                ]
                //#009AFB
                //#7fad87
                
                //let itemColorRgb = colors.colorTypeConverter({value: colorHex, toType:'rgb'});
                let itemLength = 8;

                let itemFallFrameslengthDeviation = fast.r(itemFallFrameslength*0.1)
                let itemSplashFramesLengthDeviation = fast.r(itemSplashFramesLength*0.1)

                let oValues = easing.fast({ from: 1, to: 0, steps: itemLength, type: 'cubic', method: 'out', round: 2})

                let xClamps = [24,88];
                let width = xClamps[1] - xClamps[0];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFallFrames = itemFallFrameslength + getRandomInt(-itemFallFrameslengthDeviation, itemFallFrameslengthDeviation);
                    let totalSplashFrames = itemSplashFramesLength + getRandomInt(-itemSplashFramesLengthDeviation, itemSplashFramesLengthDeviation);

                    let x = getRandomInt(xClamps[0], xClamps[1])
                    let y = getRandomInt(-50, -itemLength)

                    let impactY = impactAreaDotsByX[x][getRandomInt(0, impactAreaDotsByX[x].length-1)];
                    let yValues = easing.fast({
                        from: y, 
                        to: impactY, 
                        steps: totalFallFrames, 
                        type: 'linear', 
                        method: 'base', 
                        round: 0,
                    })

                    // let itemColorHsv = colors.colorTypeConverter({value: colorHex, toType:'hsv'});
                    // itemColorHsv.v += 5*getRandomInt(-3, 0);
                    let itemColorRgb = colorsRGB[getRandomInt(0, colorsRGB.length-1)] //colors.colorTypeConverter({value: itemColorHsv, toType:'rgb'});
                
                    let frames = [];
                    for(let f = 0; f < totalFallFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yValues[f]
                        };
                    }

                    let splashCount = getRandomInt(1,3);
                    let splashData = new Array(splashCount).fill().map(el => {
                        let angle = V2.up.rotate(getRandomInt(-30,30));

                        if((x <= xClamps[0] + width*0.1) && getRandomBool()){
                            angle = V2.left.rotate(getRandomInt(-45,-15));       
                        }
                        else if ((x >= xClamps[1] - width*0.1) && getRandomBool()) {
                            angle = V2.right.rotate(getRandomInt(45,15));       
                        }
                            
                        return {
                            aChange: easing.fast({from: 1, to: 0.5, steps: totalSplashFrames, type: 'quad', method: 'out', round: 2}),
                            current: new V2(x, impactY),
                            ds: angle.mul(getRandom(0.25,0.75)),
                            yDelta: getRandom(0.0125,0.025) //getRandom(0.025,0.05)
                        }
                    })



                    for(let f = 0; f < totalSplashFrames; f++){
                        let frameIndex = totalFallFrames + f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            splashes: []
                        }

                        splashData.forEach(sd => {
                            sd.current = sd.current.add(sd.ds);
                            sd.ds.y+=sd.yDelta;

                            frames[frameIndex].splashes.push({
                                p: sd.current.toInt(),
                                a: sd.aChange[f]
                            })
                        })
                    }
                
                    return {
                        x,
                        itemColorRgb,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                if(itemData.frames[f].splashes) {
                                    itemData.frames[f].splashes.forEach(sd => {
                                        hlp.setFillColor(`rgba(${itemData.itemColorRgb.r},${itemData.itemColorRgb.g},${itemData.itemColorRgb.b}, ${sd.a})`).dot(sd.p)
                                    })
                                }
                                else {
                                    for(let i = 0; i < itemLength; i++){
                                        let opacity = oValues[i];
                                        if(opacity == undefined)
                                            opacity = 0;
    
    
                                        hlp.setFillColor(`rgba(${itemData.itemColorRgb.r},${itemData.itemColorRgb.g},${itemData.itemColorRgb.b}, ${opacity})`).dot(itemData.x, itemData.frames[f].y-i)
                                    }
    
                                    hlp.setFillColor(`rgba(${itemData.itemColorRgb.r},${itemData.itemColorRgb.g},${itemData.itemColorRgb.b}, ${0.5})`).dot(itemData.x, itemData.frames[f].y+1)
                                    //hlp.setFillColor(`rgba(${itemColorRgb.r},${itemColorRgb.g},${itemColorRgb.b}, ${0.25})`).dot(itemData.x, itemData.frames[f].y+2)
                                }
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createRainFrames({ framesCount: 300, itemsCount: 300, itemFallFrameslength: 100, itemSplashFramesLength: 50, 
                size: this.size })

                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let a = true;
                    },
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                    }

                });
            }
        }), 15)

        this.createDropsFrames = function({framesCount, itemsCount, itemFrameslength, size, color}) {
            let frames = [];
            
            let dropsStartDots = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'drop_start_p')).map(p => new V2(p.point).add(new V2(0,1)));

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let start = dropsStartDots[getRandomInt(0, dropsStartDots.length-1)];
                if(getRandomBool()) {
                    let indexClamps = [0, 20];
                    if(getRandomBool()) {
                        indexClamps = [dropsStartDots.length-20, dropsStartDots.length-1]
                    }

                    start = dropsStartDots[getRandomInt(indexClamps[0], indexClamps[1])];
                }
                let lengthValues = easing.fast({from: 1, to: getRandomInt(1,3), steps: totalFrames, type: 'quad', method: 'in', round: 0});
                let yValues = easing.fast({from: start.y, to: size.y + getRandomInt(0,30), steps: totalFrames, type: 'quad', method: 'in'}).map(v => fast.r(v))

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        y: yValues[f],
                        length: lengthValues[f]
                    };
                }
            
                return {
                    x: start.x,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(color).rect(itemData.x,itemData.frames[f].y, 1, itemData.frames[f].length)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.frontalDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createDropsFrames({ framesCount: 300, itemsCount: 75, itemFrameslength: 125, size: this.viewport, color: '#009AFB' }),
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), 20)

        this.backDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createDropsFrames({ framesCount: 300, itemsCount: 75, itemFrameslength: 125, size: this.viewport, color: '#0074bd' }),
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), 5)
    }
}