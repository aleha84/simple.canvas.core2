class EpskaVerse1Scene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        this.table = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,175),
            size: new V2(this.viewport.x,50),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    let tableBottomLineYFrom = size.y-10;
                    let tableBottomLineYTo = 18
                    hlp.setFillColor('#170D04');
                    let direction = new V2(0,tableBottomLineYFrom).direction(new V2(size.x,tableBottomLineYTo));

                    for(let i = 0; i < 8; i++){
                        //hlp.setFillColor('#170D04')
                        pp.lineV2(new V2(0,tableBottomLineYFrom + i), new V2(size.x,tableBottomLineYTo + i))
                        
                    }

                    hlp.setFillColor('#262720');
                    pp.lineV2(new V2(0,tableBottomLineYFrom-1), new V2(size.x,tableBottomLineYTo-1))

                    hlp.setFillColor('#3B4A41');
                    pp.lineV2(new V2(0,tableBottomLineYFrom-2), new V2(size.x,tableBottomLineYTo-2))

                    hlp.setFillColor('#63675A');
                    for(let i = 0; i < 11; i++){
                        pp.lineV2(new V2(0,tableBottomLineYFrom-3-i), new V2(size.x,tableBottomLineYTo-3-i))
                    }

                    hlp.setFillColor('#0A171A').rect(95,29,35,1)
                    hlp.setFillColor('#19312C').rect(70,30, 60, 1)

                    hlp.setFillColor('#060604')//.rect(124, 29, 5 , 1).rect(125, 30, 6 , 1).rect(126, 31, 3 , 1)
                
                    pp.lineV2(new V2(123,29), new V2(123,29).add(direction.mul(10)));
                    pp.lineV2(new V2(125,30), new V2(125,30).add(direction.mul(10)));
                    pp.lineV2(new V2(130,31), new V2(130,31).add(direction.mul(10)));
                    pp.lineV2(new V2(130,32), new V2(130,32).add(direction.mul(20)));
                    pp.lineV2(new V2(131,33), new V2(131,33).add(direction.mul(20)));
                    pp.lineV2(new V2(132,34), new V2(131,34).add(direction.mul(30)));
                    hlp.setFillColor('red')//.strokeRect(0,0,size.x, size.y);
                    
                    hlp.setFillColor('rgba(0,0,0,0.25)')
                    for(let i = 0; i < 8; i++){
                        pp.lineV2(new V2(0,tableBottomLineYFrom + i).add(direction.mul(109)), new V2(0,tableBottomLineYFrom + i).add(direction.mul(300)))
                        pp.lineV2(new V2(0,tableBottomLineYFrom + i).add(direction.mul(206)), new V2(0,tableBottomLineYFrom + i).add(direction.mul(300)))
                    }

                    //F7F3F0
                    hlp.setFillColor('rgba(255,255,255,0.5)')

                    for(let i = 0; i < 11; i++){
                        pp.lineV2(new V2(0,tableBottomLineYFrom-3 -i).add(direction.mul(206)), new V2(0,tableBottomLineYFrom-3 - i).add(direction.mul(300)))
                    }
                })
            }
        }), 1)

        this.screen = this.addGo(new GO({
            position: new V2(145,139),
            size: new V2(110,65),
            init() {
                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.screen)
                }))
            }
        }), 1)

        this.hero = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+30,this.sceneCenter.y),
            size: new V2(239,200),
            init() {
                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.hero)
                }))
            }
        }), 10)
    }
}