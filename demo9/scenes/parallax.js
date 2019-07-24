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
            let yDeviation = undefined;
            if(layerProps.yDeviationMultiplier)
                yDeviation = [fast.r(height*layerProps.yDeviationMultiplier[0]), fast.r(height*layerProps.yDeviationMultiplier[1])];//[fast.r(height*0.1), 0];
            else if(layerProps.evenYDeviationMultiplier) {
                yDeviation = {
                    even: [fast.r(height*layerProps.evenYDeviationMultiplier[0]), fast.r(height*layerProps.evenYDeviationMultiplier[1])],
                    odd: [fast.r(height*layerProps.oddYDeviationMultiplier[0]), fast.r(height*layerProps.oddYDeviationMultiplier[1])]
                }
            }
            dots[0] = new V2(0, initialY)
            for(let i = 1; i < dotsCount; i++) {
                let x = i*segWidth + getRandomInt(xDeviation[0],xDeviation[1]);
                let _yDeviation = undefined;
                if(layerProps.yDeviationMultiplier){
                    _yDeviation = yDeviation;
                }
                else {
                    _yDeviation = yDeviation.even;
                    if(i%2!= 0)
                    _yDeviation = yDeviation.odd;
                }

                let y = getRandomInt(_yDeviation[0],_yDeviation[1]);

                dots[i] = new V2(x,y);
            }

            dots[dotsCount-1] = new V2(width, initialY)    
        }
        else {
            dots = layerProps.dots;
        }
        let speed = (layerProps.layerIndex+1)/2;
        
        let layerItems = [];

        for(let i = 0; i < 2; i++){
            layerItems[i] =
            this.addGo(new MountainParallaxLayer({
                sharp: layerProps.sharp,
                size: new V2(width, height),
                position: layerProps.position.add(new V2(this.viewport.x*i, 0)),//new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
                colorChangeHeight,
                ...layerProps.color,
                dots,  //[new V2(0,150), new V2(75, 60), new V2(200, 100), new V2(350, 50), new V2(500, 150)]
                speed
            }), layerProps.layerIndex);
        }

        return layerItems
    }

    start(){
        this.mountainsLayers = [
            ...this.createMountainsLayer({

                dotsCount: 9,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-20,20],
                evenYDeviationMultiplier: [0.1, 0.2],
                oddYDeviationMultiplier: [0.5, 0.6],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
                color: {
                    h: 36, s: [35, 44], v: [72, 65],
                },
                layerIndex: 0
            }),
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 21,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-5,5],
                evenYDeviationMultiplier: [0.4, 0.5],
                oddYDeviationMultiplier: [0.7, 0.8],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 5),
                color: {
                    h: 35, s: [13, 36], v: [97, 90],
                },
                layerIndex: 1
            }),
            ...this.createMountainsLayer({
                dotsCount: 13,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-5,5],
                evenYDeviationMultiplier: [0.2, 0.3],
                oddYDeviationMultiplier: [0.5, 0.6],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 10),
                color: {
                    h: 36, s: [32, 48], v: [72, 60],
                },
                layerIndex: 2
            }),
            ...this.createMountainsLayer({
                dotsCount: 15,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [0,0],
                evenYDeviationMultiplier: [0.4, 0.5],
                oddYDeviationMultiplier: [0.5, 0.6],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 15),
                color: {
                    h: 36, s: [37, 56], v: [72, 58],
                },
                layerIndex: 3
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
            renderValuesRound: true,
            h: 36,
            s: [32, 48],
            v: [72, 60],
        }, options)

        super(options);
    }

    init() {
        if(!this.sharp)
            this.formula = mathUtils.getCubicSplineFormula(this.dots);
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            //hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            let allY = [];
            if(!this.sharp){
                for(let x = 0; x < size.x; x++){
                    allY[x] = fast.r(this.formula(x));
                    hlp.setFillColor('blue').rect(x, allY[x], 1, size.y);
                }
            }
            else {
                hlp.setFillColor('blue');
                let pp = new PerfectPixel({context: ctx});
                let allPoints = [];
                for(let i = 1; i < this.dots.length;i++){
                    allPoints= [...allPoints, ...pp.line(this.dots[i-1].x, this.dots[i-1].y, this.dots[i].x, this.dots[i].y)];
                }

                for(let i = 0; i < allPoints.length; i++){
                    hlp.rect(allPoints[i].x, allPoints[i].y, 1, size.y);
                }

                allY = allPoints.map(p => p.y);
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

        this.timer = this.regTimerDefault(15, () => {
            this.position.x-=this.speed;
            if(this.position.x <= -this.parentScene.viewport.x/2){
                let delta = this.position.x - (-this.parentScene.viewport.x/2);
                this.position.x = fast.f(this.parentScene.viewport.x/2 + this.parentScene.viewport.x)+ delta;
            }

            this.needRecalcRenderProperties = true;
        })
    }
}