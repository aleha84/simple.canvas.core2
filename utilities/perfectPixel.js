class PerfectPixel {
    constructor(options = {}){
        this.fillStyleProvider = undefined;
        this.positionModifier = undefined;
        this.modifyContext = undefined;
        
        assignDeep(this, {
            fillStyleProvider: undefined,
            positionModifier: undefined,
            modifyContext: true,
        }, options)

        if(this.ctx == undefined && this.context === undefined){
            console.trace();
            throw 'PerfectPixel -> context is not defined';
        }

        if(this.context){
            this.ctx = this.context;
        }
        
        this.context = this.ctx;
    }
    getFillStyle() {
        return this.ctx.fillStyle;
    }
    setFillStyle(color){
        this.ctx.fillStyle = color;
    }
    setFillColor(color) {
        this.setFillStyle(color);
    }
    setPixel(x, y){
        if(this.fillStyleProvider)
            this.ctx.fillStyle = this.fillStyleProvider(x, y);
        
        if(this.positionModifier){
            let res = this.positionModifier(x,y)
            if(res == undefined)
                return;
                
            x = res.x;
            y = res.y;
        }
         
        if(!this.modifyContext) {
            return;
        }

        if(this.clear){
            this.removePixel(x,y);
        }
        else if(this.replace) {
            this.removePixel(x,y);
            this.ctx.fillRect(x,y, 1,1);
        }
        else {
            this.ctx.fillRect(x,y, 1,1);
        }
        
    }
    removePixel(x,y){
        if(!this.modifyContext) {
            return;
        }

        this.ctx.clearRect(x, y, 1,1);
    }
    curveByCornerPoints(corners, numOfSegments, isClosed = false) {
        let filledPixels = [];
        let curvePoints = mathUtils.getCurvePointsMain({points: corners, numOfSegments, isClosed });

        for(let i = 1; i < curvePoints.length; i++) {
            filledPixels= [...filledPixels, ...this.lineV2(curvePoints[i-1], curvePoints[i])];
        }

        return distinctPoints(filledPixels);
    }
    lineByCornerPoints(corners) {
        if(!isArray(corners)) {
            throw 'Should be an array';
        }

        if(corners.length < 2) {
            throw 'Array should contain more than 1 point';
        }

        let result = []
        for(let i = 1; i < corners.length; i++) {
            result= [...result, ...this.lineV2(corners[i-1], corners[i])];
        }

        return distinctPoints(result);
    }
    lineV2(p1, p2, params = { toV2: false}){
        if(!p1 || !(p1 instanceof Vector2)){
            if(isObject(p1) && p1.x != undefined && p1.y != undefined){
                p1 = new V2(p1);
            }
            else {
                console.trace();
                throw 'PerfectPixel.lineV2 -> p1 must be V2 instance';
            }
        }
        
        if(!p2 || !(p2 instanceof Vector2)){
            if(isObject(p2) && p2.x != undefined && p2.y != undefined){
                p2 = new V2(p2);
            }
            else {
                console.trace();
                throw 'PerfectPixel.lineV2 -> p2 must be V2 instance';
            }
			
        }

        let result = this.line(p1.x, p1.y, p2.x, p2.y);
        if(params.toV2) {
            return result.map(p => new V2(p))
        }
        
        return result;
    }

    lineL(line){
        let from = line.from || line.start || line.begin;
        let to = line.to || line.end;

        if(!from || !to){
            console.trace();
                throw 'PerfectPixel.lineL -> Wrong line params';
        }

        return this.line(from.x, from.y, to.x, to.y)
    }

    line(x0, y0, x1, y1){

        let errors = [];
        if(x0 == undefined || x0 == null || Number.isNaN(x0))
            errors.push('x0 has no value')

        if(y0 == undefined || y0 == null || Number.isNaN(y0))
            errors.push('y0 has no value')

        if(x1 == undefined || x1 == null || Number.isNaN(x1))
            errors.push('x1 has no value')

        if(y1 == undefined || y1 == null || Number.isNaN(y1))
            errors.push('y1 has no value')  

        if(errors.length > 0){
            throw errors.join('; ')
        }

        x0 = fastRoundWithPrecision(x0, 0);
        y0 = fastRoundWithPrecision(y0, 0);
        x1 = fastRoundWithPrecision(x1, 0);
        y1 = fastRoundWithPrecision(y1, 0);

        if(x0 == x1 && y0 == y1) {
            this.setPixel(x0,y0);  
            return [{x: x0, y: y0}];
        }

        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx-dy;
     
        let filledPoints = [];
        while(true){
          this.setPixel(x0,y0);  
          filledPoints.push({x: x0, y: y0});

          if ((x0==x1) && (y0==y1)) break;
          var e2 = 2*err;
          if (e2 >-dy){ err -= dy; x0  += sx; }
          if (e2 < dx){ err += dx; y0  += sy; }
        }

        return filledPoints;
     }

     renderPattern(patternType, filledPoints){
         let result = [];
        if(!patternType){
            patternType = 'type1';
        }

        let setPixel = (x,y) => {
            this.setPixel(x, y);
            result.push({x,y});
        }

        for(let i = 0; i < filledPoints.length; i++){
            let up = filledPoints[i];

            if(patternType == 'type1'){
                let shift = up.y %2 == 0;
                if((shift && up.x % 2 != 0) || (!shift && up.x%2 == 0)){
                    setPixel(up.x, up.y);
                }
            }
            else if(patternType == 'type2'){
                if((up.y+1) % 2 == 0 && up.x % 2 == 0) {
                    setPixel(up.x, up.y);
                }
            }
            else if(patternType == 'type2_y1'){
                if((up.y) % 2 == 0 && up.x % 2 == 0) {
                    setPixel(up.x, up.y);
                }
            }
            else if(patternType == 'type3'){
                if(up.y % 4 == 0 && up.x % 4 == 0) {
                    setPixel(up.x, up.y);
                }
            }  
        }

        return result;
    }
     
     fillByCornerPoints(cornerPoints, params = { fixOpacity: false, toV2: false }) {
         if(cornerPoints.length < 3)
            throw 'fillByCornerPoints -> cornerPoints should be 3 or more!';

        let filledPixels = [];

        let cachedFillStyle = this.getFillStyle();
        if(params.fixOpacity) {
            this.setFillStyle('rgba(0,0,0,0)')
        }

        for(let i = 0; i < cornerPoints.length;i++){
            if(i < cornerPoints.length-1)
                filledPixels= [...filledPixels, ...this.lineV2(cornerPoints[i], cornerPoints[i+1])];
        }

        filledPixels = [...filledPixels, ...this.lineV2(cornerPoints[cornerPoints.length-1], cornerPoints[0])];
        let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

        if(params.fixOpacity) {
            this.setFillStyle(cachedFillStyle)
            uniquePoints.forEach(p => this.setPixel(p.x,p.y));
        }

        let result = this.fill(uniquePoints, cornerPoints)

        if(params.toV2) {
            return result.map(p => new V2(p))
        }

        return result;
     }

     fill(filledPoints, cornerPoints, params = { type: 'line' } ) {//, _fillPoints) {
        let _fillPointsResult = [...filledPoints];
        let checkBoundaries = function(p) {
            let checkedPoints = [];
            //check left
            let boundaryFound = false;
            for(let i = p.x-1; i >= extrX.min;i--){
                if(matrix[p.y][i] != undefined && matrix[p.y][i].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: i, y: p.y});
            }

            if(!boundaryFound)
                return false;

            // check right
            boundaryFound = false;
            for(let i = p.x+1; i <= extrX.max;i++){
                if(matrix[p.y][i] != undefined && matrix[p.y][i].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: i, y: p.y});
            }

            if(!boundaryFound)
                return false;

            // check above
            boundaryFound = false;
            for(let i = p.y-1; i >= extrY.min;i--){
                if(matrix[i][p.x] != undefined && matrix[i][p.x].filled){
                    boundaryFound = true;
                    break;
                }

                checkedPoints.push({x: p.x, y: i});
            }

            if(!boundaryFound)
                return false;

             // check below
             boundaryFound = false;
             for(let i = p.y+1; i <= extrY.max;i++){
                 if(matrix[i][p.x] != undefined && matrix[i][p.x].filled){
                     boundaryFound = true;
                     break;
                 }
 
                 checkedPoints.push({x: p.x, y: i});
             }

             if(!boundaryFound)
                return false;

            return checkedPoints;
        }

        // 1. create matrix
        let matrix = [];
        let extrX = {min: filledPoints[0].x, max: filledPoints[0].x};
        let extrY = {min: filledPoints[0].y, max: filledPoints[0].y};
        for(let fp of filledPoints){
            if(matrix[fp.y] == undefined){
                matrix[fp.y] = [];
            }

            matrix[fp.y][fp.x] = { filled: true };
            // 2. find extremums
            if(fp.x < extrX.min) extrX.min = fp.x;
            if(fp.x > extrX.max) extrX.max = fp.x;
            if(fp.y < extrY.min) extrY.min = fp.y;
            if(fp.y > extrY.max) extrY.max = fp.y;
        }

        if(extrX.max - extrX.min < 2 || extrY.max - extrY.min < 2) 
            return _fillPointsResult;

        // 3. Check all points
        for(let r = extrY.min+1; r  < extrY.max; r++){
            for(let c = extrX.min+1;c < extrX.max; c++){
                let p = {x: c, y: r};
                // 3.0 Check fill
                if(matrix[p.y][p.x] != undefined && matrix[p.y][p.x].filled)
                    continue;

                if(params.type == 'line' && !pointInsidePoligon(p, cornerPoints))
                    continue;

                // 3.1 Check boundaries
                let checkedPoints = checkBoundaries(p);

                // 3.2 no boundaries
                if(isBoolean(checkedPoints) && checkedPoints === false)
                    continue;

                // 3.3 Fill point and checked points
                matrix[p.y][p.x] = { filled: true };
                this.setPixel(p.x, p.y);
                _fillPointsResult.push({x: p.x, y: p.y})

                for(let cp of checkedPoints){
                    matrix[cp.y][cp.x] = { filled: true };
                    this.setPixel(cp.x, cp.y);
                    _fillPointsResult.push({x: cp.x, y: cp.y})
                }
                
            }
        }

        return _fillPointsResult;
    }

}

