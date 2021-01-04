var textureGenerator = {
    getSurfaceProperties(config) {
        return assignDeep({}, {
            //type: 'dots',
            colors: ['#000000'],
            opacity: [0.05, 0.1],
            type: 'rect',
            fillSize: new V2(1,1),
            blot: {
                ttl: 5,
                density: 1,
                decreaseSize: false
            },
            line: {
                directionAngle: 0,
                angleSpread: 45,
                length: [25],
                path: {
                    segments: [3],
                },
            },
            density: 1,
            preciseCount: undefined,
            indents: {
                h: new V2(),
                v: new V2()
            }
        }, config);
    },

    textureGenerator(config){
        let c = assignDeep({}, {
            size: new V2(100, 100),
            backgroundColor: '#A67E0D',
            surfaces: [],
        }, config);

        let directions = [V2.up, V2.down, V2.left, V2.right, new V2(-1,-1), new V2(1,-1), new V2(1,1), new V2(-1, 1)];
        let getRandomDirection = () => {
            let from = 0;to = directions.length-1;
            return directions[getRandomInt(from, to)].clone();
        }
        let blotGeneration = function(ctx, sc, current){
            if(current.ttl <= 0)
                return;

            if(current.position.x > sc.imgSize.x-1){
                current.position.x=0;
            }

            if(current.position.x < 0){
                current.position.x=sc.imgSize.x-1;
            }
            
            let clrRGB =  hexToRgb(current.clr == undefined? sc.colors[getRandomInt(0, sc.colors.length-1)] : current.clr, true);

            ctx.fillStyle = `rgba(${clrRGB[0]},${clrRGB[1]},${clrRGB[2]},${(sc.opacity.length == 1? sc.opacity[0] : getRandom(sc.opacity[0], sc.opacity[1]))})`;
            ctx.fillRect(current.position.x, current.position.y, current.size.x, current.size.y);
            if(getRandomInt(0, current.originTtl) < current.ttl*sc.blot.density){ // create child
                let p = getRandomDirection();
                blotGeneration(ctx, sc, { 
                    ttl: current.ttl-1, 
                    originTtl: current.ttl-1, 
                    position: current.position.add(new V2(p.x*current.size.x, p.y*current.size.y)),
                    clr: current.clr,
                    size: current.size.clone()  
                });
            }

            current.ttl--;
            if(sc.blot.decreaseSize){
                current.size.x-=1;
                if(current.size.x<=0)
                    current.size.x=1;
                current.size.y-=1;
                if(current.size.y<=0)
                    current.size.y=1;
            }
            let p = getRandomDirection();
            current.position.add(new V2(p.x*current.size.x, p.y*current.size.y), true);
            blotGeneration(ctx, sc, current);
        }

        return createCanvas(c.size, (ctx, size) => {
            ctx.fillStyle = c.backgroundColor;
            ctx.fillRect(0,0, size.x, size.y);

            for(let sc of c.surfaces){
                sc.imgSize = size;
                if(sc.type == 'blot'){
                    if(sc.blot.density > 1)
                        sc.blot.density = 1
                }
                let from = new V2(sc.indents.h.x, sc.indents.v.x);
                let to = new V2(c.size.x - sc.indents.h.y - sc.fillSize.x, c.size.y - sc.indents.v.y - sc.fillSize.y);
                let clr = sc.colors.length == 1? sc.colors[0]:  undefined;
                let clrRGB = undefined;
                //let opacity = sc.opacity.length == 1? sc.opacity[0] : undefined;

                let count = sc.preciseCount || size.x*size.y*sc.density;
                for(let i = 0; i < count;i++){
                    
                    clrRGB =  hexToRgb(clr == undefined ? sc.colors[getRandomInt(0, sc.colors.length-1)]: clr, true);

                    // if(opacity == undefined)
                    //     opacity =  getRandom(sc.opacity[0], sc.opacity[1]);

                    let clrRGBA = `rgba(${clrRGB[0]},${clrRGB[1]},${clrRGB[2]},${(sc.opacity.length == 1? sc.opacity[0] : getRandom(sc.opacity[0], sc.opacity[1]))})`
                    if(sc.type == 'rect'){
                        ctx.fillStyle = clrRGBA;
                        ctx.fillRect(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y), sc.fillSize.x, sc.fillSize.y);
                    }
                    else if(sc.type == 'line' || sc.type == 'path'){
                        let count = 1;
                        if(sc.type == 'path'){
                            count = sc.line.path.segments.length == 1 ? sc.line.path.segments[0] : getRandomInt(sc.line.path.segments[0], sc.line.path.segments[1])
                        }
                        ctx.strokeStyle = clrRGBA;
                        ctx.beginPath();
                        let lineFrom = new V2(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y)) 
                        ctx.moveTo(lineFrom.x, lineFrom.y);
                        for(let i =0;i <count;i++){
                            let len = sc.line.length.length == 1 ? sc.line.length[0] : getRandomInt(sc.line.length[0], sc.line.length[1]);
                            let lineTo = lineFrom.add(V2.up.rotate(sc.line.directionAngle+getRandom(-sc.line.angleSpread,sc.line.angleSpread)).mul(len));
                            if(lineTo.x > to.x) {
                                lineTo.x = to.x;
                                ctx.lineTo(lineTo.x, lineTo.y);
                                ctx.stroke();
                                ctx.beginPath();
                                lineFrom = new V2(from.x, lineTo.y);
                                ctx.moveTo(from.x, lineTo.y);
                                continue;
                            }//lineTo.x = to.x;
                            if(lineTo.y > to.y) continue;//lineTo.y = to.y;
                            if(lineTo.x < from.x) continue;//lineTo.x = from.x;
                            if(lineTo.y < from.y) continue;//lineTo.y = from.y;
                            ctx.lineTo(lineTo.x, lineTo.y);
                            lineFrom = lineTo;
                        }
                       
                        ctx.stroke();
                    }
                    else if(sc.type == "blot"){
                        blotGeneration(ctx, sc, { 
                            ttl: sc.blot.ttl, 
                            originTtl: sc.blot.ttl, 
                            position: new V2(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y)),
                            clr: clr,
                            size: sc.fillSize.clone()
                        })
                    }
                    
                }
            }
        });
    }
}

