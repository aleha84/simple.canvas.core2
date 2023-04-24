class GameOverScene extends Scene {
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
                size: new V2(100,100).mul(10),
                totalFramesToRecord: 601,
                frameRate: 60,
                fileNamePrefix: 'gameover',
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
        let lettersModel = {
            "general": {
                "originalSize": {
                    "x": 100,
                    "y": 100
                },
                "size": {
                    "x": 100,
                    "y": 100
                },
                "zoom": 4,
                "showGrid": false,
                "renderOptimization": false,
                "animated": false,
                "backgroundColor": "#000000",
                "palettes": []
            },
            "main": {
                "layers": [
                    {
                        "order": 1,
                        "id": "m_2",
                        "name": "hash",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_2_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 25,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_2_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 25,
                                            "y": 50
                                        },
                                        "order": 1,
                                        "id": "m_2_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 25,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_2_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 25,
                                            "y": 52
                                        },
                                        "order": 3,
                                        "id": "m_2_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 25,
                                            "y": 53
                                        },
                                        "order": 4,
                                        "id": "m_2_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 24,
                                            "y": 50
                                        },
                                        "order": 5,
                                        "id": "m_2_g_0_p_5"
                                    },
                                    {
                                        "point": {
                                            "x": 26,
                                            "y": 50
                                        },
                                        "order": 6,
                                        "id": "m_2_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 27,
                                            "y": 50
                                        },
                                        "order": 7,
                                        "id": "m_2_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 27,
                                            "y": 49
                                        },
                                        "order": 8,
                                        "id": "m_2_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 27,
                                            "y": 51
                                        },
                                        "order": 9,
                                        "id": "m_2_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 27,
                                            "y": 52
                                        },
                                        "order": 10,
                                        "id": "m_2_g_0_p_12"
                                    },
                                    {
                                        "point": {
                                            "x": 27,
                                            "y": 53
                                        },
                                        "order": 11,
                                        "id": "m_2_g_0_p_13"
                                    },
                                    {
                                        "point": {
                                            "x": 26,
                                            "y": 52
                                        },
                                        "order": 12,
                                        "id": "m_2_g_0_p_14"
                                    },
                                    {
                                        "point": {
                                            "x": 24,
                                            "y": 52
                                        },
                                        "order": 13,
                                        "id": "m_2_g_0_p_15"
                                    },
                                    {
                                        "point": {
                                            "x": 28,
                                            "y": 52
                                        },
                                        "order": 14,
                                        "id": "m_2_g_0_p_16"
                                    },
                                    {
                                        "point": {
                                            "x": 28,
                                            "y": 50
                                        },
                                        "order": 15,
                                        "id": "m_2_g_0_p_17"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 2,
                        "id": "m_1",
                        "name": "letter_g",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 33,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 32,
                                            "y": 49
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 31,
                                            "y": 49
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 30,
                                            "y": 50
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_5"
                                    },
                                    {
                                        "point": {
                                            "x": 30,
                                            "y": 51
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 30,
                                            "y": 52
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 31,
                                            "y": 53
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 32,
                                            "y": 53
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 33,
                                            "y": 53
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 33,
                                            "y": 52
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 33,
                                            "y": 51
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_12"
                                    },
                                    {
                                        "point": {
                                            "x": 32,
                                            "y": 51
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_13"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 3,
                        "id": "m_3",
                        "name": "letter_a",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 35,
                                            "y": 53
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 35,
                                            "y": 52
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 35,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 35,
                                            "y": 50
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 36,
                                            "y": 49
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 37,
                                            "y": 49
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 38,
                                            "y": 50
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 38,
                                            "y": 51
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_12"
                                    },
                                    {
                                        "point": {
                                            "x": 38,
                                            "y": 52
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_13"
                                    },
                                    {
                                        "point": {
                                            "x": 38,
                                            "y": 53
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_14"
                                    },
                                    {
                                        "point": {
                                            "x": 36,
                                            "y": 51
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_15"
                                    },
                                    {
                                        "point": {
                                            "x": 37,
                                            "y": 51
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_16"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 4,
                        "id": "m_4",
                        "name": "letter_m",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 40,
                                            "y": 53
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 40,
                                            "y": 52
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 40,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 40,
                                            "y": 50
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 40,
                                            "y": 49
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 41,
                                            "y": 50
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 42,
                                            "y": 51
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 43,
                                            "y": 50
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 44,
                                            "y": 49
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 44,
                                            "y": 50
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 44,
                                            "y": 51
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 44,
                                            "y": 52
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_12"
                                    },
                                    {
                                        "point": {
                                            "x": 44,
                                            "y": 53
                                        },
                                        "order": 12,
                                        "id": "m_1_g_0_p_13"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 5,
                        "id": "m_5",
                        "name": "letter_e",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 46,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 47,
                                            "y": 49
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 48,
                                            "y": 49
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 49,
                                            "y": 49
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 46,
                                            "y": 50
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 46,
                                            "y": 51
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_5"
                                    },
                                    {
                                        "point": {
                                            "x": 46,
                                            "y": 52
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 46,
                                            "y": 53
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 47,
                                            "y": 53
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 48,
                                            "y": 53
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 49,
                                            "y": 53
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 47,
                                            "y": 51
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 48,
                                            "y": 51
                                        },
                                        "order": 12,
                                        "id": "m_1_g_0_p_12"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 6,
                        "id": "m_6",
                        "name": "letter_o",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 54,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 53,
                                            "y": 50
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 53,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 53,
                                            "y": 52
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 55,
                                            "y": 49
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 56,
                                            "y": 50
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 56,
                                            "y": 51
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 56,
                                            "y": 52
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 55,
                                            "y": 53
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 54,
                                            "y": 53
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_10"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 7,
                        "id": "m_7",
                        "name": "letter_v",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 58,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 58,
                                            "y": 50
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 58,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 59,
                                            "y": 52
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 60,
                                            "y": 53
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 62,
                                            "y": 51
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 62,
                                            "y": 50
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 62,
                                            "y": 49
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 61,
                                            "y": 52
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_9"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 8,
                        "id": "m_8",
                        "name": "letter_e2",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 64,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 65,
                                            "y": 49
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 66,
                                            "y": 49
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 67,
                                            "y": 49
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 64,
                                            "y": 50
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 64,
                                            "y": 51
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_5"
                                    },
                                    {
                                        "point": {
                                            "x": 64,
                                            "y": 52
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 64,
                                            "y": 53
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 65,
                                            "y": 53
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_8"
                                    },
                                    {
                                        "point": {
                                            "x": 66,
                                            "y": 53
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 67,
                                            "y": 53
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 65,
                                            "y": 51
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 66,
                                            "y": 51
                                        },
                                        "order": 12,
                                        "id": "m_1_g_0_p_12"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "order": 9,
                        "id": "m_9",
                        "name": "letter_r",
                        "visible": true,
                        "groups": [
                            {
                                "order": 0,
                                "type": "dots",
                                "strokeColor": "#FF0000",
                                "strokeColorOpacity": 1,
                                "fillColor": "#FF0000",
                                "fillColorOpacity": 1,
                                "closePath": false,
                                "fill": false,
                                "fillPattern": false,
                                "patternType": "type1",
                                "numOfSegments": 16,
                                "visible": true,
                                "clear": false,
                                "replace": false,
                                "id": "m_1_g_0",
                                "points": [
                                    {
                                        "point": {
                                            "x": 69,
                                            "y": 49
                                        },
                                        "order": 0,
                                        "id": "m_1_g_0_p_0"
                                    },
                                    {
                                        "point": {
                                            "x": 69,
                                            "y": 50
                                        },
                                        "order": 1,
                                        "id": "m_1_g_0_p_1"
                                    },
                                    {
                                        "point": {
                                            "x": 69,
                                            "y": 51
                                        },
                                        "order": 2,
                                        "id": "m_1_g_0_p_2"
                                    },
                                    {
                                        "point": {
                                            "x": 69,
                                            "y": 52
                                        },
                                        "order": 3,
                                        "id": "m_1_g_0_p_3"
                                    },
                                    {
                                        "point": {
                                            "x": 69,
                                            "y": 53
                                        },
                                        "order": 4,
                                        "id": "m_1_g_0_p_4"
                                    },
                                    {
                                        "point": {
                                            "x": 70,
                                            "y": 49
                                        },
                                        "order": 5,
                                        "id": "m_1_g_0_p_5"
                                    },
                                    {
                                        "point": {
                                            "x": 71,
                                            "y": 49
                                        },
                                        "order": 6,
                                        "id": "m_1_g_0_p_6"
                                    },
                                    {
                                        "point": {
                                            "x": 72,
                                            "y": 50
                                        },
                                        "order": 7,
                                        "id": "m_1_g_0_p_7"
                                    },
                                    {
                                        "point": {
                                            "x": 71,
                                            "y": 51
                                        },
                                        "order": 8,
                                        "id": "m_1_g_0_p_9"
                                    },
                                    {
                                        "point": {
                                            "x": 70,
                                            "y": 51
                                        },
                                        "order": 9,
                                        "id": "m_1_g_0_p_10"
                                    },
                                    {
                                        "point": {
                                            "x": 71,
                                            "y": 52
                                        },
                                        "order": 10,
                                        "id": "m_1_g_0_p_11"
                                    },
                                    {
                                        "point": {
                                            "x": 72,
                                            "y": 53
                                        },
                                        "order": 11,
                                        "id": "m_1_g_0_p_12"
                                    },
                                    {
                                        "point": {
                                            "x": 72,
                                            "y": 51
                                        },
                                        "order": 12,
                                        "id": "m_1_g_0_p_13"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        let leafsData = [];
        let _colorsOrdered = ['#60954f', '#548943', '#487c37', '#3c6f2b', '#2f621f', '#015217', '#014510', '#003809']

        this.bg = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#2f621f').rect(0,0,size.x, size.y);

                    let _colors = ['#487c37',  '#015217', '#014510', '#3c6f2b', '#548943']
                    let _colors2 = ['#60954f', '#003809']

                    

                    for(let i = 0; i < 15000; i++) {

                        // let x = fast.r(getRandomGaussian(-size.x/2, size.x*1.5))
                        // let y = fast.r(getRandomGaussian(-size.y/2, size.y*1.5))
                        // let p0 = new V2(x,y);
                        //[p0];
                        let points = [new V2(getRandomInt(0, size.x), getRandomInt(0, size.y))];
                        
                        if(getRandomBool()) {
                            if(getRandomBool()) {
                                let xShift = getRandomBool() ? 1 : -1;
                                points[points.length] = new V2(points[0].x + xShift, points[0].y);
                            }

                            if(getRandomBool()) {
                                let yShift = getRandomBool() ? 1 : -1;
                                points[points.length] = new V2(points[0].x, points[0].y + yShift);
                            }
                        }
                        

                        // if(getRandomBool()) {
                        //     let yShift = getRandomBool() ? 1 : -1;
                        //     points[points.length] = new V2(points[0].x, points[0].y + yShift);
                        // }

                        /* v1
                        let c = _colors[getRandomInt(0, _colors.length-1)];
                        // if(getRandomInt(0,8) == 0) {
                        //     c = _colors2[getRandomInt(0, _colors2.length-1)]
                        // }
                        hlp.setFillColor(c);
                        points.forEach(p => hlp.dot(p));

                        if(getRandomInt(0, 4) == 0) {
                            if(c == '#487c37') {
                                hlp.setFillColor('#60954f').dot(points[0]);
                            }   

                            if(c == '#014510') {
                                hlp.setFillColor('#003809').dot(points[0]);
                            }   
                        }
                        */

                        //v2
                        let ci = getRandomInt(1, _colorsOrdered.length-1);
                        hlp.setFillColor(_colorsOrdered[ci]);

                        points.forEach(p => {
                            hlp.dot(p)
                        });
                        if(getRandomInt(0, 3) == 0) {
                            hlp.setFillColor(hlp.setFillColor(_colorsOrdered[ci--])).dot(points[0]);
                        }
                    }
                })

                let colorsCache = {};

                let rgbToHex = (rgb) => {
                    let key = rgb[0]*1000000 + rgb[1]*1000 + rgb[2];
                    if(!colorsCache[key]) {
                        colorsCache[key] = colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' })
                    }

                    return colorsCache[key];
                }

                leafsData = getPixels(this.img, this.size);
                leafsData.forEach(ldi => {
                    ldi.hex = rgbToHex(ldi.color);
                    ldi.cIndex = _colorsOrdered.indexOf(ldi.hex)
                });

                // console.log(colorsCache);
                // console.log(leafsData)

                this.p = this.addChild(new GO({
                    position: new V2(),
                    size: this.size, 
                    init() {
                        let pointsData = [];
                        leafsData.forEach(ld => {
                            if(getRandomInt(0,5)!=0) {
                                return;
                            }

                            pointsData.push({
                                color: ld.hex, 
                                point: ld.position.add(new V2(getRandomInt(-1, 1), getRandomInt(-1, 1)))
                            })
                        })

                        this.frames = animationHelpers.createMovementFrames({ framesCount: 300, itemFrameslength: [30,50], size: this.size, 
                            pointsData
                         });
        
                        this.registerFramesDefaultTimer({
                            framesEndCallback: () => {
                                //this.parentScene.capturing.stop = true;
                            }
                        });
                    }
                }))
            }
        }), 1)

        this.letters = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {

                let letterImages = [];
                lettersModel.main.layers.forEach((l,i) => {
                    // if(i < 2) {
                    //     ctx.drawImage(PP.createImage(lettersModel, { renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#6FFFDC' } } }), 1,0); 
                    // }

                    // if(i > lettersModel.main.layers.length-3) {
                    //     ctx.drawImage(PP.createImage(lettersModel, { renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#6FFFDC' } } }), -1,0); 
                    // }

                    let tl = undefined;
                    let br = undefined;

                    l.groups[0].points.forEach(p => {
                        if(tl == undefined) {
                            tl = new V2(p.point);
                        }
                        else {
                            if(p.point.x < tl.x) {
                                tl.x = p.point.x;
                            }

                            if(p.point.y < tl.y) {
                                tl.y = p.point.y;
                            }
                        }

                        if(br == undefined) {
                            br = new V2(p.point);
                        }
                        else {
                            if(p.point.x > br.x) {
                                br.x = p.point.x;
                            }

                            if(p.point.y > br.y) {
                                br.y = p.point.y;
                            }
                        }
                    })

                    let center = tl.add(br.substract(tl).divide(2)).toInt();

                    let leafLightMaxDistance = 30
                    let leafLightDistanceValues = easing.fast({ from: 0.05, to: 0, steps: leafLightMaxDistance, type: 'quad', method: 'out', round: 3});

                    let gradientDots = colors.createRadialGradient({ size: this.size, center: center, radius: new V2(20,20), gradientOrigin: center, angle: 0,
                        easingType: 'expo',
                        setter: (dot, aValue) => {
                            aValue*=2;
                            if(aValue > 1) 
                                aValue = 1;

                            if(!dot.values){
                                dot.values = [];
                                dot.maxValue = aValue;
                            }
    
                            if(aValue > dot.maxValue)
                                dot.maxValue = aValue;
    
                            dot.values.push(aValue);
                    } })

                    let lightImg = createCanvas(this.size, (ctx, size, hlp) => {
                        for(let y = 0; y < gradientDots.length; y++) {
                            if(gradientDots[y]) {
                                for(let x = 0; x < gradientDots[y].length; x++) {
                                    if(gradientDots[y][x]) {
                                        hlp.setFillColor(`rgba(0,255,122,${gradientDots[y][x].maxValue*0.5})`).dot(x,y) //
                                    }
                                }
                            }
                        }

                        leafsData.forEach(ld => {
                            let d = fast.r(ld.position.distance(center));
                            if(d < leafLightMaxDistance && ld.cIndex < 2) { 
                                let a = leafLightDistanceValues[d];
                                hlp.setFillColor(`rgba(255,255,255,${a})`).dot(ld.position); //setFillColor(`rgba(0,255,122,${a})`)
                            }
                        })
                    })

                    letterImages.push({
                        name: l.name,
                        light: lightImg,//i == 0 ? lightImg : undefined,
                        letter: PP.createImage(lettersModel, { renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#FFFFFD' } } }),
                        letterDark: PP.createImage(lettersModel, { renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#052D05', opacity: 0.5 } } }),
                        letterDark2: PP.createImage(lettersModel, { renderOnly: [l.name], colorsSubstitutions: { '#FF0000': { color: '#052D05', opacity: 1 } } })
                    })
                }) 

                let overSwitchData = [
                    [150,200],
                    [210,215],
                    [230,240]
                ]

                let lettersSwitchOffData = {
                    'letter_a': {
                        clamps: [
                            [20,25],
                            [30,45],
                            [60,65],
                        ]
                    },
                    // 'letter_e': {
                    //     clamps: [
                    //         [280,285],
                    //     ]
                    // },
                    'letter_o': {
                        useDark2: true,
                        clamps: overSwitchData
                    },
                    'letter_v': {
                        useDark2: true,
                        clamps: overSwitchData
                    },
                    'letter_e2': {
                        useDark2: true,
                        clamps: overSwitchData
                    },
                    'letter_r': {
                        useDark2: true,
                        clamps: [...overSwitchData,
                            { clamps: [265, 270], useDark2: false}
                        ]
                    }
                }

                let totalFrames = 300;

                this.frames = [];

                for(let f = 0; f < totalFrames; f++) {
                    this.frames[f] = createCanvas(this.size, (ctx, size, hlp) => {
                        let data = []
                        
                        letterImages.forEach((li, i) => {
                            let isOn = true;
                            let swithOffData = lettersSwitchOffData[li.name];
                            let useDark2 = undefined;
                            if(swithOffData) {
                                useDark2 = swithOffData.useDark2;

                                for(let i = 0; i < swithOffData.clamps.length; i++) {
                                    let clamp = isObject(swithOffData.clamps[i]) ? swithOffData.clamps[i].clamps : swithOffData.clamps[i];
                                    if(isBetween(f, clamp)) {
                                        isOn = false;
                                        if(isObject(swithOffData.clamps[i]) && swithOffData.clamps[i].useDark2 != undefined) {
                                            useDark2 = swithOffData.clamps[i].useDark2
                                        }

                                        break;
                                    }
                                }
                            }

                            data[i] = {isOn, useDark2 };
                        })

                        data.forEach((d,i) => {
                            if(d.isOn) {
                                ctx.drawImage(letterImages[i].light, 0,0)
                            }
                        })

                        data.forEach((d,i) => {
                            if(d.isOn) {
                                ctx.drawImage(letterImages[i].letter, 0,0)
                            }
                            else {
                                if(d.useDark2) {
                                    ctx.drawImage(letterImages[i].letterDark2, 0,0)
                                }
                                else {
                                    ctx.drawImage(letterImages[i].letterDark, 0,0)
                                }
                            }
                        })
                    })
                }

                this.registerFramesDefaultTimer({
                    framesEndCallback: () => {
                        this.parentScene.capturing.stop = true;
                    }
                });

                // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    
                    
                //     // letterImages.forEach((li, i) => {
                //     //     if(li.light && i < 5)
                //     //         ctx.drawImage(li.light, 0, 0)
                //     // })

                //     // letterImages.forEach((li, i) => {
                //     //     if(li.letter && i < 5)
                //     //         ctx.drawImage(li.letter, 0, 0)
                //     //     else 
                //     //         ctx.drawImage(li.letterDark, 0, 0)
                //     // })
                // })
            }
        }), 5)

        this.darkOverlay = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: this.viewport.clone(),
            init() {
                let overlayHeight = 35;
                let aValues = easing.fast({from: 0.4, to: 0, steps: overlayHeight, type: 'linear', round: 2})
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    for(let y = 0; y < overlayHeight; y++) {
                        hlp.setFillColor(`rgba(0,0,0, ${aValues[y]})`).rect(0,y,size.x, 1)
                        hlp.setFillColor(`rgba(0,0,0, ${aValues[y]})`).rect(0,size.y-y-1,size.x, 1)
                    }
                })
            }
        }), 6)
    }
}