// TODO. Bugs:
// 2. Current palettes list - stored in json
// 4. gradient tool, update, add easings support
// 5. Shift+v - hide just image not layers visibility ?
// 7. Code refactoring. To different files and subfilders
// 10. 'c' shortcut for scene color picker
// 11. Move layer slow moving
// 13. Import model - dublicate palette if already exists
// 14. imput - paddings/old value missing
// 16. Autosave model in localstorage
// 17. Move\copy group to layer




class Editor {
    constructor(options = {}){
        assignDeep(this, {
            controls: {
                savedAs: undefined,
                overlayEl: undefined,
            },
            editor: {
                element: undefined,
                sceneColorPicker: undefined,
                selected: {
                    //selectedFrame: undefined,
                    layerId: undefined,
                    groupId: undefined,
                    pointId: undefined,
                },
                removeSelectedPoint: undefined,
                toggleLayerVisibility: undefined,
                toggleGroupVisibility: undefined,
                panels: {},
                mode: {
                    value: 'edit',
                    element: undefined,
                    moveGroupElement: undefined,
                    moveLayerElement: undefined,
                    stateElement: undefined,
                    setValue(value) {
                        
                        if(this.value == 'colorpick' && value != 'colorpick' && that.editor.panels.colorPicker){
                            that.editor.panels.colorPicker.remove();
                        }

                        if(this.value == 'rotate' && value != 'rotate' && that.editor.panels.rotate){
                            that.editor.panels.rotate.remove();
                        }

                        value = value || this.value;
                        this.value = value
                        let text = '';

                        switch(value){
                            case 'add':
                                text = '"Add points" mode'; break;
                            case 'edit':
                                text = '"Edit points" mode'; break;
                            case 'movegroup':
                                text = '"Move group" mode'; break;
                            case 'colorpick':
                                text = '"Color pick" mode'; break;
                            case 'rotate':
                                text = '"Rotate" mode'; break;
                            case 'selection':
                                text = '"Selection" mode'; break;
                            case 'moveselection':
                                text = '"Move selection" mode'; break;
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
                    },
                    toggleMoveSelection() {
                        this.setValue(this.value == 'moveselection' ? 'edit' : 'moveselection');
                    },
                    toggleColorPicker() {
                        this.setValue(this.value == 'colorpick' ? 'edit' : 'colorpick');
                    },
                    toggleRotate() {
                        this.setValue(this.value == 'rotate' ? 'edit' : 'rotate');
                    },
                    toggleSelection() {
                        this.setValue(this.value == 'selection' ? 'edit' : 'selection');
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
                    renderOptimization: false,
                    animated: false,
                    animatedProps: {
                        framesPreview: {
                            showPrevous: false,
                            showNext: false,
                            onlySelectedLayer: false,
                            onlyGroup: false
                        }
                    },
                    element: undefined,
                    backgroundColor: '#000000',
                    palettes: []
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
            mainGo: undefined,
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

        let that = this;
        components.createDraggablePanel({title: 'utilities', panelClassNames: [ 'utilities'], parent: document.body, position: new V2(20,20), contentItems: [
            htmlUtils.createElement('input', { value: 'Mid',  attributes: { type: 'button' }, events: {
                click: function(){

                    if(that.editor.panels.midColor){
                        that.editor.panels.midColor.remove();
                    }
                    else {
                        that.editor.panels.midColor = components.createDraggablePanel({
                            title: 'Mid color', 
                            parent: document.body, 
                            position: new V2(20,60), 
                            closable: true,
                            expandable: false,
                            contentWidth: 150,
                            onClose: () => { that.editor.panels.midColor = undefined; },
                            contentItems: [
                                components.createMidColor()
                            ]
                        });
                    }
                    
                }
            } }),
            htmlUtils.createElement('input', { value: 'CPick',  attributes: { type: 'button' }, events: {
                click: function(){

                    if(that.editor.panels.colorPicker){
                        that.editor.panels.colorPicker.remove();
                    }
                    else {
                        that.editor.mode.toggleColorPicker();
                        that.updateEditor();
    
                        let cp = components.createDraggablePanel({
                            title: 'C picker', 
                            parent: document.body, 
                            position: new V2(40,60), 
                            closable: true,
                            expandable: false,
                            contentWidth: 150,
                            onClose: () => { 
                                that.editor.panels.colorPicker = undefined;
                                that.editor.mode.toggleColorPicker();
                                that.updateEditor();
                             },
                            contentItems: [
                                components.createSceneColorPicker()
                            ]
                        });

                        that.editor.panels.colorPicker = cp;

                        cp.setValue = (value) => {
                            cp.contentItems[0].setValue(value);
                        }
                    }
                }
            } }),
            htmlUtils.createElement('input', { value: 'CShift',  attributes: { type: 'button' }, events: {
                click: function(){
                    if(that.editor.panels.cShift){
                        that.editor.panels.cShift.remove();
                        return;
                    }

                    that.editor.panels.cShift = components.createDraggablePanel({
                        title: 'C shift', 
                        parent: document.body, 
                        position: new V2(80,60), 
                        closable: true,
                        expandable: false,
                        contentWidth: 150,
                        onClose: () => { that.editor.panels.cShift = undefined; },
                        contentItems: [
                            components.createCShift()
                        ]
                    });


                }
            } }),
            htmlUtils.createElement('input', { value: 'Rotate',  attributes: { type: 'button' }, events: {
                click: function() {
                    if(that.editor.panels.rotate){
                        that.editor.panels.rotate.remove();
                        return;
                    }

                    if(that.editor.selected.groupId == undefined){
                        alert('No group selected!');
                        return;
                    }

                    let layer = undefined;

                    if(that.image.general.animated){
                        layer = that.image.main[that.image.general.currentFrameIndex].layers.filter(l => l.id == that.editor.selected.layerId)[0];
                    }
                    else {
                        layer = that.image.main.layers.filter(l => l.id == that.editor.selected.layerId)[0];
                    }

                    
                    let group = layer.groups.filter(g => g.id == that.editor.selected.groupId)[0];
                    
                    if(group.points.length < 2){
                        alert('Current group has to few points!');
                        return;
                    }

                    
                    let allX = group.points.map(p => p.point.x);
                    let allY = group.points.map(p => p.point.y);
                    let minX = Math.min.apply(null, allX);
                    let maxX = Math.max.apply(null, allX);
                    let minY = Math.min.apply(null, allY);
                    let maxY = Math.max.apply(null, allY);
                    let rotationOrigin = new V2((minX+maxX)/2, (minY+maxY)/2).toInt();

                    
                    that.editor.mode.toggleRotate();
                    that.updateEditor();

                    let rDemo = undefined;
                    let angleChangeCallback = (angle, origin) => {
                        rDemo.createImage(angle, origin);
                    }

                    let rotate = components.createDraggablePanel({
                        title: 'Rotate', 
                        parent: document.body, 
                        position: new V2(80,60), 
                        closable: true,
                        expandable: false,
                        contentWidth: 220,
                        onClose: () => { 
                            that.editor.panels.rotate = undefined;
                            that.mainGo.removeChild(that.mainGo.rDemo);
                            that.editor.mode.toggleRotate();
                            that.updateEditor();
                            
                        },
                        onCreate: () => {
                            //console.log(that.mainGo)
                            that.mainGo.rDemo = that.mainGo.addChild(new GO({
                                position: new V2(),
                                size: that.mainGo.size.clone(),
                                init() {
                                    let groupMapped = modelUtils.groupMapper(group, true);
                                    this.originPoints = groupMapped.points;
                                    let size = new V2(that.image.general.originalSize);

                                    this.rotationOrigin = rotationOrigin;
                                    this.model = {
                                        general: {
                                            size
                                        },
                                        main: {
                                            layers: [
                                                {
                                                    visible: true,
                                                    groups: [
                                                        {
                                                            ...groupMapped,
                                                            points: this.originPoints,
                                                            strokeColor: 'rgba(255,255,255,0.75)',
                                                            fillColor: 'rgba(255,255,255,0.5)',
                                                            visible: true
                                                        },
                                                        {
                                                            strokeColor: 'rgba(0,255,0,0.5)',
                                                            visible: true,
                                                            type: 'dots',
                                                            points: [{
                                                                point: this.rotationOrigin
                                                            }]
                                                        },
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                    
                                    this.createImage(0);
                                    
                                },
                                createImage(angle, rotationOrigin) {
                                    if(rotationOrigin){
                                        this.rotationOrigin = rotationOrigin;

                                        this.model.main.layers[0].groups[1].points[0].point = this.rotationOrigin;
                                    }

                                    if(angle != undefined){
                                        this.angle = angle;
                                    }
                                    
                                    this.model.main.layers[0].groups[0].points = 
                                        this.originPoints.map(p => {
                                            return {
                                                ...p,
                                                point: new V2(p.point).substract(this.rotationOrigin, true).rotate(this.angle, false, true).add(this.rotationOrigin, true).toInt(true)
                                            };
                                        })

                                    this.img = PP.createImage(this.model)
                                },
                                getCurrentPoints() {
                                    return this.model.main.layers[0].groups[0].points;
                                }
                            }));

                            rDemo = that.mainGo.rDemo;
                        },
                        contentItems: [
                            components.createRotationControl(angleChangeCallback, rotationOrigin, () => {
                                layer.removeImage();
                                let callback = () => {  
                                    //console.log('createRotationControl'); 
                                    layer.removeImage(); 
                                    that.updateEditor.call(that); 
                                };
                                
                                let currentPoints = rDemo.getCurrentPoints();
                                currentPoints.forEach((modifiedPoint,i) => {
                                    //group.points[i].point = p.toPlain();
                                    group.points.filter(targetPoint => targetPoint.id == modifiedPoint.id)[0].point = modifiedPoint.point;
                                });

                                components.fillPoints(group, callback)
                                that.updateEditor();
                            })
                        ]
                    });

                    that.editor.panels.rotate = rotate;
                }
            }})
        ]});
        //createDraggablePanel({title: 'closable', parent: document.body, position: new V2(20,60), closable: true});
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
        if(this.editor.panels.rotate){
            this.editor.panels.rotate.remove();
        }

        this.controlsHeightSet();
        this.renderCallback(this.prepareModel(undefined, { singleFrame: true}));
    }

    exportModel(pretty, clean) {
        let model = JSON.stringify(this.prepareModel(undefined, {ignoreVisibility: true}), (k,v) => {
            if(k == 'editor' || k == 'selected' || k=='layerImage')
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
    prepareModel(model, params = { singleFrame: false, returnOnlyMain: false, ignoreVisibility: false }) {
        let that = model || this;
        let i = that.image;
        let e = that.editor;

        let ignoreVisibility = !i.general.renderOptimization;

        if(params.ignoreVisibility){
            ignoreVisibility = true;
        }

        let groupMapper = (g, layer) => {
            return {
                ...modelUtils.groupMapper(g),
                changeCallback() {
                    layer.removeImage();
                    that.updateEditor.bind(that)();
                },
                points: g.points.map((p) => {
                    return {
                        ...modelUtils.pointMapper(p),
                        changeCallback(value, skipEventDispatch = false) {
                            layer.removeImage();

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
                            }

                            g.points.forEach(_p => _p.selected = false);
                            p.selected = true;

                            if(!skipEventDispatch){
                                that.updateEditor.bind(that)();
                            }
                                
                        },
                        selectCallback() {
                            let select = g.pointsEl.querySelector('select');
                            if(select){
                                for(let i = 0; i < select.options.length;i++){
                                    select.options[i].selected = select.options[i].value == p.id;
                                }

                                select.dispatchEvent(new CustomEvent('change', { detail: 'skipSelectChangeCallback' }));
                            }
                            else {
                                e.selected.pointId = p.id;
                                e.removeSelectedPoint = () => {
                                    layer.removeImage();
                                    g.points = g.points.filter(gp => gp.id != p.id);  
                                    g.points.forEach((p, i) => {p.order = i; p.selected = false});
                                    that.updateEditor.bind(that)();
                                };
                            }
                            
                            g.points.forEach(_p => _p.selected = false);
                            p.selected = true;
                        }
                    }
                }),
                addPointCallback(p) {
                    let callback = () => {  
                        //console.log('addPointCallback'); 
                        layer.removeImage(); 
                        that.updateEditor.call(that); 
                    };
                    
                    //layer.removeImage();

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

                    components.fillPoints(g, callback);

                    callback();
                },
                addPointsCallback(points) {
                    if(!points || points.lenght == 0)
                        return;

                    layer.removeImage();

                    let callback = () => {  
                        //console.log('addPointCallback'); 
                        layer.removeImage(); 
                        that.updateEditor.call(that); 
                    };

                    if(g.currentPointId == undefined){
                        g.currentPointId = 0;
                    }

                    for(let i = 0; i< points.length; i++){
                        let p = points[i];
                        let nextPointId = `${g.id}_p_${g.currentPointId++}`;
                        while(g.points.filter(p => p.id == nextPointId).length > 0){
                            nextPointId = `${g.id}_p_${g.currentPointId++}`;
                        }

                        g.points.push({
                            id: nextPointId,
                            order: g.points.length,
                            point: {x: p.x, y: p.y},
                        })
                    }

                    components.fillPoints(g, callback)
                    callback();
                }
            }
        }
        let layerMapper = (l) => {
            return {
                ...modelUtils.layerMapper(l),
                groups: l.groups.filter(g => (ignoreVisibility ? true : g.visible)).map(g => groupMapper(g, l)),
                move(direction) {
                    l.removeImage();
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
                },
                layerImageCreatedCallback(img){
                    l.layerImage = img;
                }
            }
        }
        
        let main = undefined;
        let animated  = i.general.animated;

        if(animated){
            if(params.singleFrame){
                main = {
                    layers: i.main[i.general.currentFrameIndex].layers.filter(l => (ignoreVisibility ? true : l.visible)).map(layerMapper)
                };

                animated = false;
            }
            else {
                main = i.main.map(frame => ({
                    layers: frame.layers.filter(l => (ignoreVisibility ? true : l.visible)).map(layerMapper)
                }))
            } 
        }
        else {
            main = {
                layers: i.main.layers.filter(l => (ignoreVisibility ? true : l.visible)).map(layerMapper)
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
                renderOptimization: i.general.renderOptimization,
                animated,
                backgroundColor:i.general.backgroundColor,
                palettes: i.general.palettes.map(palette => modelUtils.paletteMapper(palette, true))
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

        if(image.general.animatedProps == undefined){
            image.general.animatedProps = {
                framesPreview: {
                    showPrevous: false,
                    showNext: false,
                    onlySelectedLayer: false,
                    onlyGroup: false
                }
            }
        }

        if(image.general.palettes == undefined){
            image.general.palettes = [];
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
                let pretty = false;
                let clean = true;
                that.controls.overlayEl = htmlUtils.createElement('div', { className: 'overlay' });
                let containerEl = htmlUtils.createElement('div', { classNames: ['content', 'export'] });
                let textarea = htmlUtils.createElement('textarea', {
                    value: that.exportModel(pretty, clean),
                    attributes: {
                        resize: false,
                        readonly: 'readonly'
                    }
                });

                containerEl.appendChild(components.createCheckBox(pretty, 'Pretty', (value) => {
                    pretty = value;
                    textarea.value = that.exportModel(value, clean);
                }))

                containerEl.appendChild(components.createCheckBox(clean, 'Clean', (value) => {
                    clean = value;
                    textarea.value = that.exportModel(pretty, value);
                }))

                containerEl.appendChild(components.createButton('Copy', (event) => {
                    textarea.focus();
                    textarea.select();

                    try {
                        var successful = document.execCommand('copy');
                        if(!successful){
                            notifications.add({message: 'Export json copying was not successful', type: notifications.types.error, position: notifications.positions.tc})
                        }

                        //notifications.add({message: 'Export json was successful', type: notifications.types.done, position: notifications.positions.tc, autoHide: 1000})
                        notifications.done('Export json was successful', 1000);
                        //alert('Copied' + (successful ? '' : 'NOT') + 'successfully' );

                    } catch (err) {
                        notifications.add({message: 'Failed to copy to clipboard', type: notifications.types.error, position: notifications.positions.tc})
                    //alert('Failed to copy to clipboard');
                    }
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

        paletteHelper.init(this, general.palettes);
        
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

        generalEl.appendChild(components.createCheckBox(general.renderOptimization, 'Render optimization', function(value) {
            general.renderOptimization = value;
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

                        // let model = JSON.stringify(this.prepareModel(undefined, {ignoreVisibility: true}), (k,v) => {
                        //     if(k == 'editor' || k == 'selected' || k=='layerImage')
                        //         return undefined;
                            
                        //     return v;
                        // }, pretty? 4: null);

                        let currentFrameModel = JSON.stringify(that.prepareModel(undefined, { singleFrame: true }), (k,v) => {
                            if(k=='layerImage')
                                return undefined;
                            
                            return v;
                        });
                        let newItem = that.importModel(currentFrameModel).main;
                        that.image.main.push(newItem);

                        commonCallback();
                    },
                    changeCallback: that.updateEditor.bind(that)
                },

            }))

            mainEl.appendChild(components.framesPreview.create(that));
        }

        let layersWrapperEl = htmlUtils.createElement('div', { className: 'layersWrapper' });

        layersWrapperEl.appendChild(htmlUtils.createElement('div', { className: 'title', text: 'Main image properties' }))
        layersWrapperEl.appendChild(components.createList({
            title: 'Layers',
            className: 'layers',
            items: main.layers.map(l => {return { title: l.name || l.id, value: l.id, selected: l.id == that.editor.selected.layerId }}),
            maxSize: 5,
            buttons: [
                {
                    text: 'Clone',
                    click: (select) => {
                        let { layerId } = components.editor.editor.selected;

                        if(layerId == undefined){
                            alert('No layers selected!')
                            return;
                        }

                        let selectedLayer = main.layers.find(l => l.id == layerId);
                        if(!selectedLayer){
                            alert(`Layer ${layerId} not found!`)
                            return;
                        }

                        let nextLayerId = `m_${main.currentLayerId++}`;
                        while(main.layers.filter(g => g.id == nextLayerId).length > 0){
                            nextLayerId = `m_${main.currentLayerId++}`;
                        }

                        main.layers.forEach(l => l.selected = false);
                        
                        let lCloned = assignDeep(
                            {},
                            modelUtils.createDefaultLayer(nextLayerId, main.layers.length),
                            modelUtils.layerMapper(selectedLayer)
                        )

                        lCloned.id = nextLayerId;
                        lCloned.visible = true;
                        lCloned.order = main.layers.length;
                        lCloned.name = (selectedLayer.name || selectedLayer.id) + '_cloned';
                        lCloned.selected = true;
                        lCloned.removeImage();

                        lCloned.groups = selectedLayer.groups.map(g => assignDeep(
                            {},
                            modelUtils.createDefaultGroup(g.id, g.order), 
                            modelUtils.groupMapper(g, true)));

                        
                        main.layers.push(lCloned);
                        select.options[select.options.length] = new Option(lCloned.name, lCloned.id);
                        select.value = lCloned.id;
                        
                        that.editor.selected.layerId = lCloned.id;
                        that.editor.selected.groupId = undefined;
                        that.editor.selected.pointId = undefined;

                        select.dispatchEvent(new CustomEvent('change', { detail: 'setModeStateToAdd' }));
                    }
                }
            ],
            callbacks: {
                select: function(e){ 
                    main.layers.forEach(l => l.selected = false);
                    let layer = main.layers.find(l => l.id == e.target.value);
                    layer.selected = true;

                    that.editor.selected.layerId = layer.id;
                    if(e.detail != undefined && e.detail == 'keepSelectedGroup'){

                    }
                    else {
                        that.editor.selected.groupId = undefined;
                        that.editor.selected.pointId = undefined;
                    }
                    

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

                    that.updateEditor.call(that);
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
                    that.editor.selected.groupId = undefined;
                    that.editor.selected.pointId = undefined;

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
                    that.editor.selected.groupId = undefined;
                    that.editor.selected.pointId = undefined;

                    select.dispatchEvent(new CustomEvent('change'));
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
                let eventParams = undefined;
                if(params.setFocusToFrames){
                    eventParams = {
                        detail: 'keepSelectedGroup'
                    }
                }
                document.querySelector('.layers select').dispatchEvent(new CustomEvent('change', eventParams));
            }
        }
    }

    
}