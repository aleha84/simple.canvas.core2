class HouseScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('#41B7E9');
    }

    createFloorsDividerImages() {
        let duration = 9;
        let imgWidth = this.floorsDividerSize.x;
        let wChange = easing.createProps(duration, 2, imgWidth, 'quad', 'out');
        let center = imgWidth/2;
        let sStart = this.floorSHadowStartX + 2;
        for(let i = 0; i <=duration; i++){
            wChange.time = i;
            let width = fast.r(easing.process(wChange));
            this.floorsDividerImgCache[i] = createCanvas(this.floorsDividerSize, (ctx, size, hlp) => {
                let left = fast.r(center - width/2);
                hlp.setFillColor('#E3DCC9').rect(left, 0, width, 2)
                .setFillColor('#CFC2B2').rect(left, 2, width, 3)
                .setFillColor('#B7A193').rect(left, 5, width, 2)

                if(left + width >= sStart){
                    let shadowWidth = left + width - sStart;
                    hlp.setFillColor('#CEC2B2').rect(sStart, 0, shadowWidth, 2)
                    .setFillColor('#B8A294').rect(sStart, 2, shadowWidth, 3)
                    .setFillColor('#A07B6B').rect(sStart, 5, shadowWidth, 2)
                }
            })
        }
    }

    createDoorImages(){
        
        let currentFrame = 0;
        let frameWidth = 2;
        let frameCurrentPositions = {
            color: '#3C2130',
            top: {
                from: new V2(0,0), to: new V2(1,0), height: frameWidth
            },
            left: {
                from: new V2(0,0), to: new V2(0,1), width: frameWidth
            },
            right: {
                from: new V2(this.doorImgSize.x-frameWidth,0), to: new V2(this.doorImgSize.x-frameWidth,1), width: frameWidth
            }
        }

        let background = {
            color: '#784029',
            color1: '#E2DBC8',
            from: new V2(frameWidth,frameWidth),
            width: 0,
            height: this.doorImgSize.y-frameWidth-1
        }

        let mid = {
            color: '#3C2130',
            from: new V2(this.doorImgSize.x-6,4),
            width: 0,
            height: 6
        }

        let duration = 8;
        let type = 'quad';
        let method = 'out';
        let change = {
            top: easing.createProps(duration, 1, this.doorImgSize.x, type, method),
            lr: easing.createProps(duration, 1, this.doorImgSize.y-1, type, method),
        }; 

        

        let createImg = () => {
            this.doorImgCache[currentFrame++] = createCanvas(this.doorImgSize, (ctx, size, hlp) => {
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                let f = frameCurrentPositions;
                hlp.setFillColor(frameCurrentPositions.color)
                    .rect(f.top.from.x, f.top.from.y, f.top.to.x - f.top.from.x, f.top.height)
                    .rect(f.left.from.x, f.left.from.y, f.left.width, f.left.to.y - f.left.from.y)
                    .rect(f.right.from.x, f.right.from.y, f.right.width, f.right.to.y - f.right.from.y)
                 .setFillColor(background.color)
                    .rect(background.from.x, background.from.y, background.width, background.height)
                .setFillColor(mid.color)
                    .rect(mid.from.x, mid.from.y, mid.width, mid.height)

                if(background.width > 0){
                    hlp.setFillColor(background.color1).rect(background.from.x, background.from.y+3,1,2).rect(background.from.x, size.y-6,1,2)
                }

                if(background.width > 14){
                    hlp.setFillColor('#331B31').rect(15, 13,1,1)
                }
            });
        }

        let f = frameCurrentPositions;
        for(let i = 0; i < duration; i++){
            change.top.time = i;
            change.lr.time = i;

            f.top.to.x = fast.r(easing.process(change.top));
            f.left.to.y = fast.r(easing.process(change.lr));
            f.right.to.y = f.left.to.y;

            createImg();
        }

        duration = 5;
        change = easing.createProps(duration, 0, this.doorImgSize.x - frameWidth*2, type, method);
        for(let i = 0; i <= duration; i++){
            change.time = i;
            background.width = fast.r(easing.process(change));
            
            createImg();
        }

        duration = 5;
        change = {
            w: easing.createProps(duration, 0, 7, type, method),
            from: easing.createProps(duration, mid.from.x, mid.from.x-7, type, method)
        }
        for(let i = 0; i <= duration; i++){
            change.w.time = i;
            change.from.time = i;
            
            mid.width = fast.r(easing.process(change.w));
            mid.from.x = fast.r(easing.process(change.from));
            
            createImg();
        }

    }

    start(){
        this.floors = [];
        this.totalFloors = 5;
        this.doorImgSize = new V2(20, 22);
        this.floorsDividerSize = new V2(90, 7);
        this.floorHeight = 26;
        this.currentFloor = 0;
        this.waitingFor = ['window'];
        this.windowImgCache = [];
        this.floorsDividerImgCache = [];
        this.doorImgCache = [];
        this.floorSHadowStartX = 66;
        this.rooSize = new V2(94,12);
        this.floorImg = createCanvas(new V2(86, 1), (ctx, size, hlp) => {
            hlp.setFillColor('#CFC2B2').rect(0,0, this.floorSHadowStartX, 1)
            .setFillColor('#B8A294').rect(this.floorSHadowStartX,0,20, 1);
        });
        this.floorImgAlter = createCanvas(new V2(86, 1), (ctx, size, hlp) => {
            hlp.setFillColor('#C4B7A8').rect(0,0, this.floorSHadowStartX, 1)
            .setFillColor('#AD998C').rect(this.floorSHadowStartX,0,20, 1);
        })

        this.roofImages =  new Array(19).fill().map((_, frameIndex) => createCanvas(this.rooSize, (ctx, size, hlp) => {
            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            
            hlp.setFillColor('#404548').rect(5, 0, size.x-10, 1);
            for(let i = 1;i<=5;i++){
                let startX = 5-i;
                let y = 1+(i-1)*2;
                hlp.setFillColor('#404548').rect(startX, y, size.x - (10 -i*2), 2)
                
                for(let j = 0; j < frameIndex; j++){
                    if(i % 2 == 0){
                        if(j%2==0){
                            hlp.setFillColor('#616D6D').rect(startX+ 1 + j*4, y, 2, 1)
                        }
                        else {
                            hlp.setFillColor('#4B5053').rect(startX+ 1 + j*4, y, 2, i == 5 ? 1 :2)
                        }
                    }
                    else {
                        if(j%2==0){
                            hlp.setFillColor('#4B5053').rect(startX+ 1 + j*4, y, 2, i == 5 ? 1 :2)
                            
                        }
                        else {
                            hlp.setFillColor('#616D6D').rect(startX+ 1 + j*4, y, 2, 1)
                        }
                    }
                }

                hlp.setFillColor('#292D2E').rect(startX + 72, y,11+i*2, 2);
            }

            hlp.setFillColor('#B9A294').rect(4, size.y-1, size.x-8,1)
                .setFillColor('#AC8F87').rect(70,size.y-1,size.x-66-8, 1);
        })) 

        this.createFloorsDividerImages();
        this.createDoorImages();

        this.prepWindow = this.addGo(new HouseWindow({
            position: this.sceneCenter,
            size: new V2(new V2(14, 10).mul(3)),
            imgCache: this.windowImgCache, 
            prepare: true
        }));

        this.prepWindow.prepareImages(this.checkBegin.bind(this));

        this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+16),
            size: new V2(this.viewport.x, 14),
            img: createCanvas(new V2(this.viewport.x, 14), (ctx, size, hlp) => {
                hlp.setFillColor('#57CBFA').rect(0,0,size.x, 4);
                hlp.setFillColor('#51AC5F').rect(0,4,size.x, 4).setFillColor('#314347').rect(0,8,size.x,1).setFillColor('#221E2C').rect(0,9,size.x, 5);
                hlp.setFillColor('#B1CA55');
                let x = -10;
                while(x < size.x){hlp.dot(x, 4); x+=getRandomInt(2,4); }
                x = -10;
                while(x < size.x){hlp.dot(x, 5); x+=getRandomInt(4,7); }

                hlp.setFillColor('#316B6D');
                x = -10;
                while(x < size.x){hlp.dot(x, 6); x+=getRandomInt(4,7); }
                x = -10;
                while(x < size.x){hlp.dot(x, 7); x+=getRandomInt(2,4); }
                hlp.setFillColor('#272331');
                x = -10;
                while(x < size.x){hlp.dot(x, 8); x+=getRandomInt(2,4); }
                hlp.setFillColor('#6D3D26');
                x = -10;
                while(x < size.x){hlp.dot(x, 9); x+=getRandomInt(2,4); }
                hlp.setFillColor('#48282B');
                x = -10;
                while(x < size.x){hlp.dot(x, 9); x+=getRandomInt(4,8); }
                x = -10;
                while(x < size.x){hlp.rect(x, 10, 2,1); x+=getRandomInt(2,4); }
                hlp.setFillColor('#3E2231');
                x = -10;
                while(x < size.x){hlp.dot(x, 10); x+=getRandomInt(4,8); }
                x = -10;
                while(x < size.x){hlp.dot(x, 11); x+=getRandomInt(2,4); }
                x = -10;
                while(x < size.x){hlp.dot(x, 12); x+=getRandomInt(3,6); }
                x = -10;
                while(x < size.x){hlp.dot(x, 13); x+=getRandomInt(4,8); }
            })
        }), 0)
    }

    checkBegin(type) {
        this.waitingFor.splice(this.waitingFor.indexOf(type), 1);

        if(!this.waitingFor.length){
            this.prepWindow.setDead();
            this.begin();
        }
    }

    restart() {
        this.currentFloor = 0;
        this.begin();
    }

    moveOut(){
        let duration = 15;
        this.moveOutTimer = this.registerTimer(createTimer(25, () => {
            this.floors.shift().moveOut(duration);
            duration-=1;
            if(this.floors.length == 0){
                this.unregTimer(this.moveOutTimer);
                this.delayTimer = this.registerTimer(createTimer(1000, () => {
                    this.unregTimer(this.delayTimer);
                    this.restart();
                }, this, false));
            }
        }, this, true));
    }

    addFloor(){
        if(this.currentFloor == this.totalFloors){
            this.addRoof(() => this.moveOut())
            
            return;
        }
            

        this.floors[this.floors.length] = this.addGo(new HouseFloor({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - this.floorHeight*this.currentFloor),
            img: this.currentFloor%2 == 0 ? this.floorImg : this.floorImgAlter,
            floorsDividerImgCache: this.floorsDividerImgCache,
            windowImgCache: this.windowImgCache,
            floorsDividerSize: this.floorsDividerSize,
            doorImgCache: this.doorImgCache,
            doorImgSize: this.doorImgSize,
            addDoor: this.currentFloor == 0,
            addDivider: this.currentFloor != this.totalFloors-1,
            script: {
                callbacks: {
                    completed: () => this.addFloor()
                }
            }
        }), 10)

        this.currentFloor++
    }

    addRoof(callback) {
        this.floors[this.floors.length] = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, -10), 
            targetY: fast.r(this.sceneCenter.y - this.floorHeight*this.currentFloor + this.rooSize.y/2 +1),
            size: this.rooSize,
            roofImages: this.roofImages,
            startAnimation(callback) {
                this.timer = this.registerTimer(createTimer(30, () => {
                    this.roof.img = this.roofImages[this.currentFrame++];

                    if(this.currentFrame == this.roofImages.length){
                         this.unregTimer(this.timer);
                         this.timer = undefined;
                         //this.ventOut(callback);
                         callback();
                    }
                }, this, true));
            },
            ventOut(callback) {
                this.yChange = easing.createProps(10, this.vent.position.y, this.vent.targetY, 'quad', 'out');
                this.timer = this.registerTimer(createTimer(30, () => {
                    this.vent.position.y = easing.process(this.yChange);
                    this.yChange.time++;
                    this.vent.needRecalcRenderProperties = true;

                    if(this.yChange.time > this.yChange.duration){
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        callback();
                    }
                }, this, true));
                
            },
            moveOut(duration){
                this.xChange = easing.createProps(duration, this.position.x, this.parentScene.viewport.x + 30, 'quad', 'in');
                this.moveOutTimer = this.registerTimer(createTimer(30, () => {
                    this.position.x = easing.process(this.xChange);
                    this.needRecalcRenderProperties = true;
                    this.xChange.time++;
        
                    if(this.xChange.time > this.xChange.duration){
                        this.unregTimer(this.moveOutTimer);
                        this.moveOutTimer = undefined;
                        this.setDead();
                    }
        
                }, this, true));
            },
            init() {
                this.currentFrame = 0;  

                this.vent = this.addChild(new GO({
                    size: new V2(7,4),
                    position: new V2(25, -this.size.y/2 + 2),
                    targetY: -this.size.y/2 - 2,
                    img: createCanvas(new V2(7,4), (ctx, size, hlp) => {
                        hlp.setFillColor('#CC6E52').rect(0,0,size.x, 2)
                        .setFillColor('#86262A').rect(1,2,size.x-2, 2)
                        .setFillColor('#A93027')
                        
                        for(let y = 1;y<4;y+=2){
                            for(let x = 1; x <7; x+=2){
                                hlp.dot(x,y);
                            }
                        }
                    })
                }))

                this.roof = this.addChild(new GO({
                    size: this.size,
                    position: new V2(),
                    img: this.roofImages[this.currentFrame]
                }))

                this.script.items = [
                    function(){
                        this.yChange = easing.createProps(10, this.position.y, this.targetY, 'quad', 'in');
                        this.timer = this.registerTimer(createTimer(30, () => {
                            this.position.y = easing.process(this.yChange);
                            this.yChange.time++;
                            this.needRecalcRenderProperties = true;
        
                            if(this.yChange.time > this.yChange.duration){
                                this.unregTimer(this.timer);
                                this.timer = undefined;
                                this.processScript();
                            }
                        }, this, true));
                    },
                    function(){
                        this.yChange = easing.createProps(5, this.position.y, this.position.y-5, 'quad', 'out');
                        this.timer = this.registerTimer(createTimer(30, () => {
                            this.position.y = easing.process(this.yChange);
                            this.yChange.time++;
                            this.needRecalcRenderProperties = true;
        
                            if(this.yChange.time > this.yChange.duration){
                                this.unregTimer(this.timer);
                                this.timer = undefined;
                                this.processScript();
                            }
                        }, this, true));
                    },
                    function(){
                        this.yChange = easing.createProps(5, this.position.y, this.position.y+5, 'quad', 'inOut');
                        this.timer = this.registerTimer(createTimer(30, () => {
                            this.position.y = easing.process(this.yChange);
                            this.yChange.time++;
                            this.needRecalcRenderProperties = true;
        
                            if(this.yChange.time > this.yChange.duration){
                                this.unregTimer(this.timer);
                                this.timer = undefined;
                                this.processScript();
                            }
                        }, this, true));
                    },
                    function() {
                        this.startAnimation(() => this.processScript());
                    },
                    function() {
                        this.ventOut(() => this.processScript());
                    },
                    this.addProcessScriptDelay(300),
                    function() {
                        callback();
                    }
                ]
                
                this.processScript();
            }
        }), 10)
    }

    begin() {
        this.addFloor();
    }
}

