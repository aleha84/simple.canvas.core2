class GlassScene extends Scene {
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
        this.glass = this.addGo(new GlassSceneItemGO({
            position: this.sceneCenter.clone(),
        }))
    }
}

class GlassSceneItemGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(150, 250),
            scale: 2,
        }, options)

        super(options);
    }

    init() {
        this.bodySize = 
        this.body = this.addChild(new GO({
            size: this.size,
            imgSize: this.size.divide(this.scale).toInt(),
            position: new V2(),
        }));

        this.createBodyImage();

        this.splash1Change = easing.createProps(15, 60, 30, 'linear', 'base');
        this.splash1XTo = 60;

        this.timer = this.regTimerDefault(30, () => {
            if(this.splash1Change){
                this.splash1XTo = fast.r(easing.process(this.splash1Change));
                this.splash1Change.time++;

                if(this.splash1Change.time > this.splash1Change.duration){
                    this.splash1Change = undefined;
                }
            }
            
            this.createBodyImage();
        })
    }

    createBodyImage(){
        if(!this.bodyBackgroundImg){
            this.bodyBackgroundImg = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
                hlp.setFillColor('#5D9EA6');
                let points = [new V2(0,0), new V2(size.x-1, 0), new V2(fast.r(size.x*0.8-1), size.y-1), new V2(fast.r(size.x*0.2-1), size.y-1)];
                let pp = new PerfectPixel({context: ctx});
                let filledPixels = [];

                for(let i = 0; i < points.length;i++){
                    let p = points;
                    if(i < p.length-1)
                        filledPixels= [...filledPixels, ...pp.lineV2(p[i], p[i+1])];
                    else {
                        filledPixels = [...filledPixels, ...pp.lineV2(p[i], p[0])];
                        let uniquePoints = distinct(filledPixels, (p) => p.x+'_'+p.y);
                        pp.fill(uniquePoints, p)  
                    }    
                }
            });
        }
        

        this.body.img = createCanvas(this.body.imgSize, (ctx, size, hlp) => {
            ctx.drawImage(this.bodyBackgroundImg, 0,0)
            ctx.globalCompositeOperation = 'source-atop';
            hlp.setFillColor('red').strokeRect(0,0, size.x, size.y);
            hlp.setFillColor('green');
            
            let xFrom = 60; 
            let xTo = 30;
            let deltaX = xFrom-xTo;
            let radiusChange = easing.createProps(deltaX, 5,10, 'quad', 'in');

            for(let x = xFrom; x > this.splash1XTo; x--){
                radiusChange.time = xFrom-x;
                let y = fast.r(80+Math.pow((x-size.x/2 - 15),2)/15);
                hlp.сircle(new V2(x,y), fast.r(easing.process(radiusChange)));
                //hlp.dot(x, y)
            }
            
            // for(let x = 0; x < size.x; x++){
            //     hlp.dot(x, fast.r(80+Math.pow((x-size.x/2 - 15),2)/15))
            // }
        })
    }
}