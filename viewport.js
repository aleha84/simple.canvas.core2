SCG.viewport = {
    logical: undefined, // in scene space
    real: undefined, //in browser pixels
    __scale: {
        original: 1,
        withZoom: 1
    },
    get scale () {
        if(this.__scale.withZoom === undefined)
            this.__scale.withZoom = this.__scale.original*this.zoom.current;

        return this.__scale.withZoom;
    },
    set scale (value) {
        this.__scale.original = value;
        this.__scale.withZoom = value*this.zoom.current;
        SCG.scenes.setNeedRecalcRenderProperties();
    },
    //scale: 1, // difference beetween logical and real
    zoom: {
        current: 1,
		step: 0.75,
		max: 3.1604938271604937,
        min: 0.5625,
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

            if(direction > 0){ //+
				if(vp.zoom.current == vp.zoom.max)
				{
					return;
				}
				vp.zoom.current /= vp.zoom.step;
				SCG.contexts['main'].scale(4/3,4/3);
			}
			else if(direction < 0) // -
			{
				if(vp.zoom.current == vp.zoom.min)
				{
					return;
				}
				vp.zoom.current *= vp.zoom.step;
				SCG.contexts['main'].scale(0.75,0.75);					
            }
            
            vp.graphInit();
            return;
            // let vp = SCG.viewport;
            // let updateLogical = false;
            // let zoomedSize = undefined;
            // let currentZoom = undefined;
            // if(direction === 0){
            //     if(vp.zoom.current !== vp.zoom.original)
            //     {
            //         vp.zoom.current = vp.zoom.original;
            //         zoomedSize = vp.logical.originalLogical.clone();
            //         updateLogical = true;
            //     }
            // }
            // else {
            //     if(direction > 0){
            //         currentZoom = vp.zoom.current+vp.zoom.step;
            //         currentZoom = currentZoom.toFixedFast(1);
            //         if(currentZoom > vp.zoom.max)
            //         {
            //             currentZoom = vp.zoom.max
            //         }
            //         else {
            //             zoomedSize = vp.originalLogical.size.mul((vp.zoom.original-Math.abs(currentZoom - vp.zoom.original)).toFixedFast(1));
            //             updateLogical = true;
            //         }
            //     }
            //     else {
            //         currentZoom = vp.zoom.current-vp.zoom.step;
            //         currentZoom = currentZoom.toFixedFast(1);
            //         if(currentZoom < vp.zoom.min)
            //         {
            //             currentZoom = vp.zoom.min
            //         }
            //         else {
            //             zoomedSize = vp.originalLogical.size.mul((vp.zoom.original+Math.abs(currentZoom - vp.zoom.original)).toFixedFast(1));
            //             updateLogical = true;
            //         }
            //     }
            // }

            // if(!updateLogical || zoomedSize.x > SCG.scenes.activeScene.space.x || zoomedSize.y > SCG.scenes.activeScene.space.y){
            //     return;
            // }   

            // if(updateLogical){
            //     vp.zoom.current = currentZoom;
            //     vp.__scale.withZoom = undefined;

            //     let prevSize = vp.logical.size.clone();
            //     let topLeft =  vp.shift.add(new V2(Math.abs(prevSize.x - zoomedSize.x)/2, Math.abs(prevSize.y - zoomedSize.y)/2).mul(direction < 0 ? -1 : 1));
    
            //     vp.logical.size = zoomedSize;
            //     vp.camera.updatePosition(topLeft);
    
            //     //SCG.scenes.setNeedRecalcRenderProperties();
            // }
            
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
        
        let _scale = Math.min(ratioX, ratioY);

        if(_scale < 1)
            throw `window is to small (width: ${_width}, height: ${_height})`;

        this.real = new Box(new V2, new V2(this.logical.width * _scale, this.logical.height * _scale));
        
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