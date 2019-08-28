class Exp1Scene extends Scene {
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

    getCubicSplineFunction(dots) {
        let functions = this.cubicSplineInterpolation(dots);
        return (x) => {
            for (var i = 0; i < functions.length; i++) {
                if (functions[i].range.xmin <= x && functions[i].range.xmax >= x) {
                    return functions[i].a * x * x * x + functions[i].b * x * x + functions[i].c * x + functions[i].d;
                }
            }
            return undefined;
        }
    }

    getPolinomFormula(dots) {
        let coefficients = this.polynomialInterpolation(dots);
        return (x)  => {
            let y = 0; 
            for (let i = 0; i < coefficients.length; i++) {
                let c = coefficients[i];
                y += c * Math.pow(x, coefficients.length - i - 1);
            }
            return y;
        }
    }

    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/polynomial-interpolation.js
    polynomialInterpolation(p) {
        let m = []; // matrix
        let numPoints = p.length; // number of points
    
        // fill matrix
        for (let row = 0; row < numPoints; row++) {
            m.push([]);
    
            // "<="" because of the solution column
            for (let col = 0; col <= numPoints; col++) {
                if (col < numPoints) { // coefficients
                    m[row][col] = Math.pow(p[row].x, numPoints - col - 1);
                }
                else { // solution
                    m[row][col] = p[row].y;
                }
            }
        }
    
        let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
        let coefficients = [];
        for (let i = 0; i < reducedRowEchelonForm.length; i++) {
            coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
        }
        return coefficients;
    }

    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/cubic-spline-interpolation.js
    cubicSplineInterpolation(p, boundary = '') {
        let row = 0;
        let solutionIndex = (p.length - 1) * 4;
    
        // initialize matrix
        let m = []; // rows
        for (let i = 0; i < (p.length - 1) * 4; i++) {
            // columns (rows + 1)
            m.push([]);
            for (let j = 0; j <= (p.length - 1) * 4; j++) {
                m[i].push(0); // fill with zeros
            }
        }
    
        // splines through p equations
        for (let functionNr = 0; functionNr < p.length-1; functionNr++, row++) {
            let p0 = p[functionNr], p1 = p[functionNr+1];
            m[row][functionNr*4+0] = Math.pow(p0.x, 3);
            m[row][functionNr*4+1] = Math.pow(p0.x, 2); 
            m[row][functionNr*4+2] = p0.x;
            m[row][functionNr*4+3] = 1; 
            m[row][solutionIndex] = p0.y;
    
            m[++row][functionNr*4+0] = Math.pow(p1.x, 3);
            m[row][functionNr*4+1] = Math.pow(p1.x, 2); 
            m[row][functionNr*4+2] = p1.x;
            m[row][functionNr*4+3] = 1; 
            m[row][solutionIndex] = p1.y;
        }
    
        // first derivative
        for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
            let p1 = p[functionNr+1];
            m[row][functionNr*4+0] = 3*Math.pow(p1.x, 2);
            m[row][functionNr*4+1] = 2*p1.x;
            m[row][functionNr*4+2] = 1;
            m[row][functionNr*4+4] = -3*Math.pow(p1.x, 2);
            m[row][functionNr*4+5] = -2*p1.x;
            m[row][functionNr*4+6] = -1;
        }
    
        // second derivative
        for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
            let p1 = p[functionNr+1];
            m[row][functionNr*4+0] = 6* p1.x;
            m[row][functionNr*4+1] = 2;
            m[row][functionNr*4+4] = -6*p1.x;
            m[row][functionNr*4+5] = -2;
        }
    
        // boundary conditions
        switch (boundary) {
            // case "quadratic": // first and last spline quadratic
            //     m[row++][0] = 1;
            //     m[row++][solutionIndex-4+0] = 1;
            //     break;
    
            // case "notaknot": // Not-a-knot spline
            //     m[row][0+0] = 1;
            //     m[row++][0+4] = -1;
            //     m[row][solutionIndex-8+0] = 1;
            //     m[row][solutionIndex-4+0] = -1;
            //     break;
    
            // case "periodic": // periodic function
            //     // first derivative of first and last point equal
            //     m[row][0] = 3* Math.pow(p[0].x, 2);
            //     m[row][1] = 2* p[0].x;
            //     m[row][2] = 1;
            //     m[row][solutionIndex-4+0] = -3* Math.pow(p[p.length-1].x, 2);
            //     m[row][solutionIndex-4+1] = -2* p[p.length-1].x;
            //     m[row++][solutionIndex-4+2] = -1;
    
            //     // second derivative of first and last point equal
            //     m[row][0] = 6* p[0].x;
            //     m[row][1] = 2;
            //     m[row][solutionIndex-4+0] = -6* p[p.length-1].x;
            //     m[row][solutionIndex-4+1] = -2;
            //     break;
    
            default: // natural spline
                m[row][0+0] = 6* p[0].x;
                m[row++][0+1] = 2;
                m[row][solutionIndex-4+0] = 6* p[p.length-1].x;
                m[row][solutionIndex-4+1] = 2;
                break;
        }
    
    
        let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
        let coefficients = [];
        for (let i = 0; i < reducedRowEchelonForm.length; i++) {
            coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
        }
    
        let functions = [];
        for (let i = 0; i < coefficients.length; i += 4) {
            functions.push({
                a: parseFloat(coefficients[i]),
                b: parseFloat(coefficients[i+1]),
                c: parseFloat(coefficients[i+2]),
                d: parseFloat(coefficients[i+3]),
                range: { xmin: parseFloat(p[i/4].x), xmax: parseFloat(p[i/4+1].x) }
            })
        }
        return functions;
    }

    //https://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
    reducedRowEchelonForm(mat) {
        let lead = 0;
        for (let r = 0; r < mat.length; r++) {
            if (mat[0].length <= lead) {
                return;
            }
            let i = r;
            while (mat[i][lead] == 0) {
                i++;
                if (mat.length == i) {
                    i = r;
                    lead++;
                    if (mat[0].length == lead) {
                        return;
                    }
                }
            }
     
            let tmp = mat[i];
            mat[i] = mat[r];
            mat[r] = tmp;
     
            let val = mat[r][lead];
            for (let j = 0; j < mat[0].length; j++) {
                mat[r][j] /= val;//math.divide(mat[r][j], val);
            }
     
            for (let i = 0; i < mat.length; i++) {
                if (i == r) continue;
                val = mat[i][lead]//math.bignumber(mat[i][lead]);
                for (let j = 0; j < mat[0].length; j++) {
                    mat[i][j] -=  val*mat[r][j]//  math.subtract(math.bignumber(mat[i][j]), math.multiply((val), math.bignumber(mat[r][j])));
                }
            }
            lead++;
        }
        return mat;
    }

    start() {
        //this.shift = new V2()
        //let dots = [new V2()]
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200, 200),
            showDots: true,
            showRect: true,
            segCount: 5,
            durations: {
                in: 20, 
                out: 70,
                waveColorChange: 50,
                
            },
            random: {
                changeClamps: [-2,2],
                durationClamps: [5, 10],
                alterDurationClamps: [60, 80]
            },
            init() {
                if(this.imgSize == undefined)
                    this.imgSize = this.size.clone();

                this.wetSandShift = 0;

                this.segCounts = [5]
                this.waves = [
                    {
                        waveColorChangeMul: 1,
                        segCounts: this.segCounts[0],
                        xShift: this.imgSize.x + 20,
                        dots: this.createDots(this.segCounts[0]),
                        renderDots: [],
                        alterPositions: 
                            new Array(5).fill().map((_, i) => this.createDots(this.segCounts[0])),
                        alterPositionsOut:  this.createDots(this.segCounts[0], true)
                    }
                ]

                //this.xShift =this.imgSize.x + 20;

                //this.initialDots = this.createDots();

                //this.dots = this.createDots();//this.initialDots.map(d => d.clone());
                // /this.dots.forEach(d => console.log(d.x + ' '+ d.y))

                //this.alterPositions = [this.createDots(),this.createDots(),this.createDots(),this.createDots(),this.createDots()];

                this.waves[0].changes = this.createDots(this.segCounts[0]).map((d, i) => (
                    this.createChange(
                        getRandomInt(this.random.durationClamps[0], this.random.durationClamps[1]), 
                        this.waves[0].dots[i], 
                        d
                    )
                ))

                // this.changes = this.createDots().map((d, i) => (
                //     this.createChange(getRandomInt(this.random.durationClamps[0], this.random.durationClamps[1]), 
                //     this.dots[i], 
                //     d)
                // ))

                
                this.delayTimer = this.registerTimer(createTimer(2000, () => {
                    this.unregTimer(this.delayTimer);
                    this.delayTimer = undefined;
                    
                    this.waves[0].xShiftChange = easing.createProps(this.durations.in, this.waves[0].xShift, 0, 'quad', 'out');
                    this.waves[0].xShiftChange.direction = - 1;
    
                    this.waves[0].additionalXChange = easing.createProps(this.durations.in*2, 0, -50, 'quad', 'out');
                    this.waves[0].additionalOpacityChange = easing.createProps(this.durations.in*3, 0.75, 0, 'quad', 'in');

                }, this, false));

                

                this.processPoints();
                this.createImage();

                this.counter = 10;
                this.timer = this.regTimerDefault(30, () => {
                    for(let wIndex = 0; wIndex < this.waves.length; wIndex++){
                        let wave = this.waves[wIndex];
                        if(wave.xShiftChange) {
                            wave.xShift = easing.process(wave.xShiftChange);
                            wave.xShiftChange.time++;
        
                            if(wave.xShiftChange.time > wave.xShiftChange.duration){
                                if(wave.xShiftChange.direction == 1){
                                    this.counter--;
                                    if(this.counter == 0){
                                        wave.xShiftChange = undefined;
                                        return;
                                    }
                                    wave.waveColorChangeMul = 1;
                                    //wave.dots =  this.createDots(getRandomInt(wave.segCounts-1, wave.segCounts));
                                    let sc = getRandomInt(this.segCounts[0]-1, this.segCounts[0]);
                                    this.waves[wIndex] = assignDeep({}, this.waves[wIndex], {
                                        segCounts: sc,
                                        xShift: this.imgSize.x + 20,
                                        dots: this.createDots(sc),
                                        renderDots: [],
                                        alterPositions: 
                                            new Array(5).fill().map((_, i) => this.createDots(sc)),
                                        alterPositionsOut:  this.createDots(sc, true)
                                    });
    
                                    wave = this.waves[wIndex];
    
                                    let ch = wave.alterPositions[getRandomInt(0, wave.alterPositions.length-1)];
                                    wave.changes = ch.map((next, i) => (
                                        this.createChange(
                                            getRandomInt(this.random.durationClamps[0], this.random.durationClamps[1]),
                                            wave.dots[i],
                                            next
                                        )
                                    ));
    
                                    wave.xShiftChange = easing.createProps(this.durations.in, wave.xShift, getRandomInt(-this.imgSize.x/3, 0), 'quad', 'out');
                                    wave.xShiftChange.direction = -1;
    
                                    wave.additionalXChange = easing.createProps(this.durations.in*2, 0, -50, 'quad', 'out');
                                    wave.additionalOpacityChange = easing.createProps(this.durations.in*3, 0.75, 0, 'quad', 'in');
                                }
                                else {
                                    
                                    wave.waveColorChangeMulChange = easing.createProps(this.durations.out, 1, 2, 'quad', 'out');
                                    wave.xShiftChange = easing.createProps(this.durations.out, wave.xShift, this.imgSize.x + 20, 'quad', 'in');
                                    wave.xShiftChange.direction = 1;
                                    this.createWetSand = wave;
                                }
                            }

                            for(let i = 0; i < wave.changes.length; i++){
                                let c = wave.changes[i];
                                let dot = wave.dots[i];
        
                                dot.x = fast.r(easing.process(c.x));
                                dot.y = fast.r(easing.process(c.y));
        
                                c.x.time++;
                                c.y.time++;
        
                                //this.pFormula = this.parentScene.getCubicSplineFunction(this.dots);
                                
        
                                if(c.x.time > c.x.duration){
                                    let d = wave.xShiftChange.direction == 1 ? this.random.alterDurationClamps : this.random.durationClamps;
                                    wave.changes[i] =  this.createChange(
                                        getRandomInt(d[0], d[1]), 
                                        dot, 
                                        wave.xShiftChange.direction == 1 
                                            ?   wave.alterPositionsOut[i].clone()
                                            :   wave.alterPositions[getRandomInt(0, wave.alterPositions.length-1)][i].clone()
                                    )
                                }
                            }
                        }
                        

                        if(wave.waveColorChangeMulChange){
                            wave.waveColorChangeMul = easing.process(wave.waveColorChangeMulChange);
                            wave.waveColorChangeMulChange.time++;
                        
                            if(wave.waveColorChangeMulChange.time > wave.waveColorChangeMulChange.duration){
                                wave.waveColorChangeMulChange = undefined;
                            }
                        }

                        if(wave.additionalXChange){
                            wave.additionalX = fast.r(easing.process(wave.additionalXChange));
                            wave.additionalXChange.time++;
                        
                            if(wave.additionalXChange.time > wave.additionalXChange.duration){
                                wave.additionalXChange = undefined;
                            }
                        }

                        if(wave.additionalXChange){
                            wave.additionalX = fast.r(easing.process(wave.additionalXChange));
                            wave.additionalXChange.time++;
                        
                            if(wave.additionalXChange.time > wave.additionalXChange.duration){
                                wave.additionalXChange = undefined;
                            }
                        }

                        if(wave.additionalOpacityChange){
         
                            wave.additionalOpacity = easing.process(wave.additionalOpacityChange);

               
                            wave.additionalOpacityChange.time++;
                            if(wave.additionalOpacityChange.time > wave.additionalOpacityChange.duration){
              
                                wave.additionalOpacityChange = undefined;
                            }
                        }
                        

                        if(this.wetSandShiftChange){
                            this.wetSandShift = fast.r(easing.process(this.wetSandShiftChange));
                            this.wetSandShiftChange.time++;
                            if(this.wetSandShiftChange.time > this.wetSandShiftChange.duration){
                                this.wetSandShiftChange = undefined;
                            }
                        }
    
                        
                    }

                    this.processPoints();
                    this.createImage();
                    
                })
            },
            processPoints() {
                for(let wIndex = 0; wIndex < this.waves.length; wIndex++){
                    let wave = this.waves[wIndex];
                    let pFormula = this.parentScene.getCubicSplineFunction(wave.dots);

                    wave.renderDots = [];
                    for(let x = 0; x < this.imgSize.x; x++){
                        let y = fast.r(pFormula(x));
                        //this.dots[y] = x;
                        let x1 = this.imgSize.x - y;
                        let y1 = x;
                        wave.renderDots[y1] = x1;
                    }
                }

                if(this.createWetSand){
                    if(this.wetSandStart &&  this.wetSandStart[this.wetSandStart.length-1] + this.wetSandShift 
                        < 
                        this.createWetSand.renderDots[this.createWetSand.renderDots.length-1] + this.createWetSand.xShift
                    ){
                        this.createWetSand = undefined;
                        return;
                    }
                    this.wetSandShift = 0;
                    this.wetSandStart = this.createWetSand.renderDots.map(d => (
                        this.createWetSand.xShift + d
                    ));

                    this.wetSandShiftChange = easing.createProps(this.durations.out*3, 0, this.imgSize.x+100, 'quad', 'in');

                    this.createWetSand = undefined;
                }
            },

            createDots(segCount = 5, goBack = false) {
                //let segCount = this.segCount;
                let gapWidth = fast.f(this.imgSize.x/10)+1;
                let segWidth = fast.f((this.imgSize.x - gapWidth*(segCount-1))  / segCount)+1;
                let segHeight = fast.f(this.imgSize.y / segCount)+1;

                let dots = [];
                let rc = this.random.changeClamps;
                for(let segIndex = 0; segIndex < segCount; segIndex++){
                    let xFrom = segIndex*(segWidth+gapWidth);
                    let xTo = xFrom + segWidth;
                    let yFrom = segIndex*segHeight;
                    let yTo = yFrom + segHeight;

                    if(!goBack){
                        dots[segIndex*3] = new V2(xFrom + getRandomInt(rc[0], rc[1]), yFrom+ getRandomInt(rc[0], rc[1]));
                    }
                    else {
                        dots[segIndex*3] = new V2(xFrom + getRandomInt(rc[0], rc[1]), yFrom+ segHeight/2);
                    }
                    dots[segIndex*3+1] = new V2(fast.r(xFrom + 2*segWidth/3)+ getRandomInt(rc[0], rc[1]), yTo+ getRandomInt(rc[0], rc[1]));
                    if(!goBack){
                        dots[segIndex*3+2] = new V2(xTo+ getRandomInt(rc[0], rc[1]), yFrom + segHeight*2/3 + getRandomInt(rc[0], rc[1]));
                    }
                    else {
                        dots[segIndex*3+2] = new V2(xTo+ getRandomInt(rc[0], rc[1]), yTo);
                    }
                }

                return dots;
            },

            createChange(duration, current, next){
                return {
                    x: easing.createProps(duration, current.x, next.x, 'quad', 'inOut'),
                    y: easing.createProps(duration, current.y, next.y, 'quad', 'inOut')
                };
            },
            createImage() {
                this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
                    if(this.showRect){
                        hlp.setFillColor('green').strokeRect(0,0,size.x, size.y);
                    }

                    if(!this.sandImg){
                        this.sandImg = createCanvas(size, (ctx, size, hlp) => {
                            let hsvStart = [37,40,74];
                            let hsvEnd = [44,17,76];

                            let duration = fast.r(size.x*1.5);
                            let hChange = easing.createProps(duration, hsvStart[0], hsvEnd[0], 'quad', 'in')
                            let sChange = easing.createProps(duration, hsvStart[1], hsvEnd[1], 'quad', 'in')
                            
                            let pp = new PerfectPixel({context: ctx});
                            let shift = fast.r(size.x*1.2);
                            for(let x = 0;x < shift*2; x++){
                                let t = x;
                                if(t > duration) t=duration;

                                hChange.time = t;
                                sChange.time = t;

                                let h = easing.process(hChange);
                                let s = easing.process(sChange);

                                h = fast.f(h/3)*3
                                s = fast.f(s/4)*3
                                hlp.setFillColor(hsvToHex({
                                    hsv: [
                                        h,
                                        s,
                                        hsvStart[2]
                                    ]
                                }));

                                pp.line(x,0,x -shift, size.y-1);
                            }
                        })
                    }

                    ctx.drawImage(this.sandImg, 0, 0);

                    if(!this.waveColorChangeImg) {
                        this.waveColorChangeImg = createCanvas(new V2(this.durations.waveColorChange, 1), (ctx, size, hlp) => {
                            let colorChange = {
                                h: 191,
                                s: easing.createProps(this.durations.waveColorChange, 5, 27, 'quad', 'in'),
                                v
                                : easing.createProps(this.durations.waveColorChange, 95, 69, 'quad', 'in')
                            }

                            for(let x = 0; x < this.durations.waveColorChange; x++){
                                let t = x;
                                if(t > this.durations.waveColorChange) t=this.durations.waveColorChange;

                                colorChange.s.time = t;
                                colorChange.v.time = t;

                                let s = easing.process(colorChange.s);
                                let v = easing.process(colorChange.v);
                                s = fast.f(s/4)*4
                                v = fast.f(v/5)*5

                                hlp.setFillColor(hsvToHex({
                                    hsv: [
                                        colorChange.h,
                                        s,
                                        v
                                    ]
                                })).dot(x, 0);
                            }
                        })
                    }
                    

                    for(let wIndex = 0; wIndex < this.waves.length; wIndex++){
                        let wave = this.waves[wIndex];
                        // if(!wave.ccWidth){
                        //     wave.ccWidth = [];
                        //     for(let y = 0; y < size.y; y++){
                        //         wave.ccWidth[y] = getRandomInt(this.durations.waveColorChange, this.durations.waveColorChange + 5);
                        //     }
                        // }
                        //hlp.setFillColor('#80A8B1');
                        for(let y = 0; y < size.y; y++){
                            if(this.wetSandStart){
                                 hlp.setFillColor('rgba(0,0,0,0.05)').rect(this.wetSandStart[y] + this.wetSandShift, y, size.x - this.wetSandStart[y], 1)
                            }
                            let xStart = fast.r(wave.xShift + wave.renderDots[y]);

                            //let ccWidth = wave.ccWidth[y];
                            ctx.drawImage(this.waveColorChangeImg, xStart, y, fast.r(this.durations.waveColorChange*wave.waveColorChangeMul), 1);

                            hlp.setFillColor('#80A7AF').rect(xStart + fast.r(this.durations.waveColorChange*wave.waveColorChangeMul) , y, size.x - xStart + this.durations.waveColorChange, 1);
                            //if(wave.xShiftChange.direction == -1){
                                ctx.globalAlpha = wave.additionalOpacity;
                                ctx.drawImage(this.waveColorChangeImg, xStart+100 + wave.additionalX, y, this.durations.waveColorChange/4, 1);
                                ctx.drawImage(this.waveColorChangeImg, xStart+150 + wave.additionalX, y, this.durations.waveColorChange/2, 1);
                                ctx.drawImage(this.waveColorChangeImg, xStart+200 + wave.additionalX, y, this.durations.waveColorChange/1, 1);
                                ctx.globalAlpha  = 1;
                            //}
                            
                        }

                        // if(!this.additionalImage){
                        //     this.additionalImage = createCanvas(size, (ctx, size, hlp) => {
                        //         let dots = new Array(6).fill().map((_,i) => new V2(50 + i*100/5, getRandomInt(85, 115) + i*15))
                        //         let pFormula = this.parentScene.getCubicSplineFunction(dots);
                        //         for(let x = 50; x <150;x++){
                        //             let y = fast.r(pFormula(x));
                        //             let x1 = this.imgSize.x - y;
                        //             let y1 = x;
                        //             wave.renderDots[y1] = x1;
                        //             hlp.setFillColor('white').dot(x1,y1);
                        //         }
                        //     })
                        // }

                        // ctx.drawImage(this.additionalImage, 0,0);
                    }
                })
            }
        }))
    }
}