components.layersHelpers = {
    createLayerHelpersPanel() {
        var controls = [];

        let layerHelpersPanelPosition = new V2(750,20);

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

        let changeVisibilityGroupsInLayerButton = htmlUtils.createElement('input', { 
            value: 'Groups vis.', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    components.layersHelpers.changeVisibilityGroupsInLayer();
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

        let findColorButton = htmlUtils.createElement('input', { 
            value: 'Find clr', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    let { editor } = components.editorContext;
                    
                    if(editor.panels.findColor){
                        editor.panels.findColor.remove();
                    }
                    else {
                        editor.panels.findColor = components.createDraggablePanel({
                            title: 'Find color', 
                            parent: document.body, 
                            position: editor.panels.lastPositions.findColor || layerHelpersPanelPosition.add(new V2(0, 80)), 
                            closable: true,
                            expandable: false,
                            contentWidth: 150,
                            onClose: () => { editor.panels.findColor = undefined; },
                            onMove: (nextPosition) => {
                                editor.panels.lastPositions.findColor = nextPosition;
                             },
                            contentItems: [
                                components.layersHelpers.createFindColor()
                            ]
                        });
                    }
                }
            }
        })

        let findNearestColorsButton = htmlUtils.createElement('input', { 
            value: 'Find near clrs', 
            attributes: { type: 'button' }, 
            events: {
                click: () => {
                    let { editor } = components.editorContext;
                    
                    if(editor.panels.findNearestColors){
                        editor.panels.findNearestColors.remove();
                    }
                    else {
                        editor.panels.findNearestColors = components.createDraggablePanel({
                            title: 'Find nearest color', 
                            parent: document.body, 
                            position: editor.panels.lastPositions.findNearestColors || layerHelpersPanelPosition.add(new V2(20, 80)), 
                            closable: true,
                            expandable: false,
                            contentWidth: 150,
                            onClose: () => { editor.panels.findNearestColors = undefined; },
                            onMove: (nextPosition) => {
                                editor.panels.lastPositions.findNearestColors = nextPosition;
                             },
                            contentItems: [
                                components.layersHelpers.createFindNearestColors()
                            ]
                        });
                    }
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
        controls.push(findColorButton);
        controls.push(findNearestColorsButton);
        controls.push(changeVisibilityGroupsInLayerButton);

        components.editorContext.editor.panels.layersHelpers = components.createDraggablePanel({
            title: 'Layer helpers', 
            parent: document.body, 
            position: layerHelpersPanelPosition, 
            closable: false,
            expandable: true,
            contentWidth: [100,350],
            onClose: () => { context.editor.panels.layersHelpers = undefined; },
            contentItems: controls
        });
    },
    changeVisibilityGroupsInLayer() {
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
        let groupVisibilityState = {};
        let checkAll =true;
        let availableGroups = htmlUtils.createElement('div', { className: 'availableGroups', 
            children:  [
                htmlUtils.createElement('div', { classNames: ['rowFlex', 'availableGroupsItem', 'selectAll'], children: [
                    components.createCheckBox(checkAll, '', (state) => {
                        checkAll = !checkAll;
                        layer.groups.forEach(g => {
                            groupVisibilityState[g.id] = {
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
                htmlUtils.createElement('div', { classNames: ['availableGroupsItemWrapper'], children: [
                    ...layer.groups.map(group => 
                        htmlUtils.createElement('div', { classNames: ['rowFlex', 'availableGroupsItem'], children: [
                            components.createCheckBox(group.visible, '', (state) => {
                                groupVisibilityState[group.id] = {state, group};
                            },
                            { classNames: ['rowFlex'] }),
                            htmlUtils.createElement('span', { text: `${group.id}` }),
                            htmlUtils.createElement('div', { className: 'paletteItem', styles: {  backgroundColor: group.strokeColor }})
                        ] })
                    )
                ]}),
                ]
        })

        let contentHolder = htmlUtils.createElement('div', { className: '', children: [
            htmlUtils.createElement('p', { className: '', text: `Select groups in layer: ${layer.name || layer.id}`}),
            availableGroups
        ] });

        components.overlay.create({
            content: contentHolder, 
            containerClassName: 'changeVisibilityGroupsInLayer', 
            okCallback() {
                for(let key in groupVisibilityState) {
                    //console.log(key, groupVisibilityState[key]);
                    groupVisibilityState[key].group.visible = groupVisibilityState[key].state
                }

                console.log(groupVisibilityState)
                layer.removeImage();
                components.resetGroups();
            }
        })
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
                htmlUtils.createElement('div', { classNames: ['availableGroupsItemWrapper'], children: [
                    ...layer.groups.map(group => 
                        htmlUtils.createElement('div', { classNames: ['rowFlex', 'availableGroupsItem'], children: [
                            components.createCheckBox(false, '', (state) => {
                                groupCleaningState[group.id] = {state, group};
                            },
                            { classNames: ['rowFlex'] }),
                            htmlUtils.createElement('span', { text: `${group.id} (${group.points.length})` }),
                            htmlUtils.createElement('div', { className: 'paletteItem', styles: {  backgroundColor: group.strokeColor }})
                        ] })
                    )
                ]})
            ]
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

    },
    createFindColor() {
        let container = htmlUtils.createElement('div');

        let { main, general } = components.editorContext.image;
        if(general.animated){
            main = main[general.currentFrameIndex];
        }

        let result = [];
        let colorPicker = components.createColorPicker('#FFFFFF', 'C1', (_color) => {
            let colorLowered = _color.toLowerCase();
            result = [];
            main.layers.forEach(l => {
                if(l.id.startsWith('nearestColors') || l.id.startsWith('generated'))
                    return;

                l.groups.forEach(g => {
                    if(g.strokeColor.toLowerCase() == colorLowered || g.fillColor.toLowerCase() == colorLowered) {
                        result.push({
                            id: result.length,
                            layerId: l.id,
                            layerName: l.name,
                            groupId: g.id,
                            color: colorLowered
                        });
                    }
                })
            })

            //console.log(result);

            this.select.innerHTML = '';

            this.select.options[this.select.options.length] = new Option('', -1);

            for(let item of result){
                let op = new Option(`${item.layerName || item.layerId} - ${item.groupId}`, item.id);        
                this.select.options[this.select.options.length] = op;
            }

            htmlUtils.setAttributes(this.select, { size: (result.length > 5 ? 5 : result.length)+1 });
        })

        this.select = htmlUtils.createElement('select', { attributes: { size: 0 }, events: {
            keypress: function(e) {
                e.preventDefault();
                e.stopPropagation();
            },
            change: function(e) { 
            {
                console.log(e.target.value)
                let index = parseInt(e.target.value);

                if(Number.isNaN(index))
                    notifications.error('Wrong index: ' + e.target.value, 2000);

                
                if(index < 0)
                    return;

                let foundColorData = result[index]
                let layerSelect = document.querySelector('.layers select');
                layerSelect.value = foundColorData.layerId;
                layerSelect.dispatchEvent(new CustomEvent('change'));
 
                let groupSelect = document.querySelector('.groups select');
                groupSelect.value = foundColorData.groupId;
                groupSelect.dispatchEvent(new CustomEvent('change'))
                // setTimeout(function() {
                    
                // }, 1)
            }
         }
        } });

        container.appendChild(colorPicker);
        container.appendChild(this.select);

        return container;
    },
    createFindNearestColors() {
        let container = htmlUtils.createElement('div');

        let { main, general } = components.editorContext.image;
        if(general.animated){
            main = main[general.currentFrameIndex];
        }

        let result = [];
        let possibleValueShift = 10;
        
        let colorPicker = components.createColorPicker('#FFFFFF', 'C1', (_color) => {
            let colorRgb = colors.colorTypeConverter({ value: _color, fromType: 'hex', toType: 'rgb' })
            result = [];
            main.layers.forEach(l => {
                if(l.id.startsWith('nearestColors') || l.id.startsWith('generated'))
                    return;

                l.groups.forEach(g => {
                    if(g.groupType == 'gradient')
                        return;
                    
                    let cc = colors.colorTypeConverter({ value: g.strokeColor, fromType: 'hex', toType: 'rgb' })
                    if(
                        Math.abs(colorRgb.r-cc.r) < possibleValueShift &&
                        Math.abs(colorRgb.g-cc.g) < possibleValueShift &&
                        Math.abs(colorRgb.b-cc.b) < possibleValueShift
                    ) {
                        result.push(cc)
                    }
                })
            })

            console.log(result);

            if(result.length == 0){
                notifications.warning('No nearest colors found', 2000);
                return;
            }

            paletteHelper.generatePalette({ rgbData: result, layerName: 'nearestColors', position: new V2(general.originalSize).divide(2).toInt() });
        })

        let valueShift = htmlUtils.createElement('input', { value: possibleValueShift, attributes: { type: 'number', min: "1" },
        events: {
            change: (event) => {
                possibleValueShift = event.target.value;
            }
        } });

        container.appendChild(colorPicker);
        container.appendChild(valueShift);

        return container;
    }
}