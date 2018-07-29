class ParallaxScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            layers: [
            ]
        }, options);

        super(options);
        for(let i = 10; i>0; i--){
            this.layers.push({
                count: i*100,
                opacity: 1/i,
                speed: 1/i
            });
        }
        this.starsLayers = [];

        for(let i = 0; i < this.layers.length; i++){
            this.starsLayers.push(new StarsLayer({starsConfigs: this.layers[i], level: i, scene: this}));
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}