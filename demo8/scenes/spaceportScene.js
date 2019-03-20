class SpaceportScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            dustTimers: [],
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
            position: new V2(this.viewport.x + 100, 100)//this.sceneCenter.x
        }),10);

        this.ground = this.addGo(new Ground({
            size: new V2(this.viewport.x, 50),
            position: new V2(this.sceneCenter.x, this.viewport.y- 25)
        }), 5)

        for(let i = 0; i < 4; i++){
            this.cloudsGenerator(new V2(i *this.viewport.x/4,  getRandomInt(75,125)))
        }

        this.dustClouds = [
            createCanvas(new V2(spacePortImages.dustCloudImages_1.length*10, 10), (ctx, size) => {
                for(let i = 0; i < spacePortImages.dustCloudImages_1.length; i++){
                    ctx.drawImage(PP.createImage(spacePortImages.dustCloudImages_1[i]), 10*i,0);
                }
            }),
            createCanvas(new V2(spacePortImages.dustCloudImages_medium.length*15, 15), (ctx, size) => {
                for(let i = 0; i < spacePortImages.dustCloudImages_medium.length; i++){
                    ctx.drawImage(PP.createImage(spacePortImages.dustCloudImages_medium[i]), 15*i,0);
                }
            })
        ];

        this.cloudGeneratorTImer = createTimer(15000*4, () => this.cloudsGenerator(), this, true);

        // this.mDustCount = 3;
        // this.dustCloudDemoTimer = createTimer(100, () => {
        //     this.mDustCount--;
        //     if(this.mDustCount == 0){
        //         this.mDustCount = 3;
        //         this.addGo(new MovingGO({
        //             speed: getRandom(0.01, 0.05),
        //             destination: new V2(getRandomInt(0, this.viewport.x), getRandomInt(0, this.viewport.y - 40)),
        //             setDestinationOnInit: true, renderValuesRound: true,isAnimated: true,
        //             size: new V2(15,15),
        //             position: new V2(this.sceneCenter.x + getRandomInt(-15,15), this.viewport.y-40 + getRandomInt(-10,10)),//new V2(0,14.75),
        //             img: this.dustClouds[1],
        //             animation: {
        //                 totalFrameCount: spacePortImages.dustCloudImages_medium.length, framesInRow: spacePortImages.dustCloudImages_medium.length,
        //                 framesRowsCount: 1, frameChangeDelay: 350,
        //                 destinationFrameSize:new V2(15,15),
        //                 sourceFrameSize: new V2(15,15),
        //                 animationEndCallback: function(){
        //                     this.addEffect(new FadeOutEffect({ effectTime: getRandomInt(350,600), updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true }))
        //                 }
        //             },
        //         }), 19)
        //     }
        //     this.addGo(new MovingGO({
        //         speed: getRandom(0.01, 0.2),
        //         destination: new V2(getRandomInt(0, this.viewport.x), getRandomInt(0, this.viewport.y - 40)),
        //         setDestinationOnInit: true, renderValuesRound: true,isAnimated: true,
        //         size: new V2(10,10),
        //         position: new V2(this.sceneCenter.x + getRandomInt(-10,10), this.viewport.y-40 + getRandomInt(-10,10)),//new V2(0,14.75),
        //         img: this.dustClouds[0],
                
        //         animation: {
        //             totalFrameCount: spacePortImages.dustCloudImages_1.length,
        //             framesInRow: spacePortImages.dustCloudImages_1.length,
        //             framesRowsCount: 1, frameChangeDelay: 250,
        //             destinationFrameSize:new V2(10,10),
        //             sourceFrameSize: new V2(10,10),
        //             animationEndCallback: function(){
        //                 this.addEffect(new FadeOutEffect({ effectTime: getRandomInt(250,500), updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true }))
        //             }
        //         },
        //     }), 20)
        // }, this, true);
    }

    dustCloudGenerator(params) {
        if(params.mDustCount == 0){
            params.mDustCount = 3;
            this.addGo(new MovingGO({
                speed: getRandom(0.01, 0.05),
                destination: new V2(getRandomInt(0, this.viewport.x), getRandomInt(0, this.viewport.y - 40)),
                setDestinationOnInit: true, renderValuesRound: true,isAnimated: true,
                size: new V2(15,15),
                position: new V2(params.position.x + getRandomInt(-15,15), params.position.y + getRandomInt(-10,10)),//new V2(0,14.75),
                img: this.dustClouds[1],
                animation: {
                    totalFrameCount: spacePortImages.dustCloudImages_medium.length, framesInRow: spacePortImages.dustCloudImages_medium.length,
                    framesRowsCount: 1, frameChangeDelay: 350,
                    destinationFrameSize:new V2(15,15),
                    sourceFrameSize: new V2(15,15),
                    animationEndCallback: function(){
                        this.addEffect(new FadeOutEffect({ effectTime: getRandomInt(350,600), updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true }))
                    }
                },
            }), 19)
        }
        this.addGo(new MovingGO({
            speed: getRandom(0.01, 0.2),
            destination: new V2(getRandomInt(0, this.viewport.x), getRandomInt(0, this.viewport.y - 40)),
            setDestinationOnInit: true, renderValuesRound: true,isAnimated: true,
            size: new V2(10,10),
            position: new V2(params.position.x + getRandomInt(-10,10), params.position.y + getRandomInt(-10,10)),//new V2(0,14.75),
            img: this.dustClouds[0],
            
            animation: {
                totalFrameCount: spacePortImages.dustCloudImages_1.length,
                framesInRow: spacePortImages.dustCloudImages_1.length,
                framesRowsCount: 1, frameChangeDelay: 250,
                destinationFrameSize:new V2(10,10),
                sourceFrameSize: new V2(10,10),
                animationEndCallback: function(){
                    this.addEffect(new FadeOutEffect({ effectTime: getRandomInt(250,500), updateDelay: 50, setParentDeadOnComplete: true, initOnAdd: true }))
                }
            },
        }), 20)
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

    toggleDust(enabled, positions) {
        if(!enabled){
            for(let dustTimer of this.dustTimers){
                this.unregTimer(dustTimer);
            }

            this.dustTimers = [];

            return;
        }

        for(let position of positions) {
            let params = { mDustCount: 0, position };
            let t = createTimer(100, () => {
                this.dustCloudGenerator(params);
            }, this, true);
            this.registerTimer(t);
            this.dustTimers.push(t);
        }
    }

    afterMainWork(now){
        if(this.cloudGeneratorTImer)
            doWorkByTimer(this.cloudGeneratorTImer, now);

        // if(this.dustCloudDemoTimer)
        //     doWorkByTimer(this.dustCloudDemoTimer, now);
    }

    backgroundRender(){
        // /this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.backgroundImage, 0,0, SCG.viewport.real.width,SCG.viewport.real.height)
    }
}


