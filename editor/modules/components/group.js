components.createGroup = function(groupEl, groupProps, changeCallback){
    htmlUtils.removeChilds(groupEl);
    if(groupProps == undefined) {
        changeCallback();
        return;
    }

    groupEl.appendChild(htmlUtils.createElement('div', { text: groupProps.id }))

    let groupVisibilityEl = components.createCheckBox(groupProps.visible, 'Visible', function(value) {
        groupProps.visible = value;
        changeCallback();
    });

    groupEl.appendChild(groupVisibilityEl);

    components.editor.editor.toggleGroupVisibility = () => groupVisibilityEl.chk.click();

    groupEl.appendChild(this.createCheckBox(groupProps.clear, 'Clear', (value) =>{
        groupProps.clear = value;
        changeCallback();
    }));


    let strokeColor = this.createColorPicker(groupProps.strokeColor, 'Stroke color', (color) => {
        groupProps.strokeColor = color;
        changeCallback();
    });

    let strokeColorOpacityProps = {current: groupProps.strokeColorOpacity, max: 1, min: 0, step: 0.05, round: 2}
    let strokeColorOpacity = this.createRange(strokeColorOpacityProps, 'Opacity', 
            (el, value) => {
                groupProps.strokeColorOpacity = value;
                changeCallback()
            }
        )

    let fillColor = this.createColorPicker(groupProps.fillColor, 'Fill color', (color) => {
        groupProps.fillColor = color;
        changeCallback();
    });

    let fillColorOpacityProps = {current: groupProps.fillColorOpacity, max: 1, min: 0, step: 0.05, round: 2}
    let fillColorOpacity = this.createRange(fillColorOpacityProps, 'Opacity', 
            (el, value) => {
                groupProps.fillColorOpacity = value;
                changeCallback()
            }
        )

    groupEl.appendChild(htmlUtils.createElement('hr'));
    groupEl.appendChild(strokeColor);
    groupEl.appendChild(strokeColorOpacity);

    //обмен цвентов
    let colorsExchange = htmlUtils.createElement('div',  { classNames: ['colorsExchange', 'row'] });
    colorsExchange.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Colors exchange' }))
    colorsExchange.appendChild(htmlUtils.createElement('button', { text: '↓', attributes: {}, events: { 
        click: function() { 
            if(groupProps.fillColor == groupProps.strokeColor && groupProps.fillColorOpacity == groupProps.strokeColorOpacity)
                return;

            fillColor.cPicker.value = strokeColor.cPicker.value;
            fillColor.hexInput.value = strokeColor.hexInput.value;
            groupProps.fillColor = groupProps.strokeColor;
            groupProps.fillColorOpacity = groupProps.strokeColorOpacity;
            fillColorOpacity.range.value = groupProps.strokeColorOpacity;
            fillColorOpacity.label.innerText = groupProps.strokeColorOpacity;
            changeCallback();
         }
    } }))
    colorsExchange.appendChild(htmlUtils.createElement('button', { text: '↑', attributes: {}, events: { 
        click: function() { 
            if(groupProps.fillColor == groupProps.strokeColor && groupProps.fillColorOpacity == groupProps.strokeColorOpacity)
                return;
                
            strokeColor.cPicker.value = fillColor.cPicker.value;
            strokeColor.hexInput.value = fillColor.hexInput.value;
            groupProps.strokeColor = groupProps.fillColor;
            groupProps.strokeColorOpacity = groupProps.fillColorOpacity;
            strokeColorOpacity.range.value = groupProps.fillColorOpacity;
            strokeColorOpacity.label.innerText = groupProps.fillColorOpacity;
            changeCallback();
         }
    } }))

    groupEl.appendChild(colorsExchange);

    groupEl.appendChild(fillColor);
    groupEl.appendChild(fillColorOpacity);
    groupEl.appendChild(htmlUtils.createElement('hr'));

    groupEl.appendChild(components.createCheckBox(groupProps.closePath, 'Close path', function(value) {
        groupProps.closePath = value;
        changeCallback();
    }));

    groupEl.appendChild(components.createCheckBox(groupProps.fill, 'Fill', function(value) {
        groupProps.fill = value;
        changeCallback();
    }));

    groupEl.appendChild(components.createCheckBox(groupProps.fillPattern, 'Fill pattern', function(value) {
        groupProps.fillPattern = value;

        if(value)
            patternType.style.display = 'block';
        else 
            patternType.style.display = 'none';

        changeCallback();
    }));

    let patternType = components.createSelect(groupProps.patternType, ['type1','type2', 'type3'],'Pattern Type', function(value){
        groupProps.patternType = value;
        //groupProps.showPoints = value == 'lines';
        //console.log(groupProps.showPoints);
        //components.fillPoints(groupProps, changeCallback) 

        changeCallback();
    })

    if(!groupProps.fillPattern){
        patternType.style.display = 'none';
    }

    groupEl.appendChild(patternType)

    groupEl.appendChild(htmlUtils.createElement('button', { text: 'To points', attributes: {}, events: { 
        click: function() { 
            if(groupProps.points.length < 3){
                notifications.error('Points count should be > 2', 2000);
                return;
            }
            
            if(groupProps.type == 'dots'){
                notifications.error('type shouldn\'t be dots', 2000);
                return;
            }

            if(!confirm('Convert poligon to points?')){
                return;
            }


            let dots = [];
            createCanvas(new V2(1,1), (ctx, size, hlp) => {
                dots = new PP({ctx}).fillByCornerPoints(groupProps.points.map(p => p.point))
            })

            groupProps.type = 'dots';
            groupProps.fill = false;
            groupProps.closePath = false;

            groupProps.points = [];
            for(let i = 0; i < dots.length; i++){
                // id: nextPointId,
                //     order: points.length,
                //     point: {x: 0, y: 0},
                groupProps.points.push({
                    id: `${groupProps.id}_p_${groupProps.points.length}`,
                    order: groupProps.points.length,
                    point: dots[i]
                })
            }

            components.fillPoints(groupProps, changeCallback) 

            changeCallback();
         }
    } }))

    groupEl.appendChild(components.createSelect(groupProps.type, ['dots','lines'],'Type', function(value){
        groupProps.type = value;
        groupProps.showPoints = value == 'lines';
        //console.log(groupProps.showPoints);
        components.fillPoints(groupProps, changeCallback) 

        changeCallback();
    } ))



    groupProps.pointsEl = htmlUtils.createElement('div', { className: 'pointsListWrapper' });
    groupProps.pointEl = htmlUtils.createElement('div', { className: 'point'});
    groupEl.appendChild(groupProps.pointsEl);
    groupEl.appendChild(groupProps.pointEl);

    components.fillPoints(groupProps, changeCallback) 

    changeCallback();
}

