class CurvesScene extends Scene {
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

    createBrick(hlp, currentX, currentY, brickSize) {
        hlp.setFillColor(colors.palettes.fleja.colors[8]).rect(currentX, currentY, brickSize.x, brickSize.y);
        hlp.setFillColor(colors.palettes.fleja.colors[7]).rect(currentX, currentY, 1, brickSize.y)
                                                        .rect(currentX, currentY, brickSize.x, 1)
        hlp.setFillColor(colors.palettes.fleja.colors[9]).rect(currentX+brickSize.x-1, currentY+1, 1, brickSize.y-1)
                                                        .rect(currentX+1, currentY+brickSize.y-1, brickSize.x-2, 1)
        

        for(let x = 1; x < brickSize.x-1;x++){
            if(x % 2 == 0){
                hlp.setFillColor(colors.palettes.fleja.colors[7]).dot(currentX + x, currentY+1);
                hlp.setFillColor(colors.palettes.fleja.colors[9]).dot(currentX + x, currentY+brickSize.y-2);
            }
        }

        for(let y = 1; y < brickSize.y-1;y++){
            if(y % 2 == 0){
                hlp.setFillColor(colors.palettes.fleja.colors[7]).dot(currentX + 1, currentY+y);
                hlp.setFillColor(colors.palettes.fleja.colors[9]).dot(currentX + brickSize.x - 2, currentY+y);
            }
        }

        for(let i = 0; i < 20; i++){
            hlp.setFillColor(colors.palettes.fleja.colors[getRandomBool() ? 7 : 9]).dot(currentX + getRandomInt(2, brickSize.x - 4), currentY + getRandomInt(2, brickSize.y - 4), )
        }
    }

    start(){
        this.flow = this.addGo(new Go({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - 75),
            size: new V2(this.viewport.x, 150),
            init() {
                this.wideLine =new Array(10).fill().map((_) => ({originPosition: fast.r(getRandomInt(this.size.x/5, this.size.x*4/5)), width: getRandomInt(4, 12)}))
                this.lines = new Array(100).fill().map((_) => ({
                    position: new V2(getRandomGaussian(0, this.size.x), getRandomInt(0, this.size.y)).toInt(),
                    size: new V2(getRandomInt(2,4), getRandomInt(0,5) == 0 ? getRandomInt(4, 8) : getRandomInt(10, 40)),
                    color: colors.palettes.fleja.colors[getRandomInt(24,26)],
                    speed: new V2(0, 8)
                }))
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor(colors.palettes.fleja.colors[23]).rect(0,0,size.x, size.y);
                // })

                this.wideLine.forEach(l => l.position = l.originPosition);

                this.timer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < this.lines.length;i++){
                        let line = this.lines[i];

                        line.position.add(line.speed, true);

                        if(line.position.y > this.size.y ){
                            line.position.y = -line.size.y;
                            line.position.x = fast.r(getRandomGaussian(0, this.size.x))
                            line.size = new V2(getRandomInt(2,4), getRandomInt(0,5) == 0 ? getRandomInt(4, 8) : getRandomInt(10, 40));
                            line.hasLightSide = getRandomBool();
                        }
                    }

                    for(let i = 0; i < this.wideLine.length;i++){
                        let line = this.wideLine[i];
                        if(!this.wideLine[i].changeX){
                            this.wideLine[i].changeX = easing.createProps(60, line.position, line.originPosition + getRandomInt(-10,10), 'quad', 'inOut');
                        }

                        this.wideLine[i].position = fast.r(easing.process(this.wideLine[i].changeX));
                        this.wideLine[i].changeX.time++;

                        if(this.wideLine[i].changeX.time > this.wideLine[i].changeX.duration){
                            this.wideLine[i].changeX = undefined;
                        }
                    }

                    this.createImg();
                })
            },
            
            createImg() {
                if(!this.bg){
                    let brickSize = new V2(60, 30)
                    this.bg = createCanvas(this.size, (ctx, size, hlp) => {
                        let hCount = fast.c(size.x/brickSize.x)+1;
                        let vCount = fast.c(size.y/brickSize.y)+1;

                        let currentY = -brickSize.y/2;
                        hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(0,0,size.x,size.y);
                        for(let v = 0; v < vCount;v++){
                            let currentX = v%2 == 0 ? getRandomInt(-brickSize.x, -brickSize.x/2) : getRandomInt(-brickSize.x/2, 0)
                            for(let h = 0; h < hCount; h++){
                                this.parentScene.createBrick(hlp, currentX, currentY, brickSize);

                                currentX+=(brickSize.x+2);
                            }

                            currentY+=(brickSize.y+2);
                        }
                    })
                }

                if(!this.fg){
                    let brickSize = new V2(68, 34)
                    this.fg = createCanvas(this.size, (ctx, size, hlp) => {
                        let hCount = fast.c(size.x/brickSize.x)+1;
                        let vCount = fast.c(size.y/brickSize.y)+1;

                        let currentY = -brickSize.y/2;
                        //hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(0,0,size.x,size.y);
                        for(let v = 0; v < vCount;v++){
                            let currentX = v%2 == 0 ? getRandomInt(-brickSize.x, -brickSize.x/2) : getRandomInt(-brickSize.x/2, 0)
                            for(let h = 0; h < hCount; h++){
                                if(h < 2 || h > hCount-4){
                                    if(h<2  ){
                                        hlp.setFillColor('rgba(0,0,0,0.25').rect(currentX-1+fast.r(brickSize.x/10), currentY-1+fast.r(brickSize.y/10), brickSize.x+2,brickSize.y+2)
                                    }
                                    else if(h == hCount-3){
                                        hlp.setFillColor('rgba(0,0,0,0.25').rect(currentX-1-fast.r(brickSize.x/10), currentY-1+fast.r(brickSize.y/10), brickSize.x+2,brickSize.y+2)
                                    }
                                    hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(currentX-1,currentY-1,brickSize.x+2,brickSize.y+2);
                                    this.parentScene.createBrick(hlp, currentX, currentY, brickSize);
                                    
                                }

                                currentX+=(brickSize.x+2);
                            }

                            currentY+=(brickSize.y+2);
                        }
                    })
                }

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.bg, 0,0,size.x, size.y);
                    
