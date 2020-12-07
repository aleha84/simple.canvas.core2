class Demo10Loading4Scene extends Scene {
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
                fileNamePrefix: 'loading4'
            }
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    generatePath({mainMidPointRotationDirection, sharedPP,xClamps, targetY, mainMidPointShiftClamps, resultMidPointXShiftClamps, resultMidPointYShiftClamps, innerDotsCountClamp, target, start}) {
        let innerDotsCount = getRandomInt(innerDotsCountClamp[0], innerDotsCountClamp[1]);
        //let start = new V2(getRandomInt(xClamps[0], xClamps[1]), 0)
        if(!start) {
            start = new V2(getRandomInt(xClamps[0], xClamps[1]), 0)
        }
        //let target = new V2(start.x + getRandomInt(-20, 20), targetY);
        if(!target){
            target = new V2(start.x + getRandomInt(-20, 20), targetY);
        }

        let stDirection = start.direction(target);
        let stMid = start.add(stDirection.mul(start.distance(target)*getRandom(0.3, 0.6))).toInt();
        let mainMidPoint = 
            stMid.add(
                stDirection.rotate(90*(mainMidPointRotationDirection)).mul(getRandomInt(mainMidPointShiftClamps[0], mainMidPointShiftClamps[1]))
            ).toInt()
    
        //debugger;
        let mainPoints = distinct([
            ...sharedPP.lineV2(start, mainMidPoint),
            ...sharedPP.lineV2(mainMidPoint, target)
        ], (p) => p.x + '_' + p.y);

        let resultPoints = [];
        let midPointsIndexStep = fast.r(mainPoints.length/(innerDotsCount + 1));
        let midPointsIntexStepVariations = fast.r(midPointsIndexStep/3);
        let resultMidPoints = []
        let resultMidPointsIndices = []
        let prevPoint = undefined;
        for(let i = 0; i < innerDotsCount +1; i++){
            let mPoint1 = undefined;
            let mPoint2 = undefined;
            if(i == 0){
                mPoint1 = start;
                mPoint2 = new V2(mainPoints[midPointsIndexStep + getRandomInt(-midPointsIntexStepVariations, 0)]).add(
                    new V2(
                        getRandomInt(resultMidPointXShiftClamps[0], resultMidPointXShiftClamps[1]), 
                        getRandomInt(resultMidPointYShiftClamps[0], resultMidPointYShiftClamps[1])
                    )
                );

                prevPoint = mPoint2;
                resultMidPoints.push(mPoint2);
            }
            else if(i == innerDotsCount){
                mPoint1 = prevPoint
                mPoint2 = target;
            }
            else {
                mPoint1 = prevPoint
                mPoint2 = new V2(mainPoints[midPointsIndexStep*(i+1) + getRandomInt(-midPointsIntexStepVariations, 0)]).add(
                    new V2(
                        getRandomInt(resultMidPointXShiftClamps[0], resultMidPointXShiftClamps[1]), 
                        getRandomInt(resultMidPointYShiftClamps[0], resultMidPointYShiftClamps[1])
                    )
                );

                prevPoint = mPoint2;
                resultMidPoints.push(mPoint2);
            }

            resultPoints.push(...sharedPP.lineV2(mPoint1, mPoint2));
            resultPoints = distinct(resultPoints, (p) => p.x + '_' + p.y);

            if(i < innerDotsCount) {
                resultMidPointsIndices.push(resultPoints.length-1)
            }
        }

        return {
            resultPoints,
            resultMidPoints,
            resultMidPointsIndices
        }
    }

    getFrameIndex(f, startFrameIndex, framesCount) {
        let frameIndex = f + startFrameIndex;
        if(frameIndex > (framesCount-1)){
            frameIndex-=framesCount;
        }

        return frameIndex;
    }

    createLightningFrames({framesCount, itemsCount, itemFrameslength, size}) {
        let lettersModel = {"general":{"originalSize":{"x":64,"y":8},"size":{"x":64,"y":8},"zoom":4,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_1","name":"l","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_1","points":[{"point":{"x":1,"y":3},"order":0,"id":"m_0_g_0_p_26"},{"point":{"x":1,"y":4},"order":1,"id":"m_0_g_0_p_27"},{"point":{"x":1,"y":5},"order":2,"id":"m_0_g_0_p_28"},{"point":{"x":1,"y":6},"order":3,"id":"m_0_g_0_p_30"},{"point":{"x":2,"y":6},"order":4,"id":"m_0_g_0_p_31"},{"point":{"x":3,"y":6},"order":5,"id":"m_0_g_0_p_32"},{"point":{"x":0,"y":3},"order":6,"id":"m_0_g_0_p_104"},{"point":{"x":0,"y":4},"order":7,"id":"m_0_g_0_p_105"},{"point":{"x":0,"y":5},"order":8,"id":"m_0_g_0_p_106"},{"point":{"x":0,"y":6},"order":9,"id":"m_0_g_0_p_107"},{"point":{"x":3,"y":7},"order":10,"id":"m_0_g_0_p_108"},{"point":{"x":2,"y":7},"order":11,"id":"m_0_g_0_p_109"},{"point":{"x":1,"y":7},"order":12,"id":"m_0_g_0_p_110"},{"point":{"x":0,"y":7},"order":13,"id":"m_0_g_0_p_111"},{"point":{"x":1,"y":2},"order":14,"id":"m_0_g_0_p_112"},{"point":{"x":0,"y":2},"order":15,"id":"m_0_g_0_p_113"},{"point":{"x":4,"y":6},"order":16,"id":"m_0_g_0_p_147"},{"point":{"x":4,"y":7},"order":17,"id":"m_0_g_0_p_148"},{"point":{"x":5,"y":7},"order":18,"id":"m_0_g_0_p_149"},{"point":{"x":5,"y":6},"order":19,"id":"m_0_g_0_p_150"},{"point":{"x":1,"y":1},"order":20,"id":"m_0_g_0_p_151"},{"point":{"x":1,"y":0},"order":21,"id":"m_0_g_0_p_152"},{"point":{"x":0,"y":0},"order":22,"id":"m_0_g_0_p_153"},{"point":{"x":0,"y":1},"order":23,"id":"m_0_g_0_p_154"}]}]},{"order":1,"id":"m_2","name":"o","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_2","points":[{"point":{"x":8,"y":5},"order":0,"id":"m_0_g_0_p_114"},{"point":{"x":9,"y":5},"order":1,"id":"m_0_g_0_p_115"},{"point":{"x":9,"y":4},"order":2,"id":"m_0_g_0_p_116"},{"point":{"x":8,"y":4},"order":3,"id":"m_0_g_0_p_117"},{"point":{"x":10,"y":6},"order":4,"id":"m_0_g_0_p_118"},{"point":{"x":10,"y":7},"order":5,"id":"m_0_g_0_p_119"},{"point":{"x":11,"y":7},"order":6,"id":"m_0_g_0_p_120"},{"point":{"x":11,"y":6},"order":7,"id":"m_0_g_0_p_121"},{"point":{"x":8,"y":3},"order":8,"id":"m_0_g_0_p_122"},{"point":{"x":9,"y":3},"order":9,"id":"m_0_g_0_p_123"},{"point":{"x":9,"y":2},"order":10,"id":"m_0_g_0_p_124"},{"point":{"x":8,"y":2},"order":11,"id":"m_0_g_0_p_125"},{"point":{"x":10,"y":1},"order":12,"id":"m_0_g_0_p_126"},{"point":{"x":11,"y":1},"order":13,"id":"m_0_g_0_p_127"},{"point":{"x":11,"y":0},"order":14,"id":"m_0_g_0_p_128"},{"point":{"x":10,"y":0},"order":15,"id":"m_0_g_0_p_129"},{"point":{"x":12,"y":0},"order":16,"id":"m_0_g_0_p_130"},{"point":{"x":12,"y":1},"order":17,"id":"m_0_g_0_p_131"},{"point":{"x":13,"y":1},"order":18,"id":"m_0_g_0_p_132"},{"point":{"x":13,"y":0},"order":19,"id":"m_0_g_0_p_133"},{"point":{"x":14,"y":2},"order":20,"id":"m_0_g_0_p_135"},{"point":{"x":14,"y":3},"order":21,"id":"m_0_g_0_p_136"},{"point":{"x":14,"y":4},"order":22,"id":"m_0_g_0_p_137"},{"point":{"x":14,"y":5},"order":23,"id":"m_0_g_0_p_138"},{"point":{"x":15,"y":5},"order":24,"id":"m_0_g_0_p_139"},{"point":{"x":15,"y":4},"order":25,"id":"m_0_g_0_p_140"},{"point":{"x":15,"y":3},"order":26,"id":"m_0_g_0_p_141"},{"point":{"x":15,"y":2},"order":27,"id":"m_0_g_0_p_142"},{"point":{"x":13,"y":6},"order":28,"id":"m_0_g_0_p_143"},{"point":{"x":12,"y":6},"order":29,"id":"m_0_g_0_p_144"},{"point":{"x":12,"y":7},"order":30,"id":"m_0_g_0_p_145"},{"point":{"x":13,"y":7},"order":31,"id":"m_0_g_0_p_146"}]}]},{"order":2,"id":"m_3","name":"a","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_3","points":[{"point":{"x":18,"y":7},"order":0,"id":"m_0_g_0_p_155"},{"point":{"x":18,"y":6},"order":1,"id":"m_0_g_0_p_156"},{"point":{"x":19,"y":6},"order":2,"id":"m_0_g_0_p_157"},{"point":{"x":19,"y":7},"order":3,"id":"m_0_g_0_p_158"},{"point":{"x":18,"y":5},"order":4,"id":"m_0_g_0_p_159"},{"point":{"x":18,"y":4},"order":5,"id":"m_0_g_0_p_160"},{"point":{"x":19,"y":4},"order":6,"id":"m_0_g_0_p_161"},{"point":{"x":19,"y":5},"order":7,"id":"m_0_g_0_p_162"},{"point":{"x":18,"y":3},"order":8,"id":"m_0_g_0_p_163"},{"point":{"x":18,"y":2},"order":9,"id":"m_0_g_0_p_164"},{"point":{"x":19,"y":2},"order":10,"id":"m_0_g_0_p_165"},{"point":{"x":19,"y":3},"order":11,"id":"m_0_g_0_p_166"},{"point":{"x":20,"y":1},"order":12,"id":"m_0_g_0_p_167"},{"point":{"x":20,"y":0},"order":13,"id":"m_0_g_0_p_168"},{"point":{"x":21,"y":0},"order":14,"id":"m_0_g_0_p_169"},{"point":{"x":21,"y":1},"order":15,"id":"m_0_g_0_p_170"},{"point":{"x":22,"y":0},"order":16,"id":"m_0_g_0_p_171"},{"point":{"x":23,"y":0},"order":17,"id":"m_0_g_0_p_172"},{"point":{"x":23,"y":1},"order":18,"id":"m_0_g_0_p_173"},{"point":{"x":22,"y":1},"order":19,"id":"m_0_g_0_p_174"},{"point":{"x":24,"y":2},"order":20,"id":"m_0_g_0_p_175"},{"point":{"x":24,"y":3},"order":21,"id":"m_0_g_0_p_176"},{"point":{"x":24,"y":4},"order":22,"id":"m_0_g_0_p_177"},{"point":{"x":24,"y":5},"order":23,"id":"m_0_g_0_p_178"},{"point":{"x":24,"y":6},"order":24,"id":"m_0_g_0_p_179"},{"point":{"x":24,"y":7},"order":25,"id":"m_0_g_0_p_180"},{"point":{"x":25,"y":7},"order":26,"id":"m_0_g_0_p_183"},{"point":{"x":25,"y":6},"order":27,"id":"m_0_g_0_p_184"},{"point":{"x":25,"y":5},"order":28,"id":"m_0_g_0_p_185"},{"point":{"x":25,"y":4},"order":29,"id":"m_0_g_0_p_186"},{"point":{"x":25,"y":3},"order":30,"id":"m_0_g_0_p_187"},{"point":{"x":25,"y":2},"order":31,"id":"m_0_g_0_p_188"},{"point":{"x":20,"y":5},"order":32,"id":"m_0_g_0_p_189"},{"point":{"x":21,"y":5},"order":33,"id":"m_0_g_0_p_190"},{"point":{"x":22,"y":5},"order":34,"id":"m_0_g_0_p_191"},{"point":{"x":23,"y":5},"order":35,"id":"m_0_g_0_p_192"},{"point":{"x":23,"y":4},"order":36,"id":"m_0_g_0_p_193"},{"point":{"x":22,"y":4},"order":37,"id":"m_0_g_0_p_194"},{"point":{"x":21,"y":4},"order":38,"id":"m_0_g_0_p_195"},{"point":{"x":20,"y":4},"order":39,"id":"m_0_g_0_p_196"}]}]},{"order":3,"id":"m_4","name":"d","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_4","points":[{"point":{"x":28,"y":0},"order":0,"id":"m_0_g_0_p_197"},{"point":{"x":28,"y":1},"order":1,"id":"m_0_g_0_p_198"},{"point":{"x":28,"y":2},"order":2,"id":"m_0_g_0_p_199"},{"point":{"x":28,"y":3},"order":3,"id":"m_0_g_0_p_200"},{"point":{"x":28,"y":4},"order":4,"id":"m_0_g_0_p_201"},{"point":{"x":28,"y":5},"order":5,"id":"m_0_g_0_p_202"},{"point":{"x":28,"y":6},"order":6,"id":"m_0_g_0_p_203"},{"point":{"x":28,"y":7},"order":7,"id":"m_0_g_0_p_204"},{"point":{"x":29,"y":0},"order":8,"id":"m_0_g_0_p_205"},{"point":{"x":29,"y":1},"order":9,"id":"m_0_g_0_p_206"},{"point":{"x":29,"y":2},"order":10,"id":"m_0_g_0_p_207"},{"point":{"x":29,"y":3},"order":11,"id":"m_0_g_0_p_208"},{"point":{"x":29,"y":4},"order":12,"id":"m_0_g_0_p_209"},{"point":{"x":29,"y":5},"order":13,"id":"m_0_g_0_p_210"},{"point":{"x":29,"y":6},"order":14,"id":"m_0_g_0_p_211"},{"point":{"x":29,"y":7},"order":15,"id":"m_0_g_0_p_212"},{"point":{"x":30,"y":7},"order":16,"id":"m_0_g_0_p_213"},{"point":{"x":31,"y":7},"order":17,"id":"m_0_g_0_p_214"},{"point":{"x":31,"y":6},"order":18,"id":"m_0_g_0_p_215"},{"point":{"x":30,"y":6},"order":19,"id":"m_0_g_0_p_216"},{"point":{"x":30,"y":0},"order":20,"id":"m_0_g_0_p_217"},{"point":{"x":31,"y":0},"order":21,"id":"m_0_g_0_p_218"},{"point":{"x":31,"y":1},"order":22,"id":"m_0_g_0_p_219"},{"point":{"x":30,"y":1},"order":23,"id":"m_0_g_0_p_220"},{"point":{"x":32,"y":0},"order":24,"id":"m_0_g_0_p_221"},{"point":{"x":32,"y":1},"order":25,"id":"m_0_g_0_p_222"},{"point":{"x":33,"y":1},"order":26,"id":"m_0_g_0_p_223"},{"point":{"x":33,"y":0},"order":27,"id":"m_0_g_0_p_224"},{"point":{"x":32,"y":6},"order":28,"id":"m_0_g_0_p_226"},{"point":{"x":32,"y":7},"order":29,"id":"m_0_g_0_p_227"},{"point":{"x":33,"y":7},"order":30,"id":"m_0_g_0_p_228"},{"point":{"x":33,"y":6},"order":31,"id":"m_0_g_0_p_229"},{"point":{"x":34,"y":2},"order":32,"id":"m_0_g_0_p_230"},{"point":{"x":34,"y":3},"order":33,"id":"m_0_g_0_p_231"},{"point":{"x":34,"y":4},"order":34,"id":"m_0_g_0_p_232"},{"point":{"x":34,"y":5},"order":35,"id":"m_0_g_0_p_233"},{"point":{"x":35,"y":5},"order":36,"id":"m_0_g_0_p_234"},{"point":{"x":35,"y":4},"order":37,"id":"m_0_g_0_p_235"},{"point":{"x":35,"y":3},"order":38,"id":"m_0_g_0_p_236"},{"point":{"x":35,"y":2},"order":39,"id":"m_0_g_0_p_237"}]}]},{"order":4,"id":"m_5","name":"i","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_5","points":[{"point":{"x":38,"y":0},"order":0,"id":"m_0_g_0_p_238"},{"point":{"x":38,"y":1},"order":1,"id":"m_0_g_0_p_239"},{"point":{"x":39,"y":1},"order":2,"id":"m_0_g_0_p_240"},{"point":{"x":39,"y":0},"order":3,"id":"m_0_g_0_p_241"},{"point":{"x":40,"y":0},"order":4,"id":"m_0_g_0_p_242"},{"point":{"x":41,"y":0},"order":5,"id":"m_0_g_0_p_243"},{"point":{"x":41,"y":1},"order":6,"id":"m_0_g_0_p_244"},{"point":{"x":40,"y":1},"order":7,"id":"m_0_g_0_p_245"},{"point":{"x":42,"y":0},"order":8,"id":"m_0_g_0_p_246"},{"point":{"x":43,"y":0},"order":9,"id":"m_0_g_0_p_247"},{"point":{"x":43,"y":1},"order":10,"id":"m_0_g_0_p_248"},{"point":{"x":42,"y":1},"order":11,"id":"m_0_g_0_p_249"},{"point":{"x":40,"y":2},"order":12,"id":"m_0_g_0_p_250"},{"point":{"x":40,"y":3},"order":13,"id":"m_0_g_0_p_251"},{"point":{"x":40,"y":4},"order":14,"id":"m_0_g_0_p_252"},{"point":{"x":40,"y":5},"order":15,"id":"m_0_g_0_p_253"},{"point":{"x":40,"y":6},"order":16,"id":"m_0_g_0_p_254"},{"point":{"x":40,"y":7},"order":17,"id":"m_0_g_0_p_255"},{"point":{"x":41,"y":7},"order":18,"id":"m_0_g_0_p_256"},{"point":{"x":41,"y":6},"order":19,"id":"m_0_g_0_p_257"},{"point":{"x":41,"y":5},"order":20,"id":"m_0_g_0_p_258"},{"point":{"x":41,"y":4},"order":21,"id":"m_0_g_0_p_259"},{"point":{"x":41,"y":3},"order":22,"id":"m_0_g_0_p_260"},{"point":{"x":41,"y":2},"order":23,"id":"m_0_g_0_p_261"},{"point":{"x":39,"y":6},"order":24,"id":"m_0_g_0_p_262"},{"point":{"x":38,"y":6},"order":25,"id":"m_0_g_0_p_263"},{"point":{"x":38,"y":7},"order":26,"id":"m_0_g_0_p_265"},{"point":{"x":39,"y":7},"order":27,"id":"m_0_g_0_p_266"},{"point":{"x":42,"y":6},"order":28,"id":"m_0_g_0_p_267"},{"point":{"x":43,"y":6},"order":29,"id":"m_0_g_0_p_268"},{"point":{"x":43,"y":7},"order":30,"id":"m_0_g_0_p_269"},{"point":{"x":42,"y":7},"order":31,"id":"m_0_g_0_p_270"}]}]},{"order":5,"id":"m_6","name":"n","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_6","points":[{"point":{"x":46,"y":0},"order":0,"id":"m_0_g_0_p_271"},{"point":{"x":46,"y":1},"order":1,"id":"m_0_g_0_p_272"},{"point":{"x":46,"y":2},"order":2,"id":"m_0_g_0_p_273"},{"point":{"x":46,"y":3},"order":3,"id":"m_0_g_0_p_274"},{"point":{"x":46,"y":4},"order":4,"id":"m_0_g_0_p_275"},{"point":{"x":46,"y":5},"order":5,"id":"m_0_g_0_p_276"},{"point":{"x":46,"y":6},"order":6,"id":"m_0_g_0_p_277"},{"point":{"x":46,"y":7},"order":7,"id":"m_0_g_0_p_278"},{"point":{"x":47,"y":7},"order":8,"id":"m_0_g_0_p_279"},{"point":{"x":47,"y":6},"order":9,"id":"m_0_g_0_p_280"},{"point":{"x":47,"y":5},"order":10,"id":"m_0_g_0_p_281"},{"point":{"x":47,"y":4},"order":11,"id":"m_0_g_0_p_282"},{"point":{"x":47,"y":3},"order":12,"id":"m_0_g_0_p_283"},{"point":{"x":47,"y":2},"order":13,"id":"m_0_g_0_p_284"},{"point":{"x":47,"y":1},"order":14,"id":"m_0_g_0_p_285"},{"point":{"x":47,"y":0},"order":15,"id":"m_0_g_0_p_286"},{"point":{"x":48,"y":2},"order":16,"id":"m_0_g_0_p_287"},{"point":{"x":48,"y":3},"order":17,"id":"m_0_g_0_p_288"},{"point":{"x":49,"y":3},"order":18,"id":"m_0_g_0_p_289"},{"point":{"x":49,"y":2},"order":19,"id":"m_0_g_0_p_290"},{"point":{"x":50,"y":4},"order":20,"id":"m_0_g_0_p_291"},{"point":{"x":50,"y":5},"order":21,"id":"m_0_g_0_p_292"},{"point":{"x":51,"y":5},"order":22,"id":"m_0_g_0_p_293"},{"point":{"x":51,"y":4},"order":23,"id":"m_0_g_0_p_294"},{"point":{"x":52,"y":0},"order":24,"id":"m_0_g_0_p_295"},{"point":{"x":52,"y":1},"order":25,"id":"m_0_g_0_p_296"},{"point":{"x":52,"y":2},"order":26,"id":"m_0_g_0_p_297"},{"point":{"x":52,"y":3},"order":27,"id":"m_0_g_0_p_298"},{"point":{"x":52,"y":4},"order":28,"id":"m_0_g_0_p_299"},{"point":{"x":52,"y":5},"order":29,"id":"m_0_g_0_p_300"},{"point":{"x":52,"y":6},"order":30,"id":"m_0_g_0_p_301"},{"point":{"x":52,"y":7},"order":31,"id":"m_0_g_0_p_302"},{"point":{"x":53,"y":7},"order":32,"id":"m_0_g_0_p_303"},{"point":{"x":53,"y":6},"order":33,"id":"m_0_g_0_p_304"},{"point":{"x":53,"y":5},"order":34,"id":"m_0_g_0_p_305"},{"point":{"x":53,"y":4},"order":35,"id":"m_0_g_0_p_306"},{"point":{"x":53,"y":3},"order":36,"id":"m_0_g_0_p_307"},{"point":{"x":53,"y":2},"order":37,"id":"m_0_g_0_p_308"},{"point":{"x":53,"y":1},"order":38,"id":"m_0_g_0_p_309"},{"point":{"x":53,"y":0},"order":39,"id":"m_0_g_0_p_310"}]}]},{"order":6,"id":"m_7","name":"g","visible":true,"groups":[{"order":1,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_7","points":[{"point":{"x":56,"y":0},"order":0,"id":"m_0_g_0_p_311"},{"point":{"x":56,"y":1},"order":1,"id":"m_0_g_0_p_312"},{"point":{"x":56,"y":2},"order":2,"id":"m_0_g_0_p_313"},{"point":{"x":56,"y":3},"order":3,"id":"m_0_g_0_p_314"},{"point":{"x":56,"y":4},"order":4,"id":"m_0_g_0_p_315"},{"point":{"x":56,"y":5},"order":5,"id":"m_0_g_0_p_316"},{"point":{"x":56,"y":6},"order":6,"id":"m_0_g_0_p_317"},{"point":{"x":56,"y":7},"order":7,"id":"m_0_g_0_p_318"},{"point":{"x":57,"y":7},"order":8,"id":"m_0_g_0_p_319"},{"point":{"x":57,"y":6},"order":9,"id":"m_0_g_0_p_320"},{"point":{"x":57,"y":5},"order":10,"id":"m_0_g_0_p_321"},{"point":{"x":57,"y":4},"order":11,"id":"m_0_g_0_p_322"},{"point":{"x":57,"y":3},"order":12,"id":"m_0_g_0_p_323"},{"point":{"x":57,"y":2},"order":13,"id":"m_0_g_0_p_324"},{"point":{"x":57,"y":1},"order":14,"id":"m_0_g_0_p_325"},{"point":{"x":57,"y":0},"order":15,"id":"m_0_g_0_p_326"},{"point":{"x":58,"y":0},"order":16,"id":"m_0_g_0_p_327"},{"point":{"x":59,"y":0},"order":17,"id":"m_0_g_0_p_328"},{"point":{"x":59,"y":1},"order":18,"id":"m_0_g_0_p_329"},{"point":{"x":58,"y":1},"order":19,"id":"m_0_g_0_p_330"},{"point":{"x":60,"y":0},"order":20,"id":"m_0_g_0_p_331"},{"point":{"x":61,"y":0},"order":21,"id":"m_0_g_0_p_332"},{"point":{"x":61,"y":1},"order":22,"id":"m_0_g_0_p_333"},{"point":{"x":60,"y":1},"order":23,"id":"m_0_g_0_p_334"},{"point":{"x":62,"y":0},"order":24,"id":"m_0_g_0_p_335"},{"point":{"x":63,"y":0},"order":25,"id":"m_0_g_0_p_336"},{"point":{"x":63,"y":1},"order":26,"id":"m_0_g_0_p_337"},{"point":{"x":62,"y":1},"order":27,"id":"m_0_g_0_p_338"},{"point":{"x":58,"y":6},"order":28,"id":"m_0_g_0_p_339"},{"point":{"x":59,"y":6},"order":29,"id":"m_0_g_0_p_340"},{"point":{"x":60,"y":6},"order":30,"id":"m_0_g_0_p_341"},{"point":{"x":61,"y":6},"order":31,"id":"m_0_g_0_p_342"},{"point":{"x":62,"y":6},"order":32,"id":"m_0_g_0_p_343"},{"point":{"x":63,"y":6},"order":33,"id":"m_0_g_0_p_344"},{"point":{"x":63,"y":7},"order":34,"id":"m_0_g_0_p_345"},{"point":{"x":62,"y":7},"order":35,"id":"m_0_g_0_p_346"},{"point":{"x":61,"y":7},"order":36,"id":"m_0_g_0_p_347"},{"point":{"x":60,"y":7},"order":37,"id":"m_0_g_0_p_348"},{"point":{"x":59,"y":7},"order":38,"id":"m_0_g_0_p_349"},{"point":{"x":58,"y":7},"order":39,"id":"m_0_g_0_p_350"},{"point":{"x":62,"y":5},"order":40,"id":"m_0_g_0_p_351"},{"point":{"x":62,"y":4},"order":41,"id":"m_0_g_0_p_352"},{"point":{"x":63,"y":5},"order":42,"id":"m_0_g_0_p_353"},{"point":{"x":63,"y":4},"order":43,"id":"m_0_g_0_p_354"}]}]}]}}

        let flipYOrigign = fast.r(size.y/2 + 8);
        let letterImagesPositionShift = new V2(fast.r(size.x/2) - 64/2, fast.r(size.y/2))
        let letterImages = lettersModel.main.layers.map(l => {
            let letterDots = animationHelpers.extractPointData(l)
            let awailableDots = letterDots.filter(pData => pData.point.y < 1)
                .map(pData => new V2(pData.point).add(letterImagesPositionShift).add(new V2(0, 0)));
            
            return {
                awailableDots,
                letterDots,
                letterDotsShifted: letterDots.map(p => new V2(p.point).add(letterImagesPositionShift).add(new V2(0, 1))),
                flippedLetterDots: letterDots.map(p => new V2(p.point).add(letterImagesPositionShift).add(new V2(0, -1))).map(p => flipY(p, flipYOrigign)),
                frames: [],
                img: PP.createImage(lettersModel, {renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#6dafbf' } }}),
            }
        })


        let frames = [];
        
        let xClamps = [50, 150];
        let targetY = 100;
        

        let mainMidPointShiftClamps = [10, 30];
        let resultMidPointXShiftClamps = [-10, 10];
        let resultMidPointYShiftClamps = [-5, 5];
        let innerDotsCountClamp = [6,8]

        let animationStepFramesLength = 3;

        let sharedPP; 
        createCanvas(new V2(1,1), (ctx, size, hlp) => {
            sharedPP = new PP({ctx})
        })

        let awailableLetters = [...letterImages];

        let farSnowItemsData = new Array(800).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = getRandomInt(200, 250);

            let start = new V2(getRandomInt(-30, size.x), getRandomInt(-10, 0));
            let end = new V2(start.x + getRandomInt(15, 25), size.y/2 + 8 + 1);
            let lineDots = sharedPP.lineV2(start, end);
            let indexValues = easing.fast({from: 0, to: lineDots.length-1, steps: totalFrames, type: 'linear', round: 0});

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                frames[frameIndex] = {
                    visible: false,
                    p: new V2(lineDots[indexValues[f]])
                };
            }
        
            return {
                frames
            }
        })

        let snowItemsData = new Array(500).fill().map((el, i) => {
            let startFrameIndex = getRandomInt(0, framesCount-1);
            let totalFrames = getRandomInt(100, 150);

            let start = new V2(getRandomInt(-30, size.x), getRandomInt(-10, 0));
            let end = new V2(start.x + getRandomInt(20, 30), size.y/2 + 8 + 1);
            let lineDots = sharedPP.lineV2(start, end);
            let indexValues = easing.fast({from: 0, to: lineDots.length-1, steps: totalFrames, type: 'linear', round: 0});

            let frames = [];
            for(let f = 0; f < totalFrames; f++){
                let frameIndex = f + startFrameIndex;
                if(frameIndex > (framesCount-1)){
                    frameIndex-=framesCount;
                }

                frames[frameIndex] = {
                    visible: false,
                    p: new V2(lineDots[indexValues[f]])
                };
            }
        
            return {
                frames
            }
        })

        let checkSnowVisibility = (p, frameIndex) => {
            snowItemsData.forEach(sd => {
                let frameData = sd.frames[frameIndex];

                if(frameData){
                    if(frameData.p.distance(p) < 10){
                        frameData.visible = true;
                    }
                }
            })
        }

        let awailableTimeSlotsLength = itemsCount;
        let awailableTimeSlots = new Array(awailableTimeSlotsLength).fill().map((el, i) => i);

        let itemsData = new Array(itemsCount).fill().map((el, i) => {
            let target = undefined;
            let start = undefined;

            let startFrameIndex = getRandomInt(0, framesCount-1);

            // let timeSlotIndex = getRandomInt(0, awailableTimeSlots.length-1);
            // let timeSlot = awailableTimeSlots[timeSlotIndex];
            let timeSlot = awailableTimeSlots.pop();
            //awailableTimeSlots.splice(timeSlotIndex, 1);

            if(awailableTimeSlots.length == 0){
                awailableTimeSlots = new Array(awailableTimeSlotsLength).fill().map((el, i) => i);
            }
            
            startFrameIndex = getRandomInt(framesCount*(timeSlot/awailableTimeSlotsLength), (timeSlot == awailableTimeSlotsLength-1 ? framesCount-1 : framesCount*(timeSlot+1)/awailableTimeSlotsLength));

            console.log(startFrameIndex)

            let totalFrames = itemFrameslength;

            let targetLetter = undefined;
            let hTarget = false;
            let showParticles = false;
            if(getRandomBool()) {
                let lIndex = getRandomInt(0, awailableLetters.length-1);
                targetLetter = awailableLetters[lIndex];
    
                awailableLetters.splice(lIndex, 1);
                if(awailableLetters.length == 0){
                    awailableLetters = [...letterImages];
                }
    
                target = targetLetter.awailableDots[getRandomInt(0, targetLetter.awailableDots.length-1)];
                showParticles = true;
            }
            else {
                hTarget = true;
                target = getRandomBool() ? 
                new V2(getRandomInt(0, size.x/2 - (64/2) - 10), size.y/2 + 8) 
                : new V2(getRandomInt(size.x/2 + (64/2) + 10, size.x), size.y/2 + 8) 
                //start = getRandomBool() ? new V2(getRandomInt(-10, size.x/2 - (64/2) - 10), -10) : new V2(getRandomInt(-10, size.x/2 + (64/2) + 10), -10)
                //new V2(start.x + getRandomInt(-10, 10), size.y/2 + 8);
            }
            
            start = new V2(target.x + getRandomInt(-10, 10), -10);

            let mainMidPointRotationDirection =  getRandomBool() ? 1 : -1;

            let path1 = this.generatePath({ mainMidPointRotationDirection, start, target, sharedPP, xClamps, targetY, mainMidPointShiftClamps, resultMidPointXShiftClamps, resultMidPointYShiftClamps, innerDotsCountClamp });
            let path2 = this.generatePath({ mainMidPointRotationDirection, start, target, sharedPP, xClamps, targetY, mainMidPointShiftClamps, resultMidPointXShiftClamps, resultMidPointYShiftClamps, innerDotsCountClamp });
            
            let flippedPath1 = path1.resultPoints.map(p => flipY(p, flipYOrigign))
            let flippedPath2 = path2.resultPoints.map(p => flipY(p, flipYOrigign))

            let frames = [];

            //step 0
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex+ animationStepFramesLength*0, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 1
            let step1Path1MaxIndex = fast.r(path1.resultPoints.length*getRandom(0.4, 0.6));
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 1,
                    params: {
                        path1MaxIndex: step1Path1MaxIndex,
                        path1Color: '#8BE4EC'
                    }
                };
                
                path1.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })
                

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 2
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex+ animationStepFramesLength*2, framesCount);
        
                frames[frameIndex] = undefined;
            }

             //step 3
             for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*3, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 3,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: '#8BE4EC'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path1.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 4
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex+ animationStepFramesLength*4, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 5
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*5, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 5,
                    params: {
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: '#8BE4EC'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path2.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 6
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex+ animationStepFramesLength*6, framesCount);
        
                frames[frameIndex] = undefined;
            }

            //step 7
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*7, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 7,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: '#8BE4EC'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path1.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            let particlesFallStartFramesIndex = undefined;
            //step 8
            let cornersData = path1.resultMidPointsIndices.map(index => {
                let p = new V2(path1.resultPoints[index]);
                let prev = new V2(path1.resultPoints[index-1]);
                let dir = prev.direction(p);

                let c1 = p;
                let c2 = p.add(dir.mul(getRandom(1,3))).toInt();
                let c3 = new V2(path1.resultPoints[index + getRandomInt(2,5)]);

                if(c3.x ==0 && c3.y == 0){
                    c3 = new V2(path1.resultPoints[index - getRandomInt(1,3)])
                }

                return [c1, c2, c3];
            })

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*8, framesCount);
                particlesFallStartFramesIndex = frameIndex + animationStepFramesLength;

                frames[frameIndex] = {
                    stepIndex: 8,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: '#F0FAFC',
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: '#6dafbf',
                        cornersData, 
                        cornersColor: '#8BE4EC'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path1.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                path2.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 9
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*9, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 9,
                    params: {
                        path2MaxIndex: path2.resultPoints.length,
                        path2Color: '#6dafbf'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path2.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 10
            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*10, framesCount);
        
                frames[frameIndex] = {
                    stepIndex: 10,
                    params: {
                        path1MaxIndex: path1.resultPoints.length,
                        path1Color: '#8BE4EC',
                        cornersData, 
                        cornersColor: '#8BE4EC'
                    },
                    hTarget: hTarget ? {} : undefined
                };

                path1.resultMidPoints.forEach(mp => {
                    checkSnowVisibility(mp, frameIndex)
                })

                if(targetLetter)
                    targetLetter.frames[frameIndex] = {}
            }

            //step 11
            let step11Dots = []
            cornersData.forEach(cd => {
                step11Dots.push(...sharedPP.fillByCornerPoints(cd))
            })

            let innerDotsPartsCount = getRandomInt(3,5);
            for(let i = 0; i < innerDotsPartsCount; i++){
                let index = getRandomInt(10, path1.resultPoints.length-10);
                let dotsCount = getRandomInt(3, 5);
                let direction = getRandomBool() ? 1: -1;
                for(let j = 0; j < dotsCount; j++){
                    step11Dots.push(path1.resultPoints[index + direction*j])
                }
            }

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*11, framesCount);

                frames[frameIndex] = {
                    stepIndex: 11,
                    params: {
                        dots: step11Dots,
                        dotsColor: '#8BE4EC'
                    }
                }
            }

            //step 12
            let step12Dots = [...step11Dots];
            let removeCount = fast.r(step12Dots.length/2);
            while(removeCount--){
                let index = getRandomInt(0, step12Dots.length-1);
                step12Dots.splice(index, 1);
            }

            for(let f = 0; f < animationStepFramesLength; f++){
                let frameIndex = this.getFrameIndex(f, startFrameIndex + animationStepFramesLength*12, framesCount);

                frames[frameIndex] = {
                    stepIndex: 12,
                    params: {
                        dots: step12Dots,
                        dotsColor: '#8BE4EC'
                    }
                }
            }

            let particlesItemsData = new Array(getRandomInt(3,5)).fill().map((el, i) => {
                let startFrameIndex = particlesFallStartFramesIndex; //getRandomInt(0, framesCount-1);
                let totalFrames = getRandomInt(30, 60);
            
                //let p = target.add(, ));
                let x = target.x  + getRandomInt(-2, 2);
                let y= target.y + getRandomInt(-1,1);
                let xAcceleration = 0.025;
                let xSpeed = getRandom(0.1, 0.3);
                let yAcceleration = 0.025;
                let ySpeed = getRandom(0.3, 0.6);
                if(x < target.x){
                    xSpeed = -getRandom(0.1, 0.2);
                }

                if(x > target.x){
                    xSpeed = getRandom(0.1, 0.2);
                }

                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    y += ySpeed;
                    x += xSpeed;

                    let color = '#8BE4EC';
                    if(f < totalFrames/3){
                        color = '#F0FAFC'
                    }
                    if(f > totalFrames*2/3){
                        color = '#6dafbf'
                    }

                    frames[frameIndex] = {
                        color,
                        p: new V2(x, y).toInt()
                    };

                    ySpeed+=yAcceleration;

                    if(xSpeed < 0){
                        xSpeed+=0.005
                        if(xSpeed > 0)
                            xSpeed = 0;
                    }

                    if(xSpeed > 0){
                        xSpeed-=0.005
                        if(xSpeed < 0)
                            xSpeed = 0;
                    }
                }
            
                return {
                    frames
                }
            })
        
            return {
                path1,
                path2,
                flippedPath1,
                flippedPath2,
                flipedPathColor: '#1c2c30',
                particlesItemsData,
                frames,
                target,
                showParticles
            }
        })

        for(let f = 0; f < framesCount; f++){
            frames[f] = createCanvas(size, (ctx, size, hlp) => {
                for(let p = 0; p < farSnowItemsData.length; p++){
                    let itemData = farSnowItemsData[p];

                    

                    if(itemData.frames[f] ){
                        hlp.setFillColor('#0e1618')
                        hlp.dot(itemData.frames[f].p)

                        hlp.setFillColor('#070b0c');
                        hlp.dot(flipY(itemData.frames[f].p, flipYOrigign))
                    }

                    
                }

                for(let p = 0; p < snowItemsData.length; p++){
                    let itemData = snowItemsData[p];
                    //hlp.setFillColor('#1c2c30')
                    
                    if(itemData.frames[f] ){
                        hlp.setFillColor('#1c2c30');
                        if(itemData.frames[f].visible) {
                            //hlp.setFillColor('#375860')
                            hlp.setFillColor('#6dafbf')
                        }

                        hlp.dot(itemData.frames[f].p)
                        

                        hlp.setFillColor('#0e1618')
                        if(itemData.frames[f].visible) {
                            hlp.setFillColor('#1c2c30');
                        }
                        hlp.dot(flipY(itemData.frames[f].p, flipYOrigign))
                    }
                }


                hlp.setFillColor('#111111').rect(0, size.y/2 + 8 + 1, size.x, 1)

                letterImages.forEach(lImageData => {

                    hlp.setFillColor('#1c2c30');
                    lImageData.letterDotsShifted.forEach(d => hlp.dot(d))

                    hlp.setFillColor('#0e1618')
                    lImageData.flippedLetterDots.forEach(d => hlp.dot(d))

                    if(lImageData.frames[f]) {
                        ctx.drawImage(lImageData.img, fast.r(size.x/2) - 64/2, fast.r(size.y/2) + 1)

                        hlp.setFillColor('#1c2c30');
                        lImageData.flippedLetterDots.forEach(d => hlp.dot(d));
                    }
                    
                })

                for(let p = 0; p < itemsData.length; p++){
                    let itemData = itemsData[p];
                    
                    if(itemData.frames[f]){
                        switch(itemData.frames[f].stepIndex){
                            case 1:
                            case 3:
                            case 7:
                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }

                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.flipedPathColor).dot(itemData.flippedPath1[i])
                                }
                                break;
                            case 5:
                            case 9:
                                for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                }

                                for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                    hlp.setFillColor(itemData.flipedPathColor).dot(itemData.flippedPath2[i])
                                }
                                break;
                            case 8:
                            case 10:
                                if(itemData.frames[f].params.path2MaxIndex) {
                                    for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                        hlp.setFillColor(itemData.frames[f].params.path2Color).dot(itemData.path2.resultPoints[i])
                                    }

                                    for(let i = 0; i < itemData.frames[f].params.path2MaxIndex; i++){
                                        hlp.setFillColor(itemData.flipedPathColor).dot(itemData.flippedPath2[i])
                                    }
                                }

                                let pp = new PP({ctx});

                                itemData.frames[f].params.cornersData.forEach(cd => {
                                    pp.setFillStyle(itemData.frames[f].params.cornersColor);
                                    pp.fillByCornerPoints(cd)
                                })

                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.frames[f].params.path1Color).dot(itemData.path1.resultPoints[i])
                                }

                                for(let i = 0; i < itemData.frames[f].params.path1MaxIndex; i++){
                                    hlp.setFillColor(itemData.flipedPathColor).dot(itemData.flippedPath1[i])
                                }
                                break;
                            case 11:
                            case 12:
                                for(let i = 0; i < itemData.frames[f].params.dots.length; i++){
                                    hlp.setFillColor(itemData.frames[f].params.dotsColor).dot(itemData.frames[f].params.dots[i])
                                }
                                break;
                            default:
                                break;
                        }

                        if(itemData.frames[f].hTarget) {
                            let width = getRandomInt(10, 20);
                            hlp.setFillColor('#6dafbf').rect(itemData.target.x - fast.r(width/2), itemData.target.y + 1, width, 1)
                        }
                        //itemData.path1.resultPoints.forEach(mp => hlp.dot(mp))
                    }

                    if(itemData.showParticles) {
                        for(let p = 0; p < itemData.particlesItemsData.length; p++){
                            let pItemData = itemData.particlesItemsData[p];
                    
                            if(pItemData.frames[f]){
                                if(pItemData.frames[f].p.y < size.y/2 + 11)
                                    hlp.setFillColor(pItemData.frames[f].color).dot(pItemData.frames[f].p)
                            }
                        }
                    }
                    
                    
                }
            });
        }
        
        return frames;
    }

    // createnameFrames({framesCount, itemsCount, itemFrameslength, size}) {
    //     let frames = [];
        
    //     let itemsData = new Array(itemsCount).fill().map((el, i) => {
    //         let startFrameIndex = getRandomInt(0, framesCount-1);
    //         let totalFrames = itemFrameslength;
        
    //         let frames = [];
    //         for(let f = 0; f < totalFrames; f++){
    //             let frameIndex = f + startFrameIndex;
    //             if(frameIndex > (framesCount-1)){
    //                 frameIndex-=framesCount;
    //             }
        
    //             frames[frameIndex] = {
        
    //             };
    //         }
        
    //         return {
    //             frames
    //         }
    //     })
        
    //     for(let f = 0; f < framesCount; f++){
    //         frames[f] = createCanvas(size, (ctx, size, hlp) => {
    //             for(let p = 0; p < itemsData.length; p++){
    //                 let itemData = itemsData[p];
                    
    //                 if(itemData.frames[f]){
        
    //                 }
                    
    //             }
    //         });
    //     }
        
    //     return frames;
    // }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(this.viewport, (ctx, size, hlp) => {
                hlp.setFillColor('black').rect(0,0,size.x, size.y)
            })
        }), 0)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.frames = this.parentScene.createLightningFrames({ framesCount: 600, itemsCount: 20, itemFrameslength: 50, size: this.size });
                let repeat = 1;
                this.registerFramesDefaultTimer({
                    framesChangeCallback: () => {
                        let a = 10;
                    },
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