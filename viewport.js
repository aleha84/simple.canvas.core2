SCG.viewport = {
    logical: new Box, // in scene space
    real: new Box, //in browser pixels
    scale: 1, // difference beetween logical and real
    zoom: 1, // zoom for logical
    shift: new V2, // in scene space from top left corner
    camera: {
        update(now) {

        }
    },
    graphInit() { 
        if(!window.matchMedia("(orientation: landscape)").matches)
            throw 'wrong device orientation - portrait';

        var _width = SCG.globals.parentElement.clientWidth;
		var _height = SCG.globals.parentElement.clientHeight; 
		var ratioX = _width /this.logical.width;
        var ratioY = _height / this.logical.height; 
        
        this.scale = Math.min(ratioX, ratioY);

        if(scale.times < 1)
            throw `window is to small (width: {_width}, height: {_height})`;

        this.real = new Box(new V2, new V2(this.logical.width * scale.times, this.logical.height * scale.times));
        
        var mTop = 0;
		var mLeft = 0;
		if(this.real.width < _width)
            mLeft = Math.round((_width - this.real.width)/2);
		else if(this.real.height < _height)
            mTop = Math.round((_height - this.real.height)/2);

        let setCanvasProperties = (canvas, mTop, mLeft) => {
            setAttributes(
                canvas, 
                {
                    width: this.real.width,
                    height: this.real.height,
                    css: {
                        width:this.real.width+'px',
                        height:this.real.height+'px',
                        'margin-top': mTop+'px',
                        'margin-left': mLeft+'px'
                    }
                }
            );
    
            canvas.width = this.real.width;
            canvas.height = this.real.height;
            canvas.margins = {
                top : mTop,
                left: mLeft
            }
        }

        for(let canvasName of ['background', 'main', 'ui'])
            setCanvasProperties(SCG.canvases[canvasName], mTop, mLeft)

        SCG.scenes.activeScene.backgroundRender();

        if(SCG.UI)
            SCG.UI.invalidate();
    }
}