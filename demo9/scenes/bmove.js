class Demo9BMoveScene extends Scene {
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

    togglePositionXChange(go) {
        let c = go.change;
        let from = this.boxChange.positionXClamps[0];
        let to = this.boxChange.positionXClamps[1];
        let direction = c.positionX.direction;
        direction*=-1;
        if(direction < 0){
            from = this.boxChange.positionXClamps[1];
            to = this.boxChange.positionXClamps[0];
        }

        c.positionX = easing.createProps(this.boxChange.time, from, to, 'expo', 'inOut')
        c.positionX.direction = direction;
        c.positionX.enabled = false;
    }

    togglePositionYChange(go) {
        let c = go.change;
        let from = this.boxChange.positionYClamps[0];
        let to = this.boxChange.positionYClamps[1];
        let direction = c.positionY.direction;
        direction*=-1;
        if(direction < 0){
            from = this.boxChange.positionYClamps[1];
            to = this.boxChange.positionYClamps[0];
        }

        c.positionY = easing.createProps(fast.r(this.boxChange.time/4), from, to, 'sin', 'in')
        c.positionY.direction = direction;
        c.positionY.enabled = false;
    }


    toggleSizeXChange(go){
        let c = go.change;
        let from = this.boxChange.sizeXClamps[0];
        let to = this.boxChange.sizeXClamps[1];
        let method = 'in'
        let direction = c.sizeX.direction;
        direction*=-1;
        if(direction < 0){
            from = this.boxChange.sizeXClamps[1];
            to = this.boxChange.sizeXClamps[0];
            method = 'out'
        }

        c.sizeX = easing.createProps(fast.r(this.boxChange.time/2), from, to, 'expo', method)
        c.sizeX.direction = direction;
        c.sizeX.enabled = false;
    }

    start(){
        this.boxChange = {
            positionYClamps: [this.sceneCenter.y - 40, this.sceneCenter.y],
            positionXClamps: [50, 250],
            sizeXClamps: [20, 100],
            sizeYClamps: [20, 2],
            time: 25
        }

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                this.processScriptCount = 2;
                this.startSequence();
            },
            checkProcessScript() {
                this.processScriptCount--;
                if(this.processScriptCount == 0){
                    this.processScriptCount = 2;
                    this.processScript();
                }
            },
            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    function(){
                        for(let i = 0; i < scene.boxes.length; i++){
                            let box = scene.boxes[i]
                            box.startPositionXChange(() => this.checkProcessScript());
                        }
                    },
                    this.addProcessScriptDelay(50),
                    function(){
                        for(let i = 0; i < scene.boxes.length; i++){
                            let box = scene.boxes[i]

                            box.change.pY = easing.createProps(fast.r(scene.boxChange.time/5), box.position.y, box.position.y +40*(box.position.y < scene.sceneCenter.y - 20 ? 1:-1), 'sin', 'in')
                            box.change.pY.onComplete = () => this.checkProcessScript();
                        }
                    },
                    function(){
                        for(let i = 0; i < scene.boxes.length; i++){
                            let box = scene.boxes[i]
                            box.change.sizeY = easing.createProps(3, scene.boxChange.sizeYClamps[0], scene.boxChange.sizeYClamps[1], 'quad', 'out')
                            box.change.pY = easing.createProps(3, box.position.y, box.position.y + ((scene.boxChange.sizeYClamps[0]-scene.boxChange.sizeYClamps[1])/2)*(box.position.y < scene.sceneCenter.y - 20 ? -1:1), 'quad', 'out')
                            box.change.pY.onComplete = () => this.checkProcessScript();
                        }
                    },
                    function(){
                        for(let i = 0; i < scene.boxes.length; i++){
                            let box = scene.boxes[i]
                            box.change.sizeY = easing.createProps(10, scene.boxChange.sizeYClamps[1], scene.boxChange.sizeYClamps[0], 'quad', 'out')
                            box.change.pY = easing.createProps(10, box.position.y, box.position.y + ((scene.boxChange.sizeYClamps[0]-scene.boxChange.sizeYClamps[1])/2)*(box.position.y < scene.sceneCenter.y - 20 ? 1:-1), 'quad', 'out')
                            box.change.sizeY.onComplete = () => this.checkProcessScript();
                        }
                    },
                    this.addProcessScriptDelay(50),
                    function(){
                        for(let i = 0; i < scene.boxes.length; i++){
                            let box = scene.boxes[i]
                            scene.togglePositionXChange(box);
                            scene.togglePositionYChange(box);
                            scene.toggleSizeXChange(box);
                            box.startPositionXChange(() => this.checkProcessScript());
                        }
                    },
                    this.addProcessScriptDelay(100),
                    function(){
                        this.startSequence();
                    }
                ]

                this.processScript();
            }
        }))

        this.timer = this.regTimerDefault(30, () => {
            for(let i = 0; i < this.boxes.length; i++){
                let box = this.boxes[i];
                box.prevPosition = box.position.clone();
                let c = box.change;

                // if(c.positionY.enabled){
                //     box.position.y = easing.process(c.positionY);
                //     c.positionY.time++;
                //     if(c.positionY.onChange){
                //         c.positionY.onChange(c.positionY);
                //     }

                //     if(c.positionY.time > c.positionY.duration) {
                //         c.positionY.enabled = false;
                //         if(box.currentCallback) {
                //             box.currentCallback();
                //             box.currentCallback = undefined;
                //         }
                //     }
                // }

                if(c.positionX.enabled){
                    box.position.x = easing.process(c.positionX);
                    c.positionX.time++;

                    if(c.positionX.time > c.positionX.duration) {
                        c.positionX.enabled = false;
                        c.sizeX.enabled = false;
                        if(box.currentCallback) {
                            box.currentCallback();
                            box.currentCallback = undefined;
                        }
                    }

                    box.size.x = easing.process(c.sizeX);
                    c.sizeX.time++;

                    if(c.sizeX.time > c.sizeX.duration) {
                        this.toggleSizeXChange(box);
                    }
                }

                if(c.sizeY) {
                    box.size.y = easing.process(c.sizeY);
                    c.sizeY.time++;

                    if(c.sizeY.time > c.sizeY.duration) {
                        let onComplete = c.sizeY.onComplete;
                        c.sizeY = undefined;
                        if(onComplete) {
                            onComplete();
                        }
                    }
                }

                easing.commonProcess({ context: c, propsName: 'pY', removePropsOnComplete: true, setter: (value) => { box.position.y = value; }  })

                box.needRecalcRenderProperties = true;

                this.lines.createImage();
            }
            
        })

        this.boxes = [
        this.addGo(new GO({
            position: new V2(this.boxChange.positionXClamps[0], this.sceneCenter.y - 40),
            size: new V2(this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[0]),
            change: {
                positionX: easing.createProps(this.boxChange.time, this.boxChange.positionXClamps[0], this.boxChange.positionXClamps[1], 'expo', 'inOut'),
                positionY: easing.createProps(fast.r(this.boxChange.time/4), this.boxChange.positionYClamps[0], this.boxChange.positionYClamps[1], 'sin', 'in'),
                sizeX: easing.createProps(fast.r(this.boxChange.time/2), this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[1], 'expo', 'in'),
            },
            startPositionXChange(callback) {
                this.change.positionX.enabled = true;
                // this.change.sizeX = easing.createProps(fast.r(this.parentScene.boxChange.time/2), this.parentScene.boxChange.sizeXClamps[0], this.parentScene.boxChange.sizeXClamps[1], 'expo', 'in')
                this.change.sizeX.enabled = true;
                this.currentCallback = callback;
            },
            startPositionYChange(callback) {
                this.change.positionY.enabled = true;
                this.currentCallback = callback;
            },
            init() {
                this.change.positionX.direction = 1;
                this.change.positionY.direction = 1;
                this.change.sizeX.direction = 1;
                this.change.positionX.enabled = false;
                this.change.positionY.enabled = false;
                this.change.sizeX.enabled = false;
                this.img = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('white').dot(0,0);
                })
            }
        })),

        this.addGo(new GO({
            position: new V2(this.boxChange.positionXClamps[1], this.sceneCenter.y),
            size: new V2(this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[0]),
            change: {
                positionX: easing.createProps(this.boxChange.time, this.boxChange.positionXClamps[1], this.boxChange.positionXClamps[0], 'expo', 'inOut'),
                positionY: easing.createProps(fast.r(this.boxChange.time/4), this.boxChange.positionYClamps[1], this.boxChange.positionYClamps[0], 'sin', 'in'),
                sizeX: easing.createProps(fast.r(this.boxChange.time/2), this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[1], 'expo', 'in'),
            },
            startPositionYChange(callback) {
                this.change.positionY.enabled = true;
                this.currentCallback = callback;
            },
            startPositionXChange(callback) {
                this.change.positionX.enabled = true;
                // this.change.sizeX = easing.createProps(fast.r(this.parentScene.boxChange.time/2), this.parentScene.boxChange.sizeXClamps[0], this.parentScene.boxChange.sizeXClamps[1], 'expo', 'in')
                this.change.sizeX.enabled = true;
                this.currentCallback = callback;
            },
            init() {
                this.change.positionX.direction = -1;
                this.change.positionY.direction = -1;
                this.change.sizeX.direction = 1;
                this.change.positionX.enabled = false;
                this.change.positionY.enabled = false;
                this.change.sizeX.enabled = false;
                this.img = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('white').dot(0,0);
                })
            }
        }))]

        this.lines = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y-20),
            size: new V2(220, 60),
            boxes: this.boxes,
            init() {
                this.dots = [];
                this.ttl = 20;
                this.tl = this.position.substract(this.size.mul(0.5));
                this.createImage();
            },
            createImage() {
                for(let i = 0; i < this.boxes.length; i++){
                    let box = this.boxes[i];
                    //this.dots.push({p: box.position.substract(this.tl), ttl: this.ttl});
                    let dir = box.position.direction(box.prevPosition);
                    let distance = fast.r(box.position.distance(box.prevPosition));
                    for(let i = 0; i < distance; i++){
                        let ttl = this.ttl;
                        let p = box.position.substract(this.tl).add(dir.mul(i));
                        if(dir.y == 0){
                            if(box.position.y < this.parentScene.sceneCenter.y - 20){
                                p = p.add(new V2(0, -box.size.y/2))
                            }
                            else {
                                p = p.add(new V2(0, box.size.y/2 - 1))
                            }
                        }
                        else {
                            //ttl = fast.r(ttl/1.5);
                            if(box.position.x < this.parentScene.sceneCenter.x){
                                p = p.add(new V2(-box.size.x/2, 0))
                            }
                            else {
                                p = p.add(new V2(box.size.x/2 - 1, 0))
                            }
                        }

                        this.dots.push({p, ttl});
                    }
                }

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let i = 0; i < this.dots.length; i++){
                        let dot = this.dots[i];
                        hlp.setFillColor(`rgba(255,255,255, ${dot.ttl--/this.ttl})`).dot(dot.p.x, dot.p.y);
                    }
                    
                    this.dots = this.dots.filter(d => d.ttl > 0);


                })
            }
        }))
    }
}