class EveningStreetScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(2000,2000).divide(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'evening_street',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = EveningStreetScene.models.main;
        let layersData = {};
        let exclude = [
            'cloud_1', 'cloud_2', 'cloud_3', 'cloud_4', 'cloud_5', 'sky_p', 'car1', 'car2', 'car3', 'car4'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
            layersData[layerName] = {
                renderIndex
            }
            
            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }
            
            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName] }),
                init() {
            
                }
            }), renderIndex)
            
            console.log(`${layerName} - ${renderIndex}`)
        }

        this.clouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFrames({ totalFrames, layerName, xShift, delta = new V2() }) {
                let frames = [];
                let img = PP.createImage(model, { renderOnly: [layerName] });
                let xChange = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear', round: 0})
                let aValues = [
                    ...easing.fast({ from: 0, to: 1, steps: totalFrames/2, type: 'quad', method: 'out', round: 1}),
                    ...easing.fast({ from: 1, to: 0, steps: totalFrames/2, type: 'quad', method: 'in', round: 1})
                ]

                this.mainFr = [];
                for(let f = 0; f < totalFrames; f++){
                    this.mainFr[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = aValues[f];
                        ctx.drawImage(img, xChange[f], 0);
                    })
                }

                let startFrameIndex = totalFrames/2;
                for(let f = 0; f < totalFrames; f++){

                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (totalFrames-1)){
                        frameIndex-=totalFrames;
                    }

                    frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(this.mainFr[frameIndex], delta.x, delta.y);
                        ctx.drawImage(this.mainFr[f], delta.x, delta.y);
                    })
                }

                return frames;
            },
            init() {
                let totalFrames = 300
                var lData = [{
                    layerName: 'cloud_1',
                    totalFrames,
                    xShift: -5,
                    startFrameIndex: 0
                },{
                    layerName: 'cloud_2',
                    totalFrames,
                    xShift: -8,
                    startFrameIndex: 100
                },{
                    layerName: 'cloud_3',
                    totalFrames,
                    xShift: -3,
                    startFrameIndex: 200
                },{
                    layerName: 'cloud_4',
                    totalFrames,
                    xShift: -3,
                    startFrameIndex: 150,
                    delta: new V2(0, 4)
                },{
                    layerName: 'cloud_5',
                    totalFrames,
                    xShift: -3,
                    startFrameIndex: 50
                }]

                lData.map(ld => this.addChild(new GO({
                    position: new V2().add(ld.translate ? ld.translate : new V2()),
                    size: this.size,
                    frames: this.createFrames(ld),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: ld.startFrameIndex,
                            framesEndCallback: () => {
                                if(ld.startFrameIndex == 0) {
                                    // this.parent.parentScene.capturing.stop = true;
                                }
                                
                            }
                        });
                    }
                })))
            }
        }), layersData.cloud_1.renderIndex)  

        this.palmsAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let layeredAnimations = EveningStreetScene.models.layeredAnimations;

                let aniParams = [
                    { layerName: 'l1', startFrameIndex: 10, framesFromTo: [0, 3] },
                    { layerName: 'l2', startFrameIndex: 30 },
                    { layerName: 'l3', startFrameIndex: 50 },
                    { layerName: 'l4', startFrameIndex: 70 },
                    { layerName: 'l5', startFrameIndex: 90 },
                    { layerName: 'l6', startFrameIndex: 10 },
                    { layerName: 'l7', startFrameIndex: 30 },
                    { layerName: 'l8', startFrameIndex: 50 },
                    { layerName: 'l9', startFrameIndex: 70 },
                    { layerName: 'l10', startFrameIndex: 90 },
                    { layerName: 'l11', startFrameIndex: 70 },
                    { layerName: 'l12', startFrameIndex: 80 },
                    { layerName: 'l13', startFrameIndex: 10, framesFromTo: [0, 3] },
                    { layerName: 'l14', startFrameIndex: 30, framesFromTo: [0, 3] },
                    { layerName: 'l15', startFrameIndex: 50, framesFromTo: [0, 3] }
                ]

                let totalFrames = 150;
                let framesFromTo = [0, 4]
                let totalAnimationFrames = 140;
                let animationStartFrameClamps = [0, 100]

                aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(layeredAnimations, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)
                        let animationStartFrame = p.startFrameIndex ? p.startFrameIndex : getRandomInt(animationStartFrameClamps) // p.animationStartFrame + aniStart;

                        let from = framesFromTo[0];
                        let to = framesFromTo[1];

                        if(p.framesFromTo) {
                            from = p.framesFromTo[0];
                            to = p.framesFromTo[1];
                        }

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: from, to: to, steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0}), 
                                ...easing.fast({ from: to, to: from, steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }               

                        this.currentFrame = 0;
                        this.img = this.frames[framesIndexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                            this.img = this.frames[framesIndexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })
                    }
                })));

            }
        }), layersData.right_wall.renderIndex+1)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWiresFrames({framesCount, dotsData,xClamps, yClamps, size, invert = false, c1, c2}) {
                let frames = [];
                let xClamp = [0, 174] //35
                let _sharedPP;

                let halfFramesCount = fast.r(framesCount/2);
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    _sharedPP = new PP({ctx})
                })

                dotsData.forEach(dotData => {
                    if(dotData.dots.length == 1){
                        dotData.dots = new Array(framesCount).fill().map(_ => dotData.dots[0])
                    }
                    else {
                        let distance = dotData.dots[0].distance(dotData.dots[1]);
                        let direction = dotData.dots[0].direction(dotData.dots[1]);
                        let dValues = [
                            ...easing.fast({ from: 0, to: distance, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                            ...easing.fast({ from: distance, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut'}),
                        ]

                        dotData.dots = new Array(framesCount).fill().map((el, i) => dotData.dots[0].add(direction.mul(dValues[i])));
                    }
                });

                let framesData = [];
                 for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => {
                        if(invert) {
                            return {x: dd.dots[f].y, y: dd.dots[f].x}
                        }

                        return dd.dots[f]
                    });


                    let formula = mathUtils.getCubicSplineFormula(dots);
                    
                    if(invert) {
                        for(let _y = yClamps[0]; _y < yClamps[1]; _y++){
                            let _x=  fast.r(formula(_y));
                            framesData[f].dots.push({x:_x,y:_y});
                        }
                    }
                    else {
                        for(let x = xClamps[0]; x < xClamps[1]; x++){
                            let y=  fast.r(formula(x));
                            framesData[f].dots.push({x,y});
                        }
                    }
                    
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let prev = undefined;
                        for(let i = 0; i < framesData[f].dots.length; i++){
                            hlp.setFillColor(c1).dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                            if(c2) {
                                if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                                    hlp.setFillColor(c2)
                                        .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                        //.dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
                                        .dot(prev.x+1, prev.y)
                                }
                            }
                            

                            prev = framesData[f].dots[i];
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.wire1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [50, 151] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:150, 
                            dotsData: [
                                { dots: [new V2(50,57)] }, 
                                { dots: [new V2(113,41), new V2(113.5,41)] }, 
                                { dots: [new V2(151, 8)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: '#0b0b09' })

                        this.registerFramesDefaultTimer({});
                    }
                }))

            }
        }), layersData.right_wall.renderIndex+2 )

        this.sky_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'sky_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+1)


        this.cars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let carsData = [
                    {
                        layerName: 'car1',
                        yShift: -2,
                        startFrame: 100, 
                        movingFrames: 50,
                        xClamps:  [20, -15]
                    },
                    {
                        layerName: 'car1',
                        yShift: 5,
                        startFrame: 200, 
                        movingFrames: 60,
                        xClamps:  [-30, 20],
                        invert: true,
                    },
                    {
                        layerName: 'car2',
                        yShift: -2,
                        startFrame: 50, 
                        movingFrames: 30,
                        xClamps:  [-15, 20]
                    },
                    {
                        layerName: 'car3',
                        yShift: 1,
                        startFrame: 130, 
                        movingFrames: 30,
                        xClamps:  [20, -15]
                    },
                    {
                        layerName: 'car4',
                        yShift: 6,
                        startFrame: 0, 
                        movingFrames: 40,
                        xClamps:  [-15, 20]
                    },
                    {
                        layerName: 'car4',
                        yShift: -1,
                        invert: true,
                        startFrame: 200, 
                        movingFrames: 40,
                        xClamps:  [20, -30]
                    }
                ]

                let totalFrames = 300;

                this.cars = carsData.map(c => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let carImg = PP.createImage(model, { renderOnly: [c.layerName], forceVisivility: { [c.layerName]: { visible: true } } });
                        if(c.invert) {
                            carImg = createCanvas(this.size, (ctx, _size, hlp) => {
                                ctx.translate(_size.x, 0);
                                ctx.scale(-1,1);
                                ctx.drawImage(carImg, 0,0);
                            })
                        }

                        let xChange = easing.fast({ from: c.xClamps[0], to: c.xClamps[1], steps: c.movingFrames, type:'linear', round: 0});

                        this.frames = new Array(totalFrames);

                        for(let f = 0; f < c.movingFrames; f++) {
                            let frameIndex = f + c.startFrame;
                            if(frameIndex > (totalFrames-1)){
                                frameIndex-=totalFrames;
                            }

                            let x = xChange[f];
                            let y = c.yShift;
                            this.frames[frameIndex] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(carImg, x, y);
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), layersData.road.renderIndex+1)
    }
}