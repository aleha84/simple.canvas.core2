SCG.viewport = {
    logical: undefined, // in scene space
    real: undefined, //in browser pixels
    scale: 1, // difference beetween logical and real
    zoom: 1, // zoom for logical
    shift: new V2, // in scene space from top left corner
    camera: {
        update(now) {

        }
    },
    graphInit() { 
        if(!window.matchMedia("(orientation: landscape)").matches) {
            // todo show message - wrongDeviceOrientation
            throw 'wrong device orientation - portrait';
        }
            
        if(!SCG.globals.parentElement)
            return;

        let _width = SCG.globals.parentElement.clientWidth;
		let _height = SCG.globals.parentElement.clientHeight; 
		let ratioX = _width /this.logical.width;
        let ratioY = _height / this.logical.height; 
        
        this.scale = Math.min(ratioX, ratioY);

        if(this.scale < 1)
            throw `window is to small (width: ${_width}, height: ${_height})`;

        this.real = new Box(new V2, new V2(this.logical.width * this.scale, this.logical.height * this.scale));
        
        let mTop = 0;
		let mLeft = 0;
		if(this.real.width < _width)
            mLeft = Math.round((_width - this.real.width)/2);
		else if(this.real.height < _height)
            mTop = Math.round((_height - this.real.height)/2);

        let setCanvasProperties = (canvasName, mTop, mLeft) => {
            let canvas = SCG.canvases[canvasName];
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

            SCG.contexts[canvasName].imageSmoothingEnabled = false;
        }

        for(let canvasName of ['background', 'main', 'ui']) 
            setCanvasProperties(canvasName, mTop, mLeft);

        SCG.scenes.activeScene.backgroundRender();

        for(let layerIndex = 0; layerIndex < SCG.scenes.activeScene.goLayers.length; layerIndex++){ 
            if(SCG.scenes.activeScene.goLayers[layerIndex] === undefined)
                continue;
                
            for(let goi = 0; goi <  SCG.scenes.activeScene.goLayers[layerIndex].length; goi++){ // force recalculate go render params
                SCG.scenes.activeScene.goLayers[layerIndex][goi].needRecalcRenderProperties = true;
            }
        }
        
        if(SCG.UI)
            SCG.UI.invalidate();
    }
}