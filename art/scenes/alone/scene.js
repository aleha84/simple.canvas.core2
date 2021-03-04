class AloneHouseScene extends Scene {
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
        let model = AloneHouseScene.models.main;
        let layersData = {};
        let exclude = [
            'forest_p'
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

        this.smoke = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(1,-15)),
            size: new V2(70,39),
            //frames: PP.createImage(AloneHouseScene.models.smokeFrames2),
            init() {
                let model = AloneHouseScene.models.smokeFrames2;
                // model.main.forEach(frame => {
                //     frame.layers[0].groups[1].visible = false;
                //     frame.layers[0].groups[2].strokeColor = frame.layers[0].groups[0].strokeColor;
                // });

                this.frames =  PP.createImage(model, {
                    positionModifier: (x, y) => {
                        let res = {x,y};
                        if(y < 13) {
                            res.x -=4;
                        }
                        else if(y < 26){
                            res.x -=2
                        }
                        else if(y < 33){
                            res.x -= 1 
                        }

                        return res;

                    }
                })

                this.registerFramesDefaultTimer({originFrameChangeDelay: 8, debug: false});

            }
        }), layersData['small_h'].renderIndex + 1)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 480, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'forest_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData['forest'].renderIndex + 1)

        this.fog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createFogFrames({framesCount, itemsCount, itemFrameslength, size, xShiftClamps}) {
                let frames = [];
                
                // let foglayer = Demo10FaceScene.models.main.main.layers.find(l => l.name == 'fog_borders');
                // foglayer.visible = true;
                // let mask = PP.createImage(Demo10FaceScene.models.main, { renderOnly: ['fog_borders'] });
                let overlay = createCanvas(size, (ctx, size, hlp) => {
                    hlp.setFillColor('rgba(255,255,255, 0.05)').rect(0,0,size.x, size.y);
                })

                let brightCircleSizes = [
                    // PP.createImage(PP.circles.filled[1]),
                    // PP.createImage(PP.circles.filled[2]),
                    PP.createImage(PP.circles.filled[5]),
                    PP.createImage(PP.circles.filled[6]),
                    PP.createImage(PP.circles.filled[7]),
                    PP.createImage(PP.circles.filled[8])
                ];

                let sizeValues = easing.fast({from: brightCircleSizes.length-1, to: 0, steps: itemFrameslength, type: 'linear', round: 0});

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let y = 90//getRandomInt(75,95);
                    let x = getRandomInt(-5,size.x+20);
                    // if(getRandomBool()) {
                    //     y= getRandomInt(110, 115);
                    //     x = getRandomInt(170,190);
                    // }

                    let maxY = getRandomInt(70,72) + 5;
                    // if(getRandomInt(0,4) == 0)
                    //     maxY = 68

                    let yValues = [
                        ...easing.fast({from: y, to: maxY, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: maxY, to: y, steps: fast.r(itemFrameslength/2), type: 'quad', method: 'inOut', round: 0})
                    ]
                    let xShiftValues = easing.fast({from: 0, to: getRandomInt(xShiftClamps[0], xShiftClamps[1]), steps: itemFrameslength, type: 'linear', round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            size: sizeValues[f],
                            y: yValues[f],
                            xShift: xShiftValues[f]
                        };
                    }
                
                    return {
                        y,x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {

                        // ctx.drawImage(mask, 0,0);
                        // ctx.globalCompositeOperation = 'source-in';

                        let _midImg = createCanvas(size, (ctx, _size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(brightCircleSizes[itemData.frames[f].size], itemData.frames[f].xShift + itemData.x, itemData.frames[f].y)
                                }
                                
                            }
                        })

                        ctx.drawImage(_midImg,0,0);
                        ctx.globalCompositeOperation = 'source-in';
                        ctx.drawImage(overlay,0,0);
                    });
                }
                
                return frames;
            },
            init() {
                this.f1 = this.addChild(new Go({
                    position: new V2(0,-5),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createFogFrames({xShiftClamps: [-5,-10], framesCount:480, itemsCount: 500, itemFrameslength: 480, size: this.size})
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.f2 = this.addChild(new Go({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createFogFrames({xShiftClamps:[-10,-15] , framesCount:480, itemsCount: 500, itemFrameslength: 480, size: this.size})
                        this.registerFramesDefaultTimer({});
                    }
                }))

                // this.f3 = this.addChild(new Go({
                //     position: new V2(0, +5),
                //     size: this.size,
                //     init() {
                //         this.frames = this.parent.createFogFrames({xShiftClamps:[-15,-20] , framesCount:480, itemsCount: 500, itemFrameslength: 480, size: this.size})
                //         this.registerFramesDefaultTimer({});
                //     }
                // }))
                
            }
        }), layersData['bg'].renderIndex + 1)

        this.wires = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWiresFrames({framesCount, dotsData,xClamps, size}) {
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
                        // dotData.dots = [
                        //     ...md,
                        //     ...md.reverse()
                        // ]
                        /*let midDots = _sharedPP.lineV2(dotData.dots[0], dotData.dots[1]);
                        let indexValues = [
                            ...easing.fast({from: 0, to: midDots.length-1, steps: halfFramesCount, type: 'quad', method: 'inOut', round: 0 }),
                            ...easing.fast({from: midDots.length-1, to: 0, steps: halfFramesCount, type: 'quad', method: 'inOut', round: 0 })
                        ];

                        dotData.dots = new Array(framesCount).fill().map((el, i) => midDots[indexValues[i]])*/
                    }
                });

                let framesData = [];
                 for(let f = 0; f < framesCount; f++){
                    framesData[f] = {dots: []};
                    let dots = dotsData.map(dd => dd.dots[f]);
                    let formula = mathUtils.getCubicSplineFormula(dots);
                    for(let x = xClamps[0]; x < xClamps[1]; x++){
                        let y=  fast.r(formula(x));
                        framesData[f].dots.push({x,y});
                    }
                }
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let prev = undefined;
                        for(let i = 0; i < framesData[f].dots.length; i++){
                            hlp.setFillColor('rgba(36,31,21,1)').dot(framesData[f].dots[i].x, framesData[f].dots[i].y);

                            if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                                hlp.setFillColor('rgba(36,31,21,0.5)')
                                    .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                    .dot(framesData[f].dots[i].x, framesData[f].dots[i].y+1);
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
                        let xClamps = [0, 200] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:480, 
                            dotsData: [
                                { dots: [new V2(0, 138), new V2(0, 138.5)] }, 
                                { dots: [new V2(48, 135), new V2(48, 135.25)] }, 
                                { dots: [new V2(74, 132)] }
                            ],
                            xClamps, size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                

                // this.wire2 = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let xClamps = [0, 186] //35

                //         this.frames = this.parent.createWiresFrames({ framesCount:300, 
                //             dotsData: [
                //                 { dots: [new V2(0, 91+11), new V2(0, 88+11)] }, 
                //                 { dots: [new V2(50+5, 86+11), new V2(50+5, 84+11)] }, 
                //                 { dots: [new V2(129+5, 60+11), new V2(129+5, 59+11)] }, 
                //                 { dots: [new V2(186,45)] }
                //                 // { dots: [new V2(0, 99), new V2(0, 96)] }, 
                //                 // { dots: [new V2(64, 91), new V2(64, 89)] }, 
                //                 // { dots: [new V2(135, 71), new V2(135, 70)] }, 
                //                 // { dots: [new V2(186,45)] }
                //             ],
                //             xClamps, size: this.size })

                //         this.registerFramesDefaultTimer({startFrameIndex: 50});
                //     }
                // }))
            }
        }), layersData.close_snow.renderIndex+2 )
    }
}