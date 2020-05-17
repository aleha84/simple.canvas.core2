class Demo10TrainScene extends Scene {
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

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    createRadialGradient({ size, center, radius, gradientOrigin, angle, setter }) {
        if(!size){
            size = this.viewport.clone();
        }

        if(!setter){
            throw 'Dot value setter is not provided';
        }

        let setDot = (x,y, setter) => {
            let row = dots[y];
            if(!row){
                dots[y] = [];
                row = dots[y];
            }

            if(!row[x]){
                row[x] = {};
            }

            setter(row[x]);
        }

        let isInEllipsis = (x,y) => {
            let _x = x-center.x;
            let _y = y-center.y;

            return Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq <= 1
        }

        let dots = [];
        let rxSq = radius.x*radius.x;
        let rySq = radius.y*radius.y;
        let maxSize = radius.x > radius.y ? new V2(radius.x, radius.x) : new V2(radius.y, radius.y);
        let _cos = Math.cos(angle);
        let _sin = Math.sin(angle);
        let ellipsisBox = new Box(center.substract(maxSize).toInt().add(new V2(-1,-1)), maxSize.mul(2).add(new V2(3,3)));

        if(!isInEllipsis(gradientOrigin.x, gradientOrigin.y))
            throw 'Gradient origin is not inside elipsis';

        let pp = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            pp = new PP({ctx});
        })

        for(let y = center.y-maxSize.y-1;y < center.y+maxSize.y+1;y++){
            dots[y] = [];
            for(let x = center.x-maxSize.x-1;x < center.x+maxSize.x+1;x++){
                if(!isInEllipsis(x,y)){
                    continue;
                }

                let currentDot = new V2(x,y);

                if(currentDot.equal(gradientOrigin)){
                    setDot(x,y, (dot) => setter(dot, 1))
                    continue;
                }

                let currentDirection = gradientOrigin.direction(currentDot);
                let point2 = rayBoxIntersection(currentDot, currentDirection, ellipsisBox);
                if(!point2 || point2.length == 0)
                    throw 'No box intersection found!';

                point2 = point2[0];
                let linePoints = pp.lineV2(gradientOrigin, point2);

                let stopIndex = 0;
                for(let i = 0; i < linePoints.length;i++){
                    let linePoint = linePoints[i];
                    let _x = linePoint.x-center.x;
                    let _y = linePoint.y-center.y;
                    stopIndex = i; // индекс первого элемента за границей эллипса
                    if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1)
                        break;

                }

                let aValues = easing.fast({from: 1, to: 0, steps: stopIndex, type:'quad', method:'out'});
                for(let i = 0; i < stopIndex;i++){
                    let linePoint = linePoints[i];

                    setDot(linePoint.x, linePoint.y, (dot) => { setter(dot, aValues[i]) } )
                }
            }
        }

        return dots;
    }

    start(){
        this.test2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                let setter = (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                    }

                    dot.values.push(aValue);
                }

                let dots = this.parentScene.createRadialGradient({size: this.size, center: new V2(100,100), radius: new V2(30,15), gradientOrigin: new V2(100,100), angle: 45, setter});

                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < dots.length; y++){
                        if(!dots[y])
                            continue;
                        
                        for(let x = 0; x < dots[y].length; x++){
                            if(!dots[y][x])
                                continue;

                            let values = dots[y][x].values;
                            let value = 0;
                            for(let i = 0; i < values.length;i++){
                                value+=values[i];
                            }
    
                            value/=values.length;
    
                            hlp.setFillColor(`rgba(255,255,255, ${fast.r(value,2)})`).dot(x, y);
                        }
                    }
                })
            }
        }), 1)


        this.test = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                return;

                //let filledDots = [];

                let gradientOrigin = new V2(96,100);
                
                //let testPoint = new V2(88,53);
                //let direction = origin.direction(testPoint);

                //todo: move it to parametrized method

                this.img = createCanvas(this.size, (ctx, size, hlp) => {

                    // let setDot = (x,y, setter) => {
                    //     let row = dots[y];
                    //     if(!row){
                    //         dots[y] = [];
                    //         row = dots[y];
                    //     }

                    //     if(!row[x]){
                    //         row[x] = {};
                    //         setter(row[x])
                    //     }
                    // }

                    // let setter = (dot, aValue) => {
                    //     dot.value =aValue;
                    // }

                    // let render = (x,y,dot) => {
                    //     hlp.setFillColor(`rgba(255,255,255, ${dot.value})`).dot(x, y);
                    // }

                    let render = (x,y,dot) => {
                        let values = dot.values;
                        let value = 0;
                        for(let i = 0; i < values.length;i++){
                            value+=values[i];
                        }

                        value/=values.length;

                        hlp.setFillColor(`rgba(255,255,255, ${fast.r(value,2)})`).dot(x, y);
                    }

                    let setDot = (x,y, setter) => {
                        let row = dots[y];
                        if(!row){
                            dots[y] = [];
                            row = dots[y];
                        }

                        if(!row[x]){
                            row[x] = {};
                            //setter(row[x])
                        }

                        setter(row[x]);
                    }

                    let setter = (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                        }

                        dot.values.push(aValue);
                    }

                    let angle = degreeToRadians(45);
                    let radius = new V2(50,25);
                    let center = size.divide(2).toInt();
                    
                    //.elipsisRotated(size.divide(2).toInt(), new V2(50,25), angle, filledDots);
                    let dots = [];
                    let rxSq = radius.x*radius.x;
                    let rySq = radius.y*radius.y;

                    let maxSize = radius.x > radius.y ? new V2(radius.x, radius.x) : new V2(radius.y, radius.y);
                    let _cos = Math.cos(angle);
                    let _sin = Math.sin(angle);

                    let ellipsisBox = new Box(center.substract(maxSize).toInt().add(new V2(-1,-1)), maxSize.mul(2).add(new V2(3,3)));

                    hlp.setFillColor('green').strokeRect(ellipsisBox.topLeft.x, ellipsisBox.topLeft.y, ellipsisBox.size.x, ellipsisBox.size.y);
                    hlp.setFillColor('red');

                    //debugger;

                    for(let y = center.y-maxSize.y-1;y < center.y+maxSize.y+1;y++){
                        dots[y] = [];
                        for(let x = center.x-maxSize.x-1;x < center.x+maxSize.x+1;x++){
                            let _x = x-center.x;
                            let _y = y-center.y;

                            if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1){
                                continue;
                                // hlp.dot(x,y);
                                // dots[y][x] = true;
                                // if(dots)
                                // dots.push({x,y})
                            }

                            //hlp.dot(x,y);

                            let currentDot = new V2(x,y);

                            if(currentDot.equal(gradientOrigin)){
                                //setDot(x, y, { value: 1 });
                                setDot(x,y, (dot) => setter(dot, 1))
                                continue;
                            }

                            let currentDirection = gradientOrigin.direction(currentDot);

                            let point2 = rayBoxIntersection(currentDot, currentDirection, ellipsisBox);

                            if(!point2 || point2.length == 0)
                                throw 'No box intersection found!';

                            point2 = point2[0];

                            let linePoints = [];
                            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                                linePoints = new PP({ctx}).lineV2(gradientOrigin, point2)
                            });

                            let stopIndex = 0;
                            for(let i = 0; i < linePoints.length;i++){
                                let linePoint = linePoints[i];
                                let _x = linePoint.x-center.x;
                                let _y = linePoint.y-center.y;
                                stopIndex = i; // индекс первого элемента за границей эллипса
                                if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1)
                                    break;

                            }

                            let aValues = easing.fast({from: 1, to: 0, steps: stopIndex, type:'quad', method:'out'});
                            for(let i = 0; i < stopIndex;i++){
                                let linePoint = linePoints[i];

                                //{ value: aValues[i] }
                                setDot(linePoint.x, linePoint.y, (dot) => { setter(dot, aValues[i]) } )
                            }
                        }
                    }

                    for(let y = 0; y < dots.length; y++){
                        if(!dots[y])
                            continue;
                        
                        for(let x = 0; x < dots[y].length; x++){
                            if(!dots[y][x])
                                continue;

                            render(x,y,dots[y][x]);
                            // let values = dots[y][x].values;
                            // let value = 0;
                            // for(let i = 0; i < values.length;i++){
                            //     value+=values[i];
                            // }

                            // value/=values.length;

                            // hlp.setFillColor(`rgba(255,255,255, ${value})`).dot(x, y);
                        }
                    }

                    
                    
                })

            }
        }), 1)
    }
}