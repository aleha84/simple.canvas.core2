class Effects5Scene extends Scene {
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
        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let totalFrames = 100;

                let color = '#F7FF4B';
                let colorHsv = colors.colorTypeConverter({ value: color, fromType: 'hex', toType: 'hsv' });
                let minHsv = colorHsv.v-80;
                if(minHsv < 0) 
                    minHsv = 0;

                let minColor =  colors.colorTypeConverter({ value: [colorHsv.h, colorHsv.s, minHsv], fromType: 'hsv', toType: 'hex' })
                let hsvClamps = [colorHsv.v, minHsv];

                let origin = this.size.divide(2).toInt()

                let radiusClamps = [20, 80];
                let radiusSteps = radiusClamps[1] - radiusClamps[0];
                let ellipsisStepsCLamps = [1, 8]

                let modificatorsCountClamps = [50, 70];
                let modificatorsMinClamps = [2, 30];
                let modificatorsMaxClamps = [3,40];
                let modificatorsLengthMinClamps = [8, 10];
                let modificatorsLengthMaxClamps = [15, 20];
                
                let ellipsisStepToRadius = easing.fast({from: ellipsisStepsCLamps[0], to: ellipsisStepsCLamps[1], steps: radiusSteps, type: 'linear', round: 0});
                let modificatorsCountsToRadiusValues = easing.fast({from: modificatorsCountClamps[0], to: modificatorsCountClamps[1], steps: radiusSteps, type: 'linear', round: 0});
                let modificatorsMinToRadiusValues = easing.fast({from: modificatorsMinClamps[0], to: modificatorsMinClamps[1], steps: radiusSteps, type: 'linear', round: 0});
                let modificatorsMaxToRadiusValues = easing.fast({from: modificatorsMaxClamps[0], to: modificatorsMaxClamps[1], steps: radiusSteps, type: 'linear', round: 0});
                let modificatorsLengthMinToRadiusValues = easing.fast({from: modificatorsLengthMinClamps[0], to: modificatorsLengthMinClamps[1], steps: radiusSteps, type: 'linear', round: 0});
                let modificatorsLengthMaxToRadiusValues = easing.fast({from: modificatorsLengthMaxClamps[0], to: modificatorsLengthMaxClamps[1], steps: radiusSteps, type: 'linear', round: 0});

                let cColors = [minColor]
                let circleImages = {};
                
                for(let c = 0; c < cColors.length; c++){
                    circleImages[cColors[c]] = []
                    for(let s = 20; s < 90; s++){
                        if(s > 8)
                            circleImages[cColors[c]][s] = createCanvas(new V2(s*2,s*2), (ctx, size, hlp) => {
                                hlp.setFillColor(cColors[c]).сircle(new V2(s,s), s);
                            })
                        else {
                            circleImages[cColors[c]][s] = PP.createImage(PP.circles.filled[s], { colorsSubstitutions: { "#FF0000": { color: cColors[c], changeFillColor: true } } })
                        }
                    }
                }

                // let frames = [];

                let rFrames = [];

                // for(let f = 0; f < totalFrames; f++) {
                //     frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                
                let rStep = 10;
                for(let r = radiusClamps[0]; r < radiusClamps[1]; r+=rStep) {
                    let radius = new V2(r,r);
                    let dots = [];
    
                    let rIndex = r-radiusClamps[0]

                    createCanvas(V2.up, (ctx, size, hlp) => {
                        hlp.setFillColor('black').strokeEllipsis(0,360,ellipsisStepToRadius[rIndex], origin, radius.x, radius.y,dots,true)
                    })
    
                    let modificationsCount = modificatorsCountsToRadiusValues[rIndex]//30;
                    let modificatorsMin = modificatorsMinToRadiusValues[rIndex];
                    let modificatorsMax = modificatorsMaxToRadiusValues[rIndex];
                    let modificationsMaxValues = new Array(modificationsCount).fill().map(el => {
                        let maxValue = getRandomInt(modificatorsMin,modificatorsMax) * (getRandomBool() ? 1 : -1);
                        let minValue = getRandomInt(modificatorsMin,modificatorsMax) * (getRandomBool() ? 1 : -1);
    
                        let modificatorLength = getRandomInt(
                            modificatorsLengthMinToRadiusValues[rIndex],
                            modificatorsLengthMaxToRadiusValues[rIndex])*2;
                        let startPointIndex = getRandomInt(0, dots.length);
    
                        let _values = [
                            ...easing.fast({from: minValue, to: maxValue, steps: totalFrames/2, type: 'quad', method: 'inOut'}),
                            ...easing.fast({from: maxValue, to: minValue, steps: totalFrames/2, type: 'quad', method: 'inOut'})
                        ]
    
                        let startFrameIndex = getRandomInt(0, totalFrames-1);
                        let values = [];
                        for(let f = 0; f < totalFrames; f++) {
                            let fIndex = f+startFrameIndex;
                            if(fIndex > (totalFrames-1)) {
                                fIndex -= totalFrames;
                            }
    
                            values[fIndex] = _values[f];
                        }
    
                        return {
                            modificatorLength,
                            startPointIndex,
                            values
                        }
                    });

                    let frames = [];
                    for(let f = 0; f < totalFrames; f++) {
                        frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PP({ctx});
                            let modificators = [];

                            for(let i = 0; i < modificationsCount; i++) {
                                let maxModificatorValue = modificationsMaxValues[i].values[f] //getRandomInt(minValue0,20) * (getRandomBool() ? 1 : -1);
                                let modificatorLength = modificationsMaxValues[i].modificatorLength //getRandomInt(5,10)*2;
                                let modificatorChange = [
                                    ...easing.fast({from: 1, to: maxModificatorValue, steps: modificatorLength/2, type: 'quad', method: 'inOut'}),
                                    ...easing.fast({from: maxModificatorValue, to: 1, steps: modificatorLength/2, type: 'quad', method: 'inOut'})
                                ]
            
                                let startPointIndex = modificationsMaxValues[i].startPointIndex//getRandomInt(0, dots.length);
                                let modificationData = [];
                                for(let f = 0; f < modificatorLength;f++) {
                                    let pIndex = f + startPointIndex;
                                    if(pIndex > (dots.length-1)){
                                        pIndex-=dots.length;
                                    }
            
                                    modificationData[pIndex] = {
                                        modificatorValue: fast.r(modificatorChange[f],3)
                                    }
                                }
            
                                modificators[i] = {
                                    modificationData
                                };
                            }
                            //let xValuesChange = easing.fast({from: 0, to: degreeToRadians(360), steps: dots.length, type: 'linear' });

                            //let foo = (x) => 1.5*Math.sin(20*(x));

                            let points = [];
                            let distanceClamps = [];
                            for(let i = 0; i < dots.length; i++) {
                                let dot = new V2(dots[i])
                                let direction = origin.direction(dot);

                                let mods = [];
                                for(let mi = 0; mi < modificators.length; mi++) {
                                    let m = modificators[mi];
                                    if(m.modificationData[i] != undefined) {
                                        //console.log(`${i}: ${m.modificationData[i].modificatorValue}`)
                                        mods.push(m.modificationData[i].modificatorValue);
                                    }
                                }

                                let dir = direction.clone();

                                if(mods.length) {
                                    let mod = mods.reduce((a,b) => (a+b))/ mods.length;
                                    // let mod = [];
                                    // for(let m = 0; m < mods.length; m++) {
                                    //     mod.push(m);
                                    //     //dir = dir.mul(mods[m]);
                                    // }

                                    dir = dir.mul(mod);
                                }
                                
                                let p = dot.add(
                                    dir
                                ).toInt()

                                let distance = fast.r(origin.distance(p));
                                p.distance = distance;

                                if(distanceClamps[0] == undefined || distance < distanceClamps[0]) {
                                    distanceClamps[0] = distance;
                                }

                                if(distanceClamps[1] == undefined || distance > distanceClamps[1]) {
                                    distanceClamps[1] = distance;
                                }

                                points.push(
                                    p
                                )

                            }

                            //distanceClamps = distanceClamps.map(d => fast.r(d));

                            let vValues = easing.fast({ from: hsvClamps[0], to: hsvClamps[1], steps: distanceClamps[1] - distanceClamps[0], type: 'linear', round: 0});

                            let _r = r+5;
                            //ctx.drawImage(circleImages[minColor][r+5], fast.r(origin.x - _r), fast.r(origin.y - _r));

                            // ctx.globalCompositeOperation = 'destination-out';
                            // ctx.drawImage(createCanvas(this.size, (ctx, size, hlp) => {
                            //     let pp = new PP({ctx});
                            //     pp.setFillStyle('black');
                            //     pp.fillByCornerPoints(points)
                            // }), 0, 0)


                            // ctx.globalCompositeOperation = 'source-over';
                            //pp.setFillStyle('#F7FF4B')
                            pp.fillStyleProvider = (x,y) => {
                                let distance = fast.r(origin.distance(new V2(x, y)));
                                let v = vValues[distance - distanceClamps[0]];
                                if(v == undefined)
                                    v = hsvClamps[1];

                                return colors.colorTypeConverter({ value: [colorHsv.h, colorHsv.s, v], fromType: 'hsv', toType: 'hex' })
                            };

                            for(let p = 0; p < points.length; p++) {
                                if(p < points.length-1)
                                    pp.lineV2(points[p], points[p+1])
                            }

                            pp.lineV2(points[points.length-1], points[0])
                        })
                    }

                    rFrames[rIndex] = frames;

                }       
                //     })
                // }

                this.frames = [];
                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let r = 0; r < rFrames.length; r+=rStep) {
                            ctx.drawImage(rFrames[r][f], 0, 0)
                        }
                    })
                }

                //this.frames = frames;

                this.registerFramesDefaultTimer({});
            }
        }), 1)
    }
}