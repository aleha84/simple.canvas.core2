class Adrian10zScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
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
    }
}