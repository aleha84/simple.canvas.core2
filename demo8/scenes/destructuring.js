class DestrScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: []
            },

        }, options)

        super(options);
    }

    start() {
        let imgSize = new V2(4,8);
        let img = createCanvas(imgSize, (ctx, size) => {
            ctx.fillStyle = 'red';
            ctx.fillRect(1,0,2,size.y);
        })

        let scale = 10;

        this.demoGo = this.addGo(new GO({
            position: this.sceneCenter,
            size: imgSize.mul(scale),
            img: img,
            init() {
                let topLeft = new V2(-this.size.x/2, -this.size.y/2);
                this.pixels = this.parentScene.getPIxels(img, imgSize).map(p => {
                    let targetPosition = new V2();

                    targetPosition.x = fastRoundWithPrecision(this.size.x* getRandom(1,2) * (p.position.x >= imgSize.x/2 ? 1 : -1));
                    targetPosition.y = fastRoundWithPrecision(this.size.y/2 - this.size.y* getRandom(0,2));

                    this.addChild(new GO({
                        size: new V2(1,1).mul(scale),
                        position: topLeft.add(p.position.mul(scale)).add(new V2(1,1).mul(scale/2)),
                        img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'green'; ctx.fillRect(0,0,1,1); }),
                        duration: 50,
                        targetPosition,
                        init(){
                            this.xChange = { time: 0, duration: this.duration, change: this.targetPosition.x - this.position.x , type: 'quad', method: 'out', startValue: this.position.x }
                            this.yChange = { time: 0, duration: this.duration, change: this.targetPosition.y - this.position.y , type: 'quad', method: 'out', startValue: this.position.y }

                            this.moveTImer = this.registerTimer(createTimer(30, () => {
                                this.position.x = easing.process(this.xChange);
                                this.position.y = easing.process(this.yChange);

                                this.needRecalcRenderProperties = true;
                                
                                this.xChange.time++;
                                this.yChange.time++;

                                if(this.xChange.time > this.xChange.duration){
                                    this.unregTimer(this.moveTImer);
                                }

                            }, this. true));
                        }
                    }))
                })
                
            }
        }));


    }

    backgroundRender(){
        this.backgroundRenderDefault();
    }

    getPIxels(img, size) {
        let ctx = img.getContext("2d");
        let  pixels = [];

        let imageData = ctx.getImageData(0,0,size.x, size.y).data;

        for(let i = 0; i < imageData.length;i+=4){
            if(imageData[i+3] == 0)            
                continue;

            let y = fastFloorWithPrecision((i/4)/size.x);
            let x = (i/4)%size.x;//i - y*size.x;
            let color = `rgba(${imageData[i]}, ${imageData[i+1]}, ${imageData[2]}, ${ fastRoundWithPrecision(imageData[i+3]/255, 4)})`

            pixels[pixels.length] = { position: new V2(x,y), color };
        }
        
        //console.log(imageData);
        return pixels;
    }
}

