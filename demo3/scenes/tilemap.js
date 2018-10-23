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

        this.size = new V2(80,80);
        this.defaultSourceTileSize = new V2(32,32);

        this.ts = new TileSet({
            imgPropertyName: 'terrain_atlas',
            tileSize: new V2(25,25),
            tilesMappings: terrainAtlasMappings(this.defaultSourceTileSize),
            
            tilesMatrix: this.matrixGenerator('greenBackCentral'),
            
            scene: this
        });
    }

    treeNameGenerator(height, color, type){
        return `tree${height?height:(getRandomBool()?'Small':'Tall')}${color?color:(getRandomBool()?'Green':'Yellow')}${type?type:getRandomInt(1,2)}`;
    }

    childGenerator(countPerTile, tileSize, typeNameGenerator, shouldRender, spread = 4) {
        if(!shouldRender)
            shouldRender = () => true;

        if(isObject(countPerTile))
            countPerTile = getRandomInt(countPerTile.from, countPerTile.to);
        
        let xFromTo = new V2(-tileSize.x/spread, tileSize.x/spread)
        let yFromTo = new V2(-tileSize.y/spread, tileSize.y/spread)
        let result = [];

        if(shouldRender())
        {
            for(let i = 0; i < countPerTile; i++){
                result.push({ type: typeNameGenerator(), position: new V2().add(new V2(getRandomInt(xFromTo.x, xFromTo.y), getRandomInt(yFromTo.x, yFromTo.y))), children:[] });
            }
    
            result = result.sort((a, b) => {
                if(a.position.y > b.position.y)
                    return -1;
                
                if(a.position.y < b.position.y)
                    return 1;
    
                return 0;
            })
        }

        return result;
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

        // let vertices = [new V2(3,3), new V2(7,4), new V2(4,7)]
        // this.generatePoligon('water', vertices, result);

         this.generatePoligon('ground', [new V2(0,70), new V2(10,65), new V2(20,63), new V2(25,47), new V2(40,40), new V2(55,33), new V2(57,29), new V2(65,27), new V2(79,23), new V2(79,79), new V2(0,79)], result, true); 
         this.generatePoligon('desert', [new V2(35,79), new V2(33,72), new V2(35,64), new V2(37,63), new V2(43,60), new V2(46,54), new V2(65,48), new V2(79,55), new V2(79,79)], result, true);
        
        this.generatePoligon('water', [new V2(0,0), new V2(15,0), new V2(18,10), new V2(7,8), new V2(5,13), new V2(0,12)], result, true); 

        this.generatePoligon('water', [new V2(40,30), new V2(45,26), new V2(50, 25), new V2(55,26), new V2(65,35), new V2(67,40),
                                       new V2(68,47), new V2(75,50), new V2(76, 54), new V2(70,58), new V2(65,56), new V2(62,50), 
                                       new V2(45,54), new V2(40,51), new V2(38,40)], result, true); 

        this.generatePoligon('water', [new V2(50,0), new V2(45,10), new V2(52, 15), new V2(50,25)], result, false); 
        this.generatePoligon('water', [new V2(45,54), new V2(41,60), new V2(35,63), new V2(33,64), new V2(31,72), new V2(33,79)], result, false); 

        // this.generatePoligon('greenLowGrass', [new V2(20,1), new V2(25,3), new V2(27,8), new V2(21,6)], result, true); 
        this.fillPoligonWithItems(
            [new V2(18,0), new V2(35,0), new V2(40,10), new V2(30,15), new V2(21,12)], result, 
            () => this.treeNameGenerator('Small', 'Green'),  () => this.childGenerator(3, this.defaultSourceTileSize, () => this.treeNameGenerator('Small', 'Green')), true); 
        
        this.fillPoligonWithItems(
            [new V2(0,20), new V2(10,22), new V2(15,26), new V2(20,33), new V2(15,34), new V2(10, 28), new V2(2, 26)], result, 
            () => this.treeNameGenerator('Small', 'Green'),  () => this.childGenerator(2, this.defaultSourceTileSize, () => this.treeNameGenerator('Small')), true);
            
        this.fillPoligonWithItems(
            [new V2(0,55), new V2(6, 51), new V2(13, 54), new V2(10, 61), new V2(1, 66)], result, 
            () => this.treeNameGenerator('Small', 'Yellow'),  () => this.childGenerator(2, this.defaultSourceTileSize, () => this.treeNameGenerator('Small', 'Yellow')), true);

        this.fillPoligonWithItems(
            [new V2(32,22),new V2(37,20),new V2(36,19), new V2(42,18), new V2(47,21),new V2(44,24),new V2(37,27), new V2(32,25)], result, 
            () => this.treeNameGenerator('Small', 'Green'),  () => this.childGenerator(1, this.defaultSourceTileSize, () => this.treeNameGenerator('Small', 'Green')), true);

        this.fillPoligonWithItems(
            //[new V2(15,23), new V2(21, 23), new V2(21,29)], 
            [new V2(14,24), new V2(21,25), new V2(23,29), new V2(22,32), new V2(20,31), new V2(17, 28)],
            result,
            () => `stump${getRandomInt(1,5)}`,
            () => this.childGenerator(1, this.defaultSourceTileSize, () => `stump${getRandomInt(1,5)}`),
            true
        )

        this.fillPoligonWithItems(
            [new V2(29,16), new V2(34,14), new V2(38,16), new V2(38,19), new V2(35,22), new V2(31,21), new V2(28,20)],
            result,
            () => `stump${getRandomInt(1,5)}`,
            () => this.childGenerator(1, this.defaultSourceTileSize, () => `stump${getRandomInt(1,5)}`),
            true
        )

        this.fillPoligonWithItems(
            [new V2(6, 16),new V2(9, 12),new V2(16, 12),new V2(23, 17),new V2(23, 22),new V2(15, 22),new V2(9, 20)],
            result,
            () => `grass${getRandomInt(1,8)}`,
            () => this.childGenerator({from: 1, to: 3}, this.defaultSourceTileSize, () => `grass${getRandomInt(1,8)}`, () => getRandomInt(1,3) === 1, 2),
            true
        )

        this.fillPoligonWithItems(
            [new V2(0, 30),new V2(9, 31),new V2(17, 39),new V2(26, 40),new V2(23, 47),new V2(18, 54),new V2(9, 50),new V2(1, 49)],
            result,
            () => `grass${getRandomInt(1,8)}`,
            () => this.childGenerator({from: 1, to: 4}, this.defaultSourceTileSize, () => `grass${getRandomInt(1,8)}`, () => getRandomInt(1,6) === 1, 1),
            true
        );

        this.fillPoligonWithItems(
            [new V2(0, 14),new V2(3, 15),new V2(8, 15),new V2(8, 20),new V2(4, 21),new V2(0, 20)],
            result,
            () => `bush${getRandomInt(1,8)}`,
            () => this.childGenerator({from: 1, to: 3}, this.defaultSourceTileSize, () => `bush${getRandomInt(1,8)}`, undefined, 2),
            true
        );

        this.fillPoligonWithItems(
            [new V2(0, 26),new V2(4, 28),new V2(8, 29),new V2(11, 32),new V2(14, 35)],
            result,
            () => `bush${getRandomInt(1,8)}`,
            () => this.childGenerator({from: 6, to: 10}, this.defaultSourceTileSize, () => `bush${getRandomInt(1,8)}`, undefined, 3),
            false
        );

        

        return result;
    }

    fillPoligonWithItems(vertices, resultMatrix, typeNameGenerator, itemsGenerator, fill = true){
        let allBordeerPoints = [];
        let leftPoints = [];
        let filledPoints = [];
        let that = this;
        let fillPoint = function(point, type){
            if(filledPoints.filter((p) => p.equal(point)).length !== 0)
                return false;;
            
            if(!resultMatrix[point.y] || !resultMatrix[point.y][point.x])
                return false;
              
            if(!itemsGenerator)
                resultMatrix[point.y][point.x].children.push({type: type, children:[]});
            else {
                let items = itemsGenerator();
                for(let ii = 0; ii < items.length;ii++){
                    resultMatrix[point.y][point.x].children.push(that.cloneType(items[ii]));//{type: items[ii], children:[]});
                }
            }

            filledPoints.push(point);

            return true;
        }
        let fillNeigborsWithChildren = function(point) {
            if(!fillPoint(point, typeNameGenerator()))
                return;

            fillNeigborsWithChildren(new V2(point.x+1, point.y));
            fillNeigborsWithChildren(new V2(point.x, point.y+1));
            fillNeigborsWithChildren(new V2(point.x-1, point.y));
            fillNeigborsWithChildren(new V2(point.x, point.y-1));
        }

        for(let vi = 0; vi < vertices.length; vi++){
            if(!fill && vi == vertices.length - 1){
                break;
            }

            let from = vertices[vi];
            
            let to = (vi == vertices.length - 1 ? vertices[0] : vertices[vi+1]);

            let deltas = new V2(to.x - from.x, to.y - from.y);
            let maxDelta = Math.max(Math.abs(deltas.x), Math.abs(deltas.y));
            let step = new V2(deltas.x/maxDelta, deltas.y/maxDelta);
            let current = from.clone();

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
                fillPoint(point, typeNameGenerator());
                allBordeerPoints.push(point);
            }
        }

        if(!fill)
            return;

        leftPoints = leftPoints.filter(p => p !== undefined);
        let notFilledPoint = undefined;
        for(let lpi = 0; lpi< leftPoints.length;lpi++){
            notFilledPoint = leftPoints[lpi].clone();
            notFilledPoint.x++;

            if(filledPoints.filter((p)=> p.equal(notFilledPoint)).length===0)
                break;
        }

        if(!notFilledPoint)
            return;

        fillNeigborsWithChildren(notFilledPoint);
    }

    

    generatePoligon(typePrefix, vertices, resultMatrix, fill = true, ) {
        let leftPoints = [];
        let allBordeerPoints = [];
        let maxX = Math.max.apply(null, vertices.map(v => v.x));
        //draw lines
        for(let vi = 0; vi < vertices.length; vi++){
            let from = vertices[vi];
            if(!fill)
            {
                if(vi == vertices.length - 1)   
                    break;
                else if (vi === 0){
                    allBordeerPoints.push(from);
                    leftPoints[from.y] = from;
                    resultMatrix[from.y][from.x] = { type: `${typePrefix}OutBackCentral`, children: [] };
                }
            }
            
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
            this.fillPoligon2({ type: `${typePrefix}OutBackCentral`, children: [] }, leftPoints.filter(p => p !== undefined), maxX, resultMatrix);

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
            let childType = '';
            let n = this.getNeighbors(nearbyPoint, `${typePrefix}OutBackCentral`, resultMatrix);
            if(               n.t &&          !n.r && !n.br && !n.b &&           n.l) { childType = `${typePrefix}InBackTopLeft`; }
            else if(          n.t &&           n.r &&          !n.b && !n.bl && !n.l) { childType = `${typePrefix}InBackTopRight`; }
            else if(          n.t &&                   n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}InBackTopRight`; }
            else if(!n.tl && !n.t &&           n.r &&           n.b &&          !n.l) { childType = `${typePrefix}InBackBottomRight`; }
            else if(         !n.t && !n.tr && !n.r &&           n.b &&           n.l) { childType = `${typePrefix}InBackBottomLeft`; }
            else if( n.tl && !n.t && !n.tr && !n.r && !n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}OutBackBottomRight`; }
            else if(!n.tl && !n.t &&  n.tr && !n.r && !n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}OutBackBottomLeft`; }
            else if(!n.tl && !n.t && !n.tr && !n.r &&  n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}OutBackTopLeft`; }
            else if(!n.tl && !n.t && !n.tr && !n.r && !n.br && !n.b &&  n.bl && !n.l) { childType = `${typePrefix}OutBackTopRight`; }
            else if(!n.tl && !n.t &&           n.r &&          !n.b && !n.bl && !n.l) { childType = `${typePrefix}OutBackLeft`; }
            else if(         !n.t && !n.tr && !n.r && !n.br && !n.b &&           n.l) { childType = `${typePrefix}OutBackRight`; }
            else if(          n.t &&          !n.r && !n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}OutBackBottom`; }
            else if(!n.tl && !n.t && !n.tr && !n.r &&           n.b &&          !n.l) { childType = `${typePrefix}OutBackTop`; }
            else if(          n.t &&           n.r &&           n.b                 ) { childType = `${typePrefix}OutBackCentral`; }
            else if(         !n.t &&  n.tr && !n.r &&  n.br && !n.b                 ) { childType = `${typePrefix}OutBackLeft`; }
            else if(          n.t &&                            n.b &&           n.l) { childType = `${typePrefix}OutBackCentral`; }
            else if( n.tl && !n.t &&                           !n.b &&  n.bl && !n.l) { childType = `${typePrefix}OutBackRight`; }
            else if(                  n.tr &&  n.r &&                   n.bl        ) { childType = `${typePrefix}InBackBottomRight`; }
            else if(                  n.tr && !n.r &&  n.br &&  n.b && !n.bl &&  n.l) { childType = `${typePrefix}SingleBottom`; }
            else if( n.tl &&  n.t &&  n.tr && !n.r &&  n.br &&  n.b &&  n.bl && !n.l) { childType = `${typePrefix}OutBackCentral`; }
            else if( n.tl &&  n.t          && !n.r &&  n.br &&  n.b &&  n.bl && !n.l) { childType = `${typePrefix}OutBackCentral`; }
            else if(          n.t &&                            n.b                 ) { childType = `${typePrefix}OutBackCentral`; }
            else if(                           n.r &&                            n.l) { childType = `${typePrefix}OutBackCentral`; }
            else if( n.tl &&                   n.r &&           n.b                 ) { childType = `${typePrefix}SingleBottom`; }
            else if(          n.t &&                   n.br &&                   n.l) { childType = `${typePrefix}SingleTop`; }
            // else if( n.tl &&                           n.br                         ) { childType = `${typePrefix}OutBackCentral`; }
            // else if(                  n.tr &&                           n.bl        ) { childType = `${typePrefix}OutBackCentral`; }
            else if(!n.tl && !n.t &&  n.tr && !n.r &&  n.br &&  n.b &&  n.bl && !n.l) { childType = `${typePrefix}InBackBottomRight`; }
            else if( n.tl && !n.t && !n.tr && !n.r          &&  n.b &&  n.bl        ) { childType = `${typePrefix}InBackBottomLeft`; }
            else if( n.tl && !n.t &&  n.tr &&  n.r &&  n.br && !n.b && !n.bl && !n.l) { childType = `${typePrefix}InBackTopRight`; }
            //else { console.log('no child found fot point', nearbyPoint, n); }
            if(!childType)
                console.log(`no child found for point: ${nearbyPoint.x}, ${nearbyPoint.y}`, nearbyPoint, n);

            //resultMatrix[nearbyPoint.y][nearbyPoint.x].children = [{ type: childType, children: [] }]
            this.addAsLastChild(resultMatrix[nearbyPoint.y][nearbyPoint.x], childType);
        }
    }

    addAsLastChild(item, type){
        if(item.children === undefined || item.children.length === 0)
            item.children= [{type: type, children: []}];
        else {
            this.addAsLastChild(item.children[0], type);
        }    
        
    }

    cloneType(originalType){
        let cloned = {
            type: originalType.type,
            size: originalType.size? originalType.size.clone(): undefined,
            position: originalType.position? originalType.position.clone(): undefined,
            children: []
        };

        for(let cindex = 0; cindex < originalType.children.length;cindex++){
            cloned.children.push(this.cloneType(originalType.children[cindex]));
        }

        return cloned;
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

    fillPoligon2(type, leftPoints,maxRightX, matrix) {
        let leftPoint = undefined;
        for(let lpi = 0; lpi< leftPoints.length;lpi++){
            leftPoint = leftPoints[lpi].clone();
            leftPoint.x++;
            if(matrix[leftPoint.y] === undefined || matrix[leftPoint.y][leftPoint.x] === undefined)
                continue;

            if(matrix[leftPoint.y][leftPoint.x].type !== type.type)
                break;
        }

        this.fillNeigbors(leftPoint, type, matrix);
    }

    fillNeigbors(point, type, matrix) {
        if(matrix[point.y] === undefined || matrix[point.y][point.x] === undefined)
            return;

        if(matrix[point.y][point.x].type !== type.type){
            matrix[point.y][point.x] = this.cloneType(type);

            this.fillNeigbors(new V2(point.x - 1, point.y), type, matrix)
            this.fillNeigbors(new V2(point.x + 1, point.y), type, matrix)
            this.fillNeigbors(new V2(point.x, point.y - 1), type, matrix)
            this.fillNeigbors(new V2(point.x, point.y + 1), type, matrix)
        }
        else {
            return;
        }
    }

    fillPoligon(type, leftPoints, maxRightX, matrix){
        for(let lpi = 0; lpi< leftPoints.length;lpi++){
            let leftPoint = leftPoints[lpi].clone();

            for(let x = leftPoint.x+1; x <= maxRightX; x++){
                if(matrix[leftPoint.y][x].type !== type.type)
                    break;
                
                leftPoint.x = x;
            } 

            if(leftPoint.x === maxRightX || leftPoint.x === maxRightX - 1)
                continue;

            let gaps = [];
            let from = leftPoint.x, to = undefined;
            let gapIndex = 0;
            for(let x = leftPoint.x+1; x <= maxRightX; x++){
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
                        if(gapIndex%2 === 0)
                            gaps.push({ from: from, to: x });

                        from = x;
                        gapIndex++;
                    }
                }
            }

            if(!gaps.length)
                continue;
            else {
                for(let gi = 0; gi < gaps.length;gi++){
                    let gap = gaps[gi];
                    for(let column = gap.from+1;column < gap.to; column++){
                        matrix[leftPoint.y][column] = this.cloneType(type);
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