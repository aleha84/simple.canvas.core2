class MapScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
            },
        }, options)

        super(options);
    }

    start() {
        let rawArr = [];
        //mapCoordinates.usa.features.map(f => f.geometry.coordinates[0]) 
        //[mapCoordinates.usa.features[0].geometry.coordinates[0], mapCoordinates.usa.features[1].geometry.coordinates[0]];
        mapCoordinates.usa.states.state.forEach(s => {
            // let _c = f.geometry.coordinates//.map(c => ({c, length: c.length}));
            // let maxLength = Math.max.apply(null, _c.map(c => c.length));
            // _c = _c.filter(c => c.length == maxLength)[0];
            // let d = distinct(_c, (p) => ( fastRoundWithPrecision(p[0], 2) + '_' + fastRoundWithPrecision(p[0], 2)));
            // rawArr[rawArr.length] = d;
            if(s['-name'] == 'Alaska' || s['-name'] == 'Hawaii' )
                return;

            rawArr[rawArr.length] = s.point.map(p => ([parseFloat(p['-lng']), parseFloat(p['-lat'])]));
        });

        debugger;
        //return;

        let raw = [];
        for(let i = 0; i < rawArr.length; i++){
            raw = [...raw, ...rawArr[i]];
        }
        //let raw = mapCoordinates.usa.features[0].geometry.coordinates[0];
        let v2Raw = raw.map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1]))));
        let allX = v2Raw.map(c => c.x);
        let allY = v2Raw.map(c => c.y);
        let minX = Math.min.apply(null, allX);
        let maxX = Math.max.apply(null, allX)+1;
        let minY = Math.min.apply(null, allY);
        let maxY = Math.max.apply(null, allY)+1;

        let size = new V2((maxX - minX),(maxY - minY));
        let scale =size.x > size.y
            ? this.viewport.x/size.x
            : this.viewport.y/size.y;

        this.shiftRel = new V2(minX, minY);
        for(let i = 0; i < rawArr.length; i++){
            //let scaledCoordinates = v2Raw.map(c => c.substract(this.shiftRel).mul(scale))

            this.testFillColorHSV = [0, 100, 70];
            this.testPoligon = this.addGo(new Poligon({
                coordinates: rawArr[i].map(c => new V2(((this.viewport.x/360.0) * (180 + c[0])), ((this.viewport.y/180.0) * (90 - c[1])))).map(c => c.substract(this.shiftRel).mul(scale)),
                baseColor: hsvToHex({hsv:this.testFillColorHSV})
            }))
        }
        // let scaledCoordinates = v2Raw.map(c => c.substract(this.shiftRel).mul(scale))

        // this.testFillColorHSV = [0, 100, 70];
        // this.testPoligon = this.addGo(new Poligon({
        //     coordinates: scaledCoordinates,
        //     //[new V2(200, 100), new V2(250, 75), new V2(300, 100),new V2(275, 150), new V2(300, 200), new V2(200, 200)],
        //     baseColor: hsvToHex({hsv:this.testFillColorHSV})
        // }))

        //this.testColorChange = {time: 0, duration: 20,startValue: this.testFillColorHSV[2], change: -20, max: 20, direction: -1, type: 'quad', method: 'inOut'}
        // this.colorChangeTimer = this.registerTimer(createTimer(50, () => {
        //     let l = this.testColorChange;
        //     if(l.time > l.duration){
        //         l.direction*=-1;
        //         l.time = 0;
        //         l.startValue = this.testFillColorHSV[2];

        //         if(l.direction < 0){
        //             l.change = -l.max*2;
        //         }
        //         else if(l.direction > 0){
        //             l.change = l.max*2;
        //         }
        //     }

        //     this.testFillColorHSV[2] = fastRoundWithPrecision(easing.process(l));
        //     //console.log(this.testFillColorHSV[2]);
        //     this.testPoligon.createImg({baseColor: hsvToHex({hsv:this.testFillColorHSV})})
        //     l.time++;

        // }, this, true));
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}

class Poligon extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            renderValuesRound: true,
            name: '',
            coordinates: [],
            baseColor: 'red',
            borderColor: 'green',
            size: new V2(1,1),
            position: new V2(),
            template: {"general":{"originalSize":{"x":20,"y":20},"size":{"x":20,"y":20},"zoom":1,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":true,"visible":true,"points":[]}]}}
        }, options)

        super(options);
    }

    init() {
        let allX = this.coordinates.map(c => c.x);
        let allY = this.coordinates.map(c => c.y);
        let minX = Math.min.apply(null, allX);
        let maxX = Math.max.apply(null, allX)+1;
        let minY = Math.min.apply(null, allY);
        let maxY = Math.max.apply(null, allY)+1;
        this.size = new V2(fastRoundWithPrecision(maxX - minX),fastRoundWithPrecision(maxY - minY));
        this.position = new V2(minX + this.size.x/2, minY + this.size.y/2);

        this.shiftRel = new V2(minX, minY);
        this.coordinatesRel = this.coordinates.map(c => c.substract(this.shiftRel))

        this.model = assignDeep({}, this.template);
        this.model.general.originalSize = this.size;
        this.model.general.size = this.size;
        this.model.main.layers[0].points = this.coordinatesRel.map(p => ({ point: p }));
        this.createImg({});
    }

    createImg({baseColor = undefined, borderColor = undefined}) {
        if(borderColor)
            this.borderColor = borderColor;

        this.model.main.layers[0].strokeColor = this.borderColor;

        if(baseColor)
            this.baseColor = baseColor;

        this.model.main.layers[0].fillColor = this.baseColor;

        this.img = PP.createImage(this.model);
    }
}