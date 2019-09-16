class Demo9WindowScene extends Scene {
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
        this.backgroundRenderImage(this.bgImage);
    }

    start(){
        this.circlesProps = [
            {
                r: fast.r(this.viewport.x*0.75/2),
                color: '#1D233A'
            },
            {
                r: fast.r(this.viewport.x*0.76/2),
                color: '#0D0E19'//'#151728'
            },
            {
                r: fast.r(this.viewport.x*0.8/2),
                color: 'black'
            }
        ]

        this.bgImage = createCanvas(this.viewport, (ctx, size, hlp) => {
            let currentY = 0;
            let currentX = 0;
            let lineHeight = 3;
            let lineWidth = 3;
            let darkPartHeight = lineHeight*5;
            let coloredPartHeight = lineHeight*5;
            let lineHStep = darkPartHeight*3;
            let bgColors = {
                line: '#A3A09F',//'#B1ADAC',
                lineDarker: '#8E8C8B',//'#9E9B9A',
                colored: '#7F7364',//'#9D8E7B',
                coloredDarker: '#776C5E',//'#938574',
                dark: '#1D1E1D'//'#282A29'
            }

            while(currentY < size.y){
                let yStart = currentY;
                hlp.setFillColor(bgColors.coloredDarker).rect(0,currentY-1, size.x, 1);
                hlp.setFillColor(bgColors.line).rect(0,currentY, size.x, lineHeight);
                currentY+=lineHeight;
                hlp.setFillColor(bgColors.dark).rect(0,currentY, size.x, darkPartHeight);
                currentY+=darkPartHeight;
                hlp.setFillColor(bgColors.line).rect(0,currentY, size.x, lineHeight);
                currentY+=lineHeight;
                hlp.setFillColor(bgColors.colored).rect(0,currentY, size.x, coloredPartHeight);
                hlp.setFillColor(bgColors.coloredDarker).rect(0,currentY, size.x, 1);
                currentY+=coloredPartHeight;

                currentX = 0;
                while(currentX < size.x){
                    hlp.setFillColor(bgColors.line).rect(currentX,yStart-1, lineWidth, currentY - yStart);
                    hlp.setFillColor(bgColors.lineDarker).rect(currentX+lineWidth,yStart, 1, lineHeight);
                    hlp.setFillColor(bgColors.lineDarker).rect(currentX-1,yStart, 1, lineHeight);

                    hlp.setFillColor(bgColors.lineDarker).rect(currentX+lineWidth,yStart+lineHeight+darkPartHeight, 1, lineHeight);
                    hlp.setFillColor(bgColors.lineDarker).rect(currentX-1,yStart+lineHeight+darkPartHeight, 1, lineHeight);

                    hlp.setFillColor(bgColors.coloredDarker).rect(currentX+lineWidth,yStart+lineHeight*2+darkPartHeight, 1, coloredPartHeight);
                    hlp.setFillColor(bgColors.coloredDarker).rect(currentX-1,yStart+lineHeight*2+darkPartHeight, 1, coloredPartHeight);
                    currentX+=lineWidth;
                    currentX+=lineHStep;
                }
            }

        })

        this.walls = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let center = size.mul(0.5).toInt();
                    let step = 0.25;

                    let circlesProps = this.parentScene.circlesProps;

                    for(let i = 0; i < circlesProps.length; i++){
                        let cProps = circlesProps[i];

                        let r = cProps.r;
                        let circleDots = [];
                        for(let i = 0; i < 360; i+=step){
                            let rad = degreeToRadians(i);
                            let x = fast.r(center.x + r * Math.cos(rad));
                            let y = fast.r(center.y + r * Math.sin(rad));

                            circleDots.push({x,y});
                        }

                        //circleDots = distinct(circleDots, (p) => (p.x + '_' + p.y));
                        cProps.rows = []
                        let rows = cProps.rows;
                        for(let i = 0; i < circleDots.length; i++){
                            let d = circleDots[i];
                            if(rows[d.y] == undefined){
                                rows[d.y] = {max: d.x, min: d.x};
                            }
                            else {
                                if(d.x < rows[d.y].min)
                                    rows[d.y].min = d.x;
                                if(d.x > rows[d.y].max)
                                    rows[d.y].max = d.x

                                
                            }
                        }

                        for(let y = 0; y < size.y;y++){
                            let r = rows[y];
                            if(r == undefined){
                                hlp.setFillColor(cProps.color).rect(0,y,size.x, 1);
                            }
                            else {
                                hlp.setFillColor(cProps.color).rect(0,y, r.min, 1);
                                hlp.setFillColor(cProps.color).rect(r.max,y, size.x, 1);

                                if(i == 0){
                                    if(r.min != r.max){
                                        //'rgba(224,238,255,0.25)'
                                        hlp.setFillColor('rgba(56,69,63,0.25)').rect(r.min, y, r.max-r.min,1)
                                    }
                                }
                            }
                        }
                    }
                    
                    let vChange = easing.createProps(50, 14, 0, 'quad', 'out');
                    let hsv = [212,12,14];
                    for(let y = circlesProps[2].rows.length+1; y < size.y; y++){
                        let delta = y - circlesProps[2].rows.length;
                        if(delta <= 50){
                            vChange.time = delta;
                            let v =  easing.process(vChange);
                            v = fast.f(v/1)*1;
                            hsv[2] = v;
                        }
                        else {
                            hsv[2] = 0;
                        }
                        
                        let row = circlesProps[2].rows[circlesProps[2].rows.length-delta];
                        hlp.setFillColor(colors.hsvToHex(hsv)).rect(row.min, y-1, row.max - row.min, 1);
                    }

                    for(let i = 0; i < 500; i++){
                        hlp.setFillColor('rgba(0,0,0,0.1)').rect(
                        fast.r(getRandomGaussian(0, size.x)), 
                        getRandomInt(circlesProps[2].rows.length+1, size.y),  getRandomInt(10, 30), 1);   
                    }
                })
            }
        }), 20)

        this.rain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(1,1),
            init() {
                this.radius = this.parentScene.circlesProps[0].r;
                this.size = new V2(this.radius*2, this.radius*2);
                this.rainDropItems = [];
                this.rainDropLayers = [
                    {
                        speed: 5,
                        v: 30,
                        color: 'rgba(76,76,76,0.25)',
                        count: 5,
                    },
                    {
                        speed: 10,
                        v: 40,
                        color: 'rgba(102,102,102,0.5)',
                        count: 3,
                    },
                    {
                        speed: 20,
                        v: 60,
                        color: 'rgba(153,153,153,0.5)',
                        count: 2
                    },
                    {
                        speed: 30,
                        v: 70,
                        color: 'rgba(178,178,178,0.5)',
                        count: 1
                    }
                ]

                this.dropsTimer = this.regTimerDefault(30, () => {
                    for(let i = 0; i < this.rainDropLayers.length; i++){
                        let layer = this.rainDropLayers[i];
                        for(let j = 0; j < layer.count; j++){
                            let rainDrop = {
                                alive: true,
                                p: new V2(getRandomInt(0, this.size.x), getRandomInt(-10, 30)),
                                layer
                            }
        
                            this.rainDropItems.push(rainDrop)
                        }

                    }
                    
                    this.rainDropItems = this.rainDropItems.filter(d => d.alive);
                    this.createImage();
                })
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let i = 0; i < this.rainDropItems.length; i++){
                        let rd = this.rainDropItems[i];


                        //hlp.setFillColor(colors.hsvToHex([0,0,rd.layer.v])).rect(rd.p.x, rd.p.y, 1, rd.layer.speed);
                        hlp.setFillColor(rd.layer.color).rect(rd.p.x, rd.p.y, 1, rd.layer.speed);

                        rd.p.y+=rd.layer.speed;
                        rd.alive = rd.p.y < (size.y + rd.layer.speed);
                    }
                })
            }
        }),5);

        this.window = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(1,1),//new V2(this.viewport.x - 50, this.viewport.y - 50),
            init() {
                this.radius = this.parentScene.circlesProps[0].r;//fast.r(this.parentScene.viewport.x*0.8/2);
                this.size = new V2(this.radius*2, this.radius*2);
                this.center = this.size.mul(0.5).toInt();
                this.drops = [];
                
                this.highlightBoxes = [
                ]

                this.highlightBoxes[0] = new Box(new V2(130, 135), new V2(100, 55));
                this.highlightBoxes[0].hColor = [49,226,120]

                

                this.highlightBoxes[1] = new Box(new V2(130, 185), new V2(90, 40));
                this.highlightBoxes[1].hColor = [217,235,82]

                // this.highlightBoxes[2] = new Box(new V2(55, 100), new V2(40, 20));
                // this.highlightBoxes[2].hColor = [158,102,127]
                this.highlightBoxes[3] = new Box(new V2(40, 120), new V2(70, 20));
                this.highlightBoxes[3].hColor = [216,140,175]
                this.highlightBoxes[4] = new Box(new V2(25, 140), new V2(102, 100));
                this.highlightBoxes[4].hColor = [216,140,175]

                this.highlightBoxes[5] = new Box(new V2(40, 15), new V2(40, 20));
                this.highlightBoxes[5].hColor = [78,237,209]
                this.highlightBoxes[6] = new Box(new V2(20, 35), new V2(80, 70));
                this.highlightBoxes[6].hColor = [78,237,209]
                this.highlightBoxes[7] = new Box(new V2(30, 105), new V2(60, 20));
                this.highlightBoxes[7].hColor = [78,237,209]

                this.highlightBoxes[8] = new Box(new V2(148, 152), new V2(60, 22));
                this.highlightBoxes[8].hColor = [234,56,39]

                this.showHB = false;

                this.maxTtl = 50;
                this.defaultOpacity = 0.5;

                this.dropsTimer = this.regTimerDefault(30, () => {
                    for(let i = 0; i < 5; i++){
                        let r = getRandomInt(0, this.radius);
                        let angle = getRandomInt(0, 360);
                        let p = V2.up.rotate(angle).mul(r).add(this.center).toInt();
    
                        let hitted = this.drops.filter(d => /*!d.trail &&*/ d.p.distance(p) <= 1.42);
                        let fall = false;
                        if(hitted.length){
                            fall = getRandomInt(0,4) == 0;
                            for(let i = 0; i < hitted.length; i++){
                                hitted[i].alive = false;
                            }
                        }
                        
                        let color = (getRandomBool() ? getRandomInt(2,6) : getRandomInt(20,24))*10;
                        let hBoxes = this.highlightBoxes.filter(hb => hb.isPointInside(p));
                        let hb = undefined;
                        let rgba = `rgba(${color}, ${color},${color}, ${this.defaultOpacity})`;
                        if(hBoxes.length > 0 && getRandomInt(0,2) != 0){
                            let index = getRandomInt(0, hBoxes.length-1);
                            hb = hBoxes[index];
                            rgba = `rgba(${hb.hColor[0]}, ${hb.hColor[1]},${hb.hColor[2]}, ${this.defaultOpacity})`
                        }

                        this.drops.push({
                            p, 
                            fall,
                            color,
                            opacity: this.defaultOpacity,
                            rgba,
                            alive: true,
                            hBox: hb
                        });
                    }
                    
                    
                    this.drops = this.drops.filter(d => d.alive)

                    this.createImage();
                })

                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    if(this.showHB){
                        this.highlightBoxes.forEach(hb => {
                            hlp.setFillColor(`rgba(${hb.hColor[0]}, ${hb.hColor[1]},${hb.hColor[2]}, 1)`)
                            .strokeRectV2(hb.topLeft, hb.size);
                        })    
                    }
                    
                    
                    let rds = this.parentScene.shadows.rainDropShadows;
                    rds.items = [];

                    let trailsToAdd = [];
                    for(let i = 0; i < this.drops.length; i++){
                        let drop = this.drops[i];

                        
                        let color = drop.rgba;
                        // if(drop.trail){
                        //     drop.trailTtl--;
                        //     if(drop.trailTtl <= 0){
                        //         drop.alive = false;
                        //         drop.opacity = 0;
                        //     }
                        //     else {
                        //         drop.opacity = drop.trailTtl/50;
                        //     }
                            
                        //     color = `rgba(${drop.color}, ${drop.color},${drop.color}, ${drop.opacity})`;
                        // }

                        if(drop.fall){
                            let hBoxes = this.highlightBoxes.filter(hb => hb.isPointInside(drop.p));
                            if(hBoxes.length > 0){
                                drop.hBox = hBoxes[0];
                                color = `rgba(${drop.hBox.hColor[0]}, ${drop.hBox.hColor[1]},${drop.hBox.hColor[2]}, ${drop.opacity})`
                            }
                            else {
                                drop.hBox = undefined;
                                let color = drop.rgba;
                            }
                        }
                        
                        
                        // if(hBoxes.length > 0){

                        //     let index = 0;    
                        //     if(!drop.fall){
                        //         if(hBoxes.length > 1)
                        //             index = getRandomInt(0, hBoxes.length-1);

                        //         let hb = hBoxes[index];
                        //         drop.hBox = hb;
                        //     }
                            

                        //     color = `rgba(${drop.hBox.hColor[0]}, ${drop.hBox.hColor[1]},${drop.hBox.hColor[2]}, ${drop.opacity})`
                            
                        // }
                        // else {
                        //     drop.hBox = undefined;
                        // }

                        hlp.setFillColor(color).rect(fast.r(drop.p.x), fast.r(drop.p.y),2,2);

                        let toBottom = size.y - drop.p.y;
                        if(toBottom < 60){
                            rds.items.push(new V2(drop.p.x-54,toBottom).toInt())
                        }

                        if(drop.fall){
                            // if(!drop.prevTrail || (drop.p.y - drop.prevTrail.y >= 1.5)){
                            //     trailsToAdd.push(drop.p.clone());
                            //     drop.prevTrail = drop.p.clone();
                            // }
                            
                            drop.p.y+=getRandom(0,1.5);
                            if(getRandomInt(0,4) == 0){
                                drop.p.x+=getRandom(-1,1);
                            }

                            let p = drop.p.toInt();

                            let hitted = this.drops.filter(d => /*!d.trail &&*/ d.p.distance(p) <= 1.42 );
                            for(let i = 0; i < hitted.length; i++){
                                
                                hitted[i].alive = (getRandomInt(0,4) != 0);
                            }
                            
                            drop.alive = drop.p.distance(this.center) <  this.radius;
                        }
                    }

                    // for(let i = 0; i < trailsToAdd.length; i++){
                    //     let color = (getRandomBool() ? getRandomInt(2,6) : getRandomInt(20,24))*10;
                    //     this.drops.push({
                    //         p: trailsToAdd[i].clone(), 
                    //         fall: false,
                    //         color,
                    //         rgba: `rgba(${color}, ${color},${color}, ${this.defaultOpacity})`,
                    //         alive: true,
                    //         trail: true,
                    //         trailTtl: 50
                    //     })
                    // }

                    rds.createImage();
                })
                
            }
        }), 10)

        this.label1 = this.addGo(new GO({
            position: new V2(215, 250),
            size: new V2(70, 30),
            init() {

                this.radiation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone().mul(2),
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let rgba = `rgba(${hexToRgb('#7CC470')},0.05)`;

                            hlp.setFillColor(`rgba(${hexToRgb('#7CC470')},0.15)`)
                                .rect(20, 5, 100, 50)

                            hlp.setFillColor(`rgba(${hexToRgb('#7CC470')},0.5)`)
                            .rect(47, 0, 3, 20).rect(95, 0, 3, 20)
                            .rect(47, 40, 3, 20).rect(95, 40, 3, 20)
                            .rect(20, 14, 120, 3).rect(10, 32, 30, 3)

                            rgba = `rgba(${hexToRgb('#D36930')},0.5)`;
                            hlp.setFillColor(rgba)
                            .rect(40,18,60, 24)
                        })
                    }
                }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(windowModel.label1)
                }))
            }
        }), 1)

        this.label2 = this.addGo(new GO({
            position: new V2(215, 290),
            size: new V2(70, 30),
            init() {

                this.radiation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone().mul(1.5).toInt(),
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let rgba = `rgba(${hexToRgb('#DAEA4E')},0.15)`;
                            hlp.setFillColor(rgba)
                            .rect(0,5,size.x, size.y-10)

                            hlp.setFillColor(`rgba(${hexToRgb('#DAEA4E')},0.5)`)
                            .rect(0, 20, 20, 3).rect(0, 39, 80, 3)
                        })
                    }
                }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(windowModel.label2)
                }))
            }
        }), 2)

        this.label3 = this.addGo(new GO({
            position: new V2(115, 260),
            size: new V2(10, 70),
            init() {
                this.radiation = this.addChild(new GO({
                    position: new V2(),
                    size: new V2(100, 150),
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                            let rgba = `rgba(${hexToRgb('#956C94')},0.15)`;
                            hlp.setFillColor(rgba)
                            .rect(20,15,size.x-40, size.y-10)
                            .rect(0,40,size.x, size.y-10)
                            .rect(35,35,30, 70)
                            .rect(40,40,20, 70)

                            hlp.setFillColor(`rgba(${hexToRgb('#956C94')},0.5)`)
                            .rect(20, 13, size.x-40, 3)
                            .rect(10, 31, size.x-20, 3)
                            .rect(0, 49, size.x, 3)
                            .rect(0, 67, size.x, 3)
                            .rect(0, 85, size.x, 3)
                            .rect(10, 103, size.x-20, 3)
                            .rect(10, 121, size.x-20, 3)
                            .rect(31, 0, 3, size.y)
                            .rect(79, 15, 3, size.y)
                        })
                    }
                }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(windowModel.label3)
                }))
            }
        }),2)

        this.label4 = this.addGo(new GO({
            position: new V2(98, 160),
            size: new V2(10, 70),
            init() {
                this.radiation = this.addChild(new GO({
                    position: new V2(),
                    size: new V2(80, 120),
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                            let rgba = `rgba(${hexToRgb('#78C3AE')},0.15)`;
                            hlp.setFillColor(rgba)
                            .rect(20, 0, size.x -40, 20)
                            .rect(10, 20, size.x -20, 10)
                            .rect(0, 30, size.x, 60)
                            .rect(10, 90, size.x-20, 10)
                            .rect(20, 100, size.x-40, 20)
                            .rect(25, 20, size.x-50, 80)
                            .rect(30, 25, size.x-60, 70)

                            hlp.setFillColor(`rgba(${hexToRgb('#78C3AE')},0.5)`)
                            .rect(38, 0, 3, size.y)
                            .rect(20, 8, size.x-40, 3)
                            .rect(10, 26, size.x-20, 3)
                            .rect(0, 44, size.x, 3)
                            .rect(0, 62, size.x, 3)
                            .rect(0, 80, size.x, 3)
                            .rect(10, 98, size.x-20, 3)

                        })
                    }
                }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(windowModel.label4)
                }))
            }
        }),3)

        this.label5 = this.addGo(new GO({
            position: new V2(230, 140),
            size: new V2(50, 100),
            init() {
                // this.radiation = this.addChild(new GO({
                //     position: new V2(),
                //     size: new V2(80, 120),
                //     init() {
                //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //             //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                //             let rgba = `rgba(${hexToRgb('#78C3AE')},0.15)`;
                //             hlp.setFillColor(rgba)
                //             .rect(20, 0, size.x -40, 20)
                //             .rect(10, 20, size.x -20, 10)
                //             .rect(0, 30, size.x, 60)
                //             .rect(10, 90, size.x-20, 10)
                //             .rect(20, 100, size.x-40, 20)
                //             .rect(25, 20, size.x-50, 80)
                //             .rect(30, 25, size.x-60, 70)

                //             hlp.setFillColor(`rgba(${hexToRgb('#78C3AE')},0.5)`)
                //             .rect(38, 0, 3, size.y)
                //             .rect(20, 8, size.x-40, 3)
                //             .rect(10, 26, size.x-20, 3)
                //             .rect(0, 44, size.x, 3)
                //             .rect(0, 62, size.x, 3)
                //             .rect(0, 80, size.x, 3)
                //             .rect(10, 98, size.x-20, 3)

                //         })
                //     }
                // }))

                this.body = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: 
                    createCanvas(this.size, (ctx, size, hlp) => { 
                        hlp.setFillColor('rgba(255,0,0,0.25)').rect(0,0,size.x, size.y) 
                        ctx.drawImage(PP.createImage(windowModel.label5), 0,0)
                        // for(let i = 0; i < 10; i++){
                        //     hlp.rect(0,getRandomInt(0,size.y), size.x, 2)
                        // }
                    })//PP.createImage(windowModel.label4)
                }))
            }
        }),3)

        this.man = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y +70),
            size: new V2(50, 130),
            img: PP.createImage(windowModel.human)
        }), 25)

        this.shadows = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y +146),
            size: new V2(100, 50),
            init() {
                this.rainDropShadows = this.addChild(new GO({
                    position: new V2(0, 25),
                    size: new V2(120, 100),
                    init() {
                        this.items = [];
                    },
                    createImage() {
                    
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                            for(let i = 0; i < this.items.length; i++){
                                hlp.setFillColor('black').rect(this.items[i].x, this.items[i].y, 2,2);
                            }
                        })
                    }
                }))
                this.manShadow = this.addChild(new GO({
                    position: new V2(),
                    size: this.size.clone(),
                    img: PP.createImage(windowModel.manShadow)
                }))
            }
        }), 24)
    }
}