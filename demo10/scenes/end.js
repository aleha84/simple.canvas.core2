class Demo10EndScene extends Scene {
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
        this.backgroundRenderDefault('#3B3C40');
    }

    createTrailFrames({framesCount, fadeOutFramesCount, from, direction}) {
        let trailColor = '#545863';
        let upperLine = { begin: new V2(0,0), end: new V2(this.viewport.x, 0) };
        let points = [];
        createCanvas(new V2(), (ctx, size, hlp) => {
            let pp = new PerfectPixel({ctx});
            points = distinct(pp.lineV2(from, raySegmentIntersectionVector2(from, direction, upperLine).toInt()), (p) => p.y)
            
            points = points.map(p => ({
                p,
                alive: true,
                visible: false,
             }));

            
        })

        let result = [];
        let indexChange = easing.createProps(framesCount-1, 0, points.length-1, 'quad', 'in');
        for(let i = 0; i < framesCount+fadeOutFramesCount;i++){
            if(i < framesCount){
                indexChange.time = i;
                let currentIndex = fast.r(easing.process(indexChange));

                for(let j = 0; j < currentIndex; j++){

                    let point = points[j];
                    if(point == undefined)
                        debugger;

                    if(!point.visible){
                        point.visible = true;
                        point.aChange = easing.createProps(fadeOutFramesCount-1, 1, 0, 'quad', 'out');
                        point.xShift = 0;
                        point.xShiftChange = getRandom(0.1,0.125)/8

                        
                        point.width = 1;
                        point.widthChange =// getRandom(0.1,0.125)
                            easing.createProps(fadeOutFramesCount-1, 1, getRandomInt(30,32), 'quad', 'in')

                        point.a = 1;
                    }
                }
            }

            result[result.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let j = 0; j < points.length; j++){
                    let point = points[j];
                    
                    if(point.visible){
                        easing.commonProcess({context: point, targetpropertyName: 'a', propsName: 'aChange', setter: (value) => point.a = fast.r(value,2), removePropsOnComplete: true })
                        easing.commonProcess({context: point, targetpropertyName: 'width', propsName: 'widthChange', removePropsOnComplete: true })
                        point.xShift+=point.xShiftChange;
                        //point.width+=point.widthChange;

                        ctx.globalAlpha = point.a;
                        hlp.setFillColor(trailColor);
                        hlp.rect(fast.r(point.p.x + point.xShift), point.p.y, fast.r(point.width),1);
                        ctx.globalAlpha = 1;
                    }
                }
            })
        }

        return result;

    }
    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createTrailFrames({framesCount: 500, fadeOutFramesCount: 400, from: this.sceneCenter.clone(), direction: V2.up.rotate(-15)}),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }

        }), 1)
    }
}