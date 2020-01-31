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
        this.backgroundRenderDefault(this.bgColor);
    }

    createTrailFrames({framesCount, fadeOutFramesCount, from, direction, wClapms = [], xShiftClapms = []}) {
        let trailColor = '#545863';
        let pointerColor = '#EAE89F';
        let upperLine = { begin: new V2(0,0), end: new V2(this.viewport.x, 0) };
        let points = [];

        let cChange = colors.createEasingChange({hsv: { from: {h:224,s:15,v:38}, to: {h:228,s:7,v:25} }, type: 'quad', method: 'out', time: fadeOutFramesCount});

        createCanvas(new V2(), (ctx, size, hlp) => {
            let pp = new PerfectPixel({ctx});
            points = distinct(pp.lineV2(from, raySegmentIntersectionVector2(from, direction, upperLine).toInt()), (p) => p.y)
            
            points = points.map(p => ({
                p,
                alive: true,
                visible: false,
                fadeOutFrameIndex: 0
             }));

            
        })

        let result = [];
        let indexChange = easing.createProps(framesCount-1, 0, points.length-1, 'quad', 'in');
        if(!this.elipsises)
            this.elipsises = [];

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
                        point.xShiftChange = easing.createProps(fadeOutFramesCount-1, 0, getRandomInt(xShiftClapms[0],xShiftClapms[1]), 'quad', 'in')
                        //getRandom(0.1,0.125)/8
                        //getRandom(0.01,0.04)//
                        
                        
                        point.width = 1;
                        point.widthChange =// getRandom(0.1,0.125)
                            easing.createProps(fadeOutFramesCount-1, 1, getRandomInt(wClapms[0],wClapms[1]), 'quad', 'in')

                        point.a = 1;
                    }
                }
            }


            result[result.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                let maxVisiblePoint = undefined
                for(let j = 0; j < points.length; j++){
                    let point = points[j];
                    
                    if(point.visible){
                        maxVisiblePoint = point
                        //easing.commonProcess({context: point, targetpropertyName: 'a', propsName: 'aChange', setter: (value) => point.a = fast.r(value,2), removePropsOnComplete: true })
                        easing.commonProcess({context: point, targetpropertyName: 'width', propsName: 'widthChange', removePropsOnComplete: true })
                        easing.commonProcess({context: point, targetpropertyName: 'xShift', propsName: 'xShiftChange', removePropsOnComplete: true })
                        //point.xShift+=point.xShiftChange;
                        if(point.fadeOutFrameIndex < fadeOutFramesCount){
                            cChange.processer(point.fadeOutFrameIndex++);
                            point.color = cChange.getCurrent('hsv');
                        }
                        
                        hlp.setFillColor(point.color);
                        let w = fast.r(point.width);
                        hlp.rect(fast.r(point.p.x + point.xShift), point.p.y, w,1);

                        let mid1 = colors.getMidColor({color1: point.color, color2: this.bgColor});
                        hlp.setFillColor(mid1).dot(fast.r(point.p.x + point.xShift), point.p.y);
                        if(w > 1){
                            hlp.setFillColor(colors.getMidColor({color1: point.color, color2: mid1})).dot(fast.r(point.p.x + point.xShift)+1, point.p.y);
                        }
                    }
                }

                if(i < framesCount && maxVisiblePoint)
                    hlp.setFillColor(pointerColor).dot(fast.r(maxVisiblePoint.p.x + maxVisiblePoint.xShift), maxVisiblePoint.p.y)
            })
        }

        return result;

    }
    start(){
        this.bgColor = '#3B3C40';
        this.frames1 = this.createTrailFrames({framesCount: 500, fadeOutFramesCount: 400, from: this.sceneCenter.clone(), direction: V2.up.rotate(-15),
            wClapms: [20,22], xShiftClapms: [10,11]})

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.frames1,
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

        this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-50, 0)),
            size: this.viewport.clone(),
            frames: this.frames1,
            init() {
                this.currentFrame = 300;
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

        this.addGo(new GO({
            position: this.sceneCenter.add(new V2(50, 0)),
            size: this.viewport.clone(),
            frames: this.frames1,
            init() {
                this.currentFrame = 600;
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