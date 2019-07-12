class LoadingScene extends Scene {
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
        this.scale = 2;

        this.hpBar = this.addGo(new HorizontalProgressBarGO({
            position: this.sceneCenter.clone(),
            size: new V2(this.viewport.x*0.8, 50).toInt(),
            scale: this.scale
        }));

        this.vpBar = this.addGo(new VerticalProgressBarGO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: new V2(120, 326).toInt(),//125
            scale: this.scale,
            isVisible: false,
        }));

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                let scene = this.parentScene;
                this.script.items = [
                    this.addProcessScriptDelay(500),
                    function() {
                        scene.hpBar.startProgress(() => this.processScript())
                    },
                    function() {
                        scene.hpBar.moveUpAndScale(() => 
                        {
                            scene.vpBar.isVisible = true;
                            this.processScript()
                        }
                        )
                    },
                    function() {
                        scene.hpBar.isVisible = true;
                        scene.vpBar.startProgress(() => this.processScript())
                    },
                ]

                this.processScript()
            }
        }))
    }
}

class VerticalProgressBarGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            currentHeight: 0,
            renderValuesRound: true,
            borderRadius: 7
        }, options)

        super(options);
    }

    init() {
        this.imgSize = this.size.divide(this.scale).toInt();
        this.createImage();
    }

    startProgress(callback = () => {}) {
        this.heightChange = easing.createProps(20, this.currentHeight, this.imgSize.y - this.borderRadius*2, 'quad', 'out');
        this.timer = this.regTimerDefault(30, () => {
            if(this.heightChange) {
                
                this.currentHeight = fast.r(easing.process(this.heightChange));
                this.createImage();

                this.heightChange.time++;
                if(this.heightChange.time > this.heightChange.duration){
                    this.heightChange = undefined;
                    this.unregTimer(this.timer);
                    this.timer = undefined;
                    callback();
                }
            }
        })
    }

    createImage() {
        let r = this.borderRadius-1;
        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            //hlp.setFillColor('green').strokeRect(0,0,size.x, size.y);
            hlp.setFillColor('white')
                .сircle(new V2(this.borderRadius-1, this.borderRadius-1), this.borderRadius)
                .rect(this.borderRadius,0,size.x-this.borderRadius*2, this.borderRadius*2 - 1)
                .сircle(new V2(size.x - this.borderRadius, this.borderRadius-1), this.borderRadius)

            if(this.currentHeight > 0){
                hlp.rect(0, this.borderRadius, size.x, this.currentHeight)
                .сircle(new V2(this.borderRadius-1, this.borderRadius-1 + this.currentHeight), this.borderRadius)
                .rect(this.borderRadius,this.currentHeight,size.x-this.borderRadius*2, this.borderRadius*2 - 1)
                .сircle(new V2(size.x - this.borderRadius, this.borderRadius-1 + this.currentHeight), this.borderRadius)
            }
        })
    }
}

class HorizontalProgressBarGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            scale: 2,
            currentWidth: 0,
            renderValuesRound: true,
        }, options)

        super(options);
    }

    init() {
        this.imgSize = this.size.divide(this.scale).toInt();
        this.createImage();
    }

    startProgress(callback = () => {}) {
        this.widthChange = easing.createProps(20, this.currentWidth, this.imgSize.x - this.imgSize.y, 'quad', 'out');
        this.timer = this.regTimerDefault(30, () => {
            if(this.widthChange) {
                
                this.currentWidth = fast.r(easing.process(this.widthChange));
                this.createImage();

                this.widthChange.time++;
                if(this.widthChange.time > this.widthChange.duration){
                    this.widthChange = undefined;
                    this.unregTimer(this.timer);
                    this.timer = undefined;
                    callback();
                }
            }
        })
    }

    moveUpAndScale(callback = () => {}) {
        this.yChange = easing.createProps(30, this.position.y, 100, 'quad', 'inOut');
        this.sizeChange =  easing.createProps(30, 1, 0.5, 'quad', 'inOut');
        //this.sizeYChange = easing.createProps(15, 1, 1.5, 'quad', 'in');
        this.sizeOrigin = this.size.clone();
        this.currentWidthOrigin = this.currentWidth;

        this.timer = this.regTimerDefault(15, () => {
            this.position.y = easing.process(this.yChange);
            let sizeModifier = easing.process(this.sizeChange);
            //let sizeYModifier = easing.process(this.sizeYChange);
            this.size = this.sizeOrigin.mul(sizeModifier).toInt();
            //this.size.y = fast.r(this.size.y*sizeYModifier);
            this.imgSize = this.size.divide(this.scale).toInt();
            this.currentWidth = fast.r(this.imgSize.x - this.imgSize.y);

            this.needRecalcRenderProperties = true;
            this.createImage();

            this.yChange.time++;
            this.sizeChange.time++;
            //this.sizeYChange.time++;

            // if(this.sizeYChange.time > this.sizeYChange.duration){
            //     this.sizeYChange = easing.createProps(15, 1.5, 1, 'quad', 'out');
            // }

            if(this.yChange.time > this.yChange.duration){
                console.log(this.position, this.size);
                this.yChange = undefined;
                this.sizeChange =  undefined;
                this.unregTimer(this.timer);
                this.timer = undefined;
                callback();
            }
        })
    }

    createImage() {
        
        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            let yCenter = fast.r(size.y/2 - 1);
            let startX = fast.r(size.y/2 - 1);
            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            hlp.setFillColor('white').сircle(new V2(startX, yCenter), fast.r(size.y/2));
            if(this.currentWidth > 0) {
                hlp
                    .rect(startX, 0, this.currentWidth, size.y)
                    .сircle(new V2(startX+this.currentWidth, yCenter), fast.r(size.y/2));
            }
        })
    }
}