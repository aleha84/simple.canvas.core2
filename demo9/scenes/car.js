class CarCommissionScene extends Scene {
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
        this.backgroundRenderDefault();
    }

    start(){
        // bg
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.sky = {
                    color: 'black'
                }

                this.img = this.createImage();
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor(this.sky.color).rect(0,0,size.x,size.y)
                })
            }
        }), 1)

        // road
        this.road = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                //
                
                this.asp = {
                    color: '#66645D',
                    colorSecondary: '#36393D',
                    linesFrom: 15,
                    height: 40,
                    darkFrom: 30,
                     csParts: [],
                     lines: {
                        color: '#D1D1D1',
                        solid: {    
                            y: 2,
                            height: 2
                        }
                    }
                }

                this.fencing = {
                    //height: 20,
                    lowerY: 39,
                    column: {
                        colors: {
                            light: '#2B3147',
                            dark: '#1C1F32',
                        },
                        count: 2,
                        width: 10,
                        height: 40
                    },
                    bar: {
                        height: 20,
                        y: 7,
                        colors: {
                            main: '#161F3C',
                            dark: '#0C0F22',
                            bottom: '#101733',
                            upper: '#212F5B'
                        }
                    }
                }

                //this.asp.csParts = []
                let countChange = easing.createProps(15, 4, 20, 'quad', 'in');
                let maxlChange = easing.createProps(15, 4, 50, 'quad', 'in');
                let minlChange = easing.createProps(15, 2, 25, 'quad', 'in');

                //hlp.setFillColor(this.asp.colorSecondary);
                for(let y = 0; y <= 15;y++){
                    countChange.time = y;
                    maxlChange.time = y;
                    minlChange.time = y;
                    let count = fast.r(easing.process(countChange));
                    let maxlength = fast.r(easing.process(maxlChange));
                    let minlength = fast.r(easing.process(minlChange));

                    for(let i = 0; i < count; i++){
                        let len = getRandomInt(minlength, maxlength);
                        let x = getRandomInt(0, this.size.x);
                        this.asp.csParts.push({x, y, len});
                        //hlp.rect(x, this.asp.linesFrom + i, len, 1);
                    }
                }

                this.asp.img = this.createImage();

                this.framesCount = 20;
                this.frames = [];
                this.fXChange = easing.createProps(this.framesCount-1, 0, -this.size.x, 'linear', 'base');

                for(let i = 0;i < this.framesCount; i++){
                    this.fXChange.time = i;
                    let currentX = fast.r(easing.process(this.fXChange));

                    this.frames[i] = createCanvas(this.size, (ctx) => {
                        ctx.drawImage(this.asp.img, currentX, 0);
                        ctx.drawImage(this.asp.img, currentX+this.size.x, 0)
                    })
                }

                this.currentFrame = 0;
                this.timer = this.regTimerDefault(100, () => {
                    this.img = this.frames[this.currentFrame++];
                    if(this.currentFrame == this.frames.length-1){
                        this.currentFrame = 0;
                    }
                })
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    let aspYFrom = size.y-this.asp.height;
                    hlp.setFillColor(this.asp.color).rect(0, aspYFrom, size.x, this.asp.height)
                    .setFillColor(this.asp.colorSecondary).rect(0, aspYFrom + this.asp.darkFrom, size.x, this.asp.height-+ this.asp.darkFrom);

                    hlp.setFillColor(this.asp.colorSecondary);
                    for(let i = 0; i < this.asp.csParts.length; i++){
                        let l = this.asp.csParts[i];
                        hlp.rect(l.x, aspYFrom+this.asp.linesFrom+l.y, l.len, 1);
                    }

                    hlp.setFillColor(this.asp.lines.color).rect(0, aspYFrom+ this.asp.lines.solid.y, size.x, this.asp.lines.solid.height);
                    
                    let f = this.fencing;
                    let segWidth = fast.r(size.x/f.column.count);
                    for(let i = 0; i < f.column.count;i++){
                        let x = fast.r(segWidth*i + segWidth/2);
                        let y = size.y - f.lowerY - f.column.height;

                        hlp.setFillColor(f.column.colors.light).rect(x,y,f.column.width, f.column.height)
                        .setFillColor(f.column.colors.dark).rect(x+f.column.width-3,y,3, f.column.height)
                    }

                    let barYTop = size.y - f.lowerY - f.column.height + f.bar.y;
                    hlp.setFillColor(f.bar.colors.main).rect(0, barYTop, size.x, f.bar.height)

                    hlp.setFillColor(f.bar.colors.bottom)
                    for(let i = 0; i < 40; i++){
                        hlp.rect(getRandomInt(0,size.x), getRandomInt(0, f.bar.height) + barYTop, getRandomInt(1,4), 1);
                    }

                    hlp.setFillColor(f.bar.colors.upper).rect(0, barYTop, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+8, size.x, 7)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+14, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+7, size.x, 1)
                    .setFillColor(f.bar.colors.bottom).rect(0, barYTop+20, size.x, 2)
                    .setFillColor(f.bar.colors.dark).rect(0, barYTop+21, size.x, 1);

                    
                })
            }
        }), 30)

        //car
        this.car = this.addGo(new GO({
            position: new V2(200, 240),
            size: new V2(290, 100),
            init() {
                this.colors = {
                    baseFill: '#552E54',
                    darkFill: '#391E31',
                    lightFill: '#713D77',
                    veryLight: '#976691',
                    baseStroke: '#1C0F0E',
                    black: '#000',
                    faceFill: '#A9A9A9',
                    fWindowFill: '#2B2B2B',
                    lowerLine: '#2D2D2D'
                }

                this.bodyModel = {"general":{"originalSize":this.size,"size":this.size,"zoom":10,"showGrid":false},
                "main": {
                    "layers":[
                        {"order":0,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":this.colors.baseFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(2,42), new V2(4,36), new V2(8,34), new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            //face 
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":1,"type":"lines","strokeColor":this.colors.darkFill,"fillColor":this.colors.darkFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(4,36), new V2(7,42), new V2(51,43),new V2(78,48), 
                            //face 
                            new V2(287, 44),new V2(288, 59),new V2(284,66),new V2(284, 71),new V2(278,77),
                            //bottom
                            new V2(197,77), new V2(149, 80), new V2(59, 80), new V2(22,73),new V2(13,70), new V2(8, 67), new V2(4,64), new V2(2, 60)
                        ].map(point => ({point}))
                        },
                        {"order":2,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(22,73), new V2(26,56), new V2(36,48),new V2(45,48), new V2(50,54), new V2(59,80)
                            
                        ].map(point => ({point}))
                        },
                        {"order":3,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(149,80), new V2(150,65), new V2(155,54),new V2(165,48), new V2(173,49), new V2(182,54), new V2(190, 70), new V2(197, 77)
                            
                        ].map(point => ({point}))
                        },
                        {"order":4,"type":"lines","strokeColor":this.colors.faceFill,"fillColor":this.colors.faceFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(202,45), new V2(212,44), new V2(287,44),new V2(288,59), new V2(284,66), new V2(279,67), new V2(212,67), new V2(206,64), new V2(202,57)
                            
                        ].map(point => ({point}))
                        },
                        {"order":5,"type":"lines","strokeColor":this.colors.lightFill,"fillColor":this.colors.lightFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(18,30), new V2(39, 27), new V2(76,29), new V2(102, 32), new V2(136, 32), new V2(206, 30),
                            new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44), new V2(212, 44), new V2(202,45)
                            
                        ].map(point => ({point}))
                        },
                        {"order":6,"type":"lines","strokeColor":this.colors.fWindowFill,"fillColor":this.colors.fWindowFill,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(125,8), new V2(148,6), new V2(157,6), new V2(183,8), new V2(206,30), new V2(136,32),
                            
                        ].map(point => ({point}))
                        },
                        {"order":6,"type":"lines","strokeColor":'#1A0A0C',"fillColor":this.colors.lowerLine,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,80), new V2(59,77), new V2(149,77), new V2(149,80)
                            
                        ].map(point => ({point}))
                        },
                        
                        {"order":8,"type":"lines","strokeColor":this.colors.black,"fillColor":this.colors.black,"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(59,81), new V2(149,81), new V2(197,78), new V2(272,78), new V2(272,80), new V2(201,80), new V2(199,82), new V2(149,82), new V2(94,84),
                            new V2(88,87), new V2(84,87), new V2(78,84), new V2(65,84)
                            
                        ].map(point => ({point}))
                        },
                        {"order":9,"type":"lines","strokeColor":this.colors.veryLight,"fillColor":this.colors.veryLight,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(156,32), new V2(173,33), new V2(187,35), new V2(192,37), new V2(222,38), new V2(231,39), new V2(233,43), new V2(211,43), new V2(284,43),new V2(286,44),new V2(210,44)
                            
                        ].map(point => ({point})) // frontal light line
                        },
                        {"order":8,"type":"lines","strokeColor":'#262827',"fillColor":'#262827',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(212,44), new V2(284,44), new V2(284,58), new V2(215,58), new V2(212,56) 
                        ].map(point => ({point}))
                        },
                        {"order":9,"type":"lines","strokeColor":'#6A3470',"fillColor":'#6A3470',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(136,32), new V2(124,10), new V2(125,8), new V2(141,32)
                        ].map(point => ({point}))
                        },
                        {"order":11,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(284,67), new V2(284,71), new V2(278,77), new V2(197,77), new V2(207,72), new V2(282,72)
                            
                        ].map(point => ({point}))
                        },
                        {"order":11,"type":"lines","strokeColor":'#414242',"fillColor":'#000',"closePath":true,"fill":true,"visible":true,"clear":false,"points":[
                            new V2(241,62), new V2(261,62), new V2(261,74),new V2(241,74)
                        ].map(point => ({point}))
                        },

                        //white strokes
                        {"order":90,"type":"lines","strokeColor":'#FFF',"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(154,32), new V2(142,33), new V2(125,8),new V2(148,6),new V2(157,6),new V2(183,8)
                        ].map(point => ({point}))
                        },
                        
                        // dark strokes
                        {"order":698,"type":"lines","strokeColor":this.colors.baseStroke,"fillColor":'#6A3470',"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(183,8), new V2(206,30), new V2(264,32),new V2(272, 34),new V2(278, 36),new V2(283, 39),new V2(287, 44)
                        ].map(point => ({point}))
                        },
                        {"order":699,"type":"lines","strokeColor":'#201112',"fillColor":this.colors.lowerLine,"closePath":false,"fill":false,"visible":true,"clear":false,"points":[
                            new V2(82,30), new V2(76,43), new V2(76,54), new V2(80,67), new V2(87,77), new V2(144,77), new V2(139,63), new V2(139,37), new V2(143,33)
                            
                        ].map(point => ({point}))
                        },
                        
                    ]}}

                this.img = this.createImage();
                //this.img = SCG.images['c'];
            },
            createImage() {
                return createCanvas(this.size, (ctx, size, hlp) => {
                    //hlp.setFillColor(this.colors.base);//.rect(0,0,size.x, size.y)
                    ctx.drawImage(PP.createImage(this.bodyModel), 0,0)
                })
            }
        }), 50)
    }
}