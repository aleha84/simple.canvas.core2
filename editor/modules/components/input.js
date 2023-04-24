components.createInput = function(value, title, changeCallback, validation, params = { editBlockType: 'text' }){
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

            editBlock.appendChild(htmlUtils.createElement('input', { className: 'newValue', value: value, attributes: { type: params.editBlockType } }));

            editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
            events: { click: (event) => {
                let newValue = editBlock.querySelector('.newValue').value;

                if(validation && !validation(newValue))
                    return;

                readBlock.innerText = newValue;
                value = newValue;
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
}