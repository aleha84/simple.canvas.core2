class Demo9HealthbarScene extends Scene {
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
        this.hb1 = this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(1,1),
            init() {
                this.cornersWidth = 10;
                this.height = 20;
                this.segmentWidth = 10;
                this.segmentsCount = 10;
                this.size = new V2(this.segmentsCount*this.segmentWidth + this.cornersWidth*2, this.height).toInt();
                this.models = Demo9HealthbarScene.models.hb1;

                this.backgroundImg = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(PP.createImage(this.models.background.left), 0,0);
                    let bgSegImg = PP.createImage(this.models.background.segment);
                    let currentX = this.cornersWidth;
                    for(let i = 0; i < this.segmentsCount; i++){
                        ctx.drawImage(bgSegImg, currentX,0);
                        currentX+=this.segmentWidth;
                    }

                    ctx.drawImage(PP.createImage(this.models.background.right), currentX,0);
                })

                this.foregroundImg = createCanvas(this.size, (ctx, size, hlp) => {
                    let segHeight = 2;

                    ctx.drawImage(PP.createImage(this.models.foreground.left), 0,0);
                    let topSegImg = PP.createImage(this.models.foreground.top);
                    let bottomSegImg = PP.createImage(this.models.foreground.bottom);

                    let currentX = this.cornersWidth;
                    for(let i = 0; i < this.segmentsCount; i++){
                        ctx.drawImage(topSegImg, currentX,0);
                        ctx.drawImage(bottomSegImg, currentX,size.y-segHeight);
                        currentX+=this.segmentWidth;
                    }

                    ctx.drawImage(PP.createImage(this.models.foreground.right), currentX,0);
                })

                this.createImage();
            },
            createImage() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(this.backgroundImg, 0,0);
                    // ctx.globalCompositeOperation = 'source-atop';
                    // hlp.setFillColor('rgba(255,255,255,0.5)');
                    // hlp.rect(0,0,size.x/2, size.y);

                    ctx.globalCompositeOperation = 'source-over';
                    ctx.drawImage(this.foregroundImg, 0,0);
                })
            }

        }), 1)
    }
}