class Demo10SnowfallScene extends Scene {
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
                viewportSizeMultiplier: 9.6,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'snowfall'
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
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#37547C').rect(0,0,size.x, size.y)
                })
            }
        }), 0)

        let model = Demo10SnowfallScene.models.main;
        let layersData = {};
        let exclude = [
            'p'
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

        this.createSnowFrames = function({framesCount, itemsCount, visibleFramesLength, itemFrameslength, size, angleClamps, opacity, lowerY, v, mask}) {
            console.log(`snow flakes cound: ${itemsCount}`)
            let frames = [];
            let sharedPP = undefined;
            let xClamps = [-size.x/2, size.x*1.5]
            let bottomLine = createLine(new V2(-size.x, lowerY), new V2(size.x*2, lowerY));

            let aValues = [
                ...easing.fast({ from: 0, to: opacity, steps: fast.r(visibleFramesLength/2), type: 'quad', method: 'inOut', round: 2}),
                ...easing.fast({ from: opacity, to: 0, steps: fast.r(visibleFramesLength/2), type: 'quad', method: 'inOut', round: 2})
            ]

            let hsv = colors.colorTypeConverter({value: '#9BACC4', toType:'hsv'})
            hsv.v = v;
            let rgba = colors.colorTypeConverter({value: hsv, toType:'rgb'})

            hsv.v = fast.r(hsv.v*1.5);
            let rgba2 = colors.colorTypeConverter({value: hsv, toType:'rgb'})

            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {

                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = visibleFramesLength;
            
                let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
                let point1 = new V2(getRandomInt(xClamps[0], xClamps[1]), getRandomInt(-20, 0));
                let point2 = new V2(raySegmentIntersectionVector2(point1, direction, bottomLine));

                let linePoints = sharedPP.lineV2(point1, point2);
                let linePointsIndices = easing.fast({ from: 0, to: linePoints.length, steps: itemFrameslength, type: 'linear', round: 0});

                let distance = point1.distance(point2);
                let distancePerFrame = distance/itemFrameslength
                let startVisibleFrame = getRandomInt(0, itemFrameslength-visibleFramesLength);

                let frames = [];

                let doubleV = getRandomInt(0, itemsCount/300) == 0;
                // let doubleVParams = undefined;
                // if(doubleV){
                //     doubleVParams = {

                //     }
                // }

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    //let p = point1.add(direction.mul(distancePerFrame*(startVisibleFrame + f))).toInt()
                    let p = linePoints[linePointsIndices[startVisibleFrame + f]];
                    let a = aValues[f];
                    if(a == undefined)
                        a = 0;

                    if(p != undefined)
                        frames[frameIndex] = {
                            p,
                            a
                        };
                }
            
                return {
                    doubleV,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        let rgb = rgba;
                        //let color = `rgba(${rgba.r},${rgba.g},${rgba.b}, ${itemData.frames[f].a})`;
                        if(itemData.doubleV) {
                            rgb = rgba2;
                            //color = `rgba(${rgba2.r},${rgba2.g},${rgba2.b}, ${itemData.frames[f].a})`;
                        }
                        if(itemData.frames[f]){
                            hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b}, ${itemData.frames[f].a})`)
                                .dot(itemData.frames[f].p)
                            
                        }
                        
                    }

                    if(mask) {
                        ctx.globalCompositeOperation  = 'source-atop'
                        ctx.drawImage(mask, 0,0);
                    }
                });
            }
            
            return frames;
        }

        let mul = 3;
        //9BACC4

        let mask = createCanvas(this.viewport, (ctx, size, hlp) => {
            let gradientDots = colors.createRadialGradient({size, center: new V2(70,75), radius: new V2(40, 20), gradientOrigin: new V2(70,75), angle: 0, });
            let color = colors.colorTypeConverter({value: '#d06211', toType: 'rgb'})
            let shift = new V2();
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
                    
                    hlp.setFillColor(`rgba(${color.r},${color.g},${color.b},${a})`).dot(new V2(x, y).add(shift))
                }
            }
        })

        // this.mask = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     img: mask
        // }), layersData.fg.renderIndex+20)

        this.snowFall1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 500*mul, visibleFramesLength: 75, itemFrameslength: 300,  size: this.size,
                    angleClamps: [-20, -30], opacity: 1, lowerY: this.size.y+20, v: 76
                    })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.fg.renderIndex+10)

        this.snowFall2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 1000*mul, visibleFramesLength: 65, itemFrameslength: 400,  size: this.size,
                    angleClamps: [-20, -25], opacity: 0.7, lowerY: this.size.y, v: 70, mask: mask
                    })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.fg.renderIndex+9)

        this.snowFall4 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 1000*mul, visibleFramesLength: 50, itemFrameslength: 450,  size: this.size,
                    angleClamps: [-20, -25], opacity: 0.7, lowerY: this.size.y-10, v: 65, mask: mask
                    })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.fg.renderIndex+9)

        this.snowFall3 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createSnowFrames({
                    framesCount: 300, itemsCount: 2000*mul, visibleFramesLength: 55, itemFrameslength: 500,  size: this.size,
                    angleClamps: [-10, -15], opacity: 0.7, lowerY: this.size.y/2, v: 55
                    })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+1)

        this.p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: 50, size: this.size, 
                    pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'p')) });
    
                let repeat = 4;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                    }
                });
            }
        }), layersData.mid_d.renderIndex+1)
    }
}