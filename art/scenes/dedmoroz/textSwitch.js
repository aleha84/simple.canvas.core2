class TextSwitchScene extends Scene {
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
                size: new V2(138,200).mul(1),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'ded_moroz',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        let size = this.viewport.clone();
        let model = DedMorozScene.models.main;

        let text1Img = PP.createImage(model, { renderOnly: ['text1'] })
        let text2Img = PP.createImage(model, { renderOnly: ['text2'] })

        let yClamps = [7,16]

        let t1Pixels = getPixelsAsMatrix(text1Img, size);
        let t2Pixels = getPixelsAsMatrix(text2Img, size);

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0);
            })
        }), 1)

        this.glitch = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(0, 70)),
            size: this.viewport.clone(),
            init() {
                let createGlitch = (pixels) => createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < pixels.length; y++) {
                        if( pixels[y] == undefined)
                            continue;

                        let isLeft = getRandomBool();
                        let xShift = getRandomInt(2,20)*(isLeft ? -1 : 1)

                        for(let x = 0; x < pixels[y].length; x++) {
                            if(pixels[y][x] == undefined)
                                continue;

                            hlp.setFillColor(`rgba(${pixels[y][x][0]}, ${pixels[y][x][1]}, ${pixels[y][x][2]})`).dot(x + xShift, y);
                        }
                    }
                })

                let f1 = createGlitch(t1Pixels)
                let f2 = createGlitch(t1Pixels)
                let f3 = createGlitch(t2Pixels)
                let f4 = createGlitch(t2Pixels)

                this.frames = [
                    ...new Array(130).fill(text1Img),
                    ...new Array(5).fill(f1),
                    ...new Array(5).fill(f2),
                    ...new Array(5).fill(f3),
                    ...new Array(5).fill(f4),
                    ...new Array(130).fill(text2Img),
                    ...new Array(5).fill(f3),
                    ...new Array(5).fill(f4),
                    ...new Array(5).fill(f1),
                    ...new Array(5).fill(f2),
                ]

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 10)

        // this.effect1 = this.addGo(new GO({
        //     position: this.sceneCenter.add(new V2(0, 30)),
        //     size: this.viewport.clone(),
        //     init() {
        //         let size = this.size
        //         let createFrames = (moveOutPixels, moveInPixels, framesLength, delayLength) => {
        //             let upper = easing.fast({from: 7, to: 11, steps: framesLength, type: 'quad', method: 'out', round: 0})
        //             let lower = easing.fast({from: 17, to: 12, steps: framesLength, type: 'quad', method: 'out', round: 0})

        //             let upper1 = easing.fast({from: 11, to: 7, steps: framesLength, type: 'quad', method: 'out', round: 0})
        //             let lower1 = easing.fast({from: 12, to: 17, steps: framesLength, type: 'quad', method: 'out', round: 0})

        //             let frames = []
        //             let pixels = moveOutPixels;
        //             for(let f = 0; f < framesLength; f++) {
        //                 let from = upper[f];
        //                 let to = lower[f];
        //                 frames[frames.length] = createCanvas(size, (ctx, size, hlp) => {
        //                     for(let y = 0; y < pixels.length; y++) {
        //                         if( pixels[y] == undefined)
        //                             continue;
        
        //                         if(y < from || y > to)
        //                             continue;

        //                         for(let x = 0; x < pixels[y].length; x++) {
        //                             if(pixels[y][x] == undefined)
        //                                 continue;
        
        //                             hlp.setFillColor(`rgba(${pixels[y][x][0]}, ${pixels[y][x][1]}, ${pixels[y][x][2]})`).dot(x, y);
        //                         }
        //                     }
        //                 })
        //             }

        //             for(let f = 0; f < delayLength; f++) {
        //                 frames[frames.length] = undefined;
        //             }

        //             pixels = moveInPixels;
        //             for(let f = 0; f < framesLength; f++) {
        //                 let from = upper1[f];
        //                 let to = lower1[f];
        //                 frames[frames.length] = createCanvas(size, (ctx, size, hlp) => {
        //                     for(let y = 0; y < pixels.length; y++) {
        //                         if( pixels[y] == undefined)
        //                             continue;
        
        //                         if(y < from || y > to)
        //                             continue;

        //                         for(let x = 0; x < pixels[y].length; x++) {
        //                             if(pixels[y][x] == undefined)
        //                                 continue;
        
        //                             hlp.setFillColor(`rgba(${pixels[y][x][0]}, ${pixels[y][x][1]}, ${pixels[y][x][2]})`).dot(x, y);
        //                         }
        //                     }
        //                 })
        //             }

        //             return frames;
        //         }

        //         this.frames = [
        //             ...new Array(120).fill(text1Img),
        //             ...createFrames(t1Pixels, t2Pixels, 10, 10),
        //             ...new Array(120).fill(text2Img),
        //             ...createFrames(t2Pixels, t1Pixels, 10, 10),
        //         ]

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 1)

        // this.effect2 = this.addGo(new GO({
        //     position: this.sceneCenter.add(new V2(0, 30)),
        //     size: this.viewport.clone(),
        //     init() {
        //         let size = this.size
        //         let createFrames = (moveOutPixels, moveInPixels, framesLength) => {
        //             let frames = [];
        //             let xValues = easing.fast({from: 0, to: size.x, steps: framesLength, type: 'quad', method: 'out'})

        //             for(let f = 0; f < framesLength; f++) {
        //                 let currentX = xValues[f];
        //             }

        //             return frames;
        //         }

        //         this.frames = [
        //             ...new Array(120).fill(text1Img),
        //             ...createFrames(t1Pixels, t2Pixels, 10, 10),
        //             ...new Array(120).fill(text2Img),
        //             ...createFrames(t2Pixels, t1Pixels, 10, 10),
        //         ]

        //         this.registerFramesDefaultTimer({});
        //     }
        // }), 1)
    }
}