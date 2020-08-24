components.createV2 = function(value, title, changeCallback, params = {}) {
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
}