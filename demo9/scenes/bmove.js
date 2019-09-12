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

    togglePositionXChange() {
        let c = this.boxChange.change;
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
    }

    toggleSizeXChange(){
        let c = this.boxChange.change;
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
    }

    start(){
        this.boxChange = {
            positionXClamps: [50, 250],
            sizeXClamps: [20, 50],
            time: 50
        }

        this.boxChange.change = {
            positionX: easing.createProps(this.boxChange.time, this.boxChange.positionXClamps[0], this.boxChange.positionXClamps[1], 'expo', 'inOut'),
            sizeX: easing.createProps(fast.r(this.boxChange.time/2), this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[1], 'expo', 'in'),
        }

        this.boxChange.change.positionX.direction = 1;
        this.boxChange.change.sizeX.direction = 1;

        this.timer = this.regTimerDefault(30, () => {
            let c = this.boxChange.change;
            this.box.position.x = easing.process(c.positionX);
            this.box.size.x = easing.process(c.sizeX);
            c.positionX.time++;
            c.sizeX.time++;

            if(c.positionX.time > c.positionX.duration) {
                this.togglePositionXChange();
                this.toggleSizeXChange();
            }

            if(c.sizeX.time > c.sizeX.duration) {
                this.toggleSizeXChange();
            }
            
            this.box.needRecalcRenderProperties = true;
        })


        this.box = this.addGo(new GO({
            position: new V2(this.boxChange.positionXClamps[0], this.sceneCenter.y),
            size: new V2(this.boxChange.sizeXClamps[0], this.boxChange.sizeXClamps[0]),
            init() {
                this.img = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('white').dot(0,0);
                })
            }
        }))
    }
}