components.createCheckBox = function(value, title, changeCallback, params = { classNames: undefined, titleClassNames: undefined }){
    let classNames = params.classNames || ['checkbox', 'row'];
    let el = htmlUtils.createElement('div', { classNames });
    if(title){  
        let classNames = ['title'];
        if(params.titleClassNames) {
            classNames = [
                ...classNames,
                ...params.titleClassNames
            ]
        } 
        el.appendChild(htmlUtils.createElement('div', { classNames, text: title }))
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