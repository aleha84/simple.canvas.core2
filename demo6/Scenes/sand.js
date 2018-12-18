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
                textAlign: 'left',
                fillStyle: 'red',
                position: new V2(20*SCG.viewport.scale, 20*SCG.viewport.scale),
                avgUpdate: {
                    currentSecond: -1,
                    value: 0,
                    values: []
                },
                createdDrops: 0
            }
        }, options);

        super(options);

        this.sizes = [new V2(2,4), new V2(1.75,3.5), new V2(1.5,3),new V2(1.25,1.25), new V2(1,1)]
        this.dropsCache = [];

        this.sandImg = function(color = 'white') {
            if(!this.sandImgs){
                this.sandImgs = {};
            }

            if(this.sandImgs[color]){
                return this.sandImgs[color];
            }

            let img = createCanvas(new V2(1, 1), function(ctx, size) {
                ctx.fillStyle = color;
                ctx.fillRect(0,0, size.x, size.y);
                
                //ctx.lineWidth = 0.1;
                // ctx.strokeStyle = color;
                // ctx.strokeRect(0,0, size.x, size.y);

                // draw(ctx, {fillStyle: color, points: [new V2(size.x*1/3, 0), new V2(0, size.y*3/4), new V2(size.x/2, size.y), new V2(size.x, size.y*3/4), new V2(size.x*2/3, 0)]})
            });

            this.sandImgs[color] = img;

            return img;
        } 

        this.sandGenerationTimer = createTimer(10, this.sandGenerationMethod, this, true);
        this.mouthWaterGenerationTimer = createTimer(50, this.mouthWaterGenerationMethod, this, true);
        this.cupWaterGenerationTimer = createTimer(100, this.cupWaterGenerationMethod, this, true);
        
        //obstackle

        this.brickSize = new V2(this.viewport.x/8, this.viewport.y/30);
        this.defaulBrickFillStyle = '#CEB298';
        this.randomBrickFillStyle = ['#C4A991', '#B59B85', '#B59B85', '#A8907C', '#9E8774'];

        this.flipX = function(p, xOrigin) {
            let relativeOrigin = p.x - xOrigin;
            let reverted = -relativeOrigin;

            return new V2(reverted+xOrigin, p.y)
        }

        let that = this;
        this.backgroundImg = createCanvas(new V2(this.viewport.x, this.viewport.y), function(ctx, size) {
            let brickSize = that.brickSize;
            let firstRowFillStyle = ctx.createLinearGradient(brickSize.x/2, 0, brickSize.x/2, brickSize.y);
            let defaulBrickFillStyle = that.defaulBrickFillStyle;
            let randomBrickFillStyle = that.randomBrickFillStyle;
            let leafsColor = ['#5A8162', '#0E1E14', '#2D582D', '#4C775C', '#69936D', '#456444']
            firstRowFillStyle.addColorStop(0, 'white');
            firstRowFillStyle.addColorStop(0.3, '#A09D98');
            firstRowFillStyle.addColorStop(1, defaulBrickFillStyle);
            //ctx.imageSmoothingEnabled = false;

            for(let ri = 0;ri<size.y/brickSize.y;ri++){
                let shift = ri%2 == 0;
                for(let ci = 0; ci < size.x/brickSize.x + (shift ? 1 : 0);ci++){  
                    let tlx =  brickSize.x*ci - (shift ? brickSize.x/2 : 0);
                    let tly = brickSize.y*ri;
                       
                    if(getRandomInt(0,5) == 5){
                        ctx.fillStyle = randomBrickFillStyle[getRandomInt(0, randomBrickFillStyle.length -1)]
                    }
                    else {
                        ctx.fillStyle = defaulBrickFillStyle;
                    }
                    
                    ctx.fillRect(tlx,tly, brickSize.x, brickSize.y);
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(tlx,tly, brickSize.x, brickSize.y);
                    let cLineWidth = 2;

                    draw(ctx, {strokeStyle: '#7A695A', closePath: false, lineWidth:cLineWidth, 
                        points: [new V2(tlx+cLineWidth/2, tly+cLineWidth/2), new V2(tlx+cLineWidth/2, tly +brickSize.y - cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly+brickSize.y-cLineWidth/2)]})
                    draw(ctx, {strokeStyle: '#E5C5A9', closePath: false, lineWidth:cLineWidth/2, 
                        points: [new V2(tlx+cLineWidth, tly+cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly + cLineWidth/2), new V2(tlx+brickSize.x-cLineWidth/2, tly+brickSize.y-cLineWidth)]})

                    if(getRandomInt(0,3) == 3) {
                        let s = new V2(getRandom(brickSize.x*0.1, brickSize.x*0.9) + tlx, tly);
                        let e = new V2(getRandom(brickSize.x*0.1, brickSize.x*0.9) + tlx, tly + brickSize.y);
                        let m = new V2(getRandom(s.x < e.x ? s.x : e.x, s.x > e.x ? s.x : e.x), tly + getRandom(brickSize.y*0.3, brickSize.y*0.7));
                        
                        draw(ctx, {strokeStyle: '#7A695A', closePath: false, lineWidth:0.5, points: [s, m, e]});
                    }
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

            
            for(let bc = 0; bc < 6; bc++){
                let bushStartX = ((getRandomBool() ? 0.2 : 0.8)* size.x) + getRandom(-0.15, 0.15)*size.x;
                let current = new V2(bushStartX, size.y);
                let trunkpoints = [current.clone()];
                for(let j = 3; j > 0; j--){
                    let bushSegmentStep = getRandom(3,6)+j;
                    let segments = getRandomInt(5,15);
                    for(let i = 0; i < segments; i++){
                        let angle = getRandom(-j*10, j*10);
                        let direction = V2.up.rotate(angle, false);
                        current.add(direction.mul(bushSegmentStep), true);
                        trunkpoints.push(current.clone());
                        
                        if(j == 1 && i >= segments -2)
                            continue;
    
                        draw(ctx, {fillStyle: leafsColor[getRandomInt(0, leafsColor.length-1)], 
                            points: [new V2(current.x, current.y+getRandom(-2,2)), new V2(current.x+getRandom(1,2)*j, current.y-getRandom(4,7)), new V2(current.x+getRandom(3,4)*j, current.y-getRandom(4,7)), new V2(current.x+j*getRandom(3,4)-getRandom(1,3), current.y-getRandom(0,2))]})
                        draw(ctx, {fillStyle: leafsColor[getRandomInt(0, leafsColor.length-1)], 
                            points: [new V2(current.x, current.y+getRandom(-2,2)), new V2(current.x+getRandom(1,2)*j, current.y-getRandom(4,7)), new V2(current.x+getRandom(3,4)*j, current.y-getRandom(4,7)), new V2(current.x+j*getRandom(3,4)-getRandom(1,3), current.y-getRandom(0,2))].map(p => that.flipX(p, current.x))})
                    }
    
                    draw(ctx, {strokeStyle: '#3E654A', closePath: false, lineWidth: j, points: trunkpoints});
                }
            }
            
            let grd = ctx.createLinearGradient(0, size.y/2, size.x, size.y/2);

            grd.addColorStop(0, 'rgba(0,0,0,0.4)');
            grd.addColorStop(1, 'rgba(0,0,0,0.1)');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0, size.x, size.y)
        })

        this.lionHeadImg = createCanvas(new V2(100, 100), function(ctx, size){
            draw(ctx, {fillStyle: '#CECAC3', points: [new V2(49,0), new V2(14,9), new V2(0, 53), new V2(17,86), new V2(49,99), new V2(82,86), new V2(99,53), new V2(85,9)]});
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:2, closePath: false, points: [new V2(13,9), new V2(0, 53), new V2(15,86), new V2(47,99)]})

            draw(ctx, {fillStyle: '#A49790', points: [new V2(50, 10), new V2(50,3), new V2(62,10), new V2(57, 14)].map(p => that.flipX(p, size.x/2))});
            draw(ctx, {fillStyle: '#919194', points: [new V2(60, 2), new V2(57,5), new V2(71,13), new V2(77, 9)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(74, 16), new V2(88,24), new V2(78,43), new V2(78, 26)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(88,24), new V2(78,43)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(78, 39), new V2(94,57), new V2(75,52)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(94,57), new V2(75,52)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#919194', points: [new V2(92,61), new V2(80,54), new V2(87,68)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(75, 52), new V2(68,63), new V2(83,78), new V2(84,68)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(83,78), new V2(68,63)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(65, 67), new V2(58,78), new V2(66,89), new V2(70,72)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(58,78), new V2(66,89)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(91, 28), new V2(87,36), new V2(94,42)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#919194', points: [new V2(79, 10), new V2(77,15), new V2(88,21), new V2(90,18)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#919194', points: [new V2(71, 68), new V2(72,79), new V2(76,74)].map(p => that.flipX(p, size.x/2))})
            draw(ctx, {fillStyle: '#919194', points: [new V2(54, 85), new V2(54,96), new V2(58,90)].map(p => that.flipX(p, size.x/2))})

            draw(ctx, {fillStyle: '#A49790', points: [new V2(50, 10), new V2(50,3), new V2(62,10), new V2(57, 14)]})
            draw(ctx, {fillStyle: '#919194', points: [new V2(60, 2), new V2(57,5), new V2(71,13), new V2(77, 9)]})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(74, 16), new V2(88,24), new V2(78,43), new V2(78, 26)]})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(88,24), new V2(78,43)]})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(78, 39), new V2(94,57), new V2(75,52)]})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(94,57), new V2(75,52)]})
            draw(ctx, {fillStyle: '#919194', points: [new V2(92,61), new V2(80,54), new V2(87,68)]})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(83,78), new V2(68,63)]})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(75, 52), new V2(68,63), new V2(83,78), new V2(84,68)]})
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(58,78), new V2(66,89)]})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(65, 67), new V2(58,78), new V2(66,89), new V2(70,72)]})
            draw(ctx, {fillStyle: '#A49790', points: [new V2(91, 28), new V2(87,36), new V2(94,42)]})
            draw(ctx, {fillStyle: '#919194', points: [new V2(79, 10), new V2(77,15), new V2(88,21), new V2(90,18)]})
            draw(ctx, {fillStyle: '#919194', points: [new V2(71, 68), new V2(72,79), new V2(76,74)]})
            draw(ctx, {fillStyle: '#919194', points: [new V2(54, 85), new V2(54,96), new V2(58,90)]})

            draw(ctx, {fillStyle: '#616571', points: [new V2(41,14), new V2(28,14), new V2(22,25), new V2(22,32), new V2(30,34), new V2(47,33)]});
            draw(ctx, {fillStyle: '#B6B5B4', points: [new V2(49,10), new V2(41,14), new V2(47,33), new V2(52,33), new V2(58,14)]});
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(41,14), new V2(49,10), new V2(58,14)]})
            draw(ctx, {fillStyle: '#DEDAD8', points: [new V2(59,15), new V2(73,16), new V2(78,26), new V2(78,31), new V2(53,33)]});
            draw(ctx, {fillStyle: '#DFD9CD', points: [new V2(33,34), new V2(41,43), new V2(47,34)]});
            draw(ctx, {fillStyle: '#9B9187', points: [new V2(27,33), new V2(35,34), new V2(38,40), new V2(32,40)]}); // left eye
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:2, closePath: false, points: [new V2(36,37), new V2(39,41), new V2(32,40), new V2(27,35), new V2(31,35)]})
            draw(ctx, {fillStyle: '#A09893', points: [new V2(21,32), new V2(21,48), new V2(27,56), new V2(34,51), new V2(29,45), new V2(31,39), new V2(26,33)]});
            draw(ctx, {strokeStyle: '#2B2A27', lineWidth:1, closePath: false, points: [new V2(22,32), new V2(21,48), new V2(27,56)]})
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
        });

        this.lionHeadSize = new V2(80, 80);
        this.lionHeadPosition = new V2(this.viewport.x/2, this.viewport.y/3);
        let obstacle = new GO({
            position: this.lionHeadPosition,
            size: this.lionHeadSize,
            collisionDetection: {
                enabled: true,
                //render: true,
            },
            img: this.lionHeadImg
        });
        //obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/2, obstacle.size.y/2), new V2(obstacle.size.x/2, -obstacle.size.y/2), new V2(obstacle.size.x/2, obstacle.size.y/2)];
        //obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/2,-obstacle.size.y/2), new V2(obstacle.size.x/2, obstacle.size.y/2), new V2(-obstacle.size.x/2, obstacle.size.y/2)];
        obstacle.collisionDetection.circuit = [new V2(-obstacle.size.x/3, -(obstacle.size.y*2/6)*0.8), new V2(0, -(obstacle.size.y*5/10)*0.8), new V2(obstacle.size.x/3, -(obstacle.size.y*2/6)*0.8)];

        this.addGo(obstacle, 0);

        this.cupPosition = new V2(this.viewport.x/2, this.viewport.y/2+this.viewport.y/15);
        this.cupSize = new V2(this.viewport.x/3, this.viewport.y/10);

        this.cup = new GO({
            position: this.cupPosition,
            size: this.cupSize,
            img: createCanvas(this.cupSize, function(ctx, size){
                //ctx.fillStyle = 'red';
                let topBorderSize = new V2(size.x, size.y/4);
                let tly = 0;
                let tlx = 0;
                let grd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + topBorderSize.y);
                grd.addColorStop(0, '#CECAC3');
                grd.addColorStop(1, '#A49790');
                let matGrd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + topBorderSize.y);
                matGrd.addColorStop(0, 'rgba(0,0,0,0.3)');
                matGrd.addColorStop(0.4, 'rgba(255,255,255,0.5)');
                matGrd.addColorStop(1, 'rgba(255,255,255,0.1)');
                let lightGrd = ctx.createLinearGradient(tlx, tly + topBorderSize.y/2, tlx + topBorderSize.x, tly + topBorderSize.y/2);
                lightGrd.addColorStop(0, 'rgba(0,0,0,0.3)');
                lightGrd.addColorStop(0.5, 'rgba(0,0,0,0)');
                

                draw(ctx, {fillStyle: [grd, matGrd, lightGrd], points: [new V2(tlx, tly+topBorderSize.y/2), new V2(tlx+topBorderSize.y/2, tly), new V2(tlx + topBorderSize.x - topBorderSize.y/2, tly),
                                                      new V2(tlx + topBorderSize.x, tly+topBorderSize.y/2), new V2(tlx + topBorderSize.x, tly + topBorderSize.y), new V2(tlx, tly + topBorderSize.y)]})
                
                let middlePartSize = new V2(size.x, size.y/2);
                tly += topBorderSize.y-1;
                //ctx.fillStyle = 'green';
                ctx.beginPath();ctx.moveTo(tlx + topBorderSize.y/2, tly);
                ctx.bezierCurveTo(tlx + middlePartSize.x*1/6, tly + middlePartSize.y*3/6, tlx + middlePartSize.x*2/6, tly + middlePartSize.y*5/6, tlx + middlePartSize.x/2, tly + middlePartSize.y);
                ctx.bezierCurveTo(tlx + middlePartSize.x*4/6, tly + middlePartSize.y*5/6, tlx + middlePartSize.x*5/6, tly + middlePartSize.y*3/6, tlx + middlePartSize.x - topBorderSize.y/2, tly);
                ctx.closePath();//ctx.fill();
                grd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + middlePartSize.y);
                grd.addColorStop(0, '#A49790');
                grd.addColorStop(1, '#CECAC3');
                ctx.fillStyle = grd;ctx.fill();
                matGrd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + middlePartSize.y);
                matGrd.addColorStop(0, 'rgba(0,0,0,0.4)');
                matGrd.addColorStop(0.7, 'rgba(255,255,255,0.2)');
                matGrd.addColorStop(0.85, 'rgba(0,0,0,0.3)');
                ctx.fillStyle = matGrd;ctx.fill();
                lightGrd = ctx.createLinearGradient(tlx, tly + middlePartSize.y/2, tlx + middlePartSize.x, tly + middlePartSize.y/2);
                lightGrd.addColorStop(0, 'rgba(0,0,0,0.3)');
                lightGrd.addColorStop(0.7, 'rgba(0,0,0,0)');
                ctx.fillStyle = lightGrd;ctx.fill();

                let bottomPartSize = new V2(size.x/4, size.y/3);
                tly = size.y - bottomPartSize.y;
                tlx = size.x/2 - bottomPartSize.x/2;

                grd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + bottomPartSize.y);
                grd.addColorStop(0, '#A49790');
                grd.addColorStop(1, '#CECAC3');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.moveTo(tlx, tly); ctx.lineTo(tlx, tly + bottomPartSize.y/2);
                ctx.bezierCurveTo(tlx, tly + bottomPartSize.y, tlx + bottomPartSize.x, tly + bottomPartSize.y, tlx + bottomPartSize.x, tly + bottomPartSize.y/2);
                ctx.lineTo(tlx + bottomPartSize.x, tly); ctx.closePath(); ctx.fill();

                matGrd = ctx.createLinearGradient(size.x/2, tly, size.x/2, tly + bottomPartSize.y);
                matGrd.addColorStop(0, 'rgba(0,0,0,0.3)');
                matGrd.addColorStop(1, 'rgba(0,0,0,0.1)');
                matGrd.addColorStop(0.65, 'rgba(255,255,255,0.2)');
                matGrd.addColorStop(0.9, 'rgba(0,0,0,0.2)');
                ctx.fillStyle = matGrd;ctx.fill();
                lightGrd = ctx.createLinearGradient(tlx, tly + bottomPartSize.y/2, tlx + bottomPartSize.x, tly + bottomPartSize.y/2);
                lightGrd.addColorStop(0, 'rgba(0,0,0,0.3)');
                lightGrd.addColorStop(0.5, 'rgba(0,0,0,0)');
                ctx.fillStyle = lightGrd;ctx.fill();

                //ctx.clearRect(topBorderSize.x*1/8, 0, 5,4);
                ctx.fillStyle= '#CECAC3';
                ctx.fillRect(topBorderSize.x*1/8, 0, 5,5);
                ctx.fillStyle= '#A49790';
                ctx.fillRect(topBorderSize.x*7/8 - 5, 0, 5,5);
                ctx.clearRect(topBorderSize.x/2 - 2.5, 0, 5,5);
            })
        });

        this.addGo(this.cup, 20);
        this.addGo(new GO({
            position: new V2(this.cupPosition.x - this.cupSize.x/2, this.cupPosition.y),
            size: this.cupSize.clone(),
            img: createCanvas(this.cupSize, function(ctx, size) {
                let grd = ctx.createLinearGradient(0, size.y, size.x/2, 0);
                grd.addColorStop(0.7, 'rgba(0,0,0,0)')
                grd.addColorStop(1, 'rgba(0,0,0,0.5)')
                // draw(ctx, {fillStyle: grd, points: [new V2(0, 0), new V2(0, size.y*1/4), new V2(size.x/2 - size.x/8, size.y*3/4), new V2(size.x/2 - size.x/8, size.y*0.95), new V2(size.x, size.y*0.95), new V2(size.x, 0)]})
                ctx.fillStyle = grd;
                ctx.fillRect(0,0,size.x,size.y*0.95)
            })
        }), 5)

        this.bottomBorderSize = new V2(this.viewport.x, this.viewport.y/20);
        this.addGo(new GO({
            img: createCanvas(this.bottomBorderSize, function(ctx, size) {
                // ctx.fillStyle = 'red';
                // ctx.fillRect(0,0, size.x, size.y);
                
                let bottomBrickSize = new V2(that.bottomBorderSize.x/5, that.bottomBorderSize.y);
                let tly = 0;//that.viewport.y - that.bottomBorderSize.y;
                
                for(let i =0; i < 6;i++){
                    let tlx = i*bottomBrickSize.x - bottomBrickSize.x/2;
                    if(getRandomBool()){
                        ctx.fillStyle = that.randomBrickFillStyle[getRandomInt(0, that.randomBrickFillStyle.length -1)]
                    }
                    else {
                        ctx.fillStyle = that.defaulBrickFillStyle;
                    }
                    //ctx.fillStyle = 'red';
                    
                    ctx.fillRect(tlx,tly, bottomBrickSize.x, bottomBrickSize.y);
                    //
                    //
                    draw(ctx, {strokeStyle: 'black', lineWidth: 1, points: [new V2(tlx, tly), new V2(tlx, tly+bottomBrickSize.y)]});
                    draw(ctx, {strokeStyle: 'black', lineWidth: 1, points: [new V2(tlx+bottomBrickSize.x, tly), new V2(tlx+bottomBrickSize.x, tly+bottomBrickSize.y)]});

                    draw(ctx, {strokeStyle: '#7A695A', lineWidth: 1, points: [new V2(tlx+2, tly), new V2(tlx+2, tly+bottomBrickSize.y)]});
                    draw(ctx, {strokeStyle: '#E5C5A9', lineWidth: 1, points: [new V2(tlx+bottomBrickSize.x-2, tly), new V2(tlx+bottomBrickSize.x-2, tly+bottomBrickSize.y)]});
                    
                    ctx.fillStyle = '#5A5D62';
                    for(let i = 0; i < bottomBrickSize.x*bottomBrickSize.y*0.01;i++){
                        ctx.fillRect(parseInt(getRandomInt(0, bottomBrickSize.x) + tlx),parseInt(getRandomInt(0, bottomBrickSize.y)+tly),1,1);
                    }
                }

                let grd = ctx.createLinearGradient(size.x/2, 0, size.x/2, size.y);
                grd.addColorStop(0, 'rgba(0,0,0,0.2)');
                grd.addColorStop(0.15, 'rgba(255,255,255,0.2)');
                grd.addColorStop(0.35, 'rgba(255,255,255,0.4)');
                grd.addColorStop(1, 'rgba(0,0,0,0.3)');

                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                for(let i =0; i < 6;i++){
                    let tlx = i*bottomBrickSize.x - bottomBrickSize.x/2;
                    ctx.clearRect(tlx-1, tly,2,1)
                }
            }),
            position: new V2(this.viewport.x/2, this.viewport.y - this.bottomBorderSize.y/2),
            size: this.bottomBorderSize
        }), 30)

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

    hexToRgb(hex, asArray = false) {
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
    
        if(asArray) 
            return [r,g,b];
        
            return r + "," + g + "," + b;
    }

    dropGenerator(opacity = 1) {
        let from = this.hexToRgb('CAEBF7', true);
        let to = this.hexToRgb('BAD8E2', true);
        
        return this.sandImg(`rgba(${getRandomInt(from[0], to[0])},${getRandomInt(from[1],to[1])},${getRandomInt(from[2],to[2])}, ${opacity})`)
        //return this.sandImg(`rgba(${getRandomInt(115, 122)},${getRandomInt(158,216)},${getRandomInt(228,255)}, ${opacity})`)
        //return this.sandImg(`rgba(${this.hexToRgb(this.dropColors[getRandomInt(0, this.dropColors.length-1)])}, ${opacity})`)
    }

    dropGenerator2(layer) {
        let opacity = 1
        let from = this.hexToRgb('CAEBF7', true);
        let to = this.hexToRgb('BAD8E2', true);
        if(layer == 1){
            opacity = 1//0.9
            from = this.hexToRgb('BAD8E2', true);
            to = this.hexToRgb('ABC3CC', true);
        }
        else if(layer == 2){
            opacity = 1//0.8
            from = this.hexToRgb('ABC3CC', true);
            to = this.hexToRgb('9AAFB7', true);
        }
        
        return this.sandImg(`rgba(${getRandomInt(from[0], to[0])},${getRandomInt(from[1],to[1])},${getRandomInt(from[2],to[2])}, ${opacity})`)
    }

    getDropItemFromCache(layer){
        if(this.dropsCache[layer] == undefined)
            this.dropsCache[layer] = [];

        if(this.dropsCache[layer].length){
            let drop =  this.dropsCache[layer].pop();
            drop.disabled = false;
            return true;
        }

        this.debugging.createdDrops++;
        return false;
    }

    getXPosition() {
        if(getRandomInt(0,5) != 5){
            return getRandom(0,this.viewport.x)
        }
        else {
            return getRandom(this.viewport.x/2 - this.lionHeadSize.x/2, this.viewport.x/2 + this.lionHeadSize.x/2);
        }
    }

    mouthWaterGenerationMethod() {
        let speedKoef, size, img, loopCount = 1;
        for(let layer = 19; layer > 16; layer--){
            size =  this.sizes[19 - layer];
            switch(layer){
                case 19:loopCount = 2;break;
                case 18: loopCount = 2;break;
                case 17:loopCount = 2;break;
            }

            for(let i = 0; i < loopCount; i++) {
                switch(layer){
                    case 19:speedKoef = getRandom(0.9,1);break;
                    case 18:speedKoef = getRandom(0.6, 0.8);break;
                    case 17:speedKoef = getRandom(0.35,0.55);break;
                }
                let mouthPosition = new V2(1+this.lionHeadPosition.x + getRandom(-4, 4),getRandom(-2, 0) +  this.lionHeadPosition.y + this.lionHeadSize.y*0.23 );
                img = this.dropGenerator2(19 - layer);
                if(!this.getDropItemFromCache(layer))
                    this.addGo(new Sand({
                        img: img,
                        position: mouthPosition,
                        speedKoef: speedKoef,
                        size: size, 
                        isMouth: true,
                        layerIndex: layer
                    }), layer);
            }
            
        }
    }

    cupWaterGenerationMethod() {
        let maxLayer = 26;
        let speedKoef, size, img, loopCount = 1;
        for(let j = -1; j < 2; j++){
            for(let layer = maxLayer; layer > maxLayer - 3; layer--){
                size =  this.sizes[maxLayer - layer];
                switch(layer){
                    case maxLayer:loopCount = 3;break;
                    case maxLayer-1:loopCount = 3;break;
                    case maxLayer-2:loopCount = 3;break;
                }
                for(let i = 0; i < loopCount; i++) {
                    switch(layer){
                        case maxLayer:speedKoef = getRandom(0.9,1);break;
                        case maxLayer-1:speedKoef = getRandom(0.6, 0.8);break;
                        case maxLayer-2:speedKoef = getRandom(0.35,0.55);break;
                    }
                    
                    let cupPosition = new V2(this.viewport.x/2 + j*this.cupSize.x*1/3 + getRandom(-2, 2), this.cupPosition.y - this.cupSize.y/2);
                    img = this.dropGenerator2(maxLayer - layer);
                    let direction = j;//j == 0 ? -1 : 1;
                    let speed = getRandom(2,3);
                    let angleInRads = degreeToRadians(getRandom(-45,-35));
                    let speedV2 = new V2(direction*speed*Math.cos(angleInRads), -1*(speed*Math.sin(angleInRads)));
                    if(!this.getDropItemFromCache(layer))
                        this.addGo(new Sand({
                            img: img,
                            position: cupPosition,
                            speedKoef: speedKoef,
                            size: size, 
                            isCup: true,
                            layerIndex: layer,
                            cupDirection: direction,
                            curvedMovement: direction != 0 ? {
                                enabled: true,
                                direction: direction,
                                angleInRads: angleInRads,
                                speed: speed
                            } : {enabled: false},
                            initialCurvedMovement: direction != 0 ?{
                                enabled: true,
                                direction: direction,
                                angleInRads: angleInRads,
                                speed: speed
                            }: undefined,
                            speedV2: direction != 0 ? speedV2: new V2(0, 0),
                            initialSpeedV2: direction != 0 ? speedV2.clone() : new V2(0, 0)
                        }), layer);
                }
                
            }
        }
        
    }

    sandGenerationMethod(){
        //new V2(this.viewport.x/2 + getRandom(-4, 4), this.viewport.y/2+this.viewport.y*0.035)
        for(let i = 0; i < 1; i++){
            let layer = 23;
            if(!this.getDropItemFromCache(layer))
                this.addGo(new Sand({
                    img: this.dropGenerator2(0),//this.dropGenerator(1),//this.sandImg('white'),
                    position: new V2(this.getXPosition(), -1),
                    speedKoef: getRandom(0.9,1),
                    size: this.sizes[0], 
                    layerIndex: layer
                }), layer);
        }

        for(let i = 0; i < 2; i++){
            let layer = 22;
            if(!this.getDropItemFromCache(layer))
                this.addGo(new Sand({
                    img: this.dropGenerator2(1),//this.dropGenerator(0.95),//this.sandImg('rgba(255,255,255,0.75)'),
                    position: new V2(this.getXPosition(), -1),
                    speedKoef: getRandom(0.6, 0.8),
                    size: this.sizes[1],
                    layerIndex: layer
                }), layer);
        }

        for(let i = 0; i < 3; i++){
            let layer = 21;
            if(!this.getDropItemFromCache(layer))
                this.addGo(new Sand({
                    img: this.dropGenerator2(2),//this.dropGenerator(0.85),//this.sandImg('rgba(255,255,255,0.5)'),
                    position: new V2(this.getXPosition(), -1),
                    speedKoef: getRandom(0.35,0.55),
                    size: this.sizes[2],
                    layerIndex: layer
                }), layer);
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

        if(this.mouthWaterGenerationTimer)
            doWorkByTimer(this.mouthWaterGenerationTimer, now);

        if(this.cupWaterGenerationTimer)
            doWorkByTimer(this.cupWaterGenerationTimer, now);
    }

    afterMainWork(now){
        if(this.debugging.enabled){

            let ctx = SCG.contexts.main;

            ctx.font = this.debugging.font;
            ctx.textAlign = this.debugging.textAlign;
            ctx.fillStyle = this.debugging.fillStyle;
            
            ctx.fillText(SCG.main.performance.fps, this.debugging.position.x, this.debugging.position.y);

            let au = this.debugging.avgUpdate;
            let second = now.getSeconds();
			if(au.currentSecond != second){
                au.value = au.values.reduce((x,y) => x+y, 0)/au.values.length;
                au.currentSecond = second;
                au.values = [];
			}

            //ctx.textAlign = 'left';
            ctx.fillText('avg update: ' + fastRoundWithPrecision(this.debugging.avgUpdate.value, 8), this.debugging.position.x, this.debugging.position.y+25);
            ctx.fillText('Created drops: ' + this.debugging.createdDrops, this.debugging.position.x, this.debugging.position.y+50);
            
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
        this.initialSize = this.size.clone();
        // this.collisionDetection.circuit = [this.defaultYAcceleration.clone(), //new V2(0, 0),
        //     new V2(0, this.size.y/2), new V2(-this.size.x/2, this.size.y/2),new V2(-this.size.x/2, -this.size.y/2), new V2(this.size.x/2, -this.size.y/2), new V2(this.size.x/2, this.size.y/2), new V2(0, this.size.y/2)];
    }

    init() {
        this.setDestination(new V2(this.position.x, this.parentScene.viewport.y+20));

        this.checkCollisionDetectionEnable()
    }

    checkCollisionDetectionEnable() {
        let ps = this.parentScene;
        if(this.isMouth || this.isCup || this.position.x < (ps.lionHeadPosition.x-(ps.lionHeadSize.x/2)) || this.position.x > (ps.lionHeadPosition.x+(ps.lionHeadSize.x/2)) ){
            this.collisionDetection.enabled = false;
        }
        
        this.collisionDetection.initialEnabled = this.collisionDetection.enabled;
    }

    onCollisionInternal(collidedWith, collisionPoints, details) {
        this.collisionDetection.enabled = false;
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
            if(this.position.y < this.parentScene.brickSize.y/5){
                this.speedV2.y = 0.3;
                this.size.y = this.initialSize.y/2;
                this.noSizeChange = true;
            }
            else {
                this.speedV2.add(this.defaultYAcceleration, true);
            }
        }

        if(!this.noSizeChange){
            this.size.y = this.speedV2.y/3;
            if(this.isMouth){
                this.size.y = this.speedV2.y;
            }
            if(this.size.y < this.initialSize.y){
                this.size.y = this.initialSize.y;
            }
        }
        else {
            this.noSizeChange = false;
        }
        

        this.collisionDetection.circuit[0] = this.speedV2.clone();
    }

    beforeUpdateStarted() {
        this.updateStart = new Date();
    }

    afterUpdateCompleted(){
        this.parentScene.debugging.avgUpdate.values.push(new Date() - this.updateStart);
    }

    destinationCompleteCheck(){
        let check = false;
        if(this.isMouth){
            check = this.position.y > this.parentScene.cupPosition.y - this.parentScene.cupSize.y/2;
        }
        else if (this.isCup){
            check = this.position.y > this.parentScene.viewport.y;
        }
        else {
            check = this.position.y > this.parentScene.viewport.y;
        }

        if(check) {
            this.speedV2.x = 0;
            this.speedV2.y = 0;
            this.position.y = this.initialPosition.y;
            this.position.x = this.initialPosition.x;

            if(this.initialCurvedMovement){
                this.curvedMovement.enabled = this.initialCurvedMovement.enabled;
                this.curvedMovement.direction = this.initialCurvedMovement.direction;
                this.curvedMovement.angleInRads = this.initialCurvedMovement.angleInRads;
                this.curvedMovement.speed = this.initialCurvedMovement.speed;
                this.curvedMovement.time = 0;
                this.speedV2 = this.initialSpeedV2.clone();
            }
            else {
                this.curvedMovement = {
                    angleInRads: 0,
                    direction: undefined,
                    speed: 0,
                    enabled: false,
                    time: 0,
                    timeMultiplier: 1/60,
                    startPoint: undefined,
                }
            }
            this.next = {

            }

            this.collisionDetection.enabled = this.collisionDetection.initialEnabled;

            this.disabled = true;

            // if(this.parentScene.dropsCache[this.layer] == undefined){
            //     this.parentScene.dropsCache[this.layerIndex] = [];
            // }
            this.parentScene.dropsCache[this.layerIndex].push(this);
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