class Demo10EndScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault(this.bgColor);
    }

    createTrailFrames({framesCount, fadeOutFramesCount, from, direction, wClapms = [], xShiftClapms = [], pointerBgSize = 10, 
        pointerColor = '#C2A181', trailColor ='#545863' }) {
        let pointerMid1 = colors.getMidColor({color1: pointerColor, color2: trailColor});
        let pointerMid2 = colors.getMidColor({color1: pointerMid1, color2: trailColor});

        let upperLine = { begin: new V2(0,0), end: new V2(this.viewport.x, 0) };
        let points = [];

        //let pbgCChange = colors.createEasingChange({hsv: { from: {h:29,s:33,v:76}, to: {h:228,s:7,v:25} }, type: 'quad', method: 'out', time: fast.r(pointerBgSize/2)});
        let pbgAChange = easing.createProps(fast.r(pointerBgSize/2), 1, 0, 'quad', 'out')
        let pointerbgImg = createCanvas(new V2(pointerBgSize, pointerBgSize), (ctx, size, hlp) => {
            let center = size.divide(2);
            let maxd = fast.r(pointerBgSize/2);

            for(let y = 0; y < size.y; y++){
                for(let x = 0; x < size.x; x++){
                    var p = new V2(x, y);
                    let d = center.distance(p);
                    if(d > maxd)
                        d = maxd;

                    pbgAChange.time = d;
                    let a = fast.r(easing.process(pbgAChange),2);
                    // pbgCChange.processer(d);
                    // let c = pbgCChange.getCurrent('hsv');

                    ctx.globalAlpha = a;
                    hlp.setFillColor(pointerColor).dot(x,y);
                    ctx.globalAlpha = 1
                }
            }
        })

        let trailColorHsv = colors.hexToHsv(trailColor);
        let bgColorHsv = colors.hexToHsv(this.bgColor);
        console.log(trailColorHsv);
        let cChange = //colors.createEasingChange({hsv: { from: {h:224,s:15,v:38}, to: {h:228,s:7,v:25} }, type: 'quad', method: 'out', time: fadeOutFramesCount});
        colors.createEasingChange({hsv: { from: {h: fast.r(trailColorHsv.h*360) ,s:fast.r(trailColorHsv.s*100),v:fast.r(trailColorHsv.v*100)}, 
                                            to: {h:fast.r(bgColorHsv.h*360),s:fast.r(bgColorHsv.s*100),v:fast.r(bgColorHsv.v*100)} }, type: 'quad', method: 'out', time: fadeOutFramesCount});

        createCanvas(new V2(), (ctx, size, hlp) => {
            let pp = new PerfectPixel({ctx});
            points = distinct(pp.lineV2(from, raySegmentIntersectionVector2(from, direction, upperLine).toInt()), (p) => p.y)
            
            points = points.map(p => ({
                p,
                alive: true,
                visible: false,
                fadeOutFrameIndex: 0,
                rdark: getRandomInt(0,1) == 0
             }));

            
        })

        let result = [];
        let indexChange = easing.createProps(framesCount-1, 0, points.length-1, 'quad', 'in');
        if(!this.elipsises)
            this.elipsises = [];

        let currentIndex
        for(let i = 0; i < framesCount+fadeOutFramesCount;i++){
            if(i < framesCount){
                indexChange.time = i;
                currentIndex = fast.r(easing.process(indexChange));

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
                let maxVisiblePoint = undefined;
                for(let j = 0; j < points.length; j++){
                    let point = points[j];
                    
                    if(point.visible){
                        if(i < framesCount && j == currentIndex-1){
                            //hlp.setFillColor('red').rect(point.p.x-5, point.p.y-5, 10,10)
                            ctx.drawImage(pointerbgImg, point.p.x-fast.r(pointerBgSize/2), point.p.y-fast.r(pointerBgSize/2))
                        }

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

                        if(point.rdark){
                            hlp.setFillColor(mid1).dot(fast.r(point.p.x + point.xShift)+w-1, point.p.y);
                        }
                    }
                }

                if(i < framesCount) {//} && maxVisiblePoint){
                    if(currentIndex){
                        let p = points[currentIndex-1]
                        if( p &&  p.visible)
                            hlp.setFillColor(pointerColor).dot(fast.r(p.p.x + p.xShift), p.p.y)

                        for(let pi = 2; pi < 4; pi++){
                            let p1 = points[currentIndex-pi]
                            if( p1 &&  p1.visible)
                                hlp.setFillColor(pointerMid1).dot(fast.r(p1.p.x + p1.xShift), p1.p.y)
                        }
                        
                        for(let pi = 4; pi < 7; pi++){
                            let p1 = points[currentIndex-pi]
                            if( p1 &&  p1.visible)
                                hlp.setFillColor(pointerMid2).dot(fast.r(p1.p.x + p1.xShift), p1.p.y)
                        }
                    }
                }
            })
        }

        return result;

    }
    start(){
        this.bgColor = '#3A3B40';

        this.frames1 = this.createTrailFrames({framesCount: 500, fadeOutFramesCount: 400, from: this.sceneCenter.clone(), direction: V2.up.rotate(-15),
            wClapms: [20,22], xShiftClapms: [10,11]})

        this.frames2 = this.createTrailFrames({framesCount: 1000, fadeOutFramesCount: 800, from: this.sceneCenter.clone(), direction: V2.up.rotate(-10),
            wClapms: [14,16], xShiftClapms: [6,8], pointerBgSize: 8, pointerColor: '#AA8D72', trailColor: '#474A54' })

        let p1 = [{p: new V2(25, this.sceneCenter.y), f: 0}, //{p: new V2(70, this.sceneCenter.y), f: 600}, 
            {p: new V2(140, this.sceneCenter.y), f: 600}, {p: new V2(183, this.sceneCenter.y), f: 300}]
        
        let p0 = [{p: new V2(171, this.sceneCenter.y), f: 0},
             {p: new V2(80, this.sceneCenter.y), f: 800},
             {p: new V2(60, this.sceneCenter.y), f: 1200},
            {p: new V2(104, this.sceneCenter.y), f: 400}]

        this.farLayer = p0.map(p => this.addGo(new GO({
            position: p.p,
            size: this.viewport.clone(),
            frames: this.frames2,
            initFrame: p.f,
            showRedFrame: p.f == 0,
            init() {
                this.currentFrame = this.initFrame;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        if(this.showRedFrame && !this.parentScene.redFrame){
                            this.parentScene.redFrame = this.parentScene.addGo(new GO({
                                size: this.parentScene.viewport,
                                position: this.parentScene.sceneCenter.clone(),
                                img: createCanvas(this.parentScene.viewport, (ctx, size, hlp) => {
                                    hlp.setFillColor('red').strokeRect(0,0, size.x, size.y);
                                })
                            }))
                        }
                    }
                })
            }

        }), 0))


        this.closeLayer = p1.map(p => this.addGo(new GO({
            position: p.p,
            size: this.viewport.clone(),
            frames: this.frames1,
            initFrame: p.f,
            init() {
                this.currentFrame = this.initFrame;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }

        }), 1))

        this.clouds2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.cloudsImg = PP.createImage(Demo10EndScene.models.clouds3)   

                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: this.cloudsImg,
                    originX: 0,
                }))

                this.c2 = this.addChild(new GO({
                    position: new V2(-this.size.x, 0),
                    size: this.size,
                    img: this.cloudsImg,
                    originX: -this.size.x,
                }))

                this.xChange = //easing.createProps(200, 0, size.x, 'linear', 'base')
                this.currentX = 0;
                this.timer = this.regTimerDefault(15, () => {
                    if(!this.xChange){
                        this.xChange = easing.createProps(900, 0, this.size.x, 'linear', 'base');
                    }

                    easing.commonProcess({context: this, targetpropertyName: 'currentX', propsName: 'xChange', round: true, removePropsOnComplete: true})

                    this.c1.position.x = this.c1.originX+this.currentX;
                    this.c2.position.x = this.c2.originX+this.currentX;

                    this.c1.needRecalcRenderProperties = true;
                    this.c2.needRecalcRenderProperties = true;
                })
            }
        }), 2)

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.cloudsImg = PP.createImage(Demo10EndScene.models.clouds)   

                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: this.cloudsImg,
                    originX: 0,
                }))

                this.c2 = this.addChild(new GO({
                    position: new V2(this.size.x, 0),
                    size: this.size,
                    img: this.cloudsImg,
                    originX: this.size.x,
                }))

                this.xChange = //easing.createProps(200, 0, size.x, 'linear', 'base')
                this.currentX = 0;
                this.timer = this.regTimerDefault(15, () => {
                    if(!this.xChange){
                        this.xChange = easing.createProps(900, 0, -this.size.x, 'linear', 'base');
                    }

                    easing.commonProcess({context: this, targetpropertyName: 'currentX', propsName: 'xChange', round: true, removePropsOnComplete: true})

                    this.c1.position.x = this.c1.originX+this.currentX;
                    this.c2.position.x = this.c2.originX+this.currentX;

                    this.c1.needRecalcRenderProperties = true;
                    this.c2.needRecalcRenderProperties = true;
                })
            }
        }), 3)

        

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10EndScene.models.bg)   
            }
        }), 4)

        this.soldier = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(Demo10EndScene.models.soldier)   
            }
        }), 5)
    }
}