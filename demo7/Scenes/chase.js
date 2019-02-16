class ChaseScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options)
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
            init() {
                this.ignitionTimer = createTimer(50, () => {
                    for(let j = 0; j < 2; j++){
                        let count = getRandomInt(2,4);
                        let size = getRandomInt(2,5);
                        for(let i = 0; i < count; i++){
                            let p = undefined;
                            switch(j){
                                case 0: 
                                    p = new V2(this.position.x - 5 +getRandomInt(-2,2), this.position.y + 18 + getRandomInt(-1,1));
                                    break;
                                case 1:
                                    p = new V2(this.position.x - 25+getRandomInt(-2,2), this.position.y - 17 + getRandomInt(-1,1));
                                    break;
                            }

                            let igniteParticle = this.parentScene.addGo(new MovingGO({
                                renderValuesRound: true,
                                position: p,
                                size: new V2(size,size),
                                img: createCanvas(new V2(1,1), (ctx) => { 
                                    ctx.fillStyle = `rgb(255, ${getRandomInt(0,255)}, 0)`; ctx.fillRect(0,0,1,1) }),
                                speed: 2,
                                destination: new V2(-1, p.y),
                                setDestinationOnInit: true
                            }),11);
        
                            igniteParticle.addEffect(new FadeOutEffect({
                                startDelay: 100,
                                setParentDeadOnComplete: true,
                                effectTime: getRandomInt(100, 200),
                                updateDelay: 50
                            }))
                        }
                    }
                }, this, true)

                this.getRandomPosition();

                //this.shield.hit(1);
            },
            destinationCompleteCallBack() {
                this.getRandomPosition();
            },
            getRandomPosition() {
                this.setDestination(this.parentScene.sceneCenter.add(new V2(getRandomInt(-100, 100), getRandomInt(-100, 100))));
            },
            internalUpdate(now) {
                if(this.ignitionTimer)
                    doWorkByTimer(this.ignitionTimer, now);
            }
        }), 10)

        this.defaultPixelSize = 5;
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
                // ctx.fillStyle = '#88C6D8';
                // pp.line(16, 3, 17, 3);

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
                ctx.fillStyle = '#493E3E'; pp.setPixel(1,7); pp.setPixel(0,6);

                //black-parts
                ctx.fillStyle = 'black';pp.setPixel(11,3);
                ctx.fillStyle = '#262626';pp.setPixel(10,3);
                ctx.fillStyle = '#333333';pp.setPixel(9,3);
                ctx.fillStyle = '#444444';pp.setPixel(8,3);
                ctx.fillStyle = '#555555';pp.setPixel(7,3);
                ctx.fillStyle = '#999999';pp.setPixel(6,3);

                ctx.fillStyle = 'red';pp.setPixel(9,8);
                ctx.fillStyle = 'black';pp.setPixel(8,8);
                ctx.fillStyle = '#262626';pp.setPixel(7,8);
                ctx.fillStyle = '#333333';pp.setPixel(6,8);
            
                ctx.fillStyle = '#FFA000';pp.setPixel(5,1);
                ctx.fillStyle = 'black';pp.setPixel(4,1);
                ctx.fillStyle = '#262626';pp.setPixel(3,1);
            })
        }))


        this.ss.ignitionSize = new V2(25,50);
        this.ss.ignition = this.ss.addChild(new GO({
            position: new V2(-this.ss.body.size.x/2 - this.ss.ignitionSize.x/2, 0),
            size: this.ss.ignitionSize,
            renderValuesRound: true,
            images: [createCanvas(new V2(5, 10), (ctx, size) => {
                let pp = new PerfectPixel({context: ctx});

                for(let i = 0; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,0,${0.5+i*0.5/4})`;
                    pp.line(i, i== 0 ? 4: 3, i, i == 0? 5 :6);
                }

                for(let i = 1; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,255,${0.2+i*0.3/4})`;
                    pp.line(i, 4, i, 5);
                }
                
            }),
            createCanvas(new V2(5, 10), (ctx, size) => {
                let pp = new PerfectPixel({context: ctx});

                for(let i = 1; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,0,${0.5+i*0.4/4})`;
                    pp.line(i, i== 1 ? 4: 3, i, i == 1? 5 :6);
                }

                for(let i = 2; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,255,${0.2+i*0.2/4})`;
                    pp.line(i, 4, i, 5);
                }
                
            }),
            createCanvas(new V2(5, 10), (ctx, size) => {
                let pp = new PerfectPixel({context: ctx});

                for(let i = 2; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,0,${0.5+i*0.3/4})`;
                    pp.line(i, i== 2 ? 4: 3, i, i == 2? 5 :6);
                }

                for(let i = 3; i < size.x;i++){
                    ctx.fillStyle = `rgba(255,255,255,${0.2+i*0.1/4})`;
                    pp.line(i, 4, i, 5);
                }
                
            })
        ],
            init() {
                this.imagesIndex = 0;
                this.imgIndexDirection = 1;
                this.img = this.images[this.imagesIndex];

                this.imgToggleTimer = createTimer(150, () => {
                    this.imagesIndex+=this.imgIndexDirection;
                    if(this.imagesIndex==this.images.length-1){
                        this.imgIndexDirection = -1;
                    }
                    
                    if(this.imagesIndex == 0)
                        this.imgIndexDirection = 1;

                    this.img = this.images[this.imagesIndex]
                }, this, false)
            },
            internalUpdate(now) {
                if(this.imgToggleTimer)
                    doWorkByTimer(this.imgToggleTimer, now);
            }
        }))
        this.ss.shield = this.ss.addChild(new GO({
            position: new V2(-15, 0),
            size: new V2(this.ss.size.x, this.ss.size.y),
            init() {
                let dps = this.parent.parentScene.defaultPixelSize;
                let itemSize = new V2(dps, dps);
                let tl = new V2(-this.parent.size.x/2, -this.parent.size.x/2);
                let maxR = fastRoundWithPrecision(this.parent.size.x/dps,0);
                let maxC = fastRoundWithPrecision(this.parent.size.x/dps,0);

                for(let r = 0; r <  maxR; r++){
                    for(let c = 0; c < maxC; c++){
                        let rShifted = -fastRoundWithPrecision(maxR/2,0) + r;
                        let cShifted = -fastRoundWithPrecision(maxC/2,0) + c;
                        if((rShifted*rShifted)+(cShifted*cShifted) < (maxR/2)*(maxR/2))
                            this.addChild(new GO({
                                index: new V2(c,r),
                                position: new V2(tl.x + itemSize.x/2 + itemSize.x*c, tl.y + itemSize.y/2 + itemSize.y*r),
                                size: itemSize,
                                renderValuesRound: true,
                                tileOptimization: true,
                                img: createCanvas(new V2(1,1), (ctx, size) => {
                                    ctx.fillStyle = '#B6DBEB';
                                    ctx.fillRect(0,0, size.x, size.y)
                                }),
                                isVisible: false
                            }))
                    }
                }
            },
            hit(y) {
                let hitted = this.childrenGO.filter(c => c.index.y == y)
                .reduce((p,c) => { 
                    return p == undefined ? p : (c.index.x < p.index.x ? c : p) });

                let maxDelay = 400;
                let maxDistance = 13;
                for(let c of this.childrenGO){
                    let distance = hitted.index.distance(c.index);
                    if(distance > maxDistance){
                        continue;
                    }

                    c.addEffect(new FadeInOutEffect({
                        startDelay: fastRoundWithPrecision( maxDelay*distance/maxDistance ,0),
                        effectTime: 200, //- (300*distance/maxDistance),
                        updateDelay: 40,
                        removeEffectOnComplete: true,
                        initOnAdd: true,
                        direction: 1,
                        current: 0,
                        max: 1 - (0.9*distance/maxDistance),
                        beforeStartCallback() {
                            this.parent.isVisible = true;
                        },
                        completeCallback() {
                            this.parent.isVisible = false;
                        }
                    }))

                    // c.img = createCanvas(new V2(1,1), (ctx, size) => {
                    //     ctx.fillStyle = 'red';
                    //     ctx.fillRect(0,0, size.x, size.y)
                    // })
                }

            }
        }));

        // let flame1 = this.ss.body.addChild(new GO({
        //     position: new V2(1.55,-1.475).mul(5),
        //     size: new V2(5.5,5.5),
        //     renderValuesRound: true,
        //     img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#FFC000'; ctx.fillRect(0,0,1,1) })
        // }))

        // flame.addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, loop: true, min: 0.85}))

        this.hitTimer = createTimer(3000, () => {
            //this.ss.shield.hit(getRandomInt(2,18));
            this.enableHit = true
        }, this, false);

        this.laserImages = [createCanvas(new V2(1, 8), (ctx, size) => {
            ctx.fillStyle = '#880015'; ctx.fillRect(0,0,1,size.y);
            ctx.fillStyle = '#ED1C24'; ctx.fillRect(0,1,1,size.y-2);
            ctx.fillStyle = '#FF7F27'; ctx.fillRect(0,2,1,size.y - 4);
            ctx.fillStyle = '#FFF200'; ctx.fillRect(0,3,1,2);
        }),
        createCanvas(new V2(1, 8), (ctx, size) => {
            ctx.fillStyle = '#00CCCC'; ctx.fillRect(0,0,1,size.y);
            ctx.fillStyle = '#00F2F2'; ctx.fillRect(0,1,1,size.y-2);
            ctx.fillStyle = '#00FFFF'; ctx.fillRect(0,2,1,size.y - 4);
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,3,1,2);
        })]
        this.lasersTimer = createTimer(500, () => {
            let y =  this.ss.position.y + getRandomInt(-80, 80);
            let x = this.sceneCenter.x;

            let hitY = undefined;
            if(this.enableHit){
                hitY = getRandomInt(2,18);
                y = this.ss.position.y-this.ss.size.y/2-20 + hitY*this.defaultPixelSize;
                x = -this.sceneCenter.x + this.ss.position.x;
            }
            

            let laser = this.addGo(new MovingGO({
                position: new V2(-this.sceneCenter.x, y),
                size: new V2(this.viewport.x, getRandomInt(5,10)),
                img: this.laserImages[getRandomInt(0, this.laserImages.length-1)],
                destination: new V2(x, y),
                speed: 150,
                setDestinationOnInit: true,
                enableHit: hitY,
                destinationCompleteCallBack() {
                    let ps = this.parentScene;
                    if(this.enableHit){
                        ps.ss.shield.hit(this.enableHit);
                        this.position.x = -ps.sceneCenter.x + ps.ss.position.x - ps.ss.size.x/2;
                    }
                    else {
                        this.position.x = ps.sceneCenter.x;
                    }
                    
                    this.needRecalcRenderProperties = true;
                    this.addEffect(new FadeOutEffect({effectTime: 250, updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true}))
                }
            }), getRandomBool() ? 10 : 11)

            if(this.enableHit)
                this.enableHit = false

        },this, false)
    }

    afterMainWork(now){
        if(this.lasersTimer)
            doWorkByTimer(this.lasersTimer, now);

        if(this.hitTimer)
            doWorkByTimer(this.hitTimer, now);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}