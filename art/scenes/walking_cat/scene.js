class WalkingCatScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'credits',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
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
            img: createCanvas(V2.one, (ctx, size, hlp) => { hlp.setFillColor('black').dot(0,0) })
        }), 1)

        this.cat = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-20, 0)),
            size: new V2(200, 113),
            createParticlesFrames({framesCount, itemsCount, itemFrameslength, size, xShiftClamps, alphaClamps}) {
                let frames = [];
                let eyePosition = new V2(82,57);
                let eyeColor = '#007E66';

                let globalYShift = -10;

                let flippedOpacityValues = easing.fast({from: 0.2, to: 0, steps: 30, type: 'quad', method: 'out', round: 2});
                let shadowStartY = 113;

                let sharedPP = PP.createNonDrawingInstance();

                let data = WalkingCatScene.models.catFrames.main.map(data => {
                    let cornerPoints = data.layers[0].groups[0].points.map(p => p.point);
                    let dots = sharedPP.fillByCornerPoints(cornerPoints);

                    let filledPixels = [];
                    for(let i = 0; i < cornerPoints.length;i++){
                        if(i < cornerPoints.length-1)
                            filledPixels= [...filledPixels, ...sharedPP.lineV2(cornerPoints[i], cornerPoints[i+1])];
                    }
            
                    filledPixels = [...filledPixels, ...sharedPP.lineV2(cornerPoints[cornerPoints.length-1], cornerPoints[0])];
                    let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

                    return {
                        cornerPoints,
                        linePoints: uniquePoints,
                        dots
                    }
                });

                let dataIndices = easing.fast({from: 0, to: data.length-1, steps: framesCount, type: 'linear', round: 0});
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    let dataIndex = dataIndices[startFrameIndex];

                    // let isLinePoint = getRandomInt(0,10) == 0;

                    let dots = data[dataIndex].dots;
                    let maxA = fast.r(getRandom(alphaClamps[0], alphaClamps[1]), 2);

                    // if(isLinePoint) {
                    //     dots = data[dataIndex].linePoints
                    //     maxA = fast.r(getRandom(0.7, 1), 2);
                    // }

                    let isEye = undefined;
                    // if(getRandomInt(0,80) == 0) {
                    //     isEye = {
                    //         shift: new V2(getRandomInt(-1, 1), getRandomInt(-1,1))
                    //     }
                    //     maxA = 1;
                    // }


                    let aValues = [
                        ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/10), type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames*9/10), type: 'expo', method: 'out', round: 2})
                    ]
                    
                    let p = dots[getRandomInt(0, dots.length-1)];
                    

                    let xShiftValues = easing.fast({from: 0, to: getRandomInt(xShiftClamps), steps: totalFrames, type: 'linear', round: 0})

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aValues[f],
                            xShift: xShiftValues[f],
                        };
                    }
                
                    return {
                        p,
                        isEye,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let p = itemData.p;
                                let color = 'rgba(255,255,255,'
                                if(itemData.isEye) {
                                    p = eyePosition.add(itemData.isEye.shift);
                                    color = 'rgba(0,126,102,'
                                } 
                                hlp.setFillColor(color + itemData.frames[f].a + ')').dot(p.x + itemData.frames[f].xShift, p.y + globalYShift)
                            }
                            
                        }

                        // let dataItem = data[dataIndices[f]];

                        // dataItem.dots.forEach(d => {
                        //     let flipped = flipY(d, 88)
                        //     let a = flippedOpacityValues[flipped.y - shadowStartY+25];
                        //     if(a == undefined)
                        //         a = 0;
                        //     hlp.setFillColor('rgba(255,255,255,' + a +')').dot(flipped.x, flipped.y + globalYShift)
                        // })
                        
                    });
                }
                
                return frames;
            },
            init() {

                this.frames = this.createParticlesFrames({ framesCount: 120, itemsCount: 5000, itemFrameslength: 120, 
                    xShiftClamps: [40,100], alphaClamps: [0.2, 0.5],
                    size: this.size })
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });

                // this.frames = PP.createImage(WalkingCatScene.models.catFrames);
                // let totalFrames = 300;
                // let walkCycleFrames = 120;

                // let frameIndices = easing.fast({from: 0, to: this.frames.length-1, steps: walkCycleFrames, type: 'linear', round: 0});

                // this.currentFrame = 0;
                // this.img = this.frames[frameIndices[this.currentFrame]];
                
                // this.timer = this.regTimerDefault(10, () => {
                
                //     this.img = this.frames[frameIndices[this.currentFrame]];
                //     this.currentFrame++;
                //     if(this.currentFrame == frameIndices.length){
                //         this.currentFrame = 0;
                //     }
                // })
            }
        }), 10)
    }
}