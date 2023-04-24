class PatternsScene extends Scene {
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
                size: new V2(1800,2000),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'patterns',
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
        console.log('patterns scene start')
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('#533830').dot(0,0);
            })
        }), 0);

        let initialShift = 3;

        let patternParams = [
            {
                modelName: 'pattern1',
                patternSize: new V2(23,22),
                count: 12,
                xShift: initialShift,
                yShift:0,
                totalFrames: 30,
            },
            {
                modelName: 'pattern2',
                patternSize: new V2(21,22),
                count: 12,
                xShift: initialShift+ 24,
                yShift:-5,
            },
            {
                modelName: 'pattern3',
                patternSize: new V2(37,17),
                count: 13,
                xShift: initialShift+ 24 + 22,
                yShift:0,
                totalFrames: 60,
                stopRecording: true
            },
            {
                modelName: 'pattern4',
                patternSize: new V2(15,12),
                count: 18,
                xShift: initialShift+ 24 + 22 + 38,
                yShift:0,
                totalFrames: 20
            },
            {
                modelName: 'pattern5',
                patternSize: new V2(23,17),
                count: 16,
                xShift: initialShift+ 24 + 22 + 38 + 16,
                yShift:0,
                totalFrames: 30
            },
            {
                modelName: 'pattern6',
                patternSize: new V2(19,17),
                count: 16,
                xShift: initialShift+ 24 + 22 + 38 + 16 + 24,
                yShift:-3,
                totalFrames: 60
            },
            {
                modelName: 'pattern7',
                patternSize: new V2(29,18),
                count: 16,
                xShift: initialShift+ 24 + 22 + 38 + 16 + 24 + 20,
                yShift:-3,
                totalFrames: 30
            }
            
        ]

        patternParams.map(params => 
            this.addGo(new GO({
                position: this.sceneCenter.clone(),
                size: this.viewport.clone(),
                init() {
                    let model = PatternsScene.models[params.modelName]
                    let patternImage = PP.createImage(model, { renderOnly: ['main'] } )
                    let shadow1 = PP.createImage(model, { renderOnly: ['s1'], forceVisivility: { s1: { visible: true } } } )
                    let shadow2 = PP.createImage(model, { renderOnly: ['s2'], forceVisivility: { s2: { visible: true } }} )
    
                    let totalFrames = params.totalFrames || 60;
    
                    let { patternSize, xShift, yShift, count } = params;
                    let yValues = easing.fast({from: 0, to: patternSize.y, steps: totalFrames, type: 'linear', round: 0 });
    
                    let aValues = easing.fast({from: -1.2, to: 1.2, steps: patternSize.y + this.size.y, type: 'linear', round: 1});
    
                    this.frames = [];
    
                    //let count = 12;
    
                    for(let f= 0; f< totalFrames; f++) {
                        this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            for(let c = 0; c < count; c++) {
                                ctx.globalAlpha = 1;
                                let y = -patternSize.y + patternSize.y*c + yValues[f];
                                ctx.drawImage(patternImage, 0 + xShift, y + yShift);
                                let aValue = aValues[y+patternSize.y];
    
                                let sImg = undefined;
                                if(aValue < 0) {
                                    sImg = shadow2
                                }
                                else {
                                    sImg = shadow1;
                                }
    
                                let a = Math.abs(aValue);
                                if(a > 1)
                                    a = 1;
                                ctx.globalAlpha = a;
                                ctx.drawImage(sImg, 0 + xShift, y + yShift);
                            }
                            
                        })
                    }
    
                    let repeats = 1;

                    this.registerFramesDefaultTimer({
                        framesEndCallback: () => {
                            repeats--;
                            if(params.stopRecording && repeats == 0) {
                                this.parentScene.capturing.stop = true;
                            }  
                        }
                    });
                }
            }), 1)    
        )

    }
}