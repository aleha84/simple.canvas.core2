class TrafficScene extends Scene {
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

    carBodyGenerator(){
        let baseH = getRandomInt(0,360);
        let c1 = colors.hsvToHex([baseH, 71,67]); // top part
        let c1_2 = colors.hsvToHex([baseH, 69,62]); // bumber
        let c2 = colors.hsvToHex([ baseH - 2 < 0 ? baseH-2+360: baseH ,67,73 ]); //light outline
        let c3 = colors.hsvToHex([ baseH - 10 < 0 ? baseH-10+360: baseH ,66,52 ]); // doors dark 
        let c5 = colors.hsvToHex([ baseH - 25 < 0 ? baseH-25+360: baseH ,68,45 ]); // doors dark countur
        let c6 = colors.hsvToHex([ 18,76,80 ]); //side light
        let c7 = colors.hsvToHex([ 46,38,91 ]); // light
        let c8 = colors.hsvToHex([ 244,25,21]); //window
        let c9 = colors.hsvToHex([ 334,65,39]); //back light

        let isSuv = getRandomBool();

        let model = {
            "general": {
                "originalSize":{"x":40,"y":25},
                "size": {
                    "x": 40,
                    "y": 25
                }
            },
            "zoom":10,"showGrid":false,
            "main": {
                "layers": [

                ]
            }
        }

        let layers = model.main.layers;

        let windowsLayer = {
            "order": 0, "type": "lines", "strokeColor": c8, "fillColor": c8, "closePath": true, "fill": true, "visible": true, "clear": false,
            "points": [
                { "point": { "x": 7, "y": 16 } },{ "point": { "x": 28, "y": 16 } },{ "point": { "x": 28, "y": 5 } },{ "point": { "x": 23, "y": 0 } },{ "point": { "x": 12, "y": 0 } },{ "point": { "x": 7, "y": 5 } }
            ]
        }

        if(isSuv) {
            windowsLayer.points = [ 
                { "point": { "x": 1, "y": 16 } }, { "point": { "x": 28, "y": 16 } }, { "point": { "x": 28, "y": 5 } }, { "point": { "x": 23, "y": 0 } }, { "point": { "x": 6, "y": 0 } }, { "point": { "x": 1, "y": 5 } }
            ]
        }

        layers.push(windowsLayer);

        let roofLayer = {
            "order": 1,"type": "lines","strokeColor": c1,"fillColor": c1,"closePath": true,"fill": true,"visible": true,"clear": false,
            "points": [ { "point": { "x": 12,"y": 0 } }, { "point": { "x": 23,"y": 0 } }, { "point": { "x": 23,"y": 11 } }, { "point": { "x": 12,"y": 11 } } ]
        }

        if(isSuv){
            roofLayer.points[0].point.x = 6;
            roofLayer.points[3].point.x = 6;
        }

        layers.push(roofLayer);

        let backLayer = { "order": 2, "type": "lines", "strokeColor": c1, "fillColor": c1, "closePath": true, "fill": true, "visible": true, "clear": false,
            "points": [  
                { "point": { "x": 1, "y": 6 } }, { "point": { "x": 6, "y": 6 } }, { "point": { "x": 6, "y": 16 } }, { "point": { "x": 1, "y": 16 } }
            ]
        }

        if(isSuv){
            backLayer.visible = false;
        }

        layers.push(backLayer);

        let frontLayer = {  
            "order": 3, "type": "lines", "strokeColor": c1, "fillColor": c1, "closePath": true, "fill": true, "visible": true, "clear": false,
            "points": [   
                { "point": { "x": 29, "y": 6 } }, { "point": { "x": 36, "y": 6 } }, { "point": { "x": 37, "y": 7 } }, { "point": { "x": 37, "y": 8 } }, { "point": { "x": 38, "y": 9 } }, { "point": { "x": 38, "y": 17 } }, { "point": { "x": 37, "y": 16 } }, { "point": { "x": 29, "y": 16 } }
            ]
        }

        layers.push(frontLayer);

        let bumperLayer = {   
            "order": 4, "type": "lines", "strokeColor": c1_2, "fillColor": c1_2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [    
                { "point": { "x": 39, "y": 9 } }, { "point": { "x": 39, "y": 19 } }
            ]
        }

        layers.push(bumperLayer);

        let sideLayer = {    
            "order": 5, "type": "lines", "strokeColor": c3, "fillColor": c3, "closePath": true, "fill": true, "visible": true, "clear": false,
            "points": [     
                { "point": { "x": 39, "y": 20 } }, { "point": { "x": 39, "y": 21 } }, { "point": { "x": 38, "y": 22 } }, { "point": { "x": 35, "y": 22 } }, { "point": { "x": 33, "y": 20 } }, { "point": { "x": 30, "y": 20 } }, { "point": { "x": 28, "y": 22 } }, { "point": { "x": 10, "y": 22 } }, { "point": { "x": 8, "y": 20 } }, { "point": { "x": 5, "y": 20 } }, { "point": { "x": 3, "y": 22 } }, { "point": { "x": 0, "y": 22 } }, { "point": { "x": 0, "y": 17 } }, { "point": { "x": 37, "y": 17 } }, { "point": { "x": 38, "y": 18 } }, { "point": { "x": 38, "y": 19 } }
            ]
        }

        layers.push(sideLayer);

        let sideFrontDetailsLayer = {     
            "order": 6, "type": "dots", "strokeColor": c5, "fillColor": c5, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [      
                { "point": { "x": 26, "y": 22 } }, { "point": { "x": 26, "y": 21 } }, { "point": { "x": 27, "y": 20 } }, { "point": { "x": 27, "y": 19 } }, { "point": { "x": 28, "y": 18 } }, { "point": { "x": 28, "y": 17 } }, { "point": { "x": 27, "y": 18 } }, { "point": { "x": 26, "y": 18 } }, { "point": { "x": 25, "y": 17 } }, { "point": { "x": 20, "y": 18 } }, { "point": { "x": 21, "y": 18 } }, { "point": { "x": 10, "y": 18 } }, { "point": { "x": 11, "y": 18 } }
            ]
        }

        layers.push(sideFrontDetailsLayer);

        let sideBackDetailsLayer = {      
            "order": 7, "type": "lines", "strokeColor": c5, "fillColor": c5, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [      
                 { "point": { "x": 11, "y": 22 } }, { "point": { "x": 7, "y": 18 } }, { "point": { "x": 7, "y": 17 }  }
            ]
        }

        layers.push(sideBackDetailsLayer);

        let sideMidDetailsLayer = {       
            "order": 8, "type": "lines", "strokeColor": c5, "fillColor": c5, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [      
                { "point": { "x": 18, "y": 22 } }, { "point": { "x": 18, "y": 17 } }
            ]
        }

        layers.push(sideMidDetailsLayer);

        let sideFrontOuline = {       
            "order": 9, "type": "lines", "strokeColor": c2, "fillColor": c2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [       
                { "point": { "x": 38, "y": 17 } }, { "point": { "x": 37, "y": 16 } }, { "point": { "x": 26, "y": 16 } }
            ]
        }

        layers.push(sideFrontOuline);

        let sideMidDarkOuline = {        
            "order": 10, "type": "lines", "strokeColor": c5, "fillColor": c5, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [        
                { "point": { "x": 28, "y": 16 } }, { "point": { "x": 23, "y": 11 } }, { "point": { "x": 12, "y": 11 } }, { "point": { "x": 7, "y": 16 } }
            ]
        }

        if(isSuv){
            sideMidDarkOuline.points[2].point.x = 6;
            sideMidDarkOuline.points[3].point.x = 1;
        }

        layers.push(sideMidDarkOuline);

        let sideMid2DarkOuline = {         
            "order": 11, "type": "lines", "strokeColor": c5, "fillColor": c5, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [         
                { "point": { "x": 18, "y": 16 } }, { "point": { "x": 18, "y": 12 } }
            ]
        }

        layers.push(sideMid2DarkOuline);

        let sideMidFrontOuline = {        
            "order": 12, "type": "lines", "strokeColor": c2, "fillColor": c2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [        
                { "point": { "x": 23, "y": 10 } }, { "point": { "x": 12, "y": 10 } }
            ]
        }

        if(isSuv){
            sideMidFrontOuline.points[1].point.x = 6;
        }

        layers.push(sideMidFrontOuline);

        let sideBackFrontOuline = {         
            "order": 13, "type": "lines", "strokeColor": c2, "fillColor": c2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [         
                { "point": { "x": 6, "y": 16 } }, { "point": { "x": 1, "y": 16 } }, {"point": { "x": 0, "y": 17 } }
            ]
        }

        if(isSuv){
            sideBackFrontOuline.points = [{"point": { "x": 0, "y": 17 } }];
        }

        layers.push(sideBackFrontOuline);

        let sideLights = {          
            "order": 14, "type": "dots", "strokeColor": c6, "fillColor": c6, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [          
                { "point": { "x": 38, "y": 20 } }, { "point": { "x": 30, "y": 19 } }, { "point": { "x": 31, "y": 19 } }, { "point": { "x": 0, "y": 21 } }
            ]
        }

        layers.push(sideLights);

        let frontalLights = {           
            "order": 15, "type": "dots", "strokeColor": c7, "fillColor": c7, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [           
                { "point": { "x": 38, "y": 18 } }, { "point": { "x": 38, "y": 19 } }, { "point": { "x": 37, "y": 19 } }, { "point": { "x": 38, "y": 8 } }
            ]
        }

        layers.push(frontalLights);

        let backLights = {            
            "order": 16, "type": "dots", "strokeColor": c9, "fillColor": c9, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [            
                { "point": { "x": 0, "y": 20 } }, { "point": { "x": 0, "y": 19 } }, { "point": { "x": 1, "y": 19 } }
            ]
        }

        layers.push(backLights);

        let backBumper = { 
            "order": 17, "type": "lines", "strokeColor": c1_2, "fillColor": c1_2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [ 
                { "point": { "x": 0, "y": 7 } }, { "point": { "x": 0, "y": 16 } }
            ]
        }

        layers.push(backBumper);

        return PP.createImage(model);
    }

    backgroundRender() {
        this.backgroundRenderDefault('#CDD1D2');
    }

    createCar(lineNum, x){
        let y = fast.r(this.sceneCenter.y + 20*lineNum);
        this.cars[this.cars.length] = this.addGo(new TrafficItemGO({
            position: new V2(x || -40,y),//getRandomInt(-40,-20), y),
            bodyImg: this.carBodyGenerator(),
            wheelImg: this.wheelImg,
            lineNum,
            speed: this.carSpeed,
            maxX: this.carMaxX,
            maxSpeed: this.maxSpeed,
        }), 10 + lineNum*10 ); 
    }

    stopTraffic() {
        this.stopQueue = [];
        this.stop = true;
        this.trafficLight.setState('red');

        let beforeStopLineCars = this.cars.filter(c => c.position.x < (this.stopX - 40));
        for(let line = 0; line < this.totalLineNums; line++){
            this.stopQueue[line] = 0;
            let carsOnLine = beforeStopLineCars.filter(c => c.lineNum == line).sort((a,b) => {
                if(a.position.x < b.position.x)
                    return 1;
                
                if(a.position.x > b.position.x){
                    return -1;
                }

                return 0;
            });

            carsOnLine.forEach((c,i) => {
                this.stopQueue[line]++;
                let stopX = this.stopX - 50*i;
                let startStop = stopX -40;
                c.stop(startStop, stopX)
            });
        }
    }

    startTraffic(){
        console.log('start traffic called');
        this.trafficLight.setState('yellow');
        this.yellowRemover = this.registerTimer(createTimer(1000, () => {
            this.unregTimer(this.yellowRemover);
            this.yellowRemover = undefined;

            this.trafficLight.setState('green');
            this.startX = this.stopX;
            let toStart = [];
            this.startTrafficTimer = this.regTimerDefault(50, () => {
                this.cars.filter(c => c.stoppping && c.position.x > this.startX).forEach(c => {

                    c.start();
                })
    
    
                this.startX-=5;
    
                if(this.startX < 0) {
                    this.unregTimer(this.startTrafficTimer);
                    this.startTrafficTimer = undefined;
                    while(toStart.lnegth){
                        let c = toStart.shift();
                            c.start();
                        
                    }
                    this.removeStopTimer = this.registerTimer(createTimer(1000, () => {
                        this.unregTimer(this.removeStopTimer);
                        this.removeStopTimer = undefined;
                        this.stop = false;
                    }, this, false))
                }
            })

        }, this, false))
        
    }

    start(){
        this.toggleCounter = 3;
        this.wheelImg = PP.createImage(trafficModels.wheel)
        this.shadowImg = createCanvas(new V2(40,25), (ctx, size, hlp) => {
            hlp.setFillColor('rgba(0,0,0,0.25)').rect(0, 10, size.x, 14).rect(1,24,size.x-2, 1);
        })

        this.cars = [];
        this.totalCars = 10;
        this.carSpeed = 2;
        this.maxSpeed = 2;
        this.carMaxX = this.viewport.x+40;
        this.cleanUpCounter = 50;
        this.totalLineNums = 4;
        this.stopX = 250;
        this.stop = false;

        this.roadSize = new V2(this.viewport.x, this.totalLineNums*22);
        this.road = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y + 35),
            size: this.roadSize,
            img: createCanvas(this.roadSize, (ctx, size, hlp) => {
                hlp.setFillColor('#84938C').rect(0,0, size.x, size.y)
                .setFillColor('rgba(0,0,0,0.5)').rect(0,0,size.x,1)
                .setFillColor('rgba(0,0,0,0.25)').rect(0,1,size.x,1)
                .setFillColor('rgba(0,0,0,0.1)').rect(0,2,size.x,1)
                .setFillColor('#CCDBD4').rect(0, 4, size.x, 1)
                .setFillColor('#E7F6EF').rect(0, 5, size.x, 1)

                let segCount  = 20;
                let segWidth = size.x/segCount;
                for(let i = 0; i < segCount;i++){
                    if(i%2 == 0){
                        continue;
                    }

                    hlp.setFillColor('#CCDBD4').rect(segWidth*i, 24, segWidth, 1)
                    .setFillColor('#CCDBD4').rect(segWidth*i, 45, segWidth, 1)
                    .setFillColor('#CCDBD4').rect(segWidth*i, 66, segWidth, 1)
                }
            })
        }))

        this.borderImg = PP.createImage(trafficModels.border);
        this.borderSize = new V2(this.viewport.x, 5);
        this.upperDots = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y-20),
            size: new V2(this.viewport.x, 20),
            img: createCanvas(new V2(this.viewport.x, 20), (ctx, size, hlp) => {
                let colors = ['#95A59E', '#7A8781', '#979E9B'];
                for(let i = 0; i < 200; i++){
                    hlp.setFillColor(colors[getRandomInt(0, colors.length-1)]).dot(getRandomInt(0, size.x), getRandomInt(0,size.y))
                }
            })
        })); 
        this.lowerDots = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+90),
            size: new V2(this.viewport.x, 20),
            img: createCanvas(new V2(this.viewport.x, 20), (ctx, size, hlp) => {
                let colors = ['#95A59E', '#7A8781', '#979E9B'];
                for(let i = 0; i < 200; i++){
                    hlp.setFillColor(colors[getRandomInt(0, colors.length-1)]).dot(getRandomInt(0, size.x), getRandomInt(0,size.y))
                }
            })
        })); 
        this.borderTop = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y-10),
            size: this.borderSize,
            img: createCanvas(this.borderSize, (ctx, size, hlp) => {
                for(let i = 0; i < size.x/20;i++){
                    ctx.drawImage(this.borderImg, i*20, 0)
                    hlp.setFillColor('#869E93');
                    for(let j = 0; j < getRandomInt(2,10); j++){
                       hlp.dot(getRandomInt(i*20+1, (i+1)*20), getRandomInt(3,4)) 
                    }

                    hlp.setFillColor('#B6C6B7');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20+1, (i+1)*20), 2) 
                    }

                    hlp.setFillColor('#AFBFB9');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20 + 1, (i+1)*20), 1) 
                    }

                    hlp.setFillColor('#607070');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20 + 1, (i+1)*20), 0) 
                    }
                }
            })
        }),1)

        this.borderBottom = this.addGo(new GO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y+80),
            size: this.borderSize,
            img: createCanvas(this.borderSize, (ctx, size, hlp) => {
                for(let i = 0; i < size.x/20;i++){
                    ctx.drawImage(this.borderImg, i*20, 0)
                    hlp.setFillColor('#869E93');
                    for(let j = 0; j < getRandomInt(2,10); j++){
                       hlp.dot(getRandomInt(i*20+1, (i+1)*20), getRandomInt(3,4)) 
                    }

                    hlp.setFillColor('#B6C6B7');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20+1, (i+1)*20), 2) 
                    }

                    hlp.setFillColor('#AFBFB9');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20 + 1, (i+1)*20), 1) 
                    }

                    hlp.setFillColor('#607070');
                    for(let j = 0; j < getRandomInt(2,5); j++){
                       hlp.dot(getRandomInt(i*20 + 1, (i+1)*20), 0) 
                    }
                }
            })
        }),1)

        this.trafficLightSize = new V2(20, 130);
        this.trafficLight = this.addGo(new GO({
            position: new V2(this.stopX + 80, this.sceneCenter.y+15),
            size: this.trafficLightSize,
            img: createCanvas(this.trafficLightSize, (ctx, size, hlp) => {
                
                
                //hlp.setFillColor('red').strokeRect(0,0,size.x,size.y);
                let pp = new PerfectPixel({context: ctx});
                let colors = ['#D4D9ED', '#9E9DA3', '#5B5E65']
                for(let i = 0; i < colors.length; i++){
                    hlp.setFillColor(colors[i]);
                    pp.line(2+i, 36, 2+i, 0);
                    pp.line(size.x-4+i, size.y-38, size.x-4+i, size.y-1);
                }

                hlp.setFillColor('#181818').rect(3, 17, 2,8).setFillColor('#3F3F3F').rect(4,17,1,8)
                hlp.setFillColor('#181818').rect(5, 30, 2,10).setFillColor('#3F3F3F').rect(6,30,2,10)
                hlp.setFillColor('#181818').rect(8, 50, 2,11).setFillColor('#3F3F3F').rect(9,50,2,11)
                hlp.setFillColor('#181818').rect(11, 70, 2,12).setFillColor('#3F3F3F').rect(12,70,2,12)

                for(let i = 0; i < colors.length; i++){
                    hlp.setFillColor(colors[i]);
                    
                    pp.line(2+i, 0, size.x-4+i, size.y-38);
                }
            }),
            init() {
                this.green = [new V2(-6.5, -41), new V2(-4.5, -27), new V2(-1.5, -6), new V2(1.5, 15)].map((p,i) => this.addChild(new GO({
                    position: p,
                    size: new V2(1,i > 1 ? 2 : 1),
                    img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        hlp.setFillColor('#47A428').dot(0,0);
                    })
                })))

                this.yellow = [new V2(-6.5, -44), new V2(-4.5, -30), new V2(-1.5, -9), new V2(1.5, 11)].map((p,i) => this.addChild(new GO({
                    position: p,
                    size: new V2(1,i > 1 ? 2 : 1),
                    isVisible: false,
                    img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        hlp.setFillColor('#FFC600').dot(0,0);
                    })
                })))

                this.red = [new V2(-6.5, -47), new V2(-4.5, -33), new V2(-1.5, -12), new V2(1.5, 8)].map((p,i) => this.addChild(new GO({
                    position: p,
                    size: new V2(1,i > 1 ? 2 : 1),
                    isVisible: false,
                    img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        hlp.setFillColor('#DD1114').dot(0,0);
                    })
                })))
            },
            setState(state) {
                [...this.green, ...this.yellow, ...this.red].forEach(g => g.isVisible = false);
                this[state].forEach(g => g.isVisible = true)
            }

        }), 50)

        this.delayTimer = this.registerTimer(createTimer(2000, () => {
            this.unregTimer(this.delayTimer);
            this.delayTimer = undefined;

            this.startStopTraffic();

            this.carCreatorTimer = this.regTimerDefault(50, () => {
                if(true){
                    if(getRandomInt(0,2) == 0){//if(getRandomBool()){
                        let lineNumsLeft = new Array(this.totalLineNums).fill().map((_, i) => i);
                        let y = undefined;
                        while(lineNumsLeft.length > 0){
                            let lineNum = lineNumsLeft[getRandomInt(0,lineNumsLeft.length-1)];
        
                            if(
                                (this.cars.filter(c => c.lineNum == lineNum &&  c.position.x <= 10).length == 0)
                            ){
                                if(!this.stop || (this.stop && this.stopQueue[lineNum]< 6) ){
                                    y = fast.r(this.sceneCenter.y + 20*lineNum);
                                    let cIndex = this.cars.length;
                                    this.cars[cIndex] = this.addGo(new TrafficItemGO({
                                        position: new V2(-40,y),//getRandomInt(-40,-20), y),
                                        bodyImg: this.carBodyGenerator(),
                                        wheelImg: this.wheelImg,
                                        lineNum,
                                        speed: this.carSpeed,
                                        maxX: this.carMaxX,
                                        maxSpeed: this.maxSpeed,
                                        shadowImg:this.shadowImg
                                    }), 10 + lineNum*10 ); 
    
                                    if(this.stop) {
                                        let carsOnLine = this.stopQueue[lineNum];
        
                                        let stopX = this.stopX - 50*(carsOnLine);
                                        let startStop = stopX -40;
                                        this.cars[cIndex].stop(startStop, stopX);
                                        this.stopQueue[lineNum]++;
                                    }
        
                                    break;
                                }
                            }
        
                            let index = lineNumsLeft.indexOf(lineNum);
                            lineNumsLeft.splice(index,1);
                        }
                    }
        
                }
                
                
    
                
                //fast.r(this.sceneCenter.y + 8*(isUpper ? -1 : 1));
                
    
                this.cleanUpCounter--;
    
                if(this.cleanUpCounter <= 0){
                    this.cleanUpCounter = 50;
    
                    let i = this.cars.length;
                    while (i--) {
                        if(!this.cars[i].alive){
                            this.cars.splice(i,1);
                        }
                    }
                }
    
                this.debug.additional[2] = 'cars.length: '  + this.cars.length;
            });

        }, this, false));
        


    }

    startStopTraffic() {
        this.stopTrafficTimer = this.registerTimer(createTimer(15000, () => {
            this.unregTimer(this.stopTrafficTimer);
            this.stopTrafficTimer = undefined;
            console.log('stop')
            this.stopTraffic();
            this.startStartTraffic();
        }, this, false));
    }

    startStartTraffic() {
        this.startTrafficTimer = this.registerTimer(createTimer(6000, () => {
            this.unregTimer(this.startTrafficTimer);
            this.startTrafficTimer = undefined;
            console.log('start')
            this.startTraffic();
            
            //this.startStartTraffic();

            this.toggleCounter--;

            if(this.toggleCounter == 0){
                this.removeTrafficGenTimer = this.registerTimer(createTimer(5000, () => {
                    this.unregTimer(this.removeTrafficGenTimer);
                    this.removeTrafficGenTimer = undefined;

                    this.unregTimer(this.carCreatorTimer);
                    this.carCreatorTimer = undefined;
                }, this, false));
            }
            else {
                this.startStopTraffic();
            }
        }, this, false));
    }
}

class TrafficItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(40,25),
            renderValuesRound: true,
            state: 0,
            speedChangeDelta: 0.1
        }, options)

        super(options);
    }

    init() {
        this.shadow = this.addChild(new GO({
            position: new V2(0, 1),
            size: this.size,
            img: this.shadowImg
        }))

        this.wheels = [new V2(-13, 10), new V2(12, 10)].map(p => this.addChild(new GO({
            size: new V2(6,5),
            position: p,
            img: this.wheelImg,
            renderValuesRound: false,
        })));

        this.body = this.addChild(new GO({
            renderValuesRound: true,
            size: this.size,
            img: this.bodyImg,
            position: new V2()
        }));
        


        // this.timer = this.regTimerDefault(50, () => {
            
        // })
    }

    stop(startStop, stopX) {
        this.stoppping = true;
        this.startStop = startStop;
        this.stopX = stopX;
    }

    start(){
        this.stoppping = false;
        this.accelerating = true;
        this.speedChange = easing.createProps(getRandomInt(50, 100), 0, this.maxSpeed, 'quad', 'in')
    }

    internalUpdate(now){
        if(this.stoppping && this.position.x >= this.startStop){
            if(this.speedChange == undefined){
                this.speedChange = easing.createProps(getRandomInt(75, 85), this.speed, 0, 'quad', 'out')
            }
        }

        if(this.speedChange) {
            this.speed = easing.process(this.speedChange);
                
                this.speedChange.time++;
                if(this.speedChange.time > this.speedChange.duration){
                    this.speedChange = undefined;
                    // this.speed = 0;
                    // this.stoppping = false;
                }
        }

        this.position.x += this.speed;
    
        if(this.position.x > this.maxX){
            this.setDead();
        }

        this.needRecalcRenderProperties = true;
    }
}