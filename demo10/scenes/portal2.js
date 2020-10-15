class Demo10Portal2Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
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
        let debrish_l1_index;
        let debrish_l2_index;
        
        let portal_index;
        let model = Demo10Portal2Scene.models.main;
        for(let i = 0; i < model.main.layers.length; i++){
            let layerIndex = (i)*10;
            if(model.main.layers[i].name == 'debrish_l1'){
                debrish_l1_index = layerIndex;
            }

            if(model.main.layers[i].name == 'debrish_l2'){
                debrish_l2_index = layerIndex;
            }

            if(model.main.layers[i].name == 'poral'){
                portal_index = layerIndex;
            }

            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    //
                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }

        this.flame1 = this.addGo(new GO({
            position: new V2(137,70),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames1),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5});
            }
        }), debrish_l1_index+1)

        this.flame2 = this.addGo(new GO({
            position: new V2(140,90),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames2),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5, startFrameIndex: 5});
            }
        }), debrish_l1_index+2)

        this.flame3 = this.addGo(new GO({
            position: new V2(80,110),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames3),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5, startFrameIndex: 7});
            }
        }), portal_index+1)

        this.flame4 = this.addGo(new GO({
            position: new V2(65,140),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames2),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5, startFrameIndex: 3});
            }
        }), debrish_l1_index+2)

        this.flame5 = this.addGo(new GO({
            position: new V2(95,135),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames4),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5, startFrameIndex: 0});
            }
        }), debrish_l1_index+1)

        this.flame5 = this.addGo(new GO({
            position: new V2(40,115),
            size: new V2(50,28),
            frames: PP.createImage(Demo10Portal2Scene.models.flameFrames4),
            init() {
                this.registerFramesDefaultTimer({originFrameChangeDelay: 5, startFrameIndex: 5});
            }
        }), portal_index+2)

        this.particlesEffects = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10Portal2Scene.models.main.main.layers.find(l => l.name == 'p1')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(Demo10Portal2Scene.models.main.main.layers.find(l => l.name == 'p2')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), debrish_l2_index+1)

        this.circle = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let radius = 30;
                let center = new V2(75,55)
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor('#B49573').circle(center, radius)
                })
                //
            }
        }), portal_index)


        this.exp1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFlameFrames({framesCount, itemsCount, itemFrameslengthClamps, size, xClamp}) {
                let color1 = "#FEE7BB";
                let color2 = "#FD9D84";
                let frames = [];
                let radiusClamps = [3, 8];
                let circle1Images = [];
                let circle2Images = [];
                let circle3Images = [];

                let sharedPP;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                new Array(radiusClamps[1] + 1).fill().forEach((el, i) => {
                    if(!isBetween(i, radiusClamps[0], radiusClamps[1]))
                        return;

                    circle1Images[i] = PP.createImage(PP.circles.filled[i], { colorsSubstitutions: { "#FF0000": { color: color1, changeFillColor: true } } });
                    circle2Images[i] = PP.createImage(PP.circles.filled[i], { colorsSubstitutions: { "#FF0000": { color: color2, changeFillColor: true } } });
                    circle3Images[i] = PP.createImage(PP.circles.filled[i]);
                })

                let startVectors = [
                    V2.up,
                    V2.upLeft,
                    V2.upRight,
                    V2.left,
                    V2.right,
                    V2.down,
                    V2.downLeft,
                    V2.downRight
                ]
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);

                    let targetCircleRadius = getRandomInt(radiusClamps[0], radiusClamps[1]);
                    
                    let initialPoint = new V2(getRandomInt(xClamp[0], xClamp[1]), size.y/2) 
                    let targetPoint// = initialPoint.add(new V2(getRandomInt(-10,10), -getRandomInt(10,50)))

                    if(radiusClamps[1] - targetCircleRadius < 3){
                        targetPoint = initialPoint.add(new V2(getRandomInt(-3,3), -getRandomInt(10,20)))
                    }
                    else {
                        targetPoint = initialPoint.add(new V2(getRandomInt(-7,7), -getRandomInt(20,40)))
                    }

                    let c2TargetShift = V2.down.rotate(getRandomInt(-45,45)).mul(targetCircleRadius*2).toInt();

                    let c3StartFrame = fast.r(totalFrames/getRandomInt(2,4));
                    let c3FramesLength = totalFrames - c3StartFrame;

                    let movementPoints = sharedPP.lineV2(initialPoint, targetPoint).map(p => new V2(p));
                    let c2ShiftMovementPoints = sharedPP.lineV2(c2TargetShift, new V2()).map(p => new V2(p)); 
                
                    let movementPointsIndexChange = easing.fast({ from: 0, to: movementPoints.length-1, steps: totalFrames, type: 'quad', method: 'inOut', round: 0 });
                    let c2ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: totalFrames, type: 'quad', method: 'out', round: 0 });
                    let c3ShiftMovementPointsIndexChange = easing.fast({ from: 0, to: c2ShiftMovementPoints.length-1, steps: c3FramesLength, type: 'sin', method: 'in', round: 0 });

                    let c2ShiftMovementPoints_2;
                    let c3ShiftMovementPointsIndexChange_2;
                    if(getRandomBool()){
                        c2ShiftMovementPoints_2 = sharedPP.lineV2(startVectors[getRandomInt(0, startVectors.length-1)].rotate(getRandomInt(-45,45)).mul(targetCircleRadius*2).toInt(), new V2()).map(p => new V2(p)); 
                        c3ShiftMovementPointsIndexChange_2 = easing.fast({ from: 0, to: c2ShiftMovementPoints_2.length-1, steps: c3FramesLength, type: 'sin', method: 'in', round: 0 });
                    }

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                        let c1p = movementPoints[movementPointsIndexChange[f]]//.substract(shiftToCenter).toInt();
                        
                        frames[frameIndex] = {
                            c1p,
                            c2p: c1p.add(c2ShiftMovementPoints[c2ShiftMovementPointsIndexChange[f]])//.substract(shiftToCenter).toInt(),
                        };

                        if(f > c3StartFrame){
                            frames[frameIndex].c3p = c1p.add(c2ShiftMovementPoints[c3ShiftMovementPointsIndexChange[f-c3StartFrame]]);

                            if(c2ShiftMovementPoints_2){
                                frames[frameIndex].c3p_2 = c1p.add(c2ShiftMovementPoints_2[c3ShiftMovementPointsIndexChange_2[f-c3StartFrame]]);
                            }
                        }
                    }
                
                    return {
                        targetCircleRadius,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                ctx.drawImage(createCanvas(size, (ctx, _size, hlp) => {
                                    let targetCircleRadius = itemData.targetCircleRadius;
                                    let { c1p, c2p, c3p, c3p_2 } = itemData.frames[f];

                                    ctx.drawImage(circle1Images[targetCircleRadius], c1p.x-targetCircleRadius, c1p.y-targetCircleRadius)

                                    ctx.globalCompositeOperation = 'source-atop';
                                    ctx.drawImage(circle2Images[targetCircleRadius], c2p.x-targetCircleRadius, c2p.y-targetCircleRadius);

                                    if(c3p){
                                        ctx.globalCompositeOperation = 'destination-out';
                                        ctx.drawImage(circle3Images[targetCircleRadius], c3p.x-targetCircleRadius, c3p.y-targetCircleRadius);

                                        if(c3p_2) {
                                            ctx.drawImage(circle3Images[targetCircleRadius], c3p_2.x-targetCircleRadius, c3p_2.y-targetCircleRadius);
                                        }
                                    }
                                }), 0,0);
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                return;
                this.frames = this.createFlameFrames({ framesCount: 100, itemsCount: 100, itemFrameslengthClamps: [50,60], size: this.size, xClamp: [50, 100] });
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