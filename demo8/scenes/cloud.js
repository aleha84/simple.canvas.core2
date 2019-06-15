class CloudScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    // drawCircle(ctx, center, radius, yClamp){
    //     let rsq = radius*radius;
    //     let up = V2.up;
    //     for(let y = center.y-radius-1;y < center.y+radius+1;y++){
    //         for(let x = center.x-radius-1;x < center.x+radius+1;x++){
    //             if(yClamp && (y < yClamp[0] || y > yClamp[1])){
    //                 continue;
    //             }
    //             let _p = new V2(x,y);
    //             let distance = center.distance(_p);
    //             if(distance < radius){
    //                 ctx.fillStyle = 'white';
    //                 if( distance > radius-2 ){
    //                     let dir = center.direction(_p);
    //                     let angle = fastRoundWithPrecision(dir.angleTo(up));
    //                     if(angle < -10 && angle > -90){
    //                         ctx.fillStyle = 'gray';
    //                     }
    //                 }
    //                 ctx.fillRect(x,y,1,1);
    //             }
                


    //             // let dx = x-center.x;
    //             // let dy = y-center.y;
    //             // let db = dx*dx + dy*dy;

    //             // if(db < rsq){
    //             //     ctx.fillStyle = 'white';
    //             //     let _p = new V2(x,y);
    //             //     if( fastRoundWithPrecision (center.distance(_p)) > radius-2 ){
    //             //         let dir = center.direction(_p);
    //             //         let angle = fastRoundWithPrecision(dir.angleTo(up));
    //             //         if(angle > -90 && angle < 90 )
    //             //             ctx.fillStyle = 'gray';
    //             //     }
    //             //     ctx.fillRect(x,y,1,1);
    //             // }
                
    //         }
    //     }
    // }

    start() {
        this.addGo(new CloudItem({
            position: this.sceneCenter.clone(),
            size: new V2(200,100)
        }));

        // this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: new V2(200,200),
        //     img: createCanvas(new V2(200, 200), (ctx, size) => {
        //         this.drawCircle(ctx, new V2(size.x/2,size.y/2), size.x/2 - 1, undefined  )
        //     })
        // }));
    }
}

