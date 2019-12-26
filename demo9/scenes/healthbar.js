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
                this.model = Demo9HealthbarScene.models.hb1;

                this.backgroundImg = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(PP.createImage(this.model, {renderOnly: ['bg_left']}), 0,0);

                    let bgSegImg = PP.createImage(this.model, {renderOnly: ['bg_center']});
                    let currentX = this.cornersWidth;
                    for(let i = 0; i < this.segmentsCount; i++){
                        ctx.drawImage(bgSegImg, currentX-this.cornersWidth,0);
                        currentX+=this.segmentWidth;
                    }

                    ctx.drawImage(PP.createImage(this.model, {renderOnly: ['bg_right']}), currentX-this.cornersWidth-this.segmentWidth,0);
                })

                this.foregroundImg = createCanvas(this.size, (ctx, size, hlp) => {
                    ctx.drawImage(PP.createImage(this.model, {renderOnly: ['fg_left']}), 0,0);

                    let fgSegImg = PP.createImage(this.model, {renderOnly: ['fg_center']});
                    let currentX = this.cornersWidth;
                    for(let i = 0; i < this.segmentsCount; i++){
                        ctx.drawImage(fgSegImg, currentX-this.cornersWidth,0);
                        currentX+=this.segmentWidth;
                    }

                    ctx.drawImage(PP.createImage(this.model, {renderOnly: ['fg_right']}), currentX-this.cornersWidth-this.segmentWidth,0);
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