components.fillGroups = function(layerProps, changeCallback) {
    let {groupsEl, groupEl, groups} = layerProps;

    components.editor.editor.toggleGroupVisibility = undefined;
    if(groupEl)
        htmlUtils.removeChilds(groupEl);

    if(groupsEl)
        htmlUtils.removeChilds(groupsEl);
    // groups list

    let buttons = components.editor.image.general.animated ? [
        {
            text: 'Clone to all frames',
            click: () => {
                let frames = components.editor.image.main;
                let currentFrameIndex = components.editor.image.general.currentFrameIndex;
                let { groupId, layerId } = components.editor.editor.selected;

                if(!groupId || !layerId){
                    alert('No group selected!');
                    return;
                }

                if(!confirm('Clone (override) selected group to other frames?'))
                    return;

                let selectedGroup = groups.filter(g => g.id == groupId)[0];
                for(let f = 0; f < frames.length; f++){
                    if(f == currentFrameIndex)
                        continue;

                    let layer = frames[f].layers.filter(l => l.id == layerId);
                    if(layer.length == 0){
                        console.log('No layer with id: ' + layerId + ' found in frame index: ' + f );
                        continue;
                    }

                    let gCloned = assignDeep(
                        {},
                        modelUtils.createDefaultGroup(selectedGroup.id, groups.length), 
                        modelUtils.groupMapper(selectedGroup, true));

                    layer = layer[0];

                    let groupIndex = layer.groups.findIndex(g => g.id == groupId)
                    //let group = layer.groups.filter(g => g.id == groupId);

                    if(groupIndex == -1){
                        layer.groups.push(gCloned);
                    }
                    else {
                        
                        layer.groups[groupIndex] = {
                            ...gCloned
                        };

                        // group[0].points = gCloned.points.map(p => ({
                        //     ...p,
                        //     point: {...p.point}
                        // }));
                    }
                    
                }
                //console.log(selectedGroup);
            }
        },
        {
            text: 'Update next frame',
            click: () => {
                let frames = components.editor.image.main;
                let currentFrameIndex = components.editor.image.general.currentFrameIndex;

                let f = currentFrameIndex+1;
                if(currentFrameIndex == frames.length-1)
                    f = 0;

                let selectedGroup = groups.filter(g => g.selected)[0];
                let sameIdGroup = undefined;
                
                for(let l = 0; l < frames[f].layers.length;l++){
                    for(let g = 0; g < frames[f].layers[l].groups.length; g++){
                        if(selectedGroup.id == frames[f].layers[l].groups[g].id){
                            sameIdGroup = frames[f].layers[l].groups[g];
                            break;
                        }
                    }
                    if(sameIdGroup){
                        break;
                    }
                }
                
                
                if(!sameIdGroup){
                    //alert('Not found same Id group');
                    let g = assignDeep(
                        {},
                        modelUtils.createDefaultGroup(selectedGroup.id, groups.length), 
                        modelUtils.groupMapper(selectedGroup, true));

                    let sameLayer = frames[f].layers.find(l => l.id == components.editor.editor.selected.layerId);
                    if(sameLayer){
                        if(sameLayer.groups == undefined){
                            sameLayer.groups = [];
                        }
                        sameLayer.groups.push(g);
                        alert('Added new group to next frame');
                        return;
                    }
                    else {
                        alert('Same layer in next frame not found!')
                        return;
                    }
                }

                sameIdGroup.points = selectedGroup.points.map(p => ({
                    ...p,
                    point: {...p.point}
                }));

                //alert('Done');
                notifications.done('Done', 2000);
            }
        }
    ] : []

    buttons.push({
        text: 'Clone',
        click: (select) => {
            let { groupId, layerId } = components.editor.editor.selected;
            if(!groupId || !layerId){
                alert('No group selected!');
                return;
            }

            let selectedGroup = groups.find(g => g.id == groupId);
            let nextGroupId = `${layerProps.id}_g_${layerProps.currentGroupId++}`;
            while(groups.filter(g => g.id == nextGroupId).length > 0){
                nextGroupId = `${layerProps.id}_g_${layerProps.currentGroupId++}`;
            }

            layerProps.groups.forEach(g => g.selected = false);

            let clonedGroup = assignDeep(
                {},
                modelUtils.createDefaultGroup(nextGroupId, layerProps.groups.length), 
                modelUtils.groupMapper(selectedGroup, true));
            
            clonedGroup.selected = true;
            clonedGroup.id = nextGroupId;
            clonedGroup.visible = true;
            clonedGroup.order = layerProps.groups.length;

            groups.push(clonedGroup);
            layerProps.removeImage();

            select.options[select.options.length] = new Option(clonedGroup.id, clonedGroup.id);
            select.value = clonedGroup.id;
            
            components.editor.editor.selected.groupId = clonedGroup.id;
            components.editor.editor.selected.pointId = undefined;

            select.dispatchEvent(new CustomEvent('change', { detail: 'setModeStateToAdd' }));
                
            components.editor.editor.setModeState(true, 'edit');
            components.editor.editor.setMoveGroupModeState(true);

            changeCallback();
            notifications.done('Group cloned', 1000);
        }
    })

    let groupsList = components.createList({
        title: 'Groups',
        className: 'groups',
        items: groups.map(g => {return { title: g.id, value: g.id, selected:  g.id == components.editor.editor.selected.groupId }}), //g.selected
        callbacks: {
            select: function(e){ 
                groups.forEach(g => g.selected = false);
                let selectedGroup = groups.find(g => g.id == e.target.value);
                if(selectedGroup){
                    selectedGroup.selected = true;
                    components.editor.editor.selected.groupId = selectedGroup.id;
                    components.editor.editor.selected.pointId = undefined;
                }

                let selectedOption = undefined;
                for(let i = 0; i < e.target.options.length;i++){
                    if(e.target.options[i].value == e.target.value){
                        selectedOption = e.target.options[i];
                        break;
                    }
                }

                let groupChangeCallback = function() {   
                    //console.log('groupChangeCallback')
                    layerProps.removeImage();
                    changeCallback(); 
                }

                components.createGroup(groupEl, selectedGroup, groupChangeCallback);
                components.editor.editor.setMoveGroupModeState(true);
                components.editor.editor.setModeState(true, 'edit');
            },
            reset: function(e) { 
                groups.forEach(g => g.selected = false);
                //components.createGroup(undefined, undefined, changeCallback) 
                
                components.editor.editor.selected.groupId = undefined;
                components.editor.editor.selected.pointId = undefined;

                components.fillGroups(layerProps, changeCallback);
                components.editor.editor.setModeState(false, 'edit');
                components.editor.editor.setMoveGroupModeState(false);

                changeCallback();
            },
            remove(e, select) {
                if(!confirm('Remove group?'))
                    return;

                layerProps.removeImage();
                groups = groups.filter(g => g.id != select.value);  
                groups.forEach((p, i) => p.order = i);
                select.value = undefined;
                
                components.editor.editor.selected.groupId = undefined;
                components.editor.editor.selected.pointId = undefined;

                layerProps.groups = groups;
                components.fillGroups(layerProps, changeCallback);

                components.editor.editor.setModeState(false, 'edit');
                components.editor.editor.setMoveGroupModeState(false);

                changeCallback();
            },
            add: function(e, select) {
                
                if(layerProps.currentGroupId == undefined){
                    layerProps.currentGroupId = 0;
                }

                let nextGroupId = `${layerProps.id}_g_${layerProps.currentGroupId++}`;
                while(groups.filter(g => g.id == nextGroupId).length > 0){
                    nextGroupId = `${layerProps.id}_g_${layerProps.currentGroupId++}`;
                }
                
                
                let group  = modelUtils.createDefaultGroup(nextGroupId, groups.length);
                group.selected = true;

                groups.push(group);

                select.options[select.options.length] = new Option(group.id, group.id);
                select.value = group.id;
                
                components.editor.editor.selected.groupId = group.id;
                components.editor.editor.selected.pointId = undefined;

                select.dispatchEvent(new CustomEvent('change', { detail: 'setModeStateToAdd' }));
                
                components.editor.editor.setModeState(true, 'edit');
                components.editor.editor.setMoveGroupModeState(true);

                changeCallback();
            },
            move(select, direction) {
                let g = groups.filter(g => g.id == select.value); 
                if(!g.length)
                    return;
                else 
                    g = g[0];

                let currentIndex = groups.indexOf(g);
                if((direction == -1 && currentIndex == 0) || (direction == 1 && currentIndex == groups.length-1))
                    return;

                layerProps.removeImage();
                components.array_move(groups, currentIndex, currentIndex + direction);
                groups.forEach((g, i) => g.order = i);
                components.fillGroups(layerProps, changeCallback);
                
                components.editor.editor.setModeState(false, 'edit');
                components.editor.editor.setMoveGroupModeState(false);

                changeCallback();
            },
            changeCallback: changeCallback
        },
        buttons
    });

    groupsEl.appendChild(groupsList);
    groupsEl.list = groupsList;

    if(components.editor.editor.selected.groupId){
        let selectedGroups = groups.filter(g => g.id == components.editor.editor.selected.groupId);
        if(selectedGroups && selectedGroups.length > 0){
            document.querySelector('.groups select').dispatchEvent(new CustomEvent('change'));
        }
    }
}