var sphereHelper = {
    createSphereCalcCache: [],
    clearCache() {
        this.createSphereCalcCache = [];
    },
    setPixel(imageData, x, y, r, g, b, a, width) {
        let index = (x + y * width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    },
    getPixel(imageData, x, y, width){
        let index = (x + y * width) * 4;
        return [imageData.data[index], imageData.data[index+1], imageData.data[index+2], imageData.data[index+3]];
    },
    createPlanetTexure(baseTexture, textureName, baseTextureSize, diskSize, speed, time, addShadows, setCache = true) {
        return createCanvas(new V2(diskSize,diskSize), (ctx, size) => {
            let sphereImg = this.createSphere(baseTexture, textureName, baseTextureSize, diskSize, speed,time, setCache);
            ctx.drawImage(sphereImg, 0,0, size.x, size.y);
            
            if(addShadows) {
                ctx.save();
                ctx.arc(size.x/2,size.x/2, size.x/2 + 1, 0, Math.PI*2, false );
                ctx.clip();
                
                let grd =ctx.createRadialGradient(size.x/4, size.x/4, 0, 0, 0, 1.2*size.x); //main shadow
                grd.addColorStop(0.5, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,1)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                grd =ctx.createRadialGradient(size.x/2 + 0.5, size.y/2 + 0.5, 0.85*size.x/2, size.x/2 + 0.5, size.y/2 + 0.5, size.x/2); // sphere effect
                grd.addColorStop(0, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,0.75)');grd.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                ctx.restore();
            }
            

            
        })
    },
    createSphere(originTextureImg, originTextureName, originSize, diskSize, rotationSpeed = 0, time = 0,  setCache = true){
        if(!this.createSphereCalcCache[diskSize])
            this.createSphereCalcCache[diskSize] = [];

        if(!this.originTexturesDataCache)
            this.originTexturesDataCache = {};

        let imgPixelsData 
        let imgPixelsDataCacheItem = this.originTexturesDataCache[originTextureName];
        if(imgPixelsDataCacheItem === undefined){
            imgPixelsData = originTextureImg.getContext('2d').getImageData(0,0,originSize.x, originSize.y);
            if(setCache)
                this.originTexturesDataCache[originTextureName] = imgPixelsData;
        }
        else {
            imgPixelsData = imgPixelsDataCacheItem;
        }
        
        let resultImg = createCanvas(new V2(diskSize,diskSize), (ctx, size) => { ctx.fillStyle = 'rgba(255,255,255,0)';ctx.fillRect(0,0,size.x, size.y); });
        let resultImageData = resultImg.getContext('2d').getImageData(0,0,diskSize, diskSize);
        for(let x = 0; x < diskSize; x++){
            if(this.createSphereCalcCache[diskSize][x] == undefined)
                this.createSphereCalcCache[diskSize][x] = [];

            for(let y = 0; y < diskSize; y++){

                //with usage vectors cache
                let px, py;
                let cacheItem = this.createSphereCalcCache[diskSize][x][y];
                if(cacheItem === undefined){
                    px = x*2/diskSize - 1;
                    py = y*2/diskSize - 1;
    
                    let magSq = px*px + py*py;
    
                    if(magSq > 1){
                        this.createSphereCalcCache[diskSize][x][y] = null;
                        //this.setPixel(resultImageData, x, y, 255,255,255,0);
                        continue;
                    }
    
                    let widthAtHeight =Math.sqrt(1 - py * py);
                    px = Math.asin(px / widthAtHeight) * 2/Math.PI
                    py = Math.asin(py) * 2/Math.PI

                    this.createSphereCalcCache[diskSize][x][y] = {px, py};
                }
                else if(cacheItem === null)
                    continue;
                else if(cacheItem){
                    px = cacheItem.px;
                    py = cacheItem.py;
                }
                //without usage vectors cache
/* 
                let px = x*2/diskSize - 1;
                let py = y*2/diskSize - 1;

                let magSq = px*px + py*py;

                if(magSq > 1){
                    //this.setPixel(resultImageData, x, y, 255,255,255,0);
                    continue;
                }

                let widthAtHeight =Math.sqrt(1 - py * py);
                px = Math.asin(px / widthAtHeight) * 2/Math.PI
                py = Math.asin(py) * 2/Math.PI
*/
                let u = fastRoundWithPrecision(rotationSpeed*time+(px+1)*(originSize.y/2),0);
                let v = fastRoundWithPrecision((py + 1)*(originSize.y/2),0);
                u %= (2*originSize.y);

                let colorData = this.getPixel(imgPixelsData, u, v, originSize.x);
                this.setPixel(resultImageData, x, y, colorData[0], colorData[1], colorData[2], colorData[3], diskSize);
            }
        }

        resultImg.getContext('2d').putImageData(resultImageData, 0,0);

        return resultImg;
    }
}

var drawHelper = {
    rectangle(ctx, config) {
        let c = assignDeep({}, {
            size: new V2(10,10),
            beginPath: true,
            closePath: true,
            topLeft: new V2(),
            radiusEdges: {
                enabled: false,
                fixedValue: undefined,
                proportion: 0.1, 
                proportionDimension: 'x'
            }
        }, config);

        let r = 0;
        if(c.radiusEdges && c.radiusEdges.enabled){
            if(c.radiusEdges.fixedValue != undefined){
                r = c.radiusEdges.fixedValue
            }
            else if(c.radiusEdges.proportion != undefined && c.radiusEdges.proportionDimension != undefined){
                r = c.size[c.radiusEdges.proportionDimension]*c.radiusEdges.proportion;
            }
        }

        if(c.beginPath)
            ctx.beginPath();

        let x = c.topLeft.x;
        let y = c.topLeft.y;
        let width = c.size.x;
        let height = c.size.y;

        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        if(r > 0)
            ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        if(r > 0)
            ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        if(r > 0)
            ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        if(r > 0)
            ctx.quadraticCurveTo(x, y, x + r, y);

        if(c.closePath)
            ctx.closePath();
    },
}

var colorTransitionHelper = {
    create(options) {
        let o = options;
        return createCanvas(o.size, (ctx, size) => {
            if(o.items.length == 1){
                ctx.fillStyle = o.items[0].color;
                ctx.fillRect(0,0, size.x, size.y);
                return;
            }

            if(o.type == 'dithering'){
                for(let i = 0; i < o.items.length-1;i++){
                    let currentItem = o.items[i];
                    let nextItem = o.items[i+1];
                    let startTransitionFrom = currentItem.startTransitionFrom || currentItem.position;
                    let transitionLength = nextItem.position - startTransitionFrom;
                    // let nextColorAmount = 0;
                    let startP = startTransitionFrom;
                    let stepCount = 2
                    let endP = startP+transitionLength/stepCount;
                    let mixed, lowDithNe;

                    if(nextItem.inverted) {
                        mixed = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)];
                        startP += transitionLength/stepCount; endP += transitionLength/stepCount;
                        lowDithNe = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)]
                        startP += transitionLength/stepCount; endP += transitionLength/stepCount;
                    }
                    else {
                        lowDithNe = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)]
                        startP += transitionLength/stepCount; endP += transitionLength/stepCount;
    
                        // let midDithNe = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)];
                        // startP += transitionLength/stepCount; endP += transitionLength/stepCount;
    
                        mixed = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)];
                        startP += transitionLength/stepCount; endP += transitionLength/stepCount;
                    }
                    
                    // let midDithCu = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)];
                    // startP += transitionLength/stepCount; endP += transitionLength/stepCount;
                    // let lowDithCu = [fastRoundWithPrecision(startP, 0), fastRoundWithPrecision(endP, 0)];

                    ctx.fillStyle = currentItem.color;
                    let to = nextItem.inverted ? mixed[1] :  lowDithNe[1];
                    let from = nextItem.inverted ? mixed[0] :  lowDithNe[0];
                    if(currentItem.position < from){
                        for(let r = currentItem.position; r < from;r++){
                            ctx.fillRect(0,r,size.x, 1);
                        }
                    }
                    

                    let shift = false;
                    for(let r = from; r < to;r++){
                        ctx.fillStyle = currentItem.color;
                        ctx.fillRect(0,r,size.x, 1);
                        if(r%2 == 0)
                            continue;

                        shift = !shift;
                        let fill = true;
                        ctx.fillStyle = nextItem.color;
                        for(let c = shift ? 1 : 0; c < size.x; c++){
                            if(fill){
                                ctx.fillRect(c, r,1,1);
                            }

                            fill = !fill;
                        }
                    }

                    // shift = false;
                    // for(let r = midDithNe[0]; r < midDithNe[1];r++){
                    //     ctx.fillStyle = currentItem.color;
                    //     ctx.fillRect(0,r,size.x, 1);
                    //     let fill = true;
                    //     let counter = 4;
                    //     ctx.fillStyle = nextItem.color;
                    //     if(r%2 == 0){
                    //         for(let c = (shift ? 1: 3); c < size.x; c++){
                    //             if(counter == 4){
                    //                 ctx.fillRect(c, r,1,1);
                    //                 counter = 0;
                    //             }
                                    
                    //             counter++;
                    //         }
                    //         shift = !shift;

                    //         continue;
                    //     }
                            
                    //     fill = true;  
                    //     for(let c = 0; c < size.x; c++){
                    //         if(fill){
                    //             ctx.fillRect(c, r,1,1);
                    //         }

                    //         fill = !fill;
                    //     }
                    // }

                    shift = true;
                    for(let r =from; r < to;r++){
                        
                        //ctx.fillRect(0,r,size.x, 1);

                        let fill = true;
                        
                        for(let c = shift ? 1 : 0; c < size.x; c++){
                            if(fill){
                                ctx.fillStyle = nextItem.color;
                            }
                            else {
                                ctx.fillStyle = currentItem.color;
                            }

                            ctx.fillRect(c, r,1,1);

                            fill = !fill;
                        }
                        shift = !shift;
                    }

                    // shift = true;
                    // for(let r = midDithCu[0]; r < midDithCu[1];r++){
                    //     ctx.fillStyle = nextItem.color;
                    //     ctx.fillRect(0,r,size.x, 1);
                    //     let fill = true;
                    //     let counter = 4;
                    //     ctx.fillStyle = currentItem.color;
                    //     if(r%2 == 0){
                    //         for(let c = (shift ? 1: 3); c < size.x; c++){
                    //             if(counter == 4){
                    //                 ctx.fillRect(c, r,1,1);
                    //                 counter = 0;
                    //             }
                                    
                    //             counter++;
                    //         }
                    //         shift = !shift;

                    //         continue;
                    //     }
                            
                    //     fill = true;  
                    //     for(let c = 0; c < size.x; c++){
                    //         if(fill){
                    //             ctx.fillRect(c, r,1,1);
                    //         }

                    //         fill = !fill;
                    //     }
                    // }

                    // shift = false;
                    // for(let r = lowDithCu[0]; r < lowDithCu[1];r++){
                    //     ctx.fillStyle = nextItem.color;
                    //     ctx.fillRect(0,r,size.x, 1);
                    //     if(r%2 == 0)
                    //         continue;

                    //     shift = !shift;
                    //     let fill = true;
                    //     ctx.fillStyle = currentItem.color;
                    //     for(let c = shift ? 1 : 0; c < size.x; c++){
                    //         if(fill){
                    //             ctx.fillRect(c, r,1,1);
                    //         }

                    //         fill = !fill;
                    //     }
                    // }


                    //for(let r = currentItem.position; r < nextItem.position; r++){
                        // let nextColorPixelsXPositions = []
                        // if(r >= startTransitionFrom){
                        //     nextColorAmount = fastRoundWithPrecision(size.x* (r-startTransitionFrom)/transitionLength, 0);
                        //     if(nextColorAmount != 0){
                        //         let nextPixelStep = size.x/(nextColorAmount+1);
                        //         for(let j = 1; j <=nextColorAmount;j++)
                        //             nextColorPixelsXPositions[j-1] = fastRoundWithPrecision(nextPixelStep*j,0);
                        //     }
                        // }
                        
                        
                        
                        // console.log(`from ${currentItem.color} to ${nextItem.color}; row: ${r}; nextColorAmount: ${nextColorAmount}`);
                        // let lineColor = currentItem.color;
                        // let singleColor = nextItem.color;
                        // if(nextColorAmount > size.x/2) {
                        //     lineColor = nextItem.color;
                        //     singleColor = currentItem.color;
                        //     nextColorAmount = size.x - nextColorAmount;
                        // }
                        // ctx.fillStyle = lineColor;//currentItem.color;
                        // ctx.fillRect(0,r,size.x,1);
                        // ctx.fillStyle = singleColor;//nextItem.color;
                        // for(let c = 0; c < nextColorAmount; c++){
                        //     ctx.fillRect(getRandomInt(0, size.x-1), r,1,1);
                        // }

                    //}
                }
            }
            else if(o.type == 'lines'){
                for(let i = 0; i < o.items.length-1;i++){
                    let currentItem = o.items[i];
                    let nextItem = o.items[i+1];
                    let startTransitionFrom = currentItem.startTransitionFrom || currentItem.position;
                    let transitionLength = nextItem.position - startTransitionFrom;
                    let transitionTo = startTransitionFrom + transitionLength;

                    ctx.fillStyle = currentItem.color;
                    if(currentItem.position < startTransitionFrom){
                        for(let r = currentItem.position; r < startTransitionFrom;r++){
                            ctx.fillRect(0,r,size.x, 1);
                        }
                    }

                    for(let r = startTransitionFrom; r < transitionTo; r++){
                        ctx.fillStyle = currentItem.color;
                        ctx.fillRect(0,r,size.x, 1);

                        if(currentItem.noNextColorPropbabilityCheck || getRandomInt(0, fastRoundWithPrecision(5 - 5*r/transitionTo, 0)) == 0){
                            ctx.fillStyle = nextItem.color;
                            let from = getRandomInt(-size.x/4, size.x);
                            let lengthX = getRandomInt(size.x/10,size.x/4 + (size.x/2)* r/transitionTo);
                            ctx.fillRect(from, r, lengthX, 1);

                            if(getRandomBool()){
                                let count = getRandomInt(1,5);
                                ctx.fillStyle = currentItem.color;
                                for(let ii = 0; ii < count;ii++){
                                    let l = getRandomInt(1, lengthX/15);
                                    if(l > 0)
                                        ctx.fillRect(getRandomInt(from, from+lengthX), r, l, 1);
                                }

                            }
                        }
                    }
                }

                if(o.items[o.items.length-1].position < size.y){
                    ctx.fillStyle = o.items[o.items.length-1].color;
                    for(let r = o.items[o.items.length-1].position; r < size.y; r++){
                        ctx.fillRect(0,r,size.x, 1);
                    }
                }
            }

            return;
        });
    }
}

