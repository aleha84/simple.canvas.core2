class TileMapScene extends Scene {
    constructor(options = {}){
        super(options);

        this.size = new V2(10,10);
        let defaultSourceTileSize = new V2(32,32);

        this.ts = new TileSet({
            imgPropertyName: 'terrain_atlas',
            tileSize: new V2(25,25),
            tilesMappings: terrainAtlasMappings(defaultSourceTileSize),
            // {
                
            //     'cs': {
            //         destSourcePosition: new V2(),
            //         destSourceSize: new V2(20,20)
            //     },
            //     'gs': {
            //         destSourcePosition: new V2(20,0),
            //         destSourceSize: new V2(20,20)
            //     },
            //     'lamp': {
            //         destSourcePosition: new V2(0,21),
            //         destSourceSize: new V2(21,68),
            //         noTileAdjustment: true,
            //         size: new V2(21,68)
            //     }
            // },
            tilesMatrix: this.matrixGenerator(),
            // [
            //     ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
            //     ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
            //     ['cs', 'cs', {type: 'gs', children: [{type: 'lamp', position: new V2(12.5,12.5)}]}, 'gs', 'cs', 'cs'],
            //     ['cs', 'cs', 'gs', 'gs', 'cs', 'cs'],
            //     ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
            //     ['cs', 'cs', 'cs', 'cs', 'cs', 'cs']
            // ],
            scene: this
        });
    }

    matrixGenerator(){
        //initial layer 0
        var result = new Array(this.size.y);
        for(let rowIndex = 0; rowIndex < this.size.y; rowIndex++){
            result[rowIndex] = new Array(this.size.x);
            for(let columnIndex = 0; columnIndex < this.size.x; columnIndex++){
                result[rowIndex][columnIndex] = { type: 'greenBackCentral' }
            }
        }

        //highgrasslayer 0
        let vertices = [new V2(3,3), new V2(7,4), new V2(4,7)]
        let leftPoints = [];
        let allBordeerPoints = [];
        let maxX = Math.max.apply(null, vertices.map(v => v.x));
        //draw lines
        for(let vi = 0; vi < vertices.length; vi++){
            let from = vertices[vi];
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
                result[point.y][point.x] = { type: 'waterOutBackCentral' };
            }
        }

        // fill central
        this.fillPoligon({ type: 'waterOutBackCentral' }, leftPoints.filter(p => p !== undefined), maxX, result);

        //set border images
        // for(let bi = 0; bi < allBordeerPoints.length; bi++){
        //     let borderPoint = allBordeerPoints[bi];
        //     let bpType = all
        // }


        return result;
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