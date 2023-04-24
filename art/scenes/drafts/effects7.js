class Effects7Scene extends Scene {
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

    start(){
        let colorPrefix = 'rgba(255,255,255,'
        const appSharedPP = PP.createNonDrawingInstance();
        let createFogFrames = function({totalFrames, size, topLeft, aClamps, noiseImgSize, aMul = 1,seed, paramsDivider = 30, timeClamp = 1, cutoffValue = 10,
            noiseMultiplier = 4
        }) {
            let frames = [];

            let pn = new mathUtils.Perlin('random seed ' + (seed ? seed : getRandom(0,1000)));

            frames = [];

            let aValues = easing.fast({from: 0, to: 1, steps: 100 - cutoffValue, type: 'linear', round: 3})
            let timeValues = easing.fast({ from: 0, to: timeClamp, steps: totalFrames, type: 'linear', round: 3 })
            let globalAlpha = [
                ...easing.fast({from: aClamps[0], to: aClamps[1], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                ...easing.fast({from: aClamps[1], to: aClamps[0], steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
            ]
            
            //let paramsDivider = 30;
            let timeDivider = 1;

            for(let f = 0; f < totalFrames; f++){
                let time = timeValues[f]/timeDivider;

                let frame = createCanvas(size, (ctx, size, hlp) => {
                    ctx.globalAlpha = globalAlpha[f];
                    for(let y = topLeft.y; y < noiseImgSize.y+topLeft.y; y++){
                        for(let x = topLeft.x; x < noiseImgSize.x+topLeft.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);
                            if(noise < cutoffValue) {
                                continue; 
                            }

                            noise = fast.r(noise/noiseMultiplier)*noiseMultiplier

                            let a = aValues[noise-cutoffValue]*aMul;

                            hlp.setFillColor(colorPrefix + a + ')').dot(x,y);
                        }
                    }
                })

                frames[f] = frame;
            }

            return frames;
        }

        let createParticlesFrames = function({framesCount, itemsCount, aClamps, itemFramesLengthClamps, size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFramesLengthClamps);
            
                let p = new V2(getRandomInt(0, size.x), getRandomInt(0, size.y))
                let pSize = getRandomInt(0,10) == 0 ?  2 : 1;

                let aValues = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 3}),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 3})
                ]

                let xShift = getRandomInt(-20, 20);
                let xShiftValues = [
                    ...easing.fast({from: 0, to: xShift, steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: xShift, to: 0, steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 0})
                ]

                let yShift = getRandomInt(-20, 20);
                let yShiftValues = [
                    ...easing.fast({from: 0, to: xShift, steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: xShift, to: 0, steps: fast.r(totalFrames/2), type:'quad', method: 'inOut', round: 0})
                ]

                if(getRandomBool()) {
                    xShiftValues = [];
                }
                else {
                    yShiftValues = []
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        a: aValues[f] || 0,
                        xShift: xShiftValues[f] || 0,
                        yShift: yShiftValues[f] || 0,
                    };
                }
            
                return {
                    p,
                    pSize,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(colorPrefix + itemData.frames[f].a + ')')
                                .rect(
                                    itemData.p.x + itemData.frames[f].xShift, itemData.p.y + itemData.frames[f].yShift,
                                    itemData.pSize, itemData.pSize
                                );
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let sizeDivider = 4;
                let totalFrames = 240;
                let forSize = this.size.divide(sizeDivider)
                let frames1 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                    aMul: 1, paramsDivider: 8, cutoffValue: 30, timeClamp: 1 })
                let frames2 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                    aMul: 1, paramsDivider: 8, cutoffValue: 30, timeClamp: 1 })
                let frames3 = createFogFrames({ totalFrames, size: forSize, aClamps: [0, 1], topLeft: new V2(0,0), noiseImgSize: forSize, 
                    aMul: 1, paramsDivider: 8, cutoffValue: 30, timeClamp: 1 })

                let resultFogFrames = new Array(totalFrames).fill().map((el,f) => createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(frames1[f], 0, 0, size.x, size.y);
                    
                    let f2 = f+totalFrames/3;
                    if(f2 > (totalFrames-1)) {
                        f2-=totalFrames;
                    }
                    ctx.drawImage(frames2[f2], 0, 0, size.x, size.y);
        
                    let f3 = f+totalFrames*2/3;
                    if(f3 > (totalFrames-1)) {
                        f3-=totalFrames;
                    }
                    ctx.drawImage(frames3[f3], 0, 0, size.x, size.y);
                }))

                let ctxAngle = easing.fast({from: 0, to: 359, steps: totalFrames, type: 'linear', round: 2});
            
                this.frames = createParticlesFrames({ framesCount: totalFrames, aClamps: [0, 1],itemsCount: 5000, itemFramesLengthClamps: [50, 140], size: this.size})
                    .map((f, i) => createCanvas(this.size, (ctx, size, hlp) => {
                        //ctx.translate(-size.x/2, -size.y/2);
                        // ctx.translate(size.x/2, size.y/2);
                        // ctx.rotate(degreeToRadians(ctxAngle[i]))
                        
                        ctx.drawImage(resultFogFrames[i], 0, 0)
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(f, 0, 0)
                        
                        
                    }));
                this.registerFramesDefaultTimer({});
            }
        }), 1)
    }
}