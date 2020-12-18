class ZershushCabinScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'cozy'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = ZershushCabinScene.models.main;
        let layersData = {};
        let exclude = ['fireplace_light', 'bush', 'p1', 'p2', 'forest_p'];

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

            if(layerName == 'upper_lamp') {
                this[layerName].init = function() {
                    // let currentXShift = 0;
                    let originalX = this.position.x;
                    let total = 400;
                    let xValues = [
                        ...easing.fast({ from: -1, to: 1, steps: total/2, type: 'quad', method: 'inOut', round: 0 }),
                        ...easing.fast({ from: 1, to: -1, steps: total/2, type: 'quad', method: 'inOut', round: 0 })
                    ];
                    let current = 0;
                    this.regDefaultTimer(10, () => {
                        // if(currentXShift == 0) {
                        //     currentXShift = -1;
                        // }
                        // else {
                        //     currentXShift = 0;
                        // }

                        let xShift = xValues[current];

                        current++;
                        if(current>= total){
                            current = 0
                        }

                        this.position.x = originalX + xShift;
                        this.needRecalcRenderProperties = true
                    })
                }
            }

            if(layerName == 'cup') {
                    this[layerName].init = function() {
                        this.smoke = this.addChild(new GO({
                            position: new V2(38, 36.5),
                            size: new V2(4, 20),
                            createSmokeFrames({framesCount, itemsCount, size, color}) {
                                let frames = [];
                                if(typeof(color) == 'string')
                                    color = colors.rgbStringToObject({value: color, asObject: true});

                                //let height = size.y;

                                
                                let angleValues = easing.fast({from: 0, to: 359, steps: framesCount, type: 'linear', method: 'base'});

                                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                                    let height = getRandomInt(size.y/3, size.y);
                                    let aValues = easing.fast({from: color.opacity, to: 0, steps: height, type: 'quad', method: 'in'}).map(v => fast.r(v, 1))
                                    return {
                                        height,
                                        aValues,
                                        xShift: getRandomInt(-2,2),
                                        initialAngle: getRandomInt(0,359)//getRandomInt(0, framesCount-1)
                                    }
                                })
                                
                                for(let f = 0; f < framesCount; f++){
                                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                        for(let p = 0; p < itemsCount; p++){
                                            let itemData = itemsData[p];
                                            let initialAngle = itemData.initialAngle + angleValues[f];
                                            if(initialAngle > 360)
                                                initialAngle-=360;
                                            
                                            for(let y = 0; y < itemData.height; y++){
                                                let opacity = itemData.aValues[y];
                                                hlp.setFillColor(colors.rgbToString({value: [color.red, color.green, color.blue, opacity], isObject: false}));
                                                let x = Math.cos(degreeToRadians(  (initialAngle + y*10)*3  )  );
                                                x= fast.r( x + size.x/2) + itemData.xShift;

                                                hlp.dot(x, size.y-y)
                                            }
                                        }
                                    });
                                }

                                return frames.reverse();
                            },
                            init() {
                                this.frames = this.createSmokeFrames({ framesCount: 200, itemsCount: 3, size: this.size, color: 'rgba(151,164,173,0.1)' }) //'rgba(151,164,173,0.5)'
                                this.registerFramesDefaultTimer({});
                            }
                        }))
                    }
                }

            console.log(`${layerName} - ${renderIndex}`)
        }

        this.fireplaceLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createLightFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let baseImages = [];
                let model = ZershushCabinScene.models.fireplace_light;
                for(let i = 0; i < model.main.layers.length; i++){
                    let layer = model.main.layers[i];
                    layer.visible = true;
                    let layerName = layer.name || layer.id;
                    baseImages[baseImages.length] = PP.createImage(model, { renderOnly: [layerName] });
                }

                let frames = [];
                let framesData = [];

                for(let i = 0; i < itemsCount; i++){
                    let startFrameIndex = getRandomInt(
                        framesCount*(i/itemsCount), 
                        (i == itemsCount-1 ? framesCount-1 : framesCount*(i+1)/itemsCount));

                    // let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);
                    //let img = baseImages[getRandomInt(0, baseImages.length-1)];

                    let maxIndex = getRandomInt(1,baseImages.length-1)
                    let fiValues = [
                        ...easing.fast({from: 0, to: maxIndex, steps: totalFrames, type: 'linear', round: 0 }),
                        ...easing.fast({from: maxIndex, to: 0, steps: totalFrames, type: 'linear', round: 0 })
                    ]

                    for(let f = 0; f < totalFrames*2; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        framesData[frameIndex] = baseImages[fiValues[f]]//img;
                    }
                }

                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let img = baseImages[0];
                        
                        if(framesData[f]){
                            img = framesData[f];
                            ctx.drawImage(img, 0,0);
                        }
                        
                    });
                }
                
                return frames;
            },
            init() {
                let repeat = 3;
                this.frames = this.createLightFrames({ framesCount: 200, itemsCount: 10, itemFrameslengthClamps: [10, 15], size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });
            }
        }), layersData.fireplace.renderIndex+1)

        this.fireplace = this.addGo(new GO({
            position: new V2(154, 82),
            size: new V2(60,32),
            init() {
                this.frames = PP.createImage(ZershushCabinScene.models.fire)

                this.registerFramesDefaultTimer({originFrameChangeDelay:6});
            }
        }), layersData.fireplace.renderIndex+2)

        let curtainsSize = new V2(145,60);
        let curtainsFrames = PP.createImage(ZershushCabinScene.models.curtains).map(frame => createCanvas(curtainsSize, (ctx, size, hlp) => {
            ctx.globalAlpha = 0.5
            ctx.drawImage(frame, 0 ,0)
        }))

        let curtainsFrameChangeDelay  = 10

        this.curtainsRight = this.addGo(new GO({
            position: new V2(58.5 + 2,67),
            size: new V2(curtainsSize.x-24, curtainsSize.y),
            init() {
                this.frames = curtainsFrames

                this.registerFramesDefaultTimer({originFrameChangeDelay:curtainsFrameChangeDelay});
            }
        }), layersData.ceiling_d.renderIndex + 1)

        this.curtainsLeft = this.addGo(new GO({
            position: new V2(0.5,67),
            size: curtainsSize,
            init() {
                this.frames = curtainsFrames
                this.registerFramesDefaultTimer({originFrameChangeDelay:curtainsFrameChangeDelay, startFrameIndex: 15});
            }
        }), layersData.ceiling_d.renderIndex + 1)

        this.rain = this.addGo(new GO({
            position: new V2(33,62),
            size: new V2(70,40),
            createRainFrames({framesCount, size, itemsCount, itemFrameslength, dropLengthOrigignal, xShift, maxA, lowerY}) {
                let frames = [];
                let sharedPP;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })

                // let dropLengthClamps = [12,14];
                // let xShiftClamp = [-10, -8];
                // let maxA = 0.5

                if(!lowerY) {
                    lowerY = size.y
                }

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = itemFrameslength//getRandomInt(itemFrameslengthClamps[0], itemFrameslengthClamps[1]);

                    let x = getRandomInt(0, size.x + 20);
                    let dropLength = dropLengthOrigignal + getRandomInt(-1,1);

                    let oFirstPart = fast.r(dropLength/4);
                    let oValues = [
                        ...easing.fast({from: 0, to: maxA, steps: oFirstPart, type: 'quad', method: 'out', round: 2}),
                        ...easing.fast({from: maxA, to: 0, steps: dropLength-oFirstPart, type: 'quad', method: 'out', round: 2})
                    ]

                    //let xShift = getRandomInt(xShiftClamp[0], xShiftClamp[1])
                    let startY = getRandomInt(-2*dropLength, -dropLength);
                    let target = new V2(x+xShift, lowerY + getRandomInt(-2, 2) );
                    let points = sharedPP.lineV2(new V2(x, startY), target);
                    let pointIndexes = easing.fast({from: 0, to: points.length-1, steps: totalFrames, type: 'linear', method: 'base', round: 0});

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            pointIndex: pointIndexes[f]
                        };
                    }
                
                    return {
                        oValues,
                        dropLength,
                        points, 
                        pointIndexes,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let {points, 
                                    pointIndexes,
                                    frames,
                                    dropLength,
                                    oValues} = itemData;

                                let prevPoint = undefined;
                                for(let i =0; i < dropLength; i++){
                                    let index = frames[f].pointIndex - i;
                                    if(index < 0)
                                        break;

                                    let point = points[index];
                                    let oValue = oValues[i];
                                    if(oValue < 0 || Number.isNaN(oValue))
                                        oValue = 0;

                                    //console.log(oValue)
                                    hlp.setFillColor(`rgba(185,185,185, ${oValue})`).dot(point.x, point.y);

                                    if(prevPoint && prevPoint.x != point.x){
                                        hlp.setFillColor(`rgba(185,185,185, ${oValue/2})`)
                                            .dot(point.x-1, point.y).dot(point.x, point.y+1);
                                    }

                                    prevPoint = point;
                                }
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let rainLayersCount = 4;
                let itemsCounts = easing.fast({ from: 400, to: 40, steps: rainLayersCount, type: 'quad', method: 'in', round: 0});
                let itemFrameslengths = easing.fast({ from: 40, to: 16, steps: rainLayersCount, type: 'quad', method: 'in', round: 0});
                let dropLengths = easing.fast({ from: 8, to: 20, steps: rainLayersCount, type: 'quad', method: 'in', round: 0});
                let xShifts = easing.fast({ from: -10, to: -12, steps: rainLayersCount, type: 'linear', method: 'base', round: 0});
                let maxAs = easing.fast({ from: 0.2, to: 0.7, steps: rainLayersCount, type: 'linear', method: 'base', round: 1});

                let layers = new Array(rainLayersCount).fill().map((el,i) => ({
                    itemsCount: itemsCounts[i], 
                    itemFrameslength: itemFrameslengths[i], 
                    dropLength: dropLengths[i], 
                    xShift: xShifts[i],
                    maxA: maxAs[i]
                }))

                // layers[0].lowerY = 20;

                // layers[1].lowerY = 30;
//.filter((el, i) => i == 2)
                this.rainLayers = layers.map(layer => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createRainFrames({ 
                        size: this.size, 
                        framesCount: 100, 
                        itemsCount: layer.itemsCount,
                        itemFrameslength: layer.itemFrameslength,
                        dropLengthOrigignal: layer.dropLength, 
                        xShift: layer.xShift, 
                        maxA: layer.maxA,
                        lowerY: layer.lowerY }),
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                })))

                //this.frames = this.createRainFrames({ framesCount: 200, itemsCount: 200, itemFrameslengthClamps: [5, 10], size: this.size })
                //this.registerFramesDefaultTimer({});
            }
        }), layersData.window_view.renderIndex+1)


        this.bush = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(ZershushCabinScene.models.bushFrames2),
            init() {

                this.registerFramesDefaultTimer({originFrameChangeDelay:20});
            }
        }), layersData.bush.renderIndex)

        this.p1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 25, size: this.size, 
                    pointsData: animationHelpers.extractPointData(ZershushCabinScene.models.main.main.layers.find(l => l.name == 'p1')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.p1.renderIndex)

        this.p2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 25, size: this.size, 
                    pointsData: animationHelpers.extractPointData(ZershushCabinScene.models.main.main.layers.find(l => l.name == 'p2')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.p2.renderIndex)

        this.forest_p1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(ZershushCabinScene.models.main.main.layers.find(l => l.name == 'forest_p')) });
    
                this.registerFramesDefaultTimer({});
            }
        }), layersData.window_view.renderIndex+1)

        // this.lustra = this.addGo(new GO({
        //     position: new V2(0, 20),
        //     size: new V2(85,48),
        //     init() {
        //         this.img = PP.createImage(ZershushCabinScene.models.lustra)
        //     }
        // }), layersData.p1.renderIndex-1)
    }
}