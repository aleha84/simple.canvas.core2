class RainScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 8
            }
        }, options);

        super(options);

        this.rainDropCache = [];

        //layers
        this.skyLayer = 0;
        this.backBuildingsLayer = 1;
        this.backStreamLayer = 1
        this.midBuildingsLayer = 4;
        this.midStreamLayer = 4;
        this.frontBuildingsLayer = 7;
        this.buildingsLayers = [this.backBuildingsLayer, this.midBuildingsLayer, this.frontBuildingsLayer];
        this.backgroundRainLayer = 10;
        this.roadSideLayer = 11;
        this.roadLayer = 12;
        this.floorLayer =13;
        this.middleRainLayer = 20;
        this.frontalRainLayer = 30;

        //sizes
        this.floorSize = new V2(this.viewport.x, 60);
        this.roadSize = new V2(this.viewport.x, 35);
        this.fenceColumnSize = new V2(10, 15);
        this.roadSideSize = new V2(this.viewport.x, 10);
        this.backStreamSize = new V2(0.75,0.75);

        //positions
        this.backStreamHeight = 78;
        this.midStreamHeight = 80;

        // counters
        this.fenceColumnsCount = 8;
        this.backBuildingsCount = 16;
        this.minBuildingsCount = 12;
        this.frontBuildingsCount = 8;
        this.buildingsCount = [this.backBuildingsCount, this.minBuildingsCount, this.frontBuildingsCount];

        //backBuildings
        let widthStep = 20;
        let heightFromTo = [3/5, 7/8];
        for(let li = 0; li < this.buildingsCount.length; li++){
            for(let i = 0; i < this.buildingsCount[li]; i++){
                
                this.addGo(new GO({
                    position: new V2(getRandom(0, this.viewport.x), this.viewport.y/2+this.viewport.y*1/6*li),
                    size: new V2(
                        getRandom(widthStep+(widthStep*li/2),widthStep*2+widthStep*li), 
                        getRandom(this.viewport.y*heightFromTo[0], this.viewport.y*heightFromTo[1])
                    ),
                    img: this.buildingGenerator(li)
                }), this.buildingsLayers[li]);
            }
        }
        
        //roadside
        let roadSide = new GO({
            size: this.roadSideSize, 
            position: new V2(this.viewport.x/2, this.viewport.y-this.floorSize.y-this.roadSize.y -this.roadSideSize.y/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#2C3138';
                ctx.fillRect(0,0,size.x, size.y)
            })
        });
        let segmentWidth = this.roadSideSize.x/this.fenceColumnsCount;
        for(let ci = 0; ci < this.fenceColumnsCount; ci++){
            roadSide.addChild(new GO({
                size: this.fenceColumnSize, 
                position: new V2(-this.roadSideSize.x/2 + segmentWidth*ci+segmentWidth/2, -this.fenceColumnSize.y/2),
                img: createCanvas(new V2(50,50), this.fenceGenerator)
            }))
        }
        this.addGo(roadSide, this.roadSideLayer);

        //road
        let road = new GO({
            size: this.roadSize,
            position: new V2(this.viewport.x/2, this.viewport.y-this.floorSize.y-this.roadSize.y/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#2C3746';
                ctx.fillRect(0,0,size.x, size.y)
            })
        });

        //border
        road.addChild(new GO({
            size: new V2(this.roadSize.x, this.roadSize.y*0.1),
            position: new V2(0, -this.roadSize.y/2+(this.roadSize.y*0.1)/2),
            img: createCanvas(new V2(50,50), function(ctx, size){
                ctx.fillStyle = '#1B2232';
                ctx.fillRect(0,0,size.x, size.y)
            })
        }));
        this.addGo(road, this.roadLayer);

        // floor
        this.addGo(new GO({
            size: this.floorSize,
            position: new V2(this.viewport.x/2, this.viewport.y - this.floorSize.y/2),
            img: createCanvas(new V2(50, 50), function(ctx, size){
                let grd = ctx.createLinearGradient(size.x/2, size.y, size.x/2, 0);
                grd.addColorStop(0, '#AAAAAA');
                grd.addColorStop(1, '#505050');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0,size.x, size.y)
            })
        }), this.floorLayer);

        // images
        this.rainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'blue';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.midRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'darkblue';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.backRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'black';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.recreatedRainDropImg = createCanvas(new V2(5,50), function(ctx, size){
            ctx.fillStyle = 'green';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.splashImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = 'red';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.backSplashImg = createCanvas(new V2(10, 10), function(ctx, size){
            ctx.fillStyle = 'darkred';
            ctx.fillRect(0,0, size.x, size.y);
        });

        this.streamItemRedImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(190, 0, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemBrightRedImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemYelloImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(200, 200, 0)';
            ctx.fillRect(0,0, size.x, size.y);
        })

        this.streamItemBrightYelloImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'yellow';
            ctx.fillRect(0,0, size.x, size.y);
        })

        //streams
        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.midStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,2);
            this.addGo(new StreamItem({
                img: this.streamItemRedImg,
                brightImg: this.streamItemBrightRedImg,
                position: new V2(i, h),
                destination: new V2(this.viewport.x+1, h)
            }), this.midStreamLayer);
        }

        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.backStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,1.5);
            this.addGo(new StreamItem({
                img: this.streamItemYelloImg,
                brightImg: this.streamItemBrightYelloImg,
                position: new V2(i, h),
                destination: new V2(-1, h),
                size: this.backStreamSize,
            }), this.backStreamLayer);
        }
        

        // timers
        this.rainDropTimer = createTimer(50, this.rainDropTimerMethod, this, true);
        this.midRainDropTimer = createTimer(50, this.midRainDropTimerMethod, this, true);
         this.backRainDropTimer = createTimer(50, this.backRainDropTimerMethod, this, true);

        this.backStraemTimer = createTimer(175, this.backStreamTimerMethod, this, true);
        this.midStraemTimer = createTimer(175, this.midStreamTimerMethod, this, true);
    }

    fenceGenerator(ctx, size) {
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0,0,size.x, size.y);
    }

    buildingGenerator(howFar){
        return createCanvas(new V2(100, 500), function(ctx, size){
            let darkWindows = [[32,64, 74], [53,100,136]]
            let brightWindows = [[93, 158,209], [176,208,223]];
            let windowColors = ['#2D5B80', '#92BDC7', '#2E5061', '#2A4A5D', '#69888A', '#1B363F', '#213D54', '#43799D', '#4D8FBA', '#36687E', '#395059', '#5C95AB'];
            let windowSize = new V2(5,2);
            
            switch(howFar){
                case 0:
                    ctx.fillStyle = '#142833';
                    break;
                case 1: 
                    ctx.fillStyle = '#A79FE1';
                    break;
                case 2:
                    ctx.fillStyle = '#A79FFF';
                    break;
            }

            //let gapHeight = windowSize.y*0.5;

            ctx.strokeStyle = '#1C5561';
            ctx.lineWidth = 3;
            ctx.fillRect(0,0, size.x, size.y);
            ctx.strokeRect(0,0, size.x, size.y);

            if(howFar == 0){
                let rCount = parseInt(size.y/windowSize.y);
                let cCount = parseInt(size.x/windowSize.x);
                for(let ri = 0; ri < rCount; ri++){
                    if(ri%2 == 0)
                        continue;

                    if(getRandomInt(0,20) === 20)
                        continue;

                    for(let ci = 0; ci < cCount; ci++){
                        if(getRandomInt(0,4) === 4)
                            continue;

                        ctx.fillStyle =// getRandomInt(0,10) > 7 
                            //? `rgb(${getRandomInt(brightWindows[0][0],brightWindows[1][0])}, ${getRandomInt(brightWindows[0][1],brightWindows[1][1])}, ${getRandomInt(brightWindows[0][2],brightWindows[1][2])})`
                            //: `rgb(${getRandomInt(darkWindows[0][0],darkWindows[1][0])}, ${getRandomInt(darkWindows[0][1],darkWindows[1][1])}, ${getRandomInt(darkWindows[0][2],darkWindows[1][2])})`;
                          windowColors[getRandomInt(0, windowColors.length-1)];
                        ctx.fillRect(windowSize.x*ci, windowSize.y*ri, windowSize.x, windowSize.y);
                    }
                    
                }
            }
        });
    }

    getRaindropCacheItem(layer, position, destination){
        let cache = this.rainDropCache;
        if(!cache[layer]){
            cache[layer] = [];
        }

        if(cache[layer].length){
            let rd = cache[layer].pop();
            rd.position = position;
            rd.setDestination(destination);
            rd.isVisible = true;
            //rd.img = this.recreatedRainDropImg;
            return true;
        }

        // if(this.createdRainDrops === undefined){ this.createdRainDrops = 0 }
        // console.log(++this.createdRainDrops + ' createdRainDrops');
        return false;
    }

    backRainDropTimerMethod(){
        for(let i = 0; i < 10; i++){
            let position =new V2(getRandom(1, this.viewport.x-1), getRandom(-10,0)); 
            let destination = new V2(position.x, this.viewport.y - this.floorSize.y-this.roadSize.y);
            if(!this.getRaindropCacheItem(this.backgroundRainLayer-2, position, destination)) 
                this.addGo(new RainDrop({
                    collisionDetection: {
                        enabled: false
                    },
                    position: position,
                    destination:destination,
                    img: this.backRainDropImg,
                    splash: false,
                    speed: 6,
                    size: new V2(0.25,4),
                    layer: this.backgroundRainLayer-2,
                }), this.backgroundRainLayer-2);
        }

        for(let i = 0; i < 15; i++){
            let position =new V2(getRandom(1, this.viewport.x-1), getRandom(-10,0)); 
            let destination = new V2(position.x, this.viewport.y - this.floorSize.y-this.roadSize.y);
            if(!this.getRaindropCacheItem(this.backgroundRainLayer-1, position, destination)) 
                this.addGo(new RainDrop({
                    collisionDetection: {
                        enabled: false
                    },
                    position: position,
                    destination: destination,
                    img: this.backRainDropImg,
                    splash: false,
                    speed: 4,
                    size: new V2(0.15,2),
                    layer: this.backgroundRainLayer-1,
                }), this.backgroundRainLayer-1);
        }

        for(let i = 0; i < 20; i++){
            let position =new V2(getRandom(1, this.viewport.x-1), getRandom(-10,0));
            let destination = new V2(position.x, this.viewport.y - this.floorSize.y-this.roadSize.y);
            if(!this.getRaindropCacheItem(this.backgroundRainLayer, position, destination))  
                this.addGo(new RainDrop({
                    collisionDetection: {
                        enabled: false
                    },
                    position: position,
                    destination: destination,
                    img: this.backRainDropImg,
                    splash: false,
                    speed: 3,
                    size: new V2(0.1,1),
                    layer: this.backgroundRainLayer,
                }), this.backgroundRainLayer);
        }
    }

    midRainDropTimerMethod(){
        for(let i = 0; i < 4; i++){
            let position =new V2(getRandomInt(1, this.viewport.x-1), -10); 
            let destination = new V2(position.x, getRandomInt(this.viewport.y-this.floorSize.y - this.roadSize.y*2/3, this.viewport.y-this.floorSize.y));
            if(!this.getRaindropCacheItem(this.middleRainLayer, position, destination)) 
                this.addGo(new RainDrop({
                    position: position,
                    destination: destination,
                    img: this.midRainDropImg,
                    isBack: true,
                    speed: 10,
                    size: new V2(0.5,8),
                    layer: this.middleRainLayer,
                }), this.middleRainLayer);
        }
    }

    backStreamTimerMethod(){
        let h = this.backStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,1.5);
        this.addGo(new StreamItem({
            img: this.streamItemYelloImg,
            brightImg: this.streamItemBrightYelloImg,
            position: new V2(this.viewport.x, h),
            destination: new V2(-1, h),
            size: this.backStreamSize,
        }), this.backStreamLayer);
    }

    midStreamTimerMethod(){
        let h = this.midStreamHeight+ (getRandomBool() ? 1 : -1)*getRandom(0,2);
        this.addGo(new StreamItem({
            img: this.streamItemRedImg,
            brightImg: this.streamItemBrightRedImg,
            position: new V2(0, h),
            destination: new V2(this.viewport.x+1, h)
        }), this.midStreamLayer);
    }

    rainDropTimerMethod(){
        for(let i = 0; i < 3; i++){
            let position =new V2(getRandomInt(1, this.viewport.x-1), -10); 
            let destination = new V2(position.x, getRandomInt(this.viewport.y-this.floorSize.y*2/3, this.viewport.y));
            if(!this.getRaindropCacheItem(this.frontalRainLayer, position, destination)) 
                this.addGo(new RainDrop({
                    position: position,
                    destination:destination,
                    img: this.rainDropImg,
                    layer: this.frontalRainLayer
                }), this.frontalRainLayer);
        }
        
    }

    backgroundRender(){
        let grd = SCG.contexts.background.createLinearGradient(SCG.viewport.real.width/2, SCG.viewport.real.height, SCG.viewport.real.width/2, 0);
        grd.addColorStop(0, '#4184AD');
        grd.addColorStop(0.65, '#316282');
        grd.addColorStop(1, '#1A313A');
        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }

    preMainWork(now) {
        if(this.rainDropTimer) {
            doWorkByTimer(this.rainDropTimer, now);
        }

        if(this.midRainDropTimer) {
            doWorkByTimer(this.midRainDropTimer, now);
        }

        if(this.backRainDropTimer) {
            doWorkByTimer(this.backRainDropTimer, now);
        }

        if(this.backStraemTimer) {
            doWorkByTimer(this.backStraemTimer, now);
        }

        if(this.midStraemTimer) {
            doWorkByTimer(this.midStraemTimer, now);
        }
    }
}

