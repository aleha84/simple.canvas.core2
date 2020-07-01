class Demo10DriveScene extends Scene {
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

    createSwipeFrames({framesCount, swipeFramesLength, swipers, itemsCount, size}) {

        //itemsCount = 0;

        //center, r1, r2, angleClamps = []

        let p1 = new V2();
        let p2 = new V2(-1,-3);
        let movementDots = [];

        let initLinePoints = [];
        let sharedPP = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx})
            initLinePoints = sharedPP.lineV2(new V2(38,95), new V2(1,14));
            movementDots= sharedPP.lineV2(p1, p2);
        })

        let mask = createCanvas(size, (ctx, size, hlp) => {
            hlp.setFillColor('rgba(255,255,255,0.1)').rect(0,0,size.x, 14);
            distinct(initLinePoints, p => p.x + '_' + p.y).forEach(pi => {
                for(let x = pi.x; x < size.x; x++){
                    let p = new V2(x,pi.y);
                    let canSet = true;
                    swipers.forEach(s => {
                        let distance = s.center.distance(p);
                        canSet &= x-pi.x < 6  || distance < s.r1 || distance > (s.r2+2)
                        // if(x-pi.x < 6  || distance < r1 || distance > (r2+2)){
                        
                        // }
                    })
                    
                    
                    if(canSet)
                        hlp.dot(x, pi.y);
                }
            })

        })

        let dropsDirection = new V2();//V2.up.rotate(-20);
        let dropColor = colors.rgbStringToObject({value: 'rgba(255,255,255,1)', asObject: true})

        let frames = [];
        
        let swipeOneDirectionFramesLength = fast.r(swipeFramesLength/2);
        let swipeStartFrameIndex = fast.r((framesCount/2) - swipeOneDirectionFramesLength);
        // let angleChangeValues1 = easing.fast({from: angleClamps[0], to: angleClamps[1], steps: swipeOneDirectionFramesLength, type:'linear', method:'base'});
        // let angleChangeValues2 = easing.fast({from: angleClamps[1], to: angleClamps[0], steps: swipeOneDirectionFramesLength, type:'linear', method:'base'});

        swipers.forEach((s,i) => {
            s.angleChangeValues = [...easing.fast({from: s.angleClamps[0], to: s.angleClamps[1], steps: swipeOneDirectionFramesLength, type:'linear', method:'base'}),
            ...easing.fast({from: s.angleClamps[1], to: s.angleClamps[0], steps: swipeOneDirectionFramesLength, type:'linear', method:'base'})];
        })
                                
        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let alive = true;
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = fast.r(framesCount/4 + getRandomInt(-framesCount/20, framesCount/20)) //200;
            let opacity = fast.r(getRandom(0.1,0.25),2);
            let initLinePoint = initLinePoints[getRandomInt(0, initLinePoints.length-1)];
            let y = initLinePoint.y;
            let x = getRandomInt(initLinePoint.x, size.x+20);
            let startP = new V2(x,y);

            let d1 = swipers[0].center.distance(startP);
            let d2 = swipers[1].center.distance(startP);
            if((d1 < swipers[0].r2 && d1 > swipers[0].r1) || (d2 < swipers[1].r2 && d2 > swipers[1].r1)){
                //startP = swipers[0].center.add(swipers[0].center.direction(startP).mul(swipers[0].r2 + getRandomInt(3,10))).toInt();
                if(getRandomInt(0,2) > 1) {
                    if(getRandomBool()) {
                        startP = swipers[0].center.add(V2.right.rotate(getRandomInt(-60,-110)).mul(swipers[0].r2 + getRandomInt(3,15))).toInt();
                    }
                    else {
                        startP = swipers[1].center.add(V2.right.rotate(getRandomInt(-50,-110)).mul(swipers[1].r2 + getRandomInt(3,20))).toInt();
                    }
                    
                }
                    //return undefined;
            }

            if(getRandomInt(0,10)  == 0){
                let swiper = swipers[getRandomBool() ? 0 : 1];
                startP = swiper.center.add(V2.right.rotate(swiper.angleClamps[1]-3).mul(getRandomInt(swiper.r1, swiper.r2))).toInt();
                startFrameIndex = swipeStartFrameIndex + swipeOneDirectionFramesLength + 1;
                //opacity = 1;
            }

            let movementIndexValues = easing.fast({from: 0, to: movementDots.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));
            //let dotsPositions = sharedPP.lineV2(startP, startP.add(dropsDirection.mul(90)));
            //let indexChangeValues = easing.fast({from: 0, to: dotsPositions.length-1, steps: totalFrames, type: 'quad', method: 'in'}).map(v => fast.r(v));

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                let p = startP//new V2(dotsPositions[indexChangeValues[f]]);
                let dirs = swipers.map(s => s.center.direction(p));
                frames[frameIndex] = { 
                    p,
                    rs: swipers.map(s => s.center.distance(p)),//center.distance(p),
                    dirs,
                    angles: dirs.map(dir => V2.right.angleTo(dir)),
                    moveShift: movementDots[movementIndexValues[f]]
                 };
            }

            return {
                alive,
                opacity,
                frames,
            }
        }).filter(v => v != undefined);
        
        // let testDot = {p: new V2(67,50)};
        // testDot.r = center.distance(testDot.p);
        // testDot.dir = center.direction(testDot.p);
        // testDot.angle = V2.right.angleTo(testDot.dir);

        // console.log(testDot);
        // itemsData.push({
        //     alive: true, 
        //     frames: new Array(framesCount).fill().map((el, i) => (testDot))
        // })

        let prevAngles = new Array(swipers.length).fill();
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                ctx.drawImage(mask, 0,0);
                let pp = new PP({ctx});
                if(f>= swipeStartFrameIndex && f <= swipeStartFrameIndex+swipeFramesLength){
                    swipers.forEach((s,i) => {
                        let angle = s.angleChangeValues[f-swipeStartFrameIndex];
                        if(angle == undefined){
                            angle = s.angleClamps[0];
                        }
    
                        ///hlp.setFillColor('#0A0F15');
                        let d1 = V2.right.rotate(angle);
                        let p1 = s.center.add(d1.mul(s.r1)).toInt();
                        let p2 = s.center.add(d1.mul(s.r2)).toInt();
                        let p3 = s.center.add(V2.right.rotate(angle-5).mul((s.r1+s.r2)/3)).toInt()
                        
                        pp.setFillStyle('#0A0F15');
                        pp.fillByCornerPoints([p1, p2, p3]);
                        pp.setFillStyle('#111923');
                        pp.lineV2(s.center, p3);
                        
                        if(prevAngles[i]){
                            itemsData.filter(itemData => itemData.frames[f] && isBetween(itemData.frames[f].rs[i],s.r1,s.r2) && isBetween(itemData.frames[f].angles[i], prevAngles[i], angle))
                                .forEach(itemData => {itemData.alive = false; console.log('removed')});
                        }
                        
                        prevAngles[i] = angle;
                    })
                    
                }
                else {
                    swipers.forEach((s,i) => {
                    let d1 = V2.right.rotate(s.angleClamps[0]);
                    let p1 = s.center.add(d1.mul(s.r1)).toInt();
                    let p2 = s.center.add(d1.mul(s.r2)).toInt();
                    let p3 = s.center.add(V2.right.rotate(s.angleClamps[0]-5).mul((s.r1+s.r2)/3)).toInt()
                    pp.setFillStyle('#0A0F15');
                    pp.fillByCornerPoints([p1, p2, p3]);
                    pp.setFillStyle('#111923');
                    pp.lineV2(s.center, p3);
                    })

                    prevAngles = new Array(swipers.length).fill();
                }

                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.alive && itemData.frames[f]){
                        hlp.setFillColor(colors.rgbToString({value: [dropColor.red, dropColor.green, dropColor.blue, itemData.opacity]}))
                            .dot(itemData.frames[f].p.x + itemData.frames[f].moveShift.x, itemData.frames[f].p.y + itemData.frames[f].moveShift.y)
                    }
                }

            });
        }
        
        return frames;
    }

    createBuildingsFrames({framesCount, framesPerModel, modelsData, model, size, targetPoint, makeDarkerBy}) {
        let eType = 'expo';
        let eMethod = 'in';
        let frames = new Array(framesCount);
        let direction = this.pCenter.direction(new V2(0,82));

        let sharedPP = undefined;
        let alphaMaskValues = easing.fast({from: 0.95, to: 0, steps: fast.r(framesPerModel*4/5), type: 'quad', method: eMethod}).map(v => fast.r(v, 2));
        
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx});

            
            
        })

        let framesData = [];

        for(let i = 0; i < modelsData.length; i++){
            //let movingLinePoints = [];
            let model = modelsData[i].model;
            let modelSize = new V2(model.general.size);

            model.sizeXValue = easing.fast({from: 1, to: modelSize.x, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));
            model.sizeYValue = easing.fast({from: 1, to: modelSize.y, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));

            let modelCenter = new V2(0,0);//= modelSize.divide(2).toInt();
            if(!model.frames){
                model.frames = [];
            }
            // let p2 = raySegmentIntersectionVector2(this.pCenter.add(modelCenter), direction, createLine(new V2(0, 0), new V2(0, size.y))).toInt().substract(modelSize);

             let movingLinePoints = sharedPP.lineV2(this.pCenter, targetPoint);
             let movingLineIndexValues = easing.fast({from: 0, to: movingLinePoints.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v));

            for(let f = 0; f < framesPerModel; f++){
                //let buildingFrame = undefined;
                let frameIndex = f + modelsData[i].initialFrame;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                if(!model.frames[f]){
                    
    
                    let frameModel  = {
                        general: model.general,
                        main: {
                            layers: [
                                {
                                    visible: true,
                                    order: 0,
                                    groups: []
                                }
                            ]
                        }
                    }
    
                    frameModel.general.size = new V2(model.sizeXValue[f], model.sizeYValue[f])
    
                    frameModel.main.layers[0].groups = model.main.layers[0].groups.map(originalGroup => {
                        let group = assignDeep({}, originalGroup, {points: [] } );
                        
                        let hsv = colors.hexToHsv(group.strokeColor);
                        hsv.v /= makeDarkerBy;

                        group.strokeColor = hsvToHex({hsv, hsvAsObject: true, hsvAsInt: false});
                        group.fillColor = group.strokeColor;

                        group.points = originalGroup.points.map(originalPoint => {
                            if(!originalPoint.lineDots){
                                originalPoint.lineDots = sharedPP.lineV2(modelCenter, new V2(originalPoint.point));
                                originalPoint.lineDotsIndexValues = easing.fast({from: 0, to: originalPoint.lineDots.length-1, steps: framesPerModel, type: eType, method: eMethod}).map(v => fast.r(v))
                            }
        
                            let dot = originalPoint.lineDots[originalPoint.lineDotsIndexValues[f]];
                            let point = assignDeep({}, originalPoint, { point: dot, lineDots: undefined, lineDotsIndexValues: undefined })
        
                            return point;
                        })
                        
                        return group;
                    })

                    model.frames[f] = {
                        img:  createCanvas(frameModel.general.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(frameModel), 0,0);
                            ctx.globalCompositeOperation = 'source-atop';
                            let a = alphaMaskValues[f];
                            if(a == undefined)
                                a = 0;
                            hlp.setFillColor(`rgba(0,0,0,${a})`).rect(0,0,size.x, size.y);
                        }) ,
                        size: frameModel.general.size
                    }
                }
                
                
    
                let buildingFrame = model.frames[f].img;//PP.createImage(frameModel);
                let bPosition = new V2(movingLinePoints[movingLineIndexValues[f]]);//.substract(modelCenter).toInt();

                if(!framesData[frameIndex]){
                    framesData[frameIndex] = [];
                }

                let order = f;
                framesData[frameIndex][order] = {
                    modelSize: model.frames[f].size,//frameModel.general.size,
                    img: buildingFrame,
                    position: bPosition
                }
            }
        }
        
        /*
        frameData = [
            0: [
                { 
                    img,
                    modelFrameIndex
                }
            ],
            1: []
        ]
        */

        let imagesOutside;

        for(let f = 0; f < framesCount; f++){
            let frameData = framesData[f];
            if(frameData && frameData.length){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let i = 0; i < frameData.length; i++){
                        if(frameData[i]){
                            let { img, position, modelSize } = frameData[i]
                            //let bPosition = new V2(movingLinePoints[movingLineIndexValues[frameData[i].modelFrameIndex]]).substract(modelCenter).toInt();
                            ctx.drawImage(img, position.x - modelSize.x, position.y);  
                            //hlp.setFillColor('red').dot(position.x, position.y)
                        }
                    }
                })
            }
        }


        return frames;
    }

    start(){
        this.pCenter = new V2(149, 62);

        var model = Demo10DriveScene.models.main;

        let showWindshield = true;
        let show1Layer = false;
        let show2Layer = false;
        let show3Layer = false;
        let showRain = false;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            img: PP.createImage(Demo10DriveScene.models.bg)
        }), 0)

        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(1,1),
            init() {
                let list = ['windshield', 'handWheel', 'eq', 'clockTick', 'bg', 'd1', 'mirrors', 'panel'];
                let toggle = false;
                let delay = 40;
                this.timer = this.regTimerDefault(15, () => {
                    if(delay-- > 0)
                        return;

                    delay = 40;

                    list.forEach(name => {
                        this.parentScene[name].position.y+= (toggle ? -1: 1);
                        this.parentScene[name].needRecalcRenderProperties = true;
                    })

                    toggle = !toggle;
                    
                })
            }
        }));

        if(showWindshield){
            this.windshield = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                frames: this.createSwipeFrames({
                    framesCount: 200, swipeFramesLength: 70, 
                    swipers: [
                        {center: new V2(45,90),r1: 15, r2: 70, angleClamps: [3, -115]},
                        {center: new V2(100,91),r1: 15, r2: 70, angleClamps: [5, -115]}] //100, 91
                    , itemsCount: 2000, size: this.viewport}),
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
            }), 9)
        }
        

        let except = ['hand', 'wheel'];
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(except.indexOf(name) == -1) {
                this[name] = this.addGo(new GO({
                    position: this.sceneCenter.clone(),
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}),
                    init() {
                    }
                }), (l+1)*10);
                console.log(`layer №${l} - ${name} added`);
            }
        }

        this.handWheel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            frames: PP.createImage(Demo10DriveScene.models.handWheelFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 10;
                this.timer = this.regTimerDefault(15, () => {
                    if(delay-- > 0)
                        return;

                    delay = 40;
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 60)

        this.eq = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            frames: PP.createImage(Demo10DriveScene.models.eqFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 5;
                this.timer = this.regTimerDefault(15, () => {
                    if(delay-- > 0)
                        return;

                    delay = 5;
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 100)

        this.clockTick = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            img: PP.createImage(Demo10DriveScene.models.clockTick),
            init() {
                this.currentFrame = 0;
                //this.img = this.frames[this.currentFrame];
                let delay = 40;
                this.timer = this.regTimerDefault(15, () => {
                    if(delay-- > 0)
                        return;

                    delay = 40;

                    this.isVisible = !this.isVisible;
                    //this.img = this.frames[this.currentFrame];
                    // this.currentFrame++;
                    // if(this.currentFrame == this.frames.length){
                    //     this.currentFrame = 0;
                    // }
                })
            }
        }), 100)

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10DriveScene.models.road),
            createRoadFrames({framesCount, itemsCount, itemFrameslength, size, opacity}) {
                let frames = [];
                let angleClamps = [0, 82];
                let pCenter = this.parentScene.pCenter.add(new V2(2,0));
                let length = pCenter.distance(new V2(0,84))
                let l1 = createLine(new V2(0,0), new V2(0, size.y));
                let l2 = createLine(new V2(0, size.y), new V2(size.x, size.y))
                let sharedPP = undefined;
                let oValues = easing.fast({from: 0, to: opacity, steps: itemFrameslength, type: 'expo', method: 'in'}).map(v=> fast.r(v,2));
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let angle = getRandomInt(0, 82);
                    let direction = V2.down.rotate(angle);
                    let p2 = pCenter.add(direction.mul(length+getRandomInt(-20,0))).toInt();
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    let wValues = easing.fast({from: 1, to: getRandomInt(5,20), steps: itemFrameslength, type: 'expo', method: 'in'}).map(v=> fast.r(v));
                    // let p2 = raySegmentIntersectionVector2(pCenter, direction, l1);
                    // if(!p2)
                    //     p2 = raySegmentIntersectionVector2(pCenter, direction, l2);

                    // if(!p2)
                    //     return;

                    let linePoints = sharedPP.lineV2(pCenter, p2);
                    let indexValues = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'expo', method: 'in'}).map(v=> fast.r(v));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            index: f,   
                            width: wValues[f], 
                            point: linePoints[indexValues[f]]
                        };
                    }
                
                    return {
                        
                        frames,
                        indexValues,
                        linePoints
                    }
                }).filter(v => v != undefined);
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(0,0,0,${oValues[itemData.frames[f].index]})`)
                                    .rect(itemData.frames[f].point.x, itemData.frames[f].point.y, itemData.frames[f].width, 1);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.roadItems = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createRoadFrames({ framesCount: 200, itemsCount: 1000, itemFrameslength: 200, size: this.size, opacity: 0.3 }),
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
        }),5)

        //return;

        if(show3Layer) {
            this.addGo(new GO({ // 3-ий ряд
                position: this.sceneCenter.clone(),
                size: this.viewport,
                init() {
                    this.frames = this.parentScene.createBuildingsFrames(
                        {framesCount: 600, framesPerModel: 600, 
                            modelsData: [
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 50,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 150,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 250,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 350,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 450,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b9,
                                    initialFrame: 550,
                                },
                                
                            ], 
                            size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-60), makeDarkerBy: 2 })
    
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
            }), 2)
        }
        
        if(show2Layer){
            this.addGo(new GO({ // 2-ой ряд
                position: this.sceneCenter.clone(),
                size: this.viewport,
                init() {
                    this.frames = this.parentScene.createBuildingsFrames(
                        {framesCount: 400, framesPerModel: 400, 
                            modelsData: [
                                {
                                    model: Demo10DriveScene.models.buildings.b5,
                                    initialFrame: 50,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b4,
                                    initialFrame: 100,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b6,
                                    initialFrame: 175,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b5,
                                    initialFrame: 250,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b6,
                                    initialFrame: 275,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b4,
                                    initialFrame: 300,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b6,
                                    initialFrame: 350,
                                },
                            ], 
                            size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-50), makeDarkerBy: 2 })
    
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
            }), 3)
        }
        
        if(show1Layer){
            this.addGo(new GO({ // первый ряд
                position: this.sceneCenter.clone(),
                size: this.viewport,
                init() {
                    this.frames = this.parentScene.createBuildingsFrames(
                        {framesCount: 300, framesPerModel: 300, 
                            modelsData: [
                                {
                                    model: Demo10DriveScene.models.buildings.b13,
                                    initialFrame: 5,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b7,
                                    initialFrame: 15,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b3,
                                    initialFrame: 30,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b8,
                                    initialFrame: 45,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b12,
                                    initialFrame: 55,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b10,
                                    initialFrame: 70,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b13,
                                    initialFrame: 85,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b3,
                                    initialFrame: 100,
                                    
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b8,
                                    initialFrame: 120,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b11,
                                    initialFrame: 135,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b7,
                                    initialFrame: 150,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b10,
                                    initialFrame: 170,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b8,
                                    initialFrame: 185,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b3,
                                    initialFrame: 200,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b12,
                                    initialFrame: 220,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b7,
                                    initialFrame: 240,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b13,
                                    initialFrame: 260,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b8,
                                    initialFrame: 275,
                                },
                                {
                                    model: Demo10DriveScene.models.buildings.b11,
                                    initialFrame: 290,
                                }
    
                            ], 
                            size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-160), makeDarkerBy: 3 })
    
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
            }), 4)
        }
        

        this.addGo(new GO({ // забор
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 200, framesPerModel: 200, 
                        modelsData: [
                            ...new Array(40).fill().map((_,i) => ({
                                model: Demo10DriveScene.models.buildings.vLine,
                                initialFrame: i*5,
                            }))
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-25), makeDarkerBy: 2 })

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
        }), 6)

        this.addGo(new GO({ //фонари
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.frames = this.parentScene.createBuildingsFrames(
                    {framesCount: 200, framesPerModel: 200, 
                        modelsData: [
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 0,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 25,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 50,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 75,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 100,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 125,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 150,
                            },
                            {
                                model: Demo10DriveScene.models.buildings.b2,
                                initialFrame: 175,
                            },
                        ], 
                        size: this.size, targetPoint: new V2(-150, this.parentScene.pCenter.y-160), makeDarkerBy: 1 })

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
        }), 6)

        if(showRain){
            this.rain = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport,
                init() {
                    this.frames = [
                        this.parentScene.createRainFrames({ framesCount: 100, itemsCount: 1600, xClamps: [100, 170], opacity: 0.05, lowerY: 70, 
                            angle: 11, itemFrameslength: 40, size: this.size, length: 7, yDelta: 20, xShift: 2 }),
                        this.parentScene.createRainFrames({ framesCount: 100, itemsCount: 1600, xClamps: [0, 90], opacity: 0.05, lowerY: 70, 
                            angle: 11, itemFrameslength: 40, size: this.size, length: 7, yDelta: 20, xShift: 2 }),                    
                        this.parentScene.createRainFrames({ framesCount: 100, itemsCount: 1200, xClamps: [40, 170], opacity: 0.1, lowerY: 80, 
                            angle: 14, itemFrameslength: 35, size: this.size, length: 12, yDelta: 20, xShift: 4 }),
                        this.parentScene.createRainFrames({ framesCount: 100, itemsCount: 200, xClamps: [20, 170], opacity: 0.1, lowerY: 100, 
                            angle: 17, itemFrameslength: 30, size: this.size, length: 18, yDelta: 6, xShift: 6 }),
                        this.parentScene.createRainFrames({ framesCount: 100, itemsCount: 100, xClamps: [0, 175], opacity: 0.1, lowerY: 100, 
                            angle: 25, itemFrameslength: 25, size: this.size, length: 25, yDelta: 8, xShift: 18 }),
                    ];
    
                    this.rainLayers = this.frames.map(frames => this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames,
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
                    })))
                    
                }
            }), 7)
        }
        

        this.createRainFrames = function({framesCount, itemsCount,xClamps, opacity, lowerY,angle, itemFrameslength, size, length, yDelta, xShift}) {
            let frames = [];

            let angleToX = easing.fast({from: angle, to: 0, steps: xClamps[1]-xClamps[0], type: 'linear', method: 'base'}).map(v => fast.r(v));
            
            
            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx})
                //originalDots = new PP({ctx}).lineV2(p1, p2);
            })

            let xShiftValues = easing.fast({from: 0, to: xShift, steps: itemFrameslength, type: 'linear', method: 'base'}).map(v => fast.r(v));

            let tailOpacityValues = easing.fast({from: opacity, to: 0, steps: length, type: 'quad', method: 'out'}).map(v => fast.r(v,2))

            let lowerLine = createLine(new V2(-size.x*2, lowerY), new V2(0, lowerY));
            let startP = new V2(0,0);
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let x = getRandomInt(xClamps[0], xClamps[1]);

                let angle = angleToX[x-xClamps[0]];

                let direction = V2.down.rotate(angle);
                let p2 = raySegmentIntersectionVector2(startP, direction, lowerLine);
                
                let p1 = startP.add(direction.mul(-length - getRandomInt(1,10)));
                let originalDots = sharedPP.lineV2(p1, p2);
                let indexValues = easing.fast({from: 0, to: originalDots.length-1 - getRandomInt(0, yDelta), steps: itemFrameslength, type: 'linear', method: 'base'}).map(v => fast.r(v));

                
                //let indexValues = indexValuesVariants[getRandomInt(0, indexValuesVariants.length-1)];
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: f
                    };
                }
            
                return {
                    x,
                    frames,
                    indexValues,
                    originalDots
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let indexOriginal = itemData.indexValues[itemData.frames[f].index];
                            let xShiftValue = xShiftValues[itemData.frames[f].index]
                            let prevX = undefined;
                            for(let i = 0; i < length; i++){
                                let opacity = tailOpacityValues[i];
                                let index= indexOriginal - i;
                                if(index < 0)
                                    continue;

                                let originalDot = itemData.originalDots[index];

                                hlp.setFillColor(`rgba(255,255,255, ${opacity})`).dot(originalDot.x + itemData.x - xShiftValue, originalDot.y);

                                if(prevX != undefined && originalDot.x != prevX){
                                    hlp.setFillColor(`rgba(255,255,255, ${opacity/2})`)
                                        //.dot(originalDot.x + itemData.x - xShiftValue - 1, originalDot.y)
                                        .dot(originalDot.x + itemData.x - xShiftValue, originalDot.y+1);
                                }

                                prevX = originalDot.x;
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }
    }
}