class SparksScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {

        }, options);

        super(options);
    }

    start(){
        this.addGo(new SparksGeneratorObject({
            position: this.sceneCenter
        }))
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}

class SparksGeneratorObject extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            size: new V2(20, 30),
            //greenClamps: [40, 120],
            redClamps: [80, 180],
            green: 54,
            //red: 240,
            blue: 79 
        }, options);

        super(options);

        this.imgTemplate = {"general":{"originalSize":{"x":20,"y":30},"size":{"x":20,"y":30},"zoom":6,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#655379","fillColor":"#655379","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":7,"y":0}},{"point":{"x":11,"y":1}},{"point":{"x":15,"y":3}},{"point":{"x":16,"y":8}},{"point":{"x":19,"y":12}},{"point":{"x":18,"y":19}},{"point":{"x":15,"y":25}},{"point":{"x":12,"y":27}},{"point":{"x":9,"y":28}},{"point":{"x":6,"y":26}},{"point":{"x":2,"y":24}},{"point":{"x":1,"y":19}},{"point":{"x":2,"y":17}},{"point":{"x":1,"y":15}},{"point":{"x":2,"y":8}},{"point":{"x":3,"y":7}},{"point":{"x":4,"y":3}}]},{"order":1,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":10,"y":3}},{"point":{"x":13,"y":5}},{"point":{"x":14,"y":9}},{"point":{"x":15,"y":12}},{"point":{"x":13,"y":15}},{"point":{"x":12,"y":8}}]},{"order":2,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":5,"y":7}},{"point":{"x":3,"y":11}},{"point":{"x":3,"y":16}},{"point":{"x":3,"y":21}},{"point":{"x":4,"y":16}}]},{"order":3,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":11,"y":27}},{"point":{"x":15,"y":24}},{"point":{"x":15,"y":20}},{"point":{"x":14,"y":22}},{"point":{"x":12,"y":25}}]},{"order":4,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":7,"y":18}},{"point":{"x":6,"y":21}},{"point":{"x":7,"y":25}},{"point":{"x":8,"y":22}}]},{"order":5,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":9,"y":10}},{"point":{"x":9,"y":14}},{"point":{"x":11,"y":19}},{"point":{"x":11,"y":16}},{"point":{"x":10,"y":12}}]},{"order":6,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":6,"y":1}},{"point":{"x":4,"y":3}},{"point":{"x":6,"y":5}},{"point":{"x":6,"y":3}}]},{"order":7,"type":"lines","strokeColor":"#554666","fillColor":"#554666","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":18,"y":14}},{"point":{"x":18,"y":18}},{"point":{"x":17,"y":16}},{"point":{"x":17,"y":12}}]},{"order":8,"type":"lines","strokeColor":"#725F89","fillColor":"#725F89","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":8,"y":3}},{"point":{"x":7,"y":7}},{"point":{"x":7,"y":12}},{"point":{"x":8,"y":8}},{"point":{"x":9,"y":6}}]},{"order":9,"type":"lines","strokeColor":"#725F89","fillColor":"#725F89","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":4,"y":22}},{"point":{"x":2,"y":24}},{"point":{"x":3,"y":25}},{"point":{"x":5,"y":26}},{"point":{"x":4,"y":24}}]},{"order":10,"type":"lines","strokeColor":"#725F89","fillColor":"#725F89","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":9,"y":26}},{"point":{"x":12,"y":21}},{"point":{"x":13,"y":19}},{"point":{"x":14,"y":17}},{"point":{"x":16,"y":14}},{"point":{"x":15,"y":17}},{"point":{"x":15,"y":18}},{"point":{"x":12,"y":22}}]},{"order":11,"type":"lines","strokeColor":"#725F89","fillColor":"#725F89","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":13,"y":2}},{"point":{"x":14,"y":2}},{"point":{"x":15,"y":4}},{"point":{"x":16,"y":8}},{"point":{"x":14,"y":4}}]},{"order":12,"type":"lines","strokeColor":"#725F89","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":5,"y":19}},{"point":{"x":6,"y":15}},{"point":{"x":8,"y":14}}]},{"order":13,"type":"dots","strokeColor":"#725F89","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":6,"y":4}},{"point":{"x":7,"y":1}},{"point":{"x":11,"y":5}},{"point":{"x":10,"y":8}},{"point":{"x":6,"y":13}},{"point":{"x":5,"y":10}},{"point":{"x":7,"y":26}},{"point":{"x":6,"y":23}},{"point":{"x":13,"y":23}},{"point":{"x":17,"y":19}},{"point":{"x":17,"y":10}},{"point":{"x":1,"y":15}},{"point":{"x":1,"y":14}},{"point":{"x":11,"y":4}},{"point":{"x":11,"y":3}},{"point":{"x":5,"y":11}},{"point":{"x":5,"y":12}},{"point":{"x":6,"y":3}},{"point":{"x":6,"y":2}},{"point":{"x":17,"y":11}},{"point":{"x":18,"y":12}},{"point":{"x":18,"y":13}},{"point":{"x":10,"y":9}},{"point":{"x":10,"y":10}},{"point":{"x":11,"y":11}},{"point":{"x":11,"y":12}},{"point":{"x":7,"y":27}},{"point":{"x":8,"y":28}},{"point":{"x":7,"y":25}},{"point":{"x":8,"y":17}},{"point":{"x":8,"y":18}},{"point":{"x":8,"y":19}},{"point":{"x":9,"y":20}},{"point":{"x":9,"y":21}},{"point":{"x":9,"y":22}},{"point":{"x":2,"y":17}},{"point":{"x":2,"y":18}},{"point":{"x":2,"y":19}},{"point":{"x":1,"y":20}}]},{"order":14,"type":"dots","strokeColor":"#554666","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":11,"y":24}},{"point":{"x":11,"y":23}},{"point":{"x":11,"y":22}},{"point":{"x":10,"y":21}},{"point":{"x":10,"y":20}},{"point":{"x":16,"y":18}},{"point":{"x":16,"y":17}},{"point":{"x":16,"y":7}},{"point":{"x":16,"y":6}},{"point":{"x":4,"y":24}},{"point":{"x":1,"y":23}},{"point":{"x":1,"y":21}},{"point":{"x":1,"y":22}},{"point":{"x":2,"y":8}},{"point":{"x":2,"y":9}},{"point":{"x":8,"y":8}},{"point":{"x":8,"y":7}},{"point":{"x":13,"y":17}},{"point":{"x":13,"y":18}},{"point":{"x":13,"y":19}},{"point":{"x":17,"y":22}},{"point":{"x":17,"y":21}},{"point":{"x":4,"y":6}},{"point":{"x":9,"y":0}},{"point":{"x":10,"y":1}},{"point":{"x":11,"y":1}},{"point":{"x":11,"y":28}},{"point":{"x":10,"y":28}},{"point":{"x":6,"y":26}},{"point":{"x":9,"y":17}},{"point":{"x":9,"y":18}},{"point":{"x":3,"y":5}},{"point":{"x":3,"y":6}},{"point":{"x":3,"y":7}},{"point":{"x":3,"y":25}},{"point":{"x":4,"y":26}},{"point":{"x":5,"y":26}}]},{"order":15,"type":"dots","strokeColor":"#4A3D59","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":4,"y":11}},{"point":{"x":3,"y":12}},{"point":{"x":3,"y":13}},{"point":{"x":3,"y":14}},{"point":{"x":3,"y":15}},{"point":{"x":9,"y":12}},{"point":{"x":9,"y":13}},{"point":{"x":10,"y":14}},{"point":{"x":10,"y":15}},{"point":{"x":10,"y":16}},{"point":{"x":13,"y":8}},{"point":{"x":13,"y":9}},{"point":{"x":13,"y":10}},{"point":{"x":14,"y":11}},{"point":{"x":14,"y":12}},{"point":{"x":18,"y":15}},{"point":{"x":18,"y":16}},{"point":{"x":15,"y":23}},{"point":{"x":15,"y":24}},{"point":{"x":14,"y":25}},{"point":{"x":7,"y":21}},{"point":{"x":7,"y":22}},{"point":{"x":7,"y":23}},{"point":{"x":7,"y":2}},{"point":{"x":7,"y":3}},{"point":{"x":9,"y":28}},{"point":{"x":13,"y":19}},{"point":{"x":5,"y":4}},{"point":{"x":2,"y":20}},{"point":{"x":2,"y":21}},{"point":{"x":3,"y":22}},{"point":{"x":11,"y":25}},{"point":{"x":15,"y":19}},{"point":{"x":7,"y":6}},{"point":{"x":11,"y":7}}]},{"order":16,"type":"dots","strokeColor":"#7B6793","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":4,"y":26}},{"point":{"x":3,"y":25}},{"point":{"x":13,"y":21}},{"point":{"x":14,"y":20}},{"point":{"x":7,"y":9}},{"point":{"x":7,"y":10}},{"point":{"x":7,"y":11}},{"point":{"x":1,"y":13}},{"point":{"x":8,"y":5}},{"point":{"x":8,"y":4}},{"point":{"x":16,"y":13}},{"point":{"x":14,"y":26}},{"point":{"x":15,"y":25}},{"point":{"x":18,"y":11}},{"point":{"x":19,"y":12}},{"point":{"x":19,"y":13}},{"point":{"x":12,"y":1}}]},{"order":17,"type":"dots","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":13,"y":9}},{"point":{"x":13,"y":10}},{"point":{"x":14,"y":11}},{"point":{"x":11,"y":24}},{"point":{"x":3,"y":21}},{"point":{"x":7,"y":20}},{"point":{"x":7,"y":21}},{"point":{"x":4,"y":13}},{"point":{"x":7,"y":4}},{"point":{"x":7,"y":5}},{"point":{"x":5,"y":10}},{"point":{"x":10,"y":6}},{"point":{"x":10,"y":5}},{"point":{"x":10,"y":13}},{"point":{"x":10,"y":17}},{"point":{"x":10,"y":14}},{"point":{"x":9,"y":25}},{"point":{"x":15,"y":18}},{"point":{"x":4,"y":12}},{"point":{"x":12,"y":12}}]},{"order":18,"type":"dots","strokeColor":"#41364F","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"points":[{"point":{"x":14,"y":2}},{"point":{"x":15,"y":3}},{"point":{"x":15,"y":4}},{"point":{"x":19,"y":12}},{"point":{"x":19,"y":13}},{"point":{"x":19,"y":14}},{"point":{"x":19,"y":15}},{"point":{"x":18,"y":19}},{"point":{"x":18,"y":20}},{"point":{"x":17,"y":21}},{"point":{"x":17,"y":22}},{"point":{"x":16,"y":23}},{"point":{"x":16,"y":24}},{"point":{"x":15,"y":25}},{"point":{"x":14,"y":26}},{"point":{"x":10,"y":28}},{"point":{"x":8,"y":28}},{"point":{"x":7,"y":27}},{"point":{"x":4,"y":26}},{"point":{"x":3,"y":25}},{"point":{"x":2,"y":24}},{"point":{"x":1,"y":12}},{"point":{"x":1,"y":13}},{"point":{"x":1,"y":14}},{"point":{"x":1,"y":15}},{"point":{"x":2,"y":17}},{"point":{"x":1,"y":18}},{"point":{"x":1,"y":19}},{"point":{"x":3,"y":7}},{"point":{"x":2,"y":8}},{"point":{"x":2,"y":10}},{"point":{"x":4,"y":4}},{"point":{"x":4,"y":3}},{"point":{"x":5,"y":2}},{"point":{"x":6,"y":1}},{"point":{"x":7,"y":0}},{"point":{"x":18,"y":11}},{"point":{"x":17,"y":10}},{"point":{"x":17,"y":9}},{"point":{"x":16,"y":8}},{"point":{"x":15,"y":5}},{"point":{"x":12,"y":1}},{"point":{"x":8,"y":0}},{"point":{"x":9,"y":0}},{"point":{"x":3,"y":5}},{"point":{"x":1,"y":20}}]}]}}
    }

    init() {
        this.from = { time: 0, duration: getRandomInt(15,30), change: this.redClamps[1] - this.redClamps[0], type: 'quad', method: 'inOut', startValue: this.redClamps[0] };
        this.to = { time: 0, duration: getRandomInt(15,30), change: -1 *(this.redClamps[1] - this.redClamps[0]), type: 'quad', method: 'inOut', startValue: this.redClamps[1] };
        this.direction = 1;

        this.glowEffectTimer = createTimer(30, () => {
            let props = this.direction > 0 ? this.from : this.to;
            let red = fastRoundWithPrecision(easing.process(props));
            let that = this;
            let baseColor = '#' + rgbToHex(red, that.green, that.blue);
            let imageModel = assignDeep({}, this.imgTemplate);
            imageModel.main.layers[17].strokeColor = baseColor;
            imageModel.main.layers[17].fillColor = baseColor;
            
            this.img= PP.createImage(imageModel)
            // createCanvas(this.size, (ctx, size) => {
            //     ctx.fillStyle = '#' + rgbToHex(that.red, green, that.blue);
            //     ctx.fillRect(0,0, size.x, size.y);
            // })

            props.time++;
            if(props.time > props.duration){
                this.direction*=-1;
                props.time = 0;
                props.duration = getRandomInt(15,30);
            }
        }, this, true);

        this.registerTimer(this.glowEffectTimer);
    }
}