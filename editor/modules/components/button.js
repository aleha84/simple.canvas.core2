components.createButton = function(title, callback, params = { classNames: [] }){
    let button = htmlUtils.createElement('input', { classNames: params.classNames, attributes: { type: 'button' }, 
    events: { click: (event) => {
        callback(event)
    } }, value: title });

    return button;
}