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

    return controls;

}