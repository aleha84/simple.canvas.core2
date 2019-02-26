class Editor {
    constructor(options = {}){
        assignDeep(this, {
            controls: {
                savedAs: undefined,
                overlayEl: undefined,
            },
            editor: {
                element: undefined,
                mode: {
                    value: 'edit',
                    element: undefined,
                    stateElement: undefined,
                    setValue(value) {
                        value = value || this.value;
                        this.value = value

                        if(value == 'add'){
                            this.stateElement.innerText = '"Add points" mode';
                        }
                        else if(value == 'edit') {
                            this.stateElement.innerText = '"Edit points" mode';
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
                            visible: true,
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
        this.createControlButtons();   
        this.createEditor();
        this.createGeneral();
        this.createMain();

        this.updateEditor();
    }

    updateEditor() {
        this.renderCallback(this.prepareModel());
    }

    exportModel(pretty) {
        return `let model = ${JSON.stringify(this.prepareModel(), (k,v) => {
            if(k == 'editor')
                return undefined;
            
            return v;
        }, pretty? 4: null)}
        
let img = PP.createImage(model);
        `
        //createCanvas(new V2())
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
                visible: l.visible,
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
                    components.fillPoints(l, that.updateEditor.bind(that))
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

    createControlButtons() {
        let that = this;
        let controlsEl = htmlUtils.createElement('div', { className: 'mainControlsBlock' });

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Export', attributes: { type: 'button' }, events: {
            click: function(){
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'export'] });
                let textarea = htmlUtils.createElement('textarea', {
                    value: that.exportModel(true),
                    attributes: {
                        resize: false,
                        readonly: 'readonly'
                    }
                });

                containerEl.appendChild(components.createCheckBox(true, 'Pretty', (value) => {
                    textarea.value = that.exportModel(value);
                }))
                containerEl.appendChild(textarea);
                that.controls.overlayEl.appendChild(containerEl);
                that.controls.overlayEl.appendChild(htmlUtils.createElement('input',{
                    value: 'Close', className:'close', attributes: { type: 'button' }, events: {click: function() {
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }}
                }))
                that.parentElement.appendChild(that.controls.overlayEl);
            }
        } }));

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Save', attributes: { type: 'button' }, events: {
            click: function(){
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'save'] });

                let saveNameInput = htmlUtils.createElement('input', { value: that.controls.savedAs || '', attributes: { type: 'text' } });

                containerEl.appendChild(saveNameInput);

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Ok', attributes: { type: 'button' }, events: {
                    click: function(){
                        var lsItem = localStorage.getItem('editorSaves');
                        if(!lsItem){
                            lsItem = [];
                        }
                        else {
                            lsItem = JSON.parse(lsItem);
                        }

                        that.controls.savedAs = saveNameInput.value;
                        lsItem.push({
                            name: saveNameInput.value,
                            datetime: new Date().toISOString(),
                            content: that
                        });

                        localStorage.setItem('editorSaves', JSON.stringify(lsItem));

                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }
                } }));

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Cancel', attributes: { type: 'button' }, events: {
                    click: function(){
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }
                } }))

                that.controls.overlayEl.appendChild(containerEl);
                that.controls.overlayEl.appendChild(htmlUtils.createElement('input',{
                    value: 'Close', className:'close', attributes: { type: 'button' }, events: {click: function() {
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }}
                }))
                that.parentElement.appendChild(that.controls.overlayEl);
            }
        } }));

        this.parentElement.appendChild(controlsEl);
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
            value: 'Toggle mode', 
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
        editor.mode.stateElement = htmlUtils.createElement('span', { className: 'stateName', text: '"Edit points" mode' });
        modeSwitch.appendChild(editor.mode.stateElement);
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
                    that.editor.setModeState(true, e.detail == 'setModeStateToAdd' ? 'add' : 'edit');
                    components.createLayer(layerEl, layer, that.updateEditor.bind(that));  
                },
                reset: function(e) { 
                    main.layers.forEach(l => l.selected = false);
                    components.createLayer(layerEl, undefined, that.updateEditor.bind(that)) 
                    that.editor.setModeState(false, 'edit');
                },
                remove(e, select) {
                    main.layers = main.layers.filter(l => l.id != select.value);  
                    main.layers.forEach((l, i) => l.order = i);
                    select.options.length = 0;
                    for(let l of main.layers){
                        select.options[select.options.length] = new Option(l.id, l.id);
                    }
                    select.value = undefined;
                    components.createLayer(layerEl, undefined, that.updateEditor.bind(that)) 
                    that.editor.setModeState(false, 'edit');
                },
                add: function(e, select){
                    main.layers.forEach(l => l.selected = false);
                    let layer = {
                        selected: true,
                        order: main.layers.length,
                        id: `main_${main.layers.length}`,
                        strokeColor: '#FF0000',
                        fillColor: '#FF0000',
                        fill: false,
                        closePath: false,
                        type: 'dots',
                        pointsEl: undefined,
                        pointEl: undefined,
                        visible: true,
                        points: []
                    }
                    main.layers.push(layer);
                    select.options[select.options.length] = new Option(layer.id, layer.id);
                    select.value = layer.id;
                    select.dispatchEvent(new CustomEvent('change', { detail: 'setModeStateToAdd' }));
                    //that.editor.setModeState(true, 'add');
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