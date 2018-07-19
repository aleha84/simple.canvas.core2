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
            text: GO.getTextPropertyDefaults('sample'),
            format: undefined
        }, options);

        options.isStatic = true;

        super(options);
    }

    internalPreUpdate(now){
        if(this.format){
            var args = this.format.argsRetriever ? this.format.argsRetriever() : this.format.arguments;
            this.text.value = String.format(this.format.format, args);
        }
    }
}

class UIButton extends GO {
    constructor(options = {}){

        if(options.click && isFunction(options.click)){
            if(!options.handlers)
                options.handlers = {}

            options.handlers.click = options.click;
            delete options.click;
        }

        options = assignDeep({}, {
            contextName: 'ui',
            text: GO.getTextPropertyDefaults('btn'),
            handlers: {
                click: () => { console.log('Button empty click handler'); }
            }
        }, options);

        if(!options.imgPropertyName && !options.img){
            let innerCanvas = document.createElement('canvas');
            innerCanvas.width = options.size.x;
            innerCanvas.height = options.size.y;
            let innerCtx = innerCanvas.getContext('2d');
            innerCtx.fillStyle="#CCCCCC";
            innerCtx.fillRect(0,0,innerCanvas.width,innerCanvas.height);
            innerCtx.lineWidth = innerCanvas.width*0.05;
            innerCtx.strokeStyle = '#DEDEDE';
            innerCtx.beginPath();
            innerCtx.moveTo(0, innerCanvas.height);
            innerCtx.lineTo(0, 0);
            innerCtx.lineTo(innerCanvas.width, 0);
            innerCtx.stroke();

            innerCtx.strokeStyle = '#AAAAAA';
            innerCtx.beginPath();
            innerCtx.moveTo(0, innerCanvas.height);
            innerCtx.lineTo(innerCanvas.width, innerCanvas.height);
            innerCtx.lineTo(innerCanvas.width, 0);
            innerCtx.stroke();

            options.img = innerCanvas;
        }


        options.isStatic = true; 
        super(options);
    }
}