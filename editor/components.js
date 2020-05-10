var components = {
    createRange(value, title, changeCallback, inputCallback, params = {}) {
        let el = htmlUtils.createElement('div', { classNames: ['range', params.rowClassName ? params.rowClassName : 'row'] });
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
                    },
                    input: inputCallback ? (event) => {
                        if(value.round){
                            value.current = fast.r(parseFloat(event.target.value), value.round);
                        }
                        else 
                            value.current = parseInt(event.target.value);

                        currentValueElement.innerText = value.current;
                        inputCallback(value.current);
                    } : () => {}
                }
             }))

             el.range.value = value.current;

             divValue.appendChild(currentValueElement);
             el.label = currentValueElement;

             el.setValue = (newValue) => {
                currentValueElement.innerText = newValue.toString();
                el.range.value = newValue.toString();
                value.current = newValue;
             }

             return divValue;
        })());

        return el;
    },
    createButton(title, callback, params = { classNames: [] }){
        let button = htmlUtils.createElement('input', { classNames: params.classNames, attributes: { type: 'button' }, 
        events: { click: (event) => {
            callback(event)
        } }, value: title });

        return button;
    },
    createInput(value, title, changeCallback){
        let el = htmlUtils.createElement('div', { classNames: ['inputBox', 'rowFlex'] });

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
    createV2(value, title, changeCallback, params = {}) {
        let el = htmlUtils.createElement('div', { classNames: ['V2', params.rowClassName ? params.rowClassName : 'row'] });

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

        let chk = htmlUtils.createElement('input', {attributes: { type: 'checkbox'}, props, events: {
            change: (event) => {
                changeCallback(event.target.checked);
            }
        } });

        el.appendChild(chk);

        el.chk = chk;

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
    createColorPicker(value, title, changeCallback, params = {readOnly: false}){
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

        let inputProps = {};
        if(params.readOnly){
            cPicker.style.display = 'none'; 
            inputProps.readonly = true;
        }

        let hexInput = htmlUtils.createElement('input', {attributes: { type: 'text', value}, props: inputProps, events: {
            blur: (event) => {
                let match = /^#*([0-9A-F]{6})$/i.exec(event.target.value);
                if(!match){
                    event.target.value = cPicker.value;
                    return;
                }
                // if(!/^#[0-9A-F]{6}$/i.test(event.target.value)){
                //     event.target.value = cPicker.value;
                //     return;
                // }

                let hexValue = '#' + match[1];
                event.target.value = hexValue;
                cPicker.value = hexValue;
                changeCallback(hexValue);
            }
        } })

        el.appendChild(cPicker);
        if(params.readOnly){
            let readOnlyDiv = htmlUtils.createElement('div', { className: 'readOnlyBlock' });
            readOnlyDiv.style.backgroundColor = value;
            el.appendChild(readOnlyDiv);
        }
        el.appendChild(hexInput);

        el.cPicker = cPicker;
        el.hexInput = hexInput;

        el.setValue = (value) => {
            cPicker.value = value;
            hexInput.value = value;
        }

        el.getValue = () => cPicker.value;

        return el;
    },
    createList(listProps) {
        let selected = false;
        let lb = htmlUtils.createElement('div', { classNames: ['listbox', listProps.className] });
        lb.appendChild(htmlUtils.createElement('p', { className: 'title', text: listProps.title }));
        let selectHolder = htmlUtils.createElement('div', { className: 'selectHolder'});
        
        let select = htmlUtils.createElement('select', { attributes: { size: listProps.maxSize || 10 }, events: {
            keypress: function(e) {
                e.preventDefault();
                e.stopPropagation();
            },
            change: function(e) { 
                if(listProps.callbacks.select) {
                    selected = true;
                    addButton.disabled = false;
                    if(moveUpButton)
                        moveUpButton.disabled = false;

                    if(moveDownButton)
                        moveDownButton.disabled = false;

                    listProps.callbacks.select(e)

                    let framesSelect = document.querySelector('.frames select')
                    if(framesSelect && framesSelect.selectedOptions.length){
                        let selectedOption = framesSelect.selectedOptions[0];
                        framesSelect.scrollTop = (selectedOption.offsetTop - framesSelect.offsetTop) - fast.r(framesSelect.offsetHeight/2); 
                        //console.log(framesSelect.scrollTop);
                    }                    
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
        selectHolder.select = select;
        
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
                                button.click(select);
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
        if(listProps.callbacks.removeAll){
            sControls.append(htmlUtils.createElement('input', {
                attributes: { 
                    type: 'button', 
                    value: 'Remove All' 
                },
                events: { 
                    click: function(e) { 
                        if(!confirm('Remove all points?'))
                            return;

                        listProps.callbacks.removeAll(e, select);
                    } 
                }
            }));
        }

        selectHolder.append(sControls)
        lb.append(selectHolder);
        lb.selectHolder = selectHolder;

        return lb;
    },
    createGroup(groupEl, groupProps, changeCallback){
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
            changeCallback();
        }));

        

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

        let layerVisiblityEl = components.createCheckBox(layerProps.visible, 'Visible', function(value) {
            layerProps.removeImage();
            layerProps.visible = value;
            changeCallback();
        })

        layerEl.appendChild(layerVisiblityEl);

        components.editor.editor.toggleLayerVisibility = () => layerVisiblityEl.chk.click();
        components.editor.editor.toggleGroupVisibility = undefined;

        layerProps.groupsEl = htmlUtils.createElement('div', { className: 'groupsListWrapper' });
        layerProps.groupEl = htmlUtils.createElement('div', { className: 'group'});
        layerEl.appendChild(layerProps.groupsEl);
        layerEl.appendChild(layerProps.groupEl);

        this.fillGroups(layerProps, changeCallback) 

        changeCallback();
    },

    fillGroups(layerProps, changeCallback) {
        let {groupsEl, groupEl, groups} = layerProps;

        components.editor.editor.toggleGroupVisibility = undefined;
        if(groupEl)
            htmlUtils.removeChilds(groupEl);

        if(groupsEl)
            htmlUtils.removeChilds(groupsEl);
        // groups list
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
            buttons: components.editor.image.general.animated ? [
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

                        alert('Done');
                    }
                }
            ] : []
        });

        groupsEl.appendChild(groupsList);
        groupsEl.list = groupsList;

        if(components.editor.editor.selected.groupId){
            let selectedGroups = groups.filter(g => g.id == components.editor.editor.selected.groupId);
            if(selectedGroups && selectedGroups.length > 0){
                document.querySelector('.groups select').dispatchEvent(new CustomEvent('change'));
            }
        }
    },

    fillPoints(groupProps, changeCallback) {
        let {pointsEl, pointEl, points} = groupProps;
        components.editor.editor.removeSelectedPoint = undefined;
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

        let pointsToShow = points;

        let removeAllPoints = function() {
            while(points.length){
                points.pop();
            }

            components.fillPoints(groupProps, changeCallback);
            components.editor.editor.setModeState(true, 'edit');
            components.editor.editor.selected.pointId = undefined;
            changeCallback();
        }

        if(!groupProps.showPoints){
            //pointsToShow =  points.length > 0 ? [points[0]] : [];
            pointsEl.appendChild(htmlUtils.createElement('div', { text: 'Points hidden: ' + points.length }))
            pointsEl.appendChild(htmlUtils.createElement('input', { value: 'Remove all', attributes: { type: 'button' }, events: {
                click: removeAllPoints
            } }))

            return;
        }

        let removePointCallback = function(e, select) {
            points = points.filter(p => p.id != select.value);  
            points.forEach((p, i) => p.order = i);
            select.value = undefined;
            groupProps.points = points;
            components.fillPoints(groupProps, changeCallback);
            components.editor.editor.setModeState(true, 'edit');
            components.editor.editor.selected.pointId = undefined;
            changeCallback();
        }


        // points list
        pointsEl.appendChild(components.createList({
            title: 'Points',
            items: pointsToShow.map(p => {return { title: `x: ${p.point.x}, y: ${p.point.y}`, value: p.id, selected: p.selected }}),
            callbacks: {
                select: function(e){ 
                    points.forEach(p => p.selected = false);
                    let selectedPoint = points.find(l => l.id == e.target.value);
                    if(selectedPoint){
                        selectedPoint.selected = true;
                        components.editor.editor.selected.pointId = selectedPoint.id;
                        components.editor.editor.removeSelectedPoint = () => removePointCallback(e,e.target);
                        //console.log('selected point id: ' + components.editor.editor.selected.pointId); 
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
                    components.editor.editor.selected.pointId = undefined;

                    points.forEach(p => p.selected = false);
                    components.editor.editor.setModeState(true, 'edit');
                    fillPoint(undefined, undefined, changeCallback, '') 
                },
                remove(e, select) {
                    removePointCallback(e, select);
                },
                removeAll(e, select) {
                    removeAllPoints();
                },
                add: function(e, select) {
                    
                    if(groupProps.currentPointId == undefined){
                        groupProps.currentPointId = 0;
                    }

                    let nextPointId = `${groupProps.id}_p_${groupProps.currentPointId++}`;
                    while(points.filter(p => p.id == nextPointId).length > 0){
                        nextPointId = `${groupProps.id}_p_${groupProps.currentPointId++}`;
                    }

                    points.push({
                        id: nextPointId,
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
    },
    createDraggablePanel({parent, title, position, closable = false, panelClassNames = [], expandable = true, contentWidth = undefined, contentItems = [],
        onClose = () => {}, onCreate = () => {}
    }) {
        let editorBr = parent.querySelector('#editor').getBoundingClientRect();
        let panelBr = undefined;
        //console.log(editorBr)
        let panel = htmlUtils.createElement('div', { classNames: ['panel', ...panelClassNames] });
        let panelHeader = htmlUtils.createElement('div', { className: 'header' });

        let content = htmlUtils.createElement('div', { classNames: [ 'content'] });

        if(contentWidth){
            content.style.minWidth = contentWidth + 'px';
        }

        contentItems.forEach(c => {
            content.appendChild(c);
        })

        let dragPanel = htmlUtils.createElement('div', { text: title,classNames: [ 'drag'] });
        
        if(expandable){
            panelHeader.appendChild(htmlUtils.createElement('input', { value: 'Expand', className: 'toggle', attributes: { type: 'button' }, events: {
                click: function(){
                    panelBr = panel.getBoundingClientRect();
                    if (content.classList.contains("visible")) 
                        content.classList.remove("visible");
                    else 
                        content.classList.add('visible');
                }
            } }));
        }
        else {
            content.classList.add('visible')
        }

        panelHeader.appendChild(dragPanel);
        if(closable){
            panelHeader.appendChild(htmlUtils.createElement('div', { text: 'x', classNames: [ 'close'], events: {
                click: () => {
                    events.remove();
                }
            } }));
        }

        panel.appendChild(panelHeader);
        panel.appendChild(content)

        panel.style.left = position.x + 'px';
        panel.style.top = position.y + 'px';

        parent.appendChild(panel);

        panelBr = panel.getBoundingClientRect();

        let dragStartRelative = undefined;
        let events = {
            remove() {
                panel.remove();
                onClose();
            },
            dragStart(event) {
                panelBr = panel.getBoundingClientRect();
                dragStartRelative = {
                    x: event.clientX - panelBr.left,
                    y: event.clientY - panelBr.top
                }
    
                dragPanel.classList.add('active');
    
                parent.addEventListener('mousemove', events.move);
                parent.addEventListener('mouseup',events.mouseUp);
                document.addEventListener('mouseout', events.out);
            },
            out(event){
                var from = event.relatedTarget || event.toElement;  
                if (!from || from.nodeName == "HTML"){
                    events.mouseUp()
                }
            },
            move(event) { 
                if(!dragStartRelative)
                    return;
    
                event.preventDefault();
                let nextX = event.clientX - dragStartRelative.x;
                if(nextX < 0)
                    nextX = 0;
                
                if(nextX + panelBr.width > editorBr.left + editorBr.width)
                    nextX = editorBr.left + editorBr.width - panelBr.width;
    
                let nextY = event.clientY - dragStartRelative.y;
                if(nextY < 0)
                    nextY = 0;
    
                if(nextY + panelBr.height > editorBr.top + editorBr.height)
                    nextY = editorBr.top + editorBr.height - panelBr.height;
    
                panel.style.left = nextX + 'px';
                panel.style.top = nextY + 'px';
            },
            mouseUp() {
                dragStartRelative = undefined;
    
                if (dragPanel.classList.contains("active")) {
                    dragPanel.classList.remove("active");
                }
    
                parent.removeEventListener('mousemove', events.move);
                parent.removeEventListener('mouseup', events.mouseUp);
                document.removeEventListener('mouseout', events.out);
            }
        }

        dragPanel.onmousedown  = events.dragStart;

        onCreate();

        return {
            panel,
            panelHeader,
            content,
            contentItems,
            events,
            remove() {
                events.remove();
            }
        }
    },

    createMidColor() {
        let midColorFoo = (c1, c2) => {
            let c1rgb = hexToRgb(c1, true);
            let c2rgb = hexToRgb(c2, true);
            return '#' + rgbToHex( c1rgb.map((el, i) => fast.r((c1rgb[i] + c2rgb[i])/2)) )
        }

        let container = htmlUtils.createElement('div');
        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {
            result.setValue(midColorFoo(color1.getValue(), color2.getValue()))
        })
        let color2 = this.createColorPicker('#FFFFFF', 'C2', (value) => {
            result.setValue(midColorFoo(color1.getValue(), color2.getValue()))
        })
        let result = this.createColorPicker('#FFFFFF', 'R', () => {})

        container.appendChild(color1);
        container.appendChild(color2);
        container.appendChild(result);

        container.appendChild(htmlUtils.createElement('input', { value: 'Reset',  attributes: { type: 'button' }, events: {
            click: function(){
                color1.setValue('#FFFFFF')
                color2.setValue('#FFFFFF')
                result.setValue('#FFFFFF')
            }}}));  

        return container;
    },

    createSceneColorPicker() {
        let container = htmlUtils.createElement('div');

        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {})

        container.appendChild(color1);
        container.setValue = (value) => {
            color1.setValue(value);

            let hexInput = color1.hexInput;
            hexInput.focus();
            hexInput.select();

            try {
                var successful = document.execCommand('copy');
            } catch (err) {
            alert('Failed to copy to clipboard');
            }
        }


        return container;
    },

    createCShift() {

        let midColorFoo = (c1, c2, count) => {
            count = parseInt(count);
            if(isNaN(count))
                count = 3;

            let c1rgb = hexToRgb(c1, true);
            let c2rgb = hexToRgb(c2, true);

            htmlUtils.removeChilds(result);
            let steps = count+2;
            let rValues = easing.fast({from: c1rgb[0], to: c2rgb[0], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
            let gValues = easing.fast({from: c1rgb[1], to: c2rgb[1], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
            let bValues = easing.fast({from: c1rgb[2], to: c2rgb[2], steps, type: 'linear', method:'base'}).map(value => fast.r(value));
            for(let i = 0; i < steps; i++){
                result.appendChild(this.createColorPicker('#' + rgbToHex([rValues[i], gValues[i], bValues[i]]), 'C'+i, () => {}, { readOnly: true }))
            }
            //return '#' + rgbToHex( c1rgb.map((el, i) => fast.r((c1rgb[i] + c2rgb[i])/2)) )
        }

        let container = htmlUtils.createElement('div');

        let result = htmlUtils.createElement('div');

        let color1 = this.createColorPicker('#FFFFFF', 'C1', () => {
            midColorFoo(color1.getValue(), color2.getValue(), count.value);
        })
        let color2 = this.createColorPicker('#FFFFFF', 'C2', (value) => {
            midColorFoo(color1.getValue(), color2.getValue(), count.value);
        })

        let count = htmlUtils.createElement('input', { value: '1', attributes: { type: 'number' },
        events: {
            change: (event) => {
                midColorFoo(color1.getValue(), color2.getValue(), count.value);
            }
        } });

        container.appendChild(color1);
        container.appendChild(color2);
        container.appendChild(count);
        container.appendChild(result);

        return container;
    },

    createRotationControl(angleChangeCallback, rotationOrigin, applyCallback) {
        let container = htmlUtils.createElement('div');

        let currentAngle = 0;
        let angleRange = {current: currentAngle, max: 180, min: -180, step: 1, round: 0};

        let angleValueWrapper = htmlUtils.createElement('div', { classNames: ['inputBox', 'rowFlex'] });
        angleValueWrapper.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Angle' }))
        let angleValue = htmlUtils.createElement('input', { classNames: ['marginLeft5', 'paddingLeft2'], attributes: { type: 'number' }, value: currentAngle.toString(),events: {
            change: (event) => {
                let value = angleValue.value;
                let parsed = parseInt(value);
                if(isNaN(parsed))
                    parsed = 0;
                    
                currentAngle = parsed;
                angleChangeCallback(parsed);
                range.setValue(parsed);
            }
        } });
        angleValue.style.width = '30px';
        angleValueWrapper.appendChild(angleValue);
        
        let rOrigin = components.createV2(rotationOrigin, 'Origin', (value) => {
            angleChangeCallback(undefined, rotationOrigin);
        }, { rowClassName: 'rowFlex' })

        let range = components.createRange(angleRange, 'Angle', () => {}, (value) => {
            //console.log(angleRange.current);
            angleValue.value = value.toString();
            angleChangeCallback(angleRange.current);
        }, { rowClassName: 'rowFlex' });

        let applyBtn = htmlUtils.createElement('input', {
            attributes: { 
                type: 'button', 
                value: 'Apply' 
            },
            events: { 
                click: function(e) { 
                    applyCallback();
                } }
        });

        container.appendChild(angleValueWrapper);
        container.appendChild(range);
        container.appendChild(rOrigin);
        container.appendChild(applyBtn);

        return container;
    }
}