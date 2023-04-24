class EveningFogScene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'eveningFog',
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
        const model = EveningFogScene.models.main;
        const totalGlobalFramesCount = 200;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })

                this.d = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['bg_d'] })
                    }
                }))
            }
        }), 1)

        this.buildings = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['buildings'] })
            }
        }), 5)

        let a1 = new Array(50).fill().map((el, i) => 1 + i*4)
        let a2 = new Array(50).fill().map((el, i) => 3 + i*4)

        let b1 = new Array(50).fill().map((el, i) => i*4)
        let b2 = new Array(50).fill().map((el, i) => 2+ i*4)

        this.fog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDithering({data, hlp, xClamps, rValues}) {

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

                        let r0 = rValues[0] //14;
                        let r1 = rValues[1] //10;
                        let r2 = rValues[2] //6;
                        let r3 = rValues[3] //2;
    
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
            createImage({ curvePointsData, size,colorsData, colorSteps, gaps, heightPerStep, xClamps, yClamps, rValues,doNotRenderFirstStepBg = false }) {
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
                            if(doNotRenderFirstStepBg) {
                                continue;
                            }

                            let startY = yClamps[0] + gaps.verticalGaps
                            pp.fillByCornerPoints([new V2(xClamps[0], startY), new V2(xClamps[1], startY), new V2(xClamps[1], startY + heightPerStep*2), new V2(xClamps[0], startY + heightPerStep*2) ])

                            continue;
                        }
                        
                        let dividerYValue = yClamps[0] + gaps.verticalGaps + heightPerStep*i
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

                    this.createDithering({data, hlp, xClamps, rValues}) 
                    //return;

                })
            },
            init() {
                let yClamps = [110, 170]
                let radiusValues = [8,6,4,2]
                let steps = 5;
                let verticalGaps = 0;
                let horizontalGaps = 0;
                let totalFrames = totalGlobalFramesCount;
                let dividerLineYClamps = [1,2]
                this.frames = [];
                let availableHeight = yClamps[1]-yClamps[0];
                let startColor = '#4e3e42';
                let finishColor = '#888079'

                let startColorRgb = colors.colorTypeConverter({ value: startColor, toType: 'rgb', fromType: 'hex' })
                let finishColorRgb = colors.colorTypeConverter({ value: finishColor, toType: 'rgb', fromType: 'hex' })

                let rValues = easing.fast({from: startColorRgb.r, to: finishColorRgb.r, steps, type: 'linear', method: 'base', round: 0});
                let gValues = easing.fast({from: startColorRgb.g, to: finishColorRgb.g, steps, type: 'linear', method: 'base', round: 0});
                let bValues = easing.fast({from: startColorRgb.b, to: finishColorRgb.b, steps, type: 'linear', method: 'base', round: 0});

                let heightPerStep = fast.r(availableHeight/steps);
                let x1 = 0;
                let x2 = this.size.x;

                let curvePointsData = [];

                for(let i = 0; i < steps; i++) {
                    if(i == 0) {
                        continue;
                    }

                    let dividerYValue = yClamps[0] + verticalGaps + heightPerStep*i
                    let points = [
                        new V2(x1, dividerYValue), 
                        new V2(fast.r(x1 + (this.size.x-horizontalGaps*2)/3) + getRandomInt(-3,3) , dividerYValue),
                        new V2(fast.r(x1 + (this.size.x-horizontalGaps*2)*2/3)+ getRandomInt(-3,3) , dividerYValue),
                        new V2(x2, dividerYValue), 
                    ];

                    if(i == 0) {
                        points[0].y + 2;
                        points[2].y + 3;
                    }

                    curvePointsData[i] = {
                        points,
                        yValues: [

                        ]
                    }

                    for(let j = 0; j < 4; j++) {
                        let deltaFrom = getRandomInt(dividerLineYClamps)*(getRandomBool() ? 1 : -1);
                        if(j == 3) {
                            getRandomInt(dividerLineYClamps.map(x => x*2))*(getRandomBool() ? 1 : -1);
                        }
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
                        xClamps: [x1, x2],
                        yClamps,
                        rValues: radiusValues,
                        doNotRenderFirstStepBg: true
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 10)

        this.poles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                let wireColors = [
                    '#b1603e', '#834a36', '#56342e', '#3f292a', '#392e34'//'#281d25'
                ]

                let c1YClamps = [71, 115]; 
                let c1Values = easing.fast({from: 1, to: 4, steps: c1YClamps[1] - c1YClamps[0], type: 'linear', round: 0 })
                let c1 = (x,y) => {
                    return wireColors[c1Values[y-c1YClamps[0]]];
                }

                let c2YClamps = [26, 76]; 
                let c2Values = easing.fast({from: 0, to: 1, steps: c2YClamps[1] - c2YClamps[0], type: 'linear', round: 0 })
                let c2 = (x,y) => {
                    return wireColors[c2Values[y-c2YClamps[0]]];
                }

                let wiresData = [
                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(0, 138)] }, 
                            { dots: [new V2(4,137), new V2(4.1,137)] }, 
                            { dots: [new V2(12,133)] }, 
                        ],xClamps: [0,12], yClamps:[], size: this.size, invert: false, c1: '#4e3e42', usePP: false},
                    // { framesCount: totalGlobalFramesCount, 
                    //     dotsData: [
                    //         { dots: [new V2(0, 139)] }, 
                    //         { dots: [new V2(6,137), new V2(6.1,137)] }, 
                    //         { dots: [new V2(18,132)] }, 
                    //     ],xClamps: [0,18], yClamps:[], size: this.size, invert: false, c1: '#4e3e42', usePP: false},

                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(18, 131)] }, 
                            { dots: [new V2(30,125), new V2(30.1,125)] }, 
                            { dots: [new V2(42,113)] }, 
                        ],xClamps: [18,42], yClamps:[], size: this.size, invert: false, c1: '#392e34', usePP: true},
                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(11, 131)] }, 
                            { dots: [new V2(25,123), new V2(25.1,123)] }, 
                            { dots: [new V2(33,113)] }, 
                        ],xClamps: [11,33], yClamps:[], size: this.size, invert: false, c1: '#392e34', usePP: true},

                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(34, 112)] }, 
                            { dots: [new V2(48,100), new V2(48.25, 100)] }, 
                            { dots: [new V2(67,76)] }, 
                        ],xClamps: [34,67], yClamps:[], size: this.size, invert: false, c1: c1, usePP: true},
                 { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(43, 113)] }, 
                            { dots: [new V2(54,104), new V2(54,104.25)] }, 
                            { dots: [new V2(80,74)] }, 
                        ],xClamps: [43,80], yClamps:[], size: this.size, invert: false, c1: c1, usePP: true},
                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(67, 74)] }, 
                            { dots: [new V2(88,59), new V2(88, 59.25)] }, 
                            { dots: [new V2(115,27)] }, 
                        ],xClamps: [67,115], yClamps:[], size: this.size, invert: false, c1: c2, usePP: true},
                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(79, 74)] }, 
                            { dots: [new V2(97,64), new V2(97,64.25)] }, 
                            { dots: [new V2(133,26)] }, 
                        ],xClamps: [79,133], yClamps:[], size: this.size, invert: false, c1: c2, usePP: true},

                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(134, 26)] }, 
                            { dots: [new V2(148,23), new V2(148.5,23)] }, 
                            { dots: [new V2(160,19)] }, 
                        ],xClamps: [134,160], yClamps:[], size: this.size, invert: false, c1: '#b1603e', usePP: true},

                    { framesCount: totalGlobalFramesCount, 
                        dotsData: [
                            { dots: [new V2(116, 26)] }, 
                            { dots: [new V2(136,22), new V2(136.5,22)] }, 
                            { dots: [new V2(160,13)] }, 
                        ],xClamps: [116,160], yClamps:[], size: this.size, invert: false, c1: '#b1603e', usePP: true}
                ]

                this.wires = wiresData.map(d => 
                        this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: animationHelpers.createWiresFrames(d),
                        init() {
                            this.registerFramesDefaultTimer({ startFrameIndex: getRandomInt(0, totalGlobalFramesCount-1) });
                        }
                    }))
                ) 

                this.poles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(model, { renderOnly: ['poles'] })
                }))
                // this.img = PP.createImage(model, { renderOnly: ['poles'] })
            }
        }), 15)

        let createGrassFrames = function({framesCount, itemsCount, lineCornerPoints, itemFrameslength, size, excludeX, availableColors, angleClamps, angleDeltaClamps, heightValues}) {
            let frames = [];
            
            let sharedPP = PP.createNonDrawingInstance();
            let linePoints = sharedPP.lineByCornerPoints(lineCornerPoints).map(p => new V2(p));

            let prevHeight = undefined;
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let c = availableColors[getRandomInt(0, availableColors.length-1)]
                let p0 = linePoints[getRandomInt(0, linePoints.length-1)].add(new V2(0, getRandomInt(-2,2)));

                let heightClamps = heightValues[getRandomInt(0, heightValues.length-1)];
                let height = getRandomInt(heightClamps); 

                if(prevHeight != undefined && height == prevHeight) {
                    height += (getRandomBool() ? 1 : -1);
                }

                prevHeight = height;
                
                let angle0 = getRandom(angleClamps[0], angleClamps[1])
                let angle1 = angle0 + getRandom(angleDeltaClamps[0], angleDeltaClamps[1])

                let angleValues = [
                    ...easing.fast({from: angle0, to: angle1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({from: angle1, to: angle0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 2 })
                ]

                let frames = [];
                if(excludeX.indexOf(p0.x) == -1) {
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let p1 = p0.add(V2.up.rotate(angleValues[f]).mul(height));

                        let points = sharedPP.lineV2(p0, p1);
                
                        frames[frameIndex] = {
                            points,
                        };
                    }
                }
                
                return {
                    c,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            itemData.frames[f].points.forEach((p,i) => {
                                hlp.setFillColor(itemData.c).dot(p)
                            })
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['fg'] })

                


                this.grass = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let data = [
                            {itemsCount: 300, lineCornerPoints: 
                                [new V2(0, 160), new V2(35, 158), new V2(62, 161), new V2(75, 167), new V2(106,160), new V2(131, 164), new V2(159,166)],
                                //.map(p => p.add(new V2(0, 3))), 
                                excludeX: [12,13,14,15, 35,36,37,38,65,66,67,68,119,120,121,122], availableColors: ['#33272e'],
                                angleClamps: [-5,5],
                                angleDeltaClamps: [-5,5],
                                heightValues: [[2,4]]
                             },
                             {itemsCount: 200, lineCornerPoints: 
                                [new V2(0,176),new V2(17,178),new V2(42,180),new V2(77,181),new V2(102,183),new V2(119,183),],
                                 
                                excludeX: [], availableColors: ['#2e222a'],
                                angleClamps: [-5,5],
                                angleDeltaClamps: [-5,5],
                                heightValues: [[2,5]]
                             }
                        ]



                        this.items = data.map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createGrassFrames({
                                framesCount: totalGlobalFramesCount, itemsCount: d.itemsCount, lineCornerPoints: d.lineCornerPoints, 
                                excludeX: d.excludeX, availableColors: d.availableColors, angleClamps: d.angleClamps, angleDeltaClamps: d.angleDeltaClamps,
                                heightValues: d.heightValues, itemFrameslength: totalGlobalFramesCount, size: this.size
                            }),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))

                    }
                }))


            }
        }), 20)

        this.fg1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['fg1'] })
                this.grass = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let data = [
                             {itemsCount: 300, lineCornerPoints: 
                                [new V2(5, 205),new V2(41, 196),new V2(74, 195),new V2(100, 191),new V2(115, 190),new V2(131, 189),new V2(159, 185)]
                                .map(p => p.add(new V2(0, -3))), 
                                excludeX: [], availableColors: ['#281d25'],
                                angleClamps: [-10,10],
                                angleDeltaClamps: [-5,5],
                                heightValues: [[3,6]]
                             }
                        ]



                        this.items = data.map(d => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: createGrassFrames({
                                framesCount: totalGlobalFramesCount, itemsCount: d.itemsCount, lineCornerPoints: d.lineCornerPoints, 
                                excludeX: d.excludeX, availableColors: d.availableColors, angleClamps: d.angleClamps, angleDeltaClamps: d.angleDeltaClamps,
                                heightValues: d.heightValues, itemFrameslength: totalGlobalFramesCount, size: this.size
                            }),
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))

                    }
                }))


            }
        }), 25)
    }
}