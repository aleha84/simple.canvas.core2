SCG.controls = {
    mouse: {
        state: {
            position: undefined,
            doClickCheck() {
                for(let i = 0; i < this.eventHandlers.click.length;i++){
                    let chGo = this.eventHandlers.click[i];

                    if(chGo.renderBox!=undefined 
                        && chGo.renderBox.isPointInside(this.position) 
                        && chGo.handlers != undefined 
                        && chGo.handlers.click != undefined 
                        && isFunction(chGo.handlers.click))
                    {
                        var clickResult = chGo.handlers.click.call(chGo);
                        if(clickResult && clickResult.preventBubbling){
                            break;
                        }
                    }
                }
            },
            eventHandlers: {
                click: []
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