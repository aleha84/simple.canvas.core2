class Adrian10zScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'disco'
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
        let model = Adrian10zScene.models.main;
        let exludes = []
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(exludes.indexOf(name) == -1 && name.indexOf('f_t') == -1){
                this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}) 
                }), l*10)
                console.log(l + ' - ' + name)
            }
            // else {
            //     model.main.layers[l].visible = true;
            // }
            
            

            
        }

        this.discoBall = this.addGo(new GO({
            position: new V2(65, 0),
            size: new V2(30,30),
            createSphereFrames({framesCount, size, texture, textureSize}) {
                let frames = [];
                
                let timeValues = easing.fast({from: 0, to: textureSize.x, steps: framesCount, type: 'linear', method: 'base'});
                
                for(let f = 0; f < framesCount; f++){
                    let frame = sphereHelper.createSphere(texture, 'discoBall',  textureSize, size.x, 1, timeValues[f], true )

                    frames[f] = frame;
                }
                
                return frames;
            },
            createShineFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                    let opacity = getRandomInt(25, 95)/100
                    let p = new V2(
                        getRandomInt(0, size.x - 1),
                        getRandomInt(0, size.y - 1)
                    )

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        p,
                        opacity,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255,${itemData.opacity})`).dot(itemData.p.x, itemData.p.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let textureSize = new V2(this.size.x*2, this.size.y).mul(1);
                this.texture = createCanvas(textureSize, (ctx, size, hlp) => {
                    hlp.setFillColor('#030b60').rect(0,0,size.x, size.y);
                    let colors = ['#0b185a', '#14236f', '#1f2db7', '#e31b51', '#771a56']
                    for(let i = 0; i < 5000; i++){
                        //hlp.setFillColor(getRandomBool() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)').dot(getRandomInt(0, size.x-1), getRandomInt(0, size.y-1));
                        hlp.setFillColor('rgba(255,255,255,0.1)').dot(getRandomInt(0, size.x-1), getRandomInt(0, size.y-1))


                        //hlp.setFillColor(colors[getRandomInt(0, colors.length-1)]).dot(getRandomInt(0, size.x-1), getRandomInt(0, size.y-1));
                    }

                    //hlp.setFillColor('red').rect(size.x-1, 0, 1, size.y);
                })

                let mask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').circle(size.divide(2).toInt(), fast.r(size.x/2)-1)
                })

                let dMask = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(0,0,0,0.05)').strokeEllipsis(0,360,1, size.divide(2).toInt(), fast.r(size.x/2)-2, fast.r(size.x/2)-2)
                })

                this.shineFrames = this.createShineFrames({ framesCount: 350, itemsCount: 2500, itemFrameslength: 3, size: this.size })

                this.frames = this.createSphereFrames({framesCount: 350, size: this.size, texture: this.texture, textureSize}).map((frame, i) => {
                    return createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(mask, 0,0);
                        ctx.globalCompositeOperation = 'source-in'
                        ctx.drawImage(frame, 0,0);
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(this.shineFrames[i], 0,0);
                        ctx.globalCompositeOperation = 'source-over'
                        ctx.drawImage(dMask, 0,1);
                    })
                });
                
                

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
        }), 15)

        this.circles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createCirclesFrames({framesCount, itemsCount, size}) {
                let frames = [];
                let widthClamps = [20, 80]
                let elStapValues = easing.fast({from: 3, to: 0.5, steps: (widthClamps[1] - widthClamps[0]) + 1, type: 'linear', method: 'base'});
                let origin = new V2(64,79);
                let _sharedHlp = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedHlp = hlp;
                })

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = framesCount;
                    let opacity = getRandomInt(15,40)/100;
                
                    let width = getRandomInt(widthClamps[0], widthClamps[1]);
                    let height = fast.r(width/3.5);
                    let dots = [];
                    _sharedHlp.strokeEllipsis(0, 359, elStapValues[width-20], origin, width, height, dots);
                    dots = distinct(dots, (p) => `${p.x}_${p.y}`);

                    let indexValues = easing.fast({from: 0, to: dots.length-1, steps: totalFrames, type: 'linear', method: 'base'}).map(v => fast.r(v));


                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            p: dots[indexValues[f]]
                        };
                    }
                
                    return {
                        opacity,
                        dots,
                        indexValues,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255,${itemData.opacity})`).dot(itemData.frames[f].p.x, itemData.frames[f].p.y)
                            }
                            
                        }
                        // let width = 70;
                        // let height = fast.r(width/3.5)
                        // hlp.setFillColor('red').strokeEllipsis(0, 360, 0.5, new V2(64,79), width, height);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createCirclesFrames({framesCount: 350, itemsCount: 200, size: this.size});
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
        }), 25)

        this.floorTiles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createTilesFrames({framesCount, itemFrameslength, size}) {
                let frames = [];
                let mainModel = Adrian10zScene.models.main;
                let tilesTextures = mainModel.main.layers.filter(l => l.name.indexOf('f_t') != -1).map(l => PP.createImage(mainModel, {renderOnly: [l.name]}) );

                let itemsData = new Array(tilesTextures.length).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        index: i,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                ctx.drawImage(tilesTextures[itemData.index], 0,0);
                            }

                            
                            
                        }

                        //hlp.setFillColor('red').rect(50,50, 20,20);
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createTilesFrames({framesCount: 350, itemFrameslength: 70, size: this.size})
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
        }), 24)

        this.girl = this.addGo(new GO({
            position: new V2(53,65),
            size: new V2(32,18),
            init() {
                this.frames = PP.createImage(Adrian10zScene.models.girlFrames, { colorsSubstitutions: {
                    '#ff0000': { color: '#ffffff', opacity: 1 },
                    '#00ff00': { color: '#ffffff', opacity: 0.5 },
                    '#0000ff': { color: '#ffffff', opacity: 0.25 }
                } });

                this.frames = [...this.frames, ...this.frames.reverse().filter((el, i) => i > 0 && i < (this.frames.length-1))];

                // let videoWriter = new WebMWriter({
                //     quality: 0.99999,
                //     frameRate:  7,
                // });

                // this.frames.forEach(frame => {
                //     frame = createCanvas(this.size.mul(60), (ctx, size, hlp) => {
                //         hlp.setFillColor('black').rect(0,0,size.x, size.y);
                //         let s = this.size.mul(30);
				// 		ctx.drawImage(frame, s.x/2,s.y/2, s.x, s.y)
				// 	});

				// 	videoWriter.addFrame(frame);
                // })

                // videoWriter.complete().then(function(blob){
                //     let name = new Date().getTime() + '.webm';
                //     // let blob = new Blob(this.recordedBlobs, { type: this.mimeType });
                //     let url = window.URL.createObjectURL(blob);
                //     let a = document.createElement('a');
                //     a.style.display = 'none';
                //     a.href = url;
                //     a.download = name;
                //     document.body.appendChild(a);
                //     a.click();
                //     setTimeout(() => {
                //         document.body.removeChild(a);
                //         window.URL.revokeObjectURL(url);
                //     }, 100)
                // })


console.log(this.frames.length)
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let counter = 10;

                this.timer = this.regTimerDefault(10, () => {
                    counter--;
                    if(counter > 0)
                        return;

                    counter = 10;
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;

                        this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 26)

        this.man = this.addGo(new GO({
            position: new V2(70,65),
            size: new V2(32,18).mul(1.1).toInt(),
            init() {
                this.frames = PP.createImage(Adrian10zScene.models.manFrames, { colorsSubstitutions: {
                    '#ff0000': { color: '#ffffff', opacity: 1 },
                    '#00ff00': { color: '#ffffff', opacity: 0.5 },
                    '#0000ff': { color: '#ffffff', opacity: 0.25 }
                } });

                //this.img = this.frames;

                this.frames = [...this.frames, ...this.frames.reverse().filter((el, i) => i > 0 && i < (this.frames.length-1))];
console.log(this.frames.length)
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let counter = 10;

                this.timer = this.regTimerDefault(10, () => {
                    counter--;
                    if(counter > 0)
                        return;

                    counter = 10;
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 26)

        this.bgParticles = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createParticlesFrames({framesCount, itemsCount, itemFrameslength, size, poligon}) {
                let frames = [];
                let yClamp = [0, 35];

                let dots = [];

                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    dots = pp.fillByCornerPoints(poligon); 
                })
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    //let x, y;
            
                    let dot = dots[getRandomInt(0, dots.length-1)];
                    let x = dot.x;
                    let y = dot.y;

                    // let y = getRandomInt(yClamp[0], yClamp[1]);
                    // let x = getRandomInt(0, size.x-2);
                    let opacity = getRandomInt(20, 60)/100;
                    let xShift = getRandomInt(2,4);

                    let opacityValues = easing.fast({from: opacity, to: 0, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v,2));
                    let xValues = easing.fast({from: x, to: x+xShift, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            opacity: opacityValues[f],
                            x: xValues[f]
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
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.frames[f].opacity})`).dot(itemData.frames[f].x, itemData.y);
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {

                let poligon = [new V2(0, 0),
                    new V2(129, 0),
                    new V2(129, 56),
                    new V2(111, 52),
                    new V2(111, 19),
                    new V2(103, 19),
                    new V2(103, 30),
                    new V2(94, 36),
                    new V2(94, 54),
                    new V2(36, 54),
                    new V2(34, 33),
                    new V2(28, 31),
                    new V2(27, 42),
                    new V2(0, 45)]
                
                this.frames = this.createParticlesFrames({framesCount: 350, itemsCount: 500, itemFrameslength: 10, size: this.size, poligon})
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
        }), 21)

        this.steps = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            createStepsFrames({framesCount, itemFrameslength, startFrom, stepImages, size}) {
                let frames = [];
                
                let itemsData = new Array(stepImages.length).fill().map((el, i) => {
                    let startFrameIndex = startFrom + i*itemFrameslength;
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true;
                    }
                
                    return {
                        index: i,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                ctx.drawImage(stepImages[itemData.index], 0,0)
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let model = Adrian10zScene.models.steps;
                let stepImages = model.main.layers.map(layer => PP.createImage(model, {renderOnly: [layer.name]}) )

                this.frames = this.createStepsFrames({framesCount: 350, itemFrameslength: 50, startFrom: 100, size: this.size, stepImages});

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
        }), 21)

        this.createLaserFrames = function({framesCount, emitter, itemsCount, itemFrameslength, size}) {
            let frames = [];
            //let itemsCount = framesCount/itemFrameslength;
            let availableDots = [];
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                let pp = new PP({ctx});
                availableDots = pp.fillByCornerPoints(emitter.poligon); 
            })

            let itemsData = [];
            for(let i = 0; i < fast.r(framesCount/itemFrameslength); i++){
                let count = getRandomInt(3,4);

                for(let j = 0; j <count; j++){
                    let startFrameIndex = i*itemFrameslength;
                    startFrameIndex+=getRandomInt(-itemFrameslength/4, itemFrameslength/4);
                    let totalFrames = itemFrameslength + getRandomInt(-5,5);
                
                    let target = availableDots[getRandomInt(0, availableDots.length-1)];
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                        else if(frameIndex < 0){
                            frameIndex=framesCount-frameIndex;
                        }

                
                        frames[frameIndex] = true;
                    }
                
                    itemsData.push( {
                        target,
                        frames
                    })
                }
                
            }

            // let itemsData = new Array(itemsCount).fill().map((el, i) => {
            //     let startFrameIndex = getRandomInt(0, framesCount-1);//i*itemFrameslength;
            //     let totalFrames = itemFrameslength;
            
            //     let target = availableDots[getRandomInt(0, availableDots.length-1)];
            //     let frames = [];
            //     for(let f = 0; f < totalFrames; f++){
            //         let frameIndex = f + startFrameIndex;
            //         if(frameIndex > (framesCount-1)){
            //             frameIndex-=framesCount;
            //         }
            
            //         frames[frameIndex] = true;
            //     }
            
            //     return {
            //         target,
            //         frames
            //     }
            // })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PerfectPixel({ctx});

                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(`rgba(255,255,255, 0.1)`);

                            pp.lineV2(emitter.p, itemData.target);

                            hlp.dot(itemData.target.x, itemData.target.y);
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.laser1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let emitter = {
                    p: new V2(98,8),
                    count: 5,
                    poligon: [
                        new V2(109, 61),
                        new V2(160, 69),
                        new V2(129, 82)
                    ]
                }

                this.frames = this.parentScene.createLaserFrames({framesCount: 350, emitter, itemsCount: 50, itemFrameslength: 20, size: this.size});

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
        }), 29)

        this.laser2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let emitter = {
                    p: new V2(33,8),
                    count: 5,
                    poligon: [
new V2(20,63),
new V2(0,85),
new V2(-30,68)
                    ]
                }

                this.frames = this.parentScene.createLaserFrames({framesCount: 350, emitter, itemsCount: 50, itemFrameslength: 20, size: this.size});

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
        }), 29)
    }
}