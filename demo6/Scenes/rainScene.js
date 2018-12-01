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
        this.streamItemsCache = [];

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

                if(true){//li ==2 || getRandomInt(1,2) == 2){
                    let count = li == 0 ? getRandom(3,8) : getRandomInt(1,3);
                    
                    let upper = Math.min.apply(null, points.map((p) => p.y));
                    let positions = [];
                    for(let i = 0; i< count;i++){
                        let size = (li == 0 
                            ? new V2(building.size.x*0.2, building.size.x*getRandom(0.3, 0.6)) 
                            : new V2(building.size.x*(getRandom(0.3, 0.5)-0.1*li), building.size.x*(getRandom(0.5,0.75)-0.1*li)));
                        let top = -building.size.y/2+upper+size.y;

                        let pCounter = 5;
                        let position;
                        while(pCounter != 0){
                            position = new V2(
                                getRandom(-(building.size.x/2)*0.8, (building.size.x/2)*0.8), 
                                getRandom(top,li == 0 ? 0: -building.size.y/4));
                            
                            if(positions.some((p) => p.distance(position) < 15))
                                pCounter--;
                            else 
                                break;
                        }

                        positions.push(position);

                        building.addChild(new AdvertisementScreen({
                            position: position,
                            size: size,
                            color: this.neonColors[getRandomInt(0,this.neonColors.length-1)],
                            blinking: {
                                enabled: li == 2,
                                fast: li ==2
                            }
                        }));
                    }
                    
                }

                this.addGo(building, this.buildingsLayers[li]);
            }
        }

        // this.addGo(new AdvertisementScreen({
        //     position: new V2(this.viewport.x/2, this.viewport.y/2),
        //     size: new V2(40, 80),
        //     color: this.neonColors[getRandomInt(0,this.neonColors.length-1)],
        //     screenType: 1,
        //     contentType: 2,
        //     blinking: {
        //         enabled: false
        //     }
        // }), 50)

        this.addGo(new Robot({
            size: new V2(20,20),
            position: new V2(this.viewport.x/2, this.viewport.y-80),
            layer: this.frontalRainLayer,
        }), this.frontalRainLayer)
        
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

        this.streamItemBlueImg = createCanvas(new V2(5,5), function(ctx, size){
            ctx.fillStyle = 'rgb(0, 0, 255)';
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
                destination: new V2(this.viewport.x+1, h),
                layer: this.midStreamLayer
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
                layer: this.backStreamLayer
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
                speed: 0.3,
                layer: this.frontStreamLayer
            }), this.frontStreamLayer);
        }

        // timers
        this.rainDropTimer = createTimer(50, this.rainDropTimerMethod, this, true);
        this.midRainDropTimer = createTimer(50, this.midRainDropTimerMethod, this, true);
        this.backRainDropTimer = createTimer(50, this.backRainDropTimerMethod, this, true);

        this.customStreamTimer = createTimer(3000, this.customStreamTimerMethod, this, true);
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
                    windowSize = new V2(5,1.5);
                    break;
                case 1: 
                    windowSize = new V2(4, 2);
                    break;
                case 2:
                    windowSize = new V2(3,2.5);
                    break;
            }

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

                        ctx.fillStyle = windowColors[getRandomInt(0, windowColors.length-1)];
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

    customStreamTimerMethod(){
        let howFar = getRandomInt(0,2);
        let h;
        let size;
        let position;
        let destination;
        let layer;
        let speed;
        //console.log(howFar);
        switch(howFar){
            case 0:
                h = this.backStreamHeight;
                size = this.backStreamSize;
                position = new V2(this.viewport.x, h)
                destination =  new V2(-1, h),
                layer = this.backStreamLayer;
                speed = 0.6;
                break;
            case 1:
                h = this.midStreamHeight;
                size = this.backStreamSize;
                position = new V2(0, h);
                destination =  new V2(this.viewport.x+1, h);
                layer = this.midStreamLayer;
                speed = 0.6;
                break;
            case 2: 
                h = this.frontStreamHeight;
                size = this.fronStreamItemSize;
                position = new V2(0, h);
                destination =  new V2(this.viewport.x+1, h);
                layer = this.frontStreamLayer;
                speed = 1.5;
                break;
        }

        if(getRandomBool()){
            h = getRandom(20, this.viewport.y*1/3);
            position.y = h;
            destination.y = h;
        }

        this.addGo(new StreamItem({
                position: position,
                itemType: 'police',
                img: this.streamItemBrightRedImg,
                brightImg: this.streamItemBlueImg,
                destination: destination,
                size: size,
                speed: speed,
                setDeadOnDestinationComplete: true,
            }), layer);
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

        if(this.customStreamTimer) {
            doWorkByTimer(this.customStreamTimer, now);
        }
    }
}

