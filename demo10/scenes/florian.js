class Demo10FlorianScene extends Scene {
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
        this.backgroundRenderDefault('#819188');
    }

    start(){
        this.flower = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10FlorianScene.models.flower)
            }
        }), 1)

        let iceModel = Demo10FlorianScene.models.ice();
        iceModel.main.layers.forEach(l => {l.visible = true});

        this.iceFrontal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = [];

                this.framesCount = 400;
                this.iceImages = [
                    PP.createImage(iceModel, { renderOnly: 'ice1' }),
                    PP.createImage(iceModel, { renderOnly: 'ice2' }),
                    PP.createImage(iceModel, { renderOnly: 'ice3' })
                ]

                this.itemSize = new V2(40,40)
                this.xChange = easing.createProps(this.framesCount-1, -this.itemSize.x/2, this.size.x+this.itemSize.x/2, 'linear', 'base');
                this.itemsHeight = 150;
                
                this.items = [
                    { p: new V2(50, this.itemsHeight), img: this.iceImages[0] },
                    { p: new V2(100, this.itemsHeight), img: this.iceImages[1] },
                    { p: new V2(150, this.itemsHeight), img: this.iceImages[2] }
                ]

                for(let f = 0; f < this.framesCount; f++){
                    this.xChange.time = f;
                    let xShift = fast.r(easing.process(this.xChange))
                    
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let i = 0; i < this.items.length; i++){
                            let item = this.items[i];
    
                            let p = item.p.add(this.itemSize.divide(2)).toInt();
                            p.x-=xShift;
                            if(p.x < -this.itemSize.x/2){
                                p.x += this.size.x+this.itemSize.x/2;
                            }
    
                            ctx.drawImage(item.img, p.x, p.y);
                        }
                    })
                    
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 10)

        // this.ice = this.addGo(new GO({
        //     position: new V2(50,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice1' })
        //     }
        // }), 1)

        // this.ice2 = this.addGo(new GO({
        //     position: new V2(90,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice2' })
        //     }
        // }), 1)

        // this.ice3 = this.addGo(new GO({
        //     position: new V2(130,150),
        //     size: new V2(40,40),
        //     init() {
        //         this.img = PP.createImage(iceModel, { renderOnly: 'ice3' })
        //     }
        // }), 1)
    }
}