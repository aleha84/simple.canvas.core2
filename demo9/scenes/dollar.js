class DollarScene extends Scene {
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
        this.backgroundRenderDefault('#000');
    }

    start(){
        this.dollar = this.addGo(new GO({
            hsvCache: [],
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.paths = [];

                this.paths.push(this.generatePath())

                
                this.pathsGeneratorTimer = this.regTimerDefault(150, () => {
                    if(getRandomInt(0,1) == 0) {
                        this.paths.push(this.generatePath())

                        // this.pathImg= createCanvas(this.size, (ctx, size, hlp) => {
                        //     hlp.setFillColor('gray');
                        //     for(let j = 0; j < this.paths.length; j++){
                        //         for(let i = 0; i < this.paths[j].points.length;i++){
                        //             hlp.dot(this.paths[j].points[i].x, this.paths[j].points[i].y)
                        //         }
                        //     }
                        // })
                    }
                })

                this.itemsProcesserTimer = this.regTimerDefault(15, () => {
                    for(let j = 0; j < this.paths.length; j++){
                        let reverse = this.paths[j].reverse;
                        if(this.paths[j].itemsCreated < this.paths[j].maxItems){
                            let time = fast.r(this.paths[j].points.length*getRandom(0.45,0.75));
                            this.paths[j].items.push({
                                isWhite: getRandomInt(0,20) == 0,
                                indexChange: reverse
                                    ? easing.createProps(time, 0, this.paths[j].points.length-1, 'quad', 'in')
                                    : easing.createProps(time, this.paths[j].points.length-1, 0, 'quad', 'out'),
                                xShiftChange: reverse 
                                    ? easing.createProps(time, 1, getRandomInt(10,50), 'quad', 'in')
                                    : easing.createProps(time, getRandomInt(10,50), 1, 'quad', 'out'),
                                yShiftChange: reverse 
                                    ? easing.createProps(time, 1, getRandomInt(10,50), 'quad', 'in')
                                    : easing.createProps(time, getRandomInt(10,50), 1, 'quad', 'out'),
                                sizeChange: reverse
                                    ? easing.createProps(time, 1, getRandomInt(3,5), 'quad', 'in')
                                    : easing.createProps(time, getRandomInt(3,5), 1, 'quad', 'out'),
                                vChange: reverse
                                    ? easing.createProps(time, 0, 100, 'quad', 'out')
                                    : easing.createProps(time, 100, 0, 'quad', 'in'),
                                sChange: reverse
                                    ? easing.createProps(time, 50, 100, 'quad', 'out')
                                    : easing.createProps(time, 100, 50, 'quad', 'in'),
                                alive: true
                            })
    
                            this.paths[j].itemsCreated++;
                        }
                        else {
                            this.paths[j].alive = this.paths[j].items != 0;
                        }

                        for(let i = 0; i < this.paths[j].items.length; i++){
                            let item = this.paths[j].items[i];
                            if((!reverse && item.index == 0) || (reverse && item.index == this.paths[j].points.length-1)){
                                item.alive = false;
                                continue;
                            }
                             
                            easing.commonProcess({context: item, targetpropertyName: 'index', propsName: 'indexChange', round: true})
                            easing.commonProcess({context: item, targetpropertyName: 'xShift', propsName: 'xShiftChange', round: true})
                            easing.commonProcess({context: item, targetpropertyName: 'yShift', propsName: 'yShiftChange', round: true})
                            easing.commonProcess({context: item, targetpropertyName: 'size', propsName: 'sizeChange', round: true})
                            easing.commonProcess({context: item, targetpropertyName: 'v', propsName: 'vChange', round: true})
                            easing.commonProcess({context: item, targetpropertyName: 's', propsName: 'sChange', round: true})
    
                        }

                        this.paths[j].items = this.paths[j].items.filter(item => item.alive);  
                    }

                    this.paths = this.paths.filter(item => item.alive);  
                         
                    this.img = this.createImage();                 
                });

                //this.img = this.createImage();  
            },
            generatePath() {
                let start = new V2(this.size.x/2, this.size.y/2);
                
                let angle = getRandom(0,360);
                let end = new V2(this.size.x, this.size.y).substract(start).rotate(angle).add(start);
                
                let dir = start.direction(end);
                start.add(dir.mul(getRandomInt(1,5)), true);

                let mpCount = getRandomInt(1,3);
                this.maxDistance = 40
                let yChangeChange = easing.createProps(mpCount-1, getRandomInt(5, 10), getRandomInt(10*mpCount, 15*mpCount), 'linear', 'base');
                let midPoints = []//new Array(mpCount).fill().map(_ => getRandomInt(2,this.maxDistance-2)).sort((a,b)=> (a-b)).map(value => ({ distance: value/this.maxDistance }));
                this.segWidth = 1/mpCount;
                //console.log(midPoints)
                let direction = -1;
                if(mpCount > 1){
                    for(let i = 0; i < mpCount; i++){
                        yChangeChange.time = i;
                        let yChange = easing.process(yChangeChange);
                        let distance = getRandom(this.segWidth*i, this.segWidth*(i+1) - this.segWidth/2);
                        if(distance < 0.05){
                            distance = 0.05;
                        }

                        midPoints[i] = {
                            yChange: yChange*direction,
                            distance
                        }
                        direction*=-1;
                    }
                }
                else {
                    midPoints[0] = {
                        distance: getRandomInt(this.maxDistance/3,this.maxDistance*2/3)/this.maxDistance,
                        yChange: getRandomInt(10, 50)*(getRandomBool() ? 1: -1)
                    };
                }
                
                
                this.pathDots = mathUtils.getCurvePoints({start: start, end: end, midPoints: midPoints});    
                this.points = [];
                createCanvas(new V2(1,1), (ctx) => {
                    let pp = new PerfectPixel({context: ctx});
                    for(let i = 1; i < this.pathDots.length; i++){
                        this.points = [...this.points, ...pp.lineV2(this.pathDots[i-1], this.pathDots[i])];
                    }

                    this.points = distinct(this.points, (p) => p.x+'_'+p.y);
                })

                let reverse =  getRandomBool();
                return  {
                    points: this.points,
                    items: [],
                    alive: true,
                    maxItems: getRandomInt(50, 300),
                    itemsCreated: 0,
                    colorH: reverse ? getRandomInt(0, 50) : getRandomInt(180, 230),
                    reverse
                };
            },
            getHsv(h,s,v){
                let key = h+'_' + s+ '_' +v;
                if(!this.hsvCache[key]){
                    this.hsvCache[key] = colors.hsvToHex([h,s,v]);
                }

                return this.hsvCache[key];
                //return colors.hsvToHex([h,s,v]);
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    //let dots = mathUtils.getCurvePoints({start: this.start, end: this.end, midPoints: midPoints});    
                    if(this.pathImg)
                        ctx.drawImage(this.pathImg, 0,0)

                    for(let j = 0; j < this.paths.length; j++){
                        for(let i = 0; i < this.paths[j].items.length; i++){
                            let item = this.paths[j].items[i];
                            let pathDot = this.paths[j].points[item.index];
                            hlp.setFillColor(this.getHsv(this.paths[j].colorH, (item.isWhite ? 0 : item.s), item.v)).rect(pathDot.x + item.xShift, pathDot.y+item.yShift, item.size, item.size)
                        }
                    }
                    
                })
            }
        }))
    }
}