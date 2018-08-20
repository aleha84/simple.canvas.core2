class TileMapScene extends Scene {
    constructor(options = {}){
        super(options);

        this.ts = new TileSet({
            imgPropertyName: 'tilemap',
            tileSize: new V2(25,25),
            tilesMappings: {
                'cs': {
                    destSourcePosition: new V2(),
                    destSourceSize: new V2(20,20)
                },
                'gs': {
                    destSourcePosition: new V2(20,0),
                    destSourceSize: new V2(20,20)
                }
            },
            tilesMatrix: [
                ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
                ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
                ['cs', 'cs', 'gs', 'gs', 'cs', 'cs'],
                ['cs', 'cs', 'gs', 'gs', 'cs', 'cs'],
                ['cs', 'cs', 'cs', 'cs', 'cs', 'cs'],
                ['cs', 'cs', 'cs', 'cs', 'cs', 'cs']
            ],
            scene: this
        });
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'lightgray';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}