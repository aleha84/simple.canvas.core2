class PixelRedCatTree extends Scene {
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
                fileNamePrefix: 'pra_tree'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){

        this.createFallingParticlesFrames = function({framesCount, itemsCount, itemFrameslength, size, color}) {
            let frames = [];
            let hsv = colors.colorTypeConverter({value: color, toType: 'hsv', fromType: 'hex'});

            let yValues = easing.fast({ from: 0, to: 140, steps: framesCount, type: 'linear', round: 0 });

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                //let visibilityStart = getRandomInt(0, framesCount-1);
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = framesCount;
                let x = getRandomInt(50, 150);

                let frames = [];
                let a = getRandomInt(20,40);
                let b = getRandomInt(5,20);
                let c = getRandomInt(0, 100);

                let xShiftFun = (y) => Math.sin((y-c)/a)*b;

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        xShift: fast.r(xShiftFun(yValues[f])),
                        y: yValues[f]
                    };
                }

                let visibleCount = getRandomInt(1,2);
                for(let j = 0; j < visibleCount;j++){ 
                    let initialVisibleFrame = getRandomInt(0, framesCount-1);
                    let visibleLength = getRandomInt(itemFrameslength[0], itemFrameslength[1]);

                    let vValues = [
                        ...easing.fast({ from: hsv.v-40, to: hsv.v+20, steps: fast.r(visibleLength/2), type: 'quad', method: 'out', round: 0 }),
                        ...easing.fast({ from: hsv.v+20, to: hsv.v-40, steps: fast.r(visibleLength/2), type: 'quad', method: 'in', round: 0 })
                    ]

                    for(let k = 0; k < visibleLength; k++){
                        let frameIndex = initialVisibleFrame+k;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let v = vValues[k];
                        if(v == undefined){
                            v = hsv.v-20
                        }

                        frames[frameIndex].visible = true;
                        frames[frameIndex].v = v;
                    }
                }
            
                return {
                    x,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f] && itemData.frames[f].visible){
                            hlp.setFillColor(colors.colorTypeConverter({value: { h: hsv.h, s: hsv.s, v: itemData.frames[f].v }, toType: 'hex', fromType: 'hsv'}));
                            //.setFillColor(color)
                            hlp.dot(itemData.x + itemData.frames[f].xShift, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('#192117').rect(0,0,size.x, size.y);
            }),
            init() {
                this.gradient = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createGrad(hlp, yClamp, xClamp, c1, c2, extraV = 0) {
                        let hsv1 = colors.colorTypeConverter({value: c1, toType: 'hsv', fromType: 'hex'});
                        let hsv2 = colors.colorTypeConverter({value: c2, toType: 'hsv', fromType: 'hex'});

                        let type = 'quad';
                        let method = 'out'

                        //let yClamp = [0, 100];
                        //let xClamp = [50, 150];

                        let width = xClamp[1] - xClamp[0];
                        let height = yClamp[1] - yClamp[0]

                        let hValues = easing.fast({from: hsv1.h, to: hsv2.h, steps: height, type, method, round: 0})
                        let sValues = easing.fast({from: hsv1.s, to: hsv2.s, steps: height, type, method, round: 0})
                        let vValues = easing.fast({from: hsv1.v, to: hsv2.v, steps: height, type, method, round: 0})

                        
                        let prevH = hValues[0], prevS = sValues[0], prevV = vValues[0];
                        for(let y = 0; y < height; y++){
                            let _y = fast.r(y/10)*10;

                            let hex = colors.colorTypeConverter({value: { h: hValues[_y], s: sValues[_y], v: (vValues[_y] + extraV) }, toType: 'hex', fromType: 'hsv'});
                            hlp.setFillColor(hex).rect(xClamp[0], y, width, 1);

                            if(prevH!= undefined &&
                                prevH != hValues[_y] && prevS != sValues[_y] && prevV != vValues[_y]) {
                                    for(let i = 1; i < 5; i++){
                                        for(let x = 0; x < width; x++){
                                            let shift = (i %2 == 0);
                                            if((shift && x % 2 != 0) || (!shift && x%2 == 0)){
                                                hlp.dot(x+xClamp[0], y-i);
                                            }
                                        }
                                    }
                                    
                                    prevH = hValues[_y];
                                    prevS = sValues[_y];
                                    prevV = vValues[_y];
                                }
                        }

                        hlp.setFillColor(colors.colorTypeConverter({value: { h: hValues[height-1], s: sValues[height-1], v: (vValues[height-1] + extraV) }, toType: 'hex', fromType: 'hsv'}));
                        for(let i = 1; i < 5; i++){
                            for(let x = 0; x < width; x++){
                                let shift = (i %2 == 0);
                                if((shift && x % 2 != 0) || (!shift && x%2 == 0)){
                                    hlp.dot(x+xClamp[0], yClamp[1]-i);
                                }
                            }
                        }

                    },
                    createGrad1(hlp, radius, center) {
                        let hsv1 = colors.colorTypeConverter({value: '#555842', toType: 'hsv', fromType: 'hex'});
                        let hsv2 = colors.colorTypeConverter({value: '#192117', toType: 'hsv', fromType: 'hex'});

                        let steps = 100;
                        let type = 'sin';
                        let method = 'out'

                        let hValues = easing.fast({from: hsv1.h, to: hsv2.h, steps, type, method, round: 0})
                        let sValues = easing.fast({from: hsv1.s, to: hsv2.s, steps, type, method, round: 0})
                        let vValues = easing.fast({from: hsv1.v, to: hsv2.v, steps, type, method, round: 0})

                        

                        // let radius = { x: 60, y: 120 }
                        // let center = new V2(100, 0);

                        let rxSq = radius.x*radius.x;
                        let rySq = radius.y*radius.y;

                        for(let y = center.y-radius.y-1;y < center.y+radius.y+1;y++){
                            for(let x = center.x-radius.x-1;x < center.x+radius.x+1;x++){
                                let d = (( (x-center.x)*(x-center.x) )/(rxSq)  + ( (y-center.y)*(y-center.y)  )/(rySq));
                                if(d < 1){

                                    let d100 = fast.r(fast.r(d*100)/15)*15;
                                    let hex = colors.colorTypeConverter({value: { h: hValues[d100], s: sValues[d100], v: (vValues[d100]) }, toType: 'hex', fromType: 'hsv'});
                                    //if(x%2 == 0 && y%2!= 0)
                                        hlp.setFillColor(hex).dot(x,y)
                                    
                                }
                            }
                        }
                    },
                    createGradFrames({framesCount, size, cyClamp, ryClamp}) {
                        
                        let frames = [];
                        let cyValues = [
                            ...easing.fast({ from: cyClamp[0], to: cyClamp[1], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 }),
                            ...easing.fast({ from: cyClamp[1], to: cyClamp[0], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 })
                        ]

                        let ryValues = [
                            ...easing.fast({ from: ryClamp[0], to: ryClamp[1], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 }),
                            ...easing.fast({ from: ryClamp[1], to: ryClamp[0], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 })
                        ]
                        
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                this.createGrad1(hlp, { x: 60, y: ryValues[f] }, new V2(100, cyValues[f]) )
                            });
                        }
                        
                        return frames;
                    },
                    createGradFrames2({framesCount, size, yClamp}) {
                        
                        let frames = [];

                        let yLower = [
                            // ...easing.fast({ from: yClamp[0], to: yClamp[1], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 }),
                            // ...easing.fast({ from: yClamp[1], to: yClamp[0], steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 })
                            ...easing.fast({ from: -5, to: 0, steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 }),
                            ...easing.fast({ from: 0, to: -5, steps: fast.r(framesCount/2), type: 'sin', method: 'inOut', round: 0 })
                        ]

                        let h = 50;
                        
                        let baseImg = createCanvas(size, (ctx, size, hlp) => {
                            this.createGrad(hlp, [0,50], [50, 150], '#555842','#192117')
                            let rgb = colors.colorTypeConverter({value: '#192117', toType: 'rgb', fromType: 'hex'});
                            
                            rgb.opacity = 0.2;
                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 1, h);
                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(149, 0, 1, h);

                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 5, h);
                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(145, 0, 5, h);

                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 15, h);
                            hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(135, 0, 15, h);
                        });

                        for(let f = 0; f < framesCount; f++){
                            
                            frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(baseImg, 0, yLower[f])
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        // this.frames = this.createGradFrames({ framesCount: 200, size: this.size, cyClamp: [-10, -20], ryClamp: [130, 140] })
                        // this.registerFramesDefaultTimer({});

                        this.frames = this.createGradFrames2({ framesCount: 200, size: this.size, yClamp: [50, 70] })
                        this.registerFramesDefaultTimer({});
                        
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     this.createGrad(hlp, [0,50], [50, 150], '#555842','#192117')

                        //     let rgb = colors.colorTypeConverter({value: '#192117', toType: 'rgb', fromType: 'hex'});
                        //     rgb.opacity = 0.2;
                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 1, 50);
                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(149, 0, 1, 50);

                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 5, 50);
                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(144, 0, 5, 50);

                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(50, 0, 15, 50);
                        //     hlp.setFillColor(colors.rgbToString({ value: rgb, isObject: true })).rect(134, 0, 15, 50);
                        // })
                    }
                }))
            }
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(PixelRedCatTree.models.main),
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(PixelRedCatTree.models.main.main.layers.find(l => l.name == 'p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.fallingParticles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createFallingParticlesFrames({framesCount: 400, itemsCount: 10, itemFrameslength: [100,200], size: this.viewport, color: '#B2B189'}), 
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.fallingParticles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createFallingParticlesFrames({framesCount: 400, itemsCount: 10, itemFrameslength: [100,200], size: this.viewport, color: '#B2B189'}), 
            init() {
                let repeat = 5;
                this.registerFramesDefaultTimer({framesEndCallback: () => { 
                    repeat--;
                    if(repeat == 0)
                        this.parentScene.capturing.stop = true; 
                    } });
            }
        }), 15)

        this.createLightPathFrames = function({framesCount, itemsCount, itemFrameslength, size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let x = getRandomInt(50, 100);
                let width = getRandomInt(5,10);

                // let img = createCanvas(size, (ctx, size, hlp) => {
                //     let pp = new PP({ctx});
                //     pp.setFillStyle('#555842');
                //     pp.fillByCornerPoints([new V2(x,0), new V2(x+width,0), new V2(x+width+25,150), new V2(x+25, 150)])
                // })

                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength[0], itemFrameslength[1]);
            
                let frames = [];

                let halfFrames = fast.r(totalFrames/2);
                let wChange1 = easing.fast({ from: 1, to: width, steps: halfFrames, type: 'quad', method: 'out', round: 0 })
                let wChange2 = easing.fast({ from: width, to: 1, steps: halfFrames, type: 'quad', method: 'in', round: 0 })

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let _width = 1;
                    let _x = x;
                    if(f < halfFrames){
                        _width = wChange1[f];
                    }
                    else {
                        _width = wChange2[f-halfFrames];
                        _x = x+width-_width;
                    }
            
                    frames[frameIndex] = {
                        width: _width,
                        x: _x,
                        visible: true
                    };
                }
            
                return {
                    //img,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    pp.setFillStyle('#555842');
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f] && itemData.frames[f].visible){
                            //ctx.drawImage(itemData.img, 0,0);
                            pp.fillByCornerPoints([
                                new V2(itemData.frames[f].x,0), 
                                new V2(itemData.frames[f].x+itemData.frames[f].width,0), 
                                new V2(itemData.frames[f].x+itemData.frames[f].width+25,150), 
                                new V2(itemData.frames[f].x+25, 150)])
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.lightPath = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                
            }
        }), 2)

        this.sign = this.addGo(new GO({
            position: new V2(100, 175),
            size: new V2(96,20),
            createPixelFrames({framesCount, size}) {
                let points = animationHelpers.extractPointData(PixelRedCatTree.models.sign.main.layers.find(l => l.id == 'm_0'));
                let width = 96;

                let frames = [];
                //let half = framesCount/2;
                let xValues = easing.fast({ from: 0, to: width, steps: framesCount, type: 'linear', round: 0 });
                
                let upDownCount = 40;

                let yShifts = [
                    ...easing.fast({ from: 0, to: -2, steps: upDownCount/2, type: 'quad', method: 'out', round: 0 }),
                    ...easing.fast({ from: -2, to: 0, steps: upDownCount/2, type: 'quad', method: 'in', round: 0 })
                ]
                
                let itemsData = points.map(p => {
                    let point = new V2(p.point);
                    let frames = new Array(framesCount).fill(0);

                    let startFrom = -1;
                    for(let i = 0; i < framesCount; i++){
                        if(point.x < xValues[i]){
                            startFrom = i;
                            break;
                        }
                    }

                    for(let i = 0; i < upDownCount; i++){
                        let frameIndex = startFrom+i;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                        frames[frameIndex] = yShifts[i];
                    }

                    return {
                        point,
                        frames
                    }
                })


                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('#6f392d');
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            hlp.dot(itemData.point.x, itemData.point.y + itemData.frames[f])
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createPixelFrames({ framesCount: 100, size: this.size });
                this.registerFramesDefaultTimer({});
            }
        }), 10)
    }
}