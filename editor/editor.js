class Editor {
    constructor(options = {}){
        assignDeep(this, {}, options);
        if(!this.parentElementSelector && !this.parentElement){
            console.trace();
            throw 'No parent element specified for editor'
        }

        if(!this.parentElement){
            this.parentElement = document.querySelector(this.parentElementSelector);
            if(!this.parentElement)
                throw 'No parent element specified for editor. Selector: ' + this.parentElementSelector;
        }

        this.init();
    }

    init() {
        this.appendList(this.parentElement, {
            title: 'test list box',
            items: [
                {title: 'test1', value: 'value1'},
                {title: 'test2', value: 'value2'},
                {title: 'test3', value: 'value3'}
            ]
        })
    }

    appendList(parent, listProps) {
        parent.appendChild(this.createList(listProps));
    }

    createList(listProps) {
        let lb = document.createElement('div');
        lb.classList.add('listbox');

        lb.appendChild((() => { let p = document.createElement('p'); p.classList.add('title'); p.innerText = listProps.title; return p; })());
        let select = document.createElement('select');
        select.setAttribute('size', listProps.maxSize || 10);
        for(let item of listProps.items){
            select.options[select.options.length] = new Option(item.title || item.text, item.value);
            // select.appendChild((() => {

            // })())
        }

        select.addEventListener('change', listProps.callback || function(e){ console.log(this.value)});

        lb.append(select);

        return lb;
    }
}