class Demo10GhostTrain extends Scene {
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
                fileNamePrefix: 'ghost'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
    extractPointData(layer) {
        let data = [];
        layer.groups.forEach(group => {
            let color = group.strokeColor;
            group.points.forEach(point => {
                data.push({
                    color, 
                    point: point.point
                });
            })
        })

        return data;
    }
    createMovementFrames({framesCount, itemFrameslength, pointsData, size}) {
        let frames = [];
        
        let itemsData = pointsData.map((pd, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = itemFrameslength;
        
            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = true;
            }
        
            return {
                frames,
                pd
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }
    start(){
        let model = Demo10GhostTrain.models.main;

        for(let i = 0; i < model.main.layers.length; i++){
            
            let layerIndex = (i+1)*10;

            if(model.main.layers[i].name == 'paricles1' || model.main.layers[i].name == 'paricles2' || model.main.layers[i].name == 'paricles3'){
                let pointsData = this.extractPointData(model.main.layers.find(layer => layer.name == model.main.layers[i].name));
                let frames = this.createMovementFrames({framesCount: 200, itemFrameslength: 20, size: this.viewport, pointsData});

                this.paricles1 = this.addGo(new GO({
                    position: this.sceneCenter.clone(),
                    size: this.viewport.clone(),
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }), layerIndex);

                continue;           
            }

            if( model.main.layers[i].name == 'paricles4'){
                let pointsData = this.extractPointData(model.main.layers.find(layer => layer.name == model.main.layers[i].name));
                let frames = this.createMovementFrames({framesCount: 200, itemFrameslength: 50, size: this.viewport, pointsData});

                this.paricles1 = this.addGo(new GO({
                    position: this.sceneCenter.clone(),
                    size: this.viewport.clone(),
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }), layerIndex);

                continue;           
            }

            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    
                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }

        this.createFogFrames = function({startPoints, framesCount, itemsCount, itemFrameslength, size, color, r= 6, dir = V2.right}) {
            let frames = [];
            let circleImage = PP.createImage(PP.circles.filled[r], { colorsSubstitutions: { '#FF0000': { color, changeFillColor: true } } });
            let sharedPP = undefined;       
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});

                let points = [];
                for(let i = 0; i < startPoints.length-1; i++){
                    points = [...points, ...sharedPP.lineV2(startPoints[i], startPoints[i+1])];
                }
                startPoints = points.map(p => new V2(p));
            })     

            let commonImg = createCanvas(size, (ctx, size, hlp) => {
                hlp.setFillColor(color);

                startPoints.forEach(sp => {
                    hlp.rect(sp.x, sp.y, 1, 100)    
                });
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
                let startPoint = startPoints[getRandomInt(0, startPoints.length-1)].add(new V2(getRandomInt(-2,2), getRandomInt(-2,2)));
                let d = dir.rotate(getRandomInt(-15,15));
                let distance = getRandomInt(5,10);
                let points = sharedPP.lineV2(startPoint, startPoint.add(d.mul(distance)));
                let indexValues = [
                    ...easing.fast({ from: 0, to: points.length-1, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({ from: points.length-1, to: 0, steps: framesCount/2, type: 'quad', method: 'inOut', round: 0})
                ];
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        p: points[indexValues[f]]
                    };
                }
            
                return {
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    ctx.drawImage(commonImg ,0,0);
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            ctx.drawImage(circleImage, itemData.frames[f].p.x, itemData.frames[f].p.y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        // this.fog = this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: this.viewport,
        //     init() {
        //         //#2c2524
        //         let startPoints = [new V2(-20, 74), new V2(14,85), new V2(32,94), new V2(53, 96)]
        //         new Array(2).fill().map((el, i) => this.addChild(new GO({
        //             position: new V2(),
        //             size: this.size, 
        //             frames: this.parentScene.createFogFrames({startPoints: startPoints.map(p => p.add(new V2(-2*i, i*4))), 
        //                 framesCount: 200, itemsCount: 100, itemFrameslength: 200, size: this.size, color: i%2 != 0 ? '#110807': '#2c2524'}),
        //             init() {
        //                 this.registerFramesDefaultTimer({});
        //             }
        //         })))
        //         //this.frames = this.parentScene.createFogFrames({startPoints, framesCount: 200, itemsCount: 100, itemFrameslength: 200, size: this.size, color: '#110807'});

        //         //this.registerFramesDefaultTimer({});
        //     }
        // }), 55)

        this.fog2 = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                //#120c0c
                let startPoints = [new V2(-20, 110), new V2(25,140), new V2(60,144), new V2(91, 150)]
                new Array(2).fill().map((el, i) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    frames: this.parentScene.createFogFrames({startPoints: startPoints.map(p => p.add(new V2(-2*i, i*4))), 
                        framesCount: 200, itemsCount: 100, itemFrameslength: 200, size: this.size, color: i%2 != 0 ? '#0a0707': '#120c0c', r: 8}),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))

                let startPoints2 = [new V2(128, 150), new V2(155,145), new V2(180,135), new V2(210, 105)]
                new Array(2).fill().map((el, i) => this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    frames: this.parentScene.createFogFrames({startPoints: startPoints2.map(p => p.add(new V2(2*i, i*4))), 
                        framesCount: 200, itemsCount: 100, itemFrameslength: 200, size: this.size, color: i%2 != 0 ? '#0a0707': '#120c0c', r: 8, dir: V2.left}),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))
            }
        }), 65)

        this.shadow = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(Demo10GhostTrain.models.shadowFrames),
            init() {
                this.registerFramesDefaultTimer({ originFrameChangeDelay: 7, initialAnimationDelay: 140, animationRepeatDelayOrigin: 140, debug: true,
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    } 
                });
            }
        }), 69)
    }
}