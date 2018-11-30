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
        this.frontStreamLayer = 7;
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
        this.fronStreamItemSize = new V2(2,2)

        //positions
        this.backStreamHeight = 78;
        this.midStreamHeight = 80;
        this.frontStreamHeight = 130;

        // counters
        this.fenceColumnsCount = 8;
        this.backBuildingsCount = 16;
        this.minBuildingsCount = 12;
        this.frontBuildingsCount = 10;
        this.buildingsCount = [this.backBuildingsCount, this.minBuildingsCount, this.frontBuildingsCount];

        this.neonColors = [[133,207,116],[222,133,87],[250,235,114],[101,172,219],[152,59,102],[102,170,95],[223,176,92],[76,129,170]]

        //backBuildings
        let widthStep = 20;
        let heightFromTo = [3/5, 7/8];
        for(let li = 0; li < this.buildingsCount.length; li++){
            for(let i = 0; i < this.buildingsCount[li]; i++){
                let position;

                if(li == 2){
                    let w = this.viewport.x/this.buildingsCount[li];
                    position = new V2(getRandom(w*i, w*i+w), this.viewport.y/2+this.viewport.y*1/6*li+getRandom(0, this.viewport.y*1/6));
                }
                else {
                    position = new V2(getRandom(0, this.viewport.x), this.viewport.y/2+this.viewport.y*1/6*li+getRandom(0, this.viewport.y*1/4));
                }

                let points = [];
                let building = new GO({
                    position: position,
                    size: new V2(
                        getRandom(widthStep+(widthStep*li/2),widthStep*2+widthStep*li), 
                        this.viewport.y
                    ),
                    img: this.buildingGenerator(li, points)
                });

                if(getRandomInt(1,3) == 3){
                    let upper = Math.min.apply(null, points.map((p) => p.y));
                    let size = new V2(building.size.x*(0.5-0.1*li), building.size.x*(0.75-0.1*li));
                    building.addChild(new AdvertisementScreen({
                        position: new V2(getRandom(-building.size.x/2, building.size.x/2), -building.size.y/2+upper+size.y),
                        size: size,
                        color: this.neonColors[getRandomInt(0,this.neonColors.length-1)]
                    }));
                }

                this.addGo(building, this.buildingsLayers[li]);
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

        for(let i = 0; i< this.viewport.x; i++){
            if(getRandomInt(0,2) === 2)
                continue;

            let h = this.frontStreamHeight+ getRandom(-5,5);
            this.addGo(new StreamItem({
                img: this.streamItemRedImg,
                brightImg: this.streamItemBrightRedImg,
                position: new V2(i, h),
                destination: new V2(this.viewport.x+1, h),
                size: this.fronStreamItemSize,
                speed: 0.3
            }), this.frontStreamLayer);
        }
        
        // this.addGo(new AdvertisementScreen({
        //     size: new V2(30,30),
        //     position: new V2(this.viewport.x/2, this.viewport.y/2)
        // }),100);

        // timers
        this.rainDropTimer = createTimer(50, this.rainDropTimerMethod, this, true);
        this.midRainDropTimer = createTimer(50, this.midRainDropTimerMethod, this, true);
         this.backRainDropTimer = createTimer(50, this.backRainDropTimerMethod, this, true);

        this.backStraemTimer = createTimer(175, this.backStreamTimerMethod, this, true);
        this.midStraemTimer = createTimer(175, this.midStreamTimerMethod, this, true);
        this.frontStreamTimer = createTimer(125, this.frontStreamTimerMethod, this, true);
    }

    fenceGenerator(ctx, size) {
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0,0,size.x, size.y);
    }

    buildingGenerator(howFar, points){
        return createCanvas(new V2(100, 500), function(ctx, size){
            let darkWindows = [[32,64, 74], [53,100,136]]
            let brightWindows = [[93, 158,209], [176,208,223]];
            let windowColors = ['#2D5B80', '#92BDC7', '#2E5061', '#2A4A5D', '#69888A', '#1B363F', '#213D54', '#43799D', '#4D8FBA', '#36687E', '#395059', '#5C95AB'];
            let windowSize = new V2(5,2);
            
            switch(howFar){
                case 0:
                    //ctx.fillStyle = '#142833';
                    windowSize = new V2(5,1.5);
                    break;
                case 1: 
                    windowSize = new V2(4, 2);
                    //ctx.fillStyle = '#A79FE1';
                    break;
                case 2:
                    windowSize = new V2(3,2.5);
                    //ctx.fillStyle = '#A79FFF';
                    break;
            }

            //let gapHeight = windowSize.y*0.5;
            //ctx.fillStyle = '#142833';
            //ctx.strokeStyle = '#1C5561';
            //ctx.lineWidth = 3;

            let leftWallStraight = getRandomBool();
            let roofStraight = getRandomBool();
            let rightWallStraight = true;//getRandomBool();

            if(!leftWallStraight){
                let defCount = getRandomInt(1, (6 - howFar));
                let segHeight = size.y/2/defCount;
                let prev = undefined;
                for(let i = 0; i < defCount; i++){
                    let p = new V2( 
                        (prev == undefined ?  0 : prev.x)+getRandom(2, size.x/6)  //getRandom(2, size.x/4)
                        ,(prev == undefined ? size.y/2 - segHeight : prev.y-segHeight)+2);
                    if(i > 0 && getRandomBool()){//i%2 != 0 ){//&& getRandomBool()){
                        p.x = prev.x;
                    }
                    prev = p;
                    points.push(p);
                }
            }
            else {
                points.push(new V2(2, size.y/2));
                points.push(new V2(2, 2));
            }

            let roofDots = [];
            roofDots.push(points[points.length-1]);
            
            if(!roofStraight){
                let defCount = 1;//getRandomInt(1, (1 + howFar));
                let segWidth = size.x/defCount;
                let prev = points[points.length-1];
                
                prev.y = getRandom(2, size.y/10);
                for(let i = 0; i < defCount; i++){
                    let p = new V2(size.x-getRandom(size.x/6, size.x/4), getRandom(2, size.y/10));
                    
                    prev = p;
                    points.push(p);
                    roofDots.push(p);
                }
            }
            else {
                let p = new V2(size.x-2, 2);
                points.push(p);
                roofDots.push(p);
            }

            if(!rightWallStraight){
                let defCount = getRandomInt(1, (6 - howFar));
                let segHeight = (size.y/2 - points[points.length-1].y)/defCount;
                let prev = undefined;

                for(let i = 0; i < defCount; i++){
                    let p = new V2( getRandom(size.x*3/4, size.x-2), (prev == undefined ? points[points.length-1].y + segHeight : prev.y+segHeight));
                    if(i > 0 && getRandomBool()){// && i%2 != 0 ){//&& getRandomBool()){
                        p.x = prev.x;
                    }

                    prev = p;
                    points.push(p);
                }
            }

            points.push(new V2(size.x-2, size.y-2));

            points.push(new V2(2, size.y-2));

            draw(ctx, {
                points: points,//[new V2(0, size.y/2), new V2(size.x/2, 0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)],
                closePath: true,
                strokeStyle: '#1C5561',
                lineWidth: 3
            });
            ctx.save();
            ctx.clip();
            ctx.clearRect(0, 0, size.x, size.y);
            ctx.fillRect(0,0, size.x, size.y);
            //ctx.strokeRect(0,0, size.x, size.y);

            if(true){//if(howFar == 0){
                let rCount = parseInt(size.y/windowSize.y);
                let cCount = parseInt(size.x/windowSize.x);
                for(let ri = 0; ri < rCount; ri++){
                    if(ri%2 == 0)
                        continue;

                    // if(getRandomInt(0,20) === 20)
                    //     continue;

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

                let alpha = 0.9 - howFar*0.3;
                if(alpha < 0) alpha = 0;
                ctx.fillStyle = `rgba(26,49,58,${alpha})`
                ctx.fillRect(0,0, size.x, size.y);

                ctx.restore();
                if(howFar < 2){
                    for(let p of roofDots){
                        ctx.fillStyle = 'rgb(250,0,0)';
                        ctx.fillRect(p.x,p.y-1, 3, 2);
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
            return true;
        }
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

    frontStreamTimerMethod() {
        let h = this.frontStreamHeight+ getRandom(-5,5);
        this.addGo(new StreamItem({
            img: this.streamItemRedImg,
            brightImg: this.streamItemBrightRedImg,
            position: new V2(0, h),
            destination: new V2(this.viewport.x+1, h),
            size: this.fronStreamItemSize,
            speed: 0.3
        }), this.frontStreamLayer);
    }

    backgroundRender(){
        let grd = SCG.contexts.background.createLinearGradient(SCG.viewport.real.width/2, SCG.viewport.real.height, SCG.viewport.real.width/2, 0);
        //grd.addColorStop(0, '#4184AD');
        grd.addColorStop(0, '#316282');
        grd.addColorStop(0.95, '#1A313A');
        grd.addColorStop(1, '#031921');
        SCG.contexts.background.fillStyle = grd;
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);

        SCG.contexts.background.fillStyle = 'rgb(26,49,58)';
        SCG.contexts.background.fillRect(0,SCG.viewport.real.width/3,SCG.viewport.real.width,SCG.viewport.real.height/3);
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

        if(this.frontStreamTimer) {
            doWorkByTimer(this.frontStreamTimer, now);
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

class AdvertisementScreen extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            color: [255,0,0],
            blinking: {
                enabled: getRandomBool(),
                alpha: 1,
                direction: -1,
                step: getRandom(0.01,0.05),
                border: getRandom(0.1,0.6)
            },
            shaking: {
                enabled: false
            }
        }, options);

        options.img = createCanvas(options.size.mul(3), function(ctx, size){

            //TODO: other shapes
            let wh = size.x*1/4;

            let grd = ctx.createLinearGradient(0, size.y/2, wh, size.y/2);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(0,wh,wh, size.y-2*wh);

            grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, wh);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(wh,0,size.x*1/2, wh);

            grd = ctx.createLinearGradient(size.x*3/4, size.y/2, size.x, size.y/2);
            grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(size.x*3/4,wh,wh, size.y-2*wh);

            grd = ctx.createLinearGradient(size.x/2, size.y-wh, size.x/2, size.y);
            grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(wh,size.y-wh,size.x*1/2, wh);

            grd = ctx.createLinearGradient(0, 0, wh, wh);
            grd.addColorStop(0.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(0,0,wh, wh);

            grd = ctx.createLinearGradient(size.x*3/4, wh, 1*size.x, 0);
            grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(size.x*3/4,0,wh, wh);

            grd = ctx.createLinearGradient(size.x*3/4, size.y-wh, size.x, size.y);
            grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(size.x*3/4,size.y-wh,wh, wh);

            grd = ctx.createLinearGradient(wh, size.y-wh, 0, size.y);
            grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
            grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
            ctx.fillStyle = grd;
            ctx.fillRect(0,size.y-wh,wh, wh);

            //let h = size.y/2/6;
            //ctx.fillRect(size.x*1/4+size.x*1/8, size.y*1/4+h, size.x*1/4, size.y*2/6)

            let h = size.y/2/6;
            if(getRandomBool()){
                ctx.fillRect(size.x*1/4+size.x*1/8, size.y*1/4+h, size.x*1/4, size.y*2/6)
            }
            else {
                for(let i = 0;i<6;i++){
                    // if(i%2 === 0)
                    //     continue;
    
                    //ctx.fillRect(size.x*1/4+size.x*1/8, size.y*1/4+i*h, size.x*1/4, h*2/3);
                    for(let j = size.x*1/4+size.x*1/16; j < size.x*3/4-size.x*1/16;j++){
                        if(getRandomBool())
                            ctx.fillRect(j, size.y*1/4+i*h,1, h*2/3);
                    }
                }
            }
            
            
        })

        super(options);

        if(this.blinking.enabled){
            this.blinkingTimer = createTimer(getRandomInt(50,150), this.blinkingTimerMethod, this, true);
        }
        
    }

    blinkingTimerMethod(){
        let b = this.blinking;
        b.alpha+=b.direction*b.step;

        if(b.alpha > 1){
            b.alpha = 1;
            b.direction*=-1;
        }

        if(b.alpha < b.border){
            b.alpha = b.border;
            b.direction*=-1;
        }
    }

    internalUpdate(now){
        if(this.blinking.enabled){
            doWorkByTimer(this.blinkingTimer, now)
        }
    }

    internalPreRender() {
        this.context.save();
        this.context.globalAlpha = this.blinking.alpha;
    }

    internalRender(){
        this.context.restore();
    }
}