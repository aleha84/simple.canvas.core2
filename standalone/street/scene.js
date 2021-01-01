class StreetScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'street_wip'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y)
                })
            }
        }), 0)

        // this.main = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.img = PP.createImage(StreetScene.models.main)
        //     }
        // }), 1) 

        let model = StreetScene.models.main;
        let layersData = {};
        let exclude = [];
        //let renderOnly = ['lamp_post_l']

        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;

            layersData[layerName] = {
                renderIndex
            }

            // if(renderOnly.indexOf(layerName) == -1){
            //     console.log(`${layerName} - skipped`)
            //     continue;
            // }

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


        this.lampLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(StreetScene.models.additionals, { renderOnly: ['lamp1_mask']})

                let elSize = new V2(100,100);
                let elCenter = elSize.divide(2).toInt();
                let gO = elCenter.clone();

                let gradientDots = colors.createRadialGradient({ size: elSize, center: elCenter, radius: new V2(10,40), gradientOrigin: gO, angle: -10 })
                
                let targetP = new V2(85,40);
                let shift = targetP.substract(elCenter);

                //console.log(gradientDots);
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let ellipsisImage = createCanvas(size, (ctx, _size, hlp) => {
                        for(let y = 0; y < gradientDots.length; y++){
                            let row = gradientDots[y];
                            if(!row)
                                continue;

                            for(let x = 0; x < row.length; x++){
                                if(!row[x])
                                    continue;

                                if(row[x].length == 0)
                                    continue;

                                let a = Math.max(...row[x].values);

                                a = fast.r(a, 1);
                                if(row[x].maxValue == undefined)
                                    row[x].maxValue = a;
                                
                                hlp.setFillColor(`rgba(246,173,85,${a})`).dot(new V2(x, y).add(shift))
                            }
                        }
                    })

                    ctx.drawImage(mask, 0,0);
                    ctx.globalCompositeOperation = 'source-in';
                    ctx.drawImage(ellipsisImage, 0,0);
                    
                })

                

                this.moss = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createMossFrames({framesCount, itemsCount, itemFrameslength, size, clampX, clampY}) {
                        let frames = [];
                        
                        let lf = (angle, p1) => {
                            let rad = degreeToRadians(angle);
                            let sinSq = (1-Math.cos(2*rad)/2);

                            return new V2(
                                p1*Math.cos(rad)/(1 + sinSq ),
                                p1*Math.sin(rad)*Math.cos(rad)/(1 + sinSq )
                            ).toInt();
                        }

                        let elf = (angle, size) => {
                            let r = degreeToRadians(angle);
                            return new V2(
                                (size.x * Math.cos(r)),
                                (size.y * Math.sin(r))
                            ).toInt();
                        }

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslength[0], itemFrameslength[1]);
                        
                            let aValues = easing.fast({ from: 0, to: 360, steps: totalFrames, type: 'linear' });
                            let init =  new V2(
                                getRandomInt(clampX[0], clampX[1]),
                                getRandomInt(clampY[0], clampY[1])
                                );
                            
                            let p1 = getRandom(10, 12);
                            let useEl = false;
                            let elSize = undefined;
                            if(getRandomBool()){
                                useEl = true;
                                elSize = new V2(getRandomInt(5,15), getRandomInt(5,15))
                            }

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }

                                let p = useEl
                                ? elf(aValues[f], elSize).add(init)
                                : lf(aValues[f], p1).add(init);

                                let shiftedX = p.x-shift.x;
                                let shiftedY = p.y-shift.y;

                                let a = 0;
                                if(gradientDots[shiftedY] && gradientDots[shiftedY][shiftedX]){
                                    a = gradientDots[shiftedY][shiftedX].maxValue;
                                }
                        
                                frames[frameIndex] = {
                                    p,
                                    a
                                };
                            }
                        
                            return {
                                init,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let rawFrame = createCanvas(size, (ctx, _size, hlp) => {
                                    for(let p = 0; p < itemsData.length; p++){
                                        let itemData = itemsData[p];
                                        
                                        if(itemData.frames[f]){
                                            let a = itemData.frames[f].a*2;

                                            hlp.setFillColor(`rgba(246,173,85,${a})`).dot(itemData.frames[f].p)
                                        }
                                        
                                    }
                                });

                                ctx.drawImage(mask, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(rawFrame, 0,0);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createMossFrames(
                            {framesCount: 300, itemsCount: 100, itemFrameslength: [150,200], size: this.size, 
                            clampX: [73,101], clampY: [35,75] 
                            })

                        let repeat = 1;
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => { 
                                repeat--;
                                if(repeat == 0)
                                    this.parent.parentScene.capturing.stop = true; 
                                }
                        });
                    }
                }))
            }
        }), layersData.lamp_post_l.renderIndex)

        this.boxLDark = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            isVisible: false,
            img: PP.createImage(model, { forceVisivility: { 'box_l_dark': { visible: true } }, renderOnly: ['box_l_dark']}),
            init() {
                
                this.currentFrame = 0;
                this.totalFrames = 300;

                this.visibleFrames = new Array(this.totalFrames).fill(false);

                new Array(5).fill().forEach((el, i) => {
                    this.visibleFrames[30+i] = true
                });

                new Array(15).fill().forEach((el, i) => {
                    this.visibleFrames[200+i] = true
                });

                new Array(10).fill().forEach((el, i) => {
                    this.visibleFrames[100+i] = true
                });

                new Array(5).fill().forEach((el, i) => {
                    this.visibleFrames[120+i] = true
                });
                
                this.timer = this.regTimerDefault(10, () => {
                    this.isVisible = this.visibleFrames[this.currentFrame];

                    this.currentFrame++;
                    if(this.currentFrame == this.totalFrames){
                        this.currentFrame = 0;
                    }
                })
            }
        }), layersData.box_l.renderIndex+1)

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
                        let xClamps = [0, 175] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 91), new V2(0, 88)] }, 
                                { dots: [new V2(50, 86), new V2(50, 84)] }, 
                                { dots: [new V2(129, 60), new V2(129, 59)] }, 
                                { dots: [new V2(175,34)] }
                            ],
                            xClamps, size: this.size })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.wire2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let xClamps = [0, 186] //35

                        this.frames = this.parent.createWiresFrames({ framesCount:300, 
                            dotsData: [
                                { dots: [new V2(0, 91+11), new V2(0, 88+11)] }, 
                                { dots: [new V2(50+5, 86+11), new V2(50+5, 84+11)] }, 
                                { dots: [new V2(129+5, 60+11), new V2(129+5, 59+11)] }, 
                                { dots: [new V2(186,45)] }
                                // { dots: [new V2(0, 99), new V2(0, 96)] }, 
                                // { dots: [new V2(64, 91), new V2(64, 89)] }, 
                                // { dots: [new V2(135, 71), new V2(135, 70)] }, 
                                // { dots: [new V2(186,45)] }
                            ],
                            xClamps, size: this.size })

                        this.registerFramesDefaultTimer({startFrameIndex: 50});
                    }
                }))
            }
        }), layersData.bush_l.renderIndex+1 )

        this.lowerTreeAnimation = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let aniParams = [
                    {
                        model: StreetScene.models.lowerTreeFrames,
                        animationStartFrame: 0,
                    },
                    {
                        model: StreetScene.models.lowerTreeFrames1,
                        animationStartFrame: 10,
                    },
                    {
                        model: StreetScene.models.lowerTreeFrames2,
                        animationStartFrame: 20,
                    },
                    {
                        model: StreetScene.models.lowerTreeFrames3,
                        animationStartFrame: 20,
                    }
                ]

                let totalFrames = 150;
                let totalAnimationFrames = 80;

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(p.model),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)//.map((el,i) => getRandomInt(0,3) == 0 ? 1: 0);

                        let v = 0;
                        for(let i = 0; i < totalFrames; i++){
                            if(i%25 == 0){
                                v = v==0? 1: 0;
                            }

                            let index = p.animationStartFrame+i;
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = v;
                        }

                        let animationStartFrame = p.animationStartFrame;

                        let animationFramesIndexValues = [
                            ...easing.fast({ from: 0, to: this.frames.length-1, steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                            ...easing.fast({ from: this.frames.length-1, to: 0, steps: totalAnimationFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]


                        for(let i = 0; i < animationFramesIndexValues.length; i++){
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
        }), layersData.bottom_tree.renderIndex+1 )

        // this.lemn = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         let p1 = 10;
        //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
        //             let aValues = easing.fast({ from: 0, to: 360, steps: 100, type: 'linear' });

        //             for(let i = 0; i < 100; i++){
        //                 let a = aValues[i];

        //                 let rad = degreeToRadians(a);
        //                 let sinSq = (1-Math.cos(2*rad)/2);

        //                 let x = fast.r(p1*Math.cos(rad)/(1 + sinSq ))
        //                 let y = fast.r(p1*Math.sin(rad)*Math.cos(rad)/(1 + sinSq ));

        //                 hlp.setFillColor('red').dot(x+100, y+100)
        //             }

                    
        //         })
        //     }
        // }), 10)
    }
}