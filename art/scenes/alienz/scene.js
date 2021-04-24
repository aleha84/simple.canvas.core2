class AlienzScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: false,
                additional: ["", "PREVIEW", "", "PREVIEW PREVIEW", "", "", "PREVIEW"],
                fillStyle: "yellow",
                font: '110px Arial',
                position: new V2(50,90)
            },
            capturing: {
                enabled: true,
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(1024,1024),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'alienz_01'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#00527A').rect(0,0,size.x,size.y)//2E1914

                    //037A54
                    //6A460A
                    //6E047E
                    //00527A
                })
            }
        }), 1)

        let createPerspectiveFrames = ({framesCount, itemsCount, itemFrameslength, size, tailLength, color, maxR, pCenter, angleClamps, reverse = false }) => {
            let frames = [];
            //let pCenter = new V2(-5, 80)//size.divide(2).toInt();
            //let maxR = 150;
            let sharedPP = undefined;
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                sharedPP = new PP({ctx});
            })
            let tailLengthValues = easing.fast({from: tailLength, to: 1, steps: itemFrameslength, type: 'quad', method: 'out'}).map(v => fast.r(v));
            
            if(reverse) {
                tailLengthValues = [
                    ...easing.fast({from: 1, to: tailLength, steps: itemFrameslength, type: 'quad', method: 'in'}),
                    ...easing.fast({from: tailLength, to: 1, steps: itemFrameslength, type: 'quad', method: 'out'})
                ]
            }

            let itemsData = new Array(itemsCount).fill().map((el, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);
                let totalFrames = itemFrameslength;
            
                let r = getRandomInt(maxR-10, maxR + 10);
                let angle = getRandomInt(angleClamps);
                let direction = V2.up.rotate(angle);
                let p2 = pCenter.add(direction.mul(r));
                let linePoints = sharedPP.lineV2(p2, pCenter);

                let i1 = 0;
                let i2 = linePoints.length-1;
                let eType = 'quad';
                let eMethod = 'out';

                if(reverse) {
                    i1 = i2;
                    i2 = 0;
                    eMethod = 'inOut';
                }

                let indexValues = easing.fast({from: i1, to: i2, steps: itemFrameslength, type: eType, method: eMethod}).map(v => fast.r(v));
                

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }
            
                    frames[frameIndex] = {
                        index: f
                    };
                }
            
                return {
                    frames,
                    linePoints,
                    indexValues
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){
                            let index = itemData.frames[f].index;
                            let tailLength = tailLengthValues[index];
                            let pointIndex = itemData.indexValues[index];
                            for(let i = 0; i < tailLength; i++){
                                let pi = pointIndex-i;
                                if(pi < 0) continue;

                                let p = itemData.linePoints[pi];

                                hlp.setFillColor(color).dot(p.x, p.y);
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        this.stars = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let layers = [
                    createPerspectiveFrames({ angleClamps: [0,180], pCenter: new V2(-5, 80), maxR: 150,framesCount: 300, itemsCount: 500, itemFrameslength: 150, size: this.size, tailLength: 5, color: 'rgba(255,255,255,0.25)' }),
                    createPerspectiveFrames({ angleClamps: [0,180],pCenter: new V2(-5, 80), maxR: 150,framesCount: 300, itemsCount: 200, itemFrameslength: 100, size: this.size, tailLength: 8, color: '#dda19d' }),
                    createPerspectiveFrames({ angleClamps: [0,180],pCenter: new V2(-5, 80), maxR: 150,framesCount: 300, itemsCount: 100, itemFrameslength: 50, size: this.size, tailLength: 20, color: '#f6e7e7' })
                ]

                this.animations = layers.map(frames => this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames,
                    init() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                })))
            }
        }), 5)

        let colorsSubstitutions = [
            {
                "#71717d": { color: '#86C0CB',changeFillColor: true, keepStrokeColor: false },
                "#63636e": { color: '#6D99A2',changeFillColor: true, keepStrokeColor: false },
                "#56565f": { color: '#638B95',changeFillColor: true, keepStrokeColor: false },
                "#484850": { color: '#567D82',changeFillColor: true, keepStrokeColor: false },
                "#3b3b41": { color: '#4E737B',changeFillColor: true, keepStrokeColor: false },
            }
        ]

        let model = AlienzScene.models.main;
        model.main.layers.filter(l => l.name == 'main')[0].groups[0].fillColor = '#86C0CB'
        let layersData = {};
        let exclude = [
            'bg'
        ];

        for(let i = 0; i < model.main.layers.length; i++) {
            let layer = model.main.layers[i];
            let layerName = layer.name || layer.id;
            let renderIndex = i*10;

            layersData[layerName] = {
                renderIndex
            }

            if(exclude.indexOf(layerName) != -1){
                console.log(`${layerName} - skipped`)
                continue;
            }

            this[layerName] = this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                img: PP.createImage(model, { renderOnly: [layerName], colorsSubstitutions: colorsSubstitutions[0] }),
                init() {
                    if(layerName == 'eye') {

                        let layers = [
                            createPerspectiveFrames({ 
                                angleClamps: [0,-180],pCenter: new V2(64, 66), maxR: 40,framesCount: 300, 
                                itemsCount: 100, itemFrameslength: 50, size: this.size, tailLength: 10, 
                                color: '#f6e7e7', reverse: true
                            }).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(frame, 0,0);
                            })),
                            createPerspectiveFrames({ 
                                angleClamps: [0,-180],pCenter: new V2(64, 66), maxR: 50,framesCount: 300, 
                                itemsCount: 100, itemFrameslength: 100, size: this.size, tailLength: 15, 
                                color: 'rgba(255,255,255,0.25)', reverse: true
                            }).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(frame, 0,0);
                            })),

                            createPerspectiveFrames({ 
                                angleClamps: [0,180],pCenter: new V2(73, 65), maxR: 25,framesCount: 300, 
                                itemsCount: 100, itemFrameslength: 50, size: this.size, tailLength: 10, 
                                color: '#f6e7e7', reverse: true
                            }).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(frame, 0,0);
                            })),
                            createPerspectiveFrames({ 
                                angleClamps: [0,180],pCenter: new V2(73, 65), maxR: 50,framesCount: 300, 
                                itemsCount: 100, itemFrameslength: 100, size: this.size, tailLength: 15, 
                                color: 'rgba(255,255,255,0.25)', reverse: true
                            }).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(this.img, 0,0);
                                ctx.globalCompositeOperation = 'source-in';
                                ctx.drawImage(frame, 0,0);
                            })),
                        ];

                        // this.frames = 
                        // createPerspectiveFrames({ 
                        //     angleClamps: [0,-180],pCenter: new V2(67, 62), maxR: 40,framesCount: 300, 
                        //     itemsCount: 600, itemFrameslength: 50, size: this.size, tailLength: 10, 
                        //     color: '#f6e7e7', reverse: true
                        // }).map(frame => createCanvas(this.size, (ctx, size, hlp) => {
                        //     ctx.drawImage(this.img, 0,0);
                        //     ctx.globalCompositeOperation = 'source-in';
                        //     ctx.drawImage(frame, 0,0);
                        // }));

                        this.animations = layers.map(frames => this.addChild(new GO({
                            position: new V2(),
                            size: this.size,
                            frames,
                            init() {
                                this.registerFramesDefaultTimer({});
                            }
                        })))
                    }
                }
            }), renderIndex)

            console.log(`${layerName} - ${renderIndex}`)
        }
    }
}