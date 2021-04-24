class Procgen5Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(2000,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'procgen5'
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
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('#000').dot(0,0);
            })
        }), 0)

        let createParticleFrames = function({
            framesCount, 
            itemsCount, 
            itemFrameslength, 
            darkOverlayMinOpacity = 0,
            darkOverlayMidOpacity,
            darkOverlayMaxOpacity,
            maxSize,
            maxYShift,
            size, 
            marginY,
            xMarginClamps,
            invert = false,
            disableYShiftChange = false,
        }) {
            let frames = {
                normal: [],
                reverse: []
            };
            
            let statesDirGoLeft = [
                {
                    r: [{x: 0, o: 1}],
                    g: [{x: 0, o: 1}],
                    b: [{x: 0, o: 1}]
                },
                {
                    r: [{x: 0, o: 1}, {x: 1, o: 0.5}],
                    g: [{x: 0, o: 1}],
                    b: [{x: 0, o: 1}]
                },
                {//3
                    r: [{x: 1, o: 1}, {x: 2, o: 0.5}],
                    g: [{x: 1, o: 1}],
                    b: [{x: 0, o: 0.5}, {x: 1, o: 1}]
                },
                {//4
                    r: [{x: 1, o: 0.5}, {x: 2, o: 1}, {x: 3, o: 0.5}],
                    g: [{x: 1, o: 1},{x: 2, o: 1}],
                    b: [{x: 0, o: 0.5}, {x: 1, o: 1},{x: 2, o: 0.5}]
                },
                { //5
                    r: [{x: 2, o: 0.5}, {x: 3, o: 1}, {x: 4, o: 0.5}],
                    g: [{x: 1, o: 0.5}, {x: 2, o: 1}, {x: 3, o: 0.5}],
                    b: [{x: 0, o: 0.5}, {x: 1, o: 1}, {x: 2, o: 0.5}]
                },
                { //6
                    r: [{x: 2, o: 0.5}, {x: 3, o: 1},{x: 4, o: 1}, {x: 5, o: 0.5}],
                    g: [{x: 2, o: 1}, {x: 3, o: 1}],
                    b: [{x: 0, o: 0.5}, {x: 1, o: 1}, {x: 2, o: 1}, {x: 4, o: 0.5}]
                },
            ]

            let data = [];
            // let darkOverlayMinOpacity = 0.25;
            // let darkOverlayMaxOpacity = 0.75;

            // let maxSize = 5
            // let maxYShift = 20

            let darkOverlayOpacityValues = [
                ...easing.fast({from: darkOverlayMidOpacity, to: darkOverlayMinOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2}),
                ...easing.fast({from: darkOverlayMinOpacity, to: darkOverlayMidOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2})
            ]

            let reverse_darkOverlayOpacityValues = [
                ...easing.fast({from: darkOverlayMidOpacity, to: darkOverlayMaxOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2}),
                ...easing.fast({from: darkOverlayMaxOpacity, to: darkOverlayMidOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2})
            ]
            
            let sizeValues = [
                ...easing.fast({from: 1, to: maxSize, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({from: maxSize, to: 1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0})
            ]

            

            let y1 = marginY;
            let y2 = size.y - marginY;
            let height = y2 - y1;

            let maxMargin = xMarginClamps[1]//85;
            let minMargin = xMarginClamps[0]//20;

            let marginXValues = [
                ...easing.fast({from: maxMargin, to: minMargin, steps: fast.r(height/2), type: 'cubic', method: 'out', round: 0}),
                ...easing.fast({from: minMargin, to: maxMargin, steps: fast.r(height/2), type: 'cubic', method: 'in', round: 0})
            ]

            let maxYShiftValues = [
                ...easing.fast({from: 1, to: maxYShift, steps: fast.r(height/2), type: 'cubic', method: 'out', round: 0}),
                ...easing.fast({from: maxYShift, to: 1, steps: fast.r(height/2), type: 'cubic', method: 'in', round: 0})
            ]

            // let marginX = margin.x || margin;
            // let marginY = margin.y || margin;

            // let x1 = marginX
            // let x2 = size.x - marginX;

           
            
            // let xValues = easing.fast({from: x1, to: x2, steps: itemFrameslength, type: 'sin', method: 'inOut', round: 0});

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength//getRandomInt(itemFrameslengthClamps);
            
                let y = getRandomInt(y1, y2)
                let marginX = marginXValues[y - marginY];

                let x1 = marginX
                let x2 = size.x - marginX;

                if(invert) {
                    x1 = size.x - marginX;
                    x2 = marginX;
                }

                let xValues = easing.fast({from: x1, to: x2, steps: itemFrameslength, type: 'sin', method: 'inOut', round: 0});

                let _maxYShift = maxYShiftValues[y - marginY]
                if(disableYShiftChange) {
                    _maxYShift = maxYShift;   
                }

                let yShiftValues = [
                    ...easing.fast({from: 0, to: _maxYShift, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: _maxYShift, to: 1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'in', round: 0})
                ]

                if(data.find(d => d.y == y && Math.abs(startFrameIndex - d.startFrameIndex) < 15))
                    return { frames: [] }

                data[data.length] = { y, startFrameIndex }


                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        size: sizeValues[f] != undefined ? sizeValues[f] : 1,
                        do: darkOverlayOpacityValues[f] != undefined ? darkOverlayOpacityValues[f] : darkOverlayMinOpacity,
                        x: xValues[f],
                        yShift: yShiftValues[f]
                    };
                }

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex + totalFrames;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        reverse: true,
                        size: sizeValues[f] != undefined ? sizeValues[f] : 1,
                        do: reverse_darkOverlayOpacityValues[f] != undefined ? reverse_darkOverlayOpacityValues[f] : darkOverlayMinOpacity,
                        x: xValues[xValues.length-1-f],
                        yShift: -fast.r(yShiftValues[f]*0.75) 
                    };
                }
            
                return {
                    y,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){

                // let propName = 'normal';
                // if(f >= itemFrameslength) {
                //     propName = 'reverse'
                // }

                let normal = [];
                let reverse = [];

                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];

                    if(itemData.frames[f]){
                        if(itemData.frames[f].reverse) {
                            reverse[reverse.length] = itemData
                        }
                        else {
                            normal[normal.length] = itemData
                        }
                    }
                }

                let render = function(ctx, hlp, itemData) {
                    let state = statesDirGoLeft[itemData.frames[f].size];
                    let x = itemData.frames[f].x
                    let y = itemData.y+itemData.frames[f].yShift;

                    let dir = 1;
                    if(itemData.frames[f].reverse) {
                        dir = -1;
                        //y -= itemData.frames[f].yShift
                    }
                    else {
                        //y += itemData.frames[f].yShift
                    }

                    if(invert){
                        dir*=-1;
                    }

                    ctx.globalCompositeOperation = 'source-over';
                    state.r.forEach(el => {
                        hlp.setFillColor(`rgba(255,0,0,${el.o})`).dot(x+el.x*dir, y)
                    });

                    ctx.globalCompositeOperation  = 'exclusion'

                    state.g.forEach(el => {
                        hlp.setFillColor(`rgba(0,255,0,${el.o})`).dot(x+el.x*dir, y)
                    });
                    state.b.forEach(el => {
                        hlp.setFillColor(`rgba(0,0,255,${el.o})`).dot(x+el.x*dir, y)
                    });


                    ctx.globalCompositeOperation = 'source-over';
                    hlp.setFillColor(`rgba(0,0,0,${itemData.frames[f].do})`)


                    let r = itemData.frames[f].reverse;
                    if(invert){
                        r = !r;
                    }

                    if(r)
                        hlp.rect(x-itemData.frames[f].size, y, itemData.frames[f].size+1, 1)
                    else 
                        hlp.rect(x, y, itemData.frames[f].size+1, 1)
                }

                frames.normal[f] = createCanvas(size, (ctx, size, hlp) => {
                    normal.forEach(el => {
                        render(ctx, hlp, el)
                    })
                })

                frames.reverse[f] = createCanvas(size, (ctx, size, hlp) => {
                    reverse.forEach(el => {
                        render(ctx, hlp, el)
                    })
                })
            }
            
            return frames;
        }

        let framesOuter = createParticleFrames(
            { 
                framesCount: 120, 
                itemsCount: 250, 
                itemFrameslength: 60, 
                size: this.viewport, 
                //margin: {x: 30, y: 30},
                marginY: 20,
                darkOverlayMidOpacity: 0.25,
                darkOverlayMaxOpacity: 0.75,
                maxSize:5,
                maxYShift: 20,
                xMarginClamps: [60, 20],
                disableYShiftChange: true
            })

            let framesInner = createParticleFrames(
                { 
                    framesCount: 480, 
                    itemsCount: 300, 
                    itemFrameslength: 240, 
                    size: this.viewport, 
                    //margin: {x: 30, y: 30},
                    marginY: 70,
                    darkOverlayMinOpacity: 0.4,
                    darkOverlayMidOpacity: 0.6,
                    darkOverlayMaxOpacity: 0.8,
                    maxSize:3,
                    maxYShift: 10,
                    xMarginClamps: [70, 95],
                    invert: true
                })
        
        this.outerReverse = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: framesOuter.reverse,
            init() {
                this.registerFramesDefaultTimer({
                });
                
            }
        }), 1)

        this.outerNormal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: framesOuter.normal,
            init() {
                this.registerFramesDefaultTimer({
                });
                
            }
        }), 4)

        this.innerReverse = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: framesInner.reverse,
            init() {
                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = '1'
                    },
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
                
                let totalFrames = 480;
                let currentFrame = 0;
                let yClamps = [60,140];
                let yValues = [
                    ...easing.fast({from: yClamps[0], to: yClamps[1], steps: totalFrames/2, type: 'sin', method: 'inOut', round: 0}),
                    ...easing.fast({from: yClamps[1], to: yClamps[0], steps: totalFrames/2, type: 'sin', method: 'inOut', round: 0})
                ]

                this.position.y = yValues[currentFrame];
                
                this.timer2 = this.regTimerDefault(10, () => {
                    currentFrame++;
                    if(currentFrame == this.frames.length){
                        currentFrame = 0;
                    }

                    this.position.y = yValues[currentFrame];
                    this.needRecalcRenderProperties = true;
                })

            }
        }), 2)

        this.innerNormal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: framesInner.normal,
            init() {
                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let foo = '1'
                    },
                });
                
                let totalFrames = 480;
                let currentFrame = 0;
                let yClamps = [60,140];
                let yValues = [
                    ...easing.fast({from: yClamps[0], to: yClamps[1], steps: totalFrames/2, type: 'sin', method: 'inOut', round: 0}),
                    ...easing.fast({from: yClamps[1], to: yClamps[0], steps: totalFrames/2, type: 'sin', method: 'inOut', round: 0})
                ]

                this.position.y = yValues[currentFrame];
                
                this.timer2 = this.regTimerDefault(10, () => {
                    currentFrame++;
                    if(currentFrame == this.frames.length){
                        currentFrame = 0;
                    }

                    this.position.y = yValues[currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            }
        }), 3)
    }
}