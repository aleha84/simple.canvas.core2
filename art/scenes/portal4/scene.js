class Portal4Scene extends Scene {
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
        let model = Portal4Scene.models.main;
        let layersData = {};
        let exclude = [
            
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

        this.cloudsBg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let circleImages = {};
                let cColors = ['#307785', '#C0CAD3', '#dfe4e8', '#FDFDFD']
                
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

                this.upperColor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#E6F2EA').rect(0, 0, size.x, 20)
                    })
                }))

                this.lowerColor = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: createCanvas(this.size, (ctx, size, hlp) => {
                        hlp.setFillColor('#2C5058').rect(0, 80, size.x, 20)
                    })
                }))

                let createCloudsFrames = function({framesCount, itemsCount, radiusClamps, color, startY, yShiftClamps, itemFrameslength, size, yChangeMax}) {
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

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            frames[frameIndex] = {
                                y: yChangeValues[f]
                            };
                        }
                    
                        return {
                            x, y, r,
                            frames
                        }
                    })
                    
                    for(let f = 0; f < framesCount; f++){
                        frames[f] = createCanvas(size, (ctx, size, hlp) => {
                            for(let p = 0; p < itemsData.length; p++){
                                let itemData = itemsData[p];
                                
                                if(itemData.frames[f]){
                                    ctx.drawImage(circleImages[color][itemData.r], itemData.x, itemData.y + itemData.frames[f].y)    
                                }
                            }
                        });
                    }
                    
                    return frames;
                }

                let framesCount = 300;

                let framesData = [
                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [8,10], color: cColors[0], startY: 60, 
                    yShiftClamps: [3,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 1 }),
                        alpha: 1
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [6,10], color: cColors[1], startY: 55, 
                    yShiftClamps: [3,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 0.5        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [6,10], color: cColors[1], startY: 45, 
                    yShiftClamps: [4,6], itemFrameslength: framesCount, size: this.size, yChangeMax: 1 }),
                        alpha: 1        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 150, radiusClamps: [10,14], color: cColors[2], startY: 25, 
                    yShiftClamps: [5,8], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 1        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 100, radiusClamps: [8,12], color: cColors[3], startY: -5, 
                    yShiftClamps: [5,10], itemFrameslength: framesCount, size: this.size, yChangeMax: 2 }),
                        alpha: 0.5        
                    },

                    {
                        frames: createCloudsFrames({ framesCount, itemsCount: 70, radiusClamps: [14,18], color: cColors[3], startY: 5, 
                    yShiftClamps: [5,8], itemFrameslength: framesCount, size: this.size, yChangeMax: 3 }),
                        alpha: 1        
                    },

                ]

                let frames = [];
                for(let f = 0; f < framesCount; f++) {
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        ctx.globalAlpha = 1;
                        for(let fd = 0; fd < framesData.length; fd++) {
                            ctx.globalAlpha = framesData[fd].alpha;
                            ctx.drawImage(framesData[fd].frames[f], 0,0)
                            ctx.globalAlpha = 1;
                        }
                    })
                    
                }

                this.clouds = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({});
                    }
                }))
            }
        }), layersData.bg.renderIndex+1)
    }
}