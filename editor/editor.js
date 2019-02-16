class Editor {
    constructor(options = {}){
        assignDeep(this, {
            image: {
                general: {
                    originalSize: {x: 10, y: 10},//new V2(10, 10),
                    zoom: {current: 10, max: 10, min: 1, step: 1},
                    showGrid: false,
                    element: undefined
                },
                main: {
                    element: undefined,
                    layers: [
                        {
                            order: 0,
                            id: 'main_0',
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                            closePath: true,
                            type: 'lines',
                            points: [
                                {
                                    point: {x: 1, y: 1},
                                },
                                {
                                    point: {x: 9, y: 4},
                                },
                                {
                                    point: {x: 3, y: 8},
                                }
                            ]
                        }
/* layer props
order: int,
id: string,
strokeColor: string (rgb,rgba,#),
fillColor: string (rgb,rgba,#),
closePath: boolean,
points: [{
    point: V2,
    color: string (rgb,rgba,#),
    opacity: float 0 - 1
}] 
 
*/
                    ]
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
        this.createMain();
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

    prepareModel() {
        let i = this.image;
        let layerMapper = (l) => {
            return {
                order: l.order,
                type: l.type,
                strokeColor: l.strokeColor,
                points: l.points.map((p) => {
                    return {
                        point: new V2(p.point)
                    }
                })
            }
        }
        return {
            general: {
                originalSize: new V2(i.general.originalSize),
                size: new V2(i.general.originalSize),
                zoom: i.general.zoom.current,
                showGrid: i.general.showGrid
            },
            main: {
                layers: i.main.layers.map(layerMapper)
            }
        }
    }

    createGeneral() {
        let { general } = this.image;
        if(general.element){
            general.element.remove();
        }

        
        let generalEl = htmlUtils.createElement('div', { className: 'general' });
        generalEl.appendChild(components.createV2(general.originalSize, 'Size', this.updateEditor.bind(this)));
        generalEl.appendChild(components.createRange(general.zoom, 'Zoom', this.updateEditor.bind(this)));
        generalEl.appendChild(components.createCheckBox(general.showGrid, 'Show grid', function(value) {
            general.showGrid = value;
            this.updateEditor();
        }.bind(this)));

        general.element = generalEl;
        
        this.parentElement.appendChild(general.element);
    }

    createMain() {
        let { main } = this.image;
        let that = this;
        if(main.element){
            main.element.remove();
        }

        let mainEl = htmlUtils.createElement('div', { className: 'main' });
        mainEl.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Main image properties' }))
        mainEl.appendChild(components.createList({
            title: 'Layers',
            items: main.layers.map(l => {return { title: l.id, value: l.id }}),
            callback: function(e){ that.createLayer(layerEl, main.layers.find(l => l.id == this.value)); }
        }))
        let layerEl = htmlUtils.createElement('div', {className: 'layer'});
        mainEl.appendChild(layerEl)

        main.element = mainEl;
        
        this.parentElement.appendChild(main.element);
    }

    createLayer(layerEl, layerProps) {
        htmlUtils.removeChilds(layerEl);

        if(layerProps == undefined)
            return;

        layerEl.appendChild(htmlUtils.createElement('div', { text: layerProps.id }))
    }

    // appendList(parent, listProps) {
    //     parent.appendChild(this.createList(listProps));
    // }

    

    

    
}