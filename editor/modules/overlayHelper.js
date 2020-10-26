components.overlay = {
    create({ content, containerClassName, okCallback, addOk = true, closeCallback }) {
        if(!content){
            notifications.error('Nothing to add to overlay!',2000);
            return;
        }

        components.editorContext.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
        let containerEl = htmlUtils.createElement('div', { classNames: ['content', containerClassName] });
        containerEl.appendChild(content);
        
        if(addOk) {
            containerEl.appendChild(htmlUtils.createElement('input', { value: 'Ok', attributes: { type: 'button' }, events: {
                click: function(){
                    if(okCallback) {
                        okCallback();
                    }
                    
                    components.editorContext.controls.removeOverlay();
                    return;
                }
            } }))
        }

        containerEl.appendChild(htmlUtils.createElement('input',{
            value: 'Close', className:'close', attributes: { type: 'button' }, events: {click: function() {
                if(closeCallback) {
                    closeCallback();
                }

                components.editorContext.controls.removeOverlay();
            }}
        }))

        components.editorContext.controls.overlayEl.appendChild(containerEl);
        components.editorContext.parentElement.appendChild(components.editorContext.controls.overlayEl);
    }
}