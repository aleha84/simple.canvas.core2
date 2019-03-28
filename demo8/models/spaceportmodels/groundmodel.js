class Ground extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(500, 100),
        }, options);

        super(options)

        
    }

    init(){
        let that = this;

        this.background = this.addChild(new GO({
            size: this.size.clone(),
            position: new V2(),
            img: colorTransitionHelper.create({
                size: this.size,
                type: 'lines',
                items: [
                    {
                        color: '#B5946A',
                        position: 0,
                        startTransitionFrom: 2,
                        noNextColorPropbabilityCheck: true,
                    },
                    {
                        color: '#C4A073',
                        position: 6,
                        startTransitionFrom: 9,
                        noNextColorPropbabilityCheck: true,
                    },
                    {
                        color: '#CCA678',
                        position: 15,
                        startTransitionFrom: 25
                    },
                    {
                        color: '#DBB181',
                        position: 35,
                        startTransitionFrom: 45
                    },
                    {
                        color: '#E2B985',
                        position: this.size.y
                    }
                ]
            })
        }));

        this.hangingWireImg = createCanvas(new V2(spacePortImages.hangingWireImages.length*37, 30), (ctx, size) => {
            for(let i = 0; i < spacePortImages.hangingWireImages.length; i++){
                ctx.drawImage(PP.createImage(spacePortImages.hangingWireImages[i]), 37*i,0);
            }
        })

        this.farAwayCity = this.addChild(new GO({
            position: new V2(200, -35),
            size: new V2(100, 20),
            img: PP.createImage(spacePortImages.farAwayCity)
        }))

        
        
        this.landingPad = this.addChild(new GO({
            size: new V2(140,20),
            position: new V2(0, -4),
            img: PP.createImage(spacePortImages.landingPad)
        }))

        this.tower = this.addChild(new GO({
            size: new V2(25,60),
            position: new V2(-150, -30),
            img: PP.createImage(spacePortImages.buildings.tower)
        }))

        this.tower.top = this.tower.addChild(new GO({
            size: new V2(10, 10),
            position: new V2(2,-22),
            img: PP.createImage(spacePortImages.buildings.smallTower)
        }));

        let antennasSize = new V2(3, 30);
        this.tower.top.antennas = this.tower.top.addChild(new GO({
            size: antennasSize,
            position: new V2(0, -18),
            img: createCanvas(antennasSize, (ctx, size) => {
                ctx.fillStyle = '#3F3F3F';
                ctx.fillRect(0, 15, 1, size.y/2);
                ctx.fillRect(2, 0, 1, size.y);

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 15, 1, 1);
                ctx.fillRect(2, 0, 1, 1);
            })
        }));

        this.administrationBuilding = this.addChild(new GO({
            size: new V2(70,40),
            position: new V2(140, -22),
            img: PP.createImage(spacePortImages.buildings.administration)
        }))

        this.utilityHangar2 = this.addChild(new GO({
            size: new V2(30,20),
            position: new V2(90,-13),
            img: PP.createImage(spacePortImages.buildings.hangar2)
        }));

        this.utilityHangar1 = this.addChild(new GO({
            size: new V2(30,20),
            position: new V2(70,-13),
            img: PP.createImage(spacePortImages.buildings.hangar1)
        }));

        this.powerUtility = this.addChild(new GO({
            size: new V2(15,15),
            position: new V2(-100, -15),
            img: PP.createImage(spacePortImages.buildings.powerUtility)
        }));

        this.powerUtilityIndicatorImg = createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'blue'; ctx.fillRect(0,0,1,1); });
        this.powerUtility.indicators = [
            this.powerUtility.addChild(new GO({
                size: new V2(2,1),
                position: new V2(-2.5,-3),
                img: this.powerUtilityIndicatorImg
            })),
            this.powerUtility.addChild(new GO({
                size: new V2(2,1),
                position: new V2(-2.5,-2),
                img: this.powerUtilityIndicatorImg
            })),
            this.powerUtility.addChild(new GO({
                size: new V2(2,1),
                position: new V2(-2.5,-1),
                img: this.powerUtilityIndicatorImg
            }))
        ]

        this.powerUtility.indicators[0].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, loop: true, initOnAdd: true, delayOnLoop: 2000}))
        this.powerUtility.indicators[1].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, startDelay: 1000,loop: true, initOnAdd: true, delayOnLoop: 2000}))
        this.powerUtility.indicators[2].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, startDelay: 2000,loop: true, initOnAdd: true, delayOnLoop: 2000}))

        this.hangingWire = this.addChild(new GO({
            size: new V2(37,30),
            position: new V2(-123, -34),
            img: this.hangingWireImg,
            isAnimated: true,
            animation: {
                framesRowsCount: 1,
                frameChangeDelay: 1500,
                loop: true,
                totalFrameCount: spacePortImages.hangingWireImages.length,
                framesInRow: spacePortImages.hangingWireImages.length,
                destinationFrameSize:new V2(37,30),
                sourceFrameSize: new V2(37,30)
            }
        }))

        this.tower.top.antennas.beacons = [
            this.tower.top.antennas.addChild(new GO({
               size: new V2(1,1),
               position: new V2(-1, 0.5),
               img: createCanvas(new V2(1,1), (ctx,size) => { ctx.fillStyle = '#FF0000'; ctx.fillRect(0,0,1,1) }) 
            })),
            this.tower.top.antennas.addChild(new GO({
                size: new V2(1,1),
                position: new V2(1, -14.5),
                img: createCanvas(new V2(1,1), (ctx,size) => { ctx.fillStyle = '#FF0000'; ctx.fillRect(0,0,1,1) }) 
             }))            
        ]

        let startFromX = 71;
        let stepX = 20;
        for(let i = 0; i < 10; i++){
            this.addChild(new GO({
                position: new V2(startFromX + stepX*i, 0),
                size: new V2(30, 10),
                img: createCanvas(new V2(30, 10), (ctx, size) => {
                    ctx.drawImage(PP.createImage(spacePortImages.roadParts.straight), 0, 0, size.x, size.y)
                    let darkParsCount = getRandomInt(2,5);
                    ctx.fillStyle = '#afb0a4';
                    for(let i = 0; i < darkParsCount; i++){
                        ctx.fillRect(getRandomInt(0, size.x), getRandomInt(3,8), 1, 1);
                    }

                    let darkSoilCount = getRandomInt(1,4);
                    ctx.fillStyle = '#C4A073';
                    for(let i = 0; i < darkSoilCount; i++){
                        ctx.fillRect(getRandomInt(9, size.x-1), 9, 1, 1);
                    }
                }) 
            }))
        }
        
