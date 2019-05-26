class ChildrenBugFix extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {

        }, options);

        super(options);
    }

    start() {
        this.itrem1 = this.addGo(new MovingGO({
            position: this.sceneCenter.clone(),
            size: new V2(40, 40),
            renderValuesRound: true,
            img: PP.createImage({"general":{"originalSize":{"x":40,"y":40},"size":{"x":40,"y":40},"zoom":5,"showGrid":false},"main":{"layers":[{"order":0,"type":"lines","strokeColor":"#ffffff","fillColor":"#ffffff","closePath":true,"fill":true,"visible":true,"points":[{"point":{"x":0,"y":0}},{"point":{"x":39,"y":0}},{"point":{"x":39,"y":39}},{"point":{"x":0,"y":39}}]},{"order":1,"type":"lines","strokeColor":"#FF0000","fillColor":"#FF0000","closePath":true,"fill":false,"visible":true,"points":[{"point":{"x":19,"y":0}},{"point":{"x":39,"y":21}},{"point":{"x":19,"y":39}},{"point":{"x":0,"y":20}}]}]}}),
            //createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'white'; ctx.fillRect(0,0,1,1)}),
            init() {
                this.ch1 = this.addChild(new GO({
                    renderValuesRound: true,
                    size: new V2(10,10),
                    position: new V2(this.size.x/2 - 5, 0),
                    img: createCanvas(new V2(1,1), (ctx) => { ctx.fillStyle = 'green'; ctx.fillRect(0,0,1,1)}),
                    internalRender() {
                        //console.log(this.renderSize)
                    }
                }))

                this.speed = 0.05;
                this.setDestination(new V2(this.position.x + 100, this.position.y))
            }
        }))
    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}