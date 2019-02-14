class EditorGO extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            img: undefined,
            preventDiving: true,
            handlers: {
                move:function () {
                    this.moveEventTriggered = true;
                    return {
                        preventDiving: this.preventDiving
                    };
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
        this.childrenGO.forEach((ch) => {
            ch.highlight = false;
        });
        
        if(active)
            active.highlight = true;
    }

    invalidate() {
        [...this.childrenGO].forEach((ch) => {
            this.removeChild(ch);
        });

        if(this.showGrid){
            let tl = new V2(-this.size.x/2, -this.size.y/2);
            let itemSize = new V2(this.size.x/this.originalSize.x, this.size.y/this.originalSize.y)
            for(let r = 0; r < this.originalSize.y; r++){
                for(let c = 0; c < this.originalSize.x; c++){ 
                    this.addChild(new GO({
                        highlight: false,
                        position: new V2(tl.x + itemSize.x/2 + itemSize.x*c, tl.y + itemSize.y/2 + itemSize.y*r),
                        size: itemSize,
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
        
    }

    internalRender() {
        let { context: ctx, renderSize: rs, renderPosition:rp } = this;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
    }
}