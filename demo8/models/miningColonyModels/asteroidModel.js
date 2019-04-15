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

        //top 
        for(let i = 1; i < steps.x-1; i++){
            let y = getRandomInt(0, this.stepSize.y-1);
            if(i == 1 || i == steps.x-2){
                y = getRandomInt(this.stepSize.y/2, this.stepSize.y-1)
            }
            cornerPoints.push(new V2(getRandomInt(this.stepSize.x*i,this.stepSize.x*(i+1)-1 ), y));
        }

        //right
        for(let i = 1; i < steps.y-1; i++){
            let x = this.size.x -1 - getRandomInt(0, this.stepSize.x-1)
            if(i == 1 || i == steps.y-2){
                x = this.size.x -1 - getRandomInt(this.stepSize.x/2, this.stepSize.x-1)
            }
            cornerPoints.push(new V2(x, getRandomInt(this.stepSize.y*i,this.stepSize.y*(i+1)-1 )));
        }

        //bottom 
        for(let i = steps.x-2; i > 0 ; i--){
            let y = this.size.y - 1 - getRandomInt(0, this.stepSize.y-1);
            if(i == 1 || i == steps.x-2){
                y = this.size.y - 1 - getRandomInt(this.stepSize.y/2, this.stepSize.y-1);
            }

            cornerPoints.push(new V2(getRandomInt(this.stepSize.x*i,this.stepSize.x*(i+1)-1 ), y));
        }

        //left
        for(let i = steps.y-2; i > 0; i--){
            let x = getRandomInt(0, this.stepSize.x-1)
            if(i == 1 || i == steps.y-2){
                x = getRandomInt(this.stepSize.x/2, this.stepSize.x-1)
            }
            cornerPoints.push(new V2(x, getRandomInt(this.stepSize.y*i,this.stepSize.y*(i+1)-1 )));
        }

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
