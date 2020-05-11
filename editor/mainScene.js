class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            scrollOptions: {
                enabled: true,
                restrictBySpace: false
            },
            events: {
                checkTextInput() {
                    return document.activeElement.type == 'text' 
                    || document.activeElement.type == 'textarea' 
                    || (document.activeElement.tagName.toLowerCase() == 'input' && document.activeElement.type == 'number' )
                },
                checkSelect() {
                    return (document.activeElement.tagName.toLowerCase() == 'select')
                },
                down: () => {
                    if(document.activeElement && (this.events.checkTextInput() || this.events.checkSelect()))
                        document.activeElement.blur();
                },
                keyup: (event) => {
                    if(event.code == 'Backspace'){
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }

                    if(document.activeElement && this.events.checkTextInput())
                        return;

                    //console.log(this, event, event.keyCode)
                    let edt = this.editor.editor;
                    let image = this.editor.image;

                    if(event.keyCode == 72){ // 'h'
                        this.mainGo.showDots = !this.mainGo.showDots;
                    }

                    if(event.keyCode == 82) { // 'r'
                        if(edt.getModeState().mode == 'selection'){
                            let pointsIds = this.mainGo.childrenGO.filter(c => c.type == 'Dot' && c.selected).map(p => p.pointModel.id);
                            
                            let main = this.editor.image.main;
                            if(isArray(main)){
                                main = main[this.editor.image.general.currentFrameIndex];
                            }

                            let layer = main.layers.filter(l => l.id == edt.selected.layerId)[0];
                            layer.removeImage();
                            let group = layer.groups.filter(g => g.id == edt.selected.groupId)[0];

                            group.points = group.points.filter(gp => pointsIds.indexOf(gp.id) == -1);  
                            group.points.forEach((p, i) => {p.order = i; });
                            this.editor.updateEditor();

                            notifications.done('points removed: ' + pointsIds.length, 500)
                        }
                        else {
                            if(edt.selected.pointId == undefined)
                            {
                                //alert('No point selected');
                                notifications.warning('No point selected', 500)
                                return;
                            }
                            
                            edt.removeSelectedPoint()
                        }
                    }

                    if(event.keyCode == 83){ // 's' - toggle selection
                        if(edt.selected.layerId && edt.selected.groupId){
                            edt.mode.toggleSelection();
                            this.editor.updateEditor();
                        }
                        else {
                            notifications.warning('No layer or group selected', 1000)
                        }
                    }
                    

                    if(event.keyCode == 86 && !event.ctrlKey){ // 'v' - toggle layer or group visibility
                        if(event.shiftKey){
                            //layer
                            if(edt.selected.layerId && isFunction(edt.toggleLayerVisibility))
                                edt.toggleLayerVisibility();
                        }
                        else {
                            //group
                            if(edt.selected.groupId && isFunction(edt.toggleGroupVisibility))
                                edt.toggleGroupVisibility();
                        }
                    }

                    if(event.keyCode == 86 && event.ctrlKey && event.shiftKey){ // 'v' 
                        let main = this.editor.image.main;
                        if(isArray(main)){
                            main = main[this.editor.image.general.currentFrameIndex];
                        }
                        main.layers.forEach(l => {l.visible = !l.visible; l.removeImage(); });

                        event.preventDefault();
                        event.stopPropagation();

                        this.editor.updateEditor();
                    }

                    if([69, 65, 77].indexOf(event.keyCode) != -1 && !edt.getModeState().disabled && edt.selected.groupId != undefined){ 
                        switch(event.keyCode){
                            case 65:  // 'a'
                                edt.setModeState(true, 'add')
                                break;
                            case 69:  // 'e' 
                                edt.setModeState(true, 'edit')
                                break;
                            case 77:  // 'm'
                                if(edt.getModeState().mode == 'selection'){
                                    edt.mode.toggleMoveSelection();
                                    //console.log(this.mainGo.childrenGO.filter(c => c.type == 'Dot' && c.selected));
                                    if(edt.getModeState().mode == "moveselection"){
                                        this.mainGo.selection.move.ids = this.mainGo.childrenGO.filter(c => c.type == 'Dot' && c.selected).map(p => p.pointModel.id);
                                    }
                                }
                                else {
                                    edt.setMoveGroupModeState(true, 'movegroup')
                                }
                                
                                break;
                            default:
                                break;
                        }

                        this.editor.updateEditor();
                    }

                    if(['Minus', 'Equal'].indexOf(event.code) != -1){
                        let zoom = this.editor.image.general.zoom;
                        let trigger = false;
                        switch(event.code){
                            case 'Minus': // '-' 
                                if(zoom.current > zoom.min){
                                    zoom.current--;
                                    trigger = true;
                                }
                                break;
                            case 'Equal': // '=', '+'
                                    if(zoom.current < zoom.max){
                                        zoom.current++;
                                        trigger = true;
                                    }
                                break;
                            default:
                                break;
                        }

                        if(trigger){
                            let el = document.querySelector('.general .range input');
                            el.value = zoom.current;
                            el.dispatchEvent(new Event('change'))
                        }
                    }

                    if(image.general.animated){
                        if(event.code == 'KeyN'){
                            notifications.done('Show next frames', 1000)
                        }

                        if(event.code == 'KeyP'){
                            notifications.done('Show prev frames', 1000)
                        }
                    }
                    
                }
            }
        }, options);

        super(options)
    }

    start(){
        this.bgColor = '#000000';

        this.editorMode = this.addUIGo(new UILabel({
            position: new V2(55, 20),
            size: new V2(50,20),
            text: {
                size: 12,
                color: 'white'
            },
            format: {
                format: "Editor mode: {0}",
                argsRetriever: () => { 
                    return [this.editor.editor.mode.value.toUpperCase()]; }
            }
        }));

        this.pointerDataLabel = this.addUIGo(new UILabel({
            position: new V2(this.viewport.x- 100, 20),
            size: new V2(100,20),
            text: {
                size: 8,
                color: 'white'
            },
            format: {
                format: "Pointer: {0}",
                argsRetriever: () => { 
                    if(this.mainGo.model.editor.index)
                        return [this.mainGo.model.editor.index.toString()]; 
                
                    return ['No data']; }
            }
        }));

        this.mainGo = this.addGo(new EditorGO({
            position: this.sceneCenter
        }),1, true);

        this.underlyingImg = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.mainGo.size,
            // setImg(img) {
            //     this.img = img;
            //     this.needRecalcRenderProperties = true;
            // }
        }))

        this.framesPreview = this.addGo(new GO({
            position: this.sceneCenter,
            size: this.mainGo.size,
            init() {
                this.prev = this.addChild(new GO({
                    position: new V2(),
                    size: this.size
                }))

                this.next = this.addChild(new GO({
                    position: new V2(),
                    size: this.size
                }))
            },
            setSize(size) {
                this.size = size;
                if(this.prev)
                    this.prev.size = size;
                if(this.next)
                    this.next.size = size;
            }
        }), 10)

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper',
            renderCallback: this.renderModel.bind(this),
            mainGo: this.mainGo
        });
    }

    renderModel(model){
        if(model.logEnabled)
            console.log(model);

        let mg = this.mainGo;
        let uimg = this.underlyingImg;
        let fp = this.framesPreview;
        let {general, main} = model;

        if(general.backgroundColor && this.bgColor != general.backgroundColor){
            this.bgColor = general.backgroundColor;
            this.backgroundRenderDefault(this.bgColor);
        }

        if(!general.demo){
            if(this.animationDemo) {
                this.animationDemo.setDead();
                this.animationDemo = undefined;
            }

            mg.isVisible = true;
            mg.model = model;
    
            let imagesCreated = 0;
            mg.img = createCanvas(general.size, (ctx, size, hlp) => {
                model.main.layers.forEach(l => {
                    if(!l.layerImage){
                        l.layerImage = PP.createImage(model, {renderOnly: [l.name || l.id]});
                        l.layerImageCreatedCallback(l.layerImage)
                        imagesCreated++;
                    }

                    ctx.drawImage(l.layerImage, 0,0);
                })
            })

            console.log('renderModel: imagesCreated: ' + imagesCreated);
            

            //mg.img = PP.createImage(model);
    
            mg.originalSize = general.originalSize;
            uimg.originalSize = general.originalSize;
            fp.originalSize = general.originalSize;

            mg.size = general.size.mul(general.zoom);
            uimg.size = general.size.mul(general.zoom);
            fp.setSize(general.size.mul(general.zoom));
            

            mg.showGrid = general.showGrid;
            mg.invalidate();
    
            SCG.UI.invalidate()
    
            mg.needRecalcRenderProperties = true;
            uimg.needRecalcRenderProperties = true;
            fp.needRecalcRenderProperties = true;
        }
        else {
            mg.isVisible = false;

            if(!this.animationDemo){
                this.animationDemo = this.addGo(new GO({
                    position: this.sceneCenter.clone(),
                    size: general.size.mul(general.zoom),
                    timerDelay: general.demo.delay,
                    init() {
                        this.frames = PP.createImage(model);
                        if(!isArray(this.frames)){
                            this.frames = [this.frames];
                        }
    
                        this.currentFrame = 0;
                        this.setTimer()
                    },
                    setTimer(timerDelay) {
                        if(timerDelay){
                            this.timerDelay = timerDelay;
                        }

                        if(this.timer){
                            this.unregTimer(this.timer);
                        }

                        this.timer = this.regTimerDefault(this.timerDelay, () => {
                            this.img = this.frames[this.currentFrame++];
    
                            if(this.currentFrame == this.frames.length)
                                this.currentFrame = 0;
                        })
                    }
                }), 10)
            }
            else {
                this.animationDemo.setTimer(general.demo.delay)
            }
            
        }
    }

    backgroundRender(){
        this.backgroundRenderDefault(this.bgColor);
    }
}

