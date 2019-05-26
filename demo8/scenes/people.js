class PeopleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false, 
                additional: []
            }
        }, options)

        super(options);
    }

    start() {
        this.yClamps = [-20, 20];

        this.roadSize = new V2(this.viewport.x, this.viewport.y);
        
        let alternateColors = [
        ];

        for(let i = -10; i < 5; i++){
            if(i == 0)
                continue;

            alternateColors[alternateColors.length] = colors.changeHSV({initialValue: '#BEBEBC', parameter: 'v', amount: i, isRgb: false});
        }

        this.topDivider = this.addGo(new GO({
            position: new V2(240, 112),
            size: new V2(120, 226),
            img: createCanvas(new V2(120, 226), (ctx, size) => {
                
                ctx.fillStyle = '#DBDBDB'
                let pp = new PerfectPixel({ context: ctx });

                pp.lineV2(new V2(30, size.y), new V2(size.x, 55))
                pp.lineV2(new V2(31, size.y), new V2(size.x+1, 55))
            })
        }));

        this.topFundament = this.addGo(new Go({
            position: new V2(150, 112),
            size: new V2(this.viewport.x, 226),
            img: createCanvas(new V2(this.viewport.x, 200), (ctx, size) => {
                ctx.fillStyle = '#BEBEBC';
                ctx.fillRect(0,0, size.x, size.y);

                for(let i = 0; i < 1000; i++){
                    ctx.fillStyle = alternateColors[getRandomInt(0, alternateColors.length-1)];
                    ctx.fillRect(getRandomInt(170, size.x), getRandomInt(0, size.y), getRandomInt(1,3), 1);
                }

                let pp = new PerfectPixel({ context: ctx });
                ctx.fillStyle = '#757577';
                for(let i = 0; i < 80; i++){
                    pp.lineV2(new V2(300 + i, 0), new V2(170 + i, size.y))
                }

                ctx.fillStyle = '#A5A5A4';
                pp.lineV2(new V2(299 , 0), new V2(169, size.y))
                pp.lineV2(new V2(299 , 1), new V2(170, size.y-1))

                ctx.fillStyle = '#BEBEBC';
                pp.lineV2(new V2(298, 0), new V2(168 , size.y))
                pp.lineV2(new V2(297, 0), new V2(167, size.y))
            })
        }));

        this.bottomDivider = this.addGo(new GO({
            position: new V2(115, 395),
            size: new V2(120, 210),
            img: createCanvas(new V2(120, 226), (ctx, size) => {
                
                ctx.fillStyle = '#DBDBDB'
                let pp = new PerfectPixel({ context: ctx });

                pp.lineV2(new V2(0, size.y), new V2(size.x-2, 0))
                pp.lineV2(new V2(1, size.y), new V2(size.x-1, 0))
            })
        }), 100);

        this.bottomFundament = this.addGo(new Go({
            position: new V2(43, 430),
            size: new V2(90, 140),
            img: createCanvas( new V2(90, 140), (ctx, size) => {
                ctx.fillStyle =  '#BEBEBC';
                ctx.fillRect(0,0, size.x, size.y);

                for(let i = 0; i < 500; i++){
                    ctx.fillStyle = alternateColors[getRandomInt(0, alternateColors.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y), getRandomInt(1,3), 1);
                }

                let pp = new PerfectPixel({ context: ctx });
                ctx.fillStyle = '#757577';
                for(let i = 0; i < 80; i++){
                    pp.lineV2(new V2(size.x + i, 0), new V2(size.x - 80 + i, size.y))
                }

                ctx.fillStyle = '#A5A5A4';
                pp.lineV2(new V2(size.x -1 , 0), new V2(size.x - 80 - 1, size.y))
                pp.lineV2(new V2(size.x-1, 1), new V2(size.x - 80, size.y-1))

                // ctx.fillStyle = '#BEBEBC';
                // pp.lineV2(new V2(298, 0), new V2(168 , size.y))
                // pp.lineV2(new V2(297, 0), new V2(167, size.y))
            })
        }))

        this.sideWalkSize = new V2(this.viewport.x, this.yClamps[1] - this.yClamps[0] + 10);
        this.sideWalk = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.sideWalkSize,
            
            img: createCanvas(this.sideWalkSize, (ctx, size) => {
                ctx.fillStyle = '#BEBEBC';
                ctx.fillRect(0,0, size.x, size.y);

                ctx.fillStyle = '#999999';
                ctx.fillRect(0, size.y- 1, size.x, 1);

                // ctx.fillStyle = '#A5A5A5';
                // ctx.fillRect(0, size.y- 3, size.x, 1);

                // ctx.fillStyle = '#7F7F7F';
                // for(let i = 0; i < 20; i++){
                //     // ctx.fillRect(i*size.x/20, size.y-2, 1,2);
                //     // ctx.fillRect(i*size.x/20 + 1, size.y-3, 1,1);
                //     ctx.fillRect(i*size.x/20, size.y-1, 1,1);
                // }

                ctx.fillStyle = '#BEBEBC';

                for(let i = 0; i < 500; i++){
                    ctx.fillStyle = alternateColors[getRandomInt(0, alternateColors.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y-4), getRandomInt(1,3), 1);
                }

                let pp = new PerfectPixel({ context: ctx });
                ctx.fillStyle = '#757577';
                for(let i = 0; i < 80; i++){
                    pp.lineV2(new V2(170+ i, 0), new V2(140 + i, size.y))
                }

                ctx.fillStyle = '#DBDBDB';

                let counterMax = 4;
                let counter = counterMax;
                let drawZebra = true;
                for(let i = 0; i < 60; i++){
                    if(drawZebra)
                        pp.lineV2(new V2(174+ i, 10), new V2(156 + i, size.y-10));

                    counter--;
                    if(counter == 0){
                        counter = counterMax;
                        drawZebra = !drawZebra;
                    }
                }

                ctx.fillStyle = '#A5A5A4';
                pp.lineV2(new V2(169, 0), new V2(139, size.y))
                pp.lineV2(new V2(169, 1), new V2(140, size.y-1))
            })
        }), 1);

        this.buildings = [
        ]

        for(let j = 9; j >= 0; j--){
            this.buildings = [...this.buildings, ...new Array(7 + (9-j)).fill().map((el, i) => 150 + (9 - j)*15 - 25*i).map((el) => this.buildingGenerator(j, new V2(el, 175 - (9- j)*25)))]
        }

        this.buildingGenerator(9, new V2(300, 175)),
        this.buildingGenerator(9, new V2(275, 175)),

        this.buildingGenerator(8, new V2(290, 150)),

        this.buildingGenerator(7, new V2(305, 125));

        for(let j = 0; j < 12; j++){
            this.buildings = [...this.buildings, ...new Array(9).fill().map((el, i) =>420 - 25*i - j*14).map((el) => this.buildingGenerator(71 + j, new V2(el, 270 + j*30), j == 0 ? 1 : undefined))]
        }

        this.buildingGenerator(71, new V2(55, 335), 1); this.buildingGenerator(71, new V2(30, 335), 1); this.buildingGenerator(71, new V2(5, 335), 1); 
        this.buildingGenerator(72, new V2(40, 360), getRandomInt(1,2)); this.buildingGenerator(72, new V2(15, 360),getRandomInt(1,2)); 
        this.buildingGenerator(73, new V2(25, 385));this.buildingGenerator(73, new V2(0, 385));
        this.buildingGenerator(74, new V2(10, 410));
        this.buildingGenerator(75, new V2(-5, 435));
        // this.buildingGenerator(76, new V2(-5, 460));
        

        this.tramRoad = this.addGo(new GO({
            position: new V2(150, 280),
            size: new V2(this.viewport.x, 10),
            init() {
                this.road = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size) => {
                        ctx.fillStyle = '#565156';
                        let pp = new PerfectPixel({context: ctx});
                        for(let x = 0; x < size.x; x++){
                            if(x % 5 == 0)
                                {
                                    pp.lineV2(new V2(x, 1), new V2(x - 5, 8));
                                    pp.lineV2(new V2(x+1, 1), new V2(x+1 - 5, 8));
                                }
                                
                        }


                        ctx.fillStyle = '#202030';
                        ctx.fillRect(0,3, size.x, 1);
                        ctx.fillRect(0,6, size.x, 1)
                    })
                }));

                this.tram = this.addChild(new GO({
                    position: new V2(-200,-9),
                    size: new V2(40, 20),
                    img: PP.createImage(peopleImages.tramModel()),
                    renderValuesRound: true,
                    speed: 1,
                    init() {
                        this.moveTimer = this.registerTimer(createTimer(25, () => {
                            this.position.x += this.speed;
                            this.needRecalcRenderProperties = true;
                        }, this, true));
                    }
                }))
            }
        }), 60)

        this.park = this.addGo(new GO({
            position: new V2(85, 325),
            size: new V2(170, 75),
            img: createCanvas( new V2(170, 75), (ctx, size) => {
                ctx.fillStyle = '#649B4A';
                ctx.fillRect(0,0, size.x, size.y);

                let colors = ['#85D155', '#89B852', '#437841', '#E0E147']
                for(let i = 0; i < 400; i++){
                    ctx.fillStyle = colors[getRandomInt(0, colors.length-1)];
                    ctx.fillRect(getRandomInt(0, size.x), getRandomInt(0, size.y), 1, 1);
                }

                ctx.fillStyle = '#757577';
                let pp = new PerfectPixel({context: ctx});
                for(let x =136; x < size.x + 50; x++){
                    pp.lineV2(new V2(x, 0), new V2(x -50, size.y));
                }

            }),
            init() {
                let forestScene = new PixelForestScene({name:'forest',});
                forestScene.start();

                this.upperFence = this.addChild(new GO({
                    position: new V2(-15, -40),
                    size: new V2(130, 9),
                    renderValuesRound: true,
                    img: createCanvas( new V2(90, 9), (ctx, size) => {
                        ctx.fillStyle = '#B24723';
                        ctx.fillRect(0,0, size.x, size.y);

                        let c = [colors.changeHSV({initialValue:ctx.fillStyle, parameter: 'v', amount: -10}), colors.changeHSV({initialValue:ctx.fillStyle, parameter: 'v', amount: 10})]
                            
                        for(let i = 0; i < 200; i++){
                            ctx.fillStyle = c[getRandomInt(0, c.length-1)];
                            ctx.fillRect(getRandomInt(0, size.x),getRandomInt(0, size.y), 1, 1);
                        }

                        ctx.fillStyle = '#FFBFB4';
                        ctx.fillRect(0,3, size.x, 1);
                        ctx.fillRect(0,6, size.x, 1);

                        for(let i = 0; i < 13; i++){
                            ctx.fillRect(i*fastRoundWithPrecision(size.x/13),0, 1, 3);
                            ctx.fillRect(i*fastRoundWithPrecision(size.x/13) + 3,4, 1, 3);
                            ctx.fillRect(i*fastRoundWithPrecision(size.x/13) + 6,7, 1, 3);
                        }

                        ctx.fillStyle = '#DB572B';
                        ctx.fillRect(0, 0, size.x, 1);
                    })
                }))

                this.pond = this.addChild(new GO({
                    position: new V2(-40, 0),
                    size: new V2(50, 20),
                    img: PP.createImage(peopleImages.pond),
                    init() {
                        this.ripple = [
                            new V2(0,0), new V2(-1, 1), //new V2(-2, 2), 
                             new V2(15,-2), new V2(14, -1), //new V2(8, 0), new V2(7, 1),
                            new V2(-15, 2), new V2(-16, 3), //new V2(-17, 4)
                            new V2(0, 5)
                        ].map((p, i) => (this.addChild(new GO({
                            position: p,
                            size: new V2(3, 1),
                            img: createCanvas(new V2(1,1), (ctx) => {
                                ctx.fillStyle = '#8BF3F3';
                                ctx.fillRect(0,0,1,1)
                            }),
                        }))));

                        this.dir = 1;
                        this.registerTimer(createTimer(1000, () => {
                            this.ripple.forEach((r, i) => {
                                r.position.x += 1*this.dir;
                                r.needRecalcRenderProperties = true;
                            })

                            this.dir*=-1;
                        }, this, true));
                    }
                }))

                this.trees = [new V2( -83, -35), new V2(-70, -35), new V2(-56, -33), new V2(-42, -34), new V2( -28, -35), new V2( -14, -36), new V2( 0, -34),
                    new V2( 14, -34), new V2( 27, -35),
                    new V2( 20, -25), new V2( 12, -15), new V2( 4, -5), new V2( -4, 5), new V2( -12, 15),
                    new V2( -26, 15), new V2( -40, 15), new V2( -54, 16), new V2( -68, 13), new V2( -82, 15)
                ].map(p => (this.addChild(new Tree({
                    position: p,
                    size: new V2(12, 28),
                    images: forestScene.treeImgGenerator(0.1),
                    initCompleted() {
                        for(let i = 0; i < this.images.length;i++){
                            let that = this;
                            this.images[i] = createCanvas(this.size, (ctx, size) => {
                                ctx.save();
                                ctx.scale(-1, 1);
                                ctx.drawImage(that.images[i], 0, 0, size.x*-1, size.y);
                                ctx.restore();
                            })
                        }

                        this.shadow = this.addChild(new GO({
                            position: new V2(-5,12),
                            size: new V2(10, 6),
                            renderValuesRound: true,
                            img: createCanvas(new V2(10, 6), (ctx, size) => {
                                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                                ctx.fillRect(0,3,size.x,1)
                                ctx.fillRect(0,4,size.x,1)
                                ctx.fillRect(1,2,6,1)
                                ctx.fillRect(2,1,5,1)
                                ctx.fillRect(0,5,5,1)
                            })
                        }))
                    }
                }))));

                this.lowerFence = this.addChild(new GO({
                    position: new V2(-43, 33),
                    size: new V2(90, 9),
                    renderValuesRound: true,
                    img: createCanvas( new V2(90, 9), (ctx, size) => {
                        ctx.fillStyle = '#B24723';
                        ctx.fillRect(0,0, size.x, size.y);

                        let c = [colors.changeHSV({initialValue:ctx.fillStyle, parameter: 'v', amount: -10}), colors.changeHSV({initialValue:ctx.fillStyle, parameter: 'v', amount: 10})]
                            
                        for(let i = 0; i < 200; i++){
                            ctx.fillStyle = c[getRandomInt(0, c.length-1)];
                            ctx.fillRect(getRandomInt(0, size.x),getRandomInt(0, size.y), 1, 1);
                        }

                        ctx.fillStyle = '#FFBFB4';
                        ctx.fillRect(0,3, size.x, 1);
                        ctx.fillRect(0,6, size.x, 1);

                        for(let i = 0; i < 10; i++){
                            ctx.fillRect(i*size.x/10,0, 1, 3);
                            ctx.fillRect(i*size.x/10 + 3,4, 1, 3);
                            ctx.fillRect(i*size.x/10 + 6,7, 1, 3);
                        }

                        ctx.fillStyle = '#DB572B';
                        ctx.fillRect(0, 0, size.x, 1);
                    })
                }))

                this.sideFence = this.addChild(new GO({
                    position: new V2(27, -3),
                    size: new V2(50, this.size.y + 8),
                    renderValuesRound: true,
                    img: createCanvas(new V2(50, this.size.y), (ctx, size) => {
                        // ctx.fillStyle = 'rgba(255,255,255, 0.2)'; //
                        // ctx.fillRect(0,0, size.x, size.y);

                        ctx.fillStyle = '#CC5128';
                        let pp = new PerfectPixel({context: ctx});
                        for(let i = 0; i < 8; i++)
                            pp.lineV2(new V2(size.x-1, i), new V2(0, size.y-8 + i))

                        ctx.fillStyle = '#DB572B';
                        pp.lineV2(new V2(size.x-2, 0), new V2(-1, size.y-8 ))
                        pp.lineV2(new V2(size.x-1, 0), new V2(0, size.y-8))

                        ctx.fillStyle = '#FFBFB4';
                        pp.lineV2(new V2(size.x-1, 2), new V2(0, size.y-8 + 2))
                        pp.lineV2(new V2(size.x-1, 5), new V2(0, size.y-8 + 5))
                        
                    })
                }))
            }
        }), 70)

        this.registerTimer(createTimer(250, () => {
            this.peopleGenerator();
        }, this, true))

        this.registerTimer(createTimer(17000, () => {
            this.tramRoad.tram.position.x = -200;
        }, this, true))
    }

    buildingGenerator(layer = 1, position, levels) {
        return this.addGo(new GO({
            position: position,
            size: new V2(30, 100),
            img: createCanvas(new V2(30, 100), (ctx, size) => {
                
                let colors = {
                    main: '#CE9D23',
                    second: '#E5AC27'
                };

                switch(getRandomInt(1,5)){
                    case 2: 
                        colors = {
                            main: '#42725A',
                            second: '#589978'
                        }
                        break;
                    case 3: 
                        colors = {
                            main: '#CE9D23',
                            second: '#E5AC27'
                        }
                        break;
                    case 4: 
                        colors = {
                            main: '#B5533D',
                            second: '#E5694E'
                        }
                        break;
                    case 5: 
                        colors = {
                            main: '#7F3C2D',
                            second: '#B25340'
                        }
                        break;
                    //
                }

                let model = peopleImages.fullHouse();
                model.main.layers[0].strokeColor = colors.main;
                model.main.layers[0].fillColor = colors.main;

                model.main.layers[47].strokeColor = colors.second;
                model.main.layers[47].fillColor = colors.second;

                //
                let img = PP.createImage(model);
                let imgSize = new V2(30, 50);
                ctx.drawImage(img, 0, size.y -imgSize.y, imgSize.x, imgSize.y)
                if(levels == undefined)
                    levels = getRandomInt(1, 4);
                if(levels > 1){
                    let shiftY = 4;
                    switch(levels){
                        case 2: 
                        case 4:
                            shiftY = 29;
                            break;
                        case 3: 
                            shiftY = 39;
                            break;
                    }
                    ctx.drawImage(img,  0, 0, imgSize.x, 33, 0, shiftY, imgSize.x, 33)
                    if(levels > 3){
                        ctx.drawImage(img,  0, 0, imgSize.x, 33, 0, 8, imgSize.x, 33)
                    }
                }
                
            })
        }), layer)
    }

    peopleGenerator() {
        
        let yShift = getRandomInt(this.yClamps[0], this.yClamps[1]);
        let isLeft = getRandomBool();
        this.addGo(new PixelMan({
            position: new V2(isLeft ? -10 : this.viewport.x + 10, yShift + this.sceneCenter.y-3),
            xDestination:  isLeft ? this.viewport.x + 10 : -10,
            moveMaxMultiplier: getRandom(1,5),
            bounceMaxDivider: getRandom(4,10),
            moveDirection: isLeft ? 1: -1,
        }), yShift - this.yClamps[0] + 10);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#757577');
    }

    preMainWork() {
        this.debug.additional[0] = 0;
    }
}

