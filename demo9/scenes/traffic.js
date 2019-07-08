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

        let model = {
            "general": {
                "size": {
                    "x": 40,
                    "y": 25
                }
            },
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

        layers.push(windowsLayer);

        let roofLayer = {
            "order": 1,"type": "lines","strokeColor": c1,"fillColor": c1,"closePath": true,"fill": true,"visible": true,"clear": false,
            "points": [ { "point": { "x": 12,"y": 0 } }, { "point": { "x": 23,"y": 0 } }, { "point": { "x": 23,"y": 11 } }, { "point": { "x": 12,"y": 11 } } ]
        }

        layers.push(roofLayer);

        let backLayer = { "order": 2, "type": "lines", "strokeColor": c1, "fillColor": c1, "closePath": true, "fill": true, "visible": true, "clear": false,
            "points": [  
                { "point": { "x": 1, "y": 6 } }, { "point": { "x": 6, "y": 6 } }, { "point": { "x": 6, "y": 16 } }, { "point": { "x": 1, "y": 16 } }
            ]
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

        layers.push(sideMidFrontOuline);

        let sideBackFrontOuline = {         
            "order": 13, "type": "lines", "strokeColor": c2, "fillColor": c2, "closePath": false, "fill": false, "visible": true, "clear": false,
            "points": [         
                { "point": { "x": 6, "y": 16 } }, { "point": { "x": 1, "y": 16 } }, {"point": { "x": 0, "y": 17 } }
            ]
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
        this.backgroundRenderDefault();
    }

    start(){
        this.wheelImg = PP.createImage({"general":{"originalSize":{"x":6,"y":5},"size":{"x":6,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#222036","fillColor":"#222036","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":0}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#686A69","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":2}},{"point":{"x":3,"y":2}}]},{"order":2,"type":"dots","strokeColor":"#5E5A5B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":1}},{"point":{"x":3,"y":1}}]},{"order":3,"type":"dots","strokeColor":"#84838B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":2}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#393B3A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":1}},{"point":{"x":4,"y":1}}]},{"order":5,"type":"dots","strokeColor":"#464644","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}}]}]}})
        // this.wheelImages = [
        //     PP.createImage({"general":{"originalSize":{"x":6,"y":5},"size":{"x":6,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#222036","fillColor":"#222036","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":0}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#686A69","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":2}},{"point":{"x":3,"y":2}}]},{"order":2,"type":"dots","strokeColor":"#5E5A5B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":1}},{"point":{"x":3,"y":1}}]},{"order":3,"type":"dots","strokeColor":"#84838B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":2}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#393B3A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":1}},{"point":{"x":4,"y":1}}]},{"order":5,"type":"dots","strokeColor":"#464644","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}}]}]}}),
        //     PP.createImage({"general":{"originalSize":{"x":6,"y":5},"size":{"x":6,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#222036","fillColor":"#222036","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":0}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#686A69","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":2}},{"point":{"x":3,"y":2}}]},{"order":2,"type":"dots","strokeColor":"#5E5A5B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":1}},{"point":{"x":3,"y":1}}]},{"order":3,"type":"dots","strokeColor":"#84838B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":2}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#393B3A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":1}},{"point":{"x":4,"y":1}},{"point":{"x":2,"y":1}}]},{"order":5,"type":"dots","strokeColor":"#464644","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}},{"point":{"x":3,"y":3}}]}]}}),
        //     //PP.createImage({"general":{"originalSize":{"x":6,"y":5},"size":{"x":6,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#222036","fillColor":"#222036","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":0}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#686A69","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":2}},{"point":{"x":3,"y":2}}]},{"order":2,"type":"dots","strokeColor":"#5E5A5B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":1}},{"point":{"x":4,"y":1}}]},{"order":3,"type":"dots","strokeColor":"#84838B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}}]},{"order":4,"type":"dots","strokeColor":"#393B3A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":1}},{"point":{"x":3,"y":1}}]},{"order":5,"type":"dots","strokeColor":"#464644","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":1,"y":2}},{"point":{"x":4,"y":2}}]}]}}),
        //     PP.createImage({"general":{"originalSize":{"x":6,"y":5},"size":{"x":6,"y":5},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#222036","fillColor":"#222036","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":0}},{"point":{"x":4,"y":0}},{"point":{"x":5,"y":1}},{"point":{"x":5,"y":3}},{"point":{"x":4,"y":4}},{"point":{"x":1,"y":4}},{"point":{"x":0,"y":3}},{"point":{"x":0,"y":1}}]},{"order":1,"type":"dots","strokeColor":"#686A69","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":2}},{"point":{"x":3,"y":2}}]},{"order":2,"type":"dots","strokeColor":"#5E5A5B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":1}},{"point":{"x":3,"y":1}}]},{"order":3,"type":"dots","strokeColor":"#84838B","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":2}},{"point":{"x":2,"y":3}},{"point":{"x":3,"y":3}},{"point":{"x":4,"y":2}}]},{"order":4,"type":"dots","strokeColor":"#393B3A","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":1}},{"point":{"x":4,"y":1}},{"point":{"x":3,"y":1}}]},{"order":5,"type":"dots","strokeColor":"#464644","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":1,"y":3}},{"point":{"x":4,"y":3}},{"point":{"x":2,"y":3}}]}]}}),
        //     ]

        // this.demoCar = this.addGo(new TrafficItemGO({
        //     position: this.sceneCenter.clone(),
        //     bodyImg: this.carBodyGenerator(),
        //     wheelImg: this.wheelImg,
        //     //wheelImages: this.wheelImages
        // }))

        this.cars = [];
        this.totalCars = 10;
        this.carSpeed = 3;
        this.carMaxX = this.viewport.x+40;
        this.cleanUpCounter = 50;
        this.totalLineNums = 4;

        this.carCreatorTimer = this.regTimerDefault(50, () => {

            if(getRandomBool()){
                let lineNumsLeft = new Array(this.totalLineNums).fill().map((_, i) => i);
                let y = undefined;
                while(lineNumsLeft.length > 0){
                    let lineNum = lineNumsLeft[getRandomInt(0,lineNumsLeft.length-1)];

                    if(this.cars.filter(c => c.lineNum == lineNum &&  c.position.x <= 10).length == 0){
                        y = fast.r(this.sceneCenter.y + 20*lineNum);

                        this.cars[this.cars.length] = this.addGo(new TrafficItemGO({
                            position: new V2(-40,y),//getRandomInt(-40,-20), y),
                            bodyImg: this.carBodyGenerator(),
                            wheelImg: this.wheelImg,
                            lineNum,
                            speed: this.carSpeed,
                            maxX: this.carMaxX
                        }), 10 + lineNum*10 ); 

                        break;
                    }

                    let index = lineNumsLeft.indexOf(lineNum);
                    lineNumsLeft.splice(index,1);
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
    }
}

class TrafficItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(40,25),
            renderValuesRound: true,
        }, options)

        super(options);
    }

    init() {
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
        
         this.wheelImgIndex = 0;
        // this.wheels.forEach(w => {
        //     w.img = this.wheelImages[this.wheelImgIndex++];
        // })

        // this.wheelTimer = this.regTimerDefault(500, () => {
        //     this.wheels.forEach(w => {
        //         w.img = this.wheelImages[this.wheelImgIndex];
        //     });

        //     this.wheelImgIndex++;

        //     if(this.wheelImgIndex == this.wheelImages.length){
        //         this.wheelImgIndex = 0;
        //     }
        // })
    }

    internalUpdate(now){
        this.position.x += this.speed;
        this.needRecalcRenderProperties = true;

        if(this.position.x > this.maxX){
            this.setDead();
        }

    }
}