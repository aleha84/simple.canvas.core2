class StarsSkyScene extends Scene {
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y);
                let cValue = colors.createColorChange('#000000', '#0D1024', 'hex', size.y/2, 'quad', 'in');//'#383A4C'
                for(let y = size.y/2; y < size.y; y++){
                    let index = y-(size.y/2);
                    index = fast.r(index/4)*4;
                    hlp.setFillColor(cValue[index]).rect(0, y, size.x, 1)
                }

                //hlp.setFillColor('red').rect(0,10, size.x, 10)
            })
        }), 1)

        this.nebullas = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let nParams = [
                        {
                            hsv: [230,58,45],
                            sizeClamps: [30,60],
                            maskCirclesCount: 5,
                            maskPositions: [new V2(77,12),new V2(32,35),new V2(12,75),new V2(4,100),new V2(86,51)],
                            time: 0,
                            paramsDivider: 20,
                            noiseMultiplier: 0.7
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [30,60],
                            maskCirclesCount: 5,
                            maskPositions: [new V2(0, 7),new V2(54, 20),new V2(88, 52),new V2(97, 89)
                            ],
                            time: 0,
                            paramsDivider: 20,
                            noiseMultiplier: 0.75
                        },
                        {
                            hsv: [230,58,45],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(70,30),new V2(84,76),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(10,100),new V2(25,18),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [280,52,35],
                            sizeClamps: [20,40],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(80,55),new V2(12,76),
                            ],
                            time: 0,
                            paramsDivider: 12,
                            //positionOnlyInside: true
                        },
                        {
                            hsv: [210,73,32],
                            sizeClamps: [10,15],
                            maskCirclesCount: 2,
                            maskPositions: [new V2(23, 18),new V2(68, 33),new V2(83, 83),
                            ],
                            time: 0,
                            paramsDivider: 8,
                            positionOnlyInside: true,
                            maskMaxOpacity: 0.2
                        },
                        {
                            hsv: [280,52,35],
                            sizeClamps: [5,10],
                            //maskCirclesCount: 1,
                            maskPositions: [
                                new V2(15,80), new V2(60,27)
                            ],
                            time: 0,
                            paramsDivider: 10,
                            positionOnlyInside: true,
                            maskMaxOpacity: 0.2
                        }
                    ]

                    nParams.forEach(params => {
                        let {hsv, sizeClamps, maskCirclesCount, maskPositions, time, paramsDivider, positionOnlyInside, maskMaxOpacity, noiseMultiplier} = params;

                        if(maskMaxOpacity == undefined)
                            maskMaxOpacity = 0.15

                        var pn = new mathUtils.Perlin('random seed ' + getRandom(0,1000));
                        // let paramsDivider = 10;
                        // let time = 0
                        // let sizeClamps = [20,40];
                        // let maskCirclesCount = 5;

                        let mask = createCanvas(size, (ctx, size, hlp) => {
                            //let sizeClamps = [size.x/10,size.x/4];
                            let count = maskPositions.length;
                            // if(maskCirclesCount != undefined)
                            //     count = maskCirclesCount;

                            for(let i =0; i <  count; i++){
                                let position = maskPositions[i];
                                // let position = new V2(getRandomInt(-sizeClamps[1]/2,size.x), getRandomInt(-sizeClamps[1]/2, size.y*2/3));
                                // if(positionOnlyInside){
                                //     position = new V2(getRandomInt(sizeClamps[1], size.x-sizeClamps[1]), getRandomInt(sizeClamps[1], size.y-sizeClamps[1]));
                                // }

                                let lightEllipsis = {
                                    position,
                                    size: new V2(getRandomInt(sizeClamps[0], sizeClamps[1]), getRandomInt(sizeClamps[0], sizeClamps[1]))
                                }
                    
                                lightEllipsis.rxSq = lightEllipsis.size.x*lightEllipsis.size.x;
                                lightEllipsis.rySq = lightEllipsis.size.y*lightEllipsis.size.y;
                                let pp = new PerfectPixel({ctx});
                                let aChange = easing.createProps(100, maskMaxOpacity, 0, 'quad', 'out');
                                pp.fillStyleProvider = (x,y) => {
                
                                    let dx = fast.r(
                                        (((x-lightEllipsis.position.x)*(x-lightEllipsis.position.x)/lightEllipsis.rxSq) 
                                        + ((y-lightEllipsis.position.y)*(y-lightEllipsis.position.y)/lightEllipsis.rySq))*100);
                
                                    if(dx > 100){
                                        dx = 100;
                                    }
                
                                    aChange.time = dx;
                
                                    return `rgba(255,255,255,${fast.r(easing.process(aChange),2)})`;
                                }
                                pp.fillByCornerPoints([new V2(0,0), new V2(size.x, 0), new V2(size.x, size.y), new V2(0, size.y)]);
                            }
                        })

                        //let matrix = [];
                        let noiseImg = createCanvas(size, (ctx, size, hlp) => {
                            for(let y = 0; y < size.y; y++){
                                //matrix[y] = [];
                                for(let x = 0; x < size.x; x++){
                                    //matrix[y][x] = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                    let noise = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                    noise = noise*100;
                                    noise = fast.r(noise/5)*5;
                                    //noise/=2;
                                    if(noiseMultiplier != undefined){
                                        noise*=noiseMultiplier;
                                    }
                                    hlp.setFillColor(colors.hsvToHex([hsv[0],hsv[1],fast.r(noise)])).dot(x,y)
                                }
                            }
                        })


                        params.img = createCanvas(size, (ctx, size, hlp) => {
                            ctx.drawImage(mask, 0,0);

                            ctx.globalCompositeOperation = 'source-in';

                            ctx.drawImage(noiseImg, 0,0);
                        })
                    })

                    nParams.forEach(params => {
                        ctx.drawImage(params.img, 0,0);
                    });
                })
            }
        }), 5)

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport,
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    let pp = new PP({ctx});
                    pp.setFillStyle('rgba(0,0,0,0)')
                    let linePoints = pp.lineV2(new V2(size.x/2, -20), new V2(size.x/2,size.y+20));

                    let layers = [
                        {
                            count: 1000,
                            opacity: 0.025,
                            xClamps: [-2*size.x, 2*size.x]
                        },
                        {
                            count: 250,
                            opacity: 0.1,
                            xClamps: [-size.x, size.x]
                        },
                        {
                            count: 100,
                            opacity: 0.25,
                            xClamps: [-size.x/2, size.x/2]
                        },
                        {
                            count: 25,
                            opacity: 0.5,
                            xClamps: [-size.x/4, size.x/4]
                        }
                    ]

                    let center = size.divide(2);

                    layers.forEach(layer => {
                        
                        for(let i = 0; i < layer.count; i++) {
                            let o = layer.opacity//oValues[getRandomInt(0, oValues.length)];
                            let p = linePoints[getRandomInt(0, linePoints.length-1)];
                            let y = p.y;
                            let x = p.x + getRandomGaussian(layer.xClamps[0], layer.xClamps[1]);
    
                            let _p = new V2(x,y).substract(center).rotate(-20).add(center).toInt();
    
    
                            hlp.setFillColor(`rgba(255,255,255, ${o})`)//.dot(getRandomInt(0, size.x), getRandomInt(0, size.y));
                            .dot(_p.x, _p.y)
                        }
                    })

                    //let count = 250;
                    //let oValues = easing.fast({from: 0.05, to: 0.1, steps: 5, type: 'linear', method: 'base'}).map(v => fast.r(v,2));

                    
                })
            }
        }), 6)
    }
}