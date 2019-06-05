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
        this.addGo(new GO({
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

        this.basement = this.addGo(new GO({
            position: new V2(150, 350),
            size: new V2(200, 10),
            init() {
                this.topEllipsis = this.addChild(new GO({
                    position: new V2(),
                    size: new V2(this.size.x, 20),
                    imgCache: [],
                    baseColorHSV: [50,100,100],
                    sDelta: -70,

                    init() {
                        this.rx = this.size.x/2 ;
                        this.ry = this.size.y/2;
                        this.rxSq = this.rx*this.rx;
                        this.rySq = this.ry*this.ry;
                        this.change = { time: 0, duration: 10, change: this.sDelta, type: 'quad', method: 'inOut', startValue: 100};
                        this.sOriginal = this.sDelta;
                        this.sCurrent = this.sDelta;

                        this.createImage();
                        // this.registerTimer(createTimer(100, () => {
                        //     this.sCurrent = easing.process(this.change);
                        //     this.createImage();
                        //     this.change.time++;

                        //     if(this.change.time > this.change.duration){
                        //         this.change.time = 0;
                        //         this.change.change*=-1;
                        //         this.change.startValue = this.sCurrent;
                        //     }

                        // }, this, true));
                    },
                    createImage() {
                        if(!this.imgCache[this.sCurrent]){
                            this.imgCache[this.sCurrent] = createCanvas(this.size, (ctx, size) => {
                                for(let y =0; y < size.y;y++) {
                                    for(let x =0; x < size.x;x++){
                                        let r = (( (x-this.rx)*(x-this.rx) )/(this.rxSq)  + ( (y-this.ry)*(y-this.ry)  )/(this.rySq));
                                        if( r <= 1   ){
        
                                            let s = this.baseColorHSV[1] + this.sCurrent*(1-r)/1;
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

                            this.img = this.imgCache[this.sCurrent];
                        }
                    }
                }))
            }
        }))
    }
}