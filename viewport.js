SCG.viewport = {
    logical: undefined, // in scene space
    real: undefined, //in browser pixels
    __scale: {
        original: 1,
        withZoom: 1
    },
    get scale () {
        if(this.__scale.withZoom === undefined)
            this.__scale.withZoom = this.__scale.original;
        //    this.__scale.withZoom = this.__scale.original*this.zoom.current;

        return this.__scale.withZoom;
    },
    set scale (value) {
        this.__scale.original = value;
        this.__scale.withZoom = this.__scale.original;//value*this.zoom.current;
        SCG.scenes.setNeedRecalcRenderProperties();
    },
    //scale: 1, // difference beetween logical and real
    zoom: {
        default: 1,
        current: 1,
		step: 0.75,
		max: 2,
        min: -2,
        currentStep: 0
    }, // zoom for logical
    shift: new V2, // in scene space from top left corner
    scrollOptions: {
        enabled: false,
        zoomEnabled: false,
        restrictBySpace: true
    },
    scrollTypes: {
        drag: 1,
        borders: 2
    },
    camera: {
        updateZoom(direction){
            let vp = SCG.viewport;
            if(!vp.scrollOptions.zoomEnabled)
                return;

            let zoomedLogicalSize = undefined;                
            if(direction > 0){ //+ zoom-in
				if(vp.zoom.currentStep+1 > vp.zoom.max)
				{
					return;
                }
                vp.zoom.currentStep++;
                vp.zoom.current /= vp.zoom.step;
                zoomedLogicalSize = new V2(vp.logical.width*vp.zoom.step, vp.logical.height*vp.zoom.step);
			}
			else if(direction < 0) // - zoom-out
			{
				if(vp.zoom.currentStep-1 < vp.zoom.min)
				{
					return;
                }
                vp.zoom.currentStep--;
                zoomedLogicalSize = new V2(vp.logical.width/vp.zoom.step, vp.logical.height/vp.zoom.step);
				vp.zoom.current *= vp.zoom.step;					
            }

            let center = vp.logical.center.clone();
            let shift = new V2(center.x - (zoomedLogicalSize.x/2), center.y - (zoomedLogicalSize.y/2));
            vp.logical.update(shift, zoomedLogicalSize);
            vp.graphInit();
            vp.camera.updatePosition(shift);
        },
        updatePosition(shift) {
            let vp = SCG.viewport;

            if(shift === undefined)
                shift = new V2();
                
            if(vp.scrollOptions.restrictBySpace){
                if(shift.x < 0) 
                    shift.x = 0;
                if(shift.y < 0)
                    shift.y = 0;
                if((shift.x+vp.logical.width) > SCG.scenes.activeScene.space.x)
                    shift.x = SCG.scenes.activeScene.space.x-vp.logical.width;
                if((shift.y+vp.logical.height) > SCG.scenes.activeScene.space.y)
                    shift.y = SCG.scenes.activeScene.space.y-vp.logical.height;
            }

            vp.shift = shift;
            vp.logical.update(vp.shift, vp.logical.size);
            
            if(vp.scrollOptions.updatePositionsCallBack && isFunction(vp.scrollOptions.updatePositionsCallBack))
                vp.scrollOptions.updatePositionsCallBack();

            SCG.scenes.setNeedRecalcRenderProperties();
        }
    },
    graphInit() { 
        // if(!window.matchMedia("(orientation: landscape)").matches) {
        //     // todo show message - wrongDeviceOrientation
        //     throw 'wrong device orientation - portrait';
        // }
            
        if(!SCG.globals.parentElement)
            return;

        let _width = SCG.globals.parentElement.clientWidth;
		let _height = SCG.globals.parentElement.clientHeight; 
		let ratioX = _width /this.logical.width;
        let ratioY = _height / this.logical.height; 
        
        let _scale = Math.min(ratioX, ratioY);

        if(_scale < 0.5)
            throw `window is to small (width: ${_width}, height: ${_height})`;

        _scale = fastRoundWithPrecision(_scale, 1);

        this.real = new Box(new V2, new V2(fastRoundWithPrecision(this.logical.width * _scale), fastRoundWithPrecision(this.logical.height * _scale)));
        
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

        this.scale = _scale;

        for(let canvasName of ['background', 'main', 'ui']) 
            setCanvasProperties(canvasName, mTop, mLeft);

        SCG.scenes.activeScene.backgroundRender();

        SCG.scenes.setNeedRecalcRenderProperties();
        
        if(SCG.UI)
            SCG.UI.invalidate();
    }
}