class HouseFloor extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(86,1),
            targetSize: new V2(86,26),
            duration1: 10,
            duration2: 5,
            frameStep: 30,
            renderValuesRound: false,
            addDoor: false,
            addDivider: true,
        }, options)

        super(options);

    }

    moveOut(duration){
        this.xChange = easing.createProps(duration, this.position.x, this.parentScene.viewport.x + 50, 'quad', 'in');
        this.moveOutTimer = this.registerTimer(createTimer(30, () => {
            this.position.x = easing.process(this.xChange);
            this.needRecalcRenderProperties = true;
            this.xChange.time++;

            if(this.xChange.time > this.xChange.duration){
                this.unregTimer(this.moveOutTimer);
                this.moveOutTimer = undefined;
                this.setDead();
            }

        }, this, true));
    }

    init(){
        this.targetPosition = this.position.clone();

        this.lowerY = fast.r(this.targetPosition.y + this.targetSize.y/2);

        this.durations = [8,3];

        this.methods = ['out', 'in']
        this.targetSizesY = [{from: 1, to: this.targetSize.y*1.5}, {from: this.targetSize.y*1.5, to: this.targetSize.y}];
        this.targetPositionsY = this.targetSizesY.map(s => ({ from: this.lowerY - s.from/2, to:  this.lowerY - s.to/2}))
        this.position.y = this.targetPositionsY[0].from;

        this.script.items = new Array(this.targetPositionsY.length).fill().map((_,i) => {
            return function(){
                this.sizeYChange = easing.createProps(this.durations[i], this.targetSizesY[i].from, this.targetSizesY[i].to, 'quad', this.methods[i]);
                this.positionYChange = easing.createProps(this.durations[i], this.targetPositionsY[i].from, this.targetPositionsY[i].to, 'quad', this.methods[i]);

                this.timer = this.registerTimer(createTimer(this.frameStep, () => {
                    this.position.y= (easing.process(this.positionYChange));
                    this.size.y= (easing.process(this.sizeYChange));

                    this.needRecalcRenderProperties = true;
        
                    this.positionYChange.time++;
                    this.sizeYChange.time++;
        
                    if(this.positionYChange.time > this.positionYChange.duration){
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        this.processScript();
                    }
    
                }, this, true));
            }
        });

        if(this.addDivider){
            this.script.items[this.script.items.length] = function() {
                this.dividerSize = this.floorsDividerSize;
                this.divider = this.addChild(new GO({
                    size: this.dividerSize,
                    position: new V2(0, -fast.r(this.size.y/2))
                }));
    
                let currentFrame = 0;
                this.timer = this.registerTimer(createTimer(this.frameStep, () => {
                    this.divider.img = this.floorsDividerImgCache[currentFrame++];
                    if(currentFrame == this.floorsDividerImgCache.length){
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        this.processScript();
                    }
                }, this, true));   
            }
        }
        


        this.script.items[this.script.items.length] = function() {
            let counter = 0;
            this.processScript();
            this.windowsAddTimer = this.registerTimer(createTimer(250, () => {
                if(counter == 2){
                    this.unregTimer(this.windowsAddTimer);
                    this.windowsAddTimer  = undefined;
                    return;
                    //this.processScript()
                }

                let callback = () => {};
                if(counter == 3)
                    callback = () => this.processScript();

                if(this.addDoor && counter == 0){
                    this.addChild(new HouseWindow({
                        position: new V2(-25+(counter*30), 3),
                        size: this.doorImgSize,
                        imgCache: this.doorImgCache, 
                        prepare: false,
                        completeCallback: callback
                    }));
                }
                else {
                    this.addChild(new HouseWindow({
                        position: new V2(-25+(counter*30), 0),
                        size: new V2(20,14),
                        imgCache: this.windowImgCache, 
                        prepare: false,
                        completeCallback: callback
                    }));
                }
                

                counter++;
            }, this, true)); 
        }

        this.processScript();
    }
}

