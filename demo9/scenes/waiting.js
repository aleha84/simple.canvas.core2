class Demo9WaitingScene extends Scene {
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
        this.backgroundRenderDefault('#030712');
    }

    start(){
        this.train = this.addGo(new GO({
            position: new V2(100,88),
            size: new V2(260,80),
            init() {
                // this.vagonImg = createCanvas(this.size, (ctx, size, hlp) => {
                //  ctx.drawImage(PP.createImage(Demo9WaitingScene.models.trainVagon),0,0)   ;
                //  hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
                // })
                this.vagonImg = PP.createImage(Demo9WaitingScene.models.trainVagon);
                 
                this.direction = new V2(0,35).direction(new V2(259, 60));
                this.movementDirection = this.direction.mul(-1);
                //new V2(-1,0);
                this.speed = 5;

                this.vagons = [];
                this.genTrain();
                
                // this.vagons = [
                //     this.addChild(new GO({
                //         position: new V2(this.size.x, 0),
                //         size: this.size.clone(),
                //         renderValuesRound: true,
                //         img: this.vagonImg
                //     })),
                //     this.addChild(new GO({
                //         position: new V2(this.size.x*2, 0),
                //         size: this.size.clone(),
                //         renderValuesRound: true,
                //         img: this.vagonImg
                //     }))
                // ]

                this.timer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < this.vagons.length; i++){
                        let vagon = this.vagons[i];
                        if(!vagon.alive)
                            continue;

                        if(vagon.position.x < -vagon.size.x){
                            vagon.setDead();
                        }

                        vagon.position.add(this.movementDirection.mul(this.speed), true);
                        vagon.needRecalcRenderProperties = true;
                    }

                    if(this.vagons.filter(v => v.alive).length == 0)
                        this.vagons = [];
                })
            },
            genTrain() {
                let vagonsCount = getRandomInt(5,10);
                for(let i = 0; i < vagonsCount;i++){
                    this.vagons[this.vagons.length] = this.addChild(new GO({
                        position: new V2().add(this.direction.mul(this.size.x*(i+1))),  //new V2(this.size.x*i, 0),
                        size: this.size.clone(),
                        renderValuesRound: true,
                        img: this.vagonImg
                    }));
                }
            }
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.main)
            }
        }), 1)

        this.sign = this.addGo(new GO({
            position: new V2(37.5, 231),
            size: new V2(75,130),
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.sign)
            }
        }), 5)

        this.man = this.addGo(new GO({
            position: new V2(75,111),
            size: new V2(16,30),
            init() {
                this.img = PP.createImage(Demo9WaitingScene.models.man)
            }
        }), 4)
    }
}