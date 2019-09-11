class Demo9MetroScene extends Scene {
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
        this.backgroundRenderDefault('cornflowerblue');
    }

    cloudImgGen(size) {

    }

    start(){
        this.bgPositionDelta = 0.1;
        this.bgFrameChangeCounter = 10;
        this.smallCloudsImages = [];
        for(let i = 0; i < 10; i++){
            let size = new V2(getRandomInt(6,9)*10, getRandomInt(12,16)*10);
            let layer = {
                r:1/4,
                steps: 10,
            }
            let speed = 5;
            let img = createCanvas(size, (ctx, size, hlp) => {
                        
                //let layer = this.layer;

                let allDots = [];
                let origin = new V2(size.x/2, size.y/2).toInt();
                let radius = new V2(size.x*layer.r, size.y*layer.r).toInt();
                hlp.setFillColor('white')//.rect(0,0,size.x, size.y)
                .elipsis(origin, radius, allDots)

                let step = 360/layer.steps;
                for(let i = 0; i < layer.steps; i++){
                    let d = [];
                    let r = degreeToRadians(i*step);
                    let x = fast.r(origin.x + radius.x * Math.cos(r));
                    let y = fast.r(origin.y + radius.y * Math.sin(r));

                    hlp.circle(new V2(x, y), getRandomInt(5, size.x*layer.r), d);
                    allDots = [...allDots, ...d];
                }

                let rows = [];
                for(let i = 0; i < allDots.length; i++){
                    if(!rows[allDots[i].y]){
                        rows[allDots[i].y] = [];
                    }

                    rows[allDots[i].y].push(allDots[i].x);
                }

                for(let y = 0; y< rows.length;y++){
                    let row = rows[y];
                    if(row){
                        let maxX = Math.max.apply(null, row);
                        let minX = Math.min.apply(null, row);
                        hlp.setFillColor('#CCC').dot(maxX, y).dot(minX, y);
                        hlp.setFillColor('#DDD').dot(maxX-1, y).dot(minX+1, y);
                        hlp.setFillColor('#EEE').dot(maxX-2, y).dot(minX+2, y);
                    }
                }
                
            })
            
            this.smallCloudsImages.push({
                img, speed,  size
            }) 
        }
        this.clouds = [];

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

            for(let i = 0; i < this.clouds.length; i++){
                let cloud = this.clouds[i];
                cloud.position.y += cloud.speed;

                if(cloud.position.y > this.viewport.y + cloud.size.y/2){
                    cloud.setDead();
                }

                cloud.needRecalcRenderProperties = true;
            }

            this.clouds = this.clouds.filter(c => c.alive);
        })

        let bgItems = [];
        this.bg = {
            index: 0,
            totalFrames: 15,
            frames: []
        }
        for(let i = 0; i < 500; i++){
            bgItems.push({
                p: new V2(getRandomInt(-2, this.viewport.x), getRandomInt(0,this.viewport.y)),
                color: getRandomBool()?'#F0F0F0':'#9BD7FF',
                state: getRandomInt(0,this.bg.totalFrames-1),
                width: getRandomInt(3,5)
            });
            //hlp.rect(p.x, p.y, 3, 1)
        }

        //let bgTotalFrames = 9;
        
        

        for(let i = 0; i < this.bg.totalFrames;i++){
            this.bg.frames[i] = createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('cornflowerblue').rect(0,0,size.x, size.y);

                for(let i = 0; i < bgItems.length; i++){
                    let bgi = bgItems[i];
                    ctx.globalAlpha = 0;

                    if(bgi.state == 0 || bgi.state == (this.bg.totalFrames-1)){
                        ctx.globalAlpha = 1;
                    }

                    if(bgi.state == 1 || bgi.state == (this.bg.totalFrames-2)){
                        ctx.globalAlpha = 0.75;
                    }

                    if(bgi.state == 2 || bgi.state == (this.bg.totalFrames-3)){
                        ctx.globalAlpha = 0.5;
                    }

                    if(bgi.state == 3 || bgi.state == (this.bg.totalFrames-4)){
                        ctx.globalAlpha = 0.25;
                    }

                    hlp.setFillColor(bgi.color).rect(bgi.p.x, bgi.p.y, bgi.width, 1)

                    bgi.state++;
                    if(bgi.state == this.bg.totalFrames){
                        bgi.state = 0;
                    }
                }

    
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

        this.cloudGenTimer = this.regTimerDefault(300, () => {
            let smallCloudProps = this.smallCloudsImages[getRandomInt(0, this.smallCloudsImages.length-1)];

            let size = smallCloudProps.size;

            this.clouds.push(this.addGo(new GO({
                position: new V2(getRandomInt(0, this.viewport.x), -size.y/2),//this.sceneCenter.clone().add(new V2(-100, -100)),
                size: size,
                speed: smallCloudProps.speed,
                img: smallCloudProps.img
            }), 1));
        })

        

        this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 170),
            size: new V2(20, 60),
            init() {
                this.bodyFrames = rocketModels.bodyFrames.map(bf => PP.createImage(bf));
                this.currentBodyFrame = 0;
                this.flameYOrigin = 40;
                this.flameYDelta = 0;

                this.timer = this.regDefaultTimer(100, () => {
                    this.flame.position.y = this.flameYOrigin + this.flameYDelta;
                    this.flame.needRecalcRenderProperties = true;

                    this.flameYDelta--;
                    if(this.flameYDelta < -3){
                        this.flameYDelta = 0;
                    }

                    this.body.img = this.bodyFrames[this.currentBodyFrame];
                    if(++this.currentBodyFrame == this.bodyFrames.length){
                        this.currentBodyFrame = 0;
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
                    img: this.bodyFrames[this.currentBodyFrame]
                    // init() {
                    //     this.img = PP.createImage(
                    //         rocketModels.body
                    //     )
                    // }
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
                    let pointsLeft = mathUtils.getCurvePoints({ start: this.left.from, end: this.left.to, midPoints: this.left.midPoints, type: 'cubic' })
                    hlp.setFillColor('#CCC');


                    let pointsRight = mathUtils.getCurvePoints({ start: this.right.from, end: this.right.to, midPoints: this.right.midPoints, type: 'cubic'  })
                    //hlp.setFillColor('#CCC');

                    let distance = this.right.from.distance(this.right.to);
                    let midY = this.right.midPoints.filter(mp => mp.yChange > 0).map(mp => ({ len: mp.yChange, y: fast.r(this.right.from.y + distance*mp.distance)}));


                    for(let i = 0; i < pointsLeft.length; i++){
                        let pl = pointsLeft[i];
                        let pr = pointsRight[i];
                        if(pl && pr){
                            let plx = fast.r(pl.x);
                            let ply = fast.r(pl.y);
                            let prx = fast.r(pr.x);

                            let deltaX = fast.r(pr.x - pl.x);
                            hlp.setFillColor('#CCC').rect(plx, ply,deltaX, 2);
                            hlp.setFillColor('#DDD').rect(plx, ply,fast.r(deltaX/3), 2);
                            hlp.setFillColor('#EEE').rect(plx, ply,fast.r(deltaX/5), 2);
                            hlp.setFillColor('#FFF').rect(plx, ply,2, 2);
                            hlp.setFillColor('#AAA').rect(plx + deltaX - 2, ply, 2, 2)

                            let ds = midY.map(mp => ({len: mp.len, d: Math.abs( mp.y - ply)})).filter(mp => mp.d >= 0 && mp.d < 15);
                            if(ds.length){
                                ds = ds[0];
                                //let len = (ds.len - ds.len*ds.d/15)*2
                                let change = easing.createProps(15, ds.len, 0,'quad', 'in');
                                change.time = ds.d;

                                let len = fast.r(easing.process(change)*2);
                                hlp.setFillColor('#999').rect(prx-len, ply, len, 2)
                            }
                        }
                    }
                    
                })
            }
        }), 10)
    }
}