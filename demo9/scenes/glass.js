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

        this.flow = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.flowWidth = 20
                this.flowTime = 0;
                this.flowTimeDelta = 5;
                this.timer = this.regTimerDefault(30, () => {

                    this.flowTime+=this.flowTimeDelta;
                    if(this.flowTime > 360){
                        this.flowTime-=360;
                    }
                    else if(this.flowTime < -360){
                        this.flowTime+=360;
                    }
                    
                    this.createImg();
                })
            },
            createImg(){
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let x = 137; x < 210; x+=0.1){
                        let y = fast.r(Math.pow((x-size.x+35), 2)/40 -50);
                        
                        let xShift = Math.sin(degreeToRadians((y-this.flowTime)*3))*5;
                        let xShift2 = Math.sin(degreeToRadians((y-this.flowTime)*2))*6;
                        hlp.setFillColor('#EEEEEE').rect(fast.r(x+xShift), y, fast.r(this.flowWidth - xShift +xShift2), 1)
                    }
                })
            }
        }), 10)
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

        //this.splash1Change = easing.createProps(15, 60, 30, 'linear', 'base');
        this.splash1XTo = 60;
        this.wavesTime = 0;
        this.wavesTimeDelta = 0.5;


        this.timer = this.regTimerDefault(15, () => {
            if(this.splash1Change){
                this.splash1XTo = fast.r(easing.process(this.splash1Change));
                this.splash1Change.time++;

                if(this.splash1Change.time > this.splash1Change.duration){
                    this.splash1Change = undefined;
                }
            }

            this.wavesTime+=this.wavesTimeDelta;
            if(this.wavesTime > 360){
                this.wavesTime-=360;
            }
            else if(this.wavesTime < -360){
                this.wavesTime+=360;
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

            for(let x = 0; x < size.x; x++){
                let y1 = fast.r(Math.sin(degreeToRadians(x+this.wavesTime)*7)*3 + 50);
                let y2 = fast.r(Math.cos(degreeToRadians(x+this.wavesTime)*7)*6 + 4+ 50);

                if(y2 > y1){
                    hlp.setFillColor('#CCCCCC').rect(x,y1, 1, y2-y1)
                    // ctx.fillStyle = c1;
                    // ctx.fillRect(x, y, 1, y1-y)
                }

                hlp.setFillColor('#EEEEEE').rect(x,y2,1,size.y);
            }
            
            // for(let x = 0; x < size.x; x++){
            //     hlp.dot(x, fast.r(80+Math.pow((x-size.x/2 - 15),2)/15))
            // }
        })
    }
}