var colors = {
    palettes: {
        fleja: {
            colors: ['#1f1833',//0
                '#2b2e42',//1
                '#414859',//2
                '#68717a',//3
                '#90a1a8',//4
                '#b6cbcf',//5
                '#ffffff',//6
                '#fcbf8a',//7
                '#b58057',//8
                '#8a503e',//9
                '#5c3a41',//10
                '#c93038',//11
                '#de6a38',//12
                '#ffad3b',//13
                '#ffe596',//14
                '#fcf960',//15
                '#b4d645',//16
                '#51c43f',//17
                '#309c63',//18
                '#236d7a',//19
                '#264f6e',//20
                '#233663',//21
                '#417291',//22
                '#4c93ad',//23
                '#63c2c9',//24
                '#94d2d4',//25
                '#b8fdff',//26
                '#3c2940',//27
                '#46275c',//28
                '#826481',//29
                '#f7a48b',//30
                '#c27182',//31
                '#852d66']//32
        }
    },
    rgba: {
        transparentWhite: 'rgba(255,255,255, 0)',
        transparentBlack: 'rgba(0,0,0, 0)',
        white: 'rgba(255,255,255, 1)',
        black: 'rgba(0,0,0,1)',
    },
    createColorChange(value1, value2, colorType, steps, type, method) {
        if(steps < 2)
            throw "Steps should be more than 1";

        let rgb1 = colors.colorTypeConverter({ value: value1, toType: 'rgb' });
        let rgb2 = colors.colorTypeConverter({ value: value2, toType: 'rgb' });

        let rValues = easing.fast({ from: rgb1.r, to: rgb2.r, steps, type, method }).map(v => fast.r(v));
        let gValues = easing.fast({ from: rgb1.g, to: rgb2.g, steps, type, method }).map(v => fast.r(v));
        let bValues = easing.fast({ from: rgb1.b, to: rgb2.b, steps, type, method }).map(v => fast.r(v));

        let result = [];
        for(let i = 0; i<steps;i++){
            result.push(colors.colorTypeConverter({ value: { r: rValues[i],g: gValues[i],b: bValues[i] }, toType: colorType }));
        }

        return result;
        
    },
    createEasingChange({hsv = {from:{h:0,s:0,v:0}, to:{h:0,s:0,v:0}}, rgb = {from:{r:0,g:0,b:0}, to:{r:0,g:0,b:0}}, type = 'quad', method = 'in', time = 100}) {
        let change = {
            current: {},
            h: easing.createProps(time, hsv.from.h,hsv.to.h, type, method),
            s: easing.createProps(time, hsv.from.s,hsv.to.s, type, method),
            v: easing.createProps(time, hsv.from.v,hsv.to.v, type, method),
            r: easing.createProps(time, rgb.from.r,rgb.to.r, type, method),
            g: easing.createProps(time, rgb.from.g,rgb.to.g, type, method),
            b: easing.createProps(time, rgb.from.b,rgb.to.b, type, method),
        }

        return {
            processer: function(time, change) {
                if(change == undefined)
                    change = this.change;

                Object.entries(change).forEach(([key,value]) => {
                    if(key == 'current')
                        return;

                    value.time = time;
                    change.current[key] = easing.process(value);
                    if(key == 'r' || key == 'g' || key == 'b'){
                        change.current[key] = fast.r(change.current[key]);
                    }
                })
            },
            getCurrent: function(scheme, raw = false){
                if(scheme == 'hsv'){
                    if(raw)
                        return {h: this.change.current.h, s: this.change.current.s, v: this.change.current.v};

                    return colors.hsvToHex([this.change.current.h, this.change.current.s, this.change.current.v])
                }
                else if(scheme == 'rgb'){
                    if(raw)
                        return {r: this.change.current.r, g: this.change.current.g, b: this.change.current.b};

                    return rgbToHex(this.change.current.r,this.change.current.g,this.change.current.b)
                }
                
                return undefined;
            },
            change
        };
    },
    getMidColor({color1, color2, resultType = 'hex'}){
        let rgb1 = hexToRgb(color1, true);
        let rgb2 = hexToRgb(color2, true);

        let mid = rgb1.map((el, i) => {
            return fast.r((rgb1[i]+rgb2[i])/2)
        });

        switch(resultType){
            case 'hex':
                return '#' + rgbToHex(mid);
        }

        return mid;

    },
    hsvToHex(hsv) {
        return hsvToHex({hsv});
    },
    hexToHsv(hex) {
        var rgb = hexToRgb(hex, false, true);
        return rgbToHsv(rgb.r, rgb.g, rgb.b);
    },
    colorTypeConverter({value, toType, fromType = undefined}){
        if(!fromType){
            if(typeof(value) == 'string'){
                if(value[0] == '#'){
                    fromType = 'hex';
                }
                else if(value.toLowerCase().startsWith('rgb')){
                    fromType = 'rgbStr';
                }
                else {
                    throw 'Unknown color string representation: ' + value;
                }
            }
            else {
                if(isArray(value)) {
                    throw 'Unknown color type. Array: ' + value.join(',');
                }
                else {
                    if(value.r != undefined && value.g != undefined && value.b != undefined){
                        fromType = 'rgb'
                    }
                    else if(value.h != undefined && value.s != undefined && value.v != undefined){
                        fromType = 'hsv'
                    }
                    else {
                        throw 'Unknown color type. Object: ' + JSON.stringify(value) 
                    }
                }
            }
        }

        fromType = fromType.toLowerCase();
        toType = toType.toLowerCase();

        if(toType == fromType){
            return value;
        }

        let colorData = undefined;
        switch(fromType){
            case "hex":
                colorData = hexToRgb(value, false, true);
                break;
            case "hsv": 
                colorData = hsvToRgb(value.h, value.s, value.v, false, (Number.isInteger(value.h) && Number.isInteger(value.s) && Number.isInteger(value.v)));
                break;
            case "rgb": 
                colorData = value;
                break;
            case "rgbstr": 
                colorData = colors.rgbStringToObject({ value, asObject: true, shortNames: true });
                break;
            default:
                throw "Unknow from type: " + fromType;
        }

        let result = undefined;

        switch(toType) {
            case "hex": 
                result = rgbToHex(colorData.r, colorData.g, colorData.b);
                if(result[0] != "#")
                result = "#" + result;
                break;
            case "hsv":
                result = rgbToHsv(colorData.r, colorData.g, colorData.b, false);
                result.h = fast.r(result.h*360);
                result.s = fast.r(result.s*100);
                result.v = fast.r(result.v*100);
                break;
            case "rgb": 
                result = colorData;
                break;
            case "rgbstr": 
                result = colors.rgbToString({ value: colorData, isObject: true })
                break;
            default:
                throw "Unknow to type: " + toType;
        }
        
        return result;
    },
    rgbStringToObject({value, asObject = true, shortNames = false}){
        let match = value.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d*)?)\))?/);
        let result = undefined; 
        if(match){
            result = {
                red: match[1] ? parseInt(match[1]): undefined,
                green: match[2] ?parseInt(match[2]) : undefined,
                blue: match[3] ? parseInt(match[3]) : undefined,
                opacity: match[4] ? parseFloat(match[4]) : undefined
              }
        }
        if(!asObject){
            return [result.red,result.green,result.blue,result.opacity]
        }

        if(shortNames) {
            return {
                r: result.red,
                g: result.green,
                b: result.blue,
                o: result.opacity
            };
        }

        return result;
    },
    rgbToString({value, isObject = false, opacity = 1}) {
        if(isObject)
            return `rgba(${value.r || value.red || 0}, ${value.g || value.green || 0}, ${value.b || value.blue || 0}, ${(value.opacity != undefined ? value.opacity : opacity)})`;

        return `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${(value[3]!= undefined ? value[3] : opacity)})`;
    },
    toHsv({initialValue, isRgb = false, resultAsArray = false, asInt = false}){
        let rgb = undefined;
        if(!isRgb){
            rgb = hexToRgb(initialValue, true)
        }
        else if(!isArray(initialValue)) {
            rgb = [initialValue.r, initialValue.g, initialValue.b];
        }
        else {
            rgb = [...initialValue];
        }

    
        let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);

        if(asInt){
            hsv.h= fastRoundWithPrecision(hsv.h*360);
            hsv.s = fastRoundWithPrecision(hsv.s *100);
            hsv.v= fastRoundWithPrecision(hsv.v*100);
        }

        if(resultAsArray){
            return [hsv.h, hsv.s, hsv.v];
        }

        return hsv;
    },
    changeHSV({initialValue, parameter, amount,  isRgb = false, asArray = true}){
        let hsv = this.toHsv({initialValue});
        if(hsv[parameter] == undefined)
            throw 'colors.changeHSV unknown parameter:' + parameter;

        if(amount >= 1 || amount <= -1){
            if(parameter == 'h')
                amount/=360;
            else 
                amount/=100;
        }

        hsv[parameter]+=amount;
        let resultRgb = hsvToRgb(hsv.h, hsv.s, hsv.v, true);
        if(isRgb){
            if(asArray)
                return resultRgb;
            else {
                return { r: resultRgb[0], g: resultRgb[1], br: resultRgb[2]}
            }
        }
        else {
            return '#' + rgbToHex(resultRgb);
        }
    },
    saveImage(canvas, {size = undefined, name = 'export', type = "image/png" }){
        let resultImg;
        if(size == undefined){
            resultImg = canvas;
        }
        else {
            resultImg = createCanvas(size, (ctx, size) => {
                ctx.drawImage(canvas, 0,0, size.x, size.y)
            });
        }
        
        //window.location.href = resultImg;
        var link = document.createElement("a");
        link.download = name;
        link.href = resultImg.toDataURL(type).replace(type, "image/octet-stream");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    },
    createRadialGradient({ size, center, radius, gradientOrigin, angle, 
        setter = undefined, easingType = 'quad', easingMethod = 'out',
        maxValue= 1, minValue= 0
         }) {
        if(!size){
            size = this.viewport.clone();
        }

        angle = degreeToRadians(angle);

        if(!setter){
            console.log('no setter detected. Set default');

            setter = (dot, aValue) => {
                    if(!dot.values){
                        dot.values = [];
                    }

                    dot.values.push(aValue);
                }
            //throw 'Dot value setter is not provided';
        }

        let setDot = (x,y, setter) => {
            let row = dots[y];
            if(!row){
                dots[y] = [];
                row = dots[y];
            }

            if(!row[x]){
                row[x] = {};
            }

            setter(row[x]);
        }

        let isInEllipsis = (x,y) => {
            let _x = x-center.x;
            let _y = y-center.y;

            return Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq <= 1
        }

        let dots = [];
        let rxSq = radius.x*radius.x;
        let rySq = radius.y*radius.y;
        let maxSize = radius.x > radius.y ? new V2(radius.x, radius.x) : new V2(radius.y, radius.y);
        let _cos = Math.cos(angle);
        let _sin = Math.sin(angle);
        let ellipsisBox = new Box(center.substract(maxSize).toInt().add(new V2(-1,-1)), maxSize.mul(2).add(new V2(3,3)));

        if(!isInEllipsis(gradientOrigin.x, gradientOrigin.y))
            throw 'Gradient origin is not inside elipsis';

        let pp = undefined;
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            pp = new PP({ctx});
        })

        for(let y = center.y-maxSize.y-1;y < center.y+maxSize.y+1;y++){
            dots[y] = [];
            for(let x = center.x-maxSize.x-1;x < center.x+maxSize.x+1;x++){
                if(!isInEllipsis(x,y)){
                    continue;
                }

                let currentDot = new V2(x,y);

                if(currentDot.equal(gradientOrigin)){
                    setDot(x,y, (dot) => setter(dot, 1))
                    continue;
                }

                let currentDirection = gradientOrigin.direction(currentDot);
                let point2 = rayBoxIntersection(currentDot, currentDirection, ellipsisBox);
                if(!point2 || point2.length == 0)
                    throw 'No box intersection found!';

                point2 = point2[0];
                let linePoints = pp.lineV2(gradientOrigin, point2);

                let stopIndex = 0;
                for(let i = 0; i < linePoints.length;i++){
                    let linePoint = linePoints[i];
                    let _x = linePoint.x-center.x;
                    let _y = linePoint.y-center.y;
                    stopIndex = i; // индекс первого элемента за границей эллипса
                    if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq > 1)
                        break;

                }

                let aValues = easing.fast({from: maxValue, to: minValue, steps: stopIndex, type:easingType, method:easingMethod});
                for(let i = 0; i < stopIndex;i++){
                    let linePoint = linePoints[i];

                    setDot(linePoint.x, linePoint.y, (dot) => { setter(dot, aValues[i]) } )
                }
            }
        }

        return dots;
    }
    

}