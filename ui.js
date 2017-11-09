SCG.UI = {
    invalidate() {
        if(!SCG.contexts.ui)
            return;

        SCG.contexts.ui.clearRect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);

		var as = SCG.scenes.activeScene;
		var i = as.ui.length;
		while (i--) {
            as.ui[i].needRecalcRenderProperties = true;
			as.ui[i].update();
			as.ui[i].render();
		}
    },
    createInnerCanvas(go) {
        if(!go)
            throw 'SCG.UI.createInnerCanvas -> No GO provided ';

        let canvas = document.createElement('canvas');
        canvas.width = go.size.x;
        canvas.height = go.size.y;

        go.innerCanvas = canvas;
        go.innerCanvasContext = canvas.getContext('2d');
        go.innerCanvasContext.imageSmoothingEnabled = false;
        go.img = go.innerCanvas;
    }
}

class UILabel extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            contextName: 'ui',
            size: new V2(50,10),
            debug: false,
            text: {
                value: 'sample',
                size: 20,
                color: 'black',
                border: false,
                align: 'center',
                font: 'Arial',
                textBaseline: 'middle'
            }
        }, options);

        options.isStatic = true;

        super(options);
    }
}