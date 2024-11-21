class EasingsScene extends Scene {
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
                size: new V2(150,270).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'loading_new1',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderAddGo({color: 'black'})
    }

    start(){
        //let model = EasingsScene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        //
        let createLoadingFrames = function({framesCount, fadeoutFamesCount, gapWidth=1, itemsCount, size, easingMethod, easingType}) {
            let frames = [];
            
            let frameImg = createCanvas(size, (ctx, size, hlp) => {
                hlp.setFillColor(whiteColorPrefix + 1 + ')')
                    .rect(2, 0, size.x-4, 1)
                    .rect(size.x-2, 1, 1, size.y-2)
                    .rect(2, size.y-1, size.x-4, 1)
                    .rect(1, 1, 1, size.y-2)
            })

            // let gapWidth = 1;
            let gapsCount = itemsCount-2;
            let availableWidth = size.x - 6;
            let itemWidth = fast.f((availableWidth-(gapsCount*gapWidth))/itemsCount);

            if(itemWidth < 1) {
                itemWidth = 1
                itemsCount = fast.f(availableWidth/2)
                gapsCount = fast.f(availableWidth/2)-2
            }

            while((itemsCount*itemWidth + gapsCount*gapWidth) >= availableWidth) {
                itemsCount--;
            }

            let itemHeight = size.y - 4;
            let itemShift = new V2(3,2);

            let widthLeft = availableWidth - (itemWidth*itemsCount) - (gapsCount*gapWidth) - 1;
            
            let itemFrameslength = fast.r(framesCount/itemsCount);
            let aValues = easing.fast({from: 0, to: 1, steps: itemFrameslength, type: 'linear', round: 2})
            let fadeoutAValues = easing.fast({from: 1, to: 0, steps: fadeoutFamesCount, type: 'linear', round: 2})

            let tf = framesCount + fadeoutFamesCount;

            let currentX = itemShift.x;
            let nextX = currentX;

            let startIndicesValues = easing.fast({
                from: 0, to: framesCount-itemFrameslength, steps: itemsCount, type: easingType, method: easingMethod, round: 0
            })

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = startIndicesValues[i]//i*itemFrameslength //getRandomInt(0, framesCount-1);
                let totalFrames = framesCount - startFrameIndex //itemFrameslength;
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        a: aValues[f] != undefined ? aValues[f] : 1
                    };
                }

                for(let f = 0; f < fadeoutFamesCount; f++) {
                    frames[f+framesCount] = {
                        a: fadeoutAValues[f] != undefined ? fadeoutAValues[f] : 0
                    };
                }

                let iw = itemWidth;
                if(widthLeft > 0){
                    iw++;
                    widthLeft--;
                }

                currentX = nextX;

                nextX = currentX+gapWidth+iw;
            
                return {
                    index: i,
                    frames,
                    itemWidth: iw,
                    x: currentX,
                }
            })
            
            
            for(let f = 0; f < tf; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            hlp.setFillColor(whiteColorPrefix + itemData.frames[f].a + ')')
                            // .rect(itemData.x, itemShift.y+1, 1, itemHeight-2)
                            // .rect(itemData.x+1, itemShift.y, itemData.itemWidth-2, itemHeight)
                            // .rect(itemData.x + itemData.itemWidth-1, itemShift.y+1, 1, itemHeight-2)
                            .rect(itemData.x, itemShift.y, itemData.itemWidth, itemHeight)
                        }
                        
                    }

                    // for(let i = 0; i < itemsCount; i++){
                    //     hlp.setFillColor(whiteColorPrefix + 1 + ')').rect(itemShift.x + (itemWidth+1)*i , itemShift.y, itemWidth, itemHeight)
                    // }

                    ctx.drawImage(frameImg, 0,0)
                });
            }
            
            return frames;
        }

        let createGo = ({position, size, labelText, easingMethod, easingType}) => {
            return this.addGo(new GO({
                position: position,//this.sceneCenter.clone(),
                size: size, //new V2(this.viewport.x, 8),
                init() {
                    this.label = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        init() {
                            let labelImg = PP.createText({ font: 'minifont', text: labelText, color: '#FFFFFF', sizeMultiplier: 1, gapWidth: 1 })
                            this.img = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(labelImg.img, 2, 0);
                            })
                        }
                    }))
                    this.animation = this.addChild(new GO({
                        position: new V2(0, 6),
                        size: this.size,
                        init() {
                            this.frames = createLoadingFrames({ framesCount: 160,fadeoutFamesCount:20, itemsCount: 144, itemFrameslength: 60, 
                                gapWidth: 0, easingMethod, easingType,
                                size: this.size })
            
                            this.registerFramesDefaultTimer({
                                framesEndCallback: () => {
                                    this.parent.parentScene.capturing.stop = true;
                                }
                            });
                        }
                    }))
                    
                }
            }), 1)
        }

        let data = [
            {labelText: 'Linear', easingType: 'linear', easingMethod: 'base'},
            {labelText: 'Sin-in', easingType: 'sin', easingMethod: 'in'},
            {labelText: 'Sin-out', easingType: 'sin', easingMethod: 'out'},
            {labelText: 'Sin-inOut', easingType: 'sin', easingMethod: 'inOut'},
            {labelText: 'Quad-in', easingType: 'quad', easingMethod: 'in'},
            {labelText: 'Quad-out', easingType: 'quad', easingMethod: 'out'},
            {labelText: 'Quad-inOut', easingType: 'quad', easingMethod: 'inOut'},
            {labelText: 'Cubic-in', easingType: 'cubic', easingMethod: 'in'},
            {labelText: 'Cubic-out', easingType: 'cubic', easingMethod: 'out'},
            {labelText: 'Cubic-inOut', easingType: 'cubic', easingMethod: 'inOut'},
            {labelText: 'Expo-in', easingType: 'expo', easingMethod: 'in'},
            {labelText: 'Expo-out', easingType: 'expo', easingMethod: 'out'},
            {labelText: 'Expo-inOut', easingType: 'expo', easingMethod: 'inOut'}
        ]

        this.items = data.map((d,i) => createGo({position: new V2(this.sceneCenter.x, 10+i*20), size: new V2(this.viewport.x, 8), 
            labelText: d.labelText, easingType: d.easingType, easingMethod: d.easingMethod}))

    }
}