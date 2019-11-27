class Demo9DreamsScene extends Scene {
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
        this.table = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(200,120),
            init() {
                this.img = PP.createImage(Demo9DreamsScene.boredModels.table);
                this.position = new V2(this.parentScene.sceneCenter.x, this.parentScene.viewport.y - this.size.y/2).toInt()
            }
        }), 1)

        this.dreams = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(this.viewport.x,this.viewport.y/2),
            init() {
                this.position = new V2(this.parentScene.sceneCenter.x, this.size.y/2).toInt();
                this.bg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.bottomCircles = [{p: new V2(10, 50), r: 20}, {p: new V2(25, 60), r: 15}, {p: new V2(35, 73), r: 8}, {p: new V2(53, 66), r: 20}, {p: new V2(65, 75), r: 15}]
                        this.timer = this.regTimerDefault(50, () => {
                            for(let i =0; i < this.bottomCircles.length; i++){
                                let bc = this.bottomCircles[i];

                                if(bc.direction == undefined){
                                    bc.direction = getRandomBool() ? 1 : -1;
                                    bc.y = bc.p.y;
                                }

                                if(bc.yChange == undefined){
                                    bc.direction *= -1;
                                    bc.yChange = easing.createProps(10, bc.y, bc.y+(bc.direction*bc.r/2), 'quad', 'inOut');
                                }
                                else {
                                    easing.commonProcess({context: bc, targetpropertyName: 'y', propsName: 'yChange', round: true, removePropsOnComplete: true});
                                }
                            }

                            //this.createImage();
                        })
                    },
                    createImage() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                            
                            let strokePoints = [];
                            this.bottomCircles.forEach((c, i, arr) => {
                                let dots = [];
                                hlp.setFillColor('red')
                                hlp.strokeEllipsis(0,359, 2, new V2(c.p.x, c.y), c.r,c.r, dots)
                                dots = distinct(dots, (p) => p.x+'_'+p.y)
                                //c.strokeDots = dots;

                                
                                let excludedCircles = arr.filter(_c => _c != c);
                                for(let i = 0; i < dots.length; i++){
                                    let d = dots[i];
                                    if(excludedCircles.filter(ec => fast.r(Math.sqrt(Math.pow((d.x - ec.p.x),2) + Math.pow((d.y-ec.p.y),2))) < ec.r).length == 0){
                                        //hlp.dot(d.x, d.y)
                                        if(strokePoints[d.x] == undefined || strokePoints[d.x] < d.y)
                                            strokePoints[d.x] = d.y;
                                    }
                                }
                            });

                            hlp.setFillColor('green');
                            for(let i = 0; i < size.x; i++){
                                if(strokePoints[i]){
                                    hlp.dot(i, strokePoints[i]);
                                }
                            }

                        })
                    }
                }))
            }
        }), 5)


        this.man = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(200,120),
            init() {
                this.img = PP.createImage(Demo9DreamsScene.boredModels.man);
                this.position = new V2(this.parentScene.sceneCenter.x, this.parentScene.viewport.y - this.size.y/2).toInt()
            }
        }), 10)
    }
}