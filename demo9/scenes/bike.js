class Demo9BikeScene extends Scene {
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
        this.perspectiveRight = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: new V2(this.viewport.x/2, this.viewport.y*0.8).toInt(),
            init() {
                this.type = 'cubic';
                this.method = 'in';
                this.time = 500//250;
                this.perspectiveCenter = new V2(0, this.size.y)
                this.position.x = fast.r(this.parentScene.viewport.x - this.size.x/2)
                this.position.y = fast.r(this.size.y/2)
                this.items = []

                this.regTimerDefault(15, () => {
                    for(let i = 0; i < this.items.length;i++){
                        this.processItem(this.items[i]);
                    }

                    this.items = this.items.filter(item => item.alive);

                    this.createImage();
                })

                this.regTimerDefault(1000, () => {
                    this.items.unshift(this.createItem());
                })
            },
            createItem() {
                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl: new V2(this.size.x, 0),
                    parts: [
                        {
                            type: 'rect',
                            tl: new V2(0,0),
                            size: new V2(100,200),
                            color: 'white'
                        },
                        {
                            type: 'ppPerspective',
                            startP: new V2(0,0),
                            length: 30,
                            height: 200,
                            color: 'grey'
                        }
                    ]
                };

                item.xChange = easing.createProps(this.time, this.perspectiveCenter.x, item.tl.x, this.type, this.method, () => {
                    item.alive = false;
                });

                item.yChange = easing.createProps(this.time, this.perspectiveCenter.y, item.tl.y, this.type, this.method);

                for(let i = 0; i < item.parts.length; i++){
                    let part = item.parts[i];
                    if(part.type == 'rect'){
                        part.sizeXChange = easing.createProps(this.time, 0, part.size.x, this.type, this.method);
                        part.sizeYChange = easing.createProps(this.time, 0, part.size.y, this.type, this.method);
                    }
                    if(part.type == 'ppPerspective'){
                        part.lengthChange = easing.createProps(this.time, 0, part.length, this.type, this.method);
                    }
                }

                return item;
            },
            processItem(item) {
                easing.commonProcess({ context: item, setter: (value) => { item.tl.x = value }, propsName: 'xChange', round: false })
                easing.commonProcess({ context: item, setter: (value) => { item.tl.y = value }, propsName: 'yChange', round: false })

                for(let i = 0; i < item.parts.length; i++){
                    let part = item.parts[i];
                    if(part.type == 'rect'){
                        easing.commonProcess({ context: part, setter: (value) => { part.size.x = value }, propsName: 'sizeXChange', round: false })
                        easing.commonProcess({ context: part, setter: (value) => { part.size.y = value }, propsName: 'sizeYChange', round: false })

                        // part.size.x = fast.r(part.size.x/2)*2
                        // part.size.y = fast.r(part.size.y/2)*2
                    }
                    if(part.type == 'ppPerspective'){
                        easing.commonProcess({ context: part, targetpropertyName: 'length', propsName: 'lengthChange', round: false })
                    }
                }
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('grey').strokeRect(0,0,size.x, size.y);

                    let pp = new PerfectPixel({context: ctx})

                    for(let i = 0; i < this.items.length;i++){
                        let item = this.items[i];

                        let tl = item.tl;

                        for(let j = 0; j < item.parts.length; j++){
                            let part = item.parts[j];

                            if(part.type == 'rect'){
                                if(part.size.x >= 1 && part.size.y >=1){
                                    let partTl = tl.add(part.tl).toInt();

                                    hlp.setFillColor(part.color).rect(partTl.x, partTl.y, fast.f(part.size.x), fast.f(part.size.y));
                                    //hlp.setFillColor(part.color).rect(partTl.x, partTl.y, (part.size.x), (part.size.y));
                                }
                            }

                            if(part.type == 'ppPerspective' && part.length > 1){
                                let lineFrom = tl.add(part.startP).toInt();
                                let direction = lineFrom.direction(this.perspectiveCenter);
                                let lineTo = lineFrom.add(direction.mul(part.length));
                                hlp.setFillColor(part.color);
                                let points = pp.lineV2(lineFrom, lineTo);
                                for(let i = 0; i < points.length; i++){
                                    hlp.rect(points[i].x, points[i].y, 1, part.height)
                                }
                            }
                        }

                    }
                })
            }
        }))
    }
}