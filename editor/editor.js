class Editor {
    constructor(options = {}){
        assignDeep(this, {
            image: {
                general: {
                    originalSize: new V2(10, 10),
                    zoom: {current: 1, max: 10, min: 1, step: 1},
                    element: undefined
                }
            },
            parentElementSelector: '',
            parentElement: undefined,
            renderCallback: function(){ console.log(this) }
        }, options);
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

        this.createGeneral();
        // this.appendList(this.parentElement, {
        //     title: 'test list box',
        //     items: [
        //         {title: 'test1', value: 'value1'},
        //         {title: 'test2', value: 'value2'},
        //         {title: 'test3', value: 'value3'}
        //     ]
        // })

        this.updateEditor();
    }

    updateEditor() {
        this.renderCallback(this.prepareModel());
    }

    createGeneral() {
        let { general } = this.image;
        if(general.element){
            general.element.remove();
        }

        
        let generalEl = htmlUtils.createElement('div', { className: 'general' });
        generalEl.appendChild(this.createV2(general.originalSize, 'Size', this.updateEditor.bind(this)));
        generalEl.appendChild(this.createRange(general.zoom, 'Zoom', this.updateEditor.bind(this)));

        general.element = generalEl;
        
        this.parentElement.appendChild(general.element);
    }

    prepareModel() {
        let i = this.image;
        return {
            general: {
                size: i.general.originalSize,
                zoom: i.general.zoom.current
            }
        }
    }

    appendList(parent, listProps) {
        parent.appendChild(this.createList(listProps));
    }

    createRange(value, title, changeCallback) {
        let el = htmlUtils.createElement('div', { className: 'range' });
        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            let currentValueElement = htmlUtils.createElement('span', { className: 'current', text: value.current })
            divValue.appendChild(htmlUtils.createElement('input', { 
                attributes: { type: 'range', min: value.min, max: value.max, step: value.step }, value: value.current,
                events: {
                    change: (event) => {
                        currentValueElement.innerText = event.target.value;
                        value.current = parseInt(event.target.value);
                        changeCallback();
                    }
                }
             }))

             divValue.appendChild(currentValueElement);

             return divValue;
        })());

        return el;
    }

    createV2(value, title, changeCallback) {
        let el = htmlUtils.createElement('div', { className: 'V2' });

        if(title){    
            el.appendChild(htmlUtils.createElement('div', { className: 'title', text: title }))
        }

        el.appendChild((() => {
            
            let divValue = htmlUtils.createElement('div', { className: 'value' })
            divValue.appendChild(htmlUtils.createElement('span', { className: 'read', text: value.toString() }));
            divValue.appendChild(htmlUtils.createElement('div', { className: 'edit' }));

            divValue.addEventListener('click', function(e) {
                if(this.classList.contains('edit'))
                    return;

                this.classList.add('edit');

                let editBlock = this.querySelector('.edit');
                let readBlock = this.querySelector('.read');
                htmlUtils.removeChilds(editBlock);

                editBlock.appendChild(htmlUtils.createElement('span', { text: 'x' }));
                editBlock.appendChild(htmlUtils.createElement('input', { className: 'x', value: value.x }));
                editBlock.appendChild(htmlUtils.createElement('span', { text: 'y' }));
                editBlock.appendChild(htmlUtils.createElement('input', { className: 'y', value: value.y }));

                editBlock.appendChild(htmlUtils.createElement('input', { attributes: { type: 'button' }, 
                events: { click: (event) => {
                    value.x = parseInt(editBlock.querySelector('.x').value);
                    value.y = parseInt(editBlock.querySelector('.y').value);
                    readBlock.innerText = value.toString();
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