class RainDrop extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                preCheck: function(go) {
                    return this.type !== go.type && this.layer == go.layer;
                },
                onCollision: function(collidedWith, intersection){
                    if(intersection && intersection.length){
                        this.splashPoint = V2.average(intersection);
                    }
                    this.setDead();
                }
            },
            speed: 12,
            size: new V2(0.5,10),
            setDestinationOnInit: true,
            setDeadOnDestinationComplete: false,
            splash: true
        }, options);

        super(options);
    }

    beforeDead(){
        this.createSplash();
    }

    createSplash() {
        let count = this.isBack ? getRandomInt(1,2): getRandomInt(1,3);
        for(let i = 0;i < count; i++)
        {
            this.parentScene.addGo(new Splash({
                position: this.splashPoint ? this.splashPoint.clone() : this.position.clone(),
                img: this.isBack ? this.parentScene.backSplashImg : this.parentScene.splashImg,
                speed: this.isBack ? getRandom(0.1, 0.13):getRandom(0.09, 0.11),
                coefficients: {
                    a: this.isBack ? getRandom(1,3) : getRandom(2,4),
                    b: this.isBack ? getRandom(3,9) : getRandom(5,12)
                },
                xAxis: {
                    direction: getRandomBool() ? 1: -1
                }
            }), this.layer+1);
        }
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

        this.createSplash();
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
                this.yAxis.current = this.getYAxisCurrent()

                if(this.yAxis.current > 0){
                    this.setDead();
                    return;
                }

                this.position = this.initialPosition.add(new V2(this.xAxis.current, this.yAxis.current));
                this.xAxis.current = fastRoundWithPrecision(this.xAxis.current + this.xAxis.direction*this.xAxis.speed,3);

                return this.position.substract(oldPosition); 
            }
        }, options);

        options.coefficients.a = fastRoundWithPrecision(options.coefficients.a,2);
        options.coefficients.b = fastRoundWithPrecision(options.coefficients.b,2);
        options.speed = fastRoundWithPrecision(options.speed, 3);

        options.xAxis.speed = options.speed;
        if(options.xAxis.direction > 0){
            options.coefficients.b*=-1;
        }

        super(options);

        this.initialPosition = this.position.clone();
    }

    getYAxisCurrent(){
        let key = this.coefficients.a+'_'+this.xAxis.current+'_'+this.coefficients.b;
        let cacheItem = Splash.yAxisCache[key];
        if(cacheItem===undefined){
            cacheItem = (this.coefficients.a*this.xAxis.current*this.xAxis.current)+this.coefficients.b*this.xAxis.current;
            Splash.yAxisCache[key] = cacheItem;
        }
        // else {
        //     console.log(`key '${key}' found, return value '${cacheItem}'`);
        // }

        return cacheItem;
    }
}

Splash.yAxisCache = [];

