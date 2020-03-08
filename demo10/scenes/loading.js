class Demo10Loading1Scene extends Scene {
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

    getPixels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;
            let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] 

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        return pixels;
    }

    getDimensions(pixels = []){
        let positions = pixels.map(pxl => pxl.position);
        let maxX = Math.max.apply(null, positions.map(p => p.x));
        let maxY = Math.max.apply(null, positions.map(p => p.y));
        let minX = Math.min.apply(null, positions.map(p => p.x));
        let minY = Math.min.apply(null, positions.map(p => p.y));

        return {
            minX,
            minY,
            width: fast.r(maxX-minX),
            height: fast.r(maxY-minY)
        }
    }

    toCenter(pixels = []) {
        let pixelsDimensions = this.getDimensions(pixels);
        let pixelsShift = new V2(-pixelsDimensions.minX, -pixelsDimensions.minY).add(this.sceneCenter)
            .substract(new V2(pixelsDimensions.width/2, pixelsDimensions.height/2)).toInt();

            pixels.forEach(pxl => {
            pxl.position.add(pixelsShift, true)
        });
    }

    createImgFrames(img1, imgSize = new V2(20,20)) {
        let img1Pixels = this.getPixels(img1, imgSize);
        this.toCenter(img1Pixels);

        let frames = [];
        let framesCount = 30;

        let particles = [];
        let aChange = easing.createProps(framesCount-1, 0, 1, 'quad', 'in');

        for(let i = 0; i < img1Pixels.length; i++){
            let xShift = getRandomInt(30, 50);
            let xChange = easing.createProps(framesCount-1, xShift, 0, 'cubic', 'out');
            particles[i] = {
                initialP: img1Pixels[i].position.clone(),
                color: img1Pixels[i].color,
                xChange
            }
        }

        for(let f = 0; f < framesCount; f++){
            aChange.time = f;
            let a = fast.r(easing.process(aChange),2);
            frames[frames.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let i = 0; i < particles.length; i++){
                    let pxl = particles[i];
                    pxl.xChange.time = f;
                    hlp.setFillColor(colors.rgbToString({value: pxl.color, opacity: a})).dot(pxl.initialP.x , pxl.initialP.y+ fast.r(easing.process(pxl.xChange)));
                }
            })
            
        }

        for(let f = 0; f < 5; f++){
            frames[frames.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let i = 0; i < img1Pixels.length; i++){
                    hlp.setFillColor(colors.rgbToString({value: img1Pixels[i].color})).dot(img1Pixels[i].position.x, img1Pixels[i].position.y)
                }
            })
        }


        particles = [];
        aChange = easing.createProps(framesCount-1, 1, 0, 'quad', 'out');
        for(let i = 0; i < img1Pixels.length; i++){
            let xShift = getRandomInt(30, 50);
            let xChange = easing.createProps(framesCount-1, 0, -xShift, 'sin', 'in');
            particles[i] = {
                initialP: img1Pixels[i].position.clone(),
                color: img1Pixels[i].color,
                xChange
            }
        }

        for(let f = 0; f < framesCount; f++){
            aChange.time = f;
            let a = fast.r(easing.process(aChange),2);
            frames[frames.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                for(let i = 0; i < particles.length; i++){
                    let pxl = particles[i];
                    pxl.xChange.time = f;
                    hlp.setFillColor(colors.rgbToString({value: pxl.color, opacity: a})).dot(pxl.initialP.x , pxl.initialP.y+ fast.r(easing.process(pxl.xChange)));
                }
            })
            
        }

        return frames;
    }

    addFramesData(frames) {
        let fdItem = {
            frames
        }

        if(this.framesData.length == 0){
            fdItem.from = 0;
            fdItem.to = frames.length
        }
        else {
            let last = this.framesData[this.framesData.length-1];
            let half = fast.r(last.frames.length/2);
            let from = last.to - half;
            let to = from + frames.length;

            fdItem.from = from;
            fdItem.to = to;
        }

        this.framesData[this.framesData.length] = fdItem;
    }

    start(){
        this.framesData = [];

        let model = Demo10Loading1Scene.models.main();

        model.main.layers.forEach(l => l.visible = true);

        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'L' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'O' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'A' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'D' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'I' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'N' })))
        this.addFramesData(this.createImgFrames(PP.createImage(model, { renderOnly: 'G' })))

        let frames = []

        for(let f = 0; f < this.framesData[this.framesData.length-1].to; f++){
            frames[frames.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
                this.framesData.forEach(fd => {
                    if(f >= fd.from && f < fd.to){
                        ctx.drawImage(fd.frames[f- fd.from], 0,0)
                    }
                })

            })
        }

        for(let f = 0; f < 10; f++){
            frames[frames.length] = createCanvas(this.viewport, (ctx, size, hlp) => {
            })
        }

        let demo = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.mul(2),
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
        }), 1)
    }
}