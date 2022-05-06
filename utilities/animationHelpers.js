var animationHelpers = {
    extractPointData(layer) {
        let data = [];
        layer.groups.forEach(group => {
            let color = group.strokeColor;
            let opacity = group.strokeColorOpacity;
            group.points.forEach(point => {
                data.push({
                    color, 
                    opacity,
                    point: point.point
                });
            })
        })

        return data;
    },
    createMovementRotFrames({framesCount, pointsData, itemFrameslength, size, pos, 
        pdPredicate = () => true,
        startFrameIndexPredicate = undefined
    }) {
        let frames = [];
        if(!pos)
            pos = [new V2(-1, 0), new V2(-1, -1,), new V2(0, -1), new V2(0,0)]

        let pChange = easing.fast({ from: 0, to: pos.length-1, steps: itemFrameslength, type: 'linear', round: 0 });
        if(!startFrameIndexPredicate)
            startFrameIndexPredicate = () => getRandomInt(0, framesCount-1);

        let itemsData = pointsData.filter(pdPredicate).map((el, i) => {
            let startFrameIndex = startFrameIndexPredicate(el.point);
            let totalFrames = itemFrameslength;
            
            let _p = getRandomInt(0, pos.length-1);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                let pIndex = _p + pChange[f];
                if(pIndex > (pos.length-1))
                    pIndex-= pos.length;

                frames[frameIndex] = {
                    pIndex,
                };
            }
        
            return {
                pd: el,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let pc = pos[itemData.frames[f].pIndex];
                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x + pc.x, itemData.pd.point.y + pc.y)
                    }
                    
                }
            });
        }
        
        return frames;
    },
    createMovementFrames({framesCount, itemFrameslength, pointsData, size, pdPredicate = () => true}) {
        let frames = [];
        
        let itemsData = pointsData.filter(pdPredicate).map((pd, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
        
            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = true;
            }
        
            return {
                frames,
                pd
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                    }
                    
                }
            });
        }
        
        return frames;
    },

    createCloudsFrames({framesCount, itemsCount, itemFrameslength, color, sec, size,circleImages,
        directionAngleClamps, distanceClamps, sizeClamps, initialProps, yShiftClamps, xShiftClamps, invertMovement = false,
        createPoligon 
    }) {
        let frames = [];
        let sharedPP = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx})
        })

        let initialDots = [];
        if(initialProps.line) {
            initialDots = sharedPP.lineV2(initialProps.p1, initialProps.p2).map(p => new V2(p))
        }
        else {
            throw 'Unknown initial props type';
        }

        if(!yShiftClamps)
            yShiftClamps = [0,0]

        if(!xShiftClamps)
            xShiftClamps = [0,0]

        if(createPoligon) {
            if(createPoligon.position == undefined)
                createPoligon.position = 'before';

            createPoligon.img = createCanvas(size, (ctx, _size, hlp) => {
                let pp = new PP({ctx});
                pp.setFillStyle(createPoligon.color || color)

                pp.fillByCornerPoints(createPoligon.cornerPoints)
            })
        }

        let halfFrames = fast.r(framesCount/2)

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let s = getRandomInt(sizeClamps[0], sizeClamps[1]);
            let dist = getRandomInt(distanceClamps[0], distanceClamps[1]);
            let dir = V2.up.rotate(getRandomInt(directionAngleClamps[0], directionAngleClamps[1]));
            let p1 = initialDots[getRandomInt(0, initialDots.length-1)];
            let p2 = p1.add(dir.mul(dist));
            let points = !invertMovement 
                ? sharedPP.lineV2(p1, p2).map(p => new V2(p))
                : sharedPP.lineV2(p2, p1).map(p => new V2(p));
            
            let pointsIndexChange = [
                ...easing.fast({from: 0, to: points.length-1, steps: halfFrames, type: 'linear', round: 0}),
                ...easing.fast({from: points.length-1, to: 0, steps: halfFrames, type: 'linear', round: 0})
            ];
            let yShift = getRandomInt(yShiftClamps[0], yShiftClamps[1]);
            let yShiftValues = [
                ...easing.fast({from: 0, to: yShift, steps: fast.r(halfFrames/2), type: 'quad', method: 'out', round: 0}),
                ...easing.fast({from: yShift, to: 0, steps: fast.r(halfFrames/2), type: 'quad', method: 'in', round: 0})
            ]

            yShiftValues = [...yShiftValues, ...yShiftValues.map(x => -x)];

            let xShift = getRandomInt(xShiftClamps[0], xShiftClamps[1]);
            let xShiftValues = [
                ...easing.fast({from: 0, to: xShift, steps: fast.r(halfFrames/2), type: 'quad', method: 'out', round: 0}),
                ...easing.fast({from: xShift, to: 0, steps: fast.r(halfFrames/2), type: 'quad', method: 'in', round: 0})
            ]

            xShiftValues = [...xShiftValues, ...xShiftValues.map(x => -x)];

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    y: yShiftValues[f],
                    x: xShiftValues[f],
                    p: points[pointsIndexChange[f]]
                };
            }
        
            return {
                s,
                sec: sec? {s: s-getRandomInt(sec.sDecrClamps[0],sec.sDecrClamps[1]), yShift: getRandomInt(sec.yShiftClamps), xShift: getRandomInt(sec.xShiftClamps)} : undefined,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {

                if(createPoligon && createPoligon.img && createPoligon.position == 'before') {
                    ctx.drawImage(createPoligon.img, 0,0)
                }

                let secData = [];
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let _p = itemData.frames[f].p;
                        let yShift = itemData.frames[f].y;
                        let xShift = itemData.frames[f].x;
                        ctx.drawImage(circleImages[color][itemData.s], _p.x + xShift, _p.y + yShift)

                        if(itemData.sec) {
                            secData[secData.length] = {
                                s: itemData.sec.s,
                                x: _p.x + xShift + itemData.sec.xShift,
                                y: _p.y + yShift + itemData.sec.yShift
                            }
                            //ctx.drawImage(circleImages[secColor][itemData.sec.s], _p.x, _p.y + yShift + itemData.sec.yShift)
                        }
                    }
                    
                }

                for(let i = 0; i < secData.length; i++){
                    ctx.drawImage(circleImages[sec.color][secData[i].s],secData[i].x, secData[i].y)
                }

                if(createPoligon && createPoligon.img && createPoligon.position == 'after') {
                    ctx.drawImage(createPoligon.img, 0,0)
                }
            });
        }
        
        return frames;
    },


    createLightningFrames({
        framesCount, 
        itemsCount, 
        size, 
        colors,
        debug,
        pathParams,
        particlesParams,
        highlightParams,
        stepFramesLength,
        noDots = false,
    }) {
        let getFrameIndex = function(f, startFrameIndex, framesCount) {
            let frameIndex = f + startFrameIndex;
            if(frameIndex > (framesCount-1)){
                frameIndex-=framesCount;
            }
    
            return frameIndex;
        }
        
        /** 
        * @param mainMidPointRotationDirection - направление отклонения центральной точки
        * @param sharedPP
        * @param xClamps - если стартовая точка не указана, то используется при генерации Х части (вертикальная ориентация)
        * @param targetY - если конечная точка не указана, то используется при генерации Х части (вертикальная ориентация)
        * @param mainMidPointShiftClamps - диапазон отклонений центральной точки от оси
        * @param resultMidPointXShiftClamps - диапазоны отклонений по X промежуточных точек
        * @param resultMidPointYShiftClamps - диапазоны отклонений по Y промежуточных точек
        * @param innerDotsCountClamp - диапазон промежуточных точек
        * @param target - начальная точка
        * @param start - конечная точка
        */
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



        let flipYOrigign = fast.r(size.y/2 + 8);

        let frames = [];
        
        let xClamps = [50, 150];
        let targetY = 100;
        

        let mainMidPointShiftClamps = [10, 30];
        let resultMidPointXShiftClamps = [-10, 10];
        let resultMidPointYShiftClamps = [-5, 5];
        let innerDotsCountClamp = [6,8]

        let animationStepFramesLength = stepFramesLength || 3;

        let sharedPP; 
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx})
        })


        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let target = undefined;
            let start = undefined;

            let startFrameIndex = getRandomInt(0, framesCount-1);

            // let timeSlot = awailableTimeSlots.pop();
            // if(awailableTimeSlots.length == 0){
            //     awailableTimeSlots = new Array(awailableTimeSlotsLength).fill().map((el, i) => i);
            // }
            
            //startFrameIndex = getRandomInt(framesCount*(timeSlot/awailableTimeSlotsLength), (timeSlot == awailableTimeSlotsLength-1 ? framesCount-1 : framesCount*(timeSlot+1)/awailableTimeSlotsLength));

            //console.log(startFrameIndex)

            let hTarget = false;
            let hStart = false;

            if(highlightParams) {
                hTarget = highlightParams.showTarget
                hStart = highlightParams.showStart
            }

            let showParticles = true;
            
            if(particlesParams) {
                showParticles = particlesParams.enabled;
            }
            else {
                particlesParams = {
                    countClamps: [3,5],
                    totalFramesClamps: [30,60],
                    startXDelta: [-2,2],
                    startYDelta: [-1,1],
                    xSpeed: [0.1, 0.3],
                    xSpeedReducer: 0.005,
                    yAcceleration: 0.025,
                    ySpeed: [0.3, 0.6]
                }
            }
            
            target = new V2(size.x/2, size.y -10).toInt();
            start = new V2(size.x/2, 10).toInt()
                //new V2(target.x + getRandomInt(-10, 10), -10);

            let mainMidPointRotationDirection =  getRandomBool() ? 1 : -1;

            if(pathParams) {
                pathParams.sharedPP = sharedPP;
                if(pathParams.mainMidPointRotationDirection == undefined)
                    pathParams.mainMidPointRotationDirection = mainMidPointRotationDirection;

                if(pathParams.startProvider && isFunction(pathParams.startProvider)) {
                    pathParams.start = pathParams.startProvider({ index: i});
                }

                if(pathParams.targetProvider && isFunction(pathParams.targetProvider)) {
                    pathParams.target = pathParams.targetProvider(pathParams.start, { index: i });
                }
            }
            else {
                pathParams = {
                    mainMidPointRotationDirection,
                    start, 
                    target,
                    sharedPP,
                    xClamps,
                    targetY,
                    mainMidPointShiftClamps,
                    resultMidPointXShiftClamps,
                    resultMidPointYShiftClamps, 
                    innerDotsCountClamp
                }
            }


            let path1 = generatePath(pathParams);
            let path2 = generatePath(pathParams);

            start = path1.start;
            target = path1.target;

            if(debug) {
                console.log("path1",path1)
                console.log("path2",path2)
            }

            let frames = [];

            //step 0
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex+ animationStepFramesLength*0, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 1
            let step1Path1MaxIndex = fast.r(path1.resultPoints.length*getRandom(0.4, 0.6));
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 1,
                    params: {
                        path1MaxIndex: step1Path1MaxIndex,
                        path1Color: colors.main
                    },
                    hStart: hStart ? {} : undefined
                };
            }

            //step 2
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex+ animationStepFramesLength*2, framesCount);
        
                frames[frameIndex] = undefined;
            }

             //step 3
             for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*3, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 3,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: colors.main
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            //step 4
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex+ animationStepFramesLength*4, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 5
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*5, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 5,
                    params: {
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: colors.main
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            //step 6
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex+ animationStepFramesLength*6, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 7
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*7, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 7,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: colors.main
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            let particlesFallStartFramesIndex = undefined;
            //step 8
            let cornersData = path1.resultMidPointsIndices.map(index => {
                let p = new V2(path1.resultPoints[index]);
                let prev = new V2(path1.resultPoints[index-1]);
                let dir = prev.direction(p);

                let c1 = p;
                let c2 = p.add(dir.mul(getRandom(1,3))).toInt();
                let c3 = new V2(path1.resultPoints[index + getRandomInt(2,5)]);

                if(c3.x ==0 && c3.y == 0){
                    c3 = new V2(path1.resultPoints[index - getRandomInt(1,3)])
                }

                return [c1, c2, c3];
            })

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*8, framesCount);
                particlesFallStartFramesIndex = frameIndex + animationStepFramesLength;

                frames[frameIndex] = {
                    stepIndex: 8,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: colors.brighter,
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: colors.darker,
                        cornersData, 
                        cornersColor: colors.main
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            //step 9
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*9, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 9,
                    params: {
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: colors.darker
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            //step 10
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*10, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 10,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: colors.main,
                        cornersData, 
                        cornersColor: colors.main
                    },
                    hStart: hStart ? {} : undefined,
                    hTarget: hTarget ? {} : undefined
                };
            }

            //step 11
            let step11Dots = []
            cornersData.forEach(cd => {
                step11Dots.push(...sharedPP.fillByCornerPoints(cd))
            })

            let innerDotsPartsCount = getRandomInt(3,5);
            for(let i = 0; i < innerDotsPartsCount; i++){
                let index = getRandomInt(10, path1.resultPoints.length-10);
                let dotsCount = getRandomInt(3, 5);
                let direction = getRandomBool() ? 1: -1;
                for(let j = 0; j < dotsCount; j++){
                    step11Dots.push(path1.resultPoints[index + direction*j])
                }
            }

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*11, framesCount);

                frames[frameIndex] = {
                    stepIndex: 11,
                    params: {
                        dots: step11Dots,
                        dotsColor: colors.main
                    }
                }
            }

            //step 12
            let step12Dots = [...step11Dots];
            let removeCount = fast.r(step12Dots.length/2);
            while(removeCount--){
                let index = getRandomInt(0, step12Dots.length-1);
                step12Dots.splice(index, 1);
            }

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength*12, framesCount);

                frames[frameIndex] = {
                    stepIndex: 12,
                    params: {
                        dots: step12Dots,
                        dotsColor: colors.main
                    }
                }
            }

            let particlesItemsData = new Array(getRandomInt(particlesParams.countClamps)).fill().map((el, i) => {
                let startFrameIndex = particlesFallStartFramesIndex; //getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(particlesParams.totalFramesClamps);
            
                //let p = target.add(, ));
                let x = target.x  + getRandomInt(particlesParams.startXDelta);
                let y= target.y + getRandomInt(particlesParams.startYDelta);
                let xAcceleration = 0.025;
                let xSpeed = getRandom(particlesParams.xSpeed);
                let yAcceleration = particlesParams.yAcceleration;
                let ySpeed = getRandom(particlesParams.ySpeed);
                if(x < target.x){
                    xSpeed = -xSpeed;
                }
                // else {
                //     xSpeed = getRandom(0.1, 0.2);
                // }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    y += ySpeed;
                    x += xSpeed;

                    let color = colors.main;
                    if(f < totalFrames/3){
                        color = colors.brighter
                    }
                    if(f > totalFrames*2/3){
                        color = colors.darker
                    }

                    frames[frameIndex] = {
                        color,
                        p: new V2(x, y).toInt()
                    };

                    ySpeed+=yAcceleration;

                    if(xSpeed < 0){
                        xSpeed+=particlesParams.xSpeedReducer
                        if(xSpeed > 0)
                            xSpeed = 0;
                    }

                    if(xSpeed > 0){
                        xSpeed-=particlesParams.xSpeedReducer
                        if(xSpeed < 0)
                            xSpeed = 0;
                    }
                }
            
                return {
                    frames
                }
            })
        
            return {
                path1,
                path2,
                frames,
                start,
                target,
                particlesItemsData,
                showParticles
            }
        })

        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        switch(itemData.frames[f].stepIndex){
                            case 1:
                            case 3:
                            case 7:
                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }
                                break;
                            case 5:
                            case 9:
                                for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                }
                                break;
                            case 8:
                            case 10:
                                if(itemData.frames[f].params.path2MaxIndex) {
                                    for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                        hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                    }
                                }

                                let pp = new PP({ctx});

                                if(!noDots) {
                                    itemData.frames[f].params.cornersData.forEach(cd => {
                                        pp.setFillStyle(itemData.frames[f].params.cornersColor);
                                        pp.fillByCornerPoints(cd)
                                    })
                                }
                                
                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }
                                break;
                            case 11:
                            case 12:
                                if(!noDots) {
                                    for(let i = 0; i < itemData.frames[f].params.dots.length; i++){
                                        hlp.setFillColor(itemData.frames[f].params.dotsColor).dot(itemData.frames[f].params.dots[i])
                                    }
                                }
                                break;
                            default:
                                break;
                        }

                        if(itemData.frames[f].hStart) {
                            hlp.setFillColor(highlightParams.color);
                            
                            highlightParams.startPointsProvider(itemData.start).forEach(p => {
                                hlp.dot(p)
                            });
                            // let width = getRandomInt(10, 20);
                            // hlp.setFillColor(colors.darker).rect(itemData.target.x - fast.r(width/2), itemData.target.y + 1, width, 1)
                        }

                        if(itemData.frames[f].hTarget) {

                            hlp.setFillColor(highlightParams.color);
                            
                            highlightParams.targetPointsProvider(itemData.target).forEach(p => {
                                hlp.dot(p)
                            });
                        }
                        //itemData.path1.resultPoints.forEach(mp => hlp.dot(mp))
                    }

                    if(itemData.showParticles) {
                        for(let p = 0; p < itemData.particlesItemsData.length; p++){
                            let pItemData = itemData.particlesItemsData[p];
                    
                            if(pItemData.frames[f]){
                                if(
                                    particlesParams.xClamps && !isBetween(pItemData.frames[f].p.x, particlesParams.xClamps) ||
                                    particlesParams.yClamps && !isBetween(pItemData.frames[f].p.y, particlesParams.yClamps)
                                )
                                    continue;


                                hlp.setFillColor(pItemData.frames[f].color).dot(pItemData.frames[f].p)
                            }
                        }
                    }
                    
                    
                }
            });
        }
        
        return frames;
    }
}