class EpskaVerse1Part2Scene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        this.eyes = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 51),
            size: new V2(300, 103),
            init() {
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('red').rect(0,0,size.x, size.y)
                // })
                this.base = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.eyesClose)
                }))
            }
        }))

        this.text = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 50),
            size: new V2(300, 100),
            init() {
                this.bg = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#EAF5F8').rect(0,0,size.x, size.y)
                    })
                }))

                this.letters = this.addChild(new Go({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.rgb = {r: 5, g: 13, b: 14};
                        this.letterAppearCounter = 10;
                        this.letterAppear = 100;
                        this.currentText = 'She is gone with black wind';
                        this.currentLetters = Array.prototype.map.call(this.currentText, (l) => ({
                            a: 0,
                            text: l
                            //aChange: easing.createProps(this.letterAppear, 0, 1, 'quad', 'inOut'),
                        }));

                        this.timer = this.regTimerDefault(15, () => {
                            if(this.letterAppearCounter-- == 0){
                                this.letterAppearCounter = 10;
                                let nextToAppear = this.currentLetters.filter(cl => !cl.aChange);
                                if(nextToAppear.length > 0){
                                    nextToAppear[0].aChange = easing.createProps(this.letterAppear, 0, 1, 'quad', 'inOut');
                                }
                            }

                            for(let i = 0; i < this.currentLetters.length; i++){
                                let cl = this.currentLetters[i];

                                if(cl.aChange){
                                    if(cl.aChange.time < cl.aChange.duration){
                                        cl.a = easing.process(cl.aChange);
                                        cl.aChange.time++;
                                    }
                                }
                            }

                            this.createImage();
                        })
                    },
                    createImage() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            this.currentLetters.forEach((cl,i) => {
                                let limg = PP.createText({text: cl.text, color: `rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b},${1})`, size: 5});
                                ctx.globalAlpha = cl.a;
                                ctx.drawImage(limg.img, 30 + 7*i, 30)
                                ctx.globalAlpha = 1;
                            })
                        })
                    }
                }))
            }
        }))

        this.frames = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('cornflowerblue').strokeRect(0,0,size.x, size.y,4)
                    .rect(0,size.y/2, size.x, 4)
                })
            }
        }), 2)
    }
}