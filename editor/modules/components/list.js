components.createList = function(listProps) {
    let selected = false;
    let lb = htmlUtils.createElement('div', { classNames: ['listbox', listProps.className] });
    lb.appendChild(htmlUtils.createElement('p', { className: 'title', text: listProps.title }));
    let selectHolder = htmlUtils.createElement('div', { className: 'selectHolder'});
    
    let styles = undefined;
    if(listProps.resizable) {
        styles = {
            "resize": "vertical",
            "min-height": "90px"
        }
    }

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
    }, styles });

    // if(listProps.resizable) {
    //     new ResizeObserver(() => {
    //         if(select.clientHeight < 90) {
    //             select.style.height = '90px';
    //         }
    //     }).observe(select);
    // }

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
}