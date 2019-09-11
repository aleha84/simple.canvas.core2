class EditorGO extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            img: undefined,
            preventDiving: true,
            dots: [],
            drag: {
                disable() {
                    this.started = false;
                    this.downOn = undefined;
                    SCG.viewport.scrollOptions.enabled = true;
                },
                downOn: undefined,
                started: false,
            },
            handlers: {
                move:function (relativePosition) {
                    relativePosition = relativePosition.add(SCG.viewport.shift);
                    this.moveEventTriggered = true;
                    this.model.editor.index = new V2(
                        fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.x, 0)/this.itemSize.x,0), 
                        fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.y, 0)/this.itemSize.y,0));

                    let d = this.drag;
                    let index = this.model.editor.index;

                    if(this.model.editor.mode == 'edit'){  
                        if(d.downOn){
                            d.started = true;
                            SCG.viewport.scrollOptions.enabled = false;
                            if(!d.downOn.index.equal(index)){
                                d.downOn.indexChanged = true;
                                d.downOn.index = index;
                                d.downOn.position = new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*index.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*index.y);
                                d.downOn.needRecalcRenderProperties = true;
                            }
                        }
                    }
                    else if(this.model.editor.mode == 'movelayer'){
                        if(d.downOn){
                            SCG.viewport.scrollOptions.enabled = false;
                            if(!d.downOn.index.equal(index)){
                                d.started = true;
                                //console.log('need update points', )
                                let direction = d.downOn.index.direction(index).toInt();
                                this.dots.forEach(p => {
                                    p.index.add(direction, true);
                                    p.position = new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.index.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.index.y)
                                    p.needRecalcRenderProperties = true;
                                })

                                d.downOn.index = index;
                                d.downOn.indexChanged = true;
                            }
                        }
                        
                    }

                    this.parentScene.pointerDataLabel.invalidate();

                    return {
                        preventDiving: this.preventDiving
                    };
                },
                down: function(relativePosition) {
                    if(this.model.editor.mode == 'movelayer'){
                        console.log('down movelayer', this.model.editor.selectedLayer.points);
                        this.drag.downOn = {
                            index: new V2(
                                fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.x, 0)/this.itemSize.x,0), 
                                fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.y, 0)/this.itemSize.y,0)
                                )
                        }
                    }
                },
                up: function(){
                    let d = this.drag;
                    if(this.model.editor.mode == 'edit'){
                        if(d.started && d.downOn.indexChanged){
                            d.downOn.pointModel.changeCallback(d.downOn.index);
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'add'){
                        let e = this.model.editor;
                        if( e.selectedLayer.points.filter(p => p.point.x == e.index.x && p.point.y == e.index.y).length > 0){
                            console.log('existing point trying to add');
                            return;
                        }

                        e.selectedLayer.addPointCallback(e.index);
                    }
                    else if(this.model.editor.mode == 'movelayer'){
                        if(d.started && d.downOn.indexChanged){
                            this.dots.forEach(p => {
                                p.pointModel.changeCallback(p.index, true);
                            })

                            this.model.editor.selectedLayer.changeCallback();
                        }
                        d.disable();
                    }
                    
                },
                out: function(e) {
                    this.moveEventTriggered = false; 
                    this.highlightChild();
                    let d = this.drag;

                    if(this.model.editor.mode == 'edit'){
                        
                        let os  = this.model.general.originalSize;
                        if(d.started && d.downOn.indexChanged){
                            let index = d.downOn.index;
                            if(index.x < 0) index.x = 0;
                            if(index.y < 0) index.y = 0;
                            if(index.x >= os.x) index.x = os.x-1;
                            if(index.y >= os.y) index.y = os.y-1;
                            d.downOn.pointModel.changeCallback(index);
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'movelayer'){
                        if(d.started && d.downOn.indexChanged){
                            this.dots.forEach(p => {
                                p.pointModel.changeCallback(p.index, true);
                            })

                            this.model.editor.selectedLayer.changeCallback();
                        }
                        d.disable();
                    }

                    this.model.editor.index = undefined;
                    this.parentScene.pointerDataLabel.invalidate();

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
                this.model.editor.selectedLayer = selectedLayer;
                this.dots = [];
                selectedLayer.points.forEach(p => {
                    this.dots.push(this.addChild(new Dot({
                        size: this.itemSize,
                        pointModel: p,
                        selected: p.selected,
                        index: p.point.clone(),
                        position: new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.point.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.point.y),
                        notSelectedImg: createCanvas(this.itemSize, (ctx, size) => {
                            ctx.translate(0.5,0.5);
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(0,0, size.x-1, size.y-1);
                        }),
                        selectedImg:createCanvas(this.itemSize, (ctx, size) => {
                            ctx.fillStyle = 'rgba(255,255,255,0.5)';
                            ctx.fillRect(0,0, size.x, size.y);
                            ctx.translate(0.5,0.5);
                            ctx.strokeStyle = 'white';
                            ctx.strokeRect(0,0, size.x-1, size.y-1);
                        })
                    }), true)
                )})
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
                    if(this.parent.model.editor.mode == 'edit'){
                        this.parent.drag.downOn = this;
                        this.parent.drag.downOn.pointModel.selectCallback();
                        this.setSelected(true);
                    }
                }
            }
        }, options);

        super(options);

        if(this.selected){
            this.selectedEffect = this.addEffect(new FadeInOutEffect({effectTime: 500, max: 1, min: 0.5, updateDelay: 50, loop: true}))
        }
    }
    init(){
        this.setSelected(this.selected);
    }
    setSelected(selected) {
        this.selected = selected;
        if(this.selected){
            this.parent.childrenGO.filter(c => c.type == 'Dot').forEach(c => c.setSelected(false));
            this.img = this.selectedImg;
            this.selectedEffect = this.addEffect(new FadeInOutEffect({effectTime: 500, max: 1, min: 0.5, updateDelay: 50, loop: true, initOnAdd: true}))
        }
        else {
            this.img = this.notSelectedImg;
            this.removeEffect(this.selectedEffect);
        }
    }
}