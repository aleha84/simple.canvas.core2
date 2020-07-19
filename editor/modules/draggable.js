components.draggable = {
    init(context) {
        this.context = context;
    },

    createColorPicker: function(){

        if(this.context.editor.panels.colorPicker){
            this.context.editor.panels.colorPicker.remove();
        }
        else {
            this.context.editor.mode.toggleColorPicker();
            this.context.updateEditor();

            let cp = components.createDraggablePanel({
                title: 'C picker', 
                parent: document.body, 
                position: this.context.editor.panels.lastPositions.colorPicker || new V2(40,60), 
                closable: true,
                expandable: false,
                contentWidth: 150,
                onClose: () => { 
                    this.context.editor.panels.colorPicker = undefined;
                    this.context.editor.mode.toggleColorPicker();
                    this.context.updateEditor();
                 },
                 onMove: (nextPosition) => {
                    this.context.editor.panels.lastPositions.colorPicker = nextPosition;
                 },
                contentItems: [
                    components.createSceneColorPicker()
                ]
            });

            this.context.editor.panels.colorPicker = cp;

            cp.setValue = (value) => {
                cp.contentItems[0].setValue(value);
            }
        }
    }
}