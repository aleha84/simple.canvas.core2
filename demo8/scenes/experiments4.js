class Experiments4Scene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                additional: [],
            },

        }, options)

        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start() {
        this.light = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(1, 214),
            sizeClamps: [1, 185],
            isVisible: false,
            start() {
                this.isVisible = true;
                this.sizeXChange = { time: 0, duration: 30, change: this.sizeClamps[1] - this.sizeClamps[0], type: 'quad', method: 'inOut', startValue: this.sizeClamps[0]};
                this.timer = this.registerTimer(createTimer(100, () => {
                    this.size.x =  fastRoundWithPrecision(easing.process(this.sizeXChange));
                    this.needRecalcRenderProperties = true;
                    this.sizeXChange.time++;

                    if(this.sizeXChange.time > this.sizeXChange.duration){
                        this.unregTimer(this.timer);
                    }

                }, this, true));
            },
            stop() {
                this.sizeXChange = { time: 0, duration: 30, change: -(this.sizeClamps[1] - this.sizeClamps[0]), type: 'quad', method: 'inOut', startValue: this.sizeClamps[1]};
                this.timer = this.registerTimer(createTimer(100, () => {
                    this.size.x =  fastRoundWithPrecision(easing.process(this.sizeXChange));
                    this.needRecalcRenderProperties = true;
                    this.sizeXChange.time++;

                    if(this.sizeXChange.time > this.sizeXChange.duration){
                        this.unregTimer(this.timer);
                        this.isVisible = false;
                    }

                }, this, true));
            },
            init() {
                this.img = createCanvas(new V2(this.sizeClamps[1], this.size.y), (ctx, size, helper) => {
                    helper.setFillColor('rgb(255,255,255,0.25)').rect(0,7,size.x, size.y-14);
                    let rx = size.x/2;
                    let rxSq = rx*rx;
                    let ry = 7;
                    let rySq = ry*ry;
                    for(let y =0; y < 7;y++) {
                        for(let x =0; x < size.x;x++){
                            let r = (( (x-rx)*(x-rx) )/(rxSq)  + ( (y-ry)*(y-ry)  )/(rySq));
                            if( r <= 1   ){
                                ctx.fillRect(x,y, 1,1);
                            }
                        }
                    }

                    ry = size.y-7;
                    for(let y =size.y-7; y < size.y;y++) {
                        for(let x =0; x < size.x;x++){
                            let r = (( (x-rx)*(x-rx) )/(rxSq)  + ( (y-ry)*(y-ry)  )/(rySq));
                            if( r <= 1   ){
                                ctx.fillRect(x,y, 1,1);
                            }
                        }
                    }
                });
            }
        }), 9);
        this.plazma = this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(30, 30).mul(4),
            renderValuesRound: true,
            init() {
                this.model = {"general":{"originalSize":{"x":20,"y":20},"size":{"x":20,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#48C1F9","fillColor":"#76CEFA","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":11,"y":0}},{"point":{"x":12,"y":0}},{"point":{"x":15,"y":1}},{"point":{"x":17,"y":3}},{"point":{"x":18,"y":5}},{"point":{"x":19,"y":7}},{"point":{"x":19,"y":12}},{"point":{"x":18,"y":14}},{"point":{"x":17,"y":17}},{"point":{"x":15,"y":18}},{"point":{"x":12,"y":19}},{"point":{"x":7,"y":19}},{"point":{"x":5,"y":18}},{"point":{"x":3,"y":17}},{"point":{"x":1,"y":15}},{"point":{"x":0,"y":12}},{"point":{"x":0,"y":8}},{"point":{"x":1,"y":6}},{"point":{"x":2,"y":3}},{"point":{"x":5,"y":1}},{"point":{"x":7,"y":0}}]},{"order":1,"type":"lines","strokeColor":"#B1E5F9","fillColor":"#C1E9FA","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":9,"y":4}},{"point":{"x":11,"y":4}},{"point":{"x":13,"y":5}},{"point":{"x":14,"y":6}},{"point":{"x":15,"y":7}},{"point":{"x":15,"y":9}},{"point":{"x":15,"y":11}},{"point":{"x":14,"y":14}},{"point":{"x":12,"y":15}},{"point":{"x":10,"y":15}},{"point":{"x":8,"y":15}},{"point":{"x":6,"y":14}},{"point":{"x":5,"y":13}},{"point":{"x":4,"y":12}},{"point":{"x":4,"y":9}},{"point":{"x":5,"y":6}},{"point":{"x":7,"y":4}}]},{"order":2,"type":"lines","strokeColor":"#DBEFF9","fillColor":"#E6F3FA","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":9,"y":8}},{"point":{"x":10,"y":8}},{"point":{"x":11,"y":9}},{"point":{"x":11,"y":10}},{"point":{"x":11,"y":11}},{"point":{"x":10,"y":11}},{"point":{"x":9,"y":11}},{"point":{"x":8,"y":10}},{"point":{"x":8,"y":9}}]}]}};
                this.model.general.originalSize.x = 30;
                this.model.general.originalSize.y = 30;

                this.model.general.size.x = 30;
                this.model.general.size.y = 30;

                this.createImg();

                this.pointsChange = [];
                let layers = this.model.main.layers;
                for(let l = 0; l < layers.length;l++){
                    let points = this.model.main.layers[l].points;
                    points.forEach(p => {
                        p.point.x+=5;
                        p.point.y+=5;
                    })

                    this.pointsChange = [...this.pointsChange, ...points.map((p,i) => ([
                        {time: 0, duration: getRandomInt(10,30), change: getRandomInt(0, 3), type: 'quad', method: 'inOut', startValue: 0, p, property: 'x', origin: p.point.x},
                        {time: 0, duration: getRandomInt(10,30), change: getRandomInt(0, 3), type: 'quad', method: 'inOut', startValue: 0, p, property: 'y', origin: p.point.y}
                    ])).flat()];
                }
                
                this.levitation = { time: 0, duration: 100, change: 10, type: 'quad', method: 'inOut', startValue: this.position.y}

                this.registerTimer(createTimer(30, () => {
                    let l = this.levitation;

                    for(let i = 0; i < this.pointsChange.length; i++){
                        let c = this.pointsChange[i];
                    
                        if(c.change == 0){
                            c.change = getRandomInt(0, 3);
                            continue;
                        }

                        let ch = fastRoundWithPrecision(easing.process(c));
                        c.p.point[c.property] = c.origin + ch;
                        c.time++;

                        if(c.time > c.duration) {
                            c.duration = getRandomInt(10,30);
                            c.time = 0;
                            c.change = getRandomInt(0, 3);

                            // let next = getRandomInt(0, 3);
                            // c.startValue = ch;
                            // c.change = next - ch;
                        }
                    }

                    this.createImg();

                    this.position.y = easing.process(l);
                    this.needRecalcRenderProperties = true;
                    l.time++;
                    
                    if(l.time > l.duration){
                        l.time = 0;
                        l.change*=-1;
                        l.startValue = this.position.y;
                    }
                    

                }, this, true));
            },
            createImg() {
                this.img = PP.createImage(this.model);
            }
        }), 10);

        this.basements = [];
        for(let i = 0; i < 2; i++){
            this.basements[i] = this.addGo(new GO({
                position: i == 0?  new V2(150, 350) : new V2(150, -50),
                size: new V2(200, 200),
                startLight(callback = () => {}) {
                    this.ellipsis.start(callback);
                },
                stopLight(callback = () => {}) {
                    this.ellipsis.stop(callback);
                },
                init() {
                    this.body = this.addChild(new GO({
                        position: new V2(0, 100),
                        size: this.size,
                        img: createCanvas(this.size, (ctx, size, helper) => {
                            helper.setFillColor('#4F0F0F').rect(0,0,size.x, size.y);
                            let darkWidth = size.x/4;
                            let darkClamps = [0.7,0.1];
                            let darkChange = { time: 0, duration: 4, change: darkClamps[1] - darkClamps[0], type: 'quad', method: 'out', startValue: darkClamps[0]};
                            for(let i = 0; i < 5; i++){
                                darkChange.time = i;
                                helper
                                    .setFillColor('rgba(0,0,0,' + easing.process(darkChange) +')')
                                    .rect(i*darkWidth/5,0,darkWidth/5, size.y)
                                    .rect(size.x - (i+1)*darkWidth/5,0,darkWidth/5, size.y);
                            }
                        })
                    }))
                    this.ellipsis = this.addChild(new GO({
                        position: i == 0 ? new V2() : new V2(0, 200),
                        size: new V2(this.size.x, 20),
                        imgCache: [],
                        baseColorHSV: [50,100,100],
                        sDeltaClamps: [-10, -90],
                        sDelta: -70,
    
                        init() {
                            this.rx = this.size.x/2 ;
                            this.ry = this.size.y/2;
                            this.rxSq = this.rx*this.rx;
                            this.rySq = this.ry*this.ry;
                            
    
                            this.createImage();
                            
                        },
                        start(callback) {
                            this.sDeltaChange = { time: 0, duration: 30, change: this.sDeltaClamps[1] - this.sDeltaClamps[0], type: 'quad', method: 'inOut', startValue: this.sDeltaClamps[0]};
                            this.timer = this.registerTimer(createTimer(100, () => {
                                this.sDelta = fastRoundWithPrecision(easing.process(this.sDeltaChange));
                                this.createImage();
                                this.sDeltaChange.time++;
    
                                if(this.sDeltaChange.time > this.sDeltaChange.duration){
                                    this.unregTimer(this.timer);
                                    callback();
                                }
    
                            }, this, true));
                        },
                        stop(callback) {
                            this.sDeltaChange = { time: 0, duration: 30, change: -(this.sDeltaClamps[1] - this.sDeltaClamps[0]), type: 'quad', method: 'inOut', startValue: this.sDeltaClamps[1]};
                            this.timer = this.registerTimer(createTimer(100, () => {
                                this.sDelta = fastRoundWithPrecision(easing.process(this.sDeltaChange));
                                this.createImage();
                                this.sDeltaChange.time++;
    
                                if(this.sDeltaChange.time > this.sDeltaChange.duration){
                                    this.unregTimer(this.timer);
                                    callback();
                                }
    
                            }, this, true));
                        },
                        createImage() {
                            if(!this.imgCache[this.sDelta]){
                                this.imgCache[this.sDelta] = createCanvas(this.size, (ctx, size) => {
                                    for(let y =0; y < size.y;y++) {
                                        for(let x =0; x < size.x;x++){
                                            let r = (( (x-this.rx)*(x-this.rx) )/(this.rxSq)  + ( (y-this.ry)*(y-this.ry)  )/(this.rySq));
                                            if( r <= 1   ){
            
                                                let s = this.baseColorHSV[1] + this.sDelta*(1-r)/1;
                                                s = Math.floor(s/20)*20;
            
                                                if(r > 0.85){
                                                    ctx.fillStyle = '#FF324E';
                                                }
                                                else ctx.fillStyle = hsvToHex({hsv: [ this.baseColorHSV[0], s, this.baseColorHSV[2] ]});
                                                ctx.fillRect(x,y, 1,1);
            
                                            }
                                        }
                                    }
                                });
                            }
    
                            this.img = this.imgCache[this.sDelta];
                        }
                    }))
                }
            }))
        }
        
        this.sceneManager = this.addGo(new GO({
            position: new V2(),
            size: new V2(1,1),
            init() {
                this.createSequence();
            },
            createSequence() {
                let that = this;
                let scene = this.parentScene;
                this.script.items = [
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(2000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false));
                    },
                    function() {
                        scene.basements[0].startLight(() => this.processScript());
                        scene.basements[1].startLight();

                        scene.light.start();
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(2000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false));
                    },
                    function() {
                        scene.basements[0].stopLight(() => this.processScript());
                        scene.basements[1].stopLight();

                        scene.light.stop();
                    },
                    function() {
                        this.createSequence();
                    }
                ];

                this.processScript();
            }
        }))
    }
}