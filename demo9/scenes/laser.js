class LaserScene extends Scene {
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
        this.go = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //this.sparks.color = colors.palettes.fleja.colors[13];
                this.lowerLine = { begin: new V2(-this.size.x, this.size.y), end: new V2(this.size.x*2, this.size.y) }
                this.endsCache = [];
                this.direction = new V2(-0.8,0.5);
                this.width = fast.r(this.size.x*0.7);
                this.ls = new Array(this.width).fill(220);
                this.startFrom = new V2(fast.r(this.size.x*2/3), fast.r(this.size.y/3))
                this.starts = new Array(this.width).fill().map((_,i) => {
                    return this.startFrom.add(new V2(i, 0));
                })

                this.planeHeight = 5;

                this.cuts = [];

                this.laser = {
                    enabled: false,
                    from: new V2(this.size.x/3, 0).toInt(),
                    color: colors.palettes.fleja.colors[11],
                    to: {
                        vx: -10,
                        length: 180
                    }
                }

                this.createPlaneImg = true;
                this.sparks = [];
                
                this.defaultPlaneImgSize = new V2(this.size.x*1.5, this.size.y).toInt();
                this.defaultPlaneImg = createCanvas(this.defaultPlaneImgSize, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[2]);
                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.starts[i], this.starts[i].add(this.getEnd(this.ls[i])));
                    }

                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    let last = this.starts.length-1;
                    for(let i = 1; i < this.planeHeight+1; i++){
                        pp.lineV2(this.starts[last].add(new V2(0,i)), this.starts[last].add(this.getEnd(this.ls[last])).add(new V2(0,i)));
                    }

                    pp.lineV2(this.starts[0], this.starts[0].add(this.getEnd(this.ls[0])));
                    //hlp.rect(this.starts[0].x, this.starts[0].y, this.width-1, 1)

                    let firstPoint = this.starts[0].add(this.getEnd(this.ls[0]));

                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(firstPoint.x, firstPoint.y+1, this.width-1, this.planeHeight)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(firstPoint.x, firstPoint.y+1, this.width-1, 1).rect(firstPoint.x, firstPoint.y+1, 1, this.planeHeight)

                    hlp.setFillColor(colors.palettes.fleja.colors[1]);
                    //pp.lineV2(this.starts[last].add(new V2(0,this.planeHeight)), this.starts[last].add(this.getEnd(this.ls[last])).add(new V2(0,this.planeHeight)))
                });

                this.currentPlaneX = 0//-this.size.x;
                this.planeImg = this.defaultPlaneImg;

                this.createImage();
                this.moveIn();
            },
            moveIn() {
                this.currentPlaneX = -this.size.x;
                this.planeImg = this.defaultPlaneImg;

                this.planeXChange = easing.createProps(50, -this.size.x, 0, 'quad', 'out');
                this.planeXChange.onComplete = () => {
                    this.unregTimer(this.planeMoveInTimer);
                    this.planeMoveInTimer = undefined;
                    this.laserStart();
                }

                this.planeXChange.onChange = () => {
                    this.createImage();
                }

                this.planeMoveInTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, propsName: 'planeXChange', round: true, removePropsOnComplete: true, targetpropertyName: 'currentPlaneX'})
                })
            },
            laserStart() {
                let vxClamps = [0, this.width];
                let currentVx = vxClamps[0];
                this.laser.enabled = true;

                this.laserTimer = this.regTimerDefault(15, () => {
                    this.laser.to.vx = currentVx++;
                    if(currentVx>vxClamps[1]){
                        //currentVx = vxClamps[0];
                        this.laser.enabled = false;
                    }

                    for(let i = 0; i < this.sparks.length;i++){
                        let spark = this.sparks[i];
                        spark.position.add(spark.speed, true);
                        spark.speed.y+=0.1;

                        if(spark.speed.y > 0)
                            spark.alive = false;
                    }

                    this.sparks = this.sparks.filter(s => s.alive);
                    if(!this.laser.enabled && !this.sparks.length){
                        this.unregTimer(this.laserTimer);
                        this.laserTimer = undefined;
                        console.log('laser timer disabled')
                        this.cut();
                    }

                    this.createImage();
                })
            },
            cut() {
                this.planeImg = createCanvas(this.defaultPlaneImgSize, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[2]);
                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.starts[i], this.cuts[i].position);
                    }

                    hlp.setFillColor(colors.palettes.fleja.colors[3]);
                    let last = this.starts.length-1;
                    for(let i = 1; i < this.planeHeight+1; i++){
                        pp.lineV2(this.starts[last].add(new V2(0,i)), this.cuts[last].position.add(new V2(0,i)));
                    }

                    pp.lineV2(this.starts[0], this.cuts[0].position);

                    let firstPoint = this.cuts[0].position;

                     hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(firstPoint.x, firstPoint.y+1, this.width-1, this.planeHeight)
                    // hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(firstPoint.x, firstPoint.y+1, this.width-1, 1).rect(firstPoint.x, firstPoint.y+1, 1, this.planeHeight)

                    // hlp.setFillColor(colors.palettes.fleja.colors[1]);
                });

                this.cuttedEdgePositionY = 0;
                this.cuttedEdgeImg = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({context: ctx});
                    hlp.setFillColor(colors.palettes.fleja.colors[2]);
                    for(let i = 0; i< this.starts.length;i++){
                        pp.lineV2(this.cuts[i].position.add(this.direction.mul(1)), this.starts[i].add(this.getEnd(this.ls[i])));
                    }
                });

                this.cuts = [];
                this.createImage();
                this.cutEdgeFall();
            },
            cutEdgeFall() {
                this.cuttedEdgePositionYChange = easing.createProps(20, 0, 50, 'quad', 'in');
                this.cuttedEdgePositionYChange.onComplete = () => {
                    this.unregTimer(this.cuttedEdgeMoveInTimer);
                    this.cuttedEdgeMoveInTimer = undefined;
                    //this.laserStart();
                }

                this.cuttedEdgePositionYChange.onChange = () => {
                    this.createImage();
                }

                this.cuttedEdgeMoveInTimer = this.regTimerDefault(15, () => {
                    easing.commonProcess({context: this, propsName: 'cuttedEdgePositionYChange', round: true, removePropsOnComplete: true, targetpropertyName: 'cuttedEdgePositionY'})
                })
            },
            getEnd(length) {
                if(!this.endsCache[length]){
                    this.endsCache[length] = this.direction.mul(length);
                }

                return this.endsCache[length];
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0,fast.r(size.y/2-50), size.x, 14)
                    hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0,fast.r(size.y/2-53), size.x, 3)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(0,fast.r(size.y/2-36), size.x, 1);

                    let pp = new PerfectPixel({context: ctx});
                                        
                    ctx.drawImage(this.planeImg, this.currentPlaneX,0,this.defaultPlaneImgSize.x, this.defaultPlaneImgSize.y);

                                     
                    hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0,fast.r(size.y/2-70), size.x, 14)
                    hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0,fast.r(size.y/2-73), size.x, 3)
                    hlp.setFillColor(colors.palettes.fleja.colors[5]).rect(0,fast.r(size.y/2-56), size.x, 1);

                    for(let i = 0; i < this.cuts.length; i++){
                        let cut = this.cuts[i];
                        hlp.setFillColor(colors.palettes.fleja.colors[13]).rect(cut.position.x, cut.position.y,1,1);
                    }

                    if(this.laser.enabled && this.laser.to.vx >= 0 && this.laser.to.vx < this.width ){ // если лазер по линиям идет
                        hlp.setFillColor(this.laser.color);
                        let laserTo = this.starts[this.laser.to.vx].add(this.getEnd(this.laser.to.length));

                        this.cuts[this.laser.to.vx] = { position: laserTo.clone(), length: this.laser.to.length }

                        pp.lineV2(this.laser.from, laserTo)
                        pp.lineV2(this.laser.from.add(new V2(-1,0)), laserTo.add(new V2(-1,0)));

                        this.sparks.push({
                            position: laserTo.add(new V2(-2,-1)), 
                            size: new V2(2,2), 
                            color: colors.palettes.fleja.colors[getRandomInt(11,15)],
                            speed: new V2(getRandom(-2,-0.5), getRandom(-3,-1)),
                            alive: true
                        })
                            
                    }

                    for(let i = 0; i < this.sparks.length;i++){
                        let spark = this.sparks[i];
                        hlp.setFillColor(spark.color).rect(fast.r(spark.position.x), fast.r(spark.position.y), spark.size.x, spark.size.y);
                    }

                    if(this.cuttedEdgeImg){
                        ctx.drawImage(this.cuttedEdgeImg, 0,this.cuttedEdgePositionY,this.size.x, this.size.y);
                    }
                    
                })
            }
        }))
    }
}