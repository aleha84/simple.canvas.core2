class CarVibeScene extends Scene {
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
                size: new V2(200,113).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'carVibe',
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
        const model = CarVibeScene.models.main;
        const appSharedPP = PP.createNonDrawingInstance();
        //let colorPrefix = 'rgba(223,119,53,';//'rgba(253,182,111,';

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bg'] })
            }
        }), 1)

        this.farHouses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let housesImg = PP.createImage(model, { renderOnly: ['far_houses_1'] })
                // this.img = housesImg
                let totalFrames = 1800;
                this.frames = [];
                let xValues = easing.fast({from: 0, to: this.size.x/2, steps: totalFrames, type: 'linear', round: 0})

                for(let f = 0; f < totalFrames; f++) {
                    
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
 
                        // ctx.globalAlpha = 0.25
                        // ctx.drawImage(housesImg, xValues[f]+1, 0)
                        // ctx.drawImage(housesImg, xValues[f]+1 + this.size.x/2, 0)
                        // ctx.drawImage(housesImg, xValues[f]+1 - this.size.x/2, 0)

                        ctx.globalAlpha = 1
                        ctx.drawImage(housesImg, xValues[f], 0)
                        ctx.drawImage(housesImg, xValues[f] + this.size.x/2, 0)
                        ctx.drawImage(housesImg, xValues[f] - this.size.x/2, 0)
                    })
                }

                //smooth but not true
                // let aValues = easing.fast({from: 0, to: 1, steps: 9, type: 'linear', round: 2})
                // let aValuesRev = easing.fast({from: 1, to: 0, steps: 9, type: 'linear', round: 2})

                // let f = 0
                // for(let i = 0; i < 100; i++) {
                //     for(let j = 0; j < 9; j++) {
                //         this.frames[f++] = createCanvas(this.size, (ctx, size, hlp) => {
                            

                //             ctx.globalAlpha = aValuesRev[j]
                //             ctx.drawImage(housesImg, i-1, 0)
                //             ctx.drawImage(housesImg, i-1 + this.size.x/2, 0)
                //             ctx.drawImage(housesImg, i-1 - this.size.x/2, 0)

                //             ctx.globalAlpha = 1
                //             ctx.drawImage(housesImg, i, 0)
                //             ctx.drawImage(housesImg, i + this.size.x/2, 0)
                //             ctx.drawImage(housesImg, i - this.size.x/2, 0)

                //             ctx.globalAlpha = aValues[j]
                //             ctx.drawImage(housesImg, i+1, 0)
                //             ctx.drawImage(housesImg, i+1 + this.size.x/2, 0)
                //             ctx.drawImage(housesImg, i+1 - this.size.x/2, 0)
                //         })
                //     }
                // }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 3)

        this.closeHouses = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let housesImg = PP.createImage(model, { renderOnly: ['close_houses'] })
                // this.img = housesImg

                let totalFrames = 1800;

                let screen1Frames = [];
                let totalScreenFrames = 10;
                let screensData = [
                    {
                        position: new V2(81,59),
                        img: createCanvas(new V2(3,5), (ctx, size, hlp) => {
                            hlp.setFillColor('#8B505B').rect(0,0,size.x,size.y)
                        })
                    },
                    {
                        position: new V2(7,61),
                        img: createCanvas(new V2(7,6), (ctx, size, hlp) => {
                            hlp.setFillColor('#C4231F').rect(0,0,size.x,size.y)
                            for(let x = 0; x < 4; x++) {
                                hlp.setFillColor('#c8515b').rect(x*2,1,1,4)
                            }

                            hlp.setFillColor('#A89EB1').rect(0,0,1,size.y)
                        })
                    },
                    {
                        position: new V2(115,48),
                        img: createCanvas(new V2(10,6), (ctx, size, hlp) => {
                            let pp = new PP({ctx})
                            hlp.setFillColor('#1B53A4')
                            pp.fillByCornerPoints([new V2(5,0), new V2(9,1), new V2(9,5), new V2(5,4)])
                            hlp.setFillColor('#124393')
                            pp.fillByCornerPoints([new V2(0,1), new V2(4,0), new V2(4,4), new V2(0,5)])

                            hlp.setFillColor('rgba(255,255,255,0.1')
                                .rect(1,3,3,1).rect(2,2,2,1)
                                .rect(6,2,2,1).rect(7,3,2,1)
                        })
                    },
                    {
                        position: new V2(176,56),
                        img: createCanvas(new V2(3,8), (ctx, size, hlp) => {
                            hlp.setFillColor('#A89EB1').rect(0,0,size.x,size.y) 
                        })
                    },
                    {
                        position: new V2(42,57),
                        img: createCanvas(new V2(9,3), (ctx, size, hlp) => {
                            hlp.setFillColor('#75ACB7').rect(0,0,size.x,size.y) 
                        })
                    },
                    {
                        position: new V2(150,55),
                        img: createCanvas(new V2(3,8), (ctx, size, hlp) => {
                            let pp = new PP({ctx})
                            hlp.setFillColor('#6A88A7');
                            let fp = pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)])
                            hlp.setFillColor('#477BBB')
                            pp.renderPattern('type1', fp)
                        })
                    }
                    //
                ]

                //

                this.frames = [];
                let xValues = easing.fast({from: 0, to: this.size.x, steps: totalFrames, type: 'linear', round: 0})

                for(let f = 0; f < totalFrames; f++) {
                    
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(housesImg, xValues[f], 0)
                        screensData.forEach(sd => {
                            ctx.drawImage(sd.img, sd.position.x + xValues[f], sd.position.y)
                        })

                        ctx.drawImage(housesImg, xValues[f] - this.size.x, 0)
                        screensData.forEach(sd => {
                            ctx.drawImage(sd.img, sd.position.x + xValues[f]- this.size.x, sd.position.y)
                        })
                    })
                }

                this.registerFramesDefaultTimer({});
            }
        }), 5)

        let circleImages = {};
        let lampCenterColor ='#D1D1FF'; 
        let lampLightColor = '#0F97FF' //#D1D1FF //'#B5FAFC'
        let cColors = [ lampLightColor ]

        for(let c = 0; c < cColors.length; c++){
            circleImages[cColors[c]] = []
            for(let s = 1; s < 10; s++){
                if(s > 8)
                    circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                        hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                    })
                else {
                    circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                }
            }
        }

        let lampLightImages = [];
        for(let i = 2; i < 10; i++) {
            lampLightImages[i] = createCanvas(new V2(i*2,i*2), (ctx, size, hlp) => {
                
                //hlp.setFillColor('#B5FAFC');
                for(let r = 1; r < i; r++) {
                    ctx.globalAlpha = 0.1;
                    if(r < 3) ctx.globalAlpha = 0.2;
                    ctx.drawImage(circleImages[lampLightColor][r], (size.x/2) - r, (size.y/2) - r);
                }
            });

        }

        this.lamps = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.leftLamps = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createLampsFrames({framesCount, itemsCount, size}) {
                        let frames = [];
                        //debugger;
                        let path = appSharedPP.lineByCornerPoints(
                            [...model.main.layers.find(l => l.name == 'left_lamps_path').groups[0].points.map(p => new V2(p.point)), new V2(-1, -50)]);
                        
                        let maxLampLightRadius = 9;
                        let lampHsv = colors.colorTypeConverter({ value: lampCenterColor, toType: 'hsv', fromType: 'hex' });
                        let lampPostHsv = colors.colorTypeConverter({ value: '#152F77', toType: 'hsv', fromType: 'hex' });
                        let lampAValues = easing.fast({from: 0.1, to: 1, steps: fast.r(framesCount*5/7), type: 'expo', method: 'in', round: 2});
                        let lampVValues = easing.fast({from: 30, to: lampHsv.v, steps: fast.r(framesCount*6/7), type: 'expo', method: 'in', round: 0});
                        let lampPostVValues = easing.fast({from: 15, to: lampPostHsv.v, steps: fast.r(framesCount*7/7), type: 'expo', method: 'in', round: 0});
                        let lampLightRadiusValues = easing.fast({from: 1, to: maxLampLightRadius, steps: fast.r(framesCount*10/10), type: 'expo', method: 'in', round: 0});

                        let lampPart1LengthValues = easing.fast({from: 0, to: 6, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});
                        let lampPart2LengthValues = easing.fast({from: 0, to: 8, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});
                        let lampPart3LengthValues = easing.fast({from: 2, to: 150, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});

                        let indexValues = easing.fast({from: 0, to: path.length-1, steps: framesCount, type: 'expo', method: 'in', round: 0})

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = i*framesCount/itemsCount //getRandomInt(0, framesCount-1);
                            let totalFrames = framesCount;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    p: new V2(path[indexValues[f]]),
                                    lampV: lampVValues[f] || lampHsv.v,
                                    lampA: lampAValues[f] || 1,
                                    lampPostV: lampPostVValues[f] || lampPostHsv.v,
                                    lampLightRadius: lampLightRadiusValues[f],
                                    lampPart1Length: lampPart1LengthValues[f],
                                    lampPart2Length: lampPart2LengthValues[f],
                                    lampPart3Length: lampPart3LengthValues[f]
                                };
                            }
                        
                            return {
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){ //'rgba(255,255,255,1'

                                        let {p, lampV, lampPostV, lampLightRadius, lampA,
                                            lampPart1Length, lampPart2Length, lampPart3Length
                                        } = itemData.frames[f];

                                        

                                        
                                            //.dot(p)
                                        let p1, p2, p3;

                                        hlp.setFillColor(lampLightColor);
                                        ctx.globalAlpha = lampA

                                        // hlp.setFillColor(colors.colorTypeConverter({ 
                                        //     value: {h: lampHsv.h,s: lampHsv.s,v: lampV}, toType: 'hex', fromType: 'hsv' }))

                                        if(lampPart1Length > 1) {
                                            p1 = p.add(V2.up.rotate(-120).mul(lampPart1Length)).toInt();
                                            pp.lineV2(p, p1);
                                        }
                                        else {
                                            hlp.dot(p);
                                            p1 = p.add(new V2(0,1))
                                        }

                                        ctx.globalAlpha = 1;

                                        hlp.setFillColor(colors.colorTypeConverter({ 
                                            value: {h: lampPostHsv.h,s: lampPostHsv.s,v: lampPostV}, toType: 'hex', fromType: 'hsv' }));

                                        if(lampPart2Length > 1) {
                                            p2 = p1.add(V2.up.rotate(-120).mul(lampPart2Length)).toInt();
                                            pp.lineV2(p1, p2);
                                        }
                                        else {
                                            hlp.dot(p1);
                                            p2 = p1;
                                        }

                                        p3 = p2.add(V2.up.rotate(180).mul(lampPart3Length)).toInt();
                                        pp.lineV2(p2, p3);

                                       

                                        if(lampLightImages[lampLightRadius]) {
                                            ctx.drawImage(lampLightImages[lampLightRadius], p.x - lampLightRadius + 1, p.y - lampLightRadius + 1)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        
                        let lampsCount = 10;
                        let totalFrames = 450;

                        this.frames = this.createLampsFrames({ framesCount: totalFrames, itemsCount: lampsCount, size: this.size});
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                //debugger;
                            }
                        });
                    }
                }))

                this.rightLamps = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createLampsFrames({framesCount, itemsCount, size}) {
                        let frames = [];
                        //debugger;
                        let path = appSharedPP.lineByCornerPoints(model.main.layers.find(l => l.name == 'right_lamps_path').groups[0].points.map(p => new V2(p.point)));
                        
                        let lampHsv = colors.colorTypeConverter({ value: lampCenterColor, toType: 'hsv', fromType: 'hex' });
                        let lampPostHsv = colors.colorTypeConverter({ value: '#152F77', toType: 'hsv', fromType: 'hex' });
                        let lampAValues = easing.fast({from: 0.1, to: 1, steps: fast.r(framesCount*6/7), type: 'expo', method: 'in', round: 2});
                        let lampVValues = easing.fast({from: 30, to: lampHsv.v, steps: fast.r(framesCount*6/7), type: 'expo', method: 'in', round: 0});
                        let lampPostVValues = easing.fast({from: 15, to: lampPostHsv.v, steps: fast.r(framesCount*7/7), type: 'expo', method: 'in', round: 0});
                        let lampLightRadiusValues = easing.fast({from: 0, to: 9, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 0});

                        let lampPart1LengthValues = easing.fast({from: 0, to: 3, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});
                        let lampPart2LengthValues = easing.fast({from: 0, to: 3, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});
                        let lampPart3LengthValues = easing.fast({from: 2, to: 80, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 2});

                        let indexValues = easing.fast({from: 0, to: path.length-1, steps: framesCount, type: 'expo', method: 'in', round: 0})

                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = i*framesCount/itemsCount //getRandomInt(0, framesCount-1);
                            let totalFrames = framesCount;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    p: new V2(path[indexValues[f]]),
                                    lampV: lampVValues[f] || lampHsv.v,
                                    lampA: lampAValues[f],
                                    lampPostV: lampPostVValues[f] || lampPostHsv.v,
                                    lampLightRadius: lampLightRadiusValues[f],
                                    lampPart1Length: lampPart1LengthValues[f],
                                    lampPart2Length: lampPart2LengthValues[f],
                                    lampPart3Length: lampPart3LengthValues[f]
                                };
                            }
                        
                            return {
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){ //'rgba(255,255,255,1'

                                        let {p, lampV, lampPostV, lampLightRadius, lampA,
                                            lampPart1Length, lampPart2Length, lampPart3Length
                                        } = itemData.frames[f];

                                        

                                        
                                            //.dot(p)
                                        let p1, p2, p3;

                                        hlp.setFillColor(lampLightColor);
                                        ctx.globalAlpha = lampA
                                        // hlp.setFillColor(colors.colorTypeConverter({ 
                                        //     value: {h: lampHsv.h,s: lampHsv.s,v: lampV}, toType: 'hex', fromType: 'hsv' }))

                                        if(lampPart1Length > 1) {
                                            p1 = p.add(V2.up.rotate(120).mul(lampPart1Length)).toInt();
                                            pp.lineV2(p, p1);
                                        }
                                        else {
                                            hlp.dot(p);
                                            p1 = p.add(new V2(0,1))
                                        }

                                        ctx.globalAlpha = 1;

                                        hlp.setFillColor(colors.colorTypeConverter({ 
                                            value: {h: lampPostHsv.h,s: lampPostHsv.s,v: lampPostV}, toType: 'hex', fromType: 'hsv' }));

                                        if(lampPart2Length > 1) {
                                            p2 = p1.add(V2.up.rotate(120).mul(lampPart2Length)).toInt();
                                            pp.lineV2(p1, p2);
                                        }
                                        else {
                                            hlp.dot(p1);
                                            p2 = p1;
                                        }

                                        p3 = p2.add(V2.up.rotate(180).mul(lampPart3Length)).toInt();
                                        pp.lineV2(p2, p3);

                                       

                                        if(lampLightImages[lampLightRadius]) {
                                            ctx.drawImage(lampLightImages[lampLightRadius], p.x - lampLightRadius + 1, p.y - lampLightRadius + 1)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        
                        let lampsCount = 10;
                        let totalFrames = 450;

                        this.frames = this.createLampsFrames({ framesCount: totalFrames, itemsCount: lampsCount, size: this.size});
                        this.registerFramesDefaultTimer({
                            framesChangeCallback: () => {
                                //debugger;
                            }
                        });
                    }
                }))
            }
        }), 6)

                // this.lampLightTest = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //             for(let i = 2; i < 7; i++) {
                //                 ctx.drawImage(lampLightImages[i], size.x-80 + i*8, 10)
                //             }
                //         })
                //     }
                // }));

                

        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.road = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createDithering({data, hlp, xClamps, rValues}) {

                        let a1 = new Array(50).fill().map((el, i) => 1 + i*4)
                        let a2 = new Array(50).fill().map((el, i) => 3 + i*4)
                
                        let b1 = new Array(50).fill().map((el, i) => i*4)
                        let b2 = new Array(50).fill().map((el, i) => 2+ i*4)

                        let sharedPP = PP.createNonDrawingInstance();
        
                        data.forEach(d => {
                            let {c1, c2, divider, dividerPoints, rv} = d;
        
                            let linePoints = [];
        
                            if(divider) {
                                let p1 = new V2(x1,divider);
                                let p2 = new V2(x2,divider);
        
                                linePoints = sharedPP.lineV2(p1, p2).map(p => new V2(p))
                            }
        
                            if(dividerPoints) {
                                linePoints = dividerPoints.map(p => new V2(p))
                            }
        
                            for(let i = 0; i < 2; i++) {
                                let c = undefined;
                                if(i == 0) {
                                    c = c1;
                                }
                                else {
                                    c = c2;
                                }
        
                                let d = i == 0 ? -1 : 1;
                                let xShift = i == 1 ? new V2(1, 0) : new V2()
        
                                let affectedPoints0 = [];
                                let affectedPoints1 = [];
                                let affectedPoints2 = [];
                                let affectedPoints3 = [];
                                // let r1 = 7;
                                // let r2 = 4;
                                // let r3 = 2;
        
                                let r0 = rValues[0] //14;
                                let r1 = rValues[1] //10;
                                let r2 = rValues[2] //6;
                                let r3 = rValues[3] //2;

                                if(rv) {
                                    r0 = rv[0] || 0
                                    r1 = rv[1] || 0
                                    r2 = rv[2] || 0
                                    r3 = rv[3] || 0
                                }
            
                                if(i == 1) {
                                    r0-=2
                                    r1-=2
                                    r2-=2
                                }
        
                                linePoints.forEach(lp => {
                                    //let aPoints = sharedPP.lineV2(lp, lp.add(direction2.mul(r1)));
                                    let aPoints0 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r0))).map(p => new V2(p));
                                    affectedPoints0.push(...aPoints0);
        
                                    let aPoints1 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r1))).map(p => new V2(p));
                                    affectedPoints1.push(...aPoints1);
            
                                    let aPoints2 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r2))).map(p => new V2(p));
                                    affectedPoints2.push(...aPoints2);
            
                                    //let aPoints2 = sharedPP.lineV2(lp, lp.add(direction2.mul(r2)));
                                    let aPoints3 = sharedPP.lineV2(lp, lp.add(new V2(0, d*r3))).map(p => new V2(p));
                                    affectedPoints3.push(...aPoints3);
                                })
            
                                affectedPoints0 = distinctPoints(affectedPoints0)
                                affectedPoints1 = distinctPoints(affectedPoints1)
                                affectedPoints2 = distinctPoints(affectedPoints2)
                                affectedPoints3 = distinctPoints(affectedPoints3)
            
                                let putDot = (p, c) => {
                                    if(p.x > xClamps[1])
                                        return;
        
                                    hlp.setFillColor(c).dot(p)
                                }
        
                                affectedPoints0.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        if(b1.indexOf(ap.y)!=-1 && b1.indexOf(ap.x) !=-1)
                                            putDot(ap.add(xShift),c)
                                        else if(b2.indexOf(ap.y)!=-1 && b2.indexOf(ap.x) !=-1)
                                            putDot(ap.add(xShift),c)
                                    }
                                })
           
                                affectedPoints1.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        putDot(ap.add(xShift),c)
                                    }
                                })
            
                                affectedPoints2.forEach(ap => {
                                    if(ap.x%2 == 0 && ap.y%2==0) {
                                        putDot(ap.add(xShift), c)
                                    }
                                    else {
                                        if(a1.indexOf(ap.y) != -1 && a1.indexOf(ap.x) != -1) {
                                            putDot(ap.add(xShift),c)
                                        }
                                        else if(a2.indexOf(ap.y) != -1 && a2.indexOf(ap.x) != -1){
                                            putDot(ap.add(xShift),c)
                                        }
            
                                    }
            
                                })
            
                                if( i == 0) {
                
                                    affectedPoints3.forEach(ap => {
                                        let shift = ap.y %2 == 0;
                                        if((shift && ap.x % 2 == 0) || (!shift && ap.x%2 != 0)){
                                            hlp.setFillColor(c).dot(ap)
                                        }
                                    })
                                }
                            }
                        });
                    },
                    init() {
                        let type = 'quad';
                        let method = 'inOut'; 
                        let totalFrames = 100;
                        this.frames = [];
                        let shiftValues = 7;
                        let data = {
                            l1: {
                                x1Values: [
                                    ...easing.fast({from: -shiftValues, to: 0, steps: totalFrames/2, type, method, round: 0}),
                                    ...easing.fast({from: 0, to: -shiftValues, steps: totalFrames/2, type, method, round: 0})
                                ]
                            },
                            l2: {
                                x1Values: [
                                    ...easing.fast({from: -(shiftValues-1), to: 0, steps: totalFrames/2, type, method, round: 0}),
                                    ...easing.fast({from: 0, to: -(shiftValues-1), steps: totalFrames/2, type, method, round: 0})
                                ]
                            },
                            l3: {
                                x1Values: [
                                    ...easing.fast({from: -(shiftValues-2), to: 0, steps: totalFrames/2, type, method, round: 0}),
                                    ...easing.fast({from: 0, to: -(shiftValues-2), steps: totalFrames/2, type, method, round: 0})
                                ]
                            },
                            l4: {
                                x1Values: [
                                    ...easing.fast({from: -(shiftValues-3), to: 0, steps: totalFrames/2, type, method, round: 0}),
                                    ...easing.fast({from: 0, to: -(shiftValues-3), steps: totalFrames/2, type, method, round: 0})
                                ]
                            }
                        }

                        for(let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                let pp = new PP({ctx});
                                
                                hlp.setFillColor('#0c1026').rect(0,73, size.x, size.y);
    
                                pp.setFillColor('#111937')
                                pp.fillByCornerPoints([new V2(data.l4.x1Values[f],75), new V2(size.x,81), new V2(size.x,size.y), new V2(0, size.y)])
    
                                pp.setFillColor('#162148')
                                pp.fillByCornerPoints([new V2(data.l3.x1Values[f],78), new V2(size.x,92), new V2(size.x,size.y), new V2(0, size.y)])
    
                                pp.setFillColor('#1b2a58')
                                pp.fillByCornerPoints([new V2(data.l2.x1Values[f],89), new V2(size.x,109), new V2(size.x,120), new V2(0, 120)])
    
                                pp.setFillColor('#203269')
                                pp.fillByCornerPoints([new V2(data.l1.x1Values[f],105), new V2(size.x,130), new V2(size.x,140), new V2(0, 140)])
                                
                                hlp.clear(137,73,100,3).clear(177,76,30,3);
    
                                // hlp.setFillColor('#2e272e').rect(0,0,size.x, 70)
                                // hlp.setFillColor('#281e25').rect(0,0,size.x, 30)
                                this.createDithering({
                                    data: [
                                        {
                                            c2: '#1b2a58',
                                            c1: '#203269',
                                            dividerPoints: appSharedPP.lineV2(new V2(data.l1.x1Values[f],105), new V2(size.x,130)),
                                            rv: [8,6,3,2]
                                        },
                                        {
                                            c2: '#162148',
                                            c1: '#1b2a58',
                                            dividerPoints: appSharedPP.lineV2(new V2(data.l2.x1Values[f],89), new V2(size.x,109)),
                                            rv: [8,6,3,2]
                                        },
                                        {
                                            c2: '#111937',
                                            c1: '#162148',
                                            dividerPoints: appSharedPP.lineV2(new V2(data.l3.x1Values[f],78), new V2(size.x,92)),
                                            rv: [0,4,0,2]
                                        },  
                                        {
                                            c2: '#0c1026',
                                            c1: '#111937',
                                            dividerPoints: appSharedPP.lineV2(new V2(data.l4.x1Values[f],75), new V2(size.x,81)),
                                            rv: [0,0,0,2]
                                        },
                                    ],
                                    hlp,
                                    xClamps: [0, this.size.x],
                                    rValues: [4,2,0,0].map(x => x*1)
                                })
                            })
                        }

                        this.registerFramesDefaultTimer({});
                        
                    }
                }))

                this.line = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let roadShiftTotalFrames = 100;
                        let totalFrames = 100;

                        let linePoints = model.main.layers.find(l => l.name =='road_line_path2').groups[0].points.map(p => new V2(p.point));
                        let lineColor = '#C1D5D9';

                        let steps = 12;
                        let yValues = easing.fast({from: 73, to: 100, steps, type: 'expo', method: 'in', round: 0 });
                        let darkOverlayImg = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let i = 0; i < steps; i++) {
                                hlp.setFillColor('rgba(0,0,0,0.2)').rect(0,72, size.x, yValues[i] - 72)
                            }
                        })

                        let data = [
                            { condition: (i) => true, action: (p) => p },
                            { condition: (i) => i > 3 && i < 8, action: (p) => p.add(V2.right) },
                            { condition: (i) => i > 3 && i < 12, action: (p) => p.add(V2.right) },
                            { condition: (i) => i > 3 && i < 12, action: (p) => p.add(V2.right.mul(2)) },
                            { condition: (i) => i > 3 && i < 12, action: (p) => p.add(V2.right) },
                            { condition: (i) => i > 3 && i < 8, action: (p) => p.add(V2.right) },
                            { condition: (i) => true, action: (p) => p },
                            { condition: (i) => i > 7 && i < 12, action: (p) => p.add(V2.left) },
                            { condition: (i) => i > 3 && i < 12, action: (p) => p.add(V2.left) },
                            { condition: (i) => i > 3 && i < 12, action: (p) => p.add(V2.left.mul(2)) },
                            { condition: (i) => i > 7 && i < 12, action: (p) => p.add(V2.left) },

                        ]

                        let roadImages = data.map(d => createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            pp.setFillStyle(lineColor);
                            pp.fillByCornerPoints(linePoints.map((p,i) => {
                                if(d.condition(i)) {
                                    return d.action(p);
                                }

                                return p;
                            }))

                            ctx.globalCompositeOperation = 'source-atop'
                            ctx.drawImage(darkOverlayImg, 0, 0);
                        }))  
                    

                        this.frames = [];
                        let roadFramesIndexChangeValues = easing.fast({from: 0, to: roadImages.length-1, steps: roadShiftTotalFrames, type: 'linear', round: 0})

                        // for(let f = 0; f < roadShiftTotalFrames; f++) {
                        //     this.frames[f] = roadImages[roadFramesIndexChangeValues[f]];
                        // }

                        // this.registerFramesDefaultTimer({});

                        let createRoadFrames = ({framesCount, itemsCount, size}) => {
                            let frames = [];
                            
                            let yValues = easing.fast({from: 73, to: 113, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 0});
                            let heightValues = easing.fast({from: 0, to: 30, steps: fast.r(framesCount*1/1), type: 'expo', method: 'in', round: 0});

                            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                let startFrameIndex = fast.r(i*framesCount/itemsCount)
                                let totalFrames = framesCount;
                            
                                let frames = [];
                                for(let f = 0; f < totalFrames; f++){
                                    let frameIndex = f + startFrameIndex;
                                    if(frameIndex > (framesCount-1)){
                                        frameIndex-=framesCount;
                                    }
                            
                                    frames[frameIndex] = {
                                        y: yValues[f],
                                        h: heightValues[f],
                                    };
                                }
                            
                                return {
                                    frames
                                }
                            })
                            
                            for(let f = 0; f < framesCount; f++){
                                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                    ctx.drawImage(roadImages[roadFramesIndexChangeValues[f%roadShiftTotalFrames]], 0, 0)

                                    let excludeLineImg = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsData.length; p++){
                                            let itemData = itemsData[p];
                                            
                                            let {y,h} = itemData.frames[f];
    
                                            if(itemData.frames[f]){
                                                hlp.setFillColor('red').rect(0,y,size.x, h)
                                            }
                                            
                                        }
                                    })

                                    ctx.globalCompositeOperation = 'destination-out'
                                    ctx.drawImage(excludeLineImg, 0, 0);
                                    
                                });
                            }
                            
                            return frames;
                        }

                        this.frames = createRoadFrames({framesCount: totalFrames, itemsCount: 5, size: this.size});
                        this.registerFramesDefaultTimer({});
                    }
                }));

                let createFenceFrames = ({framesCount, data = [{color, points, type}], eParams = { type: 'linear', method: 'base' }, darkOverlay, size}) => {
                    let frames = [];
                    
                    let getPd = (pd, f) => {
                        let result = [];
                        pd.forEach(pValues => {
                            result.push(new V2(pValues.xValues[f], pValues.yValues[f]))
                        })

                        return result;
                    }

                    let itemsData = data.map((el, i) => {
                        let startFrameIndex = el.sfi || getRandomInt(0, framesCount-1);
                        let totalFrames = framesCount;
                    
                        let pd = el.points.map(p => {
                            let x0, x1, y0, y1;
                            if(!isArray(p)) {
                                x0 = p.x; x1 = p.x;
                                y0 = p.y; y1 = p.y;
                            }
                            else {
                                x0 = p[0].x; x1 = p[1].x;
                                y0 = p[0].y; y1 = p[1].y;
                            }

                            return {
                                xValues: [
                                    ...easing.fast({from: x0, to: x1, steps: totalFrames/2, type: eParams.type, method: eParams.method, round: 0}),
                                    ...easing.fast({from: x1, to: x0, steps: totalFrames/2, type: eParams.type, method: eParams.method, round: 0})
                                ],
                                yValues: [
                                    ...easing.fast({from: y0, to: y1, steps: totalFrames/2, type: 'linear', round: 0}),
                                    ...easing.fast({from: y1, to: y0, steps: totalFrames/2, type: 'linear', round: 0})
                                ]
                            }
                        })

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                corners: getPd(pd, f)
                            };
                        }
                    
                        return {
                            color: el.color,
                            type: el.type,
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});

                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    pp.setFillColor(itemData.color);
                                    if(itemData.type == 'line') {
                                        pp.lineByCornerPoints(itemData.frames[f].corners)
                                    }
                                    else {
                                        pp.fillByCornerPoints(itemData.frames[f].corners)
                                    }
                                }
                                
                            }

                            ctx.globalCompositeOperation = 'source-atop'
                            ctx.drawImage(darkOverlay, 0, 0);
                        });
                    }
                    
                    return frames;
                }

                this.leftFence = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 50;
                        this.frames = [];
                        //let mainImg = PP.createImage(model, { renderOnly: ['left_fence'] });
                        let darkOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});

                            let count = 10;
                            let xValues = easing.fast({from: 10, to: 86, steps: count, type: 'sin', method: 'out', round: 0})
                            for(let i = 0; i < count; i++) {
                                let x = xValues[i];
                                hlp.setFillColor('rgba(0,0,0,' + 0.1 + ')').rect(x, 65, 86 - x, 25);

                                let fp = appSharedPP.fillByCornerPoints([new V2(x-3, 65), new V2(x-1, 65), new V2(x-1, 90), new V2(x-3, 90)])
                                pp.renderPattern('type1', fp);
                            }
                        })

                        let data = [
                            {
                                color: '#183C78',
                                type: 'line',
                                points: [[new V2(-1, 67), new V2(0,67)], new V2(56,70)]
                            },
                            {
                                color: 'rgba(0,0,0,0.3)',
                                sfi: 30,
                                points: [[new V2(0,83), new V2(-1,83)], new V2(87,72), [new V2(0, 85), new V2(-2, 85)]]
                            },
                            {
                                color: '#183C78',
                                type: 'line',
                                sfi: 40,
                                points: [[new V2(-3, 84), new V2(-2,84)], new V2(49,77)]
                            },
                            {
                                color: '#285196',
                                sfi: 20,
                                points: [[new V2(-2,68),new V2(0,68)], new V2(56,70), new V2(85,72), new V2(63,75), [new V2(34,79), new V2(33,79)], [new V2(0, 83), new V2(-2, 83)]]
                            },
                            {
                                color: '#183C78',
                                type: 'line',
                                sfi: 40,
                                points: [[new V2(-2, 81), new V2(0, 81)], new V2(81,73)]
                            }
                        ]

                        this.frames = createFenceFrames({framesCount: totalFrames, data, eParams: { type: 'sin', method: 'inOut' }, darkOverlay, size: this.size});
                        this.registerFramesDefaultTimer({});

                    }
                }))

                this.rightFence = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let totalFrames = 50;

                        let darkOverlay = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            let count = 10;
                            let xValues = easing.fast({from: 100, to: 185, steps: count, type: 'quad', method: 'in', round: 0})
                            for(let i = 0; i < count; i++) {
                                let x = xValues[i];
                                hlp.setFillColor('rgba(0,0,0,' + 0.1 + ')').rect(94, 65, x - 94, 25);

                                let fp = appSharedPP.fillByCornerPoints([new V2(x, 65), new V2(x+2, 65), new V2(x+2, 90), new V2(x, 90)])
                                pp.renderPattern('type1', fp);
                            }
                        })

                        let data = [
                            {
                                color: '#183c78',
                                type: 'line',
                                sfi: 15,
                                points: [
                                    [new V2(199,73), new V2(202, 73)], [new V2(144,72), new V2(145,72)]
                                ]
                            },
                            {
                                color: '#183c78',
                                type: 'line',
                                sfi: 30,
                                points: [
                                    [new V2(202,66), new V2(205, 66)], new V2(108,70)
                                ]
                            },
                            {
                                color: 'rgba(0,0,0,0.3)',
                                sfi: 30,
                                points: [ new V2(199,84), new V2(153,76), new V2(124,73), 
                                    [new V2(132, 74),new V2(133, 74)], [new V2(149, 77),new V2(150, 77)], [new V2(167, 80),new V2(167, 80)], [new V2(187, 84),new V2(189, 84)], [new V2(199, 87),new V2(202, 87)],  
                                ]
                            },
                            {
                                color: '#183c78',
                                type: 'line',
                                sfi: 10,
                                points: [
                                    [new V2(202,87), new V2(205, 87)], [new V2(185,83), new V2(187, 83)], [new V2(164,79), new V2(165, 79)], [new V2(153,77), new V2(154, 77)], new V2(145,76)
                                ]
                            },
                            {
                                color: '#285196',
                                sfi: 10,
                                points: [
                                    [new V2(199,67), new V2(202,67)], [new V2(162,68), new V2(164,68)], [new V2(143,69), new V2(144,69)], new V2(111,70), new V2(95,72),
                                    new V2(107,72),  [new V2(132,71), new V2(133,71)], [new V2(166,72), new V2(167,72)], [new V2(199,73), new V2(201,73)]
                                ]
                            },
                            {
                                color: '#285196',
                                sfi: 20,
                                points: [
                                    new V2(107,72), new V2(123,73), [new V2(140,75), new V2(141,75)], [new V2(160,78), new V2(161,78)], [new V2(177,81), new V2(178,81)], [new V2(199,86), new V2(201, 86)],
                                    [new V2(199,79),new V2(201,79)], [new V2(173,76), new V2(174,76)], [new V2(146,74), new V2(147,74)], new V2(130,73), [new V2(121, 72), new V2(122, 72)],
                                ]
                            },
                            {
                                color: '#183c78',
                                points: [
                                    [new V2(199,68), new V2(201, 68)], [new V2(171,69), new V2(172, 69)], [new V2(142,70), new V2(143, 70)], new V2(129,70),
                                    [new V2(176,70), new V2(177, 70)], [new V2(199,71), new V2(201, 71)]
                                ]
                            },
                            {
                                color: '#183c78',
                                type: 'line',
                                points: [
                                    [new V2(125,72), new V2(126, 72)], new V2(121,72), new V2(120,71), new V2(108,71)
                                ]
                            },
                            {
                                color: '#183c78',
                                points: [
                                    [new V2(199,81), new V2(201, 81)], [new V2(180,78), new V2(181, 78)], [new V2(172,77), new V2(173, 77)], [new V2(159,76), new V2(160, 76)], new V2(149,75), new V2(145,75),
                                    new V2(153,76),  [new V2(165,77), new V2(166,77)], [new V2(185,80), new V2(187,80)], [new V2(199,83), new V2(201, 83)]
                                ]
                            },
                            {
                                color: '#133060',
                                type: 'line',
                                sfi: 35,
                                points: [
                                    [new V2(199,68), new V2(202, 68)], [new V2(171,69), new V2(173, 69)], new V2(140,70), new V2(133,70)
                                ]
                            },
                            {
                                color: '#133060',
                                type: 'line',
                                sfi: 25,
                                points: [
                                    [new V2(199,81), new V2(202, 81)], [new V2(180,78), new V2(182, 78)], new V2(162,76), [new V2(154,76),new V2(153, 76)]
                                ]
                            },
                        ]

                        this.frames = createFenceFrames({framesCount: totalFrames, data, eParams: { type: 'sin', method: 'inOut' }, darkOverlay, size: this.size});
                        this.registerFramesDefaultTimer({});

                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.drawImage(PP.createImage(model, { renderOnly: ['right_fence'] }), 0, 0);
                            
                            
                            
                        //     ctx.globalCompositeOperation = 'source-atop'

                        //     ctx.drawImage(darkOverlay, 0, 0);
                            
                        // })
                    }
                }))
            }
        }), 7)

        this.cars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.far_car_03 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_car_03']})
                    }
                }))

                this.far_car_01 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_car_01']})
                    }
                }))

                this.far_car_02 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(model, { renderOnly: ['far_car_02']})
                    }
                }))

                this.far_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [40,60], size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'far_cars_p'))
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))


                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.car = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                let createSplashesFrames = function({framesCount, itemsCount,aClamps, itemFrameslengthClamps, size}) {
                                    let frames = [];
                                    let sz = model.main.layers.find(l => l.name == 'car_splashes_mask');
                                    let availablePoints = appSharedPP.fillByCornerPoints(sz.groups[0].points.map(p => new V2(p.point)))

                                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                        let startFrameIndex = getRandomInt(0, framesCount-1);
                                        let totalFrames = getRandomInt(itemFrameslengthClamps);

                                        let a = fast.r(getRandom(aClamps[0], aClamps[1]),2)
                                        let p = availablePoints[getRandomInt(0, availablePoints.length-1)]
                                    
                                        let frames = [];
                                        for(let f = 0; f < totalFrames; f++){
                                            let frameIndex = f + startFrameIndex;
                                            if(frameIndex > (framesCount-1)){
                                                frameIndex-=framesCount;
                                            }
                                    
                                            frames[frameIndex] = {
                                                visible: true
                                            };
                                        }
                                    
                                        return {
                                            p, a,
                                            frames
                                        }
                                    })
                                    
                                    for(let f = 0; f < framesCount; f++){
                                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                            for(let p = 0; p < itemsData.length; p++){
                                                let itemData = itemsData[p];
                                                
                                                if(itemData.frames[f]){
                                                    hlp.setFillColor('rgba(255,255,255,' + itemData.a + ')').dot(itemData.p)
                                                }
                                                
                                            }
                                        });
                                    }
                                    
                                    return frames;
                                }


                                let carImg = PP.createImage(model, { renderOnly: ['main_car_2']})
                                let splashFrames = createSplashesFrames({ framesCount: 50, itemsCount: 20, aClamps: [0.1,0.3], itemFrameslengthClamps:  [5,10], size: this.size });

                                this.frames = [];
                                this.reflectionframes = [];
                                let totalReflectionFrames = 50;
                                let reflectionItemFramesLength = 20;
                                let direction = V2.down.rotate(30);
                                let p0 = new V2(59,49);
                                let path = appSharedPP.lineV2(p0, p0.add(direction.mul(20)));
                                let indexValues = easing.fast({from: 0, to: path.length, steps: reflectionItemFramesLength, type: 'linear', round: 0});
                                let mask = createCanvas(this.size, (ctx, size, hlp) => { hlp.setFillColor('red').rect(48,59,20, 5) })
                                for(let f = 0; f < totalReflectionFrames; f++) {
                                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                        ctx.globalAlpha = 1;
                                        ctx.drawImage(carImg, 0, 0);
                                        ctx.drawImage(splashFrames[f], 0, 0);
                                        if(f < reflectionItemFramesLength) {
                                            ctx.drawImage(createCanvas(this.size, (ctx1, size, hlp) => {
                                                let pp = new PP({ctx: ctx1});
                                                let p0 = new V2(path[indexValues[f]]);
                                                pp.setFillColor(lampLightColor);
                                                ctx.globalAlpha = 0.5;
                                                pp.fillByCornerPoints([p0, p0.add(new V2(3,0)), p0.add(new V2(3,0)).add(direction.mul(8)), p0.add(direction.mul(8))]);
                                                ctx1.globalCompositeOperation = 'destination-in';
                                                ctx1.drawImage(mask, 0,0);
                                            }), 0, 0);
                                        }
                                    })
                                }

                                this.registerFramesDefaultTimer({});
                            }
                        }))

                        let totalFrames = 300;
                        let xValues = [
                            ...easing.fast({from: -2, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: 0, to: -2, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        this.currentFrame = 0;
                        let originalX = this.position.x;

                        this.position.x = xValues[this.currentFrame] + originalX
                        
                        this.timer2 = this.regTimerDefault(10, () => {
                            this.position.x = xValues[this.currentFrame] + originalX;

                            this.needRecalcRenderProperties = true;
                            this.currentFrame++;
                            if(this.currentFrame == totalFrames){
                                this.currentFrame = 0;
                            }
                        })

                        this.p = this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            init() {
                                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [40,60], size: this.size, 
                                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'main_car_p'))
                                 });
                
                                this.registerFramesDefaultTimer({
                                    framesEndCallback: () => {
                                        //this.parentScene.capturing.stop = true;
                                    }
                                });
                            }
                        }))
                    }
                }))
            }
        }), 9)

        let createRainFrames = function({framesCount, itemsCount, angleClamps, maxA, lowerYClamps,xClamps, lengthClamps, itemFrameslength, size}) {
            let frames = [];
            
            //let angleValues = easing.fast({from: angleClamps[0], to: angleClamps[1], steps: size.x, type: 'linear', round: 1});
            

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let lowerY = getRandomInt(lowerYClamps);
                let bottomLine = {begin: new V2(-1000, lowerY), end: new V2(1000, lowerY)}
                let x = getRandomInt(xClamps);
                let y = getRandomInt(-lengthClamps[1] -10, -lengthClamps[1])
                let p0 = new V2(x,y);
                let angle = getRandom(angleClamps[0], angleClamps[1])//angleValues[x];
                let p1 = raySegmentIntersectionVector2(p0, V2.down.rotate(angle), bottomLine).toInt();
                let points = appSharedPP.lineV2(p0, p1); 
                let pointsIndexValues = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', round: 0})
                let len = getRandomInt(lengthClamps);

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: f
                    };
                }
            
                return {
                    pointsIndexValues,
                    points,
                    frames,
                    len
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let pointIndex = itemData.pointsIndexValues[itemData.frames[f].index];
                            for(let i = 0; i < itemData.len; i++) {
                                let pi = pointIndex + i;
                                if(pi < itemData.points.length){
                                    let lp = itemData.points[pi];
                                    hlp.setFillColor('rgba(255,255,255,' + maxA + ')').dot(lp);
                                }
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 100, itemsCount: 100, angleClamps: [10,15], maxA: 0.1, 
                    lowerYClamps: [this.size.y-20,this.size.y+5], lengthClamps: [10,15], itemFrameslength: 20, xClamps: [0, 250], size: this.size})

                this.registerFramesDefaultTimer({});
            }
        }), 11)

        this.frontalRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = createRainFrames({ framesCount: 100, itemsCount: 400, angleClamps: [10,13], maxA: 0.05, 
                    lowerYClamps: [this.size.y-40,this.size.y-30], lengthClamps: [8,12], itemFrameslength: 30, xClamps: [0, 250], size: this.size})

                this.registerFramesDefaultTimer({});
            }
        }), 8)
        // this.frontalRain = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.frames = createRainFrames({ framesCount: 100, itemsCount: 20, angleClamps: [15,17], maxA: 0.4, 
        //             lowerYClamps: [this.size.y,this.size.y+20], lengthClamps: [10,15], itemFrameslength: 15, xClamps: [0, 250], size: this.size})

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 12)
    }
}