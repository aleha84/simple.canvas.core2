class SandScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            collisionDetection: {
                enabled: true,
                level: 12
            },
            debugging: {
                enabled: true,
                font: (25*SCG.viewport.scale) + 'px Arial',
                textAlign: 'center',
                fillStyle: 'red',
                position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale)
            }
        }, options);

        super(options);

        this.sizes = [new V2(2,4), new V2(1.75,3.5), new V2(1.5,3),new V2(1.25,1.25), new V2(1,1)]

        this.sandImg = function(color = 'white') {
            if(!this.sandImgs){
                this.sandImgs = {};
            }

            if(this.sandImgs[color]){
                return this.sandImgs[color];
            }

            let img = createCanvas(new V2(10, 10), function(ctx, size) {
                ctx.fillStyle = color;
                ctx.fillRect(0,0, size.x, size.y);
            });

            this.sandImgs[color] = img;

            return img;
        } 

        this.sandGenerationTimer = createTimer(10, this.sandGenerationMethod, this, true);
        this.stopSandGeneratorTimer = createTimer(3000, this.stopSandGeneratorTimerMethod, this, false);
        //obstackle

        this.backgroundImg = createCanvas(new V2(this.viewport.x, this.viewport.y), function(ctx, size) {
            let brickSize = new V2(size.x/8, size.y/30);
            let firstRowFillStyle = ctx.createLinearGradient(brickSize.x/2, 0, brickSize.x/2, brickSize.y);
            let defaulBrickFillStyle = '#CEB298';
            firstRowFillStyle.addColorStop(0, 'white');
            firstRowFillStyle.addColorStop(0.3, '#A09D98');
            firstRowFillStyle.addColorStop(1, defaulBrickFillStyle);
            //ctx.imageSmoothingEnabled = false;

            for(let ri = 0;ri<size.y/brickSize.y;ri++){
                let shift = ri%2 == 0;
                for(let ci = 0; ci < size.x/brickSize.x + (shift ? 1 : 0);ci++){  
                    let tlx =  brickSize.x*ci - (shift ? brickSize.x/2 : 0);
                    let tly = brickSize.y*ri;
                       
                    ctx.fillStyle = defaulBrickFillStyle;
                    ctx.fillRect(tlx,tly, brickSize.x, brickSize.y);
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(tlx,tly, brickSize.x, brickSize.y);
                    let cLineWidth = 2;
                    draw(ctx, {strokeStyle: '#7A695A', closePath: false, lineWidth:cLineWidth, 
                        points: [new V2(tlx+cLineWidth/2, tly+cLineWidth/2), new V2(tlx+cLineWidth/2, tly +brickSize.y - cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly+brickSize.y-cLineWidth/2)]})
                    draw(ctx, {strokeStyle: '#E5C5A9', closePath: false, lineWidth:cLineWidth, 
                        points: [new V2(tlx+cLineWidth, tly+cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly + cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly+brickSize.y-cLineWidth)]})

                    // if(true){//if(getRandomInt(0,3) == 3){
                    //     let p = [1,2].map(x => new V2(getRandom(0,brickSize.x), getRandom(0, brickSize.y)).add(new V2(tlx, tly)))
                    //     draw(ctx, {strokeStyle: '#5A5D62', closePath: false, points: p});
                    // }

                    if(ri == 0){
                        ctx.fillStyle = firstRowFillStyle;
                        ctx.fillRect(tlx,tly, brickSize.x, brickSize.y);
                    }

                    ctx.fillStyle = '#5A5D62';
                    for(let i = 0; i < brickSize.x*brickSize.y*0.005;i++){
                        ctx.fillRect(parseInt(getRandomInt(0, brickSize.x) + tlx),parseInt(getRandomInt(0, brickSize.y)+tly),1,1);
                    }
                }
            }

            let grd = ctx.createLinearGradient(0, size.y/2, size.x, size.y/2);
            grd.addColorStop(0, 'rgba(0,0,0,0.3)');
            grd.addColorStop(1, 'rgba(0,0,0,0.1)');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0, size.x, size.y)
        })

        this.lionHeadImg = createCanvas(new V2(100, 100), function(ctx, size){
            draw(ctx, {fillStyle: '#CECAC3', points: [new V2(49,0), new V2(14,9), new V2(0, 53), new V2(17,86), new V2(49,99), new V2(82,86), new V2(99,53), new V2(85,9)]});
            // draw(ctx, {fillStyle: '#BAAEA2', points: [new V2(44,7), new V2(22,13), new V2(15,23), new V2(16,48), new V2(25,69), new V2(48,88), 
            //     new V2(55,88), new V2(75,69), new V2(83,48), new V2(84,23), new V2(77,13), new V2(55,7)]});
            //griva
            draw(ctx, {fillStyle: '#888A94', points: [new V2(49,10), new V2(49, 0), new V2(35,4), new V2(43, 12)]})
            draw(ctx, {fillStyle: '#B8B0AF', points: [new V2(35,4), new V2(43, 12), new V2(27,14), new V2(15,9)]});
            draw(ctx, {fillStyle: '#887F76', points: [new V2(27,14), new V2(15,9), new V2(12, 17), new V2(26,18)]});
            draw(ctx, {fillStyle: '#CAC3BA', points: [new V2(12, 17), new V2(26,18), new V2(22,26), new V2(7,34)]});
            draw(ctx, {fillStyle: '#645F62', points: [new V2(22,26), new V2(7,34), new V2(6,37), new V2(21,33)]});
            draw(ctx, {fillStyle: '#C8C2B5', points: [new V2(6,37), new V2(21,33), new V2(21,39), new V2(3,47)]});
            draw(ctx, {fillStyle: '#83838B', points: [new V2(21,39), new V2(3,47), new V2(1,53), new V2(3,58), new V2(10,48), new V2(21,43)]});
            draw(ctx, {fillStyle: '#C4BDB6', points: [new V2(3,58), new V2(10,48), new V2(21,43), new V2(21,48), new V2(23,52), new V2(15,56), new V2(8,66)]});
            draw(ctx, {fillStyle: '#655F5C', points: [new V2(23,52), new V2(15,56), new V2(8,66), new V2(10, 72), new V2(16,62), new V2(28,58)]});
            
            

            draw(ctx, {fillStyle: '#616571', points: [new V2(41,14), new V2(28,14), new V2(22,25), new V2(22,32), new V2(30,34), new V2(47,33)]});
            draw(ctx, {fillStyle: '#B6B5B4', points: [new V2(49,10), new V2(41,14), new V2(47,33), new V2(52,33), new V2(58,14)]});
            draw(ctx, {fillStyle: '#DEDAD8', points: [new V2(59,15), new V2(73,16), new V2(78,26), new V2(78,31), new V2(53,33)]});
            draw(ctx, {fillStyle: '#DFD9CD', points: [new V2(33,34), new V2(41,43), new V2(47,34)]});
            draw(ctx, {fillStyle: '#9B9187', points: [new V2(27,33), new V2(35,34), new V2(38,40), new V2(32,40)]}); // left eye
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:2, closePath: false, points: [new V2(36,37), new V2(39,41), new V2(32,40), new V2(27,35), new V2(31,35)]})
            draw(ctx, {fillStyle: '#A09893', points: [new V2(21,32), new V2(21,48), new V2(27,56), new V2(34,51), new V2(29,45), new V2(31,39), new V2(26,33)]});
            draw(ctx, {fillStyle: '#C6BFB6', points: [new V2(31,39), new V2(29,45), new V2(34,51), new V2(41,43), new V2(38,40)]});
            draw(ctx, {fillStyle: '#4A4D54', points: [new V2(47,34), new V2(27,57), new V2(31,65), new V2(38,61), new V2(43,53)]});
            draw(ctx, {fillStyle: '#9DA1AC', points: [new V2(39,60), new V2(47,33), new V2(50,33), new V2(50,54)]}); // nose left
            draw(ctx, {fillStyle: '#EFE8E2', points: [new V2(50,33), new V2(50,54), new V2(61,58), new V2(53,33)]}); // nose right
            draw(ctx, {fillStyle: '#DAD3C6', points: [new V2(53,33), new V2(65,33), new V2(57,42)]});
            draw(ctx, {fillStyle: '#9B9187', points: [new V2(60,40), new V2(65,33), new V2(71,32), new V2(66,39)]}); // right eye
            draw(ctx, {strokeStyle: '#524A4B', lineWidth: 2, closePath: false, points: [new V2(62,37), new V2(60,40), new V2(67,40), new V2(70,36)]})
            draw(ctx, {fillStyle: '#E7E1D5', points: [new V2(67,40), new V2(73,32),new V2(78,31), new V2(78,47), new V2(67,64), new V2(61,56), new V2(57,42), new V2(60,40)]});
            draw(ctx, {fillStyle: '#D8D0C2', points: [new V2(57,42), new V2(60,50), new V2(68,48), new V2(67,40), new V2(60,40)]}); 
            draw(ctx, {fillStyle: '#D4CEC2', points: [new V2(42,59), new V2(50,54), new V2(59,58), new V2(51,64)]}); // nose central
            draw(ctx, {fillStyle: '#A49587', points: [new V2(34,64), new V2(44,72), new V2(51,67), new V2(51,64), new V2(41,59)]});
            draw(ctx, {fillStyle: '#D1C5B6', points: [new V2(51,67), new V2(51,64), new V2(62,58), new V2(67,64), new V2(58,71)]});
            draw(ctx, {strokeStyle: '#796B60', closePath: false, lineWidth: 1, points: [new V2(49,64), new V2(46,61), new V2(42, 59), new V2(46,57)]})
            draw(ctx, {fillStyle: '#3F3E43', points: [new V2(51,67), new V2(44,72), new V2(51,75), new V2(58,71)]}); // mouth
            draw(ctx, {fillStyle: '#757273', points: [new V2(31,65), new V2(40,74), new V2(42,82), new V2(51,87), new V2(51,75), new V2(34,64)]});
            draw(ctx, {fillStyle: '#C5C1B9', points: [new V2(67,64), new V2(65,70), new V2(59,78), new V2(59,82), new V2(51,87), new V2(51,75)]});

            
            // draw(ctx, {fillStyle: '#504A41', points: [new V2(79,20), new V2(86,24), new V2(85,33)]});
            // draw(ctx, {fillStyle: '#938B8A', points: [new V2(87,20), new V2(90,25), new V2(89,31)]});
            // draw(ctx, {fillStyle: '#968B82', points: [new V2(88,33), new V2(88,39), new V2(93,43)]});
            // draw(ctx, {fillStyle: '#514C4B', points: [new V2(85,35), new V2(83,40), new V2(89,48), new V2(86,41)]});
            // draw(ctx, {fillStyle: '#77675E', points: [new V2(80,40), new V2(80,48), new V2(93,57)]});
            // draw(ctx, {fillStyle: '#65554F', points: [new V2(76,52), new V2(75,56), new V2(83,62)]});
            // draw(ctx, {fillStyle: '#5C524D', points: [new V2(73,58), new V2(73,63), new V2(83,78), new V2(84,69)]});
        });

        this.lionHeadSize = new V2(80, 80);

        let obstacle = new GO({
            position: new V2(this.viewport.x/2, this.viewport.y/2),
            size: this.lionHeadSize,
            collisionDetection: {
                enabled: true,
                //render: true,
            },
            /*img: createCanvas(new V2(50,50), function(ctx, size){
                //ctx.fillStyle = 'lightgray';
                //ctx.fillRect(0,0, size.x, size.y);
                //draw(ctx, { fillStyle: 'lightgray', points: [new V2(0,size.y), new V2(size.x, 0), new V2(size.x, size.y)] })
                //draw(ctx, { fillStyle: 'lightgray', points: [new V2(0,0), new V2(size.x, size.y), new V2(0, size.y)] })
                draw(ctx, { fillStyle: 'lightgray', points: [new V2(0, size.x/2), new V2(size.x/2, 0), new V2(size.x, size.y/2)] });
            })*/
            img: this.lionHeadImg
        });
        //obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/2, obstacle.size.y/2), new V2(obstacle.size.x/2, -obstacle.size.y/2), new V2(obstacle.size.x/2, obstacle.size.y/2)];
        //obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/2,-obstacle.size.y/2), new V2(obstacle.size.x/2, obstacle.size.y/2), new V2(-obstacle.size.x/2, obstacle.size.y/2)];
        obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/3, -(obstacle.size.y*2/6)*0.9), new V2(0, -(obstacle.size.y*5/10)*0.9), new V2(obstacle.size.x/3, -(obstacle.size.y*2/6)*0.9)];

        this.addGo(obstacle, 0);

        this.dropColors = ['CACFD2', 'C6CCCA', 'CAD0CF', 'C1C4C5', 'C3C4C3', 'CCCBC6', 'CACBC7', 'D6D7D5', '9A9EA8', 'A6AAAF', 'A1A8AB', '9DA4A7', 'B2B7B9', 'BBBDB8', 'B0B2B2', 'A8ADAE', 
                           'FFFCF5', 'D4D9DC', 'FCF7F4', 'D0E3E9', 'F3F8FB', 'CAD1D7', 'E1EBEC', 'ABC7CB', 'F5FBFB', 'D1E3E3', '8FAEB3', 'DFE5E1', 'EDFFFF', 'AFBDC0', 'D9EAE0', 'F5FCFF'];
        // this.addGo(new Sand({
        //     img: this.sandImg('yellow'),
        //     sandType: 'yellow',
        //     position: new V2(250, 134)
        // }));

        // this.addGo(new Sand({
        //     img: this.sandImg('green'),
        //     sandType: 'green',
        //     position: new V2(250, 133)
        // }));

        // this.addGo(new Sand({
        //     img: this.sandImg('red'),
        //     sandType: 'red',
        //     position: new V2(this.viewport.x/3, 1)//position: new V2(this.viewport.x/2, 1)
        // }), 1);

        // this.addGo(new Sand({
        //     img: this.sandImg('white'),
        //     position: new V2(getRandom(0,this.viewport.x), 1),
        //     speedKoef: getRandom(0.9,1)
        // }), 20);
    }

    stopSandGeneratorTimerMethod() {
        this.sandGenerationTimer = undefined;
        this.stopSandGeneratorTimer = undefined;
        console.log('sand generation timers stopped');
    }

    hexToRgb(hex) {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
    
        return r + "," + g + "," + b;
    }

    dropGenerator(opacity = 1) {
        return this.sandImg(`rgba(${getRandomInt(115, 122)},${getRandomInt(158,216)},${getRandomInt(228,255)}, ${opacity})`)
        //return this.sandImg(`rgba(${this.hexToRgb(this.dropColors[getRandomInt(0, this.dropColors.length-1)])}, ${opacity})`)
    }

    sandGenerationMethod(){
        let isMouth = getRandomInt(1,4) == 4;
        this.addGo(new Sand({
            img: this.dropGenerator(1),//this.sandImg('white'),
            position: isMouth ? new V2(this.viewport.x/2 + getRandom(-4, 4), this.viewport.y/2+this.viewport.y*0.035) : new V2(getRandom(0,this.viewport.x), -1),
            speedKoef: getRandom(0.9,1),
            size: this.sizes[0], 
            isMouth: isMouth
        }), 20);

        for(let i = 0; i < 3; i++){
            this.addGo(new Sand({
                img: this.dropGenerator(0.75),//this.sandImg('rgba(255,255,255,0.75)'),
                position: isMouth ? new V2(this.viewport.x/2 + getRandom(-4, 4), this.viewport.y/2+this.viewport.y*0.035) :new V2(getRandom(0,this.viewport.x), -1),
                speedKoef: getRandom(0.6, 0.8),
                size: this.sizes[1],
                isMouth: isMouth
            }), 19);
        }

        for(let i = 0; i < 6; i++){
            this.addGo(new Sand({
                img: this.dropGenerator(0.5),//this.sandImg('rgba(255,255,255,0.5)'),
                position: isMouth ? new V2(this.viewport.x/2 + getRandom(-4, 4), this.viewport.y/2+this.viewport.y*0.035) :new V2(getRandom(0,this.viewport.x), -1),
                speedKoef: getRandom(0.35,0.55),
                size: this.sizes[2],
                isMouth: isMouth
            }), 18);
        }

    }

    backgroundRender(){
        // SCG.contexts.background.fillStyle = 'black';
        // SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);

        SCG.contexts.background.drawImage(this.backgroundImg, 
            0, 0, 
            SCG.viewport.real.width, 
            SCG.viewport.real.height);
    }

    preMainWork(now){
        if(this.stopSandGeneratorTimer)
            doWorkByTimer(this.stopSandGeneratorTimer, now);

        if(this.sandGenerationTimer)
            doWorkByTimer(this.sandGenerationTimer, now);
    }

    afterMainWork(){
        if(this.debugging.enabled){
            let ctx = SCG.contexts.main;

            ctx.font = this.debugging.font;
            ctx.textAlign = this.debugging.textAlign;
            ctx.fillStyle = this.debugging.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debugging.position.x, this.debugging.position.y);
        }
        
    }
}

