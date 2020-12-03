class Demo10Loading2Scene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        this.loading = this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(70,20),
            createDotsFrames({framesCount, itemsCount, borderItemsCount =5000, size}) {
                let frames = [];

                let color1 = colors.rgbStringToObject({value: 'rgba(255,230,180,1)', asObject: false});
                let color2 = colors.rgbStringToObject({value: 'rgba(127,115,90,1)', asObject: false}); //''
                let fillColor = '#' + rgbToHex([color1[0], color1[1], color1[2]])
                let midColorsCount = 20;

                let colorsChange = {
                    rValues: easing.fast({from: color1[0], to: color2[0], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                    gValues: easing.fast({from: color1[1], to: color2[1], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                    bValues: easing.fast({from: color1[2], to: color2[2], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value))
                };

                let colorsValue = [];
                for(let i = 0; i < midColorsCount; i++){
                    colorsValue.push('#' + rgbToHex([colorsChange.rValues[i], colorsChange.gValues[i], colorsChange.bValues[i]]));
                }
                
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let point = new V2(getRandomInt(2,size.x-3), getRandomInt(2, size.y-3));
                    let color = colorsValue[getRandomInt(1,3)];
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(fast.r(framesCount/2),fast.r(framesCount*3/4));

                    let frames = [];

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            color: color
                        }

                    }

                    return {
                        point,
                        frames,
                    }
                })

                let borderItemsData = new Array(borderItemsCount).fill().map((el, i) => {
                    let point = new V2(getRandomInt(0,size.x), getRandomBool() ? 0 : size.y-1);
                    
                    if(getRandomBool()){
                        point = new V2(getRandomBool() ? 0: size.x- 1, getRandomInt(0, size.y))
                    }
                    let color = colorsValue[getRandomInt(15,19)];

                    if(getRandomBool()){
                        point = new V2(getRandomInt(1,size.x-2), getRandomBool() ? 1 : size.y-2);
                    
                        if(getRandomBool()){
                            point = new V2(getRandomBool() ? 1: size.x- 2, getRandomInt(1, size.y-2))
                        }
                        color = colorsValue[getRandomInt(10,15)];
                    }

                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(fast.r(framesCount/2),fast.r(framesCount*3/4));

                    let frames = [];

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        frames[frameIndex] = {
                            color: color
                        }

                    }

                    return {
                        point,
                        frames,
                    }
                })

                itemsData = [...itemsData, ...borderItemsData];
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        hlp.setFillColor(colorsValue[15]).strokeRect(0,0,size.x, size.y)
                        hlp.setFillColor(colorsValue[10]).strokeRect(1,1,size.x-2, size.y-2)
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(itemData.frames[f].color).dot(itemData.point.x, itemData.point.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            createLoadingFrames({framesCount, size}) {
                let model = Demo10Loading2Scene.models.main;

                let dotColorsChangeFramesCountClamp = [30,40];

                let xChangeFramesLength = framesCount - dotColorsChangeFramesCountClamp[1]*2;
                let xValues = easing.fast({from: 0, to: size.x, steps: xChangeFramesLength, type: 'sin', method: 'inOut'}).map((v, i) => ({ 
                    frameIndex: i + dotColorsChangeFramesCountClamp[1],
                    x:  fast.r(v)
                }));

                let lettersPoints = model.main.layers.find(l => l.name == 'letters').groups[0].points.map(point => ({
                    p: point.point
                }));


                let color1 = colors.rgbStringToObject({value: 'rgba(255,230,180,1)', asObject: false});
                let color2 = colors.rgbStringToObject({value: 'rgba(127,115,90,1)', asObject: false}); //''
                let fillColor = '#' + rgbToHex([color1[0], color1[1], color1[2]])
                let midColorsCount = 20;

                let colorsChange = {
                    rValues: easing.fast({from: color1[0], to: color2[0], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                    gValues: easing.fast({from: color1[1], to: color2[1], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                    bValues: easing.fast({from: color1[2], to: color2[2], steps: midColorsCount, type: 'linear', method:'base'}).map(value => fast.r(value))
                };

                let colorsValue = [];
                for(let i = 0; i < midColorsCount; i++){
                    colorsValue.push('#' + rgbToHex([colorsChange.rValues[i], colorsChange.gValues[i], colorsChange.bValues[i]]));
                }

                // colorsValue = [...colorsValue, ...colorsValue.reverse()];

                let frames = [];

                let vLineData = xValues.map((xv, i) => {
                    let frames = [];

                    if(xv.x > 10 && xv.x < size.x-10 ){
                        //frames[xv.frameIndex-11] = { x: xValues[i-1].x+1, color: colorsValue[midColorsCount*1/3] };
                        frames[xv.frameIndex-10] = { x: xv.x, color: colorsValue[fast.r(midColorsCount/2)] };
                        // frames[xv.frameIndex-9] = { x: xValues[i+1].x-1, color: colorsValue[fast.r(midColorsCount*1/3)] };
                        // frames[xv.frameIndex-8] = { x: xValues[i+2].x-2, color: colorsValue[fast.r(midColorsCount*1/3)] };
                    } 
                    

                    return {
                        frames
                    };
                })

                let itemsData = lettersPoints.map((lp, i) => {
                    let totalFrames = getRandomInt(dotColorsChangeFramesCountClamp[0], dotColorsChangeFramesCountClamp[1]);
                    let startFrameIndex = xValues.filter(xv => xv.x >= lp.p.x).sort((a,b) => { return a.frameIndex - b.frameIndex })[0].frameIndex;
                    startFrameIndex+=getRandomInt(-5,5);

                    let colorsCount = getRandomInt(10,20);
                    let colorsChange = {
                        rValues: easing.fast({from: color1[0], to: color2[0], steps: colorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                        gValues: easing.fast({from: color1[1], to: color2[1], steps: colorsCount, type: 'linear', method:'base'}).map(value => fast.r(value)),
                        bValues: easing.fast({from: color1[2], to: color2[2], steps: colorsCount, type: 'linear', method:'base'}).map(value => fast.r(value))
                    };
    
                    let colorsValue = [];
                    for(let i = 0; i < colorsCount; i++){
                        colorsValue.push('#' + rgbToHex([colorsChange.rValues[i], colorsChange.gValues[i], colorsChange.bValues[i]]));
                    }
    
                    colorsValue = [...colorsValue, ...colorsValue.reverse()];


                    let colorsValuesIndexValues = easing.fast({from: 0, to: colorsValue.length-1, steps: totalFrames, type: 'quad', method: 'inOut'}).map(v => fast.r(v));

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        frames[frameIndex] = {
                            color: colorsValue[colorsValuesIndexValues[f]],
                        }
                    }

                    return {
                        p: lp.p,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){//
                                hlp.setFillColor(itemData.frames[f].color).dot(itemData.p.x, itemData.p.y);
                            }
                        }

                        // vLineData.forEach(vLineDataItem => {
                        //     if(vLineDataItem.frames[f]){
                        //         hlp.setFillColor(vLineDataItem.frames[f].color).rect(vLineDataItem.frames[f].x,6, 1, size.y-12);
                        //     }
                        // })
                    });
                }
                
                return frames;
            },
            init() {
                this.bg = this.addChild(new Go({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,230,180,1)').rect(0,0, size.x, size.y);
                        })
                    }
                }))

                this.edges =  this.addChild(new Go({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createDotsFrames({ framesCount: 50, itemsCount:2500, size: this.size});

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;
                            }
                        })
                    }
                }))
                

                this.letters = this.addChild(new Go({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        this.frames = this.parent.createLoadingFrames({ framesCount: 150, size: this.size});

                        let rfc = 4;

                        this.currentFrame = 0;
                        this.img = this.frames[this.currentFrame];
                        
                        this.timer = this.regTimerDefault(15, () => {
                        
                            this.img = this.frames[this.currentFrame];
                            this.currentFrame++;
                            if(this.currentFrame == this.frames.length){
                                this.currentFrame = 0;

                                // rfc--;

                                // if(rfc == 0){
                                //     rfc = 4;

                                //     if(!this.redFrame){
                                //         this.redFrame = this.addChild(new GO({
                                //             position: new V2(),
                                //             size: this.size,
                                //             img: createCanvas(this.size, (ctx, size, hlp) => {
                                //                 hlp.setFillColor('red').rect(0,0, 50,50)
                                //             })
                                //         }));
                                //     }
                                //     else {
                                //         this.removeChild(this.redFrame);
                                //         this.redFrame = undefined;
                                //     }
                                // }
                            }
                        })
                    }
                }))
                
            }
        }), 1)

        this.foreground = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.viewport,
            init() {
                this.main = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    img: PP.createImage(Demo10Loading2Scene.models.foreground)
                }))
            }
        }), 2)
    }
}