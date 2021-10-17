class Effects3Scene extends Scene {
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
                size: new V2(150,150),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects3',
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
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)

        let center = this.viewport.divide(2).toInt();

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, size, itemFrameslength, boxSize}) {
                let frames = [];
                
                let maxR = 150;
                
                let sharedPP = undefined;
                createCanvas(V2.one, (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })
                
                let henModel = {"general":{"originalSize":{"x":100,"y":100},"size":{"x":100,"y":100},"zoom":3,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"H","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_0","points":[{"point":{"x":15,"y":43},"order":0,"id":"m_0_g_0_p_101"},{"point":{"x":21,"y":43},"order":1,"id":"m_0_g_0_p_102"},{"point":{"x":21,"y":49},"order":2,"id":"m_0_g_0_p_103"},{"point":{"x":22,"y":49},"order":3,"id":"m_0_g_0_p_104"},{"point":{"x":27,"y":49},"order":4,"id":"m_0_g_0_p_105"},{"point":{"x":28,"y":49},"order":5,"id":"m_0_g_0_p_106"},{"point":{"x":28,"y":43},"order":6,"id":"m_0_g_0_p_107"},{"point":{"x":34,"y":43},"order":7,"id":"m_0_g_0_p_108"},{"point":{"x":34,"y":61},"order":8,"id":"m_0_g_0_p_109"},{"point":{"x":28,"y":61},"order":9,"id":"m_0_g_0_p_110"},{"point":{"x":28,"y":55},"order":10,"id":"m_0_g_0_p_111"},{"point":{"x":21,"y":55},"order":11,"id":"m_0_g_0_p_112"},{"point":{"x":21,"y":61},"order":12,"id":"m_0_g_0_p_113"},{"point":{"x":15,"y":61},"order":13,"id":"m_0_g_0_p_114"}]}]},{"order":1,"id":"m_1","name":"E","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_0","points":[{"point":{"x":41,"y":43},"order":0,"id":"m_1_g_0_p_12"},{"point":{"x":59,"y":43},"order":1,"id":"m_1_g_0_p_13"},{"point":{"x":59,"y":48},"order":2,"id":"m_1_g_0_p_14"},{"point":{"x":41,"y":48},"order":3,"id":"m_1_g_0_p_15"}]}]},{"order":2,"id":"m_3","name":"Ew","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_0","points":[{"point":{"x":41,"y":56},"order":0,"id":"m_1_g_0_p_12"},{"point":{"x":59,"y":56},"order":1,"id":"m_1_g_0_p_13"},{"point":{"x":59,"y":61},"order":2,"id":"m_1_g_0_p_14"},{"point":{"x":41,"y":61},"order":3,"id":"m_1_g_0_p_15"}]}]},{"order":3,"id":"m_2","name":"N","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_2_g_0","points":[{"point":{"x":67,"y":61},"order":0,"id":"m_2_g_0_p_10"},{"point":{"x":67,"y":43},"order":1,"id":"m_2_g_0_p_11"},{"point":{"x":85,"y":43},"order":2,"id":"m_2_g_0_p_12"},{"point":{"x":85,"y":61},"order":3,"id":"m_2_g_0_p_13"},{"point":{"x":79,"y":61},"order":4,"id":"m_2_g_0_p_14"},{"point":{"x":79,"y":48},"order":5,"id":"m_2_g_0_p_15"},{"point":{"x":72,"y":48},"order":6,"id":"m_2_g_0_p_16"},{"point":{"x":72,"y":61},"order":7,"id":"m_2_g_0_p_17"}]}]}]}}
                let dots = [];
                henModel.main.layers.forEach(l => {
                    dots = [...dots, ...sharedPP.fillByCornerPoints(l.groups[0].points.map(p => new V2(p.point).add(new V2(0,-2)).mul(2).toInt())).map(p => new V2(p).add(new V2(-25,-25)))]
                })

                //let boxSize = new V2(100,100);
                let shiftToCenter = center.add(new V2(boxSize.divide(-2)));

                let itemsData = dots.map((el, i) => {
                    let startFrameIndex = 0//getRandomInt(0, framesCount-1);
                    let totalFrames1 = getRandomInt(itemFrameslength.flyIn);
                    let totalFrames2 = getRandomInt(itemFrameslength.dealy);
                    let totalFrames3 = getRandomInt(itemFrameslength.flyAway);
                
                    // let row = fast.f(i/columnsCount);
                    // let x = startXShift + i%columnsCount*xShift - row;
                    // let y = startYShift + row*yShift;

                    let p2 = el;//new V2(getRandomInt(0, boxSize.x)+shiftToCenter.x,getRandomInt(0, boxSize.y)+shiftToCenter.y)
                    let direction = p2.direction(center).mul(-1);
                    let p1 = p2.add(direction.mul(getRandomInt(50,100))).toInt() //center.add(V2.up.rotate(getRandomInt(0,359)).mul(maxR)).toInt();
                    let lineDots1 = sharedPP.lineV2(p1, p2);
                    let lineDots2 = sharedPP.lineV2(p2, center);

                    //let midPointIdex = fast.r(lineDots.length*2/5);
                    let vValues1 = easing.fast({from: 0, to: 80, steps: totalFrames1, type: 'quad', method: 'out', round: 0 })
                    let vValues2 = easing.fast({from: 80, to: 0, steps: fast.r(totalFrames1*2/3), type: 'quad', method: 'inOut', round: 0 })
                    let flyInIdicies = easing.fast({from: 0, to: lineDots1.length-1, steps: totalFrames1, type: 'quad', method: 'out', round: 0 })
                    let flyOutIdicies = easing.fast({from: 0, to: lineDots2.length-1, steps: totalFrames3, type: 'sin', method: 'out', round: 0 })

                    let lengthValues = easing.fast({from: 30, to: 2, steps: totalFrames1, type: 'quad', method:'out', round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames1; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frames.length] = {
                            index: flyInIdicies[f],
                            p: lineDots1[flyInIdicies[f]],
                            v: vValues1[f],
                            length: lengthValues[f],
                            // extra: (f >totalFrames1-30) ? {
                            //     p: p2,
                            //     v: 50
                            // } : undefined
                        };
                    }

                    for(let f = 0; f < totalFrames2; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frames.length] = {
                            p: p2,
                            v: 70
                        };
                    }

                    for(let f = 0; f < totalFrames3; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frames.length] = {
                            p: lineDots2[flyOutIdicies[f]],
                            v: vValues2[f] ? vValues2[f]: 0
                        };
                    }
                
                    return {
                        frames,
                        lineDots1
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                if(itemData.frames[f].v == undefined || itemData.frames[f].v == 0) {
                                    continue;
                                }
                                
                                let color = colors.colorTypeConverter({value: {h:1, s:0, v: itemData.frames[f].v}, fromType: 'hsv', toType: 'hex'})

                                if(itemData.frames[f].length != undefined) {
                                    let index = itemData.frames[f].index;

                                    let vChange = easing.fast({from: itemData.frames[f].v, to: 0, steps: itemData.frames[f].length, type: 'linear', round: 0});

                                    for(let l = 1; l < 2; l++) {
                                        let _color = colors.colorTypeConverter({value: {h:1, s:0, v: fast.r(itemData.frames[f].v/(l*2))}, fromType: 'hsv', toType: 'hex'})
                                        let leadingP = itemData.lineDots1[index+l];
                                        if(leadingP)
                                            hlp.setFillColor(_color).dot(leadingP)
                                    }

                                    for(let l = 0; l < itemData.frames[f].length; l++) {
                                        let _index = index - l;
                                        if(index < 0)
                                            break;
    
                                        let p = itemData.lineDots1[_index];
                                        let v = vChange[l];
                                        if(v == undefined)
                                            v = itemData.frames[f].v;

                                        let color = colors.colorTypeConverter({value: {h:1, s:0, v: v}, fromType: 'hsv', toType: 'hex'})
                                        hlp.setFillColor(color).dot(p)
                                    }
                                }
                                else {

                                    hlp.setFillColor(color).dot(itemData.frames[f].p)
                                }

                                // if(itemData.frames[f].extra) {
                                //     //let color1 = colors.colorTypeConverter({value: {h:1, s:0, v: itemData.frames[f].extra.v}, fromType: 'hsv', toType: 'rgb'})
                                //     hlp.setFillColor('rgba(255,255,255,0.5)').dot(itemData.frames[f].extra.p)
                                // }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 150, itemsCount: 300, 
                    itemFrameslength: {
                        flyIn: [40, 50],
                        dealy: [50, 50],
                        flyAway: [45,50]
                    },
                    boxSize: new V2(100,50),
                    size: this.size });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    },
                    framesChangeCallback: () => {
                        let a = true
                    }
                });
            }
        }), 10)

        this.particles1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createPaticlesFrames({framesCount, itemsCount, itemFrameslengthClamps, size, v, lengthClamps}) {
                let frames = [];
                
                let sharedPP = undefined;
                createCanvas(V2.one, (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })


                let method = 'out'

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let p1 = center.add(V2.up.rotate(getRandomInt(0,359)).mul(getRandomInt(150,200)))
                    let linePoints = sharedPP.lineV2(p1, center);

                    
                    let lineIndexChange = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'quad', method, round: 0});
                    let lengthValues = easing.fast({from: getRandomInt(lengthClamps), to: 0, steps: totalFrames, type: 'quad', method, round: 0});
                    let vValues = easing.fast({from: v, to: 0, steps: totalFrames, type: 'quad', method, round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            index: lineIndexChange[f],
                            length: lengthValues[f], 
                            v: vValues[f]
                        };
                    }
                
                    return {
                        frames,
                        linePoints
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let color = colors.colorTypeConverter({value: {h:1, s:0, v: itemData.frames[f].v}, fromType: 'hsv', toType: 'hex'})
                                let index = itemData.frames[f].index;
                                
                                for(let l = 0; l < itemData.frames[f].length; l++) {
                                    let _index = index - l;
                                    if(index < 0)
                                        break;

                                    let p = itemData.linePoints[_index];
                                    hlp.setFillColor(color).dot(p)
                                }
                                
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let params = [
                    { framesCount: 150, itemsCount: 200, itemFrameslengthClamps: [130,150], size: this.size, v: 30, lengthClamps: [5,8] },
                    { framesCount: 150, itemsCount: 100, itemFrameslengthClamps: [100,120], size: this.size, v: 40, lengthClamps: [10,20] },
                    { framesCount: 150, itemsCount: 50, itemFrameslengthClamps: [50,60], size: this.size, v: 60, lengthClamps: [30,40] }]

                this.layers = params.map(p => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createPaticlesFrames(p),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))

                
            }
        }), 5)
    }
}