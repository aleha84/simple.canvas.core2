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

        this.soldier = this.addGo(new GO({
            position: new V2(50,220),
            size: new V2(40,90),
            init() {
                this.img = PP.createImage(
                    {"general":{"originalSize":{"x":40,"y":90},"size":{"x":40,"y":90},"zoom":3,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":14}},{"point":{"x":14,"y":15}},{"point":{"x":12,"y":18}},{"point":{"x":13,"y":21}},{"point":{"x":13,"y":24}},{"point":{"x":13,"y":28}},{"point":{"x":13,"y":35}},{"point":{"x":13,"y":43}},{"point":{"x":11,"y":50}},{"point":{"x":11,"y":60}},{"point":{"x":10,"y":62}},{"point":{"x":10,"y":70}},{"point":{"x":10,"y":75}},{"point":{"x":10,"y":77}},{"point":{"x":8,"y":79}},{"point":{"x":7,"y":81}},{"point":{"x":6,"y":82}},{"point":{"x":4,"y":84}},{"point":{"x":4,"y":86}},{"point":{"x":5,"y":87}},{"point":{"x":8,"y":87}},{"point":{"x":11,"y":85}},{"point":{"x":13,"y":83}},{"point":{"x":15,"y":81}},{"point":{"x":15,"y":78}},{"point":{"x":15,"y":76}},{"point":{"x":16,"y":72}},{"point":{"x":16,"y":69}},{"point":{"x":16,"y":63}},{"point":{"x":18,"y":60}},{"point":{"x":18,"y":57}},{"point":{"x":20,"y":51}},{"point":{"x":22,"y":51}},{"point":{"x":22,"y":58}},{"point":{"x":23,"y":63}},{"point":{"x":24,"y":65}},{"point":{"x":24,"y":67}},{"point":{"x":23,"y":69}},{"point":{"x":23,"y":79}},{"point":{"x":24,"y":81}},{"point":{"x":24,"y":87}},{"point":{"x":26,"y":88}},{"point":{"x":29,"y":88}},{"point":{"x":29,"y":86}},{"point":{"x":29,"y":83}},{"point":{"x":28,"y":81}},{"point":{"x":27,"y":79}},{"point":{"x":28,"y":73}},{"point":{"x":29,"y":69}},{"point":{"x":29,"y":63}},{"point":{"x":29,"y":59}},{"point":{"x":30,"y":57}},{"point":{"x":30,"y":50}},{"point":{"x":29,"y":48}},{"point":{"x":29,"y":42}},{"point":{"x":30,"y":41}},{"point":{"x":31,"y":36}},{"point":{"x":31,"y":28}},{"point":{"x":31,"y":25}},{"point":{"x":29,"y":23}},{"point":{"x":29,"y":21}},{"point":{"x":30,"y":19}},{"point":{"x":31,"y":15}},{"point":{"x":28,"y":15}},{"point":{"x":27,"y":14}},{"point":{"x":26,"y":13}},{"point":{"x":23,"y":15}},{"point":{"x":21,"y":16}},{"point":{"x":17,"y":16}}]},{"order":1,"type":"lines","strokeColor":"#4CFF00","fillColor":"#4CFF00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":31,"y":15}},{"point":{"x":36,"y":24}},{"point":{"x":38,"y":28}},{"point":{"x":38,"y":29}},{"point":{"x":35,"y":29}},{"point":{"x":33,"y":29}},{"point":{"x":33,"y":27}},{"point":{"x":31,"y":25}},{"point":{"x":30,"y":23}},{"point":{"x":30,"y":20}},{"point":{"x":31,"y":19}}]},{"order":2,"type":"lines","strokeColor":"#FFD800","fillColor":"#FFD800","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":3,"y":52}},{"point":{"x":8,"y":46}},{"point":{"x":9,"y":46}},{"point":{"x":11,"y":44}},{"point":{"x":11,"y":42}},{"point":{"x":13,"y":39}},{"point":{"x":15,"y":37}},{"point":{"x":15,"y":36}},{"point":{"x":22,"y":29}},{"point":{"x":24,"y":28}},{"point":{"x":26,"y":25}},{"point":{"x":32,"y":20}},{"point":{"x":34,"y":21}},{"point":{"x":36,"y":22}},{"point":{"x":31,"y":27}},{"point":{"x":29,"y":29}},{"point":{"x":29,"y":35}},{"point":{"x":29,"y":36}},{"point":{"x":27,"y":37}},{"point":{"x":23,"y":36}},{"point":{"x":22,"y":38}},{"point":{"x":21,"y":40}},{"point":{"x":21,"y":41}},{"point":{"x":24,"y":44}},{"point":{"x":24,"y":45}},{"point":{"x":22,"y":47}},{"point":{"x":21,"y":47}},{"point":{"x":18,"y":44}},{"point":{"x":16,"y":44}},{"point":{"x":14,"y":46}},{"point":{"x":8,"y":52}},{"point":{"x":5,"y":52}},{"point":{"x":4,"y":53}}]},{"order":3,"type":"lines","strokeColor":"#4CFF00","fillColor":"#4CFF00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":12,"y":18}},{"point":{"x":11,"y":20}},{"point":{"x":9,"y":23}},{"point":{"x":8,"y":26}},{"point":{"x":6,"y":30}},{"point":{"x":5,"y":31}},{"point":{"x":5,"y":32}},{"point":{"x":7,"y":34}},{"point":{"x":9,"y":36}},{"point":{"x":11,"y":38}},{"point":{"x":12,"y":39}},{"point":{"x":12,"y":41}},{"point":{"x":13,"y":43}},{"point":{"x":14,"y":43}},{"point":{"x":16,"y":42}},{"point":{"x":17,"y":41}},{"point":{"x":17,"y":39}},{"point":{"x":16,"y":37}},{"point":{"x":12,"y":34}},{"point":{"x":10,"y":31}},{"point":{"x":12,"y":29}},{"point":{"x":13,"y":28}},{"point":{"x":13,"y":23}},{"point":{"x":13,"y":19}}]},{"order":4,"type":"lines","strokeColor":"#0026FF","fillColor":"#0026FF","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":18,"y":1}},{"point":{"x":23,"y":1}},{"point":{"x":24,"y":1}},{"point":{"x":26,"y":2}},{"point":{"x":28,"y":4}},{"point":{"x":28,"y":8}},{"point":{"x":27,"y":10}},{"point":{"x":27,"y":12}},{"point":{"x":26,"y":13}},{"point":{"x":24,"y":13}},{"point":{"x":23,"y":14}},{"point":{"x":22,"y":14}},{"point":{"x":21,"y":15}},{"point":{"x":18,"y":15}},{"point":{"x":16,"y":13}},{"point":{"x":15,"y":12}},{"point":{"x":14,"y":9}},{"point":{"x":15,"y":5}},{"point":{"x":16,"y":3}}]},{"order":5,"type":"lines","strokeColor":"#4CFF00","fillColor":"#4CFF00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":38,"y":29}},{"point":{"x":39,"y":33}},{"point":{"x":39,"y":34}},{"point":{"x":37,"y":35}},{"point":{"x":33,"y":35}},{"point":{"x":32,"y":34}},{"point":{"x":28,"y":34}},{"point":{"x":27,"y":35}},{"point":{"x":25,"y":35}},{"point":{"x":24,"y":34}},{"point":{"x":23,"y":33}},{"point":{"x":22,"y":34}},{"point":{"x":25,"y":31}},{"point":{"x":27,"y":30}},{"point":{"x":29,"y":30}},{"point":{"x":33,"y":30}},{"point":{"x":35,"y":30}}]}]}}
                )
            }
        }), 1)

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
                            let deep = 3;

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
                            

                            // hlp.setFillColor(colors.palettes.fleja.colors[24])
                            // .rect(radius, radius, size.x-radius*2-deep, size.y-radius*2)

                            // hlp.setFillColor(colors.palettes.fleja.colors[22])
                            //     .rect(radius, radius, 1, size.y-radius*2)
                            //     .rect(radius, radius, size.x-radius*2 -deep, 1)

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