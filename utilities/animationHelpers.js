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
    }
}