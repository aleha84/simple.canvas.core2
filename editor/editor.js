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
                            selected: false,
                            id: 'main_0',
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                            fill: false,
                            closePath: true,
                            type: 'lines',
                            pointsEl: undefined,
                            pointEl: undefined,
                            points: [
                                {
                                    id: 'main_0_point_0',
                                    order: 0,
                                    point: {x: 1, y: 1},
                                },
                                {
                                    id: 'main_0_point_1',
                                    order: 1,
                                    point: {x: 9, y: 4},
                                },
                                {
                                    id: 'main_0_point_2',
                                    order: 2,
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
        let that = this;
        let i = this.image;
        let layerMapper = (l) => {
            return {
                order: l.order,
                selected: l.selected,
                type: l.type,
                strokeColor: l.strokeColor,
                closePath: l.closePath,
                points: l.points.map((p) => {
                    return {
                        point: new V2(p.point),
                        selected: p.selected,
                        changeCallback(value) {
                            p.point.x = value.x;
                            p.point.y = value.y;
                            //console.log(this, value)
                            //that.updateEditor();
                            //components.fillPoints(l.pointsEl, l.pointEl, l.points, that.updateEditor.bind(that));

                            let select = l.pointsEl.querySelector('select');
                            if(select){
                                for(let i = 0; i < select.options.length;i++){
                                    select.options[i].selected = select.options[i].value == p.id;
                                }

                                select.dispatchEvent(new Event('change'));
                            }
                            
                            l.points.forEach(_p => p.selected = false);
                            p.selected = true;
                        },
                        selectCallback() {
                            let select = l.pointsEl.querySelector('select');
                            if(select){
                                for(let i = 0; i < select.options.length;i++){
                                    select.options[i].selected = select.options[i].value == p.id;
                                }

                                select.dispatchEvent(new CustomEvent('change', { detail: 'skipSelectChangeCallback' }));
                            }
                            
                            l.points.forEach(_p => p.selected = false);
                            p.selected = true;
                        }
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
            callbacks: {
                
                select: function(e){ 
                    main.layers.forEach(l => l.selected = false);
                    let layer = main.layers.find(l => l.id == e.target.value);
                    layer.selected = true;
                    components.createLayer(layerEl, layer, that.updateEditor.bind(that));  
                },
                reset: function(e) { 
                    main.layers.forEach(l => l.selected = false);
                    components.createLayer(layerEl, undefined, that.updateEditor.bind(that)) 
                },
                changeCallback: that.updateEditor.bind(that)
            }
        }))
        let layerEl = htmlUtils.createElement('div', {className: 'layer'});
        mainEl.appendChild(layerEl)

        main.element = mainEl;
        
        this.parentElement.appendChild(main.element);
    }

    

    // appendList(parent, listProps) {
    //     parent.appendChild(this.createList(listProps));
    // }

    

    

    
}