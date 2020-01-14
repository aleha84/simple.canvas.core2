class Demo9HealthbarScene extends Scene {
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

    renderParts() {
        this.backgroundImg = createCanvas(this.size, (ctx, size, hlp) => {
            ctx.drawImage(PP.createImage(this.model, {renderOnly: ['bg_left']}), 0,0);

            let bgSegImg = PP.createImage(this.model, {renderOnly: ['bg_center']});
            let currentX = this.cornersWidth;
            for(let i = 0; i < this.segmentsCount; i++){
                ctx.drawImage(bgSegImg, currentX-this.cornersWidth,0);
                currentX+=this.segmentWidth;
            }

            ctx.drawImage(PP.createImage(this.model, {renderOnly: ['bg_right']}), currentX-this.cornersWidth-this.segmentWidth,0);
        })

        this.foregroundImg = createCanvas(this.size, (ctx, size, hlp) => {
            ctx.drawImage(PP.createImage(this.model, {renderOnly: ['fg_left']}), 0,0);

            let fgSegImg = PP.createImage(this.model, {renderOnly: ['fg_center']});
            let currentX = this.cornersWidth;
            for(let i = 0; i < this.segmentsCount; i++){
                ctx.drawImage(fgSegImg, currentX-this.cornersWidth,0);
                currentX+=this.segmentWidth;
            }

            ctx.drawImage(PP.createImage(this.model, {renderOnly: ['fg_right']}), currentX-this.cornersWidth-this.segmentWidth,0);
        })
    }

    start(){
        
        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                this.startSequence();
            },
            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(50, 0.85))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(100, 0.7))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(50, 0.5))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(30, 0.4))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(80, 0.2))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(100, 0.3))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(60, 0.55))
                        this.processScript();
                    },
                    this.addProcessScriptDelay(6000),
                    function() {
                        scene.hbs.forEach(hb => hb.setWidth(50, 1))
                        this.processScript();
                    },
                    function(){
                        this.startSequence();
                    }
                ]

                this.processScript();
            }
        }))

        this.cpy = this.addGo(new GO({
            position: new V2(this.viewport.x - 40,this.viewport.y - 15),
            size: new V2(80,20),
            init() {
                this.img = PP.createImage(Demo9HealthbarScene.models.copyright)
            }
        }), 1)

        this.hb1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(1,1),
            init() {
                this.cornersWidth = 10;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb1;

                this.parentScene.renderParts.call(this);

                this.dotsCount = fast.r(this.size.x*this.size.y/10)
                this.dots = new Array(this.dotsCount).fill().map((el) =>  
{               
                    let totalTime = getRandomInt(8,16)*10;  
                    let fromY = getRandomInt(2, this.size.y/2 - 1)
                    let toY = getRandomInt(this.size.y/2 +1, this.size.y-3);
                return {
                    p: new V2(getRandomInt(0, this.size.x), getRandomInt(0, this.size.y)),
                    opacity: getRandomInt(1,6)/10,
                    // yChange: fast.r(getRandom(0.1, 0,8),2),
                    yDirection: getRandomBool() ? 1: -1,
                    yChange: easing.createProps(totalTime, fromY, toY, 'quad', 'inOut'),
                    yTime: getRandomInt(1,totalTime-1),
                    totalTime
                }})

                this.contentWidth = 1;
                
                this.fallDots = [];

                this.regTimerDefault(15, () => {
                    this.createImage();
                })  
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(time, this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {
                let currentContentWidth= this.size.x*this.contentWidth;
                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})
                return createCanvas(this.size, (ctx, size, hlp) => {
                    
                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];

                        dot.p.y = easing.process(dot.yChange);
                        dot.yTime +=dot.yDirection;
                        dot.yChange.time = dot.yTime;

                        if(dot.yDirection > 0 && dot.yTime == dot.totalTime)
                            dot.yDirection = -1;
                        else if(dot.yDirection < 0 && dot.yTime == 0)
                            dot.yDirection = 1;

                        if(dot.p.x < currentContentWidth-1)
                            hlp.setFillColor(`rgba(255,255,255,${dot.opacity})`).dot(dot.p.x, fast.r(dot.p.y));

                    }

                    if(this.contentWidth < 1){
                        hlp.setFillColor('rgba(255,255,255,0.05)').rect(currentContentWidth-2, 0,1,size.y);
                        hlp.setFillColor('rgba(255,255,255,0.2)').rect(currentContentWidth-1, 0,1,size.y);
                        if(getRandomInt(0,1) == 0){
                            let time = getRandomInt(50,100);
                            this.fallDots.push({
                                alive: true,
                                p: new V2(currentContentWidth, getRandomInt(0, size.y)),
                                xChange: easing.createProps(time, currentContentWidth, currentContentWidth + getRandomInt(5, 10), 'quad', 'out', function() { this.alive = false; }),
                                currentX : currentContentWidth,
                                currentAlpha: 0.5, 
                                aChange:  easing.createProps(time, 0.5, 0, 'quad', 'out'),
                            })    
                        }
                        
                    }

                    

                    for(let i = 0; i < this.fallDots.length; i++){
                        let fd = this.fallDots[i];

                        hlp.setFillColor(`rgba(74,255,61,${fd.currentAlpha})`).rect(fd.currentX, fd.p.y, 1,1)

                        easing.commonProcess({context: fd, targetpropertyName: 'currentX', propsName: 'xChange', round: true, callbacksUseContext: true, removePropsOnComplete: true })
                        easing.commonProcess({context: fd, targetpropertyName: 'currentAlpha', propsName: 'aChange', setter: (value) => { fd.currentAlpha = fast.r(value, 2) } })
                    }

                    this.fallDots = this.fallDots.filter(d => d.alive)

                    
                    hlp.setFillColor('rgba(74,255,61,0.5)').rect(0,0,fast.r(currentContentWidth), size.y)
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    ctx.globalCompositeOperation = 'source-atop';
                    // hlp.setFillColor('rgba(74,255,61,0.5)');
                    // hlp.rect(0,0,size.x/2, size.y);
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }

        }), 1)

        this.hb2 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 30),
            size: new V2(1,1),
            init() {
                this.cornersWidth = 10;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb2;


                this.parentScene.renderParts.call(this);

                this.contentWidth = 1;
                this.dots = [];
                this.regTimerDefault(15, () => {
                    this.createImage();
                }) 

                this.fallWidth = 1;
                this.fallwChangeDirection = -1;
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(time, this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {
                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})

                if(true){
                    let currentWidth = fast.r(this.size.x*this.contentWidth);
                    let x = getRandomInt(0,3) == 0 ? getRandomInt(1, currentWidth*2/3) : getRandomInt(currentWidth/2, currentWidth-1);
                    
                    let dot = {
                        p: new V2(x, getRandomInt(0, this.size.y-1)),
                        aTime: 0,
                        xTime: 0,
                        alpha: 0,
                        currentX: x,
                        aChange: easing.createProps(getRandomInt(10,50), 0, getRandomInt(5,10)/10, 'quad', 'in', 
                            function() { this.xChange = easing.createProps(getRandomInt(50,150), x, 0, 'quad', 'in', 
                                                            function() { this.alive = false }) } ),
                        //xChange: easing.createProps(getRandomInt(10,30), x, 0, 'quad', 'in'),
                        alive: true
                    };

                    this.dots.push(dot);
                }

                for(let i = 0; i < this.dots.length; i++){
                    let dot = this.dots[i];

                    easing.commonProcess({context: dot, targetpropertyName: 'alpha', propsName: 'aChange', setter: (value) => { dot.alpha = fast.r(value,2) }, removePropsOnComplete: true, callbacksUseContext: true   });
                    easing.commonProcess({context: dot, propsName: 'xChange', setter: (value) => { dot.p.x = fast.r(value) }, removePropsOnComplete: true, callbacksUseContext: true })
                }

                this.dots = this.dots.filter(d => d.alive);



                return createCanvas(this.size, (ctx, size, hlp) => {
                    let currentContentWidth = fast.r(size.x*this.contentWidth);
                    if(this.contentWidth < 1){
                        if(!this.fallWChange){
                            this.fallwChangeDirection*=-1
                            this.fallWChange = this.fallwChangeDirection > 0 ?
                            easing.createProps(getRandomInt(30, 50), this.fallWidth, getRandomInt(4,5), 'quad', 'inOut') : 
                            easing.createProps(getRandomInt(30, 50), this.fallWidth, 0, 'quad', 'inOut')
                        }

                        easing.commonProcess({context: this, targetpropertyName: 'fallWidth', propsName: 'fallWChange', round: true, removePropsOnComplete: true})

                        let aChange = easing.createProps(this.fallWidth-1, 0.45, 0, 'quad', 'in');
                        for(let i = 0; i < this.fallWidth; i++){
                            let a = 0.5
                            if( this.fallWidth > 1){
                                a = fast.r(easing.process(aChange),3);
                            }
                            aChange.time = i;
                            hlp.setFillColor(`rgba(172,33,40,${a})`).rect(currentContentWidth+0+i, 0, 1, size.y);
                        }
                        //hlp.setFillColor(`rgba(0,0,0,0.1`).rect(currentContentWidth, 0, 1, size.y);
                    }

                    
                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];
                        if(dot.p.x < currentContentWidth)
                            hlp.setFillColor(`rgba(255,255,255,${dot.alpha})`).dot(dot.p.x, dot.p.y);
                    }

                    hlp.setFillColor('rgba(172,33,40,0.5)').rect(0,0,fast.r(currentContentWidth), size.y)
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }
        }));

        this.hb3 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - 30),
            size: new V2(1,1),
            init() {
                this.cornersWidth = 10;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb3;

                this.parentScene.renderParts.call(this);

                this.contentWidth = 1;
                this.dots = [];
                this.regTimerDefault(15, () => {
                    this.createImage();
                }) 
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(time, this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {

                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})
                let currentContentWidth = fast.r(this.size.x*this.contentWidth);
                let y= getRandomInt(this.size.y-5, this.size.y-2);
                let dot = {
                    p: new V2(getRandomInt(0, currentContentWidth-1), y),
                    aTime: 0,
                    yTime: 0,
                    alpha: 0,
                    currentY: y,
                    aChange: easing.createProps(getRandomInt(10,50), 0, getRandomInt(5,10)/10, 'quad', 'in', 
                        function() { this.yChange = easing.createProps(getRandomInt(50,100), y, 0, 'quad', 'inOut', 
                                                        function() { this.alive = false }) } ),
                    alive: true
                };

                this.dots.push(dot);

                for(let i = 0; i < this.dots.length; i++){
                    let dot = this.dots[i];
                    easing.commonProcess({context: dot, targetpropertyName: 'alpha', propsName: 'aChange', setter: (value) => { dot.alpha = fast.r(value,2) }, removePropsOnComplete: true, callbacksUseContext: true   });
                    easing.commonProcess({context: dot, propsName: 'yChange', setter: (value) => { dot.p.y = fast.r(value) }, removePropsOnComplete: true, callbacksUseContext: true })
                }

                this.dots = this.dots.filter(d => d.alive);

                return createCanvas(this.size, (ctx, size, hlp) => {

                    
                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];
                        if(dot.p.x < currentContentWidth)
                            hlp.setFillColor(`rgba(255,255,255,${dot.alpha})`).dot(dot.p.x, dot.p.y);
                    }

                    hlp.setFillColor('rgba(66,181,196,0.5)').rect(0,0,currentContentWidth, size.y)

                    if(this.contentWidth < 1){
                        hlp.rect(currentContentWidth, size.y-2, size.x - currentContentWidth-5, 2)
                    }
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }
        }));

        this.hb4 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - 60),
            size: new V2(1,1),
            init() {
                this.cornersWidth = 15;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb4NoRightEmitter;

               

                this.parentScene.renderParts.call(this);

                this.contentWidth = 1;
                
                this.fullContentWidth = (this.segmentWidth * this.segmentsCount)-1
                this.currentContentWidth = this.contentWidth*(this.segmentWidth * this.segmentsCount)-1 ;
                this.lighting = {
                    dotsCount: 5,
                }

                this.lightingFrames = []

                this.currentFrame = 0;
                this.framesPerLighting = 10;
                this.colors = ['#023A6B', '#023A6B', '#023A6B', '#039ADD', '#023A6B',, '#0FEFFC', '#FCFFFE']

                this.rightEmitter = PP.createImage(Demo9HealthbarScene.models.hb4OnlyRightEmitter);

                for(let i = 0 ; i< 5; i++){
                    this.lightingFrames[i] = [];
                    
                    for(let j = 0; j < this.framesPerLighting; j++){

                        let dotsCount = getRandomInt(5,7);
                    let segWidth = this.size.x/dotsCount;
                    let midDots = new Array(dotsCount+1).fill().map((el, i) => (
                        new V2(  i*segWidth, 
                            ( i == 0 || i == dotsCount ? this.size.y/2 + getRandomInt(-1,0) : getRandomInt(5,this.size.y-7)) )
                            .add(new V2(0, 0)).toInt() ))

                        this.lightingFrames[i][j] = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PerfectPixel({ctx});
                            pp.setFillStyle(this.colors[i]);
                            for(let i = 0; i < midDots.length-1; i++){
                                pp.lineV2(midDots[i], midDots[i+1])
                            }
                            
                        })
                    }
                }
                

                this.regTimerDefault(50, () => {
                    this.createImage();
                }) 
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(fast.r(time/2), this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {
                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})
                this.currentContentWidth = fast.r(this.contentWidth*(this.segmentWidth * this.segmentsCount)-1);
                this.currentFrame++;
                if(this.currentFrame == this.framesPerLighting){
                    this.currentFrame = 0;
                }

                return createCanvas(this.size, (ctx, size, hlp) => {
                    //let w = this.cornersWidth
                    for(let i = 0 ; i< 5; i++){
                        ctx.drawImage(this.lightingFrames[i][this.currentFrame],this.cornersWidth,0, this.currentContentWidth+1, this.size.y);
                    }
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    //ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.rightEmitter, this.currentContentWidth-this.cornersWidth/2-2, 0);
                    
                    for(let i = this.currentContentWidth+30; i < this.size.x; i++ ){
                        hlp.setFillColor('#d4622c').rect(i,5, 1,10);
                        hlp.setFillColor('#eebc5b').rect(i, 5, 1, i%2==0?2:3)
                        hlp.setFillColor('#60341b').rect(i, 15-(i%2==0?3:2), 1, i%2==0?3:2)
                    }
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }
        }));

        this.hb5 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 60),
            size: new V2(1,1),
            init() {
                this.cornersWidth = 10;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb5;

                this.parentScene.renderParts.call(this);

                this.contentWidth = 1;
                this.dots = [];
                this.regTimerDefault(15, () => {
                    this.createImage();
                }) 

                this.xShift = 0;
                this.currentYShift = 0;
                //this.yChange = easing.createProps(30, -2,2,'quad', 'inOut', () => { this.yShiftDirection*=-1; });
                this.yShiftDirection = 1;
                this.dots = [];
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(time, this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {
                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})
                let currentContentWidth = fast.r(this.size.x*this.contentWidth);

                if(this.contentWidth < 1){
                    if(getRandomInt(0,1) == 0){
                        this.dots.push({
                            alive: true,
                            p: new V2(currentContentWidth+getRandomInt(-2,2),this.size.y/2),
                            currentY: this.size.y/2,
                            yChange: easing.createProps(getRandomInt(15,45), this.size.y/2 + getRandomInt(-1,0),0, 'quad', 'out', function() { this.alive = false })
                        })
                    }
                }

                

                return createCanvas(this.size, (ctx, size, hlp) => {
                    easing.commonProcess({context: this, targetpropertyName: 'currentYShift', propsName: 'yChange', round: true, removePropsOnComplete: true})
                    if(this.yChange == null){
                        this.yChange = easing.createProps(60, -3*this.yShiftDirection,3*this.yShiftDirection,'quad', 'inOut', () => { this.yShiftDirection*=-1; });
                    }

                    hlp.setFillColor('#FB500A').rect(0,0,currentContentWidth, size.y)

                    for(let x = 0; x < currentContentWidth; x++){
                        let y = 3*Math.sin(x/8 + this.xShift) + this.size.y/2 + this.currentYShift -2;
                        hlp.setFillColor('#FEE85B').rect(x, fast.r(y), 1, size.y)

                        y = 3*Math.sin(x/8 + this.xShift) + this.size.y/2 + 2 + this.currentYShift -2;
                        hlp.setFillColor('#FCFEFF').rect(x, fast.r(y), 1, size.y)
                    }

                    this.xShift+=0.25;

                    if(this.xShift >= 360){
                        this.xShift-=360;
                    }

                    
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);

                    hlp.setFillColor('#050505')
                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];
                        dot.p.x-=0.25
                        easing.commonProcess({context: dot, targetpropertyName: 'currentY', propsName: 'yChange', round: true, callbacksUseContext: true, removePropsOnComplete: true})
                        hlp.rect(fast.r(dot.p.x), dot.currentY, getRandomInt(1,3), getRandomInt(1,2));
                    }

                    this.dots = this.dots.filter(d => d.alive);
                })
            }
        }));

        this.hb6 = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - 90),
            size: new V2(1,1),
            init() {
                this.cornersWidth = 15;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.model = Demo9HealthbarScene.models.hb6;

                this.parentScene.renderParts.call(this);

                this.contentWidth = 1;
                this.dots = [];
                this.regTimerDefault(15, () => {
                    this.createImage();
                }) 

                this.xChange = easing.createProps(45, this.size.x, 0, 'expo', 'in')
                this.xTime = 0;
                this.currentX = this.size.x;
            },
            setWidth(time, width) {
                this.wChange = easing.createProps(time, this.contentWidth, width, 'quad', 'inOut')
            },
            createContent() {
                let currentContentWidth = fast.r(this.size.x*this.contentWidth);
                easing.commonProcess({context: this, targetpropertyName: 'contentWidth', propsName: 'wChange', removePropsOnComplete: true})
                this.xChange.time = this.xTime;
                this.currentX = easing.process(this.xChange);

                this.xTime++;

                if(this.xTime > this.xChange.duration){
                    this.xTime = 0;
                }

                return createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#08366D').rect(0,0,currentContentWidth,size.y);
                    
                    ctx.globalCompositeOperation = 'source-atop';
                    hlp.setFillColor('#780DFA').rect(this.currentX-5, 0, 30, size.y)
                    hlp.setFillColor('#F081EF').rect(this.currentX, 0, 20, size.y)
                    hlp.setFillColor('#FDFCFF').rect(this.currentX+5, 0, 10, size.y)
                })
                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    ctx.globalCompositeOperation = 'source-atop';
                    ctx.drawImage(this.createContent(),0,0)

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }
        }));

        
        this.hbs = [this.hb1, this.hb2, this.hb3, this.hb4, this.hb5, this.hb6];
        let height = 20;
        let gap = 5;
        let topY = fast.r(this.sceneCenter.y - this.hbs.length*(height+2*gap)/2) + 15;
        console.log(topY)
        this.hbs.forEach((hb, i) => {
            hb.position.y = topY + (height+2*gap)*i;
        })
    }
}