class EffectsScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                type: 'gif',
                addRedFrame: false,
                stopByCode: true,
                //viewportSizeMultiplier: 5,
                size: new V2(150,150),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects1',
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
            img: createCanvas(new V2(1,1), (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)

        this.effects1 = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createWavingFrames({rowsCount =20, columnsCount = 40, hsv, maxYShiftValue = 5, startXShift = 40, startYShift = 40}) {
                let color1 = '#5B5C8F';

                let frames = [];

                let framesCount = 120;
                let radiusChangeFrames = 120;
                let itemFramesLenght = 60;

                //let rowsCount = 20;
                //let columnsCount = 40;
                let xShift = 2;
                let yShift = 2;
                // let startXShift = 40;
                // let startYShift = 40;

                let rCenter = new V2(0,0);
                
                let rMax = 200;
                let rChangeValues = easing.fast({from: 0, to: rMax, steps: radiusChangeFrames, type: 'linear', round: 0});

                
                //let maxYShiftValue = 5
                let itemYValues = [
                    ...easing.fast({from: -maxYShiftValue, to: maxYShiftValue, steps: itemFramesLenght/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: maxYShiftValue, to: -maxYShiftValue, steps: itemFramesLenght/2, type: 'quad', method: 'inOut', round: 0}),
                ]

                let vClamps = [10, 87]
                let vValues = [
                    ...easing.fast({from: vClamps[1], to: vClamps[0], steps: itemFramesLenght/2, type: 'quad', method: 'inOut', round: 0}),
                    ...easing.fast({from: vClamps[0], to: vClamps[1], steps: itemFramesLenght/2, type: 'quad', method: 'inOut', round: 0}),
                ]

                let matrixData = [];
                for(let i = 0; i < rowsCount*columnsCount; i++) {
                    let row = fast.f(i/columnsCount);
                    let x = startXShift + i%columnsCount*xShift - row;
                    let y = startYShift + row*yShift;

                    let r = rCenter.distance(new V2(x, y));

                    matrixData.push({x, y, r, 
                        triggered: false});
                }

                for(let rf = 0; rf < radiusChangeFrames; rf++) {
                    let currentR = rChangeValues[rf];

                    matrixData.filter(md => !md.triggered && md.r < currentR).forEach(md => {
                        md.triggered = true;

                        md.frames = [];
                        let startFrameIndex =rf;
                        let totalFrames = framesCount//itemFramesLenght*2;

                        let frames = [];
                        for(let f = 0; f < totalFrames; f++){
                            let frameIndex = f + startFrameIndex;
                            if(frameIndex > (framesCount-1)){
                                frameIndex-=framesCount;
                            }
                    
                            let _f = f
                            if(_f >= itemFramesLenght) {
                                _f%=itemFramesLenght;
                            }

                            frames[frameIndex] = {
                                yShift: itemYValues[_f],
                                v: vValues[_f]
                            };
                        }

                        md.frames = frames;
                    })

                }
            
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let p = 0; p < matrixData.length; p++){
                            let itemData = matrixData[p];
                            
                            let x = itemData.x;
                            let y = itemData.y;
                            let v = hsv.v
                            if(itemData.frames && itemData.frames[f]){
                                y+=itemData.frames[f].yShift;
                                v = itemData.frames[f].v;
                            }
//{h:218,s:28,v}
                            hlp.setFillColor(colors.colorTypeConverter({ value: {h:hsv.h,s:hsv.s,v}, fromType: 'hsv', toType: 'hex' })).dot(x, y);
                        }
                    });
                }
                
                return frames;
                
                
            },
            init() {
                this.c0 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createWavingFrames({ rowsCount: 20, columnsCount: 40, hsv: { h: 320, s: 38, v: 87 }, maxYShiftValue: 5, startXShift: 55, startYShift: 20 }),
                    init() {
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.c1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    frames: this.createWavingFrames({ rowsCount: 20, columnsCount: 40, hsv: { h: 218, s: 28, v: 87 }, maxYShiftValue: 5, startXShift: 35, startYShift: 80 }),
                    init() {
                        this.registerFramesDefaultTimer({startFrameIndex: 30});
                    }
                }))
                
            }
        }), 10)
    }
}