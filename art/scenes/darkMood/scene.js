class DarkMoodScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'darkMood_2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model  = DarkMoodScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg1'] })

                this.dithering = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDithering({data, hlp, xClamps, rValues}) {

                        let a1 = new Array(50).fill().map((el, i) => 1 + i*4)
                        let a2 = new Array(50).fill().map((el, i) => 3 + i*4)
                
                        let b1 = new Array(50).fill().map((el, i) => i*4)
                        let b2 = new Array(50).fill().map((el, i) => 2+ i*4)

                        let sharedPP = PP.createNonDrawingInstance();
        
                        data.forEach(d => {
                            let {c1, c2, divider, dividerPoints} = d;
        
                            let linePoints = [];
        
                            if(divider) {
                                let p1 = new V2(x1,divider);
                                let p2 = new V2(x2,divider);
        
                                linePoints = sharedPP.lineV2(p1, p2).map(p => new V2(p))
                            }
        
                            if(dividerPoints) {
                                linePoints = dividerPoints.map(p => new V2(p))
                            }
        
                            for(let i = 0; i < 2; i++) {
                                let c = undefined;
                                if(i == 0) {
                                    c = c1;
                                }
                                else {
                                    c = c2;
                                }
        
                                let d = i == 0 ? -1 : 1;
                                let xShift = i == 1 ? new V2(1, 0) : new V2()
        
                                let affectedPoints0 = [];
                                let affectedPoints1 = [];
                                let affectedPoints2 = [];
                                let affectedPoints3 = [];
                                // let r1 = 7;
                                // let r2 = 4;
                                // let r3 = 2;
        
                                let r0 = rValues[0] //14;
                                let r1 = rValues[1] //10;
                                let r2 = rValues[2] //6;
                                let r3 = rValues[3] //2;
            
                                if(i == 1) {
                                    r0-=2
                                    r1-=2
                                    r2-=2
                                }
        
                                linePoints.forEach(lp => {
                                    //let aPoints = sharedPP.lineV2(lp, lp.add(direction2.mul(r1)));
                                    let aPoints0 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r0))).map(p => new V2(p));
                                    affectedPoints0.push(...aPoints0);
        
                                    let aPoints1 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r1))).map(p => new V2(p));
                                    affectedPoints1.push(...aPoints1);
            
                                    let aPoints2 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r2))).map(p => new V2(p));
                                    affectedPoints2.push(...aPoints2);
            
                                    //let aPoints2 = sharedPP.lineV2(lp, lp.add(direction2.mul(r2)));
                                    let aPoints3 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r3))).map(p => new V2(p));
                                    affectedPoints3.push(...aPoints3);
                                })
            
                                affectedPoints0 = distinctPoints(affectedPoints0)
                                affectedPoints1 = distinctPoints(affectedPoints1)
                                affectedPoints2 = distinctPoints(affectedPoints2)
                                affectedPoints3 = distinctPoints(affectedPoints3)
            
                                let putDot = (p, c) => {
                                    if(p.x > xClamps[1])
                                        return;
        
                                    hlp.setFillColor(c).dot(p)
                                }
        
                                affectedPoints0.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        if(b1.indexOf(ap.y)!=-1 && b1.indexOf(ap.x) !=-1)
                                            putDot(ap.add(xShift),c)
                                        else if(b2.indexOf(ap.y)!=-1 && b2.indexOf(ap.x) !=-1)
                                            putDot(ap.add(xShift),c)
                                    }
                                })
           
                                affectedPoints1.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        putDot(ap.add(xShift),c)
                                    }
                                })
            
                                affectedPoints2.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        putDot(ap.add(xShift), c)
                                    }
                                    else {
                                        if(a1.indexOf(ap.y) != -1 && a1.indexOf(ap.x) != -1) {
                                            putDot(ap.add(xShift),c)
                                        }
                                        else if(a2.indexOf(ap.y) != -1 && a2.indexOf(ap.x) != -1){
                                            putDot(ap.add(xShift),c)
                                        }
            
                                    }
            
                                })
            
                                if( i == 0) {
                
                                    affectedPoints3.forEach(ap => {
                                        let shift = ap.y %2 == 0;
                                        if((shift && ap.x % 2 == 0) || (!shift && ap.x%2 != 0)){
                                            hlp.setFillColor(c).dot(ap)
                                        }
                                    })
                                }
                            }
                        });
                    },
                    init() {
                        let sharedPP = PP.createNonDrawingInstance()
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#2e272e').rect(0,0,size.x, 70)
                            hlp.setFillColor('#281e25').rect(0,0,size.x, 30)
                            this.createDithering({
                                data: [
                                    {
                                        c2: '#281e25',
                                        c1: '#2e272e',
                                        dividerPoints: sharedPP.lineV2(new V2(0,30), new V2(200,30))
                                    },
                                    {
                                        c2: '#2e272e',
                                        c1: '#342f36',
                                        dividerPoints: sharedPP.lineV2(new V2(0,70), new V2(200,70))
                                    }
                                ],
                                hlp,
                                xClamps: [0, this.size.x],
                                rValues: [8,6,4,2].map(x => x*2)
                            })
                        })
                    }
                }))
            }
        }), 1)

        this.rock = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['rock'] })

                this.rock_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'rock_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [100,150], pointsData: pd, size: this.size 
                        });
        
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.house = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['house'] })

                // this.window_a = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let img = PP.createImage(model, { renderOnly: ['window_a'], forceVisibility: {window_a: {visible: true}} })

                //         this.currentFrame = 0;
                //         let count = getRandomInt(5,15);

                //         this.timer = this.regTimerDefault(10, () => {
                //             this.currentFrame++;
                //             if(this.currentFrame == count){
                //                 this.currentFrame = 0;
                //                 count = getRandomInt(10,15);

                //                 if(getRandomInt(0,3) == 0) {
                //                     this.img = img;
                //                 }
                //                 else {
                //                     this.img = undefined
                //                 }
                                
                //             }
                //         })
                //     }
                // }))

                this.smoke = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSmokeFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let color = '#3c3a40';
                        let startPoint = new V2(130,77);
                        let sharedPP = PP.createNonDrawingInstance();

                        let originalPath = model.main.layers.find(l => l.name == 'smoke_path').groups[0].points.map(p => new V2(p.point));
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength);

                            let path = originalPath.map((p, i) => i > 0 ? p.add(new V2(getRandomInt(-2,2), getRandomInt(-2,2))) : p.clone() );

                            let sizeValues = [
                                ...easing.fast({from: 1, to: 2, steps: fast.r(totalFrames/4), type: 'quad', method: 'inOut', round: 0 }),
                                ...easing.fast({from: 2, to: 1, steps: fast.r(totalFrames*3/4), type: 'quad', method: 'inOut', round: 0 })
                            ]

                            let pathPoints = sharedPP.curveByCornerPoints(path, 3);

                            let indices = easing.fast({from: 0, to: pathPoints.length-1, steps: totalFrames, type: 'linear', round: 0})

                            let frames = [];
                            let current = startPoint.clone();
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }

                                frames[frameIndex] = {
                                    s: sizeValues[f],
                                    p: pathPoints[indices[f]]
                                };
                            }
                        
                            return {
                                frames
                            }
                        })
                        
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {

                                hlp.setFillColor(color).rect(startPoint.x-1, startPoint.y+1, 2,1);

                                let pData = [];
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];

                                    if(itemData.frames[f]){
                                        let img = circleImages[color][itemData.frames[f].s];
                                        let xShift = new V2();
                                        let s = itemData.frames[f].s;
                                        if(s > 0) {
                                            if(s > 1) {
                                                xShift = new V2(-s/2, -s/2).toInt();
                                            }

                                            if(img)
                                                ctx.drawImage(circleImages[color][s], itemData.frames[f].p.x + xShift.x, itemData.frames[f].p.y + xShift.y)
                                        }

                                        pData.push(itemData.frames[f].p)
                                        
                                    }
                                    
                                }

                                //new PP({ctx}).fillByCornerPoints(pData);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createSmokeFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: [150,200], size: this.size });
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 20)

        this.person = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['person'] })
            }
        }), 25)

        let createSingleCloudsFrames = function({framesCount, startSize, color, initialProps, yShiftClamps, xShiftClamps, itemsCount, itemFrameslength, size}) {
            let frames = [];
            let sharedPP = PP.createNonDrawingInstance();
            let initialDots = []//sharedPP.lineV2(initialProps.p1, initialProps.p2).map(p => new V2(p))

            if(initialProps.line) {
                initialDots = sharedPP.lineV2(initialProps.p1, initialProps.p2).map(p => new V2(p))
            }
            else if(initialProps.curve) {
                initialDots = sharedPP.curveByCornerPoints(initialProps.points, initialProps.numOfSegments).map(p => new V2(p))
            }
            else {
                throw 'Unknown initial props type';
            }

            let sValues = easing.fast({from: startSize, to: 1, steps: itemFrameslength, type: 'linear', round: 0});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let yShift = getRandomInt(yShiftClamps);
                let yShiftValues = easing.fast({from: 0, to: yShift, steps: totalFrames, type: 'linear', round: 0});

                let xShift = getRandomInt(xShiftClamps);
                let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0});
                let p = initialDots[getRandomInt(0, initialDots.length-1)]

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        s: sValues[f],
                        yShift: yShiftValues[f],
                        xShift: xShiftValues[f]
                    };
                }
            
                return {
                    p,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(circleImages[color][itemData.frames[f].s], itemData.p.x+ itemData.frames[f].xShift, itemData.p.y + itemData.frames[f].yShift)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let totalFrames = 300;
        let circleImages = {};
        let cColors = [ '#3c3a40','#44454a', '#4b4e53', '#484a4f' ]

        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 30; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        this.backFog = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 10)),
            size: this.viewport.clone(),
            init() {
                let itemsCount = 300;
                let leftYShift = -20;
                let centerYShift = -5;
                let rightYShift = 0;
                this.singles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSingleCloudsFrames({
                            framesCount: totalFrames, startSize: 6, color: '#3c3a40' , 
                            initialProps: 
                            //{p1: new V2(-40, 110+leftYShift), p2: new V2(220, 110+rightYShift)}, 
                            {
                                curve: true, points: [new V2(-40, 110+leftYShift), new V2(this.size.x/2, 110+centerYShift), new V2(220, 110+rightYShift)], 
                                numOfSegments: 6
                            }, 
                            yShiftClamps: [-7, -10], itemsCount: 50, itemFrameslength: 200, xShiftClamps: [5,8], size: this.size
                        }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(f, 0,0);
                        }));
                        this.registerFramesDefaultTimer({});
                    }
                }));

                this.layers = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let distanceClamps = [5,8]

                        

                        let cloudsParams = [
                            // {
                            //     dithering: 1,
                            //     framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                            //     directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                            //     initialProps: {
                            //         line: true, p1: new V2(-40, 110), p2: new V2(220, 110)
                            //     }, yShiftClamps: [-6,-8],
                            // },
                            // {
                            //     dithering: 0,
                            //     framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                            //     directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                            //     initialProps: {
                            //         line: true, p1: new V2(-40, 113), p2: new V2(220, 113)
                            //     }, yShiftClamps: [-6,-8],
                            // },
                            {
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#3c3a40', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 115+leftYShift), p2: new V2(220, 115+rightYShift)
                                    curve: true, points: [new V2(-40, 115+leftYShift), new V2(this.size.x/2, 115 + centerYShift), new V2(220, 115+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-8],
                            },
                            {
                                dithering: 1,
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 121+leftYShift), p2: new V2(220, 121+rightYShift)
                                    curve: true, points: [new V2(-40, 121+leftYShift), new V2(this.size.x/2, 121 + centerYShift), new V2(220, 121+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-10],
                            },
                            {
                                dithering: 0,
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 125+leftYShift), p2: new V2(220, 125+rightYShift)
                                    curve: true, points: [new V2(-40, 125+leftYShift), new V2(this.size.x/2, 125 + centerYShift), new V2(220, 125+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-8],
                            },
                            {
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 130+leftYShift), p2: new V2(220, 130+rightYShift)
                                    curve: true, points: [new V2(-40, 130+leftYShift), new V2(this.size.x/2, 130 + centerYShift), new V2(220, 130+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-8],
                            },
                            {
                                dithering: 1,
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#4b4e53', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 142+leftYShift), p2: new V2(220, 142+rightYShift)
                                    curve: true, points: [new V2(-40, 142+leftYShift), new V2(this.size.x/2, 142 + centerYShift), new V2(220, 142+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-8,-12],
                            },
                            {
                                dithering: 0,
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#4b4e53', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 145+leftYShift), p2: new V2(220, 145+rightYShift)
                                    curve: true, points: [new V2(-40, 145+leftYShift), new V2(this.size.x/2, 145 + centerYShift), new V2(220, 145+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-8],
                            },
                            {
                                framesCount: totalFrames, itemsCount, itemFrameslength: totalFrames, color: '#4b4e53', size: this.size,
                                directionAngleClamps: [70, 90], distanceClamps, sizeClamps: [16,20],
                                initialProps: {
                                    //line: true, p1: new V2(-40, 150+leftYShift), p2: new V2(220, 150+rightYShift)
                                    curve: true, points: [new V2(-40, 150+leftYShift), new V2(this.size.x/2, 150 + centerYShift), new V2(220, 150+rightYShift)], getCurvePointsMain: 6
                                }, yShiftClamps: [-6,-8],
                            }
                        ];

                        let ditheringImage1 = createCanvas(this.size, (ctx, size, hlp) => {
                            let nnPP = PP.createNonDrawingInstance();
                            let pp = new PP({ctx});

                            let filledDots = nnPP.fillByCornerPoints([new V2(), new V2(size.x, 0), size, new V2(0, size.y)]);
                            pp.setFillColor('red');
                            pp.renderPattern('type1', filledDots);
                        })

                        let ditheringImage2 = createCanvas(this.size, (ctx, size, hlp) => {
                            let nnPP = PP.createNonDrawingInstance();
                            let pp = new PP({ctx});

                            let filledDots = nnPP.fillByCornerPoints([new V2(), new V2(size.x, 0), size, new V2(0, size.y)]);
                            pp.setFillColor('red');
                            pp.renderPattern('type2', filledDots);
                        })

                        let dImgs = [ditheringImage1, ditheringImage2]

                        let itemsFrames = cloudsParams.map(p => {
                            let frames = animationHelpers.createCloudsFrames({...p, circleImages});

                            if(p.dithering != undefined) {
                                frames = frames.map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.drawImage(f, 0, 0);
                                    ctx.globalCompositeOperation = 'destination-in'
                                    ctx.drawImage(dImgs[p.dithering], 0, 0);
                                }))
                            }

                            return {
                                frames
                            }
                        })

                        this.frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                                // ctx.globalAlpha = 1;
                                for(let i = 0; i < itemsFrames.length; i++){
                                    // ctx.globalAlpha = itemsFrames[i].opacity;
                                    ctx.drawImage(itemsFrames[i].frames[f],0,0);
                                }

                                // ctx.globalAlpha = 1;

                                // ctx.globalCompositeOperation = 'source-atop';
                                // ctx.drawImage(darkOverlay, 0,0);
                            })
                        }

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        this.frontalFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
                let excludeImg = PP.createImage(model, { renderOnly: ['frontal_fog_exclude'], forceVisibility: { frontal_fog_exclude: { visible: 'true' } } })

                this.sinles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createSingleCloudsFrames({
                            framesCount: totalFrames, startSize: 8, color: '#3c3a40' , initialProps: {line: true, p1: new V2(-40, 170), p2: new V2(220, 170)}, 
                            yShiftClamps: [-7, -13], itemsCount: 150, itemFrameslength: 200, xShiftClamps: [10,16], size: this.size
                        }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(f, 0,0);
                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(excludeImg, 0, 0)
                        }));
                        this.registerFramesDefaultTimer({});
                    }
                }));


                let params = [
                    {
                        framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#3c3a40', size: this.size,
                        directionAngleClamps: [70, 90], distanceClamps: [10,15], sizeClamps: [8,18],
                        initialProps: {
                            line: true, p1: new V2(-40, 175), p2: new V2(220, 175)
                        }, yShiftClamps: [-6,-10],
                    },
                    {
                        framesCount: totalFrames, itemsCount: 400, itemFrameslength: totalFrames, color: '#44454a', size: this.size,
                        directionAngleClamps: [70, 90], distanceClamps: [10,15], sizeClamps: [12,24],
                        //sec: {color: '#44454a', sDecrClamps: [-2,2], yShiftClamps: [6,8], xShiftClamps: [-20,20]},
                        initialProps: {
                            line: true, p1: new V2(-40, 183), p2: new V2(220, 183)
                        }, yShiftClamps: [-6,-10],
                    }
                ]

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createCloudsFrames({...p, circleImages}).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(f, 0,0);
                            ctx.globalCompositeOperation = 'destination-out';
                            ctx.drawImage(excludeImg, 0, 0)
                        }))
        
                        //console.log('ff')
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                           //     this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                })))
                
            }
        }), 21)
    }
}