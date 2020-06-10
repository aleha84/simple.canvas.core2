components.createUIControls = function(context){
    var controls = [];

    let modeSwitchButton = htmlUtils.createElement('input', { 
        value: 'Toggle mode', 
        attributes: { type: 'button' }, 
        events: {
            click: () => {
                if(!context.editor.selected.layerId || !context.editor.selected.groupId){
                    notifications.warning("No layer or group selected", 1000);
                    return;
                }

                context.editor.mode.toggle();
                context.updateEditor();
            }
        }
    })

    let removementModeSwitchButton = htmlUtils.createElement('input', { 
        value: 'Toggle REM', 
        attributes: { type: 'button' }, 
        events: {
            click: () => {
                if(!context.editor.selected.layerId || !context.editor.selected.groupId){
                    notifications.warning("No layer or group selected", 1000);
                    return;
                }

                context.editor.mode.toggleRemovement();
                context.updateEditor();
            }
        }
    })

    controls.push(modeSwitchButton);
    controls.push(removementModeSwitchButton);

    ///return controls;

    context.editor.panels.uiControls = components.createDraggablePanel({
        title: 'UI controls', 
        parent: document.body, 
        position: new V2(450,20), 
        closable: false,
        expandable: false,
        contentWidth: 150,
        onClose: () => { context.editor.panels.uiControls = undefined; },
        contentItems: controls
    });
}