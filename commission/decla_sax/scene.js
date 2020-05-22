class DeclanSaxForestScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    

    start(){

        this.particles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticleFrames({framesCount, itemsCount, size, distanceClamps, color, startRadiusClamps}) {
                let sc = this.parentScene.sceneCenter;
                let startPoints = [];
                let frames = [];

                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.strokeEllipsis(0, 360, 0.1, sc.add(new V2(-1,0)), startRadiusClamps[0],startRadiusClamps[1], startPoints)
                })

                startPoints = distinct(startPoints, (d) => d.x+ '_' + d.y).map(p => new V2(p)).map(p => ({
                    p, 
                    d: sc.direction(p)
                }));

                let aChangeValues = easing.fast({from: 1, to: 0, steps: framesCount, type: 'quad', method: 'out'}).map(a => fast.r(a,3));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let distance = getRandomInt(distanceClamps[0],distanceClamps[1]);
                    let points = [];
                    let from = startPoints[getRandomInt(0, startPoints.length-1)];
                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        points = new PerfectPixel({ctx}).lineV2(from.p, from.p.add(from.d.mul(distance)))
                    });
                    let pointsChangeIndex = easing.fast({from: 0, to: points.length-1, steps: framesCount, type: 'quad', method: 'out'}).map(p => fast.r(p))

                    return {
                        points,
                        pointsChangeIndex,
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
                         
                            let pointIndex = pointData.pointsChangeIndex[currentIndex];
                            let point = pointData.points[pointIndex];

                            let a = aChangeValues[currentIndex];

                            hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, a], isObject: false}))
                                .dot(point.x, point.y)
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.greenblueParticles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createParticleFrames({ framesCount: 200, itemsCount: 1000, size: this. size, distanceClamps: [5,25], color: 'rgba(171,188,216,1)', startRadiusClamps: [74,74] }),
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

                this.blueParticles = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createParticleFrames({ framesCount: 100, itemsCount: 1000, size: this. size, distanceClamps: [2,6], color: 'rgba(51,50,19,1)', startRadiusClamps: [72,72] }),
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
        }), 5)

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                if(this.parentScene.debug.enabled)
                    return

                let mainHsv = [200, 0, 100];
                let rotationOriginShift =new V2(0, 0);
                let framesCount = 600
                let halfSize = new V2(this.size.x/2, this.size.y/2)

                let repeats = 4;//fast.r(360/(framesCount*rotationSpeed))
                let aChangePerRepeat = 90;
                let rotationSpeed = aChangePerRepeat/framesCount;///0.05;

                let dotsCount = 700;
                let dots = new Array(dotsCount).fill(undefined).map((_, i) => {
                    let v = getRandomInt(10, 40);
                    return {
                        p: new V2(getRandomInt( this.size.x/2, this.size.x+100), getRandomInt(-100, this.size.y/2)),
                        //hsv: [mainHsv[0], mainHsv[1], getRandomInt(10, 40)],
                        color: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v], hsvAsObject: false, hsvAsInt: true}),
                        secondaryColor: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-3], hsvAsObject: false, hsvAsInt: true}),
                        secondaryColor1: hsvToHex({hsv: [mainHsv[0], mainHsv[1], v-6], hsvAsObject: false, hsvAsInt: true})
                    }
                });

                this.frames = [];

                for(let f = 0; f < framesCount; f++){
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('black').rect(0,0,size.x, size.y)
                        // let hsv = [...mainHsv];
                        // hsv[2] = getRandomInt(10, 90);

                        //hlp.setFillColor(hsvToHex({hsv: hsv, hsvAsObject: false, hsvAsInt: true}));
                        //hlp.setFillColor('white');

                        for(let r = 0; r < repeats; r++){
                            for(let i = 0; i < dots.length; i++){
                                let dot = dots[i];
                                //hlp.setFillColor(hsvToHex({hsv: dot.hsv, hsvAsObject: false, hsvAsInt: true}));
                                hlp.setFillColor(dot.color);
                                let originalPosition = dot.p;

                                let repeated = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*f, false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt()

                                hlp.dot(repeated.x, repeated.y);


                                let repeated1 = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*(f-2), false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt();
                                    hlp.setFillColor(dot.secondaryColor).dot(repeated1.x, repeated1.y);

                                let repeated2 = originalPosition
                                    .substract(halfSize)
                                    .rotate(r*aChangePerRepeat + rotationSpeed*(f-4), false, false)
                                    .add(halfSize).add(rotationOriginShift).toInt();
                                    hlp.setFillColor(dot.secondaryColor1).dot(repeated2.x, repeated2.y);

                            }
                        }
                        
                    })
                }

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];

                this.timer = this.regTimerDefault(15, () => {
    
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        // if(!this.redFrame){
                        //     this.redFrame = this.addChild(new GO({
                        //         position: new V2(),
                        //         size: this.size,
                        //         img: createCanvas(this.size, (ctx, size, hlp) => {
                        //             hlp.setFillColor('red').rect(0,0, 50, 50)
                        //         })
                        //     }));
                        // }
                        // else {
                        //     this.removeChild(this.redFrame);
                        //     this.redFrame = undefined;
                        // }
                    }
                })
            }
        }), 0)

        this.sphere = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(150,150),
            img: PP.createImage(DeclanSaxForestScene.models.main),
            init() {
                //#7996b4
                //#6b88af

                let targetColor = '#7996b4'.toLowerCase();
                let hideColor = '#7da3df';
                let targetPoints = [];
                DeclanSaxForestScene.models.main.main.layers.forEach(layer => {
                    layer.groups.forEach(group => {
                        if(group.strokeColor.toLowerCase() == targetColor){
                            targetPoints.push(...group.points.map(p => new V2(p.point)))
                        }
                    });
                });

                targetColor = '#6b88af'.toLowerCase();
                DeclanSaxForestScene.models.main.main.layers.forEach(layer => {
                    layer.groups.forEach(group => {
                        if(group.strokeColor.toLowerCase() == targetColor){
                            targetPoints.push(...group.points.map(p => new V2(p.point)))
                        }
                    });
                });

                let frames = [];
                let framesCount = 100;
                let itemsCount = targetPoints.length;
                
                let itemsData = targetPoints.map((el, i) => {
                    let hideLength = getRandomInt(10,15);
                    let hideFrom = getRandomInt(0, framesCount-1);
                    let hideTo = hideFrom + hideLength;
                    let hideFrames = [];
                    if(hideTo > (framesCount-1)){
                        hideTo-=framesCount;
                        for(let i = hideFrom; i < framesCount; i++)
                            hideFrames.push(i);
                        for(let i = 0; i <= hideTo; i++)
                            hideFrames.push(i);
                    }
                    else {
                        for(let i = hideFrom; i <= hideTo; i++)
                            hideFrames.push(i);
                    }

                    return {
                        p: el,
                        hideFrames,
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                             let pointData = itemsData[p];
                            
                            // let currentIndex = pointData.initialIndex + f;
                            // if(currentIndex > (framesCount-1)){
                            //     currentIndex-=framesCount;
                            // }
                            
                            hlp.setFillColor(hideColor);

                            if(pointData.hideFrames.indexOf(f) != -1){
                                hlp.dot(pointData.p.x, pointData.p.y);
                            }
                        }
                    });
                }

                //console.log(targetPoints);

                this.addChild(new GO({
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
                }))
            }
        }), 10)

        this.sphere = this.addGo(new GO({
            position: new V2(170, 190),
            size: new V2(40,20),
            img: PP.createImage(DeclanSaxForestScene.models.signature),
        }), 15) 
    }
    
}