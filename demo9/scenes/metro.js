class Demo9MetroScene extends Scene {
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
        this.backgroundRenderDefault('cornflowerblue');
    }

    start(){
        this.bgPositionDelta = 0.1;
        this.bgFrameChangeCounter = 10;
        
        this.timer = this.regTimerDefault(15, () => {
            

            this.bgGO.forEach(go => {
                go.position.y+=this.bgPositionDelta;
                if(go.position.y > this.sceneCenter.y+this.viewport.y){
                    go.position = this.sceneCenter.clone().add(new V2(0, -this.viewport.y))
                }
                go.needRecalcRenderProperties = true;
            });

            if(this.bgFrameChangeCounter-- == 0){
                this.bg.index++;
                if(this.bg.index == this.bg.frames.length){
                    this.bg.index = 0;
                }

                this.bg.currentFrame = this.bg.frames[this.bg.index];
                this.bgGO.forEach(go => {
                    go.img = this.bg.currentFrame;
                });

                this.bgFrameChangeCounter = 10;
            }
        })

        let bgItems = [];
        for(let i = 0; i < 500; i++){
            bgItems.push({
                p: new V2(getRandomInt(-2, this.viewport.x), getRandomInt(0,this.viewport.y)),
                color: getRandomBool()?'#F0F0F0':'#9BD7FF',
                state: getRandomInt(0,8)
            });
            //hlp.rect(p.x, p.y, 3, 1)
        }

        //let bgTotalFrames = 9;
        
        this.bg = {
            index: 0,
            totalFrames: 9,
            frames: []
        }

        for(let i = 0; i < this.bg.totalFrames;i++){
            this.bg.frames[i] = createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('cornflowerblue').rect(0,0,size.x, size.y);

                for(let i = 0; i < bgItems.length; i++){
                    let bgi = bgItems[i];
                    ctx.globalAlpha = 0;

                    if(bgi.state == 0 || bgi.state == 8){
                        ctx.globalAlpha = 1;
                    }

                    if(bgi.state == 1 || bgi.state == 7){
                        ctx.globalAlpha = 0.5;
                    }

                    hlp.setFillColor(bgi.color).rect(bgi.p.x, bgi.p.y, 3, 1)

                    bgi.state++;
                    if(bgi.state == 9){
                        bgi.state = 0;
                    }
                }
                // hlp.setFillColor('#F0F0F0');
                // for(let i = 0; i < 200; i++){
                //     let p = new V2(getRandomInt(-2, size.x), getRandomInt(0,size.y));
                //     hlp.rect(p.x, p.y, 3, 1)
                // }
    
                // hlp.setFillColor('#9BD7FF');
                // for(let i = 0; i < 200; i++){
                //     let p = new V2(getRandomInt(-2, size.x), getRandomInt(0,size.y));
                //     hlp.rect(p.x, p.y, 3, 1)
                // }
    
    
            });
        }

        this.bg.currentFrame = this.bg.frames[this.bg.index];

        this.bgGO = [this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: this.bg.currentFrame,
            renderValuesRound: true,
        }), 0),

        this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0, -this.viewport.y)),
            size: this.viewport.clone(),
            img: this.bg.currentFrame,
            renderValuesRound: true,
        }), 0)]
        // this.ellipsisImages = {

        // }

        this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 170),
            size: new V2(20, 60),
            init() {
                

                

                this.flameYOrigin = 40;
                this.flameYDelta = 0;

                this.timer = this.regDefaultTimer(100, () => {
                    this.flame.position.y = this.flameYOrigin + this.flameYDelta;
                    this.flame.needRecalcRenderProperties = true;

                    this.flameYDelta--;
                    if(this.flameYDelta < -3){
                        this.flameYDelta = 0;
                    }
                })

                this.flame = this.addChild(new GO({
                    position: new V2(0, 40),
                    size: new V2(9,20),
                    init() {
                        this.img = PP.createImage(
                            rocketModels.flame()
                        )
                    }
                }))
                
                this.body = this.addChild(new GO({
                    position: new V2(0, 0),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(
                            rocketModels.body
                        )
                    }
                }))
            }
        }), 11)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.left = {
                    from: new V2(this.size.x/2 - 1, 220).toInt(),
                    to: new V2(50, this.size.y+100).toInt(),
                    midPoints: [],
                    midpointCounter: 0,
                    yChangeDirection: 1,
                }

                this.right = {
                    from: new V2(this.size.x/2 + 1, 220).toInt(),
                    to: new V2(this.size.x-50, this.size.y+100).toInt(),
                    midPoints: [],
                    midpointCounter: 0,
                    yChangeDirection: -1,
                }

                this.ellipsis = [];
                this.ellipsisCounter = 2;

                this.from = new V2(this.size.x/2 - 25, 200).toInt();
                this.to = new V2(0, this.size.y+100).toInt();
                this.midPoints = [];

                this.time =  100;
                this.midpointCounter = 0;
                //this.img = this.createImage();

                this.yChangeDirection = 1;
                this.addMidPoint(this);
                
                this.addMidPoint(this.left);
                this.addMidPoint(this.right);

                this.timer = this.regDefaultTimer(15, () => {
                    if(this.ellipsisCounter <= 0 && getRandomInt(0, 2) == 0){
                        this.ellipsisCounter = 7;
                        let wh = getRandomInt(10,30);
                        this.ellipsis.push({ alive: true, position: new V2(this.size.x/2 + 5, 210), width: 5, height: 5, from: getRandomInt(-45, -35), to: getRandomInt(90, 120),
                        change: {
                            positionY: easing.createProps(this.time, 210, this.size.y + 100, 'linear', 'base'),
                            positionX: easing.createProps(this.time, this.size.x/2 + 1, this.size.x/2 + getRandomInt(0,40), 'linear', 'base'),
                            width: easing.createProps(this.time, 2, wh, 'linear', 'base'),
                            height: easing.createProps(this.time, 2, wh, 'linear', 'base'),
                        }})
                    }

                    for(let i = 0; i < this.ellipsis.length; i++){
                        let e = this.ellipsis[i];
                        e.position.x = easing.process(e.change.positionX);
                        e.position.y = easing.process(e.change.positionY);
                        e.width = easing.process(e.change.width);
                        e.height = easing.process(e.change.height);
                        
                        e.change.positionX.time++;
                        e.change.positionY.time++;
                        e.change.width.time++;
                        e.change.height.time++;

                        e.alive = e.change.positionX.time <= e.change.positionX.duration
                    }

                    this.ellipsis = this.ellipsis.filter(e => e.alive);
                    this.ellipsisCounter--;

                    this.processMidpoints(this.left);
                    this.processMidpoints(this.right);
                    this.img = this.createImage();
                })
            },
            processMidpoints(holder){
                for(let i = 0; i < holder.midPoints.length; i++){
                    let mp = holder.midPoints[i];
                    mp.distance = easing.process(mp.changeDistance);
                    mp.yChange = easing.process(mp.changeYChange);

                    mp.changeDistance.time++;
                    mp.changeYChange.time++;

                    mp.alive = mp.changeDistance.time <= mp.changeDistance.duration
                }

                if(holder.midpointCounter <= 0){
                    if(getRandomInt(0,2) == 0){
                        holder.midpointCounter = 7;
                        
                        this.addMidPoint(holder);
                        holder.yChangeDirection*=-1;
                    }
                    
                }

                holder.midPoints = holder.midPoints.filter(m => m.alive);

                holder.midpointCounter--;
            },
            addMidPoint(holder) {
                holder.midPoints.unshift({distance: 0, yChange: 0, time: 0, alive: true, 
                    changeDistance: easing.createProps(this.time, 0, 1, 'linear', 'base'),
                    changeYChange: easing.createProps(this.time, 0, getRandomInt(10,20)*holder.yChangeDirection, 'linear', 'base'),
                 });
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    // let points = mathUtils.getCurvePoints({ start: this.from, end: this.to, midPoints: this.midPoints })
                    // hlp.setFillColor('#CCC');
                    // for(let i = 0; i < points.length; i++){
                    //     let p = points[i].toInt()
                    //     hlp.dot(p.x, p.y);
                    // }
                    let pointsLeft = mathUtils.getCurvePoints({ start: this.left.from, end: this.left.to, midPoints: this.left.midPoints, type: 'cubic' })
                    hlp.setFillColor('#CCC');


                    let pointsRight = mathUtils.getCurvePoints({ start: this.right.from, end: this.right.to, midPoints: this.right.midPoints, type: 'cubic'  })
                    //hlp.setFillColor('#CCC');
                    for(let i = 0; i < pointsLeft.length; i++){
                        let pl = pointsLeft[i];
                        let pr = pointsRight[i];
                        if(pl && pr){
                            let plx = fast.r(pl.x);
                            let ply = fast.r(pl.y);
                            let deltaX = fast.r(pr.x - pl.x);
                            hlp.setFillColor('#CCC').rect(plx, ply,deltaX, 2);
                            hlp.setFillColor('#DDD').rect(plx, ply,fast.r(deltaX/3), 2);
                            hlp.setFillColor('#EEE').rect(plx, ply,fast.r(deltaX/5), 2);
                            hlp.setFillColor('#FFF').rect(plx, ply,2, 2);
                            hlp.setFillColor('#AAA').rect(plx + deltaX - 2, ply, 2, 2)
                        }
                            
                    }

                    // for(let i = 0; i < this.ellipsis.length; i++){
                    //     let e = this.ellipsis[i];

                    //     hlp.setFillColor('#AAA').strokeEllipsis(e.from, e.to, 1, e.position.toInt(), fast.r(e.width), fast.r(e.height))
                    //     .strokeEllipsis(e.from, e.to, 1, e.position.toInt(), fast.r(e.width)-1, fast.r(e.height)-1)
                    //     hlp.setFillColor('#BABABA').strokeEllipsis(e.from+2, e.to-2, 1, e.position.toInt(), fast.r(e.width)-2, fast.r(e.height)-2)
                    //     .strokeEllipsis(e.from+2, e.to-2, 1, e.position.toInt(), fast.r(e.width)-3, fast.r(e.height)-3)
                    //     // hlp.setFillColor('#D8D8D8').strokeEllipsis(e.from+4, e.to-4, 1, e.position.toInt(), fast.r(e.width)-4, fast.r(e.height)-4)
                    //     // .strokeEllipsis(e.from+4, e.to-4, 1, e.position.toInt(), fast.r(e.width)-5, fast.r(e.height)-5)
                    // }
                    
                })
            }
        }), 10)
    }
}