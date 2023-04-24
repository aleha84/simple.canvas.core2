class Draft1Scene extends Scene {
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
                fileNamePrefix: 'spikes',
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
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.setFillColor('black').dot(0,0);
                })
            }
        }), 1)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDraftFrames({framesCount, itemsCount, itemFrameslength, size, maxAClamps, maxRClamps}) {
                let frames = [];
                
                let center = size.divide(2);
                let sharedPP = PP.createNonDrawingInstance();

                // let maxRClampsToTime = 
                // easing.fast({from: 5, to: 150, steps: framesCount, type: 'linear', round: 0})

                // let maxAClampsToTime = 
                // easing.fast({from: 0.25, to: 0.9, steps: framesCount, type: 'linear', round: 2})

                // let itemFrameslengthToTime = 
                // easing.fast({from: 100, to: 40, steps: framesCount, type: 'linear', round: 0})

                // let lengthToTime = 
                // easing.fast({from: 1, to: 7, steps: framesCount, type: 'cubic', method: 'in', round: 0})

                let maxRClampsToTime = 
                easing.fast({from: 60, to: 60, steps: framesCount, type: 'linear', round: 0})

                let maxAClampsToTime = 
                easing.fast({from: 0.5, to: 0.5, steps: framesCount, type: 'linear', round: 2})

                let itemFrameslengthToTime = 
                easing.fast({from: 100, to: 100, steps: framesCount, type: 'linear', round: 0})

                let lengthToTime = 
                easing.fast({from: 1, to: 1, steps: framesCount, type: 'cubic', method: 'in', round: 0})

                //let triggersData = [];

                let arr = new Array(framesCount/10).fill(0);
                // let doubleFramesCount = framesCount*2;

                let frPerStep = 10;
                let steps = framesCount/frPerStep
                let coefficients = new Array(steps).fill().map((el, i) => i/steps);
                let x = itemsCount/coefficients.reduce((prev, cur) => prev+cur, 0);

                let itemsPerStep = coefficients.map(c => fast.r(c*x));

                itemsPerStep[0] = 1;
                console.log(itemsPerStep)
                //debugger;

                let currentDistributionStep = 0;

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    // let startFrameIndex =  fast.r(getRandomGaussian(0, doubleFramesCount));
                    // if(startFrameIndex >= framesCount) {
                    //     startFrameIndex = doubleFramesCount - startFrameIndex;
                    // }

                    //let startFrameIndex = getRandomInt(currentDistributionStep*10, currentDistributionStep*10 + (frPerStep -1))
                    let startFrameIndex = getRandomInt(0, framesCount-1)

                    itemsPerStep[currentDistributionStep]--;

                    if(itemsPerStep[currentDistributionStep] == 0) {
                        currentDistributionStep++
                    }

                    if(startFrameIndex == framesCount) {
                        startFrameIndex--;
                    }

                    //console.log(startFrameIndex);
                    arr[fast.r(startFrameIndex/10)]++;

                     //getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthToTime[startFrameIndex], itemFrameslengthToTime[startFrameIndex] + 20) //isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
                
                    let angle = getRandom(0, 360);
                    let direction = V2.up.rotate(angle);

                    let mrc = [maxRClampsToTime[startFrameIndex], maxRClampsToTime[startFrameIndex]+10]

                    let p1 = center.add(
                        direction.mul(getRandomInt(mrc)) //40, 50
                    )

                    let angle2 = angle - 180 + getRandomInt(-60, 60);
                    let direction2 = V2.up.rotate(angle2);
                    let p2 = center.add(
                        direction2.mul(getRandomInt(mrc))
                    )

                    let maxA = getRandom(0.05, maxAClampsToTime[startFrameIndex])
                    //getRandom(0.1, 0.5);

                    let points = sharedPP.lineV2(p1, p2);
                    let indices = easing.fast({ from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0});

                    let len1 = fast.r(totalFrames*getRandom(0.2, 0.8));
                    let len2 = totalFrames-len1;

                    let aValues = [
                        ...easing.fast({from: 0, to: maxA, steps: len1, type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({from: maxA, to: 0, steps: len2, type: 'quad', method: 'inOut', round: 2 }),
                    ]

                    let len = lengthToTime[startFrameIndex];

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let a = aValues[f];
                        if(a == undefined)
                            a = 0;

                        let p = points[indices[f]]
                        let index = indices[f]
                      

                        frames[frameIndex] = {
                            p,
                            index,
                            a
                        };
                    }
                
                    return {
                        len,
                        points,
                        frames
                    }
                })

                console.log(itemsPerStep)
                //console.log(arr);
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('rgba(255,255,255,' + itemData.frames[f].a + ')')//.dot(itemData.frames[f].p)

                                for(let i = 0; i < itemData.len; i++ ) {
                                    let index = itemData.frames[f].index - i;
                                    if(index < 0)
                                        break;

                                    let p = itemData.points[index];
                                    hlp.dot(p)
                                }
                            }
                            
                        }

                        // for(let p = 0; p < triggersData.length; p++){
                        //     let itemData = triggersData[p];
                            
                        //     if(itemData.frames[f]){
                        //         hlp.setFillColor('rgba(255,255,255,' + 0.1 + ')').dot(itemData.frames[f].p)
                        //     }
                            
                        // }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createDraftFrames({ framesCount: 120, itemsCount: 1000, itemFrameslength: [60, 120], size: this.size,
                    maxAClamps: [0.05, 0.1], maxRClamps: [10,20]  })
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 5)
    }
}