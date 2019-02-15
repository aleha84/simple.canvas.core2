class ChaseScene extends Scene {
    constructor(options = {}) {
        super(options);
    }

    start() {
        this.bgLayersCount = 4;
        this.bgOpacityMin = 0.2;
        this.bgOpacityMax = 0.5;
        this.bgLayerFramesCount = 10;
        this.bgSpeedMin = 0.1;
        this.bgSpeedMax = 0.4;
        this.bgImages = [];
        this.inititalLineLenth = 40;
        this.dencity = //[0.0025, 0.0006, 0.00035, 0.0001]
            [0.001, 0.0005, 0.00025, 0.0001]


        for(let i = 0; i < this.bgLayersCount; i++){
            //if(i == 0) continue
            this.bgImages[i] = [];
            for(let j = 0; j < this.bgLayerFramesCount; j++){
                this.bgImages[i][j] = textureGenerator.textureGenerator({
                    size: this.viewport,
                    backgroundColor: 'rgba(255,255,255,0)',
                    renderValuesRound: true,
                    surfaces: [
                        textureGenerator.getSurfaceProperties({
                            colors: ['FFFFFF'], opacity: [this.bgOpacityMin + i*(this.bgOpacityMax - this.bgOpacityMin)/(this.bgLayersCount-1)], 
                            fillSize: new V2(this.inititalLineLenth + 40*i, 0.5+ 0.5*i),
                            density: this.dencity[i]//0.01/(Math.pow(10,i)), 
                        })
                    ],
                })

                this.addGo(new MovingGO({
                    position: this.sceneCenter.add(new V2(this.viewport.x*j, 0)).add(new V2(-30*j,0)),
                    size: this.viewport,
                    img: this.bgImages[i][j],
                    speed: 6 + 4*i,
                    destination: new V2(-this.viewport.x/2, this.viewport.y/2),
                    setDestinationOnInit: true,
                    renderValuesRound: true,
                    destinationCompleteCheck() {
                        let p = this.parentScene;
                        if(this.position.x <= -p.viewport.x/2){
                            this.position.x = p.sceneCenter.x + p.viewport.x*(p.bgLayerFramesCount - 1) - 30*(p.bgLayerFramesCount)
                        }
                    }
                }), i)
            }
        }

        this.ss = this.addGo(new MovingGO({
            position: this.sceneCenter.clone(),
            size: new V2(100, 50),
            renderValuesRound: true,
            speed: 0.1,
            // img: createCanvas(new V2(1,1), (ctx) => {
            //     ctx.fillStyle = 'green'; ctx.fillRect(0,0,1,1);
            // })
            init() {
                this.ignitionTimer = createTimer(50, () => {
                    let count = getRandomInt(2,4);
                    let size = getRandomInt(4,8);
                    for(let i = 0; i < count; i++){
                        let p = new V2(this.position.x - this.size.x/2 + size, this.position.y + getRandomInt(-6,6));
                        let igniteParticle = this.parentScene.addGo(new MovingGO({
                            renderValuesRound: true,
                            position: p,
                            size: new V2(size,size),
                            img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = `rgb(255, ${getRandomInt(0,255)}, 0)`; ctx.fillRect(0,0,1,1) }),
                            speed: 2,
                            destination: new V2(-1, p.y),
                            setDestinationOnInit: true
                        }),9);
    
                        igniteParticle.addEffect(new FadeOutEffect({
                            setParentDeadOnComplete: true,
                            effectTime: getRandomInt(500, 1500),
                            updateDelay: 50
                        }))
                    }
                    
                }, this, true)

                this.getRandomPosition();
            },
            destinationCompleteCallBack() {
                this.getRandomPosition();
            },
            getRandomPosition() {
                this.setDestination(this.parentScene.sceneCenter.add(new V2(getRandomInt(-100, 100), getRandomInt(-100, 100))));
            },
            internalUpdate(now) {
                // if(this.ignitionTimer)
                //     doWorkByTimer(this.ignitionTimer, now);
            }
        }), 10)

        this.ss.body = this.ss.addChild(new GO({
            position: new V2(),
            size: this.ss.size,
            renderValuesRound: true,
            img: createCanvas(new V2(20, 10), (ctx, size) => {
                let pp = new PerfectPixel({context : ctx});
                ctx.fillStyle = '#CCCCCC';
                //pp.line(3, 1, 15, 1);
                pp.line(2, 2, 17, 2);
                pp.line(2, 3, 18, 3);
                pp.line(2, 4, 19, 4);
                pp.line(2, 5, 19, 5);
                pp.line(2, 6, 19, 6);
                pp.line(2, 7, 18, 7);
                // pp.line(2, 8, 18, 8);
                // pp.line(3, 9, 17, 9);

                //lower-container
                ctx.fillStyle = '#A0A0A0';
                pp.line(5, 5, 11, 5);
                pp.line(5, 6, 12, 6);
                pp.line(5, 7, 12, 7);
                pp.line(5, 8, 12, 8);
                pp.line(5, 9, 11, 9);

                //upper-container
                pp.line(3, 0, 7, 0);
                pp.line(3, 1, 8, 1);
                pp.line(3, 2, 8, 2);

                pp.line(19, 5, 19, 6);

                ctx.fillStyle = '#BCBCBC';
                pp.line(5, 5, 11, 5);
                pp.line(5, 5, 5, 8);

                pp.line(3, 0, 3, 2);
                pp.line(3, 0, 7, 0);

                pp.line(15, 5, 15, 6);
                ctx.fillStyle = '#9E9E9E'
                pp.line(14, 5, 14, 6);

                //frontal-window
                ctx.fillStyle = '#A2B1D8';
                pp.line(15, 2, 17, 2);
                pp.line(16, 3, 18, 3);
                pp.line(17, 4, 19, 4);
                ctx.fillStyle = '#8794B5';
                pp.setPixel(19,4);

                //dark-parts
                ctx.fillStyle = '#878787'
                pp.line(2, 7, 4, 7);
                pp.line(13, 7, 18, 7);
                //pp.line(19, 5, 19, 6);
                //pp.setPixel(19,6);

                pp.line(7, 9, 11, 9);

                //endgine
                ctx.fillStyle = '#725F5F'; pp.line(1, 2, 1, 7);
                ctx.fillStyle = '#877171'; pp.line(0, 3, 0, 6);

                //black-parts
                ctx.fillStyle = 'black';pp.setPixel(11,3);
                ctx.fillStyle = '#262626';pp.setPixel(10,3);
                ctx.fillStyle = '#333333';pp.setPixel(9,3);
                ctx.fillStyle = '#444444';pp.setPixel(8,3);
                ctx.fillStyle = '#555555';pp.setPixel(7,3);
                ctx.fillStyle = '#999999';pp.setPixel(6,3);

                ctx.fillStyle = 'black';pp.setPixel(8,8);
                ctx.fillStyle = '#262626';pp.setPixel(7,8);
                ctx.fillStyle = '#333333';pp.setPixel(6,8);
            
                ctx.fillStyle = 'black';pp.setPixel(4,1);
                ctx.fillStyle = '#262626';pp.setPixel(3,1);
            })
        }))


        this.ss.ignitionSize = new V2(25,50);
        this.ss.ignition = this.ss.addChild(new GO({
            position: new V2(-this.ss.body.size.x/2 - this.ss.ignitionSize.x/2, 0),
            size: this.ss.ignitionSize,
            renderValuesRound: true,
            img: createCanvas(new V2(5, 10), (ctx, size) => {
                let pp = new PerfectPixel({context: ctx});

                for(let i = 1; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,255,${0.2+i*0.3/4})`;
                    pp.line(i, 4, i, 5);
                }

                for(let i = 0; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,0,${0.5+i*0.5/4})`;
                    pp.line(i, i== 0 ? 4: 3, i, i == 0? 5 :6);
                }
                
            })
        }))

        // let flame1 = this.ss.body.addChild(new GO({
        //     position: new V2(1.55,-1.475).mul(5),
        //     size: new V2(5.5,5.5),
        //     renderValuesRound: true,
        //     img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#FFC000'; ctx.fillRect(0,0,1,1) })
        // }))

        // flame.addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, loop: true, min: 0.85}))

        

        this.lasersTimer = createTimer(500, () => {
            let y =  this.ss.position.y + getRandomInt(-80, 80);

            let laser = this.addGo(new MovingGO({
                position: new V2(-this.sceneCenter.x, y),
                size: new V2(this.viewport.x, getRandomInt(5,10)),
                img: createCanvas(new V2(1, 8), (ctx, size) => {
                    ctx.fillStyle = '#880015'; ctx.fillRect(0,0,1,size.y);
                    ctx.fillStyle = '#ED1C24'; ctx.fillRect(0,1,1,size.y-2);
                    ctx.fillStyle = '#FF7F27'; ctx.fillRect(0,2,1,size.y - 4);
                    ctx.fillStyle = '#FFF200'; ctx.fillRect(0,3,1,2);
                }),
                destination: new V2(this.sceneCenter.x, y),
                speed: 150,
                setDestinationOnInit: true,
                destinationCompleteCallBack() {
                    this.position.x = this.parentScene.sceneCenter.x;
                    this.needRecalcRenderProperties = true;
                    this.addEffect(new FadeOutEffect({effectTime: 250, updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true}))
                }
            }), getRandomBool() ? 10 : 11)
        },this, false)
    }

    afterMainWork(now){
        if(this.lasersTimer)
            doWorkByTimer(this.lasersTimer, now);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}