class EyeScene extends Scene {
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

    drawCircle(ctx, center, radius){
        
        for(let y = center.y-radius-1;y < center.y+radius+1;y++){
            for(let x = center.x-radius-1;x < center.x+radius+1;x++){

                let _p = new V2(x,y);
                let distance = center.distance(_p);

                if(distance < radius){
                    ctx.fillRect(x,y,1,1);
                }
            }
        }
    }

    start(){
        this.go = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100, 50),
            img: createCanvas(new V2(100, 50), (ctx,size, hlp) => {
                hlp.setFillColor('green').strokeRect(0,0,size.x, size.y)
                let eyeMain = createCanvas(new V2(100, 50), (ctx,size, hlp) => {
                    
                    //hlp.setFillColor('red');
                    
                    let upperOrigin = {
                        start: -2,
                        end: 0.923,
                        yProportion: (y) => (size.y*y/2.05),
                        f: (x) => 1.1*Math.log10(0.7*(x + 2.05)) + 1.7
                    }
                    
                    let lowerOrigin = {
                        start: -2,
                        end: 0.923,
                        yProportion: (y) => (size.y*y/2.05),
                        f: (x) => 0.2*x*x*x + 0.65*x*x + 0.8*x + 0.6
                    }
                    let len = lowerOrigin.end - lowerOrigin.start;
                    lowerOrigin.step = len/size.x;
                    lowerOrigin.xProportion = (x) => (x+len)*size.x/len;
                    lowerOrigin.xBackProportion = (x) => (lowerOrigin.start + x*len/size.x);
                    
                    for(let x = 0; x < size.x; x++){
                        let lowerOriginX = lowerOrigin.xBackProportion(x);
                        let upperOriginY = upperOrigin.f(lowerOriginX);
                        let lowerOriginY = lowerOrigin.f(lowerOriginX);
                        let upperY = fast.r(upperOrigin.yProportion(upperOriginY)*-1 + size.y)-1;
                        let lowerY = fast.r(lowerOrigin.yProportion(lowerOriginY)*-1 + size.y)-1;
                        hlp.setFillColor('red').rect(x,upperY, 1, lowerY-upperY+1);
                    }
                });

                ctx.drawImage(eyeMain, 0,0)
                ctx.globalCompositeOperation = 'source-atop';
                let eyeBall = createCanvas(new V2(100, 50), (ctx,size, hlp) => {
                    hlp.setFillColor('green');
                    this.drawCircle(ctx, new V2(size.x/2, size.y/2), size.y/2)
                });
                ctx.drawImage(eyeBall, 0,0)
            })
        }))
    }
}