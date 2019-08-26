class ToyProgressScene extends Scene {
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
        this.backgroundRenderDefault('#DDDDDD');
    }

    start(){
        this.backgroundImage = PP.createImage(toyProgressModels.background);
        this.backgroundImageSize = new V2(250, 50);

        this.treeSize = new V2(20,20);
        this.treeYChange = easing.createProps(29, 0, this.treeSize.y, 'quad', 'out');
        this.treeWChange = easing.createProps(19, 0, 8, 'quad', 'out');
        this.treeFrames = [
            ...new Array(30).fill().map((_, i) => createCanvas(this.treeSize, (ctx, size, hlp) => {
                this.treeYChange.time = i;
                hlp.setFillColor(colors.palettes.fleja.colors[18]).rect(fast.r(size.x/2), size.y-1-easing.process(this.treeYChange), 1, size.y+1 )
            })),
            ...new Array(20).fill().map((_, i) => createCanvas(this.treeSize, (ctx, size, hlp) => {
                this.treeWChange.time = i;
                
                let pp = new PerfectPixel({context: ctx});
                let w = easing.process(this.treeWChange);
                let c1 = colors.palettes.fleja.colors[18];
                let c2 = colors.palettes.fleja.colors[17];
                hlp.setFillColor(c1)
                let dots = pp.line(fast.r(size.x/2), fast.r(size.y/2), fast.r(size.x/2-w), size.y-2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, size.y - dots[i].y-2)
                }
                hlp.setFillColor(c1).rect(fast.r(size.x/2-w), size.y-2, w, 1)
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/2), fast.r(size.x/2+w), size.y-2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, size.y - dots[i].y-2)
                }
                hlp.setFillColor(c1).rect(fast.r(size.x/2), size.y-2, w, 1)
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/4), fast.r(size.x/2-w/2)-1, size.y/2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/2 - dots[i].y))
                }
                hlp.setFillColor(c1)
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/4), fast.r(size.x/2+w/2), size.y/2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/2 - dots[i].y))
                }
                hlp.setFillColor(c1)
                dots = pp.line(fast.r(size.x/2), 1, fast.r(size.x/2-w/4)-1, size.y/4)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/4 - dots[i].y))
                }
                hlp.setFillColor(c1)
                dots = pp.line(fast.r(size.x/2), 1, fast.r(size.x/2+w/4)+1, size.y/4)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor(c2).rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/4 - dots[i].y))
                }
                
                hlp.setFillColor(c1).rect(fast.r(size.x/2), 0, 1, size.y )
            }))
        ]
        this.bannerCarImg = PP.createImage(toyProgressModels.bannerCar);
        this.background = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+25, -30),//new V2(this.sceneCenter.x+25, this.sceneCenter.y-30),
            size: this.backgroundImageSize,
            //img: this.backgroundImage,
            targetPosition: new V2(this.sceneCenter.x+25, this.sceneCenter.y-30),
            initialPosition: new V2(this.sceneCenter.x+25, -30),
            init() {
                this.ropes = [
                    this.addChild(new Go({
                        position: new V2( -75, -100 ),
                        size: new V2(4, 200),
                        img: createCanvas(new V2(4,1), (ctx, size, hlp) => {
                            hlp.setFillColor('#63635F').rect(0,0,size.x, size.y).setFillColor('#2A2A28').rect(size.x-1, 0,1, size.y)
                        })
                    })),
                    this.addChild(new Go({
                        position: new V2( 75, -100 ),
                        size: new V2(4, 200),
                        img: createCanvas(new V2(4,1), (ctx, size, hlp) => {
                            hlp.setFillColor('#63635F').rect(0,0,size.x, size.y).setFillColor('#2A2A28').rect(size.x-1, 0,1, size.y)
                        })
                    }))
                ]
                this.image = this.addChild(new Go({
                    position: new V2(),
                    size: this.size, 
                    img: this.parentScene.backgroundImage
                }))
            },
            moveIn(callback = () => {}) {
                this.yChange1 = easing.createProps(30, this.initialPosition.y, this.targetPosition.y+5, 'quad', 'out');
                this.yChange2 = easing.createProps(15, this.targetPosition.y+5, this.targetPosition.y, 'quad', 'inOut');
                this.yChange1.onComplete = () => {
                    this.yChange = this.yChange2;
                }
                this.yChange2.onComplete = () => {
                    this.unregTimer(this.timer);
                    this.timer = undefined;
                    callback();
                }

                this.yChange = this.yChange1;
                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({ context: this, propsName: 'yChange', round: true, removePropsOnComplete: true, setter: (value) => {
                        this.position.y = value;
                        this.needRecalcRenderProperties = true;
                    } })
                })
            },
            moveOut(callback = () => {}) {
                this.yChange1 = easing.createProps(15, this.targetPosition.y, this.targetPosition.y+5, 'quad', 'inOut');
                this.yChange2 = easing.createProps(30, this.targetPosition.y+5, this.initialPosition.y, 'quad', 'in');
                this.yChange1.onComplete = () => {
                    this.yChange = this.yChange2;
                }
                this.yChange2.onComplete = () => {
                    this.unregTimer(this.timer);
                    this.timer = undefined;
                    callback();
                }

                this.yChange = this.yChange1;
                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({ context: this, propsName: 'yChange', round: true, removePropsOnComplete: true, setter: (value) => {
                        this.position.y = value;
                        this.needRecalcRenderProperties = true;
                    } })
                })
            }
        }))

        this.basement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(250,150),
            init() {
                this.uTrees = [new V2(60,50), new V2(100,50), new V2(140,50), new V2(180,50)].map(p => ({animated: false,
                    triggered: false,
                    currentFrame: 0,
                    position: p})) 
                this.lTrees = [new V2(40,62), new V2(80,62), new V2(120,62), new V2(160,62)].map(p => ({animated: false,
                    triggered: false,
                    currentFrame: 0,
                    position: p})) 

                
                this.initialWidth = 0;
                this.width = this.initialWidth;
                this.height = 20;
                this.startX = 10;
                this.centralLinePadding = 10;
                this.xShift = 40;
                this.maxWidth = this.size.x - 2*this.startX - 2*this.xShift;
                
                //this.width = this.maxWidth;
                this.createImage();

                //this.makeWider();
                //this.showCar();
                
                //this.growTrees();
            },
            removeTrees(callback = () => {}) {
                this.treesRemovementIndex = 0;
                let tick = 3;
                let trees = [...this.uTrees, ...this.lTrees].sort((a,b) => {return a.position.x-b.position.x})
                this.treeTimer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < trees.length; i++){
                        if(i < this.treesRemovementIndex){
                            let tree = trees[i];
                            if(tree.currentFrame > 0)
                                tree.currentFrame--;
                            else {
                                tree.triggered = false;
                            }
                        }
    
                    }

                    if(this.treesRemovementIndex < trees.length && tick-- == 0){
                        tick = 3;
                        this.treesRemovementIndex++;
                    }

                    if(trees.filter(t => t.currentFrame > 0).length == 0){
                        this.unregTimer(this.treeTimer)
                        this.treeTimer = undefined;
                        trees.forEach(t => t.triggered = false);
                        //alert('trees removed')
                        callback();
                    }

                    this.createImage();
                })
            },
            growTrees() {
                let trees = [...this.uTrees, ...this.lTrees];
                this.treeTimer = this.regTimerDefault(15, () => {
                    
                    for(let i = 0; i < trees.length; i++){
                        let tree = trees[i];

                        if(tree.removing!=undefined){
                            tree.removing = undefined
                        }

                        if(!tree.animated){
                            continue;
                        }

                        tree.currentFrame++;
                        if(tree.currentFrame == this.parentScene.treeFrames.length-1){
                            tree.animated = false;
                        }
                    }

                    //this.createImage();
                })
            },
            makeNarrower(callback = () => {}) {
                this.changeWidth(easing.createProps(60, this.maxWidth, this.initialWidth,'quad', 'inOut'), callback);
            },
            makeWider(callback = () => {}) {
                this.changeWidth(easing.createProps(60, this.initialWidth, this.maxWidth,'quad', 'inOut'), callback);
            },
            changeWidth(change, callback) {
                this.widthChange = change;
                this.widthChange.onComplete = () => {
                    this.unregTimer(this.timer);   
                    this.time = undefined; 
                    callback();
                }
                this.widthChange.onChange = () => {
                    this.createImage();
                }

                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({
                        context: this, 
                        propsName: 'widthChange',
                        targetpropertyName: 'width', round: true
                    })
                })
            },
            hideCar(callback = () => {}) {
                //console.log(performance.now() - this.start)
                this.car.state = 'hiding';
                this.car.subState = 'hideBanner';
                this.car.change=  {
                    angle: easing.createProps(30, 0, -180, 'quad', 'in'),
                    hStickWidth: easing.createProps(20, 10, 0, 'quad', 'in'),
                    bannerHeight: easing.createProps(20, 12, 0, 'quad', 'in'),
                    //positionX: easing.createProps(300, this.startX + this.xShift, this.startX + this.xShift+this.width - 4, 'sin', 'inOut'),
                    //positionY: easing.createProps(20, 0, 2, 'quad', 'inOut'),
                }
                //this.car = undefined;

                this.hideCarTimer = this.regTimerDefault(15, () => {
                    if(this.car.state == 'hiding'){
                        if(this.car.subState == 'hideBanner'){
                            let ch = this.car.change.bannerHeight;
                            this.car.banner.height = easing.process(ch);

                            ch.time++;
                            if(ch.time > ch.duration){
                                this.car.subState = 'hStickHide';
                            }
                        } else if(this.car.subState == 'hStickHide'){
                            let cw = this.car.change.hStickWidth;
                            this.car.hStick.width = easing.process(cw);
                            this.car.hStick.leftEnd = this.car.vStick.position.add(new V2(-this.car.hStick.width, 0))
                            this.car.hStick.rightEnd = this.car.vStick.position.add(new V2(this.car.hStick.width, 0))
    
                            cw.time++;
                            if(cw.time > cw.duration){
                                this.car.subState = 'fall';
                            }
                        }
                        else if(this.car.subState == 'fall'){
                            let ca = this.car.change.angle;
                            this.car.angle = easing.process(ca);
                            this.car.vStick.position = this.car.vStick.originPosition.rotate(this.car.angle).add(this.car.position);

                            ca.time++;
                            if(ca.time > ca.duration){
                                this.unregTimer(this.hideCarTimer);
                                this.hideCarTimer = undefined;
                                this.car = undefined;
                                callback();
                            }
                        }

                        this.createImage();
                    } 
                })
            },
            showCar(callback = () => {}) {
                this.car = {
                    state: 'appearing',
                    subState: 'rise',
                    position: new V2(this.startX + this.xShift, fast.r(this.size.y/2)),
                    originPosition: new V2(this.startX + this.xShift, fast.r(this.size.y/2)),
                    yShift: {
                        current: 0,
                        duration: 20,
                        max: 1
                    },
                    vStick: {
                        originPosition: new V2(0, -15),
                        position: new V2(),
                        color: colors.palettes.fleja.colors[8]
                    }, //Position: new V2(this.startX + this.xShift, fast.r(this.size.y/2) + 10),
                    hStick: {
                        width: 0,
                        maxWidth: 10,
                        leftEnd: new V2(),
                        rightEnd: new V2(),
                        color: colors.palettes.fleja.colors[9]
                    },
                    banner: {
                        height: 0,
                        position: new V2(),
                        width: 19,
                        color: '#F8F8F8'
                    },
                    angle: 180,
                    change: {
                        angle: easing.createProps(30, 180, -30, 'quad', 'inOut'),
                        hStickWidth: easing.createProps(20, 0, 10, 'quad', 'out'),
                        bannerHeight: easing.createProps(20, 0, 12, 'quad', 'out'),
                        positionX: easing.createProps(300, this.startX + this.xShift, this.startX + this.xShift+this.width - 4, 'sin', 'inOut'),
                        //positionY: easing.createProps(20, 0, 2, 'quad', 'inOut'),
                    }
                }

                //this.car.change.positionY = easing.createProps(this.car.yShift.duration, 0, this.car.yShift.max, 'quad', 'inOut')

                this.showCarTimer = this.regTimerDefault(15, () => {
                    if(this.car.state == 'appearing'){
                        if(this.car.subState == 'rise'){
                            let ca = this.car.change.angle;
                            this.car.angle = easing.process(ca);
                            this.car.vStick.position = this.car.vStick.originPosition.rotate(this.car.angle).add(this.car.position);

                            ca.time++;
                            if(ca.time > ca.duration){
                                if(this.car.angle == -30){
                                    this.car.change.angle = easing.createProps(20, -30, 15, 'quad', 'inOut')
                                }
                                else if(this.car.angle == 15){
                                    this.car.change.angle = easing.createProps(10, 15, 0, 'quad', 'inOut')
                                }
                                else if(this.car.angle == 0){
                                    this.car.subState = 'hStickShow';
                                    this.car.hStick.leftEnd = this.car.vStick.position.clone();
                                    this.car.hStick.rightEnd = this.car.vStick.position.clone();
                                }
                            }
                        }
                        else if(this.car.subState == 'hStickShow'){
                            let cw = this.car.change.hStickWidth;
                            this.car.hStick.width = easing.process(cw);
                            this.car.hStick.leftEnd = this.car.vStick.position.add(new V2(-this.car.hStick.width, 0))
                            this.car.hStick.rightEnd = this.car.vStick.position.add(new V2(this.car.hStick.width, 0))

                            cw.time++;
                            if(cw.time > cw.duration){
                                this.car.subState = 'showBanner';
                                this.car.banner.position = this.car.hStick.leftEnd.add(new V2(1,1))
                            }
                        }
                        else if(this.car.subState == 'showBanner'){
                            let ch = this.car.change.bannerHeight;
                            this.car.banner.height = easing.process(ch);

                            ch.time++;
                            if(ch.time > ch.duration){
                                this.car.subState = 'showBanner';
                                this.unregTimer(this.showCarTimer);
                                this.showCarTimer = undefined;
                                //this.move();
                                callback();
                            }
                        }
                    }

                    this.createImage();
                })
            },
            move(callback = () => {}) {
                this.car.state = 'moving';
                this.moveCarTimer = this.regTimerDefault(30, () => {
                    if(this.car.change.positionY == undefined) {
                        this.car.change.positionY = easing.createProps(this.car.yShift.duration, 0, this.car.yShift.max, 'quad', 'inOut')
                        this.car.change.positionY.direction = 1;
                    }

                    let cx = this.car.change.positionX;
                    let cy = this.car.change.positionY;
                    this.car.position.x = easing.process(cx);
                    this.car.yShift.current = fast.r(easing.process(cy));

                    let notTriggeredTrees = [...this.uTrees, ...this.lTrees].filter(t => !t.triggered && t.position.x <= this.car.position.x+15);
                    if(notTriggeredTrees.length > 0){
                        notTriggeredTrees = notTriggeredTrees[0];
                        notTriggeredTrees.triggered = true;
                        notTriggeredTrees.animated = true;
                    }

                    this.car.vStick.position.x = this.car.position.x;
                    this.car.position.toInt();
                    this.car.vStick.position.toInt();
                    this.car.hStick.leftEnd = this.car.vStick.position.add(new V2(-this.car.hStick.width, 0)).toInt();
                    this.car.hStick.rightEnd = this.car.vStick.position.add(new V2(this.car.hStick.width, 0)).toInt();

                    this.car.banner.position = this.car.hStick.leftEnd.add(new V2(1,1)).toInt();

                    cx.time++;
                    cy.time++;
                    if(cx.time > cx.duration){
                        this.unregTimer(this.treeTimer);
                        this.unregTimer(this.moveCarTimer);
                        this.moveCarTimer = undefined;
                        this.treeTimer = undefined;
                        //this.hideCar();
                        callback();
                    }

                    if(cy.time > cy.duration){
                        

                        if(cy.direction > 0){
                            this.car.change.positionY = easing.createProps(this.car.yShift.duration, this.car.yShift.max, 0, 'quad', 'inOut');
                        }
                        else {
                            this.car.change.positionY = easing.createProps(this.car.yShift.duration, 0, this.car.yShift.max, 'quad', 'inOut');
                        }

                        this.car.change.positionY.direction *= -1;
                    }

                    this.createImage();
                })
            },
            createImage() {
                if(!this.startImg) {
                    this.startImg = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PerfectPixel({context: ctx})
                        let midY = fast.r(size.y/2);
                        let heightHalf = fast.r(this.height/2);
                        hlp.setFillColor('white');
                        let points = pp.line(this.startX, midY+heightHalf, this.startX+this.xShift, midY-heightHalf);
                        for(let i = 0; i < points.length; i++){
                            let p = points[i]
                            hlp.rect(p.x, p.y, 1, midY+heightHalf - p.y + 1);
                        }

                        hlp.setFillColor('lightgray');
                        hlp.rect(this.startX, midY + heightHalf+1, this.xShift+1, 9)
                    })
                }

                if(!this.endImg){
                    this.endImg = createCanvas(this.size, (ctx, size, hlp) => {
                        let pp = new PerfectPixel({context: ctx})
                        let midY = fast.r(size.y/2);
                        let heightHalf = fast.r(this.height/2);
                        hlp.setFillColor('white');
                        let points = pp.line(this.startX+this.xShift, midY+heightHalf, this.startX+2*this.xShift, midY-heightHalf);
                        for(let i = 0; i < points.length; i++){
                            let p = points[i]
                            hlp.rect(p.x, midY - heightHalf, 1,  p.y - (midY-heightHalf));
                        }

                        hlp.setFillColor('gray');
                        for(let i = 1; i < 10; i++){
                            pp.line(this.startX+this.xShift, midY+heightHalf + i, this.startX+this.xShift + this.xShift, midY-heightHalf + i)
                        }
                    });
                }

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                    let pp = new PerfectPixel({context: ctx})
                    let midY = fast.r(size.y/2);
                    let heightHalf = fast.r(this.height/2);

                    ctx.drawImage(this.startImg, 0,0, size.x, size.y);

                    hlp.setFillColor('white').rect(this.startX + this.xShift, midY-heightHalf, this.width, this.height+1)
                    .setFillColor('lightgray').rect(this.startX + this.xShift, midY+heightHalf+1, this.width, 9)

                    ctx.drawImage(this.endImg, this.width,0, size.x, size.y);

                    if(this.width > 0){
                        hlp.setFillColor('black') // hole in the middle
                        .rect(this.startX + this.xShift - 1, midY, this.width,1)
                        hlp.setFillColor('#666666')
                            .rect(this.startX + this.xShift+1, midY-1, this.width,1)
                            .dot(this.startX + this.xShift - 1, midY)
                    }
                    

                    for(let i = 0; i < this.uTrees.length; i++){
                        let tree = this.uTrees[i];
                        if(tree.triggered)
                            ctx.drawImage(this.parentScene.treeFrames[tree.currentFrame], tree.position.x, tree.position.y, this.parentScene.treeSize.x, this.parentScene.treeSize.y);
                    }

                    if(this.car) {
                        if(this.car.state == 'appearing'){
                            if(this.car.subState == 'rise' && this.car.angle <= 90){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position)
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                            }
                            else if(this.car.subState == 'hStickShow'){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position)
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                                hlp.setFillColor(this.car.hStick.color);
                                pp.lineV2(this.car.hStick.leftEnd, this.car.vStick.position)
                                pp.lineV2(this.car.vStick.position, this.car.hStick.rightEnd);
                            }
                            else if(this.car.subState == 'showBanner'){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position);
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                                hlp.setFillColor(this.car.hStick.color);
                                pp.lineV2(this.car.hStick.leftEnd, this.car.hStick.rightEnd);

                                hlp.setFillColor(this.car.banner.color).rect(this.car.banner.position.x, this.car.banner.position.y, this.car.banner.width, this.car.banner.height);
                                ctx.drawImage(this.parentScene.bannerCarImg, 0,0,this.car.banner.width, this.car.banner.height, this.car.banner.position.x, this.car.banner.position.y,this.car.banner.width, this.car.banner.height);
                                hlp.setFillColor(this.car.hStick.color).strokeRect(this.car.banner.position.x-1, this.car.banner.position.y-1, this.car.banner.width+2, this.car.banner.height+2)
                            }
                        }
                        else if(this.car.state =='hiding') {
                            if(this.car.subState == 'hideBanner'){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position);
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                                hlp.setFillColor(this.car.hStick.color);
                                pp.lineV2(this.car.hStick.leftEnd, this.car.hStick.rightEnd);

                                hlp.setFillColor(this.car.banner.color).rect(this.car.banner.position.x, this.car.banner.position.y, this.car.banner.width, this.car.banner.height);
                                ctx.drawImage(this.parentScene.bannerCarImg, 0,0,this.car.banner.width, this.car.banner.height, this.car.banner.position.x, this.car.banner.position.y,this.car.banner.width, this.car.banner.height);
                                hlp.setFillColor(this.car.hStick.color).strokeRect(this.car.banner.position.x-1, this.car.banner.position.y-1, this.car.banner.width+2, this.car.banner.height+2)
                            }
                            else if(this.car.subState == 'hStickHide'){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position)
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                                hlp.setFillColor(this.car.hStick.color);
                                pp.lineV2(this.car.hStick.leftEnd, this.car.vStick.position)
                                pp.lineV2(this.car.vStick.position, this.car.hStick.rightEnd);
                            }
                            else if(this.car.subState == 'fall' && this.car.angle >= -90){
                                hlp.setFillColor(this.car.vStick.color);
                                pp.lineV2(this.car.position, this.car.vStick.position)
                                pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                            }
                        }
                        else if(this.car.state =='moving') {
                            hlp.setFillColor(this.car.vStick.color);
                            pp.lineV2(this.car.position, this.car.vStick.position.add(new V2(0, this.car.yShift.current)));
                            pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,this.car.yShift.current)))
                            hlp.setFillColor(this.car.hStick.color);
                            pp.lineV2(this.car.hStick.leftEnd.add(new V2(0, this.car.yShift.current)), this.car.hStick.rightEnd.add(new V2(0, this.car.yShift.current)));

                            hlp.setFillColor(this.car.banner.color).rect(this.car.banner.position.x, this.car.banner.position.y+this.car.yShift.current, this.car.banner.width, this.car.banner.height)
                            ctx.drawImage(this.parentScene.bannerCarImg, 0,0,this.car.banner.width, this.car.banner.height, this.car.banner.position.x, this.car.banner.position.y+this.car.yShift.current,this.car.banner.width, this.car.banner.height);
                            hlp.setFillColor(this.car.hStick.color).strokeRect(this.car.banner.position.x-1, this.car.banner.position.y-1+this.car.yShift.current, this.car.banner.width+2, this.car.banner.height+2)
                        }
                        //hlp.setFillColor('red').rect()
                    }

                    for(let i = 0; i < this.lTrees.length; i++){
                        let tree = this.lTrees[i];
                        if(tree.triggered)
                            ctx.drawImage(this.parentScene.treeFrames[tree.currentFrame], tree.position.x, tree.position.y, this.parentScene.treeSize.x, this.parentScene.treeSize.y);
                    }
                })
            }
        }), 10)


        this.sceneManager = this.addGo(new GO({
            position: new V2(), 
            size: new V2(1,1),
            init() {
                this.startDelay = this.registerTimer(createTimer(1000, () => {
                    this.unregTimer(this.startDelay);
                    this.startDelay = undefined;
                    //this.recorder = new Recorder(SCG.canvases.main);
                    this.workSequence();    
                    //this.recorder.start();
                }, this, false));
            },
            workSequence() {
                
                let b = this.parentScene.basement;
                let bg = this.parentScene.background;
                let next = () => this.processScript();
                this.script.items = [
                    function() {
                        b.makeWider(next);
                    },
                    this.addProcessScriptDelay(250),
                    function() {
                        bg.moveIn(next);
                    },
                    function() {
                        b.showCar(next);
                        b.growTrees();
                    },
                    function() {
                        b.move(next);
                    },
                    this.addProcessScriptDelay(250),
                    function() {
                        b.hideCar(next);
                    },
                    function() {
                        b.removeTrees(next);
                        bg.moveOut();
                    },
                    function() {
                        b.makeNarrower(next);
                        //this.recorder.stop();
                    }
                ]
        
                this.processScript();
            }
        }));
        
    }
}