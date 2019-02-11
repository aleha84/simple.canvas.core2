class EditorScene extends Scene {
    constructor(options = {}){
        options = assignDeep({}, {
            image: {
                general: {
                    originalSize: new V2(10, 10),
                    zoom: 1,
                }
            }
        }, options);

        super(options)
    }

    start(){
        this.addGo(new GO({
            position: this.sceneCenter,
            size: new V2(200, 200),
            img: createCanvas(new V2(20,20), (ctx, size)=> {
                let pp = new PP({ context: ctx });
                ctx.fillStyle = '#00FF00';
                pp.line(0, size.y/2, size.x, 0)
            })
        }));

        this.editor = new Editor({
            parentElementSelector: '.controlsWrapper'
        })
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