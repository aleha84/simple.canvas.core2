class TileMapScene extends Scene {
    constructor(options = {}){

        options = assignDeep({}, {
            scrollOptions: {
                enabled: true,
                zoomEnabled: true,
                restrictBySpace: false,
            }
        }, options);

        super(options);

        this.size = new V2(20,10);
        let defaultSourceTileSize = new V2(32,32);

        this.ts = new TileSet({
            imgPropertyName: 'terrain_atlas',
            tileSize: new V2(25,25),
            tilesMappings: terrainAtlasMappings(defaultSourceTileSize),
            
            tilesMatrix: this.matrixGenerator('greenBackCentral'),
            
            scene: this
        });
    }

    matrixGenerator(initialType){
        //initial layer 0
        var result = new Array(this.size.y);
        for(let rowIndex = 0; rowIndex < this.size.y; rowIndex++){
            result[rowIndex] = new Array(this.size.x);
            for(let columnIndex = 0; columnIndex < this.size.x; columnIndex++){
                result[rowIndex][columnIndex] = { type: initialType, children: [] }
            }
        }

        let vertices = [new V2(3,3), new V2(7,4), new V2(4,7)]
        this.generatePoligon('water', vertices, result);

        //[new V2(13,3), new V2(17,4), new V2(14,7)]
        vertices = [new V2(15,2), new V2(13,5), new V2(16,8)]
        this.generatePoligon('water', vertices, result, false); 
        
        // vertices = [new V2(13,5), new V2(17,5)]
        // this.generatePoligon('water', vertices, result, false); 

        return result;
    }

    generatePoligon(typePrefix, vertices, resultMatrix, fill = true) {
        let leftPoints = [];
        let allBordeerPoints = [];
        let maxX = Math.max.apply(null, vertices.map(v => v.x));
        //draw lines
        for(let vi = 0; vi < vertices.length; vi++){
            let from = vertices[vi];
            if(!fill && vi == vertices.length - 1)
                break;

            let to = (vi == vertices.length - 1 ? vertices[0] : vertices[vi+1]);

            let deltas = new V2(to.x - from.x, to.y - from.y);
            let maxDelta = Math.max(Math.abs(deltas.x), Math.abs(deltas.y));
            let step = new V2(deltas.x/maxDelta, deltas.y/maxDelta);
            let current = from.clone();
            //result[from.y][from.x] = { type: 'highGrassCentral' };
            for(let i = 0; i < maxDelta;i++){
                current = current.add(step);
                
                let point = new V2(Math.round(current.x), Math.round(current.y))

                if(leftPoints[point.y] === undefined){
                    leftPoints[point.y] = point;
                }else {
                    if(point.x < leftPoints[point.y].x){
                        leftPoints[point.y] = point;
                    }
                }

                allBordeerPoints.push(point);
                resultMatrix[point.y][point.x] = { type: `${typePrefix}OutBackCentral`, children: [] };
            }
        }

        // fill central
        if(fill)
            this.fillPoligon({ type: `${typePrefix}OutBackCentral`, children: [] }, leftPoints.filter(p => p !== undefined), maxX, resultMatrix);

        //set border images
        let allNearbyPoints = [];
        for(let bi = 0; bi < allBordeerPoints.length; bi++){
            let borderPoint = allBordeerPoints[bi];
            this.getNearByPoint(borderPoint.y-1, borderPoint.x-1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //tl
            this.getNearByPoint(borderPoint.y-1, borderPoint.x, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //t
            this.getNearByPoint(borderPoint.y-1, borderPoint.x+1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //tr
            this.getNearByPoint(borderPoint.y, borderPoint.x+1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //r
            this.getNearByPoint(borderPoint.y+1, borderPoint.x+1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //br
            this.getNearByPoint(borderPoint.y+1, borderPoint.x, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //b
            this.getNearByPoint(borderPoint.y+1, borderPoint.x-1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //bl
            this.getNearByPoint(borderPoint.y, borderPoint.x-1, `${typePrefix}OutBackCentral`, allNearbyPoints, resultMatrix); //l
        }

        for(let pi= 0;pi < allNearbyPoints.length;pi++){
            let nearbyPoint = allNearbyPoints[pi];
            let n = this.getNeighbors(nearbyPoint, `${typePrefix}OutBackCentral`, resultMatrix);
            if(               n.t &&          !n.r && !n.br && !n.b &&           n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}InBackTopLeft`, children: [] }) }
            else if(          n.t &&           n.r &&          !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}InBackTopRight`, children: [] }) }
            else if(!n.tl && !n.t &&           n.r &&           n.b &&          !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}InBackBottomRight`, children: [] }) }
            else if(         !n.t && !n.tr && !n.r &&           n.b &&           n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}InBackBottomLeft`, children: [] }) }
            else if( n.tl && !n.t && !n.tr && !n.r && !n.br && !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackBottomRight`, children: [] }) }
            else if(!n.tl && !n.t &&  n.tr && !n.r && !n.br && !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackBottomLeft`, children: [] }) }
            else if(!n.tl && !n.t && !n.tr && !n.r &&  n.br && !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackTopLeft`, children: [] }) }
            else if(!n.tl && !n.t && !n.tr && !n.r && !n.br && !n.b &&  n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackTopRight`, children: [] }) }
            else if(!n.tl && !n.t &&           n.r &&          !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackLeft`, children: [] }) }
            else if(         !n.t && !n.tr && !n.r && !n.br && !n.b &&           n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackRight`, children: [] }) }
            else if(          n.t &&          !n.r && !n.br && !n.b && !n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackBottom`, children: [] }) }
            else if(!n.tl && !n.t && !n.tr && !n.r &&           n.b &&          !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackTop`, children: [] }) }
            else if(          n.t &&           n.r &&           n.b                 ) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackCentral`, children: [] }) }
            else if(         !n.t &&  n.tr && !n.r &&  n.br && !n.b                 ) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackLeft`, children: [] }) }
            else if(          n.t &&                            n.b &&           n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackCentral`, children: [] }) }
            else if( n.tl && !n.t &&                           !n.b &&  n.bl && !n.l) { resultMatrix[nearbyPoint.y][nearbyPoint.x].children.push({ type: `${typePrefix}OutBackRight`, children: [] }) }
        }
    }

    getNeighbors(point, type, matrix){
        let check = (p) =>  {
            if(matrix[p.y] === undefined || matrix[p.y][p.x] === undefined)
                return undefined;

            return matrix[p.y][p.x].type === type;
        }
        return {
            tl: check(new V2(point.x-1,point.y-1)),
            t:  check(new V2(point.x,point.y-1)),
            tr: check(new V2(point.x+1,point.y-1)),
            r:  check(new V2(point.x+1,point.y)),
            br: check(new V2(point.x+1,point.y+1)),
            b:  check(new V2(point.x,point.y+1)),
            bl: check(new V2(point.x-1,point.y+1)),
            l:  check(new V2(point.x-1,point.y))
        }
    }

    getNearByPoint(row, column, type, allPoints, matrix) {
        if(matrix[row] === undefined || matrix[row][column] === undefined)
            return;

        if(matrix[row][column].type === type)
            return;
        
        var _np = new V2(column, row);
        if(allPoints.filter(p => p.equal(_np)).length === 0){
            allPoints.push(_np);
        }
    }

    fillPoligon(type, leftPoints, maxRightX, matrix){
        for(let lpi = 0; lpi< leftPoints.length;lpi++){
            let leftPoint = leftPoints[lpi];
            if(leftPoint.x === maxRightX || leftPoint.x === maxRightX - 1)
                continue;
            
            let gaps = [];
            let from = leftPoint.x, to = undefined;
            for(let x = leftPoint.x+1; x < maxRightX; x++){
                if(from === undefined){
                    from = x;
                    continue;
                }

                if(matrix[leftPoint.y][x].type !== type.type)
                    continue;
                else {
                    if(x-from === 1){
                        from = x;
                        continue;
                    }
                    else {
                        gaps.push({ from: from, to: x });
                        from = x;
                    }
                }
            }

            if(!gaps.length)
                continue;
            else {
                for(let gi = 0; gi < gaps.length;gi++){
                    let gap = gaps[gi];
                    for(let column = gap.from+1;column < gap.to; column++){
                        matrix[leftPoint.y][column] = type;
                    }
                }
            }
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'lightgray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}