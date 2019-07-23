class MountainsParallaxScene extends Scene {
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
        this.backgroundRenderDefault('#BCA380');
    }

    createMountainsLayer(layerProps) {
        let dots = [];
        let height = layerProps.height || fast.r(this.viewport.y/2);
        let width = this.viewport.x;
        
        let colorChangeHeight = layerProps.colorChangeHeight; //50;
        if(layerProps.randomiseDots){
            let dotsCount = layerProps.dotsCount; //20;
            let segWidth = fast.r(width/dotsCount)
            let initialY = fast.r(height*layerProps.initialYMultiplier)//0.2);
            let xDeviation = layerProps.xDeviation;//[-5,5];
            let yDeviation = [fast.r(height*layerProps.yDeviationMultiplier[0]), fast.r(height*layerProps.yDeviationMultiplier[1])];//[fast.r(height*0.1), 0];

            dots[0] = new V2(0, initialY)
            for(let i = 1; i < dotsCount-1; i++) {
                let x = i*segWidth + getRandomInt(xDeviation[0],xDeviation[1]);
                let y = initialY - getRandomInt(yDeviation[0],yDeviation[1]);
                dots[i] = new V2(x,y);
            }

            dots[dotsCount-1] = new V2(width, initialY)    
        }
        else {
            dots = layerProps.dots;
        }
        

        return this.addGo(new MountainParallaxLayer({
            size: new V2(width, height),
            position: layerProps.position,//new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
            colorChangeHeight,
            ...layerProps.color,
            dots  //[new V2(0,150), new V2(75, 60), new V2(200, 100), new V2(350, 50), new V2(500, 150)]
        }), layerProps.layerIndex);
    }

    start(){
        this.mountainsLayers = [
            this.createMountainsLayer({
                dots: [new V2(0,50), new V2(50, 30), new V2(70, 70), 
                new V2(160, 50), new V2(180, 80), new V2(200, 40), new V2(220, 60), new V2(260, 30), new V2(300, 100),
                new V2(500, 100)],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
                color: {
                    h: 36, s: [35, 44], v: [72, 65],
                },
                layerIndex: 0
            }),
            this.createMountainsLayer({
                dots: [new V2(0,60), new V2(100, 30), new V2(130, 50), new V2(160, 30), new V2(200, 100), 
                new V2(320, 30), new V2(340, 60), new V2(500, 150)],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 10),
                color: {
                    h: 36, s: [32, 48], v: [72, 60],
                },
                layerIndex: 1
            })
        ];

        // let dots = [];
        // let dotsCount = 20;
        // let height = fast.r(this.viewport.y/2);
        // let width = this.viewport.x;
        // let segWidth = fast.r(width/dotsCount)
        // let initialY = fast.r(height*0.2);
        // let xDeviation = [-5,5];
        // let yDeviation = [fast.r(height*0.1), 0];
        // let colorChangeHeight = 50;
        // dots[0] = new V2(0, initialY)
        // for(let i = 1; i < dotsCount-1; i++) {
        //     let x = i*segWidth + getRandomInt(xDeviation[0],xDeviation[1]);
        //     let y = initialY - getRandomInt(yDeviation[0],yDeviation[1]);
        //     dots[i] = new V2(x,y);
        // }

        // dots[dotsCount-1] = new V2(width, initialY)

        // this.addGo(new MountainParallaxLayer({
        //     size: new V2(width, height),
        //     position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
        //     colorChangeHeight,
        //     dots  //[new V2(0,150), new V2(75, 60), new V2(200, 100), new V2(350, 50), new V2(500, 150)]
        // }), 1);
    }
}

class MountainParallaxLayer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            h: 36,
            s: [32, 48],
            v: [72, 60],
        }, options)

        super(options);
    }

    init() {
        this.formula = mathUtils.getCubicSplineFormula(this.dots);
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            let allY = [];
            for(let x = 0; x < size.x; x++){
                allY[x] = fast.r(this.formula(x));
                hlp.setFillColor('blue').rect(x, allY[x], 1, size.y);
            }

            let minY = Math.min.apply(null, allY);
            let dHeight = size.y-minY;
            let foregroundLineImg = createCanvas(new V2(1, dHeight), (ctx, size, hlp) => {
                let colorChangeHeight = this.colorChangeHeight || size.y;

                let sChange = easing.createProps(colorChangeHeight, this.s[0], this.s[1], 'linear', 'base');
                let vChange = easing.createProps(colorChangeHeight, this.v[0], this.v[1], 'linear', 'base');

                let maxColor = colors.hsvToHex([this.h, this.s[1], this.v[1]])
                for(let y = 0; y < size.y; y++){
                    let color = undefined;
                    if(y <= colorChangeHeight){
                        sChange.time = y;
                        vChange.time = y;
                        color = colors.hsvToHex([this.h, fast.r(easing.process(sChange)), fast.r(easing.process(vChange))]);
                        //hlp.setFillColor().dot(0, y);    
                    }
                    else {
                        //colors.hsvToHex([this.h, fast.r(easing.process(sChange)), fast.r(easing.process(vChange))])
                        color = maxColor;
                    }

                    hlp.setFillColor(color).dot(0, y);    
                    
                }
            });

            ctx.globalCompositeOperation = 'source-atop';

            ctx.drawImage(foregroundLineImg, 0, minY, size.x, dHeight);
        })
    }
}