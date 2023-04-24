class WinterComfortScene extends Scene {
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
                size: new V2(600,600),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'winterComfort',
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
        let totalFrames = 300;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(WinterComfortScene.models.main, { renderOnly: ['bg'] })
        }), 1)

        let mainImg = PP.createImage(WinterComfortScene.models.main, { exclude: ['bg','reflection','windows_p'] });

        this.upperPart = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = mainImg

                this.windows_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames/2, itemFrameslength: 40, size: this.size, 
                            pointsData: animationHelpers.extractPointData(WinterComfortScene.models.main.main.layers.find(l => l.name == 'windows_p')) });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.trees_p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pp;
                        createCanvas(new V2(1,1), (ctx, size, hlp) => {
                            pp = new PP({ctx});
                        })
                        let treesDots = pp.fillByCornerPoints(
                            animationHelpers.extractPointData(WinterComfortScene.models.main.main.layers.find(l => l.name == 'trees_zone')).map(pd => pd.point)
                        )

                        let pDataRot = [];
                        let pixelsDataMatrix = getPixelsAsMatrix(mainImg, this.size);

                        treesDots.forEach(td => {
                            
                                let pRow = pixelsDataMatrix[td.y];
                                if(pRow) {
                                    let pColor = pRow[td.x];
                                    if(pColor) {
                                        if(getRandomInt(0, 5) == 0) {
                                            let color = colors.colorTypeConverter({ value: { r: pColor[0],g: pColor[1],b: pColor[2] }, fromType: 'rgb', toType: 'hex'  });
                                            pDataRot[pDataRot.length] = { point: { x: td.x + getRandomInt(-1,1), y: td.y + getRandomInt(-1,1)}, color } 
                                        }
                                    }
                                }
                                
                            
                        })

                        this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames, pointsData: pDataRot, itemFrameslength: 60, size: this.size })
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.treeMovement = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createMovementFrames({framesCount, itemsCount, itemFrameslength, size}) {
                        let frames = [];
                        let images = [];

                        itemsCount = WinterComfortScene.models.treeMovementLayers.main.layers.length;

                        for(let i = 0; i < itemsCount; i++) {
                            images[i] = PP.createImage(WinterComfortScene.models.treeMovementLayers, { renderOnly: ['l' + i] })
                        }
                        
                        let itemsData = new Array(itemsCount).fill().map((el, i) => {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = itemFrameslength;
                        
                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = true;
                            }
                        
                            return {
                                img: images[i],
                                frames
                            }
                        })
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        ctx.drawImage(itemData.img, 0, 0);
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createMovementFrames({ framesCount: totalFrames, itemsCount: 7, itemFrameslength: 30, size: this.size });
                        this.registerFramesDefaultTimer({});
                    }
                }));
            }
        }), 20)

        this.reflection = this.addGo(new GO({
            position: this.sceneCenter.add(new V2()),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.translate(0, size.y + 70);
                    ctx.scale(1, -1);
                    ctx.drawImage(mainImg, 0, 0);

                    hlp.setFillColor('rgba(6,19,53,0.5').rect(0,0,size.x, size.y)
                })

                this.ripples = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    createRippleFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                        let frames = [];
                        
                        let upperY = 138;
                        let lowerY = size.y;
                        let height = lowerY-upperY;

                        let pixels = getPixelsAsMatrix(this.parent.img, this.size);

                        let minWidthToYValues = easing.fast({ from: 2, to: 6, steps: height, type: 'linear', round: 0});
                        let maxWidthToYValues = easing.fast({ from: 3, to: 12, steps: height, type: 'linear', round: 0});
                        let inittialXShiftValues = easing.fast({ from: 1, to: 4, steps: height, type: 'linear', round: 0});
                        let xChangeToYValues = easing.fast({ from: 2, to: 6, steps: height, type: 'linear', round: 0});

                        let itemsData = [];

                        let createItemData = function(x,y, current) {
                            let startFrameIndex = getRandomInt(0, framesCount-1);
                            let totalFrames = getRandomInt(itemFrameslengthClamps);

                            let type = getRandomInt(0,3);
                            let relativeHeight = y-upperY;

                            let fromWidth = undefined;
                            let targetWidth = undefined;
                            let widthValues = undefined;

                            if(type == 0 || type == 2) {
                                fromWidth = 0;
                                targetWidth = getRandomInt(minWidthToYValues[relativeHeight], maxWidthToYValues[relativeHeight]);
                            }

                            if(type == 1 || type == 3) {
                                fromWidth = getRandomInt(minWidthToYValues[relativeHeight], maxWidthToYValues[relativeHeight]);
                                targetWidth = 0;
                            }

                            let xChangeValues = undefined;

                            if(type == 2 || type == 3) {
                                let targetXChange = xChangeToYValues[relativeHeight]*(getRandomBool() ? 1 : -1);
                                xChangeValues = easing.fast({from: 0, to: targetXChange, steps: totalFrames, type: 'linear'})
                            }

                            let inittialXShift = getRandomInt(-inittialXShiftValues[relativeHeight], inittialXShiftValues[relativeHeight]);

                            widthValues = easing.fast({from: fromWidth, to: targetWidth, steps: totalFrames, type: 'quad', method: 'inOut'})

                            let frames = [];
                            for(let f = 0; f < totalFrames; f++){
                                let frameIndex = f + startFrameIndex;
                                if(frameIndex > (framesCount-1)){
                                    frameIndex-=framesCount;
                                }
                        
                                frames[frameIndex] = {
                                    width: widthValues[f],
                                    xChange: xChangeValues ? xChangeValues[f] : 0,
                                };
                            }

                            return {
                                color: `rgba(${current[0]}, ${current[1]},${current[2]},1)`,
                                p: {x: x + inittialXShift, y},
                                frames
                            };
                        }


                        let prev = undefined;
                        for(let y = 0; y < pixels.length; y++) {
                            if(y < upperY) 
                                continue; 

                            prev = undefined;
                            for(let x = 0; x < pixels[y].length; x++) {
                                let current = pixels[y][x];
    
                                if(x == 0) {
                                    prev = current;
                                    continue;
                                }
    
                                if(current[0] != prev[0] && current[1] != prev[1] && current[2] != prev[2]) {

                                    if(getRandomInt(0, 2) < 1)
                                        continue;

                                    itemsData.push(createItemData(x,y,current));
                                }
                            }
                        }

                        for(let i = 0; i < 20; i++) {
                            itemsData.push(createItemData(59 + getRandomInt(-4,4),141 + getRandomInt(-1,1),[71, 90, 124]));
                        }

                        for(let i = 0; i < 5; i++) {
                            itemsData.push(createItemData(60 + getRandomInt(-5,5),146 + getRandomInt(0,1),[89, 103, 126]));
                        }
                        
                        // itemsData.push(createItemData(58,141,[71, 90, 124]));
                        // itemsData.push(createItemData(57,140,[71, 90, 124]));

                        itemsData.push(createItemData(63,166,[52,77,122]));
                        itemsData.push(createItemData(57,166,[52,77,122]));
                        itemsData.push(createItemData(68,167,[52,77,122]));
                        itemsData.push(createItemData(75,167,[52,77,122]));

                        itemsData.push(createItemData(10,170,[52,77,122]));
                        itemsData.push(createItemData(17,171,[52,77,122]));
                        itemsData.push(createItemData(22,172,[52,77,122]));

                        itemsData.push(createItemData(125,147,[52,77,122]));
                        itemsData.push(createItemData(129,148,[52,77,122]));

                        for(let i = 0; i < 20; i++) {
                            itemsData.push(createItemData(getRandomInt(0, size.x),138,[26,48,90]));
                        }

                        for(let i = 0; i < 10; i++) {
                            itemsData.push(createItemData(getRandomInt(0, size.x),139,[26,48,90]));
                        }

                        itemsData.push(createItemData(68,164,[26,48,90]));
                        
                        for(let f = 0; f < framesCount; f++){
                            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                                for(let p = 0; p < itemsData.length; p++){
                                    let itemData = itemsData[p];
                                    
                                    if(itemData.frames[f]){
                                        let width = itemData.frames[f].width;
                                        if(width > 0){
                                            let xShift = fast.r(itemData.frames[f].xChange + width/2);
                                            let x = fast.r(itemData.p.x-xShift)
                                            hlp.setFillColor(itemData.color).rect(x, itemData.p.y, width, 1)
                                        }
                                    }
                                    
                                }
                            });
                        }
                        
                        return frames;
                    },
                    init() {
                        this.frames = this.createRippleFrames({ framesCount: totalFrames, itemFrameslengthClamps: [50,80], size: this.size });
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 10)
    }
}