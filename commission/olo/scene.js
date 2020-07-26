class OLOAsteroidsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 2,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'asteroids'
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

    createAsteroidsFrames({framesCount, itemsCount, itemsImages, itemFrameslengthClamps, size, brightness, sizeDivide}) {
        let frames = [];
        
        let startData = [];

        let particlesData = new Array(itemsCount*10).fill().map((el, i) => {
            let itemFrameslength = getRandomInt(itemFrameslengthClamps[0] - 20, [itemFrameslengthClamps[1] + 20])
            let xValues = easing.fast({from: size.x + 50, to: -50, steps: itemFrameslength, type: 'linear', method: 'base'})
            let startFrameIndex = getRandomInt(0, framesCount-1);

            let totalFrames = itemFrameslength;
        
            let y = getRandomInt(0, size.y);

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    x: xValues[f]
                };
            }
        
            return {
                y,
                frames
            }
        })

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let itemFrameslength = getRandomInt(itemFrameslengthClamps[0], [itemFrameslengthClamps[1]])
            let xValues = easing.fast({from: size.x + 50, to: -50, steps: itemFrameslength, type: 'linear', method: 'base'})
            let startFrameIndex; //getRandomInt(0, framesCount-1);

            if(getRandomBool()){
                startFrameIndex = getRandomInt(0, framesCount/2);
            }
            else {
                startFrameIndex = getRandomInt(framesCount/2, framesCount - 1);
            }

            let totalFrames = itemFrameslength;
        
            let y = getRandomInt(20, size.y-20);

            let itemImg = itemsImages[getRandomInt(0, itemsImages.length-1)];
            if(i < itemsImages.length)
                itemImg = itemsImages[i];

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    x: xValues[f]
                };
            }
        
            return {
                y,
                itemImg,
                xValues,
                frames
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < particlesData.length; p++){
                    let itemData = particlesData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor('#CCCCCC').dot(itemData.frames[f].x, itemData.y);
                    }
                }

                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        if(sizeDivide){
                            let size = itemData.itemImg.size.divide(sizeDivide).toInt();
                            ctx.drawImage(itemData.itemImg.img, itemData.frames[f].x, itemData.y, size.x, size.y);
                        }
                        else 
                            ctx.drawImage(itemData.itemImg.img, itemData.frames[f].x, itemData.y);
                    }
                    
                }
            });
        }

        console.log('asteroids frames created')
        
        return frames.map(f => createCanvas(size, (ctx, size, hlp) => {
            if(brightness)
                ctx.filter = `brightness(${brightness}%)`;

            ctx.drawImage(f, 0,0);
        }));
    }

    start(){


        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBgFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let color = colors.hsvToHex([1,0,getRandomInt(10,20)]);
                    let itemFrameslength = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                    itemFrameslength = framesCount;
                    let x = getRandomInt(0, size.x)
                    let y = getRandomInt(0, size.y);
                    let to = x;

                    if(getRandomInt(0,2) == 2) {
                        to = x- 2;
                        itemFrameslength = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                        color = colors.hsvToHex([1,0,getRandomInt(30,60)]);
                    }
                        

                    let xValues = easing.fast({from: x, to: to, steps: itemFrameslength, type: 'quad', method: 'inOut'}).map(x => fast.r(x));
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            x: xValues[f]
                        };
                    }
                
                    return {
                        y,
                        color,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('black').rect(0,0,size.x, size.y);
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.color).dot(itemData.frames[f].x, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createBgFrames({framesCount: 200, itemsCount: 6000, itemFrameslengthClamps:[20,40], size: this.size})

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
        }), 1)

        OLOAsteroidsScene.models.style1.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.style2.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.style3.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.type4.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.type5.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.type6.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.type7_64.main.layers.forEach(l => l.visible = true);
        OLOAsteroidsScene.models.type8_64.main.layers.forEach(l => l.visible = true);

        let farAsteroids = [
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1', 'resources_t2', 'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [  'resources_t2', 'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1',  'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1', 'resources_t2', ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [ 'resources_t1', 'resources_t2', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t2', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t1', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t1', 'resources_t2' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type6, { exclude: [ 'resources_t1' ] }),
                size: new V2(20, 25)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type6, { exclude: [ ] }),
                size: new V2(20, 25)
            },
        ]

        this.far = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createAsteroidsFrames({ framesCount: 600, itemsCount: 50, itemsImages: farAsteroids, 
                itemFrameslengthClamps: [550,600], size: this.viewport, brightness: 40, sizeDivide: 1.3  }),
            init() {
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
        }), 3)

        let far2asteroids = [
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1', 'resources_t2', 'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [  'resources_t2', 'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1',  'resources_t3' ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style3, { exclude: [ 'resources_t1', 'resources_t2', ] }),
                size: new V2(30, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [ 'resources_t1', 'resources_t2', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t2', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t1', 'resources_t3' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style2, { exclude: [  'resources_t1', 'resources_t2' ] }),
                size: new V2(20, 20)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type6, { exclude: [ 'resources_t1' ] }),
                size: new V2(20, 25)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type6, { exclude: [ ] }),
                size: new V2(20, 25)
            },
        ]

        this.far2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createAsteroidsFrames({ framesCount: 600, itemsCount: 30, itemsImages: far2asteroids, itemFrameslengthClamps: [450,500], size: this.viewport, brightness: 60  }),
            init() {
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
        }), 5)

        let midAsteroids = [
            {
                img: PP.createImage(OLOAsteroidsScene.models.style1, { exclude: [ 'resource_t1', 'resource_t2', 'resource_t3' ] }),
                size: new V2(32, 32)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style1, { exclude: [  'resource_t2', 'resource_t3' ] }),
                size: new V2(32, 32)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style1, { exclude: [ 'resource_t1', 'resource_t3' ] }),
                size: new V2(32, 32)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.style1, { exclude: [ 'resource_t1', 'resource_t2',  ] }),
                size: new V2(32, 32)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type4, { exclude: [ 'resource_t1' ] }),
                size: new V2(40, 40)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type4, { exclude: [ ] }),
                size: new V2(40, 40)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type5, { exclude: [ 'resource_t1' ] }),
                size: new V2(40, 30)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type5, { exclude: [ ] }),
                size: new V2(40, 30)
            },
        ]

        this.mid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createAsteroidsFrames({ framesCount: 600, itemsCount: 30, itemsImages: midAsteroids, itemFrameslengthClamps: [350,350], size: this.viewport, brightness: 80  }),
            init() {
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
        }), 20)

        let closestAsteroids = [
            {
                img: PP.createImage(OLOAsteroidsScene.models.type7_64, { exclude: [ 'resource_t1', 'flattening-borders' ] }),
                size: new V2(64, 64)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type7_64, { exclude: [ 'flattening-borders' ] }),
                size: new V2(64, 64)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type8_64, { exclude: [ 'resource_t1', 'flatten-edges' ] }),
                size: new V2(64, 64)
            },
            {
                img: PP.createImage(OLOAsteroidsScene.models.type8_64, { exclude: [ 'flatten-edges' ] }),
                size: new V2(64, 64)
            },
        ]

        this.close = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createAsteroidsFrames({ framesCount: 600, itemsCount: 20, itemsImages: closestAsteroids, itemFrameslengthClamps: [100,100], size: this.viewport  }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let counter = 2;
                this.timer = this.regTimerDefault(10, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        counter--;
                        if(counter == 0){
                            this.parentScene.capturing.stop = true;
                        }
                    }
                })
            }
        }), 30)
    }
}