class RainDrop extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true
            },
            speed: 12,
            size: new V2(0.5,10),
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: false,
            splash: true
        }, options);

        super(options);
    }

    destinationCompleteCallBack(){
        let cache = this.parentScene.rainDropCache;
        if(!cache[this.layer]){
            cache[this.layer] = [];
        }

        cache[this.layer].push(this);

        this.isVisible = false;
        if(!this.splash)
            return;

        let count = this.isBack ? getRandomInt(1,2): getRandomInt(1,3);
        for(let i = 0;i < count; i++)
        {
            this.parentScene.addGo(new Splash({
                position: this.position.clone(),
                img: this.isBack ? this.parentScene.backSplashImg : this.parentScene.splashImg,
                speed: this.isBack ? getRandom(0.075, 0.09):getRandom(0.065, 0.08),
                coefficients: {
                    a: this.isBack ? getRandom(1,3) : getRandom(2,4),
                    b: this.isBack ? getRandom(3,9) : getRandom(5,12)
                },
                xAxis: {
                    direction: getRandomBool() ? 1: -1
                }
            }), this.layer);
        }
    }
}

class Splash extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            destination: new V2(-100,-100),
            speed:0.05,
            size: new V2(1,1),
            coefficients: {
                a: 3,
                b: 10
            },
            xAxis: {
                current: 0,
                speed: 0.001,
                direction: -1
            },
            yAxis: {
                current: 0,
            },
            positionChangeProcesser: function(){
                let oldPosition = this.position.clone();
                this.yAxis.current = (this.coefficients.a*this.xAxis.current*this.xAxis.current)+this.coefficients.b*this.xAxis.current;

                if(this.yAxis.current > 0){
                    this.setDead();
                    return;
                }

                this.position = this.initialPosition.add(new V2(this.xAxis.current, this.yAxis.current));
                this.xAxis.current+=this.xAxis.direction*this.xAxis.speed;

                return this.position.substract(oldPosition); 
            }
        }, options);

        options.xAxis.speed = options.speed;
        if(options.xAxis.direction > 0){
            options.coefficients.b*=-1;
        }

        super(options);

        this.initialPosition = this.position.clone();
    }
}

class StreamItem extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(1,1),
            speed: 0.1,
            setDeadOnDestinationComplete: true,
            setDestinationOnInit: true
        }, options);

        super(options);

        this.originImage = this.img;
        this.brightTimer = createTimer(getRandomInt(250, 750), this.brightTimerMethod, this, true);
    }

    brightTimerMethod(){
        if(this.bright)
            return;

        if(getRandomInt(0,50) > 45){
            this.bright = true;
            this.img = this.brightImg;

            this.brightOffTimer = createTimer(getRandomInt(500, 1500), this.brightOffTimerMethod, this, false);
        }
    }

    brightOffTimerMethod(){
        this.brightOffTimer = undefined;
        this.bright = false;
        this.img = this.originImage;
    }

    internalUpdate(now){
        if(this.brightTimer){
            doWorkByTimer(this.brightTimer, now);
        }

        if(this.brightOffTimer){
            doWorkByTimer(this.brightOffTimer, now);
        }
    }
}