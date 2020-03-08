class Demo10KeyScene extends Scene {
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

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let layerProps = [
                    {framesCount: 400, itemsCount: 200, hsv: [180,10,20]},
                    {framesCount: 300, itemsCount: 100, hsv: [180,10,40]},
                    {framesCount: 200, itemsCount: 50, hsv: [180,10,60]}
                    
                    
                ]

                layerProps.forEach(lp => {
                    let frames = [];

                    let framesCount = lp.framesCount;
                    let itemsCount = lp.itemsCount;
                    let items = [];
    
                    let xChange = easing.createProps(framesCount-1, this.size.x-1, 0, 'linear', 'base');
                    let xValues = [];
    
                    let color = colors.hsvToHex(lp.hsv)
    
    
                    for(let f = 0; f < framesCount; f++){
                        xChange.time = f;
                        xValues[f] = fast.r(easing.process(xChange));
                    }
    
                    for(let i = 0; i < itemsCount; i++){
                        let p = new V2(getRandomInt(0, this.size.x), fast.r(getRandomGaussian(0, this.size.y)))
                        
                        items[i] = {
                            p,
                            initialIndex: getRandomInt(0, framesCount-1),
                            
                        };
                    }
    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor(color);
    
                            for(let i = 0; i < itemsCount; i++){
                                let item = items[i];
                                let currentIndex = item.initialIndex + f;
                                if(currentIndex > (framesCount-1)){
                                    currentIndex-=framesCount;
                                }
    
                                let x = xValues[currentIndex];
    
                                hlp.dot(x, item.p.y)
                            }
                        })
                    }
    
                    this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames,
                        init() {
                            if(framesCount == 400){
                                this.counter = 3;
                            }

                            this.currentFrame = 0;
                            this.img = this.frames[this.currentFrame];
            
                            this.timer = this.regTimerDefault(15, () => {
                
                                this.img = this.frames[this.currentFrame];
                                this.currentFrame++;
                                if(this.currentFrame == this.frames.length){
                                    this.currentFrame = 0;
                                    
                                    this.counter--;

                                    if(this.counter == 0){
                                        this.redFrame = this.addChild(new GO({
                                                    position: new V2(),
                                                    size: this.size,
                                                    img: createCanvas(this.size, (ctx, size, hlp) => {
                                                        hlp.setFillColor('red').strokeRect(50,50, 100, 100)
                                                    })
                                                }));
                                    }
                                }
                            })
                        }
                    }))
                })

                
            }
        }), 1)

        this.fg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let layerProps = [
                    {framesCount: 100, itemsCount: 25, hsv: [180,10,70], len: 5},
                    {framesCount: 50, itemsCount: 10, hsv: [180,10,75], len: 10},
                    // {framesCount: 300, itemsCount: 100, hsv: [180,10,40]},
                    // {framesCount: 200, itemsCount: 50, hsv: [180,10,60]}
                    
                    
                ]

                layerProps.forEach(lp => {
                    let frames = [];

                    let framesCount = lp.framesCount;
                    let itemsCount = lp.itemsCount;
                    let items = [];
    
                    let xChange = easing.createProps(framesCount-1, this.size.x-1, 0, 'linear', 'base');
                    let xValues = [];
    
                    let color = colors.hsvToHex(lp.hsv)
                    let rgb = hsvToRgb(lp.hsv[0], lp.hsv[1], lp.hsv[2], true, true)
                    //let vChange = easing.createProps(lp.len-1, lp.hsv[2], 10,'quad', 'out');
                    let aChange = easing.createProps(lp.len-1, 1, 0.1,'quad', 'out');
                    //let aValues = [];
                    let clrs = [];
                    for(let i =0; i < lp.len; i++){
                        aChange.time = i;
                        clrs[i] = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${fast.r(easing.process(aChange),2)})`;
                    }
                    // let clrs = new Array(lp.len).fill().map((el, i) => {
                    //     vChange.time = i;
                    //     let v = fast.r(easing.process(vChange));
                    //     return colors.hsvToHex([lp.hsv[0], lp.hsv[1], v])
                    // })
    
                    for(let f = 0; f < framesCount; f++){
                        xChange.time = f;
                        xValues[f] = fast.r(easing.process(xChange));
                    }
    
                    for(let i = 0; i < itemsCount; i++){
                        let p = new V2(getRandomInt(0, this.size.x), fast.r(getRandomGaussian(0, this.size.y)))
                        
                        items[i] = {
                            p,
                            initialIndex: getRandomInt(0, framesCount-1),
                            
                        };
                    }
    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            
    
                            for(let i = 0; i < itemsCount; i++){
                                let item = items[i];
                                let currentIndex = item.initialIndex + f;
                                if(currentIndex > (framesCount-1)){
                                    currentIndex-=framesCount;
                                }
    
                                let x = xValues[currentIndex];
                                for(let l = 0; l < lp.len; l++){
                                    hlp.setFillColor(clrs[l]);
                                    hlp.dot(x+l, item.p.y)
                                }
                                
                            }
                        })
                    }
    
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
                })

                
            }
        }), 3)

        this.key =this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(60,30),
            init() {

                this.particles = this.addChild(new GO({
                    position: new V2(-34, 0),
                    size: new V2(30, 10),
                    init() {
                        this.frames = [];
                        let framesCount = 100;
                        let itemsCount = 25;

                        let particles = [];
                        let xChange = easing.createProps(framesCount-1, this.size.x, 0, 'quad', 'in');
                        let aChange = easing.createProps(framesCount-1, 1, 0, 'quad', 'in');
                        let xChanges = [];
                        let aChanges = [];
                        for(let f = 0; f < framesCount; f++){
                            xChange.time = f;
                            aChange.time = f;
                            xChanges[f] = fast.r(easing.process(xChange))
                            aChanges[f] = fast.r(easing.process(aChange),1)
                        }

                        for(let i = 0; i < itemsCount; i++){
                            let y = fast.r(getRandomGaussian(0, this.size.y));

                            particles[i] = {
                                y,
                                initialX: getRandomInt(0,10),
                                inititialIndex: getRandomInt(0, xChanges.length-1)
                            }
                        }

                        for(let f = 0; f < framesCount; f++){
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let i = 0; i < itemsCount; i++){
                                    let particle = particles[i];
    
                                    let currentIndex = particle.inititialIndex + f;
                                    if(currentIndex > (xChanges.length-1)){
                                        currentIndex-=xChanges.length;
                                    }
    
                                    let x = particle.initialX + xChanges[currentIndex];
                                    hlp.setFillColor(`rgba(89,187,198, ${aChanges[currentIndex]})`).dot(x, particle.y);
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
                            }
                        })
                    }
                }))

                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(pDailyModels.keyFrames),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];

                        this.timer = this.regTimerDefault(100, () => {
            
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                
            }
        }), 2)
    }
}