var forestImages = {
    treeTemplate: () => ({"general":{"originalSize":{"x":12,"y":28},"size":{"x":12,"y":28},"zoom":10,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#DC8929","fillColor":"#DC8929","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":5,"y":27}},{"point":{"x":5,"y":16}},{"point":{"x":6,"y":16}},{"point":{"x":6,"y":27}}]},{"order":1,"type":"lines","strokeColor":"#93530B","fillColor":"#93530B","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":6,"y":27}},{"point":{"x":6,"y":21}}]},{"order":2,"type":"lines","strokeColor":"#9CE78C","fillColor":"#9CE78C","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":20}},{"point":{"x":0,"y":18}},{"point":{"x":0,"y":14}},{"point":{"x":1,"y":14}},{"point":{"x":1,"y":10}},{"point":{"x":2,"y":10}},{"point":{"x":2,"y":6}},{"point":{"x":3,"y":6}},{"point":{"x":3,"y":4}},{"point":{"x":4,"y":4}},{"point":{"x":4,"y":2}},{"point":{"x":6,"y":0}},{"point":{"x":6,"y":2}},{"point":{"x":7,"y":2}},{"point":{"x":7,"y":4}},{"point":{"x":8,"y":4}},{"point":{"x":8,"y":7}},{"point":{"x":9,"y":7}},{"point":{"x":9,"y":12}},{"point":{"x":10,"y":12}},{"point":{"x":10,"y":14}},{"point":{"x":11,"y":14}},{"point":{"x":11,"y":18}},{"point":{"x":9,"y":20}}]},{"order":3,"type":"lines","strokeColor":"#41D122","fillColor":"#41D122","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":2,"y":20}},{"point":{"x":3,"y":19}},{"point":{"x":3,"y":16}},{"point":{"x":2,"y":16}},{"point":{"x":4,"y":18}},{"point":{"x":6,"y":18}},{"point":{"x":6,"y":16}},{"point":{"x":3,"y":12}},{"point":{"x":3,"y":11}},{"point":{"x":6,"y":13}},{"point":{"x":7,"y":13}},{"point":{"x":7,"y":11}},{"point":{"x":4,"y":8}},{"point":{"x":3,"y":8}},{"point":{"x":5,"y":8}},{"point":{"x":5,"y":5}},{"point":{"x":4,"y":5}},{"point":{"x":4,"y":3}},{"point":{"x":5,"y":3}},{"point":{"x":8,"y":5}},{"point":{"x":8,"y":7}},{"point":{"x":9,"y":7}},{"point":{"x":9,"y":12}},{"point":{"x":10,"y":12}},{"point":{"x":10,"y":14}},{"point":{"x":11,"y":14}},{"point":{"x":11,"y":18}},{"point":{"x":9,"y":20}}]},{"order":4,"type":"lines","strokeColor":"#21860E","fillColor":"#21860E","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":2,"y":20}},{"point":{"x":3,"y":19}},{"point":{"x":3,"y":20}},{"point":{"x":6,"y":20}},{"point":{"x":7,"y":19}},{"point":{"x":7,"y":20}},{"point":{"x":8,"y":19}},{"point":{"x":8,"y":20}},{"point":{"x":9,"y":20}},{"point":{"x":10,"y":19}},{"point":{"x":9,"y":18}},{"point":{"x":11,"y":18}},{"point":{"x":11,"y":14}},{"point":{"x":10,"y":14}},{"point":{"x":10,"y":13}},{"point":{"x":9,"y":12}},{"point":{"x":8,"y":11}},{"point":{"x":5,"y":9}},{"point":{"x":7,"y":11}},{"point":{"x":9,"y":13}},{"point":{"x":10,"y":15}},{"point":{"x":7,"y":15}},{"point":{"x":6,"y":14}},{"point":{"x":9,"y":15}},{"point":{"x":10,"y":16}},{"point":{"x":10,"y":17}}]},{"order":5,"type":"lines","strokeColor":"#21860E","fillColor":"#21860E","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":5,"y":5}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":7}},{"point":{"x":7,"y":7}},{"point":{"x":9,"y":8}},{"point":{"x":9,"y":7}},{"point":{"x":8,"y":6}},{"point":{"x":6,"y":6}}]}]}}),
    getTreeTemplate: (size) => ({
        general: {
            size: {x: size.x, y: size.y}
        },
        main: {
            layers: [
                { // trunk
                    "order": 0,
                    "type": "lines",
                    "strokeColor": "#FF0000",
                    "fillColor": "#FF0000",
                    "closePath": true,
                    "fill": true,
                    "visible": true,
                    "points": []
                },
                { // trunk shadowed
                    "order": 1,
                    "type": "lines",
                    "strokeColor": "#FF0000",
                    "fillColor": "#FF0000",
                    "closePath": true,
                    "fill": true,
                    "visible": true,
                    "points": []
                },
                { // crown main
                    "order": 2,
                    "type": "lines",
                    "strokeColor": "#FF0000",
                    "fillColor": "#FF0000",
                    "closePath": true,
                    "fill": true,
                    "visible": true,
                    "points": []
                },
                { // crown secondary color
                    "order": 3,
                    "type": "lines",
                    "strokeColor": "#FF0000",
                    "fillColor": "#FF0000",
                    "closePath": true,
                    "fill": true,
                    "visible": true,
                    "points": []
                },
                { // crown shadowed
                    "order": 4,
                    "type": "lines",
                    "strokeColor": "#FF0000",
                    "fillColor": "#FF0000",
                    "closePath": true,
                    "fill": true,
                    "visible": true,
                    "points": []
                }
            ]
        }
    })
}