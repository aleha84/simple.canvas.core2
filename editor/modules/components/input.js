components.createInput = function(value, title, changeCallback, validation, params = { editBlockType: 'text', editWidth: undefined, classNames: [] }){
    let classNames = [
        'inputBox', 'rowFlex',
        ...(params.classNames ? params.classNames: [])
    ]

    let el = htmlUtils.createElement('div', { classNames });

    if(title){    
        el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
    }

    el.appendChild((() => {
        if(value === 0){
            value = "0";
        }

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

            let editblockStyles = {}
            if(params.editWidth) {
                editblockStyles.width = params.editWidth + 'px'
            }
            editBlock.appendChild(htmlUtils.createElement('input', { className: 'newValue', value: value, attributes: { type: params.editBlockType }, styles: editblockStyles }));

            editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
            events: { click: (event) => {
                let newValue = editBlock.querySelector('.newValue').value;

                if(validation && !validation(newValue)){
                    notifications.error('Validation for value:' + newValue + ' failed');
                    return;
                }

                readBlock.innerText = newValue;
                value = newValue;
                el.value = newValue;
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

    el.value = value;

    return el;
}