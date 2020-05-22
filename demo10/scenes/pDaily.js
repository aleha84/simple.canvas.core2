class Demo10PDailyScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        let model = pDailyModels.tree;

        let originSize = new V2(60,65)

        //#7996b4
        //#6b88af

        let targetColor = '#7996b4'.toLowerCase();
        let hideColor = '#7da3df';
        let targetPoints = [];
        model.main.layers.forEach(layer => {
            layer.groups.forEach(group => {
                if(group.strokeColor.toLowerCase() == targetColor){
                    targetPoints.push(...group.points.map(p => new V2(p.point)))
                }
            });
        });

        targetColor = '#6b88af'.toLowerCase();
        model.main.layers.forEach(layer => {
            layer.groups.forEach(group => {
                if(group.strokeColor.toLowerCase() == targetColor){
                    targetPoints.push(...group.points.map(p => new V2(p.point)))
                }
            });
        });

        let frames = [];
        let framesCount = 100;
        let itemsCount = targetPoints.length;
        
        let itemsData = targetPoints.map((el, i) => {
            let hideLength = getRandomInt(30,40);
            let hideFrom = getRandomInt(0, framesCount-1);
            let hideTo = hideFrom + hideLength;
            let hideFrames = [];
            if(hideTo > (framesCount-1)){
                hideTo-=framesCount;
                for(let i = hideFrom; i < framesCount; i++)
                    hideFrames.push(i);
                for(let i = 0; i <= hideTo; i++)
                    hideFrames.push(i);
            }
            else {
                for(let i = hideFrom; i <= hideTo; i++)
                    hideFrames.push(i);
            }

            return {
                p: el,
                hideFrames,
                initialIndex: getRandomInt(0, framesCount-1)
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(originSize, (ctx, size, hlp) => {
                for(let p = 0; p < itemsCount; p++){
                        let pointData = itemsData[p];
                    
                    // let currentIndex = pointData.initialIndex + f;
                    // if(currentIndex > (framesCount-1)){
                    //     currentIndex-=framesCount;
                    // }
                    
                    hlp.setFillColor(hideColor);

                    if(pointData.hideFrames.indexOf(f) != -1){
                        hlp.dot(pointData.p.x, pointData.p.y);
                    }
                }
            });
        }
        
        this.small = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-65, 0)),
            size: originSize,
            init() {
                this.img = PP.createImage(model);

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
        }), 1)

        this.big = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(35, 0)),
            size: originSize.mul(2),
            init() {
                this.img = PP.createImage(model);

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

                                if(!this.redFrame){
                            this.redFrame = this.addChild(new GO({
                                position: new V2(),
                                size: this.size,
                                img: createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor('red').rect(0,0, 50, 50)
                                })
                            }));
                        }
                        else {
                            this.removeChild(this.redFrame);
                            this.redFrame = undefined;
                        }
                            }
                        })

                        
                    }
                }))
            }
        }), 1)
    }
}