class SmokeScene extends Scene {
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
        this.smokeLayer = this.addGo(new SmokeSceneLayerGO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone()
        }))
    }
}

class SmokeSceneLayerGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            hClamps: [10, 30],
            wClamps: [40, 50],
            fromY: 250, 
            toY: 200
        }, options)

        super(options);
    }

    init() {
        
        this.direction = new V2(0, this.fromY).direction(new V2(this.size.x, this.toY));

        this.items = [];
        let currentWidth = getRandomInt(this.wClamps[0], this.wClamps[1]);
        let currentX = -currentWidth;
        
        this.startX = currentX;
        this.yChange = easing.createProps(this.size.x+currentWidth, this.fromY, this.toY, 'linear', 'base');
        while(currentX < this.size.x){
            let end = this.direction.mul(currentWidth);

            this.items.push({
                dots: mathUtils.getCurvePoints({start: new V2(0,0), end: end, midPoints: [ {distance: getRandom(10,15)/20, yChange: -getRandomInt(this.hClamps[0], this.hClamps[1])} ]}),
                startX: currentX
            })

            currentX+=end.x;
            currentWidth = getRandomInt(this.wClamps[0], this.wClamps[1]);
        }

        // this.timer = this.regTimerDefault(15, () => {
        //     this.createImage();
        // })

        this.createImage();
    }

    createImage() {
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            for(let i = 0; i < this.items.length;i++){
                let item = this.items[i];
    
                this.yChange.time = item.startX-this.startX;
                let currentY = fast.r(easing.process(this.yChange));
    
                hlp.setFillColor('white');
                for(let d = 0;d< item.dots.length;d++){
                    let dot = item.dots[d].toInt();
                    hlp.rect(fast.r(dot.x+item.startX), fast.r(dot.y+currentY), 1, size.y)
                }
            }
        })
        
    }
}