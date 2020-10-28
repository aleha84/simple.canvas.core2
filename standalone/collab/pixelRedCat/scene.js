class PixelRedCatTree extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
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

        this.createFallingParticlesFrames = function({framesCount, itemsCount, itemFrameslength, size, color}) {
            let frames = [];
            
            let yValues = easing.fast({ from: 0, to: 140, steps: framesCount, type: 'linear', round: 0 });

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                //let visibilityStart = getRandomInt(0, framesCount-1);
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = framesCount;
                let x = getRandomInt(50, 150);

                let frames = [];
                let a = getRandomInt(20,40);
                let b = getRandomInt(5,20);
                let c = getRandomInt(0, 100);

                let xShiftFun = (y) => Math.sin((y-c)/a)*b;

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        xShift: fast.r(xShiftFun(yValues[f])),
                        y: yValues[f]
                    };
                }

                let visibleCount = getRandomInt(1,3);
                for(let j = 0; j < visibleCount;j++){ 
                    let initialVisibleFrame = getRandomInt(0, framesCount-1);
                    let visibleLength = getRandomInt(itemFrameslength[0], itemFrameslength[1]);

                    for(let k = 0; k < visibleLength; k++){
                        let frameIndex = initialVisibleFrame+k;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex].visible = true;
                    }
                }
            
                return {
                    x,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f] && itemData.frames[f].visible){
                            hlp.setFillColor(color).dot(itemData.x + itemData.frames[f].xShift, itemData.frames[f].y)
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('#192117').rect(0,0,size.x, size.y);
            })
        }), 1)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(PixelRedCatTree.models.main),
            init() {
                this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = animationHelpers.createMovementFrames({ framesCount: 200, itemFrameslength: 20, size: this.size, 
                            pointsData: animationHelpers.extractPointData(PixelRedCatTree.models.main.main.layers.find(l => l.name == 'p')) });
            
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)

        this.fallingParticles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createFallingParticlesFrames({framesCount: 400, itemsCount: 5, itemFrameslength: [100,200], size: this.viewport, color: '#6E6F54'}), 
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), 5)

        this.fallingParticles = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            frames: this.createFallingParticlesFrames({framesCount: 400, itemsCount: 5, itemFrameslength: [100,200], size: this.viewport, color: '#B2B189'}), 
            init() {
                this.registerFramesDefaultTimer({});
            }
        }), 15)

        this.createLightPathFrames = function({framesCount, itemsCount, itemFrameslength, size}) {
            let frames = [];
            
            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let x = getRandomInt(50, 100);
                let width = getRandomInt(5,10);

                // let img = createCanvas(size, (ctx, size, hlp) => {
                //     let pp = new PP({ctx});
                //     pp.setFillStyle('#555842');
                //     pp.fillByCornerPoints([new V2(x,0), new V2(x+width,0), new V2(x+width+25,150), new V2(x+25, 150)])
                // })

                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(itemFrameslength[0], itemFrameslength[1]);
            
                let frames = [];

                let halfFrames = fast.r(totalFrames/2);
                let wChange1 = easing.fast({ from: 1, to: width, steps: halfFrames, type: 'quad', method: 'out', round: 0 })
                let wChange2 = easing.fast({ from: width, to: 1, steps: halfFrames, type: 'quad', method: 'in', round: 0 })

                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let _width = 1;
                    let _x = x;
                    if(f < halfFrames){
                        _width = wChange1[f];
                    }
                    else {
                        _width = wChange2[f-halfFrames];
                        _x = x+width-_width;
                    }
            
                    frames[frameIndex] = {
                        width: _width,
                        x: _x,
                        visible: true
                    };
                }
            
                return {
                    //img,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    pp.setFillStyle('#555842');
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f] && itemData.frames[f].visible){
                            //ctx.drawImage(itemData.img, 0,0);
                            pp.fillByCornerPoints([
                                new V2(itemData.frames[f].x,0), 
                                new V2(itemData.frames[f].x+itemData.frames[f].width,0), 
                                new V2(itemData.frames[f].x+itemData.frames[f].width+25,150), 
                                new V2(itemData.frames[f].x+25, 150)])
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.lightPath = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                // this.img =  createCanvas(this.size, (ctx, size, hlp) => {
                //     let pp = new PP({ctx});
                //     pp.setFillStyle('#555842');
                //     pp.fillByCornerPoints([new V2(50,0), new V2(75,0), new V2(125,150), new V2(100, 150)])
                // })
                this.frames = this.parentScene.createLightPathFrames({ framesCount: 400, itemsCount: 5, itemFrameslength: [30,60], size: this.size, color: '#B2B189' });
                this.registerFramesDefaultTimer({});
            }
        }), 2)
    }
}