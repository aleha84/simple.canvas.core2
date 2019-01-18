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
                length: 25
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
                current.position.x-=sc.imgSize.x;
            }

            if(current.position.x < 0){
                current.position.x+=sc.imgSize.x;
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
                let opacity = sc.opacity.length == 1? sc.opacity[0] : undefined;

                let count = sc.preciseCount || size.x*size.y*sc.density;
                for(let i = 0; i < count;i++){
                    
                    clrRGB =  hexToRgb(clr == undefined ? sc.colors[getRandomInt(0, sc.colors.length-1)]: clr, true);

                    if(opacity == undefined)
                        opacity =  getRandom(sc.opacity[0], sc.opacity[1]);

                    let clrRGBA = `rgba(${clrRGB[0]},${clrRGB[1]},${clrRGB[2]},${opacity})`
                    if(sc.type == 'rect'){
                        ctx.fillStyle = clrRGBA;
                        ctx.fillRect(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y), sc.fillSize.x, sc.fillSize.y);
                    }
                    else if(sc.type == 'line'){
                        ctx.strokeStyle = clrRGBA;
                        ctx.beginPath();
                        let lineFrom = new V2(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y)) 
                        ctx.moveTo(lineFrom.x, lineFrom.y);
                        let lineTo = lineFrom.add(V2.up.rotate(sc.line.directionAngle+getRandom(-sc.line.angleSpread,sc.line.angleSpread)).mul(sc.line.length));
                        ctx.lineTo(lineTo.x, lineTo.y);
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