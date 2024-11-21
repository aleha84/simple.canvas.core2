components.createSelect = function(value, options, title, changeCallback, props = { classNames: [] }){
    let classNames = [
        'select', 'row',
        ...props.classNames
    ]

    let el = htmlUtils.createElement('div', { classNames });
    if(title){    
        el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
    }

    let select = htmlUtils.createElement('select', { events: {
        change: (event) => {
            changeCallback(event.target.value);
        }
    } });


    let createSelectOptions = (options) => {
        select.length = 0;

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
    }

    createSelectOptions(options)

    el.appendChild(select);
    el.selectElement = select;
    el.createSelectOptions = createSelectOptions;

    return el;
}