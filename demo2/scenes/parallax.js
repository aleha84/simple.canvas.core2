class ParallaxScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            layers: [
                { 
                    count: 500,
                    opacity: 0.5,
                    speed: 0.1
                },
                { 
                    count: 250,
                    opacity: 0.75,
                    speed: 0.25
                },
                { 
                    count: 100,
                    opacity: 1,
                    speed: 0.5
                }
            ]
        }, options);

        super(options);

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

class StarsLayer {
    constructor(options = {}) {
        assignDeep(this, {
            starsConfigs: {
                count: 20,
                opacity: 0.5,
                speed: 0.1,
                direction: new V2(-1, 0)
            },
            level: 0
        }, options);

        this.stars = [];

        for(let i = 0; i < this.starsConfigs.count; i++){
            this.stars.push(this.scene.addGo(
                new Star({
                    position: new V2(getRandomInt(0, this.scene.viewport.x), getRandomInt(0, this.scene.viewport.y)),
                    opacity: this.starsConfigs.opacity,
                    speed: this.starsConfigs.speed,
                    direction: this.starsConfigs.direction
                }), this.level
            ));
        }
    }
}

class Star extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            position: new V2(),
            opacity: 1,
            speed: 0,
            direction: new V2(),
            isCustomRender: true,
            size: new V2(1,1)
        }, options);

        super(options);

        this.fillStyle = 'rgba(255,255,255,'+this.opacity+')';

        this.setDestination(new V2(0, this.position.y));
    }

    customRender(){
        this.context.fillStyle = this.fillStyle;
        let rp = this.renderPosition;
        let rsx = this.renderSize.x;
        let rsy = this.renderSize.y;
        this.context.fillRect(rp.x - rsx/2, rp.y - rsy/2, rsx,rsy);
    }

    destinationCompleteCallBack() {
        this.position = new V2(SCG.scenes.activeScene.viewport.x+1, getRandomInt(0, SCG.scenes.activeScene.viewport.y));
        this.setDestination(new V2(0, this.position.y));
    }
}