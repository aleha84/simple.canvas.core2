class EpskaVerse1Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        //this.backgroundRenderDefault();
        this.backgroundRenderImage(this.bgImg)
    }

    start(){
        this.bgImg = createCanvas(this.viewport, (ctx, size, hlp) => {
            //28626E
            hlp.setFillColor('#01151C').rect(0,0,size.x, size.y)
            
            hlp.setFillColor('black').rect(0, 20, 300, 110);
            

            //gen
            let wtl = new V2(0, 20);
            let wSize = new V2(300, 110)
//            hlp.setFillColor('#0D1313').rect(wtl.x, wtl.y, wSize.x, wSize.y);
            let layersCount = 5;
            let type = 'quad';
            let method = 'in';
            let hsv = [180,31,10];
            let vChange = easing.createProps(layersCount, 4,12,type, method);
            let hChange = easing.createProps(layersCount, wSize.y/2,0,type, method);
            //let bWidth = easing.createProps(layersCount, ,0,type, method);
            let bly = wtl.y+wSize.y;
            for(let i = 0; i <= layersCount; i++){
                vChange.time = i;
                hChange.time = i;
                let h = fast.r(easing.process(hChange));
                hlp.setFillColor(colors.hsvToHex([hsv[0],hsv[1], easing.process(vChange)])).rect(0,bly-h, size.x, h);


            }

            hlp.setFillColor('#000D11').rect(0,130, size.x,2).rect(0,20, size.x,1)         
        })

        this.table = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,175),
            size: new V2(this.viewport.x,50),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    let tableBottomLineYFrom = size.y-10;
                    let tableBottomLineYTo = 18
                    
                    let direction = new V2(0,tableBottomLineYFrom).direction(new V2(size.x,tableBottomLineYTo));

                    hlp.setFillColor('#050D0F');
                    for(let i = 0; i < 30; i++){
                        pp.lineV2(new V2(0,tableBottomLineYFrom + i), new V2(size.x,tableBottomLineYTo + i))
                    }

                    hlp.setFillColor('#010204');
                    for(let i = 0; i < 15; i++){
                        pp.lineV2(new V2(0,tableBottomLineYFrom + i), new V2(size.x,tableBottomLineYTo + i))
                    }

                    hlp.setFillColor('#170D04');
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

                    hlp.setFillColor('#548997').rect(200, 20, 30, 1);
                    hlp.setFillColor('#384E57').rect(200,20,20,1);
                    hlp.setFillColor('#6E92A0').rect(200,21,30,1);
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

                this.consoleWindow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    init() {
                        this.currentFrame = 0;
                        this.frames = PP.createImage(SCG.epskaImageModels.verse1.console_frames);
                        this.img = this.frames[0];
                        this.timer = this.regTimerDefault(100, () => {
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    },
                    
                }))
            }
        }), 1)

        this.hero = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+30,this.sceneCenter.y),
            size: new V2(239,200),
            init() {
                this.rightHand = this.addChild(new GO({
                    position: new V2(-17, 53),
                    size: new V2(130, 45),
                    init() {
                        //this.img = PP.createImage(SCG.epskaImageModels.verse1.rightHand)
                        this.frames = PP.createImage(SCG.epskaImageModels.verse1.rightHandFrames);
                        this.img = this.frames[0];

                        this.pauseCounter = 2;
                        this.currentFrame = 0;
                        this.loopCounter = 2;
                        this.timer = this.regTimerDefault(50, () => {
                            if(this.pauseCounter > 0){
                                this.pauseCounter--;
                            }
                            else {
                                
                                
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                    
                                    this.loopCounter--;
                                    if(this.loopCounter == 0){
                                        this.loopCounter = getRandomInt(1,4);    
                                        this.pauseCounter = getRandomInt(10,20);    
                                        this.img = this.frames[0];
                                    }
                                    
                                }
                                else {
                                    this.img = this.frames[this.currentFrame];
                                    this.currentFrame++;
                                }
                            }
                            
                        })
                    }
                }));

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(SCG.epskaImageModels.verse1.hero)
                }))
            }
        }), 10)
    }
}