class CloudItem extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            baseFillColorHSV: [0,0,100],
            baseStrokeColorHSV: [0,0,62],
            fillColor: '#FFFFFF',
            strokeColor: '#A0A0A0',
            lowerLinesCount: 3
        }, options)

        super(options);

    }

    fillColorProvider(x,y) {
        this.vChange.time = y - this.thresHold.y;
        let v = easing.process(this.vChange);
        v = fastFloorWithPrecision(v/5)*5;
        //console.log(y);
        return hsvToHex({hsv:[this.baseFillColorHSV[0], this.baseFillColorHSV[1], v]});
    }

    drawCircle(ctx, center, radius, goUp = false,isFirst = false, checkFrom, checkTo){
        let up = V2.up;

        //let xvChange = easing.createProps(this.size.y - this.thresHold.y*2, 100, 60, 'expo', 'in');

        if(checkFrom === undefined){
            checkFrom = getRandomInt(0, 90);
            if(goUp){
                checkFrom = getRandomInt(90, 150);
            }
        }

        let vChange = undefined;
        if(checkFrom > 0  && center.y < this.size.y*2/3) {//&& !(goUp && isFirst)){
            vChange = easing.createProps(checkFrom,62,90, 'quad', 'out');
        }

        if(checkTo === undefined) {
            checkTo = -45;
            if(!goUp){
                checkTo = -140
            }
        }
        
        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
            for(let x = center.x-radius-1;x < center.x+radius+1;x++){
                if(this.yClamp && (y < this.yClamp[0] || y > this.yClamp[1])){
                    if(y > this.yClamp[1]){
                        if(x < this.lowerXExtremums[0])
                            this.lowerXExtremums[0] = x;
                        if(x > this.lowerXExtremums[1])
                            this.lowerXExtremums[1] = x;
                    }
                    continue;
                }
                let _p = new V2(x,y);
                let distance = center.distance(_p);

                if(distance < radius){
                    ctx.fillStyle =  this.fillColorProvider(x,y)
                    // if(goUp){
                    //     if(x < center.x){

                    //     }
                    // }
                    // else {
                    //     ctx.fillStyle =  this.fillColorProvider(x,y) //this.fillColor;
                    // }

                    if( distance > radius-1.5 ){
                        let dir = center.direction(_p);
                        let angle = fastRoundWithPrecision(dir.angleTo(up));
                        if((isFunction(checkFrom) && checkFrom(angle)) || (angle < checkFrom  && angle > checkTo)){
                            ctx.fillStyle = this.strokeColor;
                            if(angle > 0 && vChange){
                                vChange.time = angle;
                                let v = easing.process(vChange);
                                ctx.fillStyle  = hsvToHex({hsv:[this.baseStrokeColorHSV[0], this.baseStrokeColorHSV[1], v]});
                            }
                            
                        }
                    }
                    ctx.fillRect(x,y,1,1);
                }
            }
        }
    }

    init(){

        

        this.rMax = 20;
        this.thresHold = new V2(this.rMax, this.rMax);

        this.vChange = easing.createProps(this.size.y - this.thresHold.y*2, 100, 60, 'expo', 'in');

        this.vertices = [
            new V2(this.thresHold.x, this.size.y-this.thresHold.y), 
            new V2(this.size.x/2 + getRandomInt(-this.size.x/4, this.size.x/4), this.thresHold.y),
            new V2(this.size.x - this.thresHold.x, this.size.y-this.thresHold.y)
        ]

        this.yClamp = [0, this.size.y-this.thresHold.y];
        this.lowerXExtremums = [Infinity,-Infinity];

        this.perimeterCircles = [];

        this.img = createCanvas(this.size, (ctx, size) => {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(0,0,size.x, size.y)
            ctx.fillStyle = this.fillColor;
            
            let pp = new PerfectPixel({context: ctx});
            pp.fillStyleProvider = (x,y) => {
                return this.fillColorProvider(x,y);
            }
            let filledPixels = [];
            for(let i = 0; i < this.vertices.length;i++){
                let p = this.vertices;
                if(i < p.length-1)
                    filledPixels= [...filledPixels, ...pp.lineV2(p[i], p[i+1])];
                else {
                    filledPixels = [...filledPixels, ...pp.lineV2(p[i], p[0])];
                    let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

                    pp.fill(uniquePoints, p)
                }        
            }

            
            for(let pi = 0; pi < this.vertices.length-1; pi++){
                let distance = this.vertices[pi].distance(this.vertices[pi+1]);
                let direction = this.vertices[pi].direction(this.vertices[pi+1]);
                let passedDistance = 0;
                let currentPoint = this.vertices[pi].clone();
                let isFirst = false;
                let goUp = direction.y < 0
                while(passedDistance < distance){
                    isFirst = false;
                    let step, radius;
                    if(passedDistance == 0){
                        step = getRandomInt(this.rMax/4, this.rMax/2);
                        radius = step*2;
                        isFirst = true;
                    }
                    else {
                        step = getRandomInt(this.rMax/2, this.rMax);
                        radius = getRandomInt(step/2, step);
                    }
                    
                    currentPoint = currentPoint.add(direction.mul(step)).toInt();

                    // if(passedDistance == 0){
                    //     radius = step;
                    // }
                    
                    passedDistance+=step;
                    if(passedDistance > distance){
                        if(goUp)
                            continue;
                        else {
                            //if(passedDistance - distance > radius/2)
                                currentPoint = this.vertices[pi+1].clone();
                                //radius = fastRoundWithPrecision( passedDistance - distance);
                        }
                    }
                    this.perimeterCircles.push({
                        position: currentPoint.clone(),
                        radius: radius
                    });
                    
                    //if(drawCircle)
                    let checkFrom = undefined;
                    if(goUp){
                        if(isFirst){
                            checkFrom = 180;
                        }
                    }
                    else {
                        if(isFirst){
                            checkFrom = 90;
                        }
                    }
                    this.drawCircle(ctx, currentPoint, radius, goUp, isFirst, checkFrom);
                }
            }
            
            for(let i = 0; i < this.lowerLinesCount; i++){
                ctx.fillStyle = this.fillColorProvider(0,this.size.y - this.thresHold.y)//this.fillColor;
                if(i == this.lowerLinesCount-1)
                    ctx.fillStyle = this.strokeColor;
                let len = this.lowerXExtremums[1] - this.lowerXExtremums[0] - i*2 - 3;
                ctx.fillRect(this.lowerXExtremums[0] + i + 3, this.yClamp[1]+i+1, len, 1);
                ctx.fillStyle = this.strokeColor;
                ctx.fillRect(this.lowerXExtremums[0] + i + 3, this.yClamp[1]+i+1, 1,1);
                ctx.fillRect(this.lowerXExtremums[0] + i + 3 + len - 1, this.yClamp[1]+i+1, 1,1);
            }

            // for(let i = 0; i < 5; i++){
            //     this.drawCircle(ctx, new V2(size.x/2, size.y/2).add(new V2(getRandomInt(-20, 20), getRandomInt(-20, 20))), getRandomInt(5,15), true, false);
            // }

            // for(let i = 0; i < 5; i++){
            //     this.drawCircle(ctx, new V2(size.x/2, size.y/2), getRandomInt(5,15), true, false, (angle) => { return angle < -90 || angle > 90 });
            // }
            
            
        })
    }
}