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
            let totalFrames = itemFrameslength;
        
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
        directionAngleClamps, distanceClamps, sizeClamps, initialProps, yShiftClamps, invertMovement = false,
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

        if(createPoligon) {
            createPoligon.img = createCanvas(size, (ctx, _size, hlp) => {
                let pp = new PP({ctx});
                pp.setFillStyle(color)

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

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    y: yShiftValues[f],
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

                if(createPoligon && createPoligon.img) {
                    ctx.drawImage(createPoligon.img, 0,0)
                }

                let secData = [];
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        let _p = itemData.frames[f].p;
                        let yShift = itemData.frames[f].y;
                        ctx.drawImage(circleImages[color][itemData.s], _p.x, _p.y + yShift)

                        if(itemData.sec) {
                            secData[secData.length] = {
                                s: itemData.sec.s,
                                x: _p.x + itemData.sec.xShift,
                                y: _p.y + yShift + itemData.sec.yShift
                            }
                            //ctx.drawImage(circleImages[secColor][itemData.sec.s], _p.x, _p.y + yShift + itemData.sec.yShift)
                        }
                    }
                    
                }

                for(let i = 0; i < secData.length; i++){
                    ctx.drawImage(circleImages[sec.color][secData[i].s],secData[i].x, secData[i].y)
                }
            });
        }
        
        return frames;
    }
}