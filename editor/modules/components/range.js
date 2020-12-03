components.createRange = function(value, title, changeCallback, inputCallback, params = {}) {
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
}