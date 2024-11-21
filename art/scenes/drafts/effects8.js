class Effects8Scene extends Scene {
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
                size: new V2(160,200).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'effects8',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderAddGo({color: 'black'})
    }

    start() {
        //let model = Effects8Scene.models.main;
        let whiteColorPrefix = 'rgba(255,255,255,';
        let appSharedPP = PP.createNonDrawingInstance();
        let lettersModel = { "general": { "originalSize": { "x": 50, "y": 20 }, "size": { "x": 50, "y": 20 }, "zoom": 8, "showGrid": false, "renderOptimization": false, "disableLayerImageOptimization": false, "animated": false, "backgroundColor": "#000000", "palettes": [] }, "main": { "layers": [{ "order": 0, "id": "m_0", "name": "", "visible": true, "groups": [{ "order": 0, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": false, "replace": false, "id": "m_0_g_0", "points": [{ "point": { "x": 4, "y": 4 }, "order": 0, "id": "m_0_g_0_p_0" }, { "point": { "x": 7, "y": 4 }, "order": 1, "id": "m_0_g_0_p_1" }, { "point": { "x": 7, "y": 8 }, "order": 2, "id": "m_0_g_0_p_2" }, { "point": { "x": 9, "y": 8 }, "order": 3, "id": "m_0_g_0_p_3" }, { "point": { "x": 9, "y": 4 }, "order": 4, "id": "m_0_g_0_p_4" }, { "point": { "x": 12, "y": 4 }, "order": 5, "id": "m_0_g_0_p_5" }, { "point": { "x": 12, "y": 14 }, "order": 6, "id": "m_0_g_0_p_6" }, { "point": { "x": 9, "y": 14 }, "order": 7, "id": "m_0_g_0_p_7" }, { "point": { "x": 9, "y": 10 }, "order": 8, "id": "m_0_g_0_p_8" }, { "point": { "x": 7, "y": 10 }, "order": 9, "id": "m_0_g_0_p_9" }, { "point": { "x": 7, "y": 14 }, "order": 10, "id": "m_0_g_0_p_10" }, { "point": { "x": 4, "y": 14 }, "order": 11, "id": "m_0_g_0_p_11" }] }, { "order": 1, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": false, "replace": false, "id": "m_0_g_1", "points": [{ "point": { "x": 14, "y": 4 }, "order": 0, "id": "m_0_g_1_p_0" }, { "point": { "x": 14, "y": 14 }, "order": 1, "id": "m_0_g_1_p_1" }, { "point": { "x": 20, "y": 14 }, "order": 2, "id": "m_0_g_1_p_2" }, { "point": { "x": 20, "y": 12 }, "order": 3, "id": "m_0_g_1_p_3" }, { "point": { "x": 16, "y": 12 }, "order": 4, "id": "m_0_g_1_p_4" }, { "point": { "x": 16, "y": 10 }, "order": 5, "id": "m_0_g_1_p_5" }, { "point": { "x": 18, "y": 10 }, "order": 6, "id": "m_0_g_1_p_6" }, { "point": { "x": 18, "y": 8 }, "order": 7, "id": "m_0_g_1_p_7" }, { "point": { "x": 16, "y": 8 }, "order": 8, "id": "m_0_g_1_p_8" }, { "point": { "x": 16, "y": 6 }, "order": 9, "id": "m_0_g_1_p_9" }, { "point": { "x": 20, "y": 6 }, "order": 10, "id": "m_0_g_1_p_10" }, { "point": { "x": 20, "y": 4 }, "order": 11, "id": "m_0_g_1_p_11" }] }, { "order": 2, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": false, "replace": false, "id": "m_0_g_2", "points": [{ "point": { "x": 22, "y": 4 }, "order": 0, "id": "m_0_g_2_p_0" }, { "point": { "x": 22, "y": 14 }, "order": 1, "id": "m_0_g_2_p_1" }, { "point": { "x": 28, "y": 14 }, "order": 2, "id": "m_0_g_2_p_2" }, { "point": { "x": 28, "y": 12 }, "order": 3, "id": "m_0_g_2_p_3" }, { "point": { "x": 25, "y": 12 }, "order": 4, "id": "m_0_g_2_p_4" }, { "point": { "x": 25, "y": 4 }, "order": 5, "id": "m_0_g_2_p_5" }] }, { "order": 3, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": false, "replace": false, "id": "m_0_g_3", "points": [{ "point": { "x": 30, "y": 4 }, "order": 0, "id": "m_0_g_2_p_0" }, { "point": { "x": 30, "y": 14 }, "order": 1, "id": "m_0_g_2_p_1" }, { "point": { "x": 36, "y": 14 }, "order": 2, "id": "m_0_g_2_p_2" }, { "point": { "x": 36, "y": 12 }, "order": 3, "id": "m_0_g_2_p_3" }, { "point": { "x": 33, "y": 12 }, "order": 4, "id": "m_0_g_2_p_4" }, { "point": { "x": 33, "y": 4 }, "order": 5, "id": "m_0_g_2_p_5" }] }, { "order": 4, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": false, "replace": false, "id": "m_0_g_4", "points": [{ "point": { "x": 40, "y": 4 }, "order": 0, "id": "m_0_g_4_p_8" }, { "point": { "x": 39, "y": 4 }, "order": 1, "id": "m_0_g_4_p_9" }, { "point": { "x": 38, "y": 5 }, "order": 2, "id": "m_0_g_4_p_10" }, { "point": { "x": 38, "y": 12 }, "order": 3, "id": "m_0_g_4_p_11" }, { "point": { "x": 39, "y": 14 }, "order": 4, "id": "m_0_g_4_p_12" }, { "point": { "x": 40, "y": 14 }, "order": 5, "id": "m_0_g_4_p_13" }, { "point": { "x": 42, "y": 14 }, "order": 6, "id": "m_0_g_4_p_14" }, { "point": { "x": 43, "y": 14 }, "order": 7, "id": "m_0_g_4_p_15" }, { "point": { "x": 44, "y": 13 }, "order": 8, "id": "m_0_g_4_p_16" }, { "point": { "x": 44, "y": 5 }, "order": 9, "id": "m_0_g_4_p_17" }, { "point": { "x": 43, "y": 4 }, "order": 10, "id": "m_0_g_4_p_18" }, { "point": { "x": 42, "y": 4 }, "order": 11, "id": "m_0_g_4_p_19" }] }, { "order": 5, "type": "lines", "strokeColor": "#FF0000", "strokeColorOpacity": 1, "fillColor": "#FF0000", "fillColorOpacity": 1, "closePath": true, "fill": true, "fillPattern": false, "patternType": "type1", "numOfSegments": 16, "visible": true, "clear": true, "replace": false, "id": "m_0_g_5", "points": [{ "point": { "x": 41, "y": 7 }, "order": 0, "id": "m_0_g_5_p_16" }, { "point": { "x": 41, "y": 11 }, "order": 1, "id": "m_0_g_5_p_17" }] }] }] } }

        let fireLettersSecondRow = {"general":{"originalSize":{"x":80,"y":20},"size":{"x":80,"y":20},"zoom":2,"showGrid":false,"renderOptimization":false,"disableLayerImageOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"","visible":true,"groups":[{"order":0,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_0","points":[{"point":{"x":1,"y":7},"order":0,"id":"m_0_g_0_p_42"},{"point":{"x":1,"y":8},"order":1,"id":"m_0_g_0_p_43"},{"point":{"x":1,"y":9},"order":2,"id":"m_0_g_0_p_44"},{"point":{"x":1,"y":10},"order":3,"id":"m_0_g_0_p_45"},{"point":{"x":1,"y":11},"order":4,"id":"m_0_g_0_p_46"},{"point":{"x":1,"y":12},"order":5,"id":"m_0_g_0_p_47"},{"point":{"x":2,"y":12},"order":6,"id":"m_0_g_0_p_48"},{"point":{"x":2,"y":11},"order":7,"id":"m_0_g_0_p_49"},{"point":{"x":2,"y":10},"order":8,"id":"m_0_g_0_p_50"},{"point":{"x":2,"y":9},"order":9,"id":"m_0_g_0_p_51"},{"point":{"x":2,"y":8},"order":10,"id":"m_0_g_0_p_52"},{"point":{"x":2,"y":7},"order":11,"id":"m_0_g_0_p_53"},{"point":{"x":3,"y":10},"order":12,"id":"m_0_g_0_p_54"},{"point":{"x":4,"y":10},"order":13,"id":"m_0_g_0_p_55"},{"point":{"x":4,"y":11},"order":14,"id":"m_0_g_0_p_56"},{"point":{"x":3,"y":11},"order":15,"id":"m_0_g_0_p_57"},{"point":{"x":1,"y":13},"order":16,"id":"m_0_g_0_p_58"},{"point":{"x":2,"y":13},"order":17,"id":"m_0_g_0_p_59"},{"point":{"x":5,"y":10},"order":18,"id":"m_0_g_0_p_60"},{"point":{"x":5,"y":11},"order":19,"id":"m_0_g_0_p_61"},{"point":{"x":6,"y":13},"order":20,"id":"m_0_g_0_p_62"},{"point":{"x":6,"y":12},"order":21,"id":"m_0_g_0_p_63"},{"point":{"x":6,"y":11},"order":22,"id":"m_0_g_0_p_64"},{"point":{"x":6,"y":10},"order":23,"id":"m_0_g_0_p_65"},{"point":{"x":6,"y":9},"order":24,"id":"m_0_g_0_p_66"},{"point":{"x":6,"y":8},"order":25,"id":"m_0_g_0_p_67"},{"point":{"x":6,"y":7},"order":26,"id":"m_0_g_0_p_68"},{"point":{"x":7,"y":7},"order":27,"id":"m_0_g_0_p_69"},{"point":{"x":7,"y":8},"order":28,"id":"m_0_g_0_p_70"},{"point":{"x":7,"y":9},"order":29,"id":"m_0_g_0_p_71"},{"point":{"x":7,"y":10},"order":30,"id":"m_0_g_0_p_72"},{"point":{"x":7,"y":11},"order":31,"id":"m_0_g_0_p_73"},{"point":{"x":7,"y":13},"order":32,"id":"m_0_g_0_p_74"},{"point":{"x":7,"y":12},"order":33,"id":"m_0_g_0_p_75"},{"point":{"x":9,"y":8},"order":34,"id":"m_0_g_0_p_113"},{"point":{"x":9,"y":9},"order":35,"id":"m_0_g_0_p_114"},{"point":{"x":9,"y":10},"order":36,"id":"m_0_g_0_p_115"},{"point":{"x":9,"y":11},"order":37,"id":"m_0_g_0_p_116"},{"point":{"x":9,"y":12},"order":38,"id":"m_0_g_0_p_117"},{"point":{"x":10,"y":7},"order":39,"id":"m_0_g_0_p_118"},{"point":{"x":10,"y":8},"order":40,"id":"m_0_g_0_p_119"},{"point":{"x":10,"y":9},"order":41,"id":"m_0_g_0_p_120"},{"point":{"x":10,"y":10},"order":42,"id":"m_0_g_0_p_121"},{"point":{"x":10,"y":11},"order":43,"id":"m_0_g_0_p_122"},{"point":{"x":10,"y":12},"order":44,"id":"m_0_g_0_p_123"},{"point":{"x":10,"y":13},"order":45,"id":"m_0_g_0_p_124"},{"point":{"x":11,"y":8},"order":46,"id":"m_0_g_0_p_125"},{"point":{"x":12,"y":8},"order":47,"id":"m_0_g_0_p_126"},{"point":{"x":13,"y":8},"order":48,"id":"m_0_g_0_p_127"},{"point":{"x":11,"y":7},"order":49,"id":"m_0_g_0_p_128"},{"point":{"x":12,"y":7},"order":50,"id":"m_0_g_0_p_129"},{"point":{"x":13,"y":7},"order":51,"id":"m_0_g_0_p_130"},{"point":{"x":14,"y":8},"order":52,"id":"m_0_g_0_p_131"},{"point":{"x":14,"y":9},"order":53,"id":"m_0_g_0_p_132"},{"point":{"x":14,"y":10},"order":54,"id":"m_0_g_0_p_133"},{"point":{"x":14,"y":11},"order":55,"id":"m_0_g_0_p_134"},{"point":{"x":11,"y":12},"order":56,"id":"m_0_g_0_p_135"},{"point":{"x":12,"y":12},"order":57,"id":"m_0_g_0_p_136"},{"point":{"x":13,"y":12},"order":58,"id":"m_0_g_0_p_137"},{"point":{"x":14,"y":12},"order":59,"id":"m_0_g_0_p_138"},{"point":{"x":11,"y":13},"order":60,"id":"m_0_g_0_p_139"},{"point":{"x":12,"y":13},"order":61,"id":"m_0_g_0_p_140"},{"point":{"x":13,"y":13},"order":62,"id":"m_0_g_0_p_141"},{"point":{"x":14,"y":13},"order":63,"id":"m_0_g_0_p_142"},{"point":{"x":14,"y":7},"order":64,"id":"m_0_g_0_p_143"},{"point":{"x":15,"y":8},"order":65,"id":"m_0_g_0_p_144"},{"point":{"x":15,"y":9},"order":66,"id":"m_0_g_0_p_145"},{"point":{"x":15,"y":10},"order":67,"id":"m_0_g_0_p_146"},{"point":{"x":15,"y":11},"order":68,"id":"m_0_g_0_p_147"},{"point":{"x":15,"y":12},"order":69,"id":"m_0_g_0_p_148"},{"point":{"x":17,"y":7},"order":70,"id":"m_0_g_0_p_149"},{"point":{"x":17,"y":8},"order":71,"id":"m_0_g_0_p_150"},{"point":{"x":17,"y":9},"order":72,"id":"m_0_g_0_p_151"},{"point":{"x":17,"y":10},"order":73,"id":"m_0_g_0_p_152"},{"point":{"x":17,"y":11},"order":74,"id":"m_0_g_0_p_153"},{"point":{"x":17,"y":12},"order":75,"id":"m_0_g_0_p_154"},{"point":{"x":17,"y":13},"order":76,"id":"m_0_g_0_p_155"},{"point":{"x":18,"y":13},"order":77,"id":"m_0_g_0_p_156"},{"point":{"x":18,"y":12},"order":78,"id":"m_0_g_0_p_157"},{"point":{"x":18,"y":11},"order":79,"id":"m_0_g_0_p_158"},{"point":{"x":18,"y":10},"order":80,"id":"m_0_g_0_p_159"},{"point":{"x":18,"y":9},"order":81,"id":"m_0_g_0_p_160"},{"point":{"x":18,"y":8},"order":82,"id":"m_0_g_0_p_161"},{"point":{"x":18,"y":7},"order":83,"id":"m_0_g_0_p_162"},{"point":{"x":19,"y":12},"order":84,"id":"m_0_g_0_p_163"},{"point":{"x":19,"y":11},"order":85,"id":"m_0_g_0_p_164"},{"point":{"x":20,"y":10},"order":86,"id":"m_0_g_0_p_165"},{"point":{"x":20,"y":11},"order":87,"id":"m_0_g_0_p_166"},{"point":{"x":21,"y":11},"order":88,"id":"m_0_g_0_p_167"},{"point":{"x":21,"y":12},"order":89,"id":"m_0_g_0_p_168"},{"point":{"x":22,"y":7},"order":90,"id":"m_0_g_0_p_170"},{"point":{"x":22,"y":8},"order":91,"id":"m_0_g_0_p_171"},{"point":{"x":22,"y":9},"order":92,"id":"m_0_g_0_p_172"},{"point":{"x":22,"y":10},"order":93,"id":"m_0_g_0_p_173"},{"point":{"x":22,"y":11},"order":94,"id":"m_0_g_0_p_174"},{"point":{"x":22,"y":12},"order":95,"id":"m_0_g_0_p_175"},{"point":{"x":22,"y":13},"order":96,"id":"m_0_g_0_p_176"},{"point":{"x":23,"y":13},"order":97,"id":"m_0_g_0_p_177"},{"point":{"x":23,"y":12},"order":98,"id":"m_0_g_0_p_178"},{"point":{"x":23,"y":11},"order":99,"id":"m_0_g_0_p_179"},{"point":{"x":23,"y":10},"order":100,"id":"m_0_g_0_p_180"},{"point":{"x":23,"y":9},"order":101,"id":"m_0_g_0_p_181"},{"point":{"x":23,"y":8},"order":102,"id":"m_0_g_0_p_182"},{"point":{"x":23,"y":7},"order":103,"id":"m_0_g_0_p_183"},{"point":{"x":26,"y":13},"order":104,"id":"m_0_g_0_p_184"},{"point":{"x":26,"y":12},"order":105,"id":"m_0_g_0_p_185"},{"point":{"x":26,"y":11},"order":106,"id":"m_0_g_0_p_186"},{"point":{"x":26,"y":10},"order":107,"id":"m_0_g_0_p_187"},{"point":{"x":26,"y":9},"order":108,"id":"m_0_g_0_p_188"},{"point":{"x":26,"y":8},"order":109,"id":"m_0_g_0_p_189"},{"point":{"x":27,"y":7},"order":110,"id":"m_0_g_0_p_190"},{"point":{"x":27,"y":8},"order":111,"id":"m_0_g_0_p_191"},{"point":{"x":27,"y":9},"order":112,"id":"m_0_g_0_p_192"},{"point":{"x":27,"y":10},"order":113,"id":"m_0_g_0_p_193"},{"point":{"x":27,"y":11},"order":114,"id":"m_0_g_0_p_194"},{"point":{"x":27,"y":12},"order":115,"id":"m_0_g_0_p_195"},{"point":{"x":27,"y":13},"order":116,"id":"m_0_g_0_p_196"},{"point":{"x":28,"y":8},"order":117,"id":"m_0_g_0_p_197"},{"point":{"x":29,"y":8},"order":118,"id":"m_0_g_0_p_198"},{"point":{"x":30,"y":8},"order":119,"id":"m_0_g_0_p_199"},{"point":{"x":28,"y":7},"order":120,"id":"m_0_g_0_p_200"},{"point":{"x":29,"y":7},"order":121,"id":"m_0_g_0_p_201"},{"point":{"x":30,"y":7},"order":122,"id":"m_0_g_0_p_202"},{"point":{"x":31,"y":8},"order":123,"id":"m_0_g_0_p_203"},{"point":{"x":31,"y":9},"order":124,"id":"m_0_g_0_p_204"},{"point":{"x":31,"y":10},"order":125,"id":"m_0_g_0_p_205"},{"point":{"x":31,"y":11},"order":126,"id":"m_0_g_0_p_206"},{"point":{"x":31,"y":12},"order":127,"id":"m_0_g_0_p_207"},{"point":{"x":31,"y":13},"order":128,"id":"m_0_g_0_p_208"},{"point":{"x":31,"y":7},"order":129,"id":"m_0_g_0_p_209"},{"point":{"x":32,"y":8},"order":130,"id":"m_0_g_0_p_210"},{"point":{"x":32,"y":9},"order":131,"id":"m_0_g_0_p_211"},{"point":{"x":32,"y":10},"order":132,"id":"m_0_g_0_p_212"},{"point":{"x":32,"y":11},"order":133,"id":"m_0_g_0_p_213"},{"point":{"x":32,"y":12},"order":134,"id":"m_0_g_0_p_214"},{"point":{"x":32,"y":13},"order":135,"id":"m_0_g_0_p_215"},{"point":{"x":28,"y":10},"order":136,"id":"m_0_g_0_p_216"},{"point":{"x":29,"y":10},"order":137,"id":"m_0_g_0_p_217"},{"point":{"x":30,"y":10},"order":138,"id":"m_0_g_0_p_218"},{"point":{"x":30,"y":11},"order":139,"id":"m_0_g_0_p_219"},{"point":{"x":29,"y":11},"order":140,"id":"m_0_g_0_p_220"},{"point":{"x":28,"y":11},"order":141,"id":"m_0_g_0_p_221"},{"point":{"x":34,"y":7},"order":142,"id":"m_0_g_0_p_222"},{"point":{"x":34,"y":8},"order":143,"id":"m_0_g_0_p_223"},{"point":{"x":34,"y":9},"order":144,"id":"m_0_g_0_p_224"},{"point":{"x":34,"y":10},"order":145,"id":"m_0_g_0_p_225"},{"point":{"x":34,"y":11},"order":146,"id":"m_0_g_0_p_226"},{"point":{"x":34,"y":12},"order":147,"id":"m_0_g_0_p_227"},{"point":{"x":34,"y":13},"order":148,"id":"m_0_g_0_p_228"},{"point":{"x":35,"y":7},"order":149,"id":"m_0_g_0_p_229"},{"point":{"x":35,"y":8},"order":150,"id":"m_0_g_0_p_230"},{"point":{"x":35,"y":9},"order":151,"id":"m_0_g_0_p_231"},{"point":{"x":35,"y":10},"order":152,"id":"m_0_g_0_p_232"},{"point":{"x":35,"y":11},"order":153,"id":"m_0_g_0_p_233"},{"point":{"x":35,"y":12},"order":154,"id":"m_0_g_0_p_234"},{"point":{"x":35,"y":13},"order":155,"id":"m_0_g_0_p_235"},{"point":{"x":36,"y":7},"order":156,"id":"m_0_g_0_p_236"},{"point":{"x":36,"y":8},"order":157,"id":"m_0_g_0_p_237"},{"point":{"x":37,"y":8},"order":158,"id":"m_0_g_0_p_238"},{"point":{"x":38,"y":8},"order":159,"id":"m_0_g_0_p_239"},{"point":{"x":39,"y":8},"order":160,"id":"m_0_g_0_p_240"},{"point":{"x":38,"y":7},"order":161,"id":"m_0_g_0_p_241"},{"point":{"x":37,"y":7},"order":162,"id":"m_0_g_0_p_242"},{"point":{"x":36,"y":10},"order":163,"id":"m_0_g_0_p_243"},{"point":{"x":37,"y":10},"order":164,"id":"m_0_g_0_p_244"},{"point":{"x":38,"y":10},"order":165,"id":"m_0_g_0_p_245"},{"point":{"x":36,"y":11},"order":166,"id":"m_0_g_0_p_246"},{"point":{"x":37,"y":11},"order":167,"id":"m_0_g_0_p_247"},{"point":{"x":38,"y":11},"order":168,"id":"m_0_g_0_p_248"},{"point":{"x":39,"y":7},"order":169,"id":"m_0_g_0_p_249"},{"point":{"x":39,"y":9},"order":170,"id":"m_0_g_0_p_250"},{"point":{"x":39,"y":10},"order":171,"id":"m_0_g_0_p_251"},{"point":{"x":39,"y":11},"order":172,"id":"m_0_g_0_p_252"},{"point":{"x":39,"y":12},"order":173,"id":"m_0_g_0_p_253"},{"point":{"x":39,"y":13},"order":174,"id":"m_0_g_0_p_254"},{"point":{"x":40,"y":8},"order":175,"id":"m_0_g_0_p_255"},{"point":{"x":40,"y":9},"order":176,"id":"m_0_g_0_p_256"},{"point":{"x":40,"y":10},"order":177,"id":"m_0_g_0_p_257"},{"point":{"x":40,"y":12},"order":178,"id":"m_0_g_0_p_258"},{"point":{"x":40,"y":13},"order":179,"id":"m_0_g_0_p_259"},{"point":{"x":42,"y":7},"order":180,"id":"m_0_g_0_p_260"},{"point":{"x":42,"y":8},"order":181,"id":"m_0_g_0_p_261"},{"point":{"x":42,"y":9},"order":182,"id":"m_0_g_0_p_262"},{"point":{"x":42,"y":10},"order":183,"id":"m_0_g_0_p_263"},{"point":{"x":42,"y":11},"order":184,"id":"m_0_g_0_p_264"},{"point":{"x":42,"y":12},"order":185,"id":"m_0_g_0_p_265"},{"point":{"x":43,"y":12},"order":186,"id":"m_0_g_0_p_266"},{"point":{"x":43,"y":13},"order":187,"id":"m_0_g_0_p_267"},{"point":{"x":42,"y":13},"order":188,"id":"m_0_g_0_p_268"},{"point":{"x":43,"y":11},"order":189,"id":"m_0_g_0_p_269"},{"point":{"x":43,"y":10},"order":190,"id":"m_0_g_0_p_270"},{"point":{"x":43,"y":9},"order":191,"id":"m_0_g_0_p_271"},{"point":{"x":43,"y":8},"order":192,"id":"m_0_g_0_p_272"},{"point":{"x":43,"y":7},"order":193,"id":"m_0_g_0_p_273"},{"point":{"x":44,"y":7},"order":194,"id":"m_0_g_0_p_274"},{"point":{"x":44,"y":10},"order":195,"id":"m_0_g_0_p_275"},{"point":{"x":45,"y":10},"order":196,"id":"m_0_g_0_p_276"},{"point":{"x":46,"y":10},"order":197,"id":"m_0_g_0_p_277"},{"point":{"x":44,"y":8},"order":198,"id":"m_0_g_0_p_278"},{"point":{"x":45,"y":8},"order":199,"id":"m_0_g_0_p_279"},{"point":{"x":46,"y":8},"order":200,"id":"m_0_g_0_p_280"},{"point":{"x":47,"y":8},"order":201,"id":"m_0_g_0_p_281"},{"point":{"x":47,"y":7},"order":202,"id":"m_0_g_0_p_282"},{"point":{"x":46,"y":7},"order":203,"id":"m_0_g_0_p_283"},{"point":{"x":45,"y":7},"order":204,"id":"m_0_g_0_p_284"},{"point":{"x":44,"y":12},"order":205,"id":"m_0_g_0_p_285"},{"point":{"x":45,"y":12},"order":206,"id":"m_0_g_0_p_286"},{"point":{"x":46,"y":12},"order":207,"id":"m_0_g_0_p_287"},{"point":{"x":47,"y":12},"order":208,"id":"m_0_g_0_p_288"},{"point":{"x":47,"y":13},"order":209,"id":"m_0_g_0_p_289"},{"point":{"x":46,"y":13},"order":210,"id":"m_0_g_0_p_290"},{"point":{"x":45,"y":13},"order":211,"id":"m_0_g_0_p_291"},{"point":{"x":44,"y":13},"order":212,"id":"m_0_g_0_p_292"},{"point":{"x":50,"y":7},"order":213,"id":"m_0_g_0_p_293"},{"point":{"x":50,"y":8},"order":214,"id":"m_0_g_0_p_294"},{"point":{"x":50,"y":9},"order":215,"id":"m_0_g_0_p_295"},{"point":{"x":51,"y":9},"order":216,"id":"m_0_g_0_p_296"},{"point":{"x":51,"y":8},"order":217,"id":"m_0_g_0_p_297"},{"point":{"x":51,"y":7},"order":218,"id":"m_0_g_0_p_298"},{"point":{"x":52,"y":9},"order":219,"id":"m_0_g_0_p_299"},{"point":{"x":53,"y":9},"order":220,"id":"m_0_g_0_p_300"},{"point":{"x":54,"y":9},"order":221,"id":"m_0_g_0_p_301"},{"point":{"x":54,"y":7},"order":222,"id":"m_0_g_0_p_302"},{"point":{"x":54,"y":8},"order":223,"id":"m_0_g_0_p_303"},{"point":{"x":55,"y":7},"order":224,"id":"m_0_g_0_p_304"},{"point":{"x":55,"y":8},"order":225,"id":"m_0_g_0_p_305"},{"point":{"x":55,"y":9},"order":226,"id":"m_0_g_0_p_306"},{"point":{"x":51,"y":10},"order":227,"id":"m_0_g_0_p_307"},{"point":{"x":54,"y":10},"order":228,"id":"m_0_g_0_p_308"},{"point":{"x":53,"y":10},"order":229,"id":"m_0_g_0_p_309"},{"point":{"x":52,"y":10},"order":230,"id":"m_0_g_0_p_310"},{"point":{"x":52,"y":11},"order":231,"id":"m_0_g_0_p_311"},{"point":{"x":52,"y":12},"order":232,"id":"m_0_g_0_p_312"},{"point":{"x":52,"y":13},"order":233,"id":"m_0_g_0_p_313"},{"point":{"x":53,"y":13},"order":234,"id":"m_0_g_0_p_314"},{"point":{"x":53,"y":12},"order":235,"id":"m_0_g_0_p_315"},{"point":{"x":53,"y":11},"order":236,"id":"m_0_g_0_p_316"},{"point":{"x":57,"y":8},"order":237,"id":"m_0_g_0_p_317"},{"point":{"x":57,"y":9},"order":238,"id":"m_0_g_0_p_318"},{"point":{"x":57,"y":10},"order":239,"id":"m_0_g_0_p_319"},{"point":{"x":57,"y":11},"order":240,"id":"m_0_g_0_p_320"},{"point":{"x":57,"y":12},"order":241,"id":"m_0_g_0_p_321"},{"point":{"x":58,"y":7},"order":242,"id":"m_0_g_0_p_322"},{"point":{"x":58,"y":8},"order":243,"id":"m_0_g_0_p_323"},{"point":{"x":58,"y":9},"order":244,"id":"m_0_g_0_p_324"},{"point":{"x":58,"y":10},"order":245,"id":"m_0_g_0_p_325"},{"point":{"x":58,"y":11},"order":246,"id":"m_0_g_0_p_326"},{"point":{"x":58,"y":12},"order":247,"id":"m_0_g_0_p_327"},{"point":{"x":58,"y":13},"order":248,"id":"m_0_g_0_p_328"},{"point":{"x":59,"y":7},"order":249,"id":"m_0_g_0_p_329"},{"point":{"x":60,"y":7},"order":250,"id":"m_0_g_0_p_330"},{"point":{"x":61,"y":7},"order":251,"id":"m_0_g_0_p_331"},{"point":{"x":62,"y":7},"order":252,"id":"m_0_g_0_p_332"},{"point":{"x":61,"y":8},"order":253,"id":"m_0_g_0_p_333"},{"point":{"x":60,"y":8},"order":254,"id":"m_0_g_0_p_334"},{"point":{"x":59,"y":8},"order":255,"id":"m_0_g_0_p_335"},{"point":{"x":62,"y":8},"order":256,"id":"m_0_g_0_p_336"},{"point":{"x":62,"y":9},"order":257,"id":"m_0_g_0_p_337"},{"point":{"x":62,"y":10},"order":258,"id":"m_0_g_0_p_338"},{"point":{"x":62,"y":11},"order":259,"id":"m_0_g_0_p_339"},{"point":{"x":62,"y":12},"order":260,"id":"m_0_g_0_p_340"},{"point":{"x":59,"y":12},"order":261,"id":"m_0_g_0_p_341"},{"point":{"x":60,"y":12},"order":262,"id":"m_0_g_0_p_342"},{"point":{"x":61,"y":12},"order":263,"id":"m_0_g_0_p_343"},{"point":{"x":61,"y":13},"order":264,"id":"m_0_g_0_p_344"},{"point":{"x":60,"y":13},"order":265,"id":"m_0_g_0_p_345"},{"point":{"x":59,"y":13},"order":266,"id":"m_0_g_0_p_346"},{"point":{"x":62,"y":13},"order":267,"id":"m_0_g_0_p_347"},{"point":{"x":63,"y":12},"order":268,"id":"m_0_g_0_p_348"},{"point":{"x":63,"y":11},"order":269,"id":"m_0_g_0_p_349"},{"point":{"x":63,"y":10},"order":270,"id":"m_0_g_0_p_350"},{"point":{"x":63,"y":9},"order":271,"id":"m_0_g_0_p_351"},{"point":{"x":63,"y":8},"order":272,"id":"m_0_g_0_p_352"},{"point":{"x":65,"y":7},"order":273,"id":"m_0_g_0_p_353"},{"point":{"x":65,"y":8},"order":274,"id":"m_0_g_0_p_354"},{"point":{"x":65,"y":9},"order":275,"id":"m_0_g_0_p_355"},{"point":{"x":65,"y":10},"order":276,"id":"m_0_g_0_p_356"},{"point":{"x":65,"y":11},"order":277,"id":"m_0_g_0_p_357"},{"point":{"x":65,"y":12},"order":278,"id":"m_0_g_0_p_358"},{"point":{"x":66,"y":12},"order":279,"id":"m_0_g_0_p_359"},{"point":{"x":66,"y":11},"order":280,"id":"m_0_g_0_p_360"},{"point":{"x":66,"y":10},"order":281,"id":"m_0_g_0_p_361"},{"point":{"x":66,"y":9},"order":282,"id":"m_0_g_0_p_362"},{"point":{"x":66,"y":8},"order":283,"id":"m_0_g_0_p_363"},{"point":{"x":66,"y":7},"order":284,"id":"m_0_g_0_p_364"},{"point":{"x":66,"y":13},"order":285,"id":"m_0_g_0_p_365"},{"point":{"x":67,"y":12},"order":286,"id":"m_0_g_0_p_366"},{"point":{"x":68,"y":12},"order":287,"id":"m_0_g_0_p_367"},{"point":{"x":69,"y":12},"order":288,"id":"m_0_g_0_p_368"},{"point":{"x":67,"y":13},"order":289,"id":"m_0_g_0_p_369"},{"point":{"x":68,"y":13},"order":290,"id":"m_0_g_0_p_370"},{"point":{"x":69,"y":13},"order":291,"id":"m_0_g_0_p_371"},{"point":{"x":70,"y":12},"order":292,"id":"m_0_g_0_p_372"},{"point":{"x":70,"y":13},"order":293,"id":"m_0_g_0_p_373"},{"point":{"x":71,"y":12},"order":294,"id":"m_0_g_0_p_374"},{"point":{"x":70,"y":11},"order":295,"id":"m_0_g_0_p_375"},{"point":{"x":70,"y":10},"order":296,"id":"m_0_g_0_p_376"},{"point":{"x":70,"y":9},"order":297,"id":"m_0_g_0_p_377"},{"point":{"x":70,"y":8},"order":298,"id":"m_0_g_0_p_378"},{"point":{"x":70,"y":7},"order":299,"id":"m_0_g_0_p_379"},{"point":{"x":71,"y":7},"order":300,"id":"m_0_g_0_p_380"},{"point":{"x":71,"y":8},"order":301,"id":"m_0_g_0_p_381"},{"point":{"x":71,"y":9},"order":302,"id":"m_0_g_0_p_382"},{"point":{"x":71,"y":10},"order":303,"id":"m_0_g_0_p_383"},{"point":{"x":71,"y":11},"order":304,"id":"m_0_g_0_p_384"},{"point":{"x":74,"y":7},"order":305,"id":"m_0_g_0_p_407"},{"point":{"x":75,"y":7},"order":306,"id":"m_0_g_0_p_408"},{"point":{"x":75,"y":8},"order":307,"id":"m_0_g_0_p_409"},{"point":{"x":74,"y":8},"order":308,"id":"m_0_g_0_p_410"},{"point":{"x":76,"y":8},"order":309,"id":"m_0_g_0_p_411"},{"point":{"x":77,"y":8},"order":310,"id":"m_0_g_0_p_412"},{"point":{"x":78,"y":8},"order":311,"id":"m_0_g_0_p_413"},{"point":{"x":77,"y":9},"order":312,"id":"m_0_g_0_p_414"},{"point":{"x":78,"y":9},"order":313,"id":"m_0_g_0_p_416"},{"point":{"x":78,"y":10},"order":314,"id":"m_0_g_0_p_417"},{"point":{"x":77,"y":10},"order":315,"id":"m_0_g_0_p_418"},{"point":{"x":76,"y":7},"order":316,"id":"m_0_g_0_p_419"},{"point":{"x":77,"y":7},"order":317,"id":"m_0_g_0_p_420"},{"point":{"x":75,"y":11},"order":318,"id":"m_0_g_0_p_423"},{"point":{"x":76,"y":11},"order":319,"id":"m_0_g_0_p_424"},{"point":{"x":77,"y":11},"order":320,"id":"m_0_g_0_p_425"},{"point":{"x":76,"y":13},"order":321,"id":"m_0_g_0_p_426"},{"point":{"x":75,"y":13},"order":322,"id":"m_0_g_0_p_427"},{"point":{"x":75,"y":10},"order":323,"id":"m_0_g_0_p_428"},{"point":{"x":76,"y":10},"order":324,"id":"m_0_g_0_p_429"}]}]}]}}

        let rainingLettersModel = {"general":{"originalSize":{"x":45,"y":20},"size":{"x":45,"y":20},"zoom":5,"showGrid":false,"renderOptimization":false,"disableLayerImageOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_0","points":[{"point":{"x":4,"y":4},"order":0,"id":"m_0_g_0_p_12"},{"point":{"x":4,"y":14},"order":1,"id":"m_0_g_0_p_13"},{"point":{"x":6,"y":14},"order":2,"id":"m_0_g_0_p_14"},{"point":{"x":6,"y":11},"order":3,"id":"m_0_g_0_p_15"},{"point":{"x":10,"y":11},"order":4,"id":"m_0_g_0_p_16"},{"point":{"x":10,"y":14},"order":5,"id":"m_0_g_0_p_17"},{"point":{"x":12,"y":14},"order":6,"id":"m_0_g_0_p_18"},{"point":{"x":12,"y":11},"order":7,"id":"m_0_g_0_p_19"},{"point":{"x":11,"y":10},"order":8,"id":"m_0_g_0_p_20"},{"point":{"x":12,"y":9},"order":9,"id":"m_0_g_0_p_21"},{"point":{"x":12,"y":5},"order":10,"id":"m_0_g_0_p_22"},{"point":{"x":11,"y":4},"order":11,"id":"m_0_g_0_p_23"}]},{"order":1,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":true,"replace":false,"id":"m_0_g_1","points":[{"point":{"x":7,"y":6},"order":0,"id":"m_0_g_1_p_4"},{"point":{"x":9,"y":6},"order":1,"id":"m_0_g_1_p_5"},{"point":{"x":9,"y":8},"order":2,"id":"m_0_g_1_p_6"},{"point":{"x":7,"y":8},"order":3,"id":"m_0_g_1_p_7"}]},{"order":2,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_2","points":[{"point":{"x":14,"y":14},"order":0,"id":"m_0_g_2_p_0"},{"point":{"x":14,"y":5},"order":1,"id":"m_0_g_2_p_1"},{"point":{"x":15,"y":4},"order":2,"id":"m_0_g_2_p_2"},{"point":{"x":21,"y":4},"order":3,"id":"m_0_g_2_p_3"},{"point":{"x":22,"y":5},"order":4,"id":"m_0_g_2_p_4"},{"point":{"x":22,"y":14},"order":5,"id":"m_0_g_2_p_5"},{"point":{"x":20,"y":14},"order":6,"id":"m_0_g_2_p_6"},{"point":{"x":20,"y":11},"order":7,"id":"m_0_g_2_p_7"},{"point":{"x":16,"y":11},"order":8,"id":"m_0_g_2_p_8"},{"point":{"x":16,"y":14},"order":9,"id":"m_0_g_2_p_9"}]},{"order":3,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":true,"replace":false,"id":"m_0_g_3","points":[{"point":{"x":17,"y":6},"order":0,"id":"m_0_g_3_p_4"},{"point":{"x":19,"y":6},"order":1,"id":"m_0_g_3_p_5"},{"point":{"x":19,"y":8},"order":2,"id":"m_0_g_3_p_6"},{"point":{"x":17,"y":8},"order":3,"id":"m_0_g_3_p_7"}]},{"order":4,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_5","points":[{"point":{"x":24,"y":4},"order":0,"id":"m_0_g_5_p_0"},{"point":{"x":28,"y":4},"order":1,"id":"m_0_g_5_p_1"},{"point":{"x":28,"y":5},"order":2,"id":"m_0_g_5_p_2"},{"point":{"x":27,"y":5},"order":3,"id":"m_0_g_5_p_3"},{"point":{"x":27,"y":13},"order":4,"id":"m_0_g_5_p_4"},{"point":{"x":28,"y":13},"order":5,"id":"m_0_g_5_p_5"},{"point":{"x":28,"y":14},"order":6,"id":"m_0_g_5_p_6"},{"point":{"x":24,"y":14},"order":7,"id":"m_0_g_5_p_7"},{"point":{"x":24,"y":13},"order":8,"id":"m_0_g_5_p_8"},{"point":{"x":25,"y":13},"order":9,"id":"m_0_g_5_p_9"},{"point":{"x":25,"y":5},"order":10,"id":"m_0_g_5_p_10"},{"point":{"x":24,"y":5},"order":11,"id":"m_0_g_5_p_11"}]},{"order":5,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_6","points":[{"point":{"x":30,"y":14},"order":0,"id":"m_0_g_6_p_11"},{"point":{"x":30,"y":4},"order":1,"id":"m_0_g_6_p_12"},{"point":{"x":32,"y":4},"order":2,"id":"m_0_g_6_p_13"},{"point":{"x":32,"y":5},"order":3,"id":"m_0_g_6_p_14"},{"point":{"x":36,"y":11},"order":4,"id":"m_0_g_6_p_15"},{"point":{"x":36,"y":4},"order":5,"id":"m_0_g_6_p_16"},{"point":{"x":38,"y":4},"order":6,"id":"m_0_g_6_p_17"},{"point":{"x":38,"y":14},"order":7,"id":"m_0_g_6_p_18"},{"point":{"x":36,"y":14},"order":8,"id":"m_0_g_6_p_19"},{"point":{"x":36,"y":13},"order":9,"id":"m_0_g_6_p_20"},{"point":{"x":32,"y":7},"order":10,"id":"m_0_g_6_p_21"},{"point":{"x":32,"y":14},"order":11,"id":"m_0_g_6_p_22"}]},{"order":6,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":false,"replace":false,"id":"m_0_g_7","points":[{"point":{"x":40,"y":4},"order":0,"id":"m_0_g_5_p_0"},{"point":{"x":44,"y":4},"order":1,"id":"m_0_g_5_p_1"},{"point":{"x":44,"y":5},"order":2,"id":"m_0_g_5_p_2"},{"point":{"x":43,"y":5},"order":3,"id":"m_0_g_5_p_3"},{"point":{"x":43,"y":13},"order":4,"id":"m_0_g_5_p_4"},{"point":{"x":44,"y":13},"order":5,"id":"m_0_g_5_p_5"},{"point":{"x":44,"y":14},"order":6,"id":"m_0_g_5_p_6"},{"point":{"x":40,"y":14},"order":7,"id":"m_0_g_5_p_7"},{"point":{"x":40,"y":13},"order":8,"id":"m_0_g_5_p_8"},{"point":{"x":41,"y":13},"order":9,"id":"m_0_g_5_p_9"},{"point":{"x":41,"y":5},"order":10,"id":"m_0_g_5_p_10"},{"point":{"x":40,"y":5},"order":11,"id":"m_0_g_5_p_11"}]},{"order":7,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":false,"replace":false,"id":"m_0_g_8","points":[{"point":{"x":46,"y":14},"order":0,"id":"m_0_g_6_p_11"},{"point":{"x":46,"y":4},"order":1,"id":"m_0_g_6_p_12"},{"point":{"x":48,"y":4},"order":2,"id":"m_0_g_6_p_13"},{"point":{"x":48,"y":5},"order":3,"id":"m_0_g_6_p_14"},{"point":{"x":52,"y":11},"order":4,"id":"m_0_g_6_p_15"},{"point":{"x":52,"y":4},"order":5,"id":"m_0_g_6_p_16"},{"point":{"x":54,"y":4},"order":6,"id":"m_0_g_6_p_17"},{"point":{"x":54,"y":14},"order":7,"id":"m_0_g_6_p_18"},{"point":{"x":52,"y":14},"order":8,"id":"m_0_g_6_p_19"},{"point":{"x":52,"y":13},"order":9,"id":"m_0_g_6_p_20"},{"point":{"x":48,"y":7},"order":10,"id":"m_0_g_6_p_21"},{"point":{"x":48,"y":14},"order":11,"id":"m_0_g_6_p_22"}]},{"order":8,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":false,"replace":false,"id":"m_0_g_9","points":[{"point":{"x":56,"y":5},"order":0,"id":"m_0_g_9_p_0"},{"point":{"x":57,"y":4},"order":1,"id":"m_0_g_9_p_1"},{"point":{"x":64,"y":4},"order":2,"id":"m_0_g_9_p_2"},{"point":{"x":64,"y":6},"order":3,"id":"m_0_g_9_p_3"},{"point":{"x":64,"y":14},"order":4,"id":"m_0_g_9_p_7"},{"point":{"x":57,"y":14},"order":5,"id":"m_0_g_9_p_8"},{"point":{"x":56,"y":13},"order":6,"id":"m_0_g_9_p_9"}]},{"order":9,"type":"lines","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":true,"replace":false,"id":"m_0_g_10","points":[]},{"order":10,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":true,"replace":false,"id":"m_0_g_11","points":[{"point":{"x":59,"y":7},"order":0,"id":"m_0_g_11_p_8"},{"point":{"x":60,"y":7},"order":1,"id":"m_0_g_11_p_10"},{"point":{"x":61,"y":7},"order":2,"id":"m_0_g_11_p_11"},{"point":{"x":62,"y":7},"order":3,"id":"m_0_g_11_p_12"},{"point":{"x":63,"y":7},"order":4,"id":"m_0_g_11_p_13"},{"point":{"x":64,"y":7},"order":5,"id":"m_0_g_11_p_14"},{"point":{"x":64,"y":8},"order":6,"id":"m_0_g_11_p_15"},{"point":{"x":63,"y":8},"order":7,"id":"m_0_g_11_p_16"},{"point":{"x":62,"y":8},"order":8,"id":"m_0_g_11_p_17"},{"point":{"x":61,"y":8},"order":9,"id":"m_0_g_11_p_18"},{"point":{"x":60,"y":8},"order":10,"id":"m_0_g_11_p_19"},{"point":{"x":59,"y":8},"order":11,"id":"m_0_g_11_p_20"},{"point":{"x":61,"y":11},"order":12,"id":"m_0_g_11_p_22"},{"point":{"x":60,"y":11},"order":13,"id":"m_0_g_11_p_23"},{"point":{"x":59,"y":11},"order":14,"id":"m_0_g_11_p_24"},{"point":{"x":59,"y":10},"order":15,"id":"m_0_g_11_p_25"},{"point":{"x":59,"y":9},"order":16,"id":"m_0_g_11_p_26"},{"point":{"x":60,"y":10},"order":17,"id":"m_0_g_11_p_32"},{"point":{"x":60,"y":9},"order":18,"id":"m_0_g_11_p_33"},{"point":{"x":62,"y":11},"order":19,"id":"m_0_g_11_p_34"}]}]}]}}



        this.main = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createRainFrames({
                angleClamps, lengthClamps, xClamps, upperYClamps, lowerY, aValue = 1, speedClapms, mask,
                framesCount, itemsCount, size, useACurve = false, excludeMask }) {
                let frames = [];
        
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount - 1);
                    let totalFrames = framesCount;//getRandomInt(itemFrameslengthClamps);
        
                    let speed = fast.r(getRandom(speedClapms[0], speedClapms[1]), 2);
                    let p0 = V2.random(xClamps, upperYClamps);
                    let angle = getRandom(angleClamps[0], angleClamps[1])
                    let direction = V2.down.rotate(angle);
                    let len = getRandomInt(lengthClamps);
        
                    let lineAValues = undefined;
                    if (useACurve) {
                        lineAValues = easing.fast({ from: 0, to: aValue, steps: len, type: 'linear', round: 2 })
                    }
        
                    let frames = [];
                    let current = p0;
                    let ly = isArray(lowerY) ? getRandomInt(lowerY) : lowerY;
        
                    for (let f = 0; f < totalFrames; f++) {
                        let frameIndex = f + startFrameIndex;
                        if (frameIndex > (framesCount - 1)) {
                            frameIndex -= framesCount;
                        }
        
                        let p0 = current.clone();
                        let p1 = current.add(direction.mul(len)).toInt();
        
                        frames[frameIndex] = {
                            p0,
                            p1
                        };
        
                        current = p0.add(direction.mul(speed)).toInt()
                        if (current.y > ly)
                            break;
                    }
        
                    return {
                        frames,
                        lowerY: ly,
                        lineAValues
                    }
                })
        
                for (let f = 0; f < framesCount; f++) {
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        let pp = new PP({ ctx });
                        pp.setFillColor(whiteColorPrefix + aValue + ')')
                        for (let p = 0; p < itemsData.length; p++) {
                            let itemData = itemsData[p];
        
                            if (itemData.frames[f]) {
        
                                let { p0, p1 } = itemData.frames[f];
                                if (p0.y > itemData.lowerY)
                                    continue;
        
                                if (!useACurve)
                                    pp.lineV2(p0, p1);
                                else {
                                    let points = appSharedPP.lineV2(p0, p1)
                                    for (let i = 0; i < points.length; i++) {
                                        let a = itemData.lineAValues[i];
                                        if (a == undefined)
                                            a = 0;
        
                                        let p = points[i];
                                        if (p.y > itemData.lowerY)
                                            continue;
        
                                        hlp.setFillColor(whiteColorPrefix + a + ')').dot(points[i])
                                    }
                                }
                            }
        
                        }
        
                        if (mask) {
                            ctx.globalCompositeOperation = 'source-in'
                            ctx.drawImage(mask, 0, 0)
                        }
    
                        if(excludeMask) {
                            ctx.globalCompositeOperation = 'destination-out'
                            ctx.drawImage(excludeMask, 0, 0)
                        }
                    });
                }
        
                return frames;
            },
            createSmokeFrames({ framesCount, itemsCount, startPositions, aClamps, itemFrameslength, velocityClamps, accelerationClamps, itemMaxSizeClamps, dChangeType, mask, color, size }) {
                let frames = [];

                let angleDeviation = 15//45
                let methods = ['in', 'out', 'inOut']
                let itamsPredefinedImagesCount = 30;
                let itemImageSize = new V2(itemMaxSizeClamps[1] * 2, itemMaxSizeClamps[1] * 2);
                let itemImageCenter = itemImageSize.divide(2).toInt();
                let itemImageSteps = undefined;//itemMaxSizeClamps[1];

                switch (dChangeType) {
                    case 0:
                        itemImageSteps = itemMaxSizeClamps[1] * 2
                        break;
                    case 1, 2:
                        itemImageSteps = itemMaxSizeClamps[1]
                        break;
                    default:
                        throw new Error('Unknown dChangeType')
                }

                itemImageSteps *= 2;

                let cornerPoints = [
                    itemImageCenter,
                    itemImageCenter,
                    itemImageCenter,
                    itemImageCenter
                ]

                let itemsImages = new Array(itamsPredefinedImagesCount).fill().map(_ => {
                    let directions = [
                        new V2(-1, 0).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                        new V2(0, -1).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                        new V2(1, 0).rotate(getRandomInt(-angleDeviation, angleDeviation)),
                        new V2(0, 1).rotate(getRandomInt(-angleDeviation, angleDeviation))
                    ]

                    let distanceValues = new Array(cornerPoints.length).fill().map(_ => {
                        let maxD = getRandomInt(itemMaxSizeClamps) //getRandomInt(4, 8);
                        let method = methods[getRandomInt(0, methods.length - 1)]

                        switch (dChangeType) {
                            case 0:
                                return [
                                    ...easing.fast({ from: 0, to: maxD, steps: itemImageSteps / 2, type: 'quad', method, round: 2 }),
                                    ...easing.fast({ from: maxD, to: 0, steps: itemImageSteps / 2, type: 'quad', method, round: 2 })
                                ]
                            case 1:
                                return easing.fast({ from: maxD, to: 0, steps: itemImageSteps, type: 'quad', method, round: 2 })
                            case 2:
                                return new Array(itemImageSteps).fill(maxD)
                        }
                    });

                    let cornerPointsShifts = directions.map((direction, i) => distanceValues[i].map(distance => direction.mul(distance)));

                    let imgs = [];//new Array(itemImageSteps);

                    for (let iStep = 0; iStep < itemImageSteps; iStep++) {
                        let isBreak = false;
                        imgs[iStep] = createCanvas(itemImageSize, (ctx, size, hlp) => {
                            let pp = new PP({ ctx });

                            let curveCornerPoints = cornerPoints.map((p, i) => p.add(cornerPointsShifts[i][iStep]))
                            let currentCornerPoints = appSharedPP.curveByCornerPoints([...curveCornerPoints], 4, true)

                            if (currentCornerPoints.length > 3) {
                                pp.setFillStyle(color || whiteColorPrefix)
                                pp.fillByCornerPoints(currentCornerPoints, { fixOpacity: true })
                            }
                            else {
                                switch (dChangeType) {
                                    case 0:
                                        if (iStep > itemImageSteps / 2) {
                                            isBreak = true;
                                        }
                                        break;
                                    case 1:
                                        isBreak = true;
                                        break;
                                }
                            }
                        })

                        if (isBreak)
                            break;
                    }

                    return imgs;
                });


                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount - 1);
                    let totalFrames = isArray(itemFrameslength) ? getRandomInt(itemFrameslength) : itemFrameslength;
                    let halfTotalFrames = fast.r(totalFrames / 2)
                    let itemImgs = itemsImages[getRandomInt(0, itemsImages.length - 1)]

                    let sp = startPositions[getRandomInt(0, startPositions.length - 1)];
                    let aValues = [
                        ...easing.fast({ from: aClamps[0], to: aClamps[1], steps: halfTotalFrames, type: 'quad', method: 'inOut', round: 2 }),
                        ...easing.fast({ from: aClamps[1], to: aClamps[0], steps: halfTotalFrames, type: 'quad', method: 'inOut', round: 2 })
                    ]

                    let itemImgIndices = easing.fast({ from: 0, to: itemImgs.length - 1, steps: totalFrames, type: 'linear', round: 0 })

                    let velocity = {}//V2.random(velocityClamps.xClamps, velocityClamps.yClamps, false)
                    let acceleration = {};//V2.random(accelerationClamps.xClamps, accelerationClamps.yClamps,false)

                    if (velocityClamps.xClamps) {
                        velocity.x = getRandom(velocityClamps.xClamps[0], velocityClamps.xClamps[1])
                    }

                    if (velocityClamps.xf) {
                        velocity.xf = velocityClamps.xf(totalFrames);
                    }

                    if (velocityClamps.yClamps) {
                        velocity.y = getRandom(velocityClamps.yClamps[0], velocityClamps.yClamps[1])
                    }

                    if (velocityClamps.yf) {
                        velocity.yf = velocityClamps.yf(totalFrames);
                    }

                    if (accelerationClamps.xClamps) {
                        acceleration.x = getRandom(accelerationClamps.xClamps[0], accelerationClamps.xClamps[1])
                    }

                    if (accelerationClamps.xf) {
                        acceleration.xf = accelerationClamps.xf(totalFrames);
                    }

                    if (accelerationClamps.yClamps) {
                        acceleration.y = getRandom(accelerationClamps.yClamps[0], accelerationClamps.yClamps[1])
                    }

                    if (accelerationClamps.yf) {
                        acceleration.yf = accelerationClamps.yf(totalFrames);
                    }


                    let mainShift = V2.zero;

                    let frames = [];
                    for (let f = 0; f < totalFrames; f++) {
                        let frameIndex = f + startFrameIndex;
                        if (frameIndex > (framesCount - 1)) {
                            frameIndex -= framesCount;
                        }

                        if (velocity.xf) {
                            velocity.x = velocity.xf(f);
                        }

                        if (velocity.yf) {
                            velocity.y = velocity.yf(f);
                        }

                        if (acceleration.x) {
                            velocity.x += acceleration.x
                        }

                        if (acceleration.xf) {
                            velocity.x += acceleration.xf(f)
                        }

                        if (acceleration.y) {
                            velocity.y += acceleration.y
                        }

                        if (acceleration.yf) {
                            velocity.y += acceleration.yf(f)
                        }

                        mainShift.add(velocity, true);

                        frames[frameIndex] = {
                            imgIndex: itemImgIndices[f],
                            p: sp.add(mainShift),
                            a: aValues[f]
                        };
                    }

                    return {
                        itemImgs,
                        frames
                    }
                });

                for (let f = 0; f < framesCount; f++) {
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for (let p = 0; p < itemsData.length; p++) {
                            let itemData = itemsData[p];

                            if (itemData.frames[f]) {
                                ctx.globalAlpha = itemData.frames[f].a;
                                ctx.drawImage(itemData.itemImgs[itemData.frames[f].imgIndex], itemData.frames[f].p.x + itemImageCenter.x, itemData.frames[f].p.y + itemImageCenter.y)
                            }

                        }

                        ctx.globalAlpha = 1;

                        if (mask) {
                            ctx.globalCompositeOperation = mask.operation || 'source-atop'
                            ctx.drawImage(mask.img, 0, 0)
                        }
                    });
                }

                return frames;
            },
            init() {


                // this.frames = this.createSmokeFrames({
                //     framesCount: 150, itemsCount: 1000, 
                //     startPositions: [this.size.divide(2)],//appSharedPP.lineV2(new V2(0, this.size.y+yShift), new V2(this.size.x+10, this.size.y+yShift), { toV2: true }),
                //     aClamps: [0.1,0.1], itemFrameslength: [90,150], velocityClamps: {
                //         xf: (totalFrames) => {
                //             let a = getRandom(-0.5, 0.5);
                //             let b = -a*1.75;

                //             return (x) => a + b*x/totalFrames;
                //         }, yClamps: [-0.2,-0.25] // xClamps: [0,0], yClamps: [0,0]
                //     }, accelerationClamps: {
                //         xClamps: [0,0]
                //         , yClamps: [0,0]//[0,-0.005]
                //     }, itemMaxSizeClamps: [3,5], dChangeType: 0, mask: undefined, size: this.size
                // })

                

                this.burning = this.addChild(new GO({
                    position: new V2(0,-10),
                    size: this.size,
                    init() {

                        //return;
                        let yShift = 8;
                        let totalFrames = 150;
                        let yValue = this.size.y / 2 + yShift
                        let frms = [
                            {
                                framesCount: totalFrames, itemsCount: 4000,
                                startPositions: appSharedPP.lineV2(new V2(-10, yValue), new V2(this.size.x + 10, yValue), { toV2: true }),
                                aClamps: [0.05, 0.05], itemFrameslength: [150, 150], velocityClamps: {
                                    xClamps: [-0.1, 0.1]
                                    , yClamps: [-0.1, -0.3]
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FA4347'
                            },
                            {
                                framesCount: totalFrames, itemsCount: 2000,
                                startPositions: appSharedPP.lineV2(new V2(-10, yValue), new V2(this.size.x + 10, yValue), { toV2: true }),
                                aClamps: [0.05, 0.05], itemFrameslength: [150, 150], velocityClamps: {
                                    xClamps: [-0.1, 0.1]
                                    , yClamps: [-0.1, -0.3].map(x => x * 0.75)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#FFA44B'
                            },
                            {
                                framesCount: 150, itemsCount: 1000,
                                startPositions: appSharedPP.lineV2(new V2(-10, yValue), new V2(this.size.x + 10, yValue), { toV2: true }),
                                aClamps: [0.1, 0.1], itemFrameslength: [150, 150], velocityClamps: {
                                    xClamps: [-0.1, 0.1]
                                    , yClamps: [-0.1, -0.3].map(x => x * 0.5)
                                }, accelerationClamps: {
                                    xClamps: [0, 0]
                                    , yClamps: [0, 0]//[0,-0.005]
                                }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                                color: '#F7F3EA'
                            }
                        ].map(d => this.parent.createSmokeFrames(d))

                        let lettersTargetSize = new V2(100, 40);
                        let lettersImg = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(lettersModel), size.x / 2 - lettersTargetSize.x / 2, size.y / 2 - lettersTargetSize.y / 2, lettersTargetSize.x, lettersTargetSize.y)
                        })

                        this.frames = [];

                        for (let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                frms.forEach(fg => {
                                    ctx.drawImage(fg[f], 0, 0)
                                })

                                ctx.globalCompositeOperation = 'destination-in'
                                ctx.drawImage(lettersImg, 0, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.burningSecondRow = this.addChild(new GO({
                    position: new V2(0,20),
                    size: this.size,
                    init() {
                        let yShift = 8;
                        let totalFrames = 150;
                        let yValue = this.size.y / 2 + yShift

                        let frms = this.parent.createSmokeFrames({
                            framesCount: totalFrames, itemsCount: 2000,
                            startPositions: appSharedPP.lineV2(new V2(-10, yValue), new V2(this.size.x + 10, yValue), { toV2: true }),
                            aClamps: [0.05, 0.05], itemFrameslength: [150, 150], velocityClamps: {
                                xClamps: [-0.1, 0.1]
                                , yClamps: [-0.05, -0.2]
                            }, accelerationClamps: {
                                xClamps: [0, 0]
                                , yClamps: [0, 0]//[0,-0.005]
                            }, itemMaxSizeClamps: [2, 4], dChangeType: 0, mask: undefined, size: this.size,
                            color: '#ffffff'
                        })

                    
                        let lettersTargetSize = new V2(120, 30);
                        let lettersImg = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(fireLettersSecondRow), size.x / 2 - lettersTargetSize.x / 2, size.y / 2 - lettersTargetSize.y / 2, lettersTargetSize.x, lettersTargetSize.y)
                        })

                        this.frames = [];
                        for (let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                ctx.drawImage(frms[f],0,0)

                                 ctx.globalCompositeOperation = 'destination-in'
                                 ctx.drawImage(lettersImg, 0, 2)
                            })
                        }

                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });

                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     hlp.setFillColor('red')
                        //     hlp.rect(0,0,100,100)
                        // })
                        console.log('done')
                    }
                }))

                

                this.raining = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {

                        return;

                        let aMod = -0.1;
                        let totalFrames = 150;
                        let frms = [
                            {
                                angleClamps: [0,0], lengthClamps: [8,9], xClamps: [0,this.size.x], upperYClamps: [0, 40], lowerY: [142,146], aValue: 0.025-aMod, speedClapms:  [2,5], mask: undefined, framesCount: totalFrames, itemsCount: 4000, size: this.size, useACurve: false,
                            },
                            // {
                            //     angleClamps: [0,0], lengthClamps: [10,11], xClamps: [0,this.size.x], upperYClamps: [0, 40], lowerY: [142,146], aValue: 0.05-aMod, speedClapms: [4,4], mask: undefined, framesCount: totalFrames, itemsCount: 2000, size: this.size, useACurve: false,
                            // },
                            // // {
                            // //     angleClamps: [0,0], lengthClamps: [12,14], xClamps: [0,this.size.x], upperYClamps: [0, 40], lowerY: [147,150], aValue: 0.075-aMod, speedClapms: [5,6], mask: undefined, framesCount: totalFrames, itemsCount: 1000, size: this.size, useACurve: false,
                            // // },
                            // // {
                            // //     angleClamps: [0,0], lengthClamps: [14,17], xClamps: [0,this.size.x], upperYClamps: [0, 40], lowerY: [151,154], aValue: 0.1-aMod, speedClapms: [6,7], mask: undefined, framesCount: totalFrames, itemsCount: 500, size: this.size, useACurve: true,
                            // // },
                            // // {
                            // //     angleClamps: [0,0], lengthClamps: [17,20], xClamps: [0,this.size.x], upperYClamps: [0, 40], lowerY: [155,157], aValue: 0.125-aMod, speedClapms: [8,9], mask: undefined, framesCount: totalFrames, itemsCount: 300, size: this.size, useACurve: true,
                            // // }
                        ].map(d => this.parent.createRainFrames(d))

                        this.frames = [];

                        let lettersTargetSize = new V2(90, 40);
                        let lettersImg = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.drawImage(PP.createImage(rainingLettersModel), size.x / 2 - lettersTargetSize.x / 2, size.y / 2 - lettersTargetSize.y / 2, lettersTargetSize.x, lettersTargetSize.y)
                        })

                        for (let f = 0; f < totalFrames; f++) {
                            this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                                frms.forEach(fg => {
                                    ctx.drawImage(fg[f], 0, 0)
                                })

                                ctx.globalCompositeOperation = 'destination-in'
                                ctx.drawImage(lettersImg, 0, 0)
                            })
                        }

                        this.registerFramesDefaultTimer({});
                    }
                }))






            }
        }), 1)
    }
}