class TempleScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1600,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'temple',
                utilitiesPathPrefix: '../../..',
                workersCount: 5
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let model = TempleScene.models.main;
        let layersData = {};
        let exclude = [
            'light_zone', 'flag'
        ];
        
        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;
        
        layersData[layerName] = {
            renderIndex
        }
        
        if(exclude.indexOf(layerName) != -1){
            console.log(`${layerName} - skipped`)
            continue;
        }
        
        this[layerName] = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: PP.createImage(model, { renderOnly: [layerName] }),
            init() {
        
            }
        }), renderIndex)
        
        console.log(`${layerName} - ${renderIndex}`)
        }

        this.tree_p = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let targetColors = ['#b7bbbc', '#939697', '#6f7172', '#4b4c4d']
                let t = PP.createImage(model, { renderOnly: ['trees'] });
                let pixelsData = getPixels(t, this.size);

                let pData = [];
                pixelsData.forEach(pd => {
                    if(getRandomInt(0, 3) == 0) {
                        let color = colors.colorTypeConverter({ value: { r: pd.color[0],g: pd.color[1],b: pd.color[2] }, fromType: 'rgb', toType: 'hex'  });

                        if(targetColors.indexOf(color) != -1){
                            pData[pData.length] = { point: pd.position.add(new V2(0,-1)), color } 
                        }
                    }
                    
                });

                this.frames = animationHelpers.createMovementFrames({ framesCount: 300, pointsData: pData, itemFrameslength: 100, size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.trees.renderIndex+1)

        this.magicLight = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createPulasatingFrames({framesCount, itemsCount, itemFrameslengthClamps, maxAClamps, size}) {
                let frames = [];
                //let color = '#EBD5FF'//'#F4D8D7' //'#F1FFFF'
                let color = '#F1FFFF';
                let mask = PP.createImage(model, { renderOnly: ['light_zone'] });

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);;
                
                    let maxA = getRandom(maxAClamps[0], maxAClamps[1]);
                    //let fadeOutLength = getRandomInt(10,30);
                    let aChange = easing.fast({ from: maxA, to: 0, steps: totalFrames, type: 'quad', method: 'in' })

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            a: aChange[f]
                        };
                    }
                
                    return {
                        frames
                    }
                })

                let anotherColor = new Array(3).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(20,40);;
                
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = true
                    }
                
                    return {
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor('rgba(255,255,255, 0.1)').rect(75,0,6,126);
                        hlp.setFillColor('rgba(255,255,255, 0.2)').rect(76,0,4,126);

                        ctx.drawImage(createCanvas(size, (ctx, size, hlp) => {
                            let a = 0;
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    a+=itemData.frames[f].a
                                }
                                
                            }
    
                            if(a > 0) {
    //76b0b4                    
    //77F2FF
                                let c = color;
                                // if(anotherColor.filter(ac => ac.frames[f]).length > 0) {
                                //     c = '#F4D8D7';
                                // }
                                hlp.setFillColor(c).rect(77, 0, 2, 126);
    
                                ctx.drawImage(mask, 0,0);
                                ctx.globalCompositeOperation = 'source-in'
                                ctx.globalAlpha = a;
                                hlp.rect(0,0,size.x,size.y);
                            }
                        }), 0,0)
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createPulasatingFrames({ framesCount: 300, 
                    itemsCount: 15, 
                    itemFrameslengthClamps: [60,100], 
                    maxAClamps: [0.07, 0.15],
                    size: this.size });
                this.registerFramesDefaultTimer({});
                
            }
        }), layersData.ground_d.renderIndex+1)

        this.particlesGoUp = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let yChange = easing.fast({from: getRandomInt(130,150), to: getRandomInt(-10, 0), steps: totalFrames, type: 'linear', round: 0})

                    let alpha = getRandom(0.3, 0.6);

                    let a = getRandom(0.03, 0.07);
                    let b = getRandomInt(30, 50);
                    let c = getRandomInt(3,6);
                    let fy = (y) => Math.sin(y*a + b)*c;

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yChange[f],
                            x: fast.r(fy(yChange[f])) + 78
                        };
                    }
                
                    return {
                        alpha,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.alpha})`).dot(itemData.frames[f].x, itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 40, itemFrameslengthClamps: [50, 200], size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.temple.renderIndex+1)

        this.particlesGoUp2 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createParticlesFrames({framesCount, itemsCount, itemFrameslengthClamps, size}) {
                let frames = [];
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let yChange = easing.fast({from: getRandomInt(130,150), to: getRandomInt(100, 120), steps: totalFrames, type: 'quad', method: 'in', round: 0})

                    let alpha = getRandom(0.3, 0.6);

                    let x = getRandomInt(60, 100);
                    
                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        frames[frameIndex] = {
                            y: yChange[f],
                        };
                    }
                
                    return {
                        alpha,
                        x,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(`rgba(255,255,255, ${itemData.alpha})`).dot(itemData.x, itemData.frames[f].y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createParticlesFrames({ framesCount: 300, itemsCount: 50, itemFrameslengthClamps: [50, 100], size: this.size })
                this.registerFramesDefaultTimer({});
            }
        }), layersData.temple.renderIndex+1)

        this.bgClouds = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let circleImages = {};
                let cColors = ['#939697']//['#aaafb0', '#b1b5b6']
                
                for(let c = 0; c < cColors.length; c++){
                    circleImages[cColors[c]] = []
                    for(let s = 1; s < 30; s++){
                        if(s > 8)
                            circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                                hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                            })
                        else {
                            circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                        }
                    }
                }

                let createCloudsFrames = function({framesCount, itemsCount, radiusClamps, color, startY, yShiftClamps, itemFrameslength, size, yChangeMax, fall}) {
                    let frames = [];
                    
                    let itemsData = new Array(itemsCount).fill().map((el, i) => {
                        let startFrameIndex = getRandomInt(0, framesCount-1);
                        let totalFrames = itemFrameslength;
                    
                        let x = getRandomInt(-20, size.x+20);
                        let y = startY + getRandomInt(yShiftClamps);
                        let r = getRandomInt(radiusClamps);

                        //let yChangeMax = fast.r(getRandomInt(yShiftClamps)/3);
                        let yChangeValues = [
                            ...easing.fast({from: 0, to: yChangeMax, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                            ...easing.fast({from: yChangeMax, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
                        ]

                        let rChangeValues = undefined;
                        if(fall){
                            yChangeValues = easing.fast({from: 0, to: yChangeMax*6, steps: totalFrames, type: 'linear', method: 'base', round: 0});
                            rChangeValues = easing.fast({from: r, to: 1, steps: totalFrames, type: 'linear', method: 'base', round: 0});
                        }

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                r: rChangeValues ? rChangeValues[f]: r,
                                y: yChangeValues[f]
                            };
                        }
                    
                        return {
                            x, y, 
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(circleImages[color][itemData.frames[f].r], itemData.x - itemData.frames[f].r, itemData.y + itemData.frames[f].y - itemData.frames[f].r)    
                                }
                            }
                        });
                    }
                    
                    return frames;
                }

                let framesCount = 300
                let frames1 =  createCloudsFrames({ framesCount: framesCount, itemsCount: 70, radiusClamps: [14,18], color: cColors[0], startY: -15, 
                    yShiftClamps: [3,4], itemFrameslength: framesCount, size: this.size, yChangeMax: 3 })

                let frames2 =  createCloudsFrames({ framesCount: framesCount, itemsCount: 70, radiusClamps: [14,18], color: cColors[0], startY: -5, 
                    yShiftClamps: [3,4], itemFrameslength: framesCount, size: this.size, yChangeMax: 3 })
                
                let frames3 =  createCloudsFrames({ framesCount: framesCount, itemsCount: 70, radiusClamps: [14,18], color: cColors[0], startY: 0, 
                    yShiftClamps: [3,4], itemFrameslength: framesCount, size: this.size, yChangeMax: 3 })

                this.frames = [];
                for(let f = 0; f < framesCount; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        
                        ctx.drawImage(frames1[f], 0,0)
                        ctx.globalAlpha = 0.6;
                        ctx.drawImage(frames2[f], 0,0)
                        ctx.globalAlpha = 0.3;
                        ctx.drawImage(frames3[f], 0,0)
                    })
                    
                }

                this.registerFramesDefaultTimer({});
            }
        }), layersData.bg.renderIndex+1)

        this.wavingFabric = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let totalFrmes = 150;
                this.frames = [];
                let angleValues = easing.fast({from: 0, to: 360, steps: totalFrmes, type: 'linear'});

                let t = PP.createImage(model, { renderOnly: ['flag'] });
                let pixelsData = getPixels(t, this.size).map(pd => { return { position: pd.position, color: colors.rgbToString( { value: pd.color } ) } });
                let minY = Math.min(...pixelsData.map(pd => pd.position.y))

                for(let i = 0; i < totalFrmes; i++){

                    let angle = degreeToRadians(angleValues[i]);

                    let points = new Array(30).fill().map(
                        (p, i) => 
                            new V2(
                                    fast.r(fast.r(Math.sin(i*0.25 - angle)*i/5)*0.3), 
                                i));
                    let xShift = 0;
                    let xDelta = 0;
                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                        let p0X = points[0].x + xShift + -points[0].x
                        points.forEach(p => {
                            let startX = p.x + xShift + -points[0].x;
                            // hlp.setFillColor('grey');
                            // hlp.rect(startX, p.y, 20, 1);

                            pixelsData.filter(pd => pd.position.y == minY + p.y).forEach(pd => {
                                let x = pd.position.x + startX
                                let y = pd.position.y+1
                                hlp.setFillColor(pd.color).dot(x, y)

                                if(pixelsData.filter(pd2 => pd2.position.x == x-1 && pd2.position.y == y-1).length == 0) {
                                    ctx.globalAlpha = 0.5;
                                    hlp.dot(x, y-1);
                                }

                                if(pixelsData.filter(pd2 => pd2.position.x == x-1 && pd2.position.y == y+1).length == 0) {
                                    ctx.globalAlpha = 0.5;
                                    hlp.dot(x, y+1);
                                }

                                ctx.globalAlpha = 1;

                            })
                            // if(startX < p0X) {

                            //     let a = 0;
                            //     let d = Math.abs(startX-p0X);
                            //     if(d > 1){
                            //         a = 0.1;
                            //     }

                            //     if(d > 3) {
                            //         a = 0.2
                            //     }

                            //     hlp.setFillColor('rgba(0,0,0,' + a + ')').rect(startX, p.y, 20, 1); //Math.abs(startX-p0X)*0.1
                            // }
                            // else if(startX > p0X) {
                            //     hlp.setFillColor('rgba(255,255,255,0.1)').rect(startX, p.y, 20, 1);
                            // }
                        })
                    })
                }

                this.registerFramesDefaultTimer({});

              

            }
        }), layersData.flag_base.renderIndex+1)
        
    }
}