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
        this.backgroundRenderDefault('gray');
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

    start(){
        this.floorsDividerSize = new V2(90, 7);
        this.floorHeight = 26;
        this.currentFloor = 0;
        this.waitingFor = ['window'];
        this.windowImgCache = [];
        this.floorsDividerImgCache = [];
        this.floorSHadowStartX = 66;
        this.floorImg = createCanvas(new V2(86, 1), (ctx, size, hlp) => {
            hlp.setFillColor('#CFC2B2').rect(0,0, this.floorSHadowStartX, 1)
            .setFillColor('#B8A294').rect(this.floorSHadowStartX,0,20, 1);
        })

        this.createFloorsDividerImages();

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

    addFloor(){
        if(this.currentFloor == 5)
            return;

        this.addGo(new HouseFloor({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y - this.floorHeight*this.currentFloor++),
            img: this.floorImg,
            floorsDividerImgCache: this.floorsDividerImgCache,
            windowImgCache: this.windowImgCache,
            floorsDividerSize: this.floorsDividerSize,
            script: {
                callbacks: {
                    completed: () => this.addFloor()
                }
            }
        }))
    }

    begin() {
        this.addFloor();
        // this.addGo(new HouseFloor({
        //     position: this.sceneCenter.clone(),
        //     img: this.floorImg
        // }))
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
            renderValuesRound: false,
        }, options)

        super(options);

    }

    init(){

        

        this.targetPosition = this.position.clone();

        this.lowerY = fast.r(this.targetPosition.y + this.targetSize.y/2);

        this.durations = [10,5];

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

        this.script.items[this.script.items.length] = function() {
            this.addChild(new HouseWindow({
                position: new V2(-25, 0),
                size: new V2(20,14),
                imgCache: this.windowImgCache, 
                prepare: false,
                completeCallback: () => this.processScript()
            }));
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