class Sand extends MovingGO {
    constructor(options = {}) {
        options = assignDeep({}, {
            curvedMovement: {
                angleInRads: 0,
                direction: undefined,
                speed: 0,
                enabled: false,
                time: 0,
                timeMultiplier: 1/60,
                startPoint: undefined,
            },
            next: {

            },
            speedKoef: 1,
            defaultYAcceleration: new V2(0, 10/90),
            defaultXDelta: 1/100,
            size: new V2(1,1),
            speedV2: new V2(0, 0),
            speed: 1,
            positionChangeProcesser: function() { return this.positionChangeProcesserInternal() },
            collisionDetection: {
                enabled: true,
                //render: true,
                preCheck: function(go) {
                    return this.type !== go.type;
                },
                onCollision: function(collidedWith, collisionPoints, details) { this.onCollisionInternal(collidedWith, collisionPoints, details); }
            }
        }, options);

        super(options);

        this.initialPosition = this.position.clone();
        this.collisionDetection.circuit = [this.defaultYAcceleration.clone(), new V2(0, -this.size.y/2)];
        // this.collisionDetection.circuit = [this.defaultYAcceleration.clone(), //new V2(0, 0),
        //     new V2(0, this.size.y/2), new V2(-this.size.x/2, this.size.y/2),new V2(-this.size.x/2, -this.size.y/2), new V2(this.size.x/2, -this.size.y/2), new V2(this.size.x/2, this.size.y/2), new V2(0, this.size.y/2)];
    }

