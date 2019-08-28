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
                    currentId: 1,
                    layers: [
                        {
                            order: 0,
                            selected: false,
                            id: 'main_0',
                            clear: false,
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
        this.createImage();
    }

    createImage() {
        this.createGeneral();
        this.createMain();

        this.updateEditor();
    }

    updateEditor() {
        this.renderCallback(this.prepareModel());
    }

    exportModel(pretty, clean) {
        let model = JSON.stringify(this.prepareModel(), (k,v) => {
            if(k == 'editor' || k == 'selected')
                return undefined;
            
            return v;
        }, pretty? 4: null);

        if(!clean)
            return `let model = ${model}
            
    let img = PP.createImage(model);
            `
        else 
            return model;
    }
    prepareModel(model) {
        let that = model || this;
        let i = that.image;
        let e = that.editor;
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
                clear: l.clear,
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
                    
                    if(l.currentId == undefined){
                        l.currentId = 0;
                    }

                    l.points.push({
                        id: `${l.id}_point_${l.currentId++}`,
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
        let createCloseButtonAndAddOverlay = function(containerEl){
            that.controls.overlayEl.appendChild(containerEl);
            that.controls.overlayEl.appendChild(htmlUtils.createElement('input',{
                value: 'Close', className:'close', attributes: { type: 'button' }, events: {click: function() {
                    that.controls.overlayEl.remove();
                    that.controls.overlayEl = undefined;
                }}
            }))
            that.parentElement.appendChild(that.controls.overlayEl);
        }

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Import', attributes: { type: 'button' }, events: {
            click: function(){
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'export'] });
                let textarea = htmlUtils.createElement('textarea', {
                    value: '',
                    attributes: {
                        resize: false
                    }
                });

                containerEl.appendChild(textarea);

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Ok', attributes: { type: 'button' }, events: {
                    click: function(){
                        if(!textarea.value)
                            return;

                        let image = undefined;
                        try{
                            image = JSON.parse(textarea.value);
                        }
                        catch(e){
                            alert('Entered value is invalid.\n' + e.message);
                            return;
                        }
                        // image.general = assignDeep({}, {
                        //     zoom: {current: 10, max: 10, min: 1, step: 1},
                        //     showGrid: false,
                        //     element: undefined
                        // }, image.general);
                        image.general.element = that.image.general.element;
                        image.general.zoom =  {current: 10, max: 10, min: 1, step: 1};

                        image.main.currentId = image.main.layers.length;
                        image.main.layers = image.main.layers.map((l,i) => assignDeep({}, {
                            selected: false,
                            order: i,
                            id: `main_${i}`,
                            clear: false,
                            strokeColor: '#FF0000',
                            fillColor: '#FF0000',
                            fill: false,
                            closePath: false,
                            type: 'dots',
                            pointsEl: undefined,
                            pointEl: undefined,
                            visible: true,
                            currentId: l.points.length
                        }, 
                        {...l, points: l.points.map((p,j) => assignDeep({}, {
                            id: `main_${i}_point_${j}`,
                            order: j,
                        }, p))}));
                        image.main.element = that.image.main.element;

                        /*

                        */

                        that.image = image;

                        that.createImage();

                        // that.controls.savedAs = selectedEl.saveName;
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }
                } }))
                createCloseButtonAndAddOverlay(containerEl);
            }
        } }));

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Export', attributes: { type: 'button' }, events: {
            click: function(){
                let pretty = true;
                let clean = false;
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'export'] });
                let textarea = htmlUtils.createElement('textarea', {
                    value: that.exportModel(pretty, clean),
                    attributes: {
                        resize: false,
                        readonly: 'readonly'
                    }
                });

                containerEl.appendChild(components.createCheckBox(true, 'Pretty', (value) => {
                    pretty = value;
                    textarea.value = that.exportModel(value, clean);
                }))

                containerEl.appendChild(components.createCheckBox(false, 'Clean', (value) => {
                    clean = value;
                    textarea.value = that.exportModel(pretty, value);
                }))

                containerEl.appendChild(textarea);
                createCloseButtonAndAddOverlay(containerEl);
            }
        } }));

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Load', attributes: { type: 'button' }, events: {
            click: function(){
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'load'] });

                let list = htmlUtils.createElement('div', { className: 'saveList'})
                let lsItem = localStorage.getItem('editorSaves');
                if(!lsItem){
                    lsItem = [];
                }
                else {
                    lsItem = JSON.parse(lsItem);
                }

                let items = []
                let selectedEl = undefined;
                for(let save of lsItem){
                    let saveItem = htmlUtils.createElement('div', { className: 'saveListItem', events: { click: function(){ 
                        selectedEl = this;
                        items.forEach(el => el.classList.remove('selected')); 
                        this.classList.add('selected'); } }})
                    saveItem.appendChild(htmlUtils.createElement('span', { className: 'name', text: save.name }));
                    saveItem.appendChild(htmlUtils.createElement('span', { className: 'date', text: save.datetime }));
                    saveItem.appendChild(htmlUtils.createElement('img', { className: 'image', attributes: { src: PP.createImage(that.prepareModel(save.content)).toDataURL() }}))

                    saveItem.content = save.content;
                    saveItem.saveName = save.name;
                    list.appendChild(saveItem)
                    items.push(saveItem);
                }

                containerEl.appendChild(list);

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Ok', attributes: { type: 'button' }, events: {
                    click: function(){
                        if(!selectedEl)
                            return;

                        //console.log(selectedEl.content);
                        let image = selectedEl.content.image;
                        image.main.element = that.image.main.element;
                        image.general.element = that.image.general.element;
                        image.main.layers.forEach(l => {l.selected = undefined;} )

                        that.image = image;

                        that.createImage();

                        that.controls.savedAs = selectedEl.saveName;
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }
                } }))

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Cancel', attributes: { type: 'button' }, events: {
                    click: function(){
                        that.controls.overlayEl.remove();
                        that.controls.overlayEl = undefined;
                    }
                } }))

                createCloseButtonAndAddOverlay(containerEl);
            }
        }}));

        controlsEl.appendChild(htmlUtils.createElement('input', { value: 'Save', attributes: { type: 'button' }, events: {
            click: function(){
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'save'] });

                let saveNameInput = htmlUtils.createElement('input', { value: that.controls.savedAs || '', attributes: { type: 'text' } });

                containerEl.appendChild(saveNameInput);

                containerEl.appendChild(htmlUtils.createElement('input', { value: 'Ok', attributes: { type: 'button' }, events: {
                    click: function(){
                        let saveName = saveNameInput.value;
                        if(!saveName)
                            return;

                        let lsItem = localStorage.getItem('editorSaves');
                        if(!lsItem){
                            lsItem = [];
                        }
                        else {
                            lsItem = JSON.parse(lsItem);
                        }

                        that.controls.savedAs = saveNameInput.value;

                        let saved = lsItem.filter(l => l.name == that.controls.savedAs);

                        let now = new Date();
                        if(saved.length){
                            saved[0].datetime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
                            saved[0].content = that;
                        }
                        else {
                            lsItem.push({
                                name: saveNameInput.value,
                                datetime: new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString(), //new Date().toISOString(),
                                content: that
                            });    
                        }
                        
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

                createCloseButtonAndAddOverlay(containerEl);
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
                move(select, direction) {
                    let selectedValue = select.value;
                    let l = main.layers.filter(l => l.id == selectedValue); 
                    if(!l.length)
                        return;
                    else 
                        l = l[0];

                    let currentIndex = main.layers.indexOf(l);
                    if((direction == -1 && currentIndex == 0) || (direction == 1 && currentIndex == main.layers.length-1))
                        return;

                    components.array_move(main.layers, currentIndex, currentIndex + direction);
                    main.layers.forEach((l, i) => l.order = i);

                    select.options.length = 0;
                    for(let l of main.layers){
                        select.options[select.options.length] = new Option(l.id, l.id);
                    }

                    select.value = selectedValue;
                    that.updateEditor.call(that);
                },
                add: function(e, select){
                    main.layers.forEach(l => l.selected = false);
                    let layer = {
                        selected: true,
                        order: main.layers.length,
                        id: `main_${main.currentId++}`,
                        clear: false,
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