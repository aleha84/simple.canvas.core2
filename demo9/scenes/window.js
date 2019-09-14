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
                color: '#151728'
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
                line: '#B1ADAC',
                lineDarker: '#9E9B9A',
                colored: '#9D8E7B',
                coloredDarker: '#938574',
                dark: '#282A29'
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
                                        //
                                        hlp.setFillColor('rgba(224,238,255,0.25)').rect(r.min, y, r.max-r.min,1)
                                    }
                                }
                            }
                        }
                    }
                    
                    let vChange = easing.createProps(50, 14, 0, 'quad', 'out');
                    let hsv = [212,12,14];
                    for(let y = circlesProps[1].rows.length+1; y < size.y; y++){
                        let delta = y - circlesProps[1].rows.length;
                        if(delta <= 50){
                            vChange.time = delta;
                            let v =  easing.process(vChange);
                            v = fast.f(v/1)*1;
                            hsv[2] = v;
                        }
                        else {
                            hsv[2] = 0;
                        }
                        
                        let row = circlesProps[1].rows[circlesProps[1].rows.length-delta];
                        hlp.setFillColor(colors.hsvToHex(hsv)).rect(row.min, y-1, row.max - row.min, 1);
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
                        speed: 20,
                        v: 40,
                        count: 3,
                    },
                    {
                        speed: 25,
                        v: 60,
                        count: 2
                    },
                    {
                        speed: 30,
                        v: 70,
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

                        hlp.setFillColor(colors.hsvToHex([0,0,rd.layer.v])).rect(rd.p.x, rd.p.y, 1, rd.layer.speed);

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
                
                this.maxTtl = 50;
                
                this.dropsTimer = this.regTimerDefault(30, () => {
                    let r = getRandomInt(0, this.radius);
                    let angle = getRandomInt(0, 360);
                    let p = V2.up.rotate(angle).mul(r).add(this.center).toInt();

                    let hitted = this.drops.filter(d => d.p.distance(p) <= 1.42);
                    let fall = false;
                    if(hitted.length){
                        fall = true;
                        for(let i = 0; i < hitted.length; i++){
                            hitted[i].alive = false;
                        }
                    }
                    
                    this.drops.push({
                        p, 
                        fall,
                        color: getRandomInt(5,15)*10,
                        alive: true,
                    });
                    
                    this.drops = this.drops.filter(d => d.alive)

                    this.createImage();
                })

                
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                    for(let i = 0; i < this.drops.length; i++){
                        let drop = this.drops[i];
                        // let opacity = drop.ttl/this.maxTtl;
                        // if(drop.fall){
                        //     opacity = 0.75;
                        // }
                        let opacity = 0.75;

                        hlp.setFillColor(`rgba(${drop.color}, ${drop.color},${drop.color}, ${opacity})`).rect(fast.r(drop.p.x), fast.r(drop.p.y),2,2);

                        if(drop.fall){
                            drop.p.y+=getRandom(0,3);
                            if(getRandomInt(0,4) == 0){
                                drop.p.x+=getRandom(-1,1);
                            }

                            let p = drop.p.toInt();

                            let hitted = this.drops.filter(d => d.p.distance(p) <= 1.42 );
                            for(let i = 0; i < hitted.length; i++){
                                hitted[i].alive = false;
                            }
                            
                            drop.alive = drop.p.distance(this.center) <  this.radius;
                        }
                    }
                })
                
            }
        }), 10)

        this.label1 = this.addGo(new GO({
            position: new V2(215, 250),
            size: new V2(70, 30),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#35EFD0')
                        .rect(1,1, size.x-2, 2)
                        .rect(1,1, 2, size.y-2)
                        .rect(1,size.y-3, size.x-2, 2)
                        .rect(size.x-3,1, 2, size.y-2)
                    hlp.setFillColor('#4BD76D')
                        .rect(0,0,size.x, 1)
                        .rect(0,0,1, size.y)
                        .rect(0,size.y-1,size.x, 1)
                        .rect(size.x-1,0,1, size.y)

                        .rect(3,3,size.x-6, 1)
                        .rect(3,3,1, size.y-6)
                        .rect(3,size.y-4,size.x-6, 1)
                        .rect(size.x-4,3,1, size.y-6)
                })
            }
        }))

        this.man = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y +70),
            size: new V2(50, 130),
            img: PP.createImage(windowModel.human)
        }), 25)
    }
}