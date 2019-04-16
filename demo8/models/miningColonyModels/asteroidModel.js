class AsteroidModel extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(20, 20),
            stepSize: new V2(4,4),
            baseColor: '#7B5B9E',
            vDelta: -40,
            noise: {
                min: -5, 
                max: 5
            }
        }, options)

        super(options);
    }

    init() {
        this.center = new V2(this.size.x/2, this.size.y/2);
        let cornerPoints = [];
        let steps = new V2(
            fastRoundWithPrecision(this.size.x/this.stepSize.x),
            fastRoundWithPrecision(this.size.y/this.stepSize.y)
        );

        let a = this.size.x/2;
        let b = this.size.y/2;
        let xShift = this.size.x/2;
        let yShift = this.size.y/2;
        let proportionX = (this.size.x-1)/this.size.x
        let proportionY = (this.size.y-1)/this.size.y
        let shiftedCornerPoints = [];

        if(steps.x >= steps.y){ 
            let lowerCornerPoints = [];

            for(let i = 0; i <= steps.x;i++){
                let shiftedX = i*this.stepSize.x - xShift;
                let y = Math.sqrt((1 - (shiftedX*shiftedX)/(a*a) )* b*b);

                shiftedCornerPoints.push(new V2(shiftedX, y));
                if(y != 0)
                    lowerCornerPoints.push(new V2(shiftedX, -y));
            }
            shiftedCornerPoints = [...shiftedCornerPoints, ...lowerCornerPoints.reverse()];
            
        }
        else {
            let leftPoints = [];
            for(let i = 0; i <= steps.y;i++){
                let shiftedY = i*this.stepSize.y - yShift;
                let x = Math.sqrt((1 - (shiftedY*shiftedY)/(b*b) )* a*a);

                let rX = x;
                let rY = shiftedY;
                if(true) {
                    rX = x + getRandom(-this.stepSize.x/3, this.stepSize.x/3);
                    if(rX > a)
                        rX = a;
    
                    rY = shiftedY + getRandom(-this.stepSize.y/3, this.stepSize.y/3);
                    if(rY > b)
                        rY = b;
                }
                

                shiftedCornerPoints.push(new V2(rX, rY));
                if(x != 0){

                    let rX = -x;
                    let rY = shiftedY;
                    if(true) {
                        rX = -x + getRandom(-this.stepSize.x/3, this.stepSize.x/3);
                        if(rX < -a)
                            rX = -a;

                        rY = shiftedY + getRandom(-this.stepSize.y/3, this.stepSize.y/3);
                        if(rY > b)
                            rY = b;
                    }

                    leftPoints.push(new V2(rX, rY));
                }
                    
            }

            shiftedCornerPoints = [...shiftedCornerPoints, ...leftPoints.reverse()];
        }

        cornerPoints = shiftedCornerPoints.map(p => new V2(fastRoundWithPrecision( (p.x + xShift)*proportionX), fastRoundWithPrecision((p.y + yShift)*proportionY)))

        let that = this;
        this.cornerPoints = cornerPoints;
        this.img = createCanvas(this.size, (ctx, size) => {
            let pp = new PerfectPixel({ context: ctx, fillStyleProvider: that.lineStyleProvider.bind(this)  });
            let middlePoints = [];
            //ctx.fillStyle = colors.changeHSV({initialValue: that.baseColor, parameter: 'v', amount:that.vDelta});
            //cornerPoints = [new V2(10, 0), new V2(19, 10), new V2(10, 19), new V2(0, 10)]
            for(let i = 0; i < cornerPoints.length; i++){
                if(i < cornerPoints.length-1)
                    middlePoints = [...middlePoints, ...pp.lineV2(cornerPoints[i], cornerPoints[i+1])];
                else 
                    middlePoints = [...middlePoints, ...pp.lineV2(cornerPoints[i], cornerPoints[0])];
            }

            that.middlePoints = middlePoints;
            let uniquePoints = distinct(middlePoints, (p) => p.x+'_'+p.y);
            pp.fillStyleProvider =  that.fillStyleProvider.bind(this);
            pp.fill(uniquePoints, cornerPoints);


            if(steps.x < steps.y){ 
                pp.fillStyleProvider =  (x,y) => { 
                    let o = 0;  
                    if(getRandomBool())
                        o = getRandom(0.05,0.1);
                    return `rgba(0,0,0,${o})` 
                    //return 'red';
                }
    
                let center = new V2(size.x/2, size.y/2);
                for(let i = 0; i < cornerPoints.length;i++){
                    let c = cornerPoints[i];
                    let d = c.distance(center);

                    pp.lineV2(c, c.add(c.direction(new V2(center.x + getRandom(-steps.x/2, steps.x/2),  center.y + getRandom(-steps.y/2, steps.y/2))).mul(getRandom(d/4, d/2))))
                }
            }
            
            if(size.x >= 20 && size.y >= 20){
                for(let j = 0; j < 10; j++){
                    let initP = new V2(size.x/2 + getRandomInt(-6,6), size.y/2 + getRandomInt(-6,6));
                    ctx.fillStyle = `rgba(0,0,0,0.1)` 
                    for(let i = 0; i < getRandomInt(30,100); i++){
                        ctx.fillRect(initP.x + getRandomGaussian(-7,7), initP.y + getRandomGaussian(-7,7), 1, 1)
                    }
                }
                
            }
            
            //pp.fill(uniquePoints, cornerPoints);
        })
    }

    lineStyleProvider(x, y) {
        let noise = getRandomInt(this.noise.min, this.noise.max);
        let change = this.vDelta;
        change+=noise
        if(change <= 1 && change >= -1)
            return this.baseColor;

        return colors.changeHSV({initialValue: this.baseColor, parameter: 'v', amount:change});
    }

    fillStyleProvider(x, y) {
        let p = new V2(x,y);
        let dCenter = this.center.distance(p);
        let dBorder = Math.min.apply(null, (this.middlePoints.map((mp) => new V2(mp).distance(p))));
        let change = this.vDelta - easing.process({ time: dBorder, duration: dBorder+dCenter, change: this.vDelta, type: 'quad', method: 'out', startValue: 0 });
        if(change > -5)
            change = fastRoundWithPrecision(change);

        let noise = getRandomInt(this.noise.min, this.noise.max);
        change+=noise
        if(change <= 1 && change >= -1)
            return this.baseColor;

        return colors.changeHSV({initialValue: this.baseColor, parameter: 'v', amount:change});
    }
}
