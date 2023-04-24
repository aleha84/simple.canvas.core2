class PerlinFogScene extends Scene {
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
                size: new V2(150,150).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'foggy_mood',
                utilitiesPathPrefix: '../../..',
                workersCount: 8
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        //this.backgroundRenderDefault();
        this.backgroundRenderAddGo({color: 'black'})
    }

    start(){
        let lampModel = 
        {"general":{"originalSize":{"x":200,"y":200},"size":{"x":200,"y":200},"zoom":5,"showGrid":false,"renderOptimization":false,"animated":false,"backgroundColor":"#000000","palettes":[]},"main":{"layers":[{"order":0,"id":"m_0","name":"bg","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#000000","strokeColorOpacity":1,"fillColor":"#000000","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_0_g_0","points":[{"point":{"x":0,"y":0},"order":0,"id":"m_0_g_0_p_0"},{"point":{"x":199,"y":0},"order":1,"id":"m_0_g_0_p_1"},{"point":{"x":199,"y":199},"order":2,"id":"m_0_g_0_p_2"},{"point":{"x":0,"y":199},"order":3,"id":"m_0_g_0_p_3"}]}]},{"order":1,"id":"m_1","name":"lamp","visible":true,"groups":[{"order":0,"type":"lines","strokeColor":"#364958","strokeColorOpacity":1,"fillColor":"#364958","fillColorOpacity":1,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_1","points":[{"point":{"x":57,"y":150},"order":0,"id":"m_1_g_1_p_0"},{"point":{"x":57,"y":46},"order":1,"id":"m_1_g_1_p_1"},{"point":{"x":56,"y":47},"order":2,"id":"m_1_g_1_p_2"},{"point":{"x":55,"y":50},"order":3,"id":"m_1_g_1_p_3"},{"point":{"x":55,"y":95},"order":4,"id":"m_1_g_1_p_4"},{"point":{"x":56,"y":97},"order":5,"id":"m_1_g_1_p_5"},{"point":{"x":56,"y":131},"order":6,"id":"m_1_g_1_p_6"}]},{"order":1,"type":"dots","strokeColor":"#FFFFFF","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_0","points":[{"point":{"x":79,"y":42},"order":0,"id":"m_1_g_0_p_0"},{"point":{"x":78,"y":42},"order":1,"id":"m_1_g_0_p_1"},{"point":{"x":77,"y":42},"order":2,"id":"m_1_g_0_p_2"},{"point":{"x":76,"y":42},"order":3,"id":"m_1_g_0_p_3"},{"point":{"x":75,"y":42},"order":4,"id":"m_1_g_0_p_4"},{"point":{"x":74,"y":42},"order":5,"id":"m_1_g_0_p_5"},{"point":{"x":77,"y":43},"order":6,"id":"m_1_g_0_p_6"},{"point":{"x":76,"y":43},"order":7,"id":"m_1_g_0_p_7"},{"point":{"x":75,"y":43},"order":8,"id":"m_1_g_0_p_8"},{"point":{"x":74,"y":43},"order":9,"id":"m_1_g_0_p_9"},{"point":{"x":73,"y":43},"order":10,"id":"m_1_g_0_p_10"},{"point":{"x":72,"y":43},"order":11,"id":"m_1_g_0_p_11"},{"point":{"x":71,"y":43},"order":12,"id":"m_1_g_0_p_12"},{"point":{"x":70,"y":43},"order":13,"id":"m_1_g_0_p_13"},{"point":{"x":69,"y":43},"order":14,"id":"m_1_g_0_p_14"},{"point":{"x":68,"y":43},"order":15,"id":"m_1_g_0_p_15"},{"point":{"x":70,"y":44},"order":16,"id":"m_1_g_0_p_21"},{"point":{"x":69,"y":44},"order":17,"id":"m_1_g_0_p_22"},{"point":{"x":68,"y":44},"order":18,"id":"m_1_g_0_p_23"},{"point":{"x":67,"y":44},"order":19,"id":"m_1_g_0_p_24"},{"point":{"x":66,"y":44},"order":20,"id":"m_1_g_0_p_25"},{"point":{"x":65,"y":44},"order":21,"id":"m_1_g_0_p_26"},{"point":{"x":66,"y":45},"order":22,"id":"m_1_g_0_p_34"},{"point":{"x":65,"y":45},"order":23,"id":"m_1_g_0_p_35"},{"point":{"x":64,"y":45},"order":24,"id":"m_1_g_0_p_36"},{"point":{"x":63,"y":45},"order":25,"id":"m_1_g_0_p_37"},{"point":{"x":62,"y":45},"order":26,"id":"m_1_g_0_p_38"},{"point":{"x":72,"y":44},"order":27,"id":"m_1_g_0_p_40"},{"point":{"x":71,"y":44},"order":28,"id":"m_1_g_0_p_41"},{"point":{"x":67,"y":45},"order":29,"id":"m_1_g_0_p_42"},{"point":{"x":57,"y":48},"order":30,"id":"m_1_g_0_p_43"},{"point":{"x":57,"y":49},"order":31,"id":"m_1_g_0_p_44"},{"point":{"x":57,"y":50},"order":32,"id":"m_1_g_0_p_45"},{"point":{"x":57,"y":51},"order":33,"id":"m_1_g_0_p_46"},{"point":{"x":57,"y":52},"order":34,"id":"m_1_g_0_p_47"},{"point":{"x":57,"y":53},"order":35,"id":"m_1_g_0_p_48"},{"point":{"x":57,"y":54},"order":36,"id":"m_1_g_0_p_49"}]},{"order":2,"type":"dots","strokeColor":"#DFD9D2","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_2","points":[{"point":{"x":57,"y":47},"order":0,"id":"m_1_g_2_p_0"},{"point":{"x":56,"y":47},"order":1,"id":"m_1_g_2_p_1"},{"point":{"x":56,"y":48},"order":2,"id":"m_1_g_2_p_2"},{"point":{"x":56,"y":49},"order":3,"id":"m_1_g_2_p_3"},{"point":{"x":56,"y":50},"order":4,"id":"m_1_g_2_p_4"},{"point":{"x":56,"y":51},"order":5,"id":"m_1_g_2_p_5"},{"point":{"x":56,"y":52},"order":6,"id":"m_1_g_2_p_6"},{"point":{"x":56,"y":53},"order":7,"id":"m_1_g_2_p_7"},{"point":{"x":56,"y":54},"order":8,"id":"m_1_g_2_p_8"},{"point":{"x":56,"y":55},"order":9,"id":"m_1_g_2_p_11"},{"point":{"x":56,"y":56},"order":10,"id":"m_1_g_2_p_12"},{"point":{"x":56,"y":57},"order":11,"id":"m_1_g_2_p_13"},{"point":{"x":56,"y":58},"order":12,"id":"m_1_g_2_p_14"},{"point":{"x":56,"y":59},"order":13,"id":"m_1_g_2_p_15"},{"point":{"x":56,"y":60},"order":14,"id":"m_1_g_2_p_16"},{"point":{"x":56,"y":61},"order":15,"id":"m_1_g_2_p_17"},{"point":{"x":56,"y":62},"order":16,"id":"m_1_g_2_p_18"},{"point":{"x":56,"y":63},"order":17,"id":"m_1_g_2_p_19"},{"point":{"x":56,"y":64},"order":18,"id":"m_1_g_2_p_20"},{"point":{"x":56,"y":65},"order":19,"id":"m_1_g_2_p_21"},{"point":{"x":57,"y":85},"order":20,"id":"m_1_g_2_p_22"},{"point":{"x":57,"y":84},"order":21,"id":"m_1_g_2_p_23"},{"point":{"x":57,"y":83},"order":22,"id":"m_1_g_2_p_24"},{"point":{"x":57,"y":82},"order":23,"id":"m_1_g_2_p_25"},{"point":{"x":57,"y":81},"order":24,"id":"m_1_g_2_p_26"},{"point":{"x":57,"y":80},"order":25,"id":"m_1_g_2_p_27"},{"point":{"x":57,"y":79},"order":26,"id":"m_1_g_2_p_28"},{"point":{"x":57,"y":78},"order":27,"id":"m_1_g_2_p_29"},{"point":{"x":57,"y":77},"order":28,"id":"m_1_g_2_p_30"},{"point":{"x":57,"y":76},"order":29,"id":"m_1_g_2_p_31"},{"point":{"x":57,"y":75},"order":30,"id":"m_1_g_2_p_32"},{"point":{"x":57,"y":74},"order":31,"id":"m_1_g_2_p_33"},{"point":{"x":57,"y":73},"order":32,"id":"m_1_g_2_p_34"},{"point":{"x":57,"y":72},"order":33,"id":"m_1_g_2_p_35"},{"point":{"x":57,"y":71},"order":34,"id":"m_1_g_2_p_36"},{"point":{"x":57,"y":70},"order":35,"id":"m_1_g_2_p_37"},{"point":{"x":57,"y":69},"order":36,"id":"m_1_g_2_p_38"},{"point":{"x":57,"y":68},"order":37,"id":"m_1_g_2_p_39"},{"point":{"x":57,"y":67},"order":38,"id":"m_1_g_2_p_40"},{"point":{"x":57,"y":66},"order":39,"id":"m_1_g_2_p_41"},{"point":{"x":56,"y":66},"order":40,"id":"m_1_g_2_p_42"},{"point":{"x":57,"y":65},"order":41,"id":"m_1_g_2_p_43"},{"point":{"x":57,"y":64},"order":42,"id":"m_1_g_2_p_44"},{"point":{"x":57,"y":63},"order":43,"id":"m_1_g_2_p_45"},{"point":{"x":57,"y":62},"order":44,"id":"m_1_g_2_p_46"},{"point":{"x":57,"y":61},"order":45,"id":"m_1_g_2_p_47"},{"point":{"x":57,"y":60},"order":46,"id":"m_1_g_2_p_48"},{"point":{"x":57,"y":59},"order":47,"id":"m_1_g_2_p_49"},{"point":{"x":57,"y":58},"order":48,"id":"m_1_g_2_p_50"},{"point":{"x":57,"y":57},"order":49,"id":"m_1_g_2_p_51"},{"point":{"x":57,"y":56},"order":50,"id":"m_1_g_2_p_52"},{"point":{"x":57,"y":55},"order":51,"id":"m_1_g_2_p_53"},{"point":{"x":61,"y":45},"order":52,"id":"m_1_g_2_p_54"},{"point":{"x":64,"y":44},"order":53,"id":"m_1_g_2_p_55"},{"point":{"x":63,"y":44},"order":54,"id":"m_1_g_2_p_56"},{"point":{"x":67,"y":43},"order":55,"id":"m_1_g_2_p_57"},{"point":{"x":66,"y":43},"order":56,"id":"m_1_g_2_p_58"},{"point":{"x":82,"y":41},"order":57,"id":"m_1_g_2_p_59"},{"point":{"x":81,"y":41},"order":58,"id":"m_1_g_2_p_60"},{"point":{"x":80,"y":41},"order":59,"id":"m_1_g_2_p_61"},{"point":{"x":79,"y":41},"order":60,"id":"m_1_g_2_p_62"},{"point":{"x":78,"y":41},"order":61,"id":"m_1_g_2_p_63"},{"point":{"x":77,"y":41},"order":62,"id":"m_1_g_2_p_64"},{"point":{"x":76,"y":41},"order":63,"id":"m_1_g_2_p_65"},{"point":{"x":75,"y":41},"order":64,"id":"m_1_g_2_p_66"},{"point":{"x":73,"y":42},"order":65,"id":"m_1_g_2_p_67"},{"point":{"x":72,"y":42},"order":66,"id":"m_1_g_2_p_68"},{"point":{"x":71,"y":42},"order":67,"id":"m_1_g_2_p_69"},{"point":{"x":70,"y":42},"order":68,"id":"m_1_g_2_p_70"}]},{"order":3,"type":"dots","strokeColor":"#6A6C74","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_3","points":[{"point":{"x":55,"y":49},"order":0,"id":"m_1_g_3_p_0"},{"point":{"x":55,"y":50},"order":1,"id":"m_1_g_3_p_1"},{"point":{"x":55,"y":51},"order":2,"id":"m_1_g_3_p_2"},{"point":{"x":55,"y":52},"order":3,"id":"m_1_g_3_p_3"},{"point":{"x":55,"y":53},"order":4,"id":"m_1_g_3_p_4"},{"point":{"x":55,"y":54},"order":5,"id":"m_1_g_3_p_5"},{"point":{"x":55,"y":55},"order":6,"id":"m_1_g_3_p_6"},{"point":{"x":55,"y":56},"order":7,"id":"m_1_g_3_p_7"},{"point":{"x":55,"y":57},"order":8,"id":"m_1_g_3_p_8"},{"point":{"x":55,"y":58},"order":9,"id":"m_1_g_3_p_9"},{"point":{"x":55,"y":59},"order":10,"id":"m_1_g_3_p_10"},{"point":{"x":55,"y":60},"order":11,"id":"m_1_g_3_p_11"},{"point":{"x":55,"y":61},"order":12,"id":"m_1_g_3_p_12"},{"point":{"x":55,"y":62},"order":13,"id":"m_1_g_3_p_13"},{"point":{"x":55,"y":63},"order":14,"id":"m_1_g_3_p_14"},{"point":{"x":61,"y":46},"order":15,"id":"m_1_g_3_p_15"},{"point":{"x":60,"y":46},"order":16,"id":"m_1_g_3_p_16"},{"point":{"x":59,"y":46},"order":17,"id":"m_1_g_3_p_17"},{"point":{"x":58,"y":46},"order":18,"id":"m_1_g_3_p_18"},{"point":{"x":57,"y":46},"order":19,"id":"m_1_g_3_p_19"},{"point":{"x":62,"y":44},"order":20,"id":"m_1_g_3_p_20"},{"point":{"x":60,"y":45},"order":21,"id":"m_1_g_3_p_21"},{"point":{"x":59,"y":45},"order":22,"id":"m_1_g_3_p_22"},{"point":{"x":65,"y":43},"order":23,"id":"m_1_g_3_p_23"},{"point":{"x":68,"y":42},"order":24,"id":"m_1_g_3_p_24"},{"point":{"x":69,"y":42},"order":25,"id":"m_1_g_3_p_25"},{"point":{"x":74,"y":41},"order":26,"id":"m_1_g_3_p_26"},{"point":{"x":73,"y":41},"order":27,"id":"m_1_g_3_p_27"},{"point":{"x":72,"y":41},"order":28,"id":"m_1_g_3_p_28"},{"point":{"x":56,"y":65},"order":29,"id":"m_1_g_3_p_29"},{"point":{"x":56,"y":66},"order":30,"id":"m_1_g_3_p_30"},{"point":{"x":56,"y":67},"order":31,"id":"m_1_g_3_p_31"},{"point":{"x":56,"y":68},"order":32,"id":"m_1_g_3_p_32"},{"point":{"x":56,"y":69},"order":33,"id":"m_1_g_3_p_33"},{"point":{"x":56,"y":70},"order":34,"id":"m_1_g_3_p_34"},{"point":{"x":56,"y":71},"order":35,"id":"m_1_g_3_p_35"},{"point":{"x":56,"y":72},"order":36,"id":"m_1_g_3_p_36"},{"point":{"x":56,"y":73},"order":37,"id":"m_1_g_3_p_37"},{"point":{"x":56,"y":74},"order":38,"id":"m_1_g_3_p_38"},{"point":{"x":56,"y":75},"order":39,"id":"m_1_g_3_p_39"},{"point":{"x":56,"y":76},"order":40,"id":"m_1_g_3_p_40"},{"point":{"x":56,"y":77},"order":41,"id":"m_1_g_3_p_41"},{"point":{"x":56,"y":78},"order":42,"id":"m_1_g_3_p_42"},{"point":{"x":56,"y":79},"order":43,"id":"m_1_g_3_p_43"},{"point":{"x":56,"y":80},"order":44,"id":"m_1_g_3_p_44"},{"point":{"x":56,"y":81},"order":45,"id":"m_1_g_3_p_45"},{"point":{"x":56,"y":82},"order":46,"id":"m_1_g_3_p_46"},{"point":{"x":56,"y":83},"order":47,"id":"m_1_g_3_p_47"},{"point":{"x":56,"y":84},"order":48,"id":"m_1_g_3_p_48"},{"point":{"x":56,"y":85},"order":49,"id":"m_1_g_3_p_49"},{"point":{"x":56,"y":86},"order":50,"id":"m_1_g_3_p_50"},{"point":{"x":57,"y":86},"order":51,"id":"m_1_g_3_p_51"},{"point":{"x":57,"y":87},"order":52,"id":"m_1_g_3_p_52"},{"point":{"x":57,"y":88},"order":53,"id":"m_1_g_3_p_53"},{"point":{"x":57,"y":89},"order":54,"id":"m_1_g_3_p_54"},{"point":{"x":57,"y":90},"order":55,"id":"m_1_g_3_p_55"},{"point":{"x":57,"y":91},"order":56,"id":"m_1_g_3_p_56"},{"point":{"x":57,"y":92},"order":57,"id":"m_1_g_3_p_57"},{"point":{"x":57,"y":93},"order":58,"id":"m_1_g_3_p_58"},{"point":{"x":57,"y":94},"order":59,"id":"m_1_g_3_p_59"},{"point":{"x":57,"y":95},"order":60,"id":"m_1_g_3_p_60"},{"point":{"x":57,"y":96},"order":61,"id":"m_1_g_3_p_61"},{"point":{"x":57,"y":97},"order":62,"id":"m_1_g_3_p_62"},{"point":{"x":57,"y":98},"order":63,"id":"m_1_g_3_p_63"},{"point":{"x":57,"y":99},"order":64,"id":"m_1_g_3_p_64"},{"point":{"x":57,"y":100},"order":65,"id":"m_1_g_3_p_65"},{"point":{"x":57,"y":101},"order":66,"id":"m_1_g_3_p_66"},{"point":{"x":57,"y":102},"order":67,"id":"m_1_g_3_p_67"},{"point":{"x":56,"y":92},"order":68,"id":"m_1_g_3_p_68"},{"point":{"x":56,"y":91},"order":69,"id":"m_1_g_3_p_69"},{"point":{"x":56,"y":90},"order":70,"id":"m_1_g_3_p_70"},{"point":{"x":56,"y":89},"order":71,"id":"m_1_g_3_p_71"},{"point":{"x":56,"y":88},"order":72,"id":"m_1_g_3_p_72"},{"point":{"x":56,"y":87},"order":73,"id":"m_1_g_3_p_73"}]},{"order":4,"type":"dots","strokeColor":"#1b252c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_4","points":[{"point":{"x":57,"y":150},"order":0,"id":"m_1_g_4_p_0"},{"point":{"x":57,"y":149},"order":1,"id":"m_1_g_4_p_1"},{"point":{"x":57,"y":148},"order":2,"id":"m_1_g_4_p_2"},{"point":{"x":57,"y":147},"order":3,"id":"m_1_g_4_p_3"},{"point":{"x":57,"y":146},"order":4,"id":"m_1_g_4_p_4"},{"point":{"x":57,"y":145},"order":5,"id":"m_1_g_4_p_5"},{"point":{"x":57,"y":144},"order":6,"id":"m_1_g_4_p_6"},{"point":{"x":57,"y":143},"order":7,"id":"m_1_g_4_p_7"},{"point":{"x":57,"y":142},"order":8,"id":"m_1_g_4_p_8"},{"point":{"x":57,"y":141},"order":9,"id":"m_1_g_4_p_9"},{"point":{"x":57,"y":140},"order":10,"id":"m_1_g_4_p_10"},{"point":{"x":57,"y":139},"order":11,"id":"m_1_g_4_p_11"},{"point":{"x":57,"y":138},"order":12,"id":"m_1_g_4_p_12"},{"point":{"x":57,"y":137},"order":13,"id":"m_1_g_4_p_13"},{"point":{"x":57,"y":136},"order":14,"id":"m_1_g_4_p_14"},{"point":{"x":57,"y":135},"order":15,"id":"m_1_g_4_p_15"},{"point":{"x":57,"y":134},"order":16,"id":"m_1_g_4_p_16"},{"point":{"x":57,"y":133},"order":17,"id":"m_1_g_4_p_17"},{"point":{"x":57,"y":132},"order":18,"id":"m_1_g_4_p_18"},{"point":{"x":57,"y":131},"order":19,"id":"m_1_g_4_p_19"},{"point":{"x":57,"y":130},"order":20,"id":"m_1_g_4_p_20"},{"point":{"x":57,"y":129},"order":21,"id":"m_1_g_4_p_21"},{"point":{"x":57,"y":128},"order":22,"id":"m_1_g_4_p_22"},{"point":{"x":57,"y":127},"order":23,"id":"m_1_g_4_p_23"},{"point":{"x":56,"y":140},"order":24,"id":"m_1_g_4_p_24"},{"point":{"x":56,"y":139},"order":25,"id":"m_1_g_4_p_25"},{"point":{"x":56,"y":138},"order":26,"id":"m_1_g_4_p_26"},{"point":{"x":56,"y":137},"order":27,"id":"m_1_g_4_p_27"},{"point":{"x":56,"y":136},"order":28,"id":"m_1_g_4_p_28"},{"point":{"x":56,"y":135},"order":29,"id":"m_1_g_4_p_29"},{"point":{"x":56,"y":134},"order":30,"id":"m_1_g_4_p_30"},{"point":{"x":56,"y":133},"order":31,"id":"m_1_g_4_p_31"},{"point":{"x":56,"y":132},"order":32,"id":"m_1_g_4_p_32"},{"point":{"x":56,"y":131},"order":33,"id":"m_1_g_4_p_33"},{"point":{"x":56,"y":130},"order":34,"id":"m_1_g_4_p_34"},{"point":{"x":56,"y":129},"order":35,"id":"m_1_g_4_p_35"},{"point":{"x":56,"y":128},"order":36,"id":"m_1_g_4_p_36"},{"point":{"x":56,"y":127},"order":37,"id":"m_1_g_4_p_37"},{"point":{"x":57,"y":126},"order":38,"id":"m_1_g_4_p_38"},{"point":{"x":56,"y":126},"order":39,"id":"m_1_g_4_p_39"},{"point":{"x":56,"y":125},"order":40,"id":"m_1_g_4_p_40"},{"point":{"x":56,"y":124},"order":41,"id":"m_1_g_4_p_41"},{"point":{"x":56,"y":123},"order":42,"id":"m_1_g_4_p_42"},{"point":{"x":56,"y":122},"order":43,"id":"m_1_g_4_p_43"},{"point":{"x":56,"y":121},"order":44,"id":"m_1_g_4_p_44"},{"point":{"x":56,"y":120},"order":45,"id":"m_1_g_4_p_45"},{"point":{"x":56,"y":119},"order":46,"id":"m_1_g_4_p_46"},{"point":{"x":56,"y":118},"order":47,"id":"m_1_g_4_p_47"},{"point":{"x":56,"y":117},"order":48,"id":"m_1_g_4_p_48"},{"point":{"x":56,"y":116},"order":49,"id":"m_1_g_4_p_49"},{"point":{"x":56,"y":115},"order":50,"id":"m_1_g_4_p_50"},{"point":{"x":56,"y":114},"order":51,"id":"m_1_g_4_p_51"},{"point":{"x":56,"y":113},"order":52,"id":"m_1_g_4_p_52"},{"point":{"x":56,"y":112},"order":53,"id":"m_1_g_4_p_53"},{"point":{"x":56,"y":111},"order":54,"id":"m_1_g_4_p_54"},{"point":{"x":55,"y":100},"order":55,"id":"m_1_g_4_p_55"},{"point":{"x":55,"y":99},"order":56,"id":"m_1_g_4_p_56"},{"point":{"x":55,"y":98},"order":57,"id":"m_1_g_4_p_57"},{"point":{"x":55,"y":97},"order":58,"id":"m_1_g_4_p_58"},{"point":{"x":55,"y":96},"order":59,"id":"m_1_g_4_p_59"},{"point":{"x":55,"y":95},"order":60,"id":"m_1_g_4_p_60"},{"point":{"x":55,"y":94},"order":61,"id":"m_1_g_4_p_61"},{"point":{"x":55,"y":93},"order":62,"id":"m_1_g_4_p_62"},{"point":{"x":55,"y":92},"order":63,"id":"m_1_g_4_p_63"},{"point":{"x":55,"y":91},"order":64,"id":"m_1_g_4_p_64"},{"point":{"x":55,"y":90},"order":65,"id":"m_1_g_4_p_65"},{"point":{"x":55,"y":89},"order":66,"id":"m_1_g_4_p_66"},{"point":{"x":55,"y":88},"order":67,"id":"m_1_g_4_p_67"},{"point":{"x":55,"y":87},"order":68,"id":"m_1_g_4_p_68"},{"point":{"x":55,"y":86},"order":69,"id":"m_1_g_4_p_69"},{"point":{"x":55,"y":85},"order":70,"id":"m_1_g_4_p_70"},{"point":{"x":55,"y":84},"order":71,"id":"m_1_g_4_p_71"},{"point":{"x":55,"y":83},"order":72,"id":"m_1_g_4_p_72"},{"point":{"x":55,"y":82},"order":73,"id":"m_1_g_4_p_73"},{"point":{"x":55,"y":81},"order":74,"id":"m_1_g_4_p_74"},{"point":{"x":55,"y":80},"order":75,"id":"m_1_g_4_p_75"},{"point":{"x":55,"y":79},"order":76,"id":"m_1_g_4_p_76"},{"point":{"x":55,"y":78},"order":77,"id":"m_1_g_4_p_77"},{"point":{"x":55,"y":77},"order":78,"id":"m_1_g_4_p_78"},{"point":{"x":55,"y":76},"order":79,"id":"m_1_g_4_p_79"},{"point":{"x":55,"y":75},"order":80,"id":"m_1_g_4_p_80"},{"point":{"x":55,"y":74},"order":81,"id":"m_1_g_4_p_81"}]},{"order":5,"type":"dots","strokeColor":"#a5a3a3","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_5","points":[{"point":{"x":56,"y":60},"order":0,"id":"m_1_g_5_p_0"},{"point":{"x":56,"y":61},"order":1,"id":"m_1_g_5_p_1"},{"point":{"x":56,"y":62},"order":2,"id":"m_1_g_5_p_2"},{"point":{"x":56,"y":63},"order":3,"id":"m_1_g_5_p_3"},{"point":{"x":56,"y":64},"order":4,"id":"m_1_g_5_p_4"},{"point":{"x":56,"y":56},"order":5,"id":"m_1_g_5_p_5"},{"point":{"x":56,"y":55},"order":6,"id":"m_1_g_5_p_6"},{"point":{"x":56,"y":47},"order":7,"id":"m_1_g_5_p_7"},{"point":{"x":56,"y":48},"order":8,"id":"m_1_g_5_p_8"},{"point":{"x":57,"y":85},"order":9,"id":"m_1_g_5_p_9"},{"point":{"x":57,"y":84},"order":10,"id":"m_1_g_5_p_10"},{"point":{"x":57,"y":83},"order":11,"id":"m_1_g_5_p_13"},{"point":{"x":57,"y":81},"order":12,"id":"m_1_g_5_p_15"},{"point":{"x":57,"y":80},"order":13,"id":"m_1_g_5_p_16"},{"point":{"x":57,"y":79},"order":14,"id":"m_1_g_5_p_17"},{"point":{"x":57,"y":78},"order":15,"id":"m_1_g_5_p_18"},{"point":{"x":57,"y":77},"order":16,"id":"m_1_g_5_p_19"},{"point":{"x":57,"y":76},"order":17,"id":"m_1_g_5_p_20"},{"point":{"x":57,"y":75},"order":18,"id":"m_1_g_5_p_21"},{"point":{"x":57,"y":74},"order":19,"id":"m_1_g_5_p_22"},{"point":{"x":57,"y":73},"order":20,"id":"m_1_g_5_p_23"},{"point":{"x":56,"y":74},"order":21,"id":"m_1_g_5_p_24"},{"point":{"x":56,"y":73},"order":22,"id":"m_1_g_5_p_25"},{"point":{"x":56,"y":65},"order":23,"id":"m_1_g_5_p_26"},{"point":{"x":57,"y":82},"order":24,"id":"m_1_g_5_p_27"},{"point":{"x":57,"y":72},"order":25,"id":"m_1_g_5_p_28"}]},{"order":6,"type":"dots","strokeColor":"#6a6c74","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_6","points":[{"point":{"x":57,"y":82},"order":0,"id":"m_1_g_6_p_0"},{"point":{"x":57,"y":81},"order":1,"id":"m_1_g_6_p_1"}]},{"order":7,"type":"dots","strokeColor":"#364958","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_7","points":[{"point":{"x":56,"y":92},"order":0,"id":"m_1_g_7_p_0"},{"point":{"x":56,"y":91},"order":1,"id":"m_1_g_7_p_1"},{"point":{"x":56,"y":90},"order":2,"id":"m_1_g_7_p_2"},{"point":{"x":56,"y":89},"order":3,"id":"m_1_g_7_p_3"},{"point":{"x":56,"y":88},"order":4,"id":"m_1_g_7_p_4"},{"point":{"x":56,"y":87},"order":5,"id":"m_1_g_7_p_5"},{"point":{"x":56,"y":80},"order":6,"id":"m_1_g_7_p_6"}]},{"order":8,"type":"dots","strokeColor":"#293742","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_8","points":[{"point":{"x":57,"y":125},"order":0,"id":"m_1_g_8_p_0"},{"point":{"x":57,"y":124},"order":1,"id":"m_1_g_8_p_1"},{"point":{"x":57,"y":123},"order":2,"id":"m_1_g_8_p_2"},{"point":{"x":57,"y":122},"order":3,"id":"m_1_g_8_p_3"},{"point":{"x":57,"y":121},"order":4,"id":"m_1_g_8_p_4"},{"point":{"x":57,"y":120},"order":5,"id":"m_1_g_8_p_5"},{"point":{"x":57,"y":119},"order":6,"id":"m_1_g_8_p_6"},{"point":{"x":57,"y":118},"order":7,"id":"m_1_g_8_p_7"},{"point":{"x":57,"y":117},"order":8,"id":"m_1_g_8_p_8"},{"point":{"x":57,"y":116},"order":9,"id":"m_1_g_8_p_9"},{"point":{"x":57,"y":115},"order":10,"id":"m_1_g_8_p_10"},{"point":{"x":57,"y":114},"order":11,"id":"m_1_g_8_p_11"},{"point":{"x":57,"y":113},"order":12,"id":"m_1_g_8_p_12"},{"point":{"x":57,"y":112},"order":13,"id":"m_1_g_8_p_13"},{"point":{"x":56,"y":110},"order":14,"id":"m_1_g_8_p_14"},{"point":{"x":56,"y":109},"order":15,"id":"m_1_g_8_p_15"},{"point":{"x":56,"y":108},"order":16,"id":"m_1_g_8_p_16"},{"point":{"x":56,"y":105},"order":17,"id":"m_1_g_8_p_17"},{"point":{"x":56,"y":104},"order":18,"id":"m_1_g_8_p_18"},{"point":{"x":56,"y":103},"order":19,"id":"m_1_g_8_p_19"},{"point":{"x":56,"y":102},"order":20,"id":"m_1_g_8_p_20"},{"point":{"x":56,"y":101},"order":21,"id":"m_1_g_8_p_21"},{"point":{"x":56,"y":98},"order":22,"id":"m_1_g_8_p_22"},{"point":{"x":57,"y":127},"order":23,"id":"m_1_g_8_p_23"},{"point":{"x":55,"y":69},"order":24,"id":"m_1_g_8_p_24"},{"point":{"x":55,"y":70},"order":25,"id":"m_1_g_8_p_25"},{"point":{"x":55,"y":71},"order":26,"id":"m_1_g_8_p_26"},{"point":{"x":55,"y":72},"order":27,"id":"m_1_g_8_p_27"},{"point":{"x":55,"y":73},"order":28,"id":"m_1_g_8_p_28"},{"point":{"x":55,"y":74},"order":29,"id":"m_1_g_8_p_29"},{"point":{"x":55,"y":77},"order":30,"id":"m_1_g_8_p_30"}]},{"order":9,"type":"dots","strokeColor":"#ffffff","strokeColorOpacity":0.5,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_9","points":[]},{"order":10,"type":"dots","strokeColor":"#ffffff","strokeColorOpacity":0.3,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_10","points":[]},{"order":11,"type":"dots","strokeColor":"#0e1316","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_11","points":[{"point":{"x":56,"y":131},"order":0,"id":"m_1_g_11_p_0"},{"point":{"x":56,"y":132},"order":1,"id":"m_1_g_11_p_1"},{"point":{"x":56,"y":133},"order":2,"id":"m_1_g_11_p_2"},{"point":{"x":56,"y":134},"order":3,"id":"m_1_g_11_p_3"},{"point":{"x":56,"y":135},"order":4,"id":"m_1_g_11_p_4"},{"point":{"x":56,"y":136},"order":5,"id":"m_1_g_11_p_5"},{"point":{"x":56,"y":137},"order":6,"id":"m_1_g_11_p_6"},{"point":{"x":56,"y":138},"order":7,"id":"m_1_g_11_p_7"},{"point":{"x":56,"y":139},"order":8,"id":"m_1_g_11_p_8"},{"point":{"x":56,"y":140},"order":9,"id":"m_1_g_11_p_9"},{"point":{"x":57,"y":139},"order":10,"id":"m_1_g_11_p_10"},{"point":{"x":57,"y":140},"order":11,"id":"m_1_g_11_p_11"},{"point":{"x":57,"y":141},"order":12,"id":"m_1_g_11_p_12"},{"point":{"x":57,"y":142},"order":13,"id":"m_1_g_11_p_13"},{"point":{"x":57,"y":143},"order":14,"id":"m_1_g_11_p_14"},{"point":{"x":57,"y":144},"order":15,"id":"m_1_g_11_p_15"},{"point":{"x":57,"y":145},"order":16,"id":"m_1_g_11_p_16"},{"point":{"x":57,"y":146},"order":17,"id":"m_1_g_11_p_17"},{"point":{"x":57,"y":147},"order":18,"id":"m_1_g_11_p_18"},{"point":{"x":57,"y":148},"order":19,"id":"m_1_g_11_p_19"},{"point":{"x":57,"y":149},"order":20,"id":"m_1_g_11_p_22"},{"point":{"x":57,"y":150},"order":21,"id":"m_1_g_11_p_23"},{"point":{"x":57,"y":151},"order":22,"id":"m_1_g_11_p_24"},{"point":{"x":57,"y":152},"order":23,"id":"m_1_g_11_p_25"},{"point":{"x":57,"y":153},"order":24,"id":"m_1_g_11_p_26"},{"point":{"x":57,"y":154},"order":25,"id":"m_1_g_11_p_27"},{"point":{"x":57,"y":155},"order":26,"id":"m_1_g_11_p_28"},{"point":{"x":57,"y":156},"order":27,"id":"m_1_g_11_p_29"},{"point":{"x":57,"y":157},"order":28,"id":"m_1_g_11_p_30"},{"point":{"x":57,"y":158},"order":29,"id":"m_1_g_11_p_31"},{"point":{"x":57,"y":159},"order":30,"id":"m_1_g_11_p_32"},{"point":{"x":57,"y":160},"order":31,"id":"m_1_g_11_p_33"},{"point":{"x":57,"y":161},"order":32,"id":"m_1_g_11_p_34"},{"point":{"x":57,"y":162},"order":33,"id":"m_1_g_11_p_35"},{"point":{"x":57,"y":163},"order":34,"id":"m_1_g_11_p_36"},{"point":{"x":55,"y":101},"order":35,"id":"m_1_g_11_p_37"},{"point":{"x":55,"y":102},"order":36,"id":"m_1_g_11_p_38"},{"point":{"x":55,"y":103},"order":37,"id":"m_1_g_11_p_39"},{"point":{"x":55,"y":104},"order":38,"id":"m_1_g_11_p_40"},{"point":{"x":55,"y":105},"order":39,"id":"m_1_g_11_p_41"},{"point":{"x":55,"y":106},"order":40,"id":"m_1_g_11_p_42"},{"point":{"x":55,"y":107},"order":41,"id":"m_1_g_11_p_43"},{"point":{"x":55,"y":108},"order":42,"id":"m_1_g_11_p_44"},{"point":{"x":55,"y":109},"order":43,"id":"m_1_g_11_p_45"},{"point":{"x":55,"y":110},"order":44,"id":"m_1_g_11_p_46"},{"point":{"x":55,"y":113},"order":45,"id":"m_1_g_11_p_51"},{"point":{"x":55,"y":114},"order":46,"id":"m_1_g_11_p_52"},{"point":{"x":55,"y":112},"order":47,"id":"m_1_g_11_p_53"},{"point":{"x":55,"y":111},"order":48,"id":"m_1_g_11_p_54"}]},{"order":12,"type":"dots","strokeColor":"#151c21","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_12","points":[{"point":{"x":57,"y":136},"order":0,"id":"m_1_g_12_p_0"},{"point":{"x":57,"y":137},"order":1,"id":"m_1_g_12_p_1"},{"point":{"x":57,"y":138},"order":2,"id":"m_1_g_12_p_2"},{"point":{"x":57,"y":139},"order":3,"id":"m_1_g_12_p_3"},{"point":{"x":57,"y":140},"order":4,"id":"m_1_g_12_p_4"},{"point":{"x":57,"y":141},"order":5,"id":"m_1_g_12_p_5"},{"point":{"x":57,"y":142},"order":6,"id":"m_1_g_12_p_6"},{"point":{"x":57,"y":143},"order":7,"id":"m_1_g_12_p_7"},{"point":{"x":57,"y":144},"order":8,"id":"m_1_g_12_p_8"},{"point":{"x":57,"y":145},"order":9,"id":"m_1_g_12_p_9"},{"point":{"x":57,"y":147},"order":10,"id":"m_1_g_12_p_13"},{"point":{"x":57,"y":148},"order":11,"id":"m_1_g_12_p_14"},{"point":{"x":57,"y":149},"order":12,"id":"m_1_g_12_p_15"},{"point":{"x":57,"y":146},"order":13,"id":"m_1_g_12_p_16"},{"point":{"x":56,"y":129},"order":14,"id":"m_1_g_12_p_17"},{"point":{"x":56,"y":130},"order":15,"id":"m_1_g_12_p_18"},{"point":{"x":56,"y":131},"order":16,"id":"m_1_g_12_p_19"},{"point":{"x":56,"y":132},"order":17,"id":"m_1_g_12_p_20"},{"point":{"x":56,"y":133},"order":18,"id":"m_1_g_12_p_21"},{"point":{"x":56,"y":134},"order":19,"id":"m_1_g_12_p_22"},{"point":{"x":56,"y":135},"order":20,"id":"m_1_g_12_p_23"},{"point":{"x":56,"y":136},"order":21,"id":"m_1_g_12_p_24"},{"point":{"x":56,"y":126},"order":22,"id":"m_1_g_12_p_25"},{"point":{"x":56,"y":125},"order":23,"id":"m_1_g_12_p_26"},{"point":{"x":55,"y":101},"order":24,"id":"m_1_g_12_p_27"},{"point":{"x":55,"y":102},"order":25,"id":"m_1_g_12_p_28"},{"point":{"x":55,"y":103},"order":26,"id":"m_1_g_12_p_29"},{"point":{"x":55,"y":104},"order":27,"id":"m_1_g_12_p_30"},{"point":{"x":55,"y":105},"order":28,"id":"m_1_g_12_p_31"},{"point":{"x":55,"y":106},"order":29,"id":"m_1_g_12_p_32"},{"point":{"x":55,"y":107},"order":30,"id":"m_1_g_12_p_33"},{"point":{"x":55,"y":108},"order":31,"id":"m_1_g_12_p_34"}]},{"order":13,"type":"dots","strokeColor":"#efece9","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_13","points":[{"point":{"x":57,"y":54},"order":0,"id":"m_1_g_13_p_0"},{"point":{"x":57,"y":55},"order":1,"id":"m_1_g_13_p_1"},{"point":{"x":57,"y":56},"order":2,"id":"m_1_g_13_p_2"},{"point":{"x":57,"y":57},"order":3,"id":"m_1_g_13_p_3"},{"point":{"x":57,"y":58},"order":4,"id":"m_1_g_13_p_4"},{"point":{"x":64,"y":44},"order":5,"id":"m_1_g_13_p_5"},{"point":{"x":67,"y":43},"order":6,"id":"m_1_g_13_p_6"},{"point":{"x":79,"y":41},"order":7,"id":"m_1_g_13_p_7"},{"point":{"x":78,"y":41},"order":8,"id":"m_1_g_13_p_8"},{"point":{"x":77,"y":41},"order":9,"id":"m_1_g_13_p_9"},{"point":{"x":76,"y":41},"order":10,"id":"m_1_g_13_p_10"},{"point":{"x":75,"y":41},"order":11,"id":"m_1_g_13_p_11"},{"point":{"x":73,"y":42},"order":12,"id":"m_1_g_13_p_12"},{"point":{"x":72,"y":42},"order":13,"id":"m_1_g_13_p_13"},{"point":{"x":71,"y":42},"order":14,"id":"m_1_g_13_p_14"},{"point":{"x":57,"y":48},"order":15,"id":"m_1_g_13_p_15"},{"point":{"x":57,"y":49},"order":16,"id":"m_1_g_13_p_16"},{"point":{"x":57,"y":60},"order":17,"id":"m_1_g_13_p_17"},{"point":{"x":57,"y":61},"order":18,"id":"m_1_g_13_p_18"},{"point":{"x":57,"y":62},"order":19,"id":"m_1_g_13_p_19"},{"point":{"x":57,"y":63},"order":20,"id":"m_1_g_13_p_20"},{"point":{"x":57,"y":64},"order":21,"id":"m_1_g_13_p_21"}]},{"order":14,"type":"dots","strokeColor":"#c2bebb","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":false,"clear":false,"replace":false,"id":"m_1_g_14","points":[{"point":{"x":57,"y":70},"order":0,"id":"m_1_g_14_p_0"},{"point":{"x":57,"y":71},"order":1,"id":"m_1_g_14_p_1"},{"point":{"x":57,"y":73},"order":2,"id":"m_1_g_14_p_2"},{"point":{"x":57,"y":68},"order":3,"id":"m_1_g_14_p_3"},{"point":{"x":56,"y":60},"order":4,"id":"m_1_g_14_p_4"},{"point":{"x":56,"y":61},"order":5,"id":"m_1_g_14_p_5"},{"point":{"x":56,"y":62},"order":6,"id":"m_1_g_14_p_6"},{"point":{"x":56,"y":56},"order":7,"id":"m_1_g_14_p_7"},{"point":{"x":56,"y":55},"order":8,"id":"m_1_g_14_p_8"},{"point":{"x":56,"y":49},"order":9,"id":"m_1_g_14_p_9"},{"point":{"x":57,"y":79},"order":10,"id":"m_1_g_14_p_11"},{"point":{"x":59,"y":46},"order":11,"id":"m_1_g_14_p_12"},{"point":{"x":60,"y":46},"order":12,"id":"m_1_g_14_p_13"}]},{"order":15,"type":"dots","strokeColor":"#505b66","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_15","points":[{"point":{"x":57,"y":100},"order":0,"id":"m_1_g_15_p_0"},{"point":{"x":57,"y":101},"order":1,"id":"m_1_g_15_p_1"},{"point":{"x":57,"y":102},"order":2,"id":"m_1_g_15_p_2"},{"point":{"x":57,"y":103},"order":3,"id":"m_1_g_15_p_3"},{"point":{"x":57,"y":95},"order":4,"id":"m_1_g_15_p_4"},{"point":{"x":57,"y":94},"order":5,"id":"m_1_g_15_p_5"},{"point":{"x":57,"y":93},"order":6,"id":"m_1_g_15_p_6"},{"point":{"x":56,"y":86},"order":7,"id":"m_1_g_15_p_7"},{"point":{"x":56,"y":85},"order":8,"id":"m_1_g_15_p_8"},{"point":{"x":56,"y":84},"order":9,"id":"m_1_g_15_p_9"},{"point":{"x":56,"y":80},"order":10,"id":"m_1_g_15_p_10"},{"point":{"x":56,"y":79},"order":11,"id":"m_1_g_15_p_11"},{"point":{"x":55,"y":57},"order":12,"id":"m_1_g_15_p_12"},{"point":{"x":55,"y":58},"order":13,"id":"m_1_g_15_p_13"},{"point":{"x":55,"y":59},"order":14,"id":"m_1_g_15_p_14"},{"point":{"x":55,"y":60},"order":15,"id":"m_1_g_15_p_15"},{"point":{"x":55,"y":61},"order":16,"id":"m_1_g_15_p_16"},{"point":{"x":55,"y":62},"order":17,"id":"m_1_g_15_p_17"},{"point":{"x":55,"y":63},"order":18,"id":"m_1_g_15_p_18"},{"point":{"x":55,"y":64},"order":19,"id":"m_1_g_15_p_19"},{"point":{"x":56,"y":72},"order":20,"id":"m_1_g_15_p_21"}]},{"order":16,"type":"dots","strokeColor":"#0e1316","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_1_g_16","points":[{"point":{"x":57,"y":164},"order":0,"id":"m_1_g_16_p_0"},{"point":{"x":57,"y":165},"order":1,"id":"m_1_g_16_p_1"},{"point":{"x":57,"y":166},"order":2,"id":"m_1_g_16_p_2"},{"point":{"x":57,"y":167},"order":3,"id":"m_1_g_16_p_5"},{"point":{"x":57,"y":168},"order":4,"id":"m_1_g_16_p_6"},{"point":{"x":57,"y":169},"order":5,"id":"m_1_g_16_p_7"},{"point":{"x":57,"y":170},"order":6,"id":"m_1_g_16_p_8"},{"point":{"x":57,"y":171},"order":7,"id":"m_1_g_16_p_9"},{"point":{"x":57,"y":172},"order":8,"id":"m_1_g_16_p_10"},{"point":{"x":57,"y":173},"order":9,"id":"m_1_g_16_p_11"}]}]},{"order":2,"id":"m_2","name":"p","visible":false,"groups":[{"order":0,"type":"dots","strokeColor":"#0e1316","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_0","points":[{"point":{"x":57,"y":149},"order":0,"id":"m_2_g_0_p_0"},{"point":{"x":56,"y":141},"order":1,"id":"m_2_g_0_p_1"},{"point":{"x":55,"y":115},"order":2,"id":"m_2_g_0_p_3"},{"point":{"x":57,"y":164},"order":3,"id":"m_2_g_0_p_4"}]},{"order":1,"type":"dots","strokeColor":"#151c21","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_1","points":[{"point":{"x":56,"y":137},"order":0,"id":"m_2_g_1_p_0"},{"point":{"x":56,"y":124},"order":1,"id":"m_2_g_1_p_1"},{"point":{"x":55,"y":109},"order":2,"id":"m_2_g_1_p_2"}]},{"order":2,"type":"dots","strokeColor":"#1b252c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_2","points":[{"point":{"x":57,"y":136},"order":0,"id":"m_2_g_2_p_0"},{"point":{"x":56,"y":129},"order":1,"id":"m_2_g_2_p_1"},{"point":{"x":56,"y":110},"order":2,"id":"m_2_g_2_p_2"},{"point":{"x":55,"y":101},"order":3,"id":"m_2_g_2_p_3"}]},{"order":3,"type":"dots","strokeColor":"#293742","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_3","points":[{"point":{"x":57,"y":128},"order":0,"id":"m_2_g_3_p_0"},{"point":{"x":56,"y":100},"order":1,"id":"m_2_g_3_p_1"}]},{"order":4,"type":"dots","strokeColor":"#364958","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_4","points":[{"point":{"x":57,"y":112},"order":0,"id":"m_2_g_4_p_1"},{"point":{"x":56,"y":105},"order":1,"id":"m_2_g_4_p_2"},{"point":{"x":56,"y":86},"order":2,"id":"m_2_g_4_p_3"}]},{"order":5,"type":"dots","strokeColor":"#505b66","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_5","points":[{"point":{"x":57,"y":104},"order":0,"id":"m_2_g_5_p_0"},{"point":{"x":57,"y":92},"order":1,"id":"m_2_g_5_p_1"}]},{"order":6,"type":"dots","strokeColor":"#6a6c74","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_6","points":[{"point":{"x":57,"y":100},"order":0,"id":"m_2_g_6_p_0"},{"point":{"x":57,"y":80},"order":1,"id":"m_2_g_6_p_1"},{"point":{"x":56,"y":65},"order":2,"id":"m_2_g_6_p_3"},{"point":{"x":55,"y":48},"order":3,"id":"m_2_g_6_p_4"}]},{"order":7,"type":"dots","strokeColor":"#a5a3a3","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_7","points":[{"point":{"x":57,"y":86},"order":0,"id":"m_2_g_7_p_0"},{"point":{"x":57,"y":71},"order":1,"id":"m_2_g_7_p_1"},{"point":{"x":56,"y":54},"order":2,"id":"m_2_g_7_p_2"}]},{"order":8,"type":"dots","strokeColor":"#efece9","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_2_g_8","points":[{"point":{"x":57,"y":65},"order":0,"id":"m_2_g_8_p_0"},{"point":{"x":57,"y":53},"order":1,"id":"m_2_g_8_p_1"}]}]},{"order":3,"id":"m_3","name":"lamp2","visible":true,"groups":[{"order":0,"type":"dots","strokeColor":"#ffffff","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_0","points":[{"point":{"x":137,"y":112},"order":0,"id":"m_3_g_0_p_0"},{"point":{"x":138,"y":112},"order":1,"id":"m_3_g_0_p_1"},{"point":{"x":139,"y":112},"order":2,"id":"m_3_g_0_p_2"},{"point":{"x":140,"y":112},"order":3,"id":"m_3_g_0_p_3"},{"point":{"x":141,"y":112},"order":4,"id":"m_3_g_0_p_4"},{"point":{"x":141,"y":111},"order":5,"id":"m_3_g_0_p_5"},{"point":{"x":142,"y":111},"order":6,"id":"m_3_g_0_p_6"},{"point":{"x":143,"y":111},"order":7,"id":"m_3_g_0_p_7"},{"point":{"x":144,"y":111},"order":8,"id":"m_3_g_0_p_8"},{"point":{"x":145,"y":111},"order":9,"id":"m_3_g_0_p_9"}]},{"order":1,"type":"dots","strokeColor":"#efece9","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_1","points":[{"point":{"x":133,"y":115},"order":0,"id":"m_3_g_1_p_0"},{"point":{"x":133,"y":116},"order":1,"id":"m_3_g_1_p_1"},{"point":{"x":133,"y":117},"order":2,"id":"m_3_g_1_p_2"},{"point":{"x":136,"y":112},"order":3,"id":"m_3_g_1_p_3"},{"point":{"x":138,"y":111},"order":4,"id":"m_3_g_1_p_4"},{"point":{"x":139,"y":111},"order":5,"id":"m_3_g_1_p_5"},{"point":{"x":140,"y":111},"order":6,"id":"m_3_g_1_p_6"},{"point":{"x":146,"y":110},"order":7,"id":"m_3_g_1_p_7"},{"point":{"x":145,"y":110},"order":8,"id":"m_3_g_1_p_8"},{"point":{"x":144,"y":110},"order":9,"id":"m_3_g_1_p_9"},{"point":{"x":143,"y":110},"order":10,"id":"m_3_g_1_p_10"}]},{"order":2,"type":"dots","strokeColor":"#dfd9d2","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_2","points":[{"point":{"x":146,"y":110},"order":0,"id":"m_3_g_2_p_0"},{"point":{"x":147,"y":110},"order":1,"id":"m_3_g_2_p_1"},{"point":{"x":142,"y":110},"order":2,"id":"m_3_g_2_p_2"},{"point":{"x":138,"y":111},"order":3,"id":"m_3_g_2_p_3"},{"point":{"x":137,"y":111},"order":4,"id":"m_3_g_2_p_4"},{"point":{"x":135,"y":112},"order":5,"id":"m_3_g_2_p_5"},{"point":{"x":133,"y":114},"order":6,"id":"m_3_g_2_p_6"},{"point":{"x":133,"y":118},"order":7,"id":"m_3_g_2_p_7"},{"point":{"x":133,"y":119},"order":8,"id":"m_3_g_2_p_8"},{"point":{"x":133,"y":120},"order":9,"id":"m_3_g_2_p_9"}]},{"order":3,"type":"dots","strokeColor":"#a5a3a3","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_3","points":[{"point":{"x":133,"y":121},"order":0,"id":"m_3_g_3_p_0"},{"point":{"x":133,"y":122},"order":1,"id":"m_3_g_3_p_1"},{"point":{"x":133,"y":123},"order":2,"id":"m_3_g_3_p_2"},{"point":{"x":133,"y":124},"order":3,"id":"m_3_g_3_p_3"},{"point":{"x":133,"y":125},"order":4,"id":"m_3_g_3_p_4"},{"point":{"x":141,"y":110},"order":5,"id":"m_3_g_3_p_5"}]},{"order":4,"type":"dots","strokeColor":"#6a6c74","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_4","points":[{"point":{"x":137,"y":113},"order":0,"id":"m_3_g_4_p_0"},{"point":{"x":136,"y":113},"order":1,"id":"m_3_g_4_p_1"},{"point":{"x":135,"y":113},"order":2,"id":"m_3_g_4_p_2"},{"point":{"x":134,"y":113},"order":3,"id":"m_3_g_4_p_3"},{"point":{"x":133,"y":113},"order":4,"id":"m_3_g_4_p_4"},{"point":{"x":132,"y":114},"order":5,"id":"m_3_g_4_p_8"},{"point":{"x":132,"y":115},"order":6,"id":"m_3_g_4_p_9"},{"point":{"x":132,"y":116},"order":7,"id":"m_3_g_4_p_10"},{"point":{"x":132,"y":117},"order":8,"id":"m_3_g_4_p_11"},{"point":{"x":132,"y":118},"order":9,"id":"m_3_g_4_p_12"},{"point":{"x":132,"y":119},"order":10,"id":"m_3_g_4_p_13"},{"point":{"x":132,"y":120},"order":11,"id":"m_3_g_4_p_14"},{"point":{"x":133,"y":125},"order":12,"id":"m_3_g_4_p_15"},{"point":{"x":133,"y":126},"order":13,"id":"m_3_g_4_p_16"},{"point":{"x":133,"y":127},"order":14,"id":"m_3_g_4_p_17"},{"point":{"x":133,"y":128},"order":15,"id":"m_3_g_4_p_18"},{"point":{"x":133,"y":129},"order":16,"id":"m_3_g_4_p_19"},{"point":{"x":133,"y":130},"order":17,"id":"m_3_g_4_p_20"}]},{"order":5,"type":"dots","strokeColor":"#505b66","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_5","points":[{"point":{"x":133,"y":130},"order":0,"id":"m_3_g_5_p_0"},{"point":{"x":133,"y":131},"order":1,"id":"m_3_g_5_p_1"},{"point":{"x":133,"y":132},"order":2,"id":"m_3_g_5_p_2"},{"point":{"x":133,"y":133},"order":3,"id":"m_3_g_5_p_3"},{"point":{"x":133,"y":134},"order":4,"id":"m_3_g_5_p_4"},{"point":{"x":133,"y":135},"order":5,"id":"m_3_g_5_p_5"},{"point":{"x":133,"y":136},"order":6,"id":"m_3_g_5_p_6"},{"point":{"x":133,"y":137},"order":7,"id":"m_3_g_5_p_7"},{"point":{"x":133,"y":138},"order":8,"id":"m_3_g_5_p_8"},{"point":{"x":133,"y":139},"order":9,"id":"m_3_g_5_p_9"},{"point":{"x":133,"y":140},"order":10,"id":"m_3_g_5_p_10"},{"point":{"x":132,"y":114},"order":11,"id":"m_3_g_5_p_11"},{"point":{"x":132,"y":119},"order":12,"id":"m_3_g_5_p_12"},{"point":{"x":132,"y":120},"order":13,"id":"m_3_g_5_p_13"},{"point":{"x":132,"y":121},"order":14,"id":"m_3_g_5_p_14"},{"point":{"x":132,"y":122},"order":15,"id":"m_3_g_5_p_15"}]},{"order":6,"type":"dots","strokeColor":"#364958","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_6","points":[{"point":{"x":133,"y":136},"order":0,"id":"m_3_g_6_p_0"},{"point":{"x":133,"y":137},"order":1,"id":"m_3_g_6_p_1"},{"point":{"x":133,"y":138},"order":2,"id":"m_3_g_6_p_2"},{"point":{"x":133,"y":139},"order":3,"id":"m_3_g_6_p_3"},{"point":{"x":133,"y":140},"order":4,"id":"m_3_g_6_p_4"},{"point":{"x":133,"y":141},"order":5,"id":"m_3_g_6_p_5"},{"point":{"x":133,"y":142},"order":6,"id":"m_3_g_6_p_6"},{"point":{"x":133,"y":143},"order":7,"id":"m_3_g_6_p_7"},{"point":{"x":133,"y":144},"order":8,"id":"m_3_g_6_p_8"},{"point":{"x":133,"y":146},"order":9,"id":"m_3_g_6_p_12"},{"point":{"x":133,"y":145},"order":10,"id":"m_3_g_6_p_13"},{"point":{"x":132,"y":122},"order":11,"id":"m_3_g_6_p_14"},{"point":{"x":132,"y":123},"order":12,"id":"m_3_g_6_p_17"},{"point":{"x":132,"y":124},"order":13,"id":"m_3_g_6_p_18"},{"point":{"x":132,"y":125},"order":14,"id":"m_3_g_6_p_19"}]},{"order":7,"type":"dots","strokeColor":"#293742","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_7","points":[{"point":{"x":133,"y":142},"order":0,"id":"m_3_g_7_p_0"},{"point":{"x":133,"y":143},"order":1,"id":"m_3_g_7_p_1"},{"point":{"x":133,"y":144},"order":2,"id":"m_3_g_7_p_2"},{"point":{"x":133,"y":145},"order":3,"id":"m_3_g_7_p_3"},{"point":{"x":133,"y":146},"order":4,"id":"m_3_g_7_p_4"},{"point":{"x":133,"y":147},"order":5,"id":"m_3_g_7_p_5"},{"point":{"x":133,"y":148},"order":6,"id":"m_3_g_7_p_6"},{"point":{"x":133,"y":149},"order":7,"id":"m_3_g_7_p_7"},{"point":{"x":133,"y":150},"order":8,"id":"m_3_g_7_p_8"},{"point":{"x":133,"y":151},"order":9,"id":"m_3_g_7_p_9"},{"point":{"x":132,"y":126},"order":10,"id":"m_3_g_7_p_10"},{"point":{"x":132,"y":127},"order":11,"id":"m_3_g_7_p_11"},{"point":{"x":132,"y":128},"order":12,"id":"m_3_g_7_p_12"},{"point":{"x":132,"y":129},"order":13,"id":"m_3_g_7_p_13"},{"point":{"x":132,"y":130},"order":14,"id":"m_3_g_7_p_14"},{"point":{"x":132,"y":131},"order":15,"id":"m_3_g_7_p_15"}]},{"order":8,"type":"dots","strokeColor":"#1b252c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_8","points":[{"point":{"x":133,"y":148},"order":0,"id":"m_3_g_8_p_0"},{"point":{"x":133,"y":149},"order":1,"id":"m_3_g_8_p_1"},{"point":{"x":133,"y":150},"order":2,"id":"m_3_g_8_p_2"},{"point":{"x":133,"y":151},"order":3,"id":"m_3_g_8_p_3"},{"point":{"x":133,"y":152},"order":4,"id":"m_3_g_8_p_4"},{"point":{"x":133,"y":153},"order":5,"id":"m_3_g_8_p_5"},{"point":{"x":133,"y":154},"order":6,"id":"m_3_g_8_p_6"},{"point":{"x":133,"y":155},"order":7,"id":"m_3_g_8_p_7"},{"point":{"x":133,"y":156},"order":8,"id":"m_3_g_8_p_8"},{"point":{"x":133,"y":157},"order":9,"id":"m_3_g_8_p_9"},{"point":{"x":132,"y":132},"order":10,"id":"m_3_g_8_p_10"},{"point":{"x":132,"y":133},"order":11,"id":"m_3_g_8_p_11"},{"point":{"x":132,"y":134},"order":12,"id":"m_3_g_8_p_12"},{"point":{"x":132,"y":135},"order":13,"id":"m_3_g_8_p_13"},{"point":{"x":132,"y":136},"order":14,"id":"m_3_g_8_p_14"},{"point":{"x":132,"y":137},"order":15,"id":"m_3_g_8_p_15"},{"point":{"x":132,"y":138},"order":16,"id":"m_3_g_8_p_16"},{"point":{"x":132,"y":139},"order":17,"id":"m_3_g_8_p_17"}]},{"order":9,"type":"dots","strokeColor":"#151c21","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_9","points":[{"point":{"x":133,"y":154},"order":0,"id":"m_3_g_9_p_0"},{"point":{"x":133,"y":155},"order":1,"id":"m_3_g_9_p_1"},{"point":{"x":133,"y":156},"order":2,"id":"m_3_g_9_p_2"},{"point":{"x":133,"y":157},"order":3,"id":"m_3_g_9_p_3"},{"point":{"x":133,"y":158},"order":4,"id":"m_3_g_9_p_4"},{"point":{"x":133,"y":159},"order":5,"id":"m_3_g_9_p_5"},{"point":{"x":133,"y":160},"order":6,"id":"m_3_g_9_p_6"},{"point":{"x":133,"y":161},"order":7,"id":"m_3_g_9_p_7"},{"point":{"x":133,"y":162},"order":8,"id":"m_3_g_9_p_8"},{"point":{"x":133,"y":163},"order":9,"id":"m_3_g_9_p_9"},{"point":{"x":133,"y":164},"order":10,"id":"m_3_g_9_p_10"},{"point":{"x":132,"y":138},"order":11,"id":"m_3_g_9_p_11"},{"point":{"x":132,"y":139},"order":12,"id":"m_3_g_9_p_12"},{"point":{"x":132,"y":140},"order":13,"id":"m_3_g_9_p_13"},{"point":{"x":132,"y":141},"order":14,"id":"m_3_g_9_p_14"},{"point":{"x":132,"y":142},"order":15,"id":"m_3_g_9_p_15"}]},{"order":10,"type":"dots","strokeColor":"#0e1316","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_10","points":[{"point":{"x":133,"y":159},"order":0,"id":"m_3_g_10_p_0"},{"point":{"x":133,"y":160},"order":1,"id":"m_3_g_10_p_1"},{"point":{"x":133,"y":161},"order":2,"id":"m_3_g_10_p_2"},{"point":{"x":133,"y":162},"order":3,"id":"m_3_g_10_p_3"},{"point":{"x":133,"y":163},"order":4,"id":"m_3_g_10_p_4"},{"point":{"x":133,"y":164},"order":5,"id":"m_3_g_10_p_5"},{"point":{"x":133,"y":165},"order":6,"id":"m_3_g_10_p_6"},{"point":{"x":133,"y":166},"order":7,"id":"m_3_g_10_p_7"},{"point":{"x":133,"y":167},"order":8,"id":"m_3_g_10_p_8"},{"point":{"x":132,"y":143},"order":9,"id":"m_3_g_10_p_9"},{"point":{"x":132,"y":144},"order":10,"id":"m_3_g_10_p_10"},{"point":{"x":132,"y":145},"order":11,"id":"m_3_g_10_p_11"},{"point":{"x":132,"y":146},"order":12,"id":"m_3_g_10_p_12"},{"point":{"x":133,"y":168},"order":13,"id":"m_3_g_10_p_13"},{"point":{"x":133,"y":169},"order":14,"id":"m_3_g_10_p_14"},{"point":{"x":133,"y":173},"order":15,"id":"m_3_g_10_p_19"},{"point":{"x":133,"y":174},"order":16,"id":"m_3_g_10_p_20"},{"point":{"x":133,"y":175},"order":17,"id":"m_3_g_10_p_21"},{"point":{"x":133,"y":176},"order":18,"id":"m_3_g_10_p_22"},{"point":{"x":133,"y":180},"order":19,"id":"m_3_g_10_p_28"},{"point":{"x":133,"y":179},"order":20,"id":"m_3_g_10_p_29"},{"point":{"x":133,"y":178},"order":21,"id":"m_3_g_10_p_30"},{"point":{"x":133,"y":177},"order":22,"id":"m_3_g_10_p_31"},{"point":{"x":133,"y":172},"order":23,"id":"m_3_g_10_p_32"},{"point":{"x":133,"y":171},"order":24,"id":"m_3_g_10_p_33"},{"point":{"x":133,"y":170},"order":25,"id":"m_3_g_10_p_34"}]},{"order":11,"type":"dots","strokeColor":"#a5a3a3","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_11","points":[{"point":{"x":133,"y":126},"order":0,"id":"m_3_g_11_p_0"}]},{"order":12,"type":"dots","strokeColor":"#364958","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_12","points":[{"point":{"x":132,"y":127},"order":0,"id":"m_3_g_12_p_0"},{"point":{"x":133,"y":143},"order":1,"id":"m_3_g_12_p_1"},{"point":{"x":133,"y":144},"order":2,"id":"m_3_g_12_p_2"}]},{"order":13,"type":"dots","strokeColor":"#293742","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_13","points":[{"point":{"x":133,"y":149},"order":0,"id":"m_3_g_13_p_0"}]},{"order":14,"type":"dots","strokeColor":"#151c21","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_14","points":[{"point":{"x":133,"y":159},"order":0,"id":"m_3_g_14_p_32"},{"point":{"x":133,"y":160},"order":1,"id":"m_3_g_14_p_33"},{"point":{"x":133,"y":161},"order":2,"id":"m_3_g_14_p_34"},{"point":{"x":133,"y":162},"order":3,"id":"m_3_g_14_p_35"},{"point":{"x":133,"y":163},"order":4,"id":"m_3_g_14_p_36"},{"point":{"x":133,"y":164},"order":5,"id":"m_3_g_14_p_37"},{"point":{"x":133,"y":165},"order":6,"id":"m_3_g_14_p_38"},{"point":{"x":133,"y":166},"order":7,"id":"m_3_g_14_p_39"},{"point":{"x":133,"y":167},"order":8,"id":"m_3_g_14_p_40"},{"point":{"x":133,"y":168},"order":9,"id":"m_3_g_14_p_41"}]},{"order":15,"type":"dots","strokeColor":"#1b252c","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_15","points":[{"point":{"x":133,"y":154},"order":0,"id":"m_3_g_15_p_9"},{"point":{"x":133,"y":155},"order":1,"id":"m_3_g_15_p_10"},{"point":{"x":133,"y":156},"order":2,"id":"m_3_g_15_p_11"},{"point":{"x":133,"y":157},"order":3,"id":"m_3_g_15_p_12"},{"point":{"x":133,"y":158},"order":4,"id":"m_3_g_15_p_13"},{"point":{"x":133,"y":160},"order":5,"id":"m_3_g_15_p_14"},{"point":{"x":133,"y":161},"order":6,"id":"m_3_g_15_p_15"},{"point":{"x":133,"y":162},"order":7,"id":"m_3_g_15_p_16"}]},{"order":16,"type":"lines","strokeColor":"#000000","strokeColorOpacity":0.5,"fillColor":"#000000","fillColorOpacity":0.5,"closePath":true,"fill":true,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":false,"replace":false,"id":"m_3_g_16","points":[{"point":{"x":133,"y":180},"order":0,"id":"m_3_g_16_p_0"},{"point":{"x":133,"y":113},"order":1,"id":"m_3_g_16_p_1"},{"point":{"x":135,"y":113},"order":2,"id":"m_3_g_16_p_2"},{"point":{"x":135,"y":112},"order":3,"id":"m_3_g_16_p_3"},{"point":{"x":141,"y":110},"order":4,"id":"m_3_g_16_p_4"},{"point":{"x":142,"y":110},"order":5,"id":"m_3_g_16_p_5"},{"point":{"x":145,"y":110},"order":6,"id":"m_3_g_16_p_6"},{"point":{"x":146,"y":110},"order":7,"id":"m_3_g_16_p_7"},{"point":{"x":147,"y":110},"order":8,"id":"m_3_g_16_p_8"},{"point":{"x":140,"y":110},"order":9,"id":"m_3_g_16_p_9"},{"point":{"x":137,"y":111},"order":10,"id":"m_3_g_16_p_10"},{"point":{"x":136,"y":111},"order":11,"id":"m_3_g_16_p_11"},{"point":{"x":134,"y":113},"order":12,"id":"m_3_g_16_p_12"},{"point":{"x":133,"y":114},"order":13,"id":"m_3_g_16_p_13"},{"point":{"x":132,"y":114},"order":14,"id":"m_3_g_16_p_14"},{"point":{"x":132,"y":146},"order":15,"id":"m_3_g_16_p_15"},{"point":{"x":133,"y":147},"order":16,"id":"m_3_g_16_p_16"}]},{"order":17,"type":"dots","strokeColor":"#FF0000","strokeColorOpacity":1,"fillColor":"#FF0000","fillColorOpacity":1,"closePath":false,"fill":false,"fillPattern":false,"patternType":"type1","numOfSegments":16,"visible":true,"clear":true,"replace":false,"id":"m_3_g_17","points":[{"point":{"x":133,"y":183},"order":0,"id":"m_3_g_17_p_0"},{"point":{"x":133,"y":182},"order":1,"id":"m_3_g_17_p_1"},{"point":{"x":133,"y":181},"order":2,"id":"m_3_g_17_p_2"},{"point":{"x":133,"y":180},"order":3,"id":"m_3_g_17_p_3"},{"point":{"x":133,"y":179},"order":4,"id":"m_3_g_17_p_4"},{"point":{"x":133,"y":178},"order":5,"id":"m_3_g_17_p_5"},{"point":{"x":133,"y":177},"order":6,"id":"m_3_g_17_p_6"},{"point":{"x":133,"y":176},"order":7,"id":"m_3_g_17_p_7"},{"point":{"x":133,"y":175},"order":8,"id":"m_3_g_17_p_8"}]}]}]}}

        let seeds = [
            // 417.97891256018914,
            // 949.545002599232,
            // 358.31329398192446,
            // 983.7427527996779,
            // 282.2238096623193,
            // 995.8221078980645,
        ]
                /*
perlin seed: random seed 417.97891256018914
mathUtils.js:298 perlin seed: random seed 949.545002599232
mathUtils.js:298 perlin seed: random seed 358.31329398192446
mathUtils.js:298 perlin seed: random seed 983.7427527996779
mathUtils.js:298 perlin seed: random seed 282.2238096623193
mathUtils.js:298 perlin seed: random seed 995.8221078980645
                */
        

        let colorRgbPrefix = 'rgba(255,255,255,';//'rgba(226,219,208,';
        let totalFrames = 300;

        let createDropsFrames = function({itemsCount,framesCount, itemFrameslength1Clamps, itemFrameslength2Clamps, size, opacityClamps, startPositions, reduceOpacityOnFall = false, type = 'quad', method = 'in', rgbColorPart}) {
            let frames = [];

            let itemsData = startPositions.points.map((p, i) => {
                let startFrameIndex = getRandomInt(0, framesCount-1);

                //let startPosition = startPositions[getRandomInt(0, startPositions.length-1)];
                // let p = el; 
                // if(startPosition.type == 'points') {
                //     p = startPosition.points[getRandomInt(0, startPosition.points.length-1)]
                // }
                // else {
                //     p = new V2(getRandomInt(startPosition.xClamps), startPosition.y);
                // }
                let height = startPositions.height;
                let maxTailLength = startPositions.tail || 0;

                let part1Length = getRandomInt(itemFrameslength1Clamps);
                let part2Length = getRandomInt(itemFrameslength2Clamps)

                let totalFrames = part1Length + part2Length
                let opacity = fast.r(getRandom(opacityClamps[0], opacityClamps[1]),2);
                let part1Alpha = easing.fast({from: 0, to: opacity, steps: part1Length, type: 'linear', round: 2})
                let part2Alpha = undefined;
                if(reduceOpacityOnFall) {
                    part2Alpha = easing.fast({from: opacity, to: 0, steps: part2Length, type: 'linear', round: 2})
                }

                let part2YChange = easing.fast({from: p.y, to: p.y + height, steps: part2Length, type, method, round: 0})
                let tailChangeValues = undefined;
                if(maxTailLength > 0) {
                    tailChangeValues = easing.fast({from: 0, to: maxTailLength, steps: part2Length, type: 'expo', method: 'in', round: 0})
                }
            
                let frames = [];
                for(let f = 0; f < totalFrames; f++){
                    let frameIndex = f + startFrameIndex;
                    if(frameIndex > (framesCount-1)){
                        frameIndex-=framesCount;
                    }

                    let y = p.y;
                    let alpha = 0;
                    if(f < part1Length) {
                        alpha = part1Alpha[f];
                    }
                    else {
                        y = part2YChange[f-part1Length];
                        alpha = part2Alpha ? part2Alpha[f-part1Length] : opacity
                    }
            
                    let tail = 0;
                    if(tailChangeValues) {
                        tail = tailChangeValues[f-part1Length];
                    }

                    frames[frameIndex] = {
                        y,
                        tail,
                        alpha
                    };
                }
            
                return {
                    x: p.x,
                    frames
                }
            })
            
            for(let f = 0; f < framesCount; f++){
                frames[f] = createCanvas(size, (ctx, size, hlp) => {
                    for(let p = 0; p < itemsData.length; p++){
                        let itemData = itemsData[p];
                        
                        if(itemData.frames[f]){

                            let p = new V2(itemData.x, itemData.frames[f].y);

                            hlp.setFillColor(rgbColorPart + itemData.frames[f].alpha + ')').dot(p);

                            if(itemData.frames[f].tail > 0) {
                                for(let i = 0; i < itemData.frames[f].tail; i++) {
                                    hlp.dot(p.add(new V2(0, i+1)));
                                }
                            }
                        }
                        
                    }
                });
            }
            
            return frames;
        }

        let createFogFrames = function({size, maskImgArray, topLeft, noiseImgSize, aMul = 1,seed, paramsDivider = 30}) {
            let frames = [];

            let pn = new mathUtils.Perlin('random seed ' + (seed ? seed : getRandom(0,1000)));

            frames = [];

            let timeClamp = 1;
            let cutoffValue = 10;
            let aValues = easing.fast({from: 0, to: 1, steps: 100 - cutoffValue, type: 'linear', round: 2})
            let timeValues = easing.fast({ from: 0, to: timeClamp, steps: totalFrames, type: 'linear', round: 3 })
            let globalAlpha = [
                ...easing.fast({from: 0, to: 0.5, steps: totalFrames/2, type: 'sin', method: 'inOut', round: 2}),
                ...easing.fast({from: 0.5, to: 0, steps: totalFrames/2, type: 'sin', method: 'inOut', round: 2})
            ]

            let maskImgToggle = maskImgArray ? [
                ...easing.fast({from: 0, to: maskImgArray.length-1, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0}),
                ...easing.fast({from: maskImgArray.length-1, to: 0, steps: totalFrames/2, type: 'quad', method: 'inOut', round: 0})
            ] : [];
            

            //let paramsDivider = 30;
            let timeDivider = 1;

            for(let f = 0; f < totalFrames; f++){
                let time = timeValues[f]/timeDivider;

                let frame = createCanvas(size, (ctx, size, hlp) => {
                    ctx.globalAlpha = globalAlpha[f];
                    for(let y = topLeft.y; y < noiseImgSize.y+topLeft.y; y++){
                        for(let x = topLeft.x; x < noiseImgSize.x+topLeft.x; x++){
                            let noise = fast.r(pn.noise(x/paramsDivider,y/paramsDivider,time)*100);
                            if(noise < cutoffValue) {
                                continue; 
                            }

                            noise = fast.r(noise/4)*4

                            let a = aValues[noise-cutoffValue]*aMul;

                            hlp.setFillColor(colorRgbPrefix + a).dot(x,y);
                        }
                    }

                    if(maskImgArray) {
                        ctx.globalAlpha = 1;
                        
                        ctx.globalCompositeOperation = 'destination-in'
                        ctx.drawImage(maskImgArray[maskImgToggle[f]], 0, 0)
                        ctx.globalCompositeOperation = 'source-in'
                    }
                })

                frames[f] = frame;
            }

            return frames;
        }
        

        this.main = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-5,-5)),
            size: this.viewport.clone(),
            init() {
                let rSpread = 1;
                let gradientDotsArray = [];
                let maskImgArray = []
                for(let i = 0; i < rSpread; i++) {
                    let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(80,100), radius: new V2(60-i,85-i), 
                        gradientOrigin: new V2(52,32), angle: -25, easingType: 'cubic', 
                        setter: (dot, aValue) => {
                            let mul = 1;
    
                            aValue*=mul;
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })

                    gradientDotsArray.push(gradientDots);
    
                    let maskImg = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < gradientDots.length; y++) {
                            if(gradientDots[y]) {
                                for(let x = 0; x < gradientDots[y].length; x++) {
                                    if(gradientDots[y][x]) {
                                        hlp.setFillColor(`${colorRgbPrefix}${gradientDots[y][x].maxValue*1.5})`).dot(x,y)
                                    }
                                }
                            }
                        }
    
                        // restrictionLineDots.forEach(p => hlp.setFillColor('red').dot(p))
                    })

                    maskImgArray.push(maskImg)
                }

                

                let gradientDots2 = colors.createRadialGradient({ size: this.size, center: new V2(55,50), radius: new V2(30,30), 
                    gradientOrigin: new V2(52,32), angle: -25, easingType: 'cubic', 
                    setter: (dot, aValue) => {
                        let mul = 1;

                        aValue*=mul;
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } })

                let maskImg2 = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots2.length; y++) {
                        if(gradientDots2[y]) {
                            for(let x = 0; x < gradientDots2[y].length; x++) {
                                if(gradientDots2[y][x]) {
                                    hlp.setFillColor(`${colorRgbPrefix}${gradientDots2[y][x].maxValue*1})`).dot(x,y)
                                }
                            }
                        }
                    }

                    // restrictionLineDots.forEach(p => hlp.setFillColor('red').dot(p))
                })

                

                //maskImg = undefined
                
                let noiseImgSize = new V2(120,130);
                let topLeft = new V2(20,20)

                // perlin seed: random seed 901.757256236326
                // perlin seed: random seed 954.9563338706872
                // perlin seed: random seed 225.791236118154

                //maskImgArray = undefined;

                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1.1, seed: seeds[0]});
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                this.parent.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))

                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1.1, seed: seeds[1]});
                        this.registerFramesDefaultTimer({ startFrameIndex: totalFrames/3});
                    }
                }))

                this.l3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1.1, seed: seeds[2]});
                        this.registerFramesDefaultTimer({ startFrameIndex: totalFrames*2/3});
                    }
                }))

                this.lamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(lampModel, { renderOnly: ['lamp'] })
                        
                    }
                }))

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.75;
                            ctx.drawImage(maskImg2,0,0)
                        });
                    }
                }))

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        let pd = animationHelpers.extractPointData(lampModel.main.layers.find(l => l.name == 'p'))
                        this.frames = animationHelpers.createMovementFrames({
                            framesCount: totalFrames, itemFrameslength: [100,150], pointsData: pd, size: new V2(200,200) 
                        });

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.fallingDrops = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createDropsFrames({ framesCount: totalFrames, itemFrameslength1Clamps: [40,40], itemFrameslength2Clamps: [25, 25], size: this.
                            size, opacityClamps: [0.5, 0.5], reduceOpacityOnFall: true, rgbColorPart: colorRgbPrefix,
                            startPositions: {
                                points: [new V2(61,31)], tail: 3, height: 70
                            }
                        })

                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.brightGround = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255,0.05)')
                                .rect(50,140,70,1)
                                .rect(60,139,50,1)
                                .rect(55,141,50,1)
                            .setFillColor('rgba(255,255,255,0.025)').rect(60,140,50,1)
                                .rect(70,140,30,1);
                        })
                    }
                }))
            }
        }), 4)

        this.main2 = this.addGo(new GO({
            position: this.sceneCenter.add(new V2(-5,-25)),
            size: this.viewport.clone(),
            init() {
                let rSpread = 1;
                let gradientDotsArray = [];
                let maskImgArray = []
                let gradientShift = new V2(0,0)//new V2(-50,-50)
                for(let i = 0; i < rSpread; i++) {
                    let gradientDots = colors.createRadialGradient({ size: this.size, center: new V2(120,116).add(gradientShift), radius: new V2(30-i,45-i), 
                        gradientOrigin: new V2(105,83).add(gradientShift), angle: -25, easingType: 'cubic', 
                        setter: (dot, aValue) => {
                            let mul = 1;
    
                            aValue*=mul;
                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
            
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
            
                            dot.values.push(aValue);
                        } })

                    gradientDotsArray.push(gradientDots);
    
                    let maskImg = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < gradientDots.length; y++) {
                            if(gradientDots[y]) {
                                for(let x = 0; x < gradientDots[y].length; x++) {
                                    if(gradientDots[y][x]) {
                                        hlp.setFillColor(`${colorRgbPrefix}${gradientDots[y][x].maxValue*1})`).dot(x,y)
                                    }
                                }
                            }
                        }
    
                        // restrictionLineDots.forEach(p => hlp.setFillColor('red').dot(p))
                    })

                    maskImgArray.push(maskImg)
                }

                

                let gradientDots2 = colors.createRadialGradient({ size: this.size, center: new V2(106,90), radius: new V2(15,15), 
                    gradientOrigin: new V2(105,83), angle: -25, easingType: 'cubic', 
                    setter: (dot, aValue) => {
                        let mul = 1;

                        aValue*=mul;
                        if(!dot.values){
                            dot.values = [];
                            dot.maxValue = aValue;
                        }
        
                        if(aValue > dot.maxValue)
                            dot.maxValue = aValue;
        
                        dot.values.push(aValue);
                    } })

                let maskImg2 = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < gradientDots2.length; y++) {
                        if(gradientDots2[y]) {
                            for(let x = 0; x < gradientDots2[y].length; x++) {
                                if(gradientDots2[y][x]) {
                                    hlp.setFillColor(`${colorRgbPrefix}${gradientDots2[y][x].maxValue*1})`).dot(x,y)
                                }
                            }
                        }
                    }

                    // restrictionLineDots.forEach(p => hlp.setFillColor('red').dot(p))
                })

                
                //this.img = maskImgArray[0];
                //maskImgArray = undefined
                
                let noiseImgSize = new V2(60,75);
                let topLeft = new V2(90,75)

                // perlin seed: random seed 901.757256236326
                // perlin seed: random seed 954.9563338706872
                // perlin seed: random seed 225.791236118154

                this.l1 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1, paramsDivider: 30, seed: seeds[3]});
                        this.registerFramesDefaultTimer({});
                    }
                }))

                this.l2 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1, paramsDivider: 30, seed: seeds[4]});
                        this.registerFramesDefaultTimer({ startFrameIndex: totalFrames/3});
                    }
                }))

                this.l3 = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.frames = createFogFrames({size: this.size, maskImgArray, noiseImgSize, topLeft, aMul: 1, paramsDivider: 30, seed: seeds[5]});
                        this.registerFramesDefaultTimer({ startFrameIndex: totalFrames*2/3});
                    }
                }))

                // this.bgImg = this.addChild(new GO({
                //     position: gradientShift.mul(-1),
                //     size: this.size,
                //     init() {
                //         this.img = maskImgArray[0];
                        
                //     }
                // }))

                this.lamp = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = PP.createImage(lampModel, { renderOnly: ['lamp2'] })
                        
                    }
                }))

                this.light = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(maskImg2,0,0)
                        });
                    }
                }))

                this.brightGround = this.addChild(new GO({
                    position: new V2(),
                    size: this.size,
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('rgba(255,255,255,0.04)')
                                .rect(105,138,30,1)
                                // .rect(55,139,60,1)
                                // .rect(60,141,60,1)
                            .setFillColor('rgba(255,255,255,0.02)').rect(111,138,15,1)
                                //.rect(120,140,10,1);
                        })
                    }
                }))

                // this.p = this.addChild(new GO({
                //     position: new V2(),
                //     size: this.size,
                //     init() {
                //         let pd = animationHelpers.extractPointData(lampModel.main.layers.find(l => l.name == 'p'))
                //         this.frames = animationHelpers.createMovementFrames({
                //             framesCount: totalFrames, itemFrameslength: [100,150], pointsData: pd, size: new V2(200,200) 
                //         });

                //         this.registerFramesDefaultTimer({});
                //     }
                // }))

              
            }
        }), 2)

   
    }
}