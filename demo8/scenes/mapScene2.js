class MapScene2 extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
            },
        }, options)

        super(options);
    }

    start() {
        this.rawArr = [];
        let rawArr = this.rawArr;
        mapCoordinates.usa.states.state.forEach(s => {
            
            if(s['-name'] == 'Alaska' || s['-name'] == 'Hawaii' )
                return;
            let floatArr = s.point.map(p => ([fastRoundWithPrecision(parseFloat(p['-lng']),2), fastRoundWithPrecision(parseFloat(p['-lat']),2)]))

            rawArr[rawArr.length] = {
                floatArr,
                name: s['-name']
            };
        });

        let raw = [];
        for(let i = 0; i < rawArr.length; i++){
            raw = [...raw, ...rawArr[i].floatArr];
        }

        let v2Raw = raw.map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1]))));
        let allX = v2Raw.map(c => c.x);
        let allY = v2Raw.map(c => c.y);
        let minX = Math.min.apply(null, allX);
        let maxX = Math.max.apply(null, allX)+1;
        let minY = Math.min.apply(null, allY);
        let maxY = Math.max.apply(null, allY)+1;

        let size = new V2((maxX - minX),(maxY - minY));
        let scale =size.x > size.y
            ? this.viewport.x/size.x
            : this.viewport.y/size.y;

        this.shiftRel = new V2(minX, minY);
        let scaledArr = [];
        this.poligons = [];

        let that = this;

        this.selectedPoligon = undefined;
        for(let i = 0; i < rawArr.length; i++){
            //let isForSelect = rawArr[i].name == 'Texas';
            let scaledCoordinates = rawArr[i].floatArr.map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1])))).map(c => c.substract(this.shiftRel).mul(scale));
            scaledArr = [...scaledArr, ...scaledCoordinates];

            this.testFillColorHSV = [50, 80, 60];
            this.borderColorHSV = [200, 80, 50];
            this.poligons[i] = this.addGo(new Poligon2({
                rawData: rawArr[i],
                coordinates: scaledCoordinates,
                baseColor: hsvToHex({hsv:this.testFillColorHSV}),
                baseColorHSV: this.testFillColorHSV,
                borderColorHSV: this.borderColorHSV,
                hClamps: [30, 110],
                borderHClamps: [120, 200],
                //showBlink: isForSelect,
                initCompleted: function() {
                    that.poligonsInitCompletionCheck();
                }
            }), 1)

            // if(isForSelect){
            //     this.selectedPoligon = this.poligons[i]
            // }
        }

        allX = scaledArr.map(c => c.x);
        allY = scaledArr.map(c => c.y);
        minX = Math.min.apply(null, allX);
        maxX = Math.max.apply(null, allX)+1;
        minY = Math.min.apply(null, allY);
        maxY = Math.max.apply(null, allY)+1;

        let additionalAlign = new V2((this.viewport.x - maxX)/2, (this.viewport.y - maxY)/2);
        this.poligons.forEach(p => {
            p.additionalAlign = additionalAlign;
        })

        this.poligonsRiseQueue = [];

        // let demoText = PP.createText({ text: 'TEXAS' });

        // this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: demoText.size,
        //     img: demoText.img
        // }), 100)

        
    }

    // risePoligon(poligon) {
    //     poligon.changeLayerIndex = 10;
    //     poligon.shouldRise = true;
    //     poligon.riseCompleteCallback = this.poligonRiseComplete.bind(this);
    // }

    // poligonRiseComplete(poligon) {
    //     poligon.changeLayerIndex = 1;
    // }

    poligonsInitCompleted() {
        let s = this.poligons.filter(p => p.rawData.name == 'Texas')[0];
        this.selectedPoligon = s;
        s.changeLayerIndex = 10;
        s.startBlink();
    }

    showDetailed() {
        let that =this;

        let s_raw = this.rawArr.filter(r => r.name === 'Texas')[0];

        let s_v2Raw = s_raw.floatArr.map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1]))));
        let s_allX = s_v2Raw.map(c => c.x);
        let s_allY = s_v2Raw.map(c => c.y);
        let s_minX = Math.min.apply(null, s_allX);
        let s_maxX = Math.max.apply(null, s_allX)+1;
        let s_minY = Math.min.apply(null, s_allY);
        let s_maxY = Math.max.apply(null, s_allY)+1;

        let s_size = new V2((s_maxX - s_minX),(s_maxY - s_minY));

        let s_ratioX = this.viewport.x /s_size.x;
        let s_ratioY = this.viewport.y/s_size.y; 
        
        let s_scale = Math.min(s_ratioX, s_ratioY);

        let s_shiftRel = new V2(s_minX, s_minY);
        let s_scaledCoordinates = s_raw.floatArr.map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1])))).map(c => c.substract(s_shiftRel).mul(s_scale));

        this.detailedState = this.addGo(new Poligon2({
            rawData: {
                floatArr: s_raw.floatArr,
                name: 'Texas detailed'
            },
            coordinates: s_scaledCoordinates,
            baseColor: hsvToHex({hsv:this.testFillColorHSV}),
            baseColorHSV: this.selectedPoligon.baseColorHSV,
            borderColorHSV: this.selectedPoligon.borderColorHSV,
            hClamps: undefined,
            borderHClamps: undefined,
            initCompleted: function() {
                this.targetPosition = that.sceneCenter.clone();
                this.position = that.selectedPoligon.position.clone();
                this.targetSize = this.size.clone();
                this.size = that.selectedPoligon.size.clone();
                let appearFrames = 20;

                this.scaleX = { time: 0, duration: appearFrames, change: this.targetSize.x - this.size.x, type: 'quad', method: 'out', startValue: this.size.x };
                this.scaleY = { time: 0, duration: appearFrames, change: this.targetSize.y - this.size.y, type: 'quad', method: 'out', startValue: this.size.y };
                this.moveX = { time: 0, duration: appearFrames, change: this.targetPosition.x - this.position.x, type: 'quad', method: 'out', startValue: this.position.x };
                this.moveY = { time: 0, duration: appearFrames, change: this.targetPosition.y - this.position.y, type: 'quad', method: 'out', startValue: this.position.y };

                this.appearTimer = this.registerTimer(createTimer(25, () => {
                    this.size.x = easing.process(this.scaleX);
                    this.size.y = easing.process(this.scaleY);
                    this.position.x = easing.process(this.moveX);
                    this.position.y = easing.process(this.moveY);

                    this.needRecalcRenderProperties = true;
                    this.scaleX.time++;
                    this.scaleY.time++;
                    this.moveX.time++;
                    this.moveY.time++;

                    if(this.scaleX.time > this.scaleX.duration){
                        this.unregTimer(this.appearTimer);
                    }
                }, this, true));
            }
        }), 100)
    }

    poligonsInitCompletionCheck() {
        if(this.poligons.filter(p => !p.initialized).length == 0){
            this.initialDelayTimer = this.registerTimer(createTimer(1000, () => {
                this.poligonsInitCompleted();
                this.unregTimer(this.initialDelayTimer);
            }, this, false));
            
        }
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}

