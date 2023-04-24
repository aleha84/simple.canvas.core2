class ProtogonistScene extends Scene {
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
                size: new V2(1200, 680),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'protogonist',
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
            img: PP.createImage(ProtogonistScene.models.main, { renderOnly: ['bg'] } )
        }), 1)

        this.qwer = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let center = this.parentScene.sceneCenter.add(new V2(3, 0));
                let totalFrames = 60;

                let initRaditusChangeOdd = [
                    ...easing.fast({from: -5, to: 20, steps: totalFrames/2, type: 'quad', method: 'in', round: 0}),
                    ...easing.fast({from: 20, to: -5, steps: totalFrames/2, type: 'quad', method: 'out', round: 0})
                ]

                let initRaditusChange = [
                    ...easing.fast({from: 20, to: -5, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: -5, to: 20, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                ]

                let data = new Array(14).fill().map((el, i) => ({
                    startDIstance: getRandomInt(20,30) 
                })) 

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        //#7bc67b
                        let initAngle = 15;
                        let totalSteps = data.length;
                        let angleStep = 360/totalSteps;
    
                        let pp = new PP({ctx});
                        pp.setFillStyle('#7bc67b')
                        for(let i = 0; i < totalSteps; i++){
                            let angle = initAngle + angleStep*i;
    
                            let direction = V2.up.rotate(angle);
                            let p1 = center.add(direction.mul(data[i].startDIstance + initRaditusChange[f])).toInt(); //( i %2 == 0 ? initRaditusChange[f] : initRaditusChangeOdd[f]) 
                            let p2 = p1.add(direction.rotate(-10).mul(100)).toInt()
                            let p3 = p1.add(direction.rotate(10).mul(100)).toInt();
    
                            pp.fillByCornerPoints([p1, p2, p3])
                        }
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 3)

        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(ProtogonistScene.models.main, { renderOnly: ['main'] } )
        }), 5)

        this.hand = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(ProtogonistScene.models.main, { renderOnly: ['hand'] } ),
            init() {
                
                let totalFrames = 60;

                let yValues = [
                    ...easing.fast({ from: this.position.y, to: this.position.y + 2, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 }),
                    ...easing.fast({ from: this.position.y + 2, to: this.position.y, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0 })
                ]

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(10, () => {
                    this.currentFrame++;
                    if(this.currentFrame == totalFrames){
                        this.currentFrame = 0;
                    }

                    this.position.y = yValues[this.currentFrame];
                    this.needRecalcRenderProperties = true;
                })
            }
        }), 10)
    }
}