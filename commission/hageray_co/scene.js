class Hageray_coScene extends Scene {
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
        this.backgroundRenderDefault('#c0c0c0');
    }

    start(){
        this.sceneManager = this.addGo(new GO({
            position: new V2(0,0),
            size: new V2(1,1),
            init() {
                this.startSequence();
            },
            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    this.addProcessScriptDelay(1000),
                    function() {
                        let currentFrame = 0;
                        this.framesChangeTimer = this.regTimerDefault(200, () => {
                            //console.log(currentFrame);
                            scene.jebena.img = scene.jebena.frames[currentFrame];
                            scene.woman.img = scene.woman.frames[currentFrame];
                            
                            currentFrame++;
                            if(currentFrame == 5){
                                this.unregTimer(this.framesChangeTimer);
                                this.framesChangeTimer = undefined;
                                this.processScript();
                            }
                        })
                    },
                    this.addProcessScriptDelay(1000),
                    function() {
                        let currentFrame = 4;
                        this.framesChangeTimer = this.regTimerDefault(200, () => {
                            //console.log(currentFrame);
                            scene.jebena.img = scene.jebena.frames[currentFrame];
                            scene.woman.img = scene.woman.frames[currentFrame];
                            
                            currentFrame--;
                            if(currentFrame == -1){
                                this.unregTimer(this.framesChangeTimer);
                                this.framesChangeTimer = undefined;
                                this.processScript();
                            }
                        })
                    },
                    function(){
                        this.startSequence();
                    }
                ]

                this.processScript();
            }
        }), 1)

        //let debugFrame =4;
        this.jebena = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(Hageray_coScene.models.jebenaFrames),
            init() {
                this.img = this.frames[0];
            }
        }), 1)

        this.cupImg = PP.createImage(Hageray_coScene.models.cup);

        this.cup = this.addGo(new GO({
            position: new V2(89.5,80.5),
            size: new V2(35,35),
            img: this.cupImg
        }), 2)

        this.woman = this.addGo(new GO({
            position: new V2(74,70.5),
            size: new V2(30,45),
            frames: PP.createImage(Hageray_coScene.models.womanFrames),
            init() {
                this.img = this.frames[0];
            }
        }), 3)
    }
}