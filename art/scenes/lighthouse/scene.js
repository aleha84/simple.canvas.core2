class LighthouseScene extends Scene {
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
                size: new V2(1330, 2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'lighthouse'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){ 
        let model = LighthouseScene.models.main;
        let layersData = {};
        let exclude = [
            'light_overlay', 'light_overlay2', 'window'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        } 
        
        // this.bgOverlay = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
        //         hlp.setFillColor('rgba(0,0,0,0.5').dot(0,0)
        //     })
            
        // }), layersData.sky.renderIndex+1)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createStarsFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];

                let center = new V2(107,-25);
                let repeats = 8;
                let anglePerRepat = 360/repeats;
                let angleShiftChange = easing.fast({from: 0, to: anglePerRepat, steps: itemFrameslength, type: 'linear' });

                let radiusClamps = [5, 200];

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let a = fast.r(getRandom(0.05, 0.4),2)
                    let r = getRandomGaussian(radiusClamps[0], radiusClamps[1]*2, 2.2);
                    let initialAngle = getRandomInt(0, 359);

                    let aValues = undefined;
                    let aStartFrame = undefined;
                    if(getRandomInt(0,1) == 0){

                        let len = getRandomInt(2,6)*10;
                        aStartFrame = getRandomInt(0, itemFrameslength - len);

                        let mul = getRandom(2,3);
                        let maxA = a*mul;
                        if(maxA > 1)
                            maxA = 1;

                        aValues = [
                            ...easing.fast({from: a, to: maxA, steps: len/2, type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({from: maxA, to: a, steps: len/2, type: 'quad', method: 'inOut', round: 2})
                        ]
                    }

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let aValue = undefined;
                        if(aValues) {
                            if(f >= aStartFrame && f < aStartFrame + aValues.length){
                                aValue = aValues[f-aStartFrame]
                            }
                        }
                
                        frames[frameIndex] = {
                            aValue: aValue,
                            angleShift: angleShiftChange[f]
                        };
                    }
                
                    return {
                        r,
                        a,
                        initialAngle,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                for(let i = 0; i < repeats; i++){
                                    let p = center.add(V2.up.rotate(anglePerRepat*i + itemData.frames[f].angleShift).mul(itemData.r)).toInt()

                                    let a = itemData.a;
                                    if(itemData.frames[f].aValue){
                                        a = itemData.frames[f].aValue;
                                    }

                                    hlp.setFillColor(`rgba(255,255,255, ${a})`).dot(p)
                                }
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createStarsFrames({ framesCount: 600, itemsCount: 200, itemFrameslength: 600, size: this.size});
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.sky.renderIndex+2)

        this.light = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLightFrames({framesCount, size}) {
                let frames = [];
                
                let overlay = PP.createImage(model, { renderOnly: ['light_overlay'], forceVisivility: { 'light_overlay': { visible: true } } })
                let overlay2 = PP.createImage(model, { renderOnly: ['light_overlay2'], forceVisivility: { 'light_overlay2': { visible: true } } })

                let xClamps = [68,84];
                let topY = 104;
                let height = 10;
                let aClamps = [0.01, 0.2];
                let maxWidth = 20;

                let halfFrames = fast.r(framesCount/2)
                let xChange = easing.fast({ from: xClamps[0], to: xClamps[1], steps: framesCount, type: 'quad', method: 'inOut', round: 0 })
                let aChange = [
                    ...easing.fast({from: aClamps[0], to: aClamps[1], steps: halfFrames, type: 'quad', method: 'out', round: 2}),
                    ...easing.fast({from: aClamps[1], to: aClamps[0], steps: halfFrames, type: 'quad', method: 'in', round: 2})
                ]

                let wChange = [
                    ...easing.fast({from: 1, to: maxWidth, steps: halfFrames, type: 'linear', method: 'base', round: 2}),
                    ...easing.fast({from: maxWidth, to: 1, steps: halfFrames, type: 'linear', method: 'base', round: 2})
                ]

                let wChange2 = [
                    ...easing.fast({from: 1, to: 5, steps: halfFrames, type: 'linear', method: 'base', round: 2}),
                    ...easing.fast({from: 5, to: 1, steps: halfFrames, type: 'linear', method: 'base', round: 2})
                ]
                
                let rgbPart = '210,231,226';

                for(let f = 0; f < framesCount; f++){
                    let l1 =  createCanvas(size, (ctx, size, hlp) => {
                        if(f == 0)
                            return;

                        hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]})`).rect(
                            xChange[f]-wChange[f]/2, 
                            topY, 
                            wChange[f], 
                            height)

                        // if(wChange[f] > 3) {
                            
                        // }
                        hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]/2})`).rect(
                            xChange[f] - wChange[f]/2 + wChange[f]/4, 
                            topY, 
                            wChange[f]/2, 
                            height)

                        // if(wChange[f] > 6) {
                            
                        // }
                        hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]/2})`).rect(
                            xChange[f] - wChange[f]/3 + wChange[f]/6, 
                            topY, 
                            wChange[f]/3, 
                            height)

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(overlay, 0,0);
                    })
                    
                    let l2 =  createCanvas(size, (ctx, size, hlp) => {
                        if(f == 0)
                            return;

                        hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]})`).rect(
                            xChange[f]-wChange2[f]/2, 
                            topY, 
                            wChange2[f], 
                            height)

    
                        // hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]/2})`).rect(
                        //     xChange[f] - wChange[f]/2 + wChange[f]/4, 
                        //     topY, 
                        //     wChange[f]/2, 
                        //     height)
                        // hlp.setFillColor(`rgba(${rgbPart}, ${aChange[f]/2})`).rect(
                        //     xChange[f] - wChange[f]/3 + wChange[f]/6, 
                        //     topY, 
                        //     wChange[f]/3, 
                        //     height)

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(overlay2, 0,0);
                    })

                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.drawImage(l1, 0,0);
                        ctx.drawImage(l2, 0,0);
                    })
                }
                
                return frames;
            },
            init() {
                this.frames = this.createLightFrames({ framesCount: 300, size: this.size });
                this.registerFramesDefaultTimer({
                    animationRepeatDelayOrigin: 0, 
                    initialAnimationDelay: 0
                });
            }
        }), layersData.buildings.renderIndex+1)

        this.wAni1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let w1points = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'window'));
                let frames = [
                    createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                        let c = 'rgba(91,104,128,0.5)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                        let c = 'rgba(91,104,128,0.2)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                        let c = 'rgba(91,104,128,0)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    undefined
                ]

                let frameChangeDelay = getRandomInt(5,10) ;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = getRandomInt(5,10);
                
                    this.img = frames[getRandomInt(0, frames.length-1)]
                    this.currentFrame++;
                    if(this.currentFrame == frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), layersData.dark_l.renderIndex+1)

        this.shootingStars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible :true,
            createShootingStarsFrames({framesCount, itemsCount, itemFrameslength, size, tailLength}) {
                let frames = [];
                
                let sharedPP;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                let yoValuesCount = fast.r(tailLength/4)
                let oValues = easing.fast({from: 0.4, to: 0, steps: tailLength, type: 'quad', method: 'out'}).map(v => fast.r(v,2));
                let yOValues = easing.fast({from: 0.5, to: 0, steps: yoValuesCount, type: 'quad', method: 'out'}).map(v => fast.r(v,2));

                let wChange = easing.fast({from: tailLength, to: 0, steps: itemFrameslength, type: 'quad', method: 'out', round: 0})

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    //fast.r(framesCount*i/itemsCount) + getRandomInt(-30, 30) //
                    let totalFrames = itemFrameslength;
                
                    let points = sharedPP.lineV2(new V2(size.x, getRandomInt(5,20)), new V2(-tailLength,  getRandomInt(30, 80)));
                    let indexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            w: wChange[f],
                            index: f
                        };
                    }
                
                    return {
                        points,
                        indexValues,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let index = itemData.indexValues[itemData.frames[f].index];
                                //let point = itemData.points[index];

                                for(let i = 0; i < tailLength; i++){
                                    let _index = index-i;
                                    if(_index < 0)
                                        break;

                                    let point = itemData.points[_index];

                                    hlp.setFillColor(`rgba(255,255,255, ${oValues[i]})`).dot(point.x, point.y);
                                    // if(i < 15){
                                    //     hlp.setFillColor(`rgba(255,255,255, ${oValues[i]/5})`).dot(point.x, point.y+1).dot(point.x, point.y-1);
                                    // }

                                    // if(i < yoValuesCount){
                                    //     hlp.setFillColor(`rgba(190,239,164, ${yOValues[i]})`).dot(point.x, point.y);
                                    // }
                                }

                                // for(let i = 0; i < 4; i++){
                                //     let _index = index+i;
                                //     if(_index >= itemData.points.length)
                                //         break;
                                    
                                //     let point = itemData.points[_index];

                                //     hlp.setFillColor(`rgba(255,255,255, ${1/(i+2)})`).dot(point.x, point.y);
                                // }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createShootingStarsFrames({framesCount: 600, itemsCount: 3, itemFrameslength: 15, size: this.size, tailLength: 70});
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let repeat = 1;


                this.timer = this.regTimerDefault(10, () => {
                
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        repeat--;
                        if(repeat == 0){
                            this.parentScene.capturing.stop = true;
                        }
                    }
                    this.img = this.frames[this.currentFrame];
                })
            }
        }), layersData.sky.renderIndex+1)
    }
}