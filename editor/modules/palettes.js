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
        
        let buttonsBlock = htmlUtils.createElement('div', { className: 'buttonsBlock' });

        let generateWrapper = htmlUtils.createElement('div');
        let that = this;
        htmlUtils.appendChild(generateWrapper, [
            htmlUtils.createElement('input', { value: 'Generate', className: 'generatePalette', attributes: { type: 'button' }, events: {
                click: function(e) {
                    let val = parseInt(e.target.parentNode.querySelector('.generatePaletteThreshold').value)
                    if(isNaN(val) || val <= 0){
                        notifications.error('Wrong value', 2000);
                        return;
                    }

                    that.generatePalette({threshold: val});
                }
            } }),
            htmlUtils.createElement('input', { value: 10, attributes: { type: 'number' }, styles: { width: "30px" },className: 'generatePaletteThreshold', events: {
                change: function(e) { 
                    let val = parseInt(e.target.value)
                    if(isNaN(val) || val <= 0){
                        notifications.error('Wrong value', 2000);
                        return;
                    }

                    that.generatePalette({threshold: val}); 
                }
            } }),
        ]);

        htmlUtils.appendChild(buttonsBlock, 
            [
                htmlUtils.createElement('input', { value: 'add', attributes: { type: 'button' }, events: {
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
                } }),
                generateWrapper
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
    },
    generatePalette({ threshold = 10, hexData, rgbData, layerName, position } = {}) {

        let hueGroups = [];
        let hueThreshhold = threshold;

        let colorsCache = [];
        let total = 0;

        let eDistance3 = (a,b) => Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2)+Math.pow(a[2]-b[2],2))
        let eDistance2 = (a,b) => Math.sqrt(Math.pow(a[0]-b[0],2)+Math.pow(a[1]-b[1],2))

        let rgbToHex = (rgb) => {
            //let key = rgb[0]*1000000 + rgb[1]*1000 + rgb[2];
            let hsv = colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hsv' })
            let key = hsv.h * 1000000 + hsv.s * 1000 + hsv.v; //hsv.h * 1000000 + hsv.s * 1000 + hsv.v;

            let cornerColor = [255,255,255]
            let cornerColorHsv = colors.colorTypeConverter({ value: cornerColor, fromType: 'rgb', toType: 'hsv' })
            let cornerColorLab = xyzToLab(rgbToXyz(cornerColor))
            if (!colorsCache[key]) {
                let lab = xyzToLab(rgbToXyz(rgb))
                colorsCache[key] = {
                    hex: colors.colorTypeConverter({ value: rgb, fromType: 'rgb', toType: 'hex' }),
                    rgb,
                    hsv,
                    hsvAverage: (hsv.h + hsv.s + hsv.v) / 3,
                    hsvSum: hsv.h + hsv.s + hsv.v,
                    distanceCornerColor: 0.3*Math.pow(cornerColor[0]-rgb[0],2)+0.59*Math.pow(cornerColor[1]-rgb[1],2)+0.11*Math.pow(cornerColor[2]-rgb[2],2),
                    labDistance: eDistance3(cornerColorLab, lab),
                    rgbDistance: eDistance3(cornerColor, rgb),
                    hsvDistance: eDistance3(cornerColorHsv, [hsv.h, hsv.s, hsv.v])
                }

                let hueFound = false;            
                for(let hueSat of Object.keys(hueGroups)) {
                    let hueSatParts = hueSat.split('_').map(x => parseInt(x));
                    if(Math.abs(eDistance2([hsv.h, hsv.s], hueSatParts)) < hueThreshhold && !hueGroups[hueSat].find(c => c.hsv.h == hsv.h && c.hsv.s == hsv.s && c.hsv.v == hsv.v )) {
                        hueGroups[hueSat].push({hsv,rgb});
                        hueFound = true;
                        break;
                    }
                }

                if(!hueFound){
                    hueGroups[hsv.h + '_' + hsv.s] = [{hsv, rgb}];
                }

                total++;
            }

            return colorsCache[key];
        }

        if(hexData && hexData.length > 0) {
            hexData.forEach(hex => rgbToHex(colors.colorTypeConverter({ value: hex, fromType: 'hex', toType: 'rgb' })))
        }

        let main = this.editorContext.image.main;
        
        if(this.editorContext.image.general.animated) {
            main = this.editorContext.image.main[this.editorContext.image.general.currentFrameIndex];
        }

        if(rgbData && rgbData.length > 0) {
            rgbData.forEach(rgb => rgbToHex(rgb))
        }
        else {
            let img = PP.createImage(this.editorContext.prepareModel(), { exclude: ['generated'] });
            
            if(this.editorContext.image.general.animated) {
                img = img[this.editorContext.image.general.currentFrameIndex]
            }

            let pixels = getPixels(img, this.editorContext.mainGo.originalSize)
            //getPixels(this.editorContext.mainGo.img, this.editorContext.mainGo.originalSize);
            // console.log(this);

            if (pixels.length == 0) {
                notifications.error('No non transparent points on canvas', 2000);
                return;
            }

            // let y = fast.f(key);
            // let x = key%15;

            pixels.forEach(pd => {
                if (pd.color[3] != 1)
                    return;

                rgbToHex(pd.color)
            })
        }
        

        

        let generatedLayerId = `generated`;
        if(layerName) {
            generatedLayerId = layerName;
        }

        main.layers.forEach(l => l.selected = false);

        let layer = main.layers.find(l => l.id == generatedLayerId);
        if(!layer) {
            layer = modelUtils.createDefaultLayer(generatedLayerId, main.layers.length);
            layer.selected = true;
            main.layers.push(layer);
        }
        else {
            layer.removeImage();
        }

        layer.groups = [];

        let colorItemSize = new V2(3,3);
        let shift = new V2(0,0);
        if(position)
            shift = position;

        let itemsShift = new V2(1,1)
        let rowSize = fast.r(total*0.2);
        if(rowSize == 0)
            rowSize = 1;

        if(rowSize*colorItemSize.x > this.editorContext.mainGo.originalSize.x/2) {
            rowSize = fast.r((this.editorContext.mainGo.originalSize.x/2)/colorItemSize.x);
        }

        let totalRows = fast.f(total/rowSize);
        let boxSize = new V2((rowSize*colorItemSize.x+itemsShift.x*2) - 1, (totalRows*colorItemSize.y + itemsShift.y*2) - 1)
        
        let g = modelUtils.createDefaultGroup(generatedLayerId + '_g_0', 0);
        g.type = 'lines';
        g.fill = true;
        g.closePath = true;
        g.points = [shift.clone(), shift.add(new V2(boxSize.x, 0)), shift.add(boxSize), shift.add(new V2(0, boxSize.y))].map((p, i) => ({
            point: p, 
            order: i,
            selected: false,
            id: generatedLayerId + '_g_0' + '_p' + i
        }))

        layer.groups.push(g)

        let gi = 1;
        let kv = Object.entries(colorsCache).sort((a,b) => a[1].labDistance - b[1].labDistance);
        
        //.map(kv => kv[1]).sort((a, b) => a.hsvAverage - b.hsvAverage);
            //.sort((a, b) => a[1].hsvSum - b[1].hsvSum)

        for(let hueGroupKey of Object.keys(hueGroups)) {
        //for(let hueGroup of hueGroups) {
            let hueGroup = hueGroups[hueGroupKey];
            if(hueGroup == undefined) continue;
            let clrs = hueGroup.sort((a,b) => a.hsv.v - b.hsv.v);

            for(let clr of clrs) {
                let gItem = modelUtils.createDefaultGroup(generatedLayerId + '_g_' + gi, gi);
                gItem.type = 'lines';
                gItem.fill = true;
                gItem.closePath = true;
    
                let hex = colors.colorTypeConverter({ value: clr.rgb, fromType: 'rgb', toType: 'hex' })
    
                gItem.strokeColor = hex
                gItem.fillColor = hex
    
                let itemLeftCorner = new V2(colorItemSize.x*((gi-1)%rowSize), colorItemSize.y*fast.f((gi-1)/rowSize))
                    .add(shift).add(itemsShift)
    
                gItem.points = [itemLeftCorner, itemLeftCorner.add(new V2(colorItemSize.x-1, 0)), itemLeftCorner.add(new V2(colorItemSize.x-1, colorItemSize.y-1)), itemLeftCorner.add(new V2(0, colorItemSize.y-1))].map((p, i) => ({
                    point: p, 
                    order: i,
                    selected: false,
                    id: generatedLayerId + '_g_' + gi + '_p' + i
                }))
    
                layer.groups.push(gItem)
    
                gi++
            }
            
        }

        // for(let i = 0; i<kv.length;i++) {
        //     let gItem = modelUtils.createDefaultGroup(generatedLayerId + '_g_' + gi, gi);
        //     gItem.type = 'lines';
        //     gItem.fill = true;
        //     gItem.closePath = true;

        //     gItem.strokeColor = kv[i][1].hex//kv[i][1];
        //     gItem.fillColor = kv[i][1].hex//kv[i][1]

        //     let itemLeftCorner = new V2(colorItemSize.x*((gi-1)%rowSize), colorItemSize.y*fast.f((gi-1)/rowSize))
        //         .add(shift).add(itemsShift)

        //     gItem.points = [itemLeftCorner, itemLeftCorner.add(new V2(colorItemSize.x-1, 0)), itemLeftCorner.add(new V2(colorItemSize.x-1, colorItemSize.y-1)), itemLeftCorner.add(new V2(0, colorItemSize.y-1))].map((p, i) => ({
        //         point: p, 
        //         order: i,
        //         selected: false,
        //         id: generatedLayerId + '_g_' + gi + '_p' + i
        //     }))

        //     layer.groups.push(gItem)

        //     gi++
        // }

        this.editorContext.editor.selected.layerId = generatedLayerId;
        this.editorContext.createMain();
        // this.editorContext.updateEditor();

        // let canvas = createCanvas(new V2(15,51).mul(colorSize), (ctx, size, hlp) => {
            


        //     // let i = 0;
        //     // for(let r = 0; r <=255;r++) {
        //     //     for(let g = 0; g <=255;g++) {
        //     //         for(let b = 0; b <=255;b++) {
        //     //             let key = i//r*1000000 + g*1000 + b;
        //     //             let y = fast.f(i/rowSize);
        //     //             let x = key%rowSize;

        //     //             hlp.setFillColor(colors.colorTypeConverter({ value: [r,g,b], fromType: 'rgb', toType: 'hex' })).rect(x*colorSize,y*colorSize,colorSize,colorSize);
        //     //             i++;
        //     //             // colorsLine[key] = rgbToHex([r,g,b], key)
        //     //         }
        //     //     }
        //     // }
        // })

        // let dataUrl = canvas.toDataURL();
        // let img = htmlUtils.createElement('img');
        // img.src = dataUrl;
        // let panel = components.createDraggablePanel({title: 'Generated palette', closable: true, expandable: false, parent: document.body, position: new V2(250,50), 
        // contentItems: [
        //     img
        // ]})
        
    }
}