    init() {
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y+20));

        let ps = this.parentScene;
        if(this.isMouth || this.position.x < (ps.viewport.x/2-(ps.lionHeadSize.x/2)) || this.position.x > (ps.viewport.x/2+(ps.lionHeadSize.x/2)) ){
            this.collisionDetection.enabled = false;
        }
    }

    onCollisionInternal(collidedWith, collisionPoints, details) {
        let nextPosition; 
        if(isArray(collidedWith)){
            let closest = collidedWith[0];
            let closestAvg = closest.collisionPoints ? V2.average(closest.collisionPoints): closest.collidedWith.position;
            let distance = this.position.distance(closestAvg);
            for(let i = 1; i < collidedWith.length; i++){
                let c = collidedWith[i];
                let avg = c.collisionPoints ? V2.average(c.collisionPoints): c.collidedWith.position;
                let d = this.position.distance(avg);

                if(d < distance){
                    closest = c;
                    closestAvg = avg;
                    distance = d;
                }
            }

            collidedWith = closest.collidedWith;
            collisionPoints = closest.collisionPoints;
            nextPosition = closestAvg;
        }
        else {
            nextPosition = (collisionPoints ? (collisionPoints.length > 1 ? V2.average(collisionPoints): collisionPoints[0]): this.position);//.substract(this.speedV2);
        }

        let cv = this.curvedMovement;
        // if collidedWith - stopped
        // if collidedWith - moving

        if(collidedWith.type == 'Sand'){
            if(this.speedV2.module() < 0.5){
                if(collidedWith.speedV2.module() < 0.5){
                    this.next.speed =new V2(); 
                    cv.enabled = false;
                    cv.direction = undefined;
                    return;
                }
                else {
                    this.next.speed = collidedWith.speedV2.divide(2);
                    this.skipPositionUpdate = true;
                    return;
                }
            }
            else {
                if(collidedWith.speedV2.module() < 0.5){
                    this.next.position = nextPosition.substract(this.speedV2);
                    this.position = this.next.position.clone();
                }
                else {
                    this.next.speed = collidedWith.speedV2.divide(2);
                    return;
                }
            }
            
        }
        else {
            let firstCollisionLine = details.map(x => x.line)[0];
            if(firstCollisionLine.begin.y == firstCollisionLine.end.y){
                if(this.speedV2.module() < 0.5){

                    this.position.substract(this.defaultYAcceleration, true);
                    this.next.speed = new V2(); 
                    //this.speedV2 = new V2();
                    cv.enabled = false;
                    cv.direction = undefined;
                    return;
                }
                else {
                    this.next.position = nextPosition;
                    this.position = this.next.position.clone();
                }    

                if(cv.direction == undefined){
                    cv.direction =  getRandomBool() ? -1 : 1;
                    cv.angleInRads = degreeToRadians(getRandom(30, 60));
                }
                else {
                    let mirroredSpeedV2 = new V2(this.speedV2.x, -this.speedV2.y);
                    cv.angleInRads = Math.acos(mirroredSpeedV2.normalize().dot(V2.up));
                }
            }
            else {
                let direction = firstCollisionLine.begin.y > firstCollisionLine.end.y 
                    ? firstCollisionLine.begin.direction(firstCollisionLine.end)
                    : firstCollisionLine.end.direction(firstCollisionLine.begin);
                
                let collisionLineAngleToV2Up = radiansToDegree(Math.acos(direction.dot(V2.up)));
                cv.angleInRads = degreeToRadians(90 - (180+2*collisionLineAngleToV2Up));
                cv.direction = direction.x > 0 ? 1 : -1;
                
                // this.next.position = nextPosition;
                // this.position = this.next.position.clone();
                // this.position.substract(this.defaultYAcceleration, true);
            }
            
        }
        
        cv.enabled = true;

        // if(cv.angleInRads == undefined){
            
        // }
        
            

        
        cv.time = 0;

        cv.speed = this.speedV2.y/4;

        // this.speedV2.x = cv.direction*cv.speed*Math.cos(cv.angleInRads);
        // this.speedV2.y = -1*(cv.speed*Math.sin(cv.angleInRads)-this.defaultYAcceleration.y*cv.time);
        // this.collisionDetection.circuit[0]= this.speedV2.clone();

        this.next.speed = new V2(cv.direction*cv.speed*Math.cos(cv.angleInRads), -1*(cv.speed*Math.sin(cv.angleInRads)-this.defaultYAcceleration.y*cv.time));
        this.skipPositionUpdate = true;
        cv.time++;
    }

    positionChangeProcesserInternal(){
        if(this.next.position){
            this.position = this.next.position;
            this.next.position = undefined;
            //return;
        }

        if(this.next.speed){
            this.speedV2 = this.next.speed;
            this.collisionDetection.circuit[0] = this.speedV2.clone();
            this.next.speed = undefined;
        }

        if(this.skipPositionUpdate){
            this.skipPositionUpdate = false;
            return;
        }

        let cv = this.curvedMovement;
        this.position.add(this.speedV2.mul(this.speedKoef), true);

        if(cv.enabled){
            
            
            if(this.speedV2.x != 0){
                let lesserZero = this.speedV2.x < 0;

                this.speedV2.x += (lesserZero ? 1 : -1)* this.defaultXDelta;
                if((lesserZero && this.speedV2.x > 0) || (!lesserZero && this.speedV2.x < 0)){
                    this.speedV2.x = 0;
                }
            }

            this.speedV2.y = -1*(cv.speed*Math.sin(cv.angleInRads)-this.defaultYAcceleration.y*cv.time);
            cv.time++;
        }
        else {
            this.speedV2.add(this.defaultYAcceleration, true);
        }

        this.collisionDetection.circuit[0] = this.speedV2.clone();
    }

    destinationCompleteCheck(){
        if(this.position.y > this.parentScene.viewport.y) {
            this.speedV2 =  new V2(0, 0),
            this.position.y = this.initialPosition.y;
            this.position.x = this.initialPosition.x;
            //this.isMouth ? new V2(this.parentScene.viewport.x/2 + getRandom(-4, 4), this.parentScene.viewport.y/2+this.parentScene.viewport.y*0.035) : new V2(getRandom(0,this.parentScene.viewport.x), 1)
            this.curvedMovement = {
                angleInRads: 0,
                direction: undefined,
                speed: 0,
                enabled: false,
                time: 0,
                timeMultiplier: 1/60,
                startPoint: undefined,
            },
            this.next = {

            }

            // let ps = this.parentScene;
            // this.collisionDetection.enabled = true;
            // if(this.isMouth || this.position.x < (ps.viewport.x/2-(ps.lionHeadSize.x/2)) || this.position.x > (ps.viewport.x/2+(ps.lionHeadSize.x/2)) ){
            //     this.collisionDetection.enabled = false;
            // }
            //this.setDead();
            //console.log('sand setDead');
        }
    }
}