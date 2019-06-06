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
        this.backgroundRenderDefault('#171C21');
    }

    stopParticles() {
        this.unregTimer(this.particlesGeneratorTimer);
    }

    startParticles() {
        this.particlesGeneratorTimer = this.registerTimer(createTimer(50, () => {
            for(let i = 0; i < 2; i++){
                let isGoUp = getRandomBool();
                let x = fastRoundWithPrecision(getRandomGaussian(50,250));
                this.addGo(new Exp4Particle({
                    position: new V2(x,isGoUp? 350: 150),
                    target: new V2(x,  200),
                    img: isGoUp ? this.goUpParticleImg : this.goDownParticleImg,
                    yChange: isGoUp ? getRandom(-0.4,-0.75) : getRandom(0.6, 1.2),
                    //duration: getRandomInt(15, 45) * 100
                }),getRandomBool() ? 9 : 11)
            }
            
        }, this, true));
    }

    start() {
        this.particleSize = new V2(3,12);
        this.goUpParticleImg = createCanvas(this.particleSize, (ctx, size, helper) => {
            helper
                .setFillColor('rgba(255,255,255,1)')
                .rect(0,0,3,3)
                .setFillColor('rgba(255,255,255,0.5)').rect(0,3,3,3)
                .setFillColor('rgba(255,255,255,0.25)').rect(0,6,3,3)
                .setFillColor('rgba(255,255,255,0.15)').rect(0,9,3,3)
        });
        this.goDownParticleImg = createCanvas(this.particleSize, (ctx, size, helper) => {
            helper
                .setFillColor('rgba(255,255,255,0.15)')
                .rect(0,0,3,3)
                .setFillColor('rgba(255,255,255,0.25)').rect(0,3,3,3)
                .setFillColor('rgba(255,255,255,0.5)').rect(0,6,3,3)
                .setFillColor('rgba(255,255,255,1)').rect(0,9,3,3)
        });

        this.light = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(1, 214),
            sizeXClamps: [1, 185],
            sizeYClamps: [204, 214],
            isVisible: false,
            start() {
                this.isVisible = true;
                this.sizeXChange = { time: 0, duration: 30, change: this.sizeXClamps[1] - this.sizeXClamps[0], type: 'quad', method: 'inOut', startValue: this.sizeXClamps[0]};
                this.sizeYChange = { time: 0, duration: 30, change: this.sizeYClamps[1] - this.sizeYClamps[0], type: 'quad', method: 'inOut', startValue: this.sizeYClamps[0]};
                this.timer = this.registerTimer(createTimer(100, () => {
                    this.size.x =  fastRoundWithPrecision(easing.process(this.sizeXChange));
                    this.size.y =  fastRoundWithPrecision(easing.process(this.sizeYChange));
                    this.needRecalcRenderProperties = true;
                    this.sizeXChange.time++;
                    this.sizeYChange.time++;

                    if(this.sizeXChange.time > this.sizeXChange.duration){
                        this.unregTimer(this.timer);
                    }

                }, this, true));
            },
            stop() {
                this.sizeXChange = { time: 0, duration: 30, change: -(this.sizeXClamps[1] - this.sizeXClamps[0]), type: 'quad', method: 'inOut', startValue: this.sizeXClamps[1]};
                this.sizeYChange = { time: 0, duration: 30, change: -(this.sizeYClamps[1] - this.sizeYClamps[0]), type: 'quad', method: 'inOut', startValue: this.sizeYClamps[1]};
                this.timer = this.registerTimer(createTimer(100, () => {
                    this.size.x =  fastRoundWithPrecision(easing.process(this.sizeXChange));
                    this.size.y =  fastRoundWithPrecision(easing.process(this.sizeYChange));
                    this.needRecalcRenderProperties = true;
                    this.sizeXChange.time++;
                    this.sizeYChange.time++;

                    if(this.sizeXChange.time > this.sizeXChange.duration){
                        this.unregTimer(this.timer);
                        this.isVisible = false;
                    }

                }, this, true));
            },
            init() {
                this.img = createCanvas(new V2(this.sizeXClamps[1], this.size.y), (ctx, size, helper) => {
                    let width = size.x;
                    let shift = 0
                    let yShift = 7;
                    for(let i =0; i < 5; i++){
                        width= i > 0 ? width*0.8: width;
                        if(i > 0){
                            yShift = 10;
                        }
                        shift = fastRoundWithPrecision(size.x/2 - width/2);
                        helper.setFillColor('rgb(255,255,255,0.1)').rect(shift,yShift,width, size.y-yShift*2);
                    }
                    // helper.setFillColor('rgb(255,255,255,0.1)').rect(0,7,size.x, size.y-14);
                    // helper.setFillColor('rgb(255,255,255,0.1)').rect(0,7,size.x, size.y-14);
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
            colorChangeDuration: 50,
            colorChangeCurrentIndex: 0,
            colors: [
                [ 
                    {s: hexToRgb('#48C1F9', true), f: hexToRgb('#76CEFA', true) },
                    {s: hexToRgb('#B1E5F9', true), f: hexToRgb('#C1E9FA', true) }, 
                    {s: hexToRgb('#DBEFF9', true), f: hexToRgb('#E6F3FA', true) }
                ],
                [ 
                    {s: hexToRgb('#F74747', true), f: hexToRgb('#F97777', true) },
                    {s: hexToRgb('#F4B0B0', true), f: hexToRgb('#F7C0C0', true) }, 
                    {s: hexToRgb('#F2D5D5', true), f: hexToRgb('#F4E3E3', true) }
                ]
            ],
            changeColors() {
                let from = this.colors[this.colorChangeCurrentIndex];
                let to = undefined;

                if(this.colorChangeCurrentIndex < this.colors.length-1)
                    to = this.colors[this.colorChangeCurrentIndex+1];
                else 
                    to = this.colors[0];

                this.colorChangeCurrentIndex++;
                if(this.colorChangeCurrentIndex == this.colors.length)
                    this.colorChangeCurrentIndex = 0;

                this.colorChange = [
                    // { time: 0, duration: this.duration, change: this.targetColorRGB[0] - this.startColorRGB[0] , type: 'linear', method: 'base', startValue: this.startColorRGB[0] },
                    // { time: 0, duration: this.duration, change: this.targetColorRGB[1] - this.startColorRGB[1] , type: 'linear', method: 'base', startValue: this.startColorRGB[1] },
                    // { time: 0, duration: this.duration, change: this.targetColorRGB[2] - this.startColorRGB[2] , type: 'linear', method: 'base', startValue: this.startColorRGB[2] }
                ];

                for(let i = 0; i < from.length;i++){
                    this.colorChange[i] = {
                        s: [
                            { time: 0, duration: this.colorChangeDuration, change: to[i].s[0] - from[i].s[0] , type: 'linear', method: 'base', startValue: from[i].s[0] },
                            { time: 0, duration: this.colorChangeDuration, change: to[i].s[1] - from[i].s[1] , type: 'linear', method: 'base', startValue: from[i].s[1] },
                            { time: 0, duration: this.colorChangeDuration, change: to[i].s[2] - from[i].s[2] , type: 'linear', method: 'base', startValue: from[i].s[2] },
                        ],
                        f: [
                            { time: 0, duration: this.colorChangeDuration, change: to[i].f[0] - from[i].f[0] , type: 'linear', method: 'base', startValue: from[i].f[0] },
                            { time: 0, duration: this.colorChangeDuration, change: to[i].f[1] - from[i].f[1] , type: 'linear', method: 'base', startValue: from[i].f[1] },
                            { time: 0, duration: this.colorChangeDuration, change: to[i].f[2] - from[i].f[2] , type: 'linear', method: 'base', startValue: from[i].f[2] }, 
                        ]
                    }
                }

                this.changeColorTimer = this.registerTimer(createTimer(30, () => {
                    for(let i = 0; i < this.colorChange.length;i++){
                        let layer = this.model.main.layers[i];
                        layer.strokeColor = colors.rgbToString({value: [easing.process(this.colorChange[i].s[0]), easing.process(this.colorChange[i].s[1]), easing.process(this.colorChange[i].s[2])]});
                        layer.fillColor = colors.rgbToString({value: [easing.process(this.colorChange[i].f[0]), easing.process(this.colorChange[i].f[1]), easing.process(this.colorChange[i].f[2])]});

                        this.colorChange[i].s.forEach(cc => cc.time++);
                        this.colorChange[i].f.forEach(cc => cc.time++);
                    }

                    if(this.colorChange[0].s[0].time > this.colorChange[0].s[0].duration){
                        this.unregTimer(this.changeColorTimer);
                    }
                }, this, true))
            },
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
                    let layer = this.model.main.layers[l];

                    layer.strokeColor = colors.rgbToString({value: this.colors[0][l].s});
                    layer.fillColor = colors.rgbToString({value: this.colors[0][l].f});

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
                            helper.setFillColor('#67737E').rect(0,0,size.x, size.y);
                            
                            helper.setFillColor('#5C6670');
                            for(let i = 0; i < 50; i++){
                                helper.rect(getRandomInt(0,size.x), getRandomInt(0,size.y), 2, getRandomInt(50, 100))
                            }

                            
                            helper.setFillColor('#707E89');
                            for(let i = 0; i < 50; i++){
                                helper.rect(getRandomInt(0,size.x), getRandomInt(0,size.y), 2, getRandomInt(50, 100))
                            }
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
                        sDelta: -10,
    
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
                    // function(){
                    //     this.delayTimer = this.registerTimer(createTimer(1000, () => {
                    //         this.unregTimer(this.delayTimer);
                    //         this.processScript();
                    //     }, this, false));
                    // },
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

                        // scene.startParticles();
                        // scene.plazma.changeColors();
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(2000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false));
                    },
                    function(){
                        scene.startParticles();
                        this.processScript();
                    },
                    function(){
                        this.delayTimer = this.registerTimer(createTimer(6000, () => {
                            this.unregTimer(this.delayTimer);
                            this.processScript();
                        }, this, false));
                    },
                    function(){
                        scene.plazma.changeColors();
                        scene.stopParticles();
                        this.processScript();
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

class Exp4Particle extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            size: new V2(3, 12),
            target: new V2(),
            duration: 3000,
            yChange:-0.5
        }, options)

        super(options);
    }

    init() {
        this.addEffect(new FadeOutEffect({effectTime: this.duration, setParentDeadOnComplete: true}))

        this.timer = this.registerTimer(createTimer(30, () => {
            this.position.y+=this.yChange;

            this.needRecalcRenderProperties = true;


        }, this, true));
    }
}