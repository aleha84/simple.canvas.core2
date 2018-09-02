class TileSet {
    constructor(options = {}){
        assignDeep(this, {
            tilesMappings: {},
            tilesTypes: [],
            tilesMatrix: [],
            tileSize: new V2(10, 10),
            layerLevel: 0,
            topLeftLogical: new V2(),
            scene: undefined
        }, options);

        if(!this.scene)
            throw 'TileSet -> Scene not defined';

        if(!this.tilesMatrix.length)
            throw 'TileSet -> tilesMatrix is empty';

        if(this.tilesMatrix.length === 1)
            throw 'TileSet -> tilesMatrix should have more then 1 row';

        if(!this.tilesMatrix.every((val, i, arr) => val.length === arr[0].length))
            throw 'TileSet -> tilesMatrix rows should be the same length';

        this.layeredTilesMatrix = [];
        this.initMatrixLayer(this.tilesMatrix.length, this.tilesMatrix[0].length, 0);

        for(let rowIndex = 0; rowIndex < this.tilesMatrix.length; rowIndex++){
            for(let itemIndex = 0; itemIndex < this.tilesMatrix[rowIndex].length; itemIndex++){
                this.putChildrenAtMatrixLayers(this.tilesMatrix[rowIndex][itemIndex], rowIndex, itemIndex, this.layerLevel);
            }
        }

        for(let matrixLayerIndex = 0; matrixLayerIndex < this.layeredTilesMatrix.length; matrixLayerIndex++){
            let tilesMatrix = this.layeredTilesMatrix[matrixLayerIndex];

            for(let rowIndex = 0; rowIndex < tilesMatrix.length; rowIndex++){
                for(let itemIndex = 0; itemIndex < tilesMatrix[rowIndex].length; itemIndex++){
                    let tileDataFromMatrix = tilesMatrix[rowIndex][itemIndex];
                    if(!tileDataFromMatrix)
                        continue;

                    if(isArray(tileDataFromMatrix)) {
                        for(let i = 0; i < tileDataFromMatrix.length;i++){
                            this.preocessTileDataFromMatrix(tileDataFromMatrix[i], matrixLayerIndex, rowIndex, itemIndex);
                        }
                    }
                    else {
                        this.preocessTileDataFromMatrix(tileDataFromMatrix, matrixLayerIndex, rowIndex, itemIndex);
                    }
                }
            }
        }
    }

    preocessTileDataFromMatrix(tileDataFromMatrix, matrixLayerIndex, rowIndex, itemIndex){
        let mapping = this.tilesMappings[isObject(tileDataFromMatrix)? tileDataFromMatrix.type : tileDataFromMatrix];
        if(!mapping)
            throw `TileSet -> incorrect tile data in matrix at: ${rowIndex}, ${itemIndex}`;

        if(!mapping.imgPropertyName && !this.imgPropertyName)
            throw `TileSet -> No image specified for tile in matrix at: ${rowIndex}, ${itemIndex}`;

        let props = {
            imgPropertyName: !mapping.imgPropertyName ? this.imgPropertyName : mapping.imgPropertyName
        };

        if(mapping.destSourcePosition){
            props.destSourcePosition = mapping.destSourcePosition;
            if(mapping.destSourceSize)
                props.destSourceSize = mapping.destSourceSize;
        }

        if(isObject(tileDataFromMatrix) && tileDataFromMatrix.size){
            props.size = tileDataFromMatrix.size;
        }
        else {
            props.size = (mapping.size || this.tileSize).clone();
            if(!mapping.noTileAdjustment){
                if(!props.size.equal(this.tileSize)){
                    if(props.size.y < this.tileSize.y){
                        props.size.y = this.tileSize.y;
                    }

                    if(props.size.y === this.tileSize.y && props.size.x !== this.tileSize.x){
                    props.size.x = this.tileSize.x; 
                    }
                    else if(props.size.y > this.tileSize.y && props.size.x > this.tileSize.x){
                        let _scale = props.size.x/this.tileSize.x;
                        props.size = new V2(props.size.x/_scale, props.size.y/_scale);
                    }
                }
            }
        }
        
            
        props.position = this.topLeftLogical.add(
            new V2((itemIndex+1)*this.tileSize.x,(rowIndex+1)*this.tileSize.y)
        ).substract(
            new V2(props.size.x/2, props.size.y/2)
        );

        if(isObject(tileDataFromMatrix) && tileDataFromMatrix.position){
            props.position.add(tileDataFromMatrix.position, true);
        }

        this.scene.addGo(
            new Tile(props),
            matrixLayerIndex
        );
    }

    putChildrenAtMatrixLayers(item, rowIndex, columnIndex, layerLevel) {
        let ltm = this.layeredTilesMatrix;
        if(this.layeredTilesMatrix[layerLevel] === undefined){
            this.initMatrixLayer(this.tilesMatrix.length, this.tilesMatrix[0].length, layerLevel)
        }

        let currentItem =  ltm[layerLevel][rowIndex][columnIndex];
        if(currentItem !== undefined){
            if(isArray(currentItem)){
                currentItem.push(item);
            }
            else {
                ltm[layerLevel][rowIndex][columnIndex] = [currentItem, item];
            }
        }
        else {
            ltm[layerLevel][rowIndex][columnIndex] = item;
        }

        if(isObject(item) && item.children) {
            for(let ci = 0; ci < item.children.length; ci++){
                this.putChildrenAtMatrixLayers(item.children[ci], rowIndex, columnIndex, layerLevel+1);
            }
        }
    }

    initMatrixLayer(rowsLength, columnsLenth, layerLevel){
        let ltm = this.layeredTilesMatrix;
        ltm[layerLevel] = new Array(rowsLength);
        for(let rowIndex = 0; rowIndex < rowsLength; rowIndex++){
            ltm[layerLevel][rowIndex] = new Array(columnsLenth);
        }
    }
}

class Tile extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            tileOptimization: true
        }, options);

        super(options);
    }
}