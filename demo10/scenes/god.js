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
                    
                    // this.points[l] = {
                    //     color: group.strokeColor,
                        
                    // };



                    let frames = [];
                    if(this.model.main.layers[l].name.indexOf('fadeout')!=-1){
                        
                        let particlesCount = 100;
                        let yMax = -15;
                        let yMin = -5;

                        if(this.model.main.layers[l].name.indexOf(':')!=-1){
                            let [name, paramsRaw] = this.model.main.layers[l].name.split(':');
                            let params = paramsRaw.split(';');
                            particlesCount = params[0];
                            yMax = parseInt(params[1]);
                            yMin = parseInt(params[2]);
                        }

                        let particles = [];

                        let aChange = easing.createProps(this.framesCount-1, 1, 0, 'quad', 'out');
                        let aValues = new Array(this.framesCount).fill().map((el, i) => {
                            aChange.time = i;
                            return fast.r(easing.process(aChange),2)
                        });

                        for(let i = 0; i < particlesCount; i++){
                            let yChange = easing.createProps(this.framesCount-1, 0, getRandomInt(yMax, yMin), 'quad', 'in');

                            particles[i] = {
                                startPoint: group.points[getRandomInt(0, group.points.length-1)].point,
                                yChangeValues: new Array(this.framesCount).fill().map((el, i) => {
                                    yChange.time = i;
                                    return fast.r(easing.process(yChange));
                                }),
                                initialIndex: getRandomInt(0, (this.framesCount-1))
                            }
                        }

                        for(let f = 0; f < this.framesCount; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor(group.strokeColor); 
                                for(let p = 0; p < particles.length; p++){
                                    let particleData = particles[p];
                                    let currentIndex = particleData.initialIndex + f;
                                    if(currentIndex > (this.framesCount-1)){
                                        currentIndex-=this.framesCount;
                                    }

                                    ctx.globalAlpha = aValues[currentIndex];

                                    let x = particleData.startPoint.x;
                                    let y = particleData.startPoint.y + particleData.yChangeValues[currentIndex]
                                    
                                    hlp.dot(x,y);

                                    ctx.globalAlpha = 1;
                                }
                            })
                        }

                    }
                    else if(this.model.main.layers[l].name.indexOf('ignore')!=-1){
                        for(let f = 0; f < this.framesCount; f++){
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                hlp.setFillColor(group.strokeColor);
    
                                for(let p = 0; p < group.points.length; p++){
                                    let pointData = group.points[p];
                                    
                                    let x = pointData.point.x;
                                    let y = pointData.point.y 
                                    
                                    hlp.dot(x,y);
                                }
                            })
                        }
                    }
                    else {

                        let points = group.points.map(p => ({
                            point: p.point,
                            initialIndex: getRandomInt(0, (this.framesCount-1))
                        }))

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
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10GodScene.models.fg)
                }))
            }
        }), 5)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10GodScene.models.bg)
                }))

                this.overlay = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(0,0,0,0.6)').rect(0,0,size.x,size.y)
                    })
                }))
            }
        }), 1)
    }
}