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
            positionXClamps: [50, 250],
            sizeXClamps: [20, 50],
            time: 50
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
                            scene.togglePositionXChange(box);
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

                let c = box.change;
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
                }
                
                if(c.positionX.enabled){
                    box.size.x = easing.process(c.sizeX);
                    c.sizeX.time++;

                    if(c.sizeX.time > c.sizeX.duration) {
                        this.toggleSizeXChange(box);
                    }
                }

                box.needRecalcRenderProperties = true;
            }
            
        })

        this.boxes = [
        this.addGo(new GO({
            position: new V2(this.boxChange.positionXClamps[0], this.sceneCenter.y - 40),
            size: new V2(this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[0]),
            change: {
                positionX: easing.createProps(this.boxChange.time, this.boxChange.positionXClamps[0], this.boxChange.positionXClamps[1], 'expo', 'inOut'),
                sizeX: easing.createProps(fast.r(this.boxChange.time/2), this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[1], 'expo', 'in'),
            },
            startPositionXChange(callback) {
                this.change.positionX.enabled = true;
                // this.change.sizeX = easing.createProps(fast.r(this.parentScene.boxChange.time/2), this.parentScene.boxChange.sizeXClamps[0], this.parentScene.boxChange.sizeXClamps[1], 'expo', 'in')
                this.change.sizeX.enabled = true;
                this.currentCallback = callback;
            },
            init() {
                this.change.positionX.direction = 1;
                this.change.sizeX.direction = 1;
                this.change.positionX.enabled = false;
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
                sizeX: easing.createProps(fast.r(this.boxChange.time/2), this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[1], 'expo', 'in'),
            },
            startPositionXChange(callback) {
                this.change.positionX.enabled = true;
                // this.change.sizeX = easing.createProps(fast.r(this.parentScene.boxChange.time/2), this.parentScene.boxChange.sizeXClamps[0], this.parentScene.boxChange.sizeXClamps[1], 'expo', 'in')
                this.change.sizeX.enabled = true;
                this.currentCallback = callback;
            },
            init() {
                this.change.positionX.direction = -1;
                this.change.sizeX.direction = 1;
                this.change.positionX.enabled = false;
                this.change.sizeX.enabled = false;
                this.img = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('white').dot(0,0);
                })
            }
        }))]
    }
}