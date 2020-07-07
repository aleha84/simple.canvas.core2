class PunchingScene extends Scene {
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('white').dot(0,0);
            })
        }), 1)

        this.boxer = this.addGo(new GO({
            position: new V2(this.viewport.x/2, 42),
            size: new V2(150,60),
            frames: PP.createImage(PunchingScene.models.boxerFrames),
            init() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                let delay = 4;
                this.timer = this.regTimerDefault(10, () => {
                
                    if(--delay > 0){
                        return;
                    }

                    delay = 4;

                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 5)

        this.letters = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            //img: PP.createImage(PunchingScene.models.letters),
            init() {
              this.main = this.addChild(new GO({
                  position: new V2(),
                  size: this.size,
                  img: PP.createImage(PunchingScene.models.letters, { renderOnly: ['bg', 'bbb'] })
              }))  

              this.lettersAnimated = this.addChild(new GO({
                position: new V2(),
                size: this.size,
                createLettersFrames({framesCount, itemsCount, itemFrameslength, size}) {
                    let frames = [];
                    
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                    
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
                    
                                }
                                
                            }
                        });
                    }
                    
                    return frames;
                },
                init() {

                }
            }))  
            }
        }), 10)
    }
}