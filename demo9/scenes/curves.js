class CurvesScene extends Scene {
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

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                let start = new V2(200, 100);
                let end = new V2(100, 200);

                let direction = start.direction(end);
                let angle =  direction.angleTo(V2.right);

                let endRotated = end.substract(start).rotate(angle).add(start)

                let distance = start.distance(endRotated);
                let dv = start.direction(endRotated).mul(distance);

                let diff = new V2(Math.abs(dv.x), Math.abs(dv.y));
                let yDeviation = -60;
                let xDeviationLength = fast.r(diff.x /4);
                
                hlp.setFillColor('red');

                let yChange1 = easing.createProps(xDeviationLength, start.y, start.y+yDeviation, 'quad', 'out');
                let yChange2 = easing.createProps(diff.x - xDeviationLength, start.y+yDeviation, start.y, 'quad', 'in')
                for(let x = start.x; x <= endRotated.x; x++){
                    let yChangeIndex = x-start.x;
                    let yChange = yChange1;
                    if(yChangeIndex > xDeviationLength){
                        yChangeIndex = yChangeIndex - xDeviationLength;
                        yChange = yChange2;
                    }

                    yChange.time = yChangeIndex;
                    let y = fast.r(easing.process(yChange));

                    let dot = new V2(x,y).substract(start).rotate(-angle).add(start);

                    hlp.setFillColor('yellow').dot(x,y);
                    hlp.setFillColor('red').dot(dot.x, dot.y);
                }
                
                hlp.setFillColor('blue').rect(start.x-1, start.y-1,2,2).rect(end.x-1, end.y-1,2,2)
                hlp.setFillColor('green').rect(endRotated.x-1, endRotated.y-1,2,2)

                // let longestProps = diff.x > diff.y ? 'x' : 'y';
                // let midPoint = start.add(direction.mul(distance/2));

                // let deviationPoint = midPoint.add(direction.rotate(-90).mul(20));
            })
        }))
    }
}