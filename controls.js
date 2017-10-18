SCG.controls = {
    clearEventsHandlers() { // resetting properties of handlers to empty arrays
        this.mouse.state.eventHandlers = {
            click: []
        }
    },  
    mouse: {
        state: {
            position: undefined,
            doClickCheck() {
                for(let layerIndex = this.eventHandlers.click.length-1; layerIndex >= 0;layerIndex--){
                    let clickLayer = this.eventHandlers.click[layerIndex];

                    for(let i = 0; i < clickLayer.length;i++){
                        let chGo = clickLayer[i];
    
                        if(chGo.renderBox!=undefined 
                            && chGo.renderBox.isPointInside(this.position) 
                            && chGo.handlers != undefined 
                            && chGo.handlers.click != undefined 
                            && isFunction(chGo.handlers.click))
                        {
                            var clickResult = chGo.handlers.click.call(chGo);
                            if(clickResult && clickResult.preventBubbling){
                                return;
                            }

                            break;
                        }
                    }
                }
            },
            eventHandlers: {
            }
        },
        up(event) {
            this.getEventAbsolutePosition(event);
            this.state.doClickCheck();

            event.preventDefault();
        },
        getEventAbsolutePosition(event) {
            var eventPos = pointerEventToXY(event);
            this.state.position = new V2(eventPos.x - SCG.canvases.ui.margins.left,eventPos.y - SCG.canvases.ui.margins.top);
        }
    },
}