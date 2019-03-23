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

        this.tower.top.antennas.beacons[0].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, loop: true}))
        this.tower.top.antennas.beacons[1].addEffect(new FadeInOutEffect({effectTime: 1000, updateDelay: 50, startDelay: 1000,loop: true}))
    }
}