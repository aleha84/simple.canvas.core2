class Portal3Scene extends Scene {
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
                //viewportSizeMultiplier: 5,
                size: new V2(2000, 1130),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'portal3'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = Portal3Scene.models.main;
        let layersData = {};
        let exclude = [
            'door_fog_r',
            'frontal_fog_r',
            'floor_p'
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

        let circleImages = {};
        let cColors = ['#B8E9F5', '#5590e0', '#424751','#536E6E']
        
        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 30; s++){
                if(s > 3)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        let createParticlesFrames = function({framesCount, itemsCount, itemFrameslength, size}) {
            let frames = [];
            let pColors = ['#FEFDF8', '#F6E1DA', '#D59991']
            
            let models = [
                { states: [{ p: [new V2(0,0)] }]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(0,1)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(1,0)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(0,1),new V2(-1,0)] 
                    },
                    {
                        p: [new V2(0,0), new V2(-1,0)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(0,1),new V2(1,0)] 
                    },
                    {
                        p: [new V2(0,0), new V2(0,1)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(0,1),new V2(1,1)] 
                    },
                    {
                        p: [new V2(0,0), new V2(0,1)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
                { states: [
                    {
                        p: [new V2(0,0), new V2(0,1),new V2(1,1),new V2(1,0)] 
                    },
                    {
                        p: [new V2(0,0), new V2(0,1)] 
                    },
                    {
                        p: [new V2(0,0)] 
                    }
                ]},
            ]

            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx})
            })

            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let colorChange = easing.fast({ from: 0, to: pColors.length-1, steps: totalFrames, type: 'linear', round: 0 })
                //let color = pColors[getRandomInt(0, pColors.length-1)];

                let model = models[getRandomInt(0, models.length-1)];
                let stateIndexChange = easing.fast({ from: 0, to: model.states.length-1, steps: totalFrames, type: 'cubic', method: 'out',  round: 0 })

                let p1 = new V2(38, getRandomInt(40,75));
                let distance = getRandomInt(50, 150);
                let dir = V2.right.rotate(getRandomInt(0,10));
                let p2 = p1.add(dir.mul(distance)).toInt();
                let points = sharedPP.lineV2(p1,p2).map(p => new V2(p));
                let pointsIndexChanges = easing.fast({ from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        colorIndex: colorChange[f],
                        state: model.states[stateIndexChange[f]],
                        p: points[pointsIndexChanges[f]]
                    };
                }
            
                return {
                    //color,
                    frames
                }
            })
            
            let xShift = new V2(-1, 0)

            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(pColors[itemData.frames[f].colorIndex]);
                            let state = itemData.frames[f].state;
                            let p = itemData.frames[f].p;
                            ctx.globalAlpha = 1;
                            
                            for(let i = 0; i < state.p.length; i++){
                                ctx.globalAlpha = 0.2;
                                hlp.dot(p.add(state.p[i]).add(xShift));
                                ctx.globalAlpha = 1;
                                hlp.dot(p.add(state.p[i]))
                            }

                            ctx.globalAlpha = 1;
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.particles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createParticlesFrames({ framesCount: 300, itemsCount: 50, itemFrameslength: 200, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), layersData.door.renderIndex+5)


        this.backFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let tf = 600

                let params = [

                    //536E6E
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [20,29], 
                            initialProps: {
                                line: true, p1: new V2(184,88), p2: new V2(-30, 57)
                            }, yShiftClamps: [-1,-4],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-20, -40], distanceClamps: [6,10], sizeClamps: [15,20], 
                            initialProps: {
                                line: true, p1: new V2(100,88), p2: new V2(50, 45)
                            }, yShiftClamps: [-3,-7],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 50, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-0, -40], distanceClamps: [6,10], sizeClamps: [15,20], 
                            initialProps: {
                                line: true, p1: new V2(50, 45), p2: new V2(35,-30)
                            }, yShiftClamps: [-3,-7],
                    },

                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [6,10], sizeClamps: [20,29], 
                            initialProps: {
                                line: true, p1: new V2(184,80), p2: new V2(-30, 50)
                            }, yShiftClamps: [-1,-4],
                    },

                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 50, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-0, -40], distanceClamps: [6,10], sizeClamps: [15,20], 
                            initialProps: {
                                line: true, p1: new V2(70, 45), p2: new V2(45,-30)
                            }, yShiftClamps: [-3,-7],
                    },

                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 50, itemFrameslength: tf, color: '#536E6E', size: this.size,
                            directionAngleClamps: [-0, -40], distanceClamps: [6,10], sizeClamps: [15,20], 
                            initialProps: {
                                line: true, p1: new V2(40, 45), p2: new V2(5,-30)
                            }, yShiftClamps: [-3,-7],
                    },

                    ///
                    {
                        opacity: 0.25,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [9,20], sizeClamps: [10,14], 
                            initialProps: {
                                line: true, p1: new V2(45,78), p2: new V2(-20, 68)
                            }, yShiftClamps: [-4,-6],
                    },
                    {
                        opacity: 0.25,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-60, -90], distanceClamps: [13,20], sizeClamps: [6,10], 
                            initialProps: {
                                line: true, p1: new V2(67,86), p2: new V2(50, 36)
                            }, yShiftClamps: [-4,-6],
                    },

                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 200, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [8,16], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(210,90), p2: new V2(54,80)
                            }, yShiftClamps: [-2,-3],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 200, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [8,16], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(210,93), p2: new V2(54,85)
                            }, yShiftClamps: [-2,-4],
                    }
                    
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.bg.renderIndex+1)


        this.doorFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(model, { renderOnly: ['door_fog_r'], forceVisivility: { 'door_fog_r': { visible: true } }  });

                let tf = 600

                let params = [
                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [90, 120], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(28,70), p2: new V2(127,90)
                            }, yShiftClamps: [-3,-5],
                    },
                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [120, 160], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(24,55), p2: new V2(75, 78)
                            }, yShiftClamps: [-3,-5],
                    },
                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [160, 180], distanceClamps: [15,30], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(24,35), p2: new V2(46, 73)
                            }, yShiftClamps: [-3,-5],
                    },

                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 150, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [90, 120], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(28,74), p2: new V2(121,91)
                            }, yShiftClamps: [-3,-5],
                            createPoligon: {
                                cornerPoints: [new V2(37,77), new V2(107,89), new V2(37,89)]
                            }
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [120, 160], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(24,55), p2: new V2(75, 83)
                            }, yShiftClamps: [-3,-5],
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#B8E9F5', size: this.size,
                            directionAngleClamps: [160, 180], distanceClamps: [15,30], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(24,41), p2: new V2(41, 78)
                            }, yShiftClamps: [-3,-5],
                    },
                    {
                        opacity: 0.1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#424751', size: this.size,
                            directionAngleClamps: [90, 120], distanceClamps: [10,15], sizeClamps: [4,8], 
                            initialProps: {
                                line: true, p1: new V2(22,73), p2: new V2(73,91)
                            }, yShiftClamps: [-3,-6],
                            // createPoligon: {
                            //     cornerPoints: [new V2(0,82), new V2(94,92), new V2(0,94)]
                            // }
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(mask,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.door.renderIndex+1)

        this.frontalFog = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let mask = PP.createImage(model, { renderOnly: ['frontal_fog_r'], forceVisivility: { 'frontal_fog_r': { visible: true } }  });

                let tf = 600

                let params = [
                    {
                        opacity: 0.5,
                        framesCount: tf, itemsCount: 400, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(148,93), p2: new V2(-20,80)
                            }, yShiftClamps: [-2,-4],
                    },

                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 200, itemFrameslength: tf, color: '#5590e0', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [10,20], sizeClamps: [4,6], 
                            initialProps: {
                                line: true, p1: new V2(148,95), p2: new V2(-20,85)
                            }, yShiftClamps: [-2,-4],
                            createPoligon: {
                                cornerPoints: [new V2(0,82), new V2(94,92), new V2(0,94)]
                            }
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;

                        ctx.globalCompositeOperation = 'destination-in';
                        ctx.drawImage(mask,0,0);
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.door.renderIndex+10)

        this.frontalFog2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let tf = 600

                let params = [
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#424751', size: this.size,
                            directionAngleClamps: [-70, -90], distanceClamps: [20,30], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(106,120), p2: new V2(30,109)
                            }, yShiftClamps: [-2,-4],
                            // createPoligon: {
                            //     cornerPoints: [new V2(0,82), new V2(94,92), new V2(0,94)]
                            // }
                    },
                    {
                        opacity: 1,
                        framesCount: tf, itemsCount: 100, itemFrameslength: tf, color: '#424751', size: this.size,
                            directionAngleClamps: [-70, -60], distanceClamps: [20,30], sizeClamps: [5,10], 
                            initialProps: {
                                line: true, p1: new V2(48,112), p2: new V2(-20,85)
                            }, yShiftClamps: [-2,-4],
                            // createPoligon: {
                            //     cornerPoints: [new V2(0,82), new V2(94,92), new V2(0,94)]
                            // }
                    },
                ]

                let itemsFrames = params.map(p => {
                    return {
                        opacity: p.opacity,
                        frames: animationHelpers.createCloudsFrames({...p, circleImages})
                    }
                })

                this.frames = [];
                for(let f =0; f < tf; f++){
                    this.frames[this.frames.length] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let i = 0; i < itemsFrames.length; i++){
                            ctx.globalAlpha = itemsFrames[i].opacity;
                            ctx.drawImage(itemsFrames[i].frames[f],0,0);
                        }

                        ctx.globalAlpha = 1;
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.door.renderIndex+12)

        this.floor_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'floor_p')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.floor.renderIndex+1)
    }
}