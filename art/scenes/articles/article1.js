class Article1Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            events: {
                up: ({state}) => {
                    //console.log(params.state.logicalPosition)

                    if(!this.p1) {
                        this.p1 = this.addGo(new Article1Point({position: state.logicalPosition}), 1) 

                        return;
                    }

                    if(!this.p2) {
                        this.p2 = this.addGo(new Article1Point({position: state.logicalPosition}), 1) 

                        return;
                    }

                    this.p1.setDead();
                    this.p1 = undefined;
                    this.p2.setDead();
                    this.p2 = undefined;

                    this.flowItems.forEach(fi => fi.setDead());
                    this.flowItems = [];
                }
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.p1 = undefined;
        this.p2 = undefined;
        this.flowItems = [];
    }

}

class Article1Point extends GO {
    constructor({position}) {
        super({
            position: position.toInt(),
            size: new V2(3,3)
        });   
    }

    init() {
        //console.log(this.position)
        this.imgCounter = 0;
        this.img = Article1Point.imageFrames[this.imgCounter];
        
        this.timer1 = this.regTimerDefault(50, () => {
            this.img = Article1Point.imageFrames[this.imgCounter];
            this.imgCounter++;

            if(this.imgCounter == Article1Point.imageFrames.length) {
                this.imgCounter = 0;
            }
        })

        if(this.parentScene.p1 && this.parentScene.p2) {
            this.target = this == this.parentScene.p1 ? this.parentScene.p2 : this.parentScene.p1;
            this.target.target = this;
            this.StartFlow();
            this.target.StartFlow();
        }
    }
    StartFlow() {
        let counter = 5;
        this.timer0 = this.regTimerDefault(200, () => {
            this.parentScene.flowItems.push(this.parentScene.addGo(new GO({
                position: this.parentScene.sceneCenter.clone(), 
                target: this.target.position,
                start: this.position,
                size: this.parentScene.viewport.clone(),
                init() {
                    let pp = PP.createNonDrawingInstance();
    
                    let direction = this.start.direction(this.target);
                    let distance = this.start.distance(this.target);
                    let mid = this.start.add(direction.mul(distance/2)).add(direction.rotate(getRandomBool() ? 90 : -90).mul(getRandomInt(10,30)))
    
                    let uniquePoints = pp.curveByCornerPoints([this.start, mid, this.target], 5)
                    let currentIndex = 0;
    
                    this.timer1 = this.regTimerDefault(10, () => {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < 4; i++) {
                                let _index = currentIndex-i;
                                if(_index > 0) {
                                    hlp.setFillColor('rgba(255,255,255,'+ 1/(i+1) +')').dot(uniquePoints[_index]);
                                }
                            }
    
                            currentIndex++;
                            if(currentIndex == uniquePoints.length) {
                                currentIndex =0;
                            }
                        })
                    })
                }
            })));

            counter--;

            if(counter == 0) {
                this.unregTimer(this.timer0);
            }
        })

    }
}

Article1Point.imageFrames = (function() {
    let frames = [];
    let totalFrames = 20;
    let size = new V2(1,1)

    let aValues = [
        ...easing.fast({from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
        ...easing.fast({from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
    ]

    return aValues.map(a =>createCanvas(size, (ctx, size, hlp) => {
        hlp.setFillColor('rgba(255,255,255,' + a + ')').dot(0,0);
    }))
})()