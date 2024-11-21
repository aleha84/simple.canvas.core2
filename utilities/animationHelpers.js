var animationHelpers = {
    extractPointData(layer, params = { excludeClear: true }) {
        let data = [];
        layer.groups.forEach(group => {
            let color = group.strokeColor;
            let opacity = group.strokeColorOpacity;
            let clear = group.clear;

            if (params.excludeClear && clear)
                return;

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

    /**
     * Точечная анимация, вращение точки вокруг выбранной (подходит для анимации листвы, когда цвета соседних пикселей не сильно отличаются)
     */
    createMovementRotFrames({ framesCount, pointsData, itemFrameslength, size, pos,
        pdPredicate = () => true,
        startFrameIndexPredicate = undefined
    }) {
        let frames = [];
        if (!pos)
            pos = [new V2(-1, 0), new V2(-1, -1,), new V2(0, -1), new V2(0, 0)]

        let pChange = easing.fast({ from: 0, to: pos.length - 1, steps: itemFrameslength, type: 'linear', round: 0 });
        if (!startFrameIndexPredicate)
            startFrameIndexPredicate = () => getRandomInt(0, framesCount - 1);

        let itemsData = pointsData.filter(pdPredicate).map((el, i) => {
            let startFrameIndex = startFrameIndexPredicate(el.point);
            let totalFrames = itemFrameslength;

            if (isArray(itemFrameslength)) {
                totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
                pChange = easing.fast({ from: 0, to: pos.length - 1, steps: totalFrames, type: 'linear', round: 0 });
            }

            let _p = getRandomInt(0, pos.length - 1);

            let frames = [];
            for (let f = 0; f < totalFrames; f++) {
                let frameIndex = f + startFrameIndex;
                if (frameIndex > (framesCount - 1)) {
                    frameIndex -= framesCount;
                }

                let pIndex = _p + pChange[f];
                if (pIndex > (pos.length - 1))
                    pIndex -= pos.length;

                frames[frameIndex] = {
                    pIndex,
                };
            }

            return {
                pd: el,
                frames
            }
        })

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {
                        let pc = pos[itemData.frames[f].pIndex];
                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x + pc.x, itemData.pd.point.y + pc.y)
                    }

                }
            });
        }

        return frames;
    },
    /**
     * Точечная анимация. Появлениие исчезание
     */
    createMovementFrames({ framesCount, itemFrameslength, pointsData, size, pdPredicate = () => true, smooth = undefined,
        startFrameIndexPredicate = () => getRandomInt(0, framesCount - 1) }) {
        let frames = [];

        let itemsData = pointsData.filter(pdPredicate).map((pd, i) => {
            let startFrameIndex = startFrameIndexPredicate(pd, i)//getRandomInt(0, framesCount-1);
            let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;

            let aValues = undefined;
            if (smooth) {
                let minA = smooth.aClamps[0]
                let maxA = smooth.aClamps[1];

                if(pd.aClamps) {
                    minA = pd.aClamps[0]
                    maxA = pd.aClamps[1];
                }

                aValues = [
                    ...easing.fast({ from: minA, to: maxA, steps: fast.r(totalFrames / 2), type: smooth.easingType, method: smooth.easingMethod, round: smooth.easingRound }),
                    ...easing.fast({ from: maxA, to: minA, steps: fast.r(totalFrames / 2), type: smooth.easingType, method: smooth.easingMethod, round: smooth.easingRound })
                ]
            }

            let frames = [];
            for (let f = 0; f < totalFrames; f++) {
                let frameIndex = f + startFrameIndex;
                if (frameIndex > (framesCount - 1)) {
                    frameIndex -= framesCount;
                }

                frames[frameIndex] = true;
                if (aValues) {
                    frames[frameIndex] = {
                        a: aValues[f] != undefined ? aValues[f] : 0
                    }
                }
            }

            return {
                frames,
                pd
            }
        })

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {
                        if (smooth) {
                            ctx.globalAlpha = itemData.frames[f].a
                        }

                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)

                        if (smooth) {
                            ctx.globalAlpha = 1
                        }
                    }

                }
            });
        }

        return frames;
    },

    /**
     * Анимирование массивов облаков
     */
    createCloudsFrames({ framesCount, itemsCount, itemFrameslength, color, sec, size, circleImages,
        directionAngleClamps, distanceClamps, sizeClamps, initialProps, yShiftClamps, xShiftClamps, invertMovement = false,
        createPoligon
    }) {
        let frames = [];
        let sharedPP = undefined;
        createCanvas(new V2(1, 1), (ctx, size, hlp) => {
            sharedPP = new PP({ ctx })
        })

        let initialDots = [];
        if (initialProps.line) {
            if (initialProps.points) {
                initialDots = sharedPP.lineByCornerPoints(initialProps.points).map(p => new V2(p))
            }
            else {
                initialDots = sharedPP.lineV2(initialProps.p1, initialProps.p2).map(p => new V2(p))
            }
        }
        else if (initialProps.curve) {
            initialDots = sharedPP.curveByCornerPoints(initialProps.points, initialProps.numOfSegments).map(p => new V2(p))
        }
        else {
            throw 'Unknown initial props type';
        }

        if (!yShiftClamps)
            yShiftClamps = [0, 0]

        if (!xShiftClamps)
            xShiftClamps = [0, 0]

        if (createPoligon) {
            if (createPoligon.position == undefined)
                createPoligon.position = 'before';

            createPoligon.img = createCanvas(size, (ctx, _size, hlp) => {
                let pp = new PP({ ctx });
                pp.setFillStyle(createPoligon.color || color)

                pp.fillByCornerPoints(createPoligon.cornerPoints)
            })
        }

        let halfFrames = fast.r(framesCount / 2)

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount - 1);
            let totalFrames = itemFrameslength;

            let s = getRandomInt(sizeClamps[0], sizeClamps[1]);
            let dist = getRandomInt(distanceClamps[0], distanceClamps[1]);
            let dir = V2.up.rotate(getRandomInt(directionAngleClamps[0], directionAngleClamps[1]));
            let p1 = initialDots[getRandomInt(0, initialDots.length - 1)];
            let p2 = p1.add(dir.mul(dist));
            let points = !invertMovement
                ? sharedPP.lineV2(p1, p2).map(p => new V2(p))
                : sharedPP.lineV2(p2, p1).map(p => new V2(p));

            let pointsIndexChange = [
                ...easing.fast({ from: 0, to: points.length - 1, steps: halfFrames, type: 'linear', round: 0 }),
                ...easing.fast({ from: points.length - 1, to: 0, steps: halfFrames, type: 'linear', round: 0 })
            ];
            let yShift = getRandomInt(yShiftClamps[0], yShiftClamps[1]);
            let yShiftValues = [
                ...easing.fast({ from: 0, to: yShift, steps: fast.r(halfFrames / 2), type: 'quad', method: 'out', round: 0 }),
                ...easing.fast({ from: yShift, to: 0, steps: fast.r(halfFrames / 2), type: 'quad', method: 'in', round: 0 })
            ]

            yShiftValues = [...yShiftValues, ...yShiftValues.map(x => -x)];

            let xShift = getRandomInt(xShiftClamps[0], xShiftClamps[1]);
            let xShiftValues = [
                ...easing.fast({ from: 0, to: xShift, steps: fast.r(halfFrames / 2), type: 'quad', method: 'out', round: 0 }),
                ...easing.fast({ from: xShift, to: 0, steps: fast.r(halfFrames / 2), type: 'quad', method: 'in', round: 0 })
            ]

            xShiftValues = [...xShiftValues, ...xShiftValues.map(x => -x)];

            let frames = [];
            for (let f = 0; f < totalFrames; f++) {
                let frameIndex = f + startFrameIndex;
                if (frameIndex > (framesCount - 1)) {
                    frameIndex -= framesCount;
                }

                frames[frameIndex] = {
                    y: yShiftValues[f],
                    x: xShiftValues[f],
                    p: points[pointsIndexChange[f]]
                };
            }

            return {
                s,
                sec: sec ? { s: s - getRandomInt(sec.sDecrClamps[0], sec.sDecrClamps[1]), yShift: getRandomInt(sec.yShiftClamps), xShift: getRandomInt(sec.xShiftClamps) } : undefined,
                frames
            }
        })

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {

                if (createPoligon && createPoligon.img && createPoligon.position == 'before') {
                    ctx.drawImage(createPoligon.img, 0, 0)
                }

                let secData = [];
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {
                        let _p = itemData.frames[f].p;
                        let yShift = itemData.frames[f].y;
                        let xShift = itemData.frames[f].x;
                        ctx.drawImage(circleImages[color][itemData.s], _p.x + xShift, _p.y + yShift)

                        if (itemData.sec) {
                            secData[secData.length] = {
                                s: itemData.sec.s,
                                x: _p.x + xShift + itemData.sec.xShift,
                                y: _p.y + yShift + itemData.sec.yShift
                            }
                            //ctx.drawImage(circleImages[secColor][itemData.sec.s], _p.x, _p.y + yShift + itemData.sec.yShift)
                        }
                    }

                }

                for (let i = 0; i < secData.length; i++) {
                    ctx.drawImage(circleImages[sec.color][secData[i].s], secData[i].x, secData[i].y)
                }

                if (createPoligon && createPoligon.img && createPoligon.position == 'after') {
                    ctx.drawImage(createPoligon.img, 0, 0)
                }
            });
        }

        return frames;
    },

    /** 
     * Анимирование молний
    */
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
        let getFrameIndex = function (f, startFrameIndex, framesCount) {
            let frameIndex = f + startFrameIndex;
            if (frameIndex > (framesCount - 1)) {
                frameIndex -= framesCount;
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
        let generatePath = function ({
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

            if (mainMidPointRotationDirection == undefined)
                throw 'mainMidPointRotationDirection is undefined';

            if (!start && !xClamps)
                throw 'Start point cant be defined';

            if (!target && targetY == undefined)
                throw 'Target point cant be defined';

            if (!mainMidPointShiftClamps)
                throw 'mainMidPointShiftClamps is undefined';

            if (!resultMidPointXShiftClamps)
                throw 'resultMidPointXShiftClamps is undefined';

            if (!resultMidPointYShiftClamps)
                throw 'resultMidPointYShiftClamps is undefined';

            if (!innerDotsCountClamp)
                throw 'innerDotsCountClamp is undefined';


            let innerDotsCount = getRandomInt(innerDotsCountClamp[0], innerDotsCountClamp[1]);

            if (!start) {
                start = new V2(getRandomInt(xClamps[0], xClamps[1]), 0)
            }

            if (!target) {
                target = new V2(start.x + getRandomInt(-20, 20), targetY);
            }

            let stDirection = start.direction(target);
            let stMid = start.add(stDirection.mul(start.distance(target) * getRandom(0.3, 0.6))).toInt();
            let mainMidPoint =
                stMid.add(
                    stDirection.rotate(90 * (mainMidPointRotationDirection)).mul(getRandomInt(mainMidPointShiftClamps[0], mainMidPointShiftClamps[1]))
                ).toInt()

            //debugger;
            let mainPoints = distinct([
                ...sharedPP.lineV2(start, mainMidPoint),
                ...sharedPP.lineV2(mainMidPoint, target)
            ], (p) => p.x + '_' + p.y);

            let resultPoints = [];
            let midPointsIndexStep = fast.r(mainPoints.length / (innerDotsCount + 1));
            let midPointsIntexStepVariations = fast.r(midPointsIndexStep / 3);
            let resultMidPoints = []
            let resultMidPointsIndices = []
            let prevPoint = undefined;
            for (let i = 0; i < innerDotsCount + 1; i++) {
                let mPoint1 = undefined;
                let mPoint2 = undefined;
                if (i == 0) {
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
                else if (i == innerDotsCount) {
                    mPoint1 = prevPoint
                    mPoint2 = target;
                }
                else {
                    mPoint1 = prevPoint
                    mPoint2 = new V2(mainPoints[midPointsIndexStep * (i + 1) + getRandomInt(-midPointsIntexStepVariations, 0)]).add(
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

                if (i < innerDotsCount) {
                    resultMidPointsIndices.push(resultPoints.length - 1)
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



        let flipYOrigign = fast.r(size.y / 2 + 8);

        let frames = [];

        let xClamps = [50, 150];
        let targetY = 100;


        let mainMidPointShiftClamps = [10, 30];
        let resultMidPointXShiftClamps = [-10, 10];
        let resultMidPointYShiftClamps = [-5, 5];
        let innerDotsCountClamp = [6, 8]

        let animationStepFramesLength = stepFramesLength || 3;

        let sharedPP;
        createCanvas(new V2(1, 1), (ctx, size, hlp) => {
            sharedPP = new PP({ ctx })
        })


        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let target = undefined;
            let start = undefined;

            let startFrameIndex = getRandomInt(0, framesCount - 1);

            // let timeSlot = awailableTimeSlots.pop();
            // if(awailableTimeSlots.length == 0){
            //     awailableTimeSlots = new Array(awailableTimeSlotsLength).fill().map((el, i) => i);
            // }

            //startFrameIndex = getRandomInt(framesCount*(timeSlot/awailableTimeSlotsLength), (timeSlot == awailableTimeSlotsLength-1 ? framesCount-1 : framesCount*(timeSlot+1)/awailableTimeSlotsLength));

            //console.log(startFrameIndex)

            let hTarget = false;
            let hStart = false;

            if (highlightParams) {
                hTarget = highlightParams.showTarget
                hStart = highlightParams.showStart
            }

            let showParticles = true;

            if (particlesParams) {
                showParticles = particlesParams.enabled;
            }
            else {
                particlesParams = {
                    countClamps: [3, 5],
                    totalFramesClamps: [30, 60],
                    startXDelta: [-2, 2],
                    startYDelta: [-1, 1],
                    xSpeed: [0.1, 0.3],
                    xSpeedReducer: 0.005,
                    yAcceleration: 0.025,
                    ySpeed: [0.3, 0.6]
                }
            }

            target = new V2(size.x / 2, size.y - 10).toInt();
            start = new V2(size.x / 2, 10).toInt()
            //new V2(target.x + getRandomInt(-10, 10), -10);

            let mainMidPointRotationDirection = getRandomBool() ? 1 : -1;

            if (pathParams) {
                pathParams.sharedPP = sharedPP;
                if (pathParams.mainMidPointRotationDirection == undefined)
                    pathParams.mainMidPointRotationDirection = mainMidPointRotationDirection;

                if (pathParams.startProvider && isFunction(pathParams.startProvider)) {
                    pathParams.start = pathParams.startProvider({ index: i });
                }

                if (pathParams.targetProvider && isFunction(pathParams.targetProvider)) {
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

            if (debug) {
                console.log("path1", path1)
                console.log("path2", path2)
            }

            let frames = [];

            //step 0
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 0, framesCount);

                frames[frameIndex] = undefined;
            }

            //step 1
            let step1Path1MaxIndex = fast.r(path1.resultPoints.length * getRandom(0.4, 0.6));
            for (let f = 0; f < animationStepFramesLength; f++) {
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
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 2, framesCount);

                frames[frameIndex] = undefined;
            }

            //step 3
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 3, framesCount);

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
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 4, framesCount);

                frames[frameIndex] = undefined;
            }

            //step 5
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 5, framesCount);

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
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 6, framesCount);

                frames[frameIndex] = undefined;
            }

            //step 7
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 7, framesCount);

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
                let prev = new V2(path1.resultPoints[index - 1]);
                let dir = prev.direction(p);

                let c1 = p;
                let c2 = p.add(dir.mul(getRandom(1, 3))).toInt();
                let c3 = new V2(path1.resultPoints[index + getRandomInt(2, 5)]);

                if (c3.x == 0 && c3.y == 0) {
                    c3 = new V2(path1.resultPoints[index - getRandomInt(1, 3)])
                }

                return [c1, c2, c3];
            })

            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 8, framesCount);
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
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 9, framesCount);

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
            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 10, framesCount);

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

            let innerDotsPartsCount = getRandomInt(3, 5);
            for (let i = 0; i < innerDotsPartsCount; i++) {
                let index = getRandomInt(10, path1.resultPoints.length - 10);
                let dotsCount = getRandomInt(3, 5);
                let direction = getRandomBool() ? 1 : -1;
                for (let j = 0; j < dotsCount; j++) {
                    step11Dots.push(path1.resultPoints[index + direction * j])
                }
            }

            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 11, framesCount);

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
            let removeCount = fast.r(step12Dots.length / 2);
            while (removeCount--) {
                let index = getRandomInt(0, step12Dots.length - 1);
                step12Dots.splice(index, 1);
            }

            for (let f = 0; f < animationStepFramesLength; f++) {
                let frameIndex = getFrameIndex(f, startFrameIndex + animationStepFramesLength * 12, framesCount);

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
                let x = target.x + getRandomInt(particlesParams.startXDelta);
                let y = target.y + getRandomInt(particlesParams.startYDelta);
                let xAcceleration = 0.025;
                let xSpeed = getRandom(particlesParams.xSpeed);
                let yAcceleration = particlesParams.yAcceleration;
                let ySpeed = getRandom(particlesParams.ySpeed);
                if (x < target.x) {
                    xSpeed = -xSpeed;
                }
                // else {
                //     xSpeed = getRandom(0.1, 0.2);
                // }

                let frames = [];
                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }

                    y += ySpeed;
                    x += xSpeed;

                    let color = colors.main;
                    if (f < totalFrames / 3) {
                        color = colors.brighter
                    }
                    if (f > totalFrames * 2 / 3) {
                        color = colors.darker
                    }

                    frames[frameIndex] = {
                        color,
                        p: new V2(x, y).toInt()
                    };

                    ySpeed += yAcceleration;

                    if (xSpeed < 0) {
                        xSpeed += particlesParams.xSpeedReducer
                        if (xSpeed > 0)
                            xSpeed = 0;
                    }

                    if (xSpeed > 0) {
                        xSpeed -= particlesParams.xSpeedReducer
                        if (xSpeed < 0)
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

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {
                        switch (itemData.frames[f].stepIndex) {
                            case 1:
                            case 3:
                            case 7:
                                for (let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++) {
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }
                                break;
                            case 5:
                            case 9:
                                for (let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++) {
                                    hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                }
                                break;
                            case 8:
                            case 10:
                                if (itemData.frames[f].params.path2MaxIndex) {
                                    for (let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++) {
                                        hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                    }
                                }

                                let pp = new PP({ ctx });

                                if (!noDots) {
                                    itemData.frames[f].params.cornersData.forEach(cd => {
                                        pp.setFillStyle(itemData.frames[f].params.cornersColor);
                                        pp.fillByCornerPoints(cd)
                                    })
                                }

                                for (let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++) {
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }
                                break;
                            case 11:
                            case 12:
                                if (!noDots) {
                                    for (let i = 0; i < itemData.frames[f].params.dots.length; i++) {
                                        hlp.setFillColor(itemData.frames[f].params.dotsColor).dot(itemData.frames[f].params.dots[i])
                                    }
                                }
                                break;
                            default:
                                break;
                        }

                        if (itemData.frames[f].hStart) {
                            hlp.setFillColor(highlightParams.color);

                            highlightParams.startPointsProvider(itemData.start).forEach(p => {
                                hlp.dot(p)
                            });
                            // let width = getRandomInt(10, 20);
                            // hlp.setFillColor(colors.darker).rect(itemData.target.x - fast.r(width/2), itemData.target.y + 1, width, 1)
                        }

                        if (itemData.frames[f].hTarget) {

                            hlp.setFillColor(highlightParams.color);

                            highlightParams.targetPointsProvider(itemData.target).forEach(p => {
                                hlp.dot(p)
                            });
                        }
                        //itemData.path1.resultPoints.forEach(mp => hlp.dot(mp))
                    }

                    if (itemData.showParticles) {
                        for (let p = 0; p < itemData.particlesItemsData.length; p++) {
                            let pItemData = itemData.particlesItemsData[p];

                            if (pItemData.frames[f]) {
                                if (
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
    },

    /**
     * Анимация колебания изогнутых линий (например проводов)
     */
    createWiresFrames({ framesCount, dotsData, xClamps, yClamps, size, invert = false, c1, c2, usePP }) {
        let frames = [];

        let halfFramesCount = fast.r(framesCount / 2);

        dotsData.forEach(dotData => {
            if (dotData.dots.length == 1) {
                dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
            }
            else {
                let distance = dotData.dots[0].distance(dotData.dots[1]);
                let direction = dotData.dots[0].direction(dotData.dots[1]);
                let dValues = [
                    ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut' }),
                    ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut' }),
                ]

                dotData.dots = new Array(framesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));
            }
        });

        let framesData = [];
        for (let f = 0; f < framesCount; f++) {
            framesData[f] = { dots: [] };
            let dots = dotsData.map(dd => {
                if (invert) {
                    return { x: dd.dots[f].y, y: dd.dots[f].x }
                }

                return dd.dots[f]
            });


            let formula = mathUtils.getCubicSplineFormula(dots);

            if (invert) {
                for (let _y = yClamps[0]; _y < yClamps[1]; _y++) {
                    let _x = fast.r(formula(_y));
                    framesData[f].dots.push({ x: _x, y: _y });
                }
            }
            else {
                for (let x = xClamps[0]; x < xClamps[1]; x++) {
                    let y = fast.r(formula(x));
                    framesData[f].dots.push({ x, y });
                }
            }

        }

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                let prev = undefined;
                let pp = usePP ? new PP({ ctx }) : undefined;

                for (let i = 0; i < framesData[f].dots.length; i++) {
                    let color1 = undefined;
                    if (isFunction(c1)) {
                        color1 = c1(framesData[f].dots[i].x, framesData[f].dots[i].y)
                    }
                    else {
                        color1 = c1;
                    }

                    hlp.setFillColor(color1)

                    if (usePP) {
                        if (prev) {
                            pp.lineV2(prev, framesData[f].dots[i])
                        }
                    }
                    else {
                        hlp.dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                        if (c2 && prev != undefined && prev.y != framesData[f].dots[i].y) {
                            hlp.setFillColor(c2)
                                .dot(framesData[f].dots[i].x - 1, framesData[f].dots[i].y)
                                //.dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
                                .dot(prev.x + 1, prev.y)
                        }
                    }



                    prev = framesData[f].dots[i];
                }
            });
        }

        return frames;
    },

    /**
     * Попиксельная автоматизация анимации со смещением. 
     */
    createDynamicMovementFrames({ framesCount,
        triggerData = [
            {
                /*
                triggerMovementStartIndex - когда запускается триггерная линия,
                triggerMovementFramesCount - сколько длится движение триггерной линии
                itemFramesCount - сколько длится анимация стриггереной точки
                startFrameIndex - через сколько стриггеренная точка начнет анимацию
                cornerPoints - точки для создания триггерной линии
                p0, p1 - точки для создания траектории движения триггерной линии
                easingType, easingMethod - тип плавности смещения триггерной линии
                debugColor - отладка
                excludeColors - исключенные цвета
                */
                easingType, easingMethod, cornerPoints, p0, p1, triggerMovementFramesCount, triggerMovementStartIndex,
                itemFramesCount, startFrameIndex, debugColor,
                animation: {}
            }
        ],
        img, itemFrameslength, excludeColors = [], size }) {
        let frames = [];

        let sharedPP = PP.createNonDrawingInstance();
        let modifiersItemsData = [];
        let modifiersItemsDataFastAccess = [];

        let colorsCache = {};

        let rgbToHexByKey = (rgb) => {
            let key = rgb[0] * 1000000 + rgb[1] * 1000 + rgb[2];
            if (!colorsCache[key]) {
                colorsCache[key] = colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' })
            }

            return colorsCache[key];
        }

        let createModifiersContainer = (p) => {
            if (modifiersItemsData[p.y] == undefined) {
                modifiersItemsData[p.y] = [];
            }

            if (modifiersItemsData[p.y][p.x] == undefined) {
                modifiersItemsData[p.y][p.x] = {
                    frames: [],
                    p: p
                };

                modifiersItemsDataFastAccess.push(modifiersItemsData[p.y][p.x]);
            }
        }

        let originPixelsMatrix = getPixelsAsMatrix(img, size);

        for (let tdIndex = 0; tdIndex < triggerData.length; tdIndex++) {
            let td = triggerData[tdIndex];

            let triggerLinePoints = sharedPP.lineByCornerPoints(td.cornerPoints).map(p => new V2(p));
            let triggerMovementPoints = sharedPP.lineV2(td.p0, td.p1).map(p => new V2(p));
            let triggerMovementPointsIndices = easing.fast({
                from: 0, to: triggerMovementPoints.length - 1, steps: td.triggerMovementFramesCount,
                type: td.easingType, method: td.easingMethod, round: 0
            })

            let triggeredOriginPoints = [];

            for (let f = 0; f < td.triggerMovementFramesCount; f++) {
                let triggerLineShift = triggerMovementPoints[triggerMovementPointsIndices[f]].substract(td.p0);

                let currentTriggerLinePoints = triggerLinePoints.map(tlp => tlp.add(triggerLineShift));

                currentTriggerLinePoints.forEach(triggerPoint => {
                    if (triggeredOriginPoints[triggerPoint.y] && triggeredOriginPoints[triggerPoint.y][triggerPoint.x]) {
                        return; //уже активировано
                    }

                    if (!originPixelsMatrix[triggerPoint.y] || !originPixelsMatrix[triggerPoint.y][triggerPoint.x]) {
                        return; // в матрице пусто
                    }

                    let triggerPointColor = rgbToHexByKey(originPixelsMatrix[triggerPoint.y][triggerPoint.x]);
                    if (excludeColors.indexOf(triggerPointColor) != -1) {
                        return;
                    }

                    // формируем контейнер для записи при её отсутствии в коллекции модификаторов по x,y
                    createModifiersContainer(triggerPoint);

                    // для текущего триггера, отмечаем, что данный пиксель уже подвергя модификации - активируем
                    if (triggeredOriginPoints[triggerPoint.y] == undefined) {
                        triggeredOriginPoints[triggerPoint.y] = [];
                    }

                    if (triggeredOriginPoints[triggerPoint.y][triggerPoint.x] == undefined) {
                        triggeredOriginPoints[triggerPoint.y][triggerPoint.x] = {
                            triggered: true
                        };
                    }

                    let startFrameIndex = f + td.triggerMovementStartIndex + (isArray(td.startFrameIndex) ? getRandomInt(td.startFrameIndex) : td.startFrameIndex);
                    let totalFrames = isArray(td.itemFramesCount) ? getRandomInt(td.itemFramesCount) : td.itemFramesCount;

                    let currentAnimationValues = {}
                    if (td.animation && td.animation.type == 0) {
                        let animationStep = fast.r(totalFrames / 4);
                        currentAnimationValues.animationStep = animationStep;
                        currentAnimationValues.steps = [
                            { values: easing.fast({ from: 0, to: 1, steps: animationStep, type: 'quad', method: 'inOut', round: 0 }) },
                            { values: easing.fast({ from: 1, to: 0, steps: animationStep, type: 'quad', method: 'inOut', round: 0 }) },
                            { values: easing.fast({ from: 0, to: 1, steps: animationStep, type: 'quad', method: 'inOut', round: 0 }) },
                            { values: easing.fast({ from: 1, to: 0, steps: animationStep, type: 'quad', method: 'inOut', round: 0 }) }
                        ]

                        currentAnimationValues.color = triggerPointColor//rgbToHexByKey(originPixelsMatrix[triggerPoint.y][triggerPoint.x]);

                        let neighborPixel = triggerPoint.add(td.animation.shiftDirection);
                        let oppositePixel = triggerPoint.add(td.animation.shiftDirection.mul(-1));

                        let oppositePixelColor = undefined
                        if (originPixelsMatrix[oppositePixel.y] && originPixelsMatrix[oppositePixel.y][oppositePixel.x]) {
                            oppositePixelColor = rgbToHexByKey(originPixelsMatrix[oppositePixel.y][oppositePixel.x]);
                        }

                        if (excludeColors.indexOf(oppositePixelColor) != -1) {
                            return;
                        }

                        currentAnimationValues.oppositePixelColor = oppositePixelColor;

                        createModifiersContainer(neighborPixel);
                        currentAnimationValues.neighborPixel = neighborPixel;
                    }

                    for (let _f = 0; _f < totalFrames; _f++) {
                        let frameIndex = _f + startFrameIndex;
                        if (frameIndex > (framesCount - 1)) {
                            frameIndex -= framesCount;
                        }

                        // в конкретной точке модификатора для конкретного фрейма создаем коллекцию модификаций, если таковой нету
                        if (modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex] == undefined) {
                            modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex] = [];
                        }

                        if (td.debugColor) {
                            modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                type: 1,
                                color: td.debugColor
                            });
                        }
                        else if (td.animation) {
                            if (td.animation.type == 0) {
                                let np = currentAnimationValues.neighborPixel;
                                let currentAnimationStep = fast.f(_f / currentAnimationValues.animationStep);
                                if (modifiersItemsData[np.y][np.x].frames[frameIndex] == undefined) {
                                    modifiersItemsData[np.y][np.x].frames[frameIndex] = [];
                                }
                                switch (currentAnimationStep) {
                                    case 0:
                                        if (currentAnimationValues.steps[currentAnimationStep].values[_f % currentAnimationValues.animationStep] == 1) {
                                            modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                type: 1,
                                                color: currentAnimationValues.color
                                            });
                                        }
                                        break;
                                    case 1:
                                        modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                            type: 1,
                                            color: currentAnimationValues.color
                                        });
                                        if (currentAnimationValues.steps[currentAnimationStep].values[_f % currentAnimationValues.animationStep] == 0) {

                                            if (currentAnimationValues.oppositePixelColor) {
                                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                    type: 1,
                                                    color: currentAnimationValues.oppositePixelColor
                                                });
                                            }
                                            else {
                                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                    type: 0
                                                });
                                            }

                                        }
                                        break;
                                    case 2:
                                        modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                            type: 1,
                                            color: currentAnimationValues.color
                                        });
                                        if (currentAnimationValues.steps[currentAnimationStep].values[_f % currentAnimationValues.animationStep] == 0) {
                                            if (currentAnimationValues.oppositePixelColor) {
                                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                    type: 1,
                                                    color: currentAnimationValues.oppositePixelColor
                                                })
                                            }
                                            else {
                                                modifiersItemsData[triggerPoint.y][triggerPoint.x].frames[frameIndex].push({
                                                    type: 0
                                                })
                                            }

                                        }
                                        break;
                                    case 3:
                                        if (currentAnimationValues.steps[currentAnimationStep].values[_f % currentAnimationValues.animationStep] == 1) {
                                            modifiersItemsData[np.y][np.x].frames[frameIndex].push({
                                                type: 1,
                                                color: currentAnimationValues.color
                                            });
                                        }
                                        break;
                                }
                            }
                        }

                    }

                })
            }
        }

        // let itemsData = new Array(itemsCount).fill().map((el, i) => {
        //     let startFrameIndex = getRandomInt(0, framesCount-1);
        //     let totalFrames = itemFrameslength;

        //     let frames = [];
        //     for(let f = 0; f < totalFrames; f++){
        //         let frameIndex = f + startFrameIndex;
        //         if(frameIndex > (framesCount-1)){
        //             frameIndex-=framesCount;
        //         }

        //         frames[frameIndex] = {

        //         };
        //     }

        //     return {
        //         frames
        //     }
        // })

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                ctx.drawImage(img, 0, 0);

                for (let mIndex = 0; mIndex < modifiersItemsDataFastAccess.length; mIndex++) {
                    let mData = modifiersItemsDataFastAccess[mIndex];

                    if (mData.frames[f]) {
                        let isClear = false;
                        let fillColor = undefined;

                        for (let mi = 0; mi < mData.frames[f].length; mi++) {
                            let mValue = mData.frames[f][mi];

                            if (mValue.type == 0) { // clear
                                if (fillColor) {
                                    continue;
                                }

                                isClear = true;
                            }
                            else if (mValue.type == 1) { // add
                                isClear = false;
                                fillColor = mValue.color
                            }
                        }

                        if (fillColor) {
                            hlp.setFillColor(fillColor).dot(mData.p);
                        }
                        else if (isClear) {
                            hlp.clear(mData.p.x, mData.p.y)
                        }
                    }
                }

            });
        }

        return frames;
    },

    /**
     * Анимирование смещающихся слоёв с прозрачностью
    */
    createShiftFrames({ totalFrames, layerImg, xShift, yShift = 0, size, easingType = 'quad', easingMethods = ['out', 'in'], delta = new V2() }) {
        let frames = [];
        let img = layerImg;
        let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0 })
        let yChange = easing.fast({ from: 0, to: yShift, steps: totalFrames, type: 'linear', round: 0 })

        let aValues = [
            ...easing.fast({ from: 0, to: 1, steps: totalFrames / 2, type: easingType, method: easingMethods[0], round: 2 }),
            ...easing.fast({ from: 1, to: 0, steps: totalFrames / 2, type: easingType, method: easingMethods[1], round: 2 })
        ]

        let mainFr = [];
        for (let f = 0; f < totalFrames; f++) {
            mainFr[f] = createCanvas(size, (ctx, size, hlp) => {
                ctx.globalAlpha = aValues[f];
                ctx.drawImage(img, xChange[f], yChange[f]);
            })
        }

        let startFrameIndex = fast.r(totalFrames / 4);
        let startFrameIndex2 = fast.r(totalFrames * 2 / 4);
        let startFrameIndex3 = fast.r(totalFrames * 3 / 4);
        for (let f = 0; f < totalFrames; f++) {

            let frameIndex = f + startFrameIndex;
            if (frameIndex > (totalFrames - 1)) {
                frameIndex -= totalFrames;
            }

            let frameIndex2 = f + startFrameIndex2;
            if (frameIndex2 > (totalFrames - 1)) {
                frameIndex2 -= totalFrames;
            }

            let frameIndex3 = f + startFrameIndex3;
            if (frameIndex3 > (totalFrames - 1)) {
                frameIndex3 -= totalFrames;
            }

            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                ctx.drawImage(mainFr[f], delta.x, delta.y);
                ctx.drawImage(mainFr[frameIndex], delta.x, delta.y);
                ctx.drawImage(mainFr[frameIndex2], delta.x, delta.y);
                ctx.drawImage(mainFr[frameIndex3], delta.x, delta.y);
            })
        }

        return frames;
    },

    /**** Анимирование падения капель
     * framesCount - общее количество кадров в анимации
     * type - тип изинга для второй части (падение)
     * method - метод изинга для второй части (падение) 
     * startPosition
     * - useAll - использовать все точки из data
     * - data - массив со стартовыми точками
     * - itemsCount - если useAll=false, то тогда в произвольном порядке из data берем количество
     * - height - высота на которую падает вниз капля
     * - tail - длина хвоста
     * - itemFrameslength1Clamps - время первой части (проявления), оверрайдит общую настройку
     * - itemFrameslength2Clamps - время второй части (падение), оверрайдит общую настройку
     * - opacityClamps - максимальная прозрачность
     * - reduceOpacityOnFall - уменьшать прозрачность при падении
     * - colorPrefix - префикс цвета, оверрайдит общую настройку
    */
    createDropsFrames({framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions, reduceOpacityOnFall = false,
        type, method, colorPrefix }) {
        let frames = [];

        let itemsData = [];
        startPositions.forEach(startPosition => {
            itemsData.push(...(startPosition.useAll ? startPosition.data : new Array(startPosition.itemsCount).fill()).map((el, i, arr) => {
                let p = startPosition.useAll ? el : startPosition.data[getRandomInt(0, startPosition.data.length-1)]
                let startFrameIndex = startPosition.sequential ? fast.r(i/(arr.length-1)*(framesCount-1), 0)  : getRandomInt(0, framesCount - 1);

                let height = startPosition.height;
                let maxTailLength = startPosition.tail || 0;

                let part1Length = getRandomInt(startPosition.itemFrameslength1Clamps || itemFrameslength1Clamps );
                let part2Length = getRandomInt(startPosition.itemFrameslength2Clamps || itemFrameslength2Clamps)

                let totalFrames = part1Length + part2Length
                let oc = startPosition.opacityClamps || opacityClamps;
                let opacity = fast.r(getRandom(oc[0], oc[1]), 2);
                let part1Alpha = easing.fast({ from: 0, to: opacity, steps: part1Length, type: 'linear', round: 2 })
                let part2Alpha = undefined;
                let rof = reduceOpacityOnFall;
                if(startPosition.reduceOpacityOnFall != undefined)
                    rof = startPosition.reduceOpacityOnFall;

                if (rof) {
                    part2Alpha = easing.fast({ from: opacity, to: 0, steps: part2Length, type: 'linear', round: 2 })
                }

                let part2YChange = easing.fast({ from: p.y, to: p.y + height, steps: part2Length, type, method, round: 0 })
                let tailChangeValues = undefined;
                if (maxTailLength > 0) {
                    tailChangeValues = easing.fast({ from: 0, to: maxTailLength, steps: part2Length, type: 'expo', method: 'in', round: 0 })
                }

                let frames = [];
                for (let f = 0; f < totalFrames; f++) {
                    let frameIndex = f + startFrameIndex;
                    if (frameIndex > (framesCount - 1)) {
                        frameIndex -= framesCount;
                    }

                    let y = p.y;
                    let alpha = 0;
                    if (f < part1Length) {
                        alpha = part1Alpha[f];
                    }
                    else {
                        y = part2YChange[f - part1Length];
                        alpha = part2Alpha ? part2Alpha[f - part1Length] : opacity
                    }

                    let tail = 0;
                    if (tailChangeValues) {
                        tail = tailChangeValues[f - part1Length];
                    }

                    frames[frameIndex] = {
                        y,
                        tail,
                        alpha
                    };
                }

                return {
                    x: p.x,
                    frames,
                    colorPrefix: startPosition.colorPrefix || colorPrefix
                }
            }))
        });

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {

                        let p = new V2(itemData.x, itemData.frames[f].y);

                        hlp.setFillColor(itemData.colorPrefix + itemData.frames[f].alpha + ')').dot(p);

                        if (itemData.frames[f].tail > 0) {
                            for (let i = 0; i < itemData.frames[f].tail; i++) {
                                hlp.dot(p.add(new V2(0, i + 1)));
                            }
                        }
                    }

                }
            });
        }

        return frames;
    },

    /** Анимирование множества слоёв в различное последовательности (например ветки деревьев)
     * framesCount - общее количество кадров
     * itemFrameslength - количество кадров на каждый слой
     * startFramesClamps - если не задано startFramesSequence, то тогда кадр начала берется из диапазона
     * startFramesSequence - последовательность начальных кадров для слоёв
     * additional - блок дополнительной анимации
     * * framesShift - смещение от окончания основной анимации, может быть массивом или скаляром
     * * frameslength - продолжительность дополнительной анимации
     * * framesIndiciesChange - массив изменений индексов кадров
     * animationsModel - модель с анимациями
     * size - размер
     * type - тип плавного изменения
     * method - метод плавного изменения
     * oneWayOnly - анимация только в одну сторону, иначе кадры идут в реверс
     * maxFrameIndex - максимальный интекс кадра для анимации
     * 
     */
    createLayersAnimationFrames({framesCount, itemFrameslength, startFramesClamps, startFramesSequence, additional, animationsModel, size, 
        type = 'quad', method = 'inOut', maxFrameIndex,
        oneWayOnly =false}) {
        let frames = [];
        let images = [];

        let itemsCount = animationsModel.main[0].layers.length;

        if(!maxFrameIndex)
            maxFrameIndex = animationsModel.main.length-1

        let framesIndiciesChange = oneWayOnly ? 
        easing.fast({ from: 0, to: animationsModel.main.length-1, steps: itemFrameslength, type: 'quad', method: 'inOut', round: 0 })
        : [
            ...easing.fast({ from: 0, to: maxFrameIndex, steps: itemFrameslength/2, type, method, round: 0 }),
            ...easing.fast({ from: maxFrameIndex, to: 0, steps: itemFrameslength/2, type, method, round: 0 })
        ]

        for(let i = 0; i < itemsCount; i++) {
            let name = animationsModel.main[0].layers[i].name;
            if(!name) {
                name = animationsModel.main[0].layers[i].id
            } 

            images[i] = PP.createImage(animationsModel, { renderOnly: [name] }) //'l' + (i+1)
        }
        
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = startFramesSequence ? 
            startFramesSequence[i]
            : getRandomInt(startFramesClamps);  //getRandomInt(0, framesCount-1);
            
            let totalFrames = itemFrameslength;
        
            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    index: framesIndiciesChange[f]
                };
            }

            if(additional) {
                let startFrameIndex1 = startFrameIndex + totalFrames 
                + (isArray(additional.framesShift) ? getRandomInt(additional.framesShift) : additional.framesShift);
                for(let f = 0; f < additional.frameslength; f++){
                    let frameIndex = f + startFrameIndex1;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    frames[frameIndex] = {
                        index: additional.framesIndiciesChange[f]
                    };
                }
            }
            
        
            return {
                img: images[i],
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let index = itemData.frames[f].index;
                        ctx.drawImage(itemData.img[index], 0, 0);
                    }
                    
                }
            });
        }
        
        return frames;
    },

    createSmokeFrames({ framesCount, itemsCount, startPositions, aClamps, itemFrameslength, velocityClamps, accelerationClamps, itemMaxSizeClamps, dChangeType, mask, color, size, angleDeviation = 15, appSharedPP, debug = false }) {
        let frames = [];

        //let angleDeviation = 15//45
        let methods = ['in', 'out', 'inOut']
        let itamsPredefinedImagesCount = 30;
        let itemImageSize = new V2(itemMaxSizeClamps[1] * 2, itemMaxSizeClamps[1] * 2);
        let itemImageCenter = itemImageSize.divide(2).toInt();
        let itemImageSteps = undefined;//itemMaxSizeClamps[1];

        switch (dChangeType) {
            case 0:
                itemImageSteps = itemMaxSizeClamps[1] * 2
                break;
            case 1, 2:
                itemImageSteps = itemMaxSizeClamps[1]
                break;
            default:
                throw new Error('Unknown dChangeType')
        }

        itemImageSteps *= 2;

        let cornerPoints = [
            itemImageCenter,
            itemImageCenter,
            itemImageCenter,
            itemImageCenter
        ]

        let itemsImages = new Array(itamsPredefinedImagesCount).fill().map(_ => {
            let directions = [
                new V2(-1, 0).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                new V2(0, -1).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                new V2(1, 0).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                new V2(0, 1).rotate(getRandomInt(-angleDeviation, angleDeviation))
            ]

            let distanceValues = new Array(cornerPoints.length).fill().map(_ => {
                let maxD = getRandomInt(itemMaxSizeClamps) //getRandomInt(4, 8);
                let method = methods[getRandomInt(0, methods.length - 1)]

                switch (dChangeType) {
                    case 0:
                        return [
                            ...easing.fast({ from: 0, to: maxD, steps: itemImageSteps / 2, type: 'quad', method, round: 2 }),
                            ...easing.fast({ from: maxD, to: 0, steps: itemImageSteps / 2, type: 'quad', method, round: 2 })
                        ]
                    case 1:
                        return easing.fast({ from: maxD, to: 0, steps: itemImageSteps, type: 'quad', method, round: 2 })
                    case 2:
                        return new Array(itemImageSteps).fill(maxD)
                }
            });

            let cornerPointsShifts = directions.map((direction, i) => distanceValues[i].map(distance => direction.mul(distance)));

            let imgs = [];//new Array(itemImageSteps);

            for (let iStep = 0; iStep < itemImageSteps; iStep++) {
                let isBreak = false;
                imgs[iStep] = createCanvas(itemImageSize, (ctx, size, hlp) => {
                    let pp = new PP({ ctx });

                    let curveCornerPoints = cornerPoints.map((p, i) => p.add(cornerPointsShifts[i][iStep]))
                    let currentCornerPoints = appSharedPP.curveByCornerPoints([...curveCornerPoints], 4, true)

                    if (currentCornerPoints.length > 3) {
                        pp.setFillStyle(color || whiteColorPrefix)
                        pp.fillByCornerPoints(currentCornerPoints, { fixOpacity: true })
                    }
                    else {
                        switch (dChangeType) {
                            case 0:
                                if (iStep > itemImageSteps / 2) {
                                    isBreak = true;
                                }
                                break;
                            case 1:
                                isBreak = true;
                                break;
                        }
                    }
                })

                if (isBreak)
                    break;
            }

            return imgs;
        });


        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount - 1);
            let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
            let halfTotalFrames = fast.r(totalFrames / 2)
            let itemImgs = itemsImages[getRandomInt(0, itemsImages.length - 1)]

            let sp = startPositions[getRandomInt(0, startPositions.length - 1)];
            let aValues = [
                ...easing.fast({ from: aClamps[0], to: aClamps[1], steps: halfTotalFrames, type: 'quad', method: 'inOut', round: 2 }),
                ...easing.fast({ from: aClamps[1], to: aClamps[0], steps: halfTotalFrames, type: 'quad', method: 'inOut', round: 2 })
            ]

            let itemImgIndices = easing.fast({ from: 0, to: itemImgs.length - 1, steps: totalFrames, type: 'linear', round: 0 })

            let velocity = {}//V2.random(velocityClamps.xClamps, velocityClamps.yClamps, false)
            let acceleration = {};//V2.random(accelerationClamps.xClamps, accelerationClamps.yClamps,false)

            if (velocityClamps.xClamps) {
                velocity.x = getRandom(velocityClamps.xClamps[0], velocityClamps.xClamps[1])
            }

            if (velocityClamps.xf) {
                velocity.xf = velocityClamps.xf(totalFrames);
            }

            if (velocityClamps.yClamps) {
                velocity.y = getRandom(velocityClamps.yClamps[0], velocityClamps.yClamps[1])
            }

            if (velocityClamps.yf) {
                velocity.yf = velocityClamps.yf(totalFrames);
            }

            if (accelerationClamps.xClamps) {
                acceleration.x = getRandom(accelerationClamps.xClamps[0], accelerationClamps.xClamps[1])
            }

            if (accelerationClamps.xf) {
                acceleration.xf = accelerationClamps.xf(totalFrames);
            }

            if (accelerationClamps.yClamps) {
                acceleration.y = getRandom(accelerationClamps.yClamps[0], accelerationClamps.yClamps[1])
            }

            if (accelerationClamps.yf) {
                acceleration.yf = accelerationClamps.yf(totalFrames);
            }


            let mainShift = V2.zero;

            let frames = [];
            for (let f = 0; f < totalFrames; f++) {
                let frameIndex = f + startFrameIndex;
                if (frameIndex > (framesCount - 1)) {
                    frameIndex -= framesCount;
                }

                if (velocity.xf) {
                    velocity.x = velocity.xf(f);
                }

                if (velocity.yf) {
                    velocity.y = velocity.yf(f);
                }

                if (acceleration.x) {
                    velocity.x += acceleration.x
                }

                if (acceleration.xf) {
                    velocity.x += acceleration.xf(f)
                }

                if (acceleration.y) {
                    velocity.y += acceleration.y
                }

                if (acceleration.yf) {
                    velocity.y += acceleration.yf(f)
                }

                mainShift.add(velocity, true);

                frames[frameIndex] = {
                    imgIndex: itemImgIndices[f],
                    p: sp.add(mainShift),
                    a: aValues[f]
                };
            }

            return {
                itemImgs,
                frames
            }
        });

        for (let f = 0; f < framesCount; f++) {
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for (let p = 0; p < itemsData.length; p++) {
                    let itemData = itemsData[p];

                    if (itemData.frames[f]) {
                        ctx.globalAlpha = itemData.frames[f].a;
                        ctx.drawImage(itemData.itemImgs[itemData.frames[f].imgIndex], itemData.frames[f].p.x + itemImageCenter.x, itemData.frames[f].p.y + itemImageCenter.y)
                    }

                }

                ctx.globalAlpha = 1;

                if(debug){
                    let d_clr = 'red' 
                    if(debug !== true)
                        d_clr = debug;

                    hlp.setFillColor(d_clr);
                    startPositions.forEach(p => hlp.dot(p))
                }

                if (mask) {
                    ctx.globalCompositeOperation = mask.operation || 'source-atop'
                    ctx.drawImage(mask.img, 0, 0)
                }
            });
        }

        return frames;
    }


}