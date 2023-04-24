class SubwayScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1980,1130),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'subway',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
            scrollOptions: {
                enabled: true,
                zoomEnabled: true,
                restrictBySpace: false,
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = SubwayScene.models.main;
        let layersData = {};
        let exclude = [
            
        ];

        let originalSize = new V2(200,113);
        
        this.sceneManager = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                SCG.viewport.camera.updatePosition(new V2(-0.5,0));

                let totalFrames = 120;
                let xValues = [
                    ...easing.fast({from: -0.5, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: 0, to: -0.5, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                let xFrontalValues = [
                    ...easing.fast({from: 0.5, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1}),
                    ...easing.fast({from: 0, to: 0.5, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 1})
                ]

                this.currentFrame = 0;
                
                this.timer = this.regTimerDefault(10, () => {

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    SCG.viewport.camera.updatePosition(new V2(xValues[this.currentFrame],0));
                    this.parentScene.frontal_right.position.x = this.parentScene.sceneCenter.x + xFrontalValues[this.currentFrame];
                    this.parentScene.frontal_right.needRecalcRenderProperties = true;
                })
            }
        }), 0)

        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            //continue;
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.add(new V2((layerName == 'frontal_right' ? 0.5 : 0)  ,0)),
                size: originalSize,
                img: PP.createImage(model, { renderOnly: [layerName] }),
                //isVisible: false,
                init() {
                    if(layerName == 'reflections_left') {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(this.img, 0, 0);
                        })
                    }

                    if(layerName == 'far_carriage') {
                        this.currentFrame = 0;
                        this.animation = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = PP.createImage(SubwayScene.models.farCarriageAnimation);
                        
                                let shiftDelayOrigin = 120;
                                let currentShiftCounter = 0;
                                let currentXShift = 0;
        
                                let xValues = [
                                    ...easing.fast({from: 0, to: 0.25, steps: shiftDelayOrigin/2, type: 'sin', method: 'inOut', round: 1}),
                                    ...easing.fast({from: 0.25, to: 0, steps: shiftDelayOrigin/2, type: 'sin', method: 'inOut', round: 1})
                                ]

                                let yValues = [
                                    ...easing.fast({from: 0, to: 0.25, steps: shiftDelayOrigin/2, type: 'sin', method: 'inOut', round: 1}),
                                    ...easing.fast({from: 0.25, to: 0, steps: shiftDelayOrigin/2, type: 'sin', method: 'inOut', round: 1})
                                ]

                                let frameIndexes = [
                                    ...easing.fast({from: 0, to: 1, steps: 60, type: 'sin', method: 'inOut', round: 0}),
                                    // ...new Array(20).fill(2),
                                    ...easing.fast({from: 1, to: 0, steps: 60, type: 'sin', method: 'inOut', round: 0})
                                ]
        
                                //this.img = this.frames[0];

                                this.timer = this.regTimerDefault(10, () => {
                                
                                    currentShiftCounter++;
                                    if(currentShiftCounter == shiftDelayOrigin){
                                        currentShiftCounter = 0;
        
                                        // if(currentXShift == 0) {
                                        //     currentXShift = 1;
                                        // }
                                        // else {
                                        //     currentXShift = 0;
                                        // }
                                    }
        
                                    //this.img = this.frames[frameIndexes[currentShiftCounter]]

                                    this.parent.position = this.parent.parentScene.sceneCenter.add(new V2(xValues[currentShiftCounter], 0));
                                    this.parent.needRecalcRenderProperties = true;
                                })
                            }
                        }))
                        
                    }
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        this.rightTunnel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize,
            init() {
                this.frames = [];
                let _sharedPP;
                let lampLinePoints = [];
                let framesCount = 120;
                let lampFramesCount = 60;

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                    lampLinePoints = _sharedPP.lineV2(new V2(170,50), new V2(199,29))
                })

                let size = this.size;
                let lengthValues = easing.fast({from: 2, to: 10, steps: lampFramesCount, type: 'quad',  method: 'in', round: 0 });
                let lampLineIndexValues = easing.fast({from: 0, to: lampLinePoints.length-1, steps: lampFramesCount, type: 'quad', method: 'in', round: 0});
                let lampColor = '#f3f8ff';
                let lampInitialFrame = 0;

                let lampData = [];
                for(let lf = 0; lf < lampFramesCount; lf++) {
                    lampData[lampInitialFrame + lf] = {
                        p: lampLinePoints[lampLineIndexValues[lf]],
                        tailLength: lengthValues[lf],
                        index: lampLineIndexValues[lf],
                    } 
                }

                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let lampDataItem = lampData[f];


                        if(lampDataItem) {
                            for(let ll = 0; ll < lampDataItem.tailLength; ll++) {
                                let index = lampDataItem.index + ll;
                                if(index > (lampLinePoints.length-1))
                                    continue;
                                
                                let p = lampLinePoints[index];
                                hlp.setFillColor(lampColor).dot(p)
                                
                                // if(lampDataItem.height > 1){
                                //     hlp.dot(p.x, p.y+1);
                                // }
                                
                            } 
                        }

                    });
                }

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+1)


        this.leftTunnel = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize,
            init() {
                let upperLinePoints = [];

                let _sharedPP;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                    upperLinePoints = _sharedPP.lineV2(new V2(139,50), new V2(0,29))
                })

                let p1Upper = 29;
                let p1Lower = 85;
                let p2Upper = 50;
                let p2Lower = 60;

                let p1Left = 0;
                let p2Right = 139

                let p1Delta = p1Lower-p1Upper;
                let p2Delta = p2Lower-p2Upper;

                let bg = createCanvas(this.size, (ctx, size, hlp) => {
                    let cornerPoints = [new V2(p1Left,p1Upper), new V2(p2Right,p2Upper), new V2(p2Right,p2Lower), new V2(p1Left, p1Lower)]
                    let pp = new PP({ctx})
                    pp.setFillStyle('#171409');
                    pp.fillByCornerPoints(cornerPoints);

                    pp.setFillStyle('rgba(0,0,0,0.2)');
                    pp.fillByCornerPoints([new V2(p1Left,p1Upper), new V2(p2Right,p2Upper),new V2(p2Right,55), new V2(0,45)]);

                    // pp.setFillStyle('#221e0e');
                    // pp.fillByCornerPoints([new V2(0,50), new V2(p2Right,55), new V2(p2Right,60), new V2(0, p1Lower)]);

                    //pp.setFillStyle('rgba(0,0,0,0)');
                    
                })
                //

                this.frames = [];

                let size = this.size;    
                let totalFrames = 60;
                let framesCount = 120;
                let lampFramesCount = 60;
                let itemsCount = 10;
                let frameToItem = easing.fast({from: 0, to: framesCount-1, steps: itemsCount, type: 'linear', round: 0 });
                let upperLineIndexChange = easing.fast({from: 0, to: upperLinePoints.length-1, steps: totalFrames, type: 'quad', method: 'in', round: 0});
                let widthChange = easing.fast({from: 1, to: 10, steps: totalFrames, type: 'quad', method: 'in', round: 0});

                let darkItemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = frameToItem[i] //getRandomInt(0, framesCount-1);
                    //let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: upperLinePoints[upperLineIndexChange[f]],
                            width: widthChange[f]
                        };
                    }
                
                    return {
                        frames
                    }
                })

                //wires
                let xClamps = [0, 139]
                let wiresFramesCount = 20;
                let halfFramesCount = fast.r(wiresFramesCount/2);

                //let line1 =  _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.5).toInt(), new V2(p2Right,p2Upper + p2Delta*0.5).toInt());
                let maxHeight = 4;
                let maxDarkOpacity = 0.5
                let darkOpacityValues = new Array(maxHeight+1).fill().map((el, i) => {
                    if(i == 0 || i == 1)
                        return [maxDarkOpacity];

                    return easing.fast({from: 0.2, to: maxDarkOpacity, steps: i, type: 'linear', round: 2})
                });

                let lines = [
                    { 
                        line: _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.05).toInt(), new V2(p2Right,p2Upper + p2Delta*0.1).toInt()),
                        maxHeight: 2,
                        maxLightOpacity: 0.025
                     },
                    { 
                        line: _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.35).toInt(), new V2(p2Right,p2Upper + p2Delta*0.4).toInt()),
                        maxHeight: 3,
                        maxLightOpacity: 0.04
                     },
                    { 
                        line: _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.5).toInt(), new V2(p2Right,p2Upper + p2Delta*0.5).toInt()),
                        maxHeight: 3
                     },
                     { 
                        line: _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.2).toInt(), new V2(p2Right,p2Upper + p2Delta*0.2).toInt()),
                        maxHeight: 2,
                        maxLightOpacity: 0.035
                     },
                     { 
                        line: _sharedPP.lineV2(new V2(p1Left,p1Upper + p1Delta*0.65).toInt(), new V2(p2Right,p2Upper + p2Delta*0.65).toInt()),
                        maxHeight: 3
                     },
                ]

                let wiresFramesDataArr = []
                //let heightToIndexValues = easing.fast({from: maxHeight, to: 1, steps: p2Right - p1Left, type: 'linear', round: 0});
                
                for(let l = 0; l < lines.length; l++) {
                    let line1 = lines[l].line;

                    let yDeltaToIndexValues = easing.fast({from: 2, to: 0, steps: line1.length, type: 'linear', round: 2});

                    // TODO: change to 2.5
                    

                    let wireDotsData = [
                        // { dots: [line1[0]] },
                        // { dots: [line1[line1.length-1]] }
                    ]

                    let step = 30
                    for(let i = 0; i < line1.length; i+=step) {
                        let p = line1[i];

                        let yDelta = yDeltaToIndexValues[i];
                        let yShift = getRandom(-yDelta,yDelta);

                        if(i == 0) {
                            yShift = yDelta * getRandomBool() ? 1 : -1
                        }

                        wireDotsData.push({
                            dots: [new V2(p), new V2(p.x, p.y + yShift)],
                            startFrameIndex: getRandomInt(0, wiresFramesCount*2-1),
                        })
                    }

                    wireDotsData.push({dots: [line1[line1.length-1]], startFrameIndex: 0})

                    wireDotsData.forEach(dotData => {
                        if(dotData.dots.length == 1){
                            dotData.dots = new Array(wiresFramesCount*2).fill().map(_ => dotData.dots[0])
                        }
                        else {
                            let distance = dotData.dots[0].distance(dotData.dots[1]);
                            let direction = dotData.dots[0].direction(dotData.dots[1]);

                            if(distance == 0) {
                                dotData.dots = new Array(wiresFramesCount*2).fill().map(_ => dotData.dots[0])
                                return;
                            }

                            let dValues = [
                                ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                                ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                                ...easing.fast({ from: 0, to: -distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                                ...easing.fast({ from: -distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                            ] 

                            let dots = [];//new Array(wiresFramesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));

                            let totalWFC = wiresFramesCount*2
                            for(let f = 0; f < totalWFC; f++){
                                let frameIndex = f + dotData.startFrameIndex;
                                if(frameIndex > (totalWFC-1)){
                                    frameIndex-=totalWFC;
                                }
                        
                                dots[frameIndex] = dotData.dots[0].add(direction.mul(dValues[f]));
                            }

                            dotData.dots = dots;
                        }
                    });

                    let wiresFramesData = [];
                    wiresFramesData.heightToIndexValues = easing.fast({from: lines[l].maxHeight, to: 1, steps: p2Right - p1Left, type: 'linear', round: 0})
                    wiresFramesData.maxLightOpacity = lines[l].maxLightOpacity || 0.05;

                    for(let f = 0; f < wiresFramesCount*2; f++){
                        wiresFramesData[f] = {dots: []};
                        let dots = wireDotsData.map(dd => {
                            return dd.dots[f]
                        });

                        let formula = mathUtils.getCubicSplineFormula(dots);
                        

                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            wiresFramesData[f].dots.push({x,y});
                        }
                        
                    }

                    wiresFramesDataArr.push(wiresFramesData);
                }


                //lamp
                let lampLinePoints = _sharedPP.lineV2(new V2(p2Right,p2Upper), new V2(p1Left,p1Upper)).map(p => new V2(p));
                let lampLineIndexValues = easing.fast({from: 0, to: lampLinePoints.length-1, steps: lampFramesCount, type: 'quad', method: 'in', round: 0});
                let lengthValues = easing.fast({from: 4, to: 40, steps: lampFramesCount, type: 'quad',  method: 'in', round: 0 });
                let lengthHeight = easing.fast({from: 1, to: 2, steps: lampFramesCount, type: 'quad',  method: 'in', round: 0 });
                let gradientCenterYShiftValues = easing.fast({from: 1, to: 30, steps: lampFramesCount, type: 'quad',  method: 'in', round: 0 });
                let lampColor = '#f3f8ff';
                let lampInitialFrame = 60;

                let fadeOutMaxDelta = 40
                let fadeoutY = easing.fast({from: 1, to: 0, steps: fadeOutMaxDelta, type: 'linear', round: 1});

                let upperfadeOutMaxDelta = 20
                let upperfadeoutY = easing.fast({from: 1, to: 0, steps: upperfadeOutMaxDelta, type: 'linear', round: 1});

                let lampData = [];
                for(let lf = 0; lf < lampFramesCount; lf++) {
                    lampData[lampInitialFrame + lf] = {
                        p: lampLinePoints[lampLineIndexValues[lf]],
                        index: lampLineIndexValues[lf],
                        tailLength: lengthValues[lf],
                        height: lengthHeight[lf],
                        gradientCenterYShift: gradientCenterYShiftValues[lf]
                    } 
                }

                //colors.createRadialGradient({ size: elSize, center: elCenter, radius: new V2(16,12), gradientOrigin: gO, angle: -10 })
                let drawEllipsis = (center, radius, gradientCenterYShift, hlp) => {

                    let gradientDots = colors.createRadialGradient({ size: new V2(), center: center.add(new V2(0, gradientCenterYShift)), radius: 
                        radius, gradientOrigin: center, angle: 0, maxValue: 0.2, minValue: 0, easingMethod: 'in' })

                    for(let y = 0; y < gradientDots.length; y++){
                        let row = gradientDots[y];
                        if(!row)
                            continue;
        
                        for(let x = 0; x < row.length; x++){
                            if(!row[x])
                                continue;
        
                            if(row[x].length == 0)
                                continue;
        
                            let a = Math.max(...row[x].values);
        
                            a = fast.r(a, 1);
                            if(row[x].maxValue == undefined)
                                row[x].maxValue = a;
                            

                            if(y > center.y) {
                                let yDelta = y - center.y;
                                if(yDelta > fadeOutMaxDelta)
                                    a = 0;
                                else {
                                    a = a*fadeoutY[yDelta];
                                }
                                
                            }
                            else if(y < center.y) {
                                let yDelta =  center.y - y;
                                if(yDelta > upperfadeOutMaxDelta)
                                    a = 0;
                                else {
                                    a = a*upperfadeoutY[yDelta];
                                }
                                
                            }

                            hlp.setFillColor('rgba(255,255,255,'+a+')').dot(new V2(x, y))
                        }
                    }
                }
                
                let wiresCurrentFrame = 0;

                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(bg, 0,0);

                        let lampDataItem = lampData[f];

                        for(let p = 0; p < darkItemsData.length; p++){
                            let itemData = darkItemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor('rgba(0,0,0,0.4').rect(itemData.frames[f].p.x,itemData.frames[f].p.y,itemData.frames[f].width, 100)
                            }
                        }

                        if(lampDataItem) {
                            let index = fast.r(lampDataItem.index + lampDataItem.tailLength/2)
                            if(index < lampLinePoints.length) {
                                drawEllipsis(lampLinePoints[index], new V2(lampDataItem.tailLength,lampDataItem.tailLength*1.5), lampDataItem.gradientCenterYShift, hlp);
                            }
                        }

                        for(let l = 0; l < wiresFramesDataArr.length; l++) {
                            let wiresFramesData = wiresFramesDataArr[l];

                            for(let i = 0; i < wiresFramesData[wiresCurrentFrame].dots.length; i++){

                                hlp.setFillColor('rgba(255,255,255,'+ wiresFramesData.maxLightOpacity +')').dot(wiresFramesData[wiresCurrentFrame].dots[i].x, wiresFramesData[wiresCurrentFrame].dots[i].y);
    
                                let height = wiresFramesData.heightToIndexValues[wiresFramesData[wiresCurrentFrame].dots[i].x-p1Left];
                                let heightOpacityValues = darkOpacityValues[height];
                                for(let h =0; h < height; h++) {
                                    hlp.setFillColor('rgba(0,0,0,' + heightOpacityValues[h] + ')').dot(wiresFramesData[wiresCurrentFrame].dots[i].x, wiresFramesData[wiresCurrentFrame].dots[i].y+h + 1)
                                }
                            }
                        }

                        if(lampDataItem) {
                            for(let ll = 0; ll < lampDataItem.tailLength; ll++) {
                                let index = lampDataItem.index + ll;
                                if(index > (lampLinePoints.length-1))
                                    continue;
                                
                                let p = lampLinePoints[index];
                                hlp.setFillColor(lampColor).dot(p)
                                
                                if(lampDataItem.height > 1){
                                    hlp.dot(p.x, p.y+1);
                                }
                                
                            } 
                        }
                        

                        wiresCurrentFrame++;
                        if(wiresCurrentFrame == wiresFramesCount*2) {
                            wiresCurrentFrame = 0;
                        }
                    });
                }

                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+1)

        this.glareAnimationsMain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: originalSize,
            init() {

                let getFrameIndex = (f) => {
                    if(f > totalFrames-1) {
                        f -= totalFrames
                    }

                    return f;
                }

                let putFrame = (index, f) =>  {
                    if(framesData[index] == undefined) {
                        framesData[index] = [];
                    }

                    framesData[index].push(f);
                }

                let totalFrames = 120;
                let lampStartFrame = 60;
                this.frames = new Array(totalFrames).fill();
                let l0 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l0'] } );
                let l1 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l1'] } );
                let l2 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l2'] } );
                let l3 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l3'] } );
                let l4 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l4'] } );
                let l5 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l5'] } );
                let l6 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l6'] } );
                let l7 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l7'] } );
                let l8 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l8'] } );
                let l9 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l9'] } );
                let l10 = PP.createImage(SubwayScene.models.glareAnimations, { renderOnly: ['l10'] } );
                let framesData = new Array(totalFrames).fill();

                for(let f = 0; f < l0.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + -5 + f*2),createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(l0[f], 0, 2)
                    }));
                    putFrame(getFrameIndex(lampStartFrame + -5 + f*2+1),createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(l0[f], 0, 2)
                    }));
                }

                for(let f = 0; f < l1.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 10 + f),l1[f])
                }

                for(let f = 0; f < l2.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 15 + (f*2)),l2[f])
                    putFrame(getFrameIndex(lampStartFrame + 15 + (f*2 + 1)),l2[f])
                }

                for(let f = 0; f < l3.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 45 + (f*2)),l3[f])
                    putFrame(getFrameIndex(lampStartFrame + 45 + (f*2 + 1)),l3[f])
                }

                for(let f = 0; f < l4.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 42 + (f*2)),l4[f])
                    putFrame(getFrameIndex(lampStartFrame + 42 + (f*2 + 1)),l4[f])
                }

                for(let f = 0; f < l5.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 25 + (f*2)),l5[f])
                    putFrame(getFrameIndex(lampStartFrame + 25 + (f*2 + 1)),l5[f])
                }

                for(let f = 0; f < l6.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 28 + (f*2)),l6[f])
                    putFrame(getFrameIndex(lampStartFrame + 28 + (f*2 + 1)),l6[f])
                }

                for(let f = 0; f < l7.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 36 + (f*3)),l7[f])
                    putFrame(getFrameIndex(lampStartFrame + 36 + (f*3 + 1)),l7[f])
                    putFrame(getFrameIndex(lampStartFrame + 36 + (f*3 + 2)),l7[f])
                }

                for(let f = 0; f < l8.length; f++) {
                    putFrame(getFrameIndex(lampStartFrame + 60 + (f*3)),l8[f])
                    putFrame(getFrameIndex(lampStartFrame + 60 + (f*3 + 1)),l8[f])
                    putFrame(getFrameIndex(lampStartFrame + 60 + (f*3 + 2)),l8[f])
                }

                for(let f = 0; f < l10.length; f++) {
                    putFrame(getFrameIndex(10 + (f*2)),l10[f])
                    putFrame(getFrameIndex(10 + (f*2 + 1)),l10[f])
                }

                for(let f = 0; f < l9.length; f++) {
                    putFrame(getFrameIndex(48 + (f*3)),l9[f])
                    putFrame(getFrameIndex(48 + (f*3 + 1)),l9[f])
                    putFrame(getFrameIndex(48 + (f*3 + 2)),l9[f])
                }

                this.frames = framesData.map(fd => {
                    return createCanvas(this.size, (ctx, size, hlp) => {
                        if(fd){
                            fd.forEach(f => {
                                ctx.drawImage(f, 0,0);
                            })
                        }
                    })
                })

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.frontal_left.renderIndex+1)
    }
}