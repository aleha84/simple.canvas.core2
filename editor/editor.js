class Editor {
    constructor(options = {}){
        assignDeep(this, {
            controls: {
                savedAs: undefined,
                overlayEl: undefined,
            },
            editor: {
                element: undefined,
                selected: {
                    //selectedFrame: undefined,
                    layerId: undefined,
                    groupId: undefined,
                    pointId: undefined,
                },
                removeSelectedPoint: undefined,
                mode: {
                    value: 'edit',
                    element: undefined,
                    moveGroupElement: undefined,
                    moveLayerElement: undefined,
                    stateElement: undefined,
                    setValue(value) {
                        value = value || this.value;
                        this.value = value
                        let text = '';

                        switch(value){
                            case 'add':
                                text = '"Add points" mode'; break;
                            case 'edit':
                                text = '"Edit points" mode'; break;
                            case 'movegroup':
                                text = '"Move group" move'; break;
                        }
                        
                        this.stateElement.innerText = text;
                    },
                    toggle() {
                        this.setValue(this.value == 'add' ? 'edit' : 'add');
                    },
                    toggleMoveGroup() {
                        this.setValue(this.value == 'movegroup' ? 'edit' : 'movegroup');
                    },
                    toggleMoveLayer() {
                        this.setValue(this.value == 'movelayer' ? 'edit' : 'movelayer');
                    }
                },
                getModeState() {
                    return { disabled: this.mode.element.disabled, mode: this.mode.value }
                },
                setModeState(buttonState, modeValue){
                    this.mode.element.disabled = !buttonState;
                    //this.mode.moveGroupElement.disabled = !buttonState;
                    this.mode.setValue(modeValue);
                },
                setMoveGroupModeState(buttonState, modeValue) {
                    this.mode.moveGroupElement.disabled = !buttonState;
                    if(modeValue)
                        this.mode.setValue(modeValue);
                },
                setMoveLayerModeState(buttonState, modeValue) {
                    this.mode.moveLayerElement.disabled = !buttonState;
                    if(modeValue)
                        this.mode.setValue(modeValue);
                }
            },
            image: {
                general: {
                    originalSize: {x: 20, y: 20},//new V2(10, 10),
                    zoom: {current: 10, max: 10, min: 1, step: 1},
                    showGrid: false,
                    animated: false,
                    element: undefined,
                    backgroundColor: '#000000'
                },
                main: {
                    element: undefined,
                    currentLayerId: 1,
                    layers: [
                        assignDeep(
                            {}, 
                            modelUtils.createDefaultLayer('m_0', 0), 
                            { 
                                currentGroupId: 1, 
                                groups: [
                                    modelUtils.createDefaultGroup('m_0_g_0', 0)
                                ] 
                            }),
                        // {
                        //     order: 0,
                        //     currentGroupId: 1,
                        //     selected: false,
                        //     id: 'main_0',
                        //     name: '',
                        //     visible: true,
                        //     groupsEl: undefined,
                        //     groupEl: undefined,
                        //     groups: [
                        //         modelUtils.createDefaultGroup('main_0_group_0', 0)
                        //     ]
                        // }
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
        components.editor = this;
        this.createControlButtons();   
        this.createEditor();
        this.createImage();

        addListenerMulti(window, 'orientationchange resize', function(e){
            this.controlsHeightSet();
        }.bind(this));
    }

    controlsHeightSet() {
        let heightLeft = document.getElementsByClassName('controlsWrapper')[0].clientHeight - document.getElementsByClassName('layersWrapper')[0].offsetTop;
        if(heightLeft < 1050){
            document.getElementsByClassName('layersWrapper')[0].style.height = heightLeft+'px';
        }
        else {
            document.getElementsByClassName('layersWrapper')[0].style.height = null;
        }
    }

    createImage() {
        this.createGeneral();
        this.createMain();

        this.toggleDemoControlsState(!this.image.general.animated);
        this.updateEditor();
    }

    updateEditor() {
        this.controlsHeightSet();
        this.renderCallback(this.prepareModel(undefined, { singleFrame: true}));
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
    prepareModel(model, params = { singleFrame: false, returnOnlyMain: false }) {
        let that = model || this;
        let i = that.image;
        let e = that.editor;
        let groupMapper = (g) => {
            return {
                ...modelUtils.groupMapper(g),
                changeCallback() {
                    that.updateEditor.bind(that)();
                },
                points: g.points.map((p) => {
                    return {
                        ...modelUtils.pointMapper(p),
                        changeCallback(value, skipEventDispatch = false) {
                            p.point.x = value.x;
                            p.point.y = value.y;

                            let select = g.pointsEl.querySelector('select');
                            if(select){
                                for(let i = 0; i < select.options.length;i++){
                                    select.options[i].selected = select.options[i].value == p.id;
                                    if(select.options[i].selected){
                                        select.options[i].text = `x: ${p.point.x}, y: ${p.point.y}`
                                    }
                                }

                                if(!skipEventDispatch)
                                    select.dispatchEvent(new Event('change'));
                            }
                            
                            g.points.forEach(_p => p.selected = false);
                            p.selected = true;
                        },
                        selectCallback() {
                            let select = g.pointsEl.querySelector('select');
                            if(select){
                                for(let i = 0; i < select.options.length;i++){
                                    select.options[i].selected = select.options[i].value == p.id;
                                }

                                select.dispatchEvent(new CustomEvent('change', { detail: 'skipSelectChangeCallback' }));
                            }
                            
                            g.points.forEach(_p => p.selected = false);
                            p.selected = true;
                        }
                    }
                }),
                addPointCallback(p) {
                    let callback = that.updateEditor.bind(that);
                    
                    if(g.currentPointId == undefined){
                        g.currentPointId = 0;
                    }

                    let nextPointId = `${g.id}_p_${g.currentPointId++}`;
                    while(g.points.filter(p => p.id == nextPointId).length > 0){
                        nextPointId = `${g.id}_p_${g.currentPointId++}`;
                    }

                    g.points.push({
                        id: nextPointId,
                        order: g.points.length,
                        point: {x: p.x, y: p.y},
                    })
                    components.fillPoints(g, that.updateEditor.bind(that))
                    callback();
                }
            }
        }
        let layerMapper = (l) => {
            return {
                ...modelUtils.layerMapper(l),
                groups: l.groups.map(groupMapper),
                move(direction) {
                    let d = new V2(direction);
                    
                    l.groups.forEach(g => {
                        g.points.forEach(p => {
                            p.point = new V2(p.point).add(d).toPlain();
                        })
                    })

                    that.updateEditor.bind(that)();
                },
                changeCallback() {
                    that.updateEditor.bind(that)();
                }
            }
        }
        
        let main = undefined;
        let animated  = i.general.animated;
        if(animated){
            if(params.singleFrame){
                main = {
                    layers: i.main[i.general.currentFrameIndex].layers.map(layerMapper)
                };

                animated = false;
            }
            else {
                main = i.main.map(frame => ({
                    layers: frame.layers.map(layerMapper)
                }))
            } 
        }
        else {
            main = {
                layers: i.main.layers.map(layerMapper)
            }
        }

        let result = {
            editor: {
                mode: e.mode.value
            },
            general: {
                originalSize: new V2(i.general.originalSize),
                size: new V2(i.general.originalSize),
                zoom: i.general.zoom.current,
                showGrid: i.general.showGrid, 
                animated,
                backgroundColor:i.general.backgroundColor
            },
            main
        }

        if(params.returnOnlyMain){
            return main;
        }

        return result;
    }

    importModel(model) {
        let that = this;
        let importMain = (main) => 
            (main.layers.map(
                (l,i) => assignDeep(
                    {}, 
                    modelUtils.createDefaultLayer( `m_${i}`, i),
                    {
                        currentGroupId: l.groups.length
                    }, 
                    {
                        ...l,
                        groups: l.groups.map((g, j) => assignDeep(
                            {},
                            modelUtils.createDefaultGroup(`m_${i}_g_${j}`, j),
                            {
                                currentPointId: g.points.length
                            },
                            {
                                ...g,
                                points: g.points.map((p,k) => assignDeep({}, {
                                    id: `m_${i}_g_${j}_p_${k}`,
                                    order: k,
                                }, p))
                            }
                        ))
                    }
                )
            ));
        
        let image = undefined;
        
        if(isString(model)) {
            image = JSON.parse(model);
        }
        else if(isObject(model)){
            image = model;
        }
        else {
            throw 'importModel -> Wrong model type. '
        }

        image.general.element = that.image.general.element;
        image.general.zoom =  {current: 10, max: 10, min: 1, step: 1};
        // add support of animated property

        if(image.general.animated){
            image.main = image.main.map(f => {
                let frame = { 
                    layers: importMain(f) 
                };
                frame.currentLayerId = frame.layers.length;
                frame.element = that.image.main.element;

                return frame;
            });

            image.general.currentFrameIndex = 0;
        }
        else {
            image.main.currentLayerId = image.main.layers.length;
            image.main.layers = importMain(image.main);
            if(that.image.general.animated){
                image.main.element = that.image.main[0].element;
            }
            else {
                image.main.element = that.image.main.element;
            }
            
        }

        return image;
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

                        // extract to method
                        let image = undefined;
                        try{
                            image = that.importModel(textarea.value); //JSON.parse(textarea.value);
                        }
                        catch(e){
                            alert('Entered value is invalid.\n' + e.message);
                            return;
                        }

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

        let secondaryControlsEl = htmlUtils.createElement('div', { className: 'secondaryControlsBlock' });
        this.demoButton = secondaryControlsEl.appendChild(htmlUtils.createElement('input', { value: 'Demo', attributes: { type: 'button' }, props: { disabled: true }, events: {
            click: function(){
                let model = that.prepareModel()
                let delay = parseInt(that.demoDelayInput.value);
                if(Number.isNaN(delay)){
                    delay = 100;
                }
                model.general.demo = {
                    delay
                }

                that.renderCallback(model);
            }
        }}));

        this.demoDelayInput = secondaryControlsEl.appendChild(htmlUtils.createElement('input', { value: '100', attributes: { type: 'text' }, props: { disabled: true }
        }));

        this.parentElement.appendChild(controlsEl);
        this.parentElement.appendChild(secondaryControlsEl);
    }

    toggleDemoControlsState(disabled = true) {
        this.demoButton.disabled = disabled;
        this.demoDelayInput.disabled = disabled;
    }

    createEditor() {
        let { editor } = this;
        let that = this;
        if(editor.element){
            editor.element.remove();
        }

        let editorlEl = htmlUtils.createElement('div', { className: 'editorBlock' });
        let modeSwitch = htmlUtils.createElement('div', { className: 'modeSwitch' });
        let moveGroup = htmlUtils.createElement('div', { className: 'moveGroup' });

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

        let moveGroupSwitchButton = htmlUtils.createElement('input', { 
            value: 'Toggle move group', 
            attributes: { type: 'button' }, 
            props: {disabled: true},
            events: {
                click: () => {
                    that.editor.mode.toggleMoveGroup();
                    that.updateEditor();
                }
            }
        });

        let moveLayerSwitchButton = htmlUtils.createElement('input', { 
            value: 'Toggle move layer', 
            attributes: { type: 'button' }, 
            props: {disabled: true},
            events: {
                click: () => {
                    that.editor.mode.toggleMoveLayer();
                    that.updateEditor();
                }
            }
        });

        modeSwitch.appendChild(modeSwitchButton);

        moveGroup.appendChild(moveGroupSwitchButton)
        moveGroup.appendChild(moveLayerSwitchButton)

        editorlEl.appendChild(modeSwitch);
        editorlEl.appendChild(moveGroup)
        
        editor.element = editorlEl;
        
        editor.mode.element = modeSwitchButton;
        editor.mode.moveGroupElement = moveGroupSwitchButton;
        editor.mode.moveLayerElement = moveLayerSwitchButton;

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
        
        generalEl.appendChild(components.createColorPicker(general.backgroundColor, 'Bg color', function(color) {
            general.backgroundColor = color;
            this.updateEditor();
        }.bind(this)));
        
        generalEl.appendChild(components.createCheckBox(general.showGrid, 'Show grid', function(value) {
            general.showGrid = value;
            this.updateEditor();
        }.bind(this)));
        generalEl.appendChild(components.createCheckBox(general.animated, 'Animated', function(value) {
            
            if(value){
                this.toggleDemoControlsState(false);
                general.animated = true;
                general.currentFrameIndex = 0;
                this.image.main = [this.image.main];
                this.createMain();
            }
            else {
                if(confirm('Первый фрейм будет преобразован в основное изображение')){
                    this.toggleDemoControlsState(true);
                    general.animated = false;
                    general.currentFrameIndex = undefined;
                    this.image.main = this.image.main[0];
                    this.createMain();
                }
                else {
                    general.animated = true;
                }
            }
            this.updateEditor();
        }.bind(this)));

        general.element = generalEl;
        
        this.parentElement.appendChild(general.element);
    }

    createMain(params = { setFocusToFrames: false }) {
        let { main, general } = this.image;
        let that = this;

        if(general.animated){
            main = main[general.currentFrameIndex];
        }

        if(main.element){
            main.element.remove();
        }

        let mainEl = htmlUtils.createElement('div', { className: 'main' });

        if(general.animated){
            let commonCallback = () => {
                that.editor.setModeState(false, 'edit');
                that.createMain({setFocusToFrames:true});
                that.updateEditor();
            }

            mainEl.appendChild(components.createList({
                title: 'Frames',
                className: 'frames',
                items: this.image.main.map((f, i) => ({ title: 'Frame_' + i, value: i, selected: i == general.currentFrameIndex })),
                noReset: true,
                callbacks: {
                    select: function(e) {
                        general.currentFrameIndex = parseInt(e.target.value);

                        commonCallback();
                    },
                    remove(e, select) {
                        if(that.image.main.length == 1){
                            return;
                        }

                        that.image.main.splice(general.currentFrameIndex, 1)
                        general.currentFrameIndex = 0;

                        commonCallback();
                    },
                    move(select, direction) {
                        let currentIndex = general.currentFrameIndex;
                        if((direction == -1 && currentIndex == 0) || (direction == 1 && currentIndex == that.image.main.length-1))
                            return;

                        components.array_move(that.image.main, currentIndex, currentIndex + direction);
                        general.currentFrameIndex = currentIndex + direction;

                        commonCallback();
                    },
                    add: function(e, select){
                        let currentFrameModel = JSON.stringify(that.prepareModel(undefined, { singleFrame: true }));
                        let newItem = that.importModel(currentFrameModel).main;
                        that.image.main.push(newItem);

                        commonCallback();
                    },
                    changeCallback: that.updateEditor.bind(that)
                },

            }))
        }

        let layersWrapperEl = htmlUtils.createElement('div', { className: 'layersWrapper' });

        layersWrapperEl.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Main image properties' }))
        layersWrapperEl.appendChild(components.createList({
            title: 'Layers',
            className: 'layers',
            items: main.layers.map(l => {return { title: l.name || l.id, value: l.id, selected: l.id == that.editor.selected.layerId }}),
            maxSize: 5,
            callbacks: {
                select: function(e){ 
                    main.layers.forEach(l => l.selected = false);
                    let layer = main.layers.find(l => l.id == e.target.value);
                    layer.selected = true;
                    that.editor.selected.layerId = layer.id;
                    that.editor.setModeState(true, e.detail == 'setModeStateToAdd' ? 'add' : 'edit');

                    let selectedOption = undefined;
                    for(let i = 0; i < e.target.options.length;i++){
                        if(e.target.options[i].value == e.target.value){
                            selectedOption = e.target.options[i];
                            break;
                        }
                    }

                    layer.groups.forEach(g => g.selected = false);
                    components.createLayer(layerEl, layer, that.updateEditor.bind(that), { selectedOption });  

                    that.editor.setMoveLayerModeState(true);
                },
                reset: function(e) { 
                    main.layers.forEach(l => l.selected = false);

                    that.editor.selected.layerId = undefined;
                    that.editor.selected.groupId = undefined;
                    that.editor.selected.pointId = undefined;

                    components.createLayer(layerEl, undefined, that.updateEditor.bind(that)) 
                    that.editor.setModeState(false, 'edit');

                    that.editor.setMoveGroupModeState(false);
                    that.editor.setMoveLayerModeState(false);
                },
                remove(e, select) {
                    if(!confirm('Remove layer?'))
                        return;
                        
                    main.layers = main.layers.filter(l => l.id != select.value);  
                    main.layers.forEach((l, i) => l.order = i);
                    select.options.length = 0;
                    for(let l of main.layers){
                        select.options[select.options.length] = new Option(l.name || l.id, l.id);
                    }
                    select.value = undefined;
                    that.editor.selected.layerId = undefined;
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
                        select.options[select.options.length] = new Option(l.name || l.id, l.id);
                    }

                    select.value = selectedValue;
                    that.updateEditor.call(that);
                },
                add: function(e, select){

                    let nextLayerId = `m_${main.currentLayerId++}`;
                    while(main.layers.filter(g => g.id == nextLayerId).length > 0){
                        nextLayerId = `m_${main.currentLayerId++}`;
                    }

                    main.layers.forEach(l => l.selected = false);

                    let layer = modelUtils.createDefaultLayer(nextLayerId, main.layers.length);

                    layer.selected = true;
                    main.layers.push(layer);
                    select.options[select.options.length] = new Option(layer.id, layer.id);
                    select.value = layer.id;
                    that.editor.selected.layerId = layer.id;
                    select.dispatchEvent(new CustomEvent('change', { detail: 'setModeStateToAdd' }));
                    //that.editor.setModeState(true, 'add');
                },
                changeCallback: that.updateEditor.bind(that)
            }
        }))
        let layerEl = htmlUtils.createElement('div', {className: 'layer'});
        layersWrapperEl.appendChild(layerEl)
        mainEl.appendChild(layersWrapperEl)
        
        if(general.animated){
            that.image.main.forEach(f => f.element = mainEl);
        }
        else {
            main.element = mainEl;
        }
        
        
        this.parentElement.appendChild(main.element);

        if(params.setFocusToFrames && general.animated){
            document.querySelector('.frames select').focus();
        }

        if(that.editor.selected.layerId){
            let selectedLayer = main.layers.filter(l => l.id == that.editor.selected.layerId);
            if(selectedLayer && selectedLayer.length > 0){
                document.querySelector('.layers select').dispatchEvent(new CustomEvent('change'));
            }
        }
    }

    
}