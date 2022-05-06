class GazerScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(200,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'gazer',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = GazerScene.models.main;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0)
            })
        }), 1)

        this.table = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['table'] }),
            init() {
                this.table_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'table_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [20,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }));
            }
        }), 3)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['lamp'] }),
            init() {

                this.sparks = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createSparksFrames({framesCount, data, sfi, itemFrameslength, size}) {
                        let frames = [];
                        
                        let pp = PP.createNonDrawingInstance();

                        let itemsData = data.map((el, i) => {
                            let startFrameIndex = sfi + getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let filledPixels = [];
                            let curvePoints = mathUtils.getCurvePointsMain({points: el, numOfSegments: 7 });
                            for(let i = 1; i < curvePoints.length; i++) {
                                filledPixels= [...filledPixels, ...pp.lineV2(curvePoints[i-1], curvePoints[i])];
                            }

                            let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);

                            let pointsIndexValues = easing.fast({from: 0, to: uniquePoints.length-1, steps: itemFrameslength, type: 'linear', method: 'base', round: 0 })
                            let aValues = easing.fast({from: fast.r(getRandom(0.7, 0.9)), to: fast.r(getRandom(0, 0.2)), steps: itemFrameslength, type: 'linear', method: 'base', round: 2 })

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){   
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    index: pointsIndexValues[f], 
                                    a: aValues[f]
                                };
                            }
                        
                            return {
                                points: uniquePoints,
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let p = itemData.points[itemData.frames[f].index];
                                        hlp.setFillColor('rgba(251,233,202,' + itemData.frames[f].a+ ')').dot(p)
                                        // for(let i = 1; i < 3; i++) {
                                        //     let _p = itemData.points[itemData.frames[f].index-i];
                                        //     hlp.setFillColor('rgba(251,233,202,' + fast.r(itemData.frames[f].a/(i+1),2)+ ')').dot(_p)
                                        // }
                                        hlp.setFillColor('rgba(251,233,202,' + itemData.frames[f].a/3+ ')')
                                            .dot(p.x-1, p.y)
                                            .dot(p.x+1, p.y)
                                            .dot(p.x, p.y-1)
                                            .dot(p.x, p.y+1)

                                        hlp.setFillColor('rgba(251,233,202,' + itemData.frames[f].a/4+ ')')
                                            .dot(p.x-1, p.y-1)
                                            .dot(p.x+1, p.y-1)
                                            .dot(p.x-1, p.y+1)
                                            .dot(p.x+1, p.y+1)
                                            .dot(p.x-2, p.y)
                                            .dot(p.x+2, p.y)
                                            .dot(p.x, p.y-2)
                                            .dot(p.x, p.y+2)

                                        // hlp.setFillColor('rgba(251,233,202,' + itemData.frames[f].a/3 + ')')
                                        //     .rect(p.x-1, p.y-1, 3, 1)
                                        //     .rect(p.x-1, p.y+1, 3, 1)
                                        //     .dot(p.x-1, p.y)
                                        //     .dot(p.x+1, p.y)

                                        // hlp.setFillColor('rgba(251,233,202,' + itemData.frames[f].a/4 + ')')
                                        //     .rect(p.x-1, p.y-2, 3, 1)
                                        //     .rect(p.x+2, p.y-1, 1, 3)
                                        //     .rect(p.x-1, p.y+2, 3, 1)
                                        //     .rect(p.x-2, p.y-1, 1, 3)
                                            
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {

                        let linesLayer = model.main.layers.find(l => l.name == 'lines');
                        let data = linesLayer.groups.map(g => g.points.map(p => new V2(p.point)))

                        this.frames = this.createSparksFrames({framesCount: 300, data, sfi: 0, itemFrameslength: 120, size: this.size});
                        this.registerFramesDefaultTimer({});

                        //console.log(data)
                    }
                }))

                this.lamp_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'lamp_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [20,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }));

                this.moss = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createMossFrames: function({framesCount, itemsCount, itemFrameslength, size, clampX, clampY, rgb}) {
                        //debugger;
                        let lampOverlay = PP.createImage(model, { renderOnly: ['lamp_overlay'], forceVisibility: { lamp_overlay: { visible: true } } })
                        let frames = [];
                        let shift = V2.zero;
                        let p1Clamps = [10, 30];
                        
                        let pos = [new V2(-1, 0), new V2(-1, -1,), new V2(0, -1), new V2(0,0)];
            
                        
            
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
                        
                            let pChange = easing.fast({ from: 0, to: pos.length-1, steps: 30, type: 'linear', round: 0 });
                            let _p = getRandomInt(0, pos.length-1);
            
                            let usePos = true//getRandomBool();
            
                            let init =  new V2(
                                getRandomInt(clampX[0], clampX[1]),
                                getRandomInt(clampY[0], clampY[1])
                                );
                             
                                
                            let a = fast.r(getRandom(0.5, 0.9), 2)    
                            let aValues = easing.fast({ from: 0, to: 360, steps: totalFrames, type: 'linear' });
            
                            let p1 = getRandom(10, 12);
                            let useEl = false;
                            let elSize = undefined;
                            if(getRandomBool()){
                                useEl = true;
                                elSize = new V2(getRandomInt(p1Clamps), getRandomInt(p1Clamps))
                            }
            
                            let frames = [];
            
                            let posStartIndex = getRandomInt(0, framesCount-1);
                            let posIndex = 0;
            
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
            
                                // let a = 0;
                                // if(gradientDots[shiftedY] && gradientDots[shiftedY][shiftedX]){
                                //     a = gradientDots[shiftedY][shiftedX].maxValue/2;
                                // }
            
                                let usePos = false;
                                // if(frameIndex >=)
                                // let pIndex = _p + pChange[f];
                                // if(pIndex > (pos.length-1))
                                //     pIndex-= pos.length;
                        
                                frames[frameIndex] = {
                                    pIndex : usePos? pIndex : undefined, 
                                    p
                                    
                                };
                            }
                        
                            return {
                                a,
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
                                            // let pc = new V2();
                                            // if(itemData.frames[f].pIndex != undefined) {
                                            //     pc = pos[itemData.frames[f].pIndex];
                                            // }
            
                                            
                                            hlp.setFillColor(`rgba(255,255,255,${itemData.a})`).dot(itemData.frames[f].p);
                                            hlp.setFillColor(`rgba(255,255,255,${itemData.a/4})`).dot(itemData.frames[f].p.x + (getRandomBool() ? 1 : -1), itemData.frames[f].p.y);
                                            hlp.setFillColor(`rgba(255,255,255,${itemData.a/4})`).dot(itemData.frames[f].p.x , itemData.frames[f].p.y + (getRandomBool() ? 1 : -1));
                                        }
                                        
                                    }
                                });
            
                                // 
                                // 
                                ctx.drawImage(rawFrame, 0,0);

                                ctx.globalCompositeOperation = 'destination-in';

                                 ctx.drawImage(lampOverlay, 0,0);
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createMossFrames({
                            framesCount: 300, itemsCount:150, itemFrameslength: [50,100], size: this.size, clampX: [130, 180], clampY: [110, 150]
                        })

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 5)

        this.guy = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: ['guy', 'cloack'] }),
            init() {
                this.faceAnimation = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 300;
                        let faceFrames = PP.createImage(GazerScene.models.faceFrames, { exclude: ['bg'] });

                        let faceAnimationLength = 150;
                        let indexValues = [
                            ...new Array(50).fill(),
                            ...new Array(50).fill(1),
                            ...new Array(50).fill(),
                            ...easing.fast({from: 0, to: faceFrames.length-1, steps: 25, type: 'quad', method: 'out', round: 0}),
                            ...new Array(100).fill(faceFrames.length-1),
                            ...easing.fast({from: faceFrames.length-1, to: 0, steps: 25, type: 'quad', method: 'in', round: 0}),
                            //...new Array(25).fill(),
                        ]

                        console.log('indexValues.length: ' + indexValues.length)

                        this.currentFrame = 0;
                        this.img = faceFrames[indexValues[this.currentFrame]];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.img = faceFrames[indexValues[this.currentFrame]];
                            this.currentFrame++;
                            if(this.currentFrame == indexValues.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))

                this.guy_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'guy_p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: 100, itemFrameslength: [20,40], pointsData: pd, size: this.size 
                        });

                        this.registerFramesDefaultTimer({

                        });
                    }
                }));

            }
        }), 10)
    }
}