class Demo10Portal2Scene extends Scene {
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
        this.exp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = [];
                let color1= "#FEE7BB";
                let totalFrames = 100;
                let targetCircleRadius = 8;
                let initialPoint = this.size.divide(2).toInt();
                let targetPoint = initialPoint.add(new V2(0, -30))
                let c2TargetShift = V2.down.rotate(20).mul(targetCircleRadius*2).toInt();

                let circle1 = PP.createImage(PP.circles.filled[targetCircleRadius], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } });
                let circle2 = PP.createImage(PP.circles.filled[targetCircleRadius], { colorsSubstitutions: { "#FF0000": { color: "#FD9D84", changeFillColor: true } } });
                let circle3 = PP.createImage(PP.circles.filled[targetCircleRadius]);

                let c3StartFrame = totalFrames/2;
                let c3FramesLength = totalFrames - c3StartFrame;

                let movementPoints = []
                let c2ShiftMovementPoints = []
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    movementPoints = pp.lineV2(initialPoint, targetPoint).map(p => new V2(p));
                    c2ShiftMovementPoints = pp.lineV2(c2TargetShift, new V2()).map(p => new V2(p));
                })

                let movementPointsIndexChange = easing.fast({ from: 0, to: movementPoints.length-1, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 });
                let c2ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: totalFrames, type: 'quad', method: 'out', round: 0 });
                let c3ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: c3FramesLength, type: 'sin', method: 'in', round: 0 });

                for(let f = 0; f < totalFrames;f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        let c1p = movementPoints[movementPointsIndexChange[f]]
                        ctx.drawImage(circle1, c1p.x-targetCircleRadius, c1p.y-targetCircleRadius)

                        let shiftToCenter = new V2(targetCircleRadius,targetCircleRadius);
                        let circle2Point = c1p.add(c2ShiftMovementPoints[c2ShiftMovementPointsIndexChange[f]]).substract(shiftToCenter).toInt();
                        
                        
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(circle2, circle2Point.x, circle2Point.y);
                        
                        if(f > c3StartFrame){
                            ctx.globalCompositeOperation = 'destination-out';
                            let circle3Point = c1p.add(c2ShiftMovementPoints[c3ShiftMovementPointsIndexChange[f-c3StartFrame]]).substract(shiftToCenter).toInt();
                            ctx.drawImage(circle3, circle3Point.x, circle3Point.y);
                        }
                        
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }),1)

        this.exp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                return;
                this.frames = [];
                let color1= "#FEE7BB";
                let circle1Radius = 8;
                let initialPoint = this.size.divide(2).toInt();

                let totalFrames1 = 50;
                let yChange = easing.fast({ from: initialPoint.y, to: initialPoint.y-20, steps: totalFrames1, type: 'linear', method: 'base', round: 0 });
                let circle1RadiusChange = easing.fast({ from: 0, to: circle1Radius, steps: totalFrames1, type: 'linear', method: 'base', round: 0 });

                let circle1Images = new Array(circle1Radius+1).fill().map((el, i) => {
                    if(i == 0)
                        return;
                    
                    return PP.createImage(PP.circles.filled[i], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } });
                })
                for(let f = 0; f < totalFrames1;f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        let circle1Radius = circle1RadiusChange[f];
                        if(circle1Radius > 0){
                            ctx.drawImage(circle1Images[circle1Radius], initialPoint.x-circle1Radius, yChange[f]-circle1Radius)
                        }
                        
                    })
                }

                let totalFrames2 = 25;

                let circle1p = initialPoint.add(new V2(0, -20))//this.size.divide(2).toInt();
                
                let circle2Radius = 8;
                let circle3Radius = 8;

                let circle1 = PP.createImage(PP.circles.filled[circle1Radius], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } });
                let circle2 = PP.createImage(PP.circles.filled[circle2Radius], { colorsSubstitutions: { "#FF0000": { color: "#FD9D84", changeFillColor: true } } });
                let circle3 = PP.createImage(PP.circles.filled[circle2Radius]);
                // let circle2Images = new Array(9).fill().map((el, i) => {
                //     if(i == 0)
                //         return;
                    
                //     return PP.createImage(PP.circles.filled[i], { colorsSubstitutions: { "#FF0000": { color: "#0000FF", changeFillColor: true } } });
                // })

                let c2PFrom = circle1p.add(V2.down.rotate(20).mul(circle1Radius*2));
                let circle2MovementPoints = [];
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    circle2MovementPoints = new PP({ctx}).lineV2(c2PFrom, circle1p).map(p => new V2(p));
                })

                let circle2MovementPointsIndexChange = easing.fast({ from: 0, to: circle2MovementPoints.length-1, steps: totalFrames2, type: 'quad', method: 'out', round: 0 });
                let circle3MovementPointsIndexChange = easing.fast({ from: 0, to: circle2MovementPoints.length-1, steps: totalFrames2, type: 'sin', method: 'in',  round: 0 });

                for(let f = 0; f < totalFrames2;f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(circle1, circle1p.x-circle1Radius, circle1p.y-circle1Radius)

                        let circle2Point = circle2MovementPoints[circle2MovementPointsIndexChange[f]].substract(new V2(circle2Radius,circle2Radius));
                        let circle3Point = circle2MovementPoints[circle3MovementPointsIndexChange[f]].substract(new V2(circle3Radius,circle3Radius));
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(circle2, circle2Point.x, circle2Point.y);
                        ctx.globalCompositeOperation = 'destination-out';
                        ctx.drawImage(circle3, circle3Point.x, circle3Point.y);
                    })
                }

                // let circle2RadiusChange = easing.fast({ from: 0, to: circle1Radius, steps: totalFrames, type: 'linear', round: 0 });
                // let circle2MovementPointsIndexChange = easing.fast({ from: 0, to: circle2MovementPoints.length-1, steps: totalFrames, type: 'linear', round: 0 });

                // for(let f = 0; f < totalFrames;f++){
                //     this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                //         ctx.drawImage(circle1, circle1p.x-circle1Radius, circle1p.y-circle1Radius)
                //         let circle2Radius = circle2RadiusChange[f];
                //         let circle2Point = circle2MovementPoints[circle2MovementPointsIndexChange[f]].substract(new V2(circle2Radius,circle2Radius));
                //         if(circle2Radius == 0){
                //             return;
                //         }
                //         else if(circle2Radius == 1){
                //             hlp.setFillColor("#0000FF").dot(circle2Point.x, circle2Point.y);
                //         }
                //         else {
                //             ctx.drawImage(circle2Images[circle2Radius], circle2Point.x, circle2Point.y)
                //         }
                        
                //     })
                // }

                this.registerFramesDefaultTimer({});
            }
        }), 1)
    }
}