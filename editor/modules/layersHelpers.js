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

        let cleanGroupsInLayerButton = htmlUtils.createElement('input', { 
            value: 'Clean groups', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    components.layersHelpers.cleanGroupsInLayer();
                }
            }
        })

        let cleanBackgroundImgButton = htmlUtils.createElement('input', { 
            value: 'Clean BG', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    SCG.scenes.activeScene.underlyingImg.img = undefined;
                }
            }
        })

        let bgToLayerButton = htmlUtils.createElement('input', { 
            value: 'BG to Layer', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    let uimg = SCG.scenes.activeScene.underlyingImg.img;
                    if(uimg == undefined) {
                        notifications.error('No underlying image detected!', 2000);
                        return;
                    }

                    let { image: {main, general}, editor } = components.editorContext;
                    if(general.animated){
                        main = main[general.currentFrameIndex];
                    }

                    let imgPixels = getPixels(uimg, general.originalSize);

                    let colorsCache = {};
                    let rgbToHex = (rgb) => {
                        let key = rgb[0]*1000000 + rgb[1]*1000 + rgb[2];
                        if(!colorsCache[key]) {
                            colorsCache[key] = {
                                points: [],
                                hex: colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' })
                            } 
                        }
            
                        return colorsCache[key];
                    }

                    imgPixels.forEach(pixel => {
                        let ccItem = rgbToHex(pixel.color);
                        ccItem.points.push(pixel.position);
                    })

                    console.log(colorsCache);

                    let nextLayerId = `m_${main.currentLayerId++}`;
                    while(main.layers.filter(g => g.id == nextLayerId).length > 0){
                        nextLayerId = `m_${main.currentLayerId++}`;
                    }

                    let newLayer = modelUtils.createDefaultLayer(nextLayerId, main.layers.length);
                    newLayer.selected = true;

                    Object.values(colorsCache).forEach(item => {
                        let nextGroupId = `${newLayer.id}_g_${newLayer.currentGroupId++}`;
                        let group = modelUtils.createDefaultGroup(nextGroupId, 0);
                        group.strokeColor = item.hex;

                        item.points.forEach(p => {
                            let nextPointId = `${group.id}_p_${group.currentPointId++}`;

                            group.points.push({
                                id: nextPointId,
                                order: group.points.length,
                                point: {x: p.x, y: p.y},
                                selected: false
                            })
                        })

                        newLayer.groups.push(group);
                    })

                    main.layers.push(newLayer);

                    let select = document.querySelector('.layers select');
                    components.addLayerToSelect({layer: newLayer, select})
                }
            }
        })



        controls.push(moveCurrentGroupToAnotherLayerButton);
        controls.push(cleanGroupsInLayerButton);
        controls.push(bgToLayerButton);
        controls.push(cleanBackgroundImgButton);

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
    cleanGroupsInLayer() {
        let { groupId, layerId } = components.editorContext.editor.selected;

        if(layerId == undefined){
            notifications.error('No layer selected!', 2000);
            return;
        }

        let { main, general } = components.editorContext.image;
        if(general.animated){
            main = main[general.currentFrameIndex];
        }

        let layer = main.layers.find(l => l.id == layerId);

        let groupCleaningState = {};
        let checkAll =false;
        let availableGroups = htmlUtils.createElement('div', { className: 'availableGroups', 
            children:  [
                htmlUtils.createElement('div', { classNames: ['rowFlex', 'availableGroupsItem', 'selectAll'], children: [
                    components.createCheckBox(false, '', (state) => {
                        checkAll = !checkAll;
                        layer.groups.forEach(g => {
                            groupCleaningState[g.id] = {
                                state: checkAll,
                                group: g
                            }
                        })

                        document.querySelectorAll('.availableGroupsItem:not(.selectAll) input[type=checkbox]').forEach(el => 
                        {
                            htmlUtils.setProps(el, { checked: checkAll })
                        });
                    },
                    { classNames: ['rowFlex'] }),
                    htmlUtils.createElement('span', { text: 'All' })
                ]}),
                ...layer.groups.map(group => 
                htmlUtils.createElement('div', { classNames: ['rowFlex', 'availableGroupsItem'], children: [
                    components.createCheckBox(false, '', (state) => {
                        groupCleaningState[group.id] = {state, group};
                    },
                    { classNames: ['rowFlex'] }),
                    htmlUtils.createElement('span', { text: `${group.id} (${group.points.length})` }),
                    htmlUtils.createElement('div', { className: 'paletteItem', styles: {  backgroundColor: group.strokeColor }})
                ] })
            )]
        })
        
        
        let contentHolder = htmlUtils.createElement('div', { className: '', children: [
            htmlUtils.createElement('p', { className: '', text: `Select groups in layer: ${layer.name || layer.id}`}),
            availableGroups
        ] });

        components.overlay.create({
            content: contentHolder, 
            containerClassName: 'cleanGroupsInLayer', 
            okCallback() {

                
                for(let key in groupCleaningState) {
                    //console.log(key, groupCleaningState[key]);
                    if(groupCleaningState[key].state) {
                        groupCleaningState[key].group.points = [];
                    }
                }

                console.log(groupCleaningState)
                layer.removeImage();
                components.resetGroups();
            }
        })
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