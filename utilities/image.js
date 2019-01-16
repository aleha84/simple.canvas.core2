var textureGenerator = {
    getSurfaceProperties(config) {
        return assignDeep({}, {
            //type: 'dots',
            colors: ['#000000'],
            opacity: [0.05, 0.1],
            fillSize: new V2(1,1),
            density: 1,
            indents: {
                h: new V2(),
                v: new V2()
            }
        }, config);
    },

    textureGenerator(config){
        config = assignDeep({}, {
            size: new V2(100, 100),
            backgroundColor: '#A67E0D',
            surfaces: [],
        }, config);

        return createCanvas(config.size, (ctx, size) => {
            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0,0, size.x, size.y);

            for(let sc of config.surfaces){
                let from = new V2(sc.indents.h.x, sc.indents.v.x);
                let to = new V2(config.size.x - sc.indents.h.y - sc.fillSize.x, config.size.y - sc.indents.v.y - sc.fillSize.y);
                let clr = sc.colors.length == 1? hexToRgb(sc.colors[0], true):  undefined;
                let opacity = sc.opacity.length == 1? sc.opacity[0] : undefined;

                for(let i = 0; i < size.x*size.y*sc.density;i++){
                    if(clr == undefined)
                        clr =  hexToRgb(sc.colors[getRandom(0, sc.colors.length-1)], true);

                    if(opacity == undefined)
                        opacity =  getRandom(sc.opacity[0], sc.opacity[1]);

                    clr = `rgba(${clr[0]},${clr[1]},${clr[2]},${opacity})`
                    ctx.fillStyle = clr;
                    
                    ctx.fillRect(getRandomInt(from.x, to.x), getRandomInt(from.y, to.y), sc.fillSize.x, sc.fillSize.y);
                }
            }
        });

    }
}