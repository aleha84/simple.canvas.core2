class PerfectPixel {
    constructor(options = {}){
        this.fillStyleProvider = undefined;
        
        assignDeep(this, {
            fillStyleProvider: undefined
        }, options)

        if(this.ctx ==- undefined && this.context === undefined){
            console.trace();
            throw 'PerfectPixel -> context is not defined';
        }

        if(this.context){
            this.ctx = this.context;
        }
        
        this.context = this.ctx;
    }
    setFillStyle(color){
        this.ctx.fillStyle = color;
    }
    setPixel(x, y){
        if(this.fillStyleProvider)
            this.ctx.fillStyle = this.fillStyleProvider(x, y);

        if(this.clear){
            this.removePixel(x,y);
        }
        else {
            this.ctx.fillRect(x,y, 1,1);
        }
        
    }
    removePixel(x,y){
        this.ctx.clearRect(x, y, 1,1);
    }
    lineV2(p1, p2){
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
        
        return this.line(p1.x, p1.y, p2.x, p2.y);
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
        x0 = fastRoundWithPrecision(x0, 0);
        y0 = fastRoundWithPrecision(y0, 0);
        x1 = fastRoundWithPrecision(x1, 0);
        y1 = fastRoundWithPrecision(y1, 0);
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
     
     fillByCornerPoints(cornerPoints) {
         if(cornerPoints.length < 3)
            throw 'fillByCornerPoints -> cornerPoints should be 3 or more!';

        let filledPixels = [];
        for(let i = 0; i < cornerPoints.length;i++){
            if(i < cornerPoints.length-1)
                filledPixels= [...filledPixels, ...this.lineV2(cornerPoints[i], cornerPoints[i+1])];
        }

        filledPixels = [...filledPixels, ...this.lineV2(cornerPoints[cornerPoints.length-1], cornerPoints[0])];
        let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

        return this.fill(uniquePoints, cornerPoints)
     }

     fill(filledPoints, cornerPoints) {//, _fillPoints) {
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

                if(!pointInsidePoligon(p, cornerPoints))
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

PP.createImage = function(model, params = {}) {
    let {general, main} = model;

    params = assignDeep({}, {
        renderOnly: [], 
        exclude: [],
        colorsSubstitutions: {},
    }, params);

    let renderGroup = (pp, group) => {
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
            let cSubst = params.colorsSubstitutions[Object.keys(params.colorsSubstitutions).find(key => key.toLowerCase() === strokeColor.toLowerCase())]
            if(cSubst){
                let substOpacity = cSubst.opacity;
                if(substOpacity == undefined){
                    substOpacity = group.strokeColorOpacity;
                }
                strokeColor = `rgba(${hexToRgb(cSubst.color)},${substOpacity})`;
            }
        }

        pp.setFillStyle(strokeColor)
        pp.clear = group.clear;

        if(group.type == 'dots'){
            for(let po of group.points){
                pp.setPixel(po.point.x, po.point.y);    
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
                            let patternType = group.patternType;
                            if(!patternType){
                                patternType = 'type1';
                            }

                            for(let i = 0; i < filledPoints.length; i++){
                                let up = filledPoints[i];

                                if(patternType == 'type1'){
                                    let shift = up.y %2 == 0;
                                    if((shift && up.x % 2 != 0) || (!shift && up.x%2 == 0)){
                                        pp.setPixel(up.x, up.y);
                                    }
                                }
                                else if(patternType == 'type2'){
                                    if((up.y+1) % 2 == 0 && up.x % 2 == 0) {
                                        pp.setPixel(up.x, up.y);
                                    }
                                }
                                else if(patternType == 'type3'){
                                    if(up.y % 4 == 0 && up.x % 4 == 0) {
                                        pp.setPixel(up.x, up.y);
                                    }
                                }
                                
                            }
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
        return createCanvas(general.size, (ctx, size) => {
            let pp = new PerfectPixel({context: ctx});
            for(let layer of main.layers.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
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

                if(layer.groups){
                    //for(let g = 0; g < layer.groups.length; g++){
                    for(let group of layer.groups.sort((a,b) => { return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); })) {
                        if(group.visible != undefined && group.visible == false)
                            continue;
    
                        renderGroup(pp, group)
                    }
                }
                else {
                    renderGroup(pp, layer);
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

 PP.pixelFonts = {
     "vorpos": {
         "normal": {
            "properties": {
                "baseSize": new V2(7,7),
                "gap": 1,
                "common": () => ({"general":{"originalSize":{"x":7,"y":7},"size":{"x":7,"y":7},"zoom":10,"showGrid":false},"main":{"layers":[]}}),
                "layerCommon": () => ({"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[]})
            },
            "A": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":0,"y":3}}]}], img: undefined},
            "a": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":0,"y":3}}]}], img: undefined},
            "B": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":2}},{"point":{"x":5,"y":3}},{"point":{"x":0,"y":3}}]},{"order":1,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":4}}]}], img: undefined},
            "b": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":2}},{"point":{"x":5,"y":3}},{"point":{"x":0,"y":3}}]},{"order":1,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":4}}]}], img: undefined},
            "C": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "c": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "D": {layers: [{"closePath":true,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":1}},{"point":{"x":5,"y":0}}]}], img: undefined},
            "d": {layers: [{"closePath":true,"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":1}},{"point":{"x":5,"y":0}}]}], img: undefined},
            "E": {layers: [{"points":[{"point":{"x":6,"y":6}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":0,"y":2}},{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "e": {layers: [{"points":[{"point":{"x":6,"y":6}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":0,"y":2}},{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "F": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}}]},{"order":1,"points":[{"point":{"x":4,"y":3}},{"point":{"x":1,"y":3}}]}], img: undefined},
            "f": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}}]},{"order":1,"points":[{"point":{"x":4,"y":3}},{"point":{"x":1,"y":3}}]}], img: undefined},
            "G": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":3,"y":3}}]}], img: undefined},
            "g": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":3,"y":3}}]}], img: undefined},
            "H": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":6,"y":3}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "h": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":6,"y":3}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "I": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":3,"y":0}},{"point":{"x":3,"y":6}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "i": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":3,"y":0}},{"point":{"x":3,"y":6}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "J": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":0,"y":6}}]}], img: undefined},
            "j": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":0,"y":6}}]}], img: undefined},
            "K": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "k": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "L": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "l": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "M": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":2,"y":0}},{"point":{"x":3,"y":1}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}}]},{"order":1,"type":"dots","points":[{"point":{"x":3,"y":2}},{"point":{"x":3,"y":3}}]}], img: undefined},
            "m": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":2,"y":0}},{"point":{"x":3,"y":1}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}}]},{"order":1,"type":"dots","points":[{"point":{"x":3,"y":2}},{"point":{"x":3,"y":3}}]}], img: undefined},
            "N": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "n": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "O": {layers: [{"points":[{"point":{"x":0,"y":5}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":1,"y":6}}]}], img: undefined},
            "o": {layers: [{"points":[{"point":{"x":0,"y":5}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":1,"y":6}}]}], img: undefined},
            "P": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":3}},{"point":{"x":1,"y":3}}]}], img: undefined},
            "p": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":3}},{"point":{"x":1,"y":3}}]}], img: undefined},
            "Q": {layers: [{"points":[{"point":{"x":3,"y":6}},{"point":{"x":3,"y":4}}]},{"order":1,"points":[{"point":{"x":5,"y":5}},{"point":{"x":1,"y":5}},{"point":{"x":0,"y":4}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":4}}]}], img: undefined},
            "q": {layers: [{"points":[{"point":{"x":3,"y":6}},{"point":{"x":3,"y":4}}]},{"order":1,"points":[{"point":{"x":5,"y":5}},{"point":{"x":1,"y":5}},{"point":{"x":0,"y":4}},{"point":{"x":0,"y":1}},{"point":{"x":1,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":4}}]}], img: undefined},
            "R": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":2}},{"point":{"x":5,"y":3}},{"point":{"x":1,"y":3}}]},{"order":1,"points":[{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "r": {layers: [{"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":0}},{"point":{"x":5,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":6,"y":2}},{"point":{"x":5,"y":3}},{"point":{"x":1,"y":3}}]},{"order":1,"points":[{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "S": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":4}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":0,"y":6}}]}], img: undefined},
            "s": {layers: [{"points":[{"point":{"x":6,"y":0}},{"point":{"x":1,"y":0}},{"point":{"x":0,"y":1}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":4}},{"point":{"x":6,"y":5}},{"point":{"x":5,"y":6}},{"point":{"x":0,"y":6}}]}], img: undefined},
            "T": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":3,"y":0}},{"point":{"x":3,"y":6}}]}], img: undefined},
            "t": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":3,"y":0}},{"point":{"x":3,"y":6}}]}], img: undefined},
            "U": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "u": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "V": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":3}},{"point":{"x":3,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "v": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":3}},{"point":{"x":3,"y":6}},{"point":{"x":6,"y":3}},{"point":{"x":6,"y":0}}]}], img: undefined},
            "W": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":2,"y":6}},{"point":{"x":3,"y":5}},{"point":{"x":4,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":3,"y":5}},{"point":{"x":3,"y":2}}]}], img: undefined},
            "w": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":5}},{"point":{"x":1,"y":6}},{"point":{"x":2,"y":6}},{"point":{"x":3,"y":5}},{"point":{"x":4,"y":6}},{"point":{"x":5,"y":6}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":3,"y":5}},{"point":{"x":3,"y":2}}]}], img: undefined},
            "X": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":4}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "x": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":0,"y":6}},{"point":{"x":0,"y":4}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":4}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "Y": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":3,"y":3}},{"point":{"x":3,"y":6}}]}], img: undefined},
            "y": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":0,"y":2}},{"point":{"x":1,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":6,"y":0}}]},{"order":1,"points":[{"point":{"x":3,"y":3}},{"point":{"x":3,"y":6}}]}], img: undefined},
            "Z": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":4,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":0,"y":5}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined},
            "z": {layers: [{"points":[{"point":{"x":0,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":1}},{"point":{"x":4,"y":3}},{"point":{"x":2,"y":3}},{"point":{"x":0,"y":5}},{"point":{"x":0,"y":6}},{"point":{"x":6,"y":6}}]}], img: undefined}
         }
     }
 }

 PP.createText = function({ font = 'vorpos', text = '', color = '#FF0000', size = 7, gap = 1, weight = 'normal' }) {
    let fontProps = PP.pixelFonts[font];
    if(fontProps == undefined)
        throw `Pixel font for type ${font} not found`;

    fontProps = fontProps[weight];

    if(fontProps == undefined)
        throw `Pixel font for type ${font} and weight ${weight} not found`;

    if(gap == undefined){
        gap = fontProps.properties.gap;
    }

    let baseWidth = text.length*fontProps.properties.baseSize.x + (text.length-1)*fontProps.properties.gap;
    let targetSize = new V2(text.length*size+ (text.length-1)*gap, text.length*size);
    let baseImgSize = new V2(baseWidth, fontProps.properties.baseSize.y);
    let baseImg = createCanvas(baseImgSize, (ctx, size) => {
        let currentX = 0;
        for(let i = 0; i < text.length; i++){
            let letterProps = fontProps[text[i]];
            if(!letterProps){
                currentX+=fontProps.properties.width + fontProps.properties.gap;
                continue;
            }
                

            if(!letterProps.img){
                letterProps.img = {};
            }

            if(!letterProps.img[color]){
                let letterModel = fontProps.properties.common();
                letterModel.main.layers = letterProps.layers.map(l => assignDeep({}, fontProps.properties.layerCommon(), l));
                letterModel.main.layers.forEach(l => { l.fillColor = color; l.strokeColor = color; });
                letterProps.img[color] = PP.createImage(letterModel) 
                //createCanvas(fontProps.properties.baseSize, (ctx, size) => { ctx.fillStyle = 'red'; ctx.fillRect(0,0,size.x, size.y) });
            }
            
            ctx.drawImage(letterProps.img[color], currentX, 0, fontProps.properties.baseSize.x, size.y);
            currentX+=fontProps.properties.baseSize.x + fontProps.properties.gap;
        }
    });

    return {
        size: targetSize,
        img: createCanvas(targetSize, (ctx, size) => {
            ctx.drawImage(baseImg, 0,0, size.x, size.y);
        })
    }
    // return {size: imgSize, img: createCanvas(imgSize, (ctx, size) => {
    //     let currentX = 0;
    //     for(let i = 0; i < text.length; i++){
    //         let letterModel = fontProps[text[i]];
    //         if(letterModel != undefined){
    //             letterModel.main.layers.forEach(l => { l.fillColor = color });
    //             ctx.drawImage(PP.createImage(letterModel), currentX, 0, fontProps.properties.width, size.y);
    //         }
                
            
    //         currentX+=fontProps.properties.width + fontProps.properties.gap;
    //     }
    // })};
 }