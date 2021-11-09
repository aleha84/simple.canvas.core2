class LakeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = LakeScene.models.main;

        this.sky = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['sky'] })
            }
        }), 1)

        this.water = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['water'] })

                // this.wLayers = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     img: PP.createImage(model, { renderOnly: ['water_layers'] })
                // }))

                let createRippleFrames = function({framesCount, yClamps, itemFrameslengthClamps, size, pointsData, 
                    minWidthClamps, maxWidthClamps, yChangeClamps, initialXShiftClamps, xChangeClamps}) {
                    let frames = [];
                    
                    let upperY = yClamps[0];
                    let lowerY = yClamps[1];
                    
                    let height = lowerY-upperY;

                    //let pixels = getPixelsAsMatrix(this.parentScene.sea.img, this.size);

                    let minWidthToYValues = easing.fast({ from: minWidthClamps[0], to: minWidthClamps[1], steps: height, type: 'linear', round: 0});
                    let maxWidthToYValues = easing.fast({ from: maxWidthClamps[0], to: maxWidthClamps[1], steps: height, type: 'linear', round: 0});
                    let inittialXShiftValues = easing.fast({ from: initialXShiftClamps[0], to: initialXShiftClamps[1], steps: height, type: 'linear', round: 0});
                    let xChangeToYValues = easing.fast({ from: xChangeClamps[0], to: xChangeClamps[1], steps: height, type: 'linear', round: 0});
                    let yChangeToYValues = easing.fast({ from: yChangeClamps[0], to: yChangeClamps[1], steps: height, type: 'linear', round: 0});

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
                        let yChangeValues = easing.fast({from: 0, to: yChangeToYValues[relativeHeight], steps: totalFrames, type: 'linear', round: 0})

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
                                yChange: yChangeValues ? yChangeValues[f] : 0
                            };
                        }

                        return {
                            color: `rgba(${current.r}, ${current.g},${current.b},1)`,
                            p: {x: x + inittialXShift, y},
                            frames
                        };
                    }

                    let hexRgbMap = {};

                    pointsData.forEach(pd => {

                        let rgb = hexRgbMap[pd.color];
                        if(!rgb) {
                            rgb = colors.colorTypeConverter({ value: pd.color, fromType: 'hex', toType: 'rgb' });
                            //rgb = [rgbObj.r, rgbObj.g, rgbObj.b];
                            hexRgbMap[pd.color] = rgb
                        }

                        itemsData.push(createItemData(pd.point.x, pd.point.y, rgb));
                    });
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    let width = itemData.frames[f].width;
                                    if(width > 0){
                                        let xShift = fast.r(itemData.frames[f].xChange + width/2);
                                        let x = fast.r(itemData.p.x-xShift)
                                        hlp.setFillColor(itemData.color).rect(x, itemData.p.y + itemData.frames[f].yChange, width, 1)
                                    }
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                }

                this.ripples = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    
                    init() {
                        this.frames = createRippleFrames({
                            framesCount: 150, itemFrameslengthClamps: [80,120], size: this.size, yClamps: [111,199],
                            minWidthClamps: [1,10], maxWidthClamps: [2, 20],
                            yChangeClamps: [0, 3],
                            initialXShiftClamps: [1,4],
                            xChangeClamps: [2,6],
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'water_p'))
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.ripples1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    
                    init() {
                        this.frames = createRippleFrames({
                            framesCount: 150, itemFrameslengthClamps: [80,120], size: this.size, yClamps: [126,164],
                            minWidthClamps: [1,1], maxWidthClamps: [2, 2],
                            yChangeClamps: [0, 3],
                            initialXShiftClamps: [1,2],
                            xChangeClamps: [0,1],
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'water_p1'))
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 5)

        this.far = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['far'] })
            }
        }), 15)

        this.bridge = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = PP.createImage(model, { renderOnly: ['bridge'] })
            }
        }), 20)

        let framesCount = 150;
        let targetColors = ['#cb7679', '#994556', '#da9faa'];
        let branchesData = [{
            layerName: 'branches_01',
            isLeft: true,
        }, {
            layerName: 'branches_02',
            isLeft: false,
        },{
            layerName: 'branches_03',
            isLeft: false,
        },{
            layerName: 'branches_04',
            isLeft:true,
        }, {
            layerName: 'branches_05',
            isLeft:true,
        }, {
            layerName: 'branches_06',
            isLeft:false,
        }, {
            layerName: 'branches_07',
            isLeft:true,
        },{
            layerName: 'branches_08',
            isLeft:true,
        },{
            layerName: 'branches_09',
            isLeft:false,
        }]

        this.branches = branchesData.map((bd, i) => 
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let img = PP.createImage(model, { renderOnly: [bd.layerName] });
                let pixelsData = getPixels(img, this.size);

                let imgMovementStartFrameIndex = getRandomInt(0, framesCount-1);
                let imgMovementFramesLength = getRandomInt(framesCount, framesCount*2/3);
                let imgMovement = getRandomBool() 
                ? [new V2(0,0), new V2(0,1)]  
                :  [new V2(0,0), new V2(1 * (bd.isLeft ? -1 : 1),0)] 
                // bd.isLeft 
                // ? [new V2(0,0), new V2(-1,0), new V2(-1,1), new V2(0,1)] 
                // : [new V2(0,0), new V2(1,0), new V2(1,1), new V2(0,1)];

                // let 

                let imgMovementIndices = easing.fast({from: 0, to: imgMovement.length-1, steps: imgMovementFramesLength, type: 'linear', round: 0})

                let imgMovenetFrameData = [];
                for(let f = 0; f < imgMovementFramesLength; f++) {
                    let frameIndex = f + imgMovementStartFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    imgMovenetFrameData[frameIndex] = imgMovementIndices[f];
                }

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 3) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.add(new V2(getRandomInt(-1,1), getRandomInt(-1,1))), color } 
                        }
                    }
                });

                let pframes = animationHelpers.createMovementFrames({ framesCount: 150, pointsData: pData, itemFrameslength: 120, size: this.size })
                this.frames = new Array(framesCount).fill().map((el, i) => createCanvas(this.size, (ctx, size, hlp) => {
                    let imgShift = new V2(0,0) //imgMovement[imgMovementIndices[i]]
                    if(imgMovenetFrameData[i] != undefined) {
                        imgShift = imgMovement[imgMovenetFrameData[i]];
                    }

                    ctx.drawImage(img, imgShift.x, imgShift.y);
                    ctx.drawImage(pframes[i], imgShift.x, imgShift.y);
                }));

                this.registerFramesDefaultTimer({});
            }
        }), 20+i)

        );


        // this.branches_01 = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
                
        //         let img = PP.createImage(model, { renderOnly: ['branches_01'] });
        //         let pixelsData = getPixels(img, this.size);

        //         let imgMovementStartFrameIndex = getRandomInt(0, framesCount-1);
        //         let imgMovementFramesLength = getRandomInt(framesCount, framesCount*2/3);
        //         let imgMovement = [new V2(0,0), new V2(-1,0), new V2(-1,1), new V2(0,1)];
        //         let imgMovementRight = [new V2(0,0), new V2(-1,0), new V2(-1,1), new V2(0,1)];
        //         let imgMovementIndices = easing.fast({from: 0, to: imgMovement.length-1, steps: imgMovementFramesLength, type: 'linear', round: 0})

        //         let imgMovenetFrameData = [];
        //         for(let f = 0; f < imgMovementFramesLength; f++) {
        //             let frameIndex = f + imgMovementStartFrameIndex;
        //             if(frameIndex > (framesCount-1)){
        //                 frameIndex-=framesCount;
        //             }

        //             imgMovenetFrameData[frameIndex] = imgMovementIndices[f];
        //         }

        //         let pData = [];
        //         pixelsData.forEach(pd => {
        //             if(getRandomInt(0, 5) == 0) {
        //                 let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

        //                 if(targetColors.indexOf(color) != -1){
        //                     pData[pData.length] = { point: pd.position.clone(), color } 
        //                 }
        //             }
        //         });

        //         let pframes = animationHelpers.createMovementRotFrames({ framesCount: 150, pointsData: pData, itemFrameslength: 90, size: this.size })
        //         this.frames = new Array(framesCount).fill().map((el, i) => createCanvas(this.size, (ctx, size, hlp) => {
        //             let imgShift = new V2(0,0) //imgMovement[imgMovementIndices[i]]
        //             if(imgMovenetFrameData[i] != undefined) {
        //                 imgShift = imgMovement[imgMovenetFrameData[i]];
        //             }

        //             ctx.drawImage(img, imgShift.x, imgShift.y);
        //             ctx.drawImage(pframes[i], imgShift.x, imgShift.y);
        //         }));

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), )
    }
}