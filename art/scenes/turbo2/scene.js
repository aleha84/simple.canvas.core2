class Turbo2Scene extends Scene {
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

        let model = Turbo2Scene.models.main;
        let layersData = {};
        let exclude = [
            'tree_p', 'island_p', 'island_p2'
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

        //sky

        //ocean
        this.seaAnimtions = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSeaFrames({framesCount, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let yClamps = [99,119];
                let aClapms = [0.05, 0.2]
                let xShiftClamps = [0,6]
                let height = yClamps[1] - yClamps[0];
                let aValuesByY = easing.fast({ from: aClapms[0], to: aClapms[1], steps: height, type: 'linear', round: 2});
                let xShiftValuesByY = easing.fast({ from: xShiftClamps[0], to: xShiftClamps[1], steps: height, type: 'quad', method: 'in'})
                let isDarkAngleByY = easing.fast({ from: 90, to: 80, steps: height, type: 'linear', round: 0});
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;
                
                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(yClamps);

                    let maxA = aValuesByY[y - yClamps[0]]
                    let xShift = xShiftValuesByY[y - yClamps[0]];
                    let isDark = getRandomInt(0,5) == 0;
                    if(isDark) {
                        isDark = {
                            len: fast.r(xShift*2),
                            angle: isDarkAngleByY[y - yClamps[0]]
                        }
                        totalFrames*=2;
                        maxA*=0.5;
                    }

                    if(getRandomInt(0,9) == 0) {
                        maxA*= getRandomInt(2,3);
                        isDark = false;
                        totalFrames = getRandomInt(20, 40);
                        xShift = 0;
                    }

                    let aValues = [
                        ...easing.fast({from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                        ...easing.fast({from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                    ]

                    let xShiftValues = easing.fast({ from: 0, to: xShift, steps: totalFrames, type: 'linear' });

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            xShift: xShiftValues[f],
                            a: aValues[f],
                        };
                    }
                
                    return {
                        x,y,
                        isDark,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ctx});

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){

                                if(itemData.isDark) {
                                    pp.setFillStyle(`rgba(0,0,0, ${itemData.frames[f].a})`)
                                    let p1 = new V2(itemData.x + itemData.frames[f].xShift, itemData.y);
                                    if(!p1.x)
                                        continue;

                                    let p2 = p1.add(V2.up.rotate(itemData.isDark.angle).mul(itemData.isDark.len)).toInt()
                                    pp.lineV2(p1,p2)
                                }
                                else {
                                    hlp.setFillColor(
                                        itemData.isDark 
                                            ? `rgba(0,0,0, ${itemData.frames[f].a})`
                                            : `rgba(255,255,255, ${itemData.frames[f].a})`
                                    ).dot(itemData.x + itemData.frames[f].xShift, itemData.y)
                                }

                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createSeaFrames({ framesCount: 300, itemsCount: 4000, itemFrameslength: 100, size: this.size })

                this.registerFramesDefaultTimer({});
            }
        }), layersData.sea.renderIndex+1)

        //island

        this.islandAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.island_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 100, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'island_p')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.island_p2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 200, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'island_p2')) });

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.island.renderIndex + 1)

        //tree
        this.teeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let totalAnimationFrames = 250;
                let oneFrame = 50;

                let aniParams = [
                    {
                        layerName: 'l1', animationStartFrame: 0,
                    },
                    {
                        layerName: 'l2', animationStartFrame: 10,
                    },
                    {
                        layerName: 'l3', animationStartFrame: 15,
                    },
                    {
                        layerName: 'l4', animationStartFrame: 20,
                    },
                    {
                        layerName: 'l5', animationStartFrame: 30,
                    },
                    {
                        layerName: 'l6', animationStartFrame: 35,
                    },
                    {
                        layerName: 'l7', animationStartFrame: 40,
                    },
                    {
                        layerName: 'l8', animationStartFrame: 40,
                    },
                    { layerName: 'l9', animationStartFrame: 45 },
                    { layerName: 'l10', animationStartFrame: 50 },
                    { layerName: 'l11', animationStartFrame: 60 },
                    { layerName: 'l12', animationStartFrame: 65 },
                    { layerName: 'l13', animationStartFrame: 20 },
                    { layerName: 'l14', animationStartFrame: 30 },
                    { layerName: 'l15', animationStartFrame: 35 },
                    { layerName: 'l16', animationStartFrame: 40},
                    { layerName: 'l17', animationStartFrame: 55},
                    { layerName: 'l18', animationStartFrame: 65},
                    { layerName: 'l19', animationStartFrame: 60},
                    { layerName: 'l20', animationStartFrame: 55},
                    { layerName: 'l21', animationStartFrame: 40},
                    { layerName: 'l22', animationStartFrame: 35},
                    { layerName: 'l23', animationStartFrame: 25},
                    { layerName: 'l24', animationStartFrame: 10},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(Turbo2Scene.models.treeAnimation, { renderOnly: [p.layerName] }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        //let oneFrameShift = oneFrame + getRandomInt(0,5);

                        // let v = 0;
                        // for(let i = 0; i < totalFrames; i++){
                        //     // if(i%oneFrameShift == 0){
                        //     //     v = v==0? 1: 0;
                        //     // }

                        //     let index = p.animationStartFrame+i;
                        //     if(index > (totalFrames-1)){
                        //         index-=totalFrames;
                        //     }

                        //     framesIndexValues[index] = v;
                        // }

                        let animationStartFrame = p.animationStartFrame;

                        //animationStartFrame = getRandomInt(0, totalFrames-1);

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
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
        }), layersData.tree.renderIndex+1)

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementRotFrames({ framesCount: 300, itemFrameslength: 150, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'tree_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.tree.renderIndex+2)

        //bushes

        //stolb
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

                            // if(invert) {
                            //     if(prev != undefined && prev.x != framesData[f].dots[i].x) {
                            //         hlp.setFillColor(c2)
                            //             .dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1)
                            //             .dot(framesData[f].dots[i].x+1, framesData[f].dots[i].y);
                            //     }
                            // }
                            // else {
                            //     if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                            //         hlp.setFillColor(c2)
                            //             .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                            //             .dot(framesData[f].dots[i].x, framesData[f].dots[i].y+1);
                            //     }
                            // }
                            if(prev != undefined && prev.y != framesData[f].dots[i].y) {
                                hlp.setFillColor(c2)
                                    .dot(framesData[f].dots[i].x-1, framesData[f].dots[i].y)
                                    .dot(framesData[f].dots[i].x, framesData[f].dots[i].y-1);
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
                        let xClamps = [0, 122] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 5), new V2(0, 4)] }, 
                                { dots: [new V2(33, 13), new V2(32.75, 12.5)] }, 
                                { dots: [new V2(122, 25)] },
                                // { dots: [new V2(44, 173), new V2(44.25, 173)] },
                                // { dots: [new V2(4, 199), new V2(4.5, 199)] },
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: 'rgba(29,41,80,1)', c2: 'rgba(29,41,80,0.5)' })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [0, 122] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 12), new V2(0, 11.25)] }, 
                                { dots: [new V2(33, 20), new V2(32.75, 19.5)] }, 
                                { dots: [new V2(108, 30)] },
                                // { dots: [new V2(44, 173), new V2(44.25, 173)] },
                                // { dots: [new V2(4, 199), new V2(4.5, 199)] },
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: 'rgba(57,85,145,1)', c2: 'rgba(57,85,145,0.5)' })

                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))

                this.wire3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [124, 200] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(124, 27)] },
                                { dots: [new V2(168, 40), new V2(168, 40.5)] }, 
                                { dots: [new V2(199, 47), new V2(199.5, 49)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: 'rgba(29,41,80,1)', c2: 'rgba(29,41,80,0.5)' })

                        this.registerFramesDefaultTimer({startFrameIndex: 250});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [117, 200]  //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(117, 31)] },
                                { dots: [new V2(146, 40), new V2(146.25, 40.5)] }, 
                                { dots: [new V2(199, 52), new V2(200, 54)] }, 
                            ],
                            xClamps, yClamps: [132, 200], size: this.size, invert: false,
                        c1: 'rgba(29,41,80,0.75)', c2: 'rgba(29,41,80,0.25)' })

                        this.registerFramesDefaultTimer({startFrameIndex: 200});
                    }
                }))

                
            }
        }), layersData.stolb.renderIndex+1 )
    

        //road

        //car
    }
}