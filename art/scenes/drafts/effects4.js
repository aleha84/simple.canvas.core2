class Effects4Scene extends Scene {
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
                size: new V2(200,200),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects4_2',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 0)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createEffectsFrames({framesCount, rowsCount, columnsCount, itemFrameslength, size}) {
                let frames = [];
                
                let startXShift = 40;
                let startYShift = 50;

                let xShift = 15;
                let yShift = 10;

                let points = [];

                for(let i = 0; i < rowsCount * columnsCount; i++) {

                    let row = fast.f(i/columnsCount);
                    let x = startXShift + i%columnsCount*xShift - row + getRandomInt(-2,2);
                    let y = startYShift + row*yShift + getRandomInt(-2,2);

                    points.push({
                        p: new V2(x,y)
                    })
                }

                points.forEach((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let maxyShift = getRandomInt(8,12);
                    let yShiftChange = [
                        ...easing.fast({from: 0, to: maxyShift, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: maxyShift, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                    ]

                    let maxXShift = getRandomInt(-5,5);
                    let xShiftChange = [
                        ...easing.fast({from: 0, to: maxXShift, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: maxXShift, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                    ]

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            yShift: yShiftChange[f],
                            xShift: xShiftChange[f]
                        };
                    }

                    el.levitationFrames = frames;
                
                    if(true) {
                        let closestArr = points.filter(_p => _p.p.distance(el.p) < 20);
                        el.lineToFrames = [];
                        
                        let count = getRandomInt(1,3);
                        for(let i = 0; i < closestArr.length;i++) {
                            let closest = closestArr[i];

                            let lineTo_startFrameIndex = getRandomInt(0, framesCount-1);
                            let lineTo_totalFrames = getRandomInt(60, 80);
    
                            // let vValues = [
                            //     ...easing.fast({from: 0, to: 50, steps: fast.r(lineTo_totalFrames/2), type: 'quad', method: 'in', round: 0}),
                            //     ...easing.fast({from: 50, to: 0, steps: fast.r(lineTo_totalFrames/2), type: 'quad', method: 'out', round: 0})
                            // ]

                            let aValues = [
                                ...easing.fast({from: 0, to: 0.5, steps: fast.r(lineTo_totalFrames/2), type: 'quad', method: 'in', round: 2}),
                                ...easing.fast({from: 0.5, to: 0, steps: fast.r(lineTo_totalFrames/2), type: 'quad', method: 'out', round: 2})
                            ]
    
                            for(let f = 0; f < lineTo_totalFrames; f++){
                                let frameIndex = f + lineTo_startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                if(!el.lineToFrames[frameIndex]) {
                                    el.lineToFrames[frameIndex] = []
                                }

                                el.lineToFrames[frameIndex].push({
                                    lineTo: closest,
                                    a: aValues[f] != undefined ? aValues[f] : 0
                                });
                            }
                        }
                        
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    let poligonsHelper = undefined;
                    let linesHelper = undefined;
                    let pointsHelper = undefined;
                    let poligonsImg = createCanvas(size, (ctx, size, hlp) => { poligonsHelper = {hlp, ctx, pp: new PP({ctx})}; });
                    let linesImg = createCanvas(size, (ctx, size, hlp) => { linesHelper = {hlp, ctx, pp: new PP({ctx})}; });
                    let pointsImg = createCanvas(size, (ctx, size, hlp) => { pointsHelper = { hlp, ctx}; });

                    for(let p = 0; p < points.length; p++){
                        let itemData = points[p];
                        
                        let currentP = new V2(itemData.p.x + itemData.levitationFrames[f].xShift, itemData.p.y + itemData.levitationFrames[f].yShift)
                        pointsHelper.hlp.setFillColor('white').dot(currentP);

                        if(itemData.lineToFrames && itemData.lineToFrames[f]) {
                            let cornerPoints = [currentP]
                            itemData.lineToFrames[f].forEach(ltfItem => {
                                let {lineTo, a} = ltfItem;
                                //linesHelper.pp.setFillStyle(colors.colorTypeConverter({value: [0,0, v], toType: 'hex', fromType: 'hsv'}));
                                linesHelper.pp.setFillStyle(`rgba(255,255,255, ${a})`)
                                linesHelper.pp.lineV2(
                                    currentP, 
                                    new V2(lineTo.p.x + lineTo.levitationFrames[f].xShift, lineTo.p.y + lineTo.levitationFrames[f].yShift), 
                                );

                                cornerPoints.push(new V2(lineTo.p.x + lineTo.levitationFrames[f].xShift, lineTo.p.y + lineTo.levitationFrames[f].yShift))
                            });

                            let distinctP =  distinct(cornerPoints, (p) => p.x + '_' + p.y );
                            if(distinctP.length > 2) {
                                poligonsHelper.pp.setFillStyle(`rgba(255,255,255, 0.1)`)
                                poligonsHelper.pp.fillByCornerPoints(distinctP); //.filter((el, i) => i < 3)
                            }
                            
                        }
                    }

                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(poligonsImg, 0,0);
                         ctx.drawImage(linesImg, 0,0)
                        // ctx.drawImage(pointsImg, 0,0)
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createEffectsFrames({ framesCount: 100, rowsCount: 10, columnsCount: 10, itemFrameslength: 100, size: this.size})
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 1)
    }
}