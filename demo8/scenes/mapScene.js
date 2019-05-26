class MapScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
            },
        }, options)

        super(options);
    }

    start() {
        let rawArr = [];
        mapCoordinates.usa.states.state.forEach(s => {
            
            if(s['-name'] == 'Alaska' || s['-name'] == 'Hawaii' )
                return;
            let floatArr = s.point.map(p => ([fastRoundWithPrecision(parseFloat(p['-lng']),2), fastRoundWithPrecision(parseFloat(p['-lat']),2)]))

            rawArr[rawArr.length] = floatArr;
        });

        let raw = [];
        for(let i = 0; i < rawArr.length; i++){
            raw = [...raw, ...rawArr[i]];
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

        for(let i = 0; i < rawArr.length; i++){
            let scaledCoordinates = rawArr[i].map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1])))).map(c => c.substract(this.shiftRel).mul(scale));
            scaledArr = [...scaledArr, ...scaledCoordinates];

            this.testFillColorHSV = [50, 80, 60];
            this.borderColorHSV = [200, 80, 50];
            this.poligons[i] = this.addGo(new Poligon({
                coordinates: scaledCoordinates,
                baseColor: hsvToHex({hsv:this.testFillColorHSV}),
                baseColorHSV: this.testFillColorHSV,
                borderColorHSV: this.borderColorHSV,
                hClamps: [30, 110],
                borderHClamps: [120, 200],
                initCompleted: function() {
                    that.poligonsInitCompletionCheck();
                }
            }), 1)
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
    }

    risePoligon(poligon) {
        poligon.changeLayerIndex = 10;
        poligon.shouldRise = true;
        poligon.riseCompleteCallback = this.poligonRiseComplete.bind(this);
    }

    poligonRiseComplete(poligon) {
        poligon.changeLayerIndex = 1;
    }

    poligonsInitCompleted() {
        this.queueFormationStyle = 'lr';

        this.currentRiseX = 0;
        this.currentRiseY = 0;
        this.xChange = 5;
        this.yChange = 5;
        this.poligonRiseDelay = false;

        this.risePoligonsTimer =  this.registerTimer(createTimer(25, () => {
            if(this.poligonRiseDelay)
                return;

            let reset = false;
            if(this.queueFormationStyle == 'lr' && this.currentRiseX >= this.viewport.x){
                this.queueFormationStyle = 'tb'
                reset = true;
            }
            else if(this.queueFormationStyle == 'tb' && this.currentRiseY >= this.viewport.y){
                this.queueFormationStyle = 'rl'
                reset = true;
            }
            else if(this.queueFormationStyle == 'rl' && this.currentRiseX < 0) {
                this.queueFormationStyle = 'bt'
                reset = true;
            }
            else if(this.queueFormationStyle == 'bt' && this.currentRiseY < 0) {
                this.queueFormationStyle = 'lr'
                reset = true;
            }
                
            if(reset){
                if(this.queueFormationStyle == 'lr') {
                    this.xChange = 5;
                    this.yChange = 5;
                    this.currentRiseX = 0;
                }
                else if(this.queueFormationStyle == 'tb') {
                    this.xChange = 5;
                    this.yChange = -5;
                    this.currentRiseY = 0;
                }
                else if(this.queueFormationStyle == 'rl') {
                    this.xChange = -5;
                    this.yChange = 5;
                    this.currentRiseX = this.viewport.x;
                }
                else if(this.queueFormationStyle == 'bt') {
                    this.xChange = -5;
                    this.yChange = 5;
                    this.currentRiseY = this.viewport.y;
                }

                this.poligonRiseDelay = true;
                this.poligonRiseDelyaTimer = this.registerTimer(createTimer(250, () => {
                    this.unregTimer(this.poligonRiseDelyaTimer);
                    this.poligonRiseDelay = false;

                    this.poligons.forEach(p => {
                        p.xChange = this.xChange;
                        p.yChange = this.yChange;
                        p.resetRiseState();
                    });
                }, this, false));
                return;
            }
                
            let pToRise = this.poligons.filter(p =>{
                if(p.riseState == 'idle'){
                    if(this.queueFormationStyle == 'lr'){
                        return p.position.x <= this.currentRiseX;
                    }
                    else if(this.queueFormationStyle == 'tb') {
                        return p.position.y <= this.currentRiseY;
                    }
                    else if(this.queueFormationStyle == 'rl') {
                        return p.position.x >= this.currentRiseX;
                    }
                    else if(this.queueFormationStyle == 'bt') {
                        return p.position.y >= this.currentRiseY;
                    }

                    return false;
                }

                return false;
            });

            pToRise.forEach(p => this.risePoligon(p));
            

            if(this.queueFormationStyle == 'lr'){
                this.currentRiseX+=5;
            }
            else if(this.queueFormationStyle == 'tb') {
                this.currentRiseY+=5;
            }
            else if(this.queueFormationStyle == 'rl') {
                this.currentRiseX-=5;
            }
            else if(this.queueFormationStyle == 'bt') {
                this.currentRiseY-=5;
            }
            
        }, this, true));
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

class Poligon extends GO {
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

        this.baseColorHSV[0] =  this.hClamps[0] + (this.hClamps[1] - this.hClamps[0]) *this.position.x/this.parentScene.viewport.x;
        this.borderColorHSV[0] = this.borderHClamps[0] + (this.borderHClamps[1] - this.borderHClamps[0]) *this.position.x/this.parentScene.viewport.x;

        this.createImg({baseColor: hsvToHex({hsv:this.baseColorHSV}), borderColor: hsvToHex({hsv:this.borderColorHSV})});
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
        }

        this.img = this.images[key];
    }
}