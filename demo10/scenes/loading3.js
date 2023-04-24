class Demo10Loading3Scene extends Scene {
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
                size: new V2(200,200).mul(10),
                // viewportSizeMultiplier: 10,
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'loading3'
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
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('black').rect(0,0,size.x, size.y);
                })
            }
        }), 0)

        this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(), //new V2(this.viewport.x, 25),
            createAnimationFrames({size, type}) {
                let frames = [];
                let loadingDots = {"general":{"originalSize":{"x":64,"y":8},"size":{"x":64,"y":8},"zoom":4,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_1","name":"","visible":true,"groups":[{"order":0,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_0","points":[{"point":{"x":5,"y":7},"order":0,"id":"m_1_g_0_p_0"},{"point":{"x":5,"y":6},"order":1,"id":"m_1_g_0_p_1"},{"point":{"x":5,"y":5},"order":2,"id":"m_1_g_0_p_2"},{"point":{"x":5,"y":4},"order":3,"id":"m_1_g_0_p_3"},{"point":{"x":5,"y":3},"order":4,"id":"m_1_g_0_p_4"},{"point":{"x":5,"y":2},"order":5,"id":"m_1_g_0_p_5"},{"point":{"x":5,"y":1},"order":6,"id":"m_1_g_0_p_6"},{"point":{"x":5,"y":0},"order":7,"id":"m_1_g_0_p_7"},{"point":{"x":6,"y":0},"order":8,"id":"m_1_g_0_p_8"},{"point":{"x":6,"y":1},"order":9,"id":"m_1_g_0_p_9"},{"point":{"x":6,"y":2},"order":10,"id":"m_1_g_0_p_10"},{"point":{"x":6,"y":3},"order":11,"id":"m_1_g_0_p_11"},{"point":{"x":6,"y":4},"order":12,"id":"m_1_g_0_p_12"},{"point":{"x":6,"y":5},"order":13,"id":"m_1_g_0_p_13"},{"point":{"x":6,"y":6},"order":14,"id":"m_1_g_0_p_14"},{"point":{"x":6,"y":7},"order":15,"id":"m_1_g_0_p_15"},{"point":{"x":8,"y":2},"order":16,"id":"m_1_g_0_p_16"},{"point":{"x":8,"y":3},"order":17,"id":"m_1_g_0_p_17"},{"point":{"x":9,"y":5},"order":18,"id":"m_1_g_0_p_18"},{"point":{"x":9,"y":4},"order":19,"id":"m_1_g_0_p_19"},{"point":{"x":10,"y":4},"order":20,"id":"m_1_g_0_p_20"},{"point":{"x":10,"y":5},"order":21,"id":"m_1_g_0_p_21"},{"point":{"x":11,"y":7},"order":22,"id":"m_1_g_0_p_22"},{"point":{"x":11,"y":6},"order":23,"id":"m_1_g_0_p_23"},{"point":{"x":11,"y":5},"order":24,"id":"m_1_g_0_p_24"},{"point":{"x":11,"y":4},"order":25,"id":"m_1_g_0_p_25"},{"point":{"x":11,"y":3},"order":26,"id":"m_1_g_0_p_26"},{"point":{"x":11,"y":2},"order":27,"id":"m_1_g_0_p_27"},{"point":{"x":11,"y":1},"order":28,"id":"m_1_g_0_p_28"},{"point":{"x":11,"y":0},"order":29,"id":"m_1_g_0_p_29"},{"point":{"x":12,"y":0},"order":30,"id":"m_1_g_0_p_30"},{"point":{"x":12,"y":1},"order":31,"id":"m_1_g_0_p_31"},{"point":{"x":12,"y":2},"order":32,"id":"m_1_g_0_p_32"},{"point":{"x":12,"y":3},"order":33,"id":"m_1_g_0_p_33"},{"point":{"x":12,"y":4},"order":34,"id":"m_1_g_0_p_34"},{"point":{"x":12,"y":5},"order":35,"id":"m_1_g_0_p_35"},{"point":{"x":12,"y":6},"order":36,"id":"m_1_g_0_p_36"},{"point":{"x":12,"y":7},"order":37,"id":"m_1_g_0_p_37"},{"point":{"x":15,"y":2},"order":38,"id":"m_1_g_0_p_42"},{"point":{"x":15,"y":3},"order":39,"id":"m_1_g_0_p_43"},{"point":{"x":15,"y":4},"order":40,"id":"m_1_g_0_p_44"},{"point":{"x":16,"y":4},"order":41,"id":"m_1_g_0_p_45"},{"point":{"x":16,"y":3},"order":42,"id":"m_1_g_0_p_46"},{"point":{"x":16,"y":2},"order":43,"id":"m_1_g_0_p_47"},{"point":{"x":15,"y":5},"order":44,"id":"m_1_g_0_p_48"},{"point":{"x":16,"y":5},"order":45,"id":"m_1_g_0_p_49"},{"point":{"x":17,"y":1},"order":46,"id":"m_1_g_0_p_50"},{"point":{"x":18,"y":1},"order":47,"id":"m_1_g_0_p_51"},{"point":{"x":19,"y":1},"order":48,"id":"m_1_g_0_p_52"},{"point":{"x":19,"y":0},"order":49,"id":"m_1_g_0_p_53"},{"point":{"x":18,"y":0},"order":50,"id":"m_1_g_0_p_54"},{"point":{"x":17,"y":0},"order":51,"id":"m_1_g_0_p_55"},{"point":{"x":20,"y":0},"order":52,"id":"m_1_g_0_p_56"},{"point":{"x":20,"y":1},"order":53,"id":"m_1_g_0_p_57"},{"point":{"x":21,"y":2},"order":54,"id":"m_1_g_0_p_58"},{"point":{"x":21,"y":3},"order":55,"id":"m_1_g_0_p_59"},{"point":{"x":21,"y":4},"order":56,"id":"m_1_g_0_p_60"},{"point":{"x":21,"y":5},"order":57,"id":"m_1_g_0_p_61"},{"point":{"x":22,"y":5},"order":58,"id":"m_1_g_0_p_62"},{"point":{"x":22,"y":4},"order":59,"id":"m_1_g_0_p_63"},{"point":{"x":22,"y":3},"order":60,"id":"m_1_g_0_p_64"},{"point":{"x":22,"y":2},"order":61,"id":"m_1_g_0_p_65"},{"point":{"x":17,"y":6},"order":62,"id":"m_1_g_0_p_66"},{"point":{"x":18,"y":6},"order":63,"id":"m_1_g_0_p_67"},{"point":{"x":19,"y":6},"order":64,"id":"m_1_g_0_p_68"},{"point":{"x":20,"y":6},"order":65,"id":"m_1_g_0_p_69"},{"point":{"x":20,"y":7},"order":66,"id":"m_1_g_0_p_70"},{"point":{"x":19,"y":7},"order":67,"id":"m_1_g_0_p_71"},{"point":{"x":18,"y":7},"order":68,"id":"m_1_g_0_p_72"},{"point":{"x":17,"y":7},"order":69,"id":"m_1_g_0_p_73"},{"point":{"x":25,"y":0},"order":70,"id":"m_1_g_0_p_74"},{"point":{"x":25,"y":1},"order":71,"id":"m_1_g_0_p_75"},{"point":{"x":25,"y":2},"order":72,"id":"m_1_g_0_p_76"},{"point":{"x":25,"y":3},"order":73,"id":"m_1_g_0_p_77"},{"point":{"x":25,"y":4},"order":74,"id":"m_1_g_0_p_78"},{"point":{"x":25,"y":5},"order":75,"id":"m_1_g_0_p_79"},{"point":{"x":26,"y":5},"order":76,"id":"m_1_g_0_p_82"},{"point":{"x":26,"y":4},"order":77,"id":"m_1_g_0_p_83"},{"point":{"x":26,"y":3},"order":78,"id":"m_1_g_0_p_84"},{"point":{"x":26,"y":2},"order":79,"id":"m_1_g_0_p_85"},{"point":{"x":26,"y":1},"order":80,"id":"m_1_g_0_p_86"},{"point":{"x":26,"y":0},"order":81,"id":"m_1_g_0_p_87"},{"point":{"x":27,"y":6},"order":82,"id":"m_1_g_0_p_88"},{"point":{"x":27,"y":7},"order":83,"id":"m_1_g_0_p_89"},{"point":{"x":28,"y":7},"order":84,"id":"m_1_g_0_p_90"},{"point":{"x":29,"y":7},"order":85,"id":"m_1_g_0_p_91"},{"point":{"x":30,"y":7},"order":86,"id":"m_1_g_0_p_92"},{"point":{"x":30,"y":6},"order":87,"id":"m_1_g_0_p_93"},{"point":{"x":29,"y":6},"order":88,"id":"m_1_g_0_p_94"},{"point":{"x":28,"y":6},"order":89,"id":"m_1_g_0_p_95"},{"point":{"x":32,"y":0},"order":90,"id":"m_1_g_0_p_97"},{"point":{"x":32,"y":1},"order":91,"id":"m_1_g_0_p_98"},{"point":{"x":31,"y":2},"order":92,"id":"m_1_g_0_p_99"},{"point":{"x":31,"y":3},"order":93,"id":"m_1_g_0_p_100"},{"point":{"x":31,"y":4},"order":94,"id":"m_1_g_0_p_101"},{"point":{"x":32,"y":4},"order":95,"id":"m_1_g_0_p_102"},{"point":{"x":32,"y":5},"order":96,"id":"m_1_g_0_p_103"},{"point":{"x":32,"y":3},"order":97,"id":"m_1_g_0_p_104"},{"point":{"x":32,"y":2},"order":98,"id":"m_1_g_0_p_105"},{"point":{"x":31,"y":5},"order":99,"id":"m_1_g_0_p_106"},{"point":{"x":31,"y":1},"order":100,"id":"m_1_g_0_p_107"},{"point":{"x":31,"y":0},"order":101,"id":"m_1_g_0_p_108"},{"point":{"x":7,"y":2},"order":102,"id":"m_1_g_0_p_109"},{"point":{"x":7,"y":3},"order":103,"id":"m_1_g_0_p_110"},{"point":{"x":39,"y":0},"order":104,"id":"m_1_g_0_p_111"},{"point":{"x":38,"y":0},"order":105,"id":"m_1_g_0_p_112"},{"point":{"x":37,"y":0},"order":106,"id":"m_1_g_0_p_113"},{"point":{"x":36,"y":0},"order":107,"id":"m_1_g_0_p_114"},{"point":{"x":35,"y":0},"order":108,"id":"m_1_g_0_p_115"},{"point":{"x":35,"y":1},"order":109,"id":"m_1_g_0_p_116"},{"point":{"x":36,"y":1},"order":110,"id":"m_1_g_0_p_117"},{"point":{"x":37,"y":1},"order":111,"id":"m_1_g_0_p_118"},{"point":{"x":38,"y":1},"order":112,"id":"m_1_g_0_p_119"},{"point":{"x":39,"y":1},"order":113,"id":"m_1_g_0_p_120"},{"point":{"x":40,"y":0},"order":114,"id":"m_1_g_0_p_121"},{"point":{"x":40,"y":1},"order":115,"id":"m_1_g_0_p_122"},{"point":{"x":41,"y":1},"order":116,"id":"m_1_g_0_p_123"},{"point":{"x":41,"y":0},"order":117,"id":"m_1_g_0_p_124"},{"point":{"x":35,"y":2},"order":118,"id":"m_1_g_0_p_125"},{"point":{"x":35,"y":3},"order":119,"id":"m_1_g_0_p_126"},{"point":{"x":36,"y":3},"order":120,"id":"m_1_g_0_p_127"},{"point":{"x":36,"y":2},"order":121,"id":"m_1_g_0_p_128"},{"point":{"x":37,"y":2},"order":122,"id":"m_1_g_0_p_133"},{"point":{"x":37,"y":3},"order":123,"id":"m_1_g_0_p_134"},{"point":{"x":38,"y":3},"order":124,"id":"m_1_g_0_p_135"},{"point":{"x":38,"y":2},"order":125,"id":"m_1_g_0_p_136"},{"point":{"x":39,"y":4},"order":126,"id":"m_1_g_0_p_137"},{"point":{"x":40,"y":4},"order":127,"id":"m_1_g_0_p_138"},{"point":{"x":41,"y":4},"order":128,"id":"m_1_g_0_p_139"},{"point":{"x":41,"y":5},"order":129,"id":"m_1_g_0_p_140"},{"point":{"x":40,"y":5},"order":130,"id":"m_1_g_0_p_141"},{"point":{"x":39,"y":5},"order":131,"id":"m_1_g_0_p_142"},{"point":{"x":42,"y":0},"order":132,"id":"m_1_g_0_p_143"},{"point":{"x":42,"y":1},"order":133,"id":"m_1_g_0_p_144"},{"point":{"x":42,"y":4},"order":134,"id":"m_1_g_0_p_145"},{"point":{"x":42,"y":5},"order":135,"id":"m_1_g_0_p_146"},{"point":{"x":42,"y":6},"order":136,"id":"m_1_g_0_p_147"},{"point":{"x":41,"y":6},"order":137,"id":"m_1_g_0_p_148"},{"point":{"x":40,"y":6},"order":138,"id":"m_1_g_0_p_149"},{"point":{"x":39,"y":6},"order":139,"id":"m_1_g_0_p_150"},{"point":{"x":38,"y":6},"order":140,"id":"m_1_g_0_p_151"},{"point":{"x":37,"y":6},"order":141,"id":"m_1_g_0_p_152"},{"point":{"x":36,"y":6},"order":142,"id":"m_1_g_0_p_153"},{"point":{"x":35,"y":6},"order":143,"id":"m_1_g_0_p_154"},{"point":{"x":36,"y":7},"order":144,"id":"m_1_g_0_p_155"},{"point":{"x":35,"y":7},"order":145,"id":"m_1_g_0_p_156"},{"point":{"x":37,"y":7},"order":146,"id":"m_1_g_0_p_157"},{"point":{"x":38,"y":7},"order":147,"id":"m_1_g_0_p_158"},{"point":{"x":39,"y":7},"order":148,"id":"m_1_g_0_p_159"},{"point":{"x":40,"y":7},"order":149,"id":"m_1_g_0_p_160"},{"point":{"x":41,"y":7},"order":150,"id":"m_1_g_0_p_161"},{"point":{"x":42,"y":7},"order":151,"id":"m_1_g_0_p_162"},{"point":{"x":45,"y":0},"order":152,"id":"m_1_g_0_p_163"},{"point":{"x":45,"y":1},"order":153,"id":"m_1_g_0_p_164"},{"point":{"x":45,"y":2},"order":154,"id":"m_1_g_0_p_165"},{"point":{"x":45,"y":3},"order":155,"id":"m_1_g_0_p_166"},{"point":{"x":45,"y":4},"order":156,"id":"m_1_g_0_p_167"},{"point":{"x":46,"y":4},"order":157,"id":"m_1_g_0_p_168"},{"point":{"x":46,"y":3},"order":158,"id":"m_1_g_0_p_169"},{"point":{"x":46,"y":2},"order":159,"id":"m_1_g_0_p_170"},{"point":{"x":46,"y":1},"order":160,"id":"m_1_g_0_p_171"},{"point":{"x":46,"y":0},"order":161,"id":"m_1_g_0_p_172"},{"point":{"x":45,"y":5},"order":162,"id":"m_1_g_0_p_173"},{"point":{"x":46,"y":5},"order":163,"id":"m_1_g_0_p_174"},{"point":{"x":47,"y":5},"order":164,"id":"m_1_g_0_p_175"},{"point":{"x":47,"y":4},"order":165,"id":"m_1_g_0_p_176"},{"point":{"x":48,"y":4},"order":166,"id":"m_1_g_0_p_177"},{"point":{"x":48,"y":5},"order":167,"id":"m_1_g_0_p_178"},{"point":{"x":49,"y":4},"order":168,"id":"m_1_g_0_p_179"},{"point":{"x":49,"y":5},"order":169,"id":"m_1_g_0_p_180"},{"point":{"x":50,"y":5},"order":170,"id":"m_1_g_0_p_181"},{"point":{"x":50,"y":4},"order":171,"id":"m_1_g_0_p_182"},{"point":{"x":49,"y":0},"order":172,"id":"m_1_g_0_p_183"},{"point":{"x":49,"y":1},"order":173,"id":"m_1_g_0_p_184"},{"point":{"x":49,"y":2},"order":174,"id":"m_1_g_0_p_185"},{"point":{"x":49,"y":3},"order":175,"id":"m_1_g_0_p_186"},{"point":{"x":51,"y":4},"order":176,"id":"m_1_g_0_p_187"},{"point":{"x":51,"y":5},"order":177,"id":"m_1_g_0_p_188"},{"point":{"x":49,"y":6},"order":178,"id":"m_1_g_0_p_189"},{"point":{"x":49,"y":7},"order":179,"id":"m_1_g_0_p_190"},{"point":{"x":50,"y":7},"order":180,"id":"m_1_g_0_p_191"},{"point":{"x":50,"y":6},"order":181,"id":"m_1_g_0_p_192"},{"point":{"x":52,"y":5},"order":182,"id":"m_1_g_0_p_193"},{"point":{"x":52,"y":4},"order":183,"id":"m_1_g_0_p_194"},{"point":{"x":50,"y":3},"order":184,"id":"m_1_g_0_p_195"},{"point":{"x":50,"y":2},"order":185,"id":"m_1_g_0_p_196"},{"point":{"x":50,"y":1},"order":186,"id":"m_1_g_0_p_197"},{"point":{"x":50,"y":0},"order":187,"id":"m_1_g_0_p_198"},{"point":{"x":55,"y":6},"order":188,"id":"m_1_g_0_p_199"},{"point":{"x":55,"y":7},"order":189,"id":"m_1_g_0_p_200"},{"point":{"x":56,"y":7},"order":190,"id":"m_1_g_0_p_201"},{"point":{"x":57,"y":7},"order":191,"id":"m_1_g_0_p_202"},{"point":{"x":58,"y":7},"order":192,"id":"m_1_g_0_p_203"},{"point":{"x":58,"y":6},"order":193,"id":"m_1_g_0_p_204"},{"point":{"x":59,"y":7},"order":194,"id":"m_1_g_0_p_205"},{"point":{"x":59,"y":6},"order":195,"id":"m_1_g_0_p_206"},{"point":{"x":56,"y":6},"order":196,"id":"m_1_g_0_p_207"},{"point":{"x":57,"y":6},"order":197,"id":"m_1_g_0_p_208"},{"point":{"x":60,"y":6},"order":198,"id":"m_1_g_0_p_209"},{"point":{"x":60,"y":7},"order":199,"id":"m_1_g_0_p_210"},{"point":{"x":57,"y":5},"order":200,"id":"m_1_g_0_p_211"},{"point":{"x":57,"y":4},"order":201,"id":"m_1_g_0_p_212"},{"point":{"x":57,"y":3},"order":202,"id":"m_1_g_0_p_213"},{"point":{"x":57,"y":2},"order":203,"id":"m_1_g_0_p_214"},{"point":{"x":57,"y":1},"order":204,"id":"m_1_g_0_p_215"},{"point":{"x":57,"y":0},"order":205,"id":"m_1_g_0_p_216"},{"point":{"x":58,"y":0},"order":206,"id":"m_1_g_0_p_217"},{"point":{"x":58,"y":1},"order":207,"id":"m_1_g_0_p_218"},{"point":{"x":58,"y":2},"order":208,"id":"m_1_g_0_p_219"},{"point":{"x":58,"y":3},"order":209,"id":"m_1_g_0_p_220"},{"point":{"x":58,"y":4},"order":210,"id":"m_1_g_0_p_221"},{"point":{"x":58,"y":5},"order":211,"id":"m_1_g_0_p_222"},{"point":{"x":56,"y":0},"order":212,"id":"m_1_g_0_p_223"},{"point":{"x":55,"y":0},"order":213,"id":"m_1_g_0_p_224"},{"point":{"x":55,"y":1},"order":214,"id":"m_1_g_0_p_225"},{"point":{"x":56,"y":1},"order":215,"id":"m_1_g_0_p_226"}]}]}]}};
                /*
                {"general":{"originalSize":{"x":64,"y":8},"size":{"x":64,"y":8},"zoom":5,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"","visible":true,"groups":[{"order":0,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"id":"m_0_g_0","points":[{"point":{"x":1,"y":3},"order":0,"id":"m_0_g_0_p_26"},{"point":{"x":1,"y":4},"order":1,"id":"m_0_g_0_p_27"},{"point":{"x":1,"y":5},"order":2,"id":"m_0_g_0_p_28"},{"point":{"x":1,"y":6},"order":3,"id":"m_0_g_0_p_30"},{"point":{"x":2,"y":6},"order":4,"id":"m_0_g_0_p_31"},{"point":{"x":3,"y":6},"order":5,"id":"m_0_g_0_p_32"},{"point":{"x":0,"y":3},"order":6,"id":"m_0_g_0_p_104"},{"point":{"x":0,"y":4},"order":7,"id":"m_0_g_0_p_105"},{"point":{"x":0,"y":5},"order":8,"id":"m_0_g_0_p_106"},{"point":{"x":0,"y":6},"order":9,"id":"m_0_g_0_p_107"},{"point":{"x":3,"y":7},"order":10,"id":"m_0_g_0_p_108"},{"point":{"x":2,"y":7},"order":11,"id":"m_0_g_0_p_109"},{"point":{"x":1,"y":7},"order":12,"id":"m_0_g_0_p_110"},{"point":{"x":0,"y":7},"order":13,"id":"m_0_g_0_p_111"},{"point":{"x":1,"y":2},"order":14,"id":"m_0_g_0_p_112"},{"point":{"x":0,"y":2},"order":15,"id":"m_0_g_0_p_113"},{"point":{"x":8,"y":5},"order":16,"id":"m_0_g_0_p_114"},{"point":{"x":9,"y":5},"order":17,"id":"m_0_g_0_p_115"},{"point":{"x":9,"y":4},"order":18,"id":"m_0_g_0_p_116"},{"point":{"x":8,"y":4},"order":19,"id":"m_0_g_0_p_117"},{"point":{"x":10,"y":6},"order":20,"id":"m_0_g_0_p_118"},{"point":{"x":10,"y":7},"order":21,"id":"m_0_g_0_p_119"},{"point":{"x":11,"y":7},"order":22,"id":"m_0_g_0_p_120"},{"point":{"x":11,"y":6},"order":23,"id":"m_0_g_0_p_121"},{"point":{"x":8,"y":3},"order":24,"id":"m_0_g_0_p_122"},{"point":{"x":9,"y":3},"order":25,"id":"m_0_g_0_p_123"},{"point":{"x":9,"y":2},"order":26,"id":"m_0_g_0_p_124"},{"point":{"x":8,"y":2},"order":27,"id":"m_0_g_0_p_125"},{"point":{"x":10,"y":1},"order":28,"id":"m_0_g_0_p_126"},{"point":{"x":11,"y":1},"order":29,"id":"m_0_g_0_p_127"},{"point":{"x":11,"y":0},"order":30,"id":"m_0_g_0_p_128"},{"point":{"x":10,"y":0},"order":31,"id":"m_0_g_0_p_129"},{"point":{"x":12,"y":0},"order":32,"id":"m_0_g_0_p_130"},{"point":{"x":12,"y":1},"order":33,"id":"m_0_g_0_p_131"},{"point":{"x":13,"y":1},"order":34,"id":"m_0_g_0_p_132"},{"point":{"x":13,"y":0},"order":35,"id":"m_0_g_0_p_133"},{"point":{"x":14,"y":2},"order":36,"id":"m_0_g_0_p_135"},{"point":{"x":14,"y":3},"order":37,"id":"m_0_g_0_p_136"},{"point":{"x":14,"y":4},"order":38,"id":"m_0_g_0_p_137"},{"point":{"x":14,"y":5},"order":39,"id":"m_0_g_0_p_138"},{"point":{"x":15,"y":5},"order":40,"id":"m_0_g_0_p_139"},{"point":{"x":15,"y":4},"order":41,"id":"m_0_g_0_p_140"},{"point":{"x":15,"y":3},"order":42,"id":"m_0_g_0_p_141"},{"point":{"x":15,"y":2},"order":43,"id":"m_0_g_0_p_142"},{"point":{"x":13,"y":6},"order":44,"id":"m_0_g_0_p_143"},{"point":{"x":12,"y":6},"order":45,"id":"m_0_g_0_p_144"},{"point":{"x":12,"y":7},"order":46,"id":"m_0_g_0_p_145"},{"point":{"x":13,"y":7},"order":47,"id":"m_0_g_0_p_146"},{"point":{"x":4,"y":6},"order":48,"id":"m_0_g_0_p_147"},{"point":{"x":4,"y":7},"order":49,"id":"m_0_g_0_p_148"},{"point":{"x":5,"y":7},"order":50,"id":"m_0_g_0_p_149"},{"point":{"x":5,"y":6},"order":51,"id":"m_0_g_0_p_150"},{"point":{"x":1,"y":1},"order":52,"id":"m_0_g_0_p_151"},{"point":{"x":1,"y":0},"order":53,"id":"m_0_g_0_p_152"},{"point":{"x":0,"y":0},"order":54,"id":"m_0_g_0_p_153"},{"point":{"x":0,"y":1},"order":55,"id":"m_0_g_0_p_154"},{"point":{"x":18,"y":7},"order":56,"id":"m_0_g_0_p_155"},{"point":{"x":18,"y":6},"order":57,"id":"m_0_g_0_p_156"},{"point":{"x":19,"y":6},"order":58,"id":"m_0_g_0_p_157"},{"point":{"x":19,"y":7},"order":59,"id":"m_0_g_0_p_158"},{"point":{"x":18,"y":5},"order":60,"id":"m_0_g_0_p_159"},{"point":{"x":18,"y":4},"order":61,"id":"m_0_g_0_p_160"},{"point":{"x":19,"y":4},"order":62,"id":"m_0_g_0_p_161"},{"point":{"x":19,"y":5},"order":63,"id":"m_0_g_0_p_162"},{"point":{"x":18,"y":3},"order":64,"id":"m_0_g_0_p_163"},{"point":{"x":18,"y":2},"order":65,"id":"m_0_g_0_p_164"},{"point":{"x":19,"y":2},"order":66,"id":"m_0_g_0_p_165"},{"point":{"x":19,"y":3},"order":67,"id":"m_0_g_0_p_166"},{"point":{"x":20,"y":1},"order":68,"id":"m_0_g_0_p_167"},{"point":{"x":20,"y":0},"order":69,"id":"m_0_g_0_p_168"},{"point":{"x":21,"y":0},"order":70,"id":"m_0_g_0_p_169"},{"point":{"x":21,"y":1},"order":71,"id":"m_0_g_0_p_170"},{"point":{"x":22,"y":0},"order":72,"id":"m_0_g_0_p_171"},{"point":{"x":23,"y":0},"order":73,"id":"m_0_g_0_p_172"},{"point":{"x":23,"y":1},"order":74,"id":"m_0_g_0_p_173"},{"point":{"x":22,"y":1},"order":75,"id":"m_0_g_0_p_174"},{"point":{"x":24,"y":2},"order":76,"id":"m_0_g_0_p_175"},{"point":{"x":24,"y":3},"order":77,"id":"m_0_g_0_p_176"},{"point":{"x":24,"y":4},"order":78,"id":"m_0_g_0_p_177"},{"point":{"x":24,"y":5},"order":79,"id":"m_0_g_0_p_178"},{"point":{"x":24,"y":6},"order":80,"id":"m_0_g_0_p_179"},{"point":{"x":24,"y":7},"order":81,"id":"m_0_g_0_p_180"},{"point":{"x":25,"y":7},"order":82,"id":"m_0_g_0_p_183"},{"point":{"x":25,"y":6},"order":83,"id":"m_0_g_0_p_184"},{"point":{"x":25,"y":5},"order":84,"id":"m_0_g_0_p_185"},{"point":{"x":25,"y":4},"order":85,"id":"m_0_g_0_p_186"},{"point":{"x":25,"y":3},"order":86,"id":"m_0_g_0_p_187"},{"point":{"x":25,"y":2},"order":87,"id":"m_0_g_0_p_188"},{"point":{"x":20,"y":5},"order":88,"id":"m_0_g_0_p_189"},{"point":{"x":21,"y":5},"order":89,"id":"m_0_g_0_p_190"},{"point":{"x":22,"y":5},"order":90,"id":"m_0_g_0_p_191"},{"point":{"x":23,"y":5},"order":91,"id":"m_0_g_0_p_192"},{"point":{"x":23,"y":4},"order":92,"id":"m_0_g_0_p_193"},{"point":{"x":22,"y":4},"order":93,"id":"m_0_g_0_p_194"},{"point":{"x":21,"y":4},"order":94,"id":"m_0_g_0_p_195"},{"point":{"x":20,"y":4},"order":95,"id":"m_0_g_0_p_196"},{"point":{"x":28,"y":0},"order":96,"id":"m_0_g_0_p_197"},{"point":{"x":28,"y":1},"order":97,"id":"m_0_g_0_p_198"},{"point":{"x":28,"y":2},"order":98,"id":"m_0_g_0_p_199"},{"point":{"x":28,"y":3},"order":99,"id":"m_0_g_0_p_200"},{"point":{"x":28,"y":4},"order":100,"id":"m_0_g_0_p_201"},{"point":{"x":28,"y":5},"order":101,"id":"m_0_g_0_p_202"},{"point":{"x":28,"y":6},"order":102,"id":"m_0_g_0_p_203"},{"point":{"x":28,"y":7},"order":103,"id":"m_0_g_0_p_204"},{"point":{"x":29,"y":0},"order":104,"id":"m_0_g_0_p_205"},{"point":{"x":29,"y":1},"order":105,"id":"m_0_g_0_p_206"},{"point":{"x":29,"y":2},"order":106,"id":"m_0_g_0_p_207"},{"point":{"x":29,"y":3},"order":107,"id":"m_0_g_0_p_208"},{"point":{"x":29,"y":4},"order":108,"id":"m_0_g_0_p_209"},{"point":{"x":29,"y":5},"order":109,"id":"m_0_g_0_p_210"},{"point":{"x":29,"y":6},"order":110,"id":"m_0_g_0_p_211"},{"point":{"x":29,"y":7},"order":111,"id":"m_0_g_0_p_212"},{"point":{"x":30,"y":7},"order":112,"id":"m_0_g_0_p_213"},{"point":{"x":31,"y":7},"order":113,"id":"m_0_g_0_p_214"},{"point":{"x":31,"y":6},"order":114,"id":"m_0_g_0_p_215"},{"point":{"x":30,"y":6},"order":115,"id":"m_0_g_0_p_216"},{"point":{"x":30,"y":0},"order":116,"id":"m_0_g_0_p_217"},{"point":{"x":31,"y":0},"order":117,"id":"m_0_g_0_p_218"},{"point":{"x":31,"y":1},"order":118,"id":"m_0_g_0_p_219"},{"point":{"x":30,"y":1},"order":119,"id":"m_0_g_0_p_220"},{"point":{"x":32,"y":0},"order":120,"id":"m_0_g_0_p_221"},{"point":{"x":32,"y":1},"order":121,"id":"m_0_g_0_p_222"},{"point":{"x":33,"y":1},"order":122,"id":"m_0_g_0_p_223"},{"point":{"x":33,"y":0},"order":123,"id":"m_0_g_0_p_224"},{"point":{"x":32,"y":6},"order":124,"id":"m_0_g_0_p_226"},{"point":{"x":32,"y":7},"order":125,"id":"m_0_g_0_p_227"},{"point":{"x":33,"y":7},"order":126,"id":"m_0_g_0_p_228"},{"point":{"x":33,"y":6},"order":127,"id":"m_0_g_0_p_229"},{"point":{"x":34,"y":2},"order":128,"id":"m_0_g_0_p_230"},{"point":{"x":34,"y":3},"order":129,"id":"m_0_g_0_p_231"},{"point":{"x":34,"y":4},"order":130,"id":"m_0_g_0_p_232"},{"point":{"x":34,"y":5},"order":131,"id":"m_0_g_0_p_233"},{"point":{"x":35,"y":5},"order":132,"id":"m_0_g_0_p_234"},{"point":{"x":35,"y":4},"order":133,"id":"m_0_g_0_p_235"},{"point":{"x":35,"y":3},"order":134,"id":"m_0_g_0_p_236"},{"point":{"x":35,"y":2},"order":135,"id":"m_0_g_0_p_237"},{"point":{"x":38,"y":0},"order":136,"id":"m_0_g_0_p_238"},{"point":{"x":38,"y":1},"order":137,"id":"m_0_g_0_p_239"},{"point":{"x":39,"y":1},"order":138,"id":"m_0_g_0_p_240"},{"point":{"x":39,"y":0},"order":139,"id":"m_0_g_0_p_241"},{"point":{"x":40,"y":0},"order":140,"id":"m_0_g_0_p_242"},{"point":{"x":41,"y":0},"order":141,"id":"m_0_g_0_p_243"},{"point":{"x":41,"y":1},"order":142,"id":"m_0_g_0_p_244"},{"point":{"x":40,"y":1},"order":143,"id":"m_0_g_0_p_245"},{"point":{"x":42,"y":0},"order":144,"id":"m_0_g_0_p_246"},{"point":{"x":43,"y":0},"order":145,"id":"m_0_g_0_p_247"},{"point":{"x":43,"y":1},"order":146,"id":"m_0_g_0_p_248"},{"point":{"x":42,"y":1},"order":147,"id":"m_0_g_0_p_249"},{"point":{"x":40,"y":2},"order":148,"id":"m_0_g_0_p_250"},{"point":{"x":40,"y":3},"order":149,"id":"m_0_g_0_p_251"},{"point":{"x":40,"y":4},"order":150,"id":"m_0_g_0_p_252"},{"point":{"x":40,"y":5},"order":151,"id":"m_0_g_0_p_253"},{"point":{"x":40,"y":6},"order":152,"id":"m_0_g_0_p_254"},{"point":{"x":40,"y":7},"order":153,"id":"m_0_g_0_p_255"},{"point":{"x":41,"y":7},"order":154,"id":"m_0_g_0_p_256"},{"point":{"x":41,"y":6},"order":155,"id":"m_0_g_0_p_257"},{"point":{"x":41,"y":5},"order":156,"id":"m_0_g_0_p_258"},{"point":{"x":41,"y":4},"order":157,"id":"m_0_g_0_p_259"},{"point":{"x":41,"y":3},"order":158,"id":"m_0_g_0_p_260"},{"point":{"x":41,"y":2},"order":159,"id":"m_0_g_0_p_261"},{"point":{"x":39,"y":6},"order":160,"id":"m_0_g_0_p_262"},{"point":{"x":38,"y":6},"order":161,"id":"m_0_g_0_p_263"},{"point":{"x":38,"y":7},"order":162,"id":"m_0_g_0_p_265"},{"point":{"x":39,"y":7},"order":163,"id":"m_0_g_0_p_266"},{"point":{"x":42,"y":6},"order":164,"id":"m_0_g_0_p_267"},{"point":{"x":43,"y":6},"order":165,"id":"m_0_g_0_p_268"},{"point":{"x":43,"y":7},"order":166,"id":"m_0_g_0_p_269"},{"point":{"x":42,"y":7},"order":167,"id":"m_0_g_0_p_270"},{"point":{"x":46,"y":0},"order":168,"id":"m_0_g_0_p_271"},{"point":{"x":46,"y":1},"order":169,"id":"m_0_g_0_p_272"},{"point":{"x":46,"y":2},"order":170,"id":"m_0_g_0_p_273"},{"point":{"x":46,"y":3},"order":171,"id":"m_0_g_0_p_274"},{"point":{"x":46,"y":4},"order":172,"id":"m_0_g_0_p_275"},{"point":{"x":46,"y":5},"order":173,"id":"m_0_g_0_p_276"},{"point":{"x":46,"y":6},"order":174,"id":"m_0_g_0_p_277"},{"point":{"x":46,"y":7},"order":175,"id":"m_0_g_0_p_278"},{"point":{"x":47,"y":7},"order":176,"id":"m_0_g_0_p_279"},{"point":{"x":47,"y":6},"order":177,"id":"m_0_g_0_p_280"},{"point":{"x":47,"y":5},"order":178,"id":"m_0_g_0_p_281"},{"point":{"x":47,"y":4},"order":179,"id":"m_0_g_0_p_282"},{"point":{"x":47,"y":3},"order":180,"id":"m_0_g_0_p_283"},{"point":{"x":47,"y":2},"order":181,"id":"m_0_g_0_p_284"},{"point":{"x":47,"y":1},"order":182,"id":"m_0_g_0_p_285"},{"point":{"x":47,"y":0},"order":183,"id":"m_0_g_0_p_286"},{"point":{"x":48,"y":2},"order":184,"id":"m_0_g_0_p_287"},{"point":{"x":48,"y":3},"order":185,"id":"m_0_g_0_p_288"},{"point":{"x":49,"y":3},"order":186,"id":"m_0_g_0_p_289"},{"point":{"x":49,"y":2},"order":187,"id":"m_0_g_0_p_290"},{"point":{"x":50,"y":4},"order":188,"id":"m_0_g_0_p_291"},{"point":{"x":50,"y":5},"order":189,"id":"m_0_g_0_p_292"},{"point":{"x":51,"y":5},"order":190,"id":"m_0_g_0_p_293"},{"point":{"x":51,"y":4},"order":191,"id":"m_0_g_0_p_294"},{"point":{"x":52,"y":0},"order":192,"id":"m_0_g_0_p_295"},{"point":{"x":52,"y":1},"order":193,"id":"m_0_g_0_p_296"},{"point":{"x":52,"y":2},"order":194,"id":"m_0_g_0_p_297"},{"point":{"x":52,"y":3},"order":195,"id":"m_0_g_0_p_298"},{"point":{"x":52,"y":4},"order":196,"id":"m_0_g_0_p_299"},{"point":{"x":52,"y":5},"order":197,"id":"m_0_g_0_p_300"},{"point":{"x":52,"y":6},"order":198,"id":"m_0_g_0_p_301"},{"point":{"x":52,"y":7},"order":199,"id":"m_0_g_0_p_302"},{"point":{"x":53,"y":7},"order":200,"id":"m_0_g_0_p_303"},{"point":{"x":53,"y":6},"order":201,"id":"m_0_g_0_p_304"},{"point":{"x":53,"y":5},"order":202,"id":"m_0_g_0_p_305"},{"point":{"x":53,"y":4},"order":203,"id":"m_0_g_0_p_306"},{"point":{"x":53,"y":3},"order":204,"id":"m_0_g_0_p_307"},{"point":{"x":53,"y":2},"order":205,"id":"m_0_g_0_p_308"},{"point":{"x":53,"y":1},"order":206,"id":"m_0_g_0_p_309"},{"point":{"x":53,"y":0},"order":207,"id":"m_0_g_0_p_310"},{"point":{"x":56,"y":0},"order":208,"id":"m_0_g_0_p_311"},{"point":{"x":56,"y":1},"order":209,"id":"m_0_g_0_p_312"},{"point":{"x":56,"y":2},"order":210,"id":"m_0_g_0_p_313"},{"point":{"x":56,"y":3},"order":211,"id":"m_0_g_0_p_314"},{"point":{"x":56,"y":4},"order":212,"id":"m_0_g_0_p_315"},{"point":{"x":56,"y":5},"order":213,"id":"m_0_g_0_p_316"},{"point":{"x":56,"y":6},"order":214,"id":"m_0_g_0_p_317"},{"point":{"x":56,"y":7},"order":215,"id":"m_0_g_0_p_318"},{"point":{"x":57,"y":7},"order":216,"id":"m_0_g_0_p_319"},{"point":{"x":57,"y":6},"order":217,"id":"m_0_g_0_p_320"},{"point":{"x":57,"y":5},"order":218,"id":"m_0_g_0_p_321"},{"point":{"x":57,"y":4},"order":219,"id":"m_0_g_0_p_322"},{"point":{"x":57,"y":3},"order":220,"id":"m_0_g_0_p_323"},{"point":{"x":57,"y":2},"order":221,"id":"m_0_g_0_p_324"},{"point":{"x":57,"y":1},"order":222,"id":"m_0_g_0_p_325"},{"point":{"x":57,"y":0},"order":223,"id":"m_0_g_0_p_326"},{"point":{"x":58,"y":0},"order":224,"id":"m_0_g_0_p_327"},{"point":{"x":59,"y":0},"order":225,"id":"m_0_g_0_p_328"},{"point":{"x":59,"y":1},"order":226,"id":"m_0_g_0_p_329"},{"point":{"x":58,"y":1},"order":227,"id":"m_0_g_0_p_330"},{"point":{"x":60,"y":0},"order":228,"id":"m_0_g_0_p_331"},{"point":{"x":61,"y":0},"order":229,"id":"m_0_g_0_p_332"},{"point":{"x":61,"y":1},"order":230,"id":"m_0_g_0_p_333"},{"point":{"x":60,"y":1},"order":231,"id":"m_0_g_0_p_334"},{"point":{"x":62,"y":0},"order":232,"id":"m_0_g_0_p_335"},{"point":{"x":63,"y":0},"order":233,"id":"m_0_g_0_p_336"},{"point":{"x":63,"y":1},"order":234,"id":"m_0_g_0_p_337"},{"point":{"x":62,"y":1},"order":235,"id":"m_0_g_0_p_338"},{"point":{"x":58,"y":6},"order":236,"id":"m_0_g_0_p_339"},{"point":{"x":59,"y":6},"order":237,"id":"m_0_g_0_p_340"},{"point":{"x":60,"y":6},"order":238,"id":"m_0_g_0_p_341"},{"point":{"x":61,"y":6},"order":239,"id":"m_0_g_0_p_342"},{"point":{"x":62,"y":6},"order":240,"id":"m_0_g_0_p_343"},{"point":{"x":63,"y":6},"order":241,"id":"m_0_g_0_p_344"},{"point":{"x":63,"y":7},"order":242,"id":"m_0_g_0_p_345"},{"point":{"x":62,"y":7},"order":243,"id":"m_0_g_0_p_346"},{"point":{"x":61,"y":7},"order":244,"id":"m_0_g_0_p_347"},{"point":{"x":60,"y":7},"order":245,"id":"m_0_g_0_p_348"},{"point":{"x":59,"y":7},"order":246,"id":"m_0_g_0_p_349"},{"point":{"x":58,"y":7},"order":247,"id":"m_0_g_0_p_350"},{"point":{"x":62,"y":5},"order":248,"id":"m_0_g_0_p_351"},{"point":{"x":62,"y":4},"order":249,"id":"m_0_g_0_p_352"},{"point":{"x":63,"y":5},"order":250,"id":"m_0_g_0_p_353"},{"point":{"x":63,"y":4},"order":251,"id":"m_0_g_0_p_354"}]}]}]}}*/

                let loadingPointsData = animationHelpers.extractPointData(loadingDots.main.layers[0])
                    .map(pd => pd.point).map(p => { 
                        return new V2(p.x + size.x/2 - 32, p.y + size.y/2 - 4 - 1).toInt()
                     });

                let sharedPP = undefined;
                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                    sharedPP = new PP({ctx});
                })


                let lineMovementFCount = 100;
                let lowerXShift = -30;
                let lineDots = sharedPP.lineV2(new V2(lowerXShift, size.y), new V2(0, 0));
                let xChangeValues = easing.fast({from: lowerXShift, to: size.x -lowerXShift , steps: lineMovementFCount, type: 'linear', method: 'base', round: 0 });

                let dotVisibleClamps = [75,100];
                let dotAppearanceShift = [0, 20];

                let itemsData = [];
                let matrix = {};
                for(let f = 0; f < lineMovementFCount; f++){
                    if(f == 0)
                        continue;

                    let xDelta = xChangeValues[f] - xChangeValues[f-1];                    
                    lineDots.forEach(ld => {
                        for(let i = 0; i < xDelta; i++){
                            let p = new V2(ld.x + xChangeValues[f] -i, ld.y);
                            let key = p.x + '_' + p.y;
                            if(matrix[key])
                                continue;

                            matrix[key] = true;

                            let startFrameIndex = f + getRandomInt(dotAppearanceShift[0],dotAppearanceShift[1])
                            let totalFrames = getRandomInt(dotVisibleClamps[0], dotVisibleClamps[1]);

                            let halfFrames = fast.r(totalFrames/2);
                            let quaterFrames = fast.r(halfFrames/2);

                            let vValues = [
                                ...easing.fast({from: 0, to: 20, steps: quaterFrames, type: 'quad', method: 'inOut', round: 0}),
                                ...new Array(halfFrames).fill(20),
                                ...easing.fast({from: 20, to: 0, steps: quaterFrames, type: 'quad', method: 'inOut', round: 0}),
                            ]

                            let frames = [];
                            for(let f1 = 0; f1 < totalFrames; f1++){
                                let frameIndex = f1 + startFrameIndex;
                                let v = vValues[f1];
                                if(v == undefined)
                                    v = 0;

                                let vChangeType = 0;
                                if(f1 < quaterFrames)
                                    vChangeType = 1;
                                else if(f1 > (halfFrames + quaterFrames))
                                    vChangeType = 2;

                                frames[frameIndex] = {
                                    visible: true,
                                    v,
                                    vChangeType
                                };
                            }

                            itemsData.push({
                                p,
                                frames
                            })
                        }

                    });
                    
                }
                
                let framesCount = lineMovementFCount + dotAppearanceShift[1] + dotVisibleClamps[1];

                let awaylableColors = new Array(21).fill().map((el, i) => {
                    return colors.colorTypeConverter({ value: { h: 0, s: 0, v: i*5 }, fromType: 'hsv', toType: 'hex'})
                })

                let lpdXShiftShange = easing.fast({from: -25, to: 25, steps: framesCount, type: 'sin', method: 'inOut', round: 0});
                let extraXShiftMax = 10;
                let extraXShift1 = easing.fast({ from: extraXShiftMax, to: 0, steps: 20, type: 'sin', method: 'out', round: 0 })
                let extraXShift2 = easing.fast({ from: -extraXShiftMax, to: 0, steps: 20, type: 'sin', method: 'in', round: 0 })

                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        

                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            if(itemData.frames[f]){
                                let v = itemData.frames[f].v;
                                
                                let lpdXShift = lpdXShiftShange[f];

                                if(type == 4 || type == 5){
                                    if(loadingPointsData.filter(pd => (pd.x+lpdXShift) == itemData.p.x && pd.y == itemData.p.y).length > 0){
                                        continue;
                                    }
                                }
                                else {
                                    if(loadingPointsData.filter(pd => (pd.x) == itemData.p.x && pd.y == itemData.p.y).length > 0){
                                        continue;
                                    }
                                }
                                
                                let color = awaylableColors[v]

                                if(type == 0) {
                                    if(itemData.p.x %2 == 0 && itemData.p.y % 2 == 0){
                                            hlp.setFillColor(color).dot(itemData.p)
                                    }
                                }

                                if(type == 1){
                                    if(itemData.p.x %2 == 0){
                                        hlp.setFillColor(color).dot(itemData.p)
                                    }
                                }
                                
                                if(type == 2 || type == 4){
                                    hlp.setFillColor(color).dot(itemData.p)
                                }

                                if(type == 3){
                                    if(itemData.p.y %2 == 0){
                                        hlp.setFillColor(color).dot(itemData.p)
                                    }
                                }

                                if(type == 5){
                                    let xShift = 0;
                                    if(itemData.frames[f].vChangeType == 1)
                                        xShift = extraXShift1[v]
                                    if(itemData.frames[f].vChangeType == 2)
                                        xShift = extraXShift2[v]

                                    if(itemData.p.x %2 == 0 && itemData.p.y % 2 == 0){
                                        hlp.setFillColor(awaylableColors[fast.r(v/2)]).dot(itemData.p.x + xShift, itemData.p.y)
                                        hlp.setFillColor(color).dot(itemData.p.x, itemData.p.y)
                                    }
                                }
                            }
                        }

                        // loadingPointsData.forEach(p => {
                        //     hlp.setFillColor('red').dot(p)
                        // })
                    });
                }
                
                return frames;
            },
            init() {
                let yShift = 10;
                // this.addChild(new GO({
                //     position: new V2(0, -this.size.y/2 + 15 + yShift).toInt(),
                //     size: new V2(this.size.x, 25),
                //     init() {
                //         let repeat = 5;
                //         this.frames = this.parent.createAnimationFrames({size: this.size, type: 2});
                //         this.registerFramesDefaultTimer({startFrameIndex: 0,
                //             framesChangeCallback: () => {
                //                 //let a = 10;
                //             },
                //             framesEndCallback: () => { 
                //                 repeat--;
                //                 if(repeat == 0)
                //                     this.parent.parentScene.capturing.stop = true; 
                //                 }
                //         });
                //     }
                // }))

                this.addChild(new GO({
                    position: new V2(0, -this.size.y/2 + 85 + yShift).toInt(),
                    size: new V2(this.size.x, 25),
                    init() {
                        this.frames = this.parent.createAnimationFrames({size: this.size, type: 1});
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => { 
                                this.parent.parentScene.capturing.stop = true; 
                            }
                        });
                    }
                }))

                // this.addChild(new GO({
                //     position: new V2(0, -this.size.y/2 + 75 + yShift).toInt(),
                //     size: new V2(this.size.x, 25),
                //     init() {
                //         this.frames = this.parent.createAnimationFrames({size: this.size, type: 3});
                //         this.registerFramesDefaultTimer({startFrameIndex: 100});
                //     }
                // }))

                // this.addChild(new GO({
                //     position: new V2(0, -this.size.y/2 + 105 + yShift).toInt(),
                //     size: new V2(this.size.x, 25),
                //     init() {
                //         this.frames = this.parent.createAnimationFrames({size: this.size, type: 0});
                //         this.registerFramesDefaultTimer({startFrameIndex: 150});
                //     }
                // }))

                // this.addChild(new GO({
                //     position: new V2(0, -this.size.y/2 + 135 + yShift).toInt(),
                //     size: new V2(this.size.x, 25),
                //     init() {
                //         this.frames = this.parent.createAnimationFrames({size: this.size, type: 4});
                //         this.registerFramesDefaultTimer({startFrameIndex: 0,
                //             framesChangeCallback: () => {
                //                 //let a = 10;
                //             }
                //         });
                //     }
                // }))

                // this.addChild(new GO({
                //     position: new V2(0, -this.size.y/2 + 165 + yShift).toInt(),
                //     size: new V2(this.size.x, 25),
                //     init() {
                //         this.frames = this.parent.createAnimationFrames({size: this.size, type: 5});
                //         this.registerFramesDefaultTimer({startFrameIndex: 50,
                //             framesChangeCallback: () => {
                //                 //let a = 10;
                //             }
                //         });
                //     }
                // }))
            }
        }), 1)
    }
}