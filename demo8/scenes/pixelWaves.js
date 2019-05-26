class PixelWavesScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
            },
            layersCount: 12,
            dotsPerLayer: 30,
            layers: [],
            baseColorHSV: [0,100,100],
            minV: 15,
            yShiftClamps: [-25, 25],
            currentYShift: 25,
            minWidthRatio: 0.25,
            maxWidthRatio: 3/4,
            levitationClamps: [2, 10],
            levitationDuration: 35,
        }, options)

        super(options);
    }

    backgroundRender() {
        let ctx = SCG.contexts.background;
        let s = SCG.viewport.real.size;

        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,s.x,s.y);

        let grd = ctx.createLinearGradient(s.x/2, 0, s.x/2, s.y);
        grd.addColorStop(0, 'rgba(255,255,255,0.5)');
        grd.addColorStop(0.25, 'rgba(255,255,255,0)')
        grd.addColorStop(0.75, 'rgba(255,255,255,0)')
        grd.addColorStop(1, 'rgba(255,255,255,0.1)');
        //grd.addColorStop(0.1, 'rgba(255,255,255,0)')

        ctx.fillStyle = grd;
        ctx.fillRect(0,0,s.x,s.y);

        //this.backgroundRenderDefault();
    }

    start() {
        let maxWidth = fastRoundWithPrecision(this.viewport.x * this.maxWidthRatio);
        let minWidth = fastRoundWithPrecision(this.viewport.x * this.minWidthRatio);
        let widthDelta = maxWidth - minWidth;
        let hDelta = 100 - this.minV;
        let shift = { time: 0, duration: this.layersCount-1, change: this.currentYShift, type: 'linear', method: 'base', startValue: 0 }
        let levitationMax = { time: 0, duration: this.layersCount-1, change: this.levitationClamps[1], type: 'linear', method: 'base', startValue: this.levitationClamps[0] }

        for(let i = 0; i < this.layersCount; i++){

            shift.time = i;
            levitationMax.time = i;

            this.layers.push(this.addGo(new Layer({
                count: this.dotsPerLayer,
                size: new V2(minWidth + widthDelta*i/(this.layersCount-1), 1),
                position: this.sceneCenter.clone(),
                baseColorHSV: [this.baseColorHSV[0], this.baseColorHSV[1], this.minV + hDelta*i/(this.layersCount-1)],
                yShift: easing.process(shift),  //this.currentYShift*i/(this.layersCount-1)
                levitationMax: easing.process(levitationMax),
                levitationDuration: this.levitationDuration,
            }), i));    
        }

        let lc = 0;
        this.startLevitationTimer = this.registerTimer(createTimer(250, () => {
            //console.log(lc);
            this.currentHByLayers[lc] = 0;
            this.layers[lc++].startLevitation();
            

            if(lc == this.layersCount)
                this.unregTimer(this.startLevitationTimer);
        }, true, this));

        this.currentHByLayers = new Array(this.layersCount).fill();

        this.colorChangeTimer = this.registerTimer(createTimer(25, () => {
            // if(this.currentHByLayers == undefined){
            //     this.currentHByLayers = new Array(this.layersCount).fill();
            //     this.currentHByLayers[0] = 0;

            //     return;
            // }

            for(let i = 0; i < this.layersCount; i++){
                if(this.currentHByLayers[i] == undefined){
                    //this.currentHByLayers[i] = 0;
                    break;
                }
                    

                this.currentHByLayers[i]++;
                if(this.currentHByLayers[i] > 360){
                    this.currentHByLayers[i] = 0;
                }

                this.layers[i].baseColorHSV[0] = this.currentHByLayers[i];
                this.layers[i].createImg();
            }

        }, this, false));
    }
}

class Layer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(100,1),
            count: 5,
            yShift: 0,
            baseColorHSV: [0,100,100],
            dots: [],
            levitationMax: 5,
            levitationDuration: 40
        }, options)

        super(options);

        this.position.y += this.yShift;
    }

    startLevitation() {
        this.dots.forEach(d => d.startLevitation());
    }

    createImg() {
        let that = this;
        this.dotImg = createCanvas(new V2(1,1), (ctx) => {
            ctx.fillStyle = '#' + rgbToHex(hsvToRgb(that.baseColorHSV[0]/360, that.baseColorHSV[1]/100, that.baseColorHSV[2]/100, true));
            ctx.fillRect(0,0,1,1);
        })

        this.dots.forEach(d => d.img = this.dotImg);
    }

    init(){
        let xStart = -this.size.x/2;
        
        for(let i = 0; i < this.count; i++){
            this.dots.push(this.addChild(new Pseudo3dPoint({
                colorHSV: this.baseColorHSV,
                position: new V2(xStart + this.size.x*i/(this.count-1),0),
                //img: this.dotImg,
                levitation: {
                    max: this.levitationMax,
                    duration: this.levitationDuration
                }
            })));
        }

        this.createImg();
    }
}

class Pseudo3dPoint extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            colorHSV: [0,100,100],
            size: new V2(1,1),
            levitation: {
                enabled: false,
                time: 0, duration: 40,startValue: 0, change: 5, max: 5, direction: 1, type: 'quad', method: 'inOut',
            }
        }, options)

        super(options);
    }

    init(){
        this.originalY = this.position.y;
        //this.startLevitation()
    }

    startLevitation() {
        this.levitationTimer = createTimer(40, this.levitationTimerProcesser, this, true);
        this.levitation.enabled = true;
        this.levitation.change = this.levitation.max;
        this.registerTimer(this.levitationTimer);
    }

    levitationTimerProcesser() {
        let l = this.levitation;

        if(l.time > l.duration){
            l.direction*=-1;
            l.time = 0;

            if(l.direction < 0){
                l.startValue = l.max;
                l.change = -l.max*2;
            }
            else if(l.direction > 0){
                l.startValue = -l.max;
                l.change = l.max*2;
            }
            
        }

        let delta = easing.process(l);
        this.position.y = this.originalY + delta;

        this.needRecalcRenderProperties = true;
        l.time++;
    }
}