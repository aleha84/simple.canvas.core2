class Items2Scene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {

        }, options);

        super(options);

        let size = new V2(33.3,100);
        this.addGo(new CurvedObject({
            size: size.clone(),
            position: this.sceneCenter.add(new V2(-size.x/2, 0)),
            destinationRadius: 5,
            fillStyle: undefined,
            closePath: false,
            lineWidth: 2,
            segments: {
                h:0, v: 3
            },
            start: new V2(0, -size.y/2)
        }));

        this.addGo(new CurvedObject({
            size: size.clone(),
            position: this.sceneCenter.add(new V2(size.x/2, 0)),
            destinationRadius: 5,
            fillStyle: undefined,
            closePath: false,
            lineWidth: 2,
            segments: {
                h:0, v: 3
            },
            start: new V2(0, -size.y/2)
        }));

        size = new V2(100,33.3);
        this.addGo(new CurvedObject({
            size: size.clone(),
            position: this.sceneCenter.add(new V2(0, -size.y/2)),
            destinationRadius: 5,
            fillStyle: undefined,
            closePath: false,
            lineWidth: 2,
            segments: {
                h:3, v: 0
            },
            start: new V2(-size.x/2, 0)
        }));

        this.addGo(new CurvedObject({
            size: size.clone(),
            position: this.sceneCenter.add(new V2(0, size.y/2)),
            destinationRadius: 5,
            fillStyle: undefined,
            closePath: false,
            lineWidth: 2,
            segments: {
                h:3, v: 0
            },
            start: new V2(-size.x/2, 0)
        }));

        this.addGo(new CurvedObject({
            size: new V2(100,100),
            position: this.sceneCenter,
            destinationRadius: 5
        }));

        
    }

    backgroundRender(){
        SCG.contexts.background.fillStyle = 'black';
        SCG.contexts.background.fillRect(0,0,SCG.viewport.real.width,SCG.viewport.real.height);
    }
}

class CurvedObject extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            isCustomRender: true,
            strokeStyle: 'red',
            fillStyle: 'green',
            closePath: true,
            lineWidth: 1,
            segments: {
                h:3, v: 3
            }
        }, options);

        super(options);

        if(this.start == undefined)
            this.start = new V2(-this.size.x/2, -this.size.y/2),

        this.startRender = this.toRender(this.start);

        this.curves = [
        ];

        let hSize = this.size.x/this.segments.h;
        let vSize = this.size.y/this.segments.v;
        let from = this.start.clone();
        let index = 0;
        if(this.segments.v > 0 && this.segments.h > 0){
            for(let i = 0; i < this.segments.h;i++){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { cp1: new V2(from.x + hSize/3 + hSize*i ,from.y), cp2: new V2(from.x + hSize*2/3 + hSize*i ,from.y), end: new V2(from.x + hSize + hSize*i ,from.y) },
                    destinationRadius: this.destinationRadius
                })
            }
    
            from = new V2(this.size.x/2, -this.size.y/2);
            for(let i = 0; i < this.segments.v;i++){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { cp1: new V2(from.x,  from.y + vSize/3 + vSize*i), cp2: new V2(from.x, from.y + vSize*2/3 + vSize*i), end: new V2(from.x, from.y + vSize + vSize*i) },
                    destinationRadius: this.destinationRadius
                })
            }
    
            from = new V2(this.size.x/2, this.size.y/2);
            for(let i = this.segments.h-1; i >= 0;i--){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { 
                        cp1: new V2(from.x - hSize/3 - hSize*(this.segments.h-1 - i) ,from.y), 
                        cp2: new V2(from.x - hSize*2/3 - hSize*(this.segments.h-1 - i) ,from.y), 
                        end: new V2(from.x - hSize - hSize*(this.segments.h-1 - i) ,from.y) },
                        destinationRadius: this.destinationRadius
                })
            }
    
            from = new V2(-this.size.x/2, this.size.y/2);
            for(let i = this.segments.v-1; i >= 0;i--){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { 
                        cp1: new V2(from.x,  from.y - vSize/3 - vSize*(this.segments.v-1 - i)), 
                        cp2: new V2(from.x, from.y - vSize*2/3 - vSize*(this.segments.v-1 - i)), 
                        end: new V2(from.x, from.y - vSize - vSize*(this.segments.v-1 - i)) },
                        destinationRadius: this.destinationRadius
                })
            }
        }
        else if(this.segments.v > 0 && this.segments.h == 0){
            let from = new V2(0, -this.size.y/2);
            for(let i = 0; i < this.segments.v;i++){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { cp1: new V2(from.x,  from.y + vSize/3 + vSize*i), cp2: new V2(from.x, from.y + vSize*2/3 + vSize*i), end: new V2(from.x, from.y + vSize + vSize*i) },
                    destinationRadius: this.destinationRadius
                })
            }
        }
        else if(this.segments.h > 0 && this.segments.v == 0){
            let from = new V2(-this.size.x/2, 0);
            for(let i = 0; i < this.segments.h;i++){
                this.curves[index++] = new BezierCurve({
                    parent: this, logical: { cp1: new V2(from.x + hSize/3 + hSize*i ,from.y), cp2: new V2(from.x + hSize*2/3 + hSize*i ,from.y), end: new V2(from.x + hSize + hSize*i ,from.y) },
                    destinationRadius: this.destinationRadius
                })
            }
        }
        
    }

    toRender(p){
        return p.add(this.position).add(SCG.viewport.shift.mul(-1)).mul(SCG.viewport.scale);
    }

    internalUpdate(now){
        this.startRender = this.toRender(this.start);

        for(let c of this.curves){
            c.update(now);
        }
    }

    customRender(){
        let ctx = this.context;

        let oldLineWidth = ctx.lineWidth;
        let oldStrokeStyle = ctx.strokeStyle;
        let oldFillStyle = ctx.fillStyle;
        let oldLineCap = ctx.lineCap;

        ctx.beginPath();
        ctx.moveTo(this.startRender.x, this.startRender.y);
        for(let c of this.curves){
            c.render(ctx);
        }

        if(this.closePath)
            ctx.closePath();

        if(this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }
        if(this.strokeStyle){
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }

        ctx.lineWidth = oldLineWidth;
        ctx.strokeStyle = oldStrokeStyle;
        ctx.fillStyle = oldFillStyle;
        ctx.lineCap = oldLineCap;
    }
}

