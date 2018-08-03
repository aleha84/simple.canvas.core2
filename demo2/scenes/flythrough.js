class FlytroughScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options);

        this.initialized = false;
        
    }

    preMainWork(now){
        if(!this.initialized)
        {
            for(let i = 0; i < 3000; i++){
                let _r = getRandom(0.1, 1);
                this.addGo(new FlythroughStar({
                    position: new V2(getRandomInt(10, this.viewport.x-10), getRandomInt(10, this.viewport.y-10)),
                    defaultOpacity: 0.1,
                    defaultSpeed: 0.1,
                    defaultSize: new V2(1,1),
                    opacity: _r > 1 ? 1 : _r,
                    speed: _r,
                    speedDelta: 0.05,
                    opacityDelta: 0.04,
                    sizeDelta: 0.005
                }), 1);
            }
            

            this.initialized = true;
        }
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}