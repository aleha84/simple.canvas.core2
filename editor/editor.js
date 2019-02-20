class Editor {
    constructor(options = {}){
        assignDeep(this, {
            editor: {
                element: undefined,
                mode: {
                    value: 'edit',
                    element: undefined,
                    setValue(value) {
                        value = value || this.value;
                        this.value = value

                        if(value == 'add'){
                            this.element.value = '"Add points" mode';
                        }
                        else if(value == 'edit') {
                            this.element.value = '"Edit points" mode';
                        }
                    },
                    toggle() {
                        this.setValue(this.value == 'add' ? 'edit' : 'add');
                    }
                },
                setModeState(buttonState, modeValue){
                    this.mode.element.disabled = !buttonState;
                    this.mode.setValue(modeValue);
                }
            },
            image: {
                general: {
                    originalSize: {x: 20, y: 20},//new V2(10, 10),
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
                            closePath: false,
                            type: 'lines',
                            pointsEl: undefined,
                            pointEl: undefined,
                            points: [
                                // {
                                //     id: 'main_0_point_0',
                                //     order: 0,
                                //     point: {x: 1, y: 1},
                                // },
                                // {
                                //     id: 'main_0_point_1',
                                //     order: 1,
                                //     point: {x: 9, y: 4},
                                // },
                                // {
                                //     id: 'main_0_point_2',
                                //     order: 2,
                                //     point: {x: 3, y: 8},
                                // }
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
        this.createEditor();
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
        let e = this.editor;
        let layerMapper = (l) => {
            return {
                order: l.order,
                selected: l.selected,
                type: l.type,
                strokeColor: l.strokeColor,
                fillColor: l.fillColor,
                closePath: l.closePath,
                fill: l.fill,
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
                                    if(select.options[i].selected){
                                        select.options[i].text = `x: ${p.point.x}, y: ${p.point.y}`
                                    }
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
                }),
                addPointCallback(p) {
                    let callback = that.updateEditor.bind(that);
                    l.points.push({
                        id: `${l.id}_point_${l.points.length}`,
                        order: l.points.length,
                        point: {x: p.x, y: p.y},
                    })
                    components.fillPoints(l.pointsEl, l.pointEl, l.points, that.updateEditor.bind(that))
                    callback();
                }
            }
        }
        
        return {
            editor: {
                mode: e.mode.value
            },
            general: {
                originalSize: new V2(i.general.originalSize),
                size: new V2(i.general.originalSize),
                zoom: i.general.zoom.current,
                showGrid: i.general.showGrid, 
            },
            main: {
                layers: i.main.layers.map(layerMapper)
            }
        }
    }

    createEditor() {
        let { editor } = this;
        let that = this;
        if(editor.element){
            editor.element.remove();
        }

        let editorlEl = htmlUtils.createElement('div', { className: 'editorBlock' });
        let modeSwitch = htmlUtils.createElement('div', { className: 'modeSwitch' });
        let modeSwitchButton = htmlUtils.createElement('input', { 
            value: '"Edit points" mode', 
            attributes: { type: 'button' }, 
            props: {disabled: true},
            events: {
                click: () => {
                    that.editor.mode.toggle();
                    that.updateEditor();
                }
            }
        })

        modeSwitch.appendChild(modeSwitchButton);
        editorlEl.appendChild(modeSwitch)
        
        editor.element = editorlEl;
        editor.mode.element = modeSwitchButton;
        this.parentElement.appendChild(editor.element);
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
                    that.editor.setModeState(true, 'edit');
                },
                reset: function(e) { 
                    main.layers.forEach(l => l.selected = false);
                    components.createLayer(layerEl, undefined, that.updateEditor.bind(that)) 
                    that.editor.setModeState(false, 'edit');
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