class StreamItem extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(1,1),
            speed: 0.1,
            setDeadOnDestinationComplete: false,
            setDestinationOnInit: true,
            itemType: 'simple'
        }, options);

        super(options);

        this.originImage = this.img;
        if(this.itemType == 'police'){
            this.setDeadOnDestinationComplete = true;
            this.imgSwitchTimer = createTimer(250, this.imgSwitchTimerMethod, this, true);
        }
        else {
            this.brightTimer = createTimer(getRandomInt(250, 750), this.brightTimerMethod, this, true);
        }
    }

    destinationCompleteCallBack() {
        if(this.setDeadOnDestinationComplete){
            this.setDead();
            return;
        }

        if(this.position.x <= 0){
            this.position.x = this.parentScene.viewport.x+1;
            this.setDestination(new V2(-1, this.position.y));
        }
        else if(this.position.x > this.parentScene.viewport.x){
            this.position.x = -1;
            this.setDestination(new V2(this.parentScene.viewport.x+1, this.position.y));
        }
    }

    imgSwitchTimerMethod(){
        this.bright = !this.bright;
        this.img = this.bright ? this.brightImg : this.originImage;
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

        if(this.imgSwitchTimer){
            doWorkByTimer(this.imgSwitchTimer, now);
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
                border: getRandom(0.1,0.6),
            },
            screenType: getRandomInt(0,1),
            contentType: getRandomInt(0,2),
            shaking: {
                enabled: false
            }
        }, options);

        if(options.blinking.enabled && options.blinking.fast){
            options.blinking.step = getRandom(0.1, 0.4);
        }

        if(options.screenType == 1){
            let w = options.size.x;
            options.size.x = options.size.y;
            options.size.y = w;
        } 

        //options.contentType = getRandomInt(0,1);
        options.img = createCanvas(options.size.mul(3), function(ctx, size){
            if(options.screenType == 0 || options.screenType == 1){
                let t = options.screenType;
                let wh = t == 0 ? size.x*1/4 : size.y*1/4;

                let grd = ctx.createLinearGradient(0, size.y/2, wh, size.y/2); //left
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,wh,wh, size.y-2*wh);
                else 
                    ctx.fillRect(0,wh, wh, size.y*1/2);
    
                grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, wh); //top
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t == 0)
                    ctx.fillRect(wh,0,size.x*1/2, wh);
                else 
                    ctx.fillRect(wh,0,size.x-2*wh, wh);

                if(t==0) //right
                    grd = ctx.createLinearGradient(size.x*3/4, size.y/2, size.x, size.y/2);
                else 
                    grd = ctx.createLinearGradient(size.x-wh, size.y/2, size.x, size.y/2);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t== 0)
                    ctx.fillRect(size.x*3/4,wh,wh, size.y-2*wh);
                else 
                    ctx.fillRect(size.x-wh,wh,wh, size.y*1/2);

                grd = ctx.createLinearGradient(size.x/2, size.y-wh, size.x/2, size.y);//bottom
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t == 0)
                    ctx.fillRect(wh,size.y-wh,size.x*1/2, wh);
                else 
                    ctx.fillRect(wh,size.y*3/4,size.x-2*wh, wh);
    
                grd = ctx.createLinearGradient(0, 0, wh, wh);//topleft
                grd.addColorStop(0.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(1, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,0,wh, wh);
                else 
                    ctx.fillRect(0,0,wh, wh);
    
                if(t==0)//topright
                    grd = ctx.createLinearGradient(size.x*3/4, wh, size.x, 0);
                else 
                    grd = ctx.createLinearGradient(size.x-wh, wh, size.x, 0);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t== 0)
                    ctx.fillRect(size.x*3/4,0,wh, wh);
                else
                    ctx.fillRect(size.x-wh,0,wh, wh);
    
                if(t==0) //bottomright
                    grd = ctx.createLinearGradient(size.x*3/4, size.y-wh, size.x, size.y);
                else
                    grd = ctx.createLinearGradient(size.x-wh, size.y-wh, size.x, size.y);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(size.x*3/4,size.y-wh,wh, wh);
                else 
                    ctx.fillRect(size.x-wh,size.y*3/4,wh, wh);
    
                grd = ctx.createLinearGradient(wh, size.y-wh, 0, size.y);
                grd.addColorStop(.5, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 0)`);
                grd.addColorStop(0, `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`);
                ctx.fillStyle = grd;
                if(t==0)
                    ctx.fillRect(0,size.y-wh,wh, wh);
                else
                    ctx.fillRect(0,size.y*3/4,wh, wh);

                let h = size.y/2/6;
                
                if(options.contentType == 0){
                    
                }
                else if(options.contentType == 1) {
                    let from = wh+size.x*1/16;
                    let to = size.x-wh-size.x*1/16;
                    for(let i = 0;i<6;i++){
                        for(let j = from; j < to;j++){
                            if(getRandomBool())
                                ctx.fillRect(j, size.y*1/4+i*h,1, h*2/3);
                        }
                    }
                }
            }
            else if(options.screenType == 2){

            }
            //TODO: other shapes
            
            
            
        })

        super(options);

        if(this.contentType == 0){
            let size;
            let t = this.screenType;
            let wh = t == 0 ? this.size.x*1/4 : this.size.y*1/4;
            if(t==0){
                size = new V2(this.size.x*1/4, this.size.y*2/6)
            }
            else {
                size = new V2(this.size.x-4*wh, this.size.y*2/6)
            }

            this.content = new GO({
                position: new V2(0,0),
                size: size,
                img: createCanvas(new V2(10,10), function(ctx, size){
                    ctx.fillStyle = `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`;
                    ctx.fillRect(0,0,size.x, size.y);
                })
            });

            this.addChild(this.content);

            if(true){
                this.contentAnimationTimer = createTimer(50, this.contentAnimationMethod, this, true);
                this.contentAnimation = {
                    maxX: size.x,
                    maxY: size.y,
                    minX: size.x/3,
                    minY: size.y/3,
                    speedX: (size.x- size.x/3)/10,
                    speedY: (size.y- size.y/3)/10,
                    directionX: -1,
                    directionY: 0
                }
            }
        }
        else if(this.contentType == 2){
            this.content = new GO({
                position: new V2(0,0),
                size: this.screenType == 0 ? new V2(this.size.x/2,this.size.x/2) : new V2(this.size.x/2,this.size.y/2),
            });

            let letters = ['1','2','3','4','5','A','B','C','D','E','Э','Я','Ю','Ъ','Ф','!','?','$','@','#','人','九','个','万','ﻞ','ﺲ','ﻦ','ﻚ'];
            let that = this;
            this.content.images = letters.map((letter) => 
                createCanvas(new V2(40,40), function(ctx, size){
                    ctx.font = '25px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = `rgba(${options.color[0]}, ${options.color[1]}, ${options.color[2]}, 1)`;
                    ctx.fillText(letter+ (that.screenType==1? letters[getRandomInt(0, letters.length-1)]:''), size.x/2, size.y*3/4);
                }));

            this.content.img = this.content.images[getRandomInt(0,this.content.images.length-1)];
            this.addChild(this.content);
            this.contentLetterChangeTimer = createTimer(getRandomInt(50,250), this.contentLetterChangeMethod, this, true);
        }

        if(this.blinking.enabled){
            this.blinkingTimer = createTimer(getRandomInt(50,150), this.blinkingTimerMethod, this, true);
        }
    }

    contentLetterChangeMethod() {
        this.content.img = this.content.images[getRandomInt(0,this.content.images.length-1)];
    }

    contentAnimationMethod(){
        let ca = this.contentAnimation;
        this.content.size.x+=ca.directionX*ca.speedX;
        this.content.size.y+=ca.directionY*ca.speedY;

        if(this.content.size.x < ca.minX){
            this.content.size.x = ca.minX;
            ca.directionX=1;
        }

        if(this.content.size.x > ca.maxX){
            this.content.size.x = ca.maxX;
            ca.directionX = 0;
            ca.directionY = -1;
        }

        if(this.content.size.y < ca.minY){
            this.content.size.y = ca.minY;
            ca.directionY = 1;
        }

        if(this.content.size.y > ca.maxY){
            this.content.size.y = ca.maxY;
            ca.directionY = 0;
            ca.directionX = -1;
        }

        this.needRecalcRenderProperties = true;
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
            doWorkByTimer(this.blinkingTimer, now);
        }

        if(this.contentAnimationTimer){
            doWorkByTimer(this.contentAnimationTimer, now);
        }

        if(this.contentLetterChangeTimer){
            doWorkByTimer(this.contentLetterChangeTimer, now);
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

class Robot extends MovingGO {
    constructor(options = {}){
        options = assignDeep({}, {
            robotType: 0,
            collisionDetection: {
                enabled: true,
            }
        }, options);

        super(options);

        this.collisionDetection.circuit = [new V2(-this.size.x/2, 0), new V2(0, -this.size.y/2), new V2(this.size.x/2, 0)];
        this.img = createCanvas(new V2(100, 100), function(ctx, size) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(size.x/2, size.y/2, size.x/2, 0, 2 * Math.PI, false);
            ctx.fill();
        });
    }
}