class GraveyardNightScene extends Scene {
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
                size: new V2(1000, 750),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'graveyard_night',
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
        let model = GraveyardNightScene.models.main;
        let layersData = {};
        let exclude = [
            'gr_fr_p1','gr_p1', 'buildings_p'
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

        this.gr_fr_p1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'gr_fr_p1')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.graves_frontal_d.renderIndex + 1)

        this.gr_p1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'gr_p1')) });

                this.registerFramesDefaultTimer({});
            }
        }), layersData.graves.renderIndex + 1)

        this.buildings_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 300, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'buildings_p')) });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.graves.renderIndex + 1)

        this.lampLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // let mask = PP.createImage(StreetScene.models.additionals, { renderOnly: ['lamp1_mask']})

                let elSize = new V2(100,100);
                let elCenter = elSize.divide(2).toInt();
                let gO = elCenter.clone();

                let gradientDots = colors.createRadialGradient({ size: elSize, center: elCenter, radius: new V2(16,12), gradientOrigin: gO, angle: -10 })
                
                let targetP = new V2(46,120);
                let shift = targetP.substract(elCenter);

                let ellipsisImage = createCanvas(this.size, (ctx, _size, hlp) => {
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
                                    a = gradientDots[shiftedY][shiftedX].maxValue/2;
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

                                            hlp.setFillColor(`rgba(249,238,128,${a})`).dot(itemData.frames[f].p)
                                        }
                                        
                                    }
                                });

                                // ctx.drawImage(mask, 0,0);
                                // ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(rawFrame, 0,0);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createMossFrames(
                            {framesCount: 300, itemsCount: 100, itemFrameslength: [150,200], size: this.size, 
                                clampX: [30,70], clampY: [90,150] 
                            })

                        let repeat = 1;
                        this.registerFramesDefaultTimer({
                            // framesEndCallback: () => { 
                            //     repeat--;
                            //     if(repeat == 0)
                            //         //this.parent.parentScene.capturing.stop = true; 
                            //     }
                        });
                    }
                }))
            }
        }), layersData.graves_frontal_d.renderIndex + 2)

        this.treeAnimations = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrames = 300;
                let aniStart = 0;
                let totalAnimationFrames = 180;
                let oneFrameDelay = 20;
                let oneFrame = 30;
                let animationStartFrameClamps = [0, 60]
                let framesFromTo = [0, 4] //2,3

                let aniParams = [
                    { layerName: 'l1', animationStartFrame: 15, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#29385e' }   }},
                    { layerName: 'l2', animationStartFrame: 10, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#2f406d' }   }},
                    { layerName: 'l3', animationStartFrame: 0, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#2f406d' }   }},
                    { layerName: 'l4', animationStartFrame: 30, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#29385e' }   }},
                    { layerName: 'l5', animationStartFrame: 5, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#2f406d' }, '#6d6965': { color: '#04050a'  } }},
                    { layerName: 'l6', animationStartFrame: 5, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#2f406d' }, '#6d6965': { color: '#04050a'  } }},
                    { layerName: 'l7', animationStartFrame: 5, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#2f406d' }, '#6d6965': { color: '#04050a'  } }},
                    { layerName: 'l8', animationStartFrame: 5, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#29385e' }, '#6d6965': { color: '#04050a'  } }},
                    { layerName: 'l9', animationStartFrame: 5, noOneFrame: true, colorsSubstitutions: { '#b0aeb2': { color: '#19213a' }, '#888584': { color: '#12182a' }, '#d7d7df': { color: '#29385e' }, '#6d6965': { color: '#04050a'  } }},
                ]

                this.animations = aniParams.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: PP.createImage(GraveyardNightScene.models.treeAnimation, { renderOnly: [p.layerName], colorsSubstitutions: p.colorsSubstitutions }),
                    init() {
                        let framesIndexValues = new Array(totalFrames).fill(0)

                        let animationStartFrame = getRandomInt(animationStartFrameClamps) + aniStart // p.animationStartFrame + aniStart;

                        let animationFramesIndexValues = 
                            [
                                ...easing.fast({ from: framesFromTo[0], to: framesFromTo[1], steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0}), 
                                ...easing.fast({ from: framesFromTo[1], to: framesFromTo[0], steps: totalAnimationFrames/2, type: 'quad', method: 'out', round: 0})
                            ]

                        for(let i = 0; i < totalAnimationFrames; i++){
                            let index = animationStartFrame + i;
                            
                            if(index > (totalFrames-1)){
                                index-=totalFrames;
                            }

                            framesIndexValues[index] = animationFramesIndexValues[i];
                        }

                        if(!p.noOneFrame) {
                            for(let i = 0; i < oneFrame; i++){
                                let index = animationStartFrame + totalAnimationFrames + oneFrameDelay + i;
    
                                if(index > (totalFrames-1)){
                                    index-=totalFrames;
                                }
    
                                framesIndexValues[index] = 1;
                            }
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
        }), layersData.tree.renderIndex + 1)
    }
}