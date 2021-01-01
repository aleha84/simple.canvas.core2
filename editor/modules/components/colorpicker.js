components.createColorPicker = function(value, title, changeCallback, params = {readOnly: false, classNames: []}){
    let el = htmlUtils.createElement('div', { classNames: ['colorPicker', 'row', ...params.classNames] });
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
}