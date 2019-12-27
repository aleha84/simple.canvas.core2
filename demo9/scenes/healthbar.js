class Demo9HealthbarScene extends Scene {
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
                

                this.regTimerDefault(15, () => {
                    this.createImage();
                })  
            },
            createContent() {
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

                        hlp.setFillColor(`rgba(255,255,255,${dot.opacity})`).dot(dot.p.x, fast.r(dot.p.y));

                        // dot.p.y+=dot.yChange*dot.yDirection;
                        // if(dot.yDirection > 0 && dot.p.y > size.y)
                        //     dot.p.y = 0;
                        // else if(dot.yDirection < 0 && dot.p.y < 0)
                        //     dot.p.y = size.y;
                    }

                    
                    hlp.setFillColor('rgba(74,255,61,0.5)').rect(0,0,fast.r(size.x*this.contentWidth), size.y)
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

                this.contentWidth = 1;
                this.dots = [];
                this.regTimerDefault(15, () => {
                    this.createImage();
                }) 
            },
            createContent() {
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

                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];
                        hlp.setFillColor(`rgba(255,255,255,${dot.alpha})`).dot(dot.p.x, dot.p.y);
                    }

                    hlp.setFillColor('rgba(172,33,40,0.5)').rect(0,0,fast.r(size.x*this.contentWidth), size.y)
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
    }
}