class Poligon2 extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            name: '',
            coordinates: [],
            baseColor: 'red',
            borderColor: 'green',
            baseColorHSV: [0, 100, 70],
            borderColorHSV: [200, 50, 70],
            size: new V2(1,1),
            position: new V2(),
            images: {},
            hClamps: [50, 80],
            borderHClamps: [200, 280],
            xChange: 5,
            yChange: 5,
            template: {"general":{"originalSize":{"x":20,"y":20},"size":{"x":20,"y":20},"zoom":1,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"points":[]}]}}
        }, options)

        super(options);
    }

    init() {
        this.countToTriggerRise = 2;

        this.riseState = 'idle';
        let allX = this.coordinates.map(c => c.x);
        let allY = this.coordinates.map(c => c.y);
        let minX = Math.min.apply(null, allX);
        let maxX = Math.max.apply(null, allX)+1;
        let minY = Math.min.apply(null, allY);
        let maxY = Math.max.apply(null, allY)+1;
        this.size = new V2(fastRoundWithPrecision(maxX - minX),fastRoundWithPrecision(maxY - minY));
        this.position = new V2(minX + this.size.x/2, minY + this.size.y/2).add(this.additionalAlign);

        this.shiftRel = new V2(minX, minY);
        this.coordinatesRel = this.coordinates.map(c => c.substract(this.shiftRel))

        this.model = assignDeep({}, this.template);
        this.model.general.originalSize = this.size;
        this.model.general.size = this.size;
        this.model.main.layers[0].points = this.coordinatesRel.map(p => ({ point: p }));

        if(this.hClamps)
            this.baseColorHSV[0] =  this.hClamps[0] + (this.hClamps[1] - this.hClamps[0]) *this.position.x/this.parentScene.viewport.x;
        
        if(this.borderHClamps)
            this.borderColorHSV[0] = this.borderHClamps[0] + (this.borderHClamps[1] - this.borderHClamps[0]) *this.position.x/this.parentScene.viewport.x;

        // if(this.showBlink) {
                   
        // }

        this.blinkImages = [];
        this.blinkImage = createCanvas(this.size, (ctx, size) => {
            let pp = new PerfectPixel({context: ctx});
            
            
            ctx.fillStyle = 'white';
            this.blinkWidth = 40;
            for(let i = 0; i < this.blinkWidth; i++){
                pp.lineV2(new V2(size.x - this.blinkWidth + i - 1, 0), new V2(i, size.y - 1));
            }
        })   

        this.createImg({baseColor: hsvToHex({hsv:this.baseColorHSV}), borderColor: hsvToHex({hsv:this.borderColorHSV})});

        // if(this.showBlink) {
        //     this.startBlink();
        // }
        
    }

    internalPreUpdate(){
        if(this.shouldRise){
            this.shouldRise = false;
            this.rise(this.riseCompleteCallback);
        }
    }

    rise(completeCallback) {
        this.initialY = this.position.y;
        this.initialX = this.position.x;
        this.initialV = this.baseColorHSV[2];
        this.riseState = 'work';
        this.script.items = [
            function(){
                
                let rise = { time: 0, duration: 20, change: -this.yChange, type: 'cubic', method: 'out', startValue: this.position.y };
                let right = { time: 0, duration: 20, change: this.xChange, type: 'cubic', method: 'out', startValue: this.position.x };
                let lighter = { time: 0, duration: 20, change: 20, type: 'cubic', method: 'out', startValue: this.baseColorHSV[2] };

                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(rise);
                        this.position.x =  easing.process(right);
                        this.baseColorHSV[2] = easing.process(lighter);

                        this.createImg({baseColor: hsvToHex({hsv:this.baseColorHSV})})
                        rise.time++;   
                        right.time++; 
                        lighter.time++;
                    },
                    function() { return rise.time > rise.duration; },
                    true,
                    10
                );
            },
            function(){
                let fall = { time: 0, duration: 20, change: this.yChange, type: 'cubic', method: 'in', startValue: this.position.y };
                let left = { time: 0, duration: 20, change: -this.xChange, type: 'cubic', method: 'in', startValue: this.position.x };
                let darker = { time: 0, duration: 20, change: -20, type: 'cubic', method: 'in', startValue: this.baseColorHSV[2] };

                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(fall);
                        this.position.x =  easing.process(left);
                        this.baseColorHSV[2] = easing.process(darker);

                        this.createImg({baseColor: hsvToHex({hsv:this.baseColorHSV})})
                        fall.time++;  
                        left.time++;   
                        darker.time++;
                    },
                    function() { return fall.time > fall.duration; },
                    true,
                    10
                );
            },
            function() {
                this.position.y = this.initialY;
                this.position.x = this.initialX;
                this.baseColorHSV[2] = this.initialV;
                this.createImg({baseColor: hsvToHex({hsv:this.baseColorHSV})})
                this.needRecalcRenderProperties = true;
                if(this.riseStateIdleOnComplete){
                    this.riseStateIdleOnComplete = false;
                    this.riseState = 'idle';
                }
                else 
                    this.riseState = 'competed';
                completeCallback(this);
                this.processScript();
            }
        ]

        this.processScript();
    }

    fall(completeCallback) {

    }

    startBlink() {
        this.blinkImageX = -this.size.x/2;
        this.currentBlinkFrameIndex = 0;
        this.blinkCount = 2;
        this.blinkTimer = this.registerTimer(createTimer(20, () => {
            this.img = this.blinkImages[this.currentBlinkFrameIndex];

            this.currentBlinkFrameIndex++;

            if(this.currentBlinkFrameIndex == this.blinkImages.length){
                this.blinkCount--;
                this.currentBlinkFrameIndex = 0;

                if(this.blinkCount == 0){
                    this.countToTriggerRise--;
                    this.unregTimer(this.blinkTimer);
                    this.blinkDelayTimer = this.registerTimer(createTimer(1000, () => {
                        this.unregTimer(this.blinkDelayTimer);
                        if(this.countToTriggerRise == 0){
                            this.countToTriggerRise = 2;
                            this.rise(this.startBlink.bind(this));
                        }
                        else {
                            this.blinkCount = 2;
                            this.startBlink();
                        }
                        
                    }, this, false));
                }
            }
                

        }, this, true));
    }

    resetRiseState() {
        if(this.riseState == 'work'){
            this.riseStateIdleOnComplete = true;
        }
        else
            this.riseState = 'idle';
    }


    createImg({baseColor = undefined, borderColor = undefined}) {
        if(borderColor)
            this.borderColor = borderColor;

        this.model.main.layers[0].strokeColor = this.borderColor;

        if(baseColor)
            this.baseColor = baseColor;
        this.model.main.layers[0].fillColor = this.baseColor;

        let key = `${this.baseColor}_${this.borderColor}`;
        if(!this.images[key]){
            this.images[key] = PP.createImage(this.model);

            if(this.blinkImage && !this.blinkImages.length) {
                let that = this;
                this.blinkImages = [];
                this.blinkFrames = 12;
                for(let i = 0; i < this.blinkFrames; i++){
                    this.blinkImages[i] = 
                    createCanvas(this.size, (ctx,size) => {
                        ctx.drawImage(that.images[key] , 0,0, size.x, size.y);
                        ctx.globalCompositeOperation = 'source-atop';
                        ctx.drawImage(that.blinkImage , -size.x + i*size.x*2/that.blinkFrames,0, size.x, size.y);
                    })
                }
                
                //return;
            }
        }

        this.img = this.images[key];
    }
}