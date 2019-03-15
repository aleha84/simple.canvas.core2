class SpaceportScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true
            }
        }, options)

        super(options);
    }

    start(){
        this.backgroundImage = colorTransitionHelper.create({
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
            position: new V2(this.viewport.x + 150, 100)//this.sceneCenter.x
        }),10);

        this.ground = this.addGo(new Ground({
            size: new V2(this.viewport.x, 50),
            position: new V2(this.sceneCenter.x, this.viewport.y- 25)
        }), 5)

        for(let i = 0; i < 4; i++){
            this.cloudsGenerator(new V2(i *this.viewport.x/4,  getRandomInt(75,125)))
        }

        this.cloudGeneratorTImer = createTimer(15000*4, () => this.cloudsGenerator(), this, true);15000
    }

    cloudsGenerator(position) {
        let cloudSize = new V2(getRandomInt(100, 250), getRandomInt(10, 25));
        position = position || new V2(-cloudSize.x, getRandomInt(75,125));
        this.addGo(new MovingGO({
            position: position,
            size: cloudSize,
            destination: new V2(this.viewport.x + cloudSize.x, position.y),
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: true,
            speed: 0.2/4, //0.2
            renderValuesRound: true,
            img: createCanvas(cloudSize, (ctx,size) => {
                let border = fastRoundWithPrecision(size.y/3);
                let topColor = '#FCF4FF';
                let midColor = '#F8E5FF'
                let bottomColor = '#F3CCFF';
                for(let r = 0; r < size.y; r++){
                    let start = getRandomInt(0, size.x/4);
                    let length = fastRoundWithPrecision(size.x/10, 0) + r/(size.y-1)* getRandomInt(size.x/2, size.x);

                    if(r> border){
                        ctx.fillStyle = midColor;
                        if(getRandomInt(0, 3 - fastRoundWithPrecision(3*(r-border)/(size.y-border)))==0){
                            ctx.fillStyle = bottomColor;
                        }
                        ctx.fillRect(start, r, length, 1);

                        if(getRandomBool()){
                            ctx.fillStyle = topColor;
                            ctx.fillRect(getRandomInt(0, size.x/2), r, getRandomInt(1,size.x/5), 1);
                        }
                    }
                    else {
                        ctx.fillStyle = topColor;
                        ctx.fillRect(start, r, length, 1);
                    }
                    
                }
            }),
            // beforeDead() {
            //     this.parentScene.cloudsGenerator();
            // }
        }),1);
    }

    afterMainWork(now){
        if(this.cloudGeneratorTImer)
            doWorkByTimer(this.cloudGeneratorTImer, now);
    }

    backgroundRender(){
        // /this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.backgroundImage, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }
}


