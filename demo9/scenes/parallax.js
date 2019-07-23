class MountainsParallaxScene extends Scene {
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
        this.backgroundRenderDefault('#B69E7B');
    }

    start(){
        this.addGo(new MountainParallaxLayer({
            size: new V2(this.viewport.x, fast.r(this.viewport.y/2)),
            position: new V2(this.sceneCenter.x, fast.r(this.viewport.y/4)),
            dots: [new V2(0,150), new V2(75, 60), new V2(200, 100), new V2(350, 50), new V2(500, 150)]
        }), 1);
    }
}

class MountainParallaxLayer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            h: 36,
            s: [32, 48],
            v: [72, 60],
        }, options)

        super(options);
    }

    init() {
        this.formula = mathUtils.getCubicSplineFormula(this.dots);
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            hlp.setFillColor('red').strokeRect(0,0,size.x, size.y);
            let allY = [];
            for(let x = 0; x < size.x; x++){
                allY[x] = fast.r(this.formula(x));
                hlp.setFillColor('blue').rect(x, allY[x], 1, size.y);
            }

            let minY = Math.min.apply(null, allY);
            let dHeight = size.y-minY;
            let foregroundLineImg = createCanvas(new V2(1, dHeight), (ctx, size, hlp) => {
                let sChange = easing.createProps(size.y, this.s[0], this.s[1], 'linear', 'base');
                let vChange = easing.createProps(size.y, this.v[0], this.v[1], 'linear', 'base');

                for(let y = 0; y < size.y; y++){
                    sChange.time = y;
                    vChange.time = y;
                    hlp.setFillColor(colors.hsvToHex([this.h, fast.r(easing.process(sChange)), fast.r(easing.process(vChange))])).dot(0, y);
                }
            });

            ctx.globalCompositeOperation = 'source-atop';

            ctx.drawImage(foregroundLineImg, 0, minY, size.x, dHeight);
        })
    }
}