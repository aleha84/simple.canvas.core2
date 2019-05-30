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

        let imgSize = new V2(8,16);
        let startImg = createCanvas(imgSize, (ctx, size) => {
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0, size.x,size.y);
        })

        let targetImgSize = new V2(16,8);
        let targetImg = createCanvas(targetImgSize, (ctx, size) => {
            ctx.fillStyle = 'green';
            ctx.fillRect(0,0, size.x,size.y);
        })

        let thirdImgSize = new V2(5, 3);
        let thirdtImg = createCanvas(thirdImgSize, (ctx, size) => {
            ctx.fillStyle = 'white';
            ctx.fillRect(2, 0, 1,1);ctx.fillRect(1, 1, 3,1);ctx.fillRect(0, 2, 5,1);
        })

        let fourthImgSize = new V2(10,10);
        let fourthImg = PP.createImage({"general":{"originalSize":{"x":10,"y":10},"size":{"x":10,"y":10},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#df204b","fillColor":"#df204b","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":5,"y":9}},{"point":{"x":3,"y":9}},{"point":{"x":0,"y":6}},{"point":{"x":0,"y":3}},{"point":{"x":3,"y":0}},{"point":{"x":6,"y":0}},{"point":{"x":9,"y":3}},{"point":{"x":9,"y":5}},{"point":{"x":8,"y":7}},{"point":{"x":6,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#b0d12e","fillColor":"#b0d12e","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":5,"y":1}},{"point":{"x":8,"y":4}},{"point":{"x":8,"y":5}},{"point":{"x":5,"y":8}}]},{"order":2,"type":"lines","strokeColor":"#135fec","fillColor":"#135fec","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":4,"y":1}},{"point":{"x":4,"y":8}},{"point":{"x":1,"y":5}},{"point":{"x":1,"y":4}}]}]}});

        let fifthImgSize = new V2(20,20);
        let fifthImage = PP.createImage({"general":{"originalSize":{"x":20,"y":20},"size":{"x":20,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#e9ee11","fillColor":"#e9ee11","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":8,"y":0}},{"point":{"x":11,"y":0}},{"point":{"x":14,"y":9}},{"point":{"x":11,"y":19}},{"point":{"x":8,"y":19}},{"point":{"x":5,"y":9}}]},{"order":1,"type":"lines","strokeColor":"#29d6cd","fillColor":"#29d6cd","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":15,"y":2}},{"point":{"x":16,"y":1}},{"point":{"x":17,"y":2}},{"point":{"x":16,"y":3}}]},{"order":2,"type":"dots","strokeColor":"#29d6cd","fillColor":"#29d6cd","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":16,"y":15}},{"point":{"x":16,"y":17}},{"point":{"x":15,"y":16}},{"point":{"x":17,"y":16}},{"point":{"x":16,"y":16}}]},{"order":3,"type":"dots","strokeColor":"#29d6cd","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":1}},{"point":{"x":2,"y":3}},{"point":{"x":1,"y":2}},{"point":{"x":3,"y":2}},{"point":{"x":2,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#29d6cd","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":15}},{"point":{"x":2,"y":17}},{"point":{"x":1,"y":16}},{"point":{"x":3,"y":16}},{"point":{"x":2,"y":16}}]}]}});

        let sixImgSize = new V2(10, 10);
        let sixImg = createCanvas(sixImgSize, (ctx, size) => {
            for(let y = 0; y < size.y; y++){
                for(let x = 0; x < size.x; x++){
                    ctx.fillStyle = `rgb(${getRandomInt(0,255)}, ${getRandomInt(0,255)}, ${getRandomInt(0,255)})`;
                    ctx.fillRect(x,y,1,1);
                }
            }
        })

        let scale = 5;

        this.demoGo = this.addGo(new GO({
            position: this.sceneCenter,
            size: imgSize.mul(scale),
            targetSize: targetImgSize.mul(scale),
            pixels: [],
            imgCache: this.imgCache,
            //img: startImg,
            scale,
            init() {
                //let direction = 1;
                let currentIndex = 0;
                this.queue = [
                    {
                        size: imgSize.mul(scale), 
                        img: startImg, 
                        imgSize: imgSize
                    },
                    {
                        size: targetImgSize.mul(scale),
                        img: targetImg, 
                        imgSize: targetImgSize
                    },
                    {
                        size: thirdImgSize.mul(scale),
                        img: thirdtImg, 
                        imgSize: thirdImgSize
                    },
                    {
                        size: fourthImgSize.mul(scale),
                        img: fourthImg, 
                        imgSize: fourthImgSize
                    },
                    {
                        size: fifthImgSize.mul(scale),
                        img: fifthImage, 
                        imgSize: fifthImgSize
                    },
                    {
                        size: sixImgSize.mul(scale),
                        img: sixImg, 
                        imgSize: sixImgSize
                    }
                ];

                this.addScript = function(){
                    let from = this.queue[currentIndex];
                    currentIndex++;
                    
                    if(currentIndex == this.queue.length){
                        currentIndex = 0;
                    }

                    let to = this.queue[currentIndex];

                    return [
                        function() {
                            this.delayTimer = this.registerTimer(createTimer(1000, () => {
                                this.unregTimer(this.delayTimer);
                                this.processScript();
                            }, this, false))
                        },
                        function() {
                            this.startMutations(from, to, function(){
                                this.script.items.push(...this.addScript());
                                this.processScript();
                            }.bind(this));
                        },
                    ];
                }

                this.script.items = [...this.addScript()];

                this.processScript();
            },
            shiftRandom(arr) {
                if(arr.length == 0)
                    return undefined;

                if(arr.length == 1)
                    return arr.shift();

                return arr.splice(getRandomInt(0, arr.length-1), 1)[0];
            },
            startMutations(start, target, completeCallback) {
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

                if(this.pixels.length){
                    this.pixels.forEach(c => this.removeChild(c));
                }

                this.pixels = [];

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

                    // if(normal.y > 0)
                    //     normal.y*=-1;

                    let callback = function() {};
                    if(!callbackAdded && startPixel && targetPixel){
                        callback = completeCallback;
                        callbackAdded = true;
                    }

                    let midPosition = normal.mul(20*getRandom(4,6));

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
                            noInitialStartP
                        }))
                        :  this.addChild(new MutationPixel({
                            imgCache: this.imgCache,
                            position: startPixel.position,
                            midPosition: midPosition,
                            startSize: startPixel.size,
                            startColorRGB: startPixel.color,
                            fadeOut: true
                        }))
                }
            }
        }));

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
            this.addEffect(new FadeOutEffect({updateDelay: 30, effectTime: 30*this.duration/3, initOnAdd:true}));
        }
        
        this.flyOut = true;
        this.xChange = { time: 0, duration: this.duration/2, change: this.midPosition.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x }
        this.yChange = { time: 0, duration: this.duration/2, change: this.midPosition.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y }

        this.mutationTimer = this.registerTimer(createTimer(30, () => {
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

