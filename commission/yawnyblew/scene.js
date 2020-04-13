// добавить силуэт - done
// добавить переходы у овалов done
// замедлить дождь - done
// ещё несколько неоновых вывесок. done
// тени от капель - done

class YawnyblewWindowScene extends Scene {
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
        //this.backgroundRenderImage(this.bgImage);
        this.backgroundRenderDefault();
    }

    start(){

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(YawnyblewWindowScene.models.bg)
            }
        }), 1);

        this.bottomFrames = [];

        this.window = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(230,230),
            bottomFrames: this.bottomFrames,
            init() {
                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     hlp.setFillColor('#999').rect(0,0, size.x, size.y);
                // })

                this.rain = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    rainFramesGenerator({framesCount, itemsCount, color, size, heightClamp, yShiftClamps, yClamps = []}) {
                        let frames = [];
                        if(typeof(color) == 'string')
                            color = colors.rgbStringToObject({value: color, asObject: true});
                
                        let aChanges = [];
                        for(let i = heightClamp[0]; i <= heightClamp[1]; i++){
                            aChanges[i] = easing.fast({from: 0, to: color.opacity, steps: i, type: 'quad', method: 'inOut'}).map(value => fast.r(value, 3));
                        }
                
                
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let x = getRandomInt(0, size.x)
                        
                            return {
                                x,
                                height: getRandomInt(heightClamp[0], heightClamp[1]),
                                yChangeValues: easing.fast({
                                    from: yClamps[0] + getRandomInt(yShiftClamps[0], yShiftClamps[1]), 
                                    to: yClamps[1]+getRandomInt(yShiftClamps[0], yShiftClamps[1]), 
                                    steps: framesCount, type:'linear', method: 'base'})
                                        .map(value => fast.r(value)),
                                initialIndex: getRandomInt(0, framesCount-1)
                            }
                        })
                
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsCount; p++){
                                    let pointData = itemsData[p];
                
                                    let currentIndex = pointData.initialIndex + f;
                                    if(currentIndex > (framesCount-1)){
                                        currentIndex-=framesCount;
                                    }
                
                                    let y = pointData.yChangeValues[currentIndex];
                                    let height = pointData.height;//heightChangeValues[currentIndex];
                
                                    if(height == 1){
                                        let additionalA = 0;
                                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity + additionalA], isObject: false}))
                                            .dot(pointData.x,y)
                                    }
                                    else {
                                        let aValues = aChanges[height];
                                        for(let i = 0; i < height; i++){
                                            let a = aValues[i];
                
                                            let additionalA1 = 0;
                                            let additionalA2 = 0;
                                            
                
                                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA1], isObject: false}))
                                            .dot(pointData.x,y+i);
                
                                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a + additionalA2], isObject: false}))
                                            .dot(pointData.x,y +height*2 - i - 1)
                                        }
                                    }
                                }
                            })
                        }
                
                        return frames;
                    },
                    init() {
                        let rainLayers = [
                           {framesCount: 100, itemsCount: 400, color: 'rgba(76,76,76,0.25)', heightClamp: [2,3], yShiftClamps: [-25,25], yClamps: [-this.size.y*0.5, this.size.y*1]},
                           {framesCount: 80, itemsCount: 200, color: 'rgba(102,102,102,0.5)', heightClamp: [3,5], yShiftClamps: [-35,35], yClamps: [-this.size.y*0.5, this.size.y*1]},
                           {framesCount: 50, itemsCount: 100, color: 'rgba(153,153,153,0.5)', heightClamp: [5,8], yShiftClamps: [-45,45], yClamps: [-this.size.y*0.5, this.size.y*1]},
                           {framesCount: 25, itemsCount: 50, color: 'rgba(178,178,178,0.5)', heightClamp: [10,15], yShiftClamps: [-60,60], yClamps: [-this.size.y*0.5, this.size.y*1]},
                       ]

                       rainLayers.map(layer => this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: this.rainFramesGenerator({
                            framesCount: layer.framesCount, itemsCount: layer.itemsCount, color: layer.color,
                            heightClamp: layer.heightClamp, yShiftClamps: layer.yShiftClamps, yClamps: layer.yClamps, size: this.size
                            }),
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
                       })));                        
                    }
                }))


                this.rainDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    bottomFrames: this.bottomFrames,
                    getColor(position, coloredEllipsises, moving = false) {
                        let {x, y} = position;

                        let inside = coloredEllipsises.map((el) => {
                            return {
                                el,
                                inside: fast.r(
                                (((x-el.position.x)*(x-el.position.x)/el.rxSq) 
                                + ((y-el.position.y)*(y-el.position.y)/el.rySq))*100) <= 100 };
                        }).filter(el => el.inside);

                        if(inside.length == 0)
                            return undefined;

                        if(inside.length == 1)
                            return inside[0].el.color;

                        if(inside.length > 1){
                            if(moving){
                                return inside[0].el.color;
                            }
                            else {
                                return inside[getRandomInt(0, inside.length-1)].el.color;
                            }
                            
                        }
                        
                        
                    },
                    createRainDropsFrames({framesCount, itemsCount, size, movingCase, coloredEllipsises = [], bottomFrames}) {
                        let defaultOpacity = 0.5;
                        let frames = [];

                        //let bottomFrames = [];

                        if(!bottomFrames)
                            bottomFrames = []

                        coloredEllipsises.forEach(el => {
                            el.rxSq = el.size.x*el.size.x;
                            el.rySq = el.size.y*el.size.y;
                        });

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let color = (getRandomBool() ? getRandomInt(2,6) : getRandomInt(20,24))*10;
                            
                            color = colors.rgbStringToObject({value: `rgba(${color}, ${color}, ${color},1)`, asObject: true})

                            let start = new V2(getRandomInt(0, size.x), getRandomInt(0, size.y));
                            let pointsToBottom = new Array(2).fill(start);
                            let xShift = 0;
                            let currentXShiftsValues = new Array(framesCount).fill(xShift)
                            //let colors = new Array(framesCount).fill(color);
                            let moving = movingCase()
                            if(moving) {
                                let freeze = getRandomInt(20,40);
                                pointsToBottom = new Array(freeze).fill(start);
                                createCanvas(new V2(1,1), (ctx, _size, hlp) => {
                                    pointsToBottom.push(...new PerfectPixel({ctx}).lineV2(start, start.add(new V2(0, getRandomInt(size.y, 1.5*size.y)))).map(p => new V2(p)))
                                }) 

                                currentXShiftsValues = new Array(framesCount).fill(xShift).map((el, i) => {
                                    if(i > freeze+5){
                                        if(getRandomInt(0,6) == 0){
                                            xShift+=getRandom(-1,1);
                                        }
                                    }
                                    
    
                                    return xShift;
                                })

                                
                            }
                            else {
                                let isInsideColoredEl = this.getColor(start, coloredEllipsises);
                                if(isInsideColoredEl && getRandomInt(0,4) != 0){
                                    //colors = new Array(framesCount).fill(isInsideColoredEl)
                                    color = isInsideColoredEl;
                                }
                            }

                            let indexChangeValues = easing.fast({from: 0, to: pointsToBottom.length-1, steps: framesCount, type: 'linear', method: 'base'}).map(value => fast.r(value))


                            return {
                                // other values
                                indexChangeValues,
                                pointsToBottom,
                                color,
                                moving,
                                startShift: getRandomInt(0, framesCount-1),
                                currentXShiftsValues
                            }
                        })
                        
                        
                        for(let f = 0; f < framesCount; f++){
                            let bottomItems = [];

                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                coloredEllipsises.forEach(el => {
                                    if(el.render)
                                        hlp.setFillColor(colors.rgbToString({value: [el.color.red, el.color.green, el.color.blue, el.color.opacity], isObject: false})).elipsis(el.position, el.size)
                                });


                                for(let p = 0; p < itemsCount; p++){
                                    let pointData = itemsData[p];
                                    
                                    let currentIndex = pointData.startShift + f;
                                    if(currentIndex > (framesCount-1)){
                                        currentIndex-=framesCount;
                                    }
                                    
                                    let pointToBottomIndex = pointData.indexChangeValues[currentIndex];
                                    let currentXShift = pointData.currentXShiftsValues[currentIndex];
                                    let pointToBottom = pointData.pointsToBottom[pointToBottomIndex].add(new V2(currentXShift)).toInt();

                                    let toBottom = size.y - pointToBottom.y;
                                    if(toBottom >= 0 ){
                                        //rds.items.push(new V2(drop.p.x-54,toBottom).toInt())
                                        bottomItems[bottomItems.length] = new V2(pointToBottom.x ,toBottom);
                                    }

                                    let fillColor = pointData.color;

                                    if(pointData.moving){
                                        let isInsideColoredEl = this.getColor(pointToBottom, coloredEllipsises, true);
                                        if(isInsideColoredEl){
                                            fillColor = isInsideColoredEl
                                        }
                                    }

                                    

                                    hlp.setFillColor(colors.rgbToString({value: [fillColor.red, fillColor.green, fillColor.blue, defaultOpacity], isObject: false}))
                                        .rect(pointToBottom.x, pointToBottom.y, 2,2)

                                    hlp.setFillColor('rgba(0,0,0,0.4)').rect(pointToBottom.x, pointToBottom.y+1,2,1)
                                    hlp.setFillColor('rgba(255,255,255,0.25)').rect(pointToBottom.x, pointToBottom.y,1,1)
                                }
                            });

                            bottomFrames[f] = createCanvas(size, (ctx, size, hlp) => {
                                hlp.setFillColor('black');
                                bottomItems.forEach(bi => {
                                    hlp.rect(bi.x, bi.y,2,2)
                                });
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createRainDropsFrames({framesCount: 400, itemsCount: 2500, size: this.size, movingCase: () => { return getRandomInt(0,5) == 0 },
                        bottomFrames: this.bottomFrames,
                        coloredEllipsises: [
                            {
                                position: new V2(120, 30).toInt(),
                                size: new V2(100, 28),
                                color: colors.rgbStringToObject({value: 'rgba(93,5,247,0.25)', asObject: true})
                            },
                            {
                                position: new V2(180, 85).toInt(),
                                size: new V2(70, 30),
                                color: colors.rgbStringToObject({value: 'rgba(128,0,128,0.25)', asObject: true})
                            },
                            {
                                position: new V2(187, 140).toInt(),
                                size: new V2(80, 30),
                                color: colors.rgbStringToObject({value: 'rgba(85,138,59,0.25)', asObject: true})
                            },
                            {
                                position: new V2(62, 112).toInt(),
                                size: new V2(40, 58),
                                color: colors.rgbStringToObject({value: 'rgba(37,200,232,0.25)', asObject: true}),
                                render: false,
                            },
                            {
                                position: new V2(50, 190).toInt(),
                                size: new V2(70, 40),
                                color: colors.rgbStringToObject({value: 'rgba(222,55,50,0.25)', asObject: true}),
                                render: false,
                            }
                            
                        ]
                    });

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
/*
                                if(!this.redFrame){
                                //alert('1')
                                    this.redFrame = this.addChild(new GO({
                                        position: new V2(),
                                        size: this.size,
                                        img: createCanvas(this.size, (ctx, size, hlp) => {
                                            hlp.setFillColor('red').rect(0,0, 50,50)
                                        })
                                    }));
                                }
                                else {
                                    this.removeChild(this.redFrame);
                                    this.redFrame = undefined;
                                }
                                */
                            }
                        })
                    }
                }))
            }
        }), 3)

        this.walls = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            bottomFrames: this.bottomFrames,
            init() {
                this.circlesProps = [
                    {
                        r: fast.r(this.size.x*0.75/2),
                        color: '#1D233A'
                    },
                    {
                        r: fast.r(this.size.x*0.76/2),
                        color: '#0F111E'//'#151728'
                    },
                    {
                        r: fast.r(this.size.x*0.8/2),
                        color: 'black'
                    }
                ]

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let center = size.mul(0.5).toInt();
                    let step = 0.25;

                    let circlesProps = this.circlesProps;

                    for(let i = 0; i < circlesProps.length; i++){
                        let cProps = circlesProps[i];

                        let r = cProps.r;
                        let circleDots = [];
                        for(let i = 0; i < 360; i+=step){
                            let rad = degreeToRadians(i);
                            let x = fast.r(center.x + r * Math.cos(rad));
                            let y = fast.r(center.y + r * Math.sin(rad));

                            circleDots.push({x,y});
                        }

                        //circleDots = distinct(circleDots, (p) => (p.x + '_' + p.y));
                        cProps.rows = []
                        let rows = cProps.rows;
                        for(let i = 0; i < circleDots.length; i++){
                            let d = circleDots[i];
                            if(rows[d.y] == undefined){
                                rows[d.y] = {max: d.x, min: d.x};
                            }
                            else {
                                if(d.x < rows[d.y].min)
                                    rows[d.y].min = d.x;
                                if(d.x > rows[d.y].max)
                                    rows[d.y].max = d.x

                                
                            }
                        }

                        for(let y = 0; y < size.y;y++){
                            let r = rows[y];
                            if(r == undefined){
                                hlp.setFillColor(cProps.color).rect(0,y,size.x, 1);
                            }
                            else {
                                hlp.setFillColor(cProps.color).rect(0,y, r.min, 1);
                                hlp.setFillColor(cProps.color).rect(r.max,y, size.x, 1);

                                // if(i == 1){
                                //     if(y > 275 && y < 310){
                                //         hlp.setFillColor('rgba(216,227,97,0.05)').rect(r.max, y, 20, 1)
                                //     }
                                // }

                                if(i == 0){
                                    if(r.min != r.max){
                                        //'rgba(224,238,255,0.25)'
                                        hlp.setFillColor('rgba(56,69,63,0.25)').rect(r.min, y, r.max-r.min,1)
                                    }
                                }
                            }
                        }
                    }
                    
                    let vChange = easing.createProps(45, 30, 0, 'quad', 'out');
                    let hsv = [212,12,14];
                    for(let y = circlesProps[2].rows.length+1; y < size.y; y++){
                        let delta = y - circlesProps[2].rows.length;
                        if(delta <= 45){
                            vChange.time = delta;
                            let v =  easing.process(vChange);
                            v = fast.f(v/1)*1;
                            hsv[2] = v;
                        }
                        else {
                            hsv[2] = 0;
                        }
                        
                        let row = circlesProps[2].rows[circlesProps[2].rows.length-delta];
                        hlp.setFillColor(colors.hsvToHex(hsv)).rect(row.min, y-1, row.max - row.min, 1);
                    }

                    for(let i = 0; i < 500; i++){
                        hlp.setFillColor('rgba(0,0,0,0.1)').rect(
                        fast.r(getRandomGaussian(0, size.x)), 
                        getRandomInt(circlesProps[2].rows.length+1, size.y),  getRandomInt(10, 30), 1);   
                    }
                })

                this.rainDropsShadows = this.addChild(new GO({
                    position: new V2(0,236),
                    size:  new V2(230,230),
                    frames: this.bottomFrames,
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
                }))
            }
        }), 10)


        this.girl = this.addGo(new GO({
            position: new V2(140, 263+15),
            size: new V2(86,170),
            init() {
                let model = YawnyblewWindowScene.models.girl;
                model.main.layers.forEach(l => {
                    l.groups.forEach(group => {
                        if(l.name != 'shadow')
                        group.strokeColor = '#060A0A';
                        group.fillColor = '#060A0A';
                    });
                });

                this.img = PP.createImage(model)
            }
        }), 15)

        this.details = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(YawnyblewWindowScene.models.details)
            }
        }), 16)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createnameFrames({framesCount, angleClamps, size, length, x}) {
                let frames1 = [];
                
                //let angleClamps = [-1,1];
                let angleChange = easing.fast({from: angleClamps[0], to: angleClamps[1], steps: framesCount, type: 'sin', method: 'inOut' })
                let angleChangeBack = easing.fast({from: angleClamps[1], to: angleClamps[0], steps: framesCount, type: 'quad', method: 'inOut' })
                let from = new V2(x, 0);
                let defaultDirection = V2.down;

                for(let f = 0; f < framesCount; f++){
                    frames1[f] = createCanvas(size, (ctx, size, hlp) => {
                        let angle = angleChange[f];
                        let to = from.add(defaultDirection.rotate(angle).mul(length));
                        hlp.setFillColor('black');
                        new PP({ctx}).lineV2(from, to);
                    });
                }

                let frames = [];

                frames.push(...(new Array(2).fill(frames1[0])),...frames1,...(new Array(2).fill(frames1[frames1.length-1])), ...frames1.reverse() );
                
                return frames;
            },
            init() {
                let frameSets = [
                    this.createnameFrames({framesCount: 50, size: this.size, angleClamps: [-1,1], length: 250, x: 70}),
                    this.createnameFrames({framesCount: 50, size: this.size, angleClamps: [-0.5,0.5], length: 200, x: 55}),
                    this.createnameFrames({framesCount: 50, size: this.size, angleClamps: [-0.25,0.25], length: 210, x: 50}),
                    this.createnameFrames({framesCount: 50, size: this.size, angleClamps: [-0.4,0.4], length: 230, x: 80})
                ]
                
                frameSets.map(frames => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        this.currentFrame = getRandomInt(0, this.frames.length-1);
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })))


                
            }
        }), 17)
    }
}