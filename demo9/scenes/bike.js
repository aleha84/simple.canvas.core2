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
                this.time = 250;
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
                        }
                    ]
                };

                item.xChange = easing.createProps(this.time, 0, item.tl.x, 'quad', 'in', () => {
                    item.alive = false;
                });

                item.yChange = easing.createProps(this.time, this.size.y, item.tl.y, 'quad', 'in');

                for(let i = 0; i < item.parts.length; i++){
                    let part = item.parts[i];
                    if(part.type == 'rect'){
                        part.sizeXChange = easing.createProps(this.time, 0, part.size.x, 'quad', 'in');
                        part.sizeYChange = easing.createProps(this.time, 0, part.size.y, 'quad', 'in');
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
                    }
                }
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('grey').strokeRect(0,0,size.x, size.y);

                    for(let i = 0; i < this.items.length;i++){
                        let item = this.items[i];

                        let tl = item.tl;

                        for(let j = 0; j < item.parts.length; j++){
                            let part = item.parts[j];

                            if(part.type == 'rect'){
                                if(part.size.x >= 1 && part.size.y >=1){
                                    let partTl = tl.add(part.tl).toInt();

                                    hlp.setFillColor(part.color).rect(partTl.x, partTl.y, fast.f(part.size.x), fast.f(part.size.y));
                                }
                            }
                        }

                    }
                })
            }
        }))
    }
}