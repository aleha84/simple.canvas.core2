class Items2Scene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options);

        super(options);
    }
}

class CurvedObject extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            isCustomRender: true,
            start: new V2(),
            strokeStyle: 'red',
            fillStyle: 'green'
        }, options);

        super(options);

        this.curves = [
            new BezierCurve({

            })
        ];
    }

    customRender(){
        let ctx = this.context;

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        for(let c of this.curves){
            c.render(ctx);
        }
    }
}

class BezierCurve {
    constructor(options = {}){
        options = assignDeep({}, {
            cp1: new V2(),
            cp2: new V2(),
            end: new V2()
        }, options);

        super(options);
    }

    update(now) {

    }

    render(ctx){
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.x);
    }
}