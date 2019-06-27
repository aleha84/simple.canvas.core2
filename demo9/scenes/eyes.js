class EyeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: [],
            shine: {
                vClamps: [5, 40],
                currentV: 0,
            },
            eyeBall: {
                position: new V2(60, 35),
                radius: new V2(18, 30),
                centerRadius: new V2(5, 20),
                
            }
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }


    start(){
        this.leftEye = this.addGo(new Eye({
            position: new V2(150, 150),
            isLeft: true,
            shine: this.shine,
            eyeBall: this.eyeBall
        }))

        this.rightEye = this.addGo(new Eye({
            position: new V2(300, 150),
            shine: this.shine,
            eyeBall: this.eyeBall
        }))

        

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            closeOpenEyes() {
                let parent = this.parentScene;
                this.script.items = [
                    function(){
                        parent.leftEye.close(5, () => this.processScript());
                        parent.rightEye.close(5);
                    },
                    this.addProcessScriptDelay(500),
                    function(){
                        parent.leftEye.open(5, () => this.processScript());
                        parent.rightEye.open(5);
                    },
                    function() {
                        this.processScript();
                        this.shineChangeIndex = 1;
                        this.shineChange = easing.createProps(getRandomInt(30,60), parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');
                    }
                ]

                this.processScript();
            },
            eyeBallMove(position, duration) {
                let parent = this.parentScene;
                this.eyeBallMoveCount++;
                this.eyeBallPositionChange = {
                    x: easing.createProps(duration, parent.eyeBall.position.x, position.x, 'quad', 'in'),
                    y: easing.createProps(duration, parent.eyeBall.position.y, position.y, 'quad', 'in')
                }
            },
            init() {
                let parent = this.parentScene;
                this.shineChangeIndex = 1;
                this.shineChange = easing.createProps(getRandomInt(30,60), parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');

                this.eyeBallMove(new V2(70,35), 10);
                this.eyeBallMoveCount = 0;
                this.regTimerDefault(30, () => {
                    if(this.eyeBallPositionChange) {
                        parent.eyeBall.position.x = fast.r(easing.process(this.eyeBallPositionChange.x))
                        parent.eyeBall.position.y = fast.r(easing.process(this.eyeBallPositionChange.y))

                        parent.leftEye.eyeBall.position = parent.eyeBall.position;
                        parent.rightEye.eyeBall.position = parent.eyeBall.position;

                        this.eyeBallPositionChange.x.time++;
                        this.eyeBallPositionChange.y.time++;

                        if(this.eyeBallPositionChange.x.time > this.eyeBallPositionChange.x.duration){
                            this.eyeBallPositionChange = undefined;
                            if(this.eyeBallPositionChangeCompleted)
                                this.eyeBallPositionChangeCompleted();
                        }
                    }

                    if(this.shineChange) {
                        parent.shine.currentV = fast.f(easing.process(this.shineChange));
                        parent.leftEye.shine.currentV = parent.shine.currentV;
                        parent.rightEye.shine.currentV = parent.shine.currentV;
            
                        this.shineChange.time++;
                        if(this.shineChange.time > this.shineChange.duration){
                            if(this.shineChangeIndex == 0){
                                this.shineChange = undefined;
                                parent.leftEye.shine.currentV = 0;
                                parent.rightEye.shine.currentV = 0;
                                //this.closeOpenEyes();

                                this.eyeBallMove(this.eyeBallMoveCount % 2 == 0 ? new V2(70,35) : new V2(50,35), 5)
                                //return;
                            }
                            if(this.shineChangeIndex == 1) this.shineChangeIndex = 0; else this.shineChangeIndex = 1;
                            this.shineChange = easing.createProps(getRandomInt(30,60), parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');   
                        }
                    }
                    
                })
            }
        }))

        
    }
}

