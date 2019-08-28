class MountainsParallaxScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
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
        
        let height = layerProps.height || fast.r(this.viewport.y/2);
        let speed = (layerProps.layerIndex+1)/4;
        let width = this.viewport.x;
        let layerItems = [];
        let colorChangeHeight = layerProps.colorChangeHeight; //50;
        
        let layersCount = 2;
        if(layerProps.count){
            layersCount = layerProps.count;
        }

        let firstInitialY = undefined;
        let currentLayerLastY = undefined;
        for(let i = 0; i < layersCount; i++){

            let dots = [];
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
                if(i == 0 && firstInitialY == undefined){
                    firstInitialY = initialY;
                }

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

                let lastY = initialY;
                if(i == layersCount-1){
                    lastY = firstInitialY;
                }

                currentLayerLastY = lastY;
                dots[dotsCount-1] = new V2(width, lastY)    
            }
            else {
                dots = layerProps.dots;
            }

            layerItems[i] =
            this.addGo(new MountainParallaxLayer({
                sharp: layerProps.sharp,
                size: new V2(width, height),
                position: layerProps.position.add(new V2(this.viewport.x*i, 0)),//new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
                colorChangeHeight,
                ...layerProps.color,
                color: layerProps.colorHEX,
                secondaryColorHEX: layerProps.secondaryColorHEX,
                dots,  //[new V2(0,150), new V2(75, 60), new V2(200, 100), new V2(350, 50), new V2(500, 150)]
                speed,
                grass: layerProps.grass,
                resetXToViewportMultiplier: layersCount-1
            }), layerProps.layerIndex);
        }

        return layerItems
    }

    start(){
        this.mountainsLayers = [
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 13,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-25,25],
                evenYDeviationMultiplier: [0.7, 0.8],
                oddYDeviationMultiplier: [0.2, 0.3],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 5),
                color: {
                    h: 35, s: [13, 11], v: [85, 80],
                },
                layerIndex: 0
            }),
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
                layerIndex: 1
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
                layerIndex: 2
            }),
            ...this.createMountainsLayer({
                dotsCount: 13,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-10,10],
                evenYDeviationMultiplier: [0.25, 0.35],
                oddYDeviationMultiplier: [0.5, 0.6],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 10),
                color: {
                    h: 36, s: [32, 48], v: [72, 60],
                },
                layerIndex: 3
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
                layerIndex: 4
            }),
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 20,
                randomiseDots: true,
                initialYMultiplier: 0.5,
                xDeviation: [-10,10],
                evenYDeviationMultiplier: [0.3, 0.55],
                oddYDeviationMultiplier: [0.5, 0.65],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 40),
                colorHEX: '#B5AAB7',
                count: 4,
                layerIndex: 10
            }),
            ...this.createMountainsLayer({
                dotsCount: 9,
                randomiseDots: true,
                initialYMultiplier: 0.65,
                xDeviation: [-10,10],
                evenYDeviationMultiplier: [0.5, 0.55],
                oddYDeviationMultiplier: [0.6, 0.65],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 30),
                colorHEX: '#AB9FAD',
                count: 4,
                layerIndex: 11
            }),
            ...this.createMountainsLayer({
                dotsCount: 10,
                randomiseDots: true,
                initialYMultiplier: 0.6,
                xDeviation: [0,0],
                evenYDeviationMultiplier: [0.5, 0.55],
                oddYDeviationMultiplier: [0.56, 0.6],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 50),
                colorHEX: '#897793',
                count: 4,
                layerIndex: 12
            }),
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 10,
                randomiseDots: true,
                initialYMultiplier: 0.55,
                xDeviation: [0,0],  
                yDeviationMultiplier: [0.5, 0.7],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 70),
                colorHEX: '#58D586',
                secondaryColorHEX: '#5D4B68',
                count: 4,
                layerIndex: 18,
                grass: {
                    r1: [5, 10],
                    r2: [2,3],
                    r3: [1,2],
                    h1: 10,
                    h2: 5,
                    h3: 7
                }
            }),
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 10,
                randomiseDots: true,
                initialYMultiplier: 0.55,
                xDeviation: [0,0],  
                yDeviationMultiplier: [0.5, 0.7],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 95),
                colorHEX: '#317A4C',
                secondaryColorHEX: '#342B3A',
                count: 4,
                layerIndex: 19,
                grass: {
                    r1: [5, 10],
                    r2: [2,3],
                    r3: [1,2],
                    h1: 10,
                    h2: 5,
                    h3: 7
                },
                
            }),
            ...this.createMountainsLayer({
                sharp: true,
                dotsCount: 10,
                randomiseDots: true,
                initialYMultiplier: 0.55,
                xDeviation: [0,0],  
                yDeviationMultiplier: [0.5, 0.7],
                colorChangeHeight: 50,
                position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4) + 130),
                colorHEX: '#225234',
                secondaryColorHEX: '#241B27',
                count: 4,
                layerIndex: 20,
                grass: {
                    r1: [5, 10],
                    r2: [2,3],
                    r3: [1,2],
                    h1: 10,
                    h2: 5,
                    h3: 7
                }
            })
        ];

        let test = 'true';
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
        let pp;
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
                pp = new PerfectPixel({context: ctx});
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
                if(this.color) {
                    hlp.setFillColor(this.color).rect(0, 0, 1, size.y);    
                }
                else {
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
                }
                
            });

            ctx.globalCompositeOperation = 'source-atop';

            ctx.drawImage(foregroundLineImg, 0, minY, size.x, dHeight);

            ctx.globalCompositeOperation = 'source-over';
            if(this.layerIndex == 0) {
                for(let i = 0; i < 30; i++){
                    hlp.setFillColor('#FDFDFD').rect(getRandomInt(10, size.x-60), getRandomInt(20, 50), getRandomInt(30, 60), 1)
                }
            }

            if(this.grass){
                
                let grassX = getRandomInt(this.grass.r1[0], this.grass.r1[1]);
                hlp.setFillColor(this.color);
                while(grassX < size.x){
                    let grassY = allY[grassX] + 2;

                    pp.line(grassX, grassY, grassX, grassY-getRandomInt(5,6));
                    pp.line(grassX-1, grassY, grassX-1, grassY-getRandomInt(3,5));
                    pp.line(grassX+1, grassY, grassX+1, grassY-getRandomInt(3,5));
                    grassX+=getRandomInt(this.grass.r1[0], this.grass.r1[1]);
                }

                let darkerGrassColor =  colors.changeHSV({initialValue: this.color, parameter: 'v', amount: -10});
                //hlp.setFillColor(darkerGrassColor);
                
                // let darkX = 0;
                // while(darkX < size.x){

                //     darkX +=(this.grass.r2[0], this.grass.r2[1])
                // }
                // for(let x = 0; x < allY.length;x++){
                //     hlp.setFillColor(darkerGrassColor).rect(x, allY[x]+ 10, 1, size.y)
                //     //.setFillColor(this.secondaryColorHEX).rect(x,allY[x]+ 15, 1, size.y)

                // }
            }
            // ctx.globalCompositeOperation = 'source-over';
            // ctx.font = '10px Arial';
            // ctx.fillStyle = 'red';
            // for(let d = 0; d < this.dots.length;d++){
            //     ctx.fillText(this.dots[d].toString(), this.dots[d].x, this.dots[d].y)
            // }
        })

        this.timer = this.regTimerDefault(15, () => {
            this.position.x-=this.speed;
            if(this.position.x <= -this.parentScene.viewport.x/2){
                let delta = this.position.x - (-this.parentScene.viewport.x/2);
                this.position.x = fast.f(this.parentScene.viewport.x/2 + this.parentScene.viewport.x*this.resetXToViewportMultiplier)+ delta;
            }

            this.needRecalcRenderProperties = true;
        })
    }
}