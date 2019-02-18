var components = {
    createRange(value, title, changeCallback) {
        let el = htmlUtils.createElement('div', { classNames: ['range', 'row'] });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            let currentValueElement = htmlUtils.createElement('span', { className: 'current', text: value.current })
            divValue.appendChild(htmlUtils.createElement('input', { 
                attributes: { type: 'range', min: value.min, max: value.max, step: value.step }, value: value.current,
                events: {
                    change: (event) => {
                        currentValueElement.innerText = event.target.value;
                        value.current = parseInt(event.target.value);
                        changeCallback();
                    }
                }
             }))

             divValue.appendChild(currentValueElement);

             return divValue;
        })());

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

        el.appendChild(htmlUtils.createElement('input', {attributes: { type: 'color'}, props: { value }, events: {
            change: (event) => {
                changeCallback(event.target.value);
            }
        } }))

        return el;
    },
    createList(listProps) {
        
        let lb = htmlUtils.createElement('div', { className: 'listbox' });
        lb.appendChild(htmlUtils.createElement('p', { className: 'title', text: listProps.title }));
        let selectHolder = htmlUtils.createElement('div', { className: 'selectHolder'});
        let select = htmlUtils.createElement('select', { attributes: { size: listProps.maxSize || 10 }, events: {
            change: function(e) { 
                if(listProps.callbacks.select)
                    listProps.callbacks.select(e)
                else 
                    console.log(e.target.value)
         }
        } });

        for(let item of listProps.items){
            select.options[select.options.length] = new Option(item.title || item.text, item.value);
        }

        selectHolder.append(select);

        let sControls = htmlUtils.createElement('div', { className: 'selectControls'});
        sControls.append(
            htmlUtils.createElement('input', 
                { 
                    attributes: { 
                        type: 'button', 
                        value: 'reset' 
                    }, 
                    events: { 
                        click: function(e) { 
                            select.options.selectedIndex = -1;
                            listProps.callbacks.reset(e);
                        } } }))

        selectHolder.append(sControls)
        lb.append(selectHolder);

        return lb;
    },

    createLayer(layerEl, layerProps, changeCallback) {
        htmlUtils.removeChilds(layerEl);

        if(layerProps == undefined) {
            changeCallback();
            return;
        }

        layerEl.appendChild(htmlUtils.createElement('div', { text: layerProps.id }))
        layerEl.appendChild(this.createColorPicker(layerProps.strokeColor, 'Stroke color', (color) => {
            layerProps.strokeColor = color;
            changeCallback();
        }));

        layerEl.appendChild(components.createCheckBox(layerProps.closePath, 'Close path', function(value) {
            layerProps.closePath = value;
            changeCallback();
        }));

        layerEl.appendChild(components.createCheckBox(layerProps.fill, 'Fill', function(value) {
            layerProps.fill = value;
            changeCallback();
        }));

        layerEl.appendChild(components.createSelect(layerProps.type, ['dots','lines'],'Type', function(value){
            layerProps.type = value;
            changeCallback();
        } ))

        layerProps.pointsEl = htmlUtils.createElement('div', { className: 'pointsListWrapper' });
        layerProps.pointEl = htmlUtils.createElement('div', { className: 'point'});
        layerEl.appendChild(layerProps.pointsEl);
        layerEl.appendChild(layerProps.pointEl);

        this.fillPoints(layerProps.pointsEl, layerProps.pointEl, layerProps.points, changeCallback)

        changeCallback();
    },

    fillPoints(pointsEl,pointEl, points, changeCallback) {
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

        pointsEl.appendChild(components.createList({
            title: 'Points',
            items: points.map(p => {return { title: `x: ${p.point.x}, y: ${p.point.y}`, value: p.id }}),
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

                    fillPoint(selectedPoint,selectedOption, changeCallback, e.detail);  
                },
                reset: function(e) { 
                    points.forEach(p => p.selected = false);
                    fillPoint(undefined, undefined, changeCallback, '') 
                },
                changeCallback: changeCallback
            }
        }))
    }
}