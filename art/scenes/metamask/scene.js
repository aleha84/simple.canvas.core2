class MetamaskScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'webm',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(2000,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'fox',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
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
                    hlp.setFillColor('black').rect(0,0,size.x, size.x);
                });
            }
        }), 1)
        this.fox = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(100,100),
            img: PP.createImage(MetamaskScene.models.fox),
            //isVisible: false,
            init() {
                //
            }
        }), 20)

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
                    createPerspectiveFrames({ angleClamps: [0,359], pCenter: this.parentScene.sceneCenter, maxR: 150,framesCount: 300, itemsCount: 500, 
                        itemFrameslength: 150, size: this.size, tailLength: 5, color: 'rgba(255,255,255,0.25)' }),
                    createPerspectiveFrames({ angleClamps: [0,359],pCenter: this.parentScene.sceneCenter, maxR: 150,framesCount: 300, itemsCount: 200, 
                        itemFrameslength: 100, size: this.size, tailLength: 8, color: '#dda19d' }),
                    createPerspectiveFrames({ angleClamps: [0,359],pCenter: this.parentScene.sceneCenter, maxR: 150,framesCount: 300, itemsCount: 100, 
                        itemFrameslength: 50, size: this.size, tailLength: 20, color: '#f6e7e7' })
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

        this.coins = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createBuildingsFrames({framesCount, model}) {
                let eType = 'quad';
                let eMethod = 'out';
        
                let sharedPP = undefined;
                
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});  
                })
        
                let frames = [];
                
                    let modelSize = new V2(model.general.size);
        
                    model.sizeXValue = easing.fast({from: modelSize.x, to: 1, steps: framesCount, type: eType, method: eMethod}).map(v => fast.r(v));
                    model.sizeYValue = easing.fast({from: modelSize.y, to: 1, steps: framesCount, type: eType, method: eMethod}).map(v => fast.r(v));
        
                    let modelCenter = modelSize.divide(2).toInt();
                   
                    for(let f = 0; f < framesCount; f++){
                        let frameIndex = f + 0;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
        
                        let frameModel  = {
                            general: model.general,
                            main: {
                                layers: [
                                  
                                ]
                            }
                        }
        
        
        
                        for(let l = 0; l < model.main.layers.length;l++) {
                            frameModel.main.layers[l] =
                            {
                                    visible: true,
                                    order: l,
                                    groups: []
                            };

                            frameModel.main.layers[l].groups = model.main.layers[l].groups.map(originalGroup => {
                                frameModel.main.layers[l].id = model.main.layers[l].id
                                let group = assignDeep({}, originalGroup, {points: [] } );
                          
        
                                group.points = originalGroup.points.map(originalPoint => {
                                    if(!originalPoint.lineDots){
                                        originalPoint.lineDots = sharedPP.lineV2(new V2(originalPoint.point), modelCenter);
                                        originalPoint.lineDotsIndexValues = easing.fast({from: 0, to: originalPoint.lineDots.length-1, steps: framesCount, type: eType, method: eMethod}).map(v => fast.r(v))
                                    }
                
                                    let dot = originalPoint.lineDots[originalPoint.lineDotsIndexValues[f]];
                                    let point = assignDeep({}, originalPoint, { point: dot, lineDots: undefined, lineDotsIndexValues: undefined })
                
                                    return point;
                                })
                                
                                return group;
                            })
                        }
                        
    

                        frames[f] = PP.createImage(frameModel);
                        
            
                      
                    }
                
                
               
        
        
                return frames;
            },
            init() {
                let coinsFramesCount = 100;
                //debugger;
                this.ethFrames = this.createBuildingsFrames({framesCount: coinsFramesCount, model: MetamaskScene.models.eth, size: new V2(50,50) });
                

                let pCenter = this.parentScene.sceneCenter;
                let sharedPP = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })
                

                for(let i = 0; i < 8; i++) {

                    let p1 = pCenter.add(V2.up.rotate(getRandomInt(0,359)).mul(145));
                    let linePoints = sharedPP.lineV2(p1, pCenter).map(p => new V2(p));

                    let indexValues = easing.fast({from: 0, to: linePoints.length-1, steps: coinsFramesCount, type: 'quad', method: 'out', round: 0});

                    let frames = [];
                    for(let f = 0; f < coinsFramesCount; f++) {
                        frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            let p = linePoints[indexValues[f]];
                            ctx.drawImage(this.ethFrames[f], p.x - 25, p.y - 25);
                        })
                    }

                    this.eth = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        frames: frames,
                        init() {
                            this.registerFramesDefaultTimer({ startFrameIndex: getRandomInt(0, coinsFramesCount-1) });
                            // this.currentFrame = getRandomInt(0, coinsFramesCount-1);
                            // this.img = this.frames[this.currentFrame];
                            // this.position = linePoints[indexValues[this.currentFrame]];

                            // this.timer = this.regTimerDefault(10, () => {
                            
                            //     this.currentFrame++;
                            //     if(this.currentFrame == coinsFramesCount){
                            //         this.currentFrame = 0;
                            //         // if(i == 0)
                            //         //     this.parent.parentScene.capturing.stop = true;
                            //     }

                            //     this.position = linePoints[indexValues[this.currentFrame]];
                            //     this.img = this.frames[this.currentFrame];
                            //     this.needRecalcRenderProperties = true;
                            // })
                        }
                    }))

                    
                }
                

                //this.img = this.frames[this.frames.length-1]
            }
        }), 10)
    }
}