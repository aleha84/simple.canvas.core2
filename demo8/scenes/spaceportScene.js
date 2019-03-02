class SpaceportScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            
        }, options)

        super(options);
    }

    start(){
        this.backgroundImage 
        = colorTransitionHelper.create({
            size: this.viewport,
            type: 'lines',
            items: [
                {
                    color: '#FFFEBA',//'#FFFEBA',
                    position: 0,
                    startTransitionFrom: 90
                },
                {
                    color: '#FFF7BA',//'#FFBDBB',
                    position: 100,
                    startTransitionFrom: 125
                },
                {
                    color: '#FFE4BA',//'#D2BBDA',
                    position: 130,
                    startTransitionFrom: 160
                },
                {
                    color: '#FFCDBA',//'#AE9BB5',
                    position: 175
                }
            ]
        });

        this.cargoShip = this.addGo(new CargoShip({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y)
        }));
    }

    backgroundRender(){
        // /this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.backgroundImage, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }
}

class CargoShip extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(100, 20)
        }, options);

        super(options)
    }

    init() {
        this.body = this.addChild(new GO({
            renderValuesRound: true,
            size: this.size,
            position: new V2(),
            img: PP.createImage(spacePortImages.cargoSpaceShipBase)
        }));

        this.cargo = this.addChild(new GO({
            position: new V2(1,4),
            size: new V2(60,20),
            img: PP.createImage(spacePortImages.cargoContainer)
        }))

        this.frontalThruster = this.addChild(new GO({
            position: new V2(-38, 7),
            size: new V2(8,15),
            img: PP.createImage(spacePortImages.thruster)
        }));

        this.frontalThruster.fire = this.frontalThruster.addChild(new GO({
            size: new V2(6,15),
            position: new V2(0,15),
            img: PP.createImage(spacePortImages.ignite)
        }));

        this.rearThruster = this.addChild(new GO({
            position: new V2(40, 7),
            size: new V2(8,15),
            img: PP.createImage(spacePortImages.thruster)
        }));

        this.rearThruster.fire = this.rearThruster.addChild(new GO({
            size: new V2(6,15),
            position: new V2(0,15),
            img: PP.createImage(spacePortImages.ignite)
        }))
    }
}
