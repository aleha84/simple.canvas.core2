class Demo9BikeScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
        }, options)
        super(options);
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    start(){
        this.roadHeight = this.viewport.y*0.2;

        this.sky = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,(this.viewport.y - this.roadHeight)/2 ),
            size: new V2(this.viewport.x,this.viewport.y - this.roadHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#111F35').rect(0,0,size.x, size.y);

                    hlp.setFillColor('#162945').rect(0,size.y-33, size.x, 2)
                    .rect(0,size.y-36, size.x, 1)
                    .rect(0,size.y-39, size.x, 1)
                    .rect(0,size.y-30, size.x, 30)

                    hlp.setFillColor('#1D3559').rect(0,size.y-15, size.x, 15)
                    .rect(0,size.y-17, size.x, 1)
                    //.rect(size.x/2 - 20, size.y - 19, 40, 1)
                    hlp.setFillColor('#203B64').rect(0,size.y-8, size.x, 8)
                    .rect(0,size.y-10, size.x, 1)
                    //.rect(size.x/3,size.y-12, size.x/3, 1)
                    hlp.setFillColor('#23416E')
                    .rect(0,size.y-2,size.x, 2)
                    .rect(size.x/4,size.y-4,size.x/2, 1);  
                    
                    hlp.setFillColor('#0E1B2D').rect(0,0,size.x, 80).rect(0,83,size.x, 2).rect(0,87,size.x, 1).rect(0,90,size.x, 1)
                    hlp.setFillColor('#0B1523').rect(0,0,size.x, 30).rect(0,33, size.x, 3).rect(0,38, size.x, 2).rect(0,42, size.x, 1)
                })
                //#00003C
                //#E79D56
            }
        }), 1)

        this.bike = this.addGo(new GO({
            position: new V2(70,140),
            size: new V2(1,1),
            init() {

                this.shadow = this.addChild(new GO({
                    position: new V2(-20,43),
                    size: new V2(110, 25),
                    init() {
                        // this.img = createCanvas(this.size, (ctx, size, hlp) => {
                        //     hlp.setFillColor('red').strokeRect(0,0,size.x, size.y)
                        // })
                        this.img =   PP.createImage(
                    {"general":{"originalSize":{"x":110,"y":25},"size":{"x":110,"y":25},"zoom":4,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":108,"y":2}},{"point":{"x":102,"y":2}},{"point":{"x":100,"y":3}},{"point":{"x":92,"y":4}},{"point":{"x":84,"y":7}},{"point":{"x":81,"y":10}},{"point":{"x":72,"y":13}},{"point":{"x":64,"y":18}},{"point":{"x":60,"y":22}},{"point":{"x":51,"y":22}},{"point":{"x":28,"y":24}},{"point":{"x":0,"y":24}},{"point":{"x":0,"y":6}},{"point":{"x":105,"y":0}}]}]}}
                            )                      
                    }
                }))

                this.frontalAdditional= this.addChild(new GO({
                    position: new V2(40,-55),
                    size: new V2(35, 15),
                    init() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            hlp.setFillColor('#0A0214').rect(10, 10, 20, 4).rect(0, 11, 15, 4).rect(20, 10, 13, 3)
                            hlp.setFillColor('#120225').rect(0, 14, 18, 1).rect(18, 13, 14, 1)
                        })
                    }
                }))

                this.frontalWheel = this.addChild(new GO({
                    position: new V2(31,24),
                    size: new V2(14, 20),
                    init() {
                        this.img = PP.createImage(
                 {"general":{"originalSize":{"x":14,"y":20},"size":{"x":14,"y":20},"zoom":10,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#381E2B","fillColor":"#381E2B","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":2}},{"point":{"x":0,"y":9}},{"point":{"x":0,"y":14}},{"point":{"x":1,"y":17}},{"point":{"x":4,"y":18}},{"point":{"x":8,"y":18}},{"point":{"x":10,"y":17}},{"point":{"x":11,"y":16}},{"point":{"x":12,"y":13}},{"point":{"x":12,"y":2}}]},{"order":1,"type":"lines","strokeColor":"#120225","fillColor":"#120225","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":7}},{"point":{"x":0,"y":16}},{"point":{"x":3,"y":18}},{"point":{"x":9,"y":18}},{"point":{"x":11,"y":16}},{"point":{"x":10,"y":17}},{"point":{"x":6,"y":17}},{"point":{"x":3,"y":16}},{"point":{"x":2,"y":15}}]},{"order":2,"type":"lines","strokeColor":"#120225","fillColor":"#120225","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":11,"y":5}},{"point":{"x":11,"y":11}},{"point":{"x":10,"y":13}},{"point":{"x":8,"y":13}},{"point":{"x":7,"y":10}},{"point":{"x":6,"y":6}},{"point":{"x":6,"y":4}},{"point":{"x":10,"y":4}}]},{"order":3,"type":"dots","strokeColor":"#492B2C","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":9,"y":14}},{"point":{"x":10,"y":14}},{"point":{"x":11,"y":13}},{"point":{"x":11,"y":12}},{"point":{"x":8,"y":13}},{"point":{"x":7,"y":12}}]},{"order":4,"type":"lines","strokeColor":"#0A0214","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":0,"y":14}},{"point":{"x":0,"y":16}},{"point":{"x":1,"y":17}},{"point":{"x":3,"y":18}},{"point":{"x":9,"y":18}},{"point":{"x":10,"y":17}},{"point":{"x":11,"y":16}}]}]}}
                            )
                    }
                }))

                this.driverHead  = this.rearWheel = this.addChild(new GO({
                    position: new V2(21,-52),
                    size: new V2(80, 135),
                    init() {
                        this.img = PP.createImage(
                {"general":{"originalSize":{"x":80,"y":135},"size":{"x":80,"y":135},"zoom":2,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#89675B","fillColor":"#89675B","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":18,"y":14}},{"point":{"x":18,"y":8}},{"point":{"x":20,"y":4}},{"point":{"x":25,"y":1}},{"point":{"x":33,"y":1}},{"point":{"x":37,"y":4}},{"point":{"x":39,"y":7}},{"point":{"x":40,"y":13}},{"point":{"x":29,"y":15}}]},{"order":1,"type":"lines","strokeColor":"#402B39","fillColor":"#402B39","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":18,"y":13}},{"point":{"x":18,"y":7}},{"point":{"x":19,"y":5}},{"point":{"x":21,"y":3}},{"point":{"x":23,"y":2}},{"point":{"x":25,"y":1}},{"point":{"x":33,"y":1}},{"point":{"x":28,"y":3}},{"point":{"x":26,"y":5}},{"point":{"x":26,"y":9}},{"point":{"x":28,"y":13}}]},{"order":2,"type":"lines","strokeColor":"#402B39","fillColor":"#402B39","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":40,"y":14}},{"point":{"x":40,"y":11}},{"point":{"x":39,"y":10}},{"point":{"x":39,"y":7}},{"point":{"x":38,"y":9}},{"point":{"x":36,"y":10}},{"point":{"x":34,"y":11}},{"point":{"x":37,"y":14}}]},{"order":3,"type":"lines","strokeColor":"#9A786D","fillColor":"#9A786D","closePath":true,"fill":true,"visible":false,"clear":false,"points":[{"point":{"x":34,"y":9}},{"point":{"x":33,"y":7}},{"point":{"x":31,"y":6}},{"point":{"x":29,"y":7}},{"point":{"x":30,"y":9}},{"point":{"x":31,"y":10}},{"point":{"x":33,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#1E141B","fillColor":"#1E141B","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":18,"y":13}},{"point":{"x":18,"y":6}},{"point":{"x":20,"y":4}},{"point":{"x":21,"y":3}},{"point":{"x":25,"y":1}},{"point":{"x":30,"y":1}}]}]}}
                            )
                    }
                }))




                this.driver  = this.rearWheel = this.addChild(new GO({
                    position: new V2(20,-53),
                    size: new V2(80, 135),
                    init() {
                        this.img = PP.createImage(
                 {"general":{"originalSize":{"x":80,"y":135},"size":{"x":80,"y":135},"zoom":2,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#89675B","fillColor":"#89675B","closePath":true,"fill":true,"visible":false,"clear":false,"points":[{"point":{"x":18,"y":14}},{"point":{"x":18,"y":8}},{"point":{"x":20,"y":4}},{"point":{"x":25,"y":1}},{"point":{"x":33,"y":1}},{"point":{"x":37,"y":4}},{"point":{"x":39,"y":7}},{"point":{"x":40,"y":13}},{"point":{"x":29,"y":15}}]},{"order":1,"type":"lines","strokeColor":"#402B39","fillColor":"#402B39","closePath":true,"fill":true,"visible":false,"clear":false,"points":[{"point":{"x":18,"y":13}},{"point":{"x":18,"y":7}},{"point":{"x":19,"y":5}},{"point":{"x":21,"y":3}},{"point":{"x":23,"y":2}},{"point":{"x":25,"y":1}},{"point":{"x":33,"y":1}},{"point":{"x":28,"y":3}},{"point":{"x":26,"y":5}},{"point":{"x":26,"y":9}},{"point":{"x":28,"y":13}}]},{"order":2,"type":"lines","strokeColor":"#402B39","fillColor":"#402B39","closePath":true,"fill":true,"visible":false,"clear":false,"points":[{"point":{"x":40,"y":14}},{"point":{"x":40,"y":11}},{"point":{"x":39,"y":10}},{"point":{"x":39,"y":7}},{"point":{"x":38,"y":9}},{"point":{"x":36,"y":10}},{"point":{"x":34,"y":11}},{"point":{"x":37,"y":14}}]},{"order":3,"type":"lines","strokeColor":"#9A786D","fillColor":"#9A786D","closePath":true,"fill":true,"visible":false,"clear":false,"points":[{"point":{"x":34,"y":9}},{"point":{"x":33,"y":7}},{"point":{"x":31,"y":6}},{"point":{"x":29,"y":7}},{"point":{"x":30,"y":9}},{"point":{"x":31,"y":10}},{"point":{"x":33,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#1E141B","fillColor":"#1E141B","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":18,"y":13}},{"point":{"x":18,"y":6}},{"point":{"x":20,"y":4}},{"point":{"x":21,"y":3}},{"point":{"x":25,"y":1}},{"point":{"x":30,"y":1}}]},{"order":5,"type":"lines","strokeColor":"#492C34","fillColor":"#492C34","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":41}},{"point":{"x":2,"y":36}},{"point":{"x":3,"y":31}},{"point":{"x":4,"y":25}},{"point":{"x":5,"y":22}},{"point":{"x":9,"y":18}},{"point":{"x":15,"y":14}},{"point":{"x":21,"y":12}},{"point":{"x":25,"y":11}},{"point":{"x":34,"y":11}},{"point":{"x":40,"y":13}},{"point":{"x":46,"y":16}},{"point":{"x":52,"y":22}},{"point":{"x":57,"y":29}},{"point":{"x":59,"y":34}},{"point":{"x":60,"y":36}},{"point":{"x":66,"y":41}},{"point":{"x":69,"y":45}},{"point":{"x":70,"y":59}},{"point":{"x":70,"y":64}},{"point":{"x":72,"y":66}},{"point":{"x":72,"y":72}},{"point":{"x":67,"y":72}},{"point":{"x":63,"y":67}},{"point":{"x":64,"y":66}},{"point":{"x":62,"y":61}},{"point":{"x":62,"y":59}},{"point":{"x":60,"y":55}},{"point":{"x":57,"y":50}},{"point":{"x":53,"y":44}},{"point":{"x":48,"y":39}},{"point":{"x":46,"y":36}},{"point":{"x":45,"y":41}},{"point":{"x":43,"y":45}},{"point":{"x":43,"y":49}},{"point":{"x":44,"y":53}},{"point":{"x":44,"y":59}},{"point":{"x":43,"y":60}},{"point":{"x":43,"y":63}},{"point":{"x":45,"y":65}},{"point":{"x":53,"y":72}},{"point":{"x":57,"y":78}},{"point":{"x":60,"y":83}},{"point":{"x":64,"y":89}},{"point":{"x":65,"y":94}},{"point":{"x":64,"y":102}},{"point":{"x":63,"y":103}},{"point":{"x":50,"y":107}},{"point":{"x":50,"y":94}},{"point":{"x":40,"y":87}},{"point":{"x":4,"y":84}}]},{"order":6,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":42,"y":74}},{"point":{"x":50,"y":79}},{"point":{"x":54,"y":84}},{"point":{"x":57,"y":90}},{"point":{"x":57,"y":95}},{"point":{"x":57,"y":100}},{"point":{"x":57,"y":103}},{"point":{"x":52,"y":107}},{"point":{"x":49,"y":107}},{"point":{"x":50,"y":105}},{"point":{"x":50,"y":94}},{"point":{"x":45,"y":91}},{"point":{"x":41,"y":88}},{"point":{"x":23,"y":86}},{"point":{"x":22,"y":72}}]},{"order":7,"type":"lines","strokeColor":"#352026","fillColor":"#352026","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":65,"y":100}},{"point":{"x":62,"y":105}},{"point":{"x":63,"y":106}},{"point":{"x":63,"y":112}},{"point":{"x":62,"y":114}},{"point":{"x":62,"y":118}},{"point":{"x":63,"y":122}},{"point":{"x":63,"y":124}},{"point":{"x":67,"y":127}},{"point":{"x":68,"y":129}},{"point":{"x":68,"y":131}},{"point":{"x":65,"y":133}},{"point":{"x":59,"y":133}},{"point":{"x":52,"y":131}},{"point":{"x":48,"y":127}},{"point":{"x":44,"y":124}},{"point":{"x":46,"y":119}},{"point":{"x":47,"y":115}},{"point":{"x":48,"y":113}},{"point":{"x":50,"y":107}},{"point":{"x":51,"y":104}},{"point":{"x":55,"y":101}},{"point":{"x":60,"y":100}}]},{"order":8,"type":"lines","strokeColor":"#2B1228","fillColor":"#2B1228","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":58,"y":133}},{"point":{"x":65,"y":133}},{"point":{"x":67,"y":132}},{"point":{"x":68,"y":131}},{"point":{"x":63,"y":128}},{"point":{"x":57,"y":126}},{"point":{"x":54,"y":126}},{"point":{"x":50,"y":122}},{"point":{"x":46,"y":119}},{"point":{"x":44,"y":123}},{"point":{"x":44,"y":124}},{"point":{"x":46,"y":126}},{"point":{"x":48,"y":127}},{"point":{"x":52,"y":131}},{"point":{"x":54,"y":132}},{"point":{"x":57,"y":132}}]},{"order":9,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":2,"y":51}},{"point":{"x":2,"y":34}},{"point":{"x":4,"y":24}},{"point":{"x":7,"y":20}},{"point":{"x":10,"y":17}},{"point":{"x":17,"y":13}},{"point":{"x":25,"y":11}},{"point":{"x":35,"y":11}},{"point":{"x":41,"y":13}},{"point":{"x":45,"y":15}},{"point":{"x":39,"y":13}},{"point":{"x":30,"y":13}},{"point":{"x":21,"y":15}},{"point":{"x":16,"y":23}},{"point":{"x":13,"y":33}},{"point":{"x":10,"y":46}},{"point":{"x":9,"y":59}},{"point":{"x":7,"y":70}},{"point":{"x":3,"y":54}}]},{"order":10,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":46,"y":29}},{"point":{"x":46,"y":38}},{"point":{"x":53,"y":44}},{"point":{"x":54,"y":46}},{"point":{"x":56,"y":49}},{"point":{"x":58,"y":52}},{"point":{"x":59,"y":54}},{"point":{"x":62,"y":58}},{"point":{"x":62,"y":62}},{"point":{"x":64,"y":65}},{"point":{"x":63,"y":67}},{"point":{"x":67,"y":72}},{"point":{"x":72,"y":72}},{"point":{"x":72,"y":66}},{"point":{"x":70,"y":64}},{"point":{"x":70,"y":53}},{"point":{"x":68,"y":50}},{"point":{"x":64,"y":47}},{"point":{"x":59,"y":45}},{"point":{"x":55,"y":43}},{"point":{"x":51,"y":39}},{"point":{"x":49,"y":35}},{"point":{"x":47,"y":32}}]},{"order":11,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":43,"y":60}},{"point":{"x":22,"y":59}}]},{"order":12,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":44,"y":58}},{"point":{"x":44,"y":52}},{"point":{"x":43,"y":51}},{"point":{"x":43,"y":45}},{"point":{"x":45,"y":42}}]},{"order":13,"type":"lines","strokeColor":"#352026","fillColor":"#352026","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":14,"y":36}},{"point":{"x":20,"y":34}},{"point":{"x":27,"y":30}},{"point":{"x":33,"y":27}},{"point":{"x":42,"y":27}}]},{"order":14,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":26,"y":40}},{"point":{"x":32,"y":40}}]},{"order":15,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":35,"y":42}},{"point":{"x":39,"y":45}},{"point":{"x":43,"y":46}}]},{"order":16,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":31,"y":52}},{"point":{"x":41,"y":52}}]},{"order":17,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":36,"y":16}},{"point":{"x":42,"y":18}}]},{"order":18,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":19,"y":58}},{"point":{"x":29,"y":58}}]},{"order":19,"type":"lines","strokeColor":"#352026","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":30,"y":33}},{"point":{"x":36,"y":33}},{"point":{"x":42,"y":36}}]},{"order":20,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":38,"y":53}},{"point":{"x":41,"y":53}},{"point":{"x":42,"y":54}}]},{"order":21,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":43,"y":47}},{"point":{"x":41,"y":46}},{"point":{"x":39,"y":46}},{"point":{"x":38,"y":45}},{"point":{"x":36,"y":44}},{"point":{"x":35,"y":43}},{"point":{"x":32,"y":41}},{"point":{"x":24,"y":41}}]},{"order":22,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":33,"y":28}},{"point":{"x":42,"y":28}},{"point":{"x":44,"y":29}},{"point":{"x":44,"y":30}},{"point":{"x":43,"y":29}},{"point":{"x":36,"y":29}}]},{"order":23,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":13,"y":35}},{"point":{"x":15,"y":35}},{"point":{"x":16,"y":34}},{"point":{"x":18,"y":34}},{"point":{"x":29,"y":28}},{"point":{"x":32,"y":27}},{"point":{"x":30,"y":28}},{"point":{"x":27,"y":29}},{"point":{"x":23,"y":30}},{"point":{"x":18,"y":31}},{"point":{"x":13,"y":31}}]},{"order":24,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":10,"y":50}},{"point":{"x":18,"y":50}},{"point":{"x":24,"y":49}},{"point":{"x":30,"y":47}}]},{"order":25,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":12,"y":41}},{"point":{"x":25,"y":40}},{"point":{"x":14,"y":43}},{"point":{"x":10,"y":47}}]},{"order":26,"type":"lines","strokeColor":"#25102D","fillColor":"#25102D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":14,"y":25}},{"point":{"x":19,"y":21}},{"point":{"x":26,"y":20}},{"point":{"x":33,"y":19}},{"point":{"x":28,"y":18}},{"point":{"x":21,"y":18}},{"point":{"x":17,"y":19}}]},{"order":27,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":34,"y":16}},{"point":{"x":37,"y":17}},{"point":{"x":40,"y":18}},{"point":{"x":43,"y":19}}]},{"order":28,"type":"lines","strokeColor":"#25102D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":69,"y":45}},{"point":{"x":67,"y":42}},{"point":{"x":63,"y":38}},{"point":{"x":62,"y":38}},{"point":{"x":60,"y":36}}]},{"order":29,"type":"lines","strokeColor":"#2B1228","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":48,"y":113}},{"point":{"x":51,"y":115}},{"point":{"x":54,"y":118}},{"point":{"x":58,"y":121}},{"point":{"x":63,"y":124}}]},{"order":30,"type":"lines","strokeColor":"#2B1228","fillColor":"#2B1228","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":62,"y":117}},{"point":{"x":62,"y":114}},{"point":{"x":63,"y":113}},{"point":{"x":63,"y":109}},{"point":{"x":62,"y":111}},{"point":{"x":60,"y":113}},{"point":{"x":58,"y":112}},{"point":{"x":60,"y":115}},{"point":{"x":62,"y":118}}]},{"order":31,"type":"lines","strokeColor":"#2B1228","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":50,"y":106}},{"point":{"x":49,"y":109}},{"point":{"x":48,"y":112}},{"point":{"x":47,"y":114}},{"point":{"x":47,"y":116}},{"point":{"x":46,"y":117}},{"point":{"x":46,"y":119}}]},{"order":32,"type":"lines","strokeColor":"#0A0214","fillColor":"#0A0214","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":64,"y":68}},{"point":{"x":72,"y":68}},{"point":{"x":72,"y":70}},{"point":{"x":66,"y":71}}]}]}}
                            )
                    }
                }))

                this.bikeBody  = this.rearWheel = this.addChild(new GO({
                    position: new V2(-10,-25),
                    size: new V2(100, 130),
                    init() {
                        this.img = PP.createImage(
                 {"general":{"originalSize":{"x":100,"y":130},"size":{"x":100,"y":130},"zoom":3,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#1D0829","fillColor":"#1D0829","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":80,"y":51}},{"point":{"x":86,"y":55}},{"point":{"x":94,"y":62}},{"point":{"x":93,"y":71}},{"point":{"x":92,"y":81}},{"point":{"x":89,"y":92}},{"point":{"x":81,"y":92}}]},{"order":1,"type":"lines","strokeColor":"#130425","fillColor":"#130425","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":30,"y":38}},{"point":{"x":25,"y":49}},{"point":{"x":22,"y":65}},{"point":{"x":19,"y":82}},{"point":{"x":28,"y":92}},{"point":{"x":44,"y":91}},{"point":{"x":43,"y":76}},{"point":{"x":46,"y":53}},{"point":{"x":43,"y":43}}]},{"order":2,"type":"lines","strokeColor":"#1D0829","fillColor":"#1D0829","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":26,"y":3}},{"point":{"x":21,"y":10}},{"point":{"x":23,"y":19}},{"point":{"x":29,"y":48}},{"point":{"x":57,"y":75}},{"point":{"x":87,"y":78}},{"point":{"x":79,"y":56}},{"point":{"x":78,"y":40}},{"point":{"x":78,"y":35}},{"point":{"x":66,"y":25}},{"point":{"x":47,"y":11}},{"point":{"x":33,"y":4}}]},{"order":3,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":3}},{"point":{"x":33,"y":4}},{"point":{"x":49,"y":12}},{"point":{"x":53,"y":15}},{"point":{"x":65,"y":24}},{"point":{"x":70,"y":28}},{"point":{"x":78,"y":35}},{"point":{"x":78,"y":39}},{"point":{"x":70,"y":31}},{"point":{"x":62,"y":24}},{"point":{"x":53,"y":17}},{"point":{"x":44,"y":10}}]},{"order":4,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":44,"y":21}},{"point":{"x":47,"y":21}},{"point":{"x":55,"y":28}},{"point":{"x":60,"y":36}},{"point":{"x":52,"y":28}},{"point":{"x":46,"y":23}}]},{"order":5,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":72,"y":33}},{"point":{"x":67,"y":46}},{"point":{"x":72,"y":56}},{"point":{"x":76,"y":67}},{"point":{"x":83,"y":74}}]},{"order":6,"type":"lines","strokeColor":"#3B202D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":78,"y":40}},{"point":{"x":80,"y":58}},{"point":{"x":83,"y":65}},{"point":{"x":85,"y":72}},{"point":{"x":87,"y":78}}]},{"order":7,"type":"lines","strokeColor":"#130425","fillColor":"#130425","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":72,"y":35}},{"point":{"x":69,"y":44}},{"point":{"x":68,"y":47}},{"point":{"x":74,"y":58}},{"point":{"x":76,"y":64}},{"point":{"x":77,"y":67}},{"point":{"x":84,"y":74}},{"point":{"x":84,"y":72}},{"point":{"x":83,"y":69}},{"point":{"x":82,"y":64}},{"point":{"x":79,"y":59}},{"point":{"x":79,"y":54}},{"point":{"x":78,"y":53}},{"point":{"x":78,"y":45}},{"point":{"x":77,"y":44}},{"point":{"x":77,"y":39}},{"point":{"x":75,"y":37}}]},{"order":8,"type":"lines","strokeColor":"#130425","fillColor":"#130425","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":48,"y":21}},{"point":{"x":57,"y":29}},{"point":{"x":56,"y":24}},{"point":{"x":48,"y":18}},{"point":{"x":45,"y":19}},{"point":{"x":48,"y":20}}]},{"order":9,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":24,"y":22}},{"point":{"x":27,"y":23}},{"point":{"x":29,"y":30}},{"point":{"x":34,"y":37}}]},{"order":10,"type":"lines","strokeColor":"#D93D38","fillColor":"#D93D38","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":27,"y":4}},{"point":{"x":33,"y":7}},{"point":{"x":41,"y":15}},{"point":{"x":34,"y":19}},{"point":{"x":27,"y":19}},{"point":{"x":23,"y":16}},{"point":{"x":22,"y":10}}]},{"order":11,"type":"lines","strokeColor":"#AF2F2D","fillColor":"#AF2F2D","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":41,"y":15}},{"point":{"x":34,"y":19}},{"point":{"x":27,"y":19}}]},{"order":12,"type":"lines","strokeColor":"#AF2F2D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":27,"y":4}},{"point":{"x":24,"y":7}},{"point":{"x":22,"y":10}},{"point":{"x":22,"y":12}}]},{"order":13,"type":"lines","strokeColor":"#AF2F2D","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":39,"y":13}},{"point":{"x":32,"y":6}}]},{"order":14,"type":"lines","strokeColor":"#E05A4D","fillColor":"#E05A4D","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":25,"y":13}},{"point":{"x":28,"y":10}},{"point":{"x":34,"y":13}},{"point":{"x":29,"y":11}},{"point":{"x":27,"y":12}}]},{"order":15,"type":"lines","strokeColor":"#A48976","fillColor":"#A48976","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":72,"y":71}},{"point":{"x":72,"y":79}},{"point":{"x":68,"y":87}},{"point":{"x":67,"y":104}},{"point":{"x":71,"y":122}},{"point":{"x":76,"y":122}},{"point":{"x":82,"y":118}},{"point":{"x":86,"y":118}},{"point":{"x":92,"y":114}},{"point":{"x":99,"y":106}},{"point":{"x":99,"y":98}},{"point":{"x":91,"y":98}},{"point":{"x":91,"y":95}},{"point":{"x":83,"y":89}},{"point":{"x":83,"y":84}},{"point":{"x":86,"y":81}},{"point":{"x":82,"y":72}}]},{"order":16,"type":"lines","strokeColor":"#EBDAC4","fillColor":"#EBDAC4","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":85,"y":93}},{"point":{"x":89,"y":95}},{"point":{"x":89,"y":98}},{"point":{"x":80,"y":107}},{"point":{"x":79,"y":107}},{"point":{"x":79,"y":100}},{"point":{"x":82,"y":93}}]},{"order":17,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":91,"y":99}},{"point":{"x":91,"y":106}},{"point":{"x":82,"y":114}},{"point":{"x":81,"y":113}},{"point":{"x":79,"y":109}},{"point":{"x":81,"y":108}},{"point":{"x":85,"y":104}},{"point":{"x":86,"y":104}},{"point":{"x":90,"y":100}}]},{"order":18,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":88,"y":112}},{"point":{"x":82,"y":118}},{"point":{"x":86,"y":118}},{"point":{"x":88,"y":117}},{"point":{"x":91,"y":115}},{"point":{"x":95,"y":111}},{"point":{"x":97,"y":108}},{"point":{"x":93,"y":112}},{"point":{"x":89,"y":112}}]},{"order":19,"type":"lines","strokeColor":"#130425","fillColor":"#130425","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":81,"y":114}},{"point":{"x":78,"y":109}},{"point":{"x":77,"y":108}},{"point":{"x":77,"y":98}},{"point":{"x":79,"y":93}},{"point":{"x":78,"y":89}},{"point":{"x":78,"y":85}},{"point":{"x":72,"y":71}},{"point":{"x":65,"y":71}},{"point":{"x":60,"y":86}},{"point":{"x":60,"y":106}},{"point":{"x":66,"y":121}},{"point":{"x":72,"y":121}},{"point":{"x":77,"y":118}},{"point":{"x":79,"y":115}}]},{"order":20,"type":"lines","strokeColor":"#130425","fillColor":"#130425","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":86,"y":96}},{"point":{"x":87,"y":97}},{"point":{"x":87,"y":98}},{"point":{"x":86,"y":99}},{"point":{"x":85,"y":99}},{"point":{"x":84,"y":98}},{"point":{"x":84,"y":97}},{"point":{"x":85,"y":96}}]},{"order":21,"type":"lines","strokeColor":"#1D0829","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":91,"y":109}},{"point":{"x":93,"y":109}},{"point":{"x":97,"y":105}},{"point":{"x":96,"y":103}},{"point":{"x":92,"y":103}}]},{"order":22,"type":"lines","strokeColor":"#442226","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":92,"y":98}},{"point":{"x":99,"y":98}},{"point":{"x":99,"y":105}}]},{"order":23,"type":"lines","strokeColor":"#000000","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":80,"y":51}},{"point":{"x":85,"y":54}},{"point":{"x":90,"y":58}},{"point":{"x":94,"y":62}},{"point":{"x":93,"y":76}},{"point":{"x":89,"y":92}}]},{"order":24,"type":"lines","strokeColor":"#A48976","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":83,"y":118}},{"point":{"x":87,"y":118}},{"point":{"x":90,"y":116}},{"point":{"x":96,"y":110}},{"point":{"x":96,"y":109}}]}]}}
                            )
                    }
                }));
                this.rearWheel = this.addChild(new GO({
                    position: new V2(-20,5),
                    size: new V2(60, 95),
                    init() {
                        this.img = PP.createImage(
                            {"general":{"originalSize":{"x":60,"y":95},"size":{"x":60,"y":95},"zoom":3,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#381E2B","fillColor":"#381E2B","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":27,"y":2}},{"point":{"x":21,"y":3}},{"point":{"x":15,"y":8}},{"point":{"x":10,"y":14}},{"point":{"x":7,"y":19}},{"point":{"x":4,"y":27}},{"point":{"x":2,"y":36}},{"point":{"x":2,"y":51}},{"point":{"x":2,"y":62}},{"point":{"x":6,"y":74}},{"point":{"x":12,"y":85}},{"point":{"x":18,"y":92}},{"point":{"x":24,"y":94}},{"point":{"x":33,"y":94}},{"point":{"x":41,"y":91}},{"point":{"x":46,"y":88}},{"point":{"x":53,"y":78}},{"point":{"x":56,"y":68}},{"point":{"x":58,"y":59}},{"point":{"x":57,"y":41}},{"point":{"x":56,"y":26}},{"point":{"x":52,"y":17}},{"point":{"x":47,"y":9}},{"point":{"x":41,"y":4}},{"point":{"x":35,"y":2}}]},{"order":1,"type":"lines","strokeColor":"#120225","fillColor":"#120225","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":12,"y":12}},{"point":{"x":8,"y":17}},{"point":{"x":6,"y":21}},{"point":{"x":4,"y":26}},{"point":{"x":3,"y":30}},{"point":{"x":2,"y":34}},{"point":{"x":2,"y":63}},{"point":{"x":5,"y":72}},{"point":{"x":9,"y":80}},{"point":{"x":14,"y":88}},{"point":{"x":17,"y":92}},{"point":{"x":23,"y":94}},{"point":{"x":34,"y":94}},{"point":{"x":39,"y":92}},{"point":{"x":43,"y":90}},{"point":{"x":37,"y":93}},{"point":{"x":26,"y":93}},{"point":{"x":20,"y":91}},{"point":{"x":16,"y":85}},{"point":{"x":12,"y":78}},{"point":{"x":8,"y":69}},{"point":{"x":6,"y":58}},{"point":{"x":6,"y":45}},{"point":{"x":6,"y":33}},{"point":{"x":7,"y":24}},{"point":{"x":10,"y":18}},{"point":{"x":11,"y":14}}]},{"order":2,"type":"lines","strokeColor":"#A27C65","fillColor":"#A27C65","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":26,"y":20}},{"point":{"x":21,"y":28}},{"point":{"x":18,"y":38}},{"point":{"x":18,"y":51}},{"point":{"x":21,"y":62}},{"point":{"x":22,"y":54}},{"point":{"x":22,"y":42}},{"point":{"x":23,"y":32}},{"point":{"x":25,"y":23}}]},{"order":3,"type":"lines","strokeColor":"#120225","fillColor":"#120225","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":33,"y":21}},{"point":{"x":36,"y":24}},{"point":{"x":38,"y":30}},{"point":{"x":40,"y":42}},{"point":{"x":40,"y":53}},{"point":{"x":39,"y":64}},{"point":{"x":37,"y":70}},{"point":{"x":34,"y":74}},{"point":{"x":34,"y":76}},{"point":{"x":36,"y":79}},{"point":{"x":40,"y":80}},{"point":{"x":43,"y":80}},{"point":{"x":48,"y":76}},{"point":{"x":52,"y":68}},{"point":{"x":54,"y":53}},{"point":{"x":53,"y":30}},{"point":{"x":48,"y":20}},{"point":{"x":44,"y":16}},{"point":{"x":39,"y":16}},{"point":{"x":36,"y":17}},{"point":{"x":34,"y":18}}]},{"order":4,"type":"lines","strokeColor":"#000000","fillColor":"#000000","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":33,"y":22}},{"point":{"x":37,"y":28}},{"point":{"x":38,"y":35}},{"point":{"x":39,"y":40}},{"point":{"x":39,"y":58}},{"point":{"x":38,"y":65}},{"point":{"x":36,"y":70}},{"point":{"x":33,"y":74}},{"point":{"x":31,"y":68}},{"point":{"x":30,"y":60}},{"point":{"x":30,"y":51}},{"point":{"x":30,"y":33}},{"point":{"x":32,"y":26}},{"point":{"x":32,"y":23}}]},{"order":5,"type":"lines","strokeColor":"#492B2C","fillColor":"#492B2C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":32}},{"point":{"x":29,"y":63}},{"point":{"x":30,"y":64}},{"point":{"x":30,"y":69}},{"point":{"x":31,"y":70}},{"point":{"x":32,"y":74}},{"point":{"x":34,"y":79}},{"point":{"x":38,"y":82}},{"point":{"x":44,"y":83}},{"point":{"x":49,"y":80}},{"point":{"x":54,"y":71}},{"point":{"x":56,"y":61}},{"point":{"x":58,"y":60}},{"point":{"x":56,"y":69}},{"point":{"x":54,"y":76}},{"point":{"x":50,"y":82}},{"point":{"x":46,"y":86}},{"point":{"x":42,"y":86}},{"point":{"x":36,"y":83}},{"point":{"x":32,"y":79}},{"point":{"x":29,"y":72}},{"point":{"x":28,"y":59}},{"point":{"x":28,"y":45}}]},{"order":6,"type":"lines","strokeColor":"#492B2C","fillColor":"#492B2C","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":29,"y":31}},{"point":{"x":29,"y":24}},{"point":{"x":31,"y":18}},{"point":{"x":33,"y":14}},{"point":{"x":38,"y":11}},{"point":{"x":41,"y":11}},{"point":{"x":45,"y":13}},{"point":{"x":48,"y":13}},{"point":{"x":52,"y":16}},{"point":{"x":53,"y":19}},{"point":{"x":51,"y":18}},{"point":{"x":48,"y":16}},{"point":{"x":44,"y":14}},{"point":{"x":42,"y":13}},{"point":{"x":36,"y":14}},{"point":{"x":33,"y":15}},{"point":{"x":31,"y":21}}]},{"order":7,"type":"dots","strokeColor":"#120225","fillColor":"#FF0000","closePath":false,"fill":false,"visible":false,"clear":false,"points":[{"point":{"x":48,"y":85}},{"point":{"x":47,"y":86}},{"point":{"x":46,"y":88}},{"point":{"x":46,"y":87}},{"point":{"x":45,"y":88}},{"point":{"x":44,"y":89}},{"point":{"x":43,"y":89}},{"point":{"x":49,"y":84}},{"point":{"x":50,"y":83}},{"point":{"x":51,"y":82}},{"point":{"x":52,"y":81}},{"point":{"x":53,"y":78}},{"point":{"x":54,"y":77}},{"point":{"x":55,"y":75}},{"point":{"x":56,"y":73}},{"point":{"x":56,"y":72}},{"point":{"x":56,"y":71}},{"point":{"x":57,"y":68}},{"point":{"x":57,"y":67}},{"point":{"x":58,"y":65}},{"point":{"x":58,"y":64}},{"point":{"x":58,"y":63}},{"point":{"x":57,"y":69}},{"point":{"x":57,"y":70}},{"point":{"x":56,"y":74}},{"point":{"x":55,"y":76}},{"point":{"x":52,"y":80}},{"point":{"x":53,"y":79}}]},{"order":8,"type":"lines","strokeColor":"#120225","fillColor":"#FF0000","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":42,"y":10}},{"point":{"x":40,"y":10}},{"point":{"x":36,"y":11}},{"point":{"x":34,"y":13}},{"point":{"x":32,"y":15}},{"point":{"x":29,"y":20}},{"point":{"x":28,"y":28}}]},{"order":9,"type":"lines","strokeColor":"#120225","fillColor":"#120225","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":17,"y":87}},{"point":{"x":23,"y":88}},{"point":{"x":28,"y":88}},{"point":{"x":33,"y":88}},{"point":{"x":35,"y":89}},{"point":{"x":37,"y":90}},{"point":{"x":39,"y":90}},{"point":{"x":42,"y":90}},{"point":{"x":38,"y":92}},{"point":{"x":32,"y":93}},{"point":{"x":23,"y":93}},{"point":{"x":18,"y":89}}]},{"order":10,"type":"lines","strokeColor":"#0A0214","fillColor":"#0A0214","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":48,"y":86}},{"point":{"x":47,"y":87}},{"point":{"x":44,"y":90}},{"point":{"x":37,"y":93}},{"point":{"x":35,"y":94}},{"point":{"x":22,"y":94}},{"point":{"x":19,"y":93}},{"point":{"x":15,"y":90}}]},{"order":11,"type":"lines","strokeColor":"#0A0214","fillColor":"#0A0214","closePath":false,"fill":false,"visible":true,"clear":false,"points":[{"point":{"x":42,"y":5}},{"point":{"x":41,"y":4}},{"point":{"x":39,"y":3}},{"point":{"x":37,"y":3}},{"point":{"x":36,"y":2}},{"point":{"x":24,"y":2}},{"point":{"x":23,"y":3}},{"point":{"x":21,"y":3}},{"point":{"x":19,"y":5}},{"point":{"x":18,"y":5}},{"point":{"x":13,"y":10}}]}]}}
                            )

                        this.lines = this.addChild(new GO({
                            position: new V2(),
                            size: this.size.clone(),
                            init() {
                                this.frames = [];
                                let length = 250-125;
                                let startFrom = 125;
                                let fCount = 6;
                                let step = fast.r(length/fCount);
                                for(let i = 0; i < fCount; i++){


                                    this.frames[i] = createCanvas(this.size, (ctx, size, hlp) => {
                                        hlp.setFillColor('#120225').strokeEllipsis(125 + step*i, 125 + step*i + step, 0.1, new V2(size.x/2 + 3, size.y/2 + 1), 0.8*size.x/2, 1.0*size.y/2)
                                        hlp.setFillColor('#120225').strokeEllipsis(125 + step*i - step, 125 + step*i , 0.1, new V2(size.x/2 + 6, size.y/2 + 1), 0.8*size.x/2, 1.0*size.y/2)
                                        hlp.setFillColor('#120225').strokeEllipsis(125 + step*i, 125 + step*i + step, 0.1, new V2(size.x/2 + 9, size.y/2 + 1), 0.8*size.x/2, 1.0*size.y/2)
                                        //hlp.setFillColor('#120225').strokeEllipsis(125 + step*i - step, 125 + step*i , 0.1, new V2(size.x/2 + 12, size.y/2 + 1), 0.8*size.x/2, 1.0*size.y/2)
                                    })
                                }

                                this.img = this.frames[0];
                                //this.createImage();

                                this.cFrame = 0;
                                this.timer = this.regTimerDefault(30, () => {
                                    this.img = this.frames[this.cFrame++]
                                    if(this.cFrame == this.frames.length)
                                        this.cFrame = 0;
                                })
                            },
                        }))
                    }
                }))

                this.rearAddiotional = this.addChild(new GO({
                    position: new V2(-2, -3),
                    size: new V2(35,95),
                    init() {
                        this.img = PP.createImage(
{"general":{"originalSize":{"x":35,"y":95},"size":{"x":35,"y":95},"zoom":3,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#3B202D","fillColor":"#3B202D","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":16,"y":2}},{"point":{"x":10,"y":18}},{"point":{"x":6,"y":32}},{"point":{"x":4,"y":44}},{"point":{"x":3,"y":55}},{"point":{"x":2,"y":69}},{"point":{"x":4,"y":79}},{"point":{"x":8,"y":84}},{"point":{"x":14,"y":85}},{"point":{"x":18,"y":83}},{"point":{"x":25,"y":77}},{"point":{"x":30,"y":72}},{"point":{"x":32,"y":70}},{"point":{"x":33,"y":53}},{"point":{"x":31,"y":36}},{"point":{"x":28,"y":17}},{"point":{"x":25,"y":4}}]},{"order":1,"type":"lines","strokeColor":"#1D0829","fillColor":"#1D0829","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":15,"y":85}},{"point":{"x":8,"y":84}},{"point":{"x":4,"y":79}},{"point":{"x":3,"y":76}},{"point":{"x":2,"y":71}},{"point":{"x":2,"y":63}},{"point":{"x":3,"y":50}},{"point":{"x":5,"y":36}},{"point":{"x":9,"y":20}},{"point":{"x":10,"y":17}},{"point":{"x":10,"y":18}},{"point":{"x":7,"y":32}},{"point":{"x":5,"y":48}},{"point":{"x":4,"y":70}},{"point":{"x":6,"y":80}},{"point":{"x":11,"y":84}}]},{"order":2,"type":"lines","strokeColor":"#331421","fillColor":"#331421","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":24,"y":78}},{"point":{"x":32,"y":70}},{"point":{"x":32,"y":62}},{"point":{"x":33,"y":61}},{"point":{"x":33,"y":50}},{"point":{"x":31,"y":33}},{"point":{"x":26,"y":6}},{"point":{"x":27,"y":15}},{"point":{"x":28,"y":30}},{"point":{"x":30,"y":46}},{"point":{"x":30,"y":58}},{"point":{"x":30,"y":65}},{"point":{"x":27,"y":73}},{"point":{"x":23,"y":78}},{"point":{"x":18,"y":83}}]}]}}
                            )
                    }
                }))

                this.bikeBody.positionToggleDirection = 1;
                this.timer = this.regTimerDefault(250, () => {
                    this.bikeBody.position.y +=this.bikeBody.positionToggleDirection;
                    this.rearAddiotional.position.y +=this.bikeBody.positionToggleDirection;
                    this.driverHead.position.y +=this.bikeBody.positionToggleDirection;
                    this.driver.position.y +=this.bikeBody.positionToggleDirection;
                    this.frontalAdditional.position.y +=this.bikeBody.positionToggleDirection;
                    this.bikeBody.positionToggleDirection*=-1;
                    this.bikeBody.needRecalcRenderProperties = true;
                    this.rearAddiotional.needRecalcRenderProperties = true;
                    this.driver.needRecalcRenderProperties = true;
                    this.driverHead.needRecalcRenderProperties = true;
                    this.frontalAdditional.needRecalcRenderProperties = true;
                })
            }
        }), 30)

        this.road = this.addGo(new GO({
            position: new V2(this.sceneCenter.x,this.viewport.y - (this.roadHeight/2)),
            size: new V2(this.viewport.x,this.roadHeight),
            init() {
                this.img = createCanvas(this.size, (ctx, size, hlp) => {
                    hlp.setFillColor('#2F3A3F').rect(0,0,size.x, size.y);
                    hlp.setFillColor('#283135')//.rect(0,0,size.x, 1)
                    .rect(0,0,size.x/2 - 10, 1).rect(size.x - size.x/2 + 10,0,size.x/2 - 10, 1)
                    .rect(0,1,size.x/4, 1).rect(0,2,size.x/8, 1)
                    .rect(size.x-size.x/4,1,size.x/4, 1).rect(size.x-size.x/8,2,size.x/8, 1)
                    // .rect(size.x/2-100,0,200, size.y-38)
                    // .rect(size.x/2-80,0,160, size.y-37)
                    // .rect(size.x/2-60,size.y-36,120, 1)
                    //hlp.setFillColor('#1F2528').rect(size.x/2-80,0,160, size.y-39)
                    //.rect(size.x/2-50,0,100, size.y-38)
                    //hlp.setFillColor('#171C1E').rect(size.x/2-5,0,10, size.y-39)
                    // hlp.setFillColor('#485359').rect(size.x/2 - 40,0,80, size.y-39);
                    // hlp.setFillColor('#2F3A3F').rect(size.x/2 - 20,0,40, size.y-39)
                    /*
                    hlp.setFillColor('#576166').rect(0,0,size.x, size.y);
                    // hlp.setFillColor('#899299').rect(0,0,size.x, size.y);
                    // hlp.setFillColor('#7E868C').rect(0,0,size.x, size.y-5);
                    // hlp.setFillColor('#676E72').rect(0,0,size.x, size.y-20);
                    // hlp.setFillColor('#576166').rect(0,0,size.x, size.y-28);
                     hlp.setFillColor('#485359').rect(0,0,size.x, size.y-33);
                    hlp.setFillColor('#2F3A3F').rect(0,0,size.x, size.y-38);
                    */
                    hlp.setFillColor('#090909');
                    let pp = new PerfectPixel({ctx});
                    //2D2D2D
                    // pp.lineV2(new V2(this.size.x/2 + 5, 0), new V2(this.size.x, 8)).forEach(p => {
                    //     hlp.rect(p.x, 0, 1, p.y)
                    // })

                    // pp.lineV2(new V2(this.size.x/2 - 5, 0), new V2(0, 8)).forEach(p => {
                    //     hlp.rect(p.x, 0, 1, p.y)
                    // })

                })

                this.addChild(new GO({
                    size: this.size, 
                    position: new V2(),
                    easingType: 'expo',
                    method: 'in',
                    time: 20,
                    init() {
                        this.dividers = [];
                        this.vLines = [];
                        this.dividersCalmdown = 0;
                        this.perspectiveCenter = new V2(this.size.x/2, 0).toInt()
                        this.dividerTargetPosition = new V2(this.size.x/2 - 50, this.size.y).toInt();
                        this.dividerDirection = this.perspectiveCenter.direction(this.dividerTargetPosition);

                        this.dp1 = this.dividerTargetPosition.clone();
                        this.dp2 = this.dividerTargetPosition.add(this.dividerDirection.mul(45)).toInt();
                        this.dp3 = this.dividerTargetPosition.add(new V2(20, 0));
                        this.dp3PerspectiveDirection = this.perspectiveCenter.direction(this.dp3);
                        let dp2BasedLine = { begin: this.dp2, end: this.dp2.add(new V2(this.size.x)) }
                        this.dp4 = raySegmentIntersectionVector2(this.dp3, this.dp3PerspectiveDirection, dp2BasedLine).toInt();

                        this.timer = this.regTimerDefault(30, () => {
                            if(this.dividersCalmdown-- == 0){
                                this.dividersCalmdown = 7;
                                let d = {
                                    alive: true,
                                    position: new V2(),
                                    // width: 20,
                                    // length: 45,
                                    p1: new V2(), p2: new V2(), p3: new V2(), p4: new V2(),
                                    color: '#DDD',
                                    hsv: [0,0,100],
                                    vClamps: [45,80]
                                };

                                d.p1xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp1.x, this.easingType, this.method, () => { d.alive = false; })
                                d.p1yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp1.y, this.easingType, this.method)
                                d.p2xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp2.x, this.easingType, this.method)
                                d.p2yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp2.y, this.easingType, this.method)
                                d.p3xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp3.x, this.easingType, this.method)
                                d.p3yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp3.y, this.easingType, this.method)
                                d.p4xChange = easing.createProps(this.time, this.perspectiveCenter.x, this.dp4.x, this.easingType, this.method)
                                d.p4yChange = easing.createProps(this.time, this.perspectiveCenter.y+1, this.dp4.y, this.easingType, this.method)

                                d.vChange = easing.createProps(this.time, d.vClamps[0], d.vClamps[1], this.easingType, this.method)

                                this.dividers.push(d)
                            }

                            for(let i = 0; i < 2; i++)
                            {let vLine = {
                                alive: true,
                                p1: new V2(),p2: new V2(),
                                //hsv: [348,39,26],
                                hsv: [0,0,50],
                                //sClamps: [0,39],
                                vClamps: [20,5],
                                color:undefined,
                            }

                            let time = this.time;
                            let p1 = new V2(getRandomInt(-this.size.x/2, this.size.x*1.5), this.size.y);
                            let p2 = p1.add(this.perspectiveCenter.direction(p1).mul(getRandomInt(10,40))).toInt();
                            time = fast.r(time + 40*(Math.abs(p1.x-this.perspectiveCenter.x)/this.size.x));
                            vLine.p1xChange = easing.createProps(time, this.perspectiveCenter.x, p1.x, this.easingType, this.method, () => { vLine.alive = false; })
                            vLine.p1yChange = easing.createProps(time, this.perspectiveCenter.y, p1.y, this.easingType, this.method)
                            vLine.p2xChange = easing.createProps(time, this.perspectiveCenter.x, p2.x, this.easingType, this.method)
                            vLine.p2yChange = easing.createProps(time, this.perspectiveCenter.y, p2.y, this.easingType, this.method)
                            //vLine.sChange = easing.createProps(time, vLine.sClamps[0], vLine.sClamps[1], this.easingType, this.method)
                            vLine.vChange = easing.createProps(time, vLine.vClamps[0], vLine.vClamps[1], this.easingType, this.method)

                            this.vLines.push(vLine);}

                            for(let i = 0; i < this.dividers.length; i++){
                                let d = this.dividers[i];
                                easing.commonProcess({context: d, propsName: 'p1xChange', round: true, setter: (v) => d.p1.x = v})
                                easing.commonProcess({context: d, propsName: 'p1yChange', round: true, setter: (v) => d.p1.y = v})
                                easing.commonProcess({context: d, propsName: 'p2xChange', round: true, setter: (v) => d.p2.x = v})
                                easing.commonProcess({context: d, propsName: 'p2yChange', round: true, setter: (v) => d.p2.y = v})
                                easing.commonProcess({context: d, propsName: 'p3xChange', round: true, setter: (v) => d.p3.x = v})
                                easing.commonProcess({context: d, propsName: 'p3yChange', round: true, setter: (v) => d.p3.y = v})
                                easing.commonProcess({context: d, propsName: 'p4xChange', round: true, setter: (v) => d.p4.x = v})
                                easing.commonProcess({context: d, propsName: 'p4yChange', round: true, setter: (v) => d.p4.y = v})

                                easing.commonProcess({context: d, propsName: 'vChange', round: true, setter: (v) => {
                                    v = fast.f(v/2)*2;
                                    d.color = colors.hsvToHex([d.hsv[0],d.hsv[1], v])
                                }})
                            }

                            for(let i = 0; i < this.vLines.length; i++){
                                let v = this.vLines[i];
                                easing.commonProcess({context: v, propsName: 'p1xChange', round: true, setter: (value) => v.p1.x = value})
                                easing.commonProcess({context: v, propsName: 'p1yChange', round: true, setter: (value) => v.p1.y = value})
                                easing.commonProcess({context: v, propsName: 'p2xChange', round: true, setter: (value) => v.p2.x = value})
                                easing.commonProcess({context: v, propsName: 'p2yChange', round: true, setter: (value) => v.p2.y = value})

                                easing.commonProcess({context: v, propsName: 'vChange', round: true, setter: (s) => {
                                    s = fast.f(s/2)*2;
                                    //v.color = colors.hsvToHex([v.hsv[0], s, v.hsv[2]])
                                    v.color = colors.hsvToHex([v.hsv[0], v.hsv[1], s])
                                }})

                                    v.visible = v.p1xChange? v.p1xChange.time > v.p1xChange.duration*2/3: true;
                                    
                            }

                            this.dividers = this.dividers.filter(d => d.alive);
                            this.vLines = this.vLines.filter(d => d.alive);

                            this.createImage();        
                        })
                    },
                    createImage() {
                        this.img = createCanvas(this.size, (ctx, size, hlp) => {
                            let pp = new PerfectPixel({ctx})

                            for(let i = 0; i < this.vLines.length; i++){
                                let v = this.vLines[i];
                                if(!v.visible) continue;

                                hlp.setFillColor(v.color);
                                pp.lineV2(v.p1, v.p2)
                            }

                            for(let i = 0; i < this.dividers.length; i++){
                                let d = this.dividers[i];
                                hlp.setFillColor(d.color);
                                let leftPoints = pp.lineV2(d.p1, d.p2)
                                let rightPoints = pp.lineV2(d.p3, d.p4)

                                let linesByY = [];
                                for(let i = 0; i < Math.max(leftPoints.length, rightPoints.length); i++){
                                    if(leftPoints[i]){
                                        if(!linesByY[leftPoints[i].y]){
                                            linesByY[leftPoints[i].y] = { from: leftPoints[i].x };
                                        }
                                        else {
                                            linesByY[leftPoints[i].y].from = leftPoints[i].x;
                                        }

                                        if(linesByY[leftPoints[i].y].from && linesByY[leftPoints[i].y].to && !linesByY[leftPoints[i].y].drawn){
                                            linesByY[leftPoints[i].y].drawn = true;
                                            hlp.rect(linesByY[leftPoints[i].y].from, leftPoints[i].y, linesByY[leftPoints[i].y].to - linesByY[leftPoints[i].y].from, 1);
                                        }
                                    }
                                    if(rightPoints[i]){
                                        if(!linesByY[rightPoints[i].y]){
                                            linesByY[rightPoints[i].y] = { to: rightPoints[i].x };
                                        }
                                        else {
                                            linesByY[rightPoints[i].y].to = rightPoints[i].x;
                                        }

                                        if(linesByY[rightPoints[i].y].from && linesByY[rightPoints[i].y].to && !linesByY[rightPoints[i].y].drawn){
                                            linesByY[rightPoints[i].y].drawn = true;
                                            hlp.rect(linesByY[rightPoints[i].y].from, rightPoints[i].y, linesByY[rightPoints[i].y].to - linesByY[rightPoints[i].y].from, 1);
                                        }
                                    }
                                }
                                // pp.lineV2(d.position, d.position.add(this.dividerDirection.mul(d.length)).toInt()).forEach(p => {
                                //     hlp.rect(p.x, p.y, d.width, 1);
                                // })
                            }
                        })
                        
                    }
                }))
            }
        }), 1)

        this.perspectiveRightSize = new V2(this.viewport.x/2, this.viewport.y-this.roadHeight).toInt();

        this.perspectiveLeft = this.addGo(new Demo9PerspectiveGO({
            size: this.perspectiveRightSize,
            position: new V2(this.viewport.x/2 - this.perspectiveRightSize.x/2, this.perspectiveRightSize.y/2).toInt(),
            easingType: 'expo',
            method: 'in',
            time: 80,
            frontalTime: 70,
            perspectiveCenter: new V2(this.perspectiveRightSize.x, this.perspectiveRightSize.y),
            staticContent: {
                img: createCanvas(new V2(this.viewport.x/2,20), (ctx, size, hlp) => {
                    hlp.setFillColor('#0E171E')
                    let pp = new PerfectPixel({ctx});
                    let points = pp.lineV2(new V2(0, 0), new V2(size.x,size.y));
                    let sChange = easing.createProps(size.x, 0, 70, 'sin', 'out');
                    let vChange = easing.createProps(size.x, 15, 0, 'sin', 'out');
                    let hsv = [206,50,15];
                    for(let i = 0; i < points.length; i++){
                        sChange.time = points[i].x;
                        hlp.setFillColor(colors.hsvToHex(
                            [hsv[0], 
                            fast.r(easing.process(sChange)/10)*10, 
                            hsv[2]])
                        ).rect(points[i].x, points[i].y, 1, size.y)
                    }
                }),
                position: new V2(0,this.perspectiveRightSize.y-20)
            },
            frontalItemGenerator() {
                let tl = new V2(0, 0);

                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let p1 = new V2(0,this.size.y-20 + 1)
                let fencePart = {
                    type: 'stroke',
                    subType: 'rect',
                    p1: p1,
                    p2: new V2(1, this.size.y),
                    forceWidth: true,
                    color: '#0A1219',
                    visible: false,
                    visibleFrom: this.frontalTime/10
                }

                // let upperFencePart = {
                //     type: 'stroke',
                //     p1: p1.add(new V2(5,-10)),
                //     p2: p1.clone(),
                //     forceWidth: true,
                //     color: '#0A1219',
                //     visible: false,
                //     visibleFrom: this.frontalTime/10
                // }

                item.parts.push(fencePart);
                //item.parts.push(upperFencePart);

                return item;
            },
            itemGenerator() {
                let tl = new V2(-150, 0);
                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };
                
                let p1Y = getRandomInt(-200,100);
                let rWidth = getRandomInt(50, 100);

                let rect = {
                    type: 'rect',
                    tl: new V2(-100,p1Y),
                    size: new V2(rWidth+100,item.size.y + Math.abs(p1Y)),
                    hsv: [208,100,18],
                    sClamps: [80,100],
                    vClamps: [13,19],
                    visible: true,
                }
                

                let length = getRandomInt(30, 90);
                
                let p1 = new V2(rWidth, p1Y);
                let p1perspectiveDirection = tl.add(p1).direction(this.perspectiveCenter);
                let p2 = p1.add(p1perspectiveDirection.mul(length));
                let p3 = new V2(p1.x, item.size.y)
                let p4 = new V2(p2.x, item.size.y)
                let side = {
                    type: 'side',
                    hsv: [207,100,22],
                    sClamps: [80,100],
                    vClamps: [17,23],
                    p1: p1.clone(),
                    p2: p2.clone(),
                    p3: p3.clone(),
                    p4: p4.clone(), 
                    visible: false,
                    visibleFrom: this.time*1/3,
                    update() {
                        side.p1.x = rect.tl.x+rect.size.x-1;
                        side.p3.x = side.p1.x;
                    }
                }
                item.parts.push(side)
                item.parts.push(rect)
                item.parts.push({
                    type: 'stroke',
                    p1: p2,
                    p2: p4,
                    hsv: [207,100,27],
                    sClamps: [80,100],
                    vClamps: [22,28],
                    visible: false,
                    visibleFrom: this.time/2
                })

                let sideLinesHeight = 5;
                let upperShift = 15;
                let linesGap = 10;
                let leftShift = 5;
                let rightShift = 7;
                let count = fast.r((item.size.y-p1.y-upperShift)/(sideLinesHeight+linesGap));
                let halfCount = fast.r(count/2)
                let currentY = p1.y+upperShift;
                let vLine = {begin: p2.add(new V2(-rightShift, -200)), end: p4.add(new V2(-rightShift, 200))};
                for(let i = 0; i < count;i++){
                    let leftPoint = new V2(p1.x+leftShift, currentY);
                    let leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter);

                    let _p1 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));

                    let rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    let distance = leftPoint.distance(rightPoint);

                    let _p2 = leftPoint.add(leftPointPerspectiveDirection.mul((distance)));
                    currentY+=sideLinesHeight;

                    // leftPoint = new V2(p1.x+leftShift, currentY);
                    // leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);
                    // let _p3 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));
                    // rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    // distance = leftPoint.distance(rightPoint);

                    // let _p4 = leftPoint.add(leftPointPerspectiveDirection.mul(distance));

                    currentY+=linesGap;
                    let part = {
                        type: 'stroke',
                        p1: _p1,
                        p2: _p2,
                        //color: '#00182E',
                        hsv: [208,100,18],
                        sClamps: [80,100],
                        vClamps: [13,19],
                        visible: false,
                        visibleFrom: this.time*3/4
                    };

                    
                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(leftPointPerspectiveDirection.mul(getRandomInt(0,distance)));
                        let wp2 = wp1.add(leftPointPerspectiveDirection.mul(2));
                        let window = {
                            type: 'side',
                            p1: wp1.add(new V2(0,1)),
                            p2: wp2.add(new V2(0,1)),
                            p3: wp1.add(new V2(0,10)),
                            p4: wp2.add(new V2(0,10)), 
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }
                    

                    let hPart = {
                        type: 'stroke',
                        subType: 'rect',
                        p1: leftPoint.add(new V2(-rect.size.x, 0)),
                        p2: leftPoint.add(new V2(-2*rightShift - leftShift, 0)),
                        //color: 'red',
                        hsv: [207,100,22],
                        sClamps: [80,100],
                        vClamps: [17,23],
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*3/4
                    }

                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(new V2(-2*rightShift - leftShift, 0)).add(new V2(-getRandomInt(15, 60), 1))
                        let wp2 = wp1.add(new V2(10,10))
                        let window = {
                            type: 'stroke',
                            subType: 'rect',
                            p1: wp1,
                            p2: wp2,
                            forceHeight: true,
                            forceWidth: true,
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }

                    if(i %3 == 0){
                        part.visible = true;
                        part.visibleFrom = undefined;

                        hPart.visible = true;
                        hPart.visibleFrom = undefined;
                    }

                    item.parts.push(part);
                    item.parts.push(hPart);

                    item.parts.push({
                        type: 'stroke',
                        subType: 'rect',
                        p1: p1.clone(),
                        p2: p1.add(new V2(1,1)),
                        //color: 'red',
                        hsv: [358,100,76],
                        sClamps: [40,100],
                        vClamps: [40,100],
                        forceWidth: true,
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*2.5/4
                    })
                }

                return item;
            }
        }), 20)

        this.perspectiveRight = this.addGo(new Demo9PerspectiveGO({
            size: this.perspectiveRightSize,
            position: new V2(this.viewport.x - this.perspectiveRightSize.x/2, this.perspectiveRightSize.y/2).toInt(),
            easingType: 'expo',
            method: 'in',
            time: 80,
            frontalTime: 70,
            perspectiveCenter: new V2(0, this.perspectiveRightSize.y),
            staticContent: {
                img: createCanvas(new V2(this.viewport.x/2,20), (ctx, size, hlp) => {
                    hlp.setFillColor('#0E171E')
                    let pp = new PerfectPixel({ctx});
                    let points = pp.lineV2(new V2(0,size.y), new V2(size.x, 0));
                    let sChange = easing.createProps(size.x, 70, 0, 'sin', 'out');
                    let hsv = [206,50,15];
                    for(let i = 0; i < points.length; i++){
                        sChange.time = points[i].x;
                        let s = easing.process(sChange);
                        s = fast.c(s/10)*10;
                        hlp.setFillColor(colors.hsvToHex([hsv[0], s, hsv[2]])).rect(points[i].x, points[i].y, 1, size.y)
                    }
                }),
                position: new V2(0,this.perspectiveRightSize.y-20)
            },
            frontalItemGenerator() {
                let tl = new V2(this.size.x, 0);

                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let fencePart = {
                    type: 'stroke',
                    subType: 'rect',
                    p1: new V2(0,this.size.y-20 + 1),
                    p2: new V2(1, this.size.y),
                    forceWidth: true,
                    color: '#0A1219',
                    visible: false,
                    visibleFrom: this.frontalTime/10
                }

                item.parts.push(fencePart);

                return item;
            },
            itemGenerator() {
                let tl = new V2(this.size.x, 0);
                let item =  {
                    alive: true,
                    size: new V2(100, 200),
                    tl,
                    parts: []
                };

                let p1Y = getRandomInt(0,100);
                let length = getRandomInt(30, 90);
                
                let p1 = new V2(getRandomInt(0,50), p1Y);
                let p1perspectiveDirection = tl.add(p1).direction(this.perspectiveCenter);
                
                let p2 = p1.add(p1perspectiveDirection.mul(-length));
                let p3 = new V2(p1.x, item.size.y)
                let p4 = new V2(p2.x, item.size.y)
                item.parts.push({
                    type: 'side',
                    //defaultColor: '#001F3A',
                    p1,
                    p2,
                    p3,
                    p4, 
                    visible: true,
                    hsv: [207,100,22],
                    sClamps: [80,100],
                    vClamps: [17,23],
                })

                item.parts.push({
                    type: 'rect',
                    tl: p2,
                    size: new V2(getRandomInt(200,300),item.size.y-p2.y),
                    //defaultColor: '#00182E',
                    visible: true,
                    hsv: [208,100,18],
                    sClamps: [80,100],
                    vClamps: [13,19],
                })


                item.parts.push({
                    type: 'stroke',
                    p1,
                    p2: p3,
                    //color: '#002747',
                    hsv: [207,100,27],
                    sClamps: [80,100],
                    vClamps: [22,28],
                    visible: false,
                    visibleFrom: this.time/2
                })

                let sideLinesHeight = 5;
                let upperShift = 5;
                let linesGap = 10;
                let leftShift = 5;
                let rightShift = 7;
                let count = fast.r((item.size.y-p1.y-upperShift)/(sideLinesHeight+linesGap));
                let halfCount = fast.r(count/2)
                let currentY = p1.y+upperShift;
                let vLine = {begin: p2.add(new V2(-rightShift, 0)), end: p4.add(new V2(-rightShift, 200))};
                for(let i = 0; i < count;i++){
                    let leftPoint = new V2(p1.x+leftShift, currentY);
                    let leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);

                    let _p1 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));

                    let rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    let distance = leftPoint.distance(rightPoint);

                    let _p2 = leftPoint.add(leftPointPerspectiveDirection.mul((distance)));
                    currentY+=sideLinesHeight;

                    // leftPoint = new V2(p1.x+leftShift, currentY);
                    // leftPointPerspectiveDirection  = tl.add(leftPoint).direction(this.perspectiveCenter).mul(-1);
                    // let _p3 = leftPoint;//.add(leftPointPerspectiveDirection.mul(leftShift));
                    // rightPoint = raySegmentIntersectionVector2(leftPoint, leftPointPerspectiveDirection, vLine);
                    // distance = leftPoint.distance(rightPoint);

                    // let _p4 = leftPoint.add(leftPointPerspectiveDirection.mul(distance));

                    currentY+=linesGap;
                    let part = {
                        type: 'stroke',
                        p1: _p1,
                        p2: _p2,
                        //color: '#00182E',
                        hsv: [208,100,18],
                        sClamps: [80,100],
                        vClamps: [13,19],
                        visible: false,
                        visibleFrom: this.time*3/4
                    };

                    
                    if(getRandomInt(0,5) == 0){
                        let wp1 = leftPoint.add(leftPointPerspectiveDirection.mul(getRandomInt(0,distance)));
                        let wp2 = wp1.add(leftPointPerspectiveDirection.mul(2));
                        let window = {
                            type: 'side',
                            p1: wp1.add(new V2(0,1)),
                            p2: wp2.add(new V2(0,1)),
                            p3: wp1.add(new V2(0,10)),
                            p4: wp2.add(new V2(0,10)), 
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }
                    

                    let hPart = {
                        type: 'stroke',
                        subType: 'rect',
                        p1: rightPoint.add(new V2(leftShift+rightShift, 0)),
                        p2: rightPoint.add(new V2(200, 0)),
                        //color: '#001F3A',
                        hsv: [207,100,22],
                        sClamps: [80,100],
                        vClamps: [17,23],
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*3/4
                    }

                    if(getRandomInt(0,5) == 0){
                        let wp1 = rightPoint.add(new V2(getRandomInt(15, 60), 1))
                        let wp2 = wp1.add(new V2(10,10))
                        let window = {
                            type: 'stroke',
                            subType: 'rect',
                            p1: wp1,
                            p2: wp2,
                            forceHeight: true,
                            forceWidth: true,
                            hsv: [47,80,80],
                            sClamps: [40,60],
                            vClamps: [40,70],
                            visible: false,
                            visibleFrom: this.time*2.5/4
                        }

                        item.parts.push(window)    
                    }

                    if(i %2 != 0){
                        part.visible = true;
                        part.visibleFrom = undefined;

                        hPart.visible = true;
                        hPart.visibleFrom = undefined;
                    }

                    item.parts.push(part);
                    item.parts.push(hPart);

                    item.parts.push({
                        type: 'stroke',
                        subType: 'rect',
                        p1: p1.clone(),
                        p2: p1.add(new V2(1,1)),
                        //color: 'red',
                        hsv: [358,100,76],
                        sClamps: [40,100],
                        vClamps: [40,100],
                        forceWidth: true,
                        forceHeight: true,
                        visible: false,
                        visibleFrom: this.time*2.5/4
                    })
                }

                return item;
            }
        }), 20)

    }
}

