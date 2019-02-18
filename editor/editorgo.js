class EditorGO extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            img: undefined,
            preventDiving: true,
            drag: {
                disable() {
                    this.started = false;
                    this.downOn = undefined;
                },
                downOn: undefined,
                started: false,
            },
            handlers: {
                move:function (relativePosition) {
                    this.moveEventTriggered = true;
                    let d = this.drag;
                    if(d.downOn){
                        d.started = true;
                        let index = new V2(
                            fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.x, 0)/this.itemSize.x,0), 
                            fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.y, 0)/this.itemSize.y,0));
                        //console.log(index);
                        if(!d.downOn.index.equal(index)){
                            d.downOn.indexChanged = true;
                            d.downOn.index = index;
                            d.downOn.position = new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*index.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*index.y);
                            d.downOn.needRecalcRenderProperties = true;
                        }
                        //console.log('drag rp:' + relativePosition.toString(), this.size.toString())

                    }

                    return {
                        preventDiving: this.preventDiving
                    };
                },
                up: function(){
                    let d = this.drag;
                    if(d.started && d.downOn.indexChanged){
                        //console.log('changeCallback');
                        d.downOn.pointModel.changeCallback(d.downOn.index);
                    }
                    d.disable();
                },
                out: function(e) {
                    this.moveEventTriggered = false; 
                    this.highlightChild();
                    return {
                        preventDiving: this.preventDiving
                    };
                 }
            }
        }, options);

        super(options)
    }

    highlightChild(active) {
        this.childrenGO.filter(c => c.isGrid).forEach((ch) => {
            ch.highlight = false;
        });
        
        if(active)
            active.highlight = true;
    }

    invalidate() {
        [...this.childrenGO].forEach((ch) => {
            this.removeChild(ch);
        });

        this.itemSize = new V2(this.size.x/this.originalSize.x, this.size.y/this.originalSize.y)
        this.tl = new V2(-this.size.x/2, -this.size.y/2);

        if(this.showGrid){
            
            for(let r = 0; r < this.originalSize.y; r++){
                for(let c = 0; c < this.originalSize.x; c++){ 
                    this.addChild(new GO({
                        index: new V2(c, r),
                        isGrid: true,
                        highlight: false,
                        position: new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*c, this.tl.y + this.itemSize.y/2 + this.itemSize.y*r),
                        size: this.itemSize,
                        preventDiving: false,
                        internalRender() {
                            let { context: ctx, renderSize: rs, renderPosition:rp } = this;
                            if(this.highlight){
                                ctx.fillStyle = 'rgba(0, 255, 0,0.5)';
                                ctx.fillRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
                            }
                            else {
                                ctx.strokeStyle = 'green';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
                            }
                            
                        },
                        handlers: {
                            move: function(e) { 
                                //console.log('over: ' + this.position, e);
                                this.parent.highlightChild(this);
    
                                return {
                                    preventDiving: this.preventDiving
                                };
                             }
                        }
                    }), true)
                }
            }
        }

        if(this.model){
            let selectedLayer = this.model.main.layers ? this.model.main.layers.filter(l => l.selected) : [];
            if(selectedLayer.length){
                selectedLayer = selectedLayer[0];
                selectedLayer.points.forEach(p => {
                    this.addChild(new Dot({
                        size: this.itemSize,
                        pointModel: p,
                        index: p.point.clone(),
                        position: new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.point.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.point.y),
                        img: createCanvas(this.itemSize, (ctx, size) => {
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(0,0, size.x, size.y);
                        })
                    }), true)
                })
            }
        }
        
        
    }

    internalRender() {
        let { context: ctx, renderSize: rs, renderPosition:rp } = this;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
    }
}

class Dot extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            handlers: {
                down: function(){
                    this.parent.drag.downOn = this;
                    this.parent.drag.downOn.pointModel.selectCallback();
                }
            }
        }, options);

        super(options);
    }
}