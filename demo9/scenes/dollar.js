class DollarScene extends Scene {
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
        this.backgroundRenderDefault('#000');
    }

    start(){
        this.dollar = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                this.start = new V2(this.size.x/2, this.size.y/3);
                this.end = new V2(this.size.x/2, this.size.y)
                this.midPoints = [{distance: 1/60, yChange: -10}, {distance: 2/20, yChange: 20}, {distance: 5/20, yChange: -70}, {distance: 8/20, yChange: 100}, {distance: 15/20, yChange: -100}]
                
                this.pathDots = mathUtils.getCurvePoints({start: this.start, end: this.end, midPoints: this.midPoints});    
                this.points = [];
                createCanvas(new V2(1,1), (ctx) => {
                    let pp = new PerfectPixel({context: ctx});
                    for(let i = 1; i < this.pathDots.length; i++){
                        this.points = [...this.points, ...pp.lineV2(this.pathDots[i-1], this.pathDots[i])];
                    }

                    this.points = distinct(this.points, (p) => p.x+'_'+p.y);
                })

                this.items = [];

                this.angle = 0;
                this.originPoints = [...this.points];
                this.pathChangeTimer = this.regTimerDefault(15, () => {
                    this.points = this.originPoints.map(op => new V2(op).substract(this.start).rotate(this.angle).add(this.start).toInt())
                    this.angle+=1;
                    if(this.angle > 360){
                        this.angle-=360;
                    }
                })

                this.itemsGeneratorTimer = this.regTimerDefault(30, () => {
                    let time = fast.r(this.points.length*0.5);
                    this.items.push({
                        indexChange: easing.createProps(time, this.points.length-1, 0, 'quad', 'out'),
                        xShiftChange: easing.createProps(time, getRandomInt(10,50), 1, 'quad', 'out'),
                        alive: true
                    })
                });

                this.itemsProcesserTimer = this.regTimerDefault(15, () => {
                    for(let i = 0; i < this.items.length; i++){
                        let item = this.items[i];
                        if(item.index == 0){
                            item.alive = false;
                            continue;
                        }

                        // item.index = easing.process(item.indexChange);
                        // item.xShift = easing.process(item.xShiftChange);                            
                        easing.commonProcess({context: item, targetpropertyName: 'index', propsName: 'indexChange', round: true})
                        easing.commonProcess({context: item, targetpropertyName: 'xShift', propsName: 'xShiftChange', round: true})

                    }
                    this.items = this.items.filter(item => item.alive);       

                    this.img = this.createImage();                 
                });
            },
            createImage() {
                // if(!this.pathImg){
                //     this.pathImg= createCanvas(this.size, (ctx, size, hlp) => {
                //         hlp.setFillColor('gray');
                //         for(let i = 0; i < this.points.length;i++){
                //             hlp.dot(this.points[i].x, this.points[i].y)
                //         }
                //     })
                // }
                return createCanvas(this.size, (ctx, size, hlp) => {
                    //let dots = mathUtils.getCurvePoints({start: this.start, end: this.end, midPoints: this.midPoints});    
                    //ctx.drawImage(this.pathImg, 0,0)

                    for(let i = 0; i < this.items.length; i++){
                        let item = this.items[i];
                        let pathDot = this.points[item.index];
                        hlp.setFillColor('red').dot(pathDot.x + item.xShift, pathDot.y)
                    }
                })
            }
        }))
    }
}