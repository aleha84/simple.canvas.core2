class Demo9BRoadScene extends Scene {
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

        this.traceDots = []
        

        createCanvas(this.viewport, (ctx, size, hlp) => {
            this.traceDots = mathUtils.getCurvePoints({start: new V2(this.viewport.x*0.7,0).toInt(), end: new V2(this.viewport.x*0.3, this.viewport.y+40).toInt(),
                midPoints: 
                    [
                        {distance: 0.15, yChange: -20},
                        //{distance: 0.3, yChange: 20},
                        {distance: 0.5, yChange: 40},
                        {distance: 0.65, yChange: 0},
                        {distance: 0.9, yChange: 20}]})

            let pp = new PerfectPixel({context: ctx});
            
            let result = [];
            for(let i = 1; i < this.traceDots.length; i++){
                result = [...result, ...pp.line(this.traceDots[i-1].x, this.traceDots[i-1].y, this.traceDots[i].x, this.traceDots[i].y)]
            }

            this.traceDots = distinct(result, (p) => p.x + '_' + p.y)
        })

        this.mainRoad = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            traceDots: this.traceDots,
            init() {
                this.roadWidth = 50;
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    
                    for(let i = 0; i < this.traceDots.length; i++){
                        let td = new V2(this.traceDots[i]).toInt()
                        for(let j = 0; j < this.roadWidth; j++){
                            hlp.setFillColor('#CCC')
                            if(j >= 22 && j <=28){
                                hlp.setFillColor('#555')
                            }
                            hlp.dot(td.x+j, td.y)
                        }
                        
                    }
                })
            }
        }), 1)
    }
}

class Demo9FlowItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            traceIndex: 0,
            direction: 1
        }, options)

        super(options);
    }

    init() {
        if(this.direction > 0){
            this.fronTalImg = createCanvas(size, (ctx, size, hlp) => {
                //
            })

            this.backImg = createCanvas(size, (ctx, size, hlp) => {
                //
            })
        }
        else {

        }
    }
}