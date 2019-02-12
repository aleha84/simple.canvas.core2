class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
        }, options);

        super(options)
    }

    start(){
        // this.addGo(new GO({
        //     position: this.sceneCenter,
        //     size: new V2(200, 200),
        //     img: createCanvas(new V2(20,20), (ctx, size)=> {
        //         let pp = new PP({ context: ctx });
        //         ctx.fillStyle = '#00FF00';
        //         pp.line(0, size.y/2, size.x, 0)
        //     })
        // }));

        this.mainGo = this.addGo(new EditorGO({
            position: this.sceneCenter
        }));

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper',
            renderCallback: this.renderModel.bind(this)
        })

        
    }

    renderModel(model){
        console.log(model);

        let {general} = model;

        this.mainGo.img = createCanvas(general.size, (ctx, size) => {

        });

        this.mainGo.size = general.size.mul(general.zoom);
        this.mainGo.needRecalcRenderProperties = true;
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

