class TextureScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options)

        super(options);

        let tg = textureGenerator;
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 200),
            img: tg.textureGenerator({
                surfaces: [
                    // tg.getSurfaceProperties({fillSize: new V2(2,2),density: 1, indents: { h: new V2(-2,-2), v: new V2(-2,-2) }}),
                    // tg.getSurfaceProperties({colors: ['#FFFFFF'],fillSize: new V2(1,1),density: 0.5, indents: { h: new V2(-1,-1) }})

                    tg.getSurfaceProperties({fillSize: new V2(15,1),density: 0.75, indents: { h: new V2(-15,-15) }}),
                    tg.getSurfaceProperties({colors: ['#FFFFFF'],fillSize: new V2(15,1),density: 0.01, indents: { h: new V2(-15,-15) }})

                    // tg.getSurfaceProperties({colors: ['#A8BBB9'], fillSize: new V2(50, 1), density: 0.005, opacity: [0.05, 0.1], indents: { h: new V2(-50,-50) }}),
                    // tg.getSurfaceProperties({colors: ['#A8BBB9'], fillSize: new V2(1, 50), density: 0.005, opacity: [0.05, 0.1], indents: { v: new V2(-50,-50) }}),
                    // tg.getSurfaceProperties({colors: ['#000000'], fillSize: new V2(2, 2), density: 0.005, opacity: [0.05, 0.1], indents: { v: new V2(-2,-2) }})
                ]
            })
        }))
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

