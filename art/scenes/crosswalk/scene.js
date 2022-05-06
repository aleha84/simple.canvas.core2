class CrosswalkScene extends Scene {
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
                size: new V2(150,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'crosswalk',
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
        let model = CrosswalkScene.models.main;
        let layersData = {};
        let exclude = [
            'palette', 'left_tree_p', 'right_tree_p', 'road_p'
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

        let mainColors = [
            '#f4e4c5',
            '#b6c8bc',
            '#6aa4a3',
            '#478b93',
            '#326a79',
            '#1d495e',
            '#1b3344',
            '#181d2a',
            '#181923',
            '#18141c',
            '#180f16',
            '#180910'
        ]

        let createSnowFallFrames = function({framesCount, itemsCount, colorIndexShift, gradientDots, direction, yClamps, xClamps, bgPixelsData, size}) {
            let frames = [];
            
            let etalonDestination = raySegmentIntersectionVector2(
                new V2(), direction, {begin: new V2(-2*size.x, yClamps[1]), end: new V2(3*size.x, yClamps[1])});

            let deltaPerFrameV2 = etalonDestination.divide(framesCount);

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = framesCount;
            
                let dot = new V2(getRandomInt(xClamps), yClamps[0])

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = dot.add(deltaPerFrameV2.mul(f)).toInt();
                    let a = 0;
                    if(gradientDots[p.y] && gradientDots[p.y][p.x]) 
                        a = fast.r(gradientDots[p.y][p.x].maxValue, 2);
            
                    frames[frameIndex] = {
                        p, a
                    };
                }
            
                return {
                    frames
                }
            })
            


            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let a = itemData.frames[f].a;
                            let p = itemData.frames[f].p;

                            if(a != 0) {
                                //hlp.setFillColor('rgba(255,255,255,' + a + ')').dot(p)
                                let colorIndex = fast.r((mainColors.length-1)*(1-a)) - colorIndexShift
                                
                                let hex = colors.colorTypeConverter({ value: bgPixelsData[p.y][p.x], fromType: 'rgb', toType: 'hex' })
                                let bgColorIndex = mainColors.indexOf(hex);

                                if(colorIndex > bgColorIndex) {
                                    colorIndex = bgColorIndex-1;
                                }

                                if(colorIndex < 0) {
                                    colorIndex = 0;
                                }

                                hlp.setFillColor(mainColors[colorIndex]).dot(p)
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.farSnowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let restrictionLineCornerDots = [new V2(0, 109), new V2(74, 80), new V2(81, 80), new V2(149,110)];
                let sharedPP = PP.createNonDrawingInstance();
                let restrictionLineDots = sharedPP.lineByCornerPoints(restrictionLineCornerDots);
                
                let fadeOutStrength = 6
                let fadeOutValues = easing.fast({from: 1, to: 0, steps: fadeOutStrength, type: 'quad', method: 'out', round: 2});

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(90, 80), radius: new V2(30, 50), gradientOrigin: new V2(77, 80), 
                    angle: 0, //easingType: 'cubic',
                    setter: (dot, aValue) => {
                        let coeff = 0;
                        
                        if(dot.p.x < 0 || dot.p.x > this.size.x) {
                            coeff = 0;
                        }
                        else {
                            let rd = restrictionLineDots.filter(p => p.x == dot.p.x);
                            if(!rd.length) {
                                coeff = 0;
                            }
                            else {
                                if(rd.length > 1) {
                                    rd = rd.reduce((prev,curr) => prev.y < curr.y ? prev : curr)
                                }
                                else {
                                    rd = rd[0]
                                }
                            }
    
                            if(dot.p.y < rd.y) {
                                //coeff = 0;
                                let yDelta = rd.y - dot.p.y;
                                if(yDelta >= fadeOutStrength)
                                    coeff = 0;
                                else {
                                    if(dot.p.x >= 73 && dot.p.x <= 82) {
                                        coeff = 0;
                                    }
                                    else {
                                        coeff = fadeOutValues[yDelta]
                                    }
                                }
                                
                            }
                            else {
                                coeff = 1;
                            }
                        }

                        aValue*= coeff;

                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(255,255,255,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y)
                //                 }
                //             }
                //         }
                //     }
                // })

                let bgPixelsData = getPixelsAsMatrix(PP.createImage(model, {
                    renderOnly: [
                        'bg', 'building', 'far_lamppost', 'road', 'signs', 'left_tree'
                    ]
                }), this.size)

                this.snowflakesLayers = [];
                let yClamps = [70, 140]
                for(let i = 0; i < 6; i++){
                    let rotate = getRandomInt(0,20)//*(i%2==0?-1:1);

                    let xClamps = [-this.size.x, this.size.x];
                    if(rotate > 0){
                        xClamps = [0, this.size.x*2];
                    }

                    let frames = createSnowFallFrames({ framesCount: 200*getRandomInt(2,3), 
                        direction: V2.down.rotate(rotate), itemsCount: 300, xClamps: xClamps, yClamps, 
                        colorIndexShift: 3,
                        gradientDots, size: this.size, bgPixelsData })

                    this.snowflakesLayers.push(this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames,
                        init() {
                            this.registerFramesDefaultTimer({
                                framesChangeCallback: () => {
                                    let foo = true;
                                }
                            });
                        }
                    })))
                }
            }
        }), 
        layersData.far_lamppost.renderIndex+1)

        this.closeSnowFall = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let restrictionLineCornerDots = [new V2(0, 78), new V2(49, 57), new V2(57, 57), new V2(149,90)];
                let sharedPP = PP.createNonDrawingInstance();
                let restrictionLineDots = sharedPP.lineByCornerPoints(restrictionLineCornerDots);
                
                let fadeOutStrength = 10
                let fadeOutValues = easing.fast({from: 1, to: 0, steps: fadeOutStrength, type: 'quad', method: 'out', round: 2});

                let gradientDots = colors.createRadialGradient({ size: this.size.clone(), 
                    center: new V2(54, 100), radius: new V2(60,60), gradientOrigin: new V2(54, 59), 
                    angle: 0, easingType: 'cubic',
                    setter: (dot, aValue) => {
                        let coeff = 0;
                        
                        if(dot.p.x < 0 || dot.p.x > this.size.x) {
                            coeff = 0;
                        }
                        else {
                            let rd = restrictionLineDots.filter(p => p.x == dot.p.x);
                            if(!rd.length) {
                                coeff = 0;
                            }
                            else {
                                if(rd.length > 1) {
                                    rd = rd.reduce((prev,curr) => prev.y < curr.y ? prev : curr)
                                }
                                else {
                                    rd = rd[0]
                                }
                            }
    
                            if(dot.p.y < rd.y) {
                                //coeff = 0;
                                let yDelta = rd.y - dot.p.y;
                                if(yDelta >= fadeOutStrength)
                                    coeff = 0;
                                else {
                                    if(dot.p.x >= 47 && dot.p.x <=59) {
                                        coeff = 0;
                                    }
                                    else {
                                        coeff = fadeOutValues[yDelta]
                                    }
                                }
                                
                            }
                            else {
                                coeff = 1;
                            }
                        }

                        aValue*= coeff;

                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } 
                })

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                //     for(let y = 0; y < gradientDots.length; y++) {
                //         if(gradientDots[y]) {
                //             for(let x = 0; x < gradientDots[y].length; x++) {
                //                 if(gradientDots[y][x]) {
                //                     hlp.setFillColor(`rgba(255,255,255,${fast.r(gradientDots[y][x].maxValue,2)})`).dot(x,y)
                //                 }
                //             }
                //         }
                //     }
                // })

                let bgPixelsData = getPixelsAsMatrix(PP.createImage(model, {
                    renderOnly: [
                        'bg', 'building', 'far_lamppost', 'road', 'signs', 'left_tree'
                    ]
                }), this.size)

                this.snowflakesLayers = [];
                let yClamps = [0, 220]
                for(let i = 0; i < 10; i++){
                    let rotate = getRandomInt(0,25)//*(i%2==0?-1:1);

                    let xClamps = [-this.size.x, this.size.x];
                    if(rotate > 0){
                        xClamps = [0, this.size.x*2];
                    }

                    let frames = createSnowFallFrames({ framesCount: 200*getRandomInt(2,3), 
                        direction: V2.down.rotate(rotate), itemsCount: 150, xClamps: xClamps, yClamps, 
                        colorIndexShift: 4,
                        gradientDots, size: this.size, bgPixelsData })

                    this.snowflakesLayers.push(this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        frames,
                        init() {
                            this.registerFramesDefaultTimer({
                                framesChangeCallback: () => {
                                    let foo = true;
                                }
                            });
                        }
                    })))
                }
            }
        }), 
        layersData.close_lamppost_lamp.renderIndex+1)

        this.left_tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 40, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'left_tree_p'))
                 });

                this.registerFramesDefaultTimer({
                    // framesEndCallback: () => {
                    //     this.parentScene.capturing.stop = true;
                    // }
                });
            }
        }), layersData.left_tree.renderIndex+1)

        this.right_tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 60, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'right_tree_p'))
                 });

                this.registerFramesDefaultTimer({
                    // framesEndCallback: () => {
                    //     this.parentScene.capturing.stop = true;
                    // }
                });
            }
        }), layersData.right_tree.renderIndex+1)

        this.road_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 600, itemFrameslength: 100, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'road_p'))
                 });

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), layersData.road.renderIndex+1)
    }
}