class Demo10Exp1Scene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        let scene = this;
        let layersCount = 10;
        

        let layers = [];

        let size = this.viewport.clone();
        let xChangeTimeOrigin = 50;
        let framesPerLayer = xChangeTimeOrigin*2;

        if(false){

            let dotsPerLayerClamps = [300, 100];
        let xChangeClamps = [1, 5];
        
        

        let dotsPerLayerChange = easing.createProps(layersCount-1, dotsPerLayerClamps[0], dotsPerLayerClamps[1], 'quad', 'in');
        let xChange = easing.createProps(layersCount-1, xChangeClamps[0], xChangeClamps[1], 'quad', 'in');
        let cChange = colors.createEasingChange({ hsv: { from: { h: 49, s: 90, v: 10 }, to: {h: 49, s: 40, v:100} }, type: 'quad', method: 'in', time: layersCount-1 });
        

            for(let i = 0; i < layersCount; i++){

                let frames = []
                let img = undefined;
    
                dotsPerLayerChange.time = i;
                xChange.time = i;
                let dotsPerLayer = fast.r(easing.process(dotsPerLayerChange));
                let maxXChange = fast.r(easing.process(xChange))
                cChange.processer(i)
                let color = cChange.getCurrent('hsv');
    
                let layerDots = [];
                for(let di = 0; di < dotsPerLayer; di++){
                    layerDots[di] = {
                        p: new V2(getRandomInt(0, size.x,), getRandomInt(0, size.y)),
                        initialFrame: getRandomInt(0, framesPerLayer-1)
                    }
                }
    
                let xChangePerFrameOrigin = [];
                let xChangeValueChange = easing.createProps(xChangeTimeOrigin-1, 0, maxXChange, 'quad', 'inOut');
                for(let f = 0; f < xChangeTimeOrigin; f++){
                    xChangeValueChange.time = f;
                    xChangePerFrameOrigin[f] = fast.r(easing.process(xChangeValueChange));
                }
    
                let xChangePerFrame = [...xChangePerFrameOrigin, ...xChangePerFrameOrigin.reverse()];
    
                if(maxXChange > 0){
                    for(let f = 0; f < framesPerLayer-1; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            hlp.setFillColor(color);
                            for(let di = 0; di < layerDots.length; di++){
                                let dot = layerDots[di];
                                let currentXChangeIndex = dot.initialFrame + f;
                                if(currentXChangeIndex > (framesPerLayer-1)){
                                    currentXChangeIndex-=framesPerLayer;
                                }
        
                                let xChange = xChangePerFrame[currentXChangeIndex];
                                hlp.dot(dot.p.x, dot.p.y+xChange);
                            }
                        })
                        
                    }
                }
                else {
                    img = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor(color);
                        for(let di = 0; di < layerDots.length; di++){
                            let dot = layerDots[di];
                            hlp.dot(dot.p.x, dot.p.y);
                        }
                    })
                }
    
                layers[i] = {
                    layerDots,
                    img,
                    frames,
                };
    
                this.layersGo = [];
                //console.log({i, dotsPerLayer, maxXChange, framesLen: frames.length})
            }

            for(let l = 0; l < layers.length; l++){
                
                this.layersGo[l] = this.addGo(new GO({
                    ...layers[l],
                    position: this.sceneCenter.clone(),
                    size,
                    //isVisible: false,
                    init() {
                        if(this.frames.length){
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
                    }
                }), l);
            }
        }
        
        // this.bg2 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         let mainHsv = [200, 0, 100];
        //         let rotationOriginShift =new V2(0, 50);
        //         let circlesPoints = new Array(fast.r(this.size.x/2)).fill().map((el, i) => {
        //             let points = [];
        //             if(i < 10)
        //                 return undefined;
        //             createCanvas(this.size, (ctx, size, hlp) => {
        //                 hlp.strokeEllipsis(0,360,0.1, new V2(size.x/2, size.y/2), i, i, points);
        //             });

        //             return distinct(points, (p) => p.x + '_' + p.y);
        //         }).filter(el => el != undefined);

        //         let dotsCount = 100;
        //         let dots = new Array(dotsCount).fill(undefined).map((_, i) => {
        //             let v = getRandomInt(10, 40);
        //             return {
        //                 circlesPointsIndex: getRandomInt(0, circlesPoints.length-1),
        //                 //p: new V2(getRandomInt( this.size.x/2, this.size.x+100), getRandomInt(-100, this.size.y/2)),
        //                 //hsv: [mainHsv[0], mainHsv[1], getRandomInt(10, 40)],
        //                 color: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v], hsvAsObject: false, hsvAsInt: true}),
        //                 secondaryColor: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-3], hsvAsObject: false, hsvAsInt: true}),
        //                 secondaryColor1: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-6], hsvAsObject: false, hsvAsInt: true})
        //             }
        //         });


        // }}), 0)


        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //return;

                let mainHsv = [200, 0, 100];
                let rotationOriginShift =new V2(0, 50);
                let framesCount = framesPerLayer*6//*5;//80;
                let halfSize = new V2(this.size.x/2, this.size.y/2)

                let repeats = 4;//fast.r(360/(framesCount*rotationSpeed))
                let aChangePerRepeat = 90;
                let rotationSpeed = aChangePerRepeat/framesCount;///0.05;

                let dotsCount = 700;
                let dots = new Array(dotsCount).fill(undefined).map((_, i) => {
                    let v = getRandomInt(10, 40);
                    return {
                        p: new V2(getRandomInt( this.size.x/2, this.size.x+100), getRandomInt(-100, this.size.y/2)),
                        //hsv: [mainHsv[0], mainHsv[1], getRandomInt(10, 40)],
                        color: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v], hsvAsObject: false, hsvAsInt: true}),
                        secondaryColor: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-3], hsvAsObject: false, hsvAsInt: true}),
                        secondaryColor1: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-6], hsvAsObject: false, hsvAsInt: true})
                    }
                });

                this.frames = [];

                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        // let hsv = [...mainHsv];
                        // hsv[2] = getRandomInt(10, 90);

                        //hlp.setFillColor(hsvToHex({hsv: hsv, hsvAsObject: false, hsvAsInt: true}));
                        //hlp.setFillColor('white');

                        for(let r = 0; r < repeats; r++){
                            for(let i = 0; i < dots.length; i++){
                                let dot = dots[i];
                                //hlp.setFillColor(hsvToHex({hsv: dot.hsv, hsvAsObject: false, hsvAsInt: true}));
                                hlp.setFillColor(dot.color);
                                let originalPosition = dot.p;

                                let repeated = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*f, false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt()

                                hlp.dot(repeated.x, repeated.y);


                                let repeated1 = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*(f-2), false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt();
                                    hlp.setFillColor(dot.secondaryColor).dot(repeated1.x, repeated1.y);

                                let repeated2 = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*(f-4), false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt();
                                    hlp.setFillColor(dot.secondaryColor1).dot(repeated2.x, repeated2.y);

                            }
                        }
                        
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        if(!this.redFrame){
                            this.redFrame = this.addChild(new GO({
                                position: new V2(),
                                size: this.size,
                                img: createCanvas(this.size, (ctx, size, hlp) => {
                                    hlp.setFillColor('red').strokeRect(0,0, size.x, size.x)
                                })
                            }));
                        }
                        else {
                            this.removeChild(this.redFrame);
                            this.redFrame = undefined;
                        }
                    }
                })
            }
        }), 0)

        


        this.layered = [];
        let layeredDataModel = Demo10Exp1Scene.models.layered();
        layeredDataModel.main.layers.forEach(l => l.visible = true);

        for(let l = 2; l<10; l++){
            this.layered[l] = this.addGo(new GO({
                position: this.sceneCenter,
                size,
                //isVisible: false,
                img: PP.createImage(layeredDataModel, {renderOnly: ['l'+l]}),
                init() {
                    if(l == 9 || l==8){
                        this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            init() {
                                this.frames = [];
                                //let shineTime = 25; 
                                let dots = [
new V2(21,55),new V2(20,40),new V2(15,33),new V2(11,29),new V2(7,46),new V2(10,77),new V2(7,90),new V2(4,90),new V2(6,83),new V2(12,105),new V2(14,103),new V2(4,122),new V2(21,123),new V2(27,123),new V2(27,126),new V2(26,131),new V2(19,149),new V2(26,144),new V2(26,148),new V2(16,164),new V2(30,161),new V2(3,165),new V2(33,173),new V2(35,166),new V2(34,189),new V2(36,186),new V2(35,184),new V2(46,184),new V2(48,188),new V2(45,192),new V2(56,188),new V2(72,185),new V2(112,195),new V2(139,187),new V2(153,190),new V2(169,190),new V2(176,190),new V2(184,185),new V2(193,188),new V2(172,167),new V2(179,160),new V2(185,149),new V2(187,145),new V2(194,154),new V2(190,167),new V2(25,139),new V2(7,38),new V2(5,42),new V2(13,29),new V2(15,105),new V2(20,126),new V2(30,164),new V2(184,193),new V2(177,169)];
                                if(l == 8){
                                    dots = [
                                       new V2(26, 74),new V2( 27, 71),new V2( 28, 56),new V2( 35, 56),new V2( 32, 46),new V2( 38, 66),new V2( 46, 68),new V2( 46, 75),new V2( 45, 82),new V2( 25, 91),new V2( 28, 89),new V2( 35, 110),new V2( 38, 119),new V2( 35, 128),new V2( 40, 129),new V2( 38, 134),new V2( 43, 148),new V2( 46, 154),new V2( 48, 172),new V2( 142, 174),new V2( 154, 163),new V2( 159, 161),new V2( 166, 152),new V2( 177, 146),new V2( 184, 135),new V2( 191, 135),new V2( 157, 179),                                    ];
                                }
                                let color = '';
                                switch(l){
                                    case 9:case 8: color = '#313244'; break;
                                    default:
                                        break;
                                }

                                dots = dots.map(p => {
                                    let shineFrom = getRandomInt(0, framesPerLayer-1);
                                    let shineTo = shineFrom + getRandomInt(10,40);
                                    if(shineTo > (framesPerLayer-1))
                                        shineTo-= framesPerLayer;

                                    return {
                                        p, 
                                        shineFrom, 
                                        shineTo
                                    };
                                })

                                for(let f = 0; f < framesPerLayer; f++){
                                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                        for(let i = 0; i < dots.length; i++){
                                            let dot = dots[i];
                                            
                                            if((dot.shineFrom < dot.shineTo &&  f >= dot.shineFrom && f <= dot.shineTo) ||
                                            (dot.shineFrom > dot.shineTo &&  (f >= dot.shineFrom || f <= dot.shineTo))
                                            ){
                                                hlp.setFillColor(color).dot(dot.p.x, dot.p.y);
                                            }
                                        }
                                    })
                                    
                                }

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
                        }))
                    }
                    
                }
            }), l)
        }

        let flowsParams = [
            { l: 5, hClamps: [-2,2],xClamps: [-10, 10], h: 120, itemsCount: 100, framesCount: framesPerLayer*6, hsv1: [21,78,23], reverse: true, },
            { l: 4, hClamps: [-2,2],xClamps: [-10, 10], h: 100, itemsCount: 100, framesCount: framesPerLayer*6, hsv1: [21,78,23], reverse: false, },
            { l: 7, hClamps: [-3,3],xClamps: [-30, 30], h: 155, itemsCount: 100, framesCount: framesPerLayer*3, hsv1: [21,78,43], reverse: true, },
            { l: 8, hClamps: [-5,5],xClamps: [-40, 40], h: 140, itemsCount: 150, framesCount: framesPerLayer*3, hsv1: [21,78,49], reverse: false, }
        ]


        this.flows = [];

        for(let i = 0; i < flowsParams.length; i++){

            let params = flowsParams[i];

            this.flows[i] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                hsv1: params.hsv1,
                framesCount: params.framesCount,
                itemsCount: params.itemsCount,
                h: params.h,
                hClamps: params.hClamps,
                xClamps: params.xClamps,
                init() {
                    let dots = new Array(this.itemsCount).fill().map((el, i) => {
                        let framesCount = this.framesCount;
                        let size = this.size;
                        let xValues = (function(leftX, rightX) { 
                            let xChange = easing.createProps(framesCount-1,leftX,size.x+rightX, 'linear', 'base');
                            if(params.reverse){
                                xChange = easing.createProps(framesCount-1,size.x+rightX,leftX, 'linear', 'base');
                            }
                            let xValues = [];
                            for(let f = 0; f < framesCount; f++){
                                xChange.time = f;
                                xValues[f] = fast.r(easing.process(xChange));
                            }
    
                            return xValues;
    
                        })(getRandomInt(this.xClamps[0], 0), getRandomInt(0,this.xClamps[1]))
    
                        let hsv = [this.hsv1[0]+getRandomInt(-5,5), this.hsv1[1]+getRandomInt(-5,5), this.hsv1[2]];
                        return {
                            hShift: getRandomInt(this.hClamps[0], this.hClamps[1]),
                            initialIndex: getRandomInt(0, xValues.length-1),
                            xValues,
                            c1: hsvToHex({hsv, hsvAsObject: false, hsvAsInt: true}),
                            c2: hsvToHex({hsv: [hsv[0], hsv[1], hsv[2]-20], hsvAsObject: false, hsvAsInt: true})
                        }
                    })
                    this.frames = [];

                    
                    for(let f = 0; f < this.framesCount; f++){
                        this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < this.itemsCount; i++){
                                let dot = dots[i];
                                let currentIndex = dot.initialIndex+f;
    
                                if(currentIndex > (dot.xValues.length-1)){
                                    currentIndex-=dot.xValues.length;
                                }
    
                                let currentX = dot.xValues[currentIndex];
                                hlp.setFillColor(dot.c1).dot(currentX, this.h+dot.hShift);
                                hlp.setFillColor(dot.c2).dot(currentX+1, this.h+dot.hShift);
                            }
                        })
                    }
    
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
            }), params.l)
        }
        

    }
}