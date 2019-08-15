class NightRainScene extends Scene {
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
        this.backgroundRenderDefault(colors.rgba.black);
    }

    start(){
        this.palette = [
            '#160F11',
            '#242125',
            '#3C363B',
            '#635E62'
        ];

        this.addGo(new GO({
            position: new V2(300, 200),
            size: new V2(8, 200),
            img: createCanvas(new V2(8, 200), (ctx, size, hlp) => {
                //hlp.setFillColor('red').rect(0,0,size.x, size.y);
                hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(0, 0, 8, size.y)
                hlp.setFillColor(colors.palettes.fleja.colors[2]).rect(0, 0, 6, size.y/2)
                hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0, 0, 4, size.y/4)
                hlp.setFillColor(colors.palettes.fleja.colors[4]).rect(0, 0, 2, size.y/8)

                hlp.setFillColor(colors.palettes.fleja.colors[0])
                .rect(6, 0, 2, size.y).rect(5, size.y/2 + 40, 2, size.y/2).rect(4, size.y/2 + 80, 3, size.y/2).rect(0, fast.r(size.y*2/3) , 2, size.y/2)
                .rect(0, fast.r(size.y*3.85/6) , 2, 3)
                
                hlp.setFillColor(colors.palettes.fleja.colors[1]).rect(4, size.y*3/10, 2, 40).rect(2, size.y*4/10, 2, 20)

                hlp.setFillColor(colors.palettes.fleja.colors[2]).rect(2, size.y*1.5/10, 2, 20).rect(0, size.y*5.25/10, 2, 5).rect(0, size.y*5.75/10, 2, 3)
                hlp.setFillColor(colors.palettes.fleja.colors[3]).rect(0, size.y*2.65/10, 2, 3).rect(0, size.y*1/10, 2, 3);

                hlp.clear(size.x-6, 0,6,2).clear(size.x-2, 0, 2,size.y*0.5/10)
            })
        }),10)

        this.addGo(new GO({
            position: new V2(270, 95),
            size: new V2(30, 15),
            img: PP.createImage({"general":{"originalSize":{"x":30,"y":15},"size":{"x":30,"y":15},"zoom":10,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":5}},{"point":{"x":3,"y":4}},{"point":{"x":6,"y":3}},{"point":{"x":15,"y":2}},{"point":{"x":19,"y":2}},{"point":{"x":23,"y":4}},{"point":{"x":26,"y":6}},{"point":{"x":29,"y":10}},{"point":{"x":25,"y":12}},{"point":{"x":15,"y":13}},{"point":{"x":7,"y":13}},{"point":{"x":3,"y":11}},{"point":{"x":1,"y":8}}]}]}})
        }), 10)

        this.addGo(new GO({
            position: new V2(250, 190),
            size: new V2(200, 250),
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('#150E0F').rect(0,0,size.x, size.y)
            })
        }))
    }
}