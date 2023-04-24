class DustScene extends Scene {
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
                fileNamePrefix: 'dust',
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
        const model = DustScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();

        this.floor = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['floor'] })
            }
        }), 1)

        this.wall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['wall'] })
            }
        }), 5)

        this.windows = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['window1', 'window2'] })
            }
        }), 10)

        this.rays = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRaysFrames({framesCount, itemsCount, itemFrameslength, data, size}) {
                let frames = [];
                
                let particles = data.particles;

                itemsCount = 25;
                let {p0_original, angleOriginal, length_original, x_shiftClamps, y_shiftClamps, alphaValue, maskData, raysXShiftClamps, } = data;

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: maskData.center, radius: maskData.radius, gradientOrigin: maskData.gradientOrigin, 
                    angle: 0, easingType: 'quad', easingMethod: 'in',
                    setter: (dot, aValue) => {
                        aValue*=1;
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                let colorPrefix = 'rgba(255,255,255,'
                let maskImg = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    //hlp.setFillColor(`rgba(0,0,255,0.5`).dot(x,y) 
                                    hlp.setFillColor(`${colorPrefix}${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y) 
                                }
                            }
                        }
                    }
                })

                //debugger;

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength;

                    let l = length_original + getRandomInt(0, 10);
                    let d = [V2.right.rotate(angleOriginal+5), V2.right.rotate(angleOriginal-5)]

                    let p0 = p0_original.add(new V2(getRandomInt(x_shiftClamps), getRandomInt(y_shiftClamps)));

                    if(i == 0) {
                        p0_original.add(new V2(x_shiftClamps[0], getRandomInt(y_shiftClamps[1])));
                    }

                    if(i == 1) {
                        p0_original.add(new V2(x_shiftClamps[1], getRandomInt(y_shiftClamps[0])));
                    }

                    if(i > 1 && i < 4) {
                        p0_original.add(new V2(getRandomInt(-2,2), getRandomInt(-2,2)));
                    }

                    let p1 = p0.add(V2.right.rotate(-45 + getRandomInt(-10,10)).mul(getRandomInt(1,1)));
                    let p2 = p1.add(d[1].mul(l))
                    let p3 = p1.add(d[0].mul(l))

                    
                    let xShift = getRandomInt(0,2) == 0 ? getRandomInt(raysXShiftClamps) : 0;

                    if(i == 0) {
                        xShift = raysXShiftClamps[0]
                    }

                    if(i == 1) {
                        xShift = raysXShiftClamps[1]
                    }

                    let xShiftValues = easing.fast({from: 0, to: xShift, steps: totalFrames, type: 'quad', method: 'inOut', round: 0})
                    let aValues = (xShift != 0 ? [
                        ...easing.fast({ from: 0, to: alphaValue, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 3}),
                        ...easing.fast({ from: alphaValue, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 3})
                    ] : new Array(totalFrames).fill(alphaValue));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            corners: [p0, p1, p2, p3].map(p => p.add(new V2(xShiftValues[f], 0))),
                            a: aValues[f]
                        };
                    }
                
                    return {
                        frames
                    }
                })

                let particlesItemsData = [];

                if(particles) {
                    particlesItemsData = new Array(particles.count*2).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = getRandomInt(particles.itemFrameslength);

                        let pmul = i%2 == 0 ? 4 : 1

                        let p0 = p0_original
                            .add(V2.right.rotate(angleOriginal).mul(getRandomInt(length_original*1/4, length_original*3/4)))
                            .add(new V2(getRandomInt(-7,7)*pmul, getRandomInt(-7,7)*pmul)).toInt();
    
                        let xShiftValues = easing.fast({from: 0, to: getRandomInt(particles.xShiftClamps), steps: totalFrames, type: 'quad', method: 'inOut', round: 0})
                        let yShiftValues = easing.fast({from: 0, to: getRandomInt(particles.xShiftClamps), steps: totalFrames, type: 'quad', method: 'inOut', round: 0})
                        let maxA = fast.r(getRandom(particles.alphaValueClamps[0], particles.alphaValueClamps[1]),2);

                        if(i%2 == 0){
                            maxA/=2;
                        }

                        let aValues = [
                            ...easing.fast({ from: 0, to: maxA, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2}),
                            ...easing.fast({ from: maxA, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 2})
                        ];
    
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                p: { x: p0.x + xShiftValues[f], y: p0.y },
                                a: aValues[f] || 0
                            };
                        }
                    
                        return {
                            frames
                        }
                    })
                }

                //debugger;
                for(let f = 0; f < framesCount; f++){
                    //console.log('frames gen: ' + f)
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                       
                        
                        let pp = new PP({ctx});
                        //rgba(239,195,129,

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                pp.setFillStyle('rgba(255,211,150,' + itemData.frames[f].a); 

                                pp.fillByCornerPoints(itemData.frames[f].corners)
                            }
                            
                        }

                        for(let p = 0; p < particlesItemsData.length; p++){
                            let itemData = particlesItemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillStyle('rgba(255,211,150,' + itemData.frames[f].a); 

                                hlp.dot(itemData.frames[f].p)
                            }
                            
                        }

                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(maskImg, 0, 0)
                    });
                }
                
                return frames;
            },

            init() {
                let framesCount = 120;

                this.ray1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createRaysFrames({ framesCount, itemsCount: 25, itemFrameslength: framesCount, 
                            data: {
                                p0_original: new V2(37,88),
                                angleOriginal: 50,
                                length_original: 120,
                                x_shiftClamps: [-6,8],
                                y_shiftClamps: [-8,8],
                                alphaValue: 0.033,
                                raysXShiftClamps: [-5,4],
                                maskData: {
                                    center: new V2(69,117),
                                    radius: new V2(60,60),
                                    gradientOrigin: new V2(56,106),
                                },
                                particles: {
                                    count: 10, 
                                    itemFrameslength: [90, 120], 
                                    xShiftClamps: [-2, 2],
                                    alphaValueClamps: [0.2, 0.4]
                                }
                            },
                            size: this.size });
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.ray2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createRaysFrames({ framesCount, itemsCount: 25, itemFrameslength: framesCount, 
                            data: {
                                p0_original: new V2(60,81),
                                angleOriginal: 40,
                                length_original: 130,
                                x_shiftClamps: [-6,8],
                                y_shiftClamps: [-8,8],
                                alphaValue: 0.03,
                                raysXShiftClamps: [-5,4],
                                maskData: {
                                    center: new V2(102,113),
                                    radius: new V2(70,60),
                                    gradientOrigin: new V2(80,96),
                                },
                                particles: {
                                    count: 15, 
                                    itemFrameslength: [90, 120], 
                                    xShiftClamps: [-2, 2],
                                    alphaValueClamps: [0.1, 0.4]
                                }
                            },
                            size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.ray3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = this.parent.createRaysFrames({ framesCount, itemsCount: 20, itemFrameslength: framesCount, 
                            data: {
                                p0_original: new V2(153,70),
                                angleOriginal: 20,
                                length_original: 60,
                                x_shiftClamps: [-8,8],
                                y_shiftClamps: [-6,6],
                                alphaValue: 0.05,
                                raysXShiftClamps: [-2,3],
                                maskData: {
                                    center: new V2(182,81),
                                    radius: new V2(50,50),
                                    gradientOrigin: new V2(167,75),
                                },
                                particles: {
                                    count: 5, 
                                    itemFrameslength: [90, 120], 
                                    xShiftClamps: [-8, 10],
                                    alphaValueClamps: [0.3, 0.5]
                                }
                            },
                            size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }))
                
            }
        }), 11)
    }
}