class PixelWavesScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
            },
            layersCount: 5,
            dotsPerLayer: 10,
            layers: [],
            baseColorHSV: [0,100,100],
            minV: 25,
            yShiftClamps: [-25, 25],
            currentYShift: 25
        }, options)

        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        let maxWidth = fastRoundWithPrecision(this.viewport.x * 2/3);
        let minWidth = fastRoundWithPrecision(this.viewport.x *1/3);
        let widthDelta = maxWidth - minWidth;
        let hDelta = 100 - this.minV;

        for(let i = 0; i < this.layersCount; i++){
            this.layers.push(this.addGo(new Layer({
                count: this.dotsPerLayer,
                size: new V2(minWidth + widthDelta*i/(this.layersCount-1), 1),
                position: this.sceneCenter.clone(),
                baseColorHSV: [this.baseColorHSV[0], this.baseColorHSV[1], this.minV + hDelta*i/(this.layersCount-1)],
                yShift: this.currentYShift*i/(this.layersCount-1)
            }), i));    
        }
    }
}

class Layer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(100,1),
            count: 5,
            yShift: 0,
            baseColorHSV: [0,100,100],
            dots: []
        }, options)

        super(options);

        this.position.y += this.yShift;
    }

    init(){
        let xStart = -this.size.x/2;
        let that = this;
        this.dotImg = createCanvas(new V2(1,1), (ctx) => {
            ctx.fillStyle = '#' + rgbToHex(hsvToRgb(that.baseColorHSV[0]/360, that.baseColorHSV[1]/100, that.baseColorHSV[2]/100, true));
            ctx.fillRect(0,0,1,1);
        })
        for(let i = 0; i < this.count; i++){
            this.dots.push(this.addChild(new Pseudo3dPoint({
                colorHSV: this.baseColorHSV,
                position: new V2(xStart + this.size.x*i/(this.count-1),0),
                img: this.dotImg
            })));
        }
    }
}

class Pseudo3dPoint extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            colorHSV: [0,100,100],
            size: new V2(1,1)
        }, options)

        super(options);
    }

    init(){

    }
}