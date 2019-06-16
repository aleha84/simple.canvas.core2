class CloudScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        //this.backgroundRenderDefault();
        SCG.contexts.background.drawImage(this.bgImage, 0,0, SCG.viewport.real.width, SCG.viewport.real.height)
    }

    

    start() {
        this.bgImage = createCanvas(this.viewport, (ctx, size) => {
            let startHSV = [200,50,90];
            let targetHSV = [160,17,89];

            let change = startHSV.map((s,i) => easing.createProps(this.viewport.y-1, s, targetHSV[i], 'cubic', 'in'));
            for(let y = 0; y < this.viewport.y;y++){
                ctx.fillStyle = hsvToHex({hsv: change.map((c,i) => { 
                    c.time = y; 
                    let res = easing.process(c); 
                    if(i == 0 || i == 1){
                        res = fastFloorWithPrecision(res/5)*5;
                    }

                    return res; })});
                ctx.fillRect(0,y,size.x, 1);
            }
        })


        let layersCount = 12;
        let sizeChange = {
            x: easing.createProps(layersCount-1, 200, 40, 'quad', 'out'),
            y: easing.createProps(layersCount-1, 100, 20, 'quad', 'out')
        }

        let positionChange = {
            y: easing.createProps(layersCount-1, 50, this.viewport.y-20, 'quad', 'out'),
        }

        let positionShiftChange = {
            x: easing.createProps(layersCount-1, 30, 8, 'quad', 'out'),
            y: easing.createProps(layersCount-1, 30, 5, 'quad', 'out')
        }

        let rChange = easing.createProps(layersCount-1, 20, 7, 'quad', 'out');
        let llcChange = easing.createProps(layersCount-1, 6, 1, 'quad', 'out');

        let hChange = easing.createProps(layersCount-1, 170, 152, 'quad', 'out');
        let vChange = easing.createProps(layersCount-1, 100, 95, 'quad', 'out');
        let xDeltaChange = easing.createProps(layersCount-1, -2, -0.5, 'quad', 'out');

        for(let i = 0; i < layersCount; i++){
            let count = (i+1)*4;
            sizeChange.x.time = i;
            sizeChange.y.time = i;
            positionShiftChange.x.time = i;
            positionShiftChange.y.time = i;
            positionChange.y.time = i;
            rChange.time = i;
            llcChange.time = i;
            hChange.time = i;
            vChange.time = i;
            xDeltaChange.time = i;

            let size = new V2(fastRoundWithPrecision(easing.process(sizeChange.x)),fastRoundWithPrecision(easing.process(sizeChange.y)))
            let y= fastRoundWithPrecision(easing.process(positionChange.y));
            let rMax = fastRoundWithPrecision(easing.process(rChange));
            let lowerLinesCount = fastRoundWithPrecision(easing.process(llcChange));
            let positionShift = new V2(fastRoundWithPrecision(easing.process(positionShiftChange.x)),fastRoundWithPrecision(easing.process(positionShiftChange.y)))
            let h = fastRoundWithPrecision(easing.process(hChange));
            let v = fastRoundWithPrecision(easing.process(vChange));
            let xDelta =easing.process(xDeltaChange)
            
            //console.log(h);
            for(let c = 0; c < count;c++){
                this.addGo(new CloudItem({
                    position: 
                    new V2(-this.viewport.x + (c+1)*3*this.viewport.x/count, y)
                        .add(new V2(getRandomInt(-positionShift.x, positionShift.x), getRandomInt(-positionShift.y, positionShift.y))),
                    size: size,//new V2(230,120),
                    baseFillColorHSV: [h,5,v],
                    baseStrokeColorHSV: [0,0, 62],
                    rMax,
                    lowerLinesCount,
                    xDelta,
                    xReset: this.viewport.x*2,
                    mixX: -this.viewport.x,
                    //animated: i <8
                }),100 - i);
            }
            
        }

        

    }
}

