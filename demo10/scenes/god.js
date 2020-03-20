class Demo10GodScene extends Scene {
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
        this.god = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(50, 0)),
            size: new V2(150,150),
            model: Demo10GodScene.models.god(),
            init() {
                console.log(this.model);
                //this.img = PP.createImage(this.model);

                this.framesCount = 200;
                this.yClamps = [-1, 0];
                this.yValues = [];

                let yChange1 = easing.createProps((this.framesCount/2)-1, this.yClamps[0], this.yClamps[1], 'quad', 'inOut');
                let yChange2 = easing.createProps((this.framesCount/2)-1, this.yClamps[1], this.yClamps[0], 'quad', 'inOut');

                for(let i = 0; i < this.framesCount/2; i++){
                    yChange1.time = i;
                    let y = fast.r(easing.process(yChange1));
                    this.yValues[i] = y;
                }

                for(let i = 0; i < this.framesCount/2; i++){
                    yChange2.time = i;
                    let y = fast.r(easing.process(yChange2));
                    this.yValues[i+(this.framesCount/2)] = y;
                }

                this.points = [];
                for(let l = 0; l < this.model.main.layers.length; l++){
                    let group = this.model.main.layers[l].groups[0];
                    let points = group.points.map(p => ({
                        point: p.point,
                        initialIndex: getRandomInt(0, (this.framesCount-1))
                    }))
                    // this.points[l] = {
                    //     color: group.strokeColor,
                        
                    // };



                    let frames = [];
                    for(let f = 0; f < this.framesCount; f++){
                        frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor(group.strokeColor);

                            for(let p = 0; p < points.length; p++){
                                let pointData = points[p];
                                let currentIndex = pointData.initialIndex + f;
                                    if(currentIndex > (this.framesCount-1)){
                                        currentIndex-=this.framesCount;
                                    }
                                
                                let x = pointData.point.x;
                                let y = pointData.point.y + this.yValues[currentIndex]
                                
                                hlp.dot(x,y);
                            }
                        })
                    }

                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        init() {
                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];

                            this.timer = this.regTimerDefault(15, () => {
                
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    }))
                }
            }
        }), 3);

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(0, 75),
                    size: new V2(this.size.x, 50),
                    img: PP.createImage(Demo10GodScene.models.fg)
                }))
            }
        }), 5)
    }
}