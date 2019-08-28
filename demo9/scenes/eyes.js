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
                center: new V2(60, 35),
                xClamp: [-20, 20],
                yClamp: [-15,15],
                position: new V2(60, 35),
                centerRadius: new V2(5, 20),
                blinkDelta: new V2()
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

        this.eyesCloseOpenManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            closeOpenEyes() {
                let parent = this.parentScene;
                this.script.items = [
                    function(){
                        parent.leftEye.close(5, () => this.processScript());
                        parent.rightEye.close(5);
                    },
                    function(){
                        this.coDelayTimer = this.registerTimer(createTimer(100, () => {
                            this.unregTimer(this.coDelayTimer);
                            this.coDelayTimer = undefined;
                            this.processScript();
                        }, this, false));
                    },
                    function(){
                        parent.leftEye.open(5, () => this.processScript());
                        parent.rightEye.open(5);
                    },
                    function() {
                        this.processScript();
                        parent.sceneManager.startShine();
                    }
                ]

                this.processScript();
            },
        }))
        

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            stopShineCallback: () => {},
            // closeOpenEyes() {
            //     let parent = this.parentScene;
            //     this.script.items = [
            //         function(){
            //             parent.leftEye.close(5, () => this.processScript());
            //             parent.rightEye.close(5);
            //         },
            //         function(){
            //             this.coDelayTimer = this.registerTimer(createTimer(100, () => {
            //                 this.unregTimer(this.coDelayTimer);
            //                 this.coDelayTimer = undefined;
            //                 this.processScript();
            //             }, this, false));
            //         },
            //         function(){
            //             parent.leftEye.open(5, () => this.processScript());
            //             parent.rightEye.open(5);
            //         },
            //         function() {
            //             this.processScript();
            //             this.startShine();
            //         }
            //     ]

            //     this.processScript();
            // },
            stopShine(callback) {
                this.stopShineCallback = callback;
                this.shouldStopShine = true;
            },
            startShine() {
                let parent = this.parentScene;
                this.shineChangeIndex = 1;
                this.shineChange = easing.createProps(this.shineChangeDuration, parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');
            },
            eyeBallMove(position, duration) {
                let parent = this.parentScene;
                this.eyeBallMoveCount++;
                this.eyeBallPositionChange = {
                    x: easing.createProps(duration, parent.eyeBall.position.x, position.x, 'quad', 'in'),
                    y: easing.createProps(duration, parent.eyeBall.position.y, position.y, 'quad', 'in')
                }

                this.eyeBallPositionChangeCompleted = () => {
                    this.startShine();
                }
            },
            init() {

                let parent = this.parentScene;
                this.shineChangeIndex = 1;
                this.shineChangeDuration = 35;
                this.shouldStopShine = false;
                //this.shineChange = easing.createProps(this.shineChangeDuration, parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');

                //this.eyeBallMove(new V2(70,35), 10);
                this.eyeBallMoveCount = 0;
                this.blinkDeltaChangeCount = 0;

                this.regTimerDefault(30, () => {

                    // if(this.blinkDeltaChangeCount-- == 0){
                    //     let blinkDelta =new V2(getRandomInt(0,1),getRandomInt(0,1));
                    //     parent.leftEye.eyeBall.blinkDelta = blinkDelta;
                    //     parent.rightEye.eyeBall.blinkDelta = blinkDelta;
                    //     this.blinkDeltaChangeCount= 2;
                    // }
                    

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
                            if(this.shineChangeIndex == 0 ){
                                this.shineChange = undefined;
                                parent.leftEye.shine.currentV = 0;
                                parent.rightEye.shine.currentV = 0;
                                if(this.shouldStopShine){
                                    this.shouldStopShine = false;
                                    this.stopShineCallback()
                                    return;
                                }

                                switch(getRandomInt(0,1)){
                                    case 0:
                                        //this.closeOpenEyes();
                                        parent.eyesCloseOpenManager.closeOpenEyes();
                                        break;
                                    case 1:
                                        
                                        let delta = new V2(getRandomInt(parent.eyeBall.xClamp[0], parent.eyeBall.xClamp[1]),getRandomInt(parent.eyeBall.yClamp[0], parent.eyeBall.yClamp[1]))
                                        delta.x = fast.c(delta.x/5)*5;
                                        delta.y = fast.c(delta.y/5)*5;

                                        if(getRandomInt(0,2) == 0){
                                            delta = new V2();     
                                        }

                                        this.eyeBallMove(new V2(parent.eyeBall.center).add(delta), 5)
                                        break;
                                }
                                
                                return;
                            }
                         
                            if(this.shineChangeIndex == 1) this.shineChangeIndex = 0; else this.shineChangeIndex = 1;
                            this.shineChange = easing.createProps(this.shineChangeDuration, parent.shine.currentV, parent.shine.vClamps[this.shineChangeIndex], 'quad', 'inOut');   
                        }
                    }
                    
                });

                this.script.items = [
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(100, () => {
                            this.unregTimer(this.delayTimer);
                            this.delayTimer = undefined;
                            this.processScript();
                        }, this, false));
                    },
                    function(){
                        parent.leftEye.close(5, () => this.processScript());
                        parent.rightEye.close(5);
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(2000, () => {
                            this.unregTimer(this.delayTimer);
                            this.delayTimer = undefined;
                            this.processScript();
                        }, this, false));
                    },
                    function(){
                        parent.leftEye.open(100, () => this.processScript());
                        parent.rightEye.open(100);
                    },
                    function() {
                        this.startShine();
                        this.processScript();
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(45000, () => {
                            this.unregTimer(this.delayTimer);
                            this.delayTimer = undefined;
                            this.processScript();
                        }, this, false));
                    },
                    function() {
                        this.stopShine(() => this.processScript());
                    },
                    function(){
                        parent.leftEye.close(100, () => this.processScript());
                        parent.rightEye.close(100);
                    }
                ];

                this.processScript();
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
                blinkDelta: new V2()
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

                d.v = fast.r(easing.process(d.change.v));
                
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

    drawEllips({hlp, color= 'white',from = 0, to = 360, step = 0.1, origin, width, height}){
        if(height == undefined)
            height = width/2;

        hlp.setFillColor(color);
        for(let angle = from; angle < to; angle+=step){
            let r = degreeToRadians(angle);
            let x = fast.r(origin.x + width * Math.cos(r));
            let y = fast.r(origin.y + height * Math.sin(r));

            hlp.dot(x,y);
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
            

            ctx.drawImage(
                createCanvas(this.imgSize, (ctx,size, hlp) => {
                    
                    let eyeMain = createCanvas(size, (ctx,size, hlp) => {
                        let uo = this.upperOrigin;
                        let lo =this.lowerOrigin;
                        let width = 60;
                        let lightChangeS = easing.createProps(width, 0.7, 0, 'quad', 'out');
                        let lightChangeE = easing.createProps(width, 0, 0.7, 'quad', 'in');
                        
                        //hlp.setFillColor('#FDFF23');
                        for(let x = 0; x < size.x; x++){    
                            let _x = this.isLeft ? size.x - x - 1 : x;       
                            let height = lo.yArr[_x]-this.currentUpperYArr[_x]+1;   
                            if(height > 0){
                                hlp.setFillColor('#FDFF23').rect(x,this.currentUpperYArr[_x], 1, height);

                                if(x < width){
                                    lightChangeS.time = x;
                                    hlp.setFillColor(`rgba(255,255,255, ${fast.f(easing.process(lightChangeS), 1)})`).rect(x,this.currentUpperYArr[_x], 1, height);
                                }
                                else if(x > size.x - width){
                                    lightChangeE.time = size.x-x - width;
                                    hlp.setFillColor(`rgba(255,255,255, ${fast.f(easing.process(lightChangeE), 1)})`).rect(x,this.currentUpperYArr[_x], 1, height);
                                }
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

                        for(let i = 0; i < this.dots.items.length; i++){
                            hlp
                            .setFillColor(hsvToHex({hsv: this.dots.hsv.map((el, _i) => _i == 2 ? this.dots.items[i].v : el)}))
                            .dot(this.eyeBall.position.x + this.dots.items[i].current.x, this.eyeBall.position.y + this.dots.items[i].current.y)
                        }

                        let type = 'linear';
                        let method = 'base'
                        let length = 3
                        let startChange = easing.createProps(length, 0, 5, type, method);
                        let endChange = easing.createProps(length, 30, 25, type, method);

                        for(let i = 0; i <=length; i++){
                            this.drawEllips({hlp, color: 
                                'rgba(255,255,255,0.3)',
                                from: easing.process(startChange),
                                to: easing.process(endChange), step: 0.5, origin: this.eyeBall.position.add(this.eyeBall.blinkDelta), width: this.eyeBall.radius.x - 5 - i, height: this.eyeBall.radius.y - 5- i});
                            startChange.time++;
                            endChange.time++;
                        }

                        length = 2
                        startChange = easing.createProps(length, 100, 101, type, method);
                        endChange = easing.createProps(length, 130, 125, type, method);
                        for(let i = 0; i <=length; i++){
                            this.drawEllips({hlp, color: 
                                'rgba(255,255,255,0.3)',
                                from: easing.process(startChange),
                                to: easing.process(endChange), step: 0.5, origin: this.eyeBall.position.add(this.eyeBall.blinkDelta), width: this.eyeBall.radius.x - 5 - i, height: this.eyeBall.radius.y - 5- i});
                            startChange.time++;
                            endChange.time++;
                        }
                    });
                    ctx.drawImage(eyeBall, 0,0)
    
                    // shadow
                    let width = 30;
                    let lenChangeS = easing.createProps(width, 20, 6, 'cubic', 'out');
                    let lenChangeE = easing.createProps(width, 6, 0, 'quad', 'in');
                    
                    for(let x = 0; x < size.x; x++){    
                        let _x = this.isLeft ? size.x - x - 1 : x;    
                        let len = 6;            

                        if((!this.isLeft && x < width) || (this.isLeft && x > size.x - width)){
                            lenChangeS.time = this.isLeft ? size.x - x - 1 : x;
                            len = fast.r(easing.process(lenChangeS));
                        }
                        else if((!this.isLeft && x > size.x - width) || (this.isLeft && x < width)){
                            lenChangeE.time = this.isLeft ? width - x : x - (size.x-width);
                            len = fast.r(easing.process(lenChangeE));
                        }
                    
                        hlp.setFillColor('rgba(0,0,0,0.3)');
                        hlp.rect(x,this.currentUpperYArr[_x], 1, len);
                        hlp.rect(x,this.currentUpperYArr[_x], 1, 2);
                    }

                    
                }) , imgStep,imgStep,this.imgSize.x-imgStep*2, this.imgSize.y - imgStep*2)//imgStep.x, imgStep.y, this.imgSize.x-imgStep.x*2, this.imgSize.y-imgStep.y*2);
        })
    }
}