                    ctx.globalAlpha = 0.75
                    hlp.setFillColor(colors.palettes.fleja.colors[23]).rect(0,0,size.x, size.y);
                    ctx.globalAlpha = 0.25
                    hlp.setFillColor(colors.palettes.fleja.colors[26])
                    for(let i = 0; i < this.wideLine.length; i++){
                        let line = this.wideLine[i];
                        hlp.rect(line.position, 0, line.width, size.y);
                    }

                    ctx.globalAlpha = 1

                    for(let i = 0; i < this.lines.length; i++){
                        let line = this.lines[i];
                        hlp.setFillColor(line.color).rect(line.position.x, line.position.y, line.size.x, line.size.y);

                        // if(true){
                        //     hlp.setFillColor('rgba(255,255,255, 0.5)').rect(line.position.x+line.size.x-1,line.position.y, 1, line.size.y)
                        // }
                    }

                    ctx.drawImage(this.fg, 0,0,size.x, size.y);
                })
            }
        }),1)

        this.frontalBricks = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+20),
            size: new V2(this.viewport.x, 50),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('red').rect(0,0,size.x, size.y)
                    let brickSize = new V2(60, 50)
                    let hCount = fast.c(size.x/brickSize.x)+1;
                    let vCount = fast.c(size.y/brickSize.y)+1;

                    let currentY = 0;
                    //hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(0,0,size.x,size.y);
                    for(let v = 0; v < vCount;v++){
                        let currentX = v%2 == 0 ? getRandomInt(-brickSize.x, -brickSize.x/2) : getRandomInt(-brickSize.x/2, 0)
                        for(let h = 0; h < hCount; h++){
                            this.parentScene.createBrick(hlp, currentX, currentY, brickSize);

                            currentX+=(brickSize.x);
                        }

                        currentY+=(brickSize.y+2);
                    }
                 })
            }
        }), 5)

        this.lowerBricks = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 240),
            size: new V2(this.viewport.x, 140),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('red').rect(0,0,size.x, size.y)
                    let brickSize = new V2(30, 20)
                    let hCount = fast.c(size.x/brickSize.x)+1;
                    let vCount = fast.c(size.y/brickSize.y)+1;

                    let currentY = 0;
                    hlp.setFillColor(colors.palettes.fleja.colors[10]).rect(0,0,size.x,size.y);
                    for(let v = 0; v < vCount;v++){
                        let currentX = v%2 == 0 ? getRandomInt(-brickSize.x, -brickSize.x/2) : getRandomInt(-brickSize.x/2, 0)
                        for(let h = 0; h < hCount; h++){
                            this.parentScene.createBrick(hlp, currentX, currentY, brickSize);

                            currentX+=(brickSize.x+1);
                        }

                        currentY+=(brickSize.y+1);
                    }

                    hlp.setFillColor('rgba(0,0,0,0.2)').rect(0,0,size.x, size.y)
                    //.rect(0,0,size.x, brickSize.y).rect(0,0,size.x, brickSize.y*2);
                    for(let i = 0; i < 5; i++){
                        hlp.rect(0,0,size.x, (brickSize.y+1)*(i+1))
                    }
                 })
            }
        }), 3)

        this.waterLine = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createImg(yChange) {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let start = new V2(100, 100);
                    let end = new V2(150, 100);
                    //let midPoints = [{distance: 0.8/3, yChange: 50}, {distance: 2.2/3, yChange: 100}]
                    let midPoints = [{distance: 1/2, yChange: yChange}]
    
                    let dots = mathUtils.getCurvePoints({start, end, midPoints, startMethod: 'inOut', endMethod: 'inOut'});
                    
    
                    hlp.setFillColor('red');
                    let pp = new PerfectPixel({context: ctx});
                    for(let i = 1; i < dots.length; i++){
                        pp.lineV2(dots[i], dots[i-1]);
                        // hlp.setFillColor('yellow').dot(rotatedDots[i].x, rotatedDots[i].y);
                        // hlp.setFillColor('red').dot(dots[i].x, dots[i].y);
                    }
                })
            }
        }),10)

        this.waterLineYCurrent = 0;
        this.waterLineYTimeMax = 100;
        this.waterLineYGoBackTimeMax = 10;
        this.waterLineYMax = 25;
        this.waterLineYChange = easing.createProps(this.waterLineYTimeMax, 0, this.waterLineYMax, 'quad', 'out');
        this.waterLineYGoBackChange = easing.createProps(this.waterLineYGoBackTimeMax, this.waterLineYMax, 0, 'quad', 'out');

        this.currentChange = this.waterLineYChange;
        this.isGoBack = false;

        this.timer = this.regTimerDefault(15, () => {
            //this.currentChange.time = this.waterLineYCurrent;
            this.waterLine.createImg(easing.process(this.currentChange));

            this.currentChange.time++;

            if(this.currentChange.time > this.currentChange.duration){
                this.waterLineYCurrent = 0;
                this.isGoBack = !this.isGoBack;
                
                this.currentChange = this.isGoBack ? this.waterLineYGoBackChange : this.waterLineYChange;
                this.currentChange.time = 0;
            }
        })
    }
}