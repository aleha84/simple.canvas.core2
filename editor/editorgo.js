class EditorGO extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            img: undefined,
            preventDiving: true,
            showDots: true,
            dots: [],
            longPress: {
                delay: 1500,
                timer: undefined,
                infoTimer: undefined,
                index: undefined,
                clear() {
                    if(this.timer != undefined){
                        clearTimeout(this.timer);
                        this.timer = undefined;
                        clearTimeout(this.infoTimer);
                        this.infoTimer = undefined;
                        this.index = undefined;

                        document.body.classList.remove("longPressInfo");
                    }
                    
                }
            },
            drag: {
                disable() {
                    this.started = false;
                    this.downOn = undefined;
                    SCG.viewport.scrollOptions.enabled = true;
                },
                downOn: undefined,
                started: false,
            },
            selection: {
                cancel() {
                    this.start = undefined;
                    this.current = undefined;
                    this.go = undefined;
                    this.boxParams = undefined;
                    SCG.viewport.scrollOptions.enabled = true;
                },
                go: undefined,
                boxParams: undefined, 
                start: undefined,
                current: undefined,
                move: {
                    ids: []
                }
            },
            handlers: {
                move:function (relativePosition) {
                    // if(this.model.editor.mode == 'removement'){
                    //     console.log('return from move')
                    //     return;
                    // }
                        

                    relativePosition = relativePosition.add(SCG.viewport.shift);
                    this.moveEventTriggered = true;
                    this.model.editor.index = new V2(
                        fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.x, 0)/this.itemSize.x,0), 
                        fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.y, 0)/this.itemSize.y,0));

                    let d = this.drag;
                    let index = this.model.editor.index;

                    if(this.longPress.timer && this.longPress.index && !this.longPress.index.equal(index)){
                        this.longPress.clear();
                    }

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
                    else if(this.model.editor.mode == 'removement'){
                        if(d.downOn){
                            SCG.viewport.scrollOptions.enabled = false;
                        }
                    }
                    else if(this.model.editor.mode == 'moveselection'){
                        if(d.downOn){
                            d.started = true;
                            SCG.viewport.scrollOptions.enabled = false;
                            if(!d.downOn.index.equal(index)){

                                let direction = d.downOn.index.direction(index)//.toInt();
                                let distance = d.downOn.index.distance(index);
                                this.dots.filter(d => d.selected).forEach(p => {
                                    p.index.add(direction.mul(distance).toInt(), true);
                                    p.position = new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.index.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.index.y)
                                    p.needRecalcRenderProperties = true;
                                })

                                d.downOn.index = index;
                                d.downOn.indexChanged = true;
                            }
                        }
                    }
                    else if(this.model.editor.mode == 'add'){
                        if(d.downOn){
                            d.started = true;
                            SCG.viewport.scrollOptions.enabled = false;
                            let e = this.model.editor;
                            let sg = e.selectedLayer.selectedGroup

                            if(!d.downOn.index.equal(index)){

                                let indexPoints = [];
                                createCanvas(new V2(1,1), (ctx, size, hlp) => {
                                    let pp = new PerfectPixel({ctx});
                                    indexPoints = pp.line(d.downOn.index.x, d.downOn.index.y, index.x, index.y);
                                })

                                let pointsToAdd = [];
                                for(let i = 0; i < indexPoints.length; i++){
                                    let ci = indexPoints[i];
                                    if(sg.points.filter(p => p.point.x == ci.x && p.point.y == ci.y).length > 0){
                                        //console.log('existing point trying to add');
                                        continue;//return;
                                    }
        
                                    pointsToAdd.push(ci);
                                }

                                sg.addPointsCallback(pointsToAdd);

                                d.downOn.index = index;
                                d.downOn.indexChanged = true;
                            }

                            
                        }
                        
                    }
                    else if(this.model.editor.mode == 'movelayer'){
                        if(d.downOn){
                            SCG.viewport.scrollOptions.enabled = false;
                            if(!d.downOn.index.equal(index)){
                                let direction = d.downOn.index.direction(index)//.toInt();
                                let distance = d.downOn.index.distance(index);

                                this.model.editor.selectedLayer.move(direction.mul(distance).toInt());
                                d.downOn.index = index;
                                d.downOn.indexChanged = true;
                            }
                        }
                    }
                    else if(this.model.editor.mode == 'movegroup'){
                        if(d.downOn){
                            SCG.viewport.scrollOptions.enabled = false;
                            if(!d.downOn.index.equal(index)){
                                d.started = true;
                                //console.log('need update points', )
                                let direction = d.downOn.index.direction(index)//.toInt();
                                let distance = d.downOn.index.distance(index);

                                let delta = direction.mul(distance).toInt();
                                this.dots.forEach(p => {
                                    p.index.add(delta, true);
                                    p.position = new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.index.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.index.y)
                                    p.needRecalcRenderProperties = true;
                                })

                                d.downOn.index = index;
                                d.downOn.indexChanged = true;
                            }
                        }
                        
                    }
                    else if(this.model.editor.mode == 'selection'){
                        let s = this.selection;
                        if(s.start){
                            s.current = relativePosition.toInt();
                            s.go.img = createCanvas(this.size, (ctx, size, hlp) => {
                                let from = new V2();
                                let to = new V2();
                                if(s.start.x < s.current.x ){
                                    from.x = s.start.x;
                                    to.x = s.current.x;
                                }
                                else {
                                    from.x = s.current.x;
                                    to.x = s.start.x;
                                }

                                if(s.start.y < s.current.y){
                                    from.y = s.start.y;
                                    to.y = s.current.y;
                                }
                                else {
                                    from.y = s.current.y;
                                    to.y = s.start.y;
                                }
    
                                s.boxParams = {
                                    tl: from,
                                    size: new V2(to.x-from.x, to.y - from.y)
                                }

                                hlp.setFillColor('white').strokeRect(from.x, from.y, s.boxParams.size.x, s.boxParams.size.y);
                                
                            })
                        }
                        
                    }

                    this.parentScene.pointerDataLabel.invalidate();

                    return {
                        preventDiving: this.preventDiving
                    };
                },
                down: function(relativePosition) {
                    relativePosition = relativePosition.add(SCG.viewport.shift);

                    this.longPress.infoTimer = setTimeout(() => {
                        document.body.classList.add("longPressInfo");
                    }, fast.r(this.longPress.delay/2))

                    this.longPress.timer = setTimeout(() => {
                        
                        let position = pointerEventToXY(SCG.controls.mouse.state.lastTriggeredOriginalEvent);
                        let size = this.parentScene.editor.editor.panels.uiControls.methods.getSize();

                        this.parentScene.editor.editor.panels.uiControls.methods.setPosition(new V2(position).substract(size.add(new V2(2,2))))
                        this.longPress.clear();
                    }, this.longPress.delay)

                    this.longPress.index = this.getIndexByRelativePosition(relativePosition).index;

                    if(this.model.editor.mode == 'removement'){
                        SCG.viewport.scrollOptions.enabled = false;
                        this.drag.started = true;
                    }
                    if(this.model.editor.mode == 'add'){
                        if(!this.model.editor.selectedLayer || !this.model.editor.selectedLayer.selectedGroup){
                            alert('No selected group in layer');
                            //this.parentScene.editor.editor.setModeState(true, 'edit');
                            return;
                        }

                        SCG.viewport.scrollOptions.enabled = false;
                        this.drag.downOn = this.getIndexByRelativePosition(relativePosition);
                    }

                    if(this.model.editor.mode == 'movelayer' && this.model.editor.selectedLayer){
                        this.drag.downOn = this.getIndexByRelativePosition(relativePosition);
                    }

                    if(this.model.editor.mode == 'movegroup' && this.model.editor.selectedLayer && this.model.editor.selectedLayer.selectedGroup){
                        //console.log('down movegroup', this.model.editor.selectedLayer.points);
                        this.drag.downOn = this.getIndexByRelativePosition(relativePosition);
                    }

                    if(this.model.editor.mode == 'selection' && this.model.editor.selectedLayer && this.model.editor.selectedLayer.selectedGroup){
                        this.selection.cancel();
                        this.dots.forEach(d => {
                            d.setSelected(false);
                        });

                        SCG.viewport.scrollOptions.enabled = false;
                        this.selection.start = relativePosition.toInt();
                        this.selection.go = this.addChild(new GO({
                            position: new V2(),
                            size: this.size
                        }))
                    }

                    //this.drag.downOn = this.getIndexByRelativePosition(relativePosition);
                },
                up: function(){
                    let d = this.drag;

                    this.longPress.clear();

                    if(this.model.editor.mode == 'removement'){
                        d.disable();
                    }
                    if(this.model.editor.mode == 'edit'){
                        if(d.started && d.downOn.indexChanged){
                            d.downOn.pointModel.changeCallback(d.downOn.index);
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'moveselection'){
                        if(d.started && d.downOn.indexChanged){
                            this.dots.filter(d => d.selected).forEach(p => {
                                p.pointModel.changeCallback(p.index, true);
                            })

                            this.model.editor.selectedLayer.selectedGroup.changeCallback();
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'add'){
                        
                        let e = this.model.editor;
                        let sg = e.selectedLayer.selectedGroup
                        if(!e.index){
                            d.disable();
                            console.log('existing point trying to add');
                            return;
                        }
                        // if(!sg){
                        //     d.disable();
                        //     console.log('No selected group in layer')
                        //     return;
                        // }

                        if(sg.points.filter(p => p.point.x == e.index.x && p.point.y == e.index.y).length > 0){
                            d.disable();
                            console.log('existing point trying to add');
                            return;
                        }
                        
                        sg.addPointCallback(e.index);
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'movelayer' ){
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'movegroup' ){
                        if(d.started && d.downOn.indexChanged){
                            this.dots.forEach(p => {
                                p.pointModel.changeCallback(p.index, true);
                            })

                            this.model.editor.selectedLayer.selectedGroup.changeCallback();
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'colorpick'){
                        if(!this.img){
                            d.disable();
                            //console.log('image isnt visible');
                            notifications.warning('image isnt visible', 2000)
                            return;
                        }

                        let colorData = this.img.getContext('2d').getImageData(this.model.editor.index.x, this.model.editor.index.y,1,1);

                        if(colorData.data[0] == 0 && colorData.data[1] == 0 && colorData.data[2] == 0 && colorData.data[3] == 0 && 
                        this.parentScene.underlyingImg && this.parentScene.underlyingImg.img) {
                            colorData = this.parentScene.underlyingImg.img.getContext('2d').getImageData(this.model.editor.index.x, this.model.editor.index.y,1,1);
                        }

                        this.parentScene.editor.editor.panels.colorPicker.setValue('#' + rgbToHex(Array.from(colorData.data)))
                        //console.log(colorData);
                        //this.model.editor.panels.colorPicker
                        
                    }
                    else if(this.model.editor.mode == 'selection'){
                        if(this.selection.boxParams){
                            let selectionBox = new Box(this.selection.boxParams.tl.substract(this.size.divide(2)).toInt(), this.selection.boxParams.size);

                            let inSelection = this.dots.filter(d => new Box(d.position.substract(this.itemSize.divide(2)).toInt(), this.itemSize).isIntersectsWithBox(selectionBox));
    
                            inSelection.forEach(dot => dot.setSelected(true, { multiselect: true }))
                        }
                        

                        this.removeChild(this.selection.go);
                        this.selection.cancel();
                    }
                },
                out: function(e) {
                    this.moveEventTriggered = false; 
                    this.highlightChild();
                    let d = this.drag;

                    this.longPress.clear();

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

                    if(this.model.editor.mode == 'selection' && this.model.editor.selectedLayer && this.model.editor.selectedLayer.selectedGroup){
                        if(this.selection.boxParams){
                            let selectionBox = new Box(this.selection.boxParams.tl.substract(this.size.divide(2)).toInt(), this.selection.boxParams.size);

                            let inSelection = this.dots.filter(d => new Box(d.position.substract(this.itemSize.divide(2)).toInt(), this.itemSize).isIntersectsWithBox(selectionBox));
    
                            inSelection.forEach(dot => dot.setSelected(true, { multiselect: true }))
                        }
                        

                        this.removeChild(this.selection.go);
                        this.selection.cancel();
                    }

                    if(this.model.editor.mode == 'add'){
                        let os  = this.model.general.originalSize;
                        let sg = this.model.editor.selectedLayer.selectedGroup;

                        if(d.started && d.downOn.indexChanged){
                            let index = d.downOn.index;
                            if(index.x < 0) index.x = 0;
                            if(index.y < 0) index.y = 0;
                            if(index.x >= os.x) index.x = os.x-1;
                            if(index.y >= os.y) index.y = os.y-1;

                            let indexPoints = [];
                            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                                let pp = new PerfectPixel({ctx});
                                indexPoints = pp.line(d.downOn.index.x, d.downOn.index.y, index.x, index.y);
                            })

                            let pointsToAdd = [];
                            for(let i = 0; i < indexPoints.length; i++){
                                let ci = indexPoints[i];
                                if(sg.points.filter(p => p.point.x == ci.x && p.point.y == ci.y).length > 0){
                                    continue;
                                }
    
                                pointsToAdd.push(ci);
                            }

                            sg.addPointsCallback(pointsToAdd);
                        }
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'movelayer'){
                        d.disable();
                    }
                    else if(this.model.editor.mode == 'movegroup' || this.model.editor.mode == 'moveselection'){
                        if(d.started && d.downOn.indexChanged){
                            this.dots.forEach(p => {
                                p.pointModel.changeCallback(p.index, true);
                            })

                            this.model.editor.selectedLayer.selectedGroup.changeCallback();
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
    getIndexByRelativePosition(relativePosition){
        return {
            index: new V2(
                fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.x, 0)/this.itemSize.x,0), 
                fastFloorWithPrecision(fastRoundWithPrecision(relativePosition.y, 0)/this.itemSize.y,0)
            )
        };
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

        if(!this.notSelectedImg){
            this.notSelectedImg = createCanvas(this.itemSize, (ctx, size) => {
                ctx.translate(0.5,0.5);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(0,0, size.x-1, size.y-1);
            })
        }

        if(!this.notSelectedImgDark) {
            this.notSelectedImgDark = createCanvas(this.itemSize, (ctx, size) => {
                ctx.translate(0.5,0.5);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(0,0, size.x-1, size.y-1);
            })
        }
        
        if(!this.selectedImg){
            this.selectedImg = createCanvas(this.itemSize, (ctx, size) => {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillRect(0,0, size.x, size.y);
                ctx.translate(0.5,0.5);
                ctx.strokeStyle = 'white';
                ctx.strokeRect(0,0, size.x-1, size.y-1);
            })
        }

        if(!this.selectedImgDark){
            this.selectedImgDark = createCanvas(this.itemSize, (ctx, size) => {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(0,0, size.x, size.y);
                ctx.translate(0.5,0.5);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(0,0, size.x-1, size.y-1);
            })
        }

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

                let selectedGroup = selectedLayer.groups ? selectedLayer.groups.filter(g => g.selected) : [];
                this.model.editor.selectedLayer.selectedGroup = undefined;

                if(selectedGroup.length){
                    selectedGroup= selectedGroup[0]
                    this.model.editor.selectedLayer.selectedGroup = selectedGroup;

                    let rgb = colors.colorTypeConverter({value:selectedGroup.strokeColor, fromType: 'hex', toType: 'rgb' });
                    let isBright = rgb.r > 200 && rgb.g > 200 && rgb.b > 200;
                    
                    selectedGroup.points.forEach(p => {
                        let selected = p.selected;
                        //if(this.parentScene.editor.editor.getModeState().mode == 'moveselection'){
                        if(this.model.editor.mode == 'moveselection') {
                            selected = this.selection.move.ids.indexOf(p.id) != -1;
                        }

                        this.dots.push(this.addChild(new Dot({
                            size: this.itemSize,
                            pointModel: p,
                            selected,
                            index: p.point.clone(),
                            position: new V2(this.tl.x + this.itemSize.x/2 + this.itemSize.x*p.point.x, this.tl.y + this.itemSize.y/2 + this.itemSize.y*p.point.y),
                            notSelectedImg: isBright? this.notSelectedImgDark : this.notSelectedImg,
                            selectedImg: isBright ? this.selectedImgDark : this.selectedImg,
                        }), true)
                    )})
                }
                
            }
        }
        
        
    }

    internalUpdate() {
        this.childrenGO.forEach((ch) => {
            ch.isVisible = this.showDots;
        });
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
                    if(this.parent.model.editor.mode == 'removement'){
                        this.parent.drag.downOn = this;
                        return true;
                    }
                    else if(this.parent.model.editor.mode == 'edit'){
                        this.parent.drag.downOn = this;
                        this.parent.drag.downOn.pointModel.selectCallback();
                        this.setSelected(true);
                    }
                    else if(this.parent.model.editor.mode == 'moveselection'){
                        this.parent.drag.downOn = this;
                    }
                },
                move: function() {
                    if(this.parent.model.editor.mode == 'removement' && this.parent.drag.started){
                        this.parent.drag.downOn = this;
                        this.parent.drag.downOn.pointModel.selectCallback();
                        this.parent.parentScene.editor.editor.removeSelectedPoint();
                    }
                    return true;
                },
                up: function() {
                    if(this.parent.model.editor.mode == 'removement'){
                        this.parent.drag.downOn = this;
                        this.parent.drag.downOn.pointModel.selectCallback();
                        this.parent.parentScene.editor.editor.removeSelectedPoint();
                    }

                    return true;
                }
            }
        }, options);

        super(options);

        if(this.selected){
            this.selectedEffect = this.addEffect(new FadeInOutEffect({effectTime: 500, max: 1, min: 0.5, updateDelay: 50, loop: true}))
        }
    }
    init(){
        this.setSelected(this.selected, {  multiselect: this.parent.model.editor.mode == 'moveselection'});
    }
    setSelected(selected, params = {multiselect: false }) {
        this.selected = selected;
        if(this.selected){
            if(!params.multiselect){
                this.parent.childrenGO.filter(c => c.type == 'Dot').forEach(c => c.setSelected(false));
            }
            
            this.img = this.selectedImg;
            if(!this.selectedEffect)
                this.selectedEffect = this.addEffect(new FadeInOutEffect({effectTime: 500, max: 1, min: 0.5, updateDelay: 50, loop: true, initOnAdd: true}))
        }
        else {
            this.img = this.notSelectedImg;
            this.removeEffect(this.selectedEffect);
        }
    }
}