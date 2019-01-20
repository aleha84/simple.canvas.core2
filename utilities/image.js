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
    createPlanetTexure(baseTexture, textureName, baseTextureSize, diskSize, speed, time, addShadows) {
        return createCanvas(new V2(diskSize,diskSize), (ctx, size) => {
            let sphereImg = this.createSphere(baseTexture, textureName, baseTextureSize, diskSize, speed,time);
            ctx.drawImage(sphereImg, 0,0, size.x, size.y);
            
            if(addShadows) {
                ctx.save();
                ctx.arc(size.x/2,size.x/2, size.x/2 + 1, 0, Math.PI*2, false );
                ctx.clip();
                
                let grd =ctx.createRadialGradient(size.x/4, size.x/4, 0, 0, 0, 1.2*size.x); //main shadow
                grd.addColorStop(0.5, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,1)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                grd =ctx.createRadialGradient(size.x/2, size.y/2, 0.85*size.x/2, size.x/2, size.y/2, size.x/2); // sphere effect
                grd.addColorStop(0, 'rgba(0,0,0,0)');grd.addColorStop(1, 'rgba(0,0,0,0.75)');
                ctx.fillStyle = grd;
                ctx.fillRect(0,0, size.x, size.y);

                ctx.restore();
            }
            

            
        })
    },
    createSphere(originTextureImg, originTextureName, originSize, diskSize, rotationSpeed = 0, time = 0){
        if(!this.createSphereCalcCache[diskSize])
            this.createSphereCalcCache[diskSize] = [];

        if(!this.originTexturesDataCache)
            this.originTexturesDataCache = {};

        let imgPixelsData 
        let imgPixelsDataCacheItem = this.originTexturesDataCache[originTextureName];
        if(imgPixelsDataCacheItem === undefined){
            imgPixelsData = originTextureImg.getContext('2d').getImageData(0,0,originSize.x, originSize.y);
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
    }
}

var colors = {
    rgba: {
        transparentWhite: 'rgba(255,255,255, 0)',
        transparentBlack: 'rgba(0,0,0, 0)',
        white: 'rgba(255,255,255, 1)',
        black: 'rgba(0,0,0,1)',
    }
    

}