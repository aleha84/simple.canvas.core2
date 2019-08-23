class ToyProgressScene extends Scene {
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
        this.backgroundRenderDefault('#DDDDDD');
    }

    start(){
        this.basement = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(250,150),
            init() {
                this.initialWidth = 40;
                this.width = this.initialWidth;
                this.height = 40;
                this.startX = 10;
                this.centralLinePadding = 10;
                this.xShift = 40;
                this.maxWidth = this.size.x - 2*this.startX - this.xShift;
                this.createImage();

                this.makeWider();
            },
            makeWider() {
                this.widthChange = easing.createProps(50, this.initialWidth, this.maxWidth,'quad', 'inOut');
                this.widthChange.onComplete = () => {
                    this.unregTimer(this.timer);   
                    this.time = undefined; 
                }
                this.widthChange.onChange = () => {
                    this.createImage();
                }

                this.timer = this.regTimerDefault(15, () => {
                    easing.commonProcess({
                        context: this, 
                        propsName: 'widthChange',
                        targetpropertyName: 'width'
                    })
                })
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                    let pp = new PerfectPixel({context: ctx})
                    let midY = fast.r(size.y/2);
                    let heightHalf = fast.r(this.height/2);

                    hlp.setFillColor('white');
                    for(let i = 0;i < this.width;i++){
                        pp.line(this.startX+i, midY+heightHalf, this.startX+i+this.xShift, midY-heightHalf)
                    }

                    hlp.setFillColor('black')
                        .rect(this.startX + fast.r(this.xShift/2) + this.centralLinePadding, midY-1, this.width-this.centralLinePadding*2,1)
                        .rect(this.startX + fast.r(this.xShift/2) + this.centralLinePadding - 1, midY, this.width-this.centralLinePadding*2,1)
                        //.rect(this.startX + fast.r(this.xShift/2) + this.centralLinePadding -2, midY+1, this.width-this.centralLinePadding*2,1)

                    hlp.setFillColor('gray');
                    for(let i = 1; i < 10; i++){
                        pp.line(this.startX+this.width-1, midY+heightHalf + i, this.startX+this.xShift + this.width-1, midY-heightHalf + i)
                    }

                    hlp.setFillColor('lightgray');
                    hlp.rect(this.startX, midY + heightHalf+1, this.width, 9)
                })
            }
        }))
    }
}