components.layersHelpers = {
    createLayerHelpersPanel() {
        var controls = [];

        let moveCurrentGroupToAnotherLayerButton = htmlUtils.createElement('input', { 
            value: 'Move group', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    components.layersHelpers.moveCurrentGroupToAnotherLayer();
                }
            }
        })

        controls.push(moveCurrentGroupToAnotherLayerButton);

        components.editorContext.editor.panels.layersHelpers = components.createDraggablePanel({
            title: 'Layer helpers', 
            parent: document.body, 
            position: new V2(750,20), 
            closable: false,
            expandable: true,
            contentWidth: 100,
            onClose: () => { context.editor.panels.layersHelpers = undefined; },
            contentItems: controls
        });
    },
    moveCurrentGroupToAnotherLayer() {
        let { groupId, layerId } = components.editorContext.editor.selected;
        if(layerId == undefined || groupId == undefined){
            notifications.error('No group or layer selected!', 2000);
            return;
        }

        let { main, general } = components.editorContext.image;
        if(general.animated){
            main = main[general.currentFrameIndex];
        }

        let titleTemplate = `Move group '${groupId}' from layer ${layerId} to `;
        let title = htmlUtils.createElement('p', { className: '', text: titleTemplate + 'not selected' })

        let contentHolder = htmlUtils.createElement('div', { className: '' });
        contentHolder.appendChild(title);

        let availableLayers = htmlUtils.createElement('div', { className: 'availableLayers' });
        let newLayerId = undefined;
        let layersElements = [];
        main.layers.forEach(layer => {
            let additionalClassName = '';
            let disabled = layer.id == layerId
            if(disabled){
                additionalClassName = 'disabled';
            }

            availableLayers.appendChild(htmlUtils.createElement('p', { classNames: ['layer', additionalClassName], text: layer.name || layer.id, 
            events: {
                click: (event) => {
                    newLayerId = undefined;
                    title.innerText = `Move group '${groupId}' from layer ${layerId} to ` + 'not selected';
                    layersElements.forEach(le => le.classList.remove("selected"))
                    if(disabled) {
                        notifications.warning('Current layer can\'t be selected', 2000);
                        return;
                    }

                    newLayerId = layer.id;
                    event.target.classList.add('selected')
                    title.innerText = `Move group '${groupId}' from layer ${layerId} to ` + (layer.name || layer.id);
                }
            }}));
        });
        
        layersElements = Array.from(availableLayers.children);

        contentHolder.appendChild(htmlUtils.createElement('p', { text: 'Current layers' }));
        contentHolder.appendChild(availableLayers);

        components.overlay.create({
            content: contentHolder, 
            containerClassName: 'moveToLayer', 
            okCallback: () => {
                let grpMovement = (main) => {
                    let targetLayer = main.layers.find(l => l.id == newLayerId);
                    targetLayer.removeImage();
                    let currentLayer = main.layers.find(l => l.id == layerId);
                    currentLayer.removeImage();
                    
                    let currentGroupIndex = currentLayer.groups.findIndex(g => g.id == groupId);
                    
                    if(currentGroupIndex == -1){
                        console.log(`No group with id: ${groupId} found in layer: ${newLayerId}. Skipped.`)
                        return;
                    }

                    let currentGroup = currentLayer.groups.splice(currentGroupIndex, 1)[0];
                    if(!currentGroup){
                        console.log(`No group with id: ${groupId} found in layer: ${newLayerId}. Skipped.`)
                        return;
                    }
    
                    targetLayer.groups.push(currentGroup);
                }

                if(newLayerId == undefined){
                    notifications.error('New layer is not selected!', 2000);
                    return;
                }

                if(general.animated){
                    let frames = components.editor.image.main;
                    for(let f = 0; f < frames.length; f++){
                        grpMovement(frames[f])
                    }
                }
                else {
                    grpMovement(main);
                }

                

                components.resetGroups();
            }
        })

    }
}