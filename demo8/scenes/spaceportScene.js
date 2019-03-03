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
            position: new V2(this.sceneCenter.x, 100)
        }),10);

        // this.cloudSize = new V2(200, 20);
        // this.addGo(new GO({
        //     position: new V2(this.sceneCenter.x, 50),
        //     size: this.cloudSize,
        //     img:  this.cloudsGenerator(this.cloudSize)
        // }))

        for(let i = 0; i < 4; i++){
            this.cloudsGenerator(new V2(i *this.viewport.x/4,  getRandomInt(75,125)))
        }

        this.cloudGeneratorTImer = createTimer(15000, () => this.cloudsGenerator(), this, true);
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
            speed: 0.2,
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

class CargoShip extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(100, 20),
            thrustersAngle: -10,
            levitation: {
                time: 0, 
                duration: 40, 
                startValue: 0, 
                change: 5, 
                min: 0,
                max: 5,
                direction: 1,
                type: 'quad',
                method: 'inOut',
            },
        }, options);

        super(options)
    }

    init() {
        
        let igniteImg = createCanvas(new V2(spacePortImages.igniteImages.length*6, 15), (ctx, size) => {
            for(let i = 0; i < spacePortImages.igniteImages.length; i++){
                ctx.drawImage(PP.createImage(spacePortImages.igniteImages[i]), 6*i,0);
            }
        })
        this.body = this.addChild(new GO({
            renderValuesRound: true,
            size: this.size,
            position: new V2(),
            img: PP.createImage(spacePortImages.cargoSpaceShipBase)
        }));

        this.cargo = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(1,4),
            size: new V2(60,20),
            img: PP.createImage(spacePortImages.cargoContainer)
        }))

        let thrusterImage = PP.createImage(spacePortImages.thruster);
        this.frontalThruster = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(-38, 7),
            size: new V2(8,15),
            img: thrusterImage,
            internalPreRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            }
        }));

        this.frontalThruster.fire = this.frontalThruster.addChild(new GO({
            renderValuesRound: true,
            size: new V2(6,15),
            position: new V2(0,15),
            img: igniteImg,
            isAnimated: true,
            animation: {
                totalFrameCount: spacePortImages.igniteImages.length,
                framesInRow: spacePortImages.igniteImages.length,
                framesRowsCount: 1,
                frameChangeDelay: 150,
                destinationFrameSize:new V2(6,15),
                sourceFrameSize: new V2(6,15),
                loop: true
            },
        }));

        this.rearThruster = this.addChild(new GO({
            renderValuesRound: true,
            position: new V2(40, 7),
            size: new V2(8,15),
            img: thrusterImage,
            internalPreRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            },
            internalRender() {
                if(this.parent.thrustersAngle == 0)
                    return;
        
                this.context.translate(this.renderPosition.x, this.renderPosition.y);
                this.context.rotate(degreeToRadians(-this.parent.thrustersAngle));
                this.context.translate(-this.renderPosition.x, -this.renderPosition.y);
            }
        }));

        this.rearThruster.fire = this.rearThruster.addChild(new GO({
            renderValuesRound: true,
            size: new V2(6,15),
            position: new V2(0,15),
            img: igniteImg,
            isAnimated: true,
            animation: {
                totalFrameCount: spacePortImages.igniteImages.length,
                framesInRow: spacePortImages.igniteImages.length,
                framesRowsCount: 1,
                frameChangeDelay: 150,
                destinationFrameSize:new V2(6,15),
                sourceFrameSize: new V2(6,15),
                loop: true
            },
        }));

        this.indicators = [new V2(-35, -8), new V2(-15, -8), new V2(15, -8), new V2(35, -8)].map(p => this.addChild(new GO({
            position: p,
            size: this.size,
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: new V2(1,1),
                    imgRed: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'red', ctx.fillRect(0,0, 1,1) }),
                    imgYellow: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'yellow', ctx.fillRect(0,0, 1,1) }),
                    init() {
                        this.img = this.imgRed;
                        this.isRed = true;
                        this.toggleTimer = createTimer(500, () => {
                            this.img = this.isRed? this.imgRed : this.imgYellow;
                            this.isRed = !this.isRed;
                        })
                    },
                    internalUpdate(now){
                        if(this.toggleTimer)
                            doWorkByTimer(this.toggleTimer, now);
                    }
                }))
            }
        })))

        this.originalY = this.position.y;
        this.levitationTimer = createTimer(50, () => {
            let l = this.levitation;

            if(l.time > l.duration){
                l.direction*=-1;
                l.time = 0;

                if(l.direction < 0){
                    l.startValue = l.max;
                    l.change = -l.max;
                }
                else if(l.direction > 0){
                    l.startValue = l.min;
                    l.change = l.max;
                }
                
            }

            let delta = easing.process(l);
            this.position.y = this.originalY + delta;

            this.needRecalcRenderProperties = true;
            l.time++;
        }, this, true);
    }

    internalUpdate(now) {
        if(this.levitationTimer)
            doWorkByTimer(this.levitationTimer, now);
    }
}
