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
            size: new V2(this.viewport.x*0.8, 50).toInt()
        }));
    }
}

class HorizontalProgressBarGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            scale: 2,
            currentWidth: 0,
        }, options)

        super(options);
    }

    init() {
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
        this.yChange = easing.createProps(30, this.position.y, 100, 'quad', 'out');
        this.sizeChange =  easing.createProps(30, 1, 0.5, 'quad', 'out');
        this.sizeOrigin = this.size.clone();
        this.currentWidthOrigin = this.currentWidth;

        this.timer = this.regTimerDefault(15, () => {
            this.position.y = easing.process(this.yChange);
            let sizeModifier = easing.process(this.sizeChange);
            this.size = this.sizeOrigin.mul(sizeModifier).toInt();
            this.currentWidth = fast.r(this.currentWidthOrigin*sizeModifier) - 1;

            this.needRecalcRenderProperties = true;
            this.createImage();

            this.yChange.time++;
            this.sizeChange.time++;
            if(this.yChange.time > this.yChange.duration){
                this.yChange = undefined;
                this.sizeChange =  undefined;
                this.unregTimer(this.timer);
                this.timer = undefined;
                callback();
            }
        })
    }

    createImage() {
        this.imgSize = this.size.divide(this.scale).toInt();
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