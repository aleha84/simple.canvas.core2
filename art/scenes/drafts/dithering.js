class DitheringScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(150,200).mul(4),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'dithering',
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
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0)
            })
        }), 1)

        let a1 = new Array(50).fill().map((el, i) => 1 + i*4)
        let a2 = new Array(50).fill().map((el, i) => 3 + i*4)

        let b1 = new Array(50).fill().map((el, i) => i*4)
        let b2 = new Array(50).fill().map((el, i) => 2+ i*4)



        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDithering({data, hlp, xClamps}) {

                let sharedPP = PP.createNonDrawingInstance();

                data.forEach(d => {
                    let {c1, c2, divider, dividerPoints} = d;

                    let linePoints = [];

                    if(divider) {
                        let p1 = new V2(x1,divider);
                        let p2 = new V2(x2,divider);

                        linePoints = sharedPP.lineV2(p1, p2).map(p => new V2(p))
                    }

                    if(dividerPoints) {
                        linePoints = dividerPoints.map(p => new V2(p))
                    }

                    for(let i = 0; i < 2; i++) {
                        let c = undefined;
                        if(i == 0) {
                            c = c1;
                        }
                        else {
                            c = c2;
                        }

                        let d = i == 0 ? -1 : 1;
                        let xShift = i == 1 ? new V2(1, 0) : new V2()

                        let affectedPoints0 = [];
                        let affectedPoints1 = [];
                        let affectedPoints2 = [];
                        let affectedPoints3 = [];
                        // let r1 = 7;
                        // let r2 = 4;
                        // let r3 = 2;

                        let r0 = 14;
                        let r1 = 10;
                        let r2 = 6;
                        let r3 = 2;
    
                        if(i == 1) {
                            r0-=2
                            r1-=2
                            r2-=2
                        }

                        linePoints.forEach(lp => {
                            //let aPoints = sharedPP.lineV2(lp, lp.add(direction2.mul(r1)));
                            let aPoints0 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r0))).map(p => new V2(p));
                            affectedPoints0.push(...aPoints0);

                            let aPoints1 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r1))).map(p => new V2(p));
                            affectedPoints1.push(...aPoints1);
    
                            let aPoints2 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r2))).map(p => new V2(p));
                            affectedPoints2.push(...aPoints2);
    
                            //let aPoints2 = sharedPP.lineV2(lp, lp.add(direction2.mul(r2)));
                            let aPoints3 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r3))).map(p => new V2(p));
                            affectedPoints3.push(...aPoints3);
                        })
    
                        affectedPoints0 = distinctPoints(affectedPoints0)
                        affectedPoints1 = distinctPoints(affectedPoints1)
                        affectedPoints2 = distinctPoints(affectedPoints2)
                        affectedPoints3 = distinctPoints(affectedPoints3)
    
                        let putDot = (p, c) => {
                            if(p.x > xClamps[1])
                                return;

                            hlp.setFillColor(c).dot(p)
                        }

                        affectedPoints0.forEach(ap => {
                            if(ap.x%2 == 0 && ap.y%2==0) {
                                if(b1.indexOf(ap.y)!=-1 && b1.indexOf(ap.x) !=-1)
                                    putDot(ap.add(xShift),c)
                                else if(b2.indexOf(ap.y)!=-1 && b2.indexOf(ap.x) !=-1)
                                    putDot(ap.add(xShift),c)
                            }
                        })
   
                        affectedPoints1.forEach(ap => {
                            if(ap.x%2 == 0 && ap.y%2==0) {
                                putDot(ap.add(xShift),c)
                            }
                        })
    
                        affectedPoints2.forEach(ap => {
                            if(ap.x%2 == 0 && ap.y%2==0) {
                                putDot(ap.add(xShift), c)
                            }
                            else {
                                if(a1.indexOf(ap.y) != -1 && a1.indexOf(ap.x) != -1) {
                                    putDot(ap.add(xShift),c)
                                }
                                else if(a2.indexOf(ap.y) != -1 && a2.indexOf(ap.x) != -1){
                                    putDot(ap.add(xShift),c)
                                }
    
                            }
    
                        })
    
                        if( i == 0) {
        
                            affectedPoints3.forEach(ap => {
                                let shift = ap.y %2 == 0;
                                if((shift && ap.x % 2 == 0) || (!shift && ap.x%2 != 0)){
                                    hlp.setFillColor(c).dot(ap)
                                }
                            })
                        }
                    }
                });
            },
            createImage({ curvePointsData, size,colorsData, colorSteps, gaps, heightPerStep, xClamps }) {
                return createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    let sharedPP = PP.createNonDrawingInstance();

                    let data = [];


                    // for(let i = 0; i < steps; i++) {
                    //     let _color = '#' + rgbToHex([rValues[i], gValues[i], bValues[i]]);
                    //     let startY = verticalGaps + heightPerStep*(i)
                    //     let dividerYValue = verticalGaps + heightPerStep*(i+1)

                    //     pp.setFillColor(_color);
                        
                    //     pp.fillByCornerPoints([new V2(x1, startY), new V2(x2, startY), new V2(x2, dividerYValue), new V2(x1, dividerYValue) ])

                    //     if(i < (steps-1)) {
                    //         data.push({
                    //             c2: '#' + rgbToHex([rValues[i], gValues[i], bValues[i]]),
                    //             c1: '#' + rgbToHex([rValues[i+1], gValues[i+1], bValues[i+1]]),
                    //             divider: dividerYValue
                    //         })
                    //     }
                    // }

                    //debugger;
                    for(let i = 0; i < colorSteps; i++) {
                        let _color = '#' + rgbToHex([colorsData.rValues[i], colorsData.gValues[i], colorsData.bValues[i]]);
                        pp.setFillColor(_color);
                        if(i == 0) {
                            let startY = gaps.verticalGaps
                            pp.fillByCornerPoints([new V2(xClamps[0], startY), new V2(xClamps[1], startY), new V2(xClamps[1], startY + heightPerStep*2), new V2(xClamps[0], startY + heightPerStep*2) ])

                            continue;
                        }
                        
                        let dividerYValue = gaps.verticalGaps + heightPerStep*i
                        // let points = [
                        //     new V2(x1, dividerYValue + getRandomInt(-3,3)), 
                        //     new V2(fast.r(x1 + (size.x-horizontalGaps*2)/3) + getRandomInt(-3,3) , dividerYValue + getRandomInt(-3,3)),
                        //     new V2(fast.r(x1 + (size.x-horizontalGaps*2)*2/3)+ getRandomInt(-3,3) , dividerYValue + getRandomInt(-3,3)),
                        //     new V2(x2, dividerYValue + getRandomInt(-3,3)), 
                        // ];
                        let points = curvePointsData[i];

                        let filledPixels = [];
                        let curvePoints = mathUtils.getCurvePointsMain({points: points, isClosed: false, numOfSegments: 8 });
                        for(let i = 1; i < curvePoints.length; i++) {
                            filledPixels= [...filledPixels, ...sharedPP.lineV2(curvePoints[i-1], curvePoints[i])];
                        }

                        let dividerPoints = distinctPoints(filledPixels);

                        let pn_1 = new V2(xClamps[1], dividerYValue + heightPerStep*2);
                        let pn = new V2(xClamps[0],dividerYValue + heightPerStep*2)

                        if(pn_1.y > this.size.y - gaps.verticalGaps) {
                            pn_1.y = this.size.y - gaps.verticalGaps;
                        }

                        if(pn.y > this.size.y - gaps.verticalGaps) {
                            pn.y = this.size.y - gaps.verticalGaps;
                        }

                        pp.fillByCornerPoints([
                            ...dividerPoints,
                            pn_1,pn ])

                        data.push({
                            c2: '#' + rgbToHex([colorsData.rValues[i-1], colorsData.gValues[i-1], colorsData.bValues[i-1]]),
                            c1: '#' + rgbToHex([colorsData.rValues[i], colorsData.gValues[i], colorsData.bValues[i]]),
                            dividerPoints
                        })
                    }

                    this.createDithering({data, hlp, xClamps}) 
                    //return;

                })
            },
            init() {
                let totalFrames = 300;
                this.frames = [];
                let steps = 6;
                let verticalGaps = 10;
                let horizontalGaps = 10;
                let availableHeight = this.size.y-verticalGaps*2;
                let startColor = '#711A20';
                let finishColor = '#F3621F'
                let startColorRgb = colors.colorTypeConverter({ value: startColor, toType: 'rgb', fromType: 'hex' })
                let finishColorRgb = colors.colorTypeConverter({ value: finishColor, toType: 'rgb', fromType: 'hex' })

                let rValues = easing.fast({from: startColorRgb.r, to: finishColorRgb.r, steps, type: 'linear', round: 0});
                let gValues = easing.fast({from: startColorRgb.g, to: finishColorRgb.g, steps, type: 'linear', round: 0});
                let bValues = easing.fast({from: startColorRgb.b, to: finishColorRgb.b, steps, type: 'linear', round: 0});

                let heightPerStep = fast.r(availableHeight/steps);
                let x1 = horizontalGaps;
                let x2 = this.size.x-horizontalGaps;

                let curvePointsData = [];

                for(let i = 0; i < steps; i++) {
                    if(i == 0) {
                        continue;
                    }

                    let dividerYValue = verticalGaps + heightPerStep*i
                    let points = [
                        new V2(x1, dividerYValue), 
                        new V2(fast.r(x1 + (this.size.x-horizontalGaps*2)/3) + getRandomInt(-3,3) , dividerYValue),
                        new V2(fast.r(x1 + (this.size.x-horizontalGaps*2)*2/3)+ getRandomInt(-3,3) , dividerYValue),
                        new V2(x2, dividerYValue), 
                    ];

                    curvePointsData[i] = {
                        points,
                        yValues: [

                        ]
                    }

                    for(let j = 0; j < 4; j++) {
                        let deltaFrom = getRandomInt(3,6)*(getRandomBool() ? 1 : -1);
                        let deltaTo = deltaFrom*-1;

                        // let deltaFrom = getRandomInt(-3,3)
                        // let deltaTo = getRandomInt(-3,3)

                        let yValues = [
                            ...easing.fast({from: deltaFrom, to: deltaTo, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: deltaTo, to: deltaFrom, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2})
                        ]

                        let startFrameIndex = getRandomInt(0, totalFrames-1);
                        curvePointsData[i].yValues[j] = [];
                        for(let f = 0; f < totalFrames; f++) {
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (totalFrames-1)){
                                frameIndex-=totalFrames;
                            }
                            curvePointsData[i].yValues[j][frameIndex] = yValues[f];
                        }
                        
                    } 
                }

                for(let f = 0; f < totalFrames; f++) {
                    let _curvePointsData = [];
                    for(let i = 1; i < curvePointsData.length; i++) {
                        _curvePointsData[i] = curvePointsData[i].points.map(
                            (p,j) => p.add(new V2(0,curvePointsData[i].yValues[j][f]))
                        )
                    }
    
                    this.frames[f] = this.createImage({
                        curvePointsData: _curvePointsData,
                        size: this.size,
                        colorsData: {
                            rValues, gValues, bValues
                        },
                        colorSteps: steps,
                        gaps: { verticalGaps, horizontalGaps },
                        heightPerStep,
                        xClamps: [x1, x2]
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 10)
    }
}