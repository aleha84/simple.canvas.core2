class MosaicScene extends Scene {
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
                fileNamePrefix: 'mosaic',
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
                hlp.setFillColor('black').dot(0,0);
            })
        }), 0)

        let generatePath = function({
            mainMidPointRotationDirection, 
            sharedPP,
            xClamps, 
            targetY, 
            mainMidPointShiftClamps, 
            resultMidPointXShiftClamps, 
            resultMidPointYShiftClamps, 
            innerDotsCountClamp, 
            target, 
            start,
            // startProvider,
            // targetProvider
        }) {

            if(mainMidPointRotationDirection == undefined)
                throw 'mainMidPointRotationDirection is undefined';

            if(!start && !xClamps )
                throw 'Start point cant be defined';

            if(!target && targetY == undefined )
                throw 'Target point cant be defined';

            if(!mainMidPointShiftClamps)
                throw 'mainMidPointShiftClamps is undefined';

            if(!resultMidPointXShiftClamps)
                throw 'resultMidPointXShiftClamps is undefined';

            if(!resultMidPointYShiftClamps)
                throw 'resultMidPointYShiftClamps is undefined';

            if(!innerDotsCountClamp)
                throw 'innerDotsCountClamp is undefined';


        let innerDotsCount = getRandomInt(innerDotsCountClamp[0], innerDotsCountClamp[1]);

        if(!start) {
            start = new V2(getRandomInt(xClamps[0], xClamps[1]), 0)
        }

        if(!target){
            target = new V2(start.x + getRandomInt(-20, 20), targetY);
        }

        let stDirection = start.direction(target);
        let stMid = start.add(stDirection.mul(start.distance(target)*getRandom(0.3, 0.6))).toInt();
        let mainMidPoint = 
            stMid.add(
                stDirection.rotate(90*(mainMidPointRotationDirection)).mul(getRandomInt(mainMidPointShiftClamps[0], mainMidPointShiftClamps[1]))
            ).toInt()
    
        //debugger;
        let mainPoints = distinct([
            ...sharedPP.lineV2(start, mainMidPoint),
            ...sharedPP.lineV2(mainMidPoint, target)
        ], (p) => p.x + '_' + p.y);

        let resultPoints = [];
        let midPointsIndexStep = fast.r(mainPoints.length/(innerDotsCount + 1));
        let midPointsIntexStepVariations = fast.r(midPointsIndexStep/3);
        let resultMidPoints = []
        let resultMidPointsIndices = []
        let prevPoint = undefined;
        for(let i = 0; i < innerDotsCount +1; i++){
            let mPoint1 = undefined;
            let mPoint2 = undefined;
            if(i == 0){
                mPoint1 = start;
                mPoint2 = new V2(mainPoints[midPointsIndexStep + getRandomInt(-midPointsIntexStepVariations, 0)]).add(
                    new V2(
                        getRandomInt(resultMidPointXShiftClamps[0], resultMidPointXShiftClamps[1]), 
                        getRandomInt(resultMidPointYShiftClamps[0], resultMidPointYShiftClamps[1])
                    )
                );

                prevPoint = mPoint2;
                resultMidPoints.push(mPoint2);
            }
            else if(i == innerDotsCount){
                mPoint1 = prevPoint
                mPoint2 = target;
            }
            else {
                mPoint1 = prevPoint
                mPoint2 = new V2(mainPoints[midPointsIndexStep*(i+1) + getRandomInt(-midPointsIntexStepVariations, 0)]).add(
                    new V2(
                        getRandomInt(resultMidPointXShiftClamps[0], resultMidPointXShiftClamps[1]), 
                        getRandomInt(resultMidPointYShiftClamps[0], resultMidPointYShiftClamps[1])
                    )
                );

                prevPoint = mPoint2;
                resultMidPoints.push(mPoint2);
            }

            resultPoints.push(...sharedPP.lineV2(mPoint1, mPoint2));
            resultPoints = distinct(resultPoints, (p) => p.x + '_' + p.y);

            if(i < innerDotsCount) {
                resultMidPointsIndices.push(resultPoints.length-1)
            }
        }

        return {
            start,
            target,
            resultPoints,
            resultMidPoints,
            resultMidPointsIndices
        }
    }

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createMosaicFrames({framesCount, itemsData, size}) {
                let frames = [];
                
                let gapWidth = 1;
                let gapHeight = 1;
                let itemSize = new V2(2,2);
                let brightLayer = PP.createImage(MosaicScene.models.lampBulb, { renderOnly: ['bright'], forceVisibility: { 'bright': { visible: true } } });
                let darkLayer = PP.createImage(MosaicScene.models.lampBulb, { renderOnly: ['dark'], forceVisibility: { 'dark': { visible: true } } });
                let dark1Layer = PP.createImage(MosaicScene.models.lampBulb, { renderOnly: ['dark1'], forceVisibility: { 'dark1': { visible: true } } });

                let darkOverlays = [
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0)').rect(0,0,size.x,size.y)  }),
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0.1)').rect(0,0,size.x,size.y)  }),
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0.2)').rect(0,0,size.x,size.y)  }),
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0.3)').rect(0,0,size.x,size.y)  }),
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0.4)').rect(0,0,size.x,size.y)  }),
                    createCanvas(size, (ctx, _size, hlp) => { hlp.setFillColor('rgba(0,0,0,0.5)').rect(0,0,size.x,size.y)  })
                ]

                let darkFrames = new Array(framesCount).fill();
                let brightLayerFrames = new Array(framesCount).fill();

                for(let i = 0; i < 3; i++) {
                    let startIndex = getRandomInt(0, framesCount - 40);
                    let frameslength = getRandomInt(3,4);
                    for(let f = 0; f < frameslength; f++) {
                        let d = darkOverlays[getRandomInt(0, darkOverlays.length-1)]
                        darkFrames[startIndex + f*2] = d;
                        darkFrames[startIndex + (f*2) + 1] = d;
                    }

                    // for(let f = 0; f < getRandomInt(5,15); f++) {
                    //     let fi = startIndex + frameslength + f; 
                    //     if(fi >= (framesCount-1)) {
                    //         fi = fi - framesCount;
                    //     }

                    //     brightLayerFrames[fi] = brightLayer;
                    // }
                }

                let underLayer = createCanvas(size, (ctx, _size, hlp) => {
                    hlp.setFillColor('#333333').rect(0,0,size.x,size.y);
                    // for(let i = 0; i < 10000; i++) {
                        
                    //     hlp.setFillColor(`rgba(${getRandomBool() ? '0,0,0' : '255,255,255'}, ${fast.r(getRandom(0.025, 0.05), 3)})`)
                    //         .rect(getRandomInt(0,size.x,), getRandomInt(0,size.y), getRandomInt(1,3), getRandomInt(1,3))
                    // }
                })

                let lampBulb = PP.createImage(MosaicScene.models.lampBulb, { exclude: ['p', 'bright', 'dark'] });
                let lampBulb_pFrames = animationHelpers.createMovementFrames({ framesCount, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(MosaicScene.models.lampBulb.main.layers.find(l => l.name == 'p')) });

                

                let lightSize = new V2(this.size.x*2, this.size.y);
                let gradientOrigin = new V2(lightSize.x/2, lightSize.y/2).toInt();
                let gradientDots = colors.createRadialGradient({ size: lightSize, center: new V2(lightSize.x/2, lightSize.y/2).toInt(), radius: new V2(200,200), gradientOrigin, angle: 0,
                    easingType:'expo', easingMethod: 'out',
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }

                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;

                        dot.values.push(aValue);
                    } })

                let lightImg = createCanvas(lightSize, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    hlp.setFillColor(`rgba(255,0,0,${gradientDots[y][x].maxValue*1})`).dot(x,y)
                                }
                            }
                        }
                    }
                })

                itemsData = itemsData.map((data, i) => {
                    // let startFrameIndex = 0//getRandomInt(0, framesCount-1);
                    // let totalFrames = framesCount//itemFrameslength;
                
                    let topLeft = new V2(gapWidth*(data.point.x+1) + data.point.x*itemSize.x, gapHeight*(data.point.y+1) + data.point.y*itemSize.y);
                    let color = data.color;

                    let alter  = undefined;
                    if(data.alterColor) {
                        alter = {
                            p: new V2(getRandomInt(0,itemSize.x-1), getRandomInt(0,itemSize.y-1)),
                            c: data.alterColor
                        }
                    }
                    // let frames = [];
                    // for(let f = 0; f < totalFrames; f++){
                    //     let frameIndex = f + startFrameIndex;
                    //     if(frameIndex > (framesCount-1)){
                    //         frameIndex-=framesCount;
                    //     }
                
                    //     frames[frameIndex] = {
                    //         darkOpacity: 0
                    //     };
                    // }
                
                    return {
                        color,
                        topLeft,
                        alter: alter
                        //frames
                    }
                })
                

                let midImage = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        hlp.setFillColor(itemData.color).rect(itemData.topLeft.x, itemData.topLeft.y, itemSize.x, itemSize.y)
                        if(itemData.alter) {
                            hlp.setFillColor(itemData.alter.c)
                            if(itemData.alter.p.x == 0 && itemData.alter.p.y == 0) {
                                hlp.rect(itemData.topLeft.x + itemData.alter.p.x, itemData.topLeft.y + itemData.alter.p.y, itemSize.x, 1)
                            }
                            else if(itemData.alter.p.x == itemSize.x-1 && itemData.alter.p.y == 0) {
                                hlp.rect(itemData.topLeft.x + itemData.alter.p.x, itemData.topLeft.y + itemData.alter.p.y, 1, itemSize.y)
                            }
                            else if(itemData.alter.p.x == itemSize.x-1 && itemData.alter.p.y == itemSize.y-1) {
                                hlp.rect(itemData.topLeft.x + itemData.alter.p.x - (itemSize.x - 1), itemData.topLeft.y + itemData.alter.p.y, itemSize.x, 1)
                            }
                            else if(itemData.alter.p.x == 0 && itemData.alter.p.y == itemSize.y-1) {
                                hlp.rect(itemData.topLeft.x + itemData.alter.p.x, itemData.topLeft.y + itemData.alter.p.y - (itemSize.y - 1), 1, itemSize.y)
                            }
                        }
                    }
                })

                let xValuesLower1 = [];
                let xValuesUpper1 = [];
                createCanvas(V2.one, (ctx, size, hlp) => {
                    hlp.strokeEllipsis(0, 360, 0.5, new V2(0,0), 15, undefined, xValuesLower1, true)
                    hlp.strokeEllipsis(0, 360, 0.5, new V2(0,0), 10, undefined, xValuesUpper1, true)
                })

                xValuesLower1 = xValuesLower1.map(p => p.x);
                xValuesUpper1 = xValuesUpper1.map(p => p.x);
                // let xValuesChange = easing.fast({from: 0, to: xValuesLower1.length-1, steps: framesCount, type: 'linear', round: 0}).map((index) => xValuesLower1[index])
                // let upperXValuesChange = easing.fast({from: 0, to: xValuesUpper1.length-1, steps: framesCount, type: 'linear', round: 0}).map((index) => xValuesUpper1[index])
                //console.log(upperXValuesChange1);

                let upperXChangeClamps = [-10, 10];
                let upperXValuesChange = [
                    ...easing.fast({from: upperXChangeClamps[0], to: upperXChangeClamps[1], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0}),
                    ...easing.fast({from: upperXChangeClamps[1], to: upperXChangeClamps[0], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0})
                ]

                let xChangeClamps = [-15, 15];
                let xValuesChange = [
                    ...easing.fast({from: xChangeClamps[0], to: xChangeClamps[1], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0}),
                    ...easing.fast({from: xChangeClamps[1], to: xChangeClamps[0], steps: framesCount/2, type: 'sin', method: 'inOut', round: 0})
                ]

                let yValuesChange = [
                    // ...easing.fast({from: -1, to: 1, steps: framesCount/2, type: 'sin', method: 'inOut', round: 2}),
                    // ...easing.fast({from: 1, to: -1, steps: framesCount/2, type: 'sin', method: 'inOut', round: 2})
                    ...easing.fast({from: 0, to: 1, steps: framesCount/4, type: 'sin', method: 'in', round: 0}),
                    ...easing.fast({from: 1, to: 0, steps: framesCount/4, type: 'sin', method: 'out', round: 0}),
                    ...easing.fast({from: 0, to: 1, steps: framesCount/4, type: 'sin', method: 'in', round: 0}),
                    ...easing.fast({from: 1, to: 0, steps: framesCount/4, type: 'sin', method: 'out', round: 0})
                ]

                //console.log(yValuesChange)

                let xShift = 15;

                let lightImgXShift = -( lightSize.x - size.x )/2
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {

                        ctx.drawImage(underLayer, 0,0);

                        ctx.drawImage(midImage, 0 , 0)
                        // for(let p = 0; p < itemsData.length; p++){
                        //     let itemData = itemsData[p];
                            
                        //     if(itemData.frames[f]){
                                
                        //         hlp.setFillColor(itemData.color).rect(itemData.topLeft.x, itemData.topLeft.y, itemSize.x, itemSize.y)
                        //     }
                            
                        // }

                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(lightImg, lightImgXShift +  xValuesChange[f]*2 + xShift,0);

                        ctx.globalCompositeOperation = 'source-over'

                        let pp = new PP({ctx});
                        pp.setFillStyle('black');
                        //pp.lineV2(, )
                        pp.fillByCornerPoints([
                            new V2(upperXValuesChange[f]+ (size.x/2) + xShift+7, 0 ),
                            new V2(xValuesChange[f]+ (size.x/2)+ xShift+6, (size.y/2) -7),
                            new V2(xValuesChange[f]+ (size.x/2)+ xShift+7, (size.y/2) -7),
                            new V2(upperXValuesChange[f]+ (size.x/2) + xShift+8, 0 )
                        ])

                        let lampBulbX = (size.x/2) + xValuesChange[f] - 80 + xShift;
                        let lampBulbY = (size.y/2) - 25;
                        ctx.drawImage(lampBulb, lampBulbX,lampBulbY )
                        ctx.drawImage(lampBulb_pFrames[f], lampBulbX,lampBulbY)

                        if(brightLayerFrames[f]) {
                            ctx.drawImage(brightLayerFrames[f], lampBulbX,lampBulbY)
                        }

                        if(darkFrames[f] != undefined) {
                            ctx.drawImage(dark1Layer, lampBulbX,lampBulbY)
                            ctx.drawImage(darkFrames[f], 0, 0)
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let sampleImg = PP.createImage(MosaicScene.models.spaceman);
                let cCache = {};
                let _pd = getPixels(sampleImg, new V2(70,70));
                let vClamps = [-20,20];
                let whiteVClamps = [-50,0];
                //console.log(_pd);
                let pixels = _pd.map(pd => {
                    let key = pd.color[0]*1000000+pd.color[1]*1000+pd.color[2];
                    let hsv = cCache[key];
                    if(hsv == undefined) {
                        hsv = colors.colorTypeConverter({ value: pd.color, fromType: 'rgb', toType: 'hsv' });
                        cCache[key] = hsv
                    };

                    let isWhite = pd.color[0] == 255 && pd.color[1] == 255 && pd.color[2] == 255

                    let v = hsv.v + getRandomInt(isWhite ? whiteVClamps : vClamps);
                    if(v > 100)
                        v = 100;

                    if(v < 0)
                        v = 0;


                    let alterV = v + getRandomInt(-10, 10);
                    if(alterV > 100)
                    alterV = 100;

                    if(alterV < 0)
                    alterV = 0;
                    
                    return {
                        point: pd.position,
                        color: colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v  }, fromType: 'hsv', toType: 'hex' }),
                        alterColor: getRandomInt(0,2) == 0 ? colors.colorTypeConverter({ value: { h: hsv.h, s: hsv.s, v: alterV  }, fromType: 'hsv', toType: 'hex' }): undefined
                    }
                });
                this.frames = this.createMosaicFrames({ framesCount: 300, 
                    itemsData: pixels
                    , size: this.size });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 10)
    }
}