class HouseWindow extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(20, 14),
            imgSize: new V2(20, 14),
            imgCache: [],
            frameStep: 30,
            prepareFrameStep: 1,
            prepare: false,
            completeCallback: function() {}
        }, options)

        super(options);

    }

    init(){
        if(this.prepare)   
            return;

        this.currentFrame = 0;
        this.timer = this.registerTimer(createTimer(this.frameStep, () => {
            this.img = this.imgCache[this.currentFrame++];

            if(this.currentFrame == this.imgCache.length){
                this.unregTimer(this.timer);
                this.timer = undefined;
                this.completeCallback();
            }
            
        }, this, true));
    }

    prepareImages(callback) {
        this.currentFrame = 0;
        this.frameWidth = 2;
        this.frameCurrentPositions = {
            color: '#3C2130',
            top: {
                from: new V2(0,0), to: new V2(1,0), height: this.frameWidth
            },
            bottom: {
                from: new V2(this.imgSize.x-1,this.imgSize.y-this.frameWidth), to: new V2(this.imgSize.x,this.imgSize.y-1), height: this.frameWidth
            },
            left: {
                from: new V2(0,0), to: new V2(0,1), width: this.frameWidth
            },
            right: {
                from: new V2(this.imgSize.x-this.frameWidth,this.imgSize.y-this.frameWidth), to: new V2(this.imgSize.x-this.frameWidth,this.imgSize.y-1), width: this.frameWidth
            }

        }
        this.background = {
            color: '#47414D',
            from: new V2(this.frameWidth,this.frameWidth),
            // width: this.imgSize.x-this.frameWidth*2,
            // height: 0
            width: 0,
            height: this.imgSize.y-this.frameWidth*2
        }
        this.mid = {
            color: '#3C2130',
            from: new V2(this.imgSize.x/2,this.frameWidth),//this.imgSize.y-this.frameWidth),
            width: this.frameWidth/2,
            to: new V2(this.imgSize.x/2,this.frameWidth)//this.imgSize.y-this.frameWidth)
        }

        this.script.items = [
            function() {
                let duration = 8;
                let type = 'quad';
                let method = 'out';
                let change = {
                    top: easing.createProps(duration, 1, this.imgSize.x, type, method),
                    bottom: easing.createProps(duration, this.imgSize.x-1, 0, type, method),
                    left: easing.createProps(duration, 1, this.imgSize.y-1, type, method),
                    right: easing.createProps(duration, this.imgSize.y-this.frameWidth, 0, type, method)
                };
     
                let f = this.frameCurrentPositions;
                this.timer = this.registerTimer(createTimer(this.prepareFrameStep, () => {
                    f.top.to.x = fast.r(easing.process(change.top));
                    f.bottom.from.x = fast.r(easing.process(change.bottom));
                    f.left.to.y = fast.r(easing.process(change.left));
                    f.right.from.y = fast.r(easing.process(change.right));

                    change.top.time++;
                    change.bottom.time++;
                    change.left.time++;
                    change.right.time++;

                    this.createImg();
                    this.currentFrame++

                    if(change.top.time > change.top.duration){
                        this.unregTimer(this.timer);
                        this.processScript();
                    }
                }, this, true));
            },
            function() {
                let duration = 5;
                let type = 'quad';
                let method = 'out';
                let change = easing.createProps(duration, 0, this.imgSize.x - this.frameWidth*2, type, method);

                this.timer = this.registerTimer(createTimer(this.prepareFrameStep, () => {
                    this.background.width = fast.r(easing.process(change));
                    change.time++;

                    this.createImg();
                    this.currentFrame++

                    if(change.time > change.duration){
                        this.unregTimer(this.timer);
                        this.processScript();
                    }
                }, this, true));
            },
            function() {
                let duration = 8;
                let type = 'quad';
                let method = 'inOut';
                let change = easing.createProps(duration, this.frameWidth,this.imgSize.y-this.frameWidth, type, method)
     
                this.timer = this.registerTimer(createTimer(this.prepareFrameStep, () => {
                    this.mid.from.y = fast.r(easing.process(change));

                    change.time++;

                    this.createImg();
                    this.currentFrame++

                    if(change.time > change.duration){
                        this.unregTimer(this.timer);
                        this.processScript();
                    }
                }, this, true));
            },
            function() {
                callback('window');
            }
        ]

        this.processScript();
    }

    createImg(){
        this.imgCache[this.currentFrame] = createCanvas(this.imgSize, (ctx, size, hlp) => {
            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
            let f = this.frameCurrentPositions;
            hlp.setFillColor(this.frameCurrentPositions.color)
                .rect(f.top.from.x, f.top.from.y, f.top.to.x - f.top.from.x, f.top.height)
                .rect(f.bottom.from.x, f.bottom.from.y, f.bottom.to.x - f.bottom.from.x, f.bottom.height)
                .rect(f.left.from.x, f.left.from.y, f.left.width, f.left.to.y - f.left.from.y)
                .rect(f.right.from.x, f.right.from.y, f.right.width, f.right.to.y - f.right.from.y)
            .setFillColor(this.background.color)
                .rect(this.background.from.x, this.background.from.y, this.background.width, this.background.height)
            .setFillColor(this.mid.color)
                .rect(this.mid.from.x, this.mid.from.y, this.mid.width, this.mid.to.y - this.mid.from.y)
        });
    }
}