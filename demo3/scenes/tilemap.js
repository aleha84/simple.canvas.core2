class TileMapScene extends Scene {
    constructor(options = {}){
        super(options);

        this.size = new V2(10,10);
        let defaultSourceTileSize = new V2(32,32);

        this.ts = new TileSet({
            imgPropertyName: 'terrain_atlas',
            tileSize: new V2(25,25),
            tilesMappings: {
                'highGrassCentral': {
                    destSourcePosition: new V2(32,736),
                    destSourceSize: defaultSourceTileSize.clone()
                },
                'cs': {
                    destSourcePosition: new V2(),
                    destSourceSize: new V2(20,20)
                },
                'gs': {
                    destSourcePosition: new V2(20,0),
                    destSourceSize: new V2(20,20)
                },
                'lamp': {
                    destSourcePosition: new V2(0,21),
                    destSourceSize: new V2(21,68),
                    noTileAdjustment: true,
                    size: new V2(21,68)
                }
            },
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
        //initial layer
        var result = new Array(this.size.y);
        for(let rowIndex = 0; rowIndex < this.size.y; rowIndex++){
            result[rowIndex] = new Array(this.size.x);
            for(let columnIndex = 0; columnIndex < this.size.x; columnIndex++){
                result[rowIndex][columnIndex] = { type: 'highGrassCentral' }
            }
        }

        return result;
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'lightgray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}