SCG.globals.version = 0.1;
SCG.globals.parentId = 'editor'

let defaultViewpot = new V2(500,300);
SCG.scenes.cacheScene(new EditorScene({
    name:'editor',
    viewport: defaultViewpot
}));

SCG.scenes.selectScene('editor');
document.addEventListener("DOMContentLoaded", function() {
    SCG.main.start();
})

document.addEventListener("paste", function(event) {
    //console.log('paste event')
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    //console.log(items);
    if(items.length == 0)
        return;

    let blob = null;
    for(let i = 0; i < items.length; i++){
        if(items[i].type.indexOf('image') != -1){
            blob = items[i].getAsFile();
            break;
        }
    }
    
    if(blob == null)
        return;

    //console.log(blob);
    var img = new Image();
    img.onload = function() {
        let uimg = SCG.scenes.activeScene.underlyingImg;
        uimg.img = createCanvas(uimg.originalSize, (ctx, size, hlp) => {
            ctx.drawImage(img,0,0, size.x, size.y);
        })
    }

    img.src = URL.createObjectURL(blob);
    // let reader = new FileReader();
    // reader.readAsDataURL
})

const rx = /INPUT|SELECT|TEXTAREA/i;
addListenerMulti(document, "keydown keypress", function(e){
    if( e.which == 8 ){ // 8 == backspace
        if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
            e.preventDefault();
        }
    }
})


