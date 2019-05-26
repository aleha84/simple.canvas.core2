class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options)
    }

    start(){
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
            size: new V2(70,20),
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
        mg.model = model;

        mg.img = PP.createImage(model);

        mg.originalSize = general.originalSize;
        mg.size = general.size.mul(general.zoom);
        mg.showGrid = general.showGrid;
        mg.invalidate();

        // let delay = 0;
        // for(let p of _fillPoints){
        //     let go = mg.addChild(new GO({
        //         position: new V2(mg.tl.x + mg.itemSize.x/2 + mg.itemSize.x*p.x, mg.tl.y + mg.itemSize.y/2 + mg.itemSize.y*p.y),
        //         size: mg.itemSize,
        //         img: createCanvas(new V2(1,1), (ctx, size) => {
        //             ctx.fillStyle = 'blue'; ctx.fillRect(0,0, size.x, size.y);
        //         }),
        //         isVisible: false
        //     }));

            
        //     go.addEffect(new FadeInEffect({startDelay: delay, effectTime: 150,updateDelay: 40,  beforeStartCallback: function() {
        //         this.parent.isVisible = true;
        //     }}))
        //     delay+=50
        // }

        SCG.UI.invalidate()

        mg.needRecalcRenderProperties = true;
    }

    backgroundRender(){
        this.backgroundRenderDefault();
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

