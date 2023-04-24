class MasksScene extends Scene {
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
                size: new V2(1900,1500).divide(2),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'masks',
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
        let model = MasksScene.models.main;
        let originalImagesSize = new V2(200, 150);

        let totalFrames = 420;
        let inOutFramesLength1 = 60;
        let inOutFramesLength2 = 60;
        let finishPauseFramesLength = 50;
        let stopFramesLength = totalFrames - (inOutFramesLength1 + inOutFramesLength2) - finishPauseFramesLength;

        let maleMaskShowStartFrame = finishPauseFramesLength+inOutFramesLength1 + 10;
        let femaleMaskShowStartFrame = maleMaskShowStartFrame + 40;
        let maleMaskShowFramesLength = stopFramesLength - 10;
        let femaleMaskShowFramesLength = stopFramesLength - 40;

        let bgMethod1 = 'inOut'
        let bgMethod2 = 'inOut'

        let pairMethod1 = 'inOut'
        let pairMethod2 = 'inOut'

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(4,0)),
            size: originalImagesSize,
            img: PP.createImage(model, { renderOnly: ['bg'] }),
            init() {
                let xShiftClamps = [4,-4];
                
                let xValuesChange = [
                    ...new Array(finishPauseFramesLength).fill(xShiftClamps[0]),
                    ...easing.fast({from: xShiftClamps[0], to: xShiftClamps[1], steps: inOutFramesLength1, type: 'quad', method: bgMethod1, round: 0}),
                    ...new Array(stopFramesLength).fill(xShiftClamps[1]),
                    ...easing.fast({from: xShiftClamps[1], to: xShiftClamps[0], steps: inOutFramesLength2, type: 'quad', method: bgMethod2, round: 0}),
                ]

                console.log(xValuesChange.length)

                this.currentFrame = 0;
                this.position.x = this.parentScene.sceneCenter.x + xValuesChange[this.currentFrame];
                
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.position.x = this.parentScene.sceneCenter.x + xValuesChange[this.currentFrame];
                    this.needRecalcRenderProperties = true;;
                })

                let lampHideCount = 8;
                for(let i = 1; i <= lampHideCount; i++){
                    let name = 'bg_lamp_hide0' + i;
                    this[name] = this.addChild(new GO({
                        position: new V2(),
                        size: this.size, 
                        isVisible: false,
                        init() {
                            this.img = PP.createImage(model, { renderOnly: [name], forceVisibility: { [name]: { visible: true } } });
                            let visibleFrom = getRandomInt(0, totalFrames);
                            let visibilityLength = getRandomInt(20, 40);
                            let visibilityData = []
                            for(let f = 0; f < totalFrames; f++) {
                                visibilityData[f] = false;
                                if(f >= visibleFrom && f <= (visibleFrom + visibilityLength)) {
                                    visibilityData[f] = true;
                                    continue;
                                }

                                if(visibleFrom + visibilityLength > totalFrames) {
                                    if(f <= (visibleFrom + visibilityLength - totalFrames ) ) {
                                        visibilityData[f] = true;
                                        continue;
                                    }
                                }
                            }

                            this.currentFrame = 0;
                            this.timer = this.regTimerDefault(10, () => {
                                
                                this.isVisible = visibilityData[this.currentFrame];

                                this.currentFrame++;
                                if(this.currentFrame == totalFrames){
                                    this.currentFrame = 0;
                                }
                            })
                        }
                    }))
                }
            }
        }), 1)

        this.pair = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-8, 0)),
            size: originalImagesSize,
            img: PP.createImage(model, { renderOnly: ['pair'], forceVisibility: { pair: { visible: true } } }),
            init() {
                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: 60, size: this.size, 
                            pointsData: animationHelpers.extractPointData(model.main.layers.find(l => l.name == 'pair_p')) });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }));

                this.masks = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.maleMask = this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            init() {
                                this.baseImg = PP.createImage(model, { renderOnly: ['male_mask_highlight'] });
                                this.baseImg_025a = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.globalAlpha = 0.25
                                    ctx.drawImage(this.baseImg, 0,0);
                                })
                                this.baseImg_05a = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.globalAlpha = 0.5
                                    ctx.drawImage(this.baseImg, 0,0);
                                })
                            }
                        }))
        
                        this.femaleMask = this.addChild(new GO({
                            position: new V2(),
                            size: this.size, 
                            init() {
                                this.baseImg = PP.createImage(model, { renderOnly: ['female_mask'] });
                                this.baseImg_025a = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.globalAlpha = 0.25
                                    ctx.drawImage(this.baseImg, 0,0);
                                })
                                this.baseImg_05a = createCanvas(this.size, (ctx, size, hlp) => {
                                    ctx.globalAlpha = 0.5
                                    ctx.drawImage(this.baseImg, 0,0);
                                })
                            }
                        }))
                    }
                }));



                let xShiftClamps = [-8,8]

                let xValuesChange = [
                    ...new Array(finishPauseFramesLength).fill(xShiftClamps[0]),
                    ...easing.fast({from: xShiftClamps[0], to: xShiftClamps[1], steps: inOutFramesLength1, type: 'quad', method: pairMethod1, round: 0}),
                    ...new Array(stopFramesLength).fill(xShiftClamps[1]),
                    ...easing.fast({from: xShiftClamps[1], to: xShiftClamps[0], steps: inOutFramesLength2, type: 'quad', method: pairMethod2, round: 0}),
                ]

                console.log(xValuesChange.length)

                this.currentFrame = 0;
                this.position.x = this.parentScene.sceneCenter.x + xValuesChange[this.currentFrame];
                
                let maleMask;
                let femaleMask;

                this.timer = this.regTimerDefault(10, () => {

                    if(maleMask == undefined) {
                        maleMask = this.masks.maleMask;
                        femaleMask = this.masks.femaleMask;
                    }

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    if(this.currentFrame == maleMaskShowStartFrame) {
                        maleMask.img = maleMask.baseImg_025a;
                    }

                    if(this.currentFrame == maleMaskShowStartFrame + 10) {
                        maleMask.img = undefined;
                    }

                    if(this.currentFrame == maleMaskShowStartFrame + 20) {
                        maleMask.img = maleMask.baseImg_05a;;
                    }

                    // if(this.currentFrame == maleMaskShowStartFrame + 30) {
                    //     maleMask.img = undefined;
                    // }

                    if(this.currentFrame == maleMaskShowStartFrame + 40) {
                        maleMask.img = maleMask.baseImg;
                    }


                    /* ----------- */

                    if(this.currentFrame == femaleMaskShowStartFrame + 10) {
                        femaleMask.img = femaleMask.baseImg_025a;
                    }

                    if(this.currentFrame == femaleMaskShowStartFrame + 15) {
                        femaleMask.img = femaleMask.baseImg_05a;
                    }

                    if(this.currentFrame == femaleMaskShowStartFrame + 20) {
                        femaleMask.img = femaleMask.baseImg;
                    }


                    if(this.currentFrame == maleMaskShowStartFrame + maleMaskShowFramesLength) {
                        maleMask.img = undefined
                    }

                    if(this.currentFrame == femaleMaskShowStartFrame + femaleMaskShowFramesLength-10) {
                        femaleMask.img = undefined
                    }

                    this.position.x = this.parentScene.sceneCenter.x + xValuesChange[this.currentFrame];
                    this.needRecalcRenderProperties = true;;
                })
            }
        }), 10)

        this.hud = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let model = MasksScene.models.hud1;
                // let layersData = {};
                // let exclude = [
                    
                // ];
                
                for(let i = 0; i < model.main.layers.length; i++) {
                    let layer = model.main.layers[i];
                    let layerName = layer.name || layer.id;
                    //let renderIndex = i*10;
                
                    // layersData[layerName] = {
                    //     renderIndex
                    // }
                    
                    // if(exclude.indexOf(layerName) != -1){
                    //     console.log(`layerName - skipped`)
                    //     continue;
                    // }
                    
                    this[layerName] = this.addChild(new GO({
                        position: new V2(10, 0),
                        size: originalImagesSize,
                        isVisible: false,
                        img: PP.createImage(model, { renderOnly: [layerName] }),
                        init() {
                            if(layerName == 'que') {
                                let framesCount = 30;
                                let xChange = easing.fast({from: 10, to: 105, steps: framesCount, type: 'quad', method: 'out'});

                                this.frames = [];
                                for(let f = 0; f < framesCount;f++) {
                                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                        let currentX = xChange[f];
                                        ctx.drawImage(this.img, 0 , 0);
                                        ctx.globalCompositeOperation = 'destination-in';
                                        hlp.setFillColor('red').rect(10, 0, currentX, 100);
                                    })
                                }

                                this.startAnimation = function() {
                                    this.currentFrame = 0;
                                    this.img = this.frames[this.currentFrame];
                                    
                                    this.timer = this.regTimerDefault(10, () => {
                                    
                                        this.img = this.frames[this.currentFrame];
                                        this.currentFrame++;
                                        if(this.currentFrame == this.frames.length){
                                            this.unregTimer(this.timer);
                                        }
                                    })
                                }

                                this.startAnimationRev = function() {
                                    this.currentFrame = this.frames.length-1;
                                    this.img = this.frames[this.currentFrame];
                                    
                                    this.timer = this.regTimerDefault(10, () => {
                                    
                                        this.img = this.frames[this.currentFrame];
                                        this.currentFrame--;
                                        if(this.currentFrame == 0){
                                            this.unregTimer(this.timer);
                                        }
                                    })
                                }
                            }
                        }
                    }))
                }

                this.currentFrame = 0;
                    
                this.bg.isVisible = true;

                this.timer = this.regTimerDefault(10, () => {
                
                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 - 10)) {
                        this.que.isVisible = true;
                        this.que.startAnimation();
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 10)) {
                        this.yes.isVisible = true;
                        this.no.isVisible = true;
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 50)) {
                        this.yes_sel.isVisible = true;
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 100)) {
                        this.yes_sel.isVisible = false;
                        this.no_sel.isVisible = true;
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 120)) {
                        this.yes_sel.isVisible = true;
                        this.no_sel.isVisible = false;
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 140)) {
                        this.yes_sel.isVisible = false;
                        this.no_sel.isVisible = true;
                    }

                    if(
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 180) ||
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 190) ||
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 200)
                    ) {
                        this.no_sel.isVisible = false;
                    }

                    if(
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 185) ||
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 195) ||
                        this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + 205)
                    ) {
                        this.no_sel.isVisible = true;
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + stopFramesLength - 30)) {
                        this.yes.isVisible = false;
                        this.no.isVisible = false;

                        this.yes_sel.isVisible = false;
                        this.no_sel.isVisible = false;
                        this.que.startAnimationRev();
                    }

                    if(this.currentFrame == (finishPauseFramesLength + inOutFramesLength1 + stopFramesLength)) {
                        this.que.isVisible = false;
                    }

                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                        this.parentScene.capturing.stop = true;
                    }
                })
            }
        }), 30)
    }
}