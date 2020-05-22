class BlastingCompanyNostalgiaScene extends Scene {
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
        let mirrorItemsFrames = [];

        this.leafs = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            proportions(prop1, prop2, value){
                let koef = (prop1[1]-prop1[0])/(value-prop1[0]);
                return prop2[0] + (prop2[1]-prop2[0])/koef;
            },
            createRainFrames3({framesCount, itemsCount, size, color, framesPerDropClamps, lengthClamps, mirrorFrames}) {
                let frames = [];

                if(typeof(color) == 'string')
                    color = colors.rgbStringToObject({value: color, asObject: true});
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    
                    let x = getRandomInt(10, 140);
                    //let start = new V2(, -lengthClamps[0]);
                    let startY = getRandomInt(-lengthClamps[0]*2, -lengthClamps[0]);

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(framesPerDropClamps[0], framesPerDropClamps[1]);
                    let yValues = easing.fast({from: startY, to: size.y, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                    let length = getRandomInt(lengthClamps[0], lengthClamps[1]);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let y = yValues[f]
                        frames[frameIndex] = {
                            y
                        };
                    }

                    let upperOpacityValues = easing.fast({from: color.opacity, to: color.opacity/3, steps: fast.r(length*3/4), type: 'quad', method: 'in' }).map(v => fast.r(v,2))
                    let bottomOpacityValues = easing.fast({from: color.opacity, to: color.opacity/3, steps: fast.r(length*1/4), type: 'quad', method: 'out' }).map(v => fast.r(v,2))

                    return {
                        x,
                        upperOpacityValues,
                        bottomOpacityValues,
                        length,
                        frames
                    }
                })
                let mirrorFramesYLine = 110;
                for(let f = 0; f < framesCount; f++){
                    let mirrorFramesDots = [];

                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            
                            if(itemData.frames[f]){
                                let y = itemData.frames[f].y
                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, color.opacity], isObject: false}))
                                .dot(itemData.x, y)
                                //.rect(itemData.x, y, 1, itemData.length)
                                if(y < mirrorFramesYLine){
                                    mirrorFramesDots.push(new V2(itemData.x, y))
                                }

                                let l = fast.r(itemData.length*3/4);
                                for(let i = 0 ; i < l; i++){
                                    let opacity = itemData.upperOpacityValues[i];
                                    let _y = y-i-1
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false})).dot(itemData.x, _y)

                                    if(_y < mirrorFramesYLine){
                                        mirrorFramesDots.push(new V2(itemData.x, _y))
                                    }
                                }

                                l = fast.r(itemData.length*1/4);
                                for(let i = 0 ; i < l; i++){
                                    let opacity = itemData.bottomOpacityValues[i];
                                    let _y = y+i+1;
                                    hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false})).dot(itemData.x, _y)

                                    if(_y < mirrorFramesYLine){
                                        mirrorFramesDots.push(new V2(itemData.x, _y))
                                    }
                                }
                            }

                            
                            
                        }
                    });

                    if(mirrorFrames){
                        mirrorFrames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let i = 0; i < mirrorFramesDots.length; i++){
                                let dot = mirrorFramesDots[i];
                                dot.y = (mirrorFramesYLine - dot.y) +mirrorFramesYLine;

                                hlp.setFillColor('rgba(0,0,0,0.05)').dot(dot.x, dot.y);
                            }
                        })
                    }
                }
                
                return frames;
            },
            createRainFrames2({framesCount, itemsCount, size, color, angleClamps, framesPerDropClamps, lengthClamps}) {
                let frames = [];

                //let framesPerDropClamps = [10,20];
                //let angleClamps = [5, 10];
                //let lengthClamps = [20, 10];
                
                // let yClamps = [-8*size.y, size.y];
                // let heightClamps = [25,30];
                // let color = '#9aa3a8';

                let bottomLine = createLine(new V2(-2*size.x, size.y), new V2(2*size.x, size.y));

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    
                    let start = new V2(getRandomInt(30, 170), -30);
                    let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                    let end = raySegmentIntersectionVector2(start, direction, bottomLine);
                    let points = [];
                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        points = new PerfectPixel({ctx}).lineV2(start, end);
                    })

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(framesPerDropClamps[0], framesPerDropClamps[1]);
                    let indexValues = easing.fast({from: 0, to: points.length, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));

                    let length = this.proportions(framesPerDropClamps, lengthClamps, totalFrames);

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let index = indexValues[f]//points[indexValues[f]];
                        frames[frameIndex] = {
                            index
                        };
                    }

                    return {
                        length,
                        points,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsCount; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let startIndex = itemData.frames[f].index;
                                
                                for(let i = 0; i < itemData.length; i++){
                                    let index = startIndex + i;
                                    let point = itemData.points[index];
                                    if(point){
                                        hlp.setFillColor(color).dot(point.x, point.y);
                                    }
                                }

                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createRainFrames({framesCount, itemsCount, size, color, heightClamps, yClamps, opacity}) {
                let frames = [];
                
                // let yClamps = [-8*size.y, size.y];
                // let heightClamps = [25,30];
                // let color = '#9aa3a8';

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startY = getRandomInt(yClamps[0]-(size.y/2), yClamps[0]+(size.y/2));
                    return {
                        x: getRandomInt(0, size.x),
                        height: getRandomInt(heightClamps[0], heightClamps[1]),
                        yValues: easing.fast({from: startY, to: yClamps[1], steps: framesCount, type: 'linear', method: 'base'}).map(v => fast.r(v)),
                        initialIndex: getRandomInt(0, framesCount-1)
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        ctx.globalAlpha = opacity;
                        for(let p = 0; p < itemsCount; p++){
                            let pointData = itemsData[p];
                            
                            let currentIndex = pointData.initialIndex + f;
                            if(currentIndex > (framesCount-1)){
                                currentIndex-=framesCount;
                            }
                            
                            let y = pointData.yValues[currentIndex];
                            hlp.setFillColor(color).rect(pointData.x, y, 1, pointData.height)
                        }
                    });
                }
                
                return frames;
            },
            init() {

                let size = this.size;

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size,
                    img: PP.createImage(BlastingCompanyNostalgiaScene.models.main2, { renderOnly: ['leafs_cloned', 'leafs', 'leafs_d']})
                }))

                this.leafsAnimation = this.addChild(new GO({
                    position: new V2(),
                    size,
                    createLeafsFrames({framesCount, itemsImages, size, framesLengthClamps }) {
                        let frames = [];
                        let itemsCount = itemsImages.length;

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(framesLengthClamps[0], framesLengthClamps[1]);

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
        
                                frames[frameIndex] = true
                            }

                            return {
                                img: itemsImages[i],
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsCount; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.img, 0,0)
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {

                        BlastingCompanyNostalgiaScene.models.leafs_d.main.layers.forEach(l => l.visible = true)

                        let leafsImages = BlastingCompanyNostalgiaScene.models.leafs_d.main.layers.map(
                            l => PP.createImage(BlastingCompanyNostalgiaScene.models.leafs_d, {renderOnly: [l.name]}));

                        this.frames = this.createLeafsFrames({framesCount: 500, itemsImages: leafsImages, size: this.size, framesLengthClamps: [10,15]})

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

                let frMul = 1.5
                let rainLayers = [
                    { framesCount: 1000, itemsCount: 1000, size, color: 'rgba(90,91,93, 0.3)', lengthClamps: [20,25],framesPerDropClamps: [20,25].map(v => fast.r(v*frMul)),mirrorFrames: mirrorItemsFrames },
                    { framesCount: 1000, itemsCount: 400, size, color: 'rgba(154,163,168, 0.3)', lengthClamps: [30,35],framesPerDropClamps: [16,19].map(v => fast.r(v*frMul))  },
                    { framesCount: 1000, itemsCount: 200, size, color: 'rgba(175,185,191, 0.4)', lengthClamps: [40,45],framesPerDropClamps: [10,15].map(v => fast.r(v*frMul)) },
                ]


                this.rain = rainLayers.map(layer => this.addChild(new GO({
                    position: new V2(),
                    size,
                    frames: this.createRainFrames3(layer),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;

                        //         if(!this.redFrame){
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
                })))

            }
        }), 1)

        this.girl = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(BlastingCompanyNostalgiaScene.models.main2, { exclude: ['leafs_cloned', 'leafs', 'leafs_d']}),
                    init() {
                        this.mirrorerDrops = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames: mirrorItemsFrames,
                            init() {
                                BlastingCompanyNostalgiaScene.models.main2.main.layers.filter(l => l.name == 'mirroresZone')[0].visible = true;
                                this.mask = PP.createImage(BlastingCompanyNostalgiaScene.models.main2, { renderOnly: ['mirroresZone']});

                                this.frames = this.frames.map(frame => {
                                    return createCanvas(this.size, (ctx, size, hlp) => {
                                        ctx.drawImage(this.mask,0,0)
                                        ctx.globalCompositeOperation  = 'source-in';
                                        ctx.drawImage(frame,0,0)
                                    })
                                })

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
                }))

                

                this.smoke = this.addChild(new GO({
                    position: new V2(-10, 28),
                    size: new V2(20, 20),
                    createSmokeFrames({framesCount, itemsCount, size, color}) {
                        let frames = [];
                        if(typeof(color) == 'string')
                            color = colors.rgbStringToObject({value: color, asObject: true});

                        //let height = size.y;

                        
                        let angleValues = easing.fast({from: 0, to: 359, steps: framesCount, type: 'linear', method: 'base'});

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let height = getRandomInt(size.y/3, size.y);
                            let aValues = easing.fast({from: color.opacity, to: 0, steps: height, type: 'quad', method: 'in'}).map(v => fast.r(v, 1))
                            return {
                                height,
                                aValues,
                                xShift: getRandomInt(-2,2),
                                initialAngle: getRandomInt(0,359)//getRandomInt(0, framesCount-1)
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsCount; p++){
                                    let itemData = itemsData[p];
                                    let initialAngle = itemData.initialAngle + angleValues[f];
                                    if(initialAngle > 360)
                                        initialAngle-=360;
                                    
                                    for(let y = 0; y < itemData.height; y++){
                                        let opacity = itemData.aValues[y];
                                        hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false}));
                                        let x = Math.cos(degreeToRadians(  (initialAngle + y*10)*3  )  );
                                        x= fast.r( x + size.x/2) + itemData.xShift;

                                        hlp.dot(x, size.y-y)
                                    }
                                }
                            });
                        }

                        return frames.reverse();
                    },
                    init() {
                        this.frames = this.createSmokeFrames({ framesCount: 200, itemsCount: 4, size: this.size, color: 'rgba(151,164,173,0.5)' })

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
    }
}