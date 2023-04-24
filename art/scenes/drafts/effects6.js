class Effects6Scene extends Scene {
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
                size: new V2(200,200).mul(5),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'darkSea',
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
        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            img: createCanvas(V2.one, (ctx, size, hlp) => {
                hlp.setFillColor('black').dot(0,0)
            })
        }), 1)

        let shipImg = PP.createImage(
            {"general":{"originalSize":{"x":200,"y":200},"size":{"x":200,"y":200},"zoom":4,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"main","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#474747","strokeColorOpacity":1,"fillColor":"#474747","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_1","points":[{"point":{"x":93,"y":129},"order":0,"id":"m_0_g_1_p_0"},{"point":{"x":93,"y":115},"order":1,"id":"m_0_g_1_p_1"},{"point":{"x":111,"y":115},"order":2,"id":"m_0_g_1_p_2"},{"point":{"x":113,"y":114},"order":3,"id":"m_0_g_1_p_3"},{"point":{"x":114,"y":114},"order":4,"id":"m_0_g_1_p_4"},{"point":{"x":114,"y":129},"order":5,"id":"m_0_g_1_p_5"}]},{"order":1,"type":"lines","strokeColor":"#0d0d0d","strokeColorOpacity":1,"fillColor":"#0d0d0d","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_0","points":[{"point":{"x":58,"y":129},"order":0,"id":"m_0_g_0_p_0"},{"point":{"x":96,"y":129},"order":1,"id":"m_0_g_0_p_1"},{"point":{"x":100,"y":128},"order":2,"id":"m_0_g_0_p_2"},{"point":{"x":107,"y":125},"order":3,"id":"m_0_g_0_p_3"},{"point":{"x":112,"y":124},"order":4,"id":"m_0_g_0_p_4"},{"point":{"x":113,"y":124},"order":5,"id":"m_0_g_0_p_5"},{"point":{"x":121,"y":122},"order":6,"id":"m_0_g_0_p_6"},{"point":{"x":128,"y":120},"order":7,"id":"m_0_g_0_p_7"},{"point":{"x":132,"y":120},"order":8,"id":"m_0_g_0_p_8"},{"point":{"x":128,"y":131},"order":9,"id":"m_0_g_0_p_9"},{"point":{"x":124,"y":140},"order":10,"id":"m_0_g_0_p_10"},{"point":{"x":59,"y":140},"order":11,"id":"m_0_g_0_p_11"},{"point":{"x":58,"y":134},"order":12,"id":"m_0_g_0_p_12"},{"point":{"x":57,"y":131},"order":13,"id":"m_0_g_0_p_13"},{"point":{"x":57,"y":129},"order":14,"id":"m_0_g_0_p_14"}]},{"order":2,"type":"lines","strokeColor":"#666666","strokeColorOpacity":1,"fillColor":"#666666","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_2","points":[{"point":{"x":95,"y":123},"order":0,"id":"m_0_g_2_p_0"},{"point":{"x":95,"y":119},"order":1,"id":"m_0_g_2_p_1"},{"point":{"x":107,"y":119},"order":2,"id":"m_0_g_2_p_2"},{"point":{"x":107,"y":123},"order":3,"id":"m_0_g_2_p_3"}]},{"order":3,"type":"dots","strokeColor":"#474747","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_3","points":[{"point":{"x":99,"y":119},"order":0,"id":"m_0_g_3_p_0"},{"point":{"x":99,"y":120},"order":1,"id":"m_0_g_3_p_1"},{"point":{"x":99,"y":121},"order":2,"id":"m_0_g_3_p_2"},{"point":{"x":99,"y":122},"order":3,"id":"m_0_g_3_p_3"},{"point":{"x":99,"y":123},"order":4,"id":"m_0_g_3_p_4"},{"point":{"x":103,"y":119},"order":5,"id":"m_0_g_3_p_5"},{"point":{"x":103,"y":120},"order":6,"id":"m_0_g_3_p_6"},{"point":{"x":103,"y":121},"order":7,"id":"m_0_g_3_p_7"},{"point":{"x":103,"y":122},"order":8,"id":"m_0_g_3_p_8"},{"point":{"x":103,"y":123},"order":9,"id":"m_0_g_3_p_9"}]},{"order":4,"type":"lines","strokeColor":"#666666","strokeColorOpacity":1,"fillColor":"#666666","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_4","points":[{"point":{"x":110,"y":118},"order":0,"id":"m_0_g_4_p_4"},{"point":{"x":112,"y":118},"order":1,"id":"m_0_g_4_p_5"},{"point":{"x":112,"y":122},"order":2,"id":"m_0_g_4_p_6"},{"point":{"x":110,"y":122},"order":3,"id":"m_0_g_4_p_7"}]},{"order":5,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_5","points":[]},{"order":6,"type":"lines","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_6","points":[{"point":{"x":57,"y":129},"order":0,"id":"m_0_g_6_p_0"},{"point":{"x":98,"y":129},"order":1,"id":"m_0_g_6_p_1"},{"point":{"x":99,"y":128},"order":2,"id":"m_0_g_6_p_2"},{"point":{"x":101,"y":128},"order":3,"id":"m_0_g_6_p_3"},{"point":{"x":106,"y":125},"order":4,"id":"m_0_g_6_p_4"},{"point":{"x":109,"y":125},"order":5,"id":"m_0_g_6_p_5"},{"point":{"x":110,"y":124},"order":6,"id":"m_0_g_6_p_6"},{"point":{"x":114,"y":124},"order":7,"id":"m_0_g_6_p_7"},{"point":{"x":121,"y":122},"order":8,"id":"m_0_g_6_p_8"},{"point":{"x":122,"y":122},"order":9,"id":"m_0_g_6_p_9"},{"point":{"x":123,"y":121},"order":10,"id":"m_0_g_6_p_10"},{"point":{"x":126,"y":121},"order":11,"id":"m_0_g_6_p_11"},{"point":{"x":127,"y":120},"order":12,"id":"m_0_g_6_p_12"},{"point":{"x":131,"y":120},"order":13,"id":"m_0_g_6_p_13"}]},{"order":7,"type":"lines","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_7","points":[{"point":{"x":57,"y":132},"order":0,"id":"m_0_g_7_p_0"},{"point":{"x":57,"y":129},"order":1,"id":"m_0_g_7_p_1"}]},{"order":8,"type":"lines","strokeColor":"#0d0d0d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_13","points":[{"point":{"x":130,"y":119},"order":0,"id":"m_0_g_13_p_0"},{"point":{"x":92,"y":91},"order":1,"id":"m_0_g_13_p_1"},{"point":{"x":64,"y":99},"order":2,"id":"m_0_g_13_p_2"},{"point":{"x":82,"y":129},"order":3,"id":"m_0_g_13_p_3"}]},{"order":9,"type":"lines","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#2b2b2b","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_8","points":[{"point":{"x":57,"y":132},"order":0,"id":"m_0_g_8_p_0"},{"point":{"x":79,"y":133},"order":1,"id":"m_0_g_8_p_1"},{"point":{"x":105,"y":133},"order":2,"id":"m_0_g_8_p_2"},{"point":{"x":129,"y":129},"order":3,"id":"m_0_g_8_p_3"}]},{"order":10,"type":"lines","strokeColor":"#212121","strokeColorOpacity":1,"fillColor":"#212121","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_9","points":[{"point":{"x":92,"y":115},"order":0,"id":"m_0_g_9_p_0"},{"point":{"x":110,"y":115},"order":1,"id":"m_0_g_9_p_1"},{"point":{"x":111,"y":114},"order":2,"id":"m_0_g_9_p_2"},{"point":{"x":114,"y":114},"order":3,"id":"m_0_g_9_p_3"},{"point":{"x":112,"y":114},"order":4,"id":"m_0_g_9_p_4"},{"point":{"x":112,"y":115},"order":5,"id":"m_0_g_9_p_5"},{"point":{"x":105,"y":115},"order":6,"id":"m_0_g_9_p_6"},{"point":{"x":103,"y":116},"order":7,"id":"m_0_g_9_p_7"},{"point":{"x":92,"y":116},"order":8,"id":"m_0_g_9_p_8"}]},{"order":11,"type":"lines","strokeColor":"#5c5c5c","strokeColorOpacity":1,"fillColor":"#5c5c5c","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_10","points":[{"point":{"x":91,"y":128},"order":0,"id":"m_0_g_10_p_0"},{"point":{"x":91,"y":91},"order":1,"id":"m_0_g_10_p_1"}]},{"order":12,"type":"lines","strokeColor":"#5c5c5c","strokeColorOpacity":1,"fillColor":"#5c5c5c","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_11","points":[{"point":{"x":90,"y":120},"order":0,"id":"m_0_g_11_p_0"},{"point":{"x":64,"y":100},"order":1,"id":"m_0_g_11_p_1"}]},{"order":13,"type":"lines","strokeColor":"#666666","strokeColorOpacity":1,"fillColor":"#666666","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_12","points":[{"point":{"x":91,"y":128},"order":0,"id":"m_0_g_12_p_0"},{"point":{"x":91,"y":116},"order":1,"id":"m_0_g_12_p_1"}]},{"order":14,"type":"dots","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_14","points":[{"point":{"x":119,"y":125},"order":0,"id":"m_0_g_14_p_0"},{"point":{"x":120,"y":125},"order":1,"id":"m_0_g_14_p_1"},{"point":{"x":121,"y":125},"order":2,"id":"m_0_g_14_p_2"},{"point":{"x":121,"y":126},"order":3,"id":"m_0_g_14_p_3"},{"point":{"x":121,"y":127},"order":4,"id":"m_0_g_14_p_4"},{"point":{"x":120,"y":127},"order":5,"id":"m_0_g_14_p_5"},{"point":{"x":119,"y":127},"order":6,"id":"m_0_g_14_p_6"},{"point":{"x":119,"y":126},"order":7,"id":"m_0_g_14_p_7"}]},{"order":15,"type":"dots","strokeColor":"#363636","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_15","points":[{"point":{"x":120,"y":127},"order":0,"id":"m_0_g_15_p_0"},{"point":{"x":121,"y":126},"order":1,"id":"m_0_g_15_p_1"},{"point":{"x":120,"y":125},"order":2,"id":"m_0_g_15_p_2"},{"point":{"x":119,"y":126},"order":3,"id":"m_0_g_15_p_3"},{"point":{"x":126,"y":130},"order":4,"id":"m_0_g_15_p_4"},{"point":{"x":125,"y":130},"order":5,"id":"m_0_g_15_p_5"},{"point":{"x":124,"y":130},"order":6,"id":"m_0_g_15_p_6"},{"point":{"x":123,"y":130},"order":7,"id":"m_0_g_15_p_7"},{"point":{"x":122,"y":130},"order":8,"id":"m_0_g_15_p_8"},{"point":{"x":119,"y":131},"order":9,"id":"m_0_g_15_p_9"},{"point":{"x":117,"y":131},"order":10,"id":"m_0_g_15_p_13"},{"point":{"x":116,"y":131},"order":11,"id":"m_0_g_15_p_14"},{"point":{"x":118,"y":131},"order":12,"id":"m_0_g_15_p_15"},{"point":{"x":113,"y":132},"order":13,"id":"m_0_g_15_p_16"},{"point":{"x":112,"y":132},"order":14,"id":"m_0_g_15_p_17"},{"point":{"x":111,"y":132},"order":15,"id":"m_0_g_15_p_18"},{"point":{"x":110,"y":132},"order":16,"id":"m_0_g_15_p_19"},{"point":{"x":106,"y":133},"order":17,"id":"m_0_g_15_p_20"},{"point":{"x":105,"y":133},"order":18,"id":"m_0_g_15_p_21"},{"point":{"x":104,"y":133},"order":19,"id":"m_0_g_15_p_22"},{"point":{"x":103,"y":133},"order":20,"id":"m_0_g_15_p_23"},{"point":{"x":102,"y":133},"order":21,"id":"m_0_g_15_p_24"},{"point":{"x":101,"y":133},"order":22,"id":"m_0_g_15_p_25"},{"point":{"x":100,"y":133},"order":23,"id":"m_0_g_15_p_26"},{"point":{"x":99,"y":133},"order":24,"id":"m_0_g_15_p_27"},{"point":{"x":98,"y":133},"order":25,"id":"m_0_g_15_p_28"},{"point":{"x":97,"y":133},"order":26,"id":"m_0_g_15_p_29"},{"point":{"x":95,"y":133},"order":27,"id":"m_0_g_15_p_33"},{"point":{"x":96,"y":133},"order":28,"id":"m_0_g_15_p_34"},{"point":{"x":90,"y":133},"order":29,"id":"m_0_g_15_p_42"},{"point":{"x":91,"y":133},"order":30,"id":"m_0_g_15_p_43"},{"point":{"x":92,"y":133},"order":31,"id":"m_0_g_15_p_44"},{"point":{"x":93,"y":133},"order":32,"id":"m_0_g_15_p_45"},{"point":{"x":94,"y":133},"order":33,"id":"m_0_g_15_p_46"},{"point":{"x":89,"y":133},"order":34,"id":"m_0_g_15_p_47"},{"point":{"x":88,"y":133},"order":35,"id":"m_0_g_15_p_48"},{"point":{"x":87,"y":133},"order":36,"id":"m_0_g_15_p_49"},{"point":{"x":86,"y":133},"order":37,"id":"m_0_g_15_p_50"},{"point":{"x":85,"y":133},"order":38,"id":"m_0_g_15_p_51"},{"point":{"x":84,"y":133},"order":39,"id":"m_0_g_15_p_52"},{"point":{"x":83,"y":133},"order":40,"id":"m_0_g_15_p_53"},{"point":{"x":82,"y":133},"order":41,"id":"m_0_g_15_p_54"},{"point":{"x":81,"y":133},"order":42,"id":"m_0_g_15_p_55"},{"point":{"x":78,"y":133},"order":43,"id":"m_0_g_15_p_60"},{"point":{"x":77,"y":133},"order":44,"id":"m_0_g_15_p_61"},{"point":{"x":76,"y":133},"order":45,"id":"m_0_g_15_p_62"},{"point":{"x":75,"y":133},"order":46,"id":"m_0_g_15_p_63"},{"point":{"x":74,"y":133},"order":47,"id":"m_0_g_15_p_66"},{"point":{"x":79,"y":133},"order":48,"id":"m_0_g_15_p_67"},{"point":{"x":80,"y":133},"order":49,"id":"m_0_g_15_p_68"},{"point":{"x":60,"y":132},"order":50,"id":"m_0_g_15_p_69"},{"point":{"x":61,"y":132},"order":51,"id":"m_0_g_15_p_70"},{"point":{"x":62,"y":132},"order":52,"id":"m_0_g_15_p_71"},{"point":{"x":63,"y":132},"order":53,"id":"m_0_g_15_p_72"},{"point":{"x":64,"y":132},"order":54,"id":"m_0_g_15_p_73"},{"point":{"x":65,"y":132},"order":55,"id":"m_0_g_15_p_74"},{"point":{"x":66,"y":132},"order":56,"id":"m_0_g_15_p_75"},{"point":{"x":80,"y":129},"order":57,"id":"m_0_g_15_p_76"},{"point":{"x":81,"y":129},"order":58,"id":"m_0_g_15_p_77"},{"point":{"x":82,"y":129},"order":59,"id":"m_0_g_15_p_78"},{"point":{"x":84,"y":129},"order":60,"id":"m_0_g_15_p_82"},{"point":{"x":85,"y":129},"order":61,"id":"m_0_g_15_p_83"},{"point":{"x":83,"y":129},"order":62,"id":"m_0_g_15_p_84"},{"point":{"x":86,"y":129},"order":63,"id":"m_0_g_15_p_85"},{"point":{"x":87,"y":129},"order":64,"id":"m_0_g_15_p_86"},{"point":{"x":88,"y":129},"order":65,"id":"m_0_g_15_p_87"},{"point":{"x":89,"y":129},"order":66,"id":"m_0_g_15_p_88"},{"point":{"x":90,"y":129},"order":67,"id":"m_0_g_15_p_89"},{"point":{"x":91,"y":129},"order":68,"id":"m_0_g_15_p_90"},{"point":{"x":92,"y":129},"order":69,"id":"m_0_g_15_p_91"},{"point":{"x":93,"y":129},"order":70,"id":"m_0_g_15_p_92"},{"point":{"x":94,"y":129},"order":71,"id":"m_0_g_15_p_93"},{"point":{"x":95,"y":129},"order":72,"id":"m_0_g_15_p_94"},{"point":{"x":96,"y":129},"order":73,"id":"m_0_g_15_p_95"},{"point":{"x":97,"y":129},"order":74,"id":"m_0_g_15_p_96"},{"point":{"x":98,"y":129},"order":75,"id":"m_0_g_15_p_97"},{"point":{"x":99,"y":128},"order":76,"id":"m_0_g_15_p_98"},{"point":{"x":100,"y":128},"order":77,"id":"m_0_g_15_p_99"},{"point":{"x":101,"y":128},"order":78,"id":"m_0_g_15_p_100"},{"point":{"x":102,"y":127},"order":79,"id":"m_0_g_15_p_101"},{"point":{"x":103,"y":127},"order":80,"id":"m_0_g_15_p_102"},{"point":{"x":104,"y":126},"order":81,"id":"m_0_g_15_p_103"},{"point":{"x":105,"y":126},"order":82,"id":"m_0_g_15_p_104"},{"point":{"x":106,"y":125},"order":83,"id":"m_0_g_15_p_105"},{"point":{"x":107,"y":125},"order":84,"id":"m_0_g_15_p_106"},{"point":{"x":108,"y":125},"order":85,"id":"m_0_g_15_p_107"},{"point":{"x":109,"y":125},"order":86,"id":"m_0_g_15_p_108"},{"point":{"x":110,"y":124},"order":87,"id":"m_0_g_15_p_109"},{"point":{"x":111,"y":124},"order":88,"id":"m_0_g_15_p_110"},{"point":{"x":112,"y":124},"order":89,"id":"m_0_g_15_p_111"},{"point":{"x":113,"y":124},"order":90,"id":"m_0_g_15_p_112"},{"point":{"x":114,"y":124},"order":91,"id":"m_0_g_15_p_113"},{"point":{"x":115,"y":124},"order":92,"id":"m_0_g_15_p_114"},{"point":{"x":116,"y":123},"order":93,"id":"m_0_g_15_p_115"},{"point":{"x":117,"y":123},"order":94,"id":"m_0_g_15_p_116"},{"point":{"x":118,"y":123},"order":95,"id":"m_0_g_15_p_117"},{"point":{"x":120,"y":122},"order":96,"id":"m_0_g_15_p_118"},{"point":{"x":121,"y":122},"order":97,"id":"m_0_g_15_p_119"},{"point":{"x":123,"y":121},"order":98,"id":"m_0_g_15_p_120"},{"point":{"x":124,"y":121},"order":99,"id":"m_0_g_15_p_121"},{"point":{"x":125,"y":121},"order":100,"id":"m_0_g_15_p_122"},{"point":{"x":127,"y":120},"order":101,"id":"m_0_g_15_p_123"},{"point":{"x":128,"y":120},"order":102,"id":"m_0_g_15_p_124"},{"point":{"x":129,"y":120},"order":103,"id":"m_0_g_15_p_125"},{"point":{"x":130,"y":120},"order":104,"id":"m_0_g_15_p_126"}]},{"order":16,"type":"dots","strokeColor":"#525252","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_16","points":[{"point":{"x":91,"y":92},"order":0,"id":"m_0_g_16_p_0"},{"point":{"x":91,"y":93},"order":1,"id":"m_0_g_16_p_1"},{"point":{"x":91,"y":94},"order":2,"id":"m_0_g_16_p_2"},{"point":{"x":91,"y":95},"order":3,"id":"m_0_g_16_p_3"},{"point":{"x":91,"y":96},"order":4,"id":"m_0_g_16_p_4"},{"point":{"x":91,"y":97},"order":5,"id":"m_0_g_16_p_5"},{"point":{"x":91,"y":98},"order":6,"id":"m_0_g_16_p_6"},{"point":{"x":91,"y":99},"order":7,"id":"m_0_g_16_p_7"},{"point":{"x":91,"y":100},"order":8,"id":"m_0_g_16_p_8"},{"point":{"x":91,"y":101},"order":9,"id":"m_0_g_16_p_9"},{"point":{"x":91,"y":102},"order":10,"id":"m_0_g_16_p_10"},{"point":{"x":91,"y":103},"order":11,"id":"m_0_g_16_p_11"},{"point":{"x":91,"y":104},"order":12,"id":"m_0_g_16_p_12"},{"point":{"x":91,"y":105},"order":13,"id":"m_0_g_16_p_13"},{"point":{"x":91,"y":106},"order":14,"id":"m_0_g_16_p_14"},{"point":{"x":91,"y":107},"order":15,"id":"m_0_g_16_p_15"},{"point":{"x":91,"y":108},"order":16,"id":"m_0_g_16_p_16"},{"point":{"x":65,"y":101},"order":17,"id":"m_0_g_16_p_17"},{"point":{"x":66,"y":102},"order":18,"id":"m_0_g_16_p_18"},{"point":{"x":67,"y":102},"order":19,"id":"m_0_g_16_p_21"},{"point":{"x":68,"y":103},"order":20,"id":"m_0_g_16_p_22"},{"point":{"x":69,"y":104},"order":21,"id":"m_0_g_16_p_23"},{"point":{"x":70,"y":105},"order":22,"id":"m_0_g_16_p_24"},{"point":{"x":71,"y":105},"order":23,"id":"m_0_g_16_p_25"},{"point":{"x":72,"y":106},"order":24,"id":"m_0_g_16_p_26"},{"point":{"x":73,"y":107},"order":25,"id":"m_0_g_16_p_27"},{"point":{"x":74,"y":108},"order":26,"id":"m_0_g_16_p_28"},{"point":{"x":75,"y":108},"order":27,"id":"m_0_g_16_p_29"},{"point":{"x":76,"y":109},"order":28,"id":"m_0_g_16_p_30"},{"point":{"x":77,"y":110},"order":29,"id":"m_0_g_16_p_31"},{"point":{"x":78,"y":111},"order":30,"id":"m_0_g_16_p_32"}]},{"order":17,"type":"lines","strokeColor":"#0d0d0d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_25","points":[{"point":{"x":36,"y":140},"order":0,"id":"m_0_g_25_p_0"},{"point":{"x":178,"y":140},"order":1,"id":"m_0_g_25_p_1"}]},{"order":18,"type":"dots","strokeColor":"#474747","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_17","points":[{"point":{"x":91,"y":92},"order":0,"id":"m_0_g_17_p_0"},{"point":{"x":91,"y":93},"order":1,"id":"m_0_g_17_p_1"},{"point":{"x":91,"y":94},"order":2,"id":"m_0_g_17_p_2"},{"point":{"x":91,"y":95},"order":3,"id":"m_0_g_17_p_3"},{"point":{"x":91,"y":96},"order":4,"id":"m_0_g_17_p_4"},{"point":{"x":91,"y":97},"order":5,"id":"m_0_g_17_p_5"},{"point":{"x":91,"y":98},"order":6,"id":"m_0_g_17_p_6"},{"point":{"x":91,"y":99},"order":7,"id":"m_0_g_17_p_7"},{"point":{"x":91,"y":100},"order":8,"id":"m_0_g_17_p_8"},{"point":{"x":91,"y":101},"order":9,"id":"m_0_g_17_p_9"},{"point":{"x":65,"y":101},"order":10,"id":"m_0_g_17_p_10"},{"point":{"x":66,"y":102},"order":11,"id":"m_0_g_17_p_11"},{"point":{"x":67,"y":102},"order":12,"id":"m_0_g_17_p_12"},{"point":{"x":68,"y":103},"order":13,"id":"m_0_g_17_p_13"},{"point":{"x":69,"y":104},"order":14,"id":"m_0_g_17_p_14"},{"point":{"x":70,"y":105},"order":15,"id":"m_0_g_17_p_15"},{"point":{"x":71,"y":105},"order":16,"id":"m_0_g_17_p_16"},{"point":{"x":72,"y":106},"order":17,"id":"m_0_g_17_p_17"},{"point":{"x":73,"y":107},"order":18,"id":"m_0_g_17_p_18"}]},{"order":19,"type":"dots","strokeColor":"#3d3d3d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_18","points":[{"point":{"x":91,"y":92},"order":0,"id":"m_0_g_18_p_0"},{"point":{"x":91,"y":93},"order":1,"id":"m_0_g_18_p_1"},{"point":{"x":91,"y":94},"order":2,"id":"m_0_g_18_p_2"},{"point":{"x":91,"y":95},"order":3,"id":"m_0_g_18_p_3"},{"point":{"x":65,"y":101},"order":4,"id":"m_0_g_18_p_4"},{"point":{"x":67,"y":102},"order":5,"id":"m_0_g_18_p_5"},{"point":{"x":66,"y":102},"order":6,"id":"m_0_g_18_p_6"},{"point":{"x":68,"y":103},"order":7,"id":"m_0_g_18_p_7"}]},{"order":20,"type":"dots","strokeColor":"#171717","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_19","points":[{"point":{"x":57,"y":129},"order":0,"id":"m_0_g_19_p_0"},{"point":{"x":58,"y":129},"order":1,"id":"m_0_g_19_p_5"},{"point":{"x":59,"y":129},"order":2,"id":"m_0_g_19_p_6"},{"point":{"x":60,"y":129},"order":3,"id":"m_0_g_19_p_7"},{"point":{"x":61,"y":129},"order":4,"id":"m_0_g_19_p_8"},{"point":{"x":62,"y":129},"order":5,"id":"m_0_g_19_p_9"},{"point":{"x":63,"y":129},"order":6,"id":"m_0_g_19_p_10"},{"point":{"x":64,"y":129},"order":7,"id":"m_0_g_19_p_11"},{"point":{"x":65,"y":129},"order":8,"id":"m_0_g_19_p_12"},{"point":{"x":66,"y":129},"order":9,"id":"m_0_g_19_p_13"},{"point":{"x":67,"y":129},"order":10,"id":"m_0_g_19_p_14"},{"point":{"x":68,"y":129},"order":11,"id":"m_0_g_19_p_15"},{"point":{"x":69,"y":129},"order":12,"id":"m_0_g_19_p_16"},{"point":{"x":70,"y":129},"order":13,"id":"m_0_g_19_p_17"},{"point":{"x":71,"y":129},"order":14,"id":"m_0_g_19_p_18"},{"point":{"x":72,"y":129},"order":15,"id":"m_0_g_19_p_19"},{"point":{"x":73,"y":129},"order":16,"id":"m_0_g_19_p_20"},{"point":{"x":74,"y":129},"order":17,"id":"m_0_g_19_p_21"},{"point":{"x":75,"y":129},"order":18,"id":"m_0_g_19_p_22"},{"point":{"x":57,"y":130},"order":19,"id":"m_0_g_19_p_23"},{"point":{"x":57,"y":131},"order":20,"id":"m_0_g_19_p_24"},{"point":{"x":58,"y":133},"order":21,"id":"m_0_g_19_p_26"},{"point":{"x":58,"y":134},"order":22,"id":"m_0_g_19_p_27"},{"point":{"x":58,"y":135},"order":23,"id":"m_0_g_19_p_28"},{"point":{"x":58,"y":136},"order":24,"id":"m_0_g_19_p_29"},{"point":{"x":59,"y":137},"order":25,"id":"m_0_g_19_p_30"},{"point":{"x":59,"y":138},"order":26,"id":"m_0_g_19_p_31"},{"point":{"x":59,"y":139},"order":27,"id":"m_0_g_19_p_32"},{"point":{"x":59,"y":140},"order":28,"id":"m_0_g_19_p_33"},{"point":{"x":68,"y":133},"order":29,"id":"m_0_g_19_p_64"},{"point":{"x":67,"y":133},"order":30,"id":"m_0_g_19_p_65"},{"point":{"x":66,"y":133},"order":31,"id":"m_0_g_19_p_66"},{"point":{"x":65,"y":133},"order":32,"id":"m_0_g_19_p_67"},{"point":{"x":64,"y":133},"order":33,"id":"m_0_g_19_p_68"},{"point":{"x":110,"y":133},"order":34,"id":"m_0_g_19_p_69"},{"point":{"x":109,"y":133},"order":35,"id":"m_0_g_19_p_70"},{"point":{"x":117,"y":132},"order":36,"id":"m_0_g_19_p_71"},{"point":{"x":116,"y":132},"order":37,"id":"m_0_g_19_p_72"},{"point":{"x":115,"y":132},"order":38,"id":"m_0_g_19_p_73"},{"point":{"x":123,"y":131},"order":39,"id":"m_0_g_19_p_74"},{"point":{"x":122,"y":131},"order":40,"id":"m_0_g_19_p_75"},{"point":{"x":121,"y":131},"order":41,"id":"m_0_g_19_p_76"},{"point":{"x":128,"y":130},"order":42,"id":"m_0_g_19_p_77"},{"point":{"x":127,"y":130},"order":43,"id":"m_0_g_19_p_78"},{"point":{"x":120,"y":130},"order":44,"id":"m_0_g_19_p_79"},{"point":{"x":119,"y":130},"order":45,"id":"m_0_g_19_p_80"},{"point":{"x":114,"y":131},"order":46,"id":"m_0_g_19_p_81"},{"point":{"x":113,"y":131},"order":47,"id":"m_0_g_19_p_82"},{"point":{"x":108,"y":132},"order":48,"id":"m_0_g_19_p_83"},{"point":{"x":107,"y":132},"order":49,"id":"m_0_g_19_p_84"},{"point":{"x":106,"y":132},"order":50,"id":"m_0_g_19_p_85"},{"point":{"x":132,"y":120},"order":51,"id":"m_0_g_19_p_86"},{"point":{"x":130,"y":120},"order":52,"id":"m_0_g_19_p_87"},{"point":{"x":131,"y":120},"order":53,"id":"m_0_g_19_p_88"}]},{"order":21,"type":"lines","strokeColor":"#171717","strokeColorOpacity":1,"fillColor":"#171717","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_20","points":[{"point":{"x":47,"y":140},"order":0,"id":"m_0_g_20_p_8"},{"point":{"x":158,"y":140},"order":1,"id":"m_0_g_20_p_9"}]},{"order":22,"type":"dots","strokeColor":"#5c5c5c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_21","points":[{"point":{"x":90,"y":90},"order":0,"id":"m_0_g_21_p_0"},{"point":{"x":91,"y":90},"order":1,"id":"m_0_g_21_p_1"},{"point":{"x":90,"y":91},"order":2,"id":"m_0_g_21_p_2"},{"point":{"x":64,"y":100},"order":3,"id":"m_0_g_21_p_3"},{"point":{"x":63,"y":100},"order":4,"id":"m_0_g_21_p_4"},{"point":{"x":63,"y":99},"order":5,"id":"m_0_g_21_p_5"},{"point":{"x":112,"y":119},"order":6,"id":"m_0_g_21_p_6"},{"point":{"x":112,"y":118},"order":7,"id":"m_0_g_21_p_7"},{"point":{"x":111,"y":118},"order":8,"id":"m_0_g_21_p_8"},{"point":{"x":110,"y":118},"order":9,"id":"m_0_g_21_p_9"},{"point":{"x":110,"y":119},"order":10,"id":"m_0_g_21_p_10"},{"point":{"x":111,"y":119},"order":11,"id":"m_0_g_21_p_11"},{"point":{"x":107,"y":119},"order":12,"id":"m_0_g_21_p_12"},{"point":{"x":106,"y":119},"order":13,"id":"m_0_g_21_p_13"},{"point":{"x":105,"y":119},"order":14,"id":"m_0_g_21_p_14"},{"point":{"x":104,"y":119},"order":15,"id":"m_0_g_21_p_15"},{"point":{"x":104,"y":120},"order":16,"id":"m_0_g_21_p_16"},{"point":{"x":105,"y":120},"order":17,"id":"m_0_g_21_p_18"},{"point":{"x":106,"y":120},"order":18,"id":"m_0_g_21_p_19"},{"point":{"x":107,"y":120},"order":19,"id":"m_0_g_21_p_20"},{"point":{"x":102,"y":119},"order":20,"id":"m_0_g_21_p_21"},{"point":{"x":101,"y":119},"order":21,"id":"m_0_g_21_p_22"},{"point":{"x":100,"y":119},"order":22,"id":"m_0_g_21_p_23"},{"point":{"x":100,"y":120},"order":23,"id":"m_0_g_21_p_24"},{"point":{"x":101,"y":120},"order":24,"id":"m_0_g_21_p_25"},{"point":{"x":102,"y":120},"order":25,"id":"m_0_g_21_p_26"},{"point":{"x":98,"y":119},"order":26,"id":"m_0_g_21_p_27"},{"point":{"x":97,"y":119},"order":27,"id":"m_0_g_21_p_28"},{"point":{"x":96,"y":119},"order":28,"id":"m_0_g_21_p_29"},{"point":{"x":95,"y":119},"order":29,"id":"m_0_g_21_p_30"},{"point":{"x":95,"y":120},"order":30,"id":"m_0_g_21_p_31"},{"point":{"x":96,"y":120},"order":31,"id":"m_0_g_21_p_32"},{"point":{"x":97,"y":120},"order":32,"id":"m_0_g_21_p_33"},{"point":{"x":98,"y":120},"order":33,"id":"m_0_g_21_p_34"}]},{"order":23,"type":"dots","strokeColor":"#212121","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_22","points":[{"point":{"x":75,"y":129},"order":0,"id":"m_0_g_22_p_0"},{"point":{"x":74,"y":129},"order":1,"id":"m_0_g_22_p_1"},{"point":{"x":73,"y":129},"order":2,"id":"m_0_g_22_p_2"},{"point":{"x":72,"y":129},"order":3,"id":"m_0_g_22_p_3"},{"point":{"x":71,"y":129},"order":4,"id":"m_0_g_22_p_4"},{"point":{"x":70,"y":129},"order":5,"id":"m_0_g_22_p_5"},{"point":{"x":69,"y":129},"order":6,"id":"m_0_g_22_p_6"},{"point":{"x":68,"y":133},"order":7,"id":"m_0_g_22_p_7"},{"point":{"x":67,"y":133},"order":8,"id":"m_0_g_22_p_8"},{"point":{"x":66,"y":133},"order":9,"id":"m_0_g_22_p_9"},{"point":{"x":108,"y":132},"order":10,"id":"m_0_g_22_p_10"},{"point":{"x":109,"y":133},"order":11,"id":"m_0_g_22_p_11"},{"point":{"x":115,"y":132},"order":12,"id":"m_0_g_22_p_12"},{"point":{"x":114,"y":131},"order":13,"id":"m_0_g_22_p_13"},{"point":{"x":121,"y":131},"order":14,"id":"m_0_g_22_p_14"},{"point":{"x":120,"y":130},"order":15,"id":"m_0_g_22_p_15"},{"point":{"x":127,"y":130},"order":16,"id":"m_0_g_22_p_16"},{"point":{"x":126,"y":129},"order":17,"id":"m_0_g_22_p_17"},{"point":{"x":130,"y":120},"order":18,"id":"m_0_g_22_p_18"},{"point":{"x":129,"y":120},"order":19,"id":"m_0_g_22_p_19"},{"point":{"x":131,"y":120},"order":20,"id":"m_0_g_22_p_20"}]},{"order":24,"type":"dots","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_23","points":[{"point":{"x":103,"y":116},"order":0,"id":"m_0_g_23_p_4"},{"point":{"x":102,"y":116},"order":1,"id":"m_0_g_23_p_5"},{"point":{"x":101,"y":116},"order":2,"id":"m_0_g_23_p_6"},{"point":{"x":100,"y":116},"order":3,"id":"m_0_g_23_p_7"},{"point":{"x":114,"y":115},"order":4,"id":"m_0_g_23_p_8"},{"point":{"x":113,"y":115},"order":5,"id":"m_0_g_23_p_9"},{"point":{"x":112,"y":115},"order":6,"id":"m_0_g_23_p_10"},{"point":{"x":111,"y":115},"order":7,"id":"m_0_g_23_p_11"},{"point":{"x":99,"y":129},"order":8,"id":"m_0_g_23_p_17"},{"point":{"x":98,"y":129},"order":9,"id":"m_0_g_23_p_18"},{"point":{"x":97,"y":129},"order":10,"id":"m_0_g_23_p_19"},{"point":{"x":96,"y":129},"order":11,"id":"m_0_g_23_p_20"},{"point":{"x":101,"y":128},"order":12,"id":"m_0_g_23_p_21"},{"point":{"x":102,"y":128},"order":13,"id":"m_0_g_23_p_22"},{"point":{"x":104,"y":127},"order":14,"id":"m_0_g_23_p_23"},{"point":{"x":106,"y":126},"order":15,"id":"m_0_g_23_p_24"},{"point":{"x":110,"y":125},"order":16,"id":"m_0_g_23_p_25"},{"point":{"x":111,"y":125},"order":17,"id":"m_0_g_23_p_26"},{"point":{"x":116,"y":124},"order":18,"id":"m_0_g_23_p_27"}]},{"order":25,"type":"dots","strokeColor":"#3d3d3d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_24","points":[]},{"order":26,"type":"lines","strokeColor":"#212121","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_0_g_26","points":[{"point":{"x":137,"y":140},"order":0,"id":"m_0_g_26_p_0"},{"point":{"x":59,"y":140},"order":1,"id":"m_0_g_26_p_1"}]}]},{"order":1,"id":"m_1","name":"p","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#993838","strokeColorOpacity":1,"fillColor":"#993838","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_0","points":[{"point":{"x":48,"y":80},"order":0,"id":"m_1_g_0_p_0"},{"point":{"x":72,"y":80},"order":1,"id":"m_1_g_0_p_1"},{"point":{"x":72,"y":90},"order":2,"id":"m_1_g_0_p_2"},{"point":{"x":48,"y":90},"order":3,"id":"m_1_g_0_p_3"}]},{"order":1,"type":"dots","strokeColor":"#0d0d0d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_1","points":[{"point":{"x":50,"y":85},"order":0,"id":"m_1_g_1_p_0"},{"point":{"x":51,"y":85},"order":1,"id":"m_1_g_1_p_1"},{"point":{"x":51,"y":86},"order":2,"id":"m_1_g_1_p_2"},{"point":{"x":50,"y":86},"order":3,"id":"m_1_g_1_p_4"}]},{"order":2,"type":"dots","strokeColor":"#171717","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_2","points":[{"point":{"x":52,"y":85},"order":0,"id":"m_1_g_2_p_0"},{"point":{"x":53,"y":85},"order":1,"id":"m_1_g_2_p_1"},{"point":{"x":53,"y":86},"order":2,"id":"m_1_g_2_p_2"},{"point":{"x":52,"y":86},"order":3,"id":"m_1_g_2_p_3"}]},{"order":3,"type":"dots","strokeColor":"#212121","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_3","points":[{"point":{"x":54,"y":85},"order":0,"id":"m_1_g_3_p_0"},{"point":{"x":55,"y":85},"order":1,"id":"m_1_g_3_p_1"},{"point":{"x":55,"y":86},"order":2,"id":"m_1_g_3_p_2"},{"point":{"x":54,"y":86},"order":3,"id":"m_1_g_3_p_3"}]},{"order":4,"type":"dots","strokeColor":"#2b2b2b","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_4","points":[{"point":{"x":56,"y":85},"order":0,"id":"m_1_g_4_p_0"},{"point":{"x":57,"y":85},"order":1,"id":"m_1_g_4_p_1"},{"point":{"x":57,"y":86},"order":2,"id":"m_1_g_4_p_2"},{"point":{"x":56,"y":86},"order":3,"id":"m_1_g_4_p_3"}]},{"order":5,"type":"dots","strokeColor":"#363636","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_5","points":[{"point":{"x":58,"y":85},"order":0,"id":"m_1_g_5_p_0"},{"point":{"x":59,"y":85},"order":1,"id":"m_1_g_5_p_1"},{"point":{"x":59,"y":86},"order":2,"id":"m_1_g_5_p_2"},{"point":{"x":58,"y":86},"order":3,"id":"m_1_g_5_p_5"}]},{"order":6,"type":"dots","strokeColor":"#3d3d3d","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_6","points":[{"point":{"x":60,"y":85},"order":0,"id":"m_1_g_6_p_0"},{"point":{"x":61,"y":85},"order":1,"id":"m_1_g_6_p_1"},{"point":{"x":61,"y":86},"order":2,"id":"m_1_g_6_p_2"},{"point":{"x":60,"y":86},"order":3,"id":"m_1_g_6_p_3"}]},{"order":7,"type":"dots","strokeColor":"#474747","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_7","points":[{"point":{"x":62,"y":85},"order":0,"id":"m_1_g_7_p_0"},{"point":{"x":63,"y":85},"order":1,"id":"m_1_g_7_p_1"},{"point":{"x":63,"y":86},"order":2,"id":"m_1_g_7_p_2"},{"point":{"x":62,"y":86},"order":3,"id":"m_1_g_7_p_3"}]},{"order":8,"type":"dots","strokeColor":"#525252","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_8","points":[{"point":{"x":64,"y":85},"order":0,"id":"m_1_g_8_p_0"},{"point":{"x":65,"y":85},"order":1,"id":"m_1_g_8_p_1"},{"point":{"x":65,"y":86},"order":2,"id":"m_1_g_8_p_2"},{"point":{"x":64,"y":86},"order":3,"id":"m_1_g_8_p_3"}]},{"order":9,"type":"dots","strokeColor":"#5c5c5c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_9","points":[{"point":{"x":66,"y":85},"order":0,"id":"m_1_g_9_p_0"},{"point":{"x":67,"y":85},"order":1,"id":"m_1_g_9_p_1"},{"point":{"x":67,"y":86},"order":2,"id":"m_1_g_9_p_2"},{"point":{"x":66,"y":86},"order":3,"id":"m_1_g_9_p_3"}]},{"order":10,"type":"dots","strokeColor":"#666666","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_10","points":[{"point":{"x":68,"y":85},"order":0,"id":"m_1_g_10_p_0"},{"point":{"x":69,"y":85},"order":1,"id":"m_1_g_10_p_1"},{"point":{"x":69,"y":86},"order":2,"id":"m_1_g_10_p_2"},{"point":{"x":68,"y":86},"order":3,"id":"m_1_g_10_p_3"}]},{"order":11,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","visible":true,"clear":false,"replace":false,"id":"m_1_g_11","points":[]}]}]}}
        , { renderOnly: ['main'] })

        let _colors = easing.fast({from: 5, to: 40, steps: 10, type: 'linear', round: 0}).map(v => colorsHelpers.colorTypeConverter({ value: [0,0,v], fromType: 'hsv', toType: 'hex' }))

        console.log(_colors)
        this.sky = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createSkyFrames({framesCount, itemsCount, itemFrameslengthClamps, yClamps, size}) {
                let frames = [];
                
                

                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let x = getRandomInt(0, size.x);
                    let y = getRandomInt(yClamps)
                    let ci = getRandomInt(0, _colors.length-1);

                    let frames = new Array(framesCount).fill().map(el => {
                        return {
                            ci: ci
                        }
                    });

                    let ci2 = ci + getRandomInt(-5,5);
                    if(ci2 < 0) ci2 = 0;
                    if(ci2 > (_colors.length-1)) ci2 = _colors.length-1;

                    let ciValues = [
                        ...easing.fast({from: ci, to: ci2, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: ci2, to: ci, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                    ]

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }
                
                        let _ci = ciValues[f];
                        if(_ci == undefined) {
                            _ci = ci;
                        }
                        frames[frameIndex] = {
                            ci: _ci
                        };
                    }
                
                    return {
                        x, y,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            if(itemData.frames[f]){
                                hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.x, itemData.y)
                            }
                            
                        }
                    });
                }
                
                return frames;
            },
            init() {
                this.frames = this.createSkyFrames({ framesCount: 180, itemsCount: 700, itemFrameslengthClamps: [30, 90], yClamps: [0, 140], size: this.size });
                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });
            }
        }), 5)

        this.waves = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            createItemFrames({framesCount, itemsCount, ci, yValue,shift, height, itemFrameslengthClamps, size, addShip = false}) {
                let frames = [];
                //let shipFrames = easing.fast({from: 0, to: shipImg.length-1, steps: framesCount, type: 'linear', round: 0})
                let itemsData = new Array(itemsCount).fill().map((el, i) => {
                    let startFrameIndex = getRandomInt(0, framesCount-1);
                    let shiftStartFrameIndex = getRandomInt(0, framesCount-1);
                    let totalFrames = getRandomInt(itemFrameslengthClamps);
                
                    let x = getRandomInt(0, size.x);
                    let _ci = ci + getRandomInt(-1, 1);
                    if(_ci < 0) _ci = 0;
                    if(_ci > (_colors.length-1)) _ci = _colors.length-1;


                    let frames = new Array(framesCount).fill().map(_ => {
                        return {
                            ci: _ci
                        }
                    }) 

                    let xShift = shift > 0 ?  getRandomInt(1, shift)*(getRandomBool() ? 1 : -1) : 0;

                    let shiftValues = [
                        ...easing.fast({from: 0, to: xShift, steps: fast.r(framesCount/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: xShift, to: 0, steps: fast.r(framesCount/2), type: 'quad', method: 'inOut', round: 0})
                    ]

                    let ciValues = [
                        ...easing.fast({from: _ci, to: 0, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0}),
                        ...easing.fast({from: 0, to: _ci, steps: fast.r(totalFrames/2), type: 'quad', method: 'inOut', round: 0})
                    ]

                    for(let f = 0; f < totalFrames; f++){
                        let frameIndex = f + startFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let ciValue = ciValues[f];
                        if(ciValue == undefined)
                            ciValue = _ci;
                
                        frames[frameIndex] = {
                            ci: ciValue
                        };
                    }

                    for(let f = 0; f < framesCount; f++){
                        let frameIndex = f + shiftStartFrameIndex;
                        if(frameIndex > (framesCount-1)){
                            frameIndex-=framesCount;
                        }

                        let shift = shiftValues[f];
                        if(shift == undefined)
                            shift = 0;
                
                        frames[frameIndex].xShift = shift;
                    }
                
                    return {
                        x,
                        ci: _ci,
                        frames
                    }
                })
                
                for(let f = 0; f < framesCount; f++){
                    frames[f] = createCanvas(size, (ctx, size, hlp) => {
                        //hlp.setFillColor('black').rect(0, yValue, size.x, height);
                        for(let p = 0; p < itemsData.length; p++){
                            let itemData = itemsData[p];
                            
                            

                            if(itemData.frames[f]){
                                hlp.setFillColor(_colors[itemData.frames[f].ci]).dot(itemData.x + itemData.frames[f].xShift, yValue)
                            }
                        }

                        if(addShip) {
                            //hlp.setFillColor('red').rect(0,yValue, size.x, 1);
                            ctx.drawImage(shipImg, -20, 31)
                        }
                    });
                }
                
                return frames;
            },
            init() {
                let totalFrames = 180;
                let yClamps = [141, this.size.y];
                let height = yClamps[1] - yClamps[0];
                let itemsCountToHeight = easing.fast({from: 15, to: 2, steps: height, type: 'quad', method: 'out', round: 0});
                let waveHeightToHeight = easing.fast({from: 1, to: 3, steps: height, type: 'sin', method: 'in', round: 0});
                let ciToHeight = easing.fast({from: 0, to: _colors.length-3, steps: height, type: 'linear', round: 0});
                let startFrameIndexToHeight = easing.fast({from: 0, to: totalFrames, steps: height, type: 'linear', method: 'base', round: 0});
                let shiftToHeight = easing.fast({from: 0, to: 4, steps: height, type: 'linear', method: 'base', round: 0});
                let waveFramesLength = totalFrames/2;
                this.items = [];

                for(let y = 0; y < height; y++) {
                    this.items[this.items.length] = this.addChild(new GO({
                        position: new V2(),
                        size: this.size,
                        startFrameIndex: startFrameIndexToHeight[y],
                        waveHeight: waveHeightToHeight[y],
                        init() {
                            this.frames = this.parent.createItemFrames({ framesCount: totalFrames, itemsCount: itemsCountToHeight[y], 
                                shift: shiftToHeight[y], ci: ciToHeight[y], yValue: yClamps[0] + y, height: height, 
                                itemFrameslengthClamps: [100, 150], size: this.size, addShip: y == 30 });

                            this.registerFramesDefaultTimer({});

                            let waveCurrentFrame = 0;
                            
                            let allHeightValues = new Array(totalFrames).fill(0);
                            let heightValues = [
                                ...easing.fast({from: 0, to: this.waveHeight, steps: waveFramesLength/2, type: 'quad', method: 'inOut', round: 0}),
                                ...easing.fast({from: this.waveHeight, to: 0, steps: waveFramesLength/2, type: 'quad', method: 'inOut', round: 0})
                            ]

                            for(let f = 0; f < waveFramesLength; f++) {
                                let frameIndex = f + this.startFrameIndex;
                                if(frameIndex > (totalFrames-1)){
                                    frameIndex-=totalFrames;
                                }

                                allHeightValues[frameIndex] = heightValues[f]
                            }


                            let counter = undefined;
                            this.position.y = -allHeightValues[waveCurrentFrame];
                            this.needRecalcRenderProperties = true;
                            
                            this.timerWave = this.regTimerDefault(10, () => {
                                this.position.y = -allHeightValues[waveCurrentFrame];
                                this.needRecalcRenderProperties = true;
                                // if(waveCurrentFrame == this.startFrameIndex) {
                                //     counter = 0;
                                // } 

                                // if(counter != undefined) {
                                //     let h= heightValues[counter];
                                //     this.position.y = -h;
                                //     this.needRecalcRenderProperties = true;
                                //     counter++;

                                //     if(counter == waveFramesLength) {
                                //         counter = undefined;
                                //     }
                                // }

                                waveCurrentFrame++;
                                if(waveCurrentFrame == totalFrames){
                                    waveCurrentFrame = 0;
                                }
                            })
                        }
                    }))
                }
            }
        }), 10)
    }
}