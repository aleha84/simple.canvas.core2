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
        // this.backgroundRenderDefault('#c0c0c0');
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
                    function() {
                        scene.flow.startAnimation();
                        this.processScript();
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

        let debugFrame =4;

        this.bg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img: PP.createImage(Hageray_coScene.models.bg),
        }), 0)

        this.jebena = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(Hageray_coScene.models.jebenaFrames),
            init() {
                this.img = this.frames[0];
                //this.img = this.frames[debugFrame];
            }
        }), 1)

        this.flow = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            frames: PP.createImage(Hageray_coScene.models.flow),
            startAnimation() {
                this.currentFrame = 0;
                this.img = this.frames[this.currentFrame];
                
                this.timer = this.regTimerDefault(100, () => {
                
                    this.img = this.frames[this.currentFrame];
                    this.currentFrame++;
                    if(this.currentFrame == this.frames.length){
                        this.stopAnimation();
                    }
                })
            },
            stopAnimation() {
                this.unregTimer(this.timer);
                this.timer = undefined;
            }
        }), 2)

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
                //this.img = this.frames[debugFrame];
            }
        }), 3)

        this.coffeBag = this.addGo(new GO({
            position: new V2(25, 75),
            size: new V2(90,60),
            img:  PP.createImage(Hageray_coScene.models.coffeBag)
        }), 4)

        this.coffeBeans = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            img:  PP.createImage(Hageray_coScene.models.coffeBeans)
        }), 2)

        let beansImgs = {
            bean1: PP.createImage(Hageray_coScene.models.bean1),
            bean2: PP.createImage(Hageray_coScene.models.bean2),
            bean3: PP.createImage(Hageray_coScene.models.bean3),
            bean4: PP.createImage(Hageray_coScene.models.bean4)
        }
        let beans = [
            {p: new V2(138,93), img:beansImgs.bean1 },
            {p: new V2(117,86), img:beansImgs.bean1 },
            {p: new V2(101,94), img:beansImgs.bean2 },
            {p: new V2(105,87), img:beansImgs.bean3 },
            {p: new V2(63,95), img:beansImgs.bean3 },
            {p: new V2(120,93), img:beansImgs.bean4 }
        ]

        this.beans = beans.map(bean => this.addGo(new GO({
            position: bean.p,
            size: new V2(6,6),
            img:  bean.img
        }), 2))
    }
}