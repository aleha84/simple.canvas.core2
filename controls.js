SCG.controls = {
    initialized: false,
    initialize() {
        if(this.initialized)
            return;

        this.clearEventsHandlers();
        this.initialized = true;
    },
    clearEventsHandlers() { // resetting properties of handlers to empty arrays
        this.mouse.state.eventHandlers = {
            click: [],
            move: [],
            up: [],
            down: []
        };

        this.mouse.state.UIEventsHandlers = {
            click: [],
            move: [],
            up: [],
            down: []
        };
    },  
    mouse: {
        state: {
            position: undefined,
            logicalPosition: undefined,
            moving: false,
            movingDirection: new V2(),
            movingDelta: new V2(),
            downTriggered: false,
            doEventCheck(event){
                if(!event)
                    return;

                if(this.UIEventsHandlers[event].length > 0 && !this.doEventCheckByLayer(this.UIEventsHandlers[event], event)){
                    return;
                }  

                for(let layerIndex = this.eventHandlers[event].length-1;layerIndex>=0;layerIndex--){
                    let eventLayer = this.eventHandlers[event][layerIndex];

                    if(!this.doEventCheckByLayer(eventLayer, event)){
                        return;
                    }  
                }
            },
            doEventCheckByLayer(eventLayer, event) {
                if(eventLayer === undefined || event === undefined)
                    return true;

                for(let i = 0; i < eventLayer.length;i++){
                    let chGo = eventLayer[i];

                    if(chGo.renderBox!=undefined 
                        && chGo.isVisible
                        && chGo.renderBox.isPointInside(this.position) 
                        && chGo.handlers != undefined 
                        && chGo.handlers[event] != undefined 
                        && isFunction(chGo.handlers[event]))
                    {
                        var eventResult = chGo.handlers[event].call(chGo);
                        if(eventResult && eventResult.preventDiving){
                            return false;
                        }

                        break;
                    }
                }

                return true;
            },
            doClickCheck() {
                if(this.UIEventsHandlers.click.length > 0 && !this.doClickCheckByLayer(this.UIEventsHandlers.click)){
                    return;
                }  

                for(let layerIndex = this.eventHandlers.click.length-1; layerIndex >= 0;layerIndex--){
                    let clickLayer = this.eventHandlers.click[layerIndex];

                    if(!this.doClickCheckByLayer(clickLayer)){
                        return;
                    }
                }
            },
            doClickCheckByLayer(clickLayer) {
                if(clickLayer === undefined)
                    return true;

                for(let i = 0; i < clickLayer.length;i++){
                    let chGo = clickLayer[i];

                    if(chGo.renderBox!=undefined 
                        && chGo.isVisible
                        && chGo.renderBox.isPointInside(this.position) 
                        && chGo.handlers != undefined 
                        && chGo.handlers.click != undefined 
                        && isFunction(chGo.handlers.click))
                    {
                        var clickResult = chGo.handlers.click.call(chGo);
                        if(clickResult && clickResult.preventDiving){
                            return false;
                        }

                        break;
                    }
                }

                return true;
            },
            eventHandlers: {
            },
            UIEventsHandlers: {
            }
        },
        up(event) {
            this.getEventAbsolutePosition(event);

            this.state.doEventCheck('up');
            if(!this.state.moving)
            {
                this.state.doClickCheck();
            }

            this.state.moving = false;
            this.state.downTriggered = false;
            

            if(SCG.scenes.activeScene.events.up)
                SCG.scenes.activeScene.events.up();

            event.preventDefault();
        },
        down(event) {
            this.getEventAbsolutePosition(event);

            this.state.doEventCheck('down');

            if(SCG.scenes.activeScene.events.down)
                SCG.scenes.activeScene.events.down();

            this.state.downTriggered = true;

            event.preventDefault();
        },
        move(event) {
            let prevPosition = undefined;
            if(this.state.position != undefined)
                prevPosition = this.state.position.clone();

            this.getEventAbsolutePosition(event);

            this.state.doEventCheck('move');

            if(SCG.scenes.activeScene.events.move)
                SCG.scenes.activeScene.events.move();

            let vp = SCG.viewport;
            if( // drag logics
                vp.scrollOptions.enabled 
                && vp.scrollOptions.type === vp.scrollTypes.drag 
                && prevPosition != undefined
                && this.state.downTriggered
            ){
                let delta =prevPosition.substract(this.state.position);
                if(!delta.equal(new V2())){
                    this.state.moving = true;
                    vp.camera.updatePosition(SCG.viewport.shift.add(delta.division(vp.scale)));
                }
            }

            event.preventDefault();
        },
        out(event) {
            this.getEventAbsolutePosition(event);

            this.state.moving = false;
            this.state.downTriggered = false;

            event.preventDefault();
        },
        scroll(event) {
            SCG.viewport.camera.updateZoom(event.wheelDelta);
            // if(event.wheelDelta >= 0){
            //     SCG2.gameControls.scale.change(1);
            // }else{
            //     SCG2.gameControls.scale.change(-1);
            // }
        },
        getEventAbsolutePosition(event) {
            var eventPos = pointerEventToXY(event);
            this.state.position = new V2(eventPos.x - SCG.canvases.ui.margins.left,eventPos.y - SCG.canvases.ui.margins.top);
            this.state.logicalPosition = this.state.position.division(SCG.viewport.scale);
        }
    },
}