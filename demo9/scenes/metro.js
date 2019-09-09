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
        this.backgroundRenderDefault();
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.left = {
                    from: new V2(this.size.x/2 - 5, 200).toInt(),
                    to: new V2(50, this.size.y+100).toInt(),
                    midPoints: [],
                    midpointCounter: 0,
                    yChangeDirection: 1,
                }

                this.right = {
                    from: new V2(this.size.x/2 + 5, 200).toInt(),
                    to: new V2(this.size.x-50, this.size.y+100).toInt(),
                    midPoints: [],
                    midpointCounter: 0,
                    yChangeDirection: -1,
                }

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
                    let pointsLeft = mathUtils.getCurvePoints({ start: this.left.from, end: this.left.to, midPoints: this.left.midPoints })
                    hlp.setFillColor('#CCC');


                    let pointsRight = mathUtils.getCurvePoints({ start: this.right.from, end: this.right.to, midPoints: this.right.midPoints })
                    //hlp.setFillColor('#CCC');
                    for(let i = 0; i < pointsLeft.length; i++){
                        let pl = pointsLeft[i];
                        let pr = pointsRight[i];
                        if(pl && pr){
                            hlp.setFillColor('#CCC').rect(fast.r(pl.x), fast.r(pl.y),fast.r(pr.x - pl.x), 2);
                            hlp.setFillColor('#DDD').rect(fast.r(pl.x), fast.r(pl.y),fast.r((pr.x - pl.x)/3), 2);
                            hlp.setFillColor('#EEE').rect(fast.r(pl.x), fast.r(pl.y),fast.r((pr.x - pl.x)/5), 2);
                            hlp.setFillColor('#FFF').rect(fast.r(pl.x), fast.r(pl.y),2, 2);
                        }
                            
                    }
                })
            }
        }))
    }
}