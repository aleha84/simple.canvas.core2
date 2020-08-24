components.createCheckBox = function(value, title, changeCallback){
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
}