class DestrScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: []
            },

        }, options)

        super(options);
    }

    start() {

        this.imgCache = {};

        let cloakedFigure = {
            size: new V2(25,40),
            images: destructuringImgages.cloacedFigureFrames.map(f => PP.createImage(f))
        }

        let crystal = {
            size: new V2(10,20),
            images: destructuringImgages.crystalFrames.map(f => PP.createImage(f))
        }

        let energy = {
            size: new V2(10,15),
            images: destructuringImgages.energyFrames.map(f => PP.createImage(f))
        }

        let crystalLightSize = new V2(50,50);
        let crystalLight = {
            size: crystalLightSize,
            images: [0.2, 0.3, 0.4, 0.5, 0.4, 0.3].map(maxOpacity => {
                return createCanvas(crystalLightSize, (ctx, size) => {
                    let center = new V2(size.x/2 -0.5, size.y/2 -0.5);
                    let maxDistance = size.x/2;
                    for(let r = 0; r < size.y; r++){
                        for(let c = 0; c < size.y; c++){
                            let current = new V2(c,r);
                            let distance = current.distance(center);
                            if(distance > maxDistance)
                                continue;

                            let opacity = fastRoundWithPrecision(maxOpacity - maxOpacity*distance/maxDistance,1)
                            ctx.fillStyle = `rgba(255,255,255,${opacity})`;
                            ctx.fillRect(c,r,1,1);
                        }
                    }

                    //ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(0,0,size.x, size.y);
                })
            })
        }

        let energyLightSize = new V2(50,50);
        let energyLight = {
            size: energyLightSize,
            images: [0.2, 0.3, 0.4, 0.5, 0.4, 0.3].map(maxOpacity => {
                return createCanvas(energyLightSize, (ctx, size) => {
                    let center = new V2(size.x/2 -0.5, size.y/2 -0.5);
                    let maxDistance = size.x/2;
                    for(let r = 0; r < size.y; r++){
                        for(let c = 0; c < size.y; c++){
                            let current = new V2(c,r);
                            let distance = current.distance(center);
                            if(distance > maxDistance)
                                continue;

                            let opacity = fastRoundWithPrecision(maxOpacity - maxOpacity*distance/maxDistance,1)
                            ctx.fillStyle = `rgba(18,135,145,${opacity})`;
                            ctx.fillRect(c,r,1,1);
                        }
                    }
                })
            })
        }

        let shadowSize = new V2(40, 2);
        let shadow = {
            size: shadowSize,
            images: [0.3,0.5,0.8,1, 0.8, 0.5].map(opacity => {
                return createCanvas(shadowSize, (ctx, size) => {
                    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
                    ctx.fillRect(0, 0, size.x, 1);
                    ctx.fillRect(0, 1, size.x - 10, 1);
                })
            })
        }

        let scale = 2;

        // let wallSize = new V2(this.viewport.x, 200);
        // this.wall = this.addGo(new GO({
        //     position:new V2(this.sceneCenter.x, 200),
        //     size: wallSize,
        //     img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#12191A'; ctx.fillRect(0,0,1,1) })
        // }),1)

        this.floor = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, 310),
            size: new V2(this.viewport.x, 50),
            img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = '#190A07'; ctx.fillRect(0,0,1,1) })
        }),2)

        this.cloackedFigure = this.addGo(new GO({
            size: cloakedFigure.size.mul(scale),
            position: this.sceneCenter.clone(),
            imgCache: this.imgCache,
            pixels: [],
            scale,
            init() {
                this.crystalLight = this.addChild(new GO({
                    position: new V2(-50, -10),
                    size: crystalLight.size.mul(scale),
                    init() {
                        this.frames = crystalLight.images;
                        this.currentFrame = 0;
                    }
                }))

                this.energyLight = this.addChild(new GO({
                    isVisible: false,
                    position: new V2(),
                    size: energyLight.size.mul(scale),
                    init() {
                        this.frames = energyLight.images;
                        this.currentFrame = 0;
                    }
                }))

                this.shadow = this.addChild(new GO({
                    position: new V2(50, 40),
                    size: shadow.size.mul(scale),
                    init() {
                        this.frames = shadow.images;
                        this.currentFrame = 0;
                    }
                }))
                
                this.figure = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = cloakedFigure.images;
                        this.currentFrame = 0;
                        this.animationsCount = 5;
                        this.animationTimer = this.registerTimer(createTimer(250, () => {
                            this.img = this.frames[this.currentFrame];

                            let c = this.parent.crystal;
                            c.img = c.frames[this.currentFrame]

                            let cl = this.parent.crystalLight;
                            cl.img = cl.frames[this.currentFrame]

                            let s = this.parent.shadow;
                            s.img = s.frames[this.currentFrame]

                            // let e = this.parent.energy;
                            // e.img = e.frames[this.currentFrame]
                            
                            if(this.animationsCount == 0){
                                this.unregTimer(this.animationTimer);
                                this.parent.processScript();
                                return;
                            }

                            this.currentFrame++;

                            if(this.currentFrame  == this.frames.length){
                                this.animationsCount--;
                                this.currentFrame = 0;
                            }
                                

                        }, this, true));
                    }
                }));

                this.crystal = this.addChild(new GO({
                    position: new V2(-50, -10),
                    size: crystal.size.mul(scale),
                    init() {
                        this.frames = crystal.images;
                        this.currentFrame = 0;
                    }
                }))

                this.energy = this.addChild(new GO({
                    position: new V2(0, 0),
                    size: energy.size.mul(scale),
                    isVisible: false,
                    init() {
                        this.frames = energy.images;
                    },
                    startAnimation() {
                        this.currentFrame = 0;
                        this.animationTimer = this.registerTimer(createTimer(250, () => {
                            this.img = this.frames[this.currentFrame];

                            let cl = this.parent.energyLight;
                            cl.img = cl.frames[this.currentFrame]

                            this.currentFrame++;

                            if(this.currentFrame  == this.frames.length){
                                this.currentFrame = 0;
                            }
                        }));
                    }
                }))

                

                this.script.items = [
                    function() {
                        this.crystal.addEffect(new FadeOutEffect({ effectTime: 500, updateDelay: 100,initOnAdd:true, completeCallback: () => {
                            this.processScript();
                        } }));

                        this.crystalLight.addEffect(new FadeOutEffect({ effectTime: 500, updateDelay: 100,initOnAdd:true}));
                    },
                    function() {
                        this.delayTimer = this.registerTimer(createTimer(1000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false))
                    },
                    function(){
                        this.figure.isVisible = false;
                        this.shadow.isVisible = false;

                        this.startMutations({
                            size: cloakedFigure.size.mul(scale),
                            imgSize: cloakedFigure.size,
                            img: cloakedFigure.images[0]
                        }, {
                            size: energy.size.mul(scale),
                            imgSize: energy.size,
                            img: energy.images[0]
                        }, () => {
                            this.clearMutationPixels();
                            this.energy.isVisible = true;
                            this.energyLight.isVisible = true;
                            this.energy.img = this.energy.frames[0];
                            this.energyLight.img = this.energyLight.frames[0];
                            this.energy.startAnimation();
                            this.processScript();
                        }, 50, true, [2,4], 50)
                    },
                    function() {
                        this.delayTimer = this.registerTimer(createTimer(5000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false))
                    },
                    function() {
                        this.energy.addEffect(new FadeOutEffect({ effectTime: 1000, updateDelay: 100,initOnAdd:true, completeCallback: () => {
                            this.processScript();
                        } }));

                        this.energyLight.addEffect(new FadeOutEffect({ effectTime: 1000, updateDelay: 100,initOnAdd:true}));
                    }
                ];

                
            },

            shiftRandom(arr) {
                if(arr.length == 0)
                    return undefined;

                if(arr.length == 1)
                    return arr.shift();

                return arr.splice(getRandomInt(0, arr.length-1), 1)[0];
            },
            clearMutationPixels() {
                if(this.pixels.length){
                    this.pixels.forEach(c => this.removeChild(c));
                }

                this.pixels = [];
            },
            startMutations(start, target, completeCallback, duration = 40, verticalOnly = false, distanceClamp = [4,6], updateInterval= 30) {
                let topLeftStart = new V2(-start.size.x/2, -start.size.y/2);
                let topLeftTarget = new V2(-target.size.x/2, -target.size.y/2);

                let targetPixels = this.parentScene.getPixels(target.img, target.imgSize).map(p => {
                    return {
                        size: new V2(1,1).mul(this.scale),
                        position: topLeftTarget.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                        color: p.color
                    }
                })

                let startPixels = this.parentScene.getPixels(start.img, start.imgSize).map(p => {            
                    return {
                        size: new V2(1,1).mul(this.scale),
                        position: topLeftStart.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                        color: p.color
                    }
                });

                let startPixelsOriginals = [...startPixels];
                let targetPixelsOriginals = [...targetPixels];

                this.clearMutationPixels();

                let callbackAdded =false;
                while(startPixels.length || targetPixels.length){
                    let startPixel = this.shiftRandom(startPixels);//.shift();
                    let targetPixel = this.shiftRandom(targetPixels)//.shift();

                    let noInitialStartP = startPixel == undefined;

                    if(noInitialStartP){
                        let osp = startPixelsOriginals[getRandomInt(0, startPixelsOriginals.length-1)];
                        startPixel = {
                            color: [...osp.color],
                            size: osp.size.clone(),
                            position: osp.position.clone()
                        };
                    }

                    let normal = startPixel.position.clone().normalize();
                    
                    if(startPixel.position.equal(V2.zero)){
                        normal = V2.up;
                    }

                    if(noInitialStartP){
                        normal = normal.rotate(getRandom(-180,180))
                    }

                    if(verticalOnly){
                        if(normal.y > 0)
                            normal.y*=-1;
                    }
                    

                    let callback = function() {};
                    if(!callbackAdded && startPixel && targetPixel){
                        callback = completeCallback;
                        callbackAdded = true;
                    }

                    let midPosition = normal.mul(20*getRandom(distanceClamp[0],distanceClamp[1]));

                    this.pixels[this.pixels.length] = targetPixel 
                        ? this.addChild(new MutationPixel({
                            imgCache: this.imgCache,
                            position: startPixel.position,
                            midPosition: midPosition,
                            targetPosition: targetPixel.position,
                            startSize: startPixel.size,
                            targetSize: targetPixel.size,
                            startColorRGB: startPixel.color,
                            targetColorRGB: targetPixel.color,
                            completeCallback: callback,
                            noInitialStartP,
                            duration,
                            updateInterval
                        }))
                        :  this.addChild(new MutationPixel({
                            imgCache: this.imgCache,
                            position: startPixel.position,
                            midPosition: midPosition,
                            startSize: startPixel.size,
                            startColorRGB: startPixel.color,
                            fadeOut: true,
                            duration,
                            updateInterval
                        }))
                }
            }
        }), 10)

        // let imgSize = new V2(8,16);
        // let startImg = createCanvas(imgSize, (ctx, size) => {
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(0,0, size.x,size.y);
        // })

        // let targetImgSize = new V2(16,8);
        // let targetImg = createCanvas(targetImgSize, (ctx, size) => {
        //     ctx.fillStyle = 'green';
        //     ctx.fillRect(0,0, size.x,size.y);
        // })

        // let thirdImgSize = new V2(5, 3);
        // let thirdtImg = createCanvas(thirdImgSize, (ctx, size) => {
        //     ctx.fillStyle = 'white';
        //     ctx.fillRect(2, 0, 1,1);ctx.fillRect(1, 1, 3,1);ctx.fillRect(0, 2, 5,1);
        // })

        // let fourthImgSize = new V2(10,10);
        // let fourthImg = PP.createImage({"general":{"originalSize":{"x":10,"y":10},"size":{"x":10,"y":10},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#df204b","fillColor":"#df204b","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":5,"y":9}},{"point":{"x":3,"y":9}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":3,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":9,"y":3}},{"point":{"x":9,"y":5}},{"point":{"x":8,"y":7}},{"point":{"x":6,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#b0d12e","fillColor":"#b0d12e","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":5,"y":1}},{"point":{"x":8,"y":4}},{"point":{"x":8,"y":5}},{"point":{"x":5,"y":8}}]},{"order":2,"type":"lines","strokeColor":"#135fec","fillColor":"#135fec","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":4,"y":1}},{"point":{"x":4,"y":8}},{"point":{"x":1,"y":5}},{"point":{"x":1,"y":4}}]}]}});

        // let fifthImgSize = new V2(20,20);
        // let fifthImage = PP.createImage({"general":{"originalSize":{"x":20,"y":20},"size":{"x":20,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#e9ee11","fillColor":"#e9ee11","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":8,"y":0}},{"point":{"x":11,"y":0}},{"point":{"x":14,"y":9}},{"point":{"x":11,"y":19}},{"point":{"x":8,"y":19}},{"point":{"x":5,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#29d6cd","fillColor":"#29d6cd","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":15,"y":2}},{"point":{"x":16,"y":1}},{"point":{"x":17,"y":2}},{"point":{"x":16,"y":3}}]},{"order":2,"type":"dots","strokeColor":"#29d6cd","fillColor":"#29d6cd","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":16,"y":15}},{"point":{"x":16,"y":17}},{"point":{"x":15,"y":16}},{"point":{"x":17,"y":16}},{"point":{"x":16,"y":16}}]},{"order":3,"type":"dots","strokeColor":"#29d6cd","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":1}},{"point":{"x":2,"y":3}},{"point":{"x":1,"y":2}},{"point":{"x":3,"y":2}},{"point":{"x":2,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#29d6cd","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":15}},{"point":{"x":2,"y":17}},{"point":{"x":1,"y":16}},{"point":{"x":3,"y":16}},{"point":{"x":2,"y":16}}]}]}});

        // let sixImgSize = new V2(10, 10);
        // let sixImg = createCanvas(sixImgSize, (ctx, size) => {
        //     for(let y = 0; y < size.y; y++){
        //         for(let x = 0; x < size.x; x++){
        //             ctx.fillStyle = `rgb(${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${getRandomInt(0,255)})`;
        //             ctx.fillRect(x,y,1,1);
        //         }
        //     }
        // })

        // let scale = 5;

        // this.demoGo = this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: imgSize.mul(scale),
        //     targetSize: targetImgSize.mul(scale),
        //     pixels: [],
        //     imgCache: this.imgCache,
        //     //img: startImg,
        //     scale,
        //     init() {
        //         //let direction = 1;
        //         let currentIndex = 0;
        //         this.queue = [
        //             {
        //                 size: imgSize.mul(scale), 
        //                 img: startImg, 
        //                 imgSize: imgSize
        //             },
        //             {
        //                 size: targetImgSize.mul(scale),
        //                 img: targetImg, 
        //                 imgSize: targetImgSize
        //             },
        //             {
        //                 size: thirdImgSize.mul(scale),
        //                 img: thirdtImg, 
        //                 imgSize: thirdImgSize
        //             },
        //             {
        //                 size: fourthImgSize.mul(scale),
        //                 img: fourthImg, 
        //                 imgSize: fourthImgSize
        //             },
        //             {
        //                 size: fifthImgSize.mul(scale),
        //                 img: fifthImage, 
        //                 imgSize: fifthImgSize
        //             },
        //             {
        //                 size: sixImgSize.mul(scale),
        //                 img: sixImg, 
        //                 imgSize: sixImgSize
        //             }
        //         ];

        //         this.addScript = function(){
        //             let from = this.queue[currentIndex];
        //             currentIndex++;
                    
        //             if(currentIndex == this.queue.length){
        //                 currentIndex = 0;
        //             }

        //             let to = this.queue[currentIndex];

        //             return [
        //                 function() {
        //                     this.delayTimer = this.registerTimer(createTimer(1000, () => {
        //                         this.unregTimer(this.delayTimer);
        //                         this.processScript();
        //                     }, this, false))
        //                 },
        //                 function() {
        //                     this.startMutations(from, to, function(){
        //                         this.script.items.push(...this.addScript());
        //                         this.processScript();
        //                     }.bind(this));
        //                 },
        //             ];
        //         }

        //         this.script.items = [...this.addScript()];

        //         this.processScript();
        //     },
        //     shiftRandom(arr) {
        //         if(arr.length == 0)
        //             return undefined;

        //         if(arr.length == 1)
        //             return arr.shift();

        //         return arr.splice(getRandomInt(0, arr.length-1), 1)[0];
        //     },
        //     startMutations(start, target, completeCallback) {
        //         let topLeftStart = new V2(-start.size.x/2, -start.size.y/2);
        //         let topLeftTarget = new V2(-target.size.x/2, -target.size.y/2);

        //         let targetPixels = this.parentScene.getPixels(target.img, target.imgSize).map(p => {
        //             return {
        //                 size: new V2(1,1).mul(this.scale),
        //                 position: topLeftTarget.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
        //                 color: p.color
        //             }
        //         })

        //         let startPixels = this.parentScene.getPixels(start.img, start.imgSize).map(p => {            
        //             return {
        //                 size: new V2(1,1).mul(this.scale),
        //                 position: topLeftStart.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
        //                 color: p.color
        //             }
        //         });

        //         let startPixelsOriginals = [...startPixels];
        //         let targetPixelsOriginals = [...targetPixels];

        //         if(this.pixels.length){
        //             this.pixels.forEach(c => this.removeChild(c));
        //         }

        //         this.pixels = [];

        //         let callbackAdded =false;
        //         while(startPixels.length || targetPixels.length){
        //             let startPixel = this.shiftRandom(startPixels);//.shift();
        //             let targetPixel = this.shiftRandom(targetPixels)//.shift();

        //             let noInitialStartP = startPixel == undefined;

        //             if(noInitialStartP){
        //                 let osp = startPixelsOriginals[getRandomInt(0, startPixelsOriginals.length-1)];
        //                 startPixel = {
        //                     color: [...osp.color],
        //                     size: osp.size.clone(),
        //                     position: osp.position.clone()
        //                 };
        //             }

        //             let normal = startPixel.position.clone().normalize();
                    
        //             if(startPixel.position.equal(V2.zero)){
        //                 normal = V2.up;
        //             }

        //             if(noInitialStartP){
        //                 normal = normal.rotate(getRandom(-180,180))
        //             }

        //             // if(normal.y > 0)
        //             //     normal.y*=-1;

        //             let callback = function() {};
        //             if(!callbackAdded && startPixel && targetPixel){
        //                 callback = completeCallback;
        //                 callbackAdded = true;
        //             }

        //             let midPosition = normal.mul(20*getRandom(4,6));

        //             this.pixels[this.pixels.length] = targetPixel 
        //                 ? this.addChild(new MutationPixel({
        //                     imgCache: this.imgCache,
        //                     position: startPixel.position,
        //                     midPosition: midPosition,
        //                     targetPosition: targetPixel.position,
        //                     startSize: startPixel.size,
        //                     targetSize: targetPixel.size,
        //                     startColorRGB: startPixel.color,
        //                     targetColorRGB: targetPixel.color,
        //                     completeCallback: callback,
        //                     noInitialStartP
        //                 }))
        //                 :  this.addChild(new MutationPixel({
        //                     imgCache: this.imgCache,
        //                     position: startPixel.position,
        //                     midPosition: midPosition,
        //                     startSize: startPixel.size,
        //                     startColorRGB: startPixel.color,
        //                     fadeOut: true
        //                 }))
        //         }
        //     }
        // }));

    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getPixels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;//i - y*size.x;
            let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] //`rgba(${imageData[i]}, ${imageData[i+1]}, ${imageData[2]}, ${ fastRoundWithPrecision(imageData[i+3]/255, 4)})`

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        
        //console.log(imageData);
        return pixels;
    }


}

