class Demo10DarknessRiverScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 7,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'river'
            },
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
        
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor('black').dot(0,0);
                })
            }
        }), 1)

        this.particles = this.addGo(new GO(
            {
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
           createParticlesFrames({framesCount, itemsCount, itemFrameslength, yShift, size}) {
                let frames = [];
               
                

                let oValues = [
                    ...easing.fast({from: 0, to: 0.2, steps: itemFrameslength/2, type: 'quad', method: 'inOut' }).map(v => fast.r(v,2)),
                    ...easing.fast({from: 0.2, to: 0, steps: itemFrameslength/2, type: 'quad', method: 'inOut' }).map(v => fast.r(v,2))
                ]

                let yShiftValues = easing.fast({from: 0, to: yShift, steps: itemFrameslength, type: 'linear', method: 'base' }).map(v => fast.r(v))

               let itemsData = new Array(itemsCount).fill().map((el, i) => {
                   let startFrameIndex = getRandomInt(0, framesCount-1);
                   let totalFrames = itemFrameslength;
               
                   let x = fast.r(getRandomGaussian(-size.x, 2*size.x));
                   let y = fast.r(getRandomInt(0, size.y));

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
                       frames
                       ,x,y
                   }
               })
               
               for(let f = 0; f < framesCount; f++){
                   frames[f] = createCanvas(size, (ctx, size, hlp) => {
                       for(let p = 0; p < itemsData.length; p++){
                           let itemData = itemsData[p];
                           
                           if(itemData.frames[f]){
                               let index = itemData.frames[f].index;
                                hlp.setFillColor(`rgba(255,255,255, ${oValues[index]})`).dot(itemData.x, itemData.y - yShiftValues[index])
                           }
                           
                       }
                   });
               }
               
               return frames;
           },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 100, itemsCount: 200, itemFrameslength: 50, yShift: 10, size: this.size});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })

                
            }
        }), 5);

        this.fallingDrops = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createDropsFrames({framesCount, itemsCount, itemFrameslength, size, tailLength, circleFramesCount}) {
                let frames = [];
                let center = size.divide(2).toInt();
                let maxR = size.y*2;
                let sharedPP = undefined;

                

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })
                
                let opacityValues = easing.fast({from: 1, to: 0.2, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v,2));
                let tailLengthValues = easing.fast({from: tailLength, to: 1, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v));

                let circlesData = [];
                let circlesMaxR = 8;

                let circlesOpacityValues = easing.fast({from: 0.15, to: 0, steps: circleFramesCount, type: 'cubic', method: 'out'}).map(v => fast.r(v,2));
                let circlesYShift = easing.fast({from: 0, to: -15, steps: circleFramesCount, type: 'linear', method: 'base'}).map(v => fast.r(v));


                // let circlesImages = Demo10DarknessRiverScene.models.circles.map((model,i) => {
                //     if(model == undefined)
                //         return undefined;

                //     return PP.createImage(model, { colorsSubstitutions: { '#FF0000': { color: '#ffffff',  } } })
                // })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {

                    let x = fast.r(getRandomGaussian(-size.x, 2*size.x));
                    let y = fast.r(getRandomInt(0, size.y));

                    let target = new V2(x,y);
                    let direction = center.direction(target);
                    let from = target.add(direction.mul(maxR)).toInt();
                    let points = sharedPP.lineV2(from, target);
                    let indexValues = easing.fast({from: 0, to: points.length-1, steps: itemFrameslength, type: 'sin', method: 'out'}).map(v => fast.r(v));

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

                    let circlesStartFrameIndex = startFrameIndex + totalFrames;
                    totalFrames = circleFramesCount;

                    let circlesRValues = easing.fast({from: 1, to: getRandomInt(circlesMaxR/2, circlesMaxR), steps: circleFramesCount, type: 'quad', method: 'out'}).map(v => fast.r(v));

                    let circleFrames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + circlesStartFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        circleFrames[frameIndex] = {
                            index: f
                        };
                    }

                    circlesData.push({
                        frames: circleFrames,
                        circlesRValues,
                        p: target,
                    })
                
                    return {
                        indexValues, 
                        points,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {

                        for(let p = 0; p < circlesData.length; p++){
                            let itemData = circlesData[p];
                            if(itemData.frames[f]){
                                let index = itemData.frames[f].index;
                                let r = itemData.circlesRValues[index];
                                let opacity = circlesOpacityValues[index];

                                let circleImage = PP.createImage(Demo10DarknessRiverScene.models.circles[r], { colorsSubstitutions: { '#FF0000': { color: '#ffffff', opacity  } } })
                                //hlp.setFillColor(`rgba(255,255,255, ${opacity})`).strokeEllipsis(0, 360, 5, itemData.p.add(new V2(0, circlesYShift[index])), r,r, undefined, true);
                                ctx.drawImage(circleImage, itemData.p.x - r, itemData.p.y - r + circlesYShift[index])

                                // if(r > 1) {
                                //     let circleImage = PP.createImage(Demo10DarknessRiverScene.models.circles[r-1], { colorsSubstitutions: { '#FF0000': { color: '#ffffff', opacity: opacity/2  } } })
                                //     ctx.drawImage(circleImage, itemData.p.x - (r-1), itemData.p.y - (r-1) + circlesYShift[index])
                                    
                                // }
                            }
                        }

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let index = itemData.frames[f].index;
                                let tailLength = tailLengthValues[index];
                                let opacityValue = opacityValues[index];
                                let pointIndexValue = itemData.indexValues[index];
                                let oValues = tailLength > 1 
                                    ? easing.fast({from: opacityValue, to: 0, steps: tailLength, type: 'quad', method: 'in'}).map(v => fast.r(v,2))
                                    :[opacityValue];
                                for(let i = 0; i < tailLength; i++){
                                    let pointIndex = pointIndexValue-i;
                                    if(pointIndex >= 0){
                                        let point = itemData.points[pointIndex];

                                        let opacity = oValues[i];
                                        hlp.setFillColor(`rgba(255,255,255, ${opacity})`).dot(point.x, point.y);
                                    }
                                    
                                }
                            }
                            
                        }
                    });
                }
                
                console.log('drops frames created: ' + framesCount)

                return frames;
            },
            init() {
                this.frames = this.createDropsFrames({framesCount: 200, itemsCount: 500, itemFrameslength: 100, circleFramesCount: 50, size: this.size, tailLength: 40})

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 10)

    }
}