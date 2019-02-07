class ChaseScene extends Scene {
    constructor(options = {}) {
        super(options);
    }

    start() {
        this.bgLayersCount = 3;
        this.bgOpacityMin = 0.1;
        this.bgOpacityMax = 0.5;
        this.bgLayerFramesCount = 3;
        this.bgSpeedMin = 0.1;
        this.bgSpeedMax = 0.4;
        this.bgImages = [];
        this.inititalLineLenth = 30;
        this.dencity = [0.0025, 0.0005, 0.0001]


        for(let i = 0; i < this.bgLayersCount; i++){
            this.bgImages[i] = [];
            for(let j = 0; j < this.bgLayerFramesCount; j++){
                this.bgImages[i][j] = textureGenerator.textureGenerator({
                    size: this.viewport,
                    backgroundColor: 'rgba(255,255,255,0)',
                    surfaces: [
                        textureGenerator.getSurfaceProperties({
                            colors: ['FFFFFF'], opacity: [this.bgOpacityMin + i*(this.bgOpacityMax - this.bgOpacityMin)/(this.bgLayersCount-1)], 
                            fillSize: new V2(this.inititalLineLenth + 40*i, 1+ 1*i),
                            density: this.dencity[i]//0.01/(Math.pow(10,i)), 
                        })
                    ],
                })

                this.addGo(new MovingGO({
                    position: this.sceneCenter.add(new V2(this.viewport.x*j, 0)).add(new V2(-30*j,0)),
                    size: this.viewport,
                    img: this.bgImages[i][j],
                    speed: 6 + 4*i,
                    destination: new V2(-this.viewport.x/2, this.viewport.y/2),
                    setDestinationOnInit: true,
                    renderValuesRound: true,
                    destinationCompleteCheck() {
                        let p = this.parentScene;
                        if(this.position.x <= -p.viewport.x/2){
                            this.position.x = p.sceneCenter.x + p.viewport.x*(p.bgLayerFramesCount - 1) - 30*(p.bgLayerFramesCount)
                        }
                    }
                }), i)
            }
        }
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}