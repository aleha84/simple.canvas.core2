class Demo9LabelScene extends Scene {
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
        this.backgroundRenderDefault(colors.palettes.fleja.colors[5]);
    }

    start(){
        this.label = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+20, 125),
            size: new V2(this.viewport.x*0.6, 100).toInt(),
            init() {
                this.baseFrame = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('blue').strokeRect(0,0, size.x, size.y);

                            let radius = 13;
                            let deep = 5;

                            hlp.setFillColor(colors.palettes.fleja.colors[22])
                            .circle(new V2(radius+deep,radius), radius)
                            .circle(new V2(radius+deep,size.y-radius), radius)  
                            .circle(new V2(size.x-radius,radius), radius)
                            .circle(new V2(size.x-radius,size.y-radius), radius)
                            .rect(1+deep,radius, radius, size.y-radius*2)
                            .rect(radius+1, 1, size.x - radius*2, size.y)
                            .rect(size.x-radius,radius, radius, size.y-radius*2)

                            radius = 13;

                            hlp.setFillColor(colors.palettes.fleja.colors[23])
                            .circle(new V2(radius,radius), radius)
                            .circle(new V2(radius,size.y-radius-1), radius)  
                            .circle(new V2(size.x-deep-radius,radius), radius)
                            .circle(new V2(size.x-deep-radius,size.y-radius-1), radius)
                            .rect(1,radius, radius, size.y-radius*2)
                            .rect(radius+1, 1, size.x - deep - radius*2, size.y-2)
                            .rect(size.x-deep-radius,radius, radius, size.y-radius*2)

                            // hlp.setFillColor(colors.palettes.fleja.colors[24])
                            // .rect(radius-3,0,size.x - radius*2,1)
                            // .strokeEllipsis(180, 270, 1, new V2(radius+1, radius), radius, radius)

                            hlp.setFillColor(colors.palettes.fleja.colors[24])
                            .rect(radius, radius, size.x-radius*2-deep, size.y-radius*2)

                            hlp.setFillColor(colors.palettes.fleja.colors[22])
                                .rect(radius, radius, 1, size.y-radius*2)
                                .rect(radius, radius, size.x-radius*2 -deep, 1)

                            // hlp.setFillColor(colors.palettes.fleja.colors[23])//.rect(0,0,size.x, size.y);
                            //     .rect(0,0,size.x-5, size.y)

                            //hlp.setFillColor(colors.palettes.fleja.colors[22]).rect(size.x-5, 0, 10, size.y)

                        })
                    }
                }))
            },
        }), 10)

        this.ground = this.addGo(new GO({
            position: new V2(150, 275),
            size: new V2(300, 50),
            init() {
                this.floor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor(colors.palettes.fleja.colors[14]).rect(0,0,size.x, size.y);
                        })
                    }
                }))
            }
        }))
    }
}