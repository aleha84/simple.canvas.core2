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

                    if(['e', 'a', 'm'].indexOf(event.key) != -1 && !this.editor.editor.getModeState().disabled && this.editor.editor.selected.groupId != undefined){
                        switch(event.key){
                            case 'a': 
                                this.editor.editor.setModeState(true, 'add')
                                break;
                            case 'e': 
                                this.editor.editor.setModeState(true, 'edit')
                                break;
                            case 'm': 
                                this.editor.editor.setMoveGroupModeState(true, 'movegroup')
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
        }),0, true);

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper',
            renderCallback: this.renderModel.bind(this)
        })

        
    }

    renderModel(model){
        console.log(model);
        let mg = this.mainGo;
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
            mg.size = general.size.mul(general.zoom);
            mg.showGrid = general.showGrid;
            mg.invalidate();
    
            SCG.UI.invalidate()
    
            mg.needRecalcRenderProperties = true;
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
                }))
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

