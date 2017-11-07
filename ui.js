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

        // SCG.UI.createInnerCanvas(this);
    }

    // internalUpdate(now){
    //     let icc = this.innerCanvasContext;
	// 	let size = this.size;
	// 	let text = this.text;
	// 	icc.clearRect(0, 0, size.x, size.y);
	// 	icc.font = `${text.size}px ${text.font}`;
	// 	icc.fillStyle = text.color;
	// 	let value = text.value;
	// 	icc.textAlign = text.align;
	// 	icc.textBaseline = text.textBaseline;

    //     if(this.debug){
    //         if(this.redrawCounter === undefined)
    //             this.redrawCounter = 0;
            
    //         value = this.redrawCounter++;

    //         text.border = true;
    //         var textMetrics = icc.measureText(value);
    //         if(textMetrics.width > size.x){
    //             icc.strokeStyle = '#ff0000';
    //         }
    //         else {
    //             icc.strokeStyle = '#00ff00';
    //         }
    //     }
            
	// 	if(text.border){
	// 		icc.rect(1,1,this.size.x-1,this.size.y-1);
	// 		icc.stroke();	
    //     }
        
    //     icc.fillText(value, this.size.x/2,this.size.y/2);
    // }
}