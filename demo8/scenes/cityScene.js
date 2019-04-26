class CityScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
            },
            layersCount: 5, 
            baseColorHSV: [50, 100, 100],
            layers: [],
            sizeClampsRatio: [0.1, 0.4],
            targetClampsRation: [0.4, 0.8],
            heightRation: 0.75,
            targetClamps: [],
            sizeClamps:[],
            minS: 20,
            appearClamps: [15, 25],
            fallClamps: [7, 12]
        }, options)

        super(options);

        this.sizeClamps = this.sizeClampsRatio.map(s => s*this.viewport.y);
        this.targetClamps = this.targetClampsRation.map(s => s*this.viewport.y);
        this.heightValue = this.heightRation*this.viewport.y;
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        let colorChange = { time: 0, duration: this.layersCount-1, change: 100 - this.minS, type: 'linear', method: 'base', startValue: this.minS };
        let sizeChange = { time: 0, duration: this.layersCount-1, change: this.sizeClamps[1] - this.sizeClamps[0], type: 'cubic', method: 'in', startValue: this.sizeClamps[0] };
        let targetChange = { time: 0, duration: this.layersCount-1, change: this.targetClamps[1] - this.targetClamps[0], type: 'cubic', method: 'in', startValue: this.targetClamps[0] };
        let heightChange = { time: 0, duration: this.layersCount, change: this.heightValue, type: 'quad', method: 'in', startValue: 0 };

        let appearChange = { time: 0, duration: this.layersCount-1, change: this.appearClamps[1] - this.appearClamps[0], type: 'cubic', method: 'in', startValue: this.appearClamps[0] };
        let fallChange = { time: 0, duration: this.layersCount-1, change: this.fallClamps[1] - this.fallClamps[0], type: 'cubic', method: 'in', startValue: this.fallClamps[0] };

        let heights = [];
        let height = 0;
        let prevHeightStep = undefined;
        for(let i = 0; i < this.layersCount; i++){

            colorChange.time = i;
            sizeChange.time = i;
            targetChange.time = i;
            appearChange.time = i;
            fallChange.time = i;
            heightChange.time = i+1;

            let hEasingValue = easing.process(heightChange);
            
            if(prevHeightStep == undefined) {
                height = hEasingValue;
            }
            else {
                height = hEasingValue - prevHeightStep;
            }

            prevHeightStep = hEasingValue;

            let size = new V2(this.viewport.x, height);
            this.layers[i] = this.addGo(new BuildingsLayer({
                size: size,
                //size: new V2(this.viewport.x, this.viewport.y/2),
                position: new V2(this.viewport.x/2, this.viewport.y + size.y/2),
                target: new V2(this.viewport.x/2, 0),//easing.process(targetChange)),
                baseColorHSV: [this.baseColorHSV[0], easing.process(colorChange), this.baseColorHSV[2]],
                appearDuration: 20,//fastRoundWithPrecision(easing.process(appearChange)),
                fallDuration: 10//fastRoundWithPrecision(easing.process(fallChange)),
            }), i)

            //this.layers[i].setPosition(new V2(this.layers[i].position.x, this.layers[i].target.y))
        }
        
        for(let i = this.layers.length-1;i >= 0;i--){
            let l = this.layers[i];
            if(i == this.layers.length-1) {
                l.target.y = this.viewport.y - l.size.y/2;
                //l.setPosition(new V2(l.position.x, l.target.y));
                continue;
            }

            let l1 =this.layers[i+1]; 
            
            l.target.y = l1.target.y - (l1.size.y/2) + l1.size.y*0.1 - l.size.y/2;

            //l.setPosition(new V2(l.position.x, l.target.y + 1));
        }

        // heights = this.layers.map(l => l.size.y);
        // console.log(heights, `Target height: ${this.heightValue}; Current total height: ${heights.reduce((p,c,i, arr) => { return p +c}, 0)}`);

        this.appearLayerIndex = this.layers.length - 1;

        // this.appearTimer = this.registerTimer(createTimer(250, () => {
        //     this.layers[ali--].appear();

        //     if(ali < 0)
        //         this.unregTimer(this.appearTimer);

        // }, this, true));

        //this.layers[ali--].appear();
        this.triggerLayerAppear();

    }

    triggerLayerAppear() {
        if(this.appearLayerIndex < 0)
            return;

        let l = this.layers[this.appearLayerIndex];
        if(this.appearLayerIndex < this.layers.length - 1){
            let l1 = this.layers[this.appearLayerIndex+1];
            let y = l1.position.y - (l1.size.y/2) + l.size.y/2;
            l.setPosition(new V2(l.position.x, y));
        }

        this.appearLayerIndex--;

        l.appear(this.triggerLayerAppear.bind(this));
    }
} 

class BuildingsLayer extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            baseColorHSV: [50, 100, 100],
            renderValuesRound: true,
            appearDuration:  20,
            fallDuration: 10
        }, options)

        super(options);
    }

    setPosition(position) {
        this.position = position.clone();
        this.needRecalcRenderProperties = true;
    }

    init() {
        let that = this;
        this.img = createCanvas(new V2(1,1), (ctx) => {
            ctx.fillStyle = hsvToHex({ hsv: that.baseColorHSV });
            ctx.fillRect(0,0,1,1);
        })

        //this.position.y = this.target.y;
    }

    appear(completeCallback) {
        this.script.callbacks.completed = completeCallback;

        let shift = this.target.y - this.position.y;

        this.script.items = [
            function(){
                
                let appear = { time: 0, duration: this.appearDuration, change: shift, type: 'cubic', method: 'out', startValue: this.position.y };
                let callBackTrigger = appear.duration*2/3;
                let callBackTriggered = false;
                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(appear)
                        appear.time++;

                        // if(!callBackTriggered && appear.time > callBackTrigger){
                        //     callBackTriggered = true;
                        //     completeCallback();
                        // }
                            
                    },
                    function() { return appear.time > appear.duration; },
                    true,
                    10
                );
            },
            function(){
                
                let fall = { time: 0, duration: this.fallDuration, change: this.size.y*0.1, type: 'cubic', method: 'in', startValue: this.position.y };
                this.scriptTimer = this.createScriptTimer(
                    function() { 
                        this.position.y =  easing.process(fall)
                        fall.time++;

                        // if(!callBackTriggered && appear.time > callBackTrigger){
                        //     callBackTriggered = true;
                        //     completeCallback();
                        // }
                            
                    },
                    function() { return fall.time > fall.duration; },
                    true,
                    10
                );
            }
        ]

        this.processScript();
    }
}