class RotationScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: false,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: []
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }

    getModel() {
        return {"general":{"originalSize":{"x":40,"y":40},"size":{"x":40,"y":40},"zoom":6,"showGrid":true},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#FF0000","fillColor":"#00ff00","closePath":true,"fill":true,"visible":true,"clear":false,"points":[{"point":{"x":19,"y":13}},{"point":{"x":28,"y":28}},{"point":{"x":11,"y":28}}]}]}}
    }

    start(){
        this.demo = this.addGo(new GO({
            position: this.sceneCenter.clone(),
            size: new V2(40, 40),//.mul(2),
            originModelProvider : this.getModel.bind(this),
            angle: 0,
            angleStep: 3,
            rotationOrigin: new V2(20,20),
            imgSize: new V2(40, 40),
            init() {
                //this.rotationOrigin = this.imgSize.mul(0.5).toInt();
                // this.model = this.originModelProvider();
                // this.getImg();
                //this.rotation()    
                this.timer = this.regTimerDefault(30, () => {
                    this.rotation();
                    this.angle+=this.angleStep;

                    if(this.angle > 360){
                        this.angle-=360;
                    }
                })
            },
            rotation() {
                this.model = this.originModelProvider();
                this.model.main.layers.forEach(l => {
                    l.points.forEach(p => {
                        let v2 = new V2(p.point);
                        v2.substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.rotationOrigin, true).toInt(true);
                        p.point.x = v2.x;
                        p.point.y = v2.y;
                    })
                })

                this.getImg();
            },
            getImg() {
                this.img = PP.createImage(this.model);
            }
        }))
    }
}