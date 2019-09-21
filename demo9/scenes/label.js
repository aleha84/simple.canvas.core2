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
            renderValuesRound: true,
            init() {
                this.cornersRaius = 13;
                this.particles = [];
                this.yClamps = [this.position.y, this.position.y-5];

                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({ context: this, propsName: 'yChange', round: true, removePropsOnComplete: true, setter: (value) => {
                        this.position.y = value;
                        this.needRecalcRenderProperties = true;
                    } })

                    if(!this.yChange){
                        this.yChange = easing.createProps(50, this.position.y, this.position.y == this.yClamps[0] ? this.yClamps[1] : this.yClamps[0], 'quad', 'inOut')
                    }   

                    for(let i = 0; i < this.particles.length; i++){
                        let p = this.particles[i];
                        p.position.y+=0.5;
                        p.needRecalcRenderProperties = true;
                        // if(p.position.y > 100){
                        //     p.setDead();
                        // }
                    }

                    let size = getRandomInt(1,3);

                    this.particles.push(this.addChild(new GO({
                        position: new V2(getRandomInt(-this.size.x/2 + this.cornersRaius, this.size.x/2 - this.cornersRaius), this.size.y/2 + size),
                        size: new V2(size,size),
                        img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            hlp.setFillColor(colors.palettes.fleja.colors[getRandomInt(20, 23)]).rect(0,0,size.x, size.y);
                        }),
                        init() {
                            this.addEffect(new FadeOutEffect({ updateDelay: 30, effectTime: getRandomInt(1000, 2000), setParentDeadOnComplete: true }))
                        }
                    })));

                    this.particles = this.particles.filter(p => p.alive);
                })

                this.baseFrame = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    radius: this.cornersRaius,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('blue').strokeRect(0,0, size.x, size.y);

                            let radius = this.radius;
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


                            // for(let i = 0;i < 100; i++){

                            // }
                            

                            hlp.setFillColor(colors.palettes.fleja.colors[24])
                            .rect(radius, radius, size.x-radius*2-deep, size.y-radius*2)

                            hlp.setFillColor(colors.palettes.fleja.colors[22])
                                .rect(radius, radius, 1, size.y-radius*2)
                                .rect(radius, radius, size.x-radius*2 -deep, 1)

                            hlp.setFillColor(colors.palettes.fleja.colors[24])
                                .rect(radius-5, 1, size.x-2*radius+radius/3-1, 1)
                                .strokeEllipsis(180, 245, 1, new V2(radius, radius+0), radius, radius)
                                .rect(0, radius, 1, size.y-2*radius+radius/3-1)

                            

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