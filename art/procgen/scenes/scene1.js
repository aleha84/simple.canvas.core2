class Procgen1Scene extends Scene {
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
                fileNamePrefix: 'procgen1'
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

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticleFrames({framesCount, itemsCount, itemFrameslength, size, margin}) {
                let frames = [];
                
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
                let darkOverlayMinOpacity = 0.25;
                let darkOverlayMaxOpacity = 0.75;
                let darkOverlayOpacityValues = [
                    ...easing.fast({from: darkOverlayMinOpacity, to: 0, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2}),
                    ...easing.fast({from: 0, to: darkOverlayMinOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2})
                ]

                let reverse_darkOverlayOpacityValues = [
                    ...easing.fast({from: darkOverlayMinOpacity, to: darkOverlayMaxOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2}),
                    ...easing.fast({from: darkOverlayMaxOpacity, to: darkOverlayMinOpacity, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 2})
                ]
                
                let sizeValues = [
                    ...easing.fast({from: 1, to: statesDirGoLeft.length-1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: statesDirGoLeft.length-1, to: 1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0})
                ]

                let maxYShift = 20
                let yShiftValues = [
                    ...easing.fast({from: 0, to: maxYShift, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'out', round: 0}),
                    ...easing.fast({from: maxYShift, to: 1, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'in', round: 0})
                ]

                let x1 = margin//getRandomInt(margin, size.x - margin)
                let x2 = size.x - margin;//getRandomInt(size.x - xMarginClamps[1], size.x-xMarginClamps[1])
                
                let xValues = easing.fast({from: x1, to: x2, steps: itemFrameslength, type: 'sin', method: 'inOut', round: 0});

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength//getRandomInt(itemFrameslengthClamps);
                
                    
                    let y = getRandomInt(margin, size.y - margin)

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
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
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

                                if(itemData.frames[f].reverse)
                                    hlp.rect(x-itemData.frames[f].size, y, itemData.frames[f].size+1, 1)
                                else 
                                    hlp.rect(x, y, itemData.frames[f].size+1, 1)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {

                this.frames = this.createParticleFrames({ framesCount: 140, itemsCount: 250, itemFrameslength: 70, size: this.size, margin: 30 })
                this.registerFramesDefaultTimer({
                    // framesChangeCallback: () => {
                    //     let foo = '1'
                    // },
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 1)
    }
}