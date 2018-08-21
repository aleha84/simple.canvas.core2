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

        //consistency check
        for(let rowIndex = 0; rowIndex < this.tilesMatrix.length; rowIndex++){
            for(let itemIndex = 0; itemIndex < this.tilesMatrix[rowIndex].length; itemIndex++){
                let tileDataFromMatrix = this.tilesMatrix[rowIndex][itemIndex];
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

                props.size = (mapping.size || this.tileSize).clone();
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
                    
                props.position = this.topLeftLogical.add(
                    new V2((itemIndex+1)*this.tileSize.x,(rowIndex+1)*this.tileSize.y)
                ).substract(
                    new V2(props.size.x/2, props.size.y/2)
                );

                this.scene.addGo(
                    new Tile(props),
                    this.layerLevel
                );
            }
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