class MutationPixel extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            startColorRGB: [0,0,0],
            targetColorRGB:[0,0,0],
            duration: 40,
            startSize: new V2(1,1),
            targetSize: new V2(1,1),
            size: new V2(1,1),
            midPosition: new V2(),
            targetPosition: new V2(),
            pixelSize: new V2(1,1),
            completeCallback: function() {},
            fadeOut: false,
            updateInterval: 30,
        }, options)

        super(options);
    }

    init(){

        this.size = this.startSize;
        this.currentColor = colors.rgbToString({value: [this.startColorRGB[0], this.startColorRGB[1], this.startColorRGB[2]], opacity: this.startColorRGB[3] != undefined ? this.startColorRGB[3] : 1});
        if(!this.imgCache[this.currentColor]){
            this.imgCache[this.currentColor] = createCanvas(this.pixelSize, (ctx, size) => {
                ctx.fillStyle = this.currentColor;
                ctx.fillRect(0,0, size.x, size.y);
            });
        }

        this.img = this.imgCache[this.currentColor];

        if(!this.fadeOut){
            this.isColorChange = this.startColorRGB[0] != this.targetColorRGB[0] || this.startColorRGB[1] != this.targetColorRGB[1] || this.startColorRGB[2] != this.targetColorRGB[2];
            this.isSizeChange = !this.startSize.equal(this.targetSize);
    
            if(this.isColorChange){
                this.colorChange = [
                    { time: 0, duration: this.duration, change: this.targetColorRGB[0] - this.startColorRGB[0] , type: 'linear', method: 'base', startValue: this.startColorRGB[0] },
                    { time: 0, duration: this.duration, change: this.targetColorRGB[1] - this.startColorRGB[1] , type: 'linear', method: 'base', startValue: this.startColorRGB[1] },
                    { time: 0, duration: this.duration, change: this.targetColorRGB[2] - this.startColorRGB[2] , type: 'linear', method: 'base', startValue: this.startColorRGB[2] }
                ];
            }
            
            if(this.isSizeChange) {
                this.sizeXChange = { time: 0, duration: this.duration, change: this.targetSize.x - this.size.x , type: 'quad', method: 'out', startValue: this.size.x }
                this.sizeYChange = { time: 0, duration: this.duration, change: this.targetSize.y - this.size.y , type: 'quad', method: 'out', startValue: this.size.y }
            }
        }
        else {
            this.addEffect(new FadeOutEffect({updateDelay: this.updateInterval, effectTime: this.updateInterval*this.duration/3, initOnAdd:true}));
        }
        
        this.flyOut = true;
        this.xChange = { time: 0, duration: this.duration/2, change: this.midPosition.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x }
        this.yChange = { time: 0, duration: this.duration/2, change: this.midPosition.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y }

        this.mutationTimer = this.registerTimer(createTimer(this.updateInterval, () => {
            if(this.mutationTimerPaused)
                return;

            this.position.x = easing.process(this.xChange);
            this.position.y = easing.process(this.yChange);

            if(this.isColorChange){
                this.currentColor = colors.rgbToString({value: [easing.process(this.colorChange[0]), easing.process(this.colorChange[1]), easing.process(this.colorChange[2])], opacity: this.startColorRGB[3] != undefined ? this.startColorRGB[3] : 1});

                if(!this.imgCache[this.currentColor]){
                    this.imgCache[this.currentColor] = createCanvas(this.pixelSize, (ctx, size) => {
                        ctx.fillStyle = this.currentColor;
                        ctx.fillRect(0,0, size.x, size.y);
                    });
                }
                
                this.img = this.imgCache[this.currentColor];

                this.colorChange.forEach(cc => cc.time++);
            }

            if(this.isSizeChange) {
                this.size.x = easing.process(this.sizeXChange);
                this.size.y = easing.process(this.sizeYChange);

                this.sizeXChange.time++;
                this.sizeYChange.time++;
            }

            this.needRecalcRenderProperties = true;
            
            this.xChange.time++;
            this.yChange.time++;

            if(this.xChange.time > this.xChange.duration){
                if(this.flyOut){
                    if(this.fadeOut){
                        this.unregTimer(this.mutationTimer);
                        this.completeCallback();
                        return;
                    }
                    this.xChange = { time: 0, duration: this.duration/2, change: this.targetPosition.x - this.position.x , type: 'quad', method: 'inOut', startValue: this.position.x }
                    this.yChange = { time: 0, duration: this.duration/2, change: this.targetPosition.y - this.position.y , type: 'quad', method: 'inOut', startValue: this.position.y }
                    //this.mutationTimerPaused = true;
                    this.flyOut = false;

                    // this.delayTimner = this.registerTimer(createTimer(1000, () => {
                    //     this.mutationTimerPaused = false;
                    //     this.unregTimer(this.delayTimner);
                    // }, this, false));
                    // this.fall = { time: 0, duration: 10, change: this.position.y + (getRandomInt(5,10)) - this.position.y , type: 'quad', method: 'in', startValue: this.position.y }

                    // this.fallTimer = this.registerTimer(createTimer(30, () => {
                    //     this.position.y = easing.process(this.fall);
                    //     this.needRecalcRenderProperties = true;
                    //     this.fall.time++;
                    //     if(this.fall.time > this.fall.duration){
                    //         this.unregTimer(this.fallTimer);
                    //         this.mutationTimerPaused = false;

                    //         this.xChange = { time: 0, duration: this.duration/2, change: this.targetPosition.x - this.position.x , type: 'quad', method: 'inOut', startValue: this.position.x }
                    //         this.yChange = { time: 0, duration: this.duration/2, change: this.targetPosition.y - this.position.y , type: 'quad', method: 'inOut', startValue: this.position.y }

                    //         this.flyIn = true;
                    //     }
                    // }, this, true));
                    
                }
                else {
                    this.unregTimer(this.mutationTimer);
                    this.completeCallback();
                }
            }

        }, this. true));
    }
}

