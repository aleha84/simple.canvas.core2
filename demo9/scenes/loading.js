class LoadingScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: false,
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
            scale: this.scale,
            isVisible: true,
        }));

        this.vpBar = this.addGo(new VerticalProgressBarGO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y),
            size: new V2(120, 326).toInt(),//125
            scale: this.scale,
            isVisible: false,
        }));

        this.cProgress = this.addGo(new CircleProgressGO({
            position: this.sceneCenter.clone(),
            size: new V2(this.viewport.x*0.8, this.viewport.x*0.8).toInt(),
            scale: this.scale,
            isVisible: false,
        })) 

        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                this.delayTimer = this.registerTimer(createTimer(1000, () => {
                    this.unregTimer(this.delayTimer);
                    this.delayTimer = undefined;
                    this.startSequence();
                }, this, false));
                
            },

            startSequence() {
                let scene = this.parentScene;
                this.script.items = [
                    //this.addProcessScriptDelay(500),
                    function() {
                        scene.debug.additional[0] = 'hpBar'
                        scene.hpBar.startProgress(() => this.processScript())
                        scene.cProgress.isVisible = false;
                        scene.cProgress.reset();
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
                        scene.debug.additional[0] = 'vpBar'
                        scene.vpBar.startProgress(() => this.processScript())
                    },
                    function() {
                        scene.hpBar.isVisible = false;
                        scene.hpBar.reset();
                        scene.vpBar.moveUpAndScale(() => 
                        {
                            scene.cProgress.isVisible = true;
                            this.processScript()
                        }
                        )
                    },
                    function() {
                        scene.debug.additional[0] = 'cProgress'
                        scene.cProgress.startProgress(() => this.processScript())
                    },
                    function() {
                        scene.vpBar.isVisible = false;
                        scene.vpBar.reset();
                        scene.cProgress.moveUpAndScale(() => 
                        {
                            scene.hpBar.isVisible = true;
                            this.processScript()
                        }
                        )
                    },
                    function() {
                        this.startSequence();
                    }
                ]

                this.processScript()
            }
        }))
    }
}

class CircleProgressGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            currentAngle: 0
        }, options)

        super(options);
    }

    init() {
        this.originPosition = this.position.clone();
        this.originSize = this.size.clone();

        this.updateProperties();
        this.createImage();
    }

    updateProperties() {
        this.imgSize = this.size.divide(this.scale).toInt();
        this.center = this.imgSize.divide(2).toInt();
        this.radius = fast.r(this.imgSize.x/2);
    }

    reset() {
        this.position = this.originPosition.clone();
        this.size = this.originSize.clone();
        this.updateProperties();
        this.currentAngle = 0;
        this.needRecalcRenderProperties = true;
        this.createImage();
    }

    startProgress(callback = () => {}) {
        this.angleCHange = easing.createProps(20, this.currentAngle, 360, 'quad', 'out');
        this.timer = this.regTimerDefault(30, () => {
            if(this.angleCHange) {
                
                this.currentAngle = fast.r(easing.process(this.angleCHange));
                this.createImage();

                this.angleCHange.time++;
                if(this.angleCHange.time > this.angleCHange.duration){
                    this.angleCHange = undefined;
                    this.unregTimer(this.timer);
                    this.timer = undefined;
                    callback();
                }
            }
        })
    }

    moveUpAndScale(callback = () => {}) {
        this.positionXChange = easing.createProps(30, this.position.x, 54, 'quad', 'inOut');
        this.sizeChange = easing.createProps(30, this.size.x, 52, 'quad', 'inOut');

        this.timer = this.regTimerDefault(15, () => {
            this.position.x = easing.process(this.positionXChange);
            let size = easing.process(this.sizeChange);
            this.size = new V2(size, size);
            this.needRecalcRenderProperties = true; 
            this.updateProperties();
            this.createImage();
            
            this.positionXChange.time++
            this.sizeChange.time++;

            if(this.positionXChange.time > this.positionXChange.duration){
                this.positionXChange = undefined;
                this.sizeChange =  undefined;
                this.unregTimer(this.timer);
                this.timer = undefined;
                callback();
            }
        });
    }

    createImage() {
        
        this.img = createCanvas(this.imgSize, (ctx, size, hlp) => {
            //hlp.setFillColor('blue').strokeRect(0,0,size.x, size.y);
            hlp.setFillColor('white');
            let up = V2.up;

            hlp.rect(this.center.x-3, 1, 6, size.y/2);

            for(let y = this.center.y-this.radius-1;y < this.center.y+this.radius;y++){
                for(let x = this.center.x-this.radius-1;x < this.center.x+this.radius;x++){
      
                    let _p = new V2(x,y);
                    let distance = this.center.distance(_p);
      
                    this.direction = this.center.direction(_p);
                    let angle = up.angleTo(this.direction);
                    if(angle< 0){
                        angle=angle+360
                    }

                    // -179 -> 181
                    // -90  -> 270
                    // -1   -> 359

                    if(distance < this.radius && (angle>0 && angle<=this.currentAngle)){
                        ctx.fillRect(x,y,1,1);
                    }
                }
            }

            hlp.rect(this.center.x-3, this.center.y-3, 6,6);
        })
        
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
        this.originPosition = this.position.clone();
        this.originSize = this.size.clone();
        this.imgSize = this.size.divide(this.scale).toInt();
        this.createImage();
    }

    reset() {
        this.position = this.originPosition.clone();
        this.size = this.originSize.clone();
        this.imgSize = this.size.divide(this.scale).toInt();
        this.needRecalcRenderProperties = true;
        this.currentHeight = 0;
        this.borderRadius = 7;
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

    moveUpAndScale(callback = () => {}) {
        this.sizeXChange = easing.createProps(30, this.size.x, 12, 'quad', 'inOut')
        this.sizeYChange = easing.createProps(30, this.size.y, 123, 'quad', 'inOut')
        this.borderRadiusChange = easing.createProps(30, this.borderRadius, 1, 'quad', 'inOut')
        this.positionYChange = easing.createProps(30, this.position.y, 194, 'quad', 'inOut')

        this.timer = this.regTimerDefault(15, () => {
            this.size = new V2(easing.process(this.sizeXChange), easing.process(this.sizeYChange)).toInt();
            this.borderRadius = fast.r(easing.process(this.borderRadiusChange));
            this.position.y = easing.process(this.positionYChange);
            this.needRecalcRenderProperties = true;
            this.imgSize = this.size.divide(this.scale).toInt()
            this.currentHeight = this.imgSize.y - this.borderRadius*2;
            this.createImage();

            this.sizeXChange.time++;
            this.sizeYChange.time++;
            this.borderRadiusChange.time++;
            this.positionYChange.time++;

            if(this.sizeXChange.time > this.sizeXChange.duration){
                this.sizeXChange = undefined;
                this.sizeYChange = undefined;
                this.borderRadiusChange = undefined;
                this.positionYChange = undefined;

                this.unregTimer(this.timer);
                this.timer = undefined;
                callback();
            }
        });
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
            imgCache: []
        }, options)

        super(options);
    }

    init() {
        this.originPosition = this.position.clone();
        this.originSize = this.size.clone();
        this.imgSize = this.size.divide(this.scale).toInt();
        this.createImage();
    }

    reset() {
        this.position = this.originPosition.clone();
        this.size = this.originSize.clone();
        this.imgSize = this.size.divide(this.scale).toInt();
        this.needRecalcRenderProperties = true;
        this.currentWidth = 0;
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
                //console.log(this.position, this.size);
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