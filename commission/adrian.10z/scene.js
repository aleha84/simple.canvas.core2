class Adrian10zScene extends Scene {
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
        var model = Adrian10zScene.models.main;
        var exludes = []
        for(let l = 0; l < model.main.layers.length; l++){
            let name = model.main.layers[l].name;
            if(exludes.indexOf(name) == -1){
                this.addGo(new GO({
                    position: this.sceneCenter,
                    size: this.viewport,
                    img: PP.createImage(model, {renderOnly: [name]}) 
                }), l*10)
            }
            else {
                model.main.layers[l].visible = true;
            }
            
            

            console.log(l + ' - ' + name)
        }

        this.discoBall = this.addGo(new GO({
            position: new V2(65, 0),
            size: new V2(30,30),
            createSphereFrames({framesCount, size, texture, textureSize}) {
                let frames = [];
                
                let timeValues = easing.fast({from: 0, to: textureSize.x, steps: framesCount, type: 'linear', method: 'base'});
                
                for(let f = 0; f < framesCount; f++){
                    let frame = sphereHelper.createSphere(texture, 'discoBall',  textureSize, size.x, 1, timeValues[f], true )

                    frames[f] = frame;
                }
                
                return frames;
            },
            init() {
                let textureSize = new V2(this.size.x*2, this.size.y).mul(1);
                this.texture = createCanvas(textureSize, (ctx, size, hlp) => {
                    hlp.setFillColor('#030b60').rect(0,0,size.x, size.y);
                    for(let i = 0; i < 5000; i++){
                        //hlp.setFillColor(getRandomBool() ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)').dot(getRandomInt(0, size.x-1), getRandomInt(0, size.y-1));
                        hlp.setFillColor('rgba(255,255,255,0.05)').dot(getRandomInt(0, size.x-1), getRandomInt(0, size.y-1))
                    }

                    //hlp.setFillColor('red').rect(size.x-1, 0, 1, size.y);
                })

                this.frames = this.createSphereFrames({framesCount: 200, size: this.size, texture: this.texture, textureSize});

                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(15, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.currentFrame = 0;
                    }
                })
            }
        }), 15)
    }
}