class Demo9MidFightScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        //this.backgroundRenderDefault('#B78C0B');
        this.backgroundRenderImage(this.bgImg);
    }

    start(){

        this.bgImg = createCanvas(this.viewport, (ctx, size, hlp) => {
            hlp.setFillColor('#B78C0B').rect(0,0,size.x, size.y);
            hlp.setFillColor('#AD850C')
            for(let i = 0; i < 100; i++){
                hlp.rect(getRandomInt(0,size.x), getRandomInt(0,size.y), getRandomInt(5,20), 1)
            }
        })

        this.knightSize = new V2(40,30);

        this.knight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.knightSize,
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.knightIdle)
            }
        }), 1)

        // this.grass = this.addGo(new GO({
        //     position: this.sceneCenter.add(new V2(20,20)),
        //     size: new V2(20,20),
        //     init() {
        //         this.img = PP.createImage(Demo9MidFightScene.models.grass)
        //     }
        // }), 2)

        this.grass2Img = PP.createImage(Demo9MidFightScene.models.grass2);
        this.addGo(new GO({
            position: new V2(100, 180),
            size: new V2(30,20),
            init() {
                this.img = this.parentScene.grass2Img;
            }
        }), 2)

        this.addGo(new GO({
            position: new V2(80, 190),
            size: new V2(30,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.grass3);
            }
        }), 2)

        this.addGo(new GO({
            position: new V2(110, 210),
            size: new V2(30,20),
            init() {
                this.img = PP.createImage(Demo9MidFightScene.models.grass4);
            }
        }), 2)
        
    }
}