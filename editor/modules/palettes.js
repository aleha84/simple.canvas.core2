var paletteHelper = {
    editorContext: undefined,
    palettes: [],
    itemPanels: [],

    init(editorContext, palettes) {
        this.palettes = palettes;
        this.editorContext = editorContext;

        let panels = editorContext.editor.panels;

        if(panels.palettes){
            panels.palettes.remove()
        }

        var itemsContainer = htmlUtils.createElement('div', { className: 'itemsContainer' });

        this.itemsContainerEl = itemsContainer;

        palettes.forEach(palette => {
            this.addItem(palette);
        });
        
        var buttonsBlock = htmlUtils.createElement('div', { className: 'buttonsBlock' });
        htmlUtils.appendChild(buttonsBlock, 
            [htmlUtils.createElement('input', { value: 'add', attributes: { type: 'button' }, events: {
                click: () => {
                    this.addItem(modelUtils.createDefaultPalette())
                }
            } }),
            htmlUtils.createElement('input', { value: 'Close panels', attributes: { type: 'button' }, events: {
                click: () => {
                    while(this.itemPanels.length){
                        this.itemPanels[0].remove();
                    }

                    this.lastItemPanelPosition = undefined;
                    this.itemPanels = [];
                }
            } })
        ]
        );

        panels.palettes = components.createDraggablePanel({title: 'palettes', panelClassNames: [ 'palettes'], parent: document.body, position: new V2(250,20), contentItems: [
            itemsContainer,
            buttonsBlock
        ]});

        
    },
    addPaletteItem(paletteItem, paletteEl) {
        let palette = paletteEl.paletteItems;

        let itemEl = htmlUtils.createElement('div', { className: 'paletteItem', events: {
            click: (event) => {

                if(paletteItem.panel) {
                    paletteItem.panel.remove();
                    this.itemPanels = this.itemPanels.filter(p => p != paletteItem.panel);
                    paletteItem.panel = undefined;

                    return;
                }

                let p = new V2(event.clientX,event.clientY);
                if(this.itemPanels.length){
                    let lastPanel = this.itemPanels[this.itemPanels.length-1].panel;
                    p = new V2(lastPanel.offsetLeft, lastPanel.offsetTop)
                }

                p.add(new V2(20,30), true);

                let panel = components.createDraggablePanel({title: paletteItem.color, closable: true, expandable: false, panelClassNames: [ 'paletteItem'], 
                parent: document.body, position: new V2(p), 
                onClose: () => {
                    paletteItem.panel = undefined;
                    let indexToDelete = this.itemPanels.indexOf(panel);
                    if(indexToDelete!= -1){
                        this.itemPanels.splice(indexToDelete, 1);
                    }
                },
                contentItems: [
                    htmlUtils.createElement('div', { className: 'rowFlex', children: [
                        htmlUtils.createElement('div', { className: 'color', styles: {backgroundColor: paletteItem.color} }),
                        htmlUtils.createElement('div', { text: paletteItem.color })
                    ] })
                ]});

                paletteItem.panel = panel;

                this.itemPanels[this.itemPanels.length] = panel;
            }
        } });

        itemEl.paletteItem = paletteItem;
        itemEl.style.backgroundColor = paletteItem.color;

        if(palette.indexOf(paletteItem) == -1)
            palette.push(paletteItem);

        htmlUtils.appendChild(paletteEl, itemEl);
    },
    addItem(palette) {
        let itemWrapper = htmlUtils.createElement('div', { classNames: ['itemWrapper', 'rowFlex'] });
        itemWrapper.palette = palette;

        let nameElement = components.createInput(palette.name, 'Name', (value) => {
            palette.name = value;

            console.log(this.palettes)
        })

        let paletteEl = htmlUtils.createElement('div', { classNames: ['palette', 'rowFlex'] });
        //palette.paletteEl = paletteEl;
        paletteEl.paletteItems = palette.items;

        palette.items.forEach(item => {
            this.addPaletteItem(item, paletteEl);
        })

        let buttonsBlock = htmlUtils.createElement('div', { classNames: ['buttonBlock', 'rowFlex'] });

        let addNewItemWrapper = htmlUtils.createElement('div', { classNames: ['addNewItemWrapper', 'rowFlex'] });
        let input = //htmlUtils.createElement('input', { className: 'itemValue', value: '#' })
            components.createColorPicker('#FFFFFF', '', () => { })

        let addButton = htmlUtils.createElement('input', { value: 'add', attributes: { type: 'button' }, events: {
            click: () => {
                // let match = /^#*([0-9A-F]{6})$/i.exec(input.value);
                // if(match){
                //     this.addPaletteItem(modelUtils.createDefaultPaletteItem('#' + match), paletteEl);
                // }

                this.addPaletteItem(modelUtils.createDefaultPaletteItem(input.getValue()), paletteEl)

                // if(/^#[0-9A-F]{6}$/i.test(input.value)){
                //     this.addPaletteItem(modelUtils.createDefaultPaletteItem(input.value), paletteEl);
                // }
                
                input.setValue('#FFFFFF');
            }
        }});

        htmlUtils.appendChild(addNewItemWrapper, [input, addButton])

        htmlUtils.appendChild(buttonsBlock, 
            [
                htmlUtils.createElement('input', { value: 'X', classNames: ['removeButton'], attributes: { type: 'button' }, events: {
                    click: () => {
                        this.removeItem(itemWrapper);
                    }
                } }),
                addNewItemWrapper
            ]
        );

        htmlUtils.appendChild(itemWrapper, [nameElement, paletteEl, buttonsBlock]);

        htmlUtils.appendChild(this.itemsContainerEl, itemWrapper)

        if(this.palettes.indexOf(palette) == -1)
            this.palettes.push(palette);

        console.log(this.palettes)

        return itemWrapper;
    },
    removeItem(itemWrapper) {
        if(!confirm('Delete?'))
            return;

        let palette = itemWrapper.palette;

        if(palette){
            let indexToDelete = this.palettes.indexOf(palette);
            if(indexToDelete != -1){
                this.palettes.splice(indexToDelete, 1);
            }
        }

        itemWrapper.remove();

        console.log(this.palettes)
    }
}