class LampScene extends Scene {
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
                fileNamePrefix: 'lamp',
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
            }),
            init() {
                this.shine = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let frames = [];
                        for(let f = 0; f < 4; f++) {
                            let gradientDots = colors.createRadialGradient({ size: new V2(80,80), center: new V2(75,48), radius: new V2(19+f,19+f), gradientOrigin: new V2(75,48),
                                angle: 0 })
        
                                frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                for(let y = 0; y < gradientDots.length; y++){
                                    let row = gradientDots[y];
                                    if(!row)
                                        continue;
                    
                                    for(let x = 0; x < row.length; x++){
                                        if(!row[x])
                                            continue;
                    
                                        if(row[x].length == 0)
                                            continue;
                    
                                        let a =  row[x].values.reduce((a,b) => a+b,0)/row[x].values.length + getRandom(-0.025, 0.025) //Math.max(...row[x].values);
                    
                                        if(a < 0)
                                            a  = 0;

                                        a = fast.r(a, 1);
                                        if(row[x].maxValue == undefined)
                                            row[x].maxValue = a;
                                        
                                        hlp.setFillColor(`rgba(198,118,30,${a})`).dot(new V2(x, y))
                                    }
                                }
                            })
                        }
                        
                        let frameChangeClamps = [6,7]
                        let frameChangeDelay = getRandomInt(frameChangeClamps) ;
                
                        let animationRepeatDelayOrigin = 0;
                        let animationRepeatDelay = animationRepeatDelayOrigin;
                        this.img = frames[getRandomInt(0, frames.length-1)]
                        
                        this.timer = this.regTimerDefault(10, () => {
                            animationRepeatDelay--;
                            if(animationRepeatDelay > 0)
                                return;
                        
                            frameChangeDelay--;
                            if(frameChangeDelay > 0)
                                return;
                        
                            frameChangeDelay = getRandomInt(frameChangeClamps);
                        
                            this.img = frames[getRandomInt(0, frames.length-1)]
                            this.currentFrame++;
                            if(this.currentFrame == frames.length){
                                this.currentFrame = 0;
                                animationRepeatDelay = animationRepeatDelayOrigin;
                            }
                        })
                        //console.log(gradientData);
                    }
                }))
            }
        }), 1)

        let gradientOrigin = new V2(75,48);
        let gradientDots = colors.createRadialGradient({ size: this.viewport.clone(), center: new V2(75,68), radius: new V2(80,60), gradientOrigin, angle: 0,
            setter: (dot, aValue) => {
                if(!dot.values){
                    dot.values = [];
                    dot.maxValue = aValue;
                }

                if(aValue > dot.maxValue)
                    dot.maxValue = aValue;

                dot.values.push(aValue);
            } })

        let createMossFrames = function({framesCount, itemsCount, itemFrameslength, size, clampX, clampY, rgb}) {
            let frames = [];
            let shift = V2.zero;
            let p1Clamps = [10, 30];
            
            let pos = [new V2(-1, 0), new V2(-1, -1,), new V2(0, -1), new V2(0,0)];

            

            let lf = (angle, p1) => {
                let rad = degreeToRadians(angle);
                let sinSq = (1-Math.cos(2*rad)/2);

                return new V2(
                    p1*Math.cos(rad)/(1 + sinSq ),
                    p1*Math.sin(rad)*Math.cos(rad)/(1 + sinSq )
                ).toInt();
            }

            let elf = (angle, size) => {
                let r = degreeToRadians(angle);
                return new V2(
                    (size.x * Math.cos(r)),
                    (size.y * Math.sin(r))
                ).toInt();
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength[0], itemFrameslength[1]);
            
                let pChange = easing.fast({ from: 0, to: pos.length-1, steps: 30, type: 'linear', round: 0 });
                let _p = getRandomInt(0, pos.length-1);

                let usePos = true//getRandomBool();

                let init =  new V2(
                    getRandomInt(clampX[0], clampX[1]),
                    getRandomInt(clampY[0], clampY[1])
                    );
                    
                let aValues = easing.fast({ from: 0, to: 360, steps: totalFrames, type: 'linear' });

                let p1 = getRandom(10, 12);
                let useEl = false;
                let elSize = undefined;
                if(getRandomBool()){
                    useEl = true;
                    elSize = new V2(getRandomInt(p1Clamps), getRandomInt(p1Clamps))
                }

                let frames = [];

                let posStartIndex = getRandomInt(0, framesCount-1);
                let posIndex = 0;

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let p = useEl
                    ? elf(aValues[f], elSize).add(init)
                    : lf(aValues[f], p1).add(init);

                    let shiftedX = p.x-shift.x;
                    let shiftedY = p.y-shift.y;

                    let a = 0;
                    if(gradientDots[shiftedY] && gradientDots[shiftedY][shiftedX]){
                        a = gradientDots[shiftedY][shiftedX].maxValue/2;
                    }

                    let usePos = false;
                    // if(frameIndex >=)
                    // let pIndex = _p + pChange[f];
                    // if(pIndex > (pos.length-1))
                    //     pIndex-= pos.length;
            
                    frames[frameIndex] = {
                        pIndex : usePos? pIndex : undefined, 
                        p,
                        a
                    };
                }
            
                return {
                    init,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let rawFrame = createCanvas(size, (ctx, _size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let a = itemData.frames[f].a*2;

                                // let pc = new V2();
                                // if(itemData.frames[f].pIndex != undefined) {
                                //     pc = pos[itemData.frames[f].pIndex];
                                // }

                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${a})`).dot(itemData.frames[f].p);
                                //hlp.setFillColor(`rgba(143,86,31,${a})`).dot(itemData.frames[f].p.add(pc))
                            }
                            
                        }
                    });

                    // ctx.drawImage(mask, 0,0);
                    // ctx.globalCompositeOperation = 'source-in';
                    ctx.drawImage(rawFrame, 0,0);
                });
            }
            
            return frames;
        }

        this.mossBack = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createMossFrames(
                    {framesCount: 300, itemsCount: 300, itemFrameslength: [150,200], size: this.size, 
                        clampX: [0,this.size.x], clampY: [0,this.size.y], rgb: {r: 91,g: 54,b:20} 
                    })

                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        this.parentScene.capturing.stop = true; 
                    }
                });
            }
        }), 3)
        this.mossMid = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createMossFrames(
                    {framesCount: 300, itemsCount: 200, itemFrameslength: [150,200], size: this.size, 
                        clampX: [0,this.size.x], clampY: [0,this.size.y],rgb: {r: 143,g: 86,b:31} 
                    })

                let repeat = 1;
                this.registerFramesDefaultTimer({
                    // framesEndCallback: () => { 
                    //     repeat--;
                    //     if(repeat == 0)
                    //         //this.parent.parentScene.capturing.stop = true; 
                    //     }
                });
            }
        }), 5)

        this.mossFrontal = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            
            init() {
                this.frames = createMossFrames(
                    {framesCount: 300, itemsCount: 100, itemFrameslength: [150,200], size: this.size, 
                        clampX: [30,this.size.x-30], clampY: [30,this.size.y-30],rgb: {r: 216,g: 136,b:49} 
                    })

                let repeat = 1;
                this.registerFramesDefaultTimer({
                    // framesEndCallback: () => { 
                    //     repeat--;
                    //     if(repeat == 0)
                    //         //this.parent.parentScene.capturing.stop = true; 
                    //     }
                });
            }
        }), 15)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(DraftsScene.models.lamp, {renderOnly: ['lamp']}),
            init() {
                //let frames = []
                let totalFrames = 300
                let originalImage = PP.createImage(DraftsScene.models.lamp, {renderOnly: ['lamp']});
                let pFrames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: 30, size: this.size, 
                    pointsData: animationHelpers.extractPointData(DraftsScene.models.lamp.main.layers.find(l => l.name == 'p')) });
                
                this.frames = [];

                let frameChangeClamps = [6,10]
                let frameChangeDelay = getRandomInt(frameChangeClamps) ;
                let darkIndex = 0;
                let overlayDarknes = getRandomInt(0, 2)*0.15;

                for(let f = 0; f< totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.drawImage(originalImage, 0, 0);
                        ctx.drawImage(pFrames[f], 0, 0);

                        ctx.globalCompositeOperation = 'source-atop';
                        hlp.setFillColor('rgba(0,0,0,' + overlayDarknes +')').rect(0,0,size.x,size.y)

                        darkIndex++;
                        if(darkIndex == frameChangeDelay) {
                            darkIndex = 0;
                            frameChangeDelay = getRandomInt(frameChangeClamps) ;
                            overlayDarknes = getRandomInt(0, 2)*0.15;
                        }
                    })
                }

                this.registerFramesDefaultTimer({});

                
            }
        }), 10)

        // this.lamp_p = this.addGo(new GO({
        //     position: this.sceneCenter.clone(),
        //     size: this.viewport.clone(),
        //     init() {
        //         this.frames = animationHelpers.createMovementFrames({ framesCount: 150, itemFrameslength: 30, size: this.size, 
        //             pointsData: animationHelpers.extractPointData(DraftsScene.models.lamp.main.layers.find(l => l.name == 'p')) });

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 11)
    }
}