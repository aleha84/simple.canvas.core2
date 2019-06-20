class HouseScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault('gray');
    }

    start(){
        this.waitingFor = ['window'];
        this.windowImgCache = [];
        this.floorImg = createCanvas(new V2(86, 1), (ctx, size, hlp) => {
            hlp.setFillColor('#CFC2B2').rect(0,0, 66, 1)
            .setFillColor('#B8A294').rect(66,0,20, 1);
        })

        this.prepWindow = this.addGo(new HouseWindow({
            position: this.sceneCenter,
            size: new V2(new V2(14, 10).mul(3)),
            imgCache: this.windowImgCache, 
            prepare: true
        }));

        this.prepWindow.prepareImages(this.checkBegin.bind(this));
    }

    checkBegin(type) {
        this.waitingFor.splice(this.waitingFor.indexOf(type), 1);

        if(!this.waitingFor.length){
            this.prepWindow.setDead();
            this.begin();
        }
    }

    begin() {
        this.addGo(new HouseFloor({
            position: this.sceneCenter.clone(),
            img: this.floorImg
        }))
        // this.addGo(new HouseWindow({
        //     position: this.sceneCenter,
        //     size: new V2(new V2(20,14).mul(3)),
        //     imgCache: this.windowImgCache, 
        //     prepare: false
        // }));
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
        }, options)

        super(options);

    }

    init(){
        this.targetPosition = this.position.clone();
        this.targetSizeMidY =  fast.r(this.targetSize.y*1.2);
        this.targetPositionMidY = fast.r(this.targetPosition.y - (this.targetSizeMidY - this.targetSize.y)/2);
        this.position.y = fast.r(this.position.y + this.targetSizeMidY/2);
        
        this.script.items = [
            function() {
                //this.position.y = fast.r(this.position.y + this.targetSize.y/2);
                this.sizeYChange = easing.createProps(this.duration1, 1, this.targetSizeMidY, 'quad', 'out');
                this.positionYChange = easing.createProps(this.duration1, this.position.y, this.targetPositionMidY, 'quad', 'out');

                this.timer = this.registerTimer(createTimer(this.frameStep, () => {
                    this.position.y= easing.process(this.positionYChange);
                    this.size.y= easing.process(this.sizeYChange);
                    this.needRecalcRenderProperties = true;
        
                    this.positionYChange.time++;
                    this.sizeYChange.time++;
        
                    if(this.positionYChange.time > this.positionYChange.duration){
                        this.unregTimer(this.timer);
                        this.timer = undefined;
                        this.processScript();
                    }
        
                }, this, true));
            },
            // function() {
            //     this.sizeYChange = easing.createProps(this.duration2, this.size.y, this.targetSize.y, 'quad', 'out');
            //     this.positionYChange = easing.createProps(this.duration2, this.position.y, this.targetPosition.y, 'quad', 'out');

            //     this.timer = this.registerTimer(createTimer(this.frameStep, () => {
            //         this.position.y= easing.process(this.positionYChange);
            //         this.size.y= easing.process(this.sizeYChange);
            //         this.needRecalcRenderProperties = true;
        
            //         this.positionYChange.time++;
            //         this.sizeYChange.time++;
        
            //         if(this.positionYChange.time > this.positionYChange.duration){
            //             this.unregTimer(this.timer);
            //             this.timer = undefined;
            //             this.processScript();
            //         }
        
            //     }, this, true));
            // }
        ]

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
            width: this.imgSize.x-this.frameWidth*2,
            height: 0
        }
        this.mid = {
            color: '#3C2130',
            from: new V2(this.imgSize.x/2,this.imgSize.y-this.frameWidth),
            width: this.frameWidth/2,
            to: new V2(this.imgSize.x/2,this.imgSize.y-this.frameWidth)
        }

        this.script.items = [
            function() {
                let duration = 10;
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
                let duration = 7;
                let type = 'quad';
                let method = 'out';
                let change = easing.createProps(duration, 0, this.imgSize.y - this.frameWidth*2, type, method);

                this.timer = this.registerTimer(createTimer(this.prepareFrameStep, () => {
                    this.background.height = fast.r(easing.process(change));
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
                let duration = 10;
                let type = 'quad';
                let method = 'inOut';
                let change = easing.createProps(duration, this.imgSize.y-this.frameWidth, this.frameWidth, type, method)
     
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