class Eye extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(120, 70),
            imgSize: new V2(120, 70),
            isLeft: false,
            eyeBall: {
                position: new V2(60, 35),
                radius: new V2(18, 30),
                centerRadius: new V2(5, 20),
                
            },
            shine: {
                vClamps: [5, 30],
                currentV: 30,
            },
            dots: {
                count: 200,
                duration: 80,
                hsv: [180,86, 91],
                items: []
            },
            currentUpperYArr: []
        }, options)

        super(options);
    }

    addDot() { 
        let angle = getRandomInt(0,360);
        let r = degreeToRadians(angle);
        let start = new V2(
            fast.r(0*this.eyeBall.position.x + (this.eyeBall.radius.x-1) * Math.cos(r)),
            fast.r(0*this.eyeBall.position.y + (this.eyeBall.radius.y-1) * Math.sin(r))
        );

        let end = new V2(
            fast.r(0*this.eyeBall.position.x + this.eyeBall.centerRadius.x * Math.cos(r)),
            fast.r(0*this.eyeBall.position.y + this.eyeBall.centerRadius.y * Math.sin(r))
        );

        this.dots.items[this.dots.items.length] = {
            angle,
            start, 
            end,
            change: {
                x: easing.createProps(this.dots.duration, start.x, end.x, 'quad', 'out'),
                y: easing.createProps(this.dots.duration, start.y, end.y, 'quad', 'out'),
                v: easing.createProps(this.dots.duration, this.dots.hsv[2], 4, 'quad', 'out')
            },
            current: start
        }
    }

    init() {
        if(this.imgSize === undefined) this.imgSize = this.size;

        this.upperOrigin = {
            start: -2,
            end: 1.5,
            yProportion: (y) => (this.imgSize.y*y/1.44),
            f: (x) => (Math.log10(x+2)+0.1*x*x*x)*0.5+1,
            yArr: []
        }

        this.lowerOrigin = {
            start: -2,
            end: 0.93,
            yProportion: (y) => (this.imgSize.y*y/2),
            f: (x) => 0.2*x*x*x + 0.65*x*x + 0.8*x + 0.6,
            yArr: []
        }

        this.initOrigin(this.upperOrigin);
        this.initOrigin(this.lowerOrigin);

        this.currentUpperYArr = [...this.upperOrigin.yArr];
        this.createImage();

        

        this.regTimerDefault(30, () => {
            let needCreateImage = false;
            if(this.changeX && this.changeX.length){

                for(let x = 0; x < this.changeX.length; x++){
                    if(!this.changeX[x])
                        continue;

                    this.currentUpperYArr[x] = fast.r(easing.process(this.changeX[x]));

                    this.changeX[x].time++;

                    if(this.changeX[x].time > this.changeX[x].duration){
                        this.changeX = [];
                        this.changeXCompleteCallback();
                        break;
                    }
                }

            //    needCreateImage = true;
            }

            if(this.dots.items.length < this.dots.count){
                this.addDot();
            }

            for(let i = 0; i < this.dots.items.length; i++){
                let d = this.dots.items[i];
                d.current = new V2(
                    fast.r(easing.process(d.change.x)),
                    fast.r(easing.process(d.change.y))
                )

                d.v = easing.process(d.change.v);

                d.change.x.time++;
                d.change.y.time++;
                d.change.v.time++;

                if(d.change.x.time > d.change.x.duration){
                    d.change = {
                        x: easing.createProps(this.dots.duration, d.start.x, d.end.x, 'quad', 'out'),
                        y: easing.createProps(this.dots.duration, d.start.y, d.end.y, 'quad', 'out'),
                        v: easing.createProps(this.dots.duration, this.dots.hsv[2], 4, 'quad', 'out')
                    }
                }

        //        needCreateImage = true;
            }

            this.createImage();
        })

        //this.close(4, () => this.open(4));
    }

    close(duration, callback = () => {}) {
        this.changeX = [];
        for(let x = 1; x < this.upperOrigin.yArr.length-1;x++){
            this.changeX[x] = undefined;
            if(!isFinite(this.currentUpperYArr[x]) || !isFinite(this.lowerOrigin.yArr[x])) 
                continue;
            
            this.changeX[x] = easing.createProps(duration, this.currentUpperYArr[x], this.lowerOrigin.yArr[x]+5, 'quad', 'out');
        }

        this.changeXCompleteCallback = callback;
    }

    open(duration, callback = () => {}) {
        this.changeX = [];
        for(let x = 1; x < this.upperOrigin.yArr.length-1;x++){
            this.changeX[x] = undefined;
            if(!isFinite(this.currentUpperYArr[x]) || !isFinite(this.upperOrigin.yArr[x])) 
                continue;
            
            this.changeX[x] = easing.createProps(duration, this.currentUpperYArr[x], this.upperOrigin.yArr[x], 'quad', 'out');
        }

        this.changeXCompleteCallback = callback;
    }

    initOrigin(origin) {
        let len = origin.end - origin.start;
        origin.step = len/this.imgSize.x;
        origin.xProportion = (x) => (x+len)*this.imgSize.x/len;
        origin.xBackProportion = (x) => (origin.start + x*len/this.imgSize.x);

        for(let x = 0; x < this.imgSize.x; x++) {
            let originX = origin.xBackProportion(x);
            let originY = origin.f(originX);
            origin.yArr[x] = fast.r(origin.yProportion(originY)*-1 + this.imgSize.y)-1;
        }
    }

    createImage(){
        this.img = createCanvas(this.imgSize, (ctx,size, hlp) => {
            let imgStep = fast.r(this.imgSize.x*0.1)
            //hlp.setFillColor('green').strokeRect(0,0,size.x, size.y)

            //shine
            let lo =this.lowerOrigin;
            let uo = this.upperOrigin;
            
            if(this.shineDots == undefined ){
                this.shineDots = [];
                let allShapePoints = [...lo.yArr.map((y,x) => new V2(this.isLeft ? size.x - x - 1 : x,y)), ...uo.yArr.map((y,x) => new V2(this.isLeft ? size.x - x - 1 : x,y))];
                let maxDistance = 9;

                for(let x = 0; x < size.x; x++){    
                    let _x = this.isLeft ? size.x - x - 1 : x;            
                    for(let i = 0; i < lo.yArr[_x]-uo.yArr[_x]+1; i++){
                        let p = new V2(x, uo.yArr[_x]+i);
                        let d = Math.min(...allShapePoints.map(sp => sp.distance(p)));
                        
                        let index = this.shineDots.length;
                        this.shineDots[index] = {p, fill: d < maxDistance, d, };//v: easing.process(vChange) };
                        if(this.shineDots[index].fill){
                            this.shineDots[index].vArr = [];
                            for(let i = 0; i <= this.shine.vClamps[1]; i++){
                                let vChange = easing.createProps(maxDistance, 0, i, 'quad', 'inOut');
                                vChange.time = fast.f(d);
                                this.shineDots[index].vArr[i] = easing.process(vChange);
                            }
                        }
                    }
                }

                this.shineImages = [];
                for(let j = 0; j <= this.shine.vClamps[1]; j++){
                    this.shineImages[j] = createCanvas(this.imgSize, (ctx,size, hlp) => {
                        for(let i = 0; i < this.shineDots.length; i++){
                            if(this.shineDots[i].fill){
                                hlp.setFillColor(hsvToHex({hsv: [60,86, this.shineDots[i].vArr[j]]})).dot(this.shineDots[i].p);
                            }
                        }
                    })
                }
            }

            try {
                ctx.drawImage(this.shineImages[this.shine.currentV], 0,0)
            }
            catch(e) {
                console.log(this.shine.currentV);
                throw 'Error';
            }
            

            // for(let i = 0; i < this.shineDots.length; i++){
            //     if(this.shineDots[i].fill){
            //         hlp.setFillColor(hsvToHex({hsv: [60,86, this.shineDots[i].vArr[this.shine.currentV-1]]})).dot(this.shineDots[i].p);
            //     }
            // }
            

            ctx.drawImage(
                createCanvas(this.imgSize, (ctx,size, hlp) => {
                    
                    let eyeMain = createCanvas(size, (ctx,size, hlp) => {
                        let uo = this.upperOrigin;
                        let lo =this.lowerOrigin;
    
                        
                        hlp.setFillColor('#FDFF23');
                        for(let x = 0; x < size.x; x++){    
                            let _x = this.isLeft ? size.x - x - 1 : x;       
                            let height = lo.yArr[_x]-this.currentUpperYArr[_x]+1;   
                            if(height > 0){
                                hlp.rect(x,this.currentUpperYArr[_x], 1, height);
                            }
                            
                        }
                    
                        //console.log(this.currentUpperYArr, lo.yArr)
                    });
    
                    
    
                    ctx.drawImage(eyeMain, 0,0)
                    ctx.globalCompositeOperation = 'source-atop';
                    let eyeBall = createCanvas(size, (ctx,size, hlp) => {
                        hlp.setFillColor('#E90002')
                        .elipsis(this.eyeBall.position, this.eyeBall.radius)
                        .setFillColor('#F03003').elipsis(this.eyeBall.position, new V2(10,25))
                        .setFillColor('#000200')
                        .elipsis(this.eyeBall.position, this.eyeBall.centerRadius);
    
                        //hlp.setFillColor('#F02F04');
                        for(let i = 0; i < this.dots.items.length; i++){
                            hlp
                            .setFillColor(hsvToHex({hsv: this.dots.hsv.map((el, _i) => _i == 2 ? this.dots.items[i].v : el)}))
                            .dot(this.eyeBall.position.x + this.dots.items[i].current.x, this.eyeBall.position.y + this.dots.items[i].current.y)
                        }
                    });
                    ctx.drawImage(eyeBall, 0,0)
    
                    // shadow
                    hlp.setFillColor('rgba(0,0,0,0.3)');
                    for(let x = 0; x < size.x; x++){    
                        let _x = this.isLeft ? size.x - x - 1 : x;    
                        let len = 5;            
                        if((this.isLeft && x > size.x - 6) || (!this.isLeft && x < 5))
                            len = 20;
                        hlp.rect(x,this.currentUpperYArr[_x], 1, len);
                    }

                    
                }) , imgStep,imgStep,this.imgSize.x-imgStep*2, this.imgSize.y - imgStep*2)//imgStep.x, imgStep.y, this.imgSize.x-imgStep.x*2, this.imgSize.y-imgStep.y*2);
        })
    }
}