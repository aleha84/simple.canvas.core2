class EarthScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(900,900),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects5',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)


        // this.planet = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: new V2(40,40),
        //     init() {
        //         let framesCount = 300;
        //         let texture = PP.createImage(DraftsScene.models.earth);
        //         let textureSize = new V2(this.size.x*2, this.size.y);
        //         let timeValues = easing.fast({from: 0, to: textureSize.x, steps: framesCount, type: 'linear', method: 'base'});


        //         this.frames = [];
        //         for(let f = 0; f < framesCount; f++){
        //             let frame = sphereHelper.createSphere(texture, 'earth',  textureSize, this.size.x, 1, timeValues[f], true )

        //             this.frames[f] = frame;
        //         }
        //         //let img = sphereHelper.createSphere(texture, 'earth',  textureSize, this.size.x, 1, 0, true )

        //         //this.img = img;

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 10)

        this.circle = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createItemsFrames({framesCount, itemsCount, itemFrameslengthClamps, rClamps, center, size, speedClamps}) {
                let frames = [];

                let cColors = ['#671500', '#BE4401', '#F98401', '#F7FF4B' ]

                let circleImages = {};

                for(let c = 0; c < cColors.length; c++){
                    circleImages[cColors[c]] = []
                    for(let s = 1; s < 20; s++){
                        if(s > 8)
                            circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                                hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                            })
                        else {
                            circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                        }
                    }
                }
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let direction = V2.up.rotate(getRandomInt(0, 360));
                    let pOrigin = center.add(direction.mul(getRandomInt(rClamps))).toInt();

                    let speed = getRandom(speedClamps[0], speedClamps[1]); 
                    let shiftVector = new V2();
                    if(getRandomBool()) {
                        shiftVector = direction.rotate(90*(getRandomBool() ? 1 : -1)).mul(getRandom(0.05, 0.1));
                    }

                    //let startSize = getRandomInt(8,12);
                    let sizes = [];
                    for(let i = 0; i < cColors.length; i++) {
                        if(i == 0) {
                            sizes[i] = getRandomInt(8,12);
                        }
                        else {
                            sizes[i] = sizes[i-1] - getRandomInt(1,3);
                        }
                    }

                    // let check = getRandomInt(0,10);
                    // if(check <= 1) {
                    //     sizes = sizes.map((el, i) => {
                    //         if(i == 0) {
                    //             return el;
                    //         }

                    //         return -1;
                    //     })
                    // }
                    // else if(check == 2) {
                    //     sizes = sizes.map((el, i) => {
                    //         if(i <= 1) {
                    //             return el;
                    //         }

                    //         return -1;
                    //     })
                    // }

                    let additionalsCount = getRandomInt(1,5);
                    let addiotionals = [];
                    for(let i = 0; i < additionalsCount; i++) {
                        addiotionals.push({
                            shift: new V2(getRandomInt(-2,2), getRandomInt(-2,2)),
                            direction: V2.up.rotate(getRandomInt(0,360)),
                            speed: 0,//getRandom(0.01, 0.02),
                            sizeShift: getRandomInt(-2,0)
                        })
                    }

                    let sizeChangeValues = easing.fast({from: 0, to: sizes[0], steps: totalFrames, type: 'linear', round: 0});
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            index: f,
                            sizes: sizes.map(s => s - sizeChangeValues[f]),
                            p: pOrigin.add(direction.mul(speed*f)).add(shiftVector.mul(f)).toInt()
                        };
                    }
                
                    return {
                        addiotionals,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let colorsData = new Array(cColors.length).fill().map((() => []));
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                for(let i = 0; i < cColors.length;i++) {
                                    colorsData[i].push({ 
                                        size: itemData.frames[f].sizes[i], 
                                        p: itemData.frames[f].p, 
                                        index: itemData.frames[f].index,
                                        addiotionals: itemData.addiotionals })
                                }
                                
                            }
                            
                        }

                        for(let i = 0; i < cColors.length;i++) {
                            let cData = colorsData[i];

                            for(let j = 0; j < cData.length; j++){
                                let { size, p, addiotionals, index } = cData[j];
                                if(size > 0) {
                                    ctx.drawImage(circleImages[cColors[i]][size], p.x - size, p.y - size)

                                    addiotionals.forEach(additional => {
                                        let shiftedSize = size + additional.sizeShift;
                                        if(shiftedSize > 0) {

                                            let shift = additional.shift.add(additional.direction.mul(additional.speed*index)).toInt();

                                            ctx.drawImage(circleImages[cColors[i]][shiftedSize], p.x - size + shift.x, p.y - size + shift.y)
                                        }
                                    });  
                                }
                            }
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let origin = this.size.divide(2).toInt()
                let totalFrames = 150;

                let frames = [];
                let aValues = [
                    ...easing.fast({from: 1, to: 2, steps: totalFrames/2, type: 'quad', method: 'inOut' }),
                    ...easing.fast({from: 2, to: 1, steps: totalFrames/2, type: 'quad', method: 'inOut' })
                ]

                let rValues = [
                    ...easing.fast({from: 35, to: 33, steps: totalFrames/2, type: 'quad', method: 'inOut' }),
                    ...easing.fast({from: 33, to: 35, steps: totalFrames/2, type: 'quad', method: 'inOut' })
                ]

                let xShiftValues = easing.fast({from: 0, to: degreeToRadians(90), steps: totalFrames, type: 'linear', method: 'base' })

                for(let f = 0; f < totalFrames; f++) {
                    let dots = []
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(0,0,0,0)').strokeEllipsis(0,360,5, origin, 35, 35,dots,true)
    
                        let pp = new PP({ctx});
    
                        let xValuesChange = easing.fast({from: 0, to: degreeToRadians(360), steps: dots.length, type: 'linear' });
    
                        let foo = (x) => 1.5*Math.sin(20*(x + xShiftValues[f]));
    
                        let points = [];
                        for(let i = 0; i < dots.length; i++) {
                            let dot = new V2(dots[i])
                            let direction = origin.direction(dot);
                            points.push(dot.add(direction.mul(foo(xValuesChange[i]))).toInt())
                        }
    
                        pp.setFillStyle('black');
                        pp.fillByCornerPoints(points);

                        pp.setFillStyle('#F7FF4B')
                        for(let p = 0; p < points.length; p++) {
                            if(p < points.length-1)
                                pp.lineV2(points[p], points[p+1])
                        }
                        // hlp.setFillColor('black').circle(origin, 35)
                        // hlp.setFillColor('#BE4401').strokeEllipsis(0,360,0.1, origin, 34, 34,undefined,true)
                        // hlp.setFillColor('#F7FF4B').strokeEllipsis(0,360,1.5, origin, 35, 35,undefined,true)
                    })
                }
                

                this.frames = this.createItemsFrames({ framesCount: 150, itemsCount: 500, itemFrameslengthClamps: [100, 150], 
                    rClamps: [24,30], speedClamps: [0.1, 0.3], center: origin, size: this.size }).map((f,i) => createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(f, 0,0);
                        ctx.drawImage(frames[i], 0,0);
                    }));

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 10)
    }
}