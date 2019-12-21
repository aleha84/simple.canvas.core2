class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            scrollOptions: {
                enabled: true,
                restrictBySpace: false
            },
            events: {
                keyup: (event) => {
                   // console.log(this, event, event.keyCode)
                    let edt = this.editor.editor;

                    if(event.key == 'h'){
                        this.mainGo.showDots = !this.mainGo.showDots;
                    }

                    if(event.key == 'r'){
                        if(edt.selected.pointId == undefined)
                        {
                            alert('No point selected');
                            return;
                        }
                        
                        edt.removeSelectedPoint()
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

                    if(['e', 'a', 'm'].indexOf(event.key) != -1 && !edt.getModeState().disabled && edt.selected.groupId != undefined){
                        switch(event.key){
                            case 'a': 
                                edt.setModeState(true, 'add')
                                break;
                            case 'e': 
                                edt.setModeState(true, 'edit')
                                break;
                            case 'm': 
                                edt.setMoveGroupModeState(true, 'movegroup')
                                break;
                            default:
                                break;
                        }

                        this.editor.updateEditor();
                    }

                    if(['-', '+', '='].indexOf(event.key) != -1){
                        let zoom = this.editor.image.general.zoom;
                        let trigger = false;
                        switch(event.key){
                            case '-': 
                                if(zoom.current > zoom.min){
                                    zoom.current--;
                                    trigger = true;
                                }
                                break;
                            case '+': 
                            case '=':
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

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper',
            renderCallback: this.renderModel.bind(this)
        })

        
    }

    renderModel(model){
        console.log(model);
        let mg = this.mainGo;
        let uimg = this.underlyingImg;
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
    
            mg.img = PP.createImage(model);
    
            mg.originalSize = general.originalSize;
            uimg.originalSize = general.originalSize;

            mg.size = general.size.mul(general.zoom);
            uimg.size = general.size.mul(general.zoom);

            mg.showGrid = general.showGrid;
            mg.invalidate();
    
            SCG.UI.invalidate()
    
            mg.needRecalcRenderProperties = true;
            uimg.needRecalcRenderProperties = true;
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

