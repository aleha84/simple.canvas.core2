class CarLampScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(300,400).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'carLamp',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
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
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)

        this.lamp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(200,400),
            init() {
                this.img = PP.createImage(CarLampScene.models.upperPart);
            }
        }), 5)


        let createRainFrames = function({framesCount, itemsCount, itemFrameslength, size, rgb, angleClamps, tails, maxA, xCLamps, upperYClamps, lowerY, gradientDots}) {
            let frames = [];
            //maxA+=0.1
            let sharedPP = PP.createInstance();

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = fast.r(getRandomInt(itemFrameslength)*1.25);
            
                if(!xCLamps)
                    xCLamps = [-size.x/2, size.x*1.5];

                if(!upperYClamps) 
                    upperYClamps = [-size.y/2, -size.y/4]

                if(!lowerY)
                    lowerY = size.y;

                let p1 = new V2(
                    getRandomInt(xCLamps),
                    getRandomInt(upperYClamps)
                )

                let bottomLine = createLine(new V2(-size.x*3, lowerY), new V2(size.x*4, lowerY));
                let direction = V2.down.rotate(getRandom(angleClamps[0], angleClamps[1]));
                let p2 = raySegmentIntersectionVector2(p1, direction, bottomLine);

                let linePoints = sharedPP.lineV2(p1, p2);

                let lineIndexChange = easing.fast({from: 0, to: linePoints.length-1, steps: totalFrames, type: 'linear', round: 0});
                let backTailLength = getRandomInt(tails.back);
                let frontTailLength = getRandomInt(tails.front);
                let backTailAValues = easing.fast({from: 1, to: 0, steps: backTailLength, type: 'quad', method: 'out', round: 2 });
                let frontTailAValues = easing.fast({from: 1, to: 0, steps: backTailLength, type: 'quad', method: 'out', round: 2 });

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: lineIndexChange[f],
                    };
                }
            
                return {
                    linePoints,
                    backTailLength,
                    frontTailLength,
                    backTailAValues,
                    frontTailAValues,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            
                            let index = itemData.frames[f].index;

                            let prev = undefined;
                            for(let i = 0; i < itemData.backTailLength; i++) {

                                let _index = index - i;
                                if(_index < 0)
                                    break;

                                let p = itemData.linePoints[_index];

                                let a = 0;
                                if(gradientDots[p.y] && gradientDots[p.y][p.x]){
                                    a = gradientDots[p.y][p.x].maxValue*maxA;
                                }

                                a*= itemData.backTailAValues[i];

                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a,3)})`).dot(p);

                                if(prev && prev.x != p.x) {
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(prev.x, p.y);
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(p.x, prev.y);
                                }

                                prev = p;
                            }
                            
                            prev = undefined;
                            for(let i = 1; i < itemData.frontTailLength; i++) {

                                let _index = index + i;
                                if(_index == itemData.linePoints.length)
                                    break;

                                let p = itemData.linePoints[_index];

                                let a = 0;

                                if(p == undefined)
                                    debugger;

                                if(gradientDots[p.y] && gradientDots[p.y][p.x]){
                                    a = gradientDots[p.y][p.x].maxValue*maxA;
                                }

                                a*= itemData.frontTailAValues[i];

                                hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a,3)})`).dot(p);

                                if(prev && prev.x != p.x) {
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(prev.x, p.y);
                                    hlp.setFillColor(`rgba(${rgb.r},${rgb.g},${rgb.b},${fast.r(a*0.75,3)})`).dot(p.x, prev.y);
                                }

                                prev = p;
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let totalFrames = 100;

        this.upperRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let gradientOrigin = new V2(87+50,87);
                let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(87+50,170), radius: new V2(60,100), gradientOrigin, angle: 0,
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }

                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;

                        dot.values.push(aValue);
                    } })

                let lightImg = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots.length; y++) {
                        if(gradientDots[y]) {
                            for(let x = 0; x < gradientDots[y].length; x++) {
                                if(gradientDots[y][x]) {
                                    hlp.setFillColor(`rgba(255,255,255,${gradientDots[y][x].maxValue*0.1})`).dot(x,y)
                                }
                            }
                        }
                    }
                })

                this.frames = createRainFrames({ 
                    framesCount: totalFrames, itemsCount: 600, itemFrameslength: [30,45], size: this.size, xCLamps: [50,250],
                    rgb: { r: 255, g: 255, b: 255 }, angleClamps: [-10,10], tails: { back: [30,40], front: [10, 15] }, maxA: 0.3,
                    gradientDots, 
                 }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                     ctx.drawImage(lightImg, 0,0);
                     ctx.drawImage(f, 0,0);
                 }))

                 this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                 });
            }
        }), 15)

        this.lowerRain = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let gradientOrigin = new V2(70+50,313);
                let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(90+50,325), radius: new V2(40,20), gradientOrigin, angle: 15,
                    setter: (dot, aValue) => {
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }

                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;

                        dot.values.push(aValue);
                    } })

                let frames = createRainFrames({ 
                    framesCount: totalFrames, itemsCount: 600, itemFrameslength: [30,45], size: this.size, xCLamps: [50,250],
                    rgb: { r: 255, g: 255, b: 255 }, angleClamps: [-10,10], tails: { back: [30,40], front: [10, 15] }, maxA: 0.6,
                    gradientDots, 
                 })

                this.left = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.right = this.addChild(new GO({
                    position: new V2(75,0),
                    size: this.size,
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({ startFrameIndex: 25 });
                    }
                }))
            }
        }), 20)


        this.main = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 100)),
            size: new V2(200,200),
            init() {
                this.img = PP.createImage(CarLampScene.models.main, { exclude: ['drops_zone', 'ground_zone'] });

                this.ground = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {//'#161B23', '#1C232D'
                        let _colors = ['#0C1117', '#0D111A', '#141C24', '#1E2129']
                        let pointsData = animationHelpers.extractPointData(CarLampScene.models.main.main.layers.find(l => l.name == 'ground_zone')).map(pd => {
                            //

                            let c = _colors[getRandomInt(0, _colors.length-1)];
                            if(getRandomInt(0,4) == 0)
                                c = '#222C38'
                            return {
                                point: pd.point,
                                color: c
                            }
                        }).filter(pd => getRandomInt(0,4) == 0);

                        let staticArr = [];
                        let aniArray = [];
                        pointsData.forEach(pd => {
                            if(getRandomInt(0,1) == 0) {
                                aniArray.push(pd);
                            }
                            else {
                                staticArr.push(pd);
                            }
                        })
                        //let borderIndex = fast.r(pointsData.length*2/3);
                        let staticImg = createCanvas(this.size, (ctx, size, hlp) => {
                            staticArr.forEach((pd, i) => {
                                hlp.setFillColor(pd.color).dot(pd.point);
                            })
                        })
                        
                        this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: [40, 60], size: this.size,
                            //pdPredicate: () => getRandomInt(0,4) == 0,
                            pointsData: aniArray
                             }).map(f => createCanvas(this.size, (ctx, size, hlp) => {
                                 ctx.drawImage(staticImg, 0, 0)
                                 ctx.drawImage(f, 0, 0)
                             }))

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.drops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        let gradientOrigin = new V2(70,105);
                        let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(95,105), radius: new V2(60,30), gradientOrigin, angle: 0,
                            setter: (dot, aValue) => {
                                if(!dot.values){
                                    dot.values = [];
                                    dot.maxValue = aValue;
                                }

                                if(aValue > dot.maxValue)
                                    dot.maxValue = aValue;

                                dot.values.push(aValue);
                            } })

                        // this.addChild(new GO({
                        //     position: new V2(),
                        //     size: this.size,
                        //     img: createCanvas(this.size, (ctx, size, hlp) => {
                        //         for(let y = 0; y < gradientDots.length; y++) {
                        //             if(gradientDots[y]) {
                        //                 for(let x = 0; x < gradientDots[y].length; x++) {
                        //                     if(gradientDots[y][x]) {
                        //                         hlp.setFillColor(`rgba(255,0,0,${gradientDots[y][x].maxValue})`).dot(x,y)
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     })
                        // }))

                        this.frames = animationHelpers.createMovementFrames({ framesCount: totalFrames, itemFrameslength: [5, 10], size: this.size,
                            pdPredicate: () => getRandomInt(0,3) == 0,
                            pointsData: 
                            animationHelpers.extractPointData(CarLampScene.models.main.main.layers.find(l => l.name == 'drops_zone'))
                                .map(pd => {

                                    let maxA = 0.75
                                    let a = 0.1; 
                                    if(pd.point.y == 73 || pd.point.y == 74 ) {
                                        a = fast.r(getRandom(0.3, 0.5),2)
                                    }
                                    else if(pd.point.y == 89 || pd.point.y == 90 || pd.point.y == 91) {
                                        a = fast.r(getRandom(0.2, 0.35),2)
                                    }
                                    else {
                                        if(gradientDots[pd.point.y] && gradientDots[pd.point.y][pd.point.x]){
                                            a = gradientDots[pd.point.y][pd.point.x].maxValue*maxA;
                                        }
                                    }
                                    

                                    return {
                                        point: pd.point,
                                        color: `rgba(255,255,255, ${ a })`
                                    }
                                })
                             })

                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), 10)
    }
}