for(let i = 0; i < 5; i++){
    this.addChild(new GO({
        size: new V2(100,30),
        position: new V2(-200, 6),
        img: createCanvas(new V2(100,30), (ctx,size) => {
            ctx.fillStyle = '#CDCEC8';
            for(let i = 0; i < 15; i++){
                ctx.fillRect(
                    fastRoundWithPrecision(that.randn_bm()*size.x), 
                    fastRoundWithPrecision(that.randn_bm()*size.y), 
                    1,1);
            }
            
        })
    }));
}

        this.addChild(new GO({
            size: new V2(5,5),
            position: new V2(-200, 6),
            img: PP.createImage(spacePortImages.debrish[0])
        }));

        this.addChild(new GO({
            size: new V2(5,5),
            position: new V2(-170, 18),
            img: PP.createImage(spacePortImages.debrish[1])
        }))

        this.addChild(new GO({
            size: new V2(5,5),
            position: new V2(-130, -5),
            img: PP.createImage(spacePortImages.debrish[2])
        }))

        this.addChild(new GO({
            size: new V2(5,5),
            position: new V2(-75, 10),
            img: PP.createImage(spacePortImages.debrish[3])
        }))

        this.smallBarrier = this.addChild(new GO({
            size: new V2(10,20),
            position: new V2(67,-8),
            img: PP.createImage(spacePortImages.buildings.smallBarrier)
        }))

        this.tower.top.antennas.beacons[0].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, loop: true}))
        this.tower.top.antennas.beacons[1].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, startDelay: 1000,loop: true}))
    }

    randn_bm() {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
        return num;
    }
}