var PP = PerfectPixel;

PP.createInstance = function(size, options = {}) {
    let pp = undefined;

    if(!size)
        size = V2.one;

    createCanvas(size, (ctx, _size, hlp) => {
        pp = new PP({ctx, ...options});
    })

    return pp;
}

PP.createNonDrawingInstance = function() {
    return PP.createInstance(V2.one, { modifyContext: false });
}

PP.getLayerByName = function(model, name) {
    if(!model || !model.main || !model.main.layers)
        return;
        
    return model.main.layers.find(l => l.name == name || l.id == name);
}

PP.createImage = function(model, params = {}) {
    if(model == undefined)
        throw 'PP.createImage model is undefined!';
        
    let {general, main} = model;

    params = assignDeep({}, {
        renderOnly: [], 
        exclude: [],
        colorsSubstitutions: {},
        forceVisivility: {},
        forceVisibility: {},
        positionModifier: undefined,
        layerSeparateCanvas: false,
    }, params);

    if(isEmpty(params.forceVisivility) && !isEmpty(params.forceVisibility)) {
        params.forceVisivility = params.forceVisibility
    }

    // let renderPattern = (pp, patternType, filledPoints) => {
    //     if(!patternType){
    //         patternType = 'type1';
    //     }

    //     for(let i = 0; i < filledPoints.length; i++){
    //         let up = filledPoints[i];

    //         if(patternType == 'type1'){
    //             let shift = up.y %2 == 0;
    //             if((shift && up.x % 2 != 0) || (!shift && up.x%2 == 0)){
    //                 pp.setPixel(up.x, up.y);
    //             }
    //         }
    //         else if(patternType == 'type2'){
    //             if((up.y+1) % 2 == 0 && up.x % 2 == 0) {
    //                 pp.setPixel(up.x, up.y);
    //             }
    //         }
    //         else if(patternType == 'type2_y1'){
    //             if((up.y) % 2 == 0 && up.x % 2 == 0) {
    //                 pp.setPixel(up.x, up.y);
    //             }
    //         }
    //         else if(patternType == 'type3'){
    //             if(up.y % 4 == 0 && up.x % 4 == 0) {
    //                 pp.setPixel(up.x, up.y);
    //             }
    //         }  
    //     }
    // }

    let renderGroup = (pp, hlp, group) => {

        if(group.groupType == 'gradient') {
            //console.log('gradient rendering is under construction')
            let rgb = colors.colorTypeConverter({ value: group.color, fromType: 'hex', toType: 'rgb' });
            let colorPrefix = `rgba(${rgb.r},${rgb.g}, ${rgb.b},`

            group.center = V2.objToV2(group.center)
            group.radius = V2.objToV2(group.radius)
            group.origin = V2.objToV2(group.origin)

            if(group.radius.equal(V2.zero))
                return;

            scenesHelper.createGradient({ 
                hlp, aValueMul: group.aValueMul, center: group.center, radius: group.radius, gradientOrigin: group.origin, size: V2.zero, 
                colorPrefix, easingType: group.easingType, easingMethod: group.easingMethod, angle: group.angle, verticalCut: undefined,
                useValueType: group.useValueType
             })

            return;
        }

        let strokeColor = group.strokeColor;
        let scOpacity = group.strokeColorOpacity != undefined && group.strokeColorOpacity < 1;

        if(scOpacity){
            strokeColor = `rgba(${hexToRgb(group.strokeColor)},${group.strokeColorOpacity})`;
        }

        let fillColor = group.fillColor;
        if(group.fillColorOpacity !=undefined && group.fillColorOpacity < 1){
            fillColor = `rgba(${hexToRgb(group.fillColor)},${group.fillColorOpacity})`;
        }

        if(!isEmpty(params.colorsSubstitutions)){
            let cSubst = params.colorsSubstitutions[Object.keys(params.colorsSubstitutions).find(key => key.toLowerCase() === group.strokeColor.toLowerCase())]
            if(cSubst){
                let substOpacity = cSubst.opacity;
                if(substOpacity == undefined){
                    substOpacity = group.strokeColorOpacity;
                }

                if(!cSubst.keepStrokeColor){
                    strokeColor = `rgba(${hexToRgb(cSubst.color)},${substOpacity})`;
                }

                if(cSubst.changeFillColor){
                    fillColor = strokeColor;
                }
            }
        }

        pp.setFillStyle(strokeColor)
        pp.clear = group.clear;
        pp.replace = group.replace;

        if(group.type == 'dots'){
            for(let po of group.points){
                pp.setPixel(po.point.x, po.point.y);    
            }
        }
        else if(group.type == 'curve') {
            if(group.points.length == 1){
                pp.setPixel(group.points[0].point.x, group.points[0].point.y);
            }
            else if(group.points.length > 1){
                if(scOpacity || (group.fillPattern)){
                    pp.setFillStyle('rgba(0,0,0,0)');
                }

                let filledPixels = [];
                let curvePoints = mathUtils.getCurvePointsMain({points: group.points.map(p => p.point), isClosed: group.closePath, numOfSegments: group.numOfSegments || 16 });
                //let distinctCurvePoints = distinct(curvePoints.map(p => p.toInt()), (p) => p.x + '_' + p.y);

                for(let i = 1; i < curvePoints.length; i++) {
                    filledPixels= [...filledPixels, ...pp.lineV2(curvePoints[i-1], curvePoints[i])];
                }

                if(group.closePath){
                    let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

                    if(group.fill){
                        if(group.fillPattern){
                            let filledPoints = pp.fill(uniquePoints, uniquePoints, { type: 'line' });
                            pp.setFillStyle(fillColor);

                            pp.renderPattern(group.patternType, filledPoints);
                        }
                        else {
                            if(scOpacity){
                                pp.setFillStyle(strokeColor);
                                uniquePoints.forEach(p => pp.setPixel(p.x,p.y));
                            }

                            pp.setFillStyle(fillColor)
                            pp.fill(uniquePoints, uniquePoints, { type: 'line' })
                        }
                    }
                    else {
                        if(scOpacity){
                            pp.setFillStyle(strokeColor);
                            uniquePoints.forEach(p => pp.setPixel(p.x,p.y));
                        }
                    }
                }
                else {
                    if(scOpacity){
                        pp.setFillStyle(strokeColor);
                        distinct(filledPixels, (p) => p.x+'_'+p.y).forEach(p => pp.setPixel(p.x,p.y));
                    }
                }
            }
        }
        else if(group.type == 'lines'){
            if(group.points.length == 1){
                pp.setPixel(group.points[0].point.x, group.points[0].point.y);
            }
            else if(group.points.length > 1){
                if(scOpacity || (group.fillPattern)){
                    pp.setFillStyle('rgba(0,0,0,0)');
                }
                
                let filledPixels = [];
                let p = group.points;
                for(let i = 0; i < group.points.length;i++){
                    if(i < p.length-1)
                        filledPixels= [...filledPixels, ...pp.lineV2(p[i].point, p[i+1].point)];
                }

                if(group.closePath){
                    filledPixels = [...filledPixels, ...pp.lineV2(p[p.length-1].point, p[0].point)];
                    let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

                    if(!group.fillPattern){
                        if(scOpacity){
                            pp.setFillStyle(strokeColor);
                            uniquePoints.forEach(p => pp.setPixel(p.x,p.y));
                        }
                    }
                    
                    if(group.fill){
                        if(group.fillPattern){
                            let filledPoints = pp.fill(uniquePoints, p.map(p => p.point));
                            
                            pp.setFillStyle(fillColor);
                            pp.renderPattern(group.patternType, filledPoints);
                        }
                        else {
                            pp.setFillStyle(fillColor)
                            pp.fill(uniquePoints, p.map(p => p.point))//, _fillPoints)
                        }
                    }
                }
                else {
                    if(scOpacity){
                        pp.setFillStyle(strokeColor);
                        distinct(filledPixels, (p) => p.x+'_'+p.y).forEach(p => pp.setPixel(p.x,p.y));
                    }
                }
            }
        }
    }

    let renderFrame =  (main) => {
        return createCanvas(general.size, (ctx, size, hlp1) => {
            let pp = new PerfectPixel({context: ctx, positionModifier: params.positionModifier});
            for(let layer of main.layers.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
                if(params.forceVisivility[layer.name]) {
                    if(!params.forceVisivility[layer.name].visible)
                        continue;
                }
                else 
                    if(layer.visible != undefined && layer.visible == false)
                        continue;
    
                if(params.renderOnly.length > 0){
                    if(params.renderOnly.indexOf(layer.name || layer.id) == -1)
                        continue;
                }
                else if(params.exclude.length > 0) {
                    if(params.exclude.indexOf(layer.name || layer.id) != -1)
                        continue;
                }

                let __pp = pp;
                let __hlp = hlp1;
                let layerImg = undefined;
                if(params.layerSeparateCanvas) {
                    layerImg = createCanvas(general.size, (ctx, size, hlp2) => {
                        __pp = new PP({context: ctx, positionModifier: params.positionModifier})
                        __hlp = hlp2;
                    })
                }

                if(layer.groups){
                    //for(let g = 0; g < layer.groups.length; g++){
                    for(let group of layer.groups.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
                        if(group.visible != undefined && group.visible == false)
                            continue;
    
                        renderGroup(__pp, __hlp, group)
                    }
                }
                else {
                    renderGroup(__pp, __hlp, layer);
                }

                if(layerImg) {
                    ctx.drawImage(layerImg, 0,0);
                    layerImg = undefined;
                }
            }
        })
    }

    if(general.animated){
        if(isArray(main)){
            return main.map(m => renderFrame(m))
        }
        
        throw 'PP -> main should be array if general.animated = true'
    }
    else {
        return renderFrame(main);
    }


    // return createCanvas(general.size, (ctx, size) => {
    //     let pp = new PerfectPixel({context: ctx});
    //     for(let layer of main.layers.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
    //         if(layer.visible != undefined && layer.visible == false)
    //             continue;

    //         if(layer.groups){
    //             //for(let g = 0; g < layer.groups.length; g++){
    //             for(let group of layer.groups.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
    //                 if(group.visible != undefined && group.visible == false)
    //                     continue;

    //                 renderGroup(pp, group)
    //             }
    //         }
    //         else {
    //             renderGroup(pp, layer);
    //         }
    //     }
    // });
 }

 

 PP.createText = function({ font = 'minifont', text = '', color = '#FF0000', sizeMultiplier = 1, gapWidth = 1 }) {
    let fontProps = PP.pixelFonts[font];
    if(fontProps == undefined)
        throw `Pixel font for type ${font} not found`;

    if(gapWidth == undefined){
        gapWidth = 1;
    }

    let width = 0;
    for(let i = 0; i < text.length; i++){
        let letterWidth = fontProps.originalSize.x;
        let letterProps = fontProps.letters[text[i]];
        if(letterProps && letterProps.general && letterProps.general.size) {
            letterWidth = letterProps.general.size.x;
        }

        width+=letterWidth + gapWidth;
    }

    let baseImgSize = new V2(width, fontProps.originalSize.y);

    let targetSize = baseImgSize.mul(sizeMultiplier);
    let baseImg = createCanvas(baseImgSize, (ctx, size) => {
        let currentX = 0;
        for(let i = 0; i < text.length; i++){
            let letterProps = fontProps.letters[text[i]];
            let letterWidth = fontProps.originalSize.x;
            if(letterProps.general && letterProps.general.size) {
                letterWidth = letterProps.general.size.x;
            }

            if(letterProps) {
                if(!letterProps.img){
                    letterProps.img = {};
                }
    
                if(!letterProps.img[color]){
                    let letterModel = assignDeep({}, fontProps.commonGeneral(), letterProps)

                    letterModel.main.layers.forEach((l,i) => {
                        assignDeep(l, fontProps.layerCommon())
                        l.id = `m_${i}`
                        l.groups.forEach((g,j) => {
                            assignDeep(g, fontProps.groupCommon())
                            g.id = `m_${i}_g_${j}`
                            g.strokeColor = color;
                            g.fillColor = color;
                        })
                    });

                    letterProps.img[color] = PP.createImage(letterModel) 
                }
                
                ctx.drawImage(letterProps.img[color], currentX, 0)
            }
                
            currentX+=letterWidth + gapWidth;
        }
    });

    return {
        size: targetSize,
        img: targetSize > 1 ? createCanvas(targetSize, (ctx, size) => {
            ctx.drawImage(baseImg, 0,0, size.x, size.y);
        }) : baseImg
    }
 }