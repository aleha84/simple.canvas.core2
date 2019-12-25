class Demo9FogScene extends Scene {
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
        //'#9150AC'
        this.backgroundRenderDefault();
    }

    start(){

        this.leftB = this.addGo(new GO({
            position: new V2(),
            size: new V2(72,this.viewport.y),
            init() {
                this.position = new V2(this.size.x/2, this.parentScene.sceneCenter.y).toInt();
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('#161729');
                    pp.fillByCornerPoints([new V2(0,0), new V2(30, 0), new V2(71,48), new V2(42, size.y), new V2(0, size.y)]);
                    
                    let d1 = new V2(71,48).direction(new V2(30, 0));
                    let d2 = new V2(71,48).direction(new V2(42, size.y));
                    let step1 = 20;
                    let current = undefined;
                    let bottomLine = createLine(new V2(-200, size.y), new V2(size.x, size.y));
                    let leftLine = createLine(new V2(0, -size.y*2), new V2(0, size.y*2));
                    

                    let step2 = 2.5;
                    let step2V2 = d2.mul(step2);
                    pp.setFillStyle('#111727');
                    
                    current = new V2(71,48).add(step2V2);
                    let d1Clone = d1.clone();
                    for(let i = 0; i < 65; i++){
                        pp.lineL(createLine(current, raySegmentIntersectionVector2(current, d1Clone, leftLine)));
                        current = current.add(step2V2);
                        d1Clone.rotate(-0.5, false, true);
                    }

                    pp.setFillStyle('#1E1B30');
                    current = new V2(71,48).add(d1.mul(step1));
                    for(let i = 0; i < 4; i++){
                        pp.lineL(createLine(current.add(d2.mul(3)), raySegmentIntersectionVector2(current, d2, bottomLine)));
                        current = current.add(d1.mul(step1)).toInt();
                        step1+=5;
                    }
                })
            }
        }), 8);

        this.rightB = this.addGo(new GO({
            position: new V2(),
            size: new V2(100,this.viewport.y),
            init() {
                this.position = new V2(this.parentScene.viewport.x - this.size.x/2, this.parentScene.sceneCenter.y).toInt();
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});
                    pp.setFillStyle('#311438')
                    pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(35, size.y)]);

                    //let a1 = V2.up.angleTo(new V2(3,5).direction(new V2(22,0)));
                    let rightLine = createLine(new V2(size.x, -size.y), new V2(size.x, size.y*2));


                    let p1 = new V2(0,0);
                    let step1 = 10;
                    let d2 = p1.direction(new V2(35, size.y));
                    let d1 = new V2(3,5).direction(new V2(22,0))
                    
                    let step2 = 20;
                    let step2V2 = new V2(step2, 0);
                    pp.setFillStyle('#1B0F27');
                    let vLine = createLine(p1.add(step2V2), new V2(35, size.y).add(step2V2))
                    for(let i = 0; i < 6; i++){
                        pp.lineL(vLine);
                        vLine = createLine(vLine.begin.add(step2V2), vLine.end.add(step2V2));
                    }

                    let current = p1.add(d2.mul(step1/2)).toInt();
                    pp.setFillStyle('#0E0B1B');
                    for(let i = 0; i < 13; i++){
                        let current1 = current.add(new V2(1,1));
                        
                        pp.fillByCornerPoints([current.add(new V2(1,0)), raySegmentIntersectionVector2(current, d1, rightLine), raySegmentIntersectionVector2(current1, d1, rightLine), current1]);
                        
                        step1+=1;
                        d1.rotate(0.5, false, true);
                        current = current.add(d2.mul(step1)).toInt();
                    }

                    pp.setFillStyle('#01080B');
                    let w1 = 4;
                    for(let i =0; i < w1;i++){

                        if(i == w1-1) pp.setFillStyle('#0E0B1B');

                        pp.line(0+i, 0, 35+i, size.y);
                    }

                })
            }
        }), 8);
    }
}