class CloudItem extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: false,
            baseFillColorHSV: [0,0,100],
            baseStrokeColorHSV: [0,0,62],
            fillColor: '#FFFFFF',
            strokeColor: '#A0A0A0',
            lowerLinesCount: 4,
            changeMax: 5,
            rMax: 20,
            animated: false,
            renderSquare: false,
            xDelta: 0,
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
            vChange = easing.createProps(checkFrom,this.baseStrokeColorHSV[2],this.baseStrokeColorHSV[2]+30, 'quad', 'out');
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
                            ctx.fillStyle = hsvToHex({hsv: this.baseStrokeColorHSV})//this.strokeColor;
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

    createImage() {
        return createCanvas(this.size, (ctx, size) => {
            if(this.renderSquare){
                ctx.strokeStyle = 'red';
                ctx.strokeRect(0,0,size.x, size.y)
            }
            
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

            for(let i = 0; i < this.perimeterCircles.length;i++){
                let p = this.perimeterCircles[i];
                this.drawCircle(ctx, p.position, p.radius, p.goUp, p.isFirst, p.checkFrom, p.checkTo);
            }
            
            for(let i = 0; i < this.lowerLinesCount; i++){
                ctx.fillStyle = this.fillColorProvider(0,this.size.y - this.thresHold.y)//this.fillColor;
                if(i == this.lowerLinesCount-1)
                    ctx.fillStyle = hsvToHex({hsv: this.baseStrokeColorHSV})//this.strokeColor;
                let len = this.lowerXExtremums[1] - this.lowerXExtremums[0] - i*2 - 3;
                ctx.fillRect(this.lowerXExtremums[0] + i + 3, this.yClamp[1]+i+1, len, 1);
                ctx.fillStyle = hsvToHex({hsv: this.baseStrokeColorHSV})//this.strokeColor;
                ctx.fillRect(this.lowerXExtremums[0] + i + 3, this.yClamp[1]+i+1, 1,1);
                ctx.fillRect(this.lowerXExtremums[0] + i + 3 + len - 1, this.yClamp[1]+i+1, 1,1);
            }
        })
    }

    init(){
        //this.rMax = 20;
        this.thresHold = new V2(this.rMax, this.rMax);

        this.vChange = easing.createProps(this.size.y - this.thresHold.y*2, this.baseFillColorHSV[2], this.baseFillColorHSV[2]-30, 'expo', 'in');

        this.vertices = [
            new V2(this.thresHold.x, this.size.y-this.thresHold.y), 
            new V2(this.size.x/2 + getRandomInt(-this.size.x/4, this.size.x/4), this.thresHold.y),
            new V2(this.size.x - this.thresHold.x, this.size.y-this.thresHold.y)
        ]

        this.yClamp = [0, this.size.y-this.thresHold.y];
        this.lowerXExtremums = [Infinity,-Infinity];

        this.perimeterCircles = [];

        for(let pi = 0; pi < this.vertices.length-1; pi++){
            let distance = this.vertices[pi].distance(this.vertices[pi+1]);
            let direction = this.vertices[pi].direction(this.vertices[pi+1]);
            let passedDistance = 0;
            let currentPoint = this.vertices[pi].clone();
            let isFirst = false;
            let isLast = false;
            let goUp = direction.y < 0;
            let count = -1;
            while(passedDistance < distance){
                count++;
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

                passedDistance+=step;
                if(passedDistance > distance){
                    if(goUp)
                        continue;
                    else {
                        isLast = true;
                        currentPoint = this.vertices[pi+1].clone();
                    }
                }
                
                
                let checkFrom = undefined;
                let checkTo = undefined;
                if(goUp){
                    if(isFirst){
                        checkFrom = 180;
                    }
                    if(count == 1){
                        checkFrom = 90;
                    }
                }
                else {
                    if(isFirst){
                        checkFrom = 90;
                    }
                }

                if(checkFrom === undefined){
                    checkFrom = getRandomInt(0, 90);
                    if(goUp){
                        checkFrom = getRandomInt(90, 150);
                    }
                }
        
                if(checkTo === undefined) {
                    checkTo = -45;
                    if(!goUp){
                        checkTo = -140
                    }
                }
                
                let change = {
                    x: easing.createProps(10, currentPoint.x, currentPoint.x + getRandomInt(-this.changeMax,this.changeMax), 'linear', 'base'),
                    y: easing.createProps(10, currentPoint.y, currentPoint.y + getRandomInt(-this.changeMax,this.changeMax), 'linear', 'base')
                }

                if(goUp && isFirst){
                    change = undefined;
                }
                else if(!goUp && isLast){
                    change = undefined;
                }

                this.perimeterCircles.push({
                    position: currentPoint.clone(),
                    radius: radius,
                    goUp,
                    isFirst,
                    checkFrom,
                    checkTo,
                    change: change
                });
            }
        }

        if(this.animated){
            this.images = [];
            for(let i = 0; i < 20; i++){
                this.perimeterCircles.forEach(p => {
                    let c = p.change;
    
                    if(p.change == undefined)
                        return;
    
                    p.position.x = fastRoundWithPrecision(easing.process(c.x));
                    p.position.y = fastRoundWithPrecision(easing.process(c.y));
    
                    c.x.time++;
                    c.y.time++;
    
                    if(c.x.time > c.x.duration){
                        c.x.change*=-1;
                        c.x.time = 0;
                        c.x.startValue = p.position.x;
    
                        c.y.change*=-1;
                        c.y.time = 0;
                        c.y.startValue = p.position.y;
                    }
                })
    
                this.images[i] = this.createImage();
            }
            //
    
            this.currentImageIndex = 0;
            
        }
        else {
            this.img = this.createImage();
        }
        
        this.frameChangeCounter = 0;
        this.timer = this.registerTimer(createTimer(30, () => {
            if(this.animated){
                this.frameChangeCounter++;
                if(this.frameChangeCounter%5 == 0){
                    this.img = this.images[this.currentImageIndex++]
                    if(this.currentImageIndex == this.images.length){
                        this.currentImageIndex = 0;
                    }
                }
                
            }

            if(this.xDelta != 0){
                this.position.x+=this.xDelta;
                if(this.position.x < this.mixX){
                    this.position.x = this.xReset;
                }

                this.needRecalcRenderProperties = true;
            }
            
        }, this, true));
        
    }
}