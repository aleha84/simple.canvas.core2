class Demo10Exp2Scene extends Scene {
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
                viewportSizeMultiplier: 5,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'loading2'
            },
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
            createExp2Frames({framesCountAppearance, framesCountShowHide, itemsCount, itemFrameslength, size}) {
                let frames = [];
                let loadingModel = {"general":{"originalSize":{"x":60,"y":15},"size":{"x":60,"y":15},"zoom":3,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"","visible":true,"groups":[{"order":0,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_0","points":[{"point":{"x":3,"y":5},"order":0,"id":"m_0_g_0_p_18"},{"point":{"x":4,"y":5},"order":1,"id":"m_0_g_0_p_19"},{"point":{"x":4,"y":6},"order":2,"id":"m_0_g_0_p_20"},{"point":{"x":3,"y":6},"order":3,"id":"m_0_g_0_p_21"},{"point":{"x":3,"y":7},"order":4,"id":"m_0_g_0_p_22"},{"point":{"x":4,"y":7},"order":5,"id":"m_0_g_0_p_23"},{"point":{"x":4,"y":8},"order":6,"id":"m_0_g_0_p_24"},{"point":{"x":3,"y":8},"order":7,"id":"m_0_g_0_p_25"},{"point":{"x":3,"y":9},"order":8,"id":"m_0_g_0_p_26"},{"point":{"x":3,"y":10},"order":9,"id":"m_0_g_0_p_27"},{"point":{"x":4,"y":10},"order":10,"id":"m_0_g_0_p_28"},{"point":{"x":4,"y":9},"order":11,"id":"m_0_g_0_p_29"},{"point":{"x":5,"y":9},"order":12,"id":"m_0_g_0_p_38"},{"point":{"x":6,"y":9},"order":13,"id":"m_0_g_0_p_39"},{"point":{"x":6,"y":10},"order":14,"id":"m_0_g_0_p_40"},{"point":{"x":5,"y":10},"order":15,"id":"m_0_g_0_p_41"},{"point":{"x":7,"y":9},"order":16,"id":"m_0_g_0_p_42"},{"point":{"x":8,"y":9},"order":17,"id":"m_0_g_0_p_43"},{"point":{"x":8,"y":10},"order":18,"id":"m_0_g_0_p_44"},{"point":{"x":7,"y":10},"order":19,"id":"m_0_g_0_p_45"},{"point":{"x":11,"y":9},"order":20,"id":"m_0_g_0_p_66"},{"point":{"x":11,"y":10},"order":21,"id":"m_0_g_0_p_67"},{"point":{"x":12,"y":10},"order":22,"id":"m_0_g_0_p_68"},{"point":{"x":12,"y":9},"order":23,"id":"m_0_g_0_p_69"},{"point":{"x":11,"y":8},"order":24,"id":"m_0_g_0_p_70"},{"point":{"x":11,"y":7},"order":25,"id":"m_0_g_0_p_71"},{"point":{"x":12,"y":7},"order":26,"id":"m_0_g_0_p_72"},{"point":{"x":12,"y":8},"order":27,"id":"m_0_g_0_p_73"},{"point":{"x":11,"y":6},"order":28,"id":"m_0_g_0_p_74"},{"point":{"x":11,"y":5},"order":29,"id":"m_0_g_0_p_75"},{"point":{"x":12,"y":5},"order":30,"id":"m_0_g_0_p_76"},{"point":{"x":12,"y":6},"order":31,"id":"m_0_g_0_p_77"},{"point":{"x":13,"y":5},"order":32,"id":"m_0_g_0_p_78"},{"point":{"x":14,"y":5},"order":33,"id":"m_0_g_0_p_79"},{"point":{"x":15,"y":5},"order":34,"id":"m_0_g_0_p_81"},{"point":{"x":16,"y":5},"order":35,"id":"m_0_g_0_p_82"},{"point":{"x":16,"y":6},"order":36,"id":"m_0_g_0_p_83"},{"point":{"x":16,"y":7},"order":37,"id":"m_0_g_0_p_84"},{"point":{"x":16,"y":8},"order":38,"id":"m_0_g_0_p_85"},{"point":{"x":16,"y":9},"order":39,"id":"m_0_g_0_p_86"},{"point":{"x":16,"y":10},"order":40,"id":"m_0_g_0_p_87"},{"point":{"x":15,"y":10},"order":41,"id":"m_0_g_0_p_88"},{"point":{"x":14,"y":10},"order":42,"id":"m_0_g_0_p_92"},{"point":{"x":13,"y":10},"order":43,"id":"m_0_g_0_p_93"},{"point":{"x":15,"y":6},"order":44,"id":"m_0_g_0_p_94"},{"point":{"x":15,"y":7},"order":45,"id":"m_0_g_0_p_95"},{"point":{"x":15,"y":8},"order":46,"id":"m_0_g_0_p_96"},{"point":{"x":15,"y":9},"order":47,"id":"m_0_g_0_p_97"},{"point":{"x":14,"y":6},"order":48,"id":"m_0_g_0_p_99"},{"point":{"x":13,"y":6},"order":49,"id":"m_0_g_0_p_100"},{"point":{"x":13,"y":9},"order":50,"id":"m_0_g_0_p_101"},{"point":{"x":14,"y":9},"order":51,"id":"m_0_g_0_p_102"},{"point":{"x":19,"y":7},"order":52,"id":"m_0_g_0_p_105"},{"point":{"x":19,"y":8},"order":53,"id":"m_0_g_0_p_106"},{"point":{"x":19,"y":9},"order":54,"id":"m_0_g_0_p_107"},{"point":{"x":19,"y":10},"order":55,"id":"m_0_g_0_p_108"},{"point":{"x":20,"y":10},"order":56,"id":"m_0_g_0_p_109"},{"point":{"x":20,"y":9},"order":57,"id":"m_0_g_0_p_110"},{"point":{"x":20,"y":8},"order":58,"id":"m_0_g_0_p_111"},{"point":{"x":20,"y":7},"order":59,"id":"m_0_g_0_p_112"},{"point":{"x":21,"y":6},"order":60,"id":"m_0_g_0_p_113"},{"point":{"x":21,"y":5},"order":61,"id":"m_0_g_0_p_114"},{"point":{"x":22,"y":5},"order":62,"id":"m_0_g_0_p_115"},{"point":{"x":22,"y":6},"order":63,"id":"m_0_g_0_p_116"},{"point":{"x":24,"y":7},"order":64,"id":"m_0_g_0_p_121"},{"point":{"x":24,"y":8},"order":65,"id":"m_0_g_0_p_122"},{"point":{"x":24,"y":9},"order":66,"id":"m_0_g_0_p_123"},{"point":{"x":24,"y":10},"order":67,"id":"m_0_g_0_p_124"},{"point":{"x":23,"y":10},"order":68,"id":"m_0_g_0_p_125"},{"point":{"x":23,"y":9},"order":69,"id":"m_0_g_0_p_126"},{"point":{"x":23,"y":8},"order":70,"id":"m_0_g_0_p_127"},{"point":{"x":23,"y":7},"order":71,"id":"m_0_g_0_p_128"},{"point":{"x":27,"y":5},"order":72,"id":"m_0_g_0_p_133"},{"point":{"x":27,"y":6},"order":73,"id":"m_0_g_0_p_134"},{"point":{"x":27,"y":7},"order":74,"id":"m_0_g_0_p_135"},{"point":{"x":27,"y":8},"order":75,"id":"m_0_g_0_p_136"},{"point":{"x":27,"y":9},"order":76,"id":"m_0_g_0_p_137"},{"point":{"x":27,"y":10},"order":77,"id":"m_0_g_0_p_138"},{"point":{"x":28,"y":10},"order":78,"id":"m_0_g_0_p_139"},{"point":{"x":28,"y":9},"order":79,"id":"m_0_g_0_p_140"},{"point":{"x":28,"y":8},"order":80,"id":"m_0_g_0_p_141"},{"point":{"x":28,"y":7},"order":81,"id":"m_0_g_0_p_142"},{"point":{"x":28,"y":6},"order":82,"id":"m_0_g_0_p_143"},{"point":{"x":28,"y":5},"order":83,"id":"m_0_g_0_p_144"},{"point":{"x":29,"y":5},"order":84,"id":"m_0_g_0_p_145"},{"point":{"x":30,"y":5},"order":85,"id":"m_0_g_0_p_146"},{"point":{"x":30,"y":6},"order":86,"id":"m_0_g_0_p_147"},{"point":{"x":29,"y":6},"order":87,"id":"m_0_g_0_p_148"},{"point":{"x":31,"y":7},"order":88,"id":"m_0_g_0_p_149"},{"point":{"x":31,"y":8},"order":89,"id":"m_0_g_0_p_150"},{"point":{"x":32,"y":8},"order":90,"id":"m_0_g_0_p_151"},{"point":{"x":32,"y":7},"order":91,"id":"m_0_g_0_p_152"},{"point":{"x":30,"y":9},"order":92,"id":"m_0_g_0_p_153"},{"point":{"x":29,"y":9},"order":93,"id":"m_0_g_0_p_154"},{"point":{"x":29,"y":10},"order":94,"id":"m_0_g_0_p_155"},{"point":{"x":30,"y":10},"order":95,"id":"m_0_g_0_p_156"},{"point":{"x":35,"y":5},"order":96,"id":"m_0_g_0_p_157"},{"point":{"x":35,"y":6},"order":97,"id":"m_0_g_0_p_158"},{"point":{"x":36,"y":6},"order":98,"id":"m_0_g_0_p_159"},{"point":{"x":36,"y":5},"order":99,"id":"m_0_g_0_p_160"},{"point":{"x":37,"y":5},"order":100,"id":"m_0_g_0_p_161"},{"point":{"x":38,"y":5},"order":101,"id":"m_0_g_0_p_162"},{"point":{"x":39,"y":5},"order":102,"id":"m_0_g_0_p_163"},{"point":{"x":40,"y":5},"order":103,"id":"m_0_g_0_p_164"},{"point":{"x":40,"y":6},"order":104,"id":"m_0_g_0_p_165"},{"point":{"x":38,"y":6},"order":105,"id":"m_0_g_0_p_169"},{"point":{"x":37,"y":6},"order":106,"id":"m_0_g_0_p_170"},{"point":{"x":39,"y":6},"order":107,"id":"m_0_g_0_p_171"},{"point":{"x":37,"y":7},"order":108,"id":"m_0_g_0_p_172"},{"point":{"x":37,"y":8},"order":109,"id":"m_0_g_0_p_173"},{"point":{"x":37,"y":9},"order":110,"id":"m_0_g_0_p_174"},{"point":{"x":37,"y":10},"order":111,"id":"m_0_g_0_p_175"},{"point":{"x":38,"y":10},"order":112,"id":"m_0_g_0_p_176"},{"point":{"x":38,"y":9},"order":113,"id":"m_0_g_0_p_177"},{"point":{"x":38,"y":8},"order":114,"id":"m_0_g_0_p_178"},{"point":{"x":38,"y":7},"order":115,"id":"m_0_g_0_p_179"},{"point":{"x":35,"y":9},"order":116,"id":"m_0_g_0_p_180"},{"point":{"x":35,"y":10},"order":117,"id":"m_0_g_0_p_181"},{"point":{"x":36,"y":10},"order":118,"id":"m_0_g_0_p_182"},{"point":{"x":36,"y":9},"order":119,"id":"m_0_g_0_p_183"},{"point":{"x":39,"y":9},"order":120,"id":"m_0_g_0_p_184"},{"point":{"x":40,"y":9},"order":121,"id":"m_0_g_0_p_185"},{"point":{"x":40,"y":10},"order":122,"id":"m_0_g_0_p_186"},{"point":{"x":39,"y":10},"order":123,"id":"m_0_g_0_p_187"},{"point":{"x":44,"y":5},"order":124,"id":"m_0_g_0_p_188"},{"point":{"x":44,"y":6},"order":125,"id":"m_0_g_0_p_189"},{"point":{"x":44,"y":7},"order":126,"id":"m_0_g_0_p_190"},{"point":{"x":44,"y":8},"order":127,"id":"m_0_g_0_p_191"},{"point":{"x":44,"y":9},"order":128,"id":"m_0_g_0_p_192"},{"point":{"x":44,"y":10},"order":129,"id":"m_0_g_0_p_193"},{"point":{"x":43,"y":10},"order":130,"id":"m_0_g_0_p_194"},{"point":{"x":43,"y":9},"order":131,"id":"m_0_g_0_p_195"},{"point":{"x":43,"y":8},"order":132,"id":"m_0_g_0_p_196"},{"point":{"x":43,"y":7},"order":133,"id":"m_0_g_0_p_197"},{"point":{"x":43,"y":6},"order":134,"id":"m_0_g_0_p_198"},{"point":{"x":43,"y":5},"order":135,"id":"m_0_g_0_p_199"},{"point":{"x":45,"y":5},"order":136,"id":"m_0_g_0_p_200"},{"point":{"x":45,"y":6},"order":137,"id":"m_0_g_0_p_201"},{"point":{"x":46,"y":6},"order":138,"id":"m_0_g_0_p_204"},{"point":{"x":46,"y":5},"order":139,"id":"m_0_g_0_p_205"},{"point":{"x":47,"y":7},"order":140,"id":"m_0_g_0_p_206"},{"point":{"x":47,"y":8},"order":141,"id":"m_0_g_0_p_207"},{"point":{"x":47,"y":9},"order":142,"id":"m_0_g_0_p_208"},{"point":{"x":47,"y":10},"order":143,"id":"m_0_g_0_p_209"},{"point":{"x":48,"y":10},"order":144,"id":"m_0_g_0_p_210"},{"point":{"x":48,"y":9},"order":145,"id":"m_0_g_0_p_211"},{"point":{"x":48,"y":8},"order":146,"id":"m_0_g_0_p_212"},{"point":{"x":48,"y":7},"order":147,"id":"m_0_g_0_p_213"},{"point":{"x":51,"y":5},"order":148,"id":"m_0_g_0_p_214"},{"point":{"x":51,"y":6},"order":149,"id":"m_0_g_0_p_215"},{"point":{"x":52,"y":6},"order":150,"id":"m_0_g_0_p_216"},{"point":{"x":52,"y":5},"order":151,"id":"m_0_g_0_p_217"},{"point":{"x":51,"y":7},"order":152,"id":"m_0_g_0_p_218"},{"point":{"x":51,"y":8},"order":153,"id":"m_0_g_0_p_219"},{"point":{"x":52,"y":8},"order":154,"id":"m_0_g_0_p_220"},{"point":{"x":52,"y":7},"order":155,"id":"m_0_g_0_p_222"},{"point":{"x":51,"y":9},"order":156,"id":"m_0_g_0_p_223"},{"point":{"x":51,"y":10},"order":157,"id":"m_0_g_0_p_224"},{"point":{"x":52,"y":10},"order":158,"id":"m_0_g_0_p_225"},{"point":{"x":53,"y":10},"order":159,"id":"m_0_g_0_p_226"},{"point":{"x":52,"y":9},"order":160,"id":"m_0_g_0_p_227"},{"point":{"x":53,"y":9},"order":161,"id":"m_0_g_0_p_228"},{"point":{"x":54,"y":9},"order":162,"id":"m_0_g_0_p_229"},{"point":{"x":55,"y":9},"order":163,"id":"m_0_g_0_p_230"},{"point":{"x":56,"y":9},"order":164,"id":"m_0_g_0_p_231"},{"point":{"x":56,"y":10},"order":165,"id":"m_0_g_0_p_232"},{"point":{"x":55,"y":10},"order":166,"id":"m_0_g_0_p_233"},{"point":{"x":54,"y":10},"order":167,"id":"m_0_g_0_p_234"},{"point":{"x":56,"y":8},"order":168,"id":"m_0_g_0_p_235"},{"point":{"x":56,"y":7},"order":169,"id":"m_0_g_0_p_236"},{"point":{"x":55,"y":7},"order":170,"id":"m_0_g_0_p_237"},{"point":{"x":55,"y":8},"order":171,"id":"m_0_g_0_p_238"},{"point":{"x":54,"y":6},"order":172,"id":"m_0_g_0_p_239"},{"point":{"x":54,"y":5},"order":173,"id":"m_0_g_0_p_240"},{"point":{"x":53,"y":5},"order":174,"id":"m_0_g_0_p_241"},{"point":{"x":53,"y":6},"order":175,"id":"m_0_g_0_p_242"}]}]}]}}

                let xChange = easing.fast({ steps: framesCountAppearance, from: 0, to: size.x, type: 'linear', round: 0 });
                let loadingPoints = animationHelpers.extractPointData(loadingModel.main.layers.find(l => l.id == 'm_0'))

                let totalFrames = framesCountAppearance + framesCountShowHide;

                let itemsData = new Array(itemsCount + loadingPoints.length).fill().map((el, i) => {
                    let types = ['sin', 'quad', 'cubic', 'expo']
                    let methods = ['inOut', 'in', 'out']
                    let frames = [];

                    let x = getRandomInt(0, size.x-1)
                    let y = getRandomInt(0, size.y-1)

                    let isL = i > itemsCount-1;
                    if(isL){
                        let lp = loadingPoints[i - itemsCount];
                        x = lp.point.x + (size.x/2) - 40;
                        y = lp.point.y + (size.y/2) - 7;
                    }

                    let fromFrame = undefined;
                    
                    for(let f = 0; f < framesCountAppearance; f++){
                        if(x <= xChange[f]){
                            fromFrame = f;
                            break;
                        }
                    }

                    let maxA = getRandom(0.5, 1);
                    let shFramesCount = getRandomInt(framesCountShowHide/2, framesCountShowHide);
                    if(isL) {
                        fromFrame-=10;
                        shFramesCount = fast.r(framesCountShowHide*0.75);//getRandomInt(framesCountShowHide*0.5, framesCountShowHide*0.75);
                        //maxA = 0.75;
                        maxA = getRandom(0.5, 0.75  );
                    }

                    let showHideValues = [
                        ...easing.fast({ steps: fast.r(shFramesCount/2), from: 0, to: maxA, type: 'quad', method: 'in', round: 1 }),
                        ...easing.fast({ steps: fast.r(shFramesCount/2), from: maxA, to: 0, type: 'quad', method: 'out', round: 1 })
                    ]

                    // if(isL) {
                    //     showHideValues = [
                    //         ...easing.fast({ steps: fast.r(shFramesCount*4/5), from: 0, to: maxA, type: 'quad', method: 'in', round: 1 }),
                    //         ...easing.fast({ steps: fast.r(shFramesCount*1/5), from: maxA, to: 0, type: 'quad', method: 'out', round: 1 })
                    //     ]
                    // }

                    let direction = getRandomBool() ? 1 : -1;
                    let xShiftValues = easing.fast({ steps: shFramesCount, from: 0, to: direction*getRandomInt(5,15), type: types[getRandomInt(0, types.length-1)], method: methods[getRandomInt(0, methods.length-1)], round: 0 })

                    if(isL)
                    {
                        xShiftValues = //new Array(shFramesCount).fill(10);
                        [
                            ...easing.fast({ steps: fast.r(shFramesCount*3/4), from: 0, to: 10, type: 'quad', method: 'inOut', round: 0 }),
                            ...easing.fast({ steps: fast.r(shFramesCount*1/4), from: 10, to: getRandomInt(-10,0), type: 'expo', method: 'in', round: 0 })
                        ]
                    }
                    //let xShiftToY = getRandomBool();

                    for(let f = 0; f < shFramesCount; f++){
                        let frameIndex = f + fromFrame;
                        if(frameIndex > (totalFrames-1)){
                            frameIndex-=totalFrames;
                        }
                
                        frames[frameIndex] = {
                            xShift: xShiftValues[f],
                            o: showHideValues[f]
                        };
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })

                
                
                for(let f = 0; f < totalFrames; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        // if(f < framesCountAppearance) {
                        //     let x = xChange[f];
                        //     x+=5;
                        //     hlp.setFillColor('rgba(255,255,255,0.5)').rect(x, 0, 1, size.y);
                        //     hlp.setFillColor('rgba(255,255,255,0.25)').rect(x-1, 0, 1, size.y);
                        //     hlp.setFillColor('rgba(255,255,255,0.05)')
                        //         .rect(x-4, 0, 3, size.y)
                        //         .rect(x+1, 0, 1, size.y);
                        // }

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                let x = itemData.x;
                                let y = itemData.y;
                                if(itemData.xShiftToY){
                                    y+=itemData.frames[f].xShift;
                                }
                                else {
                                    x+=itemData.frames[f].xShift;
                                }
                                hlp.setFillColor(`rgba(255,255,255,${itemData.frames[f].o})`).dot(x, y)
                            }
                            
                        }

                        // hlp.setFillColor('#808080')
                        //     .rect(0,0,size.x, 1)
                        //     .rect(0,size.y-1,size.x, 1)

                        // hlp.setFillColor('#404040')
                        //     .rect(0,1,size.x, 2)
                        //     .rect(0,size.y- 3,size.x, 2)

                        // hlp.setFillColor('#1a1a1a')
                        //     .rect(0,2,size.x, 2)
                        //     .rect(0,size.y-3,size.x, 1)

                        // hlp.setFillColor('#0d0d0d')
                        //     .rect(0,2,size.x, 1)
                        //     .rect(0,size.y-3,size.x, 1)
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createExp2Frames({ framesCountAppearance: 100, framesCountShowHide: 150, itemsCount: 400, size: this.size });

                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => { 
                        repeat--;
                        if(repeat == 0)
                            this.parentScene.capturing.stop = true; 
                        }
                });
            }
        }), 2)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y);
                })
            }
        }), 1)
    }
}