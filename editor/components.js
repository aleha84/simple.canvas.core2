var components = {
    createRange(value, title, changeCallback) {
        let el = htmlUtils.createElement('div', { classNames: ['range', 'row'] });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            let currentValueElement = htmlUtils.createElement('span', { className: 'current', text: value.current.toString() })
            el.range = divValue.appendChild(htmlUtils.createElement('input', { 
                attributes: { type: 'range', min: value.min, max: value.max, step: value.step }, value: value.current.toString(),
                events: {
                    change: (event) => {
                        
                        if(value.round){
                            value.current = fast.r(parseFloat(event.target.value), value.round);
                        }
                        else 
                            value.current = parseInt(event.target.value);

                        currentValueElement.innerText = value.current;
                        changeCallback(event.target, value.current);
                    }
                }
             }))

             el.range.value = value.current;

             divValue.appendChild(currentValueElement);
             el.label = currentValueElement;

             return divValue;
        })());

        return el;
    },
    createInput(value, title, changeCallback){
        let el = htmlUtils.createElement('div', { classNames: ['inputBox', 'row'] });

        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            divValue.appendChild(htmlUtils.createElement('span', { className: 'read', text: value || '<no value>' }));
            divValue.appendChild(htmlUtils.createElement('div', { className: 'edit' }));

            divValue.addEventListener('click', function(e) {
                if(this.classList.contains('edit'))
                    return;

                this.classList.add('edit');

                let editBlock = this.querySelector('.edit');
                let readBlock = this.querySelector('.read');
                htmlUtils.removeChilds(editBlock);

                editBlock.appendChild(htmlUtils.createElement('input', { className: 'newValue', value: value }));

                editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
                events: { click: (event) => {
                    let newValue = editBlock.querySelector('.newValue').value;
                    readBlock.innerText = newValue;
                    this.classList.remove('edit');
                    event.stopPropagation();
                    changeCallback(newValue);
                }},
                value: 'U' }));
                editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
                    events: { click: (event) => {
                        this.classList.remove('edit');
                        event.stopPropagation();
                    } }, value: 'C' }));
            })

            return divValue;
        })())

        return el;
    },
    createV2(value, title, changeCallback) {
        let el = htmlUtils.createElement('div', { classNames: ['V2', 'row'] });

        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            divValue.appendChild(htmlUtils.createElement('span', { className: 'read', text: `x: ${value.x}, y: ${value.y}` }));
            divValue.appendChild(htmlUtils.createElement('div', { className: 'edit' }));

            divValue.addEventListener('click', function(e) {
                if(this.classList.contains('edit'))
                    return;

                this.classList.add('edit');

                let editBlock = this.querySelector('.edit');
                let readBlock = this.querySelector('.read');
                htmlUtils.removeChilds(editBlock);

                editBlock.appendChild(htmlUtils.createElement('span', { text: 'x' }));
                editBlock.appendChild(htmlUtils.createElement('input', { className: 'x', value: value.x.toString() }));
                editBlock.appendChild(htmlUtils.createElement('span', { text: 'y' }));
                editBlock.appendChild(htmlUtils.createElement('input', { className: 'y', value: value.y.toString() }));

                editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
                events: { click: (event) => {
                    value.x = parseInt(editBlock.querySelector('.x').value);
                    value.y = parseInt(editBlock.querySelector('.y').value);
                    readBlock.innerText = `x: ${value.x}, y: ${value.y}`;
                    this.classList.remove('edit');
                    event.stopPropagation();
                    changeCallback();
                }},
                value: 'U' }));
                editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
                    events: { click: (event) => {
                        this.classList.remove('edit');
                        event.stopPropagation();
                    } }, value: 'C' }));
            })

            return divValue;
        })())
        
        return el;
    },
    createCheckBox(value, title, changeCallback){
        let el = htmlUtils.createElement('div', { classNames: ['checkbox', 'row'] });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }
        let props = {}
        if(value){
            props.checked = true;
        }

        el.appendChild(htmlUtils.createElement('input', {attributes: { type: 'checkbox'}, props, events: {
            change: (event) => {
                changeCallback(event.target.checked);
            }
        } }))

        return el;
    },
    createSelect(value, options, title, changeCallback){
        let el = htmlUtils.createElement('div', { classNames: ['select', 'row'] });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        let select = htmlUtils.createElement('select', { events: {
            change: (event) => {
                changeCallback(event.target.value);
            }
        } });

        for(let item of options){
            let option = undefined;
            if(isString(item)){
                option = new Option(item, item); 
            }
            else {
                option = new Option(item.title || item.text, item.value);
            }

            option.selected = option.value == value;

            select.options[select.options.length] = option;
            //select.options[select.options.length] = new Option(item.title || item.text, item.value, false, item.value == value);
        }

        el.appendChild(select);

        return el;
    },
    createColorPicker(value, title, changeCallback){
        let el = htmlUtils.createElement('div', { classNames: ['colorPicker', 'row'] });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        let cPicker = htmlUtils.createElement('input', {attributes: { type: 'color', value}, events: {
            change: (event) => {
                hexInput.value = event.target.value;
                changeCallback(event.target.value);
            }
        } })

        let hexInput = htmlUtils.createElement('input', {attributes: { type: 'text', value}, events: {
            blur: (event) => {
                if(!/^#[0-9A-F]{6}$/i.test(event.target.value)){
                    event.target.value = cPicker.value;
                    return;
                }

                cPicker.value = event.target.value;
                changeCallback(event.target.value);
            }
        } })

        el.appendChild(cPicker);
        el.appendChild(hexInput);

        el.cPicker = cPicker;
        el.hexInput = hexInput;

        return el;
    },
    createList(listProps) {
        let selected = false;
        let lb = htmlUtils.createElement('div', { classNames: ['listbox', listProps.className] });
        lb.appendChild(htmlUtils.createElement('p', { className: 'title', text: listProps.title }));
        let selectHolder = htmlUtils.createElement('div', { className: 'selectHolder'});
        
        let select = htmlUtils.createElement('select', { attributes: { size: listProps.maxSize || 10 }, events: {
            change: function(e) { 
                if(listProps.callbacks.select) {
                    selected = true;
                    addButton.disabled = false;
                    if(moveUpButton)
                        moveUpButton.disabled = false;

                    if(moveDownButton)
                        moveDownButton.disabled = false;
                    listProps.callbacks.select(e)
                }
                else 
                    console.log(e.target.value)
         }
        } });

        for(let item of listProps.items){
            let op = new Option(item.title || item.text, item.value);
            if(item.selected){
                op.selected = true;
                selected = true;
            }

            select.options[select.options.length] = op;
        }

        selectHolder.append(select);
        
        let addButton = htmlUtils.createElement('input', {
            attributes: { 
                type: 'button', 
                value: 'Remove' 
            },
            events: { 
                click: function(e) { 
                    listProps.callbacks.remove(e, select);
                } },
            props: {
                disabled: !selected
            }
        });
        

        let sControls = htmlUtils.createElement('div', { className: 'selectControls'});
        let moveUpButton = undefined;
        let moveDownButton = undefined;
        if(listProps.callbacks.move){
            moveUpButton = htmlUtils.createElement('input', 
            { 
                attributes: { 
                    type: 'button', 
                    value: 'Move ↑' 
                }, 
                events: { 
                    click: function(e) { 
                        if(!selected)
                            return;
                        
                        listProps.callbacks.move(select, -1);
                    } 
                },
                props: {
                    disabled: !selected
                } });
    
            sControls.append(moveUpButton);

            moveDownButton = htmlUtils.createElement('input', 
            { 
                attributes: { 
                    type: 'button', 
                    value: 'Move ↓' 
                }, 
                events: { 
                    click: function(e) { 
                        if(!selected)
                            return;
                        
                        listProps.callbacks.move(select, 1);
                    } 
                },
                props: {
                    disabled: !selected
                } });
    
            sControls.append(moveDownButton);

            if(listProps.buttons){
                listProps.buttons.forEach(button => {
                    sControls.append(htmlUtils.createElement('input', 
                    { 
                        attributes: { 
                            type: 'button', 
                            value: button.text 
                        }, 
                        events: { 
                            click: function(e) { 
                                button.click();
                            } 
                        } }));
                })
            }
        }
        
        if(listProps.noReset == undefined || listProps.noReset == false){
            sControls.append(
                htmlUtils.createElement('input', 
                    { 
                        attributes: { 
                            type: 'button', 
                            value: 'reset' 
                        }, 
                        events: { 
                            click: function(e) { 
                                selected = false;
                                select.options.selectedIndex = -1;
                                addButton.disabled = true;
                                if(moveUpButton)
                                    moveUpButton.disabled = true;
                                if(moveDownButton)
                                    moveDownButton.disabled = true;
                                listProps.callbacks.reset(e);
                            } } }))
        }
        

        sControls.append(
            htmlUtils.createElement('input', 
                { 
                    attributes: { 
                        type: 'button', 
                        value: 'Add' 
                    }, 
                    events: { 
                        click: function(e) { 
                            listProps.callbacks.add(e, select);
                            
                            //select.options.selectedIndex = select.options.length-1;
                        } } }))

        sControls.append(addButton);

        selectHolder.append(sControls)
        lb.append(selectHolder);

        return lb;
    },
    createGroup(groupEl, groupProps, changeCallback){
        htmlUtils.removeChilds(groupEl);
        if(groupProps == undefined) {
            changeCallback();
            return;
        }

        groupEl.appendChild(htmlUtils.createElement('div', { text: groupProps.id }))

        groupEl.appendChild(components.createCheckBox(groupProps.visible, 'Visible', function(value) {
            groupProps.visible = value;
            changeCallback();
        }));

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
            changeCallback();
        }));

        

        groupEl.appendChild(components.createSelect(groupProps.type, ['dots','lines'],'Type', function(value){
            groupProps.type = value;
            changeCallback();
        } ))

        groupProps.pointsEl = htmlUtils.createElement('div', { className: 'pointsListWrapper' });
        groupProps.pointEl = htmlUtils.createElement('div', { className: 'point'});
        groupEl.appendChild(groupProps.pointsEl);
        groupEl.appendChild(groupProps.pointEl);

        this.fillPoints(groupProps, changeCallback) 

        changeCallback();
    },
    createLayer(layerEl, layerProps, changeCallback, additionals = {}) {
        htmlUtils.removeChilds(layerEl);

        if(layerProps == undefined) {
            changeCallback();
            return;
        }

        layerEl.appendChild(htmlUtils.createElement('div', { text: 'id: ' + layerProps.id }))
        layerEl.appendChild(components.createInput(layerProps.name, 'Name', function(value) {
            if(value){
                layerProps.name = value
                if(additionals.selectedOption)
                    additionals.selectedOption.text =  value;
    
                changeCallback();
            }
            
        }))

        layerEl.appendChild(components.createCheckBox(layerProps.visible, 'Visible', function(value) {
            layerProps.visible = value;
            changeCallback();
        }));

        layerProps.groupsEl = htmlUtils.createElement('div', { className: 'groupsListWrapper' });
        layerProps.groupEl = htmlUtils.createElement('div', { className: 'group'});
        layerEl.appendChild(layerProps.groupsEl);
        layerEl.appendChild(layerProps.groupEl);

        this.fillGroups(layerProps, changeCallback) 

        changeCallback();
    },

    fillGroups(layerProps, changeCallback) {
        let {groupsEl, groupEl, groups} = layerProps;

        if(groupEl)
            htmlUtils.removeChilds(groupEl);

        if(groupsEl)
            htmlUtils.removeChilds(groupsEl);
        // groups list
        groupsEl.appendChild(components.createList({
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
                    }

                    let selectedOption = undefined;
                    for(let i = 0; i < e.target.options.length;i++){
                        if(e.target.options[i].value == e.target.value){
                            selectedOption = e.target.options[i];
                            break;
                        }
                    }

                    components.createGroup(groupEl, selectedGroup, changeCallback);
                    components.editor.editor.setMoveGroupModeState(true);
                    components.editor.editor.setModeState(true, 'edit');
                },
                reset: function(e) { 
                    groups.forEach(g => g.selected = false);
                    //components.createGroup(undefined, undefined, changeCallback) 
                    components.fillGroups(layerProps, changeCallback);
                    components.editor.editor.selected.groupId = undefined;
                    components.editor.editor.setModeState(false, 'edit');
                    components.editor.editor.setMoveGroupModeState(false);

                    changeCallback();
                },
                remove(e, select) {
                    if(!confirm('Remove group?'))
                        return;

                    groups = groups.filter(g => g.id != select.value);  
                    groups.forEach((p, i) => p.order = i);
                    select.value = undefined;
                    components.editor.editor.selected.groupId = undefined;
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

                    let nextGroupId = `${layerProps.id}_group_${layerProps.currentGroupId++}`;
                    while(groups.filter(g => g.id == nextGroupId).length > 0){
                        nextGroupId = `${layerProps.id}_group_${layerProps.currentGroupId++}`;
                    }
                    
                    let group  = {
                        currentPointId: 0,
                        selected: true,
                        order: groups.length,
                        id: nextGroupId,
                        visible: true,
                        clear: false,
                        strokeColor: '#FF0000',
                        strokeColorOpacity: 1,
                        fillColor: '#FF0000',
                        fillColorOpacity: 1,
                        fill: false,
                        fillPattern: false,
                        closePath: false,
                        type: 'dots',
                        pointsEl: undefined,
                        pointEl: undefined,
                        points: []
                    }

                    groups.push(group);

                    select.options[select.options.length] = new Option(group.id, group.id);
                    select.value = group.id;
                    components.editor.editor.selected.groupId = group.id;
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

                    components.array_move(groups, currentIndex, currentIndex + direction);
                    groups.forEach((g, i) => g.order = i);
                    components.fillGroups(layerProps, changeCallback);
                    
                    components.editor.editor.setModeState(false, 'edit');
                    components.editor.editor.setMoveGroupModeState(false);

                    changeCallback();
                },
                changeCallback: changeCallback
            },
            buttons: components.editor.image.general.animated ? [
                {
                    text: 'Update next frame',
                    click: () => {
                        let frames = components.editor.image.main;
                        let currentFrameIndex = components.editor.image.general.currentFrameIndex;

                        if(currentFrameIndex == frames.length-1)
                            return;

                        let selectedGroup = groups.filter(g => g.selected)[0];
                        let sameIdGroup = undefined;
                        let f = currentFrameIndex+1;
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
                            alert('Not found same Id group');
                            return;
                        }

                        sameIdGroup.points = selectedGroup.points.map(p => ({
                            ...p,
                            point: {...p.point}
                        }));

                        alert('Done');
                    }
                }
            ] : []
        }))

        if(components.editor.editor.selected.groupId){
            let selectedGroups = groups.filter(g => g.id == components.editor.editor.selected.groupId);
            if(selectedGroups && selectedGroups.length > 0){
                document.querySelector('.groups select').dispatchEvent(new CustomEvent('change'));
            }
        }
    },

    fillPoints(groupProps, changeCallback) {
        let {pointsEl, pointEl, points} = groupProps;
        let fillPoint = (point, selectedOptionEl,changeCallback, eventDetails) => {
            htmlUtils.removeChilds(pointEl);

            if(point == undefined){
                changeCallback();
                return;
            }

            pointEl.appendChild(components.createV2(point.point, 'Point', function() {
                if(selectedOptionEl)
                    selectedOptionEl.text =  `x: ${point.point.x}, y: ${point.point.y}`

                changeCallback();
            }))
            
            if(eventDetails!= 'skipSelectChangeCallback')
                changeCallback();
        }

        htmlUtils.removeChilds(pointsEl);

        // points list
        pointsEl.appendChild(components.createList({
            title: 'Points',
            items: points.map(p => {return { title: `x: ${p.point.x}, y: ${p.point.y}`, value: p.id, selected: p.selected }}),
            callbacks: {
                select: function(e){ 
                    points.forEach(p => p.selected = false);
                    let selectedPoint = points.find(l => l.id == e.target.value);
                    if(selectedPoint){
                        selectedPoint.selected = true;
                    }

                    let selectedOption = undefined;
                    for(let i = 0; i < e.target.options.length;i++){
                        if(e.target.options[i].value == e.target.value){
                            selectedOption = e.target.options[i];
                            break;
                        }
                    }

                    components.editor.editor.setModeState(true, 'edit');

                    fillPoint(selectedPoint,selectedOption, changeCallback, e.detail);  
                },
                reset: function(e) { 
                    points.forEach(p => p.selected = false);
                    components.editor.editor.setModeState(true, 'edit');
                    fillPoint(undefined, undefined, changeCallback, '') 
                },
                remove(e, select) {
                    points = points.filter(p => p.id != select.value);  
                    points.forEach((p, i) => p.order = i);
                    select.value = undefined;
                    groupProps.points = points;
                    components.fillPoints(groupProps, changeCallback);
                    components.editor.editor.setModeState(true, 'edit');
                    changeCallback();
                },
                add: function(e, select) {
                    
                    if(groupProps.currentPointId == undefined){
                        groupProps.currentPointId = 0;
                    }

                    points.push({
                        id: `${groupProps.id}_point_${groupProps.currentPointId++}`,
                        order: points.length,
                        point: {x: 0, y: 0},
                    })
                    components.fillPoints(groupProps, changeCallback);
                    components.editor.editor.setModeState(true, 'edit');
                    changeCallback();
                },
                move(select, direction) {
                    let p = points.filter(p => p.id == select.value); 
                    if(!p.length)
                        return;
                    else 
                        p = p[0];

                    let currentIndex = points.indexOf(p);
                    if((direction == -1 && currentIndex == 0) || (direction == 1 && currentIndex == points.length-1))
                        return;

                    components.array_move(points, currentIndex, currentIndex + direction);
                    points.forEach((p, i) => p.order = i);

                    components.fillPoints(groupProps, changeCallback);
                    components.editor.editor.setModeState(true, 'edit');
                    changeCallback();
                },
                changeCallback: changeCallback
            }
        }))
    },
    array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
    }
}