class BezierCurve {
    constructor(options = {}){
        assignDeep(this, {
            parent: undefined,
            destinationRadius: 0,
            propsNames: ['cp1', 'cp2', 'end'],
            logical: {
                cp1: new V2(),
                cp2: new V2(),
                end: new V2()
            },
            destination: {
                cp1: new V2(),
                cp2: new V2(),
                end: new V2()
            },
            speed: {
                cp1: new V2(),
                cp2: new V2(),
                end: new V2()
            },
            renderPoints: {
                cp1: new V2(),
                cp2: new V2(),
                end: new V2(),
            }
        }, options);

        this.origin = {
        }

        for(let prop of this.propsNames){
            this.origin[prop] = this.logical[prop].clone();
        }

        this.setDestinations();
    }

    setDestinations(){
        for(let prop of ['cp1', 'cp2']){//of this.propsNames){
            this.destination[prop] = this.origin[prop].add(new V2(getRandom(-this.destinationRadius,this.destinationRadius), getRandom(-this.destinationRadius,this.destinationRadius)));
            this.speed[prop] = this.logical[prop].direction(this.destination[prop]).mul(getRandom(0.5,1));
        }
    }

    update(now) {
        let needSetDestination = false;
        for(let prop of this.propsNames){
            this.logical[prop].add(this.speed[prop], true);
            if(this.logical[prop].distance(this.destination[prop]) < 1){
                this.logical[prop] = this.destination[prop].clone();
                needSetDestination = true;
            }

            if(needSetDestination)
                this.setDestinations();

            this.renderPoints[prop] = this.toRender(this.logical[prop]);
        }
    }

    toRender(p){
        return p.add(this.parent.position).add(SCG.viewport.shift.mul(-1)).mul(SCG.viewport.scale);
    }

    render(ctx){
        ctx.bezierCurveTo(this.renderPoints.cp1.x, this.renderPoints.cp1.y, this.renderPoints.cp2.x, this.renderPoints.cp2.y, this.renderPoints.end.x, this.renderPoints.end.y);
    }
}