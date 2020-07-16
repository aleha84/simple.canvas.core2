class ToonMeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,
                viewportSizeMultiplier: 1,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'toon_me'
            },
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

        this.originalImage = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: SCG.images.me_red,
            init() {
                // let that = this;
                // let img = new Image;
                // img.onload = function(){
                //     that.img = createCanvas(that.size, (ctx, size, hlp) => {
                //         ctx.drawImage(img, 0,0);
                //     }) 
                //   };
                // img.src = ToonMeScene.models.meRed;
                this.img = SCG.images.me_red;
            }
        }), 2)


        //new V2(113,150)
        let ratio = this.viewport.x/113;
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone().add(new V2(0,1)),
            originalSize: new V2(113,150),
            size: new V2(113,150).mul(ratio).toInt().add(new V2(4,4)),
            //img: PP.createImage(ToonMeScene.models.mainCut, { exclude: ['bg'] }),
            init() {
                this.bg = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(ToonMeScene.models.mainCut, { renderOnly: ['bg'] }),
                }))

                let createPerspectiveFrames = ({framesCount, itemsCount, itemFrameslength, size, tailLength, color}) => {
                    let frames = [];
                    let pCenter = size.divide(2).toInt();
                    let maxR = 100;
                    let sharedPP = undefined;
                    createCanvas(new V2(1,1), (ctx, size, hlp) => {
                        sharedPP = new PP({ctx});
                    })
                    let tailLengthValues = easing.fast({from: tailLength, to: 1, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v));

                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let r = getRandomInt(maxR-10, maxR + 10);
                        let angle = getRandomInt(-7,133);
                        let direction = V2.up.rotate(angle);
                        let p2 = pCenter.add(direction.mul(r));
                        let linePoints = sharedPP.lineV2(p2, pCenter);
                        let indexValues = easing.fast({from: 0, to: linePoints.length-1, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v));
                        

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                index: f
                            };
                        }
                    
                        return {
                            frames,
                            linePoints,
                            indexValues
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    let index = itemData.frames[f].index;
                                    let tailLength = tailLengthValues[index];
                                    let pointIndex = itemData.indexValues[index];
                                    for(let i = 0; i < tailLength; i++){
                                        let pi = pointIndex-i;
                                        if(pi < 0) continue;

                                        let p = itemData.linePoints[pi];

                                        hlp.setFillColor(color).dot(p.x, p.y);
                                    }
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                }

                let layers = [
                    createPerspectiveFrames({ framesCount: 200, itemsCount: 800, itemFrameslength: 200, size: this.originalSize, tailLength: 3, color: '#b22b23' }),
                    createPerspectiveFrames({ framesCount: 200, itemsCount: 800, itemFrameslength: 150, size: this.originalSize, tailLength: 5, color: '#c35a54' }),
                    createPerspectiveFrames({ framesCount: 200, itemsCount: 200, itemFrameslength: 100, size: this.originalSize, tailLength: 8, color: '#dda19d' }),
                    createPerspectiveFrames({ framesCount: 200, itemsCount: 100, itemFrameslength: 50, size: this.originalSize, tailLength: 20, color: '#f6e7e7' })
                ]

                this.animations = layers.map(frames => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        let repeat = 3;
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(10, () => {
                        
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                                if(repeat-- == 0)
                                    this.parent.parentScene.capturing.stop = true;
                            }
                            this.img = this.frames[this.currentFrame];
                        })
                    }
                })))
                
                this.loading = this.addChild(new GO({
                    position: new V2(260,-420),
                    size: new V2(32,20).mul(ratio).toInt(),
                    frames: PP.createImage(ToonMeScene.models.loading),
                    init() {
                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        let delay = 19;

                        this.timer = this.regTimerDefault(10, () => {
                        
                            if(delay-- > 0)
                                return;
                            delay = 19;

                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                            this.img = this.frames[this.currentFrame];
                        })

                    }
                }))


                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(ToonMeScene.models.mainCut, { exclude: ['bg'] }),
                }))

                this.sign = this.addChild(new GO({
                    position: new V2(-250,-450),
                    size:  new V2(35,8).mul(ratio).toInt(),
                    img: PP.createImage(ToonMeScene.models.sign),
                }))
            }
        }), 5)
    }
}