class Demo9PerspectiveGO extends GO {
    constructor(options = {}) {
        options = assignDeep({}, {
            itemsGenTime: 200,
            frontalItemsGenTime: 200
        }, options)

        super(options);
    }

    init() {
        this.items = []
        this.frontalItems = [];

        this.regTimerDefault(30, () => {
            for(let i = 0; i < this.items.length;i++){
                this.processItem(this.items[i]);
            }

            this.items = this.items.filter(item => item.alive);

            for(let i = 0; i < this.frontalItems.length;i++){
                this.processItem(this.frontalItems[i]);
            }

            this.frontalItems = this.frontalItems.filter(item => item.alive);

            this.createImage();
        })

        this.regTimerDefault(this.itemsGenTime, () => {
            this.items.unshift(this.createItem());
        })

        this.regTimerDefault(this.frontalItemsGenTime, () => {
            let item = this.createFrontalItem();
            if(item)
                this.frontalItems.unshift(item);
        })
    }
    createFrontalItem() {
        if(!this.frontalItemGenerator)
            return undefined;

        let item = this.frontalItemGenerator();

        return this.addChanges(item, this.frontalTime);
    }
    createItem() {
        let item = this.itemGenerator();

        return this.addChanges(item, this.time)
    }
    addChanges(item, time) {
        item.xChange = easing.createProps(time, this.perspectiveCenter.x, item.tl.x, this.easingType, this.method, () => {
            item.alive = false;
        });

        item.yChange = easing.createProps(time, this.perspectiveCenter.y, item.tl.y, this.easingType, this.method);

        for(let i = 0; i < item.parts.length; i++){
            let part = item.parts[i];
            if(part.type == 'rect'){
                part.tlXChange = easing.createProps(time, 0, part.tl.x, this.easingType, this.method);
                part.tlYChange = easing.createProps(time, 0, part.tl.y, this.easingType, this.method);
                part.sizeXChange = easing.createProps(time, 0, part.size.x, this.easingType, this.method);
                part.sizeYChange = easing.createProps(time, 0, part.size.y, this.easingType, this.method);
            }
            if(part.type == 'ppPerspective'){
                part.lengthChange = easing.createProps(time, 0, part.length, this.easingType, this.method);
            }

            if(part.type == 'side'){
                part.p1XChange = easing.createProps(time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(time, 0, part.p2.y, this.easingType, this.method);
                part.p3XChange = easing.createProps(time, 0, part.p3.x, this.easingType, this.method);
                part.p3YChange = easing.createProps(time, 0, part.p3.y, this.easingType, this.method);
                part.p4XChange = easing.createProps(time, 0, part.p4.x, this.easingType, this.method);
                part.p4YChange = easing.createProps(time, 0, part.p4.y, this.easingType, this.method);
            }

            if(part.type == 'stroke'){
                part.p1XChange = easing.createProps(time, 0, part.p1.x, this.easingType, this.method);
                part.p1YChange = easing.createProps(time, 0, part.p1.y, this.easingType, this.method);
                part.p2XChange = easing.createProps(time, 0, part.p2.x, this.easingType, this.method);
                part.p2YChange = easing.createProps(time, 0, part.p2.y, this.easingType, this.method);
            }

            if(part.sClamps){
                part.sChange = easing.createProps(time, part.sClamps[0], part.sClamps[1], this.easingType, this.method);
            }

            if(part.vClamps){
                part.vChange = easing.createProps(time, part.vClamps[0], part.vClamps[1], this.easingType, this.method);
            }
        }

        return item;
    }
    processItem(item) {
        easing.commonProcess({ context: item, setter: (value) => { item.tl.x = value }, propsName: 'xChange', round: false })
        easing.commonProcess({ context: item, setter: (value) => { item.tl.y = value }, propsName: 'yChange', round: false })

        //item.tl.x = fast.r(fast.f(item.tl.x/0.5)*0.5)

        for(let i = 0; i < item.parts.length; i++){
            let part = item.parts[i];

            easing.commonProcess({ context: part, targetpropertyName: 's', propsName: 'sChange', round: true })
            easing.commonProcess({ context: part, targetpropertyName: 'v', propsName: 'vChange', round: true })

            if(part.type == 'rect'){
                easing.commonProcess({ context: part, setter: (value) => { part.tl.x = value }, propsName: 'tlXChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.tl.y = value }, propsName: 'tlYChange', round: false })

                easing.commonProcess({ context: part, setter: (value) => { part.size.x = value }, propsName: 'sizeXChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.size.y = value }, propsName: 'sizeYChange', round: false })

                // part.size.x = fast.r(part.size.x/2)*2
                // part.size.y = fast.r(part.size.y/2)*2
            }
            if(part.type == 'ppPerspective'){
                easing.commonProcess({ context: part, targetpropertyName: 'length', propsName: 'lengthChange', round: false })
            }

            if(part.type == 'side'){
                easing.commonProcess({ context: part, setter: (value) => { part.p1.x = value }, propsName: 'p1XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p1.y = value }, propsName: 'p1YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.x = value }, propsName: 'p2XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.y = value }, propsName: 'p2YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p3.x = value }, propsName: 'p3XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p3.y = value }, propsName: 'p3YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p4.x = value }, propsName: 'p4XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p4.y = value }, propsName: 'p4YChange', round: false })
            }

            if(part.type == 'stroke'){
                easing.commonProcess({ context: part, setter: (value) => { part.p1.x = value }, propsName: 'p1XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p1.y = value }, propsName: 'p1YChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.x = value }, propsName: 'p2XChange', round: false })
                easing.commonProcess({ context: part, setter: (value) => { part.p2.y = value }, propsName: 'p2YChange', round: false })
            }

            //part.visible = true;
            if(part.visibleFrom && item.xChange){
                part.visible = item.xChange.time >= part.visibleFrom;
            }

            if(part.colorToTime){
                let color = undefined;
                if(item.xChange){
                    for(let j = 0;j< part.colorToTime.length;j++){
                        if(item.xChange.time < part.colorToTime[j].before){
                            color = part.colorToTime[j].color;
                            break;
                        }
                    }
                }
                
                if(color == undefined){
                    color = part.defaultColor;
                }

                part.color = color;
            }

            if(part.update){
                part.update();
            }
        }
    }
    renderItem(hlp, pp, item){
        let tl = item.tl;

        for(let j = 0; j < item.parts.length; j++){
            let part = item.parts[j];

            if(!part.visible)
                continue;

            if(part.hsv){
                let hsv = [...part.hsv];
                if(part.s){
                    hsv[1] = part.s
                };

                if(part.v){
                    hsv[2] = part.v
                };
                part.color = colors.hsvToHex(hsv);
            }

            hlp.setFillColor(part.color)
            if(part.type == 'rect'){
                if(part.size.x >= 1 && part.size.y >=1){
                    let partTl = tl.add(part.tl).toInt();

                    hlp.rect(partTl.x, partTl.y, fast.f(part.size.x), fast.f(part.size.y));
                    //hlp.setFillColor(part.color).rect(partTl.x, partTl.y, (part.size.x), (part.size.y));
                }
            }

            if(part.type == 'ppPerspective' && part.length > 1){
                let lineFrom = tl.add(part.startP).toInt();
                let direction = lineFrom.direction(this.perspectiveCenter);
                let lineTo = lineFrom.add(direction.mul(part.length));
                let points = pp.lineV2(lineFrom, lineTo);
                for(let i = 0; i < points.length; i++){
                    hlp.rect(points[i].x, points[i].y, 1, part.height)
                }
            }

            if(part.type == 'side'){
                let pointsUpper = pp.lineV2(tl.add(part.p1), tl.add(part.p2));
                let pointsLower = pp.lineV2(tl.add(part.p3), tl.add(part.p4));

                let pointsYMap = [];
                for(let x = 0; x < pointsUpper.length; x++){
                    pointsYMap.push({ x: pointsUpper[x].x,  from: pointsUpper[x].y})
                }

                let pointsLowerYMap = [];
                for(let x = 0; x < pointsLower.length; x++){
                    pointsLowerYMap[pointsLower[x].x] = pointsLower[x].y
                }

                for(let x = 0; x < pointsYMap.length; x++){
                    if(pointsLowerYMap[pointsYMap[x].x] == undefined)
                        continue;

                    pointsYMap[x].to = pointsLowerYMap[pointsYMap[x].x];
                }

                for(let pi = 0; pi < pointsYMap.length; pi++){
                    let py = pointsYMap[pi];
                    hlp.rect(py.x, py.from, 1, py.to - py.from);
                }
            }

            if(part.type == 'stroke'){
                if(part.subType == 'rect'){
                    let width = fast.r(part.p2.x - part.p1.x);
                    let height = fast.r(part.p2.y - part.p1.y);
                    let _tl = tl.add(part.p1).toInt();
                    if(height == 0 && part.forceHeight)
                        height = 1;

                    if(width == 0 && part.forceWidth){
                        width = 1;
                    }

                    hlp.rect(_tl.x, _tl.y, width, height)
                }
                else 
                    pp.lineV2(tl.add(part.p1), tl.add(part.p2))
            }
        }
    }
    createImage() {
        this.img = createCanvas(this.size, (ctx, size, hlp) => {
            //hlp.setFillColor('grey').strokeRect(0,0,size.x, size.y);

            let pp = new PerfectPixel({context: ctx})

            for(let i = 0; i < this.items.length;i++){
                let item = this.items[i];

                this.renderItem(hlp, pp, item);
            }

            if(this.staticContent){
                ctx.drawImage(this.staticContent.img, this.staticContent.position.x, this.staticContent.position.y)
            }

            for(let i = 0; i < this.frontalItems.length;i++){
                let item = this.frontalItems[i];

                this.renderItem(hlp, pp, item);
            }

        })
    }
}