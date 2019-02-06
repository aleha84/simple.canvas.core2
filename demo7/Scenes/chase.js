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

        for(let i = 0; i < this.bgLayersCount; i++){
            this.bgImages[i] = [];
            for(let j = 0; j < this.bgLayerFramesCount; j++){
                this.bgImages[i][j] = textureGenerator.textureGenerator({
                    size: this.viewport,
                    backgroundColor: 'rgba(255,255,255,0)',
                    surfaces: [
                        textureGenerator.getSurfaceProperties({
                            colors: ['FFFFFF'], opacity: [this.bgOpacityMin + i*(this.bgOpacityMax - this.bgOpacityMin)/(this.bgLayersCount-1)], fillSize: new V2(10 + 20*i, 1+ 1*i),
                            density: 0.01/(Math.pow(10,i)), 
                        })
                    ],
                })

                this.addGo(new MovingGO({
                    position: this.sceneCenter.add(new V2(this.viewport.x*j, 0)),
                    size: this.viewport,
                    img: this.bgImages[i][j],
                    //speed: 
                }), i)
            }
        }
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}