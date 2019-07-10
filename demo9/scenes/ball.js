class BallScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    getPixels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;//i - y*size.x;
            let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] //`rgba(${imageData[i]}, ${imageData[i+1]}, ${imageData[2]}, ${ fastRoundWithPrecision(imageData[i+3]/255, 4)})`

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        
        //console.log(imageData);
        return pixels;
    }

    start(){
        this.ball = this.addGo(new BallGO({
            position: new V2(this.sceneCenter.x, this.sceneCenter.y-100),
            size: new V2(160, 160),
            imgSize: new V2(80,80),
            elipsisRadius: new V2(20,20)
        }))
    }
}

class BallGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            imgCache: []
        }, options)

        super(options);
    }

    init() {
        this.scale = this.size.x / this.imgSize.x;
        this.elipsisRadius = this.elipsisRadius || new V2(this.imgSize.x/2, this.imgSize.y/2);
        this.elipsisRadiusOrigin = this.elipsisRadius.clone();
        this.elipsisCenter = new V2(this.imgSize.x/2, this.imgSize.y/2);

        this.body = this.addChild(new GO({
            position: new V2(),
            size: this.size,
        }));

        this.createImg();

        this.timer = this.regTimerDefault(15, () => {
            if(this.rxChange){
                this.elipsisRadius.x = fast.r(easing.process(this.rxChange));
                this.rxChange.time++;
                if(this.rxChange.time > this.rxChange.duration){
                    this.rxChange = undefined;
                }
            }

            if(this.ryChange){
                this.elipsisRadius.y = fast.r(easing.process(this.ryChange));
                this.ryChange.time++;
                if(this.ryChange.time > this.ryChange.duration){
                    let onComplete = this.ryChange.onComplete;
                    this.ryChange = undefined;
                    if(onComplete){
                        onComplete();
                    }
                }
            }

            if(this.yChange){
                this.position.y = easing.process(this.yChange);
                this.needRecalcRenderProperties = true;
                this.yChange.time++;

                let onChange = this.yChange.onChange;
                if(onChange){
                    onChange();
                }
                if(this.yChange.time > this.yChange.duration){   
                    let onComplete = this.yChange.onComplete;
                    this.yChange = undefined;
                    if(onComplete){
                        onComplete();
                    }            
                }
            }

            if(this.body)
                this.createImg();
        });

        this.startSequence();
    }

    startSequence() {
        this.script.items = [
            // function() {
            //     this.yChange = easing.createProps(30, this.position.y, 400, 'quad', 'in');
            //     // this.yChange.onChange = () => {
            //     //     if(this.yChange.time == 20){
            //     //         this.processScript()
            //     //     }
            //     // };
            //     this.yChange.onComplete = () => this.processScript()
            // },
            // function() {
            //     this.yChange = easing.createProps(5, this.position.y, this.position.y + 40, 'quad', 'out');
            //     this.ryChange = easing.createProps(5, this.elipsisRadius.y, fast.r(this.elipsisRadius.y/3), 'quad', 'in');
            //     this.ryChange.onComplete = () => this.processScript()
            //     this.rxChange = easing.createProps(5, this.elipsisRadius.x, fast.r(this.elipsisRadius.x*1.5), 'quad', 'in');
            // },
            // //this.addProcessScriptDelay(100),
            // function() {
            //     this.ryChange = easing.createProps(5, this.elipsisRadius.y, this.elipsisRadiusOrigin.y, 'quad', 'out');
            //     this.rxChange = easing.createProps(5, this.elipsisRadius.x, this.elipsisRadiusOrigin.x, 'quad', 'out');
            //     this.yChange = easing.createProps(20, this.position.y, 100, 'quad', 'out');
            //     this.yChange.onComplete = () => this.processScript()
            // },
            // function() {
            //     this.startSequence();
            // }
            // function() {
            //     this.toPixels();
            //     this.processScript();
            // }
        ];

        this.processScript();
    }

    toPixels() {
        let topLeft = new V2(-this.size.x/2, -this.size.y/2);
        let pixels = this.parentScene.getPixels(this.body.img, this.imgSize).map(p => {
            return {
                size: new V2(1,1).mul(this.scale),
                position: topLeft.add(p.position.mul(this.scale)).add(new V2(1,1).mul(this.scale/2)),
                color: p.color
            }
        });

        this.removeChild(this.body);
        this.body = undefined;

        this.pixels = [];
        pixels.forEach(pixel => {
            this.pixels[this.pixels.length] = this.addChild(new GO({
                position: pixel.position,
                size: pixel.size,
                img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    hlp.setFillColor(colors.rgbToString({value: pixel.color})).dot(0,0);
                })
            }))
        });
    }

    fallPixels() {
        this.pixels.forEach(pixel => {
            pixel.addEffect(new FadeOutEffect({ effectTime: getRandomInt(250,1000), updateDelay: 30, initOnAdd: true, setParentDeadOnComplete: true }));
        })
    }

    createImg(){
        let key = this.elipsisRadius.x*1000 + this.elipsisRadius.y;
        if(!this.imgCache[key]){
            this.imgCache[key] = createCanvas(this.imgSize, (ctx, size, hlp) => {
                //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                hlp.setFillColor('white').elipsis(this.elipsisCenter, this.elipsisRadius);
            })
        }

        this.body.img = this.imgCache[key];
    }
}