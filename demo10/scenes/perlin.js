class Demo10PerlinScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            capturing: {
                enabled: false,
                addRedFrame: false,
                stopByCode: true,   
                viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'perlin'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let hClamp = [240, 320];
                let hDelta = hClamp[1] - hClamp[0];
                let paramsDivider = 30;
                let paramsMultiplier = 3;

                let v_paramsDivider = 20;
                let v_paramsMultiplier = 5;

                
                let maxT = 4;

                let totalFrames = 300;

                let timeValues = [
                    ...easing.fast({ from: 0, to: maxT, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut' }),
                    ...easing.fast({ from: maxT, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut' })
                ]

                this.frames = [];

                let seed = getRandom(0,1000); 
                console.log('seed:' + seed );
                var pn = new mathUtils.Perlin('random seed ' + seed);

                let v_seed = getRandom(0,1000); 
                console.log('seed:' + v_seed );
                var v_pn = new mathUtils.Perlin('random seed ' + seed);

                for(let f = 0; f < totalFrames; f++){
                    if(f%10 == 0){
                        console.log('frame: ' + f);
                    }

                    let time = timeValues[f];
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < size.y; y++){
                            for(let x = 0; x < size.x; x++){
                                // let noise = pn.noise(x/paramsDivider, y/paramsDivider, time/10);

                                let noiseX = pn.noise(x/paramsDivider, y/paramsDivider, time/10);
                                let noiseY = pn.noise((x-100)/paramsDivider, (y+200)/paramsDivider, time/10);
                                let noise = pn.noise(noiseX*paramsMultiplier, noiseY*paramsMultiplier, time/10);

                                let v_noiseX = pn.noise(x/v_paramsDivider, y/v_paramsDivider, time/10);
                                let v_noiseY = pn.noise((x+100)/v_paramsDivider, (y-200)/v_paramsDivider, time/10);
                                let v_noise = pn.noise(v_noiseX*v_paramsMultiplier, v_noiseY*v_paramsMultiplier, time/10);

                                //noise = noise*100;
                                let h =hClamp[0] + fast.r(noise*hDelta)
                                
                                let v = fast.r(v_noise*100);
                                let s = 100-v;

                                hlp.setFillColor(colors.colorTypeConverter({ value: { h, s, v }, fromType: 'hsv', toType: 'hex'}))
                                .dot(x,y)
                            }
                        }
                    })
                }

let repeat = 1;
                this.registerFramesDefaultTimer({
                            framesEndCallback: () => { 
                                repeat--;
                                if(repeat == 0)
                                    this.parentScene.capturing.stop = true; 
                                }
                        });
            }
        }), 1)
    }
}