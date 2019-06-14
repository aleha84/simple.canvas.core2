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

    drawCircle(ctx, center, radius, yClamp){
        let rsq = radius*radius;
        let up = V2.up;
        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
            for(let x = center.x-radius-1;x < center.x+radius+1;x++){
                if(yClamp && (y < yClamp[0] || y > yClamp[1])){
                    continue;
                }
                let _p = new V2(x,y);
                let distance = center.distance(_p);
                if(distance < radius){
                    ctx.fillStyle = 'white';
                    if( distance > radius-2 ){
                        let dir = center.direction(_p);
                        let angle = fastRoundWithPrecision(dir.angleTo(up));
                        if(angle < -10 && angle > -90){
                            ctx.fillStyle = 'gray';
                        }
                    }
                    ctx.fillRect(x,y,1,1);
                }
                


                // let dx = x-center.x;
                // let dy = y-center.y;
                // let db = dx*dx + dy*dy;

                // if(db < rsq){
                //     ctx.fillStyle = 'white';
                //     let _p = new V2(x,y);
                //     if( fastRoundWithPrecision (center.distance(_p)) > radius-2 ){
                //         let dir = center.direction(_p);
                //         let angle = fastRoundWithPrecision(dir.angleTo(up));
                //         if(angle > -90 && angle < 90 )
                //             ctx.fillStyle = 'gray';
                //     }
                //     ctx.fillRect(x,y,1,1);
                // }
                
            }
        }
    }

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
            
        }, options)

        super(options);

    }

    drawCircle(ctx, center, radius, yClamp, goUp = false){
        let rsq = radius*radius;
        let up = V2.up;
        let checkFrom = getRandomInt(0, 90);
        if(goUp){
            checkFrom = getRandomInt(90, 180);
        }
        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
            for(let x = center.x-radius-1;x < center.x+radius+1;x++){
                if(yClamp && (y < yClamp[0] || y > yClamp[1])){
                    continue;
                }
                let _p = new V2(x,y);
                let distance = center.distance(_p);
                if(distance < radius){
                    ctx.fillStyle = 'white';
                    if( distance > radius-1.5 ){
                        let dir = center.direction(_p);
                        let angle = fastRoundWithPrecision(dir.angleTo(up));
                        if(angle < checkFrom  && angle > -90){
                            ctx.fillStyle = 'gray';
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
        this.vertices = [
            new V2(this.thresHold.x, this.size.y-this.thresHold.y), 
            new V2(this.size.x/2 + getRandomInt(-this.size.x/4, this.size.x/4), this.thresHold.y),
            new V2(this.size.x - this.thresHold.x, this.size.y-this.thresHold.y)
        ]

        this.perimeterCircles = [];

        this.img = createCanvas(this.size, (ctx, size) => {
            ctx.fillStyle = 'white';
            let yClamp = [0, this.size.y-this.thresHold.y];

            //this.drawCircle(ctx, new V2(size.x/2, size.y/2), 10)
            let pp = new PerfectPixel({context: ctx});
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
                while(passedDistance < distance){

                    let step, radius;
                    if(passedDistance == 0){
                        step = getRandomInt(this.rMax/4, this.rMax/2);
                        radius = step;
                    }
                    else {
                        step = getRandomInt(this.rMax/2, this.rMax);
                        radius = getRandomInt(step/2, step);
                    }
                    
                    currentPoint = currentPoint.add(direction.mul(step)).toInt();

                    if(passedDistance == 0){
                        radius = step;
                    }
                    
                    passedDistance+=step;
                    if(passedDistance > distance){
                        continue;
                    }
                    this.perimeterCircles.push({
                        position: currentPoint.clone(),
                        radius: radius
                    });
                    
                    this.drawCircle(ctx, currentPoint, radius, yClamp, direction.y < 0);
                }
            }
        })
    }
}