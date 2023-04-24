class LadaScene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'LoneLada',
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
        let model = LadaScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'tvZone', 'p', 'extra_w'
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

        this.snow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSnowFrames({framesCount, itemsCount, size,
                gradientDots, direction, xClamps
            }) {
                let itemFrameslength = framesCount;
                let frames = [];
                // let bottomLine = createLine(new V2(-size.x*2, size.y), new V2(size.x*2, size.y));
                // let sharedPP = PP.createNonDrawingInstance();

                //let direction = V2.down.rotate(angle)//(getRandomInt(angleClamps[0], angleClamps[1]));

                let etalonDestination = raySegmentIntersectionVector2(
                    new V2(), direction, {begin: new V2(-2*this.size.x, this.size.y), end: new V2(3*this.size.x, this.size.y)});
                //let distance = new V2().distance(etalonDestination);
                let deltaPerFrameV2 = etalonDestination.divide(framesCount);

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let dot = new V2(getRandomInt(xClamps), 0)
                    
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let p = dot.add(deltaPerFrameV2.mul(f)).toInt();
                        let a = 0;
                        if(gradientDots[p.y] && gradientDots[p.y][p.x]) 
                            a = fast.r(gradientDots[p.y][p.x], 2);
                
                        frames[frameIndex] = {
                            p, a
                        };
                    }
                
                    return {
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let a = itemData.frames[f].a;
                                let p = itemData.frames[f].p;
                                
                                if(p.y > 164)
                                    continue

                                hlp.setFillColor('rgba(213, 181, 161, '+ a + ')').dot(p)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let setter = (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                        dot.maxValue = aValue;
                    }
    
                    if(aValue > dot.maxValue)
                        dot.maxValue = aValue;
    
                    dot.values.push(aValue);
                };

                let yShift = 5;
                let gradientDots1 = colors.createRadialGradient({ size: this.size, center: new V2(40,75-yShift), radius: new V2(40,50), gradientOrigin: new V2(45,28), angle: 15,
                    setter : setter} )

                let gradientDots2 = colors.createRadialGradient({ size: this.size, center: new V2(74,70-yShift), radius: new V2(35,50), gradientOrigin: new V2(74,25), angle: 0,
                    setter : setter })

                let gradientDots3 = colors.createRadialGradient({ size: this.size, center: new V2(100,75-yShift), radius: new V2(40,50), gradientOrigin: new V2(95,27), angle: -15,
                    setter : setter })


                let gradientDots1_a = colors.createRadialGradient({ size: this.size, center: new V2(45,28), radius: new V2(20,20), gradientOrigin: new V2(45,28), angle: 0,
                    setter : setter} )

                let gradientDots2_a = colors.createRadialGradient({ size: this.size, center: new V2(74,25), radius: new V2(20,20), gradientOrigin: new V2(74,25), angle: 0,
                    setter : setter })

                let gradientDots3_a = colors.createRadialGradient({ size: this.size, center: new V2(95,27), radius: new V2(20,20), gradientOrigin: new V2(95,27), angle: 0,
                    setter : setter })

                //console.log(gradientDots1)
                let defaultA = 0.05;
                let gradientDots = [];
                let alphaStepToRenter = 0.5
                let img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < size.y; y++) {
                        gradientDots[y] = [];
                        for(let x = 0; x < size.x; x++) {
                            let g1 = gradientDots1[y] ? (gradientDots1[y][x] != undefined ? gradientDots1[y][x].maxValue : defaultA) : defaultA;
                            let g2 = gradientDots2[y] ? (gradientDots2[y][x] != undefined ? gradientDots2[y][x].maxValue : defaultA) : defaultA;
                            let g3 = gradientDots3[y] ? (gradientDots3[y][x] != undefined ? gradientDots3[y][x].maxValue : defaultA) : defaultA;

                            let a = Math.max(g1, g2, g3);
                            gradientDots[y][x] = a;

                            
                            let g1_a = gradientDots1_a[y] ? (gradientDots1_a[y][x] != undefined ? gradientDots1_a[y][x].maxValue : 0) : 0;
                            let g2_a = gradientDots2_a[y] ? (gradientDots2_a[y][x] != undefined ? gradientDots2_a[y][x].maxValue : 0) : 0;
                            let g3_a = gradientDots3_a[y] ? (gradientDots3_a[y][x] != undefined ? gradientDots3_a[y][x].maxValue : 0) : 0;

                            let alpha = fast.r(Math.max(g1_a, g2_a, g3_a)/2,2);

                            // let alpha = 0;
                            // if(a > alphaStepToRenter) {
                            //     alpha = fast.r(a - alphaStepToRenter, 2);
                            // }
                            hlp.setFillColor(`rgba(255,255,255,${alpha})`).dot(x,y)
                        }
                    }
                })

                this.img = img;

                //let frames = []
                this.snowflakesLayers = [];
                for(let i = 0; i < 10; i++){
                    let rotate = getRandomInt(0,45);
                    let xClamps = [-this.size.x, this.size.x];
                    if(rotate > 0){
                        xClamps = [0, this.size.x*2];
                    }

                    let frames = this.createSnowFrames({ framesCount: 200*getRandomInt(2,3), 
                        direction: V2.down.rotate(rotate), itemsCount: 150, xClamps: xClamps, gradientDots, size: this.size })

                    this.snowflakesLayers.push(this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames,
                        init() {
                            this.registerFramesDefaultTimer({});
                        }
                    })))
                }

            }
        }), layersData.lamp.renderIndex+1)

        this.tv = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let w1points = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tvZone'));
                let frames = [
                    createCanvas(this.size, (ctx, size, hlp) => {//let white = 
                        let c = 'rgba(0,0,0,0.2)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                        let c = 'rgba(0,0,0,0.1)';
                        hlp.setFillColor(c);
                        w1points.forEach(wp => {
                            hlp.dot(wp.point);
                        })
                    }),
                    undefined
                    // createCanvas(this.size, (ctx, size, hlp) => { //let black = 
                    //     let c = 'rgba(255,255,255,0.05)';
                    //     hlp.setFillColor(c);
                    //     w1points.forEach(wp => {
                    //         hlp.dot(wp.point);
                    //     })
                    // }),
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
        }), layersData.house_bg.renderIndex+1)

        this.p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: [50, 100], size: this.size,
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p'))
                     })

                let counter = 3;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        if(counter-- == 0) 
                            this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.car1.renderIndex+1)

        this.extra_w = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                let img = PP.createImage(model, { renderOnly: 'extra_w' })

                let delayCount = 300;
                
                this.timer = this.regTimerDefault(10, () => {
                    delayCount--;
                    if(delayCount == 0){
                        if(this.img == undefined) {
                            this.img = img;
                        }
                        else {
                            this.img = undefined
                        }
                        delayCount = 300;
                    }

                })
            }
        }), layersData.house_bg.renderIndex+1)
    }
}