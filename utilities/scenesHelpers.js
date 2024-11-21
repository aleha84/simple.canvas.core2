var scenesHelper = {
    createGradient: ({
        hlp, aValueMul, center, radius, gradientOrigin, origin, size, 
        colorPrefix, easingType = 'quad', easingMethod = 'out', angle = 0, verticalCut,
        useValueType = 'max'
    }) => {

        if(gradientOrigin == undefined && origin != undefined)
            gradientOrigin = origin

        center = V2.objToV2(center);
        gradientOrigin = V2.objToV2(gradientOrigin);

        let gradientDots = colors.createRadialGradient({ size: size.clone(), 
            center, radius, gradientOrigin, angle, easingType, easingMethod,
            setter: (dot, aValue) => {
                aValue*=aValueMul;

                if(!dot.values){
                    dot.values = [];
                    dot.maxValue = aValue;
                }

                if(aValue > dot.maxValue)
                    dot.maxValue = aValue;

                dot.values.push(aValue);
                dot.midValue = dot.values.reduce((a,b) => a + b, 0)/dot.values.length
            } 
        })

        for(let y = 0; y < gradientDots.length; y++) {
            if(gradientDots[y]) {
                for(let x = 0; x < gradientDots[y].length; x++) {
                    if(gradientDots[y][x]) {

                        let a = 0;
                        switch(useValueType){
                            case "max": a = fast.r(gradientDots[y][x].maxValue/1,2); break;
                            case "mid": a = fast.r(gradientDots[y][x].midValue/1,2); break;
                            default: a = 0;
                        }
                        //let a = fast.r(gradientDots[y][x].maxValue/1,2)

                        if(verticalCut) {
                            let vCutPoint = verticalCut.points.filter(p => p.x == x);
                            if(vCutPoint.length > 0){
                                if(y <= vCutPoint[0].y) {
                                    let yDelta = vCutPoint[0].y - y;
                                    if(yDelta >= verticalCut.aValuesMul.length){
                                        a  = 0;
                                    }
                                    else {
                                        a*=verticalCut.aValuesMul[yDelta];
                                    }
                                }
                            }
                        }
                        
                        hlp.setFillColor(`${colorPrefix}${a})`).dot(x,y) 
                    }
                }
            }
        }
    }
}