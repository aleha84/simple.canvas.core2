class Demo10WinterNightScene extends Scene {
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
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'winter_night'
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    createLightenFrames({framesCount, itemsCount, size, xClamps, yClamps, lightCenter, lightSize, angleClamps, maxOpacity}) {
        let frames = [];
        let bottomLine = createLine(new V2(-size.x*2, yClamps[1]), new V2(size.x*2, yClamps[1]));
        let oValues = easing.fast({ from: maxOpacity, to: 0, steps: lightSize, type: 'quad', method: 'out', round: 2});


        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let initialPoint = new V2(getRandomInt(xClamps[0], xClamps[1]), yClamps[0]);
            let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
            let target = raySegmentIntersectionVector2(
                initialPoint, direction, bottomLine);

            let distance = initialPoint.distance(target);
            let deltaPerFrameV2 = direction.mul(distance/framesCount);
            let dots = new Array(framesCount).fill().map((el, i) => initialPoint.add(deltaPerFrameV2.mul(i)));

            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = framesCount;
        
            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                let point = dots[f].toInt();
                let distanceToLightCenter = fast.r(point.distance(lightCenter));
                
                if(distanceToLightCenter > (lightSize-1)){
                    distanceToLightCenter = lightSize-1;
                }

                frames[frameIndex] = {
                    point: point,
                    oValue: oValues[distanceToLightCenter]
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
                        hlp.setFillColor(`rgba(255,255,255,${itemData.frames[f].oValue})`).dot(itemData.frames[f].point.x, itemData.frames[f].point.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    extractPointData(layer) {
        let data = [];
        layer.groups.forEach(group => {
            let color = group.strokeColor;
            group.points.forEach(point => {
                data.push({
                    color, 
                    point: point.point
                });
            })
        })

        return data;
    }

    createPointVisibilityFrames({framesCount, itemFrameslength, pointsData, size}) {
        let frames = [];
        
        let itemsData = pointsData.map((pd, i) => {
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
                frames,
                pd
            }
        })
        
        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        hlp.setFillColor(itemData.pd.color).dot(itemData.pd.point.x, itemData.pd.point.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    createSnowflakesFrames({framesCount, itemsCount, color, maxOpacity, angleClamps, size, visibleFramesClamps, lowerY, upperY, upperYShiftClamps, alterOpacity}) {
        let frames = [];
        if(upperY == undefined) {
            upperY = 0;
        }
        if(lowerY == undefined){
            lowerY = size.y
        }

        if(upperYShiftClamps == undefined) {
            upperYShiftClamps = [0,0]
        }
        let bottomLine = createLine(new V2(-2*size.x, lowerY), new V2(size.x*3, lowerY));

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let initialPoint = new V2(getRandomInt(-size.x, size.x*2), upperY + getRandomInt(upperYShiftClamps[0], upperYShiftClamps[1]));
            let direction = V2.down.rotate(getRandomInt(angleClamps[0], angleClamps[1]));
            let target = raySegmentIntersectionVector2(
                initialPoint, direction, bottomLine);
            let distance = initialPoint.distance(target);
            let deltaPerFrameV2 = direction.mul(distance/framesCount);
            let dots = new Array(framesCount).fill().map((el, i) => initialPoint.add(deltaPerFrameV2.mul(i)));
            
            let frames = [];

            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = framesCount;
            
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }
        
                frames[frameIndex] = {
                    point: dots[f].toInt()
                };
            }

            let visibleCount = getRandomInt(1,3);
            for(let j = 0; j < visibleCount;j++){ 
                let initialVisibleFrame = getRandomInt(0, framesCount-1);
                let visibleLength = getRandomInt(visibleFramesClamps[0], visibleFramesClamps[1]);
                let opacity = maxOpacity;
                if(getRandomInt(0,8) == 0)
                    opacity = alterOpacity;

                let oValues = [
                    ...easing.fast({ from: 0, to: opacity, steps: fast.r(visibleLength/2), type: 'quad', method: 'inOut', round: 2 }),
                    ...easing.fast({ from: opacity, to: 0, steps: fast.r(visibleLength/2), type: 'quad', method: 'inOut', round: 2 })
                ];

                for(let k = 0; k < visibleLength; k++){
                    let frameIndex = initialVisibleFrame+k;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let oValue = oValues[k]
                    if(frames[frameIndex].oValue){
                        frames[frameIndex].oValue = (frames[frameIndex].oValue+oValue)/2;
                        if(frames[frameIndex].oValue > 1)
                            frames[frameIndex].oValue = 1;
                    }
                    else {
                        frames[frameIndex].oValue = oValue;
                    }
                }
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
                        let oValue = itemData.frames[f].oValue;
                        if(oValue == undefined)
                            oValue = 0;

                        hlp.setFillColor(`rgba(255,255,255,${oValue})`).dot(itemData.frames[f].point.x, itemData.frames[f].point.y)
                    }
                    
                }
            });
        }
        
        return frames;
    }

    start(){
        let model = Demo10WinterNightScene.models.main;

        for(let i = 0; i < model.main.layers.length; i++){
            let layerIndex = (i+1)*10;
            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [model.main.layers[i].name] }),
                init() {
                    //
                }
            }), layerIndex);

            console.log(model.main.layers[i].name + ' addded at index: ' + layerIndex)
        }

        

        this.farSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createSnowflakesFrames({ 
                framesCount: 600, itemsCount: 3000, color: '#FFFFFF', alterOpacity: 0.2,
                maxOpacity: 0.05, angleClamps: [-30,30], size: this.viewport, visibleFramesClamps: [100,200], lowerY: 70, upperY: 45, upperYShiftClamps: [-30, 5] }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                let repeat = 3;
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true;

                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 21)

        this.farSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(Demo10WinterNightScene.models.window),
            init() {
                let originFrameChangeDelay = 300;
                let frameChangeDelay = originFrameChangeDelay;

                this.timer = this.regTimerDefault(10, () => {
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;

                    frameChangeDelay = originFrameChangeDelay;

                    this.isVisible = !this.isVisible;
                })
            }
        }), 31)


        this.midSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createSnowflakesFrames({ 
                framesCount: 300, itemsCount: 4000, color: '#FFFFFF', alterOpacity: 0.3,
                maxOpacity: 0.1, angleClamps: [-40,40], size: this.viewport, visibleFramesClamps: [50,70], lowerY: 78, upperY: 20, upperYShiftClamps: [-20, 10] }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 51)

        this.fgSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createSnowflakesFrames({ 
                framesCount: 200, itemsCount: 2000, color: '#FFFFFF', alterOpacity: 0.65,
                maxOpacity: 0.25, angleClamps: [-45,45], size: this.viewport, visibleFramesClamps: [40,50] }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 78)

        this.man = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10WinterNightScene.models.manFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let counter = 0;
                let originFrameChangeDelay = 9;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 100-12;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    counter++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        console.log('total man frames: ' + counter);
                        counter = 0;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 71)

        this.fallSnow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: PP.createImage(Demo10WinterNightScene.models.fallSnowFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let counter = 0;
                let originFrameChangeDelay = 3;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 556;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    counter++;
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        console.log('total fallSnow frames: ' + counter);
                        counter = 0;
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 71)

        this.pointsVisibility = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createPointVisibilityFrames({ framesCount: 100, itemFrameslength: 20, size: this.viewport, 
                pointsData: this.extractPointData(Demo10WinterNightScene.models.pointsVisibility.main.layers[0]) }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 72)

        this.lightenSF = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createLightenFrames({ 
                framesCount: 200, itemsCount: 250, size: this.viewport, 
                xClamps: [85,150], yClamps: [-20, 35], lightCenter: new V2(115,10), lightSize: 25,
                maxOpacity: 1, angleClamps: [-45,45], }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 73)

        this.lightenSF = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createLightenFrames({ 
                framesCount: 200, itemsCount: 200, size: this.viewport, 
                xClamps: [55,120], yClamps: [-5, 50], lightCenter: new V2(85,27), lightSize: 20,
                maxOpacity: 0.9, angleClamps: [-45,45], }),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                let originFrameChangeDelay = 0;
                let frameChangeDelay = originFrameChangeDelay;
                
                let animationRepeatDelayOrigin = 0;
                let animationRepeatDelay = animationRepeatDelayOrigin;
                
                this.timer = this.regTimerDefault(10, () => {
                    animationRepeatDelay--;
                    if(animationRepeatDelay > 0)
                        return;
                
                    frameChangeDelay--;
                    if(frameChangeDelay > 0)
                        return;
                
                    frameChangeDelay = originFrameChangeDelay;
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                        animationRepeatDelay = animationRepeatDelayOrigin;
                    }
                })
            }
        }), 73)
    }
}