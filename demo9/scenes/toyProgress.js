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
        this.treeWChange = easing.createProps(19, 0, 9, 'quad', 'out');
        this.treeFrames = [
            ...new Array(30).fill().map((_, i) => createCanvas(this.treeSize, (ctx, size, hlp) => {
                this.treeYChange.time = i;
                hlp.setFillColor('#50872C').rect(fast.r(size.x/2), size.y-1-easing.process(this.treeYChange), 1, size.y+1 )
            })),
            ...new Array(20).fill().map((_, i) => createCanvas(this.treeSize, (ctx, size, hlp) => {
                this.treeWChange.time = i;
                
                let pp = new PerfectPixel({context: ctx});
                let w = easing.process(this.treeWChange);
                hlp.setFillColor('#50872C')
                let dots = pp.line(fast.r(size.x/2), fast.r(size.y/2), fast.r(size.x/2-w), size.y-1)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, size.y - dots[i].y-1)
                }
                hlp.setFillColor('#50872C').rect(fast.r(size.x/2-w), size.y-1, w, 1)
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/2), fast.r(size.x/2+w), size.y-1)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, size.y - dots[i].y-1)
                }
                hlp.setFillColor('#50872C').rect(fast.r(size.x/2), size.y-1, w, 1)
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/4), fast.r(size.x/2-w/2)-1, size.y/2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/2 - dots[i].y))
                }
                hlp.setFillColor('#50872C')
                dots = pp.line(fast.r(size.x/2), fast.r(size.y/4), fast.r(size.x/2+w/2), size.y/2)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/2 - dots[i].y))
                }
                hlp.setFillColor('#50872C')
                dots = pp.line(fast.r(size.x/2), 1, fast.r(size.x/2-w/4)-1, size.y/4)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/4 - dots[i].y))
                }
                hlp.setFillColor('#50872C')
                dots = pp.line(fast.r(size.x/2), 1, fast.r(size.x/2+w/4)+1, size.y/4)
                for(let i = 0; i < dots.length;i++){
                    hlp.setFillColor('#69B239').rect(dots[i].x,dots[i].y+1, 1, fast.r(size.y/4 - dots[i].y))
                }
                
                hlp.setFillColor('#50872C').rect(fast.r(size.x/2), 0, 1, size.y )
            }))
        ]
        this.bannerCarImg = PP.createImage(toyProgressModels.bannerCar);
        this.background = this.addGo(new GO({
            position: new V2(this.sceneCenter.x+25, this.sceneCenter.y-30),
            size: this.backgroundImageSize,
            //img: this.backgroundImage,
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
                
                this.width = this.maxWidth;
                this.createImage();

                //this.makeWider();
                this.showCar();
                
                this.growTrees();
            },
            addBackground() {

            },
            growTrees() {
                this.treeTimer = this.regTimerDefault(15, () => {
                    let trees = [...this.uTrees, ...this.lTrees];
                    for(let i = 0; i < trees.length; i++){
                        let tree = trees[i];

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
            makeWider() {
                this.widthChange = easing.createProps(60, this.initialWidth, this.maxWidth,'quad', 'inOut');
                this.widthChange.onComplete = () => {
                    this.unregTimer(this.timer);   
                    this.time = undefined; 
                }
                this.widthChange.onChange = () => {
                    this.createImage();
                }

                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({
                        context: this, 
                        propsName: 'widthChange',
                        targetpropertyName: 'width'
                    })
                })
            },
            showCar() {
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
                        color: '#CE7E73'
                    }, //Position: new V2(this.startX + this.xShift, fast.r(this.size.y/2) + 10),
                    hStick: {
                        width: 0,
                        maxWidth: 10,
                        leftEnd: new V2(),
                        rightEnd: new V2(),
                        color: '#87382D'
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
                                this.move();
                            }
                        }
                    }

                    this.createImage();
                })
            },
            move() {
                this.start = performance.now();
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
                        this.unregTimer(this.moveCarTimer);
                        this.moveCarTimer = undefined;
                        this.hideCar();
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
            hideCar() {
                console.log(performance.now() - this.start)
                this.car.state = 'hiding';
                //this.car = undefined;
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
                    hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                    let pp = new PerfectPixel({context: ctx})
                    let midY = fast.r(size.y/2);
                    let heightHalf = fast.r(this.height/2);

                    ctx.drawImage(this.startImg, 0,0, size.x, size.y);

                    hlp.setFillColor('white').rect(this.startX + this.xShift, midY-heightHalf, this.width, this.height+1)
                    .setFillColor('lightgray').rect(this.startX + this.xShift, midY+heightHalf+1, this.width, 9)

                    ctx.drawImage(this.endImg, this.width,0, size.x, size.y);

                    hlp.setFillColor('black') // hole in the middle
                        .rect(this.startX + this.xShift - 1, midY, this.width,1)
                    hlp.setFillColor('#666666')
                        .rect(this.startX + this.xShift+1, midY-1, this.width,1)
                        .dot(this.startX + this.xShift - 1, midY)

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
                            hlp.setFillColor(this.car.vStick.color);
                            pp.lineV2(this.car.position, this.car.vStick.position);
                            pp.lineV2(this.car.position.add(new V2(1,0)), this.car.vStick.position.add(new V2(1,0)))
                            hlp.setFillColor(this.car.hStick.color);
                            pp.lineV2(this.car.hStick.leftEnd, this.car.hStick.rightEnd);

                            hlp.setFillColor(this.car.banner.color).rect(this.car.banner.position.x, this.car.banner.position.y, this.car.banner.width, this.car.banner.height)
                            ctx.drawImage(this.parentScene.bannerCarImg, 0,0,this.car.banner.width, this.car.banner.height, this.car.banner.position.x, this.car.banner.position.y,this.car.banner.width, this.car.banner.height);
                            hlp.setFillColor(this.car.hStick.color).strokeRect(this.car.banner.position.x-1, this.car.banner.position.y-1, this.car.banner.width+2, this.car.banner.height+2)
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
    }
}