class PixelMan extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(2,6),
            renderValuesRound: true,
            xDestination: 300,
            bounceMaxDivider: 4,
            moveMaxMultiplier: 1,
            value: 1,
            moveDirection: 1,
        }, options)

        super(options);
    }

    // destinationCompleteCheck(){
    //     return Math.abs(this.position.x-this.originX) > 50
    // }

    // destinationCompleteCallBack() {
    //     this.originX = this.position.x;
    //     this.mDirection*=-1;
    //     this.setDestination(new V2((this.mDirection > 0 ? 1:-1)*50 ,0), true);
    // }

    afterUpdateCompleted(){
        this.parentScene.debug.additional[0]++;
    }
    init() {
        this.bounceStepDuration = 10;
        this.bounceMax = this.size.y/this.bounceMaxDivider;
        this.moveMax = this.size.x*this.moveMaxMultiplier;

        this.shadowSize = new V2(3,1);

        this.shadow = this.addChild(new GO({
            renderValuesRound: true,
            size: this.shadowSize,
            position: new V2(-1.5, this.size.y/2 -0.5),
            img: createCanvas(new V2(1,1), (ctx, size) => {
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(0,0,size.x, size.y);
            })
        }));

        this.man = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(0,0),
            size: this.size
        }));

        this.bounce = { 
            time: 0, duration: this.bounceStepDuration,startValue: this.man.position.y, change: -this.bounceMax, max: this.bounceMax, direction: -1, 
            type: 'sin', method: 'out', 
        };

        this.move = {
            time: 0, duration: this.bounceStepDuration*2,startValue: this.position.x, change: this.moveMax*this.moveDirection, max: this.moveMax, direction: this.moveDirection, 
            type: 'linear', method: 'base', 
        }

        this.shadow.originX = this.shadow.position.x;

        

        this.topColor = hsvToHex({hsv:[getRandomInt(0,360), 77,77]})//'#C6752F';
        this.skinColor = '#ED9B79';
        this.lowerColor = hsvToHex({hsv:[getRandomInt(0,360), 56,56]})//'#7E9641';

        this.imgLeft = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        this.imgRight = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = this.topColor;
            ctx.fillRect(0,0, size.x, 1);
            ctx.fillRect(0,1, 1, 1);
            ctx.fillStyle = this.skinColor;
            ctx.fillRect(size.x-1,1, 1, 1);
            ctx.fillStyle = this.lowerColor;
            ctx.fillRect(0,2, size.x, size.y);
        });

        
        this.choseImg();
        //this.setDestination(new V2(50, 0), true);

        this.startBounce();
    }

    choseImg() {
        this.man.img = this.move.direction > 0 ? this.imgRight : this.imgLeft;
    }

    startBounce() {
        this.bounceTimer = this.registerTimer(createTimer(20, () => {
            let b = this.bounce;
            let m = this.move;
            let y = easing.process(b);
            
            this.man.position.y = y;
            this.shadow.position.x = this.shadow.originX + y*1;
            this.position.x = easing.process(m);

            this.needRecalcRenderProperties = true;

            b.time++;
            m.time++;
            if(b.time > b.duration){
                b.direction*=-1;

                b.time = 0;
                b.startValue = this.man.position.y;
                b.change = (b.direction > 0 ? 1 : -1) * b.max;
                b.method =this.direction > 0 ? 'in' : 'out'

                if(b.direction < 0){
                    m.time = 0;
                    m.startValue = this.position.x;

                    // if(Math.abs(this.position.x-this.originX) > 50){
                    //     this.originX = this.position.x;
                    //     //this.mDirection*=-1;
                    //     m.direction*=-1;
                    //     m.change = m.direction*m.max;
                    //     this.choseImg();
                    // }

                    if((m.direction > 0 && this.position.x > this.xDestination) || (m.direction < 0 && this.position.x < this.xDestination)){
                        this.setDead();
                    }
                }
            }
            // else {
            //     this.position.x += this.speed*this.mDirection;
            // }

        }, this, true));
    }

    stopBounce() {
        this.unregTimer(this.bounceTimer);
    }
}